# 🧪 Molecular Studio

**Live Demo:** [https://gen-lang-client-0615971949.web.app](https://gen-lang-client-0615971949.web.app)

Molecular Studio is an interactive, web-based 3D visualization platform designed to make chemistry and biology education engaging. It allows teachers and students to search for **any** element, chemical compound, or biological macromolecule and view its atomic structure in real-time.

---

## 🚀 Key Features

*   **Universal Search Engine:** Instantly finds structures for Elements (Gold), Simple Molecules (Water), Salts (Sodium Oxide), and Macromolecules (DNA, Hemoglobin).
*   **Smart 3D Rendering:**
    *   **Ball & Stick:** For chemicals and elements (to see individual atoms).
    *   **Ribbon/Cartoon:** For DNA and Proteins (to see the shape/helix).
*   **Intelligent Fallback System:**
    *   If a 3D model doesn't exist (e.g., for simple salts or elements), the system automatically converts 2D chemical data into a 3D representation.
*   **Teacher Dictionary:** Pre-configured mappings for common classroom terms (e.g., typing "Polythene" loads a representative C50 chain, typing "DNA" loads the B-DNA Helix).
*   **Clean "Studio" UI:** Minimalist design focused on the structure, including atomic counts, weight, and formulas.

---

## 🛠️ Tech Stack

### Frontend
*   **HTML5 / CSS3:** Custom "Artifact-style" clean UI.
*   **JavaScript (ES6):** Client-side logic for fetching data and rendering.
*   **3Dmol.js:** WebGL-based library for rendering molecular data (SDF and PDB formats).

### Backend (Serverless)
*   **Node.js (v22):** Runtime environment.
*   **Firebase Cloud Functions:** Handles the API logic, data fetching, and parsing.
*   **Google Cloud Platform (GCP):** Underlying infrastructure.

### External APIs & Data Sources
*   **PubChem API:** For chemical compounds, elements, and properties (Formula, Weight).
*   **RCSB PDB API:** For biological structures (Proteins, DNA, RNA, Viruses).
*   **Google Vertex AI:** Integrated for generating descriptions (Lazy loaded for performance).

---

## 📂 Project Structure

```text
MOLECULAR-STUDIO/
│
├── public/                  # FRONTEND (The Website)
│   ├── index.html           # Main user interface
│   ├── app.js               # Frontend logic & 3D viewer controls
│   └── style.css            # (Optional) External styles
│
├── functions/               # BACKEND (The Brain)
│   ├── index.js             # The Smart Search Logic & API Routes
│   ├── package.json         # Backend dependencies (Axios, VertexAI)
│   └── .gitignore           # Backend ignore rules
│
├── firebase.json            # Firebase Hosting & Emulator configuration
├── .gitignore               # Global git ignore rules (Security)
└── README.md                # Project documentation
