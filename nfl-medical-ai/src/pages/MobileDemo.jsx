import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import PhoneFrame from '../components/PhoneFrame'
import AiPanelMobile from '../components/ai/AiPanelMobile'

export default function MobileDemo() {
  const navigate = useNavigate()

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={2.5}
      sx={{ backgroundColor: 'var(--background)', py: 5 }}
    >
      <PhoneFrame>
        <AiPanelMobile />
      </PhoneFrame>

      <Typography
        variant="body2"
        onClick={() => navigate('/medical/squad')}
        sx={{
          color: 'var(--color-primary)',
          textDecoration: 'underline',
          cursor: 'pointer',
          '&:hover': { color: 'var(--color-primary-dark)' },
        }}
      >
        Switch to desktop
      </Typography>
    </Box>
  )
}
