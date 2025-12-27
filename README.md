# 🧪 Molecular Studio

![Firebase](https://img.shields.io/badge/Hosting-Firebase-orange?style=flat&logo=firebase)
![Backend](https://img.shields.io/badge/Backend-Cloud%20Functions-blue?style=flat&logo=google-cloud)
![Node](https://img.shields.io/badge/Runtime-Node.js%20v22-green?style=flat&logo=node.js)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)

> **"From Atoms to Helices."**
> A high-performance, serverless visualization engine for chemical and biological structures.

**🚀 Live Demo:** [https://gen-lang-client-0615971949.web.app](https://gen-lang-client-0615971949.web.app)

---

## 📸 Interface Preview

| **Biological Macromolecules (PDB)** | **Chemical Compounds (SDF)** |
|:-----------------------------------:|:--------------------------------:|
| ![DNA Structure](screenshots/dna_view.png) | ![Methane Structure](screenshots/chemical_view.png) |
| *Visualizing B-DNA Helix (1BNA)* | *Visualizing simple atomic bonds* |

---

## 📖 Overview

**Molecular Studio** is an educational SaaS platform built to bridge the gap between abstract chemical formulas and tangible 3D understanding.

Unlike standard viewers that crash on complex queries or fail on simple salts, this engine utilizes a **Multi-Tiered Fallback Search Strategy**. It intelligently aggregates data from **PubChem** (Chemicals), **RCSB PDB** (Biology), and a curated **Teacher Dictionary** to ensure students always see a relevant model—whether searching for "Gold", "Methane", or "Covid-19".

---

## ⚡ Key Features

### 🔍 Intelligent Search Engine
*   **Context-Aware Parsing:** Automatically distinguishes between simple elements (Au), molecules (CH4), and macromolecules (Proteins).
*   **2D-to-3D Extrapolation:** Can generate 3D spheres from 2D data if a computed 3D model is missing (solves the "Ionic Salt" visualization problem).
*   **Teacher Dictionary:** Maps pedagogical terms ("Polythene", "DNA") to representative scientific models (`Pentacontane`, `1BNA`).

### 🎨 Adaptive Rendering (3Dmol.js)
*   **Dynamic Styling:**
    *   **Cartoons/Ribbons:** Automatically applied to Proteins/DNA for structural clarity.
    *   **Ball & Stick:** Automatically applied to small molecules for atomic clarity.
*   **Interactive Controls:** Zoom, Spin, and Rotate capabilities via WebGL.

### ⚙️ Performance Engineering
*   **Lazy-Loaded Modules:** Backend dependencies (`Axios`, `VertexAI`) are imported inside the request scope to eliminate "Cold Start" latency in Google Cloud Functions.
*   **Parallel Fetching:** Properties (Weight, Formula) and Coordinates (SDF/PDB) are fetched concurrently using `Promise.all`.

---

## 🏗️ System Architecture

The application follows a **Serverless Microservices** architecture hosted on Google Cloud Platform.

graph TD
    Client["Frontend (HTML/JS)"] -->|"POST /exploreCompound"| CloudFunc["Firebase Cloud Function"]
    
    CloudFunc -->|"Step 1: Dictionary Check"| Dictionary{"Match?"}
    Dictionary -->|Yes| PDB["RCSB PDB Database"]
    Dictionary -->|No| PubChem3D{"PubChem 3D?"}
    
    PubChem3D -->|Yes| PubChem["PubChem API"]
    PubChem3D -->|"No (Fallback)"| PubChem2D["PubChem 2D -> 3D Conv"]
    
    PubChem2D -->|Fail| PDBSearch["PDB Keyword Search"]
    
    PDB --> Client
    PubChem --> Client
    PDBSearch --> Client
