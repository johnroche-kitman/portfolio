import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Icon from '../Icon'
import Button from '../Button'

export default function AiChatMessage({ message }) {
  const isUser = message.role === 'user'
  const isError = message.tone === 'error'

  return (
    <Box display="flex" justifyContent={isUser ? 'flex-end' : 'flex-start'}>
      <Box
        sx={{
          maxWidth: '88%',
          borderRadius: '12px',
          borderTopRightRadius: isUser ? '2px' : '12px',
          borderTopLeftRadius: isUser ? '12px' : '2px',
          px: 2,
          py: 1.5,
          backgroundColor: isUser ? 'var(--color-primary)' : isError ? '#fbe6e7' : 'var(--neutral-200)',
          color: isUser ? '#ffffff' : isError ? 'var(--color-error)' : 'inherit',
        }}
      >
        {message.text && (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {message.text}
          </Typography>
        )}

        {message.lines && (
          <Box display="flex" flexDirection="column" gap={0.75} sx={{ mt: message.text ? 1 : 0 }}>
            {message.lines.map((line) => (
              <Box key={line} display="flex" alignItems="flex-start" gap={1}>
                <Icon name="taskAlt" fontSize="small" sx={{ color: 'var(--color-success)', mt: '2px', flexShrink: 0 }} />
                <Typography variant="body1">{line}</Typography>
              </Box>
            ))}
          </Box>
        )}

        {message.options?.length > 0 && (
          <Box display="flex" flexDirection="column" gap={1} sx={{ mt: message.text || message.lines ? 1.5 : 0 }}>
            {message.options.map((option) => (
              <Button
                key={option.label}
                tone={option.tone === 'primary' ? 'primary' : 'secondary'}
                size="small"
                onClick={option.onSelect}
                fullWidth
                sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
              >
                {option.label}
              </Button>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}
