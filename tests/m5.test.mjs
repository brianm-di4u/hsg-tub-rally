// M5: size budgets, frame cost on the GPU and at 4× CPU throttle (phone proxy), the offline path for every mode.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const kb = (f) => fs.statSync(path.join(ROOT, f)).size / 1024;

export const tests = [
  {
    name: 'm5 size budgets',
    node: true,
    async run(t) {
      const idx = kb('index.html'), vendor = kb('vendor/three-r186.min.js');
      t.expect(idx <= 700, `index.html ${idx.toFixed(0)} KB ≤ 700`);
      t.expect(vendor <= 600, `three.js ${vendor.toFixed(0)} KB ≤ 600`);
      let total = idx + vendor;
      for (const f of fs.readdirSync(path.join(ROOT, 'assets'))) {
        const s = kb('assets/' + f); total += s;
        if (f.startsWith('track-')) t.expect(s <= 350, `${f} ${s.toFixed(0)} KB ≤ 350`);
        if (f.startsWith('pack-') || f.startsWith('models-')) t.expect(s <= 400, `${f} ${s.toFixed(0)} KB ≤ 400`);
      }
      t.expect(total <= 5 * 1024, `whole game ${(total / 1024).toFixed(2)} MB ≤ 5`);
      const first = idx + vendor + ['pack-core.js', 'tracks.js', 'track-bathhouse-row.js', 'pack-row.js', 'pack-mtn.js', 'models-row.js', 'models-downtown.js'].reduce((s, f) => s + kb('assets/' + f), 0);
      t.expect(first <= 2048, `first race download ${(first / 1024).toFixed(2)} MB ≤ 2`);
      t.log(`index ${idx.toFixed(0)} KB, vendor ${vendor.toFixed(0)} KB, total ${(total / 1024).toFixed(2)} MB, first race ${(first / 1024).toFixed(2)} MB`);
    },
  },
  {
    name: 'm5 frame cost racing',
    async run(t) {
      await t.waitIdle(8000);
      await t.game('newGame', { track: 'bathhouse-row', seed: 3, autoplay: true });
      await t.page.waitForTimeout(5000); // into the race, real time
      const fc = await t.frameCost(2500);
      t.log('frameCost', JSON.stringify(fc), 'gpu', t.gpu);
      t.expect(fc.taskMs < 6, `frame task time ${fc.taskMs.toFixed(2)} ms < 6`);
      await t.cpuThrottle(4);
      const fc4 = await t.frameCost(2500);
      await t.cpuThrottle(1);
      t.log('frameCost @4x CPU', JSON.stringify(fc4));
      t.expect(fc4.taskMs < 16, `phone proxy (4× CPU) task time ${fc4.taskMs.toFixed(2)} ms < 16`);
      const s = await t.state();
      t.log('render', JSON.stringify(s.render));
      t.expect(s.render.draws <= (t.viewport === 'mobile' ? 100 : 120), `draw calls ${s.render.draws}`);
    },
  },
  {
    name: 'm5 offline modes',
    fileUrl: true,
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      for (const opts of [{ mode: 'gp', track: 'hs-mountain' }, { mode: 'timetrial', track: 'park-avenue', count: 1 }, { mode: 'battle', track: 'hill-wheatley' }, { mode: 'row', track: 'bathhouse-row', heatTeams: ['engine-six', 'lather-linen'], team: 'engine-six', label: 'Semifinal' }]) {
        await t.game('newGame', { ...opts, paused: true, seed: 4 });
        await t.game('step', 240);
        const s = await t.state();
        t.equal(s.race.phase, 'race', `${opts.mode} on ${opts.track} runs from file://`);
      }
      await t.waitFrames(3);
      await t.shot('m5-fileurl-row');
    },
  },
];
