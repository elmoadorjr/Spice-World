// ============ MAP CONTROLS: consolidated top-right panel ============
// Jump-to-location, reset view, and the 1500/1511 timeline toggle used to
// be three separately-boxed Leaflet controls stacking down the right edge.
// Merged into one panel so the map only shows a single compact control
// group per corner instead of a wall of individually-bordered boxes.
const MapControlsPanel = L.Control.extend({
  options: { position: 'topright' },
  onAdd: function(map){
    const container = L.DomUtil.create('div', 'map-controls-panel');
    L.DomEvent.disableClickPropagation(container);

    const select = L.DomUtil.create('select', 'location-jump-select', container);
    select.title = 'Jump to a location on the map';
    // Grouped into three tiers (each alphabetized) rather than one flat
    // list in array order, so a 25-entry dropdown scans faster: capitals
    // first since they're the most likely destination, then notable
    // non-sovereign polities, then everything else.
    const tierOf = loc => loc.capital ? 'capital' : (loc.tier === 'major' ? 'major' : 'other');
    const tierGroups = [
      { key: 'capital', label: 'Capitals' },
      { key: 'major', label: 'Notable Polities' },
      { key: 'other', label: 'Other Locations' },
    ];
    const optgroupsHtml = tierGroups.map(g => {
      const rows = locations
        .map((loc, i) => ({ loc, i }))
        .filter(({ loc }) => tierOf(loc) === g.key)
        .sort((a, b) => a.loc.name.localeCompare(b.loc.name));
      if (!rows.length) return '';
      const opts = rows.map(({ loc, i }) => `<option value="${i}">${loc.name}</option>`).join('');
      return `<optgroup label="${g.label}">${opts}</optgroup>`;
    }).join('');
    select.innerHTML = `<option value="">Jump to…</option>${optgroupsHtml}`;
    L.DomEvent.on(select, 'change', (e) => {
      const idx = e.target.value;
      if (idx === '') return;
      const loc = locations[idx];
      map.flyTo([loc.lat, loc.lng], 7, { duration: 0.8 });
      setTimeout(() => loc._marker.openPopup(), 600);
      select.value = '';
    });

    const btnRow = L.DomUtil.create('div', 'map-controls-btn-row', container);

    const resetBtn = L.DomUtil.create('button', 'reset-view-btn', btnRow);
    resetBtn.innerHTML = '⤢ Reset';
    resetBtn.type = 'button';
    resetBtn.title = 'Reset view';
    L.DomEvent.on(resetBtn, 'click', () => {
      map.flyTo([2.5, 112], 5, { duration: 0.8 });
    });

    const timelineBtn = L.DomUtil.create('button', 'reset-view-btn', btnRow);
    timelineBtn.innerHTML = '1500→1511';
    timelineBtn.type = 'button';
    timelineBtn.title = 'Toggle: show what changes by 1511';
    let showing1511 = false;
    L.DomEvent.on(timelineBtn, 'click', () => {
      showing1511 = !showing1511;
      if (showing1511) {
        year1511Layer.addTo(map);
        timelineBtn.innerHTML = '← 1500';
        timelineBtn.classList.add('active-timeline');
      } else {
        map.removeLayer(year1511Layer);
        timelineBtn.innerHTML = '1500→1511';
        timelineBtn.classList.remove('active-timeline');
      }
    });

    return container;
  }
});
map.addControl(new MapControlsPanel());
const year1511Layer = L.layerGroup();

// A small caravel glyph standing in for the Portuguese fleet, placed just
// off Malacca's coast rather than on top of the existing pin.
const portugueseIcon = L.divIcon({
  className: '',
  html: `<div style="font-size:20px; line-height:1; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));">⛴️</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});
L.marker([1.85, 102.55], { icon: portugueseIcon, interactive: false }).addTo(year1511Layer);

// A dashed red ring around Malacca itself, marking the conquest without
// needing to redraw or recolor the underlying territory polygon.
const fallRing = L.circleMarker([2.19, 102.25], {
  radius: 22,
  color: '#8B3A3A',
  weight: 2,
  opacity: 0.85,
  fill: false,
  dashArray: '5 4'
});
fallRing.bindPopup(`
  <div class="t-region">1511 &mdash; Eleven Years On</div>
  <div class="t-name" style="font-size:16px;">Malacca Falls</div>
  <div class="t-figures"><div>Afonso de Albuquerque takes Malacca for Portugal. Sultan Mahmud Shah flees south, eventually to Pahang, and the sultanate that dominated this entire map in 1500 never rules a unified strait again. The "something coming from the west" the Central Conflict tab warns about has arrived.</div></div>
`, { maxWidth: 260 });
fallRing.addTo(year1511Layer);

// A short label near the ring so the marker reads even before it's clicked.
const fallLabelIcon = L.divIcon({
  className: '',
  html: `<div style="font-family:'Cinzel',serif; font-size:10px; letter-spacing:0.08em; color:#F1E6C8; background: rgba(139,58,58,0.85); padding:2px 7px; border-radius:2px; white-space:nowrap; box-shadow:0 1px 2px rgba(0,0,0,0.4);">FALLEN, 1511</div>`,
  iconSize: [100, 16],
  iconAnchor: [50, -18]
});
L.marker([2.19, 102.25], { icon: fallLabelIcon, interactive: false }).addTo(year1511Layer);

// ============ LAYERS PANEL: GEOGRAPHY / SETTLEMENTS / MONSOON ============
// Bottom-right so it doesn't crowd the jump-to/reset/timeline stack already
// occupying the top-right corner. Geography and settlements default ON
// (part of the base worldbuilding layer now); monsoon winds default OFF
// and cycles NE -> SW -> off on repeated clicks, since showing both seasons
// at once would just be clutter.
const LayersPanelControl = L.Control.extend({
  options: { position: 'bottomright' },
  onAdd: function(map){
    const container = L.DomUtil.create('div', 'layers-panel-control');
    L.DomEvent.disableClickPropagation(container);

    const toggleBtn = L.DomUtil.create('button', 'layers-panel-toggle', container);
    toggleBtn.type = 'button';
    toggleBtn.innerHTML = '☰ Layers';
    const btnGroup = L.DomUtil.create('div', 'layers-panel-buttons', container);
    btnGroup.style.display = 'none';
    L.DomEvent.on(toggleBtn, 'click', () => {
      const open = btnGroup.style.display !== 'none';
      btnGroup.style.display = open ? 'none' : 'flex';
      toggleBtn.classList.toggle('is-open', !open);
    });
    // The container blocks propagation of clicks that land on it, so a
    // plain map click/drag listener here only ever fires for interactions
    // outside the panel — exactly what should close it if left open.
    map.on('click dragstart', () => {
      if (btnGroup.style.display !== 'none') {
        btnGroup.style.display = 'none';
        toggleBtn.classList.remove('is-open');
      }
    });

    const geoBtn = L.DomUtil.create('button', 'layer-toggle-btn', btnGroup);
    geoBtn.type = 'button';
    geoBtn.innerHTML = '🌋 Geography';
    geoBtn.title = 'Toggle rivers, seas, straits & volcanoes';
    let geoOn = true;
    L.DomEvent.on(geoBtn, 'click', () => {
      geoOn = !geoOn;
      if (geoOn) { geoFeaturesLayer.addTo(map); geoBtn.classList.remove('layer-off'); }
      else { map.removeLayer(geoFeaturesLayer); geoBtn.classList.add('layer-off'); }
    });

    const townBtn = L.DomUtil.create('button', 'layer-toggle-btn', btnGroup);
    townBtn.type = 'button';
    townBtn.innerHTML = '◆ Towns &amp; Ports';
    townBtn.title = 'Toggle unruled settlements';
    let townOn = true;
    L.DomEvent.on(townBtn, 'click', () => {
      townOn = !townOn;
      if (townOn) { settlementsLayer.addTo(map); townBtn.classList.remove('layer-off'); }
      else { map.removeLayer(settlementsLayer); townBtn.classList.add('layer-off'); }
    });

    const charBtn = L.DomUtil.create('button', 'layer-toggle-btn', btnGroup);
    charBtn.type = 'button';
    charBtn.innerHTML = '👑 Characters';
    charBtn.title = 'Toggle character markers — where each named figure currently is';
    let charOn = false;
    charBtn.classList.add('layer-off');
    L.DomEvent.on(charBtn, 'click', () => {
      charOn = !charOn;
      if (charOn) { charactersLayer.addTo(map); charBtn.classList.remove('layer-off'); }
      else { map.removeLayer(charactersLayer); charBtn.classList.add('layer-off'); }
    });

    const windBtn = L.DomUtil.create('button', 'layer-toggle-btn', btnGroup);
    windBtn.type = 'button';
    windBtn.innerHTML = '➤ Monsoon: Off';
    windBtn.title = 'Cycle animated monsoon wind streamlines';
    let windState = 'off'; // off -> ne -> sw -> off
    L.DomEvent.on(windBtn, 'click', () => {
      if (monsoonLayer) { map.removeLayer(monsoonLayer); monsoonLayer = null; }
      if (windState === 'off') { windState = 'ne'; }
      else if (windState === 'ne') { windState = 'sw'; }
      else { windState = 'off'; }

      if (windState === 'off') {
        windBtn.innerHTML = '➤ Monsoon: Off';
        windBtn.classList.add('layer-off');
      } else {
        monsoonLayer = buildMonsoonLayer(windState);
        monsoonLayer.addTo(map);
        windBtn.innerHTML = windState === 'ne' ? '➤ Monsoon: NE' : '➤ Monsoon: SW';
        windBtn.classList.remove('layer-off');
      }
    });
    windBtn.classList.add('layer-off');

    const goodsBtn = L.DomUtil.create('button', 'layer-toggle-btn', btnGroup);
    goodsBtn.type = 'button';
    goodsBtn.innerHTML = '🌶️ Goods: All';
    goodsBtn.title = 'Cycle which commodity\'s routes are highlighted';
    let goodsIdx = -1; // -1 = "All"
    L.DomEvent.on(goodsBtn, 'click', () => {
      goodsIdx = goodsIdx + 1 >= goodsFlows.length ? -1 : goodsIdx + 1;
      const name = goodsIdx === -1 ? "" : goodsFlows[goodsIdx].name.replace(/&amp;/g, '&');
      applyGoodsFilter(name);
      goodsBtn.innerHTML = goodsIdx === -1 ? '🌶️ Goods: All' : `🌶️ ${name}`;
      goodsBtn.classList.toggle('layer-off', goodsIdx === -1);
    });
    goodsBtn.classList.add('layer-off');

    return container;
  }
});
map.addControl(new LayersPanelControl());

// ============ SCALE BAR ============
// Gives a real distance reference so the trade routes' relative lengths
// (e.g. Malacca to Ternate vs. Malacca to Aceh) can be eyeballed, not just
// felt. Metric only, bottom-left so it doesn't crowd the jump/reset controls.
L.control.scale({ position: 'bottomleft', imperial: false, maxWidth: 120 }).addTo(map);

// Toggle label density based on zoom: at the default/zoomed-out view, only
// capital labels show; zooming in past the initial level reveals all labels.
function updateZoomLabelClass(){
  if (map.getZoom() <= 5) {
    document.body.classList.add('zoom-far');
  } else {
    document.body.classList.remove('zoom-far');
  }
}
map.on('zoomend', updateZoomLabelClass);
updateZoomLabelClass();

// ============ HERE BE DRAGONS ============
// Ship emoji + Latin "unknown waters" labels in open ocean stretches.
// Placed at real lat/lng so they stay put when panning/zooming.

const decorations = [
  // Java Sea open water — nudged north/east of original spot to clear the
  // Sunda and Demak territory edges, which both reach toward this stretch.
  { lat: -4.3, lng: 109.5, emoji: '⛵' },
  // Banda Sea, south of Maluku
  { lat: -5.5, lng: 128.5, emoji: '⛵' },
  // South China Sea, open water
  { lat: 15.5, lng: 116.5, emoji: '⛵' },
];

decorations.forEach(d => {
  const icon = L.divIcon({
    className: '',
    html: `<div class="sea-monster" style="font-size:22px; line-height:1;">${d.emoji}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
  L.marker([d.lat, d.lng], { icon, interactive: false }).addTo(map);
});

// Latin "unknown waters" labels near map edges — the "Here Be Dragons" spirit,
// without trying to hand-draw a dragon in raw SVG paths.
const dragonLabels = [
  { lat: 18.5, lng: 108.5, text: "HIC SVNT DRACONES" },
  { lat: -8.5, lng: 95, text: "MARE INCOGNITVM" },
  { lat: 3.2, lng: 138, text: "TERRA INCOGNITA" },
  { lat: -10.5, lng: 118, text: "PERICVLVM MARIS" },
];
dragonLabels.forEach(lbl => {
  const icon = L.divIcon({
    className: '',
    html: `<div style="font-family:'Cinzel',serif; font-size:11px; letter-spacing:0.14em; color:#F1E6C8; opacity:0.6; font-style:italic; white-space:nowrap; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">${lbl.text}</div>`,
    iconSize: [200, 20],
    iconAnchor: [100, 10]
  });
  L.marker([lbl.lat, lbl.lng], { icon, interactive: false }).addTo(map);
});


const charListEl = document.getElementById('char-list');
const charListView = document.getElementById('char-list-view');
const charDetailView = document.getElementById('char-detail-view');
const charDetailContent = document.getElementById('char-detail-content');
const charBackBtn = document.getElementById('char-back-btn');

// Section order and copy for the roster's role groups. Any future role not
// listed here (e.g. "side") falls through to a titleized fallback heading
// rather than being silently dropped, so a new role tag always renders.
//
// One section (rivals-mirrors) groups by an explicit `cohort` tag instead
// of `role`, since the four figures in it span two different roles (heir,
// unrisen) for real mechanical reasons — Pati Unus already has a seat
// waiting, the other three don't — but the story treats all four as one
// thematic unit: other young nakhoda and warriors climbing toward Sea Lord
// status across the same 1500–1511 decade Angin climbs, see Central
// Conflict's Rivals & Mirrors table. Cohort membership is checked first in
// renderCharList below, so it pulls matching characters out of their
// role-based section rather than duplicating them in both.
