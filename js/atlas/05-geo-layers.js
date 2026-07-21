// ============ GEOGRAPHIC FEATURES: SEAS, STRAITS & GULFS ============
// Text-only cartographic labels — no popups, just names, so the water itself
// reads as a place rather than empty blue between the territories.
const seaLabels = [
  { lat: 3.3, lng: 100.35, text: "SELAT MALAKA", note: "Strait of Malacca" },
  { lat: -6.05, lng: 105.9, text: "SELAT SUNDA", note: "Sunda Strait" },
  { lat: -3.0, lng: 118.3, text: "SELAT MAKASSAR", note: "Makassar Strait" },
  { lat: 10.8, lng: 101.3, text: "TELUK SIAM", note: "Gulf of Siam" },
  { lat: -4.6, lng: 112.6, text: "LAUT JAWA", note: "Java Sea" },
  { lat: 4.2, lng: 121.3, text: "LAUT SULAWESI", note: "Celebes Sea" },
  { lat: -5.9, lng: 128.9, text: "LAUT BANDA", note: "Banda Sea" },
  { lat: 8.1, lng: 120.2, text: "LAUT SULU", note: "Sulu Sea" },
];
seaLabels.forEach(s => {
  const icon = L.divIcon({
    className: '',
    html: `<div class="sea-label" title="${s.note}">${s.text}</div>`,
    iconSize: [140, 16],
    iconAnchor: [70, 8]
  });
  L.marker([s.lat, s.lng], { icon, interactive: false }).addTo(geoFeaturesLayer);
});

// ============ GEOGRAPHIC FEATURES: VOLCANOES ============
// Landmarks, not hazards on a timer — flavor text stays general rather than
// pinning specific eruption dates the record doesn't clearly support.
const volcanoes = [
  { name: "Krakatoa", lat: -6.1, lng: 105.42, note: "Sits astride the Sunda Strait itself — sailors passing between Sumatra and Java watch it the way sailors everywhere watch a mountain that smokes." },
  { name: "Merapi", lat: -7.54, lng: 110.44, note: "Central Java's most restless peak, close enough to both old Majapahit and rising Demak that neither court can fully ignore it." },
  { name: "Gunung Agung", lat: -8.34, lng: 115.51, note: "Bali's sacred mountain — Gelgel's court orients its whole sense of direction around 'toward the mountain' and 'toward the sea.'" },
  { name: "Semeru", lat: -8.11, lng: 112.92, note: "Java's tallest peak, rising over the fading Majapahit heartland — a fittingly immovable backdrop for a court that isn't." },
  { name: "Gamalama", lat: 0.79, lng: 127.33, note: "Ternate isn't near a volcano — Ternate IS the volcano. The whole sultanate is a single cone rising out of the clove-scented sea." },
];
volcanoes.forEach(v => {
  const icon = L.divIcon({
    className: '',
    html: `<div style="display:flex; flex-direction:column; align-items:center; gap:1px;"><div class="volcano-icon">🌋</div><div class="volcano-label">${v.name}</div></div>`,
    iconSize: [90, 34],
    iconAnchor: [45, 30]
  });
  const m = L.marker([v.lat, v.lng], { icon });
  m.bindPopup(`<div class="t-region">Volcano</div><div class="t-name">${v.name}</div><div class="t-figures"><div>${v.note}</div></div>`, { maxWidth: 240 });
  m.addTo(geoFeaturesLayer);
});

geoFeaturesLayer.addTo(map);

// ============ SETTLEMENTS: UNRULED TOWNS, PORTS & PILGRIMAGE SITES ============
// Deliberately not political seats — no ruler figures, just places a
// character can pass through, trade in, or stop at that aren't anyone's
// court. Distinct diamond pin so they read as texture, not territory.
const settlements = [
  { name: "Palembang", lat: -2.99, lng: 104.75, region: "South Sumatra", type: "port",
    note: "Old Srivijaya's capital, centuries past its imperial peak but still a working river port — pepper and gold still move through it, just for other people's empires now." },
  { name: "Barus", lat: 2.03, lng: 98.4, region: "West Sumatra coast", type: "port",
    note: "A camphor port so renowned that its name traveled into Arabic and Sanskrit as the word for camphor itself." },
  { name: "Pariaman", lat: -0.62, lng: 100.12, region: "West Sumatra coast", type: "port",
    note: "A gold- and pepper-shipping point on Sumatra's Indian Ocean coast, facing west toward the ports of India rather than east toward Malacca." },
  { name: "Tuban", lat: -6.9, lng: 112.06, region: "Java north coast", type: "port",
    note: "A long-established market and shipbuilding town on Java's north coast, where Chinese, Malay, and Javanese traders have mingled for generations." },
  { name: "Gresik", lat: -7.16, lng: 112.65, region: "Java north coast", type: "pilgrimage",
    note: "A trade town doubling as a seedbed for Java's new faith — early Islamic teachers work the coast from here outward." },
  { name: "Banten", lat: -6.06, lng: 106.15, region: "West Java coast", type: "port",
    note: "A smaller pepper port in Sunda's territory, quietly positioned to eclipse Sunda Kalapa itself within a generation." },
  { name: "Kedah", lat: 6.12, lng: 100.36, region: "Malay Peninsula", type: "port",
    note: "An old trading port on the peninsula's west coast, pulled between Malacca's orbit and Siam's reach from the north." },
  { name: "Ligor (Nakhon Si Thammarat)", lat: 8.43, lng: 99.96, region: "Malay Peninsula", type: "port",
    note: "A Siamese-Malay frontier town — the practical edge of Ayutthaya's claimed authority over the upper peninsula." },
  { name: "Makassar", lat: -5.15, lng: 119.43, region: "South Sulawesi coast", type: "port",
    note: "A coastal trading settlement growing up beside Gowa's court — not yet the great emporium it will become, but already a name traders know." },
  { name: "Ambon", lat: -3.7, lng: 128.18, region: "Central Maluku", type: "port",
    note: "A spice-trade anchorage that belongs to none of Maluku's four great sultanates outright — useful ground precisely because no one fully controls it." },
  { name: "Bima", lat: -8.47, lng: 118.72, region: "Sumbawa", type: "port",
    note: "A sappanwood and horse-trading town on the dry eastern islands, well outside the clove-and-pepper economy driving events further west." },
  { name: "Butuan", lat: 8.95, lng: 125.53, region: "Mindanao (Caraga coast)", type: "port",
    note: "An old gold-trading port with trade ties reaching back to China for centuries — wealthy in a way its small size doesn't suggest." },
  { name: "Kutai", lat: -0.4, lng: 117.15, region: "East Borneo", type: "port",
    note: "A river-mouth trading town on Borneo's east coast, gathering forest goods from upriver for onward sale to coastal merchants." },
];

const settlementsLayer = L.layerGroup();
settlements.forEach(s => {
  const icon = L.divIcon({
    className: '',
    html: `
      <div class="map-pin-wrap">
        <div class="settlement-pin type-${s.type}"></div>
        <div class="settlement-label">${s.name}</div>
      </div>
    `,
    iconSize: [160, 10],
    iconAnchor: [4, 4]
  });
  const m = L.marker([s.lat, s.lng], { icon });
  m.bindPopup(`<div class="t-region">${s.region}</div><div class="t-name">${s.name}</div><div class="t-figures"><div>${s.note}</div></div>`, { maxWidth: 240 });
  m.addTo(settlementsLayer);
});
settlementsLayer.addTo(map);

// ============ MONSOON WINDS ============
// The seasonal clock the entire trade calendar runs on — ships don't choose
// when to sail the open crossings so much as wait for the wind to allow it.
// Each streamline is a schematic but geographically real path (funneled
// through the straits it actually funnels through, curving across the
// equator the way the Asian-Australian monsoon actually curves there)
// rather than a uniform arrow field. Points are ordered in the NE-monsoon
// flow direction; the SW monsoon reuses the same paths reversed, since a
// monsoon reversing is exactly that — the same air, flowing backward.
// Cycles: off -> NE monsoon -> SW monsoon -> off, layer off by default.
const monsoonStreamlines = [
  { region: "South China Sea → Malacca Strait",
    path: [[13.5,113.5],[10.5,110],[7.5,106.5],[4.5,103.5],[2.2,101.2]] },
  { region: "Malacca Strait → Java Sea",
    path: [[2.2,101.2],[0.0,102.5],[-2.5,105],[-5,109]] },
  { region: "South China Sea → Sulu Sea",
    path: [[16,118.5],[11.5,119.2],[8,120],[5.7,120.6]] },
  { region: "Sulu Sea → Makassar Strait → Banda Sea",
    path: [[6.5,120.5],[3,119.2],[-1,118.4],[-4,118.2],[-6,121],[-6,125],[-5.5,128.5]] },
  { region: "Bay of Bengal → NW Sumatra coast",
    path: [[9,90],[6,93],[3,96],[0,98.5]] },
  { region: "South China Sea → Borneo / Java Sea",
    path: [[6,113.5],[2,113],[-2,111.5],[-5.5,110.5]] },
  { region: "Gulf of Siam",
    path: [[17,106.5],[14,104],[11,101.5],[9,100]] },
];
const monsoonInfo = {
  ne: {
    label: "NE Monsoon (roughly Nov–Mar)",
    note: "Dry-season winds push down out of the north/northeast over the South China Sea, funnel through the Malacca Strait, and curve westerly as they cross the equator into the Java and Banda Seas. Ships ride this to sail from China and the mainland down toward India and the archipelago's south — Malacca fills with fleets timing their departure to it."
  },
  sw: {
    label: "SW Monsoon (roughly Jun–Sep)",
    note: "The wind reverses — the same channels now carry air the opposite way, north out of the Java and Banda Seas and back up through the Malacca Strait toward China. Fleets that came down in the dry season ride this to go home; miss the turn and a ship can be stranded a full season waiting for the next one."
  }
};

// Great-circle-ish bearing between two points, for orienting each
// streamline's arrowhead to the direction it's actually flowing.
function bearingDeg(lat1, lng1, lat2, lng2){
  const toRad = d => d * Math.PI / 180, toDeg = r => r * 180 / Math.PI;
  const y = Math.sin(toRad(lng2 - lng1)) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
            Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lng2 - lng1));
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

let monsoonLayer = null;
function buildMonsoonLayer(season){
  const group = L.layerGroup();
  const info = monsoonInfo[season];
  monsoonStreamlines.forEach(s => {
    const pts = season === 'ne' ? s.path : [...s.path].reverse();

    const line = L.polyline(pts, {
      color: '#F1E6C8', weight: 2.5, opacity: 0.9,
      lineCap: 'round', className: 'monsoon-flow-line'
    });
    line.bindPopup(`<div class="t-region">${s.region}</div><div class="t-name">${info.label}</div><div class="t-figures"><div>${info.note}</div></div>`, { maxWidth: 250 });
    line.addTo(group);

    // Arrowhead at the flow's downstream end, rotated to the final segment's bearing.
    const n = pts.length;
    const [lat1, lng1] = pts[n - 2], [lat2, lng2] = pts[n - 1];
    const bearing = bearingDeg(lat1, lng1, lat2, lng2);
    const arrowIcon = L.divIcon({
      className: '',
      html: `<div class="monsoon-arrowhead" style="transform: rotate(${bearing - 90}deg);">➤</div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
    const arrow = L.marker([lat2, lng2], { icon: arrowIcon, interactive: false });
    arrow.addTo(group);
  });
  return group;
}




// Maps a territory key to the location pin that holds its ruler/figure data,
// so clicking a shaded territory surfaces the same "who rules here" info as
// clicking its pin — territories were previously decoration only.
const territoryToLocation = {
  "Malacca": "Malacca", "Aceh": "Pasai / Aceh", "Sunda": "Sunda Kalapa",
  "Demak": "Demak", "Majapahit": "Majapahit (rump court)", "Bali": "Gelgel",
  "Brunei": "Brunei", "Gowa": "Gowa", "Bone": "Bone", "Ternate": "Ternate",
  "Tidore": "Tidore", "Jailolo": "Jailolo", "Bacan": "Bacan",
  "Sulu": "Sulu (Jolo)", "Maguindanao": "Maguindanao", "Ayutthaya": "Ayutthaya",
  "Patani": "Patani", "Jambi": "Jambi", "Pahang": "Pahang (Pekan)",
  "Panduranga": "Panduranga (Champa)", "Wehali": "Wehali"
};

// Independent territory-level content, distinct from the pin's ruler list.
// Where the pin popup answers "who rules here," this answers "what is this
// place, economically and structurally" — scale, economic base, and a
// defining trait that doesn't reduce to a person's name. Keeps territory
// clicks from being a redundant echo of the pin click right next to it.
const territoryProfiles = {
  "Malacca": {
    scale: "The single wealthiest port-city in the spice world — contemporary estimates from Portuguese sources describe a population in the tens of thousands, with resident merchant communities speaking a reported eighty-odd languages on its waterfront alone.",
    economy: "An entrepôt economy, not a producer one — Malacca grows almost nothing of value itself. Its wealth comes entirely from taxing and re-selling goods that pass through the Strait: Indian cloth, Chinese porcelain, and Maluku's spices all change hands here before moving on.",
    trait: "Geography as destiny — the sultanate exists because the Strait narrows here, and every ship threading it either pays Malacca's harbor tax or finds another way around, which in 1500 there mostly isn't."
  },
  "Aceh": {
    scale: "Still a rising coastal power in 1500, not yet the regional force it becomes after Ali Mughayat Syah's sultanate consolidates in the following decades.",
    economy: "Pepper and the Indian Ocean gold trade — North Sumatra's coast sits at the western mouth of the archipelago's spice-and-textile circuit, feeding directly into the Bay of Bengal shipping lanes.",
    trait: "A pepper port living in Pasai's shadow for now — the older port still dominates the coast's trade, even as the political center of gravity is quietly shifting north toward Aceh."
  },
  "Sunda": {
    scale: "A substantial inland-facing Hindu kingdom, its court at Pakuan Pajajaran removed from the coast it depends on for trade — power here runs through a capital most foreign merchants never actually see.",
    economy: "Pepper grown in the West Javan interior, shipped out through the port of Sunda Kalapa — one of the archipelago's steadier pepper suppliers precisely because it isn't a spice monopoly the way Maluku is.",
    trait: "An island of the old Hindu-Buddhist order, increasingly hemmed in by Islamic sultanates rising along the rest of Java's north coast on both sides of it."
  },
  "Demak": {
    scale: "A young sultanate, founded only in the 1490s on former Majapahit coastal territory — small in land area but already punching well above its age in trade reach.",
    economy: "A pivot point rather than a producer — rice and textiles from Java flow east through Demak's ships toward Maluku, and cloves flow back west, with Demak taking a cut at both ends of the run.",
    trait: "A statement as much as a state — founding an Islamic sultanate on Majapahit's own former ground is Demak's way of declaring which order is rising and which is fading."
  },
  "Majapahit": {
    scale: "A rump court, not an empire — what's shaded here is a fraction of the territory the Majapahit name once commanded at its height under Hayam Wuruk two centuries earlier.",
    economy: "Little of its own — no navy worth mentioning and no coastline that matters, which is precisely the problem: the old mandala's tribute network has mostly moved to the sultanates now holding the actual ports.",
    trait: "Legitimacy that has outlived its leverage — foreign traders still write home about Majapahit's name decades after the power behind that name relocated to the coast."
  },
  "Bali": {
    scale: "A stable, self-contained kingdom centered on Gelgel, with influence reaching toward Lombok and Sumbawa — one of the few courts on the map not mid-transition in 1500.",
    economy: "Rice agriculture and a court economy sustained by trade with Java's shifting coastal powers, including captives taken in Bali's own periodic wars.",
    trait: "Continuity where everything around it is changing — while Java's courts convert, found, or dissolve, Gelgel simply keeps functioning, which later Balinese chronicles remember as a golden age precisely because it didn't feel like one at the time."
  },
  "Brunei": {
    scale: "An emerging thalassocracy under Bolkiah — reach far out of proportion to Brunei's small home territory, extending tributary influence from northern Borneo to Sulu and parts of Luzon.",
    economy: "A trading and tribute network built on Brunei's fleet — direct commerce with Ming China, redistributed through vassal datus across a wide arc of the northern archipelago.",
    trait: "An empire held together by ships and marriages rather than garrisons — Bolkiah's Brunei is a web of obligations radiating from Kota Batu, not a territory with defended borders."
  },
  "Gowa": {
    scale: "One of several competing polities on the South Sulawesi peninsula in 1500 — a regional power in the making, not yet the dominant force Makassar becomes a century later.",
    economy: "Position, more than production — Gowa sits astride feeder routes linking Java's rice and textile trade to the Maluku clove markets further east.",
    trait: "A foundation being laid before anyone can see the building — Gowa's later 17th-century height as the Makassar sultanate is still generations away, and Islam hasn't even arrived here yet in 1500."
  },
  "Bone": {
    scale: "A Bugis adat-kingdom sharing the South Sulawesi peninsula uneasily with Gowa — smaller and less externally visible than its rival, with the exact 1500 ruler unsettled in accessible chronicles.",
    economy: "Agrarian and river-trade based, currently expanding north to contest the mouth of the Cenrana River — control of a river mouth here means control of what moves through it.",
    trait: "A rivalry that will define the region for generations, already visibly under way in 1500 even before either kingdom's later golden age."
  },
  "Ternate": {
    scale: "Tiny in land area — a single volcanic island — and disproportionately powerful because of what grows on it.",
    economy: "A literal monopoly: cloves grow natively nowhere else on earth. Every spice merchant from Malacca to Lisbon ultimately answers to what Ternate decides to sell and to whom.",
    trait: "Leverage without size — Al-Mansur doesn't need territory or a large army, only control of the one resource the entire world wants, which is exactly the kind of leverage that eventually invites people unwilling to pay the toll."
  },
  "Tidore": {
    scale: "Ternate's near-mirror in size and standing — the second of Maluku's four kingdoms (Moloku Kie Raha), close enough geographically that the two are in constant, direct competition.",
    economy: "Cloves, identical in kind to Ternate's, which is exactly why the two sultanates are locked in perpetual rivalry rather than cooperation — they're selling the same thing to the same buyers.",
    trait: "A rivalry baked into geography — Ternate and Tidore sit close enough to see each other's harbors, competing for the same monopoly good and the same foreign attention."
  },
  "Jailolo": {
    scale: "One of the four Moloku Kie Raha kingdoms, based on Halmahera rather than one of the smaller volcanic islands — geographically larger than Ternate or Tidore but historically the junior partner of the four.",
    economy: "Cloves and Halmahera's forest products, folded into the same Maluku trading circle as its three sister kingdoms.",
    trait: "The quieter of Maluku's four courts in most surviving accounts — present in every telling of the clove trade's politics but rarely the one driving events."
  },
  "Bacan": {
    scale: "The southernmost and generally smallest-profile of Maluku's four kingdoms, with a ruling elite that converted to Islam in the closing years of the 15th century.",
    economy: "Cloves, shared with the rest of the Moloku Kie Raha circle, plus reach south toward the nutmeg-producing Banda Islands that the other three kingdoms touch less directly.",
    trait: "Part of the same tightly bound four-kingdom system as Ternate, Tidore, and Jailolo — rivals and partners simultaneously, bound together by the same monopoly good they compete over."
  },
  "Sulu": {
    scale: "An archipelago sultanate rather than a single-island one — its reach is measured in a scatter of islands and seaways between Borneo and Mindanao, not a solid landmass.",
    economy: "Pearling and tortoiseshell — a sea-based wealth famous enough that Brunei, far larger, still finds direct trade more useful than absorption.",
    trait: "Independence maintained by being too useful to conquer — Sulu answers fully to no one, running its own trade line to Manila Bay independent of Brunei's overlapping tributary network."
  },
  "Maguindanao": {
    scale: "Not yet a sultanate at all in 1500 — the Pulangi River basin here is governed by the animist brother-chiefs Tabunaway and Mamalu, a polity that in name doesn't exist for another fifteen years.",
    economy: "River-basin agriculture and local exchange, largely untouched by the Malacca-centered spice economy running through the rest of the map.",
    trait: "A future entirely unwritten — everything that will define Maguindanao (Shariff Kabungsuwan's arrival, the mass conversion, the centuries-long sultanate) belongs to a story that in 1500 hasn't started."
  },
  "Ayutthaya": {
    scale: "By far the largest territory shaded on this map — a continental kingdom dominant over the entire Chao Phraya river basin, dwarfing every archipelago sultanate in raw land area.",
    economy: "Rice, tin, and a tributary network reaching down the Malay Peninsula — Ayutthaya's wealth is continental and agrarian where Malacca's is maritime and entrepôt-based.",
    trait: "Unfinished business given form — Ayutthaya never fully accepted Malacca's independence, and in 1500 King Ramathibodi II acts on that old claim by sending an army south."
  },
  "Patani": {
    scale: "A modest but rising sultanate on the peninsula's east coast, caught geographically between two larger gravities pulling in different directions.",
    economy: "Coastal trade meeting the Siamese interior's overland routes — Patani is a hinge point between Malacca's maritime network and Ayutthaya's continental one.",
    trait: "A small state's classic problem — too useful to ignore, too weak to fully resist either Malacca's commercial orbit or Ayutthaya's expanding tributary reach."
  },
  "Jambi": {
    scale: "A modest east-coast Sumatran sultanate, geographically compact but strategically placed as one of Malacca's steadier southern feeder ports.",
    economy: "Gold and pepper from the Sumatran interior, moving north into Malacca's markets — one of the shorter, more dependable supply lines the greater sultanate relies on.",
    trait: "A fresh start in a world of mid-reign courts — Orang Kayo Hitam takes the throne in exactly 1500, meaning Jambi's story this year is accession, not the long-running tensions defining most of its neighbors."
  },
  "Pahang": {
    scale: "A vassal state on the peninsula's east coast — its formal status as a sultanate belies a chain of command that runs straight back to Malacca.",
    economy: "Gold from Pahang's interior mines, flowing to Malacca alongside tribute obligations that mark this as a subordinate relationship rather than an equal trading partnership.",
    trait: "A throne installed by its own overlord — Malacca placed Mansur Shah I here through its own minister, making Pahang's sultan a vassal's vassal in practice even while carrying a sovereign's title."
  },
  "Panduranga": {
    scale: "A rump kingdom, not the Champa that once dominated central Vietnam's coast — what survives here is what remained after Đại Việt's 1471 sack of the old capital at Vijaya.",
    economy: "Sappanwood, aromatic woods, and regional trade goods moving along an old historic corridor now increasingly overshadowed by the powers on either side of it.",
    trait: "A kingdom in eclipse holding on by inertia — Po Kabih rules a coastline that once commanded far more, in a period when 'surviving' is itself the accomplishment."
  },
  "Wehali": {
    scale: "The paramount kingdom of Timor — not the largest territory in land area, but holding ritual seniority that the island's many smaller chiefdoms still defer to.",
    economy: "Sandalwood — Timor's great monopoly export, feeding markets that stretch to Chinese incense-makers and, eventually, European cabinet-makers.",
    trait: "Authority built on ritual seniority rather than military conquest — Wehali's dominance is the kind that persists because neighboring chiefdoms accept it, not because it's been forced on them."
  }
};

Object.entries(territoriesGeoJSON).forEach(([name, info]) => {
  const baseStyle = {
    color: info.color,
    weight: 1.2,
    opacity: 0.65,
    fillColor: info.color,
    fillOpacity: 0.2,
    dashArray: null,
    lineJoin: 'round'
  };
  const hoverStyle = {
    color: info.color,
    weight: 2,
    opacity: 0.95,
    fillColor: info.color,
    fillOpacity: 0.34,
    dashArray: null,
    lineJoin: 'round'
  };

  // A second, wider, near-invisible outline underneath softens the edge into
  // a "sphere of influence" halo rather than a crisp modern border line.
  // Non-interactive so it never steals clicks from routes or the fill above it.
  const halo = L.geoJSON(info.geojson, {
    style: { color: info.color, weight: 5, opacity: 0.12, fill: false, dashArray: null },
    interactive: false
  }).addTo(map);

  const layer = L.geoJSON(info.geojson, { style: baseStyle }).addTo(map);

  const locName = territoryToLocation[name];
  const loc = locations.find(l => l.name === locName);
  const figuresHtml = loc ? loc.figures.map(f => `<div>${f}</div>`).join('') : '<div>No ruler on record for this zone.</div>';
  const profile = territoryProfiles[name];
  const profileHtml = profile ? `
    <div class="t-profile">
      <div><b>Scale:</b> ${profile.scale}</div>
      <div><b>Economy:</b> ${profile.economy}</div>
      <div><b>Defining trait:</b> ${profile.trait}</div>
    </div>
  ` : '';

  layer.bindPopup(`
    <div class="t-region">Sphere of Influence</div>
    <div class="t-name">${name}</div>
    <div class="t-figures">${figuresHtml}</div>
    ${profileHtml}
  `, { maxWidth: 300 });

  layer.on('mouseover', () => layer.setStyle(hoverStyle));
  layer.on('mouseout', () => layer.setStyle(baseStyle));
});

// Territory shading sits above the coastline fill (so the tint is visible)
// but beneath every trade route (so routes stay clickable and legible drawn
// over a territory). One pass at the end avoids the ordering bugs of calling
// bringToBack()/bringToFront() per layer inside each loop above.
coastlineLayer.bringToBack();
routeLayers.forEach(l => l.bringToFront());

