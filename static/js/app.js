/* ═══════════════════════════════════════════════
   CropAI – App JavaScript
   Screen Controller + i18n + Voice + Prediction
   AI-Based Crop Yield Prediction System
   CSP Project 2026
═══════════════════════════════════════════════ */

// ──────────────────────────────────────────────
// 1. SCREEN CONTROLLER
// ──────────────────────────────────────────────

let currentLang = localStorage.getItem('cropai_lang') || 'en';

function showScreen(screenId, updateHistory = true) {
  if (!screenId) return;
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => s.classList.remove('active'));

  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const splash = document.getElementById('screen-splash');
    if (splash && screenId !== 'screen-splash') {
      splash.style.display = 'none';
    }
  }

  const screenToPath = {
    'screen-home': '/',
    'screen-predict': '/predict-yield',
    'screen-recommend': '/recommend',
    'screen-weather': '/weather',
    'screen-soil': '/soil-health',
    'screen-pest': '/pest-detection',
    'screen-reports': '/farm-reports',
    'screen-talk': '/talk-with-ai',
    'screen-profile': '/profile'
  };

  if (updateHistory && window.history && screenToPath[screenId]) {
    try {
      window.history.pushState({ screen: screenId }, '', screenToPath[screenId]);
    } catch (e) {
      console.log('History state error', e);
    }
  }

  if (screenId === 'screen-reports' && typeof updateFarmReportsScreen === 'function') {
    updateFarmReportsScreen();
  }
}

window.addEventListener('popstate', (e) => {
  if (e.state && e.state.screen) {
    showScreen(e.state.screen, false);
  }
});

const I18N = {
  en: {
    tagline: 'Predict Early. Improve Yield.',
    login_title: 'Welcome, Farmer!',
    mobile_number: 'Mobile Number',
    otp_label: 'OTP',
    send_otp: 'Send OTP',
    login_btn: 'Login',
    or_text: 'OR',
    guest_btn: 'Continue as Guest',
    good_morning: 'Good Morning, Farmer!',
    predict_yield: 'Predict Crop Yield',
    crop_recommend: 'Crop Recommendation',
    weather: 'Weather',
    soil_health: 'Soil Health',
    pest_detect: 'Pest Detection',
    farm_reports: 'Farm Reports',
    ai_talk: 'Talk with AI',
    profile: 'Profile',
    select_crop: 'Select Crop',
    farm_details: 'Farm Details',
    soil_condition: 'Soil Condition',
    predict_btn: 'Predict Yield',
    expected_yield: 'Expected Yield',
    analyzing: 'Analyzing Your Field...',
    soil_analysis: 'Soil Health Analysis',
    nitrogen: 'Nitrogen (N)',
    phosphorus: 'Phosphorus (P)',
    potassium: 'Potassium (K)',
    soil_ph: 'Soil pH',
    moisture: 'Moisture',
    organic_matter: 'Organic Matter',
    healthy_soil: 'Healthy & Fertile Soil',
    moderate_soil: 'Mild Deficit Soil',
    poor_soil: 'Depleted Soil (Needs Treatment)',
    fertilizer_plan: 'Prescribed Fertilizer Plan',
    best_crops: 'Best Crops for This Soil',
    soil_presets_title: 'Select Soil Type',
    soil_basics_title: 'Soil Basics',
    farm_size_acres: 'Farm Size (Acres)',
    irrigation_lbl: 'Irrigation',
    get_soil_recommendation: 'Get Full Fertilizer & Crop Recommendation',
    choose_district_prompt: '📍 Choose District...',
    temperature_lbl: 'Temperature',
    humidity_lbl: 'Humidity',
    rainfall_lbl: 'Rainfall',
    forecast_7day_title: '7-Day Forecast',
    farmer_tips_title: 'Farmer Tips',
    weather_tip_1: 'Check forecast before spraying pesticides',
    weather_tip_2: 'Irrigate in the evening to reduce evaporation',
    weather_tip_3: 'Delay fertilizer application before heavy rain days',
    weather_tip_4: 'On high temperature days, add an extra watering round',
    farm_conditions_title: 'Your Farm Conditions',
    soil_type_lbl: 'Soil Type',
    season_lbl: 'Season',
    water_avail_lbl: 'Water Availability',
    get_recommendation_btn: 'Get Recommendation',
    best_crop_trophy: 'Best Crop',
    good_alternatives_title: 'Also Good Alternatives',
    avoid_crops_title: 'Avoid These Crops',
    pest_diagnosis_title: 'Pest & Disease Diagnosis',
    symptoms_observed_lbl: 'Symptoms Observed',
    upload_leaf_photo: 'Upload Crop Leaf Photo',
    diagnose_pest_btn: 'Diagnose Pest & Get Remedy',
    recommended_pesticide_title: 'Recommended Treatment & Pesticide Spray',
    preventive_measures_title: 'Cultural & Preventive Measures',
    report_season_head: 'Crop Season Performance & Advisory Report',
    report_audit_title: 'Current Season Audit',
    season_2025_26: 'Season 2025-26',
    projected_revenue: 'Projected Revenue',
    yield_bench_sub: 'Mean Benchmark: 2.30 T/Ha (+23%)',
    rev_target_sub: 'AI Target: +₹26,400 Profit',
    soil_health_score: 'Soil Score',
    soil_score_sub: 'Optimal NPK & pH Balance',
    risk_index: 'Risk Index',
    risk_index_sub: 'Favorable Weather & Pest Safe',
    report_helps_title: 'How This Report Helps Farmers',
    help_yield_title: '1. Maximize Yield & Revenue',
    help_yield_desc: 'Compares your farm output with district standards and suggests exact actions to achieve higher profit per acre.',
    help_loan_title: '2. Bank Loans & Subsidies',
    help_loan_desc: 'Serves as an official farm record for Kisan Credit Card (KCC) loans, PMFBY crop insurance, and government fertilizer subsidies.',
    help_cost_title: '3. Save Fertilizer Costs',
    help_cost_desc: 'Avoids wasteful excess fertilizer usage, saving ₹3,000–₹5,000 per acre while keeping soil fertile for long-term productivity.',
    farm_history_log: 'Farm Advisory History & Inputs Log',
    th_date: 'Date',
    th_crop: 'Crop',
    th_yield_pred: 'Yield Pred.',
    th_est_rev: 'Est. Revenue',
    th_action: 'Action Taken',
    btn_listen_report: 'Listen to Summary',
    btn_download_report: 'Download / Print Full Report',
    quick_questions_title: 'Quick Questions:',
    ai_bot_greeting: 'Hello Farmer! Ask me anything about crops, fertilizer dosage, weather risks, or pest control in English, Telugu, or Hindi.',
    chat_placeholder: 'Type your farming question here...',
    registered_farmer: 'Registered Farmer',
    farmer_land_profile: 'Farmer & Land Profile',
    full_name_lbl: 'Full Name',
    primary_district_lbl: 'Primary District',
    total_land_size_lbl: 'Total Land Size (Acres)',
    primary_crop_lbl: 'Primary Crop',
    preferred_language_lbl: 'Preferred Language',
    save_profile_btn: 'Save Profile',
    logout_btn: 'Logout / Change User'
  },
  te: {
    tagline: 'ముందే అంచనా వేయండి. దిగుబడి పెంచండి.',
    login_title: 'రైతుకు స్వాగతం!',
    mobile_number: 'మొబైల్ సంఖ్య',
    otp_label: 'OTP సంఖ్య',
    send_otp: 'OTP పంపండి',
    login_btn: 'లాగిన్',
    or_text: 'లేదా',
    guest_btn: 'అతిథిగా కొనసాగండి',
    good_morning: 'శుభోదయం, రైతు!',
    predict_yield: 'పంట దిగుబడి అంచనా',
    crop_recommend: 'పంట సిఫారసు',
    weather: 'వాతావరణం',
    soil_health: 'నేల ఆరోగ్యం',
    pest_detect: 'తెగులు గుర్తింపు',
    farm_reports: 'వ్యవసాయ నివేదికలు',
    ai_talk: 'AI తో మాట్లాడండి',
    profile: 'ప్రొఫైల్',
    select_crop: 'పంటను ఎంచుకోండి',
    farm_details: 'వ్యవసాయ వివరాలు',
    soil_condition: 'నేల స్థితి',
    predict_btn: 'దిగుబడి అంచనా వేయండి',
    expected_yield: 'అంచనా దిగుబడి',
    analyzing: 'మీ పొలాన్ని విశ్లేషిస్తున్నాము...',
    soil_analysis: 'నేల ఆరోగ్య విశ్లేషణ',
    nitrogen: 'నత్రజని (N)',
    phosphorus: 'భాస్వరం (P)',
    potassium: 'పొటాష్ (K)',
    soil_ph: 'నేల pH',
    moisture: 'తేమ శాతం',
    organic_matter: 'సేంద్రీయ పదార్థం',
    healthy_soil: 'సారవంతమైన ఆరోగ్య నేల',
    moderate_soil: 'మధ్యస్థ పోషకాల నేల',
    poor_soil: 'క్షీణించిన నేల (చికిత్స అవసరం)',
    fertilizer_plan: 'సిఫారసు చేసిన ఎరువుల ప్రణాళిక',
    best_crops: 'ఈ నేలకు అనువైన ఉత్తమ పంటలు',
    soil_presets_title: 'నేల రకాన్ని ఎంచుకోండి',
    soil_basics_title: 'నేల ప్రాథమిక వివరాలు',
    farm_size_acres: 'పొలం విస్తీర్ణం (ఎకరాలు)',
    irrigation_lbl: 'నీటి పారుదల (Irrigation)',
    get_soil_recommendation: 'పూర్తి ఎరువుల ప్రణాళిక మరియు పంట సిఫారసు పొందండి',
    choose_district_prompt: '📍 మీ జిల్లాను ఎంచుకోండి...',
    temperature_lbl: 'ఉష్ణోగ్రత',
    humidity_lbl: 'తేమ',
    rainfall_lbl: 'వర్షపాతం',
    forecast_7day_title: '7 రోజుల వాతావరణ అంచనా',
    farmer_tips_title: 'రైతులకు సలహాలు',
    weather_tip_1: 'పురుగుమందు పిచికారీ చేసే ముందు వాతావరణ అంచనా తనిఖీ చేయండి',
    weather_tip_2: 'నీరు ఆవిరి కాకుండా సాయంత్రం వేళ నీటి పారుదల చేయండి',
    weather_tip_3: 'భారీ వర్ష సూచన ఉన్న రోజులలో ఎరువులు వేయడం వాయిదా వేయండి',
    weather_tip_4: 'అధిక ఉష్ణోగ్రత ఉన్న రోజుల్లో పైరుకు అదనంగా ఒకసారి నీరు అందించండి',
    farm_conditions_title: 'మీ పొలం పరిస్థితులు',
    soil_type_lbl: 'నేల రకం',
    season_lbl: 'సీజన్',
    water_avail_lbl: 'నీటి లభ్యత',
    get_recommendation_btn: 'సిఫారసు పొందండి',
    best_crop_trophy: 'ఉత్తమ పంట',
    good_alternatives_title: 'ఇతర అనువైన ప్రత్యామ్నాయ పంటలు',
    avoid_crops_title: 'ఈ పంటలను వేయకండి (నష్టం కలిగించేవి)',
    pest_diagnosis_title: 'తెగులు & వ్యాధి నిర్ధారణ',
    symptoms_observed_lbl: 'గమనించిన లక్షణాలు',
    upload_leaf_photo: 'ఆకు లేదా మొక్క ఫోటోను అప్‌లోడ్ చేయండి',
    diagnose_pest_btn: 'తెగులును గుర్తించి నివారణ మందులను పొందండి',
    recommended_pesticide_title: 'సిఫారసు చేసిన క్రిమిసంహారక మందుల స్ప్రే',
    preventive_measures_title: 'ముందస్తు నివారణ & జాగ్రత్తలు',
    report_season_head: 'పంట సీజన్ పనితీరు & సలహా నివేదిక',
    report_audit_title: 'ప్రస్తుత సీజన్ తనిఖీ',
    season_2025_26: 'సీజన్ 2025-26',
    projected_revenue: 'అంచనా రాబడి',
    yield_bench_sub: 'సగటు స్థాయి: 2.30 టన్నులు/హెక్టార్ (+23%)',
    rev_target_sub: 'AI లక్ష్యం: +₹26,400 అదనపు లాభం',
    soil_health_score: 'నేల స్కోర్',
    soil_score_sub: 'ఉత్తమ NPK & pH సమతుల్యత',
    risk_index: 'ప్రమాద సూచిక',
    risk_index_sub: 'అనుకూల వాతావరణం & సురక్షితం',
    report_helps_title: 'ఈ నివేదిక రైతులకు ఎలా ఉపయోగపడుతుంది',
    help_yield_title: '1. దిగుబడి & రాబడి పెంపు',
    help_yield_desc: 'మీ పొలం దిగుబడిని జిల్లా సగటుతో పోల్చి, ఎకరాకు ఎక్కువ లాభం పొందడానికి సరియైన చర్యలను సూచిస్తుంది.',
    help_loan_title: '2. బ్యాంకు రుణాలు & రాయితీలు',
    help_loan_desc: 'కిసాన్ క్రెడిట్ కార్డ్ (KCC) రుణాలు, పంట భీమా (PMFBY), మరియు ప్రభుత్వ ఎరువుల సబ్సిడీల కోసం ఇది ధృవీకరించబడిన రికార్డుగా పనిచేస్తుంది.',
    help_cost_title: '3. ఎరువుల ఖర్చు ఆదా',
    help_cost_desc: 'అనవసరమైన ఎరువుల వాడకాన్ని నివారించి, ఎకరాకు ₹3,000–₹5,000 వరకు ఆదా చేస్తూ నేల సారాన్ని కాపాడుతుంది.',
    farm_history_log: 'వ్యవసాయ సలహాల చరిత్ర & నమోదుల జాబితా',
    th_date: 'తేదీ',
    th_crop: 'పంట',
    th_yield_pred: 'దిగుబడి అంచనా',
    th_est_rev: 'అంచనా రాబడి',
    th_action: 'తీసుకున్న చర్య',
    btn_listen_report: 'వివరణ వినండి (Voice)',
    btn_download_report: 'రిపోర్ట్ ప్రింట్ / సేవ్ చేయండి',
    quick_questions_title: 'త్వరిత ప్రశ్నలు:',
    ai_bot_greeting: 'నమస్కారం రైతు సోదరా! పంటలు, ఎరువులు, వాతావరణం మరియు తెగుళ్ల నివారణ గురించి ఏమైనా అడగండి.',
    chat_placeholder: 'మీ వ్యవసాయ ప్రశ్నను ఇక్కడ టైప్ చేయండి...',
    registered_farmer: 'నమోదిత రైతు',
    farmer_land_profile: 'రైతు & భూమి వివరాలు',
    full_name_lbl: 'పూర్తి పేరు',
    primary_district_lbl: 'జిల్లా',
    total_land_size_lbl: 'మొత్తం భూమి విస్తీర్ణం (ఎకరాలు)',
    primary_crop_lbl: 'ప్రధాన పంట',
    preferred_language_lbl: 'ఎంచుకున్న భాష',
    save_profile_btn: 'ప్రొఫైల్ సేవ్ చేయండి',
    logout_btn: 'లాగౌట్ / వినియోగదారుని మార్చండి'
  },
  hi: {
    tagline: 'जल्दी भविष्यवाणी करें। उपज बढ़ाएं।',
    login_title: 'किसान, आपका स्वागत है!',
    mobile_number: 'मोबाइल नंबर',
    otp_label: 'OTP कोड',
    send_otp: 'OTP भेजें',
    login_btn: 'लॉगिन',
    or_text: 'या',
    guest_btn: 'अतिथि के रूप में जारी रखें',
    good_morning: 'सुप्रभात, किसान!',
    predict_yield: 'फसल उपज पूर्वानुमान',
    crop_recommend: 'फसल सिफारिश',
    weather: 'मौसम',
    soil_health: 'मिट्टी स्वास्थ्य',
    pest_detect: 'कीट पहचान',
    farm_reports: 'फार्म रिपोर्ट',
    ai_talk: 'AI से बात करें',
    profile: 'प्रोफाइल',
    select_crop: 'फसल चुनें',
    farm_details: 'खेत की जानकारी',
    soil_condition: 'मिट्टी की स्थिति',
    predict_btn: 'उपज का अनुमान लगाएं',
    expected_yield: 'अनुमानित उपज',
    analyzing: 'आपके खेत का विश्लेषण हो रहा है...',
    soil_analysis: 'मिट्टी स्वास्थ्य विश्लेषण',
    nitrogen: 'नाइट्रोजन (N)',
    phosphorus: 'फास्फोरस (P)',
    potassium: 'पोटाश (K)',
    soil_ph: 'मिट्टी का पीएच',
    moisture: 'नमी प्रतिशत',
    organic_matter: 'जैविक पदार्थ',
    healthy_soil: 'उपजाऊ व स्वस्थ मिट्टी',
    moderate_soil: 'मध्यम पोषक मिट्टी',
    poor_soil: 'कमजोर मिट्टी (उपचार आवश्यक)',
    fertilizer_plan: 'अनुशंसित उर्वरक खुराक',
    best_crops: 'इस मिट्टी के लिए सर्वोत्तम फसलें',
    soil_presets_title: 'मिट्टी का प्रकार चुनें',
    soil_basics_title: 'मिट्टी की बुनियादी जानकारी',
    farm_size_acres: 'खेत का आकार (एकड़)',
    irrigation_lbl: 'सिंचाई (Irrigation)',
    get_soil_recommendation: 'पूर्ण उर्वरक योजना और फसल सिफारिश प्राप्त करें',
    choose_district_prompt: '📍 अपना जिला चुनें...',
    temperature_lbl: 'तापमान',
    humidity_lbl: 'नमी (आर्द्रता)',
    rainfall_lbl: 'वर्षा',
    forecast_7day_title: '7 दिनों का मौसम पूर्वानुमान',
    farmer_tips_title: 'किसानों के लिए सलाह',
    weather_tip_1: 'कीटनाशक का छिड़काव करने से पहले मौसम पूर्वानुमान की जांच करें',
    weather_tip_2: 'वाष्पीकरण कम करने के लिए शाम के समय सिंचाई करें',
    weather_tip_3: 'भारी बारिश की संभावना होने पर उर्वरक प्रयोग स्थगित करें',
    weather_tip_4: 'अधिक तापमान वाले दिनों में फसल को अतिरिक्त पानी दें',
    farm_conditions_title: 'आपके खेत की स्थितियां',
    soil_type_lbl: 'मिट्टी का प्रकार',
    season_lbl: 'सीजन',
    water_avail_lbl: 'पानी की उपलब्धता',
    get_recommendation_btn: 'सिफारिश प्राप्त करें',
    best_crop_trophy: 'सर्वोत्तम फसल',
    good_alternatives_title: 'अन्य अच्छे विकल्प',
    avoid_crops_title: 'इन फसलों से बचें (हानिकारक)',
    pest_diagnosis_title: 'कीट एवं रोग पहचान',
    symptoms_observed_lbl: 'देखे गए लक्षण',
    upload_leaf_photo: 'पौधे के पत्ते की फोटो अपलोड करें',
    diagnose_pest_btn: 'कीट पहचानें और उपचार प्राप्त करें',
    recommended_pesticide_title: 'अनुशंसित कीटनाशक छिड़काव',
    preventive_measures_title: 'सुरक्षात्मक एवं रोकथाम उपाय',
    report_season_head: 'फसल सीजन प्रदर्शन एवं परामर्श रिपोर्ट',
    report_audit_title: 'वर्तमान सीजन ऑडिट',
    season_2025_26: 'सीजन 2025-26',
    projected_revenue: 'अनुमानित आय',
    yield_bench_sub: 'औसत मानक: 2.30 टन/हेक्टेयर (+23%)',
    rev_target_sub: 'AI लक्ष्य: +₹26,400 अतिरिक्त लाभ',
    soil_health_score: 'मिट्टी स्कोर',
    soil_score_sub: 'उत्कृष्ट NPK और pH संतुलन',
    risk_index: 'जोखिम सूचकांक',
    risk_index_sub: 'अनुकूल मौसम और सुरक्षित',
    report_helps_title: 'यह रिपोर्ट किसानों के लिए कैसे उपयोगी है',
    help_yield_title: '1. उपज और आय बढ़ाएं',
    help_yield_desc: 'आपकी उपज की तुलना जिला मानकों से करती है और प्रति एकड़ अधिक लाभ कमाने के सटीक उपाय बताती है।',
    help_loan_title: '2. बैंक ऋण और सब्सिडी',
    help_loan_desc: 'किसान क्रेडिट कार्ड (KCC) लोन, फसल बीमा (PMFBY), और सरकारी उर्वरक सब्सिडी के लिए आधिकारिक रिकॉर्ड का काम करती है।',
    help_cost_title: '3. उर्वरक खर्च में बचत',
    help_cost_desc: 'अनावश्यक उर्वरक उपयोग को रोककर प्रति एकड़ ₹3,000–₹5,000 की बचत करती है और मिट्टी की उर्वरता बनाए रखती है।',
    farm_history_log: 'फार्म परामर्श इतिहास और इनपुट लॉग',
    th_date: 'तारीख',
    th_crop: 'फसल',
    th_yield_pred: 'उपज अनुमान',
    th_est_rev: 'अनुमानित आय',
    th_action: 'की गई कार्रवाई',
    btn_listen_report: 'रिपोर्ट सुनें (Voice)',
    btn_download_report: 'रिपोर्ट प्रिंट / डाउनलोड करें',
    quick_questions_title: 'त्वरित प्रश्न:',
    ai_bot_greeting: 'नमस्ते किसान भाइयों! फसल, खाद, मौसम और कीट नियंत्रण के बारे में कुछ भी पूछें।',
    chat_placeholder: 'अपना सवाल यहाँ टाइप करें...',
    registered_farmer: 'पंजीकृत किसान',
    farmer_land_profile: 'किसान और भूमि प्रोफाइल',
    full_name_lbl: 'पूरा नाम',
    primary_district_lbl: 'जिला',
    total_land_size_lbl: 'कुल भूमि (एकड़)',
    primary_crop_lbl: 'मुख्य फसल',
    preferred_language_lbl: 'पसंदीदा भाषा',
    save_profile_btn: 'प्रोफाइल सेव करें',
    logout_btn: 'लॉगआउट / उपयोगकर्ता बदलें'
  }
};

function showToast(message, icon = 'fa-circle-check', duration = 2600) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'app-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  toast.classList.add('show');
  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

function selectLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('cropai_lang', lang);
  updateLabels();

  // Sync voice lang dropdowns
  const voiceLangSelect = document.getElementById('voiceLangSelect');
  if (voiceLangSelect) voiceLangSelect.value = lang;

  const profLangSelect = document.getElementById('profLangSelect');
  if (profLangSelect) profLangSelect.value = lang;

  // Sync active class on all lang pills
  document.querySelectorAll('.lang-pill').forEach(btn => {
    if (btn.getAttribute('data-lang') === lang) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  const langNames = {
    en: 'English',
    te: 'తెలుగు (Telugu)',
    hi: 'हिन्दी (Hindi)'
  };
  showToast(`Language: ${langNames[lang] || lang}`, 'fa-globe');

  // If user is on the welcome language screen, advance to home
  const activeScreen = document.querySelector('.screen.active');
  if (activeScreen && activeScreen.id === 'screen-language') {
    showScreen('screen-home');
  }

  // If on Soil Health screen and results are showing, re-run analysis to refresh language
  if (typeof updateSoilLiveStatus === 'function') {
    updateSoilLiveStatus();
  }
  const soilRes = document.getElementById('soilResult');
  if (soilRes && soilRes.style.display !== 'none' && typeof analyzeSoil === 'function') {
    analyzeSoil(false);
  }

  updateFarmReportsScreen();
  updatePredictScreenLang();
}

function updatePredictScreenLang() {
  const lang = currentLang || 'en';

  const cropTranslations = {
    Rice: { en: 'Rice', te: 'వరి', hi: 'चावल' },
    Wheat: { en: 'Wheat', te: 'గోధుమ', hi: 'गेहूं' },
    Maize: { en: 'Maize', te: 'మొక్కజొన్న', hi: 'मक्का' },
    Cotton: { en: 'Cotton', te: 'ప్రత్తి', hi: 'कपास' },
    Sugarcane: { en: 'Sugarcane', te: 'చెరకు', hi: 'गन्ना' },
    Chickpea: { en: 'Chickpea', te: 'శనగలు', hi: 'चना' },
    Potato: { en: 'Potato', te: 'బంగాళాదుంప', hi: 'आलू' },
    Groundnut: { en: 'Groundnut', te: 'వేరుశనగ', hi: 'मूंगफली' },
    Mustard: { en: 'Mustard', te: 'ఆవాలు', hi: 'सरसों' },
    Tomato: { en: 'Tomato', te: 'టమాట', hi: 'टमाटर' },
    Soybean: { en: 'Soybean', te: 'సోయాబీన్', hi: 'सोयाबीन' },
    'Kidney Beans': { en: 'Kidney Beans', te: 'రాజ్మా', hi: 'राजमा' }
  };

  // Update Crop card choice labels
  document.querySelectorAll('.crop-card-choice').forEach(card => {
    const cropKey = card.getAttribute('data-crop');
    const nameEl = card.querySelector('.crop-name');
    if (cropKey && nameEl && cropTranslations[cropKey]) {
      nameEl.textContent = cropTranslations[cropKey][lang] || cropTranslations[cropKey].en;
    }
  });

  // Update Irrigation select options
  const irrSelect = document.getElementById('irrigationSelect');
  if (irrSelect) {
    const irrTranslations = {
      Drip: { en: 'Drip Irrigation', te: 'బిందు సేద్యం (Drip)', hi: 'टपक सिंचाई (Drip)' },
      Sprinkler: { en: 'Sprinkler', te: 'స్ప్రింక్లర్ (Sprinkler)', hi: 'फव्वारा (Sprinkler)' },
      Surface: { en: 'Surface Flood', te: 'కాలువ పారకం (Flood)', hi: 'सतही सिंचाई (Flood)' },
      Rainfed: { en: 'Rainfed (Non-irrigated)', te: 'వర్షాధారం (Rainfed)', hi: 'वर्षा आधारित (Rainfed)' }
    };
    Array.from(irrSelect.options).forEach(opt => {
      if (irrTranslations[opt.value]) {
        opt.textContent = irrTranslations[opt.value][lang] || irrTranslations[opt.value].en;
      }
    });
  }

  // Re-render Key Takeaways if prediction data is stored
  if (window.lastPredictionData && typeof window.renderKeyTakeaways === 'function') {
    window.renderKeyTakeaways(window.lastPredictionData);
  }
}

function updateLabels() {
  const labels = I18N[currentLang] || I18N.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (labels[key]) {
      const icon = el.querySelector('i');
      if (icon) {
        // Preserve icon and update remaining text
        const iconHtml = icon.outerHTML;
        el.innerHTML = iconHtml + ' ' + labels[key];
      } else {
        el.textContent = labels[key];
      }
    }
  });

  // Update input placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (labels[key]) el.setAttribute('placeholder', labels[key]);
  });

  // Sync active status on all lang pills
  document.querySelectorAll('.lang-pill').forEach(btn => {
    if (btn.getAttribute('data-lang') === currentLang) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  // Manage subtitles
  document.querySelectorAll('.te-sub').forEach(el => {
    if (currentLang === 'te') {
      // In Telugu mode, hide if redundant with main title
      const parent = el.parentElement;
      if (parent && parent.querySelector('[data-i18n]')) {
        el.style.display = 'none';
      } else {
        el.style.display = 'none';
      }
    } else if (currentLang === 'hi') {
      el.style.display = 'none';
    } else {
      el.style.display = '';
    }
  });

  document.querySelectorAll('.hi-sub').forEach(el => {
    if (currentLang === 'hi') el.style.display = '';
    else el.style.display = 'none';
  });

  if (typeof updateGreeting === 'function') updateGreeting();
  if (typeof updateFarmReportsScreen === 'function') updateFarmReportsScreen();
  if (typeof updatePredictScreenLang === 'function') updatePredictScreenLang();
}

function updateFarmReportsScreen() {
  const tbody = document.getElementById('farmReportTableBody');
  if (!tbody) return;

  const lang = currentLang || 'en';

  const cropNames = {
    Rice: { en: 'Rice', te: 'వరి', hi: 'चावल' },
    Cotton: { en: 'Cotton', te: 'ప్రత్తి', hi: 'कपास' },
    Wheat: { en: 'Wheat', te: 'గోధుమ', hi: 'गेहूं' }
  };

  const dates = {
    today: { en: 'Today', te: 'ఈరోజు', hi: 'आज' },
    d15aug: { en: '15 Aug 2025', te: '15 ఆగస్టు 2025', hi: '15 अगस्त 2025' },
    d10jan: { en: '10 Jan 2025', te: '10 జనవరి 2025', hi: '10 जनवरी 2025' }
  };

  const badges = {
    optimal: {
      en: '<span class="risk-badge badge-success" style="font-size:0.65rem;">Optimal Soil</span>',
      te: '<span class="risk-badge badge-success" style="font-size:0.65rem;">సారవంతమైన నేల</span>',
      hi: '<span class="risk-badge badge-success" style="font-size:0.65rem;">उत्कृष्ट मिट्टी</span>'
    },
    fertilizer: {
      en: '<span class="risk-badge badge-warning" style="font-size:0.65rem;">Added Urea + DAP</span>',
      te: '<span class="risk-badge badge-warning" style="font-size:0.65rem;">యూరియా + DAP వాడారు</span>',
      hi: '<span class="risk-badge badge-warning" style="font-size:0.65rem;">यूरिया + डीएपी जोड़ा</span>'
    },
    harvest: {
      en: '<span class="risk-badge badge-success" style="font-size:0.65rem;">Harvest Done</span>',
      te: '<span class="risk-badge badge-success" style="font-size:0.65rem;">కోత పూర్తయింది</span>',
      hi: '<span class="risk-badge badge-success" style="font-size:0.65rem;">कटाई संपन्न</span>'
    }
  };

  tbody.innerHTML = `
    <tr style="border-bottom:1px solid var(--border-subtle);">
      <td style="padding:0.6rem;">${dates.today[lang] || dates.today.en}</td>
      <td style="padding:0.6rem; font-weight:700;">${cropNames.Rice[lang] || cropNames.Rice.en}</td>
      <td style="padding:0.6rem; color:#16a34a; font-weight:700;">2.83 T/Ha</td>
      <td style="padding:0.6rem;">₹1,55,650</td>
      <td style="padding:0.6rem;">${badges.optimal[lang] || badges.optimal.en}</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
      <td style="padding:0.6rem;">${dates.d15aug[lang] || dates.d15aug.en}</td>
      <td style="padding:0.6rem; font-weight:700;">${cropNames.Cotton[lang] || cropNames.Cotton.en}</td>
      <td style="padding:0.6rem; color:#d97706; font-weight:700;">1.85 T/Ha</td>
      <td style="padding:0.6rem;">₹1,12,000</td>
      <td style="padding:0.6rem;">${badges.fertilizer[lang] || badges.fertilizer.en}</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
      <td style="padding:0.6rem;">${dates.d10jan[lang] || dates.d10jan.en}</td>
      <td style="padding:0.6rem; font-weight:700;">${cropNames.Wheat[lang] || cropNames.Wheat.en}</td>
      <td style="padding:0.6rem; color:#16a34a; font-weight:700;">3.40 T/Ha</td>
      <td style="padding:0.6rem;">₹1,80,200</td>
      <td style="padding:0.6rem;">${badges.harvest[lang] || badges.harvest.en}</td>
    </tr>
  `;

  // Update Summary Banner titles per language
  const repCrop = document.getElementById('reportCropSummary');
  if (repCrop) {
    const banners = {
      en: 'Rice — Kharif Season',
      te: 'వరి — ఖరీఫ్ సీజన్',
      hi: 'चावल — खरीफ सीजन'
    };
    repCrop.textContent = banners[lang] || banners.en;
  }

  const repFarm = document.getElementById('reportFarmDetails');
  if (repFarm) {
    const details = {
      en: 'Plot: 2.5 Acres · Drip Irrigation · Model: Random Forest',
      te: 'పొలం: 2.5 ఎకరాలు · బిందు సేద్యం (Drip) · మోడల్: AI Random Forest',
      hi: 'खेत: 2.5 एकड़ · टपक सिंचाई (Drip) · मॉडल: AI Random Forest'
    };
    repFarm.textContent = details[lang] || details.en;
  }

  const repRisk = document.getElementById('reportRiskVal');
  if (repRisk) {
    const riskLabels = {
      en: 'Low Risk',
      te: 'తక్కువ ప్రమాదం',
      hi: 'कम जोखिम'
    };
    repRisk.textContent = riskLabels[lang] || riskLabels.en;
  }
}

function speakReportSummary() {
  if (!('speechSynthesis' in window)) {
    showToast('Voice synthesis not supported in this browser.', 'fa-circle-exclamation');
    return;
  }

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    const btn1 = document.getElementById('btnVoiceListen');
    const btn2 = document.getElementById('topbarVoiceReportBtn');
    const defaultLabel = I18N[currentLang]?.btn_listen_report || 'Listen to Summary';
    if (btn1) btn1.innerHTML = `<i class="fa-solid fa-volume-high"></i> <span>${defaultLabel}</span>`;
    if (btn2) btn2.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    showToast('Voice paused', 'fa-pause');
    return;
  }

  const summaries = {
    te: 'రైతు నివేదిక సారాంశం: మీ వరి పంట అంచనా దిగుబడి హెక్టారుకు 2.83 టన్నులు, అంచనా ఆదాయం లక్షా 55 వేల రూపాయలు. నేల ఆరోగ్య స్కోర్ 85 శాతం పొంది ఉత్తమంగా ఉంది. ఈ నివేదికను కిసాన్ క్రెడిట్ కార్డ్ రుణాలు మరియు పంట భీమా కోసం ఉపయోగించవచ్చు.',
    hi: 'किसान रिपोर्ट सारांश: आपकी चावल की फसल का अनुमानित उत्पादन 2.83 टन प्रति हेक्टेयर है, और अनुमानित आय ₹1,55,650 है। मिट्टी का स्वास्थ्य 85% के साथ उत्कृष्ट है। यह रिपोर्ट किसान क्रेडिट कार्ड लोन और फसल बीमा के लिए मान्य है।',
    en: 'Farm Report Summary: Your Rice crop estimated yield is 2.83 tonnes per hectare, with projected revenue of rupees 1,55,650. Soil health score is 85 out of 100 which is optimal. This report can be submitted for Kisan Credit Card loans and government crop insurance.'
  };

  const langCodeMap = { te: 'te-IN', hi: 'hi-IN', en: 'en-IN' };
  const textToSpeak = summaries[currentLang] || summaries.en;
  const langCode = langCodeMap[currentLang] || 'en-IN';

  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = langCode;
  utterance.rate = 0.92;

  const btn1 = document.getElementById('btnVoiceListen');
  const btn2 = document.getElementById('topbarVoiceReportBtn');

  utterance.onstart = () => {
    if (btn1) btn1.innerHTML = '<i class="fa-solid fa-stop"></i> <span>Stop Voice</span>';
    if (btn2) btn2.innerHTML = '<i class="fa-solid fa-stop"></i>';
    showToast('Playing voice report...', 'fa-volume-high');
  };

  utterance.onend = () => {
    const defaultLabel = I18N[currentLang]?.btn_listen_report || 'Listen to Summary';
    if (btn1) btn1.innerHTML = `<i class="fa-solid fa-volume-high"></i> <span>${defaultLabel}</span>`;
    if (btn2) btn2.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
  };

  utterance.onerror = () => {
    const defaultLabel = I18N[currentLang]?.btn_listen_report || 'Listen to Summary';
    if (btn1) btn1.innerHTML = `<i class="fa-solid fa-volume-high"></i> <span>${defaultLabel}</span>`;
    if (btn2) btn2.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
  };

  window.speechSynthesis.speak(utterance);
}

function sendOtp() {
  const mobile = document.getElementById('loginMobile');
  if (!mobile || mobile.value.length !== 10) {
    alert('Please enter a valid 10-digit mobile number.');
    return;
  }
  const btn = document.getElementById('btnSendOtp');
  if (btn) {
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = I18N[currentLang]?.send_otp || 'Send OTP'; btn.disabled = false; }, 3000);
  }
  // Demo OTP
  setTimeout(() => { const otp = document.getElementById('loginOTP'); if (otp) otp.value = '123456'; }, 500);
}

function doLogin() {
  showScreen('screen-home');
  updateGreeting();
}

function continueAsGuest() {
  showScreen('screen-home');
  updateGreeting();
}

function updateGreeting() {
  const hour = new Date().getHours();
  const greetings = {
    en: hour < 12
      ? '<i class="fa-solid fa-sun" style="color:#fbbf24;"></i> Good Morning, Farmer!'
      : hour < 17
        ? '<i class="fa-solid fa-sun" style="color:#f97316;"></i> Good Afternoon, Farmer!'
        : '<i class="fa-solid fa-moon" style="color:#818cf8;"></i> Good Evening, Farmer!',
    te: hour < 12
      ? '<i class="fa-solid fa-sun" style="color:#fbbf24;"></i> శుభోదయం, రైతు!'
      : hour < 17
        ? '<i class="fa-solid fa-sun" style="color:#f97316;"></i> శుభమధ్యాహ్నం, రైతు!'
        : '<i class="fa-solid fa-moon" style="color:#818cf8;"></i> శుభసాయంత్రం, రైతు!',
    hi: hour < 12
      ? '<i class="fa-solid fa-sun" style="color:#fbbf24;"></i> सुप्रभात, किसान!'
      : hour < 17
        ? '<i class="fa-solid fa-sun" style="color:#f97316;"></i> नमस्कार, किसान!'
        : '<i class="fa-solid fa-moon" style="color:#818cf8;"></i> शुभ संध्या, किसान!'
  };
  const el = document.getElementById('homeGreeting');
  if (el) {
    const greet = greetings[currentLang] || greetings.en;
    el.querySelector('.greeting-main').innerHTML = greet;
  }
}

function toggleHighContrast() {
  document.body.classList.toggle('high-contrast');
}

function showComingSoon(featureName) {
  const overlay = document.getElementById('comingSoonOverlay');
  const title = document.getElementById('comingSoonTitle');
  if (overlay) {
    if (title) title.textContent = featureName + ' — Coming Soon!';
    overlay.classList.add('active');
  }
}

function hideComingSoon() {
  const overlay = document.getElementById('comingSoonOverlay');
  if (overlay) overlay.classList.remove('active');
}

// ──────────────────────────────────────────────
// 2. SPLASH SCREEN + BOOT SEQUENCE
// ──────────────────────────────────────────────

(function initSplash() {
  const urlParams = new URLSearchParams(window.location.search);
  const targetFromUrl = urlParams.get('screen') || window.SERVER_INITIAL_SCREEN;

  if (targetFromUrl && targetFromUrl !== 'screen-splash') {
    const savedLang = localStorage.getItem('cropai_lang') || 'en';
    currentLang = savedLang;
    updateLabels();
    showScreen(targetFromUrl, false);
    updateGreeting();
    return;
  }

  const fill = document.getElementById('splashFill');
  if (!fill) return;

  let pct = 0;
  const interval = setInterval(() => {
    pct += Math.random() * 4 + 1;
    if (pct >= 100) {
      pct = 100;
      fill.style.width = '100%';
      clearInterval(interval);
      setTimeout(() => {
        // Check if user already chose a language
        const savedLang = localStorage.getItem('cropai_lang');
        if (savedLang) {
          currentLang = savedLang;
          updateLabels();
          showScreen('screen-home');
          updateGreeting();
        } else {
          showScreen('screen-language');
        }
      }, 400);
    } else {
      fill.style.width = pct + '%';
    }
  }, 50);
})();

// ──────────────────────────────────────────────
// 3. WEATHER SCREEN (standalone)
// ──────────────────────────────────────────────

function fetchWeatherForScreen() {
  const distSelect = document.getElementById('weatherDistrictSelectW');
  const val = distSelect ? distSelect.value : '';
  const url = val
    ? `/api/live-weather?district=${val}`
    : (() => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(pos => {
            fetchAndRenderWeatherScreen(`/api/live-weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
          }, () => fetchAndRenderWeatherScreen('/api/live-weather'));
          return null;
        }
        return '/api/live-weather';
      })();
  if (url) fetchAndRenderWeatherScreen(url);
}

function fetchAndRenderWeatherScreen(url) {
  fetch(url)
    .then(r => r.json())
    .then(d => {
      if (!d.success) return;
      const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      setVal('wTempBig', d.temperature + ' °C');
      setVal('wHumidBig', d.humidity + ' %');
      setVal('wRainBig', d.estimated_seasonal_rainfall_mm + ' mm');

      const grid = document.getElementById('forecastGrid');
      if (grid && d.forecast_7day) {
        grid.innerHTML = '';
        d.forecast_7day.forEach(day => {
          const card = document.createElement('div');
          card.className = 'forecast-card';
          const rainIcon = day.rain_mm > 5
            ? '<i class="fa-solid fa-cloud-showers-heavy" style="color:#60a5fa;"></i>'
            : day.rain_mm > 0
              ? '<i class="fa-solid fa-cloud-sun-rain" style="color:#93c5fd;"></i>'
              : '<i class="fa-solid fa-sun" style="color:#fbbf24;"></i>';
          card.innerHTML = `
            <div class="forecast-day-name">${day.day}</div>
            <div class="forecast-day-date">${day.date || ''}</div>
            <div style="font-size:1.4rem; margin: 4px 0;">${rainIcon}</div>
            <div class="forecast-day-temp">${day.temp_max}°</div>
            <div class="forecast-day-rain"><i class="fa-solid fa-droplet" style="color:#93c5fd;"></i> ${day.rain_mm}mm</div>
            <div class="forecast-day-prob">${day.rain_prob}%</div>
          `;
          grid.appendChild(card);
        });
      }

      const alertBox = document.getElementById('weatherAlertBoxW');
      const alertText = document.getElementById('weatherAlertTextW');
      if (alertBox && alertText) {
        if (d.weather_alert) { alertBox.style.display = 'flex'; alertText.textContent = d.weather_alert; }
        else { alertBox.style.display = 'none'; }
      }

      // Dynamic tips based on weather
      const tips = document.getElementById('weatherTipsList');
      if (tips && d.temperature) {
        const tipsArr = [];
        if (d.temperature > 35) tipsArr.push('<i class="fa-solid fa-temperature-high" style="color:#ef4444;"></i> High temperature today — irrigate crops in early morning or evening');
        if (d.temperature < 15) tipsArr.push('<i class="fa-solid fa-snowflake" style="color:#93c5fd;"></i> Cold weather — protect sensitive seedlings with mulch');
        if (d.humidity > 80) tipsArr.push('<i class="fa-solid fa-droplet" style="color:#0284c7;"></i> High humidity — watch for fungal disease. Spray fungicide if needed');
        tipsArr.push('<i class="fa-solid fa-cloud-sun" style="color:#f59e0b;"></i> Check forecast before spraying pesticides or fertilizers');
        tipsArr.push('<i class="fa-solid fa-droplet" style="color:#0284c7;"></i> Irrigate in the evening to reduce evaporation losses');
        tips.innerHTML = tipsArr.map(t => `<li>${t}</li>`).join('');
      }
    })
    .catch(err => console.error('Weather screen fetch error:', err));
}

document.addEventListener('DOMContentLoaded', () => {
  // District dropdown on weather screen
  const distW = document.getElementById('weatherDistrictSelectW');
  if (distW) {
    distW.addEventListener('change', () => {
      if (distW.value) fetchAndRenderWeatherScreen(`/api/live-weather?district=${distW.value}`);
    });
  }
});

// ──────────────────────────────────────────────
// ──────────────────────────────────────────────
// 4. SOIL HEALTH SCREEN & ENGINE
// ──────────────────────────────────────────────

function syncSliderVal(sliderId, inputId, unit, callback) {
  const slider = document.getElementById(sliderId);
  const hidden = document.getElementById(inputId);
  const valSpan = document.getElementById(sliderId.replace('Slider', 'Val'));
  if (!slider) return;
  const val = slider.value;
  if (hidden) hidden.value = val;
  if (valSpan) valSpan.textContent = val;
  if (typeof callback === 'function') callback();
}

function stepVal(inputId, step, bound) {
  const input = document.getElementById(inputId);
  if (!input) return;
  let cur = parseFloat(input.value) || 2.5;
  cur = Math.round((cur + step) * 10) / 10;
  if (step < 0 && cur < bound) cur = bound;
  if (step > 0 && cur > bound) cur = bound;
  input.value = cur;
  onSoilChange();
}

function setOM(level) {
  const hidden = document.getElementById('soilOM');
  if (hidden) hidden.value = level;
  document.querySelectorAll('#omSegmentControl .seg-btn').forEach(btn => {
    if (btn.getAttribute('data-om') === level) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  onSoilChange();
}

function updateSoilLiveStatus() {
  const n = parseFloat(document.getElementById('soilN')?.value || 90);
  const p = parseFloat(document.getElementById('soilP')?.value || 45);
  const k = parseFloat(document.getElementById('soilK')?.value || 40);
  const ph = parseFloat(document.getElementById('soilPH')?.value || 6.5);
  const moisture = parseFloat(document.getElementById('soilMoisture')?.value || 65);
  const om = document.getElementById('soilOM')?.value || 'medium';
  const acres = parseFloat(document.getElementById('soilFarmAcres')?.value || 2.5);

  // Sync acres badge
  const acresBadge = document.getElementById('acresBadge');
  if (acresBadge) {
    acresBadge.textContent = `${acres} ${(currentLang === 'te') ? 'ఎకరాలు' : (currentLang === 'hi' ? 'एकड़' : 'Acres')}`;
  }

  // Sync OM badge
  const omBadge = document.getElementById('omStatusBadge');
  if (omBadge) {
    if (om === 'high') {
      omBadge.textContent = (currentLang === 'te') ? '✓ ఉత్తమం (>3%)' : (currentLang === 'hi' ? '✓ उत्तम (>3%)' : '✓ High (>3%)');
      omBadge.style.background = '#dcfce7'; omBadge.style.color = '#166534';
    } else if (om === 'medium') {
      omBadge.textContent = (currentLang === 'te') ? 'మధ్యస్థం (1-3%)' : (currentLang === 'hi' ? 'मध्यम (1-3%)' : 'Medium (1-3%)');
      omBadge.style.background = '#dbeafe'; omBadge.style.color = '#1e40af';
    } else {
      omBadge.textContent = (currentLang === 'te') ? '⚠ తక్కువ (<1%)' : (currentLang === 'hi' ? '⚠ कम (<1%)' : '⚠ Low (<1%)');
      omBadge.style.background = '#fee2e2'; omBadge.style.color = '#991b1b';
    }
  }

  // Sync Moisture badge
  const moistureBadge = document.getElementById('moistureStatusBadge');
  if (moistureBadge) {
    if (moisture < 35) {
      moistureBadge.textContent = (currentLang === 'te') ? `⚠ పొడి నేల (${moisture}%)` : (currentLang === 'hi' ? `⚠ सूखी मिट्टी (${moisture}%)` : `⚠ Dry (${moisture}%)`);
      moistureBadge.style.background = '#fee2e2'; moistureBadge.style.color = '#991b1b';
    } else if (moisture > 85) {
      moistureBadge.textContent = (currentLang === 'te') ? `⚠ నీటి నిల్వ (${moisture}%)` : (currentLang === 'hi' ? `⚠ जलभराव (${moisture}%)` : `⚠ Waterlogged (${moisture}%)`);
      moistureBadge.style.background = '#fef3c7'; moistureBadge.style.color = '#92400e';
    } else {
      moistureBadge.textContent = (currentLang === 'te') ? `✓ సరైన తేమ (${moisture}%)` : (currentLang === 'hi' ? `✓ सही नमी (${moisture}%)` : `✓ Good (${moisture}%)`);
      moistureBadge.style.background = '#dcfce7'; moistureBadge.style.color = '#166534';
    }
  }

  // Sync pH badge
  const phBadge = document.getElementById('phStatusBadge');
  if (phBadge) {
    if (ph < 6.0) {
      phBadge.textContent = (currentLang === 'te') ? `⚠ ఆమ్ల నేల (${ph})` : (currentLang === 'hi' ? `⚠ अम्लीय (${ph})` : `⚠ Acidic (${ph})`);
      phBadge.style.background = '#fee2e2'; phBadge.style.color = '#991b1b';
    } else if (ph > 7.8) {
      phBadge.textContent = (currentLang === 'te') ? `⚠ క్షార నేల (${ph})` : (currentLang === 'hi' ? `⚠ क्षारीय (${ph})` : `⚠ Alkaline (${ph})`);
      phBadge.style.background = '#fef3c7'; phBadge.style.color = '#92400e';
    } else {
      phBadge.textContent = (currentLang === 'te') ? `✓ సమతుల్యం (${ph})` : (currentLang === 'hi' ? `✓ संतुलित (${ph})` : `✓ Optimal (${ph})`);
      phBadge.style.background = '#dcfce7'; phBadge.style.color = '#166534';
    }
  }

  // Sync N badge
  const nBadge = document.getElementById('nStatusBadge');
  if (nBadge) {
    if (n < 60) {
      nBadge.textContent = (currentLang === 'te') ? '⚠ లోపం' : (currentLang === 'hi' ? '⚠ कम' : '⚠ Deficit');
      nBadge.style.background = '#fee2e2'; nBadge.style.color = '#991b1b';
    } else if (n > 160) {
      nBadge.textContent = (currentLang === 'te') ? 'అధికం' : (currentLang === 'hi' ? 'अत्यधिक' : 'Excess');
      nBadge.style.background = '#e0f2fe'; nBadge.style.color = '#0369a1';
    } else {
      nBadge.textContent = (currentLang === 'te') ? '✓ సరైనది' : (currentLang === 'hi' ? '✓ संतुलित' : '✓ Optimal');
      nBadge.style.background = '#dcfce7'; nBadge.style.color = '#166534';
    }
  }

  // Sync P badge
  const pBadge = document.getElementById('pStatusBadge');
  if (pBadge) {
    if (p < 30) {
      pBadge.textContent = (currentLang === 'te') ? '⚠ లోపం' : (currentLang === 'hi' ? '⚠ कम' : '⚠ Deficit');
      pBadge.style.background = '#fee2e2'; pBadge.style.color = '#991b1b';
    } else if (p > 85) {
      pBadge.textContent = (currentLang === 'te') ? 'అధికం' : (currentLang === 'hi' ? 'अत्यधिक' : 'Excess');
      pBadge.style.background = '#e0f2fe'; pBadge.style.color = '#0369a1';
    } else {
      pBadge.textContent = (currentLang === 'te') ? '✓ సరైనది' : (currentLang === 'hi' ? '✓ संतुलित' : '✓ Optimal');
      pBadge.style.background = '#dcfce7'; pBadge.style.color = '#166534';
    }
  }

  // Sync K badge
  const kBadge = document.getElementById('kStatusBadge');
  if (kBadge) {
    if (k < 30) {
      kBadge.textContent = (currentLang === 'te') ? '⚠ లోపం' : (currentLang === 'hi' ? '⚠ कम' : '⚠ Deficit');
      kBadge.style.background = '#fee2e2'; kBadge.style.color = '#991b1b';
    } else if (k > 80) {
      kBadge.textContent = (currentLang === 'te') ? 'అధికం' : (currentLang === 'hi' ? 'అత్యధిక' : 'Excess');
      kBadge.style.background = '#e0f2fe'; kBadge.style.color = '#0369a1';
    } else {
      kBadge.textContent = (currentLang === 'te') ? '✓ సరైనది' : (currentLang === 'hi' ? '✓ संतुलित' : '✓ Optimal');
      kBadge.style.background = '#dcfce7'; kBadge.style.color = '#166534';
    }
  }

  // Calculate live score
  let score = 100;
  const bullets = [];

  if (n < 60) {
    score -= 18;
    const bags = Math.ceil(1.2 * acres);
    bullets.push({
      icon: 'fa-leaf', color: '#dc2626',
      textEn: `Nitrogen is low — Add ~${bags} bags of Urea`,
      textTe: `నత్రజని లోపం — సుమారు ${bags} బస్తాల యూరియా అవసరం`,
      textHi: `नाइट्रोजन कम — लगभग ${bags} बोरी यूरिया डालें`
    });
  } else if (n > 160) {
    score -= 6;
    bullets.push({
      icon: 'fa-leaf', color: '#0284c7',
      textEn: 'Nitrogen is high — Skip basal urea application',
      textTe: 'నత్రజని అధికం — అదనపు యూరియా వేయకండి',
      textHi: 'नाइट्रोजन अधिक — अतिरिक्त यूरिया न दें'
    });
  } else {
    bullets.push({
      icon: 'fa-check', color: '#16a34a',
      textEn: 'Nitrogen level is well-balanced for foliage',
      textTe: 'ఆకుల ఎదుగుదలకు నత్రజని సరిపడా ఉంది',
      textHi: 'पत्तियों के विकास के लिए नाइट्रोजन पर्याप्त है'
    });
  }

  if (p < 30) {
    score -= 15;
    const bags = Math.ceil(0.9 * acres);
    bullets.push({
      icon: 'fa-seedling', color: '#dc2626',
      textEn: `Phosphorus is low — Add ~${bags} bags DAP for root vigour`,
      textTe: `భాస్వరం లోపం — వేరు బలానికి ${bags} బస్తాల DAP వేయండి`,
      textHi: `फास्फोरस कम — जड़ों की मजबूती के लिए ${bags} बोरी DAP डालें`
    });
  }

  if (k < 30) {
    score -= 12;
    const bags = Math.ceil(0.8 * acres);
    bullets.push({
      icon: 'fa-shield-halved', color: '#dc2626',
      textEn: `Potash is deficit — Add ~${bags} bags MOP for pest defense`,
      textTe: `పొటాష్ కొరత — రోగ నిరోధకతకు ${bags} బస్తాల MOP వేయండి`,
      textHi: `पोटाश की कमी — रोग प्रतिरोध के लिए ${bags} बोरी MOP डालें`
    });
  }

  if (ph < 6.0) {
    score -= 18;
    bullets.push({
      icon: 'fa-flask', color: '#dc2626',
      textEn: `Acidic soil (pH ${ph}) — Apply Agricultural Lime before sowing`,
      textTe: `ఆమ్ల నేల (pH ${ph}) — విత్తే ముందు వ్యవసాయ సున్నం వాడండి`,
      textHi: `अम्लीय मिट्टी (pH ${ph}) — बुवाई से पहले चूना डालें`
    });
  } else if (ph > 7.8) {
    score -= 15;
    bullets.push({
      icon: 'fa-flask', color: '#ea580c',
      textEn: `Alkaline/Salty soil (pH ${ph}) — Apply Gypsum + Green Manure`,
      textTe: `క్షార/సౌడు నేల (pH ${ph}) — జిప్సం మరియు పచ్చిరొట్ట ఎరువులు వాడండి`,
      textHi: `क्षारीय मिट्टी (pH ${ph}) — जिप्सम और हरी खाद का प्रयोग करें`
    });
  } else {
    bullets.push({
      icon: 'fa-check', color: '#16a34a',
      textEn: `Soil pH (${ph}) is optimal for nutrient uptake`,
      textTe: `నేల pH (${ph}) పోషకాలు గ్రహించడానికి అత్యంత అనుకూలం`,
      textHi: `मिट्टी का pH (${ph}) पोषक तत्वों के अवशोषण के लिए अनुकूल है`
    });
  }

  if (om === 'low') {
    score -= 10;
    bullets.push({
      icon: 'fa-spa', color: '#d97706',
      textEn: 'Low organic matter — Incorporate 3–4 trolleys FYM/compost',
      textTe: 'సేంద్రీయ కర్బనం తక్కువ — 3-4 ట్రాలీల పశువుల ఎరువు వేయండి',
      textHi: 'जैविक कार्बन कम — 3-4 ट्रॉली गोबर की खाद डालें'
    });
  }

  score = Math.max(20, Math.min(100, score));

  // Update live score pill
  const scorePill = document.getElementById('liveScorePill');
  if (scorePill) {
    scorePill.textContent = (currentLang === 'te') ? `స్కోర్: ${score}/100` : (currentLang === 'hi' ? `स्कोर: ${score}/100` : `Score: ${score}/100`);
    if (score >= 80) {
      scorePill.style.background = '#dcfce7'; scorePill.style.color = '#166534';
    } else if (score >= 55) {
      scorePill.style.background = '#fef3c7'; scorePill.style.color = '#92400e';
    } else {
      scorePill.style.background = '#fee2e2'; scorePill.style.color = '#991b1b';
    }
  }

  // Populate live preview bullets
  const bulletsContainer = document.getElementById('livePreviewBullets');
  if (bulletsContainer) {
    bulletsContainer.innerHTML = bullets.slice(0, 4).map(b => {
      const text = (currentLang === 'te') ? b.textTe : (currentLang === 'hi' ? b.textHi : b.textEn);
      return `<div class="preview-bullet-item"><i class="fa-solid ${b.icon}" style="color:${b.color};"></i><span>${text}</span></div>`;
    }).join('');
  }
}

function onSoilChange() {
  updateSoilLiveStatus();
  const soilRes = document.getElementById('soilResult');
  if (soilRes && soilRes.style.display !== 'none') {
    analyzeSoil(false);
  }
}

function applySoilPreset(presetKey) {
  const presets = {
    fertile: { n: 125, p: 55, k: 50, ph: 6.8, moisture: 70, om: 'high', labelEn: 'Fertile Loam', labelTe: 'సారవంతమైన నేల', labelHi: 'उपजाऊ दोमट मिट्टी' },
    red:     { n: 60,  p: 30, k: 35, ph: 6.2, moisture: 45, om: 'medium', labelEn: 'Red / Sandy Soil', labelTe: 'ఎర్ర / ఇసుక నేల', labelHi: 'लाल / बलुई मिट्टी' },
    black:   { n: 95,  p: 45, k: 60, ph: 7.6, moisture: 60, om: 'medium', labelEn: 'Black Cotton Soil', labelTe: 'నల్లరేగడి నేల', labelHi: 'काली कपास मिट्टी' },
    saline:  { n: 45,  p: 20, k: 30, ph: 8.4, moisture: 50, om: 'low', labelEn: 'Alkaline / Saline Soil', labelTe: 'క్షార / చవుడు నేల', labelHi: 'क्षारीय मिट्टी' },
    acidic:  { n: 70,  p: 18, k: 28, ph: 4.8, moisture: 65, om: 'medium', labelEn: 'Acidic Soil', labelTe: 'ఆమ్ల నేల', labelHi: 'अम्लीय मिट्टी' }
  };

  const p = presets[presetKey] || presets.fertile;
  if (document.getElementById('soilN')) document.getElementById('soilN').value = p.n;
  if (document.getElementById('soilP')) document.getElementById('soilP').value = p.p;
  if (document.getElementById('soilK')) document.getElementById('soilK').value = p.k;
  if (document.getElementById('soilPH')) document.getElementById('soilPH').value = p.ph;
  if (document.getElementById('soilMoisture')) document.getElementById('soilMoisture').value = p.moisture;
  if (document.getElementById('soilOM')) document.getElementById('soilOM').value = p.om;

  // Sync UI sliders & value displays
  if (document.getElementById('soilNSlider')) document.getElementById('soilNSlider').value = p.n;
  if (document.getElementById('soilNVal')) document.getElementById('soilNVal').textContent = p.n;
  if (document.getElementById('soilPSlider')) document.getElementById('soilPSlider').value = p.p;
  if (document.getElementById('soilPVal')) document.getElementById('soilPVal').textContent = p.p;
  if (document.getElementById('soilKSlider')) document.getElementById('soilKSlider').value = p.k;
  if (document.getElementById('soilKVal')) document.getElementById('soilKVal').textContent = p.k;
  if (document.getElementById('soilPHSlider')) document.getElementById('soilPHSlider').value = p.ph;
  if (document.getElementById('soilPHVal')) document.getElementById('soilPHVal').textContent = p.ph;
  if (document.getElementById('soilMoistureSlider')) document.getElementById('soilMoistureSlider').value = p.moisture;
  if (document.getElementById('soilMoistureVal')) document.getElementById('soilMoistureVal').textContent = p.moisture;

  // Sync OM segmented control
  document.querySelectorAll('#omSegmentControl .seg-btn').forEach(btn => {
    if (btn.getAttribute('data-om') === p.om) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  // Toggle active preset card
  document.querySelectorAll('.soil-preset-card').forEach(card => {
    if (card.getAttribute('data-preset') === presetKey) card.classList.add('active');
    else card.classList.remove('active');
  });

  const currentName = (currentLang === 'te') ? p.labelTe : (currentLang === 'hi' ? p.labelHi : p.labelEn);
  showToast(`Preset: ${currentName}`, 'fa-wand-magic-sparkles');
  updateSoilLiveStatus();
  analyzeSoil(false);
}

function analyzeSoil(scrollToResult) {
  const n = parseFloat(document.getElementById('soilN')?.value || 90);
  const p = parseFloat(document.getElementById('soilP')?.value || 45);
  const k = parseFloat(document.getElementById('soilK')?.value || 40);
  const ph = parseFloat(document.getElementById('soilPH')?.value || 6.5);
  const moisture = parseFloat(document.getElementById('soilMoisture')?.value || 65);
  const om = document.getElementById('soilOM')?.value || 'medium';
  const acres = parseFloat(document.getElementById('soilFarmAcres')?.value || 2.5);

  let score = 100;
  const meters = [];
  const issues = [];
  let ureaBags = 0;
  let dapBags = 0;
  let mopBags = 0;
  let limeOrGypsum = null;
  let compostBags = 0;

  // 1. Nitrogen Evaluation
  let nStatus = 'opt';
  let nBadgeEn = 'Optimal', nBadgeTe = 'సరైనది', nBadgeHi = 'संतुलित';
  let nBarColor = '#16a34a';
  let nPercent = Math.min(100, Math.round((n / 140) * 100));
  if (n < 40) {
    score -= 22; nStatus = 'low';
    nBadgeEn = 'Severe Deficit'; nBadgeTe = 'తీవ్ర కొరత'; nBadgeHi = 'गंभीर कमी';
    nBarColor = '#dc2626';
    ureaBags = Math.ceil(1.5 * acres);
    issues.push({
      en: 'Severe Nitrogen Deficiency — Stunted plant growth and yellow leaves.',
      te: 'తీవ్ర నత్రజని లోపం — మొక్కలు ఎదగవు, ఆకులు పసుపు రంగులోకి మారుతాయి.',
      hi: 'गंभीर नाइट्रोजन की कमी — पौधों का विकास रुकेगा और पत्तियां पीली पड़ेंगी।'
    });
  } else if (n < 75) {
    score -= 10; nStatus = 'mod';
    nBadgeEn = 'Mild Deficit'; nBadgeTe = 'తక్కువ'; nBadgeHi = 'मध्यम कमी';
    nBarColor = '#d97706';
    ureaBags = Math.ceil(0.8 * acres);
    issues.push({
      en: 'Mild Nitrogen Deficit — Add top-dressing nitrogen for peak biomass.',
      te: 'నత్రజని స్వల్ప లోపం — పైపాటుగా యూరియా వాడి పంట ఎదుగుదలను పెంచండి.',
      hi: 'मध्यम नाइट्रोजन कमी — अच्छी बढ़वार के लिए टॉप-ड्रेसिंग करें।'
    });
  } else if (n > 160) {
    score -= 6; nStatus = 'high';
    nBadgeEn = 'Excess'; nBadgeTe = 'అధికం'; nBadgeHi = 'अत्यधिक';
    nBarColor = '#0284c7';
    issues.push({
      en: 'Excess Nitrogen — Soft stems and high risk of sucking pests.',
      te: 'నత్రజని అధికం — కాండం మెత్తబడి రసం పీల్చే పురుగుల బెడద పెరుగుతుంది.',
      hi: 'नाइट्रोजन की अधिकता — तने कमजोर होंगे और कीटों का खतरा बढ़ेगा।'
    });
  }
  meters.push({
    icon: 'fa-leaf',
    color: '#16a34a',
    name: (currentLang === 'te') ? 'నత్రజని (Nitrogen - N)' : (currentLang === 'hi' ? 'नाइट्रोजन (Nitrogen - N)' : 'Nitrogen (N)'),
    val: `${n} kg/ha`,
    ideal: '100–140 kg/ha',
    badge: (currentLang === 'te') ? nBadgeTe : (currentLang === 'hi' ? nBadgeHi : nBadgeEn),
    badgeBg: (nStatus === 'opt') ? '#dcfce7' : (nStatus === 'mod' ? '#fef3c7' : '#fee2e2'),
    badgeColor: (nStatus === 'opt') ? '#166534' : (nStatus === 'mod' ? '#92400e' : '#991b1b'),
    barColor: nBarColor,
    percent: Math.min(100, Math.max(15, nPercent))
  });

  // 2. Phosphorus Evaluation
  let pStatus = 'opt';
  let pBadgeEn = 'Optimal', pBadgeTe = 'సరైనది', pBadgeHi = 'संतुलित';
  let pBarColor = '#16a34a';
  let pPercent = Math.min(100, Math.round((p / 60) * 100));
  if (p < 25) {
    score -= 18; pStatus = 'low';
    pBadgeEn = 'Deficit'; pBadgeTe = 'లోపం'; pBadgeHi = 'कमी';
    pBarColor = '#dc2626';
    dapBags = Math.ceil(1.0 * acres);
    issues.push({
      en: 'Low Phosphorus — Poor root growth and weak flowering.',
      te: 'భాస్వరం లోపం — వేరు వ్యవస్థ బలహీనపడి, పూత తక్కువగా వస్తుంది.',
      hi: 'फास्फोरस की कमी — जड़ें कमजोर होंगी और फूल कम आएंगे।'
    });
  } else if (p > 90) {
    score -= 4; pStatus = 'high';
    pBadgeEn = 'High'; pBadgeTe = 'అధికం'; pBadgeHi = 'अधिक';
    pBarColor = '#0284c7';
  }
  meters.push({
    icon: 'fa-seedling',
    color: '#059669',
    name: (currentLang === 'te') ? 'భాస్వరం (Phosphorus - P)' : (currentLang === 'hi' ? 'फास्फोरस (Phosphorus - P)' : 'Phosphorus (P)'),
    val: `${p} kg/ha`,
    ideal: '40–60 kg/ha',
    badge: (currentLang === 'te') ? pBadgeTe : (currentLang === 'hi' ? pBadgeHi : pBadgeEn),
    badgeBg: (pStatus === 'opt') ? '#dcfce7' : '#fee2e2',
    badgeColor: (pStatus === 'opt') ? '#166534' : '#991b1b',
    barColor: pBarColor,
    percent: Math.min(100, Math.max(15, pPercent))
  });

  // 3. Potassium Evaluation
  let kStatus = 'opt';
  let kBadgeEn = 'Optimal', kBadgeTe = 'సరైనది', kBadgeHi = 'संतुलित';
  let kBarColor = '#16a34a';
  let kPercent = Math.min(100, Math.round((k / 55) * 100));
  if (k < 25) {
    score -= 14; kStatus = 'low';
    kBadgeEn = 'Deficit'; kBadgeTe = 'లోపం'; kBadgeHi = 'कमी';
    kBarColor = '#dc2626';
    mopBags = Math.ceil(0.8 * acres);
    issues.push({
      en: 'Potassium Deficit — Low disease resistance and drought vulnerability.',
      te: 'పొటాష్ లోపం — రోగనిరోధక శక్తి తగ్గి, పంట తెగుళ్లు మరియు బెట్టకు గురవుతుంది.',
      hi: 'पोटाश की कमी — रोगों और सूखे से लड़ने की क्षमता घटेगी।'
    });
  }
  meters.push({
    icon: 'fa-shield-halved',
    color: '#7c3aed',
    name: (currentLang === 'te') ? 'పొటాష్ (Potassium - K)' : (currentLang === 'hi' ? 'पोटाश (Potassium - K)' : 'Potassium (K)'),
    val: `${k} kg/ha`,
    ideal: '35–55 kg/ha',
    badge: (currentLang === 'te') ? kBadgeTe : (currentLang === 'hi' ? kBadgeHi : kBadgeEn),
    badgeBg: (kStatus === 'opt') ? '#dcfce7' : '#fee2e2',
    badgeColor: (kStatus === 'opt') ? '#166534' : '#991b1b',
    barColor: kBarColor,
    percent: Math.min(100, Math.max(15, kPercent))
  });

  // 4. pH Balance
  let phBadgeEn = 'Balanced Neutral', phBadgeTe = 'సమతుల్య pH', phBadgeHi = 'संतुलित';
  let phBarColor = '#16a34a';
  if (ph < 5.5) {
    score -= 20;
    phBadgeEn = 'Acidic Soil'; phBadgeTe = 'తీవ్ర ఆమ్ల నేల'; phBadgeHi = 'अम्लीय मिट्टी';
    phBarColor = '#dc2626';
    limeOrGypsum = {
      type: 'lime',
      bags: Math.ceil(2.0 * acres),
      en: 'Apply Agricultural Lime (సున్నం) 2-3 weeks before sowing.',
      te: 'విత్తడానికి 2-3 వారాల ముందు వ్యవసాయ సున్నం వేయండి.',
      hi: 'बुवाई से 2-3 सप्ताह पहले कृषि चूना (लाइम) डालें।'
    };
    issues.push({
      en: `Acidic pH (${ph}) locks soil nutrients and stunts root hairs.`,
      te: `ఆమ్ల నేల (${ph}) వల్ల ఎరువులు మొక్కలకు అందవు.`,
      hi: `अम्लीय पीएच (${ph}) पोषक तत्वों का अवशोषण रोकता है।`
    });
  } else if (ph > 7.9) {
    score -= 16;
    phBadgeEn = 'Alkaline / Saline'; phBadgeTe = 'క్షార నేల (సౌడు)'; phBadgeHi = 'क्षारीय मिट्टी';
    phBarColor = '#ea580c';
    limeOrGypsum = {
      type: 'gypsum',
      bags: Math.ceil(2.5 * acres),
      en: 'Apply Gypsum (జిప్సం) + Green Manure (జీలుగు) to leach excess salts.',
      te: 'ఉప్పు శాతాన్ని తగ్గించడానికి జిప్సం మరియు పచ్చిరొట్ట ఎరువులు (జీలుగు) వేయండి.',
      hi: 'लवण कम करने के लिए जिप्सम और हरी खाद का उपयोग करें।'
    };
    issues.push({
      en: `Alkaline/Salty pH (${ph}) causes zinc deficiency and hardpan soil.`,
      te: `క్షార గుణం (${ph}) వల్ల జింక్ లోపం వస్తుంది మరియు భూమి గట్టిపడుతుంది.`,
      hi: `क्षारीयता (${ph}) से जिंक की कमी और जमीन सख्त होती है।`
    });
  }
  meters.push({
    icon: 'fa-flask',
    color: '#d97706',
    name: (currentLang === 'te') ? 'నేల pH (Acidity/Alkalinity)' : (currentLang === 'hi' ? 'मिट्टी का pH मान' : 'Soil pH Reaction'),
    val: `pH ${ph}`,
    ideal: '6.2–7.5 (Neutral)',
    badge: (currentLang === 'te') ? phBadgeTe : (currentLang === 'hi' ? phBadgeHi : phBadgeEn),
    badgeBg: (ph >= 6.0 && ph <= 7.8) ? '#dcfce7' : '#fee2e2',
    badgeColor: (ph >= 6.0 && ph <= 7.8) ? '#166534' : '#991b1b',
    barColor: phBarColor,
    percent: Math.min(100, Math.max(10, Math.round((ph / 10) * 100)))
  });

  // 5. Moisture & Organic Matter
  if (moisture < 35) score -= 8;
  if (om === 'low') {
    score -= 10;
    compostBags = Math.ceil(3 * acres);
    issues.push({
      en: 'Low Organic Carbon — Soil has low water retention and poor microbes.',
      te: 'సేంద్రీయ కర్బనం తక్కువ — భూమిలో తేమ నిల్వ సామర్థ్యం మరియు సూక్ష్మజీవులు తక్కువ.',
      hi: 'कम जैविक कार्बन — मिट्टी में नमी रोकने और जीवाणुओं की कमी है।'
    });
  }

  score = Math.max(15, Math.min(100, score));

  // Render Hero
  const hero = document.getElementById('soilResultHero');
  const statusEl = document.getElementById('soilResultStatus');
  const statusTeEl = document.getElementById('soilResultStatusTe');
  const scoreEl = document.getElementById('soilResultScore');

  let gradeEn, gradeTe, gradeHi, heroGrad;
  if (score >= 82) {
    gradeEn = '<i class="fa-solid fa-circle-check"></i> Fertile & Healthy Soil';
    gradeTe = 'సారవంతమైన ఆరోగ్యకరమైన నేల';
    gradeHi = 'उत्कृष्ट व उपजाऊ मिट्टी';
    heroGrad = 'linear-gradient(135deg, #14532d, #16a34a)';
  } else if (score >= 58) {
    gradeEn = '<i class="fa-solid fa-triangle-exclamation"></i> Moderate Quality Soil';
    gradeTe = 'మధ్యస్థ సారవంతమైన నేల — ఎరువుల అవసరం';
    gradeHi = 'मध्यम गुणवत्ता मिट्टी — खाद जरूरी';
    heroGrad = 'linear-gradient(135deg, #78350f, #d97706)';
  } else {
    gradeEn = '<i class="fa-solid fa-triangle-exclamation"></i> Depleted Soil — High Risk';
    gradeTe = 'క్షీణించిన నేల — ప్రత్యేక చికిత్స అవసరం';
    gradeHi = 'कमजोर मिट्टी — उपचार आवश्यक';
    heroGrad = 'linear-gradient(135deg, #7f1d1d, #dc2626)';
  }

  if (hero) hero.style.background = heroGrad;
  if (statusEl) statusEl.innerHTML = (currentLang === 'te') ? `<i class="fa-solid fa-seedling"></i> ${gradeTe}` : (currentLang === 'hi' ? `<i class="fa-solid fa-seedling"></i> ${gradeHi}` : gradeEn);
  if (statusTeEl) statusTeEl.textContent = (currentLang === 'te') ? `మొత్తం స్కోర్: ${score}/100` : (currentLang === 'hi' ? `कुल स्वास्थ्य स्कोर: ${score}/100` : `Quality Score: ${score}/100`);
  if (scoreEl) scoreEl.textContent = `Field Health Rating: ${score}/100`;

  // Render Meters Grid
  const metersGrid = document.getElementById('soilMetersGrid');
  if (metersGrid) {
    metersGrid.innerHTML = meters.map(m => `
      <div class="soil-meter-card">
        <div class="soil-meter-head">
          <span class="soil-meter-name"><i class="fa-solid ${m.icon}" style="color:${m.color};"></i> ${m.name}</span>
          <span class="soil-meter-badge" style="background:${m.badgeBg}; color:${m.badgeColor};">${m.badge}</span>
        </div>
        <div class="soil-meter-val">${m.val}</div>
        <div class="soil-meter-bar">
          <div class="soil-meter-fill" style="width:${m.percent}%; background:${m.barColor};"></div>
        </div>
        <div class="soil-meter-sub">${(currentLang === 'te') ? 'సిఫారసు చేసిన పరిధి:' : (currentLang === 'hi' ? 'आदर्श स्तर:' : 'Target Range:')} ${m.ideal}</div>
      </div>
    `).join('');
  }

  // Render Fertilizer Plan
  const fertCard = document.getElementById('soilFertDosageCard');
  if (fertCard) {
    let fertHtml = '';
    const items = [];
    if (ureaBags > 0) items.push({ icon: 'fa-cubes-stacked', color: '#16a34a', nameEn: 'Urea (46% N)', nameTe: 'యూరియా (నత్రజని)', nameHi: 'यूरिया', bags: `${ureaBags} Bags (50kg)` });
    if (dapBags > 0)  items.push({ icon: 'fa-shield-halved', color: '#059669', nameEn: 'DAP / Single Super Phosphate', nameTe: 'డి.ఎ.పి (భాస్వరం)', nameHi: 'डीएपी / सुपर फास्फेट', bags: `${dapBags} Bags (50kg)` });
    if (mopBags > 0)  items.push({ icon: 'fa-circle-dot', color: '#7c3aed', nameEn: 'MOP Potash (0-0-60)', nameTe: 'పొటాష్ ఎరువు (ఎం.ఓ.పి)', nameHi: 'म्यूरेट ऑफ पोटाश', bags: `${mopBags} Bags (50kg)` });
    if (limeOrGypsum) items.push({ icon: 'fa-mountain', color: '#d97706', nameEn: (limeOrGypsum.type === 'lime' ? 'Agricultural Lime (సున్నం)' : 'Gypsum (జిప్సం)'), nameTe: (limeOrGypsum.type === 'lime' ? 'వ్యవసాయ సున్నం' : 'జిప్సం ఖనిజం'), nameHi: (limeOrGypsum.type === 'lime' ? 'कृषि चूना' : 'जिप्सम'), bags: `${limeOrGypsum.bags} Bags (50kg)` });
    if (compostBags > 0) items.push({ icon: 'fa-spa', color: '#65a30d', nameEn: 'Farmyard Manure / Compost', nameTe: 'పశువుల ఎరువు / కంపోస్ట్', nameHi: 'गोबर की खाद / कम्पोस्ट', bags: `${compostBags} Tractor Trolley / Bags` });

    if (items.length === 0) {
      fertHtml = `
        <div style="text-align:center; padding:0.5rem; color:#166534; font-weight:700;">
          <i class="fa-solid fa-circle-check" style="font-size:1.4rem; display:block; margin-bottom:4px;"></i>
          ${(currentLang === 'te') ? 'మీ నేలలో ప్రధాన పోషకాలు సమతుల్యంగా ఉన్నాయి! అదనపు రసాయన ఎరువులు అవసరం లేదు.' : (currentLang === 'hi' ? 'आपकी मिट्टी में मुख्य पोषक तत्व संतुलित हैं! अतिरिक्त रासायनिक खाद की जरूरत नहीं।' : 'Your soil nutrients are well balanced! No extra chemical fertilizer bags required.')}
        </div>
      `;
    } else {
      fertHtml = items.map(it => `
        <div class="soil-fert-row">
          <span class="soil-fert-name">
            <i class="fa-solid ${it.icon}" style="color:${it.color};"></i>
            ${(currentLang === 'te') ? it.nameTe : (currentLang === 'hi' ? it.nameHi : it.nameEn)}
          </span>
          <span class="soil-fert-bags">${it.bags}</span>
        </div>
      `).join('');
    }
    fertCard.innerHTML = fertHtml;
  }

  // Render Best Crops
  const cropsGrid = document.getElementById('soilCropsGrid');
  if (cropsGrid) {
    let cropPicks = [
      { name: 'Rice', nameTe: 'వరి', icon: 'fa-wheat-awn', match: '96%' },
      { name: 'Maize', nameTe: 'మొక్కజొన్న', icon: 'fa-cubes-stacked', match: '92%' },
      { name: 'Groundnut', nameTe: 'వేరుశనగ', icon: 'fa-bowl-food', match: '88%' }
    ];
    if (ph > 7.5 || n < 70) {
      cropPicks = [
        { name: 'Cotton', nameTe: 'పత్తి', icon: 'fa-feather-pointed', match: '94%' },
        { name: 'Wheat', nameTe: 'గోధుమ', icon: 'fa-seedling', match: '90%' },
        { name: 'Chickpea', nameTe: 'శనగలు', icon: 'fa-circle-dot', match: '87%' }
      ];
    } else if (ph < 5.8) {
      cropPicks = [
        { name: 'Potato', nameTe: 'బంగాళాదుంప', icon: 'fa-egg', match: '95%' },
        { name: 'Tomato', nameTe: 'టమాట', icon: 'fa-apple-whole', match: '89%' },
        { name: 'Maize', nameTe: 'మొక్కజొన్న', icon: 'fa-cubes-stacked', match: '84%' }
      ];
    }

    cropsGrid.innerHTML = cropPicks.map(c => `
      <div class="soil-crop-item">
        <i class="fa-solid ${c.icon} soil-crop-icon"></i>
        <div class="soil-crop-name">${(currentLang === 'te') ? c.nameTe : c.name}</div>
        <span class="soil-crop-match">${c.match} Match</span>
        <button type="button" class="btn-crop-link" onclick="useSoilForPrediction('${c.name}')">
          <span>Predict</span> <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    `).join('');
  }

  // Render Issues & Advice
  const list = document.getElementById('soilResultList');
  if (list) {
    list.innerHTML = '';
    if (issues.length === 0) {
      const card = document.createElement('div');
      card.className = 'advisory-card';
      const msg = (currentLang === 'te')
        ? 'మీ నేల అద్భుతమైన స్థితిలో ఉంది! పంట మార్పిడి పద్ధతులు మరియు సేంద్రీయ ఎరువులతో నేల సారవంతాన్ని నిరంతరం కాపాడుకోండి.'
        : (currentLang === 'hi'
          ? 'आपकी मिट्टी उत्कृष्ट स्थिति में है! फसल चक्र और जैविक खाद के साथ उर्वरता बनाए रखें।'
          : 'Your soil is in top agronomic condition! Continue balanced crop rotation and organic manure.');
      card.innerHTML = `<div class="advisory-title"><span><i class="fa-solid fa-circle-check" style="color:#16a34a;"></i> Optimal Field Condition</span></div><div class="advisory-desc">${msg}</div>`;
      list.appendChild(card);
    } else {
      issues.forEach(iss => {
        const card = document.createElement('div');
        card.className = 'advisory-card high-priority';
        const txt = (currentLang === 'te') ? iss.te : (currentLang === 'hi' ? iss.hi : iss.en);
        card.innerHTML = `<div class="advisory-desc"><i class="fa-solid fa-circle-exclamation" style="color:#dc2626; margin-right:6px;"></i>${txt}</div>`;
        list.appendChild(card);
      });
    }
  }

  // Setup Speech Texts
  window.lastSoilSpeechEn = `Soil analysis complete. Overall score is ${score} out of 100. ${ureaBags > 0 ? `Apply ${ureaBags} bags of Urea` : 'Nitrogen is optimal'}. ${limeOrGypsum ? limeOrGypsum.en : 'Soil pH is balanced'}.`;
  window.lastSoilSpeechTe = `నేల విశ్లేషణ పూర్తయింది. నేల ఆరోగ్య స్కోరు 100 కి ${score}. ${ureaBags > 0 ? `${ureaBags} బస్తాల యూరియా వేయండి.` : 'నత్రజని సరిపడా ఉంది.'} ${limeOrGypsum ? limeOrGypsum.te : 'నేల పి హెచ్ సమతుల్యంగా ఉంది.'}`;
  window.lastSoilSpeechHi = `मिट्टी विश्लेषण पूरा हुआ। स्वास्थ्य स्कोर 100 में से ${score} है। ${ureaBags > 0 ? `${ureaBags} बोरी यूरिया डालें।` : 'नाइट्रोजन पर्याप्त है।'}`;

  document.getElementById('soilResult').style.display = 'block';
  if (scrollToResult) {
    document.getElementById('soilResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function speakSoilDiagnosis() {
  if (!('speechSynthesis' in window)) {
    showToast('Voice speech not supported on this browser', 'fa-triangle-exclamation');
    return;
  }
  const btn = document.getElementById('soilVoiceBtn');
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    if (btn) {
      btn.classList.remove('speaking');
      btn.innerHTML = '<i class="fa-solid fa-volume-high"></i> <span>Listen (వినండి)</span>';
    }
    return;
  }

  let text = window.lastSoilSpeechEn || 'Soil analysis ready.';
  let langCode = 'en-IN';
  if (currentLang === 'te' && window.lastSoilSpeechTe) { text = window.lastSoilSpeechTe; langCode = 'te-IN'; }
  else if (currentLang === 'hi' && window.lastSoilSpeechHi) { text = window.lastSoilSpeechHi; langCode = 'hi-IN'; }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode;
  utterance.rate = 0.92;
  utterance.onstart = () => {
    if (btn) {
      btn.classList.add('speaking');
      btn.innerHTML = '<i class="fa-solid fa-stop"></i> <span>Stop (ఆపండి)</span>';
    }
  };
  utterance.onend = () => {
    if (btn) {
      btn.classList.remove('speaking');
      btn.innerHTML = '<i class="fa-solid fa-volume-high"></i> <span>Listen (వినండి)</span>';
    }
  };
  utterance.onerror = () => {
    if (btn) {
      btn.classList.remove('speaking');
      btn.innerHTML = '<i class="fa-solid fa-volume-high"></i> <span>Listen (వినండి)</span>';
    }
  };
  window.speechSynthesis.speak(utterance);
}

function useSoilForPrediction(cropName) {
  const n  = document.getElementById('soilN')?.value || 90;
  const p  = document.getElementById('soilP')?.value || 45;
  const k  = document.getElementById('soilK')?.value || 40;
  const ph = document.getElementById('soilPH')?.value || 6.5;

  // Set hidden soil values in prediction form
  if (document.getElementById('nitrogenInput'))   document.getElementById('nitrogenInput').value = n;
  if (document.getElementById('phosphorusInput')) document.getElementById('phosphorusInput').value = p;
  if (document.getElementById('potassiumInput'))  document.getElementById('potassiumInput').value = k;
  if (document.getElementById('phInput'))         document.getElementById('phInput').value = ph;

  // Set selected crop in visual grid
  const cropInput = document.getElementById('cropSelect');
  if (cropInput) cropInput.value = cropName;
  document.querySelectorAll('.crop-card-choice').forEach(card => {
    if (card.getAttribute('data-crop') === cropName) card.classList.add('selected');
    else card.classList.remove('selected');
  });

  showToast(`Loaded ${cropName} with Soil Data`, 'fa-wheat-awn');
  showScreen('screen-predict');
  if (typeof submitPredictionForm === 'function') {
    submitPredictionForm(true);
  }
}

// ──────────────────────────────────────────────
// 5. CROP RECOMMENDATION SCREEN
// ──────────────────────────────────────────────

function getCropRecommendation() {
  const soilType  = document.getElementById('rcSoilType')?.value || 'alluvial';
  const season    = document.getElementById('rcSeason')?.value || 'kharif';
  const water     = document.getElementById('rcWater')?.value || 'medium';
  const district  = document.getElementById('rcDistrict')?.value || '';

  // Rule-based recommendation engine
  const rules = {
    alluvial: {
      kharif:    { high: ['Rice', 'Sugarcane', 'Maize'],       medium: ['Rice', 'Maize', 'Soybean'],        low: ['Groundnut', 'Chickpea', 'Maize'] },
      rabi:      { high: ['Wheat', 'Mustard', 'Potato'],       medium: ['Wheat', 'Mustard', 'Chickpea'],    low: ['Mustard', 'Chickpea', 'Wheat'] },
      zaid:      { high: ['Maize', 'Tomato', 'Sugarcane'],     medium: ['Maize', 'Tomato', 'Groundnut'],    low: ['Groundnut', 'Maize', 'Mustard'] },
      perennial: { high: ['Sugarcane', 'Potato', 'Rice'],      medium: ['Maize', 'Soybean', 'Chickpea'],   low: ['Chickpea', 'Groundnut', 'Mustard'] }
    },
    black: {
      kharif:    { high: ['Cotton', 'Soybean', 'Sugarcane'],   medium: ['Cotton', 'Soybean', 'Maize'],      low: ['Groundnut', 'Soybean', 'Chickpea'] },
      rabi:      { high: ['Wheat', 'Chickpea', 'Mustard'],     medium: ['Wheat', 'Chickpea', 'Soybean'],   low: ['Chickpea', 'Mustard', 'Wheat'] },
      zaid:      { high: ['Maize', 'Soybean', 'Cotton'],       medium: ['Maize', 'Groundnut', 'Soybean'],  low: ['Groundnut', 'Chickpea', 'Maize'] },
      perennial: { high: ['Cotton', 'Sugarcane', 'Wheat'],     medium: ['Cotton', 'Wheat', 'Chickpea'],    low: ['Chickpea', 'Mustard', 'Groundnut'] }
    },
    red: {
      kharif:    { high: ['Groundnut', 'Rice', 'Cotton'],      medium: ['Groundnut', 'Maize', 'Soybean'],  low: ['Groundnut', 'Chickpea', 'Mustard'] },
      rabi:      { high: ['Mustard', 'Chickpea', 'Wheat'],     medium: ['Mustard', 'Chickpea', 'Groundnut'], low: ['Chickpea', 'Mustard', 'Groundnut'] },
      zaid:      { high: ['Maize', 'Groundnut', 'Cotton'],     medium: ['Groundnut', 'Maize', 'Chickpea'], low: ['Groundnut', 'Chickpea', 'Mustard'] },
      perennial: { high: ['Groundnut', 'Cotton', 'Maize'],     medium: ['Groundnut', 'Maize', 'Soybean'],  low: ['Groundnut', 'Chickpea', 'Mustard'] }
    },
    sandy: {
      kharif:    { high: ['Groundnut', 'Maize', 'Soybean'],    medium: ['Groundnut', 'Maize', 'Chickpea'], low: ['Groundnut', 'Mustard', 'Chickpea'] },
      rabi:      { high: ['Mustard', 'Chickpea', 'Wheat'],     medium: ['Mustard', 'Chickpea', 'Groundnut'], low: ['Mustard', 'Chickpea', 'Groundnut'] },
      zaid:      { high: ['Maize', 'Groundnut', 'Tomato'],     medium: ['Groundnut', 'Maize', 'Chickpea'], low: ['Groundnut', 'Chickpea', 'Mustard'] },
      perennial: { high: ['Groundnut', 'Maize', 'Mustard'],    medium: ['Groundnut', 'Mustard', 'Chickpea'], low: ['Groundnut', 'Chickpea', 'Mustard'] }
    },
    loamy: {
      kharif:    { high: ['Rice', 'Maize', 'Sugarcane'],       medium: ['Maize', 'Soybean', 'Rice'],        low: ['Maize', 'Groundnut', 'Chickpea'] },
      rabi:      { high: ['Wheat', 'Potato', 'Mustard'],       medium: ['Wheat', 'Mustard', 'Chickpea'],    low: ['Mustard', 'Chickpea', 'Wheat'] },
      zaid:      { high: ['Maize', 'Tomato', 'Potato'],        medium: ['Maize', 'Tomato', 'Groundnut'],    low: ['Groundnut', 'Maize', 'Mustard'] },
      perennial: { high: ['Sugarcane', 'Rice', 'Maize'],       medium: ['Maize', 'Wheat', 'Soybean'],       low: ['Wheat', 'Chickpea', 'Mustard'] }
    },
    clay: {
      kharif:    { high: ['Rice', 'Sugarcane', 'Cotton'],      medium: ['Rice', 'Cotton', 'Maize'],         low: ['Rice', 'Chickpea', 'Maize'] },
      rabi:      { high: ['Wheat', 'Mustard', 'Chickpea'],     medium: ['Wheat', 'Chickpea', 'Mustard'],    low: ['Chickpea', 'Mustard', 'Wheat'] },
      zaid:      { high: ['Rice', 'Sugarcane', 'Maize'],       medium: ['Maize', 'Rice', 'Cotton'],         low: ['Maize', 'Chickpea', 'Groundnut'] },
      perennial: { high: ['Rice', 'Sugarcane', 'Cotton'],      medium: ['Rice', 'Cotton', 'Maize'],         low: ['Rice', 'Chickpea', 'Maize'] }
    }
  };

  const seasonKey = season in { kharif:1,rabi:1,zaid:1,perennial:1 } ? season : 'kharif';
  const waterKey  = water in { high:1,medium:1,low:1 } ? water : 'medium';
  const soilKey   = soilType in rules ? soilType : 'alluvial';

  const crops = rules[soilKey]?.[seasonKey]?.[waterKey] || ['Rice', 'Wheat', 'Maize'];
  const best   = crops[0];
  const second = crops[1];
  const third  = crops[2];

  // Suitability scores
  const scores = { [best]: 94, [second]: 78, [third]: 62 };

  // All crops — avoid ones with very poor match
  const allCrops = ['Rice','Wheat','Maize','Cotton','Sugarcane','Chickpea','Potato','Groundnut','Mustard','Tomato','Soybean','Kidney Beans'];
  const avoid = allCrops.filter(c => !crops.includes(c)).slice(0, 3);

  // Reasons
  const reasons = {
    high:   ['<i class="fa-solid fa-check"></i> Well-Irrigated', '<i class="fa-solid fa-check"></i> Optimal Soil', '<i class="fa-solid fa-check"></i> Good Market Demand'],
    medium: ['<i class="fa-solid fa-check"></i> Moderate Water', '<i class="fa-solid fa-check"></i> Suitable Soil', '<i class="fa-solid fa-check"></i> Reliable Yield'],
    low:    ['<i class="fa-solid fa-check"></i> Low Water Need', '<i class="fa-solid fa-check"></i> Drought Tolerant', '<i class="fa-solid fa-check"></i> Sandy Soil Adapted']
  };
  const bestReasons = reasons[waterKey];

  // Telugu translations for best crop
  const cropsTe = { Rice: 'వరి', Wheat: 'గోధుమ', Maize: 'మొక్కజొన్న', Cotton: 'పత్తి', Sugarcane: 'చెరకు', Chickpea: 'చనగలు', Potato: 'బంగాళాదుంప', Groundnut: 'వేరుశనగ', Mustard: 'ఆవాలు', Tomato: 'టమాట', Soybean: 'సోయాబీన్', 'Kidney Beans': 'రాజ్మా' };

  // Render
  document.getElementById('rcBestName').textContent = best + (currentLang === 'te' ? ` (${cropsTe[best] || ''})` : '');
  document.getElementById('rcBestScore').textContent = `Suitability: ${scores[best]}%`;

  const reasonsEl = document.getElementById('rcBestReasons');
  if (reasonsEl) {
    reasonsEl.innerHTML = bestReasons.map(r => `<span class="rc-reason-tag">${r}</span>`).join('');
  }

  const othersGrid = document.getElementById('rcOthersGrid');
  if (othersGrid) {
    othersGrid.innerHTML = [second, third].map(c => `
      <div class="rc-other-card">
        <div class="rc-other-name"><i class="fa-solid fa-wheat-awn" style="color:#2d6a4f;margin-right:4px;"></i>${c}</div>
        <div class="rc-other-score">${scores[c] || 65}% match</div>
        ${currentLang === 'te' ? `<div class="te-sub" style="font-size:0.75rem;color:#2d6a4f;">${cropsTe[c] || ''}</div>` : ''}
      </div>
    `).join('');
  }

  const avoidList = document.getElementById('rcAvoidList');
  if (avoidList) {
    avoidList.innerHTML = avoid.map(c => `<span class="rc-avoid-chip"><i class="fa-solid fa-circle-xmark" style="color:#dc2626;margin-right:3px;"></i>${c}</span>`).join('');
  }

  document.getElementById('rcResult').style.display = 'block';
  document.getElementById('rcResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ──────────────────────────────────────────────
// 5.1 PEST DETECTION ENGINE
// ──────────────────────────────────────────────

const PEST_DATABASE = {
  Rice: {
    blast: {
      name: 'Rice Leaf Blast (Magnaporthe oryzae)',
      nameTe: 'వరి మెడ విరుపు / అగ్గి తెగులు',
      severity: 'high',
      confidence: 95,
      treatments: [
        'Spray Tricyclazole 75% WP @ 0.6g per liter of water.',
        'Apply Kasugamycin 3% SL @ 2.5ml per liter if infection spreads.',
        'Avoid excess urea application during cloudy/humid weather.'
      ],
      prevention: [
        'Use blast-resistant varieties like MTU 1010 or NLR 34449.',
        'Treat seeds with Carbendazim 2g/kg seed before sowing.'
      ]
    },
    stem_borer: {
      name: 'Yellow Stem Borer (Scirpophaga incertulas)',
      nameTe: 'వరి కాండం తొలుచు పురుగు',
      severity: 'high',
      confidence: 93,
      treatments: [
        'Apply Chlorantraniliprole 0.4% G (Ferterra) @ 4 kg per acre.',
        'Alternatively spray Cartap Hydrochloride 50% SP @ 2g per liter.'
      ],
      prevention: [
        'Install 5 pheromone traps per acre for early monitoring.',
        'Clip seedling tips before transplanting to remove egg masses.'
      ]
    },
    default: {
      name: 'Rice Brown Plant Hopper (BPH)',
      nameTe: 'సుడి దోమ తెగులు',
      severity: 'medium',
      confidence: 89,
      treatments: [
        'Spray Pymetrozine 50% WG @ 120g per acre.',
        'Drain field water completely for 3-4 days to break insect lifecycle.'
      ],
      prevention: [
        'Provide alleyways (30cm spacing every 2 meters) for sunlight penetration.'
      ]
    }
  },
  Cotton: {
    bollworm: {
      name: 'Pink Bollworm (Pectinophora gossypiella)',
      nameTe: 'గులాబీ రంగు కాయ తొలిచే పురుగు',
      severity: 'high',
      confidence: 97,
      treatments: [
        'Spray Emamectin Benzoate 5% SG @ 0.5g per liter of water.',
        'Spray Profenofos 50% EC @ 2ml per liter at 60-70 days stage.',
        'Install 8-10 Gossyplure pheromone traps per acre.'
      ],
      prevention: [
        'Avoid ratoon cotton crop and clean up shed squares/bolls.',
        'Release Trichogramma bactrae egg parasitoids @ 60,000/acre.'
      ]
    },
    aphids: {
      name: 'Cotton Aphids & Whiteflies',
      nameTe: 'తామర పురుగులు మరియు తెల్లదోమ',
      severity: 'medium',
      confidence: 91,
      treatments: [
        'Spray Acetamiprid 20% SP @ 0.2g per liter or Flonicamid 50% WG @ 0.4g per liter.',
        'Spray 5% Neem seed kernel extract (NSKE) as organic repellent.'
      ],
      prevention: [
        'Place yellow sticky traps (15 per acre) across the field boundary.'
      ]
    },
    default: {
      name: 'Cotton Bacterial Leaf Blight',
      nameTe: 'పత్తి బాక్టీరియా ఆకు మచ్చ',
      severity: 'medium',
      confidence: 88,
      treatments: [
        'Spray Copper Oxychloride 50% WP (3g/L) mixed with Streptocycline (1g/10L).'
      ],
      prevention: [
        'Seed acid delinting before sowing and crop rotation with sorghum.'
      ]
    }
  },
  Wheat: {
    rust: {
      name: 'Brown Leaf Rust (Puccinia triticina)',
      nameTe: 'గోధుమ తుప్పు తెగులు',
      severity: 'high',
      confidence: 94,
      treatments: [
        'Spray Propiconazole 25% EC (Tilt) @ 1ml per liter immediately.',
        'Repeat spray after 15 days if rust pustules spread to flag leaf.'
      ],
      prevention: [
        'Sow rust-resistant varieties such as HD-2967 or PBW-550.',
        'Avoid late sowing in December.'
      ]
    },
    default: {
      name: 'Wheat Loose Smut / Aphids',
      nameTe: 'గోధుమ కాటుక తెగులు',
      severity: 'medium',
      confidence: 87,
      treatments: [
        'Spray Imidacloprid 17.8% SL @ 0.3ml per liter for aphid clusters.'
      ],
      prevention: [
        'Solar heat treatment of seeds or carboxin treatment before sowing.'
      ]
    }
  },
  Maize: {
    bollworm: {
      name: 'Fall Armyworm (Spodoptera frugiperda)',
      nameTe: 'మొక్కజొన్న కత్తెర పురుగు',
      severity: 'high',
      confidence: 96,
      treatments: [
        'Apply Chlorantraniliprole 18.5% SC @ 0.4ml/L into whorls of plants.',
        'Alternatively apply Emamectin Benzoate 5% SG @ 0.4g/L.'
      ],
      prevention: [
        'Apply dry sand or wood ash into whorls to suffocate larvae.',
        'Install 5 pheromone traps per acre at 15 days after germination.'
      ]
    },
    stem_borer: {
      name: 'Maize Stem Borer (Chilo partellus)',
      nameTe: 'మొక్కజొన్న కాండం తొలుచు పురుగు',
      severity: 'high',
      confidence: 92,
      treatments: [
        'Whorl application of Carbofuran 3G @ 3 kg/acre at 20-30 days stage.',
        'Spray Deltamethrin 2.8% EC @ 1ml per liter.'
      ],
      prevention: [
        'Destroy stubbles after harvest to eliminate overwintering pupae.'
      ]
    },
    default: {
      name: 'Maize Turcicum Leaf Blight',
      nameTe: 'మొక్కజొన్న ఆకు ఎండు తెగులు',
      severity: 'medium',
      confidence: 89,
      treatments: [
        'Spray Mancozeb 75% WP @ 2.5g per liter or Azoxystrobin @ 1ml/L.'
      ],
      prevention: [
        'Crop rotation with legumes and balanced potassium application.'
      ]
    }
  },
  Tomato: {
    blast: {
      name: 'Tomato Early Blight (Alternaria solani)',
      nameTe: 'టమాట ముందస్తు మచ్చ తెగులు',
      severity: 'high',
      confidence: 95,
      treatments: [
        'Spray Mancozeb 75% WP @ 2.5g/L or Chlorothalonil 75% WP @ 2g/L.',
        'If severe, alternate with Difenoconazole 25% EC @ 1ml/L.'
      ],
      prevention: [
        'Remove lower infected leaves touching moist soil.',
        'Provide drip irrigation to keep foliage dry.'
      ]
    },
    aphids: {
      name: 'Tomato Whiteflies & Leaf Curl Virus Vector',
      nameTe: 'టమాట ఆకుముడత మరియు తెల్లదోమ',
      severity: 'high',
      confidence: 93,
      treatments: [
        'Spray Diafenthiuron 50% WP @ 1g/L or Dinotefuran 20% SG @ 0.4g/L.',
        'Spray 5% Neem oil to deter egg-laying.'
      ],
      prevention: [
        'Install yellow sticky traps @ 20 per acre.',
        'Erect 2 rows of barrier maize around the tomato plot.'
      ]
    },
    bollworm: {
      name: 'Tomato Fruit Borer (Helicoverpa armigera)',
      nameTe: 'టమాట కాయ తొలిచే పురుగు',
      severity: 'high',
      confidence: 94,
      treatments: [
        'Spray Indoxacarb 14.5% SC @ 1ml/L or Flubendiamide 39.35% SC @ 0.3ml/L.'
      ],
      prevention: [
        'Plant African Marigold as a trap crop (1 row for every 16 tomato rows).'
      ]
    },
    default: {
      name: 'Tomato Bacterial Wilt',
      nameTe: 'టమాట బాక్టీరియా ఎండు తెగులు',
      severity: 'high',
      confidence: 88,
      treatments: [
        'Drench soil with Streptocycline 1g per 10 liters water + Copper Oxychloride 30g.'
      ],
      prevention: [
        'Plant on raised beds with mulch; avoid flood irrigation.'
      ]
    }
  },
  Groundnut: {
    rust: {
      name: 'Groundnut Rust & Tikka Leaf Spot',
      nameTe: 'వేరుశనగ తిక్క ఆకు మచ్చ మరియు తుప్పు తెగులు',
      severity: 'high',
      confidence: 96,
      treatments: [
        'Spray Hexaconazole 5% EC @ 2ml/L or Tebuconazole @ 1ml/L.',
        'Repeat spray after 15 days if monsoon moisture persists.'
      ],
      prevention: [
        'Seed treatment with Trichoderma viride 4g/kg seed.',
        'Avoid continuous groundnut mono-cropping.'
      ]
    },
    aphids: {
      name: 'Groundnut Aphids (Aphis craccivora)',
      nameTe: 'వేరుశనగ పేనుబంక',
      severity: 'medium',
      confidence: 91,
      treatments: [
        'Spray Dimethoate 30% EC @ 2ml/L or Imidacloprid 17.8% SL @ 0.3ml/L.'
      ],
      prevention: [
        'Conserve natural coccinellid predator ladybird beetles.'
      ]
    },
    default: {
      name: 'Groundnut Collar Rot (Aspergillus niger)',
      nameTe: 'వేరుశనగ మొదలు కుళ్లు తెగులు',
      severity: 'high',
      confidence: 90,
      treatments: [
        'Drench with Carbendazim 12% + Mancozeb 63% WP (Saaf) @ 2g/L.'
      ],
      prevention: [
        'Ensure good drainage and sow certified fungicide-treated seeds.'
      ]
    }
  }
};

function previewPestImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const previewDiv = document.getElementById('pestImagePreview');
    const previewImg = document.getElementById('pestPreviewImg');
    if (previewImg && previewDiv) {
      previewImg.src = e.target.result;
      previewDiv.style.display = 'block';
    }
  };
  reader.readAsDataURL(file);
}

function diagnosePest() {
  const crop = document.getElementById('pestCropSelect')?.value || 'Cotton';
  const symptom = document.getElementById('pestSymptomSelect')?.value || 'bollworm';

  const cropPests = PEST_DATABASE[crop] || PEST_DATABASE['Cotton'];
  const diagnosis = cropPests[symptom] || cropPests['default'] || PEST_DATABASE['Cotton']['bollworm'];

  const nameEl = document.getElementById('pestDiagnosisName');
  const teEl = document.getElementById('pestDiagnosisTe');
  const confEl = document.getElementById('pestConfidence');
  const badgeEl = document.getElementById('pestSeverityBadge');

  if (nameEl) nameEl.textContent = diagnosis.name;
  if (teEl) teEl.textContent = diagnosis.nameTe;
  if (confEl) confEl.textContent = `AI Confidence: ${diagnosis.confidence}%`;
  if (badgeEl) {
    badgeEl.className = diagnosis.severity === 'high' ? 'risk-badge badge-danger' : 'risk-badge badge-warning';
    badgeEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${diagnosis.severity === 'high' ? 'High Severity' : 'Moderate Severity'}`;
  }

  const treatList = document.getElementById('pestTreatmentList');
  if (treatList) {
    treatList.innerHTML = diagnosis.treatments.map(t => `
      <div class="advisory-card high-priority">
        <div class="advisory-desc"><i class="fa-solid fa-check" style="color:#16a34a;margin-right:6px;"></i>${t}</div>
      </div>
    `).join('');
  }

  const prevList = document.getElementById('pestPreventionList');
  if (prevList) {
    prevList.innerHTML = diagnosis.prevention.map(p => `
      <div class="advisory-card">
        <div class="advisory-desc"><i class="fa-solid fa-shield-halved" style="color:#2d6a4f;margin-right:6px;"></i>${p}</div>
      </div>
    `).join('');
  }

  const resultBox = document.getElementById('pestResult');
  if (resultBox) {
    resultBox.style.display = 'block';
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ──────────────────────────────────────────────
// 5.2 TALK WITH AI (Conversational Agronomist)
// ──────────────────────────────────────────────

const AI_KNOWLEDGE_BASE = [
  {
    triggers: ['rice', 'yield', 'increase', 'production', 'వరి', 'దిగుబడి'],
    replyEn: 'To maximize Rice yield: 1) Maintain 2-3 cm shallow water during tillering. 2) Split Urea into 3 doses: basal, active tillering, and panicle initiation. 3) Spray Zinc Sulphate (0.5%) if leaves show bronzing.',
    replyTe: 'వరి దిగుబడి పెంచడానికి: 1) పిలకలు తొడిగే దశలో 2-3 సెం.మీ నీరు ఉంచండి. 2) యూరియాను 3 భాగాలుగా వేయండి. 3) జింక్ లోపం కనిపిస్తే 0.5% జింక్ సల్ఫేట్ పిచికారీ చేయండి.'
  },
  {
    triggers: ['cotton', 'fertilizer', 'పత్తి', 'ఎరువులు'],
    replyEn: 'For Cotton: Apply 120kg N, 60kg P2O5, 60kg K2O per hectare. Give 1/3rd Nitrogen at sowing, 1/3rd at squaring (45 days), and 1/3rd at flowering (70 days) for heavy boll formation.',
    replyTe: 'పత్తికి సిఫారసు: హెక్టారుకు 120 కిలోల నత్రజని, 60 కిలోల భాస్వరం, 60 కిలోల పొటాష్. నత్రజనిని విత్తేటప్పుడు, 45వ రోజు మరియు 70వ రోజు మూడు సమాన భాగాలుగా వేయండి.'
  },
  {
    triggers: ['acidic', 'ph', 'lime', 'ఆమ్ల', 'నేల'],
    replyEn: 'For Acidic Soil (pH < 6.0): Broadcast Agricultural Limestone (CaCO3) @ 2 to 3 tonnes per acre 3 weeks before planting. Also add farmyard manure (FYM) to improve microbial buffer capacity.',
    replyTe: 'ఆమ్ల నేలలకు (pH < 6.0): నాటడానికి 3 వారాల ముందు ఎకరాకు 2-3 టన్నుల వ్యవసాయ సున్నం వేయండి. పశువుల ఎరువు కూడా కలిపితే నేల త్వరగా సారవంతమవుతుంది.'
  },
  {
    triggers: ['water', 'drought', 'low water', 'rainfed', 'వర్షం', 'నీరు'],
    replyEn: 'Best low-water crops: 1) Groundnut (Kharif/Rabi), 2) Chickpea / Bengal Gram, 3) Pearl Millet (Bajra), 4) Mustard. Use Drip Irrigation to save 40-50% water while boosting yield by 20%.',
    replyTe: 'తక్కువ నీటితో పండే పంటలు: 1) వేరుశనగ, 2) శనగలు, 3) సజ్జలు, 4) ఆవాలు. డ్రిప్ ఇరిగేషన్ వాడితే 40-50% నీరు ఆదా అవుతుంది.'
  },
  {
    triggers: ['pest', 'insects', 'spray', 'పురుగు', 'తెగులు', 'మందు'],
    replyEn: 'For general sucking pests (aphids/thrips): Spray Neem Oil 10,000 ppm @ 3ml/L or Acetamiprid @ 0.2g/L. Spray during calm early mornings to protect friendly pollinator bees.',
    replyTe: 'రసం పీల్చే పురుగులకు: వేపనూనె 10,000 ppm @ 3ml/L లేదా అసిటామిప్రిడ్ 0.2g/L ఉదయం వేళ పిచికారీ చేయండి.'
  }
];

function sendQuickAiQuery(text) {
  const input = document.getElementById('aiChatInput');
  if (input) {
    input.value = text;
    sendAiMessage();
  }
}

function sendAiMessage() {
  const input = document.getElementById('aiChatInput');
  const stream = document.getElementById('aiChatStream');
  if (!input || !stream) return;
  const query = input.value.trim();
  if (!query) return;

  // Render User Message Bubble
  const userMsg = document.createElement('div');
  userMsg.style.cssText = 'align-self:flex-end; max-width:82%; background:#1b4332; color:#fff; border-radius:14px; padding:0.65rem 0.9rem; font-size:0.88rem; box-shadow:var(--shadow-sm);';
  userMsg.innerHTML = `<div style="font-size:0.72rem; color:#b7e4c7; margin-bottom:2px;"><i class="fa-solid fa-user"></i> You</div><div>${escapeHtml(query)}</div>`;
  stream.appendChild(userMsg);
  input.value = '';
  stream.scrollTop = stream.scrollHeight;

  // Match Query in Knowledge Base
  const lower = query.toLowerCase();
  let found = AI_KNOWLEDGE_BASE.find(item => item.triggers.some(t => lower.includes(t)));

  const botReplyEn = found ? found.replyEn : `CropAI Advice: For "${query}", ensure balanced NPK fertilization, maintain good drainage, and consult your local Krishi Vigyan Kendra (KVK) or Agriculture Officer.`;
  const botReplyTe = found ? found.replyTe : `మీ ప్రశ్నకు ("${query}") తగిన పంట రక్షణ మరియు ఎరువుల మోతాదు కోసం సమీప రైతు భరోసా కేంద్రం లేదా వ్యవసాయ శాఖ నిపుణులను సంప్రదించండి.`;

  // Typing response with slight delay
  setTimeout(() => {
    const botMsg = document.createElement('div');
    botMsg.style.cssText = 'align-self:flex-start; max-width:85%; background:#ffffff; border:1.5px solid var(--border-subtle); border-radius:14px; padding:0.75rem 0.9rem; font-size:0.88rem; box-shadow:var(--shadow-sm);';
    botMsg.innerHTML = `
      <div style="font-weight:700; color:var(--primary); font-size:0.75rem; margin-bottom:3px;"><i class="fa-solid fa-robot"></i> CropAI Assistant</div>
      <div>${botReplyEn}</div>
      ${currentLang === 'te' || currentLang === 'hi' ? `<div class="te-sub" style="font-size:0.8rem; color:var(--primary-med); margin-top:5px;">${botReplyTe}</div>` : ''}
    `;
    stream.appendChild(botMsg);
    stream.scrollTop = stream.scrollHeight;
  }, 400);
}

function clearAiChat() {
  const stream = document.getElementById('aiChatStream');
  if (stream) {
    stream.innerHTML = `
      <div style="align-self:flex-start; max-width:85%; background:#ffffff; border:1.5px solid var(--border-subtle); border-radius:14px; padding:0.75rem 0.9rem; font-size:0.88rem; box-shadow:var(--shadow-sm);">
        <div style="font-weight:700; color:var(--primary); font-size:0.75rem; margin-bottom:3px;"><i class="fa-solid fa-robot"></i> CropAI Assistant</div>
        <div>Chat history refreshed. Ask any farming question!</div>
        <div class="te-sub" style="font-size:0.78rem; color:var(--primary-med); margin-top:4px;">చాట్ ప్రారంభించబడింది. మీ ప్రశ్నను అడగండి!</div>
      </div>
    `;
  }
}

function toggleVoiceSpeechInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Voice speech recognition is not supported in this browser. Please type your query.');
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = currentLang === 'te' ? 'te-IN' : (currentLang === 'hi' ? 'hi-IN' : 'en-IN');
  const btn = document.getElementById('btnMicSpeechInput');
  if (btn) btn.classList.add('speaking');

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    const input = document.getElementById('aiChatInput');
    if (input) {
      input.value = transcript;
      sendAiMessage();
    }
  };
  recognition.onerror = function() {
    if (btn) btn.classList.remove('speaking');
  };
  recognition.onend = function() {
    if (btn) btn.classList.remove('speaking');
  };
  recognition.start();
}

// ──────────────────────────────────────────────
// 5.3 FARMER PROFILE MANAGEMENT
// ──────────────────────────────────────────────

function loadFarmerProfile() {
  const saved = localStorage.getItem('cropai_farmer_profile');
  if (saved) {
    try {
      const p = JSON.parse(saved);
      if (document.getElementById('profNameInput')) document.getElementById('profNameInput').value = p.name || '';
      if (document.getElementById('profPhoneInput')) document.getElementById('profPhoneInput').value = p.phone || '';
      if (document.getElementById('profDistrictSelect')) document.getElementById('profDistrictSelect').value = p.district || 'guntur';
      if (document.getElementById('profLandSizeInput')) document.getElementById('profLandSizeInput').value = p.landSize || '2.5';
      if (document.getElementById('profPrimaryCrop')) document.getElementById('profPrimaryCrop').value = p.crop || 'Rice';
      if (document.getElementById('profileFarmerName')) document.getElementById('profileFarmerName').textContent = p.name || 'Farmer User';
      if (document.getElementById('profileFarmerPhone')) document.getElementById('profileFarmerPhone').textContent = `+91 ${p.phone || '9876543210'} · ${p.district || 'Andhra Pradesh'}`;
    } catch(e) {}
  }
}

function saveFarmerProfile() {
  const name = document.getElementById('profNameInput')?.value.trim() || 'Ramesh Kumar';
  const phone = document.getElementById('profPhoneInput')?.value.trim() || '9876543210';
  const district = document.getElementById('profDistrictSelect')?.value || 'guntur';
  const landSize = document.getElementById('profLandSizeInput')?.value || '2.5';
  const crop = document.getElementById('profPrimaryCrop')?.value || 'Rice';

  const profile = { name, phone, district, landSize, crop };
  localStorage.setItem('cropai_farmer_profile', JSON.stringify(profile));

  if (document.getElementById('profileFarmerName')) document.getElementById('profileFarmerName').textContent = name;
  if (document.getElementById('profileFarmerPhone')) document.getElementById('profileFarmerPhone').textContent = `+91 ${phone} · ${district}`;

  // Sync farm size input in predict and soil screens
  const farmSizeInput = document.getElementById('farmSizeInput');
  if (farmSizeInput) farmSizeInput.value = landSize;
  const soilFarmAcres = document.getElementById('soilFarmAcres');
  if (soilFarmAcres) soilFarmAcres.value = landSize;

  const toastMsg = (currentLang === 'te') ? 'రైతు ప్రొఫైల్ సేవ్ చేయబడింది!' : (currentLang === 'hi' ? 'किसान प्रोफाइल सुरक्षित हो गया!' : 'Farmer profile saved successfully!');
  showToast(toastMsg, 'fa-floppy-disk');
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}


let speechUtterance = null;
let debounceTimer = null;
let currentFontSize = 16;

document.addEventListener('DOMContentLoaded', () => {
  // Apply saved language
  updateLabels();

  const form = document.getElementById('predictionForm');
  const presetButtons = document.querySelectorAll('[data-preset]');
  const resultContainer = document.getElementById('resultContainer');
  const placeholderContainer = document.getElementById('placeholderContainer');
  const voiceBtn = document.getElementById('voiceAdvisoryBtn');
  const langSelect = document.getElementById('voiceLangSelect');
  const cropCards = document.querySelectorAll('.crop-card-choice');
  const cropSelect = document.getElementById('cropSelect');

  // Live Weather Elements (Predict screen)
  const btnDetectGps   = document.getElementById('btnDetectGpsWeather');
  const districtSelect = document.getElementById('weatherDistrictSelect');
  const liveTempDisplay     = document.getElementById('liveTempDisplay');
  const liveHumidityDisplay = document.getElementById('liveHumidityDisplay');
  const liveRainDisplay     = document.getElementById('liveRainDisplay');
  const weatherSourceText   = document.getElementById('weatherSourceText');

  // 1. GPS Detection
  if (btnDetectGps) {
    btnDetectGps.addEventListener('click', () => {
      if ('geolocation' in navigator) {
        btnDetectGps.disabled = true;
        btnDetectGps.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> GPS...';
        navigator.geolocation.getCurrentPosition(
          (position) => fetchLiveWeather(`/api/live-weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}`),
          () => fetchLiveWeather('/api/live-weather?lat=21.1458&lon=79.0882')
        );
      } else {
        alert('Geolocation not supported. Please select a district.');
      }
    });
  }

  // 2. District Dropdown
  if (districtSelect) {
    districtSelect.addEventListener('change', () => {
      if (districtSelect.value) fetchLiveWeather(`/api/live-weather?district=${districtSelect.value}`);
    });
  }

  function fetchLiveWeather(url) {
    if (btnDetectGps) {
      btnDetectGps.disabled = true;
      btnDetectGps.innerHTML = '<i class="fa-solid fa-satellite-dish fa-spin"></i> Fetching...';
    }
    fetch(url)
      .then(res => res.json())
      .then(wData => {
        if (wData.success) {
          if (liveTempDisplay)     liveTempDisplay.innerText     = wData.temperature + ' °C';
          if (liveHumidityDisplay) liveHumidityDisplay.innerText = wData.humidity + ' %';
          if (liveRainDisplay)     liveRainDisplay.innerText     = wData.estimated_seasonal_rainfall_mm + ' mm';

          if (weatherSourceText) {
            weatherSourceText.innerHTML = `<i class="fa-solid fa-satellite-dish" style="color:#0284c7;"></i> <strong>Live:</strong> ${wData.location_name} (${wData.temperature}°C, ${wData.estimated_seasonal_rainfall_mm}mm)`;
          }

          // 7-day radar
          const radarGrid = document.getElementById('radarDaysGrid');
          const alertBox  = document.getElementById('weatherAlertBox');
          const alertText = document.getElementById('weatherAlertText');
          const radarLoc  = document.getElementById('radarLocationLabel');
          if (radarLoc) radarLoc.innerText = wData.location_name;

          if (radarGrid && wData.forecast_7day) {
            radarGrid.innerHTML = '';
            wData.forecast_7day.forEach(day => {
              const card = document.createElement('div');
              card.className = 'radar-day-card';
              card.innerHTML = `
                <div class="radar-day-name">${day.day}</div>
                <div class="radar-day-temp">${day.temp_max}°</div>
                <div class="radar-day-rain"><i class="fa-solid fa-droplet"></i> ${day.rain_mm}m</div>
              `;
              radarGrid.appendChild(card);
            });
          }

          if (alertBox && alertText) {
            if (wData.weather_alert) { alertBox.style.display = 'flex'; alertText.innerText = wData.weather_alert; }
            else { alertBox.style.display = 'none'; }
          }

          // Sync into hidden form inputs
          const tempInput     = document.getElementById('tempInput');
          const humidityInput = document.getElementById('humidityInput');
          const rainInput     = document.getElementById('rainfallInput');
          const rainRange     = document.getElementById('rainfallRange');
          if (tempInput)     tempInput.value     = wData.temperature;
          if (humidityInput) humidityInput.value = wData.humidity;
          if (rainInput)     rainInput.value     = wData.estimated_seasonal_rainfall_mm;
          if (rainRange)     rainRange.value     = wData.estimated_seasonal_rainfall_mm;
          updateDynamicBadge('rainfall', wData.estimated_seasonal_rainfall_mm);
          triggerLivePrediction();
        }
      })
      .catch(err => console.error('Weather fetch error:', err))
      .finally(() => {
        if (btnDetectGps) {
          btnDetectGps.disabled = false;
          btnDetectGps.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> GPS';
        }
      });
  }

  // 3. Crop Card Selection
  cropCards.forEach(card => {
    card.addEventListener('click', () => {
      cropCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      if (cropSelect) cropSelect.value = card.getAttribute('data-crop');
      updateNutrientHints();
      triggerLivePrediction();
    });
  });

  // 4. Soil Condition Preset Cards
  const soilCards = document.querySelectorAll('.soil-condition-card');
  soilCards.forEach(sc => {
    sc.addEventListener('click', () => {
      soilCards.forEach(c => c.classList.remove('active'));
      sc.classList.add('active');
      const preset = sc.getAttribute('data-soil-preset');
      if (preset === 'fertile') {
        setSliderAndNum('nitrogen', 115); setSliderAndNum('phosphorus', 55);
        setSliderAndNum('potassium', 48); setSliderAndNum('ph', 6.5);
      } else if (preset === 'moderate') {
        setSliderAndNum('nitrogen', 65); setSliderAndNum('phosphorus', 32);
        setSliderAndNum('potassium', 35); setSliderAndNum('ph', 6.3);
      } else if (preset === 'poor') {
        setSliderAndNum('nitrogen', 35); setSliderAndNum('phosphorus', 18);
        setSliderAndNum('potassium', 20); setSliderAndNum('ph', 5.2);
      }
      updateNutrientHints();
      triggerLivePrediction();
    });
  });

  // 5. Expert Drawer Toggle
  const drawerToggle  = document.getElementById('expertDrawerToggle');
  const drawerContent = document.getElementById('expertDrawerContent');
  const drawerIcon    = document.getElementById('drawerToggleIcon');
  if (drawerToggle && drawerContent) {
    drawerToggle.addEventListener('click', () => {
      const isOpen = drawerContent.classList.toggle('open');
      if (drawerIcon) {
        drawerIcon.innerHTML = isOpen
          ? '<i class="fa-solid fa-chevron-up"></i>'
          : '<i class="fa-solid fa-chevron-down"></i>';
      }
    });
  }

  // 6. Slider two-way binding
  const sliderMappings = [
    { range: 'nitrogenRange',   num: 'nitrogenInput',   key: 'nitrogen'   },
    { range: 'phosphorusRange', num: 'phosphorusInput', key: 'phosphorus' },
    { range: 'potassiumRange',  num: 'potassiumInput',  key: 'potassium'  },
    { range: 'phRange',         num: 'phInput',         key: 'ph'         },
    { range: 'rainfallRange',   num: 'rainfallInput',   key: 'rainfall'   }
  ];

  sliderMappings.forEach(mapping => {
    const rangeEl = document.getElementById(mapping.range);
    const numEl   = document.getElementById(mapping.num);
    if (rangeEl && numEl) {
      rangeEl.addEventListener('input', () => { numEl.value = rangeEl.value; updateDynamicBadge(mapping.key, parseFloat(rangeEl.value)); triggerLivePrediction(); });
      numEl.addEventListener('input',   () => { rangeEl.value = numEl.value; updateDynamicBadge(mapping.key, parseFloat(numEl.value));  triggerLivePrediction(); });
    }
  });

  const farmSizeInput = document.getElementById('farmSizeInput');
  if (farmSizeInput) farmSizeInput.addEventListener('input', () => triggerLivePrediction());

  const irrSelect = document.getElementById('irrigationSelect');
  if (irrSelect) irrSelect.addEventListener('change', () => triggerLivePrediction());

  // 7. Quick Scenario Presets
  presetButtons.forEach(btn => {
    if (!btn.hasAttribute('data-preset')) return;
    btn.addEventListener('click', () => {
      const presetKey = btn.getAttribute('data-preset');
      fetch('/api/presets')
        .then(res => res.json())
        .then(presets => { const data = presets[presetKey]; if (data) populateFormFields(data); })
        .catch(err => console.error('Preset error:', err));
    });
  });

  function populateFormFields(data) {
    if (data.Crop) {
      if (cropSelect) cropSelect.value = data.Crop;
      cropCards.forEach(c => {
        if (c.getAttribute('data-crop') === data.Crop) c.classList.add('selected');
        else c.classList.remove('selected');
      });
    }
    if (data.Irrigation && irrSelect) irrSelect.value = data.Irrigation;
    setSliderAndNum('nitrogen',   data.Nitrogen);
    setSliderAndNum('phosphorus', data.Phosphorus);
    setSliderAndNum('potassium',  data.Potassium);
    setSliderAndNum('ph',         data.pH);
    setSliderAndNum('rainfall',   data.Rainfall);
    if (liveRainDisplay)     liveRainDisplay.innerText     = data.Rainfall + ' mm';
    if (liveTempDisplay && data.Temperature)     liveTempDisplay.innerText     = data.Temperature + ' °C';
    if (liveHumidityDisplay && data.Humidity)    liveHumidityDisplay.innerText = data.Humidity + ' %';
    updateNutrientHints();
    submitPredictionForm(false);
  }

  function setSliderAndNum(prefix, val) {
    const range = document.getElementById(prefix + 'Range');
    const num   = document.getElementById(prefix + 'Input');
    if (range) range.value = val;
    if (num)   num.value   = val;
    updateDynamicBadge(prefix, val);
  }

  // 8. Form Submit
  if (form) {
    form.addEventListener('submit', (e) => { e.preventDefault(); submitPredictionForm(false); });
  }

  function triggerLivePrediction() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => submitPredictionForm(true), 100);
  }

  function submitPredictionForm(isLiveUpdate = false) {
    const cropVal = cropSelect ? cropSelect.value : 'Rice';
    const payload = {
      Crop:        cropVal,
      Irrigation:  irrSelect ? irrSelect.value : 'Drip',
      Algorithm:   'Random Forest',
      Nitrogen:    parseFloat(document.getElementById('nitrogenInput')?.value  || 110),
      Phosphorus:  parseFloat(document.getElementById('phosphorusInput')?.value || 50),
      Potassium:   parseFloat(document.getElementById('potassiumInput')?.value  || 45),
      pH:          parseFloat(document.getElementById('phInput')?.value         || 6.5),
      Temperature: parseFloat(document.getElementById('tempInput')?.value       || 27.5),
      Humidity:    parseFloat(document.getElementById('humidityInput')?.value   || 75.0),
      Rainfall:    parseFloat(document.getElementById('rainfallInput')?.value   || 1200),
      FarmSize:    parseFloat(farmSizeInput?.value || 2.5)
    };

    if (placeholderContainer && !isLiveUpdate) {
      placeholderContainer.style.display = 'flex';
      if (resultContainer) resultContainer.style.display = 'none';
    }

    fetch('/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => { if (data.success) renderResults(data); })
      .catch(err => console.error('Prediction error:', err));
  }

  // 9. Dynamic Badges
  function updateDynamicBadge(key, val) {
    const badge = document.getElementById(key + 'Badge');
    if (!badge) return;
    if (key === 'nitrogen') {
      if (val < 65) { badge.className = 'slider-info-badge badge-soil-low';  badge.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Low (Yellow Leaves)'; }
      else if (val > 150) { badge.className = 'slider-info-badge badge-soil-high'; badge.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> High Nitrogen'; }
      else { badge.className = 'slider-info-badge badge-soil-opt'; badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Optimal'; }
    } else if (key === 'phosphorus') {
      if (val < 35) { badge.className = 'slider-info-badge badge-soil-low';  badge.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Low Roots'; }
      else if (val > 90) { badge.className = 'slider-info-badge badge-soil-high'; badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Rich Phosphorus'; }
      else { badge.className = 'slider-info-badge badge-soil-opt'; badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Healthy Roots'; }
    } else if (key === 'potassium') {
      if (val < 30) { badge.className = 'slider-info-badge badge-soil-low';  badge.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Low Immunity'; }
      else { badge.className = 'slider-info-badge badge-soil-opt'; badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Disease Resistant'; }
    } else if (key === 'ph') {
      if (val < 5.8) { badge.className = 'slider-info-badge badge-soil-low';  badge.innerHTML = '<i class="fa-solid fa-vial"></i> Sour Acidic'; }
      else if (val > 7.8) { badge.className = 'slider-info-badge badge-soil-high'; badge.innerHTML = '<i class="fa-solid fa-vial"></i> Alkaline'; }
      else { badge.className = 'slider-info-badge badge-soil-opt'; badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Sweet & Fertile'; }
    } else if (key === 'rainfall') {
      if (val < 500) { badge.className = 'slider-info-badge badge-soil-low';  badge.innerHTML = '<i class="fa-solid fa-sun"></i> Drought Risk'; }
      else if (val > 1800) { badge.className = 'slider-info-badge badge-soil-high'; badge.innerHTML = '<i class="fa-solid fa-cloud-showers-heavy"></i> Heavy Rain'; }
      else { badge.className = 'slider-info-badge badge-soil-opt'; badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Good Moisture'; }
    }
  }

  function updateNutrientHints() {
    const sliderKeys = ['nitrogen','phosphorus','potassium','ph','rainfall'];
    sliderKeys.forEach(key => {
      const numEl = document.getElementById(key + 'Input');
      if (numEl) updateDynamicBadge(key, parseFloat(numEl.value));
    });
  }

  // 10. Render Results
  function renderResults(data) {
    if (placeholderContainer) placeholderContainer.style.display = 'none';
    if (resultContainer) resultContainer.style.display = 'block';

    const econ = data.economic_analysis;

    // Yield
    const yieldEl = document.getElementById('predictedYieldVal');
    if (yieldEl) yieldEl.innerText = data.predicted_yield.toFixed(2);

    const benchEl = document.getElementById('benchmarkYieldVal');
    if (benchEl) benchEl.innerText = data.mean_benchmark_yield.toFixed(2) + ' t/ha';

    // Risk Badge
    const riskBadge = document.getElementById('riskBadge');
    if (riskBadge) {
      if (data.risk_badge === 'success') {
        riskBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Healthy (High Yield)';
        riskBadge.className = 'risk-badge badge-success';
      } else if (data.risk_badge === 'danger') {
        riskBadge.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Low Yield Risk';
        riskBadge.className = 'risk-badge badge-danger';
      } else {
        riskBadge.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Moderate Yield';
        riskBadge.className = 'risk-badge badge-warning';
      }
    }

    // KPIs
    const soilScoreEl = document.getElementById('soilHealthScoreVal');
    if (soilScoreEl) soilScoreEl.innerText = Math.round(data.soil_health_score) + '/100';

    const revEl = document.getElementById('currentRevenueVal');
    if (revEl) revEl.innerText = '₹' + econ.current_revenue_inr.toLocaleString('en-IN');

    // Impact Simulator
    const curYieldCol  = document.getElementById('currentYieldColVal');
    const curRevCol    = document.getElementById('currentRevColVal');
    const potYieldCol  = document.getElementById('potentialYieldColVal');
    const potRevCol    = document.getElementById('potentialRevColVal');
    const gainBadge    = document.getElementById('impactGainBadge');

    if (curYieldCol)  curYieldCol.innerText = data.predicted_yield.toFixed(2) + ' t/ha';
    if (curRevCol)    curRevCol.innerText   = 'Revenue: ₹' + econ.current_revenue_inr.toLocaleString('en-IN');
    if (potYieldCol)  potYieldCol.innerText = econ.potential_yield_with_ai.toFixed(2) + ' t/ha';
    if (potRevCol)    potRevCol.innerText   = 'Target: ₹' + econ.potential_revenue_inr.toLocaleString('en-IN');

    if (gainBadge) {
      if (econ.estimated_income_boost_inr > 0) {
        gainBadge.innerText = `+₹${econ.estimated_income_boost_inr.toLocaleString('en-IN')} Extra Profit`;
        gainBadge.style.background = '#16a34a';
      } else {
        gainBadge.innerText = 'Peak Profit Reached';
        gainBadge.style.background = '#0284c7';
      }
    }

    // Sync into Farm Reports Screen
    const repCrop = document.getElementById('reportCropSummary');
    const repFarm = document.getElementById('reportFarmDetails');
    const repYield = document.getElementById('reportYieldVal');
    const repRev = document.getElementById('reportRevenueVal');
    const repSoil = document.getElementById('reportSoilVal');
    const repRisk = document.getElementById('reportRiskVal');

    if (repCrop) repCrop.textContent = `${data.input_parameters.Crop} — Season Audit`;
    if (repFarm) repFarm.textContent = `Plot: ${econ.farm_size_acres} Acres · ${data.input_parameters.Irrigation} · Model: ${data.model_used || 'Random Forest'}`;
    if (repYield) repYield.textContent = `${data.predicted_yield.toFixed(2)} T/Ha`;
    if (repRev) repRev.innerHTML = `₹${econ.current_revenue_inr.toLocaleString('en-IN')}`;
    if (repSoil) repSoil.textContent = `${Math.round(data.soil_health_score)}/100`;
    if (repRisk) {
      repRisk.textContent = data.yield_category || 'Optimal Yield';
      repRisk.style.color = data.risk_badge === 'success' ? '#15803d' : (data.risk_badge === 'danger' ? '#dc2626' : '#d97706');
    }

    // Dynamic first row in farmReportTableBody
    const tbody = document.getElementById('farmReportTableBody');
    if (tbody && tbody.firstElementChild) {
      const todayRow = tbody.firstElementChild;
      const statusBadge = data.risk_badge === 'success'
        ? '<span class="risk-badge badge-success" style="font-size:0.65rem;">Optimal Soil</span>'
        : (data.risk_badge === 'danger'
          ? '<span class="risk-badge badge-danger" style="font-size:0.65rem;">Needs Intervention</span>'
          : '<span class="risk-badge badge-warning" style="font-size:0.65rem;">Balanced Care</span>');
      todayRow.innerHTML = `
        <td style="padding:0.6rem;">Today</td>
        <td style="padding:0.6rem; font-weight:700;">${data.input_parameters.Crop}</td>
        <td style="padding:0.6rem; color:#16a34a; font-weight:700;">${data.predicted_yield.toFixed(2)} T/Ha</td>
        <td style="padding:0.6rem;">₹${econ.current_revenue_inr.toLocaleString('en-IN')}</td>
        <td style="padding:0.6rem;">${statusBadge}</td>
      `;
    }

    // Alternative Crops
    const altGrid = document.getElementById('altCropsGrid');
    if (altGrid && data.top_alternative_crops) {
      altGrid.innerHTML = '';
      data.top_alternative_crops.forEach(alt => {
        const card = document.createElement('div');
        card.className = 'alt-crop-card';
        card.innerHTML = `
          <div class="alt-crop-top"><span><i class="fa-solid fa-wheat-awn" style="color:#2d6a4f;margin-right:4px;"></i>${alt.crop}</span><span style="font-size:0.72rem;color:#64748b;">${alt.predicted_yield} t/ha</span></div>
          <div class="alt-crop-rev">₹${alt.estimated_revenue_inr.toLocaleString('en-IN')}</div>
          <div class="alt-crop-diff" style="color:${alt.revenue_diff_inr >= 0 ? '#16a34a' : '#dc2626'};">
            ${alt.revenue_diff_inr >= 0 ? '+' : ''}₹${alt.revenue_diff_inr.toLocaleString('en-IN')} (${alt.percent_diff}%)
          </div>
        `;
        card.addEventListener('click', () => {
          cropCards.forEach(c => {
            if (c.getAttribute('data-crop') === alt.crop) c.classList.add('selected');
            else c.classList.remove('selected');
          });
          if (cropSelect) cropSelect.value = alt.crop;
          updateNutrientHints();
          triggerLivePrediction();
        });
        altGrid.appendChild(card);
      });
    }

    // 3 Key Takeaways
    window.lastPredictionData = data;
    renderKeyTakeaways(data);

    // Fertilizer
    const fertContainer = document.getElementById('fertilizerAdvisoryList');
    if (fertContainer) {
      fertContainer.innerHTML = '';
      data.fertilizer_recommendations.forEach(item => {
        const card = document.createElement('div');
        const pc = item.severity === 'high' ? 'high-priority' : (item.severity === 'medium' ? 'medium-priority' : '');
        card.className = `advisory-card ${pc}`;
        card.innerHTML = `<div class="advisory-title"><span><i class="fa-solid fa-leaf" style="color:#2d6a4f;margin-right:5px;"></i>${item.nutrient}</span><span style="font-size:0.78rem;font-weight:800;">[${item.status}]</span></div><div class="advisory-desc">${item.advice}</div>`;
        fertContainer.appendChild(card);
      });
    }

    // Soil pH
    const soilContainer = document.getElementById('soilAdvisoryList');
    if (soilContainer) {
      soilContainer.innerHTML = '';
      data.soil_recommendations.forEach(item => {
        const card = document.createElement('div');
        card.className = 'advisory-card';
        card.innerHTML = `<div class="advisory-title"><span><i class="fa-solid fa-vial" style="color:#0284c7;margin-right:5px;"></i>${item.parameter}</span><span>[${item.status}]</span></div><div class="advisory-desc">${item.advice}</div>`;
        soilContainer.appendChild(card);
      });
    }

    // Irrigation
    const irrContainer = document.getElementById('irrigationAdvisoryList');
    if (irrContainer) {
      irrContainer.innerHTML = '';
      data.irrigation_recommendations.forEach(item => {
        const card = document.createElement('div');
        const pc = item.urgency === 'Critical' ? 'high-priority' : '';
        card.className = `advisory-card ${pc}`;
        card.innerHTML = `<div class="advisory-title"><span><i class="fa-solid fa-droplet" style="color:#0284c7;margin-right:5px;"></i>${item.parameter}</span><span>[${item.urgency}]</span></div><div class="advisory-desc">${item.advice}</div>`;
        irrContainer.appendChild(card);
      });
    }

    // Management Tips
    const tipsContainer = document.getElementById('managementTipsList');
    if (tipsContainer) {
      tipsContainer.innerHTML = '';
      data.management_tips.forEach(tip => {
        const li = document.createElement('li');
        li.style.cssText = 'margin-bottom:8px;font-size:0.88rem;color:#374151;display:flex;align-items:flex-start;gap:8px;';
        li.innerHTML = `<i class="fa-solid fa-shield-halved" style="color:#40916c;margin-top:3px;"></i><div>${tip}</div>`;
        tipsContainer.appendChild(li);
      });
    }

    // Build speech strings
    const prefix = currentLang === 'te' ? 'te' : (currentLang === 'hi' ? 'hi' : 'en');
    const crop = data.input_parameters.Crop;
    const yld  = data.predicted_yield;
    const rev  = econ.current_revenue_inr;
    const urea = econ.fertilizer_costs.urea_bags;
    const dap  = econ.fertilizer_costs.dap_bags;
    const needsFert = urea > 0 || dap > 0;

    window.lastEnglishSpeech = needsFert
      ? `Your ${crop} harvest is predicted at ${yld} tonnes per hectare, worth rupees ${rev}. Purchase ${urea} bags of Urea and ${dap} bags of DAP to fix soil deficiency.`
      : `Great news! Your ${crop} field is healthy. Predicted harvest is ${yld} tonnes per hectare, worth rupees ${rev}. No extra fertilizer needed.`;

    window.lastHindiSpeech = needsFert
      ? `आपकी ${crop} फसल का अनुमानित उत्पादन ${yld} टन प्रति हेक्टेयर है, जिसकी कीमत लगभग ₹${rev} है। ${urea} बोरी यूरिया और ${dap} बोरी डीएपी का उपयोग करें।`
      : `बधाई हो! आपकी ${crop} की मिट्टी बहुत उपजाऊ है। उत्पादन ${yld} टन प्रति हेक्टेयर है। कोई अतिरिक्त खाद की जरूरत नहीं।`;

    window.lastTeluguSpeech = needsFert
      ? `మీ ${crop} పంట అంచనా దిగుబడి హెక్టారుకు ${yld} టన్నులు, విలువ సుమారు ₹${rev}. ${urea} బస్తాల యూరియా మరియు ${dap} బస్తాల డిఏపి వాడండి.`
      : `శుభవార్త! మీ ${crop} నేల చాలా సారవంతమైనది. అంచనా దిగుబడి హెక్టారుకు ${yld} టన్నులు. అదనపు ఎరువులు అవసరం లేదు.`;

    window.lastTamilSpeech = needsFert
      ? `உங்கள் ${crop} பயிர் எதிர்பார்க்கப்படும் மகசூல் ஹெக்டேருக்கு ${yld} டன்கள், மதிப்பு ₹${rev}. ${urea} மூட்டை யூரியா மற்றும் ${dap} மூட்டை டிஏபி பயன்படுத்தவும்.`
      : `நற்செய்தி! உங்கள் ${crop} நிலம் மிகவும் வளமாக உள்ளது. மகசூல் ${yld} டன்கள். கூடுதல் உரம் தேவையில்லை.`;
  }

  function renderKeyTakeaways(data) {
    const container = document.getElementById('keyTakeawaysList');
    if (!container) return;
    container.innerHTML = '';
    const econ = data.economic_analysis;
    const isOptimal = (econ.fertilizer_costs.urea_bags === 0 && econ.fertilizer_costs.dap_bags === 0 && econ.fertilizer_costs.mop_bags === 0);
    const lang = currentLang || 'en';

    let fertText = '';
    let profitText = '';
    let harvestText = '';

    if (lang === 'te') {
      harvestText = `<strong>దిగుబడి:</strong> అంచనా <strong>${data.predicted_yield} టన్నులు/హెక్టార్</strong> (${data.yield_category}) ≈ <strong>₹${econ.current_revenue_inr.toLocaleString('en-IN')}</strong>`;
      if (isOptimal) {
        fertText = `<strong>ఎరువులు:</strong> <span style="color:#16a34a;font-weight:700;"><i class="fa-solid fa-circle-check"></i> నేలలో పోషకాలు సమతుల్యంగా ఉన్నాయి!</span> అదనపు ఎరువుల సంచులు అవసరం లేదు.`;
        profitText = `<strong>లాభం:</strong> మీ పొలం గరిష్ట సామర్థ్యంతో ఉంది — అంచనా రాబడి <strong>₹${econ.current_revenue_inr.toLocaleString('en-IN')}</strong>.`;
      } else {
        const parts = [];
        if (econ.fertilizer_costs.urea_bags > 0) parts.push(`<strong>${econ.fertilizer_costs.urea_bags} బస్తాల యూరియా</strong>`);
        if (econ.fertilizer_costs.dap_bags > 0) parts.push(`<strong>${econ.fertilizer_costs.dap_bags} బస్తాల DAP</strong>`);
        if (econ.fertilizer_costs.mop_bags > 0) parts.push(`<strong>${econ.fertilizer_costs.mop_bags} బస్తాల MOP</strong>`);
        fertText = `<strong>ఎరువుల కొనుగోలు:</strong> మీ ${econ.farm_size_acres} ఎకరాలకు ${parts.join(' + ')} (50 కిలోల బస్తాలు) అవసరం.`;
        profitText = `<strong>అదనపు ఆదాయం:</strong> AI సలహా పాటించడం ద్వారా <strong>+₹${econ.estimated_income_boost_inr.toLocaleString('en-IN')}</strong> వరకు ఆదాయం పెరుగుతుంది!`;
      }
    } else if (lang === 'hi') {
      harvestText = `<strong>उपज:</strong> अनुमानित <strong>${data.predicted_yield} टन/हेक्टेयर</strong> (${data.yield_category}) ≈ <strong>₹${econ.current_revenue_inr.toLocaleString('en-IN')}</strong>`;
      if (isOptimal) {
        fertText = `<strong>उर्वरक:</strong> <span style="color:#16a34a;font-weight:700;"><i class="fa-solid fa-circle-check"></i> मिट्टी में पोषक तत्व संतुलित हैं!</span> अतिरिक्त खाद बोरी की जरूरत नहीं।`;
        profitText = `<strong>लाभ:</strong> खेत उच्चतम क्षमता पर है — अनुमानित आय <strong>₹${econ.current_revenue_inr.toLocaleString('en-IN')}</strong>.`;
      } else {
        const parts = [];
        if (econ.fertilizer_costs.urea_bags > 0) parts.push(`<strong>${econ.fertilizer_costs.urea_bags} बोरी यूरिया</strong>`);
        if (econ.fertilizer_costs.dap_bags > 0) parts.push(`<strong>${econ.fertilizer_costs.dap_bags} बोरी DAP</strong>`);
        if (econ.fertilizer_costs.mop_bags > 0) parts.push(`<strong>${econ.fertilizer_costs.mop_bags} बोरी MOP</strong>`);
        fertText = `<strong>खाद खरीदें:</strong> अपने ${econ.farm_size_acres} एकड़ के लिए ${parts.join(' + ')} (50 किग्रा बोरी) का प्रयोग करें।`;
        profitText = `<strong>अतिरिक्त आय:</strong> AI योजना से <strong>+₹${econ.estimated_income_boost_inr.toLocaleString('en-IN')}</strong> तक अतिरिक्त लाभ प्राप्त करें!`;
      }
    } else {
      harvestText = `<strong>Harvest:</strong> Expected <strong>${data.predicted_yield} T/ha</strong> (${data.yield_category}) ≈ <strong>₹${econ.current_revenue_inr.toLocaleString('en-IN')}</strong>`;
      if (isOptimal) {
        fertText = `<strong>Fertilizer:</strong> <span style="color:#16a34a;font-weight:700;"><i class="fa-solid fa-circle-check"></i> Soil nutrients balanced!</span> No extra bags needed.`;
        profitText = `<strong>Profit:</strong> Field at peak efficiency — crop value <strong>₹${econ.current_revenue_inr.toLocaleString('en-IN')}</strong>.`;
      } else {
        const parts = [];
        if (econ.fertilizer_costs.urea_bags > 0) parts.push(`<strong>${econ.fertilizer_costs.urea_bags} Bags Urea</strong>`);
        if (econ.fertilizer_costs.dap_bags > 0) parts.push(`<strong>${econ.fertilizer_costs.dap_bags} Bags DAP</strong>`);
        if (econ.fertilizer_costs.mop_bags > 0) parts.push(`<strong>${econ.fertilizer_costs.mop_bags} Bags MOP</strong>`);
        fertText = `<strong>Buy:</strong> ${parts.join(' + ')} (50kg bags) for your ${econ.farm_size_acres} acres.`;
        profitText = `<strong>Income Boost:</strong> AI plan can increase income by up to <strong>+₹${econ.estimated_income_boost_inr.toLocaleString('en-IN')}</strong>!`;
      }
    }

    const items = [
      { icon: 'fa-wheat-awn', text: harvestText },
      { icon: 'fa-boxes-packing', text: fertText },
      { icon: 'fa-arrow-trend-up', text: profitText }
    ];

    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'takeaway-item';
      div.innerHTML = `<div class="takeaway-icon-circle"><i class="fa-solid ${item.icon}"></i></div><div>${item.text}</div>`;
      container.appendChild(div);
    });
  }

  window.renderKeyTakeaways = renderKeyTakeaways;

  // 11. Voice
  if (voiceBtn && 'speechSynthesis' in window) {
    voiceBtn.addEventListener('click', () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        voiceBtn.classList.remove('speaking');
        voiceBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        return;
      }
      const selectedLang = langSelect ? langSelect.value : 'en';
      let textToSpeak = window.lastEnglishSpeech || 'Prediction ready.';
      let langCode    = 'en-IN';
      if (selectedLang === 'hi' && window.lastHindiSpeech)  { textToSpeak = window.lastHindiSpeech;  langCode = 'hi-IN'; }
      else if (selectedLang === 'te' && window.lastTeluguSpeech) { textToSpeak = window.lastTeluguSpeech; langCode = 'te-IN'; }
      else if (selectedLang === 'ta' && window.lastTamilSpeech)  { textToSpeak = window.lastTamilSpeech;  langCode = 'ta-IN'; }

      speechUtterance = new SpeechSynthesisUtterance(textToSpeak);
      speechUtterance.lang = langCode;
      speechUtterance.rate = 0.92;
      speechUtterance.onstart = () => { voiceBtn.classList.add('speaking'); voiceBtn.innerHTML = '<i class="fa-solid fa-stop"></i>'; };
      speechUtterance.onend   = () => { voiceBtn.classList.remove('speaking'); voiceBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>'; };
      window.speechSynthesis.speak(speechUtterance);
    });
  }

  // 12. Print
  const printBtn = document.getElementById('printReportBtn');
  if (printBtn) printBtn.addEventListener('click', () => window.print());

  // 13. Initial run
  updateLabels();
  updateNutrientHints();
  loadFarmerProfile();
  submitPredictionForm(false);
  if (typeof updateSoilLiveStatus === 'function') {
    updateSoilLiveStatus();
  }
  if (typeof analyzeSoil === 'function') {
    analyzeSoil(false);
  }
  if (typeof updateFarmReportsScreen === 'function') {
    updateFarmReportsScreen();
  }
});
