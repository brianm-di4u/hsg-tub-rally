"""Army and Navy Hospital, 1933 main building (later the Hot Springs
Rehabilitation Center / Arkansas Career Training Institute, vacant since
2020), 105-425 Reserve St, on the hill east of Bathhouse Row, Hot Springs,
Arkansas -- large masonry hospital with a central tower, seen from West
Mountain and from the Row; low-poly landmark, early-N64 look.

Run (from the repo root, one line):
    "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" -b --factory-startup
        --python art-src/blender/scripts/landmarks/army-navy.py -- [--no-render] [--checks]

Outputs: art-src/blender/export/army-navy.glb, art-src/blender/army-navy.blend,
         art-src/blender/renders/army-navy_*.png (git-ignored)

Conventions: see art-src/blender/README.md. ORIGIN = front-centre at grade
on the main front wall line, here the shared face line of the central tower
and the two end pavilions; the wings and central block are recessed 6 m
behind it (glTF z < 0). The front (toward the town, the Row and West
Mountain) faces glTF +Z (Blender -Y). +X is to the right of a viewer facing
the building.

FACTS USED (research/ in the workspace root):
  downtown-and-landmarks.md "Army and Navy Hospital": 105-425 Reserve St,
    34.512022, -93.050383, NRHP 2007; first joint Army-Navy hospital (1887);
    after WWI $1.5M for a 500-patient hospital; the 1933 building: seven
    stories, fireproof brick and steel, about $1.5 million (EOA) --
    conflict: a six-story centerpiece (Wikipedia). Rehabilitation center
    1960, ACTI 2009, closed 2020, empty since.
  history-timeline.md: "Army-Navy Hospital tower | 1933 | vacant from 2020".
  bathhouse-row-layout.md: Reserve St runs east from Central past the
    Army-Navy Hospital.
  games/Cart Racing/research/town-content.md section 4: the West Mountain
    Summit Loop has an overlook with views of Bathhouse Row and the former
    Army-Navy Hospital.
  Task brief: large Spanish Colonial Revival masonry hospital with a
    central tower. The style name and the tower's form are NOT in the
    research files (only "brick and steel", "seven stories" and "tower");
    the red tile roofs and arched openings follow the brief's style.

PALETTE (inferred -- the research gives no colours for this building):
  walls cream brick #E6D7B5, red clay tile #A9432C with shadow course
  #7E2F1F (visual-style-guide.md swatches, the Spanish Colonial Revival
  set used on the Row). Derived: base course and cornices = cream x 0.84;
  soffits = tile shadow x 0.70 (rowkit SOFFIT_K); belfry openings = rowkit
  C_IRON; glass = rowkit C_WINDOW.

ESTIMATES (everything dimensional; the storey count follows EOA's seven):
  floor height 3.6 m; central block 30 x 18 m, 7 floors, eave 25.6 m,
  red-tile hip to 30.0 m
  central tower 11 x 11 m, flush with the end pavilions (6 m proud of the
  block), shaft to 36.0 m, arcaded belfry stage 9.2 m square to 41.4 m,
  tile pyramid to 47.5 m, finial to 49.0 m (about 161 ft)
  wings 30 m long x 14 m deep, 6 floors, eave 22.0 m, hip to 25.5 m
  end pavilions 14 m wide x 20 m deep, 7 floors, eave 25.6 m, hip to 29.5 m
  overall frontage 118 m; round-arched ground-floor windows, plain
  rectangular windows above; a plainer rear (east) face
"""
import os
import sys

sys.dont_write_bytecode = True                      # no __pycache__ in art-src
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))          # art-src/blender/scripts
from common import *                                # noqa: E402,F401,F403
from rowkit import *                                # noqa: E402,F401,F403
from landkit import *                               # noqa: E402,F401,F403

NAME = 'army-navy'
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
TRI_BUDGET = 900

# ---------------------------------------------------------------- palette
C_WALL = C_CREAM
C_BASE = shade(C_CREAM, 0.84)          # derived: base course, cornices
C_SOFF = shade(C_TILE_SH, SOFFIT_K)    # derived: eave soffits

# ---------------------------------------------------------------- dimensions (m)
FLR = 3.6                              # floor height                   [est]
Z_WT = 1.0                             # base course (water table) top  [est]
CX, CY0, CY1 = 15.0, 6.0, 24.0         # central block half-width, front, back [est]
Z_CE, Z_CR = 25.6, 30.0                # central eave / ridge           [est]
TX, TY1 = 5.5, 11.0                    # tower half-width, back (front at y = 0) [est]
Z_TS = 36.0                            # tower shaft top                [est]
BH, Z_B1 = 4.6, 41.4                   # belfry half-width / top        [est]
Z_PY, Z_FIN = 47.5, 49.0               # pyramid apex / finial          [est]
WX1, WY1 = 45.0, 20.0                  # wing outer end x / back y      [est]
Z_WE, Z_WR = 22.0, 25.5                # wing eave / ridge              [est]
PX1, PY1 = 59.0, 20.0                  # pavilion outer x / back y      [est]
Z_PE, Z_PR = 25.6, 29.5                # pavilion eave / ridge          [est]
OV = 0.9                               # eave overhang                  [est]


def fl(n, z_top_floor_base=0.0):
    """Upper floors 2..n: (sill, head) pairs."""
    return [(i * FLR + 0.9, i * FLR + 2.7) for i in range(1, n)]


def hip(mb, x0, x1, y0, y1, ze, zr):
    hip_roof(mb, x0 - OV, x1 + OV, y0 - OV, y1 + OV, ze, zr, 'roof', C_TILE, fascia=0.3,
             col_fascia=C_TILE_SH, col_soffit=C_SOFF, mat_soffit='trim')


def arches(mb, fr, us, w=2.0, top=3.4):
    for u in us:
        window(mb, fr, u, w, Z_WT + 0.2, top, C_WINDOW, arch=3, d=0.08, dark=0.55)


def central(mb):
    spec = [(Z_SKIRT, Z_WT, 'trim', C_BASE), (Z_WT, Z_CE, 'wall', C_WALL)]
    banded_box(mb, -CX, CX, CY0, CY1, spec, faces=('-y', '+y'))
    for x, sx in ((CX, 1), (-CX, -1)):                 # ends above the wing roofs
        a, b = ((x, CY0), (x, WY1)) if sx > 0 else ((x, WY1), (x, CY0))
        vquad(mb, a, b, Z_WE - 0.5, Z_CE, 'wall', C_WALL, (sx, 0, 0))
        a, b = ((x, WY1), (x, CY1)) if sx > 0 else ((x, CY1), (x, WY1))
        bands(mb, a, b, (sx, 0, 0), spec)
    hip(mb, -CX, CX, CY0, CY1, Z_CE, Z_CR)
    fr = front_frame(CY0)
    for s in (-1, 1):
        us = [s * u for u in (7.6, 10.2, 12.8)]
        u0, u1 = sorted([s * (TX + 0.2), s * (CX - 0.3)])
        grid(mb, fr, u0, u1, us, fl(7), w=1.3, wall_col=C_WALL)
        arches(mb, fr, us, w=1.8)
    grid(mb, rear_frame(CY1), -CX + 0.5, CX - 0.5, spaced(7, 3.6), fl(7), w=1.3, wall_col=C_WALL)


def tower(mb):
    spec = [(Z_SKIRT, Z_WT, 'trim', C_BASE), (Z_WT, Z_TS, 'wall', C_WALL)]
    banded_box(mb, -TX, TX, 0.0, TY1, spec, faces=('-y', '+x', '-x'))
    vquad(mb, (TX, TY1), (-TX, TY1), Z_CE, Z_TS, 'wall', C_WALL, (0, 1, 0))   # back, above the roof
    fr = front_frame(0.0)
    tfl = [(i * FLR + 0.9, i * FLR + 2.7) for i in range(1, 10)]
    grid(mb, fr, -TX + 0.4, TX - 0.4, [-2.2, 2.2], tfl, w=1.3, wall_col=C_WALL)
    for side, s in ((south_frame(TX), 1), (north_frame(-TX), -1)):
        u0, u1 = sorted([s * 0.4, s * (CY0 - 0.4)])
        grid(mb, side, u0, u1, [s * CY0 / 2], tfl, w=1.3, wall_col=C_WALL)
    # entrance: tall round arch in a shaded surround, small arched windows beside
    wpoly(mb, fr, arch_uv(0.0, 4.6, 0.0, 5.6, 3), 'trim', C_BASE, 0.04)
    window(mb, fr, 0.0, 3.6, 0.0, 5.1, C_WINDOW, arch=3, d=0.08, dark=0.5)
    # cornice, arcaded belfry, cornice, tile pyramid, finial
    cbox(mb, (-TX - 0.4, -0.4, Z_TS), (TX + 0.4, TY1 + 0.4, Z_TS + 0.45), 'trim', C_BASE, skip=(),
         cols={'-z': shade(C_BASE, 0.7)})
    yc = TY1 / 2
    z0 = Z_TS + 0.45
    cbox(mb, (-BH, yc - BH, z0), (BH, yc + BH, Z_B1), 'wall', C_WALL, skip=('-z', '+z'))
    for bfr, uc in ((front_frame(yc - BH), 0.0), (rear_frame(yc + BH), 0.0),
                    (south_frame(BH), yc), (north_frame(-BH), -yc)):
        for du in (-1.9, 1.9):
            window(mb, bfr, uc + du, 2.4, z0 + 0.5, Z_B1 - 0.6, C_IRON, arch=3, d=0.05, dark=0.85)
    cbox(mb, (-BH - 0.45, yc - BH - 0.45, Z_B1), (BH + 0.45, yc + BH + 0.45, Z_B1 + 0.4), 'trim',
         C_BASE, skip=('+z',), cols={'-z': shade(C_BASE, 0.7)})
    pyramid(mb, 0.0, yc, BH + 0.45, BH + 0.45, Z_B1 + 0.4, Z_PY, 'roof', C_TILE,
            col_side=shade(C_TILE, 0.88))
    finial(mb, 0.0, yc, Z_PY - 0.3, Z_FIN - Z_PY + 0.3, 0.28, 'trim', C_BASE, n=4)


def wings(mb):
    spec = [(Z_SKIRT, Z_WT, 'trim', C_BASE), (Z_WT, Z_WE, 'wall', C_WALL)]
    for s in (-1, 1):
        x0, x1 = sorted([s * CX, s * WX1])
        banded_box(mb, x0, x1, CY0, WY1, spec, faces=('-y', '+y'))
        hip(mb, x0, x1, CY0, WY1, Z_WE, Z_WR)
        us = [s * (CX + 2.0 + 3.6 * i) for i in range(8)]
        grid(mb, front_frame(CY0), x0 + 0.3, x1 - 0.3, us, fl(6), w=1.3, wall_col=C_WALL)
        arches(mb, front_frame(CY0), us, w=1.8)
        grid(mb, rear_frame(WY1), -x1 + 0.5, -x0 - 0.5, [-u for u in us[::2]], fl(6), w=1.3,
             wall_col=C_WALL)


def pavilions(mb):
    spec = [(Z_SKIRT, Z_WT, 'trim', C_BASE), (Z_WT, Z_PE, 'wall', C_WALL)]
    for s in (-1, 1):
        x0, x1 = sorted([s * WX1, s * PX1])
        outer = '+x' if s > 0 else '-x'
        inner = '-x' if s > 0 else '+x'
        banded_box(mb, x0, x1, 0.0, PY1, spec, faces=('-y', '+y', outer))
        # inner face only where it is not hidden by the wing (y 0..CY0)
        xi = s * WX1
        a, b = ((xi, CY0), (xi, 0.0)) if s > 0 else ((xi, 0.0), (xi, CY0))
        bands(mb, a, b, (-s, 0, 0), spec)
        vquad(mb, (xi, CY0), (xi, PY1), Z_WE - 0.5, Z_PE, 'wall', C_WALL, (-s, 0, 0))  # above the wing
        hip(mb, x0, x1, 0.0, PY1, Z_PE, Z_PR)
        uc = s * (WX1 + PX1) / 2
        us = spaced(3, 3.8, uc)
        grid(mb, front_frame(0.0), x0 + 0.3, x1 - 0.3, us, fl(7), w=1.3, wall_col=C_WALL)
        arches(mb, front_frame(0.0), us, w=1.9)
        ofr = south_frame(x1) if s > 0 else north_frame(x0)
        oys = [s * y for y in (3.0, 7.6, 12.2, 16.8)]
        u0, u1 = sorted([s * 0.4, s * (PY1 - 0.4)])
        grid(mb, ofr, u0, u1, oys, fl(7), w=1.3, wall_col=C_WALL)
        ifr = north_frame(xi) if s > 0 else south_frame(xi)
        u0, u1 = sorted([-s * 0.3, -s * (CY0 - 0.3)])
        grid(mb, ifr, u0, u1, [-s * CY0 / 2], fl(7), w=1.3, wall_col=C_WALL)


# ---------------------------------------------------------------- build
def build():
    reset()
    mats = order_mats(C_WALL, C_TILE, C_BASE)
    mb = MB()
    central(mb)
    tower(mb)
    wings(mb)
    pavilions(mb)
    o = mb.build('ArmyNavyHospital', mats, vcol=True, order=['wall', 'roof', 'trim', 'glass'])
    box_uv(o, unit=4.0)
    return o


def main():
    o = build()
    # from the slope below (the Row / Reserve St side), ~150 m off
    street = dict(cam_loc=(-85.0, -125.0, 1.6), target=(0.0, 10.0, 18.0), lens=28.0)
    finish(NAME, o, TRI_BUDGET, ARGS, street,
           aerial=dict(cam_loc=(-150.0, -210.0, 110.0), target=(0.0, 10.0, 15.0), lens=35.0),
           elev=dict(cam_loc=(0.0, -250.0, 24.0), target=(0.0, 0.0, 24.0), ortho_scale=128.0),
           rear=dict(cam_loc=(120.0, 160.0, 80.0), target=(0.0, 12.0, 15.0), lens=35.0))


main()
