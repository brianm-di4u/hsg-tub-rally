"""Arlington Resort Hotel (third Arlington, begun Oct. 25, 1923, completed
Nov. 28, 1924; Mann & Stern, architect George Mann), 239 Central Ave at the
Central Ave / Fountain St "Y", Hot Springs, Arkansas -- the twin-towered
hotel that closes the north vista of Bathhouse Row; low-poly landmark,
early-N64 look.

Run (from the repo root, one line):
    "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" -b --factory-startup
        --python art-src/blender/scripts/landmarks/arlington.py -- [--no-render] [--checks]

Outputs: art-src/blender/export/arlington.glb, art-src/blender/arlington.blend,
         art-src/blender/renders/arlington_*.png (git-ignored)

Conventions: see art-src/blender/README.md and fordyce.py. Origin = front-centre
of the Central Ave / Fountain St facade at grade, on the main front wall line
(the faces of the two tower pavilions). The facade faces glTF +Z (Blender
-Y); the arcaded base, terrace and steps project to glTF z > 0. X runs along
the facade, +X to a viewer's right when facing the hotel (the Fountain St
side). The wings fold back on both sides.

FACTS USED (research/ in the workspace root):
  downtown-and-landmarks.md, Arlington Hotel: third Arlington 1923-24, Mann
    & Stern (George Mann), Spanish Colonial Revival, twin towers, 484 rooms;
    239 Central Ave, 34.51667, -93.05306; a $30M renovation 2023-2025
    stripped seven layers of stucco to the brick, restoring the facade
    toward its 1924 look (Arlington history page; EOA via search summary);
    roof gardens; ghost legends place rooms on the 4th, 7th and 8th floors
    (Room 824), so there are at least eight guest floors.
  bathhouse-row-layout.md section 7: it fills the wedge north of Fountain
    St and east of Central's north-west leg, facing the Central/Fountain
    junction at the "terminus of the town's most important vista"; Central
    bends ~45 deg left at Fountain St, Fountain St leaves at ~55 deg.
  visual-style-guide.md, Arlington table: wide symmetrical block with two
    taller towers with domed or pyramidal caps; arched entry; buff brick
    #E6D7B5 [inferred], red tile #A9432C.
  Shape check (not copied): Highsmith 2020 and the NPS Arlington Lawn photo
    (games/trivia/art-src/photo-refs/arlington/) -- recessed centre block
    with a red-tile hip roof and a top-floor band of blue-green tile panels;
    tower pavilions either side, the towers rising from their inner halves
    with an arched, balconied belfry stage and a small domed crown; long
    wings folding back; a two-storey arcaded base with a terrace, urns and a
    central stair.

COLOUR DECISION (stucco stripped to brick, 2023-25): the research gives no
  brick colour beyond the style guide's [inferred] buff #E6D7B5; the 2020
  photo, taken while the stucco was failing, already shows buff-tan brick in
  the wing and tower shafts with paler cream trim. The brick fields are
  therefore buff, mixed 35 % toward the guide's tan #B89A6A so the cream
  #E6D7B5 trim (base, cornices, tower crowns) still separates from them;
  verdigris #5E9C8C dome caps (they read green-grey in the lawn photo).

ESTIMATES (the research has NO height, storey count or frontage):
  floor height 3.2 m; two-storey arcaded base to 8.5 m (28 ft)
  centre block 28 m wide, recessed 5 m, 17 m deep, 9 floors over the base
  (eave 37.3 m / 122 ft; the photo counts 8-9 window rows above the
  terrace), red-tile hip to 41.3 m
  tower pavilions 12 m wide, 18 m deep, 7 floors over the base (30.9 m)
  towers 8 m square from the pavilions' inner halves; shaft to 41.8 m,
  belfry 6.4 m square to 47.0 m, octagonal crown to 50.2 m, dome to
  52.8 m, finial 54.0 m (177 ft) -- proportions scaled from the 2020 photo
  wings 50 m long, 14 m deep, 6 floors over the base (27.7 m), low hips,
  folding back 35 deg from the facade line (Central's NW leg and Fountain
  St leave the junction at roughly that angle each side)
  base 60 m wide, 15 m deep, terrace parapet 9.6 m, raised centre 10.2 m
  window grid: columns and floors as counted on the photo; drawn as one
  glass strip per column with wall-coloured spandrel bands laid over it
  (same look as single panels, a fraction of the triangles)
"""
import os
import sys

sys.dont_write_bytecode = True                      # no __pycache__ in art-src
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))          # art-src/blender/scripts
from common import *                                # noqa: E402,F401,F403
from rowkit import *                                # noqa: E402,F401,F403

NAME = 'arlington'
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
TRI_BUDGET = 2000

# ---------------------------------------------------------------- palette
C_TAN = hexc('#B89A6A')
C_BRICK = mix(C_CREAM, C_TAN, 0.35)    # stripped buff brick (see COLOUR DECISION)
C_TRIM = C_CREAM                       # cream stucco / terra cotta trim
C_TSH = shade(C_CREAM, 0.84)           # derived: shaded trim, base course
C_TURQ = hexc('#3FA8A0')               # top-floor tile panels (guide turquoise)
C_DOME = C_VERD                        # verdigris dome caps
C_FRAME = shade(C_TILE_SH, 0.9)        # derived: red-brown frames round the entrance bays
C_URN = mix(C_IRON, C_VERD, 0.45)      # derived: dark green-grey urns

# ---------------------------------------------------------------- dimensions (m)
FLOOR = 3.2                            # [est]
Z_BASE = 8.5                           # arcaded base / terrace level      [est]
Z_FLOOR0 = 1.6                         # entrance floor level              [est]
CXH = 14.0                             # centre block half-width           [est]
CY0, CY1 = 5.0, 22.0                   # centre block front / back         [est]
Z_CE = Z_BASE + 9 * FLOOR              # 37.3 centre eave                  [est]
Z_CR = Z_CE + 4.0                      # 41.3 centre hip ridge             [est]
PX1 = 26.0                             # pavilion outer edge               [est]
PY1 = 22.0                             # pavilion depth (= centre block)   [est]
Z_PV = Z_BASE + 7 * FLOOR              # 30.9 pavilion top                 [est]
TX0, TX1 = 14.0, 22.0                  # tower shaft x range               [est]
TY0, TY1 = 1.0, 9.0                    # tower shaft y range               [est]
Z_T1 = 41.8                            # shaft top / belfry floor          [est]
Z_T2 = 47.0                            # belfry top                        [est]
Z_T3 = 50.2                            # octagonal crown top               [est]
Z_T4 = 52.8                            # dome top                          [est]
Z_TF = 54.0                            # finial                            [est]
WING_A = math.radians(35.0)            # wing fold-back angle              [est]
WING_L, WING_T = 50.0, 14.0            # wing length / depth               [est]
WING_PY = 6.0                          # wing front starts here (y)        [est]
Z_WE = Z_BASE + 6 * FLOOR              # 27.7 wing eave                    [est]
Z_WR = Z_WE + 3.3                      # 31.0 wing ridge                   [est]
BX, BY0 = 30.0, -12.0                  # base half-width / front           [est]
Z_TER = 9.6                            # terrace parapet                   [est]
Z_TERC = 10.2                          # raised centre parapet             [est]

FRONT = front_frame(0.0)
CFRONT = front_frame(CY0)
BFRONT = front_frame(BY0)


def floors(n, z0=Z_BASE, sill=0.85, head=2.55):
    return [(z0 + i * FLOOR + sill, z0 + i * FLOOR + head) for i in range(n)]


def grid(mb, fr, u0, u1, us, fl, w=1.25, col=C_WINDOW, wall_col=C_BRICK, d=0.07):
    """Window grid: one glass strip per column from the lowest sill to the
    highest head, then wall-coloured spandrel bands over the strips between
    floors. Looks like separate panels at 2 tris per column + 2 per floor."""
    v0, v1 = fl[0][0], fl[-1][1]
    for u in us:
        window(mb, fr, u, w, v0, v1, col, d=d, dark=0.75)
    for (a0, a1), (b0, b1) in zip(fl[:-1], fl[1:]):
        wrect(mb, fr, u0, u1, a1, b0, 'wall', wall_col, d + 0.04)


def merge(mb, sub, M):
    """Append the polygons of `sub` to `mb`, transformed by the 4x4 matrix M."""
    off = len(mb.v)
    for p, c in zip(sub.v, sub.c):
        mb.v.append(M @ p)
        mb.c.append(c)
    for f, m, s in zip(sub.f, sub.m, sub.s):
        mb.f.append([i + off for i in f])
        mb.m.append(m)
        mb.s.append(s)


# ---------------------------------------------------------------- parts
def centre_block(mb):
    banded_box(mb, -CXH, CXH, CY0, CY1,
               [(Z_BASE - 0.3, Z_CE - FLOOR - 0.15, 'wall', C_BRICK),
                (Z_CE - FLOOR - 0.15, Z_CE, 'trim', C_TRIM)],
               faces=('-y', '+y'))
    # sides above the pavilion roofs, behind the towers
    vquad(mb, (CXH, TY1), (CXH, CY1), Z_PV - 0.3, Z_CE, 'wall', C_BRICK, (1, 0, 0))
    vquad(mb, (-CXH, CY1), (-CXH, TY1), Z_PV - 0.3, Z_CE, 'wall', C_BRICK, (-1, 0, 0))
    o = 0.9
    hip_roof(mb, -CXH - o, CXH + o, CY0 - o, CY1 + o, Z_CE, Z_CR, 'roof', C_TILE,
             fascia=0.35, col_fascia=C_TILE_SH, col_soffit=shade(C_TRIM, 0.62), mat_soffit='trim')
    us = spaced(8, 3.3)
    grid(mb, CFRONT, -CXH, CXH, us, floors(8))
    # top floor: cream frieze band with blue-green tile panels between windows
    zt = Z_CE - FLOOR
    for u in us:
        window(mb, CFRONT, u, 1.1, zt + 0.6, zt + 2.2, C_WINDOW, d=0.07, dark=0.75)
    for u in [us[0] - 1.65] + [(a + b) / 2 for a, b in zip(us[:-1], us[1:])] + [us[-1] + 1.65]:
        wrect(mb, CFRONT, u - 0.55, u + 0.55, zt + 0.7, zt + 2.1, 'trim', C_TURQ, 0.06)
    grid(mb, rear_frame(CY1), -CXH, CXH, spaced(8, 3.3), floors(9))


def pavilions(mb):
    for s in (-1, 1):
        xa, xb = sorted([s * CXH, s * PX1])
        spec = [(Z_BASE - 0.3, Z_PV - 0.9, 'wall', C_BRICK), (Z_PV - 0.9, Z_PV - 0.3, 'trim', C_TRIM)]
        banded_box(mb, xa, xb, 0.0, PY1, spec, faces=('-y', '+y', '+x' if s > 0 else '-x'))
        bands(mb, (s * CXH, 0.0), (s * CXH, CY0), (-s, 0, 0), spec)
        # tile coping band and flat (roof-garden) top
        cbox(mb, (xa - 0.25, -0.25, Z_PV - 0.3), (xb + 0.25, PY1 + 0.25, Z_PV), 'roof', C_TILE,
             skip=('+z',), cols={'-z': C_TILE_SH})
        mb.poly([(xa - 0.25, -0.25, Z_PV), (xb + 0.25, -0.25, Z_PV), (xb + 0.25, PY1 + 0.25, Z_PV),
                 (xa - 0.25, PY1 + 0.25, Z_PV)], 'roof', C_FLATROOF, out=(0, 0, 1))
        uc = s * (CXH + PX1) / 2
        grid(mb, FRONT, xa, xb, spaced(3, 3.6, uc), floors(7))
        fr = south_frame(PX1) if s > 0 else north_frame(-PX1)
        u0, u1 = sorted([s * 0.4, s * (WING_PY - 0.4)])
        grid(mb, fr, u0, u1, [s * WING_PY / 2], floors(7))


def tower(mb, s):
    xa, xb = sorted([s * TX0, s * TX1])
    xc, yc = (xa + xb) / 2, (TY0 + TY1) / 2
    cbox(mb, (xa, TY0, Z_PV - 0.3), (xb, TY1, Z_T1), 'wall', C_BRICK, skip=('-z',),
         cols={'+z': C_TSH})
    # shaft windows above the pavilion roof
    grid(mb, front_frame(TY0), xa, xb, spaced(2, 3.2, xc),
         [(Z_PV + i * FLOOR + 0.85, Z_PV + i * FLOOR + 2.55) for i in range(3)])
    side = south_frame(xb) if s > 0 else north_frame(xa)
    grid(mb, side, *sorted([s * TY0, s * TY1]), [s * yc],
         [(Z_PV + i * FLOOR + 0.85, Z_PV + i * FLOOR + 2.55) for i in range(3)])
    # cornice + balcony slab, belfry with arched openings
    cbox(mb, (xa - 0.45, TY0 - 0.45, Z_T1 - 0.35), (xb + 0.45, TY1 + 0.45, Z_T1), 'trim', C_TRIM,
         skip=(), cols={'-z': C_TSH})
    h = 3.2
    cbox(mb, (xc - h, yc - h, Z_T1), (xc + h, yc + h, Z_T2), 'trim', C_TRIM, skip=('-z',),
         cols={'+z': C_TSH})
    for fr, u in ((front_frame(yc - h), xc), (rear_frame(yc + h), -xc),
                  (south_frame(xc + h), yc), (north_frame(xc - h), -yc)):
        window(mb, fr, u, 2.0, Z_T1 + 0.5, Z_T2 - 0.7, C_IRON, arch=3, d=0.05, dark=0.85)
    cbox(mb, (xc - h - 0.3, yc - h - 0.3, Z_T2), (xc + h + 0.3, yc + h + 0.3, Z_T2 + 0.35), 'trim',
         C_TRIM, skip=(), cols={'-z': C_TSH})
    # octagonal crown with small arches, verdigris dome, finial
    r = 3.1
    ngon_prism(mb, xc, yc, r, Z_T2 + 0.35, Z_T3, 8, 'trim', C_TRIM, top=False,
               phase=math.pi / 8)
    a = r * math.cos(math.pi / 8)
    for fr, u in ((front_frame(yc - a), xc), (south_frame(xc + a), yc), (north_frame(xc - a), -yc)):
        window(mb, fr, u, 1.0, Z_T2 + 0.9, Z_T3 - 0.5, C_IRON, arch=3, d=0.04, dark=0.85)
    dome(mb, xc, yc, r, Z_T3, Z_T4 - Z_T3, 8, [C_DOME, shade(C_DOME, 1.12), shade(C_DOME, 1.2)],
         'roof', zigzag=False, phase=math.pi / 8)
    finial(mb, xc, yc, Z_T4 - 0.1, Z_TF - Z_T4 + 0.1, 0.22, 'trim', C_TRIM, n=4)


def wing(mb, s):
    """Wing built axis-aligned in local coordinates (front face at local
    y = 0 facing -Y, running from x = 0 outward), then folded back."""
    sub = MB()
    x0, x1 = sorted([0.0, s * WING_L])
    spec = [(Z_SKIRT, Z_BASE, 'trim', C_TSH), (Z_BASE, Z_WE - 0.7, 'wall', C_BRICK),
            (Z_WE - 0.7, Z_WE, 'trim', C_TRIM)]
    banded_box(sub, x0, x1, 0.0, WING_T, spec, faces=('-y', '+y', '+x' if s > 0 else '-x'))
    o = 0.7
    hip_roof(sub, x0 - o, x1 + o, -o, WING_T + o, Z_WE, Z_WR, 'roof', C_TILE, fascia=0.3,
             col_fascia=C_TILE_SH, col_soffit=shade(C_TRIM, 0.62), mat_soffit='trim')
    n = 12
    us = [s * (4.0 + 3.8 * i) for i in range(n)]
    grid(sub, front_frame(0.0), x0 + 1.0, x1 - 1.0, us, floors(6))
    for i, u in enumerate(us[::2]):                    # arched ground-floor openings
        window(sub, front_frame(0.0), u + s * 1.9, 2.6, 1.0, 5.8, C_WINDOW, arch=3, d=0.07)
    grid(sub, rear_frame(WING_T), -x1 + 1.0, -x0 - 1.0, [-u for u in us[::2]], floors(6))
    end = south_frame(x1) if s > 0 else north_frame(x0)
    grid(sub, end, *sorted([0.6 * s, s * (WING_T - 0.6)]), [s * WING_T * 0.3, s * WING_T * 0.7],
         floors(6))
    M = Matrix.Translation((s * PX1, WING_PY, 0.0)) @ Matrix.Rotation(s * WING_A, 4, 'Z')
    merge(mb, sub, M)


def base(mb):
    # two-storey arcaded base with the terrace on top
    spec = [(Z_SKIRT, Z_FLOOR0, 'trim', C_TSH), (Z_FLOOR0, Z_BASE, 'trim', C_TRIM),
            (Z_BASE, Z_TER, 'trim', C_TRIM)]
    banded_box(mb, -BX, BX, BY0, CY0, spec, faces=('-y', '+x', '-x'))
    # terrace slab (its top reads as the paved terrace / parapet coping)
    cbox(mb, (-BX - 0.3, BY0 - 0.3, Z_TER - 0.25), (BX + 0.3, CY0, Z_TER), 'trim', C_TSH,
         skip=('+y',), cols={'-z': shade(C_TSH, 0.7), '+z': C_FLATROOF})
    # raised ornate centre parapet with three urns
    fbox(mb, BFRONT, -9.0, 9.0, Z_TER, Z_TERC, -0.6, 0.0, 'trim', C_TRIM, skip=('bottom',),
         cols={'top': C_TSH})
    for x in (-5.5, 0.0, 5.5):
        finial(mb, x, BY0 + 0.3, Z_TERC, 1.3, 0.55, 'trim', C_URN, n=6)
    # three tall square entrance bays with red-brown frames
    for x in (-4.6, 0.0, 4.6):
        wrect(mb, BFRONT, x - 2.0, x + 2.0, Z_FLOOR0, 7.3, 'trim', C_FRAME, 0.04)
        window(mb, BFRONT, x, 3.4, Z_FLOOR0, 6.9, C_WINDOW, d=0.08, dark=0.5)
    wrect(mb, BFRONT, -7.2, 7.2, 7.55, 8.05, 'trim', C_TURQ, 0.04)
    # arcades either side
    for s in (-1, 1):
        for x in (13.0, 18.0, 23.0, 27.5):
            window(mb, BFRONT, s * x, 3.0, Z_FLOOR0, 6.6, C_WINDOW, arch=3, d=0.08, dark=0.5)
        fr = south_frame(BX) if s > 0 else north_frame(-BX)
        for y in (-9.0, -4.0):
            window(mb, fr, s * y, 2.6, Z_FLOOR0, 6.4, C_WINDOW, arch=3, d=0.08, dark=0.5)
    # central stair up to the entrance floor
    for i in range(3):
        y = BY0 - 1.2 * (3 - i)
        cbox(mb, (-6.0 + i * 0.4, y, Z_SKIRT), (6.0 - i * 0.4, BY0, Z_FLOOR0 * (i + 1) / 3), 'trim',
             C_TSH, skip=('+y', '-z'))


# ---------------------------------------------------------------- build
def build():
    reset()
    mats = order_mats(C_BRICK, C_TILE, C_TRIM)
    mb = MB()
    centre_block(mb)
    pavilions(mb)
    for s in (-1, 1):
        tower(mb, s)
        wing(mb, s)
    base(mb)
    o = mb.build('Arlington', mats, vcol=True, order=['wall', 'roof', 'trim', 'glass'])
    box_uv(o, unit=4.0)
    return o


def main():
    o = build()
    # kart coming north up Central Ave toward the "Y": the hotel closes the vista
    street = dict(cam_loc=(10.0, -95.0, 1.6), target=(0.0, 5.0, 20.0), lens=28.0)
    finish(NAME, o, TRI_BUDGET, ARGS, street,
           aerial=dict(cam_loc=(-80.0, -120.0, 70.0), target=(0.0, 15.0, 18.0), lens=35.0),
           elev=dict(cam_loc=(0.0, -160.0, 27.0), target=(0.0, 0.0, 27.0), ortho_scale=125.0),
           rear=dict(cam_loc=(90.0, 140.0, 70.0), target=(0.0, 20.0, 15.0), lens=35.0))


main()
