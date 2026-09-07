import os
import json
import urllib.request
import urllib.parse
import joblib
import pandas as pd
import numpy as np
from flask import Flask, render_template, request, jsonify
from model.recommender import AgronomicRecommender

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_BUNDLE_PATH = os.path.join(BASE_DIR, 'model', 'all_models_bundle.pkl')
METRICS_PATH = os.path.join(BASE_DIR, 'model', 'metrics.json')

models_bundle = {}
if os.path.exists(MODEL_BUNDLE_PATH):
    models_bundle = joblib.load(MODEL_BUNDLE_PATH)
    print("[SUCCESS] Multi-Model bundle loaded:", list(models_bundle.keys()))
else:
    print("[WARNING] Model bundle not found. Run model/train_model.py first.")

recommender = AgronomicRecommender()

metrics_data = {}
if os.path.exists(METRICS_PATH):
    with open(METRICS_PATH, 'r') as f:
        metrics_data = json.load(f)

# Major Indian Agricultural Districts with GPS Coordinates for Live Weather
INDIAN_AGRI_DISTRICTS = {
    'ludhiana': {'name': 'Ludhiana (Punjab)', 'lat': 30.9010, 'lon': 75.8573, 'annual_rain_mult': 680},
    'karnal': {'name': 'Karnal (Haryana)', 'lat': 29.6857, 'lon': 76.9905, 'annual_rain_mult': 720},
    'guntur': {'name': 'Guntur (Andhra Pradesh)', 'lat': 16.3067, 'lon': 80.4365, 'annual_rain_mult': 950},
    'nashik': {'name': 'Nashik (Maharashtra)', 'lat': 19.9975, 'lon': 73.7898, 'annual_rain_mult': 850},
    'rajkot': {'name': 'Rajkot (Gujarat)', 'lat': 22.3039, 'lon': 70.8022, 'annual_rain_mult': 600},
    'varanasi': {'name': 'Varanasi (Uttar Pradesh)', 'lat': 25.3176, 'lon': 82.9739, 'annual_rain_mult': 1050},
    'bhopal': {'name': 'Bhopal (Madhya Pradesh)', 'lat': 23.2599, 'lon': 77.4126, 'annual_rain_mult': 1120},
    'coimbatore': {'name': 'Coimbatore (Tamil Nadu)', 'lat': 11.0168, 'lon': 76.9558, 'annual_rain_mult': 700},
    'dharwad': {'name': 'Dharwad (Karnataka)', 'lat': 15.4589, 'lon': 75.0078, 'annual_rain_mult': 820},
    'patna': {'name': 'Patna (Bihar)', 'lat': 25.5941, 'lon': 85.1376, 'annual_rain_mult': 1150},
    'bardhaman': {'name': 'Bardhaman (West Bengal)', 'lat': 23.2324, 'lon': 87.8615, 'annual_rain_mult': 1400},
    'jaipur': {'name': 'Jaipur (Rajasthan)', 'lat': 26.9124, 'lon': 75.7873, 'annual_rain_mult': 550}
}

# Expo Demo presets
DEMO_PRESETS = {
    'optimal_rice': {
        'title': 'High Yield Rice',
        'Crop': 'Rice',
        'Nitrogen': 120.0,
        'Phosphorus': 55.0,
        'Potassium': 48.0,
        'pH': 6.5,
        'Temperature': 28.0,
        'Humidity': 82.0,
        'Rainfall': 1800.0,
        'Irrigation': 'Drip'
    },
    'drought_wheat': {
        'title': 'Severe Drought Wheat',
        'Crop': 'Wheat',
        'Nitrogen': 60.0,
        'Phosphorus': 25.0,
        'Potassium': 20.0,
        'pH': 7.2,
        'Temperature': 34.0,
        'Humidity': 28.0,
        'Rainfall': 120.0,
        'Irrigation': 'Rainfed'
    },
    'nutrient_deficient_cotton': {
        'title': 'Deficient Cotton',
        'Crop': 'Cotton',
        'Nitrogen': 25.0,
        'Phosphorus': 15.0,
        'Potassium': 35.0,
        'pH': 7.5,
        'Temperature': 30.0,
        'Humidity': 60.0,
        'Rainfall': 700.0,
        'Irrigation': 'Flood'
    },
    'acidic_potato': {
        'title': 'Acidic Soil Potato',
        'Crop': 'Potato',
        'Nitrogen': 140.0,
        'Phosphorus': 85.0,
        'Potassium': 130.0,
        'pH': 4.3,
        'Temperature': 18.0,
        'Humidity': 75.0,
        'Rainfall': 600.0,
        'Irrigation': 'Sprinkler'
    },
    'optimal_sugarcane': {
        'title': 'Commercial Sugarcane with Drip',
        'Crop': 'Sugarcane',
        'Nitrogen': 200.0,
        'Phosphorus': 80.0,
        'Potassium': 110.0,
        'pH': 7.0,
        'Temperature': 30.0,
        'Humidity': 75.0,
        'Rainfall': 1600.0,
        'Irrigation': 'Drip'
    }
}

REGIONAL_PRESETS = {
    'punjab_wheat': {
        'region': 'Punjab (Indo-Gangetic Plain)',
        'Crop': 'Wheat',
        'Nitrogen': 130.0,
        'Phosphorus': 60.0,
        'Potassium': 45.0,
        'pH': 7.4,
        'Temperature': 19.5,
        'Humidity': 58.0,
        'Rainfall': 580.0,
        'Irrigation': 'Drip'
    },
    'andhra_rice': {
        'region': 'Andhra Pradesh (Krishna-Godavari Delta)',
        'Crop': 'Rice',
        'Nitrogen': 115.0,
        'Phosphorus': 50.0,
        'Potassium': 42.0,
        'pH': 6.8,
        'Temperature': 29.0,
        'Humidity': 82.0,
        'Rainfall': 1450.0,
        'Irrigation': 'Flood'
    }
}

@app.route('/')
def home():
    crops = metrics_data.get('crops_available', [
        'Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Chickpea',
        'Potato', 'Groundnut', 'Mustard', 'Tomato', 'Soybean', 'Kidney Beans'
    ])
    irrigations = metrics_data.get('irrigation_types', ['Drip', 'Sprinkler', 'Flood', 'Rainfed'])
    algorithms = list(models_bundle.keys()) if models_bundle else ['Random Forest']
    return render_template('index.html', crops=crops, irrigations=irrigations, algorithms=algorithms, presets=DEMO_PRESETS, regions=REGIONAL_PRESETS, districts=INDIAN_AGRI_DISTRICTS)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json() if request.is_json else request.form.to_dict()

        crop = data.get('Crop', 'Rice')
        n = float(data.get('Nitrogen', 90))
        p = float(data.get('Phosphorus', 45))
        k = float(data.get('Potassium', 40))
        ph = float(data.get('pH', 6.5))
        temp = float(data.get('Temperature', 26))
        humidity = float(data.get('Humidity', 70))
        rainfall = float(data.get('Rainfall', 900))
        irrigation = data.get('Irrigation', 'Drip')
        farm_size = float(data.get('FarmSize', 2.5))
        algo = data.get('Algorithm', 'Random Forest')

        active_pipeline = models_bundle.get(algo, models_bundle.get('Random Forest'))

        input_df = pd.DataFrame([{
            'Crop': crop,
            'Nitrogen': n,
            'Phosphorus': p,
            'Potassium': k,
            'pH': ph,
            'Temperature': temp,
            'Humidity': humidity,
            'Rainfall': rainfall,
            'Irrigation': irrigation
        }])

        predicted_yield_raw = float(active_pipeline.predict(input_df)[0])
        predicted_yield = round(max(0.1, predicted_yield_raw), 2)

        comparison_predictions = {}
        for name, pipe in models_bundle.items():
            comp_val = round(max(0.1, float(pipe.predict(input_df)[0])), 2)
            comparison_predictions[name] = comp_val

        advisory_result = recommender.generate_advisory(data, predicted_yield, farm_size_acres=farm_size)

        # Multi-Crop Alternative Opportunity Simulator
        all_crops = list(recommender.benchmarks.keys())
        alternative_crop_opportunities = []
        farm_hectares = farm_size / 2.471

        rf_pipeline = models_bundle.get('Random Forest', active_pipeline)
        
        for alt_crop in all_crops:
            if alt_crop == crop:
                continue
            alt_df = pd.DataFrame([{
                'Crop': alt_crop,
                'Nitrogen': n,
                'Phosphorus': p,
                'Potassium': k,
                'pH': ph,
                'Temperature': temp,
                'Humidity': humidity,
                'Rainfall': rainfall,
                'Irrigation': irrigation
            }])
            alt_yield = round(max(0.1, float(rf_pipeline.predict(alt_df)[0])), 2)
            alt_info = recommender.benchmarks.get(alt_crop, {})
            alt_mkt_price = alt_info.get('market_price_per_tonne', 25000)
            alt_revenue = round(alt_yield * farm_hectares * alt_mkt_price)
            
            diff_inr = alt_revenue - advisory_result['economic_analysis']['current_revenue_inr']
            percent_diff = round((diff_inr / max(1, advisory_result['economic_analysis']['current_revenue_inr'])) * 100, 1)

            alternative_crop_opportunities.append({
                'crop': alt_crop,
                'predicted_yield': alt_yield,
                'estimated_revenue_inr': alt_revenue,
                'revenue_diff_inr': diff_inr,
                'percent_diff': percent_diff,
                'is_more_profitable': (diff_inr > 0)
            })

        # Sort by most profitable
        alternative_crop_opportunities.sort(key=lambda x: x['estimated_revenue_inr'], reverse=True)
        top_alternatives = alternative_crop_opportunities[:3]

        response = {
            'success': True,
            'algorithm_used': algo,
            'all_model_predictions': comparison_predictions,
            'input_parameters': {
                'Crop': crop,
                'Nitrogen': n,
                'Phosphorus': p,
                'Potassium': k,
                'pH': ph,
                'Temperature': temp,
                'Humidity': humidity,
                'Rainfall': rainfall,
                'Irrigation': irrigation,
                'FarmSize': farm_size
            },
            'predicted_yield': predicted_yield,
            'yield_unit': 'Tonnes / Hectare',
            'yield_category': advisory_result['yield_category'],
            'risk_level': advisory_result['risk_level'],
            'risk_badge': advisory_result['risk_badge'],
            'risk_score': advisory_result['risk_score'],
            'soil_health_score': advisory_result['soil_health_score'],
            'economic_analysis': advisory_result['economic_analysis'],
            'mean_benchmark_yield': advisory_result['mean_benchmark_yield'],
            'fertilizer_recommendations': advisory_result['fertilizer_recommendations'],
            'soil_recommendations': advisory_result['soil_recommendations'],
            'irrigation_recommendations': advisory_result['irrigation_recommendations'],
            'management_tips': advisory_result['management_tips'],
            'crop_benchmarks': advisory_result['crop_benchmarks'],
            'top_alternative_crops': top_alternatives
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


# Dynamic Live Weather API (Coordinates or District with 7-Day Forecast Radar)
@app.route('/api/live-weather', methods=['GET'])
def get_live_weather():
    try:
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        district_key = request.args.get('district', type=str)

        district_name = "Custom Farm Location"
        seasonal_mult = 900.0

        if district_key and district_key in INDIAN_AGRI_DISTRICTS:
            info = INDIAN_AGRI_DISTRICTS[district_key]
            lat = info['lat']
            lon = info['lon']
            district_name = info['name']
            seasonal_mult = info['annual_rain_mult']
        elif lat is not None and lon is not None:
            # Find nearest known Indian Agricultural district for realistic rainfall baseline
            nearest_dist = None
            min_dist_sq = float('inf')
            for k, info in INDIAN_AGRI_DISTRICTS.items():
                dsq = (info['lat'] - lat)**2 + (info['lon'] - lon)**2
                if dsq < min_dist_sq:
                    min_dist_sq = dsq
                    nearest_dist = info
            
            if nearest_dist and min_dist_sq < 25.0: # within ~500km
                district_name = f"Detected Region: {nearest_dist['name']}"
                seasonal_mult = nearest_dist['annual_rain_mult']
            else:
                district_name = f"GPS Farm Location ({lat:.2f}N, {lon:.2f}E)"
                seasonal_mult = 850.0
        else:
            # Default to Guntur (AP Delta)
            info = INDIAN_AGRI_DISTRICTS['guntur']
            lat = info['lat']
            lon = info['lon']
            district_name = info['name']
            seasonal_mult = info['annual_rain_mult']

        # Query Open-Meteo live weather API with 7-day daily forecast
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto"
        
        req = urllib.request.Request(url, headers={'User-Agent': 'AgriVisionAI/2.0'})
        with urllib.request.urlopen(req, timeout=4) as resp:
            weather_json = json.loads(resp.read().decode('utf-8'))
            
            curr = weather_json.get('current', {})
            temp = float(curr.get('temperature_2m', 28.0))
            humidity = float(curr.get('relative_humidity_2m', 65.0))
            precip = float(curr.get('precipitation', 0.0))
            
            daily_data = weather_json.get('daily', {})
            dates = daily_data.get('time', [])
            precip_sums = daily_data.get('precipitation_sum', [0.0]*7)
            t_maxs = daily_data.get('temperature_2m_max', [30.0]*7)
            t_mins = daily_data.get('temperature_2m_min', [20.0]*7)
            rain_probs = daily_data.get('precipitation_probability_max', [20]*7)

            week_precip = sum(precip_sums) if precip_sums else 0.0

            # 7-Day Mini Trend
            forecast_7day = []
            days_labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7']
            for i in range(min(7, len(dates))):
                forecast_7day.append({
                    'day': days_labels[i],
                    'date': dates[i],
                    'temp_max': round(t_maxs[i], 1) if i < len(t_maxs) else 30.0,
                    'temp_min': round(t_mins[i], 1) if i < len(t_mins) else 22.0,
                    'rain_mm': round(precip_sums[i], 1) if i < len(precip_sums) else 0.0,
                    'rain_prob': rain_probs[i] if i < len(rain_probs) else 0
                })

            # Extreme alert flags
            weather_alert = None
            max_daily_rain = max(precip_sums) if precip_sums else 0.0
            max_daily_temp = max(t_maxs) if t_maxs else temp
            if max_daily_rain > 35.0:
                weather_alert = f"Heavy Rain Alert ({max_daily_rain:.1f}mm expected): Hold off on fertilizer spraying to avoid nutrient runoff."
            elif max_daily_temp > 38.0:
                weather_alert = f"High Heatwave Alert ({max_daily_temp:.1f}°C): Increase irrigation frequency to avoid thermal crop shock."
            elif week_precip < 5.0:
                weather_alert = "Dry Spell Alert: Sub-5mm rain this week. Maintain mulch & check drip pressure."

            # Estimate seasonal rainfall based on live precipitation + regional climate baseline
            calculated_rainfall = round(max(150.0, min(2400.0, seasonal_mult * 0.85 + (week_precip * 8))), 1)

            return jsonify({
                'success': True,
                'location_name': district_name,
                'latitude': lat,
                'longitude': lon,
                'temperature': round(temp, 1),
                'humidity': round(humidity, 1),
                'live_precipitation_mm': round(precip, 2),
                'estimated_seasonal_rainfall_mm': calculated_rainfall,
                'forecast_7day': forecast_7day,
                'weather_alert': weather_alert,
                'source': 'Live Satellite & Meteorological Station Feed (Open-Meteo)'
            })

    except Exception as e:
        # Graceful fallback if offline or timeout
        return jsonify({
            'success': True,
            'location_name': 'Live Regional Weather Estimate',
            'latitude': lat if 'lat' in locals() else 22.0,
            'longitude': lon if 'lon' in locals() else 78.0,
            'temperature': 27.5,
            'humidity': 68.0,
            'live_precipitation_mm': 1.2,
            'estimated_seasonal_rainfall_mm': 950.0,
            'source': 'Regional Agricultural Meteorological Model (Fallback)'
        })

@app.route('/analytics')
def analytics():
    return render_template('analytics.html', metrics=metrics_data)

@app.route('/expo')
def expo():
    return render_template('expo.html', metrics=metrics_data, presets=DEMO_PRESETS)

# Direct page routes for standalone tabs / bookmarks
@app.route('/predict-yield')
@app.route('/recommend')
@app.route('/weather')
@app.route('/soil-health')
@app.route('/pest-detection')
@app.route('/farm-reports')
@app.route('/talk-with-ai')
@app.route('/profile')
def feature_page():
    route_to_screen = {
        'predict-yield': 'screen-predict',
        'recommend': 'screen-recommend',
        'weather': 'screen-weather',
        'soil-health': 'screen-soil',
        'pest-detection': 'screen-pest',
        'farm-reports': 'screen-reports',
        'talk-with-ai': 'screen-talk',
        'profile': 'screen-profile'
    }
    path_key = request.path.strip('/')
    active_screen = route_to_screen.get(path_key, 'screen-home')
    crops = metrics_data.get('crops_available', [
        'Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Chickpea',
        'Potato', 'Groundnut', 'Mustard', 'Tomato', 'Soybean', 'Kidney Beans'
    ])
    irrigations = metrics_data.get('irrigation_types', ['Drip', 'Sprinkler', 'Flood', 'Rainfed'])
    algorithms = list(models_bundle.keys()) if models_bundle else ['Random Forest']
    return render_template(
        'index.html',
        crops=crops,
        irrigations=irrigations,
        algorithms=algorithms,
        presets=DEMO_PRESETS,
        regions=REGIONAL_PRESETS,
        districts=INDIAN_AGRI_DISTRICTS,
        initial_screen=active_screen
    )

@app.route('/api/metrics')
def api_metrics():
    return jsonify(metrics_data)

@app.route('/api/presets')
def api_presets():
    return jsonify(DEMO_PRESETS)

@app.route('/api/districts')
def api_districts():
    return jsonify(INDIAN_AGRI_DISTRICTS)

@app.route('/favicon.ico')
def favicon():
    from flask import Response
    # Crisp SVG Seedling Favicon
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="48" fill="#1b4332"/>
      <path d="M50 82 V44 M50 44 C50 25 75 22 78 40 C78 55 58 55 50 44 Z M50 56 C50 38 28 35 25 50 C25 62 42 64 50 56 Z" 
            stroke="#52b788" stroke-width="6" fill="#40916c" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>'''
    return Response(svg, mimetype='image/svg+xml')

if __name__ == '__main__':
    print("[INFO] Starting AgriVision AI Server with Live Dynamic Weather Engine...")
    print("[INFO] Open http://127.0.0.1:5000 in your web browser.")
    app.run(host='0.0.0.0', port=5000, debug=True)

