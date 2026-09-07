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
  },
  te: {
    tagline: 'ముందే అంచనా వేయండి. దిగుబడి పెంచండి.',
    login_title: 'రైతుకు స్వాగతం!',
    mobile_number: 'మొబైల్ నంబర్',
    otp_label: 'OTP',
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
  },
  hi: {
    tagline: 'जल्दी भविष्यवाणी करें। उपज बढ़ाएं।',
    login_title: 'किसान, आपका स्वागत है!',
    mobile_number: 'मोबाइल नंबर',
    otp_label: 'OTP',
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
  }
};

const SCREEN_ROUTES = {
  'screen-predict': '/predict-yield',
  'screen-recommend': '/recommend',
  'screen-weather': '/weather',
  'screen-soil': '/soil-health',
  'screen-pest': '/pest-detection',
  'screen-reports': '/farm-reports',
  'screen-talk': '/talk-with-ai',
  'screen-profile': '/profile',
  'screen-home': '/'
};

function showScreen(id, pushHistory = true) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
  });
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);

    // Update browser URL so back button works and URL reflects current page
    if (pushHistory && SCREEN_ROUTES[id] && window.history.pushState) {
      window.history.pushState({ screen: id }, '', SCREEN_ROUTES[id]);
    }

    // Auto-fetch/render on screen open
    if (id === 'screen-weather') {
      const wTemp = document.getElementById('wTempBig');
      if (wTemp && (wTemp.textContent === '—' || !wTemp.textContent.trim())) {
        fetchWeatherForScreen();
      }
    } else if (id === 'screen-recommend') {
      const rcResult = document.getElementById('rcResult');
      if (rcResult && rcResult.style.display === 'none') {
        getCropRecommendation();
      }
    } else if (id === 'screen-soil') {
      if (typeof analyzeSoil === 'function') {
        analyzeSoil();
      }
    }
  }
}

function openInNewTab(routePath) {
  window.open(routePath, '_blank');
}

window.addEventListener('popstate', (e) => {
  if (e.state && e.state.screen) {
    showScreen(e.state.screen, false);
  } else {
    showScreen('screen-home', false);
  }
});

function selectLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('cropai_lang', lang);
  updateLabels();

  // Update voice lang dropdown in predict screen
  const voiceLangSelect = document.getElementById('voiceLangSelect');
  if (voiceLangSelect) {
    if (lang === 'te') voiceLangSelect.value = 'te';
    else if (lang === 'hi') voiceLangSelect.value = 'hi';
    else voiceLangSelect.value = 'en';
  }

  showScreen('screen-login');
}

function updateLabels() {
  const labels = I18N[currentLang] || I18N.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (labels[key]) el.textContent = labels[key];
  });

  // Telugu subs: show only when lang is te, else show English sub for te, hi for hi
  document.querySelectorAll('.te-sub').forEach(el => {
    el.style.display = (currentLang === 'te') ? '' : (currentLang === 'en' ? 'none' : 'none');
  });
  document.querySelectorAll('.hi-sub').forEach(el => {
    el.style.display = (currentLang === 'hi') ? '' : 'none';
  });

  // Always show Telugu script in buttons (just dimmed if not selected lang)
  if (currentLang === 'en') {
    document.querySelectorAll('.te-sub').forEach(el => el.style.display = '');
    document.querySelectorAll('.hi-sub').forEach(el => el.style.display = '');
  }
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
// 4. SOIL HEALTH SCREEN
// ──────────────────────────────────────────────

function analyzeSoil() {
  const n  = parseFloat(document.getElementById('soilN')?.value || 90);
  const p  = parseFloat(document.getElementById('soilP')?.value || 45);
  const k  = parseFloat(document.getElementById('soilK')?.value || 40);
  const ph = parseFloat(document.getElementById('soilPH')?.value || 6.5);
  const moisture = parseFloat(document.getElementById('soilMoisture')?.value || 65);
  const om = document.getElementById('soilOM')?.value || 'medium';

  // Simple scoring algorithm
  let score = 100;
  const issues = [];
  const recommendations = [];

  // Nitrogen scoring
  if (n < 40)        { score -= 20; issues.push({ label: '<i class="fa-solid fa-leaf"></i> Nitrogen (N)', status: 'Very Low', desc: 'Severe nitrogen deficiency. Crops will show yellow leaves.', cls: 'high-priority' }); recommendations.push('Apply 3 bags of Urea (46-0-0) per acre immediately.'); }
  else if (n < 70)   { score -= 10; issues.push({ label: '<i class="fa-solid fa-leaf"></i> Nitrogen (N)', status: 'Low', desc: 'Nitrogen is below optimal. Plant growth will be slow.', cls: 'medium-priority' }); recommendations.push('Apply 1-2 bags of Urea per acre before sowing.'); }
  else if (n > 160)  { score -= 5;  issues.push({ label: '<i class="fa-solid fa-leaf"></i> Nitrogen (N)', status: 'Excess', desc: 'Too much nitrogen causes soft stems and pest vulnerability.', cls: '' }); }

  // Phosphorus scoring
  if (p < 25)        { score -= 15; issues.push({ label: '<i class="fa-solid fa-seedling"></i> Phosphorus (P)', status: 'Low', desc: 'Weak root system. Poor flowering and fruiting expected.', cls: 'high-priority' }); recommendations.push('Apply DAP (18-46-0) fertilizer — 1 bag per acre.'); }
  else if (p > 100)  { score -= 3;  issues.push({ label: '<i class="fa-solid fa-seedling"></i> Phosphorus (P)', status: 'Excess', desc: 'High phosphorus blocks zinc uptake. Balanced soil.', cls: '' }); }

  // Potassium scoring
  if (k < 25)        { score -= 12; issues.push({ label: '<i class="fa-solid fa-shield-halved"></i> Potassium (K)', status: 'Low', desc: 'Crop immunity is weak. Risk of drought and pest damage.', cls: 'high-priority' }); recommendations.push('Apply MOP (0-0-60) — 1 bag per acre for disease resistance.'); }

  // pH scoring
  if (ph < 5.5)      { score -= 18; issues.push({ label: '<i class="fa-solid fa-flask"></i> Soil pH', status: 'Very Acidic', desc: `pH ${ph} blocks nutrient absorption. Fertilizers become useless.`, cls: 'high-priority' }); recommendations.push('Apply Agricultural Lime (2-3 bags/acre) and wait 3 weeks before sowing.'); }
  else if (ph < 6.0) { score -= 8;  issues.push({ label: '<i class="fa-solid fa-flask"></i> Soil pH', status: 'Slightly Acidic', desc: `pH ${ph} — apply light lime to bring to 6.5.`, cls: 'medium-priority' }); recommendations.push('Apply 1 bag Agricultural Lime per acre to improve pH.'); }
  else if (ph > 8.0) { score -= 10; issues.push({ label: '<i class="fa-solid fa-flask"></i> Soil pH', status: 'Alkaline', desc: `pH ${ph} — salty/alkaline soil. Gypsum treatment needed.`, cls: 'medium-priority' }); recommendations.push('Apply Gypsum (2-3 bags/acre) and add green manure to reduce alkalinity.'); }

  // Moisture
  if (moisture < 30) { score -= 8; issues.push({ label: '<i class="fa-solid fa-water"></i> Soil Moisture', status: 'Dry', desc: 'Soil moisture is critically low. Irrigate before sowing.', cls: 'high-priority' }); recommendations.push('Irrigate field before sowing. Add mulch to retain moisture.'); }
  else if (moisture > 85) { score -= 5; issues.push({ label: '<i class="fa-solid fa-water"></i> Soil Moisture', status: 'Waterlogged', desc: 'Excess moisture causes root rot. Ensure proper drainage.', cls: 'medium-priority' }); recommendations.push('Open drainage channels to prevent waterlogging and root rot.'); }

  // Organic matter
  if (om === 'low')  { score -= 10; issues.push({ label: '<i class="fa-solid fa-spa"></i> Organic Matter', status: 'Low', desc: 'Poor soil structure. Crops will not hold moisture well.', cls: 'medium-priority' }); recommendations.push('Add 2-3 tonnes of Farmyard Manure (FYM) or compost per acre.'); }

  score = Math.max(0, Math.min(100, score));

  // Determine status
  let statusText, statusTe, heroBg;
  if (score >= 80) {
    statusText = '<i class="fa-solid fa-circle-check"></i> Healthy Soil'; statusTe = 'ఆరోగ్యకరమైన నేల'; heroBg = 'linear-gradient(135deg, #166534, #16a34a)';
  } else if (score >= 55) {
    statusText = '<i class="fa-solid fa-triangle-exclamation"></i> Moderate Soil'; statusTe = 'మధ్యస్థ నేల'; heroBg = 'linear-gradient(135deg, #92400e, #d97706)';
  } else {
    statusText = '<i class="fa-solid fa-circle-xmark"></i> Poor Soil — Needs Treatment'; statusTe = 'నేలకు చికిత్స అవసరం'; heroBg = 'linear-gradient(135deg, #991b1b, #dc2626)';
  }

  // Render
  const hero = document.getElementById('soilResultHero');
  const scoreEl = document.getElementById('soilResultScore');
  const statusEl = document.getElementById('soilResultStatus');
  const statusTeEl = document.getElementById('soilResultStatusTe');
  if (hero) hero.style.background = heroBg;
  if (statusEl) statusEl.innerHTML = statusText;
  if (statusTeEl) statusTeEl.textContent = statusTe;
  if (scoreEl) scoreEl.textContent = `Soil Health Score: ${score}/100`;

  const list = document.getElementById('soilResultList');
  if (list) {
    list.innerHTML = '';

    // Issues
    issues.forEach(issue => {
      const card = document.createElement('div');
      card.className = `advisory-card ${issue.cls}`;
      card.innerHTML = `<div class="advisory-title"><span>${issue.label}</span><span>[${issue.status}]</span></div><div class="advisory-desc">${issue.desc}</div>`;
      list.appendChild(card);
    });

    // If all good
    if (issues.length === 0) {
      const card = document.createElement('div');
      card.className = 'advisory-card';
      card.innerHTML = `<div class="advisory-title"><span><i class="fa-solid fa-circle-check" style="color:#16a34a;"></i> All Parameters</span><span>[Optimal]</span></div><div class="advisory-desc">Your soil is in excellent condition! Maintain organic matter and regular soil testing.</div>`;
      list.appendChild(card);
    }

    // Recommendations
    if (recommendations.length > 0) {
      const recHeader = document.createElement('div');
      recHeader.className = 'section-sub-head';
      recHeader.innerHTML = '<i class="fa-solid fa-lightbulb" style="color:#f59e0b;"></i> Recommendations';
      list.appendChild(recHeader);
      recommendations.forEach(r => {
        const el = document.createElement('div');
        el.className = 'advisory-card';
        el.innerHTML = `<div class="advisory-desc"><i class="fa-solid fa-check" style="color:#16a34a;margin-right:5px;"></i>${r}</div>`;
        list.appendChild(el);
      });
    }
  }

  document.getElementById('soilResult').style.display = 'block';
  document.getElementById('soilResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // Sync farm size input in predict screen
  const farmSizeInput = document.getElementById('farmSizeInput');
  if (farmSizeInput) farmSizeInput.value = landSize;

  alert('Profile updated successfully! వివరాలు సేవ్ చేయబడ్డాయి.');
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

    let fertText = isOptimal
      ? `<strong>Fertilizer:</strong> <span style="color:#16a34a;font-weight:700;"><i class="fa-solid fa-circle-check"></i> Soil nutrients balanced!</span> No extra bags needed.`
      : (() => {
          const parts = [];
          if (econ.fertilizer_costs.urea_bags > 0) parts.push(`<strong>${econ.fertilizer_costs.urea_bags} Bags Urea</strong>`);
          if (econ.fertilizer_costs.dap_bags  > 0) parts.push(`<strong>${econ.fertilizer_costs.dap_bags} Bags DAP</strong>`);
          if (econ.fertilizer_costs.mop_bags  > 0) parts.push(`<strong>${econ.fertilizer_costs.mop_bags} Bags MOP</strong>`);
          return `<strong>Buy:</strong> ${parts.join(' + ')} (50kg bags) for your ${econ.farm_size_acres} acres.`;
        })();

    let profitText = isOptimal
      ? `<strong>Profit:</strong> Field at peak efficiency — crop value <strong>₹${econ.current_revenue_inr.toLocaleString('en-IN')}</strong>.`
      : `<strong>Income Boost:</strong> AI plan can increase income by up to <strong>+₹${econ.estimated_income_boost_inr.toLocaleString('en-IN')}</strong>!`;

    const items = [
      { icon: 'fa-wheat-awn',      text: `<strong>Harvest:</strong> Expected <strong>${data.predicted_yield} T/ha</strong> (${data.yield_category}) ≈ <strong>₹${econ.current_revenue_inr.toLocaleString('en-IN')}</strong>` },
      { icon: 'fa-boxes-packing',  text: fertText },
      { icon: 'fa-arrow-trend-up', text: profitText }
    ];

    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'takeaway-item';
      div.innerHTML = `<div class="takeaway-icon-circle"><i class="fa-solid ${item.icon}"></i></div><div>${item.text}</div>`;
      container.appendChild(div);
    });
  }

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
  updateNutrientHints();
  loadFarmerProfile();
  submitPredictionForm(false);
});
