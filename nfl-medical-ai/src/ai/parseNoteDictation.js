import { findAthleteMention } from '../data/athletes'
import { extractAthleteNameMention, tokenize, stem, todayLabel } from './textHelpers'

// Strips the routing command ("Update note for X ankle sprain.") off the
// front of the dictation, leaving the clinical narrative as the note body.
const COMMAND_PREFIX = /^\s*(update|add)\s+(a\s+)?note\s+(for|to)\s+.+?[.!?]\s*/i
const SAYING_SPLIT = /\bsaying\b[:,]?\s*(.+)/i
const TITLE_PATTERN = /titled?\s*:?\s*"([^"]+)"/i

// Real dictation often has no punctuation at all, so a period-anchored strip
// won't fire. "saying ..." is a common natural way to introduce the actual
// note content, so prefer that split when present.
function stripCommandPrefix(text) {
  const sayingMatch = text.match(SAYING_SPLIT)
  if (sayingMatch) return sayingMatch[1].trim()
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
  const athlete = findAthleteMention(trimmed, athletes)
  const athleteName = athlete?.name || extractAthleteNameMention(trimmed)

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
