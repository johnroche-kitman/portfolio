// Session page fixtures, read off /planning_hub/events/:id.

export const SESSION_TABS = [
  'Planning', 'Athlete selection', 'Staff selection', 'Development goals', 'Collection', 'Imported data',
]

export const PARTICIPATION_LEVELS = ['Full', 'Modified', 'Partial', 'No Participation']
export const INTENSITIES = ['Light', 'Moderate', 'High']

export const DRILL_ACTIVITIES = [
  'Cooldown (Injury Prevention)', 'Transition (Football Based)', 'Warmup (Conditioning)',
  'Attack (Football Based)', 'Defence (Football Based)', 'Games (Football Based)',
]

export const drillLibrary = [
  { id: 1, name: 'New drill', activity: 'Cooldown (Injury Prevention)', favourite: false },
  { id: 2, name: 'New drill to add to library', activity: 'Cooldown (Injury Prevention)', favourite: false },
  { id: 3, name: 'Test', activity: 'Cooldown (Injury Prevention)', favourite: false },
  { id: 4, name: 'Test drill', activity: 'Cooldown (Injury Prevention)', favourite: true },
  { id: 5, name: '1-2-3', activity: 'Transition (Football Based)', favourite: false },
  { id: 6, name: 'Testing 3 - Pablo', activity: 'Transition (Football Based)', favourite: false },
  { id: 7, name: 'Free Play', activity: 'Warmup (Conditioning)', favourite: true },
  { id: 8, name: 'Some new drill', activity: 'Warmup (Conditioning)', favourite: false },
  { id: 9, name: 'Testing Sinead', activity: 'Warmup (Conditioning)', favourite: false },
]

export const DRILL_CREATORS = ['John Roche Test', 'Pablo de Miguel', 'ST Test']

/** Short chip label shown on a planned drill, e.g. "Cooldown (Injury Prevention)" -> "Cooldown". */
export const shortActivity = a => a.replace(/\s*\(.*\)$/, '')

/** The fields a planned drill can have added to it, in the live page's order. */
export const DRILL_FIELDS = [
  { key: 'duration', label: 'Duration', editLabel: 'Duration (mins):', type: 'number' },
  { key: 'areaSize', label: 'Area size', editLabel: 'Area size:', type: 'text' },
  { key: 'note', label: 'Note', editLabel: 'Note:', type: 'multiline' },
  { key: 'principles', label: 'Principles', panel: true },
]

export const principleOptions = [
  'Breaking Lines (Progressing and Penetrating, Defending, Tactical)',
  'Forward Passing (Progressing and Penetrating, Attacking, Technical)',
  'Pressing (Direct Play, Attacking, Tactical)',
  'Screening (Delay, Deny, and Dictate, Transition, Tactical)',
  'Wide Play and Crossing (Attacking, Defending, Tactical)',
]

export const PRINCIPLE_CATEGORY = ['Delay, Deny, and Dictate', 'Progressing and Penetrating', 'Pressing', 'Direct Play', 'Attacking']
export const PRINCIPLE_PHASES = ['Transition', 'Defending', 'Attacking', 'Set Pieces']
export const PRINCIPLE_TYPE = ['Tactical', 'Technical', 'Physical']
export const DRILL_PRINCIPLES = [
  'Ball Retention', 'Breaking Lines', 'Creating Space', 'Forward Passing', 'Pressing',
  'Rotations', 'Screening', 'Switching Play', 'Wide Play and Crossing',
]

/** The live session has nothing planned, so the plan starts empty and the
    Add drill panel is what fills it. */
export const sessionDrills = []

export const sessionAthletes = [
  { id: 1, name: 'Bennett, Craig', position: 'Goalkeeper', availability: 'Available',
    participation: 'Full', groupCalcs: false, selected: false, rpe: 6, minutes: 60 },
  { id: 2, name: 'crgtst', position: 'Goalkeeper', availability: 'Available',
    participation: 'Full', groupCalcs: true, selected: true, rpe: 7, minutes: 60 },
]

export const sessionStaff = [
  { id: 1, name: 'Craig Bennett', role: 'Coach', selected: false },
  { id: 2, name: 'Craig Bennett', role: 'Analyst', selected: false },
]

export const SQUAD_PICKER = [
  { squad: 'U16 (Test Kitman FC)', athletes: ['Bennett, Craig', 'crgtst', 'Aplayer, Org', 'Athlete, Dan'] },
  { squad: 'U15', athletes: ['Byrne, Sean', 'Sabin'] },
  { squad: 'U21', athletes: ['Doyle, Mark', 'Athlete, Max'] },
]

/**
 * Collections come in two shapes: a form (questions to answer) and a grid
 * (values per athlete). The shape drives which MUI component renders it.
 */
export const collections = [
  {
    id: 'session-evaluation', name: 'Session evaluation', shape: 'form',
    questions: [
      { label: 'What did you do well in this session?', type: 'richtext' },
      { label: 'What would you do differently next time?', type: 'richtext' },
    ],
  },
  {
    id: 'session-objectives', name: 'Session objectives', shape: 'form',
    questions: [
      { label: 'Primary objective', type: 'text' },
      { label: 'Principles worked on', type: 'multiselect', options: DRILL_PRINCIPLES },
      { label: 'Objective met?', type: 'radio', options: ['Yes', 'Partially', 'No'] },
      { label: 'Notes', type: 'richtext' },
    ],
  },
  {
    id: 'workload', name: 'Workload', shape: 'grid',
    columns: [
      { field: 'participation', headerName: 'Participation level', type: 'singleSelect',
        valueOptions: PARTICIPATION_LEVELS, editable: true, width: 190 },
      { field: 'rpe', headerName: 'RPE', type: 'number', editable: true, width: 120 },
      { field: 'minutes', headerName: 'Minutes', type: 'number', editable: true, width: 140 },
      { field: 'load', headerName: 'RPE x Duration', width: 170,
        valueGetter: (v, row) => (row.rpe && row.minutes ? row.rpe * row.minutes : '') },
    ],
  },
  {
    id: 'test-template', name: 'Test Template', shape: 'grid',
    columns: [
      { field: 'participation', headerName: 'Participation level', type: 'singleSelect',
        valueOptions: PARTICIPATION_LEVELS, editable: true, width: 190 },
      { field: 'score', headerName: 'Score', type: 'number', editable: true, width: 130 },
      { field: 'attempt', headerName: 'Attempt', type: 'singleSelect',
        valueOptions: ['1', '2', '3'], editable: true, width: 130 },
    ],
  },
]

export const sessionMeta = session => [
  ['Squad', session.squad],
  ['Date', 'June 29, 2026 9:00 AM, (10:00 AM Europe/Dublin) (60 min)'],
  ['Type', session.sessionType || '1st Team Training'],
  ['Game day', '+3, -10'],
  ['Surface type', 'Grass'],
]

/* --------------------------------------------------------- session importer */
export const IMPORT_STEPS = [
  { label: 'Select import type', hint: 'CSV or device' },
  { label: 'Import data', hint: 'Select period or file' },
  { label: 'Preview import', hint: 'Review any errors' },
]

export const IMPORT_SOURCES = [
  { id: 'csv', label: 'CSV file' },
  { id: 'oura', label: 'ŌURA' },
]

export const IMPORT_VENDORS = [
  'Catapult', 'Kitman custom data', 'Oura Ring', 'Oura Ring - Activity', 'Oura Ring - Sleep', 'STATSports',
]

/* ------------------------------------------------------------- event list */
export const EVENT_LIST_TYPES = ['Games', 'Sessions', 'Event']

export const eventListItems = [
  { id: 1, name: 'Switch the Play Foundation: Brand of You', when: 'Tue, 14 Jul 2026 | 08:30' },
  { id: 2, name: 'Sporting Chance: Brain Health Education', when: 'Tue, 14 Jul 2026 | 08:08' },
  { id: 3, name: 'Test Team (Away), Premier League 2', when: 'Tue, 14 Jul 2026 | 08:08' },
  { id: 4, name: 'Breakfast - U16', when: 'Tue, 14 Jul 2026 | 07:00' },
  { id: 5, name: 'Other External Provider: Physical Health', when: 'Mon, 13 Jul 2026 | 16:28' },
  { id: 6, name: '(Away), Professional Development League', when: 'Mon, 13 Jul 2026 | 16:00' },
  { id: 7, name: 'Android - repeatable', when: 'Mon, 13 Jul 2026 | 15:35' },
  { id: 8, name: 'Bloods Test', when: 'Mon, 13 Jul 2026 | 14:04' },
  { id: 9, name: 'Training passing', when: 'Mon, 13 Jul 2026 | 12:53' },
  { id: 10, name: 'Test Team (Away), Premier League 2', when: 'Mon, 13 Jul 2026 | 12:52' },
  { id: 11, name: 'NOT crgtst', when: 'Mon, 13 Jul 2026 | 10:30' },
  { id: 12, name: 'crgtst', when: 'Mon, 13 Jul 2026 | 10:00' },
  { id: 13, name: 'Test Team (Neutral), Premier League 2', when: 'Mon, 13 Jul 2026 | 09:00' },
]
