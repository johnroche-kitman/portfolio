import colors from '../theme/tokens'

export const EVENT_TYPES = { SESSION: 'Session', GAME: 'Game', EVENT: 'Event' }

export const TYPE_COLOR = {
  [EVENT_TYPES.SESSION]: colors.red_100,
  [EVENT_TYPES.GAME]: colors.blue_100,
  [EVENT_TYPES.EVENT]: colors.green_100,
}

/* ---------------------------------------------------------------- options
   Field lists read off the live New Session / Game / Event panels.
   Where the live control is a bespoke async select whose options could not be
   enumerated from the DOM, representative values are used and flagged below. */

export const SESSION_TYPES = ['1st Team Training', 'Training passing', 'Recovery', 'Gym', 'Rehab', 'Individual']
export const EVENT_TYPE_OPTIONS = ['Breakfast', 'Bloods Test', 'Radiology', 'Team meeting', 'Travel', 'Medical', 'Other']
export const COMPETITIONS = ['Premier League 2', 'EFL Youth Alliance', 'Professional Development League']
export const COMPETITION_TYPES = ['TEST2', 'League', 'Cup', 'Friendly']
export const VENUES = ['Home', 'Away', 'Neutral']
export const FORMATS = ['11 v 11', '9 v 9', '7 v 7', '5 v 5']
export const FIXTURE_RATINGS = ['1 - Low', '2', '3 - Medium', '4', '5 - High']
export const PERIOD_MODES = ['Split Evenly', 'Custom']
export const LOCATIONS = ['Arrowhead Stadium', 'Emirates Stadium', 'Training Ground', 'Performance Centre']
export const TIMEZONES = ['Europe/Dublin', 'Europe/London', 'UTC', 'America/New_York']
export const LABELS = ['Pre-season', 'High intensity', 'Rehab group', 'Academy', 'Trial']

// Surface / conditions — representative values; the live options are async-loaded.
export const SURFACE_TYPES = ['Grass', '3G', '4G', 'Hybrid', 'Indoor', 'Astroturf']
export const SURFACE_QUALITIES = ['Excellent', 'Good', 'Average', 'Poor']
export const WEATHER = ['Clear', 'Cloudy', 'Light rain', 'Heavy rain', 'Windy', 'Snow']

// Gameday markers, as rendered top-right of each month cell (GD +2 … GD +10).
export const GAME_DAY_OPTIONS = [
  'GD -5', 'GD -4', 'GD -3', 'GD -2', 'GD -1', 'GD', 'GD +1', 'GD +2', 'GD +3',
  'GD +4', 'GD +5', 'GD +6', 'GD +7', 'GD +8', 'GD +9', 'GD +10',
]

/* ------------------------------------------------------------- gameweeks
   The pale yellow bands that run across several days at the top of a week.
   Dates are August 2026 day numbers; values outside 1–31 spill into the
   neighbouring month, exactly as the live grid draws them. */
export const GAMEWEEKS = [
  { id: 'IS126', opponent: 'Test Team', venue: 'Neutral', from: -2, to: 2 },
  { id: 'IS127', opponent: 'Test Game', venue: 'Home', from: 6, to: 7 },
  { id: 'IS128', opponent: 'Test Team', venue: 'Neutral', from: 8, to: 10 },
  { id: 'IS129', opponent: 'U15', venue: 'Away', from: 13, to: 14 },
  { id: 'IS130', opponent: 'Test Kitman Rovers', venue: 'Home', from: 18, to: 19 },
  { id: 'IS131', opponent: 'Test Team', venue: 'Neutral', from: 22, to: 23 },
  { id: 'IS132', opponent: 'U14', venue: 'Away', from: 26, to: 30 },
  { id: 'IS133', opponent: 'Test Game', venue: 'Home', from: 31, to: 33 },
]

export const gameweekLabel = gw => `GW ${gw.id} - ${gw.opponent} (${gw.venue})`

/** Gameweeks overlapping [from, to], clipped to that span. */
export const gameweeksIn = (from, to) =>
  GAMEWEEKS
    .filter(gw => gw.to >= from && gw.from <= to)
    .map(gw => ({ ...gw, clipFrom: Math.max(gw.from, from), clipTo: Math.min(gw.to, to) }))

// Game dates in August 2026, which is what the GD +/- counts run off.
const GAME_DATES = [2, 7, 14, 19, 23, 29]

export const REPEAT_OPTIONS = [
  "Doesn't repeat", 'Daily', 'Weekly on Friday', 'Monthly on the last Friday',
  'Annually on August 28', 'Every weekday', 'Custom',
]

// Shown when a repeat is set — which fields carry to every repeated occurrence.
// Athletes and Surface Type are checked and locked in the live app.
export const REPEAT_COPY_FIELDS = [
  { label: 'Athletes', locked: true },
  { label: 'Description' },
  { label: 'Location' },
  { label: 'Session Objectives' },
  { label: 'Session Plan' },
  { label: 'Staff' },
  { label: 'Surface Type', locked: true },
]

export const STAFF_VISIBILITY = ['All Staff', 'Only Selected Staff', 'Staff and Additional viewers']
export const STAFF = ['John Roche Test', 'ST Test', 'Pablo de Miguel', 'MKing Staff', 'Adam Conway']

/* ----------------------------------------------------------------- events */

let nextId = 5650000
const mk = (title, type, day, start, end, extra = {}) => ({
  id: nextId++, title, type, day, start, end,
  // Sessions and games carry a completion state; plain events do not.
  squad: 'U21 (Test Kitman FC)', complete: false, ...extra,
})

export const events = [
  mk('Breakfast', EVENT_TYPES.EVENT, 0, '07:00', '08:00', { eventType: 'Breakfast', repeats: 'Every weekday' }),
  mk('Matchday -3 training', EVENT_TYPES.SESSION, 0, '14:00', '15:30', { sessionType: '1st Team Training' }),
  mk('Recovery — pool and mobility', EVENT_TYPES.SESSION, 0, '10:00', '11:00', { sessionType: 'Recovery', complete: true }),
  mk('Gym — lower body strength', EVENT_TYPES.SESSION, 0, '10:30', '11:30', { sessionType: 'Gym', repeats: 'Daily' }),

  mk('Breakfast', EVENT_TYPES.EVENT, 1, '08:00', '09:00', { eventType: 'Breakfast' }),
  mk('Matchday -2 training', EVENT_TYPES.SESSION, 1, '10:00', '11:30', { sessionType: '1st Team Training' }),
  mk('Set piece walkthrough', EVENT_TYPES.SESSION, 1, '14:30', '15:15', { sessionType: '1st Team Training' }),
  mk('Team meeting — opposition analysis', EVENT_TYPES.EVENT, 1, '16:00', '16:45', { eventType: 'Team meeting' }),

  mk('Breakfast', EVENT_TYPES.EVENT, 2, '07:00', '08:00', { eventType: 'Breakfast' }),
  mk('Matchday -1 activation', EVENT_TYPES.SESSION, 2, '10:00', '11:00', { sessionType: '1st Team Training', complete: true }),
  mk('Rehab group', EVENT_TYPES.SESSION, 2, '11:30', '12:30', { sessionType: 'Rehab', repeats: 'Daily' }),
  mk('Travel to Northgate', EVENT_TYPES.EVENT, 2, '15:35', '18:35', { eventType: 'Travel' }),

  mk('Breakfast', EVENT_TYPES.EVENT, 3, '09:00', '10:00', { eventType: 'Breakfast' }),
  mk('Matchday +1 recovery', EVENT_TYPES.SESSION, 3, '10:00', '11:00', { sessionType: 'Recovery' }),
  mk('Individual finishing block', EVENT_TYPES.SESSION, 3, '14:30', '15:30', { sessionType: 'Individual', complete: true }),
  mk('Gym — upper body', EVENT_TYPES.SESSION, 3, '15:35', '16:35', { sessionType: 'Gym' }),

  mk('Breakfast', EVENT_TYPES.EVENT, 4, '07:00', '08:00', { eventType: 'Breakfast' }),
  mk('Possession and pressing', EVENT_TYPES.SESSION, 4, '10:00', '11:30', { sessionType: '1st Team Training' }),
  mk('Rehab group', EVENT_TYPES.SESSION, 4, '11:48', '12:48', { sessionType: 'Rehab' }),
  mk('Video session — development goals', EVENT_TYPES.SESSION, 4, '14:30', '15:15', { sessionType: 'Individual' }),

  mk('Bloods Test', EVENT_TYPES.EVENT, 5, '14:04', '15:04', { eventType: 'Bloods Test' }),
  mk('U21 v Riverside Athletic', EVENT_TYPES.GAME, 5, '15:00', '16:30', {
    competition: 'Premier League 2', competitionType: 'League', venue: 'Home',
    location: 'Performance Centre', opposition: 'Riverside Athletic', round: '5', format: '11 v 11',
  }),

  mk('Radiology', EVENT_TYPES.EVENT, 6, '09:45', '10:00', { eventType: 'Radiology' }),
  mk('Recovery — day off check in', EVENT_TYPES.EVENT, 6, '00:00', '22:45', { eventType: 'Other' }),
]

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const CALENDAR_VIEWS = ['Month', 'Week', 'Day', 'List']

/**
 * Gameday marker for a date, in the live app's two-sided form: days since the
 * last game and days until the next one, e.g. "GD +3/-10". On a game day it
 * collapses to "GD 0", and at either end of the run only one side is shown.
 */
export const gameDayMarker = date => {
  if (GAME_DATES.includes(date)) return 'GD 0'
  const prev = GAME_DATES.filter(d => d < date).pop()
  const next = GAME_DATES.find(d => d > date)
  const since = prev === undefined ? null : `+${date - prev}`
  const until = next === undefined ? null : `-${next - date}`
  return `GD ${[since, until].filter(Boolean).join('/')}`
}

export const toMinutes = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m }

export const eventsForDay = (day, filters) =>
  events
    .filter(e => e.day === day)
    .filter(e => !filters || filters.types.includes(e.type))
    .sort((a, b) => toMinutes(a.start) - toMinutes(b.start))

export const eventById = id => events.find(e => String(e.id) === String(id))

/**
 * Prototype-local mutation so the Complete toggle on a session is reflected by
 * the check mark the calendar draws on that event in every view.
 */
export const setEventComplete = (id, complete) => {
  const ev = eventById(id)
  if (ev) ev.complete = complete
  return ev
}
