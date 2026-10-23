// ============ NAKHODA: MARKETS ============
// The goods of 1500, who grows them, who hungers for them, and a living
// market at every port: sell a hold of cloves in Melaka and the price
// sags; leave it a week and it climbs back. Ports under a court apply a
// tariff (or a favor) according to your standing with that court.

NK.econ = (function () {
  const GOODS = [
    { n: 'Rice',          p: 8,   perish: true,  note: 'Java and Siam feed the spice islands, which grow no grain of their own.' },
    { n: 'Sea Salt',      p: 6,   note: 'Panned on the Javanese and Malay shores; every fishing village needs it.' },
    { n: 'Betel & Areca', p: 10,  perish: true,  note: 'Chewed in every court and every kampung. Rots in a week.' },
    { n: 'Cotton Cloth',  p: 14,  note: 'Gujarati and Coromandel cloth, the true currency of the eastern spice trade.' },
    { n: 'Beeswax',       p: 18,  note: 'Forest wax from Timor, Borneo and the Philippines, for candles and lost-wax bronze.' },
    { n: 'Tripang',       p: 22,  note: 'Dried sea cucumber, dived by the Bajau and craved by Chinese buyers.' },
    { n: 'Ceramics',      p: 30,  note: 'Ming porcelain and Siamese stoneware off the China junks.' },
    { n: 'Benzoin',       p: 34,  note: 'Kemenyan resin of Sumatra, burned in mosques, temples and churches alike.' },
    { n: 'Black Pepper',  p: 40,  note: 'The vine of Sunda, Pasai and Jambi. The bulk spice of the age.' },
    { n: 'Sandalwood',    p: 44,  note: 'White sandalwood of Timor, at the edge of the maps.' },
    { n: 'Cinnamon',      p: 46,  note: 'Wild cinnamon bark of Mindanao.' },
    { n: "Camphor",       p: 48,  note: 'Barus camphor, crystals from the heart of the tree, worth its weight in silver.' },
    { n: "Birds' Nests",  p: 60,  note: 'Swiftlet nests from the limestone caves of Borneo.' },
    { n: 'Nutmeg',        p: 70,  note: 'Grows on the Banda Islands and nowhere else on earth.' },
    { n: 'Cloves',        p: 80,  note: 'The dried buds of the clove tree of North Maluku: the reason the world comes east.' },
    { n: 'Mace',          p: 85,  note: 'The red aril around the nutmeg seed. Banda only.' },
    { n: 'Pearls',        p: 90,  note: 'Sulu pearls, dived from the banks around Jolo.' },
    { n: 'Gold Dust',     p: 120, note: 'Panned from the rivers of Sumatra, Borneo and Mindanao.' }
  ];
  const G = {}; GOODS.forEach((g, i) => G[g.n] = i);

  // What each port sells cheap (prod) and pays dear for (want).
  const TRADE = {
    'Melaka':       { prod: ['Cotton Cloth', 'Ceramics'],         want: ['Cloves', 'Nutmeg', 'Mace', 'Black Pepper'] },
    'Pasai':        { prod: ['Black Pepper', 'Benzoin'],          want: ['Cotton Cloth', 'Ceramics'] },
    'Aceh':         { prod: ['Black Pepper', 'Camphor'],          want: ['Cotton Cloth', 'Rice'] },
    'Aru':          { prod: ['Camphor', 'Benzoin'],               want: ['Cotton Cloth', 'Rice'] },
    'Kedah':        { prod: ['Rice', 'Sea Salt'],                 want: ['Cotton Cloth', 'Ceramics'] },
    'Patani':       { prod: ['Ceramics', 'Sea Salt'],             want: ['Black Pepper', 'Benzoin'] },
    'Terengganu':   { prod: ["Birds' Nests", 'Gold Dust'],        want: ['Rice', 'Cotton Cloth'] },
    'Pahang':       { prod: ['Gold Dust', 'Camphor'],             want: ['Cotton Cloth', 'Rice'] },
    'Palembang':    { prod: ['Beeswax', 'Benzoin'],               want: ['Ceramics', 'Cotton Cloth'] },
    'Jambi':        { prod: ['Black Pepper', 'Gold Dust'],        want: ['Ceramics', 'Sea Salt'] },
    'Banten':       { prod: ['Black Pepper', 'Rice'],             want: ['Cotton Cloth', 'Ceramics'] },
    'Sunda Kelapa': { prod: ['Black Pepper', 'Rice'],             want: ['Cotton Cloth', 'Cloves'] },
    'Demak':        { prod: ['Rice', 'Sea Salt'],                 want: ['Cloves', 'Nutmeg', 'Mace'] },
    'Tuban':        { prod: ['Rice', 'Sea Salt'],                 want: ['Ceramics', 'Pearls'] },
    'Gresik':       { prod: ['Rice', 'Cotton Cloth'],             want: ['Cloves', 'Nutmeg'] },
    'Surabaya':     { prod: ['Rice', 'Beeswax'],                  want: ['Ceramics', 'Sandalwood'] },
    'Bali':         { prod: ['Rice', 'Cotton Cloth'],             want: ['Ceramics', 'Pearls'] },
    'Lombok':       { prod: ['Rice', 'Betel & Areca'],            want: ['Ceramics', 'Sea Salt'] },
    'Bima':         { prod: ['Rice', 'Sandalwood'],               want: ['Cotton Cloth', 'Ceramics'] },
    'Timor':        { prod: ['Sandalwood', 'Beeswax'],            want: ['Cotton Cloth', 'Ceramics'] },
    'Kupang':       { prod: ['Sandalwood', 'Beeswax'],            want: ['Cotton Cloth', 'Rice'] },
    'Banjarmasin':  { prod: ['Beeswax', 'Gold Dust'],             want: ['Rice', 'Cotton Cloth'] },
    'Brunei':       { prod: ['Camphor', "Birds' Nests"],          want: ['Cotton Cloth', 'Cloves', 'Ceramics'] },
    'Makassar':     { prod: ['Rice', 'Tripang'],                  want: ['Ceramics', 'Nutmeg', 'Cotton Cloth'] },
    'Gowa':         { prod: ['Rice', 'Cotton Cloth'],             want: ['Gold Dust', 'Ceramics'] },
    'Buton':        { prod: ['Tripang', 'Beeswax'],               want: ['Rice', 'Cotton Cloth'] },
    'Ternate':      { prod: ['Cloves'],                           want: ['Rice', 'Cotton Cloth', 'Ceramics'] },
    'Tidore':       { prod: ['Cloves'],                           want: ['Rice', 'Cotton Cloth'] },
    'Hitu':         { prod: ['Cloves'],                           want: ['Rice', 'Cotton Cloth'] },
    'Ambon':        { prod: ['Cloves', 'Betel & Areca'],          want: ['Rice', 'Sea Salt'] },
    'Banda':        { prod: ['Nutmeg', 'Mace'],                   want: ['Rice', 'Cotton Cloth', 'Ceramics'] },
    'Jolo':         { prod: ['Pearls', 'Tripang'],                want: ['Rice', 'Ceramics'] },
    'Zamboanga':    { prod: ['Cinnamon', 'Pearls'],               want: ['Rice', 'Ceramics'] },
    'Cotabato':     { prod: ['Cinnamon', 'Beeswax'],              want: ['Ceramics', 'Cotton Cloth'] },
    'Butuan':       { prod: ['Gold Dust', 'Beeswax'],             want: ['Ceramics', 'Cotton Cloth'] },
    'Sugbu':        { prod: ['Beeswax', 'Betel & Areca'],         want: ['Ceramics', 'Rice'] },
    'Panay':        { prod: ['Rice', 'Cotton Cloth'],             want: ['Ceramics', 'Benzoin'] },
    'Mindoro':      { prod: ['Gold Dust', 'Beeswax'],             want: ['Ceramics', 'Cotton Cloth'] },
    'Maynila':      { prod: ['Ceramics', 'Gold Dust'],            want: ['Cotton Cloth', 'Cinnamon', 'Black Pepper'] },
    'Tondo':        { prod: ['Gold Dust', 'Beeswax'],             want: ['Ceramics', 'Cotton Cloth'] }
  };

  // market[portIdx][goodIdx] = glut level: + oversupplied, - starved.
  let market = {};
  const glut = (pi, gi) => (market[pi] && market[pi][gi]) || 0;
  const depth = p => p.entrepot ? 140 : p.maluku ? 70 : 55;

  function role(port, gi) {
    const t = TRADE[port.name]; if (!t) return 'none';
    if (t.prod.includes(GOODS[gi].n)) return 'prod';
    if (t.want.includes(GOODS[gi].n)) return 'want';
    return 'none';
  }
  function tariff(port, mode) {
    const f = port.faction; if (!f) return 1;
    const t = NK.clamp(NK.game.factionRep(f) / 500, -0.2, 0.2);
    return mode === 'buy' ? 1 - t : 1 + t;
  }
  function price(port, gi, mode) {
    const g = GOODS[gi], r = role(port, gi);
    const base = r === 'prod' ? 0.55 : r === 'want' ? 1.85 : 1.12;
    const tide = 0.93 + NK.hash3(port.idx, gi, NK.game.state.day) * 0.14;
    const supply = NK.clamp(1 - glut(port.idx, gi) * 0.45, 0.45, 1.6);
    const spread = mode === 'buy' ? 1.07 : 0.93;
    return Math.max(2, Math.round(g.p * base * tide * supply * spread * tariff(port, mode)));
  }
  // Ports stock what they make and a little of everything else.
  function available(port, gi) {
    const r = role(port, gi);
    return r === 'prod' || (r === 'none' && NK.hash3(port.idx, gi, 3) < 0.35) || (port.entrepot && r !== 'want');
  }
  function trade(port, gi, qty, buying) {
    const m = market[port.idx] || (market[port.idx] = {});
    m[gi] = NK.clamp((m[gi] || 0) + (buying ? -qty : qty) / depth(port), -1.4, 1.4);
  }
  function newDay() {
    Object.keys(market).forEach(pi => { const m = market[pi]; Object.keys(m).forEach(gi => { m[gi] *= 0.8; if (Math.abs(m[gi]) < 0.02) delete m[gi]; }); });
  }

  return {
    GOODS, G, TRADE, role, price, available, trade, newDay,
    get market() { return market; }, set market(v) { market = v || {}; }
  };
})();
