// Form validation and loading state
document.getElementById('predictionForm').addEventListener('submit', function(e) {
    const form = e.target;
    if (!form.checkValidity()) {
        e.preventDefault();
        alert('Please fill in all fields correctly.');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Analyzing...';
    submitBtn.disabled = true;
    
    // Show loading spinner
    const loadingSpinner = document.getElementById('loading');
    if (loadingSpinner) {
        loadingSpinner.style.display = 'flex';
    }
    
    // Let the form submit normally to Flask
    // The loading state will be handled by the page reload
});

// Chart instances
let vitalSignsChart = null;
let riskDistributionChart = null;
let radarChart = null;
let heartRateChart = null;

// Initialize charts
function initializeCharts() {
    // 1. Bar Chart: Vital Signs Comparison
    const vitalSignsCtx = document.getElementById('vitalSignsChart');
    if (vitalSignsCtx) {
        vitalSignsChart = new Chart(vitalSignsCtx, {
            type: 'bar',
            data: {
                labels: ['Blood Pressure', 'Cholesterol', 'Max Heart Rate'],
                datasets: [{
                    label: 'Your Values',
                    data: [0, 0, 0],
                    backgroundColor: '#3498db',
                    borderColor: '#2980b9',
                    borderWidth: 2,
                    borderRadius: 5
                }, {
                    label: 'Ideal Values',
                    data: [120, 200, 150],
                    backgroundColor: '#95a5a6',
                    borderColor: '#7f8c8d',
                    borderWidth: 2,
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }

    // 2. Pie Chart: Risk Distribution
    const riskDistributionCtx = document.getElementById('riskDistributionChart');
    if (riskDistributionCtx) {
        riskDistributionChart = new Chart(riskDistributionCtx, {
            type: 'pie',
            data: {
                labels: ['Safe', 'Risk'],
                datasets: [{
                    data: [80, 20],
                    backgroundColor: ['#2ecc71', '#e74c3c'],
                    borderColor: ['#27ae60', '#c0392b'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // 3. Radar Chart: Cardiovascular Profile
    const radarCtx = document.getElementById('radarChart');
    if (radarCtx) {
        radarChart = new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: ['Age', 'Blood Pressure', 'Cholesterol', 'Max HR', 'ST Depression'],
                datasets: [{
                    label: 'Your Profile',
                    data: [50, 60, 70, 80, 30],
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: '#3498db',
                    borderWidth: 2,
                    pointBackgroundColor: '#3498db',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#3498db'
                }, {
                    label: 'Healthy Range',
                    data: [50, 80, 75, 85, 50],
                    backgroundColor: 'rgba(46, 204, 113, 0.2)',
                    borderColor: '#2ecc71',
                    borderWidth: 2,
                    pointBackgroundColor: '#2ecc71',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#2ecc71'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                },
                plugins:    {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }

    // 4. Line Chart: Heart Rate Trend
    const heartRateCtx = document.getElementById('heartRateChart');
    if (heartRateCtx) {
        heartRateChart = new Chart(heartRateCtx, {
            type: 'line',
            data: {
                labels: ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'],
                datasets: [{
                    label: 'Heart Rate (BPM)',
                    data: [72, 85, 78, 92, 88, 75],
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#e74c3c',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 60,
                        max: 100,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }
}

// Update charts with user data
function updateCharts(userData) {
    // Update Bar Chart
    if (vitalSignsChart) {
        vitalSignsChart.data.datasets[0].data = [
            userData.restingBP || 0,
            userData.cholesterol || 0,
            userData.maxHR || 0
        ];
        vitalSignsChart.update();
    }

    // Update Pie Chart
    if (riskDistributionChart) {
        const isHighRisk = userData.predictionResult && userData.predictionResult.includes('🚨');
        const safePercentage = isHighRisk ? 20 : 80;
        const riskPercentage = 100 - safePercentage;

        riskDistributionChart.data.datasets[0].data = [safePercentage, riskPercentage];
        riskDistributionChart.update();
    }

    // Update Radar Chart
    if (radarChart) {
        const normalizedData = [
            Math.min((userData.age || 50) / 100 * 100, 100),
            Math.min((userData.restingBP || 120) / 200 * 100, 100),
            Math.min((userData.cholesterol || 200) / 300 * 100, 100),
            Math.min((userData.maxHR || 150) / 200 * 100, 100),
            Math.min(((userData.oldpeak || 0) + 3) / 6 * 100, 100)
        ];

        radarChart.data.datasets[0].data = normalizedData;
        radarChart.update();
    }

    // Update timestamp
    const timestampElement = document.getElementById('last-prediction-time');
    if (timestampElement) {
        timestampElement.textContent = new Date().toLocaleString();
    }
}

// Update Health Summary dynamically
function updateHealthSummary(predictionText) {
    const status = document.getElementById('summary-status');
    const risk = document.getElementById('summary-risk');
    const checkup = document.getElementById('summary-checkup');
    const recommendation = document.getElementById('summary-recommendation');
    const statusIcon = document.getElementById('summary-status-icon');
    const riskIcon = document.getElementById('summary-risk-icon');
    const checkupIcon = document.querySelector('.summary-item:nth-child(3) i');
    const recommendationIcon = document.querySelector('.summary-item:nth-child(4) i');

    if (!status || !risk || !checkup || !recommendation || !statusIcon || !riskIcon || !checkupIcon || !recommendationIcon) return;

    if (predictionText && predictionText.includes('🚨')) {
        // Disease detected
        status.textContent = 'Poor';
        risk.textContent = 'High';
        checkup.textContent = 'Immediately';
        recommendation.textContent = 'Consult a cardiologist and adopt an emergency lifestyle change.';
        // Status icon: warning, red
        statusIcon.className = 'fas fa-exclamation-circle';
        statusIcon.style.color = '#e74c3c'; // red
        // Risk icon: warning, red
        riskIcon.className = 'fas fa-exclamation-triangle';
        riskIcon.style.color = '#e74c3c'; // red
        // Checkup icon: calendar, orange
        checkupIcon.className = 'fas fa-calendar-alt';
        checkupIcon.style.color = '#f39c12'; // orange
        // Recommendation icon: lightbulb, orange/red
        recommendationIcon.className = 'fas fa-lightbulb';
        recommendationIcon.style.color = '#e67e22'; // orange
    } else {
        // No disease
        status.textContent = 'Good';
        risk.textContent = 'Low';
        checkup.textContent = '6 months';
        recommendation.textContent = 'Maintain current lifestyle.';
        // Status icon: check, green
        statusIcon.className = 'fas fa-check-circle';
        statusIcon.style.color = '#2ecc71'; // green
        // Risk icon: info, blue
        riskIcon.className = 'fas fa-info-circle';
        riskIcon.style.color = '#3498db'; // blue
        // Checkup icon: calendar, orange
        checkupIcon.className = 'fas fa-calendar-alt';
        checkupIcon.style.color = '#f39c12'; // orange
        // Recommendation icon: lightbulb, blue/green
        recommendationIcon.className = 'fas fa-lightbulb';
        recommendationIcon.style.color = '#3498db'; // blue
    }
}

// Dashboard functionality
function showDashboard() {
    console.log('Showing dashboard...');
    const dashboard = document.getElementById('dashboard');
    if (dashboard) {
        dashboard.style.display = 'block';
        dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Update timestamp
        const timestamp = document.getElementById('last-prediction-time');
        if (timestamp) {
            timestamp.textContent = new Date().toLocaleString();
        }
        
        // Update Health Summary dynamically
        const predictionText = document.querySelector('.result-card h3')?.textContent || '';
        updateHealthSummary(predictionText);
        
        // Initialize all charts with a small delay to ensure DOM is ready
        setTimeout(() => {
            console.log('Initializing dashboard charts...');
            initializeDashboardCharts();
        }, 100);
    } else {
        console.error('Dashboard element not found');
    }
}

function initializeDashboardCharts() {
    console.log('Getting form data for charts...');
    // Get form data for charts
    const formData = getFormData();
    if (!formData) {
        console.log('No form data found, using default values');
        // Use default values if no form data
        formData = {
            Age: 50,
            RestingBP: 120,
            Cholesterol: 200,
            MaxHR: 150,
            Oldpeak: 0
        };
    }
    
    console.log('Form data:', formData);
    
    // Initialize each chart
    createVitalSignsChart(formData);
    createRiskDistributionChart(formData);
    createRadarChart(formData);
    createHeartRateChart(formData);
}

function getFormData() {
    const form = document.getElementById('predictionForm');
    if (!form) return null;
    
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = parseFloat(value) || 0;
    }
    
    return data;
}

// Chart creation functions
function createVitalSignsChart(formData) {
    if (!vitalSignsChart) return;
    
    const userValues = [
        formData.RestingBP || 120,
        formData.Cholesterol || 200,
        formData.MaxHR || 150
    ];
    
    const idealValues = [120, 200, 150];
    
    vitalSignsChart.data.datasets[0].data = userValues;
    vitalSignsChart.data.datasets[1].data = idealValues;
    vitalSignsChart.update();
}

function createRiskDistributionChart(formData) {
    if (!riskDistributionChart) return;
    
    // Calculate risk based on form data
    let riskPercentage = 20; // Default
    
    if (formData.RestingBP > 140) riskPercentage += 15;
    if (formData.Cholesterol > 240) riskPercentage += 15;
    if (formData.Age > 65) riskPercentage += 10;
    if (formData.MaxHR < 100) riskPercentage += 10;
    
    riskPercentage = Math.min(riskPercentage, 80);
    const safePercentage = 100 - riskPercentage;
    
    riskDistributionChart.data.datasets[0].data = [safePercentage, riskPercentage];
    riskDistributionChart.update();
}

function createRadarChart(formData) {
    if (!radarChart) return;
    
    const userProfile = [
        (formData.Age || 50) / 100 * 100,
        (formData.RestingBP || 120) / 200 * 100,
        (formData.Cholesterol || 200) / 300 * 100,
        (formData.MaxHR || 150) / 200 * 100,
        Math.abs(formData.Oldpeak || 0) / 5 * 100
    ];
    
    radarChart.data.datasets[0].data = userProfile;
    radarChart.update();
}

function createHeartRateChart(formData) {
    if (!heartRateChart) return;
    
    // Generate simulated heart rate data based on user's max HR
    const maxHR = formData.MaxHR || 150;
    const baseHR = maxHR * 0.6; // Resting heart rate
    const heartRateData = [
        baseHR + Math.random() * 20,
        baseHR + Math.random() * 30,
        baseHR + Math.random() * 25,
        baseHR + Math.random() * 40,
        baseHR + Math.random() * 35,
        baseHR + Math.random() * 20
    ];
    
    heartRateChart.data.datasets[0].data = heartRateData;
    heartRateChart.update();
}

// Add a button to manually show dashboard for testing
function addDashboardButton() {
    const resultCard = document.querySelector('.result-card');
    if (resultCard) {
        const actionButtons = resultCard.querySelector('.action-buttons') || resultCard.querySelector('.result-content');
        if (actionButtons) {
            const dashboardBtn = document.createElement('button');
            dashboardBtn.className = 'btn dashboard-btn';
            dashboardBtn.innerHTML = '<i class="fas fa-chart-bar"></i> Show Dashboard';
            dashboardBtn.onclick = function() {
                const predictionText = resultCard.querySelector('h3').textContent;
                const userData = {
                    restingBP: parseFloat(document.getElementById('RestingBP')?.value) || 120,
                    cholesterol: parseFloat(document.getElementById('Cholesterol')?.value) || 200,
                    maxHR: parseFloat(document.getElementById('MaxHR')?.value) || 150,
                    age: parseFloat(document.getElementById('Age')?.value) || 50,
                    oldpeak: parseFloat(document.getElementById('Oldpeak')?.value) || 0,
                    predictionResult: predictionText,
                    bmi: parseFloat(document.getElementById('bmi-number')?.textContent) || 22
                };
                showDashboard(userData);
            };
            actionButtons.appendChild(dashboardBtn);
        }
    }
}

// PDF Generation
document.getElementById('download-pdf')?.addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Heart Disease Prediction Report', 20, 20);
    
    // Add timestamp
    doc.setFontSize(12);
    const timestamp = new Date().toLocaleString();
    doc.text(`Generated on: ${timestamp}`, 20, 30);
    
    // Add prediction result
    doc.setFontSize(14);
    const predictionText = document.querySelector('.result-content h3').textContent;
    doc.text('Prediction Result:', 20, 45);
    doc.setFontSize(12);
    doc.text(predictionText, 20, 55);
    
    // Add BMI information if available
    const bmiNumber = document.getElementById('bmi-number').textContent;
    const bmiCategory = document.getElementById('bmi-text').textContent;
    
    if (bmiNumber !== '--') {
        doc.setFontSize(14);
        doc.text('BMI Information:', 20, 75);
        doc.setFontSize(12);
        doc.text(`BMI: ${bmiNumber}`, 20, 85);
        doc.text(`Category: ${bmiCategory}`, 20, 95);
    }
    
    // Add health recommendations
    doc.setFontSize(14);
    doc.text('Health Recommendations:', 20, 115);
    doc.setFontSize(12);
    const recommendations = [
        '1. Maintain a healthy diet rich in fruits and vegetables',
        '2. Exercise regularly (at least 30 minutes daily)',
        '3. Get adequate sleep (7-8 hours per night)',
        '4. Manage stress through relaxation techniques',
        '5. Regular health check-ups'
    ];
    
    recommendations.forEach((rec, index) => {
        doc.text(rec, 20, 125 + (index * 10));
    });
    
    // Save the PDF
    doc.save('heart-disease-prediction-report.pdf');
});

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing...');
    
    // Initialize charts
    initializeCharts();
    
    // Check if there's already a prediction result (page reload after form submission)
    const resultCard = document.querySelector('.result-card');
    if (resultCard) {
        console.log('Result card found, showing dashboard...');
        // If there's a result, show the dashboard with the data
        setTimeout(() => {
            showDashboard();
        }, 500);
    }
    
    // Add dashboard button event listener
    const dashboardBtn = document.getElementById('showDashboardBtn');
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', function() {
            console.log('Dashboard button clicked');
            showDashboard();
        });
    }

    // Standalone BMI calculator event listeners
    const bmiHeightInput = document.getElementById('bmi-height');
    const bmiWeightInput = document.getElementById('bmi-weight');
    if (bmiHeightInput && bmiWeightInput) {
        bmiHeightInput.addEventListener('input', bmiCalculatorStandalone);
        bmiWeightInput.addEventListener('input', bmiCalculatorStandalone);
    }
});

// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
});

// Show Dashboard button
document.getElementById('showDashboardBtn')?.addEventListener('click', function() {
    showDashboard();
});

// Standalone BMI Calculator logic
function bmiCalculatorStandalone() {
    const height = parseFloat(document.getElementById('bmi-height')?.value) / 100;
    const weight = parseFloat(document.getElementById('bmi-weight')?.value);
    const bmiNumber = document.getElementById('bmi-number');
    const bmiText = document.getElementById('bmi-text');
    if (height && weight) {
        const bmi = weight / (height * height);
        if (bmiNumber && bmiText) {
            bmiNumber.textContent = bmi.toFixed(1);
            let category = '';
            let categoryColor = '';
            if (bmi < 18.5) {
                category = 'Underweight';
                categoryColor = '#3498db';
            } else if (bmi < 25) {
                category = 'Normal weight';
                categoryColor = '#2ecc71';
            } else if (bmi < 30) {
                category = 'Overweight';
                categoryColor = '#f1c40f';
            } else {
                category = 'Obese';
                categoryColor = '#e74c3c';
            }
            bmiText.textContent = category;
            bmiText.style.color = categoryColor;
        }
    } else {
        if (bmiNumber) bmiNumber.textContent = '--';
        if (bmiText) {
            bmiText.textContent = '--';
            bmiText.style.color = '#666';
        }
    }
}
