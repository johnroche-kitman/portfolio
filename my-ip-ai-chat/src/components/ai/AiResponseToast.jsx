import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ButtonBase from '@mui/material/ButtonBase'
import Icon from '../Icon'
import { TOAST_BOTTOM_OFFSET, SUPPORT_FAB_OFFSET } from '../../layoutConstants'

export default function AiResponseToast({ toast, onOpen, onDismiss }) {
  if (!toast) return null

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: TOAST_BOTTOM_OFFSET,
        right: SUPPORT_FAB_OFFSET,
        zIndex: 1400,
        width: 360,
        backgroundColor: 'var(--toast-blue-bg)',
        borderRadius: 1.5,
        p: 2,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1,
      }}
    >
      <Icon name="commentAdd" fontSize="small" sx={{ color: 'var(--toast-icon-blue)', mt: 0.25, flexShrink: 0 }} />
      <Box flexGrow={1} minWidth={0}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
          <Typography variant="body1" sx={{ color: 'var(--toast-title-blue)', fontWeight: 700 }}>
            Ask My iP answer ready
          </Typography>
          <Box display="flex" alignItems="center" gap={0.5} flexShrink={0}>
            <ButtonBase onClick={onOpen} sx={{ borderRadius: 1, px: 0.5 }}>
              <Typography variant="body1" sx={{ color: 'var(--toast-title-blue)', fontWeight: 700 }}>
                Open
              </Typography>
            </ButtonBase>
            <IconButton size="small" onClick={onDismiss} sx={{ color: 'var(--toast-title-blue)' }}>
              <Icon name="close" fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="body1" sx={{ color: 'var(--toast-body-blue)' }}>
          Your {toast.agentLabel.toLowerCase()} query has been answered
        </Typography>
      </Box>
    </Box>
  )
}
