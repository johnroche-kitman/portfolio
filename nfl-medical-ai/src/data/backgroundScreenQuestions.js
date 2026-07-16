// The fixed Background screen question set shown on the Injury overview page.
// Each question can optionally be auto-answered by the AI parser via `infer(parsed)`.
export const backgroundScreenQuestions = [
  {
    id: 'reportedWhen',
    question: 'When was the injury reported',
    infer: (parsed) => (parsed.reportedImmediately ? 'Immediately' : null),
  },
  {
    id: 'removedFromParticipation',
    question: 'At the time of onset was the player removed from participation',
    infer: (parsed) =>
      parsed.removedFromParticipation
        ? `Yes, player was removed and did not return to the ${parsed.sessionType || 'session'}`
        : null,
  },
  {
    id: 'primaryMechanismType',
    question: 'Primary mechanism type',
    infer: (parsed) => {
      if (!parsed.mechanismType) return null
      return parsed.mechanismType === 'contact'
        ? 'Direct contact: to injured body part or immediately above/below injury body part'
        : 'Non-contact: no direct contact identified'
    },
  },
  {
    id: 'modeOfOnset',
    question: 'Mode of onset',
    infer: (parsed) => {
      if (!parsed.mechanismType) return null
      return parsed.mechanismType === 'contact' ? 'Contact' : 'Non-contact'
    },
  },
  {
    id: 'sideOfInjury',
    question: 'Side',
    infer: (parsed) => (parsed.side ? parsed.side : null),
  },
  {
    id: 'symptomsPresent',
    question: 'Symptoms present',
    infer: (parsed) => (parsed.symptoms?.length ? parsed.symptoms.join(', ') : null),
  },
]
