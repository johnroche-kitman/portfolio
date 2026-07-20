const NOTE_INTENT_PATTERN = /^\s*(update|add)\s+(a\s+)?note\b/i
const REHAB_INTENT_PATTERN = /\brehab(ilitation)?\s+(program|plan|session)\b|\bcreate\s+(a\s+)?(new\s+)?rehab\b/i
const SUMMARY_INTENT_PATTERN = /\bsummar(y|ize|ise)\b.{0,60}\binjur(y|ies)\b|\binjur(y|ies)\b.{0,60}\bsummar(y|ize|ise)\b/i

// Routes free-form dictation to the right parser. Defaults to the injury
// flow, since that's the more common/first-built action.
//
// NOTE_INTENT_PATTERN is checked first because it's anchored to the start of
// the text ("update/add note...") — an explicit, deliberate command. The
// rehab/summary patterns match loosely anywhere in the text (e.g. "rehab
// plan", "rehab program"), which can appear inside a note's narrative body
// ("will follow the rehab plan") without the dictation actually being a
// rehab request — the anchored note command should win in that case.
export function detectDictationIntent(text) {
  if (NOTE_INTENT_PATTERN.test(text || '')) return 'note'
  if (SUMMARY_INTENT_PATTERN.test(text || '')) return 'summary'
  if (REHAB_INTENT_PATTERN.test(text || '')) return 'rehab'
  return 'injury'
}
