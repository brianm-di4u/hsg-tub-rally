// N64-style materials as small custom shaders. Colours stay in gamma space end to end (no colour management,
// no tone mapping), like the hardware: textures × vertex colours, per-vertex (Gouraud) light, per-vertex fog.
//
//  worldMat     static world: unlit, vertex colour (baked light) × optional texture, linear fog
//  litMat       Gouraud: vertex colour × (ambient + sun·N) per vertex, optional texture, fog
//  partMat      karts: like litMat, but each vertex follows one of up to 24 rigid part matrices (aPart)
//  billboardMat instanced Y-axis billboards (trees, crowds): atlas frame per instance, alpha test, fog
const T = () => window.THREE;

export const FOG = { color: [0.79, 0.87, 0.91], near: 90, far: 330 };
export const SUN = { dir: [0.4, 0.8, 0.3], amb: 0.55, diff: 0.6 };
const shared = { uFogColor: null, uFogNear: null, uFogFar: null, uSun: null, uAmb: null, uDiff: null, uTime: null, uLightTint: null };

export function initMaterials() {
  const THREE = T();
  shared.uFogColor = { value: new THREE.Color().fromArray(FOG.color) };
  shared.uFogNear = { value: FOG.near };
  shared.uFogFar = { value: FOG.far };
  const s = new THREE.Vector3().fromArray(SUN.dir).normalize();
  shared.uSun = { value: s };
  shared.uAmb = { value: SUN.amb };
  shared.uDiff = { value: SUN.diff };
  shared.uTime = { value: 0 };
  shared.uLightTint = { value: new THREE.Color(1, 1, 1) };
}
export function setLightTint(rgb) { if (shared.uLightTint) shared.uLightTint.value.setRGB(rgb[0], rgb[1], rgb[2]); }
export function setFog(color, near, far) {
  shared.uFogColor.value.set(color);
  shared.uFogNear.value = near;
  shared.uFogFar.value = far;
}
export function setSun(dir, amb, diff) {
  shared.uSun.value.set(dir[0], dir[1], dir[2]).normalize();
  if (amb != null) shared.uAmb.value = amb;
  if (diff != null) shared.uDiff.value = diff;
}
export function setTime(t) { if (shared.uTime) shared.uTime.value = t; }
// the shared fog, sun, time and tint uniforms (brickmat.js builds its materials on the same objects)
export function sharedUniforms() { return shared; }
export function fogColor() { return shared.uFogColor.value; }

const FOG_V = `
  uniform float uFogNear; uniform float uFogFar;
  varying float vFog;`;
const FOG_V_MAIN = `vFog = clamp((-mv.z - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);`;
const FOG_F = `uniform vec3 uFogColor; varying float vFog;`;
const LIGHT_V = `
  uniform vec3 uSun; uniform float uAmb; uniform float uDiff;
  float lightOf(vec3 n) { return uAmb + uDiff * max(dot(normalize(n), uSun), 0.0); }`;

function base(opts, vertMain, extraV = '', extraUniforms = {}) {
  const THREE = T();
  const defines = {};
  if (opts.map) defines.USE_MAP = '';
  if (opts.alphaTest) defines.ALPHA_TEST = '';
  if (opts.flatTint) defines.FLAT_TINT = '';
  const uniforms = {
    map: { value: opts.map || null }, uAlphaTest: { value: opts.alphaTest || 0 },
    uTint: { value: new THREE.Color(opts.tint || '#ffffff') }, uBright: { value: opts.bright ?? 1 }, uAlpha: { value: opts.alpha ?? 1 },
    uFogColor: shared.uFogColor, uFogNear: shared.uFogNear, uFogFar: shared.uFogFar,
    uSun: shared.uSun, uAmb: shared.uAmb, uDiff: shared.uDiff, uTime: shared.uTime, uLightTint: shared.uLightTint, ...extraUniforms,
  };
  const vertexShader = `
    attribute vec3 color;
    varying vec3 vColor; varying vec2 vUv;
    uniform float uTime;
    ${FOG_V}
    ${extraV}
    void main() {
      ${vertMain}
    }`;
  const fragmentShader = `
    uniform sampler2D map; uniform float uAlphaTest; uniform vec3 uTint; uniform float uBright; uniform float uAlpha; uniform vec3 uLightTint;
    varying vec3 vColor; varying vec2 vUv;
    ${FOG_F}
    void main() {
      vec4 c = vec4(vColor * uTint * uBright * uLightTint, 1.0);
      #ifdef USE_MAP
        vec4 t = texture2D(map, vUv);
        c *= t;
      #endif
      #ifdef ALPHA_TEST
        if (c.a < uAlphaTest) discard;
      #endif
      gl_FragColor = vec4(mix(c.rgb, uFogColor, vFog), c.a * uAlpha);
    }`;
  const m = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, defines,
    side: opts.side ?? THREE.FrontSide, transparent: !!opts.transparent, depthWrite: opts.depthWrite ?? true });
  m.fog = false;
  return m;
}

export function worldMat(opts = {}) {
  return base(opts, `
    vColor = color; vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    ${FOG_V_MAIN}
    gl_Position = projectionMatrix * mv;`);
}

export function litMat(opts = {}) {
  return base(opts, `
    vec3 n = normalize(mat3(modelMatrix) * normal);
    #ifdef FLAT_TINT
      vColor = vec3(lightOf(n));
    #else
      vColor = color * lightOf(n);
    #endif
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    ${FOG_V_MAIN}
    gl_Position = projectionMatrix * mv;`, LIGHT_V);
}

export const MAX_PARTS = 24;
export function partMat(opts = {}) {
  const THREE = T();
  const mats = [];
  for (let i = 0; i < MAX_PARTS; i++) mats.push(new THREE.Matrix4());
  const m = base(opts, `
    mat4 pm = uParts[int(aPart + 0.5)];
    vec4 wp = modelMatrix * pm * vec4(position, 1.0);
    vec3 n = normalize(mat3(modelMatrix) * mat3(pm) * normal);
    vColor = color * (lightOf(n) * 0.8 + 0.28) + uFlash; vUv = uv;
    vec4 mv = viewMatrix * wp;
    ${FOG_V_MAIN}
    gl_Position = projectionMatrix * mv;`, `${LIGHT_V}
    attribute float aPart;
    uniform mat4 uParts[${MAX_PARTS}];
    uniform vec3 uFlash;`, { uParts: { value: mats }, uFlash: { value: new THREE.Vector3() } });
  return m;
}

// Instanced Y-axis billboards. Instance attributes: iPos (vec3 base point), iSize (vec2 w,h), iFrame (vec4 uv rect),
// iTint (vec3). The quad geometry spans x -0.5..0.5, y 0..1. `sway` adds a gentle wind/cheer bob.
export function billboardMat(opts = {}) {
  const m = base({ ...opts, alphaTest: opts.alphaTest ?? 0.5 }, `
    vec3 camRight = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
    camRight = normalize(vec3(camRight.x, 0.0, camRight.z));
    float bob = uSway * sin(uTime * 7.0 + iPos.x * 0.37 + iPos.z * 0.21) * position.y;
    vec3 wp = iPos + camRight * position.x * iSize.x + vec3(0.0, position.y * iSize.y + bob, 0.0);
    vColor = iTint; vUv = vec2(mix(iFrame.x, iFrame.z, uv.x), mix(iFrame.y, iFrame.w, uv.y));
    vec4 mv = viewMatrix * vec4(wp, 1.0);
    ${FOG_V_MAIN}
    vNear = clamp((-(viewMatrix * vec4(iPos, 1.0)).z - 5.0) / 4.0, 0.0, 1.0); // per instance, so a near tree vanishes whole
    gl_Position = projectionMatrix * mv;`, `
    attribute vec3 iPos; attribute vec2 iSize; attribute vec4 iFrame; attribute vec3 iTint;
    uniform float uSway; varying float vNear;`, { uSway: { value: opts.sway ?? 0 } });
  m.fragmentShader = m.fragmentShader.replace('varying vec3 vColor; varying vec2 vUv;', 'varying vec3 vColor; varying vec2 vUv; varying float vNear;')
    .replace('#ifdef ALPHA_TEST', 'if (vNear < 0.5) discard;\n      #ifdef ALPHA_TEST');
  return m;
}

// Canvas → texture with N64-ish sampling: bilinear, mipmapped, no anisotropy, gamma-space (no colour space).
export function texFromCanvas(canvas, { repeat = true, mips = true } = {}) {
  const THREE = T();
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.NoColorSpace;
  t.wrapS = t.wrapT = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = mips ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter;
  t.generateMipmaps = mips;
  t.anisotropy = 1;
  return t;
}
export function texFromImage(img, opts = {}) {
  const THREE = T();
  const t = new THREE.Texture(img);
  t.colorSpace = THREE.NoColorSpace;
  t.wrapS = t.wrapT = opts.repeat === false ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = opts.mips === false ? THREE.LinearFilter : THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = opts.mips !== false;
  t.anisotropy = 1;
  t.needsUpdate = true;
  return t;
}
