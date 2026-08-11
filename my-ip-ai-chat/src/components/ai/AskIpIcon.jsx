import Box from '@mui/material/Box'
import Icon from '../Icon'

// The "Ask My iP" mark: a chat bubble with a sparkle inside. Composed from two
// existing outlined icons rather than a hand-drawn path, so it stays in sync
// with the rest of the icon set's stroke weight.
export default function AskIpIcon({ size = 20, color = 'currentColor' }) {
  return (
    <Box sx={{ position: 'relative', width: size, height: size, display: 'inline-flex', color }}>
      <Icon name="chatBubble" sx={{ position: 'absolute', inset: 0, width: size, height: size, color }} />
      <Icon
        name="sparkle"
        sx={{
          position: 'absolute',
          width: size * 0.42,
          height: size * 0.42,
          top: size * 0.24,
          left: size * 0.29,
          color,
        }}
      />
    </Box>
  )
}
