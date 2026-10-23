// ============ NAKHODA: AT THE HELM ============
// Your ship, the wind in her sails, and the eye that follows her: sailing
// physics on a points-of-sail polar, rudder and heel, grounding on reefs,
// an orbiting chase camera, and a pilot who can hold a course you plot on
// the chart (tacking upwind when he has to).

NK.player = (function () {
  const P = {
    pos: new THREE.Vector3(), heading: 0, speed: 0, sail: 0, sailTarget: 0, rudder: 0,
    hp: 600, heel: 0, pitch: 0, ship: null, group: null, tier: -1,
    reload: { left: 0, right: 0 }, course: null, autopilot: false, tack: 1, tackTimer: 0, aground: 0
  };
  const keys = {};
  const cam = { yaw: Math.PI, pitch: 0.22, dist: 70, tdist: 70, lastInput: -99, free: false };
  let camera, scene;

  // ---------- Points of sail ----------
  // a = angle off the wind's source (0 = head to wind, PI = dead downwind)
  function polar(a) {
    if (a < 0.62) return -0.08;
    if (a < 1.05) return NK.lerp(0.15, 0.78, (a - 0.62) / 0.43);
    if (a < 1.95) return NK.lerp(0.78, 1.0, (a - 1.05) / 0.9);
    if (a < 2.6) return NK.lerp(1.0, 0.92, (a - 1.95) / 0.65);
    return NK.lerp(0.92, 0.8, (a - 2.6) / 0.54);
  }
  function pointOfSail(a) {
    if (a < 0.62) return 'In irons';
    if (a < 1.05) return 'Close-hauled';
    if (a < 1.95) return 'Beam reach';
    if (a < 2.6) return 'Broad reach';
    return 'Running';
  }
  const fwd = h => [Math.cos(h), -Math.sin(h)];

  function rebuild() {
    const st = NK.game.state;
    if (P.group) scene.remove(P.group);
    P.ship = NK.ships.build(st.tier, { flag: 0xb8873d, sail: st.seaLord ? 'royal' : 'mat' });
    P.group = P.ship.group; scene.add(P.group);
    P.tier = st.tier;
  }

  function init(sc, cm) {
    scene = sc; camera = cm;
    rebuild();
    const st = NK.game.state;
    P.hp = NK.game.maxHp();
    const r = st.resume;
    if (r && NK.world.coast(r.x, r.z) < -10) { P.pos.set(r.x, 0, r.z); P.heading = r.heading; if (r.hp) P.hp = NK.clamp(r.hp, 50, NK.game.maxHp()); }
    else placeAt(NK.ports.list[0]);
    cam.yaw = P.heading + Math.PI;
    bindInput();
  }
  function placeAt(port) {
    P.pos.set(port.ax - port.nx * 10, 0, port.az - port.nz * 10);
    P.heading = Math.atan2(port.nz, -port.nx);   // bow pointing out to sea
    P.speed = 0; P.sail = P.sailTarget = 0;
  }

  // ---------- Input ----------
  function bindInput() {
    window.addEventListener('keydown', e => {
      if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      const k = e.key.toLowerCase(); keys[k] = true;
      if (NK.ui && NK.ui.modal()) { if (k === 'escape' || k === 'm') NK.ui.closeModal(); return; }
      if (k === 'w' || k === 'arrowup') stepSail(1);
      if (k === 's' || k === 'arrowdown') stepSail(-1);
      if (k === 'q') NK.fleet.fire(P, 'left');
      if (k === 'e') NK.fleet.fire(P, 'right');
      if (k === 'f') NK.ui.interact();
      if (k === 'm') NK.ui.openChart();
      if (k === 't') NK.ui.toggleFairWinds();
      if (k === 'r') toggleAutopilot();
      if (k === 'c') { cam.free = false; cam.lastInput = -99; }
      if (k === 'escape') NK.ui.togglePause();
    });
    window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
    const el = NK.renderer.domElement;
    let drag = null, pinch = null;
    el.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY }; el.setPointerCapture(e.pointerId); });
    el.addEventListener('pointermove', e => {
      if (!drag || pinch) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag = { x: e.clientX, y: e.clientY };
      cam.yaw -= dx * 0.006; cam.pitch = NK.clamp(cam.pitch + dy * 0.004, 0.04, 1.25);
      cam.lastInput = NK.T; cam.free = true;
    });
    el.addEventListener('pointerup', () => { drag = null; });
    el.addEventListener('wheel', e => { cam.tdist = NK.clamp(cam.tdist * (1 + Math.sign(e.deltaY) * 0.12), 22, 420); e.preventDefault(); }, { passive: false });
    el.addEventListener('touchstart', e => { if (e.touches.length === 2) pinch = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); }, { passive: true });
    el.addEventListener('touchmove', e => {
      if (e.touches.length === 2 && pinch) {
        const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        cam.tdist = NK.clamp(cam.tdist * pinch / d, 22, 420); pinch = d;
      }
    }, { passive: true });
    el.addEventListener('touchend', e => { if (e.touches.length < 2) pinch = null; });
  }
  function stepSail(d) {
    const steps = [0, 0.5, 1];
    let i = steps.findIndex(v => Math.abs(v - P.sailTarget) < 0.01); if (i < 0) i = 0;
    P.sailTarget = steps[NK.clamp(i + d, 0, 2)];
    NK.events.emit('sail', P.sailTarget);
  }
  function toggleAutopilot(force) {
    if (!P.course) { NK.events.emit('toast', 'Plot a course on the chart first (M).', 'info'); return; }
    P.autopilot = force !== undefined ? force : !P.autopilot;
    if (P.autopilot && P.sailTarget === 0) P.sailTarget = 1;
    NK.events.emit('toast', P.autopilot ? 'The pilot has the helm. Steer to take it back.' : 'You have the helm.', 'info');
  }
  function setCourse(port) {
    const path = NK.world.route(P.pos.x, P.pos.z, port.ax, port.az);
    if (!path) { NK.events.emit('toast', 'No pilot knows a sea road there.', 'bad'); return false; }
    path.push([port.ax, port.az]);
    P.course = { port, path, i: 1 };
    return true;
  }

  // ---------- Physics ----------
  function update(dt) {
    const st = NK.game.state;
    if (st.tier !== P.tier) rebuild();
    const docked = NK.ui && NK.ui.docked();
    const w = NK.game.wind(P.pos.x, P.pos.z);
    // Rudder: manual input, or the pilot.
    let steer = (keys.a || keys.arrowleft || NK.ui.touch.left ? 1 : 0) - (keys.d || keys.arrowright || NK.ui.touch.right ? 1 : 0);
    if (steer && P.autopilot) { P.autopilot = false; NK.events.emit('toast', 'You have the helm.', 'info'); }
    if (P.autopilot && P.course) steer = pilot(w, dt);
    P.rudder += (steer - P.rudder) * Math.min(1, dt * 4);

    const from = Math.atan2(-w.z, -w.x);                          // direction the wind comes from (in x,z)
    const hv = Math.atan2(-Math.sin(P.heading), Math.cos(P.heading));  // heading as an x,z angle
    const off = Math.abs(NK.wrapAngle(hv - from));
    P.offWind = off;
    P.eff = polar(off);
    P.sail += (P.sailTarget - P.sail) * Math.min(1, dt * 0.9);
    const hullFactor = 0.6 + 0.4 * (P.hp / NK.game.maxHp());
    const max = NK.game.maxSpeed() * hullFactor;
    const target = docked ? 0 : max * P.eff * P.sail * (0.45 + w.strength * 0.55);
    P.speed += (target - P.speed) * Math.min(1, dt * (target > P.speed ? 0.22 : 0.35));
    if (P.sail < 0.05) P.speed *= Math.pow(0.6, dt);
    const tierTurn = NK.game.TIERS[st.tier].turn;
    const steerage = 0.25 + 0.75 * NK.clamp(Math.abs(P.speed) / 8, 0, 1);
    P.heading += P.rudder * tierTurn * steerage * dt * 0.55;

    const [fx, fz] = fwd(P.heading);
    let nx = P.pos.x + fx * P.speed * dt + w.x * P.sail * w.strength * dt * 0.6;
    let nz = P.pos.z + fz * P.speed * dt + w.z * P.sail * w.strength * dt * 0.6;
    // Reefs and beaches.
    const L = P.ship.L * 0.5;
    const bow = NK.world.height(nx + fx * L, nz + fz * L);
    const mid = NK.world.height(nx, nz);
    if (bow > -0.6 || mid > -0.8) {
      if (P.speed > 7 && P.aground <= 0) { damage(P.speed * 9, 'reef'); NK.events.emit('toast', 'Aground! Coral grinds the hull.', 'bad'); NK.events.emit('thud'); }
      P.aground = 1.5;
      P.speed = -Math.abs(P.speed) * 0.25 - 1.5;
      nx = P.pos.x - fx * 1.5; nz = P.pos.z - fz * 1.5;
    }
    P.aground -= dt;
    if (!NK.world.inBounds(nx, nz)) { nx = P.pos.x; nz = P.pos.z; P.speed *= 0.5; }
    P.pos.x = nx; P.pos.z = nz;

    // Ride the swell.
    const t = NK.T, wh = NK.water.waveHeight;
    const yb = wh(P.pos.x + fx * L, P.pos.z + fz * L, t), ys = wh(P.pos.x - fx * L, P.pos.z - fz * L, t);
    const yl = wh(P.pos.x - fz * 4, P.pos.z + fx * 4, t), yr = wh(P.pos.x + fz * 4, P.pos.z - fx * 4, t);
    P.pos.y = (yb + ys + yl + yr) / 4 - 0.35;
    // Heel to leeward: the wind's push across the beam, held by the sail.
    const side = Math.sin(NK.wrapAngle(hv - from));
    const heelT = -side * P.sail * w.strength * 0.16 * (off > 0.62 ? 1 : 0.3) + P.rudder * P.speed * 0.004;
    P.heel += (heelT - P.heel) * Math.min(1, dt * 1.5);
    P.group.position.copy(P.pos);
    P.group.rotation.set(0, 0, 0);
    P.group.rotateY(P.heading);
    P.group.rotateZ(Math.atan2(yb - ys, L * 2) * 0.8);
    P.group.rotateX(Math.atan2(yl - yr, 8) * 0.6 + P.heel);

    // Trim: sheet the sails toward the wind's line.
    const rel = NK.wrapAngle(from - hv);
    const trim = NK.clamp(rel * 0.45, -1.35, 1.35);
    NK.ships.animateSails(P.ship, -trim, P.sail, P.eff > 0 ? -Math.sign(rel) * (0.4 + P.eff * 0.8) * P.sail : 0, t);

    P.reload.left = Math.max(0, P.reload.left - dt); P.reload.right = Math.max(0, P.reload.right - dt);
    if (NK.T - (P.wakeT || 0) > 0.05 && P.speed > 3) { P.wakeT = NK.T; NK.fleet.wake(P.pos, P.heading, P.speed, P.ship.L, P.ship.B); }
    updateCamera(dt);
  }

  function pilot(w, dt) {
    const c = P.course; const tgt = c.path[c.i];
    const dx = tgt[0] - P.pos.x, dz = tgt[1] - P.pos.z, d = Math.hypot(dx, dz);
    if (d < 60) {
      c.i++;
      if (c.i >= c.path.length) { P.autopilot = false; P.sailTarget = 0.5; NK.events.emit('toast', `Landfall: ${c.port.name} off the bow.`, 'good'); P.course = null; return 0; }
    }
    let want = Math.atan2(-dz, dx);                             // heading convention
    // Can't point into the wind: tack across it.
    const from = Math.atan2(-w.z, -w.x);
    const wantXZ = Math.atan2(dz, dx);
    if (Math.abs(NK.wrapAngle(wantXZ - from)) < 0.85) {
      P.tackTimer -= dt;
      if (P.tackTimer <= 0) { P.tack *= -1; P.tackTimer = 40 + Math.random() * 20; }
      const tackXZ = from + P.tack * 0.95;
      want = Math.atan2(-Math.sin(tackXZ), Math.cos(tackXZ));
      const ahead = NK.world.coast(P.pos.x + Math.cos(tackXZ) * 160, P.pos.z + Math.sin(tackXZ) * 160);
      if (ahead > -25) { P.tack *= -1; P.tackTimer = 40; }
    }
    const err = NK.wrapAngle(want - P.heading);
    return NK.clamp(err * 2.2, -1, 1);
  }

  function damage(v, cause) {
    P.hp -= v;
    NK.events.emit('hurt', v, cause);
    if (P.hp <= 0) sink();
  }
  function sink() {
    const st = NK.game.state;
    const lostGold = Math.floor(st.gold * 0.2), lostCargo = NK.game.holdUsed();
    st.cargo = {}; NK.game.addGold(-lostGold); NK.game.addRep(-5);
    if (st.contract) st.contract = null;
    // Washed up at the nearest friendly-enough port.
    const near = NK.ports.nearest(P.pos.x, P.pos.z).port;
    placeAt(near);
    P.hp = NK.game.maxHp(); P.course = null; P.autopilot = false;
    st.day++;
    NK.events.emit('story', 'The Sea Takes Back',
      `Your ${NK.game.TIERS[st.tier].n} goes down. ${lostCargo ? `<b>${lostCargo} bales of cargo</b> sink with her, and ` : ''}<b>${lostGold} pisis</b> go to salvagers and debts.` +
      `<p><i>"Everything he has, the sea gave him, and the sea can take back."</i></p><p>The crew drags you ashore at ${near.name}. A patched hull, a borrowed sail, and Day ${st.day} dawns. Sail again.</p>`);
    NK.game.save();
  }

  // ---------- Camera ----------
  function updateCamera(dt) {
    cam.dist += (cam.tdist - cam.dist) * Math.min(1, dt * 4);
    if (!cam.free || NK.T - cam.lastInput > 6) {
      cam.free = false;
      const behind = P.heading + Math.PI;
      // Camera yaw is measured in the same x/-z frame as the heading.
      cam.yaw += NK.wrapAngle(behind - cam.yaw) * Math.min(1, dt * 0.8);
    }
    const scale = P.ship.L / 20;
    const d = cam.dist * Math.max(0.8, scale);
    const cx = P.pos.x + Math.cos(cam.yaw) * Math.cos(cam.pitch) * d;
    const cz = P.pos.z - Math.sin(cam.yaw) * Math.cos(cam.pitch) * d;
    let cy = P.pos.y + 4 + Math.sin(cam.pitch) * d;
    const ground = NK.world.height(cx, cz);
    const waterY = NK.water.waveHeight(cx, cz, NK.T);
    cy = Math.max(cy, Math.max(ground, waterY) + 3);
    camera.position.set(cx, cy, cz);
    camera.lookAt(P.pos.x, P.pos.y + 6 * scale + d * 0.05, P.pos.z);
  }

  return Object.assign(P, { init, update, damage, setCourse, toggleAutopilot, stepSail, placeAt, pointOfSail, keys, cam, rebuild });
})();
