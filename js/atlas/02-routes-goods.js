// ============ TRADE ROUTES ============
// Routes below were pathfound over a sea-only navigation grid (built from the same
// coastline data as the landmasses) so every segment stays in open water — no more
// cutting across Sumatra, Borneo, or the Visayas. Grid: 0.25° resolution, 8-directional,
// each edge verified against the full coastline geometry, shortest-path via Dijkstra,
// then simplified for a cleaner line while re-verifying zero land overlap at each step.
const routeStyle = {
  color: '#B8873D',
  weight: 2.75,
  opacity: 0.9,
  dashArray: '9 5',
  lineCap: 'round'
};

// Each route now carries a `goods` field describing what actually moved along
// it in 1500, drawn from Tome Pires' Suma Oriental (written 1512-15, describing
// trade patterns already well established by 1500), Ma Huan's earlier Chinese
// accounts, and standard secondary sources on the Malacca-Maluku-China trade
// circuit. Routes are click-to-reveal so the map stays clean until asked.
const routes = [
  {
    path: [[2.0, 102.25], [2.5, 101.75], [2.5, 101.5], [5.5, 98.5], [5.5, 96.0]],
    label: "Malacca &harr; Aceh / Pasai",
    goods: "North Sumatran pepper and gold moving south to Malacca; in return, Indian textiles and Malacca-brokered goods moving north. Pasai is itself a rival pepper port, so this route is as much competition as cooperation.",
    importance: "Major artery &mdash; one of Malacca's primary pepper supply lines, and a route Aceh will eventually turn hostile once its own sultanate consolidates and starts competing for the same buyers."
  },
  {
    path: [[2.0, 102.25], [1.0, 103.25], [0.75, 103.25], [0.5, 103.5], [0.5, 103.75], [-1.5, 105.75], [-1.5, 106.0], [-1.75, 106.25], [-2.0, 106.25], [-2.75, 107.0], [-5.75, 107.0], [-6.0, 106.75]],
    label: "Malacca &harr; Sunda Kalapa",
    goods: "West Javan pepper, grown around Sunda's interior, flows out through Sunda Kalapa toward Malacca's markets &mdash; one of the routes Portuguese sources will later cite as Malacca's justification for wanting a foothold on Java's coast.",
    importance: "Strategically loaded &mdash; a comparatively modest pepper volume, but the route Portugal's own later sources point to when explaining why Java's north coast mattered enough to fight over."
  },
  {
    path: [[-6.75, 110.5], [-6.25, 110.75], [-6.25, 120.0], [-5.75, 120.5], [-5.75, 123.0], [-1.75, 127.0], [-0.25, 127.0], [0.75, 127.5]],
    label: "Demak &harr; Ternate",
    goods: "Cloves &mdash; the whole reason this corridor exists. Demak's ships carry rice, cloth, and Chinese porcelain east; they return with cloves that will be re-sold at enormous markup all the way to Europe.",
    importance: "A lifeline route &mdash; the single longest-distance, highest-value corridor on the map, carrying the one good every buyer from Cairo to Lisbon ultimately wants."
  },
  {
    path: [[-6.75, 110.5], [-6.25, 110.75], [-6.25, 118.25], [-5.25, 119.25]],
    label: "Demak &harr; Gowa",
    goods: "Javanese rice and textiles for Sulawesi's forest and sea products &mdash; a feeder route into the larger Makassar Strait corridor that ultimately reaches the Spice Islands.",
    importance: "A feeder, not a destination &mdash; its real value is as the western half of the longer chain that ends in Maluku's cloves, not in what Gowa itself has to trade."
  },
  {
    path: [[-5.25, 119.25], [-5.75, 119.5], [-5.75, 123.0], [-1.75, 127.0], [-0.25, 127.0], [0.75, 127.5]],
    label: "Gowa &harr; Ternate",
    goods: "The Makassar Strait leg of the clove trade &mdash; Sulawesi traders carrying rice and iron goods east, cloves and nutmeg coming back west toward the Java Sea markets.",
    importance: "A lifeline route &mdash; alongside the Demak&ndash;Ternate corridor, this is one of two main arteries carrying cloves out of Maluku at all; lose either and the whole western spice market feels it."
  },
  {
    path: [[5.0, 114.75], [7.0, 116.75], [7.0, 120.25], [6.25, 121.0]],
    label: "Brunei &harr; Sulu",
    goods: "Chinese porcelain and silk (Brunei's court trades directly with Ming China) moving south; in return, Sulu sends pearls and tortoiseshell from its famous pearling grounds.",
    importance: "Steady, not spectacular &mdash; a reliable secondary trade line that matters more for what it says about Brunei-Sulu relations than for its raw volume."
  },
  {
    path: [[5.0, 114.75], [8.5, 114.75], [14.5, 120.75]],
    label: "Brunei &harr; Manila Bay",
    goods: "Brunei's tributary reach into Luzon &mdash; Chinese goods, textiles, and Bruneian court wares moving north in exchange for gold, beeswax, and forest products from the Luzon interior.",
    importance: "A long-haul tributary line &mdash; less about trade volume than about projecting Brunei's political reach across open water into a region it doesn't directly govern."
  },
  {
    path: [[6.25, 121.0], [6.75, 121.5], [6.75, 122.0], [7.25, 122.5], [7.25, 124.0]],
    label: "Sulu &harr; Maguindanao",
    goods: "Pearls, tortoiseshell, and birds' nests moving between the Sulu and Moro coasts &mdash; a regional exchange feeding into the larger China-bound pearl trade.",
    importance: "A minor feeder &mdash; short-hop volume that matters mainly as the local leg of a much longer chain ending in Chinese markets."
  },
  {
    path: [[10.25, 124.0], [9.25, 123.5], [7.5, 121.75], [7.0, 121.75], [6.75, 122.0], [7.25, 122.5], [7.25, 124.0]],
    label: "Cebu &harr; Maguindanao",
    goods: "Visayan gold and slaves for Mindanao goods &mdash; a smaller regional circuit, largely untouched by the Malacca-centered spice economy to the west.",
    importance: "Peripheral to the main spice economy &mdash; a self-contained regional circuit that runs on its own logic, mostly invisible to the Malacca-Maluku trade dominating the rest of the map."
  },
  {
    path: [[-8.75, 115.5], [-9.0, 115.5], [-8.75, 115.75], [-8.25, 115.75], [-6.75, 114.0], [-6.75, 111.75], [-6.25, 111.0], [-6.25, 110.75], [-6.75, 110.5]],
    label: "Bali &harr; Demak",
    goods: "Rice and enslaved captives from Bali's wars move north along Java's coast in exchange for cloth and coastal trade goods &mdash; a route Gelgel depends on even as Demak's Islamic sultanate rises around it.",
    importance: "Quietly essential to Bali &mdash; a modest volume by the map's standards, but one of Gelgel's few direct commercial links to the fast-changing courts on the Java mainland."
  },
  {
    path: [[2.0, 102.25], [2.5, 101.5], [8.0, 96.0], [8.0, 90.0]],
    label: "Malacca &harr; Bay of Bengal (off-map)",
    goods: "The route west toward India &mdash; over a thousand Gujarati merchants live in Malacca alone. Indian cotton textiles flow east as the region's de facto currency; pepper, tin, and Southeast Asian spices flow west toward Cambay and beyond.",
    importance: "A lifeline route &mdash; Malacca's single most important connection to the wider Indian Ocean trading world, and the route that makes the sultanate more than a regional power."
  },
  {
    path: [[2.0, 102.25], [1.25, 103.5], [1.25, 104.25], [1.5, 104.5], [6.75, 104.5], [11.5, 109.25], [12.0, 109.5], [15.5, 109.5], [24.0, 118.0]],
    label: "Malacca &harr; China (off-map)",
    goods: "Chinese porcelain, raw silk, and copper cash flow south into every port on this map; Southeast Asian pepper, sandalwood, and spices flow north to China in a trade older than any sultanate currently ruling here.",
    importance: "A lifeline route &mdash; older than every polity on this map and larger in total volume than any single archipelago corridor; every port here is downstream of this one in some way."
  },
  {
    path: [[14.5, 120.75], [14.25, 120.5], [14.75, 120.0], [15.25, 119.75], [16.25, 119.75], [20.0, 116.0]],
    label: "Manila Bay &harr; China",
    goods: "The old Ming tribute-trade route &mdash; Luzon gold, beeswax, and forest goods sent north; Chinese porcelain (still dug up across the Philippines centuries later) sent south.",
    importance: "The Philippines' main artery north &mdash; smaller in absolute terms than Malacca's China trade, but the single most important external link for Luzon's Tagalog polities."
  },
  {
    path: [[6.25, 121.0], [12.25, 121.0], [13.5, 120.25], [14.5, 120.75]],
    label: "Sulu &harr; Manila Bay",
    goods: "Sulu's own direct pearl-and-tortoiseshell trade line north, run separately from Brunei's overlapping tributary network &mdash; a reminder Sulu answers to no one fully.",
    importance: "Modest in volume, significant in principle &mdash; the route exists specifically to bypass Brunei, which tells you more about Sulu's independence than any trade figure would."
  },
  {
    path: [[2.0, 102.25], [1.25, 103.5], [1.25, 104.25], [1.5, 104.5], [4.25, 104.5], [7.0, 101.75], [7.0, 101.25]],
    label: "Malacca &harr; Patani",
    goods: "Peninsula coastal trade &mdash; textiles and Malacca-brokered goods moving up the coast, met by Patani's own trade with the Siamese interior.",
    importance: "A minor feeder &mdash; steady coastal traffic rather than a high-value corridor, but it keeps Patani inside Malacca's commercial orbit even as Ayutthaya pulls from the other direction."
  },
  {
    path: [[7.0, 101.25], [12.25, 101.25], [12.75, 100.75], [13.25, 100.75], [13.5, 100.5]],
    label: "Patani &harr; Ayutthaya",
    goods: "Rice, tin, and tribute goods flowing up the Gulf of Thailand toward the Siamese capital &mdash; the same corridor Ramathibodi II's invasion fleet uses to move south against Malacca in 1500.",
    importance: "Dual-use and dangerous &mdash; the same water lane carrying tribute goods north in peacetime carries Ayutthaya's invasion fleet south in 1500 itself; trade route and war route are the same line."
  },
  {
    path: [[2.0, 102.25], [1.25, 103.5], [1.25, 104.25], [1.5, 104.5], [6.75, 104.5], [11.5, 109.25]],
    label: "Malacca &harr; Panduranga (Champa)",
    goods: "An old historic corridor east toward Vietnam's coast &mdash; sappanwood, aromatic woods, and regional trade goods moving between two ports increasingly overshadowed by the powers around them.",
    importance: "A fading route &mdash; historically significant, currently marginal; both endpoints are polities whose best trading days are behind rather than ahead of them in 1500."
  },
  {
    path: [[2.0, 102.25], [1.75, 102.5], [1.5, 102.75], [1.25, 103.0], [1.0, 103.25], [0.75, 103.25], [0.5, 103.5], [0.25, 103.75], [0.0, 104.0], [-0.25, 104.0], [-0.5, 104.0], [-0.75, 103.75]],
    label: "Malacca &harr; Jambi",
    goods: "Sumatra's east-coast gold and pepper feeding directly into Malacca's markets &mdash; one of the shorter, steadier supply lines the sultanate depends on.",
    importance: "Dependable rather than dramatic &mdash; short haul, low risk, and exactly the kind of unglamorous steady supply line a wealthy entrep&ocirc;t needs far more of than it needs spectacle."
  },
  {
    path: [[2.0, 102.25], [1.25, 103.5], [1.25, 104.25], [1.5, 104.5], [2.25, 104.5], [3.5, 103.5]],
    label: "Malacca &harr; Pahang",
    goods: "Gold from Pahang's interior mines moving to Malacca, alongside tribute obligations that mark Pahang as a vassal state rather than an equal trading partner.",
    importance: "Tribute dressed as trade &mdash; the goods moving on this line are as much an obligation as a market transaction, given Pahang's subordinate status."
  },
  {
    path: [[5.0, 114.75], [7.0, 116.75], [7.0, 121.25], [0.75, 127.5]],
    label: "Brunei &harr; Tidore",
    goods: "Brunei's long reach into the Spice Islands &mdash; Chinese porcelain and textiles traded directly for cloves, bypassing Malacca's middlemen entirely when Bolkiah's fleets make the run themselves.",
    importance: "A direct challenge to Malacca's model &mdash; every run Bolkiah's fleet makes on this line is trade that never pays Malacca's harbor tax at all."
  },
  {
    path: [[-9.0, 124.75], [-9.25, 116.0], [-8.75, 115.5]],
    label: "Wehali (Timor) &harr; Bali",
    goods: "Sandalwood &mdash; Timor's other great monopoly good besides its ritual authority, second in value only to Maluku's cloves and nutmeg among the archipelago's forest exports. Feeds north into the wider Java Sea network from Wehali's ports.",
    importance: "A quiet monopoly line &mdash; far less fought-over than the clove routes to the north, but carrying a good almost as valuable, simply because fewer people are paying attention to Timor yet."
  },
  {
    path: [[-5.25, 119.25], [-4.75, 118.75], [-2.75, 118.75], [-2.5, 119.0], [3.75, 119.0], [5.0, 120.25], [5.75, 120.5], [6.25, 121.0]],
    label: "Gowa &harr; Sulu",
    goods: "A longer Sulawesi&ndash;Philippines contact route &mdash; forest and sea products moving north, pearls and Sulu goods moving south, linking two trading worlds that otherwise rarely touch.",
    importance: "A minor feeder in trade terms, but the map's longest single point-to-point contact line &mdash; its value is in connecting two worlds that would otherwise barely know of each other."
  },
  {
    path: [[0.75, 127.5], [1.0, 127.25]],
    label: "Tidore &harr; Jailolo",
    goods: "Short-hop trade between two of Maluku's four kingdoms &mdash; cloves, local produce, and the constant low-grade rivalry that comes with sharing a monopoly good.",
    importance: "Minor in distance, structurally important &mdash; one of the short internal links binding the four-kingdom Moloku Kie Raha system together despite its rivalries."
  },
  {
    path: [[0.75, 127.5], [-0.25, 127.5], [-0.5, 127.75]],
    label: "Tidore &harr; Bacan",
    goods: "The fourth Moloku Kie Raha kingdom's link into the clove trade &mdash; smaller in volume than Ternate or Tidore's own output, but part of the same tightly bound Maluku trading circle.",
    importance: "The smallest volume on the map, but structurally necessary &mdash; without it Bacan sits outside the clove circuit its neighbors dominate."
  },
];

const routeLayers = [];
routes.forEach(r => {
  // Invisible wide hit-area line makes the thin dashed route easy to tap on
  // mobile, without changing how the route actually looks.
  // Hit-area width trimmed from 18 to 11: wide enough to stay tappable on
  // mobile but narrow enough that the five routes converging on Malacca
  // don't all grab the same click/hover at the default zoom level.
  const hitArea = L.polyline(r.path, { color: '#000', weight: 11, opacity: 0 }).addTo(map);
  const line = L.polyline(r.path, routeStyle).addTo(map);
  const hoverStyle = { weight: 4, opacity: 1, color: '#D9A05B' };
  routeLayers.push(line, hitArea);

  const popupHtml = `
    <div class="t-region">Trade Route</div>
    <div class="t-name" style="font-size:16px;">${r.label}</div>
    <div class="t-figures">${r.goods}</div>
    ${r.importance ? `<div class="t-importance">${r.importance}</div>` : ''}
  `;
  line.bindPopup(popupHtml, { maxWidth: 280 });
  hitArea.bindPopup(popupHtml, { maxWidth: 280 });

  hitArea.on('mouseover', () => line.setStyle(hoverStyle));
  hitArea.on('mouseout', () => line.setStyle(routeStyle));
  line.on('mouseover', () => line.setStyle(hoverStyle));
  line.on('mouseout', () => line.setStyle(routeStyle));
});

// ============ TRADE & GOODS: SOURCE-TO-DESTINATION FLOWS ============
const goodsFlows = [
  {
    name: "Cloves",
    monopoly: true,
    source: "Ternate, Tidore, Motir, Makian, Bacan (Maluku)",
    port: "Ambon / Ternate &rarr; Melaka",
    route: "Archipelago praus, then long-haul carriers",
    destination: "Cairo, Venice (via India &amp; Red Sea)",
    note: "The whole reason Ternate and Tidore matter to anyone outside the Nusantara. No clove tree grows anywhere else on earth in 1500 &mdash; every hand this passes through, from island grower to Melaka consolidator to Gujarati and Arab carriers to Venetian galleys, marks the price up again.",
    routeLabels: ["Demak &harr; Ternate", "Gowa &harr; Ternate", "Malacca &harr; Bay of Bengal (off-map)"]
  },
  {
    name: "Nutmeg &amp; Mace",
    monopoly: true,
    source: "Banda Islands only",
    port: "Banda's orang kaya federations &rarr; Java Sea ports &rarr; Melaka",
    route: "Fragmented at the source (no single ruler to negotiate with)",
    destination: "Same western chain as cloves &mdash; India, Arabia, the Mediterranean",
    note: "An even narrower monopoly than cloves. Banda has no unified sultan the way Ternate does &mdash; competing village federations run the trade, which keeps the islands more independent, and more vulnerable, than their clove-growing neighbors.",
    routeLabels: []
  },
  {
    name: "Pepper",
    monopoly: false,
    source: "North Sumatra (Pasai), West Java (Sunda), the Malay Peninsula",
    port: "Pasai, Sunda Kalapa, and other competing ports",
    route: "Direct to Melaka, or straight to Indian Ocean carriers",
    destination: "India, the Middle East, and onward to Europe",
    note: "Grown widely enough that no single port can strangle the supply. This is why pepper ports compete on position and shipping relationships rather than holding a monopoly &mdash; volume trade, not scarcity trade.",
    routeLabels: ["Malacca &harr; Aceh / Pasai", "Malacca &harr; Sunda Kalapa", "Malacca &harr; Jambi"]
  },
  {
    name: "Sandalwood",
    monopoly: true,
    source: "Timor (Wehali)",
    port: "Wehali's ports &rarr; Bali &rarr; Java Sea network",
    route: "North, largely bound for China rather than the west",
    destination: "Chinese incense-makers and carvers",
    note: "Timor's other great monopoly, alongside Wehali's ritual authority. A separate economic zone from the clove/pepper trade &mdash; oriented toward China, not Melaka, and quieter simply because fewer outside powers are paying attention to Timor yet.",
    routeLabels: ["Wehali (Timor) &harr; Bali"]
  },
  {
    name: "Chinese Porcelain, Silk &amp; Copper Cash",
    monopoly: false,
    source: "Ming China",
    port: "Direct Chinese junk calls, or via Melaka",
    route: "South into every port on the map",
    destination: "Traded throughout the archipelago for spices, sandalwood, gold",
    note: "The other direction of the exchange &mdash; what China sends south to pay for everything it buys. Older than any sultanate currently ruling in the Nusantara, and larger in total volume than any single archipelago corridor.",
    routeLabels: ["Malacca &harr; China (off-map)", "Manila Bay &harr; China", "Brunei &harr; Sulu", "Brunei &harr; Tidore"]
  },
  {
    name: "Indian Cotton Textiles",
    monopoly: false,
    source: "Gujarat and the Coromandel coast, India",
    port: "Cambay &rarr; Melaka (over a thousand resident Gujarati merchants)",
    route: "Across the Bay of Bengal",
    destination: "Traded throughout the archipelago &mdash; functions almost as currency",
    note: "So central to archipelago exchange that Indian cloth operates as a de facto medium of trade, not just a good in its own right &mdash; buyers across the map want it specifically, which gives it a currency-like liquidity.",
    routeLabels: ["Malacca &harr; Bay of Bengal (off-map)"]
  },
  {
    name: "Gold",
    monopoly: false,
    source: "Sumatra's interior, Pahang (Malay Peninsula), parts of Sulawesi/Borneo, Luzon",
    port: "Palembang, Jambi, Pahang &rarr; Melaka",
    route: "River, then sea",
    destination: "Stored as wealth or paid out as tribute; also traded onward to foreign merchants",
    note: "Moves through the same networks as spices but functions differently &mdash; a store of value and tribute good as much as a traded commodity, especially from vassal states like Pahang where the line between trade and obligation blurs.",
    routeLabels: ["Malacca &harr; Jambi", "Malacca &harr; Pahang"]
  },
  {
    name: "Pearls &amp; Tortoiseshell",
    monopoly: false,
    source: "Sulu's pearling grounds",
    port: "Sulu &rarr; Brunei or direct to Manila Bay",
    route: "Sometimes bypassing Brunei's tributary network entirely",
    destination: "Chinese markets",
    note: "Sulu runs its own direct trade line specifically to avoid full dependence on Brunei &mdash; a small but telling assertion of independence from its larger neighbor.",
    routeLabels: ["Brunei &harr; Sulu", "Sulu &harr; Maguindanao", "Sulu &harr; Manila Bay"]
  },
];

function jumpToRoute(label){
  const idx = routes.findIndex(r => r.label === label);
  if (idx < 0) return;
  const line = routeLayers[idx * 2];
  const mapTabBtn = document.querySelector('.tab-btn[data-tab="map-panel"]');
  if (mapTabBtn) mapTabBtn.click();
  setTimeout(() => {
    map.invalidateSize();
    map.fitBounds(line.getBounds(), { padding: [60, 60], maxZoom: 7 });
    line.openPopup(line.getBounds().getCenter());
  }, 120);
}

function renderGoodsFlows(){
  const el = document.getElementById('goods-flow-list');
  if (!el) return;
  el.innerHTML = goodsFlows.map(g => `
    <div class="goods-card ${g.monopoly ? 'is-monopoly' : ''}">
      <div class="goods-card-head">
        <div class="goods-card-name">${g.name}</div>
        <div class="goods-card-tag">${g.monopoly ? 'Monopoly Good' : 'Volume Trade'}</div>
      </div>
      <div class="goods-flow">
        <div class="goods-flow-step">
          <div class="goods-flow-step-label">Source</div>
          <div class="goods-flow-step-value">${g.source}</div>
        </div>
        <div class="goods-flow-arrow">&rarr;</div>
        <div class="goods-flow-step">
          <div class="goods-flow-step-label">Collection Port</div>
          <div class="goods-flow-step-value">${g.port}</div>
        </div>
        <div class="goods-flow-arrow">&rarr;</div>
        <div class="goods-flow-step">
          <div class="goods-flow-step-label">Sea Route</div>
          <div class="goods-flow-step-value">${g.route}</div>
        </div>
        <div class="goods-flow-arrow">&rarr;</div>
        <div class="goods-flow-step">
          <div class="goods-flow-step-label">Destination</div>
          <div class="goods-flow-step-value">${g.destination}</div>
        </div>
      </div>
      <p class="goods-card-note">${g.note}</p>
      ${g.routeLabels && g.routeLabels.length ? `
        <div class="goods-card-routes">
          ${g.routeLabels.map(label => `<span class="goods-route-chip" data-route="${label}">${label} &#8599;</span>`).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');

  el.querySelectorAll('.goods-route-chip').forEach(chip => {
    chip.addEventListener('click', () => jumpToRoute(chip.dataset.route));
  });
}
renderGoodsFlows();

// ============ MAP: COMMODITY FILTER ============
// Built from goodsFlows.routeLabels (already hand-maintained above) rather
// than duplicating tags on the routes array itself — inverted here into a
// route-label -> [commodity names] lookup so both the filter control and
// the route popups can share one source of truth.
const routeToGoods = {};
goodsFlows.forEach(g => {
  (g.routeLabels || []).forEach(label => {
    (routeToGoods[label] = routeToGoods[label] || []).push(g.name);
  });
});

const dimStyle = { color: '#B8873D', weight: 1.5, opacity: 0.15, dashArray: '9 5' };
const highlightStyle = { color: '#D9A05B', weight: 4.5, opacity: 1, dashArray: '9 5' };
let activeGoodsFilter = "";

function applyGoodsFilter(goodName){
  activeGoodsFilter = goodName;
  routes.forEach((r, i) => {
    const line = routeLayers[i * 2];
    if (!goodName) { line.setStyle(routeStyle); return; }
    const carries = (routeToGoods[r.label] || []).includes(goodName);
    line.setStyle(carries ? highlightStyle : dimStyle);
  });
}

// ============ ROUTE POPUPS: LINK BACK TO TRADE & GOODS TAB ============
// Re-bind each route's popup to append a "see full trade flow" link for
// every commodity that route carries, wired to jump into the goods-panel
// and scroll to that commodity's card.
routes.forEach((r, i) => {
  const line = routeLayers[i * 2];
  const hitArea = routeLayers[i * 2 + 1];
  const carriedGoods = routeToGoods[r.label] || [];
  if (!carriedGoods.length) return;
  const linksHtml = carriedGoods.map(name =>
    `<span class="t-goods-link" data-good="${name}">See full ${name} trade flow &rarr;</span>`
  ).join('');
  const popupHtml = `
    <div class="t-region">Trade Route</div>
    <div class="t-name" style="font-size:16px;">${r.label}</div>
    <div class="t-figures">${r.goods}</div>
    ${r.importance ? `<div class="t-importance">${r.importance}</div>` : ''}
    <div class="t-goods-links">${linksHtml}</div>
  `;
  line.bindPopup(popupHtml, { maxWidth: 280 });
  hitArea.bindPopup(popupHtml, { maxWidth: 280 });
  line.off('popupopen').on('popupopen', wirePopupGoodsLinks);
  hitArea.off('popupopen').on('popupopen', wirePopupGoodsLinks);
});

function wirePopupGoodsLinks(e){
  const el = e.popup.getElement();
  if (!el) return;
  el.querySelectorAll('.t-goods-link').forEach(span => {
    span.addEventListener('click', () => jumpToGoodsCard(span.dataset.good));
  });
}

function jumpToGoodsCard(goodNameRaw){
  const goodsTabBtn = document.querySelector('.tab-btn[data-tab="goods-panel"]');
  if (goodsTabBtn) goodsTabBtn.click();
  setTimeout(() => {
    const cards = document.querySelectorAll('.goods-card-name');
    const target = Array.from(cards).find(c => c.textContent.trim() === goodNameRaw);
    if (target) {
      const card = target.closest('.goods-card');
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.style.transition = 'background 0.3s ease';
      const prevBg = card.style.background;
      card.style.background = 'rgba(184,135,61,0.18)';
      setTimeout(() => { card.style.background = prevBg; }, 1200);
    }
  }, 150);
}


