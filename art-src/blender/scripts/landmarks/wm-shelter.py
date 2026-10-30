"""West Mountain trail shelter (1924), at the West Mountain Summit Loop picnic
overlook, Hot Springs National Park, Arkansas -- one of the NPS rustic
shelters of native stone and logs under a shingle roof; low-poly landmark,
early-N64 look.

Run (from the repo root, one line):
    "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" -b --factory-startup
        --python art-src/blender/scripts/landmarks/wm-shelter.py -- [--no-render] [--checks]

Outputs: art-src/blender/export/wm-shelter.glb, art-src/blender/wm-shelter.blend,
         art-src/blender/renders/wm-shelter_*.png (git-ignored)

Conventions: see art-src/blender/README.md. Open-sided, so the "main front
wall line" is the front pillar line. ORIGIN = centre of the front pillar
line at grade; the long open front (toward the overlook / road) faces glTF
+Z (Blender -Y). The floor pad and eaves project to glTF z > 0. Ridge runs
along X; the gable ends face +-X.

FACTS USED:
  games/Cart Racing/research/town-content.md section 4 (NPS Scenic Drives
    & Overlooks): West Mountain Drive's Summit Loop has three overlooks; one
    has a 1924 trail shelter with picnic tables.
  hot-springs-national-park.md / visual-style-guide.md "Rustic trail
    shelters (1924)" (HMdb marker m=234366): the first shelter was built in
    May 1924 on the ridge between North and Hot Springs mountains and four
    more followed; "built using native stone and logs and were topped with
    a redwood shingle roof"; three survive.
  visual-style-guide.md recipe [inferred] and icon 21: stone pillars
    (rounded rects), log beams with ringed log-end circles, a steep shingle
    gable.

PALETTE (visual-style-guide.md P9 nps-rustic, hex est.): native stone
  #8C877C, log #5B4632, redwood shingle #8B4A33. Derived: rubble facets =
  stone x 0.90 / x 1.07 alternating round each pillar (an irregular-stone
  read without a texture); floor pad = stone x 0.85; log end grain =
  landkit C_LOGEND (log, 40 % to cream #EDE3C8); roof underside = log x
  0.70 (rowkit SOFFIT_K); shingle edge = shingle x 0.62.

ESTIMATES (the research gives materials only, no sizes):
  pillar centres 6.0 m (front) x 4.4 m (deep); pillars octagonal, 0.83 m
  across, 2.3 m high; flagstone pad 7.6 x 6.0 m, 0.15 m high
  log plates r 0.20 m along the front and back at 2.5 m; tie logs r 0.18 m
  across the ends at 2.85 m
  roof: eaves 3.0 m high, 0.8 m overhang all round, ridge 6.2 m (about a
  47 deg pitch, "steep"); board gables above the tie logs
  one picnic table with two benches inside (the overlook "has picnic
  tables"; number and placement guessed)
"""
import os
import sys

sys.dont_write_bytecode = True                      # no __pycache__ in art-src
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))          # art-src/blender/scripts
from common import *                                # noqa: E402,F401,F403
from rowkit import *                                # noqa: E402,F401,F403
from landkit import *                               # noqa: E402,F401,F403

NAME = 'wm-shelter'
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
TRI_BUDGET = 300

# ---------------------------------------------------------------- palette
C_STONE_D = shade(C_STONE, 0.90)       # derived rubble facet (darker)
C_STONE_L = shade(C_STONE, 1.07)       # derived rubble facet (lighter)
C_PAD = shade(C_STONE, 0.85)           # derived flagstone pad
C_SOFF = shade(C_LOG, SOFFIT_K)        # roof underside
C_EDGE = shade(C_SHINGLE, 0.62)        # shingle edge

# ---------------------------------------------------------------- dimensions (m)
PX, PY = 3.0, 4.4                      # pillar half-spacing (x) / depth  [est]
YC = PY / 2
PR = 0.45                              # pillar circumradius (octagon)  [est]
Z_PIL = 2.30                           # pillar tops                    [est]
Z_PLATE, R_PLATE = 2.50, 0.20          # plate logs (centre z, radius)  [est]
Z_TIE, R_TIE = 2.85, 0.18              # tie logs                       [est]
Z_EAVE, Z_RIDGE = 3.0, 6.2             # roof                           [est]
OV = 0.8                               # eave overhang                  [est]
TH = 0.18                              # roof thickness                 [est]
Y0, Y1 = -OV, PY + OV                  # eave lines
X0, X1 = -PX - OV, PX + OV             # rake lines


def z_top(y):
    """Roof top surface height at depth y."""
    t = 1.0 - abs(y - YC) / (YC - Y0)
    return Z_EAVE + (Z_RIDGE - Z_EAVE) * t


def pillars(mb):
    cbox(mb, (-PX - 0.8, -0.8, Z_SKIRT), (PX + 0.8, PY + 0.8, 0.15), 'wall', C_PAD, skip=('-z',))
    for sx in (-1, 1):
        for y in (0.0, PY):
            ngon_prism(mb, sx * PX, y, PR, Z_SKIRT, Z_PIL, 8, 'wall', C_STONE, top=True,
                       top_col=C_STONE_D, phase=math.pi / 8,
                       col_fn=lambda i: (C_STONE, C_STONE_D, C_STONE_L, C_STONE_D)[i % 4])


def logs(mb):
    e = PX + 0.55
    for y in (0.0, PY):
        log(mb, (-e, y, Z_PLATE), (e, y, Z_PLATE), R_PLATE, n=6, phase=0.0)
    for sx in (-1, 1):
        log(mb, (sx * PX, -0.55, Z_TIE), (sx * PX, PY + 0.55, Z_TIE), R_TIE, n=6, phase=0.0)


def roof(mb):
    r = Vector((0, 0, -TH))
    ridge0, ridge1 = Vector((X0, YC, Z_RIDGE)), Vector((X1, YC, Z_RIDGE))
    for ye, sgn in ((Y0, -1), (Y1, 1)):
        e0, e1 = Vector((X0, ye, Z_EAVE)), Vector((X1, ye, Z_EAVE))
        mb.poly([e0, e1, ridge1, ridge0], 'roof', C_SHINGLE, out=(0, sgn, 1))
        mb.poly([e0 + r, e1 + r, ridge1 + r, ridge0 + r], 'trim', C_SOFF, out=(0, -sgn * 0.3, -1))
        mb.poly([e0 + r, e1 + r, e1, e0], 'roof', C_EDGE, out=(0, sgn, 0))        # eave edge
        for x, sx in ((X0, -1), (X1, 1)):                                          # rake edges
            a, b = Vector((x, ye, Z_EAVE)), Vector((x, YC, Z_RIDGE))
            mb.poly([a + r, b + r, b, a], 'roof', C_EDGE, out=(sx, 0, 0))
    # board gables above the tie logs (outer and inner faces)
    for sx in (-1, 1):
        x = sx * PX
        zb = Z_TIE + R_TIE * 0.6
        pts = [(x, 0.0, zb), (x, PY, zb), (x, PY, z_top(PY) - TH - 0.02),
               (x, YC, Z_RIDGE - TH - 0.02), (x, 0.0, z_top(0.0) - TH - 0.02)]
        mb.poly([Vector(p) + Vector((sx * 0.02, 0, 0)) for p in pts], 'trim', C_LOG, out=(sx, 0, 0))
        mb.poly([Vector(p) - Vector((sx * 0.02, 0, 0)) for p in pts], 'trim', C_SOFF, out=(-sx, 0, 0))


def table(mb):
    yc = YC
    cbox(mb, (-0.95, yc - 0.40, 0.70), (0.95, yc + 0.40, 0.78), 'trim', C_LOG, skip=(),
         cols={'-z': C_SOFF})
    for s in (-1, 1):
        cbox(mb, (-0.95, yc + s * 0.75 - 0.15, 0.40), (0.95, yc + s * 0.75 + 0.15, 0.46), 'trim',
             C_LOG, skip=('-z',))
    for x in (-0.7, 0.7):                              # trestle planks under top and benches
        cbox(mb, (x - 0.06, yc - 0.85, 0.15), (x + 0.06, yc + 0.85, 0.70), 'trim', C_SOFF,
             skip=('-z', '+z', '-y', '+y'))


# ---------------------------------------------------------------- build
def build():
    reset()
    mats = order_mats(C_STONE, C_SHINGLE, C_LOG)
    mb = MB()
    pillars(mb)
    logs(mb)
    roof(mb)
    table(mb)
    o = mb.build('WestMountainShelter', mats, vcol=True, order=['wall', 'roof', 'trim', 'glass'])
    box_uv(o, unit=4.0)
    return o


def main():
    o = build()
    street = dict(cam_loc=(-11.0, -13.0, 1.6), target=(0.0, 2.2, 3.0), lens=28.0)
    finish(NAME, o, TRI_BUDGET, ARGS, street,
           aerial=dict(cam_loc=(-15.0, -19.0, 13.0), target=(0.0, 2.2, 2.5), lens=35.0),
           elev=dict(cam_loc=(0.0, -60.0, 3.5), target=(0.0, 0.0, 3.5), ortho_scale=11.0),
           rear=dict(cam_loc=(13.0, 18.0, 8.0), target=(0.0, 2.2, 2.8), lens=35.0))


main()
