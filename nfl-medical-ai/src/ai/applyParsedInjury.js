// Turns a parsed dictation into an injury record via AppDataContext, and produces
// the plain-language recap shown in the AI panel's confirmation step.
export function applyParsedInjury(parsed, { createInjuryFromParsed }) {
  if (!parsed.athleteId) {
    return {
      ok: false,
      error: parsed.athleteName
        ? `I couldn't find an athlete named "${parsed.athleteName}" on the roster.`
        : "I couldn't tell which athlete this injury is for. Try including their full name.",
    }
  }

  const injury = createInjuryFromParsed(parsed)
  const answeredCount = Object.keys(injury.backgroundScreen || {}).length

  const summaryLines = [
    `Created a new injury for ${parsed.athleteName}.`,
    'Added an initial note from your dictation.',
    `Set the injury date and examination date to ${injury.date || injury.addedOn}.`,
    parsed.pathology ? `Updated pathology to "${parsed.pathology}".` : null,
    answeredCount
      ? `Answered ${answeredCount} background screen question${answeredCount === 1 ? '' : 's'}.`
      : null,
    'Saved this injury to the review queue for your approval.',
  ].filter(Boolean)

  return { ok: true, injury, summaryLines }
}
