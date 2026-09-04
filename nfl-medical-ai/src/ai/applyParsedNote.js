// Turns a parsed "update note" dictation into a pending note via
// AppDataContext, and produces the plain-language recap for the AI panel.
export function applyParsedNote(parsed, { createNoteFromParsed }) {
  if (!parsed.athleteId) {
    return {
      ok: false,
      error: parsed.athleteName
        ? `I couldn't find an athlete named "${parsed.athleteName}" on the squad.`
        : "I couldn't tell which athlete this note is for. Try including their full name.",
    }
  }

  if (!parsed.injuryId) {
    return {
      ok: false,
      error: `I found ${parsed.athleteName}, but couldn't tell which injury this note is for. Try mentioning the body part or condition, e.g. "ankle sprain".`,
    }
  }

  const note = createNoteFromParsed(parsed)

  const summaryLines = [
    `Created a new note for ${parsed.athleteName}'s ${parsed.injuryLabel}.`,
    `Title: "${note.title}".`,
    'Transcribed your note as dictated.',
    'Saved this note to the review queue for your approval.',
  ]

  return { ok: true, note, summaryLines }
}
