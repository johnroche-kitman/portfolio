// Squad fixtures for Test Kitman FC — U21, U18 and U16.
// Data is synthetic. Names are invented but realistic, so the prototype reads
// as a football club rather than a test environment.

export const squad = 'U16 (Test Kitman FC)'

export const squads = [
  'U16 (Test Kitman FC)',
  'U18 (Test Kitman FC)',
  'U21 (Test Kitman FC)',
  'First team (Test Kitman FC)',
  'Testing',
]

export const positions = [
  'Goalkeeper', 'Right Back', 'Centre Back', 'Left Back',
  'Defensive Midfield', 'Centre Midfield', 'Attacking Midfield',
  'Right Wing', 'Left Wing', 'Striker',
]

export const AVAILABILITY = {
  AVAILABLE: 'Available',
  UNAVAILABLE: 'Unavailable',
  MODIFIED: 'Injured/Ill',
}

/**
 * Names are stored the way iP renders them everywhere — "Surname, Firstname" —
 * so a list never has to reformat. `first` is kept for the places that read
 * naturally in prose, such as a coach's note.
 */
const U16 = [
  {
    id: 113734, name: 'Reeves, Callum', first: 'Callum', position: 'Goalkeeper',
    availability: AVAILABILITY.AVAILABLE, issues: [], latestNote: null,
  },
  {
    id: 440559, name: 'Ellery, Toby', first: 'Toby', position: 'Right Back',
    availability: AVAILABILITY.AVAILABLE, issues: [], latestNote: null,
  },
  {
    id: 114416, name: 'Kavanagh, Dara', first: 'Dara', position: 'Centre Back',
    availability: AVAILABILITY.MODIFIED, days: 6,
    issues: [{ date: '28 Aug 2026', label: 'Adductor strain [Left]', status: 'Available - modified' }],
    latestNote: {
      date: '30 Aug 2026', title: 'Loading progression',
      body: 'Full running, no change of direction above 80% until Friday.',
    },
  },
  {
    id: 114397, name: 'Ihenacho, Marcus', first: 'Marcus', position: 'Centre Back',
    availability: AVAILABILITY.AVAILABLE, issues: [], latestNote: null,
  },
  {
    id: 162023, name: 'Fitzgerald, Leo', first: 'Leo', position: 'Left Back',
    availability: AVAILABILITY.AVAILABLE, issues: [], latestNote: null,
  },
  {
    id: 427191, name: 'Castellanos, Ruben', first: 'Ruben', position: 'Right Back',
    availability: AVAILABILITY.AVAILABLE, issues: [], latestNote: null,
  },
  {
    id: 431887, name: 'Diallo, Idrissa', first: 'Idrissa', position: 'Centre Midfield',
    availability: AVAILABILITY.AVAILABLE, issues: [], latestNote: null,
  },
  {
    id: 440316, name: 'Bramwell, Ollie', first: 'Ollie', position: 'Centre Midfield',
    availability: AVAILABILITY.AVAILABLE, issues: [], latestNote: null,
  },
  {
    id: 453803, name: 'Docherty, Ewan', first: 'Ewan', position: 'Defensive Midfield',
    availability: AVAILABILITY.UNAVAILABLE, days: 21,
    issues: [{ date: '13 Aug 2026', label: 'Lateral ankle sprain [Right]', status: 'Unavailable - time-loss' }],
    latestNote: null,
  },
  {
    id: 454521, name: 'Ferrante, Nico', first: 'Nico', position: 'Attacking Midfield',
    availability: AVAILABILITY.AVAILABLE, issues: [], latestNote: null,
  },
  {
    id: 441234, name: 'Adeyemi, Jonah', first: 'Jonah', position: 'Right Wing',
    availability: AVAILABILITY.AVAILABLE, issues: [], latestNote: null,
  },
  {
    id: 434584, name: 'Okonkwo, Sam', first: 'Sam', position: 'Left Wing',
    availability: AVAILABILITY.AVAILABLE, issues: [], latestNote: null,
  },
  {
    id: 448120, name: 'McAllister, Finn', first: 'Finn', position: 'Striker',
    availability: AVAILABILITY.AVAILABLE, issues: [], latestNote: null,
  },
  {
    id: 449902, name: 'Yamamoto, Kai', first: 'Kai', position: 'Striker',
    availability: AVAILABILITY.AVAILABLE, issues: [], latestNote: null,
  },
]

const U18 = [
  { id: 460101, name: 'Hallett, Ryan', first: 'Ryan', position: 'Goalkeeper' },
  { id: 460102, name: 'Novak, Petar', first: 'Petar', position: 'Centre Back' },
  { id: 460103, name: 'Ackerman, Zach', first: 'Zach', position: 'Left Back' },
  { id: 460104, name: 'Oyelaran, Tunde', first: 'Tunde', position: 'Defensive Midfield' },
  { id: 460105, name: 'Beckett, Alfie', first: 'Alfie', position: 'Attacking Midfield' },
  { id: 460106, name: 'Rousseau, Émile', first: 'Émile', position: 'Right Wing' },
  { id: 460107, name: 'Whitlock, Josh', first: 'Josh', position: 'Striker' },
]

const U21 = [
  { id: 470201, name: 'Byrne, Sean', first: 'Sean', position: 'Goalkeeper' },
  { id: 470202, name: 'Doyle, Mark', first: 'Mark', position: 'Centre Back' },
  { id: 470203, name: 'Farrell, Cian', first: 'Cian', position: 'Centre Midfield' },
  { id: 470204, name: 'Mensah, Kofi', first: 'Kofi', position: 'Left Wing' },
  { id: 470205, name: 'Traoré, Amadou', first: 'Amadou', position: 'Striker' },
]

/**
 * One roster. `squad` is what the IDP list filters on; the younger squads carry
 * the same shape but no medical history, which is why they are written short.
 */
const withSquad = (list, name) => list.map(a => ({
  availability: AVAILABILITY.AVAILABLE, issues: [], latestNote: null, ...a, squad: name,
}))

/**
 * Twenty headshots for twenty-six athletes. The index runs across the whole
 * roster rather than restarting per squad, so no two people in the same squad
 * list ever share a face — only the all-squads view can repeat one, and only
 * near the bottom of it.
 */
const PHOTOS = 20
const photoFor = i => `players/athlete-${String((i % PHOTOS) + 1).padStart(2, '0')}.jpg`

export const athletes = [
  ...withSquad(U16, squads[0]),
  ...withSquad(U18, squads[1]),
  ...withSquad(U21, squads[2]),
].map((a, i) => ({ ...a, photo: photoFor(i) }))

/**
 * The headshot for an athlete, resolved against the app's base path. Undefined
 * for anyone without one, which is what makes an Avatar fall back to initials.
 */
export const photoUrl = a => (a?.photo ? `${import.meta.env.BASE_URL}${a.photo}` : undefined)

/** Initials, for the fallback and for the places that draw their own avatar. */
export const initialsOf = name => String(name)
  .replace(/\(.*?\)/g, '')
  .split(/[\s,]+/)
  .filter(Boolean)
  .slice(0, 2)
  .map(w => w[0])
  .join('')
  .toUpperCase()

/** Lookup by name — the injury record carries a name, not an id. */
export const athleteByName = name => athletes.find(a => a.name === name)

/** The athletes in one squad, or all of them when no squad is named. */
export const athletesInSquad = name => (name ? athletes.filter(a => a.squad === name) : athletes)

/** Lookup by id — every page that resolves a clip or a goal to a person uses this. */
export const athleteById = id => athletes.find(a => a.id === Number(id))

export const MEDICAL_TABS = [
  'Team',
  'Daily Status Report',
  'Notes',
  'Modifications',
  'Forms',
  'Treatments',
  'Diagnostics',
  'Medical Flags',
  'Past Athletes',
  'Inactive Athletes',
  'Documents',
]

// The Add menu on Medical — eleven creation panels.
export const MEDICAL_ADD_ITEMS = [
  'Injury/ Illness',
  'Note',
  'Modification',
  'Diagnostic',
  'File',
  'Treatment',
  'Allergy',
  'Chronic condition',
  'Medical Alert',
  'Vaccination',
  'TUE',
]
