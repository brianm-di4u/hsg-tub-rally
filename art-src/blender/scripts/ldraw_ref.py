"""A small LDraw .dat reader and Cycles renders of generic parts: the plastic/bevel quality ceiling.

Reference only: nothing read here ships, and no LDraw geometry is copied into game assets. The parts
library (the workspace's reference/models/ldraw, CC BY 4.0 per file; see reference/models/MANIFEST.md) is read as
data, never executed. No third-party add-on is used.

Reader
- Line types 1 (sub-file with colour and 3x4 matrix), 3 (triangle) and 4 (quad). Types 0 (meta and
  BFC), 2 and 5 (edge lines) are ignored, so winding is fixed afterwards with recalc_face_normals.
- Colour 16 inherits the parent colour; colours come from LDConfig.ldr.
- High resolution: a primitive is looked up in p/48 before p, the usual LDraw "hi-res" substitution.
  stud.dat is plain; logo studs are never substituted.
- Coordinates: LDraw is -Y up in LDU. Blender = (x, z, -y) * LDU, with LDU from brickkit (0.014 m, so a
  1 x 1 LDraw brick is the same size as a brickkit one).
- Smoothing: merged vertices, then sharp edges above 35 degrees. part_object(bevel_ldu=) adds a Bevel
  modifier (angle limit, as LDraw photo renderers do for round highlights). Harden normals is off: on
  LDraw's polygon soup (T-junctions, unwelded primitives) it streaks the stud sides.

Run from the game folder:
  blender -b --factory-startup --python art-src/blender/scripts/ldraw_ref.py -- \
      [--lib <path to the LDraw library>] [--samples 256]   (default: ../../reference/models/ldraw)
Writes art-src/blender/renders/goldmaster/ldraw_*.png and ldraw_parts.json (licence lines per part).
"""
import bpy
import bmesh
import json
import math
import os
import re
import sys

from mathutils import Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.dont_write_bytecode = True               # no __pycache__ next to the scripts
from brickkit import *  # noqa: E402,F401,F403

ARGV = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def arg(name, default=None):
    return ARGV[ARGV.index(name) + 1] if name in ARGV else default


LIB = os.path.abspath(os.path.join(GAME, arg('--lib', '../../reference/models/ldraw')))
SAMPLES = int(arg('--samples', '256'))
OUT = os.path.join(RENDER_DIR, 'goldmaster')
TO_BLENDER = Matrix(((1, 0, 0, 0), (0, 0, 1, 0), (0, -1, 0, 0), (0, 0, 0, 1))) @ Matrix.Scale(LDU, 4)


class Library:
    def __init__(self, root, hires=True):
        self.root, self.hires = root, hires
        self.cache, self.meta = {}, {}
        self.colours = self._colours()

    def _colours(self):
        out = {}
        with open(os.path.join(self.root, 'LDConfig.ldr'), encoding='utf-8', errors='replace') as f:
            for ln in f:
                m = re.match(r'0\s+!COLOUR\s+(\S+)\s+CODE\s+(\d+)\s+VALUE\s+#([0-9A-Fa-f]{6})', ln)
                if m:
                    out[int(m.group(2))] = (m.group(1), '#' + m.group(3).upper())
        return out

    def find(self, name):
        n = name.strip().replace('\\', '/').lower()
        cands = []
        if self.hires:
            cands.append(os.path.join(self.root, 'p', '48', n))
        cands += [os.path.join(self.root, d, n) for d in ('parts', 'p', 'models')]
        for c in cands:
            if os.path.isfile(c):
                return c
        raise FileNotFoundError(name)

    def lines(self, name):
        path = self.find(name)
        if path in self.cache:
            return self.cache[path]
        out, meta = [], {}
        with open(path, encoding='utf-8', errors='replace') as f:
            for i, ln in enumerate(f):
                t = ln.split()
                if not t:
                    continue
                if t[0] == '0':
                    if i == 0:
                        meta['title'] = ln[1:].strip()
                    for key in ('!LICENSE', 'Author:', '!LDRAW_ORG'):
                        if len(t) > 1 and t[1] == key:
                            meta[key.strip('!:').lower()] = ' '.join(t[2:])
                elif t[0] == '1' and len(t) >= 15:
                    v = [float(x) for x in t[2:14]]
                    M = Matrix(((v[3], v[4], v[5], v[0]), (v[6], v[7], v[8], v[1]),
                                (v[9], v[10], v[11], v[2]), (0, 0, 0, 1)))
                    out.append(('1', int(t[1]), M, ' '.join(t[14:])))
                elif t[0] in ('3', '4'):
                    k = int(t[0])
                    pts = [Vector([float(x) for x in t[2 + 3 * j:5 + 3 * j]]) for j in range(k)]
                    out.append((t[0], int(t[1]), pts, None))
        self.cache[path] = out
        self.meta[path] = meta
        return out

    def flatten(self, name, M=None, colour=16, out=None, depth=0):
        """[(colour, [v0, v1, v2])] in LDraw units for the whole part."""
        M = M or Matrix.Identity(4)
        out = [] if out is None else out
        for kind, c, a, sub in self.lines(name):
            cc = colour if c == 16 else c
            if kind == '1':
                if depth < 32:
                    self.flatten(sub, M @ a, cc, out, depth + 1)
            elif kind == '3':
                out.append((cc, [M @ p for p in a]))
            else:
                out.append((cc, [M @ a[0], M @ a[1], M @ a[2]]))
                out.append((cc, [M @ a[0], M @ a[2], M @ a[3]]))
        return out


def part_object(lib, name, colour, coll, label, bevel_ldu=0.0):
    tris = lib.flatten(name, colour=colour)
    bm = bmesh.new()
    mats = {}
    for c, pts in tris:
        vs = [bm.verts.new(TO_BLENDER @ p) for p in pts]
        try:
            f = bm.faces.new(vs)
        except ValueError:
            continue
        key = c
        if key not in mats:
            mats[key] = len(mats)
        f.material_index = mats[key]
    bmesh.ops.remove_doubles(bm, verts=bm.verts[:], dist=0.002 * LDU)
    bmesh.ops.dissolve_degenerate(bm, edges=bm.edges[:], dist=0.0005 * LDU)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    me = bpy.data.meshes.new(label)
    # LDraw parts hang below their origin (the top of the brick); stand them on z = 0, centred in x and y
    lo = [min(v.co[i] for v in bm.verts) for i in range(3)]
    hi = [max(v.co[i] for v in bm.verts) for i in range(3)]
    bmesh.ops.translate(bm, vec=(-(lo[0] + hi[0]) / 2, -(lo[1] + hi[1]) / 2, -lo[2]), verts=bm.verts[:])
    bm.to_mesh(me)
    bm.free()
    for c in sorted(mats, key=mats.get):
        nm, hx = lib.colours.get(c, ('Unknown', '#888888'))
        me.materials.append(plastic('ld_%s' % nm, hx, 'abs'))
    for p in me.polygons:
        p.use_smooth = True
    me.set_sharp_from_angle(angle=math.radians(35))
    o = bpy.data.objects.new(label, me)
    coll.objects.link(o)
    if bevel_ldu > 0:
        b = o.modifiers.new('bevel', 'BEVEL')
        b.width = bevel_ldu * LDU
        b.segments = 3
        b.limit_method = 'ANGLE'
        b.angle_limit = math.radians(35)
        # harden_normals streaks on LDraw's polygon soup (T-junctions, unwelded primitives), so the sharp
        # edges from set_sharp_from_angle do the work instead
        b.harden_normals = False
        b.use_clamp_overlap = True
    meta = lib.meta[lib.find(name)]
    return o, dict(file=name, title=meta.get('title'), author=meta.get('author'), license=meta.get('license'),
                   update=meta.get('ldraw_org'), colour=lib.colours.get(colour), triangles=len(tris))


def lights(coll, rig):
    area(coll, 'key', (-3.4, -3.4, 4.4), (0, 0, 0.2), 3.2, 1300, (1.0, 0.96, 0.9), rig)
    area(coll, 'fill', (4.2, -2.6, 1.8), (0, 0, 0.2), 3.5, 220, (0.9, 0.95, 1.0), rig)
    area(coll, 'rim', (2.2, 3.8, 3.6), (0, 0, 0.3), 2.4, 900, (1.0, 1.0, 1.0), rig)
    area(coll, 'sheen', (0.0, -7.6, 3.4), (0, 0, 0.3), 5.0, 900, (1.0, 1.0, 1.0), rig, size_y=2.2)
    area(coll, 'top', (0, -0.6, 6.0), (0, 0, 0.2), 4.0, 260, (1.0, 1.0, 1.0), rig, shape='DISK')


def main():
    reset()
    sc = bpy.context.scene
    coll = bpy.data.collections.new('ref')
    sc.collection.children.link(coll)
    studio_c = bpy.data.collections.new('studio')
    sc.collection.children.link(studio_c)
    lib = Library(LIB, hires=True)
    info = []

    # 1. the generic parts in a row, bevelled like an LDraw photo renderer
    row = [('3005.dat', 4, 'brick 1x1'), ('3004.dat', 14, 'brick 1x2'), ('3003.dat', 1, 'brick 2x2'),
           ('3022.dat', 2, 'plate 2x2'), ('3070b.dat', 15, 'tile 1x1'), ('3062b.dat', 72, 'round brick 1x1')]
    objs = []
    x = 0.0
    for name, col, label in row:
        o, meta = part_object(lib, name, col, coll, 'ld_' + label.replace(' ', '_'), bevel_ldu=0.3)
        dims = [o.dimensions[i] for i in range(3)]
        o.location = (x + dims[0] / 2, 0, 0)
        x += dims[0] + 0.22
        objs.append(o)
        meta['label'] = label
        info.append(meta)
    shift = -x / 2
    for o in objs:
        o.location.x += shift
    rig = bpy.data.objects.new('rig', None)
    studio_c.objects.link(rig)
    studio(studio_c)
    lights(studio_c, rig)
    cam = camera(studio_c, 'cam', lens=35)
    cycles(SAMPLES)
    look(cam, (0.0, -5.6, 2.7), (0, 0, 0.12))
    render_to(os.path.join(OUT, 'ldraw_parts.png'))
    for o in objs:
        o.hide_render = True

    # 2. LDraw (bevelled) against brickkit (GM knobs), same colour, side by side
    pairs = [('3003.dat', 4, 'brick', lambda p: brick(p, GM, 2, 2, 3, mat='#C91A09')),
             ('3062b.dat', 14, 'round', lambda p: round_brick(p, GM, mat='#F2CD37')),
             ('3070b.dat', 1, 'tile', lambda p: tile(p, GM, 1, 1, mat='#0055BF'))]
    mats = Mats()
    vs = []
    cur = 0.0
    for name, col, label, build in pairs:
        o, _ = part_object(lib, name, col, coll, 'cmp_ld_' + label, bevel_ldu=0.3)
        p = Part('cmp_bk_' + label)
        build(p)
        b = p.build(mats, (0, 0, 0), coll=coll)
        w = o.dimensions[0]
        o.location = (cur + w / 2, 0, 0)
        b.location = (cur + w + 0.1 + w / 2, 0, 0)
        cur += 2 * w + 0.1 + 0.35
        vs += [o, b]
    for o in vs:
        o.location.x -= (cur - 0.35) / 2
    look(cam, (0.0, -5.4, 2.6), (0, 0, 0.15))
    render_to(os.path.join(OUT, 'ldraw_vs_brickkit.png'))
    for o in vs:
        o.hide_render = True

    # 3. stud close-up: LDraw hi-res primitives raw, LDraw bevelled, brickkit stud (GM knobs)
    studs_row = []
    for i, bev in enumerate((0.0, 0.3)):
        o, _ = part_object(lib, '3003.dat', 4, coll, 'stud_ld_%d' % i, bevel_ldu=bev)
        o.location = (-0.85 + 0.85 * i, 0, 0)
        studs_row.append(o)
    p = Part('stud_bk')
    brick(p, GM, 2, 2, 3, mat='#C91A09')
    b = p.build(mats, (0, 0, 0), coll=coll)
    b.location = (0.85, 0, 0)
    studs_row.append(b)
    cam.data.lens = 45
    look(cam, (0.0, -4.4, 2.3), (0, 0.0, 0.22))
    render_to(os.path.join(OUT, 'ldraw_studs.png'))

    with open(os.path.join(OUT, 'ldraw_parts.json'), 'w', encoding='utf-8') as f:
        json.dump(dict(library=os.path.relpath(LIB, GAME).replace('\\', '/'), hires=True, parts=info), f, indent=1)
    print('@@LDRAW', json.dumps(info))


main()
