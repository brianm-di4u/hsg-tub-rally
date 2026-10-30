"""Lamar Bathhouse (1923, Harry Schwebke -- disputed: Roberts & Schwebke),
515 Central Ave, Bathhouse Row, Hot Springs, Arkansas -- southernmost
bathhouse; low-poly landmark, early-N64 look.

Run (from the repo root, one line):
    "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" -b --factory-startup
        --python art-src/blender/scripts/landmarks/lamar.py -- [--no-render] [--checks]

Outputs: art-src/blender/export/lamar.glb, art-src/blender/lamar.blend,
         art-src/blender/renders/lamar_*.png (git-ignored)

Conventions: see art-src/blender/README.md and fordyce.py. Origin = front-centre
at grade on the main two-storey front wall; the one-storey sun porch
projects in front of it (glTF z > 0). +X = south.

FACTS USED (research/ in the workspace root):
  bathhouse-row-layout.md table, row 8 (HABS AR-28 / AR-28-H, measured):
    frontage 95 ft (trivia) / ~91-96 ft (mahjong); OSM 90 x 111 ft
    2 stories; 1-story sun porch across most of the front
    parapet ~31 ft; raised central pediment ~34 ft
  visual-style-guide.md / bathhouse-row-and-springs.md, Lamar sections:
    transitional commercial style with classical traces; stuccoed reinforced
    concrete; flat roof with a wire-glass skylight; parapet edges capped
    with brick and clay tile ("built-up roofing, clay tile coping", HABS);
    five broad segmental-arched porch openings under a small "LAMAR"
    pediment (HABS AR-28-H); simplest silhouette on the Row.
  Hexes: stucco #F3EFE6, cap tile #A9432C, cream #E6D7B5 (visual-style-guide.md
    Lamar); blue accents = the guide's cobalt #2B4C9B.
  Shape check (not copied): HABS AR-28-H B&W photo 1 (west front) and an NPS
    photo from the SW (trivia photo-refs/lamar/) -- six paired upper
    windows, stepped central parapet with a small stack behind it, small
    blue tile diamonds under the cornice [observed, NPS photo, undated].

ESTIMATES:
  frontage 93 ft (inside both HABS readings); body depth 99 ft (OSM 111 ft
  minus a 12 ft porch)
  sun porch 77 ft wide (scaled from the HABS photo), 12 ft deep, parapet
  15 ft, LAMAR pediment 17 ft; arch sizes
  cornice band 27.5-28.2 ft; parapet coping 31 ft (HABS); stepped central
  pediment 8 m wide to 34 ft (HABS); stack 1 m square to 37 ft
  wire-glass skylight 6 x 4 m on the roof, 0.6 m curb
"""
import os
import sys

sys.dont_write_bytecode = True                      # no __pycache__ in art-src
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))          # art-src/blender/scripts
from common import *                                # noqa: E402,F401,F403
from rowkit import *                                # noqa: E402,F401,F403

NAME = 'lamar'
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
TRI_BUDGET = 900

# ---------------------------------------------------------------- palette
C_WALL = C_STUCCO
C_TRIM = C_CREAM                   # cornice band, porch cornice
C_BASE = shade(C_STUCCO, 0.86)     # derived: base course
C_CAP = C_TILE                     # clay tile coping
C_SKY = mix(C_WINDOW, C_VERD, 0.5)  # derived: wire-glass skylight, greenish

# ---------------------------------------------------------------- dimensions (m)
W = 93 * FT                        # 28.35 frontage                 [HABS 91-96]
HW = W / 2
D = 99 * FT                        # 30.18 body depth               [est]
Z_BASE = 2.5 * FT                  # 0.76                           [est]
Z_CB0, Z_CB1 = 27.5 * FT, 28.2 * FT   # 8.38 / 8.60 cornice band     [est]
Z_PAR = 31 * FT                    # 9.45 parapet coping            [HABS ~31]
Z_PED = 34 * FT                    # 10.36 central pediment         [HABS ~34]
Z_STACK = 37 * FT                  # 11.28 stack                    [est]
PW = 77 * FT                       # 23.47 porch width              [est]
PD = 12 * FT                       # 3.66 porch depth               [est]
Z_PPAR = 15 * FT                   # 4.57 porch parapet             [est]
Z_PPED = 17 * FT                   # 5.18 LAMAR pediment            [est]

FRONT = front_frame(0.0)
PFRONT = front_frame(-PD)
SOUTH = south_frame(HW)
NORTH = north_frame(-HW)
REAR = rear_frame(D)


def coping(mb, x0, x1, y0, y1, z, t=0.16, o=0.08, w=0.35, back=True):
    """Thin clay-tile cap: four strips along the parapet edges (a ring, so
    the flat roof inside keeps its own colour)."""
    top = {'+z': shade(C_CAP, 0.85)}
    strips = [((x0 - o, y0 - o), (x1 + o, y0 + w)),            # front
              ((x0 - o, y0 + w), (x0 + w, y1 + o)),            # -x side
              ((x1 - w, y0 + w), (x1 + o, y1 + o))]            # +x side
    if back:
        strips.append(((x0 + w, y1 - w), (x1 - w, y1 + o)))
    for (a0, b0), (a1, b1) in strips:
        cbox(mb, (a0, b0, z), (a1, b1, z + t), 'roof', C_CAP, skip=('-z',), cols=top)


def main_block(mb):
    spec = [(Z_SKIRT, Z_BASE, 'trim', C_BASE), (Z_BASE, Z_CB0, 'wall', C_WALL),
            (Z_CB0, Z_CB1, 'trim', C_TRIM), (Z_CB1, Z_PAR, 'wall', C_WALL)]
    banded_box(mb, -HW, HW, 0.0, D, spec)
    mb.poly([(-HW, 0, Z_PAR), (HW, 0, Z_PAR), (HW, D, Z_PAR), (-HW, D, Z_PAR)],
            'roof', C_FLATROOF, out=(0, 0, 1))
    coping(mb, -HW, HW, 0.0, D, Z_PAR)
    # stepped central pediment on the front parapet
    hw = 4.0
    ped = [(-hw, Z_PAR), (hw, Z_PAR), (hw, Z_PAR + 0.40), (hw - 1.2, Z_PAR + 0.40),
           (hw - 1.2, Z_PAR + 0.62), (0.0, Z_PED), (-hw + 1.2, Z_PAR + 0.62),
           (-hw + 1.2, Z_PAR + 0.40), (-hw, Z_PAR + 0.40)]
    outline_prism(mb, FRONT, ped, 0.35, 'wall', C_WALL, 'roof', C_CAP, skip_edges=(0,))
    body(mb, -0.5, 0.5, 1.2, 2.2, Z_PAR, Z_STACK, 'wall', C_WALL, cols={'+z': C_IRON})
    # wire-glass skylight over the stair core
    cbox(mb, (-3.0, 12.0, Z_PAR), (3.0, 16.0, Z_PAR + 0.6), 'glass', C_SKY, skip=('-z',),
         mats={'-x': 'wall', '+x': 'wall', '-y': 'wall', '+y': 'wall'},
         cols={'-x': C_WALL, '+x': C_WALL, '-y': C_WALL, '+y': C_WALL})
    # six paired upper windows, blue tile diamonds between them
    xs = spaced(6, W / 6.2)
    for x in xs:
        for k in (-1, 1):
            window(mb, FRONT, x + k * 0.55, 0.9, 5.65, 7.35, C_WINDOW, d=0.08)
        wrect(mb, FRONT, x - 1.1, x + 1.1, 5.5, 5.62, 'trim', C_TRIM, 0.05)
    for x in [xs[0] - 2.0] + [(xs[i] + xs[i + 1]) / 2 for i in range(5)] + [xs[-1] + 2.0]:
        wpoly(mb, FRONT, [(x, 7.75), (x + 0.25, 8.05), (x, 8.3), (x - 0.25, 8.05)], 'trim',
              C_COBALT, 0.05)
    # ground-floor windows outside the porch
    for s in (-1, 1):
        window(mb, FRONT, s * (PW / 2 + (HW - PW / 2) / 2), 1.0, 1.6, 3.6, C_WINDOW, d=0.08)
    for fr, s in ((SOUTH, 1), (NORTH, -1)):
        for y in (3.0, 7.5, 12.0, 16.5, 21.0, 25.5):
            for k in (-1, 1):
                window(mb, fr, s * y + k * 0.5, 0.8, 5.65, 7.35, C_WINDOW, d=0.08)
            window(mb, fr, s * y, 1.4, 1.6, 3.6, C_WINDOW, d=0.08)
    for x in (-10.0, -5.0, 0.0, 5.0, 10.0):
        window(mb, REAR, -x, 1.1, 5.65, 7.35, C_WINDOW, d=0.06)


def porch(mb):
    y0 = -PD
    hx = PW / 2
    spec = [(Z_SKIRT, Z_BASE, 'trim', C_BASE), (Z_BASE, Z_PPAR - 0.75, 'wall', C_WALL),
            (Z_PPAR - 0.75, Z_PPAR - 0.5, 'trim', C_TRIM), (Z_PPAR - 0.5, Z_PPAR, 'wall', C_WALL)]
    banded_box(mb, -hx, hx, y0, 0.0, spec, faces=('-y', '+x', '-x'))
    mb.poly([(-hx, y0, Z_PPAR), (hx, y0, Z_PPAR), (hx, 0, Z_PPAR), (-hx, 0, Z_PPAR)],
            'roof', C_FLATROOF, out=(0, 0, 1))
    coping(mb, -hx, hx, y0, -0.02, Z_PPAR, t=0.12, back=False)
    # small LAMAR pediment
    ped = [(-2.4, Z_PPAR), (2.4, Z_PPAR), (2.4, Z_PPAR + 0.2), (0.0, Z_PPED), (-2.4, Z_PPAR + 0.2)]
    outline_prism(mb, PFRONT, ped, 0.3, 'wall', C_WALL, 'roof', C_CAP, skip_edges=(0,))
    wrect(mb, PFRONT, -1.3, 1.3, Z_PPAR - 0.45, Z_PPAR + 0.12, 'trim', C_IRON, 0.04)
    # five broad segmental-arched openings, the centre one the entrance
    pitch = PW / 5
    for i, x in enumerate(spaced(5, pitch)):
        wpoly(mb, PFRONT, seg_arch_uv(x, pitch - 0.9, Z_BASE + 0.25, 3.55, 0.55, 3), 'glass',
              vgrad(C_WINDOW, shade(C_WINDOW, 0.55), Z_BASE, 3.55), 0.08)
    for x, s in ((hx, 1), (-hx, -1)):
        fr = south_frame(x) if s > 0 else north_frame(x)
        wpoly(mb, fr, seg_arch_uv(s * (-PD / 2), 2.4, Z_BASE + 0.25, 3.55, 0.45, 3), 'glass',
              vgrad(C_WINDOW, shade(C_WINDOW, 0.55), Z_BASE, 3.55), 0.08)
    cbox(mb, (-1.8, y0 - 1.3, Z_SKIRT), (1.8, y0, Z_BASE * 0.6), 'trim', C_BASE, skip=('+y', '-z'))


# ---------------------------------------------------------------- build
def build():
    reset()
    mats = order_mats(C_WALL, C_CAP, C_TRIM)
    mb = MB()
    main_block(mb)
    porch(mb)
    o = mb.build('Lamar', mats, vcol=True, order=['wall', 'roof', 'trim', 'glass'])
    box_uv(o, unit=4.0)
    return o


def main():
    o = build()
    street = dict(cam_loc=(-HW - 21.0, -25.0, 1.6), target=(-1.0, 6.0, 5.0), lens=28.0)
    finish(NAME, o, TRI_BUDGET, ARGS, street,
           aerial=dict(cam_loc=(-30.0, -42.0, 26.0), target=(0.0, 9.0, 4.0), lens=35.0),
           elev=dict(cam_loc=(0.0, -80.0, 6.0), target=(0.0, 0.0, 6.0), ortho_scale=36.0),
           rear=dict(cam_loc=(30.0, 64.0, 22.0), target=(0.0, 12.0, 4.0), lens=35.0))


main()
