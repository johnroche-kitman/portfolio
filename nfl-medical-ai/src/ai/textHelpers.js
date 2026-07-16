// Shared plain-text helpers for the rule-based dictation parsers.

export function extractAthleteNameMention(text) {
  const match = (text || '').match(/for ([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/)
  return match ? match[1] : null
}

export function tokenize(text) {
  return (text || '').toLowerCase().match(/[a-z]+/g) || []
}

// Truncates to a short stem so minor mis-transcriptions (e.g. "sprang" for
// "sprain") still line up when comparing dictation tokens to injury tokens.
export function stem(word) {
  return word.length > 4 ? word.slice(0, 4) : word
}

export function todayLabel() {
  const now = new Date()
  return now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
