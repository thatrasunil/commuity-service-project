import json
import os
import math

class AgronomicRecommender:
    def __init__(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        benchmarks_path = os.path.join(base_dir, 'model', 'crop_benchmarks.json')
        self.benchmarks = {}
        if os.path.exists(benchmarks_path):
            with open(benchmarks_path, 'r') as f:
                self.benchmarks = json.load(f)

    def generate_advisory(self, input_data, predicted_yield, farm_size_acres=2.5):
        crop = input_data.get('Crop', 'Rice')
        n = float(input_data.get('Nitrogen', 0))
        p = float(input_data.get('Phosphorus', 0))
        k = float(input_data.get('Potassium', 0))
        ph = float(input_data.get('pH', 7.0))
        temp = float(input_data.get('Temperature', 25.0))
        humidity = float(input_data.get('Humidity', 60.0))
        rainfall = float(input_data.get('Rainfall', 600.0))
        irrigation = input_data.get('Irrigation', 'Rainfed')

        crop_info = self.benchmarks.get(crop, {
            'mean_yield': 3.5,
            'p25_yield': 2.0,
            'p75_yield': 4.5,
            'market_price_per_tonne': 25000,
            'optimal_n_range': [50, 100],
            'optimal_p_range': [30, 60],
            'optimal_k_range': [30, 60],
            'optimal_ph_range': [6.0, 7.5],
            'optimal_rain_range': [500, 1000],
            'optimal_temp_range': [18, 32],
            'optimal_humidity_range': [50, 80]
        })

        mean_yield = crop_info['mean_yield']
        p25_yield = crop_info['p25_yield']
        mkt_price = crop_info.get('market_price_per_tonne', 25000)
        
        # Risk level determination
        yield_ratio = (predicted_yield / mean_yield) if mean_yield > 0 else 1.0
        
        if predicted_yield < p25_yield or yield_ratio < 0.70:
            risk_level = "High Risk (Low Yield Expected)"
            risk_badge = "danger"
            yield_category = "Low Yield"
            risk_score = round((1.0 - min(1.0, yield_ratio)) * 100, 1)
        elif yield_ratio < 0.90:
            risk_level = "Medium Risk (Moderate Yield Expected)"
            risk_badge = "warning"
            yield_category = "Moderate Yield"
            risk_score = round((1.0 - yield_ratio) * 100, 1)
        else:
            risk_level = "Healthy (Good / High Yield Expected)"
            risk_badge = "success"
            yield_category = "High Yield"
            risk_score = round(max(5.0, (1.0 - min(1.2, yield_ratio)) * 50), 1)

        # Calculate Overall Soil Health Index (0 - 100)
        opt_n = crop_info['optimal_n_range']
        opt_p = crop_info['optimal_p_range']
        opt_k = crop_info['optimal_k_range']
        opt_ph = crop_info['optimal_ph_range']
        
        n_health = max(0, 100 - (abs(n - (opt_n[0]+opt_n[1])/2) / ((opt_n[0]+opt_n[1])/2)) * 80)
        p_health = max(0, 100 - (abs(p - (opt_p[0]+opt_p[1])/2) / ((opt_p[0]+opt_p[1])/2)) * 80)
        k_health = max(0, 100 - (abs(k - (opt_k[0]+opt_k[1])/2) / ((opt_k[0]+opt_k[1])/2)) * 80)
        ph_health = max(0, 100 - (abs(ph - (opt_ph[0]+opt_ph[1])/2) / 2.0) * 90)
        soil_health_score = round((n_health * 0.35 + p_health * 0.25 + k_health * 0.20 + ph_health * 0.20), 1)

        fertilizer_recommendations = []
        soil_recommendations = []
        irrigation_recommendations = []
        management_tips = []

        total_urea_bags = 0
        total_dap_bags = 0
        total_mop_bags = 0

        # 1. Nitrogen
        if n < opt_n[0]:
            deficit_n = round(opt_n[0] - n, 1)
            urea_kg_per_ha = deficit_n * 2.17
            urea_bags = math.ceil((urea_kg_per_ha * (farm_size_acres / 2.47)) / 50)
            total_urea_bags = max(1, urea_bags)
            fertilizer_recommendations.append({
                'nutrient': 'Nitrogen (N) - Low',
                'status': 'Deficient',
                'severity': 'high',
                'advice': f"Nitrogen is deficient by ~{deficit_n} kg/ha. Apply {total_urea_bags} bags of Urea (50kg each) in 2 split doses to prevent yellowing of leaves."
            })
        elif n > opt_n[1] * 1.25:
            fertilizer_recommendations.append({
                'nutrient': 'Nitrogen (N) - High',
                'status': 'Excessive',
                'severity': 'medium',
                'advice': f"Nitrogen is high ({n} kg/ha). Do not add any Urea; excess nitrogen makes plants weak and invites pests."
            })
        else:
            fertilizer_recommendations.append({
                'nutrient': 'Nitrogen (N) - Healthy',
                'status': 'Optimal',
                'severity': 'good',
                'advice': f"Nitrogen level ({n} kg/ha) is in the perfect zone. No extra Urea needed."
            })

        # 2. Phosphorus
        if p < opt_p[0]:
            deficit_p = round(opt_p[0] - p, 1)
            dap_kg_per_ha = deficit_p * 2.17
            dap_bags = math.ceil((dap_kg_per_ha * (farm_size_acres / 2.47)) / 50)
            total_dap_bags = max(1, dap_bags)
            fertilizer_recommendations.append({
                'nutrient': 'Phosphorus (P) - Low',
                'status': 'Deficient',
                'severity': 'high',
                'advice': f"Phosphorus is deficient by ~{deficit_p} kg/ha. Apply {total_dap_bags} bags of DAP (50kg each) at root level to boost root depth."
            })
        elif p > opt_p[1] * 1.3:
            fertilizer_recommendations.append({
                'nutrient': 'Phosphorus (P) - High',
                'status': 'Excessive',
                'severity': 'low',
                'advice': f"Phosphorus ({p} kg/ha) is high in your soil. Avoid adding phosphate fertilizer."
            })
        else:
            fertilizer_recommendations.append({
                'nutrient': 'Phosphorus (P) - Healthy',
                'status': 'Optimal',
                'severity': 'good',
                'advice': f"Phosphorus ({p} kg/ha) is balanced for strong root development."
            })

        # 3. Potassium
        if k < opt_k[0]:
            deficit_k = round(opt_k[0] - k, 1)
            mop_kg_per_ha = deficit_k * 1.67
            mop_bags = math.ceil((mop_kg_per_ha * (farm_size_acres / 2.47)) / 50)
            total_mop_bags = max(1, mop_bags)
            fertilizer_recommendations.append({
                'nutrient': 'Potassium (K) - Low',
                'status': 'Deficient',
                'severity': 'high',
                'advice': f"Potassium is deficient by ~{deficit_k} kg/ha. Apply {total_mop_bags} bags of MOP (50kg each) to protect plants against drought & pest damage."
            })
        else:
            fertilizer_recommendations.append({
                'nutrient': 'Potassium (K) - Healthy',
                'status': 'Optimal',
                'severity': 'good',
                'advice': f"Potassium level ({k} kg/ha) is healthy for grain filling and crop strength."
            })

        total_fertilizer_cost_inr = (total_urea_bags * 268) + (total_dap_bags * 1350) + (total_mop_bags * 1700)

        # 4. Soil pH
        if ph < opt_ph[0]:
            soil_recommendations.append({
                'parameter': 'Sour / Acidic Soil (Low pH)',
                'status': 'Acidic',
                'advice': f"Soil pH of {ph} is acidic (ideal: {opt_ph[0]}-{opt_ph[1]}). Mix Agricultural Lime (Chuna) into soil before planting to neutralize acidity."
            })
        elif ph > opt_ph[1]:
            soil_recommendations.append({
                'parameter': 'Alkaline / Salty Soil (High pH)',
                'status': 'Alkaline',
                'advice': f"Soil pH of {ph} is alkaline (ideal: {opt_ph[0]}-{opt_ph[1]}). Add Gypsum and farmyard compost manure to lower soil salts."
            })
        else:
            soil_recommendations.append({
                'parameter': 'Soil pH Balance',
                'status': 'Optimal',
                'advice': f"Soil pH ({ph}) is in the ideal sweet spot for root nutrient absorption."
            })

        # 5. Irrigation
        opt_rain = crop_info['optimal_rain_range']
        if rainfall < opt_rain[0]:
            if irrigation == 'Rainfed':
                irrigation_recommendations.append({
                    'parameter': 'Drought Risk on Rainfed Land',
                    'urgency': 'Critical',
                    'advice': f"Rainfall ({rainfall} mm) is too low. Switch to Drip or Sprinkler watering immediately and cover soil with straw mulch."
                })
            else:
                irrigation_recommendations.append({
                    'parameter': 'Increase Watering Frequency',
                    'urgency': 'Moderate',
                    'advice': f"Rainfall is below seasonal average. Water {irrigation} 25% more often during flowering and grain stages."
                })
        elif rainfall > opt_rain[1] * 1.25:
            irrigation_recommendations.append({
                'parameter': 'Excess Water / Flooding Risk',
                'urgency': 'High',
                'advice': f"Rainfall ({rainfall} mm) is high. Clean out drainage trenches to prevent water from standing in the field."
            })
        else:
            irrigation_recommendations.append({
                'parameter': 'Water Supply',
                'urgency': 'Normal',
                'advice': f"Water conditions (Rainfall: {rainfall} mm with {irrigation}) are well matched to your crop needs."
            })

        # Management Tips
        if temp > crop_info['optimal_temp_range'][1] + 3:
            management_tips.append(f"High Temperature Alert ({temp}°C): Water early in the morning or late evening to protect crops from heat stress.")
        if humidity > 85:
            management_tips.append(f"High Humidity Alert ({humidity}%): Scout field for fungal disease or mildew. Apply neem oil spray as a preventive measure.")
        if not management_tips:
            management_tips.append(f"Keep field weed-free at 25 and 45 days after sowing. Rotate with pulse crops next season to naturally recharge soil.")

        # Economic Analysis & Before vs After AI Potential Simulator
        farm_hectares = farm_size_acres / 2.471
        total_production_tonnes = round(predicted_yield * farm_hectares, 2)
        total_revenue_inr = round(total_production_tonnes * mkt_price)
        
        # Has actionable deficits in N, P, K or pH
        has_deficits = (n < opt_n[0] or p < opt_p[0] or k < opt_k[0] or ph < opt_ph[0] or ph > opt_ph[1] or rainfall < opt_rain[0])
        
        if not has_deficits and yield_ratio >= 0.98:
            potential_yield = predicted_yield
            potential_revenue_inr = total_revenue_inr
            estimated_income_boost_inr = 0
            is_already_optimal = True
        else:
            # By applying recommended fertilizers, yield approaches top quartile (p75 / max)
            top_potential = crop_info.get('p75_yield', mean_yield * 1.15)
            potential_yield = round(max(predicted_yield * 1.22, top_potential), 2)
            potential_production_tonnes = round(potential_yield * farm_hectares, 2)
            potential_revenue_inr = round(potential_production_tonnes * mkt_price)
            estimated_income_boost_inr = max(0, potential_revenue_inr - total_revenue_inr)
            is_already_optimal = False

        return {
            'predicted_yield': predicted_yield,
            'mean_benchmark_yield': mean_yield,
            'yield_category': yield_category,
            'risk_level': risk_level,
            'risk_badge': risk_badge,
            'risk_score': risk_score,
            'soil_health_score': soil_health_score,
            'economic_analysis': {
                'farm_size_acres': farm_size_acres,
                'market_price_per_tonne': mkt_price,
                'current_production_tonnes': total_production_tonnes,
                'current_revenue_inr': total_revenue_inr,
                'potential_yield_with_ai': potential_yield,
                'potential_revenue_inr': potential_revenue_inr,
                'estimated_income_boost_inr': estimated_income_boost_inr,
                'is_already_optimal': is_already_optimal,
                'fertilizer_costs': {
                    'urea_bags': total_urea_bags,
                    'dap_bags': total_dap_bags,
                    'mop_bags': total_mop_bags,
                    'total_cost_inr': total_fertilizer_cost_inr
                }
            },
            'crop_benchmarks': crop_info,
            'fertilizer_recommendations': fertilizer_recommendations,
            'soil_recommendations': soil_recommendations,
            'irrigation_recommendations': irrigation_recommendations,
            'management_tips': management_tips
        }
