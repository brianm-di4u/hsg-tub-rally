#!/usr/bin/env node
// Contact sheets for a shots-gpu capture set (adapted from games/football/tools/review-sheets.mjs, Hot Springs
// Games, MIT): labelled grids of frames (6 per sheet, 8 for phones) and close-ups. With --ab=<older set> it also
// writes the blind A/B pairs for the critics: every frame and close-up of this set beside the same capture from the
// older set, the new build on one side for the whole loop (a seeded coin flip). The side is recorded only in
// reviews/loop-N/ab-key.json, which no critic may open.
//
//   node tools/review-sheets.mjs review-loop-2 [--ab=review-loop-1 --loop=2] [--tier=high]
import { createRequire } from 'node:module';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(GAME, 'shared', 'test-harness', 'package.json'));
const { chromium } = require('playwright');
const args = process.argv.slice(2);
const opt = (k, d) => { const a = args.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const set = args.find((a) => !a.startsWith('--'));
const dir = path.join(GAME, 'screenshots', set);
const idx = JSON.parse(fs.readFileSync(path.join(dir, 'shots.json'), 'utf8'));
const abSet = opt('ab', ''), loop = opt('loop', ''), tierOnly = opt('tier', '');
const outDir = path.join(dir, 'sheets');
fs.mkdirSync(outDir, { recursive: true });
const url = (f) => `data:image/png;base64,${fs.readFileSync(f).toString('base64')}`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<!doctype html><body></body>');
async function sheet(items, cols, cellW, file) {
  const data = await page.evaluate(async ({ items, cols, cellW }) => {
    const ims = await Promise.all(items.map((it) => { const i = new Image(); i.src = it.url; return i.decode().then(() => i); }));
    const cellH = Math.round(cellW * Math.max(...ims.map((i) => i.height / i.width))) + 26;
    const rows = Math.ceil(ims.length / cols);
    const c = document.createElement('canvas'); c.width = cols * cellW + (cols + 1) * 6; c.height = rows * cellH + (rows + 1) * 6;
    const x = c.getContext('2d'); x.fillStyle = '#101218'; x.fillRect(0, 0, c.width, c.height);
    ims.forEach((im, k) => {
      const cx = 6 + (k % cols) * (cellW + 6), cy = 6 + Math.floor(k / cols) * (cellH + 6), h = Math.round(cellW * im.height / im.width);
      x.drawImage(im, cx, cy + 24, cellW, h);
      x.fillStyle = '#ffd21f'; x.font = '700 15px sans-serif'; x.fillText(items[k].label, cx + 2, cy + 17);
    });
    return c.toDataURL('image/png');
  }, { items, cols, cellW });
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.from(data.split(',')[1], 'base64'));
  return path.relative(dir, file).split(path.sep).join('/');
}
const made = [];
const groups = {};
for (const s of idx.shots) if (!tierOnly || s.tier === tierOnly) (groups[`${s.tier}-${s.viewport}`] = groups[`${s.tier}-${s.viewport}`] || []).push(s);
for (const [g, shots] of Object.entries(groups)) {
  const mob = !g.endsWith('desktop'), per = mob ? 8 : 6, cols = mob ? 4 : 3;
  for (let i = 0; i < shots.length; i += per) made.push(await sheet(shots.slice(i, i + per).map((s) => ({ url: url(path.join(dir, s.file)), label: `${s.id} ${s.title}` })), cols, mob ? 300 : 620, path.join(outDir, `${g}-${String(i / per + 1).padStart(2, '0')}.png`)));
  const crops = shots.flatMap((s) => s.crops.map((c) => ({ url: url(path.join(dir, c.file)), label: `${s.id} close-up ${path.basename(c.file, '.png').slice(4)}` })));
  for (let i = 0; i < crops.length; i += 6) made.push(await sheet(crops.slice(i, i + 6), 3, 620, path.join(outDir, `${g}-closeups-${String(i / 6 + 1).padStart(2, '0')}.png`)));
}

// blind A/B pairs: one image per capture, A on the left, B on the right
if (abSet) {
  if (!loop) throw new Error('--ab needs --loop=N (the key goes to reviews/loop-N/ab-key.json)');
  const old = JSON.parse(fs.readFileSync(path.join(GAME, 'screenshots', abSet, 'shots.json'), 'utf8'));
  const newIsA = crypto.createHash('sha256').update(`tub-rally-ab-${loop}-${set}`).digest()[0] % 2 === 0;
  const pairs = [];
  for (const s of idx.shots) {
    if (tierOnly && s.tier !== tierOnly) continue;
    const o = old.shots.find((x) => x.id === s.id && x.viewport === s.viewport && x.tier === s.tier) || old.shots.find((x) => x.id === s.id && x.viewport === s.viewport);
    if (!o) continue;
    const both = [[path.join(GAME, 'screenshots', abSet, o.file), path.join(dir, s.file), `${s.tier}-${s.viewport}-${s.id}`]];
    for (const c of s.crops) { const oc = o.crops.find((x) => path.basename(x.file) === path.basename(c.file)); if (oc) both.push([path.join(GAME, 'screenshots', abSet, oc.file), path.join(dir, c.file), `crop-${path.basename(c.file, '.png')}`]); }
    if (s.strip && o.strip) both.push([path.join(GAME, 'screenshots', abSet, o.strip), path.join(dir, s.strip), `strip-${s.id}`]);
    for (const [fo, fn, name] of both) {
      const [a, b] = newIsA ? [fn, fo] : [fo, fn];
      pairs.push(await sheet([{ url: url(a), label: 'A' }, { url: url(b), label: 'B' }], 2, name.startsWith('strip') ? 960 : 640, path.join(dir, 'ab', `${name}.png`)));
    }
  }
  const keyDir = path.join(GAME, 'reviews', `loop-${loop}`);
  fs.mkdirSync(keyDir, { recursive: true });
  fs.writeFileSync(path.join(keyDir, 'ab-key.json'), JSON.stringify({ loop: +loop, set, against: abSet, newSide: newIsA ? 'A' : 'B', pairs: pairs.length }, null, 2) + '\n');
  made.push(...pairs);
  console.log(`${pairs.length} A/B pairs → screenshots/${set}/ab/ (key in reviews/loop-${loop}/ab-key.json)`);
}
await browser.close();
console.log(`${made.length} sheets → screenshots/${set}/`);
