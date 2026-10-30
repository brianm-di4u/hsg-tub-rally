"""Medical Arts Building (begun Dec. 1, 1929, finished 1930; Almand & Stuck of
Little Rock), 236 Central Ave, Hot Springs, Arkansas -- 16-storey Art Deco
limestone setback tower, the tallest building downtown (Arkansas's tallest
1930-1960); low-poly landmark, early-N64 look.

Run (from the repo root, one line):
    "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" -b --factory-startup
        --python art-src/blender/scripts/landmarks/medical-arts.py -- [--no-render] [--checks]

Outputs: art-src/blender/export/medical-arts.glb, art-src/blender/medical-arts.blend,
         art-src/blender/renders/medical-arts_*.png (git-ignored)

Conventions: see art-src/blender/README.md. ORIGIN = front-centre at grade
on the Central Ave wall line; the Central Ave facade faces glTF +Z (Blender
-Y); the piers project to glTF z > 0; the body runs back to glTF z < 0. +X
is to the right of a viewer facing the building.

FACTS USED (research/ in the workspace root):
  downtown-and-landmarks.md "Tall buildings" and visual-style-guide.md
    "Medical Arts Building (1929-30)": 236 Central Ave (34.516389,
    -93.053889; NRHP 1978); sixteen stories; Art Deco by Almand & Stuck;
    begun Dec. 1, 1929 on the old Rector Bath House site ($375,000);
    bas-relief limestone carvings on the frieze and main entrance and
    bronze grillework above the doors (Encyclopedia of Arkansas); tallest
    building in Arkansas 1930-1960 (EoA; Wikipedia gives 1929 as the build
    year -- conflict noted in the research).
  visual-style-guide.md drawing recipe [inferred]: tall slab narrowing in
    2-3 setbacks, vertical piers as thin light stripes, a fan/sunburst
    relief over the door (Motif 6), a bronze grille square above each door.
  Hexes (visual-style-guide.md, est.): limestone #D8CFBD, bronze #7C5A2E,
    gold highlight #D4AF37.

PALETTE derived (documented): cornice / parapet copings = limestone x 0.86;
  spandrel panels = bronze, sRGB lerp 35 % to wrought iron #1F2A24 (dark
  panels between the floors, so each bay reads as one continuous dark
  strip between light piers, as the recipe asks; the spandrel material is
  an estimate); glass = rowkit C_WINDOW; flat roofs = rowkit C_FLATROOF.

ESTIMATES (the research gives the storey count only):
  frontage 24 m, depth 16 m (a slab broadside to Central Ave)
  ground storey 6.0 m (lobby / shop fronts, room for the door, grille and
  fan), upper floors 3.25 m -> 16th-floor roof at 54.75 m
  setbacks: shaft to floor 13 (45.0 m, parapet 46.0 m); floors 14-15 set
  back 2 m at the sides and front (to 51.5 m, parapet 52.3 m); floor 16 a
  13 x 9 m block (to 54.75 m, parapet 55.5 m); Deco crown block 7 x 5.5 m
  to 57.9 m with a 4.4 m top step to 58.9 m (about 193 ft overall)
  7 bays on Central Ave, 4 on the sides, 6 plain bays at the rear; 8 front
  piers 0.8 m wide and 0.3 m proud, rising 1 m above the shaft parapet
  door 2.4 x 3.2 m, bronze grille square 3.3-4.6 m, fan relief r 1.2 m
  above it, six shop-front bays either side of the entrance
"""
import os
import sys

sys.dont_write_bytecode = True                      # no __pycache__ in art-src
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))          # art-src/blender/scripts
from common import *                                # noqa: E402,F401,F403
from rowkit import *                                # noqa: E402,F401,F403
from landkit import *                               # noqa: E402,F401,F403

NAME = 'medical-arts'
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
TRI_BUDGET = 600

# ---------------------------------------------------------------- palette
C_WALL = C_LIME
C_COPE = shade(C_LIME, 0.86)           # derived: cornices, parapet copings
C_SPAND = mix(C_BRONZE, C_IRON, 0.35)  # derived: spandrel panels

# ---------------------------------------------------------------- dimensions (m)
HW, D = 12.0, 16.0                     # half frontage / depth          [est]
Z_G = 6.0                              # ground storey top              [est]
FL = 3.25                              # upper floor height             [est]
Z13 = Z_G + 12 * FL                    # 45.00 shaft roof (floor 13)
Z15 = Z_G + 14 * FL                    # 51.50 setback 1 roof
Z16 = Z_G + 15 * FL                    # 54.75 setback 2 roof (floor 16)
PAR = 1.0                              # shaft parapet                  [est]
S1 = (-10.0, 10.0, 2.0, 15.0)          # setback 1 x0, x1, y0, y1       [est]
S2 = (-6.5, 6.5, 3.5, 12.5)            # setback 2                      [est]
CR = (-3.5, 3.5, 4.5, 10.0)            # crown block                    [est]
Z_CR, Z_TOP = 57.9, 58.9               # crown / top step               [est]
BAYS = spaced(7, 3.2)                  # front bay centres              [est]
PIERS = [-11.2] + [(a + b) / 2 for a, b in zip(BAYS[:-1], BAYS[1:])] + [11.2]
SBAYS = spaced(4, 3.4, D / 2)          # side bay centres (y)
SPIERS = [1.2] + [(a + b) / 2 for a, b in zip(SBAYS[:-1], SBAYS[1:])] + [D - 1.2]

FRONT = front_frame(0.0)
REAR = rear_frame(D)
SOUTH = south_frame(HW)
NORTH = north_frame(-HW)


def fl(n, z0, sill=0.8, head=2.55):
    return floors(n, z0, FL, sill, head)


def tier(mb, x0, x1, y0, y1, z0, z1, par):
    """Setback block: limestone walls, coping band, flat roof."""
    banded_box(mb, x0, x1, y0, y1, [(z0 - 0.3, z1, 'wall', C_WALL), (z1, z1 + par, 'trim', C_COPE)])
    mb.poly([(x0, y0, z1 + par), (x1, y0, z1 + par), (x1, y1, z1 + par), (x0, y1, z1 + par)],
            'roof', C_FLATROOF, out=(0, 0, 1))


def shaft(mb):
    banded_box(mb, -HW, HW, 0.0, D, [(Z_SKIRT, Z_G - 0.4, 'wall', C_WALL),
                                     (Z_G - 0.4, Z_G + 0.3, 'trim', C_COPE),
                                     (Z_G + 0.3, Z13, 'wall', C_WALL),
                                     (Z13, Z13 + PAR, 'trim', C_COPE)])
    mb.poly([(-HW, 0, Z13 + PAR), (HW, 0, Z13 + PAR), (HW, D, Z13 + PAR), (-HW, D, Z13 + PAR)],
            'roof', C_FLATROOF, out=(0, 0, 1))
    up = fl(12, Z_G)
    # Central Ave: glass strip per bay, bronze-toned spandrels, light piers
    grid(mb, FRONT, -HW + 0.4, HW - 0.4, BAYS, up, w=2.4, wall_col=C_SPAND, band_mat='trim')
    for u in PIERS:
        fbox(mb, FRONT, u - 0.4, u + 0.4, Z_G + 0.3, Z13 + PAR + 1.0, 0.0, 0.3, 'wall', C_WALL,
             skip=('back', 'bottom'), cols={'top': C_COPE})
    # sides: same treatment, 4 bays
    for fr, s in ((SOUTH, 1), (NORTH, -1)):
        us = [s * y for y in SBAYS]
        u0, u1 = sorted([s * 0.4, s * (D - 0.4)])
        grid(mb, fr, u0, u1, us, up, w=2.4, wall_col=C_SPAND, band_mat='trim')
        for y in SPIERS:
            u = s * y
            fbox(mb, fr, u - 0.4, u + 0.4, Z_G + 0.3, Z13 + PAR, 0.0, 0.25, 'wall', C_WALL,
                 skip=('back', 'bottom', 'top'))
    # rear: plain grid
    grid(mb, REAR, -HW + 0.6, HW - 0.6, spaced(6, 3.6), up, w=1.6, wall_col=C_WALL)


def setbacks(mb):
    x0, x1, y0, y1 = S1
    tier(mb, x0, x1, y0, y1, Z13 + PAR, Z15, 0.8)
    up = fl(2, Z13 + PAR - 0.3)
    grid(mb, front_frame(y0), x0 + 0.4, x1 - 0.4, spaced(5, 3.2), up, w=2.4, wall_col=C_SPAND,
         band_mat='trim')
    for fr, s in ((south_frame(x1), 1), (north_frame(x0), -1)):
        u0, u1 = sorted([s * (y0 + 0.4), s * (y1 - 0.4)])
        grid(mb, fr, u0, u1, [s * y for y in spaced(3, 3.4, (y0 + y1) / 2)], up, w=2.0,
             wall_col=C_SPAND, band_mat='trim')
    grid(mb, rear_frame(y1), -x1 + 0.6, -x0 - 0.6, spaced(4, 3.6), up, w=1.6, wall_col=C_WALL)
    x0, x1, y0, y1 = S2
    tier(mb, x0, x1, y0, y1, Z15 + 0.8, Z16, 0.75)
    one = [(Z15 + 0.8 + 0.4, Z16 - 0.5)]
    for u in spaced(3, 3.2):
        window(mb, front_frame(y0), u, 2.2, one[0][0], one[0][1], C_WINDOW, d=0.07, dark=0.75)
        window(mb, rear_frame(y1), u, 1.6, one[0][0], one[0][1], C_WINDOW, d=0.07, dark=0.75)
    for fr, s in ((south_frame(x1), 1), (north_frame(x0), -1)):
        for y in spaced(2, 3.4, (y0 + y1) / 2):
            window(mb, fr, s * y, 2.0, one[0][0], one[0][1], C_WINDOW, d=0.07, dark=0.75)
    # Deco crown: block with three tall dark slots a side (front/back), top step
    x0, x1, y0, y1 = CR
    cbox(mb, (x0, y0, Z16 + 0.4), (x1, y1, Z_CR), 'wall', C_WALL, skip=('-z',),
         cols={'+z': C_FLATROOF})
    for u in (-1.6, 0.0, 1.6):
        window(mb, front_frame(y0), u, 0.6, Z16 + 1.4, Z_CR - 0.5, C_WINDOW, d=0.05, dark=0.7)
    for fr, s in ((south_frame(x1), 1), (north_frame(x0), -1)):
        window(mb, fr, s * (y0 + y1) / 2, 0.6, Z16 + 1.4, Z_CR - 0.5, C_WINDOW, d=0.05, dark=0.7)
    cbox(mb, (-2.2, y0 + 0.8, Z_CR), (2.2, y1 - 0.8, Z_TOP), 'trim', C_COPE, skip=('-z',),
         cols={'+z': C_FLATROOF})


def entrance(mb):
    # shop fronts either side, bronze-framed
    for u in BAYS:
        if abs(u) < 0.1:
            continue
        wrect(mb, FRONT, u - 1.35, u + 1.35, 0.3, 4.5, 'trim', C_BRONZE, 0.05)
        window(mb, FRONT, u, 2.4, 0.5, 4.3, C_WINDOW, d=0.08, dark=0.6)
    # main door, bronze grille square above it, fan (sunburst) relief over that
    wrect(mb, FRONT, -1.45, 1.45, 0.0, 4.75, 'trim', C_COPE, 0.04)
    window(mb, FRONT, 0.0, 2.4, 0.0, 3.2, C_WINDOW, d=0.08, dark=0.5)
    wrect(mb, FRONT, -1.2, 1.2, 3.3, 4.6, 'glass', C_BRONZE, 0.08)
    for u in (-0.6, 0.0, 0.6):
        wrect(mb, FRONT, u - 0.06, u + 0.06, 3.35, 4.55, 'trim', C_GOLD, 0.10)
    for k, tri in enumerate(fan_uv(0.0, 4.7, 1.2, 7)):
        wpoly(mb, FRONT, tri, 'trim', C_GOLD if k % 2 == 0 else C_COPE, 0.06)
    # side ground-floor windows
    for fr, s in ((SOUTH, 1), (NORTH, -1)):
        for y in SBAYS[1:]:
            window(mb, fr, s * y, 2.0, 1.0, 4.3, C_WINDOW, d=0.07, dark=0.6)


# ---------------------------------------------------------------- build
def build():
    reset()
    mats = order_mats(C_WALL, C_FLATROOF, C_COPE)
    mb = MB()
    shaft(mb)
    setbacks(mb)
    entrance(mb)
    o = mb.build('MedicalArts', mats, vcol=True, order=['wall', 'roof', 'trim', 'glass'])
    box_uv(o, unit=4.0)
    return o


def main():
    o = build()
    # kart coming up Central Ave, ~70 m off, looking up at the tower
    street = dict(cam_loc=(-38.0, -58.0, 1.6), target=(0.0, 6.0, 25.0), lens=28.0)
    finish(NAME, o, TRI_BUDGET, ARGS, street,
           aerial=dict(cam_loc=(-60.0, -85.0, 70.0), target=(0.0, 8.0, 28.0), lens=35.0),
           elev=dict(cam_loc=(0.0, -150.0, 30.0), target=(0.0, 0.0, 30.0), ortho_scale=84.0),
           rear=dict(cam_loc=(55.0, 80.0, 50.0), target=(0.0, 8.0, 28.0), lens=35.0))


main()
