// ============ NAKHODA: THE SEA ============
// One water surface that travels with the camera. Vertices crowd near the
// ship and thin out toward the horizon; four Gerstner swells move it; the
// distance-to-coast field paints coral shallows, reef foam and blue water.
// waveHeight() mirrors the shader on the CPU so hulls ride the same swell.

NK.water = (function () {
  // dir (radians), wavelength, steepness, relative speed
  const WAVES = [[0.6, 140, 0.16, 1.0], [2.1, 77, 0.14, 1.1], [-0.9, 43, 0.12, 1.25], [1.3, 23, 0.09, 1.5]];
  const G = 9.8 * 1.6;
  let mesh, depthTex, mat;
  const amp = { value: 1 };   // weather-scaled swell

  function waveHeight(x, z, t) {
    let y = 0;
    const a = amp.value;
    for (let i = 0; i < WAVES.length; i++) {
      const w = WAVES[i], k = 2 * Math.PI / w[1], c = Math.sqrt(G / k) * w[3];
      const f = k * (Math.cos(w[0]) * x + Math.sin(w[0]) * z - c * t);
      y += (w[2] / k) * Math.sin(f) * a;
    }
    // Swell dies in the shallows, as it does on a reef flat.
    const s = NK.world.coast(x, z);
    return y * NK.smooth(10, 220, -s);
  }

  function buildDepthTexture() {
    const W = NK.world.W, H = NK.world.H, sdf = NK.world.sdf, U = NK.world.U;
    const data = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) {
      const s = -sdf[i] * U;   // units out to sea
      data[i] = s <= 0 ? 0 : Math.min(255, Math.round(Math.sqrt(s / 1400) * 255));
    }
    depthTex = new THREE.DataTexture(data, W, H, THREE.LuminanceFormat, THREE.UnsignedByteType);
    depthTex.magFilter = depthTex.minFilter = THREE.LinearFilter;
    depthTex.wrapS = depthTex.wrapT = THREE.ClampToEdgeWrapping;
    depthTex.flipY = false; depthTex.needsUpdate = true;
  }

  function buildGeometry() {
    // A square grid whose spacing grows with distance: |u|^2 mapping.
    const N = NK.isMobile ? 160 : 240, R = 7000;
    const pos = new Float32Array((N + 1) * (N + 1) * 3);
    let k = 0;
    for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) {
      const u = i / N * 2 - 1, v = j / N * 2 - 1;
      const m = (q) => Math.sign(q) * (Math.abs(q) * 0.12 + q * q * 0.88);
      pos[k++] = m(u) * R; pos[k++] = 0; pos[k++] = m(v) * R;
    }
    const idx = [];
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const a = j * (N + 1) + i, b = a + 1, c = a + N + 1, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setIndex(idx);
    return g;
  }

  const vert = `
    uniform float time, amp;
    uniform vec4 waves[4];
    uniform sampler2D depthMap;
    uniform vec4 field;      // x0, z0, width, height (world units)
    varying vec3 vWorld;
    varying vec3 vNormal;
    varying float vDepth;
    varying float vCrest;
    varying vec4 vRefl;
    uniform mat4 reflMatrix;
    #include <fog_pars_vertex>
    void main(){
      vec4 wp = modelMatrix * vec4(position, 1.0);
      vec2 uv = (wp.xz - field.xy) / field.zw;
      float depth = (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) ? 1.0 : texture2D(depthMap, uv).r;
      float shelf = smoothstep(0.08, 0.40, depth);
      float camD = length(wp.xz - cameraPosition.xz);
      float fade = 1.0 - smoothstep(1500.0, 5000.0, camD);
      vec3 p = wp.xyz; vec3 tangent = vec3(1.0,0.0,0.0); vec3 bin = vec3(0.0,0.0,1.0);
      float crest = 0.0;
      for (int i = 0; i < 4; i++) {
        vec4 w = waves[i];
        float k = 6.28318 / w.y; float c = sqrt(15.68 / k) * w.w;
        vec2 dir = vec2(cos(w.x), sin(w.x));
        float f = k * (dot(dir, wp.xz) - c * time);
        float a = (w.z / k) * amp * shelf * fade;
        float st = w.z * amp * shelf * fade;
        p.x += dir.x * a * cos(f); p.z += dir.y * a * cos(f); p.y += a * sin(f);
        tangent += vec3(-dir.x*dir.x*st*sin(f), dir.x*st*cos(f), -dir.x*dir.y*st*sin(f));
        bin += vec3(-dir.x*dir.y*st*sin(f), dir.y*st*cos(f), -dir.y*dir.y*st*sin(f));
        crest += max(sin(f), 0.0) * st;
      }
      vNormal = normalize(cross(bin, tangent));
      vWorld = p; vDepth = depth; vCrest = crest;
      vRefl = reflMatrix * vec4(wp.x, 0.0, wp.z, 1.0);
      vec4 mvPosition = viewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      #include <fog_vertex>
    }`;

  const frag = `
    uniform float time, night, storm;
    uniform vec3 sunDir, sunColor, zenith, horizon;
    uniform sampler2D reflMap; uniform float reflOn;
    varying vec3 vWorld; varying vec3 vNormal; varying float vDepth; varying float vCrest; varying vec4 vRefl;
    #include <fog_pars_fragment>
    float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
    float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
      return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
    void main(){
      // Ripple detail: two drifting noise layers bend the normal.
      vec2 q = vWorld.xz * 0.08;
      float e = 0.6;
      float r1 = n(q + time * 0.35), r2 = n(q * 1.9 - time * 0.42);
      float rx = n(q + vec2(e,0.0) + time*0.35) - r1 + n(q*1.9 + vec2(e,0.0) - time*0.42) - r2;
      float rz = n(q + vec2(0.0,e) + time*0.35) - r1 + n(q*1.9 + vec2(0.0,e) - time*0.42) - r2;
      float dist = length(vWorld - cameraPosition);
      float detail = (0.16 + storm * 0.35) * (1.0 - smoothstep(300.0, 2500.0, dist));
      vec3 N = normalize(vNormal + vec3(rx, 0.0, rz) * detail);
      vec3 V = normalize(cameraPosition - vWorld);

      // Painted depth bands: lagoon, reef, shelf, open sea.
      float d = vDepth;
      vec3 lagoon = vec3(0.38, 0.92, 0.84);
      vec3 reef   = vec3(0.08, 0.70, 0.74);
      vec3 shelf  = vec3(0.03, 0.46, 0.62);
      vec3 deep   = vec3(0.02, 0.24, 0.46);
      vec3 col = mix(lagoon, reef, smoothstep(0.02, 0.14, d));
      col = mix(col, shelf, smoothstep(0.12, 0.38, d));
      col = mix(col, deep, smoothstep(0.35, 0.85, d));
      col = mix(col, col * vec3(0.55,0.62,0.7) + vec3(0.06), storm * 0.6);

      float sunUp = smoothstep(-0.05, 0.1, sunDir.y);
      float diff = max(dot(N, normalize(sunDir + vec3(0.0,0.3,0.0))), 0.0);
      col *= (0.6 + 0.4 * diff) * mix(1.0, 0.15, night);

      // Reflection: the mirrored world (islands, hulls, clouds, sun), wobbled
      // by the ripples; the analytic sky stands in where the mirror is off.
      float fres = 0.04 + 0.96 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
      vec3 R = reflect(-V, N);
      vec3 sky = mix(horizon, zenith, clamp(R.y * 1.6, 0.0, 1.0));
      vec3 refl = sky;
      if (reflOn > 0.5) {
        // Offset in projective space scales with distance (rc.w), so far
        // islands mirror as crisply as near ones.
        vec2 wob = N.xz * (0.035 + 0.06 * storm);
        vec4 rc = vRefl; rc.xy += wob * rc.w;
        refl = texture2DProj(reflMap, rc).rgb;
      }
      float calm = 1.0 - storm * 0.5;
      col = mix(col, refl * 0.92, clamp(fres * 0.85 + 0.07 * calm, 0.0, 0.82));

      // Sun glitter.
      vec3 Hh = normalize(sunDir + V);
      // A long glitter path toward a low sun.
      float nh = max(dot(N, Hh), 0.0);
      float spec = pow(nh, 600.0) * 7.0 + pow(nh, 60.0) * 0.5 + pow(nh, 12.0) * 0.12 * (1.0 - sunDir.y);
      col += sunColor * spec * sunUp * (1.0 - storm * 0.7);
      vec3 Hm = normalize(-sunDir + V);
      col += vec3(0.6,0.7,0.9) * pow(max(dot(N, Hm), 0.0), 300.0) * 2.0 * night;

      // Foam: surf line on every shore, plus crests in heavy weather.
      float surf = smoothstep(0.075, 0.0, d) * (0.55 + 0.45 * sin(time * 1.6 - d * 300.0 + n(vWorld.xz * 0.05) * 6.0));
      float fn = n(vWorld.xz * 0.35 + time * 0.2);
      float foam = clamp(surf * smoothstep(0.35, 0.65, fn + 0.3), 0.0, 1.0);
      foam += smoothstep(0.3, 0.6, vCrest) * smoothstep(0.5, 0.75, fn) * (0.06 + storm * 0.8);
      col = mix(col, vec3(0.93, 0.95, 0.92) * mix(1.0, 0.25, night), clamp(foam, 0.0, 0.9));

      gl_FragColor = vec4(col, 1.0);
      #include <tonemapping_fragment>
      #include <encodings_fragment>
      #include <fog_fragment>
    }`;

  function init(scene) {
    buildDepthTexture();
    const w = NK.world;
    mat = new THREE.ShaderMaterial({
      vertexShader: vert, fragmentShader: frag, fog: true,
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
        time: { value: 0 }, amp: { value: 1 }, night: { value: 0 }, storm: { value: 0 },
        waves: { value: WAVES.map(v => new THREE.Vector4(v[0], v[1], v[2], v[3])) },
        depthMap: { value: null }, field: { value: new THREE.Vector4(w.x0, w.z0, w.W * w.U, w.H * w.U) },
        sunDir: { value: new THREE.Vector3() }, sunColor: { value: new THREE.Color() },
        zenith: { value: new THREE.Color() }, horizon: { value: new THREE.Color() },
        reflMap: { value: null }, reflMatrix: { value: new THREE.Matrix4() }, reflOn: { value: 0 }
      }])
    });
    mat.uniforms.depthMap.value = depthTex;
    mesh = new THREE.Mesh(buildGeometry(), mat);
    mesh.frustumCulled = false;
    mesh.receiveShadow = false;
    scene.add(mesh);
  }

  function update(focus) {
    const s = NK.sky.state, u = mat.uniforms;
    amp.value = 1 + s.storm * 1.6 - s.mist * 0.4;
    u.time.value = NK.T; u.amp.value = amp.value; u.night.value = s.night; u.storm.value = s.storm;
    u.sunDir.value.copy(s.sunDir); u.sunColor.value.copy(s.sunColor);
    u.zenith.value.copy(s.zenith); u.horizon.value.copy(s.horizon);
    const snap = 40;
    mesh.position.set(Math.round(focus.x / snap) * snap, 0, Math.round(focus.z / snap) * snap);
  }

  // ---------- Planar mirror ----------
  // Renders the world reflected in the sea plane into a texture, the same
  // way a still harbor doubles every island in it.
  let rt = null, mirrorCam = null, enabled = true;
  const clip = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.6);
  const v = new THREE.Vector3(), camPos = new THREE.Vector3(), look = new THREE.Vector3(), rot = new THREE.Matrix4(), up = new THREE.Vector3();
  const N = new THREE.Vector3(0, 1, 0), bias = new THREE.Matrix4().set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
  try { enabled = localStorage.getItem('nakhoda-reflect') !== 'off'; } catch (e) {}
  function sizeRT(renderer) {
    const scale = NK.isMobile ? 0.35 : 0.5, pr = renderer.getPixelRatio();
    const w = Math.max(64, Math.floor(innerWidth * pr * scale)), h = Math.max(64, Math.floor(innerHeight * pr * scale));
    if (!rt) rt = new THREE.WebGLRenderTarget(w, h, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
    else if (rt.width !== w || rt.height !== h) rt.setSize(w, h);
  }
  function renderReflection(renderer, scene, camera, hide) {
    const u = mat.uniforms;
    if (!enabled) { u.reflOn.value = 0; return; }
    sizeRT(renderer);
    if (!mirrorCam) mirrorCam = camera.clone();
    camPos.setFromMatrixPosition(camera.matrixWorld);
    if (camPos.y < 0.2) { u.reflOn.value = 0; return; }
    // Mirror the eye and its target through y = 0.
    mirrorCam.position.set(camPos.x, -camPos.y, camPos.z);
    rot.extractRotation(camera.matrixWorld);
    look.set(0, 0, -1).applyMatrix4(rot).add(camPos); look.y = -look.y;
    up.set(0, 1, 0).applyMatrix4(rot).reflect(N);
    mirrorCam.up.copy(up); mirrorCam.lookAt(look);
    mirrorCam.near = camera.near; mirrorCam.far = camera.far; mirrorCam.fov = camera.fov; mirrorCam.aspect = camera.aspect;
    mirrorCam.updateProjectionMatrix(); mirrorCam.updateMatrixWorld();
    u.reflMatrix.value.copy(bias).multiply(mirrorCam.projectionMatrix).multiply(mirrorCam.matrixWorldInverse);
    mesh.visible = false; hide.forEach(o => { o.userData.wasVisible = o.visible; o.visible = false; });
    const prevClip = renderer.clippingPlanes, prevAuto = renderer.shadowMap.autoUpdate, prevTarget = renderer.getRenderTarget();
    renderer.clippingPlanes = [clip]; renderer.shadowMap.autoUpdate = false;
    renderer.setRenderTarget(rt); renderer.clear(); renderer.render(scene, mirrorCam);
    renderer.setRenderTarget(prevTarget); renderer.clippingPlanes = prevClip; renderer.shadowMap.autoUpdate = prevAuto;
    mesh.visible = true; hide.forEach(o => { o.visible = o.userData.wasVisible; });
    u.reflMap.value = rt.texture; u.reflOn.value = 1;
  }
  function toggleReflections() {
    enabled = !enabled;
    try { localStorage.setItem('nakhoda-reflect', enabled ? 'on' : 'off'); } catch (e) {}
    return enabled;
  }

  return { init, update, waveHeight, renderReflection, toggleReflections, get reflections() { return enabled; } };
})();
