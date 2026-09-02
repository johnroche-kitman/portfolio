// Forms and Planning fixtures, read off the live pages.

/* ------------------------------------------------ submissions (2 pages) */
// League benchmarking and Data importer are the same page. League benchmarking
// carries a Source column, the data importer does not.
const S = (id, date, by, status, hasErrors, source) =>
  ({ id, date, source, by, status, hasErrors })

export const benchmarkSubmissions = [
  S(1, '11 March 2026 16:17', 'Dan Higgins', 'Unsuccessful', true, 'CSV'),
  S(2, '28 August 2025 14:02', 'Craig Bennett', 'Completed', false, 'CSV'),
  S(3, '30 April 2025 16:02', 'Dan Higgins', 'Completed', false, 'CSV'),
  S(4, '27 March 2025 11:28', 'Craig Bennett', 'Completed', false, 'CSV'),
  S(5, '5 September 2024 09:14', 'Pablo de Miguel', 'Completed', false, 'CSV'),
  S(6, '27 August 2024 7:54', 'Jamie Schultz', 'Completed', false, 'CSV'),
  S(7, '21 August 2024 16:33', 'Jamie Schultz', 'Completed', false, 'CSV'),
  S(8, '16 August 2024 16:10', 'Dan Higgins', 'Completed', false, 'CSV'),
]

export const importerSubmissions = [
  S(1, '29 July 2026 15:24', 'Tom Read', 'Unsuccessful', true),
  S(2, '29 July 2026 15:23', 'Tom Read', 'Unsuccessful', true),
  S(3, '29 July 2026 15:23', 'Tom Read', 'Unsuccessful', true),
  S(4, '24 September 2025 16:40', 'Aisling McMahon Staff', 'Completed', false),
  S(5, '3 July 2025 15:15', 'Dan Higgins', 'Completed', false),
  S(6, '1 May 2025 14:38', 'Dan Higgins', 'Completed', false),
]

/** Variables offered by the Create CSV template drawer, grouped as the live one groups them. */
export const templateVariables = {
  Assessment: [
    ['1v1 Attacking', 'Scale (1 - 5)', '1v1_attacking'],
    ['Ball Security, Initiate Contact', 'Scale (1 - 5)', 'ball_security_initiate_contact'],
    ['Clever Movement, Deception', 'Scale (1 - 5)', 'clever_movement_deception'],
    ['Coach Rating', 'Scale (1 - 10)', 'coach_rating'],
    ['Combination Play, Link Up', 'Scale (1 - 5)', 'combination_play_link_up'],
    ['Confidence, Something Out of Nothing', 'Scale (1 - 5)', 'confidence_something_out_of_nothing'],
    ['Creates Space for Self and Others', 'Scale (1 - 5)', 'creates_space_for_self_and_others'],
    ['Decisive Finisher, Killer & Ruthless', 'Scale (1 - 5)', 'decisive_finisher_killer_ruthless'],
  ],
  Wellness: [
    ['Sleep Quality', 'Scale (1 - 5)', 'sleep_quality'],
    ['Fatigue', 'Scale (1 - 5)', 'fatigue'],
    ['Soreness', 'Scale (1 - 5)', 'soreness'],
  ],
}

/* --------------------------------------------------- benchmark validation */
export const VALIDATION_CLUBS = ['Test Kitman FC', 'Test Kitman Wanderers']
export const VALIDATION_SEASONS =
  ['2026/2027', '2025/2026', '2024/2025', '2023/2024', '2022/2023', '2021/2022', '2020/2021']
export const VALIDATION_WINDOWS = ['Pre-season', 'In-season', 'Post-season']

/* --------------------------------------------------- growth and maturation */
export const growthTests = [
  { id: 1, name: 'Growth and maturation assessments',
    edited: '19 Feb 2026 13:41 by Alain Mauri-admin-eu', results: 57 },
  { id: 2, name: 'Khamis-Roche baselines',
    edited: '6 May 2025 11:12 by Craig Bennett', results: 27 },
]

/* ----------------------------------------------------- coaching library */
export const ACTIVITY_TYPES = ['Warmup', 'Transition', 'Cooldown', 'Conditioning']
export const CREATORS = ['Dan Higgins', 'Mark McCaffrey', 'Craig Bennett', 'Jamie Schultz',
  'George Looshch-a…', 'Sinead Dolan']
export const PRINCIPLES = ['Ball Retention', 'Breaking Lines', 'Creating Space', 'Pressing']

const D = (id, name, description, intensity, activity, principles, creator, squads) =>
  ({ id, name, description, intensity, activity, principles, creator, squads })

const ALL_SQUADS = 'U15, U16 (Test Kitman FC), U21'

export const libraryDrills = [
  D(1, 'New drill', 'This is a test drill', 'Moderate', 'Cooldown', ['Ball Retention'], 'Dan Higgins', ALL_SQUADS),
  D(2, 'New drill to add to library', 'N/A', 'Moderate', 'Cooldown', [], 'Dan Higgins', ALL_SQUADS),
  D(3, 'Test', 'Example', 'Moderate', 'Cooldown', ['Breaking Lines', 'Creating Space'], 'Mark McCaffrey', ALL_SQUADS),
  D(4, 'Test drill', 'N/A', 'Moderate', 'Cooldown', [], 'Dan Higgins', ALL_SQUADS),
  D(5, '1-2-3', 'N/A', 'N/A', 'Transition', ['Ball Retention'], 'Craig Bennett', ALL_SQUADS),
  D(6, 'Testing 3 - Pablo', 'N/A', 'Light', 'Transition', ['Breaking Lines'], 'George Looshch-a…', ALL_SQUADS),
  D(7, 'Example', 'Anti clockwise movement', 'High', 'Warmup', ['Ball Retention', 'Creating Space'], 'Jamie Schultz', 'N/A'),
  D(8, 'Free Play', 'Emphasise ball control, left an…', 'Moderate', 'Warmup', ['Ball Retention', 'Creating Space'], 'Mark McCaffrey', ALL_SQUADS),
  D(9, 'Some new drill', 'N/A', 'Light', 'Warmup', [], 'Dan Higgins', ALL_SQUADS),
  D(10, 'Testing Sinead', 'N/A', 'Light', 'Warmup', [], 'Sinead Dolan', ALL_SQUADS),
]

/* ------------------------------------------------------- planning library */
export const ASSESSMENT_TEMPLATES = ['Test Template', 'Coach Review', 'Match Review']

export const libraryGames = [{ id: 1, type: 'Game', template: '' }]

export const librarySessionTypes = [
  { id: 1, type: '1st Team Training', template: 'Test Template' },
  { id: 2, type: 'Garmin - Workout', template: '' },
  { id: 3, type: 'Oura Ring - Monitoring', template: '' },
]
