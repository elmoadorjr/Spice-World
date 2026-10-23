// ============ NAKHODA: CORE ============
// Shared namespace, math helpers and noise for the voyage. Every module
// hangs its state off NK so the files can stay plain classic scripts with
// no build step.

const NK = {
  T: 0,             // game seconds since boot (scaled by timeScale)
  dt: 0,            // last frame's game delta (seconds)
  timeScale: 1,     // "fair winds" fast-sail multiplier
  isMobile: /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || (window.matchMedia && matchMedia('(pointer: coarse)').matches),
  embedded: (() => { try { return window.parent && window.parent !== window; } catch (e) { return false; } })()
};

NK.clamp = (v, a, b) => v < a ? a : v > b ? b : v;
NK.lerp = (a, b, t) => a + (b - a) * t;
NK.smooth = (a, b, v) => { const t = NK.clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
NK.wrapAngle = a => { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; };
NK.dist2 = (ax, az, bx, bz) => Math.hypot(ax - bx, az - bz);

// Deterministic hashing: same inputs, same world, every session.
NK.hash2 = (x, y) => {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
NK.hash3 = (a, b, c) => { const x = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453; return x - Math.floor(x); };

// Mulberry32, for seeded scatter (trees, houses) that must not change between visits.
NK.rng = seed => () => {
  seed |= 0; seed = seed + 0x6D2B79F5 | 0;
  let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};

// Smooth value noise and fractal sums of it.
NK.noise = (x, y) => {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = NK.hash2(xi, yi), b = NK.hash2(xi + 1, yi);
  const c = NK.hash2(xi, yi + 1), d = NK.hash2(xi + 1, yi + 1);
  return (a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v) * 2 - 1;
};
NK.fbm = (x, y, oct) => {
  let s = 0, amp = 0.5, f = 1;
  for (let i = 0; i < oct; i++) { s += NK.noise(x * f, y * f) * amp; f *= 2.03; amp *= 0.5; }
  return s;
};
NK.ridged = (x, y, oct) => {
  let s = 0, amp = 0.5, f = 1;
  for (let i = 0; i < oct; i++) { const n = 1 - Math.abs(NK.noise(x * f, y * f)); s += n * n * amp; f *= 2.1; amp *= 0.5; }
  return s;
};

NK.$ = id => document.getElementById(id);
NK.el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };
NK.fmt = n => Math.round(n).toLocaleString('en-US');
