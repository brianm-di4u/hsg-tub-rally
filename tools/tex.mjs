#!/usr/bin/env node
// Codex paintings → N64-sized textures, packed as base64 data URIs in classic-script packs (WebGL refuses
// file:// image files, so everything uploaded to the GPU travels as a data URI; see shared/LESSONS.md).
//
//   node tools/tex.mjs [--only a,b]
//
// Reads art-src/tex/tex.json items {name, src, w, h, fit: cover|contain, keyWhite, trim, rgb555, pack}.
// Writes assets/pack-<pack>.js  →  (window.TR_PACKS ||= {})[pack] = { tex: { name: {w, h, uri} } }
// and a review contact sheet art-src/tex/sheet.png (nearest-neighbour). Uses the harness's Chromium.
// Image steps (key, trim, halving resample) adapted from shared/test-harness/art-pack.mjs (Hot Springs Games, MIT).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(ROOT, 'shared', 'test-harness', 'run.mjs'));
const { chromium } = require('playwright');
const args = process.argv.slice(2);
const only = (() => { const i = args.indexOf('--only'); return i >= 0 ? args[i + 1].split(',') : null; })();
const srcDir = path.join(ROOT, 'art-src', 'tex');
const spec = JSON.parse(fs.readFileSync(path.join(srcDir, 'tex.json'), 'utf8'));
// packed.json is tracked so a partial run (--only) keeps every other texture without its source PNG
const cacheFile = path.join(srcDir, 'packed.json');
const cache = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, 'utf8')) : {};

function processInPage({ url, it }) {
  return (async () => {
    const img = new Image(); img.src = url; await img.decode();
    let src = document.createElement('canvas'); src.width = img.naturalWidth; src.height = img.naturalHeight;
    src.getContext('2d').drawImage(img, 0, 0);
    if (it.keyWhite) {
      const g = src.getContext('2d'), W = src.width, H = src.height, d = g.getImageData(0, 0, W, H), p = d.data;
      const lim = 255 - it.keyWhite, seen = new Uint8Array(W * H), stack = [];
      const white = (i) => p[i * 4] >= lim && p[i * 4 + 1] >= lim && p[i * 4 + 2] >= lim;
      for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
      for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
      while (stack.length) {
        const i = stack.pop(); if (seen[i] || !white(i)) continue; seen[i] = 1;
        const x = i % W, y = (i / W) | 0;
        if (x > 0) stack.push(i - 1); if (x < W - 1) stack.push(i + 1);
        if (y > 0) stack.push(i - W); if (y < H - 1) stack.push(i + W);
      }
      for (let i = 0; i < W * H; i++) if (seen[i]) p[i * 4 + 3] = 0;
      g.putImageData(d, 0, 0);
    }
    if (it.trim) {
      const g = src.getContext('2d'), W = src.width, H = src.height, p = g.getImageData(0, 0, W, H).data;
      let x0 = W, y0 = H, x1 = -1, y1 = -1;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (p[(y * W + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      if (x1 > x0 && y1 > y0) { const c = document.createElement('canvas'); c.width = x1 - x0 + 1; c.height = y1 - y0 + 1; c.getContext('2d').drawImage(src, -x0, -y0); src = c; }
    }
    const W = it.w, H = it.h, fit = it.fit || 'cover';
    const scale = () => (fit === 'cover' ? Math.max(W / src.width, H / src.height) : Math.min(W / src.width, H / src.height));
    while (scale() <= 0.5) {
      const c = document.createElement('canvas'); c.width = Math.ceil(src.width / 2); c.height = Math.ceil(src.height / 2);
      const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(src, 0, 0, c.width, c.height); src = c;
    }
    const out = document.createElement('canvas'); out.width = W; out.height = H;
    const g = out.getContext('2d'); g.imageSmoothingQuality = 'high';
    const k = scale(), dw = src.width * k, dh = src.height * k;
    g.drawImage(src, (W - dw) / 2, fit === 'contain' ? H - dh : (H - dh) / 2, dw, dh);
    if (it.tileX) {
      // make the left and right edges meet: average the edge columns, feather two more on each side
      const d = g.getImageData(0, 0, W, H), p = d.data;
      for (let y = 0; y < H; y++) for (const [a, b, wgt] of [[0, W - 1, 0.5], [1, W - 2, 0.3], [2, W - 3, 0.15]]) {
        for (let c = 0; c < 4; c++) {
          const ia = (y * W + a) * 4 + c, ib = (y * W + b) * 4 + c, m = (p[ia] + p[ib]) / 2;
          p[ia] = p[ia] + (m - p[ia]) * wgt * 2; p[ib] = p[ib] + (m - p[ib]) * wgt * 2;
        }
      }
      g.putImageData(d, 0, 0);
    }
    if (it.rgb555) {
      // 5 bits per channel with a 4x4 ordered dither; alpha becomes 1 bit (RGBA5551)
      const B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
      const d = g.getImageData(0, 0, W, H), p = d.data;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4, t = (B[(y & 3) * 4 + (x & 3)] / 16 - 0.5) * 8;
        for (let c = 0; c < 3; c++) p[i + c] = Math.max(0, Math.min(255, Math.round(Math.round((p[i + c] + t) / 8.2258) * 8.2258)));
        p[i + 3] = p[i + 3] >= 128 ? 255 : 0;
      }
      g.putImageData(d, 0, 0);
    }
    return out.toDataURL('image/png');
  })();
}

function sheetInPage(cells) {
  return (async () => {
    const pad = 10, cols = 4, cw = 280, ch = 300;
    const imgs = await Promise.all(cells.map(async (c) => { const i = new Image(); i.src = c.uri; await i.decode(); return i; }));
    const c = document.createElement('canvas'); c.width = cols * cw; c.height = Math.ceil(cells.length / cols) * ch;
    const g = c.getContext('2d'); g.fillStyle = '#7d8a99'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
    imgs.forEach((im, i) => {
      const x = (i % cols) * cw + pad, y = Math.floor(i / cols) * ch + pad;
      const k = Math.floor(Math.min((cw - pad * 2) / im.width, (ch - 40) / im.height));
      g.drawImage(im, x, y, im.width * k, im.height * k);
      g.fillStyle = '#fff'; g.font = '13px system-ui'; g.fillText(cells[i].n + ' ' + im.width + 'x' + im.height, x, y + ch - 24);
    });
    return c.toDataURL('image/png').split(',')[1];
  })();
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<!doctype html><body></body>');
let failed = 0;
for (const it of spec.items) {
  if (only && !only.includes(it.name)) continue;
  const file = path.join(srcDir, it.src);
  if (!fs.existsSync(file)) { console.log('  missing', it.name, it.src); failed++; continue; }
  const url = 'data:image/png;base64,' + fs.readFileSync(file).toString('base64');
  const uri = await page.evaluate(processInPage, { url, it });
  cache[it.name] = { pack: it.pack || 'core', w: it.w, h: it.h, uri };
  console.log('  packed', it.name.padEnd(16), `${it.w}x${it.h}`, (uri.length / 1024).toFixed(1), 'KB b64');
}
for (const k of Object.keys(cache)) if (!spec.items.some((i) => i.name === k)) delete cache[k];
fs.writeFileSync(cacheFile, JSON.stringify(cache));
const packs = {};
for (const [name, t] of Object.entries(cache)) (packs[t.pack] ||= {})[name] = { w: t.w, h: t.h, uri: t.uri };
fs.mkdirSync(path.join(ROOT, 'assets'), { recursive: true });
for (const [pack, tex] of Object.entries(packs)) {
  const out = path.join(ROOT, 'assets', `pack-${pack}.js`);
  fs.writeFileSync(out, `/* Spa City Tub Rally texture pack "${pack}" (generated by tools/tex.mjs from Codex paintings made for this game; MIT). */\n(window.TR_PACKS=window.TR_PACKS||{})[${JSON.stringify(pack)}]=Object.assign((window.TR_PACKS||{})[${JSON.stringify(pack)}]||{},{tex:${JSON.stringify(tex)}});\n`);
  console.log(' ', path.relative(ROOT, out), (fs.statSync(out).size / 1024).toFixed(1), 'KB');
}
const cells = Object.entries(cache).map(([n, t]) => ({ n, uri: t.uri }));
fs.writeFileSync(path.join(srcDir, 'sheet.png'), Buffer.from(await page.evaluate(sheetInPage, cells), 'base64'));
await browser.close();
process.exit(failed ? 1 : 0);
