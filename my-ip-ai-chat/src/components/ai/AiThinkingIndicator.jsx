import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'
import Collapse from '@mui/material/Collapse'
import Icon from '../Icon'

const THINKING_STEPS = ['Interpreting your question', 'Querying the relevant data source', 'Formatting the results']

function formatElapsed(ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
}

export default function AiThinkingIndicator({ label, elapsedMs, expanded, onToggle }) {
  return (
    <Box sx={{ mt: 1 }}>
      <ButtonBase onClick={onToggle} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography variant="body1" sx={{ color: 'var(--grey-100)' }}>
          {expanded ? 'Hide thinking' : 'Show thinking'}
        </Typography>
        <Icon
          name="expandMore"
          fontSize="small"
          sx={{ color: 'var(--grey-100)', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
        />
      </ButtonBase>

      <Collapse in={expanded}>
        <Box sx={{ mt: 0.5, mb: 0.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {THINKING_STEPS.map((step) => (
            <Typography key={step} variant="body2" sx={{ color: 'var(--grey-100)' }}>
              • {step}
            </Typography>
          ))}
        </Box>
      </Collapse>

      <Box display="flex" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
        <Box display="flex" gap={0.5}>
          {[0, 1, 2].map((dot) => (
            <Box
              key={dot}
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                animation: 'ai-thinking-bounce 1.4s infinite ease-in-out',
                animationDelay: `${dot * 0.15}s`,
              }}
            />
          ))}
        </Box>
        <Typography variant="body1" sx={{ color: 'var(--color-primary)' }}>
          {label}
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ color: 'var(--grey-100)', mt: 0.25 }}>
        {formatElapsed(elapsedMs)}
      </Typography>
    </Box>
  )
}
