// Time Trial medals (S3-04). The par time is the staff ghost's finish (assets/par-ghosts.js, loaded when Time Trial
// opens, from the game's own autoplay driver on Scald); gold is beating it, silver and bronze are a little slower. One line to move a medal.
export const MEDAL_SCALE = { gold: 1.0, silver: 1.04, bronze: 1.10 }; // times the par time
export const PAR_LAPS = 3; // the par ghosts are three-lap runs
export const MEDAL_NAMES = ['', 'Bronze', 'Silver', 'Gold'];

// the par data is the global TR_PAR (absent until the script has loaded: then there are no medals)
export const parOf = (id) => { const p = (globalThis.TR_PAR || {})[id]; return p && Number.isFinite(p.total) ? p : null; };

// { gold, silver, bronze } in seconds, or null for a course with no par ghost
export function medalTimes(id) {
  const p = parOf(id);
  if (!p) return null;
  return { gold: p.total * MEDAL_SCALE.gold, silver: p.total * MEDAL_SCALE.silver, bronze: p.total * MEDAL_SCALE.bronze };
}

// 0 none, 1 bronze, 2 silver, 3 gold
export function medalFor(id, time) {
  const m = medalTimes(id);
  if (!m || !Number.isFinite(time)) return 0;
  return time <= m.gold + 1e-9 ? 3 : time <= m.silver ? 2 : time <= m.bronze ? 1 : 0;
}
