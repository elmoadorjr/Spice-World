// ============ NAKHODA MODE — embedded voyage sim ============
// The full 3D trading sim (Three.js) lives in sim.html and launches into a
// same-origin iframe, so the chart room and the voyage never fight over
// globals, CSS, or libraries.
(function(){
  const simShell = document.getElementById('sim-shell');
  const simLoading = document.getElementById('sim-loading');
  const sailBtnMenu = document.getElementById('main-menu-sail-btn');
  const sailBtnMap = document.getElementById('map-sail-btn');
  const treasuryEl = document.getElementById('main-menu-treasury');
  let simFrame = null;
  let saveData = null;

  // v4 saves add faction standing + the last Ascension rank shown; v3/v2
  // saves still load fine (the sim fills the gaps) and are rewritten as v4
  // on next save.
  try {
    saveData = JSON.parse(localStorage.getItem('nakhoda-save-v4') || 'null')
            || JSON.parse(localStorage.getItem('nakhoda-save-v3') || 'null')
            || JSON.parse(localStorage.getItem('nakhoda-save-v2') || 'null');
    if (saveData && typeof saveData !== 'object') saveData = null;
  } catch(e) { saveData = null; }

  const TIER_NAMES = ['Kelulus','Pencalang','Malangbang','Lancaran','Jong'];
  function renderTreasury(){
    if (!saveData) { treasuryEl.textContent = ''; return; }
    const tier = TIER_NAMES[Math.min(saveData.tier || 0, 4)];
    const lord = saveData.seaLord ? ' \u00b7 SEA LORD' : '';
    treasuryEl.textContent = `Day ${saveData.day || 1} \u00b7 ${tier} \u00b7 ${saveData.gold || 0} pisis \u00b7 Rep ${saveData.rep || 0}${lord}`;
  }

  function storeSave(s){
    saveData = s;
    try { localStorage.setItem('nakhoda-save-v4', JSON.stringify(s)); } catch(e) {}
    renderTreasury();
    if (window.updateVoyageLayer) window.updateVoyageLayer(s);
  }

  function currentBookTitle(){
    try {
      const book = SERIES_BOOKS.find(b => b.n === selectedBook);
      return book ? book.label : 'Crescent and Crossroads';
    } catch(e){ return 'Crescent and Crossroads'; }
  }

  function launchSim(){
    if (simFrame) return; // already running
    menuOverlay.style.display = 'none';
    document.getElementById('lore-overlay').style.display = 'none';
    simShell.classList.add('active');
    simLoading.style.display = 'flex';

    simFrame = document.createElement('iframe');
    simFrame.setAttribute('allow', 'fullscreen');
    simFrame.src = 'sim.html';
    simFrame.addEventListener('load', () => {
      // Hand the voyage its context: saved treasury + the book being sailed.
      setTimeout(() => {
        try {
          simFrame.contentWindow.postMessage({
            type: 'nakhoda-init',
            save: saveData,
            bookTitle: currentBookTitle()
          }, '*');
        } catch(e) {}
      }, 800);
      // Fallback: clear the loading veil even if the ready ping never lands.
      setTimeout(() => { simLoading.style.display = 'none'; }, 4000);
    });
    simShell.appendChild(simFrame);
  }

  function exitSim(){
    if (simFrame) { simFrame.remove(); simFrame = null; }
    simShell.classList.remove('active');
    openMainMenu();
    renderTreasury();
  }

  window.addEventListener('message', (ev) => {
    const d = ev.data || {};
    if (d.type === 'nakhoda-ready') simLoading.style.display = 'none';
    else if (d.type === 'nakhoda-save' && d.save) storeSave(d.save);
    else if (d.type === 'nakhoda-exit') {
      if (d.save) storeSave(d.save);
      exitSim();
    }
  });

  if (saveData && saveData.day > 1) sailBtnMenu.innerHTML = '\u2693 Continue Voyage \u2014 Nakhoda Mode';
  sailBtnMenu.addEventListener('click', launchSim);
  sailBtnMap.addEventListener('click', launchSim);
  renderTreasury();
})();
