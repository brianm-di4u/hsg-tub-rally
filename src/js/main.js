// Spa City Tub Rally: boot, scene flow, the fixed-step race loop and rendering.
// Fixed 60 Hz simulation with an accumulator (pattern after hsg-fishing/src/js/main.js, Hot Springs Games, MIT);
// the renderer draws between the last two sim states. Test hooks live in hooks.js.
import { Renderer } from './gfx/renderer.js';
import { buildTrackWorld } from './gfx/trackmesh.js';
import { buildSky } from './gfx/sky.js';
import { clearAround } from './gfx/bricktrees.js';
import { KartView, setCrewDetail, FootBlobs } from './gfx/karts3d.js';
import { Fx } from './gfx/fx.js';
import { TIERS, pickTier, Governor } from './gfx/tiers.js';
import { ChaseCam } from './gfx/camera.js';
import { SunShadow } from './gfx/shadows.js';
import { loadCrew } from './gfx/crew3d.js';
import { setShadowDefault, setLite, setAlphaCoverage, setBevel, setFocus } from './gfx/brickmat.js';
import { labKartGeo, labCrowd, labStats } from './gfx/perflab.js';
import { loadPackTextures } from './gfx/textures.js';
import { loadModel, cloneModel, hasModel } from './gfx/models.js';
import { Track } from './sim/track.js';
import { landmarkPose } from './sim/landmarks.js';
import { makeRace, stepRace, DT } from './sim/race.js';
import { assistSteer } from './sim/ai.js';
import { makeRecorder, record, packGhost, unpackGhost, unpackPar, ghostPose } from './sim/ghost.js';
import { parOf, medalTimes, medalFor, PAR_LAPS } from './sim/medals.js';
import { makeHeat, makeBracket, awards, BADGE_TEAMS } from './sim/rules-real.js';
import { makeBattle } from './sim/battle.js';
import { makeRng } from './rng.js';
import { trackData, TRACK_BY_ID, TRACKS, builtIds } from './data/tracks.js';
import { CUP_BY_ID } from './data/cups.js';
import { TEAMS, TEAM_BY_ID, CLASSES } from './data/teams.js';
import { initInput, initTouch, pollGamepads, readIntent, consumeMenu, consumePause, setBindings, getBindings, I as INPUT } from './ui/input.js';
import { Hud } from './ui/hud.js';
import { Screens } from './ui/screens.js';
import { loadSave, writeSave, resetSave, saveProblem, saveGrandfathered, storeCup, loadCup, clearCup } from './save.js';
import { initAudio, setAudio, sfx, tubLoop, rivalLoop, rivalEvent, setListener, USE_CUE, playTheme, playScene, setIntensity, audioState, setMuffle, suspendAudio, resumeAudio } from './ui/audio.js';
import { dateKey, dailyPlan, liveStreak } from './daily.js';
import { installHooks } from './hooks.js';

export const App = {
  scene: 'boot', save: null, renderer: null, cam: null, hud: null, screens: null,
  track: null, world: null, sky: null, views: [], race: null, raceOpts: null,
  paused: false, testPaused: false, acc: 0, time: 0, last: 0, loading: 0, prev: [], held: null,
  reducedMotion: false, steps: 0, ready: false, lookBack: false,
};

const $ = (s) => document.querySelector(s);

// S1-08: after Resume the race waits this long, frozen but in view, with a 3-2-1, so held keys cannot throw the tub into a corner
const RESUME_HOLD = 1.05;

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
  App.saveProblem = saveProblem();
  App.saveError = saveMessage(App.saveProblem);
  App.loading++;
  await loadScript('vendor/three-r186.min.js');
  await loadScript('assets/pack-core.js');
  await loadScript('assets/tracks.js');
  App.loading--;
  const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  App.reducedMotion = App.save.settings.reducedMotion ?? (mq ? mq.matches : false);
  applyInputSettings(App.save.settings);
  if (mq && window.matchMedia('(pointer: coarse)').matches) INPUT.last = 'touch'; // tips name buttons, not keys
  App.loading++;
  await loadPackTextures();
  // the Blender crews: optional (a missing pack or an old browser keeps the crews built in code)
  try { await loadScript('assets/crew.js'); await loadScript('assets/crew-prints.js'); await loadCrew(window.THREE); } catch (e) { console.warn(e.message); }
  App.tier = pickTier(App.save.settings.quality);
  App.governor = new Governor(App.tier, (App.save.settings.quality || 'auto') === 'auto');
  const TT = TIERS[App.tier];
  App.renderer = new Renderer($('#gl'), { mode: App.save.settings.res, antialias: TT.aa, dprCap: TT.dprCap, ao: !!TT.ao });
  // sun shadows on the tiers that afford them: every brick material made from here on samples the map
  setShadowDefault(!!TT.shadow);
  setLite(App.tier === 'low');
  setAlphaCoverage(!!TT.aa); setBevel(App.tier !== 'low');
  if (TT.shadow) App.renderer.shadow = App.shadow = new SunShadow(window.THREE, TT.shadow, TT.shadowR);
  App.renderer.resize(true);
  App.cam = new ChaseCam(App.renderer.camera);
  setCrewDetail(App.tier, App.renderer.camera);
  App.footBlobs = new FootBlobs(window.THREE);
  App.renderer.scene.add(App.footBlobs.mesh);
  SHADOW_DIR = new window.THREE.Vector3();
  App.fx = new Fx(window.THREE, App.renderer.scene);
  App.frameEvents = [];
  App.hud = new Hud($('#hud'));
  App.screens = new Screens($('#screens'), { save: App.save, onMenu });
  App.screens.app = { save: App.save, onMenu, cup: savedCup() };
  initInput(onKey);
  initAudio(App.save.settings);
  App.audioState = audioState;
  initTouch($('#touch-steer'), { push: $('#t-push'), brake: $('#t-brake'), hop: $('#t-hop'), item: $('#t-item') });
  $('#t-pause').addEventListener('click', () => togglePause(true));
  window.addEventListener('resize', () => App.renderer.resize());
  // three.js re-creates its own resources after a lost context; the app tells the player and refits its render targets
  $('#gl').addEventListener('webglcontextlost', (e) => { e.preventDefault(); App.glLost = true; showGlNotice('Graphics were interrupted. Waiting for the browser to restore them...'); });
  $('#gl').addEventListener('webglcontextrestored', () => { App.glLost = false; App.renderer.resize(true); showGlNotice(''); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) onAway(); else onBack(); });
  window.addEventListener('pagehide', onAway);
  window.addEventListener('pageshow', onBack);
  window.addEventListener('blur', pauseRace);
  installHooks(App, { startRace, gotoTitle, setScene, stepOnce, kartEvents, audioFrame, onMenu, perfLab, labStats: () => labStats(window.THREE) });
  window.TR_APP = { App, KartView };
  await loadScript('assets/finale.js').catch((e) => console.warn(e.message)); // the finish ceremony and ambient motion
  // the title screen sits over a slow flyover of the first course
  // a save from before the unlock record keeps everything it had: write that record down now, once
  if (saveGrandfathered()) persistSave({});
  await ensureTrack(builtIds()[0] || 'bathhouse-row');
  loadCourse(builtIds()[0] || 'bathhouse-row');
  gotoTitle();
  App.loading--;
  App.ready = true;
  requestAnimationFrame(frame);
}

function applyInputSettings(s) {
  INPUT.autoPush = !!s.autoPush; INPUT.steerAssist = !!s.steerAssist;
  setBindings(s.keys);
  document.documentElement.style.setProperty('--hud-user', s.hudScale || 1);
}

// tips and the key screen: assets/teach.js, loaded when first needed
let teachLoad = null;
function ensureTeach() {
  if (!teachLoad) {
    App.loading++;
    teachLoad = loadScript('assets/teach.js').then(() => {
      window.TR_TEACH.api = { get: getBindings, set: setBindings, save: (keys) => persistSave({ settings: { keys } }) };
    }).catch((e) => { console.warn(e.message); }).finally(() => { App.loading--; });
  }
  return teachLoad;
}
const controlsScreen = (d = {}) => { App.capture = d.capture || null; App.screens.show('controls', d); };

function showGlNotice(text) {
  const el = $('#boot-error');
  if (!el) return;
  el.textContent = text; el.hidden = !text;
}

// What the player is told when progress cannot be kept, by cause.
function saveMessage(problem) {
  if (problem === 'damaged') return 'Your saved data is damaged and cannot be read, so changes are kept in this tab only. Use Reset saved data to start fresh; a copy of the old data is kept.';
  if (problem) return 'Saving is blocked in this browser, so changes are kept in this tab only. Allow site data for this page (or leave private browsing) and try again.';
  return '';
}

function onKey(e) {
  if (App.capture && App.screens.cur === 'controls' && window.TR_TEACH) return window.TR_TEACH.capture(e, App.capture, controlsScreen);
  if (App.scene === 'race' && e.code === 'KeyT' && !e.repeat && window.TR_TEACH) window.TR_TEACH.tipSkip();
  if (App.scene === 'race' && (e.code === 'Escape' || e.code === 'KeyP')) {
    if (!e.repeat) togglePause();
    return true;
  }
  return false;
}

// Course packs (and the texture/model packs they use) load on demand as classic scripts.
const loadedPacks = new Set();
async function ensurePack(name) {
  if (loadedPacks.has(name)) return;
  await loadScript(`assets/${name}.js`);
  loadedPacks.add(name);
}
// The par ghosts (Time Trial targets) load the first time Time Trial needs them; without them there are no medals.
let parLoad = null;
export function ensurePar() {
  if (!parLoad) { App.loading++; parLoad = loadScript('assets/par-ghosts.js').catch((e) => { console.warn(e.message); }).finally(() => { App.loading--; }); }
  return parLoad;
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
  const env = { ...(json.env || {}), boards: T.boards, kit: App.tier !== 'low' };
  if (env.fog) env.fog = [Math.min(env.fog[0], T.fogFar * 0.4), Math.min(env.fog[1], T.fogFar)];
  App.renderer.setEnv(env);
  App.world = buildTrackWorld(THREE, App.track, env);
  // Hot Springs Mountain rises right behind Bathhouse Row: a peak in the ridge ring toward the Row's bathhouses
  const row = (json.landmarks || []).filter((l) => /fordyce|quapaw|buckstaff|maurice|hale|superior|lamar|ozark/.test(l.id));
  if (row.length >= 3) {
    // the mountain lies behind the Row: the mean direction from the road out to each bathhouse
    let dx = 0, dz = 0;
    for (const l of row) { const ls = l.s ?? l.at * App.track.length, q = App.track.point(ls, l.d || 0), o = App.track.point(ls, 0), m = Math.hypot(q.x - o.x, q.z - o.z) || 1; dx += (q.x - o.x) / m; dz += (q.z - o.z) / m; }
    // a broad summit with two shoulders, so it reads as a mountain behind the Row rather than one wall
    const az = Math.atan2(dx, dz); env.peaks = [[az, 0.55, 70], [az - 0.7, 0.4, 38], [az + 0.75, 0.45, 44]];
  }
  App.sky = buildSky(THREE, env);
  // keep the sky inside the far plane (Low's shorter fog pulls the far plane in; a clipped dome shows as a disc)
  App.sky.scale.setScalar(Math.min(1, (App.renderer.camera.far - 15) / 400));
  App.renderer.scene.add(App.sky);
  App.renderer.scene.add(App.world);
  App.hud.setTrack(App.track);
  placeLandmarks(App.track, App.world);
  return App.track;
}

// Hero landmarks (Blender models) stand beside the road with their facade (+Z) facing it. Models that carry their own
// window panels skip the painted facade, whose windows would show beside them out of register.
const MODELLED_WINDOWS = new Set(['arlington']);
function placeLandmarks(track, world) {
  for (const lm of track.json.landmarks || []) {
    if (!hasModel(lm.model)) continue;
    App.loading++;
    loadModel(lm.model, { facades: MODELLED_WINDOWS.has(lm.model) ? null : lm.facades }).then((tpl) => {
      if (App.world !== world) return;
      // how far the model reaches behind its front wall and in front of it (stairs, an arcaded base)
      if (tpl.userData.depth == null) { const bb = new window.THREE.Box3().setFromObject(tpl); tpl.userData.depth = Math.max(0, -bb.min.z); tpl.userData.fwd = Math.max(0, bb.max.z); }
      const q = landmarkPose(track, lm, tpl.userData);
      const g = cloneModel(tpl, q.x, q.y, q.z, q.yaw, q.scale);
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

// Today's date key (local), or the one a test set; and the Daily Race for it
const today = () => App.dateOverride || dateKey();
const dailyToday = () => dailyPlan(today(), builtCourses().map((c) => c.id));

// Mirror: a course raced flipped left for right. The sim is untouched (so every time and ghost still counts); the picture is
// flipped, and the steering, sound panning and minimap are flipped with it. Only when the mirror unlock is earned.
const mirrorOn = () => App.save.unlocked.mirror === true && App.save.settings.mirror === true;
function setMirror(on) {
  App.mirror = !!on;
  $('#gl').style.transform = on ? 'scaleX(-1)' : '';
  App.hud.setMirror(!!on);
}

// The class the player last chose, or Soak when that class is not open to them (a hand-edited save, say).
const lastClass = () => (CLASSES[App.save.lastClass] && App.save.unlocked.classes.includes(App.save.lastClass) ? App.save.lastClass : 'soak');
// opts: { track, team, classId, laps, seed, mode, noItems, paused, autoplay }
export async function startRace(opts = {}) {
  const o = { track: 'bathhouse-row', team: App.save.lastTeam, classId: lastClass(), laps: 3, seed: (Math.random() * 1e9) | 0, mode: 'quick', ...opts };
  if (window.__TEST__ && opts.seed == null) o.seed = 7;
  o.mirror = opts.mirror ?? (o.daily ? false : mirrorOn() && o.mode !== 'battle' && o.mode !== 'row');
  App.raceOpts = o;
  setPreview(null);
  await ensureTrack(o.track);
  if (o.mode === 'timetrial') await ensurePar();
  // S2-01: first-run tips (not Row, Water Fight or autoplay)
  const tips = !App.save.settings.seenIntro && !o.autoplay && o.mode !== 'row' && o.mode !== 'battle';
  if (tips) await ensureTeach();
  const track = loadCourse(o.track);
  clearKarts();
  setMirror(o.mirror);
  // the crews (and anything else built from here) follow the current tier, so a governor step-down mid-race
  // takes full effect from the next race
  setCrewDetail(App.tier, App.renderer.camera); setLite(App.tier === 'low'); setBevel(App.tier !== 'low');
  if (App.shadow && App.tier === 'low') { App.shadow.setEnabled(false); setShadowDefault(false); }
  if (App.shadow) App.shadow.skip = TIERS[App.tier].shadowCrowd ? null : /^crowd$/; // Medium: spectators cast no sun shadow
  App.builtTier = App.tier;
  const count = o.mode === 'timetrial' ? 1 : (o.count ?? 8);
  if (o.mode === 'battle') App.race = makeBattle(track, { human: o.team, seed: o.seed, classId: o.classId, autoplay: o.autoplay, count: o.count });
  else if (o.mode === 'row') App.race = makeHeat(track, { teams: o.heatTeams, human: o.team, seed: o.seed, stops: o.stops, label: o.label, autoplay: o.autoplay, classId: o.classId });
  else App.race = makeRace(track, { laps: o.laps, classId: o.classId, player: o.team, seed: o.seed, mode: o.mode, noItems: o.noItems ?? o.mode === 'timetrial', count, autoplay: o.autoplay, rivals: o.rivals });
  // dusk and sunset courses: a fill lifts the crews off the darker road
  const dusk = /dusk|sunset/.test((track.json && track.json.env && track.json.env.time) || '');
  App.views = App.race.karts.map((k, i) => {
    const v = new KartView(window.THREE, k.team, { hero: i === App.race.player });
    v.mat.uniforms.uFill.value = dusk ? 0.32 : 0;
    if (dusk) v.mat.uniforms.uRim.value = 0.6;
    App.renderer.scene.add(v.shadow);
    App.renderer.scene.add(v.mesh);
    return v;
  });
  if (App.race.player >= 0 && App.views.length > 1) {
    App.views[App.race.player].showMarker(App.race.karts[App.race.player].team);
    App.views.forEach((v, i) => { if (i !== App.race.player) v.showRing(App.race.karts[i].team, true, dusk); });
  }
  App.prev = App.race.karts.map(poseOf);
  App.fx.setRace(App.race, track); App.fx.clear(); App.frameEvents.length = 0;
  if (App.world) clearAround(App.world, App.fx.booths);
  // Time Trial: record this run; race the saved best as a see-through ghost
  if (App.ghostView) { App.renderer.scene.remove(App.ghostView.mesh); App.ghostView.geo.dispose(); App.ghostView = null; }
  if (App.parView) { App.renderer.scene.remove(App.parView.mesh); App.parView.geo.dispose(); App.parView = null; }
  App.rec = null; App.ghost = null; App.par = null; App.newRecord = false; App.trialResult = null; App.dailyResult = null;
  App.hud.setPar(o.mode === 'timetrial' && medalTimes(o.track) ? medalTimes(o.track).gold : null);
  if (o.mode === 'timetrial') {
    App.rec = makeRecorder();
    const g = App.save.ghosts[o.track];
    if (g) {
      try { App.ghost = unpackGhost(g); App.ghostView = new KartView(window.THREE, g.team, { ghost: true }); App.renderer.scene.add(App.ghostView.mesh); } catch (e) { App.ghost = null; }
    }
    // the staff ghost (par): the first target, with a gold marker over it so it reads apart from the player's own ghost
    const par = parOf(o.track);
    if (par) {
      try {
        App.par = unpackPar(par, (x, z, h) => track.surface(x, z, h));
        App.parView = new KartView(window.THREE, par.team, { ghost: true });
        const THREE = window.THREE, gem = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.28, 4).rotateX(Math.PI), new THREE.MeshBasicMaterial({ color: 0xF2C230, fog: false }));
        gem.position.set(0, 2.2, 0); App.parView.mesh.add(gem);
        App.renderer.scene.add(App.parView.mesh);
      } catch (e) { App.par = null; App.parView = null; }
    }
  }
  App.cam.snap();
  App.acc = 0;
  App.paused = false; App.resumeT = 0;
  App.testPaused = !!o.paused;
  setScene('race');
  App.screens.hide();
  setIntensity(0);
  playScene(sceneFor(o));
  playTheme(o.mode === 'row' || o.mode === 'battle' ? 'march' : (trackData(o.track) || {}).env?.music || ((TRACK_BY_ID[o.track] || {}).cup === 'ouachita' ? 'grass' : 'rag'));
  document.body.classList.add('racing');
  App.hud.root.classList.add('on');
  App.hud.last = {};
  if (window.TR_TEACH) { if (tips && window.TR_TEACH.api) window.TR_TEACH.tipStart(App.hud, () => persistSave({ settings: { seenIntro: true } })); else window.TR_TEACH.tipStop(); }
  return App.race;
}

// Perf lab (tools/perf-gpu.mjs --scenes=lab): a real-time AI race with synthetic brick crews at a chosen detail
// level and an optional instanced brick crowd. opts: { lod, tubs, crowd, crowdLod, boards, track }
async function perfLab(o = {}) {
  await startRace({ track: o.track || 'bathhouse-row', team: 'engine-six', seed: 3, autoplay: true, count: o.tubs ?? 8, mode: 'quick' });
  const THREE = window.THREE, out = { tubTris: null, crowdTris: 0 };
  if (o.lod != null) {
    const geo = labKartGeo(THREE, o.lod);
    for (const v of App.views) { v.geo.dispose(); v.mesh.geometry = geo; v.geo = geo; }
    out.tubTris = geo.attributes.position.count / 3;
  }
  if (o.crowd) { const c = labCrowd(THREE, App.track, o.crowd, o.crowdLod ?? 1); App.world.add(c.mesh); out.crowdTris = c.tris; }
  if (o.boards === false) App.world.children.forEach((m) => { if (m.name.startsWith('boards:')) m.visible = false; });
  return out;
}

function poseOf(k) { return { x: k.x, y: k.y, z: k.z, yaw: k.yaw }; }

function setScene(name) { App.scene = name; document.body.dataset.scene = name; }

function gotoTitle() {
  clearKarts();
  App.race = null;
  App.paused = false;
  setScene('title');
  setMirror(false);
  if (window.TR_TEACH) window.TR_TEACH.tipStop();
  document.body.classList.remove('racing');
  App.hud.root.classList.remove('on');
  App.screens.show('title');
  setIntensity(0);
  playScene('town');
  playTheme('title');
}

// The place a race is heard in: the plaza for the Water Fight, the mountain for the Ouachita cup, downtown otherwise.
function sceneFor(o) {
  const tr = TRACK_BY_ID[o.track] || {};
  return o.mode === 'battle' || tr.arena ? 'plaza' : tr.cup === 'ouachita' ? 'mountain' : 'town';
}

// Per-frame sound for a race: the player's tub, then the rivals placed by where the camera points.
function audioFrame(r, dt, live) {
  const me = r.player >= 0 ? r.karts[r.player] : null;
  tubLoop(me, dt, live && r.phase !== 'done');
  const cam = App.renderer.camera;
  cam.getWorldDirection(SHADOW_DIR);
  setListener(App.mirror ? SHADOW_DIR.z : -SHADOW_DIR.z, App.mirror ? -SHADOW_DIR.x : SHADOW_DIR.x); // the camera's right on the ground (flipped with the picture)
  rivalLoop(me, r.karts, live && r.phase === 'race', dt);
}

// A live race stops when the player leaves the page (tab switch, phone call, window blur); they resume it from the pause screen.
function pauseRace() {
  if (App.scene === 'race' && App.race && App.race.phase !== 'done' && !App.paused) togglePause(true);
}
function onAway() { pauseRace(); suspendAudio(); }
function onBack() { App.last = 0; resumeAudio(); }

// The Resume hold: the sim stands still, the camera and HUD live on, a 3-2-1 shows, and any key pressed meanwhile is forgotten.
function resumeCountdown(dt) {
  App.resumeT = Math.max(0, App.resumeT - dt);
  INPUT.itemP = false;
  const n = Math.ceil(App.resumeT / (RESUME_HOLD / 3) - 1e-6);
  if (n > 0 && n !== App.resumeN) { App.resumeN = n; App.hud.flash('RESUMING ' + n, 'lap', RESUME_HOLD / 3 + 0.05); }
}

function togglePause(force) {
  if (App.scene !== 'race' || !App.race || App.race.phase === 'done') return;
  App.paused = force ?? !App.paused;
  if (App.paused) { App.resumeT = 0; App.screens.show('pause'); } else { App.resumeT = RESUME_HOLD; App.resumeN = 0; App.screens.hide(); }
}

// courses that are built (data present) in registry order, with card info
function builtCourses() {
  return TRACKS.filter((t) => builtIds().includes(t.id) && !t.arena).map((t) => ({ id: t.id, name: t.name, length: (window.TR_LENGTHS || {})[t.id] || 0, blurb: t.blurb || '', cup: t.cup }));
}

// Menu flow: mode → team → class → cup/course → race. App.flow remembers the choices on the way.
// Adopt preferences from the same fresh merge that will be stored. Quality keeps
// its existing boot/reload semantics; do not rebuild the active race or tier here.
function persistSave(intent) {
  const result = intent && intent.reset ? resetSave(App.save) : writeSave(App.save, intent), s = App.save.settings;
  if (App.renderer && App.renderer.mode !== s.res) App.renderer.setMode(s.res);
  applyInputSettings(s);
  const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  App.reducedMotion = s.reducedMotion ?? !!(mq && mq.matches);
  setAudio(s);
  App.saveProblem = result.stored ? null : result.problem;
  App.saveError = saveMessage(App.saveProblem);
  if (App.saveError) App.hud.flash('Changes not saved · kept in this tab', 'bad', 3);
  else {
    App.screens.root.querySelector('[data-save-status]')?.remove();
    // Retire only our own stale warning; leave later lap/boost callouts intact.
    if (App.hud.el.call.textContent === 'Changes not saved · kept in this tab') App.hud.flash('Changes saved', '', 1.4);
  }
  return result;
}

function showSaveStatus() {
  if (!App.saveError || !App.screens.cur || App.screens.root.querySelector('[data-save-status]')) return;
  const p = document.createElement('p');
  p.className = 'sub'; p.dataset.saveStatus = ''; p.setAttribute('role', 'status');
  p.textContent = App.saveError;
  if (App.saveProblem === 'damaged') {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'mbtn'; b.textContent = 'Reset saved data';
    b.addEventListener('click', () => onMenu('resetSave'));
    p.append(' ', b);
  }
  (App.screens.root.querySelector('.panel, .title-wrap') || App.screens.root).appendChild(p);
}

function onMenu(act, data) {
  const s = App.save;
  const F = App.flow || (App.flow = {});
  switch (act) {
    case 'battle':
      App.flow = { mode: 'battle', team: s.lastTeam, classId: lastClass() };
      showTeams(s.lastTeam);
      break;
    case 'row':
      App.flow = { mode: 'row', team: s.lastTeam, classId: lastClass() };
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
      App.flow = { mode: act, team: s.lastTeam, classId: lastClass() };
      showTeams(s.lastTeam);
      break;
    case 'daily': App.screens.show('daily', dailyView()); break;
    case 'dailyGo': {
      const p = dailyToday();
      setPreview(null);
      startRace({ mode: 'quick', count: 8, track: p.track, team: p.team, classId: p.classId, laps: p.laps, seed: p.seed, daily: p.date });
      break;
    }
    case 'records': App.screens.show('records', recordsView()); break;
    case 'team': showTeams(data.id); break;
    case 'teamOk':
      persistSave({ lastTeam: F.team });
      if (F.mode === 'battle') { setPreview(null); startRace({ mode: 'battle', track: 'hill-wheatley', team: F.team, classId: F.classId }); break; }
      if (F.mode === 'row') {
        App.row = { bracket: makeBracket(TEAMS.find((t) => t.id === F.team).div, F.team, makeRng((Math.random() * 1e9) | 0)), heats: [] };
        ensureTrack('bathhouse-row').then(() => { loadCourse('bathhouse-row'); App.screens.show('rowIntro', { team: F.team, bracket: App.row.bracket }); });
        break;
      }
      if (F.mode === 'timetrial') ensurePar().then(() => { if (App.screens.cur === 'teams') App.screens.show('courses', { list: builtCourses(), trial: true }); });
      else App.screens.show('classes');
      break;
    case 'cls':
      F.classId = data.id; persistSave({ lastClass: data.id });
      if (F.mode === 'gp') App.screens.show('cups', { built: builtCourses().map((c) => c.id) });
      else App.screens.show('courses', { list: builtCourses(), trial: F.mode === 'timetrial' });
      break;
    case 'cup': {
      const cup = CUP_BY_ID[data.id];
      if (!cup || !s.unlocked.cups.includes(cup.id)) break; // a cup that is not open (a stale card, a hand-edited choice) is never raced
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
    case 'mirror': { // the Mirror switch on the course and cup screens
      if (!s.unlocked.mirror) break;
      persistSave({ settings: { mirror: data.v === 'true' } });
      if (App.screens.cur === 'cups') App.screens.show('cups', { built: builtCourses().map((c) => c.id) });
      else App.screens.show('courses', { list: builtCourses(), trial: F.mode === 'timetrial' });
      break;
    }
    case 'help': App.screens.app.helpAll = false; App.screens.show('help'); break;
    case 'helpAll': App.screens.app.helpAll = !App.screens.app.helpAll; App.screens.show('help'); App.screens.root.querySelector('[data-act="helpAll"]')?.focus({ preventScroll: true }); break;
    case 'credits': App.screens.show('credits'); break;
    case 'controls': ensureTeach().then(() => { if (window.TR_TEACH && window.TR_TEACH.api) controlsScreen(); }); break;
    case 'rebind': App.capture = data.a; controlsScreen({ capture: data.a }); break;
    case 'rebindReset': persistSave({ settings: { keys: null } }); controlsScreen({ msg: 'Keys are back to their defaults.' }); break;
    case 'settings': App.capture = null; App.prevScreen = App.screens.cur; App.screens.show('settings'); break;
    case 'back':
      if (App.scene === 'race' && App.paused) App.screens.show('pause');
      else { setPreview(null); App.screens.show('title'); }
      break;
    case 'continueCup': {
      const c = savedCup();
      if (!c) { refreshCup(); App.screens.show('title'); break; }
      App.gp = { cup: c.cup, name: c.name, tracks: c.tracks, round: c.round, table: c.table, rivals: c.rivals, recorded: c.round };
      App.raceOpts = { team: c.team, classId: c.classId, seed: c.seed };
      App.flow = { mode: 'gp', team: c.team, classId: c.classId };
      showStandings();
      break;
    }
    case 'resume': togglePause(false); break;
    case 'resetSave': persistSave({ reset: true }); break;
    case 'restart': startRace({ ...App.raceOpts, seed: App.raceOpts.daily ? App.raceOpts.seed : App.raceOpts.seed + 1 }); break; // the day's race keeps its seed
    case 'quitCup': { // abandoning a cup needs a second, deliberate press; Back and Esc never reach this button
      const b = App.screens.root.querySelector('[data-act="quitCup"]');
      if (b && !b.dataset.armed) { b.dataset.armed = '1'; b.textContent = 'Quit cup? Press again'; break; }
      App.gp = null; gotoTitle(); break;
    }
    case 'quit': App.gp = null; gotoTitle(); break;
    case 'set': {
      let v = data.v;
      if (v === 'true') v = true; else if (v === 'false') v = false; else if (data.k === 'hudScale' || data.k === 'volume') v = +v;
      persistSave({ settings: { [data.k]: v } });
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

// What the Daily Race and Records screens show: the saved results against today's date
function dailyView() {
  const p = dailyToday(), s = App.save;
  return { plan: p, today: p.date, done: s.daily[p.date] || null, streak: liveStreak(s.dailyStreak, p.date), best: s.stats.bestStreak };
}
function recordsView() {
  const courses = builtCourses();
  return { courses, today: today(), streak: liveStreak(App.save.dailyStreak, today()) };
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
  const view = new KartView(window.THREE, teamId, { hero: true });
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
  storeCup({ v: 1, cup: g.cup, name: g.name, tracks: g.tracks, round: g.round, table: g.table, rivals: g.rivals, team: App.raceOpts.team, classId: App.raceOpts.classId, seed: App.raceOpts.seed });
  refreshCup();
}
// The cup in progress is kept after every recorded race so a reload or a discarded tab can pick it up again.
function savedCup() {
  const c = loadCup();
  if (!c || !CUP_BY_ID[c.cup] || typeof c.name !== 'string') return null;
  const built = builtIds();
  const ok = Array.isArray(c.tracks) && c.tracks.length > 0 && c.tracks.every((id) => built.includes(id))
    && Number.isInteger(c.round) && c.round >= 0 && c.round < c.tracks.length
    && c.table && typeof c.table === 'object' && Array.isArray(c.rivals) && c.rivals.every((id) => TEAM_BY_ID[id])
    && TEAM_BY_ID[c.team] && CLASSES[c.classId] && Number.isFinite(c.seed);
  if (!ok) return null;
  const rows = Object.values(c.table);
  const rowsOk = rows.length > 0 && rows.some((r) => r && r.human) && rows.every((r) => r && TEAM_BY_ID[r.team] && [r.points, r.clean, r.bribes].every(Number.isFinite));
  return rowsOk ? c : null;
}
function refreshCup() { if (App.screens && App.screens.app) App.screens.app.cup = savedCup(); }
function gpRows() {
  return Object.values(App.gp.table).sort((a, b) => b.points - a.points || b.bribes - a.bribes);
}
function showStandings() {
  const g = App.gp, final = g.round >= g.tracks.length - 1;
  App.screens.show('standings', { rows: gpRows(), round: g.round + 1, rounds: g.tracks.length, cupName: g.name, final });
}
function showTrophy() {
  const g = App.gp, rows = gpRows(), place = rows.findIndex((r) => r.human) + 1;
  const saved = persistSave({ cup: { token: g, key: g.cup + ':' + App.raceOpts.classId, place,
    soak: App.raceOpts.classId === 'soak', scald: App.raceOpts.classId === 'scald', teamOrder: TEAMS.filter((t) => !t.unlocked).map((t) => t.id) } });
  const unlockedTeam = saved.unlockedTeam, unlockedClass = saved.unlockedClass || null, unlockedCup = saved.unlockedCup || null, unlockedMirror = !!saved.unlockedMirror;
  clearCup(); refreshCup();
  App.screens.show('trophy', { place, cupName: g.name, unlockedTeam, unlockedClass, unlockedCup, unlockedMirror });
  App.gp = null;
}

// One fixed simulation tick for the current race.
// sounds, call-outs and camera shake from the player's sim events this step
function playerFeedback(me) {
  for (const e of me.events) {
    const snd = { boost: 'boost', fumble: 'hit', wall: 'bump', bump: 'bump', pickup: 'pickup', ticket: 'ticket', bribe: 'whistle', judge: 'whistle', taskDone: 'cheer', blocked: 'snap', drained: 'splash', charge: 'charge', land: 'land' }[e.type];
    // the one argument a cue takes: splash(big), bump, land(speed), boost(kind), charge(stage)
    if (snd) sfx(snd, e.type === 'drained' ? true : e.type === 'wall' || e.type === 'bump' || e.type === 'land' ? e.v : e.type === 'boost' ? e.kind : e.type === 'charge' ? e.stage : undefined);
    if (e.type === 'use') sfx(USE_CUE[e.item] || 'menu');
    if (e.type === 'boost') { App.hud.flash(e.kind === 'hot' ? 'HOT STEAM!' : e.kind === 'start' ? 'GREAT START!' : 'WARM STEAM', 'boost', 1); App.cam.punch = e.kind === 'hot' ? 6 : 4; App.cam.shake = Math.max(App.cam.shake, 0.25); }
    else if (e.type === 'fumble') { App.hud.flash('Dropped the ' + (e.item || 'item') + '! Circle the tub!', 'bad', 1.6); App.cam.shake = 0.8; App.views[me.id].flash = 1; }
    else if (e.type === 'wall' && e.v > 7) App.cam.shake = Math.min(1, e.v / 14);
    else if (e.type === 'land' && e.v > 7) App.cam.shake = 0.4;
    else if (e.type === 'hit') { App.cam.shake = 0.7; App.cam.punch = 3; }
    else if (e.type === 'bump') App.cam.shake = Math.max(App.cam.shake, 0.35);
    else if (e.type === 'fall') App.hud.flash('Over the edge! The refs will tow you back', 'bad', 2);
    else if (e.type === 'bribe') App.hud.flash('Bribe accepted: HEAD START!', 'boost', 1.4);
    else if (e.type === 'blocked') App.hud.flash('Blocked by your loofah!', 'lap', 1);
    else if (e.type === 'scored') App.hud.flash('Splash! Got one!', 'lap', 0.9);
    else if (e.type === 'sprayed') App.hud.flash('Getting soaked!', 'bad', 0.8);
  }
}
// test hooks that act on a kart outside a sim step (act('hit')) hand its events to the frame here, as a step would
function kartEvents(k) {
  for (const e of k.events) App.frameEvents.push({ k, e });
  const r = App.race, me = r && r.player >= 0 ? r.karts[r.player] : null;
  if (me === k) playerFeedback(k);
  else if (me) for (const e of k.events) rivalEvent(me, k, e, r.time);
}

// a mirrored picture reverses what the player means by left and right
function mirrored(i) { if (App.mirror) i.steer = -i.steer; return i; }

function stepOnce() {
  const r = App.race;
  if (!r) return;
  App.prev = r.karts.map(poseOf);
  const inputs = [];
  if (r.player >= 0) inputs[r.player] = App.held ? { ...App.held } : assistSteer(App.track, r.karts[r.player], mirrored(readIntent()), INPUT.steerAssist);
  stepRace(r, App.track, inputs, DT);
  App.steps++;
  if (App.rec && r.phase === 'race' && r.player >= 0 && !r.karts[r.player].finished) record(App.rec, r.karts[r.player], r.time);
  // HUD call-outs and camera shake from sim events; effects get every kart's events for this frame
  for (const kk of r.karts) for (const e of kk.events) App.frameEvents.push({ k: kk, e });
  const me = r.player >= 0 ? r.karts[r.player] : null;
  if (me) for (const kk of r.karts) if (kk !== me) for (const e of kk.events) rivalEvent(me, kk, e, r.time); // the other tubs are heard too
  // countdown beeps
  const tPrev = r.time - DT;
  if (r.phase === 'countdown' || (r.phase === 'race' && r.time < DT * 1.5)) {
    if (tPrev < -2.1 && r.time >= -2.1) sfx('ready');
    if (tPrev < -1.0 && r.time >= -1.0) sfx('ready');
    if (r.phase === 'race' && r.time <= DT * 1.01) sfx('go');
  }
  if (me) playerFeedback(me);
  if (me && window.TR_TEACH) { const i = inputs[r.player]; window.TR_TEACH.tipStep({ race: r, me, steer: i.steer, hop: i.hop, brake: i.brake, dev: INPUT.last, auto: INPUT.autoPush, binds: getBindings() }); }
  for (const e of r.events) {
    if (me && e.kart === me.id && e.type === 'lap') { if (e.lap === r.laps) setIntensity(1); if (e.lap > r.laps) sfx('finish', r.finishOrder.indexOf(me.id) + 1 || me.place); else sfx(e.lap === r.laps ? 'finalLap' : 'lap'); }
    if (me && e.kart === me.id && e.type === 'lap') App.hud.flash(e.lap === r.laps ? 'FINAL LAP!' : e.lap > r.laps ? 'FINISH!' : `LAP ${e.lap}`, 'lap', 1.4);
  }
  if (me && me.water.gal <= 0.01 && !App._dryShown) { App.hud.flash('BONE DRY!', 'bad', 1.4); App._dryShown = true; }
  if (me && me.water.gal > 1) App._dryShown = false;
  if (r.phase === 'done' && !App._resultsShown) {
    App._resultsShown = true;
    setIntensity(0);
    if (window.TR_TEACH) window.TR_TEACH.tipFinish();
    playTheme('results');
    const me = r.player >= 0 ? r.karts[r.player] : null;
    let record = null;
    if (me && me.finished && r.mode !== 'row' && r.mode !== 'battle') {
      const lap = me.lapTimes.length ? Math.min(...me.lapTimes.slice(1).concat(me.lapTimes.length === 1 ? me.lapTimes : [])) : null;
      record = { track: App.track.id, finishT: me.finishT,
        value: { race: +me.finishT.toFixed(3), lap: lap ? +lap.toFixed(3) : null, team: me.team, cls: r.classId },
        ghost: App.rec && App.rec.t.length > 10 ? packGhost(App.rec, { team: me.team, total: +me.finishT.toFixed(3) }) : null };
    }
    // Time Trial runs of the par length are scored against the par ghost's medal times
    const trial = record && r.mode === 'timetrial' && r.classId === 'scald' && r.laps === PAR_LAPS && parOf(record.track)
      ? { track: record.track, race: record.value.race, lap: record.value.lap, medal: medalFor(record.track, record.finishT) } : null;
    // the Daily Race is its own board: its fixed field and short length never touch a course's best time
    const daily = App.raceOpts && App.raceOpts.daily && me && me.finished ? (() => { const h = r.results.find((x) => x.human); return h ? { date: App.raceOpts.daily, track: App.track.id, team: me.team, place: h.place, time: +h.time.toFixed(3) } : null; })() : null;
    if (daily) record = null;
    const saved = persistSave({ race: { token: r, won: !!(r.results[0] && r.results[0].human), record, trial, daily, spilled: me ? me.water.spilled : 0 } });
    App.newRecord = !!saved.recordAccepted && (saved.hadBest || r.mode === 'timetrial');
    App.trialResult = trial ? { ...trial, medalNew: !!saved.medalNew, trialBest: !!saved.trialBest, lapBest: !!saved.lapBest, times: medalTimes(trial.track), parLap: parOf(trial.track).lap } : null;
    App.dailyResult = daily ? { ...daily, streak: saved.streak, streakBest: !!saved.streakBest, first: !!saved.dailyFirst, better: !!saved.dailyBest } : null;
    if (App.trialResult && App.trialResult.medalNew) sfx('cheer');
    if (r.mode === 'gp') recordGp(r);
    if (r.mode === 'row') { setTimeout(() => { if (App.race === r) onHeatDone(r); }, window.__TEST__ ? 0 : 1200); return; }
    setTimeout(() => { if (App.race === r) App.screens.show('results', { results: r.results, laps: r.laps, trackName: App.track.name, gp: r.mode === 'gp', newRecord: App.newRecord, mode: r.mode, trial: App.trialResult, daily: App.dailyResult }); }, window.__TEST__ ? 0 : 1500);
  }
  if (r.phase !== 'done') App._resultsShown = false;
}

// One exception in a frame must not freeze the picture: report it (once per message), then still draw.
let lastFrameError = '';
function frame(t) {
  requestAnimationFrame(frame);
  try { frameStep(t); } catch (e) {
    if (String(e) !== lastFrameError) { lastFrameError = String(e); console.error(e); }
    try { if (!App.glLost) App.renderer.render(App.time); } catch (e2) { /* the next frame tries again */ }
  }
}

function frameStep(t) {
  const t0 = performance.now();
  const now = t / 1000;
  let dt = App.last ? now - App.last : 0;
  App.last = now;
  dt = Math.min(0.25, Math.max(0, dt));
  // review captures freeze the render clock (act('clock')): animation, particles and HUD timers hold still, and
  // moving the frozen clock forward hands exactly that step to one frame (motion strips)
  if (App.clock != null) { dt = Math.min(0.25, Math.max(0, App.clock - App.time)); App.time = App.clock; } else App.time += dt;
  pollGamepads();
  setMuffle(!!App.paused && App.scene === 'race');
  const m = consumeMenu();
  if (consumePause() && App.scene === 'race') togglePause();
  if (App.screens.cur) App.screens.nav(m);
  showSaveStatus();
  const r = App.race;
  if (App.scene === 'race' && r) {
    if (!App.paused && !App.testPaused && App.resumeT > 0) resumeCountdown(dt);
    else if (!App.paused && !App.testPaused) {
      App.acc += dt;
      let n = 0;
      while (App.acc >= DT && n < 15) { stepOnce(); App.acc -= DT; n++; }
      if (n === 15) App.acc = 0;
    }
    const alpha = App.paused || App.testPaused ? 1 : App.acc / DT;
    drawRace(r, alpha, dt);
    audioFrame(r, dt, !App.paused && !App.testPaused && !(App.resumeT > 0));
    const down = App.governor.frame(dt, !App.paused && !App.testPaused);
    if (down) { App.tier = down; if (App.renderer.ssao) { App.renderer.ssao.dispose(); App.renderer.ssao = null; } if (down === 'low' && App.shadow) App.shadow.setEnabled(false); const env = App.track.json.env || {}; App.renderer.setEnv({ ...env, fog: env.fog ? [Math.min(env.fog[0], TIERS[down].fogFar * 0.4), Math.min(env.fog[1], TIERS[down].fogFar)] : undefined }); }
  } else {
    tubLoop(null, dt, false);
    rivalLoop(null, [], false, dt);
    drawAttract(dt);
  }
  // the shadow map follows the action: a little ahead of the chased tub, or ahead of the attract camera
  if (App.shadow) {
    const cam = App.renderer.camera, p = App.scene === 'race' && App.camPose && !App.camOverride ? App.camPose.pose : null;
    if (p) App.renderer.shadowFocus = [p.x + Math.sin(p.yaw) * 12, p.y, p.z + Math.cos(p.yaw) * 12];
    else { cam.getWorldDirection(SHADOW_DIR); App.renderer.shadowFocus = [cam.position.x + SHADOW_DIR.x * 22, cam.position.y - 4, cam.position.z + SHADOW_DIR.z * 22]; }
  }
  App.renderer.render(App.time);
  const ms = performance.now() - t0;
  App.cpuMs = App.cpuMs == null ? ms : App.cpuMs * 0.9 + ms * 0.1;
}

let SHADOW_DIR = null;
function lerpAngle(a, b, t) { const d = Math.atan2(Math.sin(b - a), Math.cos(b - a)); return a + d * t; }

function drawRace(r, alpha, dt) {
  const tr = App.track;
  r.karts.forEach((k, i) => {
    const p = App.prev[i] || k;
    const pose = { x: p.x + (k.x - p.x) * alpha, y: p.y + (k.y - p.y) * alpha, z: p.z + (k.z - p.z) * alpha, yaw: lerpAngle(p.yaw, k.yaw, alpha) };
    pose.groundY = tr.surface(pose.x, pose.z, k.s).h;
    // the ground's normal under the tub, from the surface 1.2 m either side (lays the contact shadow and ring on it)
    const hx = tr.surface(pose.x + 1.2, pose.z, k.s).h - tr.surface(pose.x - 1.2, pose.z, k.s).h, hz = tr.surface(pose.x, pose.z + 1.2, k.s).h - tr.surface(pose.x, pose.z - 1.2, k.s).h;
    const gl = Math.hypot(hx, 2.4, hz); pose.gn = [-hx / gl, 2.4 / gl, -hz / gl];
    App.views[i].update(k, pose, App.paused ? 0 : dt, App.time);
    // a rival tub in the sightline from the chase camera to the player's tub steps aside (fades out over a short band,
    // since a half-faded tub that close reads as a ghost) so the player's own tub stays in view; never in close-ups
    if (i !== r.player && r.player >= 0) {
      const cam = App.renderer.camera.position, pp = r.karts[r.player], ax = pp.x - cam.x, az = pp.z - cam.z, l2 = ax * ax + az * az || 1;
      const t = Math.max(0, Math.min(1, ((pose.x - cam.x) * ax + (pose.z - cam.z) * az) / l2)), off = Math.hypot(pose.x - cam.x - ax * t, pose.z - cam.z - az * t);
      const fade = !App.camOverride && t > 0.02 && t < 0.9 && off < 2.4 ? Math.min(1, (2.4 - off) / 0.5) : 0;
      App.views[i].mat.uniforms.uFade.value = fade; App.views[i].shadow.visible = fade < 0.5;
    }
    if (i === r.player || (r.player < 0 && i === 0)) { App.camPose = { k, pose }; setFocus(pose.x, pose.y, pose.z); }
  });
  App.footBlobs.set(App.views);
  // the player's marker waits out the countdown (READY sits where it floats)
  const pv = App.views[r.player];
  if (pv && pv.marker) pv.marker.visible = r.phase !== 'countdown';
  drawGhost(App.ghost, App.ghostView, r, dt);
  drawGhost(App.par, App.parView, r, dt);
  const lookBack = INPUT.back || (INPUT.pad && INPUT.pad.back);
  if (App.camPose) {
    App.cam.update(App.camPose.k, App.camPose.pose, dt || 1 / 60, {
      fxDt: dt, lookBack, time: App.time, reducedMotion: App.reducedMotion, baseFov: App.renderer.baseFov, portrait: App.renderer.size.h > App.renderer.size.w,
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
  // effects hold still while paused, except when a review capture steps the frozen clock (motion strips)
  App.fx.update(r, tr, App.paused || (App.testPaused && App.clock == null) ? 0 : dt, App.time, App.reducedMotion, App.frameEvents);
  App.frameEvents.length = 0;
  if (App.sky) App.sky.position.copy(App.renderer.camera.position).setY(0);
  App.hud.update(r, tr, r.player >= 0 ? r.karts[r.player] : null, dt);
}

// A see-through Time Trial ghost (the player's own, or the staff par) at the race clock's pose.
function drawGhost(G, view, r, dt) {
  if (!G || !view) return;
  const gp = ghostPose(G, r.time);
  view.mesh.visible = !!gp;
  if (!gp) return;
  gp.groundY = gp.y;
  const gk = App._ghostK || (App._ghostK = { id: 99, vf: 16, yawRate: 0, drift: 0, steer: 0, boostT: 0, air: false, state: 'run', items: { towel: true, mat: true, soap: true, loofah: true }, runPhase: 0, water: { gal: 30, cap: 38, tf: 0, tr: 0 } });
  gk.runPhase = r.time * 9;
  view.update(gk, gp, dt, App.time);
  view.shadow.visible = false;
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
    App.preview.pose = pose;
    App.preview.view.update(App.preview.k, pose, dt, App.time);
    App.footBlobs.set([App.preview.view]);
    // on wide screens the menu panel sits on the left, so aim left of the tub to show it on the right; on tall
    // (portrait) screens the panel fills the bottom, so step back and aim below the tub to lift it into the top third
    const aspect = App.renderer.size.w / App.renderer.size.h, wide = aspect > 1.3 ? 1 : 0, tall = aspect < 0.8 ? 1 : 0;
    const back = 5.5 + tall * 4.2;
    cam.position.set(pc.x - pc.tz * 3.2 - pc.tx * back, pc.y + 2.6 + tall * 0.6, pc.z + pc.tx * 3.2 - pc.tz * back);
    const lx = -(pp.z - cam.position.z), lz = pp.x - cam.position.x, ll = Math.hypot(lx, lz) || 1;
    // very wide (phone landscape) screens: aim further left so the tub sits in the right third, clear of the panel
    const aimL = aspect > 1.9 ? 3.9 : 2.6;
    cam.lookAt(pp.x - (lx / ll) * aimL * wide, pp.y + 0.9 - tall * 6.2, pp.z - (lz / ll) * aimL * wide);
  } else App.footBlobs.set([]);
  if (App.camOverride) { const o = App.camOverride; cam.position.set(o.pos[0], o.pos[1], o.pos[2]); cam.lookAt(o.target[0], o.target[1], o.target[2]); }
  if (cam.fov !== App.renderer.baseFov) { cam.fov = App.renderer.baseFov; cam.updateProjectionMatrix(); }
  if (App.sky) App.sky.position.copy(cam.position).setY(0);
}

boot().catch((e) => { console.error(e); const el = document.querySelector('#boot-error'); if (el) { el.textContent = 'Could not start: ' + e.message; el.hidden = false; } });
