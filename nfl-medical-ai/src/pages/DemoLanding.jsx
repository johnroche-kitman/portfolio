import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ButtonBase from '@mui/material/ButtonBase'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'

const OPTIONS = [
  {
    key: 'desktop',
    label: 'Desktop view',
    description: 'Browse the full Medical roster, review queue, and injury records.',
    icon: 'desktop',
    to: '/medical/roster',
  },
  {
    key: 'mobile',
    label: 'Mobile view',
    description: 'Preview the Ask AI assistant full-screen in a phone frame.',
    icon: 'mobile',
    to: '/mobile',
  },
]

export default function DemoLanding() {
  const navigate = useNavigate()

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ backgroundColor: 'var(--background)', px: 3 }}
    >
      <Box
        component="img"
        src={`${import.meta.env.BASE_URL}nfl-logo.png`}
        alt="NFL"
        sx={{ width: 56, height: 56, mb: 3, objectFit: 'contain' }}
      />
      <Typography variant="h1" sx={{ mb: 1, textAlign: 'center' }}>
        NFL Medical AI
      </Typography>
      <Typography variant="body1" sx={{ color: 'var(--grey-100)', mb: 5, textAlign: 'center' }}>
        Choose how you'd like to view the demo.
      </Typography>

      <Box display="flex" gap={3} flexWrap="wrap" justifyContent="center">
        {OPTIONS.map((option) => (
          <ButtonBase
            key={option.key}
            onClick={() => navigate(option.to)}
            sx={{
              width: 260,
              p: 4,
              borderRadius: '12px',
              border: '1px solid var(--divider)',
              backgroundColor: 'var(--white)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              textAlign: 'center',
              '&:hover': { borderColor: 'var(--color-primary)', backgroundColor: 'var(--neutral-200)' },
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: 'var(--neutral-200)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)',
              }}
            >
              <Icon name={option.icon} fontSize="medium" />
            </Box>
            <Typography variant="h2">{option.label}</Typography>
            <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
              {option.description}
            </Typography>
          </ButtonBase>
        ))}
      </Box>
    </Box>
  )
}
