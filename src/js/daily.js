// The Daily Race (S3-02): everyone who opens the game on the same local date gets the same course, tub and rivals.
// Pure helpers (no DOM) so the save and the tests can share them.
import { TEAMS } from './data/teams.js';

export const DAILY_LAPS = 2;       // a short race: it is played every day
export const DAILY_CLASS = 'soak'; // the middle class, so the day's board is the same for everyone
export const DAILY_KEEP = 60;      // dated results kept in the save

const pad = (n) => (n < 10 ? '0' : '') + n;
export const dateKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const validKey = (k) => typeof k === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(k) && !Number.isNaN(Date.parse(k + 'T00:00:00Z'));
// whole days since 1970 for a date key (UTC arithmetic, so daylight-saving changes cannot split a day)
export const dayNumber = (k) => Math.round(Date.parse(k + 'T00:00:00Z') / 86400000);
export const addDays = (k, n) => new Date((dayNumber(k) + n) * 86400000).toISOString().slice(0, 10);

function hash(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  h ^= h >>> 15; h = Math.imul(h, 2246822507) >>> 0; h ^= h >>> 13;
  return h >>> 0;
}

// The day's deal. `courses` is the list of built course ids, in registry order.
export function dailyPlan(key, courses) {
  const h = hash('tub-rally-daily:' + key);
  return { date: key, track: courses[h % courses.length], team: TEAMS[(h >>> 8) % TEAMS.length].id, classId: DAILY_CLASS, laps: DAILY_LAPS, seed: 1 + (hash('seed:' + key) % 999999999) };
}

// Streak bookkeeping lives in the save as { n, last }: a day played the day after `last` extends it, any gap restarts it.
export function nextStreak(streak, key) {
  const s = streak && Number.isFinite(streak.n) ? streak : { n: 0, last: '' };
  if (!validKey(key) || (validKey(s.last) && dayNumber(key) <= dayNumber(s.last))) return { n: s.n, last: s.last };
  return { n: validKey(s.last) && dayNumber(key) - dayNumber(s.last) === 1 ? s.n + 1 : 1, last: key };
}
// What to show on `today`: the streak is alive while its last day is today or yesterday
export function liveStreak(streak, today) {
  if (!streak || !validKey(streak.last) || !(streak.n > 0)) return 0;
  const gap = dayNumber(today) - dayNumber(streak.last);
  return gap === 0 || gap === 1 ? streak.n : 0;
}
// the better of two results for one day: the higher place, then the faster time
export function betterDaily(a, b) {
  if (!a) return b;
  if (!b) return a;
  return b.place < a.place || (b.place === a.place && b.time < a.time) ? b : a;
}
