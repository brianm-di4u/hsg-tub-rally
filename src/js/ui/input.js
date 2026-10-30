// Input: keyboard (remappable), gamepads (Gamepad API, polled once per frame) and touch controls folded into
// one intent read by the fixed step. Edges (item, pause, menu) latch until consumed so quick taps are never lost.
// Keyboard/touch structure after games/basketball/src/js/input.js (Hot Springs Games, MIT).

export const DEFAULT_KEYS = {
  left: ['ArrowLeft', 'KeyA'], right: ['ArrowRight', 'KeyD'], push: ['ArrowUp', 'KeyW'], brake: ['ArrowDown', 'KeyS'],
  hop: ['ShiftLeft', 'ShiftRight', 'Space'], item: ['KeyX', 'KeyJ'], back: ['KeyC', 'KeyK'], pause: ['Escape', 'KeyP'],
};
export const I = {
  steer: 0, push: 0, brake: false, hop: false, back: false, item: false, itemP: false, pauseP: false,
  menu: { up: false, down: false, left: false, right: false, ok: false, cancel: false },
  autoPush: false, steerAssist: false, last: 'keyboard', touch: { steer: 0, id: null, push: false, brake: false, hop: false, item: false },
};
let binds = JSON.parse(JSON.stringify(DEFAULT_KEYS));
const keys = new Set();
let enabled = true;
const codeToAction = () => { const m = {}; for (const [a, codes] of Object.entries(binds)) for (const c of codes) m[c] = a; return m; };
let map = codeToAction();
export function setBindings(b) { binds = { ...JSON.parse(JSON.stringify(DEFAULT_KEYS)), ...(b || {}) }; map = codeToAction(); }
export function getBindings() { return binds; }
export function setEnabled(on) { enabled = on; if (!on) { keys.clear(); recompute(); } }
const has = (a) => binds[a].some((c) => keys.has(c));

function recompute() {
  const t = I.touch;
  let s = 0;
  if (has('left')) s -= 1;
  if (has('right')) s += 1;
  if (t.id != null) s = t.steer;
  I.steer = s;
  I.push = has('push') || t.push ? 1 : 0;
  I.brake = has('brake') || t.brake;
  I.hop = has('hop') || t.hop;
  I.back = has('back');
  I.item = has('item') || t.item;
}

export function initInput(onKey) {
  window.addEventListener('keydown', (e) => {
    I.last = 'keyboard';
    const m = I.menu;
    if (e.code === 'ArrowUp' || e.code === 'KeyW') m.up = true;
    if (e.code === 'ArrowDown' || e.code === 'KeyS') m.down = true;
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') m.left = true;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') m.right = true;
    if (e.code === 'Escape' || e.code === 'Backspace') m.cancel = true;
    if (onKey && onKey(e) === true) { e.preventDefault(); return; }
    const a = map[e.code];
    if (!a || !enabled) return;
    e.preventDefault();
    if (e.repeat) return;
    keys.add(e.code);
    if (a === 'item') I.itemP = true;
    if (a === 'pause') I.pauseP = true;
    recompute();
  });
  window.addEventListener('keyup', (e) => { keys.delete(e.code); recompute(); });
  window.addEventListener('blur', () => { keys.clear(); recompute(); });
}

// Gamepads: standard mapping. A push, B brake, R/RT hop, Z/LB/LT item, Y look back, Start pause.
const padPrev = {};
export function pollGamepads() {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  let any = false;
  const pad = { steer: 0, push: false, brake: false, hop: false, back: false, item: false };
  for (const p of pads) {
    if (!p || !p.connected) continue;
    const b = (i) => !!(p.buttons[i] && (p.buttons[i].pressed || p.buttons[i].value > 0.5));
    const ax = Math.abs(p.axes[0]) > 0.18 ? p.axes[0] : (b(14) ? -1 : b(15) ? 1 : 0);
    const prev = padPrev[p.index] || {};
    const now = { a: b(0), b: b(1), x: b(2), y: b(3), lb: b(4), rb: b(5), lt: b(6), rt: b(7), start: b(9), up: b(12) || p.axes[1] < -0.6, down: b(13) || p.axes[1] > 0.6, left: b(14) || p.axes[0] < -0.6, right: b(15) || p.axes[0] > 0.6 };
    const used = ax !== 0 || Object.values(now).some(Boolean);
    if (used) { any = true; I.last = 'gamepad'; }
    pad.steer = ax || pad.steer; pad.push = pad.push || now.a || now.rt; pad.brake = pad.brake || now.b;
    pad.hop = pad.hop || now.rb; pad.back = pad.back || now.y; pad.item = pad.item || now.lb || now.lt || now.x;
    if ((now.lb || now.lt || now.x) && !(prev.lb || prev.lt || prev.x)) I.itemP = true;
    if (now.start && !prev.start) I.pauseP = true;
    const m = I.menu;
    if (now.up && !prev.up) m.up = true; if (now.down && !prev.down) m.down = true;
    if (now.left && !prev.left) m.left = true; if (now.right && !prev.right) m.right = true;
    if (now.a && !prev.a) m.ok = true; if (now.b && !prev.b) m.cancel = true;
    padPrev[p.index] = now;
  }
  I.pad = pad;
  return any;
}

// Touch: the left half of the screen is a steering pad (drag left/right from where the thumb lands); the right
// side has hold buttons. Acts on pointer events (touch and pen), never on synthesized clicks.
export function initTouch(zone, btns) {
  const t = I.touch;
  let x0 = 0;
  zone.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    e.preventDefault(); t.id = e.pointerId; x0 = e.clientX; t.steer = 0;
    try { zone.setPointerCapture(e.pointerId); } catch (err) { /* synthetic */ }
    I.last = 'touch'; recompute();
  });
  zone.addEventListener('pointermove', (e) => {
    if (e.pointerId !== t.id) return;
    const span = Math.max(60, zone.clientWidth * 0.22);
    t.steer = Math.max(-1, Math.min(1, (e.clientX - x0) / span));
    if (Math.abs(t.steer) < 0.08) t.steer = 0;
    zone.style.setProperty('--steer', t.steer.toFixed(2));
    recompute();
  });
  const end = (e) => { if (e.pointerId !== t.id) return; t.id = null; t.steer = 0; zone.style.setProperty('--steer', '0'); recompute(); };
  zone.addEventListener('pointerup', end); zone.addEventListener('pointercancel', end);
  const hold = (el, key, edge) => {
    if (!el) return;
    el.addEventListener('pointerdown', (e) => { e.preventDefault(); el.classList.add('on'); try { el.setPointerCapture(e.pointerId); } catch (err) { /* ok */ } t[key] = true; if (edge) I[edge] = true; I.last = 'touch'; recompute(); });
    const off = () => { el.classList.remove('on'); t[key] = false; recompute(); };
    el.addEventListener('pointerup', off); el.addEventListener('pointercancel', off); el.addEventListener('lostpointercapture', off);
  };
  hold(btns.push, 'push'); hold(btns.brake, 'brake'); hold(btns.hop, 'hop'); hold(btns.item, 'item', 'itemP');
}

// Copy the intent for one fixed step. Edges are consumed.
export function readIntent() {
  const p = I.pad || {};
  const brake = I.brake || !!p.brake;
  const push = I.push || p.push ? 1 : 0;
  const out = { steer: I.steer || p.steer || 0, push: I.autoPush ? (brake ? 0 : 1) : push, brake, hop: I.hop || !!p.hop, back: I.back || !!p.back, item: I.itemP };
  I.itemP = false;
  return out;
}
export function consumeMenu() { const m = { ...I.menu }; for (const k of Object.keys(I.menu)) I.menu[k] = false; return m; }
export function consumePause() { const p = I.pauseP; I.pauseP = false; return p; }
