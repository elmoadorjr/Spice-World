// ============ NAKHODA: SOUND ============
// Everything is synthesized: no files to load. Sea wash and wind are
// filtered noise that swell with your speed and the weather; cannon,
// splash, timber and coin are short shaped bursts.

NK.audio = (function () {
  let ctx = null, master, wind, windGain, sea, seaGain, seaFilter, enabled = true, noiseBuf;
  try { enabled = localStorage.getItem('nakhoda-sound') !== 'off'; } catch (e) {}

  function start() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = enabled ? 0.7 : 0; master.connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0); let b = 0;
    for (let i = 0; i < d.length; i++) { b = 0.97 * b + 0.03 * (Math.random() * 2 - 1); d[i] = b * 6 + (Math.random() * 2 - 1) * 0.12; }
    const loop = () => { const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true; s.start(); return s; };
    sea = loop(); seaFilter = ctx.createBiquadFilter(); seaFilter.type = 'lowpass'; seaFilter.frequency.value = 500;
    seaGain = ctx.createGain(); seaGain.gain.value = 0.25; sea.connect(seaFilter).connect(seaGain).connect(master);
    wind = loop(); const wf = ctx.createBiquadFilter(); wf.type = 'bandpass'; wf.frequency.value = 900; wf.Q.value = 0.6;
    windGain = ctx.createGain(); windGain.gain.value = 0.05; wind.connect(wf).connect(windGain).connect(master);
    windGain.filter = wf;
  }
  function burst(freq, dur, gain, type, dist) {
    if (!ctx || !enabled) return;
    const fall = 1 / (1 + (dist || 0) / 250);
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = type || 'lowpass'; f.frequency.value = freq;
    const g = ctx.createGain(); const t = ctx.currentTime;
    g.gain.setValueAtTime(gain * fall, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.connect(f).connect(g).connect(master); s.start(t, Math.random()); s.stop(t + dur + 0.05);
  }
  function thump(freq, dur, gain, dist) {
    if (!ctx || !enabled) return;
    const fall = 1 / (1 + (dist || 0) / 250);
    const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
    o.frequency.setValueAtTime(freq, t); o.frequency.exponentialRampToValueAtTime(freq * 0.4, t + dur);
    g.gain.setValueAtTime(gain * fall, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(master); o.start(t); o.stop(t + dur);
  }
  function chime() {
    if (!ctx || !enabled) return;
    [1320, 1760, 2210].forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + i * 0.06;
      o.type = 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(0.06, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      o.connect(g).connect(master); o.start(t); o.stop(t + 0.4);
    });
  }

  function update() {
    if (!ctx) return;
    const P = NK.player, sky = NK.sky.state;
    const w = NK.game.wind(P.pos.x, P.pos.z);
    const sp = Math.abs(P.speed) / 25;
    seaGain.gain.setTargetAtTime(0.16 + sp * 0.25 + sky.storm * 0.25, ctx.currentTime, 0.4);
    seaFilter.frequency.setTargetAtTime(380 + sp * 500 + sky.storm * 400, ctx.currentTime, 0.4);
    windGain.gain.setTargetAtTime(0.02 + w.strength * 0.04 + sky.storm * 0.12, ctx.currentTime, 0.5);
    windGain.filter.frequency.setTargetAtTime(700 + w.strength * 500 + sky.storm * 600, ctx.currentTime, 0.5);
  }
  function toggle() {
    enabled = !enabled;
    try { localStorage.setItem('nakhoda-sound', enabled ? 'on' : 'off'); } catch (e) {}
    if (master) master.gain.value = enabled ? 0.7 : 0;
    return enabled;
  }

  NK.events.on('cannon', d => { burst(700, 0.9, 1.2, 'lowpass', d); thump(90, 0.6, 0.9, d); });
  NK.events.on('splash', d => burst(1800, 0.5, 0.35, 'bandpass', d));
  NK.events.on('hit', () => { burst(400, 0.7, 0.9); thump(60, 0.4, 0.6); });
  NK.events.on('thud', () => { thump(55, 0.8, 1); burst(300, 0.8, 0.6); });
  NK.events.on('coins', chime);
  NK.events.on('sail', () => burst(2500, 0.35, 0.18, 'highpass'));

  return { start, update, toggle, get enabled() { return enabled; } };
})();
