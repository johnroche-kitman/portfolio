import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

const STORAGE_KEY = 'my-ip-ai-chat-unlocked'
const PASSWORD = 'd2s1O1\\V'

function isUnlocked() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

// Client-side gate for a static prototype — not real security (the password
// ships in the JS bundle either way), just a lightweight lock so the link
// isn't wide open to anyone who stumbles onto it.
export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(isUnlocked)
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  if (unlocked) return children

  function handleSubmit(e) {
    e.preventDefault()
    if (value === PASSWORD) {
      try {
        window.localStorage.setItem(STORAGE_KEY, 'true')
      } catch {
        // ignore storage errors, unlock still applies for this session
      }
      setUnlocked(true)
    } else {
      setError(true)
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ backgroundColor: 'var(--background)', px: 3 }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          mb: 3,
          borderRadius: '50%',
          backgroundColor: '#0b1220',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          component="img"
          src={`${import.meta.env.BASE_URL}kitman-logo.png`}
          alt="Kitman Labs"
          sx={{ width: 44, height: 44, objectFit: 'contain' }}
        />
      </Box>
      <Typography variant="h1" sx={{ mb: 1, textAlign: 'center', color: 'var(--color-primary)' }}>
        This prototype is password protected
      </Typography>
      <Typography variant="body1" sx={{ color: 'var(--grey-100)', mb: 3, textAlign: 'center' }}>
        Enter the password to continue.
      </Typography>
      <TextField
        type="password"
        autoFocus
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setError(false)
        }}
        error={error}
        helperText={error ? 'Incorrect password' : ' '}
        placeholder="Password"
        sx={{ width: 260, mb: 1 }}
      />
      <Button type="submit" variant="contained" sx={{ width: 260 }}>
        Continue
      </Button>
    </Box>
  )
}
