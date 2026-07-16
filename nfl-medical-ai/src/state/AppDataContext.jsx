import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { athletes as seedAthletes } from '../data/athletes'
import { injuries as seedInjuries, seedNotes } from '../data/injuries'
import { backgroundScreenQuestions } from '../data/backgroundScreenQuestions'

const STORAGE_KEY = 'nfl-medical-ai-state-v1'

function loadInitialState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { pendingNotes: [], ...parsed }
    }
  } catch {
    // fall through to seed state
  }
  return {
    athletes: seedAthletes,
    injuries: seedInjuries,
    athleteNotes: seedNotes,
    notesByInjury: {},
    pendingNotes: [],
  }
}

function todayLabel() {
  const now = new Date()
  return now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function inferBackgroundScreen(parsed) {
  const answers = {}
  backgroundScreenQuestions.forEach((q) => {
    const value = q.infer(parsed)
    if (value) answers[q.id] = value
  })
  return answers
}

function outstandingBackgroundFields(injury) {
  return backgroundScreenQuestions.filter((q) => !injury.backgroundScreen?.[q.id])
}

const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
  const [state, setState] = useState(loadInitialState)

  const persist = useCallback((next) => {
    setState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore quota/serialization errors, in-memory state still updates
    }
  }, [])

  const createInjuryFromParsed = useCallback(
    (parsed) => {
      const id = `inj-ai-${state.injuries.length + 1}-${Math.random().toString(36).slice(2, 7)}`
      const today = todayLabel()
      const athlete = state.athletes.find((a) => a.id === parsed.athleteId)

      const injury = {
        id,
        athleteId: parsed.athleteId,
        label: parsed.pathology || 'Injury under review',
        date: today,
        subtitle: 'Pending review',
        status: 'pending_review',
        source: 'ai',
        addedOn: today,
        addedBy: 'AI assistant',
        examinationDate: today,
        ciCode: parsed.pathology || null,
        classification: parsed.classification || null,
        bodyArea: parsed.bodyArea || null,
        side: parsed.side || null,
        code: null,
        modeOfOnset: parsed.mechanismType === 'contact' ? 'Contact' : parsed.mechanismType === 'non-contact' ? 'Non-contact' : null,
        pathology: parsed.pathology || null,
        event: parsed.eventLabel || null,
        activity: parsed.activity || null,
        sessionCompleted: parsed.removedFromParticipation ? 'No' : null,
        positionWhenInjured: athlete?.position || null,
        backgroundScreen: inferBackgroundScreen(parsed),
        natureOfInjury: parsed.pathology ? [{ pathology: parsed.pathology }] : [],
        availabilityHistory: [],
        totalDuration: null,
        totalUnavailability: null,
        rawDictation: parsed.rawText,
        symptoms: parsed.symptoms || [],
      }

      const noteId = `note-${id}`
      const note = {
        id: noteId,
        author: 'AI assistant',
        date: today,
        text: parsed.noteText,
      }

      persist({
        ...state,
        injuries: [injury, ...state.injuries],
        notesByInjury: { ...state.notesByInjury, [id]: [note] },
      })

      return injury
    },
    [state, persist]
  )

  const acceptInjury = useCallback(
    (injuryId) => {
      persist({
        ...state,
        injuries: state.injuries.map((inj) =>
          inj.id === injuryId
            ? { ...inj, status: 'accepted', subtitle: inj.subtitle === 'Pending review' ? 'Reviewed' : inj.subtitle }
            : inj
        ),
      })
    },
    [state, persist]
  )

  const rejectInjury = useCallback(
    (injuryId) => {
      const { [injuryId]: _removed, ...restNotes } = state.notesByInjury
      persist({
        ...state,
        injuries: state.injuries.filter((inj) => inj.id !== injuryId),
        notesByInjury: restNotes,
      })
    },
    [state, persist]
  )

  const addNoteToInjury = useCallback(
    (injuryId, text) => {
      const noteId = `note-${injuryId}-${Date.now()}`
      const note = { id: noteId, author: 'AI assistant', date: todayLabel(), text }
      persist({
        ...state,
        notesByInjury: {
          ...state.notesByInjury,
          [injuryId]: [...(state.notesByInjury[injuryId] || []), note],
        },
      })
    },
    [state, persist]
  )

  const createNoteFromParsed = useCallback(
    (parsed) => {
      const id = `note-ai-${state.pendingNotes.length + 1}-${Math.random().toString(36).slice(2, 7)}`
      const note = {
        id,
        injuryId: parsed.injuryId,
        athleteId: parsed.athleteId,
        title: parsed.title || parsed.placeholderTitle,
        text: parsed.noteText,
        rawDictation: parsed.rawText,
        addedBy: 'AI assistant',
        addedOn: parsed.addedOn || todayLabel(),
        status: 'pending_review',
      }

      persist({
        ...state,
        pendingNotes: [note, ...state.pendingNotes],
      })

      return note
    },
    [state, persist]
  )

  const acceptNote = useCallback(
    (noteId) => {
      const note = state.pendingNotes.find((n) => n.id === noteId)
      if (!note) return

      const injuryNote = {
        id: `note-${noteId}`,
        author: note.addedBy,
        date: note.addedOn,
        title: note.title,
        text: note.text,
      }

      persist({
        ...state,
        pendingNotes: state.pendingNotes.map((n) => (n.id === noteId ? { ...n, status: 'accepted' } : n)),
        notesByInjury: {
          ...state.notesByInjury,
          [note.injuryId]: [...(state.notesByInjury[note.injuryId] || []), injuryNote],
        },
      })
    },
    [state, persist]
  )

  const rejectNote = useCallback(
    (noteId) => {
      persist({
        ...state,
        pendingNotes: state.pendingNotes.filter((n) => n.id !== noteId),
      })
    },
    [state, persist]
  )

  const appendToPendingNote = useCallback(
    (noteId, extraText) => {
      persist({
        ...state,
        pendingNotes: state.pendingNotes.map((n) =>
          n.id === noteId ? { ...n, text: `${n.text}\n\n${extraText}` } : n
        ),
      })
    },
    [state, persist]
  )

  const value = useMemo(
    () => ({
      athletes: state.athletes,
      injuries: state.injuries,
      athleteNotes: state.athleteNotes,
      notesByInjury: state.notesByInjury,
      pendingInjuries: state.injuries.filter((inj) => inj.status === 'pending_review'),
      pendingNotes: state.pendingNotes.filter((n) => n.status === 'pending_review'),
      getAthleteById: (id) => state.athletes.find((a) => a.id === id),
      getInjuriesByAthlete: (athleteId) => state.injuries.filter((inj) => inj.athleteId === athleteId),
      getInjuryById: (id) => state.injuries.find((inj) => inj.id === id),
      outstandingBackgroundFields,
      createInjuryFromParsed,
      acceptInjury,
      rejectInjury,
      addNoteToInjury,
      createNoteFromParsed,
      acceptNote,
      rejectNote,
      appendToPendingNote,
    }),
    [
      state,
      createInjuryFromParsed,
      acceptInjury,
      rejectInjury,
      addNoteToInjury,
      createNoteFromParsed,
      acceptNote,
      rejectNote,
      appendToPendingNote,
    ]
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
