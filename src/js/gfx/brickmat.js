// Brick-toy materials: per-pixel glossy plastic in place of the N64 Gouraud look. Same factory names and options
// as n64mat.js (worldMat, litMat, partMat), plus surface patterns drawn in the fragment shader so flat geometry
// reads as bricks without extra triangles:
//   studs   baseplate studs on upward faces (world xz grid), with bevel highlights, base occlusion and a cast shadow
//   tiles   smooth tiles with moulded seams (road plates, sidewalks); size in metres along the surface uv
//   bricks  running-bond brick courses on walls (u along the wall from uv, v = world height)
// Lighting: hemisphere ambient (sky above, ground bounce below) + sun diffuse + Blinn-Phong specular + a Fresnel
// sky reflection, computed on squared (≈linear) colours and returned to gamma space, so highlights roll off like
// plastic. Optional sun shadow map (shadows.js) on the tiers that can afford it. Fog stays per vertex.
import { sharedUniforms } from './n64mat.js';

const T = () => window.THREE;

// Brick standard for the world and the crews, in metres (research/brick-style.md §1): the common 8 mm system
// (pitch 8, brick 9.6, plate 3.2, stud Ø 4.8 × 1.7) scaled 35×, so a 1.68 m crew figure is 5 bricks tall and a tub
// is 3 × 6 studs.
export const BRICK = { pitch: 0.28, brick: 0.336, plate: 0.112, studR: 0.084, studH: 0.06 };

// Toy-brick colour palette (gamma sRGB), named for this game. Values follow the commonly published solid brick
// colours so the world reads as one toy set.
export const PAL = {
  white: '#F4F4F4', lightGrey: '#A0A5A9', darkGrey: '#6C6E68', black: '#2B2E33',
  red: '#C91A09', darkRed: '#720E0F', orange: '#FE8A18', yellow: '#F2CD37', brightLightYellow: '#F8F184',
  tan: '#E4CD9E', darkTan: '#958A73', reddishBrown: '#82422A', brown: '#583927', nougat: '#D09168',
  green: '#4B9F4A', darkGreen: '#237841', brightGreen: '#58AB41', lime: '#BBE90B', sandGreen: '#A0BCAC', olive: '#9B9A5A',
  blue: '#0055BF', mediumBlue: '#5A93DB', darkBlue: '#0A3463', azure: '#36AEBF', lightAqua: '#ADC3C0', sandBlue: '#6074A1',
  pink: '#E4ADC8', magenta: '#923978', lavender: '#E1D5ED', purple: '#81007B',
  transClear: '#EEEEEE', transLightBlue: '#AEEFEC', transBlue: '#0020A0',
};

// nearest palette colour (RGB distance) for any '#rrggbb'
const PAL_RGB = Object.values(PAL).map((h) => [h, parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);
export function snapPal(h) {
  const r = parseInt(h.slice(1, 3), 16), g = parseInt(h.slice(3, 5), 16), b = parseInt(h.slice(5, 7), 16);
  let best = h, bd = Infinity;
  for (const [k, R, G, B] of PAL_RGB) { const d = (r - R) ** 2 * 0.3 + (g - G) ** 2 * 0.59 + (b - B) ** 2 * 0.11; if (d < bd) { bd = d; best = k; } }
  return best;
}

const S = { hemiSky: null, hemiGround: null, shadow: null, shadowsDefault: false };
// materials created after this receive sun shadows unless they opt out (set once per tier at boot)
export function setShadowDefault(on) { S.shadowsDefault = !!on; }
export const shadowsOn = () => S.shadowsDefault;
// Low tier: a cheaper plastic (fixed-power specular, no sky reflection); patterns stay, they carry the look
export function setLite(on) { S.lite = !!on; }
// with MSAA on (Medium, High), see-through fades resolve through alpha to coverage; without it they dither
export function setAlphaCoverage(on) { S.a2c = !!on; }
function shared() {
  const THREE = T(), u = sharedUniforms();
  if (!S.hemiSky) {
    S.hemiSky = { value: new THREE.Color('#BFD9F2') };
    S.hemiGround = { value: new THREE.Color('#7E8F5A') };
    S.shadow = { uShadowMap: { value: null }, uShadowMatrix: { value: new THREE.Matrix4() }, uShadowOn: { value: 0 }, uShadowTexel: { value: 1 / 1024 } };
    S.focus = { value: new THREE.Vector3(0, -1e4, 0) };
  }
  return { ...u, uHemiSky: S.hemiSky, uHemiGround: S.hemiGround, uFocus: S.focus, ...S.shadow };
}
// sky and ground colours for the ambient light and reflections (set per course from the sky and grass colours)
export function setHemi(sky, ground) { shared(); S.hemiSky.value.set(sky); S.hemiGround.value.set(ground); }
export function shadowUniforms() { shared(); return S.shadow; }
// the point the chase camera looks at (the player's tub): trees keep out of the sightline to it (NEAR_FADE)
export function setFocus(x, y, z) { shared(); S.focus.value.set(x, y, z); }

const VERT_COMMON = `
  attribute vec3 color;
  varying vec3 vColor; varying vec2 vUv; varying vec3 vWorld; varying vec3 vNormal; varying float vFog;
  #ifdef FOOT_AO
    varying float vFootY;
  #endif
  uniform float uFogNear; uniform float uFogFar; uniform float uTime; uniform vec3 uFocus;
  #ifdef NEAR_FADE
    varying float vNear;
  #endif`;
const FOG_V_MAIN = `vFog = clamp((-mv.z - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);`;

const FRAG_COMMON = `
  uniform sampler2D map; uniform float uAlphaTest; uniform vec3 uTint; uniform float uBright; uniform float uAlpha;
  uniform vec3 uLightTint; uniform vec3 uFogColor; uniform vec3 uSun; uniform float uAmb; uniform float uDiff; uniform vec3 uFocus;
  uniform vec3 uHemiSky; uniform vec3 uHemiGround; uniform float uGloss; uniform vec2 uPat; uniform float uPatAmt;
  uniform sampler2D uShadowMap; uniform mat4 uShadowMatrix; uniform float uShadowOn; uniform float uShadowTexel;
  #ifdef NEAR_FADE
    varying float vNear;
  #endif
  varying vec3 vColor; varying vec2 vUv; varying vec3 vWorld; varying vec3 vNormal; varying float vFog;
  #ifdef FOOT_AO
    varying float vFootY;
  #endif

  // 4×4 ordered dither threshold: a regular screen, not per-pixel noise
  float bayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
  float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
  float hash12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }

  // moulded seam between tiles of size sz (metres) at surface coordinate m: 0 in the groove, 1 on the tile face;
  // fades out where the seam would be thinner than a pixel
  float seam(vec2 m, vec2 sz, float w, out float edgeLit) {
    vec2 q = fract(m / sz) * sz;
    vec2 e = min(q, sz - q);
    float g = min(e.x, e.y);
    vec2 fw = fwidth(m); float aa = max(fw.x, fw.y) + 1e-4;
    // far away the groove stays about a pixel wide at lower contrast, so courses still read at play distance
    float ww = max(w, aa * 0.7);
    float vis = 1.0 - 0.65 * smoothstep(w, w * 8.0, aa);
    edgeLit = (1.0 - smoothstep(ww, ww * 2.5 + aa, g)) * smoothstep(ww - aa, ww + aa, g) * vis;
    return mix(1.0, smoothstep(ww - aa, ww + aa, g), vis);
  }

  #ifdef USE_SHADOW
  float unpackDepth(vec4 c) { return dot(c, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)); }
  float shadowCmp(vec2 uv, float z) { return step(z, unpackDepth(texture2D(uShadowMap, uv))); }
  // depth comparison filtered bilinearly between the four nearest texels (smooth edges, no texel stairs)
  float shadowLerp(vec2 uv, float z) {
    float ts = uShadowTexel;
    vec2 g = uv / ts - 0.5, f = fract(g), c = (floor(g) + 0.5) * ts;
    float a = shadowCmp(c, z), b = shadowCmp(c + vec2(ts, 0.0), z);
    float d = shadowCmp(c + vec2(0.0, ts), z), e = shadowCmp(c + vec2(ts), z);
    return mix(mix(a, b, f.x), mix(d, e, f.x), f.y);
  }
  float shadowAt(vec3 wp, vec3 n) {
    float ndl = dot(n, uSun);
    vec4 sc = uShadowMatrix * vec4(wp + n * (0.05 + 0.1 * (1.0 - abs(ndl))), 1.0);
    vec3 p = sc.xyz / sc.w * 0.5 + 0.5;
    if (uShadowOn < 0.5 || p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0 || p.z > 1.0) return 1.0;
    float z = p.z - 0.0012, o = uShadowTexel * 0.8;
    float s = 0.25 * (shadowLerp(p.xy + vec2(-o, -o), z) + shadowLerp(p.xy + vec2(o, -o), z) + shadowLerp(p.xy + vec2(-o, o), z) + shadowLerp(p.xy + vec2(o, o), z));
    vec2 edge = min(p.xy, 1.0 - p.xy);
    return mix(1.0, s, smoothstep(0.0, 0.06, min(edge.x, edge.y)));
  }
  #endif

  // glossy ABS plastic on squared colours; returns gamma-space colour
  vec3 plastic(vec3 albedo, vec3 N, vec3 V, float gloss, float ao, float sh) {
    vec3 a = albedo * albedo;
    float ndl = max(dot(N, uSun), 0.0);
    vec3 sky = uHemiSky * uHemiSky, ground = uHemiGround * uHemiGround;
    vec3 hemi = mix(ground, sky, N.y * 0.5 + 0.5);
    vec3 tint = uLightTint * uLightTint;
    vec3 sun = vec3(1.0, 0.97, 0.9) * tint;
    vec3 col = a * (hemi * (uAmb * 1.05) * ao + sun * (uDiff * 1.45) * ndl * sh);
    vec3 H = normalize(uSun + V);
    #ifdef LITE
      float sp = max(dot(N, H), 0.0); sp *= sp; sp *= sp; sp *= sp; sp *= sp; sp *= sp;
      col += sun * sp * (0.25 + 0.9 * gloss) * sh;
    #else
      float spec = pow(max(dot(N, H), 0.0), mix(18.0, 110.0, gloss)) * (0.25 + 0.9 * gloss) * sh * step(0.0, ndl);
      float fres = pow(1.0 - max(dot(N, V), 0.0), 5.0);
      vec3 R = reflect(-V, N);
      vec3 env = mix(ground, sky, smoothstep(-0.25, 0.35, R.y));
      col += sun * spec + env * (0.03 + 0.45 * fres) * gloss * ao;
    #endif
    col = col / (1.0 + col * 0.12);
    return sqrt(col);
  }`;

const FRAG_MAIN = `
  void main() {
    // see-through fades stay in the opaque pass: rivals between the chase camera and the player (FADE), trees within
    // ~9 m of the camera (NEAR_FADE). With MSAA the coverage goes out as alpha (alpha to coverage) and resolves
    // smoothly; without it, an ordered 4×4 dither
    float cover = 1.0;
    #ifdef FADE
      cover = 1.0 - uFade;
    #endif
    #ifdef NEAR_FADE
      cover *= vNear;
    #endif
    #ifndef A2C
      if (cover < 1.0 && bayer4(gl_FragCoord.xy) >= cover) discard;
    #endif
    vec3 N = normalize(vNormal);
    #ifdef DOUBLE_SIDED
      if (!gl_FrontFacing) N = -N;
    #endif
    vec3 V = normalize(cameraPosition - vWorld);
    vec3 albedo = vColor * uTint * uBright;
    float alpha = 1.0;
    #ifdef USE_MAP
      vec4 t = texture2D(map, vUv);
      #ifdef FLAT_TINT
        albedo = t.rgb * uTint * uBright;
      #else
        albedo *= t.rgb;
      #endif
      alpha = t.a;
    #endif
    #ifdef USE_DECAL
      // printed details (faces, uniforms) over the part colour; uv (0, 0) is a transparent texel
      vec4 dc = texture2D(map, vUv);
      albedo = mix(albedo, dc.rgb, dc.a);
    #endif
    #ifdef ALPHA_TEST
      if (alpha < uAlphaTest) discard;
    #endif
    float ao = 1.0, gloss = uGloss, lit = 0.0;
    #ifdef FOOT_AO
      // placed models stand on their origin: walls darken over the bottom 1.3 m where they meet the ground
      ao *= mix(0.6, 1.0, smoothstep(0.0, 1.3, vFootY));
    #endif
    #ifdef PAT_STUDS
      // baseplate studs on upward faces: tilt the normal on each stud's bevel ring, darken the plate around its
      // base, and drop a small shadow on the side away from the sun
      if (N.y > 0.9) {
        vec2 cell = vWorld.xz / ${BRICK.pitch.toFixed(3)};
        vec2 fw = fwidth(cell);
        float fade = (1.0 - smoothstep(0.12, 0.32, max(fw.x, fw.y))) * uPatAmt;
        vec2 l = (fract(cell) - 0.5) * ${BRICK.pitch.toFixed(3)};
        float d = length(l), r = ${BRICK.studR.toFixed(3)};
        vec2 dir = d > 1e-4 ? l / d : vec2(0.0);
        float ring = smoothstep(r - 0.022, r - 0.003, d) * (1.0 - smoothstep(r - 0.003, r + 0.003, d));
        float top = 1.0 - smoothstep(r - 0.006, r, d);
        vec2 sd = normalize(uSun.xz + vec2(1e-4));
        float castSh = 1.0 - smoothstep(r - 0.011, r + 0.014, length(l + sd * 0.04));
        float out1 = smoothstep(r, r + 0.008, d);
        N = normalize(N + vec3(dir.x, 0.0, dir.y) * ring * 1.8 * fade);
        ao *= 1.0 - fade * (0.22 * (1.0 - smoothstep(r, r + 0.035, d)) * out1 + 0.3 * castSh * out1);
        albedo *= 1.0 + 0.05 * top * fade;
        ao *= mix(1.0, 0.97, 1.0 - fade);
      }
    #endif
    #ifdef PAT_GRAIN
      // asphalt: a fine low-contrast grain of 0.3 m flecks that fades out with distance (no seams)
      { vec2 gc = floor(vWorld.xz / 0.3); float gf = 1.0 - smoothstep(0.08, 0.3, max(fwidth(vWorld.x), fwidth(vWorld.z)));
        albedo *= 1.0 + (hash12(gc) - 0.5) * 0.12 * gf * uPatAmt; }
    #endif
    #ifdef PAT_TILES
      { float e; float s = seam(vUv * uPat.x, vec2(uPat.y), 0.018, e); float k = mix(1.0, 0.45 + 0.55 * s, uPatAmt); ao *= k; albedo *= mix(1.0, k, 0.6); lit = e * uPatAmt; }
    #endif
    #ifdef PAT_BRICKS
      if (abs(N.y) < 0.6) {
        vec2 m = vec2(vUv.x * uPat.x, vWorld.y);
        float row = floor(m.y / ${BRICK.brick.toFixed(3)});
        m.x += mod(row, 2.0) * uPat.y * 0.5;
        float e; float s = seam(m, vec2(uPat.y, ${BRICK.brick.toFixed(3)}), 0.02, e);
        float id = hash12(vec2(floor(m.x / uPat.y), row));
        albedo *= 1.0 + (id - 0.5) * 0.06 * uPatAmt;
        float k = mix(1.0, 0.5 + 0.5 * s, uPatAmt); ao *= k; albedo *= mix(1.0, k, 0.6); lit = e * uPatAmt;
        // each brick's top edge catches the light like a bevel
        float fy = fract(m.y / ${BRICK.brick.toFixed(3)});
        lit += smoothstep(0.78, 0.9, fy) * (1.0 - smoothstep(0.9, 0.97, fy)) * 1.6 * uPatAmt * (1.0 - smoothstep(0.02, 0.08, max(fwidth(m.y), 0.0)));
      }
    #endif
    float sh = 1.0;
    #ifdef USE_SHADOW
      sh = shadowAt(vWorld, N);
    #endif
    #ifdef EMISSIVE
      vec3 c = albedo;
    #else
      vec3 c = plastic(albedo, N, V, gloss, ao, sh) + lit * 0.06;
    #endif
    #ifdef RIM
      // a soft rim from the sky, tinted by the part colour and capped so dark parts keep their colour; at dusk and
      // sunset a fill (uFill) lifts the crews off the darker road
      c += min(uHemiSky * pow(1.0 - max(dot(N, V), 0.0), 3.0) * uRim * (0.3 + 0.7 * albedo), vec3(0.22)) + albedo * uFill;
    #endif
    #ifdef FLASH
      c += uFlash;
    #endif
    #ifdef A2C
      alpha *= cover;
    #endif
    gl_FragColor = vec4(mix(c, uFogColor, vFog), alpha * uAlpha);
  }`;

const PATTERNS = { studs: 'PAT_STUDS', tiles: 'PAT_TILES', bricks: 'PAT_BRICKS', grain: 'PAT_GRAIN' };

function base(opts, vertMain, extraV = '', extraUniforms = {}, extraF = '') {
  const THREE = T();
  const defines = {};
  if (opts.map) defines[opts.decal ? 'USE_DECAL' : 'USE_MAP'] = '';
  if (opts.alphaTest) defines.ALPHA_TEST = '';
  if (opts.flatTint) defines.FLAT_TINT = '';
  if (opts.emissive) defines.EMISSIVE = '';
  if (opts.shadows ?? S.shadowsDefault) defines.USE_SHADOW = '';
  if (S.lite) defines.LITE = '';
  if (opts.side === THREE.DoubleSide) defines.DOUBLE_SIDED = '';
  for (const p of [].concat(opts.pattern || [])) if (PATTERNS[p]) defines[PATTERNS[p]] = '';
  const uniforms = {
    map: { value: opts.map || null }, uAlphaTest: { value: opts.alphaTest || 0 },
    uTint: { value: new THREE.Color(opts.tint || '#ffffff') }, uBright: { value: opts.bright ?? 1 }, uAlpha: { value: opts.alpha ?? 1 },
    uGloss: { value: opts.gloss ?? 0.55 }, uPat: { value: new THREE.Vector2(opts.uvScale ?? 1, opts.tile ?? 1.6) }, uPatAmt: { value: opts.patAmt ?? 1 },
    ...shared(), ...extraUniforms,
  };
  const vertexShader = `${VERT_COMMON}\n${extraV}\nvoid main() {\n${vertMain}\n}`;
  const fragmentShader = `${extraF}\n${FRAG_COMMON}\n${FRAG_MAIN}`;
  const m = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, defines,
    side: opts.side ?? THREE.FrontSide, transparent: !!opts.transparent, depthWrite: opts.depthWrite ?? true });
  m.fog = false;
  m.userData.brick = true;
  return m;
}

// Instanced brick props (trees, crowds; bricktrees.js) colour some vertices per instance: a vertex coloured pure
// white takes the instance colour (canopy, shirt), pure magenta takes the instance's iSkin. With `cheer`, vertices
// with aPart 1/2 (arms) swing up around the shoulder in time, each instance on its own phase.
const INST_V = `
  #ifdef INST_SLOTS
    attribute vec3 iSkin;
  #endif
  #ifdef CHEER
    attribute float aPart; attribute float iPhase;
  #endif`;
const INST_MAIN = `
    vec3 pos = position, nrm = normal;
    #ifdef CHEER
      if (aPart > 0.5) {
        float side = aPart > 1.5 ? -1.0 : 1.0;
        float up = iPhase > 0.5 ? 2.5 * (0.55 + 0.45 * sin(uTime * 7.0 + iPhase * 6.2831)) : 0.25 * sin(uTime * 2.0 + iPhase * 9.0);
        vec3 piv = vec3(0.24 * side, 1.02, 0.0);
        float c = cos(up), s = sin(up);
        vec3 q = pos - piv;
        pos = piv + vec3(q.x, q.y * c + q.z * s, -q.y * s + q.z * c);
        nrm = vec3(nrm.x, nrm.y * c + nrm.z * s, -nrm.y * s + nrm.z * c);
      }
    #endif
    vColor = color;
    #if defined(NEAR_FADE) && defined(USE_INSTANCING)
      // whole trees step aside (all but at once, so no half-faded tree lingers) when their canopy is within ~8 m of the camera or
      // in the sightline from the camera to the player's tub, so no half-faded slab hangs in front of the view
      { vec3 io = (modelMatrix * instanceMatrix * vec4(0.0, 3.0, 0.0, 1.0)).xyz;
        vec3 a = cameraPosition, ab = uFocus + vec3(0.0, 1.0, 0.0) - a;
        float t = clamp(dot(io - a, ab) / max(dot(ab, ab), 1e-4), 0.0, 1.0);
        float corridor = mix(1.0, smoothstep(0.8, 1.1, length((io - (a + ab * t)).xz) - length(instanceMatrix[0].xyz) * 2.0), step(0.02, t) * (1.0 - step(0.97, t)));
        float reach = length(instanceMatrix[0].xyz) * 2.7; // canopy radius at this tree's scale
        vNear = smoothstep(3.0, 3.3, length((io - a).xz) - reach) * corridor; }
    #endif
    #ifdef FOOT_AO
      vFootY = pos.y;
    #endif
    #if defined(INST_SLOTS) && defined(USE_INSTANCING_COLOR)
      if (color.r > 0.99 && color.g > 0.99 && color.b > 0.99) vColor = instanceColor;
      else if (color.r > 0.99 && color.g < 0.01 && color.b > 0.99) vColor = iSkin;
    #endif`;

// static world (track chunks, buildings, props): positions already in world space
export function worldMat(opts = {}) {
  const m = base(opts, `
    ${INST_MAIN}
    vUv = uv;
    #ifdef USE_INSTANCING
      vec4 wp = modelMatrix * instanceMatrix * vec4(pos, 1.0);
      vNormal = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * nrm);
    #else
      vec4 wp = modelMatrix * vec4(pos, 1.0);
      vNormal = normalize(mat3(modelMatrix) * nrm);
    #endif
    vWorld = wp.xyz;
    vec4 mv = viewMatrix * wp;
    ${FOG_V_MAIN}
    gl_Position = projectionMatrix * mv;`, INST_V);
  if (opts.instSlots) m.defines.INST_SLOTS = '';
  if (opts.cheer) m.defines.CHEER = '';
  if (opts.nearFade) { m.defines.NEAR_FADE = ''; a2c(m, opts); }
  if (opts.footAO) m.defines.FOOT_AO = '';
  return m;
}

// opaque materials that fade: alpha to coverage when the canvas has MSAA
function a2c(m, opts) { if (S.a2c && !opts.transparent) { m.alphaToCoverage = true; m.defines.A2C = ''; } }

// placed models (landmarks, thrown items): same shading; kept separate for parity with n64mat.js
export const litMat = worldMat;

export const MAX_PARTS = 24;
// karts: each vertex follows one of up to MAX_PARTS rigid part matrices (aPart)
export function partMat(opts = {}) {
  const THREE = T();
  const mats = [];
  for (let i = 0; i < MAX_PARTS; i++) mats.push(new THREE.Matrix4());
  const m = base({ gloss: 0.7, ...opts }, `
    mat4 pm = uParts[int(aPart + 0.5)];
    vec4 wp = modelMatrix * pm * vec4(position, 1.0);
    vColor = color; vUv = uv;
    vWorld = wp.xyz; vNormal = normalize(mat3(modelMatrix) * mat3(pm) * normal);
    vec4 mv = viewMatrix * wp;
    ${FOG_V_MAIN}
    gl_Position = projectionMatrix * mv;`, `
    attribute float aPart;
    uniform mat4 uParts[${MAX_PARTS}];`, { uParts: { value: mats }, uFlash: { value: new THREE.Vector3() }, uFade: { value: 0 }, uRim: { value: opts.rim ?? 0.35 }, uFill: { value: 0 } },
  `#define FLASH\n#define FADE\n#define RIM\nuniform vec3 uFlash; uniform float uFade; uniform float uRim; uniform float uFill;`);
  a2c(m, opts);
  return m;
}
