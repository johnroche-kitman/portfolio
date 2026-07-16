import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Icon from '../Icon'
import Button from '../Button'

const SpeechRecognitionApi =
  typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)

export default function AiDictationInput({ value, onChange, onSubmit, autoFocus, placeholder }) {
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)
  const baseTextRef = useRef('')

  useEffect(() => {
    if (!SpeechRecognitionApi) return undefined
    const recognition = new SpeechRecognitionApi()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
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

    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognitionRef.current = recognition
    return () => recognition.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleListening = () => {
    if (!recognitionRef.current) return
    if (listening) {
      recognitionRef.current.stop()
      setListening(false)
    } else {
      baseTextRef.current = value ? `${value} ` : ''
      recognitionRef.current.start()
      setListening(true)
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
        <Button
          endIcon={<Icon name="send" fontSize="small" />}
          disabled={!value.trim()}
          onClick={onSubmit}
        >
          Send
        </Button>
      </Box>
    </Box>
  )
}
