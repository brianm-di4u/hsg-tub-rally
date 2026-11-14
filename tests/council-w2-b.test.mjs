// Wave 2, batch B: sound. S5-02 (longer music with a form, a final-lap lift, a results piece) and S5-04 (ambience).
// Sound is measured, not heard: audioRender() renders a piece or scene offline at the shipped volume.
// WAV previews for the owner to listen to are written to _council/hsg-tub-rally/wave-2/measure/wav/.
import fs from 'node:fs';

const OUT = '../_council/hsg-tub-rally/wave-2/measure';
const SHOTS = '../_council/hsg-tub-rally/wave-2/shots';
const render = (t, name, secs, wav, args) => t.page.evaluate(([n, s, w, a]) => window.__game.audioRender(n, s, w, a), [name, secs, !!wav, args || []]);
const strip = (r) => ({ peak: r.peak, rms: r.rms, peakDb: r.peakDb, rmsDb: r.rmsDb, longestSilence: r.longestSilence, stereo: r.stereo, built: r.built });
const unlock = async (t) => { await t.waitIdle(8000); await t.page.keyboard.press('Shift'); await t.page.waitForFunction(() => window.__game.getState().audio.ctx === 'running', null, { timeout: 5000 }); };
const audio = async (t) => (await t.state()).audio;
const wav = (name, b64) => { fs.mkdirSync(`${OUT}/wav`, { recursive: true }); fs.writeFileSync(`${OUT}/wav/${name}.wav`, Buffer.from(b64, 'base64')); };
// wait (in the page) until the music and ambience buses are each open ('open'), closed ('closed') or either ('any')
const buses = (t, music, amb) => t.page.waitForFunction(([m, a]) => { const k = window.__game.getState().audio.kit; const ok = (v, w) => w === 'any' || (w === 'open' ? v > 0.9 : v < 0.01); return k && ok(k.music, m) && ok(k.amb, a); }, [music, amb], { timeout: 5000 }).catch(() => {});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const tests = [
  {
    name: 'council B S5-02: every piece plays a minute before it repeats, has a form and varies, and sits at the music level',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      const list = await t.game('audioList');
      t.expect(['rag', 'grass', 'swing', 'march', 'title', 'results'].every((n) => list.music.includes(n)), 'pieces: ' + list.music);
      const out = {};
      for (const m of list.music) {
        const r = await render(t, m, 60, true);
        wav('music-' + m, r.wav); delete r.wav;
        out[m] = strip(r);
        t.expect(r.peak >= 0.06 && r.peak <= 0.16, `${m} peak ${r.peak}`);
        t.expect(r.rmsDb >= -40 && r.rmsDb <= -28, `${m} rms ${r.rmsDb} dBFS`);
        t.expect(r.longestSilence <= 2, `${m} silent for ${r.longestSilence} s`);
        t.expect(r.built.formSeconds >= 45, `${m} form lasts ${r.built.formSeconds} s before it repeats`);
        t.expect(r.built.distinctBars >= 6, `${m} has ${r.built.distinctBars} distinct bars`);
        t.expect(r.built.pitches >= 6, `${m} uses ${r.built.pitches} pitches`);
      }
      fs.writeFileSync(`${OUT}/music-w2b.json`, JSON.stringify(out, null, 1));
    },
  },
  {
    name: 'council B S5-02: the final-lap arrangement is faster and still inside the mix limits; the loudest moment never clips',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      const out = {};
      for (const m of ['rag', 'grass', 'swing', 'march']) {
        const calm = await render(t, m, 40, false, [0]), fast = await render(t, m, 40, m === 'rag', [1]);
        if (fast.wav) { wav('music-rag-final-lap', fast.wav); delete fast.wav; }
        out[m] = { calm: strip(calm), final: strip(fast) };
        t.expect(fast.built.formSeconds < calm.built.formSeconds * 0.95, `${m} runs faster on the last lap: ${fast.built.formSeconds} s against ${calm.built.formSeconds} s`);
        t.expect(fast.peak <= 0.2 && fast.peak >= 0.06, `${m} on the last lap peaks ${fast.peak}`);
        t.expect(fast.rmsDb >= -40 && fast.rmsDb <= -26, `${m} on the last lap is ${fast.rmsDb} dBFS`);
        t.expect(fast.longestSilence <= 2, `${m} last lap silent for ${fast.longestSilence} s`);
        const mix = await render(t, 'mix:' + m, 12);
        out[m].mix = strip(mix);
        t.expect(mix.peak < 0.95, `${m} with the town crowd and the loudest cues peaks ${mix.peak}`);
      }
      fs.writeFileSync(`${OUT}/music-final-lap-w2b.json`, JSON.stringify(out, null, 1));
    },
  },
  {
    name: 'council B S5-04: every ambience scene sits under the music with no silent stretch, at a still and at a full race',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      const list = await t.game('audioList');
      t.expect(['town', 'mountain', 'plaza'].every((n) => list.ambience.includes(n)), 'scenes: ' + list.ambience);
      const out = {};
      for (const a of list.ambience) {
        for (const lv of [0, 0.5, 1]) {
          const r = await render(t, a, 30, lv === 0.5, [lv]);
          if (r.wav) { wav('ambience-' + a, r.wav); delete r.wav; }
          out[a + '@' + lv] = strip(r);
          t.expect(r.peak < 0.07 && r.peak > 0.005, `${a}@${lv} peak ${r.peak}`);
          t.expect(r.rmsDb >= -52 && r.rmsDb <= -38, `${a}@${lv} rms ${r.rmsDb} dBFS`);
          t.expect(r.longestSilence <= 2, `${a}@${lv} silent for ${r.longestSilence} s`);
        }
        const quiet = out[a + '@0'], loud = out[a + '@1'];
        if (a !== 'plaza') t.expect(loud.rms >= quiet.rms, `${a} is louder at full speed (${loud.rmsDb}) than standing (${quiet.rmsDb})`);
      }
      fs.writeFileSync(`${OUT}/ambience-w2b.json`, JSON.stringify(out, null, 1));
    },
  },
  {
    name: 'council B S5-02 S5-04: the right piece and place for each course, a faster tune on the last lap, a results piece, and the title has its own',
    viewports: ['desktop'],
    async run(t) {
      await unlock(t);
      let a = await audio(t);
      t.equal(a.theme, 'title', 'the title has its own piece');
      t.equal(a.scene, 'town', 'and the downtown bed');
      for (const [track, scene, piece, extra] of [['bathhouse-row', 'town', 'rag', {}], ['hs-mountain', 'mountain', 'grass', {}], ['hill-wheatley', 'plaza', 'march', { mode: 'battle' }], ['bathhouse-row', 'town', 'march', { mode: 'row', heatTeams: ['engine-six', 'lather-linen'], label: 'Semifinal' }]]) {
        await t.game('newGame', { track, ...extra });
        await t.waitFrames(3);
        a = await audio(t);
        t.equal(a.scene, scene, `${track} ${extra.mode || ''}: the ${scene} bed`);
        t.equal(a.theme, piece, `${track} ${extra.mode || ''}: ${piece}`);
        t.equal(a.intensity, 0, 'a new race starts calm');
      }
      await t.game('newGame', { laps: 2, seed: 12, autoplay: true, paused: true });
      await t.game('act', 'skipCountdown');
      a = await audio(t);
      t.equal(a.intensity, 0, 'first lap is calm');
      await t.stepUntil((st) => st.race.karts.find((k) => k.human).lap >= 2, { max: 60 * 200, chunk: 300, label: 'last lap' });
      a = await audio(t);
      t.equal(a.intensity, 1, 'the last lap lifts the music');
      t.expect(a.cues.includes('finalLap'), 'with the final-lap cue');
      await t.stepUntil((st) => st.race.phase === 'done', { max: 60 * 400, chunk: 300, label: 'race done' });
      await t.waitFrames(3);
      a = await audio(t);
      t.equal(a.theme, 'results', 'the results piece plays when the race is over');
      t.equal(a.intensity, 0, 'and it is calm');
      await t.game('newGame', { track: 'bathhouse-row', laps: 2, seed: 12, paused: true });
      a = await audio(t);
      t.equal(a.intensity, 0, 'a restart is calm again');
      t.equal(a.theme, 'rag', 'with the play piece back');
    },
  },
  {
    name: 'council B S5-04: the crowd bed rises with speed and swells on a lap, the wind bed rises with speed',
    viewports: ['desktop'],
    async run(t) {
      await unlock(t);
      // one frame of race sound and the reading in the same page call: the live loop runs its own frames in between
      const frame = (vf) => t.page.evaluate((v) => { const g = window.__game; g.setState({ kart: { vf: v } }); g.act('audioFrame', 1 / 60); return g.getState().audio.amb; }, vf);
      await t.game('newGame', { track: 'hs-mountain', seed: 12, paused: true });
      await t.game('act', 'skipCountdown');
      const still = await frame(0);
      let fast = still;
      for (let i = 0; i < 20; i++) fast = await frame(18);
      t.expect(fast.wind > still.wind + 0.3, `wind ${still.wind} still, ${fast.wind} at speed`);
      t.expect(fast.crowd > still.crowd + 0.2, `crowd ${still.crowd} still, ${fast.crowd} at speed`);
      await t.game('newGame', { track: 'bathhouse-row', laps: 2, seed: 12, autoplay: true, paused: true });
      await t.game('act', 'skipCountdown');
      const swells = (await audio(t)).amb.swells;
      await t.stepUntil((st) => st.race.karts.find((k) => k.human).lap >= 2, { max: 60 * 200, chunk: 300, label: 'last lap' });
      const a = await audio(t);
      t.expect(a.amb.swells > swells, `the crowd swells on the last-lap line (${swells} to ${a.amb.swells})`);
      t.equal(a.intensity, 1, 'and the last lap is on');
      const lift = await t.page.evaluate(() => { const g = window.__game; g.act('audioFrame', 1 / 60); return g.getState().audio.amb.crowd; });
      t.expect(lift >= 0.4, 'the crowd bed is up on the last lap: ' + lift);
    },
  },
  {
    name: 'council B S5-02 S5-04: nothing plays before the first gesture; music and ambience obey the Sound switch',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      let a = await audio(t);
      t.equal(a.ctx, 'none', 'no audio context before a key or touch');
      t.equal(a.kit, null, 'and no kit');
      await t.page.keyboard.press('Shift');
      await t.page.waitForFunction(() => window.__game.getState().audio.ctx === 'running', null, { timeout: 5000 });
      await t.waitFrames(3);
      a = await audio(t);
      t.expect(a.kit && a.kit.music > 0.9 && a.kit.amb > 0.9, 'after the gesture both buses are open: ' + JSON.stringify(a.kit));
      t.expect(a.mix.master > 0.4, 'master open ' + a.mix.master);
      await t.game('scene', 'settings');
      await t.page.click('button[data-k="sound"][data-v="false"]');
      await t.waitFrames(15);
      a = await audio(t);
      t.expect(a.mix.master < 0.01, 'Sound off closes the master over music and ambience: ' + a.mix.master);
    },
  },
  {
    name: 'council B S5-04: the Music and Ambience switches each silence their own bus and persist across a reload',
    viewports: ['desktop'],
    async run(t) {
      await unlock(t);
      await t.game('scene', 'settings');
      t.expect(await t.page.locator('button[data-k="ambience"]').count() === 2, 'an Ambience row with On and Off');
      await t.page.click('button[data-k="ambience"][data-v="false"]');
      await buses(t, 'open', 'closed');
      let a = await audio(t);
      t.equal(a.ambience, false, 'ambience flag off');
      t.expect(a.kit.amb < 0.01 && a.kit.music > 0.9, 'ambience bus closed, music open: ' + JSON.stringify(a.kit));
      await t.page.click('button[data-k="music"][data-v="false"]');
      await buses(t, 'closed', 'closed');
      a = await audio(t);
      t.expect(a.kit.music < 0.01 && a.kit.amb < 0.01, 'both closed: ' + JSON.stringify(a.kit));
      await t.reload();
      await unlock(t);
      await buses(t, 'closed', 'closed');
      a = await audio(t);
      t.expect(a.music === false && a.ambience === false, 'both settings survive a reload');
      t.expect(a.kit.music < 0.01 && a.kit.amb < 0.01, 'and both buses start closed: ' + JSON.stringify(a.kit));
      await t.game('scene', 'settings');
      await t.page.click('button[data-k="ambience"][data-v="true"]');
      await t.page.click('button[data-k="music"][data-v="true"]');
      await buses(t, 'open', 'open');
      a = await audio(t);
      t.expect(a.kit.music > 0.9 && a.kit.amb > 0.9, 'turned back on: ' + JSON.stringify(a.kit));
    },
  },
  {
    name: 'council B S5-04: a save from before this wave loads with ambience on, and one that had sound off stays silent',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      const old = { v: 1, settings: { sound: true, music: false, volume: 0.6, res: 'native', quality: 'auto', autoPush: false, steerAssist: false, reducedMotion: null, hudScale: 1, keys: null, brick: true }, unlocked: { teams: [], cups: ['bathhouse'], classes: ['splash', 'soak'], mirror: false }, best: {}, ghosts: {}, cups: {}, stats: { races: 3, wins: 1, gallonsSpilled: 0 }, lastTeam: 'engine-six', lastClass: 'soak' };
      await t.page.evaluate((s) => localStorage.setItem('hsg-tub-rally-v1', JSON.stringify(s)), old);
      await t.reload();
      await unlock(t);
      await buses(t, 'closed', 'open');
      let a = await audio(t);
      t.equal(a.ambience, true, 'ambience defaults on for an old save');
      t.equal(a.music, false, 'music stays as the player left it (off)');
      t.expect(a.kit.music < 0.01 && a.kit.amb > 0.9, 'music silent, ambience open: ' + JSON.stringify(a.kit));
      const kept = await t.page.evaluate(() => JSON.parse(localStorage.getItem('hsg-tub-rally-v1')));
      t.equal(kept.stats.races, 3, 'the save still holds its stats');
      old.settings.sound = false; old.settings.music = true;
      await t.page.evaluate((s) => localStorage.setItem('hsg-tub-rally-v1', JSON.stringify(s)), old);
      await t.reload();
      await unlock(t);
      await t.page.waitForFunction(() => window.__game.getState().audio.mix.master < 0.01, null, { timeout: 5000 }).catch(() => {});
      a = await audio(t);
      t.expect(a.on === false && a.mix.master < 0.01, 'sound off in an old save keeps music and ambience silent: master ' + a.mix.master);
    },
  },
  {
    name: 'council B S5-02 S5-04: music and ambience fade out and schedule nothing under the pause card or in a hidden tab, and come back without a pile-up',
    viewports: ['desktop'],
    async run(t) {
      await unlock(t);
      await t.game('newGame', { track: 'bathhouse-row', seed: 12 });
      await t.game('act', 'skipCountdown');
      await t.waitFrames(3);
      const bars = async () => (await audio(t)).kit.info;
      const b0 = await bars();
      await sleep(2600);
      const b1 = await bars();
      t.expect(b1.bars > b0.bars, `while racing the music keeps scheduling bars (${b0.bars} to ${b1.bars})`);
      await t.page.keyboard.press('Escape');
      await t.waitFrames(5);
      await buses(t, 'closed', 'closed');
      let a = await audio(t);
      t.expect(a.muffled && a.kit.held, 'held under the pause card');
      t.expect(a.kit.music < 0.02 && a.kit.amb < 0.02, 'both buses faded out: ' + JSON.stringify(a.kit));
      const p0 = a.kit.info.bars;
      await sleep(2600);
      t.equal((await bars()).bars, p0, 'no new bars scheduled while paused');
      await t.page.keyboard.press('Escape');
      await t.waitFrames(5);
      await buses(t, 'open', 'open');
      a = await audio(t);
      t.expect(!a.kit.held && a.kit.music > 0.9 && a.kit.amb > 0.9, 'back after the pause: ' + JSON.stringify(a.kit));
      // a hidden tab
      await t.page.evaluate(() => { Object.defineProperty(document, 'hidden', { value: true, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
      await t.page.waitForFunction(() => window.__game.getState().audio.kit.held, null, { timeout: 3000 });
      a = await audio(t);
      t.expect(a.kit.held, 'held while the tab is hidden');
      await t.page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
      await t.waitFrames(5);
      t.expect((await t.state()).paused, 'the race is paused on return');
      await t.page.keyboard.press('Escape');
      await t.waitFrames(5);
      await buses(t, 'open', 'open');
      a = await audio(t);
      t.expect(!a.kit.held && a.kit.music > 0.9, 'resumed without a pile-up: ' + JSON.stringify(a.kit));
    },
  },
  {
    name: 'council B S5-04: the Settings screen shows the Ambience row at both sizes',
    async run(t) {
      await t.waitIdle(8000);
      await t.game('scene', 'settings');
      await t.waitFrames(5);
      const rows = await t.page.evaluate(() => [...document.querySelectorAll('.settings .set-row > span')].map((e) => e.textContent));
      t.expect(rows.includes('Sound') && rows.includes('Music') && rows.includes('Ambience'), 'rows: ' + rows);
      const small = await t.page.evaluate(() => [...document.querySelectorAll('.settings button')].map((b) => { const r = b.getBoundingClientRect(); return { h: r.height, w: r.width, t: b.textContent }; }).filter((b) => b.h < 40 || b.w < 40));
      t.expect(small.length === 0, 'touch targets under 40 px: ' + JSON.stringify(small));
      await t.checkLayout({ allowScrollY: true });
      fs.mkdirSync(SHOTS, { recursive: true });
      await t.page.screenshot({ path: `${SHOTS}/S5-04-settings-${t.viewport}.png` });
    },
  },
];
