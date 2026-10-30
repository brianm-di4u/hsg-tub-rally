"""Ozark Bathhouse (1922, Mann & Stern), 425 Central Ave (conflict: 491),
Bathhouse Row, Hot Springs, Arkansas -- twin stepped towers; low-poly
landmark, early-N64 look.

Run (from the repo root, one line):
    "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" -b --factory-startup
        --python art-src/blender/scripts/landmarks/ozark.py -- [--no-render] [--checks]

Outputs: art-src/blender/export/ozark.glb, art-src/blender/ozark.blend,
         art-src/blender/renders/ozark_*.png (git-ignored)

Conventions: see art-src/blender/README.md and fordyce.py. Origin = front-centre
at grade on the main two-storey front wall; the end pavilions, the towers'
front halves and the glazed sun porch project in front of it (glTF z > 0).
+X = south.

FACTS USED (research/ in the workspace root):
  bathhouse-row-layout.md table, row 6 (HABS AR-28 / AR-28-F, measured):
    frontage 110 ft (trivia) / ~107 ft (mahjong); OSM 103 x 103 ft; 2 stories
    main parapet ~26 ft; tower roofs ~38 ft; finials ~41 ft
  visual-style-guide.md / bathhouse-row-and-springs.md, Ozark sections:
    Spanish Colonial Revival "with a vague Art Deco appearance", "white
    with a Spanish hacienda architecture style"; twin towers with
    three-tiered setbacks flank the entrance, ~47 ft apart centre to centre
    (HABS), hipped red clay tile caps with finials; red clay tile on the
    sloped porch; flat with tile pent roofs (HABS "stucco over concrete",
    "Spanish clay tile & built-up roofing"); glazed central sun porch (a
    later addition) between the tower pavilions; cartouches over the
    pavilion windows; gold "OZARK" letters; brown and blue patterned tile
    panels under the sun-porch windows [observed 1984].
  Hexes: white #F3EFE6, red tile #A9432C, shadow #7E2F1F (visual-style-guide.md
    Ozark); gold letters = brass #C9A23F; tile panels = the guide's brown
    #6E4B2F and cobalt #2B4C9B.
  Shape check (not copied): HABS colour photo 571936c (mahjong ref
    habs-ozark-facade-nw.jpg) and Highsmith 2020 (trivia photo-refs/ozark/).

ESTIMATES:
  frontage 107 ft (mahjong HABS elevation); main block depth 92 ft (OSM
  103 ft includes the projecting pavilions)
  end pavilions 30 ft wide, 13 ft proud, parapet 18 ft; square corners
  towers 15 ft square, centres +-23.5 ft (HABS 47 ft c-c), front 1.8 m
  proud of the main wall; tiers at 27 / 31 / 35.5 ft, each 85 % of the one
  below (style-guide recipe); hip cap 35.5 -> 38 ft (HABS "tower roofs ~38"),
  finial to 41 ft (HABS)
  main wall top 24 ft with a tile pent up to the 26 ft parapet line
  sun porch 3 m deep, 11 ft wall, pent to 13 ft; window sizes
"""
import os
import sys

sys.dont_write_bytecode = True                      # no __pycache__ in art-src
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))          # art-src/blender/scripts
from common import *                                # noqa: E402,F401,F403
from rowkit import *                                # noqa: E402,F401,F403

NAME = 'ozark'
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
TRI_BUDGET = 900

# ---------------------------------------------------------------- palette
C_WALL = C_STUCCO
C_BASE = shade(C_STUCCO, 0.86)     # derived: base course / cornice undersides
C_CORN = shade(C_STUCCO, 0.93)     # derived: tier cornices, a step darker than the walls
C_GOLD = C_BRASS                   # gold "OZARK" letters
C_TBROWN = hexc('#6E4B2F')         # tile panels
C_CART = shade(C_STUCCO, 0.80)     # derived: relief cartouches read as shaded ovals

# ---------------------------------------------------------------- dimensions (m)
W = 107 * FT                       # 32.61 frontage                 [HABS ~107]
HW = W / 2
D = 92 * FT                        # 28.04 main block depth         [est]
Z_BASE = 2.5 * FT                  # 0.76                           [est]
Z_WALL = 24 * FT                   # 7.32 main wall top             [est]
Z_PAR = 26 * FT                    # 7.92 parapet / pent top        [HABS ~26]
PWID = 30 * FT                     # 9.14 end-pavilion width        [est]
PY = -13 * FT                      # -3.96 pavilion front           [est]
Z_PAV = 18 * FT                    # 5.49 pavilion parapet          [est]
TX = 47 * FT / 2                   # 7.16 tower axis                [HABS ~47 ft c-c]
TW = 15 * FT                       # 4.57 tower base width          [est]
TY = -1.8                          # tower front                    [est]
Z_T1 = 27 * FT                     # 8.23 tier 1 top                [est]
Z_T2 = 31 * FT                     # 9.45 tier 2 top                [est]
Z_T3 = 35.5 * FT                   # 10.82 belfry top / cap eave    [est]
Z_TCAP = 38 * FT                   # 11.58 cap peak                 [HABS ~38]
Z_TFIN = 41 * FT                   # 12.50 finial                   [HABS ~41]
SY = -3.0                          # sun-porch front                [est]
Z_SP = 11 * FT                     # 3.35 sun-porch wall            [est]
Z_SPENT = 13 * FT                  # 3.96 sun-porch pent at the wall [est]

FRONT = front_frame(0.0)
PFRONT = front_frame(PY)
SFRONT = front_frame(SY)
SOUTH = south_frame(HW)
NORTH = north_frame(-HW)
REAR = rear_frame(D)


def main_block(mb):
    spec = [(Z_SKIRT, Z_BASE, 'trim', C_BASE), (Z_BASE, Z_WALL, 'wall', C_WALL)]
    banded_box(mb, -HW, HW, 0.0, D, spec)
    mb.poly([(-HW, 1.4, Z_PAR), (HW, 1.4, Z_PAR), (HW, D, Z_PAR), (-HW, D, Z_PAR)],
            'roof', C_FLATROOF, out=(0, 0, 1))
    # red tile pent along the front parapet, plain parapet on the other sides
    pent(mb, -HW - 0.3, HW + 0.3, 1.4, -0.45, Z_PAR, Z_WALL + 0.12, C_TILE, C_TILE_SH,
         fascia=0.16)
    for a, b, out in (((HW, 1.4), (HW, D), (1, 0, 0)), ((HW, D), (-HW, D), (0, 1, 0)),
                      ((-HW, D), (-HW, 1.4), (-1, 0, 0))):
        vquad(mb, a, b, Z_WALL, Z_PAR, 'wall', C_WALL, out)
    # upper windows on the main block (above the pavilions and porch)
    for x in (-3.2, -1.1, 1.1, 3.2):
        window(mb, FRONT, x, 0.95, 4.75, 6.05, C_WINDOW, d=0.08)
    for s in (-1, 1):
        for x in (s * 11.0, s * 13.6):
            window(mb, FRONT, x, 1.05, 6.05, 7.0, C_WINDOW, d=0.08)
    # gold OZARK letters on the parapet band between the towers
    for i, x in enumerate(spaced(5, 0.78)):
        wrect(mb, FRONT, x - 0.28, x + 0.28, 6.45, 7.05, 'trim', C_GOLD, 0.05)
    for fr, s in ((SOUTH, 1), (NORTH, -1)):
        for y in (3.0, 8.0, 13.0, 18.0, 23.0):
            window(mb, fr, s * y, 1.1, 4.7, 6.1, C_WINDOW, d=0.08)
            window(mb, fr, s * y, 1.4, 1.5, 3.2, C_WINDOW, d=0.08)
    for x in (-12.0, -6.0, 0.0, 6.0, 12.0):
        window(mb, REAR, -x, 1.1, 4.7, 6.1, C_WINDOW, d=0.06)


def pavilions(mb):
    spec = [(Z_SKIRT, Z_BASE, 'trim', C_BASE), (Z_BASE, Z_PAV - 0.45, 'wall', C_WALL),
            (Z_PAV - 0.45, Z_PAV, 'trim', C_CORN)]
    for s in (-1, 1):
        xa, xb = sorted([s * (HW - PWID), s * HW])
        faces = ('-y', '+x' if s > 0 else '-x', '-x' if s > 0 else '+x')
        banded_box(mb, xa, xb, PY, 0.0, spec, faces=faces)
        mb.poly([(xa, PY, Z_PAV), (xb, PY, Z_PAV), (xb, 0, Z_PAV), (xa, 0, Z_PAV)],
                'roof', C_FLATROOF, out=(0, 0, 1))
        # big window with a cartouche over it, window box below
        uc = s * (HW - PWID / 2 + 1.0)
        win_row(mb, PFRONT, [uc], 2.6, 1.7, 3.75, d=0.08, surround=C_CORN, s_pad=0.22)
        wpoly(mb, PFRONT, star_uv(uc, 4.55, 0.5, 0.5, 3, math.pi / 2), 'trim', C_CART, 0.06)
        fbox(mb, PFRONT, uc - 1.4, uc + 1.4, 1.1, 1.55, 0.0, 0.35, 'trim', C_CORN,
             cols={'bottom': C_BASE})
        fr = SOUTH if s > 0 else NORTH
        window(mb, fr, s * (PY / 2), 1.6, 1.7, 3.75, C_WINDOW, d=0.08)


def sun_porch(mb):
    x0 = TX - TW / 2
    spec = [(Z_SKIRT, Z_BASE, 'trim', C_BASE), (Z_BASE, Z_SP, 'wall', C_WALL)]
    banded_box(mb, -x0, x0, SY, 0.0, spec, faces=('-y',))
    pent(mb, -x0, x0, 0.0, SY - 0.4, Z_SPENT, Z_SP + 0.06, C_TILE, C_TILE_SH, fascia=0.15,
         cheeks=False)
    # glazing bays with brown/blue tile panels below
    for i, x in enumerate(spaced(5, (2 * x0) / 5)):
        window(mb, SFRONT, x, 1.3, 1.45, 3.05, C_WINDOW, d=0.07, dark=0.6)
        wrect(mb, SFRONT, x - 0.5, x + 0.5, 0.92, 1.32, 'trim', C_TBROWN if i % 2 else C_COBALT, 0.05)
    cbox(mb, (-1.5, SY - 1.2, Z_SKIRT), (1.5, SY, Z_BASE * 0.6), 'trim', C_BASE, skip=('+y', '-z'))


def tower(mb, cx):
    y0, y1 = TY, TY + TW
    yc = (y0 + y1) / 2
    h1, h2, h3 = TW / 2, TW * 0.85 / 2, TW * 0.85 * 0.85 / 2
    cbox(mb, (cx - h1, y0, Z_SKIRT), (cx + h1, y1, Z_T1), 'wall', C_WALL, skip=('-z',),
         cols={'+z': C_CORN})
    fbox(mb, front_frame(y0), cx - h1 - 0.12, cx + h1 + 0.12, Z_T1 - 0.35, Z_T1, 0.0, 0.12,
         'trim', C_CORN, skip=('back',), cols={'bottom': C_BASE})
    cbox(mb, (cx - h2, yc - h2, Z_T1), (cx + h2, yc + h2, Z_T2), 'wall', C_WALL, skip=('-z',),
         cols={'+z': C_CORN})
    wrect(mb, front_frame(yc - h2), cx - h2 + 0.6, cx + h2 - 0.6, Z_T1 + 0.35, Z_T2 - 0.35,
          'trim', C_CORN, 0.04)
    cbox(mb, (cx - h3, yc - h3, Z_T2), (cx + h3, yc + h3, Z_T3), 'wall', C_WALL, skip=('-z',))
    # belfry: two arched openings on each face
    for fr, sgn in ((front_frame(yc - h3), 1), (rear_frame(yc + h3), -1)):
        for k in (-1, 1):
            window(mb, fr, sgn * cx + k * 0.62, 0.62, Z_T2 + 0.35, Z_T3 - 0.4, C_IRON, arch=3,
                   d=0.04, dark=0.85)
    for fr, uc in ((south_frame(cx + h3), yc), (north_frame(cx - h3), -yc)):
        for k in (-1, 1):
            window(mb, fr, uc + k * 0.62, 0.62, Z_T2 + 0.35, Z_T3 - 0.4, C_IRON, arch=3,
                   d=0.04, dark=0.85)
    # hipped red-tile cap with a short fascia, finial
    o = 0.45
    hip_roof(mb, cx - h3 - o, cx + h3 + o, yc - h3 - o, yc + h3 + o, Z_T3, Z_TCAP, 'roof',
             C_TILE, fascia=0.18, col_fascia=C_TILE_SH, col_soffit=shade(C_TILE_SH, SOFFIT_K),
             mat_soffit='trim')
    finial(mb, cx, yc, Z_TCAP - 0.05, Z_TFIN - Z_TCAP + 0.05, 0.18, 'trim', C_TILE_SH, n=4)


# ---------------------------------------------------------------- build
def build():
    reset()
    mats = order_mats(C_WALL, C_TILE, C_CORN)
    mb = MB()
    main_block(mb)
    pavilions(mb)
    sun_porch(mb)
    for s in (-1, 1):
        tower(mb, s * TX)
    o = mb.build('Ozark', mats, vcol=True, order=['wall', 'roof', 'trim', 'glass'])
    box_uv(o, unit=4.0)
    return o


def main():
    o = build()
    street = dict(cam_loc=(-HW - 22.0, -26.0, 1.6), target=(-1.0, 6.0, 5.5), lens=28.0)
    finish(NAME, o, TRI_BUDGET, ARGS, street,
           aerial=dict(cam_loc=(-32.0, -44.0, 26.0), target=(0.0, 8.0, 5.0), lens=35.0),
           elev=dict(cam_loc=(0.0, -80.0, 6.5), target=(0.0, 0.0, 6.5), ortho_scale=40.0),
           rear=dict(cam_loc=(32.0, 62.0, 22.0), target=(0.0, 12.0, 5.0), lens=35.0))


main()
