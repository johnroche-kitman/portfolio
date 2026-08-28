import { useNavigate } from 'react-router-dom'
import { Box, Button, Divider, Link, Popover, Typography } from '@mui/material'
import RepeatIcon from '@mui/icons-material/Repeat'
import colors from '../../theme/tokens'
import { TYPE_COLOR } from '../../data/events'

const LONG_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

/**
 * Clicking an event opens this first — it does not jump straight to edit.
 * Mirrors the live popup: colour chip, title, Duplicate, date/type/squad,
 * recurrence line, then Delete / Edit / More details.
 */
export default function EventPopover({ event, anchorEl, onClose }) {
  const navigate = useNavigate()
  if (!event) return null

  const go = path => { onClose(); navigate(path) }

  return (
    <Popover
      open={!!anchorEl} anchorEl={anchorEl} onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      slotProps={{ paper: { sx: { width: 380, borderRadius: 1 } } }}
    >
      <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5, display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Box sx={{ width: 18, height: 18, borderRadius: 0.5, mt: 0.5, flexShrink: 0,
          bgcolor: TYPE_COLOR[event.type] }} />
        <Typography variant="h6" sx={{ fontWeight: 700, flex: 1, minWidth: 0, lineHeight: 1.25 }}>
          {event.title}
        </Typography>
        <Link component="button" underline="hover" sx={{ fontSize: 14, flexShrink: 0, mt: 0.25 }}
          onClick={() => go(`/events/new?type=${event.type}`)}>
          Duplicate
        </Link>
      </Box>

      <Box sx={{ px: 2.5, pb: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {LONG_DAYS[event.day]} {24 + event.day} August 2026 {event.start} - {event.end}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {event.sessionType || event.eventType || event.competition || event.type}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{event.squad}</Typography>
        {event.repeats && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <RepeatIcon sx={{ fontSize: 17, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {event.repeats === 'Daily' ? 'Every day, until 17th August, 2026' : event.repeats}
            </Typography>
          </Box>
        )}
      </Box>

      <Divider />
      <Box sx={{ px: 2, py: 1.25, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button variant="text" color="error" size="small" onClick={onClose}>Delete</Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="text" size="small" onClick={() => go(`/events/${event.id}`)}>Edit</Button>
          <Button size="small" onClick={() => go(`/sessions/${event.id}`)}>More details</Button>
        </Box>
      </Box>
    </Popover>
  )
}
