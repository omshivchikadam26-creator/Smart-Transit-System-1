// ============================================================
// PUNERIDE — script.js  (v4 with animated bus)
// ============================================================

let map;
let boardStopId  = null;
let alightStopId = null;
let selectedBusId = null;

// Map layers
let routePolyline  = null;
let routeDash      = null;
const stopMarkers  = [];
let boardMarker    = null;
let alightMarker   = null;

// Animated bus
let animBusMarker  = null;   // the moving 🚌 marker
let animFrame      = null;   // requestAnimationFrame id
let animStops      = [];     // array of [lat,lng] waypoints for animation
let animIndex      = 0;      // current waypoint index
let animT          = 0;      // interpolation 0..1 between waypoints
let animSpeed      = 0.004;  // fraction of segment per frame (tuned for realism)
let animBusId      = null;   // which bus is being animated

// All unique stops
const ALL_STOPS = (function() {
  const seen = new Set(), list = [];
  BUS_DATA.forEach(bus => {
    bus.stops.forEach(stop => {
      if (!seen.has(stop.name)) {
        seen.add(stop.name);
        list.push({ id: stop.id, name: stop.name, lat: stop.lat, lng: stop.lng });
      }
    });
  });
  return list.sort((a,b) => a.name.localeCompare(b.name));
})();

// ============================================================
// INIT
// ============================================================
window.addEventListener('load', () => {
  initMap();
  renderStopList('board', ALL_STOPS);
  updateTopBar();
  setInterval(updateTopBar, 30000);
  startClock();
});

// ============================================================
// MAP INIT
// ============================================================
function initMap() {
  map = L.map('map', { zoomControl: true }).setView([18.5200, 73.8553], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, attribution: '© OpenStreetMap'
  }).addTo(map);

  // Draw all stops as faint grey circles
  ALL_STOPS.forEach(stop => {
    L.circleMarker([stop.lat, stop.lng], {
      radius: 5, color: '#666', fillColor: '#fff', fillOpacity: 1, weight: 1.5
    }).addTo(map).bindTooltip(stop.name, { direction: 'top', opacity: 0.9 });
  });
}

// ============================================================
// LIVE CLOCK + TOP BAR
// ============================================================
function startClock() {
  function tick() {
    const now = new Date();
    const hh  = String(now.getHours()).padStart(2,'0');
    const mm  = String(now.getMinutes()).padStart(2,'0');
    const ss  = String(now.getSeconds()).padStart(2,'0');
    const el  = document.getElementById('msb-time');
    if (el) el.textContent = `${hh}:${mm}:${ss}`;
  }
  tick();
  setInterval(tick, 1000);
}

function updateTopBar() {
  const t      = getCurrentTraffic();
  const colors = { 1:'#27ae60', 2:'#f59e0b', 3:'#e53935' };
  const labels = { 1: TRAFFIC_LABELS[1], 2: TRAFFIC_LABELS[2], 3: TRAFFIC_LABELS[3] };
  const el     = document.getElementById('msb-traffic');
  if (el) {
    el.textContent  = labels[t];
    el.style.color  = colors[t];
  }
}

// ============================================================
// STOP LIST RENDERING
// ============================================================
function renderStopList(which, stops) {
  const el = document.getElementById(which + '-stop-list');
  el.innerHTML = '';
  if (!stops.length) {
    el.innerHTML = '<div class="no-stops">No stops found.</div>';
    return;
  }
  stops.forEach(stop => {
    const div = document.createElement('div');
    div.className = 'stop-item';
    const routes = getRoutesForStop(stop.name);
    div.innerHTML = `
      <div class="stop-icon">🚏</div>
      <div>
        <div class="stop-name">${stop.name}</div>
        ${routes ? `<div class="stop-routes">${routes}</div>` : ''}
      </div>`;
    div.onclick = () => selectStop(which, stop);
    el.appendChild(div);
  });
}

function getRoutesForStop(name) {
  const buses = BUS_DATA.filter(b => b.stops.some(s => s.name === name));
  return buses.length ? 'Bus: ' + buses.map(b => b.number).join(', ') : '';
}

function filterStops(which) {
  const q = document.getElementById(which + '-search').value.toLowerCase();
  renderStopList(which, ALL_STOPS.filter(s => s.name.toLowerCase().includes(q)));
}

// ============================================================
// SELECT STOP
// ============================================================
function selectStop(which, stop) {
  if (which === 'board') {
    boardStopId = stop.id;
    document.getElementById('board-selected-name').textContent = stop.name;
    document.getElementById('from-label').textContent = stop.name;

    if (boardMarker) map.removeLayer(boardMarker);
    boardMarker = L.marker([stop.lat, stop.lng], { icon: makeIcon('#e53935','A') })
      .addTo(map)
      .bindPopup(`<b>Boarding Stop</b><br>${stop.name}`)
      .openPopup();
    map.setView([stop.lat, stop.lng], 14);

    show('section-alight'); hide('section-board');
    renderStopList('alight', ALL_STOPS.filter(s => s.name !== stop.name));

  } else {
    alightStopId = stop.id;
    document.getElementById('to-label').textContent = stop.name;

    if (alightMarker) map.removeLayer(alightMarker);
    alightMarker = L.marker([stop.lat, stop.lng], { icon: makeIcon('#27ae60','B') })
      .addTo(map)
      .bindPopup(`<b>Destination Stop</b><br>${stop.name}`)
      .openPopup();

    show('section-buses'); hide('section-alight');
    findBuses();
  }
}

// ============================================================
// GPS
// ============================================================
function useGPS() {
  if (!navigator.geolocation) { alert('Geolocation not supported.'); return; }
  const btn     = document.getElementById('gps-btn');
  const span    = btn.querySelector('span');
  span.textContent = '📍 Locating…';
  btn.disabled  = true;

  navigator.geolocation.getCurrentPosition(
    pos => {
      span.textContent = window.t ? t('gps_btn') : '📍 GPS';
      btn.disabled = false;
      const { latitude: lat, longitude: lng } = pos.coords;
      let nearest = null, minD = Infinity;
      ALL_STOPS.forEach(s => {
        const d = haversine(lat, lng, s.lat, s.lng);
        if (d < minD) { minD = d; nearest = s; }
      });
      if (nearest && minD < 3) selectStop('board', nearest);
      else alert('No stop within 3 km. Please select from the list.');
    },
    () => {
      span.textContent = window.t ? t('gps_btn') : '📍 GPS';
      btn.disabled = false;
      alert('GPS unavailable. Please select your stop from the list.');
    }
  );
}

// ============================================================
// FIND BUSES
// ============================================================
function findBuses() {
  stopBusAnimation();
  clearRouteFromMap();
  const resultsEl = document.getElementById('bus-results');
  resultsEl.innerHTML = '';

  const boardName  = getStopName(boardStopId);
  const alightName = getStopName(alightStopId);
  const journeys   = [];

  BUS_DATA.forEach(bus => {
    const boardStop  = bus.stops.find(s => s.id === boardStopId  || s.name === boardName);
    const alightStop = bus.stops.find(s => s.id === alightStopId || s.name === alightName);
    if (!boardStop || !alightStop) return;
    const bi = bus.stops.indexOf(boardStop);
    const ai = bus.stops.indexOf(alightStop);
    if (ai <= bi) return;
    const journey = computeJourney(bus, boardStop.id, alightStop.id);
    if (journey) journeys.push(journey);
  });

  if (!journeys.length) {
    resultsEl.innerHTML = `
      <div class="no-bus-msg">
        <div class="no-bus-icon">🚫</div>
        <div class="no-bus-title">${window.t ? t('no_bus_title') : 'No direct bus found'}</div>
        <div class="no-bus-sub">${window.t ? t('no_bus_sub') : 'No bus runs directly between these stops.'}</div>
        <button class="btn-reset" onclick="resetAll()" style="margin-top:14px">${window.t ? t('try_diff') : 'Try different stops'}</button>
      </div>`;
    return;
  }

  journeys.sort((a,b) => a.totalMin - b.totalMin);

  journeys.forEach((j, idx) => {
    const card    = document.createElement('div');
    card.className = 'bus-card' + (idx === 0 ? ' best' : '');
    card.id        = 'bus-card-' + j.bus.id;
    const tColor   = TRAFFIC_COLORS[j.trafficLevel];
    const noMore   = j.noMoreBusToday;

    card.innerHTML = `
      ${idx === 0 ? `<div class="best-badge">${window.t ? t('fastest_badge') : 'Fastest'}</div>` : ''}
      <div class="bus-card-top">
        <div class="bus-number" style="background:${j.bus.color}">${j.bus.number}</div>
        <div class="bus-info">
          <div class="bus-name">${j.bus.name}</div>
          <div class="bus-meta">${j.stopsBetween} stops · ${j.routeDistKm} km</div>
        </div>
        <div class="bus-eta-mini">
          <div class="eta-mins">${j.totalMin}<span>min</span></div>
          <div class="eta-arrive">${noMore ? 'No more buses' : 'Arrive ' + j.destTimeStr}</div>
        </div>
      </div>
      <div class="bus-breakdown">
        <div class="bk-row"><span class="bk-icon">⏳</span><span>${noMore ? 'No more buses today' : 'Bus at stop: ' + j.busArrivalTime + ' · wait ' + j.waitMin + ' min'}</span></div>
        <div class="bk-row"><span class="bk-icon">🚌</span><span>Ride ${j.rideMin} min · ${j.stopsBetween} stops · ${j.routeDistKm} km</span></div>
        <div class="bk-row" style="color:${tColor}"><span class="bk-icon">🚦</span><span>${TRAFFIC_LABELS[j.trafficLevel]}</span></div>
      </div>
      <button class="btn-select-bus" onclick="selectBus('${j.bus.id}')">${window.t ? t('view_map_btn') : 'View on map →'}</button>`;
    resultsEl.appendChild(card);
  });

  selectBus(journeys[0].bus.id);
}

function getStopName(id) {
  for (const bus of BUS_DATA) {
    const s = bus.stops.find(s => s.id === id);
    if (s) return s.name;
  }
  return null;
}

// ============================================================
// SELECT BUS — draw route + start animation
// ============================================================
function selectBus(busId) {
  selectedBusId = busId;
  const bus = BUS_DATA.find(b => b.id === busId);
  if (!bus) return;

  document.querySelectorAll('.bus-card').forEach(c => c.classList.remove('selected-card'));
  const card = document.getElementById('bus-card-' + busId);
  if (card) card.classList.add('selected-card');

  const boardName  = getStopName(boardStopId);
  const alightName = getStopName(alightStopId);
  const boardStop  = bus.stops.find(s => s.id === boardStopId  || s.name === boardName);
  const alightStop = bus.stops.find(s => s.id === alightStopId || s.name === alightName);
  if (!boardStop || !alightStop) return;

  drawRouteOnMap(bus, boardStop, alightStop);

  const journey = computeJourney(bus, boardStop.id, alightStop.id);
  if (journey) {
    show('section-eta');
    renderETA(journey);
    const el = document.getElementById('msb-route');
    if (el) el.textContent = `Bus ${bus.number}`;
    const etaEl = document.getElementById('msb-eta');
    if (etaEl) etaEl.textContent = journey.totalMin + ' min';
  }

  // Start animated bus
  startBusAnimation(bus, boardStop, alightStop);
}

// ============================================================
// DRAW ROUTE ON MAP
// ============================================================
function drawRouteOnMap(bus, boardStop, alightStop) {
  clearRouteFromMap();

  const allCoords    = bus.stops.map(s => [s.lat, s.lng]);
  const boardIdx     = bus.stops.indexOf(boardStop);
  const alightIdx    = bus.stops.indexOf(alightStop);
  const activeCoords = bus.stops.slice(boardIdx, alightIdx+1).map(s => [s.lat, s.lng]);

  // Full route greyed
  L.polyline(allCoords, { color:'#aaa', weight:3, opacity:0.35 }).addTo(map);

  // Active segment — bus color, thick
  routePolyline = L.polyline(activeCoords, {
    color: bus.color, weight: 8, opacity: 0.9, lineJoin:'round', lineCap:'round'
  }).addTo(map);

  // White dashes overlay
  routeDash = L.polyline(activeCoords, {
    color:'#fff', weight:2, opacity:0.45, dashArray:'8 14'
  }).addTo(map);

  // Stop circles
  bus.stops.forEach((stop, idx) => {
    let fillColor = '#94a3b8', radius = 6;
    if (stop.id === boardStop.id)       { fillColor = '#e53935'; radius = 12; }
    else if (stop.id === alightStop.id) { fillColor = '#27ae60'; radius = 12; }
    else if (idx > boardIdx && idx < alightIdx) { fillColor = bus.color; radius = 7; }

    const m = L.circleMarker([stop.lat, stop.lng], {
      radius, color:'#fff', fillColor, fillOpacity:1, weight:2
    }).addTo(map)
      .bindTooltip(
        `<b>${stop.name}</b>${stop.id === boardStop.id ? '<br>🔴 Board here' : stop.id === alightStop.id ? '<br>🟢 Get off here' : ''}`,
        { direction:'top', opacity:0.97 }
      );
    stopMarkers.push(m);
  });

  // Fit map
  const bounds = L.latLngBounds(activeCoords);
  if (boardMarker)  bounds.extend(boardMarker.getLatLng());
  if (alightMarker) bounds.extend(alightMarker.getLatLng());
  map.fitBounds(bounds, { padding:[60,80] });
}

function clearRouteFromMap() {
  if (routePolyline) { map.removeLayer(routePolyline); routePolyline = null; }
  if (routeDash)     { map.removeLayer(routeDash);     routeDash = null; }
  stopMarkers.forEach(m => { if(m) map.removeLayer(m); });
  stopMarkers.length = 0;
  map.eachLayer(layer => {
    if (layer instanceof L.Polyline) map.removeLayer(layer);
  });
}

// ============================================================
// ANIMATED BUS — smooth movement along the route
// The bus starts before the boarding stop (simulating approach)
// then travels through all active stops to the alighting stop
// ============================================================
function startBusAnimation(bus, boardStop, alightStop) {
  stopBusAnimation();

  const boardIdx  = bus.stops.indexOf(boardStop);
  const alightIdx = bus.stops.indexOf(alightStop);

  // Build dense waypoints by interpolating between stops
  // (more points = smoother animation)
  const rawCoords = bus.stops.slice(
    Math.max(0, boardIdx - 1),   // start one stop before boarding (approach)
    alightIdx + 1
  ).map(s => [s.lat, s.lng]);

  // Densify: insert intermediate points between each stop pair
  animStops = [];
  for (let i = 0; i < rawCoords.length - 1; i++) {
    const [lat1, lng1] = rawCoords[i];
    const [lat2, lng2] = rawCoords[i+1];
    const STEPS = 40; // intermediate points per segment
    for (let j = 0; j <= STEPS; j++) {
      const f = j / STEPS;
      animStops.push([
        lat1 + (lat2 - lat1) * f,
        lng1 + (lng2 - lng1) * f
      ]);
    }
  }

  animIndex  = 0;
  animBusId  = bus.id;

  // Traffic adjusts speed: heavy = slower
  const traffic = getCurrentTraffic();
  animSpeed = traffic === 3 ? 0.002 : traffic === 2 ? 0.003 : 0.005;

  // Create the animated bus marker
  if (animBusMarker) map.removeLayer(animBusMarker);
  animBusMarker = L.marker(animStops[0], {
    icon: makeBusIcon(bus),
    zIndexOffset: 2000
  }).addTo(map)
    .bindPopup(`<b>Bus ${bus.number}</b><br>${bus.name}<br><i>Simulated live position</i>`);

  // Show animation status bar
  show('anim-status');
  const subEl = document.getElementById('anim-sub');
  if (subEl) subEl.textContent = `Bus ${bus.number} · ${bus.name}`;

  // Run animation loop
  let lastTime = null;
  function step(ts) {
    if (!lastTime) lastTime = ts;
    const delta = (ts - lastTime) / 16.67; // normalize to 60fps
    lastTime = ts;

    animIndex += animSpeed * delta;

    if (animIndex >= animStops.length - 1) {
      // Reached destination — loop back to start
      animIndex = 0;
    }

    const idx   = Math.floor(animIndex);
    const frac  = animIndex - idx;
    const next  = Math.min(idx + 1, animStops.length - 1);

    const lat = animStops[idx][0] + (animStops[next][0] - animStops[idx][0]) * frac;
    const lng = animStops[idx][1] + (animStops[next][1] - animStops[idx][1]) * frac;

    if (animBusMarker) animBusMarker.setLatLng([lat, lng]);

    animFrame = requestAnimationFrame(step);
  }

  animFrame = requestAnimationFrame(step);
}

function stopBusAnimation() {
  if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
  if (animBusMarker) { map.removeLayer(animBusMarker); animBusMarker = null; }
  animStops = []; animIndex = 0;
  hide('anim-status');
}

function makeBusIcon(bus) {
  return L.divIcon({
    className: '',
    html: `<div style="
      background:${bus.color};
      color:#fff;
      border-radius:10px;
      padding:5px 12px;
      font-family:'Mukta','Noto Sans Devanagari',sans-serif;
      font-size:14px;
      font-weight:700;
      box-shadow:0 3px 12px rgba(0,0,0,0.35);
      white-space:nowrap;
      border:2px solid #fff;
      display:flex;align-items:center;gap:5px;
    "><span style="font-size:16px">🚌</span>${bus.number}</div>`,
    iconSize: [72, 32],
    iconAnchor: [36, 16]
  });
}

// ============================================================
// RENDER ETA
// ============================================================
function renderETA(j) {
  const el     = document.getElementById('eta-result');
  const tColor = TRAFFIC_COLORS[j.trafficLevel];
  const noMore = j.noMoreBusToday;

  el.innerHTML = `
    <div class="eta-hero">
      <div>
        <div class="eta-big">${j.totalMin}</div>
        <div class="eta-unit">${window.t ? t('eta_unit') : 'minutes on bus'}</div>
      </div>
      <div class="eta-arrive-box">
        <div class="eta-arrive-label">${window.t ? t('arrive_label') : 'Arrive at stop'}</div>
        <div class="eta-arrive-time">${noMore ? '—' : j.destTimeStr}</div>
      </div>
    </div>

    <div class="journey-timeline">
      <div class="tl-step">
        <div class="tl-dot" style="background:#f59e0b"></div>
        <div class="tl-content">
          <div class="tl-title">${window.t ? t('wait_for') : 'Wait for Bus'} ${j.bus.number}</div>
          <div class="tl-sub">${noMore ? 'No more buses today' : 'Arrives at ' + j.busArrivalTime + ' · wait ' + j.waitMin + ' min'}</div>
        </div>
        <div class="tl-time">${noMore ? '—' : j.waitMin + ' min'}</div>
      </div>
      <div class="tl-line"></div>
      <div class="tl-step">
        <div class="tl-dot" style="background:${j.bus.color}"></div>
        <div class="tl-content">
          <div class="tl-title">${window.t ? t('board_at') : 'Board at'} ${j.boardStop.name}</div>
          <div class="tl-sub">${j.stopsBetween} stops · ${j.routeDistKm} km</div>
        </div>
        <div class="tl-time">${j.rideMin} min</div>
      </div>
      <div class="tl-line"></div>
      <div class="tl-step">
        <div class="tl-dot" style="background:#27ae60"></div>
        <div class="tl-content">
          <div class="tl-title">${window.t ? t('alight_at') : 'Alight at'} ${j.alightStop.name}</div>
          <div class="tl-sub">${noMore ? '—' : 'Arrive ' + j.destTimeStr}</div>
        </div>
        <div class="tl-time">${noMore ? '—' : j.destTimeStr}</div>
      </div>
    </div>

    <div class="traffic-info-row" style="border-color:${tColor};color:${tColor}">
      <span>● ${TRAFFIC_LABELS[j.trafficLevel]}</span>
      <span style="font-size:12px;font-weight:400;color:#777">${window.t ? t('eta_adjusted') : 'ETA adjusted for traffic'}</span>
    </div>

    <button class="btn-reset" onclick="resetAll()">← ${window.t ? t('new_journey') : 'New Journey'}</button>
  `;
}

// ============================================================
// RESET
// ============================================================
function resetToStep1() {
  boardStopId = null; alightStopId = null;
  if (boardMarker)  { map.removeLayer(boardMarker);  boardMarker  = null; }
  if (alightMarker) { map.removeLayer(alightMarker); alightMarker = null; }
  stopBusAnimation();
  clearRouteFromMap();
  document.getElementById('board-search').value = '';
  renderStopList('board', ALL_STOPS);
  show('section-board');
  hide('section-alight'); hide('section-buses'); hide('section-eta');
  const r = document.getElementById('msb-route'); if(r) r.textContent = 'Select stops';
  const e = document.getElementById('msb-eta');   if(e) e.textContent = '—';
  map.setView([18.5200, 73.8553], 12);
}
function resetToStep2() {
  alightStopId = null;
  if (alightMarker) { map.removeLayer(alightMarker); alightMarker = null; }
  stopBusAnimation();
  clearRouteFromMap();
  hide('section-buses'); hide('section-eta');
  document.getElementById('alight-search').value = '';
  renderStopList('alight', ALL_STOPS.filter(s => s.name !== getStopName(boardStopId)));
  show('section-alight');
}
function resetAll() { resetToStep1(); }

// ============================================================
// HELPERS
// ============================================================
function show(id) { document.getElementById(id).classList.remove('hidden'); }
function hide(id) { document.getElementById(id).classList.add('hidden'); }

function makeIcon(color, label) {
  return L.divIcon({
    className: '',
    html: `<div style="
      background:${color};color:#fff;border-radius:50%;
      width:36px;height:36px;display:flex;align-items:center;justify-content:center;
      font-size:15px;font-weight:800;border:3px solid #fff;
      box-shadow:0 2px 10px rgba(0,0,0,0.3);
      font-family:'Mukta',sans-serif;">${label}</div>`,
    iconSize:[36,36], iconAnchor:[18,18]
  });
}
