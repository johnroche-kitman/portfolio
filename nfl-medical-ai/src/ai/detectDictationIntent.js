const NOTE_INTENT_PATTERN = /^\s*(update|add)\s+(a\s+)?note\b/i

// Routes free-form dictation to the right parser. Defaults to the injury
// flow, since that's the more common/first-built action.
export function detectDictationIntent(text) {
  return NOTE_INTENT_PATTERN.test(text || '') ? 'note' : 'injury'
}
