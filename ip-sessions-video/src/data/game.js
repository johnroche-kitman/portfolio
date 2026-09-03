import { athletesInSquad, squad } from './athletes'
// Game fixtures, read off /planning_hub/events/:id for a Game event.

export const GAME_TABS = [
  'Athlete selection', 'Staff selection', 'Game events', 'Development goals', 'Collection', 'Imported data',
]

export const GAME_HEADER = {
  title: 'U16 (Test Kitman FC) v Test game',
  squad: 'U16 (Test Kitman FC)',
  date: 'July 20, 2026, 8:45 AM - 10:15 AM',
  venue: 'Neutral',
  competition: 'Premier League 2',
}

export const FORMATS = ['11v11', '9v9', '7v7', '5v5']
export const FIXTURE_RATINGS = ['1', '2', '3', '4', '5']

/**
 * Formations as rows back-to-front, so a pitch renders by mapping rows to bands.
 * The live pitch draws in perspective: the far touchline is narrower than the near
 * one, which is why positions are placed as percentages inside a trapezoid rather
 * than on a plain grid.
 */
export const FORMATIONS = {
  '4-3-3': [['GK'], ['RB', 'CB', 'CB', 'LB'], ['CM', 'CM', 'CM'], ['RW', 'CF', 'LW']],
  '4-4-2': [['GK'], ['RB', 'CB', 'CB', 'LB'], ['RM', 'CM', 'CM', 'LM'], ['CF', 'CF']],
  '3-5-2': [['GK'], ['CB', 'CB', 'CB'], ['RM', 'CM', 'CM', 'CM', 'LM'], ['CF', 'CF']],
  '4-2-3-1': [['GK'], ['RB', 'CB', 'CB', 'LB'], ['CDM', 'CDM'], ['RW', 'CAM', 'LW'], ['CF']],
}

export const LINEUP_ACTIONS = ['Save line-up template', 'Copy from last fixture', 'Use saved line-up']

/** Periods split the game evenly. Adding one redistributes the whole timeline. */
export const buildPeriods = (count, total = 90) => {
  const each = Math.round(total / count)
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    label: `Period ${i + 1}`,
    from: i * each,
    to: i === count - 1 ? total : (i + 1) * each,
  }))
}

/**
 * The match-day squad is the training squad, so a face and a name mean the same
 * thing on a game as they do on a session. `group` is what the line-up picker
 * buckets by, so it is derived from the position rather than stored twice.
 */
const GROUP = {
  Goalkeeper: 'Goalkeeper',
  'Right Back': 'Defender', 'Centre Back': 'Defender', 'Left Back': 'Defender',
  'Defensive Midfield': 'Midfielder', 'Centre Midfield': 'Midfielder', 'Attacking Midfield': 'Midfielder',
  'Right Wing': 'Forward', 'Left Wing': 'Forward', Striker: 'Forward',
}

const SHORT = {
  Goalkeeper: 'GK', 'Right Back': 'RB', 'Centre Back': 'CB', 'Left Back': 'LB',
  'Defensive Midfield': 'CDM', 'Centre Midfield': 'CM', 'Attacking Midfield': 'CAM',
  'Right Wing': 'RW', 'Left Wing': 'LW', Striker: 'CF',
}

export const gameSquad = athletesInSquad(squad).map(a => ({
  id: a.id,
  name: a.name,
  position: SHORT[a.position] || a.position,
  group: GROUP[a.position] || 'Other',
  availability: a.availability === 'Unavailable' ? 'Unavailable' : 'Available',
}))

export const gameStaff = [
  { id: 1, name: 'Tom Hargreaves', role: 'Head Coach' },
  { id: 2, name: 'Ciara Whelan', role: 'Performance Analyst' },
  { id: 3, name: 'Marie Nolan', role: 'Goalkeeping Coach' },
]

export const EVENT_COLUMNS = [
  { field: 'yellow', label: 'Yellow', colour: '#f1c410' },
  { field: 'red', label: 'Red', colour: '#c31d2b' },
  { field: 'goal', label: 'Goal', colour: null },
  { field: 'assist', label: 'Assist', colour: null },
  { field: 'ownGoal', label: 'Own Goal', colour: null },
]

export const PARTICIPATION = ['Full', 'Partial', 'Did not participate']
