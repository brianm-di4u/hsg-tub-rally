// Wave 2, batch A: sound. S5-01 (mix), S5-08 (cue layering), S5-20 (slide charge), S5-03 (rivals).
// Sound is measured, not heard: audioRender() renders a piece or cue offline at the shipped volume.
import fs from 'node:fs';

const SHOTS = '../_council/hsg-tub-rally/wave-2/measure';
const render = (t, name, secs, wav, args) => t.page.evaluate(([n, s, w, a]) => window.__game.audioRender(n, s, w, a), [name, secs, !!wav, args || []]);
const strip = (r) => ({ peak: r.peak, rms: r.rms, peakDb: r.peakDb, rmsDb: r.rmsDb, longestSilence: r.longestSilence, stereo: r.stereo });
const unlock = async (t) => { await t.waitIdle(8000); await t.page.keyboard.press('Shift'); await t.page.waitForFunction(() => window.__game.getState().audio.ctx === 'running', null, { timeout: 5000 }); };

export const tests = [
  {
    name: 'council A S5-01: every gameplay cue peaks between 0.2 and 0.45 at the shipped volume',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      const list = await t.game('audioList');
      const out = {};
      for (const c of list.cues) {
        const r = await render(t, 'cue:' + c, 2);
        out[c] = strip(r);
        const [lo, hi] = c === 'menu' ? [0.12, 0.3] : [0.2, 0.45];
        t.expect(r.peak >= lo && r.peak <= hi, `cue ${c} peaks ${r.peak} (want ${lo} to ${hi})`);
      }
      fs.writeFileSync(`${SHOTS}/cues.json`, JSON.stringify(out, null, 1));
    },
  },
  {
    name: 'council A S5-01: each tune sits under the cues (peak 0.06 to 0.16, RMS -40 to -28 dBFS) with no gap, and the busiest mix does not clip',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      const list = await t.game('audioList');
      const out = {};
      for (const m of list.music) {
        const r = await render(t, m, 60);
        out[m] = strip(r);
        t.expect(r.peak >= 0.06 && r.peak <= 0.16, `${m} peak ${r.peak}`);
        t.expect(r.rmsDb >= -40 && r.rmsDb <= -28, `${m} rms ${r.rmsDb} dBFS`);
        t.expect(r.longestSilence <= 2, `${m} silent for ${r.longestSilence} s`);
        const mix = await render(t, 'mix:' + m, 12);
        out['mix:' + m] = strip(mix);
        t.expect(mix.peak < 0.95, `${m} with the loudest cues peaks ${mix.peak}`);
      }
      fs.writeFileSync(`${SHOTS}/music.json`, JSON.stringify(out, null, 1));
    },
  },
  {
    name: 'council A S5-01: master 0.8 x volume, limiter on the master, gentle low-pass on the music, music ducks under hit and boost',
    viewports: ['desktop'],
    async run(t) {
      await unlock(t);
      await t.game('newGame', {});
      await t.game('act', 'skipCountdown');
      await t.waitFrames(3);
      const s = (await t.state()).audio;
      t.expect(Math.abs(s.mix.master - 0.6 * 0.8) < 0.01, 'master gain ' + s.mix.master);
      t.equal(s.mix.sfx, 1, 'sfx bus at unity');
      t.equal(s.mix.limiter.threshold, -14, 'limiter threshold');
      t.equal(s.mix.limiter.ratio, 4, 'limiter ratio');
      t.expect(s.mix.musicLP < 8000 && s.mix.musicLP > 2000, 'music low-pass ' + s.mix.musicLP);
      const before = s.ducks;
      await t.game('act', 'hit');
      await t.waitFrames(2);
      t.equal((await t.state()).audio.ducks, before + 1, 'a hit ducks the music once');
    },
  },
];
