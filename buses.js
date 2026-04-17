// ============================================================
// SMART TRANSIT SYSTEM — buses.js
// Routes: 101 (Shivajinagar↔Swargate), 155 (Katraj↔Hadapsar),
//         A1  (Alandi↔Pune Station)
// KEY FIX: stops are matched by UNIQUE ID only, no name
// ambiguity. Every stop has a globally unique id.
// ============================================================

// Stop names in all three languages
const STOP_NAMES = {
  // Bus 101
  "101_1": { en: "Shivajinagar Bus Stand",    hi: "शिवाजीनगर बस स्टैंड",     mr: "शिवाजीनगर बस स्थानक"    },
  "101_2": { en: "FC Road / Goodluck Chowk",  hi: "FC रोड / गुडलक चौक",       mr: "FC रोड / गुडलक चौक"       },
  "101_3": { en: "Deccan Gymkhana",           hi: "डेक्कन जिमखाना",           mr: "डेक्कन जिमखाना"           },
  "101_4": { en: "Nal Stop",                  hi: "नल स्टॉप",                 mr: "नळ स्टॉप"                 },
  "101_5": { en: "Dandekar Bridge",           hi: "दांडेकर ब्रिज",            mr: "दांडेकर पूल"               },
  "101_6": { en: "Swargate Bus Terminal",     hi: "स्वारगेट बस टर्मिनल",      mr: "स्वारगेट बस टर्मिनस"      },

  // Bus 155
  "155_1": { en: "Katraj Bus Stand",          hi: "कात्रज बस स्टैंड",          mr: "कात्रज बस स्थानक"          },
  "155_2": { en: "Bibwewadi Corner",          hi: "बिभवेवाड़ी कॉर्नर",          mr: "बिभवेवाडी कॉर्नर"          },
  "155_3": { en: "Swargate Terminal",         hi: "स्वारगेट टर्मिनल",          mr: "स्वारगेट टर्मिनस"          },
  "155_4": { en: "Market Yard",               hi: "मार्केट यार्ड",             mr: "मार्केट यार्ड"             },
  "155_5": { en: "Pune Railway Station",      hi: "पुणे रेलवे स्टेशन",         mr: "पुणे रेल्वे स्थानक"        },
  "155_6": { en: "Ghorpadi",                  hi: "घोरपड़ी",                   mr: "घोरपडी"                   },
  "155_7": { en: "Hadapsar Gadital",          hi: "हडपसर गाडीताल",             mr: "हडपसर गाडीताल"             },

  // Bus A1 — Alandi to Pune Station
  "A1_1":  { en: "Alandi Bus Stop",           hi: "आलंदी बस स्टॉप",            mr: "आळंदी बस स्थानक"           },
  "A1_2":  { en: "Chakan Phata",              hi: "चाकण फाटा",                 mr: "चाकण फाटा"                 },
  "A1_3":  { en: "Dighi Depot",               hi: "डिघी डिपो",                 mr: "दिघी डेपो"                 },
  "A1_4":  { en: "Vishrantwadi",              hi: "विश्रांतवाड़ी",              mr: "विश्रांतवाडी"              },
  "A1_5":  { en: "Dhole Patil Road",          hi: "ढोले पाटिल रोड",            mr: "ढोले पाटील रोड"            },
  "A1_6":  { en: "Pune Railway Station",      hi: "पुणे रेलवे स्टेशन",         mr: "पुणे रेल्वे स्थानक"        },
};

// Get stop name in current language (falls back to en)
function stopName(stopId) {
  const rec = STOP_NAMES[stopId];
  if (!rec) return stopId;
  return rec[currentLang] || rec['en'];
}

// Bus route names per language
const BUS_NAMES = {
  "BUS_101": { en: "Shivajinagar → Swargate",    hi: "शिवाजीनगर → स्वारगेट",    mr: "शिवाजीनगर → स्वारगेट"    },
  "BUS_155": { en: "Katraj → Hadapsar",           hi: "कात्रज → हडपसर",           mr: "कात्रज → हडपसर"           },
  "BUS_A1":  { en: "Alandi → Pune Station",       hi: "आलंदी → पुणे स्टेशन",      mr: "आळंदी → पुणे स्थानक"     },
};

function busName(busId) {
  const rec = BUS_NAMES[busId];
  if (!rec) return busId;
  return rec[currentLang] || rec['en'];
}

// Traffic labels per language
const TRAFFIC_LABEL_MAP = {
  1: { en: "Low Traffic",      hi: "कम ट्रैफिक",      mr: "कमी ट्रॅफिक"      },
  2: { en: "Moderate Traffic", hi: "मध्यम ट्रैफिक",   mr: "मध्यम ट्रॅफिक"   },
  3: { en: "Heavy Traffic",    hi: "भारी ट्रैफिक",    mr: "जड ट्रॅफिक"      },
};

// Keep TRAFFIC_LABELS as plain english map for backward compat
const TRAFFIC_LABELS = { 1: "Low Traffic", 2: "Moderate Traffic", 3: "Heavy Traffic" };
const TRAFFIC_COLORS = { 1: "#27ae60", 2: "#f39c12", 3: "#e74c3c" };
const TRAFFIC_DELAY  = { 1: 0.85, 2: 1.0, 3: 1.40 };

function trafficLabel(level) {
  const rec = TRAFFIC_LABEL_MAP[level];
  if (!rec) return TRAFFIC_LABELS[level];
  return rec[currentLang] || rec['en'];
}

const BUS_DATA = [
  {
    id: "BUS_101",
    number: "101",
    color: "#e74c3c",
    frequency_min: 15,
    avg_speed_kmh: 14,
    stops: [
      { id: "101_1", lat: 18.5308, lng: 73.8474 },
      { id: "101_2", lat: 18.5237, lng: 73.8421 },
      { id: "101_3", lat: 18.5197, lng: 73.8417 },
      { id: "101_4", lat: 18.5139, lng: 73.8395 },
      { id: "101_5", lat: 18.5061, lng: 73.8411 },
      { id: "101_6", lat: 18.4968, lng: 73.8561 }
    ],
    schedule: ["06:00","06:15","06:30","06:45","07:00","07:15","07:30","07:45",
               "08:00","08:20","08:40","09:00","09:20","09:40","10:00","10:30",
               "11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30",
               "15:00","15:30","16:00","16:20","16:40","17:00","17:20","17:40",
               "18:00","18:20","18:40","19:00","19:30","20:00","20:30","21:00",
               "21:30","22:00"]
  },
  {
    id: "BUS_155",
    number: "155",
    color: "#8e44ad",
    frequency_min: 20,
    avg_speed_kmh: 13,
    stops: [
      { id: "155_1", lat: 18.4530, lng: 73.8678 },
      { id: "155_2", lat: 18.4670, lng: 73.8625 },
      { id: "155_3", lat: 18.4968, lng: 73.8561 },
      { id: "155_4", lat: 18.5010, lng: 73.8650 },
      { id: "155_5", lat: 18.5284, lng: 73.8742 },
      { id: "155_6", lat: 18.5150, lng: 73.8980 },
      { id: "155_7", lat: 18.5018, lng: 73.9260 }
    ],
    schedule: ["06:00","06:20","06:40","07:00","07:20","07:40","08:00","08:25",
               "08:50","09:15","09:40","10:00","10:30","11:00","11:30","12:00",
               "12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00",
               "16:20","16:40","17:00","17:25","17:50","18:15","18:40","19:05",
               "19:30","20:00","20:30","21:00","21:30","22:00"]
  },
  {
    id: "BUS_A1",
    number: "A1",
    color: "#e67e22",
    frequency_min: 30,
    avg_speed_kmh: 18,
    stops: [
      { id: "A1_1", lat: 18.6811, lng: 73.9039 },
      { id: "A1_2", lat: 18.7613, lng: 73.8677 },
      { id: "A1_3", lat: 18.6022, lng: 73.8833 },
      { id: "A1_4", lat: 18.5800, lng: 73.8869 },
      { id: "A1_5", lat: 18.5490, lng: 73.8930 },
      { id: "A1_6", lat: 18.5284, lng: 73.8742 }
    ],
    schedule: ["05:30","06:00","06:30","07:00","07:30","08:00","08:30","09:00",
               "09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00",
               "13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00",
               "17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00",
               "21:30","22:00"]
  }
];

// ============================================================
// TRAFFIC PATTERN
// ============================================================
const TRAFFIC_PATTERN = {
   0:1,1:1,2:1,3:1,4:1,5:1,
   6:2,7:3,8:3,9:3,10:2,11:2,
  12:2,13:2,14:2,15:2,16:3,17:3,
  18:3,19:3,20:2,21:2,22:1,23:1
};

function getCurrentTraffic() {
  return TRAFFIC_PATTERN[new Date().getHours()] || 2;
}

// ============================================================
// HAVERSINE
// ============================================================
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2-lat1)*Math.PI/180;
  const dLng = (lng2-lng1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2
          + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// ============================================================
// NEXT DEPARTURE — calculates when bus reaches stopIdx
// ============================================================
function getNextDeparture(bus, stopIdx) {
  const now = new Date();
  const currentMin = now.getHours()*60 + now.getMinutes();
  const traffic = getCurrentTraffic();

  let distToStop = 0;
  for (let i = 0; i < stopIdx; i++) {
    distToStop += haversine(bus.stops[i].lat, bus.stops[i].lng,
                            bus.stops[i+1].lat, bus.stops[i+1].lng);
  }
  const travelToStopMin = Math.round((distToStop / bus.avg_speed_kmh) * 60 * TRAFFIC_DELAY[traffic]);

  for (const timeStr of bus.schedule) {
    const [h, m] = timeStr.split(':').map(Number);
    const terminusMin = h*60 + m;
    const arrivalAtStopMin = terminusMin + travelToStopMin;
    if (arrivalAtStopMin > currentMin) {
      const waitMin = arrivalAtStopMin - currentMin;
      const arrH = Math.floor(arrivalAtStopMin/60) % 24;
      const arrM = arrivalAtStopMin % 60;
      return {
        waitMin,
        arrivalTimeStr: `${String(arrH).padStart(2,'0')}:${String(arrM).padStart(2,'0')}`
      };
    }
  }
  return { waitMin: null, arrivalTimeStr: "Next day " + bus.schedule[0] };
}

// ============================================================
// COMPUTE JOURNEY
// boardStopId and alightStopId are the global unique stop IDs
// ============================================================
function computeJourney(bus, boardStopId, alightStopId) {
  const boardIdx  = bus.stops.findIndex(s => s.id === boardStopId);
  const alightIdx = bus.stops.findIndex(s => s.id === alightStopId);

  if (boardIdx === -1 || alightIdx === -1) return null;
  if (boardIdx === alightIdx) return null;
  if (alightIdx < boardIdx) return null; // wrong direction

  const boardStop  = bus.stops[boardIdx];
  const alightStop = bus.stops[alightIdx];
  const traffic    = getCurrentTraffic();
  const delay      = TRAFFIC_DELAY[traffic];

  let routeDistKm = 0;
  for (let i = boardIdx; i < alightIdx; i++) {
    routeDistKm += haversine(bus.stops[i].lat, bus.stops[i].lng,
                             bus.stops[i+1].lat, bus.stops[i+1].lng);
  }
  routeDistKm = Math.round(routeDistKm * 10) / 10;

  const stopsBetween = alightIdx - boardIdx;
  const rawRideMins  = (routeDistKm / bus.avg_speed_kmh) * 60;
  const dwellMins    = stopsBetween * 1.5;
  const rideMin      = Math.max(2, Math.round((rawRideMins + dwellMins) * delay));

  const dep = getNextDeparture(bus, boardIdx);
  const now = new Date();
  const totalOnBusMins = (dep.waitMin || 0) + rideMin;
  const destArr = new Date(now.getTime() + totalOnBusMins * 60000);
  const destH = destArr.getHours();
  const destM = destArr.getMinutes();
  const destTimeStr = `${String(destH).padStart(2,'0')}:${String(destM).padStart(2,'0')}`;

  return {
    bus,
    boardStop,
    alightStop,
    boardIdx,
    alightIdx,
    stopsBetween,
    routeDistKm,
    rideMin,
    waitMin:        dep.waitMin,
    busArrivalTime: dep.arrivalTimeStr,
    totalMin:       (dep.waitMin || 0) + rideMin,
    destTimeStr,
    trafficLevel:   traffic,
    noMoreBusToday: dep.waitMin === null
  };
}
