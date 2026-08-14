import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import KitCharacter from '../components/KitCharacter'

const VARIANTS = [
  { state: 'idle', label: 'Idle', description: 'Occasional blink/squint + nose wiggle' },
  { state: 'thinking', label: 'Thinking', description: 'Head tilt + whisker twitch' },
  { state: 'loading', label: 'Loading', description: 'Ears/whiskers fly off, eyes + nose pulse like the thinking dots' },
  { state: 'vanish', label: 'Vanish', description: 'Ears, whiskers and eyes spin into the nose, leaving a dot' },
  { state: 'sparkle', label: 'Sparkle', description: 'Whiskers gather at the nose into a pulsing asterisk' },
  { state: 'error', label: 'Error', description: 'Ears fold into "<" and ">", eyes form the "!" line, nose its dot' },
  { state: 'ready', label: 'Ready', description: 'Ears swing into a tick, like the Kitman mark' },
  {
    state: 'soundwave',
    label: 'Soundwave',
    description: 'Whiskers morph into a pulsing soundwave - speech-to-text mode',
  },
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
      <Typography variant="body1" sx={{ color: 'var(--grey-100)', mb: 3, textAlign: 'center' }}>
        Kit, the Ask AI avatar — trying out a few looping states.
      </Typography>

      <Box display="flex" flexDirection="column" alignItems="center" mb={5}>
        <Box
          component="img"
          src={`${import.meta.env.BASE_URL}ask-kit.png`}
          alt="Ask KIT panel design mockup, showing where Kit appears in the new chat screen"
          sx={{
            width: '100%',
            maxWidth: 420,
            borderRadius: 2,
            border: '1px solid var(--divider)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          }}
        />
        <Typography variant="body2" sx={{ color: 'var(--grey-100)', mt: 1.5, textAlign: 'center' }}>
          Reference: where Kit sits in the Ask KIT panel design
        </Typography>
      </Box>

      <Box
        display="grid"
        sx={{ gridTemplateColumns: 'repeat(3, 220px)', justifyContent: 'center', columnGap: 4, rowGap: 5 }}
        mb={4}
      >
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
