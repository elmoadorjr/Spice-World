// ============ NAKHODA: THE PILOT'S CHART ============
// A hand-inked chart of the whole Nusantara, drawn once from the same
// coastline field the 3D world uses. The minimap is a window onto it; the
// full chart (M) shows ports, what you know of their markets, the season's
// winds, and lets you plot a course for the pilot.

NK.chart = (function () {
  let img = null, IW = 0, IH = 0, S = 2;     // chart pixels per field pixel = 1/S
  const view = { cx: 0, cz: 0, scale: 1 };   // scale: canvas px per world unit
  let cv, ctx, hover = null, drag = null, baseScale = 1;

  function bake() {
    const w = NK.world, sdf = w.sdf;
    IW = Math.floor(w.W / S); IH = Math.floor(w.H / S);
    const c = document.createElement('canvas'); c.width = IW; c.height = IH;
    const g = c.getContext('2d'), im = g.createImageData(IW, IH), d = im.data;
    for (let y = 0; y < IH; y++) for (let x = 0; x < IW; x++) {
      const v = sdf[(y * S) * w.W + x * S] * w.U, i = (y * IW + x) * 4;
      const n = NK.noise(x * 0.05, y * 0.05) * 0.5 + 0.5;
      let r, gg, b;
      if (v < 0) {
        const k = Math.min(1, Math.sqrt(-v / 1500));
        r = 205 - 50 * k; gg = 214 - 34 * k; b = 200 - 8 * k;
        if (-v < 14) { r = 90; gg = 72; b = 50; }                       // ink coastline
        else if (-v < 60 && (Math.floor(-v / 18) % 2 === 0)) { r -= 12; gg -= 8; b -= 6; }   // hatching offshore
      } else {
        const k = Math.min(1, v / 1400);
        r = 228 - 40 * k - n * 8; gg = 210 - 46 * k - n * 8; b = 160 - 52 * k - n * 6;
        if (v < 10) { r = 90; gg = 72; b = 50; }
      }
      d[i] = r; d[i + 1] = gg; d[i + 2] = b; d[i + 3] = 255;
    }
    g.putImageData(im, 0, 0);
    // Volcano marks in ink.
    g.fillStyle = 'rgba(90,60,35,0.55)';
    w.VOLCANOES.forEach(v => { const [px, py] = toImg(v.x, v.z); g.beginPath(); g.moveTo(px, py - 5); g.lineTo(px - 4, py + 3); g.lineTo(px + 4, py + 3); g.fill(); });
    img = c;
  }
  const toImg = (x, z) => [(x - NK.world.x0) / NK.world.U / S, (z - NK.world.z0) / NK.world.U / S];

  // ---------- Minimap ----------
  function drawMini(canvas) {
    if (!img) return;
    const g = canvas.getContext('2d'), W = canvas.width, P = NK.player;
    const R = 3000, [px, py] = toImg(P.pos.x, P.pos.z), rr = R / NK.world.U / S;
    g.save();
    g.beginPath(); g.arc(W / 2, W / 2, W / 2, 0, Math.PI * 2); g.clip();
    g.drawImage(img, px - rr, py - rr, rr * 2, rr * 2, 0, 0, W, W);
    const k = W / (R * 2), tx = x => W / 2 + (x - P.pos.x) * k, tz = z => W / 2 + (z - P.pos.z) * k;
    // Course.
    if (P.course) {
      g.strokeStyle = 'rgba(70,110,40,0.9)'; g.lineWidth = 3; g.setLineDash([8, 6]); g.beginPath();
      g.moveTo(tx(P.pos.x), tz(P.pos.z));
      for (let i = P.course.i; i < P.course.path.length; i++) g.lineTo(tx(P.course.path[i][0]), tz(P.course.path[i][1]));
      g.stroke(); g.setLineDash([]);
    }
    // Ports.
    const st = NK.game.state;
    NK.ports.list.forEach(p => {
      const x = tx(p.x), y = tz(p.z); if (x < -20 || y < -20 || x > W + 20 || y > W + 20) return;
      const dest = st.contract && st.contract.destIdx === p.idx;
      g.fillStyle = dest ? '#3f7a2a' : '#2a2017'; g.beginPath(); g.arc(x, y, dest ? 9 : 6, 0, 7); g.fill();
      g.fillStyle = '#efe4c8'; g.beginPath(); g.arc(x, y, dest ? 4 : 2.5, 0, 7); g.fill();
      g.font = '600 20px "Cormorant Garamond", Georgia, serif'; g.fillStyle = '#2a2017'; g.textAlign = 'center';
      g.fillText(p.name, x, y - 12);
    });
    // Ships.
    NK.fleet.ships.forEach(a => {
      if (a.sinking) return;
      const x = tx(a.pos.x), y = tz(a.pos.z);
      g.fillStyle = NK.fleet.hostile(a) ? '#a3321f' : a.kind === 'patrol' ? '#6b3a5c' : '#4b5d63';
      g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill();
    });
    NK.fleet.loot.forEach(l => { g.fillStyle = '#b8873d'; g.fillRect(tx(l.mesh.position.x) - 3, tz(l.mesh.position.z) - 3, 6, 6); });
    // Wind streak and our ship.
    const w = NK.game.wind(P.pos.x, P.pos.z);
    g.strokeStyle = 'rgba(40,90,110,0.65)'; g.lineWidth = 3;
    for (let i = -1; i <= 1; i++) { const ox = W / 2 + i * 60 * -w.z, oy = W / 2 + i * 60 * w.x; g.beginPath(); g.moveTo(ox - w.x * 40, oy - w.z * 40); g.lineTo(ox + w.x * 40, oy + w.z * 40); g.stroke(); }
    g.translate(W / 2, W / 2); g.rotate(-P.heading);
    g.fillStyle = '#7a2b1c'; g.strokeStyle = '#efe4c8'; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(18, 0); g.lineTo(-11, 10); g.lineTo(-6, 0); g.lineTo(-11, -10); g.closePath(); g.fill(); g.stroke();
    g.restore();
    // N mark.
    g.font = '700 22px "Cormorant Garamond", Georgia, serif'; g.fillStyle = '#7a2b1c'; g.textAlign = 'center'; g.fillText('N', W / 2, 26);
  }

  // ---------- Full chart ----------
  function open() {
    NK.ui.showModal(`
      <div class="sheet chart-sheet">
        <button class="close-x" data-close>×</button>
        <div class="chart-bar">
          <div><div class="kicker">The pilot's chart · ${NK.game.dateLabel()}</div><h2 style="margin:2px 0 0">The Nusantara &amp; the Spice Islands</h2></div>
          <div class="legend">
            <span><i style="background:#2a2017"></i>Port</span><span><i style="background:#b8873d"></i>Charted (docked)</span>
            <span><i style="background:#3f7a2a"></i>Charter bound</span><span><i style="background:#a3321f"></i>Hostile sail</span>
            <span style="color:#2f5c6b">➝ ${NK.game.season().name} winds</span>
          </div>
          <div id="chart-actions"></div>
        </div>
        <div class="chart-wrap"><canvas id="chart-cv"></canvas><div id="chart-tip"></div></div>
      </div>`, 'chart');
    cv = NK.$('chart-cv'); ctx = cv.getContext('2d');
    const r = cv.getBoundingClientRect(); cv.width = r.width * devicePixelRatio; cv.height = r.height * devicePixelRatio;
    const w = NK.world;
    view.scale = baseScale = Math.min(cv.width / (w.W * w.U), cv.height / (w.H * w.U));
    view.cx = w.x0 + w.W * w.U / 2; view.cz = w.z0 + w.H * w.U / 2;
    cv.addEventListener('wheel', e => { e.preventDefault(); const f = e.deltaY > 0 ? 0.85 : 1.18; zoomAt(e, f); }, { passive: false });
    cv.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, moved: 0 }; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', e => {
      if (drag) { const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.moved += Math.abs(dx) + Math.abs(dy); drag.x = e.clientX; drag.y = e.clientY; view.cx -= dx * devicePixelRatio / view.scale; view.cz -= dy * devicePixelRatio / view.scale; draw(); }
      pick(e);
    });
    cv.addEventListener('pointerup', e => { const click = drag && drag.moved < 6; drag = null; if (click && hover) plot(hover); });
    actions(); draw();
  }
  function zoomAt(e, f) {
    const r = cv.getBoundingClientRect();
    const mx = (e.clientX - r.left) * devicePixelRatio, my = (e.clientY - r.top) * devicePixelRatio;
    const wx = view.cx + (mx - cv.width / 2) / view.scale, wz = view.cz + (my - cv.height / 2) / view.scale;
    view.scale = NK.clamp(view.scale * f, 0.005, 0.2);
    view.cx = wx - (mx - cv.width / 2) / view.scale; view.cz = wz - (my - cv.height / 2) / view.scale;
    draw();
  }
  const sx = x => cv.width / 2 + (x - view.cx) * view.scale, sz = z => cv.height / 2 + (z - view.cz) * view.scale;
  function draw() {
    if (!cv) return;
    const w = NK.world, g = ctx, st = NK.game.state, P = NK.player, dpr = devicePixelRatio;
    g.fillStyle = '#a9bdb8'; g.fillRect(0, 0, cv.width, cv.height);
    g.imageSmoothingEnabled = true;
    g.drawImage(img, sx(w.x0), sz(w.z0), w.W * w.U * view.scale, w.H * w.U * view.scale);
    // Graticule.
    g.strokeStyle = 'rgba(90,70,45,0.18)'; g.lineWidth = 1; g.font = `${11 * dpr}px Inter, sans-serif`; g.fillStyle = 'rgba(90,70,45,0.55)';
    for (let lng = 95; lng <= 135; lng += 5) { const x = sx(worldProject(0, lng).x); g.beginPath(); g.moveTo(x, 0); g.lineTo(x, cv.height); g.stroke(); g.fillText(lng + '°E', x + 3, 14 * dpr); }
    for (let lat = -10; lat <= 20; lat += 5) { const y = sz(worldProject(lat, 112).z); g.beginPath(); g.moveTo(0, y); g.lineTo(cv.width, y); g.stroke(); g.fillText(Math.abs(lat) + '°' + (lat >= 0 ? 'N' : 'S'), 4, y - 3); }
    // Season winds.
    g.strokeStyle = 'rgba(47,92,107,0.45)'; g.fillStyle = 'rgba(47,92,107,0.45)'; g.lineWidth = 1.5 * dpr;
    for (let lat = -10; lat <= 19; lat += 3) for (let lng = 94; lng <= 134; lng += 3.5) {
      const p = worldProject(lat, lng); if (w.coast(p.x, p.z) > -50) continue;
      const wd = NK.game.wind(p.x, p.z), x = sx(p.x), y = sz(p.z), L = 14 * dpr * (0.6 + wd.strength * 0.4);
      g.beginPath(); g.moveTo(x - wd.x * L, y - wd.z * L); g.lineTo(x + wd.x * L, y + wd.z * L); g.stroke();
      g.beginPath(); g.moveTo(x + wd.x * L, y + wd.z * L); g.lineTo(x + wd.x * L * 0.4 - wd.z * L * 0.35, y + wd.z * L * 0.4 + wd.x * L * 0.35); g.lineTo(x + wd.x * L * 0.4 + wd.z * L * 0.35, y + wd.z * L * 0.4 - wd.x * L * 0.35); g.fill();
    }
    // Course.
    if (P.course) {
      g.strokeStyle = '#3f7a2a'; g.lineWidth = 2.5 * dpr; g.setLineDash([7 * dpr, 5 * dpr]); g.beginPath(); g.moveTo(sx(P.pos.x), sz(P.pos.z));
      for (let i = P.course.i; i < P.course.path.length; i++) g.lineTo(sx(P.course.path[i][0]), sz(P.course.path[i][1]));
      g.stroke(); g.setLineDash([]);
    }
    // Ports.
    NK.ports.list.forEach(p => {
      const x = sx(p.x), y = sz(p.z), known = st.known[p.name], dest = st.contract && st.contract.destIdx === p.idx;
      const r = (p.entrepot ? 6 : 4.5) * dpr;
      g.fillStyle = dest ? '#3f7a2a' : known ? '#b8873d' : '#2a2017';
      g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
      g.strokeStyle = '#efe4c8'; g.lineWidth = 1.5 * dpr; g.stroke();
      if (hover === p) { g.strokeStyle = '#7a2b1c'; g.lineWidth = 2 * dpr; g.beginPath(); g.arc(x, y, r + 5 * dpr, 0, 7); g.stroke(); }
      // Minor ports name themselves once you zoom in, or once they matter to you.
      if (!p.entrepot && !known && !dest && hover !== p && view.scale < baseScale * 1.7) return;
      g.font = `${p.entrepot ? 600 : 500} ${(p.entrepot ? 17 : 14) * dpr}px "Cormorant Garamond", Georgia, serif`;
      g.fillStyle = '#2a2017'; g.textAlign = 'left'; g.fillText(p.name, x + r + 4 * dpr, y + 4 * dpr);
    });
    // Ship.
    g.save(); g.translate(sx(P.pos.x), sz(P.pos.z)); g.rotate(-P.heading);
    g.fillStyle = '#7a2b1c'; g.strokeStyle = '#efe4c8'; g.lineWidth = 2 * dpr;
    g.beginPath(); g.moveTo(14 * dpr, 0); g.lineTo(-9 * dpr, 8 * dpr); g.lineTo(-5 * dpr, 0); g.lineTo(-9 * dpr, -8 * dpr); g.closePath(); g.fill(); g.stroke();
    g.restore();
    // Hostile sails we've sighted.
    NK.fleet.ships.forEach(a => { if (!a.sinking && NK.fleet.hostile(a)) { g.fillStyle = '#a3321f'; g.beginPath(); g.arc(sx(a.pos.x), sz(a.pos.z), 3.5 * dpr, 0, 7); g.fill(); } });
  }
  function pick(e) {
    const r = cv.getBoundingClientRect(), mx = (e.clientX - r.left) * devicePixelRatio, my = (e.clientY - r.top) * devicePixelRatio;
    let best = null, bd = 16 * devicePixelRatio;
    NK.ports.list.forEach(p => { const d = Math.hypot(sx(p.x) - mx, sz(p.z) - my); if (d < bd) { bd = d; best = p; } });
    if (best !== hover) { hover = best; draw(); }
    const tip = NK.$('chart-tip');
    if (!hover) { tip.style.display = 'none'; return; }
    const st = NK.game.state, k = st.known[hover.name], f = hover.faction ? FACTIONS[hover.faction] : null;
    const tr = NK.econ.TRADE[hover.name] || { prod: [], want: [] };
    tip.innerHTML = `<b>${hover.name}</b><br>${f ? f.name + (f.ruler ? ', ' + f.ruler : '') : 'Independent port'}` +
      (k ? `<br>Grows: ${tr.prod.join(', ')}<br>Wants: ${tr.want.join(', ')}<br><i>Charted on day ${k.day}</i>` : `<br><i>Not yet visited. Its market is hearsay.</i>`) +
      `<br><span style="color:#e8c47a">Click to plot a course</span>`;
    tip.style.display = 'block';
    tip.style.left = Math.min(e.clientX - r.left + 16, r.width - 290) + 'px'; tip.style.top = (e.clientY - r.top + 12) + 'px';
  }
  function plot(p) {
    if (NK.player.setCourse(p)) {
      NK.events.emit('toast', `Course plotted for ${p.name}. Press R to give the pilot the helm.`, 'good');
      actions(); draw();
    }
  }
  function actions() {
    const el = NK.$('chart-actions'); if (!el) return;
    const P = NK.player;
    el.innerHTML = P.course
      ? `<span class="sub" style="margin-right:10px">Bound for <b>${P.course.port.name}</b></span><button class="btn go" id="ca-pilot">${P.autopilot ? 'Pilot has the helm' : 'Give the pilot the helm (R)'}</button> <button class="btn" id="ca-clear">Clear course</button>`
      : `<span class="sub">Click a port to plot a course. Drag to pan, scroll to zoom.</span>`;
    const a = NK.$('ca-pilot'); if (a) a.onclick = () => { NK.player.toggleAutopilot(true); NK.ui.closeModal(); };
    const c = NK.$('ca-clear'); if (c) c.onclick = () => { P.course = null; P.autopilot = false; actions(); draw(); };
  }

  return { bake, drawMini, open, get image() { return img; } };
})();
