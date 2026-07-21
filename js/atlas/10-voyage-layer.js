// ============ VOYAGE LAYER: the sim's live state on the atlas map ============
// The chart room is a strategic layer, not just a codex: it shows where your
// ship rides at anchor, every port you've charted (with its trade intel), and
// the port your active charter is bound for. Data comes from the shared save
// (nakhoda-save-v4) and js/data/ports.js — the same fixed world the sim sails.
(function(){
  if (typeof map === 'undefined' || typeof PORT_DATA === 'undefined') return;

  const voyageLayer = L.layerGroup().addTo(map);
  const portByName = {};
  PORT_DATA.forEach(p => { portByName[p.name] = p; });

  function shipIcon(){
    return L.divIcon({
      className: 'voyage-ship-icon',
      html: '<div class="voyage-ship-inner">⛵</div>',
      iconSize: [34, 34], iconAnchor: [17, 17]
    });
  }

  function render(save){
    voyageLayer.clearLayers();
    if (!save) return;

    // Charted ports: intel gathered by docking there in the voyage
    const known = save.known || {};
    Object.keys(known).forEach(name => {
      const p = portByName[name]; if (!p) return;
      const k = known[name];
      const isTarget = save.contract && PORT_DATA[save.contract.destIdx] &&
                       PORT_DATA[save.contract.destIdx].name === name;
      const fKey = (typeof factionForPort === 'function') ? factionForPort(name) : null;
      const faction = fKey ? FACTIONS[fKey] : null;
      const rep = faction ? ((save.factionRep && save.factionRep[fKey]) || 0) : null;
      const marker = L.circleMarker([p.lat, p.lng], {
        radius: isTarget ? 9 : 6,
        color: faction ? faction.color : (isTarget ? '#2c7a4b' : '#8B3A3A'),
        weight: 2, fillColor: '#F1E6C8', fillOpacity: 0.9,
        className: isTarget ? 'voyage-charter-target' : ''
      });
      marker.bindPopup(
        `<div class="voyage-known-popup"><b>${name}</b> — charted day ${k.day}` +
        (isTarget ? `<br><b style="color:#2c7a4b;">⚓ Charter bound here: ${save.contract.qty}× ${save.contract.good}</b>` : '') +
        `<br>Produces: ${(k.produces || []).join(', ') || '?'}` +
        `<br>Craves: ${(k.demands || []).join(', ') || '?'}` +
        (faction ? `<br><span style="color:${faction.color};">${faction.name}</span> standing: ${rep > 0 ? '+' : ''}${rep}` : '<br><span style="opacity:0.7;">Independent port</span>') +
        `</div>`);
      voyageLayer.addLayer(marker);
    });

    // The ship herself, where the last save left her riding
    if (typeof save.x === 'number' && typeof save.z === 'number' && typeof worldUnproject === 'function') {
      const pos = worldUnproject(save.x, save.z);
      const tierNames = ['Kelulus','Pencalang','Malangbang','Lancaran','Jong'];
      const ship = L.marker([pos.lat, pos.lng], { icon: shipIcon(), zIndexOffset: 900 });
      ship.bindPopup(
        `<div class="voyage-known-popup"><b>Your ${tierNames[Math.min(save.tier || 0, 4)]}</b>` +
        `<br>Day ${save.day || 1} · ${save.gold || 0} pisis · Rep ${save.rep || 0}` +
        (save.seaLord ? '<br><b style="color:#B8873D;">SEA LORD</b>' : '') + `</div>`);
      voyageLayer.addLayer(ship);
    }
  }

  // Re-render whenever the sim reports a save (09-sim-launch.js calls this),
  // and once now from whatever the last session left behind.
  window.updateVoyageLayer = render;
  let last = null;
  try {
    last = JSON.parse(localStorage.getItem('nakhoda-save-v4') || 'null')
        || JSON.parse(localStorage.getItem('nakhoda-save-v3') || 'null')
        || JSON.parse(localStorage.getItem('nakhoda-save-v2') || 'null');
  } catch(e) {}
  render(last);
})();
