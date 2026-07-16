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
import { detectDictationIntent } from '../../ai/detectDictationIntent'
import { findAthleteByName } from '../../data/athletes'
import { useAppData } from '../../state/AppDataContext'

const PANEL_WIDTH = 420

function injuryOption(inj) {
  return `${inj.date} — ${inj.pathology || inj.label}`
}

export default function AiPanel({ open, onClose }) {
  const [messages, setMessages] = useState([])
  const [pendingAction, setPendingAction] = useState(null)
  const [inputValue, setInputValue] = useState('')
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
    const noun = resultType === 'note' ? 'note' : 'injury'
    return [
      {
        label: `Add more information to this ${noun}`,
        onSelect: () => selectFollowUp(`Add more information to this ${noun}`, () => startAddMoreDetail(resultType, targetId)),
      },
      {
        label: resultType === 'note' ? 'Add another note for someone else' : 'Log another injury for someone else',
        onSelect: () =>
          selectFollowUp(
            resultType === 'note' ? 'Add another note for someone else' : 'Log another injury for someone else',
            () => setPendingAction(null)
          ),
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

  function askWhichInjury(parsed, athlete) {
    const candidates = getInjuriesByAthlete(athlete.id).filter((inj) => inj.status !== 'pending_review')
    if (!candidates.length) {
      setPendingAction(null)
      pushMessage('assistant', {
        text: `${athlete.name} doesn't have any recorded injuries yet, so I can't attach a note to one. Want to log a new injury instead?`,
      })
      return
    }
    setPendingAction({ kind: 'awaiting-injury-for-note', parsed, athlete, candidates })
    pushMessage('assistant', {
      text: `I can add a note for ${athlete.name}, but which injury does it relate to? Pick one below, or describe it (e.g. "ankle sprain").`,
      options: candidates.map((inj) => ({
        label: injuryOption(inj),
        onSelect: () =>
          selectFollowUp(injuryOption(inj), () =>
            finalizeNote({ ...parsed, injuryId: inj.id, injuryLabel: inj.pathology || inj.label })
          ),
      })),
    })
  }

  function proceedNote(parsed) {
    if (!parsed.athleteId) {
      setPendingAction({ kind: 'awaiting-athlete-for-note', parsed })
      pushMessage('assistant', { text: "I can add a note, but I need to know which athlete it's for. Who is this for?" })
      return
    }
    const athlete = getAthleteById(parsed.athleteId)
    if (!parsed.injuryId) {
      askWhichInjury(parsed, athlete)
      return
    }
    finalizeNote(parsed)
  }

  function processInput(text) {
    if (pendingAction?.kind === 'awaiting-athlete-for-injury') {
      const athlete = findAthleteByName(text, athletes)
      if (!athlete) {
        pushMessage('assistant', { text: `I still couldn't find an athlete matching "${text}" on the roster. Who is this injury for?` })
        return
      }
      finalizeInjury({ ...pendingAction.parsed, athleteId: athlete.id, athleteName: athlete.name })
      return
    }

    if (pendingAction?.kind === 'awaiting-athlete-for-note') {
      const athlete = findAthleteByName(text, athletes)
      if (!athlete) {
        pushMessage('assistant', { text: `I still couldn't find an athlete matching "${text}" on the roster. Who is this note for?` })
        return
      }
      const merged = { ...pendingAction.parsed, athleteId: athlete.id, athleteName: athlete.name }
      const matchedInjury = matchInjuryForAthlete(merged.rawText, athlete.id, injuries)
      if (matchedInjury) {
        merged.injuryId = matchedInjury.id
        merged.injuryLabel = matchedInjury.pathology || matchedInjury.label
      }
      proceedNote(merged)
      return
    }

    if (pendingAction?.kind === 'awaiting-injury-for-note') {
      const matched = matchInjuryForAthlete(text, pendingAction.athlete.id, injuries)
      if (!matched) {
        pushMessage('assistant', {
          text: `I still couldn't match that to one of ${pendingAction.athlete.name}'s injuries. Try picking one below or describing it differently.`,
          options: pendingAction.candidates.map((inj) => ({
            label: injuryOption(inj),
            onSelect: () =>
              selectFollowUp(injuryOption(inj), () =>
                finalizeNote({ ...pendingAction.parsed, injuryId: inj.id, injuryLabel: inj.pathology || inj.label })
              ),
          })),
        })
        return
      }
      finalizeNote({ ...pendingAction.parsed, injuryId: matched.id, injuryLabel: matched.pathology || matched.label })
      return
    }

    if (pendingAction?.kind === 'awaiting-more-detail') {
      const { resultType, targetId } = pendingAction
      if (resultType === 'note') {
        appendToPendingNote(targetId, text)
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

    const parsed = parseInjuryDictation(text, { athletes })
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

  function handleSend() {
    const value = inputValue.trim()
    if (!value) return
    pushMessage('user', { text: value })
    setInputValue('')
    processInput(value)
  }

  function handleSelectSuggestion(suggestion) {
    if (suggestion.template) setInputValue(suggestion.template)
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
        return 'e.g. Tyler Held'
      case 'awaiting-injury-for-note':
        return 'e.g. ankle sprain'
      case 'awaiting-more-detail':
        return 'Add more detail...'
      default:
        return 'e.g. Create a new injury for... or Update note for...'
    }
  }

  return (
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
  )
}
