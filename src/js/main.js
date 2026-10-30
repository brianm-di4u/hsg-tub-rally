// Spa City Tub Rally: boot, scene flow, the fixed-step race loop and rendering.
// Fixed 60 Hz simulation with an accumulator (pattern after hsg-fishing/src/js/main.js, Hot Springs Games, MIT);
// the renderer draws between the last two sim states. Test hooks live in hooks.js.
import { Renderer } from './gfx/renderer.js';
import { buildTrackWorld } from './gfx/trackmesh.js';
import { buildSky } from './gfx/sky.js';
import { KartView } from './gfx/karts3d.js';
import { Fx } from './gfx/fx.js';
import { TIERS, pickTier, Governor } from './gfx/tiers.js';
import { ChaseCam } from './gfx/camera.js';
import { loadPackTextures } from './gfx/textures.js';
import { loadModel, cloneModel, hasModel } from './gfx/models.js';
import { Track } from './sim/track.js';
import { makeRace, stepRace, DT } from './sim/race.js';
import { makeRecorder, record, packGhost, unpackGhost, ghostPose } from './sim/ghost.js';
import { makeHeat, makeBracket, awards, BADGE_TEAMS } from './sim/rules-real.js';
import { makeBattle } from './sim/battle.js';
import { makeRng } from './rng.js';
import { trackData, TRACK_BY_ID, TRACKS, builtIds } from './data/tracks.js';
import { CUP_BY_ID } from './data/cups.js';
import { TEAMS } from './data/teams.js';
import { initInput, initTouch, pollGamepads, readIntent, consumeMenu, consumePause, I as INPUT } from './ui/input.js';
import { Hud } from './ui/hud.js';
import { Screens } from './ui/screens.js';
import { loadSave, writeSave } from './save.js';
import { initAudio, setAudio, sfx, tubLoop, playTheme, audioState } from './ui/audio.js';
import { installHooks } from './hooks.js';

export const App = {
  scene: 'boot', save: null, renderer: null, cam: null, hud: null, screens: null,
  track: null, world: null, sky: null, views: [], race: null, raceOpts: null,
  paused: false, testPaused: false, acc: 0, time: 0, last: 0, loading: 0, prev: [], held: null,
  reducedMotion: false, steps: 0, ready: false, lookBack: false,
};

const $ = (s) => document.querySelector(s);

// Classic-script loader: three.js and the asset packs are plain scripts so they also load from file://
// (ES-module imports and fetch() of local files do not). Paths are relative to the built index.html.
export function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.async = false;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('could not load ' + src));
    document.head.appendChild(s);
  });
}

async function boot() {
  App.save = loadSave();
  App.loading++;
  await loadScript('vendor/three-r186.min.js');
  await loadScript('assets/pack-core.js');
  await loadScript('assets/tracks.js');
  App.loading--;
  const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  App.reducedMotion = App.save.settings.reducedMotion ?? (mq ? mq.matches : false);
  INPUT.autoPush = !!App.save.settings.autoPush;
  App.loading++;
  await loadPackTextures();
  App.tier = pickTier(App.save.settings.quality);
  App.governor = new Governor(App.tier, (App.save.settings.quality || 'auto') === 'auto');
  App.renderer = new Renderer($('#gl'), { mode: App.save.settings.res, antialias: TIERS[App.tier].aa });
  App.renderer.resize(true);
  App.cam = new ChaseCam(App.renderer.camera);
  App.fx = new Fx(window.THREE, App.renderer.scene);
  App.frameEvents = [];
  App.hud = new Hud($('#hud'));
  App.screens = new Screens($('#screens'), { save: App.save, onMenu });
  App.screens.app = { save: App.save, onMenu };
  initInput(onKey);
  initAudio(App.save.settings);
  App.audioState = audioState;
  initTouch($('#touch-steer'), { push: $('#t-push'), brake: $('#t-brake'), hop: $('#t-hop'), item: $('#t-item') });
  window.addEventListener('resize', () => App.renderer.resize());
  installHooks(App, { startRace, gotoTitle, setScene, stepOnce });
  // the title screen sits over a slow flyover of the first course
  await ensureTrack(builtIds()[0] || 'bathhouse-row');
  loadCourse(builtIds()[0] || 'bathhouse-row');
  gotoTitle();
  App.loading--;
  App.ready = true;
  requestAnimationFrame(frame);
}

function onKey(e) {
  if (App.scene === 'race' && (e.code === 'Escape' || e.code === 'KeyP') && !e.repeat) { togglePause(); return true; }
  return false;
}

// Course packs (and the texture/model packs they use) load on demand as classic scripts.
const loadedPacks = new Set();
async function ensurePack(name) {
  if (loadedPacks.has(name)) return;
  await loadScript(`assets/${name}.js`);
  loadedPacks.add(name);
}
export async function ensureTrack(id) {
  App.loading++;
  try {
    if (!trackData(id)) await ensurePack('track-' + id);
    const t = TRACK_BY_ID[id] || {};
    if (t.tex) await ensurePack('pack-' + t.tex);
    if (t.tex2) await ensurePack('pack-' + t.tex2);
    for (const m of [].concat(t.models || [])) await ensurePack('models-' + m);
    await loadPackTextures();
  } finally { App.loading--; }
}

export function loadCourse(id) {
  if (App.track && App.track.id === id) return App.track;
  const json = trackData(id);
  if (!json) throw new Error('track data missing: ' + id);
  const THREE = window.THREE;
  if (App.world) { App.renderer.scene.remove(App.world); disposeTree(App.world); }
  if (App.sky) { App.renderer.scene.remove(App.sky); disposeTree(App.sky); }
  App.track = new Track(json);
  const T = TIERS[App.tier];
  const env = { ...(json.env || {}), boards: T.boards };
  if (env.fog) env.fog = [Math.min(env.fog[0], T.fogFar * 0.4), Math.min(env.fog[1], T.fogFar)];
  App.renderer.setEnv(env);
  App.world = buildTrackWorld(THREE, App.track, env);
  App.sky = buildSky(THREE, env);
  App.renderer.scene.add(App.sky);
  App.renderer.scene.add(App.world);
  App.hud.setTrack(App.track);
  placeLandmarks(App.track, App.world);
  return App.track;
}

// Hero landmarks (Blender models) stand beside the road with their facade (+Z) facing it.
function placeLandmarks(track, world) {
  for (const lm of track.json.landmarks || []) {
    if (!hasModel(lm.model)) continue;
    App.loading++;
    loadModel(lm.model, { facades: lm.facades }).then((tpl) => {
      if (App.world !== world) return;
      const s = lm.s ?? lm.at * track.length, side = lm.side || Math.sign(lm.d) || 1;
      const c = track.at(s), edge = side > 0 ? c.wr : c.wl;
      // anchors are building centroids; the model's origin is its front wall, so step forward half its depth
      if (tpl.userData.depth == null) { const bb = new window.THREE.Box3().setFromObject(tpl); tpl.userData.depth = Math.max(0, -bb.min.z); }
      const front = lm.d != null ? Math.abs(lm.d) - tpl.userData.depth / 2 : edge + (lm.setback ?? 10);
      const d = side * Math.max(front, edge + (lm.minGap ?? 6));
      const p = track.point(s, d);
      const yaw = Math.atan2(side * c.tz, -side * c.tx) + (lm.yaw || 0);
      const g = cloneModel(tpl, p.x, track.heightAt(c, side * edge) + (lm.dy || 0), p.z, yaw, lm.scale || 1);
      g.name = 'landmark:' + lm.id;
      world.add(g);
    }).catch((e) => console.warn(e.message)).finally(() => { App.loading--; });
  }
}

function disposeTree(o) { o.traverse((n) => { if (n.geometry) n.geometry.dispose(); }); }

function clearKarts() {
  for (const v of App.views) { App.renderer.scene.remove(v.mesh); App.renderer.scene.remove(v.shadow); v.geo.dispose(); }
  App.views = [];
}

// opts: { track, team, classId, laps, seed, mode, noItems, paused, autoplay }
export async function startRace(opts = {}) {
  const o = { track: 'bathhouse-row', team: App.save.lastTeam, classId: App.save.lastClass, laps: 3, seed: (Math.random() * 1e9) | 0, mode: 'quick', ...opts };
  if (window.__TEST__ && opts.seed == null) o.seed = 7;
  App.raceOpts = o;
  setPreview(null);
  await ensureTrack(o.track);
  const track = loadCourse(o.track);
  clearKarts();
  const count = o.mode === 'timetrial' ? 1 : (o.count ?? 8);
  if (o.mode === 'battle') App.race = makeBattle(track, { human: o.team, seed: o.seed, classId: o.classId, autoplay: o.autoplay, count: o.count });
  else if (o.mode === 'row') App.race = makeHeat(track, { teams: o.heatTeams, human: o.team, seed: o.seed, stops: o.stops, label: o.label, autoplay: o.autoplay, classId: o.classId });
  else App.race = makeRace(track, { laps: o.laps, classId: o.classId, player: o.team, seed: o.seed, mode: o.mode, noItems: o.noItems ?? o.mode === 'timetrial', count, autoplay: o.autoplay, rivals: o.rivals });
  App.views = App.race.karts.map((k) => {
    const v = new KartView(window.THREE, k.team);
    App.renderer.scene.add(v.shadow);
    App.renderer.scene.add(v.mesh);
    return v;
  });
  App.prev = App.race.karts.map(poseOf);
  App.fx.setRace(App.race, track); App.fx.clear(); App.frameEvents.length = 0;
  // Time Trial: record this run; race the saved best as a see-through ghost
  if (App.ghostView) { App.renderer.scene.remove(App.ghostView.mesh); App.ghostView.geo.dispose(); App.ghostView = null; }
  App.rec = null; App.ghost = null; App.newRecord = false;
  if (o.mode === 'timetrial') {
    App.rec = makeRecorder();
    const g = App.save.ghosts[o.track];
    if (g) {
      try { App.ghost = unpackGhost(g); App.ghostView = new KartView(window.THREE, g.team, { ghost: true }); App.renderer.scene.add(App.ghostView.mesh); } catch (e) { App.ghost = null; }
    }
  }
  App.cam.snap();
  App.acc = 0;
  App.paused = false;
  App.testPaused = !!o.paused;
  setScene('race');
  App.screens.hide();
  playTheme(o.mode === 'row' || o.mode === 'battle' ? 'march' : (trackData(o.track) || {}).env?.music || ((TRACK_BY_ID[o.track] || {}).cup === 'ouachita' ? 'grass' : 'rag'));
  document.body.classList.add('racing');
  App.hud.root.classList.add('on');
  App.hud.last = {};
  return App.race;
}

function poseOf(k) { return { x: k.x, y: k.y, z: k.z, yaw: k.yaw }; }

function setScene(name) { App.scene = name; document.body.dataset.scene = name; }

function gotoTitle() {
  clearKarts();
  App.race = null;
  App.paused = false;
  setScene('title');
  document.body.classList.remove('racing');
  App.hud.root.classList.remove('on');
  App.screens.show('title');
  playTheme('rag');
}

function togglePause(force) {
  if (App.scene !== 'race' || !App.race || App.race.phase === 'done') return;
  App.paused = force ?? !App.paused;
  if (App.paused) App.screens.show('pause'); else App.screens.hide();
}

// courses that are built (data present) in registry order, with card info
function builtCourses() {
  return TRACKS.filter((t) => builtIds().includes(t.id) && !t.arena).map((t) => ({ id: t.id, name: t.name, length: (window.TR_LENGTHS || {})[t.id] || 0, blurb: t.blurb || '', cup: t.cup }));
}

// Menu flow: mode → team → class → cup/course → race. App.flow remembers the choices on the way.
function onMenu(act, data) {
  const s = App.save;
  const F = App.flow || (App.flow = {});
  switch (act) {
    case 'battle':
      App.flow = { mode: 'battle', team: s.lastTeam, classId: s.lastClass };
      showTeams(s.lastTeam);
      break;
    case 'row':
      App.flow = { mode: 'row', team: s.lastTeam, classId: s.lastClass };
      showTeams(s.lastTeam);
      break;
    case 'rowStart': {
      const pair = App.row.bracket.semis.find((p) => p.includes(F.team));
      startRace({ mode: 'row', track: 'bathhouse-row', team: F.team, heatTeams: pair, label: 'Semifinal', classId: F.classId });
      break;
    }
    case 'badge': {
      const me = BADGE_TEAMS.includes(F.team) ? F.team : 'engine-six';
      startRace({ mode: 'row', track: 'bathhouse-row', team: me, heatTeams: BADGE_TEAMS, stops: false, label: 'Battle of the Badge', exhibition: true, classId: F.classId });
      break;
    }
    case 'rowIntroBack': App.screens.show('rowIntro', { team: F.team, bracket: App.row.bracket }); break;
    case 'rowFinal': startRace({ mode: 'row', track: 'bathhouse-row', team: F.team, heatTeams: App.row.bracket.final, label: 'Final', classId: F.classId }); break;
    case 'rowAwards': showRowAwards(); break;
    case 'gp': case 'quick': case 'timetrial':
      App.flow = { mode: act, team: s.lastTeam, classId: s.lastClass };
      showTeams(s.lastTeam);
      break;
    case 'team': showTeams(data.id); break;
    case 'teamOk':
      s.lastTeam = F.team; writeSave(s);
      if (F.mode === 'battle') { setPreview(null); startRace({ mode: 'battle', track: 'hill-wheatley', team: F.team, classId: F.classId }); break; }
      if (F.mode === 'row') {
        App.row = { bracket: makeBracket(TEAMS.find((t) => t.id === F.team).div, F.team, makeRng((Math.random() * 1e9) | 0)), heats: [] };
        ensureTrack('bathhouse-row').then(() => { loadCourse('bathhouse-row'); App.screens.show('rowIntro', { team: F.team, bracket: App.row.bracket }); });
        break;
      }
      if (F.mode === 'timetrial') App.screens.show('courses', { list: builtCourses() });
      else App.screens.show('classes');
      break;
    case 'cls':
      F.classId = data.id; s.lastClass = data.id; writeSave(s);
      if (F.mode === 'gp') App.screens.show('cups', { built: builtCourses().map((c) => c.id) });
      else App.screens.show('courses', { list: builtCourses() });
      break;
    case 'cup': {
      const cup = CUP_BY_ID[data.id];
      const tracks = cup.tracks.filter((id) => builtIds().includes(id));
      App.gp = { cup: cup.id, name: cup.name, tracks, round: 0, table: {} };
      setPreview(null);
      startRace({ mode: 'gp', track: tracks[0], team: F.team, classId: F.classId, seed: (Math.random() * 1e9) | 0 });
      break;
    }
    case 'course':
      setPreview(null);
      startRace({ mode: F.mode === 'timetrial' ? 'timetrial' : 'quick', count: F.mode === 'timetrial' ? 1 : 8, track: data.id, team: F.team, classId: F.mode === 'timetrial' ? 'scald' : F.classId });
      break;
    case 'nextRace': {
      const g = App.gp;
      g.round++;
      startRace({ mode: 'gp', track: g.tracks[g.round], team: App.raceOpts.team, classId: App.raceOpts.classId, seed: App.raceOpts.seed + 17, rivals: g.rivals });
      break;
    }
    case 'standingsGo': showStandings(); break;
    case 'trophy': showTrophy(); break;
    case 'locked': App.hud.flash('Locked for now', 'lap', 1); break;
    case 'help': App.screens.show('help'); break;
    case 'credits': App.screens.show('credits'); break;
    case 'settings': App.prevScreen = App.screens.cur; App.screens.show('settings'); break;
    case 'back':
      if (App.scene === 'race' && App.paused) App.screens.show('pause');
      else { setPreview(null); App.screens.show('title'); }
      break;
    case 'resume': togglePause(false); break;
    case 'restart': startRace({ ...App.raceOpts, seed: App.raceOpts.seed + 1 }); break;
    case 'quit': App.gp = null; gotoTitle(); break;
    case 'set': {
      let v = data.v;
      if (v === 'true') v = true; else if (v === 'false') v = false;
      s.settings[data.k] = v;
      if (data.k === 'res') App.renderer.setMode(v);
      if (data.k === 'autoPush') INPUT.autoPush = v;
      if (data.k === 'reducedMotion') App.reducedMotion = v;
      if (data.k === 'sound' || data.k === 'music') setAudio(s.settings);
      writeSave(s);
      App.screens.show('settings');
      break;
    }
    default: break;
  }
}

// Rules of the Row: run an AI-only heat instantly (same sim, no rendering)
function simulateHeat(teams, label) {
  const h = makeHeat(App.track, { teams, human: null, seed: (Math.random() * 1e9) | 0, label });
  for (let i = 0; i < 60 * 130 && h.phase !== 'done'; i++) stepRace(h, App.track, [], DT);
  return h;
}
function heatWinner(h) { const w = h.results.find((r) => !r.dq); return w ? w.team : null; }
function onHeatDone(r) {
  if (!App.flow || App.flow.mode !== 'row') App.flow = { mode: 'row', team: App.raceOpts.team, classId: r.classId };
  if (!App.row) App.row = { bracket: makeBracket(TEAMS.find((t) => t.id === App.flow.team).div, App.flow.team, makeRng(r.seed)), heats: [] };
  const R = App.row, label = r.row.label;
  const me = r.results.find((x) => x.human);
  if (label === 'Battle of the Badge') {
    App.screens.show('rowResult', { results: r.results, title: 'BATTLE OF THE BADGE', msg: 'Exhibition heat: fire, police and sheriff teams, no judge stops.', next: { act: 'rowIntroBack', label: 'Back to the bracket' } });
    return;
  }
  R.heats.push(r);
  if (label === 'Semifinal') {
    const other = R.bracket.semis.find((p) => !p.includes(App.flow.team));
    const oh = simulateHeat(other, 'Semifinal');
    R.heats.push(oh);
    const myWin = me && me.place === 1 && !me.dq;
    R.bracket.final = [heatWinner(r), heatWinner(oh)].filter(Boolean);
    const msg = myWin ? `You won your heat! ${oh.results[0] ? 'The other semifinal went to ' + teamName(heatWinner(oh)) + '.' : ''}` : me && me.dq ? `Disqualified: ${me.dq}.` : 'Out in the semifinal.';
    App.screens.show('rowResult', { results: r.results, title: myWin ? 'INTO THE FINAL!' : 'SEMIFINAL', msg, next: myWin ? { act: 'rowFinal', label: 'Race the final' } : { act: 'rowAwards', label: 'Final and awards' } });
  } else {
    R.bracket.champion = heatWinner(r);
    const won = me && me.place === 1 && !me.dq;
    App.screens.show('rowResult', { results: r.results, title: won ? 'DIVISION CHAMPS!' : 'FINAL', msg: won ? 'You win the Division Cup!' : me && me.dq ? `Disqualified: ${me.dq}.` : `${teamName(R.bracket.champion)} take the Division Cup.`, next: { act: 'rowAwards', label: 'Awards ceremony' } });
  }
}
function teamName(id) { const t = TEAMS.find((x) => x.id === id); return t ? t.name : '–'; }
function showRowAwards() {
  const R = App.row;
  if (!R.bracket.champion) {
    if (R.bracket.final && R.bracket.final.length === 2 && !R.bracket.final.includes(App.flow.team)) { const fh = simulateHeat(R.bracket.final, 'Final'); R.heats.push(fh); R.bracket.champion = heatWinner(fh); }
    else if (R.bracket.final && R.bracket.final.length === 1) R.bracket.champion = R.bracket.final[0];
  }
  App.screens.show('awards', { a: awards(R.heats, makeRng((Math.random() * 1e9) | 0)), champion: R.bracket.champion, division: R.bracket.division });
}

function showTeams(id) {
  (App.flow || (App.flow = {})).team = id;
  App.screens.show('teams', { sel: id });
  setPreview(id);
}

// Team preview: the chosen tub turns slowly on the road in front of the title camera.
function setPreview(teamId) {
  if (App.preview && App.preview.team === teamId) return;
  if (App.preview) { App.renderer.scene.remove(App.preview.view.mesh); App.renderer.scene.remove(App.preview.view.shadow); App.preview.view.geo.dispose(); App.preview = null; }
  if (!teamId) return;
  const view = new KartView(window.THREE, teamId);
  App.renderer.scene.add(view.mesh); App.renderer.scene.add(view.shadow);
  App.preview = { team: teamId, view, k: { id: 0, vf: 0, yawRate: 0, drift: 0, steer: 0, boostT: 0, air: false, state: 'run', items: { towel: true, mat: true, soap: true, loofah: true }, runPhase: 0, water: { gal: 38, cap: 38, tf: 0, tr: 0 } } };
}

// Grand Prix bookkeeping after each race: add points, then show standings (or the trophy after the last race)
function recordGp(r) {
  const g = App.gp;
  if (!g || g.recorded === g.round) return;
  g.recorded = g.round;
  g.rivals = g.rivals || r.karts.filter((k) => !k.human).map((k) => k.team);
  for (const res of r.results) {
    const row = g.table[res.team] || (g.table[res.team] = { team: res.team, points: 0, clean: 0, human: res.human, bribes: 0 });
    row.points += res.points; row.clean += res.clean ? 1 : 0; row.bribes += res.tickets || 0;
  }
}
function gpRows() {
  return Object.values(App.gp.table).sort((a, b) => b.points - a.points || b.bribes - a.bribes);
}
function showStandings() {
  const g = App.gp, final = g.round >= g.tracks.length - 1;
  App.screens.show('standings', { rows: gpRows(), round: g.round + 1, rounds: g.tracks.length, cupName: g.name, final });
}
function showTrophy() {
  const g = App.gp, rows = gpRows(), place = rows.findIndex((r) => r.human) + 1, s = App.save;
  const key = g.cup + ':' + App.raceOpts.classId;
  if (!s.cups[key] || place < s.cups[key]) s.cups[key] = place;
  let unlockedTeam = null;
  if (place === 1) {
    const locked = TEAMS.filter((t) => !t.unlocked && !s.unlocked.teams.includes(t.id));
    if (locked.length) { unlockedTeam = locked[0].id; s.unlocked.teams.push(unlockedTeam); }
    if (App.raceOpts.classId === 'soak' && !s.unlocked.classes.includes('scald')) s.unlocked.classes.push('scald');
  }
  writeSave(s);
  App.screens.show('trophy', { place, cupName: g.name, unlockedTeam });
  App.gp = null;
}

// One fixed simulation tick for the current race.
function stepOnce() {
  const r = App.race;
  if (!r) return;
  App.prev = r.karts.map(poseOf);
  const inputs = [];
  if (r.player >= 0) inputs[r.player] = App.held ? { ...App.held } : readIntent();
  stepRace(r, App.track, inputs, DT);
  App.steps++;
  if (App.rec && r.phase === 'race' && r.player >= 0 && !r.karts[r.player].finished) record(App.rec, r.karts[r.player], r.time);
  // HUD call-outs and camera shake from sim events; effects get every kart's events for this frame
  for (const kk of r.karts) for (const e of kk.events) App.frameEvents.push({ k: kk, e });
  const me = r.player >= 0 ? r.karts[r.player] : null;
  // countdown beeps
  const tPrev = r.time - DT;
  if (r.phase === 'countdown' || (r.phase === 'race' && r.time < DT * 1.5)) {
    if (tPrev < -2.1 && r.time >= -2.1) sfx('ready');
    if (tPrev < -1.0 && r.time >= -1.0) sfx('ready');
    if (r.phase === 'race' && r.time <= DT * 1.01) sfx('go');
  }
  if (me) for (const e of me.events) {
    const snd = { boost: 'boost', fumble: 'hit', wall: 'bump', bump: 'bump', pickup: 'pickup', ticket: 'ticket', bribe: 'whistle', judge: 'whistle', taskDone: 'cheer', blocked: 'snap', drained: 'splash' }[e.type];
    if (snd) sfx(snd, e.type === 'drained');
    if (e.type === 'use') sfx({ duck: 'quack', towel: 'snap', blaster: 'splash', hose: 'splash', jet: 'steam', jet3: 'steam', bubble: 'pickup' }[e.item] || 'menu');
    if (e.type === 'boost') App.hud.flash(e.kind === 'hot' ? 'HOT STEAM!' : e.kind === 'start' ? 'GREAT START!' : 'WARM STEAM', 'boost', 1);
    else if (e.type === 'fumble') { App.hud.flash('Dropped the ' + (e.item || 'item') + '! Circle the tub!', 'bad', 1.6); App.cam.shake = 0.8; App.views[me.id].flash = 1; }
    else if (e.type === 'wall' && e.v > 7) App.cam.shake = Math.min(1, e.v / 14);
    else if (e.type === 'land' && e.v > 7) App.cam.shake = 0.4;
    else if (e.type === 'fall') App.hud.flash('Over the edge! The refs will tow you back', 'bad', 2);
    else if (e.type === 'bribe') App.hud.flash('Bribe accepted: HEAD START!', 'boost', 1.4);
    else if (e.type === 'blocked') App.hud.flash('Blocked by your loofah!', 'lap', 1);
    else if (e.type === 'scored') App.hud.flash('Splash! Got one!', 'lap', 0.9);
    else if (e.type === 'sprayed') App.hud.flash('Getting soaked!', 'bad', 0.8);
  }
  for (const e of r.events) {
    if (me && e.kart === me.id && e.type === 'lap') sfx(e.lap > r.laps ? 'finish' : 'lap');
    if (me && e.kart === me.id && e.type === 'lap') App.hud.flash(e.lap === r.laps ? 'FINAL LAP!' : e.lap > r.laps ? 'FINISH!' : `LAP ${e.lap}`, 'lap', 1.4);
  }
  if (me && me.water.gal <= 0.01 && !App._dryShown) { App.hud.flash('BONE DRY!', 'bad', 1.4); App._dryShown = true; }
  if (me && me.water.gal > 1) App._dryShown = false;
  if (r.phase === 'done' && !App._resultsShown) {
    App._resultsShown = true;
    const st = App.save.stats; st.races++; if (r.results[0] && r.results[0].human) st.wins++;
    const me = r.player >= 0 ? r.karts[r.player] : null;
    if (me && me.finished && r.mode !== 'row' && r.mode !== 'battle') {
      const tid = App.track.id, best = App.save.best[tid];
      const lap = me.lapTimes.length ? Math.min(...me.lapTimes.slice(1).concat(me.lapTimes.length === 1 ? me.lapTimes : [])) : null;
      if (!best || me.finishT < best.race) {
        App.save.best[tid] = { race: +me.finishT.toFixed(3), lap: lap ? +lap.toFixed(3) : null, team: me.team, cls: r.classId };
        if (App.rec && App.rec.t.length > 10) App.save.ghosts[tid] = packGhost(App.rec, { team: me.team, total: +me.finishT.toFixed(3) });
        App.newRecord = !!best || r.mode === 'timetrial';
      }
    }
    writeSave(App.save);
    if (r.mode === 'gp') recordGp(r);
    if (r.mode === 'row') { setTimeout(() => { if (App.race === r) onHeatDone(r); }, window.__TEST__ ? 0 : 1200); return; }
    setTimeout(() => { if (App.race === r) App.screens.show('results', { results: r.results, laps: r.laps, trackName: App.track.name, gp: r.mode === 'gp', newRecord: App.newRecord, mode: r.mode }); }, window.__TEST__ ? 0 : 1500);
  }
  if (r.phase !== 'done') App._resultsShown = false;
}

function frame(t) {
  requestAnimationFrame(frame);
  const now = t / 1000;
  let dt = App.last ? now - App.last : 0;
  App.last = now;
  dt = Math.min(0.25, Math.max(0, dt));
  App.time += dt;
  pollGamepads();
  const m = consumeMenu();
  if (consumePause() && App.scene === 'race') togglePause();
  if (App.screens.cur) App.screens.nav(m);
  const r = App.race;
  if (App.scene === 'race' && r) {
    if (!App.paused && !App.testPaused) {
      App.acc += dt;
      let n = 0;
      while (App.acc >= DT && n < 15) { stepOnce(); App.acc -= DT; n++; }
      if (n === 15) App.acc = 0;
    }
    const alpha = App.paused || App.testPaused ? 1 : App.acc / DT;
    drawRace(r, alpha, dt);
    tubLoop(r.player >= 0 ? r.karts[r.player] : null, dt, !App.paused && !App.testPaused && r.phase !== 'done');
    const down = App.governor.frame(dt, !App.paused && !App.testPaused);
    if (down) { App.tier = down; const env = App.track.json.env || {}; App.renderer.setEnv({ ...env, fog: env.fog ? [Math.min(env.fog[0], TIERS[down].fogFar * 0.4), Math.min(env.fog[1], TIERS[down].fogFar)] : undefined }); }
  } else {
    tubLoop(null, dt, false);
    drawAttract(dt);
  }
  App.renderer.render(App.time);
}

function lerpAngle(a, b, t) { const d = Math.atan2(Math.sin(b - a), Math.cos(b - a)); return a + d * t; }

function drawRace(r, alpha, dt) {
  const tr = App.track;
  r.karts.forEach((k, i) => {
    const p = App.prev[i] || k;
    const pose = { x: p.x + (k.x - p.x) * alpha, y: p.y + (k.y - p.y) * alpha, z: p.z + (k.z - p.z) * alpha, yaw: lerpAngle(p.yaw, k.yaw, alpha) };
    pose.groundY = tr.surface(pose.x, pose.z, k.s).h;
    App.views[i].update(k, pose, App.paused ? 0 : dt, App.time);
    if (i === r.player || (r.player < 0 && i === 0)) App.camPose = { k, pose };
  });
  if (App.ghost && App.ghostView) {
    const gp = ghostPose(App.ghost, r.time);
    App.ghostView.mesh.visible = !!gp;
    if (gp) {
      gp.groundY = gp.y;
      const gk = App._ghostK || (App._ghostK = { id: 99, vf: 16, yawRate: 0, drift: 0, steer: 0, boostT: 0, air: false, state: 'run', items: { towel: true, mat: true, soap: true, loofah: true }, runPhase: 0, water: { gal: 30, cap: 38, tf: 0, tr: 0 } });
      gk.runPhase = r.time * 9;
      App.ghostView.update(gk, gp, dt, App.time);
      App.ghostView.shadow.visible = false;
    }
  }
  const lookBack = INPUT.back || (INPUT.pad && INPUT.pad.back);
  if (App.camPose) {
    App.cam.update(App.camPose.k, App.camPose.pose, dt || 1 / 60, {
      lookBack, time: App.time, reducedMotion: App.reducedMotion, baseFov: App.renderer.baseFov, portrait: App.renderer.size.h > App.renderer.size.w,
      groundAt: (x, z) => tr.surface(x, z, App.camPose.k.s).h,
    });
  }
  // Parade of Tubs: during READY the camera sweeps from in front of the grid back to the chase view
  if (r.phase === 'countdown' && App.camPose && !App.reducedMotion && !window.__TEST__) {
    const t = r.time + 3.2, f = Math.min(1, t / 1.8), e = f * f * (3 - 2 * f);
    if (f < 1) {
      const k = App.camPose.k, c = tr.at(k.s + 22), cam = App.renderer.camera;
      const ix = c.x - c.tz * 9, iz = c.z + c.tx * 9, iy = c.y + 6;
      cam.position.set(ix + (cam.position.x - ix) * e, iy + (cam.position.y - iy) * e, iz + (cam.position.z - iz) * e);
      const lx = k.x + (Math.sin(k.yaw) * 6) * e, lz = k.z + (Math.cos(k.yaw) * 6) * e;
      cam.lookAt(lx, k.y + 1, lz);
    }
  }
  if (App.camOverride) {
    const o = App.camOverride, cam = App.renderer.camera;
    cam.position.set(o.pos[0], o.pos[1], o.pos[2]);
    cam.lookAt(o.target[0], o.target[1], o.target[2]);
  }
  App.fx.setScale(App.renderer.size.h);
  App.fx.update(r, tr, App.paused || App.testPaused ? 0 : dt, App.time, App.reducedMotion, App.frameEvents);
  App.frameEvents.length = 0;
  if (App.sky) App.sky.position.copy(App.renderer.camera.position).setY(0);
  App.hud.update(r, tr, r.player >= 0 ? r.karts[r.player] : null, dt);
}

// Title/attract: a slow camera glide along the course
function drawAttract(dt) {
  const tr = App.track;
  if (!tr) return;
  const reduce = App.reducedMotion || window.__TEST__;
  const s = ((reduce ? 40 : App.time * 9) + 30) % tr.length;
  const c = tr.at(s), ahead = tr.at(s + 28);
  const cam = App.renderer.camera;
  cam.position.set(c.x - c.tz * 6, c.y + 7, c.z + c.tx * 6);
  cam.lookAt(ahead.x, ahead.y + 2, ahead.z);
  if (App.preview) {
    // the chosen team's tub, turning on the road in front of the camera
    const ps = s + 11, pc = tr.at(ps), pp = tr.point(ps, 1.2);
    const pose = { x: pp.x, y: pp.y, z: pp.z, yaw: App.time * 0.7, groundY: pp.y };
    App.preview.k.runPhase = App.time * 3;
    App.preview.view.update(App.preview.k, pose, dt, App.time);
    cam.position.set(pc.x - pc.tz * 3.2 - pc.tx * 5.5, pc.y + 2.6, pc.z + pc.tx * 3.2 - pc.tz * 5.5);
    // on wide screens the menu panel sits on the left, so aim left of the tub to show it on the right
    const wide = App.renderer.size.w / App.renderer.size.h > 1.3 ? 1 : 0;
    const lx = -(pp.z - cam.position.z), lz = pp.x - cam.position.x, ll = Math.hypot(lx, lz) || 1;
    cam.lookAt(pp.x + (lx / ll) * 2.6 * wide, pp.y + 0.9, pp.z + (lz / ll) * 2.6 * wide);
  }
  if (cam.fov !== App.renderer.baseFov) { cam.fov = App.renderer.baseFov; cam.updateProjectionMatrix(); }
  if (App.sky) App.sky.position.copy(cam.position).setY(0);
}

boot().catch((e) => { console.error(e); const el = document.querySelector('#boot-error'); if (el) { el.textContent = 'Could not start: ' + e.message; el.hidden = false; } });
