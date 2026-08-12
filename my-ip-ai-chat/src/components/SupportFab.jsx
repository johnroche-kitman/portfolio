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
        boxShadow: '0 10px 24px rgba(0, 0, 0, 0.35)',
        zIndex: 1100,
        '&:hover': { backgroundColor: '#1c1c1c' },
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 28 32"
        sx={{ width: 26, height: 30, fill: '#ffffff' }}
      >
        <path d="M28 32s-4.714-1.855-8.527-3.34H3.437C1.54 28.66 0 27.026 0 25.013V3.644C0 1.633 1.54 0 3.437 0h21.125c1.898 0 3.437 1.632 3.437 3.645v18.404H28V32zm-4.139-11.982a.88.88 0 00-1.292-.105c-.03.026-3.015 2.681-8.57 2.681-5.486 0-8.517-2.636-8.571-2.684a.88.88 0 00-1.29.107 1.01 1.01 0 00-.219.708.992.992 0 00.318.664c.142.128 3.537 3.15 9.762 3.15 6.226 0 9.621-3.022 9.763-3.15a.992.992 0 00.317-.664 1.01 1.01 0 00-.218-.707z" />
      </Box>
    </ButtonBase>
  )
}
