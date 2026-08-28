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
  squad: 'U16 (Test Kitman FC)', ...extra,
})

export const events = [
  mk('Breakfast - U16', EVENT_TYPES.EVENT, 0, '07:00', '08:00', { eventType: 'Breakfast', repeats: 'Every weekday' }),
  mk('crgtst', EVENT_TYPES.SESSION, 0, '10:00', '11:00', { sessionType: '1st Team Training' }),
  mk('NOT crgtst', EVENT_TYPES.SESSION, 0, '10:30', '11:30', { sessionType: 'Training Session', repeats: 'Daily' }),
  mk('Football Training', EVENT_TYPES.SESSION, 0, '14:30', '15:30', { sessionType: '1st Team Training' }),

  mk('Breakfast - U16', EVENT_TYPES.EVENT, 1, '08:00', '09:00', { eventType: 'Breakfast' }),
  mk('crgtst', EVENT_TYPES.SESSION, 1, '10:00', '11:00', { sessionType: '1st Team Training' }),
  mk('NOT crgtst', EVENT_TYPES.SESSION, 1, '10:30', '11:30', { sessionType: 'Training Session' }),
  mk('PM Training', EVENT_TYPES.SESSION, 1, '14:30', '15:30', { sessionType: '1st Team Training' }),
  mk('Nandos Dinner', EVENT_TYPES.EVENT, 1, '18:00', '19:00', { eventType: 'Other' }),

  mk('Training passing', EVENT_TYPES.SESSION, 2, '08:30', '09:30', { sessionType: 'Training passing' }),
  mk('Breakfast - U16', EVENT_TYPES.EVENT, 2, '07:00', '08:00', { eventType: 'Breakfast' }),
  mk('crgtst', EVENT_TYPES.SESSION, 2, '10:00', '11:00', { sessionType: '1st Team Training' }),
  mk('Android - repeatable', EVENT_TYPES.SESSION, 2, '15:35', '16:35', { sessionType: 'Gym', repeats: 'Daily' }),

  mk('Breakfast - U16', EVENT_TYPES.EVENT, 3, '09:00', '10:00', { eventType: 'Breakfast' }),
  mk('crgtst', EVENT_TYPES.SESSION, 3, '10:00', '11:00', { sessionType: '1st Team Training' }),
  mk('PM Training', EVENT_TYPES.SESSION, 3, '14:30', '15:30', { sessionType: '1st Team Training' }),
  mk('Android - repeatable', EVENT_TYPES.SESSION, 3, '15:35', '16:35', { sessionType: 'Gym' }),

  mk('Breakfast - U16', EVENT_TYPES.EVENT, 4, '07:00', '08:00', { eventType: 'Breakfast' }),
  mk('Football Training', EVENT_TYPES.SESSION, 4, '10:00', '11:00', { sessionType: '1st Team Training' }),
  mk('Testing Oz - repeat-session', EVENT_TYPES.SESSION, 4, '11:48', '12:48', { sessionType: 'Recovery' }),
  mk('PM Training', EVENT_TYPES.SESSION, 4, '14:30', '15:30', { sessionType: '1st Team Training' }),

  mk('Bloods Test', EVENT_TYPES.EVENT, 5, '14:04', '15:04', { eventType: 'Bloods Test' }),
  mk('U16 v U14 Test Kitman Wanderers', EVENT_TYPES.GAME, 5, '15:00', '16:30', {
    competition: 'EFL Youth Alliance', competitionType: 'TEST2', venue: 'Away',
    location: 'Arrowhead Stadium', opposition: 'U14 Test Kitman Wanderers', round: '3', format: '11 v 11',
  }),

  mk('Radiology', EVENT_TYPES.EVENT, 6, '09:45', '10:00', { eventType: 'Radiology' }),
  mk('Test TSO Event', EVENT_TYPES.EVENT, 6, '00:00', '22:45', { eventType: 'Other' }),
]

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const CALENDAR_VIEWS = ['Month', 'Week', 'Day', 'List']

// Gameday marker per weekday, matching the live calendar's GD +n run.
export const gameDayMarker = dayIndex => `GD +${dayIndex + 2}`

export const toMinutes = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m }

export const eventsForDay = (day, filters) =>
  events
    .filter(e => e.day === day)
    .filter(e => !filters || filters.types.includes(e.type))
    .sort((a, b) => toMinutes(a.start) - toMinutes(b.start))
