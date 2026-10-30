"""Buckstaff Bathhouse (1912, Frank W. Gibb and Company), 509 Central Ave,
Bathhouse Row, Hot Springs, Arkansas -- still operating; neoclassical front;
low-poly landmark, early-N64 look.

Run (from the repo root, one line):
    "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" -b --factory-startup
        --python art-src/blender/scripts/landmarks/buckstaff.py -- [--no-render] [--checks]

Outputs: art-src/blender/export/buckstaff.glb, art-src/blender/buckstaff.blend,
         art-src/blender/renders/buckstaff_*.png (git-ignored)

Conventions: see art-src/blender/README.md and fordyce.py. Origin = front-centre
at grade on the main front wall line, here the faces of the two brick end
pavilions; the entablature is flush with them, the colonnade stands in the
recess behind. +X = south.

FACTS USED (research/ in the workspace root):
  bathhouse-row-layout.md table, row 7 (HABS AR-28 / AR-28-G, measured):
    frontage 105 ft (trivia) / ~103-106 ft (mahjong); OSM 101 x 101 ft
    3 stories + partial basement (the 3rd floor is an attic over the
    colonnade); end pavilions ~34-35 ft; central attic ~45-46 ft;
    penthouse ~48 ft
  visual-style-guide.md / bathhouse-row-and-springs.md, Buckstaff sections:
    neoclassical; brick with white stucco base, spandrels, friezes,
    cornices and parapet trim; paterae on the friezes; brass "Buckstaff
    Baths" lettering; engaged columns dividing the entrance into seven bays
    (HABS: "large Doric columns of the colonnade") with pavilions at each end
    and classical urns between the small 3rd-floor windows; flat roof
    behind cornice and parapet ("built-up roofing"); rooftop sun porches.
  Brick colour -- conflict: "cream-colored brick" (NHL, Wikipedia) vs
    "taupe brick" (NPS Buckstaff sheet) vs tan to light brown in the 1984
    HABS photo. Modelled as taupe/tan with the guide's tan #B89A6A so the
    white columns and trim separate from the walls (decision recorded in
    README). White stucco #F3EFE6, brass #C9A23F.
  Shape check (not copied): HABS colour photo 571937c (mahjong ref
    habs-buckstaff-facade-sw.jpg) and trivia photo-refs/buckstaff/.

ESTIMATES:
  frontage 104 ft (inside both HABS readings); depth 98 ft
  pavilions 22 ft wide; centre recess 1.5 m; white base to 5 ft
  six columns (seven bays), 2.5 ft diameter, 6-sided, from 5 to 27 ft;
  entablature 27-31 ft, cornice to 32 ft; pavilion cornice 28.2-30.8 ft,
  brick parapet to 34.5 ft (HABS)
  attic block 20 m deep, brick to 42.7 ft, cornice, parapet to 45.5 ft
  (HABS); penthouse 5 x 5 m to 48 ft (HABS height)
  urns as small 4-sided finials on the entablature at the column axes;
  rooftop sun porches not modelled
"""
import os
import sys

sys.dont_write_bytecode = True                      # no __pycache__ in art-src
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))          # art-src/blender/scripts
from common import *                                # noqa: E402,F401,F403
from rowkit import *                                # noqa: E402,F401,F403

NAME = 'buckstaff'
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
TRI_BUDGET = 900

# ---------------------------------------------------------------- palette
C_BRICK = hexc('#B89A6A')          # taupe/tan brick (see conflict note)
C_WHITE = C_STUCCO                 # stucco trim, columns
C_WSH = shade(C_STUCCO, 0.86)      # derived: shaded trim (cornice undersides, base)
C_RECESS = shade(C_BRICK, 0.78)    # derived: brick wall in the shaded colonnade recess

# ---------------------------------------------------------------- dimensions (m)
W = 104 * FT                       # 31.70 frontage                 [HABS 103-106]
HW = W / 2
D = 98 * FT                        # 29.87 depth                    [est]
PW = 22 * FT                       # 6.71 pavilion width            [est]
CX = HW - PW                       # 9.14 half-width of the colonnade
REC = 1.5                          # recess of the centre wall      [est]
Z_BASE = 5 * FT                    # 1.52 white base / stylobate    [est]
Z_COL = 27 * FT                    # 8.23 column tops               [est]
Z_ENT = 31 * FT                    # 9.45 entablature top           [est]
Z_ECOR = 32 * FT                   # 9.75 entablature cornice       [est]
Z_PC0, Z_PC1 = 28.2 * FT, 30.8 * FT   # 8.60 / 9.39 pavilion cornice [est]
Z_PAV = 34.5 * FT                  # 10.52 pavilion parapet         [HABS 34-35]
Z_AC0 = 42.7 * FT                  # 13.01 attic cornice bottom     [est]
Z_ATT = 45.5 * FT                  # 13.87 attic parapet            [HABS 45-46]
Z_PH = 48 * FT                     # 14.63 penthouse                [HABS ~48]
ATT_D = 20.0                       # attic block depth              [est]
COLS = [-CX + (CX * 2 / 7) * k for k in range(1, 7)]

FRONT = front_frame(0.0)
RECESS = front_frame(REC)
SOUTH = south_frame(HW)
NORTH = north_frame(-HW)
REAR = rear_frame(D)


def masses(mb):
    pav = [(Z_SKIRT, Z_BASE, 'trim', C_WHITE), (Z_BASE, Z_PC0, 'wall', C_BRICK),
           (Z_PC1, Z_PAV - 0.25, 'wall', C_BRICK), (Z_PAV - 0.25, Z_PAV, 'trim', C_WHITE)]
    # pavilion fronts and returns into the recess
    for s in (-1, 1):
        a, b = sorted([(s * HW, 0.0), (s * CX, 0.0)])
        bands(mb, a, b, (0, -1, 0), pav)
        bands(mb, (s * CX, 0.0), (s * CX, REC), (-s, 0, 0), pav[:2])
    # ends and back
    for a, b, out in (((HW, 0.0), (HW, D), (1, 0, 0)), ((HW, D), (-HW, D), (0, 1, 0)),
                      ((-HW, D), (-HW, 0.0), (-1, 0, 0))):
        bands(mb, a, b, out, pav)
    mb.poly([(-HW, 0, Z_PAV), (HW, 0, Z_PAV), (HW, D, Z_PAV), (-HW, D, Z_PAV)],
            'roof', C_FLATROOF, out=(0, 0, 1))
    # wrap-around pavilion cornice (front faces and ends)
    for s in (-1, 1):
        xa, xb = sorted([s * (HW + 0.35), s * CX])
        cbox(mb, (xa, -0.35, Z_PC0), (xb, D + 0.35, Z_PC1), 'trim', C_WHITE, skip=(),
             cols={'-z': C_WSH})
    cbox(mb, (-CX, D - 0.2, Z_PC0), (CX, D + 0.35, Z_PC1), 'trim', C_WHITE,
         skip=('-x', '+x', '-y'), cols={'-z': C_WSH})          # rear cornice, centre part
    # recessed centre wall behind the colonnade
    bands(mb, (-CX, REC), (CX, REC), (0, -1, 0),
          [(Z_SKIRT, Z_BASE, 'trim', C_WSH), (Z_BASE, Z_COL, 'wall', C_RECESS)])
    # attic block over the colonnade
    banded_box(mb, -CX, CX, REC, REC + ATT_D,
               [(Z_ECOR - 0.1, Z_AC0, 'wall', C_BRICK), (Z_AC0, Z_AC0 + 0.4, 'trim', C_WHITE),
                (Z_AC0 + 0.4, Z_ATT - 0.2, 'wall', C_BRICK), (Z_ATT - 0.2, Z_ATT, 'trim', C_WHITE)],
               faces=('-y', '+x', '-x', '+y'))
    mb.poly([(-CX, REC, Z_ATT), (CX, REC, Z_ATT), (CX, REC + ATT_D, Z_ATT), (-CX, REC + ATT_D, Z_ATT)],
            'roof', C_FLATROOF, out=(0, 0, 1))
    cbox(mb, (-CX - 0.3, REC - 0.3, Z_AC0), (CX + 0.3, REC + ATT_D + 0.3, Z_AC0 + 0.4), 'trim',
         C_WHITE, skip=('+z',), cols={'-z': C_WSH})
    body(mb, -2.5, 2.5, 9.0, 14.0, Z_ATT - 0.2, Z_PH, 'wall', C_BRICK,
         cols={'+z': C_FLATROOF})


def colonnade(mb):
    # podium / stylobate in front of the recess, steps in the centre bays
    cbox(mb, (-CX, -0.2, Z_SKIRT), (CX, REC, Z_BASE), 'trim', C_WHITE, skip=('-z', '+y'),
         cols={'+z': C_WSH})
    cbox(mb, (-3.2, -1.6, Z_SKIRT), (3.2, -0.2, Z_BASE * 0.5), 'trim', C_WHITE,
         skip=('-z', '+y'), cols={'+z': C_WSH})
    for x in COLS:
        column(mb, x, 0.55, 0.38, Z_BASE, Z_COL, 'trim', C_WHITE, n=6, cap=0.30, base=0.22)
    # entablature flush with the pavilion faces: frieze with brass letters
    fbox(mb, RECESS, -CX, CX, Z_COL, Z_ENT, 0.0, REC, 'trim', C_WHITE, skip=('back', 'left', 'right'),
         cols={'bottom': C_WSH})
    cbox(mb, (-CX, -0.3, Z_ENT), (CX, REC, Z_ECOR), 'trim', C_WHITE, skip=('+y', '-x', '+x'),
         cols={'+z': C_WSH, '-z': C_WSH})
    for i, x in enumerate(spaced(13, 0.52)):
        if i == 6:
            continue                                   # the hyphen gap of BUCKSTAFF-BATHS
        wrect(mb, FRONT, x - 0.19, x + 0.19, 8.55, 8.95, 'trim', C_BRASS, 0.04)
    for x in (-6.4, -5.0, 5.0, 6.4):                   # paterae either side
        wpoly(mb, FRONT, star_uv(x, 8.75, 0.24, 0.22, 3, math.pi / 6), 'trim', C_WSH, 0.04)
    # windows between the columns (two floors) with white spandrels
    for i in range(7):
        x = -CX + (CX * 2 / 7) * (i + 0.5)
        window(mb, RECESS, x, 1.5, 2.2, 4.1, C_WINDOW, d=0.06)
        wrect(mb, RECESS, x - 0.95, x + 0.95, 4.35, 4.95, 'trim', C_WSH, 0.04)
        window(mb, RECESS, x, 1.5, 5.2, 7.4, C_WINDOW, d=0.06)
        # attic windows with urns between them
        window(mb, front_frame(REC), x, 1.0, 10.6, 12.2, C_WINDOW, d=0.06)
    for x in COLS:
        finial(mb, x, 0.3, Z_ECOR, 0.95, 0.30, 'trim', C_WHITE, n=4)


def pavilion_windows(mb):
    for s in (-1, 1):
        uc = s * (CX + PW / 2)
        window(mb, FRONT, uc, 1.6, 2.0, 4.0, C_WINDOW, arch=3, d=0.07)
        wrect(mb, FRONT, uc - 1.05, uc + 1.05, 4.4, 4.9, 'trim', C_WHITE, 0.04)
        window(mb, FRONT, uc, 1.6, 5.3, 7.5, C_WINDOW, d=0.07)
        fr = SOUTH if s > 0 else NORTH
        for y in (3.4, 8.4, 13.4, 18.4, 23.4, 27.4):
            u = s * y
            window(mb, fr, u, 1.0, 5.4, 7.3, C_WINDOW, d=0.07)
            window(mb, fr, u, 1.0, 2.2, 4.0, C_WINDOW, arch=3 if y < 6 else 0, d=0.07)
    for x in (-12.0, -6.0, 0.0, 6.0, 12.0):
        window(mb, REAR, -x, 1.1, 5.4, 7.3, C_WINDOW, d=0.06)


# ---------------------------------------------------------------- build
def build():
    reset()
    mats = order_mats(C_BRICK, C_FLATROOF, C_WHITE)
    mb = MB()
    masses(mb)
    colonnade(mb)
    pavilion_windows(mb)
    o = mb.build('Buckstaff', mats, vcol=True, order=['wall', 'roof', 'trim', 'glass'])
    box_uv(o, unit=4.0)
    return o


def main():
    o = build()
    street = dict(cam_loc=(-HW - 21.0, -25.0, 1.6), target=(-1.0, 6.0, 6.5), lens=28.0)
    finish(NAME, o, TRI_BUDGET, ARGS, street,
           aerial=dict(cam_loc=(-32.0, -42.0, 28.0), target=(0.0, 9.0, 6.0), lens=35.0),
           elev=dict(cam_loc=(0.0, -80.0, 7.5), target=(0.0, 0.0, 7.5), ortho_scale=38.0),
           rear=dict(cam_loc=(32.0, 64.0, 24.0), target=(0.0, 12.0, 6.0), lens=35.0))


main()
