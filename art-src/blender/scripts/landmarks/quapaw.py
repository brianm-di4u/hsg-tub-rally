"""Quapaw Bathhouse (1922, Mann & Stern), 413 Central Ave, Bathhouse Row,
Hot Springs, Arkansas -- the widest house and the Row's tallest point (dome
lantern); low-poly landmark, early-N64 look.

Run (from the repo root, one line):
    "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" -b --factory-startup
        --python art-src/blender/scripts/landmarks/quapaw.py -- [--no-render] [--checks]

Outputs: art-src/blender/export/quapaw.glb, art-src/blender/quapaw.blend,
         art-src/blender/renders/quapaw_*.png (git-ignored)

Conventions: see art-src/blender/README.md and fordyce.py. Origin = front-centre
at grade on the main front wall line, here the faces of the two end
pavilions; the centre entrance pavilion and steps project in front of it
(glTF z > 0), the arcade sits just behind it. +X = south.

FACTS USED (research/ in the workspace root):
  bathhouse-row-layout.md table, row 5 (HABS AR-28 / AR-28-E, measured):
    frontage 185 ft (trivia) / ~181-186 ft (mahjong), widest on the Row;
    OSM 180 x 98 ft. Mostly 1 storey; "a narrow second story running the
    length of the facade" topped by the dome (NHL)
    end pavilions ~18-21 ft; main ridge ~35 ft; dome crown ~50 ft;
    lantern finial ~58-60 ft = highest point on the Row
    dome about 23 ft across on an octagonal drum with a quatrefoil vent
  visual-style-guide.md / bathhouse-row-and-springs.md, Quapaw sections:
    Spanish Colonial Revival; stucco; red clay barrel-tile pent and ridge
    roofs; dome tiles in a chevron mosaic with a band of rectangular and
    diamond patterns at its base (NHL); 1984 colours: buff/tan and cream
    chevrons, ochre/gold base band with turquoise picture panels and small
    blue diamonds, brown edging, dark bronze lantern; centre entrance
    pavilion with "QUAPAW BATHS", a cartouche in the double-curved parapet
    and two big finials flanking the dome; arcaded porch; north and south
    end pavilions with shell-capped curvilinear gables (sculpin fish,
    originally gold, now white). The cartouche is drawn as a plain abstract
    oval (content rule in visual-style-guide.md).
  Hexes: stucco #F3EFE6, red tile #A9432C / #7E2F1F; dome buff #D8C29A,
    tan #B89A6A, cream #E6D7B5, ochre band #C8963E, brown edging #6E4B2F,
    blue diamonds #2B4C9B, turquoise panels #3FA8A0, bronze lantern
    #6B4E2E (visual-style-guide.md Quapaw, re-keyed to the 1984 photos).
  Shape check (not copied): HABS colour photo 570751c (mahjong ref
    habs-quapaw-facade.jpg) and Highsmith 2020 oblique (trivia photo-refs).

ESTIMATES:
  frontage 183 ft (inside both HABS readings); body depth 92 ft (OSM 98 ft
  includes the entrance pavilion and steps)
  end pavilions 30 ft wide, parapet 18 ft, curvilinear gable to 19.8 ft,
  shell crest to 21 ft (HABS 18-21)
  arcade: front 0.3 m behind the pavilion line, 5 arches a side, wall top
  13 ft, tile pent up to 16 ft at the second-storey wall
  second storey 12 m deep, set 4 m back, eave 25 ft, hip ridge 35 ft (HABS)
  entrance pavilion 40 ft wide, 1.5 m proud, parapet 20-24 ft, piers 27 ft,
  finials to 32 ft
  drum: octagon, 3.75 m apothem, top 37.5 ft (dome springing; the 1984 photo
  gives a dome ~0.55 as tall as wide); dome r 3.5 m to 50 ft (HABS)
  lantern 1.5 m square, 48.9-54.5 ft, pyramid cap, finial to 59 ft (HABS)
  dome ring layout: ochre base band (turquoise panels at the four
  diagonals and the front, blue diamonds between), brown edging, then
  alternating buff/tan chevron rings and a cream top ring
"""
import os
import sys

sys.dont_write_bytecode = True                      # no __pycache__ in art-src
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))          # art-src/blender/scripts
from common import *                                # noqa: E402,F401,F403
from rowkit import *                                # noqa: E402,F401,F403

NAME = 'quapaw'
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
TRI_BUDGET = 1100

# ---------------------------------------------------------------- palette
C_WALL = C_STUCCO
C_BUFF = hexc('#D8C29A')           # dome chevrons
C_TAN = hexc('#B89A6A')
C_DCREAM = hexc('#E6D7B5')
C_OCHRE = hexc('#C8963E')          # dome base band
C_BROWN = hexc('#6E4B2F')          # brown edging
C_TURQ = hexc('#3FA8A0')           # turquoise picture panels
C_BRONZE = hexc('#6B4E2E')         # lantern
C_SHELL = C_MARBLE                 # shells / sculpin, white today
C_BASE = shade(C_STUCCO, 0.86)     # derived: base course
C_ARCH = shade(C_WINDOW, 0.75)     # derived: shaded open arcade reads darker than glass
C_LOUVRE = mix(C_WINDOW, C_VERD, 0.35)  # derived: grey-green louvred 2nd-floor windows [obs. 1984]

# ---------------------------------------------------------------- dimensions (m)
W = 183 * FT                       # 55.78 frontage                 [HABS 181-186]
HW = W / 2
D = 92 * FT                        # 28.04 body depth               [est]
PW = 30 * FT                       # 9.14 end-pavilion width        [est]
XP = HW - PW                       # 18.75 inner edge of the pavilions
Z_BASE = 3 * FT                    # 0.91 floor / base course       [est]
Z_PPAR = 18 * FT                   # 5.49 pavilion parapet          [HABS 18-21]
Z_PGAB = 19.8 * FT                 # 6.04 gable crown               [est]
Z_SHELL = 21 * FT                  # 6.40 shell crest               [HABS 18-21]
Y_ARC = 0.30                       # arcade front                   [est]
Z_ARC = 13 * FT                    # 3.96 arcade wall top           [est]
Y_2F, D_2F = 4.0, 12.0             # second storey front / depth    [est]
Z_PENT = 16 * FT                   # 4.88 pent at the 2nd-storey wall [est]
Z_EAVE2 = 25 * FT                  # 7.62 second-storey eave        [est]
Z_RIDGE = 35 * FT                  # 10.67 main ridge               [HABS ~35]
EX, EY = 20 * FT, -1.5             # entrance pavilion half-width / front [est]
Z_EPAR = 20 * FT                   # 6.10 entrance parapet shoulders [est]
Z_ECROWN = 24 * FT                 # 7.32 parapet crown             [est]
Z_EPIER = 27 * FT                  # 8.23 finial piers              [est]
Z_EFIN = 32 * FT                   # 9.75 finial tops               [est]
DY = Y_2F + D_2F / 2               # 10.0 dome axis (depth)
DRUM_A = 3.75                      # drum apothem                   [est]
Z_DRUM = 37.5 * FT                 # 11.43 dome springing           [est]
DR = 23 * FT / 2                   # 3.51 dome radius               [HABS ~23 ft]
Z_DOME = 50 * FT                   # 15.24 dome crown               [HABS ~50]
Z_LAN0, Z_LAN1 = 48.9 * FT, 54.5 * FT   # 14.90 / 16.61 lantern     [est]
Z_FIN = 59 * FT                    # 17.98 lantern finial           [HABS 58-60]

FRONT = front_frame(0.0)
ARC = front_frame(Y_ARC)
UPPER = front_frame(Y_2F)
EFRONT = front_frame(EY)
SOUTH = south_frame(HW)
NORTH = north_frame(-HW)
REAR = rear_frame(D)


def masses(mb):
    # end pavilions (full depth, one storey + parapet)
    for s in (-1, 1):
        xa, xb = sorted([s * XP, s * HW])
        spec = [(Z_SKIRT, Z_BASE, 'trim', C_BASE), (Z_BASE, Z_PPAR, 'wall', C_WALL)]
        faces = ('-y', '+y', '+x' if s > 0 else '-x')
        banded_box(mb, xa, xb, 0.0, D, spec, faces=faces)
        bands(mb, (s * XP, 0.0), (s * XP, Y_ARC), (-s, 0, 0), spec)       # return to the arcade
        mb.poly([(xa, 0, Z_PPAR), (xb, 0, Z_PPAR), (xb, D, Z_PPAR), (xa, D, Z_PPAR)],
                'roof', C_FLATROOF, out=(0, 0, 1))
    # one-storey body between the pavilions (arcade front, flat roof behind)
    spec = [(Z_SKIRT, Z_BASE, 'trim', C_BASE), (Z_BASE, Z_ARC, 'wall', C_WALL)]
    for xa, xb in ((-XP, -EX), (EX, XP)):
        bands(mb, (xa, Y_ARC), (xb, Y_ARC), (0, -1, 0), spec)
    bands(mb, (XP, D), (-XP, D), (0, 1, 0), spec)
    mb.poly([(-XP, Y_2F + D_2F, Z_ARC), (XP, Y_2F + D_2F, Z_ARC), (XP, D, Z_ARC),
             (-XP, D, Z_ARC)], 'roof', C_FLATROOF, out=(0, 0, 1))
    # narrow second storey running the length of the facade, hip roof
    y0, y1 = Y_2F, Y_2F + D_2F
    banded_box(mb, -XP, XP, y0, y1, [(Z_ARC - 0.2, Z_EAVE2, 'wall', C_WALL)],
               faces=('-y', '+y', '+x', '-x'))
    o = 0.6
    hip_roof(mb, -XP - o, XP + o, y0 - o, y1 + o, Z_EAVE2, Z_RIDGE, 'roof', C_TILE,
             fascia=0.22, col_fascia=C_TILE_SH, col_soffit=shade(C_TILE_SH, SOFFIT_K),
             mat_soffit='trim')
    # tile pent over the arcade
    for xa, xb in ((-XP, -EX), (EX, XP)):
        pent(mb, xa, xb, Y_2F, Y_ARC - 0.45, Z_PENT, Z_ARC + 0.05, C_TILE, C_TILE_SH,
             fascia=0.16, cheeks=False)


def arcade(mb):
    for xa, xb in ((-XP, -EX), (EX, XP)):
        n = 5
        pitch = (xb - xa) / n
        for i in range(n):
            u = xa + pitch * (i + 0.5)
            window(mb, ARC, u, pitch - 0.75, Z_BASE, 3.45, C_ARCH, arch=3, d=0.06, dark=0.7)
    # louvred second-storey windows
    for xa, xb in ((-XP, -EX - 1.0), (EX + 1.0, XP)):
        n = 6
        pitch = (xb - xa) / n
        for i in range(n):
            window(mb, UPPER, xa + pitch * (i + 0.5), 1.0, 5.35, 6.75, C_LOUVRE, d=0.07, dark=0.8)


GABLE_HALF = [(1.0, 0.12), (0.80, 0.16), (0.66, 0.30), (0.50, 0.44), (0.34, 0.47), (0.18, 0.52)]


def pavilions(mb):
    for s in (-1, 1):
        uc = s * (XP + PW / 2)
        # shell-capped curvilinear gable on the front face
        outline = [(u, Z_PPAR + v) for u, v in sym_outline(uc, 3.4, 0.0, GABLE_HALF, Z_PGAB - Z_PPAR)]
        outline_prism(mb, FRONT, outline, 0.4, 'wall', C_WALL, 'trim', C_BASE, skip_edges=(0,))
        shell = [(uc - 0.75, Z_PGAB - 0.15), (uc + 0.75, Z_PGAB - 0.15)] + \
                [(uc + 0.75 * math.cos(math.pi * k / 4),
                  Z_PGAB - 0.15 + (Z_SHELL - Z_PGAB + 0.15) * math.sin(math.pi * k / 4))
                 for k in range(1, 4)]
        wpoly(mb, FRONT, shell, 'trim', C_SHELL, 0.06)
        # two big arched windows with fanlights
        for k in (-1, 1):
            window(mb, FRONT, uc + k * 2.2, 2.3, Z_BASE + 0.3, 4.55, C_WINDOW, arch=3, d=0.08)
        # end and rear faces
        fr = SOUTH if s > 0 else NORTH
        for y in (3.0, 9.0, 15.0, 21.0, 26.0):
            window(mb, fr, s * y, 2.0, Z_BASE + 0.3, 4.3, C_WINDOW, arch=3 if y < 10 else 0, d=0.08)
        window(mb, REAR, -uc, 2.0, 1.4, 3.8, C_WINDOW, d=0.06)


def entrance(mb):
    y0, y1 = EY, Y_2F
    spec = [(Z_SKIRT, Z_BASE, 'trim', C_BASE), (Z_BASE, Z_EPAR, 'wall', C_WALL)]
    banded_box(mb, -EX, EX, y0, y1, spec, faces=('-y', '+x', '-x'))
    mb.poly([(-EX, y0, Z_EPAR), (EX, y0, Z_EPAR), (EX, y1, Z_EPAR), (-EX, y1, Z_EPAR)],
            'roof', C_FLATROOF, out=(0, 0, 1))
    # double-curved parapet between the piers, with the cartouche
    half = [(1.0, 0.0), (0.82, 0.25), (0.62, 0.30), (0.42, 0.62), (0.24, 0.98), (0.12, 1.12)]
    hw = EX - 0.9
    outline = [(u, Z_EPAR + v) for u, v in sym_outline(0.0, hw, 0.0, half, Z_ECROWN - Z_EPAR)]
    outline_prism(mb, EFRONT, outline, 0.4, 'wall', C_WALL, 'trim', C_BASE, skip_edges=(0,))
    wpoly(mb, EFRONT, star_uv(0.0, Z_EPAR + 0.55, 0.62, 0.62, 4, math.pi / 4), 'trim',
          shade(C_STUCCO, 0.78), 0.06)                # abstract oval cartouche
    # piers with finials
    for s in (-1, 1):
        x0, x1 = sorted([s * (EX - 0.9), s * EX])
        cbox(mb, (x0, y0 - 0.15, Z_EPAR - 1.0), (x1, y0 + 0.75, Z_EPIER), 'wall', C_WALL,
             skip=('-z',), cols={'+z': C_BASE})
        finial(mb, (x0 + x1) / 2, y0 + 0.3, Z_EPIER, Z_EFIN - Z_EPIER, 0.42, 'trim', C_WALL, n=6)
    # three arched openings, sign band
    window(mb, EFRONT, 0.0, 3.3, Z_BASE, 4.95, C_WINDOW, arch=3, d=0.08, dark=0.5)
    for s in (-1, 1):
        window(mb, EFRONT, s * 3.15, 2.1, Z_BASE, 4.0, C_WINDOW, arch=3, d=0.08, dark=0.5)
    wrect(mb, EFRONT, -2.4, 2.4, 5.35, 5.60, 'trim', C_BROWN, 0.04)
    # steps
    cbox(mb, (-2.6, EY - 1.6, Z_SKIRT), (2.6, EY, Z_BASE * 0.6), 'trim', C_BASE, skip=('+y', '-z'))


def dome_group(mb):
    # octagonal drum with a quatrefoil vent facing the street
    ngon_prism(mb, 0.0, DY, DRUM_A / math.cos(math.pi / 8), Z_RIDGE - 1.6, Z_DRUM, 8, 'wall',
               C_WALL, top=True, top_col=C_BASE)
    vent = front_frame(DY - DRUM_A)
    vc = (Z_RIDGE + Z_DRUM) / 2 + 0.1
    wpoly(mb, vent, star_uv(0.0, vc, 0.62, 0.62, 4, math.pi / 8), 'trim', C_BASE, 0.04)
    wpoly(mb, vent, star_uv(0.0, vc, 0.50, 0.30, 4), 'glass', C_IRON, 0.08)
    # tiled dome: ochre base band with panels, brown edging, chevron rings
    rings = [C_OCHRE, C_BROWN, C_BUFF, C_TAN, C_BUFF, C_TAN, C_DCREAM]
    sides = 16

    def cells(i, k):
        if i == 0:
            if k % 4 == 3:                 # front, back and the sides
                return C_TURQ
            if k % 4 == 1:
                return C_COBALT
        return None

    dome(mb, 0.0, DY, DR, Z_DRUM, Z_DOME - Z_DRUM, sides, rings, 'roof', zigzag=True,
         top_z=Z_LAN0, cell_col=cells, phase=-15 * math.pi / 16,   # cell 3 faces the street
         zig_from=2)
    # bronze lantern: arched openings, pyramid cap, finial
    h = 0.75
    cbox(mb, (-h, DY - h, Z_LAN0 - 0.3), (h, DY + h, Z_LAN1), 'trim', C_BRONZE, skip=('-z',),
         cols={'+z': shade(C_BRONZE, 0.8)})
    lan = front_frame(DY - h)
    window(mb, lan, 0.0, 0.6, Z_LAN0 + 0.25, Z_LAN1 - 0.25, C_IRON, arch=3, d=0.04, dark=0.9)
    lanb = rear_frame(DY + h)
    window(mb, lanb, 0.0, 0.6, Z_LAN0 + 0.25, Z_LAN1 - 0.25, C_IRON, arch=3, d=0.04, dark=0.9)
    pyramid(mb, 0.0, DY, h + 0.15, h + 0.15, Z_LAN1, Z_LAN1 + 0.65, 'trim', C_BRONZE,
            col_side=shade(C_BRONZE, 0.8))
    finial(mb, 0.0, DY, Z_LAN1 + 0.6, Z_FIN - Z_LAN1 - 0.6, 0.16, 'trim', C_BRONZE, n=4)


# ---------------------------------------------------------------- build
def build():
    reset()
    mats = order_mats(C_WALL, C_TILE, C_BASE)
    mb = MB()
    masses(mb)
    arcade(mb)
    pavilions(mb)
    entrance(mb)
    dome_group(mb)
    o = mb.build('Quapaw', mats, vcol=True, order=['wall', 'roof', 'trim', 'glass'])
    box_uv(o, unit=4.0)
    return o


def main():
    o = build()
    street = dict(cam_loc=(-42.0, -28.0, 1.6), target=(-3.0, 8.0, 8.0), lens=28.0)
    finish(NAME, o, TRI_BUDGET, ARGS, street,
           aerial=dict(cam_loc=(-50.0, -58.0, 34.0), target=(0.0, 10.0, 5.0), lens=35.0),
           elev=dict(cam_loc=(0.0, -90.0, 9.0), target=(0.0, 0.0, 9.0), ortho_scale=62.0),
           rear=dict(cam_loc=(50.0, 70.0, 26.0), target=(0.0, 12.0, 5.0), lens=35.0))


main()
