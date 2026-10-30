// Water Fight: a battle in the Hill Wheatley Plaza arena (game mode). Eight tubs circle the plaza's thermal jug
// fountain; item hits throw out twice the usual water; a tub that runs dry is out. The last tub holding water
// wins, or the fullest tub when the clock runs out. Refills only at the fountain (and a trickle from the crowd).
import { makeRace } from './race.js';

export const BATTLE_SECS = 150;

export function makeBattle(track, opts) {
  const race = makeRace(track, { laps: 99, classId: opts.classId || 'soak', player: opts.human, count: opts.count ?? 8, seed: opts.seed, mode: 'battle', noItems: false, autoplay: opts.autoplay, rivals: opts.rivals });
  // spread the tubs evenly around the ring
  const n = race.karts.length, L = track.length;
  race.karts.forEach((k, i) => {
    const s = (i / n) * L, c = track.at(s), p = track.point(s, 0);
    k.x = p.x; k.z = p.z; k.y = p.y; k.yaw = Math.atan2(c.tx, c.tz); k.s = s; k.safeS = s; k.lap = 1;
    k.water.gal = k.water.cap * 0.9; // start a little below full so the fountain matters from the off
  });
  race.hitMul = 1.6;
  race.battle = { out: [], secs: BATTLE_SECS };
  race.stepExtra = stepBattle;
  return race;
}

function stepBattle(race, track, inputs, dt) {
  const B = race.battle;
  for (const k of race.karts) {
    if (k.out) { k.vf *= Math.max(0, 1 - 3 * dt); continue; }
    k.rowDist = k.water.gal; // standings: most water first
    if (k.water.gal <= 0.2 && race.phase === 'race') {
      k.out = true; k.finished = true; k.finishT = race.time; k.state = 'run'; k.held = null;
      B.out.push(k.id);
      k.events.push({ type: 'drained' });
      race.events.push({ type: 'drained', kart: k.id });
    }
  }
  const alive = race.karts.filter((k) => !k.out);
  if (alive.length <= 1 || race.time >= B.secs) finishBattle(race);
}

export function finishBattle(race) {
  if (race.phase === 'done') return;
  race.phase = 'done';
  const B = race.battle;
  const alive = race.karts.filter((k) => !k.out).sort((a, b) => b.water.gal - a.water.gal);
  const order = [...alive, ...B.out.slice().reverse().map((id) => race.karts[id])];
  race.results = order.map((k, i) => ({
    place: i + 1, kart: k.id, team: k.team, human: k.human, time: k.out ? k.finishT : race.time, estimated: false,
    gal: Math.round(k.water.gal * 10) / 10, items: Object.values(k.items).filter(Boolean).length, clean: false,
    points: Math.max(0, 8 - i), tickets: k.tickets, out: !!k.out,
  }));
}
