# Spa City Tub Rally

An original, Nintendo 64-style bathtub kart racer set on the real downtown streets and national-park mountain
roads of Hot Springs, Arkansas. Part of the open-source (MIT) **Hot Springs Games** collection.

The racers are inspired by the town's World Championship Running of the Tubs: a captain rides and steers while
four bath attendants push, the tub must keep its water, and every team carries a rubber duck. All teams are
fictional; the game is not affiliated with the event, Visit Hot Springs or any business shown.

## Play
Open `index.html` (works from `file://` too). Arrow keys or WASD to push and steer, Shift/Space to hop and power
slide, X to use an item, Esc to pause. Gamepads and touch are supported.

## Build
```bash
npm run setup          # once: test-harness dependencies + Chromium
npm run vendor         # vendor/three-r186.min.js (needs tools/dev: npm install there once)
npm run tracks         # tracks/*.spec.json → data/tracks/*.json
node tools/tex.mjs     # Codex paintings (art-src/tex, git-ignored) → assets/pack-*.js
node tools/pack-models.mjs   # Blender exports → assets/models-*.js
npm run build          # src/ → index.html
npm test               # Playwright tests (add --gpu for real WebGL, --file-url for offline)
```

Only `index.html`, `assets/` and `vendor/` ship to the website.

## Layout
| Path | What |
|---|---|
| `src/` | game source (ES modules bundled by `shared/tools/inline.mjs`) |
| `src/js/sim/` | deterministic simulation (no DOM, no three.js; the Node tools import it) |
| `src/js/gfx/` | N64-style rendering |
| `tracks/` | hand-written course specs |
| `data/tracks/` | baked course data (from OSM © OpenStreetMap contributors, ODbL; USGS 3DEP, public domain) |
| `tools/` | build tools (vendor, track compiler, texture and model packers, geo fetch) |
| `art-src/` | Blender scripts and Codex texture sources |
| `research/` | `town-content.md` (every fact and its source) and geo data notes |
| `PRD.md`, `MECHANICS.md`, `DEV-PLAN.md`, `SAMPLES.md` | design and plan |

## Credits
- Map data © OpenStreetMap contributors (ODbL 1.0); elevation: USGS 3D Elevation Program (public domain).
- three.js (MIT). Textures painted for this game with Codex; models built with scripted Blender.
- Event facts: World Championship Running of the Tubs official rules and site (Visit Hot Springs); NPS Hot Springs National Park pages. See `research/town-content.md`.
