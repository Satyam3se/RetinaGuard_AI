# RetinaGuard AI — Complete Operational & User Guide

> **Techspardha 2K26 | Team TecnoX [TS-0123] | IMSEC**  
> **Official Repository:** [https://github.com/Satyam3se/RetinaGuard_AI](https://github.com/Satyam3se/RetinaGuard_AI)

---

## 1. System Overview & Architecture

RetinaGuard AI is an **Explainable Multi-Task AI System** designed for automated Diabetic Retinopathy (DR) screening, Diabetic Macular Edema (DME) risk stratification, and evidential uncertainty quantification.

### Architecture Highlights:
* **Frontend Web Client:** Built with React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, and Canvas-based Grad-CAM heatmaps.
* **Backend Application Server:** Node.js + Express (`server.ts`) running concurrently via `tsx`.
* **Deep Learning Engine:** PyTorch transfer-learning pipeline (`EfficientNet-B0` / `ConvNeXt-Base`) with CLAHE contrast preprocessing, Quadratic Weighted Kappa (QWK) continuous loss proxy, and evidential Dirichlet prior estimation.
* **Inference Bridge:** `scripts/api_infer.py` automatically bridges the Node.js screening requests directly into the PyTorch weights (`retinaguard_multitask_weights.pt`).

---

## 2. Prerequisites & Installation

### A. Environment Requirements
* **Node.js:** v18.0.0 or later
* **Python:** 3.10 to 3.14
* **Git:** Installed and configured in PATH

### B. Python Machine Learning Dependencies
Ensure all required Python packages are installed:
```powershell
pip install torch torchvision numpy opencv-python pandas pillow
```

### C. Node.js Frontend & Server Dependencies
In the root directory of the project:
```powershell
npm install
```

---

## 3. How to Run the Website & Backend

### Step 1: Start the Full-Stack Application
From the root repository directory (`RetinaGuard_clone`), run:

```powershell
npm run dev
```

* This launches both the Express backend and the Vite frontend dev server together at:
  👉 **`http://localhost:5173`** (or port specified in terminal).

### Step 2: Open the Application
Open your web browser (Chrome, Edge, or Brave) and navigate to:
```
http://localhost:5173
```

---

## 4. How the Backend & Model are Connected

The system operates a dual-layer inference pipeline:

```
[ Browser UI: Upload Retinal Image ]
                │
                ▼ (HTTP POST /api/analyze-retina)
[ Express Server: server.ts ]
                │
                ├──► 1. Calls [scripts/api_infer.py] with image data
                │       └── Loads [retinaguard_multitask_weights.pt]
                │       └── Performs CLAHE + FOV circular cropping
                │       └── Evaluates 5-class DR Stage + DME Risk + Uncertainty
                │       └── Returns JSON to Express
                │
                └──► 2. Fallback / Cloud Verification (Gemini 3.8 Flash Vision)
                        └── Used when API keys are configured for multi-modal validation
```

### Key Backend Files:
* `server.ts` — The central server handling `/api/analyze-retina`, `/api/training/checkpoints`, and `/api/datasets`.
* `scripts/api_infer.py` — The bridge script that takes image inputs and executes native PyTorch tensor inference.
* `retinaguard_multitask_weights.pt` — The 20.9 MB trained neural network checkpoint.

---

## 5. Step-by-Step User Guide (How to Use the Website)

### Phase 1: Exploring Clinical Datasets
1. Open the navigation bar and click **"Benchmark Datasets"** (`/datasets`).
2. Review the 4 clinical cohorts:
   * **APTOS 2019:** 3,662 labeled fundus images for 5-stage ICDR classification.
   * **IDRiD:** Lesion maps (microaneurysms, hemorrhages, hard/soft exudates).
   * **DRIVE:** 40 high-resolution blood vessel segmentations.
   * **Messidor-2:** Diabetic Macular Edema risk assessment.

### Phase 2: Inspecting AI Model Checkpoints
1. Click **"Model Architecture & Training"** (`/training`).
2. Inspect the **Active Production Checkpoint**:
   * `RetinaGuard-EfficientNet-B0 (Trained on 3,000 Real Images)` — 90.50% Accuracy, 0.905 QWK.
3. Switch or simulate fine-tuning across custom cohorts with selected hyperparameters.

### Phase 3: Conducting a New Patient Screening (Live Inference)
1. Navigate to **"New Screening"** (`/screening/new`).
2. **Step 1 — Patient Demographics:**
   * Enter Patient Name, Age, Gender, ABHA ID, and Years with Diabetes.
   * Select Examined Eye (`OD: Right Eye`, `OS: Left Eye`).
3. **Step 2 — Image Ingestion:**
   * Drag & drop a retinal fundus photograph (`.png`, `.jpg`), or pick a curated clinical sample from the demo gallery.
4. **Step 3 — Run AI Analysis:**
   * Click **"Run Multi-Dataset AI Screening"**.
   * The system will automatically run CLAHE contrast enhancement, calculate quality metrics (sharpness, clarity), and run the model.
5. **Step 4 — Reviewing Diagnostic Report:**
   * **ICDR DR Severity Grade:** None (0), Mild (1), Moderate (2), Severe (3), Proliferative (4).
   * **Confidence Percentage & Evidential Uncertainty ($u$).**
   * **Messidor-2 DME Risk:** Grade 0 (Absent), Grade 1 (Moderate), or Grade 2 (CSME).
   * **Vascular Caliber:** Arteriolar-to-Venular Ratio (AVR) and vessel tortuosity.
   * **Interactive Heatmaps:** View the Grad-CAM visual attention overlay highlighting lesion clusters.

---

## 6. How to Run Python Inference Directly from Terminal

You can run predictions on any image file directly without opening a browser:

```powershell
python scripts/predict.py --image "data/aptos/colored_images/Moderate/000c1434d8d7.png"
```

### Example Output:
```
============================================================
      RETINAGUARD AI -- MULTI-TASK CLINICAL INFERENCE
============================================================
Target Image:        000c1434d8d7.png
Model Checkpoint:    retinaguard_multitask_weights.pt
------------------------------------------------------------
>> DIAGNOSIS:        Grade 2: Moderate Non-Proliferative DR
>> DR Confidence:    78.17%
>> DME RISK SCORE:   Grade 1: Moderate DME Risk
>> DME Probability:  97.68%
>> Uncertainty (u):  0.5724 (Model Confidence: 42.8%)
------------------------------------------------------------
Probabilities per DR Stage:
  [0] Grade 0: No Apparent Reti    0.1%  
  [1] Grade 1: Mild Non-Prolife   10.4%  ###
  [2] Grade 2: Moderate Non-Pro   78.2%  #######################
  [3] Grade 3: Severe Non-Proli    2.1%  
  [4] Grade 4: Proliferative Di    9.2%  ##
============================================================
```

---

## 7. How to Re-Train the Model on Your Own Data

To run a new fine-tuning loop from scratch or on new data:

```powershell
# Fast training on a subset (e.g. 500 images, 5 epochs):
python scripts/train_quadcore.py --epochs 5 --batch_size 16 --max_samples 500

# Full production training on all images:
python scripts/train_quadcore.py --epochs 8 --batch_size 16 --max_samples 3662
```

The script will automatically update `retinaguard_multitask_weights.pt` upon completion.

---

## 8. Summary of Project File Structure

```
RetinaGuard_clone/
├── data/aptos/                     # Downloaded APTOS 2019 dataset images & train.csv
├── scripts/
│   ├── train_quadcore.py           # Multi-dataset training script with QWK loss
│   ├── predict.py                  # Standalone CLI prediction tool
│   └── api_infer.py                # JSON inference bridge for backend integration
├── src/
│   ├── components/                 # React UI components (GradCAM, Screening, Dashboard)
│   ├── services/
│   │   ├── datasetData.ts          # Dataset metadata & active checkpoint definitions
│   │   └── demoData.ts             # Demo sessions and historical records
│   └── types/screening.ts          # TypeScript clinical diagnostic data models
├── retinaguard_multitask_weights.pt # Saved trained PyTorch model (20.9 MB)
├── server.ts                       # Express backend API & Vite application server
├── package.json                    # Project scripts & dependencies
└── USER_GUIDE.md                   # This instruction manual
```
