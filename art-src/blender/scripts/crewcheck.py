"""Close-up checks of the exported crews, as the game composes them (renders/crew/check_*.png):
    check_lod1_rim.png       LOD1 tub rim from the team-select close-up angle (traditional and skirted tubs)
    check_lod1_tub_side.png  LOD1 tubs from the side: stripe tile, base seam groove, rim tube
    check_lod1_hats.png      every team's captain head and hat at LOD1, from the front and above (hat studs)
    check_lod2_faces.png     LOD2 crews from the front at the distance the Low tier draws rivals near the camera
Run from the game folder: blender -b --factory-startup --python art-src/blender/scripts/crewcheck.py
"""
import math
import os
import sys

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)
import bpy  # noqa: E402
from mathutils import Vector  # noqa: E402

import brickcrew as BC  # noqa: E402

TEAMS = {t['id']: t for t in BC.F.teams()}


def light(studio_c, t):
    BC.area(studio_c, 'key', t + Vector((-6.0, -9.0, 10.0)), t, 8.0, 4000, (1.0, 0.97, 0.92))
    BC.area(studio_c, 'fill', t + Vector((9.0, -4.0, 6.0)), t, 10.0, 1200)


def shoot(lod, team_ids, spacing, cam_loc, target, lens, name, samples=96):
    meta, coll, studio_c, m = BC._sheet_scene()
    for k, tid in enumerate(team_ids):
        BC._place(TEAMS[tid], lod, meta, coll, Vector(((k - (len(team_ids) - 1) / 2) * spacing, 0, 0)), m)
    BC.studio(studio_c, floor_r=40.0, cove_r=6.0, wall_h=16.0, color='backdrop')
    BC.cycles(samples, (1280, 800))
    cam = BC.camera(studio_c, 'cam', lens=lens)
    t = Vector(target)
    light(studio_c, t)
    BC.look(cam, Vector(cam_loc), t)
    BC.render_to(os.path.join(BC.SHEETS, name))


def hats(lod=1, samples=96):
    """Captains' heads and hats only (the rest of each kart is removed after the bake), two rows of six."""
    meta, coll, studio_c, m = BC._sheet_scene()
    for k, tid in enumerate(TEAMS):
        BC._place(TEAMS[tid], lod, meta, coll, Vector(((k % 6 - 2.5) * 1.0, (k // 6) * 1.6, 0)), m)
    for o in list(coll.objects):
        if o.name.split('.')[0] not in ('cap_head', 'cap_hat'):
            bpy.data.objects.remove(o)
    BC.studio(studio_c, floor_r=40.0, cove_r=6.0, wall_h=16.0, color='backdrop')
    BC.cycles(samples, (2600, 1000))
    cam = BC.camera(studio_c, 'cam', ortho=2.3)
    t = Vector((0.0, 0.9, 1.75))
    light(studio_c, t)
    e = math.radians(28.0)
    BC.look(cam, t + Vector((0, -30 * math.cos(e), 30 * math.sin(e))), t)
    BC.render_to(os.path.join(BC.SHEETS, 'check_lod1_hats.png'))


shoot(1, ['engine-six', 'suds-posse'], 2.6, (-1.0, -3.1, 2.5), (0.0, -0.4, 1.0), 30.0, 'check_lod1_rim.png')
shoot(1, ['engine-six', 'trail-shredders'], 2.4, (4.6, -1.0, 1.25), (0.0, 0.0, 0.75), 35.0, 'check_lod1_tub_side.png')
hats()
shoot(2, ['engine-six', 'velvet-mob', 'suds-posse'], 2.2, (0.0, -5.2, 2.0), (0.0, 0.0, 1.25), 40.0, 'check_lod2_faces.png')
