#!/usr/bin/env node
// Frame rate and frame cost per quality tier and viewport (adapted from games/football/tools/perf-gpu.mjs, Hot
// Springs Games, MIT). Races run in real time with the AI driving every tub, vsync off so headroom shows.
// Device proxies (reviews/PERF.md):
//   default         installed Chrome on the real GPU (ANGLE/D3D11)
//   --throttle=N    CDP CPU throttling (4 ~ a mid-range phone's CPU)
//   --swiftshader   bundled Chromium with software GL: a pessimistic floor for a weak phone GPU
//   --scenes=lab    the perf lab sweep (act('perfLab', ...)) instead of the course scenes
//
//   node tools/perf-gpu.mjs [--tiers=low,medium,high] [--viewports=desktop,mobile] [--throttle=4] [--swiftshader]
//        [--res=native] [--scenes=row,mountain,dusk,battle] [--secs=2.5] [--out=reviews/loop-0/perf.json] [--label=x]
import { createRequire } from 'node:module';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(GAME, 'shared', 'test-harness', 'package.json'));
const { chromium } = require('playwright');
const args = process.argv.slice(2);
const opt = (k, d) => { const a = args.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const TIERS = opt('tiers', 'low,medium,high').split(','), VPS = opt('viewports', 'desktop,mobile').split(',');
const THROTTLE = +opt('throttle', '1'), OUT = opt('out', ''), RES = opt('res', ''), SECS = +opt('secs', '5');
const SWIFT = args.includes('--swiftshader'), LABEL = opt('label', SWIFT ? 'swiftshader' : 'gpu');
const SAVE_KEY = 'hsg-tub-rally-v1';
const VIEW = { desktop: [{ width: 1280, height: 800 }, 1], mobile: [{ width: 390, height: 844 }, 2], landscape: [{ width: 844, height: 390 }, 2] };

// each scene starts a real-time race (AI on every tub) and returns once it's rolling
const SCENES = {
  row: { track: 'bathhouse-row', team: 'engine-six', seed: 3 },
  mountain: { track: 'hs-mountain', team: 'trail-shredders', seed: 3 },
  dusk: { track: 'park-avenue', team: 'velvet-mob', seed: 3 },
  battle: { track: 'hill-wheatley', team: 'gator-gang', seed: 4, mode: 'battle' },
};
const LAB = JSON.parse(opt('lab', 'null') || 'null');
const sceneNames = opt('scenes', 'row,mountain,dusk,battle').split(',');

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.webp': 'image/webp', '.json': 'application/json', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const f = path.join(GAME, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(GAME) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
}).listen(0);
const base = `http://127.0.0.1:${server.address().port}/index.html`;
const browser = SWIFT
  ? await chromium.launch({ headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-vsync', '--disable-frame-rate-limit'] })
  : await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-gpu', '--use-angle=d3d11', '--ignore-gpu-blocklist', '--disable-gpu-vsync', '--disable-frame-rate-limit'] });

async function measure(page, cdp) {
  await cdp.send('Performance.enable', { timeDomain: 'threadTicks' }).catch(() => cdp.send('Performance.enable'));
  const get = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
  const a = await get();
  const r = await page.evaluate((ms) => new Promise((res) => {
    const d = []; let last = performance.now(); const t0 = last;
    const f = (now) => { d.push(now - last); last = now; if (now - t0 < ms) requestAnimationFrame(f); else {
      d.sort((x, y) => x - y); const q = (p) => d[Math.min(d.length - 1, Math.floor(d.length * p))];
      res({ frames: d.length, fps: d.length / ((now - t0) / 1000), p50: q(0.5), p95: q(0.95), p99: q(0.99) }); } };
    requestAnimationFrame(f);
  }), SECS * 1000);
  const b = await get();
  await cdp.send('Performance.disable').catch(() => {});
  return { ...r, taskMs: ((b.TaskDuration || 0) - (a.TaskDuration || 0)) * 1000 / Math.max(1, r.frames) };
}

const rows = [];
for (const tier of TIERS) for (const vp of VPS) {
  const [viewport, scale] = VIEW[vp];
  const phone = vp !== 'desktop';
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: scale, hasTouch: phone, isMobile: phone });
  await ctx.addInitScript(({ key, settings }) => {
    window.__TEST__ = true;
    try { localStorage.setItem(key, JSON.stringify({ v: 1, settings })); } catch (e) { /* storage blocked */ }
  }, { key: SAVE_KEY, settings: { quality: tier, sound: false, music: false, ...(RES ? { res: RES } : {}) } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  const t0 = Date.now();
  await page.goto(base);
  await page.waitForFunction(() => window.__game && window.__game.isIdle(), null, { timeout: 60000 });
  const loadMs = Date.now() - t0;
  const cdp = await ctx.newCDPSession(page);
  if (THROTTLE > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: THROTTLE });
  const list = sceneNames[0] === 'lab' ? (LAB || [{}]).map((l, i) => [`lab${i}`, { lab: l }]) : sceneNames.map((n) => [n, SCENES[n]]);
  for (const [name, sc] of list) {
    if (sc.lab) await page.evaluate(async (l) => { await window.__game.act('perfLab', l); }, sc.lab);
    else await page.evaluate(async (o) => { const g = window.__game; g.seed(o.seed); await g.newGame({ autoplay: true, ...o }); }, sc);
    await page.waitForFunction(() => window.__game.isIdle(), null, { timeout: 60000 });
    await page.waitForTimeout(4500); // countdown, shader compiles, the pack spreading out
    const r = await measure(page, cdp);
    const gfx = await page.evaluate(() => window.__game.act('gfx'));
    const heap = await page.evaluate(() => (performance.memory ? performance.memory.usedJSHeapSize / 1048576 : 0));
    const row = { label: LABEL, tier, viewport: vp, scene: name, lab: sc.lab || null, throttle: THROTTLE, res: gfx.mode, w: gfx.w, h: gfx.h,
      fps: +r.fps.toFixed(1), p50: +r.p50.toFixed(2), p95: +r.p95.toFixed(2), p99: +r.p99.toFixed(2), taskMs: +r.taskMs.toFixed(2), cpuMs: gfx.cpuMs,
      calls: gfx.calls, tris: gfx.tris, heapMB: +heap.toFixed(1), loadMs, tierNow: gfx.tier, renderer: gfx.renderer, software: gfx.software };
    rows.push(row);
    console.log(`${LABEL.padEnd(11)} ${tier.padEnd(6)} ${vp.padEnd(9)} ${name.padEnd(8)} ${String(row.fps).padStart(7)} fps  p95 ${String(row.p95).padStart(6)} ms  task ${String(row.taskMs).padStart(5)} ms  ${row.calls} calls  ${(row.tris / 1000).toFixed(1)}k tris  ${row.w}x${row.h}`);
  }
  if (errs.length) console.error(`  errors: ${errs.slice(0, 3).join(' | ')}`);
  await ctx.close();
}
await browser.close(); server.close();
if (OUT) {
  const f = path.resolve(GAME, OUT);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  let prev = []; try { prev = JSON.parse(fs.readFileSync(f, 'utf8')).rows || []; } catch { /* new file */ }
  const same = (p) => p.label === LABEL && p.throttle === THROTTLE && TIERS.includes(p.tier) && VPS.includes(p.viewport) && rows.some((r) => r.scene === p.scene);
  fs.writeFileSync(f, JSON.stringify({ made: new Date().toISOString(), rows: [...prev.filter((p) => !same(p)), ...rows] }, null, 2));
  console.log(`→ ${path.relative(process.cwd(), f)}`);
}
