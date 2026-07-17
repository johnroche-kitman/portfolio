// Shared plain-text helpers for the rule-based dictation parsers.

// Best-effort fallback for display purposes only (e.g. "couldn't find an
// athlete matching ..."), used when no roster name was found in the text.
// Case-insensitive and accepts "for"/"to" since real dictation is often all
// lowercase and doesn't reliably use one fixed connector word.
export function extractAthleteNameMention(text) {
  const match = (text || '').match(/\b(?:for|to)\s+([A-Za-z]+(?:\s[A-Za-z]+){0,2})/i)
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

// ISO yyyy-mm-dd key for a given Date, used where real calendar-day equality
// checks are needed (e.g. lining up a rehab program with its day column).
export function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function todayKey() {
  return dateKey(new Date())
}
