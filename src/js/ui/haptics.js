// Haptics (wave 3, S5-19): a short buzz on a phone (navigator.vibrate) and a rumble on a gamepad (dual-rumble) for the
// events a player should feel: a wall, a bump, a landing, a boost, a dropped item, the slide's Warm and Hot ticks.
// Off when the Vibration switch is off or the player asked for reduced motion. Nothing here is heard or seen, so a
// browser without vibrate or without a rumble motor simply does nothing.
export const HAPTICS = {
  wall: { ms: 15, pad: [0.35, 0.25] },
  bump: { ms: 15, pad: [0.35, 0.25] },
  land: { ms: 20, pad: [0.5, 0.2] },
  boost: { ms: [20, 30, 20], pad: [0.4, 0.7] },
  fumble: { ms: 40, pad: [0.8, 0.5] },
  warm: { ms: 10, pad: [0.1, 0.4] },
  hot: { ms: 10, pad: [0.15, 0.7] },
};
const state = { on: false, reduced: false, count: 0, last: '' };
export function setHaptics(on, reduced) { state.on = !!on; state.reduced = !!reduced; }
export const hapticInfo = () => ({ on: state.on, reduced: state.reduced, count: state.count, last: state.last });
// the longest a pad buzz lasts, in ms (a pattern's pauses count, so a boost rumbles for its whole length)
const total = (ms) => (Array.isArray(ms) ? ms.reduce((a, b) => a + b, 0) : ms);
export function haptic(name) {
  const h = HAPTICS[name];
  if (!h || !state.on || state.reduced) return;
  state.count++; state.last = name;
  try { if (navigator.vibrate) navigator.vibrate(h.ms); } catch (e) { /* some browsers refuse outside a gesture */ }
  try {
    for (const p of navigator.getGamepads ? navigator.getGamepads() : []) {
      const a = p && p.connected && (p.vibrationActuator || (p.hapticActuators && p.hapticActuators[0]));
      if (a && a.playEffect) a.playEffect('dual-rumble', { duration: Math.max(40, total(h.ms)), strongMagnitude: h.pad[0], weakMagnitude: h.pad[1] }).catch(() => {});
    }
  } catch (e) { /* no rumble motor */ }
}
