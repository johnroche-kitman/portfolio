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
        backgroundColor: '#3028FF',
        color: '#ffffff',
        boxShadow: '0 12px 24px rgba(48, 40, 255, 0.4)',
        zIndex: 1300,
        '&:hover': { backgroundColor: '#2620d1' },
      }}
    >
      <Icon name="ai" />
    </Fab>
  )
}
