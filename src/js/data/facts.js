// Facts shown to players (course cards, the READY countdown, the pause menu and the results; the Trophy Room has none). Every one comes from research/town-content.md
// with a source key from its §9 table; tools/check-facts.mjs checks every key exists there.
export const FACTS = {
  event: [
    { t: 'The World Championship Running of the Tubs has raced down Central Avenue in front of Bathhouse Row since 2006.', src: 'rott-about' },
    { t: 'Real tub teams have five people: a captain who rides and steers, and four bath attendants who push.', src: 'rules-2026', rule: 5 },
    { t: 'A real tub must cross the finish line with at least 10 gallons of water still in it.', src: 'rules-2026', rule: 9 },
    { t: 'Drop your soap, mat, towel or loofah mitt in the real race and the whole team must stop and circle the tub.', src: 'rules-2026', rule: 7 },
    { t: 'Every real tub must carry at least one rubber duck at all times.', src: 'rules-2026', rule: 19 },
    { t: 'The real rules award extra points for bribing the judges.', src: 'rules-2026', rule: 17 },
    { t: 'Spectators line the street with water blasters, and downtown businesses set out refill buckets.', src: 'rott-faq' },
    { t: 'The race is a tribute to the city\'s old motto, "We Bathe the World."', src: 'rott-about' },
    { t: 'NPS says the bathing industry led to Hot Springs becoming known as the "Great American Spa".', src: 'nps-history' },
  ],
  'bathhouse-row': [
    { t: 'Bathhouse Row runs north to south: Superior, Hale, Maurice, Fordyce, Quapaw, Ozark, Buckstaff and Lamar.', src: 'corpus-row' },
    { t: 'The Grand Promenade behind the Row is a brick walk about half a mile long.', src: 'corpus-row' },
    { t: 'Hot springs water comes out of the ground at about 143°F.', src: 'nps-display-spring' },
    { t: 'A new jug fountain was installed on the sidewalk in front of the Administration building in 1966.', src: 'wiki-row' },
    { t: 'The park provides spring water free of charge at all of its jug fountains.', src: 'nps-water' },
  ],
  'park-avenue': [
    { t: 'The Vapors, a club that opened in 1960, stood at 315 Park Avenue.', src: 'vapors-eoa' },
    { t: 'Tony Bennett wrote that he first sang "I Left My Heart in San Francisco" at the Vapors, during a rehearsal for a later Fairmont Hotel appearance.', src: 'vapors-eoa' },
  ],
  'whittington-valley': [
    { t: 'Whittington Avenue runs about 1.1 miles west from the Arlington to the Alligator Farm.', src: 'corpus-row' },
  ],
  'bridge-street': [
    { t: 'Bridge Street is famously billed as one of the shortest streets in the country (sources disagree on its length).', src: 'corpus-row' },
    { t: 'Hot Springs\' St. Patrick\'s Day parade has run on Bridge Street since 2004.', src: 'corpus-culture' },
  ],
  'hs-mountain': [
    { t: 'Hot Springs Mountain Drive began as a carriage road in the 1880s.', src: 'nps-overlooks' },
    { t: 'The Hot Springs Mountain Tower rises 216 feet; its deck is 1,256 feet above sea level.', src: 'nps-overlooks' },
    { t: 'The Pagoda overlook was designed by J. G. Horn in 1911.', src: 'nps-overlooks' },
  ],
  'goat-rock-gulpha': [
    { t: 'Goat Rock looks out over the Zigzag Mountains, the recharge zone for the hot springs.', src: 'nps-overlooks' },
    { t: 'Gulpha Gorge Campground has 40 sites along Gulpha Creek.', src: 'nps-overlooks' },
  ],
  'west-mountain': [
    { t: 'West Mountain\'s picnic overlook shelter was built in 1924, one of the oldest still in use in the park.', src: 'nps-overlooks' },
    { t: 'From West Mountain\'s summit the view looks south to the Trap Mountains and Lake Hamilton.', src: 'nps-overlooks' },
    { t: 'Carpenter Dam, a concrete gravity dam, was completed in 1931, and Lake Hamilton was created in 1932.', src: 'wiki-lakeham' },
  ],
  'sunset-ridge': [
    { t: 'The original wooden tower on Hot Springs Mountain went up in 1877; the steel tower with an elevator dates from 1982.', src: 'nps-overlooks' },
    { t: 'Music Mountain, at 1,405 feet, is the highest point in Hot Springs National Park.', src: 'nps-sunset' },
  ],
  'hill-wheatley': [
    { t: 'Real tubs are judged the night before the race at Hill Wheatley Plaza.', src: 'rules-2026', rule: 20 },
    { t: 'Hill Wheatley Plaza has a thermal-water jug fountain.', src: 'hsguides' },
  ],
};

// S4-03: what the corner caption calls a landmark when the player drives past it (the ids in data/tracks/*.json). Names only,
// each one already in research/town-content.md or in a fact above.
export const LANDMARK_NAMES = {
  superior: 'Superior · Bathhouse Row', hale: 'Hale · Bathhouse Row', maurice: 'Maurice · Bathhouse Row', fordyce: 'Fordyce · Bathhouse Row',
  quapaw: 'Quapaw · Bathhouse Row', ozark: 'Ozark · Bathhouse Row', buckstaff: 'Buckstaff · Bathhouse Row', lamar: 'Lamar · Bathhouse Row',
  admin: 'Administration Building', arlington: 'The Arlington', 'army-navy': 'Former Army-Navy Hospital', vapors: 'The Vapors',
  tower: 'Hot Springs Mountain Tower', pagoda: 'The Pagoda overlook', 'goat-rock': 'Goat Rock', shelter: 'Picnic overlook shelter',
};

// S2-03: the Water Fight's goal, shown where a course's fact would be (the countdown and the pause menu) and in How to Play.
export const BATTLE_GOAL = { t: 'Last tub with water wins. Drain rivals with items, and refill at the fountain.' };

export function factFor(id, n = 0) {
  const list = FACTS[id] || FACTS.event;
  return list[n % list.length];
}

// S2-25: the facts the player meets in a race and its menus. A course's own facts come first, then the event's, and
// n counts up across the session, so every sourced fact turns up and none repeats until the whole list has been seen.
export function factAt(id, n = 0) {
  const list = [...(FACTS[id] || []), ...FACTS.event];
  return list[n % list.length];
}
