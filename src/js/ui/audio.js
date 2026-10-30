// Sound: WebAudio synthesis only (no audio files). Starts on the first key or touch (browser autoplay rules),
// quiet by default and mutable. Primitives after hsg-fishing/src/js/audio.js (tone, noise; Hot Springs Games,
// MIT). No motor: a pushed tub sounds like four sets of running feet, a wheel rumble and water slosh.
// Music: original short loops on a tiny step sequencer (ragtime downtown, bluegrass in the mountains, a march for
// Rules of the Row and the Water Fight).

let ctx = null, master = null, sfxBus = null, musicBus = null, noiseBuf = null;
const state = { on: true, music: true, vol: 0.6, started: false, theme: null, step: 0, nextT: 0, timer: null };

export function initAudio(settings) {
  state.on = settings.sound !== false; state.music = settings.music !== false; state.vol = settings.volume ?? 0.6;
  const start = () => { if (!state.started) unlock(); };
  window.addEventListener('keydown', start, { once: false });
  window.addEventListener('pointerdown', start, { once: false });
}

function unlock() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = state.on ? state.vol * 0.5 : 0; master.connect(ctx.destination);
    sfxBus = ctx.createGain(); sfxBus.gain.value = 0.9; sfxBus.connect(master);
    musicBus = ctx.createGain(); musicBus.gain.value = state.music ? 0.32 : 0; musicBus.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    state.started = true;
    buildLoops();
    if (state.theme) playTheme(state.theme, true);
  } catch (e) { ctx = null; }
}

export function setAudio(settings) {
  state.on = settings.sound !== false; state.music = settings.music !== false; state.vol = settings.volume ?? state.vol;
  if (!ctx) return;
  master.gain.setTargetAtTime(state.on ? state.vol * 0.5 : 0, ctx.currentTime, 0.05);
  musicBus.gain.setTargetAtTime(state.music ? 0.32 : 0, ctx.currentTime, 0.05);
}
export function audioState() { return { started: state.started, on: state.on, music: state.music, theme: state.theme, ctx: ctx ? ctx.state : 'none' }; }

function tone(freq, dur, { type = 'square', vol = 0.2, at = 0, slide = 0, attack = 0.005, bus = sfxBus, filter = 0 } = {}) {
  if (!ctx) return;
  const t = ctx.currentTime + at, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq * slide), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  let node = o;
  if (filter) { const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = filter; o.connect(f); node = f; }
  node.connect(g); g.connect(bus);
  o.start(t); o.stop(t + dur + 0.02);
}
function noise(dur, { vol = 0.2, at = 0, type = 'bandpass', freq = 1200, q = 1, sweep = 0, bus = sfxBus } = {}) {
  if (!ctx) return;
  const t = ctx.currentTime + at, s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = noiseBuf; s.loop = true;
  f.type = type; f.frequency.setValueAtTime(freq, t); f.Q.value = q;
  if (sweep) f.frequency.exponentialRampToValueAtTime(Math.max(40, freq * sweep), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(bus);
  s.start(t, Math.random()); s.stop(t + dur + 0.02);
}

export const SFX = {
  quack() { tone(520, 0.09, { type: 'sawtooth', vol: 0.12, slide: 0.7, filter: 1600 }); tone(470, 0.11, { type: 'sawtooth', vol: 0.12, slide: 0.65, at: 0.1, filter: 1500 }); },
  splash(big = false) { noise(big ? 0.5 : 0.28, { vol: big ? 0.3 : 0.18, freq: 1800, q: 0.7, sweep: 0.4 }); },
  steam() { noise(0.45, { vol: 0.12, type: 'highpass', freq: 3500, q: 0.5 }); },
  snap() { noise(0.06, { vol: 0.3, freq: 2600, q: 2 }); tone(180, 0.05, { type: 'triangle', vol: 0.15 }); },
  whistle() { for (let i = 0; i < 3; i++) tone(2400 + (i % 2) * 300, 0.09, { type: 'sine', vol: 0.12, at: i * 0.09 }); },
  cheer() { noise(1.2, { vol: 0.1, freq: 900, q: 0.4 }); noise(0.9, { vol: 0.06, freq: 2200, q: 0.6, at: 0.15 }); },
  bump() { tone(90, 0.12, { type: 'sine', vol: 0.3, slide: 0.6 }); noise(0.08, { vol: 0.12, freq: 400 }); },
  pickup() { [660, 880, 1320].forEach((f, i) => tone(f, 0.08, { type: 'triangle', vol: 0.12, at: i * 0.05 })); },
  ticket() { tone(1568, 0.25, { type: 'sine', vol: 0.12 }); tone(2093, 0.3, { type: 'sine', vol: 0.08, at: 0.05 }); },
  boost() { noise(0.6, { vol: 0.14, freq: 600, q: 0.8, sweep: 4 }); tone(220, 0.5, { type: 'sawtooth', vol: 0.06, slide: 2, filter: 1200 }); },
  hit() { this.splash(true); tone(300, 0.2, { type: 'square', vol: 0.08, slide: 0.5, filter: 900 }); },
  ready() { tone(440, 0.18, { type: 'square', vol: 0.1, filter: 2000 }); },
  go() { tone(880, 0.5, { type: 'square', vol: 0.12, filter: 2400 }); tone(1320, 0.5, { type: 'triangle', vol: 0.06 }); },
  menu() { tone(990, 0.04, { type: 'square', vol: 0.06, filter: 3000 }); },
  lap() { [523, 659, 784].forEach((f, i) => tone(f, 0.12, { type: 'square', vol: 0.08, at: i * 0.08, filter: 2500 })); },
  finish() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, { type: 'square', vol: 0.09, at: i * 0.12, filter: 2600 })); this.cheer(); },
};
export function sfx(name, ...a) { if (ctx && state.on && SFX[name]) SFX[name](...a); }

// Continuous tub sounds, driven every frame by the player's tub: footsteps tick faster with speed, a rumble
// rises with speed, slosh follows spilling.
let footT = 0, rumble = null;
export function tubLoop(k, dt, active) {
  if (!ctx || !state.on) return;
  if (!rumble) {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf; s.loop = true; f.type = 'lowpass'; f.frequency.value = 220; g.gain.value = 0;
    s.connect(f); f.connect(g); g.connect(sfxBus); s.start();
    rumble = { s, f, g };
  }
  const v = active && k ? Math.abs(k.vf) : 0;
  rumble.g.gain.setTargetAtTime(Math.min(0.12, v * 0.006), ctx.currentTime, 0.08);
  rumble.f.frequency.setTargetAtTime(160 + v * 18, ctx.currentTime, 0.1);
  if (!active || !k || v < 0.8 || k.state === 'judge') return;
  footT -= dt;
  if (footT <= 0) { footT = Math.max(0.07, 0.34 - v * 0.012); noise(0.035, { vol: 0.05, freq: 500 + Math.random() * 300, q: 1.5 }); }
  if (k.water.spillFx > 0.25 && Math.random() < 0.06) sfx('splash');
}

// ---- music: tiny step sequencer (16th notes), original loops ----
const N = (s) => s.split(' ').map((t) => (t === '.' ? 0 : t === '-' ? -1 : noteHz(t)));
function noteHz(n) { const m = n.match(/^([A-G])(#?)(\d)$/); if (!m) return 0; const k = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]] + (m[2] ? 1 : 0); return 440 * Math.pow(2, (k - 9) / 12 + (+m[3] - 4)); }
let LOOPS = {};
function buildLoops() {
  LOOPS = {
    // "Central Avenue Rag": oom-pah bass, syncopated lead (original)
    rag: { bpm: 118, lead: N('E5 . G5 . A5 G5 . E5 D5 . C5 . D5 E5 . . C5 . E5 . G5 . A5 . C6 . A5 G5 E5 . . . F5 . A5 . C6 A5 . F5 E5 . G5 . E5 D5 . . D5 . E5 F5 G5 . E5 . D5 . C5 . D5 . . .'),
      bass: N('C3 . G3 . C3 . G3 . F2 . C3 . F2 . C3 . A2 . E3 . A2 . E3 . D3 . A3 . G2 . D3 . F2 . C3 . F2 . C3 . C3 . G3 . E3 . G3 . G2 . D3 . G2 . B2 . C3 . G3 . C3 . . .'), leadType: 'square', bassType: 'triangle', drums: 'x...h...x.x.h...' },
    // "Switchback Breakdown": banjo-ish rolls over a bouncing bass (original)
    grass: { bpm: 132, lead: N('G4 B4 D5 G5 D5 B4 G4 B4 C5 E5 G5 E5 C5 E5 G5 E5 D5 F#5 A5 F#5 D5 F#5 A5 F#5 G4 B4 D5 G5 D5 B4 G4 . G4 B4 D5 G5 D5 B4 G4 B4 C5 E5 G5 E5 C5 E5 G5 E5 D5 F#5 A5 D6 A5 F#5 D5 F#5 G5 D5 B4 G4 G4 . . .'),
      bass: N('G2 . D3 . G2 . D3 . C3 . G3 . C3 . G3 . D3 . A3 . D3 . A3 . G2 . D3 . G2 . D3 . G2 . D3 . G2 . D3 . C3 . G3 . C3 . G3 . D3 . A3 . D3 . A3 . G2 . D3 . G2 . . .'), leadType: 'sawtooth', bassType: 'triangle', drums: 'x.h.x.h.x.h.x.hh', pluck: true },
    // "Park Avenue After Dark": a slow swing with walking bass (original)
    swing: { bpm: 104, lead: N('G4 . . A#4 . C5 . D5 . . . F5 . D5 . . C5 . . A#4 . G4 . . F4 . G4 . . . . . G4 . . A#4 . C5 . D5 . . . G5 . F5 . D5 C5 . . A#4 . C5 . D5 . . . . . . .'),
      bass: N('G2 . A2 . A#2 . B2 . C3 . D3 . D#3 . E3 . F2 . G2 . A2 . A#2 . C3 . A#2 . A2 . F2 . G2 . A2 . A#2 . B2 . C3 . D3 . D#3 . E3 . F2 . A2 . C3 . D3 . G2 . . .'), leadType: 'triangle', bassType: 'triangle', drums: 'x..h.hx..h.hx..h' },
    // "Judges' March" (original)
    march: { bpm: 112, lead: N('C5 . . C5 E5 . G5 . E5 . C5 . G4 . . . A4 . . A4 C5 . F5 . E5 . D5 . C5 . . . C5 . . C5 E5 . G5 . C6 . A5 . G5 . . . F5 . E5 . D5 . G4 . C5 . . . . . . .'),
      bass: N('C3 . G2 . C3 . G2 . C3 . G2 . C3 . G2 . F2 . C3 . F2 . C3 . G2 . D3 . G2 . D3 . C3 . G2 . C3 . G2 . A2 . E3 . A2 . E3 . F2 . C3 . G2 . D3 . C3 . G2 . C3 . . .'), leadType: 'square', bassType: 'square', drums: 'x...x...x...xhxh' },
  };
}
export function playTheme(name, force = false) {
  if (state.theme === name && !force && state.timer) return;
  state.theme = name;
  if (!ctx) return;
  if (state.timer) clearInterval(state.timer);
  const L = LOOPS[name];
  if (!L) return;
  state.step = 0; state.nextT = ctx.currentTime + 0.1;
  const sixteenth = 60 / L.bpm / 4;
  state.timer = setInterval(() => {
    if (!ctx) return;
    while (state.nextT < ctx.currentTime + 0.15) {
      const i = state.step % L.lead.length, at = state.nextT - ctx.currentTime;
      const ln = L.lead[i], bn = L.bass[i % L.bass.length], dr = L.drums[i % L.drums.length];
      if (ln > 0) tone(ln, L.pluck ? sixteenth * 1.6 : sixteenth * 1.8, { type: L.leadType, vol: L.pluck ? 0.07 : 0.05, at, filter: L.pluck ? 2600 : 2200, bus: musicBus, attack: 0.004 });
      if (bn > 0) tone(bn, sixteenth * 1.9, { type: L.bassType, vol: 0.09, at, filter: 900, bus: musicBus });
      if (dr === 'x') { tone(70, 0.12, { type: 'sine', vol: 0.12, slide: 0.5, at, bus: musicBus }); }
      if (dr === 'h') noise(0.03, { vol: 0.03, type: 'highpass', freq: 7000, at, bus: musicBus });
      state.step++; state.nextT += sixteenth;
    }
  }, 50);
}
export function stopTheme() { if (state.timer) clearInterval(state.timer); state.timer = null; state.theme = null; }
