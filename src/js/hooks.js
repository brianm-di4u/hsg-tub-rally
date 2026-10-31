// window.__game test hooks (shared/test-harness/README.md contract). All results are JSON-serializable.
import { fumble } from './sim/kart.js';
import { DT } from './sim/race.js';
import { makeDriver, driveAI } from './sim/ai.js';
import { makeRng } from './rng.js';

export function installHooks(App, api) {
  const summary = () => {
    const r = App.race;
    const out = {
      scene: App.scene, screen: App.screens.cur, paused: App.paused || App.testPaused, ready: App.ready,
      track: App.track ? { id: App.track.id, name: App.track.name, length: +App.track.length.toFixed(1), n: App.track.n } : null,
      render: { w: App.renderer.size.w, h: App.renderer.size.h, mode: App.renderer.mode, draws: App.renderer.info.draws, tris: App.renderer.info.tris, tier: App.tier, builtTier: App.builtTier || App.tier },
      world: App.world ? App.world.userData : null,
      settings: App.save.settings, steps: App.steps,
      ghost: App.ghost ? { team: App.ghost.team, total: App.ghost.total, n: App.ghost.n } : null, newRecord: !!App.newRecord,
      best: App.track ? App.save.best[App.track.id] || null : null,
      audio: App.audioState ? App.audioState() : null,
    };
    if (r) {
      out.race = {
        phase: r.phase, time: +r.time.toFixed(3), laps: r.laps, mode: r.mode, classId: r.classId, player: r.player, seed: r.seed,
        karts: r.karts.map((k) => ({ id: k.id, team: k.team, human: k.human, lap: k.lap, place: k.place, cp: k.cpNext,
          s: +k.s.toFixed(2), d: +k.d.toFixed(2), x: +k.x.toFixed(2), y: +k.y.toFixed(2), z: +k.z.toFixed(2), yaw: +k.yaw.toFixed(3),
          vf: +k.vf.toFixed(2), gal: +k.water.gal.toFixed(2), cap: k.water.cap, items: { ...k.items }, state: k.state, drift: k.drift,
          stage: k.stage, boostT: +k.boostT.toFixed(2), boostKind: k.boostKind, air: k.air, held: k.held, tickets: k.tickets, shield: k.shield, bribes: k.bribes, finished: k.finished, finishT: k.finishT, surf: k.surfType, lapTimes: k.lapTimes })),
        results: r.results,
        items: { bubbles: r.items.bubbles.length, live: r.items.live.map((o) => ({ type: o.type, owner: o.owner })), judges: r.items.judges },
      };
    }
    return out;
  };
  window.__game = {
    seed(n) { App.nextSeed = n; return true; },
    getState: summary,
    setState(s = {}) {
      if (s.settings) Object.assign(App.save.settings, s.settings);
      if (s.res) App.renderer.setMode(s.res);
      const r = App.race;
      if (r && s.kart) {
        const k = r.karts[s.kart.id ?? r.player];
        if (k) {
          if (s.kart.gal != null) k.water.gal = Math.min(k.water.cap, s.kart.gal);
          if (s.kart.items) Object.assign(k.items, s.kart.items);
          if (s.kart.s != null) teleport(App, k, s.kart.s, s.kart.d ?? 0);
          if (s.kart.tickets != null) k.tickets = s.kart.tickets;
          if (s.kart.held !== undefined) { k.held = s.kart.held; k.heldN = s.kart.held === 'jet3' ? 3 : s.kart.held ? 1 : 0; }
          if (s.kart.vf != null) k.vf = s.kart.vf;
        }
      }
      return summary();
    },
    isIdle() { return App.ready && App.loading === 0 && (!App.screens || App.screens.trans <= 0 || true); },
    step(n = 1) { for (let i = 0; i < n; i++) api.stepOnce(); return summary(); },
    pause() { App.testPaused = true; return true; },
    resume() { App.testPaused = false; App.paused = false; return true; },
    async scene(name) {
      if (name === 'title') api.gotoTitle();
      else if (name === 'race' || name === 'game') return api.startRace({ seed: App.nextSeed ?? 7 }).then(summary);
      else if (['help', 'settings'].includes(name)) { if (App.scene !== 'title') api.gotoTitle(); App.screens.show(name); }
      else if (name === 'pause') { if (App.scene === 'race') { App.paused = true; App.screens.show('pause'); } }
      return summary();
    },
    async newGame(opts = {}) { await api.startRace({ seed: App.nextSeed ?? 7, ...opts }); return summary(); },
    act(name, ...args) {
      const r = App.race, k = r && r.player >= 0 ? r.karts[r.player] : null;
      switch (name) {
        case 'input': App.held = args[0] || null; return true; // held player input for following steps
        case 'hit': if (k) { const ok = fumble(k, r.rng.items, args[0] ?? 3); api.kartEvents(k); return ok; } return false;
        case 'water': if (k) { k.water.gal = Math.max(0, Math.min(k.water.cap, args[0])); return true; } return false;
        case 'teleport': if (k) { teleport(App, k, args[0], args[1] ?? 0); return true; } return false;
        case 'skipCountdown': if (r && r.phase === 'countdown') { r.time = -DT; api.stepOnce(); } return summary();
        case 'camSnap': App.cam.snap(); return true;
        // fixed review camera: act('camAt', [x,y,z], [tx,ty,tz]) or act('camAt', null) to release
        case 'camAt': App.camOverride = args[0] ? { pos: args[0], target: args[1] } : null; return true;
        case 'landmarks': return App.world ? App.world.children.filter((g) => g.name.startsWith('landmark:')).map((g) => g.name.slice(9)) : [];
        case 'landmark': { // position of a placed landmark (for review shots)
          const g = App.world && App.world.getObjectByName('landmark:' + args[0]);
          return g ? { x: g.position.x, y: g.position.y, z: g.position.z, yaw: g.rotation.y } : null;
        }
        case 'hash': return r ? hashRace(r) : 0;
        case 'camDebug': { const c = App.renderer.camera, k = App.camPose && App.camPose.k; const g = App.track.surface(c.position.x, c.position.z, k ? k.s : 0); return { cam: [c.position.x, c.position.y, c.position.z], ground: g.h, d: g.d, s: g.s, fov: c.fov }; }
        case 'aiHint': { // what the AI would press for the player's tub right now (for real-keyboard tests)
          if (!k) return null;
          App._hintDrv = App._hintDrv && App._hintDrv.k === k ? App._hintDrv : { k, d: makeDriver(k, r.classId, makeRng(5), 1) };
          return driveAI(k, App._hintDrv.d, App.track, { capMul: 1, race: r }, 1 / 60);
        }
        case 'clearSave': App.save.best = {}; App.save.ghosts = {}; return true;
        // review captures (tools/shots-gpu.mjs): freeze the render clock at ms, or release it with null
        // (CSS transitions and animations run on wall-clock time, so they hold still too while the clock is frozen)
        case 'clock': { const was = App.clock; App.clock = args[0] == null ? null : args[0] / 1000; if (App.clock != null && was == null) App.time = App.clock; document.body.classList.toggle('clock-frozen', App.clock != null); return true; }
        // close review camera on a target ('player', 'kart:N', 'preview', 'landmark:id', 'at:s,d,h'):
        // act('camLook', target, widthM, pitch, yaw); yaw 0 looks at the target's front. act('camLook', null) releases.
        case 'camLook': {
          if (!args[0]) { App.camOverride = null; return true; }
          const T = lookTarget(App, args[0]);
          if (!T) return false;
          const w = args[1] || 4, pitch = args[2] ?? 0.18, yaw = args[3] ?? 0.6, cam = App.renderer.camera;
          const vh = Math.tan((cam.fov * Math.PI) / 360), hh = vh * cam.aspect;
          const dist = w / 2 / Math.min(hh, vh * 1.25);
          const a = T.yaw + yaw, c = Math.cos(pitch);
          App.camOverride = { pos: [T.x + Math.sin(a) * c * dist, T.y + Math.sin(pitch) * dist, T.z + Math.cos(a) * c * dist], target: [T.x, T.y, T.z] };
          return true;
        }
        case 'menu': api.onMenu(args[0], args[1] || {}); return App.screens.cur;
        case 'perfLab': return api.perfLab(args[0] || {});
        case 'labStats': return api.labStats();
        case 'fxCount': { const l = App.fx && App.fx.life; let n = 0; if (l) for (let i = 0; i < l.length; i++) if (l[i] > 0) n++; return n; }
        case 'hud': { // hide or show every 2D layer over the canvas (close-ups)
          for (const id of ['hud', 'touch', 'screens']) { const el = document.getElementById(id); if (el) el.style.visibility = args[0] === false ? 'hidden' : ''; }
          return true;
        }
        case 'gfx': {
          const gl = App.renderer.gl.getContext(), ext = gl.getExtension('WEBGL_debug_renderer_info');
          const renderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
          return { calls: App.renderer.info.draws, tris: App.renderer.info.tris, cpuMs: App.cpuMs != null ? +App.cpuMs.toFixed(2) : null, tier: App.tier, mode: App.renderer.mode,
            w: App.renderer.size.w, h: App.renderer.size.h, renderer, software: /swiftshader|llvmpipe|software|basic render/i.test(renderer) };
        }
        case 'seeThroughNear': { // transparent or fading meshes whose bounds come within a.r m of the camera
          const cam = App.renderer.camera.position, out = [], r = (args[0] && args[0].r) || 12;
          App.renderer.scene.traverseVisible((o) => {
            if (!o.isMesh || !o.geometry) return;
            const m = o.material, d = m.defines || {};
            if (!(m.transparent || m.alphaToCoverage || 'FADE' in d || 'NEAR_FADE' in d)) return;
            if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
            const bs = o.geometry.boundingSphere.clone().applyMatrix4(o.matrixWorld);
            const dist = bs.center.distanceTo(cam) - bs.radius;
            if (dist < r) out.push({ name: o.name || o.parent?.name || o.type, dist: +dist.toFixed(1), transparent: !!m.transparent, a2c: !!m.alphaToCoverage, fade: m.uniforms?.uFade?.value });
          });
          return out;
        }
        case 'sceneTris': { // triangles per visible mesh (×instances), largest first; casters also draw in the shadow pass
          const rows = [];
          App.renderer.scene.traverseVisible((o) => {
            if (!o.isMesh || !o.geometry) return;
            const g = o.geometry, n = (g.index ? g.index.count : g.attributes.position.count) / 3 * (o.isInstancedMesh ? o.count : 1);
            rows.push({ name: o.name || o.parent?.name || '?', tris: Math.round(n), caster: !!o.userData.caster });
          });
          const by = {};
          for (const r of rows) { const k = r.name.replace(/#\d+$/, ''); by[k] ||= { tris: 0, n: 0, caster: r.caster }; by[k].tris += r.tris; by[k].n++; }
          return Object.entries(by).sort((a, b) => b[1].tris - a[1].tris).slice(0, 20);
        }
        default: return false;
      }
    },
  };
}

// a review-camera target: centre point plus the heading its "front" faces
function lookTarget(App, name) {
  const r = App.race, [kind, arg] = String(name).split(/:(.*)/);
  if (kind === 'player' || kind === 'kart') {
    const k = r && r.karts[kind === 'player' ? Math.max(0, r.player) : +arg];
    return k ? { x: k.x, y: k.y + 0.85, z: k.z, yaw: k.yaw } : null;
  }
  if (kind === 'preview') { const p = App.preview && App.preview.pose; return p ? { x: p.x, y: p.y + 0.85, z: p.z, yaw: p.yaw } : null; }
  if (kind === 'landmark') {
    const g = App.world && App.world.getObjectByName('landmark:' + arg);
    if (!g) return null;
    const bb = new window.THREE.Box3().setFromObject(g);
    return { x: g.position.x, y: (bb.min.y + bb.max.y) / 2, z: g.position.z, yaw: g.rotation.y };
  }
  if (kind === 'at') {
    const [s, d, h] = arg.split(',').map(Number), tr = App.track, p = tr.point(s, d || 0), c = tr.at(s);
    return { x: p.x, y: p.y + (h || 1), z: p.z, yaw: Math.atan2(c.tx, c.tz) };
  }
  return null;
}

function teleport(App, k, s, d) {
  const tr = App.track, p = tr.point(s, d), c = tr.at(s);
  k.x = p.x; k.z = p.z; k.y = p.y; k.yaw = Math.atan2(c.tx, c.tz); k.s = tr.wrapS(s); k.safeS = k.s; k.vf = 0; k.vl = 0; k.air = false; k.vyG = 0;
  App.prev = App.race.karts.map((q) => ({ x: q.x, y: q.y, z: q.z, yaw: q.yaw }));
  App.cam.snap();
}

// FNV-1a over the rounded kart state: identical inputs and seed give the same hash in Node and Chromium.
export function hashRace(r) {
  let h = 2166136261 >>> 0;
  const mix = (v) => { const s = String(Math.round(v * 1000)); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } };
  for (const k of r.karts) { mix(k.x); mix(k.z); mix(k.y); mix(k.yaw); mix(k.vf); mix(k.water.gal); mix(k.lap); }
  mix(r.time);
  return h >>> 0;
}
