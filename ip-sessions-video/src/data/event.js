// Plain-event fixtures, read off /planning_hub/events/:id for an Event.

export const EVENT_TABS = ['Athletes', 'Staff', 'Attachments']

export const EVENT_HEADER = {
  title: 'Breakfast - U16',
  squad: 'U16',
  date: 'September 30, 2026 6:00 AM, (7:00 AM Europe/Dublin) (60 min)',
  type: 'Breakfast - U16',
  location: 'Emirates Stadium',
}

/** Squads is a list per athlete, not a single value: an athlete can sit in several. */
export const eventAthletes = [
  { id: 1, name: 'Bennett, Craig', position: 'Goalkeeper', attended: false,
    squads: ['P&C Test Squad', 'U16'] },
  { id: 2, name: 'crgtst', position: 'Goalkeeper', attended: false,
    squads: ['U16'] },
  { id: 3, name: 'Walsh, Niamh', position: 'Other', attended: false,
    squads: ['P&C Test Squad', 'U16'] },
]

/** Staff here are listed by email rather than role, unlike the session and the game. */
export const eventStaff = [
  { id: 1, name: 'Craig Bennett', email: 'cbennett@kitmanlabs.com' },
  { id: 2, name: 'Craig Bennett', email: 'cbennett+testkitmanfc@kitmanlabs.com' },
]

export const eventAttachments = []

export const ATTACHMENT_CATEGORIES = ['Imaging', 'Consent', 'Correspondence', 'Report', 'Other']
