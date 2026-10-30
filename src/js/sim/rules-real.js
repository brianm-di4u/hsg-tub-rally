// Rules of the Row: the real event's format, turned into a mode (2026 official rules; Sentinel-Record 2016;
// KATV 2026 — see research/town-content.md §1–2).
//  - A straight run down Central Avenue in front of Bathhouse Row, from the Arlington toward the Exchange Street
//    crosswalk (on the Bathhouse Row course: s0 → s1).
//  - Head-to-head heats in a four-tub division bracket (semifinals, final). Battle of the Badge exhibition
//    (fictional fire, police and sheriff teams) runs with no stops.
//  - Judge stops at blue feather flags: the tub must stop and the team does a task (Ring Around the Tub,
//    Bath Toss, jumping jacks, push-ups, yodeling) before pushing on.
//  - Finish with ≥ 10 gallons and all four items, or be disqualified (rules 8–9). Bath tickets are bribes
//    (rule 17); the judges may hand out a head start on a whim (rule 18).
import { makeRace } from './race.js';
import { MIN_FINISH_GAL } from './water.js';
import { TEAMS } from '../data/teams.js';

export const TASKS = {
  ring: { name: 'Ring Around the Tub', how: 'Hold on while the team circles the tub', kind: 'auto', secs: 1.6 },
  toss: { name: 'Bath Toss', how: 'Press ITEM when the soap is over the tub', kind: 'timing' },
  jacks: { name: 'Jumping Jacks', how: 'Tap PUSH six times', kind: 'mash', need: 6 },
  pushups: { name: 'Push-ups', how: 'Alternate LEFT and RIGHT six times', kind: 'alt', need: 6 },
  yodel: { name: 'Yodeling', how: 'Hold HOP for a long yodel', kind: 'hold', secs: 1.3 },
};
export const BADGE_TEAMS = ['engine-six', 'bubble-patrol', 'suds-posse'];

// The run on the Bathhouse Row course: start in front of the Arlington, finish at the Exchange St crosswalk.
export function rowCourse(track) {
  const L = track.length;
  const lm = (id) => (track.json.landmarks || []).find((l) => l.id === id);
  const arl = lm('arlington'), oz = lm('ozark'), sup = lm('superior');
  // start on the Arlington Lawn stretch just before the Superior (the real start is in front of the Arlington;
  // the compressed course bends there, so the line sits where Central straightens)
  const s0 = sup ? track.wrapS(sup.s - 55) : arl ? track.wrapS(arl.s + 20) : track.wrapS(-120);
  const s1 = oz ? track.wrapS(oz.s + 6) : 120;
  const len = track.ds(s0, s1) > 0 ? track.ds(s0, s1) : L - s0 + s1;
  // three judge stops spread along the run (the first past the Superior)
  const stopAt = (f) => track.wrapS(s0 + len * f);
  return { s0, s1, len, stops: [stopAt(0.3), stopAt(0.55), stopAt(0.8)], superior: sup ? sup.s : null };
}

// opts: { teams: [a, b] (human first if any), human: teamId|null, seed, classId, stops: true, tasks: [3 task ids] }
export function makeHeat(track, opts) {
  const C = rowCourse(track);
  const race = makeRace(track, { laps: 1, classId: opts.classId || 'soak', player: opts.human, rivals: opts.teams.filter((t) => t !== opts.human), count: opts.teams.length, seed: opts.seed, mode: 'row', noItems: true, autoplay: opts.autoplay });
  race.row = {
    s0: C.s0, s1: C.s1, len: C.len, stopsOn: opts.stops !== false, label: opts.label || 'Heat',
    stops: (opts.stops === false ? [] : C.stops).map((s, i) => ({ s, task: (opts.tasks || ['ring', 'toss', 'jacks'])[i % 3], len: 12 })),
    dq: {}, done: {},
  };
  // grid: side by side at the start line (s0), the human on the right lane
  const c = track.at(C.s0);
  race.karts.forEach((k, i) => {
    const d = (i - (race.karts.length - 1) / 2) * 4.2;
    const p = track.point(C.s0 - 2, d);
    k.x = p.x; k.z = p.z; k.y = p.y; k.yaw = Math.atan2(c.tx, c.tz); k.s = track.wrapS(C.s0 - 2); k.safeS = k.s;
    k.lap = 1; k.rowDist = 0; k.stopDone = {}; k.task = null;
  });
  // the judges' whim: sometimes one team gets a head start (rule 18)
  const r = race.rng.race;
  if (r.chance(0.35)) { const lucky = race.karts[r.int(race.karts.length)]; lucky.whim = true; }
  race.time = -3.2; race.phase = 'countdown';
  race.stepExtra = stepRow;
  return race;
}

// called by stepRace for mode 'row' after the karts move
export function stepRow(race, track, inputs, dt) {
  const R = race.row;
  race.karts.forEach((k, i) => {
    if (k.finished || R.dq[k.id]) return;
    const along = track.ds(R.s0, k.s);
    k.rowDist = along < -50 ? along + track.length : along;
    // judge stops
    for (const [j, st] of R.stops.entries()) {
      if (k.stopDone[j]) continue;
      const ds = track.ds(st.s, k.s);
      if (ds >= -st.len / 2 && ds <= st.len / 2 && !k.task) {
        k.task = { j, id: st.task, t: 0, n: 0, last: null, hold: 0, ok: false, marker: 0 };
        k.state = 'judge'; k.stateT = 99; k.drift = 0; k.boostT = 0;
        k.events.push({ type: 'judge', task: st.task });
      }
    }
    if (k.task) stepTask(race, k, inputs[i], race.drivers[i], dt);
    // finish line
    if (k.rowDist >= R.len) {
      k.finished = true; k.finishT = race.time; race.finishOrder.push(k.id);
      const items = Object.values(k.items).every(Boolean), water = k.water.gal >= MIN_FINISH_GAL;
      if (!items || !water) { R.dq[k.id] = !water ? 'under 10 gallons' : 'missing an attendant item'; k.events.push({ type: 'dq', why: R.dq[k.id] }); }
      race.events.push({ type: 'finish', kart: k.id });
    }
  });
  const allDone = race.karts.every((k) => k.finished || R.dq[k.id]);
  if (allDone || race.time > 120) finishHeat(race);
}

function stepTask(race, k, inp, drv, dt) {
  const T = k.task, def = TASKS[T.id];
  T.t += dt;
  k.vf *= Math.max(0, 1 - 6 * dt);
  if (drv) { // AI does the task in a time set by difficulty
    const need = { auto: def.secs || 1.6, timing: 1.4, mash: 2.0, alt: 2.4, hold: 1.8 }[def.kind] * (1.25 - drv.cls.aggro * 0.4);
    if (T.t >= need) T.ok = true;
  } else {
    inp = inp || {};
    if (def.kind === 'auto') { if (T.t >= def.secs) T.ok = true; }
    else if (def.kind === 'mash') { const p = inp.push > 0.5; if (p && !T.last) T.n++; T.last = p; if (T.n >= def.need) T.ok = true; }
    else if (def.kind === 'alt') { const s = inp.steer < -0.5 ? -1 : inp.steer > 0.5 ? 1 : 0; if (s && s !== T.last) { T.n++; T.last = s; } if (T.n >= def.need) T.ok = true; }
    else if (def.kind === 'hold') { T.hold = inp.hop ? T.hold + dt : 0; if (T.hold >= def.secs) T.ok = true; }
    else if (def.kind === 'timing') {
      T.marker = (Math.sin(T.t * 3.2) + 1) / 2; // 0..1 swing; the tub sits at 0.42–0.58
      if (inp.item) { if (T.marker > 0.4 && T.marker < 0.6) T.ok = true; else T.t += 0.5; }
    }
    if (T.t > 12) T.ok = true; // the judges give up waiting
  }
  if (T.ok) {
    k.stopDone[T.j] = true; k.task = null; k.state = 'run'; k.stateT = 0;
    k.events.push({ type: 'taskDone', task: T.id });
  }
}

export function finishHeat(race) {
  if (race.phase === 'done') return;
  race.phase = 'done';
  const R = race.row;
  const rows = race.karts.map((k) => ({ kart: k.id, team: k.team, human: k.human, time: k.finished ? k.finishT : null, dq: R.dq[k.id] || (!k.finished ? 'did not finish' : null),
    gal: Math.round(k.water.gal * 10) / 10, items: Object.values(k.items).filter(Boolean).length, tickets: k.tickets, refilled: Math.round(k.water.refilled * 10) / 10 }));
  rows.sort((a, b) => (a.dq ? 1 : 0) - (b.dq ? 1 : 0) || (a.time ?? 1e9) - (b.time ?? 1e9));
  rows.forEach((r, i) => { r.place = i + 1; });
  race.results = rows;
}

// A division bracket of four: two semifinal heats and a final. Returns the pairings; AI-only heats are
// resolved by simulation in the caller (runAiHeat).
export function makeBracket(division, human, rng) {
  const teams = TEAMS.filter((t) => t.div === division).map((t) => t.id);
  const others = teams.filter((t) => t !== human);
  for (let i = others.length - 1; i > 0; i--) { const j = rng.int(i + 1); [others[i], others[j]] = [others[j], others[i]]; }
  const seeds = human ? [human, ...others] : others;
  return { division, semis: [[seeds[0], seeds[3]], [seeds[1], seeds[2]]], winners: [], final: null, champion: null, log: [] };
}

// Awards ceremony (game rules; categories from coverage of the real event)
export function awards(heats, rng) {
  const all = {};
  for (const h of heats) for (const r of h.results) {
    const a = all[r.team] || (all[r.team] = { team: r.team, best: Infinity, tickets: 0, refilled: 0, human: r.human });
    if (r.time != null && !r.dq) a.best = Math.min(a.best, r.time);
    a.tickets += r.tickets || 0; a.refilled += r.refilled || 0;
  }
  const list = Object.values(all);
  const pick = (f) => list.slice().sort(f)[0]?.team;
  return {
    bestOverall: pick((a, b) => a.best - b.best),
    mostSpirit: pick((a, b) => b.tickets - a.tickets || a.best - b.best),
    mostOriginal: list[rng.int(list.length)]?.team, // the judges' taste is a mystery (rule 13)
    fanAward: pick((a, b) => b.refilled - a.refilled),
  };
}
