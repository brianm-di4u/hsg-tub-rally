"""The Pagoda (1911, designed by J. G. Horn), overlook shelter on Hot Springs
Mountain Drive, Hot Springs National Park, Arkansas -- open-sided rustic
shelter with a pagoda-like hipped roof; low-poly landmark, early-N64 look.

Run (from the repo root, one line):
    "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" -b --factory-startup
        --python art-src/blender/scripts/landmarks/pagoda.py -- [--no-render] [--checks]

Outputs: art-src/blender/export/pagoda.glb, art-src/blender/pagoda.blend,
         art-src/blender/renders/pagoda_*.png (git-ignored)

Conventions: see art-src/blender/README.md. The shelter has no walls, so the
"main front wall line" is the front post line. ORIGIN = centre of the front
post line at grade; the open front (toward the drive / view) faces glTF +Z
(Blender -Y); the platform, step and eaves project to glTF z > 0.

FACTS USED:
  games/Cart Racing/research/town-content.md section 4 (NPS "Scenic Drives
    & Overlooks", home.nps.gov/hosp/planyourvisit/scenic-overlooks.htm):
    Hot Springs Mountain Drive switchbacks climb to a picnic area, the
    Pagoda (J. G. Horn, 1911) and the Mountain Tower.
  Task brief: an open-sided rustic shelter with a pagoda-like hipped roof.
  Nothing else (size, materials, colours) is in the research files.

PALETTE (inferred -- no colour source for the Pagoda itself): the
  visual-style-guide.md P9 nps-rustic swatches used for park shelters:
  native stone #8C877C (platform, piers), log #5B4632 (posts, beams,
  braces, rails, fascia), redwood shingle #8B4A33 (roof). Derived: soffit
  and ceiling = log x 0.70 (rowkit SOFFIT_K); drum vents = rowkit C_IRON
  #1F2A24 (dark openings).

ESTIMATES (everything dimensional):
  square plan, post centres 6.0 m apart; stone platform 8.0 m square,
  0.45 m high, with a 2.4 m front step
  stone pier bases 0.9 m square to 0.95 m; timber posts 0.32 m square to
  2.95 m; plates 0.32 x 0.35 m; knee braces; rails at 1.55 m on the two
  sides and the back (the front is left open)
  lower roof: bellcast hip in two pitches -- eave tip 8.6 m square at
  3.35 m with the corners turned up to 3.85 m, kick 6.8 m square at
  4.0 m, steep upper pitch to a 3.0 m square at 5.6 m
  lantern drum 2.7 m square, 5.3-6.3 m, with dark vents
  upper roof: eave 4.6 m square at 6.2 m, corners up to 6.55 m, kick
  3.7 m square at 6.6 m, apex 7.9 m; finial to 8.7 m
"""
import os
import sys

sys.dont_write_bytecode = True                      # no __pycache__ in art-src
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))          # art-src/blender/scripts
from common import *                                # noqa: E402,F401,F403
from rowkit import *                                # noqa: E402,F401,F403
from landkit import *                               # noqa: E402,F401,F403

NAME = 'pagoda'
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
TRI_BUDGET = 400

# ---------------------------------------------------------------- palette
C_SOFF = shade(C_LOG, SOFFIT_K)        # derived: soffit / ceiling
C_PIER = C_STONE
C_PLAT = shade(C_STONE, 0.92)          # derived: platform top a touch darker (worn)

# ---------------------------------------------------------------- dimensions (m)
P = 3.0                                # post half-spacing              [est]
YC = P                                 # plan centre (front post line at y = 0)
PL = 4.0                               # platform half-width            [est]
Z_PLAT = 0.45                          # platform top                   [est]
Z_PIER = 0.95                          # pier tops                      [est]
Z_PLATE = 2.95                         # post tops / plate underside    [est]
Z_CEIL = 3.30                          # plate top = ceiling            [est]
RE, ZE, ZEC = 4.3, 3.35, 3.85          # lower eave: half-width, mid z, corner z [est]
RK, ZK = 3.4, 4.0                      # lower kick                     [est]
RU, ZU = 1.5, 5.6                      # top of the lower roof          [est]
DR, ZD0, ZD1 = 1.35, 5.3, 6.3          # lantern drum                   [est]
RE2, ZE2, ZEC2 = 2.3, 6.2, 6.55        # upper eave                     [est]
RK2, ZK2 = 1.85, 6.6                   # upper kick                     [est]
Z_APEX, Z_FIN = 7.9, 8.7               # apex / finial top              [est]
FASCIA = 0.2


def ring(r, z_mid, z_corner):
    """8 points round the plan centre, CCW from the front-left corner;
    corners at z_corner, mid-edges at z_mid."""
    pts = []
    for (x, y), corner in (((-1, -1), True), ((0, -1), False), ((1, -1), True), ((1, 0), False),
                           ((1, 1), True), ((0, 1), False), ((-1, 1), True), ((-1, 0), False)):
        pts.append(Vector((x * r, YC + y * r, z_corner if corner else z_mid)))
    return pts


def band(mb, A, B, mat, col, down=False):
    """Join two 8-point rings with triangles (rings may be non-planar)."""
    c = Vector((0.0, YC, (A[0].z + B[0].z) / 2))
    for k in range(8):
        k2 = (k + 1) % 8
        for tri in ((A[k], A[k2], B[k2]), (A[k], B[k2], B[k])):
            fc = sum(tri, Vector()) / 3
            out = Vector((0, 0, -1)) if down else (fc - c) + Vector((0, 0, 0.05))
            mb.poly(list(tri), mat, col, out=out)


def tier(mb, re, ze, zec, rk, zk, top, soffit_to):
    """Bellcast tier: eave ring (corners up) -> kick ring -> `top`
    ('apex', z) or ('flat', r, z). Fascia below the eave, soffit band in to
    the 8-point ring soffit_to."""
    E = ring(re, ze, zec)
    Kr = ring(rk, zk, zk)
    band(mb, E, Kr, 'roof', C_SHINGLE)
    c = Vector((0.0, YC, zk))
    corners = [Kr[0], Kr[2], Kr[4], Kr[6]]
    if top[0] == 'apex':
        t = Vector((0.0, YC, top[1]))
        for i in range(4):
            a, b = corners[i], corners[(i + 1) % 4]
            mb.poly([a, b, t], 'roof', C_SHINGLE, out=(a + b) / 2 - c + Vector((0, 0, 0.3)))
    else:
        r, z = top[1], top[2]
        U = [Vector((x * r, YC + y * r, z)) for x, y in ((-1, -1), (1, -1), (1, 1), (-1, 1))]
        for i in range(4):
            a, b = corners[i], corners[(i + 1) % 4]
            mb.poly([a, b, U[(i + 1) % 4], U[i]], 'roof', C_SHINGLE,
                    out=(a + b) / 2 - c + Vector((0, 0, 0.3)))
        mb.poly(U, 'roof', C_SHINGLE, out=(0, 0, 1))
    Eb = [p - Vector((0, 0, FASCIA)) for p in E]
    for k in range(8):                                 # fascia boards
        k2 = (k + 1) % 8
        mid = (E[k] + E[k2]) / 2
        out = Vector((mid.x, mid.y - YC, 0.0))
        mb.poly([Eb[k], Eb[k2], E[k2], E[k]], 'trim', C_LOG, out=out)
    band(mb, Eb, soffit_to, 'trim', C_SOFF, down=True)


def platform(mb):
    cbox(mb, (-PL, YC - PL, Z_SKIRT), (PL, YC + PL, Z_PLAT), 'wall', C_PIER, skip=('-z',),
         cols={'+z': C_PLAT})
    cbox(mb, (-1.2, YC - PL - 0.6, Z_SKIRT), (1.2, YC - PL, Z_PLAT / 2), 'wall', C_PIER,
         skip=('-z', '+y'), cols={'+z': C_PLAT})


def frame(mb):
    for sx in (-1, 1):
        for sy in (-1, 1):
            x, y = sx * P, YC + sy * P
            cbox(mb, (x - 0.45, y - 0.45, Z_PLAT - 0.05), (x + 0.45, y + 0.45, Z_PIER), 'wall',
                 C_PIER, skip=('-z',), cols={'+z': shade(C_PIER, 0.92)})
            cbox(mb, (x - 0.16, y - 0.16, Z_PIER), (x + 0.16, y + 0.16, Z_PLATE), 'trim', C_LOG,
                 skip=('-z', '+z'))
            # knee braces in the two side planes meeting at this post
            strut(mb, (x, y, 2.30), (x - sx * 0.7, y, Z_PLATE), 0.16, (0, sy, 0), 'trim', C_LOG)
            strut(mb, (x, y, 2.30), (x, y - sy * 0.7, Z_PLATE), 0.16, (sx, 0, 0), 'trim', C_LOG)
    # plates (top beams), running past the posts
    e = P + 0.4
    for sy in (-1, 1):
        y = YC + sy * P
        cbox(mb, (-e, y - 0.16, Z_PLATE), (e, y + 0.16, Z_CEIL), 'trim', C_LOG, skip=('+z',),
             cols={'-x': C_LOGEND, '+x': C_LOGEND})
    for sx in (-1, 1):
        x = sx * P
        cbox(mb, (x - 0.16, YC - e, Z_PLATE), (x + 0.16, YC + e, Z_CEIL), 'trim', C_LOG,
             skip=('+z',), cols={'-y': C_LOGEND, '+y': C_LOGEND})
    # rails on the sides and back
    zr = 1.55
    for a, b in (((-P, YC - P), (-P, YC + P)), ((P, YC - P), (P, YC + P)),
                 ((-P, YC + P), (P, YC + P))):
        log(mb, (a[0], a[1], zr), (b[0], b[1], zr), 0.09, n=4, caps=False)


def roof(mb):
    ceil = ring(P + 0.25, Z_CEIL, Z_CEIL)
    tier(mb, RE, ZE, ZEC, RK, ZK, ('flat', RU, ZU), ceil)
    mb.poly([ceil[0], ceil[2], ceil[4], ceil[6]], 'trim', C_SOFF, out=(0, 0, -1))
    # lantern drum with dark vents
    cbox(mb, (-DR, YC - DR, ZD0), (DR, YC + DR, ZD1), 'trim', C_LOG, skip=('-z', '+z'))
    for fr, u in ((front_frame(YC - DR), 0.0), (rear_frame(YC + DR), 0.0),
                  (south_frame(DR), YC), (north_frame(-DR), -YC)):
        window(mb, fr, u, 1.5, ZU + 0.12, ZD1 - 0.12, C_IRON, d=0.04, dark=1.0)
    drum_top = ring(DR, ZD1, ZD1)
    tier(mb, RE2, ZE2, ZEC2, RK2, ZK2, ('apex', Z_APEX), drum_top)
    finial(mb, 0.0, YC, Z_APEX - 0.1, Z_FIN - Z_APEX + 0.1, 0.16, 'trim', C_LOG, n=4)


# ---------------------------------------------------------------- build
def build():
    reset()
    mats = order_mats(C_PIER, C_SHINGLE, C_LOG)
    mb = MB()
    platform(mb)
    frame(mb)
    roof(mb)
    o = mb.build('Pagoda', mats, vcol=True, order=['wall', 'roof', 'trim', 'glass'])
    box_uv(o, unit=4.0)
    return o


def main():
    o = build()
    street = dict(cam_loc=(-11.0, -15.5, 1.6), target=(0.0, 3.0, 3.8), lens=28.0)
    finish(NAME, o, TRI_BUDGET, ARGS, street,
           aerial=dict(cam_loc=(-17.0, -22.0, 15.0), target=(0.0, 3.0, 3.0), lens=35.0),
           elev=dict(cam_loc=(0.0, -60.0, 4.5), target=(0.0, 0.0, 4.5), ortho_scale=14.0),
           rear=dict(cam_loc=(15.0, 24.0, 9.0), target=(0.0, 3.0, 3.5), lens=35.0))


main()
