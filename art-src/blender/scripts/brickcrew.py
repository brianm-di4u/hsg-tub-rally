"""Exports every team's crew and tub at four LODs for the game (Phase 4 of the brick-toy campaign).

Steps (run from the game folder; each is deterministic, so rebuilds are byte-identical):
  blender -b --factory-startup --python art-src/blender/scripts/brickcrew.py -- --atlas
      cuts and keys the Codex prints (art-src/tex/brick) into ONE atlas, export/crew/prints.png, and writes
      export/crew/prints.json: atlas cells, plus the colour rows that stand in for prints below LOD1
  ... -- --build [--teams id,id] [--lods 0,1,2,3]
      export/crew/shared-lod<N>.glb/.json (every node that is the same for all teams but for colour) and
      export/crew/<team>-lod<N>.glb/.json (that team's own nodes; the sidecar covers every node)
  ... -- --sheet          renders/crew/lineup_lod1_{rear,front}.png (all 12 crews at LOD1, no names)
  ... -- --lodsheet a,b   renders/crew/lods_*.png (LOD0..3 side by side)
  ... -- --table          export/crew/tris.json and hashes.json

GLB contract (agreed with the runtime session, amended for download size):
- Flat node list. Each mesh is in its own pivot space; the node's TRS is its rest transform in kart space
  (Y up, +Z forward, +X the kart's left, metres), the same as the sidecars. Attendants share meshes.
- Shared file: body, feet (traditional) and skirt (modified, stock), wheel_0..3, flag, duck, water,
  cap_head, cap_arm_l/r, cap_hand_l/r, att{i}_head, att{i}_arm_l/r, att{i}_hand_l/r, att{i}_item,
  att{i}_leg_l/r, and at LOD0-1 cap_torso and att{i}_torso. COLOR_0 = grey AO; _SLOT = colour slot index.
- Team file: cap_hat, att{i}_hat, the team's trims (<owner>_trim, LOD0-1) and at LOD2-3 the torsos (their
  colour rows are the team's). COLOR_0 = linear albedo x AO.
- One primitive per node: POSITION, NORMAL (hardened bevels), TEXCOORD_0 (atlas; unprinted corners sit in
  the transparent top-left 16 x 16 px), COLOR_0. No materials. No hand nodes at LOD3 (an arm's end face).
- Printed: torsos at LOD0-1, heads (faces) at LOD0-2. Below that, colour rows stand in for the prints.
"""
import bpy
import bmesh
import hashlib
import json
import math
import os
import sys

from mathutils import Matrix, Vector
from mathutils.bvhtree import BVHTree

HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)
sys.dont_write_bytecode = True               # no __pycache__ next to the scripts
from brickkit import *  # noqa: E402,F401,F403
import brickfig as F  # noqa: E402
import bricktub as BT  # noqa: E402

ARGV = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def arg(name, default=None):
    return ARGV[ARGV.index(name) + 1] if name in ARGV else default


TEX = os.path.normpath(os.path.join(ROOT, '..', 'tex', 'brick'))
OUT = os.path.join(EXPORT_DIR, 'crew')
SHEETS = os.path.join(RENDER_DIR, 'crew')
os.makedirs(OUT, exist_ok=True)

LODS = {
    0: (Knobs(bevel_segs=2, stud_segs=16, round_segs=24, curve_segs=4), 'full'),
    1: (Knobs(bevel_segs=1, stud_segs=8, round_segs=12, curve_segs=2), 'full'),
    2: (Knobs(bevel_segs=0, stud_segs=6, studs='none', round_segs=8, curve_segs=1), 'no-micro'),
    3: (Knobs(bevel_segs=0, stud_segs=6, studs='none', round_segs=6, curve_segs=0), 'blocks'),
}
# per figure, per tub (no crew); the LOD1 tub went from 9300 to 11000 for the smooth rolled rim (agreed limit)
BUDGET = {0: (7200, 30000), 1: (2700, 11000), 2: (400, 1200), 3: (150, 400)}

# rest layout in game kart space (x, z, yaw in degrees); attendants 2 and 3 moved in and turned 20 deg inward
ATT_REST = [(0.62, -1.3, 0.0), (-0.62, -1.3, 0.0), (0.86, -0.72, -20.0), (-0.86, -0.72, 20.0)]
CAP_SEAT = (0.0, 0.66, -0.1)          # captain's seat (pivot of cap_torso), game space
CAP_SCALE, CAP_HEAD_SCALE = 1.12, 1.25
CAP_ARM_REST_X = -1.15                # radians about +X: hanging arms swung forward to hold the rim
FACES = {'cap': 'shouting', 0: 'determined', 1: 'laughing', 2: 'cheering', 3: 'determined'}
FACE_ORDER = ['neutral', 'determined', 'shouting', 'shocked', 'cheering', 'dizzy', 'laughing', 'worried']
AO_RAYS, AO_DIST, AO_STRENGTH = 32, 0.28, 0.7

# ---------------------------------------------------------------- atlas layout (pixels, origin top-left)
ATLAS = 1024
EMPTY = [0, 0, 16, 16]
FACE_W, FACE_H = 120, 112             # 0.30 / 0.28 head front
TORSO_W, TORSO_H = 164, 221           # 0.40 / 0.54 torso front
TORSO_ASPECT = 0.40 / (F.NECK_Z - F.WAIST_Z)
HEAD_ASPECT = F.HEAD[0] / F.HEAD[2]


def face_cell(i):
    return [20 + i * (FACE_W + 4), 4, FACE_W, FACE_H]


def torso_cell(k):
    return [4 + (k % 6) * (TORSO_W + 6), 124 + (k // 6) * (TORSO_H + 4), TORSO_W, TORSO_H]


def cell_uv(cell):
    """(u, v) inside a cell (v = 0 at the cell bottom) -> Blender UV (v up); half-texel inset."""
    x0, y0, w, h = cell

    def f(u, v):
        u = min(1.0, max(0.0, u))
        v = min(1.0, max(0.0, v))
        px = x0 + 0.5 + u * (w - 1)
        py = y0 + 0.5 + (1.0 - v) * (h - 1)
        return (px / ATLAS, 1.0 - py / ATLAS)
    return f


UV_EMPTY = (8.0 / ATLAS, 1.0 - 8.0 / ATLAS)


# ---------------------------------------------------------------- image helpers (numpy, rows top-down)
def _np():
    import numpy as np
    return np


def load_px(path):
    np = _np()
    img = bpy.data.images.load(path)
    w, h = img.size
    a = np.empty(w * h * 4, dtype=np.float32)
    img.pixels.foreach_get(a)
    bpy.data.images.remove(img)
    return a.reshape(h, w, 4)[::-1].astype(np.float64)


def save_px(a, path, alpha=True):
    np = _np()
    h, w = a.shape[:2]
    img = bpy.data.images.new('tmp_save', w, h, alpha=alpha)
    img.pixels.foreach_set(np.ascontiguousarray(a[::-1]).astype(np.float32).ravel())
    img.filepath_raw = path
    img.file_format = 'PNG'
    img.save()
    bpy.data.images.remove(img)
    return path


def to_lin(a):
    np = _np()
    return np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)


def to_srgb(a):
    np = _np()
    a = np.clip(a, 0.0, 1.0)
    return np.where(a <= 0.0031308, a * 12.92, 1.055 * a ** (1 / 2.4) - 0.055)


def dilate(m):
    g = m.copy()
    g[1:] |= m[:-1]
    g[:-1] |= m[1:]
    g[:, 1:] |= m[:, :-1]
    g[:, :-1] |= m[:, 1:]
    return g


def key_white(a, thr=0.9, band=2, flood=True):
    """Key the near-white background (Codex returns opaque near-white). flood=True keys only white connected
    to the border (faces keep white eye highlights and teeth); flood=False keys all near-white (torso prints
    hold no white by brief). Edge pixels are un-blended from the background white."""
    np = _np()
    rgb = a[..., :3]
    mn = rgb.min(axis=2)
    white = mn > thr
    if flood:
        m = np.zeros_like(white)
        m[0], m[-1], m[:, 0], m[:, -1] = white[0], white[-1], white[:, 0], white[:, -1]
        n = -1
        while True:
            m = dilate(m) & white
            c = int(m.sum())
            if c == n:
                break
            n = c
    else:
        m = white.copy()
    bgw = np.median(rgb[m], axis=0) if m.any() else np.ones(3)
    e = m.copy()
    for _ in range(band):
        e = dilate(e)
    edge = e & ~m
    k = float(bgw.min())
    alpha = np.ones(white.shape)
    alpha[m] = 0.0
    ae = np.clip((k - mn[edge]) / k, 0.0, 1.0)
    alpha[edge] = ae
    out = rgb.copy()
    out[edge] = np.clip((rgb[edge] - (1 - ae)[:, None] * bgw) / np.maximum(ae, 1e-3)[:, None], 0, 1)
    out[m] = 0.0
    return np.dstack([out, alpha])


def ink_box(alpha, thr=0.5):
    np = _np()
    ys, xs = np.nonzero(alpha > thr)
    return (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1) if len(xs) else None


def crop(a, x0, y0, x1, y1):
    np = _np()
    h, w = a.shape[:2]
    out = np.zeros((y1 - y0, x1 - x0, 4))
    sx0, sy0, sx1, sy1 = max(0, x0), max(0, y0), min(w, x1), min(h, y1)
    out[sy0 - y0:sy1 - y0, sx0 - x0:sx1 - x0] = a[sy0:sy1, sx0:sx1]
    return out


def box_axis(arr, n_dst):
    """Exact box-filter resize along axis 0: the integral of the piecewise-constant source between output
    edges, read off a cumulative sum (linear time; Blender's numpy has no fast BLAS for a dense matrix)."""
    np = _np()
    n = arr.shape[0]
    S = np.concatenate([np.zeros((1,) + arr.shape[1:]), np.cumsum(arr, axis=0)], axis=0)
    f = n / n_dst
    x = np.arange(n_dst + 1) * f
    i = np.clip(np.floor(x).astype(int), 0, n - 1)
    fr = (x - i).reshape((-1,) + (1,) * (arr.ndim - 1))
    Sx = S[i] + fr * (S[i + 1] - S[i])
    return (Sx[1:] - Sx[:-1]) / f


def resample(a, w, h):
    """Exact box-filter resize in linear light with premultiplied alpha."""
    np = _np()
    al = a[..., 3:4]
    pre = np.concatenate([to_lin(a[..., :3]) * al, al], axis=2)
    out = box_axis(box_axis(pre, h).transpose(1, 0, 2), w).transpose(1, 0, 2)
    al2 = out[..., 3:4]
    rgb = np.where(al2 > 1e-6, out[..., :3] / np.maximum(al2, 1e-6), 0.0)
    return np.concatenate([to_srgb(rgb), al2], axis=2)


def band_tops(a, col=30):
    px = a[:, col, :3]
    lime = (px[:, 1] > 0.75) & (px[:, 2] < 0.45) & (px[:, 0] > 0.55) & (a[:, col, 3] > 0.5)
    tops, last = [], -999
    for r in range(len(lime)):
        if lime[r]:
            if r - last > 120:
                tops.append(r)
            last = r
    return tops


def torso_crops(team_id):
    """Keyed front and back prints cropped to the torso aspect (rows top-down), or (None, None)."""
    front = os.path.join(TEX, 'torso_%s.png' % team_id)
    back = os.path.join(TEX, 'torso_%s_back.png' % team_id)
    if not os.path.exists(front):
        return None, None
    np = _np()
    a = key_white(load_px(front), flood=False)
    h, w = a.shape[:2]
    H = int(round(w / TORSO_ASPECT))
    b = ink_box(a[..., 3])
    r0 = int(round((b[1] + b[3]) / 2 - H / 2))
    fa = crop(a, 0, r0, w, r0 + H)
    ba = None
    if os.path.exists(back):
        bb = key_white(load_px(back), flood=False)
        tf, tb = band_tops(fa), band_tops(bb)
        if team_id == 'engine-six' and len(tf) >= 2 and len(tb) >= 2:
            # the pilot's back bands sat at other heights: resample rows so they line up with the front's
            s = (tb[1] - tb[0]) / (tf[1] - tf[0])
            rows = np.clip(np.round(tb[0] + (np.arange(H) - tf[0]) * s).astype(int), 0, bb.shape[0] - 1)
            ba = bb[rows][:, :w]
        else:
            b2 = ink_box(bb[..., 3])
            r1 = int(round((b2[1] + b2[3]) / 2 - H / 2))
            ba = crop(bb, 0, r1, w, r1 + H)
    return fa, ba


def segment_rows(feat, K):
    """Optimal piecewise-constant fit of per-row features (rows bottom-up) with K segments (dynamic
    programming on the squared error). Returns [(i0, i1)] row ranges."""
    np = _np()
    n = len(feat)
    K = min(K, n)
    cs = np.vstack([np.zeros(feat.shape[1]), np.cumsum(feat, axis=0)])
    cs2 = np.concatenate([[0.0], np.cumsum((feat ** 2).sum(axis=1))])

    INF = float('inf')
    D = np.full((K + 1, n + 1), INF)
    B = np.zeros((K + 1, n + 1), dtype=int)
    D[0, 0] = 0.0
    for k in range(1, K + 1):
        for j in range(k, n + 1):
            i = np.arange(k - 1, j)
            sm = cs[j] - cs[i]
            c = (cs2[j] - cs2[i]) - (sm * sm).sum(axis=1) / (j - i)
            v = D[k - 1, i] + c
            bi = int(np.argmin(v))                     # first minimum: deterministic tie-break
            D[k, j], B[k, j] = v[bi], i[bi]
    segs, j = [], n
    for k in range(K, 0, -1):
        i = int(B[k, j])
        segs.append((i, j))
        j = i
    return list(reversed(segs))


def print_rows(img, K, base_hex, strip=None):
    """Colour rows for a keyed print over a base plastic colour, bottom-up, t in 0..1: [t0, t1, '#hex'].
    Row splits come from an optimal piecewise-constant fit of the mean colour (so bands land on rows);
    each row takes its DOMINANT colour (the most covered 4-bit colour bin), not the mean, so a busy print
    such as tie-dye keeps its colours instead of averaging to grey. strip=(u0, u1) restricts to a column
    band (the torso sides use the front print's left edge)."""
    np = _np()
    a = img[::-1]                                           # bottom-up
    h, w = a.shape[:2]
    if strip:
        a = a[:, int(strip[0] * w):max(int(strip[0] * w) + 1, int(strip[1] * w))]
    al = a[..., 3:4]
    pre = np.concatenate([to_lin(a[..., :3]) * al, al], axis=2)
    final = to_srgb(pre[..., :3] + (1 - al) * np.array(lin(hexc(base_hex))))
    g = 4                                                    # 4-row groups keep the DP quick
    n = h // g
    feat = pre.mean(axis=1)[:n * g].reshape(n, g, 4).mean(axis=1)
    out = []
    for i0, i1 in segment_rows(feat, K):
        px = final[i0 * g:i1 * g].reshape(-1, 3)
        q = np.minimum((px * 16).astype(int), 15)
        key = q[:, 0] * 256 + q[:, 1] * 16 + q[:, 2]
        top = int(np.argmax(np.bincount(key, minlength=4096)))
        c = px[key == top].mean(axis=0)
        out.append([round(i0 / n, 4), round(i1 / n if i1 < n else 1.0, 4),
                    '#%02X%02X%02X' % tuple(int(round(float(v) * 255)) for v in c)])
    return out


# ---------------------------------------------------------------- atlas
def build_atlas():
    np = _np()
    teams = F.teams()
    A = np.zeros((ATLAS, ATLAS, 4))
    cells = {'faces': {}, 'torso': {}}
    rows = {}

    def place(img, cell):
        x0, y0, w, h = cell
        A[y0:y0 + h, x0:x0 + w] = img
        # 2 px edge-extended gutter so filtering never pulls in a neighbour or the empty corner
        for k in (1, 2):
            if y0 - k >= 0:
                A[y0 - k, x0:x0 + w] = img[0]
            if y0 + h - 1 + k < ATLAS:
                A[y0 + h - 1 + k, x0:x0 + w] = img[-1]
        for k in (1, 2):
            ys = slice(max(0, y0 - 2), min(ATLAS, y0 + h + 2))
            if x0 - k >= 0:
                A[ys, x0 - k] = A[ys, x0]
            if x0 + w - 1 + k < ATLAS:
                A[ys, x0 + w - 1 + k] = A[ys, x0 + w - 1]
    for i, name in enumerate(FACE_ORDER):
        src = os.path.join(TEX, 'face_%s.png' % name)
        cell = face_cell(i)
        cells['faces'][name] = cell
        if os.path.exists(src):
            place(resample(load_px(src), FACE_W, FACE_H), cell)
    for t, team in enumerate(teams):
        fa, ba = torso_crops(team['id'])
        cf, cb = torso_cell(2 * t), torso_cell(2 * t + 1)
        cells['torso'][team['id']] = {'front': cf, 'back': cb, 'printed': fa is not None}
        if fa is None:
            continue
        place(resample(fa, TORSO_W, TORSO_H), cf)
        place(resample(ba if ba is not None else fa, TORSO_W, TORSO_H), cb)
        bk = ba if ba is not None else fa
        rows[team['id']] = {}
        for lvl, K in (('no-micro', 7), ('blocks', 3)):
            rows[team['id']][lvl] = {
                role: {'front': print_rows(fa, K, base), 'back': print_rows(bk, K, base),
                       'side': print_rows(fa, K, base, strip=(0.01, 0.09))}
                for role, base in (('att', team['colors']['shirt']), ('cap', team['colors']['cap']))}
    A[0:16, 0:16] = 0.0
    save_px(A, os.path.join(OUT, 'prints.png'))
    meta = dict(size=[ATLAS, ATLAS], uv_origin='top-left (glTF)', empty=EMPTY,
                note='RGBA with keyed alpha. Faces are shared; each team has a front and a back torso print. '
                     'Cells are [x, y, w, h] in pixels from the top-left; each has a 2 px edge-extended gutter.',
                faces=cells['faces'], torso=cells['torso'],
                rows_note='Colour rows that replace the prints below LOD1, per level (no-micro = LOD2, blocks = LOD3), '
                          'role (att = attendant shirt, cap = captain) and side: [t0, t1, sRGB hex] from the bottom of '
                          'the torso (t = 0) up; each row is the dominant colour of the print over the plastic.',
                rows=rows)
    with open(os.path.join(OUT, 'prints.json'), 'w', encoding='utf-8') as f:
        json.dump(meta, f, indent=1, sort_keys=True)
    print('@@ATLAS', os.path.join(OUT, 'prints.png'))


# ---------------------------------------------------------------- colour slots
# Shared nodes carry no colour: COLOR_0 is grey AO and _SLOT names the colour slot per vertex (index into
# SLOTS); the game fills slots from the team palette in the sidecar. The first 15 are the runtime's list; the
# last four are fixed colours the shared parts also need.
SLOTS = ['tub', 'trim', 'flag', 'shirt', 'cap', 'hat', 'skin', 'pants', 'shoe', 'item', 'rim', 'enamel', 'tyre',
         'hub', 'iron', 'duck', 'beak', 'black', 'water']
FIXED_SLOT = {'charcoal': 'black', 'black': 'black', 'enamel': 'enamel', 'water': 'water', 'black/rubber': 'tyre',
              'light_grey': 'hub', 'silver/metal': 'hub', 'duck': 'duck', 'beak': 'beak', 'water/water': 'water',
              BT.ENAMEL: 'enamel', BT.IRON: 'iron'}
FIXED_COL = {'enamel': BT.ENAMEL, 'tyre': PALETTE['black'], 'hub': PALETTE['light_grey'], 'iron': BT.IRON,
             'duck': PALETTE['duck'], 'beak': PALETTE['beak'], 'black': PALETTE['black'], 'water': PALETTE['water']}
ITEM_COL = F.item_colours()
I4 = F.I4
SHARED_TEAM = dict(id='shared', name='shared', div='traditional', hat='helmet', emblem='',
                   colors={k: 'slot:' + k for k in ('tub', 'trim', 'flag', 'shirt', 'cap', 'hat', 'skin', 'rim')})
ARM_DEG, ARM_SPLAY, WRIST_DEG = -78.0, 6.0, 25.0     # attendants' pushing pose (rest rotations, not baked)


def palette(team):
    c, st = team['colors'], F.TEAM_STYLE.get(team['id'], {})
    pal = dict(tub=c['tub'], trim=c['trim'], flag=c['flag'], shirt=c['shirt'], cap=c['cap'], hat=c['hat'],
               skin=c['skin'], pants=st.get('pants', '#3A3F4A'), shoe=st.get('boots', '#1D1D22'), item=None,
               rim=c['trim'])
    pal.update(FIXED_COL)
    return pal


class SlotMats(dict):
    """Material keys of shared nodes -> one material per colour slot ('slot_<name>')."""

    def __missing__(self, key):
        s = key[5:] if key.startswith('slot:') else FIXED_SLOT[key]
        m = plastic('slot_' + s, '#808080')
        self[key] = m
        return m


def slot_of(m):
    if m.name.startswith('slot_'):
        return m.name[5:]
    if m.name.startswith('print_') and '@slot:' in m.name:
        return m.name.split('@slot:')[1]
    return None


def make_ctx(kn, detail, team, role, meta, print_team, face):
    """team None: slot colours (a shared node). print_team: whose atlas cells the prints use."""
    shared = team is None
    t = SHARED_TEAM if shared else team
    base = t['colors']['cap' if role == 'cap' else 'shirt']
    mats = SlotMats() if shared else Mats()
    prints = None
    cells = meta['torso'].get(print_team or '', {})
    grey, skin = '#808080', t['colors']['skin']
    if detail == 'full' and cells.get('printed'):
        prints = {'front': cell_uv(cells['front']), 'back': cell_uv(cells['back']), 'face': cell_uv(meta['faces'][face])}
        mats['print_front'] = plastic('print_front@' + base, grey if shared else base)
        mats['print_back'] = plastic('print_back@' + base, grey if shared else base)
        mats['print_face'] = plastic('print_face@' + skin, grey if shared else skin)
    elif detail == 'no-micro' and face:                    # LOD2 heads keep the printed face; torsos use rows
        prints = {'face': cell_uv(meta['faces'][face])}
        mats['print_face'] = plastic('print_face@' + skin, grey if shared else skin)
    rows = None
    if not shared and detail != 'full':
        tr = meta['rows'].get(team['id'], {}).get(detail)
        if tr:
            rows = {k: [tuple(r) for r in v] for k, v in tr['cap' if role == 'cap' else 'att'].items()}
    c = F.Ctx(kn, detail, t, captain=(role == 'cap'), prints=prints, face=face, rows=rows, mats=mats)
    if shared:
        c.pants, c.boots, c.style = 'slot:pants', 'slot:shoe', {}
    return c


# ---------------------------------------------------------------- crew assembly
def g2b(x, y, z):
    return Vector((x, -z, y))


C_B2G = Matrix(((1, 0, 0), (0, 0, 1), (0, -1, 0)))    # Blender -> glTF axes


def rest_of(o):
    """Rest transform in kart (glTF) space: pos, and rot as three.js Euler 'YXZ' (= mathutils 'ZXY')."""
    M = o.matrix_world
    p = C_B2G @ M.translation
    Rg = C_B2G @ M.to_3x3().normalized() @ C_B2G.transposed()
    e = Rg.to_euler('ZXY')
    chk = (Matrix.Rotation(e.y, 3, 'Y') @ Matrix.Rotation(e.x, 3, 'X') @ Matrix.Rotation(e.z, 3, 'Z'))
    assert max(abs(chk[i][j] - Rg[i][j]) for i in range(3) for j in range(3)) < 1e-5
    return dict(pos=[round(v, 5) + 0.0 for v in p], rot=[round(v, 6) + 0.0 for v in (e.x, e.y, e.z)])


def scale_part(p, pivot, k):
    bmesh.ops.transform(p.bm, matrix=F.about(pivot, S(k)), verts=p.bm.verts[:])


# game part each node merges onto (the runtime's 24 animated parts)
def part_of(name):
    if name in ('feet', 'skirt'):
        return 'body'
    if name.startswith('cap_'):
        if name.startswith('cap_hat'):
            return 'cap_head'
        if name.startswith('cap_hand_'):
            return 'cap_arm_' + name[9]
        if name.startswith('cap_arm_'):
            return name[:9]
        return name
    if name.startswith('att'):
        i = name[3]
        if '_leg_' in name:
            return name[:10]
        return 'att%s_torso' % i
    return name


def assemble(lod, meta, coll, team=None, preview=False, offset=Vector((0, 0, 0))):
    """Build one kart's nodes in rest pose. team None: the shared nodes only (slot colours, the first team's
    print cells, neutral faces; attendants share meshes). With a team: the shared nodes plus that team's own
    nodes (hats, trims, and the torsos at LOD2-3). preview=True (renders) gives the shared nodes the team's
    print cells and each figure its own face. Returns ({name: object}, set of team-node names)."""
    kn, detail = LODS[lod]
    first = F.teams()[0]['id']
    pteam = team['id'] if (team is not None and preview) else first
    O = T(*offset)
    nodes, own, cache = {}, set(), {}
    full, blocks = detail == 'full', detail == 'blocks'

    def put(p, pivot, name, Mw, mats, team_node=False, key=None):
        if key is not None and key in cache:
            o = bpy.data.objects.new(name, cache[key])
            coll.objects.link(o)
        else:
            o = p.build(mats, pivot, coll=coll)
            o.data.name = name
            if key is not None:
                cache[key] = o.data
        o.name = name
        o.matrix_world = O @ Mw
        nodes[name] = o
        if team_node:
            own.add(name)
        return o

    def share(k):
        return None if preview else k

    sa = make_ctx(kn, detail, None, 'att', meta, pteam, 'neutral')
    sc = make_ctx(kn, detail, None, 'cap', meta, pteam, FACES['cap'] if preview else 'neutral')
    ta = make_ctx(kn, detail, team, 'att', meta, team['id'], 'neutral') if team else None
    tc = make_ctx(kn, detail, team, 'cap', meta, team['id'], 'neutral') if team else None

    # ---- tub (shared); feet and skirt are division variants
    p = Part('body')
    BT.body(p, sa)
    put(p, (0, 0, 0), 'body', I4, sa.mats)
    for v in (['feet', 'skirt'] if team is None else (['feet'] if team['div'] == 'traditional' else ['skirt'])):
        p = Part(v)
        (BT.feet if v == 'feet' else BT.skirt)(p, sa)
        put(p, (0, 0, 0), v, I4, sa.mats)
    for i, (gx, gy, gz) in enumerate(BT.WHEELS):
        side = 1 if gx > 0 else -1
        p = Part('wheel_%d' % i)
        if share(('wheel', side)) not in cache:
            BT.wheel(p, sa, side)
        put(p, (0, 0, 0), 'wheel_%d' % i, T(*g2b(gx, gy, gz)), sa.mats, key=share(('wheel', side)))
    for name, base, fn in (('flag', BT.FLAG_BASE, BT.flag), ('duck', BT.DUCK_BASE, BT.duck)):
        b = g2b(*base)
        p = Part(name)
        fn(p, sa, b)
        put(p, tuple(b), name, T(*b), sa.mats)
    p = Part('water')
    BT.water(p, sa)
    put(p, (0, 0, BT.WATER_Z), 'water', T(0, 0, BT.WATER_Z), sa.mats)

    # ---- captain: seated, body x 1.12 and head x 1.25 baked into the meshes, no legs (inside the tub)
    hipP, neck = (0.0, 0.0, F.HIP_Z), (0.0, 0.0, F.NECK_Z)
    seat = g2b(*CAP_SEAT)
    if full or team is not None:
        cc = sc if full else tc
        p = Part('cap_torso')
        F.hip(p, cc)
        F.torso(p, cc, with_hip=cc.blocks)
        F.neck(p, cc)
        scale_part(p, hipP, CAP_SCALE)
        put(p, hipP, 'cap_torso', T(*seat), cc.mats, team_node=not full)
    neckW = seat + Vector((0, 0, (F.NECK_Z - F.HIP_Z) * CAP_SCALE))
    p = Part('cap_head')
    F.head(p, sc)
    scale_part(p, neck, CAP_HEAD_SCALE)
    put(p, neck, 'cap_head', T(*neckW), sc.mats)
    if team is not None:
        p = Part('cap_hat')
        F.hat(p, tc)
        scale_part(p, neck, CAP_HEAD_SCALE)
        hz = (F.HEAD_TOP - F.NECK_Z) * CAP_HEAD_SCALE
        put(p, (0, 0, F.NECK_Z + hz), 'cap_hat', T(*neckW) @ T(0, 0, hz), tc.mats, team_node=True)
    for side, sfx in ((1, 'l'), (-1, 'r')):
        sh = (side * F.SH_X, 0.0, F.SH_Z)
        armM = T(*(seat + Vector((side * F.SH_X * CAP_SCALE, 0, (F.SH_Z - F.HIP_Z) * CAP_SCALE)))) @ \
            Matrix.Rotation(CAP_ARM_REST_X, 4, 'X')
        p = Part('cap_arm_' + sfx)
        F.arm(p, sc, side)
        scale_part(p, sh, CAP_SCALE)
        put(p, sh, 'cap_arm_' + sfx, armM, sc.mats)
        if team is not None:
            p = Part('cap_arm_%s_trim' % sfx)
            if F.arm_trim(p, tc, side):
                scale_part(p, sh, CAP_SCALE)
                put(p, sh, 'cap_arm_%s_trim' % sfx, armM, tc.mats, team_node=True)
            else:
                p.bm.free()
        if not blocks:
            wr = (side * F.SH_X, 0.0, F.WRIST_Z)
            p = Part('cap_hand_' + sfx)
            F.hand(p, sc, side)
            scale_part(p, wr, CAP_SCALE)
            put(p, wr, 'cap_hand_' + sfx, armM @ T(0, 0, (F.WRIST_Z - F.SH_Z) * CAP_SCALE), sc.mats)

    # ---- attendants (shared meshes, except the four items; hats, trims and low-LOD torsos per team)
    for i, (ax, az, yaw) in enumerate(ATT_REST):
        a = make_ctx(kn, detail, None, 'att', meta, pteam, FACES[i]) if preview else sa
        Ma = T(*g2b(ax, F.HIP_Z, az)) @ R(yaw, 'Z')
        pre = 'att%d_' % i
        if full or team is not None:
            cc = a if full else ta
            p = Part(pre + 'torso')
            if share('torso') not in cache:
                F.hip(p, cc)
                F.torso(p, cc, with_hip=cc.blocks)
                F.neck(p, cc)
            put(p, hipP, pre + 'torso', Ma, cc.mats, team_node=not full, key=share('torso'))
        p = Part(pre + 'head')
        if share('head') not in cache:
            F.head(p, a)
        put(p, neck, pre + 'head', Ma @ T(0, 0, F.NECK_Z - F.HIP_Z), a.mats, key=share('head'))
        if team is not None:
            p = Part(pre + 'hat')
            if 'hat' not in cache:
                F.hat(p, ta)
            put(p, (0, 0, F.HEAD_TOP), pre + 'hat', Ma @ T(0, 0, F.HEAD_TOP - F.HIP_Z), ta.mats, team_node=True,
                key='hat')
        for side, sfx in ((1, 'l'), (-1, 'r')):
            sh = (side * F.SH_X, 0.0, F.SH_Z)
            armM = Ma @ T(side * F.SH_X, 0, F.SH_Z - F.HIP_Z) @ R(ARM_DEG, 'X') @ R(-side * ARM_SPLAY, 'Y')
            p = Part(pre + 'arm_' + sfx)
            if share(('arm', side)) not in cache:
                F.arm(p, a, side)
            put(p, sh, pre + 'arm_' + sfx, armM, a.mats, key=share(('arm', side)))
            if team is not None:
                p = Part(pre + 'arm_%s_trim' % sfx)
                if ('armtrim', side) in cache or F.arm_trim(p, ta, side):
                    put(p, sh, pre + 'arm_%s_trim' % sfx, armM, ta.mats, team_node=True, key=('armtrim', side))
                else:
                    p.bm.free()
            handM = armM @ T(0, 0, F.WRIST_Z - F.SH_Z) @ R(WRIST_DEG, 'X')
            if not blocks:
                wr = (side * F.SH_X, 0.0, F.WRIST_Z)
                p = Part(pre + 'hand_' + sfx)
                if share(('hand', side)) not in cache:
                    F.hand(p, a, side)
                put(p, wr, pre + 'hand_' + sfx, handM, a.mats, key=share(('hand', side)))
            if side == 1:
                p = Part(pre + 'item')
                F.item(p, a, F.ITEMS[i], I4, {it: 'slot:item' for it in F.ITEMS})
                o = put(p, F.GRIP, pre + 'item', handM @ T(0, F.GRIP[1], F.GRIP[2] - F.WRIST_Z), a.mats)
                o['item'] = F.ITEMS[i]
            p = Part(pre + 'leg_' + sfx)
            if share(('leg', side)) not in cache:
                F.leg(p, a, side)
            put(p, hipP, pre + 'leg_' + sfx, Ma, a.mats, key=share(('leg', side)))
            if team is not None:
                p = Part(pre + 'leg_%s_trim' % sfx)
                if ('legtrim', side) in cache or F.leg_trim(p, ta, side):
                    put(p, hipP, pre + 'leg_%s_trim' % sfx, Ma, ta.mats, team_node=True, key=('legtrim', side))
                else:
                    p.bm.free()
    bpy.context.view_layer.update()
    return nodes, own


def figure_tris(t):
    out = {'cap': sum(v for k, v in t.items() if k.startswith('cap_'))}
    for i in range(4):
        out['att%d' % i] = sum(v for k, v in t.items() if k.startswith('att%d_' % i))
    return out


def tub_tris(t):
    return sum(v for k, v in t.items() if k in ('body', 'feet', 'skirt', 'wheel_0', 'wheel_1', 'wheel_2', 'wheel_3',
                                               'flag', 'duck', 'water'))


# ---------------------------------------------------------------- ambient occlusion and vertex data
def _hemisphere(n):
    """Cosine-weighted directions about +Z on a golden-angle spiral (fixed, so the bake is deterministic)."""
    out = []
    ga = math.pi * (3 - math.sqrt(5))
    for k in range(n):
        u = (k + 0.5) / n
        r = math.sqrt(u)
        a = k * ga
        out.append(Vector((r * math.cos(a), r * math.sin(a), math.sqrt(max(0.0, 1 - u)))))
    return out


def bake(targets, occluders, mode, pal=None):
    """Vertex data for each target mesh (once per mesh, from its first object). AO: fixed rays against the
    occluders in rest pose plus the ground. mode 'ao': COLOR_0 grey AO and a _SLOT corner attribute (shared
    nodes); 'albedo': COLOR_0 = albedo x AO (team nodes); 'preview': slots filled from pal (renders).
    Unprinted corners get the empty-atlas UV."""
    verts, polys = [], []
    for o in occluders:
        M = o.matrix_world
        base = len(verts)
        verts += [M @ v.co for v in o.data.vertices]
        polys += [[base + i for i in p.vertices] for p in o.data.polygons]
    b = len(verts)
    verts += [Vector((-60, -60, 0)), Vector((60, -60, 0)), Vector((60, 60, 0)), Vector((-60, 60, 0))]
    polys.append([b, b + 1, b + 2, b + 3])
    bvh = BVHTree.FromPolygons(verts, polys, all_triangles=False, epsilon=0.0)
    dirs = _hemisphere(AO_RAYS)
    done = set()
    for o in targets:
        me = o.data
        if me.name in done:
            continue
        done.add(me.name)
        M = o.matrix_world
        N3 = M.to_3x3().normalized()
        ao = []
        for v in me.vertices:
            n = (N3 @ v.normal).normalized()
            t = n.orthogonal().normalized()
            bb = n.cross(t)
            org = M @ v.co + n * 0.0015
            hits = 0
            for d in dirs:
                if bvh.ray_cast(org, t * d.x + bb * d.y + n * d.z, AO_DIST)[0] is not None:
                    hits += 1
            ao.append(1.0 - AO_STRENGTH * hits / len(dirs))
        mats = list(me.materials)
        attr = me.color_attributes.new('Col', 'FLOAT_COLOR', 'CORNER')
        uvl = me.uv_layers[0]
        cols = [0.0] * (len(me.loops) * 4)
        uvs = [0.0] * (len(me.loops) * 2)
        slots = [0] * len(me.loops)
        uvl.data.foreach_get('uv', uvs)
        for poly in me.polygons:
            m = mats[poly.material_index]
            sl = slot_of(m)
            printed = m.name.startswith('print_')
            if mode == 'ao':
                assert sl is not None, (o.name, m.name)
                alb = (1.0, 1.0, 1.0)
            elif mode == 'preview' and sl is not None:
                hx = ITEM_COL[o['item']] if sl == 'item' else pal[sl]
                alb = lin(hexc(hx))
            else:
                alb = tuple(m.diffuse_color[:3])
            for li in poly.loop_indices:
                k = ao[me.loops[li].vertex_index]
                cols[li * 4:li * 4 + 4] = [alb[0] * k, alb[1] * k, alb[2] * k, 1.0]
                if not printed:
                    uvs[li * 2:li * 2 + 2] = list(UV_EMPTY)
                if sl is not None:
                    slots[li] = SLOTS.index(sl)
        attr.data.foreach_set('color', cols)
        uvl.data.foreach_set('uv', uvs)
        me.color_attributes.active_color = attr
        try:
            me.color_attributes.render_color_index = me.color_attributes.find('Col')
        except Exception:
            pass
        if mode == 'ao':
            sa = me.attributes.new('_SLOT', 'INT', 'CORNER')
            sa.data.foreach_set('value', slots)


def export_nodes(objs, path, attributes=False):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True, export_yup=True,
                              export_apply=False, export_texcoords=True, export_normals=True,
                              export_tangents=False, export_materials='NONE', export_vertex_color='ACTIVE',
                              export_all_vertex_colors=False, export_attributes=attributes, export_animations=False,
                              export_extras=False, export_cameras=False, export_lights=False)
    return path


def _order(names):
    return sorted(names, key=lambda n: (part_of(n), n))


def build_shared(lods, meta):
    for lod in lods:
        reset()
        coll = bpy.context.scene.collection
        nodes, _ = assemble(lod, meta, coll)
        names = _order(nodes)
        objs = [nodes[n] for n in names]
        tri = {n: tris(nodes[n]) for n in names}
        bake([o for o in objs if o.name != 'skirt'], [o for o in objs if o.name != 'skirt'], 'ao')
        bake([nodes['skirt']], [o for o in objs if o.name != 'feet'], 'ao')
        rest = {n: rest_of(nodes[n]) for n in names}
        for o in objs:
            o.data.materials.clear()
        glb = export_nodes(objs, os.path.join(OUT, 'shared-lod%d.glb' % lod), attributes=True)
        kn, detail = LODS[lod]
        first = F.teams()[0]['id']
        side = dict(lod=lod, detail=detail, knobs=kn.asdict(), glb=os.path.basename(glb),
                    units='metres; kart space: Y up, +Z forward, +X the kart\'s left', rot_order='YXZ (three.js Euler), radians',
                    slots=SLOTS,
                    slot_note='_SLOT (float scalar per vertex) indexes slots; colour = palette[slot] (from the team '
                              'sidecar) x COLOR_0 (grey AO). Prints: where TEXCOORD_0 lies outside the empty 16 px '
                              'corner, blend the atlas over that colour by its alpha.',
                    variants=dict(feet='traditional division', skirt='modified and stock divisions'),
                    prints=dict(team=first, cells=meta['torso'][first], face='neutral', faceCell=meta['faces']['neutral'],
                                note='torso UVs point at the first team\'s cells and heads at the neutral face; each team '
                                     'sidecar gives printOffset and per-figure faceOffset to add'),
                    color0='grey ambient occlusion (%d rays, %.2f m), alpha 1' % (AO_RAYS, AO_DIST),
                    nodes={n: dict(rest[n], tris=tri[n], part=part_of(n), mesh=nodes[n].data.name) for n in names})
        with open(os.path.join(OUT, 'shared-lod%d.json' % lod), 'w', encoding='utf-8') as f:
            json.dump(side, f, indent=1, sort_keys=True)
        print('@@SHARED', lod, sum(tri.values()))


def build(team_ids, lods):
    with open(os.path.join(OUT, 'prints.json'), encoding='utf-8') as f:
        meta = json.load(f)
    teams = {t['id']: t for t in F.teams()}
    first = F.teams()[0]['id']
    over = []
    build_shared(lods, meta)
    for tid in team_ids:
        team = teams[tid]
        pal = palette(team)
        for lod in lods:
            reset()
            coll = bpy.context.scene.collection
            nodes, own = assemble(lod, meta, coll, team=team)
            names = _order(nodes)
            mine = [n for n in names if n in own]
            tri = {n: tris(nodes[n]) for n in names}
            bake([nodes[n] for n in mine], [nodes[n] for n in names], 'albedo')
            rest = {n: rest_of(nodes[n]) for n in names}
            for n in mine:
                nodes[n].data.materials.clear()
            glb = export_nodes([nodes[n] for n in mine], os.path.join(OUT, '%s-lod%d.glb' % (tid, lod)))
            fig, tub = figure_tris(tri), tub_tris(tri)
            bf, bt = BUDGET[lod]
            if max(fig.values()) > bf or tub > bt:
                over.append((tid, lod, fig, tub))
            kn, detail = LODS[lod]
            c0, ct = meta['torso'][first]['front'], meta['torso'][tid]['front']
            fx0 = meta['faces']['neutral'][0]
            faces = {'cap': FACES['cap'], **{'att%d' % i: FACES[i] for i in range(4)}}
            side = dict(team=tid, lod=lod, detail=detail, knobs=kn.asdict(),
                        units='metres; kart space: Y up, +Z forward, +X the kart\'s left',
                        rot_order='YXZ (three.js Euler), radians', hipHeight=F.HIP_Z,
                        files=dict(shared='shared-lod%d.glb' % lod, team=os.path.basename(glb)),
                        division=team['div'], body_variant='feet' if team['div'] == 'traditional' else 'skirt',
                        palette=pal, slots=SLOTS,
                        items={'att%d' % i: dict(item=F.ITEMS[i], colour=ITEM_COL[F.ITEMS[i]]) for i in range(4)},
                        printOffset=[round((ct[0] - c0[0]) / ATLAS, 6), round((ct[1] - c0[1]) / ATLAS, 6)] if detail == 'full' else None,
                        faces={k: dict(expression=v, uvOffset=[round((meta['faces'][v][0] - fx0) / ATLAS, 6), 0.0])
                               for k, v in faces.items()} if detail != 'blocks' else None,
                        offsets_note='add printOffset to TEXCOORD_0 of *_torso and faceOffset to *_head, only where '
                                     'the UV lies outside the empty 16 px corner',
                        captain=dict(seat=rest['cap_torso']['pos'], bodyScale=CAP_SCALE, headScale=CAP_HEAD_SCALE,
                                     note='cap_arm_* hang down (-Y) in pivot space; rest rot.x swings them forward'),
                        attendant_pose=dict(arm_deg=ARM_DEG, splay_deg=ARM_SPLAY, wrist_deg=WRIST_DEG,
                                            note='arms, hands and items are separate nodes; their rest rotations hold '
                                                 'the pushing pose'),
                        water=dict(restFill=0.75, note='the sheet sits at y = 0.5 + 0.48 * fill; rest is 75 %'),
                        nodes={n: dict(rest[n], tris=tri[n], src='team' if n in own else 'shared', part=part_of(n))
                               for n in names},
                        tris=dict(figures=fig, tub=tub, total=sum(tri.values()), budget=dict(figure=bf, tub=bt)),
                        color0='team file: linear albedo x baked AO; shared file: grey AO with _SLOT')
            with open(os.path.join(OUT, '%s-lod%d.json' % (tid, lod)), 'w', encoding='utf-8') as f:
                json.dump(side, f, indent=1, sort_keys=True)
            print('@@BUILT', tid, lod, 'fig', max(fig.values()), 'tub', tub, 'team nodes', len(mine))
    for o in over:
        print('@@OVER', o)


# ---------------------------------------------------------------- contact sheet
def sheet_material():
    """Vertex colour with the atlas print over it by alpha: what the game shader is expected to do."""
    atlas = bpy.data.images.load(os.path.join(OUT, 'prints.png'))
    m = bpy.data.materials.new('sheet')
    try:
        m.use_nodes = True
    except Exception:
        pass
    nt = m.node_tree
    b = [n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED'][0]
    b.inputs['Roughness'].default_value = 0.22
    va = nt.nodes.new('ShaderNodeVertexColor')
    va.layer_name = 'Col'
    tx = nt.nodes.new('ShaderNodeTexImage')
    tx.image = atlas
    tx.interpolation = 'Linear'
    mix = nt.nodes.new('ShaderNodeMix')
    mix.data_type = 'RGBA'
    nt.links.new(tx.outputs['Alpha'], mix.inputs['Factor'])
    nt.links.new(va.outputs['Color'], mix.inputs['A'])
    nt.links.new(tx.outputs['Color'], mix.inputs['B'])
    nt.links.new(mix.outputs['Result'], b.inputs['Base Color'])
    return m


def _sheet_scene():
    with open(os.path.join(OUT, 'prints.json'), encoding='utf-8') as f:
        meta = json.load(f)
    reset()
    sc = bpy.context.scene
    coll = bpy.data.collections.new('crews')
    sc.collection.children.link(coll)
    studio_c = bpy.data.collections.new('studio')
    sc.collection.children.link(studio_c)
    return meta, coll, studio_c, sheet_material()


def _place(team, lod, meta, coll, off, m):
    """A team's kart as the game will draw it: shared nodes coloured from the palette, team nodes as built."""
    nodes, own = assemble(lod, meta, coll, team=team, preview=True, offset=off)
    objs = list(nodes.values())
    bake(objs, objs, 'preview', palette(team))
    for o in objs:
        o.data.materials.clear()
        o.data.materials.append(m)


def _shoot_sheet(studio_c, target, ortho, res, samples, name, views=(('rear', 180.0, 24.0), ('front', 0.0, 18.0))):
    studio(studio_c, floor_r=40.0, cove_r=6.0, wall_h=16.0, color='backdrop')
    cycles(samples, res)
    cam = camera(studio_c, 'cam', ortho=ortho)
    for vname, yaw, elev in views:
        for o in list(studio_c.objects):
            if o.type == 'LIGHT':
                bpy.data.objects.remove(o)
        y = math.radians(yaw)
        key = Matrix.Rotation(y, 3, 'Z') @ Vector((-6.0, -9.0, 10.0))
        fill = Matrix.Rotation(y, 3, 'Z') @ Vector((9.0, -4.0, 6.0))
        area(studio_c, 'key', target + key, target, 8.0, 4000, (1.0, 0.97, 0.92))
        area(studio_c, 'fill', target + fill, target, 10.0, 1200)
        e = math.radians(elev)
        off = Matrix.Rotation(y, 3, 'Z') @ Vector((0, -30 * math.cos(e), 30 * math.sin(e)))
        look(cam, target + off, target)
        render_to(os.path.join(SHEETS, '%s_%s.png' % (name, vname)))


def lodsheet(team_ids, samples=64):
    """Each listed team at LOD0..3 side by side (one row per team)."""
    meta, coll, studio_c, m = _sheet_scene()
    teams = {t['id']: t for t in F.teams()}
    for r, tid in enumerate(team_ids):
        for lod in LODS:
            _place(teams[tid], lod, meta, coll, Vector(((lod - 1.5) * 3.4, r * 5.5, 0)), m)
    _shoot_sheet(studio_c, Vector((0, (len(team_ids) - 1) * 2.75, 1.0)), 6.0 + 2.6 * len(team_ids),
                 (2000, 1000 + 300 * len(team_ids)), samples, 'lods_' + '_'.join(t[:6] for t in team_ids))


def sheet(lod=1, samples=96):
    meta, coll, studio_c, m = _sheet_scene()
    for k, team in enumerate(F.teams()):
        _place(team, lod, meta, coll, Vector(((k % 6 - 2.5) * 3.3, (k // 6) * 6.0, 0)), m)
    _shoot_sheet(studio_c, Vector((0, 3.0, 1.0)), 8.6, (2400, 1100), samples, 'lineup_lod%d' % lod)


def table():
    out = {}
    for t in F.teams():
        for lod in LODS:
            p = os.path.join(OUT, '%s-lod%d.json' % (t['id'], lod))
            if os.path.exists(p):
                with open(p, encoding='utf-8') as f:
                    d = json.load(f)
                out.setdefault(t['id'], {})[lod] = dict(figures=d['tris']['figures'], tub=d['tris']['tub'],
                                                        total=d['tris']['total'],
                                                        nodes={k: v['tris'] for k, v in d['nodes'].items()})
    with open(os.path.join(OUT, 'tris.json'), 'w', encoding='utf-8') as f:
        json.dump(out, f, indent=1, sort_keys=True)
    hashes = {}
    for fn in sorted(os.listdir(OUT)):
        if fn.endswith(('.glb', '.json', '.png')) and fn != 'hashes.json':
            with open(os.path.join(OUT, fn), 'rb') as f:
                hashes[fn] = hashlib.sha256(f.read()).hexdigest()
    with open(os.path.join(OUT, 'hashes.json'), 'w', encoding='utf-8') as f:
        json.dump(hashes, f, indent=1, sort_keys=True)
    print('@@TABLE', len(out))


if '--atlas' in ARGV:
    build_atlas()
if '--build' in ARGV:
    ids = (arg('--teams') or ','.join(t['id'] for t in F.teams())).split(',')
    build(ids, [int(v) for v in (arg('--lods') or '0,1,2,3').split(',')])
if '--sheet' in ARGV:
    sheet()
if '--lodsheet' in ARGV:
    lodsheet(arg('--lodsheet').split(','))
if '--table' in ARGV:
    table()
