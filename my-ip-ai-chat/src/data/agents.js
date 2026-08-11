export const AGENTS = [
  {
    key: 'sessions-and-games',
    label: 'Sessions and games',
    icon: 'sessions',
    example: 'What were the results of the last 10 games for U16 squad?',
    placeholder: 'Ask about sessions and games',
    thinkingText: 'Checking session data. It might take a few seconds…',
  },
  {
    key: 'performance-medicine',
    label: 'Performance medicine',
    icon: 'medicalBag',
    example: 'What are the top injury types that occurred this season?',
    placeholder: 'Ask about performance medicine',
    thinkingText: 'Checking medical data. It might take a few seconds…',
  },
  {
    key: 'gps-vendor-data',
    label: 'GPS vendor data',
    icon: 'cloud',
    example: 'What athlete has the highest total distance this week?',
    placeholder: 'Ask about GPS vendor data',
    thinkingText: 'Checking vendor data. It might take a few seconds…',
  },
]

export function getAgent(key) {
  return AGENTS.find((agent) => agent.key === key) || AGENTS[0]
}
