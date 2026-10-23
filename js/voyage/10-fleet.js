// ============ NAKHODA: THE LIVING SEA ============
// Other ships keep the sea alive around you: merchants working the lanes
// between real ports, pirates who haunt the Sulu Sea and the Strait (and
// grow bolder as your name grows), and royal patrols who turn on you if
// their court does. Also: broadsides, cannonballs, smoke, spray, wakes,
// sinking hulls and the salvage they leave behind.

NK.fleet = (function () {
  let scene;
  const ships = [], balls = [], loot = [];
  let spawnTimer = 0;
  const ballGeo = new THREE.SphereGeometry(0.45, 8, 6);
  const ballMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5, metalness: 0.6 });
  const crateMat = new THREE.MeshStandardMaterial({ color: 0x9a7448, roughness: 0.9 });
  const crateGeo = new THREE.BoxGeometry(2.2, 1.6, 2.2);

  // ---------- Particles: one draw call for all smoke, spray, flash and wake ----------
  const MAX_P = 2400;
  const pPos = new Float32Array(MAX_P * 3), pCol = new Float32Array(MAX_P * 4), pSize = new Float32Array(MAX_P);
  const pData = []; for (let i = 0; i < MAX_P; i++) pData.push({ life: 0 });
  let pNext = 0, points;
  function initParticles() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(pCol, 4));
    g.setAttribute('size', new THREE.BufferAttribute(pSize, 1));
    const m = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, fog: true,
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { scale: { value: 600 } }]),
      vertexShader: `attribute float size; attribute vec4 color; varying vec4 vC; uniform float scale;
        #include <fog_pars_vertex>
        void main(){ vC = color; vec4 mvPosition = modelViewMatrix * vec4(position,1.0); gl_PointSize = size * scale / -mvPosition.z; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
        }`,
      fragmentShader: `varying vec4 vC;
        #include <fog_pars_fragment>
        void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d); if (r > 0.5) discard; gl_FragColor = vec4(vC.rgb, vC.a * smoothstep(0.5, 0.15, r));
        #include <fog_fragment>
        }`
    });
    points = new THREE.Points(g, m); points.frustumCulled = false; points.renderOrder = 5;
    scene.add(points);
  }
  function emit(x, y, z, vx, vy, vz, size, grow, life, r, g, b, a, drag) {
    const i = pNext; pNext = (pNext + 1) % MAX_P;
    Object.assign(pData[i], { x, y, z, vx, vy, vz, size, grow, life, max: life, r, g, b, a, drag: drag || 0 });
  }
  function updateParticles(dt) {
    for (let i = 0; i < MAX_P; i++) {
      const p = pData[i];
      if (p.life <= 0) { pSize[i] = 0; continue; }
      p.life -= dt;
      const k = Math.pow(1 - p.drag, dt * 60);
      p.vx *= k; p.vz *= k; p.vy = p.vy * k + (p.drag ? 0 : -18 * dt);
      p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
      p.size += p.grow * dt;
      const f = Math.max(0, p.life / p.max);
      pPos[i * 3] = p.x; pPos[i * 3 + 1] = p.y; pPos[i * 3 + 2] = p.z;
      pCol[i * 4] = p.r; pCol[i * 4 + 1] = p.g; pCol[i * 4 + 2] = p.b; pCol[i * 4 + 3] = p.a * f;
      pSize[i] = p.size;
    }
    const g = points.geometry;
    g.attributes.position.needsUpdate = g.attributes.color.needsUpdate = g.attributes.size.needsUpdate = true;
    points.material.uniforms.scale.value = window.innerHeight * 0.9;
  }
  const night = () => 1 - NK.sky.state.night * 0.75;
  function splash(x, z, big) {
    const n = big ? 14 : 8, l = night();
    for (let i = 0; i < n; i++) emit(x, 0.5, z, (Math.random() - 0.5) * 8, 10 + Math.random() * (big ? 16 : 10), (Math.random() - 0.5) * 8, 1.5 + Math.random(), 2, 1.2, 0.9 * l, 0.95 * l, 1 * l, 0.85);
  }
  function smoke(x, y, z, dx, dz) {
    for (let i = 0; i < 4; i++) emit(x, y, z, dx * 14 + (Math.random() - 0.5) * 3, 1.5 + Math.random() * 2, dz * 14 + (Math.random() - 0.5) * 3, 3 + Math.random() * 2, 7, 3.5 + Math.random(), 0.82, 0.8, 0.76, 0.6, 0.04);
    emit(x, y, z, dx * 20, 0, dz * 20, 4, 10, 0.18, 1, 0.75, 0.35, 1, 0.05);
  }
  function fire(x, y, z) {
    for (let i = 0; i < 3; i++) emit(x + (Math.random() - 0.5) * 3, y, z + (Math.random() - 0.5) * 3, 0, 4, 0, 3, 5, 1, 1, 0.55, 0.2, 0.9, 0.02);
    emit(x, y + 2, z, (Math.random() - 0.5), 4, (Math.random() - 0.5), 4, 8, 4, 0.2, 0.18, 0.17, 0.5, 0.02);
  }
  function wake(pos, heading, speed, L, B) {
    const fx = Math.cos(heading), fz = -Math.sin(heading), l = night();
    const sx = pos.x - fx * L * 0.48, sz = pos.z - fz * L * 0.48;
    [-1, 1].forEach(sd => emit(sx - fz * sd * B * 0.4, 0.25, sz + fx * sd * B * 0.4, -fz * sd * 2.2, 0, fx * sd * 2.2, 1.4, 2.6 + speed * 0.06, 3.2, 0.92 * l, 0.96 * l, 0.98 * l, 0.45, 0.02));
    if (Math.random() < 0.5) emit(pos.x + fx * L * 0.48, 0.6, pos.z + fz * L * 0.48, (Math.random() - 0.5) * 3, 2 + speed * 0.2, (Math.random() - 0.5) * 3, 1.2, 2, 0.8, 0.95 * l, 0.97 * l, 1 * l, 0.55);
  }

  // ---------- Who's out there ----------
  const zone = (lat, lng, la, lb, oa, ob) => lat > la && lat < lb && lng > oa && lng < ob;
  function danger(x, z) {
    const { lat, lng } = worldUnproject(x, z);
    let d = 0.25;
    if (zone(lat, lng, 4, 9, 118.5, 123.5)) d += 1.0;            // Sulu Sea raiders
    if (zone(lat, lng, 0, 5.5, 97.5, 104)) d += 0.55;            // the Strait
    if (zone(lat, lng, -1.5, 2, 103, 106)) d += 0.7;             // Riau, Orang Laut waters
    if (zone(lat, lng, -9, -6, 119, 125)) d += 0.3;              // Flores Sea
    return d + NK.sky.state.night * 0.35;
  }
  function threat() { const s = NK.game.state; return 1 + s.tier * 0.22 + Math.min(s.stats.piratesSunk * 0.04, 1.2); }

  function spawnPoint(px, pz, rmin, rmax) {
    for (let t = 0; t < 30; t++) {
      const a = Math.random() * Math.PI * 2, r = rmin + Math.random() * (rmax - rmin);
      const x = px + Math.cos(a) * r, z = pz + Math.sin(a) * r;
      if (NK.world.inBounds(x, z) && NK.world.coast(x, z) < -90) return [x, z];
    }
    return null;
  }
  function spawn(kind, faction) {
    const P = NK.player.pos;
    const sp = spawnPoint(P.x, P.z, 1700, 2600); if (!sp) return;
    const s = NK.game.state;
    let tier, sail, flag;
    if (kind === 'pirate') { tier = Math.min(4, Math.floor(Math.random() * (1.6 + s.tier * 0.6))); sail = 'dark'; flag = 0x1a1a1a; }
    else if (kind === 'patrol') { tier = 3; sail = 'royal'; flag = new THREE.Color(FACTIONS[faction].color).getHex(); }
    else { tier = Math.floor(Math.random() * 5); sail = Math.random() < 0.5 ? 'mat' : 'pale'; flag = faction ? new THREE.Color(FACTIONS[faction].color).getHex() : 0x9a8f7a; }
    const built = NK.ships.build(tier, { sail, flag });
    scene.add(built.group);
    const mult = kind === 'pirate' ? threat() : kind === 'patrol' ? 1.6 : 1;
    const hp = Math.round([260, 380, 520, 700, 1000][tier] * mult);
    const ai = { kind, faction, tier, ship: built, pos: new THREE.Vector3(sp[0], 0, sp[1]), heading: Math.random() * 6.28, speed: 0, hp, maxHp: hp, mult, reload: 3, path: null, i: 0, sinking: 0, sail: 1 };
    if (kind === 'merchant') {
      const options = NK.ports.list.filter(p => { const d = Math.hypot(p.x - sp[0], p.z - sp[1]); return d > 1500 && d < 9000; });
      const dest = options[Math.floor(Math.random() * options.length)];
      if (dest) { ai.dest = dest; ai.path = NK.world.route(sp[0], sp[1], dest.ax, dest.az); ai.i = 1; ai.faction = dest.faction; }
    }
    ships.push(ai);
  }
  function populate() {
    const P = NK.player.pos;
    const near = k => ships.filter(a => a.kind === k && !a.sinking).length;
    if (near('merchant') < (NK.isMobile ? 4 : 7)) spawn('merchant');
    // A grace of two days before the raiders notice a new kelulus.
    const st = NK.game.state;
    const pir = st.day < 3 && st.tier === 0 ? 0 : NK.clamp(Math.floor(danger(P.x, P.z) * 1.6 + st.tier * 0.35), 0, 4);
    if (near('pirate') < pir && Math.random() < 0.5) spawn('pirate');
    // A royal patrol works the waters off each capital.
    const port = NK.ports.nearest(P.x, P.z);
    if (port.port.faction && port.dist < 3000 && near('patrol') < 1 && Math.random() < 0.3) spawn('patrol', port.port.faction);
  }

  // ---------- AI seamanship ----------
  function steerTo(ai, tx, tz) {
    const want = Math.atan2(-(tz - ai.pos.z), tx - ai.pos.x);
    let h = want;
    // Feel for the reef: probe ahead and to either bow.
    const probe = a => NK.world.coast(ai.pos.x + Math.cos(a) * 140, ai.pos.z - Math.sin(a) * 140);
    if (probe(ai.heading) > -30) h = probe(ai.heading + 0.7) < probe(ai.heading - 0.7) ? ai.heading + 0.9 : ai.heading - 0.9;
    return h;
  }
  function hostile(ai) {
    if (ai.kind === 'pirate') return true;
    if (ai.kind === 'patrol') return NK.game.factionRep(ai.faction) <= -35 || ai.provoked;
    return !!ai.provoked && ai.kind === 'patrol';
  }
  function updateAI(ai, dt) {
    const P = NK.player, w = NK.game.wind(ai.pos.x, ai.pos.z);
    const dP = Math.hypot(P.pos.x - ai.pos.x, P.pos.z - ai.pos.z);
    let th = ai.heading, sail = 1;
    const sight = 950 * (1 - NK.sky.state.night * 0.45) * (1 - NK.sky.state.mist * 0.5);
    if (ai.sinking) return sinkStep(ai, dt);
    if (hostile(ai) && (dP < sight || ai.engaged) && !NK.ui.docked()) {
      ai.engaged = dP < sight * 1.5;
      if (ai.hp < ai.maxHp * 0.28) { th = Math.atan2(-(ai.pos.z - P.pos.z), ai.pos.x - P.pos.x); ai.fleeing = true; }
      else if (dP > 200) th = steerTo(ai, P.pos.x + Math.cos(P.heading) * P.speed * 4, P.pos.z - Math.sin(P.heading) * P.speed * 4);
      else {
        // Run alongside and present a broadside.
        const bearing = Math.atan2(-(P.pos.z - ai.pos.z), P.pos.x - ai.pos.x);
        const rel = NK.wrapAngle(bearing - ai.heading);
        th = bearing - Math.sign(rel || 1) * Math.PI / 2 * (dP < 90 ? 1.3 : 0.9);
      }
      ai.reload -= dt;
      if (ai.reload <= 0 && dP < 260) {
        const bearing = Math.atan2(-(P.pos.z - ai.pos.z), P.pos.x - ai.pos.x);
        const rel = NK.wrapAngle(bearing - ai.heading);
        if (Math.abs(Math.abs(rel) - Math.PI / 2) < 0.6) { shoot(ai, rel > 0 ? 'left' : 'right', P.pos, true); ai.reload = 6 + Math.random() * 3; }
      }
      if (ai.fleeing && dP > 2600) ai.gone = true;
    } else if (ai.path && ai.i < ai.path.length) {
      const t = ai.path[ai.i];
      if (Math.hypot(t[0] - ai.pos.x, t[1] - ai.pos.z) < 80) ai.i++;
      th = steerTo(ai, t[0], t[1]);
      if (ai.i >= ai.path.length) ai.gone = true;
    } else {
      if (!ai.wander || Math.hypot(ai.wander[0] - ai.pos.x, ai.wander[1] - ai.pos.z) < 120) ai.wander = spawnPoint(ai.pos.x, ai.pos.z, 400, 1200) || [ai.pos.x, ai.pos.z];
      th = steerTo(ai, ai.wander[0], ai.wander[1]);
      sail = 0.7;
    }
    ai.heading += NK.clamp(NK.wrapAngle(th - ai.heading), -1, 1) * dt * 0.35;
    const from = Math.atan2(-w.z, -w.x), hv = Math.atan2(-Math.sin(ai.heading), Math.cos(ai.heading));
    const off = Math.abs(NK.wrapAngle(hv - from));
    const eff = Math.max(0.42, (off < 0.62 ? 0 : off < 1.05 ? 0.5 : 1));   // AI captains tack well enough not to stall
    const max = NK.game.TIERS[ai.tier].spd * (ai.kind === 'pirate' ? 1.05 : 0.85) * (0.5 + 0.5 * ai.hp / ai.maxHp);
    ai.speed += (max * eff * sail * (0.5 + w.strength * 0.5) - ai.speed) * dt * 0.3;
    const nx = ai.pos.x + Math.cos(ai.heading) * ai.speed * dt, nz = ai.pos.z - Math.sin(ai.heading) * ai.speed * dt;
    if (NK.world.height(nx, nz) < -1) { ai.pos.x = nx; ai.pos.z = nz; } else { ai.heading += 0.8 * dt * 3; ai.speed *= 0.5; }
    pose(ai, w, from, hv, off);
    if (Math.random() < 0.3 && ai.speed > 3 && dP < 900) wake(ai.pos, ai.heading, ai.speed, ai.ship.L, ai.ship.B);
    if (dP > 4400) ai.gone = true;
  }
  function pose(ai, w, from, hv, off) {
    const t = NK.T, L = ai.ship.L * 0.5, fx = Math.cos(ai.heading), fz = -Math.sin(ai.heading);
    const yb = NK.water.waveHeight(ai.pos.x + fx * L, ai.pos.z + fz * L, t), ys = NK.water.waveHeight(ai.pos.x - fx * L, ai.pos.z - fz * L, t);
    ai.pos.y = (yb + ys) / 2 - 0.35;
    const g = ai.ship.group;
    g.position.copy(ai.pos); g.rotation.set(0, 0, 0); g.rotateY(ai.heading);
    g.rotateZ(Math.atan2(yb - ys, L * 2) * 0.8);
    const rel = NK.wrapAngle(from - hv);
    g.rotateX(-Math.sin(NK.wrapAngle(hv - from)) * 0.1);
    if (Math.hypot(ai.pos.x - NK.player.pos.x, ai.pos.z - NK.player.pos.z) < 900)
      NK.ships.animateSails(ai.ship, -NK.clamp(rel * 0.45, -1.35, 1.35), 1, -Math.sign(rel) * 0.9, t);
  }

  // ---------- Gunnery ----------
  function shoot(shooter, side, aim, isAI) {
    const ship = shooter.ship, g = ship.group;
    g.updateMatrixWorld(true);
    const guns = ship.guns[side];
    const sd = side === 'left' ? 1 : -1;
    const nx = Math.cos(shooter.heading + sd * Math.PI / 2), nz = -Math.sin(shooter.heading + sd * Math.PI / 2);
    guns.forEach((local, i) => {
      setTimeout(() => {
        const m = local.clone().applyMatrix4(g.matrixWorld);
        let dx = nx, dz = nz, dist = 190;
        if (aim) {
          const ax = aim.x - m.x, az = aim.z - m.z, d = Math.hypot(ax, az);
          if (d > 10 && (ax * nx + az * nz) / d > 0.6) { dx = ax / d; dz = az / d; dist = NK.clamp(d, 40, 320); }
        }
        const spread = (Math.random() - 0.5) * (isAI ? 0.12 : 0.06);
        const c = Math.cos(spread), s = Math.sin(spread);
        const ddx = dx * c - dz * s, ddz = dx * s + dz * c;
        const vh = 150, tf = dist / vh, vy = 0.5 * 40 * tf - (m.y - 1) / tf;
        const mesh = new THREE.Mesh(ballGeo, ballMat); mesh.position.copy(m); scene.add(mesh);
        const dmg = isAI ? 17 * shooter.mult : 26 * (1 + NK.game.state.upg.guns * 0.18);
        balls.push({ mesh, vx: ddx * vh, vy, vz: ddz * vh, from: shooter, dmg, isAI, life: 6 });
        smoke(m.x, m.y, m.z, ddx, ddz);
        NK.events.emit('cannon', Math.hypot(m.x - NK.player.pos.x, m.z - NK.player.pos.z));
      }, i * 140 + Math.random() * 80);
    });
  }
  // Player broadside: aims at the nearest ship on that beam.
  function playerFire(P, side) {
    if (NK.ui.docked()) return;
    if (P.reload[side] > 0) { NK.events.emit('toast', `${side === 'left' ? 'Port' : 'Starboard'} guns still reloading.`, 'info'); return; }
    const sd = side === 'left' ? 1 : -1;
    const nx = Math.cos(P.heading + sd * Math.PI / 2), nz = -Math.sin(P.heading + sd * Math.PI / 2);
    let best = null, bs = -1;
    ships.forEach(a => {
      if (a.sinking) return;
      const dx = a.pos.x - P.pos.x, dz = a.pos.z - P.pos.z, d = Math.hypot(dx, dz);
      if (d > 330) return;
      const dot = (dx * nx + dz * nz) / d; if (dot < 0.6) return;
      const lead = d / 150;
      const score = dot - d / 600; if (score > bs) { bs = score; best = new THREE.Vector3(a.pos.x + Math.cos(a.heading) * a.speed * lead, 0, a.pos.z - Math.sin(a.heading) * a.speed * lead); }
    });
    shoot({ ship: P.ship, heading: P.heading }, side, best, false);
    P.reload[side] = 7 * (1 - NK.game.state.upg.guns * 0.08);
    NK.events.emit('fired', side);
  }

  function hitTest(b, target, L, B, heading, pos) {
    const dx = b.mesh.position.x - pos.x, dz = b.mesh.position.z - pos.z;
    const fx = Math.cos(heading), fz = -Math.sin(heading);
    const along = dx * fx + dz * fz, across = -dx * fz + dz * fx;
    return Math.abs(along) < L * 0.5 && Math.abs(across) < B * 0.5 + 1 && b.mesh.position.y < pos.y + 6;
  }
  function updateBalls(dt) {
    const P = NK.player;
    for (let i = balls.length - 1; i >= 0; i--) {
      const b = balls[i];
      b.vy -= 40 * dt; b.life -= dt;
      b.mesh.position.x += b.vx * dt; b.mesh.position.y += b.vy * dt; b.mesh.position.z += b.vz * dt;
      let done = false;
      if (b.isAI) {
        if (hitTest(b, P, P.ship.L, P.ship.B, P.heading, P.pos)) { P.damage(b.dmg, 'shot'); fire(b.mesh.position.x, b.mesh.position.y, b.mesh.position.z); NK.events.emit('hit', b.mesh.position, -b.dmg, true); done = true; }
      } else {
        for (const a of ships) {
          if (a.sinking || !hitTest(b, a, a.ship.L, a.ship.B, a.heading, a.pos)) continue;
          a.hp -= b.dmg; a.provoked = true; a.engaged = true;
          fire(b.mesh.position.x, b.mesh.position.y, b.mesh.position.z);
          NK.events.emit('hit', b.mesh.position, -Math.round(b.dmg), false);
          if (a.hp <= 0) sunk(a);
          done = true; break;
        }
      }
      if (!done && b.mesh.position.y < NK.water.waveHeight(b.mesh.position.x, b.mesh.position.z, NK.T)) { splash(b.mesh.position.x, b.mesh.position.z, false); NK.events.emit('splash', Math.hypot(b.mesh.position.x - P.pos.x, b.mesh.position.z - P.pos.z)); done = true; }
      if (done || b.life <= 0) { scene.remove(b.mesh); balls.splice(i, 1); }
    }
  }

  // ---------- Sinking & salvage ----------
  function sunk(a) {
    a.sinking = 0.001;
    const s = NK.game.state, G = NK.econ.GOODS;
    if (a.kind === 'pirate') {
      const gold = Math.round((240 + Math.random() * 360) * (0.8 + a.tier * 0.15));
      s.stats.piratesSunk++; NK.game.addRep(5);
      const near = NK.ports.nearest(a.pos.x, a.pos.z).port; NK.game.addFactionRep(near.faction, 4);
      NK.events.emit('toast', `Pirate penjajap sunk. The coast will hear of it (+5 rep).`, 'good');
      dropLoot(a, gold, Math.random() < 0.5 ? G[[16, 17, 12, 8][Math.floor(Math.random() * 4)]].n : null, 3);
    } else if (a.kind === 'merchant') {
      s.stats.merchantsSunk++; NK.game.addRep(-8);
      NK.game.addFactionRep(a.faction, -20);
      Object.keys(FACTIONS).forEach(k => { if (k !== a.faction) NK.game.addFactionRep(k, -3); });
      NK.events.emit('toast', `A merchant plundered. Word of piracy spreads (−8 rep${a.faction ? ', ' + FACTIONS[a.faction].name + ' −20' : ''}).`, 'bad');
      const want = NK.econ.TRADE[a.dest ? a.dest.name : ''];
      dropLoot(a, Math.round(120 + Math.random() * 230), G[NK.econ.G[want ? want.want[0] : 'Ceramics']].n, 5 + a.tier * 3);
    } else {
      NK.game.addRep(-10); NK.game.addFactionRep(a.faction, -30);
      NK.events.emit('toast', `You sank a royal ship of ${FACTIONS[a.faction].name}. They will not forget.`, 'bad');
      dropLoot(a, 500, null, 0);
    }
    NK.game.save();
  }
  function dropLoot(a, gold, good, qty) {
    const n = 1 + Math.floor(Math.random() * 2) + (good ? 1 : 0);
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(crateGeo, crateMat);
      m.position.set(a.pos.x + (Math.random() - 0.5) * 20, 0, a.pos.z + (Math.random() - 0.5) * 20);
      m.castShadow = true; scene.add(m);
      loot.push({ mesh: m, gold: Math.round(gold / n), good: i === 0 ? good : null, qty, life: 240, spin: Math.random() * 6 });
    }
  }
  function sinkStep(a, dt) {
    a.sinking += dt;
    const g = a.ship.group;
    g.position.y = a.pos.y - a.sinking * 1.2;
    g.rotateX(dt * 0.12); g.rotateZ(dt * 0.05);
    if (Math.random() < 0.3) fire(a.pos.x + (Math.random() - 0.5) * a.ship.L * 0.6, g.position.y + 4, a.pos.z + (Math.random() - 0.5) * 4);
    if (a.sinking > 9) a.gone = true;
  }
  function updateLoot(dt) {
    const P = NK.player;
    for (let i = loot.length - 1; i >= 0; i--) {
      const l = loot[i]; l.life -= dt; l.spin += dt;
      l.mesh.position.y = NK.water.waveHeight(l.mesh.position.x, l.mesh.position.z, NK.T) + 0.1;
      l.mesh.rotation.set(Math.sin(l.spin) * 0.2, l.spin * 0.3, Math.cos(l.spin * 1.3) * 0.2);
      const d = Math.hypot(l.mesh.position.x - P.pos.x, l.mesh.position.z - P.pos.z);
      if (d < P.ship.L * 0.5 + 8) {
        NK.game.addGold(l.gold);
        let msg = `Salvage hauled aboard: ${l.gold} pisis`;
        if (l.good) { const got = NK.game.addCargo(l.good, l.qty, 0); if (got) msg += ` and ${got} ${l.good}`; }
        NK.events.emit('toast', msg + '.', 'good'); NK.events.emit('coins');
        l.life = 0;
      }
      if (l.life <= 0) { scene.remove(l.mesh); loot.splice(i, 1); }
    }
  }

  function update(dt) {
    spawnTimer -= dt;
    if (spawnTimer <= 0) { spawnTimer = 2.5; populate(); }
    for (let i = ships.length - 1; i >= 0; i--) {
      const a = ships[i];
      updateAI(a, dt);
      if (a.gone) { scene.remove(a.ship.group); ships.splice(i, 1); }
    }
    updateBalls(dt); updateLoot(dt); updateParticles(dt);
  }
  function threatNear(r) {
    const P = NK.player.pos;
    return ships.some(a => !a.sinking && hostile(a) && Math.hypot(a.pos.x - P.x, a.pos.z - P.z) < r);
  }
  function clear() { ships.forEach(a => scene.remove(a.ship.group)); ships.length = 0; }

  return {
    init(sc) { scene = sc; initParticles(); },
    get reflectHide() { return points ? [points] : []; },
    update, wake, fire: playerFire, threatNear, hostile, clear, danger, spawn,
    get ships() { return ships; }, get loot() { return loot; }
  };
})();
