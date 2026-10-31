// Sun shadows for the brick look (Medium and High tiers): an orthographic depth pass from the sun over a square
// around the action, packed into an RGBA8 target (no depth-texture or float-target extension needed, so phones
// that run the High tier get the same result), sampled with 3×3 PCF by every brick material (brickmat.js,
// USE_SHADOW). Only meshes flagged userData.caster draw into it: buildings, walls, props, landmarks and tubs; the
// ground and road only receive. A caster may draw a cheaper userData.depthGeo (tubs use their far model: a texel is
// ~8 cm, coarser than any crew detail), and `skip` (a name regex) leaves a kind out on a tier. The map's centre snaps to whole texels so edges don't crawl as the camera moves.
import { shadowUniforms } from './brickmat.js';

const PACK = `
  vec4 packDepth(float v) {
    vec4 r = fract(v * vec4(1.0, 255.0, 65025.0, 16581375.0));
    return r - r.yzww * vec4(1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0, 0.0);
  }
  void main() { gl_FragColor = packDepth(gl_FragCoord.z); }`;

export function depthMat(THREE) {
  // instanced casters (trees, crowds) place each copy with its instance matrix
  return new THREE.ShaderMaterial({ vertexShader: `void main() {
    #ifdef USE_INSTANCING
      gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    #else
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    #endif
    }`, fragmentShader: PACK, side: THREE.DoubleSide });
}
// karts: the same rigid-part matrices as their colour material (shared uniform object)
export function partDepthMat(THREE, uParts, n) {
  return new THREE.ShaderMaterial({ uniforms: { uParts },
    vertexShader: `attribute float aPart; uniform mat4 uParts[${n}];
      void main() { gl_Position = projectionMatrix * viewMatrix * modelMatrix * uParts[int(aPart + 0.5)] * vec4(position, 1.0); }`,
    fragmentShader: PACK, side: THREE.DoubleSide });
}

export class SunShadow {
  constructor(THREE, size = 1024, radius = 45) {
    this.THREE = THREE;
    this.size = size; this.radius = radius;
    this.rt = new THREE.WebGLRenderTarget(size, size, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type: THREE.UnsignedByteType, depthBuffer: true, generateMipmaps: false });
    this.cam = new THREE.OrthographicCamera(-radius, radius, radius, -radius, 1, 360);
    this.depth = depthMat(THREE);
    this.u = shadowUniforms();
    this.u.uShadowMap.value = this.rt.texture;
    this.u.uShadowTexel.value = 1 / size;
    this.u.uShadowOn.value = 1;
    this.clear = new THREE.Color(1, 1, 1);
    this.prevClear = new THREE.Color();
    this.v = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
    this.hidden = []; this.swapped = [];
  }
  setEnabled(on) { this.u.uShadowOn.value = on ? 1 : 0; this.on = on; }
  // focus: [x, y, z] the map centres on; sun: unit vector toward the sun
  render(gl, scene, focus, sun) {
    if (this.on === false) return;
    const [right, up, f] = this.v;
    f.set(sun.x, sun.y, sun.z).normalize();
    right.set(0, 1, 0).cross(f).normalize(); up.copy(f).cross(right);
    const texel = (this.radius * 2) / this.size;
    const r = Math.round((focus[0] * right.x + focus[1] * right.y + focus[2] * right.z) / texel) * texel;
    const u = Math.round((focus[0] * up.x + focus[1] * up.y + focus[2] * up.z) / texel) * texel;
    const d = focus[0] * f.x + focus[1] * f.y + focus[2] * f.z;
    const cx = right.x * r + up.x * u + f.x * d, cy = right.y * r + up.y * u + f.y * d, cz = right.z * r + up.z * u + f.z * d;
    this.cam.position.set(cx + f.x * 180, cy + f.y * 180, cz + f.z * 180);
    this.cam.up.copy(up);
    this.cam.lookAt(cx, cy, cz);
    this.cam.updateMatrixWorld();
    this.u.uShadowMatrix.value.multiplyMatrices(this.cam.projectionMatrix, this.cam.matrixWorldInverse);
    // draw casters only, each with its depth material
    const hidden = this.hidden, swapped = this.swapped;
    hidden.length = 0; swapped.length = 0;
    scene.traverseVisible((o) => {
      if (!o.isMesh && !o.isPoints && !o.isSprite) return;
      const dm = o.userData.caster && !(this.skip && this.skip.test(o.name)) ? (o.userData.depthMat || this.depth) : null;
      if (dm) { swapped.push(o, o.material, o.geometry); o.material = dm; if (o.userData.depthGeo) o.geometry = o.userData.depthGeo; } else if (o.visible) { hidden.push(o); o.visible = false; }
    });
    gl.getClearColor(this.prevClear); const a = gl.getClearAlpha();
    gl.setRenderTarget(this.rt);
    gl.setClearColor(this.clear, 1);
    gl.clear();
    gl.render(scene, this.cam);
    gl.setRenderTarget(null);
    gl.setClearColor(this.prevClear, a);
    for (let i = 0; i < swapped.length; i += 3) { swapped[i].material = swapped[i + 1]; swapped[i].geometry = swapped[i + 2]; }
    for (const o of hidden) o.visible = true;
  }
  dispose() { this.rt.dispose(); this.depth.dispose(); }
}
