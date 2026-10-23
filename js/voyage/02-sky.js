// ============ NAKHODA: SKY, LIGHT, TIME & WEATHER ============
// A painted sky dome (gradient, sun, drifting clouds, stars), the sun and
// fill lights, scene fog that always matches the horizon, and the weather
// state machine (clear, squall, sea mist).

NK.sky = (function () {
  const PALETTE = [
    // t (0..1 of a day), zenith, horizon, sun color, sun intensity, ambient
    [0.00, 0x07101f, 0x16223a, 0x8899cc, 0.00, 0.22],
    [0.21, 0x0d1a33, 0x3a3550, 0xff9a5a, 0.00, 0.25],
    [0.25, 0x3b5b8a, 0xf2a46b, 0xffb070, 0.70, 0.45],
    [0.31, 0x4d86b8, 0xdcc9a6, 0xffe2b0, 1.25, 0.50],
    [0.50, 0x3f7fc0, 0xbfd8e2, 0xfff3dc, 1.55, 0.55],
    [0.69, 0x4d86b8, 0xe0c69c, 0xffe0aa, 1.25, 0.50],
    [0.75, 0x3b4f80, 0xf08a55, 0xff8a4a, 0.70, 0.45],
    [0.79, 0x101c36, 0x40324a, 0xff7a4a, 0.00, 0.26],
    [1.00, 0x07101f, 0x16223a, 0x8899cc, 0.00, 0.22]
  ].map(r => ({ t: r[0], zen: new THREE.Color(r[1]), hor: new THREE.Color(r[2]), sun: new THREE.Color(r[3]), si: r[4], amb: r[5] }));

  const state = {
    zenith: new THREE.Color(), horizon: new THREE.Color(), sunColor: new THREE.Color(),
    sunDir: new THREE.Vector3(), night: 0, storm: 0, mist: 0, cloud: 0.35,
    weather: 'clear', weatherTimer: 240, lightning: 0
  };
  let dome, sunLight, hemi, scene;

  const vert = `
    varying vec3 vDir;
    void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); gl_Position.z = gl_Position.w; }`;
  const frag = `
    uniform vec3 zenith, horizon, sunColor, sunDir;
    uniform float time, cloud, night, storm, lightning;
    varying vec3 vDir;
    float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
    float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
      return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
    float fbm(vec2 p){ float s=0.0, a=0.5; for(int i=0;i<5;i++){ s+=n(p)*a; p*=2.07; a*=0.5; } return s; }
    void main(){
      vec3 d = normalize(vDir);
      float y = max(d.y, 0.0);
      vec3 col = mix(horizon, zenith, pow(y, 0.55));
      // Warm haze band that sits on the sea line.
      col = mix(col, horizon * 1.08, exp(-y * 9.0) * 0.6);
      float sd = max(dot(d, sunDir), 0.0);
      col += sunColor * (pow(sd, 1200.0) * 6.0 + pow(sd, 18.0) * 0.35 + pow(sd, 4.0) * 0.12) * (1.0 - storm * 0.8);
      // Moon opposite the sun.
      float md = max(dot(d, -sunDir), 0.0);
      col += vec3(0.75,0.82,1.0) * (pow(md, 2600.0) * 3.0 + pow(md, 40.0) * 0.08) * night;
      // Stars.
      if (night > 0.0 && d.y > 0.0) {
        vec2 sp = d.xz / (d.y + 0.3) * 260.0;
        float st = step(0.9975, h(floor(sp))) * (0.5 + 0.5 * sin(time * 2.0 + h(floor(sp)) * 40.0));
        col += vec3(st) * night * (1.0 - cloud) * smoothstep(0.0, 0.2, d.y);
      }
      // Painted clouds on a high plane.
      if (d.y > 0.0) {
        vec2 uv = d.xz / (d.y + 0.12) * 1.6 + vec2(time * 0.004, time * 0.0015);
        float c = fbm(uv);
        float cov = mix(0.62, 0.30, cloud);
        float a = smoothstep(cov, cov + 0.22, c) * smoothstep(0.0, 0.18, d.y);
        vec3 lit = mix(vec3(1.0), sunColor, 0.35) * (0.75 + 0.25 * pow(sd, 3.0));
        vec3 cc = mix(lit, zenith * 0.6 + horizon * 0.25, smoothstep(cov, cov + 0.5, c) * 0.55);
        cc = mix(cc, vec3(0.28,0.31,0.36), storm * 0.75);
        cc *= mix(1.0, 0.35, night);
        col = mix(col, cc, a * 0.92);
      }
      col += vec3(0.85,0.9,1.0) * lightning;
      gl_FragColor = vec4(col, 1.0);
    }`;

  function init(sc) {
    scene = sc;
    dome = new THREE.Mesh(new THREE.SphereGeometry(9000, 32, 16), new THREE.ShaderMaterial({
      vertexShader: vert, fragmentShader: frag, side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: {
        zenith: { value: state.zenith }, horizon: { value: state.horizon }, sunColor: { value: state.sunColor },
        sunDir: { value: state.sunDir }, time: { value: 0 }, cloud: { value: 0.35 }, night: { value: 0 },
        storm: { value: 0 }, lightning: { value: 0 }
      }
    }));
    dome.renderOrder = -10; dome.frustumCulled = false;
    scene.add(dome);

    sunLight = new THREE.DirectionalLight(0xffffff, 2);
    sunLight.castShadow = true;
    const sh = sunLight.shadow; sh.mapSize.set(NK.isMobile ? 1024 : 2048, NK.isMobile ? 1024 : 2048);
    sh.camera.left = sh.camera.bottom = -140; sh.camera.right = sh.camera.top = 140;
    sh.camera.near = 10; sh.camera.far = 900; sh.bias = -0.0006; sh.normalBias = 0.6;
    scene.add(sunLight); scene.add(sunLight.target);
    hemi = new THREE.HemisphereLight(0xcfe3ff, 0x3a4a2a, 0.6);
    scene.add(hemi);
    scene.fog = new THREE.Fog(0xbfd8e2, 1500, 7000);
  }

  function sample(t) {
    for (let i = 0; i < PALETTE.length - 1; i++) {
      const a = PALETTE[i], b = PALETTE[i + 1];
      if (t >= a.t && t <= b.t) {
        const k = (t - a.t) / (b.t - a.t);
        state.zenith.copy(a.zen).lerp(b.zen, k); state.horizon.copy(a.hor).lerp(b.hor, k);
        state.sunColor.copy(a.sun).lerp(b.sun, k);
        return { si: NK.lerp(a.si, b.si, k), amb: NK.lerp(a.amb, b.amb, k) };
      }
    }
    return { si: 0, amb: 0.2 };
  }

  const STORM_GREY = new THREE.Color(0x4a5560), MIST_GREY = new THREE.Color(0xc4ccd0);
  function update(dt, dayFrac, focus) {
    // Weather machine. Squalls are short and violent; mist rolls in at dawn.
    state.weatherTimer -= dt;
    if (state.weatherTimer <= 0) {
      const r = Math.random();
      const next = state.weather !== 'clear' ? 'clear' : r < 0.55 ? 'clear' : r < 0.8 ? 'squall' : 'mist';
      if (next !== state.weather) { state.weather = next; NK.events && NK.events.emit('weather', next); }
      state.weatherTimer = next === 'clear' ? 260 + Math.random() * 300 : 110 + Math.random() * 120;
    }
    const tStorm = state.weather === 'squall' ? 1 : 0, tMist = state.weather === 'mist' ? 1 : 0;
    state.storm += (tStorm - state.storm) * Math.min(1, dt * 0.25);
    state.mist += (tMist - state.mist) * Math.min(1, dt * 0.25);
    state.cloud = 0.35 + state.storm * 0.65 + state.mist * 0.2;

    const ang = dayFrac * Math.PI * 2 - Math.PI / 2;
    state.sunDir.set(Math.cos(ang) * 0.85, Math.sin(ang), 0.35).normalize();
    const p = sample(dayFrac);
    state.night = NK.smooth(0.05, -0.18, state.sunDir.y);

    // Weather greys the whole palette.
    state.horizon.lerp(STORM_GREY, state.storm * 0.6).lerp(MIST_GREY, state.mist * 0.7 * (1 - state.night * 0.7));
    state.zenith.lerp(STORM_GREY, state.storm * 0.55);

    if (state.storm > 0.5 && Math.random() < dt * 0.15) state.lightning = 1;
    state.lightning *= Math.pow(0.02, dt);

    const u = dome.material.uniforms;
    u.time.value = NK.T; u.cloud.value = state.cloud; u.night.value = state.night;
    u.storm.value = state.storm; u.lightning.value = state.lightning * 0.6;
    dome.position.set(focus.x, 0, focus.z);

    const dim = 1 - state.storm * 0.55 - state.mist * 0.35;
    const sunUp = state.sunDir.y > -0.05;
    const dir = sunUp ? state.sunDir : state.sunDir.clone().negate();   // the moon lights the night
    sunLight.position.set(focus.x + dir.x * 400, dir.y * 400, focus.z + dir.z * 400);
    sunLight.target.position.set(focus.x, 0, focus.z);
    sunLight.intensity = sunUp ? p.si * dim : 0.35 * state.night;
    sunLight.color.copy(sunUp ? state.sunColor : new THREE.Color(0x9fb4e8));
    hemi.intensity = p.amb * (1 - state.storm * 0.35) + state.lightning * 2;
    hemi.color.copy(state.zenith).lerp(new THREE.Color(0xffffff), 0.45);

    scene.fog.color.copy(state.horizon);
    scene.fog.near = NK.lerp(1600, 120, Math.max(state.mist, state.storm * 0.5));
    scene.fog.far = NK.lerp(7600, 1300, Math.max(state.mist, state.storm * 0.55));
    NK.renderer.toneMappingExposure = 0.82 + state.night * 0.3;
  }

  return { init, update, state, get sun() { return sunLight; } };
})();
