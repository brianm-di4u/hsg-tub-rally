// N64-style renderer: the WebGL canvas backing store is a low resolution (240 lines in Authentic mode) and CSS
// stretches it to the window with the browser's bilinear filter, which gives the soft analogue-video look for
// free. Colours stay in gamma space (no colour management, no tone mapping).
import { initMaterials, setFog, setSun, setTime, setLightTint } from './n64mat.js';
import { setHemi } from './brickmat.js';
import { SSAO } from './ssao.js';

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
    this.gl.info.autoReset = false; // a frame's counts include the shadow pass
    this.shadow = null; this.shadowFocus = null;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(62, 4 / 3, 0.3, 520);
    initMaterials();
    this.mode = opts.mode || 'native';
    this.dprCap = opts.dprCap || 2;
    this.sunDir = new THREE.Vector3(0.4, 0.8, 0.3).normalize();
    this.size = { w: 0, h: 0 };
    this.info = { draws: 0, tris: 0 };
    // ambient occlusion (High): the scene goes through a multisampled target and the AO composite (native mode only)
    this.ssao = opts.ao ? new SSAO(THREE, { samples: this.aa ? 4 : 0 }) : null;
  }
  setMode(mode) { this.mode = RES_MODES[mode] != null ? mode : 'native'; this.resize(true); }
  resize(force = false) {
    const cw = this.canvas.clientWidth || window.innerWidth, ch = this.canvas.clientHeight || window.innerHeight;
    const short = RES_MODES[this.mode];
    let w, h;
    if (!short) { const dpr = Math.min(this.dprCap, window.devicePixelRatio || 1); w = Math.round(cw * dpr); h = Math.round(ch * dpr); }
    else if (cw >= ch) { h = short; w = Math.round((short * cw) / ch); }
    else { w = short; h = Math.round((short * ch) / cw); }
    if (!force && w === this.size.w && h === this.size.h) return false;
    this.size = { w, h };
    this.gl.setSize(w, h, false);
    if (this.ssao) this.ssao.setSize(w, h);
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
    if (env.sun) { setSun(env.sun, env.amb, env.diff); this.sunDir.set(env.sun[0], env.sun[1], env.sun[2]).normalize(); }
    // ambient and reflections: the sky above (between its zenith and horizon colours), the baseplate below (a muted
    // green: a saturated one tinted shaded buff walls olive)
    const sky = env.sky || ['#7FB6E0', '#D9ECF5'], c = new THREE.Color(sky[0]).lerp(new THREE.Color(sky[1]), 0.55);
    setHemi('#' + c.getHexString(), env.time === 'dusk' ? '#3E3A4A' : env.time === 'sunset' ? '#6B5A3C' : '#7E866A');
    setLightTint(env.lightTint || (env.time === 'dusk' ? [1.0, 0.8, 0.86] : env.time === 'sunset' ? [1.0, 0.86, 0.78] : [1, 1, 1]));
    this.gl.setClearColor(new THREE.Color(fogC), 1);
    this.camera.far = fog[1] + 60;
    this.camera.updateProjectionMatrix();
  }
  render(time) {
    setTime(time);
    this.gl.info.reset();
    if (this.shadow && this.shadowFocus) this.shadow.render(this.gl, this.scene, this.shadowFocus, this.sunDir);
    if (this.ssao && !RES_MODES[this.mode]) this.ssao.render(this.gl, this.scene, this.camera);
    else this.gl.render(this.scene, this.camera);
    const r = this.gl.info.render;
    this.info.draws = r.calls; this.info.tris = r.triangles;
  }
}
