import { resolveAthleteMatch } from '../data/athletes'
import { extractAthleteNameMention } from './textHelpers'

// Injury-summary requests only need an athlete resolved — everything else
// in the summary is derived from existing records, not dictated.
export function parseSummaryRequest(text, { athletes } = { athletes: [] }) {
  const trimmed = (text || '').trim()
  const athleteMatch = resolveAthleteMatch(trimmed, athletes)
  const athlete = athleteMatch?.athlete || null

  return {
    rawText: trimmed,
    athleteId: athlete?.id || null,
    athleteName: athlete?.name || extractAthleteNameMention(trimmed),
    athleteCandidates: athleteMatch?.candidates || null,
  }
}
