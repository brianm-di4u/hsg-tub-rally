// Screen-space ambient occlusion for the High tier: the toy-photo grounding the sun shadow alone can't give
// (crevices between parts, wall feet, under tubs and figures, window recesses). The scene renders into a
// multisampled target with a depth texture; a half-resolution pass estimates occlusion from 8 hemisphere samples
// around the normal rebuilt from depth (rotated per pixel); the composite blurs it with depth-aware weights,
// darkens the colour by it, fades it out with distance (fogged geometry stays clean) and leaves the sky alone.
const VERT = `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const AO_FRAG = `
  uniform sampler2D tDepth; uniform mat4 uProj, uInvProj; uniform vec3 uKernel[8]; uniform float uRadius; uniform vec2 uSize;
  varying vec2 vUv;
  // explicit LOD: these targets have no mipmaps, and implicit-LOD reads inside loops need derivatives
  vec3 viewPos(vec2 uv) {
    float d = textureLod(tDepth, uv, 0.0).x;
    vec4 p = uInvProj * vec4(uv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
    return p.xyz / p.w;
  }
  void main() {
    float d = texture2D(tDepth, vUv).x;
    if (d >= 1.0) { gl_FragColor = vec4(1.0); return; }
    vec3 p = viewPos(vUv);
    vec3 n = normalize(cross(dFdx(p), dFdy(p)));
    // per-pixel rotation of the kernel (interleaved gradient noise), resolved by the composite's blur
    float a = 6.2831 * fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
    vec3 r = vec3(cos(a), sin(a), 0.0);
    vec3 t = normalize(r - n * dot(r, n)), b = cross(n, t);
    float occ = 0.0;
    for (int i = 0; i < 8; i++) {
      vec3 k = uKernel[i];
      vec3 s = p + (t * k.x + b * k.y + n * k.z) * uRadius;
      vec4 c = uProj * vec4(s, 1.0);
      vec2 su = c.xy / c.w * 0.5 + 0.5;
      float sz = viewPos(su).z;
      float range = smoothstep(0.0, 1.0, uRadius / max(abs(p.z - sz), 1e-3));
      occ += (sz >= s.z + 0.03 ? 1.0 : 0.0) * range;
    }
    gl_FragColor = vec4(vec3(1.0 - occ / 8.0), 1.0);
  }`;

const COMP_FRAG = `
  uniform sampler2D tColor, tDepth, tAO; uniform mat4 uInvProj; uniform vec2 uAOTexel; uniform float uStrength, uFadeFar;
  varying vec2 vUv;
  float viewZ(vec2 uv) { float d = textureLod(tDepth, uv, 0.0).x; vec4 p = uInvProj * vec4(uv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0); return p.z / p.w; }
  void main() {
    vec4 col = texture2D(tColor, vUv);
    float d = texture2D(tDepth, vUv).x;
    if (d >= 1.0) { gl_FragColor = col; return; }
    float z = viewZ(vUv), sum = 0.0, wsum = 0.0;
    for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
      vec2 o = vec2(float(x), float(y)) * uAOTexel * 1.5;
      float w = 1.0 / (1.0 + abs(viewZ(vUv + o) - z) * 4.0);
      sum += textureLod(tAO, vUv + o, 0.0).r * w; wsum += w;
    }
    float ao = sum / wsum;
    float fade = 1.0 - smoothstep(uFadeFar * 0.6, uFadeFar, -z);
    gl_FragColor = vec4(col.rgb * mix(1.0, ao, uStrength * fade), col.a);
  }`;

export class SSAO {
  constructor(THREE, opts = {}) {
    this.THREE = THREE;
    this.samples = opts.samples ?? 4;
    this.strength = opts.strength ?? 0.85;
    this.radius = opts.radius ?? 0.8;
    this.fadeFar = opts.fadeFar ?? 70;
    // cosine-weighted hemisphere kernel, denser near the centre (fixed, so captures repeat exactly)
    const kernel = [];
    for (let i = 0; i < 8; i++) {
      const a = i * 2.39996, r = Math.sqrt((i + 0.5) / 8), s = 0.25 + 0.75 * ((i + 1) / 8) ** 2;
      kernel.push(new THREE.Vector3(Math.cos(a) * r * s, Math.sin(a) * r * s, Math.sqrt(1 - r * r) * s));
    }
    const quad = new THREE.BufferGeometry();
    quad.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
    quad.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 2, 0, 0, 2], 2));
    this.aoMat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: AO_FRAG, depthTest: false, depthWrite: false,
      uniforms: { tDepth: { value: null }, uProj: { value: new THREE.Matrix4() }, uInvProj: { value: new THREE.Matrix4() }, uKernel: { value: kernel }, uRadius: { value: this.radius }, uSize: { value: new THREE.Vector2() } } });
    this.compMat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: COMP_FRAG, depthTest: false, depthWrite: false,
      uniforms: { tColor: { value: null }, tDepth: { value: null }, tAO: { value: null }, uInvProj: { value: new THREE.Matrix4() }, uAOTexel: { value: new THREE.Vector2() }, uStrength: { value: this.strength }, uFadeFar: { value: this.fadeFar } } });
    this.aoMesh = new THREE.Mesh(quad, this.aoMat); this.compMesh = new THREE.Mesh(quad, this.compMat);
    this.aoMesh.frustumCulled = this.compMesh.frustumCulled = false;
    this.aoScene = new THREE.Scene(); this.aoScene.add(this.aoMesh);
    this.compScene = new THREE.Scene(); this.compScene.add(this.compMesh);
    this.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.w = 0; this.h = 0;
  }
  setSize(w, h) {
    if (w === this.w && h === this.h) return;
    const THREE = this.THREE;
    this.w = w; this.h = h;
    if (this.rt) { this.rt.dispose(); this.rt.depthTexture.dispose(); this.aoRT.dispose(); }
    const depth = new THREE.DepthTexture(w, h); depth.type = THREE.UnsignedIntType;
    this.rt = new THREE.WebGLRenderTarget(w, h, { samples: this.samples, depthTexture: depth, depthBuffer: true, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, generateMipmaps: false });
    const hw = Math.max(1, w >> 1), hh = Math.max(1, h >> 1);
    this.aoRT = new THREE.WebGLRenderTarget(hw, hh, { depthBuffer: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, generateMipmaps: false });
    this.aoMat.uniforms.uSize.value.set(hw, hh);
    this.compMat.uniforms.uAOTexel.value.set(1 / hw, 1 / hh);
  }
  // renders `scene` through the AO into the canvas (or the current output)
  render(gl, scene, camera) {
    const u = this.aoMat.uniforms, c = this.compMat.uniforms;
    gl.setRenderTarget(this.rt);
    gl.render(scene, camera);
    u.tDepth.value = this.rt.depthTexture;
    u.uProj.value.copy(camera.projectionMatrix); u.uInvProj.value.copy(camera.projectionMatrixInverse);
    gl.setRenderTarget(this.aoRT);
    gl.render(this.aoScene, this.cam);
    c.tColor.value = this.rt.texture; c.tDepth.value = this.rt.depthTexture; c.tAO.value = this.aoRT.texture;
    c.uInvProj.value.copy(camera.projectionMatrixInverse);
    gl.setRenderTarget(null);
    gl.render(this.compScene, this.cam);
  }
  dispose() { if (this.rt) { this.rt.dispose(); this.rt.depthTexture.dispose(); this.aoRT.dispose(); } this.aoMat.dispose(); this.compMat.dispose(); }
}
