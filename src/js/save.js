// v1 saves. Only explicit local actions are merged into a fresh storage read.
// Pending earned changes survive failed reads/writes; a cached save is never write authority.
import { validKey, nextStreak, betterDaily, DAILY_KEEP } from './daily.js';

const KEY = 'hsg-tub-rally-v1';
const copy = (v) => JSON.parse(JSON.stringify(v));
const object = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const own = (v, k) => Object.prototype.hasOwnProperty.call(v, k);

// S1-03: a touch device with no save starts with auto-push on
const touchDevice = () => { try { return !!window.matchMedia('(pointer: coarse)').matches; } catch (e) { return false; } };

export const DEFAULT_SAVE = () => ({
  v: 1,
  // seenIntro: first-run tips shown (S2-01); older saves count as seen
  settings: { sound: true, music: true, ambience: true, volume: 0.6, res: 'native', quality: 'auto', autoPush: touchDevice(), steerAssist: false, reducedMotion: null, hudScale: 1, keys: null, mirror: false, seenIntro: false },
  // rec: the unlock record's version. A save that has none was written before wave 2 and keeps everything it could use (see projection)
  unlocked: { teams: [], cups: ['bathhouse'], classes: ['splash', 'soak'], mirror: false, rec: 2 },
  best: {}, // trackId → the complete winning race record, including its lap
  trial: {}, // trackId → Time Trial best { race, lap, medal 0..3 } (S3-04): Time Trial runs are on Scald only, so these are comparable
  ghosts: {}, // trackId → last eligible recorded Time Trial
  cups: {},
  daily: {}, // 'yyyy-mm-dd' → the best Daily Race of that day { track, team, place, time } (the latest DAILY_KEEP days)
  dailyStreak: { n: 0, last: '' }, // consecutive days with a Daily Race, and the last day played
  stats: { races: 0, wins: 0, gallonsSpilled: 0, bestStreak: 0 },
  lastTeam: 'engine-six', lastClass: 'soak',
});

// Time Trial bests: an entry that is not a real time is dropped, never an error (it is derived data).
function cleanTrial(t) {
  const out = {};
  if (!object(t)) return out;
  for (const [id, v] of Object.entries(t)) {
    if (!object(v) || !Number.isFinite(v.race) || v.race <= 0) continue;
    out[id] = { race: v.race, lap: Number.isFinite(v.lap) && v.lap > 0 ? v.lap : null, medal: Number.isInteger(v.medal) && v.medal >= 0 && v.medal <= 3 ? v.medal : 0 };
  }
  return out;
}

// Daily results and the streak are derived data too: bad entries are dropped, never an error.
function cleanDaily(t) {
  const out = {};
  if (!object(t)) return out;
  const keys = Object.keys(t).filter((k) => validKey(k) && object(t[k]) && Number.isInteger(t[k].place) && t[k].place >= 1 && Number.isFinite(t[k].time) && t[k].time > 0).sort().slice(-DAILY_KEEP);
  for (const k of keys) out[k] = { track: String(t[k].track || ''), team: String(t[k].team || ''), place: t[k].place, time: t[k].time };
  return out;
}
function cleanStreak(v) {
  return object(v) && Number.isInteger(v.n) && v.n > 0 && validKey(v.last) ? { n: v.n, last: v.last } : { n: 0, last: '' };
}

// remapped keys (S2-06): bad entries are dropped
const KEY_ACTIONS = ['left', 'right', 'push', 'brake', 'hop', 'item', 'back', 'pause'];
function cleanKeys(k) {
  if (!object(k)) return null;
  const out = {};
  for (const a of KEY_ACTIONS) if (Array.isArray(k[a]) && k[a].length && k[a].every((c) => typeof c === 'string' && c)) out[a] = k[a].slice(0, 4);
  return Object.keys(out).length ? out : null;
}

function projection(raw) {
  const s = raw === null ? { v: 1 } : JSON.parse(raw);
  if (!object(s) || s.v !== 1) throw new Error('Unsupported save');
  for (const k of ['settings', 'unlocked', 'best', 'ghosts', 'cups', 'stats']) {
    if (own(s, k) && !object(s[k])) throw new Error('Invalid save ' + k);
  }
  if (s.unlocked) for (const k of ['teams', 'cups', 'classes']) {
    if (own(s.unlocked, k) && (!Array.isArray(s.unlocked[k]) || s.unlocked[k].some((v) => typeof v !== 'string'))) throw new Error('Invalid unlocks');
  }
  if (s.stats) for (const k of ['races', 'wins', 'gallonsSpilled']) {
    if (own(s.stats, k) && (!Number.isFinite(s.stats[k]) || s.stats[k] < 0)) throw new Error('Invalid stats');
  }
  for (const b of Object.values(s.best || {})) {
    if (!object(b) || !Number.isFinite(b.race) || b.race <= 0) throw new Error('Invalid record');
  }
  for (const p of Object.values(s.cups || {})) {
    if (!Number.isFinite(p) || p < 1) throw new Error('Invalid cup');
  }
  const d = DEFAULT_SAVE();
  if (raw !== null) d.settings.autoPush = false; // new players only
  const grand = raw !== null && !(object(s.unlocked) && s.unlocked.rec === 2);
  const out = { ...d, ...s, settings: { ...d.settings, ...s.settings }, unlocked: { ...d.unlocked, ...s.unlocked }, stats: { ...d.stats, ...s.stats } };
  // Stored setting values that would break the game (a text volume throws inside the audio setup) fall back to defaults.
  const st = out.settings;
  // Grandfathering: a save from before wave 2 keeps both cups open. Mirror and Boil are new content and start locked.
  out.unlocked.rec = 2;
  if (grand) { if (!out.unlocked.cups.includes('ouachita')) out.unlocked.cups = [...out.unlocked.cups, 'ouachita']; out.unlocked.grandfathered = true; }
  else delete out.unlocked.grandfathered;
  out.unlocked.mirror = out.unlocked.mirror === true;
  out.trial = cleanTrial(s.trial);
  out.daily = cleanDaily(s.daily);
  out.dailyStreak = cleanStreak(s.dailyStreak);
  if (!Number.isFinite(out.stats.bestStreak) || out.stats.bestStreak < 0) out.stats.bestStreak = 0;
  st.mirror = st.mirror === true;
  st.steerAssist = st.steerAssist === true;
  st.hudScale = Number.isFinite(st.hudScale) && st.hudScale >= 0.7 && st.hudScale <= 1.4 ? st.hudScale : 1;
  st.keys = cleanKeys(st.keys);
  st.seenIntro = raw !== null && !(object(s.settings) && own(s.settings, 'seenIntro')) ? true : st.seenIntro === true;
  st.volume = Number.isFinite(st.volume) ? Math.min(1, Math.max(0, st.volume)) : d.settings.volume;
  if (!['authentic', 'crisp', 'native'].includes(st.res)) st.res = d.settings.res;
  if (!['auto', 'low', 'medium', 'high'].includes(st.quality)) st.quality = d.settings.quality;
  // Apply the existing migration before this action's explicit resolution choice.
  if (!out.settings.brick) {
    if (out.settings.res === 'authentic') out.settings.res = 'native';
    out.settings.brick = true;
  }
  return out;
}

// The injected accessors are also used by portable storage-failure regression fixtures.
export function createSaveWriter({
  read = () => window.localStorage.getItem(KEY),
  write = (raw) => window.localStorage.setItem(KEY, raw),
  backup = (raw) => window.localStorage.setItem(KEY + '-corrupt', raw),
} = {}) {
  let memory = null;
  let settings = {}, selection = {}, races = 0, wins = 0, runs = new Map(), cups = [], trials = [], dailies = [], spilled = 0;
  const raceSeen = new WeakMap(), cupSeen = new WeakMap();
  let grandfathered = false; // the last read was a save from before the unlock record
  let problem = null; // why the last read failed: 'blocked' (storage unavailable) or 'damaged' (unreadable value)
  const current = () => {
    let raw;
    try { raw = read(); } catch (e) { problem = 'blocked'; return { readable: false, save: null }; }
    try { const save = projection(raw); problem = null; grandfathered = !!(save.unlocked && save.unlocked.grandfathered); delete save.unlocked.grandfathered; return { readable: true, save }; }
    catch (e) { problem = 'damaged'; return { readable: false, save: null }; }
  };
  const sync = (target, value) => {
    // Screens holds the outer save object: adopt fresh data without replacing that alias.
    for (const k of Object.keys(target)) delete target[k];
    Object.assign(target, copy(value));
  };
  const remember = (intent) => {
    let info = null;
    if (intent.settings) Object.assign(settings, copy(intent.settings));
    if (own(intent, 'lastTeam')) selection.lastTeam = intent.lastTeam;
    if (own(intent, 'lastClass')) selection.lastClass = intent.lastClass;
    if (intent.race) {
      const r = intent.race;
      if (!object(r.token)) throw new Error('Race save needs its actual race object');
      info = raceSeen.get(r.token);
      if (!info) {
        info = { recordAccepted: false, hadBest: false };
        raceSeen.set(r.token, info);
        races++; if (r.won) wins++;
        if (object(r.trial) && Number.isFinite(r.trial.race) && r.trial.race > 0) trials.push({ ...copy(r.trial), info });
        if (Number.isFinite(r.spilled) && r.spilled > 0) spilled += r.spilled;
        if (object(r.daily) && validKey(r.daily.date) && Number.isInteger(r.daily.place) && r.daily.place >= 1 && Number.isFinite(r.daily.time) && r.daily.time > 0) dailies.push({ ...copy(r.daily), info });
        if (r.record) {
          const c = { ...copy(r.record), info };
          if (!Number.isFinite(c.finishT) || c.finishT <= 0 || !object(c.value) || c.value.race !== +c.finishT.toFixed(3)) throw new Error('Invalid earned record');
          const chain = runs.get(c.track) || [];
          // Such a run cannot improve any fresh base: an earlier pending run either
          // wins first, or the fresh base is already faster than this new run.
          // Keep rounding-boundary transitions and their ordering, rather than
          // selecting a minimum recorded ghost independently of record eligibility.
          if (!chain.some((p) => c.finishT >= Math.max(p.finishT, p.value.race))) {
            chain.push(c); runs.set(c.track, chain);
          }
        }
      }
    }
    if (intent.cup) {
      const c = intent.cup;
      if (!object(c.token)) throw new Error('Cup save needs its actual GP object');
      info = cupSeen.get(c.token);
      if (!info) {
        info = { unlockedTeam: null, resolved: false };
        cupSeen.set(c.token, info);
        cups.push({ key: c.key, cup: String(c.key).split(':')[0], place: c.place, won: c.place === 1, soak: c.soak === true, scald: c.scald === true, teamOrder: [...c.teamOrder], info });
      }
    }
    return info;
  };
  const merge = (base, resolveAwards) => {
    const out = copy(base);
    Object.assign(out.settings, settings);
    Object.assign(out, selection);
    out.stats.races += races; out.stats.wins += wins;
    for (const [track, chain] of runs) {
      for (const c of chain) {
        c.info.recordAccepted = false; c.info.hadBest = false;
        const old = out.best[track];
        // Keep the original raw finishT < rounded stored best.race boundary.
        if (!old || c.finishT < old.race) {
          c.info.recordAccepted = true; c.info.hadBest = !!old;
          out.best[track] = copy(c.value);
          if (c.ghost) out.ghosts[track] = copy(c.ghost);
        }
      }
    }
    out.stats.gallonsSpilled = Math.round((out.stats.gallonsSpilled + spilled) * 10) / 10;
    // Daily Races apply in date order, so a late retry cannot undo a streak
    for (const c of dailies.slice().sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))) {
      const old = out.daily[c.date], entry = { track: c.track, team: c.team, place: c.place, time: c.time };
      const best = betterDaily(old, entry);
      c.info.dailyBest = best === entry && !!old; c.info.dailyFirst = !old;
      out.daily[c.date] = best;
      out.dailyStreak = nextStreak(out.dailyStreak, c.date);
      c.info.streak = out.dailyStreak.n; c.info.streakBest = out.dailyStreak.n > out.stats.bestStreak;
      out.stats.bestStreak = Math.max(out.stats.bestStreak, out.dailyStreak.n);
    }
    for (const k of Object.keys(out.daily).sort().slice(0, -DAILY_KEEP)) delete out.daily[k];
    for (const c of trials) {
      const old = out.trial[c.track];
      const medal = Number.isInteger(c.medal) ? Math.min(3, Math.max(0, c.medal)) : 0;
      c.info.trialBest = !old || c.race < old.race; c.info.lapBest = Number.isFinite(c.lap) && (!old || !old.lap || c.lap < old.lap);
      c.info.medal = medal; c.info.medalNew = !!old ? medal > old.medal : medal > 0;
      out.trial[c.track] = { race: old ? Math.min(old.race, c.race) : c.race, lap: Number.isFinite(c.lap) ? (old && old.lap ? Math.min(old.lap, c.lap) : c.lap) : (old ? old.lap : null), medal: old ? Math.max(old.medal, medal) : medal };
    }
    for (const c of cups) {
      if (!out.cups[c.key] || c.place < out.cups[c.key]) out.cups[c.key] = c.place;
      if (resolveAwards && !c.info.resolved) {
        c.info.unlockedTeam = c.won ? c.teamOrder.find((id) => !out.unlocked.teams.includes(id)) || null : null;
        c.info.scald = c.won && c.soak;
        c.info.boil = c.won && c.scald; // a cup won on Scald opens the new class above it
        c.info.mirror = c.won && c.scald; // and the mirrored courses
        c.info.ouachita = c.cup === 'bathhouse' && c.place <= 3; // a podium in the Bathhouse Cup opens the Ouachita Cup
        c.info.resolved = true;
      }
      // A blocked first read leaves the award intent unresolved, independently
      // of App.gp. A failed write retains these exact IDs, never "unlock next".
      if (c.info.resolved) {
        if (c.info.unlockedTeam && !out.unlocked.teams.includes(c.info.unlockedTeam)) out.unlocked.teams.push(c.info.unlockedTeam);
        if (c.info.scald && !out.unlocked.classes.includes('scald')) out.unlocked.classes.push('scald');
        if (c.info.boil && !out.unlocked.classes.includes('boil')) { out.unlocked.classes.push('boil'); c.info.unlockedClass = 'boil'; }
        if (c.info.mirror && !out.unlocked.mirror) { out.unlocked.mirror = true; c.info.unlockedMirror = true; }
        if (c.info.ouachita && !out.unlocked.cups.includes('ouachita')) { out.unlocked.cups.push('ouachita'); c.info.unlockedCup = 'ouachita'; }
      }
    }
    return out;
  };
  return {
    load() {
      const fresh = current();
      if (fresh.readable) memory = copy(fresh.save);
      if (!memory) memory = DEFAULT_SAVE();
      return copy(memory);
    },
    commit(target, intent = {}) {
      const info = remember(intent);
      const fresh = current();
      if (fresh.readable) memory = copy(fresh.save);
      const value = merge(memory || DEFAULT_SAVE(), fresh.readable);
      sync(target, value);
      let stored = false;
      if (fresh.readable) {
        try { write(JSON.stringify(value)); stored = true; } catch (e) { /* keep pending changes */ }
      }
      const result = { stored, readable: fresh.readable, problem: fresh.readable ? (stored ? null : 'blocked') : problem, ...(info || {}) };
      if (stored) { memory = copy(value); settings = {}; selection = {}; races = 0; wins = 0; runs = new Map(); cups = []; trials = []; dailies = []; spilled = 0; }
      return result;
    },
    // Player-chosen recovery: keep a copy of the unreadable value under KEY-corrupt, store a fresh save, then
    // merge this session's pending changes into it. Never runs on its own.
    reset(target) {
      let raw;
      try { raw = read(); } catch (e) { return this.commit(target); }
      if (raw !== null) { try { backup(raw); } catch (e) { /* the player asked for a reset: carry on */ } }
      try { write(JSON.stringify(DEFAULT_SAVE())); } catch (e) { /* commit reports the failure */ }
      return this.commit(target);
    },
    problem: () => problem,
    grandfathered: () => grandfathered,
  };
}

const writer = createSaveWriter();
export const loadSave = () => writer.load();
export const writeSave = (save, intent) => writer.commit(save, intent);
export const resetSave = (save) => writer.reset(save);
export const saveProblem = () => writer.problem();
export const saveGrandfathered = () => writer.grandfathered();

// A Grand Prix in progress lives under its own key, so a damaged cup can never affect the main save. It is a
// convenience: every access is guarded and a failure just means no "Continue cup".
const CUP_KEY = 'hsg-tub-rally-cup-v1';
export function storeCup(cup) { try { window.localStorage.setItem(CUP_KEY, JSON.stringify(cup)); } catch (e) { /* not kept */ } }
export function loadCup() {
  try {
    const raw = window.localStorage.getItem(CUP_KEY);
    const cup = raw === null ? null : JSON.parse(raw);
    return object(cup) && cup.v === 1 ? cup : null;
  } catch (e) { return null; }
}
export function clearCup() { try { window.localStorage.removeItem(CUP_KEY); } catch (e) { /* not kept */ } }
