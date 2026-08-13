import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import KitCharacter from '../components/KitCharacter'

const VARIANTS = [
  { state: 'idle', label: 'Idle', description: 'Occasional blink/squint + nose wiggle' },
  { state: 'thinking', label: 'Thinking', description: 'Head tilt + whisker twitch' },
  { state: 'ready', label: 'Ready', description: 'Ears swing into a tick, like the Kitman mark' },
  { state: 'loading', label: 'Loading', description: 'Ears/whiskers fly off, eyes + nose pulse like the thinking dots' },
  { state: 'vanish', label: 'Vanish', description: 'Ears, whiskers and eyes spin away, leaving the nose as a dot' },
]

export default function AnimationTests() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ backgroundColor: 'var(--background)', px: 3, py: 6 }}
    >
      <Typography variant="h1" sx={{ mb: 1, textAlign: 'center', color: 'var(--color-primary)' }}>
        Animation tests
      </Typography>
      <Typography variant="body1" sx={{ color: 'var(--grey-100)', mb: 5, textAlign: 'center' }}>
        Kit, the Ask AI avatar — trying out a few looping states.
      </Typography>

      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={4} mb={4}>
        {VARIANTS.map((variant) => (
          <Box key={variant.state} display="flex" flexDirection="column" alignItems="center" sx={{ width: 220 }}>
            <Box
              sx={{
                width: 220,
                height: 220,
                borderRadius: '50%',
                backgroundColor: 'var(--white)',
                border: '1px solid var(--divider)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                overflow: 'hidden',
              }}
            >
              <KitCharacter size={130} state={variant.state} />
            </Box>
            <Typography variant="h2" sx={{ color: 'var(--color-primary)', mb: 0.5 }}>
              {variant.label}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--grey-100)', textAlign: 'center' }}>
              {variant.description}
            </Typography>
          </Box>
        ))}
      </Box>

      <Typography
        component={Link}
        to="/"
        variant="body1"
        sx={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
      >
        Back to prototype versions
      </Typography>
    </Box>
  )
}
