import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Icon from '../Icon'
import Button from '../Button'

const SpeechRecognitionApi =
  typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)

// SpeechRecognition's error codes aren't self-explanatory — surface something
// a non-technical user can act on instead of the mic button just silently
// reverting with no explanation.
const ERROR_MESSAGES = {
  'not-allowed': 'Microphone access was blocked. Allow microphone access for this site in your browser settings and try again.',
  'service-not-allowed': 'Microphone access was blocked. Allow microphone access for this site in your browser settings and try again.',
  'no-speech': "Didn't catch any speech — try again.",
  'audio-capture': 'No microphone was found. Check that one is connected and try again.',
  network: 'A network error interrupted dictation. Try again.',
  aborted: null,
}

// Dictation relies on the browser sending audio to a cloud speech service —
// if that connection silently hangs (blocked by a firewall, VPN, or privacy
// extension), some browsers never fire `onerror` at all: the mic button just
// stays on "Listening…" forever with nothing arriving. Treat a long stretch
// with zero results (interim or final) as a stall and surface it.
const STALL_TIMEOUT_MS = 7000

export default function AiDictationInput({ value, onChange, onSubmit, autoFocus, placeholder }) {
  const [listening, setListening] = useState(false)
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)
  const baseTextRef = useRef('')
  const stallTimeoutRef = useRef(null)

  const clearStallTimer = () => {
    if (stallTimeoutRef.current) {
      clearTimeout(stallTimeoutRef.current)
      stallTimeoutRef.current = null
    }
  }

  const armStallTimer = () => {
    clearStallTimer()
    stallTimeoutRef.current = setTimeout(() => {
      recognitionRef.current?.stop()
      setListening(false)
      setError(
        "No speech is being picked up. This can happen if the microphone isn't capturing audio, or a network/firewall issue is blocking dictation — try again, or type your message instead."
      )
    }, STALL_TIMEOUT_MS)
  }

  useEffect(() => {
    if (!SpeechRecognitionApi) return undefined
    const recognition = new SpeechRecognitionApi()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      armStallTimer()
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) final += transcript
        else interim += transcript
      }
      if (final) baseTextRef.current = `${baseTextRef.current}${final}`.trim() + ' '
      onChange(`${baseTextRef.current}${interim}`.trim())
    }

    recognition.onend = () => {
      clearStallTimer()
      setListening(false)
    }
    recognition.onerror = (event) => {
      clearStallTimer()
      setListening(false)
      setError(ERROR_MESSAGES[event.error] ?? `Dictation stopped (${event.error}). Try again.`)
    }
    recognitionRef.current = recognition
    return () => {
      clearStallTimer()
      recognition.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleListening = () => {
    if (!recognitionRef.current) return
    if (listening) {
      clearStallTimer()
      recognitionRef.current.stop()
      setListening(false)
      return
    }
    setError(null)
    baseTextRef.current = value ? `${value} ` : ''
    try {
      recognitionRef.current.start()
      setListening(true)
      armStallTimer()
    } catch {
      // start() throws synchronously if recognition is already running
      // (e.g. a rapid double-click) — reset and let the user retry.
      recognitionRef.current.stop()
      setListening(false)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (value.trim()) onSubmit()
    }
  }

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || 'Type or dictate an instruction...'}
        multiline
        minRows={3}
        maxRows={8}
        autoFocus={autoFocus}
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': { borderRadius: '8px', backgroundColor: 'var(--white)' },
        }}
      />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {SpeechRecognitionApi ? (
          <Tooltip title={listening ? 'Stop dictating' : 'Start dictating'}>
            <IconButton
              onClick={toggleListening}
              sx={{
                border: '1px solid var(--divider)',
                color: listening ? 'var(--color-error)' : 'var(--color-primary)',
                backgroundColor: listening ? '#fbe6e7' : 'transparent',
              }}
            >
              <Icon name={listening ? 'micOff' : 'mic'} fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          <Box />
        )}
        {listening && (
          <Typography variant="body2" sx={{ color: 'var(--color-error)', fontWeight: 600 }}>
            Listening…
          </Typography>
        )}
        <Button
          endIcon={<Icon name="send" fontSize="small" />}
          disabled={!value.trim()}
          onClick={onSubmit}
        >
          Send
        </Button>
      </Box>
      {error && (
        <Typography variant="body2" sx={{ color: 'var(--color-error)' }}>
          {error}
        </Typography>
      )}
    </Box>
  )
}
