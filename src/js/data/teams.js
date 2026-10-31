// Divisions, speed classes and the twelve fictional teams. Divisions follow the real event's rules
// (Traditional = cast iron, Modified = fiberglass/plastic, Stock = tub provided; 2026 official rules, see
// research/town-content.md). Every team, captain and emblem is fictional, inspired by archetypes of real entries.

export const GAL_KG = 3.785; // one US gallon of water

// Base handling per division. Mass in kg (tub + captain); capacity in gallons. Multipliers are relative to Stock.
export const DIVISIONS = {
  traditional: { id: 'traditional', name: 'Traditional', tub: 'Cast-iron tub', tubKg: 150, capGal: 42,
    push: 1.04, top: 0.99, turn: 0.9, grip: 1.03, slosh: 0.86, rim: 1.08, blurb: 'Heavy cast iron. High top speed, wins every shove, slow off the line.' },
  modified: { id: 'modified', name: 'Modified', tub: 'Fiberglass tub', tubKg: 40, capGal: 34,
    push: 0.99, top: 0.99, turn: 1.12, grip: 0.98, slosh: 1.22, rim: 0.9, blurb: 'Light fiberglass. Jumps off the line and turns sharp, but sloshes.' },
  stock: { id: 'stock', name: 'Stock', tub: 'Provided tub', tubKg: 85, capGal: 38,
    push: 0.96, top: 0.99, turn: 1, grip: 1, slosh: 1, rim: 1, blurb: 'The tub the organizers hand you. Balanced in every way.' },
};

// Speed classes (game difficulty; named for bath temperatures). vTop in m/s for a Stock tub.
export const CLASSES = {
  splash: { id: 'splash', name: 'Splash', vTop: 17.5, ai: 0.92, rubber: 0.06, noise: 0.9, aggro: 0.35 },
  soak: { id: 'soak', name: 'Soak', vTop: 19.5, ai: 0.97, rubber: 0.04, noise: 0.55, aggro: 0.6 },
  scald: { id: 'scald', name: 'Scald', vTop: 21.5, ai: 1.0, rubber: 0.02, noise: 0.3, aggro: 0.85 },
};

// Captain names are invented. `perk` nudges one stat a little (never more than 4%).
// Colours: tub, trim, crew shirt, crew hat, captain outfit, skin tone, flag.
export const TEAMS = [
  { id: 'engine-six', name: 'Engine Six Soakers', div: 'traditional', archetype: 'Firefighters', captain: 'Capt. Rosa Hydrant',
    colors: { tub: '#C8322A', trim: '#F2C230', shirt: '#2A2D34', hat: '#C8322A', cap: '#F2C230', skin: '#C68C5D', flag: '#F2C230' },
    emblem: 'hydrant', hat: 'helmet', perk: { slosh: 0.96 }, unlocked: true },
  { id: 'lather-linen', name: 'Lather & Linen', div: 'traditional', archetype: 'Spa attendants', captain: 'Madame Vapeur',
    colors: { tub: '#F4EFE4', trim: '#C9A24A', shirt: '#F4EFE4', hat: '#F4EFE4', cap: '#8FC9D6', skin: '#E2B48C', flag: '#8FC9D6' },
    emblem: 'towel', hat: 'turban', perk: { rim: 1.03 }, unlocked: true },
  { id: 'velvet-mob', name: 'The Velvet Mob', div: 'traditional', archetype: '1930s costume team', captain: '"Lucky" Lou Lavender',
    colors: { tub: '#4B2E5E', trim: '#D9C27A', shirt: '#2B2B33', hat: '#3A3A44', cap: '#6E4A86', skin: '#D9A77E', flag: '#D9C27A' },
    emblem: 'card', hat: 'fedora', perk: { top: 1.02 }, unlocked: true },
  { id: 'gator-gang', name: 'Gator Gang', div: 'traditional', archetype: 'Alligator costumes', captain: 'Big Al Bayou',
    colors: { tub: '#3E7B3A', trim: '#E5D27A', shirt: '#4E8E45', hat: '#3E7B3A', cap: '#5FA052', skin: '#8D5A3B', flag: '#E5D27A' },
    emblem: 'gator', hat: 'snout', perk: { grip: 1.03 }, unlocked: false },
  { id: 'bubble-patrol', name: 'Bubble Patrol', div: 'modified', archetype: 'Police officers', captain: 'Sgt. Penny Suds',
    colors: { tub: '#2B4D9B', trim: '#E8ECF2', shirt: '#2B4D9B', hat: '#1D2C55', cap: '#E8ECF2', skin: '#7A4E36', flag: '#E8ECF2' },
    emblem: 'star', hat: 'peaked', perk: { push: 1.03 }, unlocked: true },
  { id: 'trail-shredders', name: 'Trail Shredders', div: 'modified', archetype: 'Mountain bikers', captain: 'Dusty Switchback',
    colors: { tub: '#F07F22', trim: '#2C3A2E', shirt: '#7DBB3C', hat: '#F07F22', cap: '#2C3A2E', skin: '#E0AA80', flag: '#7DBB3C' },
    emblem: 'wheel', hat: 'bike-helmet', perk: { grip: 1.03 }, unlocked: true },
  { id: 'out-of-towners', name: 'The Out-of-Towners', div: 'modified', archetype: 'Tie-dye visitors from Texas', captain: 'Starla Lonestar',
    colors: { tub: '#2FB3A6', trim: '#9B4DCA', shirt: '#E84E8A', hat: '#47C7B6', cap: '#F5D547', skin: '#B57C55', flag: '#F5D547' },
    emblem: 'antenna', hat: 'antenna', perk: { turn: 1.03 }, unlocked: true },
  { id: 'silks-stirrups', name: 'Silks & Stirrups', div: 'modified', archetype: 'Jockey silks', captain: 'Jo "Photo Finish" Furlong',
    colors: { tub: '#E8E8E8', trim: '#D6226E', shirt: '#D6226E', hat: '#2FA84F', cap: '#2FA84F', skin: '#E9BE98', flag: '#2FA84F' },
    emblem: 'horseshoe', hat: 'jockey', perk: { top: 1.02 }, unlocked: false },
  { id: 'steam-rangers', name: 'Steam Rangers', div: 'stock', archetype: 'Flat-hat rangers', captain: 'Ranger Hazel Fern',
    colors: { tub: '#6B7F4A', trim: '#C7A86A', shirt: '#8C979C', hat: '#C9A66B', cap: '#4E6136', skin: '#A86F4C', flag: '#C7A86A' },
    emblem: 'pine', hat: 'flat-brim', perk: { slosh: 0.96 }, unlocked: true },
  { id: 'suds-posse', name: 'Suds Posse', div: 'stock', archetype: "Sheriff's posse", captain: 'Deputy Dale Lather',
    colors: { tub: '#8A5A2E', trim: '#E8C547', shirt: '#E6DCC8', hat: '#5A3B22', cap: '#E8C547', skin: '#D6A27A', flag: '#E8C547' },
    emblem: 'badge', hat: 'cowboy', perk: { push: 1.03 }, unlocked: true },
  { id: 'flamingo-flock', name: 'Flamingo Flock', div: 'stock', archetype: 'Flamingos', captain: 'Flo Mingo',
    colors: { tub: '#F28DB2', trim: '#FFFFFF', shirt: '#F7B6CE', hat: '#F28DB2', cap: '#F7B6CE', skin: '#C9875F', flag: '#FFFFFF' },
    emblem: 'flamingo', hat: 'beak', perk: { turn: 1.03 }, unlocked: false },
  { id: 'tub-ninjas', name: 'Tub Ninjas', div: 'stock', archetype: 'Ninjas', captain: 'Shadow Scrub',
    colors: { tub: '#23232B', trim: '#D33A3A', shirt: '#2E2E38', hat: '#D33A3A', cap: '#2E2E38', skin: '#E0B48E', flag: '#D33A3A' },
    emblem: 'moon', hat: 'headband', perk: { rim: 1.03 }, unlocked: false },
];

export const TEAM_BY_ID = Object.fromEntries(TEAMS.map((t) => [t.id, t]));

// The four attendant roles from the real rules (rule 5), in pushing order around the tub.
export const ATTENDANTS = [
  { id: 'towel', name: 'Bath Towel Attendant', item: 'Bath towel' },
  { id: 'mat', name: 'Bath Mat Attendant', item: 'Bath mat' },
  { id: 'soap', name: 'Soap Attendant', item: 'Bar of soap' },
  { id: 'loofah', name: 'Loofah Mitt Attendant', item: 'Loofah mitt' },
];

// Combined stats for a team in a class. `mods` lets tests and the balance tool tweak values.
export function kartStats(teamId, classId, mods = {}) {
  const t = TEAM_BY_ID[teamId] || TEAMS[0], d = DIVISIONS[t.div], c = CLASSES[classId] || CLASSES.soak;
  const p = (k) => (d[k] ?? 1) * (t.perk[k] ?? 1) * (mods[k] ?? 1);
  return {
    team: t.id, div: d.id, tubKg: d.tubKg + 80, capGal: d.capGal,
    vTop: c.vTop * p('top'), push: p('push'), turn: p('turn'), grip: p('grip'), slosh: p('slosh'), rim: p('rim'),
  };
}
