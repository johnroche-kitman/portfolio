import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import KitCharacter from '../components/KitCharacter'

export default function AnimationTests() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ backgroundColor: 'var(--background)', px: 3 }}
    >
      <Typography variant="h1" sx={{ mb: 1, textAlign: 'center', color: 'var(--color-primary)' }}>
        Animation tests
      </Typography>
      <Typography variant="body1" sx={{ color: 'var(--grey-100)', mb: 5, textAlign: 'center' }}>
        Kit, the Ask AI avatar — looping eye blink/squint and nose wiggle.
      </Typography>

      <Box
        sx={{
          width: 260,
          height: 260,
          borderRadius: '50%',
          backgroundColor: 'var(--white)',
          border: '1px solid var(--divider)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 4,
        }}
      >
        <KitCharacter size={150} />
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
