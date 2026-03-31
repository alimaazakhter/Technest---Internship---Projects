import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Filler, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Radar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Filler, Title, Tooltip, Legend, ArcElement);

function App() {
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    Age: 50,
    Sex: 1,
    ChestPainType: 0,
    RestingBP: 120,
    Cholesterol: 200,
    FastingBS: 0,
    RestingECG: 0,
    MaxHR: 150,
    ExerciseAngina: 0,
    Oldpeak: 0.0,
    ST_Slope: 1
  });

  // BMI State
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState('');

  // Handle Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'number' ? parseFloat(e.target.value) : parseInt(e.target.value)
    });
  };

  const handleBmiCalculation = () => {
    if (height && weight) {
      const h = parseFloat(height) / 100;
      const w = parseFloat(weight);
      const calculatedBmi = w / (h * h);
      setBmi(parseFloat(calculatedBmi.toFixed(1)));

      if (calculatedBmi < 18.5) setBmiCategory('Underweight');
      else if (calculatedBmi < 25) setBmiCategory('Normal weight');
      else if (calculatedBmi < 30) setBmiCategory('Overweight');
      else setBmiCategory('Obese');
    } else {
      setBmi(null);
      setBmiCategory('--');
    }
  };

  useEffect(() => {
    handleBmiCalculation();
  }, [height, weight]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/predict', formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error predicting:", error);
      alert("Error generating prediction. Is the Flask server running on port 5000?");
    }
    setLoading(false);
  };

  const downloadReport = async () => {
    if (!result) return;
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/download-report', {
        prediction_result: result.result_text,
        input_data: Object.values(formData)
      }, {
        responseType: 'blob',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Heart_Disease_Report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  // Chart specific formatting color depending on theme
  const chartTextColor = theme === 'dark' ? '#e2e8f0' : '#666';

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <i className="fas fa-heartbeat"></i>
            <span>Heart Disease Prediction</span>
          </div>
          <div className="nav-links">
            <a href="#" className="nav-link active">
                <i className="fas fa-home"></i>
                <span className="hidden sm:inline">Home</span>
            </a>
            <a href="#about" className="nav-link">
                <i className="fas fa-info-circle"></i>
                <span className="hidden sm:inline">About</span>
            </a>
            <a href="#contact" className="nav-link">
                <i className="fas fa-envelope"></i>
                <span className="hidden sm:inline">Contact</span>
            </a>
            <button onClick={toggleTheme} className="nav-link" title="Toggle Theme">
              <i className={`fas fa-${theme === 'light' ? 'moon' : 'sun'}`}></i>
            </button>
          </div>
        </div>
      </nav>

      <div className="container fade-in">
        <div className="welcome-section">
          <h1>Heart Disease Risk Assessment</h1>
          <div className="disclaimer">
            <i className="fas fa-shield-alt"></i>
            <div>
              <p>This tool is designed for <strong>healthcare professionals</strong> or users with access to medical data. 
              It does <u>not</u> replace medical consultation. Always seek advice from a licensed doctor for proper diagnosis and treatment.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} id="predictionForm">
          <div className="form-grid">
            <div className="form-group">
                <label>Age <i className="fas fa-info-circle" title="Enter your age in years"></i></label>
                <input type="number" name="Age" min="1" max="120" value={formData.Age} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label>Sex <i className="fas fa-info-circle" title="Select your biological sex"></i></label>
                <select name="Sex" value={formData.Sex} onChange={handleChange} required>
                    <option value="0">Female</option>
                    <option value="1">Male</option>
                </select>
            </div>

            <div className="form-group">
                <label>Chest Pain Type <i className="fas fa-info-circle" title="Type of chest pain experienced"></i></label>
                <select name="ChestPainType" value={formData.ChestPainType} onChange={handleChange} required>
                    <option value="0">Typical Angina</option>
                    <option value="1">Atypical Angina</option>
                    <option value="2">Non-anginal Pain</option>
                    <option value="3">Asymptomatic</option>
                </select>
            </div>

            <div className="form-group">
                <label>Resting Blood Pressure <i className="fas fa-info-circle" title="Resting blood pressure in mm Hg"></i></label>
                <input type="number" name="RestingBP" min="60" max="200" value={formData.RestingBP} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label>Cholesterol <i className="fas fa-info-circle" title="Cholesterol level in mg/dL"></i></label>
                <input type="number" name="Cholesterol" min="100" max="600" value={formData.Cholesterol} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label>Fasting Blood Sugar <i className="fas fa-info-circle" title="Is fasting blood sugar > 120 mg/dL?"></i></label>
                <select name="FastingBS" value={formData.FastingBS} onChange={handleChange} required>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                </select>
            </div>

            <div className="form-group">
                <label>Resting ECG <i className="fas fa-info-circle" title="Results of resting ECG"></i></label>
                <select name="RestingECG" value={formData.RestingECG} onChange={handleChange} required>
                    <option value="0">Normal</option>
                    <option value="1">ST-T Wave Abnormality</option>
                    <option value="2">Left Ventricular Hypertrophy</option>
                </select>
            </div>

            <div className="form-group">
                <label>Max Heart Rate <i className="fas fa-info-circle" title="Maximum heart rate achieved"></i></label>
                <input type="number" name="MaxHR" min="60" max="202" value={formData.MaxHR} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label>Exercise Angina <i className="fas fa-info-circle" title="Exercise-induced chest pain"></i></label>
                <select name="ExerciseAngina" value={formData.ExerciseAngina} onChange={handleChange} required>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                </select>
            </div>

            <div className="form-group">
                <label>ST Depression <i className="fas fa-info-circle" title="ST depression induced by exercise relative to rest"></i></label>
                <input type="number" name="Oldpeak" step="0.1" min="-2.6" max="6.2" value={formData.Oldpeak} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label>ST Slope <i className="fas fa-info-circle" title="Slope of the peak exercise ST segment"></i></label>
                <select name="ST_Slope" value={formData.ST_Slope} onChange={handleChange} required>
                    <option value="0">Upsloping</option>
                    <option value="1">Flat</option>
                    <option value="2">Downsloping</option>
                </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              <i className="fas fa-heartbeat"></i>
              {loading ? "Analyzing..." : "Analyze Risk"}
            </button>
          </div>
        </form>

        {result && (
          <>
            <div className={`result-card fade-in ${result.prediction === 1 ? 'danger' : 'safe'}`}>
              <div className="result-icon">
                <i className={`fas fa-${result.prediction === 1 ? 'exclamation-circle' : 'check-circle'}`}></i>
              </div>
              <div className="result-content">
                <h3>{result.result_text.replace('🚨', '').replace('✅', '').trim()}</h3>
                <p className="result-timestamp">Analysis completed dynamically</p>
                <div className="action-buttons">
                  <button onClick={downloadReport} className="download-btn">
                      <i className="fas fa-file-pdf"></i> Download PDF Report
                  </button>
                  <button onClick={() => document.getElementById('dashboard')?.scrollIntoView()} className="dashboard-btn">
                      <i className="fas fa-chart-bar"></i> View Dashboard
                  </button>
                </div>
              </div>
            </div>

            <div id="dashboard" className="dashboard fade-in">
              <div className="dashboard-header">
                  <h2><i className="fas fa-chart-line"></i> Your Health Dashboard</h2>
                  <p className="dashboard-subtitle">Comprehensive analysis of your cardiovascular health metrics</p>
              </div>
              
              <div className="dashboard-section">
                <h3 className="section-title"><i className="fas fa-microscope"></i> Detailed Analysis</h3>
                <div className="dashboard-grid primary-grid">
                  <div className="dashboard-card primary-card">
                    <div className="card-header">
                        <h4><i className="fas fa-chart-bar"></i> Vital Signs Comparison</h4>
                        <p className="card-subtitle">Your values vs. healthy averages</p>
                    </div>
                    <Bar 
                      data={{
                        labels: ['Blood Pressure', 'Heart Rate', 'Cholesterol'],
                        datasets: [
                          { label: 'Your Values', data: [formData.RestingBP, formData.MaxHR, formData.Cholesterol], backgroundColor: '#3498db' },
                          { label: 'Normal Average', data: [120, 150, 200], backgroundColor: '#2ecc71' }
                        ]
                      }} 
                      options={{ plugins: { legend: { labels: { color: chartTextColor } } }, scales: { y: { ticks: { color: chartTextColor } }, x: { ticks: { color: chartTextColor } } } }}
                    />
                  </div>

                  <div className="dashboard-card secondary-card">
                    <div className="card-header">
                        <h4><i className="fas fa-radar"></i> Cardiovascular Profile</h4>
                        <p className="card-subtitle">Multi-factor health assessment</p>
                    </div>
                    <Radar 
                      data={{
                        labels: ['Age', 'BP Check', 'Cholesterol', 'Max HR Check', 'ST Dep Check'],
                        datasets: [{
                          label: 'Health Factors',
                          data: [formData.Age, formData.RestingBP / 1.5, formData.Cholesterol / 2, formData.MaxHR / 1.5, formData.Oldpeak * 20],
                          backgroundColor: 'rgba(231, 76, 60, 0.2)',
                          borderColor: '#e74c3c',
                          pointBackgroundColor: '#e74c3c',
                        }]
                      }}
                      options={{ plugins: { legend: { labels: { color: chartTextColor } } }, scales: { r: { ticks: { backdropColor: 'transparent', color: chartTextColor }, pointLabels: { color: chartTextColor } } } }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* BMI Calculator */}
        <div className="bmi-calculator">
            <h2><i className="fas fa-calculator"></i> BMI Calculator</h2>
            <div className="bmi-form-grid">
              <div className="form-group">
                  <label><i className="fas fa-ruler-vertical"></i> Height (cm)</label>
                  <input type="number" placeholder="Enter height in cm" value={height} onChange={e => setHeight(e.target.value)} />
              </div>
              <div className="form-group">
                  <label><i className="fas fa-weight"></i> Weight (kg)</label>
                  <input type="number" placeholder="Enter weight in kg" value={weight} onChange={e => setWeight(e.target.value)} />
              </div>
            </div>
            <div className="bmi-result">
                <div className="bmi-value">
                    <span>Your BMI:</span>
                    <span>{bmi !== null ? bmi : '--'}</span>
                </div>
                <div className="bmi-category">
                    <span>Category:</span>
                    <span>{bmiCategory || '--'}</span>
                </div>
            </div>
        </div>
      </div>

      <footer className="site-footer" id="about">
        <div className="footer-main">
            <div className="footer-col about">
                <h3>About Us</h3>
                <p>We provide accurate heart disease risk assessment using advanced machine learning algorithms.</p>
            </div>
            <div className="footer-col links">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="#"><i className="fas fa-home"></i> Home</a></li>
                    <li><a href="#about"><i className="fas fa-info-circle"></i> About</a></li>
                    <li><a href="#contact"><i className="fas fa-envelope"></i> Contact</a></li>
                </ul>
            </div>
            <div className="footer-col contact" id="contact">
                <h3>Contact Info</h3>
                <ul>
                    <li><i className="fas fa-envelope"></i> support@heartprediction.com</li>
                    <li><i className="fas fa-phone"></i> +1 234 567 890</li>
                </ul>
            </div>
        </div>
        <div className="footer-bottom">
            <span>&copy; 2025 Heart Disease Prediction. All rights reserved.</span>
        </div>
      </footer>
    </>
  );
}

export default App;
