"""Superior Bathhouse (1916, Harry C. Schwebke), 329 Central Ave, Bathhouse Row,
Hot Springs, Arkansas -- northernmost bathhouse; low-poly landmark, early-N64 look.

Run (from the repo root, one line):
    "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" -b --factory-startup
        --python art-src/blender/scripts/landmarks/superior.py -- [--no-render] [--checks]

Outputs: art-src/blender/export/superior.glb, art-src/blender/superior.blend,
         art-src/blender/renders/superior_*.png (git-ignored)

Conventions: see art-src/blender/README.md and fordyce.py. Origin = front-centre
at grade on the main front wall line, here the two-storey wall BEHIND the
one-storey sun porch (the porch projects to glTF z > 0). +X = south.

FACTS USED (research/ in the workspace root):
  bathhouse-row-layout.md table, row 1 (HABS AR-28 / AR-28-A, measured):
    frontage 89 ft (trivia) / ~86-89 ft (mahjong); OSM 82 x 110 ft, L-plan
    2 stories + basement; 1-story sun porch in front
    flat cornice ~30-31 ft; chimney ~40 ft
  bathhouse-row-and-springs.md / visual-style-guide.md, Superior sections:
    eclectic commercial style of Classical Revival origin; flat roofs behind
    brick parapets; brick pilasters with patterned insets; green tile
    medallions (paterae) centred over the pilasters in the friezes below
    BOTH cornices (NHL via mahjong facades note); projecting sheet-metal
    cornice (HABS); "SUPERIOR BATHS" over a triple-door centre entrance.
  Hexes: visual-style-guide.md Superior: pilaster brick #B5654A, painted
    tile/trim #E6D7B5, green medallion #4E7D5B, marble #F2EFE8.
  Shape/colour check (not copied): HABS AR-28-A B&W photos 4 and 6 (1984)
    and Highsmith 2020 (LC-DIG-highsm-64946), local copies in
    games/trivia/art-src/photo-refs/superior/ -- red brick walls with
    white-cream cornices and green window frames, so the brick hex is used
    for the whole wall field and the cream for cornices, friezes and base
    (the guide's "painted tile body #E6D7B5" reads as the trim, not the wall).

ESTIMATES:
  frontage 88 ft (inside both HABS readings); main block depth 70 ft (the
  OSM 110 ft includes the porch and an L-shaped rear wing, not modelled)
  sun porch 12 ft deep, full width, floor 3 ft, cornice top 16 ft
  main cornice 27.7-29.4 ft, parapet coping 30.5 ft (HABS ~30-31)
  seven bays (eight pilasters incl. corners); window sizes
  chimney 1.3 m square at the rear north quarter, top 40 ft (HABS height)
  green window frames (2020 photo; colour = the guide's green tile hex)
"""
import os
import sys

sys.dont_write_bytecode = True                      # no __pycache__ in art-src
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))          # art-src/blender/scripts
from common import *                                # noqa: E402,F401,F403
from rowkit import *                                # noqa: E402,F401,F403

NAME = 'superior'
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
TRI_BUDGET = 900

# ---------------------------------------------------------------- palette
C_BRICK = C_RBRICK                 # #B5654A pilaster / wall brick
C_TRIM = C_CREAM                   # #E6D7B5 cornices, friezes, base
C_MED = C_GREEN                    # #4E7D5B tile medallions, window frames
C_BASE = shade(C_CREAM, 0.88)      # derived: concrete base, a shade darker than the trim
C_PIER = shade(C_BRICK, 0.90)      # derived: pilaster faces a touch darker than the field
C_SIGN = C_IRON                    # dark bronze letters read as a dark strip

# ---------------------------------------------------------------- dimensions (m)
W = 88 * FT                        # 26.82 frontage                 [HABS 86-89, est 88]
HW = W / 2
D = 70 * FT                        # 21.34 main block depth         [est]
PD = 12 * FT                       # 3.66 sun-porch depth           [est]
Z_PFLOOR = 3 * FT                  # 0.91 porch floor               [est]
Z_PFRIEZE = 4.25
Z_PTOP = 16 * FT                   # 4.88 porch cornice top         [est]
Z_FRIEZE = 7.90                    # upper frieze bottom            [est]
Z_C0 = 27.7 * FT                   # 8.44 main cornice bottom       [est]
Z_C1 = 29.4 * FT                   # 8.96 main cornice top          [est]
Z_TOP = 30.5 * FT                  # 9.30 parapet coping            [HABS ~30-31]
Z_CHIM = 40 * FT                   # 12.19 chimney top              [HABS ~40]
NB = 7                             # bays                           [est]
BAY = W / NB
PIL = [-HW + i * BAY for i in range(NB + 1)]       # pilaster axes
BAYC = spaced(NB, BAY)                             # bay centres

FRONT = front_frame(0.0)
PFRONT = front_frame(-PD)
SOUTH = south_frame(HW)
NORTH = north_frame(-HW)
REAR = rear_frame(D)


def walls(mb):
    # main block: brick field, cream frieze, the parapet above the cornice
    spec = [(Z_SKIRT, Z_PTOP, 'trim', C_BASE), (Z_PTOP, Z_FRIEZE, 'wall', C_BRICK),
            (Z_FRIEZE, Z_C0, 'trim', C_TRIM), (Z_C1, Z_TOP, 'wall', C_BRICK)]
    bands(mb, (-HW, 0.0), (HW, 0.0), (0, -1, 0), spec[1:])        # front (porch hides below)
    side = [(Z_SKIRT, 0.6, 'trim', C_BASE), (0.6, Z_FRIEZE, 'wall', C_BRICK)] + spec[2:]
    for a, b, out in (((HW, 0.0), (HW, D), (1, 0, 0)), ((HW, D), (-HW, D), (0, 1, 0)),
                      ((-HW, D), (-HW, 0.0), (-1, 0, 0))):
        bands(mb, a, b, out, side)
    mb.poly([(-HW, 0, Z_TOP), (HW, 0, Z_TOP), (HW, D, Z_TOP), (-HW, D, Z_TOP)],
            'roof', C_FLATROOF, out=(0, 0, 1))
    # projecting sheet-metal main cornice
    cbox(mb, (-HW - 0.45, -0.45, Z_C0), (HW + 0.45, D + 0.45, Z_C1), 'trim', C_TRIM,
         skip=(), cols={'-z': shade(C_TRIM, 0.6), '+z': shade(C_TRIM, 0.85)})


def porch(mb):
    y0 = -PD
    pspec = [(Z_SKIRT, Z_PFLOOR, 'trim', C_BASE), (Z_PFLOOR, Z_PFRIEZE, 'wall', C_BRICK),
             (Z_PFRIEZE, Z_PTOP - 0.35, 'trim', C_TRIM)]
    banded_box(mb, -HW, HW, y0, 0.0, pspec, faces=('-y', '+x', '-x'))
    mb.poly([(-HW, y0, Z_PTOP), (HW, y0, Z_PTOP), (HW, 0, Z_PTOP), (-HW, 0, Z_PTOP)],
            'roof', C_FLATROOF, out=(0, 0, 1))
    # porch cornice
    cbox(mb, (-HW - 0.3, y0 - 0.35, Z_PTOP - 0.35), (HW + 0.3, 0.0, Z_PTOP), 'trim', C_TRIM,
         skip=('+y',), cols={'-z': shade(C_TRIM, 0.6), '+z': shade(C_TRIM, 0.85)})
    # brick piers between the big sun-porch windows
    for x in PIL:
        u0, u1 = max(-HW, x - 0.42), min(HW, x + 0.42)
        fbox(mb, PFRONT, u0, u1, Z_PFLOOR, Z_PFRIEZE, 0.0, 0.12, 'wall', C_PIER,
             skip=('back', 'bottom', 'top'))
    for i, u in enumerate(BAYC):
        if i == NB // 2:                               # triple-door entrance
            wrect(mb, PFRONT, u - 1.45, u + 1.45, Z_PFLOOR, 3.55, 'trim', C_MED, 0.04)
            for k in (-1, 0, 1):
                window(mb, PFRONT, u + k * 0.92, 0.78, Z_PFLOOR, 3.35, C_WINDOW, d=0.08, dark=0.5)
            wrect(mb, PFRONT, u - 1.6, u + 1.6, Z_PFRIEZE + 0.12, Z_PTOP - 0.47, 'trim', C_SIGN, 0.03)
        else:
            wrect(mb, PFRONT, u - 1.38, u + 1.38, 1.30, 3.70, 'trim', C_MED, 0.04)
            window(mb, PFRONT, u, 2.5, 1.42, 3.58, C_WINDOW, d=0.08)
    # end faces of the porch: one window each
    for fr, s in ((SOUTH, 1), (NORTH, -1)):
        u = s * (-PD / 2)
        wrect(mb, fr, u - 1.0, u + 1.0, 1.30, 3.70, 'trim', C_MED, 0.04)
        window(mb, fr, u, 1.75, 1.42, 3.58, C_WINDOW, d=0.08)
    # steps to the centre door
    cbox(mb, (-2.0, y0 - 1.2, Z_SKIRT), (2.0, y0, Z_PFLOOR * 0.5), 'trim', C_BASE,
         skip=('+y', '-z'))


def medallions(mb, fr, us, v):
    """Green tile paterae centred over the pilasters (4-tri octagon-ish)."""
    for u in us:
        wpoly(mb, fr, star_uv(u, v, 0.26, 0.26 * 0.92, 3, math.pi / 6), 'trim', C_MED, 0.05)


def upper(mb):
    # pilasters with medallions in the frieze above each
    for x in PIL:
        u0, u1 = max(-HW, x - 0.36), min(HW, x + 0.36)
        fbox(mb, FRONT, u0, u1, Z_PTOP, Z_FRIEZE, 0.0, 0.14, 'wall', C_PIER,
             skip=('back', 'bottom'), cols={'top': C_TRIM})
    medallions(mb, FRONT, PIL[1:-1], (Z_FRIEZE + Z_C0) / 2)
    medallions(mb, PFRONT, PIL[1:-1], (Z_PFRIEZE + Z_PTOP - 0.35) / 2)
    # paired upper windows with green frames
    for u in BAYC:
        wrect(mb, FRONT, u - 1.22, u + 1.22, 5.55, 7.50, 'trim', C_MED, 0.04)
        for k in (-1, 1):
            window(mb, FRONT, u + k * 0.56, 0.95, 5.65, 7.40, C_WINDOW, d=0.08)
    # sides and rear
    for fr, s in ((SOUTH, 1), (NORTH, -1)):
        for y in (3.4, 8.3, 13.2, 18.1):
            u = s * y
            wrect(mb, fr, u - 0.75, u + 0.75, 5.55, 7.50, 'trim', C_MED, 0.04)
            window(mb, fr, u, 1.3, 5.65, 7.40, C_WINDOW, d=0.08)
            window(mb, fr, u, 1.3, 1.6, 3.6, C_WINDOW, d=0.06)
    for x in (-9.0, -3.0, 3.0, 9.0):
        window(mb, REAR, -x, 1.3, 5.65, 7.40, C_WINDOW, d=0.06)
        window(mb, REAR, -x, 1.3, 1.6, 3.6, C_WINDOW, d=0.06)


def chimney(mb):
    cbox(mb, (-9.3, D - 3.6, Z_TOP - 0.2), (-8.0, D - 2.3, Z_CHIM), 'wall', C_BRICK,
         skip=('-z',), cols={'+z': C_IRON})


# ---------------------------------------------------------------- build
def build():
    reset()
    mats = order_mats(C_BRICK, C_FLATROOF, C_TRIM)
    mb = MB()
    walls(mb)
    porch(mb)
    upper(mb)
    chimney(mb)
    o = mb.build('Superior', mats, vcol=True, order=['wall', 'roof', 'trim', 'glass'])
    box_uv(o, unit=4.0)
    return o


def main():
    o = build()
    street = dict(cam_loc=(-HW - 21.0, -24.0, 1.6), target=(-1.0, 6.0, 5.0), lens=28.0)
    finish(NAME, o, TRI_BUDGET, ARGS, street,
           aerial=dict(cam_loc=(-30.0, -40.0, 24.0), target=(0.0, 8.0, 4.0), lens=35.0),
           elev=dict(cam_loc=(0.0, -80.0, 6.0), target=(0.0, 0.0, 6.0), ortho_scale=34.0),
           rear=dict(cam_loc=(28.0, 55.0, 20.0), target=(0.0, 10.0, 4.0), lens=35.0))


main()
