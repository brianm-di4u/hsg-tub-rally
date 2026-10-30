# Spa City Tub Rally: development plan

## Milestones
| Milestone | Scope | Exit test |
|---|---|---|
| **M0 Tooling and look pilot** | repo skeleton, shared harness/inliner, vendored three, packs (textures, models), sim core, renderer, gray-box track, placeholder tubs, title/HUD shell, docs A–E, geo fetch, Fordyce Blender pilot, Codex texture pilot | `run.mjs . --milestone m0 --gpu` and `--file-url` green; shots `m0-title`, `m0-graybox`, `m0-slide`, `m0-fordyce-pilot`; frame task < 4 ms |
| **M1 Bathhouse Row + feel** | OSM route → remap → bake pipeline, `check.mjs`, real Bathhouse Row course with the eight bathhouses, physics tuning (drift, walls, slosh), time trial | track check passes; bot laps 45–60 s; real-keyboard lap; Node = browser hash; shots `m1-grid`, `m1-drift`, `m1-row` |
| **M2 Race loop + site preview** | 9 items, tickets and judge stands, refills, referee rescue, Grand Prix flow and menus (team/course select, results, standings), saves, gamepad + touch polish, `balance.mjs` v1 | balance targets met; item/water/fumble tests; touch test with `holdEndMs`; preview pushed (with your OK) |
| **M3 Content** | the other 7 courses, Water Fight arena, Rules of the Row, 12 teams in Blender (tubs, captains, attendant rig), hero landmarks, Codex texture batches, unlocks, ghosts | every course passes check + balance; start and landmark shot per course; ghost survives reload |
| **M4 Polish** | synth music + SFX, juice, awards ceremony, Trophy Room facts + `check-facts`, accessibility, the football-style visual review loop | review gates (each ≥ 7, authenticity ≥ 6) or stop rule; contrast report clean |
| **M5 Release** | performance tiers, size budgets, final matrix, REPORT.md, pin release on the site (with your OK) | `--milestone final --gpu --file-url` green |

## Task breakdown
**M0** (done when the exit test passes): skeleton · shared copy · `build-vendor.mjs` · `tex.mjs` · `pack-models.mjs` ·
`sim/{track,kart,water,race,ai,items}` · `tools/track/{lib,bake}` · `gfx/{renderer,n64mat,geom,textures,trackmesh,props,karts3d,models,sky,camera}` ·
`ui/{input,hud,pixelfont,screens}` · `main.js`, `hooks.js`, `save.js` · tests `m0.test.mjs` · docs.

**M1**: `tools/geo/{fetch,geo-lib,survey}` (background job) · `tools/track/{graph,route,remap}` · spec `tracks/bathhouse-row.spec.json` ·
DEM cross-sections · building placement from OSM footprints (Row from HABS) · Row landmark models (8 bathhouses + Admin + Arlington) ·
`tools/track/check.mjs` · physics tuning pass · Time Trial with best lap save · tests `m1.test.mjs`.

**M2**: `sim/items.js` full · pickups/tickets/judge stands · fx (splash, steam, sparks) · `ui/` team select, course select,
results, standings · Grand Prix · `tools/balance.mjs` + `balance-targets.json` · touch/gamepad tests · `tools/sync-repo.mjs` · site entry.

**M3**: specs and bakes for 7 courses · arena · Rules of the Row (`sim/rules-real.js`) · Blender `tubs.py`, `crew.py`, landmarks ·
Codex batches · packs per course (lazy) · ghosts.

**M4**: `ui/audio.js` (synth engine, sequencer, SFX) · awards · Trophy Room · `tools/check-facts.mjs` · review loop.

**M5**: tiers/governor · budgets test · final runs · REPORT.md.

## `window.__game` hook spec
See MECHANICS.md "window.__game hooks". `getState()` returns `{scene, screen, paused, ready, track, render:{w,h,mode,draws,tris},
world, settings, steps, race:{phase, time, laps, mode, classId, player, seed, karts:[…], results}}`.

## Test matrix
| AC | Test (file › name) | Screenshots (desktop + mobile) |
|---|---|---|
| AC1 | m0 › boot to title; m0 › offline file:// boot | m0-title, m0-fileurl-race |
| AC2 | m0 › boot to title (240 lines); settings › resolution modes (M2) | m0-title, settings-crisp |
| AC3 | m0 › graybox race view; m1 › full race to results | m0-graybox, m1-results |
| AC4 | m1 › determinism hash (Node vs browser) | — |
| AC5 | m0 › slide frame; m1 › drift charges and boosts | m0-slide, m1-drift |
| AC6 | m2 › water spill and refill | m2-water-low, m2-refill |
| AC7 | m2 › fumble and circle | m2-circle |
| AC8 | m2 › clean finish scoring | m2-results-clean |
| AC9 | m1 › wall and drop handling | m1-wall |
| AC10 | m0 › headless AI race (node); balance (node, M2) | — |
| AC11 | m2 › each item | m2-item-<name> |
| AC12 | m2 › tickets and judge stand | m2-judge |
| AC13 | m3 › each course start + landmark | m3-<course>-start, m3-<course>-landmark |
| AC14 | m1 › Row order from getState | m1-row |
| AC15 | m2/m3 › team select and stats | m3-teams |
| AC16 | m3 › Grand Prix, Time Trial ghost, Water Fight, Rules of the Row | m3-gp-standings, m3-tt-ghost, m3-battle, m3-row-judge |
| AC17 | m2 › menus keyboard-only | m2-title, m2-team-select, m2-course-select |
| AC18 | m4 › audio graph starts on input, toggles | — |
| AC19 | m2 › touch steer and buttons; checkLayout | m2-touch |
| AC20 | m4 › contrast report; reduced motion | m4-reduced |
| AC21 | m5 › budgets (frameCost, draws, sizes) | — |
| AC22 | m2 › saves, storage blocked | — |
| AC23 | m4 › check-facts (node) | — |
| AC24 | review at each milestone (manual, recorded below) | — |

## Defect log
| # | Found | Description | Status |
|---|---|---|---|
| D1 | M0 | `THREE.InstancedBufferGeometry` missing from the vendored bundle | fixed (added to `tools/three-entry.js`) |
| D2 | M0 | Gray-box start sat mid-curve, so the grid pointed off the road | fixed (straight before the start line) |
| D3 | M0 | Portrait HUD: lap text overlapped the item bubble; place badge too large | fixed (portrait layout) |
| D4 | M0 | Chase camera too low; attendants hid the tub | fixed (higher, farther camera; portrait offset) |
| D5 | M0 | AI race end condition ended races at 12 s when no human was racing | fixed |
| D6 | M0 | Traditional tubs win the gray box (AI); Modified lose too much water | fixed in M2 balance (division wins 30/37/33% on Soak) |
| D7 | M1 | Row anchors mapped to the Promenade (nearest street) so the Row order read backwards | fixed (anchors map to Central Ave via `rowStreet`) |
| D8 | M1 | Building fronts faced the Promenade for bathhouses between the two streets | fixed (front edge from the building's own street) |
| D9 | M1 | Inside road edge folded over itself at the Central/Reserve corner | fixed (inside half-width capped at 70% of the radius, eroded over ±8 m) |
| D10 | M1 | Closed-ring building footprints simplified to a single point (Douglas–Peucker on a closed ring) | fixed (simplify in two halves) |
| D11 | M2 | Water at the finish 0.88 (too easy) then 0.19 (too hard) | tuned: 0.43 mean, 26% under 10 gal on Soak |
| D12 | M2 | Item hits per race 3.8 (bubbles respawned too slowly) | fixed: 1.6 s respawn, ~10 hits per race |
| D13 | M2 | Enter on a focused menu button fired twice (native click + menu.ok) | fixed (keyboard Enter/Space left to the browser) |
| D14 | M2 | Magnolias on the storefront side; crowds on the Row side | fixed (magnolias on the Row side, crowds on both) |
| D15 | M3 | Base64 GLB model pack 676 KB | fixed: compact Int16/byte pack, 260 KB; GLTFLoader dropped from the vendor bundle (631 → 545 KB) |
| D16 | M3 | Captain hidden behind the rear attendants from the chase camera | fixed (attendants at the corners, captain raised and scaled) |
| D17 | M3 | Scald class: 39% of AI finish under 10 gal | open, by design for the hard class; noted in REPORT |
| D18 | M3 | Phone draw calls 90 (budget 80) | fixed: 78 phone, 86 desktop |
| D19 | M4 review | Chase camera inside trees and buildings; own tub out of frame; landmark shots inside walls | fixed: camera lifts over anything on its line of sight; landmarks placed from model depth |
| D20 | M4 review | Horizon read as sea | fixed: painted ridge panoramas, ring stretched so the pale haze sits below the horizon (a haze band still shows from high mountain views) |
| D21 | M4 review | Dusk/sunset sky over daytime-green ground | fixed: light tint on every world material |
| D22 | M4 review | Portrait: buttons covered the tub, top 40% empty sky | fixed: higher portrait camera, gauge top-left, smaller buttons |
| D23 | M4 review | Untextured building sides; judge stops only a banner | fixed: every wall textured; booth, flags and painted stop box at each stop |
| D24 | M4 review | Phone Hot Springs Mountain start showed only grass: terrain from a neighbouring compressed switchback covered the road | fixed: bake stores terrain reach per sample (half the gap to other legs); terrain clipped to it |
| D25 | M4 review | Near trees dither-faded into noise, then cut into stumps | fixed: a whole tree hides within ~7 m (per instance) |
| D26 | M4 review | Phone countdown overlapped the item pips | fixed |
| D27 | M4 review | Crowd sprites smoother than the 64 px period look | open |

## Visual review (M4)
Blind critics scored the final screenshots against `reviews/RUBRIC.md`: Claude 41.5/80 (art 5.5, atmosphere 5,
animation 5, UI 5.5, type 5.5, readability 4.5, mobile 4.5, authenticity 6) and Codex 46/80 (6, 6, 5, 6.5, 6.5, 4.5,
4.5, 7). No gate was met on that pass. Their shared top issues (camera clipping, sea horizon, portrait framing, dusk
light, bare slabs, judge stops) are fixed as D19–D26; the fixes were checked on reshot sheets but not re-scored.
