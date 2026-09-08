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
    # ── Andhra Pradesh ──
    'guntur': {'name': 'Guntur (Andhra Pradesh)', 'lat': 16.3067, 'lon': 80.4365, 'annual_rain_mult': 950},
    'krishna': {'name': 'Krishna / Vijayawada (Andhra Pradesh)', 'lat': 16.5062, 'lon': 80.6480, 'annual_rain_mult': 1000},
    'east_godavari': {'name': 'East Godavari / Kakinada (Andhra Pradesh)', 'lat': 16.9891, 'lon': 82.2475, 'annual_rain_mult': 1150},
    'west_godavari': {'name': 'West Godavari / Eluru (Andhra Pradesh)', 'lat': 16.7107, 'lon': 81.0952, 'annual_rain_mult': 1100},
    'visakhapatnam': {'name': 'Visakhapatnam (Andhra Pradesh)', 'lat': 17.6868, 'lon': 83.2185, 'annual_rain_mult': 1050},
    'kurnool': {'name': 'Kurnool (Andhra Pradesh)', 'lat': 15.8281, 'lon': 78.0373, 'annual_rain_mult': 670},
    'anantapur': {'name': 'Anantapur (Andhra Pradesh)', 'lat': 14.6819, 'lon': 77.6006, 'annual_rain_mult': 550},
    'chittoor': {'name': 'Chittoor / Tirupati (Andhra Pradesh)', 'lat': 13.2172, 'lon': 79.1003, 'annual_rain_mult': 880},
    'prakasam': {'name': 'Prakasam / Ongole (Andhra Pradesh)', 'lat': 15.5057, 'lon': 80.0499, 'annual_rain_mult': 820},
    'nellore': {'name': 'Nellore (Andhra Pradesh)', 'lat': 14.4426, 'lon': 79.9865, 'annual_rain_mult': 1050},
    'kadapa': {'name': 'YSR Kadapa (Andhra Pradesh)', 'lat': 14.4673, 'lon': 78.8242, 'annual_rain_mult': 700},
    'srikakulam': {'name': 'Srikakulam (Andhra Pradesh)', 'lat': 18.2949, 'lon': 83.8938, 'annual_rain_mult': 1100},
    'vizianagaram': {'name': 'Vizianagaram (Andhra Pradesh)', 'lat': 18.1067, 'lon': 83.3956, 'annual_rain_mult': 1080},

    # ── Telangana ──
    'hyderabad': {'name': 'Hyderabad (Telangana)', 'lat': 17.3850, 'lon': 78.4867, 'annual_rain_mult': 820},
    'warangal': {'name': 'Warangal (Telangana)', 'lat': 17.9689, 'lon': 79.5941, 'annual_rain_mult': 980},
    'karimnagar': {'name': 'Karimnagar (Telangana)', 'lat': 18.4386, 'lon': 79.1288, 'annual_rain_mult': 950},
    'khammam': {'name': 'Khammam (Telangana)', 'lat': 17.2473, 'lon': 80.1514, 'annual_rain_mult': 1050},
    'nizamabad': {'name': 'Nizamabad (Telangana)', 'lat': 18.6725, 'lon': 78.0941, 'annual_rain_mult': 960},
    'nalgonda': {'name': 'Nalgonda (Telangana)', 'lat': 17.0577, 'lon': 79.2684, 'annual_rain_mult': 750},
    'mahabubnagar': {'name': 'Mahabubnagar (Telangana)', 'lat': 16.7488, 'lon': 77.9856, 'annual_rain_mult': 700},

    # ── Punjab & Haryana ──
    'ludhiana': {'name': 'Ludhiana (Punjab)', 'lat': 30.9010, 'lon': 75.8573, 'annual_rain_mult': 680},
    'amritsar': {'name': 'Amritsar (Punjab)', 'lat': 31.6340, 'lon': 74.8723, 'annual_rain_mult': 700},
    'bathinda': {'name': 'Bathinda (Punjab)', 'lat': 30.2110, 'lon': 74.9455, 'annual_rain_mult': 420},
    'jalandhar': {'name': 'Jalandhar (Punjab)', 'lat': 31.3260, 'lon': 75.5762, 'annual_rain_mult': 710},
    'patiala': {'name': 'Patiala (Punjab)', 'lat': 30.3398, 'lon': 76.3869, 'annual_rain_mult': 690},
    'karnal': {'name': 'Karnal (Haryana)', 'lat': 29.6857, 'lon': 76.9905, 'annual_rain_mult': 720},
    'hisar': {'name': 'Hisar (Haryana)', 'lat': 29.1492, 'lon': 75.7217, 'annual_rain_mult': 450},
    'ambala': {'name': 'Ambala (Haryana)', 'lat': 30.3782, 'lon': 76.7767, 'annual_rain_mult': 850},
    'sirsa': {'name': 'Sirsa (Haryana)', 'lat': 29.5349, 'lon': 75.0290, 'annual_rain_mult': 350},

    # ── Maharashtra ──
    'nashik': {'name': 'Nashik (Maharashtra)', 'lat': 19.9975, 'lon': 73.7898, 'annual_rain_mult': 850},
    'pune': {'name': 'Pune (Maharashtra)', 'lat': 18.5204, 'lon': 73.8567, 'annual_rain_mult': 750},
    'nagpur': {'name': 'Nagpur (Maharashtra)', 'lat': 21.1458, 'lon': 79.0882, 'annual_rain_mult': 1100},
    'aurangabad': {'name': 'Chhatrapati Sambhajinagar / Aurangabad (Maharashtra)', 'lat': 19.8762, 'lon': 75.3433, 'annual_rain_mult': 720},
    'kolhapur': {'name': 'Kolhapur (Maharashtra)', 'lat': 16.7050, 'lon': 74.2433, 'annual_rain_mult': 1050},
    'solapur': {'name': 'Solapur (Maharashtra)', 'lat': 17.6599, 'lon': 75.9064, 'annual_rain_mult': 580},
    'amravati': {'name': 'Amravati (Maharashtra)', 'lat': 20.9320, 'lon': 77.7523, 'annual_rain_mult': 880},

    # ── Gujarat ──
    'rajkot': {'name': 'Rajkot (Gujarat)', 'lat': 22.3039, 'lon': 70.8022, 'annual_rain_mult': 600},
    'ahmedabad': {'name': 'Ahmedabad (Gujarat)', 'lat': 23.0225, 'lon': 72.5714, 'annual_rain_mult': 780},
    'surat': {'name': 'Surat (Gujarat)', 'lat': 21.1702, 'lon': 72.8311, 'annual_rain_mult': 1200},
    'vadodara': {'name': 'Vadodara (Gujarat)', 'lat': 22.3072, 'lon': 73.1812, 'annual_rain_mult': 850},
    'anand': {'name': 'Anand (Gujarat)', 'lat': 22.5645, 'lon': 72.9289, 'annual_rain_mult': 820},
    'junagadh': {'name': 'Junagadh (Gujarat)', 'lat': 21.5222, 'lon': 70.4579, 'annual_rain_mult': 750},

    # ── Uttar Pradesh & Bihar ──
    'varanasi': {'name': 'Varanasi (Uttar Pradesh)', 'lat': 25.3176, 'lon': 82.9739, 'annual_rain_mult': 1050},
    'lucknow': {'name': 'Lucknow (Uttar Pradesh)', 'lat': 26.8467, 'lon': 80.9462, 'annual_rain_mult': 980},
    'kanpur': {'name': 'Kanpur (Uttar Pradesh)', 'lat': 26.4499, 'lon': 80.3319, 'annual_rain_mult': 880},
    'agra': {'name': 'Agra (Uttar Pradesh)', 'lat': 27.1767, 'lon': 78.0081, 'annual_rain_mult': 680},
    'prayagraj': {'name': 'Prayagraj / Allahabad (Uttar Pradesh)', 'lat': 25.4358, 'lon': 81.8463, 'annual_rain_mult': 950},
    'gorakhpur': {'name': 'Gorakhpur (Uttar Pradesh)', 'lat': 26.7606, 'lon': 83.3732, 'annual_rain_mult': 1250},
    'meerut': {'name': 'Meerut (Uttar Pradesh)', 'lat': 28.9845, 'lon': 77.7064, 'annual_rain_mult': 820},
    'patna': {'name': 'Patna (Bihar)', 'lat': 25.5941, 'lon': 85.1376, 'annual_rain_mult': 1150},
    'muzaffarpur': {'name': 'Muzaffarpur (Bihar)', 'lat': 26.1209, 'lon': 85.3647, 'annual_rain_mult': 1200},
    'gaya': {'name': 'Gaya (Bihar)', 'lat': 24.7955, 'lon': 85.0002, 'annual_rain_mult': 1050},
    'bhagalpur': {'name': 'Bhagalpur (Bihar)', 'lat': 25.2425, 'lon': 86.9842, 'annual_rain_mult': 1200},

    # ── Madhya Pradesh ──
    'bhopal': {'name': 'Bhopal (Madhya Pradesh)', 'lat': 23.2599, 'lon': 77.4126, 'annual_rain_mult': 1120},
    'indore': {'name': 'Indore (Madhya Pradesh)', 'lat': 22.7196, 'lon': 75.8577, 'annual_rain_mult': 950},
    'jabalpur': {'name': 'Jabalpur (Madhya Pradesh)', 'lat': 23.1815, 'lon': 79.9864, 'annual_rain_mult': 1250},
    'ujjain': {'name': 'Ujjain (Madhya Pradesh)', 'lat': 23.1765, 'lon': 75.7885, 'annual_rain_mult': 900},
    'gwalior': {'name': 'Gwalior (Madhya Pradesh)', 'lat': 26.2183, 'lon': 78.1828, 'annual_rain_mult': 750},

    # ── Tamil Nadu & Kerala ──
    'coimbatore': {'name': 'Coimbatore (Tamil Nadu)', 'lat': 11.0168, 'lon': 76.9558, 'annual_rain_mult': 700},
    'thanjavur': {'name': 'Thanjavur (Tamil Nadu)', 'lat': 10.7870, 'lon': 79.1378, 'annual_rain_mult': 1000},
    'madurai': {'name': 'Madurai (Tamil Nadu)', 'lat': 9.9252, 'lon': 78.1198, 'annual_rain_mult': 850},
    'tiruchirappalli': {'name': 'Tiruchirappalli (Tamil Nadu)', 'lat': 10.7905, 'lon': 78.7047, 'annual_rain_mult': 880},
    'salem': {'name': 'Salem (Tamil Nadu)', 'lat': 11.6643, 'lon': 78.1460, 'annual_rain_mult': 920},
    'palakkad': {'name': 'Palakkad (Kerala)', 'lat': 10.7867, 'lon': 76.6548, 'annual_rain_mult': 2100},
    'wayanad': {'name': 'Wayanad (Kerala)', 'lat': 11.6854, 'lon': 76.1320, 'annual_rain_mult': 2500},

    # ── Karnataka ──
    'dharwad': {'name': 'Dharwad (Karnataka)', 'lat': 15.4589, 'lon': 75.0078, 'annual_rain_mult': 820},
    'belagavi': {'name': 'Belagavi (Karnataka)', 'lat': 15.8497, 'lon': 74.4977, 'annual_rain_mult': 1150},
    'mysuru': {'name': 'Mysuru (Karnataka)', 'lat': 12.2958, 'lon': 76.6394, 'annual_rain_mult': 800},
    'mandya': {'name': 'Mandya (Karnataka)', 'lat': 12.5218, 'lon': 76.8951, 'annual_rain_mult': 750},
    'shivamogga': {'name': 'Shivamogga (Karnataka)', 'lat': 13.9299, 'lon': 75.5681, 'annual_rain_mult': 1800},
    'bellary': {'name': 'Ballari (Karnataka)', 'lat': 15.1394, 'lon': 76.9214, 'annual_rain_mult': 580},

    # ── Rajasthan ──
    'jaipur': {'name': 'Jaipur (Rajasthan)', 'lat': 26.9124, 'lon': 75.7873, 'annual_rain_mult': 550},
    'jodhpur': {'name': 'Jodhpur (Rajasthan)', 'lat': 26.2389, 'lon': 73.0243, 'annual_rain_mult': 360},
    'kota': {'name': 'Kota (Rajasthan)', 'lat': 25.2138, 'lon': 75.8648, 'annual_rain_mult': 750},
    'bikaner': {'name': 'Bikaner (Rajasthan)', 'lat': 28.0229, 'lon': 73.3119, 'annual_rain_mult': 260},
    'sri_ganganagar': {'name': 'Sri Ganganagar (Rajasthan)', 'lat': 29.9094, 'lon': 73.8799, 'annual_rain_mult': 300},

    # ── West Bengal & Odisha ──
    'bardhaman': {'name': 'Purba Bardhaman (West Bengal)', 'lat': 23.2324, 'lon': 87.8615, 'annual_rain_mult': 1400},
    'hooghly': {'name': 'Hooghly (West Bengal)', 'lat': 22.9034, 'lon': 88.3968, 'annual_rain_mult': 1450},
    'murshidabad': {'name': 'Murshidabad (West Bengal)', 'lat': 24.1759, 'lon': 88.2802, 'annual_rain_mult': 1350},
    'cuttack': {'name': 'Cuttack (Odisha)', 'lat': 20.4625, 'lon': 85.8828, 'annual_rain_mult': 1450},
    'sambalpur': {'name': 'Sambalpur (Odisha)', 'lat': 21.4669, 'lon': 83.9812, 'annual_rain_mult': 1380}
}

# Group districts by state for organized <optgroup> dropdowns
DISTRICTS_BY_STATE = {}
for code, info in INDIAN_AGRI_DISTRICTS.items():
    raw_name = info['name']
    if '(' in raw_name and ')' in raw_name:
        state = raw_name.rsplit('(', 1)[1].rstrip(')').strip()
        label = raw_name.rsplit('(', 1)[0].strip()
    else:
        state = 'Other'
        label = raw_name
    DISTRICTS_BY_STATE.setdefault(state, []).append({
        'code': code,
        'name': raw_name,
        'label': label
    })

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
    return render_template('index.html', crops=crops, irrigations=irrigations, algorithms=algorithms, presets=DEMO_PRESETS, regions=REGIONAL_PRESETS, districts=INDIAN_AGRI_DISTRICTS, districts_by_state=DISTRICTS_BY_STATE, initial_screen='screen-home')

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
        districts_by_state=DISTRICTS_BY_STATE,
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

PEST_DIAGNOSIS_DATABASE = {
    'Rice': {
        'blast': {
            'name': 'Rice Leaf Blast (Magnaporthe oryzae)',
            'name_te': 'వరి మెడ విరుపు / అగ్గి తెగులు',
            'name_hi': 'धान का ब्लास्ट रोग (अग्नि रोग)',
            'severity': 'high',
            'confidence': 95,
            'visual_traits': 'Diamond-shaped spindle lesions with grayish centers and brown borders on leaf blades.',
            'treatments': [
                {'spray': 'Tricyclazole 75% WP', 'dosage': '0.6g per liter (120g/acre in 200L water)', 'stage': 'Apply at first sign of leaf spots before tillering.'},
                {'spray': 'Kasugamycin 3% SL', 'dosage': '2.5ml per liter of water (500ml/acre)', 'stage': 'Alternate spray if infection spreads in humid weather.'},
                {'spray': 'Urea Management', 'dosage': 'Reduce basal Nitrogen application by 25%', 'stage': 'Avoid excess urea application during overcast days.'}
            ],
            'prevention': [
                'Sow blast-resistant varieties such as MTU 1010, NLR 34449, or BPT 5204.',
                'Seed treatment with Carbendazim 50% WP @ 2g per kg seed prior to nursery preparation.',
                'Maintain standing water depth of 2-3 cm during active tillering to suppress spore germination.'
            ]
        },
        'stem_borer': {
            'name': 'Yellow Stem Borer (Scirpophaga incertulas)',
            'name_te': 'వరి కాండం తొలుచు పురుగు',
            'name_hi': 'धान का तना छेदक कीट',
            'severity': 'high',
            'confidence': 93,
            'visual_traits': 'Dead-heart central shoot drying and white empty panicles (chaffy heads).',
            'treatments': [
                {'spray': 'Chlorantraniliprole 0.4% G (Ferterra)', 'dosage': '4 kg per acre broadcast with sand', 'stage': 'Apply 20-25 days after transplanting.'},
                {'spray': 'Cartap Hydrochloride 50% SP', 'dosage': '2.0g per liter of water (400g/acre)', 'stage': 'Foliar spray when egg masses exceed 1 per sq meter.'}
            ],
            'prevention': [
                'Install 5 pheromone traps per acre for adult moth monitoring.',
                'Clip top 2 cm of seedling leaves before transplanting to eliminate egg clusters.',
                'Harvest crop close to ground level and burn stubbles to eliminate overwintering larvae.'
            ]
        },
        'default': {
            'name': 'Brown Plant Hopper (Nilaparvata lugens)',
            'name_te': 'వరి సుడి దోమ తెగులు',
            'name_hi': 'भूरा पौधा फुदका (BPH)',
            'severity': 'high',
            'confidence': 91,
            'visual_traits': 'Hopper-burn circular yellow-to-brown patches at lower stem base.',
            'treatments': [
                {'spray': 'Pymetrozine 50% WG', 'dosage': '120g per acre in 200L water', 'stage': 'Target spray directly at the base of hill stems.'},
                {'spray': 'Triflumezopyrim 10% SC', 'dosage': '94ml per acre', 'stage': 'Single protective spray at early hopper nymph infestation.'}
            ],
            'prevention': [
                'Provide 30cm wide alleyways every 2 meters for aeration and sunlight.',
                'Drain field water completely for 3 to 4 days to disrupt nymph survival.'
            ]
        }
    },
    'Cotton': {
        'bollworm': {
            'name': 'Pink Bollworm (Pectinophora gossypiella)',
            'name_te': 'పత్తి గులాబీ రంగు కాయ తొలిచే పురుగు',
            'name_hi': 'कपास का गुलाबी सूंडी रोग',
            'severity': 'high',
            'confidence': 97,
            'visual_traits': 'Rosetted flowers, entry holes in green bolls, and internal lint staining.',
            'treatments': [
                {'spray': 'Emamectin Benzoate 5% SG', 'dosage': '0.5g per liter (100g/acre)', 'stage': 'Spray at 60-70 days after sowing at flowering peak.'},
                {'spray': 'Profenofos 50% EC', 'dosage': '2.0ml per liter (400ml/acre)', 'stage': 'Alternate spray for ovicidal action against egg clusters.'}
            ],
            'prevention': [
                'Install 8-10 PBW Gossyplure pheromone traps per acre.',
                'Release Trichogramma bacterae egg parasitoids @ 60,000 per acre at weekly intervals.',
                'Avoid extending crop season beyond December to stop pest carryover.'
            ]
        },
        'aphids': {
            'name': 'Cotton Aphids & Whiteflies (Bemisia tabaci)',
            'name_te': 'పత్తి తామర పురుగులు మరియు తెల్లదోమ',
            'name_hi': 'कपास का सफेद मक्खी और चेपा रोग',
            'severity': 'medium',
            'confidence': 92,
            'visual_traits': 'Downward leaf curling, shiny honeydew secretion, and black sooty mold growth.',
            'treatments': [
                {'spray': 'Afidopyropen 50 g/L DC', 'dosage': '2.0ml per liter (400ml/acre)', 'stage': 'Foliar spray when whitefly adults exceed 5 per leaf.'},
                {'spray': 'Flonicamid 50% WG', 'dosage': '0.4g per liter (80g/acre)', 'stage': 'Spray for systemic protection of young foliage.'}
            ],
            'prevention': [
                'Erect yellow & blue sticky traps @ 20 traps per acre.',
                'Spray Neem Seed Kernel Extract (NSKE 5%) as natural repellent.'
            ]
        },
        'default': {
            'name': 'Cotton Bacterial Leaf Blight (Xanthomonas citri pv. malvacearum)',
            'name_te': 'పత్తి బాక్టీరియా ఆకు మచ్చ తెగులు',
            'name_hi': 'कपास का जीवाणु अंगमारी रोग',
            'severity': 'medium',
            'confidence': 88,
            'visual_traits': 'Angular water-soaked dark brown leaf lesions following leaf veins.',
            'treatments': [
                {'spray': 'Copper Oxychloride 50% WP + Streptocycline', 'dosage': '3g COC + 0.1g Streptocycline per liter water', 'stage': 'Spray 2-3 times at 12-day intervals.'}
            ],
            'prevention': [
                'Acid delinting of seeds prior to planting.',
                'Crop rotation with non-host crops like Maize or Sorghum.'
            ]
        }
    },
    'Wheat': {
        'rust': {
            'name': 'Brown Leaf Rust (Puccinia triticina)',
            'name_te': 'గోధుమ ఆకు తుప్పు తెగులు',
            'name_hi': 'गेहूं का भूरा रतुआ (गेरुई रोग)',
            'severity': 'high',
            'confidence': 96,
            'visual_traits': 'Small round orange-brown pustules randomly scattered on leaf upper surface.',
            'treatments': [
                {'spray': 'Propiconazole 25% EC (Tilt)', 'dosage': '1.0ml per liter (200ml/acre in 200L water)', 'stage': 'Spray immediately at first appearance of rust spots.'},
                {'spray': 'Tebuconazole 25.9% EC', 'dosage': '1.0ml per liter', 'stage': 'Repeat spray after 15 days if cloudy weather continues.'}
            ],
            'prevention': [
                'Sow rust-resistant wheat varieties like HD-2967, DBW-187, or PBW-550.',
                'Avoid late sowing beyond November 25th.'
            ]
        },
        'default': {
            'name': 'Wheat Loose Smut (Ustilago nuda)',
            'name_te': 'గోధుమ కాటుక తెగులు',
            'name_hi': 'गेहूं का कण्डवा रोग (काली बाली)',
            'severity': 'medium',
            'confidence': 89,
            'visual_traits': 'Black powdery spore mass replacing grain kernels in earheads.',
            'treatments': [
                {'spray': 'Carboxin 75% WP (Vitavax)', 'dosage': '2.5g per kg seed treatment', 'stage': 'Treat seed prior to sowing.'}
            ],
            'prevention': [
                'Solar heat seed treatment in May-June.',
                'Use certified disease-free seed stock.'
            ]
        }
    },
    'Maize': {
        'bollworm': {
            'name': 'Fall Armyworm (Spodoptera frugiperda)',
            'name_te': 'మొక్కజొన్న కత్తెర పురుగు',
            'name_hi': 'मक्का का फॉल आर्मीवर्म कीट',
            'severity': 'high',
            'confidence': 97,
            'visual_traits': 'Severe whorl damage, ragged leaf holes, and dense sawdust-like frass in central whorls.',
            'treatments': [
                {'spray': 'Chlorantraniliprole 18.5% SC', 'dosage': '0.4ml per liter (80ml/acre)', 'stage': 'Apply directly into central plant whorls.'},
                {'spray': 'Emamectin Benzoate 5% SG', 'dosage': '0.4g per liter (80g/acre)', 'stage': 'Whorl drenching at early larval instars (1-3 weeks).'}
            ],
            'prevention': [
                'Apply dry sand mixed with wood ash (9:1 ratio) into central whorls to suffocate larvae.',
                'Install 5 FAW pheromone traps per acre at 10-15 days after germination.'
            ]
        },
        'default': {
            'name': 'Maize Turcicum Leaf Blight (Exserohilum turcicum)',
            'name_te': 'మొక్కజొన్న ఆకు ఎండు తెగులు',
            'name_hi': 'मक्का का तुर्सिकम झुलसा रोग',
            'severity': 'medium',
            'confidence': 90,
            'visual_traits': 'Long elliptical gray-green to tan leaf lesions (2-15 cm length).',
            'treatments': [
                {'spray': 'Mancozeb 75% WP', 'dosage': '2.5g per liter of water', 'stage': 'Spray at early lesion development.'},
                {'spray': 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC', 'dosage': '1.0ml per liter', 'stage': 'Apply at tasseling stage if disease severity rises.'}
            ],
            'prevention': [
                'Crop rotation with legumes (Soybean, Chickpea).',
                'Apply balanced Potassium fertilizer to build cell wall resistance.'
            ]
        }
    },
    'Tomato': {
        'blast': {
            'name': 'Tomato Early Blight (Alternaria solani)',
            'name_te': 'టమాట ముందస్తు మచ్చ తెగులు',
            'name_hi': 'टमाटर का अगेती झुलसा रोग',
            'severity': 'high',
            'confidence': 95,
            'visual_traits': 'Dark brown concentric ring target spots surrounded by yellow halos on lower leaves.',
            'treatments': [
                {'spray': 'Mancozeb 75% WP', 'dosage': '2.5g per liter water', 'stage': 'Spray at first lower leaf spots.'},
                {'spray': 'Chlorothalonil 75% WP', 'dosage': '2.0g per liter water', 'stage': 'Alternate fungicide spray every 10-14 days.'}
            ],
            'prevention': [
                'Mulch soil surface with straw or black plastic to reduce rain-splash spore transmission.',
                'Prune lower 15 cm leaves touching the soil surface.'
            ]
        },
        'aphids': {
            'name': 'Tomato Leaf Curl Virus Vector & Whitefly',
            'name_te': 'టమాట ఆకుముడత వైరస్ మరియు తెల్లదోమ',
            'name_hi': 'टमाटर का पर्ण कुंचन रोग और सफेद मक्खी',
            'severity': 'high',
            'confidence': 94,
            'visual_traits': 'Upward cupping, yellowing of leaf margins, and stunted bushy growth.',
            'treatments': [
                {'spray': 'Cyantraniliprole 10.26% OD', 'dosage': '1.8ml per liter (360ml/acre)', 'stage': 'Foliar spray at early vector sighting.'},
                {'spray': 'Diafenthiuron 50% WP', 'dosage': '1.0g per liter', 'stage': 'Alternate spray for whitefly nymph knock-down.'}
            ],
            'prevention': [
                'Erect 2 rows of barrier Maize or Sorghum around tomato plots.',
                'Use 50-mesh insect-proof net in nursery beds.'
            ]
        },
        'default': {
            'name': 'Tomato Fruit Borer (Helicoverpa armigera)',
            'name_te': 'టమాట కాయ తొలిచే పురుగు',
            'name_hi': 'टमाटर का फल छेदक कीट',
            'severity': 'high',
            'confidence': 91,
            'visual_traits': 'Circular bore-holes near fruit stem calyx with half-submerged larva.',
            'treatments': [
                {'spray': 'Indoxacarb 14.5% SC', 'dosage': '1.0ml per liter water', 'stage': 'Spray at flowering to fruit-set transition.'}
            ],
            'prevention': [
                'Plant African Marigold as trap crop (1 row every 16 tomato rows).'
            ]
        }
    },
    'Groundnut': {
        'rust': {
            'name': 'Groundnut Tikka Leaf Spot & Rust',
            'name_te': 'వేరుశనగ తిక్క ఆకు మచ్చ మరియు తుప్పు తెగులు',
            'name_hi': 'मूंगफली का टिक्का एवं रतुआ रोग',
            'severity': 'high',
            'confidence': 96,
            'visual_traits': 'Dark carbon-black spots on lower leaf surface and reddish-brown rust pustules.',
            'treatments': [
                {'spray': 'Hexaconazole 5% EC', 'dosage': '2.0ml per liter (400ml/acre)', 'stage': 'Spray at 40-45 days crop stage.'},
                {'spray': 'Tebuconazole 50% + Trifloxystrobin 25% WG (Nativo)', 'dosage': '0.7g per liter (140g/acre)', 'stage': 'High-efficacy systemic spray for dual spot + rust control.'}
            ],
            'prevention': [
                'Seed treatment with Trichoderma viride @ 4g per kg seed.',
                'Avoid groundnut monoculture in consecutive seasons.'
            ]
        },
        'default': {
            'name': 'Groundnut Collar Rot (Aspergillus niger)',
            'name_te': 'వేరుశనగ మొదలు కుళ్లు తెగులు',
            'name_hi': 'मूंगफली का कॉलर रोट (तने का सड़न) रोग',
            'severity': 'high',
            'confidence': 90,
            'visual_traits': 'Rapid seedling wilting and black fungal spore dusting at soil collar level.',
            'treatments': [
                {'spray': 'Carbendazim 12% + Mancozeb 63% WP (Saaf)', 'dosage': '2.0g per liter water soil drenching', 'stage': 'Drench affected hill roots immediately.'}
            ],
            'prevention': [
                'Avoid deep seed placement during planting.',
                'Maintain good field drainage.'
            ]
        }
    }
}

@app.route('/api/diagnose-pest', methods=['POST'])
def api_diagnose_pest():
    try:
        data = request.get_json(silent=True) or {}
        crop = data.get('crop', 'Cotton')
        symptom = data.get('symptom', 'bollworm')
        has_image = bool(data.get('has_image', False))
        
        crop_data = PEST_DIAGNOSIS_DATABASE.get(crop, PEST_DIAGNOSIS_DATABASE.get('Cotton'))
        diag = crop_data.get(symptom, crop_data.get('default'))
        
        conf = diag['confidence']
        if has_image:
            conf = min(99, conf + 3)
            
        speech_en = f"Pest diagnosis complete. {diag['name']} detected with {conf} percent confidence. High priority spray: {diag['treatments'][0]['spray']} at {diag['treatments'][0]['dosage']}."
        speech_te = f"తెగులు నిర్ధారణ పూర్తయింది. {diag['name_te']} గుర్తించబడింది. సిఫారసు చేసిన క్రిమిసంహారక మందు: {diag['treatments'][0]['spray']}."
        speech_hi = f"कीट पहचान पूरी हुई। {diag['name_hi']} की पुष्टि हुई है। अनुशंसित दवा: {diag['treatments'][0]['spray']}।"
        
        return jsonify({
            'success': True,
            'crop': crop,
            'symptom_key': symptom,
            'has_image': has_image,
            'diagnosis': {
                'name': diag['name'],
                'name_te': diag['name_te'],
                'name_hi': diag['name_hi'],
                'severity': diag['severity'],
                'confidence': conf,
                'visual_traits': diag['visual_traits'],
                'treatments': diag['treatments'],
                'prevention': diag['prevention']
            },
            'speech': {
                'en': speech_en,
                'te': speech_te,
                'hi': speech_hi
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

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

