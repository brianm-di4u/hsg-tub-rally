// Water in the tub: ballast and health. A damped two-axis tilt oscillator (forward / right) is driven by the
// tub's acceleration; water spills while the tilt exceeds the rim angle, which shrinks as the tub fills.
// The real rule (2026 official rules, rule 9): the tub starts full and must cross the line with ≥ 10 gallons.

export const MIN_FINISH_GAL = 10;

const OMEGA = 7.5; // slosh natural frequency (rad/s)
const ACC_GAIN = 0.04; // tilt (rad) per m/s² of acceleration at rest
const SPILL_K = 5; // gallons per second per radian of excess tilt, at full capacity

export function makeWater(capGal) {
  return { gal: capGal, cap: capGal, tf: 0, tr: 0, vf: 0, vr: 0, spilled: 0, refilled: 0, spillFx: 0, dryT: 0 };
}

// aF / aR: acceleration of the tub along its forward and right axes (m/s²).
export function stepWater(w, aF, aR, stats, dt) {
  const zeta = 0.22 / stats.slosh;
  const g = ACC_GAIN * stats.slosh;
  // water lags the tub: forward acceleration tips it backward (negative tf)
  const af = -OMEGA * OMEGA * w.tf - 2 * zeta * OMEGA * w.vf - aF * g * OMEGA * OMEGA;
  const ar = -OMEGA * OMEGA * w.tr - 2 * zeta * OMEGA * w.vr - aR * g * OMEGA * OMEGA;
  w.vf += af * dt; w.vr += ar * dt;
  w.tf += w.vf * dt; w.tr += w.vr * dt;
  const fill = w.cap > 0 ? w.gal / w.cap : 0;
  const rim = (0.085 + 0.5 * (1 - fill)) * stats.rim;
  const tilt = Math.hypot(w.tf, w.tr);
  let spill = 0;
  if (tilt > rim && w.gal > 0) {
    spill = SPILL_K * (tilt - rim) * (0.35 + 0.65 * fill) * (w.cap / 38) * dt;
    // the spill itself calms the surface a little
    const k = Math.max(0.6, 1 - 2.2 * dt);
    w.vf *= k; w.vr *= k;
  }
  if (spill > 0) removeWater(w, spill);
  w.spillFx = Math.max(0, w.spillFx - dt * 2);
  if (w.gal <= 0.01) w.dryT += dt; else w.dryT = 0;
  return spill;
}

export function removeWater(w, gal) {
  const g = Math.min(w.gal, Math.max(0, gal));
  w.gal -= g;
  w.spilled += g;
  w.spillFx = Math.min(1, w.spillFx + g * 0.6);
  return g;
}

export function addWater(w, gal) {
  const g = Math.min(w.cap - w.gal, Math.max(0, gal));
  w.gal += g;
  w.refilled += g;
  return g;
}

// A sudden jolt (landing, wall hit, item hit, bump) sloshes the water and throws some out.
export function jolt(w, impulseF, impulseR, gal) {
  w.vf -= impulseF * 0.06;
  w.vr -= impulseR * 0.06;
  return removeWater(w, gal);
}
