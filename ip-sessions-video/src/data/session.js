// Session page fixtures, read off /planning_hub/events/:id.
import { athletes, athletesInSquad } from './athletes'
import { PRINCIPLE_NAMES, principleFull, videoDrills, videoSession } from './video'

export const SESSION_TABS = [
  'Planning', 'Athlete selection', 'Staff selection', 'Development goals', 'Video', 'Collection', 'Imported data',
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
  { key: 'note', label: 'Note', editLabel: 'Note:', type: 'multiline' },
  { key: 'principles', label: 'Principles', panel: true },
]

// One principle library, shared with the clips and the development goals.
export const principleOptions = PRINCIPLE_NAMES.map(principleFull)

export const PRINCIPLE_CATEGORY = ['Delay, Deny, and Dictate', 'Progressing and Penetrating', 'Pressing', 'Direct Play', 'Attacking']
export const PRINCIPLE_PHASES = ['Transition', 'Defending', 'Attacking', 'Set Pieces']
export const PRINCIPLE_TYPE = ['Tactical', 'Technical', 'Physical']
export const DRILL_PRINCIPLES = PRINCIPLE_NAMES

/**
 * The session plan. These are the same five drills the Video tab groups its
 * clips under — one list, so what was planned and what was filmed cannot
 * disagree.
 */
export const sessionDrills = videoDrills.map(d => ({
  id: d.id,
  name: d.name,
  activity: d.activity,
  intensity: d.intensity || 'Moderate',
  duration: `${d.minutes} mins`,
  areaSize: d.areaSize,
  principles: d.principles.map(principleFull),
  athletes: '14/14',
  staff: '2/2',
}))

/** The squad selected for the session — the same people the clips are cut for. */
export const sessionAthletes = athletesInSquad(videoSession.squad).map((a, i) => ({
  ...a,
  participation: a.availability === 'Unavailable' ? 'No Participation' : 'Full',
  groupCalcs: a.availability !== 'Unavailable',
  selected: a.availability !== 'Unavailable',
  rpe: [6, 7, 5, 7, 6, 8, 7, 6, 0, 8, 7, 7, 8, 6][i] ?? 7,
  minutes: a.availability === 'Unavailable' ? 0 : 90,
}))

export const sessionStaff = [
  { id: 1, name: 'Tom Hargreaves', role: 'Head Coach', selected: true },
  { id: 2, name: 'Ciara Whelan', role: 'Performance Analyst', selected: true },
  { id: 3, name: 'Marie Nolan', role: 'Goalkeeping Coach', selected: false },
]

export const SQUAD_PICKER = [
  { squad: 'U16', athletes: athletesInSquad('U16').map(a => a.name) },
  { squad: 'U18', athletes: athletesInSquad('U18').map(a => a.name) },
  { squad: 'U21', athletes: athletesInSquad('U21').map(a => a.name) },
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
  ['Squad', session.squad || videoSession.squad],
  ['Date', videoSession.date],
  ['Game day', videoSession.gameDay],
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
  { id: 1, name: 'Gameday -3 training', when: 'Mon, 21 Sep 2026 | 14:00' },
  { id: 2, name: 'Recovery — pool and mobility', when: 'Mon, 21 Sep 2026 | 10:00' },
  { id: 3, name: 'Gym — lower body strength', when: 'Mon, 21 Sep 2026 | 10:30' },
  { id: 4, name: 'Breakfast', when: 'Mon, 21 Sep 2026 | 07:00' },
  { id: 5, name: 'Team meeting — opposition analysis', when: 'Tue, 22 Sep 2026 | 16:00' },
  { id: 6, name: 'Gameday -2 training', when: 'Tue, 22 Sep 2026 | 10:00' },
  { id: 7, name: 'Set piece walkthrough', when: 'Tue, 22 Sep 2026 | 14:30' },
  { id: 8, name: 'Gameday -1 activation', when: 'Wed, 23 Sep 2026 | 10:00' },
  { id: 9, name: 'Travel to Northgate', when: 'Wed, 23 Sep 2026 | 15:35' },
  { id: 10, name: 'U16 v Riverside Athletic', when: 'Sat, 26 Sep 2026 | 15:00' },
  { id: 11, name: 'Gameday +1 recovery', when: 'Thu, 24 Sep 2026 | 10:00' },
  { id: 12, name: 'Individual finishing block', when: 'Thu, 24 Sep 2026 | 14:30' },
  { id: 13, name: 'Video session — development goals', when: 'Fri, 25 Sep 2026 | 14:30' },
]

/** Labels a drill can carry, offered in the Drill detail panel. */
export const DRILL_LABELS = ['Dribbling', 'Passing', 'Finishing', 'Pressing', 'Possession', 'Transition']
