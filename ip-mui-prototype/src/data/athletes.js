// Fixtures mirroring the testkitmanfc demo (U16 Test Kitman FC).
// Data is synthetic, taken from the surface audit captures.

export const squad = 'U16 (Test Kitman FC)'

export const squads = [
  'U16 (Test Kitman FC)',
  'U16 (Test Kitman Rovers)',
  'U15',
  'U21',
  'Testing',
]

export const positions = ['Right Wing Back', 'Centre Back', 'Goalkeeper', 'Defender', 'Other']

export const AVAILABILITY = {
  AVAILABLE: 'Available',
  UNAVAILABLE: 'Unavailable',
  MODIFIED: 'Injured/Ill',
}

export const athletes = [
  {
    id: 113734,
    name: 'Aplayer, Org',
    position: 'Right Wing Back',
    availability: AVAILABILITY.UNAVAILABLE,
    days: 0,
    issues: [
      { date: '15 Aug 2023', label: 'Gout in knee', status: 'Unavailable - time-loss' },
      { date: '4 Aug 2023', label: 'A/C joint arthritis [Center]', status: 'Unavailable - time-loss' },
    ],
    latestNote: { date: '7 Aug 2023', title: 'fghfg', body: 'hfghfghgfh' },
  },
  {
    id: 440559,
    name: 'Athlete, Dan',
    position: 'Right Wing Back',
    availability: AVAILABILITY.AVAILABLE,
    issues: [],
    latestNote: null,
  },
  {
    id: 114416,
    name: 'Athlete, Max',
    position: 'Centre Back',
    availability: AVAILABILITY.UNAVAILABLE,
    days: 1122,
    issues: [
      { date: '2 Aug 2023', label: 'Instability 1st MCP joint [Left]', status: 'Unavailable - time-loss' },
      { date: '20 Jul 2023', label: 'Supplemental pathology field?', status: 'Unavailable - time-loss' },
    ],
    latestNote: {
      date: '11 Jul 2024',
      title: 'This injury will be set to resolved for injury recurrence purposes.',
      body: 'This injury will be set to resolved for inj…',
    },
  },
  {
    id: 114397,
    name: 'Athlete 7, MK Test',
    position: 'Centre Back',
    availability: AVAILABILITY.MODIFIED,
    days: 947,
    issues: [{ date: '1 May 2023', label: 'Thyroid disorder', status: 'Available - not modified' }],
    latestNote: null,
  },
  {
    id: 162023,
    name: 'Diagnostic, Max',
    position: 'Centre Back',
    availability: AVAILABILITY.UNAVAILABLE,
    days: 947,
    issues: [{ date: '1 Aug 2023', label: 'Instability 1st CMC joint [Center]', status: 'Unavailable - time-loss' }],
    latestNote: { date: '24 Aug 2023', title: 'Initial Note', body: 'gfhfhgfhgh' },
  },
  {
    id: 427191,
    name: 'Kansara, Utsav',
    position: 'Right Wing Back',
    availability: AVAILABILITY.AVAILABLE,
    issues: [],
    latestNote: null,
  },
  {
    id: 431887,
    name: 'Athlete, Player',
    position: 'Centre Back',
    availability: AVAILABILITY.AVAILABLE,
    issues: [],
    latestNote: null,
  },
  {
    id: 440316,
    name: 'Claire-Marie',
    position: 'Right Wing Back',
    availability: AVAILABILITY.AVAILABLE,
    issues: [],
    latestNote: null,
  },
  {
    id: 453803,
    name: 'Prundel, Athlete Razvan',
    position: 'Centre Back',
    availability: AVAILABILITY.UNAVAILABLE,
    days: 52,
    issues: [{ date: '6 Jul 2026', label: '', status: 'Unavailable - time-loss', flag: 'Preliminary' }],
    latestNote: null,
  },
  {
    id: 454521,
    name: 'Robinson(Athlete), Lauren',
    position: 'Right Wing Back',
    availability: AVAILABILITY.AVAILABLE,
    issues: [],
    latestNote: null,
  },
  {
    id: 441234,
    name: 'A Jordan',
    position: 'Goalkeeper',
    availability: AVAILABILITY.AVAILABLE,
    issues: [],
    latestNote: null,
  },
  {
    id: 434584,
    name: 'Amariei, Sabin',
    position: 'Defender',
    availability: AVAILABILITY.AVAILABLE,
    issues: [],
    latestNote: null,
  },
]

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
