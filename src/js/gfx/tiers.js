// Quality tiers and a frame-time governor (pattern after games/football/src/js/tiers.js, Hot Springs Games,
// MIT): phones start Low, desktops Medium. The governor only judges frames shorter than 0.2 s (test hooks and tab
// switches make long frames) and never climbs back to a tier it stepped down from.
export const TIERS = {
  low: { aa: false, boards: 0.5, fogFar: 230, particles: 0.4, dprCap: 0.85, shadow: 0 },
  medium: { aa: true, boards: 1, fogFar: 330, particles: 1, dprCap: 1.5, shadow: 1024, shadowR: 40, shadowCrowd: false },
  high: { aa: true, boards: 1, fogFar: 400, particles: 1, dprCap: 2, shadow: 2048, shadowR: 55, shadowCrowd: true, ao: true },
};

export function pickTier(setting) {
  if (setting && setting !== 'auto' && TIERS[setting]) return setting;
  const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const small = Math.min(window.innerWidth, window.innerHeight) < 600;
  return coarse || small ? 'low' : 'medium';
}

export class Governor {
  constructor(tier, auto) { this.tier = tier; this.auto = auto; this.acc = 0; this.n = 0; this.slow = 0; this.floor = null; }
  // returns a new tier name when it decides to step down, else null
  frame(dt, active) {
    if (!this.auto || !active || dt > 0.2 || dt <= 0) return null;
    this.acc += dt; this.n++;
    if (this.acc < 2) return null;
    const avg = this.acc / this.n;
    this.acc = 0; this.n = 0;
    this.slow = avg > 0.024 ? this.slow + 1 : 0;
    if (this.slow >= 2 && this.tier !== 'low') {
      this.tier = this.tier === 'high' ? 'medium' : 'low';
      this.floor = this.tier; this.slow = 0;
      return this.tier;
    }
    return null;
  }
}
