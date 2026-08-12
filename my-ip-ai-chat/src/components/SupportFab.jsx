import ButtonBase from '@mui/material/ButtonBase'
import Box from '@mui/material/Box'
import { SUPPORT_FAB_SIZE, SUPPORT_FAB_OFFSET } from '../layoutConstants'

// Fixed bottom-right support-chat launcher. Sits below the Drawer's z-index
// so the Ask My iP panel opens over it, same as a real Intercom-style widget.
export default function SupportFab() {
  return (
    <ButtonBase
      aria-label="Open support chat"
      sx={{
        position: 'fixed',
        bottom: SUPPORT_FAB_OFFSET,
        right: SUPPORT_FAB_OFFSET,
        width: SUPPORT_FAB_SIZE,
        height: SUPPORT_FAB_SIZE,
        borderRadius: '50%',
        backgroundColor: '#121212',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        boxShadow: '0 10px 24px rgba(0, 0, 0, 0.35)',
        zIndex: 1100,
        '&:hover': { backgroundColor: '#1c1c1c' },
      }}
    >
      {/* Rendered at its native size, no scaling — just clipped to the circle. */}
      <Box
        component="img"
        src={`${import.meta.env.BASE_URL}intercom.png`}
        alt="Support chat"
      />
    </ButtonBase>
  )
}
