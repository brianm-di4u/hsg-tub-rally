"""Gold Master: the original brick crew figure and the Traditional tub, built with no triangle budget.

Every game LOD is later measured against these (true bevels, full stud geometry, printed decals).
Outputs: art-src/blender/goldmaster.blend, export/goldmaster-figure.glb, export/goldmaster-tub.glb,
export/goldmaster-stats.json, renders/goldmaster/*.png (git-ignored).

Run from the game folder:
  blender -b --factory-startup --python art-src/blender/scripts/goldmaster.py -- [--no-render]
          [--only figure,tub,crew,fidelity] [--samples 256] [--no-prints] [--preview]
  --preview  six small shots into renders/goldmaster/preview/
  --probe LOD0,LOD1,...  triangle counts per part for brickkit.LOD_PROBES (export/goldmaster-lodprobe.json);
             builds nothing else and leaves the Gold Master files alone
Two runs give byte-identical GLBs.

Facts used, all read from the game (three.js, Y up, forward +z, left +x; Blender here is (x, -z, y), so
forward is -Y and the figure's left is +X):
- src/js/gfx/karts3d.js personGeo: attendant torso 0.40 x 0.55 x 0.24 m on a hip pivot 0.64 m up, legs
  0.55 m plus a 0.07 m shoe, head ball r 0.15 centred 0.72 m above the hip (top 1.51 m), arms 0.08 wide
  reaching forward, the held item in the left (+x) hand, suspenders in the trim colour.
- hatGeo 'helmet': dome r 0.19 squashed to 0.8 (top 1.66 m) with a rear brim 0.40 wide.
- ATT_POS and the wheel hubs (parsed below); wheels r 0.3, 0.14 wide; flag pole base (-0.3, 1.0, -0.72),
  pole 1.25 m, flag 0.55 x 0.35 m from 0.85 m up the pole; duck at (0.3, 1.03, 0.72); tub shell 0.84 x
  1.72 m from 0.42 m to the rim at 1.02 m, lip 0.91 x 1.81 m at 1.05 m; claw feet at (+-0.3, +-0.6);
  frame 1.0 x 1.5 m with its top at 0.36 m; water at 0.5 + 0.48 * fill; side band in the flag colour.
- Captain: torso x 1.12 at (0, 0.7, -0.1), head x 1.25, outfit in the `cap` colour.
- src/js/data/teams.js: the Engine Six Soakers colours and its 'helmet' hat (parsed below).

Design (original; deliberately not the minifig silhouette):
- Rounded-cube head 0.30 x 0.27 x 0.28 m with a flat printed face (never a cylinder head).
- Straight box torso 0.40 x 0.24 x 0.54 m (never a trapezoid), a raised collar, printed uniform.
- Block arms on round shoulder caps; mitten hands (a rounded block plus a thumb; never C-hands).
- A hip block with a visible seam over two separate block legs with a gap between them, rounded leg tops
  hidden in the hip so the legs can swing, and boots that stick out in front.
- Head ~17 % of the height (a minifig's is about a quarter) and a 5-brick (1.68 m) helmeted figure.
- Studs only where real bricks have them: one on the helmet crown and the chassis plate.
Estimates: every size not in the fact list (all shapes of the helmet, items, duck, wheels, claw feet).
"""
import bpy
import json
import math
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.dont_write_bytecode = True               # no __pycache__ next to the scripts
from brickkit import *  # noqa: E402,F401,F403
from brickkit import (_new_bm, _cls, bm_cap, bm_loft, bm_sweep, bm_lathe, bm_rbox, bm_cyl, bm_sphere,  # noqa: E402
                      bm_tube, bm_stud, box_down)

ARGV = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def arg(name, default=None):
    return ARGV[ARGV.index(name) + 1] if name in ARGV else default


NO_RENDER = '--no-render' in ARGV
ONLY = set((arg('--only') or 'figure,tub,crew,fidelity').split(','))
SAMPLES = int(arg('--samples', '256'))
PRINTS = '--no-prints' not in ARGV
PROBE = arg('--probe')                   # e.g. LOD0,LOD1: tri counts only, written to goldmaster-lodprobe.json
PREVIEW = '--preview' in ARGV            # a few small, fast shots into renders/goldmaster/preview/
PREVIEW_SHOTS = {'figure_turn_0', 'figure_turn_180', 'figure_hero', 'items', 'tub_hero', 'crew_hero'}
RES = (640, 640) if PREVIEW else (1024, 1024)
OUT = os.path.join(RENDER_DIR, 'goldmaster', 'preview') if PREVIEW else os.path.join(RENDER_DIR, 'goldmaster')
TEX = os.path.join(ROOT, '..', 'tex', 'brick')
TEX = os.path.normpath(TEX)
KN = GM


# ---------------------------------------------------------------- game data
def read(rel):
    with open(os.path.join(GAME, rel), encoding='utf-8') as f:
        return f.read()


def team(team_id):
    src = read('src/js/data/teams.js')
    m = re.search(r"\{ id: '%s'.*?colors: \{([^}]*)\}.*?hat: '([^']*)'" % re.escape(team_id), src, re.S)
    cols = dict(re.findall(r"(\w+): '(#[0-9A-Fa-f]{6})'", m.group(1)))
    name = re.search(r"\{ id: '%s', name: '([^']*)'" % re.escape(team_id), src).group(1)
    return dict(id=team_id, name=name, colors=cols, hat=m.group(2))


def kart_numbers():
    src = read('src/js/gfx/karts3d.js')
    att = json.loads(re.search(r'const ATT_POS = (\[.*?\]);', src).group(1))
    wp = json.loads(re.search(r'const wp = (\[.*?\]);', src).group(1))
    items = json.loads(re.search(r'const ITEM_ORDER = (\[.*?\]);', src).group(1).replace("'", '"'))
    icol = dict(re.findall(r"(\w+): '(#[0-9A-Fa-f]{6})'", re.search(r'const ITEM_COL = \{([^}]*)\}', src).group(1)))
    return dict(att=att, wheels=wp, items=items, item_col=icol)


def g2b(x, y, z):
    """Game (three.js) point to Blender."""
    return (x, -z, y)


TEAM = team('engine-six')
KART = kart_numbers()
C = TEAM['colors']

# ---------------------------------------------------------------- figure dimensions (Blender, metres)
HIP_Z, WAIST_Z, NECK_Z = 0.58, 0.66, 1.20
HEAD_C, HEAD = (0.0, 0.0, 1.37), (0.30, 0.27, 0.28)
SH_X, SH_Z, WRIST_Z = 0.255, 1.13, 0.84
LEG_X = 0.095
GRIP = (SH_X, -0.005, 0.775)
HAT_Z = HEAD_C[2] + HEAD[2] / 2            # 1.51, the hat pivot on the crown


def figure_mats(mats, team_cols, captain=False):
    """Material keys for one figure."""
    k = {}
    k['skin'] = team_cols['skin']
    k['shirt'] = team_cols['cap'] if captain else team_cols['shirt']
    k['pants'] = 'slate'
    k['boot'] = 'black'
    k['hat'] = team_cols['hat']
    k['trim'] = team_cols['trim']
    for key in list(k):
        v = k[key]
        k[key] = v if not v.startswith('#') else v.upper()
    return k


def build_figure(coll, mats, pre='', item='towel', captain=False, face=None, torso_print=None):
    """One figure with every part a separate object, origin at its joint pivot, parented
    hip -> {torso -> {head -> hat, arm -> hand -> item}, legs}. Returns (root, parts)."""
    fk = figure_mats(mats, C, captain)
    root = bpy.data.objects.new(pre + 'figure', None)
    coll.objects.link(root)
    parts = {}

    # hip block: the seam sits at HIP_Z, the leg axis
    p = Part(pre + 'hip')
    rbox(p, KN, (0.38, 0.22, WAIST_Z - HIP_Z), (0, 0, (HIP_Z + WAIST_Z) / 2), r=0.012, mat=fk['pants'])
    parts['hip'] = p.build(mats, (0, 0, HIP_Z), root, coll)

    for side, nm in ((1, 'leg_l'), (-1, 'leg_r')):
        x = side * LEG_X
        p = Part(pre + nm)
        rbox(p, KN, (0.165, 0.17, HIP_Z - 0.12), (x, 0, (HIP_Z + 0.12) / 2), r=0.014, mat=fk['pants'])
        # rounded top on the hip axis, hidden inside the hip block, so a swinging leg never opens a gap
        cyl(p, KN, 0.085, 0.165, M=T(x - 0.0825, 0, HIP_Z) @ R(90, 'Y'), mat=fk['pants'], b0=0.008, b1=0.008)
        # boot, toe forward (-Y)
        rbox(p, KN, (0.178, 0.205, 0.12), (x, -0.0175, 0.06), r=0.026, mat=fk['boot'])
        rbox(p, KN, (0.182, 0.209, 0.022), (x, -0.0175, 0.011), r=0.008, mat='charcoal')
        # turnout-trouser reflective band: lime with a silver centre stripe
        rbox(p, KN, (0.171, 0.176, 0.042), (x, 0, 0.27), r=0.005, mat='lime/reflective')
        rbox(p, KN, (0.1725, 0.1775, 0.014), (x, 0, 0.27), r=0.003, mat='silver/reflective')
        parts[nm] = p.build(mats, (x, 0, HIP_Z), parts['hip'], coll, (0, 0, HIP_Z))

    # torso: straight box, collar, optional front and back prints
    p = Part(pre + 'torso')
    tz0, tz1 = WAIST_Z, NECK_Z
    rbox(p, KN, (0.40, 0.24, tz1 - tz0), (0, 0, (tz0 + tz1) / 2), r=0.022, mat=fk['shirt'])
    rbox(p, KN, (0.24, 0.17, 0.05), (0, 0, tz1 - 0.005), r=0.02, mat=fk['shirt'])
    if torso_print:
        p.project('print_torso', lambda c, n: n.y < -0.5 and c.z < tz1 - 0.03,
                  lambda q: ((q.x + 0.20) / 0.40, (q.z - tz0) / (tz1 - tz0)))
        if 'print_torso_back' in mats:
            p.project('print_torso_back', lambda c, n: n.y > 0.5 and c.z < tz1 - 0.03,
                      lambda q: ((0.20 - q.x) / 0.40, (q.z - tz0) / (tz1 - tz0)))
        # the sides take the band-only left edge of the front print, so the reflective bands wrap round
        p.project('print_torso', lambda c, n: abs(n.x) > 0.5 and c.z < tz1 - 0.03,
                  lambda q: (0.01 + 0.08 * (q.y + 0.12) / 0.24, (q.z - tz0) / (tz1 - tz0)))
    parts['torso'] = p.build(mats, (0, 0, WAIST_Z), parts['hip'], coll, (0, 0, HIP_Z))

    # head: neck post and a rounded cube with a flat printed face
    p = Part(pre + 'head')
    cyl(p, KN, 0.062, 0.05, M=T(0, 0, NECK_Z - 0.015), mat=fk['skin'], b0=0.0, b1=0.006)
    rbox(p, KN, HEAD, HEAD_C, r=0.07, mat=fk['skin'])
    if face:
        hz0 = HEAD_C[2] - HEAD[2] / 2
        p.project('print_face_' + face, lambda c, n: n.y < -0.35 and c.z > hz0 + 0.004,
                  lambda q: ((q.x + HEAD[0] / 2) / HEAD[0], (q.z - hz0) / HEAD[2]))
    parts['head'] = p.build(mats, (0, 0, NECK_Z), parts['torso'], coll, (0, 0, WAIST_Z))

    p = Part(pre + 'hat')
    build_hat(p, TEAM['hat'], fk)
    parts['hat'] = p.build(mats, (0, 0, HAT_Z), parts['head'], coll, (0, 0, NECK_Z))

    for side, sfx in ((1, 'l'), (-1, 'r')):
        x = side * SH_X
        p = Part(pre + 'arm_' + sfx)
        rbox(p, KN, (0.10, 0.12, SH_Z - WRIST_Z), (x, 0, (SH_Z + WRIST_Z) / 2), r=0.016, mat=fk['shirt'])
        cyl(p, KN, 0.06, 0.10, M=T(x - 0.05, 0, SH_Z) @ R(90, 'Y'), mat=fk['shirt'], b0=0.012, b1=0.012)
        rbox(p, KN, (0.106, 0.126, 0.04), (x, 0, 0.885), r=0.005, mat='lime/reflective')
        rbox(p, KN, (0.107, 0.127, 0.013), (x, 0, 0.885), r=0.003, mat='silver/reflective')
        parts['arm_' + sfx] = p.build(mats, (x, 0, SH_Z), parts['torso'], coll, (0, 0, WAIST_Z))

        # mitten: rounded palm block plus a thumb on the inner front edge
        p = Part(pre + 'hand_' + sfx)
        cyl(p, KN, 0.038, 0.03, M=T(x, 0, WRIST_Z - 0.02), mat=fk['skin'], b0=0.0, b1=0.0)
        rbox(p, KN, (0.10, 0.13, 0.13), (x, -0.005, 0.775), r=0.04, mat=fk['skin'])
        rbox(p, KN, (0.046, 0.06, 0.08), (0, 0, 0), r=0.021, mat=fk['skin'],
             M=T(x - side * 0.036, -0.068, 0.795) @ R(-18, 'X') @ R(side * 12, 'Z'))
        parts['hand_' + sfx] = p.build(mats, (x, 0, WRIST_Z), parts['arm_' + sfx], coll, (x, 0, SH_Z))

    if item:
        p = Part(pre + 'item')
        build_item(p, item)
        parts['item'] = p.build(mats, GRIP, parts['hand_l'], coll, (SH_X, 0, WRIST_Z))
    return root, parts


def build_hat(p, style, fk):
    if style != 'helmet':
        raise ValueError('only the helmet is in the Gold Master so far: ' + style)
    hat, trim = fk['hat'], fk['trim']
    zc, yc = 1.435, 0.01
    # crown: a rounded box like the head (the same design language), flat on top for the stud; its lower
    # rounding is buried below the brim
    cw, cd, cz0, cz1, cr = 0.35, 0.34, 1.38, 1.60, 0.07
    rbox(p, KN, (cw, cd, cz1 - cz0), (0, yc, (cz0 + cz1) / 2), r=cr, mat=hat)
    # brim: an ellipse shifted back, long and sloping at the rear, with a rounded edge
    ax, ay, cy, t = 0.235, 0.26, 0.075, 0.022

    def drop(y):
        return -0.32 * max(0.0, y - 0.11)

    def ring(s, b):
        rad, dz = b
        pts = []
        n = KN.round_segs
        for k in range(n):
            a = 2 * math.pi * k / n
            ex, ey = ax * math.cos(a), ay * math.sin(a)
            nx, ny = math.cos(a) / ax, math.sin(a) / ay
            nl = math.hypot(nx, ny)
            px, py = ex * s + nx / nl * rad, cy + ey * s + ny / nl * rad
            pts.append((px, py, zc - 0.007 + drop(py) + dz))
        return pts

    ss = (0.06, 0.35, 0.6, 0.8, 0.93) if KN.curve_segs >= 8 else (0.06, 0.6, 0.93)
    nr = 8 if KN.bevel_segs >= 4 else max(1, KN.bevel_segs * 2)        # spans round the brim edge
    prof = [(sv, (0, t / 2)) for sv in ss]
    for k in range(0, nr + 1):
        a = math.pi / 2 - math.pi * k / nr
        prof.append((1.0, (t / 2 * math.cos(a), t / 2 * math.sin(a))))
    prof += [(sv, (0, -t / 2)) for sv in reversed(ss)]
    bm = bm_sweep([(s, b) for s, b in prof], ring, sharp=None)
    rows = [v for v in bm.verts]
    n = KN.round_segs
    bm_cap(bm, rows[:n], True)
    bm_cap(bm, rows[-n:], False)
    p.add(bm, None, hat, recalc=True)
    # comb: a rib up the front face, over the rounded edge and along the top to the stud; and one at the back
    def comb_path(z0, y_end, steps=8 if KN.curve_segs >= 8 else max(1, KN.curve_segs)):
        """(y, z, ny, nz) points along the crown's front profile at x = 0."""
        hy, ztop = cd / 2, cz1
        pts = []
        for i in range(steps + 1):
            z = z0 + (ztop - cr - z0) * i / steps
            pts.append((yc - hy, z, -1.0, 0.0))
        for i in range(1, KN.curve_segs * 2):
            a = math.pi - math.pi / 2 * i / (KN.curve_segs * 2)
            pts.append((yc - hy + cr + cr * math.cos(a), ztop - cr + cr * math.sin(a), math.cos(a), math.sin(a)))
        for i in range(steps + 1):
            y = yc - hy + cr + (y_end - (yc - hy + cr)) * i / steps
            pts.append((y, ztop, 0.0, 1.0))
        return pts
    for back in (False, True):
        path = comb_path(1.44 if not back else 1.425, yc - STUD_R - 0.004)
        if back:
            path = [(2 * yc - y, z, -ny, nz) for y, z, ny, nz in path]
        rings = []
        for y, z, ny, nz in path:
            sec = []
            nsec = 12 if KN.bevel_segs >= 4 else max(2, KN.bevel_segs * 3)
            for j in range(nsec + 1):
                a = math.pi * j / nsec
                w, h = 0.021 * math.cos(a), 0.024 * math.sin(a)
                sec.append((w, y + ny * (h - 0.006), z + nz * (h - 0.006)))
            rings.append(sec)
        bm2, vr = bm_loft(rings, group=1, closed=True)
        bm_cap(bm2, vr[0], True)
        bm_cap(bm2, vr[-1], False)
        p.add(bm2, None, hat, recalc=True)
    if KN.studs == 'geo':
        p.add(bm_stud(KN), T(0, yc, cz1), hat)
    # front shield (badge holder) on the flat front face, the badge inset in the hat colour
    yf = yc - cd / 2
    rbox(p, KN, (0.14, 0.024, 0.10), (0, 0, 0), r=0.01, mat=trim, M=T(0, yf - 0.010, 1.497) @ R(7, 'X'))
    rbox(p, KN, (0.11, 0.01, 0.074), (0, 0, 0), r=0.006, mat=hat, M=T(0, yf - 0.023, 1.498) @ R(7, 'X'))


def build_item(p, item, at=GRIP):
    gx, gy, gz = at
    if item == 'towel':
        col = KART['item_col']['towel']
        rbox(p, KN, (0.045, 0.17, 0.38), (gx, gy, gz - 0.165), r=0.016, mat=col)
        for z in (gz - 0.30, gz - 0.27):
            rbox(p, KN, (0.0475, 0.1725, 0.016), (gx, gy, z), r=0.004, mat=C['tub'])
        rbox(p, KN, (0.05, 0.175, 0.026), (gx, gy, gz - 0.342), r=0.01, mat=col)
    elif item == 'mat':
        col = KART['item_col']['mat']
        rbox(p, KN, (0.03, 0.30, 0.37), (gx, gy, gz - 0.16), r=0.01, mat=col)
        for i in range(6):
            rbox(p, KN, (0.038, 0.27, 0.018), (gx, gy, gz - 0.03 - 0.055 * i), r=0.007, mat=col)
        for i in range(9):
            y = gy - 0.13 + 0.26 * i / 8
            cyl(p, KN, 0.008, 0.035, M=T(gx, y, gz - 0.345 - 0.035), mat='white', segs=max(4, KN.round_segs // 4),
                b0=0.003, b1=0.0)
    elif item == 'soap':
        col = KART['item_col']['soap']
        rbox(p, KN, (0.10, 0.15, 0.07), (gx, gy - 0.08, gz - 0.015), r=0.026, mat=col)
        rbox(p, KN, (0.056, 0.092, 0.014), (gx, gy - 0.08, gz + 0.017), r=0.0065, mat=col)
        for (dx, dy, r) in ((0.012, -0.11, 0.019), (-0.02, -0.06, 0.014), (0.022, -0.04, 0.011)):
            sphere(p, KN, r, M=T(gx + dx, gy + dy, gz + 0.022 + r * 0.7), mat='white/water',
                   segs=max(4, KN.round_segs * 3 // 8))
    elif item == 'loofah':
        col = KART['item_col']['loofah']
        bm = bm_sphere(1.0, KN.round_segs * 3 // 2, KN.round_segs * 3 // 4)
        for v in bm.verts:
            d = v.co.normalized()
            u = math.atan2(d.y, d.x)
            w = math.acos(max(-1.0, min(1.0, d.z)))
            v.co = d * (1.0 + 0.05 * math.sin(14 * u) * math.sin(12 * w))
        p.add(bm, T(gx, gy - 0.06, gz - 0.02) @ S(0.068, 0.078, 0.095), col)
        nl = max(4, KN.round_segs // 4)
        loop = [(0.006 * math.cos(2 * math.pi * k / nl), 0.026 + 0.006 * math.sin(2 * math.pi * k / nl))
                for k in range(nl)]
        p.add(bm_lathe(loop, max(6, KN.round_segs * 3 // 4), axis='X', closed=True), T(gx, gy - 0.06, gz + 0.085),
              'white', recalc=True)
    else:
        raise ValueError(item)


# ---------------------------------------------------------------- tub
TUB_C = 0.44           # half-length of the stadium's centre line (0.86 - 0.42)
ROLL = (0.432, 1.018, 0.026)


def stadium(d, z, ns=None, na=None):
    """Double-ended tub plan: points at distance d from the centre line y in [-c, c], counter-clockwise
    seen from above, the same count for every d."""
    na = na or max(2, KN.round_segs // 2)
    ns = ns or max(1, KN.round_segs // 6)
    c = TUB_C
    pts = []
    for j in range(ns):
        pts.append((d, -c + 2 * c * j / ns, z))
    for j in range(na):
        a = math.pi * j / na
        pts.append((d * math.cos(a), c + d * math.sin(a), z))
    for j in range(ns):
        pts.append((-d, c - 2 * c * j / ns, z))
    for j in range(na):
        a = math.pi + math.pi * j / na
        pts.append((d * math.cos(a), -c + d * math.sin(a), z))
    return pts


def d_out(z):
    return 0.415 - 0.10 * ((0.985 - z) / 0.535) ** 2.2


def d_in(z):
    return 0.398 - 0.10 * ((0.985 - z) / 0.465) ** 2.0


def tub_profile():
    """Wall profile (d, z). Below Gold Master knobs (curve_segs < 8) it thins out, always keeping the band
    edges at 0.70 and 0.80 m."""
    full = KN.curve_segs >= 8
    lo = KN.curve_segs < 3
    prof = [(0.24, 0.42), (0.265, 0.4215), (0.286, 0.427), (0.303, 0.436)] if full else [(0.24, 0.42), (0.303, 0.436)]
    outer = (0.45, 0.48, 0.52, 0.57, 0.63, 0.70, 0.75, 0.80, 0.86, 0.92, 0.96, 0.985) if full else \
        ((0.45, 0.70, 0.80, 0.985) if lo else (0.45, 0.57, 0.70, 0.80, 0.92, 0.985))
    for z in outer:
        prof.append((d_out(z), z))
    rx, rz, rr = ROLL
    n = max(3, KN.curve_segs * 2)
    for k in range(n + 1):
        a = math.radians(-130 + 310 * k / n)
        prof.append((rx + rr * math.cos(a), rz + rr * math.sin(a)))
    inner = (0.96, 0.92, 0.86, 0.80, 0.72, 0.65, 0.59, 0.55) if full else ((0.86, 0.60) if lo else (0.92, 0.80, 0.65, 0.55))
    for z in inner:
        prof.append((d_in(z), z))
    prof += [(0.278, 0.531), (0.255, 0.5235), (0.22, 0.52)] if full else [(0.255, 0.5235), (0.22, 0.52)]
    return prof


def tub_mat(c, n):
    dd = abs(c.x) if abs(c.y) <= TUB_C else math.hypot(c.x, abs(c.y) - TUB_C)
    rad = Vector((c.x, 0.0 if abs(c.y) <= TUB_C else c.y - math.copysign(TUB_C, c.y), 0)).normalized()
    if c.z > 0.99 and dd > 0.40:
        return C['trim']
    if n.dot(rad) < -0.05 or (n.z > 0.5 and c.z > 0.5):
        return 'enamel/enamel'
    if 0.70 <= c.z <= 0.80 and abs(c.y) <= TUB_C:
        return C['flag']
    return C['tub']


def wheel_bm():
    """Left wheel around +X: tyre and hub as two lathes, plus lug bolts. Returns list of (bm, mat)."""
    out = []
    t = []
    sh = 0.036
    sb = 8 if KN.bevel_segs >= 4 else max(2, KN.bevel_segs * 2)      # shoulder arc steps
    t.append((-0.064, 0.19))
    if KN.bevel_segs >= 2:
        t.append((-0.07, 0.21))
    t.append((-0.072, 0.24))
    t.append((-0.07, 0.30 - sh))
    for k in range(1, sb):
        a = math.pi - math.pi / 2 * k / sb
        t.append((-0.07 + sh + sh * math.cos(a), 0.30 - sh + sh * math.sin(a)))
    if KN.bevel_segs >= 2:                                               # two tread grooves
        xs = [-0.034, -0.026, -0.0255, -0.0105, -0.010, 0.010, 0.0105, 0.0255, 0.026, 0.034]
        rs = [0.30, 0.30, 0.292, 0.292, 0.30, 0.30, 0.292, 0.292, 0.30, 0.30]
    else:
        xs, rs = [-0.034, 0.034], [0.30, 0.30]
    t += list(zip(xs, rs))
    for k in range(1, sb):
        a = math.pi / 2 - math.pi / 2 * k / sb
        t.append((0.07 - sh + sh * math.cos(a), 0.30 - sh + sh * math.sin(a)))
    t += [(0.072, 0.24), (0.07, 0.21), (0.064, 0.19)] if KN.bevel_segs >= 2 else [(0.072, 0.24), (0.064, 0.19)]
    out.append((bm_lathe(t, KN.round_segs * 2, axis='X', closed=True), 'black/rubber'))
    h = [(-0.05, 0.0), (-0.05, 0.12), (-0.058, 0.17), (-0.062, 0.192), (0.062, 0.192), (0.066, 0.18),
         (0.06, 0.165), (0.046, 0.16), (0.046, 0.085), (0.07, 0.078), (0.08, 0.06), (0.08, 0.024),
         (0.062, 0.02), (0.062, 0.0)]
    out.append((bm_lathe(h, KN.round_segs * 2, axis='X'), 'hub'))
    for k in range(6):
        a = 2 * math.pi * k / 6 + math.pi / 6
        bm = bm_cyl(0.019, 0.016, max(6, KN.round_segs // 2), cap0=False, b1=0.004, bsegs=KN.bevel_segs)
        out.append((bm, ('lug', a)))
    return out


def build_tub(coll, mats):
    root = bpy.data.objects.new('tub', None)
    coll.objects.link(root)
    parts = {}
    p = Part('body')
    # chassis: a 3 x 5 studded plate (0.84 x 1.40 m; the game frame is 1.0 x 1.5) with its top at 0.356 m,
    # two plate-high axle blocks underneath and round axle bosses
    plate(p, KN, 3, 5, M=T(0, 0, 0.356 - PLATE), mat='iron')
    for y in (-0.6, 0.6):
        brick(p, KN, 3, 1, plates=1, M=T(0, y, 0.356 - 2 * PLATE), mat='iron', top=False)
        for s in (1, -1):
            cyl(p, KN, 0.055, 0.06, M=T(s * 0.405, y, 0.30) @ R(s * 90, 'Y'), mat='iron', b0=0.0, b1=0.008)
            cyl(p, KN, 0.022, 0.16, M=T(s * 0.46, y, 0.30) @ R(s * 90, 'Y'), mat='silver/metal', b0=0.0, b1=0.004)
    # claw feet on four studs: a socket over the stud and a ball gripped by three claws; the top of the
    # ball is buried in the cast-iron wall (the shell is 0.44-0.55 m thick at the feet)
    for sx in (1, -1):
        for sy in (1, -1):
            x, y = sx * PITCH, sy * 2 * PITCH
            rad = Vector((x, y - math.copysign(TUB_C, y), 0)).normalized()
            cyl(p, KN, 0.098, 0.068, M=T(x, y, 0.356), mat=C['trim'], b0=0.006, b1=0.014)
            bz = 0.458
            sphere(p, KN, 0.058, M=T(x, y, bz), mat=C['trim'])
            for k in (-1, 0, 1):
                a = math.atan2(rad.y, rad.x) + k * 0.95
                d = Vector((math.cos(a), math.sin(a), 0))
                M = T(x + d.x * 0.052, y + d.y * 0.052, bz - 0.008) @ R(math.degrees(a), 'Z') @ R(-28, 'Y')
                rbox(p, KN, (0.042, 0.03, 0.07), (0, 0, 0), r=0.013, M=M, mat=C['trim'])
    # the tub shell: one sweep from the outer bottom, up the wall, round the rolled rim, down the enamel
    prof = tub_profile()
    bm = bm_sweep(prof, lambda d, z: stadium(d, z))
    n = len(stadium(0.3, 0))
    vs = list(bm.verts)
    bm_cap(bm, vs[:n], False)
    bm_cap(bm, vs[-n:], True)
    p.add(bm, None, tub_mat, recalc=True)
    parts['body'] = p.build(mats, (0, 0, 0), root, coll)

    hub_cols = {'hub': 'light_grey'}
    names = {(1, -1): 'wheel_fl', (-1, -1): 'wheel_fr', (1, 1): 'wheel_rl', (-1, 1): 'wheel_rr'}
    for gx, gy, gz in KART['wheels']:
        bx, by, bz = g2b(gx, gy, gz)
        side = 1 if bx > 0 else -1
        nm = names[(side, 1 if by > 0 else -1)]
        p = Part(nm)
        M = T(bx, by, bz) @ (S(-1, 1, 1) if side < 0 else Matrix.Identity(4))
        for bm, key in wheel_bm():
            if isinstance(key, tuple):
                a = key[1]
                p.add(bm, M @ T(0.044, 0.115 * math.cos(a), 0.115 * math.sin(a)) @ R(90, 'Y'), 'silver/metal')
            elif key == 'hub':
                p.add(bm, M, lambda c, n, bx=bx: C['trim'] if abs(c.x - bx) > 0.04 and
                      math.hypot(c.y - by, c.z - bz) < 0.085 else 'light_grey', recalc=True)
            else:
                p.add(bm, M, key, recalc=True)
        parts[nm] = p.build(mats, (bx, by, bz), root, coll)

    # flag on its pole; pivot at the pole base on the rim
    fb = Vector(g2b(-0.3, 1.0, -0.72))
    p = Part('flag')
    cyl(p, KN, 0.046, 0.075, M=T(fb.x, fb.y, fb.z - 0.02), mat=C['trim'], b0=0.006, b1=0.01)
    cyl(p, KN, 0.022, 1.25, M=T(fb.x, fb.y, fb.z), mat='light_grey', b0=0.0, b1=0.004)
    sphere(p, KN, 0.04, M=T(fb.x, fb.y, fb.z + 1.27), mat=C['trim'])
    fl, fh, ft = 0.55, 0.35, 0.016
    # cross-section: flat faces with rounded top and bottom edges, so the big faces shade flat
    nf = 6 if KN.curve_segs >= 8 else max(1, KN.curve_segs)          # spans down each flat face
    na = 6 if KN.bevel_segs >= 4 else max(1, KN.bevel_segs + 1)      # spans round each edge
    sec = [(ft / 2, fh / 2 - ft / 2 - (fh - ft) * j / nf) for j in range(nf + 1)]
    sec += [(ft / 2 * math.cos(a), -fh / 2 + ft / 2 + ft / 2 * math.sin(a))
            for a in [-math.pi * k / na for k in range(1, na)]]
    sec += [(-ft / 2, -fh / 2 + ft / 2 + (fh - ft) * j / nf) for j in range(nf + 1)]
    sec += [(ft / 2 * math.cos(a), fh / 2 - ft / 2 + ft / 2 * math.sin(a))
            for a in [math.pi - math.pi * k / na for k in range(1, na)]]
    rings = []
    steps = 32 if KN.curve_segs >= 8 else max(2, KN.curve_segs * 4)
    for i in range(steps + 1):
        u = i / steps
        wave = 0.028 * math.sin(2 * math.pi * u * 1.1) * u
        y = fb.y + 0.035 + fl * u
        rings.append([(fb.x + wave + sx, y, fb.z + 0.85 + fh / 2 + sz) for sx, sz in sec])
    bm2, vr = bm_loft(rings, group=1, closed=True)
    bm_cap(bm2, vr[0], True)
    bm_cap(bm2, vr[-1], False)
    p.add(bm2, None, C['flag'], recalc=True)
    for z in (0.88, 1.17):
        p.add(bm_tube(0.034, 0.022, 0.045, max(6, KN.round_segs // 2), b=0.004 if KN.bevel_segs else 0.0),
              T(fb.x, fb.y, fb.z + z - 0.0225), C['flag'])
    parts['flag'] = p.build(mats, tuple(fb), root, coll)

    # rubber duck on the front-left of the rim
    db = Vector(g2b(0.3, 1.03, 0.72))
    p = Part('duck')
    duck = 'duck'
    sphere(p, KN, 1.0, M=T(db.x, db.y + 0.005, db.z + 0.068) @ S(0.078, 0.102, 0.07), mat=duck)
    sphere(p, KN, 1.0, M=T(db.x, db.y + 0.085, db.z + 0.105) @ R(-35, 'X') @ S(0.03, 0.03, 0.05), mat=duck)
    for s in (1, -1):
        sphere(p, KN, 1.0, M=T(db.x + s * 0.068, db.y + 0.015, db.z + 0.08) @ S(0.02, 0.055, 0.035), mat=duck)
    sphere(p, KN, 0.056, M=T(db.x, db.y - 0.045, db.z + 0.17), mat=duck)
    rbox(p, KN, (0.05, 0.06, 0.022), (0, 0, 0), r=0.01, M=T(db.x, db.y - 0.105, db.z + 0.16) @ R(-8, 'X'),
         mat='beak')
    for s in (1, -1):
        sphere(p, KN, 0.0095, M=T(db.x + s * 0.026, db.y - 0.093, db.z + 0.19), mat='black',
               segs=max(4, KN.round_segs * 3 // 8))
    parts['duck'] = p.build(mats, tuple(db), root, coll)

    # water surface at 75 % fill; pivot at its centre
    wz = 0.5 + 0.48 * 0.75
    p = Part('water')
    dw = d_in(wz) - 0.003
    bm3, vr = bm_loft([stadium(dw * f, wz) for f in (0.25, 0.5, 0.75, 1.0)], group=1, closed=True)
    bm_cap(bm3, vr[0], True)
    p.add(bm3, None, 'water/water', recalc=False)
    parts['water'] = p.build(mats, (0, 0, wz), root, coll)
    return root, parts


# ---------------------------------------------------------------- prints
# Raw Codex images in art-src/tex/brick (git-ignored, prompts in PROMPTS-*.md) are cut and keyed into
# decals here, then composited onto the part colour, so the GLB needs only a base-colour texture.
FACE_ORDER = ['neutral', 'determined', 'shouting', 'shocked', 'cheering', 'dizzy', 'laughing', 'worried']
HEAD_ASPECT = HEAD[0] / HEAD[2]                      # printable head front, width / height
TORSO_ASPECT = 0.40 / (NECK_Z - WAIST_Z)             # torso front, width / height


def _load(path):
    """RGBA float array, rows top to bottom (Blender stores them bottom-up)."""
    import numpy as np
    img = bpy.data.images.load(path)
    w, h = img.size
    a = np.empty(w * h * 4, dtype=np.float32)
    img.pixels.foreach_get(a)
    bpy.data.images.remove(img)
    return a.reshape(h, w, 4)[::-1].copy()


def _save(a, path, alpha=True):
    import numpy as np
    h, w = a.shape[:2]
    img = bpy.data.images.new('tmp_save', w, h, alpha=alpha)
    img.pixels.foreach_set(np.ascontiguousarray(a[::-1]).astype(np.float32).ravel())
    img.filepath_raw = path
    img.file_format = 'PNG'
    img.save()
    bpy.data.images.remove(img)
    return path


def _dilate(m):
    g = m.copy()
    g[1:] |= m[:-1]
    g[:-1] |= m[1:]
    g[:, 1:] |= m[:, :-1]
    g[:, :-1] |= m[:, 1:]
    return g


def key_white(a, thr=0.9, band=2, flood=True):
    """Key out the near-white background. flood=True keys only white connected to the border, so white
    inside the art (eye highlights, teeth) stays; flood=False keys every near-white pixel (for prints
    with no intended white, where straps and bands enclose background). Pixels within `band` px of the
    background are un-blended from the background white (colour-to-alpha)."""
    import numpy as np
    rgb = a[..., :3]
    mn = rgb.min(axis=2)
    white = mn > thr
    if flood:
        m = np.zeros_like(white)
        m[0], m[-1], m[:, 0], m[:, -1] = white[0], white[-1], white[:, 0], white[:, -1]
        n = -1
        while True:
            m = _dilate(m) & white
            c = int(m.sum())
            if c == n:
                break
            n = c
    else:
        m = white.copy()
    bgw = np.median(rgb[m], axis=0) if m.any() else np.ones(3)
    e = m.copy()
    for _ in range(band):
        e = _dilate(e)
    edge = e & ~m
    k = float(bgw.min())
    alpha = np.ones(white.shape, dtype=np.float32)
    alpha[m] = 0.0
    ae = np.clip((k - mn[edge]) / k, 0.0, 1.0)
    alpha[edge] = ae
    out = rgb.copy()
    out[edge] = np.clip((rgb[edge] - (1 - ae)[:, None] * bgw) / np.maximum(ae, 1e-3)[:, None], 0, 1)
    out[m] = 0.0
    return np.dstack([out, alpha])


def _ink_box(alpha, thr=0.5):
    import numpy as np
    ys, xs = np.nonzero(alpha > thr)
    return (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1) if len(xs) else None


def _crop(a, x0, y0, x1, y1):
    """Crop with transparent padding where the window leaves the image."""
    import numpy as np
    h, w = a.shape[:2]
    out = np.zeros((y1 - y0, x1 - x0, 4), dtype=np.float32)
    sx0, sy0, sx1, sy1 = max(0, x0), max(0, y0), min(w, x1), min(h, y1)
    out[sy0 - y0:sy1 - y0, sx0 - x0:sx1 - x0] = a[sy0:sy1, sx0:sx1]
    return out


def _band_tops(a, col=30):
    """Top rows of the reflective bands: runs of lime pixels down one column near the edge."""
    px = a[:, col, :3]
    lime = (px[:, 1] > 0.75) & (px[:, 2] < 0.45) & (px[:, 0] > 0.55) & (a[:, col, 3] > 0.5)
    tops, last = [], -999
    for r in range(len(lime)):
        if lime[r]:
            if r - last > 120:
                tops.append(r)
            last = r
    return tops


def prepare_prints():
    """Cut and key the Codex images into decal PNGs. Returns {'faces': [...], 'front': path, 'back': path}."""
    import numpy as np
    out = {'faces': [], 'front': None, 'back': None, 'notes': {}}
    sheet = os.path.join(TEX, 'face_sheet.png')
    if os.path.exists(sheet):
        a = key_white(_load(sheet))
        h, w = a.shape[:2]
        cw, ch = w // 4, h // 2
        boxes = [_ink_box(a[(i // 4) * ch:(i // 4 + 1) * ch, (i % 4) * cw:(i % 4 + 1) * cw, 3]) for i in range(8)]
        # one crop window for every expression, so the eyes sit in the same place on every face
        bx0, by0 = min(b[0] for b in boxes if b), min(b[1] for b in boxes if b)
        bx1, by1 = max(b[2] for b in boxes if b), max(b[3] for b in boxes if b)
        mx, my = (bx0 + bx1) / 2, (by0 + by1) / 2
        hh = max(by1 - by0, (bx1 - bx0) / HEAD_ASPECT) / 0.86
        ww = hh * HEAD_ASPECT
        for i, name in enumerate(FACE_ORDER):
            cx, cy = (i % 4) * cw, (i // 4) * ch
            x0, y0 = int(round(cx + mx - ww / 2)), int(round(cy + my - hh / 2))
            _save(_crop(a, x0, y0, x0 + int(round(ww)), y0 + int(round(hh))), os.path.join(TEX, 'face_%s.png' % name))
            out['faces'].append(name)
        out['notes']['face_window_px'] = [int(round(ww)), int(round(hh))]
    front = os.path.join(TEX, 'torso_engine-six.png')
    if os.path.exists(front):
        a = key_white(_load(front), flood=False)
        h, w = a.shape[:2]
        H = int(round(w / TORSO_ASPECT))
        b = _ink_box(a[..., 3])
        r0 = int(round((b[1] + b[3]) / 2 - H / 2))
        fa = _crop(a, 0, r0, w, r0 + H)
        out['front'] = _save(fa, os.path.join(TEX, 'print_torso_engine-six.png'))
        back = os.path.join(TEX, 'torso_engine-six_back.png')
        if os.path.exists(back):
            ba = key_white(_load(back), flood=False)
            tf, tb = _band_tops(fa), _band_tops(ba)
            out['notes']['band_tops_front_back'] = [tf, tb]
            if len(tf) >= 2 and len(tb) >= 2:
                # resample rows so the back's two bands line up with the front's
                s = (tb[1] - tb[0]) / (tf[1] - tf[0])
                rows = np.clip(np.round(tb[0] + (np.arange(H) - tf[0]) * s).astype(int), 0, ba.shape[0] - 1)
                bb = ba[rows][:, :w]
            else:
                bb = _crop(ba, 0, r0, w, r0 + H)
            out['back'] = _save(bb, os.path.join(TEX, 'print_torso_engine-six_back.png'))
    return out


PRINT_NOTES = {}


def prints(mats, team_cols):
    """Decal materials: each print composited over its part colour. Returns (face names, torso flag)."""
    if not PRINTS or not os.path.isdir(TEX):
        return [], False
    import numpy as np
    pp = prepare_prints()
    PRINT_NOTES.update(pp['notes'])

    def comp(src, base_hex, dst):
        a = _load(src)
        base = np.array(hexc(base_hex), dtype=np.float32)
        al = a[..., 3:4]
        rgb = a[..., :3] * al + base * (1 - al)
        return _save(np.dstack([rgb, np.ones_like(al[..., 0])]), dst, alpha=False)
    for f in pp['faces']:
        dst = comp(os.path.join(TEX, 'face_%s.png' % f), team_cols['skin'], os.path.join(TEX, 'comp_face_%s.png' % f))
        mats['print_face_' + f] = plastic('print_face_' + f, team_cols['skin'], 'abs', image=dst)
    if pp['front']:
        dst = comp(pp['front'], team_cols['shirt'], os.path.join(TEX, 'comp_torso_engine-six.png'))
        mats['print_torso'] = plastic('print_torso_engine-six', team_cols['shirt'], 'abs', image=dst)
    if pp['back']:
        dst = comp(pp['back'], team_cols['shirt'], os.path.join(TEX, 'comp_torso_engine-six_back.png'))
        mats['print_torso_back'] = plastic('print_torso_engine-six_back', team_cols['shirt'], 'abs', image=dst)
    return pp['faces'], bool(pp['front'])


# ---------------------------------------------------------------- poses
def pose_push(parts, lean=0.3, arm=-80, swing=0.35, yaw=0.0, root=None):
    parts['torso'].rotation_euler = (lean, 0, 0)
    for s in ('l', 'r'):
        parts['arm_' + s].rotation_euler = (math.radians(arm), 0, math.radians(-6 if s == 'l' else 6))
        parts['hand_' + s].rotation_euler = (math.radians(25), 0, 0)
    parts['leg_l'].rotation_euler = (swing, 0, 0)
    parts['leg_r'].rotation_euler = (-swing, 0, 0)
    if root is not None:
        root.rotation_euler = (0, 0, math.radians(yaw))


# ---------------------------------------------------------------- render rig
def rig(coll):
    """Lights on a rig that orbits with the camera, so every view of the turntable is lit the same."""
    r = bpy.data.objects.new('rig', None)
    coll.objects.link(r)
    cam = camera(coll, 'cam', lens=70)
    lights = [area(coll, 'key', (-3.4, -3.4, 4.4), (0, 0, 0.8), 3.2, 1300, (1.0, 0.96, 0.9), r),
              area(coll, 'fill', (4.2, -2.6, 1.8), (0, 0, 0.8), 3.5, 220, (0.9, 0.95, 1.0), r),
              area(coll, 'rim', (2.2, 3.8, 3.6), (0, 0, 1.0), 2.4, 900, (1.0, 1.0, 1.0), r),
              area(coll, 'rim2', (-3.0, 3.0, 2.6), (0, 0, 1.0), 1.6, 380, (0.95, 0.97, 1.0), r),
              # a broad, dim softbox behind the camera: the long sheen on the big flat faces of glossy plastic
              area(coll, 'sheen', (0.0, -7.6, 3.4), (0, 0, 0.9), 5.0, 900, (1.0, 1.0, 1.0), r, size_y=2.2),
              area(coll, 'top', (0, -0.6, 6.0), (0, 0, 0.6), 4.0, 260, (1.0, 1.0, 1.0), r, shape='DISK')]
    return r, cam, lights


def place(rig_o, cam, target, dist, elev, yaw):
    """Orbit the light rig `yaw` degrees about Z (counter-clockwise from above; 0 = from the front, -Y)
    and put the camera `dist` m from target at `elev` degrees, on the same bearing."""
    rig_o.rotation_euler = (0, 0, math.radians(yaw))
    e, y = math.radians(elev), math.radians(yaw)
    off = Matrix.Rotation(y, 3, 'Z') @ Vector((0, -dist * math.cos(e), dist * math.sin(e)))
    look(cam, Vector(target) + off, Vector(target))
    bpy.context.view_layer.update()


def shoot(rig_o, cam, name, target, dist, elev, yaw, lens=70):
    if PREVIEW and name not in PREVIEW_SHOTS:
        return None
    cam.data.lens = lens
    place(rig_o, cam, target, dist, elev, yaw)
    return render_to(os.path.join(OUT, name + '.png'))


def set_visible(objs, on):
    for o in objs:
        o.hide_render = not on


def all_in(roots):
    out = []
    for r in roots:
        out += descendants(r)
    return out


# ---------------------------------------------------------------- fidelity references
def fidelity(rig_o, cam, roots, backdrop, stats):
    """Figure at 400, 55 and 20 px tall, rendered 4 x 4 larger and box-filtered (16x supersampled),
    orthographic, transparent, from the front 3/4 and the chase view."""
    sc = bpy.context.scene
    backdrop.hide_render = True
    objs = [o for o in all_in(roots) if o.type == 'MESH']
    dg = bpy.context.evaluated_depsgraph_get()
    pts = []
    for o in objs:
        e = o.evaluated_get(dg)
        me = e.to_mesh()
        pts += [e.matrix_world @ v.co for v in me.vertices]
        e.to_mesh_clear()
    views = {'front34': (30.0, 10.0), 'chase': (180.0, 18.0)}
    out = {}
    cam.data.type = 'ORTHO'
    for vn, (yaw, elev) in views.items():
        place(rig_o, cam, (0, 0, 0.85), 10.0, elev, yaw)
        Mi = cam.matrix_world.inverted()
        cp = [Mi @ q for q in pts]
        xs, ys = [q.x for q in cp], [q.y for q in cp]
        hgt = max(ys) - min(ys)
        cx, cy = (max(xs) + min(xs)) / 2, (max(ys) + min(ys)) / 2
        cam.location = cam.matrix_world @ Vector((cx, cy, 0))      # centre the projected box
        bpy.context.view_layer.update()
        for px in (400, 55, 20):
            H = int(round(px * 1.25))
            cycles(samples=max(64, SAMPLES // 2), res=(H * 4, H * 4), transparent=True)
            cam.data.ortho_scale = hgt * H / px
            big = os.path.join(OUT, 'fidelity_%s_%dpx_4x.png' % (vn, px))
            render_to(big)
            dst = os.path.join(OUT, 'fidelity_%s_%dpx.png' % (vn, px))
            box_down(big, dst, 4)
            out['%s_%dpx' % (vn, px)] = dict(file=os.path.relpath(dst, GAME).replace('\\', '/'), size=[H, H],
                                             figure_px=px, ortho_scale=round(hgt * H / px, 5), yaw=yaw, elev=elev,
                                             projected_height_m=round(hgt, 5))
    cam.data.type = 'PERSP'
    backdrop.hide_render = False
    stats['fidelity'] = dict(method='Cycles, orthographic, transparent film, rendered 4x4 larger and box-filtered in '
                             'linear light with premultiplied alpha (16x supersampled); the figure spans exactly '
                             'figure_px rows; yaw is the camera orbit from the front, counter-clockwise from above',
                             views=out)


# ---------------------------------------------------------------- main
def main():
    reset()
    sc = bpy.context.scene
    mats = Mats()
    mats['hub'] = mats['light_grey']
    for k in ('figure', 'items', 'tub', 'crew', 'studio'):
        sc.collection.children.link(bpy.data.collections.new(k))
    cl = bpy.data.collections
    faces, torso = prints(mats, C)
    face0 = 'neutral' if 'neutral' in faces else (faces[0] if faces else None)

    fig_root, fig = build_figure(cl['figure'], mats, item='towel', face=face0, torso_print=torso)
    items_root = bpy.data.objects.new('items', None)
    cl['items'].objects.link(items_root)
    items = {}
    for i, it in enumerate(KART['items']):
        p = Part('item_' + it)
        build_item(p, it)
        o = p.build(mats, GRIP, items_root, cl['items'], (0.0, 0.0, 0.0))
        o.location = (0.9 + 0.38 * i, 0.0, GRIP[2])
        items[it] = o
    tub_root, tub = build_tub(cl['tub'], mats)

    # crew: captain seated in the tub, four attendants at ATT_POS pushing (render only)
    crew = []
    cface = {'captain': 'shouting', 0: 'determined', 1: 'cheering', 2: 'determined', 3: 'shocked'}
    pick = lambda k: cface[k] if cface[k] in faces else face0
    cap_root, cap = build_figure(cl['crew'], mats, pre='cap_', item=None, captain=True, face=pick('captain'),
                                 torso_print=False)
    cap_root.scale = (1.12, 1.12, 1.12)
    cap_root.location = (0, 0.1, 0.70 - 1.12 * WAIST_Z)
    cap['head'].scale = (1.25 / 1.12,) * 3
    cap['leg_l'].rotation_euler = (math.radians(85), 0, 0)
    cap['leg_r'].rotation_euler = (math.radians(85), 0, 0)
    cap['torso'].rotation_euler = (math.radians(4), 0, 0)
    for s in ('l', 'r'):
        cap['arm_' + s].rotation_euler = (math.radians(-62), 0, math.radians(8 if s == 'l' else -8))
    cap['arm_l'].rotation_euler.x = math.radians(-120)
    cap['hand_l'].rotation_euler = (0, 0, math.radians(20))
    crew.append(cap_root)
    for i, (ax, az) in enumerate(KART['att']):
        r, pr = build_figure(cl['crew'], mats, pre='att%d_' % i, item=KART['items'][i], face=pick(i),
                             torso_print=torso)
        bx, by, _ = g2b(ax, 0, az)
        r.location = (bx, by, 0)
        yaw = 0 if abs(ax) < 1 else (-28 if ax > 0 else 28)
        pose_push(pr, lean=0.32, arm=-78 if abs(ax) < 1 else -60, swing=0.38 * (1 if i % 2 else -1), yaw=yaw, root=r)
        crew.append(r)

    # stats
    bpy.context.view_layer.update()
    stats = dict(standards=standards(), knobs=KN.asdict(), team=TEAM['id'], hat=TEAM['hat'], parts={})
    figure_objs = [o for o in descendants(fig_root) if o.type == 'MESH']
    stats['parts']['figure'] = {o.name: tris(o) for o in figure_objs}
    stats['parts']['figure_total'] = sum(stats['parts']['figure'].values())
    stats['parts']['items'] = {o.name: tris(o) for o in items.values()}
    tub_objs = [o for o in descendants(tub_root) if o.type == 'MESH']
    stats['parts']['tub'] = {o.name: tris(o) for o in tub_objs}
    stats['parts']['tub_total'] = sum(stats['parts']['tub'].values())
    crew_tris = sum(tris(o) for o in all_in(crew) if o.type == 'MESH')
    stats['parts']['crew_scene_total'] = crew_tris + stats['parts']['tub_total']
    stats['prints'] = dict(faces=faces, figure_face=face0, torso=torso, **PRINT_NOTES)
    pts = [o.matrix_world @ Vector(c) for o in figure_objs for c in o.bound_box]
    stats['figure_bbox'] = dict(min=[round(min(q[i] for q in pts), 4) for i in range(3)],
                                max=[round(max(q[i] for q in pts), 4) for i in range(3)])
    stats['pivots'] = {o.name: [round(v, 4) for v in o.matrix_world.translation] for o in figure_objs + tub_objs}
    print('@@TRIS', json.dumps(stats['parts']))

    glb_fig = export_glb('goldmaster-figure', [fig_root, items_root], texcoords=True)
    glb_tub = export_glb('goldmaster-tub', [tub_root], texcoords=True)
    stats['files'] = {os.path.basename(g): os.path.getsize(g) for g in (glb_fig, glb_tub)}

    if not NO_RENDER:
        backdrop = studio(cl['studio'])
        rig_o, cam, lights = rig(cl['studio'])
        figure_set = all_in([fig_root])
        tub_set = all_in([tub_root])
        crew_set = all_in(crew)
        item_set = all_in([items_root])
        everything = figure_set + tub_set + crew_set + item_set
        cycles(SAMPLES, RES)
        if 'figure' in ONLY:
            set_visible(everything, False)
            set_visible(figure_set, True)
            for k in range(8):
                shoot(rig_o, cam, 'figure_turn_%d' % (k * 45), (0, 0, 0.83), 6.4, 9, k * 45, lens=70)
            shoot(rig_o, cam, 'figure_hero', (0, 0, 0.84), 7.0, 13, -38, lens=80)
            set_visible(everything, False)
            set_visible(item_set, True)
            shoot(rig_o, cam, 'items', (1.47, 0, 0.6), 5.2, 20, -24, lens=70)
        if 'tub' in ONLY:
            set_visible(everything, False)
            set_visible(tub_set, True)
            for k in range(8):
                shoot(rig_o, cam, 'tub_turn_%d' % (k * 45), (0, 0, 0.95), 8.0, 14, k * 45, lens=50)
            shoot(rig_o, cam, 'tub_hero', (0, -0.05, 1.0), 7.2, 20, -40, lens=55)
        if 'crew' in ONLY:
            set_visible(everything, False)
            set_visible(tub_set + crew_set, True)
            for k in range(8):
                shoot(rig_o, cam, 'crew_turn_%d' % (k * 45), (0, 0.15, 0.95), 8.6, 16, k * 45, lens=40)
            shoot(rig_o, cam, 'crew_hero', (0, 0.25, 0.85), 8.4, 30, 140, lens=42)
        if 'fidelity' in ONLY:
            set_visible(everything, False)
            set_visible(figure_set, True)
            fidelity(rig_o, cam, [fig_root], backdrop, stats)
        set_visible(everything, True)
        place(rig_o, cam, (0, 0.15, 0.95), 8.6, 16, -35)
        cam.data.lens = 40
        cycles(SAMPLES, RES)
    if NO_RENDER or not ONLY >= {'figure', 'tub', 'crew', 'fidelity'}:
        old = os.path.join(EXPORT_DIR, 'goldmaster-stats.json')
        if os.path.exists(old) and 'fidelity' not in stats:
            with open(old, encoding='utf-8') as f:
                prev = json.load(f)
            if 'fidelity' in prev:
                stats['fidelity'] = prev['fidelity']
    with open(os.path.join(EXPORT_DIR, 'goldmaster-stats.json'), 'w', encoding='utf-8') as f:
        json.dump(stats, f, indent=1, sort_keys=True)
    save_blend('goldmaster')
    print('@@FILES', glb_fig, glb_tub)



def probe(names):
    """Build the figure, items and tub with each LOD_PROBES knob set and record triangles per part. Nothing
    is exported or saved; the Gold Master files are untouched."""
    global KN
    from brickkit import LOD_PROBES
    out = {}
    for nm in ['GM'] + names:
        KN = GM if nm == 'GM' else LOD_PROBES[nm]
        reset()
        sc = bpy.context.scene
        mats = Mats()
        mats['hub'] = mats['light_grey']
        coll = bpy.data.collections.new('probe')
        sc.collection.children.link(coll)
        fig_root, fig = build_figure(coll, mats, item='towel')
        tub_root, tub = build_tub(coll, mats)
        items = {}
        for it in KART['items']:
            p = Part('item_' + it)
            build_item(p, it)
            items['item_' + it] = tris(p.build(mats, GRIP, coll=coll))
        f = {o.name: tris(o) for o in descendants(fig_root) if o.type == 'MESH'}
        t = {o.name: tris(o) for o in descendants(tub_root) if o.type == 'MESH'}
        out[nm] = dict(knobs=KN.asdict(), figure=f, figure_total=sum(f.values()), items=items, tub=t,
                       tub_total=sum(t.values()),
                       crew_total=(sum(f.values()) - f.get('item', 0)) * 5 + sum(items.values()) + sum(t.values()))
        print('@@PROBE', nm, out[nm]['figure_total'], out[nm]['tub_total'], out[nm]['crew_total'])
    with open(os.path.join(EXPORT_DIR, 'goldmaster-lodprobe.json'), 'w', encoding='utf-8') as fh:
        json.dump(out, fh, indent=1, sort_keys=True)


if PROBE:
    probe(PROBE.split(','))
else:
    main()
