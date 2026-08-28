import { useNavigate } from 'react-router-dom'
import { Box, Popover, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import colors from '../../theme/tokens'

/**
 * Clicking an empty slot on the grid opens this quick-create, as in the live
 * app: a title, Session / Game / Event buttons, and the slot's date and time.
 */
export default function QuickCreatePopover({ slot, onClose }) {
  const navigate = useNavigate()
  if (!slot) return null

  const pick = type => { onClose(); navigate(`/events/new?type=${type}`) }

  // Beside the painted slot rather than over it, so you can still see what you picked.
  return (
    <Popover
      open={!!slot.el} anchorEl={slot.el} onClose={onClose}
      anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
      transformOrigin={{ vertical: 'center', horizontal: 'left' }}
      marginThreshold={12}
      slotProps={{ paper: { sx: { width: 380, p: 2.5 } } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Box sx={{ width: 18, height: 18, borderRadius: 0.5, border: `2px solid ${colors.neutral_400}` }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>New event</Typography>
      </Box>
      <ToggleButtonGroup exclusive size="small" sx={{ mb: 2 }}>
        <ToggleButton value="Session" onClick={() => pick('Session')}>Session</ToggleButton>
        <ToggleButton value="Game" onClick={() => pick('Game')}>Game</ToggleButton>
        <ToggleButton value="Event" onClick={() => pick('Event')}>Event</ToggleButton>
      </ToggleButtonGroup>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{slot.info}</Typography>
    </Popover>
  )
}
