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
      render: { w: App.renderer.size.w, h: App.renderer.size.h, mode: App.renderer.mode, draws: App.renderer.info.draws, tris: App.renderer.info.tris, tier: App.tier },
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
        case 'hit': if (k) return fumble(k, r.rng.items, args[0] ?? 3); return false;
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
        default: return false;
      }
    },
  };
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
