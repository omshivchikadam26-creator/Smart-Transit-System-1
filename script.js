// ============================================================
// SMART TRANSIT SYSTEM — script.js
// All dynamic text uses t(), stopName(), busName(), trafficLabel()
// ============================================================

let map;
let boardStopId  = null;
let alightStopId = null;
let selectedBusId = null;

let routePolyline = null, routeDash = null;
const stopMarkers = [];
let boardMarker = null, alightMarker = null;

// Animated bus
let animBusMarker = null;
let animFrame     = null;
let animStops     = [];
let animIndex     = 0;
let animSpeed     = 0.003;

// Build ALL_STOPS from BUS_DATA using unique stop IDs
// Each entry: { id, lat, lng } — name comes from stopName(id) at render time
const ALL_STOPS = (function() {
  const seen = new Set(), list = [];
  BUS_DATA.forEach(bus => {
    bus.stops.forEach(stop => {
      if (!seen.has(stop.id)) {
        seen.add(stop.id);
        list.push({ id: stop.id, lat: stop.lat, lng: stop.lng });
      }
    });
  });
  // Sort by English name for consistent ordering
  return list.sort((a,b) => (STOP_NAMES[a.id]?.en || '').localeCompare(STOP_NAMES[b.id]?.en || ''));
})();

// ============================================================
// INIT
// ============================================================
window.addEventListener('load', () => {
  initMap();
  renderStopList('board', ALL_STOPS);
  updateTopBar();
  startClock();
  setInterval(updateTopBar, 60000);
});

// ============================================================
// MAP
// ============================================================
function initMap() {
  map = L.map('map', { zoomControl: true }).setView([18.5200, 73.8553], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, attribution: '© OpenStreetMap'
  }).addTo(map);

  // Show all stops as faint grey circles; tooltip uses stopName()
  ALL_STOPS.forEach(stop => {
    L.circleMarker([stop.lat, stop.lng], {
      radius: 5, color: '#666', fillColor: '#fff', fillOpacity: 1, weight: 1.5
    }).addTo(map).bindTooltip(() => stopName(stop.id), { direction: 'top', opacity: 0.9 });
  });
}

function startClock() {
  function tick() {
    const now = new Date();
    const el  = document.getElementById('msb-time');
    if (el) el.textContent = now.toLocaleTimeString('en-IN');
  }
  tick(); setInterval(tick, 1000);
}

function updateTopBar() {
  const traffic  = getCurrentTraffic();
  const colors   = { 1:'#27ae60', 2:'#f59e0b', 3:'#e53935' };
  const el       = document.getElementById('msb-traffic');
  if (el) { el.textContent = trafficLabel(traffic); el.style.color = colors[traffic]; }
}

// ============================================================
// STOP LIST — re-render with current language names
// ============================================================
function renderStopList(which, stops) {
  const el = document.getElementById(which + '-stop-list');
  if (!el) return;
  el.innerHTML = '';

  if (!stops.length) {
    el.innerHTML = `<div class="no-stops">${t('no_stops_found')}</div>`;
    return;
  }

  // Sort by current-language name each time
  const sorted = [...stops].sort((a,b) => stopName(a.id).localeCompare(stopName(b.id)));

  sorted.forEach(stop => {
    const sName  = stopName(stop.id);
    const routes = getRoutesForStop(stop.id);
    const div    = document.createElement('div');
    div.className = 'stop-item';
    div.innerHTML = `
      <div class="stop-icon">🚏</div>
      <div>
        <div class="stop-name">${sName}</div>
        ${routes ? `<div class="stop-routes">${routes}</div>` : ''}
      </div>`;
    div.onclick = () => selectStop(which, stop);
    el.appendChild(div);
  });
}

function getRoutesForStop(stopId) {
  const buses = BUS_DATA.filter(b => b.stops.some(s => s.id === stopId));
  if (!buses.length) return '';
  const label = t('bus_label') || 'Bus';
  return label + ': ' + buses.map(b => b.number).join(', ');
}

function filterStops(which) {
  const q = document.getElementById(which + '-search').value.toLowerCase().trim();
  const filtered = ALL_STOPS.filter(s => stopName(s.id).toLowerCase().includes(q));
  renderStopList(which, filtered);
}

// Re-render stop lists when language changes (called from i18n.js via hook)
function onLangChange() {
  // Re-render visible stop lists
  if (!document.getElementById('section-board').classList.contains('hidden')) {
    const q = document.getElementById('board-search')?.value?.toLowerCase() || '';
    renderStopList('board', ALL_STOPS.filter(s => stopName(s.id).toLowerCase().includes(q)));
  }
  if (!document.getElementById('section-alight')?.classList.contains('hidden')) {
    const q = document.getElementById('alight-search')?.value?.toLowerCase() || '';
    const others = ALL_STOPS.filter(s => s.id !== boardStopId
      && stopName(s.id).toLowerCase().includes(q));
    renderStopList('alight', others);
  }
  // Update selected stop names
  if (boardStopId) {
    const el1 = document.getElementById('board-selected-name');
    const el2 = document.getElementById('from-label');
    if (el1) el1.textContent = stopName(boardStopId);
    if (el2) el2.textContent = stopName(boardStopId);
  }
  if (alightStopId) {
    const el = document.getElementById('to-label');
    if (el) el.textContent = stopName(alightStopId);
  }
  // Re-render bus results and ETA if visible
  if (boardStopId && alightStopId &&
      !document.getElementById('section-buses').classList.contains('hidden')) {
    findBuses();
  }
  // Update top bar traffic
  updateTopBar();
  // Update map stop tooltips (they are dynamic functions so auto-update)
  // Update msb-route
  if (selectedBusId) {
    const el = document.getElementById('msb-route');
    if (el) el.textContent = 'Bus ' + BUS_DATA.find(b => b.id === selectedBusId)?.number;
  }
}

// ============================================================
// SELECT STOP
// ============================================================
function selectStop(which, stop) {
  const sName = stopName(stop.id);

  if (which === 'board') {
    boardStopId = stop.id;
    const el1 = document.getElementById('board-selected-name');
    const el2 = document.getElementById('from-label');
    if (el1) el1.textContent = sName;
    if (el2) el2.textContent = sName;

    if (boardMarker) map.removeLayer(boardMarker);
    boardMarker = L.marker([stop.lat, stop.lng], { icon: makeIcon('#e53935','A') })
      .addTo(map)
      .bindPopup(`<b>${t('boarding_at')}</b><br>${sName}`)
      .openPopup();
    map.setView([stop.lat, stop.lng], 14);

    show('section-alight'); hide('section-board');
    renderStopList('alight', ALL_STOPS.filter(s => s.id !== stop.id));

  } else {
    alightStopId = stop.id;
    const el = document.getElementById('to-label');
    if (el) el.textContent = sName;

    if (alightMarker) map.removeLayer(alightMarker);
    alightMarker = L.marker([stop.lat, stop.lng], { icon: makeIcon('#27ae60','B') })
      .addTo(map)
      .bindPopup(`<b>${t('alight_at')}</b><br>${sName}`)
      .openPopup();

    show('section-buses'); hide('section-alight');
    findBuses();
  }
}

// ============================================================
// GPS
// ============================================================
function useGPS() {
  if (!navigator.geolocation) { alert(t('gps_not_supported') || 'Geolocation not supported.'); return; }
  const btn  = document.getElementById('gps-btn');
  const span = btn?.querySelector('span');
  if (span) span.textContent = t('gps_locating');
  if (btn) btn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    pos => {
      if (span) span.textContent = t('gps_btn');
      if (btn) btn.disabled = false;
      const { latitude: lat, longitude: lng } = pos.coords;
      let nearest = null, minD = Infinity;
      ALL_STOPS.forEach(s => {
        const d = haversine(lat, lng, s.lat, s.lng);
        if (d < minD) { minD = d; nearest = s; }
      });
      if (nearest && minD < 5) {
        selectStop('board', nearest);
        map.setView([lat, lng], 14);
      } else {
        alert(t('gps_no_stop') || 'No stop found within 5 km. Please select from the list.');
      }
    },
    () => {
      if (span) span.textContent = t('gps_btn');
      if (btn) btn.disabled = false;
      alert(t('gps_unavailable') || 'GPS unavailable. Please select your stop from the list.');
    }
  );
}

// ============================================================
// FIND BUSES — match strictly by stop ID
// ============================================================
function findBuses() {
  stopBusAnimation();
  clearRouteFromMap();
  const resultsEl = document.getElementById('bus-results');
  if (!resultsEl) return;
  resultsEl.innerHTML = '';

  const journeys = [];

  BUS_DATA.forEach(bus => {
    const journey = computeJourney(bus, boardStopId, alightStopId);
    if (journey) journeys.push(journey);
  });

  if (!journeys.length) {
    resultsEl.innerHTML = `
      <div class="no-bus-msg">
        <div class="no-bus-icon">🚫</div>
        <div class="no-bus-title">${t('no_bus_title')}</div>
        <div class="no-bus-sub">${t('no_bus_sub')}</div>
        <button class="btn-reset" onclick="resetAll()" style="margin-top:14px">${t('try_diff')}</button>
      </div>`;
    return;
  }

  journeys.sort((a,b) => a.totalMin - b.totalMin);

  journeys.forEach((j, idx) => {
    const card = document.createElement('div');
    card.className = 'bus-card' + (idx === 0 ? ' best' : '');
    card.id = 'bus-card-' + j.bus.id;

    const tColor  = TRAFFIC_COLORS[j.trafficLevel];
    const noMore  = j.noMoreBusToday;
    const bName   = busName(j.bus.id);
    const tLabel  = trafficLabel(j.trafficLevel);
    const stopsLbl = t('stops_label');
    const rideLbl  = t('ride_label');
    const waitLbl  = t('wait_for');
    const arriveLbl= t('arrive_time');
    const viewLbl  = t('view_map_btn');
    const fastLbl  = t('fastest_badge');
    const noMoreLbl= t('no_more_buses');

    card.innerHTML = `
      ${idx === 0 ? `<div class="best-badge">${fastLbl}</div>` : ''}
      <div class="bus-card-top">
        <div class="bus-number" style="background:${j.bus.color}">${j.bus.number}</div>
        <div class="bus-info">
          <div class="bus-name">${bName}</div>
          <div class="bus-meta">${j.stopsBetween} ${stopsLbl} · ${j.routeDistKm} km</div>
        </div>
        <div class="bus-eta-mini">
          <div class="eta-mins">${j.totalMin}<span>min</span></div>
          <div class="eta-arrive">${noMore ? noMoreLbl : arriveLbl + ' ' + j.destTimeStr}</div>
        </div>
      </div>
      <div class="bus-breakdown">
        <div class="bk-row"><span class="bk-icon">⏳</span>
          <span>${noMore ? noMoreLbl : waitLbl + ' ' + j.bus.number + ' · ' + j.busArrivalTime + ' (' + j.waitMin + ' min)'}</span>
        </div>
        <div class="bk-row"><span class="bk-icon">🚌</span>
          <span>${rideLbl} ${j.rideMin} min · ${j.stopsBetween} ${stopsLbl} · ${j.routeDistKm} km</span>
        </div>
        <div class="bk-row" style="color:${tColor}"><span class="bk-icon">🚦</span>
          <span>${tLabel}</span>
        </div>
      </div>
      <button class="btn-select-bus" onclick="selectBus('${j.bus.id}')">${viewLbl}</button>`;
    resultsEl.appendChild(card);
  });

  selectBus(journeys[0].bus.id);
}

// ============================================================
// SELECT BUS
// ============================================================
function selectBus(busId) {
  selectedBusId = busId;
  const bus = BUS_DATA.find(b => b.id === busId);
  if (!bus) return;

  document.querySelectorAll('.bus-card').forEach(c => c.classList.remove('selected-card'));
  const card = document.getElementById('bus-card-' + busId);
  if (card) card.classList.add('selected-card');

  const boardStop  = bus.stops.find(s => s.id === boardStopId);
  const alightStop = bus.stops.find(s => s.id === alightStopId);
  if (!boardStop || !alightStop) return;

  drawRouteOnMap(bus, boardStop, alightStop);

  const journey = computeJourney(bus, boardStopId, alightStopId);
  if (journey) {
    show('section-eta');
    renderETA(journey);
    const el = document.getElementById('msb-route');
    if (el) el.textContent = 'Bus ' + bus.number;
    const etaEl = document.getElementById('msb-eta');
    if (etaEl) etaEl.textContent = journey.totalMin + ' min';
  }

  startBusAnimation(bus, boardStop, alightStop);
}

// ============================================================
// DRAW ROUTE
// ============================================================
function drawRouteOnMap(bus, boardStop, alightStop) {
  clearRouteFromMap();

  const allCoords    = bus.stops.map(s => [s.lat, s.lng]);
  const boardIdx     = bus.stops.indexOf(boardStop);
  const alightIdx    = bus.stops.indexOf(alightStop);
  const activeCoords = bus.stops.slice(boardIdx, alightIdx+1).map(s => [s.lat, s.lng]);

  L.polyline(allCoords, { color:'#aaa', weight:3, opacity:0.35 }).addTo(map);
  routePolyline = L.polyline(activeCoords, {
    color: bus.color, weight: 8, opacity: 0.9, lineJoin:'round', lineCap:'round'
  }).addTo(map);
  routeDash = L.polyline(activeCoords, {
    color:'#fff', weight:2, opacity:0.45, dashArray:'8 14'
  }).addTo(map);

  bus.stops.forEach((stop, idx) => {
    let fillColor = '#94a3b8', radius = 6;
    if (stop.id === boardStop.id)       { fillColor = '#e53935'; radius = 12; }
    else if (stop.id === alightStop.id) { fillColor = '#27ae60'; radius = 12; }
    else if (idx > boardIdx && idx < alightIdx) { fillColor = bus.color; radius = 7; }

    const sName = stopName(stop.id);
    const isBoardLbl  = stop.id === boardStop.id  ? '<br>🔴 ' + t('leg_board')  : '';
    const isAlightLbl = stop.id === alightStop.id ? '<br>🟢 ' + t('leg_alight') : '';

    const m = L.circleMarker([stop.lat, stop.lng], {
      radius, color:'#fff', fillColor, fillOpacity:1, weight:2
    }).addTo(map)
      .bindTooltip(`<b>${sName}</b>${isBoardLbl}${isAlightLbl}`,
        { direction:'top', opacity:0.97 });
    stopMarkers.push(m);
  });

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
  map.eachLayer(layer => { if (layer instanceof L.Polyline) map.removeLayer(layer); });
}

// ============================================================
// ANIMATED BUS
// ============================================================
function startBusAnimation(bus, boardStop, alightStop) {
  stopBusAnimation();

  const boardIdx  = bus.stops.indexOf(boardStop);
  const alightIdx = bus.stops.indexOf(alightStop);
  const rawCoords = bus.stops.slice(
    Math.max(0, boardIdx - 1), alightIdx + 1
  ).map(s => [s.lat, s.lng]);

  animStops = [];
  for (let i = 0; i < rawCoords.length - 1; i++) {
    const [la1, ln1] = rawCoords[i];
    const [la2, ln2] = rawCoords[i+1];
    const STEPS = 40;
    for (let j = 0; j <= STEPS; j++) {
      const f = j / STEPS;
      animStops.push([la1+(la2-la1)*f, ln1+(ln2-ln1)*f]);
    }
  }

  animIndex = 0;
  const traffic = getCurrentTraffic();
  animSpeed = traffic === 3 ? 0.002 : traffic === 2 ? 0.003 : 0.005;

  if (animBusMarker) map.removeLayer(animBusMarker);
  animBusMarker = L.marker(animStops[0], {
    icon: makeBusIcon(bus), zIndexOffset: 2000
  }).addTo(map)
    .bindPopup(`<b>${t('bus_label')||'Bus'} ${bus.number}</b><br>${busName(bus.id)}`);

  show('anim-status');
  const subEl = document.getElementById('anim-sub');
  if (subEl) subEl.textContent = `${t('bus_label')||'Bus'} ${bus.number} · ${busName(bus.id)}`;

  let lastTime = null;
  function step(ts) {
    if (!lastTime) lastTime = ts;
    const delta = (ts - lastTime) / 16.67;
    lastTime = ts;
    animIndex += animSpeed * delta;
    if (animIndex >= animStops.length - 1) animIndex = 0;
    const idx  = Math.floor(animIndex);
    const frac = animIndex - idx;
    const next = Math.min(idx+1, animStops.length-1);
    const lat  = animStops[idx][0] + (animStops[next][0]-animStops[idx][0]) * frac;
    const lng  = animStops[idx][1] + (animStops[next][1]-animStops[idx][1]) * frac;
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
    html: `<div style="background:${bus.color};color:#fff;border-radius:10px;padding:5px 12px;
           font-family:'Mukta','Noto Sans Devanagari',sans-serif;font-size:14px;font-weight:700;
           box-shadow:0 3px 12px rgba(0,0,0,0.35);white-space:nowrap;border:2px solid #fff;
           display:flex;align-items:center;gap:5px;">
           <span style="font-size:16px">🚌</span>${bus.number}</div>`,
    iconSize: [72,32], iconAnchor: [36,16]
  });
}

// ============================================================
// RENDER ETA — fully translated
// ============================================================
function renderETA(j) {
  const el      = document.getElementById('eta-result');
  if (!el) return;
  const tColor  = TRAFFIC_COLORS[j.trafficLevel];
  const noMore  = j.noMoreBusToday;
  const bName   = busName(j.bus.id);
  const bNum    = j.bus.number;
  const bStop   = stopName(j.boardStop.id);
  const aStop   = stopName(j.alightStop.id);
  const sLbl    = t('stops_label');
  const tLbl    = trafficLabel(j.trafficLevel);

  el.innerHTML = `
    <div class="eta-hero">
      <div>
        <div class="eta-big">${j.totalMin}</div>
        <div class="eta-unit">${t('eta_unit')}</div>
      </div>
      <div class="eta-arrive-box">
        <div class="eta-arrive-label">${t('arrive_label')}</div>
        <div class="eta-arrive-time">${noMore ? '—' : j.destTimeStr}</div>
      </div>
    </div>

    <div class="journey-timeline">
      <div class="tl-step">
        <div class="tl-dot" style="background:#f59e0b"></div>
        <div class="tl-content">
          <div class="tl-title">${t('wait_for')} ${bNum}</div>
          <div class="tl-sub">${noMore ? t('no_more_buses') : t('arrives_at') + ' ' + j.busArrivalTime + ' · ' + j.waitMin + ' min'}</div>
        </div>
        <div class="tl-time">${noMore ? '—' : j.waitMin + ' min'}</div>
      </div>
      <div class="tl-line"></div>
      <div class="tl-step">
        <div class="tl-dot" style="background:${j.bus.color}"></div>
        <div class="tl-content">
          <div class="tl-title">${t('board_at')} ${bStop}</div>
          <div class="tl-sub">${j.stopsBetween} ${sLbl} · ${j.routeDistKm} km</div>
        </div>
        <div class="tl-time">${j.rideMin} min</div>
      </div>
      <div class="tl-line"></div>
      <div class="tl-step">
        <div class="tl-dot" style="background:#27ae60"></div>
        <div class="tl-content">
          <div class="tl-title">${t('alight_at')} ${aStop}</div>
          <div class="tl-sub">${noMore ? '—' : t('arrive_time') + ' ' + j.destTimeStr}</div>
        </div>
        <div class="tl-time">${noMore ? '—' : j.destTimeStr}</div>
      </div>
    </div>

    <div class="traffic-info-row" style="border-color:${tColor};color:${tColor}">
      <span>● ${tLbl}</span>
      <span style="font-size:12px;font-weight:400;color:#777">${t('eta_adjusted')}</span>
    </div>

    <button class="btn-reset" onclick="resetAll()">← ${t('new_journey')}</button>
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
  const bs = document.getElementById('board-search');
  if (bs) bs.value = '';
  renderStopList('board', ALL_STOPS);
  show('section-board');
  hide('section-alight'); hide('section-buses'); hide('section-eta');
  const r = document.getElementById('msb-route'); if(r) r.textContent = t('select_stops')||'Select stops';
  const e = document.getElementById('msb-eta');   if(e) e.textContent = '—';
  map.setView([18.5200, 73.8553], 12);
}
function resetToStep2() {
  alightStopId = null;
  if (alightMarker) { map.removeLayer(alightMarker); alightMarker = null; }
  stopBusAnimation(); clearRouteFromMap();
  hide('section-buses'); hide('section-eta');
  const as = document.getElementById('alight-search');
  if (as) as.value = '';
  renderStopList('alight', ALL_STOPS.filter(s => s.id !== boardStopId));
  show('section-alight');
}
function resetAll() { resetToStep1(); }

// ============================================================
// HELPERS
// ============================================================
function show(id) { const e=document.getElementById(id); if(e) e.classList.remove('hidden'); }
function hide(id) { const e=document.getElementById(id); if(e) e.classList.add('hidden'); }

function makeIcon(color, label) {
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};color:#fff;border-radius:50%;width:36px;height:36px;
           display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;
           border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,0.3);
           font-family:'Mukta',sans-serif;">${label}</div>`,
    iconSize:[36,36], iconAnchor:[18,18]
  });
}
