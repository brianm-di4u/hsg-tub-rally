// Music scores and ambience scenes for the audio kit (audiokit.js), written as data. Chord roots are scale degrees
// (0 = I, 3 = IV, 4 = V ...); [degree, bars] holds a chord for more than one bar. `seed` makes each tune the same
// every time it is played; `trim` sets how loud the piece sits (found by measuring it at the shipped volume).
// Each piece has its own key, tempo, chords and lead voice and runs about a minute before it repeats.

export const SCORES = {
  // Central Avenue Rag: the downtown courses. C major, oom-pah left hand, syncopated piano. 32 bars, about 69 s.
  rag: {
    seed: 11, trim: 0.62, bpm: 112, swing: 0.12, key: 60, sevenths: [4], form: 'AABA',
    sections: { A: [0, 0, 4, 4, 5, 1, 4, 0], B: [3, 3, 0, 5, 1, 4, 0, 4] },
    bass: { inst: 'bass', pattern: 'two', gain: 0.16 }, comp: { inst: 'piano', at: [1, 3], gain: 0.05 },
    lead: { inst: 'piano', gain: 0.11, vary: 0.3, rest: 0.06, oct: 1, rhythms: [[0, 1, 3, 4, 6], [0, 3, 4, 7], [1, 2, 4, 5, 7], [0, 2, 3, 5, 6], [0, 3, 6], [0, 2, 4, 6, 7]] },
    perc2: { s: [1, 3], h: [0.5, 1.5, 2.5, 3.5], gain: 0.4 },
    lp: 5200, delay: 0,
  },
  // Switchback Breakdown: the mountain courses. G major, plucked banjo lead over a bouncing bass. 32 bars, about 58 s.
  grass: {
    seed: 23, trim: 0.6, bpm: 132, key: 55, form: 'AABA',
    sections: { A: [0, 0, 3, 0, 0, 3, 4, 0], B: [3, 3, 0, 0, 4, 4, 0, 4] },
    bass: { inst: 'bass', pattern: 'two', gain: 0.15 }, comp: { inst: 'pluck', at: [1, 3], gain: 0.03, len: 0.3 },
    lead: { inst: 'pluck', gain: 0.09, vary: 0.3, rest: 0.05, oct: 1, rhythms: [[0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 3, 4, 5, 7], [0, 2, 3, 4, 6, 7], [0, 1, 2, 4, 6], [0, 3, 4, 5, 6]] },
    perc: { h: [0.5, 1.5, 2.5, 3.5], gain: 0.3 }, perc2: { k: [0, 2], s: [1, 3], gain: 0.4 },
    lp: 4600, delay: 0.1, delayBeats: 0.5,
  },
  // Park Avenue After Dark: the night courses. G minor, slow swing, walking bass, flute over brushes. 32 bars, about 77 s.
  swing: {
    seed: 37, trim: 0.5, bpm: 100, swing: 0.3, key: 55, scale: [0, 2, 3, 5, 7, 8, 10], sevenths: [0, 3, 4], form: 'AABA',
    sections: { A: [0, 3, 6, 2, 5, 3, 4, 0], B: [5, 5, 3, 3, 6, 6, 4, 4] },
    pad: { inst: 'pad', gain: 0.03 }, bass: { inst: 'bass', pattern: 'walk', gain: 0.14 },
    lead: { inst: 'flute', gain: 0.085, vary: 0.35, rest: 0.18, oct: 1 },
    perc: { b: [1, 3], gain: 0.5 }, perc2: { b: [0.5, 1.5, 2.5, 3.5], k: [0], gain: 0.5 },
    lp: 3800, delay: 0.14, delayBeats: 0.75,
  },
  // Judges' March: Rules of the Row and the Water Fight. F major, tuba and brass over a snare line. 32 bars, about 66 s.
  march: {
    seed: 41, trim: 0.65, bpm: 116, key: 53, sevenths: [4], form: 'AABA',
    sections: { A: [0, 0, 3, 0, 4, 4, 0, 0], B: [5, 5, 1, 1, 4, 4, 0, 4] },
    bass: { inst: 'tuba', pattern: 'two', gain: 0.12 }, comp: { inst: 'brass', at: [1, 3], gain: 0.03, len: 0.3 },
    lead: { inst: 'brass', gain: 0.06, vary: 0.25, rest: 0.08, oct: 1, lift: true },
    perc: { k: [0, 2], s: [1, 3], gain: 0.45 }, perc2: { s: [3.5], h: [0.5, 1.5, 2.5, 3.5], gain: 0.4 },
    lp: 4800, delay: 0.08, delayBeats: 0.5,
  },
  // Evening on the Row: the title screen. D major, slow, soft pad and mallets. 32 bars, about 91 s.
  title: {
    seed: 53, trim: 0.62, bpm: 84, swing: 0.1, key: 62, form: 'AABA',
    sections: { A: [0, 5, 3, 4, 0, 5, 1, 4], B: [3, 2, 1, 4, 3, 5, 1, 4] },
    pad: { inst: 'pad', gain: 0.04 }, bass: { inst: 'bass', pattern: 'two', gain: 0.1 },
    lead: { inst: 'mallet', gain: 0.085, vary: 0.35, rest: 0.15, oct: 1 },
    lp: 3800, delay: 0.2, delayBeats: 0.75,
  },
  // Cool Water: the results screens. A major, very slow, flute over a pad. 16 bars, about 55 s.
  results: {
    seed: 67, trim: 0.62, bpm: 70, key: 57, form: 'AABA',
    sections: { A: [0, 5, 3, 4], B: [3, 4, 5, [4, 1]] },
    pad: { inst: 'pad', gain: 0.05 }, bass: { inst: 'bass', pattern: 'root', gain: 0.08 },
    lead: { inst: 'flute', gain: 0.07, vary: 0.35, rest: 0.2, oct: 1 },
    lp: 3200, delay: 0.24, delayBeats: 1,
  },
};

// One bed per place. `crowd` and `wind` follow the race (speed, laps, passes): amb.set(name, 0..1).
export const SCENES = {
  // Downtown: a crowd murmur that rises with speed, steam hissing from the bathhouses, a far bell and a horn.
  town: {
    trim: 0.65,
    beds: [
      { type: 'bandpass', freq: 700, q: 0.5, gain: 0.06, lfo: { rate: 0.13, depth: 0.5 }, param: 'crowd', range: [0.35, 1.5] },
      { type: 'bandpass', freq: 1600, q: 0.7, gain: 0.02, lfo: { rate: 0.21, depth: 0.6 }, pan: -0.3, param: 'crowd', range: [0.2, 1.6] },
      { type: 'lowpass', freq: 260, gain: 0.035, lfo: { rate: 0.06, depth: 0.4 } },
      { type: 'bandpass', freq: 3800, q: 0.5, gain: 0.012, pan: 0.4, lfo: { rate: 0.08, depth: 0.8 } },
    ],
    spots: [
      { make: 'swell', every: [8, 16], gain: 0.05 },
      { make: 'hiss', every: [9, 20], gain: 0.035 },
      { make: 'bell', every: [18, 40], gain: 0.03, pan: [-0.7, 0.7] },
      { make: farHorn, every: [24, 50], gain: 0.04, pan: [-0.8, 0.8] },
    ],
  },
  // The mountain: wind in the trees that rises with speed, birds and cicadas.
  mountain: {
    trim: 0.9,
    beds: [
      { type: 'lowpass', freq: 380, gain: 0.06, lfo: { rate: 0.09, depth: 0.7 }, flfo: { rate: 0.04, depth: 120 }, param: 'wind', range: [0.5, 1.8] },
      { type: 'bandpass', freq: 1300, q: 0.4, gain: 0.015, pan: -0.3, lfo: { rate: 0.15, depth: 0.7 }, param: 'wind', range: [0.4, 1.6] },
    ],
    spots: [
      { make: 'bird', every: [2.5, 8], gain: 0.03 },
      { make: 'bird', every: [6, 15], gain: 0.02, pan: [-0.8, -0.3] },
      { make: 'cricket', every: [0.8, 2.2], gain: 0.02, pan: [-0.7, 0.7] },
    ],
  },
  // The plaza fountain for the Water Fight: falling water, a light crowd, drips.
  plaza: {
    trim: 0.9,
    beds: [
      { type: 'bandpass', freq: 1500, q: 0.6, gain: 0.05, lfo: { rate: 0.3, depth: 0.3 }, flfo: { rate: 0.07, depth: 200 } },
      { type: 'bandpass', freq: 3400, q: 0.7, gain: 0.02, pan: 0.3, lfo: { rate: 0.17, depth: 0.5 } },
      { type: 'lowpass', freq: 300, gain: 0.02, lfo: { rate: 0.05, depth: 0.4 } },
      { type: 'bandpass', freq: 800, q: 0.5, gain: 0.025, pan: -0.3, lfo: { rate: 0.12, depth: 0.5 }, param: 'crowd', range: [0.3, 1.4] },
    ],
    spots: [{ make: 'drip', every: [1.2, 4], gain: 0.04 }, { make: 'swell', every: [10, 20], gain: 0.04 }],
  },
};

// A far-off brass note, two close together (a band somewhere downtown).
function farHorn(ctx, dst, t, rnd, v) {
  const f = [233, 294, 349][(rnd() * 3) | 0];
  for (let i = 0; i < 2; i++) {
    const s = t + i * 0.5, o = ctx.createOscillator(), e = ctx.createGain(), lp = ctx.createBiquadFilter();
    o.type = 'sawtooth'; o.frequency.value = f * (i ? 1.5 : 1); lp.type = 'lowpass'; lp.frequency.value = 700;
    e.gain.setValueAtTime(0.0001, s); e.gain.linearRampToValueAtTime(v * 0.5, s + 0.12); e.gain.exponentialRampToValueAtTime(0.0001, s + 0.9);
    o.connect(lp); lp.connect(e); e.connect(dst); o.start(s); o.stop(s + 1);
  }
}
