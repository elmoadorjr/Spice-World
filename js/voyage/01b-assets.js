// ============ NAKHODA: MODELS ============
// Hand-modeled CC0 assets (Kenney's Nature Kit and Pirate Kit, see
// assets/models/*/License.txt) for trees, palms, rocks, houses, docks and
// ships. Static props are baked into one geometry each so thousands can be
// instanced; ships stay as node trees so their sails can trim and furl.
// If anything fails to load, every module falls back to its own geometry.

NK.assets = (function () {
  const NATURE = ['tree_detailed', 'tree_oak', 'tree_fat', 'tree_default', 'tree_plateau', 'tree_tall', 'tree_palmTall', 'tree_palmDetailedTall',
    'tree_palmBend', 'tree_palmShort', 'plant_bushLarge', 'plant_bushDetailed', 'plant_bush', 'rock_largeA', 'rock_largeB', 'rock_largeC', 'rock_tallA', 'rock_tallB'];
  const PIRATE = ['ship-small', 'ship-medium', 'ship-large', 'ship-pirate-small', 'ship-pirate-medium', 'ship-pirate-large', 'palm-detailed-straight',
    'palm-detailed-bend', 'palm-straight', 'palm-bend', 'structure', 'structure-roof', 'structure-platform', 'structure-platform-dock',
    'structure-platform-dock-small', 'rocks-a', 'rocks-b', 'rocks-c', 'rocks-sand-a', 'rocks-sand-b', 'barrel', 'crate', 'boat-row-small'];
  const PEOPLE = ['male-a', 'male-b', 'male-d', 'male-e', 'male-f', 'female-a', 'female-b', 'female-c', 'female-d', 'female-e', 'female-f'];
  const scenes = {}, baked = {}, people = {};
  let peopleOk = false;
  let ok = false;

  // The game renders in display space (no sRGB output pass), so glTF's
  // linear colors and sRGB textures are brought back to how they were painted.
  // Tropical retint of the Nature Kit's temperate palette, by material name.
  const TINT = { leafsGreen: 0x4f9a3a, leafsDark: 0x2f6e2c, woodBark: 0x7a5236, woodBarkDark: 0x5a3d28, grass: 0x6aa84a, dirt: 0x9a7b55, stone: 0x9a948a };
  function fixMaterial(m) {
    if (m.color) m.color.convertLinearToSRGB();
    if (TINT[m.name] !== undefined) m.color.setHex(TINT[m.name]);
    // Lift the painted colormap so whites read white under tropical sun.
    if (m.map) { m.emissive = new THREE.Color(0x1a1a1a); m.emissiveMap = m.map; }
    if (m.map) { m.map.encoding = THREE.LinearEncoding; m.map.needsUpdate = true; }
    m.roughness = Math.max(m.roughness ?? 1, 0.7); m.metalness = 0;
  }

  function load() {
    if (typeof THREE.GLTFLoader !== 'function') return Promise.resolve(false);
    const loader = new THREE.GLTFLoader();
    const one = (dir, name) => new Promise(res => loader.load(`assets/models/${dir}/${name}.glb`, g => {
      g.scene.traverse(o => { if (o.isMesh) { fixMaterial(o.material); o.castShadow = true; o.receiveShadow = true; } });
      scenes[name] = g.scene; res(true);
    }, undefined, () => res(false)));
    const person = name => new Promise(res => loader.load(`assets/models/people/character-${name}.glb`, g => {
      g.scene.traverse(o => { if (o.isMesh) { fixMaterial(o.material); o.castShadow = true; o.frustumCulled = false; } });
      people[name] = { scene: g.scene, clips: g.animations }; res(true);
    }, undefined, () => res(false)));
    const extra = [one('market', 'display-fruit')].concat(PEOPLE.map(person));
    return Promise.all(NATURE.map(n => one('nature', n)).concat(PIRATE.map(n => one('pirate', n))))
      .then(r => { ok = r.every(Boolean); return Promise.all(extra); })
      .then(r => { peopleOk = ok && r.every(Boolean) && !!THREE.SkeletonUtils; return ok; });
  }

  // Flatten a model into one geometry: position, normal, uv and a color
  // per vertex taken from its material, so one material can draw it all.
  function bake(name) {
    if (baked[name]) return baked[name];
    const root = scenes[name]; if (!root) return null;
    root.updateMatrixWorld(true);
    const parts = []; let map = null;
    root.traverse(o => {
      if (!o.isMesh) return;
      let g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
      g.applyMatrix4(o.matrixWorld);
      const n = g.attributes.position.count, c = new Float32Array(n * 3), col = o.material.color || new THREE.Color(1, 1, 1);
      for (let i = 0; i < n; i++) { c[i * 3] = col.r; c[i * 3 + 1] = col.g; c[i * 3 + 2] = col.b; }
      g.setAttribute('color', new THREE.BufferAttribute(c, 3));
      if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n * 2), 2));
      if (o.material.map) map = o.material.map;
      parts.push(g);
    });
    let total = 0; parts.forEach(g => total += g.attributes.position.count);
    const out = new THREE.BufferGeometry();
    ['position', 'normal', 'color', 'uv'].forEach(a => {
      const size = a === 'uv' ? 2 : 3, arr = new Float32Array(total * size); let off = 0;
      parts.forEach(g => { arr.set(g.attributes[a].array, off); off += g.attributes[a].array.length; });
      out.setAttribute(a, new THREE.BufferAttribute(arr, size));
    });
    out.computeBoundingBox();
    const bb = out.boundingBox, size = new THREE.Vector3(); bb.getSize(size);
    // Stand it on its base, centered.
    out.translate(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2);
    out.computeBoundingSphere();
    return (baked[name] = { geometry: out, map, size });
  }

  // A material for baked props; textured kits share their colormap.
  const mats = {};
  function material(map, sway) {
    const key = (map ? 'map' : 'plain') + (sway ? '-sway' : '');
    if (mats[key]) return mats[key];
    const m = new THREE.MeshStandardMaterial({ vertexColors: true, map: map || null, roughness: 0.85, metalness: 0 });
    if (map) { m.emissive = new THREE.Color(0x1a1a1a); m.emissiveMap = map; }
    if (sway) m.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = NK.land.timeUniform;
      sh.vertexShader = 'uniform float uTime;\n' + sh.vertexShader.replace('#include <begin_vertex>',
        `#include <begin_vertex>
         float sway = max(position.y - 0.35, 0.0) * 0.06;
         vec4 ip = instanceMatrix * vec4(0.0,0.0,0.0,1.0);
         transformed.x += sin(uTime * 1.3 + ip.x * 0.05 + ip.z * 0.03) * sway;
         transformed.z += cos(uTime * 1.1 + ip.z * 0.05) * sway * 0.7;`);
    };
    return (mats[key] = m);
  }

  // A fresh, independently animated copy of a character.
  function person(name) {
    const p = people[name]; if (!p) return null;
    const scene = THREE.SkeletonUtils.clone(p.scene);
    const mixer = new THREE.AnimationMixer(scene), actions = {};
    p.clips.forEach(c => { actions[c.name] = mixer.clipAction(c); });
    return { scene, mixer, actions };
  }

  return {
    load, bake, material, person,
    get ok() { return ok; }, get peopleOk() { return peopleOk; },
    scene: name => scenes[name] || null
  };
})();
