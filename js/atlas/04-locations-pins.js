// ============ LOCATIONS / CHARACTER PINS ============
const locations = [
  {
    name: "Malacca", region: "Malay Peninsula", lat: 2.19, lng: 102.25, capital: true, religion: "islam",
    figures: ["<b>Mahmud Shah</b> — Sultan of Malacca (r. 1488–1511)", "<b>Tun Mutahir</b> — Bendahara (chief minister), 1500–1510", "<b>Hang Tuah</b> — aged Laksamana (admiral), living legend of four reigns"]
  },
  {
    name: "Pasai / Aceh", region: "North Sumatra", lat: 5.23, lng: 96.05, capital: true, religion: "islam",
    figures: ["<b>Ali Mughayat Syah</b> — founder of Aceh Sultanate's later rise"]
  },
  {
    name: "The Beach Across the Strait", region: "East Sumatra, opposite Malacca", lat: 2.35, lng: 102.05, capital: false, religion: "islam", tier: "major",
    figures: ["A small, undeveloped stretch of Sumatran coast, directly across the strait from Malacca — secretly owned by <b>Tun Perak</b> after his presumed death in 1498, then unknowingly bought outright years later by <b>Angin</b> with Brunei-run trade profit. Neither man's ownership overlaps in the record; the connection between them is never on paper anywhere. Geographically the sharpest, quietest foothold on this entire map — in view of the exact chokepoint the whole Central Conflict revolves around, held first by a hidden spy network and then by the boy who never knew he was walking in its founder's footsteps."]
  },
  {
    name: "Sunda Kalapa", region: "West Java", lat: -6.13, lng: 106.81, capital: true, religion: "hindu-buddhist",
    figures: ["<b>Sri Baduga Maharaja</b> — King of Sunda"]
  },
  {
    name: "Demak", region: "Central Java", lat: -6.89, lng: 110.64, capital: true, religion: "islam",
    figures: ["<b>Raden Patah</b> — founder of the Demak Sultanate", "<b>Pati Unus</b> — crown prince, a boy of about twelve in 1500"]
  },
  {
    name: "Cirebon", region: "West/Central Java", lat: -6.71, lng: 108.55, capital: false, religion: "islam", tier: "major",
    figures: ["<b>Syarif Hidayatullah</b> — founder-ruler of Cirebon"]
  },
  {
    name: "Majapahit (rump court)", region: "East Java", lat: -7.56, lng: 112.21, capital: true, religion: "hindu-buddhist",
    figures: ["<b>Udara</b> — ruler at Daha since 1489, holding what remains of Majapahit's name"]
  },
  {
    name: "Gelgel", region: "Bali", lat: -8.58, lng: 115.35, capital: true, religion: "hindu-buddhist",
    figures: ["<b>Dalem Waturenggong</b> — King of Bali (Gelgel dynasty)"]
  },
  {
    name: "Brunei", region: "NW Borneo", lat: 4.94, lng: 114.94, capital: true, religion: "islam",
    figures: ["<b>Bolkiah</b> — Sultan of Brunei, golden age ruler"]
  },
  {
    name: "Gowa", region: "South Sulawesi", lat: -5.20, lng: 119.42, capital: true, religion: "animist-other",
    figures: ["<b>Tumapaqrisiq Kallonna</b> — early ruler of Gowa"]
  },
  {
    name: "Bone", region: "South Sulawesi", lat: -4.53, lng: 120.33, capital: false, religion: "animist-other", tier: "major",
    figures: ["A Bugis adat-kingdom descended from La Umasa and his nephew La Saliu (Kerrépelua) — Bone's own ruler-by-ruler chronicle exists but the exact holder of the throne in 1500 isn't settled in accessible sources; the kingdom is in the middle of expanding north to contest the mouth of the Cenrana River with Luwu"]
  },
  {
    name: "Ternate", region: "Maluku (Spice Islands)", lat: 0.80, lng: 127.38, capital: true, religion: "islam",
    figures: ["<b>Al-Mansur</b> — Sultan of Ternate, spice-trade power"]
  },
  {
    name: "Waigeo (Raja Ampat)", region: "West New Guinea", lat: -0.23, lng: 130.83, capital: false, religion: "animist-other",
    figures: ["<b>Gurabesi</b> — Biak war chief, sworn to Tidore's service, bridge between the Papuan and Islamic-Malay worlds"]
  },
  {
    name: "Manila Bay", region: "Luzon", lat: 14.60, lng: 120.98, capital: false, religion: "animist-other",
    figures: ["Tagalog polities under Bruneian orbit (pre-Rajah Sulayman era)"]
  },
  {
    name: "Cebu", region: "Visayas", lat: 10.32, lng: 123.90, capital: false, religion: "animist-other",
    figures: ["<b>Lapu-Lapu</b> — datu of Mactan, formative years before his 1521 stand"]
  },
  {
    name: "Sulu (Jolo)", region: "Sulu Archipelago", lat: 6.05, lng: 121.00, capital: true, religion: "islam",
    figures: ["<b>Bayanullah</b> — early Sultan of Sulu"]
  },
  {
    name: "Maguindanao", region: "Mindanao", lat: 7.22, lng: 124.27, capital: false, religion: "animist-other",
    figures: ["The Pulangi River basin, governed by the brother-chiefs Tabunaway and Mamalu — the Maguindanao Sultanate does not yet exist in 1500; <b>Shariff Kabungsuwan</b> will not arrive from Johor to found it and convert Tabunaway's people to Islam for roughly another fifteen years"]
  },
  {
    name: "Tidore", region: "Maluku (Spice Islands)", lat: 0.68, lng: 127.40, capital: true, religion: "islam",
    figures: ["Ternate's fierce rival for control of the clove trade — one of the four great kingdoms of Maluku"]
  },
  {
    name: "Jailolo", region: "Halmahera, Maluku", lat: 1.10, lng: 127.48, capital: true, religion: "islam",
    figures: ["One of the four kingdoms of Maluku (Moloku Kie Raha), alongside Ternate, Tidore, and Bacan"]
  },
  {
    name: "Bacan", region: "Maluku (Spice Islands)", lat: -0.62, lng: 127.52, capital: true, religion: "islam",
    figures: ["The fourth of Maluku's great kingdoms; ruling elite converted to Islam in the late 15th century"]
  },
  {
    name: "Ayutthaya", region: "Central Siam (Thailand)", lat: 14.35, lng: 100.58, capital: true, religion: "animist-other",
    figures: ["<b>Ramathibodi II</b> — King of Ayutthaya (r. 1491–1529), who sends an army against Malacca this very year"]
  },
  {
    name: "Patani", region: "Malay Peninsula (under Siamese orbit)", lat: 6.87, lng: 101.25, capital: true, religion: "islam",
    figures: ["A rising Islamic sultanate on the peninsula's east coast, caught between Malacca's orbit and Ayutthaya's expanding reach"]
  },
  {
    name: "Jambi", region: "East Sumatra", lat: -1.60, lng: 103.62, capital: true, religion: "islam",
    figures: ["<b>Orang Kayo Hitam</b> — took the throne of Jambi in exactly 1500, ruling until 1515; renowned for his courage and the legendary keris Siginjai"]
  },
  {
    name: "Pahang (Pekan)", region: "Malay Peninsula", lat: 3.48, lng: 103.40, capital: true, religion: "islam",
    figures: ["<b>Mansur Shah I of Pahang</b> — reigned jointly with his uncle from 1495, a vassal kingdom within Malacca's orbit"]
  },
  {
    name: "Panduranga (Champa)", region: "South-Central Vietnam", lat: 11.57, lng: 108.98, capital: true, religion: "hindu-buddhist",
    figures: ["<b>Po Kabih</b> — ruler of the surviving rump of Champa (r. 1494–1530), holding on in the south after Vietnam crushed the old kingdom in 1471"]
  },
  {
    name: "Wehali", region: "Central Timor", lat: -9.30, lng: 124.90, capital: true, religion: "animist-other",
    figures: ["The paramount kingdom of Timor — held ritual seniority over the island's many small chiefdoms and remained dominant into the early 1500s"]
  },
  {
    name: "Minangkabau Highlands (Pagaruyung)", region: "West Sumatra", lat: -0.47, lng: 100.62, capital: false, religion: "islam",
    figures: ["Homeland of <b>Angin's Minangkabau crewmember</b>, who leaves not out of exile but <em>merantau</em> — the real, living Minangkabau tradition of deliberately leaving home to make a name and fortune before any claim to return with honor. Matrilineal inheritance means property and clan descend through women; she isn't needed at home the way a son would be, which makes her departure a freedom rather than a displacement, and a genuinely different flavor of belonging to no one than anyone else on Angin's crew."]
  },
  {
    name: "Batak Highlands (Lake Toba)", region: "North Sumatra interior", lat: 2.61, lng: 98.83, capital: false, religion: "animist-other",
    figures: ["Homeland of <b>Angin's Batak headfighter and bodyguard</b> — highland interior, outside both Islamic and Hindu-Buddhist reach in 1500. A real, documented tradition of ritual, judicial execution-by-consumption travels with anyone from here as reputation, confirmed or not; other crews across the straits think twice before testing a Batak fighter twice."]
  },
  {
    name: "Dayak Interior (Kapuas Basin)", region: "West/Central Borneo interior", lat: -0.02, lng: 111.47, capital: false, religion: "animist-other",
    figures: ["Homeland of <b>Angin's Dayak scout and helmsman</b> — river-and-jungle, headhunter-trained, a long way from his own longhouse for reasons never fully explained. The first person to hand Angin real trust rather than a test, and, after a stretch away, the one who comes back."]
  },
  {
    name: "Bajau Waters (Sulu/Sulawesi margins)", region: "Sulu &amp; Sulawesi seas", lat: 5.40, lng: 120.30, capital: false, religion: "animist-other",
    figures: ["No fixed settlement — the working waters of the <b>Bajau</b> (Sama-Bajau) people, sea nomads distinct from Angin's own Orang Laut upbringing, with free-diving and boat-dwelling traditions built for reef-work no Malay-tradition sailor trains for. <b>Angin's Bajau crewmember</b> joins him running unfamiliar reef water on the Brunei trade lane — salvage and hull-work from beneath the waterline, a second 'belongs to the water, not the land' voice on the crew."]
  },
];

// Religion colors used as a ring around each pin — kept distinct from the
// territory fill colors so the two encodings never get confused for each other.
const religionColor = {
  "islam": "#3A6B55",           // green, conventional association, used consistently across the legend
  "hindu-buddhist": "#8B3A3A",  // rust-red
  "animist-other": "#B8873D"    // gold — indigenous/animist/other traditions not yet folded into either major faith
};

// Cross-reference: does this location's figures list include someone with a
// full character sheet in the `characters` array below? Pins get a small
// filled center dot if so, hollow if the figure is name-only or unnamed.
// (`characters` is defined further down the script, but this runs after
// both arrays exist since it's called from inside the forEach below.)

// Small emoji badges marking what each location produces or trades,
// drawn from the source/port fields in goodsFlows above. Kept short (max
// ~2 emoji per place) so pins stay readable rather than becoming icon soup.
const locationGoodsEmoji = {
  "Ternate": "🌿",
  "Tidore": "🌿",
  "Jailolo": "🌿",
  "Bacan": "🌿",
  "Waigeo (Raja Ampat)": "🌿",
  "Wehali": "🪵",
  "Pasai / Aceh": "🌶️",
  "Sunda Kalapa": "🌶️",
  "Jambi": "🌶️🪙",
  "Pahang (Pekan)": "🪙",
  "Malacca": "🧵⚓",
  "Demak": "🌿⚓",
  "Gowa": "🌿⚓",
  "Brunei": "🏺",
  "Sulu (Jolo)": "🦪",
  "Manila Bay": "🏺",
  "Cirebon": "🌶️",
};

locations.forEach(loc => {
  const isCapital = loc.capital;
  const isMajor = loc.tier === "major";
  const pinSize = isCapital ? 15 : (isMajor ? 13 : 12);
  const ringColor = religionColor[loc.religion] || "#5C7E8C";
  const hasSheet = characters.some(c => loc.figures.some(f => f.includes(`>${c.name}<`)));

  // Combined icon: dot + always-visible label, rendered as one HTML block so
  // the label travels with the pin during pan/zoom instead of a separate layer.
  // The ring color encodes religion; a filled vs. hollow center dot encodes
  // whether a full character sheet exists for someone at this location.
const icon = L.divIcon({
    className: '',
    html: `
      <div class="map-pin-wrap">
        <div class="${isCapital ? 'capital-pin' : (isMajor ? 'major-pin' : 'legend-pin')} ${hasSheet ? 'has-sheet' : ''}" style="box-shadow: 0 0 0 2px ${ringColor}, 0 0 0 1px var(--ink);"></div>
        <div class="map-pin-label ${isCapital ? 'is-capital' : ''} ${isMajor ? 'is-major' : ''}">${loc.name}${locationGoodsEmoji[loc.name] ? ` <span class="map-pin-goods">${locationGoodsEmoji[loc.name]}</span>` : ''}</div>
      </div>
    `,
    iconSize: [200, pinSize],
    iconAnchor: [pinSize/2, pinSize/2]  // anchors to the dot at the left edge, not the label
  });

  const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(map);

  const popupHtml = `
    <div class="t-region">${loc.region}</div>
    <div class="t-name">${loc.name}</div>
    <div class="t-figures">${loc.figures.map(f => `<div>${f}</div>`).join('')}</div>
  `;
  marker.bindPopup(popupHtml, { maxWidth: 260 });

  // store for the jump-to-location control
  loc._marker = marker;
});

// ============ CHARACTER MARKERS ============
// Two ways a character gets placed on the map, checked in this order:
//   1. An explicit override in `characterPositions` below — use this for
//      anyone whose current position isn't just "wherever their court is,"
//      most obviously Angin, who moves voyage to voyage and has no seat.
//   2. Falls back to deriving position from `locations[].figures`, same as
//      before — no override needed for characters who are just "at their
//      court/domain" (Mahmud Shah at Malacca, Bolkiah at Brunei, etc.).
// This means most of the roster needs zero maintenance here; only moving
// or currently-unsettled characters need an entry in the override list.
const characterPositions = {
  // "Angin": { lat: 1.85, lng: 103.4, note: "Between Malacca and the Riau islets — no fixed seat yet" },
  // Add entries here as specific chapters place a character somewhere
  // their `figures`-list location doesn't reflect. Delete the entry once
  // they return to (or gain) a settled seat, and the location fallback
  // below will pick them back up automatically.
};

const roleEmoji = {
  "sea-lord":  "👑",
  "vassal":    "🗡️",
  "heir":      "🌱",
  "unrisen":   "🌀",
  "nakhoda":   "⛵",
  "external":  "🌊",
};
const defaultCharEmoji = "●";

const charactersLayer = L.layerGroup();

// Build a quick name -> character lookup so figures-list text (which is
// HTML like "<b>Mahmud Shah</b> — Sultan of Malacca") can be matched back
// to a real character record for role/emoji lookup.
const charByName = {};
characters.forEach(c => { charByName[c.name] = c; });

function placeCharacterMarker(char, lat, lng, isOverride){
  const emoji = roleEmoji[char.role] || defaultCharEmoji;
  const icon = L.divIcon({
    className: '',
    html: `
      <div class="char-pin-wrap">
        <div class="char-pin-emoji ${isOverride ? 'is-override' : ''}">${emoji}</div>
        <div class="char-pin-label">${char.name}</div>
      </div>
    `,
    iconSize: [160, 20],
    iconAnchor: [10, 10]
  });

  const marker = L.marker([lat, lng], { icon });
  const noteLine = isOverride && characterPositions[char.name].note
    ? `<div class="t-figures"><div>${characterPositions[char.name].note}</div></div>` : '';
  marker.bindPopup(`<div class="t-region">${char.title || char.role}</div><div class="t-name">${char.name}</div>${noteLine}`, { maxWidth: 220 });
  marker.on('click', () => {
    const idx = characters.findIndex(c => c.name === char.name);
    if (idx === -1) return;
    const charsTabBtn = document.querySelector('.tab-btn[data-tab="characters-panel"]');
    if (charsTabBtn) charsTabBtn.click();
    showCharDetail(idx);
  });
  marker.addTo(charactersLayer);
}

// Pass 1: explicit overrides — placed first so a character with a manual
// position doesn't also get a second, stale marker from the location pass.
const placedByOverride = new Set();
Object.keys(characterPositions).forEach(name => {
  const char = charByName[name];
  if (!char) return; // guard against typos in the override list
  const pos = characterPositions[name];
  placeCharacterMarker(char, pos.lat, pos.lng, true);
  placedByOverride.add(name);
});

// Pass 2: location-derived fallback, unchanged from before, skipping
// anyone already placed by an override above.
locations.forEach(loc => {
  // Extract plain names from each location's figures[] — every entry starts
  // "<b>Name</b> — ...", so pull just the bolded name back out.
  const namesHere = loc.figures
    .map(f => {
      const m = f.match(/^<b>([^<]+)<\/b>/);
      return m ? m[1] : null;
    })
    .filter(Boolean)
    .filter(name => charByName[name])      // only names with a real character record
    .filter(name => !placedByOverride.has(name)); // skip anyone already override-placed

  if (namesHere.length === 0) return;

  const ringRadius = 0.28; // degrees, small fan-out so co-located figures don't overlap
  namesHere.forEach((name, i) => {
    const char = charByName[name];

    // Fan multiple figures at one location around a small ring; a single
    // figure sits directly on the location.
    let lat = loc.lat, lng = loc.lng;
    if (namesHere.length > 1) {
      const angle = (2 * Math.PI * i) / namesHere.length;
      lat += ringRadius * Math.sin(angle);
      lng += ringRadius * Math.cos(angle) / Math.cos(loc.lat * Math.PI / 180);
    }

    placeCharacterMarker(char, lat, lng, false);
  });
});


// Schematic (not survey-accurate) river paths — enough to place the trade
// arteries that made certain towns matter, without needing precise hydrology.
// Each is clickable for a one-line note on why the river mattered.
const rivers = [
  {
    name: "Musi River",
    path: [[-1.85, 104.95], [-2.35, 104.7], [-2.75, 104.6], [-2.99, 104.75]],
    note: "The river that made Palembang — old Srivijaya's highway to the sea, still carrying pepper and gold downstream to the coast long after the empire that built its fortune around it has faded."
  },
  {
    name: "Batang Hari",
    path: [[-1.1, 104.35], [-1.35, 104.05], [-1.6, 103.62]],
    note: "Jambi's river-road inland — gold and pepper from the Sumatran interior reach the coast, and Malacca's merchants, by way of this current."
  },
  {
    name: "Chao Phraya",
    path: [[13.55, 100.6], [13.95, 100.58], [14.35, 100.58]],
    note: "Siam's spine. Ayutthaya sits upriver from the gulf on purpose — close enough to the sea to trade, far enough inland to be hard to burn."
  },
  {
    name: "Bengawan Solo",
    path: [[-7.25, 111.4], [-7.4, 111.9], [-7.56, 112.21]],
    note: "Java's longest river, threading the old Majapahit heartland — the water that once moved an empire's rice now marks the border of what's left of it."
  },
  {
    name: "Kapuas River",
    path: [[-0.05, 109.35], [-0.3, 109.7], [-0.6, 110.15]],
    note: "Borneo's great western river — forest goods (rattan, resins, birds' nests) move downstream toward the coastal sultanates that broker them onward to China."
  },
];

const geoFeaturesLayer = L.layerGroup();

rivers.forEach(r => {
  const line = L.polyline(r.path, {
    color: '#5C7E8C', weight: 2, opacity: 0.8, dashArray: '1 4', lineCap: 'round'
  });
  line.bindPopup(`<div class="t-region">River</div><div class="t-name">${r.name}</div><div class="t-figures"><div>${r.note}</div></div>`, { maxWidth: 240 });
  line.addTo(geoFeaturesLayer);

  const mid = r.path[Math.floor(r.path.length / 2)];
  const labelIcon = L.divIcon({
    className: '',
    html: `<div class="river-label">${r.name}</div>`,
    iconSize: [100, 16],
    iconAnchor: [50, -6]
  });
  const labelMarker = L.marker(mid, { icon: labelIcon });
  labelMarker.on('click', () => line.openPopup(mid));
  labelMarker.addTo(geoFeaturesLayer);
});

