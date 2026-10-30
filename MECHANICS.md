# Spa City Tub Rally: core mechanics

The foundation every system builds on. Code paths are under `src/js/`.

## Game loop and timing
- Fixed 60 Hz simulation (`DT = 1/60`) with an accumulator; at most 15 ticks per frame; frame dt clamped to 0.25 s (`main.js`, after hsg-fishing).
- The renderer interpolates kart poses between the last two ticks (`alpha = acc / DT`).
- `step(n)` advances n ticks while paused (tests); test hooks never change rules.

## State model
One serializable race object (`sim/race.js` `makeRace`): track id, mode, class, laps, seed, time, phase
(`countdown | race | done`), karts[], drivers[] (AI), item state, finish order, results, RNG streams.
A kart (`sim/kart.js` `makeKart`): pose (x, z, y, yaw), speeds (vf forward, vl lateral, vy, yawRate), air flag,
steer, drift dir/charge/stage, boost timer, state (`run | circle | swap | rescue`), water object, attendant items,
held item, tickets, lap/checkpoint/progress, place, finish time, lap times, per-race stats, events (per tick).
Saves are a separate versioned object (`save.js`).

## Track model
Baked JSON (`data/tracks/<id>.json`, written by `tools/track/bake.mjs`): centreline sampled every ~2 m
(x, z, y, banking, half-widths, limit distances and types per side, verge types, surface, racing-line offset,
speed profile, cross-section terrain at 2/6/14/30/60 m beyond each edge), checkpoints, zones (refill, crowd, ford,
judge, items), props, building footprints, landmarks, environment (palette, sky, fog, sun).
`sim/track.js` decodes it and answers `surface(x, z, hint)` → {s, d, height, limit, verge, surface type}.
Lateral d is positive to the right of travel; forward = (sin yaw, cos yaw); right = (−cos yaw, sin yaw).

## Kart physics (`sim/kart.js`)
2D rigid body + separate vertical channel:
- **Push**: `vf += A0 · push · (M0/m)^0.55 · (1 − (vf/cap)^1.6) · dt`, cap = class top speed × division × surface factor; drag `0.45 + 0.0065 vf²`.
- **Slope**: `vf −= 9.81 · grade · 0.75 · dt` along the heading.
- **Steering**: yaw-rate target = steer × 2.25 rad/s × turn × speed factor × (M0/m)^0.22; smoothed. Lateral slip decays with grip (9/s on road).
- **Power slide**: hop at > 8 m/s with steer held locks a slide direction; steer tightens/widens; lateral slip pushed outward; charge → Warm/Hot boost.
- **Limits**: past the limit distance the tub is projected back; normal velocity reflected (restitution 0.3), tangential scraped; DROP limits trigger a fall and referee tow.
- **Vertical**: follows the surface; leaves the ground when the ground falls away faster than gravity (crests, jumps); landing impact spills water.
- **Tub-to-tub**: two circles per tub, mass-weighted impulses (restitution 0.45); hard bumps spill.

## Water (`sim/water.js`)
A damped 2-axis tilt oscillator (ω 7.5 rad/s, ζ 0.22/slosh) driven by the tub's acceleration in its own frame.
Spill rate ∝ (tilt − rim angle) while tilt exceeds the rim; rim angle = (0.1 + 0.55 (1 − fill)) × division rim
factor, so a full tub spills first. Jolts (landing, wall, bump, item) add impulses and remove gallons directly.
Mass = tub + captain + gallons × 3.785 kg feeds acceleration, turning and bump outcomes.

## Crew (fumble, circle, swap)
State timers on the kart: `circle` 1.4 s (no push, speed bleeds), `swap` 0.55 s (35% push), `rescue` 2.2 s
(then respawn on the racing line behind the last safe point). Dropped items return when the timer ends.

## Items (M2)
Soap-bubble pickup rows respawn 4 s after collection. Odds table by place (front gets defensive items, back
gets catch-up items). Projectiles are simulated in `sim/items.js` against the same track surface; homing uses the
racing line; hits call `fumble()`. Loofah shield absorbs one hit per loofah.

## AI (`sim/ai.js`)
Pure pursuit to a look-ahead point (5 + 0.42 v m) on the baked racing line plus a personal lane offset;
speed target from the baked profile × class factor × driver skill; power slides through turns tighter than
0.55 rad over 26 m; seeks refill zones when water is low; small rubber-band (±6/4/2% by class), faded out in
the last 30% of the race and off in Time Trial.

## Input
`ui/input.js`: keyboard (remappable), Gamepad API polling each frame, touch (left-half drag steer; hold
buttons). One intent per tick: steer, push, brake, hop (held), back (held), item (edge).

## Rendering (`gfx/`)
- `renderer.js`: canvas backing store at 240/480/native lines; CSS bilinear upscale; gamma-space colours; no tone mapping.
- `n64mat.js`: custom shaders: unlit world (vertex colour × texture × fog), Gouraud lit, rigid-part karts (24 matrices per tub, one draw), instanced Y-billboards.
- `trackmesh.js`: road strips with lane paint, curbs, brick sidewalks, cross-section terrain, walls/rails, building blocks, merged props; chunked every 60 samples per material.
- `karts3d.js`: tub, wheels, flag, duck, captain and four attendants with procedural run/circle animation; water surface tilts with the slosh state.
- `models.js`: Blender GLBs from base64 packs, re-materialed with the N64 shaders.
- `sky.js`, `camera.js` (critically damped chase cam), `textures.js` (packed Codex art + procedural fallbacks).

## RNG
mulberry32 (`rng.js`), state in `r.s`; named streams per race: `ai`, `items`, `race`, `fx` (cosmetic only).
No `Math.random` in the sim.

## Save format
`{ v: 1, settings, unlocked, best, ghosts, cups, stats, lastTeam, lastClass }` under `hsg-tub-rally-v1`.

## `window.__game` hooks
`seed(n)`, `getState()`, `setState({settings, res, kart:{id, gal, items, s, d}})`, `isIdle()`, `step(n)`,
`pause()`, `resume()`, `scene(name)` (title, race, help, settings, pause), `newGame({track, team, classId,
laps, seed, mode, paused, count, noItems})`, `act(name, …)`: `input` (held player input), `hit`, `water`,
`teleport`, `skipCountdown`, `camSnap`, `camAt`, `landmark`, `hash`.
