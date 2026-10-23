// ============ NAKHODA: THE WORLD FIELD ============
// Turns the real coastlines (js/data/coastlines.js) into a continuous world:
// a land mask, a signed distance-to-coast field, a height function for the
// islands, a sea-lane navigation grid for AI captains, and the coastal
// anchorages for every port in js/data/ports.js.

NK.world = (function () {
  const B = { lngMin: 92, lngMax: 136, latMin: -12, latMax: 21 };
  const RES = 0.02;                                   // degrees per field pixel
  const W = Math.round((B.lngMax - B.lngMin) / RES);  // 2200
  const H = Math.round((B.latMax - B.latMin) / RES);  // 1650
  const U = WORLD_PROJ.scale * RES;                   // world units per pixel (12)
  const x0 = (B.lngMin - WORLD_PROJ.lng0) * WORLD_PROJ.scale;
  const z0 = -(B.latMax - WORLD_PROJ.lat0) * WORLD_PROJ.scale;
  const CAP = 255;

  let sdf = null;      // Float32Array, pixels; + inland, - out to sea
  let mask = null;     // Uint8Array, 1 = land

  function build() {
    // 1. Rasterize the landmass polygons.
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const g = cv.getContext('2d');
    g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#fff';
    const toPx = (lng, lat) => [(lng - B.lngMin) / RES, (B.latMax - lat) / RES];
    COASTLINES.features.forEach(f => {
      const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
      polys.forEach(poly => {
        g.beginPath();
        poly.forEach(ring => ring.forEach(([lng, lat], i) => { const [px, py] = toPx(lng, lat); i ? g.lineTo(px, py) : g.moveTo(px, py); }));
        g.fill('evenodd');
      });
    });
    const img = g.getImageData(0, 0, W, H).data;
    mask = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) mask[i] = img[i * 4] > 127 ? 1 : 0;

    // 2. Two chamfer distance transforms: land-to-sea and sea-to-land.
    const dl = chamfer(1), ds = chamfer(0);
    sdf = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) sdf[i] = mask[i] ? dl[i] - 0.5 : -(ds[i] - 0.5);
  }

  function chamfer(target) {
    // Distance (in px) from each `target` cell to the nearest non-target cell.
    const d = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) d[i] = mask[i] === target ? CAP : 0;
    const a = 1, b = 1.4142;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x; let v = d[i]; if (!v) continue;
      if (x > 0) v = Math.min(v, d[i - 1] + a);
      if (y > 0) {
        v = Math.min(v, d[i - W] + a);
        if (x > 0) v = Math.min(v, d[i - W - 1] + b);
        if (x < W - 1) v = Math.min(v, d[i - W + 1] + b);
      }
      d[i] = v;
    }
    for (let y = H - 1; y >= 0; y--) for (let x = W - 1; x >= 0; x--) {
      const i = y * W + x; let v = d[i]; if (!v) continue;
      if (x < W - 1) v = Math.min(v, d[i + 1] + a);
      if (y < H - 1) {
        v = Math.min(v, d[i + W] + a);
        if (x < W - 1) v = Math.min(v, d[i + W + 1] + b);
        if (x > 0) v = Math.min(v, d[i + W - 1] + b);
      }
      d[i] = v;
    }
    return d;
  }

  // Signed distance to the coast in world units (bilinear). + is land.
  function coast(x, z) {
    const fx = (x - x0) / U - 0.5, fz = (z - z0) / U - 0.5;
    if (fx < 0 || fz < 0 || fx >= W - 1 || fz >= H - 1) return -CAP * U;
    const ix = fx | 0, iz = fz | 0, tx = fx - ix, tz = fz - iz, i = iz * W + ix;
    const a = sdf[i], b = sdf[i + 1], c = sdf[i + W], d = sdf[i + W + 1];
    return ((a + (b - a) * tx) * (1 - tz) + (c + (d - c) * tx) * tz) * U;
  }
  // The same field with a fractal fringe, so coastlines read as bays, spits
  // and headlands instead of the source data's straight survey segments.
  function shore(x, z) {
    return coast(x, z) + NK.fbm(x * 0.0035, z * 0.0035, 4) * 34 + NK.fbm(x * 0.018, z * 0.018, 2) * 7;
  }

  // Volcano landmarks (lat, lng, height, radius). The atlas's five plus the
  // peaks a 1500 pilot steered by.
  const VOLCANOES = [
    ['Krakatau', -6.10, 105.42, 170, 150], ['Merapi', -7.54, 110.44, 300, 420], ['Semeru', -8.11, 112.92, 330, 420],
    ['Tambora', -8.25, 117.99, 300, 450], ['Gamalama', 0.80, 127.33, 230, 170], ['Gunung Api', -4.52, 129.87, 150, 110],
    ['Agung', -8.34, 115.51, 290, 360], ['Rinjani', -8.41, 116.46, 310, 380], ['Kinabalu', 6.08, 116.56, 380, 520],
    ['Kerinci', -1.70, 101.26, 340, 460], ['Mayon', 13.26, 123.69, 290, 330], ['Lokon', 1.36, 124.79, 220, 260],
    ['Tidore Peak', 0.66, 127.40, 220, 160], ['Sangeang Api', -8.20, 119.06, 180, 140]
  ].map(([name, lat, lng, h, r]) => { const p = worldProject(lat, lng); return { name, x: p.x, z: p.z, h, r }; });

  function height(x, z) {
    let s = shore(x, z);
    let h;
    if (s < 0) {
      h = Math.max(-45, -0.7 + s * 0.05);
    } else {
      const beach = NK.smooth(0, 30, s);
      const inland = NK.smooth(20, 700, s);
      const hills = NK.fbm(x * 0.0011 + 7, z * 0.0011, 5) * 0.5 + 0.5;
      const ridge = NK.ridged(x * 0.0008, z * 0.0008 + 3, 4);
      h = 0.4 + beach * 1.6 + Math.min(s, 300) * 0.035 + inland * (16 + hills * 70) + inland * inland * ridge * 190;
    }
    for (let i = 0; i < VOLCANOES.length; i++) {
      const v = VOLCANOES[i];
      const d = Math.hypot(x - v.x, z - v.z);
      if (d > v.r * 1.6) continue;
      let cone = v.h * Math.pow(Math.max(0, 1 - d / (v.r * 1.6)), 1.7);
      const crater = v.h * 0.14 * Math.max(0, 1 - d / (v.r * 0.12));
      cone = cone - crater + NK.fbm(x * 0.02, z * 0.02, 2) * 4;
      if (cone > h) h = cone;
    }
    return h;
  }

  // ---------- Sea lanes: a coarse grid + A* for AI captains ----------
  const NC = 0.2;                                        // degrees per nav cell
  const NW = Math.round((B.lngMax - B.lngMin) / NC), NH = Math.round((B.latMax - B.latMin) / NC);
  const NU = WORLD_PROJ.scale * NC;
  let nav = null;
  function buildNav() {
    nav = new Uint8Array(NW * NH);
    for (let j = 0; j < NH; j++) for (let i = 0; i < NW; i++) {
      const cx = x0 + (i + 0.5) * NU, cz = z0 + (j + 0.5) * NU;
      nav[j * NW + i] = coast(cx, cz) < -40 ? 1 : 0;
    }
  }
  const cellOf = (x, z) => [NK.clamp(Math.floor((x - x0) / NU), 0, NW - 1), NK.clamp(Math.floor((z - z0) / NU), 0, NH - 1)];
  const cellCenter = (i, j) => [x0 + (i + 0.5) * NU, z0 + (j + 0.5) * NU];
  function nearestNav(x, z) {
    const [ci, cj] = cellOf(x, z);
    for (let r = 0; r < 12; r++) for (let dj = -r; dj <= r; dj++) for (let di = -r; di <= r; di++) {
      if (Math.max(Math.abs(di), Math.abs(dj)) !== r) continue;
      const i = ci + di, j = cj + dj;
      if (i >= 0 && j >= 0 && i < NW && j < NH && nav[j * NW + i]) return [i, j];
    }
    return null;
  }
  function clearLine(ax, az, bx, bz, margin) {
    const d = Math.hypot(bx - ax, bz - az), n = Math.ceil(d / 25);
    for (let k = 1; k < n; k++) { const t = k / n; if (coast(ax + (bx - ax) * t, az + (bz - az) * t) > -margin) return false; }
    return true;
  }
  const pathCache = new Map();
  function route(ax, az, bx, bz) {
    const s = nearestNav(ax, az), e = nearestNav(bx, bz);
    if (!s || !e) return null;
    const key = s.join(',') + '>' + e.join(',');
    if (pathCache.has(key)) return pathCache.get(key).map(p => p.slice());
    const N = NW * NH, gs = new Float32Array(N).fill(Infinity), from = new Int32Array(N).fill(-1), closed = new Uint8Array(N);
    const start = s[1] * NW + s[0], goal = e[1] * NW + e[0];
    const heap = [[0, start]]; gs[start] = 0;
    const hfn = idx => Math.hypot((idx % NW) - e[0], ((idx / NW) | 0) - e[1]);
    const push = item => { heap.push(item); let i = heap.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } };
    const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === i) break; [heap[m], heap[i]] = [heap[i], heap[m]]; i = m; } } return top; };
    let found = false, guard = 0;
    while (heap.length && guard++ < 60000) {
      const [, cur] = pop(); if (closed[cur]) continue; closed[cur] = 1;
      if (cur === goal) { found = true; break; }
      const ci = cur % NW, cj = (cur / NW) | 0;
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
        if (!di && !dj) continue;
        const ni = ci + di, nj = cj + dj; if (ni < 0 || nj < 0 || ni >= NW || nj >= NH) continue;
        const n = nj * NW + ni; if (!nav[n] || closed[n]) continue;
        const g2 = gs[cur] + (di && dj ? 1.414 : 1);
        if (g2 < gs[n]) { gs[n] = g2; from[n] = cur; push([g2 + hfn(n), n]); }
      }
    }
    if (!found) { pathCache.set(key, null); return null; }
    let pts = []; for (let c = goal; c !== -1; c = from[c]) pts.push(cellCenter(c % NW, (c / NW) | 0));
    pts.reverse();
    // String-pull the grid path into long straight tacks.
    const out = [pts[0]]; let k = 0;
    while (k < pts.length - 1) {
      let far = k + 1;
      for (let m = pts.length - 1; m > k + 1; m--) if (clearLine(pts[k][0], pts[k][1], pts[m][0], pts[m][1], 30)) { far = m; break; }
      out.push(pts[far]); k = far;
    }
    pathCache.set(key, out);
    return out.map(p => p.slice());
  }

  // ---------- Ports on real coasts ----------
  function gradient(x, z) {
    const e = 24;
    const gx = coast(x + e, z) - coast(x - e, z), gz = coast(x, z + e) - coast(x, z - e);
    const l = Math.hypot(gx, gz) || 1;
    return [gx / l, gz / l];   // points inland
  }
  function placePorts() {
    return PORT_DATA.map((p, idx) => {
      let { x, z } = worldProject(p.lat, p.lng);
      // Walk to the shoreline along the distance field.
      for (let it = 0; it < 80; it++) {
        const s = shore(x, z); if (Math.abs(s) < 1.5) break;
        const [gx, gz] = gradient(x, z);
        const step = NK.clamp(Math.abs(s) * 0.7, 1, 120) * Math.sign(s);
        x -= gx * step; z -= gz * step;
      }
      const [nx, nz] = gradient(x, z);
      // Anchorage: far enough out that a jong swings clear of the shallows.
      let ax = x - nx * 60, az = z - nz * 60;
      for (let k = 0; k < 40 && coast(ax, az) > -32; k++) { ax -= nx * 10; az -= nz * 10; }
      return {
        idx, name: p.name, lat: p.lat, lng: p.lng,
        entrepot: !!p.entrepot, maluku: !!p.maluku,
        x, z,                       // where the waterfront meets the sea
        nx, nz,                     // inland direction
        ax, az,                     // anchorage in open water
        town: { x: x + nx * 34, z: z + nz * 34 },
        faction: (typeof factionForPort === 'function') ? factionForPort(p.name) : null
      };
    });
  }

  return {
    B, W, H, U, x0, z0,
    build() { build(); buildNav(); this.ports = placePorts(); },
    coast, shore, height, route, clearLine, nearestNav,
    VOLCANOES,
    isLand: (x, z) => shore(x, z) > 0,
    // Raw pixel access for the water shader's depth texture and the chart.
    get sdf() { return sdf; }, get mask() { return mask; },
    inBounds: (x, z) => x > x0 + 400 && z > z0 + 400 && x < x0 + W * U - 400 && z < z0 + H * U - 400
  };
})();
