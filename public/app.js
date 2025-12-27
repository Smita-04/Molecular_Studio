// Firebase Config (Standard Init)
const firebaseConfig = {
  apiKey: "AIzaSyCxPwB79_5iPZPM2uRvrsKTzGcE8jc0pVQ",
  projectId: "gen-lang-client-0615971949",
  appId: "1:798306517180:web:0f4a8d531ca7ead66450b9"
};
firebase.initializeApp(firebaseConfig);

const input = document.getElementById('compoundInput');
const btn = document.getElementById('exploreButton');
const statusMsg = document.getElementById('statusMessage');
const viewerDiv = document.getElementById('viewer3d');

// Viewer Variable
let glviewer = null;

// --- EVENT LISTENERS ---
btn.addEventListener('click', visualize);
input.addEventListener('keypress', (e) => { if(e.key === 'Enter') visualize(); });

async function visualize() {
    const name = input.value.trim();
    if(!name) return;

    // Show Loading
    statusMsg.style.display = 'block';
    statusMsg.textContent = "Scanning database for " + name + "...";
    statusMsg.className = "";
    
    // Clear previous model
    if(glviewer) glviewer.clear();

    try {
        // CALL GOOGLE CLOUD FUNCTION
        const response = await fetch("/exploreCompound", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ compoundIdentifier: name })
        });

        const data = await response.json();

        if (data.success) {
            statusMsg.style.display = 'none'; // Hide loading text
            updateInfo(data.info);
            renderMolecule(data);
        } else {
            showError(data.message);
        }

    } catch (e) {
        showError("Connection Error. Make sure 'firebase serve' is running.");
    }
}

function renderMolecule(data) {
    if (!glviewer) {
        glviewer = $3Dmol.createViewer(viewerDiv, {
            backgroundColor: 'white' // Clean white background
        });
    }
    glviewer.clear();

    // 1. Add Data (SDF or PDB)
    if (data.type === 'sdf') {
        glviewer.addModel(data.data, "sdf");
    } else {
        glviewer.addModel(data.data, "pdb");
    }

    // 2. APPLY STYLE: BALL AND STICK (The "Claude" Look)
    // This makes sure even DNA looks like individual atoms
    glviewer.setStyle({}, { 
        stick: { radius: 0.15, colorscheme: 'Jmol' }, 
        sphere: { scale: 0.25, colorscheme: 'Jmol' } 
    });

    // 3. Render
    glviewer.zoomTo();
    glviewer.render();
    glviewer.spin('y', 0.5); // Slow, elegant spin
}

function updateInfo(info) {
    document.getElementById('formulaDisplay').innerHTML = `<b>Formula:</b> ${info.formula || 'N/A'}`;
    document.getElementById('weightDisplay').innerHTML = `<b>Weight:</b> ${info.weight || 'N/A'}`;
    document.getElementById('atomDisplay').innerHTML = `<b>Atoms:</b> ${info.atoms || 'N/A'}`;
}

function showError(msg) {
    statusMsg.style.display = 'block';
    statusMsg.textContent = msg;
    statusMsg.className = "error";
    if(glviewer) glviewer.clear();
}

// Start with DNA automatically
visualize();