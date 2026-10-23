// ============ NAKHODA: IN PORT ============
// The parchment sheet you read at anchor: the market ledger, the
// shipwrights, the tavern's talk, and the syahbandar's charters.

NK.port = (function () {
  let port = null, tab = 'market', offer = null;
  const E = () => NK.econ, Gm = () => NK.game;

  const TALK = {
    'Melaka': ['Eighty-odd tongues are spoken on the Melaka waterfront, and every one of them is haggling.', 'They say the old Laksamana Hang Tuah still walks the jetty at dawn.', 'Four syahbandars here: one for the Gujaratis, one for Java and the Moluccas, one for Bengal and Pegu, one for the China junks.'],
    'Ternate': ['Sultan Al-Mansur decides who fills a hold with cloves and who sails home empty.', 'The mountain smoked last night. The clove pickers didn\'t look up.'],
    'Tidore': ['Tidore and Ternate: two sultans, one strait, and not one clove that either will let the other sell cheap.'],
    'Banda': ['No sultan on Banda. The orang kaya of each village make their own price for nutmeg, and their own enemies.'],
    'Demak': ['Raden Patah\'s Demak grows by the season. Majapahit\'s old coast is turning to the Crescent.'],
    'Brunei': ['Sultan Bolkiah\'s fleets reach Luzon. Every captain here talks of the Sultan\'s reach, quietly.'],
    'Jolo': ['Pearls off Jolo, raiders off Jolo. Sometimes the same boats.'],
    'Pasai': ['Pasai pepper fills the Gujarati holds, and Aceh, upriver, is watching Pasai\'s purse.'],
    'Maynila': ['The China junks anchor here with porcelain, and the Bornean lords of the bay want cloth and pepper for it.'],
    'Bali': ['The Gelgel court still keeps the old gods; the meru towers stand taller every year.'],
    'Makassar': ['Gowa\'s karaeng is building ships and ambitions. Makassar will matter, one day soon.'],
    '_': ['A pilot swears the reef off the point has moved since last monsoon.', 'Miss the turn of the monsoon and you sit a whole season waiting for the next one.', 'Cloth is the true money east of Java. Bring cloth and you can name your price in cloves.', 'Penjajap were seen off the headland at dusk: low, fast, black sails.', 'The rice ships from Java are late, and the spice islands are hungry.', 'A Bugis captain says the Sulu raiders now hunt anything bigger than a pencalang.']
  };

  function open(p) {
    port = p; tab = 'market';
    offer = Gm().state.contract ? null : Gm().offerCharter(p);
    render();
  }
  function head() {
    const s = Gm().state, f = port.faction ? FACTIONS[port.faction] : null, rep = Gm().factionRep(port.faction);
    const tr = E().TRADE[port.name] || { prod: [], want: [] };
    return `<div class="sheet-head">
      <div>
        <div class="kicker">${port.entrepot ? 'Entrepôt' : port.maluku ? 'Spice port' : 'Port'} · Day ${s.day}, ${Gm().dateLabel()}</div>
        <h1>${port.name}</h1>
        <div class="sub">${f ? `<b>${f.name}</b>${f.ruler ? ', ' + f.ruler : ''}<span class="standing ${rep >= 15 ? 'up' : rep <= -15 ? 'down' : ''}">Standing ${rep > 0 ? '+' : ''}${Math.round(rep)}</span>` : '<b>Independent port</b>: no tariff, and no favor'}
        <br>Grown here: <b>${tr.prod.join(', ')}</b> · Wanted here: <b>${tr.want.join(', ')}</b></div>
      </div>
      <div class="purse-ink"><b>${NK.fmt(s.gold)}</b> pisis<div>Hold ${Gm().holdUsed()} / ${Gm().holdMax()} · Hull ${Math.round(NK.player.hp)} / ${Gm().maxHp()}</div>
        <button class="btn primary" style="margin-top:10px" id="pt-leave">Weigh anchor</button></div>
    </div>
    <div class="tabs">${[['market', 'Market'], ['yard', 'Shipwrights'], ['tavern', 'Tavern'], ['harbour', 'Syahbandar']].map(([k, l]) => `<button data-tab="${k}" class="${tab === k ? 'on' : ''}">${l}</button>`).join('')}</div>`;
  }

  function market() {
    const s = Gm().state, G = E().GOODS;
    const rows = G.map((g, gi) => {
      const role = E().role(port, gi), own = s.cargo[g.n], can = E().available(port, gi);
      if (!can && !own && role !== 'want') return '';
      const buy = E().price(port, gi, 'buy'), sell = E().price(port, gi, 'sell');
      const margin = own ? sell - own.cost : 0;
      const tag = role === 'prod' ? '<span class="tag prod">Grown here</span>' : role === 'want' ? '<span class="tag want">Wanted</span>' : '';
      return `<tr title="${g.note}">
        <td><span class="good-name">${g.n}</span>${tag}${g.perish ? '<div class="note">Perishes at sea</div>' : ''}</td>
        <td class="num hide-sm">${own ? `${own.qty} <span class="note">@${own.cost}</span>` : '<span class="note">none</span>'}</td>
        <td class="num">${can ? buy : '<span class="note">none</span>'}</td>
        <td class="num">${sell}${own ? `<div class="${margin >= 0 ? 'profit' : 'loss'}">${margin >= 0 ? '+' : ''}${margin} each</div>` : ''}</td>
        <td class="acts">${can ? `<button class="btn small" data-buy="${gi}" data-q="1">+1</button><button class="btn small" data-buy="${gi}" data-q="5">+5</button><button class="btn small" data-buy="${gi}" data-q="999">Max</button>` : ''}
          ${own ? `<button class="btn small" data-sell="${gi}" data-q="1">−1</button><button class="btn small go" data-sell="${gi}" data-q="999">Sell all</button>` : ''}</td>
      </tr>`;
    }).join('');
    return `<table class="ledger"><thead><tr><th>Goods</th><th class="hide-sm num">In hold</th><th class="num">Buy</th><th class="num">Sell</th><th></th></tr></thead><tbody>${rows}</tbody></table>
      <p class="note" style="margin-top:12px">Prices move with what you sell and buy: flood a market and it sags, leave it a week and it recovers. ${port.faction ? 'Your standing with this court shades every price here.' : ''}</p>`;
  }

  function yard() {
    const s = Gm().state, T = Gm().TIERS, t = T[s.tier], P = NK.player;
    const dmg = Math.max(0, Math.round(Gm().maxHp() - P.hp)), repair = Math.ceil(dmg / 3);
    let html = `<div class="cards">
      <div class="card"><div class="kicker">Your ship</div><h3>${t.n}</h3><p>${t.desc}</p>
        <div class="stats">Hold ${t.hold} · Hull ${Math.round(P.hp)} / ${Gm().maxHp()} · ${(Gm().maxSpeed() * 0.36).toFixed(1)} knots · Crew wages ${t.wage}/day</div>
        <button class="btn ${dmg ? 'go' : ''}" data-act="repair" ${dmg && s.gold >= 1 ? '' : 'disabled'}>${dmg ? `Repair the hull · ${repair} pisis` : 'The hull is sound'}</button></div>`;
    Object.entries(Gm().UPGRADES).forEach(([k, u]) => {
      const lv = s.upg[k], cost = u.base * (lv + 1), max = lv >= 5;
      html += `<div class="card"><div class="kicker">Refit</div><h3>${u.n}<span class="lv">${[0, 1, 2, 3, 4].map(i => `<i class="${i < lv ? 'on' : ''}"></i>`).join('')}</span></h3>
        <p>${u.fx} per level.</p><button class="btn" data-up="${k}" ${max || s.gold < cost ? 'disabled' : ''}>${max ? 'Fully refitted' : `Refit · ${NK.fmt(cost)} pisis`}</button></div>`;
    });
    if (s.tier < T.length - 1) {
      const nx = T[s.tier + 1];
      html += `<div class="card" style="border-color:rgba(138,101,40,0.6)"><div class="kicker">Commission a new hull</div><h3>${nx.n}</h3><p>${nx.desc}</p>
        <div class="stats">Hold ${nx.hold} · Hull ${nx.hp} · ${(nx.spd * 0.36).toFixed(1)} knots · Wages ${nx.wage}/day</div>
        <button class="btn primary" data-act="tier" ${s.gold < nx.cost ? 'disabled' : ''}>Commission · ${NK.fmt(nx.cost)} pisis</button></div>`;
    } else {
      const S = Gm().SEA_LORD;
      html += `<div class="card"><div class="kicker">The summit</div><h3>${s.seaLord ? 'Sea Lord' : 'What remains is not a bigger boat'}</h3>
        <p>${s.seaLord ? 'The courts know your name. The Game above the waves is only beginning.' : `A Sea Lord needs a jong, ${NK.fmt(S.gold)} pisis (you hold ${NK.fmt(s.gold)}), reputation ${S.rep} (yours: ${s.rep}), and a court that has noticed you: standing of +${S.court} with any one of them.`}</p></div>`;
    }
    return html + '</div>';
  }

  function tavern() {
    const lines = (TALK[port.name] || []).concat(TALK._);
    const pick = lines[Math.floor(NK.hash3(port.idx, Gm().state.day, 4) * lines.length)];
    return `<div class="quote">"${pick}"</div>
      <div class="cards">
        <div class="card"><h3>Buy a pilot a drink</h3><p>Tuak flows, betel is passed, and every table talks routes and prices. A pilot will tell you where a cargo fetches most, for the price of his evening.</p>
          <button class="btn" data-act="rumor" ${Gm().state.gold < 15 ? 'disabled' : ''}>Listen · 15 pisis</button><div id="rumor" class="sub" style="margin-top:10px"></div></div>
        <div class="card"><h3>Sleep ashore</h3><p>Rest the crew until the next dawn. Time passes, wages are paid, and markets drift.</p>
          <button class="btn" data-act="sleep">Sleep until dawn</button></div>
        <div class="card"><h3>The ledger</h3><p>${Gm().state.stats.deliveries} charters delivered · ${Gm().state.stats.piratesSunk} pirates sunk · ${Gm().state.stats.merchantsSunk} merchants plundered · ${NK.fmt(Gm().state.stats.earned)} pisis earned in all.</p></div>
      </div>`;
  }

  function harbour() {
    const s = Gm().state, c = s.contract;
    if (c) {
      const dest = NK.ports.list[c.destIdx], have = (s.cargo[c.good] || { qty: 0 }).qty, here = dest === port;
      return `<div class="card"><div class="kicker">Your charter</div><h3>${c.qty} ${c.good} to ${dest.name}</h3>
        <p>Deliver by day ${c.expiresDay} (today is day ${s.day}). Reward <b>${NK.fmt(c.reward)} pisis</b>, and the name of a captain who keeps his word. You carry ${have} of ${c.qty}.</p>
        ${here ? `<button class="btn go" data-act="deliver" ${have >= c.qty ? '' : 'disabled'}>Deliver the cargo</button> ` : ''}
        <button class="btn" data-act="abandon">Abandon the charter (−4 rep)</button></div>`;
    }
    if (!offer) return `<div class="card"><h3>No charters today</h3><p>The syahbandar has nothing for a ${Gm().TIERS[s.tier].n}. Try again tomorrow, or another port.</p></div>`;
    const dest = NK.ports.list[offer.destIdx];
    return `<div class="card"><div class="kicker">The syahbandar offers a charter</div><h3>${offer.qty} ${offer.good} to ${dest.name}</h3>
      <p>A merchant of ${port.name} needs ${offer.good.toLowerCase()} carried to ${dest.name}, about ${Math.round(offer.dist / WORLD_PROJ.scale * 60)} sea miles by the pilot's road. You buy the cargo here; he pays on delivery.</p>
      <div class="stats">Reward ${NK.fmt(offer.reward)} pisis · Deliver by day ${offer.expiresDay} · +6 rep, and ${dest.faction ? FACTIONS[dest.faction].name : dest.name} will remember you</div>
      <button class="btn go" data-act="accept">Accept the charter</button></div>`;
  }

  function render() {
    const body = tab === 'market' ? market() : tab === 'yard' ? yard() : tab === 'tavern' ? tavern() : harbour();
    const scroll = NK.$('pt-body') ? NK.$('pt-body').scrollTop : 0;
    NK.ui.showModal(`<div class="sheet">${head()}<div class="sheet-body" id="pt-body">${body}</div></div>`, 'port');
    NK.$('pt-body').scrollTop = scroll;
    NK.$('pt-leave').onclick = leave;
    document.querySelectorAll('.tabs button').forEach(b => b.onclick = () => { tab = b.dataset.tab; render(); NK.$('pt-body').scrollTop = 0; });
    document.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => buy(+b.dataset.buy, +b.dataset.q));
    document.querySelectorAll('[data-sell]').forEach(b => b.onclick = () => sell(+b.dataset.sell, +b.dataset.q));
    document.querySelectorAll('[data-up]').forEach(b => b.onclick = () => upgrade(b.dataset.up));
    document.querySelectorAll('[data-act]').forEach(b => b.onclick = () => act(b.dataset.act));
  }

  function buy(gi, q) {
    const s = Gm().state, g = E().GOODS[gi];
    let n = 0, spent = 0;
    // Buy one bale at a time so the price climbs as you strip the market.
    while (n < q) {
      const p = E().price(port, gi, 'buy');
      if (s.gold < p || Gm().holdUsed() >= Gm().holdMax()) break;
      Gm().addGold(-p); Gm().addCargo(g.n, 1, p); E().trade(port, gi, 1, true); n++; spent += p;
    }
    if (!n) NK.ui.toast(Gm().holdUsed() >= Gm().holdMax() ? 'The hold is full.' : 'Not enough pisis.', 'bad');
    else { Gm().addFactionRep(port.faction, n * 0.15); NK.events.emit('coins'); }
    render();
  }
  function sell(gi, q) {
    const s = Gm().state, g = E().GOODS[gi]; let n = 0, got = 0, profit = 0;
    while (n < q && s.cargo[g.n]) {
      const p = E().price(port, gi, 'sell'), c = s.cargo[g.n];
      profit += p - c.cost; Gm().addGold(p); Gm().removeCargo(g.n, 1); E().trade(port, gi, 1, false); n++; got += p;
    }
    if (n) { Gm().addFactionRep(port.faction, n * 0.25); NK.events.emit('coins'); NK.ui.toast(`Sold ${n} ${g.n} for ${NK.fmt(got)} pisis${profit ? ` (${profit >= 0 ? 'profit' : 'loss'} ${NK.fmt(Math.abs(profit))})` : ''}.`, profit >= 0 ? 'good' : 'bad'); }
    render();
  }
  function upgrade(k) {
    const s = Gm().state, cost = Gm().UPGRADES[k].base * (s.upg[k] + 1);
    if (s.gold < cost || s.upg[k] >= 5) return;
    Gm().addGold(-cost); s.upg[k]++;
    if (k === 'hull') NK.player.hp += 250;
    NK.ui.toast('The shipwrights work through the night.', 'good'); Gm().save(); render();
  }
  function act(a) {
    const s = Gm().state, P = NK.player;
    if (a === 'repair') {
      const dmg = Math.max(0, Gm().maxHp() - P.hp), cost = Math.ceil(dmg / 3);
      const pay = Math.min(cost, s.gold); Gm().addGold(-pay); P.hp = Math.min(Gm().maxHp(), P.hp + pay * 3);
      NK.ui.toast(pay < cost ? 'Patched as far as your purse allows.' : 'Hull repaired. She is whole again.', 'good');
    } else if (a === 'tier') {
      const nx = Gm().TIERS[s.tier + 1]; if (!nx || s.gold < nx.cost) return;
      Gm().addGold(-nx.cost); s.tier++; P.hp = Gm().maxHp(); Gm().addRep(10);
      NK.ui.story(`The ${nx.n}`, `${nx.desc}<p>Hold <b>${nx.hold}</b> · Hull <b>${nx.hp}</b> · Rank: <b>${Gm().rankName()}</b></p><p><i>The boy on the jetty would not recognize the man at this stern.</i></p>`);
      Gm().checkRank();
    } else if (a === 'rumor') {
      if (s.gold < 15) return; Gm().addGold(-15);
      let best = null;
      NK.ports.list.forEach(d => { if (d === port) return; (E().TRADE[d.name] || { want: [] }).want.forEach(n => { const gi = E().G[n]; const pr = E().price(d, gi, 'sell'); const gain = pr - E().price(port, gi, 'buy'); if (E().available(port, gi) && (!best || gain > best.gain)) best = { d, n, pr, gain }; }); });
      Gm().save(); render();
      NK.$('rumor').innerHTML = best ? `<i>"Buy <b>${best.n}</b> here. In <b>${best.d.name}</b> it fetches <b>${best.pr}</b> a bale right now, and nobody's told them it's cheap in ${port.name}."</i>` : '<i>The pilot shrugs and drinks your tuak.</i>';
      return;
    } else if (a === 'sleep') {
      if (s.dayFrac > 0.27) Gm().advance((1 - s.dayFrac + 0.27) * Gm().DAY_SECONDS); else s.dayFrac = 0.27;
      P.hp = Math.min(Gm().maxHp(), P.hp + 40);
      NK.ui.toast('You wake to the call to prayer and the smell of the market.', 'info');
      offer = s.contract ? null : Gm().offerCharter(port);
    } else if (a === 'accept') {
      s.contract = offer; offer = null;
      NK.ui.toast(`Charter accepted: ${s.contract.qty} ${s.contract.good} to ${NK.ports.list[s.contract.destIdx].name}. Buy the cargo in the market.`, 'good');
    } else if (a === 'deliver') {
      const c = s.contract; Gm().removeCargo(c.good, c.qty);
      Gm().addGold(c.reward); Gm().addRep(6); Gm().addFactionRep(port.faction, 8); s.stats.deliveries++; s.contract = null;
      NK.events.emit('coins');
      NK.ui.toast(`Charter delivered: ${NK.fmt(c.reward)} pisis, and ${port.name} remembers your name (+6 rep).`, 'good');
      offer = Gm().offerCharter(port);
    } else if (a === 'abandon') {
      s.contract = null; Gm().addRep(-4); NK.ui.toast('Charter abandoned. Word travels (−4 rep).', 'bad');
      offer = Gm().offerCharter(port);
    }
    Gm().save();
    if (NK.ui.modal() === 'port') render();
  }
  function leave() {
    NK.ui.closeModal();
    const P = NK.player;
    P.placeAt(port);
    P.sailTarget = 0.5;
  }

  return { open, render, get port() { return port; } };
})();
