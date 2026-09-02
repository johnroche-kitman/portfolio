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

const P = (id, name, position, group, availability) => ({ id, name, position, group, availability })

export const gameSquad = [
  P(1, 'Prundel, Athlete Razvan', 'CB', 'Defender', 'Unavailable'),
  P(2, 'Aplayer, Org', 'RWB', 'Defender', 'Available'),
  P(3, 'Athlete, Dan', 'RWB', 'Defender', 'Available'),
  P(4, 'Athlete, Max', 'CB', 'Defender', 'Available'),
  P(5, 'Kansara, Utsav', 'RWB', 'Defender', 'Available'),
  P(6, 'Athlete, Player', 'CM', 'Midfielder', 'Available'),
  P(7, 'Claire-Marie', 'CM', 'Midfielder', 'Available'),
  P(8, 'Athlete 7, MK Test', 'CF', 'Forward', 'Available'),
  P(9, 'Diagnostic, Max', 'GK', 'Goalkeeper', 'Unavailable'),
]

export const gameStaff = [
  { id: 1, name: 'Craig Bennett', role: 'Head Coach' },
  { id: 2, name: 'Pablo de Miguel', role: 'Assistant Coach' },
  { id: 3, name: 'ST Test', role: 'Physiotherapist' },
]

/** Columns on the List view that are per-event rather than per-period. */
export const EVENT_COLUMNS = [
  { field: 'yellow', label: 'Yellow', colour: '#f1c410' },
  { field: 'red', label: 'Red', colour: '#c31d2b' },
  { field: 'goal', label: 'Goal', colour: null },
  { field: 'assist', label: 'Assist', colour: null },
  { field: 'ownGoal', label: 'Own Goal', colour: null },
]

export const PARTICIPATION = ['Full', 'Partial', 'Did not participate']
