// ============ NAKHODA: BOOT & MAIN LOOP ============

NK.main = (function () {
  let scene, camera, clock, running = false;

  const step = (label, fn) => new Promise(res => {
    NK.$('loading-step').textContent = label;
    requestAnimationFrame(() => setTimeout(() => { fn(); res(); }, 20));
  });

  async function boot() {
    const renderer = NK.renderer = new THREE.WebGLRenderer({ antialias: !NK.isMobile, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, NK.isMobile ? 1.5 : 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.outputEncoding = THREE.LinearEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    NK.$('game').appendChild(renderer.domElement);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.5, 12000);
    clock = new THREE.Clock();

    await step('Charting the coasts', () => NK.world.build());
    await step('Raising the sky', () => { NK.sky.init(scene); NK.water.init(scene); });
    NK.$('loading-step').textContent = 'Carving the models';
    await NK.assets.load();
    await step('Building the ports', () => NK.ports.init(scene));
    await step('Growing the islands', () => NK.land.init(scene));
    await step('Inking the chart', () => NK.chart.bake());
    const saved = NK.game.readSave();
    const hasSave = NK.game.load(saved) && saved.day > 0;
    await step('Rigging the ship', () => {
      NK.fleet.init(scene);
      NK.player.init(scene, camera);
      NK.ui.init(camera);
      NK.land.update(NK.player.pos, true);
    });
    addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
    addEventListener('pointerdown', () => NK.audio.start(), { once: true });
    addEventListener('beforeunload', () => NK.game.save());
    document.addEventListener('visibilitychange', () => { if (document.hidden) NK.game.save(); });
    if (NK.embedded) { try { parent.postMessage({ type: 'nakhoda-ready' }, '*'); } catch (e) {} }

    // Fly-over behind the title card.
    NK.$('loading').classList.add('gone');
    running = true; loop();
    NK.ui.title(hasSave, fresh => {
      if (fresh) newVoyage(true);
      NK.$('hud').classList.remove('hidden');
      const s = NK.game.state;
      NK.ui.banner(NK.ports.nearest(NK.player.pos.x, NK.player.pos.z).port.name, `${NK.game.dateLabel()} · ${NK.game.season().name}`);
      if (fresh || s.day === 1) setTimeout(() => NK.ui.story('Voyage Orders',
        `The Spice World, Anno Domini 1500. You stand at the stern of your own <b>kelulus</b> off Melaka, with ${NK.fmt(s.gold)} pisis and a name nobody knows yet.` +
        `<p><b>The trade.</b> Buy what a port grows cheap, sell where it is wanted. Cloth and rice go east; cloves, nutmeg and mace come back west. The syahbandar of every port has charters for a captain who keeps his word.</p>` +
        `<p><b>The wind.</b> The <b>northeast monsoon</b> blows now: south of the line it turns into a westerly that carries ships east to the spice islands. Around May it fails, and from June the <b>southwest monsoon</b> brings them home. You cannot sail into the wind; sail across it.</p>` +
        `<p><b>The sheet.</b> W hauls the sail in, S eases it out. Watch the trim gauge: too loose and the sail luffs and flaps, too tight and she stalls and heels hard. Space hoists or furls, X reefs in a blow, and G hands the sheet to your crew.</p>` +
        `<p><b>The climb.</b> Kelulus, Pencalang, Malangbang, Lancaran, <b>Jong</b>. And beyond the biggest hull in the world: the day power itself takes notice. <b>Sea Lord.</b></p>` +
        `<p><i>"The sea owes no man a debt, and takes none either."</i></p>`), 900);
    });
  }

  function newVoyage(silent) {
    NK.game.reset();
    NK.fleet.clear();
    NK.player.course = null; NK.player.autopilot = false;
    NK.player.rebuild();
    NK.player.placeAt(NK.ports.list[0]);
    NK.player.hp = NK.game.maxHp();
    NK.land.update(NK.player.pos, true);
    NK.game.save();
    if (!silent) { NK.ui.closeModal(); NK.ui.toast('A new voyage begins off Melaka.', 'info'); }
  }

  let introT = 0;
  function loop() {
    if (!running) return;
    requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.05);
    const playing = !NK.$('hud').classList.contains('hidden');
    const paused = !!NK.ui.modal() || !playing;
    if (NK.timeScale > 1 && NK.fleet.threatNear(1100)) { NK.timeScale = 1; NK.ui.toast('Sails on the horizon. Back to the watch.', 'bad'); }
    const gdt = paused ? 0 : dt * NK.timeScale;
    NK.T += dt * (paused ? 1 : NK.timeScale);
    NK.dt = gdt;

    const subs = Math.ceil(gdt / 0.05) || 1, sdt = gdt / subs;
    for (let i = 0; i < subs; i++) {
      NK.player.update(sdt);
      if (playing) NK.fleet.update(sdt);
    }
    if (!playing) {
      // Slow orbit while the title card is up.
      introT += dt;
      NK.player.cam.yaw = NK.player.heading + Math.PI + Math.sin(introT * 0.08) * 1.4 + 0.9;
      NK.player.cam.free = true; NK.player.cam.lastInput = NK.T; NK.player.cam.tdist = 95; NK.player.cam.pitch = 0.16;
    }
    NK.game.advance(gdt);
    const P = NK.player.pos;
    NK.sky.update(gdt || dt * 0.0001, NK.game.state.dayFrac, P);
    NK.water.update(P);
    NK.land.update(P);
    NK.ports.update();
    if (playing) { NK.ui.update(); NK.audio.update(); if (!paused) NK.game.autosave(); }
    camera.updateMatrixWorld();
    NK.water.renderReflection(NK.renderer, scene, camera, NK.fleet.reflectHide || []);
    NK.renderer.render(scene, camera);
  }

  window.addEventListener('load', () => boot().catch(e => { console.error(e); NK.$('loading-step').textContent = 'The charts are torn: ' + e.message; }));
  return { newVoyage, get scene() { return scene; } };
})();
