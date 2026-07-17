import { findAthleteMention } from '../data/athletes'
import { matchInjuryForAthlete } from './parseNoteDictation'
import { extractAthleteNameMention, todayKey } from './textHelpers'

// Splits off the routing/header clause ("...should consist of / include ...")
// so only the actual exercise list gets parsed into clauses.
const EXERCISE_LIST_MARKER = /\b(?:should\s+)?(?:consists?\s+of|consisting\s+of|includ(?:e|ing)|compris(?:e|ing))\b[:,]?\s*(.+)/i
const SET_REP_PATTERN = /(\d+)\s*sets?\s*of\s*(\d+)/i
const LEADING_CONJUNCTION = /^(and\s+then\s+|and\s+|then\s+|also\s+add\s+|also\s+|please\s+add\s+|add\s+)/i

function titleCase(str) {
  return str
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// A single exercise clause may mention more than one set/rep scheme (e.g.
// "1 set of 30 and 3 sets of 15") — we take the first, which covers the
// common case without needing a compound sets/reps display model.
function parseExerciseClause(rawClause) {
  const clause = rawClause.replace(LEADING_CONJUNCTION, '').trim().replace(/[.!?]+$/, '')
  if (!clause) return null
  const match = clause.match(SET_REP_PATTERN)
  if (!match) return null
  const namePart = clause
    .slice(0, match.index)
    .replace(/\bfor\s*$/i, '')
    .trim()
  if (!namePart) return null
  return {
    name: titleCase(namePart),
    sets: match[1],
    reps: match[2],
  }
}

export function extractExercises(text) {
  const trimmed = (text || '').trim()
  const marker = trimmed.match(EXERCISE_LIST_MARKER)
  const exerciseText = marker ? marker[1] : trimmed
  return exerciseText
    .split(/,\s*/)
    .map(parseExerciseClause)
    .filter(Boolean)
}

export function parseRehabDictation(text, { athletes, injuries } = { athletes: [], injuries: [] }) {
  const trimmed = (text || '').trim()
  const athlete = findAthleteMention(trimmed, athletes)
  const athleteName = athlete?.name || extractAthleteNameMention(trimmed)
  const matchedInjury = athlete ? matchInjuryForAthlete(trimmed, athlete.id, injuries) : null
  const injuryLabel = matchedInjury ? matchedInjury.pathology || matchedInjury.label : null
  const exercises = extractExercises(trimmed)

  return {
    rawText: trimmed,
    athleteId: athlete?.id || null,
    athleteName,
    injuryId: matchedInjury?.id || null,
    injuryLabel,
    exercises,
    date: todayKey(),
  }
}
