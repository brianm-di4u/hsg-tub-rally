// Time Trial medals (S3-04). The par time is the staff ghost's finish (data/par.js, from the game's own autoplay
// driver on Scald); gold is beating it, silver and bronze are a little slower. One line to move a medal.
import { PAR } from '../data/par.js';

export const MEDAL_SCALE = { gold: 1.0, silver: 1.04, bronze: 1.10 }; // times the par time
export const PAR_LAPS = 3; // the par ghosts are three-lap runs
export const MEDAL_NAMES = ['', 'Bronze', 'Silver', 'Gold'];

export const parOf = (id) => (PAR[id] && Number.isFinite(PAR[id].total) ? PAR[id] : null);

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
