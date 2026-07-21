// ============ SHARED WORLD DATA: PORTS OF THE NUSANTARA, 1500 AD ============
// Single source of truth for the voyage sim's world AND the atlas's strategic
// layer. Coordinates come from the atlas map where a pin exists; the rest are
// the historical sites. The sim projects these onto its sea; the atlas draws
// them straight onto the Leaflet map — same ports, same order, same indices.
//
// Loaded as a classic script by BOTH index.html and sim.html.

const PORT_DATA = [
  { name: "Melaka",      lat:   2.19, lng: 102.25, entrepot: true },
  { name: "Pasai",       lat:   5.23, lng:  96.05, entrepot: true },
  { name: "Palembang",   lat:  -2.99, lng: 104.75 },
  { name: "Jambi",       lat:  -1.60, lng: 103.62 },
  { name: "Banten",      lat:  -6.06, lng: 106.15 },
  { name: "Sunda Kelapa",lat:  -6.13, lng: 106.81 },
  { name: "Demak",       lat:  -6.89, lng: 110.64, entrepot: true },
  { name: "Tuban",       lat:  -6.90, lng: 112.06 },
  { name: "Gresik",      lat:  -7.16, lng: 112.65 },
  { name: "Surabaya",    lat:  -7.25, lng: 112.75 },
  { name: "Banjarmasin", lat:  -3.32, lng: 114.59 },
  { name: "Brunei",      lat:   4.94, lng: 114.94, entrepot: true },
  { name: "Jolo",        lat:   6.05, lng: 121.00 },
  { name: "Maynila",     lat:  14.60, lng: 120.98, entrepot: true },
  { name: "Tondo",       lat:  14.63, lng: 120.97 },
  { name: "Sugbu",       lat:  10.32, lng: 123.90 },
  { name: "Butuan",      lat:   8.95, lng: 125.53 },
  { name: "Cotabato",    lat:   7.22, lng: 124.27 },
  { name: "Ternate",     lat:   0.80, lng: 127.38, maluku: true },
  { name: "Tidore",      lat:   0.68, lng: 127.40, maluku: true },
  { name: "Banda",       lat:  -4.52, lng: 129.90, maluku: true },
  { name: "Ambon",       lat:  -3.70, lng: 128.18, maluku: true },
  { name: "Hitu",        lat:  -3.57, lng: 128.10, maluku: true },
  { name: "Makassar",    lat:  -5.15, lng: 119.43, entrepot: true },
  { name: "Buton",       lat:  -5.47, lng: 122.60 },
  { name: "Timor",       lat:  -9.30, lng: 124.90 },
  { name: "Patani",      lat:   6.87, lng: 101.25 },
  { name: "Pahang",      lat:   3.48, lng: 103.40 },
  { name: "Kedah",       lat:   6.12, lng: 100.36 },
  { name: "Terengganu",  lat:   5.33, lng: 103.14 },
  { name: "Aru",         lat:   3.78, lng:  98.70 },
  { name: "Gowa",        lat:  -5.35, lng: 119.40 },
  { name: "Mindoro",     lat:  13.10, lng: 121.10 },
  { name: "Aceh",        lat:   5.55, lng:  95.32 },
  { name: "Bali",        lat:  -8.58, lng: 115.35 },
  { name: "Lombok",      lat:  -8.58, lng: 116.12 },
  { name: "Bima",        lat:  -8.47, lng: 118.72 },
  { name: "Kupang",      lat: -10.17, lng: 123.58 },
  { name: "Zamboanga",   lat:   6.90, lng: 122.08 },
  { name: "Panay",       lat:  10.72, lng: 122.55 }
];

// Equirectangular projection between geography and sim sea-plane.
// 1 degree = 100 sim units; north is -z so the sim minimap reads north-up.
const WORLD_PROJ = { lat0: 2.2, lng0: 112.6, scale: 100 };

function worldProject(lat, lng) {
  return {
    x: (lng - WORLD_PROJ.lng0) * WORLD_PROJ.scale,
    z: -(lat - WORLD_PROJ.lat0) * WORLD_PROJ.scale
  };
}
function worldUnproject(x, z) {
  return {
    lat: WORLD_PROJ.lat0 - z / WORLD_PROJ.scale,
    lng: WORLD_PROJ.lng0 + x / WORLD_PROJ.scale
  };
}

// Deterministic noise shared with the sim's price/economy hashing.
function portHashNoise(a, b, c) {
  const x = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;
  return x - Math.floor(x);
}

// Fixed island layout: project every port, then deterministically relax
// overlapping neighbors apart (Ternate/Tidore, Maynila/Tondo, Makassar/Gowa
// sit close in real geography but each needs its own island + sea room).
function computeWorldLayout() {
  const pts = PORT_DATA.map((p, i) => {
    const { x, z } = worldProject(p.lat, p.lng);
    const scale = 0.9 + portHashNoise(i, 9, 3) * 1.0;
    return { name: p.name, x, z, scale, islandRadius: 16 * scale };
  });
  for (let iter = 0; iter < 300; iter++) {
    let moved = false;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j];
        const minSep = a.islandRadius + b.islandRadius + 70;
        let dx = b.x - a.x, dz = b.z - a.z;
        let d = Math.hypot(dx, dz);
        if (d >= minSep) continue;
        if (d < 0.001) { dx = 1; dz = 0; d = 1; } // exact overlap: pick a direction
        const push = (minSep - d) / 2;
        a.x -= (dx / d) * push; a.z -= (dz / d) * push;
        b.x += (dx / d) * push; b.z += (dz / d) * push;
        moved = true;
      }
    }
    if (!moved) break;
  }
  return pts;
}
