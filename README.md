# 🌱 AgriVision AI: AI-Based Low Crop Yield Prediction & Smart Advisory

> **B.Tech Mini Project & Project Expo 2026**  
> An end-to-end Machine Learning web application designed to forecast agricultural crop yield before harvest, assess crop stress risks, and provide actionable agronomic advisories to optimize farming practices.

---

## 📌 Abstract

Agriculture is the backbone of India's economy, and crop yield plays a crucial role in ensuring food security and farmers' livelihoods. However, crop production is significantly affected by factors such as soil fertility, weather conditions, rainfall, temperature, irrigation practices, fertilizer usage, and pest attacks. Traditional methods of estimating crop yield are often inaccurate and rely heavily on farmers' experience, leading to poor decision-making and reduced productivity.

The **AI-Based Low Crop Yield Prediction** system aims to address this challenge by using **Artificial Intelligence (AI)** and **Machine Learning (ML)** techniques to predict crop yield accurately before harvest. The proposed system analyzes agricultural parameters such as soil nutrients ($N, P, K, pH$), rainfall, temperature, humidity, irrigation methods, and historical crop yield data to identify patterns influencing crop production. Based on these inputs, the machine learning model predicts the expected crop yield and provides recommendations to improve farming practices.

The system also assists farmers by suggesting suitable irrigation schedules, balanced fertilizer usage (Urea, DAP, MOP), soil pH amendments (Lime/Gypsum), and preventive measures against potential risks affecting crop growth. By providing early predictions and actionable insights, the project enables farmers to make informed decisions, optimize resource utilization, and reduce crop losses.

---

## 🏗️ System Architecture

```
[Farmer / Agronomist Input]
   │ (Soil NPK, pH, Temperature, Humidity, Rainfall, Irrigation)
   ▼
[Data Preprocessing Pipeline]
   │ (StandardScaler + One-Hot Encoding)
   ▼
[Trained Machine Learning Model]
   │ (Random Forest Regressor — R²: 99.57%, MAE: 0.39 t/ha)
   ▼
[Crop Yield Prediction & Risk Index]
   │
   ▼
[Agronomic Recommendation Engine]
   │ (Nutrient Gap Analysis, Soil Conditioning, Irrigation Scheduling)
   ▼
[Interactive Dashboard & Exportable Farm Report]
```

---

## 📊 Machine Learning Model Benchmarks

Trained on a calibrated multi-crop agricultural dataset (3,600 samples across 12 major Indian crops: *Rice, Wheat, Maize, Cotton, Sugarcane, Chickpea, Potato, Groundnut, Mustard, Tomato, Soybean, Kidney Beans*):

| Algorithm | $R^2$ Score | Mean Absolute Error (MAE) | Root Mean Squared Error (RMSE) | 5-Fold Cross Validation $R^2$ |
| :--- | :--- | :--- | :--- | :--- |
| 🏆 **Random Forest Regressor** | **99.57%** | **0.3934 t/ha** | **0.8636 t/ha** | **99.43% (±0.002)** |
| 🥈 **Gradient Boosting Regressor** | 99.48% | 0.3786 t/ha | 0.9497 t/ha | 99.52% (±0.002) |
| 🥉 **Decision Tree Regressor** | 99.14% | 0.4887 t/ha | 1.2226 t/ha | 98.95% (±0.004) |
| 📉 **Linear Regression (Baseline)** | 97.14% | 1.2787 t/ha | 2.2301 t/ha | 97.10% (±0.005) |

---

## 🚀 How to Run the Project

### 1. Prerequisites
Ensure Python 3.10+ is installed on your system.

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. (Optional) Re-generate Dataset & Train Model
```bash
python dataset/generate_dataset.py
python model/train_model.py
```

### 4. Start Flask Web Server
```bash
python app.py
```
Open your browser and navigate to: **`http://127.0.0.1:5000`**

---

## 📂 Project Directory Structure

```
community service project/
├── dataset/
│   ├── generate_dataset.py         # Agricultural dataset synthesis script
│   └── crop_yield_real_data.csv    # Calibrated dataset (3,600 records)
├── model/
│   ├── train_model.py              # ML training & comparative evaluation pipeline
│   ├── recommender.py              # Agronomic advisory & nutrient gap logic
│   ├── crop_yield_model.pkl        # Serialized best trained pipeline
│   ├── metrics.json                # Model accuracy scores and feature importance
│   └── crop_benchmarks.json        # ICAR optimal thresholds per crop
├── static/
│   ├── css/
│   │   └── style.css               # Agricultural dashboard stylesheet
│   └── js/
│       └── app.js                  # Dynamic form submission & Chart.js radar visuals
├── templates/
│   ├── index.html                  # Main interactive prediction dashboard (FR1, FR5)
│   ├── analytics.html              # Model metrics & feature importance breakdown
│   └── expo.html                   # Project Expo judging & presentation mode
├── app.py                          # Flask application backend & API
├── requirements.txt                # Dependencies
└── README.md                       # Documentation & Project Guide
```

---

## 🌟 Key Features Implemented (PRD Compliance)

- **FR1 (User Input)**: 9 parameters covering Soil $N, P, K, pH$, Temperature, Humidity, Rainfall, Irrigation method, and Crop selection, with 1-click live demo presets.
- **FR2 (Data Processing)**: Preprocessing pipeline with `StandardScaler` and `OneHotEncoder`.
- **FR3 (Prediction Engine)**: Accurate continuous regression with Random Forest.
- **FR4 (Recommendation System)**:
  - Precise nutrient gap recommendations in terms of commercial fertilizer dosages (Urea, DAP, MOP).
  - Soil pH amendment (Lime for acidic soil, Gypsum for alkaline soil).
  - Irrigation and humidity/pest management alerts.
- **FR5 (Dashboard & Expo Mode)**: Modern responsive interface, Chart.js balance charts, Risk Meter, and 1-click printable farm reports.
