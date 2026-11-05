// v1 saves. Only explicit local actions are merged into a fresh storage read.
// Pending earned changes survive failed reads/writes; a cached save is never write authority.
const KEY = 'hsg-tub-rally-v1';
const copy = (v) => JSON.parse(JSON.stringify(v));
const object = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const own = (v, k) => Object.prototype.hasOwnProperty.call(v, k);

export const DEFAULT_SAVE = () => ({
  v: 1,
  settings: { sound: true, music: true, volume: 0.6, res: 'native', quality: 'auto', autoPush: false, steerAssist: false, reducedMotion: null, hudScale: 1, keys: null },
  unlocked: { teams: [], cups: ['bathhouse'], classes: ['splash', 'soak'], mirror: false },
  best: {}, // trackId → the complete winning race record, including its lap
  ghosts: {}, // trackId → last eligible recorded Time Trial
  cups: {},
  stats: { races: 0, wins: 0, gallonsSpilled: 0 },
  lastTeam: 'engine-six', lastClass: 'soak',
});

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
  const out = { ...d, ...s, settings: { ...d.settings, ...s.settings }, unlocked: { ...d.unlocked, ...s.unlocked }, stats: { ...d.stats, ...s.stats } };
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
} = {}) {
  let memory = null;
  let settings = {}, selection = {}, races = 0, wins = 0, runs = new Map(), cups = [];
  const raceSeen = new WeakMap(), cupSeen = new WeakMap();
  const current = () => {
    try { return { readable: true, save: projection(read()) }; }
    catch (e) { return { readable: false, save: null }; }
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
        cups.push({ key: c.key, place: c.place, won: c.place === 1, soak: c.soak === true, teamOrder: [...c.teamOrder], info });
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
    for (const c of cups) {
      if (!out.cups[c.key] || c.place < out.cups[c.key]) out.cups[c.key] = c.place;
      if (resolveAwards && !c.info.resolved) {
        c.info.unlockedTeam = c.won ? c.teamOrder.find((id) => !out.unlocked.teams.includes(id)) || null : null;
        c.info.scald = c.won && c.soak;
        c.info.resolved = true;
      }
      // A blocked first read leaves the award intent unresolved, independently
      // of App.gp. A failed write retains these exact IDs, never "unlock next".
      if (c.info.resolved) {
        if (c.info.unlockedTeam && !out.unlocked.teams.includes(c.info.unlockedTeam)) out.unlocked.teams.push(c.info.unlockedTeam);
        if (c.info.scald && !out.unlocked.classes.includes('scald')) out.unlocked.classes.push('scald');
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
      const result = { stored, readable: fresh.readable, ...(info || {}) };
      if (stored) { memory = copy(value); settings = {}; selection = {}; races = 0; wins = 0; runs = new Map(); cups = []; }
      return result;
    },
  };
}

const writer = createSaveWriter();
export const loadSave = () => writer.load();
export const writeSave = (save, intent) => writer.commit(save, intent);
