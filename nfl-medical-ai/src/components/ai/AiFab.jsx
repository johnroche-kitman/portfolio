import Fab from '@mui/material/Fab'
import Icon from '../Icon'

export default function AiFab({ onClick }) {
  return (
    <Fab
      onClick={onClick}
      aria-label="Open AI assistant"
      sx={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        width: 60,
        height: 60,
        backgroundColor: 'var(--color-primary)',
        color: '#ffffff',
        boxShadow: '0 12px 24px rgba(23, 43, 77, 0.35)',
        zIndex: 1300,
        '&:hover': { backgroundColor: 'var(--color-primary-dark)' },
      }}
    >
      <Icon name="ai" />
    </Fab>
  )
}
