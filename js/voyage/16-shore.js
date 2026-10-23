// ============ NAKHODA: ASHORE ============
// Step off the jetty and walk the port. The town's services are people
// now: the syahbandar for charters, a Gujarati merchant at the stalls, the
// shipwright on the beach, a tuak seller under the awning. And the court
// is here too: Hang Tuah on the jetty, the Bendahara before the mosque.
// Characters are CC0 Kenney Mini Characters (assets/models/people).

NK.shore = (function () {
  let scene, camera, port = null, active = false;
  let me = null;                         // { scene, mixer, actions, pos, heading, speed, anim }
  const npcs = [], stalls = [];
  const keys = NK.player.keys;
  const HEIGHT = 4.4;                    // a person, in world units
  const JETTY_TOP = 2.55;
  let nearNpc = null, labelEls = [], built = null;

  // ---------- Who lives here (Melaka) ----------
  const CAST = {
    'Melaka': [
      { id: 'tuah', name: 'Hang Tuah', title: 'Laksamana of Melaka', model: 'male-b', at: [-1, 10, 12], face: 'sea', talk: tuahTalk },
      { id: 'syahbandar', name: 'Syahbandar Raja Mudeliar', title: 'Harbourmaster', model: 'male-e', at: [1, 12, -12], face: 'sea', talk: p => service(p, 'harbour',
        'Four syahbandars keep this harbour: one for the Gujaratis, one for Java and the Moluccas, one for Bengal and Pegu, one for the China junks. I keep the ledger for captains like you.', 'Any charters today?') },
      { id: 'merchant', name: 'Kesava of Cambay', title: 'Gujarati cloth merchant', model: 'male-a', at: [-1, 88, 30], face: 'street', talk: p => service(p, 'market',
        'Cloth from Cambay, porcelain off the China junks. Bring me cloves and I pay better than any man on this waterfront. Bring me nutmeg and I pay better than that.', 'Show me your wares') },
      { id: 'shipwright', name: 'Pak Dollah', title: 'Shipwright', model: 'female-d', at: [1, 4, 46], face: 'sea', talk: p => service(p, 'yard',
        'Teak from Pegu, iron from nobody: a good hull is pegged with wood. Bring her up the beach and I will make her faster, or bigger.', 'Talk about the ship') },
      { id: 'tuak', name: 'Mak Siti', title: 'Tuak seller', model: 'female-a', at: [1, 100, 34], face: 'street', talk: p => service(p, 'tavern',
        'Palm wine, betel, and every rumour on the strait for the price of a cup. Sit. The pilots will be along by dusk.', 'Pour me a cup') },
      { id: 'mutahir', name: 'Tun Mutahir', title: 'Bendahara of Melaka', model: 'male-d', at: [0, 112, 0], face: 'street', talk: mutahirTalk }
    ]
  };
  const TOWNSFOLK = ['female-b', 'female-c', 'female-e', 'female-f', 'male-a', 'male-e'];

  // Place relative to the port: side (-1/1) along the shore, v inland, u offset.
  function local(w, side, v, u) {
    const s = w.square, base = { x: port.x, z: port.z };
    return { x: base.x + port.nx * v + w.tx * u * side, z: base.z + port.nz * v + w.tz * u * side };
  }

  // ---------- Dialogue ----------
  function say(npc, html, choices) {
    NK.ui.showModal(`<div class="sheet story talk"><div class="kicker">${npc.title}</div><h1>${npc.name}</h1>
      <div class="body">${html}</div><div class="actions">${choices.map((c, i) => `<button class="btn ${i === 0 ? 'primary' : ''}" data-c="${i}">${c[0]}</button>`).join('')}</div></div>`, 'talk');
    document.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { const c = choices[+b.dataset.c]; NK.ui.closeModal(); if (c[1]) c[1](); });
  }
  function service(npc, tab, line, ask) {
    say(npc, `<p>"${line}"</p>`, [[ask, () => NK.port.open(port, tab)], ['Another time']]);
  }
  function tuahTalk(npc) {
    const s = NK.game.state, q = s.quests || (s.quests = {});
    const pepper = (s.cargo['Black Pepper'] || { qty: 0 }).qty;
    if (!q.tuah) {
      say(npc, `<p>An old man in a plain sarong watches the strait as if he owns it. Seventy years, four sultans, and the keris Taming Sari at his hip.</p>
        <p>"You have the look of a captain who has not yet decided what he is. Good. Men who have decided are no use to me."</p>
        <p>"The Siamese are restless in the north, and the fleet eats pepper faster than Pasai sends it. Bring me <b>six bales of black pepper</b> and I will remember your name. Pasai and Jambi grow it."</p>`,
        [['I will bring it, Laksamana', () => { q.tuah = 'asked'; NK.ui.toast('Quest: six bales of Black Pepper for Hang Tuah.', 'good'); NK.game.save(); }], ['Not now']]);
    } else if (q.tuah === 'asked' && pepper >= 6) {
      say(npc, `<p>He weighs a bale in one hand without looking at it.</p><p>"Pasai pepper. You did not cheat on the weight. That is rarer than courage on this waterfront."</p>
        <p>"Take this. And when the court asks who you are, they will hear it from me first."</p>`,
        [['Hand over the pepper (+400 pisis, +8 rep, Melaka +12)', () => {
          NK.game.removeCargo('Black Pepper', 6); NK.game.addGold(400); NK.game.addRep(8); NK.game.addFactionRep('malacca', 12);
          q.tuah = 'done'; NK.events.emit('coins'); NK.ui.toast('Hang Tuah will remember your name.', 'good'); NK.game.save();
        }]]);
    } else if (q.tuah === 'asked') {
      say(npc, `<p>"Six bales, nakhoda. You carry ${pepper}. The strait does not pay for intentions."</p>`, [['I will be back']]);
    } else {
      const lines = ['"Foreign envoys hear my name before the Sultan\'s. One day they will hear yours before mine. Not yet."',
        '"I had a friend once, Jebat. Loyalty is a blade with no handle: you cannot hold it without bleeding."',
        '"Watch the north. Siam has a long memory and a short temper."'];
      say(npc, `<p>${lines[NK.game.state.day % lines.length]}</p>`, [['Farewell, Laksamana']]);
    }
  }
  function mutahirTalk(npc) {
    const rep = NK.game.factionRep('malacca'), q = NK.game.state.quests || (NK.game.state.quests = {});
    if (rep >= 20 && !q.mutahir) {
      say(npc, `<p>The new Bendahara, a year in Tun Perak's shoes and feeling every inch of them, looks you over.</p>
        <p>"The Laksamana speaks of you. That is unusual. A captain the court can name is a captain the court can use."</p>
        <p>"A letter under my seal. The syahbandars will treat you as a friend of the house."</p>`,
        [['Accept the letter (Melaka standing +15)', () => { q.mutahir = 'letter'; NK.game.addFactionRep('malacca', 15); NK.ui.toast('A letter under the Bendahara\'s seal: Melaka\'s tariffs ease for you.', 'good'); NK.game.save(); }]]);
    } else {
      say(npc, `<p>"Every ship in the strait pays Melaka, nakhoda, and every coin passes through my office. Trade honestly, and keep out of the court's quarrels. That is my advice, and it is free, which makes it the only free thing in this city."</p>
        ${rep < 20 ? '<p class="nk-meta">The court does not know your name yet. Earn standing with Melaka first.</p>' : ''}`, [['As you say, Bendahara']]);
    }
  }

  // ---------- Building the walkable town (once) ----------
  function build(p) {
    if (built === p.name) return;
    built = p.name;
    const w = p.walk;
    (CAST[p.name] || []).forEach(def => {
      const c = NK.assets.person(def.model); if (!c) return;
      const at = local(w, def.at[0] || 1, def.at[1], def.at[2]);
      const npc = Object.assign({}, def, c, { pos: new THREE.Vector3(at.x, 0, at.z) });
      npc.pos.y = groundAt(npc.pos.x, npc.pos.z);
      npc.heading = def.face === 'sea' ? Math.atan2(-p.nx, -p.nz) : Math.atan2(p.nx, p.nz);
      setup(npc, 'idle'); npcs.push(npc);
    });
    // Townsfolk walk between the jetty, the street and the square.
    TOWNSFOLK.forEach((m, i) => {
      const c = NK.assets.person(m); if (!c) return;
      const v = 20 + (i * 17) % 90, at = local(w, i % 2 ? 1 : -1, v, 6 + (i * 5) % 14);
      const npc = Object.assign({ name: null, wander: true, speed: 0 }, c, { pos: new THREE.Vector3(at.x, 0, at.z), heading: 0 });
      npc.pos.y = groundAt(npc.pos.x, npc.pos.z);
      setup(npc, 'walk'); npcs.push(npc);
    });
    // Market stalls around the square.
    const roof = NK.assets.bake('structure-roof'), fruit = NK.assets.bake('display-fruit'), crate = NK.assets.bake('crate'), barrel = NK.assets.bake('barrel');
    const put = (b, x, z, rot, k) => {
      if (!b) return;
      const m = new THREE.Mesh(b.geometry, NK.assets.material(b.map)); m.castShadow = m.receiveShadow = true;
      m.position.set(x, groundAt(x, z), z); m.rotation.y = rot; m.scale.setScalar(k); scene.add(m); stalls.push(m);
    };
    for (let i = 0; i < 6; i++) {
      const side = i % 2 ? 1 : -1, v = 70 + Math.floor(i / 2) * 22, at = local(w, side, v, 30);
      put(roof, at.x, at.z, w.face, 3.1);
      put(fruit, at.x + w.tx * side * -2, at.z + w.tz * side * -2, w.face, 5);
      const c2 = local(w, side, v + 6, 36); put(i % 2 ? crate : barrel, c2.x, c2.z, i, 2.4);
      p.colliders.push([at.x, at.z, 5]);
    }
  }
  function setup(c, anim) {
    c.scene.scale.setScalar(HEIGHT / 0.67);
    c.scene.position.copy(c.pos); c.scene.rotation.y = c.heading || 0;
    scene.add(c.scene);
    c.anim = null; play(c, anim);
  }
  function play(c, name) {
    if (c.anim === name) return;
    const next = c.actions[name]; if (!next) return;
    if (!c.anim) { next.reset().setEffectiveWeight(1).play(); c.anim = name; return; }   // first pose: no fade from the bind pose
    next.reset().setEffectiveWeight(1).fadeIn(0.2).play();
    if (c.anim && c.actions[c.anim]) c.actions[c.anim].fadeOut(0.2);
    c.anim = name;
  }

  // ---------- Ground, water, walls ----------
  function onJetty(x, z) {
    const j = port.walk.jetty; if (!j.length) return false;
    const a = j[0], b = j[j.length - 1];
    const dx = b[0] - a[0], dz = b[1] - a[1], L2 = dx * dx + dz * dz;
    const t = NK.clamp(((x - a[0]) * dx + (z - a[1]) * dz) / L2, -0.05, 1.05);
    return Math.hypot(x - (a[0] + dx * t), z - (a[1] + dz * t)) < 3.4 && t > -0.04 && t < 1.04;
  }
  function groundAt(x, z) {
    if (onJetty(x, z)) return JETTY_TOP;
    return Math.max(NK.world.height(x, z), -1);
  }
  function walkable(x, z) {
    if (onJetty(x, z)) return true;
    if (NK.world.height(x, z) < 0.35) return false;                  // the sea
    if (Math.hypot(x - port.x, z - port.z) > port.walk.reach + 80) return false;   // the jungle edge
    for (const [cx, cz, r] of port.colliders) if (Math.hypot(x - cx, z - cz) < r) return false;
    return true;
  }

  // ---------- Enter / leave ----------
  function enter(p) {
    if (!p.walk || !NK.assets.peopleOk) return false;
    port = p; build(p);
    if (!me) { me = NK.assets.person('male-f'); me.pos = new THREE.Vector3(); setup(me, 'idle'); }
    const j = p.walk.jetty[p.walk.jetty.length - 1];
    me.pos.set(j[0] + p.nx * 4, JETTY_TOP, j[1] + p.nz * 4);
    me.heading = Math.atan2(p.nx, p.nz); me.speed = 0;
    me.scene.visible = true;
    active = true;
    // Warp the ship alongside the jetty so she isn't in the way.
    const P = NK.player, side = 16 + P.ship.B;
    P.pos.x = j[0] + p.walk.tx * side - p.nx * 6; P.pos.z = j[1] + p.walk.tz * side - p.nz * 6;
    P.heading = Math.atan2(p.nz, -p.nx); P.speed = 0; P.sailTarget = 0;
    document.body.classList.add('ashore');
    relabel(true);
    NK.player.cam.yaw = Math.atan2(p.nz, -p.nx); NK.player.cam.pitch = 0.32;   // camera seaward, looking up the jetty to town
    NK.player.cam.free = true; NK.player.cam.lastInput = NK.T;
    NK.ui.banner(p.name, 'Ashore · walk with WASD · E to talk');
    return true;
  }
  function leave() {
    active = false; me.scene.visible = false; nearNpc = null;
    document.body.classList.remove('ashore');
    relabel(false);
    labelEls.forEach(e => e.style.display = 'none');
    NK.ui.toast('Back aboard. The crew has her ready.', 'info');
    NK.player.placeAt(port); NK.player.sailTarget = 0.5;
  }
  // On phones the sailing buttons double as walking controls ashore.
  function relabel(on) {
    const set = (id, html) => { const b = NK.$(id); if (b) b.innerHTML = html; };
    set('tc-in', on ? '<small>WALK</small>▲' : '<small>SHEET</small>IN');
    set('tc-out', on ? '<small>WALK</small>▼' : '<small>SHEET</small>OUT');
    set('tc-furl', on ? 'TALK' : 'SAIL');
  }
  function boardable() {
    const j = port.walk.jetty[port.walk.jetty.length - 1];
    return Math.hypot(me.pos.x - j[0], me.pos.z - j[1]) < 9;
  }
  function interact() {
    if (!active || NK.ui.modal()) return;
    if (nearNpc) { nearNpc.talk(nearNpc); return; }
    if (boardable()) leave();
  }

  // ---------- Per frame ----------
  const camTarget = new THREE.Vector3();
  function update(dt) {
    const anyActive = active;
    npcs.forEach(n => { n.mixer.update(dt); if (n.wander) wander(n, dt); });
    if (!anyActive) return;
    me.mixer.update(dt);
    const cam = NK.player.cam, T = NK.ui.touch;
    // Move relative to the camera: W toward where the camera looks.
    let fx = (keys.w || keys.arrowup || T.sheetIn ? 1 : 0) - (keys.s || keys.arrowdown || T.sheetOut ? 1 : 0);
    let sx = (keys.d || keys.arrowright || T.right ? 1 : 0) - (keys.a || keys.arrowleft || T.left ? 1 : 0);
    const modal = !!NK.ui.modal();
    if (modal) fx = sx = 0;
    const fwdX = -Math.cos(cam.yaw), fwdZ = Math.sin(cam.yaw);          // from camera toward character
    let mx = fwdX * fx - fwdZ * sx, mz = fwdZ * fx + fwdX * sx;
    const len = Math.hypot(mx, mz);
    const sprint = keys.shift;
    const target = len > 0 ? (sprint ? 18 : 9) : 0;
    me.speed += (target - me.speed) * Math.min(1, dt * 8);
    if (len > 0) {
      mx /= len; mz /= len;
      const want = Math.atan2(mx, mz);
      me.heading += NK.wrapAngle(want - me.heading) * Math.min(1, dt * 10);
      const step = me.speed * dt;
      const nx = me.pos.x + mx * step, nz = me.pos.z + mz * step;
      if (walkable(nx, nz)) { me.pos.x = nx; me.pos.z = nz; }
      else if (walkable(nx, me.pos.z)) me.pos.x = nx;
      else if (walkable(me.pos.x, nz)) me.pos.z = nz;
    }
    const gy = groundAt(me.pos.x, me.pos.z);
    me.pos.y += (gy - me.pos.y) * Math.min(1, dt * 12);
    me.scene.position.copy(me.pos); me.scene.rotation.y = me.heading;
    play(me, me.speed > 11 ? 'sprint' : me.speed > 0.6 ? 'walk' : 'idle');

    // Who's close enough to talk to? NPCs turn to face you.
    nearNpc = null; let best = 10;
    npcs.forEach(n => { if (!n.talk) return; const d = Math.hypot(n.pos.x - me.pos.x, n.pos.z - me.pos.z); if (d < best) { best = d; nearNpc = n; } });
    if (nearNpc) { const a = Math.atan2(me.pos.x - nearNpc.pos.x, me.pos.z - nearNpc.pos.z); nearNpc.scene.rotation.y += NK.wrapAngle(a - nearNpc.scene.rotation.y) * Math.min(1, dt * 4); }
    hud();
    // Camera: close third person, orbiting with the same drag controls.
    // Drift in behind the walker unless the player is looking around.
    if ((!cam.free || NK.T - cam.lastInput > 4) && me.speed > 1) {
      const behind = Math.atan2(Math.cos(me.heading), -Math.sin(me.heading));
      cam.yaw += NK.wrapAngle(behind - cam.yaw) * Math.min(1, dt * 1.2);
    }
    const d = NK.clamp(cam.tdist / 4.5, 8, 40), pitch = NK.clamp(cam.pitch, 0.12, 1.1);
    camTarget.set(me.pos.x, me.pos.y + 3.2, me.pos.z);
    let cx = camTarget.x + Math.cos(cam.yaw) * Math.cos(pitch) * d, cz = camTarget.z - Math.sin(cam.yaw) * Math.cos(pitch) * d;
    let cy = camTarget.y + Math.sin(pitch) * d;
    cy = Math.max(cy, groundAt(cx, cz) + 1.5, NK.water.waveHeight(cx, cz, NK.T) + 1.5);
    camera.position.set(cx, cy, cz); camera.lookAt(camTarget);
  }
  function wander(n, dt) {
    if (!port || !port.walk) return;
    if (!n.goal || Math.hypot(n.goal[0] - n.pos.x, n.goal[1] - n.pos.z) < 3 || n.stuck > 2) {
      const w = port.walk, side = Math.random() < 0.5 ? 1 : -1;
      const g = Math.random() < 0.3 ? local(w, side, 85 + Math.random() * 30, Math.random() * 25) : local(w, side, 8 + Math.random() * 70, Math.random() * 14);
      n.goal = [g.x, g.z]; n.stuck = 0; n.pause = Math.random() * 4;
    }
    if (n.pause > 0) { n.pause -= dt; play(n, 'idle'); return; }
    const a = Math.atan2(n.goal[0] - n.pos.x, n.goal[1] - n.pos.z);
    n.heading += NK.wrapAngle(a - n.heading) * Math.min(1, dt * 5);
    const nx = n.pos.x + Math.sin(n.heading) * 4.5 * dt, nz = n.pos.z + Math.cos(n.heading) * 4.5 * dt;
    if (walkable(nx, nz)) { n.pos.x = nx; n.pos.z = nz; } else n.stuck = (n.stuck || 0) + dt;
    n.pos.y += (groundAt(n.pos.x, n.pos.z) - n.pos.y) * Math.min(1, dt * 10);
    n.scene.position.copy(n.pos); n.scene.rotation.y = n.heading;
    play(n, 'walk');
  }

  // ---------- HUD bits: names over heads, the talk/board prompt ----------
  const v3 = new THREE.Vector3();
  function hud() {
    const root = NK.$('labels'), named = npcs.filter(n => n.name);
    while (labelEls.length < named.length) { const e = NK.el('div', 'label3d npc'); root.appendChild(e); labelEls.push(e); }
    const placed = [];
    named.map((n, i) => [n, i, Math.hypot(n.pos.x - me.pos.x, n.pos.z - me.pos.z)]).sort((a, b) => a[2] - b[2]).forEach(([n, i, d]) => {
      const e = labelEls[i];
      v3.set(n.pos.x, n.pos.y + HEIGHT + 1.6, n.pos.z).project(camera);
      const sx = (v3.x * 0.5 + 0.5) * innerWidth, sy = (-v3.y * 0.5 + 0.5) * innerHeight;
      if (d > 45 || v3.z > 1 || placed.some(q => Math.abs(q[0] - sx) < 140 && Math.abs(q[1] - sy) < 34)) { e.style.display = 'none'; return; }
      placed.push([sx, sy]);
      e.style.display = 'block';
      e.innerHTML = `<b>${n.name}</b><span>${n.title}</span>`;
      e.style.left = ((v3.x * 0.5 + 0.5) * innerWidth) + 'px'; e.style.top = ((-v3.y * 0.5 + 0.5) * innerHeight) + 'px';
      e.style.opacity = NK.clamp(1.4 - d / 40, 0, 1);
    });
    const el = NK.$('h-prompt');
    if (NK.ui.modal()) { el.style.display = 'none'; return; }
    const txt = nearNpc ? `Talk to ${nearNpc.name}` : boardable() ? 'Board your ship' : null;
    el.style.display = txt ? 'block' : 'none';
    if (txt) { NK.$('h-prompt-btn').innerHTML = `${NK.isMobile ? '' : '<kbd>E</kbd>'}${txt}`; NK.$('h-prompt-btn').onclick = interact; }
  }

  window.addEventListener('keydown', e => {
    if (!active || NK.ui.modal()) return;
    const k = e.key.toLowerCase();
    if (k === 'e' || k === 'f') interact();
  });

  return {
    init(sc, cam) { scene = sc; camera = cam; },
    enter, leave, update, interact,
    get active() { return active; }, get port() { return port; }, get me() { return me; }, get npcs() { return npcs; },
    canWalk: p => !!(p && p.walk && NK.assets.peopleOk)
  };
})();
