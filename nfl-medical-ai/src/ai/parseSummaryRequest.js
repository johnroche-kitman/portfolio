import { findAthleteMention } from '../data/athletes'
import { extractAthleteNameMention } from './textHelpers'

// Injury-summary requests only need an athlete resolved — everything else
// in the summary is derived from existing records, not dictated.
export function parseSummaryRequest(text, { athletes } = { athletes: [] }) {
  const trimmed = (text || '').trim()
  const athlete = findAthleteMention(trimmed, athletes)

  return {
    rawText: trimmed,
    athleteId: athlete?.id || null,
    athleteName: athlete?.name || extractAthleteNameMention(trimmed),
  }
}
