// ============ NAKHODA: PORT TOWNS ============
// Every port in PORT_DATA becomes a waterfront town on its real coast:
// stilt houses (some standing out over the shallows), a jetty to deep water,
// and a landmark that tells you whose port it is: a tiered-roof mosque for
// the sultanates, a meru tower for Hindu Bali and Sunda, a long royal hall
// for the rest. Lamps glow after dusk.

NK.ports = (function () {
  const MOSQUE = ['Melaka', 'Pasai', 'Aceh', 'Demak', 'Tuban', 'Gresik', 'Surabaya', 'Brunei', 'Ternate', 'Tidore', 'Jolo', 'Maynila', 'Patani', 'Pahang', 'Kedah', 'Terengganu', 'Jambi', 'Hitu'];
  const MERU = ['Bali', 'Sunda Kelapa', 'Banten', 'Lombok'];
  let list = [], lampMat, lamps, scene;

  function colored(geo, hex) {
    geo = geo.index ? geo.toNonIndexed() : geo;
    const n = geo.attributes.position.count, c = new Float32Array(n * 3), col = new THREE.Color(hex);
    for (let i = 0; i < n; i++) { c[i * 3] = col.r; c[i * 3 + 1] = col.g; c[i * 3 + 2] = col.b; }
    geo.setAttribute('color', new THREE.BufferAttribute(c, 3));
    return geo;
  }
  function merge(parts) {
    let total = 0; parts.forEach(g => total += g.attributes.position.count);
    const pos = new Float32Array(total * 3), col = new Float32Array(total * 3); let o = 0;
    parts.forEach(g => { pos.set(g.attributes.position.array, o * 3); col.set(g.attributes.color.array, o * 3); o += g.attributes.position.count; });
    const out = new THREE.BufferGeometry();
    out.setAttribute('position', new THREE.BufferAttribute(pos, 3)); out.setAttribute('color', new THREE.BufferAttribute(col, 3));
    out.computeVertexNormals(); return out;
  }
  function gable(len, wid, hgt, hex) {
    // Thatched gable roof with a deep overhang, ridge along x.
    const L = len / 2, W = wid / 2;
    const v = [-L, 0, -W, L, 0, -W, L, hgt, 0, -L, 0, -W, L, hgt, 0, -L, hgt, 0,
               -L, 0, W, -L, hgt, 0, L, hgt, 0, -L, 0, W, L, hgt, 0, L, 0, W,
               -L, 0, -W, -L, hgt, 0, -L, 0, W, L, 0, -W, L, 0, W, L, hgt, 0];
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    return colored(g, hex);
  }
  function pyramid(w, h, hex) { const g = new THREE.ConeGeometry(w * 0.7071, h, 4, 1); g.rotateY(Math.PI / 4); return colored(g, hex); }
  function box(w, h, d, hex, x, y, z) { const g = new THREE.BoxGeometry(w, h, d); g.translate(x || 0, y || 0, z || 0); return colored(g, hex); }
  function post(r, h, hex, x, y, z) { const g = new THREE.CylinderGeometry(r, r, h, 5); g.translate(x, y, z); return colored(g, hex); }

  function makeHouse() {
    const p = [];
    [[-2.8, -1.9], [2.8, -1.9], [-2.8, 1.9], [2.8, 1.9], [0, -1.9], [0, 1.9]].forEach(([x, z]) => p.push(post(0.22, 4.4, 0x5a4532, x, 1.2, z)));
    p.push(box(6.6, 0.4, 4.6, 0x8a6a45, 0, 3.4, 0));
    p.push(box(6.0, 2.8, 4.0, 0xc9ab78, 0, 5.0, 0));
    p.push(box(1.0, 1.6, 0.1, 0x3a2a1c, 0, 4.6, 2.02));
    const r = gable(8.4, 6.2, 3.6, 0x8b6a3e); r.translate(0, 6.3, 0); p.push(r);
    const ridge = box(8.6, 0.25, 0.3, 0x5a4026, 0, 9.95, 0); p.push(ridge);
    return merge(p);
  }
  function makeMosque() {
    // Javanese masjid: square hall under three stacked pyramid roofs.
    const p = [];
    p.push(box(22, 1.2, 22, 0xd8cfb8, 0, 0.6, 0));
    p.push(box(18, 6, 18, 0xe8dfc8, 0, 4.2, 0));
    p.push(box(3, 4, 0.2, 0x4a3524, 0, 3.2, 9.05));
    const r1 = pyramid(26, 6, 0x5b4632); r1.translate(0, 10.2, 0); p.push(r1);
    p.push(box(9, 3, 9, 0xe0d6bf, 0, 12.5, 0));
    const r2 = pyramid(15, 5, 0x5b4632); r2.translate(0, 16.2, 0); p.push(r2);
    p.push(box(4, 2, 4, 0xe0d6bf, 0, 18.4, 0));
    const r3 = pyramid(8, 5, 0x4a3828); r3.translate(0, 21.6, 0); p.push(r3);
    const fin = new THREE.ConeGeometry(0.6, 3.5, 6); fin.translate(0, 25.6, 0); p.push(colored(fin, 0xb08a3a));
    return merge(p);
  }
  function makeMeru() {
    const p = [];
    p.push(box(12, 4, 12, 0x8f7f6a, 0, 2, 0));
    p.push(box(8, 5, 8, 0x9b8a72, 0, 6.5, 0));
    for (let i = 0; i < 9; i++) {
      const w = 13 - i * 1.1, y = 10 + i * 2.6;
      const r = pyramid(w, 2.2, i % 2 ? 0x3b3026 : 0x2c241d); r.translate(0, y, 0); p.push(r);
      p.push(box(w * 0.35, 0.8, w * 0.35, 0x6b5a46, 0, y + 1.2, 0));
    }
    return merge(p);
  }
  function makeHall() {
    const p = [];
    for (let i = -3; i <= 3; i++) [-4, 4].forEach(z => p.push(post(0.35, 5, 0x4f3b2a, i * 4, 2.5, z)));
    p.push(box(28, 0.6, 10, 0x7d5f3e, 0, 5, 0));
    p.push(box(26, 4, 8, 0xbf9f6c, 0, 7.3, 0));
    const r = gable(34, 14, 9, 0x6f5232); r.translate(0, 9.3, 0); p.push(r);
    return merge(p);
  }
  function makeJettySegment() {
    const p = [box(4.2, 0.5, 6, 0x8a6b47, 0, 2.2, 0)];
    [[-1.9, -2.6], [1.9, -2.6], [-1.9, 2.6], [1.9, 2.6]].forEach(([x, z]) => p.push(post(0.25, 7, 0x4a3828, x, -1.2, z)));
    return merge(p);
  }

  function init(sc) {
    scene = sc;
    const w = NK.world;
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, side: THREE.DoubleSide });
    const houseGeo = makeHouse(), jettyGeo = makeJettySegment();
    const houseT = [], jettyT = [], lampT = [];
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);

    list = w.ports.map(p => {
      const rnd = NK.rng(p.idx * 7919 + 13);
      const tx = -p.nz, tz = p.nx;                     // along the shore
      const face = Math.atan2(-p.nx, -p.nz);          // seaward
      const size = p.entrepot ? 64 : p.maluku ? 34 : 30;
      const reach = p.entrepot ? 150 : 95;
      let placed = 0;
      for (let t = 0; t < size * 6 && placed < size; t++) {
        const u = (rnd() * 2 - 1) * reach, v = 6 + rnd() * rnd() * (p.entrepot ? 120 : 70);
        const x = p.x + tx * u + p.nx * v, z = p.z + tz * u + p.nz * v;
        const h = w.height(x, z);
        if (h < 0.6 || h > 30) continue;
        const slope = Math.abs(w.height(x + 6, z) - h) + Math.abs(w.height(x, z + 6) - h);
        if (slope > 4) continue;
        if (Math.abs(u) < 14 && v < 40) continue;      // keep the landing clear
        houseT.push([x, h - 1.4, z, face + (rnd() - 0.5) * 0.5, 0.85 + rnd() * 0.35]); placed++;
      }
      // Houses on stilts out over the shallows, the sea people's way.
      let water = p.entrepot || ['Jolo', 'Banjarmasin', 'Brunei', 'Buton', 'Zamboanga', 'Cotabato'].includes(p.name) ? 14 : 5;
      for (let t = 0; t < water * 5 && water > 0; t++) {
        const u = (rnd() * 2 - 1) * reach * 0.8, v = -(8 + rnd() * 30);
        const x = p.x + tx * u + p.nx * v, z = p.z + tz * u + p.nz * v;
        const c = w.coast(x, z);
        if (c > -4 || c < -40 || Math.abs(u) < 20) continue;
        houseT.push([x, -0.6, z, face + (rnd() - 0.5) * 0.4, 0.9]);
        if (--water <= 0) break;
      }
      // Jetty from the waterline to water deep enough for a jong.
      const jetty = [];
      for (let k = 0; k < 16; k++) {
        const x = p.x - p.nx * (k * 6 + 2), z = p.z - p.nz * (k * 6 + 2);
        jetty.push([x, 0, z, face]);
        if (w.coast(x, z) < -26 && k > 2) break;
      }
      jetty.forEach(j => jettyT.push(j));
      const end = jetty[jetty.length - 1];
      lampT.push([end[0], 5, end[2]]);
      // Landmark.
      let kind = MOSQUE.includes(p.name) ? 'mosque' : MERU.includes(p.name) ? 'meru' : 'hall';
      const lx = p.x + p.nx * (p.entrepot ? 70 : 46), lz = p.z + p.nz * (p.entrepot ? 70 : 46);
      const lh = Math.max(0.8, w.height(lx, lz));
      const geo = kind === 'mosque' ? makeMosque() : kind === 'meru' ? makeMeru() : makeHall();
      const lm = new THREE.Mesh(geo, mat);
      lm.position.set(lx, lh - 0.8, lz); lm.rotation.y = face; lm.scale.setScalar(p.entrepot ? 1.25 : 0.95);
      lm.castShadow = lm.receiveShadow = true;
      scene.add(lm);
      for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; lampT.push([lx + Math.cos(a) * 18, lh + 3, lz + Math.sin(a) * 18]); }
      return Object.assign(p, { kind, landmark: { x: lx, z: lz, h: lh }, dock: { x: end[0], z: end[2] }, radius: reach + 40 });
    });

    const inst = (geo, arr, cast) => {
      const im = new THREE.InstancedMesh(geo, mat, arr.length);
      const p3 = new THREE.Vector3(), s3 = new THREE.Vector3();
      arr.forEach(([x, y, z, r, s], i) => { q.setFromAxisAngle(up, r); s3.setScalar(s || 1); p3.set(x, y, z); m4.compose(p3, q, s3); im.setMatrixAt(i, m4); });
      im.castShadow = cast; im.receiveShadow = true; im.frustumCulled = false;
      scene.add(im); return im;
    };
    inst(houseGeo, houseT, true);
    inst(jettyGeo, jettyT, true);
    lampMat = new THREE.MeshBasicMaterial({ color: 0xffb35a, fog: true });
    lamps = new THREE.InstancedMesh(new THREE.SphereGeometry(0.9, 6, 4), lampMat, lampT.length);
    lampT.forEach(([x, y, z], i) => { m4.makeTranslation(x, y, z); lamps.setMatrixAt(i, m4); });
    lamps.frustumCulled = false; scene.add(lamps);
  }

  function update() {
    const n = NK.sky.state.night;
    lamps.visible = n > 0.05;
    lampMat.color.setRGB(n * 2.0, n * 1.15, n * 0.45);
  }

  function nearTown(x, z, pad) {
    for (let i = 0; i < list.length; i++) { const p = list[i]; if (Math.hypot(x - p.x, z - p.z) < p.radius + (pad || 0)) return p; }
    return null;
  }
  function nearest(x, z) {
    let best = null, bd = Infinity;
    list.forEach(p => { const d = Math.hypot(x - p.dock.x, z - p.dock.z); if (d < bd) { bd = d; best = p; } });
    return { port: best, dist: bd };
  }

  return { init, update, nearTown, nearest, get list() { return list; } };
})();
