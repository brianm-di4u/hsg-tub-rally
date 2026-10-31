#!/usr/bin/env node
// Review captures on the real GPU (adapted from games/football/tools/shots-gpu.mjs, Hot Springs Games, MIT): the
// canonical frames in tools/review-shots.json, rendered by the installed Chrome (headless, ANGLE/D3D11) over http
// like the harness. The harness's bundled Chromium only has software GL, so its screenshots can't judge lighting or
// materials; these can. Also writes close-ups (desktop, native resolution at 2x pixels), 8-frame motion strips and
// an index (shots.json) for the review brief.
//
//   node tools/shots-gpu.mjs <out=review-loop-0> [--tiers=low,medium,high] [--only=R03,R04]
//        [--viewports=desktop,mobile,landscape] [--res=authentic|crisp|native] [--no-crops] [--no-strips] [--verify] [--file-url]
//
// Output: screenshots/<out>/<tier>/<viewport>/<id>.png, crops/<tier>/<id>-<target>.png, strips/<tier>/<id>.png,
// shots.json. --verify captures R03, R04 and R15 twice and fails if they differ by more than 0.5/255 on average.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(GAME, 'shared', 'test-harness', 'package.json'));
const { chromium } = require('playwright');
const args = process.argv.slice(2);
const opt = (k, d) => { const a = args.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const out = args.find((a) => !a.startsWith('--')) || 'review-loop-0';
const TIERS = opt('tiers', 'low,medium,high').split(',');
const ONLY = opt('only', '') ? opt('only', '').split(',') : null;
const VPS = opt('viewports', 'desktop,mobile,landscape').split(',');
const RES = opt('res', '');
const CROPS = !args.includes('--no-crops'), STRIPS = !args.includes('--no-strips'), VERIFY = args.includes('--verify'), FILEURL = args.includes('--file-url');
const SPEC = JSON.parse(fs.readFileSync(path.join(GAME, 'tools', 'review-shots.json'), 'utf8'));
const VERIFY_IDS = ['R03', 'R04', 'R15'];
const SAVE_KEY = 'hsg-tub-rally-v1';
// landscape: a phone turned sideways (the shots marked mobile)
const VIEW = { desktop: [{ width: 1280, height: 800 }, 1], mobile: [{ width: 390, height: 844 }, 2], landscape: [{ width: 844, height: 390 }, 2] };
const dirOut = path.join(GAME, 'screenshots', out);

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const f = path.join(GAME, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(GAME) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
}).listen(0);
const base = FILEURL ? pathToFileURL(path.join(GAME, 'index.html')).href : `http://127.0.0.1:${server.address().port}/index.html`;
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-gpu', '--use-angle=d3d11', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader=false'] });

const problems = [];
const index = { out, made: new Date().toISOString(), tiers: TIERS, res: RES || 'default', gpu: null, shots: [] };
const save = (file, buf) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, buf); return path.relative(dirOut, file).split(path.sep).join('/'); };

async function idle(page, ms = 30000) {
  await page.waitForFunction(() => window.__game && window.__game.isIdle(), null, { timeout: ms }).catch(() => problems.push(`idle timeout ${page.url()}`));
}
const frames = (page, n = 3) => page.evaluate((n) => new Promise((r) => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);

// Runs one setup step inside the page.
async function op(page, step) {
  const [name, ...a] = step;
  if (name === 'idle') return idle(page);
  if (name === 'wait') return page.waitForTimeout(a[0]);
  if (name === 'race') {
    await page.evaluate(async (o) => { const g = window.__game; g.seed(o.seed ?? 7); await g.newGame({ autoplay: true, ...o, paused: true }); }, a[0] || {});
    return idle(page);
  }
  const ok = await page.evaluate(async ({ name, a }) => {
    const g = window.__game;
    const pl = (s) => s.race && s.race.karts[Math.max(0, s.race.player)];
    const PRED = { judge: (s) => pl(s) && pl(s).state === 'judge', circle: (s) => pl(s) && pl(s).state === 'circle', done: (s) => s.race && s.race.phase === 'done', race: (s) => s.race && s.race.phase === 'race' };
    switch (name) {
      case 'title': await g.scene('title'); return true;
      case 'menu': g.act('menu', a[0], a[1]); return true;
      case 'step': g.step(a[0]); return true;
      case 'skip': g.act('skipCountdown'); return true;
      case 'input': g.act('input', a[0]); return true;
      case 'act': g.act(...a); return true;
      case 'look': return g.act('camLook', a[0], a[1], a[2], a[3]);
      case 'until': { const p = PRED[a[0]], max = a[1] || 3600; for (let i = 0; i < max; i += 10) if (p(g.step(10))) return true; return false; }
      default: throw new Error(`unknown op ${name}`);
    }
  }, { name, a });
  if (ok === false) problems.push(`op ${name} ${JSON.stringify(a)} did not reach its target`);
}

async function settle(page, wait) {
  await page.evaluate((c) => { window.__game.act('clock', c); window.__game.act('camSnap'); }, SPEC.clock);
  if (wait === 'idle') await idle(page);
  await frames(page, 4);
}

async function tile(page, pngs, cols) {
  return page.evaluate(async ({ urls, cols }) => {
    const ims = await Promise.all(urls.map((u) => { const i = new Image(); i.src = u; return i.decode().then(() => i); }));
    const w = 480, h = Math.round(w * ims[0].height / ims[0].width), rows = Math.ceil(ims.length / cols);
    const c = document.createElement('canvas'); c.width = cols * w + (cols - 1) * 4; c.height = rows * h + (rows - 1) * 4;
    const x = c.getContext('2d'); x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height);
    ims.forEach((im, i) => { const cx = (i % cols) * (w + 4), cy = Math.floor(i / cols) * (h + 4); x.drawImage(im, cx, cy, w, h);
      x.font = '700 18px sans-serif'; x.fillStyle = '#ffd21f'; x.fillText(`${i + 1}`, cx + 8, cy + 22); });
    return c.toDataURL('image/png');
  }, { urls: pngs.map((b) => `data:image/png;base64,${b.toString('base64')}`), cols });
}

async function diff(page, a, b) {
  return page.evaluate(async ([a, b]) => {
    const load = (u) => { const i = new Image(); i.src = u; return i.decode().then(() => i); };
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    const px = (im) => { const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0); return x.getImageData(0, 0, im.width, im.height).data; };
    const da = px(ia), db = px(ib); let s = 0;
    for (let i = 0; i < da.length; i += 4) s += Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]);
    return s / (da.length / 4 * 3);
  }, [`data:image/png;base64,${a.toString('base64')}`, `data:image/png;base64,${b.toString('base64')}`]);
}

const shots = SPEC.shots.filter((s) => !ONLY || ONLY.includes(s.id));
for (const tier of TIERS) {
  for (const vp of VPS) {
    const [viewport, scale] = VIEW[vp];
    const phone = vp !== 'desktop';
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: scale, hasTouch: phone, isMobile: phone });
    // the tier (and resolution mode) are read at boot, so they go into the save before the page loads
    await ctx.addInitScript(({ key, settings }) => {
      window.__TEST__ = true;
      try { localStorage.setItem(key, JSON.stringify({ v: 1, settings })); } catch (e) { /* storage blocked */ }
    }, { key: SAVE_KEY, settings: { quality: tier, sound: false, music: false, ...(RES ? { res: RES } : {}) } });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) problems.push(`[${tier}/${vp}] console: ${m.text()}`); });
    page.on('response', (r) => { if (r.status() >= 400 && !/favicon/.test(r.url())) problems.push(`[${tier}/${vp}] ${r.status()} ${r.url()}`); });
    page.on('pageerror', (e) => problems.push(`[${tier}/${vp}] pageerror: ${e.message}`));
    page.on('request', (r) => { const u = r.url(); if (!u.startsWith('http://127.0.0.1') && !u.startsWith('data:') && !u.startsWith('blob:') && !u.startsWith('file:')) problems.push(`external request ${u}`); });
    for (const s of shots) {
      if (phone && !s.mobile) continue;
      const run = async () => {
        await page.goto(base);
        await page.waitForFunction(() => window.__game && window.__game.isIdle(), null, { timeout: 30000 });
        // freeze the clock before the setup too, so effects started during it repeat exactly
        await page.evaluate((c) => window.__game.act('clock', c), SPEC.clock);
        for (const st of s.setup) await op(page, st);
        await settle(page, s.wait);
        return page.screenshot();
      };
      const t0 = Date.now();
      const png = await run();
      const rec = { id: s.id, title: s.title, cats: s.cats, tier, viewport: vp, file: save(path.join(dirOut, tier, vp, `${s.id}.png`), png), crops: [], strip: null };
      if (!index.gpu) index.gpu = await page.evaluate(() => window.__game.act('gfx'));
      rec.gfx = await page.evaluate(() => { const x = window.__game.act('gfx'); return { calls: x.calls, tris: x.tris, cpuMs: x.cpuMs, tier: x.tier, mode: x.mode, w: x.w, h: x.h }; });
      if (VERIFY && VERIFY_IDS.includes(s.id)) {
        const again = await run();
        const d = await diff(page, png, again);
        rec.verifyDiff = Math.round(d * 1000) / 1000;
        if (d > 0.5) { problems.push(`[${tier}/${vp}] ${s.id} not deterministic: mean diff ${d.toFixed(3)}/255`); save(path.join(dirOut, tier, vp, `${s.id}.again.png`), again); }
      }
      // close-ups: the same frozen frame through a close camera on the target, native resolution at 2x pixels
      if (CROPS && vp === 'desktop' && s.crops) {
        const mode0 = await page.evaluate(() => window.__game.getState().render.mode);
        await cdp.send('Emulation.setDeviceMetricsOverride', { width: viewport.width, height: viewport.height, deviceScaleFactor: 2, mobile: false });
        await page.evaluate(() => { window.__game.setState({ res: 'native' }); window.__game.act('hud', false); });
        for (const c of s.crops) {
          const ok = await page.evaluate(([t, w, p, y]) => window.__game.act('camLook', t, w, p, y), [c.target, c.width || 4, c.pitch ?? 0.16, c.yaw ?? 0.6]);
          if (!ok) { problems.push(`[${tier}] ${s.id} close-up ${c.target}: target not found`); continue; }
          await frames(page, 4);
          const buf = await page.screenshot({ scale: 'device' });
          rec.crops.push({ target: c.target, width: c.width || 4, file: save(path.join(dirOut, 'crops', tier, `${s.id}-${c.target.replace(/[:,.]/g, '_')}${c.tag ? `-${c.tag}` : ''}.png`), buf) });
        }
        await page.evaluate((m) => { window.__game.act('camLook', null); window.__game.act('hud', true); window.__game.setState({ res: m }); }, mode0);
        await cdp.send('Emulation.clearDeviceMetricsOverride');
        await page.evaluate(() => window.dispatchEvent(new Event('resize')));
      }
      // motion strip: 8 frames, stepping the sim between them (the render clock follows the sim so animation advances)
      if (STRIPS && vp === 'desktop' && s.strip) {
        const bufs = [];
        for (let k = 0; k < (s.strip.frames || 8); k++) {
          if (k) await page.evaluate(([n, c]) => { const g = window.__game; g.step(n); g.act('clock', c); }, [s.strip.every, SPEC.clock + k * s.strip.every * (1000 / 60)]);
          await frames(page, 3);
          bufs.push(await page.screenshot());
        }
        const url = await tile(page, bufs, 4);
        rec.strip = save(path.join(dirOut, 'strips', tier, `${s.id}.png`), Buffer.from(url.split(',')[1], 'base64'));
      }
      index.shots.push(rec);
      console.log(`${tier}/${vp} ${s.id} ${((Date.now() - t0) / 1000).toFixed(1)} s · ${rec.gfx.calls} calls · ${(rec.gfx.tris / 1000).toFixed(1)}k tris${rec.verifyDiff !== undefined ? ` · verify ${rec.verifyDiff}` : ''}${rec.crops.length ? ` · ${rec.crops.length} crops` : ''}${rec.strip ? ' · strip' : ''}`);
    }
    await ctx.close();
  }
}
// a partial run (--only, fewer tiers or viewports) merges into the existing index
let prevIdx = null;
try { prevIdx = JSON.parse(fs.readFileSync(path.join(dirOut, 'shots.json'), 'utf8')); } catch { /* first run */ }
if (prevIdx) {
  const key = (s) => `${s.id}|${s.tier}|${s.viewport}`, fresh = new Set(index.shots.map(key));
  for (const s of index.shots) { const o = prevIdx.shots.find((p) => key(p) === key(s)); if (o && !s.strip && o.strip && !STRIPS) s.strip = o.strip; }
  index.shots = [...prevIdx.shots.filter((p) => !fresh.has(key(p))), ...index.shots].sort((a, b) => key(a).localeCompare(key(b)));
  index.tiers = [...new Set([...prevIdx.tiers, ...index.tiers])];
}
fs.writeFileSync(path.join(dirOut, 'shots.json'), JSON.stringify({ ...index, problems }, null, 2));
await browser.close(); server.close();
console.log(`GPU: ${index.gpu ? index.gpu.renderer : '?'} (software: ${index.gpu ? index.gpu.software : '?'})`);
if (problems.length) { console.error(`${problems.length} problem(s):\n  ${problems.slice(0, 20).join('\n  ')}`); process.exitCode = 1; }
else console.log(`✓ ${index.shots.length} captures → screenshots/${out}/`);
