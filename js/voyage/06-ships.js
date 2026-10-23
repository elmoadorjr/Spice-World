// ============ NAKHODA: SHIPWRIGHT ============
// Fifteenth-century Nusantara hulls, built in code. Each ladder rung is a
// real type: the outrigger kelulus, the pencalang trader with its thatched
// cargo house, the broad malangbang, the oared lancaran, the four-masted
// jong with bipod masts, bowsprit sail and stacked castles; and for raiders
// the penjajap galley, low and long, shields on the rail, oars out.
// Shared details: lofted plank hulls with carved upswept stem and stern
// posts, painted gunwale bands, canted tanja sails of woven pandan with
// bamboo battens, paired quarter rudders, rigging, long umbul-umbul
// pennants and bronze lantaka on swivel posts.

NK.ships = (function () {
  // L length, B beam, D depth; masts: [position along hull (-1..1), sail width, height, bipod?]
  const TYPES = {
    kelulus:    { n: 'Kelulus',    L: 13, B: 2.3, D: 1.1, sheer: 2.6, masts: [[0.12, 6.2, 7.2]], outrigger: true, house: 0.18, guns: 1 },
    pencalang:  { n: 'Pencalang',  L: 17, B: 3.5, D: 1.5, sheer: 2.2, masts: [[0.34, 6.5, 8], [-0.08, 7.5, 9]], house: 0.32, guns: 2 },
    malangbang: { n: 'Malangbang', L: 21, B: 5.0, D: 1.8, sheer: 1.8, masts: [[0.36, 7.5, 9], [-0.06, 9, 10.5, true]], house: 0.36, castle: 1, guns: 2 },
    lancaran:   { n: 'Lancaran',   L: 27, B: 4.3, D: 1.7, sheer: 2.4, masts: [[0.46, 6.5, 8], [0.14, 8.5, 10.5], [-0.2, 7.5, 9]], house: 0.26, castle: 1, oars: 9, guns: 3 },
    jong:       { n: 'Jong',       L: 38, B: 8.2, D: 3.0, sheer: 1.6, masts: [[0.44, 8, 10, true], [0.16, 11.5, 14, true], [-0.1, 11, 13, true], [-0.34, 7.5, 9.5]], bowsprit: true, house: 0.3, castle: 2, guns: 5 },
    penjajap:   { n: 'Penjajap',   L: 22, B: 3.4, D: 1.2, sheer: 2.8, masts: [[0.3, 6, 7.5], [-0.1, 7, 8.5]], oars: 10, shields: true, guns: 2 }
  };
  const LADDER = ['kelulus', 'pencalang', 'malangbang', 'lancaran', 'jong'];
  const HULLS = LADDER.map(k => TYPES[k]);
  const texCache = {};

  // ---------- Textures ----------
  function canvasTex(key, w, h, paint) {
    if (texCache[key]) return texCache[key];
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    paint(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.anisotropy = 4;
    return (texCache[key] = t);
  }
  // Woven pandan matting with bamboo battens.
  function sailTexture(tone) {
    const base = { mat: ['#ecdcb2', '#a88654'], pale: ['#f3ead0', '#b79a68'], dark: ['#5b3029', '#2c1714'], royal: ['#efdcae', '#a07a3c'] }[tone] || ['#ecdcb2', '#a88654'];
    return canvasTex('sail-' + tone, 256, 256, (g, w, h) => {
      g.fillStyle = base[0]; g.fillRect(0, 0, w, h);
      for (let y = 0; y < h; y += 6) for (let x = 0; x < w; x += 6) {
        g.fillStyle = ((x + y) / 6) % 2 ? 'rgba(80,50,20,0.07)' : 'rgba(255,255,255,0.06)';
        g.fillRect(x, y, 6, 6);
      }
      // Panels stitched vertically, battens across.
      g.fillStyle = 'rgba(80,50,20,0.12)'; for (let x = 0; x < w; x += 32) g.fillRect(x, 0, 2, h);
      for (let y = 14; y < h; y += 30) { g.fillStyle = base[1]; g.fillRect(0, y, w, 5); g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(0, y + 5, w, 1); }
      if (tone === 'royal') { g.fillStyle = '#8B3A3A'; g.fillRect(0, h * 0.42, w, h * 0.12); g.fillStyle = '#e8c06a'; g.fillRect(0, h * 0.47, w, h * 0.02); }
      g.strokeStyle = base[1]; g.lineWidth = 6; g.strokeRect(0, 0, w, h);
    });
  }
  // Teak strakes, a painted band under the rail, pitch below the waterline.
  function hullTexture(style) {
    return canvasTex('hull-' + style, 512, 256, (g, w, h) => {
      const dark = style === 'penjajap';
      g.fillStyle = dark ? '#3d2a1f' : '#7b4b2a'; g.fillRect(0, 0, w, h);
      // Strakes run along the hull (x); girth runs down the canvas (y): rail at both edges, keel in the middle.
      for (let y = 0; y < h; y += 12) {
        g.fillStyle = (y / 12) % 2 ? 'rgba(255,220,170,0.07)' : 'rgba(0,0,0,0.07)'; g.fillRect(0, y, w, 12);
        g.fillStyle = 'rgba(30,15,5,0.35)'; g.fillRect(0, y, w, 1);
      }
      for (let i = 0; i < 260; i++) { g.fillStyle = 'rgba(40,20,8,0.12)'; g.fillRect(Math.random() * w, Math.random() * h, 20 + Math.random() * 60, 1); }
      // Below the waterline: pitch and lime.
      g.fillStyle = dark ? '#1c1411' : '#2e2119'; g.fillRect(0, h * 0.34, w, h * 0.32);
      g.fillStyle = 'rgba(230,225,200,0.22)'; g.fillRect(0, h * 0.34, w, 3); g.fillRect(0, h * 0.66 - 3, w, 3);
      // Painted band: Malay boat geometry in red, white and black.
      const band = (y0, flip) => {
        g.fillStyle = dark ? '#2a1712' : '#1f1a17'; g.fillRect(0, y0, w, 22);
        const tri = dark ? ['#7a1f17', '#b8452f'] : ['#b23a26', '#f1e6c8'];
        for (let x = 0; x < w; x += 22) {
          g.fillStyle = tri[(x / 22) % 2]; g.beginPath();
          if (flip) { g.moveTo(x, y0 + 4); g.lineTo(x + 11, y0 + 18); g.lineTo(x + 22, y0 + 4); }
          else { g.moveTo(x, y0 + 18); g.lineTo(x + 11, y0 + 4); g.lineTo(x + 22, y0 + 18); }
          g.fill();
        }
        g.fillStyle = '#e9d9a8'; g.fillRect(0, flip ? y0 + 20 : y0, w, 2);
      };
      band(6, false); band(h - 28, true);
      g.fillStyle = '#c99a5e'; g.fillRect(0, 0, w, 5); g.fillRect(0, h - 5, w, 5);   // the rail cap
    });
  }
  function thatchTexture() {
    return canvasTex('thatch', 128, 128, (g, w, h) => {
      g.fillStyle = '#a8864f'; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 900; i++) { g.strokeStyle = Math.random() < 0.5 ? 'rgba(70,45,20,0.35)' : 'rgba(240,210,150,0.25)'; g.beginPath(); const x = Math.random() * w, y = Math.random() * h; g.moveTo(x, y); g.lineTo(x + (Math.random() - 0.5) * 3, y + 8 + Math.random() * 8); g.stroke(); }
      for (let y = 0; y < h; y += 16) { g.fillStyle = 'rgba(60,35,15,0.35)'; g.fillRect(0, y, w, 2); }
    });
  }

  // ---------- Hull ----------
  function hullShape(T, u) {
    const au = Math.abs(u);
    const b = T.B / 2 * Math.pow(Math.max(0, 1 - Math.pow(au, 2.1)), 0.5);
    const top = T.D + T.D * T.sheer * Math.pow(au, 3.2) * (u > 0 ? 1.12 : 1);
    const keel = -T.D * 0.9 * (1 - Math.pow(au, 2.6)) + T.D * 0.25 * Math.pow(au, 3);
    return { b, top, keel };
  }
  function hullGeometry(T) {
    const N = 64, K = 12, pos = [], uv = [], idx = [];
    for (let s = 0; s <= N; s++) {
      const u = s / N * 2 - 1, { b, top, keel } = hullShape(T, u);
      for (let k = -K; k <= K; k++) {
        const phi = Math.abs(k) / K * Math.PI / 2;
        // Round bilge, slight flare toward the rail.
        const lat = Math.sign(k) * (b + 0.02) * Math.pow(Math.sin(phi), 0.75) * (1 + 0.07 * (1 - Math.cos(phi)));
        const y = keel * Math.cos(phi) + top * (1 - Math.cos(phi));
        pos.push(u * T.L / 2, y, lat);
        uv.push(s / N, (k + K) / (2 * K));
      }
    }
    const R = 2 * K + 1;
    for (let s = 0; s < N; s++) for (let k = 0; k < 2 * K; k++) {
      const a = s * R + k, b = a + 1, c = a + R, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx); g.computeVertexNormals();
    return g;
  }
  function deckGeometry(T, deckY) {
    const shape = new THREE.Shape(), N = 30;
    for (let s = 0; s <= N; s++) { const u = s / N * 1.8 - 0.9; shape.lineTo(u * T.L / 2, -hullShape(T, u).b * 0.95); }
    for (let s = N; s >= 0; s--) { const u = s / N * 1.8 - 0.9; shape.lineTo(u * T.L / 2, hullShape(T, u).b * 0.95); }
    const g = new THREE.ShapeGeometry(shape); g.rotateX(Math.PI / 2); g.translate(0, deckY, 0);
    return g;
  }

  // ---------- Parts ----------
  function curl(points, r, mat) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    const m = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, r, 6, false), mat); m.castShadow = true; return m;
  }
  function sailGeometry(w, h) {
    const g = new THREE.PlaneGeometry(w, h, 6, 6);
    const p = g.attributes.position;
    // Tanja cant: the head yard rakes forward over the bow.
    for (let i = 0; i < p.count; i++) { const y = p.getY(i) + h / 2; p.setX(i, p.getX(i) + w * 0.42 + (y / h) * w * 0.34); p.setY(i, y); }
    g.translate(-w * 0.15, 0, 0);
    return g;
  }

  function build(tier, opts) {
    opts = opts || {};
    const key = opts.sail === 'dark' ? 'penjajap' : LADDER[Math.min(tier, LADDER.length - 1)];
    const base = TYPES[key];
    const k = opts.sail === 'dark' ? 0.85 + Math.min(tier, 4) * 0.15 : 1;
    const T = Object.assign({}, base, { L: base.L * k, B: base.B * k, D: base.D * k });
    const group = new THREE.Group();
    const wood = new THREE.MeshStandardMaterial({ color: 0x6e4528, roughness: 0.7 });
    const timber = new THREE.MeshStandardMaterial({ color: 0x5a3a22, roughness: 0.8 });
    const bamboo = new THREE.MeshStandardMaterial({ color: 0xc8a96a, roughness: 0.7 });
    const bronze = new THREE.MeshStandardMaterial({ color: 0xb58a3c, roughness: 0.35, metalness: 0.7 });
    const rope = new THREE.LineBasicMaterial({ color: 0x3b2a1a, transparent: true, opacity: 0.8 });

    // Hull and deck.
    const hullMat = new THREE.MeshStandardMaterial({ map: hullTexture(key), roughness: 0.62, side: THREE.DoubleSide });
    const hull = new THREE.Mesh(hullGeometry(T), hullMat); hull.castShadow = hull.receiveShadow = true; group.add(hull);
    const deckY = T.D * 0.9;
    const deck = new THREE.Mesh(deckGeometry(T, deckY), new THREE.MeshStandardMaterial({ color: 0xb48552, roughness: 0.8, side: THREE.DoubleSide }));
    deck.receiveShadow = true; group.add(deck);

    // Carved stem and stern posts curling up from the sheer.
    const endTop = u => hullShape(T, u).top;
    const r = 0.12 + T.D * 0.06;
    group.add(curl([[T.L * 0.47, endTop(0.94), 0], [T.L * 0.52, endTop(1) + T.D * 0.6, 0], [T.L * 0.55, endTop(1) + T.D * 1.4, 0], [T.L * 0.52, endTop(1) + T.D * 1.9, 0], [T.L * 0.5, endTop(1) + T.D * 1.75, 0]], r, wood));
    group.add(curl([[-T.L * 0.47, endTop(-0.94), 0], [-T.L * 0.515, endTop(-1) + T.D * 0.5, 0], [-T.L * 0.535, endTop(-1) + T.D * 1.2, 0], [-T.L * 0.505, endTop(-1) + T.D * 1.6, 0]], r, wood));

    // Thatched deck house (kurung) amidships or aft.
    const thatch = new THREE.MeshStandardMaterial({ map: thatchTexture(), roughness: 0.95, side: THREE.DoubleSide });
    if (T.house) {
      const hl = T.L * T.house, hw = T.B * 0.62, hh = T.D * 0.9;
      const x = key === 'kelulus' ? -T.L * 0.12 : -T.L * 0.02;
      const walls = new THREE.Mesh(new THREE.BoxGeometry(hl, hh, hw), new THREE.MeshStandardMaterial({ color: 0x8a6440, roughness: 0.85 }));
      walls.position.set(x, deckY + hh / 2, 0); walls.castShadow = true; group.add(walls);
      const roof = new THREE.Mesh(new THREE.CylinderGeometry(hw * 0.62, hw * 0.62, hl * 1.08, 14, 1, true, 0, Math.PI), thatch);
      roof.rotation.set(0, 0, Math.PI / 2);          // half-barrel arching over the house, ridge fore-and-aft
      roof.position.set(x, deckY + hh, 0); roof.castShadow = true; group.add(roof);
    }
    // Castles: raised platforms fore and aft with tiered roofs (jong, lancaran).
    if (T.castle) {
      const tiers = T.castle;
      [[-0.4, 1], [0.38, tiers > 1 ? 0.75 : 0]].forEach(([u, scale]) => {
        if (!scale) return;
        const cl = T.L * 0.14 * scale, cw = T.B * 0.85, ch = T.D * 1.1 * scale;
        const y0 = hullShape(T, u).top;
        const box = new THREE.Mesh(new THREE.BoxGeometry(cl, ch, cw), new THREE.MeshStandardMaterial({ color: 0x7b5434, roughness: 0.8 }));
        box.position.set(u * T.L / 2, y0 + ch / 2 - T.D * 0.15, 0); box.castShadow = true; group.add(box);
        for (let t = 0; t < tiers; t++) {
          const rr = new THREE.Mesh(new THREE.ConeGeometry(cw * (0.78 - t * 0.2), ch * 0.7, 4, 1, true), thatch);
          rr.rotation.y = Math.PI / 4; rr.scale.set(cl / cw * 1.15, 1, 1);
          rr.position.set(u * T.L / 2, y0 + ch - T.D * 0.15 + ch * (0.3 + t * 0.45), 0); rr.castShadow = true; group.add(rr);
        }
      });
    }
    // Paired quarter rudders.
    [-1, 1].forEach(sd => {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.9 + T.D * 0.2, T.D * 2.8, 0.18), timber);
      blade.position.set(-T.L * 0.38, deckY * 0.3, sd * (hullShape(T, -0.76).b + 0.25)); blade.rotation.z = -0.4; blade.castShadow = true; group.add(blade);
    });
    // Outriggers: cross-booms, struts and upturned floats.
    if (T.outrigger) {
      [0.26, -0.24].forEach(u => {
        const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, T.B * 3.8, 6), bamboo);
        boom.rotation.x = Math.PI / 2; boom.position.set(u * T.L, deckY + 0.35, 0); group.add(boom);
      });
      [-1, 1].forEach(sd => {
        const fl = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, T.L * 0.72, 8), bamboo);
        fl.rotation.z = Math.PI / 2; fl.position.set(T.L * 0.02, 0.05, sd * T.B * 1.8); group.add(fl);
        [0.26, -0.24].forEach(u => { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, deckY + 0.3, 5), bamboo); st.position.set(u * T.L, (deckY + 0.3) / 2, sd * T.B * 1.8); group.add(st); });
      });
    }
    // Oars along both sides.
    const oars = [];
    if (T.oars) {
      const oarMat = new THREE.MeshStandardMaterial({ color: 0x9a7448, roughness: 0.8 });
      const len = T.B * 1.7;
      for (let i = 0; i < T.oars; i++) {
        const u = -0.32 + i / (T.oars - 1) * 0.62;
        [-1, 1].forEach(sd => {
          const pivot = new THREE.Group();
          pivot.position.set(u * T.L / 2 * 1.9 * 0.5, hullShape(T, u).top * 0.9, sd * hullShape(T, u).b);
          const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, len), oarMat); shaft.position.z = sd * len / 2;
          const blade = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.9), oarMat); blade.position.z = sd * (len - 0.3);
          pivot.add(shaft, blade); pivot.rotation.x = sd * 0.55;
          group.add(pivot); oars.push({ pivot, sd, phase: i * 0.3 });
        });
      }
    }
    // Shields along the rail (raiders).
    if (T.shields) {
      const sm = [new THREE.MeshStandardMaterial({ color: 0x8a2a1d, roughness: 0.7 }), new THREE.MeshStandardMaterial({ color: 0x1c1712, roughness: 0.7 })];
      for (let i = 0; i < 12; i++) {
        const u = -0.5 + i / 11 * 0.9;
        [-1, 1].forEach(sd => {
          const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.1, 10), sm[(i + (sd > 0 ? 1 : 0)) % 2]);
          sh.rotation.x = Math.PI / 2; sh.position.set(u * T.L / 2, hullShape(T, u).top + 0.25, sd * (hullShape(T, u).b + 0.06)); group.add(sh);
        });
      }
    }

    // Masts (bipod on the great ships) and tanja sails.
    const tone = opts.sail || 'mat';
    const sailMat = new THREE.MeshStandardMaterial({ map: sailTexture(tone), roughness: 0.92, side: THREE.DoubleSide });
    const sails = [], lines = [];
    const flagColor = new THREE.Color(opts.flag || 0xb8873d);
    let mainTop = null;
    T.masts.forEach(([mu, sw, sh, bipod], mi) => {
      const w = sw * k, h = sh * k, mh = h * 1.22 + T.D, x = mu * T.L / 2;
      const top = new THREE.Vector3(x, deckY + mh, 0);
      if (bipod) {
        [-1, 1].forEach(sd => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.11 * k + 0.05, 0.16 * k + 0.08, mh * 1.01, 6), timber);
          const spread = T.B * 0.32;
          leg.position.set(x, deckY + mh / 2, sd * spread / 2); leg.rotation.x = sd * Math.atan2(spread / 2, mh); leg.castShadow = true; group.add(leg);
        });
      } else {
        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.1 * k + 0.05, 0.16 * k + 0.08, mh, 7), timber);
        mast.position.set(x, deckY + mh / 2, 0); mast.castShadow = true; group.add(mast);
      }
      if (!mainTop || sh > mainTop.h) mainTop = { v: top, h: sh };
      // Shrouds and stays.
      lines.push(top, new THREE.Vector3(x - 0.3, deckY + 0.2, hullShape(T, mu).b * 0.95));
      lines.push(top, new THREE.Vector3(x - 0.3, deckY + 0.2, -hullShape(T, mu).b * 0.95));
      lines.push(top, new THREE.Vector3(T.L * (mi === 0 ? 0.5 : 0.25), hullShape(T, mi === 0 ? 0.96 : 0.5).top + 0.3, 0));
      // Sail on its pivot; the frame faces aft so the sail streams back from the mast.
      const pivot = new THREE.Group(); pivot.position.set(x, deckY + T.D * 0.55, 0); group.add(pivot);
      const frame = new THREE.Group(); frame.rotation.y = Math.PI; pivot.add(frame);
      const sail = new THREE.Mesh(sailGeometry(w, h), sailMat); sail.castShadow = true; frame.add(sail);
      const spar = (len, sx, sy) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.09 * k + 0.03, 0.09 * k + 0.03, len, 6), bamboo); m.rotation.z = Math.PI / 2; m.position.set(sx, sy, 0); frame.add(m); return m; };
      const yard = spar(w * 1.14, w * 0.6, h);
      const boom = spar(w * 1.08, w * 0.27, 0.05);
      sails.push({ pivot, mesh: sail, yard, boom, h, w });
      // A long umbul-umbul pennant at each masthead.
      const pen = new THREE.Mesh(new THREE.PlaneGeometry(2.4 + h * 0.35, 0.55, 8, 1), new THREE.MeshStandardMaterial({ color: flagColor, side: THREE.DoubleSide, roughness: 0.8 }));
      const pa = pen.geometry.attributes.position;
      for (let i = 0; i < pa.count; i++) { const t = (pa.getX(i) / (2.4 + h * 0.35)) + 0.5; pa.setY(i, pa.getY(i) * (1 - t * 0.85)); }
      pen.geometry.translate((2.4 + h * 0.35) / 2, 0, 0);
      pen.position.set(x - 0.1, deckY + mh - 0.3, 0); pen.rotation.y = Math.PI;
      pen.userData.len = 2.4 + h * 0.35; group.add(pen); lines.flags = (lines.flags || []).concat(pen);
    });
    // Bowsprit with a small canted sail (jong).
    if (T.bowsprit) {
      const bs = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, T.L * 0.22, 6), timber);
      bs.rotation.z = Math.PI / 2 - 0.35; bs.position.set(T.L * 0.55, hullShape(T, 1).top + T.D * 0.4, 0); group.add(bs);
      // The spritsail hangs square beneath the bowsprit's outer end.
      const fsW = T.B * 0.75, fsH = T.D * 1.3;
      const fs = new THREE.Mesh(new THREE.PlaneGeometry(fsW, fsH, 2, 2), sailMat); fs.castShadow = true;
      const tipX = T.L * 0.55 + Math.cos(0.35) * T.L * 0.09, tipY = hullShape(T, 1).top + T.D * 0.4 + Math.sin(0.35) * T.L * 0.09;
      fs.position.set(tipX - 0.4, tipY - fsH / 2 - 0.3, 0); fs.rotation.y = Math.PI / 2;
      const fy = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, fsW * 1.1, 5), bamboo); fy.rotation.x = Math.PI / 2; fy.position.set(tipX - 0.4, tipY - 0.3, 0);
      group.add(fs, fy);
    }
    const rig = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(lines), rope); group.add(rig);

    // Lantaka on swivel posts along the rail.
    const guns = { left: [], right: [] };
    const gunGeo = new THREE.CylinderGeometry(0.13, 0.2, 1.3, 7); gunGeo.rotateX(Math.PI / 2);
    const postGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.6, 5);
    for (let i = 0; i < T.guns; i++) {
      const u = T.guns === 1 ? 0.05 : (i / (T.guns - 1) - 0.5) * 0.55;
      [-1, 1].forEach(sd => {
        const b = hullShape(T, u).b, y = hullShape(T, u).top;
        const post = new THREE.Mesh(postGeo, timber); post.position.set(u * T.L / 2, y + 0.3, sd * b * 0.96); group.add(post);
        const g = new THREE.Mesh(gunGeo, bronze); g.position.set(u * T.L / 2, y + 0.65, sd * b * 0.96); g.castShadow = true; group.add(g);
        (sd < 0 ? guns.left : guns.right).push(new THREE.Vector3(u * T.L / 2, y + 0.65, sd * (b + 0.8)));
      });
    }
    const flags = lines.flags || [];
    return { group, sails, flag: flags[0], flags, oars, guns, spec: T, L: T.L, B: T.B, D: T.D, deckY, type: key };
  }

  // Sail animation: trim to the wind, swell with it, furl toward the yard,
  // luff when the sheet is loose; pennants stream, oars pull.
  function animateSails(ship, trimAngle, deploy, fill, t, luff) {
    luff = luff || 0;
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
        const flap = (luff > 0 ? luff : Math.abs(fill) < 0.15 ? 1 : 0) * Math.sin(t * 11 + ny * 5 + nx * 3 + i) * 0.55;
        p.setZ(k, shape * (belly + flap));
      }
      p.needsUpdate = true; s.mesh.geometry.computeVertexNormals();
    });
    (ship.flags || []).forEach((f, i) => {
      const a = f.geometry.attributes.position, L = f.userData.len;
      for (let k = 0; k < a.count; k++) { const x = a.getX(k); a.setZ(k, Math.sin(t * 6 + x * 1.2 + i) * 0.3 * (x / L)); }
      a.needsUpdate = true;
    });
    // Oars pull in rhythm when the sails are short or the ship is under way.
    (ship.oars || []).forEach(o => {
      const stroke = Math.sin(t * 2.6 + o.phase);
      o.pivot.rotation.y = o.sd * stroke * 0.32;
      o.pivot.rotation.x = o.sd * (0.55 + Math.max(0, stroke) * 0.18);
    });
  }

  return { build, animateSails, HULLS, TYPES };
})();
