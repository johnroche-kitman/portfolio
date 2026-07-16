import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Icon from '../Icon'
import Button from '../Button'

export default function AiConfirmationSummary({ result, resultType, onAddMoreDetail, onLogAnother, onGoToQueue }) {
  const isNote = resultType === 'note'
  if (!result.ok) {
    return (
      <Box display="flex" flexDirection="column" gap={2}>
        <Box
          sx={{
            p: 2,
            borderRadius: '8px',
            backgroundColor: '#fbe6e7',
            color: 'var(--color-error)',
          }}
        >
          <Typography variant="body1">{result.error}</Typography>
        </Box>
        <Button tone="secondary" onClick={onLogAnother}>
          Try again
        </Button>
      </Box>
    )
  }

  return (
    <Box display="flex" flexDirection="column" gap={2.5}>
      <Box display="flex" alignItems="center" gap={1}>
        <Icon name="checkCircle" sx={{ color: 'var(--color-success)' }} />
        <Typography variant="h2">Done</Typography>
      </Box>

      <Box display="flex" flexDirection="column" gap={1}>
        {result.summaryLines.map((line) => (
          <Box key={line} display="flex" alignItems="flex-start" gap={1}>
            <Icon name="taskAlt" fontSize="small" sx={{ color: 'var(--color-success)', mt: '2px' }} />
            <Typography variant="body1">{line}</Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ borderColor: 'var(--divider)' }} />

      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="body1" sx={{ color: 'var(--grey-100)' }}>
          What would you like to do next?
        </Typography>
        <Button tone="secondary" onClick={onAddMoreDetail} fullWidth sx={{ justifyContent: 'flex-start' }}>
          Add more information to this {isNote ? 'note' : 'injury'}
        </Button>
        <Button tone="secondary" onClick={onLogAnother} fullWidth sx={{ justifyContent: 'flex-start' }}>
          {isNote ? 'Add another note for someone else' : 'Log another injury for someone else'}
        </Button>
        <Button onClick={onGoToQueue} fullWidth sx={{ justifyContent: 'flex-start' }}>
          Go to my review queue
        </Button>
      </Box>
    </Box>
  )
}
