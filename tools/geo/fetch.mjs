// Downloads the raw real-geography data for Tub Rally into art-src/geo/raw/ (git-ignored, refetchable).
//
//   node tools/geo/fetch.mjs                 fetch whatever is missing
//   node tools/geo/fetch.mjs --force         refetch everything (the copied trivia DEMs are re-copied)
//   node tools/geo/fetch.mjs --only=osm,dem  limit to some steps: osm, dem, copy, gnis
//
// Sources (see research/geo/SOURCES.md for licences, dates and gotchas):
//   OpenStreetMap via the Overpass API (ODbL 1.0, (c) OpenStreetMap contributors; attribution required)
//     https://overpass-api.de/api/interpreter, falling back to https://overpass.kumi.systems/api/interpreter
//   USGS 3D Elevation Program (3DEP) seamless DEM, ImageServer exportImage as uncompressed float32 TIFF (public domain)
//     https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer
//     (request pattern copied from repos/hsg-theme-park/tools/geo/fetch.mjs)
//   USGS GNIS (Geographic Names) landform and hydrographic points, carto.nationalmap.gov geonames MapServer (public domain)
//   Copies of games/trivia/art-src/geo/raw/dem-downtown.tif and dem-region.tif (same 3DEP service, fetched 2026-10-28)
//
// Be a good API citizen: one request at a time, a descriptive User-Agent, backoff on 429/504, then the mirror.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { RAW, ROOT, readTiff, M_PER_DEG_LAT, M_PER_DEG_LON } from './geo-lib.mjs';

const UA = 'HotSpringsGames-TubRally/0.1 (open-source game; contact via github.com/brianm-di4u)';
const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
const DEM_SERVICE = 'https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer/exportImage';
const GNIS_SERVICE = 'https://carto.nationalmap.gov/arcgis/rest/services/geonames/MapServer';
const TRIVIA_RAW = path.resolve(ROOT, '..', 'trivia', 'art-src', 'geo', 'raw');

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const ONLY = (args.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const want = (step) => !ONLY.length || ONLY.includes(step);
fs.mkdirSync(RAW, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const kb = (n) => (n / 1024).toFixed(0) + ' KB';
const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const MANIFEST = path.join(RAW, 'manifest.json');
const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};
function record(file, info) {
  const buf = fs.readFileSync(path.join(RAW, file));
  manifest[file] = { bytes: buf.length, sha256: sha256(buf), fetched: new Date().toISOString(), ...info };
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
}
function skip(file) {
  if (!FORCE && fs.existsSync(path.join(RAW, file))) { console.log('skip', file, '(exists; --force to refetch)'); return true; }
  return false;
}

// ------------------------------------------------------------------------------------------------- Overpass
const BBOX_ALL = '34.490,-93.135,34.550,-92.985'; // south,west,north,east
const BBOX_DOWNTOWN = '34.500,-93.065,34.525,-93.045';
const QUERIES = {
  'osm-roads.json': `[out:json][timeout:120][bbox:${BBOX_ALL}];
(
  way["highway"];
  way["waterway"];
  way["tunnel"="culvert"];
);
out geom;`,
  'osm-pois.json': `[out:json][timeout:120][bbox:${BBOX_ALL}];
(
  nwr["amenity"="fountain"];
  nwr["natural"="spring"];
  nwr["tourism"="viewpoint"];
  nwr["man_made"="tower"];
  nwr["historic"];
  nwr["tourism"="attraction"];
  nwr["leisure"="park"];
  nwr["natural"~"^(peak|rock|stone|cliff|saddle|ridge)$"];
  nwr["tourism"~"^(camp_site|picnic_site)$"];
  nwr["amenity"="shelter"];
  nwr["place"="square"];
  nwr["name"~"Pagoda|Balanced Rock|Music Mountain|Wheatley|Gulpha|Goat Rock|Overlook|Exchange Street",i];
);
out geom;`,
  'osm-buildings.json': `[out:json][timeout:120][bbox:${BBOX_DOWNTOWN}];
(
  nwr["building"];
  nwr["amenity"="parking"];
);
out geom;`,
};

async function overpass(query) {
  let lastErr;
  for (const [ei, endpoint] of OVERPASS.entries()) {
    const attempts = ei === 0 ? 4 : 3;
    for (let a = 0; a < attempts; a++) {
      const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), 200_000);
      try {
        const r = await fetch(endpoint, {
          method: 'POST', signal: ctl.signal,
          headers: { 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', Accept: 'application/json' },
          body: 'data=' + encodeURIComponent(query),
        });
        const text = await r.text();
        if (r.status === 429 || r.status === 504 || r.status >= 500) {
          const ra = +r.headers.get('retry-after') || 0;
          throw Object.assign(new Error('HTTP ' + r.status), { wait: Math.max(ra * 1000, 15000 * 2 ** a) });
        }
        if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + text.slice(0, 200));
        const j = JSON.parse(text);
        if (j.remark && /error|timed out|out of memory/i.test(j.remark)) throw Object.assign(new Error('Overpass remark: ' + j.remark), { wait: 30000 });
        return { json: j, text, endpoint };
      } catch (e) {
        lastErr = e;
        const wait = e.wait || 15000 * 2 ** a;
        console.warn(`  ${new URL(endpoint).host} attempt ${a + 1} failed: ${e.message}; waiting ${wait / 1000}s`);
        await sleep(wait);
      } finally { clearTimeout(timer); }
    }
    console.warn('  switching to mirror');
  }
  throw lastErr;
}

async function fetchOsm() {
  let first = true;
  for (const [file, query] of Object.entries(QUERIES)) {
    if (skip(file)) continue;
    if (!first) await sleep(10000); // etiquette gap between consecutive queries
    first = false;
    console.log('overpass', file);
    const { json, text, endpoint } = await overpass(query);
    fs.writeFileSync(path.join(RAW, file), text);
    const counts = {}; for (const e of json.elements) counts[e.type] = (counts[e.type] || 0) + 1;
    console.log('  got', file, kb(text.length), JSON.stringify(counts), 'osm_base', json.osm3s && json.osm3s.timestamp_osm_base);
    record(file, { source: endpoint, method: 'POST data=<query>', query, osmBase: json.osm3s && json.osm3s.timestamp_osm_base, counts, license: 'ODbL 1.0, (c) OpenStreetMap contributors' });
  }
}

// ------------------------------------------------------------------------------------------------- 3DEP DEM
// Pixels are requested square in DEGREES (RES deg on both axes): the service widens the extent to make them square
// anyway (the trivia downtown DEM asked for 34.495-34.535 and got 34.4909-34.5391), so ask for what it will give.
// 2.0e-5 deg = 1.83 m east-west x 2.22 m north-south at lat 34.52 (about 2 m).
const RES = 2.0e-5;
const DEMS = {
  'dem-east.tif': { west: -93.04, south: 34.5, east: -92.985, north: 34.548, note: 'Gulpha Gorge, North Mountain, Goat Rock' },
  'dem-west.tif': { west: -93.135, south: 34.488, east: -93.075, north: 34.535, note: 'West Mountain summit, Sugarloaf, Music Mountain, Black Snake Rd, Cedar Glades Rd' },
};
const q = (o) => Object.entries(o).map(([k, v]) => k + '=' + encodeURIComponent(v)).join('&');

async function getBinary(url, tries = 4) {
  let lastErr;
  for (let a = 0; a < tries; a++) {
    const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), 300_000);
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: ctl.signal });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const ct = r.headers.get('content-type') || '';
      const buf = Buffer.from(await r.arrayBuffer());
      if (/json|html|text/.test(ct)) throw new Error('service returned ' + ct + ': ' + buf.toString('utf8', 0, 300));
      return buf;
    } catch (e) { lastErr = e; console.warn(`  attempt ${a + 1} failed: ${e.message}`); await sleep(5000 * 2 ** a); }
    finally { clearTimeout(timer); }
  }
  throw lastErr;
}

function demStats(t) {
  let mn = Infinity, mx = -Infinity, nan = 0;
  for (const v of t.data) { if (Number.isNaN(v)) nan++; else { if (v < mn) mn = v; if (v > mx) mx = v; } }
  return { min: +mn.toFixed(2), max: +mx.toFixed(2), nanCount: nan };
}
function demInfo(t) {
  const bb = t.bbox;
  return {
    width: t.w, height: t.h,
    extent: bb && { west: +bb.west.toFixed(8), south: +bb.south.toFixed(8), east: +bb.east.toFixed(8), north: +bb.north.toFixed(8) },
    pixelDeg: t.pixel && [t.pixel.dx, t.pixel.dy],
    pixelM: t.pixel && [+(t.pixel.dx * M_PER_DEG_LON).toFixed(3), +(t.pixel.dy * M_PER_DEG_LAT).toFixed(3)],
    elevationM: demStats(t),
  };
}

async function fetchDem() {
  for (const [file, bb] of Object.entries(DEMS)) {
    if (skip(file)) continue;
    const W = Math.round((bb.east - bb.west) / RES), H = Math.round((bb.north - bb.south) / RES);
    if (W > 4000 || H > 4000) throw new Error(file + ' would be ' + W + 'x' + H + '; split it');
    const url = DEM_SERVICE + '?' + q({
      bbox: `${bb.west},${bb.south},${bb.east},${bb.north}`, bboxSR: 4326, imageSR: 4326, size: `${W},${H}`,
      format: 'tiff', pixelType: 'F32', noData: '', compression: 'None', interpolation: 'RSP_BilinearInterpolation', f: 'image',
    });
    console.log('3dep', file, `${W}x${H}`);
    const buf = await getBinary(url);
    const t = readTiff(buf); // throws on a bad/compressed/HTML reply
    if (t.w !== W || t.h !== H) console.warn(`  size mismatch: asked ${W}x${H}, got ${t.w}x${t.h}`);
    fs.writeFileSync(path.join(RAW, file), buf);
    const info = demInfo(t);
    console.log('  got', file, kb(buf.length), JSON.stringify(info));
    record(file, { source: url, requestedBbox: bb, ...info, license: 'USGS 3DEP, public domain' });
    await sleep(3000);
  }
}

function copyTrivia() {
  for (const file of ['dem-downtown.tif', 'dem-region.tif']) {
    if (skip(file)) continue;
    const src = path.join(TRIVIA_RAW, file);
    if (!fs.existsSync(src)) { console.warn('  missing source', src, '(the trivia game must fetch it first)'); continue; }
    fs.copyFileSync(src, path.join(RAW, file));
    const t = readTiff(fs.readFileSync(path.join(RAW, file)));
    const info = demInfo(t);
    console.log('copied', file, kb(fs.statSync(src).size), JSON.stringify(info));
    record(file, { source: 'copy of ' + path.relative(ROOT, src).replace(/\\/g, '/') + ' (USGS 3DEP exportImage, fetched 2026-10-28 by games/trivia)', ...info, license: 'USGS 3DEP, public domain' });
  }
}

// ------------------------------------------------------------------------------------------------- GNIS
async function fetchGnis() {
  const file = 'gnis.json';
  if (skip(file)) return;
  const out = { fetched: new Date().toISOString(), layers: {} };
  for (const [id, name] of [[5, 'Landforms'], [7, 'Other Hydrographic Features']]) {
    const url = `${GNIS_SERVICE}/${id}/query?` + q({
      geometry: '-93.135,34.490,-92.985,34.550', geometryType: 'esriGeometryEnvelope', inSR: 4326, outSR: 4326,
      spatialRel: 'esriSpatialRelIntersects', outFields: 'gaz_id,gaz_name,gaz_featureclass,county_name', returnGeometry: 'true', f: 'json',
    });
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!r.ok) throw new Error('GNIS HTTP ' + r.status);
    const j = await r.json();
    if (j.error) throw new Error('GNIS ' + JSON.stringify(j.error));
    out.layers[name] = { url, features: j.features.map((f) => ({ ...f.attributes, points: f.geometry.points || [[f.geometry.x, f.geometry.y]] })) };
    console.log('gnis', name, j.features.length, 'features');
    await sleep(1000);
  }
  fs.writeFileSync(path.join(RAW, file), JSON.stringify(out, null, 1));
  record(file, { source: GNIS_SERVICE + '/{5,7}/query', license: 'USGS GNIS, public domain' });
}

if (want('osm')) await fetchOsm();
if (want('copy')) copyTrivia();
if (want('dem')) await fetchDem();
if (want('gnis')) await fetchGnis();
console.log('done; manifest at', path.relative(ROOT, MANIFEST));
