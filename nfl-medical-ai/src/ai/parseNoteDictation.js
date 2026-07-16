import { findAthleteByName } from '../data/athletes'
import { extractAthleteNameMention, tokenize, stem, todayLabel } from './textHelpers'

// Strips the routing command ("Update note for X ankle sprain.") off the
// front of the dictation, leaving the clinical narrative as the note body.
const COMMAND_PREFIX = /^\s*(update|add)\s+(a\s+)?note\s+for\s+.+?[.!?]\s*/i
const TITLE_PATTERN = /titled?\s*:?\s*"([^"]+)"/i

function stripCommandPrefix(text) {
  return text.replace(COMMAND_PREFIX, '').trim()
}

function scoreInjuryMatch(injury, noteStems) {
  const injuryTokens = tokenize(`${injury.label} ${injury.pathology || ''} ${injury.bodyArea || ''}`).filter(
    (t) => t.length > 2
  )
  const injuryStems = new Set(injuryTokens.map(stem))
  let score = 0
  injuryStems.forEach((s) => {
    if (noteStems.has(s)) score += 1
  })
  return score
}

// Exported so the AI panel can re-run injury matching once an athlete is
// resolved conversationally (e.g. after asking "who is this note for?").
export function matchInjuryForAthlete(text, athleteId, injuries) {
  const athleteInjuries = injuries.filter((inj) => inj.athleteId === athleteId && inj.status !== 'pending_review')
  const noteStems = new Set(tokenize(text).map(stem))

  let matched = null
  let bestScore = 0
  athleteInjuries.forEach((inj) => {
    const score = scoreInjuryMatch(inj, noteStems)
    if (score > bestScore) {
      bestScore = score
      matched = inj
    }
  })
  return matched
}

export function extractDictatedTitle(text) {
  const titleMatch = (text || '').match(TITLE_PATTERN)
  return titleMatch ? titleMatch[1].trim() : null
}

export function parseNoteDictation(text, { athletes, injuries } = { athletes: [], injuries: [] }) {
  const trimmed = (text || '').trim()
  const athleteName = extractAthleteNameMention(trimmed)
  const athlete = findAthleteByName(athleteName, athletes)

  const dictatedTitle = extractDictatedTitle(trimmed)
  const matchedInjury = athlete ? matchInjuryForAthlete(trimmed, athlete.id, injuries) : null
  const injuryLabel = matchedInjury ? matchedInjury.pathology || matchedInjury.label : null
  const noteBody = stripCommandPrefix(trimmed)
  const today = todayLabel()

  return {
    rawText: trimmed,
    athleteId: athlete?.id || null,
    athleteName: athlete?.name || athleteName,
    injuryId: matchedInjury?.id || null,
    injuryLabel,
    title: dictatedTitle,
    placeholderTitle: injuryLabel ? `${injuryLabel} progress note` : 'Progress note',
    noteText: noteBody || trimmed,
    addedOn: today,
  }
}
