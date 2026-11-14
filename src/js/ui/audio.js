// Sound: WebAudio synthesis only (no audio files). Starts on the first key or touch (browser autoplay rules),
// quiet by default and mutable. Primitives after hsg-fishing/src/js/audio.js (tone, noise; Hot Springs Games,
// MIT). No motor: a pushed tub sounds like four sets of running feet, a wheel rumble and water slosh.
// Music (wave 2, S5-02): original pieces of about a minute with a form (AABA), written as scores in scores.js and
// played by the audio kit (audiokit.js): ragtime downtown, bluegrass in the mountains, a night swing, a march for
// Rules of the Row and the Water Fight, and a title and a results piece. Ambience (S5-04): one bed per place.

import { HOT_T } from '../sim/kart.js';
import { makeAudioKit } from './audiokit.js';
import { SCORES, SCENES } from './scores.js';

let ctx = null, rev = null, comp = null, master = null, sfxBus = null, ambBus = null, musicLP = null, noiseBuf = null, kit = null;
// bus levels (the mix the game ships; audioRender measures them at SHIP_VOL, the default volume setting)
const SHIP_VOL = 0.6;
// Each line keeps the pre-wave value beside it (wave 2, S5-01): edit one line to reverse a step.
const MASTER_K = 0.8;     // was 0.5
const SFX_BUS = 1.0;      // was 0.9
const MUSIC_BUS = 1.0;    // was 0.32 (the old tunes peaked at 0.02 on the output); each piece's own loudness is its trim in scores.js
const AMBIENCE_BUS = 1.0; // the ambience beds are levelled by each scene's trim in scores.js
const KIT_SEED = 0x7B1;   // seeds the kit's ambience one-shots; every tune has its own seed in scores.js
const COMP = { threshold: -14, ratio: 4, knee: 8, attack: 0.004, release: 0.25 }; // limiter between master and speakers (none before)
const REVERB_WET = 0.7;
const CLIP_FROM = 0.75, CLIP_TOP = 0.94; // the soft clip: straight up to 0.75, then curving towards 0.94 (0.91 at an input of 1 or more)
const SOFT_CLIP = (() => {
  const n = 4097, curve = new Float32Array(n), span = CLIP_TOP - CLIP_FROM;
  for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 2 - 1, v = Math.abs(x); curve[i] = Math.sign(x) * (v <= CLIP_FROM ? v : CLIP_FROM + span * Math.tanh((v - CLIP_FROM) / span)); }
  return curve;
})();
const DUCK_DB = 6, DUCK_MS = 300; // music dips this much under the big cues
// Per-cue output trim, found with audioRender so every gameplay cue peaks 0.25 to 0.45 at the shipped volume.
const CUE_TRIM = { quack: 3.48, splash: 13.2, steam: 7.8, snap: 4.727, whistle: 2.303, cheer: 7.3, bump: 6.03, pickup: 3.096, ticket: 4.856, boost: 6.7, hit: 4.2, ready: 6.581, go: 4.4, menu: 16.265, lap: 2.55, finish: 2.2, finalLap: 3.66, charge: 8.188, land: 6.03, swish: 10.293 };
const DUCKS = { boost: 1, hit: 1, finish: 1.9 };
const SWELLS = { lap: 0.5, finalLap: 0.8, finish: 1 }; // the crowd roars on a lap, the last lap and the finish
const state = { cues: [], ducks: 0, on: true, music: true, ambience: true, vol: 0.6, started: false, theme: null, scene: null, intensity: 0, muffle: false, hidden: false, swell: 0, swells: 0, crowd: 0, wind: 0 };

const OPEN_HZ = 5200; // was 22000: a gentle low-pass keeps the tune under the cues
const FADE_MUSIC = 1.6, FADE_AMB = 2.5; // seconds to crossfade between pieces and between places

// The bus tree is built by one function so a test can build the same tree on an OfflineAudioContext.
function makeBuses(c, vol) {
  const b = {};
  b.comp = c.createDynamicsCompressor();
  for (const k of Object.keys(COMP)) b.comp[k].value = COMP[k];
  // Last in the chain, a soft clip. The compressor evens levels out but is no limiter: with the Volume slider at its
  // maximum the busiest moments (a tune, the crowd and several cues together) reached 1.09 and clipped. The curve
  // leaves everything under CLIP_FROM alone and bends what is above it over smoothly, so nothing passes CLIP_TOP.
  b.clip = c.createWaveShaper(); b.clip.curve = SOFT_CLIP; b.clip.oversample = '4x';
  b.comp.connect(b.clip); b.clip.connect(c.destination);
  b.master = c.createGain(); b.master.gain.value = vol * MASTER_K; b.master.connect(b.comp);
  b.sfx = c.createGain(); b.sfx.gain.value = SFX_BUS; b.sfx.connect(b.master);
  b.lp = c.createBiquadFilter(); b.lp.type = 'lowpass'; b.lp.frequency.value = OPEN_HZ; b.lp.connect(b.master);
  b.amb = c.createGain(); b.amb.gain.value = 1; b.amb.connect(b.master); // the kit's music goes into b.lp, its ambience here
  // a short room for splashes, cheers and whistles: 0.4 s of decaying noise, sent to the sfx bus at a low level
  b.rev = c.createConvolver(); b.rev.buffer = c.createBuffer(2, Math.floor(c.sampleRate * 0.4), c.sampleRate);
  for (let ch = 0; ch < 2; ch++) { const d = b.rev.buffer.getChannelData(ch); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 2.5; }
  const wet = c.createGain(); wet.gain.value = REVERB_WET; b.rev.connect(wet); wet.connect(b.sfx);
  b.noise = c.createBuffer(1, c.sampleRate, c.sampleRate);
  const d = b.noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}
function bindBuses(b) { rev = b.rev; comp = b.comp; master = b.master; sfxBus = b.sfx; musicLP = b.lp; ambBus = b.amb; noiseBuf = b.noise; }
// o: the levels the two buses start at (the live kit starts at what the settings say; a test render at full level)
const newKit = (c, o = {}) => makeAudioKit(c, musicLP, { seed: KIT_SEED, ambOut: ambBus, music: o.music ?? MUSIC_BUS, ambience: o.ambience ?? AMBIENCE_BUS });
// Run fn with the module's audio graph pointed at another context (an offline one), then restore the live one.
// Everything inside fn is synchronous, so the live timers cannot interleave.
function withContext(c, vol, fn) {
  const saved = { rivalVoices, slide, rumble, ctx, rev, comp, master, sfxBus, ambBus, musicLP, noiseBuf };
  ctx = c; slide = null; rumble = null; rivalVoices = null; bindBuses(makeBuses(c, vol));
  try { return fn(); } finally { ({ rivalVoices, slide, rumble, ctx, rev, comp, master, sfxBus, ambBus, musicLP, noiseBuf } = saved); }
}

export function initAudio(settings) {
  state.on = settings.sound !== false; state.music = settings.music !== false; state.ambience = settings.ambience !== false; state.vol = settings.volume ?? 0.6;
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
    bindBuses(makeBuses(ctx, state.vol));
    master.gain.value = state.on ? state.vol * MASTER_K : 0;
    kit = newKit(ctx, { music: state.music ? MUSIC_BUS : 0, ambience: state.ambience ? AMBIENCE_BUS : 0 }); applyHold(); kit.music.intensity(state.intensity);
    // a silent one-frame buffer on the gesture finishes the iOS unlock
    const silent = ctx.createBufferSource(); silent.buffer = ctx.createBuffer(1, 1, 22050); silent.connect(ctx.destination); silent.start(0);
    kit.start();
    if (state.theme) kit.music.play(SCORES[state.theme] || null, { fade: FADE_MUSIC });
    if (state.scene) kit.amb.play(SCENES[state.scene] || null, { fade: FADE_AMB });
  } catch (e) { if (kit) kit.stop(); kit = null; if (ctx) ctx.close().catch(() => {}); ctx = null; }
}

// Music and ambience each have their own switch; the Sound switch (the master) silences everything.
function applyLevels() { if (!kit) return; kit.music.level(state.music ? MUSIC_BUS : 0); kit.amb.level(state.ambience ? AMBIENCE_BUS : 0); }
// Under the pause card and while the page is hidden both buses fade out and nothing new is scheduled.
function applyHold() { if (!kit) return; if (state.muffle || state.hidden) kit.hold(); else if (kit.held) kit.release(); }
export function setAudio(settings) {
  state.on = settings.sound !== false; state.music = settings.music !== false; state.ambience = settings.ambience !== false; state.vol = settings.volume ?? state.vol;
  if (!ctx) return;
  master.gain.setTargetAtTime(state.on ? state.vol * MASTER_K : 0, ctx.currentTime, 0.05);
  applyLevels();
}
export function setMuffle(on) {
  if (state.muffle === on) return;
  state.muffle = on;
  applyHold();
}
// Page hidden: stop the clock so the rumble drone and the music scheduler do not run on in the background.
export function suspendAudio() { state.hidden = true; applyHold(); if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {}); }
export function resumeAudio() {
  state.hidden = false; applyHold();
  if (!ctx) return;
  if (ctx.state !== 'running') ctx.resume().catch(() => {});
}
export function audioState() {
  return { started: state.started, on: state.on, music: state.music, ambience: state.ambience, muffled: state.muffle, theme: state.theme, scene: state.scene, intensity: state.intensity, ctx: ctx ? ctx.state : 'none', ducks: state.ducks, rivals: { ...rivalInfo, voices: rivalInfo.voices.slice() }, slide: { ...slideInfo }, cues: state.cues.slice(),
    amb: { crowd: +state.crowd.toFixed(3), wind: +state.wind.toFixed(3), swells: state.swells }, kit: kit ? { ...kit.levels(), info: kit.music.info() } : null,
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
// pos: { pan, gain } puts the cue somewhere in the stereo field and quieter (a rival's cue); null for the player's own.
function playCue(name, pos, ...a) { cueG = (CUE_TRIM[name] ?? 1) * (pos ? pos.gain : 1); cuePan = pos ? pos.pan : 0; try { SFX[name](...a); } finally { cueG = 1; cuePan = 0; } }
function logCue(name, pos, a) { state.cues.push(name + (a.length && a[0] !== undefined ? ':' + a.map(String).join(',') : '') + (pos ? '@' + pos.pan.toFixed(2) + '*' + pos.gain.toFixed(2) : '')); if (state.cues.length > 24) state.cues.shift(); }
// Dip the music under a big cue: DUCK_DB for about DUCK_MS, then back to its own level.
function duckMusic() { if (kit) kit.music.duck(DUCK_DB, DUCK_MS); }
export function sfx(name, ...a) {
  if (!ctx || !state.on || !SFX[name]) return;
  playCue(name, null, ...a); logCue(name, null, a);
  if (DUCKS[name] && state.music) { duckMusic(); state.ducks++; }
  if (SWELLS[name]) crowdSwell(SWELLS[name]);
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
// ---- ambience: one bed per place (scores.js SCENES). The crowd bed rises with speed, a swell on a lap or a pass and
// the last lap; the wind bed rises with speed. amb.set() moves each bed's level.
const AMB_TOP = 20;           // m/s at which the crowd and wind beds reach their full level from speed
const CROWD_BASE = 0.2, CROWD_SPEED = 0.5, CROWD_FINAL = 0.2, SWELL_S = 3; // the crowd: standing level, speed share, last-lap lift, seconds a swell takes to die away
const WIND_BASE = 0.15;
export function crowdSwell(x) { state.swell = Math.max(state.swell, x); state.swells++; }
function ambUpdate(k, dt, active) {
  if (!kit) return;
  const v = active && k ? clamp01(Math.abs(k.vf) / AMB_TOP) : 0;
  state.swell = Math.max(0, state.swell - dt / SWELL_S);
  const crowd = clamp01(CROWD_BASE * (active ? 1 : 0.5) + CROWD_SPEED * v + 0.4 * state.swell + (state.intensity > 0.5 ? CROWD_FINAL : 0));
  const wind = clamp01(WIND_BASE + (1 - WIND_BASE) * v);
  if (Math.abs(crowd - state.crowd) > 0.02) { state.crowd = crowd; kit.amb.set('crowd', crowd, 0.4); }
  if (Math.abs(wind - state.wind) > 0.02) { state.wind = wind; kit.amb.set('wind', wind, 0.6); }
}
export function playScene(name) {
  if (state.scene === name) return;
  state.scene = name;
  if (kit) kit.amb.play(SCENES[name] || null, { fade: FADE_AMB });
}
export function tubLoop(k, dt, active) {
  if (!ctx || !state.on) return;
  ambUpdate(k, dt, active);
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

// ---- rivals: the seven other tubs are heard where they are ----
// A pool of three feet-and-water voices follows the nearest rivals inside RIVAL_RANGE: quieter with distance,
// panned to the side of the screen they are on, pulsing faster when they are quicker. Their item hits, bumps and
// falls play as the ordinary cues, quieter and panned. A rival going by within 4 m gets a swish.
const RIVAL_VOICES = 3, RIVAL_RANGE = 25, EVENT_RANGE = 30; // m
const RIVAL_LEVEL = 0.16;     // voice level at 0 m and full speed (output peak is measured by audioRender)
const RIVAL_CUE_GAIN = 0.8;   // a rival's cue at 0 m, against the same cue for the player
const MAX_PAN = 0.7;
const falloff = (dist, range) => Math.pow(clamp01(1 - dist / range), 1.5);
let rivalVoices = null, listener = { rx: 1, rz: 0 };
const rivalInfo = { voices: [], passes: 0 }, lastRel = new Map(), lastPass = new Map();
export const USE_CUE = { duck: 'quack', towel: 'snap', blaster: 'splash', hose: 'splash', jet: 'steam', jet3: 'steam', bubble: 'pickup' };
const RIVAL_CUE = { wall: 'bump', bump: 'bump', fumble: 'hit', pickup: 'pickup', boost: 'boost', fall: 'splash' };
// where the camera's right-hand side points on the ground, set every frame
export function setListener(rx, rz) { const n = Math.hypot(rx, rz) || 1; listener = { rx: rx / n, rz: rz / n }; }
function spatial(me, k, range) {
  const dx = k.x - me.x, dz = k.z - me.z, dist = Math.hypot(dx, dz);
  return { dx, dz, dist, pan: dist < 0.01 ? 0 : Math.max(-MAX_PAN, Math.min(MAX_PAN, MAX_PAN * ((dx * listener.rx + dz * listener.rz) / dist))), gain: falloff(dist, range) };
}
function makeRivalVoices() {
  return Array.from({ length: RIVAL_VOICES }, () => {
    const n = ctx.createBufferSource(), f = ctx.createBiquadFilter(), amp = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain(), pan = ctx.createStereoPanner();
    n.buffer = noiseBuf; n.loop = true; f.type = 'lowpass'; f.frequency.value = 520; f.Q.value = 0.9; amp.gain.value = 0; lfo.frequency.value = 4; lg.gain.value = 0;
    n.connect(f); f.connect(amp); lfo.connect(lg); lg.connect(amp.gain); amp.connect(pan); pan.connect(sfxBus); n.start(0, Math.random()); lfo.start();
    return { id: -1, amp, lfo, lg, pan, hz: 0 };
  });
}
// list: [{ id, dist, pan, speed }] nearest first. Each voice keeps following the rival it started with.
function rivalUpdate(list, when, record) {
  if (!rivalVoices) rivalVoices = makeRivalVoices();
  const take = list.slice(0, RIVAL_VOICES), free = rivalVoices.filter((v) => !take.some((r) => r.id === v.id));
  for (const v of rivalVoices) if (!take.some((r) => r.id === v.id)) v.id = -1;
  for (const r of take) { let v = rivalVoices.find((x) => x.id === r.id); if (!v) { v = free.shift(); v.id = r.id; v.pan.pan.setValueAtTime(r.pan, when); } r.v = v; }
  for (const v of rivalVoices) {
    const r = take.find((x) => x.v === v), g = r ? RIVAL_LEVEL * falloff(r.dist, RIVAL_RANGE) * clamp01(r.speed / 16) : 0;
    v.amp.gain.setTargetAtTime(g, when, 0.08); v.lg.gain.setTargetAtTime(g * 0.8, when, 0.08);
    if (r) { v.lfo.frequency.setTargetAtTime(2.5 + r.speed * 0.28, when, 0.15); v.pan.pan.setTargetAtTime(r.pan, when, 0.08); }
    v.g = g; v.p = r ? r.pan : 0;
  }
  if (record) rivalInfo.voices = rivalVoices.filter((v) => v.id >= 0).map((v) => ({ id: v.id, pan: +v.p.toFixed(3), gain: +v.g.toFixed(4) }));
}
// every frame of a race: rivals = all karts; `me` is the player's tub, or null when nothing should be heard
export function rivalLoop(me, karts, active, dt) {
  if (!ctx || !state.on || (!rivalVoices && !(active && me))) return;
  const list = [];
  if (active && me) {
    const fx = Math.sin(me.yaw), fz = Math.cos(me.yaw);
    for (const k of karts) {
      if (k === me) continue;
      const sp = spatial(me, k, RIVAL_RANGE), rel = sp.dx * fx + sp.dz * fz, prev = lastRel.get(k.id);
      lastRel.set(k.id, rel);
      if (sp.dist < RIVAL_RANGE) list.push({ id: k.id, dist: sp.dist, pan: sp.pan, speed: Math.abs(k.vf) });
      // passing: it crossed the player's side-line within 4 m, fast enough to be a pass and not a wobble
      if (prev !== undefined && sp.dist < 4 && Math.sign(prev) !== Math.sign(rel) && Math.abs(rel - prev) / Math.max(dt, 1e-3) >= 1.5 && (rivalPassT - (lastPass.get(k.id) ?? -9)) > 1.2) {
        lastPass.set(k.id, rivalPassT); rivalInfo.passes++;
        const pos = { pan: sp.pan, gain: prev < rel ? 1 : 0.7 }; // 1: it overtook the player; 0.7: the player overtook it
        if (prev > rel) crowdSwell(0.5);
        playCue('swish', pos); logCue('swish', pos, []);
      }
    }
    list.sort((a, b) => a.dist - b.dist);
  }
  else lastRel.clear();
  rivalPassT += dt;
  rivalUpdate(list, ctx.currentTime, true);
}
let rivalPassT = 0;
// a rival's sim event: heard if it is close enough, from its side, never twice for the same bump
export function rivalEvent(me, k, e, time) {
  if (!ctx || !state.on) return;
  const name = e.type === 'use' ? USE_CUE[e.item] : RIVAL_CUE[e.type];
  if (!name || (e.type === 'wall' && !(e.v > 4))) return;
  const sp = spatial(me, k, EVENT_RANGE), near = { pickup: 14, boost: 22 }[e.type] ?? EVENT_RANGE;
  if (sp.gain < 0.05 || sp.dist > near) return;
  if (e.type === 'bump') { // the player's own bump already sounds; both karts of a pair report it
    if (sp.dist < 3 || (lastRivalBump && time - lastRivalBump.t < 0.15 && Math.hypot(k.x - lastRivalBump.x, k.z - lastRivalBump.z) < 4)) return;
    lastRivalBump = { t: time, x: k.x, z: k.z };
  }
  const a = e.type === 'wall' || e.type === 'bump' ? [e.v] : e.type === 'boost' ? [e.kind] : [];
  const pos = { pan: sp.pan, gain: sp.gain * RIVAL_CUE_GAIN };
  playCue(name, pos, ...a); logCue(name, pos, a);
}
let lastRivalBump = null;

// ---- music: scores in scores.js, played by the kit ----
export function playTheme(name, force = false) {
  if (state.theme === name && !force) return;
  state.theme = name;
  if (kit) kit.music.play(SCORES[name] || null, { fade: FADE_MUSIC });
}
// 0 to 1: the last lap runs the tune 8% faster, lifts the lead an octave where the score allows it and adds its second percussion line.
export function setIntensity(x) { state.intensity = clamp01(x); if (kit) kit.music.intensity(state.intensity); }
export const musicNames = () => Object.keys(SCORES);
export function stopTheme() { state.theme = null; if (kit) kit.music.stop(); }

// ---- test hooks: render a piece or a cue by itself, faster than real time, and measure it ----
// Never touches the live context or the settings: it builds the same bus tree on an OfflineAudioContext.
// peak, rms: linear 0..1 (peakDb, rmsDb in dBFS). longestSilence: seconds in a row below -60 dBFS. stereo: side
// level over mid level. balance: -1 all left to +1 all right. secs: RMS of each second. wav: base64 16-bit WAV when asked. (After hsg audio kit.)
async function measureAudio(build, seconds, o = {}) {
  const rate = o.rate || 22050, OC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const oc = new OC(2, Math.ceil(rate * seconds), rate), made = build(oc, oc.destination);
  const buf = await oc.startRendering(), L = buf.getChannelData(0), R = buf.getChannelData(1), n = L.length;
  let peak = 0, peakAt = 0, eL = 0, eR = 0, mid = 0, side = 0, run = 0, longest = 0; const secs = [];
  for (let s = 0; s * rate < n; s++) {
    const end = Math.min(n, (s + 1) * rate); let e = 0;
    for (let i = s * rate; i < end; i++) { const a = (L[i] + R[i]) / 2, d = (L[i] - R[i]) / 2, p = Math.max(Math.abs(L[i]), Math.abs(R[i])); if (p > peak) { peak = p; peakAt = i; } e += a * a; side += d * d; eL += L[i] * L[i]; eR += R[i] * R[i]; }
    mid += e; const r = Math.sqrt(e / (end - s * rate)); secs.push(+r.toFixed(5));
    if (r < 0.001) { run++; longest = Math.max(longest, run); } else run = 0;
  }
  const rms = Math.sqrt(mid / n), db = (x) => +(20 * Math.log10(Math.max(x, 1e-9))).toFixed(1);
  const res = { seconds, peakAt: +(peakAt / rate).toFixed(3), peak: +peak.toFixed(4), rms: +rms.toFixed(4), peakDb: db(peak), rmsDb: db(rms), longestSilence: longest, stereo: +(Math.sqrt(side / n) / (rms || 1)).toFixed(3), balance: +((Math.sqrt(eR) - Math.sqrt(eL)) / (Math.sqrt(eL) + Math.sqrt(eR) || 1)).toFixed(3), secs, built: typeof made === 'function' ? made() : made };
  if (o.wav) {
    const bytes = new Uint8Array(44 + n * 4), v = new DataView(bytes.buffer), str = (at, t) => { for (let i = 0; i < t.length; i++) bytes[at + i] = t.charCodeAt(i); };
    str(0, 'RIFF'); v.setUint32(4, 36 + n * 4, true); str(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true); v.setUint32(24, rate, true); v.setUint32(28, rate * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); str(36, 'data'); v.setUint32(40, n * 4, true);
    for (let i = 0; i < n; i++) { v.setInt16(44 + i * 4, Math.max(-1, Math.min(1, L[i])) * 32767, true); v.setInt16(46 + i * 4, Math.max(-1, Math.min(1, R[i])) * 32767, true); }
    let bin = ''; for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); res.wav = btoa(bin);
  }
  return res;
}
export function audioList() { return { music: musicNames(), ambience: Object.keys(SCENES), cues: Object.keys(SFX) }; }
// name: a music piece ('rag'), an ambience scene ('town'), 'mix:<piece>' or 'cue:<name>' (args for the cue in `args`).
// For a piece args[0] is the intensity (0 to 1, default 0); for a scene args[0] is the crowd and wind level (default 0.5).
// `vol` is the Volume setting to render at (the shipped one unless a test asks for another, such as 1 for the maximum).
export function audioRender(name, seconds = 10, wantWav = false, args = [], vol = SHIP_VOL) {
  const T0 = 0.05, LOUD = [['finish', 2], ['hit', 2.3], ['go', 2.4], ['boost', 2.5], ['bump', 2.6], ['pickup', 2.7]];
  const build = (oc) => withContext(oc, vol, () => {
    if (name.startsWith('cue:')) { const [c, pan] = name.slice(4).split('@'); playCue(c, pan ? { pan: +pan, gain: 1 } : null, ...args); return null; } // 'cue:swish@-0.7' is panned left
    if (name === 'loop:slide') { // a slide held for the whole render: the charge climbs from 0 to just past Hot
      const track = [];
      for (let t = 0; t < seconds; t += 0.05) { const k = { drift: 1, state: 'run', air: false, vf: 15, charge: (t / seconds) * HOT_T * 1.05 }; slideUpdate(k, true, t, false); track.push([+t.toFixed(2), +(k.charge / HOT_T).toFixed(3), Math.round(SLIDE_HZ * 2 ** (SLIDE_OCT * clamp01(k.charge / HOT_T)))]); }
      return { track };
    }
    if (name.startsWith('loop:rivals:')) { // one rival held at a pan and a distance, running: 'loop:rivals:-0.7:8'
      const [, , pan, dist] = name.split(':'); rivalUpdate([{ id: 1, dist: +dist, pan: +pan, speed: 18 }], 0, false);
      return null;
    }
    const k = newKit(ctx), level = args[0];
    if (name.startsWith('mix:')) { // the busiest moment: a tune and the town crowd at full level, with the loudest cues stacked on them
      const piece = name.slice(4); if (!SCORES[piece]) throw new Error('no such piece: ' + piece);
      k.music.intensity(level ?? 1); k.music.play(SCORES[piece], { at: T0, fade: 0.02 }); k.amb.play(SCENES.town, { at: T0, fade: 0.02 }); k.amb.set('crowd', 1, 0.01);
      k.scheduleUntil(seconds + 0.2);
      for (const [c, t] of LOUD) { cueAt = t; try { playCue(c, null); } finally { cueAt = 0; } }
      return () => k.music.info();
    }
    if (SCORES[name]) { // a piece by itself
      k.music.intensity(level ?? 0); k.music.play(SCORES[name], { at: T0, fade: 0.02 }); k.scheduleUntil(seconds + 0.2);
      return () => { const i = k.music.info(); return { ...i, formSeconds: +((i.formBars * 240) / (SCORES[name].bpm * (1 + 0.08 * (level ?? 0)))).toFixed(1) }; };
    }
    if (SCENES[name]) { // an ambience scene by itself, with the crowd and wind beds held at one level
      k.amb.set('crowd', level ?? 0.5, 0.01); k.amb.set('wind', level ?? 0.5, 0.01); k.amb.play(SCENES[name], { at: T0, fade: 0.02 }); k.scheduleUntil(seconds + 0.2);
      return null;
    }
    throw new Error('no such piece or scene: ' + name);
  });
  return measureAudio(build, seconds, { wav: wantWav });
}
