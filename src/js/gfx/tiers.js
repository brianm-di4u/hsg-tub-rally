// Quality tiers and a frame-time governor (pattern after games/football/src/js/tiers.js, Hot Springs Games,
// MIT): phones start Low, desktops Medium. The governor only judges frames shorter than 0.2 s (test hooks and tab
// switches make long frames). It steps down during a race and may climb one step back between races (C4-03).
export const TIERS = {
  low: { aa: false, boards: 0.5, fogFar: 230, particles: 0.4, dprCap: 1, shadow: 0 },
  medium: { aa: true, boards: 1, fogFar: 330, particles: 1, dprCap: 1.5, shadow: 1024, shadowR: 40, shadowCrowd: false },
  high: { aa: true, boards: 1, fogFar: 400, particles: 1, dprCap: 2, shadow: 2048, shadowR: 55, shadowCrowd: true, ao: true },
};

export function pickTier(setting) {
  if (setting && setting !== 'auto' && TIERS[setting]) return setting;
  const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const small = Math.min(window.innerWidth, window.innerHeight) < 600;
  return coarse || small ? 'low' : 'medium';
}

const ORDER = ['low', 'medium', 'high'];
// What a whole race must have shown before the next scene is built one tier higher: at least 'windows' two-second
// stretches of racing (16 s), none of them averaging slower than 'slowest' seconds a frame (55 frames a second), and
// the drawing work never above 'cpuMs' (a third of a 60 Hz frame). The old values were: no climbing at all.
export const CLIMB = { windows: 8, slowest: 1 / 55, cpuMs: 6 };

export class Governor {
  constructor(tier, auto) {
    this.tier = tier; this.start = tier; this.auto = auto; this.acc = 0; this.n = 0; this.slow = 0; this.floor = null;
    this.climbed = false; this.locked = false; this.last = null; this.beginRace();
  }
  // a new race starts counting from nothing
  beginRace() { this.wasRacing = false; this.windows = 0; this.worst = 0; this.cpu = 0; this.sealed = false; }
  // the race is over: keep what it measured for the next scene to read
  endRace() { if (!this.sealed) { this.sealed = true; this.last = { windows: this.windows, worst: this.worst, cpu: this.cpu }; } }
  // Between races only: the tier to build the next scene at, or null. One step at a time, never above the tier the
  // visit started at (and never High: the sun-shadow and AO parts of High are only built when a visit starts there),
  // never when the player pinned a quality, and never again once a climb has been followed by a drop.
  climb(auto = this.auto) {
    const m = this.last; this.last = null;
    const cap = Math.min(ORDER.indexOf(this.start), ORDER.indexOf('medium')), at = ORDER.indexOf(this.tier);
    if (!m || !auto || !this.auto || this.locked || at >= cap) return null;
    if (m.windows < CLIMB.windows || m.worst > CLIMB.slowest || m.cpu > CLIMB.cpuMs) return null;
    this.tier = ORDER[at + 1]; this.climbed = true; this.slow = 0;
    return this.tier;
  }
  // returns a new tier name when it decides to step down, else null. The racing flag is false through the countdown: those
  // frames still count towards a step down, but not towards the windows a climb needs (K-06), and the stretch that
  // was running when the race began is dropped so no window mixes the two.
  frame(dt, active, cpuMs = 0, racing = true) {
    if (!this.auto || !active || dt > 0.2 || dt <= 0) return null;
    if (racing && !this.wasRacing) { this.acc = 0; this.n = 0; }
    this.wasRacing = racing;
    this.acc += dt; this.n++;
    if (this.acc < 2) return null;
    const avg = this.acc / this.n;
    this.acc = 0; this.n = 0;
    if (racing) { this.windows++; this.worst = Math.max(this.worst, avg); this.cpu = Math.max(this.cpu, cpuMs || 0); }
    this.slow = avg > 0.024 ? this.slow + 1 : 0;
    if (this.slow >= 2 && this.tier !== 'low') {
      this.tier = this.tier === 'high' ? 'medium' : 'low';
      this.floor = this.tier; this.slow = 0;
      if (this.climbed) this.locked = true;
      return this.tier;
    }
    return null;
  }
}
