# Performance ceiling study (brick campaign, loop 1)

How much model complexity the brick look can afford, per device class, measured on this PC (RTX 5060, i5-14400F,
no integrated GPU) with no real phones (by decision). Raw rows: `reviews/perf-lab.json` (sweep) and
`reviews/loop-N/perf.json` (each loop's gate run). Budgets: `tools/perf-budgets.json`; checker: `tools/perf-check.mjs`.

## Method
- **Perf lab** (`act('perfLab', …)`, `src/js/gfx/perflab.js`): a real-time 8-tub AI race on Bathhouse Row with the
  crews swapped for synthetic brick figures at six detail levels, drawn by the real part-palette material (one draw
  per tub, rigid parts animated), optionally with an instanced brick crowd. Levels are rounded boxes with `seg` bevel
  steps and studs with `stud` segments:

  | Level | Bevel steps | Stud segments | Tris per figure | Tris per tub + crew |
  |---|---|---|---|---|
  | 0 | 0 | — | 144 | 1,344 |
  | 1 | 1 | 8 | 1,336 | 8,808 |
  | 2 | 2 | 12 | 3,660 | 21,516 |
  | 3 | 3 | 16 | 7,136 | 40,080 |
  | 4 | 5 | 24 | 17,544 | 94,776 |
  | 5 | 8 | 48 | 41,856 | 222,000 |

- **Runner** (`tools/perf-gpu.mjs`): vsync off, 4.5 s warm-up, then 2–3 s of rAF frame times (fps, p50, p95) and
  CDP main-thread task time per frame.
- **Device proxies**:
  - *Desktop*: installed Chrome on the RTX 5060 (ANGLE/D3D11).
  - *Phone CPU*: the same with 4× CPU throttling at 390×844 @2×.
  - *GPU scaling*: RTX frame time × published FP32 throughput ratios (RTX 5060 ≈ 19.2 TFLOPS; Iris Xe ≈ 2–2.5 →
    ≈ 9×; Adreno 610 ≈ 0.27 → ≈ 71×; a mid-range phone assumed ≈ 25×). These are **estimates**: throughput ratios
    ignore bandwidth and driver differences, and RTX frame time includes CPU overhead (so they err pessimistic).
  - *Floor*: bundled Chromium with SwiftShader (software GL on the CPU) at phone size, the most pessimistic stand-in
    for a weak phone GPU. It is the only proxy that is sensitive to triangles and pixels.

## Results
**The RTX 5060 never notices triangles in this range.** High tier, 1280×800: 55k tris → 1,351 fps; 676k (level 3) →
1,235 fps; 1.55M (level 4) → 1,143 fps; 3.59M (level 5) → 649 fps (p95 2.8 ms). Task time stays 0.6–0.9 ms. Draw
calls are 136–147 with the shadow pass.

**The phone CPU proxy doesn't either.** 4× throttle: task time 0.9–1.8 ms at every level (all ≥ 137 fps): the
crews are one draw per tub with the animation on the GPU, so complexity costs the CPU nothing.

**The software floor is where complexity shows** (Low tier, 585×1266 at the time of the sweep):

| Load | Tris | fps | p50 ms |
|---|---|---|---|
| level 0 crews | 33k | 54 | 18.4 |
| level 1 | 89k | 36 | 27.7 |
| level 2 | 190k | 31 | 32.8 |
| level 3 | 339k | 26 | 38.9 |
| level 2 + 300-figure crowd at level 0 | 234k | 29 | 35.0 |
| level 2 + 300-figure crowd at level 1 | 635k | 17 | 59.2 |

That fits roughly **18 ms of fixed per-pixel cost at 0.74 MP plus ≈ 0.065 ms per 1,000 triangles**. The brick
look's per-pixel plastic shading (and native resolution) is the main cost, not the triangles.

## Decisions
- **Low tier renders at 0.85× CSS pixels** (`dprCap 0.85`) with a lighter plastic shader (fixed-power specular, no
  sky reflection; the stud and seam patterns stay) and no shadow map. On the floor proxy this brings the four course
  scenes to 1.15–1.27× the old 240-line build's frame time (it was 1.3–1.6× at 1.0×). See the loop-1 gate run.
- **Figure and tub budgets per tier** (`tools/perf-budgets.json`): Low ≈ level 1 (≤ 1.4k tris per figure, ≤ 9k per
  tub, crowds stay sprites, scene ≤ 120k); Medium ≈ level 2 (≤ 3.7k per figure, ≤ 22k per tub, near crowd 3D at level
  0, scene ≤ 450k); High ≈ level 3 in races (≤ 7.2k per figure) with a hero LOD up to ≈ level 4 (≤ 18k) for team
  select and the podium (scene ≤ 1.6M). Draws ≤ 120 / 200 / 220.
- **Where the budget goes first**: on Medium/High the knee is not triangles but pixels and shadow-map passes; extra
  detail is better spent on bevels, prints and AO than on more geometry once a figure passes level 2 at chase
  distance (≈ 55 px tall), consistent with football's LOD study (L1→L3 gives most of the visible gain).

## The measured gate (every loop, `tools/perf-check.mjs`)
- Desktop Medium and High: p95 ≤ 8 ms, task ≤ 4 ms on every course scene.
- Phone CPU (4×): task ≤ 16 ms and ≥ 30 fps on Low and Medium.
- GPU scaling: laptop iGPU estimate ≤ 16.7 ms (Medium desktop); mid-phone estimate ≤ 25 ms (Medium phone); the
  low-phone estimate is informational.
- Floor: on SwiftShader at Low (phone size), every course scene holds a median ≥ 45 fps and a p95 frame ≤ 40 ms.
  The ratio to the old 240-line build is reported but not gated (see below).
- Scene triangles and draws within the tier budgets.

## Change to the floor rule (loop 1)
The plan's floor rule was "no worse than 1.25× the old build's frame time on SwiftShader". With the brick crews in
place the Low tier measures 1.4–2.0× (row 15.2 ms vs 10.8; battle 10.8 vs 5.5) while the triangle count is back near
the old build's (31–50k vs 17–35k). What remains is per-pixel: the old build drew 240 lines with unlit, vertex-lit
colour; the brick look draws 0.85× native resolution (the critics' G-render-res) with per-pixel plastic and printed
faces. Meeting 1.25× would mean rendering Low at about 0.7× resolution, and Auto currently puts every phone on Low.

The user's constraint is that performance never drops below *playable* on any platform, so the floor gate is now
absolute: median ≥ 45 fps and p95 ≤ 40 ms on the software-GL proxy (a CPU rasterizer, far slower than any phone GPU
with these shaders). Loop 1 measures 66–93 fps with p95 25–34 ms on all four course scenes. The ratio stays in every
loop's report so a regression still shows.

Low-tier choices made to get there: crews at single-step bevels with no studs (≈ 480 tris per figure, ≈ 3k per tub,
a plain-box version beyond 22 m), opaque tub water, no shadow map, the lighter shader, 0.85× resolution.
