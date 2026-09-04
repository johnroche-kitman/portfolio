// Medical fixtures, read off /medical/rosters and the athlete and injury records.

export const SEVERITIES = ['Severe', 'Moderate', 'Mild', 'Not Specified']
export const NOTE_TYPES = ['Initial Note', 'Progress Note', 'Discharge Note', 'Screening', 'Other']
export const FLAG_CATEGORIES = ['Allergy', 'Medical Alert']
export const FILE_TYPES = ['PDF', 'Image', 'Word', 'Video']
export const DOC_CATEGORIES = ['Imaging', 'Consent', 'Correspondence', 'Report', 'Other']
export const DOC_SOURCES = ['Upload', 'Scan', 'Integration']
export const FORM_TYPES = ['Return to Play', 'Concussion', 'Pre-season screening', 'Discharge']
export const TREATMENT_TYPES = ['Physiotherapy', 'Massage', 'Strapping', 'Rehab session', 'Manual therapy']
export const DIAGNOSTIC_TYPES = ['MRI', 'X-Ray', 'Ultrasound', 'CT', 'Bloods']
export const MODIFICATION_TYPES = ['Modified training', 'Absence', 'Restricted', 'Full return']
export const MEDICATION_ROUTES = ['Oral', 'Topical', 'Injection', 'Inhaled']

export const AVAILABILITY_STATUSES = [
  'Unavailable - time-loss', 'Available - not modified', 'Available - modified', 'Unavailable - non time-loss',
]

/* ------------------------------------------------------------- team rows */
const T = (id, name, position, status, days, issues, note) =>
  ({ id, name, position, status, days, issues, note })

export const medicalTeam = [
  T(162023, 'Aplayer, Org', 'Right Wing Back', 'Unavailable', 0, [
    { date: '15 Aug 2023', title: 'Gout in knee', status: 'Unavailable - time-loss' },
    { date: '4 Aug 2023', title: 'A/C joint arthritis [Center]', status: 'Unavailable - time-loss' },
  ], { date: '7 Aug 2023', title: 'fghfg', body: 'hfghfghgfh' }),
  T(440559, 'Athlete, Dan', 'Right Wing Back', 'Available', null, [], null),
  T(212114, 'Athlete, Max', 'Centre Back', 'Unavailable', 1125, [
    { date: '2 Aug 2023', title: 'Instability 1st MCP joint [Left]', status: 'Unavailable - time-loss' },
    { date: '20 Jul 2023', title: 'Supplemental pathology field?', status: 'Unavailable - time-loss' },
  ], { date: '11 Jul 2024', title: 'This injury will be set to resolved for injury recurrence purposes.', body: 'This injury will be set to resolved for inj…' }),
  T(318822, 'Athlete 7, MK Test', 'Centre Back', 'Injured/Ill', 950, [
    { date: '1 May 2023', title: 'Thyroid disorder', status: 'Available - not modified' },
  ], null),
  T(551200, 'Diagnostic, Max', 'Centre Back', 'Unavailable', 950, [
    { date: '1 Aug 2023', title: 'Instability 1st CMC joint [Center]', status: 'Unavailable - time-loss' },
  ], { date: '24 Aug 2023', title: 'Initial Note', body: 'gfhfhgfhgh' }),
  T(662001, 'Kansara, Utsav', 'Right Wing Back', 'Available', null, [], null),
  T(662002, 'Athlete, Player', 'Centre Back', 'Available', null, [], null),
  T(662003, 'Claire-Marie', 'Right Wing Back', 'Available', null, [], null),
  T(662004, 'Prundel, Athlete Razvan', 'Centre Back', 'Unavailable', 55, [
    { date: '6 Jul 2026', title: '', status: 'Unavailable - time-loss', preliminary: true },
  ], null),
  T(662005, 'Robinson(Athlete), Lauren', 'Right Wing Back', 'Available', null, [], null),
]

export const medicalAthleteById = id => medicalTeam.find(a => String(a.id) === String(id)) || medicalTeam[0]

/* ------------------------------------------------------ shared tab rows */
export const medicalNotes = [
  { id: 1, athlete: 'Aplayer, Org', date: '7 Aug 2023', type: 'Progress Note', title: 'fghfg', body: 'hfghfghgfh', author: 'ST Test' },
  { id: 2, athlete: 'Diagnostic, Max', date: '24 Aug 2023', type: 'Initial Note', title: 'Initial Note', body: 'gfhfhgfhgh', author: 'John Roche Test' },
  { id: 3, athlete: 'Athlete, Max', date: '11 Jul 2024', type: 'Progress Note', title: 'Recurrence', body: 'This injury will be set to resolved for injury recurrence purposes.', author: 'ST Test' },
  { id: 4, athlete: 'Athlete 7, MK Test', date: '2 May 2023', type: 'Screening', title: 'Thyroid review', body: 'Bloods requested.', author: 'Pablo de Miguel' },
]

export const medicalModifications = [
  { id: 1, athlete: 'Aplayer, Org', type: 'Modified training', detail: 'No contact work', start: '15 Aug 2023', end: '22 Aug 2023', by: 'ST Test' },
  { id: 2, athlete: 'Athlete, Max', type: 'Absence', detail: 'Away — family', start: '2 Aug 2023', end: '9 Aug 2023', by: 'John Roche Test' },
  { id: 3, athlete: 'Athlete 7, MK Test', type: 'Restricted', detail: 'Gym only', start: '1 May 2023', end: '', by: 'Pablo de Miguel' },
]

export const medicalTreatments = [
  { id: 1, athlete: 'Aplayer, Org', date: '16 Aug 2023', type: 'Physiotherapy', detail: 'Knee mobilisation', duration: '30 min', by: 'Pablo de Miguel' },
  { id: 2, athlete: 'Athlete, Max', date: '3 Aug 2023', type: 'Manual therapy', detail: 'Thumb joint', duration: '20 min', by: 'ST Test' },
  { id: 3, athlete: 'Diagnostic, Max', date: '2 Aug 2023', type: 'Strapping', detail: 'CMC support', duration: '10 min', by: 'ST Test' },
]

export const medicalDiagnostics = [
  { id: 1, athlete: 'Aplayer, Org', date: '17 Aug 2023', type: 'MRI', region: 'Knee', result: 'Effusion confirmed', by: 'Pablo de Miguel' },
  { id: 2, athlete: 'Athlete, Max', date: '3 Aug 2023', type: 'X-Ray', region: 'Hand', result: 'No fracture', by: 'ST Test' },
]

export const medicalFlags = [
  { id: 1, athlete: 'A Test 1, Mark', position: 'Centre Forward', type: 'Medical Alert', title: 'High BP', detail: 'High BP', symptoms: '', severity: 'Severe' },
  { id: 2, athlete: 'Athlete, Export test', position: 'Central Midfielder', type: 'Medical Alert', title: 'High BP - ORG A', detail: 'High BP', symptoms: '', severity: 'Severe' },
  { id: 3, athlete: 'Athlete, Inactive', position: 'Sweeper', type: 'Medical Alert', title: 'Medical Alert Org A', detail: 'Asthma', symptoms: '', severity: 'Severe' },
  { id: 4, athlete: 'Athlete, Friday', position: 'Right Back', type: 'Medical Alert', title: 'Sickle Cell - Org A', detail: 'Sickle Cell', symptoms: '', severity: 'Moderate' },
  { id: 5, athlete: 'A Test 1, Mark', position: 'Centre Forward', type: 'Allergy', title: 'ORG A allergy', detail: 'Other', symptoms: 'Allergy', severity: 'Not Specified' },
  { id: 6, athlete: 'Athlete, Export test', position: 'Central Midfielder', type: 'Allergy', title: 'Org A Chronic', detail: 'Other', symptoms: 'Allergy', severity: 'Not Specified' },
  { id: 7, athlete: 'Athlete, Inactive', position: 'Sweeper', type: 'Allergy', title: 'Org A Allergy', detail: 'Other', symptoms: 'Allergy', severity: 'Not Specified' },
  { id: 8, athlete: 'Athlete, Latest', position: 'Left Back', type: 'Allergy', title: 'Allergy - Org A', detail: 'Other', symptoms: 'Allergy', severity: 'Not Specified' },
]

export const medicalDocuments = [
  { id: 1, athlete: 'Aplayer, Org', name: 'knee-mri-2023-08-17.pdf', type: 'PDF', category: 'Imaging', source: 'Upload', date: '17 Aug 2023', by: 'Pablo de Miguel' },
  { id: 2, athlete: 'Athlete, Max', name: 'hand-xray.jpg', type: 'Image', category: 'Imaging', source: 'Scan', date: '3 Aug 2023', by: 'ST Test' },
  { id: 3, athlete: 'Athlete 7, MK Test', name: 'consent-form.pdf', type: 'PDF', category: 'Consent', source: 'Upload', date: '1 May 2023', by: 'John Roche Test' },
]

export const medicalMedications = [
  { id: 1, athlete: 'Aplayer, Org', name: 'Ibuprofen', dose: '400mg', route: 'Oral', start: '15 Aug 2023', end: '22 Aug 2023', by: 'Pablo de Miguel' },
  { id: 2, athlete: 'Athlete 7, MK Test', name: 'Levothyroxine', dose: '50mcg', route: 'Oral', start: '1 May 2023', end: '', by: 'ST Test' },
]

export const medicalForms = [
  { id: 1, athlete: 'Aplayer, Org', form: 'Return to Play', status: 'In progress', date: '18 Aug 2023', by: 'Pablo de Miguel' },
  { id: 2, athlete: 'Athlete, Max', form: 'Concussion', status: 'Complete', date: '4 Aug 2023', by: 'ST Test' },
]

// The Daily Status Report shows the same athletes as the Team tab plus the
// report's own columns, so it carries the whole row rather than a flattened copy.
export const dailyStatus = medicalTeam.map((a, i) => ({
  ...a,
  athlete: a.name,
  modification: i % 3 === 0 ? 'Modified training' : '',
  modificationDetail: i % 3 === 0 ? 'No contact work' : '',
  updatedBy: i % 2 ? 'ST Test' : 'John Roche Test',
}))

/* ------------------------------------------------- athlete profile pages */
export const athleteHeader = a => [
  ['Date of birth', '-'], ['Age', '-'], ['Country', '-'], ['Height', '-'],
  ['Status', a.status.toLowerCase()], ['Positions', 'Defender'],
  ['Team', 'U16'], ['Open injury/ illness', String(a.issues.length)],
]

export const MEDICAL_ATHLETE_TABS = [
  'Injury/ Illness', 'Notes', 'Modifications', 'Treatments', 'Diagnostics',
  'Athlete details', 'Maintenance', 'Forms', 'Medications', 'Documents',
]

export const INJURY_TABS = [
  'Illness overview', 'Rehab', 'Notes', 'Modifications', 'Treatments',
  'Diagnostics', 'Medications', 'Documents',
]

export const ATHLETE_DETAIL_FIELDS = [
  ['Blood group', 'O+'], ['NHS number', '—'], ['Insurance ID', '—'],
  ['GP name', 'Dr A Byrne'], ['GP phone', '01 555 0134'], ['Surgery', 'Riverside Practice'],
  ['Emergency contact', 'M Aplayer'], ['Relationship', 'Parent'], ['Contact phone', '087 555 0199'],
]

export const MAINTENANCE_ROWS = [
  { id: 1, item: 'Cardiac screening', last: '12 Feb 2026', next: '12 Feb 2027', status: 'Complete' },
  { id: 2, item: 'Concussion baseline', last: '3 Aug 2025', next: '3 Aug 2026', status: 'Due' },
  { id: 3, item: 'Vaccination — Tetanus', last: '20 Jan 2024', next: '20 Jan 2034', status: 'Complete' },
]

export const injuryById = () => ({
  id: 18808,
  athlete: 'Aplayer, Org',
  athleteId: 162023,
  title: 'Gout in knee',
  dateLabel: 'Date of Illness: 15 Aug 2023 (1111 days)',
  details: { Type: 'New', 'Added on': '13 Sep 2023', 'Added by': 'ST Test' },
  pathology: [
    ['Pathology', 'Gout in knee'], ['Date of injury', '15 Aug 2023'], ['Date of examination', '17 Aug 2023'],
    ['Medical System', 'Musculoskeletal'], ['Etiology', 'Immunological/inflammatory'], ['Body Area', 'Medical'],
    ['Code', 'MRYGK'], ['Side', 'Center'], ['Onset', 'Overuse'],
  ],
  availability: [
    { n: 1, range: '15 Aug 2023 - Present', status: 'Unavailable - time-loss', by: 'ST Test', duration: '1111 days' },
  ],
  summary: [['Total duration', '1111 days'], ['Total unavailability', '1111 days']],
})

export const REHAB_ROWS = [
  { id: 1, date: '18 Aug 2023', phase: 'Phase 1 — Protect', session: 'Isometric quads', by: 'Pablo de Miguel', status: 'Complete' },
  { id: 2, date: '21 Aug 2023', phase: 'Phase 2 — Restore', session: 'Range of motion', by: 'Pablo de Miguel', status: 'Complete' },
  { id: 3, date: '25 Aug 2023', phase: 'Phase 2 — Restore', session: 'Closed chain strength', by: 'ST Test', status: 'Planned' },
]
