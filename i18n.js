// ============================================================
// PUNERIDE — MULTILINGUAL TRANSLATIONS
// Languages: English (en), Hindi (hi), Marathi (mr)
// ============================================================

const TRANSLATIONS = {
  en: {
    // Nav
    nav_home:        "Home",
    nav_tracker:     "Live Tracker",
    nav_about:       "About",
    nav_help:        "Help",

    // Landing
    hero_badge:      "PUNE CITY BUS — SMART ETA SYSTEM",
    hero_h1_line1:   "Know exactly when",
    hero_h1_line2:   "your bus arrives.",
    hero_p:          "Choose your boarding stop and destination. Our AI predicts arrival times using real schedules and live Pune traffic patterns.",
    hero_btn_open:   "Open Live Tracker →",
    hero_btn_how:    "How it works",
    stat_routes:     "Sample Routes",
    stat_stops:      "Bus Stops",
    stat_gps:        "GPS Assist",

    feat1_title:     "Pick Your Stop",
    feat1_p:         "Search from the stop list or use GPS to detect the nearest stop.",
    feat2_title:     "Available Buses Only",
    feat2_p:         "Only buses that connect your two stops are shown. No irrelevant results.",
    feat3_title:     "Smart ETA",
    feat3_p:         "Peak-hour traffic patterns adjust your ETA automatically — realistic delays.",
    feat4_title:     "Route on Map",
    feat4_p:         "Active route highlighted in colour, boarding and alighting stops clearly marked.",

    // Dashboard
    step1_title:     "Where are you boarding?",
    step2_title:     "Where are you going?",
    step3_title:     "Available Buses",
    step4_title:     "Your Journey",

    search_board:    "Search bus stop name…",
    search_alight:   "Search destination stop…",
    gps_btn:         "📍 Use GPS",
    gps_locating:    "📍 Locating…",
    boarding_at:     "Boarding at",
    from_label:      "From",
    to_label:        "To",
    change_btn:      "Change",
    view_map_btn:    "View on map →",
    new_journey:     "← New Journey",

    no_bus_title:    "No direct bus found",
    no_bus_sub:      "No bus runs directly between these two stops. Try stops on the same route.",
    try_diff:        "Try different stops",

    fastest_badge:   "Fastest",
    wait_label:      "Bus arrives at",
    wait_min:        "wait",
    ride_label:      "Ride",
    stops_label:     "stops",

    eta_unit:        "minutes on bus",
    arrive_label:    "Arrive at stop",
    no_more_buses:   "No more buses today",
    wait_for:        "Wait for Bus",
    arrives_at:      "Bus arrives at your stop at",
    board_at:        "Board at",
    alight_at:       "Alight at",
    arrive_time:     "Arrive",
    eta_adjusted:    "ETA adjusted for current traffic",

    leg_board:       "Board here",
    leg_alight:      "Get off here",
    leg_stop:        "Bus stop",
    leg_route:       "Bus route",

    // Traffic
    traffic_low:     "Low Traffic",
    traffic_med:     "Moderate Traffic",
    traffic_high:    "Heavy Traffic",

    // About
    about_title:     "About PuneRide",
    about_p1:        "PuneRide is a smart bus ETA prediction system built for Pune city commuters. It uses ML to predict realistic arrival times, adjusted for time-of-day traffic patterns.",
    about_problem:   "Problem",
    about_prob_p:    "PMPML commuters have no easy way to know when the next bus will arrive or how long their journey will take.",
    about_solution:  "Solution",
    about_sol_p:     "Select boarding and destination stops. The system shows only directly connected buses, predicts wait time from the next schedule, and calculates ride time adjusted for current traffic.",
    about_tech:      "Technologies Used",
    about_how:       "How the ETA Model Works",
    about_how_p:     "Linear Regression model trained on distance, stops, and traffic. Peak hours (8–10am, 5–8pm) apply 1.40× delay. Dwell time of 1.5 min per stop is added to every ride estimate.",
    about_future:    "Future Enhancements",
    about_future_p:  "Live PMPML GPS tracking, real GTFS feeds, weather-based delays, crowdsourced reports, mobile push notifications.",
    about_flow1:     "Select boarding stop",
    about_flow2:     "Select destination",
    about_flow3:     "Filter valid buses",
    about_flow4:     "ML ETA prediction",
    about_flow5:     "Route on map",

    // Help
    help_title:      "Help & FAQ",
    faq1_q:          "How do I use the Live Tracker?",
    faq1_a:          "Go to Live Tracker. Step 1: Search and click your boarding stop. Step 2: Search and click your destination stop. Step 3: Available buses appear with ETAs. Click 'View on map' to see the highlighted route.",
    faq2_q:          "How does GPS work?",
    faq2_a:          "Click '📍 Use GPS'. Allow location access when prompted. The system finds the nearest stop to your location and selects it automatically.",
    faq3_q:          "Why does it say 'No direct bus found'?",
    faq3_a:          "No single bus connects those two stops directly. Try stops on the same route: Bus 101 (Shivajinagar↔Swargate), Bus 155 (Katraj↔Hadapsar), Bus 50 (Wakad↔Kothrud).",
    faq4_q:          "Which stops are on which route?",
    faq4_a:          "<b>Bus 101:</b> Shivajinagar → FC Road → Deccan → Nal Stop → Dandekar Bridge → Swargate<br><br><b>Bus 155:</b> Katraj → Bibwewadi → Swargate → Market Yard → Pune Station → Ghorpadi → Hadapsar<br><br><b>Bus 50:</b> Wakad → Baner Road → Aundh IT Park → Parihar Chowk → Karve Road → Kothrud Depot",
    faq5_q:          "How is ETA calculated?",
    faq5_a:          "Wait time: next bus schedule at your stop. Ride time: distance ÷ speed × traffic multiplier + 1.5 min dwell per stop. Peak hours add 40% more time.",
    faq6_q:          "How do I run this locally?",
    faq6_a:          "Frontend works by just opening index.html. For Flask backend: <code>pip install flask flask-cors scikit-learn numpy pandas</code>, then <code>python train_model.py</code>, then <code>python app.py</code>.",

    footer_built:    "Built with Flask · Leaflet · ML · 2026",
    footer_demo:     "Demo Project · PMPML Inspired",
  },

  hi: {
    nav_home:        "होम",
    nav_tracker:     "लाइव ट्रैकर",
    nav_about:       "के बारे में",
    nav_help:        "सहायता",

    hero_badge:      "पुणे सिटी बस — स्मार्ट ईटीए सिस्टम",
    hero_h1_line1:   "जानें ठीक कब",
    hero_h1_line2:   "आपकी बस आएगी।",
    hero_p:          "अपना बोर्डिंग स्टॉप और गंतव्य चुनें। हमारा AI वास्तविक समय-सारणी और पुणे ट्रैफिक पैटर्न से आगमन समय का अनुमान लगाता है।",
    hero_btn_open:   "लाइव ट्रैकर खोलें →",
    hero_btn_how:    "यह कैसे काम करता है",
    stat_routes:     "रूट",
    stat_stops:      "बस स्टॉप",
    stat_gps:        "GPS सहायता",

    feat1_title:     "स्टॉप चुनें",
    feat1_p:         "स्टॉप सूची से खोजें या GPS से नजदीकी स्टॉप ढूंढें।",
    feat2_title:     "केवल उपलब्ध बसें",
    feat2_p:         "सिर्फ वही बसें दिखती हैं जो आपके दोनों स्टॉप को जोड़ती हैं।",
    feat3_title:     "स्मार्ट ETA",
    feat3_p:         "पीक-आवर ट्रैफिक के अनुसार ETA स्वचालित रूप से समायोजित होती है।",
    feat4_title:     "मानचित्र पर रूट",
    feat4_p:         "सक्रिय रूट रंगीन हाइलाइट के साथ, बोर्डिंग और गंतव्य स्टॉप स्पष्ट रूप से चिह्नित।",

    step1_title:     "आप कहाँ से चढ़ेंगे?",
    step2_title:     "आप कहाँ जाना चाहते हैं?",
    step3_title:     "उपलब्ध बसें",
    step4_title:     "आपकी यात्रा",

    search_board:    "बस स्टॉप का नाम खोजें…",
    search_alight:   "गंतव्य स्टॉप खोजें…",
    gps_btn:         "📍 GPS उपयोग करें",
    gps_locating:    "📍 स्थान खोज रहे हैं…",
    boarding_at:     "यहाँ से चढ़ें",
    from_label:      "से",
    to_label:        "तक",
    change_btn:      "बदलें",
    view_map_btn:    "मानचित्र पर देखें →",
    new_journey:     "← नई यात्रा",

    no_bus_title:    "कोई सीधी बस नहीं मिली",
    no_bus_sub:      "इन दोनों स्टॉप के बीच कोई सीधी बस नहीं है। एक ही रूट के स्टॉप चुनें।",
    try_diff:        "अलग स्टॉप आज़माएं",

    fastest_badge:   "सबसे तेज़",
    wait_label:      "बस आएगी",
    wait_min:        "प्रतीक्षा",
    ride_label:      "सफर",
    stops_label:     "स्टॉप",

    eta_unit:        "मिनट बस में",
    arrive_label:    "स्टॉप पर पहुंचें",
    no_more_buses:   "आज और बसें नहीं",
    wait_for:        "बस का इंतज़ार करें",
    arrives_at:      "बस आपके स्टॉप पर आएगी",
    board_at:        "यहाँ चढ़ें",
    alight_at:       "यहाँ उतरें",
    arrive_time:     "पहुंचें",
    eta_adjusted:    "वर्तमान ट्रैफिक के अनुसार ETA समायोजित",

    leg_board:       "यहाँ चढ़ें",
    leg_alight:      "यहाँ उतरें",
    leg_stop:        "बस स्टॉप",
    leg_route:       "बस रूट",

    traffic_low:     "कम ट्रैफिक",
    traffic_med:     "मध्यम ट्रैफिक",
    traffic_high:    "भारी ट्रैफिक",

    about_title:     "PuneRide के बारे में",
    about_p1:        "PuneRide एक स्मार्ट बस ETA भविष्यवाणी प्रणाली है, जो पुणे के यात्रियों के लिए बनाई गई है। यह ML का उपयोग करके यथार्थवादी आगमन समय का अनुमान लगाता है।",
    about_problem:   "समस्या",
    about_prob_p:    "PMPML यात्रियों को अगली बस के आने का समय जानने का कोई आसान तरीका नहीं है।",
    about_solution:  "समाधान",
    about_sol_p:     "बोर्डिंग और गंतव्य स्टॉप चुनें। सिस्टम केवल सीधे जुड़ी बसें दिखाता है और वर्तमान ट्रैफिक के अनुसार ETA देता है।",
    about_tech:      "प्रयुक्त तकनीकें",
    about_how:       "ETA मॉडल कैसे काम करता है",
    about_how_p:     "Linear Regression मॉडल दूरी, स्टॉप और ट्रैफिक पर प्रशिक्षित। पीक आवर 1.40× देरी। प्रति स्टॉप 1.5 मिनट का ठहराव जोड़ा जाता है।",
    about_future:    "भविष्य के सुधार",
    about_future_p:  "लाइव PMPML GPS ट्रैकिंग, वास्तविक GTFS फीड, मौसम-आधारित देरी, मोबाइल पुश नोटिफिकेशन।",
    about_flow1:     "बोर्डिंग स्टॉप चुनें",
    about_flow2:     "गंतव्य चुनें",
    about_flow3:     "बसें फ़िल्टर करें",
    about_flow4:     "ML ETA भविष्यवाणी",
    about_flow5:     "मानचित्र पर रूट",

    help_title:      "सहायता और अक्सर पूछे जाने वाले प्रश्न",
    faq1_q:          "लाइव ट्रैकर कैसे उपयोग करें?",
    faq1_a:          "चरण 1: अपना बोर्डिंग स्टॉप खोजें और क्लिक करें। चरण 2: गंतव्य स्टॉप खोजें। चरण 3: उपलब्ध बसें ETA के साथ दिखेंगी।",
    faq2_q:          "GPS कैसे काम करता है?",
    faq2_a:          "'📍 GPS उपयोग करें' पर क्लिक करें। स्थान अनुमति दें। सिस्टम आपके नजदीकी स्टॉप को स्वचालित रूप से चुनता है।",
    faq3_q:          "'कोई सीधी बस नहीं मिली' क्यों दिखता है?",
    faq3_a:          "इन दोनों स्टॉप को कोई एक बस सीधे नहीं जोड़ती। एक ही रूट के स्टॉप आज़माएं: बस 101 (शिवाजीनगर↔स्वारगेट), बस 155 (कात्रज↔हडपसर), बस 50 (वाकड↔कोथरूड)।",
    faq4_q:          "कौन से स्टॉप किस रूट पर हैं?",
    faq4_a:          "<b>बस 101:</b> शिवाजीनगर → FC रोड → डेक्कन → नल स्टॉप → दांडेकर ब्रिज → स्वारगेट<br><br><b>बस 155:</b> कात्रज → बिभवेवाड़ी → स्वारगेट → मार्केट यार्ड → पुणे स्टेशन → घोरपड़ी → हडपसर<br><br><b>बस 50:</b> वाकड → बाणेर रोड → औंध IT पार्क → परिहार चौक → कर्वे रोड → कोथरूड डिपो",
    faq5_q:          "ETA कैसे गिना जाता है?",
    faq5_a:          "प्रतीक्षा समय: आपके स्टॉप पर अगली बस का समय-सारणी। सफर समय: दूरी ÷ गति × ट्रैफिक गुणक + प्रति स्टॉप 1.5 मिनट।",
    faq6_q:          "इसे स्थानीय रूप से कैसे चलाएं?",
    faq6_a:          "फ्रंटएंड: सीधे index.html खोलें। Flask बैकएंड के लिए: <code>pip install flask flask-cors scikit-learn numpy pandas</code>, फिर <code>python train_model.py</code>, फिर <code>python app.py</code>।",

    footer_built:    "Flask · Leaflet · ML · 2026 के साथ बनाया",
    footer_demo:     "डेमो प्रोजेक्ट · PMPML प्रेरित",
  },

  mr: {
    nav_home:        "मुख्यपृष्ठ",
    nav_tracker:     "लाइव ट्रॅकर",
    nav_about:       "आमच्याबद्दल",
    nav_help:        "मदत",

    hero_badge:      "पुणे सिटी बस — स्मार्ट ETA सिस्टम",
    hero_h1_line1:   "नक्की जाणून घ्या कधी",
    hero_h1_line2:   "तुमची बस येणार.",
    hero_p:          "तुमचा बोर्डिंग स्टॉप आणि गंतव्य निवडा. आमचा AI खऱ्या वेळापत्रक आणि पुणे ट्रॅफिक पॅटर्नवरून येण्याचा वेळ सांगतो.",
    hero_btn_open:   "लाइव ट्रॅकर उघडा →",
    hero_btn_how:    "हे कसे काम करते",
    stat_routes:     "मार्ग",
    stat_stops:      "बस स्टॉप",
    stat_gps:        "GPS सहाय्य",

    feat1_title:     "स्टॉप निवडा",
    feat1_p:         "यादीतून शोधा किंवा GPS वापरून जवळचा स्टॉप शोधा.",
    feat2_title:     "फक्त उपलब्ध बसेस",
    feat2_p:         "फक्त त्याच बसेस दाखवल्या जातात ज्या तुमच्या दोन्ही स्टॉपला जोडतात.",
    feat3_title:     "स्मार्ट ETA",
    feat3_p:         "पीक-आवर ट्रॅफिकनुसार ETA आपोआप अ‍ॅडजस्ट होते — वास्तववादी विलंब.",
    feat4_title:     "नकाशावर मार्ग",
    feat4_p:         "सक्रिय मार्ग रंगाने हायलाइट, बोर्डिंग आणि उतरण्याचे स्टॉप स्पष्टपणे चिन्हांकित.",

    step1_title:     "तुम्ही कुठून चढणार?",
    step2_title:     "तुम्ही कुठे जाणार?",
    step3_title:     "उपलब्ध बसेस",
    step4_title:     "तुमची यात्रा",

    search_board:    "बस स्टॉपचे नाव शोधा…",
    search_alight:   "गंतव्य स्टॉप शोधा…",
    gps_btn:         "📍 GPS वापरा",
    gps_locating:    "📍 स्थान शोधत आहे…",
    boarding_at:     "येथे चढा",
    from_label:      "येथून",
    to_label:        "येथे",
    change_btn:      "बदला",
    view_map_btn:    "नकाशावर पहा →",
    new_journey:     "← नवीन प्रवास",

    no_bus_title:    "थेट बस सापडली नाही",
    no_bus_sub:      "या दोन स्टॉपमध्ये थेट बस नाही. एकाच मार्गावरील स्टॉप निवडा.",
    try_diff:        "वेगळे स्टॉप वापरून पहा",

    fastest_badge:   "सर्वात जलद",
    wait_label:      "बस येते",
    wait_min:        "प्रतीक्षा",
    ride_label:      "प्रवास",
    stops_label:     "स्टॉप",

    eta_unit:        "मिनिटे बसमध्ये",
    arrive_label:    "स्टॉपवर पोहोचा",
    no_more_buses:   "आज आणखी बसेस नाहीत",
    wait_for:        "बसची प्रतीक्षा करा",
    arrives_at:      "बस तुमच्या स्टॉपवर येते",
    board_at:        "येथे चढा",
    alight_at:       "येथे उतरा",
    arrive_time:     "पोहोचा",
    eta_adjusted:    "सध्याच्या ट्रॅफिकनुसार ETA",

    leg_board:       "येथे चढा",
    leg_alight:      "येथे उतरा",
    leg_stop:        "बस स्टॉप",
    leg_route:       "बस मार्ग",

    traffic_low:     "कमी ट्रॅफिक",
    traffic_med:     "मध्यम ट्रॅफिक",
    traffic_high:    "जड ट्रॅफिक",

    about_title:     "PuneRide बद्दल",
    about_p1:        "PuneRide ही पुणे शहरातील प्रवाशांसाठी बनवलेली स्मार्ट बस ETA भविष्यवाणी प्रणाली आहे. ML वापरून वेळेनुसार ट्रॅफिक पॅटर्नसह अचूक वेळ सांगते.",
    about_problem:   "समस्या",
    about_prob_p:    "PMPML प्रवाशांना पुढची बस कधी येणार हे सहजपणे जाणून घेण्याचा कोणताही मार्ग नाही.",
    about_solution:  "उपाय",
    about_sol_p:     "बोर्डिंग आणि गंतव्य स्टॉप निवडा. सिस्टम फक्त थेट जोडलेल्या बसेस दाखवते आणि सध्याच्या ट्रॅफिकनुसार ETA देते.",
    about_tech:      "वापरलेल्या तंत्रज्ञान",
    about_how:       "ETA मॉडेल कसे काम करते",
    about_how_p:     "Linear Regression मॉडेल अंतर, स्टॉप आणि ट्रॅफिकवर प्रशिक्षित. पीक आवर 1.40× विलंब. प्रत्येक स्टॉपसाठी 1.5 मिनिटे थांबण्याचा वेळ जोडला.",
    about_future:    "भविष्यातील सुधारणा",
    about_future_p:  "लाइव्ह PMPML GPS ट्रॅकिंग, खरे GTFS फीड, हवामान-आधारित विलंब, मोबाइल पुश नोटिफिकेशन.",
    about_flow1:     "बोर्डिंग स्टॉप निवडा",
    about_flow2:     "गंतव्य निवडा",
    about_flow3:     "बसेस फिल्टर करा",
    about_flow4:     "ML ETA भविष्यवाणी",
    about_flow5:     "नकाशावर मार्ग",

    help_title:      "मदत आणि वारंवार विचारले जाणारे प्रश्न",
    faq1_q:          "लाइव्ह ट्रॅकर कसा वापरायचा?",
    faq1_a:          "पायरी 1: बोर्डिंग स्टॉप शोधा आणि क्लिक करा. पायरी 2: गंतव्य स्टॉप शोधा. पायरी 3: उपलब्ध बसेस ETA सह दिसतात. 'नकाशावर पहा' क्लिक करा.",
    faq2_q:          "GPS कसे काम करते?",
    faq2_a:          "'📍 GPS वापरा' क्लिक करा. स्थान परवानगी द्या. सिस्टम तुमच्या जवळचा स्टॉप आपोआप निवडते.",
    faq3_q:          "'थेट बस सापडली नाही' का दिसते?",
    faq3_a:          "कोणतीही एक बस त्या दोन स्टॉपला थेट जोडत नाही. एकाच मार्गावरील स्टॉप वापरा: बस 101 (शिवाजीनगर↔स्वारगेट), बस 155 (कात्रज↔हडपसर), बस 50 (वाकड↔कोथरूड).",
    faq4_q:          "कोणते स्टॉप कोणत्या मार्गावर आहेत?",
    faq4_a:          "<b>बस 101:</b> शिवाजीनगर → FC रोड → डेक्कन → नल स्टॉप → दांडेकर ब्रिज → स्वारगेट<br><br><b>बस 155:</b> कात्रज → बिभवेवाडी → स्वारगेट → मार्केट यार्ड → पुणे स्टेशन → घोरपडी → हडपसर<br><br><b>बस 50:</b> वाकड → बाणेर रोड → औंध IT पार्क → परिहार चौक → कर्वे रोड → कोथरूड डेपो",
    faq5_q:          "ETA कसा मोजला जातो?",
    faq5_a:          "प्रतीक्षा वेळ: तुमच्या स्टॉपवर पुढच्या बसचे वेळापत्रक. प्रवास वेळ: अंतर ÷ वेग × ट्रॅफिक गुणक + प्रति स्टॉप 1.5 मिनिटे.",
    faq6_q:          "हे स्थानिक पातळीवर कसे चालवायचे?",
    faq6_a:          "फ्रंटएंड: फक्त index.html उघडा. Flask बॅकएंडसाठी: <code>pip install flask flask-cors scikit-learn numpy pandas</code>, नंतर <code>python train_model.py</code>, नंतर <code>python app.py</code>.",

    footer_built:    "Flask · Leaflet · ML · 2026 सह बनवले",
    footer_demo:     "डेमो प्रकल्प · PMPML प्रेरित",
  }
};

// Current language state
let currentLang = localStorage.getItem('pr_lang') || 'en';

function t(key) {
  return TRANSLATIONS[currentLang][key] || TRANSLATIONS['en'][key] || key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('pr_lang', lang);
  applyTranslations();
  updateLangButtons();
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const attr = el.getAttribute('data-i18n-attr');
    const val = t(key);
    if (attr) {
      el.setAttribute(attr, val);
    } else if (el.innerHTML !== undefined && val.includes('<')) {
      el.innerHTML = val;
    } else {
      el.textContent = val;
    }
  });
  // Update html lang attr
  document.documentElement.lang = currentLang;
}

function updateLangButtons() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
  updateLangButtons();
});
