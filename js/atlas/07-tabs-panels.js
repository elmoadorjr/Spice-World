const CHAR_ROLE_SECTIONS = [
  { key: "nakhoda", heading: "The Nakhoda", sub: "The one member of this roster who hasn't already climbed the ladder — see The Nakhoda tab." },
  { key: "sea-lord", heading: "Sea Lords — Players of the Game", sub: "Sultans and rulers who sit at the table in their own right, each running their own team — see The Game tab." },
  { key: "vassal", heading: "Vassals & Officers", sub: "Admirals, ministers, and subordinate rulers who serve a Sea Lord's team rather than running one of their own — powerful, but pieces on someone else's board." },
  { key: "rivals-mirrors", heading: "Rivals & Mirrors", sub: "Other young nakhoda and warriors climbing toward Sea Lord status across the same 1500–1511 decade — all more likely than Angin to actually be remembered, which is precisely the point. See Central Conflict's Rivals & Mirrors table.", isCohort: true },
  { key: "heir", heading: "Heirs", sub: "Not yet ruling, not yet playing — next in line for a seat their team's Sea Lord already holds." },
  { key: "side", heading: "Side Characters", sub: "Merchants, navigators, and other figures whose lives cross the roster's without a throne of their own." },
  { key: "external", heading: "External Powers", sub: "Pressure and customers from outside the Game itself — see The Game tab's \"Customers at the Door.\"" },
  { key: "unrisen", heading: "Not Yet Arrived", sub: "Figures whose entire legend still lies ahead of 1500, and whose paths don't cross Angin's own — present on the roster for context, not as rivals on his ladder. (Fellow climbers who ARE racing Angin up that ladder are grouped under Rivals & Mirrors above instead.)" },
];

function renderCharList(){
  const byRole = {};
  const cohortIdxs = [];
  characters.forEach((c, i) => {
    if (c.cohort === "rivals-mirrors") {
      cohortIdxs.push(i);
      return; // pulled into the cohort section instead of its role section
    }
    const role = c.role || "sea-lord";
    (byRole[role] = byRole[role] || []).push(i);
  });
  byRole["rivals-mirrors"] = cohortIdxs;

  // Any role present in the data but not in CHAR_ROLE_SECTIONS still gets
  // a section, appended after the known ones, so nothing silently vanishes.
  const knownKeys = CHAR_ROLE_SECTIONS.map(s => s.key);
  const extraSections = Object.keys(byRole)
    .filter(k => !knownKeys.includes(k))
    .map(k => ({ key: k, heading: k.replace(/-/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase()), sub: "" }));
  const sections = [...CHAR_ROLE_SECTIONS, ...extraSections];

  charListEl.innerHTML = sections.map(section => {
    const idxs = byRole[section.key];
    if (!idxs || !idxs.length) return '';
    return `
      <div class="char-role-section">
        <div class="char-role-heading">${section.heading}</div>
        ${section.sub ? `<div class="char-role-sub">${section.sub}</div>` : ''}
        ${idxs.map(i => `
          <div class="char-row" data-index="${i}" role="button" tabindex="0" aria-label="View character sheet for ${characters[i].name}, ${characters[i].title}">
            <div>
              <div class="char-row-name">${characters[i].name}</div>
              <div class="char-row-title">${characters[i].title}</div>
              ${(characters[i].team && characters[i].team !== characters[i].name) ? `<div class="char-row-team">${characters[i].role === 'heir' ? 'Heir to' : 'Team'}: ${characters[i].team}</div>` : ''}
            </div>
            <div class="char-row-arrow">→</div>
          </div>
        `).join('')}
      </div>
    `;
  }).join('');

  document.querySelectorAll('.char-row').forEach(row => {
    row.addEventListener('click', () => {
      const idx = parseInt(row.dataset.index, 10);
      showCharDetail(idx);
    });
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        const idx = parseInt(row.dataset.index, 10);
        showCharDetail(idx);
      }
    });
  });
}

// Labels the team tag by role: a vassal/heir "serves" or is "heir to" the
// team's Sea Lord; a Sea Lord whose team is their own name gets no tag at
// all, since restating "runs their own team" on every sovereign is noise.
function teamTagLine(c){
  if (!c.team || c.team === c.name) return '';
  const teamHolder = characters.find(ch => ch.name === c.team);
  const teamDisplay = teamHolder ? `${teamHolder.name} — ${teamHolder.title}` : c.team;
  const verb = c.role === 'heir' ? 'Heir to' : 'Serves';
  return `<div class="char-team-tag">${verb}: ${teamDisplay}</div>`;
}

function showCharDetail(index){
  const c = characters[index];
  charDetailContent.innerHTML = `
    <h2 class="char-name" style="margin-top:0; padding-top:0; border-top:none;">${c.name}</h2>
    <div class="char-title">${c.title}</div>
    ${teamTagLine(c)}
    <p>${c.intro}</p>
    <ul>
      ${c.facts.map(([label, val]) => `<li><b>${label}:</b> ${val}</li>`).join('')}
    </ul>
  `;
  charListView.style.display = 'none';
  charDetailView.style.display = 'block';
  // scroll the doc-scroll container back to top for the new sheet
  document.querySelector('#characters-panel .doc-scroll').scrollTop = 0;
}

function showCharList(){
  charDetailView.style.display = 'none';
  charListView.style.display = 'block';
}

charBackBtn.addEventListener('click', showCharList);
renderCharList();

// ============ LOCATIONS TAB ============
// Tier 1: Malacca, the hub everyone converges on.
// Tier 2: home seats tied to character introductions, ranked by how many
// connections-tab threads run through them (Demak's succession/rivalry web
// makes it the clear second hub) plus standalone plot weight.
// Tier 3: waypoints — no character seat, but referenced or passed through.
// Map names must match `locations[].name` exactly for the jump-to-map to work.
const locationTiers = [
  {
    tier: "Tier 1 — The Hub",
    sub: "Where everyone converges",
    items: [
      { name: "Malacca" }
    ]
  },
  {
    tier: "Tier 2 — Centers of Power",
    sub: "Character home seats, ranked by story weight",
    items: [
      { name: "Demak" },
      { name: "Ternate" },
      { name: "Tidore" },
      { name: "Waigeo (Raja Ampat)" },
      { name: "Sunda Kalapa" },
      { name: "Cirebon" },
      { name: "Majapahit (rump court)" },
      { name: "Brunei" },
      { name: "Sulu (Jolo)" },
      { name: "Pasai / Aceh" },
      { name: "Gowa" },
      { name: "Gelgel" },
      { name: "Ayutthaya" },
      { name: "Jambi" },
      { name: "Pahang (Pekan)" },
      { name: "Cebu" },
      { name: "Maguindanao" }
    ]
  },
  {
    tier: "Tier 3 — Waypoints",
    sub: "Passed through, referenced, or acted upon — not yet a home seat",
    items: [
      { name: "Manila Bay" },
      { name: "Bacan" },
      { name: "Jailolo" },
      { name: "Bone" },
      { name: "Patani" },
      { name: "Panduranga (Champa)" },
      { name: "Wehali" }
    ]
  }
];

function renderLocationTiers(){
  const el = document.getElementById('loc-tier-list');
  if (!el) return;
  el.innerHTML = locationTiers.map(block => `
    <div class="loc-tier-block">
      <div class="loc-tier-heading">${block.tier}</div>
      <div class="loc-tier-sub">${block.sub}</div>
      ${block.items.map((it, i) => `
        <div class="loc-row" data-name="${it.name}" role="button" tabindex="0" aria-label="Find ${it.name} on the map">
          <div class="loc-row-rank">${i + 1}.</div>
          <div class="loc-row-name">${it.name}</div>
          <div class="loc-row-arrow">→</div>
        </div>
      `).join('')}
    </div>
  `).join('');

  el.querySelectorAll('.loc-row').forEach(row => {
    row.addEventListener('click', () => jumpToLocationOnMap(row.dataset.name));
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        jumpToLocationOnMap(row.dataset.name);
      }
    });
  });
}

// Mirrors jumpToRoute's pattern: switch to the map tab, let it lay out,
// then fly to the location and open its existing popup.
function jumpToLocationOnMap(name){
  const loc = locations.find(l => l.name === name);
  if (!loc || !loc._marker) return;
  const mapTabBtn = document.querySelector('.tab-btn[data-tab="map-panel"]');
  if (mapTabBtn) mapTabBtn.click();
  setTimeout(() => {
    map.invalidateSize();
    map.flyTo([loc.lat, loc.lng], 7, { duration: 0.8 });
    setTimeout(() => loc._marker.openPopup(), 600);
  }, 120);
}

renderLocationTiers();

// ============ CONNECTIONS TAB ============
// Surfaces the "Rivalry" line (and a few other ties buried in intros/facts)
// that currently only exist one character-sheet at a time, as a single
// at-a-glance wheel diagram plus a tap-friendly grouped list underneath.
// Every edge below is drawn straight from language already on a character
// sheet — this tab doesn't invent new lore, it just cross-references it.
const RELATION_META = {
  rivalry:    { label: 'Rivalry',                        color: '#8B3A3A', dash: 'none'  },
  tension:    { label: 'Tension / Friction',              color: '#B8873D', dash: '6 4'   },
  vassalage:  { label: 'Vassalage, Service & Blood Ties',  color: '#3A5866', dash: 'none'  },
  family:     { label: 'Family',                          color: '#A8542E', dash: '2 3'   },
  trade:      { label: 'Trade Dependency',                color: '#5C7E8C', dash: '1 5'   },
  future:     { label: 'Foreshadowed (not yet in 1500)',  color: '#2B2320', dash: '3 5'   },
};
// Fixed rendering order for both the legend and the grouped list below.
const RELATION_ORDER = ['rivalry', 'tension', 'vassalage', 'family', 'trade', 'future'];

const connections = [
  { a:"Lapu-Lapu", b:null, bLabel:"Rulers of Cebu", type:"rivalry",
    label:"A cold, simmering rivalry with neighboring Cebu, whose rulers favor accommodating foreign traders and foreign gods over Lapu-Lapu's resistance." },

  { a:"Bolkiah", b:"Bayanullah", type:"rivalry",
    label:"Brunei's tributary reach touches Sulu's waters without fully absorbing them — an uneasy contest for influence over the Sulu and Luzon datus." },

  { a:"Mahmud Shah", b:"Tun Mutahir", type:"tension",
    label:"Court friction between an inherited sultan and a bendahara who rose too fast for the old guard's comfort — and possibly for the sultan's, too." },

  { a:"Mahmud Shah", b:"Ramathibodi II", type:"rivalry",
    label:"Siam's 1500 campaign to retake Malacca as a former vassal — the clearest act of open aggression anywhere on the roster this year. The invasion fails outright but extracts tribute anyway." },

  { a:"Mahmud Shah", b:"Mansur Shah I of Pahang", type:"vassalage",
    label:"Pahang is a Malaccan vassal state, and Mansur's throne and Mahmud's overlordship both trace to the same royal blood. After Malacca falls in 1511, Mahmud Shah will take refuge in Pahang and marry his daughter to Mansur — a tie neither man can see coming in 1500." },

  { a:"Mahmud Shah", b:"Hang Tuah", type:"vassalage",
    label:"Hang Tuah's loyalty is to the throne itself, regardless of who sits on it — Malacca's navy and court answer to the Sultan through him." },

  { a:"Mahmud Shah", b:"Orang Kayo Hitam", type:"trade",
    label:"Jambi is a steady supplier of gold and pepper into Malacca's trade network — no open conflict, but Jambi's position keeps it perpetually in Malacca's economic orbit." },

  { a:"Sri Baduga Maharaja", b:"Raden Patah", type:"rivalry",
    label:"The newly Islamic Demak Sultanate is expanding at Sunda's expense — a territorial and religious rivalry reshaping Java's map." },

  { a:"Raden Patah", b:"Udara", type:"rivalry",
    label:"Raden Patah claims descent from Majapahit's own royal line and is absorbing what remains of the rump court's coastal territory piece by piece." },

  { a:"Raden Patah", b:"Pati Unus", type:"family",
    label:"Father and son — Pati Unus is Demak's crown prince, still a boy in 1500, decades away from the Malacca campaigns that will make him famous." },

  { a:"Raden Patah", b:"Syarif Hidayatullah", type:"tension",
    label:"Cirebon sits on Java's north coast between Sunda and Demak's sphere — its independence is real but narrow, squeezed by Demak's rise." },

  { a:"Sri Baduga Maharaja", b:"Syarif Hidayatullah", type:"tension",
    label:"Cirebon is caught geographically between the Hindu Sunda Kingdom and the rising Demak Sultanate." },

  { a:"Dalem Waturenggong", b:"Raden Patah", type:"tension",
    label:"No sharp rivalry recorded for 1500 itself, but Bali's raiding and trading relationship with Java's shifting courts, Demak among them, keeps the border never fully settled." },

  { a:"Al-Mansur", b:null, bLabel:"Sultanate of Tidore", type:"rivalry",
    label:"Ternate and Tidore are locked in perpetual competition for dominance of the clove trade — the defining rivalry of the Spice Islands." },

  { a:"Gurabesi", b:null, bLabel:"Sultanate of Tidore", type:"vassalage",
    label:"Gurabesi's war chiefdom in Waigeo and the Raja Ampat Islands serves Tidore directly — which quietly places him in Al-Mansur of Ternate's rival camp, without the two men ever having met." },

  { a:"Gurabesi", b:null, bLabel:"Sawai people of Halmahera", type:"rivalry",
    label:"Old hostility won through cunning rather than open battle — Gurabesi is said to have taken a Sawai fortress by poisoning their watchdogs in the night." },

  { a:"Hang Tuah", b:null, bLabel:"Hang Jebat (deceased)", type:"tension",
    label:"An old bond with a fellow warrior that ended in tragedy years before 1500 — Hang Tuah carries that history quietly." },

  { a:"Ali Mughayat Syah", b:null, bLabel:"Pasai", type:"rivalry",
    label:"The older, still-dominant pepper port his rising sultanate will eventually eclipse — though in 1500 that eclipse hasn't happened yet." },

  { a:"Tumapaqrisiq Kallonna", b:null, bLabel:"Bone", type:"rivalry",
    label:"The other major power of the South Sulawesi peninsula — a rivalry that will define the region for generations." },

  { a:"Shariff Kabungsuwan", b:null, bLabel:"Mindanao's animist chiefs (future)", type:"future",
    label:"Not yet arrived in 1500 — his eventual rivalry with Mindanao's animist chiefs, resolved through conversion rather than conquest, is still about a decade and a half away." },

  { a:"Bolkiah", b:"Shariff Kabungsuwan", type:"future",
    label:"Brunei's tributary reach already touches Mindanao in 1500, years before Kabungsuwan arrives to found Maguindanao — the very Islamic network he'll marry and convert his way into is one Bolkiah's court has already been extending toward the Pulangi basin." },

  { a:"Tumapaqrisiq Kallonna", b:"Al-Mansur", type:"trade",
    label:"Gowa sits astride the Makassar Strait feeder route that carries Java's rice and textiles east to Ternate's clove market and cloves back west — neither ruler has met the other, but their two ports are opposite ends of the same trade artery." },

  { a:"Ali Mughayat Syah", b:"Mahmud Shah", type:"tension",
    label:"Aceh's pepper trade and Malacca's entrepôt dominance sit in the same northern Sumatra-strait economy without yet being in open conflict — the rivalry that will eventually see Aceh eclipse Pasai runs parallel to, and increasingly at the expense of, Malacca's own reach up the coast." },

  { a:"Hang Tuah", b:"Tun Mutahir", type:"tension",
    label:"The court's oldest loyalty and its newest office share the same throne to serve but not the same claim to it — Tun Perak's decades of built trust passed to Tun Mutahir in title only, and Hang Tuah, who served under Tun Perak himself, owes the new bendahara nothing he hasn't yet earned." },

  { a:"Udara", b:"Sri Baduga Maharaja", type:"tension",
    label:"Two Hindu-Buddhist courts holding the old order's line from opposite ends of Java, Majapahit's rump at Daha and Sunda at Pakuan Pajajaran — no war between them, but both feel the same rising Islamic tide from Demak and read each other's survival as a measure of their own." },

  { a:"Gurabesi", b:"Al-Mansur", type:"tension",
    label:"Gurabesi has never met the Sultan of Ternate, but his sworn service to Tidore means his warriors are, in effect, Al-Mansur's rival's reach extended all the way to Waigeo — a front in the Ternate-Tidore rivalry neither side calls by that name." },
];

const connSvg = document.getElementById('connections-svg');
const connLegendEl = document.getElementById('conn-legend');
const connDetailEl = document.getElementById('conn-detail-panel');
const connGroupsEl = document.getElementById('conn-groups');

function charIndexByName(name){
  return characters.findIndex(c => c.name === name);
}

function jumpToCharacterSheet(name){
  const idx = charIndexByName(name);
  if (idx < 0) return;
  const sheetsTabBtn = document.querySelector('.tab-btn[data-tab="characters-panel"]');
  if (sheetsTabBtn) sheetsTabBtn.click();
  showCharDetail(idx);
}

function renderConnDetail(conn){
  const bDisplay = conn.b || conn.bLabel;
  const meta = RELATION_META[conn.type];
  connDetailEl.innerHTML = `
    <div class="conn-detail-type" style="color:${meta.color};">${meta.label}</div>
    <div class="conn-detail-pair">${conn.a} &harr; ${bDisplay}</div>
    <div class="conn-detail-text">${conn.label}</div>
    <div class="conn-detail-actions">
      <button class="conn-jump-btn" data-name="${conn.a}">View ${conn.a}'s sheet →</button>
      ${conn.b ? `<button class="conn-jump-btn" data-name="${conn.b}">View ${conn.b}'s sheet →</button>` : ''}
    </div>
  `;
  connDetailEl.querySelectorAll('.conn-jump-btn').forEach(btn => {
    btn.addEventListener('click', () => jumpToCharacterSheet(btn.dataset.name));
  });
  connDetailEl.style.display = 'block';
}

function renderConnLegend(){
  connLegendEl.innerHTML = RELATION_ORDER.map(type => {
    const m = RELATION_META[type];
    return `<div class="conn-legend-item"><span class="conn-legend-swatch" style="border-top-color:${m.color}; border-top-style:${m.dash === 'none' ? 'solid' : 'dashed'};"></span>${m.label}</div>`;
  }).join('');
}

function renderConnDiagram(){
  const cx = 320, cy = 320, R = 235, extR = 300;
  const N = characters.length;
  const angleFor = i => (i / N) * 2 * Math.PI - Math.PI / 2;
  const nodePos = characters.map((c, i) => {
    const a = angleFor(i);
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a), angle: a };
  });

  // Group external connections per source character so multiple satellites
  // off the same node fan out instead of overlapping.
  const externalByChar = {};
  connections.forEach(conn => {
    if (!conn.b) {
      (externalByChar[conn.a] = externalByChar[conn.a] || []).push(conn);
    }
  });

  let svgParts = [];

  // Internal (character-to-character) edges, drawn first so nodes sit on top.
  connections.forEach((conn, ci) => {
    if (!conn.b) return;
    const ai = charIndexByName(conn.a), bi = charIndexByName(conn.b);
    if (ai < 0 || bi < 0) return;
    const p1 = nodePos[ai], p2 = nodePos[bi];
    const meta = RELATION_META[conn.type];
    svgParts.push(`<g class="conn-edge" data-idx="${ci}">
      <line class="conn-edge-hit" x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}"></line>
      <line class="conn-edge-line" x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}"
        stroke="${meta.color}" stroke-width="2.25" stroke-dasharray="${meta.dash}" opacity="0.85"></line>
    </g>`);
  });

  // External (character-to-unnamed-entity) edges, fanned out beyond the ring.
  Object.keys(externalByChar).forEach(name => {
    const idx = charIndexByName(name);
    if (idx < 0) return;
    const list = externalByChar[name];
    const baseAngle = nodePos[idx].angle;
    list.forEach((conn, j) => {
      const offset = (j - (list.length - 1) / 2) * 0.22;
      const a = baseAngle + offset;
      const ex = cx + extR * Math.cos(a), ey = cy + extR * Math.sin(a);
      const p1 = nodePos[idx];
      const meta = RELATION_META[conn.type];
      const ci = connections.indexOf(conn);
      const anchor = Math.cos(a) >= 0 ? 'start' : 'end';
      svgParts.push(`<g class="conn-edge" data-idx="${ci}">
        <line class="conn-edge-hit" x1="${p1.x}" y1="${p1.y}" x2="${ex}" y2="${ey}"></line>
        <line class="conn-edge-line" x1="${p1.x}" y1="${p1.y}" x2="${ex}" y2="${ey}"
          stroke="${meta.color}" stroke-width="1.75" stroke-dasharray="${meta.dash}" opacity="0.7"></line>
        <circle class="conn-ext-dot-hit" data-idx="${ci}" cx="${ex}" cy="${ey}" r="10"></circle>
        <circle class="conn-ext-dot" data-idx="${ci}" cx="${ex}" cy="${ey}" r="4"></circle>
        <text class="conn-ext-label" data-idx="${ci}" x="${ex + (anchor === 'start' ? 8 : -8)}" y="${ey + 3}" text-anchor="${anchor}">${conn.bLabel}</text>
      </g>`);
    });
  });

  // Character nodes on top of every edge.
  characters.forEach((c, i) => {
    const p = nodePos[i];
    const anchor = Math.cos(p.angle) >= 0 ? 'start' : 'end';
    const lx = p.x + (anchor === 'start' ? 10 : -10);
    svgParts.push(`<g class="conn-node" data-name="${c.name}">
      <circle class="conn-node-dot-hit" cx="${p.x}" cy="${p.y}" r="12"></circle>
      <circle class="conn-node-dot" cx="${p.x}" cy="${p.y}" r="6"></circle>
      <text class="conn-node-label" x="${lx}" y="${p.y + 3}" text-anchor="${anchor}">${c.name}</text>
    </g>`);
  });

  connSvg.innerHTML = svgParts.join('');

  connSvg.querySelectorAll('.conn-edge').forEach(g => {
    g.addEventListener('click', () => {
      const conn = connections[parseInt(g.dataset.idx, 10)];
      renderConnDetail(conn);
    });
  });
  connSvg.querySelectorAll('.conn-ext-dot, .conn-ext-dot-hit, .conn-ext-label').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const conn = connections[parseInt(el.dataset.idx, 10)];
      renderConnDetail(conn);
    });
  });
  connSvg.querySelectorAll('.conn-node').forEach(g => {
    g.addEventListener('click', () => jumpToCharacterSheet(g.dataset.name));
  });
}

function renderConnGroups(){
  connGroupsEl.innerHTML = RELATION_ORDER.map(type => {
    const rows = connections.filter(c => c.type === type);
    if (!rows.length) return '';
    const meta = RELATION_META[type];
    return `
      <div class="conn-group-block">
        <h3 style="color:${meta.color};">${meta.label}</h3>
        ${rows.map(conn => {
          const ci = connections.indexOf(conn);
          const bDisplay = conn.b || conn.bLabel;
          return `<div class="conn-row" data-idx="${ci}" style="border-left-color:${meta.color};">
            <div class="conn-row-pair">${conn.a} &harr; ${bDisplay}</div>
            <div class="conn-row-text">${conn.label}</div>
          </div>`;
        }).join('')}
      </div>
    `;
  }).join('');

  connGroupsEl.querySelectorAll('.conn-row').forEach(row => {
    row.addEventListener('click', () => {
      const conn = connections[parseInt(row.dataset.idx, 10)];
      renderConnDetail(conn);
      connDetailEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
}

renderConnLegend();
renderConnDiagram();
renderConnGroups();

// ============ COLLAPSIBLE LEGEND ============
// Defaults closed on small/short viewports (where the summary toggle is
// actually visible per the media queries above) so the map gets the space
// on first paint instead of opening full then requiring a manual collapse.
// Toggling it changes the map's available height, so Leaflet needs a size
// recalculation each time it opens or closes — same reason the tab switch
// handler calls invalidateSize() above.
const legendDetails = document.getElementById('legend-details');
function applyDefaultLegendState(){
  const shouldCollapse = window.innerWidth <= 640 || window.innerHeight <= 700;
  legendDetails.open = !shouldCollapse;
}
applyDefaultLegendState();
window.addEventListener('resize', applyDefaultLegendState);
legendDetails.addEventListener('toggle', () => {
  setTimeout(() => { map.invalidateSize(); }, 50);
});

// ============ MAIN MENU (full-screen splash, full series) ============
// This file is Book 3.3 — "Crescent and Crossroads," the third part of the
// Thalassocracy mini-series (itself Book 3 of the wider Austronesia Series).
// Titles below are the author's actual canon book list. Books 4 and 5 are
// not defined in the source outline (the numbering jumps 3.1/3.2/3.3 → 6),
// so they're intentionally omitted rather than left as guessed placeholders.
// Each book lives in its own HTML file; fill in a real filename/URL per book
// below once that file exists, and selecting it (then pressing Enter) will
// navigate straight there. Unlinked books can still be highlighted/selected,
// but Enter shows a short notice instead of a dead link.
const CURRENT_BOOK = 3.3;
