// Sound: WebAudio synthesis only (no audio files). Starts on the first key or touch (browser autoplay rules),
// quiet by default and mutable. Primitives after hsg-fishing/src/js/audio.js (tone, noise; Hot Springs Games,
// MIT). No motor: a pushed tub sounds like four sets of running feet, a wheel rumble and water slosh.
// Music: original short loops on a tiny step sequencer (ragtime downtown, bluegrass in the mountains, a march for
// Rules of the Row and the Water Fight).

import { HOT_T } from '../sim/kart.js';

let ctx = null, rev = null, comp = null, master = null, sfxBus = null, musicBus = null, musicLP = null, noiseBuf = null;
// bus levels (the mix the game ships; audioRender measures them at SHIP_VOL, the default volume setting)
const SHIP_VOL = 0.6;
// Each line keeps the pre-wave value beside it (wave 2, S5-01): edit one line to reverse a step.
const MASTER_K = 0.8;     // was 0.5
const SFX_BUS = 1.0;      // was 0.9
const MUSIC_BUS = 1.0;    // was 0.32 (the old tunes peaked at 0.02 on the output); see MUSIC_TRIM
const MUSIC_TRIM = { rag: 0.771, grass: 0.71, swing: 0.794, march: 0.787 }; // per tune, so each peaks about 0.13 at the shipped volume
const KICK_VOL = 0.07;    // was 0.12: a softer kick lowers the peak-to-average gap so the tune can be heard at a quiet peak
const COMP = { threshold: -14, ratio: 4, knee: 8, attack: 0.004, release: 0.25 }; // limiter between master and speakers (none before)
const REVERB_WET = 0.7;
const DUCK_DB = 6, DUCK_MS = 300; // music dips this much under the big cues
// Per-cue output trim, found with audioRender so every gameplay cue peaks 0.25 to 0.45 at the shipped volume.
const CUE_TRIM = { quack: 3.48, splash: 13.2, steam: 7.8, snap: 4.727, whistle: 2.303, cheer: 7.3, bump: 6.03, pickup: 3.096, ticket: 4.856, boost: 6.7, hit: 4.586, ready: 6.581, go: 4.4, menu: 16.265, lap: 2.55, finish: 2.527, finalLap: 3.66, charge: 8.188, land: 6.03, swish: 10.293 };
const DUCKS = { boost: 1, hit: 1, finish: 1.9 };
const state = { cues: [], ducks: 0, on: true, music: true, vol: 0.6, started: false, theme: null, muffle: false, step: 0, nextT: 0, timer: null };

const MUFFLE_HZ = 900, OPEN_HZ = 5200; // OPEN_HZ was 22000: a gentle low-pass keeps the tune under the cues
const musicLevel = () => (state.music ? MUSIC_BUS * (state.muffle ? 0.4 : 1) : 0);

// The bus tree is built by one function so a test can build the same tree on an OfflineAudioContext.
function makeBuses(c, vol, muffled) {
  const b = {};
  b.comp = c.createDynamicsCompressor();
  for (const k of Object.keys(COMP)) b.comp[k].value = COMP[k];
  b.comp.connect(c.destination);
  b.master = c.createGain(); b.master.gain.value = vol * MASTER_K; b.master.connect(b.comp);
  b.sfx = c.createGain(); b.sfx.gain.value = SFX_BUS; b.sfx.connect(b.master);
  b.lp = c.createBiquadFilter(); b.lp.type = 'lowpass'; b.lp.frequency.value = muffled ? MUFFLE_HZ : OPEN_HZ; b.lp.connect(b.master);
  b.music = c.createGain(); b.music.gain.value = MUSIC_BUS * (muffled ? 0.4 : 1); b.music.connect(b.lp);
  // a short room for splashes, cheers and whistles: 0.4 s of decaying noise, sent to the sfx bus at a low level
  b.rev = c.createConvolver(); b.rev.buffer = c.createBuffer(2, Math.floor(c.sampleRate * 0.4), c.sampleRate);
  for (let ch = 0; ch < 2; ch++) { const d = b.rev.buffer.getChannelData(ch); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 2.5; }
  const wet = c.createGain(); wet.gain.value = REVERB_WET; b.rev.connect(wet); wet.connect(b.sfx);
  b.noise = c.createBuffer(1, c.sampleRate, c.sampleRate);
  const d = b.noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}
function bindBuses(b) { rev = b.rev; comp = b.comp; master = b.master; sfxBus = b.sfx; musicLP = b.lp; musicBus = b.music; noiseBuf = b.noise; }
// Run fn with the module's audio graph pointed at another context (an offline one), then restore the live one.
// Everything inside fn is synchronous, so the live timers cannot interleave.
function withContext(c, vol, fn) {
  const saved = { slide, rumble, ctx, rev, comp, master, sfxBus, musicBus, musicLP, noiseBuf };
  ctx = c; slide = null; rumble = null; bindBuses(makeBuses(c, vol, false));
  try { return fn(); } finally { ({ slide, rumble, ctx, rev, comp, master, sfxBus, musicBus, musicLP, noiseBuf } = saved); }
}

export function initAudio(settings) {
  state.on = settings.sound !== false; state.music = settings.music !== false; state.vol = settings.volume ?? 0.6;
  const start = () => {
    if (!state.started) unlock();
    // iPad Safari can suspend an existing context while backgrounded. Resume it
    // inside the next user gesture instead of leaving a started game silent.
    if (ctx && ctx.state !== 'running') ctx.resume().catch(() => {});
  };
  window.addEventListener('keydown', start, { once: false });
  window.addEventListener('pointerdown', start, { once: false });
  // Safari has asked for the unlock inside touchend or click; either may be the first gesture it accepts.
  window.addEventListener('touchend', start, { once: false });
  window.addEventListener('click', start, { once: false });
}

function unlock() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    state.started = true; // one attempt only: a failed build must not leave every later gesture making another context
    ctx = new AC();
    bindBuses(makeBuses(ctx, state.vol, state.muffle));
    master.gain.value = state.on ? state.vol * MASTER_K : 0; musicBus.gain.value = musicLevel();
    // a silent one-frame buffer on the gesture finishes the iOS unlock
    const silent = ctx.createBufferSource(); silent.buffer = ctx.createBuffer(1, 1, 22050); silent.connect(ctx.destination); silent.start(0);
    buildLoops();
    if (state.theme) playTheme(state.theme, true);
  } catch (e) { if (ctx) ctx.close().catch(() => {}); ctx = null; }
}

export function setAudio(settings) {
  state.on = settings.sound !== false; state.music = settings.music !== false; state.vol = settings.volume ?? state.vol;
  if (!ctx) return;
  master.gain.setTargetAtTime(state.on ? state.vol * MASTER_K : 0, ctx.currentTime, 0.05);
  musicBus.gain.setTargetAtTime(musicLevel(), ctx.currentTime, 0.05);
}
// Under the pause menu the tune drops to 40% and is low-passed, so it sits behind the menu instead of competing with it.
export function setMuffle(on) {
  if (state.muffle === on) return;
  state.muffle = on;
  if (!ctx) return;
  musicBus.gain.setTargetAtTime(musicLevel(), ctx.currentTime, 0.08);
  musicLP.frequency.setTargetAtTime(on ? MUFFLE_HZ : OPEN_HZ, ctx.currentTime, 0.08);
}
// Page hidden: stop the clock so the rumble drone and the music scheduler do not run on in the background.
export function suspendAudio() { if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {}); }
export function resumeAudio() {
  if (!ctx) return;
  if (state.nextT < ctx.currentTime) state.nextT = ctx.currentTime + 0.1;
  if (ctx.state !== 'running') ctx.resume().catch(() => {});
}
export function audioState() {
  return { started: state.started, on: state.on, music: state.music, muffled: state.muffle, theme: state.theme, ctx: ctx ? ctx.state : 'none', ducks: state.ducks, slide: { ...slideInfo }, cues: state.cues.slice(),
    mix: ctx ? { master: +master.gain.value.toFixed(3), sfx: sfxBus.gain.value, musicLP: Math.round(musicLP.frequency.value), limiter: { threshold: comp.threshold.value, ratio: comp.ratio.value } } : null };
}

let cueG = 1; // trim of the cue being played (set by playCue)
let cueAt = 0; // offline mixes only: start the cue this many seconds in
let cuePan = 0; // stereo position of the cue being played, -0.7..0.7 (0 = centre)
const CENTS = 20, SPREAD_DB = 2; // every play of a cue differs: pitch within +/-20 cents, level down to -2 dB, a new noise offset
const jitterF = () => 2 ** (((Math.random() * 2 - 1) * CENTS) / 1200), jitterG = () => 10 ** ((-Math.random() * SPREAD_DB) / 20);
const clamp01 = (x) => Math.max(0, Math.min(1, x));
// Where a cue's gain node goes: its bus, through a panner when the cue has a position, plus an optional reverb send.
function route(g, bus, cue, send) {
  let out = bus;
  if (cue && cuePan && ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = Math.max(-0.7, Math.min(0.7, cuePan)); p.connect(bus); out = p; }
  g.connect(out);
  if (cue && send && rev) { const s = ctx.createGain(); s.gain.value = send; g.connect(s); s.connect(rev); }
}
// det: cents; adds two more oscillators at +/-det. formants: [Hz, Hz], two parallel band-passes (a voice). rev: reverb send.
function tone(freq, dur, { type = 'square', vol = 0.2, at = 0, slide = 0, attack = 0.005, bus = sfxBus, filter = 0, det = 0, rev: send = 0, formants = null } = {}) {
  if (!ctx) return;
  const cue = bus === sfxBus;
  if (cue) { vol *= cueG * jitterG(); freq *= jitterF(); at += cueAt; }
  const t = ctx.currentTime + at, g = ctx.createGain(), n = det ? 3 : 1;
  g.gain.value = 0.0001; // a gain node starts at 1: until its first event the source may be heard for a sample (a click)
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol / Math.sqrt(n)), t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  let sink = g;
  if (formants) {
    sink = ctx.createGain();
    for (const f of formants) { const b = ctx.createBiquadFilter(); b.type = 'bandpass'; b.frequency.value = f; b.Q.value = 3; sink.connect(b); b.connect(g); }
  } else if (filter) { sink = ctx.createBiquadFilter(); sink.type = 'lowpass'; sink.frequency.value = filter; sink.connect(g); }
  for (let i = 0; i < n; i++) {
    const o = ctx.createOscillator();
    o.type = type; o.frequency.setValueAtTime(freq, t); if (det) o.detune.value = [0, -det, det][i];
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq * slide), t + dur);
    o.connect(sink); o.start(t); o.stop(t + dur + 0.02);
  }
  route(g, bus, cue, send);
}
function noise(dur, { vol = 0.2, at = 0, type = 'bandpass', freq = 1200, q = 1, sweep = 0, bus = sfxBus, rev: send = 0 } = {}) {
  if (!ctx) return;
  const cue = bus === sfxBus;
  if (cue) { vol *= cueG * jitterG(); at += cueAt; }
  const t = ctx.currentTime + at, s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  g.gain.value = 0.0001; // see tone()
  s.buffer = noiseBuf; s.loop = true;
  f.type = type; f.frequency.setValueAtTime(freq, t); f.Q.value = q;
  if (sweep) f.frequency.exponentialRampToValueAtTime(Math.max(40, freq * sweep), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); route(g, bus, cue, send);
  s.start(t, Math.random()); s.stop(t + dur + 0.02);
}

// Cues are layers: a transient (noise or a short click), a body (detuned tones) and, where it suits, a low thump
// underneath and a short reverb tail. Impact cues take the speed of the hit (m/s) and scale with it.
export const SFX = {
  quack() { const b = 520 * 2 ** (((Math.random() * 2 - 1) * 90) / 1200); tone(b, 0.09, { type: 'sawtooth', vol: 0.14, slide: 0.7, formants: [700, 1200], det: 9, rev: 0.12 }); tone(b * 0.9, 0.11, { type: 'sawtooth', vol: 0.14, slide: 0.65, at: 0.1, formants: [650, 1150], det: 9, rev: 0.12 }); },
  splash(big = false) {
    const d = big ? 0.5 : 0.28, v = big ? 0.3 : 0.18;
    noise(d, { vol: v * 0.6, freq: 1200, q: 0.8, sweep: 0.4, rev: 0.3 }); noise(d * 0.8, { vol: v * 0.5, freq: 2600, q: 1, sweep: 0.5, at: 0.02 }); noise(d * 0.55, { vol: v * 0.35, freq: 4800, q: 1.2, sweep: 0.6, at: 0.01 });
  },
  steam() { noise(0.5, { vol: 0.1, type: 'highpass', freq: 3500, q: 0.5, rev: 0.25 }); noise(0.4, { vol: 0.07, freq: 1800, q: 0.7, sweep: 0.6, at: 0.03 }); },
  snap() { noise(0.06, { vol: 0.3, freq: 2600, q: 2 }); tone(180, 0.07, { type: 'triangle', vol: 0.15, det: 8 }); tone(90, 0.08, { type: 'sine', vol: 0.12, slide: 0.6 }); },
  whistle() { for (let i = 0; i < 3; i++) tone(2400 + (i % 2) * 300, 0.09, { type: 'sine', vol: 0.12, at: i * 0.09, det: 10, rev: 0.3 }); },
  cheer() { noise(1.2, { vol: 0.1, freq: 900, q: 0.4, rev: 0.4 }); noise(0.9, { vol: 0.06, freq: 2200, q: 0.6, at: 0.15 }); noise(0.7, { vol: 0.04, freq: 1500, q: 0.5, at: 0.3, sweep: 1.3 }); },
  bump(v = 10) {
    const s = Math.max(0.35, clamp01(v / 14)); // soft nudge to hard crash
    tone(60, 0.12 + 0.12 * s, { type: 'sine', vol: 0.34 * s, slide: 0.6 });
    tone(130, 0.1 + 0.06 * s, { type: 'triangle', vol: 0.14 * s, slide: 0.5, filter: 500 + 900 * s, det: 8 });
    noise(0.05 + 0.07 * s, { vol: 0.13 * s, type: 'lowpass', freq: 350 + 1500 * s });
  },
  pickup() {
    [660, 880, 1320].forEach((f, i) => tone(f, 0.09, { type: 'triangle', vol: 0.12, at: i * 0.05, det: 7, rev: 0.12 }));
    noise(0.04, { vol: 0.05, type: 'highpass', freq: 5000 }); tone(1760, 0.14, { type: 'sine', vol: 0.05, at: 0.12 });
  },
  ticket() { tone(1568, 0.25, { type: 'sine', vol: 0.12, det: 6, rev: 0.3 }); tone(2093, 0.3, { type: 'sine', vol: 0.08, at: 0.05, det: 6, rev: 0.3 }); noise(0.03, { vol: 0.04, type: 'highpass', freq: 6000 }); },
  boost(kind) {
    const hot = kind === 'hot';
    noise(0.6, { vol: 0.14, freq: 600, q: 0.8, sweep: 4, rev: 0.12 }); tone(220, 0.5, { type: 'sawtooth', vol: 0.06, slide: 2, filter: 1200, det: 9 });
    tone(70, 0.3, { type: 'sine', vol: 0.2, slide: 0.7 });
    if (hot) { tone(440, 0.55, { type: 'sawtooth', vol: 0.05, slide: 2, filter: 1800, det: 9 }); noise(0.5, { vol: 0.08, type: 'highpass', freq: 4000, sweep: 1.5 }); }
  },
  hit() { this.splash(true); tone(300, 0.2, { type: 'square', vol: 0.08, slide: 0.5, filter: 900, det: 8 }); tone(60, 0.28, { type: 'sine', vol: 0.3, slide: 0.6 }); },
  ready() { tone(440, 0.18, { type: 'square', vol: 0.1, filter: 2000, det: 7 }); tone(880, 0.12, { type: 'sine', vol: 0.05 }); },
  go() { tone(880, 0.5, { type: 'square', vol: 0.12, filter: 2400, det: 7, rev: 0.2 }); tone(1320, 0.5, { type: 'triangle', vol: 0.06, det: 7 }); tone(110, 0.3, { type: 'sine', vol: 0.14, slide: 0.7 }); },
  menu() { tone(990, 0.04, { type: 'square', vol: 0.06, filter: 3000 }); },
  lap() { [523, 659, 784].forEach((f, i) => { tone(f, 0.12, { type: 'square', vol: 0.08, at: i * 0.08, filter: 2500, det: 7, rev: 0.1 }); tone(f * 2, 0.1, { type: 'sine', vol: 0.03, at: i * 0.08 }); }); },
  finalLap() { [587, 784, 988, 1175].forEach((f, i) => { tone(f, 0.16, { type: 'sawtooth', vol: 0.07, at: i * 0.09, filter: 2600, det: 8, rev: 0.25 }); tone(f / 2, 0.16, { type: 'triangle', vol: 0.06, at: i * 0.09 }); }); },
  // place: podium (1 to 3) gets the full arpeggio and a cheer, the others a shorter minor one
  finish(place = 1) {
    if (place >= 1 && place <= 3) {
      [523, 659, 784, 1047, ...(place === 1 ? [1319] : [])].forEach((f, i) => { tone(f, 0.22, { type: 'square', vol: 0.09, at: i * 0.12, filter: 2600, det: 7, rev: 0.25 }); tone(f / 2, 0.22, { type: 'triangle', vol: 0.05, at: i * 0.12 }); });
      this.cheer();
    } else {
      [440, 523, 659].forEach((f, i) => tone(f, 0.2, { type: 'triangle', vol: 0.09, at: i * 0.12, filter: 2200, det: 7, rev: 0.2 }));
      noise(0.8, { vol: 0.05, freq: 900, q: 0.4, rev: 0.25 });
    }
  },
  // power-slide stages: Warm 880 Hz, Hot 1320 Hz and a hiss
  charge(stage = 1) {
    if (stage >= 2) { tone(1320, 0.12, { type: 'triangle', vol: 0.12, det: 8 }); tone(2640, 0.09, { type: 'sine', vol: 0.05 }); noise(0.18, { vol: 0.07, type: 'highpass', freq: 4200 }); }
    else { tone(880, 0.1, { type: 'triangle', vol: 0.11, det: 8 }); tone(1760, 0.07, { type: 'sine', vol: 0.04 }); }
  },
  land(v = 8) { const s = clamp01(v / 14); tone(75, 0.14 + 0.1 * s, { type: 'sine', vol: 0.2 + 0.2 * s, slide: 0.55 }); noise(0.07, { vol: 0.08 + 0.06 * s, type: 'lowpass', freq: 500 + 900 * s }); },
  // a rival goes by: a band of air sweeping up
  swish() { noise(0.38, { vol: 0.14, freq: 500, q: 0.9, sweep: 5 }); noise(0.3, { vol: 0.06, type: 'highpass', freq: 3000, at: 0.05 }); },
};
function playCue(name, ...a) { cueG = CUE_TRIM[name] ?? 1; try { SFX[name](...a); } finally { cueG = 1; cuePan = 0; } }
// Dip the music under a big cue: DUCK_DB for about DUCK_MS, then back to its own level.
function duckMusic() {
  const t = ctx.currentTime, lvl = musicLevel();
  musicBus.gain.cancelScheduledValues(t);
  musicBus.gain.setTargetAtTime(lvl * 10 ** (-DUCK_DB / 20), t, 0.02);
  musicBus.gain.setTargetAtTime(lvl, t + DUCK_MS / 1000, 0.25);
}
export function sfx(name, ...a) {
  if (!ctx || !state.on || !SFX[name]) return;
  playCue(name, ...a);
  state.cues.push(a.length && a[0] !== undefined ? name + ":" + a.map(String).join(",") : name); if (state.cues.length > 24) state.cues.shift();
  if (DUCKS[name] && state.music) { duckMusic(); state.ducks++; }
}

// Continuous tub sounds, driven every frame by the player's tub: footsteps tick faster with speed, a rumble
// rises with speed, slosh follows spilling.
let footT = 0, rumble = null, slide = null;
// Power-slide voice: a tone and a hiss that climb with the charge, so Warm and Hot can be heard coming.
const SLIDE_LEVEL = 0.13;           // output level of the whole voice (cues sit well above it)
const SLIDE_HZ = 260, SLIDE_OCT = 1.75; // tone: 260 Hz uncharged, 875 Hz fully charged (the Hot tick is 1320 Hz)
const slideInfo = { on: false, charge: 0, hz: 0 };
function slideUpdate(k, active, when, record) {
  if (!slide) {
    const o = ctx.createOscillator(), og = ctx.createGain(), n = ctx.createBufferSource(), nf = ctx.createBiquadFilter(), ng = ctx.createGain(), g = ctx.createGain();
    o.type = 'triangle'; o.frequency.value = SLIDE_HZ; og.gain.value = 0.5;
    n.buffer = noiseBuf; n.loop = true; nf.type = 'bandpass'; nf.Q.value = 1.2; nf.frequency.value = 900; ng.gain.value = 0.5; g.gain.value = 0;
    o.connect(og); og.connect(g); n.connect(nf); nf.connect(ng); ng.connect(g); g.connect(sfxBus); o.start(); n.start();
    slide = { o, nf, g };
  }
  const on = !!(active && k && k.drift && k.state === 'run' && !k.air && Math.abs(k.vf) > 5);
  const c = on ? clamp01(k.charge / HOT_T) : 0, hz = SLIDE_HZ * 2 ** (SLIDE_OCT * c);
  slide.g.gain.setTargetAtTime(on ? SLIDE_LEVEL : 0, when, 0.05);
  if (on) { slide.o.frequency.setTargetAtTime(hz, when, 0.04); slide.nf.frequency.setTargetAtTime(900 + 2200 * c, when, 0.06); }
  if (record) { slideInfo.on = on; slideInfo.charge = +c.toFixed(3); slideInfo.hz = Math.round(on ? hz : 0); }
}
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
  slideUpdate(k, active, ctx.currentTime, true);
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
  nameLoops();
}
function nameLoops() { for (const k of Object.keys(LOOPS)) LOOPS[k].name = k; }
export function playTheme(name, force = false) {
  if (state.theme === name && !force && state.timer) return;
  state.theme = name;
  if (!ctx) return;
  if (state.timer) clearInterval(state.timer);
  const L = LOOPS[name];
  if (!L) return;
  state.step = 0; state.nextT = ctx.currentTime + 0.1;
  state.timer = setInterval(() => { if (ctx) pumpMusic(L, state, ctx.currentTime + 0.15); }, 50);
}
// Schedule every 16th note of loop L that starts before time `until` (audio-clock seconds); st = { step, nextT }.
function pumpMusic(L, st, until) {
  const sixteenth = 60 / L.bpm / 4;
  while (st.nextT < until) {
    const i = st.step % L.lead.length, at = st.nextT - ctx.currentTime;
    const ln = L.lead[i], bn = L.bass[i % L.bass.length], dr = L.drums[i % L.drums.length];
    const m = MUSIC_TRIM[L.name] ?? 1;
    if (ln > 0) tone(ln, L.pluck ? sixteenth * 1.6 : sixteenth * 1.8, { type: L.leadType, vol: (L.pluck ? 0.07 : 0.05) * m, at, filter: L.pluck ? 2600 : 2200, bus: musicBus, attack: 0.004 });
    if (bn > 0) tone(bn, sixteenth * 1.9, { type: L.bassType, vol: 0.09 * m, at, filter: 900, bus: musicBus });
    if (dr === 'x') { tone(70, 0.12, { type: 'sine', vol: KICK_VOL * m, slide: 0.5, at, bus: musicBus }); }
    if (dr === 'h') noise(0.03, { vol: 0.03 * m, type: 'highpass', freq: 7000, at, bus: musicBus });
    st.step++; st.nextT += sixteenth;
  }
}
export const musicNames = () => { if (!LOOPS.rag) buildLoops(); return Object.keys(LOOPS); };
export function stopTheme() { if (state.timer) clearInterval(state.timer); state.timer = null; state.theme = null; }

// ---- test hooks: render a piece or a cue by itself, faster than real time, and measure it ----
// Never touches the live context or the settings: it builds the same bus tree on an OfflineAudioContext.
// peak, rms: linear 0..1 (peakDb, rmsDb in dBFS). longestSilence: seconds in a row below -60 dBFS. stereo: side
// level over mid level. secs: RMS of each second. wav: base64 16-bit WAV when asked. (After hsg audio kit.)
async function measureAudio(build, seconds, o = {}) {
  const rate = o.rate || 22050, OC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const oc = new OC(2, Math.ceil(rate * seconds), rate), made = build(oc, oc.destination);
  const buf = await oc.startRendering(), L = buf.getChannelData(0), R = buf.getChannelData(1), n = L.length;
  let peak = 0, peakAt = 0, mid = 0, side = 0, run = 0, longest = 0; const secs = [];
  for (let s = 0; s * rate < n; s++) {
    const end = Math.min(n, (s + 1) * rate); let e = 0;
    for (let i = s * rate; i < end; i++) { const a = (L[i] + R[i]) / 2, d = (L[i] - R[i]) / 2, p = Math.max(Math.abs(L[i]), Math.abs(R[i])); if (p > peak) { peak = p; peakAt = i; } e += a * a; side += d * d; }
    mid += e; const r = Math.sqrt(e / (end - s * rate)); secs.push(+r.toFixed(5));
    if (r < 0.001) { run++; longest = Math.max(longest, run); } else run = 0;
  }
  const rms = Math.sqrt(mid / n), db = (x) => +(20 * Math.log10(Math.max(x, 1e-9))).toFixed(1);
  const res = { seconds, peakAt: +(peakAt / rate).toFixed(3), peak: +peak.toFixed(4), rms: +rms.toFixed(4), peakDb: db(peak), rmsDb: db(rms), longestSilence: longest, stereo: +(Math.sqrt(side / n) / (rms || 1)).toFixed(3), secs, built: typeof made === 'function' ? made() : made };
  if (o.wav) {
    const bytes = new Uint8Array(44 + n * 4), v = new DataView(bytes.buffer), str = (at, t) => { for (let i = 0; i < t.length; i++) bytes[at + i] = t.charCodeAt(i); };
    str(0, 'RIFF'); v.setUint32(4, 36 + n * 4, true); str(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true); v.setUint32(24, rate, true); v.setUint32(28, rate * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); str(36, 'data'); v.setUint32(40, n * 4, true);
    for (let i = 0; i < n; i++) { v.setInt16(44 + i * 4, Math.max(-1, Math.min(1, L[i])) * 32767, true); v.setInt16(46 + i * 4, Math.max(-1, Math.min(1, R[i])) * 32767, true); }
    let bin = ''; for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); res.wav = btoa(bin);
  }
  return res;
}
export function audioList() { return { music: musicNames(), ambience: [], cues: Object.keys(SFX) }; }
// name: a music piece ('rag'), or 'cue:<name>' (args for the cue in `args`).
export function audioRender(name, seconds = 10, wantWav = false, args = []) {
  const build = (oc) => withContext(oc, SHIP_VOL, () => {
    if (name.startsWith('cue:')) { playCue(name.slice(4), ...args); return null; }
    if (name === 'loop:slide') { // a slide held for the whole render: the charge climbs from 0 to just past Hot
      const track = [];
      for (let t = 0; t < seconds; t += 0.05) { const k = { drift: 1, state: 'run', air: false, vf: 15, charge: (t / seconds) * HOT_T * 1.05 }; slideUpdate(k, true, t, false); track.push([+t.toFixed(2), +(k.charge / HOT_T).toFixed(3), Math.round(SLIDE_HZ * 2 ** (SLIDE_OCT * clamp01(k.charge / HOT_T)))]); }
      return { track };
    }
    if (name.startsWith('mix:')) { // the busiest moment: a tune with the loudest cues stacked on it
      const L = LOOPS[name.slice(4)]; pumpMusic(L, { step: 0, nextT: 0.1 }, seconds + 0.2);
      for (const [c, t] of [['finish', 2], ['hit', 2.3], ['go', 2.4], ['boost', 2.5], ['bump', 2.6], ['pickup', 2.7]]) { cueAt = t; try { playCue(c); } finally { cueAt = 0; } }
      return null;
    }
    const L = LOOPS[name]; if (!L) throw new Error('no such piece: ' + name);
    pumpMusic(L, { step: 0, nextT: 0.1 }, seconds + 0.2);
    return null;
  });
  if (!LOOPS.rag) buildLoops();
  return measureAudio(build, seconds, { wav: wantWav });
}
