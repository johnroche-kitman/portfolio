const NOTE_INTENT_PATTERN = /^\s*(update|add)\s+(a\s+)?note\b/i
const REHAB_INTENT_PATTERN = /\brehab(ilitation)?\s+(program|plan|session)\b|\bcreate\s+(a\s+)?(new\s+)?rehab\b/i
const SUMMARY_INTENT_PATTERN = /\bsummar(y|ize|ise)\b.{0,60}\binjur(y|ies)\b|\binjur(y|ies)\b.{0,60}\bsummar(y|ize|ise)\b/i

// Routes free-form dictation to the right parser. Defaults to the injury
// flow, since that's the more common/first-built action.
export function detectDictationIntent(text) {
  if (SUMMARY_INTENT_PATTERN.test(text || '')) return 'summary'
  if (REHAB_INTENT_PATTERN.test(text || '')) return 'rehab'
  if (NOTE_INTENT_PATTERN.test(text || '')) return 'note'
  return 'injury'
}
