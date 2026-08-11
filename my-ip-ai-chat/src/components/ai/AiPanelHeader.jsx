import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Icon from '../Icon'

export default function AiPanelHeader({ title, showNewChat, expanded, onNewChat, onHistory, onToggleExpand, onClose }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{ px: 3, py: 2.5, borderBottom: '1px solid var(--divider)', backgroundColor: 'var(--white)', flexShrink: 0 }}
    >
      <Typography variant="h2" sx={{ color: 'var(--color-primary)' }}>
        {title}
      </Typography>
      <Box display="flex" alignItems="center" gap={0.5}>
        {showNewChat && (
          <Tooltip title="New chat">
            <IconButton onClick={onNewChat} size="small">
              <Icon name="edit" fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="History">
          <IconButton onClick={onHistory} size="small">
            <Icon name="history" fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={expanded ? 'Minimise' : 'Expand'}>
          <IconButton onClick={onToggleExpand} size="small">
            <Icon name={expanded ? 'minimise' : 'expand'} fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Close">
          <IconButton onClick={onClose} size="small">
            <Icon name="close" fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}
