// ============ NAKHODA: THE LAND ============
// Two layers of island. A coarse whole-archipelago mesh (built once) gives
// you Sumatra on the horizon; detailed chunks stream in around the ship with
// beaches, jungle, palms and volcanic rock. The far mesh steps aside inside
// the detail radius so the two never fight.

NK.land = (function () {
  const CHUNK = 600, SEG = NK.isMobile ? 36 : 48;
  const NEAR_R = 2600;             // detail chunks own everything inside this
  const LOAD_R = NEAR_R + 900;
  const VEG_R = NK.isMobile ? 900 : 1300;
  const chunks = new Map();
  let scene, chunkMat, farMat, treeMat, palmGeo, treeGeo, queue = [];
  const nearUniform = { value: new THREE.Vector3(0, 0, NEAR_R) };

  // ---------- Palette ----------
  const C = {
    wetSand: new THREE.Color(0xc4ad7c), sand: new THREE.Color(0xf0dcaa), scrub: new THREE.Color(0xa3b45a),
    grass: new THREE.Color(0x6fa83a), lush: new THREE.Color(0x4c9233), jungle: new THREE.Color(0x2c6a2a),
    highland: new THREE.Color(0x58783a), rock: new THREE.Color(0x8c7f6d), ash: new THREE.Color(0x4a423d), reef: new THREE.Color(0x5f9e8c)
  };
  const tmp = new THREE.Color();
  function colorAt(x, z, h, slope, out) {
    const n = NK.noise(x * 0.01, z * 0.01) * 0.5 + 0.5, n2 = NK.noise(x * 0.05 + 9, z * 0.05);
    if (h < 0.2) out.copy(C.reef).lerp(C.wetSand, NK.smooth(-6, 0.2, h));
    else if (h < 2.4) out.copy(C.wetSand).lerp(C.sand, NK.smooth(0.2, 1.4, h));
    else if (h < 7) out.copy(C.sand).lerp(C.scrub, NK.smooth(2.4, 7, h + n2 * 1.5));
    else {
      out.copy(C.grass).lerp(C.lush, n);
      out.lerp(C.jungle, NK.smooth(14, 60, h) * (0.6 + 0.4 * n));
      out.lerp(C.highland, NK.smooth(110, 190, h + n2 * 25));
      out.lerp(C.rock, NK.smooth(170, 240, h + n2 * 30) * 0.8);
      out.lerp(C.ash, NK.smooth(230, 300, h + n2 * 20));
    }
    if (h > 3) out.lerp(C.rock, NK.smooth(0.62, 0.42, slope) * 0.85);
    // A little hand-painted variation so no two hillsides match.
    const v = 0.92 + n2 * 0.08;
    out.r *= v; out.g *= v; out.b *= v;
    return out;
  }

  function nearDiscard(mat, inside) {
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uNear = nearUniform;
      sh.vertexShader = 'varying vec3 vWPos;\n' + sh.vertexShader.replace('#include <worldpos_vertex>',
        '#include <worldpos_vertex>\n vWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      sh.fragmentShader = 'uniform vec3 uNear;\nvarying vec3 vWPos;\n' + sh.fragmentShader.replace('void main() {',
        'void main() {\n float nd = length(vWPos.xz - uNear.xy);\n if (' + (inside ? 'nd < uNear.z' : 'nd > uNear.z') + ') discard;');
    };
  }

  // ---------- The far archipelago ----------
  function buildFar() {
    const w = NK.world, step = 54;
    const nx = Math.floor(w.W * w.U / step), nz = Math.floor(w.H * w.U / step);
    const pos = new Float32Array((nx + 1) * (nz + 1) * 3), col = new Float32Array((nx + 1) * (nz + 1) * 3);
    const near = new Uint8Array((nx + 1) * (nz + 1));
    let k = 0;
    for (let j = 0; j <= nz; j++) for (let i = 0; i <= nx; i++) {
      const x = w.x0 + i * step, z = w.z0 + j * step, idx = j * (nx + 1) + i;
      const c = w.coast(x, z);
      let h = -40;
      if (c > -220) { h = w.height(x, z); near[idx] = 1; }
      pos[k] = x; pos[k + 1] = h; pos[k + 2] = z;
      colorAt(x, z, h, 1, tmp); col[k] = tmp.r; col[k + 1] = tmp.g; col[k + 2] = tmp.b;
      k += 3;
    }
    const idx = [];
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      const a = j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1;
      if (!(near[a] || near[b] || near[c] || near[d])) continue;
      if (Math.max(pos[a * 3 + 1], pos[b * 3 + 1], pos[c * 3 + 1], pos[d * 3 + 1]) < -2) continue;
      idx.push(a, c, b, b, c, d);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setIndex(idx); g.computeVertexNormals();
    const m = new THREE.Mesh(g, farMat);
    m.frustumCulled = false; m.receiveShadow = false;
    scene.add(m);
  }

  // ---------- Vegetation geometry (merged, vertex colored) ----------
  function colored(geo, hex, jitter) {
    geo = geo.index ? geo.toNonIndexed() : geo;
    const n = geo.attributes.position.count, c = new Float32Array(n * 3), base = new THREE.Color(hex);
    for (let i = 0; i < n; i++) { const v = 1 - Math.random() * (jitter || 0); c[i * 3] = base.r * v; c[i * 3 + 1] = base.g * v; c[i * 3 + 2] = base.b * v; }
    geo.setAttribute('color', new THREE.BufferAttribute(c, 3));
    return geo;
  }
  function merge(list) {
    let total = 0; list.forEach(g => total += g.attributes.position.count);
    const pos = new Float32Array(total * 3), col = new Float32Array(total * 3);
    let o = 0;
    list.forEach(g => { pos.set(g.attributes.position.array, o * 3); col.set(g.attributes.color.array, o * 3); o += g.attributes.position.count; });
    const out = new THREE.BufferGeometry();
    out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    out.setAttribute('color', new THREE.BufferAttribute(col, 3));
    if (list.every(g => g.attributes.normal)) {
      const nrm = new Float32Array(total * 3); o = 0;
      list.forEach(g => { nrm.set(g.attributes.normal.array, o * 3); o += g.attributes.position.count; });
      out.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
    } else out.computeVertexNormals();
    return out;
  }
  // Round, painterly shading for a faceted blob: normals point out from its center.
  function softBlob(geo, cx, cy, cz) {
    const p = geo.attributes.position, n = new Float32Array(p.count * 3), v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.set(p.getX(i) - cx, (p.getY(i) - cy) * 0.6, p.getZ(i) - cz).normalize(); v.y = v.y * 0.8 + 0.25; v.normalize(); n[i * 3] = v.x; n[i * 3 + 1] = v.y; n[i * 3 + 2] = v.z; }
    geo.setAttribute('normal', new THREE.BufferAttribute(n, 3));
    return geo;
  }
  function makePalm() {
    const parts = [];
    // A leaning, segmented trunk.
    for (let s = 0; s < 5; s++) {
      const t = new THREE.CylinderGeometry(0.42 - s * 0.05, 0.5 - s * 0.05, 2.6, 6);
      t.translate(s * 0.28, 1.3 + s * 2.45, 0); t.rotateZ(-0.05);
      parts.push(colored(t, s % 2 ? 0x7a6448 : 0x6a563d));
    }
    // Drooping fronds.
    for (let f = 0; f < 10; f++) {
      const fr = new THREE.PlaneGeometry(2.6, 7.5, 1, 4);
      const p = fr.attributes.position;
      for (let i = 0; i < p.count; i++) { const y = p.getY(i) + 3.25; p.setY(i, y); p.setZ(i, -0.06 * y * y); p.setX(i, p.getX(i) * (1 - y / 7.5)); }
      fr.rotateX(-Math.PI / 2 + 0.35 + (f % 2) * 0.25); fr.rotateY(f / 10 * Math.PI * 2 + Math.random() * 0.3);
      fr.translate(1.4, 12.6, 0);
      parts.push(colored(fr, f % 2 ? 0x4c7a2e : 0x5d8c34, 0.15));
    }
    const coco = new THREE.IcosahedronGeometry(0.55, 0); coco.translate(1.3, 12.0, 0.3);
    parts.push(colored(coco, 0x5a4a2a));
    return merge(parts);
  }
  function makeTree() {
    const parts = [];
    const trunk = new THREE.CylinderGeometry(0.45, 0.8, 6, 5); trunk.translate(0, 3, 0);
    parts.push(colored(trunk, 0x4a3a2a));  // toNonIndexed keeps the cylinder's own normals
    const blobs = [[0, 8.6, 0, 4.6], [3.2, 7.4, 1.2, 3.6], [-3.0, 7.8, -0.8, 3.8], [0.6, 10.8, -1.6, 3.4], [-1.2, 7.2, 3.0, 3.2], [1.6, 7.0, -3.2, 3.0], [-2.0, 10.2, 1.4, 2.8]];
    blobs.forEach(([x, y, z, r], i) => {
      const b = new THREE.IcosahedronGeometry(r, 0); b.scale(1, 0.75, 1); b.rotateY(i); b.translate(x, y, z);
      parts.push(softBlob(colored(b, [0x35632b, 0x2a5426, 0x3f7030][i % 3], 0.22), x, y, z));
    });
    return merge(parts);
  }

  // ---------- Detail chunks ----------
  function buildChunk(ci, cj) {
    const w = NK.world, x0 = ci * CHUNK, z0 = cj * CHUNK, step = CHUNK / SEG, V = SEG + 1;
    // Skip open ocean outright.
    let any = false;
    for (let j = 0; j <= 4 && !any; j++) for (let i = 0; i <= 4; i++) if (w.coast(x0 + i * CHUNK / 4, z0 + j * CHUNK / 4) > -160) { any = true; break; }
    if (!any) return { empty: true };

    const hs = new Float32Array(V * V);
    for (let j = 0; j < V; j++) for (let i = 0; i < V; i++) hs[j * V + i] = w.height(x0 + i * step, z0 + j * step);
    const pos = new Float32Array(V * V * 3), col = new Float32Array(V * V * 3);
    for (let j = 0; j < V; j++) for (let i = 0; i < V; i++) {
      const k = j * V + i, x = x0 + i * step, z = z0 + j * step, h = hs[k];
      const hx = hs[j * V + Math.min(i + 1, SEG)] - hs[j * V + Math.max(i - 1, 0)];
      const hz = hs[Math.min(j + 1, SEG) * V + i] - hs[Math.max(j - 1, 0) * V + i];
      const slope = 1 / Math.hypot(hx / (2 * step), hz / (2 * step), 1);
      pos[k * 3] = x; pos[k * 3 + 1] = h; pos[k * 3 + 2] = z;
      colorAt(x, z, h, slope, tmp); col[k * 3] = tmp.r; col[k * 3 + 1] = tmp.g; col[k * 3 + 2] = tmp.b;
    }
    const idx = [];
    for (let j = 0; j < SEG; j++) for (let i = 0; i < SEG; i++) {
      const a = j * V + i, b = a + 1, c = a + V, d = c + 1;
      if (Math.max(hs[a], hs[b], hs[c], hs[d]) < -3) continue;
      idx.push(a, c, b, b, c, d);
    }
    if (!idx.length) return { empty: true };
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setIndex(idx); g.computeVertexNormals();
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(g, chunkMat); mesh.receiveShadow = true;
    group.add(mesh);

    scene.add(group);
    return { group, hs, x0, z0, step, ci, cj, veg: null };
  }

  // Vegetation lives only near the ship; past that the painted terrain
  // colors carry the jungle on their own.
  function addVeg(c) {
    const w = NK.world, { hs, x0, z0, step, ci, cj } = c, V = SEG + 1;
    const rnd = NK.rng(ci * 92821 + cj * 68917);
    const palms = [], trees = [];
    const tries = NK.isMobile ? 500 : 900;
    for (let t = 0; t < tries; t++) {
      const fx = rnd(), fz = rnd();
      const i = Math.min(SEG - 1, (fx * SEG) | 0), j = Math.min(SEG - 1, (fz * SEG) | 0);
      const h = hs[j * V + i];
      if (h < 1.6 || h > 230) continue;
      const hx = hs[j * V + i + 1] - h, hz = hs[(j + 1) * V + i] - h;
      if (Math.hypot(hx, hz) / step > 0.9) continue;
      const x = x0 + fx * CHUNK, z = z0 + fz * CHUNK;
      if (NK.ports.nearTown(x, z, 20)) continue;
      const s = w.shore(x, z);
      const dens = NK.fbm(x * 0.004, z * 0.004, 3) * 0.5 + 0.5;
      if (s < 150 && h < 16) { if (rnd() < 0.35 && palms.length < 90) palms.push([x, h, z, rnd()]); }
      else if (rnd() < dens && trees.length < 300) trees.push([x, h, z, rnd()]);
    }
    const g = new THREE.Group();
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), p3 = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
    const place = (geo, list, scaleBase, scaleVar, tint) => {
      if (!list.length) return;
      const im = new THREE.InstancedMesh(geo, treeMat, list.length);
      list.forEach(([x, h, z, r], n) => {
        q.setFromAxisAngle(up, r * Math.PI * 2);
        const s = scaleBase + r * scaleVar; sc.set(s, s * (0.85 + r * 0.3), s);
        p3.set(x, h - 0.5, z); m4.compose(p3, q, sc); im.setMatrixAt(n, m4);
        tmp.setHSL(tint[0] + (r - 0.5) * 0.06, tint[1], tint[2] + (r - 0.5) * 0.16); im.setColorAt(n, tmp);
      });
      im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
      im.castShadow = true; im.receiveShadow = true; im.frustumCulled = false;
      g.add(im);
    };
    place(palmGeo, palms, 0.85, 0.5, [0.14, 0.3, 0.8]);
    place(treeGeo, trees, 1.3, 1.3, [0.22, 0.35, 0.72]);
    c.group.add(g); c.veg = g;
  }
  function removeVeg(c) {
    if (!c.veg) return;
    c.group.remove(c.veg); c.veg.children.forEach(o => o.dispose && o.dispose()); c.veg = null;
  }

  function disposeChunk(c) {
    if (!c || !c.group) return;
    removeVeg(c);
    scene.remove(c.group);
    c.group.children.forEach(o => { if (o.geometry) o.geometry.dispose(); });
  }

  function init(sc) {
    scene = sc;
    chunkMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0 });
    nearDiscard(chunkMat, false);
    farMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 });
    nearDiscard(farMat, true);
    treeMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, metalness: 0 });
    // Leaves stir in the wind.
    treeMat.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = NK.land.timeUniform;
      sh.vertexShader = 'uniform float uTime;\n' + sh.vertexShader.replace('#include <begin_vertex>',
        `#include <begin_vertex>
         float sway = max(position.y - 4.0, 0.0) * 0.012;
         vec4 ip = instanceMatrix * vec4(0.0,0.0,0.0,1.0);
         transformed.x += sin(uTime * 1.3 + ip.x * 0.05 + ip.z * 0.03) * sway * 6.0;
         transformed.z += cos(uTime * 1.1 + ip.z * 0.05) * sway * 4.0;`);
    };
    palmGeo = makePalm(); treeGeo = makeTree();
    buildFar();
  }

  function update(focus, force) {
    nearUniform.value.set(focus.x, focus.z, NEAR_R);
    const ci0 = Math.floor(focus.x / CHUNK), cj0 = Math.floor(focus.z / CHUNK), r = Math.ceil(LOAD_R / CHUNK);
    const wanted = new Set();
    for (let dj = -r; dj <= r; dj++) for (let di = -r; di <= r; di++) {
      const ci = ci0 + di, cj = cj0 + dj;
      const cx = (ci + 0.5) * CHUNK, cz = (cj + 0.5) * CHUNK;
      const d = Math.hypot(cx - focus.x, cz - focus.z);
      if (d > LOAD_R + CHUNK * 0.71) continue;
      const key = ci + ',' + cj; wanted.add(key);
      if (!chunks.has(key) && !queue.some(q => q.key === key)) queue.push({ key, ci, cj, d });
    }
    for (const [key, c] of chunks) if (!wanted.has(key)) { disposeChunk(c); chunks.delete(key); }
    queue = queue.filter(q => wanted.has(q.key));
    queue.forEach(q => q.d = Math.hypot((q.ci + 0.5) * CHUNK - focus.x, (q.cj + 0.5) * CHUNK - focus.z));
    queue.sort((a, b) => a.d - b.d);
    const budget = force ? Infinity : 2;
    let built = 0;
    const t0 = performance.now();
    while (queue.length && built < budget && (force || performance.now() - t0 < 10)) {
      const q = queue.shift();
      chunks.set(q.key, buildChunk(q.ci, q.cj)); built++;
    }
    // Vegetation in and out with distance.
    let vegBuilt = 0;
    for (const c of chunks.values()) {
      if (!c.group) continue;
      const d = Math.hypot((c.ci + 0.5) * CHUNK - focus.x, (c.cj + 0.5) * CHUNK - focus.z);
      if (!c.veg && d < VEG_R && (force || vegBuilt < 1)) { addVeg(c); vegBuilt++; }
      else if (c.veg && d > VEG_R + 400) removeVeg(c);
    }
    NK.land.timeUniform.value = NK.T;
  }

  return { init, update, timeUniform: { value: 0 }, colorAt, get pending() { return queue.length; } };
})();
