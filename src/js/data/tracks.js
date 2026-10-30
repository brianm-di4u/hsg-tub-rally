// Course registry. Baked track JSON arrives either inlined in index.html (the gray box) or in a per-track
// classic-script pack (assets/pack-track-<id>.js → window.TR_PACKS[id].track), loaded on demand.
/* global TRACK_GRAYBOX, TRACK_BATHHOUSE_ROW */

export const TRACKS = [
  { id: 'bathhouse-row', name: 'Bathhouse Row', cup: 'bathhouse', pack: 'row', blurb: 'Central Avenue past all eight bathhouses, then back along the Grand Promenade.', inline: () => (typeof TRACK_BATHHOUSE_ROW !== 'undefined' ? TRACK_BATHHOUSE_ROW : null) },
  { id: 'graybox', name: 'Gray-box Test Loop', cup: null, pack: null, inline: () => (typeof TRACK_GRAYBOX !== 'undefined' ? TRACK_GRAYBOX : null), dev: true },
];

export const TRACK_BY_ID = Object.fromEntries(TRACKS.map((t) => [t.id, t]));

export function trackData(id) {
  const t = TRACK_BY_ID[id];
  if (!t) return null;
  if (t.inline) return t.inline();
  const p = (window.TR_PACKS || {})['track-' + id];
  return p ? p.track : null;
}
