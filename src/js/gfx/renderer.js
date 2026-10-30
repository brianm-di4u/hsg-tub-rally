// N64-style renderer: the WebGL canvas backing store is a low resolution (240 lines in Authentic mode) and CSS
// stretches it to the window with the browser's bilinear filter, which gives the soft analogue-video look for
// free. Colours stay in gamma space (no colour management, no tone mapping).
import { initMaterials, setFog, setSun, setTime } from './n64mat.js';

export const RES_MODES = { authentic: 240, crisp: 480, native: 0 };

export class Renderer {
  constructor(canvas, opts = {}) {
    const THREE = window.THREE;
    this.THREE = THREE;
    THREE.ColorManagement.enabled = false;
    this.canvas = canvas;
    this.aa = opts.antialias ?? true;
    this.gl = new THREE.WebGLRenderer({ canvas, antialias: this.aa, powerPreference: 'high-performance', preserveDrawingBuffer: !!window.__TEST__, alpha: false });
    this.gl.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.gl.toneMapping = THREE.NoToneMapping;
    this.gl.setPixelRatio(1);
    this.gl.autoClear = true;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(62, 4 / 3, 0.3, 520);
    initMaterials();
    this.mode = opts.mode || 'authentic';
    this.size = { w: 0, h: 0 };
    this.info = { draws: 0, tris: 0 };
  }
  setMode(mode) { this.mode = RES_MODES[mode] != null ? mode : 'authentic'; this.resize(true); }
  resize(force = false) {
    const cw = this.canvas.clientWidth || window.innerWidth, ch = this.canvas.clientHeight || window.innerHeight;
    const short = RES_MODES[this.mode];
    let w, h;
    if (!short) { const dpr = Math.min(2, window.devicePixelRatio || 1); w = Math.round(cw * dpr); h = Math.round(ch * dpr); }
    else if (cw >= ch) { h = short; w = Math.round((short * cw) / ch); }
    else { w = short; h = Math.round((short * ch) / cw); }
    if (!force && w === this.size.w && h === this.size.h) return false;
    this.size = { w, h };
    this.gl.setSize(w, h, false);
    this.camera.aspect = w / h;
    // portrait phones get a wider vertical field of view so the road still fits
    this.baseFov = cw >= ch ? 62 : 78;
    this.camera.fov = this.baseFov;
    this.camera.updateProjectionMatrix();
    return true;
  }
  setEnv(env) {
    const THREE = this.THREE;
    const fogC = env.fogColor || '#C9DFE8';
    const fog = env.fog || [90, 330];
    setFog(fogC, fog[0], fog[1]);
    if (env.sun) setSun(env.sun, env.amb, env.diff);
    this.gl.setClearColor(new THREE.Color(fogC), 1);
    this.camera.far = fog[1] + 60;
    this.camera.updateProjectionMatrix();
  }
  render(time) {
    setTime(time);
    this.gl.render(this.scene, this.camera);
    const r = this.gl.info.render;
    this.info.draws = r.calls; this.info.tris = r.triangles;
  }
}
