import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'
import Icon from '../Icon'
import AiHistoryList from './AiHistoryList'

// Persistent left rail shown only when the panel is expanded to full width,
// mirroring the collapsed panel's header actions (new chat / history) so
// switching conversations doesn't require reaching for the header icons.
export default function AiPanelSidebar({ chats, onNewChat, onSelectChat }) {
  return (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        borderRight: '1px solid var(--divider)',
        height: '100%',
        overflowY: 'auto',
        pt: 2.5,
      }}
    >
      <ButtonBase
        onClick={onNewChat}
        sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 3, py: 1, borderRadius: 1 }}
      >
        <Icon name="edit" fontSize="small" sx={{ color: 'var(--color-primary)' }} />
        <Typography variant="body1" sx={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          New chat
        </Typography>
      </ButtonBase>

      <Typography
        variant="body1"
        sx={{ color: 'var(--grey-100)', fontWeight: 600, px: 3, mt: 2, mb: 0.5, display: 'block' }}
      >
        History
      </Typography>
      <AiHistoryList chats={chats} onSelect={onSelectChat} dense />
    </Box>
  )
}
