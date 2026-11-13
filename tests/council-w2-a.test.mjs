// Wave 2, batch A: sound. S5-01 (mix), S5-08 (cue layering), S5-20 (slide charge), S5-03 (rivals).
// Sound is measured, not heard: audioRender() renders a piece or cue offline at the shipped volume.
import fs from 'node:fs';

const SHOTS = '../_council/hsg-tub-rally/wave-2/measure';
const render = (t, name, secs, wav, args) => t.page.evaluate(([n, s, w, a]) => window.__game.audioRender(n, s, w, a), [name, secs, !!wav, args || []]);
const strip = (r) => ({ peak: r.peak, rms: r.rms, peakDb: r.peakDb, rmsDb: r.rmsDb, longestSilence: r.longestSilence, stereo: r.stereo });
const unlock = async (t) => { await t.waitIdle(8000); await t.page.keyboard.press('Shift'); await t.page.waitForFunction(() => window.__game.getState().audio.ctx === 'running', null, { timeout: 5000 }); };

// spectral centroid (Hz) of the mono mix of a base64 WAV (16-bit stereo) between two times, by a plain FFT
function centroid(b64, from, to, rate = 22050) {
  const b = Buffer.from(b64, 'base64'), N = 8192, start = Math.floor(from * rate), re = new Float64Array(N), im = new Float64Array(N);
  for (let i = 0; i < N; i++) { const j = start + i; const v = j * 4 + 46 < b.length ? (b.readInt16LE(44 + j * 4) + b.readInt16LE(46 + j * 4)) / 65536 : 0; re[i] = v * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / N)); }
  for (let i = 1, j = 0; i < N; i++) { let bit = N >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; } }
  for (let len = 2; len <= N; len <<= 1) {
    const ang = (-2 * Math.PI) / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < N; i += len) { let cr = 1, ci = 0; for (let k = 0; k < len / 2; k++) { const a = i + k, c = a + len / 2, xr = re[c] * cr - im[c] * ci, xi = re[c] * ci + im[c] * cr; re[c] = re[a] - xr; im[c] = im[a] - xi; re[a] += xr; im[a] += xi; const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t; } }
  }
  let num = 0, den = 0; for (let i = 1; i < N / 2; i++) { const m = Math.hypot(re[i], im[i]); num += m * ((i * rate) / N); den += m; }
  return num / (den || 1);
}

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
  {
    name: 'council A S5-20: the slide loop sits under the cues and its pitch and brightness climb with the charge',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      const r = await render(t, 'loop:slide', 6, true);
      t.expect(r.peak >= 0.05 && r.peak <= 0.2, 'slide loop peak ' + r.peak);
      t.expect(r.rmsDb >= -40 && r.rmsDb <= -24, 'slide loop rms ' + r.rmsDb);
      const track = r.built.track;
      t.expect(track.every((x, i) => i === 0 || x[2] >= track[i - 1][2]), 'tone never falls as the charge grows');
      t.expect(track[0][2] <= 270 && track[track.length - 1][2] >= 800, 'tone climbs from ' + track[0][2] + ' to ' + track[track.length - 1][2] + ' Hz');
      const early = centroid(r.wav, 0.5), late = centroid(r.wav, 5.0);
      t.expect(late > early * 1.4, 'spectral centroid rises with the charge: ' + Math.round(early) + ' Hz to ' + Math.round(late) + ' Hz');
      fs.writeFileSync(SHOTS + '/slide-loop.json', JSON.stringify({ ...strip(r), centroidStart: Math.round(early), centroidEnd: Math.round(late), toneStart: track[0][2], toneEnd: track[track.length - 1][2] }, null, 1));
      const hot = await render(t, 'cue:charge', 1, false, [2]), warm = await render(t, 'cue:charge', 1, false, [1]);
      t.expect(warm.peak >= 0.2 && hot.peak >= 0.2, 'stage ticks are audible: ' + warm.peak + ', ' + hot.peak);
    },
  },
  {
    name: 'council A S5-20: Warm and Hot ticks and the landing thud play from the sim events; the slide voice follows a real power-slide',
    viewports: ['desktop'],
    async run(t) {
      await unlock(t);
      await t.game('newGame', { seed: 12, paused: true });
      await t.game('act', 'skipCountdown');
      await t.game('act', 'event', { type: 'charge', stage: 1 });
      await t.game('act', 'event', { type: 'charge', stage: 2 });
      await t.game('act', 'event', { type: 'land', v: 12 });
      const cues = (await t.state()).audio.cues;
      t.expect(cues.includes('charge:1') && cues.includes('charge:2') && cues.some((c) => c.startsWith('land:12')), 'cues for Warm, Hot and landing: ' + cues);
      // real time: build speed, hop into a slide and hold it (on the straight at s = 200)
      await t.game('setState', { kart: { s: 200, vf: 16 } });
      await t.game('act', 'input', { push: 1, steer: 0.35, hop: false, brake: false });
      await t.game('resume');
      await t.page.waitForTimeout(400);
      await t.game('act', 'input', { push: 1, steer: 0.35, hop: true, brake: false });
      const samples = await t.page.evaluate(() => new Promise((res) => {
        const out = [], t0 = performance.now();
        const tick = () => { const a = window.__game.getState().audio.slide; out.push([a.on, a.hz, a.charge]); if (performance.now() - t0 < 1100) requestAnimationFrame(tick); else res(out); };
        tick();
      }));
      const on = samples.filter((x) => x[0]);
      t.expect(on.length >= 8, 'the slide voice is on while sliding (' + on.length + ' frames)');
      t.expect(on.every((x, i) => i === 0 || x[1] >= on[i - 1][1] - 1), 'its pitch only rises while the charge builds');
      t.expect(on.length > 1 && on[on.length - 1][1] - on[0][1] >= 40, 'it climbed from ' + (on[0] || [])[1] + ' to ' + (on[on.length - 1] || [])[1] + ' Hz');
      await t.game('act', 'input', { push: 1, steer: 0, hop: false });
      await t.page.waitForFunction(() => !window.__game.getState().audio.slide.on, null, { timeout: 5000 });
    },
  },
  {
    name: 'council A S5-03: rival footsteps sit under the cues, pan to their side and fall with distance (rendered)',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      const R = (pan, dist) => render(t, 'loop:rivals:' + pan + ':' + dist, 3);
      const left = await R(-0.7, 4), right = await R(0.7, 4), mid = await R(0, 12), edge = await R(0, 24), gone = await R(0, 26), near = await R(0, 2);
      t.expect(left.peak >= 0.05 && left.peak <= 0.2 && right.peak >= 0.05 && right.peak <= 0.2, 'a rival at 4 m peaks ' + left.peak + ' and ' + right.peak + ' (under the cues, over the music)');
      t.expect(left.rmsDb >= -44 && left.rmsDb <= -28, 'a rival at 4 m has rms ' + left.rmsDb);
      t.expect(left.balance <= -0.4, 'a rival on the left is in the left ear: ' + left.balance);
      t.expect(right.balance >= 0.4, 'a rival on the right is in the right ear: ' + right.balance);
      t.expect(Math.abs(mid.balance) < 0.05, 'a rival ahead is centred: ' + mid.balance);
      t.expect(near.rms > mid.rms * 1.5 && mid.rms > edge.rms * 2, 'it falls with distance: ' + near.rms + ', ' + mid.rms + ', ' + edge.rms);
      t.expect(gone.peak < 0.001, 'at 26 m (past 25) it is silent: ' + gone.peak);
      const swish = [await render(t, 'cue:swish@-0.7', 1.5), await render(t, 'cue:swish@0.7', 1.5)];
      t.expect(swish[0].balance <= -0.4 && swish[1].balance >= 0.4 && swish.every((x) => x.peak >= 0.15 && x.peak <= 0.45), 'the swish is panned: ' + swish.map((x) => x.balance + ' / ' + x.peak));
      const pc = await render(t, 'cue:bump@0.5', 1.5, false, [10]);
      t.expect(pc.balance > 0.2, 'a panned cue comes from its side: ' + pc.balance);
      fs.writeFileSync(SHOTS + '/rivals.json', JSON.stringify({ left: strip(left), right: strip(right), at12: strip(mid), at24: strip(edge), at26: strip(gone), at2: strip(near), swishLeft: strip(swish[0]), swishRight: strip(swish[1]) }, null, 1));
    },
  },
  {
    name: 'council A S5-03: in a race the nearest three rivals are voiced by distance and screen side, and their events are heard',
    viewports: ['desktop'],
    async run(t) {
      await unlock(t);
      await t.game('newGame', { seed: 12, paused: true });
      await t.game('act', 'skipCountdown');
      await t.waitFrames(4);
      await t.game('act', 'camSnap');
      await t.waitFrames(3);
      const base = await t.state(), me = base.race.player, my = base.race.karts[me], rivals = base.race.karts.filter((k) => k.id !== me).map((k) => k.id);
      const place = async (id, ds, d) => { await t.game('setState', { kart: { id, s: my.s + ds, d, vf: 16 } }); };
      const frame = (dt) => t.page.evaluate((x) => { window.__game.act('audioFrame', x); return window.__game.getState().audio.rivals; }, dt || 0.05);
      const heard = async () => (await t.state()).audio.cues.filter((c) => c.includes('@')).length;
      for (const id of rivals) await place(id, 60 + id * 3, 0);
      let r = await frame();
      t.equal(r.voices.length, 0, 'nobody is close: no rival voice');
      for (const side of [6, -6]) {
        await place(rivals[0], 9, side);
        const ndc = await t.game('act', 'ndc', rivals[0]);
        r = await frame();
        const v = r.voices.find((x) => x.id === rivals[0]);
        t.expect(v && v.gain > 0, 'a rival 9 m ahead is voiced');
        t.expect(Math.abs(ndc.x) > 0.1, 'the rival is clearly off centre on screen: ' + ndc.x);
        t.expect(v && Math.sign(v.pan) === Math.sign(ndc.x) && Math.abs(v.pan) > 0.05, 'its pan ' + (v && v.pan) + ' is on its side of the screen (ndc x ' + ndc.x + ') at lateral ' + side);
        t.expect(v && Math.abs(v.pan) <= 0.7, 'pan stays within 0.7');
      }
      const gains = [];
      for (const ds of [6, 12, 20]) { await place(rivals[0], ds, 0); r = await frame(); gains.push((r.voices.find((x) => x.id === rivals[0]) || {}).gain || 0); }
      t.expect(gains[0] > gains[1] && gains[1] > gains[2] && gains[2] > 0, 'gain falls with distance: ' + gains);
      await place(rivals[0], 30, 0); r = await frame();
      t.expect(!r.voices.find((x) => x.id === rivals[0]), 'beyond 25 m a rival is not voiced');
      for (const [i, id] of rivals.slice(0, 5).entries()) await place(id, 5 + i * 3, i % 2 ? 3 : -3);
      r = await frame();
      t.equal(r.voices.length, 3, 'only the nearest three get a voice');
      t.expect(r.voices.every((v) => rivals.slice(0, 3).includes(v.id)), 'they are the nearest three: ' + JSON.stringify(r.voices.map((v) => v.id)));
      for (const id of rivals) await place(id, 60 + id * 3, 0);
      await frame();
      // events: a rival's bump near is heard panned and quieter, far is not, on top of the player is left to the player's own bump
      const n0 = await heard();
      await place(rivals[0], 8, 3.5);
      await t.game('act', 'event', { type: 'bump', v: 10 }, rivals[0]);
      const cues = (await t.state()).audio.cues;
      t.expect(cues.some((c) => /^bump:10@-?[0-9]\.[0-9]+\*0\.[0-9]+$/.test(c)), 'a near rival bump is heard, panned and quieter: ' + cues.slice(-3));
      const n1 = await heard();
      t.equal(n1, Math.min(n0 + 1, 24), 'one cue for it');
      await place(rivals[0], 45, 0);
      await t.game('act', 'event', { type: 'bump', v: 10 }, rivals[0]);
      await t.game('act', 'event', { type: 'fumble' }, rivals[0]);
      t.equal(await heard(), n1, 'rival events 45 m away are silent');
      await place(rivals[0], 1, 1);
      await t.game('act', 'event', { type: 'bump', v: 10 }, rivals[0]);
      t.equal(await heard(), n1, 'a bump against the player is left to the player cue: ' + (await t.state()).audio.cues.slice(-4));
      await place(rivals[0], 10, 3.5);
      await t.game('act', 'event', { type: 'fumble' }, rivals[0]);
      t.expect((await t.state()).audio.cues.some((c) => /^hit@/.test(c)), 'a rival that is hit is heard');
    },
  },
  {
    name: 'council A S5-03: a rival that overtakes within 4 m gets a swish on its side; one far off does not',
    viewports: ['desktop'],
    async run(t) {
      await unlock(t);
      await t.game('newGame', { seed: 12, paused: true });
      await t.game('act', 'skipCountdown');
      await t.waitFrames(4);
      await t.game('act', 'camSnap');
      await t.waitFrames(3);
      const base = await t.state(), me = base.race.player, my = base.race.karts[me], rival = base.race.karts.find((k) => k.id !== me).id;
      for (const k of base.race.karts) if (k.id !== me && k.id !== rival) await t.game('setState', { kart: { id: k.id, s: my.s + 80, d: 0 } });
      // each walk runs inside one page call, so no real frame (which is not live while paused) clears the tracking between steps
      const walk = (steps) => t.page.evaluate(([id, s0, list]) => {
        const g = window.__game;
        for (const [ds, d, dt] of list) { g.setState({ kart: { id, s: s0 + ds, d, vf: 16 } }); g.act('audioFrame', dt); }
        const a = g.getState().audio; return { passes: a.rivals.passes, cues: a.cues };
      }, [rival, my.s, steps]);
      let r = await walk([[-2.5, 2.5, 0.05], [2.5, 2.5, 0.05]]);
      const first = r.passes;
      t.expect(first >= 1 && r.cues.some((c) => /^swish@/.test(c)), 'overtaking within 4 m plays a swish: ' + r.cues.slice(-2));
      r = await walk([[-2.5, 2.5, 0.05], [2.5, 2.5, 0.05]]);
      t.equal(r.passes, first, 'a second pass within the 1.2 s cool-down is not repeated');
      r = await walk([[-20, 2.5, 0.4], [20, 2.5, 0.4]]);
      t.equal(r.passes, first, 'a rival 20 m away going by does not swish');
      r = await walk([[2.5, 2.5, 2], [-2.5, 2.5, 2]]);
      t.expect(r.passes === first + 1 && /^swish@-?[0-9]\.[0-9]+\*0\.70$/.test(r.cues[r.cues.length - 1]), 'the player overtaking a rival gets the softer swish after the cool-down: ' + r.cues.slice(-1));
    },
  },
];
