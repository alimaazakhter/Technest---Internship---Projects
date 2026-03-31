from fastapi import FastAPI, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import pickle
import numpy as np
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import io

# Initialize FastAPI application
app = FastAPI(
    title="Heart Disease AI Engine", 
    description="A superfast AI API for medical predictions powered by FastAPI.", 
    version="1.0.0"
)

# Enable CORS for React Frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load machine learning models (safely un-pickling)
with open("heart_model.pkl", "rb") as file:
    model = pickle.load(file)

# Mount statics for legacy index.html styling
app.mount("/static", StaticFiles(directory="static"), name="static")

# Mount templates for legacy render_template
templates = Jinja2Templates(directory="templates")

# ==========================================
# 🛡️ Pydantic Schemas - Auto-Validates Incoming React JSON
# ==========================================
class PredictionRequest(BaseModel):
    Age: int
    Sex: int
    ChestPainType: int
    RestingBP: int
    Cholesterol: int
    FastingBS: int
    RestingECG: int
    MaxHR: int
    ExerciseAngina: int
    Oldpeak: float
    ST_Slope: int

class DownloadRequest(BaseModel):
    prediction_result: str
    input_data: list[float]

# ==========================================
# 📊 PDF Generation Engine (ReportLab)
# ==========================================
def generate_pdf_report(prediction_result, input_data):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        textColor=colors.HexColor('#2196F3')
    )
    story.append(Paragraph("Heart Disease Risk Assessment Report", title_style))
    story.append(Spacer(1, 20))

    # Date and Time
    date_style = ParagraphStyle(
        'DateStyle',
        parent=styles['Normal'],
        fontSize=12,
        textColor=colors.gray
    )
    story.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", date_style))
    story.append(Spacer(1, 30))

    # Prediction Result
    result_style = ParagraphStyle(
        'ResultStyle',
        parent=styles['Heading2'],
        fontSize=18,
        textColor=colors.HexColor('#4CAF50') if "No Heart Disease" in prediction_result else colors.HexColor('#F44336')
    )
    story.append(Paragraph("Prediction Result:", styles['Heading2']))
    story.append(Paragraph(prediction_result, result_style))
    story.append(Spacer(1, 30))

    # Input Data Table Configuration
    story.append(Paragraph("Input Parameters:", styles['Heading2']))
    input_data = [float(x) for x in input_data]
    data = [
        ["Parameter", "Value"],
        ["Age", str(int(input_data[0]))],
        ["Sex", "Male" if int(input_data[1]) == 1 else "Female"],
        ["Chest Pain Type", ["Typical Angina", "Atypical Angina", "Non-anginal Pain", "Asymptomatic"][int(input_data[2])]],
        ["Resting Blood Pressure", f"{int(input_data[3])} mm Hg"],
        ["Cholesterol", f"{int(input_data[4])} mg/dL"],
        ["Fasting Blood Sugar", "> 120 mg/dL" if int(input_data[5]) == 1 else "≤ 120 mg/dL"],
        ["Resting ECG", ["Normal", "ST-T Wave Abnormality", "Left Ventricular Hypertrophy"][int(input_data[6])]],
        ["Max Heart Rate", str(int(input_data[7]))],
        ["Exercise Angina", "Yes" if int(input_data[8]) == 1 else "No"],
        ["ST Depression", f"{input_data[9]:.1f}"],
        ["ST Slope", ["Upsloping", "Flat", "Downsloping"][int(input_data[10])]]
    ]

    table = Table(data, colWidths=[2.5*inch, 3*inch])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2196F3')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 14),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(table)
    story.append(Spacer(1, 30))

    disclaimer_style = ParagraphStyle(
        'DisclaimerStyle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.gray,
        italic=True
    )
    story.append(Paragraph("Disclaimer: This report is generated for informational purposes only. It does not replace medical consultation.", disclaimer_style))

    doc.build(story)
    buffer.seek(0)
    return buffer

def now():
    return datetime.now()

# ==========================================
# 🌐 MODERN REACT REST API
# ==========================================
@app.post("/api/predict")
async def api_predict(data: PredictionRequest):
    features = [
        data.Age, data.Sex, data.ChestPainType, data.RestingBP, data.Cholesterol,
        data.FastingBS, data.RestingECG, data.MaxHR, data.ExerciseAngina, data.Oldpeak, data.ST_Slope
    ]
    input_data = np.array([features])
    prediction = model.predict(input_data)
    
    if int(prediction[0]) == 1:
        result = "🚨 Heart Disease Detected!"
    else:
        result = "✅ No Heart Disease Detected!"
        
    return {"prediction": int(prediction[0]), "result_text": result, "features": features}

@app.post("/api/download-report")
async def api_download_report(data: DownloadRequest):
    pdf_buffer = generate_pdf_report(data.prediction_result, data.input_data)
    headers = {
        'Content-Disposition': f'attachment; filename="Heart_Disease_Report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf"',
        'Access-Control-Expose-Headers': 'Content-Disposition'
    }
    return StreamingResponse(pdf_buffer, media_type="application/pdf", headers=headers)

# ==========================================
# 🏛️ LEGACY HTML TEMPLATE ROUTES (Fallback)
# ==========================================
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "now": now})

@app.post("/predict", response_class=HTMLResponse)
async def predict_legacy(
    request: Request,
    Age: int = Form(...),
    Sex: int = Form(...),
    ChestPainType: int = Form(...),
    RestingBP: int = Form(...),
    Cholesterol: int = Form(...),
    FastingBS: int = Form(...),
    RestingECG: int = Form(...),
    MaxHR: int = Form(...),
    ExerciseAngina: int = Form(...),
    Oldpeak: float = Form(...),
    ST_Slope: int = Form(...)
):
    data = [Age, Sex, ChestPainType, RestingBP, Cholesterol, FastingBS, RestingECG, MaxHR, ExerciseAngina, Oldpeak, ST_Slope]
    input_data = np.array([data])
    prediction = model.predict(input_data)
    
    if int(prediction[0]) == 1:
        result = "🚨 Heart Disease Detected!"
    else:
        result = "✅ No Heart Disease Detected!"
        
    return templates.TemplateResponse("index.html", {
        "request": request,
        "prediction_text": result,
        "now": now,
        "input_data": data
    })

@app.post("/download-report")
async def download_report_legacy(
    prediction_result: str = Form(...),
    input_data_list: list[str] = Form(..., alias="input_data[]")
):
    input_data = [float(val) for val in input_data_list]
    pdf_buffer = generate_pdf_report(prediction_result, input_data)
    headers = {
        'Content-Disposition': f'attachment; filename="Heart_Disease_Report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf"'
    }
    return StreamingResponse(pdf_buffer, media_type="application/pdf", headers=headers)
