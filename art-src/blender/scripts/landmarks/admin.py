"""NPS Administration Building (1936 -- conflict: 1938; NPS Eastern Division,
Branch of Plans and Design), 101 Reserve St, south end of Bathhouse Row,
Hot Springs, Arkansas -- low-poly landmark, early-N64 look.

Run (from the repo root, one line):
    "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" -b --factory-startup
        --python art-src/blender/scripts/landmarks/admin.py -- [--no-render] [--checks]

Outputs: art-src/blender/export/admin.glb, art-src/blender/admin.blend,
         art-src/blender/renders/admin_*.png (git-ignored)

Conventions: see art-src/blender/README.md and fordyce.py. ORIENTATION NOTE:
the building's entrance front faces south onto Reserve Ave ("the only
structure not facing Central Avenue", HABS). So that it drops into the Row
like the eight bathhouses, the model keeps the Row frame: its plain WEST side
(the face seen from Central Ave) faces glTF +Z, +X = south, and the
Reserve Ave entrance front faces +X. Origin = centre of the west wall at
grade.

FACTS USED (research/ in the workspace root):
  bathhouse-row-layout.md table, last row (HABS AR-28 / AR-28-I, measured):
    narrow end toward Central 42 ft (trivia) / ~45-49 ft (mahjong);
    OSM 47 x 81 ft, long axis E-W; 2 stories; eaves ~27.5 ft; hip ridge
    ~37.6 ft. Main door faces south onto Reserve Ave; plain two-storey west
    side seen from Central (HABS data pages; mahjong facades note).
  bathhouse-row-and-springs.md / visual-style-guide.md, Administration
    Building sections: Spanish Colonial Revival; stucco finish; red clay-tile
    hip roof; wrought-iron balconies on the 2nd-floor French doors; iron
    grilles on the 1st floor; a broken arched pediment over the door / a
    second-storey window; cast-concrete fountain in front (1936).
  Hexes: stucco #F3EFE6, red tile #A9432C / #7E2F1F, wrought iron #1F2A24
    (visual-style-guide.md swatches; the Admin entry lists no hexes of its
    own). Door surround: cream #E6D7B5.
  Shape check (not copied): HABS AR-28-I B&W photos 1-2 (1984, south front;
    trivia photo-refs/administration/) -- entrance bay near the west end,
    three balconied French windows to the east, low-pitched hip with deep
    eaves.

ESTIMATES:
  west face 47 ft (OSM; inside the mahjong 45-49 reading; the trivia 42 ft
  is the outlier); length 80 ft; eave overhang 2.5 ft
  entrance bay centred 6.6 m from the west corner; balcony bays at 12.7,
  16.8, 21.0 m (scaled from the HABS photo); window and door sizes
  west side: two windows per floor (HABS: "plain"); north side and east end
  windows guessed
  the 1936 fountain and the 1966 jug fountain are left out (props)
"""
import os
import sys

sys.dont_write_bytecode = True                      # no __pycache__ in art-src
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))          # art-src/blender/scripts
from common import *                                # noqa: E402,F401,F403
from rowkit import *                                # noqa: E402,F401,F403

NAME = 'admin'
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
TRI_BUDGET = 700

# ---------------------------------------------------------------- palette
C_WALL = C_STUCCO
C_SURR = C_CREAM                   # cast-stone door surround
C_BASE = shade(C_STUCCO, 0.86)     # derived: water table
C_SOFF = shade(C_TILE_SH, 0.62)    # derived: dark rafter-tail soffit [observed 1984]
C_DOOR = mix(C_TILE_SH, C_IRON, 0.5)  # derived: dark wooden door

# ---------------------------------------------------------------- dimensions (m)
W = 47 * FT                        # 14.33 west face (along X)      [OSM; HABS 45-49]
HW = W / 2
D = 80 * FT                        # 24.38 length E-W (along Y)     [OSM 81]
OVH = 2.5 * FT                     # 0.76 eave overhang             [est]
Z_BASE = 2 * FT                    # 0.61                           [est]
Z_EAVE = 27.5 * FT                 # 8.38                           [HABS ~27.5]
Z_RIDGE = 37.6 * FT                # 11.46                          [HABS ~37.6]
Z_SILL2 = 4.85                     # 2nd-floor sill / balcony floor [est]
U_DOOR = 6.6                       # entrance bay, from the west corner [est]
U_BAL = (12.7, 16.8, 21.0)         # balconied French windows       [est]

WEST = front_frame(0.0)            # faces Central Ave (glTF +Z)
SOUTH = south_frame(HW)            # Reserve Ave entrance front, u = y
NORTH = north_frame(-HW)
EAST = rear_frame(D)


def masses(mb):
    spec = [(Z_SKIRT, Z_BASE, 'trim', C_BASE), (Z_BASE, Z_EAVE, 'wall', C_WALL)]
    banded_box(mb, -HW, HW, 0.0, D, spec)
    hip_roof(mb, -HW - OVH, HW + OVH, -OVH, D + OVH, Z_EAVE, Z_RIDGE, 'roof', C_TILE,
             fascia=0.22, col_fascia=C_TILE_SH, col_soffit=C_SOFF, mat_soffit='trim')


def south_front(mb):
    u = U_DOOR
    # cast-stone surround: pilasters, entablature, upper window frame and a
    # broken arched pediment (two quarter arcs with a gap)
    for k in (-1, 1):
        fbox(mb, SOUTH, u + k * 1.25 - 0.28, u + k * 1.25 + 0.28, Z_BASE, Z_SILL2 - 0.3,
             0.0, 0.22, 'trim', C_SURR, skip=('back', 'bottom'))
    fbox(mb, SOUTH, u - 1.65, u + 1.65, Z_SILL2 - 0.5, Z_SILL2 - 0.05, 0.0, 0.30, 'trim', C_SURR,
         skip=('back',), cols={'bottom': shade(C_SURR, 0.6)})
    wrect(mb, SOUTH, u - 0.95, u + 0.95, Z_SILL2, 7.0, 'trim', C_SURR, 0.05)
    for k in (-1, 1):
        pts = [(u + k * 0.45, 7.0), (u + k * 1.25, 7.0), (u + k * 1.0, 7.62), (u + k * 0.45, 7.9)]
        wpoly(mb, SOUTH, pts if k > 0 else list(reversed(pts)), 'trim', C_SURR, 0.07)
    window(mb, SOUTH, u, 1.5, Z_BASE + 0.15, Z_SILL2 - 0.65, C_DOOR, d=0.08, dark=0.8)
    window(mb, SOUTH, u, 1.1, Z_SILL2 + 0.15, 6.85, C_WINDOW, d=0.08)
    # balconied French windows over iron-grilled ground-floor windows
    for b in U_BAL:
        window(mb, SOUTH, b, 1.15, Z_SILL2, 7.0, C_WINDOW, d=0.08)
        fbox(mb, SOUTH, b - 0.85, b + 0.85, Z_SILL2 - 0.15, Z_SILL2, 0.0, 0.55, 'trim', C_BASE,
             skip=('back',), cols={'bottom': shade(C_BASE, 0.6)})
        fbox(mb, SOUTH, b - 0.85, b + 0.85, Z_SILL2, Z_SILL2 + 0.9, 0.0, 0.55, 'glass', C_IRON,
             skip=('back', 'top', 'bottom'))
        window(mb, SOUTH, b, 1.1, 1.5, 3.2, C_WINDOW, d=0.06)
        wrect(mb, SOUTH, b - 0.68, b + 0.68, 1.4, 3.35, 'glass', C_IRON, 0.10)
    window(mb, SOUTH, 1.6, 0.9, 1.6, 3.1, C_WINDOW, d=0.06)
    wrect(mb, SOUTH, 1.6 - 0.55, 1.6 + 0.55, 1.5, 3.25, 'glass', C_IRON, 0.10)
    # steps to the entrance
    cbox(mb, (HW, u - 2.0, Z_SKIRT), (HW + 1.6, u + 2.0, Z_BASE * 0.6), 'trim', C_BASE,
         skip=('-x', '-z'))


def other_faces(mb):
    # plain west side (seen from Central): two windows per floor, grilles below
    for x in (-3.3, 3.3):
        window(mb, WEST, x, 1.1, Z_SILL2 + 0.3, 6.9, C_WINDOW, d=0.08)
        window(mb, WEST, x, 1.0, 1.6, 3.1, C_WINDOW, d=0.06)
        wrect(mb, WEST, x - 0.6, x + 0.6, 1.5, 3.25, 'glass', C_IRON, 0.10)
    for y in (4.0, 9.0, 14.0, 19.0):
        window(mb, NORTH, -y, 1.0, Z_SILL2 + 0.3, 6.9, C_WINDOW, d=0.06)
        window(mb, NORTH, -y, 1.0, 1.6, 3.1, C_WINDOW, d=0.06)
    for x in (-3.3, 3.3):
        window(mb, EAST, -x, 1.0, Z_SILL2 + 0.3, 6.9, C_WINDOW, d=0.06)
        window(mb, EAST, -x, 1.0, 1.6, 3.1, C_WINDOW, d=0.06)


# ---------------------------------------------------------------- build
def build():
    reset()
    mats = order_mats(C_WALL, C_TILE, C_SURR)
    mb = MB()
    masses(mb)
    south_front(mb)
    other_faces(mb)
    o = mb.build('Admin', mats, vcol=True, order=['wall', 'roof', 'trim', 'glass'])
    box_uv(o, unit=4.0)
    return o


def main():
    o = build()
    # kart on Central Ave south-west of the corner, seeing the west side and
    # the Reserve Ave front at 3/4
    street = dict(cam_loc=(HW + 24.0, -22.0, 1.6), target=(2.0, 8.0, 5.0), lens=28.0)
    finish(NAME, o, TRI_BUDGET, ARGS, street,
           aerial=dict(cam_loc=(36.0, -30.0, 24.0), target=(0.0, 11.0, 4.0), lens=35.0),
           elev=dict(cam_loc=(80.0, D / 2, 6.0), target=(0.0, D / 2, 6.0), ortho_scale=32.0),
           rear=dict(cam_loc=(-30.0, 50.0, 20.0), target=(0.0, 12.0, 4.0), lens=35.0))


main()
