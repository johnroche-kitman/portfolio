// Turns a parsed "create a rehab program" dictation into a pending rehab
// program via AppDataContext, and produces the plain-language recap for the
// AI panel.
export function applyParsedRehab(parsed, { createRehabFromParsed }) {
  if (!parsed.athleteId) {
    return {
      ok: false,
      error: parsed.athleteName
        ? `I couldn't find an athlete named "${parsed.athleteName}" on the roster.`
        : "I couldn't tell which athlete this rehab program is for. Try including their full name.",
    }
  }

  if (!parsed.injuryId) {
    return {
      ok: false,
      error: `I found ${parsed.athleteName}, but couldn't tell which injury this rehab program is for. Try mentioning the body part or condition, e.g. "ankle sprain".`,
    }
  }

  if (!parsed.exercises?.length) {
    return {
      ok: false,
      error: `I found ${parsed.athleteName}'s ${parsed.injuryLabel}, but couldn't make out any exercises. Try phrasing like "squats for 3 sets of 10".`,
    }
  }

  const rehab = createRehabFromParsed(parsed)
  const exerciseNames = rehab.exercises.map((e) => e.name).join(', ')

  const summaryLines = [
    `Created a new rehab program for ${parsed.athleteName}'s ${parsed.injuryLabel}.`,
    'Scheduled for today.',
    `Added ${rehab.exercises.length} exercise${rehab.exercises.length === 1 ? '' : 's'}: ${exerciseNames}.`,
    'Saved this rehab program to the review queue for your approval.',
  ]

  return { ok: true, rehab, summaryLines }
}
