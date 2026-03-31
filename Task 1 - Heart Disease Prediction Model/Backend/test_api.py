import requests
import json

data = {
    "Age": 50,
    "Sex": 1,
    "ChestPainType": 0,
    "RestingBP": 120,
    "Cholesterol": 200,
    "FastingBS": 0,
    "RestingECG": 0,
    "MaxHR": 150,
    "ExerciseAngina": 0,
    "Oldpeak": 0.0,
    "ST_Slope": 1
}

try:
    res = requests.post("http://127.0.0.1:5000/api/predict", json=data)
    print("STATUS:", res.status_code)
    print("RESPONSE:", res.text)
except requests.exceptions.ConnectionError:
    print("ERROR: Connection Refused. Server is NOT running on port 5000.")
except Exception as e:
    print("ERROR:", e)
