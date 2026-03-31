from flask import Flask, request, send_file, jsonify, render_template
from flask_cors import CORS
import pickle
import numpy as np
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import io
import os
import webbrowser
from threading import Timer

app = Flask(__name__)
CORS(app)

# Load model
with open("heart_model.pkl", "rb") as file:
    model = pickle.load(file)

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

    # Input Data
    story.append(Paragraph("Input Parameters:", styles['Heading2']))
    
    # Convert input data to proper types
    input_data = [float(x) for x in input_data]
    
    # Create data for the table
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

    # Create table
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

    # Disclaimer
    disclaimer_style = ParagraphStyle(
        'DisclaimerStyle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.gray,
        italic=True
    )
    story.append(Paragraph("Disclaimer: This report is generated for informational purposes only. It does not replace medical consultation. Always seek advice from a licensed doctor for proper diagnosis and treatment.", disclaimer_style))

    # Build PDF
    doc.build(story)
    buffer.seek(0)
    return buffer

@app.route('/')
def home():
    return render_template('index.html', now=datetime.now)

@app.route('/predict', methods=['POST'])
def predict_legacy():
    data = [
        int(request.form['Age']),
        int(request.form['Sex']),
        int(request.form['ChestPainType']),
        int(request.form['RestingBP']),
        int(request.form['Cholesterol']),
        int(request.form['FastingBS']),
        int(request.form['RestingECG']),
        int(request.form['MaxHR']),
        int(request.form['ExerciseAngina']),
        float(request.form['Oldpeak']),
        int(request.form['ST_Slope'])
    ]

    input_data = np.array([data])
    prediction = model.predict(input_data)

    if prediction[0] == 1:
        result = "🚨 Heart Disease Detected!"
    else:
        result = "✅ No Heart Disease Detected!"

    return render_template('index.html', prediction_text=result, now=datetime.now, input_data=data)

@app.route('/download-report', methods=['POST'])
def download_report_legacy():
    prediction_result = request.form.get('prediction_result')
    input_data = request.form.getlist('input_data[]')
    
    pdf_buffer = generate_pdf_report(prediction_result, input_data)
    
    return send_file(
        pdf_buffer,
        as_attachment=True,
        download_name=f"Heart_Disease_Report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf",
        mimetype='application/pdf'
    )

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    features = [
        int(data.get('Age')),
        int(data.get('Sex')),
        int(data.get('ChestPainType')),
        int(data.get('RestingBP')),
        int(data.get('Cholesterol')),
        int(data.get('FastingBS')),
        int(data.get('RestingECG')),
        int(data.get('MaxHR')),
        int(data.get('ExerciseAngina')),
        float(data.get('Oldpeak')),
        int(data.get('ST_Slope'))
    ]

    input_data = np.array([features])
    prediction = model.predict(input_data)
    is_risk = int(prediction[0]) == 1

    if is_risk:
        result = "🚨 Heart Disease Detected!"
    else:
        result = "✅ No Heart Disease Detected!"

    return jsonify({
        "prediction": int(prediction[0]),
        "result_text": result,
        "features": features
    })

@app.route('/api/download-report', methods=['POST'])
def download_report():
    data = request.json
    prediction_result = data.get('prediction_result')
    input_data = data.get('input_data', [])
    
    pdf_buffer = generate_pdf_report(prediction_result, input_data)
    
    return send_file(
        pdf_buffer,
        as_attachment=True,
        download_name=f"Heart_Disease_Report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf",
        mimetype='application/pdf'
    )

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
