// ============ NAKHODA: HUD & SHEETS ============
// What's on the glass while you sail (purse, date and season, compass
// ribbon, wind dial, hull, hold, guns, minimap), the labels that float over
// ports and sails, and the parchment sheets laid over the world: title,
// story beats, pause.

NK.ui = (function () {
  let modalKind = null, portOpen = null, camera = null;
  const touch = { left: false, right: false };
  const $ = NK.$;
  const seenBanner = {};

  // ---------- Sheets ----------
  function showModal(html, kind) {
    const m = $('modal'); m.innerHTML = html; m.classList.add('show'); modalKind = kind;
    m.querySelectorAll('[data-close]').forEach(b => b.onclick = closeModal);
  }
  function closeModal() {
    const m = $('modal'); m.classList.remove('show'); m.innerHTML = '';
    if (modalKind === 'port') { portOpen = null; NK.game.save(); }
    modalKind = null;
    if (storyQueue.length) setTimeout(() => story(...storyQueue.shift()), 300);
  }
  const storyQueue = [];
  function story(title, body) {
    if (modalKind) { storyQueue.push([title, body]); return; }
    showModal(`<div class="sheet story"><div class="ornament">✦ ✦ ✦</div><h1>${title}</h1><div class="body">${body}</div>
      <div class="actions"><button class="btn primary" data-close>Continue</button></div></div>`, 'story');
  }

  function togglePause() {
    if (modalKind === 'pause') { closeModal(); return; }
    if (modalKind) return;
    const s = NK.game.state;
    showModal(`<div class="sheet story"><div class="ornament">✦</div><h1>Becalmed</h1>
      <div class="body" style="text-align:center">
        <p>${NK.game.rankName()} · ${NK.game.TIERS[s.tier].n} · Day ${s.day}, ${NK.game.dateLabel()}</p>
        <p class="nk-meta">${s.stats.deliveries} charters delivered · ${s.stats.piratesSunk} pirates sunk · ${NK.fmt(s.stats.earned)} pisis earned</p>
      </div>
      <div class="actions">
        <button class="btn primary" data-close>Resume</button>
        <button class="btn" id="p-sound">Sound: ${NK.audio.enabled ? 'on' : 'off'}</button>
        ${NK.embedded ? '<button class="btn" id="p-room">Return to the Chart Room</button>' : '<a class="btn" href="index.html" style="text-decoration:none">The Atlas</a>'}
        <button class="btn" id="p-new">New voyage</button>
      </div></div>`, 'pause');
    $('p-sound').onclick = () => { $('p-sound').textContent = 'Sound: ' + (NK.audio.toggle() ? 'on' : 'off'); };
    $('p-new').onclick = () => { if (confirm('Abandon this voyage and start again from Melaka?')) NK.main.newVoyage(); };
    const room = $('p-room'); if (room) room.onclick = exitToRoom;
  }
  function exitToRoom() { NK.game.save(); try { window.parent.postMessage({ type: 'nakhoda-exit' }, '*'); } catch (e) {} }

  function title(hasSave, onGo) {
    const t = $('title'), s = NK.game.state;
    t.style.display = 'flex';
    const saveLine = hasSave ? `Day ${s.day} · ${NK.game.TIERS[s.tier].n} · ${NK.fmt(s.gold)} pisis · Reputation ${s.rep}${s.seaLord ? ' · Sea Lord' : ''}` : '';
    t.innerHTML = `<div class="title-card">
      <div class="kicker">The Austronesia Saga · Book 3.3 · Crescent and Crossroads</div>
      <h1>Nakhoda</h1>
      <div class="tag2">The Spice Sea, Anno Domini 1500</div>
      <div class="rule"></div>
      <p class="lede">Seventeen thousand islands, four great sultanates and a hundred small kings. The monsoon turns twice a year and every fortune turns with it: east to the clove islands on the northwest wind, home again when the southeast trades blow. A kelulus, a borrowed sail, and a name nobody knows yet.</p>
      <div class="title-actions">
      ${hasSave ? '<button class="btn primary" id="t-go">Continue the voyage</button><button class="btn ghost" id="t-new">New voyage</button>' : '<button class="btn primary" id="t-new">Set sail from Melaka</button>'}
      ${NK.embedded ? '<button class="btn ghost" id="t-room">Chart Room</button>' : ''}
      </div>
      ${hasSave ? `<div class="save-line">${saveLine}</div>` : ''}
      <div class="keys">
        <span><kbd>A</kbd><kbd>D</kbd>Steer</span><span><kbd>W</kbd><kbd>S</kbd>Raise / furl sail</span>
        <span><kbd>Q</kbd><kbd>E</kbd>Broadsides</span><span><kbd>F</kbd>Enter port</span>
        <span><kbd>M</kbd>Chart</span><span><kbd>R</kbd>Pilot</span><span><kbd>T</kbd>Fair winds</span><span><kbd>Esc</kbd>Pause</span>
      </div></div>`;
    const go = fresh => { NK.audio.start(); t.classList.add('gone'); setTimeout(() => { t.style.display = 'none'; }, 1000); onGo(fresh); };
    if ($('t-go')) $('t-go').onclick = () => go(false);
    $('t-new').onclick = () => { if (!hasSave || confirm('Start a new voyage? Your current one will be lost.')) go(true); };
    if ($('t-room')) $('t-room').onclick = exitToRoom;
  }

  // ---------- Toasts, banners, floaters ----------
  function toast(msg, kind) {
    const box = $('toasts'); const el = NK.el('div', 'toast ' + (kind || ''), msg);
    box.appendChild(el);
    while (box.children.length > 4) box.removeChild(box.firstChild);
    setTimeout(() => el.classList.add('out'), 4800); setTimeout(() => el.remove(), 5400);
  }
  let bannerT = 0;
  function banner(t, s) {
    const b = $('banner'); b.querySelector('.t').textContent = t; b.querySelector('.s').textContent = s || '';
    b.classList.add('show'); clearTimeout(bannerT); bannerT = setTimeout(() => b.classList.remove('show'), 4200);
  }
  const v3 = new THREE.Vector3();
  function project(x, y, z) {
    v3.set(x, y, z).project(camera);
    if (v3.z > 1) return null;
    return [(v3.x * 0.5 + 0.5) * innerWidth, (-v3.y * 0.5 + 0.5) * innerHeight];
  }
  function floater(pos, val, hurt) {
    const p = project(pos.x, pos.y + 6, pos.z); if (!p) return;
    const el = NK.el('div', 'floater' + (hurt ? ' hurt' : ''), val > 0 ? '+' + val : String(val));
    el.style.left = p[0] + 'px'; el.style.top = p[1] + 'px';
    $('floaters').appendChild(el); setTimeout(() => el.remove(), 1300);
  }

  // ---------- World labels ----------
  const labelPool = [];
  function labels() {
    const root = $('labels'), P = NK.player.pos;
    const items = [];
    NK.ports.list.forEach(p => { const d = Math.hypot(p.landmark.x - P.x, p.landmark.z - P.z); if (d < 1800) items.push({ d, x: p.landmark.x, y: p.landmark.h + 34, z: p.landmark.z, html: `<b>${p.name}</b><span>${p.faction ? FACTIONS[p.faction].name : 'Independent'}</span>`, cls: '' }); });
    NK.fleet.ships.forEach(a => {
      if (a.sinking) return;
      const d = Math.hypot(a.pos.x - P.x, a.pos.z - P.z); if (d > 700) return;
      const hostile = NK.fleet.hostile(a);
      const name = a.kind === 'pirate' ? 'Penjajap' : a.kind === 'patrol' ? `${FACTIONS[a.faction].name} patrol` : `${NK.game.TIERS[a.tier].n}${a.dest ? ' for ' + a.dest.name : ''}`;
      const hp = a.hp < a.maxHp ? `<div class="hpbar"><i style="width:${Math.max(0, a.hp / a.maxHp * 100)}%"></i></div>` : '';
      items.push({ d, x: a.pos.x, y: a.ship.D * 6 + 16, z: a.pos.z, html: `<b>${name}</b>${hp}`, cls: 'ship' + (hostile ? ' hostile' : '') });
    });
    items.sort((a, b) => a.d - b.d);
    for (let i = 0; i < Math.max(items.length, labelPool.length); i++) {
      let el = labelPool[i];
      if (!el) { el = NK.el('div', 'label3d'); root.appendChild(el); labelPool.push(el); }
      const it = items[i];
      const p = it && i < 8 ? project(it.x, it.y, it.z) : null;
      if (!p) { el.style.display = 'none'; continue; }
      el.style.display = 'block'; el.className = 'label3d ' + it.cls;
      if (el._html !== it.html) { el.innerHTML = it.html; el._html = it.html; }
      el.style.left = p[0] + 'px'; el.style.top = p[1] + 'px';
      el.style.opacity = NK.clamp(1.3 - it.d / (it.cls ? 700 : 1800), 0, 1);
    }
  }

  // ---------- Compass ribbon & wind dial ----------
  function compass() {
    const strip = $('h-strip'), P = NK.player, W = strip.parentElement.clientWidth;
    const deg = ((90 - P.heading * 180 / Math.PI) % 360 + 360) % 360;   // 0 = north, clockwise
    const pxPerDeg = W / 120;
    let html = '';
    const names = { 0: 'N', 45: 'NE', 90: 'E', 135: 'SE', 180: 'S', 225: 'SW', 270: 'W', 315: 'NW' };
    for (let d = Math.floor(deg - 70); d <= deg + 70; d++) {
      const dd = ((d % 360) + 360) % 360, x = W / 2 + (d - deg) * pxPerDeg;
      if (dd % 15 === 0) html += `<div class="tick${dd % 45 === 0 ? ' big' : ''}" style="left:${x}px"></div>`;
      if (names[dd] !== undefined) html += `<div class="lbl${dd % 90 ? ' minor' : ''}" style="left:${x}px">${names[dd]}</div>`;
    }
    const bearingMark = (b, cls, txt) => { let rel = ((b - deg + 540) % 360) - 180; rel = NK.clamp(rel, -58, 58); html += `<div class="mark ${cls}" style="left:${W / 2 + rel * pxPerDeg}px">${txt}</div>`; };
    const w = NK.game.wind(P.pos.x, P.pos.z);
    const windTo = ((Math.atan2(w.x, -w.z) * 180 / Math.PI) + 360) % 360;
    bearingMark(windTo, 'wind', 'WIND ➝');
    if (P.course) { const t = P.course.path[P.course.i] || [P.course.port.ax, P.course.port.az]; bearingMark(((Math.atan2(t[0] - P.pos.x, -(t[1] - P.pos.z)) * 180 / Math.PI) + 360) % 360, 'course', P.course.port.name); }
    strip.innerHTML = html;
  }
  function dial() {
    const cv = $('h-dial'), g = cv.getContext('2d'), W = cv.width, P = NK.player;
    g.clearRect(0, 0, W, W);
    const c = W / 2, r = W / 2 - 6;
    g.strokeStyle = 'rgba(232,196,122,0.5)'; g.lineWidth = 2; g.beginPath(); g.arc(c, c, r, 0, 7); g.stroke();
    // No-go cone (in irons) ahead of the bow, relative to the wind.
    const w = NK.game.wind(P.pos.x, P.pos.z);
    const from = Math.atan2(-w.z, -w.x), hv = Math.atan2(-Math.sin(P.heading), Math.cos(P.heading));
    const rel = NK.wrapAngle(from - hv);                 // wind source relative to bow (screen: bow up)
    const a = rel - Math.PI / 2;
    g.fillStyle = 'rgba(224,139,111,0.28)'; g.beginPath(); g.moveTo(c, c); g.arc(c, c, r, a - 0.62, a + 0.62); g.fill();
    // Ship silhouette, bow up.
    g.fillStyle = '#efe3c5'; g.beginPath(); g.moveTo(c, c - 22); g.quadraticCurveTo(c + 9, c, c + 6, c + 20); g.lineTo(c - 6, c + 20); g.quadraticCurveTo(c - 9, c, c, c - 22); g.fill();
    // Wind arrow blowing in from the rim.
    const ax = c + Math.cos(a) * (r - 2), ay = c + Math.sin(a) * (r - 2), bx = c + Math.cos(a) * (r - 22), by = c + Math.sin(a) * (r - 22);
    g.strokeStyle = '#9fd3df'; g.fillStyle = '#9fd3df'; g.lineWidth = 4; g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.stroke();
    g.beginPath(); g.moveTo(bx + Math.cos(a) * -6, by + Math.sin(a) * -6); g.lineTo(bx + Math.cos(a + 2.4) * 10, by + Math.sin(a + 2.4) * 10); g.lineTo(bx + Math.cos(a - 2.4) * 10, by + Math.sin(a - 2.4) * 10); g.fill();
  }

  // ---------- HUD tick ----------
  let lastSlow = 0, lastGold = -1;
  function update() {
    const s = NK.game.state, P = NK.player;
    if (s.gold !== lastGold) { $('h-gold').textContent = NK.fmt(s.gold); lastGold = s.gold; }
    if (NK.T - lastSlow > 0.25) {
      lastSlow = NK.T;
      $('h-rank').textContent = `${NK.game.rankName()} · ${NK.game.TIERS[s.tier].n}`;
      $('h-date').textContent = `Day ${s.day} · ${NK.game.dateLabel()} · ${timeWord(s.dayFrac)}`;
      $('h-season').textContent = NK.game.season().name;
      const mh = NK.game.maxHp(), pct = P.hp / mh;
      $('h-hp').textContent = `${Math.max(0, Math.round(P.hp))} / ${mh}`;
      $('h-hpbar').className = 'bar' + (pct < 0.25 ? ' crit' : pct < 0.5 ? ' warn' : '');
      $('h-hpbar').firstChild.style.width = Math.max(0, pct * 100) + '%';
      $('h-hold').innerHTML = `Hold <b>${NK.game.holdUsed()} / ${NK.game.holdMax()}</b>` + cargoSummary();
      const c = s.contract;
      $('h-charter').innerHTML = c ? `Charter: ${c.qty} ${c.good} to <b>${PORT_DATA[c.destIdx].name}</b> by day ${c.expiresDay}` : '';
      $('h-pos').textContent = P.pointOfSail(P.offWind || 0) + (NK.sky.state.weather === 'squall' ? ' · squall' : NK.sky.state.weather === 'mist' ? ' · mist' : '');
      $('h-pos').className = 'pos' + ((P.offWind || 0) < 0.62 ? ' irons' : '');
      const pips = $('h-sail').querySelectorAll('i');
      pips[0].className = P.sailTarget >= 0.5 ? 'on' : ''; pips[1].className = P.sailTarget >= 1 ? 'on' : '';
      $('h-sail').querySelector('span').textContent = P.sailTarget === 0 ? 'Furled' : P.sailTarget < 1 ? 'Half sail' : 'Full sail';
      $('fair').style.display = NK.timeScale > 1 ? 'block' : 'none';
      prompt();
      bannerCheck();
    }
    $('h-speed').textContent = (Math.abs(P.speed) * 0.36).toFixed(1);
    const rl = 7 * (1 - s.upg.guns * 0.08);
    $('h-rl').style.width = (100 - P.reload.left / rl * 100) + '%'; $('h-rr').style.width = (100 - P.reload.right / rl * 100) + '%';
    compass(); dial(); labels();
    NK.chart.drawMini($('h-mini'));
  }
  function timeWord(f) { return f < 0.2 ? 'night' : f < 0.3 ? 'dawn' : f < 0.45 ? 'morning' : f < 0.58 ? 'noon' : f < 0.7 ? 'afternoon' : f < 0.8 ? 'dusk' : 'night'; }
  function cargoSummary() {
    const c = NK.game.state.cargo, keys = Object.keys(c); if (!keys.length) return '';
    return ' · ' + keys.slice(0, 3).map(k => `${c[k].qty} ${k}`).join(', ') + (keys.length > 3 ? '…' : '');
  }
  function nearPort() {
    const P = NK.player, n = NK.ports.nearest(P.pos.x, P.pos.z);
    return n.dist < 75 + P.ship.L * 0.5 ? n.port : null;
  }
  function prompt() {
    const p = nearPort(), el = $('h-prompt');
    if (p && !modalKind) {
      el.style.display = 'block';
      const slow = Math.abs(NK.player.speed) < 9;
      $('h-prompt-btn').innerHTML = slow ? `${NK.isMobile ? '' : '<kbd>F</kbd>'}Drop anchor at ${p.name}` : `Shorten sail to enter ${p.name}`;
      $('h-prompt-btn').onclick = interact;
    } else el.style.display = 'none';
  }
  function bannerCheck() {
    const P = NK.player.pos, n = NK.ports.nearest(P.x, P.z);
    if (n.dist < 1300 && !seenBanner[n.port.name]) {
      seenBanner[n.port.name] = true;
      const f = n.port.faction ? FACTIONS[n.port.faction] : null;
      banner(n.port.name, f ? f.name : 'Independent port');
    } else if (n.dist > 2600) seenBanner[n.port.name] = false;
  }
  function interact() {
    if (modalKind) return;
    const p = nearPort(); if (!p) return;
    if (Math.abs(NK.player.speed) > 9) { toast('Shorten sail first: you would ram the jetty.', 'info'); return; }
    NK.player.speed = 0; NK.player.sailTarget = 0; NK.player.autopilot = false;
    portOpen = p;
    const s = NK.game.state;
    s.known[p.name] = { day: s.day, produces: (NK.econ.TRADE[p.name] || { prod: [] }).prod, demands: (NK.econ.TRADE[p.name] || { want: [] }).want };
    NK.port.open(p);
    NK.game.save();
  }
  function toggleFairWinds() {
    if (NK.timeScale > 1) { NK.timeScale = 1; toast('Back to the watch.', 'info'); return; }
    if (NK.fleet.threatNear(1300)) { toast('Not with hostile sails on the horizon.', 'bad'); return; }
    NK.timeScale = 3; toast('Fair winds: the days pass quickly. (T to stop)', 'info');
  }

  function bindTouch() {
    if (!NK.isMobile) return;
    document.body.classList.add('touch');
    const hold = (id, on, off) => { const b = $(id); b.addEventListener('touchstart', e => { e.preventDefault(); b.classList.add('on'); on(); }, { passive: false }); b.addEventListener('touchend', e => { e.preventDefault(); b.classList.remove('on'); off && off(); }); };
    hold('tc-left', () => touch.left = true, () => touch.left = false);
    hold('tc-right', () => touch.right = true, () => touch.right = false);
    hold('tc-up', () => NK.player.stepSail(1)); hold('tc-down', () => NK.player.stepSail(-1));
    hold('tc-fl', () => NK.fleet.fire(NK.player, 'left')); hold('tc-fr', () => NK.fleet.fire(NK.player, 'right'));
  }

  function init(cam) {
    camera = cam;
    $('b-chart').onclick = () => NK.chart.open();
    $('h-mini').onclick = () => NK.chart.open();
    bindTouch();
    NK.events.on('toast', toast);
    NK.events.on('story', story);
    NK.events.on('hit', (pos, v, hurt) => floater(pos, v, hurt));
    NK.events.on('day', (d, msgs) => toast(`Day ${d} dawns${msgs.length ? ': ' + msgs.join(', ') : ''}.`, 'info'));
    NK.events.on('month', (m, se) => banner(`${m} ${NK.game.year()}`, se.name));
    NK.events.on('weather', w => toast(w === 'squall' ? 'A squall line darkens to windward. Shorten sail.' : w === 'mist' ? 'Sea mist rolls in. Keep a lookout.' : 'The weather clears.', w === 'squall' ? 'bad' : 'info'));
    NK.events.on('hurt', () => { if (NK.timeScale > 1) NK.timeScale = 1; });
  }

  return {
    init, update, showModal, closeModal, story, title, toast, banner, interact, toggleFairWinds, togglePause, exitToRoom,
    openChart: () => modalKind === 'chart' ? closeModal() : (!modalKind && NK.chart.open()),
    modal: () => modalKind, docked: () => !!portOpen, get port() { return portOpen; }, touch
  };
})();
