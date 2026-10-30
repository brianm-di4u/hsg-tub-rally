"""The Vapors (built summer 1959, opened 1960), 315 Park Ave, Hot Springs,
Arkansas -- mid-century supper club and casino, now the Vapors Live venue;
low modern facade with a canopy. Generic mid-century look only: NO signage,
lettering or logo (content rule); low-poly landmark, early-N64 look.

Run (from the repo root, one line):
    "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" -b --factory-startup
        --python art-src/blender/scripts/landmarks/vapors.py -- [--no-render] [--checks]

Outputs: art-src/blender/export/vapors.glb, art-src/blender/vapors.blend,
         art-src/blender/renders/vapors_*.png (git-ignored)

Conventions: see art-src/blender/README.md. ORIGIN = front-centre at grade
on the Park Ave wall line; the facade faces glTF +Z (Blender -Y); the
canopy, its posts, the roof overhang and the planters project to glTF
z > 0. +X is to the right of a viewer facing the building.

FACTS USED (research/ in the workspace root):
  downtown-and-landmarks.md "Clubs and nightlife" and
    gangster-era-and-gambling.md "Revival under Faubus and The Vapors":
    315 Park Ave, on the former Phillips Drive-In site; built summer 1959
    by Dane Harris with Owney Madden (and Harry Hastings), opened 1960 with
    a coffee shop, the Monte Carlo Room, a theater restaurant with a
    retractable stage and a late-night casino; Tiffany chandeliers,
    mahogany bar (interiors); bombed Jan. 4, 1963 (30-ft roof hole); later
    Cockeyed Cowboy / Apollo Disco (1977), Tower of Strength Ministries
    (1998), Vapors Live (2017).
  games/Cart Racing/research/town-content.md section 4: Park Avenue
    Nights; the Vapors is a gangster-era landmark; neon is game styling.
  visual-style-guide.md: 1920s-40s club exteriors including the Vapors are
    "not sourced" (general knowledge or invention).
  Task brief: low modern facade with a canopy; no signage or logo.
  So the research has NO exterior description: the whole facade below is
  a generic 1959-60 supper-club composition.

PALETTE (inferred; visual-style-guide.md P7 motor-hotel, "general
  mid-century knowledge, not sourced to Hot Springs"): poured concrete
  #D9D4CA walls, turquoise #3FBFB5 fascias; stone veneer = P1 sandstone tan
  #A08A6A. Derived: soffits = concrete x 0.70 (rowkit SOFFIT_K); screen-
  block openings = rowkit C_WINDOW x 0.6; posts and mullions = rowkit
  C_IRON; glass = rowkit C_WINDOW; flat roofs = rowkit C_FLATROOF; planter
  tops = P9 oak green #4F6B35; screen-block frame = concrete x 1.04.

ESTIMATES (everything dimensional):
  front block 48 m along Park Ave x 14 m deep, walls 5.2 m, flat roof slab
  5.2-5.8 m overhanging 1.5 m at the front and 0.6 m at the sides
  showroom (theater restaurant) block behind: 34 x 32 m, 9.5 m high
  stone-veneer feature wall on the left (x -24..-8 m) with a stone blade
  rising to 7.6 m at the left end; glazed entrance (x -8..6 m) with
  mullions and dark double doors; screen-block panel on the right
  trapezoid porte-cochere canopy, 16 m wide at the wall flaring to 20 m,
  10 m deep, underside 3.9 m, 0.5 m slab, on four slender posts
  two low planters flanking the entrance
"""
import os
import sys

sys.dont_write_bytecode = True                      # no __pycache__ in art-src
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))          # art-src/blender/scripts
from common import *                                # noqa: E402,F401,F403
from rowkit import *                                # noqa: E402,F401,F403
from landkit import *                               # noqa: E402,F401,F403

NAME = 'vapors'
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
TRI_BUDGET = 400

# ---------------------------------------------------------------- palette
C_WALL = C_MC_CONC
C_FASCIA = C_MC_TURQ
C_VENEER = hexc('#A08A6A')             # P1 sandstone tan (stone veneer)
C_SOFF = shade(C_MC_CONC, SOFFIT_K)    # derived soffits
C_HOLE = shade(C_WINDOW, 0.6)          # derived screen-block openings

# ---------------------------------------------------------------- dimensions (m)
HW, D = 24.0, 14.0                     # front block half-width / depth [est]
Z_W, Z_R = 5.2, 5.8                    # wall top / roof slab top       [est]
OVF, OVS = 1.5, 0.6                    # roof overhang front / sides    [est]
SX, SY0, SY1, Z_S = 17.0, 10.0, 42.0, 9.5    # showroom block           [est]
VX0, VX1 = -24.0, -8.0                 # stone veneer section           [est]
GX0, GX1 = -8.0, 6.0                   # glazed entrance section        [est]
CW0, CW1 = (-9.0, 7.0), (-11.0, 9.0)   # canopy x at the wall / at the front edge [est]
CY, CZ0, CZ1 = -10.0, 3.9, 4.4         # canopy depth, underside, top   [est]
Z_BLADE = 7.6                          # stone blade top                [est]

FRONT = front_frame(0.0)


def masses(mb):
    cbox(mb, (-HW, 0.0, Z_SKIRT), (HW, D, Z_W), 'wall', C_WALL, skip=('-z', '+z'))
    cbox(mb, (-HW - OVS, -OVF, Z_W), (HW + OVS, D + OVS, Z_R), 'trim', C_FASCIA, skip=(),
         mats={'+z': 'roof', '-z': 'trim'}, cols={'+z': C_FLATROOF, '-z': C_SOFF})
    banded_box(mb, -SX, SX, SY0, SY1, [(Z_R - 0.3, Z_S - 0.4, 'wall', C_WALL),
                                       (Z_S - 0.4, Z_S, 'trim', C_FASCIA)])
    banded_box(mb, -SX, SX, D, SY1, [(Z_SKIRT, Z_R - 0.3, 'wall', C_WALL)], faces=('+y',))
    for x, s in ((SX, 1), (-SX, -1)):                  # showroom sides behind the front block
        a, b = ((x, D + OVS), (x, SY1)) if s > 0 else ((x, SY1), (x, D + OVS))
        vquad(mb, a, b, Z_SKIRT, Z_R - 0.3, 'wall', C_WALL, (s, 0, 0))
    mb.poly([(-SX, SY0, Z_S), (SX, SY0, Z_S), (SX, SY1, Z_S), (-SX, SY1, Z_S)], 'roof',
            C_FLATROOF, out=(0, 0, 1))


def facade(mb):
    # stone-veneer feature wall and the stone blade at the left end
    wrect(mb, FRONT, VX0, VX1, Z_SKIRT, Z_W, 'trim', C_VENEER, 0.10)
    cbox(mb, (-HW - 1.2, -0.9, Z_SKIRT), (-HW + 0.2, 0.4, Z_BLADE), 'trim', C_VENEER,
         skip=('-z',), cols={'+z': shade(C_VENEER, 0.85)})
    # glazed entrance: glass wall, mullions, dark double doors
    window(mb, FRONT, (GX0 + GX1) / 2, GX1 - GX0, 0.2, 4.7, C_WINDOW, d=0.06, dark=0.6)
    for k in range(1, 10):
        u = GX0 + (GX1 - GX0) * k / 10
        wrect(mb, FRONT, u - 0.06, u + 0.06, 0.2, 4.7, 'trim', C_IRON, 0.09)
    wrect(mb, FRONT, -2.4, 0.4, 0.0, 2.7, 'glass', shade(C_WINDOW, 0.55), 0.10)
    # screen-block panel on the right (a grid of square openings)
    sx0, sx1, sz0, sz1 = 9.0, 21.6, 1.0, 4.4
    wrect(mb, FRONT, sx0 - 0.3, sx1 + 0.3, sz0 - 0.3, sz1 + 0.3, 'trim', shade(C_WALL, 1.04), 0.06)
    nx, nz = 7, 3
    pu, pv = (sx1 - sx0) / nx, (sz1 - sz0) / nz
    for i in range(nx):
        for j in range(nz):
            u, v = sx0 + pu * (i + 0.5), sz0 + pv * (j + 0.5)
            wrect(mb, FRONT, u - pu * 0.32, u + pu * 0.32, v - pv * 0.32, v + pv * 0.32, 'glass',
                  C_HOLE, 0.09)
    # side windows (coffee shop / bar), high strips
    for fr, s in ((south_frame(HW), 1), (north_frame(-HW), -1)):
        window(mb, fr, s * 4.0, 5.0, 2.6, 4.2, C_WINDOW, d=0.07, dark=0.7)
        window(mb, fr, s * 10.0, 5.0, 2.6, 4.2, C_WINDOW, d=0.07, dark=0.7)


def canopy(mb):
    a0, a1 = CW0
    b0, b1 = CW1
    top = [Vector((a0, 0.0, CZ1)), Vector((a1, 0.0, CZ1)), Vector((b1, CY, CZ1)), Vector((b0, CY, CZ1))]
    bot = [p - Vector((0, 0, CZ1 - CZ0)) for p in top]
    mb.poly(top, 'roof', C_FLATROOF, out=(0, 0, 1))
    mb.poly(bot, 'trim', C_SOFF, out=(0, 0, -1))
    for i, j in ((1, 2), (2, 3), (3, 0)):              # front and angled sides (wall side skipped)
        out = (top[i] + top[j]) / 2 - Vector(((a0 + a1 + b0 + b1) / 4, CY / 2, CZ1))
        out.z = 0.0
        mb.poly([bot[i], bot[j], top[j], top[i]], 'trim', C_FASCIA, out=out)
    for x in (b0 + 0.6, -3.0, 1.0, b1 - 0.6):
        y = CY + 0.6
        cbox(mb, (x - 0.11, y - 0.11, Z_SKIRT), (x + 0.11, y + 0.11, CZ0), 'trim', C_IRON,
             skip=('-z', '+z'))
    # planters flanking the entrance
    for x0, x1 in ((-14.0, -10.0), (11.0, 15.0)):
        cbox(mb, (x0, -2.2, Z_SKIRT), (x1, -1.0, 0.7), 'trim', shade(C_WALL, 0.9), skip=('-z',),
             cols={'+z': hexc('#4F6B35')})


# ---------------------------------------------------------------- build
def build():
    reset()
    mats = order_mats(C_WALL, C_FLATROOF, C_FASCIA)
    mb = MB()
    masses(mb)
    facade(mb)
    canopy(mb)
    o = mb.build('Vapors', mats, vcol=True, order=['wall', 'roof', 'trim', 'glass'])
    box_uv(o, unit=4.0)
    return o


def main():
    o = build()
    # kart on Park Ave, ~45 m off
    street = dict(cam_loc=(-30.0, -36.0, 1.6), target=(0.0, 2.0, 3.5), lens=28.0)
    finish(NAME, o, TRI_BUDGET, ARGS, street,
           aerial=dict(cam_loc=(-45.0, -62.0, 40.0), target=(0.0, 12.0, 3.0), lens=35.0),
           elev=dict(cam_loc=(0.0, -120.0, 4.5), target=(0.0, 0.0, 4.5), ortho_scale=56.0),
           rear=dict(cam_loc=(50.0, 85.0, 35.0), target=(0.0, 18.0, 4.0), lens=35.0))


main()
