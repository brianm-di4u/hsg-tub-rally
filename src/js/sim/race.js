// A race: grid, countdown ("Ready… set… SCRUB!"), laps and checkpoints, standings, finish and results.
// Pure sim (no DOM, no three.js). One serializable object; `stepRace` advances it one fixed tick.
import { makeKart, stepKart, collideKarts } from './kart.js';
import { makeDriver, driveAI } from './ai.js';
import { makeStreams } from '../rng.js';
import { TEAMS, CLASSES } from '../data/teams.js';
import { MIN_FINISH_GAL } from './water.js';
import { stepItems, makeItemState } from './items.js';

export const DT = 1 / 60;
export const COUNTDOWN = 3.2; // seconds: Ready (0..1.1) Set (1.1..2.2) SCRUB! at 3.2? see phaseLabel

export function gridPoses(track, n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / 2), col = i % 2;
    const s = track.wrapS(-8 - row * 7.5 - col * 2.5);
    const c = track.at(s);
    const half = Math.min(c.wl, c.wr);
    const d = (col === 0 ? -1 : 1) * Math.min(3.2, half - 1.6);
    const p = track.point(s, d);
    out.push({ x: p.x, z: p.z, y: p.y, yaw: Math.atan2(c.tx, c.tz), s });
  }
  return out;
}

// opts: { laps, classId, player: teamId | null, rivals: [teamId…], seed, mode, noItems }
export function makeRace(track, opts = {}) {
  const seed = opts.seed ?? 1;
  const rng = makeStreams(seed);
  const classId = opts.classId || 'soak';
  const n = opts.count ?? 8;
  const ids = [];
  if (opts.player) ids.push(opts.player);
  const pool = (opts.rivals && opts.rivals.length ? opts.rivals : TEAMS.map((t) => t.id)).filter((id) => !ids.includes(id));
  while (ids.length < n && pool.length) ids.push(pool.splice(rng.race.int(pool.length), 1)[0]);
  // the player starts at the back of the grid; rivals in random order ahead
  const order = ids.slice(opts.player ? 1 : 0);
  if (opts.player) order.push(opts.player);
  const poses = gridPoses(track, order.length);
  const karts = order.map((id, i) => makeKart(i, id, classId, poses[i], { human: id === opts.player }));
  const drivers = karts.map((k) => (k.human && !opts.autoplay ? null : makeDriver(k, classId, rng.ai, k.human ? 1.02 : 0.94 + rng.ai.next() * 0.1)));
  return {
    v: 1, trackId: track.id, mode: opts.mode || 'race', classId, laps: opts.laps ?? 3, seed, time: -COUNTDOWN,
    phase: 'countdown', karts, drivers, rng, player: karts.findIndex((k) => k.human), finishOrder: [],
    items: makeItemState(track, opts), noItems: !!opts.noItems, results: null, tick: 0, pushAtGo: {},
    events: [],
  };
}

export function phaseLabel(race) {
  if (race.phase !== 'countdown') return race.time < 1.0 && race.phase === 'race' ? 'SCRUB!' : '';
  const t = race.time + COUNTDOWN;
  return t < 1.1 ? 'READY' : t < 2.2 ? 'SET' : '…';
}

export function progressOf(track, k) {
  if (k.lap <= 0) return k.s - track.length;
  return (k.lap - 1) * track.length + k.s;
}

export function stepRace(race, track, inputs, dt = DT) {
  race.tick++;
  race.events.length = 0;
  const L = track.length;
  if (race.phase === 'countdown') {
    race.time += dt;
    // a push held from READY is a false start; a press in the last moment before SCRUB! is a start boost
    race.karts.forEach((k, i) => {
      const inp = k.human ? inputs[i] || {} : null;
      const pushing = inp ? inp.push > 0.5 : race.drivers[i] && race.rng.ai.next() < 0.02;
      const t = race.time;
      if (pushing && race.pushAtGo[i] == null) race.pushAtGo[i] = t;
      if (!pushing && inp) race.pushAtGo[i] = null;
    });
    if (race.time >= 0) {
      race.phase = 'race';
      race.time = 0;
      race.karts.forEach((k, i) => {
        const t0 = race.pushAtGo[i];
        if (t0 != null && t0 > -0.45) { k.boostT = 0.9; k.boostKind = 'start'; k.events.push({ type: 'boost', kind: 'start' }); }
        else if (t0 != null && t0 < -1.6) { k.state = 'swap'; k.stateT = 0.7; }
        else if (!k.human && race.drivers[i] && race.rng.ai.next() < 0.45 * race.drivers[i].cls.aggro) { k.boostT = 0.7; k.boostKind = 'start'; }
      });
    }
    return;
  }
  if (race.phase === 'done') { race.time += dt; }
  else race.time += dt;

  const leaderProg = Math.max(...race.karts.map((k) => progressOf(track, k)));
  const human = race.player >= 0 ? race.karts[race.player] : null;
  const raceFrac = Math.min(1, Math.max(0, leaderProg / (race.laps * L)));
  race.karts.forEach((k, i) => {
    let inp = inputs[i];
    let capMul = 1;
    const drv = race.drivers[i];
    if (drv) {
      // rubber band toward the human (or the leader when there is none), fading out late in the race
      const ref = human ? progressOf(track, human) : leaderProg;
      const gap = ref - progressOf(track, k);
      const fade = raceFrac > 0.7 ? Math.max(0, 1 - (raceFrac - 0.7) / 0.3) : 1;
      capMul = 1 + Math.max(-1, Math.min(1, gap / 70)) * drv.cls.rubber * fade;
      inp = driveAI(k, drv, track, { capMul, race }, dt);
    }
    inp = inp || { steer: 0, push: 0, brake: false, hop: false };
    const prevS = k.s;
    stepKart(k, inp, track, dt, { capMul: drv ? capMul : 1 });
    k.lastInput = inp;
    updateLaps(race, track, k, prevS);
  });
  collideKarts(race.karts, dt);
  if (!race.noItems) stepItems(race, track, inputs, dt);
  // standings
  const ranked = race.karts.slice().sort((a, b) => {
    if (a.finished && b.finished) return a.finishT - b.finishT;
    if (a.finished) return -1;
    if (b.finished) return 1;
    return progressOf(track, b) - progressOf(track, a);
  });
  ranked.forEach((k, p) => { k.place = p + 1; });
  // end: when the human finishes, give the others up to 12 s, then estimate the rest
  if (race.phase === 'race') {
    const allDone = race.karts.every((k) => k.finished);
    const firstT = race.finishOrder.length ? race.karts[race.finishOrder[0]].finishT : Infinity;
    const timeout = human ? (human.finished && race.time - human.finishT > 12) : race.time - firstT > 20;
    if (allDone || timeout || race.time > race.laps * track.length / 4) finishRace(race, track);
  }
}

function updateLaps(race, track, k, prevS) {
  const L = track.length, s = k.s, cps = track.cps;
  if (k.finished) return;
  // forward crossing of the start line
  if (prevS > L - 80 && s < 80 && prevS > s) {
    if (k.lap === 0) { k.lap = 1; k.cpNext = 0; k.lapStart = race.time; }
    else if (k.cpNext >= Math.ceil(cps.length * 0.85)) {
      k.lapTimes.push(race.time - k.lapStart);
      k.lapStart = race.time;
      k.lap++; k.cpNext = 0;
      race.events.push({ type: 'lap', kart: k.id, lap: k.lap });
      if (k.lap > race.laps) {
        k.finished = true; k.finishT = race.time; race.finishOrder.push(k.id);
        k.clean = k.water.gal >= MIN_FINISH_GAL && Object.values(k.items).every(Boolean);
        race.events.push({ type: 'finish', kart: k.id });
      }
    }
  } else if (prevS < 80 && s > L - 80 && prevS < s) {
    // backed over the line
    if (k.lap > 0) { k.lap--; k.cpNext = cps.length; }
  }
  // checkpoints in order
  while (k.lap > 0 && k.cpNext < cps.length) {
    const cs = cps[k.cpNext] * track.step;
    const ahead = track.ds(cs, s);
    if (ahead >= 0 && ahead < 60) k.cpNext++; else break;
  }
}

export const POINTS = [10, 8, 6, 5, 4, 3, 2, 1];

export function finishRace(race, track) {
  race.phase = 'done';
  const L = track.length;
  // estimate unfinished times from remaining distance at their recent pace
  const est = race.karts.map((k) => {
    if (k.finished) return { k, t: k.finishT };
    const remain = race.laps * L - progressOf(track, k);
    const pace = Math.max(8, Math.abs(k.vf) || 12);
    return { k, t: race.time + remain / pace };
  });
  est.sort((a, b) => a.t - b.t);
  race.results = est.map(({ k, t }, i) => ({
    place: i + 1, kart: k.id, team: k.team, human: k.human, time: t, estimated: !k.finished,
    gal: Math.round(k.water.gal * 10) / 10, items: Object.values(k.items).filter(Boolean).length,
    clean: k.finished ? !!k.clean : k.water.gal >= MIN_FINISH_GAL && Object.values(k.items).every(Boolean),
    points: POINTS[i] ?? 0, tickets: k.tickets, bestLap: k.lapTimes.length ? Math.min(...k.lapTimes) : null,
  }));
  race.results.forEach((r) => { if (r.clean) r.points += 1; });
}

export { CLASSES };
