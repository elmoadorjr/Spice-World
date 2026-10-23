// ============ NAKHODA: THE VOYAGE STATE ============
// Purse, hold, hull, reputation, standing with the courts, the Ascension
// ladder, charters, the monsoon calendar, and the save the atlas shares.

NK.events = (function () {
  const subs = {};
  return {
    on(ev, fn) { (subs[ev] = subs[ev] || []).push(fn); },
    emit(ev, a, b) { (subs[ev] || []).forEach(fn => { try { fn(a, b); } catch (e) { console.error(e); } }); }
  };
})();

NK.game = (function () {
  const SAVE_KEY = 'nakhoda-save-v4';
  const TIERS = [
    { n: 'Kelulus',    hold: 12,  hp: 600,  spd: 22, turn: 0.75, cost: 0,     wage: 0,   desc: "Small, swift, half-borrowed, patched everywhere. But she's yours." },
    { n: 'Pencalang',  hold: 26,  hp: 950,  spd: 24, turn: 0.62, cost: 1500,  wage: 15,  desc: 'The trader\'s path. Your ship, your cargo, your stake, your risk.' },
    { n: 'Malangbang', hold: 44,  hp: 1300, spd: 25, turn: 0.52, cost: 4200,  wage: 35,  desc: "Broad and flat-bottomed: you're chasing bulk and range now." },
    { n: 'Lancaran',   hold: 64,  hp: 1800, spd: 28, turn: 0.50, cost: 9500,  wage: 60,  desc: "War-fleet backbone. A name that reaches ports you've never sailed to." },
    { n: 'Jong',       hold: 110, hp: 2600, spd: 27, turn: 0.36, cost: 21000, wage: 100, desc: 'The ceiling of single-hull growth. The biggest cargo hull in the known world.' }
  ];
  const RANKS = [
    { n: 'The First Ship', req: s => true },
    { n: 'Nakhoda', req: s => s.tier >= 1 },
    { n: 'Rising Nakhoda', req: s => s.tier >= 2 && s.rep >= 30 },
    { n: 'Master Nakhoda', req: s => s.tier >= 3 && s.rep >= 80 },
    { n: 'Jong-Owner', req: s => s.tier >= 4 },
    { n: 'Sea Lord', req: s => s.seaLord }
  ];
  const RANK_TEXT = {
    'Nakhoda': 'Full and proper now. His ship, his cargo, his stake, his risk. Known by name in a port or two, owed money in another. He answers to no court and kneels to no throne, and everything he has, the sea gave him, and the sea can take back.',
    'Rising Nakhoda': "Not yet a name every port fears, but a name every port remembers. He's stopped being interchangeable with every other captain on the jetty.",
    'Master Nakhoda': "He's stopped thinking in single voyages. Now it's a season's worth of runs, and a name that reaches ports he's never personally sailed to.",
    'Jong-Owner': 'He has hauled the biggest cargo hull in the known world: wealth and prestige, real and visible. But still one hull, still one bad storm or raid from losing everything. Owning a jong proves he can carry a fortune. It does not yet prove he is a power.'
  };
  const SEA_LORD = { gold: 15000, rep: 200, court: 60 };
  const UPGRADES = {
    hull:  { n: 'Reinforced Hull', fx: '+250 hull',          base: 400 },
    sails: { n: 'Woven Sails',     fx: '+6% speed',          base: 500 },
    guns:  { n: 'Bronze Lantaka',  fx: '+18% shot, faster reload', base: 450 }
  };
  const DAY_SECONDS = 360;   // one day under sail at normal time

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const s = fresh();
  function fresh() {
    return {
      gold: 250, day: 1, dayFrac: 0.36, rep: 0, cargo: {}, tier: 0, upg: { hull: 0, sails: 0, guns: 0 },
      contract: null, stats: { deliveries: 0, piratesSunk: 0, merchantsSunk: 0, earned: 0 },
      seaLord: false, known: {}, factionRep: {}, lastRankSeen: RANKS[0].n, hp: null
    };
  }

  // ---------- Calendar & monsoon ----------
  // Four days of sailing make a month: a year at sea is a long evening's play.
  function monthIndex() { return (10 + Math.floor((s.day - 1) / 4)) % 12; }
  function year() { return 1500 + Math.floor((10 + Math.floor((s.day - 1) / 4)) / 12); }
  function season() {
    const m = monthIndex();
    if (m === 11 || m <= 1) return { key: 'ne', name: 'Northeast Monsoon', short: 'Utara', strength: 1 };
    if (m === 10 || m === 2) return { key: 'ne', name: 'Northeast Monsoon', short: 'Utara', strength: 0.7 };
    if (m >= 5 && m <= 7) return { key: 'sw', name: 'Southwest Monsoon', short: 'Selatan', strength: 1 };
    if (m === 8) return { key: 'sw', name: 'Southwest Monsoon', short: 'Selatan', strength: 0.75 };
    return { key: 'calm', name: m === 9 ? 'Inter-monsoon, Pancaroba' : 'Inter-monsoon, Pancaroba', short: 'Pancaroba', strength: 0.45 };
  }
  // The wind at a place: where it blows TO (unit x,z) and its strength.
  function wind(x, z) {
    const lat = worldUnproject(x, z).lat, se = season();
    const north = NK.smooth(-1, 5, lat);
    let ax, az;
    if (se.key === 'ne') { ax = NK.lerp(1.0, -0.72, north); az = NK.lerp(0.22, 0.7, north); }
    else if (se.key === 'sw') { ax = NK.lerp(-1.0, 0.72, north); az = NK.lerp(-0.35, -0.7, north); }
    else { const a = NK.T * 0.004 + x * 0.00003; ax = Math.cos(a); az = Math.sin(a); }
    let ang = Math.atan2(az, ax);
    ang += NK.fbm(x * 0.00012 + NK.T * 0.002, z * 0.00012, 3) * (se.key === 'calm' ? 1.2 : 0.55);
    const storm = NK.sky ? NK.sky.state.storm : 0;
    ang += storm * Math.sin(NK.T * 0.3) * 0.5;
    const gust = 0.85 + 0.15 * Math.sin(NK.T * 0.21 + x * 0.001) + NK.fbm(NK.T * 0.05, x * 0.0002, 2) * 0.2;
    const str = NK.clamp(se.strength * gust * (1 + storm * 0.7) * (1 - (NK.sky ? NK.sky.state.mist : 0) * 0.5), 0.2, 1.8);
    return { x: Math.cos(ang), z: Math.sin(ang), angle: ang, strength: str };
  }

  // ---------- Standing ----------
  const factionRep = k => k ? (s.factionRep[k] || 0) : 0;
  function addFactionRep(k, v) { if (!k) return; s.factionRep[k] = NK.clamp(factionRep(k) + v, -100, 100); }
  function rankName() { let r = RANKS[0].n; RANKS.forEach(rk => { if (rk.req(s)) r = rk.n; }); return r; }
  const holdMax = () => TIERS[s.tier].hold;
  const holdUsed = () => Object.values(s.cargo).reduce((a, c) => a + c.qty, 0);
  const maxHp = () => TIERS[s.tier].hp + s.upg.hull * 250;
  const maxSpeed = () => TIERS[s.tier].spd * (1 + s.upg.sails * 0.06);

  function addGold(v) { s.gold = Math.max(0, Math.round(s.gold + v)); if (v > 0) s.stats.earned += Math.round(v); NK.events.emit('gold', v); checkSeaLord(); }
  function addRep(v) { s.rep = Math.max(0, s.rep + v); NK.events.emit('rep', v); checkSeaLord(); checkRank(); }
  function addCargo(name, qty, cost) {
    const room = holdMax() - holdUsed(); qty = Math.min(qty, room); if (qty <= 0) return 0;
    const c = s.cargo[name] || { qty: 0, cost: 0 };
    c.cost = Math.round((c.cost * c.qty + (cost || 0) * qty) / (c.qty + qty)); c.qty += qty; s.cargo[name] = c;
    return qty;
  }
  function removeCargo(name, qty) { const c = s.cargo[name]; if (!c) return; c.qty -= qty; if (c.qty <= 0) delete s.cargo[name]; }

  function checkRank() {
    const r = rankName(); if (r === s.lastRankSeen) return;
    s.lastRankSeen = r;
    if (RANK_TEXT[r]) NK.events.emit('story', r, RANK_TEXT[r] + `<p class="nk-meta">Day ${s.day} · ${TIERS[s.tier].n} · Reputation ${s.rep}</p>`);
    save();
  }
  function checkSeaLord() {
    if (s.seaLord || s.tier < 4 || s.gold < SEA_LORD.gold || s.rep < SEA_LORD.rep) return;
    if (!Object.keys(s.factionRep).some(k => s.factionRep[k] >= SEA_LORD.court)) return;
    s.seaLord = true; s.lastRankSeen = 'Sea Lord'; save();
    NK.events.emit('story', "The Sultan's Envoy",
      'A prahu flying court colors hails you at dawn. A syahbandar\'s letter, sealed in wax: your name, written by a sultan\'s own scribe.' +
      '<p><b>You have been seen by power.</b> Jong flagship. Surplus wealth. A name every port remembers. The board has noticed you, which was the one condition you could never grant yourself.</p>' +
      '<p class="nk-gold">Rank achieved: Sea Lord</p><p><i>"Any fool can be born a lord. A nakhoda has to earn the sea\'s permission every single time he asks."</i></p>');
  }

  // ---------- Days ----------
  function advance(dt) {
    s.dayFrac += dt / DAY_SECONDS;
    if (s.dayFrac >= 1) { s.dayFrac -= 1; newDay(); }
  }
  function newDay() {
    s.day++;
    const msgs = [];
    const wage = TIERS[s.tier].wage;
    if (wage) { if (s.gold >= wage) { s.gold -= wage; msgs.push(`−${wage} pisis crew wages`); } else { s.gold = 0; addRep(-2); msgs.push('wages unpaid, the crew grumbles (−2 rep)'); } }
    NK.econ.GOODS.forEach(g => {
      if (!g.perish) return; const c = s.cargo[g.n]; if (!c) return;
      const lost = Math.min(c.qty, Math.ceil(c.qty * 0.08)); removeCargo(g.n, lost); if (lost) msgs.push(`${lost} ${g.n} spoiled`);
    });
    NK.econ.newDay();
    if (s.contract && s.day > s.contract.expiresDay) {
      NK.events.emit('toast', `The charter to ${PORT_DATA[s.contract.destIdx].name} has expired. Word travels (−5 rep).`, 'bad');
      s.contract = null; addRep(-5);
    }
    NK.events.emit('day', s.day, msgs);
    if (monthIndex() !== (10 + Math.floor((s.day - 2) / 4)) % 12) NK.events.emit('month', MONTHS[monthIndex()], season());
    save();
  }

  // ---------- Charters ----------
  function offerCharter(port) {
    const ports = NK.ports.list, E = NK.econ;
    const opts = [];
    ports.forEach(d => { if (d === port) return; (E.TRADE[d.name] || { want: [] }).want.forEach(n => { const gi = E.G[n]; if (E.role(port, gi) === 'prod') opts.push({ d, gi }); }); });
    if (!opts.length) ports.forEach(d => { if (d !== port && Math.hypot(d.x - port.x, d.z - port.z) < 9000) (E.TRADE[d.name] || { want: [] }).want.forEach(n => { if (E.available(port, E.G[n])) opts.push({ d, gi: E.G[n] }); }); });
    if (!opts.length) return null;
    const pick = opts[Math.floor(NK.hash3(port.idx, s.day, s.stats.deliveries) * opts.length)];
    const path = NK.world.route(port.ax, port.az, pick.d.ax, pick.d.az);
    let dist = 0; if (path) for (let i = 1; i < path.length; i++) dist += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
    else dist = Math.hypot(pick.d.x - port.x, pick.d.z - port.z) * 1.4;
    const qty = Math.min(holdMax(), 4 + Math.floor(NK.hash3(port.idx, s.day, 9) * 5) + s.tier * 3);
    const value = E.price(pick.d, pick.gi, 'sell') * qty;
    const days = Math.max(2, Math.ceil(dist / (maxSpeed() * 0.7 * DAY_SECONDS) * 1.5) + 1);
    return { good: E.GOODS[pick.gi].n, qty, destIdx: pick.d.idx, reward: Math.round(value * 0.55 + dist * 0.09), expiresDay: s.day + days, dist: Math.round(dist) };
  }

  // ---------- Save ----------
  let lastSave = 0;
  function snapshot() {
    const p = NK.player && NK.player.pos;
    const out = {
      v: 4, world: 2, savedAt: Date.now(),
      gold: s.gold, day: s.day, dayFrac: s.dayFrac, rep: s.rep, cargo: s.cargo, tier: s.tier, upg: s.upg, stats: s.stats,
      seaLord: s.seaLord, contract: s.contract, known: s.known, factionRep: s.factionRep, lastRankSeen: s.lastRankSeen,
      mkt: NK.econ.market
    };
    if (p) { out.x = Math.round(p.x); out.z = Math.round(p.z); const ll = worldUnproject(p.x, p.z); out.lat = +ll.lat.toFixed(3); out.lng = +ll.lng.toFixed(3); out.heading = NK.player.heading; out.hp = Math.round(NK.player.hp); }
    return out;
  }
  function save() {
    lastSave = NK.T;
    const snap = snapshot();
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(snap)); } catch (e) {}
    if (NK.embedded) { try { window.parent.postMessage({ type: 'nakhoda-save', save: snap }, '*'); } catch (e) {} }
  }
  function readSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem('nakhoda-save-v3') || localStorage.getItem('nakhoda-save-v2');
      const d = raw ? JSON.parse(raw) : null; return d && typeof d === 'object' ? d : null;
    } catch (e) { return null; }
  }
  function load(d) {
    if (!d) return false;
    Object.assign(s, fresh());
    s.gold = d.gold ?? 250; s.day = d.day ?? 1; s.dayFrac = d.dayFrac ?? 0.3; s.rep = d.rep ?? 0;
    s.cargo = {}; Object.keys(d.cargo || {}).forEach(k => { if (NK.econ.G[k] !== undefined && d.cargo[k].qty > 0) s.cargo[k] = d.cargo[k]; });
    s.tier = NK.clamp(d.tier ?? 0, 0, TIERS.length - 1);
    s.upg = Object.assign({ hull: 0, sails: 0, guns: 0 }, d.upg);
    s.stats = Object.assign(s.stats, d.stats); s.seaLord = !!d.seaLord;
    s.known = d.known || {}; s.factionRep = d.factionRep || {}; s.lastRankSeen = d.lastRankSeen || rankName();
    s.contract = d.contract && PORT_DATA[d.contract.destIdx] ? d.contract : null;
    NK.econ.market = d.mkt;
    // Positions from the old 40-island sim don't map onto the real coasts.
    s.resume = d.world === 2 && typeof d.x === 'number' ? { x: d.x, z: d.z, heading: d.heading || 0, hp: d.hp } : null;
    return true;
  }
  function reset() { Object.assign(s, fresh()); NK.econ.market = {}; s.resume = null; }
  function autosave() { if (NK.T - lastSave > 20) save(); }

  return {
    state: s, TIERS, RANKS, UPGRADES, SEA_LORD, MONTHS, DAY_SECONDS,
    monthIndex, year, season, wind, factionRep, addFactionRep, rankName,
    holdMax, holdUsed, maxHp, maxSpeed, addGold, addRep, addCargo, removeCargo,
    advance, offerCharter, save, readSave, load, reset, autosave, checkRank,
    dateLabel: () => `${MONTHS[monthIndex()]} ${year()}`
  };
})();
