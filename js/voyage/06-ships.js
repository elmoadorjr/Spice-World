// ============ NAKHODA: SHIPWRIGHT ============
// Builds Nusantara hulls from a few numbers: a lofted plank hull with the
// region's upswept prow and stern, canted rectangular tanja sails of woven
// matting, paired quarter rudders, outriggers on the small craft, a stern
// castle on the big ones, and bronze lantaka swivel guns on the rails.

NK.ships = (function () {
  const HULLS = [
    { n: 'Kelulus',    L: 13, B: 2.4, D: 1.2, masts: [0.16],                     sail: [6, 7],    outrigger: true,  castle: false, guns: 1 },
    { n: 'Pencalang',  L: 17, B: 3.4, D: 1.5, masts: [0.30, -0.10],              sail: [7, 8.5],  outrigger: false, castle: false, guns: 2 },
    { n: 'Malangbang', L: 21, B: 4.6, D: 1.8, masts: [0.28, -0.10],              sail: [8.5, 10], outrigger: false, castle: true,  guns: 2 },
    { n: 'Lancaran',   L: 26, B: 4.4, D: 1.8, masts: [0.36, 0.06, -0.24],        sail: [8.5, 10.5], outrigger: false, castle: true, guns: 3 },
    { n: 'Jong',       L: 36, B: 7.6, D: 2.8, masts: [0.40, 0.15, -0.10, -0.34], sail: [11, 13.5], outrigger: false, castle: true, guns: 5 }
  ];
  const sailTexCache = {};

  function sailTexture(tone) {
    if (sailTexCache[tone]) return sailTexCache[tone];
    const c = document.createElement('canvas'); c.width = 128; c.height = 128;
    const g = c.getContext('2d');
    const base = { mat: ['#d9c290', '#c9ad78'], dark: ['#6b3a33', '#4f2a26'], royal: ['#e3cfa0', '#b8873d'], pale: ['#e8dcc0', '#d2c29e'] }[tone] || ['#d9c290', '#c9ad78'];
    g.fillStyle = base[0]; g.fillRect(0, 0, 128, 128);
    // Woven pandan matting: a fine diagonal weave.
    for (let y = 0; y < 128; y += 4) for (let x = 0; x < 128; x += 4) {
      g.fillStyle = ((x + y) / 4) % 2 ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
      g.fillRect(x, y, 4, 4);
    }
    // Horizontal bamboo battens.
    g.fillStyle = base[1];
    for (let y = 10; y < 128; y += 21) g.fillRect(0, y, 128, 3);
    g.fillStyle = 'rgba(60,40,20,0.35)';
    for (let y = 10; y < 128; y += 21) g.fillRect(0, y + 3, 128, 1);
    if (tone === 'royal') { g.fillStyle = '#8B3A3A'; g.fillRect(0, 54, 128, 14); }
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 4;
    return (sailTexCache[tone] = t);
  }

  function hullGeometry(L, B, D) {
    const N = 26, K = 7, pos = [], col = [], idx = [];
    const rings = [];
    const plankA = new THREE.Color(0x5e3c22), plankB = new THREE.Color(0x6e4a2b), wet = new THREE.Color(0x3b2a1e);
    for (let s = 0; s <= N; s++) {
      const u = s / N * 2 - 1, au = Math.abs(u);
      const b = B / 2 * Math.pow(Math.max(0, 1 - Math.pow(au, 2.3)), 0.55) + 0.05;
      const top = D + D * 2.4 * Math.pow(au, 3.4) * (u > 0 ? 1.15 : 1);
      const keel = -D * 0.85 * (1 - Math.pow(au, 3)) + D * 0.2 * Math.pow(au, 4);
      const ring = [];
      for (let k = -K; k <= K; k++) {
        const phi = Math.abs(k) / K * Math.PI / 2;
        const lat = Math.sign(k) * b * Math.sin(phi) * (1 + 0.08 * Math.sin(phi * 2));
        const y = keel * Math.cos(phi) + top * (1 - Math.cos(phi));
        ring.push(pos.length / 3);
        pos.push(u * L / 2, y, lat);
        const c = y < 0.2 ? wet : (Math.floor(y * 1.6) % 2 ? plankA : plankB);
        col.push(c.r, c.g, c.b);
      }
      rings.push(ring);
    }
    for (let s = 0; s < N; s++) for (let k = 0; k < 2 * K; k++) {
      const a = rings[s][k], b = rings[s][k + 1], c = rings[s + 1][k], d = rings[s + 1][k + 1];
      idx.push(a, c, b, b, c, d);
    }
    // Deck.
    const deckY = D * 0.92, deck = new THREE.Color(0xa47d50), deck2 = new THREE.Color(0x96714a);
    const dRing = [];
    for (let s = 2; s <= N - 2; s++) {
      const u = s / N * 2 - 1, au = Math.abs(u);
      const b = (B / 2 * Math.pow(Math.max(0, 1 - Math.pow(au, 2.3)), 0.55)) * 0.94;
      const i0 = pos.length / 3; pos.push(u * L / 2, deckY, -b, u * L / 2, deckY, b);
      const c = s % 2 ? deck : deck2; col.push(c.r, c.g, c.b, c.r, c.g, c.b);
      dRing.push(i0);
    }
    for (let s = 0; s < dRing.length - 1; s++) { const a = dRing[s], c = dRing[s + 1]; idx.push(a, a + 1, c, c, a + 1, c + 1); }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx); g.computeVertexNormals();
    return { geo: g, deckY };
  }

  function sailGeometry(w, h) {
    const g = new THREE.PlaneGeometry(w, h, 6, 6);
    const p = g.attributes.position;
    // Tanja cant: the top yard rakes forward over the bow.
    for (let i = 0; i < p.count; i++) { const y = p.getY(i) + h / 2; p.setX(i, p.getX(i) + w * 0.42 + (y / h) * w * 0.32); p.setY(i, y); }
    g.translate(-w * 0.15, 0, 0);
    g.userData.base = Float32Array.from(p.array);
    return g;
  }

  function build(tier, opts) {
    opts = opts || {};
    const spec = HULLS[Math.min(tier, HULLS.length - 1)];
    const L = spec.L * (opts.scale || 1), B = spec.B * (opts.scale || 1), D = spec.D * (opts.scale || 1);
    const group = new THREE.Group();
    const wood = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, side: THREE.DoubleSide });
    const timber = new THREE.MeshStandardMaterial({ color: 0x4e3622, roughness: 0.9 });
    const bronze = new THREE.MeshStandardMaterial({ color: 0xa8793a, roughness: 0.35, metalness: 0.75 });
    const { geo, deckY } = hullGeometry(L, B, D);
    const hull = new THREE.Mesh(geo, wood); hull.castShadow = true; hull.receiveShadow = true;
    group.add(hull);

    // Stern castle.
    if (spec.castle) {
      const cw = B * 0.8, cl = L * 0.18;
      const house = new THREE.Mesh(new THREE.BoxGeometry(cl, D * 0.9, cw), new THREE.MeshStandardMaterial({ color: 0x7a5636, roughness: 0.85 }));
      house.position.set(-L * 0.36, deckY + D * 0.45, 0); house.castShadow = true; group.add(house);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(cw * 0.78, D * 0.8, 4), new THREE.MeshStandardMaterial({ color: 0x6b4f2e, roughness: 1 }));
      roof.rotation.y = Math.PI / 4; roof.scale.set(cl / cw * 1.1, 1, 1);
      roof.position.set(-L * 0.36, deckY + D * 1.3, 0); roof.castShadow = true; group.add(roof);
    }
    // Quarter rudders on both quarters.
    [-1, 1].forEach(sd => {
      const r = new THREE.Mesh(new THREE.BoxGeometry(0.5, D * 2.6, B * 0.08 + 0.15), timber);
      r.position.set(-L * 0.38, deckY * 0.2, sd * B * 0.5); r.rotation.z = -0.35; r.castShadow = true; group.add(r);
    });
    // Outrigger booms and floats.
    if (spec.outrigger) {
      [0.28, -0.22].forEach(u => {
        const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, B * 3.6, 5), timber);
        boom.rotation.x = Math.PI / 2; boom.position.set(u * L, deckY + 0.3, 0); group.add(boom);
      });
      [-1, 1].forEach(sd => {
        const fl = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.2, L * 0.75, 6), timber);
        fl.rotation.z = Math.PI / 2; fl.position.set(L * 0.03, 0.1, sd * B * 1.75); group.add(fl);
      });
    }
    // Masts and tanja sails.
    const tone = opts.sail || 'mat';
    const sailMat = new THREE.MeshStandardMaterial({ map: sailTexture(tone), roughness: 0.95, side: THREE.DoubleSide });
    const sails = [];
    spec.masts.forEach((mu, mi) => {
      const k = mi === 0 && spec.masts.length > 1 ? 0.78 : (mi === spec.masts.length - 1 && spec.masts.length > 2 ? 0.7 : 1);
      const w = spec.sail[0] * (opts.scale || 1) * k, h = spec.sail[1] * (opts.scale || 1) * k;
      const mh = h * 1.25 + D;
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.13 * (1 + tier * 0.15), 0.2 * (1 + tier * 0.15), mh, 6), timber);
      mast.position.set(mu * L, deckY + mh / 2, 0); mast.castShadow = true; group.add(mast);
      const pivot = new THREE.Group(); pivot.position.set(mu * L, deckY + D * 0.6, 0); group.add(pivot);
      // The frame faces aft: the sail streams back from the mast, its
      // canted head reaching forward over the deck.
      const frame = new THREE.Group(); frame.rotation.y = Math.PI; pivot.add(frame);
      const sail = new THREE.Mesh(sailGeometry(w, h), sailMat); sail.castShadow = true;
      frame.add(sail);
      const spar = (len, x, y) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, len, 5), timber); m.rotation.z = Math.PI / 2; m.position.set(x, y, 0); frame.add(m); return m; };
      const yard = spar(w * 1.12, w * 0.59, h);
      const boom = spar(w * 1.08, w * 0.27, 0.05);
      sails.push({ pivot, mesh: sail, yard, boom, h, w });
    });
    // Pennant on the mainmast.
    const flagColor = new THREE.Color(opts.flag || 0xb8873d);
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(3.5 * (1 + tier * 0.2), 0.9, 4, 1), new THREE.MeshStandardMaterial({ color: flagColor, side: THREE.DoubleSide, roughness: 0.9 }));
    const mainTop = group.children.filter(o => o.geometry && o.geometry.type === 'CylinderGeometry' && o.position.y > deckY + 2)[0];
    flag.position.set((mainTop ? mainTop.position.x : 0) - 1.8, mainTop ? mainTop.position.y * 2 - deckY - 0.6 : deckY + 12, 0);
    group.add(flag);
    // Lantaka on the rails.
    const guns = { left: [], right: [] };
    const gunGeo = new THREE.CylinderGeometry(0.16, 0.22, 1.4, 6); gunGeo.rotateX(Math.PI / 2);
    for (let i = 0; i < spec.guns; i++) {
      const u = spec.guns === 1 ? 0 : (i / (spec.guns - 1) - 0.5) * 0.5;
      [-1, 1].forEach(sd => {
        const x = u * L, z = sd * B * 0.5;
        const g = new THREE.Mesh(gunGeo, bronze); g.position.set(x, deckY + 0.55, z); group.add(g);
        (sd < 0 ? guns.left : guns.right).push(new THREE.Vector3(x, deckY + 0.55, z + sd * 0.8));
      });
    }
    return { group, sails, flag, guns, spec, L, B, D, deckY };
  }

  // Sail animation: trim to the wind, swell with it, furl from the boom up.
  function animateSails(ship, trimAngle, deploy, fill, t) {
    ship.sails.forEach((s, i) => {
      s.pivot.rotation.y += (trimAngle - s.pivot.rotation.y) * 0.08;
      const d = Math.max(0.06, deploy);
      s.mesh.scale.y = d; s.mesh.position.y = s.h * (1 - d);
      s.boom.position.y = s.h * (1 - d) + 0.05;
      const p = s.mesh.geometry.attributes.position;
      const belly = fill * 1.4 * (0.4 + 0.6 * d);
      for (let k = 0; k < p.count; k++) {
        const nx = (k % 7) / 6, ny = 1 - Math.floor(k / 7) / 6;
        const shape = Math.sin(Math.PI * nx) * (0.35 + 0.65 * Math.sin(Math.PI * ny));
        const luff = Math.abs(fill) < 0.15 ? Math.sin(t * 9 + ny * 6 + i) * 0.25 : 0;
        p.setZ(k, shape * (belly + luff));
      }
      p.needsUpdate = true; s.mesh.geometry.computeVertexNormals();
    });
    const f = ship.flag.geometry.attributes.position;
    for (let k = 0; k < f.count; k++) { const x = f.getX(k); f.setZ(k, Math.sin(t * 6 + x * 1.5) * 0.25 * (x + 2) / 3); }
    f.needsUpdate = true;
  }

  return { build, animateSails, HULLS };
})();
