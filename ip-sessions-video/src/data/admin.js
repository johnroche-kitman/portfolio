// Administration fixtures, read off the testkitmanfc demo. Synthetic data.

export const ROSTER_POSITIONS = [
  'Goalkeeper', 'Right Back', 'Right Wing Back', 'Centre Back', 'Left Back', 'Left Wing Back',
  'Sweeper', 'Defensive Midfielder', 'Right Wing', 'Central Midfielder', 'Left Wing',
  'Attacking Midfielder', 'Left Midfielder', 'Right Midfielder', 'Wing Forward',
  'Centre Forward', 'Striker', 'Other',
]

export const LABEL_COLORS = {
  '2000': '#8d6e3f', '2000 - 2005': '#d32f2f', 2001: '#e8d44d', 2002: '#8bc34a', 2003: '#43a047',
  2004: '#26a69a', 2005: '#1e88e5', 'Central Players': '#f4c20d', 'Female Athletes': '#c1873b',
  'High Value': '#e91e8c', 'Injury Risk': '#e53935', Knee: '#e07b1f', 'Loan Player': '#1565c0',
  'Premier League': '#6a1b9a',
}

export const LABELS = [
  { id: 1, name: '2000', description: '', by: 'Matt Newton', on: '23 May 2024' },
  { id: 2, name: '2000 - 2005', description: '', by: 'Matt Newton', on: '23 May 2024' },
  { id: 3, name: '2001', description: '', by: 'Matt Newton', on: '23 May 2024' },
  { id: 4, name: '2002', description: '', by: 'Matt Newton', on: '23 May 2024' },
  { id: 5, name: '2003', description: '', by: 'Matt Newton', on: '23 May 2024' },
  { id: 6, name: '2004', description: '', by: 'Matt Newton', on: '23 May 2024' },
  { id: 7, name: '2005', description: '', by: 'Matt Newton', on: '23 May 2024' },
  { id: 8, name: 'Central Players', description: '', by: 'MKing Staff', on: '5 Apr 2024' },
  { id: 9, name: 'Female Athletes', description: '', by: 'Conor Cawley', on: '23 May 2024' },
  { id: 10, name: 'High Value', description: '', by: 'Eoin Kilbride', on: '4 Apr 2024' },
  { id: 11, name: 'Injury Risk', description: 'Player who are at a higher injury risk', by: 'Adam Conway', on: '5 Jun 2024' },
  { id: 12, name: 'Knee', description: 'Knee', by: 'Matt Newton', on: '13 May 2024' },
  { id: 13, name: 'Loan Player', description: '', by: 'Eoin Kilbride', on: '4 Apr 2024' },
  { id: 14, name: 'Premier League', description: '', by: 'Matt Newton', on: '23 May 2024' },
]

/* ----------------------------------------------------------- athlete rows */
const A = (id, name, username, position, squads, created, labels = [], active = true) =>
  ({ id, name, username, position, squads, created, labels, active })

export const adminAthletes = [
  A(1, 'A Jordan', 'ajordan-athlete', 'Goalkeeper', ['U16 (Test Kitman FC)'], '29 Jul 2026', ['Premier League']),
  A(2, 'A Test 1, Mark', 'matest1', 'Centre Forward', ['U16 (Test Kitman FC) (Primary)', 'U15'], '29 Aug 2023'),
  A(3, 'Ahuja, Akshay', 'aahujaathlete', 'Goalkeeper', ['U16 (Test Kitman FC)'], '15 Apr 2026'),
  A(4, 'Ali, Mohamed', 'mailkfcath', 'Wing Forward', ['U16 (Test Kitman FC) (Primary)'], '14 Jul 2023'),
  A(5, 'Amariei, amariei', 'samariei2', 'Goalkeeper', ['U16 (Test Kitman FC)'], '25 Jun 2026'),
  A(6, 'Sabin', 'sabin-athlete', 'Sweeper', ['U15 (Primary)', 'U21', 'Testing'], '6 Jul 2026'),
  A(7, 'Aplayer, Org', 'oaplayer', 'Right Wing Back', ['U16 (Test Kitman FC)'], '13 Sep 2023'),
  A(8, 'Athlete, Craig', 'C.Athlete', 'Attacking Midfielder', ['U16 (Test Kitman FC)'], '14 Jul 2026'),
  A(9, 'Athlete, Dan', 'danathlete', 'Right Wing Back', ['U16 (Test Kitman FC)'], '28 Jul 2026'),
  A(10, 'Athlete, Delete test', 'deletetest', 'Goalkeeper', ['U16 (Test Kitman FC)'], '28 Nov 2025'),
  A(11, 'Athlete, Diagnostic', 'dathlete1', 'Central Midfielder', ['U16 (Test Kitman FC) (Primary)', 'U21'], '23 Aug 2023', ['Central Players', '2002', '2003']),
  A(12, 'Athlete, Export test', 'eathlete', 'Central Midfielder', ['U16 (Test Kitman Rovers) (Primary)', 'U15'], '11 Sep 2023', ['Central Players', '2001', '2004', 'Knee']),
  A(13, 'Athlete, Friday', 'fathlete', 'Right Back', ['U16 (Test Kitman FC) (Primary)', 'U21'], '8 Sep 2023', ['Female Athletes', '2005', 'High Value']),
  A(14, 'Athlete, Monday', 'mathlete', 'Left Wing', ['U16 (Test Kitman FC)'], '4 Sep 2023', ['Injury Risk']),
  A(15, 'Bennett, Craig', 'cbennettath', 'Striker', ['U16 (Test Kitman FC)'], '11 Jul 2023', ['Loan Player']),
  A(16, 'Byrne, Sean', 'sbyrneath', 'Left Back', ['U15 (Primary)'], '2 Feb 2025', [], false),
  A(17, 'Casey, Tom', 'tcaseyath', 'Centre Back', ['U16 (Test Kitman FC)'], '19 Mar 2024', [], false),
  A(18, 'Doyle, Mark', 'mdoyleath', 'Defensive Midfielder', ['U21 (Primary)'], '7 Nov 2024', ['2000'], false),
]

/* -------------------------------------------------------------- staff rows */
export const STAFF_ROLES = ['Account Admin', 'Staff', 'Coach', 'Medical', 'Analyst']

const U = (id, name, username, role, email, squads, created, active = true) =>
  ({ id, name, username, role, email, squads, created, active })

export const staffUsers = [
  U(1, 'test team 2', 't2x1', 'Staff', 'swood+tt2@kitmanlabs.com', ['U16 (Test Kitman FC)', 'U15', 'U21'], '19 July 2023'),
  U(2, 'Romain Achard', 'rachard', 'Staff', 'rachard+testkitmanfc@kitmanlabs.com', ['U16 (Test Kitman FC)', '+6'], '27 August 2025'),
  U(3, 'jon adamson', 'jadamson42', 'Account Admin', 'jadamson@kitmanlabs.com', ['U16 (Test Kitman FC)', '+4'], '26 October 2023'),
  U(4, 'Brian Admin', 'bmunjoma1', 'Account Admin', 'bmunjoma+staff1@kitmanlabs.com', ['U16 (Test Kitman FC)', '+2'], '3 March 2026'),
  U(5, 'QA Admin', 'qadmin', 'Account Admin', 'mking+tkfcadmin@kitmanlabs.com', ['U16 (Test Kitman FC)', '+5'], '21 October 2025'),
  U(6, 'Akshay Ahuja', 'aahuja1', 'Account Admin', 'aahuja@kitmanlabs.com', ['U16 (Test Kitman FC)', '+6'], '15 April 2026'),
  U(7, 'Akshay Ahuja staff', 'aahujastaff', 'Coach', 'aahuja+staffc@kitmanlabs.com', ['U16 (Test Kitman FC)', '+6'], '6 May 2026'),
  U(8, 'Email Alerts', 'ealerts', 'Staff', 'mking+alerts@kitmanlabs.com', ['U16 (Test Kitman FC)', '+2'], '9 May 2024'),
  U(9, 'Tymofii Antoniuk', 'tantoniuk', 'Account Admin', 'tantoniuk@kitmanlabs.com', ['U16 (Test Kitman FC)', '+5'], '28 May 2025'),
  U(10, 'Craig Bailey', 'cbailey2', 'Account Admin', 'cbailey+kfc@kitmanlabs.com', ['U16 (Test Kitman FC)', '+2'], '11 July 2023'),
  U(11, 'Craig Bennett', 'cbennett10', 'Account Admin', 'cbennett@kitmanlabs.com', ['U16 (Test Kitman FC)', '+6'], '13 February 2025'),
  U(12, 'Dan Higgins', 'dhiggins3', 'Analyst', 'dhiggins@kitmanlabs.com', ['U16 (Test Kitman FC)'], '4 April 2024', false),
  U(13, 'Conor Cawley', 'ccawley1', 'Medical', 'ccawley@kitmanlabs.com', ['U15', 'U21'], '23 May 2024', false),
]

/* ------------------------------------------------------------ misc tables */
export const athleteGroups = [
  { id: 1, name: 'Central Players 21 and older', by: 'MKing Staff', on: '5 Apr 2024' },
  { id: 2, name: 'Female - 2000', by: 'Matt Newton', on: '23 May 2024' },
  { id: 3, name: 'Female 2000-2005', by: 'Conor Cawley', on: '23 May 2024' },
  { id: 4, name: 'High Injury Risk', by: 'Adam Conway', on: '5 Jun 2024' },
  { id: 5, name: 'High Value Loan Wide Players', by: 'Eoin Kilbride', on: '4 Apr 2024' },
  { id: 6, name: 'Male - 2000', by: 'Matt Newton', on: '23 May 2024' },
  { id: 7, name: 'Test Group', by: 'Eoin Kilbride', on: '20 May 2024' },
  { id: 8, name: 'U20 Central Players', by: 'MKing Staff', on: '5 Apr 2024' },
  { id: 9, name: 'U20 Wide Players', by: 'MKing Staff', on: '5 Apr 2024' },
  { id: 10, name: 'Wide Loan Players', by: 'Eoin Kilbride', on: '4 Apr 2024' },
]

export const IMPORT_TYPES = ['Athlete Import', 'Staff Import', 'Growth and maturation import', 'Data importer']
export const IMPORT_STATUSES = ['Completed', 'Failed', 'In progress']

export const imports = [
  { id: 1, name: 'Data-importer-template-2026_07_29-errors.csv', type: '', at: '29 Jul 2026 15:24', status: 'Completed', by: 'Tom Read', errors: ["Athlete '203982' does not exist in organisation", "Athlete '39894' does not exist in organisation"] },
  { id: 2, name: 'Data-importer-template-2026_07_29-errors.csv', type: '', at: '29 Jul 2026 15:23', status: 'Completed', by: 'Tom Read', errors: ["Athlete '39894' does not exist in organisation"] },
  { id: 3, name: 'League-benchmarking-template-2026-errors.csv', type: '', at: '11 Mar 2026 16:17', status: 'Completed', by: 'Dan Higgins', errors: ["Athlete '80524' does not exist in organisation"] },
  { id: 4, name: 'e1cf055bc6c532f0d9be3403b25e3', type: 'Growth and maturation import', at: '19 Feb 2026 13:41', status: 'Completed', by: 'Alain Mauri-admin-eu', errors: [] },
  { id: 5, name: 'Data-importer-template-2025_09_24.csv', type: '', at: '24 Sep 2025 16:41', status: 'Completed', by: 'Aisling McMahon Staff', errors: [] },
  { id: 6, name: 'Book(Sheet1) (3).csv', type: '', at: '28 Aug 2025 14:18', status: 'Completed', by: 'Craig Bennett', errors: [] },
  { id: 7, name: 'Data importer.csv', type: '', at: '3 Jul 2025 15:15', status: 'Completed', by: 'Dan Higgins', errors: [] },
  { id: 8, name: 'user_mass_importer - Import.csv', type: 'Staff Import', at: '1 Jul 2025 15:08', status: 'Completed', by: 'Jamie Schultz', errors: [] },
  { id: 9, name: 'user_mass_importer - Import.csv', type: 'Staff Import', at: '1 Jul 2025 15:06', status: 'Completed', by: 'Jamie Schultz', errors: ['User with email no-email_2@kitmanlabs.com already exists', 'User with email no-email_3@kitmanlabs.com already exists'] },
  { id: 10, name: 'athlete_mass_importer_athletes.csv', type: 'Athlete Import', at: '1 Jul 2025 15:02', status: 'Completed', by: 'Jamie Schultz', errors: [] },
  { id: 11, name: 'athlete_mass_importer_athletes.csv', type: 'Athlete Import', at: '1 Jul 2025 14:59', status: 'Completed', by: 'Jamie Schultz', errors: ['Squad U16 (Test Kitman FC), U21 does not exist', 'Squad U16 (Test Kitman FC), U15 does not exist'] },
  { id: 12, name: 'athlete_mass_importer_15_athletes.csv', type: 'Athlete Import', at: '1 Jul 2025 14:54', status: 'Completed', by: 'Jamie Schultz', errors: [] },
]

export const exports_ = [
  { id: 1, name: 'undefined', type: 'Diagnostic Billing', at: '26 Sep 2024 12:45', status: 'Completed' },
]

export const fixtures = [
  { id: 'IS123', name: '', date: '25 Jul 2026', opponent: '', competition: 'EFL Youth Alliance', venue: 'Away' },
  { id: 'IS122', name: '', date: '23 Jul 2026', opponent: '', competition: 'Professional Development League', venue: 'Away' },
  { id: 'IS121', name: '', date: '22 Jul 2026', opponent: '', competition: 'Premier League 2', venue: 'Home' },
  { id: 'IS120', name: '', date: '22 Jul 2026', opponent: '', competition: 'Premier League 2', venue: 'Home' },
  { id: 'IS119', name: 'Test game', date: '20 Jul 2026', opponent: 'Test game', competition: 'Premier League 2', venue: 'Neutral' },
  { id: 'IS118', name: '', date: '18 Jul 2026', opponent: '', competition: 'EFL Youth Alliance', venue: 'Away' },
  { id: 'IS117', name: 'Test Team', date: '15 Jul 2026', opponent: 'Test Team', competition: 'Premier League 2', venue: 'Neutral' },
  { id: 'IS116', name: 'Test Game 15 July', date: '15 Jul 2026', opponent: 'Test Game 15 July', competition: 'Premier League 2', venue: 'Away' },
  { id: 'IS115', name: 'Test Game 1', date: '14 Jul 2026', opponent: 'Test Game 1', competition: 'Premier League 2', venue: 'Away' },
  { id: 'IS114', name: 'Test Team', date: '14 Jul 2026', opponent: 'Test Team', competition: 'Premier League 2', venue: 'Away' },
  { id: 'IS113', name: '', date: '13 Jul 2026', opponent: '', competition: 'Professional Development League', venue: 'Away' },
  { id: 'IS112', name: 'Test Team', date: '13 Jul 2026', opponent: 'Test Team', competition: 'Premier League 2', venue: 'Away' },
]

export const stock = [
  { id: 1, name: 'Activated charcoal biscuits', strength: '--', type: '--', lot: '1234', exp: 'Feb 12, 2024', dispensed: '--', onHand: 150 },
]

export const LOCATION_TYPES = ['Stadium', 'Training Facility', 'Other']

export const locations = [
  { id: 1, name: 'Dogpatch Labs', type: 'Other', related: 'Event', map: 'https://maps.app.goo.gl/Rd5n3KEYwXVUgskJ7' },
  { id: 2, name: 'Emirates Stadium', type: 'Stadium', related: 'Game, Event, Session', map: 'https://www.google.com/maps/place/Emirates' },
  { id: 3, name: 'Estadio Metropolitano', type: 'Stadium', related: 'Game', map: 'https://www.google.com/maps/place/Metropolitano' },
  { id: 4, name: 'Etihad Campus', type: 'Training Facility', related: 'Session', map: '' },
  { id: 5, name: 'Hebert Park test location', type: 'Other', related: 'Event', map: '' },
  { id: 6, name: 'London Colney', type: 'Training Facility', related: 'Session, Event, Game', map: '' },
  { id: 7, name: 'Mestalla', type: 'Stadium', related: 'Game', map: '' },
  { id: 8, name: 'Nandos Dublin', type: 'Other', related: 'Event', map: 'https://maps.app.goo.gl/4mriuNFixJbkEYuJ7' },
  { id: 9, name: 'Old Trafford', type: 'Stadium', related: 'Game', map: '' },
  { id: 10, name: 'Santiago Bernabeu', type: 'Stadium', related: 'Game, Session, Event', map: '' },
  { id: 11, name: 'Simpson Training Center', type: 'Training Facility', related: 'Event, Game, Session', map: '' },
  { id: 12, name: 'Tottenham Hotspur Stadium', type: 'Stadium', related: 'Game, Event', map: 'https://www.google.com/maps/place/Tottenham' },
  { id: 13, name: 'Victory Park', type: 'Stadium', related: 'Game, Session', map: '' },
]

/* ------------------------------------------------- organisation settings */
export const DISPLAY_NAME_FORMATS = ['Last name, First name', 'First name Last name', 'Last name First name']
export const SHORT_NAME_FORMATS = ['First name initial, Last name', 'First name, Last name initial', 'Last name']

export const GRAPH_COLOURS = [
  '#2323f0', '#111111', '#22b8a0', '#f2c60f', '#ef5350', '#22c55e', '#1f5fa9', '#9c4dcc',
  '#123a63', '#c0392b', '#e8a020', '#d81b60', '#a3bfa3', '#000000',
]

export const GAME_PARTICIPATION = [
  { level: 'Started - Full Game', participation: 'Full', include: true },
  { level: 'Started - Substituted', participation: 'Partial', include: true },
  { level: 'Substitute - Played', participation: 'Partial', include: false },
  { level: 'Substitute - Not Played', participation: 'None', include: false },
  { level: 'No Participation', participation: 'None', include: false },
]

export const SESSION_PARTICIPATION = [
  { level: 'Full', participation: 'Full', include: true },
  { level: 'Modified', participation: 'Modified', include: true },
  { level: 'Partial', participation: 'Partial', include: false },
  { level: 'No Participation', participation: 'None', include: false },
]

export const WORKLOAD_VARIABLES = ['RPE x Duration', 'Total Distance', 'High Speed Distance', 'Player Load', 'None']

export const principles = [
  { id: 1, name: 'Ball Retention', category: 'Delay, Deny, and Dictate', phase: 'Transition', type: 'Tactical', squads: 'U21' },
  { id: 2, name: 'Breaking Lines', category: 'Progressing and Penetrating', phase: 'Defending', type: 'Tactical', squads: 'U15, U16 (Test Kitman FC), U21' },
  { id: 3, name: 'Creating Space', category: 'Pressing', phase: 'Set Pieces', type: 'Tactical', squads: 'U15, U21' },
  { id: 4, name: 'Forward Passing', category: 'Progressing and Penetrating', phase: 'Attacking', type: 'Technical', squads: 'U15, U16 (Test Kitman FC), U21' },
  { id: 5, name: 'Pressing', category: 'Direct Play', phase: 'Attacking', type: 'Tactical', squads: 'U15, U16 (Test Kitman FC), U21' },
  { id: 6, name: 'Rotations', category: 'Delay, Deny, and Dictate', phase: 'Transition', type: 'Tactical', squads: 'U21' },
  { id: 7, name: 'Screening', category: 'Delay, Deny, and Dictate', phase: 'Transition', type: 'Tactical', squads: 'U15, U16 (Test Kitman FC), U21' },
  { id: 8, name: 'Switching Play', category: 'Pressing', phase: 'Attacking', type: 'Tactical', squads: 'U21' },
  { id: 9, name: 'Wide Play and Crossing', category: 'Attacking', phase: 'Defending', type: 'Tactical', squads: 'U15, U16 (Test Kitman FC), U21' },
]

export const PRINCIPLE_CATEGORIES = ['Delay, Deny, and Dictate', 'Progressing and Penetrating', 'Pressing', 'Direct Play', 'Attacking']
export const PHASES_OF_PLAY = ['Transition', 'Defending', 'Attacking', 'Set Pieces']
export const PRINCIPLE_TYPES = ['Tactical', 'Technical', 'Physical', 'Psychological']

export const devGoalTypes = [
  { id: 1, name: 'Individual Session (1/3)', squads: 'U15, U16 (Test Kitman FC), U21' },
  { id: 2, name: 'Tactical (1/5)', squads: 'U15, U16 (Test Kitman FC), U21' },
  { id: 3, name: 'Test Dev Goal (1/2)', squads: 'U21' },
]
export const devGoalCompletionTypes = [
  { id: 1, name: 'Individual Session' },
  { id: 2, name: 'Video Session' },
]
export const activityTypes = [
  { id: 1, name: 'Attack', category: 'Football Based' },
  { id: 2, name: 'Cooldown', category: 'Injury Prevention' },
  { id: 3, name: 'Defence', category: 'Football Based' },
  { id: 4, name: 'Games', category: 'Football Based' },
  { id: 5, name: 'Transition', category: 'Football Based' },
  { id: 6, name: 'Warmup', category: 'Conditioning' },
]
export const drillLabels = [
  { id: 1, name: 'Defensive Concepts', squads: 'U21' },
  { id: 2, name: 'Dribbling', squads: 'U21' },
  { id: 3, name: 'Heading', squads: 'U21' },
  { id: 4, name: 'Passing', squads: 'U21' },
  { id: 5, name: 'Shooting', squads: 'U21' },
]

// Event types, grouped exactly as the settings table renders them.
export const eventTypeGroups = [
  {
    group: 'Example Category', squads: '4 - U16 (Test Kitman FC), U15, U21, Historic Squad Reporting Test',
    items: [{ name: 'Conversations about Puberty', color: '#c2379b', squads: '4 - U16 (Test Kitman FC), U15, U21, Historic …' }],
  },
  {
    group: 'Meals', squads: '3 - U16 (Test Kitman FC), U15, U21',
    items: [
      { name: 'Breakfast - U16', color: '#22b8a0', squads: '3 - U16 (Test Kitman FC), U15, U21' },
      { name: 'Dinner', color: '#e8344e', squads: '3 - U15, U16 (Test Kitman FC), U21' },
      { name: 'Lunch Time', color: '#111111', squads: '3 - U15, U16 (Test Kitman FC), U21' },
    ],
  },
  {
    group: 'Ungrouped', squads: '',
    items: [
      { name: 'Doctor Appointment', color: '#3ddc84', squads: '4 - U16 (Test Kitman FC), U15, U21, Historic …' },
      { name: "Stephen's Test", color: '#c2379b', squads: '1 - U15' },
      { name: 'Video Analysis', color: '#b134c1', squads: '4 - U16 (Test Kitman FC), U15, U21, Historic …' },
    ],
  },
]

export const BRANDING_SWATCHES = [
  '#2323f0', '#111111', '#22b8a0', '#f2c60f', '#ef5350', '#22c55e', '#1f5fa9', '#9c4dcc',
  '#123a63', '#c0392b', '#e8a020', '#d81b60', '#a3bfa3', '#000000',
]

export const uploadCategories = [{ id: 1, name: 'Tactical' }, { id: 2, name: 'Other 2' }]

export const NOTIFICATION_GROUPS = [
  {
    group: 'Calendar', blurb: 'Configure notifications for Calendar',
    rows: [
      { label: 'Event created', email: true, emailWho: 'Staff', push: true, pushWho: 'All' },
      { label: 'Event updated', email: true, emailWho: 'Staff', push: true, pushWho: 'All' },
      { label: 'Event deleted', email: true, emailWho: 'Staff', push: true, pushWho: 'All' },
      { label: 'Event reminder', email: true, emailWho: 'Staff', emailTiming: '1 day before', push: false, pushWho: 'Staff', timing: true },
    ],
  },
]

export const WHO_OPTIONS = ['All', 'Staff', 'Athletes', 'Guardians']
export const TIMING_OPTIONS = ['15 minutes before', '1 hour before', '1 day before', '1 week before']

export const licenceCreators = ['Reporting-MyiP Creator 1', 'Jonathan Murphy', 'Vinnie Ordobas']

/* -------------------------------------------------------------- new user */
export const PERMISSION_GROUPS = [
  { name: 'Athlete Screening', items: ['Questionnaire Create', 'Questionnaires Admin', 'Questionnaire Comments'] },
  { name: 'Workloads', items: ['Workload View', 'Games Admin', 'Training Sessions Admin', 'Manage workloads', 'Create Games', 'Edit Games', 'Delete Games'] },
  { name: 'Medical', items: ['View Issues', 'Issues Admin', 'Manage Availability', 'View Availability', 'Medical Graphing', 'Export Medical Data', 'View Medical History', 'Diagnostic Admin', 'Medical Module', 'View Modifications', 'Create Modifications', 'Edit Modifications', 'View Medical Notes', 'Create Medical Notes', 'Edit Medical Notes', 'Archive Medical Notes', 'Create Medical Forms', 'View Medical Forms', 'Edit Medical Forms'] },
  { name: 'Analysis', items: ['Analysis Athlete View', 'Graph Viewer', 'Graph Builder', 'View Analytical Dashboard', 'Manage Analytical Dashboard', 'View Staff Development Dashboard', 'View Benchmark Testing Report', 'Manage Benchmark Testing Data', 'View Coaching Summary Dashboard', 'View Medical Summary Dashboard', 'Access Labels and Groups in Reporting', 'Report on Labels and Groups', 'Enable Historic Reporting', 'View Growth and Maturation Report', 'Development Journey Viewer'] },
  { name: 'Settings', items: ['Manage Athletes', 'Manage Staff Users', 'Settings Questionnaire', 'Organisation Settings', 'Manage Privacy Settings', 'Manage Athlete Emergency Contacts', 'Planning Admin', 'Manage Squads', 'View Imports', 'Create Imports', 'Exports', 'Labels Admin', 'View Labels', 'Groups Admin', 'View Groups', 'Assign Labels', 'View Staff Users', 'Manage Integrations', 'Manage Profile Fields', 'Export Athlete Details'] },
  { name: 'General', items: ['View Athletes', 'View Dashboard', 'Manage Dashboard', 'View Absence', 'Manage Absence', 'View Availability Report', 'View Protected Metrics', 'View Inactive Athletes', 'View Athletes Area', 'View Past Athletes'] },
  { name: 'Kiosk', items: ['Workload Collection', 'Forms'] },
  { name: 'Notes', items: ['Create Notes', 'Edit Notes', 'View Notes', 'Medical Notes'] },
  { name: 'Assessments', items: ['View Assessment', 'Create Assessment', 'Edit Assessment', 'Answer Assessment', 'Delete Assessment', 'Manage Assessment Template', 'Create Assessment from Template'] },
  { name: 'Messaging', items: ['View Messaging', 'Create Direct Message', 'Create Private Channel', 'Create Public Channel', 'Messaging Admin'] },
  { name: 'Homepage', items: ['View Homepage', 'Manage Homepage'] },
  { name: 'Development Goals', items: ['Create Development Goals', 'View Development Goals', 'Edit Development Goals', 'Delete Development Goals'] },
  { name: 'Rehab', items: ['View Rehab Sessions', 'Manage Rehab Sessions'] },
  { name: 'Video', items: ['View Video', 'Video Admin'] },
  { name: 'Documents', items: ['Manage Documents', 'Documents Admin'] },
  { name: 'Events', items: ['View Events', 'Manage Events', 'Events Admin'] },
  { name: 'Fixture Management', items: ['Club Fixture Negotiation'] },
  { name: 'Reviews', items: ['Edit Reviews', 'Reviews Admin'] },
  { name: 'Recruitment', items: ['Recruitment Admin', 'Scout Access', 'Only See Own Content', 'Sensitive Info Access', 'Modify Succession Player Status'] },
  { name: 'Calendar Settings', items: ['Create Event Type Settings', 'Edit Event Type Settings', 'Archive Event Type Settings'] },
  { name: 'Event Location Settings', items: ['Create Locations', 'Edit Locations', 'Archive Locations'] },
  { name: 'Squad Access', items: ['U16 (Test Kitman FC)', 'U16 (Test Kitman Rovers)', 'U15', 'U21', 'Testing', 'Historic Squad Reporting Test'] },
]

export const USER_GROUPS = ['-Group-', 'Account Admin', 'Staff', 'Coach', 'Medical', 'Analyst', 'Scout']

export const LANGUAGES = [
  'Use organisation language setting', 'English', 'English (AU)', 'English (GB)', 'English (IE)',
  'English (NZ)', 'English (US)', 'French', 'Italian', 'German', 'Spanish', 'Chinese (Taiwan)',
  'Japanese', 'Portuguese (PT)', 'Portuguese (BR)', 'Polish', 'Netherlands (Dutch)', 'Turkish', 'Norwegian',
]

/* ------------------------------------------------------------ new athlete */
export const COUNTRIES = [
  'Argentina', 'Australia', 'Belgium', 'Brazil', 'Croatia', 'Denmark', 'England', 'France',
  'Germany', 'Ireland', 'Italy', 'Netherlands', 'Nigeria', 'Northern Ireland', 'Norway',
  'Poland', 'Portugal', 'Scotland', 'Senegal', 'Spain', 'Sweden', 'United States', 'Wales',
]

export const ATHLETE_PROFILE_FIELDS = [
  { label: 'Gender', options: ['M', 'F', 'O'] },
  { label: 'Town of birth' },
  { label: 'PMA Ethnicity', options: ['Arab', 'Asian and Asian British: Indian', 'Black or Black British: Africa', 'Mixed: Other', 'White: British', 'White: Irish', 'Prefer not to say'] },
  { label: 'Religion' },
  { label: 'Special Education Needs' },
  { label: 'PMA Quartile', options: ['Unknown', 'Q1', 'Q2', 'Q3', 'Q4'] },
  { label: 'PMA Age Group', options: ['U09', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17', 'U18', 'U23'] },
  { label: 'Dominant Foot', options: ['Left', 'Right'] },
  { label: 'Dominant Hand', options: ['Left', 'Right'] },
  { label: 'Weight (kg)' },
  { label: 'Shirt Name' },
  { label: 'Home Phone' },
  { label: 'Secondary Email' },
  { label: 'Lives With', options: ['Both Parents', 'Mother', 'Father', 'Other'] },
  { label: 'PMA Registration Type', options: ['Schoolboy', 'Scholar', 'Professional', 'Trialist', 'Training Only', 'Non Contract/Amateur'] },
  { label: 'PMA Kit Size Top', options: ['7/8 Years', '9/10 Years', '11/12 Years', '13/14 Year', 'Adult S', 'Adult M', 'Adult L', 'Adult XL'] },
  { label: 'PMA Kit Size Socks', options: ['2 - 4', '4 - 6', '6 - 8', '8 - 11'] },
  { label: 'PMA Kit Size Bottom', options: ['7/8 Years', '9/10 Years', '11/12 Years', '13/14 Year', 'Adult S', 'Adult M', 'Adult L', 'Adult XL'] },
  { label: 'School Name' },
  { label: 'School Phone' },
  { label: 'School Email' },
  { label: 'School Contact Name' },
  { label: 'Head Teachers Name' },
  { label: 'PE Teachers Name' },
  { label: 'Agent Name' },
  { label: 'Agent Phone' },
  { label: 'Agent Email' },
  { label: 'Car Registration' },
  { label: 'Primary Guardian Name' },
  { label: 'Primary Guardian Relationship', options: ['Parent', 'Guardian', 'Sibling', 'Grandparent', 'Family', 'Friend'] },
  { label: 'Primary Guardian Phone' },
  { label: 'Primary Guardian Email' },
  { label: 'Secondary Guardian Name' },
  { label: 'Secondary Guardian Relationship', options: ['Parent', 'Guardian', 'Sibling', 'Grandparent', 'Family', 'Friend'] },
  { label: 'Secondary Guardian Phone' },
  { label: 'Secondary Guardian Email' },
  { label: 'GP Name' },
  { label: 'GP Phone' },
  { label: 'GP Email' },
  { label: 'Surgery Name' },
  { label: 'Surgery Phone' },
  { label: 'Physio Name' },
  { label: 'Physio Phone' },
  { label: 'Physio Email' },
  { label: 'Dentist Name' },
  { label: 'Dentist Phone' },
  { label: 'Passport Number' },
  { label: 'Passport Name' },
  { label: 'Passport Expiry' },
  { label: 'Passport Issuing Authority' },
  { label: 'NHS Number' },
  { label: 'National Insurance Number' },
  { label: 'BUPA insurance number' },
  { label: 'Driving Licence Number' },
  { label: 'Bank Name' },
  { label: 'General Notes' },
]

export const DIAL_CODES = ['+353 Ireland', '+44 United Kingdom', '+1 United States', '+33 France', '+34 Spain', '+49 Germany', '+39 Italy']
