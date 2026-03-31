@echo off
title Heart Disease Predictor
echo ==========================================
echo Starting Heart Disease Prediction AI...
echo ==========================================

echo [1/2] Launching Flask Backend Engine...
start "Flask Server" cmd /k "cd /d %~dp0 && title Flask Server && python app.py"

timeout /t 2 /nobreak > nul

echo [2/2] Launching React Development Server...
start "React Frontend Server" cmd /k "cd /d %~dp0frontend && title React Frontend && npm run dev"

echo.
echo Both servers are booting up in separate windows!
echo Flask API  --^>  http://localhost:5000
echo React App  --^>  http://localhost:5173
echo Feel free to close this window.
exit
