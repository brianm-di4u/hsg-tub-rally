# Code-sample survey

Reviewed 2026-10-30. Only MIT/BSD/ISC/Apache/Unlicense/CC0/public-domain code is adapted; GPL or unclear code
is reference only. No third-party code is stored in this repo (reference copies, if any, live in the
git-ignored `reference-samples/`).

| # | Sample | License | Version | Does well | Does badly / caveats | Verdict |
|---|---|---|---|---|---|---|
| 1 | three.js (npm `three`) — renderer, GLTFLoader, SkeletonUtils, BufferGeometryUtils | MIT | 0.186.1 | Mature WebGL renderer; ShaderMaterial lets us write N64-style shaders | Big if bundled whole; colour management must be turned off for gamma-space look | **Vendored** as a tree-shaken IIFE (`tools/build-vendor.mjs`, `vendor/three-r186.min.js`) |
| 2 | Hot Springs Games collection modules (hsg-theme-park `track3d.js`/`geo.js`, hsg-fishing loop/audio/Blender `common.py`, hsg-baseball `build-vendor.mjs`/`pack-models.mjs`, hsg-football `rng.js`/`tiers.js`, hsg-property-game `damp()`, hsg-basketball `input.js`, shared `inline.mjs`, test harness, `art-pack.mjs`) | MIT (same collection) | local repos, 2026-10-29 | Proven patterns for file:// packs, fixed-step loops, spline sweeps, Blender pipelines, tests | Built for other genres; no vehicle physics or drift anywhere | **Adapted** with attribution comments where code lands |
| 3 | bryc, "PRNGs" (mulberry32) — github.com/bryc/code jshash/PRNGs.md | Public domain | as cited in football `rng.js` | Tiny, fast, serializable state | Not cryptographic (irrelevant) | **Used** (via football `rng.js`) |
| 4 | pmndrs/racing-game — github.com/pmndrs/racing-game | MIT (LICENSE.md; CC0 assets) | main, 515 commits as viewed 2026-10-30 | Component structure for a browser racer (HUD, checkpoints, effects, leaderboard, store) | React/R3F and a physics engine; realistic-car feel, not arcade kart; heavy | **Reference only** for UI/flow ideas; no code copied |
| 5 | SuperTuxKart — supertuxkart.net | GPL-3.0 | n/a | Reference for what an open kart racer includes (AI lines, item balance, rescue) | GPL; its item and box designs are close to commercial conventions we avoid | **Reference only**, ideas filtered through the originality checklist |
| 6 | Algorithms (no code): centripetal Catmull–Rom (Yuksel et al. 2011), pure-pursuit steering (Coulter 1992, CMU-RI-TR-92-01), elastic-band minimum-curvature line, forward/backward speed-profile passes | n/a (published methods) | n/a | Standard, stable, deterministic | Need tuning per track | **Implemented from the descriptions** in `tools/track/lib.mjs` and `src/js/sim/ai.js` |

## Foundation chosen
- Rendering: three.js ShaderMaterials with our own N64 shaders (gamma space, per-vertex fog, rigid-part karts).
- Track and AI: own spline/racing-line tools (6) using the sweep approach from (2).
- Packing, loop, saves, tests: the collection's patterns (2).
- Physics: written for this game (arcade 2D body + vertical channel); nothing in (1)–(5) fits a pushed-bathtub kart with water slosh.
