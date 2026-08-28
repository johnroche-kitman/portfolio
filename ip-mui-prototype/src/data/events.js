import colors from '../theme/tokens'

export const EVENT_TYPES = {
  SESSION: 'Session',
  GAME: 'Game',
  EVENT: 'Event',
}

// Colour by type — mirrors the live calendar, where sessions read red and
// non-training events read green.
export const TYPE_COLOR = {
  [EVENT_TYPES.SESSION]: colors.red_100,
  [EVENT_TYPES.GAME]: colors.blue_100,
  [EVENT_TYPES.EVENT]: colors.green_100,
}

export const SESSION_TYPES = ['1st Team Training', 'Recovery', 'Gym', 'Rehab', 'Individual']
export const EVENT_TYPES_LIST = ['Breakfast', 'Lunch', 'Team meeting', 'Travel', 'Medical', 'Other']
export const COMPETITIONS = ['Premier League 2', 'EFL Youth Alliance', 'Professional Development League']
export const VENUES = ['Home', 'Away', 'Neutral']
export const LOCATIONS = ['Arrowhead Stadium', 'Emirates Stadium', 'Training Ground', 'Performance Centre']
export const REPEATS = ["Doesn't repeat", 'Daily', 'Weekly', 'Every weekday', 'Custom']
export const TIMEZONES = ['Europe/Dublin', 'Europe/London', 'UTC', 'America/New_York']

let nextId = 5650000
const mk = (title, type, day, start, end, extra = {}) => ({
  id: nextId++,
  title,
  type,
  day, // 0 = Monday of the displayed week
  start,
  end,
  squad: 'U16 (Test Kitman FC)',
  ...extra,
})

// A representative week, matching the shape of the demo calendar.
export const events = [
  mk('Breakfast - U16', EVENT_TYPES.EVENT, 0, '07:00', '08:00', { eventType: 'Breakfast', repeats: 'Every weekday' }),
  mk('Football Training', EVENT_TYPES.SESSION, 0, '10:00', '11:00', { sessionType: '1st Team Training' }),
  mk('PM Training', EVENT_TYPES.SESSION, 0, '14:30', '15:30', { sessionType: '1st Team Training' }),
  mk('Android - repeatable', EVENT_TYPES.SESSION, 0, '15:35', '16:35', { sessionType: 'Gym', repeats: 'Daily' }),

  mk('Breakfast - U16', EVENT_TYPES.EVENT, 1, '07:00', '08:00', { eventType: 'Breakfast' }),
  mk('Football Training', EVENT_TYPES.SESSION, 1, '10:00', '11:00', { sessionType: '1st Team Training' }),
  mk('PM Training', EVENT_TYPES.SESSION, 1, '14:30', '15:30', { sessionType: '1st Team Training' }),
  mk('Android - repeatable', EVENT_TYPES.SESSION, 1, '15:35', '16:35', { sessionType: 'Gym' }),
  mk('Nandos Dinner', EVENT_TYPES.EVENT, 1, '18:00', '19:00', { eventType: 'Other' }),

  mk('Breakfast - U16', EVENT_TYPES.EVENT, 2, '07:00', '08:00', { eventType: 'Breakfast' }),
  mk('Breakfast - U16', EVENT_TYPES.EVENT, 2, '08:35', '09:35', { eventType: 'Breakfast' }),
  mk('Football Training', EVENT_TYPES.SESSION, 2, '10:00', '11:00', { sessionType: '1st Team Training' }),
  mk('PM Training', EVENT_TYPES.SESSION, 2, '14:30', '15:30', { sessionType: '1st Team Training' }),
  mk('Android - repeatable', EVENT_TYPES.SESSION, 2, '15:35', '16:35', { sessionType: 'Gym' }),

  mk('Breakfast - U16', EVENT_TYPES.EVENT, 3, '07:00', '08:00', { eventType: 'Breakfast' }),
  mk('Football Training', EVENT_TYPES.SESSION, 3, '10:00', '11:00', { sessionType: '1st Team Training' }),
  mk('PM Training', EVENT_TYPES.SESSION, 3, '14:30', '15:30', { sessionType: '1st Team Training' }),
  mk('Android - repeatable', EVENT_TYPES.SESSION, 3, '15:35', '16:35', { sessionType: 'Gym' }),

  mk('Breakfast - U16', EVENT_TYPES.EVENT, 4, '07:00', '08:00', { eventType: 'Breakfast' }),
  mk('Football Training', EVENT_TYPES.SESSION, 4, '10:00', '11:00', { sessionType: '1st Team Training' }),
  mk('Testing Oz - repeat-session', EVENT_TYPES.SESSION, 4, '11:48', '12:48', { sessionType: 'Recovery' }),
  mk('PM Training', EVENT_TYPES.SESSION, 4, '14:30', '15:30', { sessionType: '1st Team Training' }),
  mk('Android - repeatable', EVENT_TYPES.SESSION, 4, '15:35', '16:35', { sessionType: 'Gym' }),

  mk('U16 v U14 Test Kitman Wanderers', EVENT_TYPES.GAME, 5, '15:00', '16:30', {
    competition: 'EFL Youth Alliance', venue: 'Away', location: 'Arrowhead Stadium',
  }),
  mk('Breakfast - U16', EVENT_TYPES.EVENT, 5, '07:00', '08:00', { eventType: 'Breakfast' }),

  mk('crgtst', EVENT_TYPES.SESSION, 6, '10:00', '11:00', { sessionType: '1st Team Training' }),
  mk('Test TSO Event', EVENT_TYPES.EVENT, 6, '00:00', '22:45', { eventType: 'Other' }),
]

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const CALENDAR_VIEWS = ['Month', 'Week', 'Day', 'List']

export const toMinutes = t => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export const eventsForDay = (day, filters) =>
  events
    .filter(e => e.day === day)
    .filter(e => !filters || filters.types.includes(e.type))
    .sort((a, b) => toMinutes(a.start) - toMinutes(b.start))
