# 🫀 Heart Disease Prediction System

> A full-stack AI-powered web application for cardiovascular health risk assessment using Machine Learning and a modern React frontend.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Live Demo & Screenshots](#live-demo--screenshots)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Machine Learning Model](#machine-learning-model)
- [Dataset](#dataset)
- [Input Parameters](#input-parameters)
- [Project Structure](#project-structure)
- [Features](#features)
- [Libraries & Dependencies](#libraries--dependencies)
- [How to Run](#how-to-run)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Disclaimer](#disclaimer)

---

## 📌 Project Overview

The **Heart Disease Prediction System** is a full-stack medical AI web application that predicts the likelihood of heart disease in a patient based on 11 clinical parameters. The system uses a supervised Machine Learning model trained on a real-world cardiac dataset and exposes the AI through a professional REST API backend.

The project has two versions running simultaneously:
- **Legacy Version** (Flask + HTML/CSS/JS) → `http://localhost:5000`
- **Modern Version** (React + TypeScript + Chart.js) → `http://localhost:5173`

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                  CLIENT SIDE                        │
│                                                     │
│   Modern React App (Port 5173)                      │
│   ┌──────────────────────────────────────────────┐  │
│   │  React 18 + TypeScript + Vite + Chart.js     │  │
│   │  Responsive UI | Dark Mode | BMI Calculator  │  │
│   └──────────────────────┬───────────────────────┘  │
│                          │  HTTP (Axios / JSON)      │
│   Legacy HTML App (Port 5000)                       │
│   ┌──────────────────────────────────────────────┐  │
│   │  HTML5 + Vanilla CSS + Vanilla JS + Chart.js │  │
│   └──────────────────────┬───────────────────────┘  │
└─────────────────────────-┼──────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────┐
│                  SERVER SIDE                        │
│                                                     │
│   Flask REST API (Port 5000)                        │
│   ┌──────────────────────────────────────────────┐  │
│   │  Python 3.x + Flask + Flask-CORS             │  │
│   │  Scikit-learn ML Model (Pickle)              │  │
│   │  ReportLab PDF Generator                     │  │
│   └──────────────────────┬───────────────────────┘  │
│                          │                          │
│   Machine Learning Model                           │
│   ┌──────────────────────────────────────────────┐  │
│   │  Random Forest Classifier                    │  │
│   │  Trained on UCI Heart Disease Dataset        │  │
│   │  Serialized as heart_model.pkl               │  │
│   └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend (Modern Version)
| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.2.0 | Core UI Framework |
| **TypeScript** | 5.0.2 | Static type checking |
| **Vite** | 4.4.5 | Build tool and Dev server |
| **Chart.js** | 4.4.0 | Interactive health dashboard charts |
| **react-chartjs-2** | 5.2.0 | React wrapper for Chart.js |
| **Axios** | 1.6.0 | HTTP client for API communication |
| **Lucide React** | 0.292.0 | Icon Library |
| **Vanilla CSS** | — | Custom glassmorphism + dark mode styling |
| **Poppins (Google Fonts)** | — | Typography |
| **FontAwesome** | 6.0.0 | Medical UI icons |

### Frontend (Legacy Version)
| Technology | Purpose |
|---|---|
| **HTML5** | Page structure and semantic layout |
| **Vanilla CSS** | Full custom Poppins-based professional styling |
| **Vanilla JavaScript** | Form handling, BMI calculator, Chart.js integration |
| **Chart.js (CDN)** | Interactive health dashboard charts |
| **FontAwesome (CDN)** | Medical UI icons |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Python** | 3.x | Core backend language |
| **Flask** | Latest | REST API Web Framework |
| **Flask-CORS** | Latest | Cross-Origin Resource Sharing |
| **Scikit-learn** | Latest | Machine learning model loading and prediction |
| **NumPy** | Latest | Numerical array operations |
| **Pandas** | Latest | Data manipulation (during model training) |
| **ReportLab** | Latest | PDF health report generation |
| **Pickle** | Built-in | ML model serialization/deserialization |

---

## 🤖 Machine Learning Model

### Algorithm Used: **Random Forest Classifier**

Random Forest is an ensemble machine learning method that builds multiple Decision Trees during training and merges their predictions. This makes it highly accurate and resistant to overfitting.

**Why Random Forest was chosen:**
- Handles both numerical and categorical medical data efficiently.
- Robust performance on clinical tabular datasets.
- Provides higher accuracy than a single Decision Tree.
- Can handle missing values gracefully.
- Interpretability is reasonable for Healthcare AI.

### Model Training Details
| Parameter | Detail |
|---|---|
| **Algorithm** | Random Forest Classifier |
| **Training File** | `heart_disease.ipynb` (Jupyter Notebook) |
| **Saved Model** | `heart_model.pkl` (Pickle format) |
| **Target Variable** | `HeartDisease` (0 = No Disease, 1 = Disease) |
| **Accuracy** | ~88% on the test dataset |

---

## 📊 Dataset

**Source:** UCI Heart Disease Dataset (also available on Kaggle)  
**File:** `heart.csv`  
**Total Records:** 918 patient records  
**Features:** 11 input features + 1 target label

---

## 📝 Input Parameters

The model accepts 11 clinical parameters from patients:

| Parameter | Type | Description | Normal Range |
|---|---|---|---|
| **Age** | Integer | Age in years | 20–100 |
| **Sex** | Binary | Biological sex (0=Female, 1=Male) | — |
| **ChestPainType** | Categorical | 0=Typical Angina, 1=Atypical Angina, 2=Non-anginal Pain, 3=Asymptomatic | — |
| **RestingBP** | Integer | Resting blood pressure (mm Hg) | 60–200 |
| **Cholesterol** | Integer | Serum cholesterol (mg/dL) | 100–400 |
| **FastingBS** | Binary | Fasting blood sugar > 120 mg/dL (0=No, 1=Yes) | — |
| **RestingECG** | Categorical | ECG results (0=Normal, 1=ST-T Abnormality, 2=LV Hypertrophy) | — |
| **MaxHR** | Integer | Maximum heart rate achieved | 60–202 |
| **ExerciseAngina** | Binary | Exercise-induced angina (0=No, 1=Yes) | — |
| **Oldpeak** | Float | ST depression induced by exercise relative to rest | -2.6 to 6.2 |
| **ST_Slope** | Categorical | Slope of peak exercise ST segment (0=Upsloping, 1=Flat, 2=Downsloping) | — |

---

## 📁 Project Structure

```
Task1_Heart disease Prediction model/
│
├── 📄 app.py                    # Flask REST API + Legacy HTML routes
├── 📄 main.py                   # FastAPI backend (alternative engine)
├── 📄 heart_model.pkl           # Trained Machine Learning model (serialized)
├── 📄 heart.csv                 # Original training dataset (918 rows)
├── 📓 heart_disease.ipynb       # Jupyter Notebook (model training & EDA)
├── 📄 start_app.bat             # 1-Click Windows startup script
├── 📄 readme.md                 # This file!
│
├── 📁 templates/
│   └── 📄 index.html            # Legacy Flask HTML template
│
├── 📁 static/
│   ├── 📄 style.css             # Legacy app CSS styling
│   └── 📄 script.js             # Legacy app JavaScript
│
└── 📁 frontend/                 # Modern React Application
    ├── 📄 index.html            # React app HTML entry point
    ├── 📄 package.json          # Node.js dependencies
    ├── 📄 vite.config.ts        # Vite build configuration
    ├── 📄 tsconfig.json         # TypeScript settings
    └── 📁 src/
        ├── 📄 main.tsx          # React root entry
        ├── 📄 App.tsx           # Main application component
        └── 📄 index.css         # Global CSS (light/dark mode variables)
```

---

## ✨ Features

### Core Features
- 🤖 **AI Heart Disease Prediction** — Powered by a trained Random Forest Classifier.
- 📄 **PDF Report Generation** — Download a professionally formatted clinical PDF report via ReportLab.
- 🌙 **Light / Dark Mode** — One-click night mode toggle in the React version's navbar.
- 📱 **Fully Responsive** — Works perfectly on Desktop, Tablet, and Mobile devices.

### Health Dashboard (After Prediction)
- 📊 **Bar Chart** — Compares your Vital Signs against healthy population averages.
- 🕸️ **Radar Chart** — Multi-factor cardiovascular profile assessment.

### Extra Tools
- ⚖️ **BMI Calculator** — Offline Body Mass Index calculator with automatic categorization (Underweight / Normal / Overweight / Obese).

### Developer Features
- 🔗 **Decoupled Architecture** — React frontend and Flask backend are completely independent, deployable separately.
- 🔒 **CORS Configured** — Secure cross-origin communication between React (port 5173) and Flask (port 5000).
- 📋 **Dual Mode** — Both the old HTML legacy app and the new React app run simultaneously from the same backend.

---

## 📦 Libraries & Dependencies

### Python (Backend)
```
flask
flask-cors
numpy
pandas
scikit-learn
reportlab
pickle (built-in)
```

Install all at once:
```bash
pip install flask flask-cors numpy pandas scikit-learn reportlab
```

### Node.js (Frontend)
```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "chart.js": "^4.4.0",
    "lucide-react": "^0.292.0",
    "react": "^18.2.0",
    "react-chartjs-2": "^5.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}
```

Install all at once:
```bash
cd frontend
npm install
```

---

## 🚀 How to Run

### Option 1: One-Click Launch (Recommended for Windows)
Simply double-click the `start_app.bat` file in the project folder. It will automatically open two terminal windows and start both servers!

### Option 2: Manual Launch (Two Terminals)

**Terminal 1 — Start Flask Backend:**
```bash
cd "Task1_Heart disease Prediction model"
python app.py
```
Flask will start at → `http://localhost:5000`

**Terminal 2 — Start React Frontend:**
```bash
cd "Task1_Heart disease Prediction model/frontend"
npm run dev
```
React will start at → `http://localhost:5173`

### Viewing the Apps
| Version | URL | Description |
|---|---|---|
| **Modern React App** | `http://localhost:5173` | New responsive UI with dark mode |
| **Legacy HTML App** | `http://localhost:5000` | Original classic interface |

---

## 🔌 API Endpoints (Flask REST API)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Renders the legacy HTML template |
| `POST` | `/predict` | Predicts risk from HTML form data (Legacy) |
| `POST` | `/download-report` | Downloads PDF report (Legacy form) |
| `POST` | `/api/predict` | **JSON API** — Predicts risk, returns JSON (React) |
| `POST` | `/api/download-report` | **JSON API** — Generates and downloads PDF (React) |

### Sample JSON Request (`/api/predict`):
```json
{
  "Age": 55,
  "Sex": 1,
  "ChestPainType": 0,
  "RestingBP": 140,
  "Cholesterol": 250,
  "FastingBS": 0,
  "RestingECG": 1,
  "MaxHR": 130,
  "ExerciseAngina": 1,
  "Oldpeak": 1.5,
  "ST_Slope": 2
}
```

### Sample JSON Response:
```json
{
  "prediction": 1,
  "result_text": "🚨 Heart Disease Detected!",
  "features": [55, 1, 0, 140, 250, 0, 1, 130, 1, 1.5, 2]
}
```

---

## ☁️ Deployment

### Backend (Flask API) — Render
1. Push your project to GitHub.
2. Go to [render.com](https://render.com) and create a **Web Service**.
3. Set the **Start Command** to: `python app.py`
4. Set the **Environment** to `Python`.

### Frontend (React) — Vercel or Netlify
1. Push the `frontend/` folder to GitHub.
2. Import it on [vercel.com](https://vercel.com) or [netlify.com](https://netlify.com).
3. Set the **Build Command** to: `npm run build`
4. Set the **Output Directory** to: `dist`
5. Update the API URL in `App.tsx` from `http://127.0.0.1:5000` to your live Render backend URL.

---

## ⚠️ Disclaimer

> This application is designed for **educational and demonstration purposes only**.  
> It is **not** a certified medical device and **does not** replace professional medical consultation.  
> Always seek advice from a qualified and licensed healthcare professional for proper cardiac diagnosis and treatment.  
> The predictions generated by this system are based on statistical patterns in training data and may not reflect individual clinical reality.

---

## 👨‍💻 Built With ❤️ by

TechNest Internship Project — Task 1  
© 2025 Heart Disease Prediction. All rights reserved.
