#!/usr/bin/env node
// Every fact shown to players must carry a source key listed in research/town-content.md §9.
// Exits 1 on any fact without a known key. Pattern after games/basketball/tools/check-facts.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FACTS } from '../src/js/data/facts.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tc = fs.readFileSync(path.join(ROOT, 'research', 'town-content.md'), 'utf8');
const sec = tc.slice(tc.indexOf('## 9. Source keys'));
const keys = new Set([...sec.matchAll(/^\| `([a-z0-9-]+)` \|/gm)].map((m) => m[1]));
let bad = 0, n = 0;
for (const [group, list] of Object.entries(FACTS)) for (const f of list) {
  n++;
  if (!f.src || !keys.has(f.src)) { console.log(`✗ [${group}] "${f.t.slice(0, 60)}…" unknown source key: ${f.src}`); bad++; }
}
console.log(`${n - bad}/${n} facts carry a source key from research/town-content.md §9 (${keys.size} keys)`);
process.exit(bad ? 1 : 0);
