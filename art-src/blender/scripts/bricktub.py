"""Brick tubs for the game: shell, chassis, feet or skirt, wheels, flag, duck and water, at three detail levels.

Phase 4 of the brick-toy campaign. The Gold Master tub (goldmaster.py) rebuilt with brickkit knobs and the
same `detail` levels as brickfig.py:
    full      rolled-rim tube, stripe tile, base seam groove, enamel, studded chassis, claw feet or moulded skirt,
              tyres with grooves and lugs
    no-micro  low-sided shell (the band kept as faces), plain chassis, posts or a skirt, prism wheels
    blocks    the fewest faces that keep the silhouette and the team colours

Divisions (src/js/data/teams.js DIVISIONS): traditional gets claw feet; modified and stock get a moulded
skirt. The inside is white enamel for every team. Blender coordinates: Z up, forward -Y, kart left +X.
"""
import bpy
import bmesh
import math
import os
import sys

from mathutils import Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)
sys.dont_write_bytecode = True               # no __pycache__ next to the scripts
from brickkit import *  # noqa: E402,F401,F403
from brickkit import _new_bm, _cls, bm_cap, bm_loft, bm_sweep, bm_lathe, bm_cyl, bm_sphere, bm_tube, FLAT  # noqa: E402
from brickfig import rb, bx, cyl_, sph, shade_hex, I4  # noqa: E402

TUB_C = 0.44                    # half-length of the stadium plan's centre line
ROLL = (0.432, 1.018, 0.026)    # rolled rim: centre (d, z) and radius
BOWL_NA, RIM_NA = 16, 56        # full detail: segments per rounded end of the bowl and of the rolled-rim tube
STRIPE = (0.70, 0.80)           # team stripe band (z); at full detail a raised tile on each straight side
SEAM_Z = 0.50                   # full detail: mould seam groove where the bowl meets its base ring
CHASSIS_TOP = 0.356
WHEELS = [[0.56, 0.3, 0.6], [-0.56, 0.3, 0.6], [0.56, 0.3, -0.6], [-0.56, 0.3, -0.6]]   # game space; 0 = front left
FLAG_BASE = (-0.3, 1.0, -0.72)  # game space
DUCK_BASE = (0.3, 1.03, 0.72)
WATER_Z = 0.5 + 0.48 * 0.75     # rest height at 75 % fill (the game moves it: 0.5 + 0.48 * fill)
ENAMEL = '#F7F5EF'
IRON = '#3B3B42'


def g2b(x, y, z):
    return (x, -z, y)


def d_out(z):
    return 0.415 - 0.10 * ((0.985 - z) / 0.535) ** 2.2


def d_in(z):
    return 0.398 - 0.10 * ((0.985 - z) / 0.465) ** 2.0


def stadium(d, z, kn, detail, na=None):
    """Double-ended tub plan at distance d from the centre line, counter-clockwise from above. na overrides
    the segments per rounded end."""
    if detail == 'blocks':
        ns, na0 = 1, 2
    elif detail == 'no-micro':
        ns, na0 = 1, max(3, kn.round_segs // 2)
    else:
        ns, na0 = max(1, kn.round_segs // 6), BOWL_NA
    na = na or na0
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


def _on_roll(deg, inset=0.0):
    rx, rz, rr = ROLL
    return (rx + (rr - inset) * math.cos(math.radians(deg)), rz + (rr - inset) * math.sin(math.radians(deg)))


def tub_profile(kn, detail):
    """Shell profile (d, z) from the outer bottom, up the wall, round the rim, down the enamel. The band
    edges at 0.70 and 0.80 m are always profile points (the team band is faces between them). At full
    detail the wall and the enamel meet the rolled-rim tube (rim()) on its surface and close inside it."""
    if detail == 'blocks':
        return [(0.27, 0.42), (d_out(0.70), 0.70), (d_out(0.80), 0.80), (0.432, 1.044), (d_in(0.86), 0.86), (0.25, 0.52)]
    if detail == 'no-micro':
        prof = [(0.24, 0.42), (0.303, 0.436)] + [(d_out(z), z) for z in (0.55, 0.70, 0.80, 0.985)]
        rx, rz, rr = ROLL
        prof += [(rx + rr * math.cos(math.radians(a)), rz + rr * math.sin(math.radians(a))) for a in (-40, 60, 180)]
        prof += [(d_in(z), z) for z in (0.80, 0.60)] + [(0.22, 0.52)]
        return prof
    lo = kn.curve_segs < 3
    prof = [(0.24, 0.42), (0.286, 0.427), (0.303, 0.436)] if not lo else [(0.24, 0.42), (0.303, 0.436)]
    outer = (0.45, SEAM_Z, 0.60, 0.70, 0.75, 0.80, 0.88, 0.95, 0.985) if not lo else (SEAM_Z, 0.60, 0.70, 0.80, 0.92, 0.985)
    for z in outer:
        if z == SEAM_Z:                     # V groove, 8 mm deep: the seam between the base ring and the bowl
            prof += [(d_out(z - 0.005), z - 0.005), (d_out(z) - 0.008, z), (d_out(z + 0.005), z + 0.005)]
        else:
            prof.append((d_out(z), z))
    prof += [_on_roll(235), _on_roll(212, 0.014), _on_roll(190)]
    inner =(0.96, 0.90, 0.80, 0.70, 0.62, 0.56) if not lo else (0.92, 0.78, 0.62)
    prof += [(d_in(z), z) for z in inner]
    prof += [(0.27, 0.53), (0.245, 0.522), (0.22, 0.52)] if not lo else [(0.25, 0.522), (0.22, 0.52)]
    return prof


def _tub_mat(cols, rim=True, band=True):
    """Shell colours. rim/band False at full detail, where the rim tube and the stripe tile are own parts."""
    def f(c, n):
        dd = abs(c.x) if abs(c.y) <= TUB_C else math.hypot(c.x, abs(c.y) - TUB_C)
        rad = Vector((c.x, 0.0 if abs(c.y) <= TUB_C else c.y - math.copysign(TUB_C, c.y), 0))
        rad = rad.normalized() if rad.length > 1e-9 else Vector((1, 0, 0))
        if rim and c.z > 0.99 and dd > 0.40:
            return cols.get('rim', cols['trim'])
        if n.dot(rad) < -0.05 or (n.z > 0.5 and c.z > 0.5):
            return ENAMEL
        if band and STRIPE[0] <= c.z <= STRIPE[1] and abs(c.y) <= TUB_C + 0.01:
            return cols['flag']
        return cols['tub']
    return f


def shell(p, kn, detail, cols):
    prof = tub_profile(kn, detail)
    bm = bm_sweep(prof, lambda d, z: stadium(d, z, kn, detail), sharp=35.0)
    n = len(stadium(0.3, 0, kn, detail))
    vs = list(bm.verts)
    bm_cap(bm, vs[:n], False)
    bm_cap(bm, vs[-n:], True)
    p.add(bm, None, _tub_mat(cols, rim=detail != 'full', band=detail != 'full'), recalc=True)
    if detail == 'full':
        rim(p, kn, cols)
        stripe_tile(p, kn, cols)


def stripe_tile(p, kn, cols, t=0.012, L=0.40, ch=0.004):
    """The team stripe as a separate raised tile on each straight side of the bowl: t proud of the wall, its
    edges chamfered, its outline a part seam. The back face hides in the wall."""
    z0, z1 = STRIPE
    mids = [z0 + (z1 - z0) * k / kn.curve_segs for k in range(1, kn.curve_segs)]
    prof = [(d_out(z0) - 0.004, z0), (d_out(z0) + t - ch, z0), (d_out(z0 + ch) + t, z0 + ch)]
    prof += [(d_out(z) + t, z) for z in mids]
    prof += [(d_out(z1 - ch) + t, z1 - ch), (d_out(z1) + t - ch, z1), (d_out(z1) - 0.004, z1)]
    n = len(prof)
    for s in (1, -1):
        bm = _new_bm()
        cl = _cls(bm)
        rows = [[bm.verts.new((s * d, y, z)) for y in (-L, L)] for d, z in prof]
        g, prev = 0, None
        for i in range(n):
            j = (i + 1) % n
            dv = Vector((prof[j][0] - prof[i][0], prof[j][1] - prof[i][1]))
            if prev is None or math.degrees(prev.angle(dv)) > 35.0:
                g += 1
            prev = dv
            bm.faces.new([rows[i][0], rows[j][0], rows[j][1], rows[i][1]])[cl] = g
        bm_cap(bm, [r[0] for r in rows], False)
        bm_cap(bm, [r[1] for r in rows], True)
        p.add(bm, None, cols['flag'], recalc=True)


def rim(p, kn, cols):
    """Rolled rim: a closed round tube over the bowl's top edge, one smooth group, with RIM_NA segments per
    rounded end (finer than the bowl, so the rim's outline and highlight stay smooth in close-ups)."""
    rx, rz, rr = ROLL
    m = 4 + 2 * kn.curve_segs
    prof = [(rx + rr * math.cos(2 * math.pi * k / m), rz + rr * math.sin(2 * math.pi * k / m)) for k in range(m)]
    bm = bm_sweep(prof, lambda d, z: stadium(d, z, kn, 'full', na=RIM_NA), closed=True, sharp=None)
    p.add(bm, None, cols.get('rim', cols['trim']), recalc=True)


def body(p, c):
    """The kart body node: studded chassis plate, axle blocks and bosses, and the shell. The feet or the
    skirt are separate nodes (feet() for traditional, skirt() for modified and stock)."""
    kn, detail, cols = c.kn, c.detail, c.col
    if detail == 'full':
        plate(p, kn, 3, 5, M=T(0, 0, CHASSIS_TOP - PLATE), mat=IRON)
        for y in (-0.6, 0.6):
            brick(p, kn, 3, 1, plates=1, M=T(0, y, CHASSIS_TOP - 2 * PLATE), mat=IRON, top=False)
            for s in (1, -1):
                cyl_(p, c, 0.055, 0.06, T(s * 0.405, y, 0.30) @ R(s * 90, 'Y'), IRON, b0=0.0, b1=0.008)
                cyl_(p, c, 0.022, 0.17, T(s * 0.46, y, 0.30) @ R(s * 90, 'Y'), 'silver/metal', b0=0.0, b1=0.004,
                     segs=max(6, kn.round_segs // 2))
    else:
        bx(p, (3 * PITCH - 2 * GAP, 5 * PITCH - 2 * GAP, PLATE), (0, 0, CHASSIS_TOP - PLATE / 2), IRON,
           skip=('-z',) if detail == 'blocks' else ())
    shell(p, kn, detail, cols)


def feet(p, c):
    """Traditional division: four ball-and-claw feet, each on a stud of the chassis."""
    kn, detail, trim = c.kn, c.detail, c.col['trim']
    for sx in (1, -1):
        for sy in (1, -1):
            x, y = sx * PITCH, sy * 2 * PITCH
            if detail == 'full':
                rad = Vector((x, y - math.copysign(TUB_C, y), 0)).normalized()
                cyl_(p, c, 0.098, 0.068, T(x, y, CHASSIS_TOP), trim, b0=0.006, b1=0.014)
                bz = 0.458
                sph(p, c, 0.058, T(x, y, bz), trim)
                for k in (-1, 0, 1):
                    a = math.atan2(rad.y, rad.x) + k * 0.95
                    d = Vector((math.cos(a), math.sin(a), 0))
                    rb(p, c, (0.042, 0.03, 0.07), (0, 0, 0), trim,
                       T(x + d.x * 0.052, y + d.y * 0.052, bz - 0.008) @ R(math.degrees(a), 'Z') @ R(-28, 'Y'), r=0.013)
            elif detail == 'blocks':
                bx(p, (0.12, 0.12, 0.10), (x, y, CHASSIS_TOP + 0.05), trim, skip=('-z', '+z'))
            else:
                cyl_(p, c, 0.07, 0.11, T(x, y, CHASSIS_TOP), trim, cap0=False, cap1=False, segs=6)


def skirt(p, c):
    """Modified and stock divisions: a moulded plinth under the shell, in the tub colour."""
    kn, detail = c.kn, c.detail
    sk = shade_hex(c.col['tub'], 0.8)
    if detail == 'full':
        prof = [(0.27, CHASSIS_TOP), (0.27, 0.40)]
        nb = max(1, kn.bevel_segs)
        prof += [(0.24 + 0.03 * math.cos(math.radians(90 * k / nb)), 0.40 + 0.03 * math.sin(math.radians(90 * k / nb)))
                 for k in range(1, nb + 1)]
        prof += [(0.20, 0.45)]
        bm = bm_sweep(prof, lambda d, z: stadium(d, z, kn, detail))
        n = len(stadium(0.3, 0, kn, detail))
        vs = list(bm.verts)
        bm_cap(bm, vs[:n], False)
        bm_cap(bm, vs[-n:], True)
        p.add(bm, None, sk, recalc=True)
    elif detail == 'blocks':
        bx(p, (0.54, 1.40, 0.09), (0, 0, CHASSIS_TOP + 0.045), sk, skip=('-z', '+z'))
    else:
        bm, vr = bm_loft([stadium(0.27, CHASSIS_TOP, kn, detail), stadium(0.27, 0.45, kn, detail)], group=1, closed=True)
        p.add(bm, None, sk, recalc=False)


def wheel(p, c, side):
    """One wheel around +X, hub facing out (side = +1 left, -1 right), centred on the origin."""
    kn, detail, cols = c.kn, c.detail, c.col
    M = S(-1, 1, 1) if side < 0 else I4
    if detail == 'full':
        sh = 0.036
        sb = max(2, kn.bevel_segs * 2)
        t = [(-0.064, 0.19)] + ([(-0.07, 0.21)] if kn.bevel_segs >= 2 else []) + [(-0.072, 0.24), (-0.07, 0.30 - sh)]
        t += [(-0.07 + sh + sh * math.cos(math.pi - math.pi / 2 * k / sb), 0.30 - sh + sh * math.sin(math.pi - math.pi / 2 * k / sb))
              for k in range(1, sb)]
        if kn.bevel_segs >= 2:
            t += list(zip([-0.034, -0.026, -0.0255, -0.0105, -0.010, 0.010, 0.0105, 0.0255, 0.026, 0.034],
                          [0.30, 0.30, 0.292, 0.292, 0.30, 0.30, 0.292, 0.292, 0.30, 0.30]))
        else:
            t += [(-0.034, 0.30), (0.034, 0.30)]
        t += [(0.07 - sh + sh * math.cos(math.pi / 2 - math.pi / 2 * k / sb), 0.30 - sh + sh * math.sin(math.pi / 2 - math.pi / 2 * k / sb))
              for k in range(1, sb)]
        t += ([(0.072, 0.24), (0.07, 0.21), (0.064, 0.19)] if kn.bevel_segs >= 2 else [(0.072, 0.24), (0.064, 0.19)])
        segs = max(8, kn.round_segs * 3 // 2)
        p.add(bm_lathe(t, segs, axis='X', closed=True), M, 'black/rubber', recalc=True)
        h = [(-0.05, 0.0), (-0.05, 0.12), (-0.058, 0.17), (-0.062, 0.192), (0.062, 0.192), (0.066, 0.18),
             (0.06, 0.165), (0.046, 0.16), (0.046, 0.085), (0.07, 0.078), (0.08, 0.06), (0.08, 0.024),
             (0.062, 0.02), (0.062, 0.0)]
        p.add(bm_lathe(h, segs, axis='X'), M,
              lambda q, n: cols['trim'] if abs(q.x) > 0.04 and math.hypot(q.y, q.z) < 0.085 else 'light_grey', recalc=True)
        for k in range(6):
            a = 2 * math.pi * k / 6 + math.pi / 6
            p.add(bm_cyl(0.019, 0.016, max(6, kn.round_segs // 2), cap0=False, b1=0.004 if kn.bevel_segs else 0.0,
                         bsegs=kn.bevel_segs), M @ T(0.044, 0.115 * math.cos(a), 0.115 * math.sin(a)) @ R(90, 'Y'),
                  'silver/metal')
        return
    n = 8 if detail == 'no-micro' else 6
    bm = _new_bm()
    cl = _cls(bm)
    outer = {s: [bm.verts.new((s * 0.07, 0.30 * math.cos(2 * math.pi * k / n), 0.30 * math.sin(2 * math.pi * k / n)))
                 for k in range(n)] for s in (-1, 1)}
    for k in range(n):
        k2 = (k + 1) % n
        bm.faces.new([outer[-1][k], outer[-1][k2], outer[1][k2], outer[1][k]])[cl] = 1
    tyre = len(bm.faces)
    if detail == 'no-micro':
        hub = {s: [bm.verts.new((s * 0.071, 0.19 * math.cos(2 * math.pi * k / n), 0.19 * math.sin(2 * math.pi * k / n)))
                   for k in range(n)] for s in (-1, 1)}
        for s in (-1, 1):
            for k in range(n):
                k2 = (k + 1) % n
                q = [outer[s][k], outer[s][k2], hub[s][k2], hub[s][k]]
                bm.faces.new(q if s < 0 else list(reversed(q)))[cl] = FLAT
            bm.faces.new(hub[s] if s > 0 else list(reversed(hub[s])))[cl] = FLAT
    else:
        for s in (-1, 1):
            bm.faces.new(outer[s] if s > 0 else list(reversed(outer[s])))[cl] = FLAT
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    hubcol = cols['trim'] if detail == 'blocks' else 'light_grey'

    def fmat(q, nrm):
        if abs(nrm.x) < 0.5:
            return 'black/rubber'
        r = math.hypot(q.y, q.z)
        return 'black/rubber' if (detail == 'no-micro' and r > 0.2) else (cols['trim'] if detail == 'no-micro' else hubcol)
    p.add(bm, M, fmat)


def flag(p, c, base):
    """Flag on its pole; base is the pole foot in Blender coordinates (the node pivot)."""
    kn, detail, cols = c.kn, c.detail, c.col
    fb = Vector(base)
    fl, fh, ft = 0.55, 0.35, 0.016
    if detail != 'full':
        if detail == 'blocks':
            bx(p, (0.04, 0.04, 1.27), (fb.x, fb.y, fb.z + 0.635), 'light_grey', skip=('-z',))
        else:
            cyl_(p, c, 0.022, 1.27, T(fb.x, fb.y, fb.z), 'light_grey', cap0=False, segs=4)
        bx(p, (ft, fl, fh), (fb.x, fb.y + 0.035 + fl / 2, fb.z + 0.85 + fh / 2), cols['flag'])
        return
    cyl_(p, c, 0.046, 0.075, T(fb.x, fb.y, fb.z - 0.02), cols['trim'], b0=0.006, b1=0.01)
    cyl_(p, c, 0.022, 1.25, T(fb.x, fb.y, fb.z), 'light_grey', b0=0.0, b1=0.004)
    sph(p, c, 0.04, T(fb.x, fb.y, fb.z + 1.27), cols['trim'])
    nf = max(1, kn.curve_segs)
    na = max(1, kn.bevel_segs + 1)
    sec = [(ft / 2, fh / 2 - ft / 2 - (fh - ft) * j / nf) for j in range(nf + 1)]
    sec += [(ft / 2 * math.cos(a), -fh / 2 + ft / 2 + ft / 2 * math.sin(a)) for a in [-math.pi * k / na for k in range(1, na)]]
    sec += [(-ft / 2, -fh / 2 + ft / 2 + (fh - ft) * j / nf) for j in range(nf + 1)]
    sec += [(ft / 2 * math.cos(a), fh / 2 - ft / 2 + ft / 2 * math.sin(a)) for a in [math.pi - math.pi * k / na for k in range(1, na)]]
    steps = max(2, kn.curve_segs * 4)
    rings = []
    for i in range(steps + 1):
        u = i / steps
        wave = 0.028 * math.sin(2 * math.pi * u * 1.1) * u
        rings.append([(fb.x + wave + sx, fb.y + 0.035 + fl * u, fb.z + 0.85 + fh / 2 + sz) for sx, sz in sec])
    bm, vr = bm_loft(rings, group=1, closed=True)
    bm_cap(bm, vr[0], True)
    bm_cap(bm, vr[-1], False)
    p.add(bm, None, cols['flag'], recalc=True)
    for z in (0.88, 1.17):
        p.add(bm_tube(0.034, 0.022, 0.045, max(6, kn.round_segs // 2), b=0.004 if kn.bevel_segs else 0.0),
              T(fb.x, fb.y, fb.z + z - 0.0225), cols['flag'])


def duck(p, c, base):
    kn, detail = c.kn, c.detail
    db = Vector(base)
    if detail == 'blocks':
        bx(p, (0.15, 0.20, 0.13), (db.x, db.y + 0.005, db.z + 0.065), 'duck', skip=('-z',))
        bx(p, (0.10, 0.10, 0.10), (db.x, db.y - 0.05, db.z + 0.17), 'duck', skip=('-z',), mats={'-y': 'beak'})
        return
    if detail == 'no-micro':
        bx(p, (0.15, 0.20, 0.13), (db.x, db.y + 0.005, db.z + 0.065), 'duck', skip=('-z',))
        bx(p, (0.10, 0.10, 0.10), (db.x, db.y - 0.045, db.z + 0.17), 'duck', skip=('-z',))
        bx(p, (0.05, 0.06, 0.022), (db.x, db.y - 0.12, db.z + 0.16), 'beak', skip=('+y',))
        return
    sph(p, c, 1.0, T(db.x, db.y + 0.005, db.z + 0.068) @ S(0.078, 0.102, 0.07), 'duck')
    sph(p, c, 1.0, T(db.x, db.y + 0.085, db.z + 0.105) @ R(-35, 'X') @ S(0.03, 0.03, 0.05), 'duck')
    for s in (1, -1):
        sph(p, c, 1.0, T(db.x + s * 0.068, db.y + 0.015, db.z + 0.08) @ S(0.02, 0.055, 0.035), 'duck')
    sph(p, c, 0.056, T(db.x, db.y - 0.045, db.z + 0.17), 'duck')
    rb(p, c, (0.05, 0.06, 0.022), (0, 0, 0), 'beak', T(db.x, db.y - 0.105, db.z + 0.16) @ R(-8, 'X'), r=0.01)
    for s in (1, -1):
        sph(p, c, 0.0095, T(db.x + s * 0.026, db.y - 0.093, db.z + 0.19), 'black', segs=c.tiny)


def water(p, c):
    """Water sheet at the rest height; the game moves it with the fill level."""
    kn, detail = c.kn, c.detail
    wz = WATER_Z
    dw = d_in(wz) - 0.003
    if detail == 'full':                    # rings wound to face up (+Z), like the centre cap
        bm, vr = bm_loft([stadium(dw * f, wz, kn, detail) for f in (0.25, 0.5, 0.75, 1.0)], group=1, closed=True,
                         flip=True)
        bm_cap(bm, vr[0], True)
        p.add(bm, None, 'water/water')
        return
    bm = _new_bm()
    vs = [bm.verts.new(q) for q in stadium(dw, wz, kn, detail)]
    bm_cap(bm, vs, True)
    p.add(bm, None, 'water/water')
