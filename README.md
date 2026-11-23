# Spa City Tub Rally

An original, Nintendo 64-style bathtub kart racer set on the real downtown streets and national-park mountain
roads of Hot Springs, Arkansas. Part of the open-source (MIT) **Hot Springs Games** collection.

The racers are inspired by the town's World Championship Running of the Tubs: a captain rides and steers while
four bath attendants push, the tub must keep its water, and every team carries a rubber duck. All teams are
fictional; the game is not affiliated with the event, Visit Hot Springs or any business shown.

## Play
Open `index.html` (works from `file://` too). Arrow keys or WASD to push and steer, Shift/Space to hop and power
slide, X to use an item, Esc to pause. Gamepads and touch are supported.

Modes: Grand Prix (Bathhouse Cup and Ouachita Cup, four courses each), Quick Race, Time Trial with ghosts,
Rules of the Row (the real race's format: head-to-head heats down Central Avenue with judge stops) and Water Fight
(a battle arena at Hill Wheatley Plaza).

## Build
```bash
npm run setup          # once: test-harness dependencies + Chromium
npm run vendor         # vendor/three-r186.min.js (needs tools/dev: npm install there once)
npm run tracks         # tracks/*.spec.json → data/tracks/*.json
node tools/tex.mjs     # Codex paintings (art-src/tex, git-ignored) → assets/pack-*.js
node tools/pack-models.mjs   # Blender exports → assets/models-*.js
node tools/track/route.mjs <id> && node tools/track/bake.mjs <id> && node tools/track/check.mjs <id>   # a course
node tools/pack-tracks.mjs   # courses → assets/track-*.js (lazy-loaded) + assets/tracks.js
node tools/balance.mjs --track all   # headless AI races against tools/balance-targets.json
node tools/check-facts.mjs   # every shown fact has a source key
npm run build          # src/ → index.html
npm test               # Playwright tests (add --gpu for real WebGL, --file-url for offline)
```

Only `index.html`, `assets/` and `vendor/` ship to the website.

## Paths outside this repo

The game, its build and its tests use files inside this repo. The tools below can also use shared material from the Hot
Springs Games workspace (`reference/`, `research/`, or a sibling checkout in `repos/`). They find the workspace through the
`HSG_WORKSPACE` environment variable; when it is unset, the workspace is this repo's grandparent, which is right when the
repo sits at `<workspace>/repos/<repo>`. When the workspace copy is not there, each tool falls back to a path in this repo or
skips that step with a message.

- `tools/review-prep.mjs`: benchmark screenshots from `reference/benchmarks/racing/`, else `benchmarks/` here.
- `tools/geo/*`: raw geodata from `reference/geo/` (`HSG_GEO_DIR` still overrides it), else `art-src/geo/raw/`; `fetch.mjs` copies DEM tiles from `repos/hsg-trivia/art-src/geo/raw/` when they are there.
- `art-src/blender/scripts/ldraw_ref.py`: the LDraw library from `reference/models/ldraw/` unless `--lib` is given.
- Council-era tests write their extra captures to `screenshots/council/` (git-ignored).

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
- Jost SemiBold (SIL Open Font License 1.1, `vendor/fonts/`) for the menus, the race display and the results; `node tools/build-fonts.mjs` writes it into `src/styles/fonts.css`.
- Event facts: World Championship Running of the Tubs official rules and site (Visit Hot Springs); NPS Hot Springs National Park pages. See `research/town-content.md`.
