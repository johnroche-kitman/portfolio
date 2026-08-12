import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Icon from '../Icon'

// The Ask My iP launcher for light-background contexts (the My iP toolbar
// and the top app bar) — same icon and unseen-response dot as the nav rail
// trigger, just restyled for a white surface instead of the dark rail.
export default function AskIpTriggerButton({ onOpenChat, hasUnseen }) {
  return (
    <Tooltip title="Ask My iP">
      <IconButton onClick={onOpenChat} aria-label="Open Ask My iP assistant" sx={{ color: 'var(--color-primary)' }}>
        <Badge
          variant="dot"
          invisible={!hasUnseen}
          sx={{ '& .MuiBadge-dot': { backgroundColor: 'var(--color-accent)', border: '2px solid var(--white)' } }}
        >
          <Icon name="askIp" fontSize="small" />
        </Badge>
      </IconButton>
    </Tooltip>
  )
}
