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
        const [lo, hi] = c === 'menu' ? [0.12, 0.3] : [0.2, 0.45], peaks = [];
        for (let i = 0; i < 6; i++) { const r = await render(t, 'cue:' + c, 2); peaks.push(r.peak); if (!i) out[c] = strip(r); }
        out[c].peaks = peaks;
        t.expect(peaks.every((x) => x >= lo && x <= hi), `cue ${c} peaks ${peaks.join(', ')} (want ${lo} to ${hi})`);
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
  {
    name: 'council A S5-08: repeats of a cue differ (pitch, level, noise offset) and the frequent cues are layers',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      const res = await t.page.evaluate(async () => {
        const out = {};
        for (const c of ['pickup', 'bump', 'splash', 'boost', 'ready', 'quack']) {
          const rs = []; for (let i = 0; i < 6; i++) { const r = await window.__game.audioRender('cue:' + c, 1.5, false); rs.push([r.peak, r.rms]); }
          out[c] = { peaks: new Set(rs.map((x) => x[0])).size, rms: new Set(rs.map((x) => x[1])).size, spreadDb: +(20 * Math.log10(Math.max(...rs.map((x) => x[1])) / Math.min(...rs.map((x) => x[1])))).toFixed(2) };
        }
        return out;
      });
      for (const [c, r] of Object.entries(res)) { t.expect(r.peaks >= 5 && r.rms >= 3, c + ' repeats are not identical: ' + JSON.stringify(r)); t.expect(r.spreadDb >= 0.3, c + ' level spreads ' + r.spreadDb + ' dB'); }
      // count the nodes a cue builds on the offline context
      const nodes = await t.page.evaluate(async () => {
        const OC = window.OfflineAudioContext, count = {}, fm = [];
        const wrap = (m) => { const o = OC.prototype[m]; OC.prototype[m] = function (...a) { count[m] = (count[m] || 0) + 1; const n = o.apply(this, a); if (m === 'createBiquadFilter') fm.push(n); return n; }; return () => { OC.prototype[m] = o; }; };
        const undo = ['createOscillator', 'createBufferSource', 'createConvolver', 'createStereoPanner', 'createBiquadFilter'].map(wrap);
        const per = {};
        for (const c of ['pickup', 'splash', 'bump', 'quack', 'hit']) { for (const k of Object.keys(count)) count[k] = 0; fm.length = 0; await window.__game.audioRender('cue:' + c, 1, false); per[c] = { ...count, bands: fm.filter((f) => f.type === 'bandpass').map((f) => Math.round(f.frequency.value)).sort((a, b) => a - b) }; }
        undo.forEach((u) => u());
        return per;
      });
      t.expect(nodes.pickup.createOscillator >= 7, 'pickup is detuned layers plus a sparkle: ' + nodes.pickup.createOscillator + ' oscillators');
      t.expect(nodes.pickup.createBufferSource >= 1, 'pickup has a noise transient');
      t.expect(nodes.splash.createBufferSource >= 3, 'splash is three noise layers: ' + nodes.splash.createBufferSource);
      t.expect(nodes.splash.bands.length >= 3 && new Set(nodes.splash.bands).size >= 3, 'splash layers sit in different bands ' + nodes.splash.bands);
      t.expect(nodes.bump.createOscillator >= 4 && nodes.bump.createBufferSource >= 1, 'bump is a thump, a body and a noise transient');
      t.expect(nodes.quack.bands.some((f) => Math.abs(f - 700) < 3) && nodes.quack.bands.some((f) => Math.abs(f - 1200) < 3), 'quack has formants at 700 and 1200 Hz: ' + nodes.quack.bands);
      t.expect(nodes.hit.createOscillator >= 4, 'hit has a 60 Hz thump under the splash');
      t.expect(nodes.splash.createConvolver >= 1, 'a reverb send is part of the bus tree');
    },
  },
  {
    name: 'council A S5-08: a bump scales with speed, the finish cue depends on the place, the final lap has its own cue',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      const r = await t.page.evaluate(async () => {
        const g = window.__game, R = (n, a) => g.audioRender('cue:' + n, 3, false, a);
        const soft = await R('bump', [3]), hard = await R('bump', [14]);
        const win = await R('finish', [1]), third = await R('finish', [3]), mid = await R('finish', [5]);
        return { soft: soft.rms, hard: hard.rms, win: win.rms, third: third.rms, mid: mid.rms, midSecs: mid.secs, winSecs: win.secs, list: g.audioList().cues };
      });
      t.expect(r.hard > r.soft * 1.6, 'a hard bump is louder than a soft one: ' + r.soft + ' vs ' + r.hard);
      t.expect(r.win > r.mid * 1.15, 'first place is bigger than fifth: ' + r.win + ' vs ' + r.mid);
      t.expect(r.third > r.mid, 'the podium gets more than fifth');
      t.expect(r.list.includes('finalLap') && r.list.includes('lap'), 'final lap has its own cue');
    },
  },
  {
    name: 'council A S5-08: the race plays the final-lap cue on the last lap, and the finish cue with the place',
    viewports: ['desktop'],
    async run(t) {
      await unlock(t);
      await t.game('newGame', { laps: 2, seed: 12, autoplay: true, paused: true });
      await t.game('act', 'skipCountdown');
      await t.stepUntil((st) => st.race.karts.find((k) => k.human).lap >= 2, { max: 60 * 200, chunk: 300, label: 'last lap' });
      let cues = (await t.state()).audio.cues;
      t.expect(cues.includes('finalLap') && !cues.includes('lap'), 'entering the last lap plays finalLap, not lap: ' + cues);
      await t.stepUntil((st) => st.race.karts.find((k) => k.human).finished, { max: 60 * 300, chunk: 300, label: 'finished' });
      const st = await t.state();
      const place = st.race.karts.find((k) => k.human).place;
      cues = st.audio.cues;
      t.expect(cues.some((c) => /^finish:[0-9]/.test(c)), 'the finish cue is played with a place: ' + cues);
      t.expect(cues.some((c) => c === 'finish:' + place), 'it is the player place ' + place + ': ' + cues);
    },
  },
];
