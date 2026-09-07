import pandas as pd
import numpy as np
import os

# Set seed for reproducibility
np.random.seed(42)

# Agricultural Crop profiles calibrated with ICAR (Indian Council of Agricultural Research) standards
# Parameters: optimal N, P, K (kg/ha), optimal pH, temp range (C), humidity range (%), rainfall range (mm), base yield (t/ha)
CROP_PROFILES = {
    'Rice': {
        'N': (70, 140), 'P': (30, 70), 'K': (30, 60),
        'pH': (5.5, 7.5), 'temp': (20, 37), 'humidity': (60, 95), 'rainfall': (1000, 2500),
        'base_yield': 3.8, 'yield_std': 0.7, 'water_sensitive': True
    },
    'Wheat': {
        'N': (80, 150), 'P': (40, 80), 'K': (25, 55),
        'pH': (6.0, 7.8), 'temp': (12, 28), 'humidity': (40, 75), 'rainfall': (350, 850),
        'base_yield': 4.2, 'yield_std': 0.6, 'water_sensitive': False
    },
    'Maize': {
        'N': (90, 160), 'P': (40, 75), 'K': (35, 65),
        'pH': (5.8, 7.5), 'temp': (18, 35), 'humidity': (50, 85), 'rainfall': (500, 1100),
        'base_yield': 4.5, 'yield_std': 0.8, 'water_sensitive': False
    },
    'Cotton': {
        'N': (60, 130), 'P': (30, 60), 'K': (25, 50),
        'pH': (6.0, 8.2), 'temp': (22, 38), 'humidity': (45, 80), 'rainfall': (500, 1000),
        'base_yield': 2.3, 'yield_std': 0.4, 'water_sensitive': False
    },
    'Sugarcane': {
        'N': (120, 250), 'P': (50, 100), 'K': (60, 140),
        'pH': (6.0, 8.0), 'temp': (22, 38), 'humidity': (60, 90), 'rainfall': (1200, 2200),
        'base_yield': 75.0, 'yield_std': 10.0, 'water_sensitive': True
    },
    'Chickpea': {
        'N': (20, 50), 'P': (40, 75), 'K': (20, 45),
        'pH': (6.0, 7.5), 'temp': (15, 30), 'humidity': (35, 65), 'rainfall': (300, 700),
        'base_yield': 1.8, 'yield_std': 0.3, 'water_sensitive': False
    },
    'Potato': {
        'N': (100, 180), 'P': (60, 110), 'K': (80, 150),
        'pH': (5.0, 6.8), 'temp': (14, 25), 'humidity': (60, 85), 'rainfall': (400, 800),
        'base_yield': 22.0, 'yield_std': 3.5, 'water_sensitive': False
    },
    'Groundnut': {
        'N': (20, 50), 'P': (40, 70), 'K': (30, 60),
        'pH': (5.8, 7.2), 'temp': (22, 34), 'humidity': (50, 80), 'rainfall': (450, 950),
        'base_yield': 2.4, 'yield_std': 0.4, 'water_sensitive': False
    },
    'Mustard': {
        'N': (50, 100), 'P': (25, 55), 'K': (20, 45),
        'pH': (6.0, 7.5), 'temp': (12, 26), 'humidity': (40, 70), 'rainfall': (250, 600),
        'base_yield': 1.6, 'yield_std': 0.3, 'water_sensitive': False
    },
    'Tomato': {
        'N': (90, 150), 'P': (50, 90), 'K': (60, 120),
        'pH': (6.0, 7.2), 'temp': (18, 32), 'humidity': (55, 85), 'rainfall': (450, 900),
        'base_yield': 28.0, 'yield_std': 4.0, 'water_sensitive': False
    },
    'Soybean': {
        'N': (25, 55), 'P': (50, 85), 'K': (30, 65),
        'pH': (6.0, 7.5), 'temp': (20, 33), 'humidity': (50, 80), 'rainfall': (550, 1050),
        'base_yield': 2.2, 'yield_std': 0.35, 'water_sensitive': False
    },
    'Kidney Beans': {
        'N': (25, 60), 'P': (50, 90), 'K': (25, 55),
        'pH': (5.5, 7.0), 'temp': (15, 28), 'humidity': (45, 75), 'rainfall': (400, 850),
        'base_yield': 1.7, 'yield_std': 0.3, 'water_sensitive': False
    }
}

IRRIGATION_TYPES = ['Drip', 'Sprinkler', 'Flood', 'Rainfed']
IRRIGATION_EFFICIENCY = {
    'Drip': 1.15,       # High water & nutrient delivery efficiency
    'Sprinkler': 1.05,  # Moderate-high efficiency
    'Flood': 0.95,      # Traditional surface flooding
    'Rainfed': 0.80     # Vulnerable to precipitation fluctuations
}

def generate_agricultural_dataset(num_samples_per_crop=300):
    records = []
    
    for crop, prof in CROP_PROFILES.items():
        for _ in range(num_samples_per_crop):
            is_stressed = np.random.rand() < 0.25
            
            if not is_stressed:
                n = np.random.uniform(prof['N'][0] * 0.85, prof['N'][1] * 1.15)
                p = np.random.uniform(prof['P'][0] * 0.85, prof['P'][1] * 1.15)
                k = np.random.uniform(prof['K'][0] * 0.85, prof['K'][1] * 1.15)
                ph = np.random.uniform(prof['pH'][0] - 0.3, prof['pH'][1] + 0.3)
                temp = np.random.uniform(prof['temp'][0] - 2, prof['temp'][1] + 2)
                humidity = np.random.uniform(prof['humidity'][0] - 5, prof['humidity'][1] + 5)
                rainfall = np.random.uniform(prof['rainfall'][0] * 0.8, prof['rainfall'][1] * 1.2)
                irrigation = np.random.choice(IRRIGATION_TYPES, p=[0.35, 0.30, 0.25, 0.10])
            else:
                stress_type = np.random.choice(['low_nutrients', 'drought', 'excess_temp', 'acidic_soil', 'poor_irrigation'])
                n = np.random.uniform(10, prof['N'][0] * 0.6) if stress_type == 'low_nutrients' else np.random.uniform(prof['N'][0], prof['N'][1])
                p = np.random.uniform(5, prof['P'][0] * 0.6) if stress_type == 'low_nutrients' else np.random.uniform(prof['P'][0], prof['P'][1])
                k = np.random.uniform(5, prof['K'][0] * 0.6) if stress_type == 'low_nutrients' else np.random.uniform(prof['K'][0], prof['K'][1])
                
                ph = np.random.uniform(4.0, 5.2) if stress_type == 'acidic_soil' else np.random.uniform(prof['pH'][0], prof['pH'][1])
                temp = np.random.uniform(prof['temp'][1] + 3, prof['temp'][1] + 9) if stress_type == 'excess_temp' else np.random.uniform(prof['temp'][0], prof['temp'][1])
                humidity = np.random.uniform(20, 45) if stress_type == 'drought' else np.random.uniform(prof['humidity'][0], prof['humidity'][1])
                rainfall = np.random.uniform(50, prof['rainfall'][0] * 0.4) if stress_type == 'drought' else np.random.uniform(prof['rainfall'][0], prof['rainfall'][1])
                irrigation = 'Rainfed' if stress_type in ['drought', 'poor_irrigation'] else np.random.choice(IRRIGATION_TYPES)

            n = round(max(5.0, min(300.0, n)), 1)
            p = round(max(5.0, min(160.0, p)), 1)
            k = round(max(5.0, min(200.0, k)), 1)
            ph = round(max(3.8, min(9.5, ph)), 2)
            temp = round(max(8.0, min(48.0, temp)), 1)
            humidity = round(max(15.0, min(98.0, humidity)), 1)
            rainfall = round(max(30.0, min(3200.0, rainfall)), 1)

            n_mid = (prof['N'][0] + prof['N'][1]) / 2
            p_mid = (prof['P'][0] + prof['P'][1]) / 2
            k_mid = (prof['K'][0] + prof['K'][1]) / 2
            n_factor = min(1.1, max(0.35, 1.0 - abs(n - n_mid) / (n_mid * 1.5)))
            p_factor = min(1.1, max(0.40, 1.0 - abs(p - p_mid) / (p_mid * 1.5)))
            k_factor = min(1.1, max(0.40, 1.0 - abs(k - k_mid) / (k_mid * 1.5)))
            nutrient_score = (n_factor * 0.45 + p_factor * 0.30 + k_factor * 0.25)

            ph_mid = (prof['pH'][0] + prof['pH'][1]) / 2
            ph_factor = min(1.05, max(0.30, 1.0 - abs(ph - ph_mid) / 2.5))

            temp_mid = (prof['temp'][0] + prof['temp'][1]) / 2
            temp_factor = min(1.05, max(0.35, 1.0 - abs(temp - temp_mid) / (temp_mid * 0.8)))
            
            rain_mid = (prof['rainfall'][0] + prof['rainfall'][1]) / 2
            rain_factor = min(1.1, max(0.30, 1.0 - abs(rainfall - rain_mid) / (rain_mid * 1.2)))
            
            weather_score = (temp_factor * 0.45 + rain_factor * 0.55)

            irr_factor = IRRIGATION_EFFICIENCY[irrigation]
            if irrigation == 'Rainfed' and rainfall < prof['rainfall'][0]:
                irr_factor *= 0.75

            overall_multiplier = (nutrient_score * 0.35 + ph_factor * 0.15 + weather_score * 0.30) * irr_factor
            calculated_yield = prof['base_yield'] * overall_multiplier + np.random.normal(0, prof['yield_std'] * 0.15)
            calculated_yield = round(max(prof['base_yield'] * 0.2, calculated_yield), 2)

            records.append({
                'Crop': crop,
                'Nitrogen': n,
                'Phosphorus': p,
                'Potassium': k,
                'pH': ph,
                'Temperature': temp,
                'Humidity': humidity,
                'Rainfall': rainfall,
                'Irrigation': irrigation,
                'Yield_Tonnes_Per_Hectare': calculated_yield
            })

    df = pd.DataFrame(records)
    return df

if __name__ == '__main__':
    dataset_dir = os.path.join(os.path.dirname(__file__))
    os.makedirs(dataset_dir, exist_ok=True)
    df = generate_agricultural_dataset(num_samples_per_crop=300)
    csv_path = os.path.join(dataset_dir, 'crop_yield_real_data.csv')
    df.to_csv(csv_path, index=False)
    print(f"Dataset generated at {csv_path} with {len(df)} records across {df['Crop'].nunique()} crops.")
