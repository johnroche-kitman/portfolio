import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ButtonBase from '@mui/material/ButtonBase'
import Icon from '../Icon'
import AiResponseTable from './AiResponseTable'

function AssistantText({ text }) {
  const paragraphs = text.split('\n').filter((line) => line.length > 0)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      {paragraphs.map((line, index) => (
        <Typography key={index} variant="body1" sx={{ color: 'var(--color-primary)', whiteSpace: 'pre-wrap' }}>
          {line}
        </Typography>
      ))}
    </Box>
  )
}

export default function AiChatMessage({ message }) {
  if (message.role === 'user') {
    return (
      <Box display="flex" justifyContent="flex-end">
        <Box
          sx={{
            maxWidth: '85%',
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            px: 2,
            py: 1.25,
          }}
        >
          <Typography variant="body1" sx={{ color: '#ffffff' }}>
            {message.text}
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box>
      <AssistantText text={message.text} />
      {message.table && (
        <>
          <ButtonBase sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1.5, borderRadius: 1 }}>
            <Icon name="explore" fontSize="small" sx={{ color: 'var(--color-primary)' }} />
            <Typography variant="body1" sx={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              Open in Explore
            </Typography>
          </ButtonBase>
          <AiResponseTable table={message.table} />
        </>
      )}
    </Box>
  )
}
