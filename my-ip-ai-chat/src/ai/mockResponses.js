// Canned Ask My iP responses, keyed by agent then by the exact question text
// (case-insensitive). Falls back to a generic per-agent answer for anything
// typed that doesn't match a curated question, so the panel never dead-ends.

const RESPONSES = {
  'performance-medicine': {
    'what are the top injury types that occurred this season?': {
      text:
        'Across all monitored squads this season, lower-extremity injuries (ankle sprains, muscle strains, and growth-plate apophysis) account for 68% of all recorded medical incidents.\n\nHowever, injury profile types shift significantly with age:\n• U9–U10: Dominated by acute impact injuries (contusions and wrist/forearm sprains from falls).\n• U11–U12: Dominated by traction/growth-plate overuse conditions (Sever’s disease and Osgood-Schlatter) triggered by peak height velocity and increased training loads.\n• U16: Dominated by high-velocity soft tissue strains (hamstrings/quadriceps) and contact-related injuries (concussions, ligament sprains).',
      openInExplore: true,
      table: {
        columns: ['Squad', 'Primary injury type', '% of squad total'],
        rows: [
          ['U9', 'Wrist / forearm sprains & contusions', '38'],
          ['U10', 'Acute ankle inversion sprains', '32'],
          ['U11', "Calcaneal apophysitis (Sever's disease)", '33'],
          ['U12', 'Patellar tendinopathy / Osgood-Schlatter', '31'],
          ['U13', 'Hamstring & quadriceps strains', '28'],
        ],
      },
    },
    default: {
      text: '6 athletes are currently unavailable due to injury across the squad, 4 of whom are in the final stage of rehab and expected back within 2 weeks.',
    },
  },
  'sessions-and-games': {
    'what were the results of the last 10 games for u16 squad?': {
      text: 'U16 have won 6 of their last 10 fixtures, with the strongest run of form coming at home where they remain unbeaten across the last 5 games.',
      table: {
        columns: ['Date', 'Opponent', 'Venue', 'Result'],
        rows: [
          ['12 Jul', 'Riverside FC', 'Home', 'W 3–1'],
          ['19 Jul', 'Oakfield United', 'Away', 'L 0–2'],
          ['26 Jul', 'Charlton Youth', 'Home', 'W 2–0'],
          ['2 Aug', 'Meridian Academy', 'Away', 'D 1–1'],
          ['9 Aug', 'Northgate FC', 'Home', 'W 4–2'],
        ],
      },
    },
    default: {
      text: 'This week the squad has completed 5 sessions and 1 fixture, with average session RPE tracking slightly below the 4-week rolling average.',
    },
  },
  'gps-vendor-data': {
    'what athlete has the highest total distance this week?': {
      text: 'Jordan Pierce has covered the highest total distance this week across all tracked athletes, driven by two high-volume training days ahead of Saturday’s fixture.',
      table: {
        columns: ['Athlete', 'Position', 'Total distance (km)', 'Max speed (km/h)'],
        rows: [
          ['Jordan Pierce', 'Winger', '48.2', '32.6'],
          ['Sam Whitfield', 'Full-back', '45.7', '31.1'],
          ['Alex Romero', 'Midfielder', '44.9', '29.8'],
          ['Chris Doyle', 'Winger', '43.1', '33.2'],
        ],
      },
    },
    default: {
      text: 'Yes, the latest export from your GPS vendor finished syncing 4 hours ago. All 28 tracked athletes have complete session data for this week.',
    },
  },
}

export function getMockResponse(agentKey, question) {
  const agentResponses = RESPONSES[agentKey] || RESPONSES['performance-medicine']
  const key = (question || '').trim().toLowerCase()
  return agentResponses[key] || agentResponses.default
}

// Short auto-generated conversation titles, keyed the same way as responses.
const TITLES = {
  'what are the top injury types that occurred this season?': 'Injury type details',
  'what were the results of the last 10 games for u16 squad?': 'U16 recent results',
  'what athlete has the highest total distance this week?': 'Highest weekly distance',
}

export function getMockTitle(question) {
  const key = (question || '').trim().toLowerCase()
  if (TITLES[key]) return TITLES[key]
  const trimmed = (question || '').trim()
  return trimmed.length > 42 ? `${trimmed.slice(0, 42)}…` : trimmed || 'New chat'
}
