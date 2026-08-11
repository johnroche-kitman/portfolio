// Seed conversation history shown in the panel's History view / expanded sidebar.
// Each entry is a fully-formed chat so selecting it from history re-opens the
// original question and answer, same as picking up a real past conversation.
export const SEED_HISTORY = [
  {
    id: 'seed-1',
    title: 'What position has the most injuries?',
    agentKey: 'performance-medicine',
    messages: [
      { id: 'seed-1-q', role: 'user', text: 'What position has the most injuries?' },
      {
        id: 'seed-1-a',
        role: 'assistant',
        text: 'Centre-backs have recorded the highest injury count this season, driven mainly by muscular strains from repeated high-speed decelerations during defensive duels.',
      },
    ],
  },
  {
    id: 'seed-2',
    title: '3rd party data question',
    agentKey: 'gps-vendor-data',
    messages: [
      { id: 'seed-2-q', role: 'user', text: 'Has this week’s GPS vendor export finished syncing?' },
      {
        id: 'seed-2-a',
        role: 'assistant',
        text: 'Yes, the latest export from your GPS vendor finished syncing 4 hours ago. All 28 tracked athletes have complete session data for this week.',
      },
    ],
  },
  {
    id: 'seed-3',
    title: 'Medical data question',
    agentKey: 'performance-medicine',
    messages: [
      { id: 'seed-3-q', role: 'user', text: 'How many athletes are currently unavailable due to injury?' },
      {
        id: 'seed-3-a',
        role: 'assistant',
        text: '6 athletes are currently unavailable due to injury across the squad, 4 of whom are in the final stage of rehab and expected back within 2 weeks.',
      },
    ],
  },
]
