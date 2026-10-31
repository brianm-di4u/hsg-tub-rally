// Saves: one versioned JSON object in localStorage, wrapped in try/catch with an in-memory fallback so the game
// works when storage is blocked (private windows, file:// in some browsers, tests that throw on access).
const KEY = 'hsg-tub-rally-v1';
let mem = null;

export const DEFAULT_SAVE = () => ({
  v: 1,
  settings: { sound: true, music: true, volume: 0.6, res: 'native', quality: 'auto', autoPush: false, steerAssist: false, reducedMotion: null, hudScale: 1, keys: null },
  unlocked: { teams: [], cups: ['bathhouse'], classes: ['splash', 'soak'], mirror: false },
  best: {}, // trackId → { lap, race, team }
  ghosts: {}, // trackId → pose ghost
  cups: {}, // cupId:class → best place
  stats: { races: 0, wins: 0, gallonsSpilled: 0 },
  lastTeam: 'engine-six', lastClass: 'soak',
});

export function loadSave() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && s.v === 1) {
        const d = DEFAULT_SAVE(), out = { ...d, ...s, settings: { ...d.settings, ...s.settings }, unlocked: { ...d.unlocked, ...s.unlocked } };
        // the brick look renders at native resolution; saves from the 240-line era move over once
        if (!out.settings.brick) { if (out.settings.res === 'authentic') out.settings.res = 'native'; out.settings.brick = true; }
        return out;
      }
    }
  } catch (e) { /* storage unavailable */ }
  return mem ? JSON.parse(JSON.stringify(mem)) : DEFAULT_SAVE();
}

export function writeSave(s) {
  mem = JSON.parse(JSON.stringify(s));
  try { window.localStorage.setItem(KEY, JSON.stringify(s)); return true; } catch (e) { return false; }
}
