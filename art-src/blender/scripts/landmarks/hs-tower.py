"""Hot Springs Mountain Tower (contract March 1982, opened June 3, 1983), on
the summit of Hot Springs Mountain, Hot Springs National Park, Arkansas --
216-ft lattice-steel observation tower; low-poly landmark, early-N64 look.

Run (from the repo root, one line):
    "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" -b --factory-startup
        --python art-src/blender/scripts/landmarks/hs-tower.py -- [--no-render] [--checks]

Outputs: art-src/blender/export/hs-tower.glb, art-src/blender/hs-tower.blend,
         art-src/blender/renders/hs-tower_*.png (git-ignored)

Conventions: see art-src/blender/README.md. The tower is square and
symmetric, so ORIGIN = centre of the base at grade (not a front wall line);
any face can be the "front". The glTF +Z face is the nominal front (it
carries the base door). The legs carry on 0.5 m below grade as a skirt.

FACTS USED (research/ in the workspace root):
  downtown-and-landmarks.md "Towers", other-attractions.md, hot-springs-
    national-park.md: current tower, contract March 1982, opened June 3,
    1983; 216 ft (65.8 m), lattice steel, observation deck (NPS; Wikipedia;
    MiraCosta guide). Third tower on the site (Woolman 1877, Rix 1906).
  games/Cart Racing/research/town-content.md section 4: deck 216 ft above
    the mountain, 1,256 ft above sea level (NPS Scenic Drives & Overlooks);
    ground at the tower 1,036 ft (USGS EPQS, geography-lakes-mountains.md).
    1,256 - 1,036 = 220 ft, so the deck is at the very top: the decks are
    put in the top 13 m and the 216 ft figure is used for the highest point.
  Task brief: open and enclosed observation decks near the top, elevator
    core (not in the research files; shapes below are estimates).
  visual-style-guide.md, tower table and icon 20: "tall narrow trapezoid
    lattice (zigzag cross-bracing) with a wider observation box on top";
    steel gray #8C877C est.

PALETTE: steel #8C877C (style guide est.). Derived: core cladding = steel x
  0.62 (a darker shaft so the light lattice reads in front of it); deck
  fascias = steel x 1.12 (lighter band so the deck head separates from the
  lattice); roof and floor tops = rowkit C_FLATROOF; glass = rowkit C_WINDOW
  (55 % cobalt #2B4C9B + 45 % iron #1F2A24); footings = poured concrete
  #D9D4CA (motor-hotel swatch, general concrete).

ESTIMATES (the research gives only the 216 ft height and "lattice steel
with observation deck"):
  lattice leg centres 9.2 m square at grade tapering to 5.2 m at the deck
  underside (52.6 m); legs 0.9 -> 0.7 m square (thick for readability)
  8 zigzag panels, heights 8.2 / 7.6 / 7.0 / 6.5 / 6.1 / 5.9 / 5.7 / 5.6 m
  (shrinking with the width); horizontals at the 7 inner panel joints;
  members 0.5 m (diagonals) and 0.4 m (horizontals) wide -- wider than real
  members so they survive at 320x240
  elevator/stair core 3.2 m square from grade to the roof, with a machine
  room on top to the 216 ft (65.84 m) highest point
  enclosed deck: 11.2 m square, slab 52.6-53.4 m, glass 53.4-57.0 m with
  4 mullions a side, upper fascia 57.0-57.9 m
  open deck: floor 57.9 m, solid railing to 59.0 m, 8 posts to 62.4 m,
  12 m square roof canopy 62.4-63.2 m
  concrete leg footings 1.6 m square, 0.6 m above grade
"""
import os
import sys

sys.dont_write_bytecode = True                      # no __pycache__ in art-src
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))          # art-src/blender/scripts
from common import *                                # noqa: E402,F401,F403
from rowkit import *                                # noqa: E402,F401,F403
from landkit import *                               # noqa: E402,F401,F403

NAME = 'hs-tower'
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
TRI_BUDGET = 700

# ---------------------------------------------------------------- palette
C_STEEL = C_STONE                      # #8C877C steel gray (tower recipe)
C_CORE = shade(C_STEEL, 0.62)          # derived: darker core cladding
C_FASCIA = shade(C_STEEL, 1.12)        # derived: lighter deck fascias
C_ROOFT = C_FLATROOF                   # flat roof / deck floor tops
C_FOOT = C_MC_CONC                     # poured concrete footings

# ---------------------------------------------------------------- dimensions (m)
Z_TOP = 216 * FT                       # 65.84 highest point            [NPS / Wikipedia]
Z_LAT = 52.6                           # lattice top = deck underside   [est]
B0, B1 = 4.6, 2.6                      # leg-centre half-spacing at 0 / Z_LAT [est]
R0, R1 = 0.45, 0.35                    # leg half-widths                [est]
PANELS = [8.2, 7.6, 7.0, 6.5, 6.1, 5.9, 5.7, 5.6]   # sum = Z_LAT      [est]
W_DIAG, W_HORZ = 0.50, 0.40            # member widths                  [est]
CORE = 1.6                             # core half-width                [est]
DW = 5.6                               # deck half-width                [est]
Z_SLAB, Z_GL0, Z_GL1, Z_FAS = 52.6, 53.4, 57.0, 57.9   # enclosed deck  [est]
Z_RAIL, Z_POST = 59.0, 62.4            # open deck railing / post tops  [est]
RW = 6.0                               # roof canopy half-width         [est]
Z_ROOF = 63.2                          # roof canopy top                [est]

K = (B1 - B0) / Z_LAT                  # leg-line slope (negative: tapering)


def B(z):
    return B0 + K * z


def L(sx, sy, z):
    """Leg centreline point of corner (sx, sy) at height z."""
    return (sx * B(z), sy * B(z), z)


# the four lattice faces: outward axis, and the two corners left/right as
# seen from outside
FACES = [((0, -1), (-1, -1), (1, -1)),     # glTF +Z (nominal front)
         ((1, 0), (1, -1), (1, 1)),
         ((0, 1), (1, 1), (-1, 1)),
         ((-1, 0), (-1, 1), (-1, -1))]


def lattice(mb):
    for sx, sy in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
        p0 = L(sx, sy, Z_SKIRT)
        p1 = L(sx, sy, Z_LAT)
        r0 = R0 + (R0 - R1) * (-Z_SKIRT) / Z_LAT
        leg(mb, p0, p1, r0, R1, 'trim', C_STEEL)
        # concrete footing round the leg
        x, y = sx * B(0.0), sy * B(0.0)
        cbox(mb, (x - 0.8, y - 0.8, Z_SKIRT), (x + 0.8, y + 0.8, 0.6), 'trim', C_FOOT,
             skip=('-z',))
    zs = [0.0]
    for h in PANELS:
        zs.append(zs[-1] + h)
    for fi, ((ox, oy), left, right) in enumerate(FACES):
        nrm = (ox, oy, -K)                 # outward normal of the tilted face plane
        for k in range(len(PANELS)):
            z0, z1 = zs[k], zs[k + 1]
            # zigzag: the diagonal alternates direction panel to panel; the
            # pattern is offset by one on alternate faces so corners meet
            if (k + fi) % 2 == 0:
                a, b = L(*left, z0), L(*right, z1)
            else:
                a, b = L(*right, z0), L(*left, z1)
            strut(mb, a, b, W_DIAG, nrm, 'trim', C_STEEL)
            if 0 < k:
                strut(mb, L(*left, z0), L(*right, z0), W_HORZ, nrm, 'trim', C_STEEL)


def core(mb):
    cbox(mb, (-CORE, -CORE, Z_SKIRT), (CORE, CORE, Z_POST), 'wall', C_CORE, skip=('-z', '+z'))
    # door at the base (nominal front), and the machine room above the roof
    window(mb, front_frame(-CORE), 0.0, 1.4, 0.0, 2.4, C_WINDOW, d=0.06, dark=0.6)
    cbox(mb, (-CORE, -CORE, Z_ROOF), (CORE, CORE, Z_TOP), 'wall', C_CORE, skip=('-z',),
         cols={'+z': C_ROOFT})


def decks(mb):
    # enclosed deck: slab, glass band with mullions, upper fascia
    glass = vgrad(C_WINDOW, shade(C_WINDOW, 0.6), Z_GL0, Z_GL1)   # top light, bottom dark
    banded_box(mb, -DW, DW, -DW, DW, [(Z_SLAB, Z_GL0, 'trim', C_FASCIA),
                                     (Z_GL0, Z_GL1, 'glass', glass),
                                     (Z_GL1, Z_FAS, 'trim', C_FASCIA)])
    mb.poly([(-DW, -DW, Z_SLAB), (DW, -DW, Z_SLAB), (DW, DW, Z_SLAB), (-DW, DW, Z_SLAB)],
            'trim', shade(C_STEEL, SOFFIT_K), out=(0, 0, -1))
    for fr in (front_frame(-DW), south_frame(DW), rear_frame(DW), north_frame(-DW)):
        for u in spaced(4, 2 * DW / 5):
            wrect(mb, fr, u - 0.12, u + 0.12, Z_GL0, Z_GL1, 'trim', C_FASCIA, 0.06)
    # open deck: floor, solid railing (outer and inner faces), posts
    mb.poly([(-DW, -DW, Z_FAS), (DW, -DW, Z_FAS), (DW, DW, Z_FAS), (-DW, DW, Z_FAS)],
            'roof', C_ROOFT, out=(0, 0, 1))
    banded_box(mb, -DW, DW, -DW, DW, [(Z_FAS, Z_RAIL, 'trim', C_FASCIA)])
    t = 0.15
    for a, b, out in (((-DW + t, -DW + t), (DW - t, -DW + t), (0, 1, 0)),
                      ((DW - t, -DW + t), (DW - t, DW - t), (-1, 0, 0)),
                      ((DW - t, DW - t), (-DW + t, DW - t), (0, -1, 0)),
                      ((-DW + t, DW - t), (-DW + t, -DW + t), (1, 0, 0))):
        vquad(mb, a, b, Z_FAS, Z_RAIL, 'trim', shade(C_FASCIA, 0.85), out)
    p = 0.22
    for x, y in ((-1, -1), (0, -1), (1, -1), (1, 0), (1, 1), (0, 1), (-1, 1), (-1, 0)):
        cx, cy = x * (DW - 0.3), y * (DW - 0.3)
        cbox(mb, (cx - p, cy - p, Z_RAIL), (cx + p, cy + p, Z_POST), 'trim', C_STEEL,
             skip=('-z', '+z'))
    # roof canopy
    cbox(mb, (-RW, -RW, Z_POST), (RW, RW, Z_ROOF), 'trim', C_FASCIA, skip=(),
         mats={'+z': 'roof'}, cols={'+z': C_ROOFT, '-z': shade(C_STEEL, SOFFIT_K)})


# ---------------------------------------------------------------- build
def build():
    reset()
    mats = order_mats(C_CORE, C_ROOFT, C_STEEL)
    mb = MB()
    lattice(mb)
    core(mb)
    decks(mb)
    o = mb.build('HSMountainTower', mats, vcol=True, order=['wall', 'roof', 'trim', 'glass'])
    box_uv(o, unit=4.0)
    return o


def main():
    o = build()
    # kart on the summit road ~80 m off, looking up at the tower
    street = dict(cam_loc=(-46.0, -66.0, 1.6), target=(0.0, 0.0, 31.0), lens=28.0)
    finish(NAME, o, TRI_BUDGET, ARGS, street,
           aerial=dict(cam_loc=(-70.0, -95.0, 72.0), target=(0.0, 0.0, 34.0), lens=35.0),
           elev=dict(cam_loc=(0.0, -150.0, 33.0), target=(0.0, 0.0, 33.0), ortho_scale=74.0),
           rear=dict(cam_loc=(14.0, 22.0, 50.0), target=(0.0, 0.0, 56.0), lens=28.0))


main()
