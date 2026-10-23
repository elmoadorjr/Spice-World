# SPICE WORLD: The Complete Game & Lore Bible

**The Nusantara, Anno Domini 1500.** A maritime trading, sailing and climbing game set in the spice-trade world of island Southeast Asia, built on the worldbuilding of *The Austronesia Saga*, Book 3.3: *Crescent and Crossroads*.

Source: the `elmoadorjr/Spice-World` repository (live at https://elmoadorjr.github.io/Spice-World/). Every number, name and rule in Parts 1 and 2 is taken from the code as it exists today; Part 3 is the full lore text and lore data from the atlas, converted to Markdown.

> **Note:** Parts 1 and 2 describe the earlier 40-island version of Nakhoda Mode. The voyage has since been rebuilt as an open world on the real coastlines (see `js/voyage/` and the README). The lore in Part 3 is unchanged.

---

## 0. How to use this document

This file is written to be dropped into a Claude Project as project knowledge. Suggested project instructions:

> You are the co-designer and lead developer of *Spice World*, a game set in the Nusantara of 1500 AD. The attached Bible is canon. Parts 1 and 2 describe what is already built and its exact numbers; Part 3 is the world's lore. When you build, keep names, ports, goods, factions, ship tiers and ranks consistent with the Bible. When you invent something new, say so, and keep it consistent with the lore's tone and its magic system (magic is relationship and negotiation, never free power). Artifacts must be a single self-contained HTML file.

Table of contents:

- **Part 1: The game as built.** The two playable pieces (the Atlas and Nakhoda Mode), every system and every formula.
- **Part 2: World data tables.** Ports, factions, goods, ships, ranks, upgrades, prices.
- **Part 3: The lore bible.** General lore (Wave Theory, the magic system, Anitism, Proto-Austronesian lexicon), the 1500 AD map data, all 35 character sheets, locations, connections, trade routes and goods, and every codex tab: Central Conflict, The Nakhoda (Ascension mythos), The Ledger, Chapter Outlines, Two Contacts, The Game, The Port, Custom & Conduct, The Unseen, Almanac, Vessels & Navigation, Trade & Goods, The Economy.
- **Part 4: Known gaps and expansion hooks.**

---

# PART 1: THE GAME AS BUILT

## 1.1 The three pages

| Page | What it is | Tech |
|---|---|---|
| `index.html` (the Atlas, or "Chart Room") | Main menu for the whole Austronesia Series, a General Lore overlay, and an interactive Leaflet map of the Nusantara with 17 codex tabs | Leaflet, vendored Tailwind, plain JS split into `js/atlas/01..10` |
| `sim.html` (Nakhoda Mode) | A 3D sailing, trading and combat sim. Launched from the Atlas inside an iframe; can also run standalone | Three.js r128-style, single file |
| `borobudur-trading-sim.html` | An older, standalone prototype of the same idea with a different faction set and audio. Not connected to the save | Three.js, Tone.js, Tailwind CDN |

No build step. Everything is vendored so it works offline (fonts load from Google Fonts when online). Deployed with GitHub Pages.

## 1.2 The Atlas (index.html)

### Main menu
- Title: *The Austronesia Saga: Sultanates, Rajahnates & Trade Winds of the Eastern Seas, Anno Domini 1500*.
- **Choose a Book**: a list of the 10 books of the series (see 3.x "Series Books"). Only Book 3.3 *Crescent and Crossroads* is the active book; Book 1 links to an external page; others are placeholders.
- **Enter Book 3.3** opens the map and codex.
- **Set Sail: Nakhoda Mode** launches the 3D sim. A treasury line under it shows the saved voyage: `Day N · Ship tier · gold pisis · Rep N · SEA LORD`.
- **General Lore** button opens an overlay: Wave Theory, the Magic System, Anitism and the other series-wide pillars (all reproduced in Part 3).
- A loading line, "Rigging the Jong…", shows while the map boots.

### Map layers and controls
- Coastlines and **territory polygons** for 21 polities (spheres of influence, not borders), click for ruler and profile.
- **Trade & tribute routes** (24, gold dashes, pathfound over a sea-only grid so they never cross land), click for cargo and importance.
- **Location pins** for capitals, notable seats and seats of power; pin rings colored by court religion (Islam, Hindu-Buddhist, Animist/other); characters with sheets placed on the map.
- **Local goods** emoji markers (cloves, pepper, sandalwood, textiles, gold, porcelain, pearls).
- **Geography**: rivers (blue fine dashes), volcanoes, sea labels, "Here Be Dragons" decorations at the map edges.
- **Settlements**: unruled towns and villages with notes.
- **Monsoon layer**: animated wind streamlines; a button cycles NE monsoon, SW monsoon, off.
- **1511 timeline toggle**: a Portuguese caravel glyph off Malacca and a red ring marking its fall.
- Jump-to, reset view, fullscreen, layers panel, zoom-dependent labels.
- **Goods filter**: picking a good highlights the routes that carry it.

### The Voyage layer (live sim state on the map)
Reads the shared save and draws: the ship's last position, every port the player has **charted** (visited) with its trade intel (what it produces and craves, and on what day it was seen), and the destination of the active charter. It refreshes whenever the sim saves.

### The 17 codex tabs
Map · Character Sheets · Locations · Connections · Central Conflict · The Nakhoda · The Ledger · Chapter Outlines · Two Contacts · The Game · The Port · Custom & Conduct · The Unseen · Almanac · Vessels & Navigation · Trade & Goods · The Economy. Their full content is in Part 3.

### Save and the bridge between Atlas and sim
- One save in `localStorage` under `nakhoda-save-v4` (older `-v3`/`-v2` saves still load and are upgraded).
- The sim runs in an iframe. On load the Atlas posts `{type:"nakhoda-init", save, bookTitle}`; the sim answers `nakhoda-ready`, sends `nakhoda-save` with the full save on every meaningful change, and `nakhoda-exit` when the player presses **Chart Room**.
- Save fields: `v, gold, day, rep, cargo{good:{qty,cost}}, tier, upg{hull,sails,guns}, stats{deliveries,piratesSunk,merchantsSunk,earned}, seaLord, contract{good,qty,destIdx,reward,expiresDay}, known{port:{day,produces,demands}}, factionRep{key:-100..100}, lastRankSeen, x, z, heading, hp`.
- Because the world geography is fixed, a voyage resumes exactly where the ship was.

## 1.3 Nakhoda Mode (sim.html): the 3D voyage

### Premise and opening
You are a young nakhoda (ship captain-owner) on a tiny **Kelulus**, Day 1, anchored off Melaka. A "Voyage Orders" card explains the loop:
- **The Trade**: dock at any port (sail close, slow down, tap the anchor). Buy what a port produces cheap, sell where it is craved. The Maluku spice ports, marked by golden crates and gold dots, grow cloves, nutmeg and mace.
- **The Climb**: Kelulus → Pencalang → Malangbang → Lancaran → **Jong**. Charters and pirate bounties build Reputation.
- **The Summit**: a Jong flagship, 15,000 pisis, Rep 200, and the day power itself takes notice: **Sea Lord**.
- Closing line: *"The sea owes no man a debt, and takes none either."*
- First toast: "The amihan blows fair, Nakhoda. Find a port and begin the climb."

Currency is the **pisis** (a tin/copper coin of the era). Starting purse: 250 pisis.

### The world
- 40 ports, each on its own island, placed at the real latitude/longitude of the historical port (equirectangular projection centered at 2.2°N, 112.6°E, 100 units per degree, north up). Close neighbors (Ternate/Tidore, Maynila/Tondo, Makassar/Gowa) are nudged apart so each has sea room.
- Each island: sandy disc, 1 to 3 hills, 3 to 9 palms, a jetty, 1 to 3 stilt houses, crates. Maluku ports also show a floating golden crate and spinning gold marker.
- A **minimap** (north-up radar): islands gray, ports dark dots, Maluku ports gold, charter destination pulsing green, merchants blue, pirates red, a cyan wind line. Range shrinks at night and sharply in fog.
- A green **destination beacon/arrow** points to the charter's port.

### Controls
| Input | Action |
|---|---|
| A / D or ← → | Steer |
| W / S or ↑ ↓ | Raise / furl sails (0 to 100%) |
| Mouse | Aim (a ring on the water) |
| Left click / tap / FIRE button | Fire the broadside on the side facing the aim point |
| "⚓ Enter [Port]" button | Dock (appears when slow and close) |
| "🧭 Chart Room" | Save and return to the Atlas |
Mobile gets an on-screen d-pad and a fire button.

### Sailing model
- Wind has a direction that drifts slowly (a sine wobble), plus jitter in storms.
- Angle between wind and heading decides **wind efficiency**:
  - ≤ 35°: **In Irons**, efficiency −0.05 (you drift back).
  - 35° to 75°: **Close Hauled (Tacking)**, efficiency climbs from 0.15.
  - 75° to 135°: **Reaching**; at 90° and beyond efficiency is 1.0.
  - > 135°: **Running**.
- Acceleration = efficiency × sail deployed × accel (0.009) × (wind speed / base wind). Friction 0.975 per frame. Reverse speed capped at 20% of max.
- Turning rate scales with speed (40% at a standstill, 100% at full speed).
- Islands are solid: the ship cannot sail through them.
- HUD shows Treasury, weather, a wind compass, Hull (HP), Munitions (MP), cargo/charter line, cannon reload bar, sail %, wind power and point of sail, plus a rank line: `⚓ Rank · Ship · Day · Rep`.

### Day/night and weather
- A full day/night cycle with sun, moon, 2,000 stars and sky gradients (dawn orange, day teal, dusk amber, night navy). Each wrap of the cycle is a new **Day**.
- Weather changes every 3 to 6 minutes: 50% Clear, 25% Storm, 25% Fog (never the same twice in a row).
  - **Clear**: normal.
  - **Storm**: dark sky, rain, lightning flashes and camera shake, waves ×1.5, wind ×2.5, top speed ×1.3. "A fierce storm is approaching! Waves rising."
  - **Fog**: dense fog, wind ×0.3, wind efficiency ×0.3, top speed ×0.5, minimap range cut to 40%. "Thick fog sets in. Visibility severely reduced."
- Ambience: clouds, birds (they sink and fade in bad weather and at night), wind particles, wake trails, and sea life: sharks, whales, dolphin pods, flying fish, jellyfish swarms and fish schools.

### Each new day
1. **Crew wages** by hull: Kelulus 0, Pencalang 15, Malangbang 35, Lancaran 60, Jong 100 pisis/day. If you can't pay, gold goes to 0 and Rep −2 ("the crew grumbles").
2. **Spoilage**: Rice and Betel & Areca lose 8% (rounded up) each day. Spices don't rot.
3. Prices re-roll ("prices shift with the tide").
4. An overdue charter expires: Rep −5.

### Ports: the three tabs
Docking requires speed under 0.15 and being within the dock radius + 11. Docking **charts** the port (it then appears on the Atlas with its intel). The header shows what the port produces and craves and your standing with its ruling faction (or "Independent port, no tariff, no favor").

**Market.** All 18 goods, each with buy and sell price, CHEAP/CRAVED tags, and +1, +5, −1, All buttons. Hold capacity limits buying. Cargo tracks average cost so a sale shows "+N profit". Every trade nudges the port's faction standing up (+0.3 buying, +0.5 selling).

**Shipyard.**
- Repair: cost = damage ÷ 3 pisis.
- Upgrades, 5 levels each, cost = base × (level + 1):
  - Reinforced Hull: +250 max HP per level (base 400).
  - Woven Sails: +0.035 top speed per level, shown as +0.35 kn (base 500).
  - Bronze Lantaka: +18% weapon damage per level (base 450).
- Commission the next hull (full heal, Rep +10, story card: *"The boy on the jetty would not recognize the man at this stern."*).
- At Jong: "What remains is not a bigger boat," plus a checklist of Sea Lord requirements.

**Tavern.** "Tuak flows, betel is passed, and every table talks routes, prices, and who was seen where."
- **Ask for a charter**: picks a good this port produces that another port craves (fallback: a random port). Quantity = 3 to 7 + 2 × tier. Reward = 80% of the goods' sale value at the destination + 0.4 × distance. Deadline = today + 2 + ceil(distance ÷ 500) days. A green beacon marks the destination.
- **Deliver**: reward pisis, Rep +6, that port's faction +8, "and [port] remembers your name."
- **Abandon**: Rep −4 ("Word travels.").
- **Buy a rumor** (15 pisis): reveals the single best sale price anywhere for a craved good, e.g. *"A pilot swears that Cloves is fetching 150 pisis a unit in Pasai right now…"*
- Ledger line: charters delivered, pirates sunk, lifetime earnings.

### Price formula
For port *d*, good *g*, day *n*, with deterministic noise `r = hash(d, g, n)` in [0,1):
- Ordinary: multiplier 0.9 + 0.4r
- Produced here: 0.5 + 0.15r (cheap)
- Craved here: 1.7 + 0.5r (dear)
- Buy price = base × multiplier × 1.06 × tariff; sell price = base × multiplier × 0.94 × tariff. Minimum 2.
- **Tariff** from standing with the port's faction: t = clamp(rep ÷ 500, −0.20, +0.20). Buy × (1 − t), sell × (1 + t). So at +100 standing you buy 20% cheaper and sell 20% dearer; at −100 the reverse. Independent ports never apply a tariff.

### Combat
- Your ship carries side-mounted cannons and crew guns. Clicking fires the whole broadside on the side the aim point is on ("LEFT SIDE FIRED"); if the aim is fore or aft you get "NO ANGLE".
- Cost: 15 MP per cannon, 5 MP per gun; "NOT ENOUGH MP" otherwise. MP (Munitions) max 100, regenerates 0.25/frame while not reloading. Reload 180 frames.
- Damage: cannon 50, gun 15, × (1 + 0.18 × gun upgrades + 0.1 × tier). Shots arc under gravity with spread that grows with distance.
- Firing knocks a little speed off your ship.
- **AI fleets**: 6 merchants (gray sails, unarmed, 300 HP, sail between random ports) and 4 pirates (black sails, armed, 400 HP).
  - Pirates hunt you within 250 units, close to 80, then turn broadside and fire when you're within 90 and abeam. Their shots do 40 × threat.
  - **Threat multiplier** = 1 + 0.22 × tier + min(0.04 × pirates sunk, 1.2). It scales pirate HP and damage: the bigger your ship and the more pirates you've sunk, the nastier they get.
  - Sunk ships respawn after 10 seconds somewhere safe.
- **Sinking a pirate** ("Pirate penjajap sunk!"): 300 to 699 pisis salvage, Rep +5, +3 standing with the faction of the port it was heading to.
- **Plundering a merchant**: 150 to 399 pisis, Rep −8, −20 with the merchant's home faction and −3 with every other faction. "Word of piracy spreads…"
- **Your death** ("The Sea Takes Back"): lose all cargo and 20% of gold, Rep −5, a day passes, any charter fails, you respawn at a safe point fully repaired. *"Everything he has, the sea gave him, and the sea can take back."*

### Reputation, factions and ranks
- **Rep** (overall name) goes up with charters (+6), pirates (+5), new hulls (+10); down with abandoned (−4) or expired (−5) charters, unpaid wages (−2), plundering (−8) and death (−5). Never below 0.
- **Faction standing** (−100 to +100) for 13 polities, raised by trading and delivering in their ports and sinking pirates bound for them, lowered by plundering their merchants.
- **Ranks (the Ascension ladder)**, with a story card at each step:

| Rank | Requirement | Card text |
|---|---|---|
| The First Ship | Start | |
| Nakhoda | Own a Pencalang (tier ≥ 1) | "Full and proper now. His ship, his cargo, his stake, his risk. Known by name in a port or two, owed money in another. He answers to no court and kneels to no throne, and everything he has, the sea gave him, and the sea can take back." |
| Rising Nakhoda | Malangbang + Rep 30 | "Not yet a name every port fears, but a name every port remembers. He's stopped being interchangeable with every other captain on the jetty." |
| Master Nakhoda | Lancaran + Rep 80 | "He's stopped thinking in single voyages. Now it's a season's worth of runs, and a name that reaches ports he's never personally sailed to." |
| Jong-Owner | Own a Jong | "He has hauled the biggest cargo hull in the known world... But still one hull, still one bad storm or raid from losing everything. Owning a jong proves he can carry a fortune. It does not yet prove he's a power." |
| Sea Lord | Jong + 15,000 pisis + Rep 200 + some faction at +60 or more | "The Sultan's Envoy": a court prahu hails you at dawn with a syahbandar's sealed letter. "You have been seen by power... *Any fool can be born a lord. A nakhoda has to earn the sea's permission every single time he asks.* ... the Game above the waves is only beginning." |

## 1.4 The Borobudur prototype (borobudur-trading-sim.html)

An earlier, standalone take, kept for ideas. Title screen: "NUSANTARA 1500 AD. Navigate the complex political landscape of 16th century Maritime Southeast Asia. Trade, fight, and build reputation with the Sultanates, Rajahs, and Datus. Beware, valuable cargo attracts attention. Don't let storms capsize you!"

Differences from Nakhoda Mode:
- **Factions**: Majapahit Empire (declining Hindu-Buddhist thalassocracy), Sultanate of Malacca, Srivijaya Remnants, Independent Datus, and Orang Laut Corsairs (always hostile). Reputation can flip a faction to HOSTILE.
- **Ports in three sizes**: Great Cities (Malacca, Majapahit/Tuban, Palembang, Makassar), Towns (Banten, Demak, Gresik, Ternate, Tidore, Pasai, Brunei), and outposts. Taxes are charged on loading and delivery.
- **Single-slot delivery runs**: load cargo at one port, deliver to another for coins; carrying cargo spawns pursuers ("Pirates have spotted your cargo!" / rival faction ships).
- **Capsizing**: roll past about 77° in storms and you capsize.
- **Spyglass** (Shift) with a vignette, a **Diplomacy** panel (F), up to 25 AI ships, procedural Tone.js audio (including a kentongan, the slit drum, for the spyglass).
- Starts with 1,000 coins.

---

# PART 2: WORLD DATA TABLES

## 2.1 The 18 trade goods (Nakhoda Mode)

| # | Good | Base price (pisis) | Notes |
|---|---|---|---|
| 0 | Rice | 8 | Perishable (8%/day). Craved by every Maluku port |
| 1 | Sea Salt | 6 | Currently no port produces or craves it |
| 2 | Betel & Areca | 10 | Perishable (8%/day) |
| 3 | Cotton Cloth | 14 | Produced by every entrepot; craved by every Maluku port |
| 4 | Beeswax | 18 | |
| 5 | Tripang | 22 | Sea cucumber |
| 6 | Ceramics | 30 | Chinese porcelain flowing through entrepots |
| 7 | Benzoin | 34 | Aromatic resin |
| 8 | Black Pepper | 40 | |
| 9 | Sandalwood | 44 | |
| 10 | Cinnamon | 46 | |
| 11 | Camphor | 48 | |
| 12 | Birds' Nests | 60 | |
| 13 | Nutmeg | 70 | Spice: Maluku only |
| 14 | Cloves | 80 | Spice: Maluku only |
| 15 | Mace | 85 | Spice: Maluku only |
| 16 | Pearls | 90 | Craved by every entrepot; currently produced nowhere |
| 17 | Gold Dust | 120 | |

## 2.2 Ship tiers (the hull ladder)

| Tier | Hull | Hold | Hull HP | Top speed | Cost | Wages/day | Description |
|---|---|---|---|---|---|---|---|
| 0 | Kelulus | 12 | 600 | 0.52 (5.2 kn) | start | 0 | "Small, swift, half-borrowed, patched everywhere. But she's yours." |
| 1 | Pencalang | 26 | 950 | 0.58 | 1,500 | 15 | "The trader's path. Your ship, your cargo, your stake, your risk." |
| 2 | Malangbang | 44 | 1,300 | 0.61 | 4,200 | 35 | "Broad and flat-bottomed: you're chasing bulk and range now." |
| 3 | Lancaran | 64 | 1,800 | 0.67 | 9,500 | 60 | "War-fleet backbone. A name that reaches ports you've never sailed to." |
| 4 | Jong | 110 | 2,600 | 0.63 | 21,000 | 100 | "The ceiling of single-hull growth. The biggest cargo hull in the known world." |

## 2.3 Factions (the 13 polities of Nakhoda Mode)

| Key | Name | Ruler (1500) | Color | Ports |
|---|---|---|---|---|
| malacca | Sultanate of Melaka | Sultan Mahmud Shah | #8B3A3A | Melaka |
| aceh | Pasai / Aceh | | #5C6B3A | Pasai, Aceh |
| sunda | Sunda Kingdom | | #3A5C6B | Banten, Sunda Kelapa |
| demak | Sultanate of Demak | | #6B4F3A | Demak, Tuban, Gresik, Surabaya |
| brunei | Sultanate of Brunei | Sultan Bolkiah | #B8873D | Brunei |
| gowa | Gowa / Makassar | Tumapa'risi' Kallonna | #6B3A5C | Makassar, Gowa |
| ternate | Sultanate of Ternate | Sultan Al-Mansur | #A8542E | Ternate |
| tidore | Sultanate of Tidore | | #7A4F1F | Tidore |
| sulu | Sultanate of Sulu | Sultan Bayanullah | #4F6B3A | Jolo |
| patani | Patani | | #5C3A6B | Patani |
| jambi | Jambi | Orang Kayo Hitam | #3A6B6B | Jambi |
| pahang | Pahang | Mansur Shah I | #6B5C3A | Pahang |
| wehali | Wehali (Timor) | | #4F3A6B | Timor, Kupang |

All other ports are **independent** on purpose (Banda's merchant oligarchy, Palembang's faded Srivijaya, the animist Mindanao river chiefs, etc.): no tariff, for better or worse.

## 2.4 The 40 ports and their economies

Types: **Maluku spice ports** each produce two of the three spices and crave Rice and Cotton Cloth ("they can't feed themselves on cloves"). **Entrepots** crave a spice and Pearls, and pass through Ceramics or Gold Dust plus Cotton Cloth. **Provincial** ports get two local products and up to two local hungers (deterministic per port). Ports craving the three spices are the money run.

| # | Port | Lat, Lng | Type | Faction | Produces (cheap) | Craves (dear) |
|---|---|---|---|---|---|---|
| 0 | Melaka | 2.19, 102.25 | Entrepot | Sultanate of Melaka | Ceramics, Cotton Cloth | Nutmeg, Pearls |
| 1 | Pasai | 5.23, 96.05 | Entrepot | Pasai / Aceh | Gold Dust, Cotton Cloth | Cloves, Pearls |
| 2 | Palembang | -2.99, 104.75 | Provincial | Independent | Benzoin, Black Pepper | Mace, Cloves |
| 3 | Jambi | -1.6, 103.62 | Provincial | Jambi | Cinnamon, Black Pepper | Ceramics, Camphor |
| 4 | Banten | -6.06, 106.15 | Provincial | Sunda Kingdom | Cotton Cloth, Benzoin | Gold Dust, Pearls |
| 5 | Sunda Kelapa | -6.13, 106.81 | Provincial | Sunda Kingdom | Birds' Nests, Benzoin | Cinnamon, Black Pepper |
| 6 | Demak | -6.89, 110.64 | Entrepot | Sultanate of Demak | Ceramics, Cotton Cloth | Nutmeg, Pearls |
| 7 | Tuban | -6.9, 112.06 | Provincial | Sultanate of Demak | Betel & Areca, Benzoin | Cloves, Black Pepper |
| 8 | Gresik | -7.16, 112.65 | Provincial | Sultanate of Demak | Birds' Nests, Betel & Areca | Ceramics, Pearls |
| 9 | Surabaya | -7.25, 112.75 | Provincial | Sultanate of Demak | Cotton Cloth, Cinnamon | Pearls |
| 10 | Banjarmasin | -3.32, 114.59 | Provincial | Independent | Tripang, Sandalwood | Benzoin, Pearls |
| 11 | Brunei | 4.94, 114.94 | Entrepot | Sultanate of Brunei | Gold Dust, Cotton Cloth | Mace, Pearls |
| 12 | Jolo | 6.05, 121 | Provincial | Sultanate of Sulu | Rice, Cinnamon | Black Pepper, Nutmeg |
| 13 | Maynila | 14.6, 120.98 | Entrepot | Independent | Gold Dust, Cotton Cloth | Cloves, Pearls |
| 14 | Tondo | 14.63, 120.97 | Provincial | Independent | Betel & Areca, Black Pepper | Mace, Gold Dust |
| 15 | Sugbu | 10.32, 123.9 | Provincial | Independent | Sandalwood, Benzoin | Camphor, Gold Dust |
| 16 | Butuan | 8.95, 125.53 | Provincial | Independent | Betel & Areca, Ceramics | Cinnamon, Camphor |
| 17 | Cotabato | 7.22, 124.27 | Provincial | Independent | Rice, Ceramics | Camphor, Pearls |
| 18 | Ternate | 0.8, 127.38 | Maluku spice port | Sultanate of Ternate | Nutmeg, Cloves | Rice, Cotton Cloth |
| 19 | Tidore | 0.68, 127.4 | Maluku spice port | Sultanate of Tidore | Cloves, Mace | Rice, Cotton Cloth |
| 20 | Banda | -4.52, 129.9 | Maluku spice port | Independent | Mace, Nutmeg | Rice, Cotton Cloth |
| 21 | Ambon | -3.7, 128.18 | Maluku spice port | Independent | Nutmeg, Cloves | Rice, Cotton Cloth |
| 22 | Hitu | -3.57, 128.1 | Maluku spice port | Independent | Cloves, Mace | Rice, Cotton Cloth |
| 23 | Makassar | -5.15, 119.43 | Entrepot | Gowa / Makassar | Gold Dust, Cotton Cloth | Mace, Pearls |
| 24 | Buton | -5.47, 122.6 | Provincial | Independent | Cotton Cloth, Cinnamon | Mace, Gold Dust |
| 25 | Timor | -9.3, 124.9 | Provincial | Wehali (Timor) | Beeswax, Camphor | Birds' Nests, Sandalwood |
| 26 | Patani | 6.87, 101.25 | Provincial | Patani | Camphor, Birds' Nests | Gold Dust, Cinnamon |
| 27 | Pahang | 3.48, 103.4 | Provincial | Pahang | Benzoin | Birds' Nests, Pearls |
| 28 | Kedah | 6.12, 100.36 | Provincial | Independent | Sandalwood, Rice | Gold Dust, Black Pepper |
| 29 | Terengganu | 5.33, 103.14 | Provincial | Independent | Benzoin, Ceramics | Cloves, Mace |
| 30 | Aru | 3.78, 98.7 | Provincial | Independent | Benzoin | Nutmeg, Sandalwood |
| 31 | Gowa | -5.35, 119.4 | Provincial | Gowa / Makassar | Benzoin, Birds' Nests | Pearls, Tripang |
| 32 | Mindoro | 13.1, 121.1 | Provincial | Independent | Black Pepper, Tripang | Camphor |
| 33 | Aceh | 5.55, 95.32 | Provincial | Pasai / Aceh | Rice, Ceramics | Sandalwood, Nutmeg |
| 34 | Bali | -8.58, 115.35 | Provincial | Independent | Benzoin, Cotton Cloth | Black Pepper, Cloves |
| 35 | Lombok | -8.58, 116.12 | Provincial | Independent | Sandalwood, Cotton Cloth | Black Pepper, Camphor |
| 36 | Bima | -8.47, 118.72 | Provincial | Independent | Cotton Cloth, Sandalwood | Tripang, Mace |
| 37 | Kupang | -10.17, 123.58 | Provincial | Wehali (Timor) | Ceramics, Betel & Areca | Mace, Benzoin |
| 38 | Zamboanga | 6.9, 122.08 | Provincial | Independent | Camphor, Cinnamon | Ceramics, Gold Dust |
| 39 | Panay | 10.72, 122.55 | Provincial | Independent | Beeswax, Sandalwood | Camphor |

---

# PART 3: THE LORE BIBLE

## 3.1 The Austronesia Series and its General Lore

The series-wide cosmology shared by every book (from the Atlas "General Lore" overlay).

### Series books

| Book | Title | Setting |
|---|---|---|
| 1 | Before the Winds Carried Us | Ancient Formosa · Out-of-Taiwan Migration |
| 2 | Age of the Southern Wind | Maritime Jade Road · Lapita Exodus |
| 3.1 | Rise of the Sealords | Funan · Champa · Srivijaya, to 900 CE |
| 3.2 | Empires of Salt and Spice | Srivijaya · Majapahit |
| 3.3 | Crescent and Crossroads | Rise of the Sultanates, this book |
| 6 | The Sands Remember Us | Precolonial Philippines, 1350–1571 CE |
| 7 | After the Winds Took Us | Precolonial Madagascar, 1500 CE |
| 8 | The Stars Watch Over Us | Precolonial Micronesia, 1000 CE |
| 9 | The Earth Still Holds Us | Precolonial Melanesia, ~1400–1600 CE |
| 10 | The Horizons Call Us | Precolonial Polynesia, 300 CE |

### The Austronesia Saga

Sultanates, Rajahnates & Trade Winds of the Eastern Seas, Anno Domini 1500
Choose a Book
Applies Across the Entire Series

### General Lore

Wave Theory · The Magic System · Anitism, the cosmology every book in the Austronesia Series shares

#### Austronesian Wave Theory

Austronesian civilization does not rise once and stay risen. It moves in long waves, each a a great **Dispersal** of roughly a thousand to fifteen hundred years, when language, culture, religion, and seafaring spread, adapt, and dominate, followed by a **Fog** of several centuries, when inter-island memory fades and the Pan-Austronesian identity goes dormant. Then a new Dispersal begins. This is not decline-and-fall; it's closer to a tide that has gone out twice before and come back in twice before.

| Phase | Period | Character |
|---|---|---|
| **Dispersal I, Maritime Jade Road** | ~2000–500 BCE | The first great wave: outrigger technology, the jade trade network, Lapita expansion into the Pacific. |
| **Fog I** | ~500 BCE – 1 CE | Loss of Pan-Oceanic identity; inter-island contact fades; roughly 500 years of dormancy. |
| **Dispersal II, Maritime Silk Road** | 1 – 1000 CE | A thousand years of naval supremacy: Funan, Champa, Srivijaya, and the great thalassocracies that follow them, this is the wave your current book (Crescent and Crossroads, 1300–1500 CE) sits at the tail end of. |
| **Fog II, Colonial Fragmentation** | ~1500 – 2000 CE | Colonialism, division, and memory loss as European and other outside powers impose new borders and new rules on formerly Austronesian-controlled waters. |
| **Dispersal III, Maritime Renaissance** | 2000 CE – ??? | The wave happening now: cultural revival, seafaring renewal, and regional assertion. Ongoing, outcome unwritten. |

The Spice World of 1500 AD is a hinge point in this cycle, the very last stretch of Dispersal II before Fog II sets in. Every character on your roster is, without knowing it, living in the final uncontested years of a thousand-year wave.

#### The Magic System

Three core principles govern how power works across the whole series: magic flows only through relationship, with land, ancestors, and the unseen; power is never free, and every act must respect balance or the world responds; and magic is not domination, it is negotiation, reciprocity, and harmony. What follows is the working vocabulary:

| Term | What It Governs |
|---|---|
| **Mana** | Spiritual energy and authority, earned, inherited, stolen, or lost through ancestry, ritual, honor, and sacred places. The stronger a person's mana, the louder their voice in the spirit world. |
| **Talina** | The ancient magical language used to speak to, command, or appease spirits. Requires exact pronunciation and ritual knowledge; some Talina are restricted to priesthoods or bloodlines, and corrupted or misused Talina can trigger Bales. |
| **Anitu** | The full hierarchy of spirits every act of magic must bargain with, supreme gods, nature gods (sea, sky, earth, sun, moon, storm, trickster), object spirits, nature spirits, and both deified and common ancestors. |
| **Barang** | Spirit-potent objects, bones, blades, idols, tattoos, ancestral garments, that carry the soulprint of ancestors, events, or places. Sacred, neutral, or cursed, and always owed respect. |
| **Tapu** | Sacred law and taboo, varying by tribe, role, or bloodline. The line between magic and transgression; breaking it desecrates spiritual order. |
| **Bales** | Broad supernatural consequence for impiety or selfishness, the world's natural correction for imbalance caused by broken Tapu, abused spirits, or misused Talina. Illness, misfortune, or family curses aren't purely psychological here; they're spiritual disturbance made visible. |
| **Salaq** | The deliberate, intentional breaking of Tapu to access power. Always creates imbalance that must be rebalanced through ritual, sacrifice, or personal burden, not evil, just a debt that comes due. |
| **Lalan** | The cosmic flow or alignment of the universe. True magic follows Lalan; forceful magic fights it. Some gifted individuals can feel or surf Lalan, altering fate, acting against it invites resistance or distortion. |
| **Dalan** | Sacred time and ritual cycles, moon phases, monsoons, planting seasons, spirit-days. Certain magic only works during the right phase; ignoring Dalan timing can void a working or corrupt it. |
| **Tanaq** | Sacred geography and liminal zones, shorelines, caves, volcanoes, waterfalls. Boundaries between worlds, where magic runs stronger but more volatile, and where spirits must be fed or respected. |
| **Puhun** | Bloodline and inheritance, power shaped by ancestry, with blessings, curses, forbidden Talina, and spiritual debts passing through blood. Some roles are birthbound. |
| **Alang** | Spirit-marked humans, chosen through dreams, possession, or birth to see, speak, or channel Anitu. Feared and revered, neither fully human nor spirit, often serving as memory-keepers or outcasts. |
| **Ngaran** | Name and identity magic. True names hold power; knowing a spirit's name gives control over it. Naming rituals bind souls to lineage, spirit, or destiny, and some names are hidden specifically to protect the soul behind them. |

#### Anitism, The Austronesian Religion

Anitism is the ancestral, animist, cosmological religion practiced, in regional dialects of the same underlying system, from the highlands of Formosa to the reefs of Polynesia. All things possess spirit. Balance between humans, ancestors, nature, and the spirit realm is the highest good. Power flows through mana. Ritual, offerings, chants, dances, tattoos, taboos, is how humans actually speak to the spiritual world. And the cosmos itself is layered: an Upper Realm (*Langit*), the Middle Earth of the living, and an Undersea/Underworld, with ancestors residing in whichever layer matches how they lived and died.

| Element | Regional Names | Function |
|---|---|---|
| **Spirits** | Anitu / Hanitu / Aitu / Hantu / Atua | Souls of the dead, spirits of nature, guardians, the same underlying concept wearing a different regional name at every stop along the wave. |
| **Power** | Mana | The sacred energy that empowers, blesses, or curses. |
| **Shaman** | Babaylan / Balian / Binukot / Tahu'a | Spirit mediators and knowledge-keepers, the region's Alang made into a formal office. |
| **Sacred Sites** | Bato, Puno, Bundok, Baybay (Stone, Tree, Mountain, Shore) | Vessels of spirit, often functioning as shrine sites, the lived version of Tanaq. |
| **Sacred Acts** | Tattoo, chant, offering, dance, blood | The bridge between worlds, ritual tools that put the whole magic system into practice. |

Anitism is remarkably resilient rather than replaced outright. Filipino Catholics still offer food to dead relatives (*atang*). Javanese Muslims honor *dhanyang*, the spirit guardians of a place. Māori Christians still observe *tapu*. Every new faith that arrives on the trade winds, Islam in Crescent and Crossroads, Christianity in later books, tends to layer over Anitism rather than erase it, which is exactly the texture worth writing into any court, any port, any character who has converted but hasn't actually stopped believing the old world is still watching.

#### The Stable Proto-Austronesian Lexicon

A compiled set of reconstructed Formosan cognates, words stable enough to trace across the Austronesian family tree, given here in neutralized root form. In-story, these are the words that survive contact: when characters from different islands and different centuries cross paths, these are the sounds most likely to still mean something on both sides, the way *danum* (water) or *lima* (five/hand) can bridge languages separated by thousands of years and thousands of miles. Treat this list as raw material, the ancestral mother-tongue any two Austronesian peoples in the series might still share a fragment of, however distant their book, era, or ocean.

| Root | Gloss |
|---|---|
| ***adaS** | bring, take along |
| ***ajem** | heart; mind |
| ***aki** | grandfather |
| ***alim** | forget |
| ***alujah** | ant sp. |
| ***apa₂** | carry on the back |
| ***asaŋ₂** | village |
| ***baCaR** | broomcorn millet: Panicum miliaceum |
| ***bajiw** | edible mushroom sp. |
| ***baki₂** | grandfather |
| ***baliw₃** | buy, sell |
| ***bali₃** | wind |
| ***baqeSiŋ** | sneeze |
| ***baRat₂** | cucumber: Cucumis sativus |
| ***baRaŋ** | rib (?) |
| ***baŋaS** | a tree: Melia azedarach |
| ***baŋeS** | skin |
| ***baŋun** | the Japanese cypress: Chamaecyparis obtusa |
| ***benan** | deer of the genus Cervus, either the sika deer or sambar deer |
| ***beNbeN** | banana: Musa sapientum L. |
| ***beRuS** | a plant: Rhus semialata |
| ***biliN** | to follow after someone, walk behind |
| ***bukuN** | back (anat.) |
| ***bula₂** | to give |
| ***bunuR₁** | to swell; swollen |
| ***bunuS** | machete |
| ***buRay** | flower |
| ***Cabu** | to wrap |
| ***Cali** | cultivated taro: Colocasia esculenta |
| ***Capuh** | sweep |
| ***CawiN** | year |
| ***CebuN** | smoke |
| ***Cebuŋ** | to meet, come together |
| ***Ceked** | to rest, take a break from work or other activity |
| ***CekeS** | kind of very slender bamboo |
| ***Cemel** | grass, herbs; medicine |
| ***Cumay** | Formosan black bear |
| ***dakeS** | a tree: the camphor laurel: Cinnamomum spp. |
| ***damuq₁** | menstrual blood? |
| ***daqu₂** | soapberry: Sapindus mukrossi, S. saponaria |
| ***daRa₁** | Formosan maple: Liquidambar formosana |
| ***daRiq** | soil, probably clay |
| ***dawiN** | far |
| ***diNaŋ** | rust; hematite |
| ***dua** | over there, yonder |
| ***dukduk₁** | ginger |
| ***gumuN** | body hair |
| ***ini** | negative marker: no, not |
| ***iuk** | citrus fruit (both orange and pomelo?) |
| ***kabaR** | clothing |
| ***kabus₂** | shrimp, lobster |
| ***kahuS** | scoop up |
| ***kakaCu** | spider |
| ***kaluŋkuŋ** | deep resounding sound |
| ***kapua** | silk cotton, kapok |
| ***kawaS₁** | year, season; sky, heaven |
| ***kawaS₂** | talk, talk about, discuss |
| ***kaway₃** | net bag used by men for carrying things on back |
| ***kawkaw₁** | sickle for harvesting grain |
| ***keRiw** | hemp plant; hemp |
| ***ketun** | cut, sever |
| ***kiRim** | seek, search, look for |
| ***kuCkuC** | roll up, curl up tightly |
| ***kulay₁** | worm, insect |
| ***kumeS** | pubic hair |
| ***kumiS** | pubic hair |
| ***kuNkuN** | Formosan hill partridge |
| ***kuRi** | rake |
| ***kuti** | vulva, vagina |
| ***kuya** | defect, bad, defective |
| ***lahuN** | steam, vapor |
| ***lapis** | flying squirrel |
| ***lawaR** | flying squirrel |
| ***lebleb₁** | foggy, misty, overcast, gloomy, of weather preceding rain |
| ***likeS** | mosquito |
| ***lukeNaw** | Formosan clouded leopard |
| ***lupas₁** | peach |
| ***lutuk₁** | the Formosan hare: Lepus sinensis formosus |
| ***maNaŋ** | sharp |
| ***maqaw** | a plant: Litsea cubeba (Lour.) |
| ***mumu** | Formosan blind mole: Talpa micrura insularis (Swinhoe) |
| ***Namat** | iron (metal) |
| ***Naqeji** | boundary between adjacent rice fields |
| ***nay** | deictic particle: this |
| ***nema** | what thing? |
| ***Nibu** | lair, den of an animal |
| ***Nihib** | rock shelter, cave under a rock |
| ***NuqeS** | bone marrow |
| ***Nutud** | join two things to give added length (rope, bamboo, etc.) |
| ***pajiS** | enemy |
| ***paNiŋ** | door |
| ***paqeju** | gall, gall bladder |
| ***pataS** | tattoo |
| ***pedel** | to wring out, as water from wet clothes |
| ***peSiq** | squeeze out juice; squirt out |
| ***pi-** | causative of location |
| ***piad** | dish, plate |
| ***pu-** | causative of motion |
| ***puja** | navel, umbilical cord |
| ***pujek** | navel, umbilical cord |
| ***pukaw₁** | night-blindness, nyctalopia |
| ***puNi** | whiteness |
| ***punuq** | brain, marrow |
| ***puSaN** | twice |
| ***qadiS** | hawk sp. (harrier?) |
| ***qaNa** | stranger; enemy |
| ***qanus₁** | a plant: Begonia aptera (Hay) |
| ***qaRidaŋ** | bean, pea (generic) |
| ***qaRiw** | dry |
| ***qa₂** | interrogative particle |
| ***qeCeŋeN** | black |
| ***qelqel** | chew, gnaw on |
| ***qelud** | housepost, pillar |
| ***qemu** | sticky rice cake |
| ***qiNaS** | moon, month |
| ***qubiS** | pubic hair |
| ***qudaS** | gray hair |
| ***qulas** | dewdrop |
| ***quyaS** | to sing; song, tune, melody |
| ***RabiS** | small knife |
| ***Rahap** | seeds for sowing |
| ***RameC** | root |
| ***RamiS** | root |
| ***Ribawa** | swell; swelling, tumor |
| ***Rimeja** | sword grass: Imperata cylindrica |
| ***RiNaS** | long feathers used for personal adornment |
| ***riSriS** | hoe up weeds; weed a garden |
| ***Ritu** | loquat tree and fruit: Eriobotrya deflexa |
| ***Rubu** | nest, lair |
| ***RuSRuS** | to scrape smooth, to plane a surface |
| ***sakay₂** | walk |
| ***sakeC** | muntjac, barking deer |
| ***sakut** | to carry, transport, move something |
| ***salaw** | to pour, of heavy rain |
| ***samaq** | remnant, leftover |
| ***Samud** | a plant, sesame: Sesamum indicum |
| ***Sanaq** | river otter |
| ***saNiw** | whetstone |
| ***Sawiki** | betel nut: nut of Areca catechu |
| ***Seked** | stop an activity, take a break, rest |
| ***sequŋ** | horn of an animal |
| ***Seŋad** | to breathe |
| ***Sidi** | Formosan serow, mountain goat |
| ***sihikay** | maggot |
| ***Sijap** | broom |
| ***Sikad** | ashamed; shy |
| ***Sina** | a plant: Erechtites spp. |
| ***SipuR** | to count |
| ***siRa₁** | yesterday |
| ***SiSiN** | omen bird: Alcippe spp. |
| ***Suaw** | yawn |
| ***SulSul** | to masturbate |
| ***supay** | whetting, sharpening |
| ***SuReNa** | snow |
| ***tabi** | plough |
| ***tadaw** | kind of large knife |
| ***takis** | sword |
| ***taNah** | red |
| ***tanaq** | a plant: Aralia decaisneana (Hance) |
| ***tanayan** | bamboo sp. |
| ***taRuqan** | field hut; temporary shelter used when working for extended periods in fields far from |
| ***tatak** | hoe |
| ***tenem** | sea, ocean |
| ***teñeb** | dive, submerge |
| ***timaNa** | to hear, listen |
| ***timu** | salt |
| ***timuRmuR** | rinse the mouth |
| ***tumaNa** | to hear, listen |
| ***tuquN** | an evergreen tree, probably Acacia confusa |
| ***tuRukuk** | chicken |
| ***uka₂** | negative existential: there is none |
| ***umaS** | to pickle, preserve meat or fish |
| ***uSa** | go |
| ***uŋay** | ritually sacrificed monkey? |
| ***waCaN** | deep pool or pond |
| ***walay** | thread |
| ***waNiS** | tusk of wild boar |
| ***waNu** | honeybee |
| ***waqit** | barb, point; canine tooth? |
| ***waSaw** | leaf |
| ***ŋiSŋiS** | beard |
| ***ŋuSuN** | nosebleed |

#### Jade Artifacts

Long before the spice trade, there was the jade trade. Between roughly 3000 and 2000 years ago, Fengtian nephrite, jade quarried from a single source region in eastern Taiwan, was worked, traded, and carried by canoe across the whole reach of what would become the Austronesian world: the Philippines, coastal Vietnam, Borneo, southern Thailand. Archaeologists call the resulting network the Sa Huynh-Kalanay Interaction Sphere, and its signature object is real and has a name: the ***lingling-o***, a double-headed ornament, often carved as two facing animal heads, worn as an earring or pendant, its form drifting and re-interpreted at every stop along the network without ever losing its basic shape. It is, in the real archaeological record, one of the oldest hard evidence of a shared identity across islands that never shared a written language. In the series' own Wave Theory, this is Dispersal I, the Maritime Jade Road, the very first wave, the one every later Dispersal is a distant echo of.
In-story, jade functions as the physical counterpart to the Lexicon: where a stable root word is a fragment of the mother tongue surviving in a stranger's mouth, a jade piece is a fragment of the mother network surviving in a stranger's hand. A carved jade object, old, clearly worked by hands and tools no living smith uses anymore, its exact origin unplaceable by anyone who encounters it, can surface in any book, any era, any ocean the series reaches, always slightly wrong for its current setting, always slightly older than anyone around it can account for. It is rarely explained in the moment it appears. Characters who carry *Barang* (spirit-potent objects, in the Magic System vocabulary above) may sense it means *something* without knowing what; scholars may misdate it; a piece may resurface generations after another book's piece went missing, changed hands, or was buried with someone. The pattern is the payoff, not any single appearance, a reader who has followed the series long enough starts to recognize the shape of it before a character does.
Book 3.3 seeds this pillar directly: Angin's own jade amulet (see *The Nakhoda* tab, and the Ledger's Sacred/Supernatural Legitimacy category) is not a one-off mystery object invented for this book alone, it is this series-wide pillar's first planted instance, "one of a scattered handful known across the archipelago," exactly as a lingling-o would have been described by anyone who actually encountered one in antiquity.

#### Migration Starter Packs

Every real Austronesian migration wave, however many centuries or oceans apart, tended to travel with roughly the same kit. Historically: outrigger and catamaran canoe technology; a core crop set, taro, yam, breadfruit, banana, coconut; domesticated pig, chicken, and dog; tattooing; betel-nut chewing; and, riding along beneath all of it, the language and cosmology that would eventually fragment into the Lexicon and Anitism above. Wherever the wave landed, Madagascar, Formosa, Rapa Nui, the furthest reach of the Pacific, some version of this same bundle came ashore first, adapted to whatever the new island offered and lacked, but recognizably the same kit every time.
In-story, this is the pillar that lets the series prove kinship through *daily life* rather than through language or artifact, a way of lashing an outrigger, a specific method of fermenting or preserving fish, a tattoo pattern marking a rite of passage, a particular use for coconut fiber, recurring in a book set an ocean and a thousand years away from where the reader first saw it, with no character in either scene aware of the echo. Where Jade Artifacts is one traceable object moving hand to hand, a Starter Pack element is a *practice* that needed no object to survive, it only needed people who kept doing it, which is arguably the more durable form of persistence the whole series is arguing for.

Anno Domini 1500

### The Nusantara & The Spice World

Sultanates, Rajahnates & Trade Winds of the Eastern Seas



## 3.2 The map of 1500 AD: territories, geography, winds

### Territory profiles (the 21 polities shaded on the Atlas)

#### Malacca
- **Scale:** The single wealthiest port-city in the spice world, contemporary estimates from Portuguese sources describe a population in the tens of thousands, with resident merchant communities speaking a reported eighty-odd languages on its waterfront alone.
- **Economy:** An entrepôt economy, not a producer one, Malacca grows almost nothing of value itself. Its wealth comes entirely from taxing and re-selling goods that pass through the Strait: Indian cloth, Chinese porcelain, and Maluku's spices all change hands here before moving on.
- **Trait:** Geography as destiny, the sultanate exists because the Strait narrows here, and every ship threading it either pays Malacca's harbor tax or finds another way around, which in 1500 there mostly isn't.

#### Aceh (seat: Pasai / Aceh)
- **Scale:** Still a rising coastal power in 1500, not yet the regional force it becomes after Ali Mughayat Syah's sultanate consolidates in the following decades.
- **Economy:** Pepper and the Indian Ocean gold trade, North Sumatra's coast sits at the western mouth of the archipelago's spice-and-textile circuit, feeding directly into the Bay of Bengal shipping lanes.
- **Trait:** A pepper port living in Pasai's shadow for now, the older port still dominates the coast's trade, even as the political center of gravity is quietly shifting north toward Aceh.

#### Sunda (seat: Sunda Kalapa)
- **Scale:** A substantial inland-facing Hindu kingdom, its court at Pakuan Pajajaran removed from the coast it depends on for trade, power here runs through a capital most foreign merchants never actually see.
- **Economy:** Pepper grown in the West Javan interior, shipped out through the port of Sunda Kalapa, one of the archipelago's steadier pepper suppliers precisely because it isn't a spice monopoly the way Maluku is.
- **Trait:** An island of the old Hindu-Buddhist order, increasingly hemmed in by Islamic sultanates rising along the rest of Java's north coast on both sides of it.

#### Demak
- **Scale:** A young sultanate, founded only in the 1490s on former Majapahit coastal territory, small in land area but already punching well above its age in trade reach.
- **Economy:** A pivot point rather than a producer, rice and textiles from Java flow east through Demak's ships toward Maluku, and cloves flow back west, with Demak taking a cut at both ends of the run.
- **Trait:** A statement as much as a state, founding an Islamic sultanate on Majapahit's own former ground is Demak's way of declaring which order is rising and which is fading.

#### Majapahit (seat: Majapahit (rump court))
- **Scale:** A rump court, not an empire, what's shaded here is a fraction of the territory the Majapahit name once commanded at its height under Hayam Wuruk two centuries earlier.
- **Economy:** Little of its own, no navy worth mentioning and no coastline that matters, which is precisely the problem: the old mandala's tribute network has mostly moved to the sultanates now holding the actual ports.
- **Trait:** Legitimacy that has outlived its leverage, foreign traders still write home about Majapahit's name decades after the power behind that name relocated to the coast.

#### Bali (seat: Gelgel)
- **Scale:** A stable, self-contained kingdom centered on Gelgel, with influence reaching toward Lombok and Sumbawa, one of the few courts on the map not mid-transition in 1500.
- **Economy:** Rice agriculture and a court economy sustained by trade with Java's shifting coastal powers, including captives taken in Bali's own periodic wars.
- **Trait:** Continuity where everything around it is changing, while Java's courts convert, found, or dissolve, Gelgel simply keeps functioning, which later Balinese chronicles remember as a golden age precisely because it didn't feel like one at the time.

#### Brunei
- **Scale:** An emerging thalassocracy under Bolkiah, reach far out of proportion to Brunei's small home territory, extending tributary influence from northern Borneo to Sulu and parts of Luzon.
- **Economy:** A trading and tribute network built on Brunei's fleet, direct commerce with Ming China, redistributed through vassal datus across a wide arc of the northern archipelago.
- **Trait:** An empire held together by ships and marriages rather than garrisons, Bolkiah's Brunei is a web of obligations radiating from Kota Batu, not a territory with defended borders.

#### Gowa
- **Scale:** One of several competing polities on the South Sulawesi peninsula in 1500, a regional power in the making, not yet the dominant force Makassar becomes a century later.
- **Economy:** Position, more than production, Gowa sits astride feeder routes linking Java's rice and textile trade to the Maluku clove markets further east.
- **Trait:** A foundation being laid before anyone can see the building, Gowa's later 17th-century height as the Makassar sultanate is still generations away, and Islam hasn't even arrived here yet in 1500.

#### Bone
- **Scale:** A Bugis adat-kingdom sharing the South Sulawesi peninsula uneasily with Gowa, smaller and less externally visible than its rival, with the exact 1500 ruler unsettled in accessible chronicles.
- **Economy:** Agrarian and river-trade based, currently expanding north to contest the mouth of the Cenrana River, control of a river mouth here means control of what moves through it.
- **Trait:** A rivalry that will define the region for generations, already visibly under way in 1500 even before either kingdom's later golden age.

#### Ternate
- **Scale:** Tiny in land area, a single volcanic island, and disproportionately powerful because of what grows on it.
- **Economy:** A literal monopoly: cloves grow natively nowhere else on earth. Every spice merchant from Malacca to Lisbon ultimately answers to what Ternate decides to sell and to whom.
- **Trait:** Leverage without size, Al-Mansur doesn't need territory or a large army, only control of the one resource the entire world wants, which is exactly the kind of leverage that eventually invites people unwilling to pay the toll.

#### Tidore
- **Scale:** Ternate's near-mirror in size and standing, the second of Maluku's four kingdoms (Moloku Kie Raha), close enough geographically that the two are in constant, direct competition.
- **Economy:** Cloves, identical in kind to Ternate's, which is exactly why the two sultanates are locked in perpetual rivalry rather than cooperation, they're selling the same thing to the same buyers.
- **Trait:** A rivalry baked into geography, Ternate and Tidore sit close enough to see each other's harbors, competing for the same monopoly good and the same foreign attention.

#### Jailolo
- **Scale:** One of the four Moloku Kie Raha kingdoms, based on Halmahera rather than one of the smaller volcanic islands, geographically larger than Ternate or Tidore but historically the junior partner of the four.
- **Economy:** Cloves and Halmahera's forest products, folded into the same Maluku trading circle as its three sister kingdoms.
- **Trait:** The quieter of Maluku's four courts in most surviving accounts, present in every telling of the clove trade's politics but rarely the one driving events.

#### Bacan
- **Scale:** The southernmost and generally smallest-profile of Maluku's four kingdoms, with a ruling elite that converted to Islam in the closing years of the 15th century.
- **Economy:** Cloves, shared with the rest of the Moloku Kie Raha circle, plus reach south toward the nutmeg-producing Banda Islands that the other three kingdoms touch less directly.
- **Trait:** Part of the same tightly bound four-kingdom system as Ternate, Tidore, and Jailolo, rivals and partners simultaneously, bound together by the same monopoly good they compete over.

#### Sulu (seat: Sulu (Jolo))
- **Scale:** An archipelago sultanate rather than a single-island one, its reach is measured in a scatter of islands and seaways between Borneo and Mindanao, not a solid landmass.
- **Economy:** Pearling and tortoiseshell, a sea-based wealth famous enough that Brunei, far larger, still finds direct trade more useful than absorption.
- **Trait:** Independence maintained by being too useful to conquer, Sulu answers fully to no one, running its own trade line to Manila Bay independent of Brunei's overlapping tributary network.

#### Maguindanao
- **Scale:** Not yet a sultanate at all in 1500, the Pulangi River basin here is governed by the animist brother-chiefs Tabunaway and Mamalu, a polity that in name doesn't exist for another fifteen years.
- **Economy:** River-basin agriculture and local exchange, largely untouched by the Malacca-centered spice economy running through the rest of the map.
- **Trait:** A future entirely unwritten, everything that will define Maguindanao (Shariff Kabungsuwan's arrival, the mass conversion, the centuries-long sultanate) belongs to a story that in 1500 hasn't started.

#### Ayutthaya
- **Scale:** By far the largest territory shaded on this map, a continental kingdom dominant over the entire Chao Phraya river basin, dwarfing every archipelago sultanate in raw land area.
- **Economy:** Rice, tin, and a tributary network reaching down the Malay Peninsula, Ayutthaya's wealth is continental and agrarian where Malacca's is maritime and entrepôt-based.
- **Trait:** Unfinished business given form, Ayutthaya never fully accepted Malacca's independence, and in 1500 King Ramathibodi II acts on that old claim by sending an army south.

#### Patani
- **Scale:** A modest but rising sultanate on the peninsula's east coast, caught geographically between two larger gravities pulling in different directions.
- **Economy:** Coastal trade meeting the Siamese interior's overland routes, Patani is a hinge point between Malacca's maritime network and Ayutthaya's continental one.
- **Trait:** A small state's classic problem, too useful to ignore, too weak to fully resist either Malacca's commercial orbit or Ayutthaya's expanding tributary reach.

#### Jambi
- **Scale:** A modest east-coast Sumatran sultanate, geographically compact but strategically placed as one of Malacca's steadier southern feeder ports.
- **Economy:** Gold and pepper from the Sumatran interior, moving north into Malacca's markets, one of the shorter, more dependable supply lines the greater sultanate relies on.
- **Trait:** A fresh start in a world of mid-reign courts, Orang Kayo Hitam takes the throne in exactly 1500, meaning Jambi's story this year is accession, not the long-running tensions defining most of its neighbors.

#### Pahang (seat: Pahang (Pekan))
- **Scale:** A vassal state on the peninsula's east coast, its formal status as a sultanate belies a chain of command that runs straight back to Malacca.
- **Economy:** Gold from Pahang's interior mines, flowing to Malacca alongside tribute obligations that mark this as a subordinate relationship rather than an equal trading partnership.
- **Trait:** A throne installed by its own overlord, Malacca placed Mansur Shah I here through its own minister, making Pahang's sultan a vassal's vassal in practice even while carrying a sovereign's title.

#### Panduranga (seat: Panduranga (Champa))
- **Scale:** A rump kingdom, not the Champa that once dominated central Vietnam's coast, what survives here is what remained after Đại Việt's 1471 sack of the old capital at Vijaya.
- **Economy:** Sappanwood, aromatic woods, and regional trade goods moving along an old historic corridor now increasingly overshadowed by the powers on either side of it.
- **Trait:** A kingdom in eclipse holding on by inertia, Po Kabih rules a coastline that once commanded far more, in a period when 'surviving' is itself the accomplishment.

#### Wehali
- **Scale:** The paramount kingdom of Timor, not the largest territory in land area, but holding ritual seniority that the island's many smaller chiefdoms still defer to.
- **Economy:** Sandalwood, Timor's great monopoly export, feeding markets that stretch to Chinese incense-makers and, eventually, European cabinet-makers.
- **Trait:** Authority built on ritual seniority rather than military conquest, Wehali's dominance is the kind that persists because neighboring chiefdoms accept it, not because it's been forced on them.

### Monsoons

- **NE Monsoon (roughly Nov–Mar):** Dry-season winds push down out of the north/northeast over the South China Sea, funnel through the Malacca Strait, and curve westerly as they cross the equator into the Java and Banda Seas. Ships ride this to sail from China and the mainland down toward India and the archipelago's south, Malacca fills with fleets timing their departure to it.
- **SW Monsoon (roughly Jun–Sep):** The wind reverses, the same channels now carry air the opposite way, north out of the Java and Banda Seas and back up through the Malacca Strait toward China. Fleets that came down in the dry season ride this to go home; miss the turn and a ship can be stranded a full season waiting for the next one.

### Seas (map labels)

- SELAT MALAKA: Strait of Malacca
- SELAT SUNDA: Sunda Strait
- SELAT MAKASSAR: Makassar Strait
- TELUK SIAM: Gulf of Siam
- LAUT JAWA: Java Sea
- LAUT SULAWESI: Celebes Sea
- LAUT BANDA: Banda Sea
- LAUT SULU: Sulu Sea

### Volcanoes

- **Krakatoa** (-6.1, 105.42): Sits astride the Sunda Strait itself, sailors passing between Sumatra and Java watch it the way sailors everywhere watch a mountain that smokes.
- **Merapi** (-7.54, 110.44): Central Java's most restless peak, close enough to both old Majapahit and rising Demak that neither court can fully ignore it.
- **Gunung Agung** (-8.34, 115.51): Bali's sacred mountain, Gelgel's court orients its whole sense of direction around 'toward the mountain' and 'toward the sea.'
- **Semeru** (-8.11, 112.92): Java's tallest peak, rising over the fading Majapahit heartland, a fittingly immovable backdrop for a court that isn't.
- **Gamalama** (0.79, 127.33): Ternate isn't near a volcano, Ternate IS the volcano. The whole sultanate is a single cone rising out of the clove-scented sea.

### Rivers

- **Musi River**: The river that made Palembang, old Srivijaya's highway to the sea, still carrying pepper and gold downstream to the coast long after the empire that built its fortune around it has faded.
- **Batang Hari**: Jambi's river-road inland, gold and pepper from the Sumatran interior reach the coast, and Malacca's merchants, by way of this current.
- **Chao Phraya**: Siam's spine. Ayutthaya sits upriver from the gulf on purpose, close enough to the sea to trade, far enough inland to be hard to burn.
- **Bengawan Solo**: Java's longest river, threading the old Majapahit heartland, the water that once moved an empire's rice now marks the border of what's left of it.
- **Kapuas River**: Borneo's great western river, forest goods (rattan, resins, birds' nests) move downstream toward the coastal sultanates that broker them onward to China.

### Settlements (unruled towns and villages)

- **Palembang** (South Sumatra, port; -2.99, 104.75): Old Srivijaya's capital, centuries past its imperial peak but still a working river port, pepper and gold still move through it, just for other people's empires now.
- **Barus** (West Sumatra coast, port; 2.03, 98.4): A camphor port so renowned that its name traveled into Arabic and Sanskrit as the word for camphor itself.
- **Pariaman** (West Sumatra coast, port; -0.62, 100.12): A gold- and pepper-shipping point on Sumatra's Indian Ocean coast, facing west toward the ports of India rather than east toward Malacca.
- **Tuban** (Java north coast, port; -6.9, 112.06): A long-established market and shipbuilding town on Java's north coast, where Chinese, Malay, and Javanese traders have mingled for generations.
- **Gresik** (Java north coast, pilgrimage; -7.16, 112.65): A trade town doubling as a seedbed for Java's new faith, early Islamic teachers work the coast from here outward.
- **Banten** (West Java coast, port; -6.06, 106.15): A smaller pepper port in Sunda's territory, quietly positioned to eclipse Sunda Kalapa itself within a generation.
- **Kedah** (Malay Peninsula, port; 6.12, 100.36): An old trading port on the peninsula's west coast, pulled between Malacca's orbit and Siam's reach from the north.
- **Ligor (Nakhon Si Thammarat)** (Malay Peninsula, port; 8.43, 99.96): A Siamese-Malay frontier town, the practical edge of Ayutthaya's claimed authority over the upper peninsula.
- **Makassar** (South Sulawesi coast, port; -5.15, 119.43): A coastal trading settlement growing up beside Gowa's court, not yet the great emporium it will become, but already a name traders know.
- **Ambon** (Central Maluku, port; -3.7, 128.18): A spice-trade anchorage that belongs to none of Maluku's four great sultanates outright, useful ground precisely because no one fully controls it.
- **Bima** (Sumbawa, port; -8.47, 118.72): A sappanwood and horse-trading town on the dry eastern islands, well outside the clove-and-pepper economy driving events further west.
- **Butuan** (Mindanao (Caraga coast), port; 8.95, 125.53): An old gold-trading port with trade ties reaching back to China for centuries, wealthy in a way its small size doesn't suggest.
- **Kutai** (East Borneo, port; -0.4, 117.15): A river-mouth trading town on Borneo's east coast, gathering forest goods from upriver for onward sale to coastal merchants.

### Map margins

Edge labels: HIC SVNT DRACONES; MARE INCOGNITVM; TERRA INCOGNITA; PERICVLVM MARIS. Small sailing-ship and sea-creature decorations fill the empty sea.


## 3.3 Character Sheets (35 sheets)

Grouped as on the Atlas. Placeholder sheets are roles the author has defined but not yet named.

### The Nakhoda

*The one member of this roster who hasn't already climbed the ladder, see The Nakhoda tab.*

#### Angin
*A First Ship's Nakhoda, origins disputed, even by him*

Nobody in the strait agrees on where Angin actually comes from. The Orang Laut crew that fished him half-drowned off a nameless wreck as a boy swear his cradle-tongue wasn't Malay. A Bugis prahu that took him in for two seasons afterward claim he answered instantly to a Makassar war-chant nobody had taught him. Angin himself remembers nothing before the wreck, no mother, no name, no flag that ship sailed under, only water, and then hands pulling him out of it. "Angin" is what the Orang Laut who found him called him, after the wind that was driving the storm that night, the only thing anyone could agree had actually been there. Pulled from the wreck around age seven, roughly 1491; fourteen when the book opens in 1498. In 1500, sixteen years old, he has just won his first ship, a half-repaired kelulus, taken after killing his own captain mid-raid for attempting to rape a captive woman aboard, a Malaccan princess, daughter of Mahmud Shah, being sent as a peace-bride to the Siamese court. He never returns her, for reasons even he doesn't fully untangle, and her non-arrival becomes the unwitting spark of the real 1500 Siamese invasion of Malacca, a truth he never learns and the book never lets him find out. He has never once corrected anyone who guesses at the rest of his story. What almost no one knows: his first assigned kill, ordered by the same Orang Laut crew that raised him, was Tun Perak himself, spared rather than killed, the world told otherwise, minutes after the crew's own raid cost him the closest thing he had to a brother. Publicly he trades; privately, through that same crew, he still raids, opportunistic, small-time, whatever's weak enough to take. He reaches full Nakhoda status at eighteen, in 1502, and Sea Lord status at twenty-seven, in 1511.

- **Domain:** No court, no coastline, a kelulus taken by force, and whatever water he can hold this season
- **Age:** Found ~1491 (age ~7) · 14 in 1498 (book opens) · 16 in 1500 (Siamese invasion) · 18 in 1502 (full Nakhoda) · 27 in 1511 (Sea Lord) · 37 in 1521 (book closes)
- **Signature asset:** A blank where his birth should be, no throne can claim him and no rival can use his family against him, because nobody, including Angin, knows who they'd be
- **Defining trait:** Reads as Orang Laut to the Orang Laut and Bugis to the Bugis, and has long since stopped correcting either, whether that's a survival habit or the plain truth is the one question he's never let anyone follow up on
- **Rivalry:** None chosen yet, every relationship above a deckhand's is still being built or tested in 1500, on a roster where everyone else has already picked a side
- **Signature legend:** Not his own, the wreck he was pulled from as a boy has never been identified, and one or two old hands still swear they recognize her broken figurehead from somewhere they can't quite place
- **Carries:** A jade amulet given to him by a man the world believes he killed, meaning withheld, never explained, never removed
- **Trained by:** A Bugis mentor, now dead, who taught him combat and siri (the Bugis honor/shame code) together during his drifting stretch, the doctrine behind a compass he'd so far only followed by instinct
- **First trusted:** An unremarkable, decent captain gave him the rudder of his kelulus during the same drifting stretch, no ceremony, just the day the captain stopped taking it back. The second man to trust him after the big brother, and the second he lost in short order when that voyage ended, leaving him adrift again just before the mentor's death and the captain who assaulted him
- **Taught the water:** A reclusive Micronesian malim, a former rebel against Nan Madol's Saudeleur dynasty, teaches him reef-reading, star-paths, and monsoon-timing during the same drifting stretch, running alongside the mentor's combat and siri training rather than duplicating it. Outside Cabral's cleanup thread entirely; his fate stays genuinely open
- **Open threat:** Cabral's people are quietly eliminating anyone who was present at the Tun Perak raid, as standard tradecraft, not because anyone suspects Angin lied about the kill, simply because loose ends get cut. Unresolved, live into Act 2/3.
- **The war he doesn't know he started:** Kills his own captain during a raid on a Malaccan diplomatic convoy for attempting to rape a captive princess, Mahmud Shah's own daughter, sent as a peace-bride to Siam, then doesn't return her. Her non-arrival is read by Ayutthaya as a deliberate insult, and becomes the unwitting fictional trigger for the real 1500 Siamese invasion of Malacca. Angin never learns this, and the book never tells him, the single largest secret he carries without knowing he's carrying it.
- **Wives, eventually:** By Act 3, Angin takes multiple wives, not one alliance-marriage but the working government of his Route A patchwork empire. Each governs a scattered holding in his name while he's elsewhere; the harem is his actual institution of rule, not a subplot alongside it. The Malaccan princess becomes his first, resurfacing after Malacca's fall carries no political weight left to exploit. See The Ledger, Marriages and Regional Stewardship
- **By 1502, entire:** The wayfinding of a Micronesian pilot, the combat and code of a Bugis warrior, the shrewdness of a Gujarati trader, and the connections of the Orang Laut, four skill sets, none inherited, all earned from people who owed him nothing and taught him anyway. No single mentor made him; the sum of four did. Each one is proven more than once on the page by 1502, not just claimed: wayfinding through the Brunei run, combat through both the captain's death and a second real fight leading his own crew, trade through the Nina Chatu partnership and the transaction with Tun Perpatih Putih's agent, connections through an Orang Laut warning that pulls his crew clear of a raid gone bad
- **A crew built from the whole archipelago:** By the end of Act 1, Angin's found family is a working cross-section of the Nusantara itself: a Dayak helmsman, a Batak headfighter and bodyguard, a Minangkabau crewmember living out merantau on her own terms, and a Bajau diver for the reef-work no one else aboard can do, alongside the original Orang Laut crew that raised him. No single culture, including his own uncertain one, defines the ship. It runs the same way the era does: on skill and choice, not blood
- **First real reputation:** Fighting in Malacca's defense during the 1500 Siamese invasion, he becomes locally known as the boy who cut down Siamese attackers defending the port, his first reputation with anyone outside his own small, mostly-dead circle, and, unknown to everyone including him, formed in the very war his own hand set in motion. Not yet a name known in three ports, but the first real seed of one
- **Seen once by a legend:** Hang Tuah himself, commanding Malacca's defense during the same 1500 invasion, catches sight of him fighting and files it away without acting on it. Neither of them knows it yet, a seed for a possible Act 2 First Contact, not a relationship yet
- **The Boy ends (Act 1 finale):** At eighteen, running his Brunei trade lane, Angin is handed a small incidental task by Bolkiah's court and completes it competently, but what actually lands is the scale of a real Sea Lord's power and aura up close. No ceremony, no title, per the Ascension ladder's own rule, just the moment he sees exactly how far Nakhoda still is from Sea Lord, and decides, quietly, to climb for it on purpose rather than by accident
- **Double life:** Publicly a pencalang (trader); privately, through the Orang Laut crew that raised him, still a penjajap (raider), the trading front exists chiefly to launder what the raiding side takes
- **The war at sixteen:** The 1500 Siamese invasion of Malacca lands in the same year he wins his first ship and a bendahara's suspicion both, the single most dangerous year of his adolescence, and the one that teaches him, at sixteen, that history itself can be the thing that saves him when nothing else will

### Sea Lords, Players of the Game

*Sultans and rulers who sit at the table in their own right, each running their own team, see The Game tab.*

#### Lapu-Lapu
*Datu of Mactan, Visayas*

The last free chief of the central islands, a man who answers to no rajah and no sultan, only to the sea around Mactan. Where Cebu's rulers have begun courting foreign traders and foreign gods, Lapu-Lapu holds the old ways: his authority comes from the loyalty of his timawa warriors, not from tribute rolls or treaties.

- **Domain:** Mactan Island, Visayas
- **Signature weapon:** Kampilan (single-edged, forked-pommel sword) and a warrior's kalasag shield
- **Defining trait:** Stubborn sovereignty, he treats every foreign sail on the horizon as a test of whether Mactan still belongs to Mactan
- **Rivalry:** A cold, simmering rivalry with the rulers of neighboring Cebu, who favor accommodation with outside powers over resistance
- **Signature legend:** Even before any foreign fleet arrives, he is already known up and down the strait as the datu who has never lost a raid or been made to kneel
- **Carries:** A jade amulet worn since childhood, its match found on a handful of others scattered across the archipelago, its meaning unexplained, its bond unmistakable

#### Bolkiah
*Sultan of Brunei*

The sultan under whom Brunei stops being a regional trading port and becomes an empire. His fleets and his court's wealth reach from the Philippines to the fringes of Java. Brunei under Bolkiah is less a kingdom than a web, vassal datus, tribute routes, and marriage alliances radiating outward from the water-city of Kota Batu.

- **Domain:** Brunei, with tributary reach into northern Borneo, Sulu, and parts of Luzon
- **Signature asset:** Not a weapon but a fleet, Brunei's navy and its merchant convoys are the true instrument of his power
- **Defining trait:** Expansion through marriage and trade agreements as much as conquest, a builder-king, not merely a warrior-king
- **Rivalry:** Contests influence over the Sulu and Luzon datus with the Sulu Sultanate itself
- **Signature legend:** Said to have never lost a war he personally led, and to have expanded Brunei's reach further than any sultan before or after him
- **A quiet suspicion:** Has, for some time, quietly suspected that Tun Perak never actually died in 1498, old trade patterns, an unclaimed stretch of coast near Malacca, rumors too specific to be nothing. Tests a young trader named Angin in Beat 14 partly for this reason; learns nothing conclusive, but doesn't fully let the thread go either

#### Mahmud Shah
*Sultan of Malacca*

The last sultan to rule an undivided Malacca, though he does not yet know that. Malacca grows no spice of its own; its wealth comes from sitting astride the one strait every ship between India and China has to thread, taxing and porting the goods of others rather than producing any of them. In 1500 that toll has made him sovereign of the richest entrepôt in the spice world, inheriting an empire built by his father Muzaffar Shah and the great bendahara Tun Perak. Malacca's wealth is staggering; so is the complacency it's bred in its court.

- **Domain:** Malacca, dominant over the Malay Peninsula and eastern Sumatra
- **Signature asset:** The port of Malacca itself, the single most valuable strait-choke in the known trading world
- **Defining trait:** Inherited grandeur, Mahmud Shah rules an empire he did not have to build, and the story of this era asks whether he can defend what he was given
- **Rivalry:** Uneasy tension with his own court, especially the bendahara's office (Tun Mutahir), and looming pressure from Siam to the north
- **Signature legend:** Malacca's wealth is so famous that merchants say gold flows into the strait the way rivers flow into the sea, a reputation starting to attract dangerous foreign attention

#### Al-Mansur
*Sultan of Ternate*

Ruler of the true heart of the spice trade, Ternate is one of the only places on earth where cloves grow, which makes Al-Mansur's tiny island sultanate disproportionately powerful. Every spice merchant from Malacca to China ultimately answers to what happens on Ternate's shores.

- **Domain:** Ternate and its sphere in Maluku (the Spice Islands)
- **Signature asset:** A monopoly, literal, geographic, on clove production
- **Defining trait:** Quiet, immense leverage. He doesn't need a large territory or a large army; he needs only to control the one thing the whole world wants
- **Rivalry:** The neighboring sultanate of Tidore, locked in perpetual competition for dominance of the spice trade
- **Signature legend:** Foreign traders speak of Ternate the way they speak of legendary treasure, a place everyone wants to reach and few fully understand

#### Sri Baduga Maharaja
*King of Sunda (Pakuan Pajajaran)*

The Hindu king of West Java, reigning over a kingdom increasingly surrounded by rising Islamic sultanates (Demak, Cirebon) on his own island. His reign (1482–1521) is remembered, at least in later memory, as an age of peace and prosperity, but it's peace bought under mounting pressure.

- **Domain:** Sunda Kingdom, West Java, capital at Pakuan Pajajaran
- **Signature asset:** Control of the pepper trade through the port of Sunda Kalapa
- **Defining trait:** A ruler holding the old Hindu-Sundanese order together while the religious and political map of Java shifts around him
- **Rivalry:** The newly Islamic Demak Sultanate under Raden Patah, expanding at Sunda's expense
- **Signature legend:** His court is remembered afterward as the last great flowering of old Sunda before everything changed

#### Raden Patah
*Founder of the Demak Sultanate*

A new kind of power on Java, where Majapahit represents the fading Hindu-Buddhist old order and Sunda represents its western holdout, Demak under Raden Patah is the rising Islamic force reshaping the island's politics. Founding a sultanate from what was once Majapahit territory is as much a political statement as a religious one.

- **Domain:** Demak, Central Java
- **Signature asset:** Religious and political legitimacy as the standard-bearer of Islam's rise on Java
- **Defining trait:** A founder-king building institutions from nothing, aware that he's creating something that will outlast him, or needs to
- **Rivalry:** Territorial and ideological rivalry with both the fading Majapahit court and the Hindu Sunda Kingdom
- **Signature legend:** Said by later chroniclers to be of Majapahit royal blood himself, making his rise as much a succession as a rebellion

#### Udara
*Ruler of the Majapahit rump court, Daha (Kediri)*

The general who made himself king. Udara stormed Trowulan for Girindrawardhana in 1478 and, when Girindrawardhana died in 1489, took the throne himself rather than see it pass to a weaker claimant, an unusual break from bloodline succession in a court that still calls itself the heir of Hayam Wuruk's empire. In 1500 he presides over what is left of Majapahit's name: a court at Daha with no navy, no coastline of consequence, and a religion, Hindu-Buddhist orthodoxy, that is being politely, and then not so politely, displaced on every side.

- **Domain:** The Majapahit rump court at Daha, in the Kediri interior of East Java
- **Signature asset:** Legitimacy without leverage, the Majapahit name still commands ritual deference, even as the sultanates now hold the ports, the trade, and the soldiers
- **Defining trait:** A soldier who became a king by conquest rather than blood, ruling a court whose entire claim to authority rests on the idea that blood is what legitimizes a throne
- **Rivalry:** Demak under Raden Patah, who claims descent from Majapahit's own royal line and is absorbing what remains of its coastal territory piece by piece
- **Signature legend:** Chronicles disagree on exactly how he came to rule, general, regent, or usurper, a fittingly unresolved footnote for a kingdom whose ending nobody can quite agree on either

#### Dalem Waturenggong
*King of Bali (Gelgel dynasty)*

Roughly a decade into a reign that Balinese chronicles will eventually remember as the island's golden age, a long, stable rule (traditional dating places its start around 1460) that later generations look back on the way Malacca's own courtiers look back on Tun Perak's era. In 1500 that legendary status is still being built rather than already secured: he is simply the King of Bali, ruling from Gelgel while the Hindu-Buddhist order he represents holds firm on his island even as it erodes on Java just across the strait.

- **Domain:** The Gelgel Kingdom, Bali, with expanding influence toward Lombok and Sumbawa
- **Signature asset:** A stable, prosperous court at a moment when nearly every neighboring polity is mid-transition, religiously, politically, or both
- **Defining trait:** Continuity as strength, where Java's courts are being founded, converted, or hollowed out around him, Waturenggong simply keeps Bali's old order working
- **Rivalry:** No sharp rivalry recorded for 1500 itself, though Bali's raiding and trading relationship with Java's shifting courts (Demak among them) keeps the border never fully settled
- **Signature legend:** Later Balinese chronicles remember his reign as the high-water mark of literature, religion, and court culture the island would spend centuries trying to recapture

#### Syarif Hidayatullah
*Founder-ruler of Cirebon*

A court not yet fully independent, not yet fully absorbed, Cirebon in 1500 sits in the same current as Demak, part of the same wave of Islamic courts rising along Java's north coast, but with its own founder and its own claim to religious authority. Syarif Hidayatullah is remembered in later tradition as one of the Wali Sanga, the nine saints credited with spreading Islam across Java, which makes his rule as much a religious mission as a political one.

- **Domain:** Cirebon, on Java's north coast between Sunda and Demak's sphere
- **Signature asset:** Religious authority that travels ahead of political power, his reputation as a teacher and holy man opens doors his small territory alone would not
- **Defining trait:** A ruler operating on two registers at once, court politics and religious mission, in a period when the two are barely separable on Java's coast
- **Rivalry:** Caught geographically between the Hindu Sunda Kingdom to the west and the rising Demak Sultanate to the east, Cirebon's independence is real but narrow
- **Signature legend:** Later tradition folds him into the Wali Sanga, the nine saints of Javanese Islam, a status that, in 1500, is only beginning to attach to his name

#### Tumapaqrisiq Kallonna
*Ruler of Gowa, South Sulawesi*

An early figure in Gowa's long climb toward becoming, a century later, the dominant power of eastern Indonesia under the Makassar sultanate. In 1500 that future is not yet written, Gowa is one of several competing polities in South Sulawesi, sharing the peninsula uneasily with Bone, and Islam has not yet arrived to reshape the kingdom's identity the way it will in the early 1600s.

- **Domain:** Gowa, South Sulawesi, contesting regional primacy with neighboring Bone
- **Signature asset:** Position astride the Makassar Strait feeder routes linking Java's rice and textile trade to the clove markets of Maluku
- **Defining trait:** A ruler building toward regional dominance a century before Gowa's Islamic sultanate reaches its own golden age, the foundation, not yet the edifice
- **Rivalry:** The neighboring kingdom of Bone, the other major power of the South Sulawesi peninsula, in a rivalry that will define the region for generations
- **Signature legend:** Remembered chiefly as a forerunner, the name later Makassar chronicles reach back to when tracing the kingdom's rise to its 17th-century height

#### Orang Kayo Hitam
*Sultan of Jambi (took the throne in 1500)*

The newest ruler on the entire roster, he takes Jambi's throne in exactly 1500 and will hold it for fifteen years. Where other courts on the map are mid-reign, Jambi's story is starting fresh this very year, on the east coast of Sumatra, in the gold and pepper country that feeds Malacca's markets from the south.

- **Domain:** Jambi, east coast of Sumatra, a steady supplier of gold and pepper into Malacca's trade network
- **Signature asset:** The legendary keris Siginjai, a weapon whose story is already bound up with his own by the time he takes the throne
- **Defining trait:** A reputation for courage that precedes his reign, he arrives at the throne already known for it, rather than needing to prove it once crowned
- **Rivalry:** None sharply recorded for 1500, his story this year is accession, not conflict, though Jambi's position keeps it perpetually in Malacca's economic orbit
- **Signature legend:** The keris Siginjai remains associated with his name in Jambi's memory long after his fifteen-year reign ends

#### Bayanullah
*Sultan of Sulu*

Ruler of an archipelago sultanate whose wealth comes from the sea rather than the land, Sulu's pearling grounds are already famous enough that Brunei, far larger and far more powerful, still finds it worth trading directly rather than simply absorbing the smaller sultanate outright. Sulu answers fully to no one, threading its own trade lines to Manila Bay independent of Brunei's overlapping tributary network.

- **Domain:** Sulu (Jolo) and the Sulu Archipelago, between Borneo and Mindanao
- **Signature asset:** Sulu's pearling grounds and tortoiseshell trade, valuable enough to draw merchants past larger, closer powers
- **Defining trait:** Independence maintained through trade leverage rather than military strength, Sulu stays its own sultanate by being too useful to conquer
- **Rivalry:** An uneasy overlap of interest with Brunei under Bolkiah, whose tributary reach touches Sulu's waters without fully absorbing them
- **Signature legend:** Sulu pearls are already known in Chinese and Bruneian courts alike, a small sultanate's name carried much further than its size would suggest

#### Po Kabih
*Ruler of Panduranga, surviving rump of Champa (r. 1494–1530)*

What's left of Champa after Đại Việt sacked Vijaya, the old capital, in 1471, a coastline that once commanded far more of central Vietnam, reduced now to the southern remnant at Panduranga. Po Kabih has held that remnant since 1494, ruling a kingdom whose entire political character in 1500 is defined by survival rather than ambition: not expanding, not contesting, simply enduring on a stretch of coast that both larger neighbors have so far found more useful intact than absorbed.

- **Domain:** Panduranga, the rump of Champa, a fraction of the coastline the old kingdom once held
- **Signature asset:** Inertia itself, Panduranga persists less through strength than because neither Đại Việt nor its other neighbors have yet found reason to finish what 1471 started
- **Defining trait:** A kingdom in eclipse holding on by sheer persistence, in a period when merely surviving is itself the accomplishment
- **Rivalry:** Đại Việt's shadow, decades old and unresolved, the power that broke Vijaya in 1471 remains the standing threat Panduranga has never stopped living under
- **Signature legend:** None yet made, Po Kabih's reign is remembered, when it's remembered at all, for what it didn't lose rather than for anything it won

### Vassals & Officers

*Admirals, ministers, and subordinate rulers who serve a Sea Lord's team rather than running one of their own, powerful, but pieces on someone else's board.*

#### Tun Mutahir
*Bendahara (Chief Minister) of Malacca, installed 1500* · Team: Mahmud Shah

The newest man to hold the second most powerful office in Malacca, stepping into shoes vacated by the legendary Tun Perak. Where Tun Perak was a warrior-statesman who built the empire through conquest and alliance, Tun Mutahir inherits a court thick with rivals, palace factions, and old loyalties he did not personally earn.

- **Domain:** Malacca court and administration
- **Signature asset:** Command of the bureaucracy and the merchant-tax apparatus that funds Malacca's wealth
- **Defining trait:** A political survivor navigating a court where the old guard's loyalty was to Tun Perak, not to him
- **Rivalry:** Court factions skeptical of an outsider filling Tun Perak's role; potential friction with Sultan Mahmud Shah himself over the true center of power in Malacca
- **Signature legend:** Whispers already circulate that his rise was too fast, too convenient, the kind of talk that ages badly in royal courts

#### Hang Tuah
*Laksamana (Admiral) of Malacca* · Team: Mahmud Shah

The oldest living legend in Malacca's court, born around 1431, he is roughly seventy years old in 1500 and has already served under four sultans. Where younger courtiers scheme for advantage, Hang Tuah's authority comes from having simply outlasted everyone else's claim to loyalty. He has seen Malacca's rise firsthand and, though he doesn't know it yet, will live to see its fall to the Portuguese in 1511.

- **Domain:** Malacca's navy and court, serving the Sultan directly
- **Signature weapon:** The keris Taming Sari, said to be unbeatable in single combat
- **Defining trait:** Unshakeable loyalty to the throne itself, regardless of who sits on it, a living embodiment of Malacca's continuity
- **Rivalry:** His old bond with fellow warrior Hang Jebat ended in tragedy years ago; he carries that history quietly
- **Signature legend:** Foreign envoys are told his name before they're told the Sultan's, he is Malacca's memory as much as its sword
- **Crosses paths with Angin:** Commanding Malacca's defense in person during the 1500 Siamese invasion, he catches sight of a sixteen-year-old fighting with a discipline no untrained raider should have, and says nothing, files it away. Neither of them treats it as a meeting at the time; a possible seed for a real First Contact in Act 2, not yet a relationship

#### Gurabesi
*War Chief of Biak, servant of Tidore* · Team: Tidore

A legendary Papuan war leader from Biak in West New Guinea, Gurabesi built his reputation defeating the Sawai people in the waters around Raja Ampat before offering his sword to the Sultanate of Tidore. Around 1500, under Sultan Jamaluddin's court, his alliance becomes the bridge between the Malayo-Islamic sultanates of Maluku and the Papuan world further east, a partnership sealed, as the old stories tell it, by marriage to a Tidore princess.

- **Domain:** Waigeo and the Raja Ampat Islands, in service to Tidore
- **Signature asset:** Command of Biak's seafaring warriors and deep knowledge of the eastern waters beyond Maluku
- **Defining trait:** A bridge-builder between two very different worlds, Papuan Waigeo and the Islamic court of Tidore, through cunning as much as combat
- **Rivalry:** Old hostility with the Sawai people of southeastern Halmahera, won through strategy rather than open battle
- **Signature legend:** Said to have taken a Sawai fortress by poisoning their watchdogs in the night, a story still told for its cunning, not its brutality

#### Mansur Shah I of Pahang
*Sultan of Pahang, joint ruler since 1495* · Team: Mahmud Shah

Placed on Pahang's throne as a boy after his father Ahmad Shah I abdicated in 1495, Mansur Shah I in 1500 is still five years short of ruling in his own right, real authority rests with his uncle and co-ruler, Sultan Abdul Jamil Shah, who will hold the reins until his death in 1512. Pahang itself answers to Malacca, which installed Mansur on the throne through its own minister in the first place, making him a vassal's vassal in practice even while he carries the title of sultan.

- **Domain:** Pahang, a Malaccan vassal state on the peninsula's east coast, ruled jointly with his uncle
- **Signature asset:** Blood ties to Malacca's ruling house on both sides, the throne he sits on and the overlordship above it both trace back to the same royal line
- **Defining trait:** A sultan in name well before he is one in practice, the real decisions in Pahang's court in 1500 are his uncle's to make, not his
- **Rivalry:** None of his own yet, Pahang's position is defined by its subordination to Malacca rather than by any conflict Mansur has personally entered
- **Signature legend:** Later, after Malacca's fall in 1511, Sultan Mahmud Shah will take refuge in Pahang and marry his daughter to Mansur, a turn neither man can see coming in 1500

### Rivals & Mirrors

*Other young nakhoda and warriors climbing toward Sea Lord status across the same 1500–1511 decade, all more likely than Angin to actually be remembered, which is precisely the point. See Central Conflict's Rivals & Mirrors table.*

#### Hang Nadim
*A Fellow Climber, Not Yet Risen, son of Hang Jebat, foster son of Hang Tuah* · Team: Mahmud Shah

By the tradition later chroniclers settle on, the Sejarah Melayu first, the Tuhfat al-Nafis more fully a century after that, Hang Nadim is born into a name split against itself: son of Hang Jebat, the warrior who rose against his own sultan out of loyalty to a wronged friend, and raised after by Hang Tuah, the man who killed him for it. In 1500 he is young, unproven, and carries both inheritances at once with no way to reconcile them. History (such as the later chronicles record it) has him grown into Johor's admiral within two decades, leading raid after raid to retake a Malacca that will, by then, already belong to Portugal. None of that has happened yet. He is, right now, exactly what Angin is, a young man climbing toward the same rungs of the same ladder, a name that isn't settled, except his name is over-determined by two legendary fathers pulling in opposite directions, where Angin's is empty. One of this era's several nakhoda-in-the-making, not Angin's antagonist so much as his mirror: whichever of them the chronicles remember, it likely won't be both.

- **Domain:** None yet, a name, not a territory, and even the name is contested by which chronicle you trust
- **Signature asset:** Two legacies at open war with each other, rebellion and loyalty, both worn at once, neither fully claimed
- **Defining trait:** Unresolved inheritance, where Angin has no story handed to him, Hang Nadim has been handed two incompatible ones
- **Rivalry:** Angin, though neither yet knows it, two young men climbing the same nakhoda's ladder in the same narrow decade, one of whom history will remember and one of whom it won't. His declared fight (against the Portuguese, for a Malacca already lost) is still more than a decade off the roster's present
- **Signature legend:** History remembers him imperfectly and late, the earliest chronicles barely name him; it's the later ones that give him a face. A caution the book can use rather than smooth over: even the figures who ARE remembered are remembered unevenly.

#### Pati Unus
*Crown Prince of Demak, the Photonegative of Angin's Climb* · Team: Raden Patah

Not yet a ruler, not yet a warrior, in 1500 he is simply the son of Raden Patah, growing up in a court that is actively reshaping Java's religious and political map. History remembers him as Pangeran Sabrang Lor, the prince who would one day lead a great naval assault on Portuguese Malacca and die in the attempt. In 1500, none of that has happened yet; he is a child watching his father build something new. He is, in every way Angin isn't, the inverse of the same era's ambition: where Angin has to build a name out of nothing, Pati Unus is handed one before he's old enough to have earned it, and where Angin's story (as it's currently plotted) ends old and forgotten, Pati Unus's ends young, glorious, and remembered. Neither man will ever meet the other and call it rivalry; the mirror is the reader's to see, not theirs.

- **Domain:** None yet, heir to Demak, still a child in his father's court
- **Signature asset:** Proximity to power at the exact moment Demak is being founded, a front-row seat to history before he's old enough to shape it himself
- **Defining trait:** Inherited ambition not yet tested, everything that will define him (the Malacca campaigns, the title Sabrang Lor) is still two decades away
- **Rivalry:** None yet in the political sense, his future campaigns against the Portuguese in Malacca are decades off. The only rivalry that matters here is structural, not personal: Pati Unus climbs by inherited legitimacy where Angin climbs by merit alone, and history keeps the name of the one who was born to it
- **Signature legend:** Later chroniclers will remember him as the prince who sailed a hundred ships against Malacca; in 1500 he is only just learning what Demak is for

#### Ali Mughayat Syah
*Founder of the Future Aceh Sultanate, Rising in Angin's Own Waters*

Not yet a sultan, in 1500 the man who will found Aceh's sultanate and, within a generation, turn it into one of the most powerful Islamic states in the archipelago is still a rising figure in the crowded politics of North Sumatra's coast, where Pasai has long been the dominant pepper port. His eventual founding of Aceh (traditionally dated to 1496–1511, with his full sultanate consolidating in the 1510s) will happen in the same turbulent window as Malacca's fall to the Portuguese, and Aceh will spend the following century positioning itself as the power that could avenge it. He is, in every way that matters to the Ascension, climbing the same ladder Angin climbs, in the same waters, across the same years, the most direct geographic rival on the whole roster, not because either man has chosen the other as an enemy, but because North Sumatra's coast can only hold so many men making themselves out of nothing at once.

- **Domain:** North Sumatra's coast, in the orbit of the older pepper port of Pasai, before Aceh's sultanate is fully consolidated
- **Signature asset:** Proximity to Pasai's pepper wealth and the Indian Ocean trade lanes that make North Sumatra's coast worth ruling in the first place
- **Defining trait:** A founder-in-waiting, everything that will define Aceh as a regional power (its rivalry with the Portuguese, its later reach into the Malay Peninsula) is still ahead of him in 1500
- **Rivalry:** The older, still-dominant pepper port of Pasai, whose position his rising sultanate will eventually eclipse, and, unknowingly, Angin himself: one of them ends up founding a dynasty that outlasts the century, the other ends up with neither throne nor name
- **Signature legend:** Later Acehnese chronicles trace the sultanate's entire founding story back to him, a beginning that, in 1500, has not yet fully happened

#### Shariff Kabungsuwan
*A Name Not Yet Spoken in Mindanao, a Distant Mirror of Angin's Climb*

In 1500 he has not yet left Johor, and the Maguindanao Sultanate he will found does not exist. The Pulangi River basin is governed instead by the brother-chiefs Tabunaway and Mamalu, presiding over a still-animist Mindanao. Roughly fifteen years from now, Kabungsuwan will arrive claiming descent from both a Meccan holy line and the royal house of Malacca, convert Tabunaway's people to Islam, marry into the local nobility, and found a sultanate that will outlast every other polity on this map by centuries. None of that has started yet, but the shape of what's coming is the same shape as Angin's own climb: a man with no fixed seat, making a claim nobody can fully verify, about to build something out of a gap nobody else was watching. Distant from Angin's own gauntlet for most of the book, but their paths do cross by the time Angin's own worldview has matured enough for a real second contact to land, proof the ladder is being climbed simultaneously in more than one corner of the archipelago, arriving at a genuinely different answer to the same pressure.

- **Domain:** None in 1500, Johor, most likely, though the record of his early life is thin even by the standards of founder-legends
- **Signature asset:** A claimed lineage he hasn't yet had occasion to use, descent from a Meccan sharif on one side and Malacca's sultans on the other, the exact combination that will make his eventual arrival persuasive
- **Defining trait:** A future entirely unwritten in 1500, every part of his legend (the river crossing, the brothers' pact, the mass conversion) belongs to a story that hasn't started
- **Rivalry:** None in the personal sense, his eventual rivalry with Mindanao's animist chiefs, resolved through conversion rather than conquest, is still a decade and a half away. The one relationship that does eventually mature is ideological, with Angin himself: conversion and marriage as a theory of lasting legitimacy, set against Angin's unity of shared interest
- **Signature legend:** The Maguindanao tarsila will one day trace an unbroken royal line back to his arrival, a foundation story that, in 1500, hasn't been written because the man it's about hasn't come

### Side Characters

*Merchants, navigators, and other figures whose lives cross the roster's without a throne of their own.*

#### [Placeholder, Angin's Orang Laut "Big Brother"]
*The First Death, Real Kin, Killed Before Angin Ever Reaches Tun Perak*

Not yet named or fully built, a placeholder, to be developed as the outline continues. Orang Laut himself, older and already proven within the same crew that raised Angin, real kin in practice if not blood, the closest thing Angin has to family. Argues against letting Angin join the raid on Tun Perak's vessel, seeing something in the stakes that Angin doesn't yet. Loses that argument, or is overruled, and dies during the raid, killed by Tun Perak's own guards, who prove heavier and more willing to fight than the intelligence promised. His death is the first real cost of the book, landing minutes before Angin is left alone with Tun Perak restrained and the kill now his to finish. Everything that follows, the sparing, the amulet, the life Angin goes on to build, happens in the direct shadow of losing him.

- **Domain:** The same Orang Laut crew that raised Angin, no seat of his own
- **Signature asset:** Whatever proven standing within the crew that Angin himself doesn't have yet, enough to argue, and be listened to, even if not enough to win
- **Defining trait:** TBD, placeholder only; needs a real name, voice, and specific reason for arguing against Angin's inclusion before this can be drafted
- **Rivalry:** None, the opposite of a rival; his death is what the rest of Angin's arc is measured against
- **Signature legend:** None yet, he dies before the book's own historical record could ever notice him

#### [Placeholder, Angin's Bugis Mentor]
*Siri and the Blade, Tun Perak's Man, and a Second Father Who Never Told Him So*

Not yet named or fully built, a placeholder, to be developed as the outline continues. A Bugis warrior or former warrior who takes Angin in during his drifting stretch after the Tun Perak raid, and teaches him two things at once: how to fight, and siri, the Bugis code of honor and shame that governs when a life is owed, when an insult must be answered, and when it must not. What Angin never learns: this isn't chance. The mentor is one of Tun Perak's own old contacts, quietly steered into Angin's path and knowingly tasked with watching over the boy who spared his benefactor's life, a real relationship that began as an assignment. Where the Orang Laut crew raised Angin without ever giving him language for the choice he made sparing Tun Perak, the mentor gives him the doctrine after the fact, turning an instinct into something he can actually reason from. He dies defending Angin when Cabral's people, quietly eliminating anyone tied to the raid or to what remains of Tun Perak's network, come for him, having tracked him as a thread in that network rather than merely a witness. Angin never learns any of this, not the assignment, not the network, not that the man who taught him when a killing is owed died paying a debt that was never really his own to owe.

- **Domain:** No fixed seat, a wandering warrior's life, wherever Angin finds him during the drifting stretch
- **Signature asset:** Siri itself, the one thing he actually has to give, and the one thing he manages to pass on before he's killed for it
- **Defining trait:** TBD, placeholder only; needs a real name, voice, and specific history before this can be drafted
- **Real assignment:** A member of Tun Perak's hidden network, tasked knowingly with watching over Angin, not a chance meeting, though it becomes real affection regardless. Angin never learns this
- **Rivalry:** None personal, killed by Cabral's people as network cleanup, not out of any conflict of his own
- **Signature legend:** None yet, like the big brother, dies before history could ever record him

#### [Placeholder, Angin's Micronesian Malim]
*The Pilot Who Answers to No Port, Star-Paths, and a Rebellion He Never Names*

Not yet named or fully built, a placeholder, to be developed as the outline continues. A reclusive malim, far from home even by the standards of a world full of resident foreigners: Micronesian, and, by his own rare, unguarded admissions, once part of a failed uprising against the Saudeleur dynasty of Nan Madol on Pohnpei, an ocean and more away from the Nusantara. What exactly happened to the rebellion, and why he can never go home, is left deliberately unspoken, the same way Bawan's corruption and the mentor's full history stay close to the chest, a detail or two let slip, never a full account. He takes almost no work and answers to no syahbandar, until Angin, the rare deckhand who doesn't laugh at an old foreigner's superstitions about water that 'doesn't hold still', earns, almost by accident, what the malim has stopped offering anyone: real teaching. Reef-reading, star-paths, monsoon-timing, the doctrine behind seamanship Angin has so far only picked up by watching. Runs alongside the Bugis mentor's combat and siri training rather than replacing it, and stays outside Cabral's cleanup thread entirely, not raid-involved, and so, unlike the mentor, not fated to die for Angin's sake. **Locked:** once he judges Angin's own wayfinding sound, he chooses to go home, the pull of Pohnpei outlasting even the risk of return, after so many years away. A clean, warm resolution among Act 1's father-figure relationships.

- **Domain:** No fixed seat, a pilot's life, taking work rarely and only on his own terms
- **Signature asset:** Star-path and reef knowledge that took a lifetime and an ocean crossing to accumulate, and that he has refused to sell to any court since arriving
- **Defining trait:** TBD, placeholder only; needs a real name, voice, and a decision on how much of his past he ever actually says aloud
- **Origin:** A former rebel against the Saudeleur dynasty of Nan Madol, Pohnpei, fled across the ocean after the uprising failed; the specifics deliberately withheld from the reader as well as from Angin
- **Rivalry:** None chosen, his distrust runs toward centralized power in general, a quiet echo of the rebellion, rather than toward any single person on the roster
- **Signature legend:** None yet, his real legend, if he has one, belongs to a rebellion three thousand miles from any port on this roster's map, and nobody here has ever heard of it
- **Mirror to Angin:** A man with a past he can't afford to reveal, teaching a man with no past to reveal at all, the resonance is never stated outright by either of them
- **Ending:** Locked: goes home to Pohnpei once his teaching is done. Doesn't die, doesn't simply vanish from the narrative, a deliberate, warm departure

#### [Placeholder, The Malaccan Princess]
*A Peace-Bride Who Chose Not to Arrive, Angin's First Wife, Nine Years Later*

Not yet named or fully built, a placeholder, to be developed as the outline continues. A daughter of Mahmud Shah of Malacca, sent in 1500 as a peace-bride to the Siamese court to head off the war that comes anyway. Taken as cargo-adjacent in a raid Angin's own captain leads, she's saved from that captain's attempt to rape her when Angin kills him and takes his boat, Angin's real First Ship, and his first fully chosen kill. **Locked reason she isn't returned:** she asks him not to, plainly refuses the marriage and the court that was ready to spend her on a peace deal, and asks Angin to let her go rather than hand her back. He respects it, already carrying the mentor's siri doctrine about honoring what's asked of him. Her non-arrival is read by Ayutthaya as deliberate insult rather than accident, and becomes the book's fictional trigger for the real, historically documented 1500 Siamese invasion of Malacca. Neither of them learns the connection at the time. She survives independently through the years that follow, deliberately unaccounted-for by any court, neither returned home nor married off elsewhere, her own choice from the very start rather than a fate that simply happened to her, and resurfaces in Act 3, after Malacca has already fallen and her father's court no longer holds real power. She becomes Angin's first wife, but the marriage carries none of the political weight it would have carried in 1500; whatever draws them back together by then is personal, not dynastic. Placed near the Albuquerque temptation late in Act 3: the same stretch of the book where Angin refuses a seat in the new imperial order is where he learns, or nearly learns, that the old order's collapse traces back to a choice he made as a sixteen-year-old and never understood.

- **Domain:** None at the time of the raid, cargo-adjacent, a bride in transit. By Act 3, Angin's first wife under the Regional Stewardship system, governing a holding of her own in his name
- **Signature asset:** Survival on her own terms through nine unaccounted-for years, neither a rescued princess nor a political pawn returned to circulation, but someone who made herself unfindable by any court on either side of the war her disappearance triggered
- **Defining trait:** TBD, placeholder only; needs a real name, voice, and a specific account of how she spent 1500–1511 before this can be drafted
- **The refusal:** Locked: she is the one who chooses not to return, asking Angin directly rather than leaving the decision ambiguously his. A real act of agency at sixteen or so, not something that simply happens to her
- **Rivalry:** None chosen, her real antagonist, if she has one, is the political machinery that tried to use her as currency in 1500 and never fully stopped looking, quietly, for where she went
- **Signature legend:** None yet, and possibly none ever, like Angin, her real story (a war that traces back to her) is one almost nobody alive could actually piece together
- **The unspoken thread:** Does she ever learn Angin caused the war that upended her life? Does he? Genuinely open, the reunion could be built around one, both, or neither of them ever fully knowing, and that choice significantly changes what Act 3 does with her

#### [Placeholder, Angin's Dayak Helmsman]
*The First Rudder, and the Last, a Scout Who Comes Back*

Not yet named or fully built, a placeholder, to be developed as the outline continues. A Dayak scout from interior Borneo, headhunter-trained, river-and-jungle competence turned toward reef and current, a long way from his own longhouse, for reasons never fully explained. The first to give Angin real trust rather than a test: hands him the rudder of a kelulus during the drifting stretch, open water first, then the strait, then at night, no ceremony, exactly as the Ascension ladder's own text describes the Helmsman rung. Recognizes something of his own displacement in Angin rather than testing him the way most captains would. Pulled away for a stretch by his own unexplained business shortly before the mentor's death, leaving Angin doubly adrift, but returns for good once Angin has his own hull, stepping into permanent helmsman aboard the same ship he once taught Angin to steer.

- **Domain:** No fixed seat, interior Borneo by birth, the water by choice, for reasons he doesn't explain
- **Signature asset:** Reef and current reading translated from a lifetime of river and jungle competence, the same instinct for terrain, applied to a different terrain entirely
- **Defining trait:** TBD, placeholder only; needs a real name, voice, and a decision on what pulled him away from his longhouse and what pulled him back to Angin
- **Rivalry:** None chosen, whatever conflict shaped his own past stays with his own people, off the page
- **Signature legend:** None yet, his real reputation, if he has one, belongs to a longhouse this roster never visits
- **Role aboard:** Helmsman, permanently, once he rejoins, the literal hands on the rudder for the rest of the book, unless the outline changes

#### [Placeholder, Angin's Batak Headfighter]
*The Bodyguard No One Tests Twice*

Not yet named or fully built, a placeholder, to be developed as the outline continues. From the Batak highlands of interior North Sumatra, outside both Islamic and Hindu-Buddhist reach in 1500, a people with a real, historically documented tradition of ritual, judicial execution-by-consumption, which travels with him as reputation whether or not he's ever asked to confirm it. Joins Angin's crew once the Bugis mentor's death leaves a protection gap no one else fills, not a second mentor, no doctrine or siri, just total, blunt loyalty and a level of violence rival crews think twice about provoking. Becomes Angin's permanent headfighter and bodyguard from the raiding stretch onward. What he actually believes, wants, or is running from is deliberately left closer to the chest than most of the crew, the least explained member of the found family by design.

- **Domain:** No fixed seat, Batak highlands by birth, Angin's crew by choice
- **Signature asset:** A reputation that does the fighting before the fighting starts, most crews who know what's said about Batak tradition don't test him twice
- **Defining trait:** TBD, placeholder only; needs a real name, voice, and a decision on how much (if anything) he ever confirms about what's said of his people
- **Rivalry:** None chosen, his loyalty is to Angin specifically, not to any cause or grudge of his own that's been built out yet
- **Signature legend:** Whatever's said about him in the ports he's worked, deliberately left as rumor rather than confirmed fact, even to the reader
- **Role aboard:** Headfighter and bodyguard, permanently, from Beat 10a onward

#### [Placeholder, Angin's Minangkabau Crewmember]
*Merantau, Making Her Own Name, On Her Own Terms*

Not yet named or fully built, a placeholder, to be developed as the outline continues. A young woman from the Minangkabau highlands of West Sumatra, living out *merantau*, the real Minangkabau tradition of deliberately leaving home to make a name and a fortune before any claim to return with honor. Where Angin's rootlessness was forced on him by a wreck he doesn't remember, hers is chosen: Minangkabau inheritance runs matrilineal, so she isn't needed at home the way a son would be, which makes her departure a freedom rather than an exile. Joins Angin's crew during the raiding/trading buildup stretch, and becomes, in practice, the one person aboard who actually understands the shape of his ambition on its own terms rather than just following it, sharp, unsentimental, and climbing for herself even while nominally serving him.

- **Domain:** No fixed seat, West Sumatran highlands by birth, the sea by deliberate choice, not displacement
- **Signature asset:** A clarity about ambition nobody else aboard has, she left home on purpose, to become someone on purpose, and reads Angin's own climb more accurately for it
- **Defining trait:** TBD, placeholder only; needs a real name, voice, and a decision on what she's actually chasing for herself, distinct from Angin's own goals
- **Rivalry:** None chosen yet, open to becoming a genuine parallel climber in her own right rather than only crew, if the outline wants that later
- **Signature legend:** None yet, hers is still being built, on her own terms, the same as Angin's
- **Role aboard:** Joins during the raiding/trading buildup (Beat 10b), exact function (navigator, negotiator, second-in-command) still open

#### [Placeholder, Angin's Bajau Crewmember]
*The Diver, a Second Voice From the Water*

Not yet named or fully built, a placeholder, to be developed as the outline continues. From the Bajau (Sama-Bajau) people, sea nomads distinct from Angin's own Orang Laut upbringing and concentrated further toward Sulu and Sulawesi waters, free-diving and boat-dwelling traditions built for work no Malay-tradition sailor trains for: salvage, hull inspection below the waterline, working a wreck or a shallow passage from underneath rather than above. Picked up running the Brunei trade lane through unfamiliar reef water. Where the malim reads the water from the deck, the Bajau works it from beneath the surface, a second '*belongs to the water, not the land*' voice on the crew, distinct in texture from Angin's own background rather than redundant with it, and a quiet, ongoing reminder that Angin's own Orang Laut identity is only one of several ways a person can belong entirely to the sea.

- **Domain:** No fixed seat, Sulu/Sulawesi waters by tradition, wherever the crew's hull takes him by choice
- **Signature asset:** Free-diving and underwater work no one else aboard can do, salvage and reef-work that opens routes and recovers cargo otherwise lost
- **Defining trait:** TBD, placeholder only; needs a real name, voice, and a decision on how his own people's traditions read against Angin's more Orang-Laut-inflected worldview
- **Rivalry:** None chosen, no conflict built out yet
- **Signature legend:** None yet
- **Role aboard:** Joins during the Brunei run (Beat 11a-i), diver, salvage, underwater work

#### Nina Chatu
*A Young Fence Building Toward Something, the Man Who Knows What Angin Actually Is*

Butterfly Effect flag, same category as Tun Perak's survival: the historical Nina Chatu is a real figure, but a Hindu (Kling) merchant who doesn't emerge as significant until after Malacca falls in 1511, when he helps free Portuguese prisoners and is made the city's administrator under Albuquerque. Everything about his presence here, over a decade earlier and in an entirely different role, is invented, a deliberate divergence, not a retelling of anything on record. In 1498–1500 he is simply young and rising himself, a street-level merchant willing to move goods nobody asks too many questions about. He and Angin build up together, small-time to bigger, over the same stretch that turns Angin's stolen kelulus into a real trading front, Nina Chatu is the fence who launders what the raiding side takes, which means he is also the one person outside the Orang Laut crew who has quietly watched Angin's double life take shape from the very start.

- **Domain:** No fixed seat yet, a street-level merchant's reach, not a court's
- **Signature asset:** A willingness to ask fewer questions than anyone else Angin could sell to, at exactly the moment that's worth more than coin
- **Defining trait:** Building himself up the same way Angin is, through what he's willing to launder, not what he's willing to declare
- **Rivalry:** None yet in the political sense, his real leverage over Angin isn't rivalry, it's proof
- **Signature legend:** Not yet his own, history remembers a very different Nina Chatu, a decade-plus from now and on the other side of Malacca's fall; nothing about that man has happened yet
- **Leverage:** Has personally handled enough of what the raiding side takes to know exactly what Angin's trading front is actually built on, and is, within Act 1, the one who threatens to use it

#### Tun Perpatih Putih
*6th Bendahara of Malacca, a Ceasefire, a Suspicion, and a War That Answers It*

A real historical figure: Tun Perak's own brother, and Malacca's 6th bendahara from 1498 (succeeding Tun Perak in the history this book otherwise follows) until his death in 1500, described by the record as an ineffective, aging chief minister, presiding over rising corruption and Gujarati–Malay factional tension he can't fully control. In this telling, he becomes the court official who almost ends Angin's rise before it starts. Anxious to avoid provoking Ayutthaya into open war Malacca's weakened court can't afford, he orders a ceasefire policy toward Siam, and when word reaches him that an unlicensed raider has been hitting Siamese shipping, undermining exactly that policy, Angin becomes his prime suspect, the accusation of treason all but spoken. He never gets to act on it. Ramathibodi II's fleet arrives in 1500 regardless, and Tun Perpatih Putih dies in the attack he tried to prevent, his actual cause of death left unspecified by the historical record, the same kind of gap the book already uses for Tun Perak. Tun Mutahir succeeds him within the same year.

- **Domain:** Bendahara of Malacca (1498–1500), chief minister, second in court authority only to the sultan
- **Signature asset:** The office itself, inherited from his brother, though the book, like the historical record, treats him as holding the title without Tun Perak's real command of it
- **Defining trait:** A cautious, anxious administrator, trying to hold a fraying court together by avoiding war rather than by commanding respect
- **Rivalry:** Suspects Angin of treason, provoking Siam through unlicensed raiding, in direct defiance of his ceasefire policy
- **Signature legend:** Dies in the actual 1500 Siamese invasion of Malacca, historically undocumented in cause, the accusation against Angin dies with him, unresolved rather than disproven

#### Tun Perak
*Officially Dead, the Kingmaker's Second, Secret War*

Historically, Malacca's fifth and most famous bendahara, dead by 1498 in the chronology this book otherwise follows. In this telling, he's alive in 1498, and has been living a double life for longer than anyone around him suspects. Tun Perak had, in secret, been in contact with Siamese intelligence, not out of disloyalty to Malacca so much as an old kingmaker's private, unauthorized attempt to manage a threat (Ayutthaya) he judged Malacca's own court too complacent to take seriously. It's that secret contact, not simple bad luck, that puts unexpectedly heavy guards on his vessel the night Angin's raiding crew (sent, unknowingly, by Cabral) tries to kill him, Siamese-sourced intelligence about the coming hit reached him first. The raid that should have been a clean, quiet kill instead turns into real fighting, and costs Angin's crew a death, because the man they came for already knew more than anyone assumed a spy network's target should. Angin spares him anyway, in the raid's immediate aftermath, and Tun Perak, rather than reclaiming his seat, lets the world believe him dead. Not peaceful retirement, but fear and genuine regret: an old man who let a private war against one threat (Siam) blind him to how badly it could cost the people around him, and who now uses his own presumed death as cover to keep working, quietly, against what he now judges the truly existential danger, Cabral, and the Portuguese intelligence and military apparatus moving into the region years ahead of their fleet's actual arrival. He is, in effect, running a second secret war under everyone's nose, including Angin's, using a scattered, informal network of old contacts and favors, the Bugis mentor among them, to gather what Malacca's own complacent court refuses to take seriously. He is old, and knows he's running out of time to finish what he's started.

- **Domain:** None on record, presumed dead. In practice, a hidden network of old contacts, debts, and favors spanning ports Malacca's own court no longer thinks to watch
- **Signature asset:** Decades of accumulated relationships and intelligence-gathering instinct that outlast his official career entirely, the same skill that built Malacca's dominance now spent in secret against a threat the court can't see coming
- **Defining trait:** Guilt-driven persistence, a man trying to atone for one costly secret war (the Siam contact that got a boy's brother-figure killed) by fighting a second, more dangerous one (against Cabral and Portugal) before his body gives out
- **The amulet:** Given to Angin at their parting. Its real, functional purpose: a recognition token for Tun Perak's own scattered network, carried, unknowingly, by a boy who has no idea he's holding a spy's signal. Meant to eventually draw Angin into contact with the rest of the network, or be recognized by someone within it, whether or not Tun Perak lives to see it happen
- **The beach across the strait:** Owns, secretly, a small stretch of Sumatran coast directly across from Malacca, the same beach Angin later buys outright with his own trade profit in Beat 11b, unaware it once belonged to the very man who spared his life. Tun Perak leads Angin near this stretch of coast during their parting in Beat 7, without explaining why
- **Network members (known so far):** The Bugis mentor who later trains Angin in combat and siri, part of Tun Perak's informal network, tasked (knowingly, unlike Angin) with quietly keeping an eye on the boy who spared him. His death at Cabral's hands is a real loss to Tun Perak's own effort, not just to Angin
- **What Angin doesn't know:** Any of this. The amulet's true purpose, the mentor's real assignment, the beach's original owner, the existence of a second secret war, all withheld from Angin and, per the Butterfly Effect device, revealed to the reader on the book's own schedule rather than his

### External Powers

*Pressure and customers from outside the Game itself, see The Game tab's "Customers at the Door."*

#### Ramathibodi II
*King of Ayutthaya (Siam)*

Not a Nusantara ruler at all, but the outside pressure the roster can already feel. Crowned in 1491 in his teens, Ramathibodi II inherits a Siam that has never accepted Malacca's independence as final, Malacca was, within living memory, a Siamese tributary before it slipped free and grew rich. In 1500 he does something about it: he sends an army south to bring Malacca back under Ayutthaya's hand.

- **Domain:** Ayutthaya, dominant over the Chao Phraya basin and claiming old tributary right over the upper Malay Peninsula
- **Signature asset:** Siam's standing army and its unrelinquished historical claim on Malacca as a former vassal state
- **Defining trait:** Unfinished business, where Mahmud Shah treats Malacca's independence as settled fact, Ramathibodi II treats it as an open question, and 1500 is the year he acts on that
- **Rivalry:** Sultan Mahmud Shah of Malacca, directly, his 1500 campaign is the clearest act of open aggression anywhere on the roster this year
- **Signature legend:** The invasion fails to retake Malacca outright, but extracts tribute from Malacca and its neighbors anyway, a partial win that keeps the old claim alive rather than closing it

#### Pedro Álvares Cabral
*Portuguese fleet commander, Calicut (Malabar Coast, India)*

Not in the Nusantara at all in 1500, not within a thousand leagues of it, but the closest thing this roster's present has to the shape of what's coming. In September 1500, Cabral's fleet reaches Calicut on India's Malabar Coast and opens the first European trading post anywhere in Asia. It does not go well. Within months the factory is overrun by a mob backed by the resident Arab merchant guild, dozens of his men are killed, and Cabral answers by burning ships in the harbor and bombarding the city itself. None of the roster has heard his name. His ships are still nine years from Malacca's own harbor mouth. But the method has already been demonstrated: trade backed by cannon, and a willingness to burn a city over a broken agreement.

- **Domain:** A single contested factory at Calicut, India, no Nusantara territory or trade route yet
- **Signature asset:** Cannon and the willingness to use them over a trade dispute, a negotiating posture nothing on this roster's own board currently answers with
- **Defining trait:** The Game's own rule made flesh nine years early: not a player competing within the system, but the first sign of a force that intends to rewrite it, see The Game tab's account of what 1511 actually breaks
- **Rivalry:** The Arab merchant guild resident in Calicut, whose alarm at Portuguese trade ambitions boils over into the attack that burns his factory down within the same year
- **Signature legend:** None yet in these waters, but the ships that reach Malacca in 1509, and the fleet that takes it in 1511 under Afonso de Albuquerque, follow the same playbook Cabral is writing in Calicut this very year


## 3.4 Locations

### Locations ranked by narrative weight

- **Tier 1, The Hub** (Where everyone converges): Malacca
- **Tier 2, Centers of Power** (Character home seats, ranked by story weight): Demak, Ternate, Tidore, Waigeo (Raja Ampat), Sunda Kalapa, Cirebon, Majapahit (rump court), Brunei, Sulu (Jolo), Pasai / Aceh, Gowa, Gelgel, Ayutthaya, Jambi, Pahang (Pekan), Cebu, Maguindanao
- **Tier 3, Waypoints** (Passed through, referenced, or acted upon, not yet a home seat): Manila Bay, Bacan, Jailolo, Bone, Patani, Panduranga (Champa), Wehali

### Location pins and their figures

#### Malacca
*Malay Peninsula, capital, islam (2.19, 102.25)*

- **Mahmud Shah**: Sultan of Malacca (r. 1488–1511)
- **Tun Mutahir**: Bendahara (chief minister), 1500–1510
- **Hang Tuah**: aged Laksamana (admiral), living legend of four reigns

#### Pasai / Aceh
*North Sumatra, capital, islam (5.23, 96.05)*

- **Ali Mughayat Syah**: founder of Aceh Sultanate's later rise

#### The Beach Across the Strait
*East Sumatra, opposite Malacca, islam, tier: major (2.35, 102.05)*

- A small, undeveloped stretch of Sumatran coast, directly across the strait from Malacca, secretly owned by **Tun Perak** after his presumed death in 1498, then unknowingly bought outright years later by **Angin** with Brunei-run trade profit. Neither man's ownership overlaps in the record; the connection between them is never on paper anywhere. Geographically the sharpest, quietest foothold on this entire map, in view of the exact chokepoint the whole Central Conflict revolves around, held first by a hidden spy network and then by the boy who never knew he was walking in its founder's footsteps.

#### Sunda Kalapa
*West Java, capital, hindu-buddhist (-6.13, 106.81)*

- **Sri Baduga Maharaja**: King of Sunda

#### Demak
*Central Java, capital, islam (-6.89, 110.64)*

- **Raden Patah**: founder of the Demak Sultanate
- **Pati Unus**: crown prince, a boy of about twelve in 1500

#### Cirebon
*West/Central Java, islam, tier: major (-6.71, 108.55)*

- **Syarif Hidayatullah**: founder-ruler of Cirebon

#### Majapahit (rump court)
*East Java, capital, hindu-buddhist (-7.56, 112.21)*

- **Udara**: ruler at Daha since 1489, holding what remains of Majapahit's name

#### Gelgel
*Bali, capital, hindu-buddhist (-8.58, 115.35)*

- **Dalem Waturenggong**: King of Bali (Gelgel dynasty)

#### Brunei
*NW Borneo, capital, islam (4.94, 114.94)*

- **Bolkiah**: Sultan of Brunei, golden age ruler

#### Gowa
*South Sulawesi, capital, animist-other (-5.2, 119.42)*

- **Tumapaqrisiq Kallonna**: early ruler of Gowa

#### Bone
*South Sulawesi, animist-other, tier: major (-4.53, 120.33)*

- A Bugis adat-kingdom descended from La Umasa and his nephew La Saliu (Kerrépelua), Bone's own ruler-by-ruler chronicle exists but the exact holder of the throne in 1500 isn't settled in accessible sources; the kingdom is in the middle of expanding north to contest the mouth of the Cenrana River with Luwu

#### Ternate
*Maluku (Spice Islands), capital, islam (0.8, 127.38)*

- **Al-Mansur**: Sultan of Ternate, spice-trade power

#### Waigeo (Raja Ampat)
*West New Guinea, animist-other (-0.23, 130.83)*

- **Gurabesi**: Biak war chief, sworn to Tidore's service, bridge between the Papuan and Islamic-Malay worlds

#### Manila Bay
*Luzon, animist-other (14.6, 120.98)*

- Tagalog polities under Bruneian orbit (pre-Rajah Sulayman era)

#### Cebu
*Visayas, animist-other (10.32, 123.9)*

- **Lapu-Lapu**: datu of Mactan, formative years before his 1521 stand

#### Sulu (Jolo)
*Sulu Archipelago, capital, islam (6.05, 121)*

- **Bayanullah**: early Sultan of Sulu

#### Maguindanao
*Mindanao, animist-other (7.22, 124.27)*

- The Pulangi River basin, governed by the brother-chiefs Tabunaway and Mamalu, the Maguindanao Sultanate does not yet exist in 1500; **Shariff Kabungsuwan** will not arrive from Johor to found it and convert Tabunaway's people to Islam for roughly another fifteen years

#### Tidore
*Maluku (Spice Islands), capital, islam (0.68, 127.4)*

- Ternate's fierce rival for control of the clove trade, one of the four great kingdoms of Maluku

#### Jailolo
*Halmahera, Maluku, capital, islam (1.1, 127.48)*

- One of the four kingdoms of Maluku (Moloku Kie Raha), alongside Ternate, Tidore, and Bacan

#### Bacan
*Maluku (Spice Islands), capital, islam (-0.62, 127.52)*

- The fourth of Maluku's great kingdoms; ruling elite converted to Islam in the late 15th century

#### Ayutthaya
*Central Siam (Thailand), capital, animist-other (14.35, 100.58)*

- **Ramathibodi II**: King of Ayutthaya (r. 1491–1529), who sends an army against Malacca this very year

#### Patani
*Malay Peninsula (under Siamese orbit), capital, islam (6.87, 101.25)*

- A rising Islamic sultanate on the peninsula's east coast, caught between Malacca's orbit and Ayutthaya's expanding reach

#### Jambi
*East Sumatra, capital, islam (-1.6, 103.62)*

- **Orang Kayo Hitam**: took the throne of Jambi in exactly 1500, ruling until 1515; renowned for his courage and the legendary keris Siginjai

#### Pahang (Pekan)
*Malay Peninsula, capital, islam (3.48, 103.4)*

- **Mansur Shah I of Pahang**: reigned jointly with his uncle from 1495, a vassal kingdom within Malacca's orbit

#### Panduranga (Champa)
*South-Central Vietnam, capital, hindu-buddhist (11.57, 108.98)*

- **Po Kabih**: ruler of the surviving rump of Champa (r. 1494–1530), holding on in the south after Vietnam crushed the old kingdom in 1471

#### Wehali
*Central Timor, capital, animist-other (-9.3, 124.9)*

- The paramount kingdom of Timor, held ritual seniority over the island's many small chiefdoms and remained dominant into the early 1500s

#### Minangkabau Highlands (Pagaruyung)
*West Sumatra, islam (-0.47, 100.62)*

- Homeland of **Angin's Minangkabau crewmember**, who leaves not out of exile but *merantau*, the real, living Minangkabau tradition of deliberately leaving home to make a name and fortune before any claim to return with honor. Matrilineal inheritance means property and clan descend through women; she isn't needed at home the way a son would be, which makes her departure a freedom rather than a displacement, and a genuinely different flavor of belonging to no one than anyone else on Angin's crew.

#### Batak Highlands (Lake Toba)
*North Sumatra interior, animist-other (2.61, 98.83)*

- Homeland of **Angin's Batak headfighter and bodyguard**: highland interior, outside both Islamic and Hindu-Buddhist reach in 1500. A real, documented tradition of ritual, judicial execution-by-consumption travels with anyone from here as reputation, confirmed or not; other crews across the straits think twice before testing a Batak fighter twice.

#### Dayak Interior (Kapuas Basin)
*West/Central Borneo interior, animist-other (-0.02, 111.47)*

- Homeland of **Angin's Dayak scout and helmsman**: river-and-jungle, headhunter-trained, a long way from his own longhouse for reasons never fully explained. The first person to hand Angin real trust rather than a test, and, after a stretch away, the one who comes back.

#### Bajau Waters (Sulu/Sulawesi margins)
*Sulu & Sulawesi seas, animist-other (5.4, 120.3)*

- No fixed settlement, the working waters of the **Bajau** (Sama-Bajau) people, sea nomads distinct from Angin's own Orang Laut upbringing, with free-diving and boat-dwelling traditions built for reef-work no Malay-tradition sailor trains for. **Angin's Bajau crewmember** joins him running unfamiliar reef water on the Brunei trade lane, salvage and hull-work from beneath the waterline, a second 'belongs to the water, not the land' voice on the crew.


## 3.5 Connections (who is tied to whom)

### Rivalry

- **Lapu-Lapu ↔ Rulers of Cebu**: A cold, simmering rivalry with neighboring Cebu, whose rulers favor accommodating foreign traders and foreign gods over Lapu-Lapu's resistance.
- **Bolkiah ↔ Bayanullah**: Brunei's tributary reach touches Sulu's waters without fully absorbing them, an uneasy contest for influence over the Sulu and Luzon datus.
- **Mahmud Shah ↔ Ramathibodi II**: Siam's 1500 campaign to retake Malacca as a former vassal, the clearest act of open aggression anywhere on the roster this year. The invasion fails outright but extracts tribute anyway.
- **Sri Baduga Maharaja ↔ Raden Patah**: The newly Islamic Demak Sultanate is expanding at Sunda's expense, a territorial and religious rivalry reshaping Java's map.
- **Raden Patah ↔ Udara**: Raden Patah claims descent from Majapahit's own royal line and is absorbing what remains of the rump court's coastal territory piece by piece.
- **Al-Mansur ↔ Sultanate of Tidore**: Ternate and Tidore are locked in perpetual competition for dominance of the clove trade, the defining rivalry of the Spice Islands.
- **Gurabesi ↔ Sawai people of Halmahera**: Old hostility won through cunning rather than open battle, Gurabesi is said to have taken a Sawai fortress by poisoning their watchdogs in the night.
- **Ali Mughayat Syah ↔ Pasai**: The older, still-dominant pepper port his rising sultanate will eventually eclipse, though in 1500 that eclipse hasn't happened yet.
- **Tumapaqrisiq Kallonna ↔ Bone**: The other major power of the South Sulawesi peninsula, a rivalry that will define the region for generations.

### Tension / Friction

- **Mahmud Shah ↔ Tun Mutahir**: Court friction between an inherited sultan and a bendahara who rose too fast for the old guard's comfort, and possibly for the sultan's, too.
- **Raden Patah ↔ Syarif Hidayatullah**: Cirebon sits on Java's north coast between Sunda and Demak's sphere, its independence is real but narrow, squeezed by Demak's rise.
- **Sri Baduga Maharaja ↔ Syarif Hidayatullah**: Cirebon is caught geographically between the Hindu Sunda Kingdom and the rising Demak Sultanate.
- **Dalem Waturenggong ↔ Raden Patah**: No sharp rivalry recorded for 1500 itself, but Bali's raiding and trading relationship with Java's shifting courts, Demak among them, keeps the border never fully settled.
- **Hang Tuah ↔ Hang Jebat (deceased)**: An old bond with a fellow warrior that ended in tragedy years before 1500, Hang Tuah carries that history quietly.
- **Ali Mughayat Syah ↔ Mahmud Shah**: Aceh's pepper trade and Malacca's entrepôt dominance sit in the same northern Sumatra-strait economy without yet being in open conflict, the rivalry that will eventually see Aceh eclipse Pasai runs parallel to, and increasingly at the expense of, Malacca's own reach up the coast.
- **Hang Tuah ↔ Tun Mutahir**: The court's oldest loyalty and its newest office share the same throne to serve but not the same claim to it, Tun Perak's decades of built trust passed to Tun Mutahir in title only, and Hang Tuah, who served under Tun Perak himself, owes the new bendahara nothing he hasn't yet earned.
- **Udara ↔ Sri Baduga Maharaja**: Two Hindu-Buddhist courts holding the old order's line from opposite ends of Java, Majapahit's rump at Daha and Sunda at Pakuan Pajajaran, no war between them, but both feel the same rising Islamic tide from Demak and read each other's survival as a measure of their own.
- **Gurabesi ↔ Al-Mansur**: Gurabesi has never met the Sultan of Ternate, but his sworn service to Tidore means his warriors are, in effect, Al-Mansur's rival's reach extended all the way to Waigeo, a front in the Ternate-Tidore rivalry neither side calls by that name.

### Vassalage, Service & Blood Ties

- **Mahmud Shah ↔ Mansur Shah I of Pahang**: Pahang is a Malaccan vassal state, and Mansur's throne and Mahmud's overlordship both trace to the same royal blood. After Malacca falls in 1511, Mahmud Shah will take refuge in Pahang and marry his daughter to Mansur, a tie neither man can see coming in 1500.
- **Mahmud Shah ↔ Hang Tuah**: Hang Tuah's loyalty is to the throne itself, regardless of who sits on it, Malacca's navy and court answer to the Sultan through him.
- **Gurabesi ↔ Sultanate of Tidore**: Gurabesi's war chiefdom in Waigeo and the Raja Ampat Islands serves Tidore directly, which quietly places him in Al-Mansur of Ternate's rival camp, without the two men ever having met.

### Family

- **Raden Patah ↔ Pati Unus**: Father and son, Pati Unus is Demak's crown prince, still a boy in 1500, decades away from the Malacca campaigns that will make him famous.

### Trade Dependency

- **Mahmud Shah ↔ Orang Kayo Hitam**: Jambi is a steady supplier of gold and pepper into Malacca's trade network, no open conflict, but Jambi's position keeps it perpetually in Malacca's economic orbit.
- **Tumapaqrisiq Kallonna ↔ Al-Mansur**: Gowa sits astride the Makassar Strait feeder route that carries Java's rice and textiles east to Ternate's clove market and cloves back west, neither ruler has met the other, but their two ports are opposite ends of the same trade artery.

### Foreshadowed (not yet in 1500)

- **Shariff Kabungsuwan ↔ Mindanao's animist chiefs (future)**: Not yet arrived in 1500, his eventual rivalry with Mindanao's animist chiefs, resolved through conversion rather than conquest, is still about a decade and a half away.
- **Bolkiah ↔ Shariff Kabungsuwan**: Brunei's tributary reach already touches Mindanao in 1500, years before Kabungsuwan arrives to found Maguindanao, the very Islamic network he'll marry and convert his way into is one Bolkiah's court has already been extending toward the Pulangi basin.


## 3.6 Trade routes of 1500 (24 routes)

Sources cited in the code: Tomé Pires' *Suma Oriental* (1512-15), Ma Huan's Chinese accounts, and standard secondary sources on the Malacca-Maluku-China circuit.

#### Malacca ↔ Aceh / Pasai
- **Cargo:** North Sumatran pepper and gold moving south to Malacca; in return, Indian textiles and Malacca-brokered goods moving north. Pasai is itself a rival pepper port, so this route is as much competition as cooperation.
- **Importance:** Major artery, one of Malacca's primary pepper supply lines, and a route Aceh will eventually turn hostile once its own sultanate consolidates and starts competing for the same buyers.

#### Malacca ↔ Sunda Kalapa
- **Cargo:** West Javan pepper, grown around Sunda's interior, flows out through Sunda Kalapa toward Malacca's markets, one of the routes Portuguese sources will later cite as Malacca's justification for wanting a foothold on Java's coast.
- **Importance:** Strategically loaded, a comparatively modest pepper volume, but the route Portugal's own later sources point to when explaining why Java's north coast mattered enough to fight over.

#### Demak ↔ Ternate
- **Cargo:** Cloves, the whole reason this corridor exists. Demak's ships carry rice, cloth, and Chinese porcelain east; they return with cloves that will be re-sold at enormous markup all the way to Europe.
- **Importance:** A lifeline route, the single longest-distance, highest-value corridor on the map, carrying the one good every buyer from Cairo to Lisbon ultimately wants.

#### Demak ↔ Gowa
- **Cargo:** Javanese rice and textiles for Sulawesi's forest and sea products, a feeder route into the larger Makassar Strait corridor that ultimately reaches the Spice Islands.
- **Importance:** A feeder, not a destination, its real value is as the western half of the longer chain that ends in Maluku's cloves, not in what Gowa itself has to trade.

#### Gowa ↔ Ternate
- **Cargo:** The Makassar Strait leg of the clove trade, Sulawesi traders carrying rice and iron goods east, cloves and nutmeg coming back west toward the Java Sea markets.
- **Importance:** A lifeline route, alongside the Demak–Ternate corridor, this is one of two main arteries carrying cloves out of Maluku at all; lose either and the whole western spice market feels it.

#### Brunei ↔ Sulu
- **Cargo:** Chinese porcelain and silk (Brunei's court trades directly with Ming China) moving south; in return, Sulu sends pearls and tortoiseshell from its famous pearling grounds.
- **Importance:** Steady, not spectacular, a reliable secondary trade line that matters more for what it says about Brunei-Sulu relations than for its raw volume.

#### Brunei ↔ Manila Bay
- **Cargo:** Brunei's tributary reach into Luzon, Chinese goods, textiles, and Bruneian court wares moving north in exchange for gold, beeswax, and forest products from the Luzon interior.
- **Importance:** A long-haul tributary line, less about trade volume than about projecting Brunei's political reach across open water into a region it doesn't directly govern.

#### Sulu ↔ Maguindanao
- **Cargo:** Pearls, tortoiseshell, and birds' nests moving between the Sulu and Moro coasts, a regional exchange feeding into the larger China-bound pearl trade.
- **Importance:** A minor feeder, short-hop volume that matters mainly as the local leg of a much longer chain ending in Chinese markets.

#### Cebu ↔ Maguindanao
- **Cargo:** Visayan gold and slaves for Mindanao goods, a smaller regional circuit, largely untouched by the Malacca-centered spice economy to the west.
- **Importance:** Peripheral to the main spice economy, a self-contained regional circuit that runs on its own logic, mostly invisible to the Malacca-Maluku trade dominating the rest of the map.

#### Bali ↔ Demak
- **Cargo:** Rice and enslaved captives from Bali's wars move north along Java's coast in exchange for cloth and coastal trade goods, a route Gelgel depends on even as Demak's Islamic sultanate rises around it.
- **Importance:** Quietly essential to Bali, a modest volume by the map's standards, but one of Gelgel's few direct commercial links to the fast-changing courts on the Java mainland.

#### Malacca ↔ Bay of Bengal (off-map)
- **Cargo:** The route west toward India, over a thousand Gujarati merchants live in Malacca alone. Indian cotton textiles flow east as the region's de facto currency; pepper, tin, and Southeast Asian spices flow west toward Cambay and beyond.
- **Importance:** A lifeline route, Malacca's single most important connection to the wider Indian Ocean trading world, and the route that makes the sultanate more than a regional power.

#### Malacca ↔ China (off-map)
- **Cargo:** Chinese porcelain, raw silk, and copper cash flow south into every port on this map; Southeast Asian pepper, sandalwood, and spices flow north to China in a trade older than any sultanate currently ruling here.
- **Importance:** A lifeline route, older than every polity on this map and larger in total volume than any single archipelago corridor; every port here is downstream of this one in some way.

#### Manila Bay ↔ China
- **Cargo:** The old Ming tribute-trade route, Luzon gold, beeswax, and forest goods sent north; Chinese porcelain (still dug up across the Philippines centuries later) sent south.
- **Importance:** The Philippines' main artery north, smaller in absolute terms than Malacca's China trade, but the single most important external link for Luzon's Tagalog polities.

#### Sulu ↔ Manila Bay
- **Cargo:** Sulu's own direct pearl-and-tortoiseshell trade line north, run separately from Brunei's overlapping tributary network, a reminder Sulu answers to no one fully.
- **Importance:** Modest in volume, significant in principle, the route exists specifically to bypass Brunei, which tells you more about Sulu's independence than any trade figure would.

#### Malacca ↔ Patani
- **Cargo:** Peninsula coastal trade, textiles and Malacca-brokered goods moving up the coast, met by Patani's own trade with the Siamese interior.
- **Importance:** A minor feeder, steady coastal traffic rather than a high-value corridor, but it keeps Patani inside Malacca's commercial orbit even as Ayutthaya pulls from the other direction.

#### Patani ↔ Ayutthaya
- **Cargo:** Rice, tin, and tribute goods flowing up the Gulf of Thailand toward the Siamese capital, the same corridor Ramathibodi II's invasion fleet uses to move south against Malacca in 1500.
- **Importance:** Dual-use and dangerous, the same water lane carrying tribute goods north in peacetime carries Ayutthaya's invasion fleet south in 1500 itself; trade route and war route are the same line.

#### Malacca ↔ Panduranga (Champa)
- **Cargo:** An old historic corridor east toward Vietnam's coast, sappanwood, aromatic woods, and regional trade goods moving between two ports increasingly overshadowed by the powers around them.
- **Importance:** A fading route, historically significant, currently marginal; both endpoints are polities whose best trading days are behind rather than ahead of them in 1500.

#### Malacca ↔ Jambi
- **Cargo:** Sumatra's east-coast gold and pepper feeding directly into Malacca's markets, one of the shorter, steadier supply lines the sultanate depends on.
- **Importance:** Dependable rather than dramatic, short haul, low risk, and exactly the kind of unglamorous steady supply line a wealthy entrepôt needs far more of than it needs spectacle.

#### Malacca ↔ Pahang
- **Cargo:** Gold from Pahang's interior mines moving to Malacca, alongside tribute obligations that mark Pahang as a vassal state rather than an equal trading partner.
- **Importance:** Tribute dressed as trade, the goods moving on this line are as much an obligation as a market transaction, given Pahang's subordinate status.

#### Brunei ↔ Tidore
- **Cargo:** Brunei's long reach into the Spice Islands, Chinese porcelain and textiles traded directly for cloves, bypassing Malacca's middlemen entirely when Bolkiah's fleets make the run themselves.
- **Importance:** A direct challenge to Malacca's model, every run Bolkiah's fleet makes on this line is trade that never pays Malacca's harbor tax at all.

#### Wehali (Timor) ↔ Bali
- **Cargo:** Sandalwood, Timor's other great monopoly good besides its ritual authority, second in value only to Maluku's cloves and nutmeg among the archipelago's forest exports. Feeds north into the wider Java Sea network from Wehali's ports.
- **Importance:** A quiet monopoly line, far less fought-over than the clove routes to the north, but carrying a good almost as valuable, simply because fewer people are paying attention to Timor yet.

#### Gowa ↔ Sulu
- **Cargo:** A longer Sulawesi–Philippines contact route, forest and sea products moving north, pearls and Sulu goods moving south, linking two trading worlds that otherwise rarely touch.
- **Importance:** A minor feeder in trade terms, but the map's longest single point-to-point contact line, its value is in connecting two worlds that would otherwise barely know of each other.

#### Tidore ↔ Jailolo
- **Cargo:** Short-hop trade between two of Maluku's four kingdoms, cloves, local produce, and the constant low-grade rivalry that comes with sharing a monopoly good.
- **Importance:** Minor in distance, structurally important, one of the short internal links binding the four-kingdom Moloku Kie Raha system together despite its rivalries.

#### Tidore ↔ Bacan
- **Cargo:** The fourth Moloku Kie Raha kingdom's link into the clove trade, smaller in volume than Ternate or Tidore's own output, but part of the same tightly bound Maluku trading circle.
- **Importance:** The smallest volume on the map, but structurally necessary, without it Bacan sits outside the clove circuit its neighbors dominate.


## 3.7 Goods flows (the great commodities)

#### Cloves (monopoly good)
- **Source:** Ternate, Tidore, Motir, Makian, Bacan (Maluku)
- **Port:** Ambon / Ternate → Melaka
- **Route:** Archipelago praus, then long-haul carriers
- **Destination:** Cairo, Venice (via India & Red Sea)
- **Note:** The whole reason Ternate and Tidore matter to anyone outside the Nusantara. No clove tree grows anywhere else on earth in 1500, every hand this passes through, from island grower to Melaka consolidator to Gujarati and Arab carriers to Venetian galleys, marks the price up again.
- **Routes:** Demak ↔ Ternate, Gowa ↔ Ternate, Malacca ↔ Bay of Bengal (off-map)

#### Nutmeg & Mace (monopoly good)
- **Source:** Banda Islands only
- **Port:** Banda's orang kaya federations → Java Sea ports → Melaka
- **Route:** Fragmented at the source (no single ruler to negotiate with)
- **Destination:** Same western chain as cloves, India, Arabia, the Mediterranean
- **Note:** An even narrower monopoly than cloves. Banda has no unified sultan the way Ternate does, competing village federations run the trade, which keeps the islands more independent, and more vulnerable, than their clove-growing neighbors.

#### Pepper
- **Source:** North Sumatra (Pasai), West Java (Sunda), the Malay Peninsula
- **Port:** Pasai, Sunda Kalapa, and other competing ports
- **Route:** Direct to Melaka, or straight to Indian Ocean carriers
- **Destination:** India, the Middle East, and onward to Europe
- **Note:** Grown widely enough that no single port can strangle the supply. This is why pepper ports compete on position and shipping relationships rather than holding a monopoly, volume trade, not scarcity trade.
- **Routes:** Malacca ↔ Aceh / Pasai, Malacca ↔ Sunda Kalapa, Malacca ↔ Jambi

#### Sandalwood (monopoly good)
- **Source:** Timor (Wehali)
- **Port:** Wehali's ports → Bali → Java Sea network
- **Route:** North, largely bound for China rather than the west
- **Destination:** Chinese incense-makers and carvers
- **Note:** Timor's other great monopoly, alongside Wehali's ritual authority. A separate economic zone from the clove/pepper trade, oriented toward China, not Melaka, and quieter simply because fewer outside powers are paying attention to Timor yet.
- **Routes:** Wehali (Timor) ↔ Bali

#### Chinese Porcelain, Silk & Copper Cash
- **Source:** Ming China
- **Port:** Direct Chinese junk calls, or via Melaka
- **Route:** South into every port on the map
- **Destination:** Traded throughout the archipelago for spices, sandalwood, gold
- **Note:** The other direction of the exchange, what China sends south to pay for everything it buys. Older than any sultanate currently ruling in the Nusantara, and larger in total volume than any single archipelago corridor.
- **Routes:** Malacca ↔ China (off-map), Manila Bay ↔ China, Brunei ↔ Sulu, Brunei ↔ Tidore

#### Indian Cotton Textiles
- **Source:** Gujarat and the Coromandel coast, India
- **Port:** Cambay → Melaka (over a thousand resident Gujarati merchants)
- **Route:** Across the Bay of Bengal
- **Destination:** Traded throughout the archipelago, functions almost as currency
- **Note:** So central to archipelago exchange that Indian cloth operates as a de facto medium of trade, not just a good in its own right, buyers across the map want it specifically, which gives it a currency-like liquidity.
- **Routes:** Malacca ↔ Bay of Bengal (off-map)

#### Gold
- **Source:** Sumatra's interior, Pahang (Malay Peninsula), parts of Sulawesi/Borneo, Luzon
- **Port:** Palembang, Jambi, Pahang → Melaka
- **Route:** River, then sea
- **Destination:** Stored as wealth or paid out as tribute; also traded onward to foreign merchants
- **Note:** Moves through the same networks as spices but functions differently, a store of value and tribute good as much as a traded commodity, especially from vassal states like Pahang where the line between trade and obligation blurs.
- **Routes:** Malacca ↔ Jambi, Malacca ↔ Pahang

#### Pearls & Tortoiseshell
- **Source:** Sulu's pearling grounds
- **Port:** Sulu → Brunei or direct to Manila Bay
- **Route:** Sometimes bypassing Brunei's tributary network entirely
- **Destination:** Chinese markets
- **Note:** Sulu runs its own direct trade line specifically to avoid full dependence on Brunei, a small but telling assertion of independence from its larger neighbor.
- **Routes:** Brunei ↔ Sulu, Sulu ↔ Maguindanao, Sulu ↔ Manila Bay


## 3.8 The Codex tabs (full text)


### Tab: Central Conflict

Plot development, Book 3.3
The Spine: Angin's Choice
Working session notes, supersedes the "Malacca will fall" framing below where they conflict
**Important reframe:** nobody in-world knows Malacca's fate, and this is fiction, Malacca falling is *not* predetermined by history in this telling. The tension is real suspense, not dramatic irony, and the mechanism is now locked: see The Butterfly Effect below. The sections below this one (written earlier) still treat 1511 as fixed; keep the worldbuilding/flavor from them but read the outcome as open.

#### Premise

Angin begins as a novice Nakhoda, no origins, no lineage, nothing but skill and merit. He climbs, port by port, deal by deal, fight by fight, until he stands level with the sitting Sea Lords: Bolkiah, Al-Mansur, Mahmud Shah, and the rest. Eventually he surpasses them. The question the book has to answer isn't whether he rises, it's what he does with the power once he has it.

#### The Central Fork

Four external powers, **Portugal (hard/military), China (soft/tributary leverage), India (economic/commercial dominance via Gujarati & Malabar merchant networks), and Arab trade-and-religious networks (religious-commercial integration)**, are all separately maneuvering for control of the spice world. Each uses a different method of pressure, which means Angin needs a different kind of competence to counter each one: naval force against Portugal, diplomatic patience against Ming tribute games, price and credit warfare against Indian merchant houses, and legitimacy/faith politics against Arab-linked networks.
Angin's rise gives him the power to unite the Sea Lords against all four pressures at once. But the same alliance-building that saves the archipelago is also the ladder to **Sea Emperor**: total personal dominion over every other Sea Lord. **The thing that could save them and the thing that could make him their tyrant are the same actions, done for different reasons, indistinguishable from outside his own head.**

#### The Original Question, Refined

Not simply "personal gain vs. collective welfare", sharper than that. If Malacca falls, Angin's own port becomes the natural heir to its trade, wealth, and control over the other Sea Lords. So the live question is:
- Does he let (or help) Malacca fall, inheriting its dominance and becoming the most powerful man in the spice world virtually unopposed?
- Or does he spend everything he's built, fleet, alliances, credibility, possibly his own claim to power, trying to save Malacca and unite the Sea Lords against outside domination, at real risk that it fails anyway and he ends up with neither the throne nor the archipelago intact?
Whether Malacca falls is not fixed. It depends on whether Angin becomes powerful enough, and chooses correctly enough, to counter the combined external pressure. Early Angin literally cannot affect this outcome, the stakes only become real once his own arc has caught up to matter, which lets the power-climax and the moral climax land in the same place.

#### The Power Ladder

Every Nakhoda can become a Sea Lord. Every Sea Lord can become Sea Emperor. This is a structurally open path, not a title unique to Angin, which matters for who else might be climbing it (see Rival/Mirror below).
**Sea Emperor** means establishing an empire in the mold of Srivijaya and Majapahit, but over the *totality* of the Spice World, a scope neither historical predecessor actually achieved. That gap between claim and reality is deliberate: Majapahit's own rump court under Udara, already on the roster, is living proof the claim can outlive the substance. Historically, these thalassocratic empires ran on tribute networks and vassal submission, not standing occupation, so Angin's empire likely functions the same way: vassalage from other Sea Lords, tribute flows, control of the major straits and ports, rather than garrisoned conquest. His climax test is probably not a naval battle so much as whether the other Sea Lords *submit*, and whether that submission is earned (he protected them) or extracted (he'd become too dangerous to refuse).
*Open question: does Angin's empire actually hold the whole archipelago by book's end, or does he claim the title while the reality is messier, echoing Majapahit's own myth-vs-reality problem?*

#### Internal Power vs. External Power

The title Sea Emperor only makes sense once two entirely different kinds of power in this world are told apart, because they behave nothing alike.
**Internal power is fixed.** Ternate and Tidore hold the clove monopoly and always will, cloves grow on exactly those islands and nowhere else on earth, a fact no empire, however vast, can relocate or replicate. This is geography made into leverage. It cannot be conquered away from the archipelago; it can only be traded with, married into, or fought over *locally*. Al-Mansur doesn't need a large kingdom because his power was never going anywhere.
**External power is mobile.** It belongs not to a place but to whoever currently sits astride the route the world's east-west trade is forced to use, and that seat has changed hands for well over a thousand years:

| Era | Who Held the Route | How |
|---|---|---|
| **1st–6th c.** | Funan (Mekong Delta, port of Oc-Eo) | The Strait of Malacca was too pirate-plagued to be a reliable route, so India-China trade instead crossed overland at the narrow Isthmus of Kra. Funan controlled that crossing, not the strait itself, the earliest proof that the chokepoint isn't always a strait; it's wherever the safest crossing happens to be. |
| **7th–13th c.** | Srivijaya (Palembang, Sumatra) | Cleared the Strait of Malacca of the piracy that had made it unusable, and for the first time made the strait itself, not an overland crossing, the route the world's shipping actually used. Six centuries of tolls, provisioning, and harbor order followed, run as a network of ports and loyal vassals rather than a fixed-border state. |
| **13th–15th c.** | Majapahit (East Java), with Srivijaya's fragments (Malayu, then scattered successor courts) absorbed or eclipsed | Java, not Sumatra, becomes the center of gravity as Srivijaya's network unravels, the seat moves without a single decisive conquest, more erosion than battle. |
| **c.1400–1511** | Malacca | Founded by a prince fleeing Palembang under Majapahit's pressure, Malacca deliberately positions itself as Srivijaya's heir, adopts Malay as the language of trade, and by 1500 tolls the same strait Srivijaya once did. The current occupant of a very old chair, not a new invention. |
| **1511 onward** | Contested, unresolved as of the roster's present | Whether Malacca's fall (if it falls) hands the seat to Angin, to Aceh, to the Portuguese, or to no single power at all is exactly the live question this book is built to answer. |

The pattern across every era: the empire changes, the religion changes, the language of the court changes, but the *chair* persists, because the geography forcing every India-China ship through one narrow passage never stops existing. Srivijaya didn't invent the chokepoint. Malacca didn't invent it either. They simply arrived, in turn, at the same seat someone else had been sitting in.
**Sea Emperor, precisely defined, is the title for holding both kinds of power at once**, the fixed internal monopoly *and* the mobile external chokepoint, simultaneously, under one hand. No empire in this succession has actually managed that. Srivijaya and Malacca both held the strait but never the clove islands. Ternate and Tidore hold the cloves but have never held a chokepoint of comparable weight. A Route A patchwork empire assembled from scattered acquisitions, the shape Angin's ascension is already taking, is arguably better suited to eventually holding both than any single-domain sultanate has ever been, since nothing forces his holdings to come from only one side of the ledger.

#### The Ending (locked)

Neither Ending A nor Ending B above. **Angin never reaches Sea Emperor by the realpolitik path this whole ladder describes**, no throne, no submitted Sea Lords, no chair at the chokepoint. He dies a Sea Lord, forgotten and unknown to history. Hang Tuah, Lapu-Lapu, and Gurabesi go on to be the names later chroniclers actually remember; Angin does not. *And yet he wins*, a victory illegible to anyone keeping score across the book's 1498–1521 span, that changes the course of history five hundred years later. Not a hard political event the reader can point to on a timeline, but something thematic and symbolic, one strand the wider Austronesian Saga is building across every book in the series (working label only, not yet defined at the level of a single book's file).
This means the entire Sea Emperor ladder above, internal power, external power, vassalage, submission, was the wrong yardstick all along, and the book gets to let the reader believe it's the right one for as long as possible. The tragedy Mahmud Shah's court never sees coming (Portuguese cannon in 1511) has a mirror in the tragedy the reader almost doesn't see coming either: that the story was never really about who ends up holding the strait.

#### Rivals & Mirrors, The Next Generation, Also Climbing

Not one antagonist but a field: other young nakhoda and warriors, all climbing toward Sea Lord status across the same 1498–1521 span, all more likely than Angin to actually be remembered, which is precisely the point. Angin isn't uniquely talented or uniquely favored by the story; he's one of several people this exact power-vacuum era is producing, and the others mostly get the legend he doesn't.

| Figure | The Mirror |
|---|---|
| **Pati Unus** (already on the roster, heir to Demak, twelve in 1500) | Climbs by inherited legitimacy, not merit, history remembers him as Pangeran Sabrang Lor, who leads a great naval assault on Portuguese Malacca and dies in the attempt. The exact photonegative of Angin: dies young, dies gloriously, dies *remembered*. Angin lives to be old and forgotten instead. |
| **Hang Nadim** (new) | By Malay tradition (Sejarah Melayu, and more fully the later Tuhfat al-Nafis) the son of Hang Jebat and foster son of Hang Tuah, who leads Johor's naval resistance against Portuguese-held Malacca starting around 1516, inheriting two legacies pulling in opposite directions (a rebel father, a throne-loyalist foster-father) where Angin inherits none at all. Treat him the way the file already treats Hang Tuah's own legend: real tradition, not settled fact, later chronicles layer detail onto a figure the earliest sources barely name. |
| **Shariff Kabungsuwan** (already on the roster, "a name not yet spoken in Mindanao," arrives c. 1515) | Climbing in a theater mostly separate from Angin's own for most of the book, proof the ladder is being climbed simultaneously in corners of the archipelago outside the reader's view, not just wherever the camera happens to be pointed, though their paths do converge late, once Angin's own worldview has matured enough for a real ideological second contact. |
| **Ali Mughayat Syah** (already on the roster, "a young figure in 1500") | The most direct geographic rival: rising in Angin's own waters, North Sumatra, across the same years. One of them ends up founding a dynasty that outlasts the century; the other ends up with neither throne nor name. |

#### The Butterfly Effect (locked mechanic)

Angin's presence in the world is not inert, his actions alter specific, small historical hinge-points, and **the reader is made explicitly aware of each divergence** rather than left to notice on their own. Working example: in the history books, Tun Perak dies; in this telling, because of something Angin does or doesn't do, he doesn't. The device isn't dramatic irony (the reader quietly knowing more than the characters), it's the opposite: the book periodically breaks its own fourth wall of historicity just enough to say, in effect, *this is not what happened before Angin arrived*.
This is also why Malacca's fall can no longer be treated as fixed. 1511 is what happens in the history the reader already knows, but that history is now provably alterable within the story's own logic, so whether Malacca falls, falls differently, or doesn't fall at all depends entirely on how far Angin's ripples have spread by the time Albuquerque's fleet arrives. The suspense is real because the reader has just been shown, in small ways, that the outcome is no longer guaranteed.

#### Open Threads From This Session

- **Malacca's inheritor motive:** who already expects to benefit from Malacca's fall and is quietly betting on / funding Angin's rise? That person turns on him the moment his path diverges from what they were counting on, natural climax confrontation, whether or not Malacca actually falls.
- **Vassalage mechanics, reframed:** a Sea Lord typically understands he sits below Sea Emperor status *mostly not by choice*, submission is usually imposed or structurally inevitable rather than freely offered. Since Angin's ending means he never actually collects that submission, this now matters more for how the *other* Sea Lords around him experience power (and near-misses at Sea Emperor status by rivals or predecessors) than for Angin's own arc.
- **Other models of thalassocratic empire:** the file's Internal vs. External Power framework (see below) uses the strait-chokepoint model as its clearest example, but historically these empires have been held other ways too (tribute-mandala networks, religious/cultural authority, marriage webs), worth widening before treating chokepoint control as the only real path to the title.
- **The temptation's face and scene (locked):** Albuquerque personally offers Angin a seat in the new order, not narrated temptation, an actual scene. See Chapter Outlines for its placement late in Act 3. The temptation is what makes refusing it (or never quite reaching for it) cost something.
- **The princess resurfaces (locked):** the Malaccan princess from Act 1 (Beats 9–9a) reappears in Act 3, after Malacca has already fallen and her father's court no longer holds real power, she becomes Angin's wife, but the marriage carries none of the political weight it would have in 1500, since there's no throne left behind her by the time it happens. Placed near the Albuquerque temptation rather than replacing it: the same stretch of the book where Angin refuses a seat in the new imperial order is where he learns, or is on the verge of learning, that the old order's collapse traces back to a choice he made as a sixteen-year-old and never understood. She becomes his first wife under the Ledger's Marriages/Regional Stewardship system, see The Ledger.

##### Angin's Wives (locked principle, open roster)

Angin eventually takes multiple wives across Act 2 and Act 3, not a single alliance-marriage but a working principle of how his Route A patchwork empire actually holds together. See The Ledger's Marriages and Regional Stewardship categories for the mechanic. Each wife past the first governs a scattered holding in his name while he's elsewhere, the harem functions as his actual government, not a separate romantic subplot. The princess is locked as the first (or narratively most significant) of these; the rest of the roster is deliberately left open, to be added to the Ledger's Open Log as specific chapters produce them, the same way the big brother, the mentor, and the malim were left open before being built out.
Earlier worldbuilding pass (flavor still valid; outcome now open, not fixed)
Central Conflict
The Sea Was Never Owned, Until Someone Tried To
For a thousand years, the archipelago's waters were held the way air is held: by everyone and no one. Sultanates, rajahnates, and kingdoms competed, warred, and intermarried, but the sea itself, the spice routes, the straits, the monsoon lanes, belonged to whoever could sail it. Power here was measured in tribute and marriage alliances, not maps.
**1500 AD is the last calm year before that changes forever.**
Three tectonic pressures are already moving beneath the surface, and every character on the roster is standing on one of them:

#### 1. The Old Order is Cracking From Within

Majapahit, the empire that once claimed the whole archipelago as its mandala, is a shadow of itself under Udara, a court, not an empire. Meanwhile new Islamic sultanates (Demak, Cirebon, soon Banten) are rising on the very island Majapahit once ruled outright. This isn't foreign conquest, it's succession, religion, and ambition rewriting Java from the inside.
*Tension to play with: is Raden Patah founding something new, or finishing something old?*

#### 2. The Spice Islands Are Becoming a Prize Worth Fighting For

Ternate and Tidore sit on a monopoly, literal clove trees that grow nowhere else on earth, and that monopoly is starting to attract attention far beyond the usual regional rivals. Al-Mansur doesn't need a large kingdom; he needs to be the gatekeeper of the one resource everyone wants. That kind of leverage always eventually invites people who'd rather not pay the toll.
*Tension to play with: sultanates whose power was built on scarcity now have to defend that scarcity.*

#### 3. Something Is Coming From the West

None of the roster knows it yet, not Mahmud Shah in his wealthy, complacent Malacca, not Bolkiah expanding Brunei's reach, not Lapu-Lapu holding Mactan against no one in particular. But 1511 is eleven years away, and Malacca falls to the Portuguese. 1521 is twenty-one years away, and a Spanish-backed expedition reaches the Visayas. The entire roster is living in the last uncontested decade of a world that measured itself only against itself.
*Tension to play with: dramatic irony. The reader can feel the ships that aren't on the horizon yet.*

#### Why This Works Like Wild West / Golden Age of Piracy / Three Kingdoms

| Comparison Era | Its Core Tension | The Nusantara's Equivalent |
|---|---|---|
| **Wild West** | Frontier expansion meets no law but your own | Sultanates expanding into contested straits with no overarching authority |
| **Golden Age of Piracy** | A brief window where the old imperial rules didn't yet apply | The last decade before European colonial powers impose new rules on Asian trade |
| **Three Kingdoms** | Fragments of a fallen empire, each claiming true legitimacy | Majapahit's fall spawning rival successor states (Demak, Sunda, regional sultanates) all claiming their own legitimacy |

"For a thousand years, the sea belonged to whoever could sail it.
In the last year before that ends, nobody knows the water is already spoken for."

#### Open Threads for the Roster

- Who feels the coming pressure first? (Malacca, sitting on the strait, is the obvious candidate, that's dramatic irony baked into Mahmud Shah's whole arc)
- Who represents "the old ways" vs. "the new order"? (Lapu-Lapu vs. more cosmopolitan rulers like Bolkiah is a clean axis)
- Is there a unifying threat that could pull rivals together, the way Three Kingdoms occasionally has warlords ally against a bigger enemy?
- What happens to Mahmud Shah's complacency once Ramathibodi II's invasion fleet actually arrives? (This isn't a hypothetical foreign threat like the Portuguese, it's a live regional war happening in 1500 itself)

### Tab: The Nakhoda (Ascension mythos)

The archetype
The Nakhoda
Master of the Ship, the Spice World's Answer to the Pirate, the Viking, the Samurai

#### The Word

There is a boy on every jetty in the Nusantara. Malacca, Ternate, Jolo, Demak, doesn't matter which. He's mending a net or hauling someone else's fish, and then the ship comes in.
She's riding low. That's the first thing he notices, low in the water means the hold is *full*. Nutmeg, maybe. Cloves if the run went east. The crew is loud the way only men who just got paid are loud, and at the stern, one hand on the rudder post like the whole sea belongs to him, stands the man they all answer to.
Nobody has to tell the boy the word. He already knows it. **Nakhoda.**
Not a prince. Not born to anything. A man who *made himself* out of salt water and nerve, and the boy on the jetty understands, in one look, that this door is open to him too. Not the palace. Never the palace. But the sea takes anyone brave enough to ask. That is the whole mythos in a single image: the ship, riding low, coming home.
The Age of Commerce is a window, and every young man on the water can feel it closing. For one narrow generation, the spice trade has made the sea worth more than any throne's fields, and a man with a boat, nerve, and the right wind can rise higher and faster than his father ever could. That urgency is the whole appeal: **it is happening now, and it will not happen forever.**
*Nakhoda*, Persian in root, Malay in daily use, real in the mouths of sailors from Malacca to the Moluccas by 1500, simply means **master of the ship**. The title asks nothing of a man's birth. It asks only that he command a boat, however small, and survive what the sea does to those who chase it.

#### The Adventure

The Spice World in 1500 is the largest playground any adventurer has ever been handed. Seventeen thousand islands. Four great sultanates and a hundred small kings. Straits that make men rich and reefs that make them dead, sometimes in the same hour. And moving through all of it, the cargo. Cloves that grow on exactly one cluster of islands on the entire earth. Nutmeg worth more, weight for weight, than silver. Sandalwood, camphor, pepper, pearls, gold.
A nakhoda's life is a chain of voyages, and every voyage is a story:

| The Run | The Story |
|---|---|
| **The Strait Run** | Malacca to Pasai, hugging the Sumatran coast, the busiest water in the world. Chinese junks, Gujarati traders, Javanese jong, and every one of them watching every other one, because half the ships in the strait would turn raider for the right prize. |
| **The Spice Run** | East past Java, through the Banda Sea to Ternate, where the clove trees grow in the shadow of a volcano and the Sultan decides who fills their hold and who sails home empty. Months out. Monsoon-timed. The run that makes fortunes. |
| **The Raid** | Not every nakhoda waits for cargo to be sold to him. The line between merchant and raider is exactly as wide as a man's circumstances, the same kelulus that carries pepper one season carries war-shields the next. Every port knows it. Every crew is armed. This is not the exception in the Spice World; it is the weather. |
| **The Far Water** | Champa. Siam. The China run with the Ming tribute fleets. Timor for sandalwood at the edge of the maps, where the labels stop and *here be dragons* begins. The nakhoda who comes back from the far water comes back with more than cargo, he comes back with stories no one can check and a reputation no one can touch. |

#### The Ascension

Here is why the boy on the jetty stays a believer his whole life: **the ladder is real, and it has no gate.** A sultan is born. A nakhoda is *built*, and unlike a court title, his rank isn't a word someone grants him. Until Sea Lord, it's counted in a single hull: one ship, always his biggest, growing rung by rung until there's nowhere left to grow vertically. Only past that ceiling does growth turn horizontal, more hulls, a subordinate nakhoda of his own. Every rung below is a bigger boat. Only the last is more of them:

| Rung | The Vessel | Fleet | The Climb |
|---|---|---|---|
| **The Boy** | No boat of his own | 0 | *Anak perahu.* He bails water, hauls line, sleeps on deck, eats last. He owns nothing but his eyes, and he uses them, learning the reefs, the stars, the way the monsoon smells three days before it turns. |
| **The Hand** | Crew aboard someone else's kelulus | 0 | Trusted now. Paid in shares, not scraps. He's fought once or twice when a raid came over the rail, and lived, and the older men have started saying his name like it might be worth remembering. |
| **The Helmsman** | Given the rudder of the kelulus, still not his | 0 | The nakhoda gives him the rudder in open water. Then in the strait. Then at night. There is no ceremony for this, just the day the captain doesn't take the rudder back, and everyone aboard knows what it means. |
| **The First Ship** | One **kelulus**: a small, swift oared craft, crew in the single digits to a dozen, built for speed through reefs and river mouths, not for hauling fortunes. Regional cousins **baloto**, **biray**, or **tilimbao** serve the same rung depending on home waters | 1 | Small. Half-borrowed, half-bought, patched everywhere. It doesn't matter that she's small. She's *his*. The first time he stands at his own stern in open water is the moment the boy on the jetty finally dies happy inside him. |
| **Nakhoda** | A **penjajap** (raider's path) or a **pencalang** (trader's path), the first real fork, crew in the dozens, enough hold for a real cargo run or enough hands for a real fight | 1 | Full and proper. His ship, his cargo, his stake, his risk. Known by name in three ports, owed money in two, feared a little in one. Which hull he picks here says who he already is: a man building a fortune, or a man building a reputation. He answers to no court and kneels to no throne, and everything he has, the sea gave him and the sea can take back, which is exactly why it's worth more than anything a sultan could grant. |
| **Rising Nakhoda** | A **malangbang** (broad, flat-bottomed utility) or a **ghurab** (Mediterranean-influenced hybrid, marking foreign trade contacts), sized between a penjajap and a lancaran | 1 | Not yet a name every port fears, but a name every port remembers. The malangbang says he's chasing bulk and range; the ghurab says he's been courting Gujarati or Arab merchants who don't usually deal with Malay hulls. Either way, he's stopped being interchangeable with every other captain on the jetty. |
| **Master Nakhoda** | A **lancaran** (war-fleet backbone, crew up to 150–200) or, if the story takes him into Visayan waters, a **karakoa** (double-ended, up to 25m, built for the narrow channels between islands), a genuine detour, not just a bigger hull | 1 | He's stopped thinking in single voyages. Now it's a season's worth of runs, a crew large enough to need a real hierarchy of his own, and a name that reaches ports he's never personally sailed to. The karakoa option is a deliberate fork away from home waters entirely, allies, trouble, or both, found somewhere the Malay ladder doesn't reach. |
| **Jong-Owner** | A **jong**: the ceiling of single-hull growth, 40 to as much as 1,000–2,000 deadweight tons, the largest carrying up to a thousand people | 1 | He has hauled the biggest cargo hull in the known world. Wealth and prestige, real and visible, but still one hull, still one bad storm or raid from losing everything. Owning a jong proves he can carry a fortune. It does not yet prove he's a power. That's a different bar, and it isn't a bigger boat. |
| **Sea Lord** | Jong flagship **plus** at least two other hulls under his banner, at least one of them crewed by a sworn subordinate nakhoda | 3+ | The summit, and it is real, the Nusantara has always known men like this. But it isn't granted by hull count alone. See **Sea Lord Minimum** below. |

*The wheel turns. The mythos feeds itself, and every jetty in the Spice World has a new boy on it, watching a Sea Lord's ship come in, learning the word.*

#### Sea Lord Minimum

A fleet count alone doesn't make a Sea Lord. A rich merchant could own three kelulus as pure cargo diversification and never register as a threat to anyone; a man with two hulls, one of them crewed by a sworn vassal, funded on his own surplus capital, and already drawing a syahbandar's suspicion, is more of a Sea Lord than the merchant will ever be. The count is evidence of the threshold, not the threshold itself. All of the following have to be true at once:

| Requirement | Why It's Load-Bearing |
|---|---|
| **Jong-class flagship** (or equivalent prestige hull) | Proves cargo capacity and wealth at the top tier |
| **2+ additional hulls under his banner** | Not merely owned, crewed by someone else, sailing his routes, on his silver, under his name |
| **At least one Subordinate/Vassal Nakhoda** | The line between owning boats and commanding people, someone else's rise now depends on him, the same way his once depended on a patron |
| **A standing armed component** | Raiding and defense capacity, not merely trading capacity, a "Class of Warriors," not just a cargo manifest |
| **Independent capital** | Self-sufficient or surplus wealth, not still running on a patron's silver, he can't be owned if he's still someone's debtor |
| **Visible to power** | A sultan, syahbandar, or rival Sea Lord has already acted on him, courted, taxed, married into, or moved against. This is the one condition he can't grant himself; the board has to notice him first |

That last requirement is the actual promotion. He can build the fleet, take the vassal, hit surplus wealth, and still not be Sea Lord until someone with real power makes a move on him because of it. Everything before that moment was qualifying for an invitation he never asked for.
But there's a twist waiting at the top of that ladder, and it's the part the boy on the jetty never sees coming.

#### The Ceiling That Becomes a Floor

A nakhoda climbs to escape being anyone's pawn. That's the entire promise of the word, no court, no throne, no man standing over him. And for most of the climb, it's true.
Then he reaches Sea Lord, and the promise quietly inverts.
A single kelulus answers to no one. A fleet of forty hulls, kelulus for speed, lancaran for muscle, a jong or two for the bulk cargo that makes the whole operation worth running, cannot hide, cannot slip past a sultan's harbormaster unnoticed, and cannot be risked lightly by the man who built it. That fleet is now a piece on a board bigger than any one voyage. Sultans court him, tax him, marry into his family, or make war on him, but none of them let him simply exist unclaimed. His years of climbing to escape being anyone's pawn have made him something far more valuable to seize: **a player's most useful piece.**
Every nakhoda still under his banner, every hand, helmsman, and small-boat captain flying his colors, is now, whether they know it or not, a pawn in someone else's Game. The Sea Lord moved them there without asking, the same way a sultan once might have moved him.
This is the cost nobody puts in the story they tell the boy on the jetty. The higher a nakhoda climbs, the more he stops being a free man playing his own hand, and the more he becomes a piece, a very well-paid, very dangerous piece, in a Game much larger than any single ship.
Almost nobody escapes this trap by climbing harder. The rare few who do escape it at all tend to have found something the Game can't tax, marry, or move, see The Unseen, The Jade-Bound.

#### Every Court Has a Chokepoint

No Sea Lord on the roster is simply powerful. Each one sits atop something they can't fully secure alone, a supply line they can't personally guard, a claim they can't yet enforce, a network too large for one man to watch every strand of. That gap is where a nakhoda like Angin actually earns a rung: not by being handed power, but by being pulled in to solve the one problem a Sea Lord's own throne, fleet, or bloodline can't solve for him. Every relationship in the ladder can, in principle, be built this way, which means every relationship is also a door into a different part of The Economy's wider machinery, seen through the specific person who needs it fixed.
The pairings below are working hypotheses, not locked canon, a starting map of which dimension of the Spice World each Sea Lord's story is best suited to open, to be revised as the actual chapters take shape.

| Sea-Lord | The Chokepoint | The Dimension It Opens |
|---|---|---|
| **Al-Mansur** (Ternate) | Holds the monopoly but not the means to move or protect it, entirely dependent on carriers he can't fully vet against skimming, smuggling to Tidore, or leaked prices | Logistics & Navigation, Information & Rumor |
| **Bolkiah** (Brunei) | A web of marriage and tribute stretched across Borneo, Sulu, and Luzon has more surface area than one man can personally watch, a single vassal gone quiet can unravel trust before Brunei even notices | Politics & Diplomacy, Information & Rumor |
| **Mahmud Shah** (Malacca) | Inherited grandeur, untested by real crisis, a court that has never had to defend its wealth doesn't know how, and doesn't want to hear it | Politics & Diplomacy, Law & Justice |
| **Tun Mutahir** (Malacca) | Holds the office but not the authority Tun Perak built into it, old-guard court factions are loyal to a predecessor's memory, not to him | Law & Justice, Politics & Diplomacy |
| **Lapu-Lapu** (Mactan) | Sovereignty through refusal means no outside leverage when Mactan needs something it can't produce or defend alone | Labor & Craft, Law & Justice |
| **Bayanullah** (Sulu) | Independence maintained purely by being useful, not by being strong, no fallback if Brunei's demand ever cools or a rival pearl source emerges | Economy (Section 5–6, entrepôt leverage), Politics & Diplomacy |
| **Tumapaqrisiq Kallonna** (Gowa) | Building toward regional dominance, but the rivalry with Bone over the same feeder routes is still unresolved | Economy (Section 4, transport & tolls), Politics & Diplomacy |
| **Syarif Hidayatullah** (Cirebon) | Squeezed geographically between Hindu Sunda and rising Demak, religious authority is real but the territory backing it is narrow | Religion & Daily Culture, Politics & Diplomacy |
| **Orang Kayo Hitam** (Jambi) | A reputation for courage precedes a reign with no track record yet, courage alone doesn't secure tribute compliance from an untested hinterland | Politics & Diplomacy, Law & Justice |
| **Mansur Shah I** (Pahang) | Sultan in name only, every real decision currently routes through his uncle and co-ruler | Politics & Diplomacy, Religion & Daily Culture, less a problem Angin solves than a quiet relationship planted for later, once he actually rules |

#### The Thrill

Every voyage is a wager with everything on the table. The nakhoda is not a salaried captain who loses nothing but pride if the run fails. The ship is his fortune. The cargo is his fortune. The crew's loyalty lasts exactly as long as his judgment holds. When he threads a reef passage at dusk because the monsoon window is closing, he is betting his entire life on his own eyes, and he took that bet freely, which is the entire difference between fear and thrill.
What's on the table, every single time: the storm that arrives two weeks early and turns a trade run into a survival story. The raiders off the Sulu chain who have been watching the strait longer than he has. The port politics, a new harbormaster, a sultan's tariff, a rival whispering in the right ear, and suddenly the cargo that was worth a fortune is contraband. The price, because nutmeg bought in Banda and sold in Malacca is a tenfold profit *if* the timing holds, and ruin if three other holds full of it arrive the same week. And the blade, his kris is not jewelry; boarding actions happen, and every nakhoda worth the name has stood on his own deck and held it.
And against all of that: the payoff. The ship riding low. The crew singing. The harbor lights of home water after four months out. There is no version of this life with the danger removed, and no nakhoda who would take that version if offered, the wager *is* the life.

#### The Freedom

This is the deepest root of the mythos, the reason it outlasts the century that made it.
Everyone else in the Spice World belongs to someone. The farmer belongs to his datu. The courtier belongs to his sultan's moods. The soldier belongs to whoever pays him this season. Even the great, even a bendahara, even a laksamana, rises and falls on a throne's favor, and the wise ones never forget it.
The nakhoda, alone in this world, belongs to the water.
Past the harbor mouth, no sultan's writ runs. No court etiquette, no palace whisper campaign, no kneeling. His deck is a kingdom of one, and its law is competence: read the water right, pay the crew fair, bring the ship home heavy. Do that, and no man alive stands above you. Fail, and no title would have saved you anyway.
He *chooses* his horizons, literally, daily, at the rudder. East to the clove islands or north to Siam. Trade this season or raid it. Winter in Malacca or push for the far water. Every man he ever meets on land is living a life that was mostly decided for him. The nakhoda decided his.
And when he is old, if the sea lets him get old, he will sit at some harbor's edge with a cup of something, watching the ships come in, and some boy mending a net nearby will look at the water the way he once looked at it. He won't say anything. He doesn't have to. The word says it all.

#### The Shape of the Myth

| Element | What It Looks Like |
|---|---|
| **The Code** | The sea owes no man a debt, and takes none either. Past the harbor mouth, no crown enforces a nakhoda's word, his reputation is his only law. |
| **The Trial** | Monsoon timing, reefs, becalmed weeks, a crew's loyalty. Most who chase the title fail or die reaching for it. |
| **The Prize** | Not just wealth, standing no birthright could buy. The sea is the one place blood doesn't decide a man's ceiling. |
| **The Tragedy** | Success is what kills nakhodas. The more a man is worth, the more some bigger power wants to seize, tax, or sink him. |

"Any fool can be born a lord.
A nakhoda has to earn the sea's permission every single time he asks."

### Tab: The Ledger

Across the whole climb
The Ledger
Angin's Accumulation, What He Holds, Not When He Holds It
The Ascension ladder describes what every nakhoda climbs. This tracks one man's actual climb through it, what Angin holds, as each Sea Lord's use of him leaves something behind. Unlike most who reach the top rung with a single fleet flying one banner, Angin is building toward Sea Lord by the **Route A** path: a patchwork of scattered holdings, no two acquired the same way, each one a leftover from a different relationship on the ladder. Land tagged *accident* was never meant to be his. Land tagged *force-kept* was a job he didn't hand back. Land tagged *ceded-burr* was a reward that was secretly a liability. Land tagged *marriage* outlived the arrangement that created it, and, in every case but the first, stays governed afterward by the wife herself, not absorbed into a single seat of power. Land tagged *entrusted* was freely given by people who wanted nothing on paper for it, the shakiest claim of the five on parchment, and the sturdiest in practice, since no rival court ever granted it and none can therefore revoke it.
Deliberately not staged. Earlier drafts of this page locked Angin's climb into six named, ordered stages (Anonymous Jobs → First Patron → Maluku Detour → Won by Force → Ceded Burr → Malacca Falls), dropped, because a fixed stage count and a fixed order started dictating plot beats rather than describing them. See Chapter Outlines for the current three-act structure. The categories below are the actual tracking mechanism: each one accumulates independently, in whatever order the chapters actually produce, and there's no requirement to touch every category or touch them in sequence. The Open Log further down is where specific acquisitions get written in as they happen, appended rather than slotted into a pre-built table.

#### The Categories

| Category | Tracked As |
|---|---|
| **Fleet** | Count + class of vessel (kelulus, lancaran, jong, etc.), class matters as much as count |
| **Land** | List of parcels, each tagged with its origin: accident / force-kept / ceded-burr / marriage / entrusted |
| **Vassals** | Count + character, general loyal population, not necessarily armed, distinct from hired/rented crew |
| **Standing Army** | Count, tracked separately from general Vassals, the men actually under arms, on call |
| **Class of Warriors** | Qualitative, e.g. Orang Laut raiders, disciplined line troops, an elite personal guard |
| **Domain** | Own running level: Nobody → Notable → Emerging Power → Recognized Sea Lord |
| **Institutions** | List, shipyard, court/council, tribute system, dispute arbitration. Expected to be the last category to fill in; its appearance marks the shift from reactive pawn to actual governance |
| **Marriages** | List, each with terms, who benefits, what's owed, still-active or outlived. Unlike most Sea Lords, who marry once for a single alliance, Angin's Route A patchwork empire means every wife past the first is also a governor: with holdings scattered across ports no single man could personally oversee while also climbing the ladder, each marriage doubles as the administration of one piece of it. A wife runs her domain's trade, its levies, its disputes, and its loyalty in his name and often her own judgment, for months or years between his visits, which makes the harem, in practice, Angin's actual government, the institution his patchwork empire would otherwise lack. See Craft & Human Capital's Regional Stewardship note below |
| **Allies** | Sea lords/factions backing him *without* owning him, distinct from active patrons who use him |
| **Money / Wealth** | Qualitative tier, debt-ridden → self-sufficient → surplus capital, independent capital is what makes him not-owned |
| **Reputation / Legend** | Prose ledger, what's said about him, by whom, unprompted. The qualitative core underneath every other stat |
| **Religion / Legitimacy** | Where he stands as Islam displaces Hindu-Buddhist order across the straits and Java, conversion, alliance, or deliberate neutrality, and what each costs or buys him. Unlike most on the roster, nothing is inherited here; whatever he holds, he chose |
| **Information / Intelligence Network** | Who owes him news first, spies, syahbandars, pilots who know reefs no one's charted. A form of leverage distinct from wealth or troops; see The Game's Information & Rumor dimension |
| **Titles / Recognized Rank** | List, each tagged by granting court and still-active/lapsed status. Under the mandala model this region actually ran on, titles stack rather than compete, a minor ruler could submit to, and hold rank from, more than one overlord simultaneously (Malacca itself paid tribute to both Ayutthaya and Majapahit at once in its founding years), and a real nakhoda could hold enough leverage to petition a sultan directly and get the maritime code amended for it. Angin can plausibly collect titles from Al-Mansur, Bolkiah, or others without contradiction, right up until two patrons' interests collide, which is the actual danger this category tracks: not whether he can hold multiple titles, but what happens the day he's ordered to use one against the other. Distinct from Domain, which tracks territory and standing, not nomenclature |
| **Trade Monopoly / Chokepoint Control** | Two distinct kinds, not one, see The Spine, Internal Power vs. External Power. *Internal:* a fixed geographic monopoly no one can relocate (Al-Mansur's cloves is the model). *External:* command of the mobile chokepoint itself, the strait or route every ship is forced to use, a seat that has changed hands from Funan to Srivijaya to Majapahit to Malacca. Sea Emperor requires holding both at once, something no empire in that succession has done |
| **Debts Owed to Him** | Financial and favor-based leverage *others* carry toward him, sultans, merchants, rival sea lords. Distinct from Money/Wealth, which tracks what he has, not what's owed. See The Nakhoda, The Debt Come Due |
| **Blood Ties / Kinship Network** | Adoptive crews, blood-brother pacts, fostered loyalty, obligation networks built rather than born, since Angin has no birth family to draw on. Distinct from the formal political bonds tracked under Marriages |
| **Sacred / Supernatural Legitimacy** | Whatever weight his jade amulet carries among those who read it as significant, a legitimacy separate from ordinary reputation. See The Unseen, The Jade-Bound |

#### Craft & Human Capital

| Category | Tracked As |
|---|---|
| **Shipwrights / Shipbuilding Capacity** | Actual construction capacity, not just finished hulls, the ability to *replace* losses rather than only accumulate them. Malacca itself buys jongs rather than building them (from Java, from Pegu); controlling real capacity is rarer and more durable than owning ships outright |
| **Navigators / Wayfinding Knowledge** | Pilots who know a specific reef, current, or monsoon window nobody else has charted, terrain mastery, not intelligence. Distinct from the Information Network, which is about news and rumor; this is about routes physically closed to everyone but him |
| **Specialist Loyalists** | Named individuals whose skill is irreplaceable, not fungible crew, an empu, a healer, a translator fluent across four ports' tongues. See The Unseen for the empu's status as a distinct, higher craft from an ordinary smith |
| **Regional Stewardship** | The actual answer to how a one-man, patchwork empire holds together while its founder is at sea for months at a time: his wives. Each governs a holding in his name, collecting tribute, arbitrating disputes, defending what's hers, and often expanding it on her own initiative, which makes them the load-bearing institution behind every other category in this Ledger, not a separate romantic subplot running alongside it. Distinct from Marriages (which tracks the political terms of each union) and from Vassals (general loyal population, not delegated authority); this tracks what each wife actually *runs*, independent of Angin's presence |

#### Cultural & Symbolic Capital

| Category | Tracked As |
|---|---|
| **Signature Legend** | The one specific, citable story told about him, the way Hang Tuah has the keris duel and Lapu-Lapu has "never lost a raid or been made to kneel." Pulled out from the general Reputation/Legend ledger as its own line, since every named Sea-Lord on the roster carries exactly one of these |
| **Cultural Fluency / Code-Switching Capital** | His defining trait, reading as Orang Laut to the Orang Laut, Bugis to the Bugis, tracked as an asset in its own right, since it's the thing that makes every other category possible for him specifically: access to rooms a fixed identity would be barred from |

#### Negative Space, What He Owes, What Protects Him

| Category | Tracked As |
|---|---|
| **Enemies Made / Debts Owed by Him** | The inverse of Debts Owed to Him, every acquisition in a zero-sum patchwork empire costs somebody something. Tracking who resents each loss keeps the gauntlet honest about consequences and seeds built-in antagonists for Act 3 |
| **Immunities / Untouchable Status** | Any person, place, or truce no rival will move against, and why, whether that's earned protection, a taboo, or leverage nobody wants to test. A candidate for what the jade amulet does beyond legitimacy: not just standing, but a line certain people won't cross |

#### Time & Momentum

| Category | Tracked As |
|---|---|
| **Rate of Ascension** | Not what he has, but how fast he's accumulating relative to everyone else on the roster. A Sea Lord built over forty years reads differently from one built in thirteen (1498–1511), the speed itself becomes part of the legend, or the threat other Sea Lords perceive in him |

#### Open Log

Where specific acquisitions get written in as they happen, appended in whatever order the story actually produces them, not slotted into a pre-built stage table. Each entry should note roughly when it happens relative to other entries (which act, and roughly which chapter per Chapter Outlines, or tied to a specific named event like the Maluku detour or Malacca's fall) without committing to a fixed stage number. Empty until the first acquisition is written.

| Entry | Category | What Happened | Rough Timing |
|---|---|---|---|
| **The jade amulet** | Reputation / Legend, Sacred / Supernatural Legitimacy (functionally, a spy network's recognition token, not yet understood by Angin as anything but an unexplained keepsake) | Given by Tun Perak at their parting, unexplained. Its real function, known to Tun Perak and withheld from both Angin and the reader for a long stretch of the book: a recognition token for Tun Perak's own hidden network, run in secret against Cabral and the Portuguese since his presumed death, meant to eventually put Angin in contact with the rest of that network, whether or not Tun Perak lives to see it happen. Angin carries a spy's signal without any idea that's what it is. | Act 1, ch. ~1–2 (given) → Act 2, exact chapter TBD (first recognized, tied to a specific Sea-Lord First Contact) |
| **Nina Chatu (fence → trading front)** | Debts Owed to Him / Debts Owed by Him (both, leverage runs in both directions) | Butterfly Effect divergence: an invented early relationship with a real historical figure, over a decade before his documented emergence. Nina Chatu launders Angin's raided cargo, which is how Angin's real trading front (pencalang identity) actually gets built. In exchange, Nina Chatu ends up holding real leverage, proof of what the front is built on, which he later uses to threaten exposure, resolved when Angin buys his silence. Also functions as Angin's real teacher in trade and negotiation, a rivalry as much as a partnership, the source of the Gujarati-trader shrewdness he otherwise has no dedicated mentor for. | Act 1, ch. ~6–9 (draft range, fence relationship built and tested) |
| **The Brunei run** | Money/Wealth (first entry, the first wealth Angin builds rather than raids or launders) | A repeatable, legitimate trade lane from Brunei to Malacca, built once the malim's wayfinding and Nina Chatu's market sense are both real assets, high-quality goods, reliable delivery, priced sharper than rival hulls can match. The first place his two teachers' lessons compound into something that's entirely his own rather than inherited, stolen, or laundered. | Act 1, ch. ~11a (draft placement, following the fence relationship's build-out) |
| **The beach across the strait** | Land (tag: bought, a new origin, distinct from accident/force-kept/ceded-burr/marriage/entrusted) | A small, undeveloped patch of Sumatran coast, bought outright with Brunei-run profit, sitting directly across the strait from Malacca itself. Modest at the time, but a geographically sharp first foothold in view of the exact chokepoint the book's Central Conflict revolves around, years before Angin has any reason to think in those terms. **Deepened divergence:** the same stretch of coast Tun Perak secretly owned and led Angin near during their parting in Beat 7, Angin buys it outright years later believing it unclaimed, unaware he's paying for land that once belonged to the very man whose life he spared. | Act 1, ch. ~7 (Tun Perak's ownership, unexplained) → ch. ~11b (Angin buys it, unaware of the connection) |
| **The princess he doesn't return** | Debts Owed by Him / Enemies Made (functionally, a debt to history itself, never called in because nobody ever traces it to him) | During the raid that wins him his first ship, Angin kills his own captain for attempting to rape a captive Malaccan princess, Mahmud Shah's daughter, being sent as a peace-bride to Ayutthaya to head off exactly the war that comes anyway. He doesn't return her, she asks him not to. Her non-arrival reads to Siam as deliberate insult, not accident, and becomes this book's fictional trigger for the real, historically documented 1500 Siamese invasion of Malacca, sitting underneath the record rather than contradicting it, the same device used for Tun Perak's survival and Nina Chatu's early emergence. Angin never learns the connection; the reader is meant to. | Act 1, ch. ~9–9a (the kill, the choice not to return her) |
| **The treason accusation (Tun Perpatih Putih)** | Enemies Made / Debts Owed by Him (functionally, a threat closed by history rather than by Angin's own hand, but a real brush with exposure) | A legitimate trade transaction brings sixteen-year-old Angin into contact with the court of Tun Perpatih Putih, Tun Perak's brother, 6th Bendahara since 1498. Suspected of treason for allegedly provoking Siam through unlicensed raids on their shipping, in defiance of the bendahara's ceasefire policy, an accusation that, unknown to anyone in the room, is circling far closer to the literal truth than a false suspicion. The accusation never lands: Tun Perpatih Putih dies in the actual 1500 Siamese invasion of Malacca, the very war Angin unknowingly caused, before he can act on it. A second Butterfly Effect death-window, used the same way as Tun Perak's, real historical record leaves the cause of his 1500 death unspecified, and the story fills the gap. | Act 1, ch. ~12a–12c (transaction, suspicion, resolved by the 1500 invasion; Angin is 16) |
| **The port's defense, first real reputation** | Reputation / Legend (first entry, the first time Angin's name, or at least his deed, is talked about by people outside his own small circle) | Fighting in Malacca's defense during the 1500 invasion, Angin becomes locally known as the boy who cut down Siamese attackers defending the port, a fresh, positive reputation forming in the very same chaos that kills the official who'd just named him a suspect, with nobody connecting the two. Not yet a name known in three ports, per the Nakhoda mythos, but the first real seed of one. | Act 1, ch. ~12c (during the invasion itself) |
| **Hang Tuah notices him** | Reputation / Legend (a seed planted, not yet collected, no relationship exists yet, only a single unspoken observation) | Commanding Malacca's defense in person during the same 1500 invasion, Hang Tuah, roughly seventy, the oldest living legend in Malacca's court, catches sight of a boy fighting with a discipline no untrained raider should have, and files it away without acting on it. Neither of them knows it yet. This is deliberately left as a seed rather than a scene with consequence in Act 1; it exists so that if a real First Contact with Hang Tuah is placed in Act 2, it can open on recognition rather than a cold introduction. | Act 1, ch. ~12c (same invasion beat as the port's-defense entry, seen through a different pair of eyes) |
| **The Singing Admiral, first Sea Lord encounter** | Reputation / Legend, Rate of Ascension (functionally, no material reward, but the moment his own ambition becomes deliberate rather than incidental) | Act 1's finale. Running the Brunei trade lane, Angin is handed a small, incidental task by Bolkiah's court, low-stakes precisely because he's disposable enough that failure wouldn't matter. He completes it competently, but what actually lands is the scale of Bolkiah's power and aura up close: a harbor reorganizing around one man's arrival, a retinue whose upkeep alone could run Angin's entire trade route for a year. The moment The Boy actually ends, per the Ascension ladder's own no-ceremony rule, not through any title conferred, but through Angin seeing, for the first time, exactly how far Nakhoda still is from Sea Lord, and deciding, quietly, to climb for it on purpose. | Act 1, ch. ~20 (finale, age 18, 1502) |
| **The princess as first wife** | Marriages / Regional Stewardship (first entry in both categories, see The Ledger's Marriages and Regional Stewardship notes) | She resurfaces in Act 3, after Malacca has already fallen and her father's court no longer holds real power, the marriage carries none of the political weight it would have in 1500, since there's no throne left behind her by the time it happens. Becomes Angin's first wife, and the first holding governed under the Regional Stewardship system rather than absorbed into a single seat of power. Placed near the Albuquerque temptation: the same stretch of the book where Angin refuses a seat in the new imperial order is where he learns, or nearly learns, that the old order's collapse traces back to a choice he made as a sixteen-year-old. | Act 3, exact chapter TBD (placed near the Albuquerque/temptation sequence, late in Act 3) |

"Every gift was someone else's problem in disguise, and he built an empire entirely out of what they meant to throw away."

### Tab: Chapter Outlines

One book, beginning to end
Chapter Outlines
Boy to Nakhoda, Nakhoda to Sea Lord, Sea Lord to the Sea Emperor Temptation
A working plan for the whole book in three acts, roughly 100 chapters, paced against everything already locked elsewhere in this file: The Ascension's ship-growth ladder and Sea Lord Minimum, Two Contacts' First/Second Contact device with each Sea-Lord, and Central Conflict's locked ending. Chapter counts are soft estimates meant to be shortened later, not commitments.
Note on terminology: "First Contact" and "Second Contact" below refer only to the Two Contacts device, Angin's early, low-stakes worldview mismatch with a given Sea-Lord, and its later, matured, unresolvable form. They are not about the Portuguese. The Portuguese timeline (1509 first ships, 1511 Malacca falls) is tracked separately as historical backdrop and runs on its own clock.
The act boundaries below reflect what's actually been specified. Nothing inside them is named or broken into narrative phases, no invented beat titles, but the Chapter-by-Chapter Distribution table further down does assign specific chapter numbers to each First and Second Contact, plus a quest and reward for each.

#### The Timeline This Book Actually Covers

| Year | What It Anchors |
|---|---|
| **1498** | Opening year of Act 1. Angin is fourteen. Tun Perak, historically dead by this point in most chronologies the roster otherwise follows, is still alive on the page. |
| **1500** | Angin, sixteen, wins his first ship by killing his own captain to save a captive Malaccan princess mid-raid, and unknowingly triggers the Siamese invasion of Malacca by never returning her, the peace-bride whose non-arrival Ayutthaya reads as insult. He's then named a suspect in a treason accusation by Malacca's own bendahara, an accusation closer to true than anyone in the room can prove, in the same year the invasion he caused actually lands. The single most dangerous year of his adolescence, and the one where history itself, a history he set in motion without knowing it, becomes the thing that saves him. |
| **1502** | Act 1 closes here. Angin reaches full Nakhoda status at eighteen. |
| **1511** | Act 2 ends here. Angin reaches Sea Lord status at twenty-seven. Malacca's fall creates a power vacuum, a window of opportunity for Angin's own domain to become a new chokepoint. |
| **1521** | Closing year of Act 3, and of the book. Angin is thirty-seven. The final chapters are the Temptation Arc. |

#### Estimated Length

| Act | Estimate | Span |
|---|---|---|
| **Act 1, Boy to Nakhoda** | ~20 chapters | 1498 → 1502 (age 14 → 18) |
| **Act 2, Nakhoda to Sea Lord** | ~45 chapters | 1502 → 1511 (age 18 → 27) |
| **Act 3, Sea Lord to the Sea Emperor Temptation** | ~35 chapters | 1511 → 1521 (age 27 → 37) |
| **Total** | ~100 chapters | 1498–1521 |

#### Act 1, Boy to Nakhoda (1498 → 1502)

Chapters 1–20. Covers the Ascension ladder from The Boy through Nakhoda, ages fourteen through eighteen. Tun Perak's historical death-window falls within this act, live on the page rather than referenced after the fact, the earliest use of the Butterfly Effect mechanic. The 1500 Siamese invasion of Malacca lands mid-act, when Angin is sixteen, his first ship, his first brush with a court's suspicion, and his first time being saved by history rather than by his own hand, all in the same year. No *full* Sea-Lord First Contacts are placed here, those still begin properly in Act 2, with one deliberate exception: the act's own finale (Beat 14) is a soft, incidental encounter with Bolkiah of Brunei, not a First Contact in the Two Contacts sense (no worldview clash, no ongoing relationship yet), but the moment Angin first sees what a seated Sea Lord's power and aura actually look like up close. It closes The Boy and opens Act 2 already aimed at Sea Lord as a chosen goal, not just the next rung.

##### Act 1, Locked Opening Beats (ch. 1–3, draft shape)

Resolves the "How Angin is entangled in the Tun Perak divergence" open question below. Angin is a member of an Orang Laut raiding crew, the same crew, per his character sheet, that later fishes him half-drowned and names him; this raid predates that, or is folded into the same crew relationship rather than treated as a separate employer.

| Beat | What Happens |
|---|---|
| **1. The argument** | Angin, still unproven within the Orang Laut crew, pushes to join the raid on Tun Perak's vessel. A **"big brother" figure**: Orang Laut himself, real kin to Angin in practice if not blood; placeholder name/character, to be built out, argues against bringing him along. |
| **2. He goes anyway** | Angin wins the argument, or goes around it, and joins the raid. |
| **3. The raid goes wrong** | The crew is sent, the chain tracing back to Cabral, gathering intelligence and quietly destabilizing Malacca's leadership ahead of Portugal's arrival, to raid Tun Perak's vessel at what should have been a vulnerable moment during sea travel. It isn't: Tun Perak's own guards are unexpectedly heavy, and the raid turns into real fighting rather than a clean hit. **The real reason, unknown to Angin's crew and to Cabral both:** Tun Perak has secretly been in contact with Siamese intelligence for some time, not treason in his own mind, but an old kingmaker's unauthorized, private attempt to manage a threat (Ayutthaya) he judges Malacca's own complacent court isn't taking seriously enough. That same channel puts word of the coming hit in his hands before it lands, which is the actual reason his guard is heavier than any raiding crew's intelligence accounted for. |
| **4. The big brother dies** | Killed by Tun Perak's own men during the fighting, the first real cost of the book, and the first death Angin is present for, and, though nobody involved will ever fully know it, a death that traces back to Tun Perak's own secret dealings with Siam rather than simple bad luck. |
| **5. The kill falls to Angin (his first assigned kill)** | In the chaos, not by design but almost by default, the least experienced one left standing near him, Angin ends up alone with Tun Perak restrained. The kill is now his to finish. |
| **6. The sparing** | Angin spares Tun Perak, minutes after losing someone who was real family to him, to this same man's guards. The crew reports the kill as successful; Cabral believes it; it enters history as fact. Tun Perak lets the world believe him dead, not peaceful retirement, but genuine fear and regret: an old man confronting how badly his own private war against Siam has already cost the people around him, choosing to vanish rather than risk it costing more. His presumed death becomes cover for a second, more dangerous secret war he judges more urgent than the first, a quiet, ongoing effort against Cabral and the Portuguese apparatus already moving through the region years ahead of their fleet's actual arrival, run through a scattered informal network of old contacts most of Malacca's court has long since forgotten he has. **Cabral never learns the truth**: this stays a secret between Angin and Tun Perak alone, not a thread that resurfaces as a Cabral confrontation later. |
| **7. The jade amulet** | Before they part, Tun Perak leads Angin near a small, secret stretch of Sumatran coast he owns across the strait from Malacca, never explaining why, and gives him a jade amulet, unexplained, its meaning withheld from both Angin and the reader for a long stretch of the book. Its real function: a recognition token for Tun Perak's own hidden network, meant to eventually put Angin in contact with the rest of it, whether or not Tun Perak lives to see that happen. Angin has no idea he's carrying a spy's signal, or that the beach he'll later buy outright in Beat 11b, believing it unclaimed, once belonged to the very man who spared his life. See The Ledger's Open Log for its tracked function. |
| **8. Drifting** | Angin drifts between several crews and ships before landing anywhere, rootless by design, learning the reefs, the stars, the monsoon (per The Boy rung). |
| **8a-pre. The nudge** | Not dramatized on the page as a separate scene, but true underneath Beat 8a: it's Tun Perak, working quietly through his own network, who steers the Bugis mentor into Angin's path during the drifting stretch, not chance. The mentor is one of Tun Perak's own old contacts, tasked, knowingly, with keeping an eye on the boy who spared his life and giving him something to stand on. Angin never learns this. |
| **8a. The Bugis mentor** | During this stretch, Angin falls in with a Bugis mentor, a warrior/former warrior who teaches him combat and **siri** (the Bugis honor/shame code) together. This gives him, for the first time, an actual ethical framework for a moral compass he's so far only acted on by instinct (sparing Tun Perak) rather than doctrine. What Angin doesn't know: this isn't chance. The mentor is one of Tun Perak's own old contacts, quietly steered into Angin's path and knowingly tasked with keeping an eye on the boy who spared his benefactor's life, the mentor's loyalty to Angin is real, but it began as an assignment, not an accident. |
| **8b. Cabral's cleanup (open thread)** | Separate from Beat 6's "Cabral never learns the truth", Cabral still believes the kill succeeded, but his people quietly move to eliminate anyone tied to the raid or to what's left of Tun Perak's old network, as standard tradecraft. Not suspicion that the kill failed, simple loose-end cleanup, cast wider than just the raid's direct witnesses. |
| **8c. The mentor's death** | Cabral's people come for the mentor, having tracked him not merely as raid-adjacent but as a thread in Tun Perak's own network, a much sharper reason than simple witness cleanup, and a real loss to Tun Perak's own quiet effort against Cabral, not only to Angin. He dies defending Angin, a second father-figure loss, distinct in shape from the big brother's death (that one was collateral chaos inside the raid itself; this one is someone dying in direct, targeted defense of Angin specifically). **This threat thread stays open and unresolved through Act 1**: it carries forward live into Act 2/3, not tidied up by act's end. Angin never learns the mentor was anything other than a chance encounter. |
| **8d. The Helmsman** | Before the mentor's death, a **Dayak scout**: river-and-jungle competence turned to reef and current, headhunter-trained, from interior Borneo and a long way from his own longhouse, is the one who gives Angin the rudder of a kelulus: open water first, then the strait, then at night. No ceremony, per the Ascension ladder's own text, just the day he stops taking it back. Not a captain testing him so much as a fellow outsider recognizing another one; the Dayak has his own reasons for being this far from his own river, never fully explained, and finds in Angin someone who doesn't ask. This is Angin's first taste of being handed real responsibility by someone who isn't testing him, and it's what makes the mentor's death right afterward land harder: two men trusted him in close succession, and Angin loses the second of them within the same stretch, except this loss isn't death. When the Dayak's own path pulls him elsewhere for a stretch (upriver business, a debt of his own, left open), Angin is set adrift again, grieving the mentor and without either man's guidance to warn him off a bad berth, which is how he ends up crewing under the captain in Beat 9. The Dayak isn't gone for good, see his character sheet for how and when he rejoins as permanent crew. |
| **8e. The malim** | Somewhere in the same drifting stretch, running alongside the mentor's combat/siri training rather than replacing it, Angin falls in with a reclusive **malim**: a Micronesian former rebel against the Saudeleur dynasty of Nan Madol, who fled across an ocean after a failed uprising and has lived ever since as a pilot who takes almost no work and answers to no port. Where the mentor gives Angin doctrine for violence, the malim gives him doctrine for the water itself, reef-reading, star-paths, monsoon-timing, taught almost by accident, because Angin is the rare deckhand who doesn't laugh at an old foreigner's superstitions about water that "doesn't hold still." Unlike the mentor, the malim isn't killed by Cabral's cleanup, he's not raid-involved and stays outside that thread entirely. What passes between them is real seamanship, and, in unguarded moments, the nearest thing to a second mirror the book offers: a man with no origin teaching a man who's spent his whole life running from one, though neither of them says it that plainly. **Locked:** he doesn't die. Once he judges Angin's wayfinding sound enough to sail without him, the malim chooses to go home, whatever that costs him after so many years of exile, the pull of Pohnpei outlasts even the danger of returning. A rare clean, warm ending among Act 1's father-figure relationships, and a real answer, rather than an open question, to what happens to him. |
| **9. The First Ship (Angin's second kill, his real first chosen one)** | Crewing under a captain during a raid on what turns out to be a Malaccan diplomatic convoy, Angin discovers the captain attempting to rape a captive woman taken as cargo-adjacent, a Malaccan princess, daughter of Mahmud Shah, being sent under escort to the Siamese court as a peace-bride, intended to head off exactly the war that historically comes anyway in 1500. Angin kills the captain in direct application of what the mentor taught him days or weeks earlier, his first real use of siri as doctrine, not instinct, and takes the half-repaired kelulus, matching his established "won off a losing captain's debt" line. Framed as morally lawful, not a corruption arc: it confirms rather than breaks Angin's compass, and completes the contrast the outline has been building since Beat 6, he refused the sanctioned kill he was ordered to make (Tun Perak), and now completes an unsanctioned one that is entirely his own to make, for a reason he chose rather than one that was chosen for him. |
| **9a. The bride he doesn't return** | Angin doesn't hand the princess back, **locked reason:** she asks him not to. Once she's safe and it's clear he isn't going to simply hand her to the next authority he meets, she tells him plainly she doesn't want to go through with the marriage, doesn't want to go back to a court that was ready to spend her on a peace deal, and asks him to let her go rather than return her. Angin, already carrying the mentor's siri doctrine about honoring what's owed and what's asked, respects her stated will, a real moral choice, not an ambiguous judgment call. What he doesn't know: her non-arrival is read by Ayutthaya as a deliberate insult from Malacca, not a raid gone wrong, and becomes, underneath the real historical record, the fictional trigger for Ramathibodi II's invasion in 1500. A sixteen-year-old boy who did right by one woman's stated wish has, without understanding it, started a war. **This is the book's sharpest Butterfly Effect divergence yet**: real history explains that Siam attacked in 1500, not fully why the ceasefire failed when it did; the story fills that gap with Angin's own unwitting hand. |
| **9b. Nothing happens (a quiet beat)** | Deliberately paced against everything around it, no acquisition, no threat, no forward motion. Angin at anchor, a night or several, alone or nearly so, with a boat that's finally his and a dead captain's blood still fresh enough to think about. No resolution offered for the big brother's death or the mentor's death still to come; grief that hasn't had room to exist anywhere else in the outline gets its own space here, briefly, before the plot picks back up. The princess is aboard, unresolved, neither of them speaking much. This beat exists on purpose to slow the book down for one moment before Act 1's back half accelerates hard through Beats 10–14. |
| **10. The Nakhoda fork, raider first** | Now captaining his own kelulus, Angin resumes raiding with the same Orang Laut crew from Beat 1, opportunistic, whatever's weak or undefended, no fixed target type. Small-time, no ideology yet. Somewhere in this stretch, a raid goes wrong the way Beat 3 did, real resistance, not an easy hit, and Angin fights again, this time leading rather than following, the mentor's combat and siri no longer a single proof point from Beat 9 but a repeatable skill he draws on under pressure with a crew depending on him. Separately, the same stretch is where the Orang Laut connection stops being just "the crew he sails with" and starts being genuine reach: when a raid nearly goes bad against a target with more defenders than expected, it's word passed through Orang Laut channels, a strait-watcher's warning, a kinship tie called in without being asked twice, that gets Angin's crew clear before it turns into a second Beat 3. The first time the connections he was raised inside actually work *for* him as intelligence, not just as family. |
| **10a. The crew fills out** | Over this same raiding-and-recovering stretch, not three separate recruitments but one gradual accumulation, the way a real crew actually forms, three people join: a **Batak** fighter, picked up once the mentor's death leaves no dedicated protector, carrying a reputation (the real, documented Batak tradition of ritual execution-by-consumption) that does most of his fighting before it starts, and becomes permanent headfighter and bodyguard; a young **Minangkabau** woman living out *merantau*, the real tradition of deliberately leaving home to make a name before any claim to return with honor, who reads Angin's own ambition more clearly than anyone else aboard because hers is chosen, not forced; and the **Dayak** scout from Beat 8d, whatever pulled him away resolved or abandoned, rejoining for good as permanent helmsman aboard Angin's own hull this time, the same role he first showed Angin how to hold. None of it is ceremony, people simply stay once they've stayed long enough that leaving stops being the plan. |
| **10d. First friction** | A crew this new, this culturally mixed, doesn't run smoothly by default. Something real surfaces, the Batak's reputation unsettles the rest of the crew more than his loyalty reassures them; the Minangkabau woman's blunt refusal to simply follow orders without question chafes against Orang Laut crew hierarchy built on different terms; or the Dayak's return raises a question nobody quite asks aloud about where his loyalty was during the time he was gone. Angin has to actually manage people, not just accumulate them, his first real test of holding a mixed crew together through something other than shared profit, and an early, small-scale rehearsal for the much larger version of this problem waiting in Act 2 and 3's Sea-Lord alliances. |
| **11. The fence, Nina Chatu (Butterfly Effect divergence, flagged)** | Angin needs somewhere to move raided cargo and connects with a young, rising fence: **Nina Chatu**. This is a deliberate, explicitly flagged divergence, the real historical Nina Chatu is a Hindu/Kling merchant who doesn't emerge as a significant figure until after Malacca's fall in 1511, aiding the Portuguese. Everything about his presence here, over a decade earlier and in an invented role, has no historical basis and should be flagged the same way Tun Perak's survival is. The relationship is a genuine rivalry as much as a partnership, Nina Chatu is sharp, ambitious, and doesn't hand Angin anything he hasn't earned, which is exactly what makes him useful: over this stretch he becomes the closest thing Angin has to a teacher in trade and negotiation, the one skill set the Bugis mentor and the malim don't cover. Pricing cargo, reading a buyer, knowing when to hold a shipment for a better season, Angin picks up a Gujarati trader's shrewdness secondhand, through a rival who's teaching him without ever quite meaning to, because a sharper Angin is also a more useful and more dangerous partner. The two build up together, small-time to bigger, over this stretch. |
| **11a. The Brunei run** | With the malim's wayfinding and Nina Chatu's sharpening eye for a market both now real assets, Angin starts running a specific, repeatable trade lane: Brunei to Malacca, high-quality goods delivered reliably and priced better than the competition can match. This is Angin's first real accumulation of wealth that isn't laundered plunder, a legitimate, working trade route he actually built, not one he inherited or stole. It's also the first place his two teachers' skills compound rather than operate separately: the malim gets him there faster and safer than rival hulls manage, and Nina Chatu's lessons are what let him actually profit once he arrives. The **Bajau** diver joins during this same run, picked up crewing unfamiliar reef water, free-diving and salvage work no Malay-tradition sailor trains for, a second "belongs to the water" voice distinct from Angin's own Orang Laut upbringing. |
| **11b. The beach across the strait** | Profit from the Brunei run buys Angin his first land: a small patch of Sumatran coast, a beach directly across the strait from Malacca itself. Modest and undeveloped, but his, bought, not raided, not inherited, not married into (the Ledger's *marriage* tag doesn't apply here; this is the book's first entry under a different origin entirely, plainly bought with trade profit). Geographically sharp without either of them fully realizing it yet: a foothold in sight of the very chokepoint the whole book's Central Conflict revolves around, years before Angin has any reason to think in those terms. |
| **12. The Nakhoda fork, trader second** | Working the fence relationship over time is how Angin builds his real trading front, legitimate-seeming cargo runs, a name as a pencalang, which exists chiefly to launder what the raiding side produces. Publicly trader, privately raider, from this point forward. |
| **12a. The transaction** | With his trading front established, Angin, sixteen, brokers a legitimate cargo deal that puts him face to face with an agent of **Tun Perpatih Putih**: Tun Perak's own brother, 6th Bendahara of Malacca since 1498. The first real showcase of Angin's negotiating skill on the page: reading the room, pricing the cargo, holding his nerve against someone with actual court authority behind him. |
| **12b. The suspicion** | War is coming, 1500 approaches, and Ramathibodi II's Siam is a live threat Malacca's weak, anxious court is trying not to provoke, unaware their own peace-bride never arrived because of a raid, not a refusal. Word reaches the bendahara's circle that an unlicensed raider has been hitting shipping in the strait, including, unbeknownst to anyone naming him, the very convoy that lost the princess. Angin's raiding has never touched his trading name, but his growing profile makes him a plausible match. Tun Perpatih Putih, having ordered a ceasefire policy to avoid dragging Malacca into open war it can't afford, treats this as a live threat to that policy. Treason is the word used, and this time the accusation is circling far closer to the truth than anyone, including Angin, fully realizes. For the first time, Angin is a named suspect to a court official, not an anonymous face in a raiding crew, a sixteen-year-old facing an accusation that could end everything before he's even earned the title Nakhoda, and that is, in ways nobody in the room can prove, entirely correct. |
| **12c. The invasion answers it** | Before the accusation can be formally acted on, Ramathibodi II's fleet, sailing in response to a peace-bride who never arrived, for reasons Malacca's own court never learns, actually arrives in 1500. Angin, sixteen, fights in the port's defense during the attack, and his combat and siri, drilled into him by the Bugis mentor, mean he fights hard and visibly enough that he starts to be talked about, a name, if not yet a face anyone in power connects to the raider they suspected days earlier: the boy who cut down Siamese attackers defending the very city whose court was about to name him a traitor. Among those who see it firsthand: **Hang Tuah** himself, roughly seventy and commanding Malacca's defense in person, catches sight of a boy cutting a path through the attackers with a discipline no untrained raider should have, clocks it, files it away, says nothing at the time. Neither of them knows it yet, but this is the first time Malacca's most legendary living warrior has any reason to remember Angin's face. Tun Perpatih Putih dies during the attack, his real death that year barely documented in the histories the roster otherwise follows, the same kind of gap Tun Perak's death-window already exploits. The threat dissolves not through anything Angin does, but because the war he unknowingly caused arrives and ends the man circling the truth about him, and the same war hands him, in the same breath, the beginning of a real reputation. Malacca survives the invasion bloodied, forced into tribute to Siam, and Angin, sixteen, walks away from a treason accusation that was closer to correct than false, saved by the very war his own hand set in motion, and starts to become locally known as something entirely different: not the raider nobody could name, but the boy who helped hold the port. A formative lesson at a formative age, and a darker one than he knows: sometimes survival isn't earned, it's granted by consequences a man never sees the shape of, and the same consequence that could have destroyed him is what starts to make him a name, all under the same unresolved irony nobody, including Angin, ever connects. |
| **13. The merchant threat** | Having personally handled the laundered goods throughout, Nina Chatu is the one who threatens to expose Angin's double life, not a new blackmailer, the same fence, cashing in leverage he's held the whole time. Angin buys his silence. Notably the first threat in the book Angin resolves without violence, immediately after two chapters defined by violence (a refused kill, a committed one). |
| **14. The Singing Admiral (Act 1 finale, soft quest, first Sea Lord encounter)** | By 1502, eighteen, running the Brunei trade lane established in Beat 11a, Angin's route finally puts him in Brunei's own waters at the wrong, or right, moment to be noticed by **Bolkiah** himself: Sultan of Brunei, golden-age ruler, a fleet and a court's wealth stretching from the Philippines to the edge of Java. Not a summons, not a debt, not vassalage, a small, almost incidental task handed down through an intermediary precisely because Angin is disposable enough that failure wouldn't matter to anyone but him: deliver something, verify something, settle some minor dispute a Sea Lord's own court doesn't consider worth a real officer's time. **The real reason Angin is noticed at all:** Bolkiah is one of the sharpest political minds in the region, and has quietly suspected for some time that Tun Perak never actually died, old trade patterns that don't fully add up, a beach near Malacca nobody official claims, rumors too specific to be nothing. A young trader running unusually clean, well-timed routes near that same stretch of coast is exactly the kind of loose thread Bolkiah's court quietly pulls on. Angin has no idea he's being studied for this reason rather than simple opportunism, the task is real, but so is the test underneath it, and Bolkiah learns nothing conclusive from it, which is itself the point: Angin genuinely doesn't know anything, and it shows. Angin completes it competently, unremarkably, and it's the completing that matters least. What actually lands is the scale: a harbor that reorganizes itself around one man's arrival without being asked to, a retinue whose upkeep alone could run Angin's entire trade route for a year, a court where wealth and command are so total they've stopped needing to be displayed. Bolkiah is sometimes called, in the ports that trade with him, **the Singing Admiral**: a title equal parts reverence and legend, the sound of his own fleet's approach said to travel ahead of the ships themselves. Angin, for the first time, isn't measuring himself against a captain, a fence, or a bendahara's agent, he's standing next to a Sea Lord, seeing exactly what the top of the ladder actually looks like, and understanding, without anyone telling him, precisely how far "Nakhoda" still is from that. **This is the moment The Boy actually ends**: not through ceremony, per the Ascension ladder's own rule, but through Angin seeing, for the first time, both what he's already built and how small it still is against a real Sea Lord's aura. He leaves Brunei with nothing material, no title, no debt, no quest reward beyond having been noticed at all, but Act 2 opens with him already having decided, quietly and for himself, that Sea Lord is not a rank he's stumbling toward. It's the one he's chosen to climb for. Bolkiah, for his part, files Angin away as unconnected to Tun Perak, for now. |

#### Act 2, Nakhoda to Sea Lord (1502 → 1511)

Chapters 21–65. Covers the remaining Ascension rungs through Sea Lord Minimum, jong flagship, two more hulls, a sworn vassal nakhoda, a standing armed component, independent capital, and visibility to power. Every First Contact is placed somewhere in this act, so each has years to mature before its Second Contact payoff in Act 3. This covers all three tiers who count as Sea-Lords for this purpose: seated Sea-Lords, the vassals serving them, and the rival-mirror nakhoda climbers who will eventually reach Sea Lord status themselves within the book's own timeframe. See the Chapter-by-Chapter Distribution table below for exactly who lands where.

#### Act 3, Sea Lord to the Sea Emperor Temptation (1511 → 1521)

Chapters 66–100. Opens on Malacca's power vacuum and the chokepoint opportunity it hands Angin. Runs the Second Contact payoffs for every figure planted in Act 2, then the Sea Emperor temptation itself, made completely real, then refused, per the locked ending in Central Conflict. Closes in 1521.

#### Chapter-by-Chapter Distribution

20 people total. Mansur Shah I of Pahang is excluded, Two Contacts already notes his second contact is tentatively preempted by historical events overtaking him rather than resolved through argument. Ramathibodi II and Cabral (role: external) are also excluded, backdrop pressure rather than a worldview relationship with Angin. Tun Perpatih Putih is excluded for the same reason as the placeholder big brother and mentor, his thread closes within Act 1 (dies in the 1500 invasion before any Second Contact could occur) rather than carrying forward as a Sea-Lord relationship.
Reordered to follow the actual relationship graph in Connections rather than a clean category-by-category march. Each contact chains off the last through a real tie (rivalry, tension, trade, vassalage, family, or a documented future link) wherever one exists; a few deliberate breaks (Lapu-Lapu, Po Kabih, Hang Nadim, none with a recorded tie to anyone else on this list) sit at the open, midpoint, and close of Act 2 rather than clustered together, acting as fresh threads rather than dead ends. First and Second Contact orderings are independent of each other, the payoff sequence in Act 3 doesn't mirror the plant sequence in Act 2, so who resolves early versus late is its own decision, not an echo. Bolkiah's ch. 22 First Contact isn't a cold introduction: Act 1's finale (Beat 14, ch. ~20) already put Angin in front of him once, incidentally and without a real relationship formed. Two chapters later, being handed an actual task reads as continuity rather than coincidence.
Every First Contact now spawns a small quest, and every quest resolves into a concrete reward a few chapters later, tagged to a real category from The Ledger. This is what actually drives Angin's accumulation forward chapter by chapter, rather than the Ledger categories filling in off-page. Some rewards are material (a trade tie, a title, coin); several deliberately aren't, pure Reputation/Legend entries, since not every relationship should pay in the same currency.

| # | Figure | First Contact (ch.) | Quest | Reward (ch.) | Ledger Category | Second Contact (ch.) |
|---|---|---|---|---|---|---|
| 1 | **Lapu-Lapu** | 21 | Prove himself trustworthy to a datu who trusts almost no outsider on principle | 24, Lapu-Lapu's grudging respect; an unofficial pass through Visayan raiding water | Allies | 70 |
| 2 | **Bolkiah** | 22 | Carry a discreet message into Brunei's court without a resident merchant's help | 25, a minor trade concession, his first taste of Bolkiah's networked-alliance model | Debts Owed to Him | 69 |
| 3 | **Bayanullah** | 24 | Broker a pearl shipment Sulu doesn't want traced back to its actual buyer | 27, a standing arrangement with Sulu's pearl trade, small and renewable | Money / Wealth | 71 |
| 4 | **Shariff Kabungsuwan** | 26 | Help a still-unproven claimant in Johor verify a lineage nobody can fully confirm | 29, a favor owed by a man who will one day found a sultanate, paid off decades later | Debts Owed to Him | 90 |
| 5 | **Al-Mansur** | 30 | Move a clove shipment through a blockade Ternate's own ships can't risk running | 33, first real foothold in the clove trade, a fraction of a monopoly but real | Trade Monopoly / Chokepoint Control | 68 |
| 6 | **Gurabesi** | 31 | Settle a dispute between Biak warriors and a Malay crew without bloodshed | 34, Gurabesi's personal respect and a standing invitation into Waigeo's waters | Allies | 73 |
| 7 | **Tumapaqrisiq Kallonna** | 34 | Deliver intelligence on Bone's fleet movements ahead of Gowa's own scouts | 36, first formal recognition from Gowa, an early and minor Title | Titles / Recognized Rank | 85 |
| 8 | **Mahmud Shah** | 38 | Survive a court audience without giving the sultan reason to remember him unfavorably | 40, a minor concession at Malacca's harbor, nothing that would draw Tun Mutahir's notice | Institutions | 66 |
| 9 | **Tun Mutahir** | 39 | Untangle a cargo dispute the bendahara's own office botched | 42, a quiet debt the bendahara now owes him, unspoken but real | Debts Owed to Him | 67 |
| 10 | **Hang Tuah** | 42 | Earn one measured nod from the oldest living legend in Malacca's court | 45, an old warrior's private assessment, recognition rather than alliance | Reputation / Legend | 87 |
| 11 | **Orang Kayo Hitam** | 44 | Help a brand-new ruler secure his first season of tribute compliance | 48, a trade tie with Jambi, forged in the same year as his own accession | Trade Monopoly / Chokepoint Control | 75 |
| 12 | **Ali Mughayat Syah** | 47 | Outrun a rising rival captain to the same North Sumatran buyer | 50, a wary mutual respect, the first hint of how alike their two climbs really are | Reputation / Legend | 72 |
| 13 | **Po Kabih** | 49 | Carry word to a kingdom everyone else has stopped bothering to visit | 51, a minor, low-value trade tie nobody else wanted enough to establish first | Allies | 91 |
| 14 | **Raden Patah** | 50 | Prove useful to a founder-king building institutions from nothing | 52, a small foothold in Demak's still-forming trade network | Institutions | 76 |
| 15 | **Sri Baduga Maharaja** | 52 | Move pepper out of Sunda Kalapa without favoring Demak's rival merchants | 55, a pepper contract, and quiet notice from a court that rarely deals with outsiders | Money / Wealth | 78 |
| 16 | **Syarif Hidayatullah** | 55 | Witness, without taking a side, an argument about faith and statecraft | 58, nothing material, a first wary understanding of Cirebon's religious-political fusion | Religion / Legitimacy | 81 |
| 17 | **Udara** | 56 | Deliver a formal courtesy to a court that commands ritual deference but little else | 58, a Majapahit-sanctioned nod, legitimacy without leverage but legitimacy nonetheless | Sacred / Supernatural Legitimacy | 80 |
| 18 | **Dalem Waturenggong** | 60 | Bring proof of good conduct back across the strait to a court that rarely needs outsiders | 62, a standing, low-friction trade tie with Bali, stable and unspectacular | Allies | 84 |
| 19 | **Pati Unus** | 62 | Cross paths, however briefly, with a child who will one day be Demak's own admiral | 65, no material reward, just the first faint outline of the mirror the book keeps building | Reputation / Legend | 88 |
| 20 | **Hang Nadim** | 65 | Meet, without either quite knowing what to make of the other, history's other unsettled name | 65, no material reward, the closing note of Act 2, a mirror recognizing a mirror | Reputation / Legend | 93 |

Chain logic: Lapu-Lapu opens with no prior tie (a clean first contact with no baggage attached). Bolkiah→Bayanullah follows their rivalry; Bolkiah→Shariff Kabungsuwan follows their documented future tie. Al-Mansur→Gurabesi→Tumapaqrisiq Kallonna follows Gurabesi's tension with Al-Mansur and Kallonna's trade tie to him. Mahmud Shah's whole cluster (Tun Mutahir, Hang Tuah, Orang Kayo Hitam, Ali Mughayat Syah) follows his four direct connections. Po Kabih breaks the chain deliberately as a breather with no tie to anyone. Raden Patah's cluster (Sri Baduga Maharaja, Syarif Hidayatullah, Udara, Dalem Waturenggong, Pati Unus) follows his five documented connections. Hang Nadim closes Act 2 as the second deliberate break, fitting, since he and Angin are established elsewhere as mirrors of each other with no plot-mechanical tie required. Second Contact order was assigned independently rather than reusing this sequence, so payoff timing doesn't just echo plant timing.

#### What Still Needs Deciding

- **How Angin is entangled in the Tun Perak divergence**: **Locked.** See Act 1, Locked Opening Beats above: Angin is part of the Orang Laut raiding crew sent (via a chain tracing back to Cabral) to kill Tun Perak; he spares him instead.
- **Which Sea-Lord First Contact the jade amulet gets recognized at**: locked to Act 2, tied to a specific First Contact chapter, but the specific figure isn't chosen yet. Likely candidate pool: figures with a real tie to old Malacca-court politics (Mahmud Shah, Tun Mutahir, Hang Tuah), since they're the ones most plausibly positioned to recognize something of Tun Perak's.
- **Which fork at each ship-ladder branch**: **Partially locked.** Nakhoda rung resolved: Angin takes both, publicly pencalang (trader) / secretly penjajap (raider), raider first with trading built second as a laundering front through fence Nina Chatu (see Act 1 beats above). Still open: malangbang vs. ghurab (Rising Nakhoda), lancaran vs. karakoa (Master Nakhoda).
- **The Boy / drifting stretch wants more depth**: **Further addressed.** The raid now opens with an argument, a big-brother figure, and his death (Act 1 beats 1–5). The drifting stretch now also carries a Bugis mentor who teaches Angin combat and siri, and dies defending him from Cabral's cleanup operation (Act 1 beats 8–8c). Still open: both the big brother and the mentor need real names and characters (currently placeholders, see their character sheets).
- **Cabral's cleanup thread stays deliberately open**: his people are quietly eliminating anyone present at the Tun Perak raid (tradecraft, not suspicion) and killed the Bugis mentor for it in Act 1. Not resolved by end of Act 1; needs a decision on how/when/whether it resurfaces in Act 2 or 3, and whether Angin ever learns the mentor's death was tied to this rather than a random ambush.
- **What Angin's own domain becomes after 1511**: which specific holding (from the Ledger's Open Log, once populated) is positioned to become the new chokepoint.
- **Malacca's inheritor motive**: still genuinely open per Central Conflict. Needs a name and a face.
- **Exact chapter placement within each act**: nothing inside the three acts has been broken into beats or scenes yet, and with 20 First/Second Contact pairs now required rather than 9, fitting all of them into ~45 Act 2 chapters and ~35 Act 3 chapters will likely mean several land in the same chapter rather than each getting a dedicated one.
- **The 20 quests and rewards above are first-draft placeholders**: plausible given each figure's established traits, but not written as actual scenes yet. Several (Syarif Hidayatullah, Udara, Pati Unus, Hang Nadim) deliberately pay in Reputation/Legend rather than anything material; worth checking that split feels right once real chapters exist.
"Every rung on the ladder is a chapter waiting to happen.
The only rung with no name is the one he never takes."

### Tab: Two Contacts

The shape of every relationship
Two Contacts
How Angin's Bond With Each Sea-Lord Is Built to Clash
Nobody on the roster is a beginner, and nobody is a villain waiting to be unmasked, see The Game. Every Sea-Lord Angin climbs toward is a great man by his own lights, with his own honest answer to what a life well spent in the Spice World looks like. Angin has one too. The device that makes those answers matter is a two-part structure repeated across every major relationship on the ladder:
- **First Contact**: a soft, personal, low-stakes mismatch in worldview, usually about something immediate and small: whether to trust a stranger, how to handle an insult, what a debt is worth. Neither party has fully articulated a philosophy yet. They just see the same situation differently.
- **Second Contact**: years later, both worldviews have matured into a full position on what the Spice World itself should become. What looked like a minor disagreement about trust or caution has grown into a genuine, unresolvable difference about the future, and by this point, both sides have the power to actually act on what they believe.
No one is right in either contact. The device only works if both positions are defensible on their own terms, which is why Character Sheets and the Almanac's timeline matter here: a Sea-Lord's second-contact philosophy should follow from what has actually happened to him by the book's opening in 1498, or will happen to him before its close in 1521, see Chapter Outlines for exactly when each contact lands.

#### Angin's Own Position

By second contact, Angin's own maturing worldview is that **the Spice World must remain part of global trade, but united under one front, standing as an equal power to whatever comes from outside it**, not isolation, and not simple absorption into someone else's network. This is the position every other second contact below is measured against.

#### Worked Example, Lapu-Lapu

|  | First Contact | Second Contact |
|---|---|---|
| **Angin** | It's risky to trust, but the benefits outweigh staying skeptical and alone. | The Spice World must remain part of global trade, united under one front, standing as an equal power to external powers. |
| **Lapu-Lapu** | Better to be wary than to be stabbed and left with no course for justice or vengeance. | The Spice World must isolate, and a great internal power must enforce that isolation. |

The line from one to the other is direct: a young man's caution about being personally betrayed hardens, after watching Malacca fall in 1511, into a doctrine of civilizational self-defense. Lapu-Lapu doesn't change his mind between contacts, he simply gets proof.

#### The Roster's Positions

The rest of the roster, drafted to the same pattern. Working hypotheses, revised as chapters take shape, not locked canon.

| Sea-Lord | First Contact | Second Contact |
|---|---|---|
| **Al-Mansur** (Ternate) | Power doesn't need to be loud or large, only necessary, the world comes to whoever holds the one thing it can't do without. | The Spice World's monopolies should stay fragmented and jealously guarded island by island, concentrated leverage in a few hands is the only thing that stops any single outside power from ever controlling all of it at once. Directly opposes Angin's united front, since unity would dilute the one thing that makes Ternate matter. |
| **Bolkiah** (Brunei) | Real power is built through relationship and obligation, not conquest, a network outlasts a raid. | The future belongs to whoever out-networks the newcomers, not resisting them, not uniting against them, but absorbing and out-marrying and out-trading them the way Brunei has absorbed every rival so far. A third path against both Angin's unity and Lapu-Lapu's isolation: assimilation as strategy. |
| **Mahmud Shah** (Malacca) | Inherited wealth is still wealth, a throne doesn't need to have been built by the man sitting on it to be worth defending. | The old order, mandala, tribute, daulat, is sufficient and eternal, and needs no reform. A belief refuted by Portuguese cannon in 1511, not by any argument Angin could make first. |
| **Tun Mutahir** (Malacca) | Authority is inherited through office, and given time, the substance follows the title. | The court itself, its factions, its old loyalties, its inherited grudges, matters more than any single ruler or outsider. Survival means outlasting rivals inside the walls, not solving problems outside them, a worldview that stays turned inward even as the real threat gathers offshore. |
| **Bayanullah** (Sulu) | A small power survives by being indispensable, not by being strong. | No unity, no isolation, small polities should hedge everywhere at once, trading with anyone who'll pay, tied permanently to no single front or ideology. Pragmatic refusal to ever fully commit to either Angin's or Lapu-Lapu's vision. |
| **Tumapaqrisiq Kallonna** (Gowa) | Regional dominance is only a matter of time and patience, Gowa's moment hasn't arrived yet, but it will. | Strength earned through rivalry (Bone) is the only strength worth having. A polity untested by a real local enemy is soft, and Gowa's future greatness depends on winning that fight before it worries about anyone from outside the archipelago at all, indifferent to Angin's global vision because Kallonna's whole focus stays regional. |
| **Syarif Hidayatullah** (Cirebon) | Political power and religious mission are inseparable, converting hearts is itself a form of statecraft. | The Spice World's real unity won't come from trade agreements or a secular front, but from a shared faith, Islam spreading court by court is the only front capable of actually holding against an outside power in the long run. A fourth alternative to Angin's egalitarian brotherhood: unity through religion instead. |
| **Orang Kayo Hitam** (Jambi) | Courage proves itself through action, not through waiting for legitimacy others must grant. | Legitimacy earned by force is more durable than legitimacy inherited by blood or title, and this applies to the whole Spice World, not just his own throne. The sea-lord whose second contact sits closest to Angin's own bootstrapped worldview, positioned for mutual respect rather than collision. |
| **Mansur Shah I** (Pahang) | A title held before it's earned is still worth holding onto, and worth growing into. | Tentatively planned to arrive too late, his "second contact" may be preempted by the historical events overtaking him (Malacca's fall, his marriage to Mahmud Shah's daughter) rather than resolved through argument at all. |
| **Sri Baduga Maharaja** (Sunda) | Peace bought through accommodation is still peace, a king doesn't have to win every argument to keep his court whole. | The old Hindu-Sundanese order deserves to endure on its own island even if it can't compete on every other shore, survival through graceful separateness, not through joining anyone's front. A quiet fifth answer distinct from Lapu-Lapu's militant isolation: not defiance, just insistence on being left alone. |
| **Raden Patah** (Demak) | Something built new can be more legitimate than something merely inherited, if it's built for the right reasons. | Islam spreading court by court, sultanate by sultanate, is itself the unifying front the Spice World needs, Angin's secular unity is a lesser, weaker echo of what Demak is already accomplishing through faith. Shares real ground with Syarif Hidayatullah's position, but arrived at through founding a kingdom rather than converting one. |
| **Udara** (Majapahit rump) | A crown taken by conquest can be worn as legitimately as one inherited by blood, deeds outweigh descent. | Legitimacy outlives leverage, the old name still means something even after the ports, trade, and soldiers are gone, and a court's job is to keep that memory alive for whoever eventually needs it again. Neither unity nor isolation; a bet that outlasting matters more than acting, since Majapahit's name has already survived one collapse. |
| **Dalem Waturenggong** (Bali) | Continuity is its own kind of strength, a court that simply keeps working is worth more than one chasing every new opportunity. | Bali's old order should hold exactly as it is, watching the rest of the archipelago's convulsions from across the strait rather than joining any front, Angin's included. Neither conquered nor converted, and in no hurry to become anyone's ally either, the position of a kingdom whose golden age is still ongoing and sees no reason to risk it. |
| **Po Kabih** (Panduranga) | Surviving intact is worth more than expanding, a kingdom that's already lost everything once learns not to reach for more than it can hold. | Unity is a luxury for powers that haven't already been broken once, Panduranga's entire philosophy is endurance without ambition, and Angin's call to stand as an equal to outside power asks for exactly the kind of reach that got Vijaya sacked in the first place. The roster's clearest rebuttal to Angin's optimism, born from a defeat Angin himself hasn't suffered yet. |
| **Hang Tuah** (Malacca) | Loyalty belongs to the throne itself, not to the man who happens to sit on it, service outlasts any single reign. | The old order's continuity matters more than whether it deserves to continue, even watching Malacca fall in 1511, his answer isn't reform or unity but simply serving whatever throne remains standing afterward. A worldview that survives the very event (Portuguese cannon) that refutes Mahmud Shah's, since Hang Tuah's loyalty was never conditioned on the old order being right, only on it being the order. |
| **Gurabesi** (Waigeo/Tidore) | Trust is earned through cunning and proven usefulness, not simply offered, a bridge between two worlds has to keep proving it can hold weight. | Alliance across difference (Papuan Waigeo, Islamic Tidore) works better than unity under one front, Angin's call for a single Spice World standing together asks everyone to become the same thing, where Gurabesi's whole career has proven that staying different and still allied is stronger. A working answer Angin might eventually learn from rather than argue against. |
| **Pati Unus** (Demak, heir) | A name handed down is still a name worth living up to, inheritance isn't disqualifying, it's a debt to be repaid in full. | Glory, not survival, is the measure of a life well spent, dying young in a great cause against Portuguese Malacca is a better ending than living to be old and forgotten. The photonegative of Angin's own eventual position, argued not through debate but through the shape of his own historical death, the clearest possible rebuttal to everything Angin's quiet, unremembered ending will represent. |
| **Hang Nadim** (Johor, unrisen) | Two inherited legacies pulling in opposite directions can be carried at once, a man doesn't have to resolve his contradictions before he acts on them. | Reclaiming what was lost is worth fighting for even against hopeless odds, where Angin's unity looks forward toward what the Spice World could still become, Hang Nadim's later campaigns against Portuguese Malacca look backward toward what was taken. Two young men who started this era in the same unsettled place, arriving at nearly opposite relationships with loss. |
| **Ali Mughayat Syah** (North Sumatra, unrisen) | Proximity to wealth is opportunity, not obligation, a rising man takes what an older, complacent power isn't using. | A single, disciplined sultanate built through conquest and consolidation can do more against outside power than any loose alliance of equals, Angin's unity-of-many is slower and weaker than Aceh's eventual unity-of-one. The most direct ideological collision on the roster, since both men are answering the same threat with opposite theories of how consolidation should work. |
| **Shariff Kabungsuwan** (Mindanao, unrisen) | A claimed lineage, even one nobody can fully verify, is worth building a life on if it opens doors that would otherwise stay shut. | Conversion and marriage build more durable legitimacy than conquest or trade ever could, where Angin's unity is built on shared interest against outside pressure, Kabungsuwan's eventual sultanate is built on shared faith and blood, patient enough to outlast any single decade's crisis. Distant enough from Angin's own gauntlet that this second contact is more echo than confrontation, proof of a parallel answer, not a rival one. |

"Every man on this water has already decided what the Spice World should become.
Angin is the only one still deciding what he'll do about all of them at once."

### Tab: The Game

The wider board
The Game
Everyone on the roster is already playing it, and the pieces are Nakhodas
Look at the roster again, and something becomes obvious: nobody on it is a beginner. Lapu-Lapu holds Mactan against all comers. Bolkiah has expanded Brunei further than any sultan before him. Al-Mansur sits on the one clove monopoly the whole world wants. Mahmud Shah inherited the richest port in the spice trade. Every name on this map has already climbed the ladder in The Nakhoda, or was born onto a throne that plays the same game from a different seat. **They are not people waiting to become Sea Lords. They already are Sea Lords, sultans, and admirals. The climb is over. The Game is what's left.**
And the Game has exactly one prize on the table: **who controls the spice trade.** Not "who rules the most land", a land empire can press on the board's edges without ever actually playing for a seat at it. Not "who has the biggest navy", a navy with nothing to escort is just an expense. The only throne that matters here is the one built from cloves, nutmeg, pepper, and the straits and ports that move them. Every player at this table is measured by the same yardstick: how much of that trade passes through hands they control.

#### Why This Game Could Only Be Played By Insiders

Here is the rule that makes every other rule possible, and the roster is living inside it without knowing it: **before 1511, no outsider can simply walk up to this table and sit down.** The spice trade in 1500 is a closed circuit, Malacca, Ternate, Brunei, Aceh, Gowa, and every smaller court between them are all already inside the system, trading, warring, marrying, and raiding each other, but always *within* the same board. A Ming fleet can visit. A stray Gujarati or Arab trader can dock. An Ayutthaya army can even march south and threaten Malacca outright. But none of these outside forces has yet arrived with the intention, and the means, of simply *taking a seat by force* and rewriting the rules for everyone else.
This is the distinction worth holding onto: Ayutthaya, Ming China, and the Indian and Arab merchant networks are not *players* in the Game. They are the Game's foreign customers and foreign pressure, forces that buy, sell, threaten, and occasionally invade, but never actually compete to control a single port or spice route inside the Nusantara itself. Ramathibodi II wants Malacca humbled or reclaimed as a tributary; he has no interest in becoming a spice-trade player among Ternate and Gowa. That's precisely what makes him dangerous in a different way than any rival sultan, he's pressure from entirely outside the system the rest of the roster is playing within.
That is the single fact that makes 1500 a golden hour rather than just another year. The Game, for exactly this narrow window, still belongs entirely to the people already playing it. Every player on the roster is operating under the unspoken assumption that this will always be true, that the board is closed, that the rules are theirs, that whatever rivalries and wars play out, they play out *within the family*.
1511 breaks that assumption for good. Afonso de Albuquerque doesn't join the Game, he ends the version of it these players are all still playing, and starts an entirely different one, played by different rules, with a seat that was never on offer.

#### The Players and Their Openings

Every court on the roster is running its own strategy at this same table, not fighting the same war, but competing for the same underlying prize:

| Strategy | Who's Running It |
|---|---|
| **The Chokepoint** | Malacca (Mahmud Shah) doesn't grow a single spice, it taxes and ports everyone who has to pass through its strait. Control the doorway, and you don't need to control what's behind it. |
| **The Monopoly** | Ternate (Al-Mansur) holds the one resource, cloves, that literally cannot be grown anywhere else on Earth. He doesn't need a large kingdom or a large fleet; the trade comes to him. |
| **The Web** | Brunei (Bolkiah) plays a longer game of marriage alliances and tributary datus stretched across Borneo, Sulu, and Luzon, power as a network, not a single throne. |
| **The Succession Gambit** | Demak (Raden Patah) is building an entirely new sultanate out of a fallen empire's coastal remains, betting that Islam and a new capital beat clinging to Majapahit's exhausted name. |
| **The Holdout** | Majapahit's rump court (Udara) plays defense, no navy, no coastline of consequence, betting only on the prestige of a name two centuries old to keep from being fully erased. |
| **The Refusal** | Lapu-Lapu doesn't play the trade game at all, he's the piece on the board that answers to no larger strategy, a reminder that not every player is bargaining. Some are just holding their ground. |

#### The Customers at the Door

Not everyone pressing on the board is playing for a seat at it. Three kinds of outside force show up constantly in 1500 without ever becoming players themselves:

| Force | What They Want |
|---|---|
| **Ayutthaya (Siam)** | Not a spice-trade competitor at all, a land empire with unfinished business. Ramathibodi II wants Malacca humbled or reclaimed as a tributary the way it once was, not a clove monopoly or a strait to tax. His invasion fleet is a threat to a specific player, not a bid to join the game those players are playing. |
| **Ming China** | The largest customer in the room, not a competitor for it. Tribute missions, porcelain, silk, and a demand for spices that every player on this board is racing to satisfy, but China isn't contesting anyone's port or route, just buying from whoever wins. |
| **Indian & Arab Traders** | The other end of the pipeline, cloth, horses, and Islamic scholarship flowing in, spices flowing out, centuries of relationships that make Malacca and Aceh rich as middlemen. They dock, they deal, they leave. They never try to hold a strait. |

These three are exactly why the "no outsider" rule matters as much as it does. Customers and pressure from the edges are old news by 1500, normal weather the Game has always had to account for. What none of these forces have ever done, and what makes 1511 the true rupture, is show up intending to *become a player*, to hold a port, tax a strait, or run a monopoly as one more piece on the board rather than someone buying from the pieces already there.

#### The Pieces They Move

None of these players moves cargo, fights a raid, or opens a new route personally. They move **Nakhodas**: the ship-owning captains who actually sail the strait, run the spice, and bleed when a boarding action goes wrong.
A Sea Lord's fleet is his hand of pieces on this board. Send a squadron of kelulus to harass a rival's trade route, and the men crewing them never know they're a move in someone else's game, they know only that the pay is good and the captain gave the order. Marry a fleet-owning nakhoda's daughter into a sultan's court, and that entire fleet just changed which player it serves, whether the nakhoda himself agreed to the reframing or not.
This is the quiet tragedy sitting underneath the mythos in The Nakhoda: the free man who climbed to escape being anyone's pawn spends his highest years as the most valuable pawn on the board. The Game doesn't have a place for ships that answer to no one, it only has room for players and the pieces those players move. There is, perhaps, one relationship the Game has no way to move against: see The Unseen, The Jade-Bound.

#### Story Engines

The Game is strategy; the mythos is one man's arc. Between them sits the layer stories are actually built from, repeatable situations the era generates on its own, the way the Wild West generates stagecoach robberies and the Age of Piracy generates mutinies. Each of these can happen in any port, to any crew, in any year:

| Engine | The Situation |
|---|---|
| **The Monsoon Layover** | The winds reverse twice a year, and between them, nobody sails far. Rival crews, stranded merchants, and enemies with long memories are locked in the same port for months with nothing to do but wait, gamble, scheme, and settle scores. Every entrepôt becomes a pressure cooker on a schedule the whole world knows in advance. |
| **The Judgment of the Syahbandar** | Two crews claim the same cargo. A foreign trader accuses a local captain of short-weighting. A duel broke out on the jetty and someone important is dead. The harbormaster must rule, and his ruling is shaped by every alliance, bribe, and grudge in the port. Justice here is real, but it is never neutral. |
| **The Race for the Price** | Nutmeg bought in Banda is a tenfold profit in Malacca, for whoever lands it *first*. Two holds full of the same cargo, one strait, one closing monsoon window. The purest form of the era's thrill: navigation, seamanship, and nerve in a straight line. |
| **The Marriage Voyage** | A bride, a dowry, and an alliance between two courts, all of it aboard one ship, crossing water where raiders know exactly what she carries and what her safe arrival will change. Half diplomacy, half convoy action, and the future of two players riding on one hull. |
| **The Debt Come Due** | Voyages run on credit, the resident merchant financed the cargo, the crew sailed on promised shares, the shipyard is owed for the refit. One bad run and a nakhoda owes three dangerous people at once. What he does next, flee, raid, bargain, or sell his loyalty to a Sea Lord, is the hinge of a hundred stories. |
| **The New Flag in Harbor** | A ship arrives flying colors nobody recognizes, asking questions nobody likes, about defenses, about prices, about who really rules here. In 1500 it's a curiosity. Every year after, it's a countdown. The era's dramatic irony, delivered one strange sail at a time. |

"The throne was never the prize. The strait was.
And for one narrow century, only the people already standing on it were allowed to play for it."

### Tab: The Port

Street level
The Port
Where the Spice World Actually Happens, the Rooms, and the People In Them
The Game is played from thrones and stern-decks, but it is *felt* in the port. Every era-setting has its human-scale stage, the Wild West has the saloon and the main street, the Golden Age of Piracy has Nassau's taverns, and the Spice World's stage is the harbor quarter of a great entrepôt: Malacca's waterfront, Gresik's godown row, Brunei's water-village lanes. This is where a nakhoda's voyage begins and ends, where reputations are made over scales and ledgers, and where every archetype below crosses paths whether they want to or not.

#### The Places

| Place | What Happens There |
|---|---|
| **The Syahbandar's Office** | The gate every cargo passes through. The harbormaster's compound sits where the jetty meets the town, customs weighed, duties assessed, berths assigned, disputes between crews judged. Great ports like Malacca ran several syahbandars at once, each handling a different trading nation. Nothing enters or leaves the Game without crossing this desk. |
| **The Godown** | The spice warehouse, cool, dark, guarded, and worth more than the ships outside. Cloves and nutmeg wait here for the season's price to turn. A godown's ledger is a map of who owes whom, and a fire in the godown row can ruin twenty families in one night. |
| **The Market** | Open-air, morning-run, and largely in the hands of women, marketplace commerce in the Malay world was famously women's domain. Everything is here: Gujarati cloth, Chinese porcelain, Bugis blades, rumor at no charge. If the syahbandar's office is where the Game is taxed, the market is where it is priced. |
| **The Shipyard** | Half beach, half industry. Hulls on log rollers, the smell of pitch and fresh-cut timber, master builders who carry entire ship designs in memory. A nakhoda's next rung on the ladder is physically under construction here, and so is his rival's. |
| **The Kampung Laut** | The water-village, houses on stilts over the shallows, boats tied below the floor. Where crews live between voyages, where debts are remembered, where a boy mends nets and watches the ships come in. The mythos of the Nakhoda is born here, not in any palace. |
| **The Mosque & the Grave** | New in living memory in many ports, and growing. The mosque is where the ulama teaches; the revered grave (keramat) of a saint or great trader is where sailors pray before a far-water run. Faith and commerce arrived on the same ships, and in the port they share the same streets. |

#### The Cast

The Nakhoda is the hero-archetype, but no era stands on one figure. These are the people around him, allies, obstacles, and everything between:

| Figure | Who They Are |
|---|---|
| **The Syahbandar** | The harbormaster, the most powerful person a nakhoda deals with who isn't royalty. Assessor, judge, gatekeeper, and spy-master in one office. A friendly syahbandar makes a port home; a hostile one makes it a trap. And the office was not always a man's: **Nyai Gede Pinatih**, the female syahbandar of Gresik a generation before 1500, ran one of Java's great ports, sent her own trading ships to Bali, Maluku, and Cambodia, and raised a boy who became one of Java's nine saints. Her grave is already revered by the roster's present day. |
| **The Malim** | The pilot, the man who holds the reefs, currents, and star-paths in his head. No chart exists for most of what he knows. A great malim is worth more than cargo, and every nakhoda knows exactly which malims in port are for hire and which are already claimed. |
| **The Orang Laut** | The sea nomads, boat-dwelling peoples who serve no port and answer to no syahbandar, living entire lives afloat in the straits and island margins. Malacca's founding dynasty owed them old debts; sultans use them as guides, raiders, and strait-watchers. They are the sea's permanent residents, and they were here before any of the Game's players. |
| **The Market Matriarch** | The woman who runs the stalls, and often far more. Marketplace trade was women's work across the region, which means the person who knows every price, every shortage, and every merchant's credit-worthiness is usually her. Underestimated by foreign traders exactly once. |
| **The Resident Merchant** | The Chinese, Gujarati, or Arab trader who stayed, married locally, keeps a godown, extends credit between monsoons. He is the port's living connection to a market three thousand miles away, and his letters travel on every ship that leaves. |
| **The Ulama** | The scholar-teacher of the new faith, arrived on the same trade winds as the cloth and porcelain. Part missionary, part jurist, part diplomat, conversion in the Spice World moves through ports and marriages, not armies, and the ulama is its quiet engine. |
| **The Crew** | Paid in shares of the voyage, not wages, every hand aboard has a stake in the cargo, which is why a crew's loyalty is real but always conditional. They are the pool every future nakhoda climbs out of, and the judgment every current nakhoda is silently subject to. |

#### Raiders & Rivals

No trading world is only traders. The same straits and river-mouths that carry cargo also carry threat, and in 1500 that threat wears several different faces, not yet the organized slaving fleets later history remembers, but real enough to shape every voyage a nakhoda plans. (A note on dating: the large-scale, state-sponsored Iranun and Balangingi raiding fleets that would later terrorize the archipelago's shipping lanes are a phenomenon of the 1700s–1800s, three centuries downstream of this roster's present. What follows is what raiding and rivalry actually looked like in and around 1500, smaller-scale, more local, and often tangled up with legitimate power rather than opposed to it.)

| Figure | Who They Are |
|---|---|
| **The Orang Laut Raider** | The same sea nomads who guide, trade, and strait-watch for the sultanates also have, for as long as anyone remembers, preyed on shipping that isn't under a patron's protection. It's not a contradiction to them, a fleet unaligned with any port is fair water, and Malacca's own founding dynasty rose partly on Orang Laut strength turned to its service. A nakhoda without a patron learns fast which stretches of strait are safe only because someone powerful has already claimed them. |
| **The Unaligned Captain** | A nakhoda who has slipped his patron, lost his cargo, or simply decided the Game's rules don't apply to him. Neither pirate nor merchant by trade so much as by circumstance, today's cargo run and tomorrow's raid can be the same set of skills pointed in a different direction, and a port's syahbandar treats every unfamiliar sail with exactly that ambiguity in mind. |
| **The Rival Nakhoda** | Not a raider at all, and often the more dangerous rival for it, another captain chasing the same buyer, the same berth, the same syahbandar's favor, using reputation and credit as weapons rather than blades. The Game's competition is usually this, not violence: two ambitious men circling the same rung of the same ladder. |
| **The Naval Escort** | A sultanate's own fleet, sent to convoy tribute, a bride, or a particularly valuable cargo run through contested water. Protection with a price, a laksamana's escort answers to the court first and the merchant second, and a nakhoda who accepts one accepts the obligations that come attached. |

#### Ports of Ill Repute

Not every anchorage answers to a syahbandar. The great entrepôts run on tax and record, but the same geography that makes the Straits so valuable, a maze of islets, river-mouths, and hidden channels, makes it just as good at hiding cargo the record was never meant to see. A nakhoda's ladder isn't only climbed through official berths.

| The Place | What It's For |
|---|---|
| **The Riau & Karimun Islets** | South of Malacca proper, a scatter of small islands and channels too numerous and too shallow for any single sultanate to police closely, the same waters the Orang Laut have always called home, and not coincidentally the waters where a nakhoda goes to move a cargo the syahbandar's ledger was never shown. What later ages call smuggling, the people who actually do it in 1500 call simply moving goods where the toll isn't collected. |
| **The Kampung of No Fixed Flag** | Every strait has at least one waterside settlement that answers to no single sultanate closely enough to matter, too small for a court to garrison, too useful to its neighbors for anyone to burn it down. Here a nakhoda can sell cargo without a syahbandar's stamp, buy a debt off someone else's book, or simply disappear from a ledger for a season. |
| **The Multiple-Syahbandar Gap** | Malacca and other great ports run several syahbandars at once, one per merchant nation, Gujarati, Chinese, Javanese, and others each with their own office. A cargo declared to one syahbandar and never mentioned to the others isn't hidden, exactly; it's simply filed somewhere nobody thought to compare notes. The busier and more cosmopolitan the port, the easier this gap is to work. |
| **The Fence at the Water's Edge** | A resident merchant, or sometimes a market matriarch, with a reputation for asking no questions about where a shipment came from, for a cut steep enough to be worth the discretion. Every port of any size has one; finding out who it is, is itself a rite of passage for a young nakhoda. |

#### Story Engines

The Game is the macro strategy layer; the Nakhoda mythos is one man's climb. What sits between them is the repeatable situation, the scenario seed a session or a chapter can actually be built from, the kind of trouble the port generates on its own schedule rather than the kind a sultan orders into being. None of these require a throne room. They only require a jetty, a monsoon calendar, and people with competing stakes.

| The Seed | How It Plays Out |
|---|---|
| **The Monsoon Layover** | The wind that will carry a nakhoda home doesn't blow for months. Rival crews who'd never choose each other's company are stuck sharing one harbor, one market, one set of godown berths, until the season turns. Debts get called in, feuds simmer at close range, and alliances form out of sheer proximity that neither side would have picked in open water. |
| **The Cargo Dispute** | Two nakhodas claim the same berth, the same buyer, or the same shipment gone missing between godown and gangplank. It goes to the syahbandar's office, where the ruling depends as much on standing and favor as on the facts, a fair hearing is never guaranteed, and losing one badly can end a career faster than losing a ship. |
| **The Marriage-Alliance Voyage** | A bride, a dowry fleet, and a treaty riding on safe passage. The cargo is a person, the stakes are dynastic, and the voyage becomes a target the moment a rival court hears of it, piracy, sabotage, or a rival suitor's fleet all read differently when a kingdom's next alliance is aboard. |
| **The Debt Come Due** | A resident merchant's credit, extended across a bad season, finally gets called, and the debtor is someone with a kris at his hip and a temper the port already knows about. Face, not just money, is on the line, which is exactly the condition under which amok becomes a real possibility rather than a word in the lexicon. |
| **The Contested Succession** | A syahbandar, a malim, or a small court dies mid-season with the job half-done and no settled heir. Whoever fills the gap first, by appointment, by simply acting the part, or by marrying into it the way Nyai Gede Pinatih's successors might have, sets terms for everyone who arrives after. |
| **The Omen Everyone Reads Differently** | A becalmed week, a strange light on the horizon, a dream a respected elder won't stop talking about. The malim wants to sail anyway; the crew doesn't. Whether the port treats it as superstition or genuine warning says as much about who holds authority there as any treaty does. |
| **The New Faith Arrives** | An ulama sets up teaching in a port that's never had one, or a resident trader's household converts before the wider town does. Nobody forces the issue, but every relationship in the kampung, trade, marriage, old debts, old graves, has to quietly renegotiate around it. |

"The Game is decided on the water.
But it is priced, taxed, blessed, and whispered about on the waterfront."

### Tab: Custom & Conduct

The social machinery
Custom & Conduct
How the Spice World Actually Speaks, Bows & Eats Together
The Port is where the Spice World's people and places live; this is how those people actually behave toward one another once they're in the room. Nothing here is decoration, a wrong word, a wrong hand, a refused plate can end a negotiation, a marriage, or (in the gravest cases) a life, faster than any blade drawn in anger. A nakhoda's real education happens as much here as on the water.

#### Language & Etiquette

Nothing marks an outsider faster than getting this wrong. The Spice World runs on **budi**: an untranslatable weave of refinement, courtesy, and moral bearing, and on the ever-present possibility of **malu**, the shame of having failed it in front of others. Speech is graduated by rank far more finely than in most trading cultures a foreign merchant will have dealt with before, and getting the register wrong isn't a faux pas so much as a real insult, felt exactly as one.

| The Concept | How It Governs Behavior |
|---|---|
| **Halus & Kasar** | The basic axis of Malay manners: *halus* is refined, indirect, controlled, the way a person of standing is expected to speak and carry themselves. *Kasar* is crass, blunt, uncontrolled. A foreign trader who states his price bluntly and expects a quick answer reads as kasar even when he means no offense, and a nakhoda who wants a favorable hearing learns to say everything sideways. |
| **Budi** | Not quite virtue, not quite etiquette, not quite wisdom, budi is closer to a person's whole moral-social bearing, the sum of good conduct, good speech, and remembered good turns. A man is trusted in port not because he's proven wealthy but because he's shown budi over many small dealings. It's built slowly and lost quickly. |
| **Malu** | Shame, not private guilt but the specifically social sting of having been seen to fail. A debt unpaid in front of witnesses, a gift refused clumsily, an accusation that lands even if untrue: all produce malu, and a man cornered by enough of it at once is exactly the man a crew starts watching for signs of amok. |
| **Daulat** | The sacred, almost supernatural majesty that clings to a rightful sultan, not metaphorical power but a felt force, believed capable of striking down anyone who defies it. It's why a court can run on command rather than negotiation: to openly oppose the ruler isn't just risky, it's understood to invite a kind of curse. Every sultan on this roster's power rests partly on ships and treasuries, and partly on daulat. |
| **Derhaka** | Treason against that sacred order, the gravest charge the Spice World has, heavier than any crime against a person. It's the charge that hangs, unspoken, over Hang Tuah's killing of his own sworn brother Hang Jebat: Jebat's offense against the Sultan's household was read as derhaka, and Hang Tuah's loyalty to the throne outweighed his loyalty to the man. A story built on divided loyalty in this world almost always has derhaka waiting at the bottom of it. |

#### Address, Speech & Gesture

Below the concepts sit the actual mechanics, what you call someone, how you speak to them, and what you physically do with your hands and body in front of them. A nakhoda moving between a sultan's audience hall and a market stall in the same afternoon is moving between registers as much as between rooms.

| The Form | What It Signals |
|---|---|
| **Bahasa Istana, Palace Speech** | A distinct register of Malay used in and around a royal court, its own vocabulary for the ruler's body, possessions, and actions, separate from the words used for anyone else. A sultan doesn't "eat" or "sleep" in bahasa istana; the words themselves change to mark that his acts happen on a different plane than a commoner's. Getting caught using common words for royal acts, even by accident, is a mistake a courtier makes exactly once. |
| **Titah & Sembah** | The paired vocabulary of a royal audience: *titah* is what the ruler speaks, his command or pronouncement, never merely his "words", and *sembah* is the subject's reply, offered along with the gesture below. A petition to a sultan isn't a conversation; it's a titah answered by a sembah, and the form matters as much as the content. |
| **The Sembah Gesture** | Palms pressed together and raised toward the face, chin height for an ordinary superior, as high as the brow or nose for a sovereign, offered with a slight bow. How high the hands rise is itself a statement of relative rank, adjusted instinctively by anyone raised in the culture and impossible to fake convincingly by anyone who wasn't. |
| **Sirih Pinang, the Betel Offering** | A fitted set of betel leaf, areca nut, lime paste, and tobacco, presented in a lidded tray (*tepak sireh*) to open almost any formal exchange, a negotiation, a courtship, a reconciliation. Refusing a properly offered sirih pinang is a serious rebuff; accepting it signals willingness to talk in good faith before a single word of business is spoken. A nakhoda negotiating cargo terms with a resident merchant, or a family opening marriage talks, both start here. |
| **Names That Change** | Titles accumulate and shift with office and honor, a bendahara, a laksamana, or a syahbandar is addressed by the office as much as the birth name, and a name spoken with the wrong title attached is heard as either flattery or insult depending on which direction it errs. |

#### Food & Hospitality

A note before the table: the Spice World's own kitchens don't taste the way modern Malay, Indonesian, or Filipino food does. Chili arrives from the Americas only after 1521, riding the same Columbian Exchange that this roster's present sits just upstream of, so heat in 1500 comes from ginger, galangal, and black pepper, not chili, and the fiery sambal a modern cook would reach for doesn't exist yet in this kitchen. Rice, fish, coconut, and the archipelago's own spices are the palate; the world's most valuable export is, with some irony, barely the seasoning of the world that exports it, since cloves and nutmeg are grown for someone else's table more than the cook's own.

| The Custom | What It Means at the Table |
|---|---|
| **Rice as the Center** | Rice isn't a side to the meal, it's the meal, with everything else understood as accompaniment. A greeting as ordinary as asking whether someone has eaten rice yet stands in for asking after their whole wellbeing. A host who serves a guest thin or scant rice has said something, whether or not he meant to. |
| **Everything at Once** | No courses. Rice and every dish arrive together, and the diner assembles their own plate rather than being served in sequence, a structural expression of the same everything-shared, everything-communal instinct that runs through the culture's hospitality more broadly. |
| **The Right Hand** | Food is eaten with the fingers of the right hand; the left handles serving vessels and little else. A foreign trader eating with his left hand, or worse, offering food with it, causes a small but real recoil at the table, one of the fastest ways to read as an outsider who hasn't troubled to learn the room. |
| **Deference Before Appetite** | The most senior person at a meal is invited to begin first, with a specific word of invitation, and everyone else's hunger waits accordingly. Reaching for a dish before your elder or superior has taken their share is a small, immediate breach of the same halus-versus-kasar line that governs speech. |
| **The Meal as Negotiation Ground** | A shared meal, like a shared sirih pinang, does real diplomatic work, a nakhoda invited to a resident merchant's table, or a rival syahbandar's household, is being offered something closer to provisional trust than mere courtesy. Declining the invitation outright, without a graceful excuse, reads as declining the trust along with it. |
| **The Irony of the Spice Ships** | The godowns of every port on this map are stacked with the cargo the whole world is sailing here to buy, and the households sitting on top of that cargo season their own food far more modestly. Cloves and nutmeg are wealth to be shipped, not seasoning to be spent; a nakhoda who has spent a season hauling the world's most valuable spice may go home to a table that barely uses it. |

"A cargo can be renegotiated. A word said in the wrong register, or a plate refused at the wrong moment, usually can't."

### Tab: The Unseen

The belief-world
The Unseen
What the Sailors of the Spice World Fear, Honor & Carry to Sea
Every mythic era has its dread. The Viking has Valhalla and the world-serpent; the pirate has Davy Jones and the doldrums. The Spice World's sailors move through waters they understand to be *inhabited*, by spirits, by the souls of ships, by powers older than any sultanate, and by creatures with names, territories, and grudges, and no account of this world is complete without the beliefs its people actually sail with. What follows moves from the abstract to the specific: first the powers everyone acknowledges, then the named monsters a crew might swear they've actually seen, then the places that exist somewhere between the chart and the story. (A note on sources: the folk beliefs below are drawn from Malay, Javanese, Visayan, and wider Austronesian tradition as recorded across several centuries; folklore resists precise dating, so treat this as the texture of the belief-world rather than a dated inventory.)

#### The Powers

| The Belief | What It Means at Sea |
|---|---|
| **The Queen of the Southern Sea** | Java's southern coast faces open ocean, no islands, no shelter, waves that eat boats, and Javanese tradition peoples it with a sovereign spirit-queen, most famously remembered as **Ratu Kidul**. Fishermen on that coast make offerings, avoid wearing her color (sea-green), and understand that the southern water is *hers* in a way no sultan's water ever is. |
| **Semangat, the Soul of Things** | In the Malay belief-world, vital force inhabits more than people. A ship has semangat. A kris has semangat. Rice, iron, a house, all carry something that can be strengthened, offended, or lost. A vessel is launched with ceremony because she is not merely built; she is *brought to life*, and a nakhoda speaks of his ship accordingly. |
| **The Kris as a Living Blade** | A kris is forged in ritual, named, inherited, and consulted. Some are lucky; some are hungry; some are wrong for their owner and must be passed on. Hang Tuah's Taming Sari, a blade said to make its bearer unbeatable, is the most famous expression of a belief every man with a kris at his hip shares in some degree. |
| **Hantu Laut, the Sea's Spirits** | The waters hold ghosts and spirits the way the land holds villages. Sudden squalls, lights on the night horizon, a becalmed week in sight of home, all have their spirit-explanations, and an experienced crew reads the sea's moods as intention, not weather alone. |
| **Keramat, the Revered Dead** | The graves of saints, great traders, and founding figures accumulate power. Sailors visit a keramat before a far-water run; oaths sworn at one bind harder than oaths sworn in a market. The revered grave of a figure like Nyai Gede Pinatih in Gresik is already such a place by 1500. |
| **Omens & the Reading of Signs** | Departure days are chosen, not picked. Birds crossing the bow, dreams the night before sailing, the behavior of the sea at the harbor mouth, a prudent nakhoda weighs all of it, and a malim who dismisses omens entirely will find crews reluctant to sail under him no matter how well he knows the reefs. |
| **Amok** | The word the world would eventually borrow from this one. A man pushed past some inner limit, shame, loss, debt beyond bearing, erupts into killing frenzy without warning or self-preservation. Feared in every port, understood as something closer to possession than crime, and part of why insult and face are managed so carefully in the Spice World's crowded harbor quarters. |

#### Monsters & Guardians

Every belief-world needs teeth. These aren't background dread, they're specific, nameable creatures a crew might actually claim to have seen, each tied to real water or real coastline rather than an abstract "sea monster." A malim worth his pay knows which of these belong to which stretch of the passage, because the correct response, offering, silence, or simply not sailing that night, is different for each.

| The Creature | What It Is, and Where |
|---|---|
| **Naga** | The great serpent of the deep water, older than any sultanate and once worshipped outright before its worship curdled into demand, the oldest telling has it grown proud on sacrifice until a hero finally took its head. A naga is less a monster to be fought than a power to be respected: the sea's original claimant, from back before the ports divided the water between themselves. Different straits tell of their own naga; sailors who've served the length of the archipelago will tell you they're not all the same one. |
| **Buaya Putih, the White Crocodile** | Said to keep the Sunda Strait itself, between Java and Sumatra, a vast, pale crocodile that can as easily guide a lost boat home as drown a greedy one. Fishermen working that strait speak of him less as a threat than as a judge: cross him honestly and you may be spared; try to cheat the water and you won't be. |
| **Bakunawa** | In the Visayan waters around Lapu-Lapu's Mactan and Cebu, sailors know a different terror, a dragon vast enough to swallow the moon whole, blamed for eclipses, earthquakes, and the wrong kind of wind. Datu and fisherman alike read its movements as a calendar of danger, and a Visayan crew that sees the moon go dark mid-voyage will not treat it as mere astronomy. |
| **Harimau Jadian, the Weretiger** | A man who has taken a tiger's shape, by old rite or old debt, and mostly uses the power to guard crops and villages rather than hunt men. Inland and coastal communities alike hold the harimau jadian as more guardian than monster, but a nakhoda's crew recruiting porters or guides in an unfamiliar river-mouth town still asks, quietly, whether the local headman is rumored to be one. |
| **Orang Bunian, the Hidden People** | Not sea-dwelling but ever-present at the port's back: a whole parallel folk living unseen in forest and mountain behind every coastal town, visible only to those with the sensitivity to catch them. Traders who vanish inland chasing gold or timber sometimes don't come back, and the port's answer for where they went is not always "lost." |

#### Legendary Places

Alongside the charted ports sit places that exist mostly in what sailors and courts say about them, not lies, exactly, but not quite geography either. A nakhoda's world has real coordinates and half-real ones, and the two are not always easy to tell apart from the deck of a ship.

| The Place | What's Said of It |
|---|---|
| **Gunung Ledang (Mount Ophir)** | A real mountain rising inland from the Malacca Sultanate's own territory, and home, by every account traded in Malacca's court, to a celestial princess of impossible beauty and worse temper. The story told of her and Sultan Mahmud Shah himself, currently on the throne: he wanted her hand, she answered with seven demands calibrated to be impossible, and it's said the gold and silver bridges she asked for can still be glimpsed, but only from the spirit side of the mountain. A sultan currently ruling Malacca sits at the center of the era's most famous refusal. |
| **The Southern Sea (Java's open coast)** | Not a hidden place but a sovereign one, the entire ocean-facing coast of southern Java is understood to be Ratu Kidul's domain in a way no charted port's water ever is. Ships that must round it plan around her favor as much as around the currents, and fishing villages along that coast keep customs (the color one doesn't wear, the offering one does make) that have nothing to do with any sultan's law. |
| **Sunken gardens and drowned courts** | More than one story in the archipelago tells of a garden, palace, or whole settlement that sank beneath a lake or bay after some transgression, cursed lovers, broken oaths, an insult to the spirits of the place. Sailors passing certain calm bays at the right hour claim to see rooflines or gateposts through clear water. Whether any two tellers mean the same drowned place is never quite settled, which is rather the point. |
| **The reef with no chart** | Every long-serving malim keeps at least one stretch of water he refuses to draw a line through, not because it's unmapped, but because in his experience it doesn't hold still. Ships that try to run it on a borrowed chart rather than a malim's memory are the ones the port hears about later, if it hears about them at all. |

#### Legendary Weapons & Vessels

Semangat doesn't stay abstract for long, it collects around specific objects, and the greatest of them have names, histories, and owners the whole roster would recognize. A named blade or a named hull is a claim about who its bearer is, and losing one says as much as winning one.

| The Object | Its Story |
|---|---|
| **Taming Sari** | The kris every roster member would know by name, won by the aged Laksamana Hang Tuah in a duel against Majapahit's champion (the warrior it's named for), and said to make its bearer unbeatable. Malacca's court legend holds that Hang Tuah surrendered it for the last time on the failed mission to Gunung Ledang, and that he vanished afterward rather than return without it. Whether the true blade still exists, and in whose hands, is exactly the kind of question a court intrigue can be built around. |
| **Siginjai** | The keris already bound to Orang Kayo Hitam's name by the time he takes Jambi's throne in this very year, a weapon whose reputation for courage precedes and legitimizes its bearer rather than the other way around. Jambi's chronicles will keep the two names paired for as long as either is remembered. |
| **The Sacred Jong** | Every great port keeps at least one giant trading jong regarded as more than a hull, a flagship whose launch was attended by ceremony, whose semangat is spoken of the way a court speaks of a bloodline, and whose loss (to storm, to raid, to age) is felt the way a dynasty feels a death. A nakhoda's ambition is often measured by whether he'll ever command a ship spoken of this way, rather than merely one large enough to. |
| **The Malim's Star-Map** | Not a physical chart but a body of memorized knowledge, reef, current, and star-path passed master to apprentice, never fully written down. The nearest thing the Spice World has to a magic item that isn't a weapon: a great malim's knowledge is worth a fortune, dies with him if he doesn't teach it in time, and can't be stolen the way cargo can. |

#### The Jade-Bound

Scattered across the roster, not by court, not by faith, not by any line a genealogist could draw, are a handful of men and women who have carried a small jade amulet since before they can remember owning it. No priesthood grants it. No ceremony explains it. Ask any bearer where theirs came from and the answer is always some version of the same non-answer: *it was already around my neck.* The jade itself is old, old enough that a few traders who deal in antiquities recognize the carving style as something out of the ancient jade road that once ran the length of the archipelago and beyond, centuries before any sultanate on this map existed (see *General Lore → Jade Artifacts*, reachable from the series menu, for what that road actually was). Nobody can say how a handful of infants scattered across a hundred islands came to be wearing pieces of it.
What the amulet seems to do is simpler than what it means: two bearers recognize each other. Not by the object, a jade pendant is easy enough to counterfeit or conceal, but by something underneath it, a recognition sailors who've felt it struggle to put into words beyond "he knew me before I said a thing." Whatever passes between two bearers on first meeting isn't friendship, exactly, and it isn't loyalty sworn aloud. It sits closer to kinship, the unchosen, unshakeable kind, the kind a man doesn't get to talk himself out of no matter how far apart his interests and a fellow bearer's have since drifted.
There is no order. No meetings, no oaths, no rank. What binds the jade-bound to each other, as much as it binds anything in the Spice World, is a shared and largely unspoken understanding: that whatever quarrels divide them as sea-lords, merchants, or rivals, an attack from outside the brotherhood is answered together, and a quarrel from inside it is settled without dragging in the wider ruin a court war would bring. Egalitarian by nature rather than by any written law, a sultan and a nameless nakhoda wearing the same jade meet as equals, if only for as long as that meeting lasts. Whether this quiet understanding survives contact with 1511, and everything after it, is a question the roster hasn't had reason to ask itself yet.

#### Why It Matters for the Mythos

The Unseen is what keeps the Spice World from being merely an economy with boats. A nakhoda threading a reef at dusk is not only betting his cargo, he is negotiating with powers he cannot see, aboard a vessel he believes is in some sense alive, carrying a blade that may or may not favor him, on water that belongs to someone older than any player in the Game. The thrill of the era isn't just commercial risk. It's that every voyage crosses into territory where the rules are not human rules at all.
"The sultans divide the ports and the straits between them.
Nobody divides the sea. The sea was already spoken for."

### Tab: Almanac

A working reference
Almanac
Timeline, Goods & the Texture of the Year 1500

#### Timeline, The Long Approach

1500 doesn't arrive out of nowhere. Every court on the roster is living downstream of decisions made decades earlier, and every court (though none of them know it) is living upstream of 1511. The dates below aren't exhaustive, they're the ones that shape the roster's present. Note: Angin's own book (see Chapter Outlines) actually opens in 1498, not 1500, the roster's other reference tabs mostly still treat 1500 as the fixed snapshot year, which remains true for describing where each court stands, even though the book's own action starts two years earlier.

| Year | Event |
|---|---|
| **1293** | Majapahit founded by Raden Wijaya after repelling a Mongol-Yuan invasion fleet, the empire whose shadow still falls over Udara's rump court two centuries later |
| **1400 (c.)** | Parameswara founds Malacca, fleeing Majapahit's reach, within a century it becomes the wealthiest port in the spice world |
| **1414** | Malacca's ruling house converts to Islam, tying the sultanate's fortunes to the wider Muslim trading network stretching to India and Arabia |
| **1458** | Sultan Mansur Shah dies; under his reign and the bendahara Tun Perak, Malacca becomes the dominant power of the Straits |
| **1471** | Đại Việt sacks Vijaya, the Champa capital, the rump kingdom at Panduranga (Po Kabih's domain) is what survives |
| **1478** | Traditional date for Majapahit's fall to Demak/Kediri forces, though the court's actual dissolution is gradual and contested by chroniclers even now |
| **1485** | Bolkiah becomes Sultan of Brunei on his father's abdication, the reign later remembered as Brunei's golden age begins |
| **1488** | Mahmud Shah becomes Sultan of Malacca, inheriting an empire built by others |
| **1490s** | Raden Patah founds Demak on former Majapahit coastal territory, Java's first major Islamic sultanate |
| **1498** | **Angin's book opens here.** In the history the rest of this file otherwise follows, Tun Perak is dead by this point, in this telling, he is still alive, the earliest use of the Butterfly Effect mechanic (see Central Conflict) |
| **1500** | **The roster's snapshot present** for every reference tab outside Chapter Outlines. Orang Kayo Hitam takes Jambi's throne; **Tun Perpatih Putih**: Tun Perak's brother and Malacca's 6th bendahara since 1498, dies during Ramathibodi II's Ayutthaya invasion fleet's attack on Malacca, and Tun Mutahir is installed as his successor |
| **1509** | The first Portuguese ships under Diogo Lopes de Sequeira reach Malacca, the "something coming from the west" the roster can't yet see |
| **1511** | Afonso de Albuquerque takes Malacca for Portugal; Mahmud Shah flees south to found a new court, and the old sultanate never recovers its unity. Angin reaches Sea Lord status around this same year |
| **1512** | Portuguese ships reach Ternate and Tidore directly, ending the Malacca-mediated clove trade Al-Mansur has profited from |
| **1521** | Ferdinand Magellan's Spanish-flagged expedition reaches the Visayas; Lapu-Lapu defeats and kills him at the Battle of Mactan. Angin's own book closes in this same year |

#### Trade Goods of the Nusantara

The map's dashed lines carry specific cargo, not generic "trade goods." What moves along them defines who has leverage over whom.
- **Cloves**: grown natively only on a handful of small volcanic islands in Maluku (Ternate, Tidore, and their neighbors). This single fact is the reason Al-Mansur's tiny sultanate matters to merchants as far away as Lisbon and Cairo.
- **Nutmeg & mace**: native only to the Banda Islands further south, an even narrower monopoly than cloves, and no less fought-over once Europeans arrive.
- **Pepper**: grown far more widely (North Sumatra, West Java, the Malay Peninsula), which is exactly why pepper ports like Pasai and Sunda Kalapa compete with each other rather than holding a monopoly the way Maluku does.
- **Sandalwood**: Timor's great export, feeding a market that stretches to Chinese incense-makers and, later, European cabinet-makers; it's the reason Wehali's ritual seniority translates into real trade leverage.
- **Chinese porcelain and silk**: flowing south and west from Ming China into every port on the map, often re-exported multiple times before reaching a final buyer.
- **Indian textiles**: the de facto currency of the archipelago; Gujarati cloth traders are a resident community in Malacca numbering in the thousands.
- **Gold**: mined inland on Sumatra, the Malay Peninsula (notably Pahang), and Luzon, moving toward coastal courts as tribute and toward foreign merchants as payment.
- **Pearls & tortoiseshell**: Sulu's specialty, drawing Chinese and Bruneian merchant interest independent of the spice trade entirely.

#### How Power Actually Worked

None of the polities on this map are states in the modern sense, and treating them as such flattens the setting. A few working rules for writing them:
- **Mandala, not territory.** Precolonial Southeast Asian kingdoms projected concentric, weakening authority outward from a sacred center rather than governing up to a hard border, a datu two islands away might owe tribute without ever seeing a single administrator.
- **Rivers and straits are the real borders.** Interior highlands mattered far less than who controlled the mouth of a river or the narrows of a strait, which is why the map's ports, not its landmasses, are where power actually concentrates.
- **Religion is a live wire, not scenery.** Islam is actively spreading, court by court, in 1500, Demak and Cirebon are Muslim; Majapahit's rump and Bali's Gelgel are Hindu-Buddhist holdouts; conversion is simultaneously a spiritual choice and a trade alliance, since joining the Muslim merchant network opens doors that staying Hindu-Buddhist closes.
- **Legitimacy outlives leverage.** Udara's Majapahit rump court has no navy and no coastline worth mentioning, and foreign traders still write home about it, old names carry weight for a generation or two after the power behind them has actually moved elsewhere.
- **Trade and tribute are the same instrument, pointed two ways.** A gift to a sultan and a tax on a merchant accomplish the same thing, binding a smaller party to a larger one, which is why a marriage alliance, a duty schedule, and a vassal's yearly gift all read as variations on one relationship rather than three separate systems.
- **Authority is personal before it's institutional.** An office like bendahara or syahbandar carries real power, but how much depends heavily on who currently holds it, Tun Perak's decades built loyalty that Tun Mutahir inherits the title for but not automatically the substance of. Titles transfer instantly; the authority behind them often doesn't.
- **The center can't see the edges, and both sides know it.** A datu two islands from any court's capital genuinely can act with near-total local autonomy between the seasons a tribute fleet or a punitive expedition might show up, mandala power is real, but it's also intermittent, and the gap between visits is where most of a smaller polity's actual freedom lives.

#### Lexicon

The era's vocabulary is worldbuilding in miniature, one of these words (*amok*) traveled from this world into English itself. A working glossary:

| Word | Meaning |
|---|---|
| **Nakhoda** | Ship-owning merchant captain, the era's defining figure. Persian in root, Malay in daily use. |
| **Syahbandar** | Harbormaster, customs chief, berth-assigner, and judge of the waterfront. Great ports ran several at once, one per trading community. |
| **Bendahara** | Chief minister of a Malay sultanate, Malacca's Tun Perak and Tun Mutahir held the office; second in power only to the sultan, and sometimes not second. |
| **Laksamana** | Grand admiral, the sea-arm of a sultanate given a single title. Hang Tuah is the office's living legend. |
| **Temenggung** | The chief of police and public order in a Malay court, the man who keeps the port's peace, or decides not to. |
| **Orang laut** | "Sea people", boat-dwelling nomads of the straits, serving no port, predating every player in the Game. |
| **Perahu** | The general word for boat, the mother-category every kelulus, penjajap, and lancaran belongs to. |
| **Kelulus** | Small, swift oared vessel, the classic first rung of a nakhoda's ladder. |
| **Jong** | The giant Javanese trading ship, the largest carried hundreds of men and over a thousand tons; the word that became English "junk." |
| **Godown** | Warehouse, where the spice waits for the price. From Malay *gudang*. |
| **Kampung** | Village or quarter, the kampung laut is the stilt-house water-village where crews actually live. |
| **Keris (kris)** | The wavy-bladed dagger of the Malay world, named, inherited, and believed to carry a spirit of its own. |
| **Semangat** | Vital force or soul, possessed by people, ships, blades, and rice alike in the Malay belief-world. |
| **Keramat** | A revered grave or sacred site, where sailors pray before far-water runs and oaths bind hardest. |
| **Amok** | The killing frenzy of a man pushed past his limit, the Spice World's word, loaned permanently to English. |
| **Entrepôt** | A port that lives on re-export, buying, storing, and reselling other people's goods. Malacca is the era's supreme example. |
| **Naga** | The great serpent of the deep water, a power to be respected more than a monster to be fought, older than any court on the map. |
| **Harimau jadian** | A weretiger, a man who has taken a tiger's shape, usually to guard rather than to hunt. |
| **Orang bunian** | The "hidden people", a parallel folk living unseen in forest and mountain, visible only to those with the sensitivity to catch them. |
| **Pendekar** | A warrior-champion or martial master, the word behind Taming Sari's original owner, and the general term for a fighter whose skill has become reputation. |
| **Daulat** | The sacred majesty of a rightful ruler, treated as a real, almost supernatural force rather than a figure of speech. |
| **Derhaka** | Treason against the sacred order of ruler and realm, the gravest charge the Spice World has. |
| **Budi** | A person's whole moral-social bearing, refinement, courtesy, and remembered good conduct, built slowly and lost fast. |
| **Malu** | Social shame, the sting of a failure witnessed by others, distinct from private guilt. |

### Tab: Vessels & Navigation

Wood, rope, and star-paths
Vessels & Navigation
What Actually Floats on This Map, and Who's Steering
The dashed trade lines and the karakoa raids alike run on real ship technology, not generic "boats." What follows is the working fleet of the Nusantara in 1500, how each hull is built, who crews it, and what happens when a jong runs into something built in Lisbon or Guangzhou.

#### The Nusantara Fleet

| Vessel | What it is |
|---|---|
| **Balangay** | The base-level trading boat of the archipelago, up to ~15m. Lashed-lug construction: a hollowed keel-log built up with edge-pegged planks, dowelled and lashed with rattan or fiber cord, no metal nails anywhere in the hull. Regional names vary (baloto, biray, tilimbao); the everyday workhorse everything else on this list descends from. |
| **Karakoa** | The Visayan and Kapampangan war fleet's signature vessel, up to 25m, double-ended (identical bow and stern) so paddlers can reverse direction instantly without turning the hull, decisive in the narrow channels between islands. A raised **burulan** deck carries the warriors, roughly a third of the crew; the rest paddle, kept in stroke by a drummer. Armed with lantaka swivel guns, kalis, bangkaw spears, and bamboo *sugob* javelins. The largest karakoa are called **joanga** and carry hundreds. Fleets sail together as an **abay**, screened by a fast scout (*dulawan*); ship-to-ship duels are **bangga**. |
| **Jong (djong)** | The giants of the spice route, the ships that made Malacca a Javanese city in all but name. Estimates range from 40 to as much as 1,000–2,000 deadweight tons; the largest are said to have carried up to a thousand people. Later hybrid jongs took Chinese techniques, iron nails alongside dowels, watertight bulkheads, but kept a distinctly Nusantaran feature: **two rudders** rather than the single Chinese stern rudder, giving a hull that size both speed and real maneuverability. Could ship oars for calm weather. Built as merchantmen first, pressed into war and troop transport as needed. |
| **Lancaran** | The backbone war vessel of the western archipelago before Mediterranean-style ships arrived, galley-shaped, oared, shallow-draft. Around 1500, Malacca fielded roughly 200 lancaran and kelulus against Ayutthaya. |
| **Kelulus** | Small, swift, oared, paired with the lancaran in war fleets, and traditionally a nakhoda's first command on the way up. |
| **Penjajap** | Another oared longship of the war fleets, mentioned alongside lancaran in Portuguese accounts of the 1511 fighting at Malacca. |
| **Malangbang** | Broad, flat-bottomed, oar-and-sail, sized between a jong and a kelulus, faster than the smaller pilang/pelang. |
| **Pencalang** | A Malay merchant ship out of Riau and the peninsula, later widely copied by Javanese shipwrights. |
| **Ghurab** | A merchant-and-warship type showing Mediterranean influence, brought into the archipelago through Arab, Persian, and Ottoman trade contact, proof the Nusantara was already absorbing outside hull designs well before the Portuguese arrived. |

#### Hull & Rig, How a Nusantaran Ship Is Actually Built

- **Lashed-lug construction.** The oldest and most distinctive Austronesian shipbuilding method: planks are edge-pegged to each other with dowels, then lashed through carved lugs left protruding on their inner face, using rope of rattan or plant fiber. No metal nails. Seams are caulked with plant-fiber pastes that swell watertight once wet. The lashed shell is only afterward reinforced with internal ribs, the reverse order of European frame-first construction.
- **The tanja sail.** The characteristic Austronesian rig: a fore-and-aft sail with spars along both the upper and lower edges, giving the distinctive shape sometimes called a "crab claw." Reefed by rolling the sail around its lower spar. Larger tanja-rigged ships often carry a bowsprit with a separate quadrilateral headsail as well. Invented in the archipelago by at least 2000 BCE and carried outward with Austronesian migration as far as Madagascar and Polynesia.
- **Outriggers.** The stabilizing lateral floats that let comparatively narrow, light hulls carry sail safely, standard on smaller Austronesian craft and on the karakoa specifically, though the great jongs are large enough to dispense with them.
- **Two rudders.** Where a Chinese junk steers on a single stern-mounted rudder, larger Nusantaran ships typically carry twin quarter rudders, one to each side of the stern, a design difference visible at a glance to anyone who's spent time around both traditions.

#### Crew & Command, The Undang-Undang Laut Melaka

Malacca's maritime law, the *Undang-Undang Laut Melaka*, sets out a real chain of command aboard a 15th-century Malay ship, the same structure any nakhoda on this map would recognize as normal, not exceptional:

| Role | Function |
|---|---|
| **Pemilik perahu** | The ship's owner, often not aboard, sometimes a court official or syahbandar's associate financing the voyage from shore. |
| **Nakhoda** | The captain, full legal authority at sea, including the power to use force against mutiny or piracy. The word is a Persian loan, a small linguistic fossil of how deep Indian Ocean trade contact runs. |
| **Mualim** | The navigator, the officer specifically responsible for reading stars, charts, and sea-signs, and for knowing the coastline, reefs, currents, and monsoon timing well enough to keep the ship off the rocks. |
| **Juru (various)** | Skilled specialist hands, split into several named sub-roles depending on function aboard. |
| **Tukang (various)** | Trained craftsmen aboard, carpentry, rigging repair, and similar hands-on trades kept the ship seaworthy mid-voyage. |
| **Juru tulis** | The ship's writer, functions as a purser, keeping the cargo manifest and accounts. |
| **Muda-muda / Awak** | Junior crew and general hands, the bottom and largest tier of the roster, doing the physical work of paddling, hauling, and loading. |

The code had real teeth: a crewman who refused to follow the nakhoda ashore to meet a foreign ruler could be flogged with rattan; one who came to blows with the captain was bound. Authority at sea was absolute in a way court politics on land rarely allowed any single office to be.

#### Navigation Without a Compass

- **Star-path navigation.** The core Nusantaran method: a mualim fixes heading by tracking the rising and setting points of known stars against remembered islands, building a mental "path" of star positions that corresponds to a real sea route, closer to a memorized script than a plotted line.
- **Reading the water and sky.** Swell direction and pattern, cloud buildup over an island still below the horizon, and the flight paths of land-seeking birds all supplement star-paths, especially for the final approach to a landfall.
- **Monsoon timing.** The entire trading calendar of the Nusantara runs on the reversing monsoon winds, fleets sail with the wind out and wait months at a foreign port for it to reverse before sailing home again, which is why great entrepôts like Malacca exist at all: they're where ships from opposite monsoon systems are forced to meet and trade rather than sail past each other.
- **Arab instrument navigation.** Indian Ocean dhow navigators, by contrast, had already moved toward instrument-assisted astronomical methods, simple star-altitude tools used to measure a star's height above the horizon and estimate latitude. This tradition, absorbed by the Portuguese through centuries of Arab contact in the Mediterranean and Iberia, is part of what lets European ships attempt open-ocean routes the Nusantara had never needed, since island-hopping star-paths served perfectly well in these waters.

#### What's Arriving From Outside, 1500's Other Ships

The roster's present sits right before the world's shipping traditions collide in these waters. None of the following vessels are native to the Nusantara, but all three are either already present or about to be:
- **The Chinese junk.** Flat-bottomed, multiple battened lugsails, a single stern-mounted rudder, and, a genuine first, fully watertight bulkheads dividing the hull into independent compartments. The great Zheng He treasure-fleet voyages had already ended by 1433, decades before the roster's present, but junks still worked the regional routes, and Chinese shipbuilding technique had already left its mark on hybrid jong construction.
- **The Arab dhow.** Double-ended hull, lateen (triangular) sail for genuinely superior windward sailing, and in its earliest form sewn-plank construction using coconut-fiber lashings rather than nails, its own parallel solution to the same lashed-hull problem the Nusantara solved differently. Dominant across the Arabian Sea and western Indian Ocean.
- **The Portuguese caravel and nau.** Not yet in these waters in 1500, but only nine years out: the first Portuguese ships reach Malacca in 1509, and Albuquerque takes the city in 1511. The caravel fuses a Mediterranean carrack hull with the Arab lateen rig, small, shallow-draft, built for exploration rather than cargo. The larger nau (carrack) trades speed for capacity, hauling more men and guns across the long ocean leg from Lisbon around Africa. Neither vessel out-builds a great jong; what the Portuguese bring instead is cannon doctrine and the willingness to fight for a monopoly rather than simply trade for one, which is the actual shape of the disaster still nine years off the roster's horizon.

### Tab: Trade & Goods

Source to sink
Trade & Goods
How Cargo Actually Moves Across the Nusantara
Every commodity on this map follows its own logic, some are monopolies concentrated on a handful of islands, others are volume trades spread across dozens of competing ports. Below, each good is traced from where it grows to who finally buys it, with the map's own trade routes (see the dashed lines on the Map tab) linked at each leg.

#### Melaka, The Great Redistribution Point

By 1500 Melaka produces almost nothing itself. Its wealth is entirely positional: it sits on the narrowest practical passage between the Indian Ocean world and the South China Sea, so small, mixed regional cargoes, cloves and nutmeg down from Maluku via Java, pepper up from Sumatra, sandalwood and secondary goods from further afield, arrive, get consolidated into large shipments, and are handed off to the long-haul carriers: Gujarati ships running the Bay of Bengal crossing, Chinese junks running north, and various archipelago shipping filling the rest. The sultan's income comes from harbor fees and the *syahbandar* system regulating each merchant community, not from growing or making anything at all.

#### Reading the Chain

- **Monopoly goods** (cloves, nutmeg & mace, and to a lesser extent sandalwood) concentrate political power in whoever controls the source, a few thousand people on a handful of islands can matter more than kingdoms a hundred times their size.
- **Volume goods** (pepper, gold, textiles) create competition between ports rather than monopoly leverage, since the same good can be grown or sourced in several places at once.
- **Every leg marks up the price.** By the time a clove picked on Ternate reaches a kitchen in Venice, it has passed through five or six hands, island grower, inter-island prau, Melaka consolidator, Indian Ocean carrier, Red Sea/overland caravan, and finally Mediterranean merchant, each taking a cut.

### Tab: The Economy

Ground to treasury
The Economy
Every Hand, Task & Transaction That Makes the Spice World Turn
Trade & Goods traces each commodity's route on the map. This tab traces something narrower and more useful for a working story: **the people standing at every link of every chain**: commercial, political, legal, and cultural, and the friction each one generates. If The Nakhoda is the climb and The Game is the strategy played above it, this is the machinery underneath both, starting with cargo, then widening to everything else that keeps 1500 actually running.
Sections 1–7 below trace cargo specifically, ground to treasury. What follows after covers the rest of the world's machinery, politics, law, labor, logistics, information, culture, and health.

#### 1. Production, Where It Starts

| Role | What They Actually Do |
|---|---|
| **Clove & nutmeg smallholders** | Tend trees on volcanic slopes in Maluku or the Bandas. Sell the harvest to a local collector, not directly to any foreign ship, a single grower rarely deals with a nakhoda in person. |
| **Pepper growers** | North Sumatra, west Java, the Peninsula, far more numerous and scattered than the clove/nutmeg monopoly islands, which is exactly why pepper ports compete on price rather than sitting on leverage. |
| **Sandalwood cutters** | Timor's interior. Logging and hauling to the coast is its own labor chain, often via porter gangs answering to a local lord before the wood ever reaches a beach. |
| **Gold panners & miners** | Interior Sumatra, Pahang, Luzon. Inland and upriver, frequently under a highland chief's control before any coastal court sees a grain of it. |
| **Pearl divers & tortoiseshell hunters** | Sulu's waters. Skilled, dangerous, seasonal work, sold onward through Sulu's own merchant houses. |
| **Rice, salt & dye producers** | The unglamorous staples nobody writes ballads about, but a port that runs short of rice stops being able to feed the crews and slaves that make the spice trade run at all. |

#### 2. Local Aggregation, Before Any Big Port Sees It

| Role | What They Actually Do |
|---|---|
| **Village headmen & minor datus** | Collect tribute-in-kind from growers under their protection, taking a cut before anything moves further, the smallest working unit of the mandala system. |
| **River traders** | Pole canoes and small praus downriver from interior collection points to the coast, often the only link between an inland producer and the sea at all. |
| **Weighmasters** | Settle disputes over whether a load is the weight it's claimed to be, an unglamorous role, but the first place a scene about fraud or short-weighting actually happens. |

#### 3. Coastal Collection & First Sale

| Role | What They Actually Do |
|---|---|
| **Kampung brokers** | Buy up small stockpiles from river traders and village headmen, holding goods until a nakhoda's price is worth selling into. |
| **Godown keepers** | Run the warehouse itself, the actual physical bottleneck of the whole economy. Cargo sits here, sometimes for a full monsoon season, until the price or the ship is right. |
| **Local moneylenders** | Advance credit to growers against next season's harvest. This is where the era's debt, the engine behind The Debt Come Due story engine, is actually born, long before it ever reaches a nakhoda's ledger. |

#### 4. The Transport Link, Angin's World

| Role | What They Actually Do |
|---|---|
| **Small-hull nakhodas** | Run short coastal hops, collector port to entrepôt, in a kelulus. The entry-level version of the entire trade, and where most careers on the water actually begin. |
| **Escort arrangements** | Paying an orang laut crew, or a local sea-lord's men, for safe passage through a stretch of water they effectively own. Refusing to pay is its own kind of story. |
| **Strait & river-mouth tolls** | Literal checkpoints, not a metaphor, a physical boat or boom across a channel, manned by someone with the authority (or simply the force) to collect. |
| **Pilotage** | Hiring a local malim who knows one specific reef or river mouth by memory, since no chart exists for most of this water. A malim's knowledge is worth a fortune and can't be stolen the way cargo can. |

#### 5. The Great Entrepôts, Where the Real Money Changes Hands

| Role | What They Actually Do |
|---|---|
| **Syahbandars** | One per resident trading nation in a great port like Melaka, assigns berths, collects duties, and judges waterfront disputes for their own community. See The Nakhoda, The Judgment of the Syahbandar. |
| **Currency exchange** | Chinese copper cash, Indian and Arab silver, local gold dust, and barter-in-cloth all circulate simultaneously, every port effectively runs its own exchange rate, and knowing today's rate is itself valuable information. |
| **Weighing & grading** | Someone must certify that a sack sold as "pepper" is dry, unadulterated pepper and not last season's spoiled stock hidden under a fresh layer. |
| **Warehousing & relationship-insurance** | No formal insurance market exists, risk is instead spread through kinship and partnership ties among the resident merchant community. Losing a ship without those ties behind you can mean losing everything at once. |
| **Brokers** | Match the foreign buyer to the local seller, translating both language and trust, a Gujarati cloth trader rarely deals with a Javanese rice farmer directly; someone always stands in the middle. |

#### 6. Onward & Re-Export

| Role | What They Actually Do |
|---|---|
| **Chinese junks** | Carry spices north into the Ming tribute-trade system, and porcelain and silk back south in exchange. |
| **Indian & Arab ships** | Carry spices west toward the Red Sea and Mediterranean, bringing textiles and horses east in return. |
| **Local jong owners** | Run bulk cargo between entrepôts, the archipelago's own long-haul carriers, distinct from the foreign long-distance fleets. |

#### 7. The State's Cut

| Role | What They Actually Do |
|---|---|
| **Duties & harbor fees** | Collected by the syahbandar or bendahara's office, funding the court directly, Melaka by 1500 grows almost nothing itself and lives entirely on this income. |
| **Upward tribute** | Smaller polities send goods to a larger court as much to maintain the mandala relationship as to pay a literal tax, see Almanac, How Power Actually Worked. |

#### Reading the Chain for Story

- **Every link above is a potential scene.** A bad weighing, a moneylender calling in debt at the worst moment, a toll-collector who wants more than the going rate, a syahbandar's ruling that favors the wrong community, none of these need a sultan in the room to matter to the person living through them.
- **Angin's early career lives almost entirely in links 2 through 4.** The higher a nakhoda climbs, the more of this chain he comes to own or command rather than simply pass through, which is its own way of tracking The Ascension without ever mentioning hull counts.
- **Debt is the chain's real current.** It starts at the moneylender's table in link 3 and doesn't stop moving until someone at the top absorbs the loss, which is usually whoever has the least power to refuse it.
Cargo alone doesn't explain how 1500's world actually keeps running. Underneath and alongside the trade chain sit whole other machineries of human effort, political, legal, physical, and informational, each with its own working roles, and each just as capable of generating a scene as a sack of pepper changing hands.

#### Politics & Diplomacy

| Task | What It Actually Involves |
|---|---|
| **Marriage brokerage** | Alliance terms negotiated months, sometimes years, before a bride ever boards a ship, dowry, succession rights, and the standing of the children to come, all settled by intermediaries long before the two courts' names are spoken together in public. |
| **Envoys & memorized messages** | Oral messages carried word-for-word by a trusted envoy, harder to forge or intercept than a written letter, provided the envoy himself can be trusted, which is its own recurring wager. |
| **Hostage exchange** | Younger sons, nephews, or wards sent to live at a rival or overlord's court as a living guarantee of good behavior, a soft captivity that can turn into genuine upbringing, resentment, or both. |
| **Gift protocol** | What is brought to a sultan, in what order, presented by whose hand, sequencing and etiquette a foreign trader can get disastrously wrong without ever intending insult. |
| **Tribute-fleet timing** | A season's worth of vassal gifts coordinated to arrive together, turning individual tribute into a single court spectacle that publicly displays a ruler's reach. |
| **Succession management** | Regents and co-rulers governing on behalf of an heir too young to rule alone, Pahang's Mansur Shah I, ruling jointly with his uncle since 1495, is a live example already on the roster. |

#### Law & Justice

| Task | What It Actually Involves |
|---|---|
| **The syahbandar's court** | Waterfront disputes within a resident merchant community, see Section 5 above. |
| **Adat elders** | Customary-law mediators handling disputes outside the syahbandar's reach, inland, cross-community, or spiritual matters no port official has standing over. |
| **Trial by ordeal or oath** | Sworn at a keramat for disputes evidence genuinely can't settle, an oath broken at a revered grave is understood to invite consequence beyond any human court's power to enforce. |
| **Blood-price negotiation** | Compensation payments arranged to prevent a killing from escalating into a war between two families, crews, or courts, the alternative to The Unseen's amok, worked out calmly instead of erupting. |
| **Piracy adjudication** | Whether a given raid was legitimate reprisal, a lawful prize, or simple theft is a question every port answers differently, and often answers differently depending on whose raid it was. |

#### Labor & Craft

| Task | What It Actually Involves |
|---|---|
| **Shipwrights** | Hull design and building knowledge passed master to apprentice, with real regional styles, Javanese jong-building is a different craft tradition from Bugis prau-building, not a variation on one recipe. |
| **Rope-makers, sailmakers, caulkers** | The unglamorous trades without which no fleet, however grand, can actually put to sea. |
| **Blacksmiths & empu** | Ordinary smiths make tools and fittings; an empu, a ritual smith, forges a kris with attention to the blade's semangat, a separate and higher-status craft entirely. See The Unseen, The Kris as a Living Blade. |
| **Porters & overland haulers** | Move goods between river systems where no water route connects two points, Timor's sandalwood, in particular, depends on this labor before it ever reaches a coast. |
| **Bonded & enslaved labor** | War captives, debt bondage, and domestic slavery all function differently from one another and from each other's legal and social standing, a real and uncomfortable part of the era's economy, worth writing with precision rather than glossing over. |

#### Logistics & Navigation

| Task | What It Actually Involves |
|---|---|
| **Monsoon timing** | The entire trade calendar runs on wind reversal twice a year, missing a window can strand cargo, or a nakhoda, for a full six months. |
| **Provisioning** | Water, rice, and salt-fish sourced and loaded before departure, its own trade at every port, and the first thing a voyage fails on if it's done badly. |
| **Careening** | Beaching a ship to scrape and repair the hull, a periodic, highly social, and vulnerable event, since a beached fleet is an easy target for anyone who's been waiting for the chance. |
| **Signal & lookout systems** | Smoke, drums, or runners relaying "sail sighted" faster than the ship itself can travel, a port's real early-warning network. |
| **Chart-keeping** | Mostly absent, see The Unseen, The Malim's Star-Map. Most navigation lives in memory, not on paper, making that knowledge a tradeable, inheritable, stealable asset in its own right. |

#### Information & Rumor

| Task | What It Actually Involves |
|---|---|
| **Waterfront gossip networks** | Dockworkers and the port's working women are often the fastest-moving information channel in the whole city, well ahead of any official messenger. |
| **Merchant correspondence** | Letters carried ship to ship, weeks or months stale by the time they arrive, forcing real decisions on information everyone knows may already be out of date. |
| **Spies & informants** | Embedded in rival courts, syahbandars' offices, or rival crews, intelligence-gathering as an ordinary, low-key feature of court life rather than an exceptional plot device. |
| **Religious networks** | Islamic scholars and Buddhist monks moving between courts as a matter of course, doubling as long-distance information carriers whose movement is treated as legitimate and unsuspicious. |

#### Religion & Daily Culture

| Task | What It Actually Involves |
|---|---|
| **Conversion as political act** | Worked out person by person, a merchant converts to join a trade network, a ruler converts to secure an alliance, each carrying a real social cost among those who don't. See Almanac, How Power Actually Worked. |
| **Feast days** | A court in ritual observance simply isn't doing business that week, a real, recurring interruption to any deal or plan timed without accounting for it. |
| **Language brokering** | Malay serves as the trade lingua franca, but real transactions often need a third or fourth language bridged by whoever happens to be in the room. |
| **Tattoo & body-marking** | Legible social information worn on the body, a warrior's status, a sailor's voyages, read by anyone in the culture before a word is spoken. |
| **Hospitality obligation** | Refusing a host's food or betel offering is a genuine social violation, not a minor rudeness, the kind of misstep a foreign trader can make without realizing the offense until it's too late to undo. |

#### Health & the Body

| Task | What It Actually Involves |
|---|---|
| **Disease** | Fever and dysentery are the simple, constant mathematics of who survives a long voyage and who doesn't, a bigger killer, most seasons, than any raid. |
| **Midwives & healers** | Often the same babaylan/balian figures who mediate with spirits elsewhere in the culture, medicine and the unseen are not separate professions here. |
| **Childbirth mortality** | Shapes succession anxiety at every court on the roster, an heir's survival to adulthood is never something a ruling family can simply assume. |
| **Betel-chewing** | A near-universal daily ritual and mild stimulant, cutting across every class from dockworker to sultan, as ordinary and constant as tea. |

---

# PART 4: KNOWN GAPS AND EXPANSION HOOKS

What the code does today versus what the lore already describes. Useful as a backlog.

## 4.1 Data inconsistencies in the current sim
- **Pearls** are craved by every entrepot and several provincial ports, but no port produces them. They can never be bought.
- **Sea Salt** is neither produced nor craved anywhere.
- **Spice geography is off from the lore.** The lore's Goods Flows say nutmeg and mace come from the Banda Islands only and cloves from Ternate, Tidore, Motir, Makian and Bacan. The sim assigns spices by index, so Ternate and Ambon "produce" Nutmeg and Tidore produces Mace.
- Port names differ slightly between sim and atlas (Melaka vs Malacca, Sunda Kelapa vs Sunda Kalapa, Sugbu vs Cebu).
- Wind is a slow random drift, not the NE/SW **monsoon** the atlas documents. The lore makes the monsoon calendar central (miss the turn and you are stranded a season).

## 4.2 Lore systems not yet in the game
- **The Ledger's leverage categories** (information network, chokepoint control, debts owed, sacred legitimacy, specialist loyalists, and the others in the Ledger tab) as real resources beyond gold and Rep.
- **The Game** and the Sea Lords: rulers with teams, rivalries and vassalage (Connections) acting as live AI powers.
- **The Port**: syahbandars, berth assignment, duties, waterfront law.
- **Custom & Conduct** and **The Unseen**: tapu, offerings, spirits, the magic vocabulary (mana, talina, anitu, barang, bales, salaq, lalan, dalan, tanaq, puhun, alang, ngaran) as gameplay with cost and consequence.
- **Named characters**: Angin's crew, mentors, the Sea Lords, rivals and mirrors.
- **1511**: the Portuguese arrival and the fall (or survival) of Malacca as a timeline event.
- Anything after Sea Lord.
