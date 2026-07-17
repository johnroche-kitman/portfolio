import { useEffect, useRef, useState } from 'react'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import { useNavigate } from 'react-router-dom'
import Icon from '../Icon'
import AiSuggestedActions from './AiSuggestedActions'
import AiDictationInput from './AiDictationInput'
import AiChatMessage from './AiChatMessage'
import { parseInjuryDictation, describeParsedInjury } from '../../ai/parseInjuryDictation'
import { applyParsedInjury } from '../../ai/applyParsedInjury'
import { parseNoteDictation, matchInjuryForAthlete } from '../../ai/parseNoteDictation'
import { applyParsedNote } from '../../ai/applyParsedNote'
import { parseRehabDictation, extractExercises } from '../../ai/parseRehabDictation'
import { applyParsedRehab } from '../../ai/applyParsedRehab'
import { parseSummaryRequest } from '../../ai/parseSummaryRequest'
import { detectDictationIntent } from '../../ai/detectDictationIntent'
import { resolveAthleteMatch } from '../../data/athletes'
import { useAppData } from '../../state/AppDataContext'
import InjurySummaryModal from '../injury/InjurySummaryModal'

const PANEL_WIDTH = 420

const NOUN_BY_TYPE = { note: 'note', injury: 'injury', rehab: 'rehab program' }
const ANOTHER_LABEL_BY_TYPE = {
  note: 'Add another note for someone else',
  injury: 'Log another injury for someone else',
  rehab: 'Add another rehab for someone else',
}

// Clicking a popular-action suggestion asks a conversational follow-up
// instead of prefilling the dictation box — the reply is parsed the same
// way a fresh dictation of that type would be.
const SUGGESTION_FOLLOWUPS = {
  'log-injury': {
    kind: 'awaiting-details-for-injury',
    question: 'Sure — who is the injury for, and what type of injury is it?',
  },
  'add-note': {
    kind: 'awaiting-details-for-note',
    question: 'Sure — who is the note for, and which injury does it relate to?',
  },
  'create-rehab': {
    kind: 'awaiting-details-for-rehab',
    question: 'Sure — who is this rehab program for, which injury does it relate to, and what exercises would you like to include?',
  },
  'injury-summary': {
    kind: 'awaiting-details-for-summary',
    question: 'Sure — who would you like an injury summary for?',
  },
}

function injuryOption(inj) {
  return `${inj.date} — ${inj.pathology || inj.label}`
}

export default function AiPanel({ open, onClose }) {
  const [messages, setMessages] = useState([])
  const [pendingAction, setPendingAction] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [summaryAthleteId, setSummaryAthleteId] = useState(null)
  const scrollRef = useRef(null)
  const idCounter = useRef(0)
  const navigate = useNavigate()

  const {
    athletes,
    injuries,
    getAthleteById,
    getInjuriesByAthlete,
    createInjuryFromParsed,
    createNoteFromParsed,
    addNoteToInjury,
    appendToPendingNote,
    createRehabFromParsed,
    appendToPendingRehab,
  } = useAppData()

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  function pushMessage(role, payload) {
    idCounter.current += 1
    setMessages((prev) => [...prev, { id: `msg-${idCounter.current}`, role, ...payload }])
  }

  function selectFollowUp(label, action) {
    pushMessage('user', { text: label })
    action()
  }

  function goToQueue() {
    navigate('/medical/review-queue')
    handleClose()
  }

  function startAddMoreDetail(resultType, targetId) {
    setPendingAction({ kind: 'awaiting-more-detail', resultType, targetId })
    pushMessage('assistant', { text: 'Sure, what would you like to add?' })
  }

  function followUpOptions(resultType, targetId) {
    const noun = NOUN_BY_TYPE[resultType] || resultType
    return [
      {
        label: `Add more information to this ${noun}`,
        onSelect: () =>
          selectFollowUp(`Add more information to this ${noun}`, () => startAddMoreDetail(resultType, targetId)),
      },
      {
        label: ANOTHER_LABEL_BY_TYPE[resultType],
        onSelect: () => selectFollowUp(ANOTHER_LABEL_BY_TYPE[resultType], () => setPendingAction(null)),
      },
      {
        label: 'Go to my review queue',
        tone: 'primary',
        onSelect: () => selectFollowUp('Go to my review queue', goToQueue),
      },
    ]
  }

  function finalizeInjury(parsed) {
    const outcome = applyParsedInjury(parsed, { createInjuryFromParsed })
    setPendingAction(null)
    if (!outcome.ok) {
      pushMessage('assistant', { text: outcome.error, tone: 'error' })
      return
    }
    pushMessage('assistant', { lines: outcome.summaryLines, options: followUpOptions('injury', outcome.injury.id) })
  }

  function finalizeNote(parsed) {
    const outcome = applyParsedNote(parsed, { createNoteFromParsed })
    setPendingAction(null)
    if (!outcome.ok) {
      pushMessage('assistant', { text: outcome.error, tone: 'error' })
      return
    }
    pushMessage('assistant', { lines: outcome.summaryLines, options: followUpOptions('note', outcome.note.id) })
  }

  function finalizeRehab(parsed) {
    const outcome = applyParsedRehab(parsed, { createRehabFromParsed })
    setPendingAction(null)
    if (!outcome.ok) {
      pushMessage('assistant', { text: outcome.error, tone: 'error' })
      return
    }
    pushMessage('assistant', { lines: outcome.summaryLines, options: followUpOptions('rehab', outcome.rehab.id) })
  }

  function askWhichInjury(parsed, athlete, kind, finalize) {
    const candidates = getInjuriesByAthlete(athlete.id).filter((inj) => inj.status !== 'pending_review')
    if (!candidates.length) {
      setPendingAction(null)
      pushMessage('assistant', {
        text: `${athlete.name} doesn't have any recorded injuries yet, so I can't attach that to one. Want to log a new injury instead?`,
      })
      return
    }
    setPendingAction({ kind, parsed, athlete, candidates })
    const verb = kind === 'awaiting-injury-for-rehab' ? 'create a rehab program for' : 'add a note for'
    pushMessage('assistant', {
      text: `I can ${verb} ${athlete.name}, but which injury does it relate to? Pick one below, or describe it (e.g. "ankle sprain").`,
      options: candidates.map((inj) => ({
        label: injuryOption(inj),
        onSelect: () =>
          selectFollowUp(injuryOption(inj), () => finalize({ ...parsed, injuryId: inj.id, injuryLabel: inj.pathology || inj.label })),
      })),
    })
  }

  // A bare first/last name can match more than one roster athlete (e.g. two
  // "Tyler"s) — offer a picker instead of guessing, then resume whichever
  // flow asked for the athlete in the first place.
  function askWhichAthlete(parsed, candidates, kind) {
    setPendingAction({ kind, parsed, candidates })
    pushMessage('assistant', {
      text: `A few athletes match that — who do you mean?`,
      options: candidates.map((athlete) => ({
        label: athlete.name,
        onSelect: () => selectFollowUp(athlete.name, () => resolveAthleteChoice(kind, parsed, athlete)),
      })),
    })
  }

  function resolveAthleteChoice(kind, parsed, athlete) {
    const merged = { ...parsed, athleteId: athlete.id, athleteName: athlete.name, athleteCandidates: null }
    if (kind === 'awaiting-athlete-choice-for-injury') proceedInjury(merged)
    else if (kind === 'awaiting-athlete-choice-for-note') proceedNote(merged)
    else if (kind === 'awaiting-athlete-choice-for-rehab') proceedRehab(merged)
    else if (kind === 'awaiting-athlete-choice-for-summary') proceedSummary(merged)
  }

  function proceedInjury(parsed) {
    if (parsed.athleteCandidates?.length) {
      askWhichAthlete(parsed, parsed.athleteCandidates, 'awaiting-athlete-choice-for-injury')
      return
    }
    if (!parsed.athleteId) {
      setPendingAction({ kind: 'awaiting-athlete-for-injury', parsed })
      const known = describeParsedInjury(parsed)
      pushMessage('assistant', {
        text: `I can log ${known ? `${known}, ` : 'a new injury, '}but I need to know which athlete it's for. Who is this for?`,
      })
      return
    }
    finalizeInjury(parsed)
  }

  function proceedNote(parsed) {
    if (parsed.athleteCandidates?.length) {
      askWhichAthlete(parsed, parsed.athleteCandidates, 'awaiting-athlete-choice-for-note')
      return
    }
    if (!parsed.athleteId) {
      setPendingAction({ kind: 'awaiting-athlete-for-note', parsed })
      pushMessage('assistant', { text: "I can add a note, but I need to know which athlete it's for. Who is this for?" })
      return
    }
    const athlete = getAthleteById(parsed.athleteId)
    if (!parsed.injuryId) {
      askWhichInjury(parsed, athlete, 'awaiting-injury-for-note', finalizeNote)
      return
    }
    finalizeNote(parsed)
  }

  function proceedRehab(parsed) {
    if (parsed.athleteCandidates?.length) {
      askWhichAthlete(parsed, parsed.athleteCandidates, 'awaiting-athlete-choice-for-rehab')
      return
    }
    if (!parsed.athleteId) {
      setPendingAction({ kind: 'awaiting-athlete-for-rehab', parsed })
      pushMessage('assistant', {
        text: "I can create a rehab program, but I need to know which athlete it's for. Who is this for?",
      })
      return
    }
    const athlete = getAthleteById(parsed.athleteId)
    if (!parsed.injuryId) {
      askWhichInjury(parsed, athlete, 'awaiting-injury-for-rehab', finalizeRehab)
      return
    }
    if (!parsed.exercises?.length) {
      setPendingAction({ kind: 'awaiting-exercises-for-rehab', parsed })
      pushMessage('assistant', {
        text: `I can create a rehab program for ${athlete.name}'s ${parsed.injuryLabel}, but I couldn't make out any exercises. Try phrasing like "squats for 3 sets of 10".`,
      })
      return
    }
    finalizeRehab(parsed)
  }

  function proceedSummary(parsed) {
    if (parsed.athleteCandidates?.length) {
      askWhichAthlete(parsed, parsed.athleteCandidates, 'awaiting-athlete-choice-for-summary')
      return
    }
    if (!parsed.athleteId) {
      setPendingAction({ kind: 'awaiting-athlete-for-summary', parsed })
      pushMessage('assistant', { text: "I can generate an injury summary, but who is this for?" })
      return
    }
    const athlete = getAthleteById(parsed.athleteId)
    const athleteInjuries = getInjuriesByAthlete(athlete.id).filter((inj) => inj.status !== 'pending_review')
    setPendingAction(null)
    if (!athleteInjuries.length) {
      pushMessage('assistant', {
        text: `${athlete.name} doesn't have any recorded injuries yet, so there's nothing to summarize.`,
      })
      return
    }
    pushMessage('assistant', {
      lines: [
        `Generated an injury summary for ${athlete.name}.`,
        `Covers ${athleteInjuries.length} injur${athleteInjuries.length === 1 ? 'y' : 'ies'} in reverse chronological order, with diagnostics, rehab session counts, and medications.`,
      ],
      options: [
        {
          label: `Open ${athlete.name}'s injury summary`,
          tone: 'primary',
          icon: 'openInNew',
          onSelect: () =>
            selectFollowUp(`Open ${athlete.name}'s injury summary`, () => setSummaryAthleteId(athlete.id)),
        },
      ],
    })
  }

  function processInput(text) {
    if (pendingAction?.kind === 'awaiting-details-for-injury') {
      proceedInjury(parseInjuryDictation(text, { athletes }))
      return
    }

    if (pendingAction?.kind === 'awaiting-details-for-note') {
      proceedNote(parseNoteDictation(text, { athletes, injuries }))
      return
    }

    if (pendingAction?.kind === 'awaiting-details-for-rehab') {
      proceedRehab(parseRehabDictation(text, { athletes, injuries }))
      return
    }

    if (pendingAction?.kind === 'awaiting-details-for-summary') {
      proceedSummary(parseSummaryRequest(text, { athletes }))
      return
    }

    if (pendingAction?.kind === 'awaiting-athlete-for-injury') {
      const match = resolveAthleteMatch(text, athletes)
      if (!match) {
        pushMessage('assistant', { text: `I still couldn't find an athlete matching "${text}" on the roster. Who is this injury for?` })
        return
      }
      if (match.candidates) {
        askWhichAthlete(pendingAction.parsed, match.candidates, 'awaiting-athlete-choice-for-injury')
        return
      }
      finalizeInjury({ ...pendingAction.parsed, athleteId: match.athlete.id, athleteName: match.athlete.name })
      return
    }

    if (pendingAction?.kind === 'awaiting-athlete-for-note') {
      const match = resolveAthleteMatch(text, athletes)
      if (!match) {
        pushMessage('assistant', { text: `I still couldn't find an athlete matching "${text}" on the roster. Who is this note for?` })
        return
      }
      if (match.candidates) {
        askWhichAthlete(pendingAction.parsed, match.candidates, 'awaiting-athlete-choice-for-note')
        return
      }
      const merged = { ...pendingAction.parsed, athleteId: match.athlete.id, athleteName: match.athlete.name }
      const matchedInjury = matchInjuryForAthlete(merged.rawText, match.athlete.id, injuries)
      if (matchedInjury) {
        merged.injuryId = matchedInjury.id
        merged.injuryLabel = matchedInjury.pathology || matchedInjury.label
      }
      proceedNote(merged)
      return
    }

    if (pendingAction?.kind === 'awaiting-athlete-for-rehab') {
      const match = resolveAthleteMatch(text, athletes)
      if (!match) {
        pushMessage('assistant', {
          text: `I still couldn't find an athlete matching "${text}" on the roster. Who is this rehab program for?`,
        })
        return
      }
      if (match.candidates) {
        askWhichAthlete(pendingAction.parsed, match.candidates, 'awaiting-athlete-choice-for-rehab')
        return
      }
      const merged = { ...pendingAction.parsed, athleteId: match.athlete.id, athleteName: match.athlete.name }
      const matchedInjury = matchInjuryForAthlete(merged.rawText, match.athlete.id, injuries)
      if (matchedInjury) {
        merged.injuryId = matchedInjury.id
        merged.injuryLabel = matchedInjury.pathology || matchedInjury.label
      }
      proceedRehab(merged)
      return
    }

    if (pendingAction?.kind === 'awaiting-athlete-for-summary') {
      const match = resolveAthleteMatch(text, athletes)
      if (!match) {
        pushMessage('assistant', {
          text: `I still couldn't find an athlete matching "${text}" on the roster. Who would you like a summary for?`,
        })
        return
      }
      if (match.candidates) {
        askWhichAthlete(pendingAction.parsed, match.candidates, 'awaiting-athlete-choice-for-summary')
        return
      }
      proceedSummary({ ...pendingAction.parsed, athleteId: match.athlete.id, athleteName: match.athlete.name })
      return
    }

    if (pendingAction?.kind?.startsWith('awaiting-athlete-choice-for-')) {
      const match = resolveAthleteMatch(text, pendingAction.candidates)
      if (!match?.athlete) {
        pushMessage('assistant', {
          text: `I still couldn't tell which athlete you meant. Please pick one below.`,
          options: pendingAction.candidates.map((athlete) => ({
            label: athlete.name,
            onSelect: () =>
              selectFollowUp(athlete.name, () => resolveAthleteChoice(pendingAction.kind, pendingAction.parsed, athlete)),
          })),
        })
        return
      }
      resolveAthleteChoice(pendingAction.kind, pendingAction.parsed, match.athlete)
      return
    }

    if (pendingAction?.kind === 'awaiting-injury-for-note' || pendingAction?.kind === 'awaiting-injury-for-rehab') {
      const isRehab = pendingAction.kind === 'awaiting-injury-for-rehab'
      const matched = matchInjuryForAthlete(text, pendingAction.athlete.id, injuries)
      if (!matched) {
        pushMessage('assistant', {
          text: `I still couldn't match that to one of ${pendingAction.athlete.name}'s injuries. Try picking one below or describing it differently.`,
          options: pendingAction.candidates.map((inj) => ({
            label: injuryOption(inj),
            onSelect: () =>
              selectFollowUp(injuryOption(inj), () => {
                const merged = { ...pendingAction.parsed, injuryId: inj.id, injuryLabel: inj.pathology || inj.label }
                if (isRehab) finalizeRehab(merged)
                else finalizeNote(merged)
              }),
          })),
        })
        return
      }
      const merged = { ...pendingAction.parsed, injuryId: matched.id, injuryLabel: matched.pathology || matched.label }
      if (isRehab) finalizeRehab(merged)
      else finalizeNote(merged)
      return
    }

    if (pendingAction?.kind === 'awaiting-exercises-for-rehab') {
      const exercises = extractExercises(text)
      if (!exercises.length) {
        pushMessage('assistant', {
          text: `I still couldn't make out any exercises from that. Try phrasing like "squats for 3 sets of 10".`,
        })
        return
      }
      finalizeRehab({ ...pendingAction.parsed, exercises })
      return
    }

    if (pendingAction?.kind === 'awaiting-more-detail') {
      const { resultType, targetId } = pendingAction
      if (resultType === 'note') {
        appendToPendingNote(targetId, text)
      } else if (resultType === 'rehab') {
        const extraExercises = extractExercises(text)
        if (!extraExercises.length) {
          pushMessage('assistant', {
            text: `I couldn't identify any exercises in that. Try phrasing like "squats for 3 sets of 10".`,
          })
          return
        }
        appendToPendingRehab(targetId, extraExercises)
      } else {
        addNoteToInjury(targetId, text)
      }
      setPendingAction(null)
      pushMessage('assistant', { text: `Added more detail: "${text}"`, options: followUpOptions(resultType, targetId) })
      return
    }

    const intent = detectDictationIntent(text)
    if (intent === 'note') {
      proceedNote(parseNoteDictation(text, { athletes, injuries }))
      return
    }
    if (intent === 'rehab') {
      proceedRehab(parseRehabDictation(text, { athletes, injuries }))
      return
    }
    if (intent === 'summary') {
      proceedSummary(parseSummaryRequest(text, { athletes }))
      return
    }

    proceedInjury(parseInjuryDictation(text, { athletes }))
  }

  function handleSend() {
    const value = inputValue.trim()
    if (!value) return
    pushMessage('user', { text: value })
    setInputValue('')
    processInput(value)
  }

  function handleSelectSuggestion(suggestion) {
    const followUp = SUGGESTION_FOLLOWUPS[suggestion.key]
    if (!followUp) return
    pushMessage('user', { text: suggestion.label })
    setPendingAction({ kind: followUp.kind })
    pushMessage('assistant', { text: followUp.question })
  }

  function handleClose() {
    onClose()
    setMessages([])
    setPendingAction(null)
    setInputValue('')
  }

  function currentPlaceholder() {
    switch (pendingAction?.kind) {
      case 'awaiting-athlete-for-injury':
      case 'awaiting-athlete-for-note':
      case 'awaiting-athlete-for-rehab':
      case 'awaiting-athlete-for-summary':
      case 'awaiting-details-for-summary':
      case 'awaiting-athlete-choice-for-injury':
      case 'awaiting-athlete-choice-for-note':
      case 'awaiting-athlete-choice-for-rehab':
      case 'awaiting-athlete-choice-for-summary':
        return 'e.g. Tyler Held'
      case 'awaiting-injury-for-note':
      case 'awaiting-injury-for-rehab':
        return 'e.g. ankle sprain'
      case 'awaiting-exercises-for-rehab':
        return 'e.g. squats for 3 sets of 10'
      case 'awaiting-details-for-injury':
        return 'e.g. Tyler Held, ankle sprain'
      case 'awaiting-details-for-note':
        return 'e.g. Tyler Held, ankle sprain, doing well today'
      case 'awaiting-details-for-rehab':
        return 'e.g. Tyler Held, ankle sprain, squats for 3 sets of 10'
      case 'awaiting-more-detail':
        return 'Add more detail...'
      default:
        return 'e.g. Create a new injury for... or Update note for...'
    }
  }

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { width: PANEL_WIDTH, display: 'flex', flexDirection: 'column' } }}
      >
        <Box display="flex" flexDirection="column" height="100%">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ p: 2.5, borderBottom: '1px solid var(--divider)', backgroundColor: 'var(--white)', flexShrink: 0 }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Icon name="ai" sx={{ color: 'var(--color-primary)' }} />
              <Typography variant="h2">Ask AI</Typography>
            </Box>
            <IconButton onClick={handleClose} size="small">
              <Icon name="close" fontSize="small" />
            </IconButton>
          </Box>

          <Box
            ref={scrollRef}
            flexGrow={1}
            display="flex"
            flexDirection="column"
            gap={2}
            sx={{ p: 2.5, overflowY: 'auto', backgroundColor: 'var(--background)' }}
          >
            <AiSuggestedActions onSelect={handleSelectSuggestion} />
            {messages.length > 0 && <Divider sx={{ borderColor: 'var(--divider)' }} />}
            {messages.map((message) => (
              <AiChatMessage key={message.id} message={message} />
            ))}
          </Box>

          <Box sx={{ p: 2.5, borderTop: '1px solid var(--divider)', backgroundColor: 'var(--white)', flexShrink: 0 }}>
            <AiDictationInput value={inputValue} onChange={setInputValue} onSubmit={handleSend} placeholder={currentPlaceholder()} />
          </Box>
        </Box>
      </Drawer>

      <InjurySummaryModal open={!!summaryAthleteId} athleteId={summaryAthleteId} onClose={() => setSummaryAthleteId(null)} />
    </>
  )
}
