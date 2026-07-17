const NOTE_INTENT_PATTERN = /^\s*(update|add)\s+(a\s+)?note\b/i
const REHAB_INTENT_PATTERN = /\brehab(ilitation)?\s+(program|plan|session)\b|\bcreate\s+(a\s+)?(new\s+)?rehab\b/i

// Routes free-form dictation to the right parser. Defaults to the injury
// flow, since that's the more common/first-built action.
export function detectDictationIntent(text) {
  if (REHAB_INTENT_PATTERN.test(text || '')) return 'rehab'
  if (NOTE_INTENT_PATTERN.test(text || '')) return 'note'
  return 'injury'
}
