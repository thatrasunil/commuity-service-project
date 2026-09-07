import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_absolute_error, root_mean_squared_error

def train_and_evaluate_models():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, 'dataset', 'crop_yield_real_data.csv')
    model_dir = os.path.join(base_dir, 'model')
    os.makedirs(model_dir, exist_ok=True)

    print(f"[INFO] Loading dataset from: {data_path}")
    df = pd.read_csv(data_path)

    # Features and Target
    X = df[['Crop', 'Nitrogen', 'Phosphorus', 'Potassium', 'pH', 'Temperature', 'Humidity', 'Rainfall', 'Irrigation']]
    y = df['Yield_Tonnes_Per_Hectare']

    categorical_features = ['Crop', 'Irrigation']
    numerical_features = ['Nitrogen', 'Phosphorus', 'Potassium', 'pH', 'Temperature', 'Humidity', 'Rainfall']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42)

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(drop='first', sparse_output=False, handle_unknown='ignore'), categorical_features)
        ]
    )

    regressors = {
        'Random Forest': RandomForestRegressor(n_estimators=160, max_depth=16, random_state=42, n_jobs=-1),
        'Gradient Boosting': GradientBoostingRegressor(n_estimators=120, max_depth=6, random_state=42),
        'Decision Tree': DecisionTreeRegressor(max_depth=12, random_state=42),
        'Linear Regression': LinearRegression()
    }

    trained_pipelines = {}
    results = {}
    best_model_name = 'Random Forest'
    best_r2 = -1.0

    for name, regressor in regressors.items():
        pipe = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('regressor', regressor)
        ])

        pipe.fit(X_train, y_train)
        y_pred = pipe.predict(X_test)

        r2 = float(r2_score(y_test, y_pred))
        mae = float(mean_absolute_error(y_test, y_pred))
        rmse = float(root_mean_squared_error(y_test, y_pred))
        cv_scores = cross_val_score(pipe, X_train, y_train, cv=5, scoring='r2')
        cv_mean = float(np.mean(cv_scores))

        results[name] = {
            'r2_score': round(r2, 4),
            'mae': round(mae, 4),
            'rmse': round(rmse, 4),
            'cv_r2_mean': round(cv_mean, 4),
            'cv_r2_std': round(float(np.std(cv_scores)), 4)
        }

        trained_pipelines[name] = pipe

        print(f"[{name}] R2: {r2:.4f} | MAE: {mae:.4f} | RMSE: {rmse:.4f} | 5-Fold CV R2: {cv_mean:.4f}")

        if r2 > best_r2:
            best_r2 = r2
            best_model_name = name

    # Feature Importance from Random Forest
    rf_pipe = trained_pipelines['Random Forest']
    cat_encoder = rf_pipe.named_steps['preprocessor'].named_transformers_['cat']
    encoded_cat_names = cat_encoder.get_feature_names_out(categorical_features).tolist()
    all_feature_names = numerical_features + encoded_cat_names
    
    importances = rf_pipe.named_steps['regressor'].feature_importances_
    feature_importance_dict = {feat: round(float(imp), 4) for feat, imp in zip(all_feature_names, importances)}
    sorted_features = dict(sorted(feature_importance_dict.items(), key=lambda item: item[1], reverse=True))

    # Calculate crop-specific statistics for benchmarks
    crop_stats = {}
    market_prices = {
        'Rice': 22000,       # INR per tonne (~2200/quintal MSP)
        'Wheat': 23000,      # INR per tonne (~2275/quintal MSP)
        'Maize': 21000,      # INR per tonne
        'Cotton': 65000,     # INR per tonne
        'Sugarcane': 3200,   # INR per tonne (~320/quintal FRP)
        'Chickpea': 54000,   # INR per tonne (~5440/quintal)
        'Potato': 14000,     # INR per tonne
        'Groundnut': 67000,  # INR per tonne
        'Mustard': 56000,    # INR per tonne
        'Tomato': 18000,     # INR per tonne
        'Soybean': 48000,    # INR per tonne
        'Kidney Beans': 72000# INR per tonne
    }

    for crop in df['Crop'].unique():
        crop_df = df[df['Crop'] == crop]
        crop_stats[crop] = {
            'mean_yield': round(float(crop_df['Yield_Tonnes_Per_Hectare'].mean()), 2),
            'min_yield': round(float(crop_df['Yield_Tonnes_Per_Hectare'].min()), 2),
            'max_yield': round(float(crop_df['Yield_Tonnes_Per_Hectare'].max()), 2),
            'p25_yield': round(float(crop_df['Yield_Tonnes_Per_Hectare'].quantile(0.25)), 2),
            'p75_yield': round(float(crop_df['Yield_Tonnes_Per_Hectare'].quantile(0.75)), 2),
            'market_price_per_tonne': market_prices.get(crop, 25000),
            'optimal_n_range': [round(float(crop_df['Nitrogen'].quantile(0.25)), 1), round(float(crop_df['Nitrogen'].quantile(0.75)), 1)],
            'optimal_p_range': [round(float(crop_df['Phosphorus'].quantile(0.25)), 1), round(float(crop_df['Phosphorus'].quantile(0.75)), 1)],
            'optimal_k_range': [round(float(crop_df['Potassium'].quantile(0.25)), 1), round(float(crop_df['Potassium'].quantile(0.75)), 1)],
            'optimal_ph_range': [round(float(crop_df['pH'].quantile(0.25)), 2), round(float(crop_df['pH'].quantile(0.75)), 2)],
            'optimal_rain_range': [round(float(crop_df['Rainfall'].quantile(0.25)), 1), round(float(crop_df['Rainfall'].quantile(0.75)), 1)],
            'optimal_temp_range': [round(float(crop_df['Temperature'].quantile(0.25)), 1), round(float(crop_df['Temperature'].quantile(0.75)), 1)],
            'optimal_humidity_range': [round(float(crop_df['Humidity'].quantile(0.25)), 1), round(float(crop_df['Humidity'].quantile(0.75)), 1)],
        }

    # Save best model pipeline and full models bundle
    model_save_path = os.path.join(model_dir, 'crop_yield_model.pkl')
    bundle_save_path = os.path.join(model_dir, 'all_models_bundle.pkl')
    
    joblib.dump(trained_pipelines['Random Forest'], model_save_path)
    joblib.dump(trained_pipelines, bundle_save_path)
    print(f"[SUCCESS] Saved model bundle to: {bundle_save_path}")

    # Save metrics and metadata
    metadata = {
        'best_model': best_model_name,
        'model_comparison': results,
        'feature_importance': sorted_features,
        'total_samples': len(df),
        'crops_available': sorted(df['Crop'].unique().tolist()),
        'irrigation_types': sorted(df['Irrigation'].unique().tolist())
    }

    metrics_path = os.path.join(model_dir, 'metrics.json')
    with open(metrics_path, 'w') as f:
        json.dump(metadata, f, indent=4)

    benchmarks_path = os.path.join(model_dir, 'crop_benchmarks.json')
    with open(benchmarks_path, 'w') as f:
        json.dump(crop_stats, f, indent=4)
    print(f"[SUCCESS] Metrics & Crop Benchmarks written to disk.")

if __name__ == '__main__':
    train_and_evaluate_models()
