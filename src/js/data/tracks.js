// Course registry. Baked course data arrives in per-course classic-script packs
// (assets/track-<id>.js → window.TR_PACKS['track-<id>'].track), injected on demand by ensureTrack().

export const TRACKS = [
  { id: 'bathhouse-row', name: 'Bathhouse Row', cup: 'bathhouse', blurb: 'Central Avenue past all eight bathhouses, then back along the Grand Promenade.', models: ['row', 'downtown'], tex: 'row', tex2: 'mtn' },
  { id: 'park-avenue', name: 'Park Avenue Nights', cup: 'bathhouse', blurb: 'Dusk and neon from the Arlington up Park Avenue.', tex: 'row', models: ['row', 'downtown'] },
  { id: 'whittington-valley', name: 'Whittington Valley', cup: 'bathhouse', blurb: 'West along Whittington Avenue through the wooded valley.', tex: 'row', tex2: 'mtn', models: ['row', 'downtown'] },
  { id: 'bridge-street', name: 'Bridge Street Bash', cup: 'bathhouse', blurb: 'Bridge Street, Malvern Avenue and the Exchange Street finish area.', tex: 'row', models: ['row', 'downtown'] },
  { id: 'hs-mountain', tex: 'mtn', models: ['mountain', 'downtown'], name: 'Hot Springs Mountain Drive', cup: 'ouachita', blurb: '1880s carriage-road switchbacks to the Tower and the Pagoda.' },
  { id: 'goat-rock-gulpha', tex: 'mtn', models: ['mountain', 'downtown'], name: 'Goat Rock & Gulpha Gorge', cup: 'ouachita', blurb: 'North Mountain overlooks and the creek fords of Gulpha Gorge.' },
  { id: 'west-mountain', tex: 'mtn', models: ['mountain', 'downtown'], name: 'West Mountain Summit', cup: 'ouachita', blurb: 'Up to the Summit Loop overlooks above the Row.' },
  { id: 'hill-wheatley', name: 'Hill Wheatley Plaza', cup: null, arena: true, blurb: 'Water Fight arena around the plaza fountain.', tex: 'row' },
  { id: 'sunset-ridge', tex: 'mtn', models: ['mountain', 'downtown'], name: 'Sunset Ridge', cup: 'ouachita', blurb: 'The Hot Springs Mountain summit circuit at sunset: picnic area, the Pagoda and the Tower.' },
];
// packs that exist in this build (written by the build step into assets/manifest-tracks.js)
export const TRACK_BY_ID = Object.fromEntries(TRACKS.map((t) => [t.id, t]));

export function trackData(id) {
  const p = (window.TR_PACKS || {})['track-' + id];
  return p ? p.track : null;
}
export function isBuilt(id) { return (window.TR_BUILT || []).includes(id); }
export function builtIds() { return TRACKS.map((t) => t.id).filter(isBuilt); }
