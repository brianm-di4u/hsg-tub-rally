# Spa City Tub Rally: report

An original N64-style bathtub kart racer on the real streets and mountain roads of Hot Springs, Arkansas,
inspired by the World Championship Running of the Tubs. Built M0–M5 per `DEV-PLAN.md`.

## What was built
- **Eight courses from real data** (OpenStreetMap streets and buildings, USGS 3DEP elevation), routed, compressed
  to ~1 km laps (45–60 s), checked and balanced:

| Course | Cup | Real → raced | Notes |
|---|---|---|---|
| Bathhouse Row | Bathhouse | 1,610 m → 1,010 m | Central Ave past the eight bathhouses **at true scale** in the HABS order; Grand Promenade (game course); 10 landmark models + Medical Arts + Army-Navy |
| Park Avenue Nights | Bathhouse | 1,937 → 1,000 m | dusk, neon bands, swing theme; the Vapors block pinned at true scale (Vapors position approximate); the Arlington |
| Whittington Valley | Bathhouse | 2,554 → 1,000 m | both one-way halves of Whittington Ave around the park; a private lot on the old ballpark site raced as a labelled game-course link |
| Bridge Street Bash | Bathhouse | 1,865 → 1,020 m | Bridge St (54 m OSM, pinned) and Malvern; stops ~130 m short of the 2016 finish plaza so no real building straddles the road |
| Hot Springs Mountain Drive | Ouachita | 4,465 → 1,050 m | all 7 switchbacks of the lower climb, the Pagoda, the Tower (models) |
| Goat Rock & Gulpha Gorge | Ouachita | 6,982 → 1,050 m | Goat Rock overlook (model), the Gulpha Gorge Trail ford; about half the real loop is footpaths raced as dirt (game course) |
| West Mountain Summit | Ouachita | 3,936 → 1,000 m | Prospect entrance, Row-view overlooks, Lake Hamilton overlook; return on trails (game course); the 1924 shelter placed approximately |
| Sunset Ridge | Ouachita | 1,778 → 1,000 m | **changed from plan**: the Sugarloaf/Music Mountain roads only form 10–17 km loops, so this is the Hot Springs Mountain summit circuit at sunset (Tower, Pagoda) |

- **Arena**: Hill Wheatley Plaza (Water Fight) around the plaza's thermal jug fountain, real buildings around it.
- **Modes**: Grand Prix (two cups, standings, Golden/Silver/Bronze Faucet, unlocks), Quick Race, Time Trial with
  saved pose ghosts, **Rules of the Row** (division bracket heats down Central with judge stops: Ring Around the
  Tub, Bath Toss, Jumping Jacks, Push-ups, Yodeling; disqualification under 10 gal or a missing item; Battle of the
  Badge exhibition; awards ceremony), **Water Fight**.
- **The real rules as mechanics**: captain + four attendants (towel, mat, soap, loofah), water as ballast and
  health with the 10-gallon line, fumble → circle the tub, grip slip, rubber duck and flag on every tub, hats and
  suspenders, bath-ticket bribes for a Head Start at judge stands (blue feather flags), crowd blasters and refill
  buckets.
- **12 fictional teams** in three divisions with distinct handling; 9 original bath-themed items (no leader-
  targeting item); AI with racing lines, slides, item use, water discipline.
- **Presentation**: 240-line renderer (Authentic/Crisp/Native), gamma-space custom shaders, Codex-painted 64 px
  textures (5-bit dither) and painted ridge panoramas, 20 Blender landmark models, procedural tubs/crews with
  rigid-part animation (one draw per tub), particles, original pixel font HUD, menus, synthesized sound and four
  original sequenced themes (rag, swing, bluegrass, march).

## Acceptance criteria (PRD §12)
| AC | Status | Evidence |
|---|---|---|
| AC1 boot, zero errors/requests, http + file:// | met | final + final-fileurl suites |
| AC2 240-line Authentic, Crisp, Native | met | m0 boot; settings |
| AC3 countdown → laps → results, checkpoints | met | m0/m2 race tests |
| AC4 deterministic (Node = browser hash) | met | m1 determinism (items on) |
| AC5 push, brake, steer, hop, Warm/Hot slides | met | m0 slide, m1 lap |
| AC6 water spill/refill, gauge | met | m2 water tests, balance tool |
| AC7 fumble and circle | met | m2 circle |
| AC8 Clean Finish | met | m2 results |
| AC9 walls, drops + referee tow, off-road | met (drops rare on current courses) | check/balance (0 walls, 0 falls for AI) |
| AC10 AI on every course | met | check.mjs: 8 AI × 3 laps on all courses |
| AC11 nine items, odds by place | met | m2 items, balance hit rates |
| AC12 tickets and judge stands | met | m2 judge test |
| AC13 eight real-data courses with distortion notes and landmarks | met (Sunset Ridge changed; see table) | tracks/*.notes.md, m3 course + landmark tours |
| AC14 the Row in order | met | m1 row order (node) |
| AC15 12 teams, 3 divisions, unlocks | met | m2 menus; balance division shares |
| AC16 GP, TT ghost, Water Fight, Rules of the Row | met | m1 ghost, m2 GP menus, m3 battle + row |
| AC17 screens, keyboard/gamepad navigable | met | m2 menus keyboard-only, gamepad test |
| AC18 synth music and SFX, toggles | met (not listened to by a human) | m4 audio |
| AC19 touch, no overflow, targets ≥ 44 px | met | m2 touch, checkLayout |
| AC20 reduced motion, contrast ≥ 4.5:1 | met | m4 contrast report |
| AC21 budgets | met | m5 (see below) |
| AC22 saves, storage blocked | met | m1 ghost after reload, m2 storage blocked |
| AC23 sourced facts | met | check-facts: 24/24 |
| AC24 originality checklist | met | PRD §14 reviewed each milestone |

**Visual review (M4).** Two blind critics scored the screenshots against `reviews/RUBRIC.md`: Claude 41.5/80,
Codex 46/80. No gate (≥ 7, authenticity ≥ 6) was met on that pass; readability and mobile were lowest (4.5). Their
shared top issues are fixed (DEV-PLAN D19–D26): camera clipping into scenery, the sea-like horizon, portrait framing,
dusk light on the ground, untextured walls, judge stops, and terrain from neighbouring switchbacks covering the road
on phones. The fixes were checked on reshot sheets but not re-scored.

## Tests and numbers
- `npm test -- --milestone final --gpu`: **66/66 pass**; `--file-url`: **65/65 pass** (after the review fixes).
- `node tools/track/check.mjs --all`: all 10 courses pass (incl. gray box and arena).
- `node tools/balance.mjs --track all` (Soak, 96 races): laps 53.5–56.8 s mean per course; water at the finish
  0.44–0.60 of capacity; division wins Traditional 28%, Modified 38%, Stock 33%; ~9–13 item hits per race.
- Performance (real GPU, Bathhouse Row, 8 tubs): **1.4 ms** CPU per frame at 60 fps; **1.9 ms** at 4× CPU
  throttle; 86 draws / 31k triangles desktop (Medium), 78 draws / 29k phone (Low).
- Size: index.html 269 KB, three.js 545 KB, whole game 2.18 MB, first race 1.42 MB.

## Known gaps
- Nobody has played it with real hands or listened to the audio yet; feel and mix are tuned from tests and sims.
- Tubs and crews are procedural code models, not Blender models as the plan said (they animate per part in one draw;
  a Blender pass could add detail).
- Scald class: ~39% of AI tubs finish under 10 gal (by design for the hard class; noted).
- Course compression is strong on the mountains (ks 0.085–0.185, kv 0.08–0.16): switchbacks become runs of
  hairpins and climbs are gentle. Tool ideas from the course builders: per-section kv, a `link` option for labelled
  game-course connectors, minimum straight length in loop closure, pin-order validation.
- Positions estimated (labelled in notes): the Vapors, the 1924 West Mountain shelter, the Pagoda.
- Battle (Water Fight) balance is checked by sim only; the arena is small (125 m ring).
- Visual review not re-scored after the fixes; crowd sprites are smoother than the period look, and the painted
  panoramas still show a pale haze band from high mountain viewpoints.
- Not on the website: the private repo exists (v0.2.0); the site entry waits for your go-ahead.

## Harness requests
- `t.shot` could accept a hide-HUD option for review frames.
- A per-test GPU flag (some 3D tests only make sense on the real GPU).
