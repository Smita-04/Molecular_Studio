const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.exploreCompound = functions.https.onRequest(async (req, res) => {
    // 1. CORS Headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(204).send('');

    // 2. ULTRA-LAZY IMPORTS
    const axios = require('axios');
    const { VertexAI } = require('@google-cloud/vertexai');

    // 3. TEACHER DICTIONARY
    const COMMON_NAMES = {
        "dna": "1BNA",
        "rna": "1RNA",
        "hemoglobin": "4HHB",
        "myoglobin": "1MBN",
        "insulin": "3I40",
        "covid": "6LU7",
        "virus": "4OPA",
        // Force specific salts to PDB if available, otherwise PubChem handles them
        "diamond": "1DMD",
        // --- NEW PLASTICS & POLYMERS (Teaching Models) ---
        "polythene": "pentacontane",     // C50 chain (Model of PE)
        "polyethylene": "pentacontane",  // C50 chain
        "plastic": "pentacontane",       // C50 chain
        "nylon": "nylon 6",              // Nylon monomer
        "polyester": "poly(ethylene terephthalate)", // PET
        "diamond": "1DMD",
    };

    let rawInput = req.body.compoundIdentifier || "";
    let identifier = rawInput.toLowerCase().trim();

    if (!identifier) return res.status(400).json({ success: false, message: 'Missing name' });

    try {
        let result = null;

        // --- STRATEGY 1: DICTIONARY ---
        if (COMMON_NAMES[identifier]) {
            const mappedId = COMMON_NAMES[identifier];
            if (mappedId.length === 4) {
                try {
                    const fileUrl = `https://files.rcsb.org/download/${mappedId}.pdb`;
                    const fileRes = await axios.get(fileUrl);
                    result = {
                        success: true,
                        type: 'pdb',
                        name: rawInput,
                        data: fileRes.data,
                        info: { formula: "Macromolecule", weight: "Variable", atoms: "Many" }
                    };
                } catch (e) {}
            } else {
                identifier = mappedId;
            }
        }

        // --- STRATEGY 2: PUBCHEM (THE UNIVERSAL FIX) ---
        if (!result) {
            try {
                // A. Find ID
                const searchUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(identifier)}/JSON`;
                const searchRes = await axios.get(searchUrl);
                
                if (searchRes.data.PC_Compounds) {
                    const cid = searchRes.data.PC_Compounds[0].id.id.cid;
                    
                    // B. Get Properties
                    const propsRes = await axios.get(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula,MolecularWeight,HeavyAtomCount/JSON`);
                    const props = propsRes.data.PropertyTable.Properties[0];

                    // C. Get Structure (TRY 3D -> FALLBACK TO 2D)
                    let sdfData = null;
                    try {
                        // Try fetching the Computed 3D Model
                        const sdf3d = await axios.get(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF?record_type=3d`);
                        sdfData = sdf3d.data;
                    } catch (e) {
                        // FAILED? (Happens for Na2O, NaCl, etc.)
                        // FETCH 2D INSTEAD!
                        console.log(`3D missing for ${identifier}, fetching 2D...`);
                        const sdf2d = await axios.get(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF`);
                        sdfData = sdf2d.data;
                    }

                    result = {
                        success: true,
                        type: 'sdf',
                        name: identifier,
                        data: sdfData,
                        info: {
                            formula: props.MolecularFormula,
                            weight: props.MolecularWeight,
                            atoms: props.HeavyAtomCount
                        }
                    };
                }
            } catch (e) { console.log("PubChem skipped"); }
        }

        // --- STRATEGY 3: PDB SEARCH (Biology Fallback) ---
        if (!result) {
            try {
                let pdbId = identifier;
                if (identifier.length !== 4) {
                    const searchApiUrl = "https://search.rcsb.org/rcsbsearch/v2/query";
                    const searchBody = {
                        "query": { "type": "terminal", "service": "full_text", "parameters": { "value": identifier } },
                        "return_type": "entry",
                        "request_options": { "paginate": { "start": 0, "rows": 1 } }
                    };
                    const searchRes = await axios.post(searchApiUrl, searchBody);
                    if (searchRes.data.result_set && searchRes.data.result_set.length > 0) {
                        pdbId = searchRes.data.result_set[0].identifier;
                    } else {
                        throw new Error("No match");
                    }
                }
                const fileUrl = `https://files.rcsb.org/download/${pdbId.toUpperCase()}.pdb`;
                const fileRes = await axios.get(fileUrl);
                result = {
                    success: true,
                    type: 'pdb',
                    name: pdbId,
                    data: fileRes.data,
                    info: { formula: "Macromolecule", weight: "Variable", atoms: "Many" }
                };
            } catch (e) {}
        }

        // --- FINAL RESULT ---
        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ success: false, message: "Could not find structure." });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});