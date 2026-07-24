import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { athletes as seedAthletes } from '../data/athletes'
import { injuries as seedInjuries, seedNotes, seedRehabByInjury } from '../data/injuries'
import { backgroundScreenQuestions } from '../data/backgroundScreenQuestions'

const STORAGE_KEY = 'nfl-medical-ai-state-v1'

function loadInitialState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { pendingNotes: [], rehabByInjury: {}, reviewHistory: [], ...parsed }
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
    rehabByInjury: seedRehabByInjury,
    reviewHistory: [],
  }
}

function historyEntry(fields) {
  return {
    id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    decidedOn: todayLabel(),
    ...fields,
  }
}

function todayLabel() {
  const now = new Date()
  return now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function todayKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
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
        severity: null,
        resolved: false,
        resolvedDate: null,
        diagnostics: [],
        surgery: null,
        medications: [],
      }

      const noteId = `note-${id}`
      const note = {
        id: noteId,
        author: 'AI assistant',
        date: today,
        title: 'Initial note',
        noteType: 'Initial note',
        isPrivate: false,
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
      const injury = state.injuries.find((inj) => inj.id === injuryId)
      persist({
        ...state,
        injuries: state.injuries.map((inj) =>
          inj.id === injuryId
            ? { ...inj, status: 'accepted', subtitle: inj.subtitle === 'Pending review' ? 'Reviewed' : inj.subtitle }
            : inj
        ),
        reviewHistory: injury
          ? [
              historyEntry({
                type: 'injury',
                decision: 'accepted',
                athleteId: injury.athleteId,
                injuryId: injury.id,
                summary: injury.pathology || injury.label,
                detail: injury.rawDictation,
              }),
              ...state.reviewHistory,
            ]
          : state.reviewHistory,
      })
    },
    [state, persist]
  )

  const rejectInjury = useCallback(
    (injuryId) => {
      const injury = state.injuries.find((inj) => inj.id === injuryId)
      const { [injuryId]: _removed, ...restNotes } = state.notesByInjury
      persist({
        ...state,
        injuries: state.injuries.filter((inj) => inj.id !== injuryId),
        notesByInjury: restNotes,
        reviewHistory: injury
          ? [
              historyEntry({
                type: 'injury',
                decision: 'rejected',
                athleteId: injury.athleteId,
                injuryId: null,
                summary: injury.pathology || injury.label,
                detail: injury.rawDictation,
              }),
              ...state.reviewHistory,
            ]
          : state.reviewHistory,
      })
    },
    [state, persist]
  )

  const addNoteToInjury = useCallback(
    (injuryId, text) => {
      const noteId = `note-${injuryId}-${Date.now()}`
      const note = {
        id: noteId,
        author: 'AI assistant',
        date: todayLabel(),
        title: 'Additional note',
        noteType: 'Additional note',
        isPrivate: false,
        text,
      }
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
        noteType: 'Progress note',
        isPrivate: false,
        text: note.text,
      }

      persist({
        ...state,
        pendingNotes: state.pendingNotes.map((n) => (n.id === noteId ? { ...n, status: 'accepted' } : n)),
        notesByInjury: {
          ...state.notesByInjury,
          [note.injuryId]: [...(state.notesByInjury[note.injuryId] || []), injuryNote],
        },
        reviewHistory: [
          historyEntry({
            type: 'note',
            decision: 'accepted',
            athleteId: note.athleteId,
            injuryId: note.injuryId,
            summary: note.title,
            detail: note.text,
          }),
          ...state.reviewHistory,
        ],
      })
    },
    [state, persist]
  )

  const rejectNote = useCallback(
    (noteId) => {
      const note = state.pendingNotes.find((n) => n.id === noteId)
      persist({
        ...state,
        pendingNotes: state.pendingNotes.filter((n) => n.id !== noteId),
        reviewHistory: note
          ? [
              historyEntry({
                type: 'note',
                decision: 'rejected',
                athleteId: note.athleteId,
                injuryId: note.injuryId,
                summary: note.title,
                detail: note.text,
              }),
              ...state.reviewHistory,
            ]
          : state.reviewHistory,
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

  const addManualNote = useCallback(
    (injuryId, { title, noteType, text, isPrivate }) => {
      const noteId = `note-${injuryId}-${Date.now()}`
      const note = {
        id: noteId,
        author: 'You',
        date: todayLabel(),
        title: title || 'Note',
        noteType: noteType || 'General note',
        isPrivate: !!isPrivate,
        text,
      }
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

  const deleteNoteFromInjury = useCallback(
    (injuryId, noteId) => {
      persist({
        ...state,
        notesByInjury: {
          ...state.notesByInjury,
          [injuryId]: (state.notesByInjury[injuryId] || []).filter((n) => n.id !== noteId),
        },
      })
    },
    [state, persist]
  )

  // Rehab programs dictated to Ask iP go straight onto the injury's rehab
  // tab — no review-queue step — so this writes the day entry directly,
  // tagged with addedBy so RehabTab can show where it came from.
  const createRehabFromParsed = useCallback(
    (parsed) => {
      const date = parsed.date || todayKey()
      const exercises = parsed.exercises || []
      const existingDays = state.rehabByInjury[parsed.injuryId] || []
      const dayIndex = existingDays.findIndex((entry) => entry.date === date)
      const newEntryId = `rehab-ai-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      const updatedDays =
        dayIndex >= 0
          ? existingDays.map((entry, i) => (i === dayIndex ? { ...entry, exercises: [...entry.exercises, ...exercises] } : entry))
          : [...existingDays, { id: newEntryId, date, exercises, addedBy: 'AI assistant' }]

      persist({
        ...state,
        rehabByInjury: { ...state.rehabByInjury, [parsed.injuryId]: updatedDays },
      })

      return {
        id: dayIndex >= 0 ? existingDays[dayIndex].id : newEntryId,
        injuryId: parsed.injuryId,
        athleteId: parsed.athleteId,
        date,
        exercises,
      }
    },
    [state, persist]
  )

  const addExercisesToRehabDay = useCallback(
    (injuryId, dayEntryId, extraExercises) => {
      if (!extraExercises?.length) return
      persist({
        ...state,
        rehabByInjury: {
          ...state.rehabByInjury,
          [injuryId]: (state.rehabByInjury[injuryId] || []).map((entry) =>
            entry.id === dayEntryId ? { ...entry, exercises: [...entry.exercises, ...extraExercises] } : entry
          ),
        },
      })
    },
    [state, persist]
  )

  const addManualRehabExercise = useCallback(
    (injuryId, dayKey, exercise) => {
      const existingDays = state.rehabByInjury[injuryId] || []
      const dayIndex = existingDays.findIndex((entry) => entry.date === dayKey)
      const updatedDays =
        dayIndex >= 0
          ? existingDays.map((entry, i) => (i === dayIndex ? { ...entry, exercises: [...entry.exercises, exercise] } : entry))
          : [
              ...existingDays,
              { id: `rehab-manual-${injuryId}-${Date.now()}`, date: dayKey, exercises: [exercise], addedBy: 'You' },
            ]

      persist({
        ...state,
        rehabByInjury: { ...state.rehabByInjury, [injuryId]: updatedDays },
      })
    },
    [state, persist]
  )

  const clearRehabDay = useCallback(
    (injuryId, dayEntryId) => {
      persist({
        ...state,
        rehabByInjury: {
          ...state.rehabByInjury,
          [injuryId]: (state.rehabByInjury[injuryId] || []).filter((entry) => entry.id !== dayEntryId),
        },
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
      reviewHistory: state.reviewHistory,
      rehabByInjury: state.rehabByInjury,
      getAthleteById: (id) => state.athletes.find((a) => a.id === id),
      getInjuriesByAthlete: (athleteId) => state.injuries.filter((inj) => inj.athleteId === athleteId),
      getInjuryById: (id) => state.injuries.find((inj) => inj.id === id),
      getRehabsByInjury: (injuryId) => state.rehabByInjury[injuryId] || [],
      outstandingBackgroundFields,
      createInjuryFromParsed,
      acceptInjury,
      rejectInjury,
      addNoteToInjury,
      createNoteFromParsed,
      acceptNote,
      rejectNote,
      appendToPendingNote,
      addManualNote,
      deleteNoteFromInjury,
      createRehabFromParsed,
      addExercisesToRehabDay,
      addManualRehabExercise,
      clearRehabDay,
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
      addManualNote,
      deleteNoteFromInjury,
      createRehabFromParsed,
      addExercisesToRehabDay,
      addManualRehabExercise,
      clearRehabDay,
    ]
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
