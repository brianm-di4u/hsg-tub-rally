// Cups (Grand Prix sets of four courses). Courses not yet built are skipped automatically.
export const CUPS = [
  { id: 'bathhouse', name: 'Bathhouse Cup', blurb: 'Downtown streets: Central Avenue, Park Avenue, Whittington Valley and Bridge Street.',
    tracks: ['bathhouse-row', 'park-avenue', 'whittington-valley', 'bridge-street'] },
  { id: 'ouachita', name: 'Ouachita Cup', blurb: 'National-park mountain roads: Hot Springs Mountain, Goat Rock, West Mountain and Sunset Ridge.',
    tracks: ['hs-mountain', 'goat-rock-gulpha', 'west-mountain', 'sunset-ridge'] },
];
export const CUP_BY_ID = Object.fromEntries(CUPS.map((c) => [c.id, c]));
export const TROPHY = ['Golden Faucet', 'Silver Faucet', 'Bronze Faucet'];
