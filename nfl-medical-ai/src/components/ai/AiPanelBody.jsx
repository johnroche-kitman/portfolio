import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Icon from '../Icon'
import AiSuggestedActions from './AiSuggestedActions'
import AiDictationInput from './AiDictationInput'
import AiChatMessage from './AiChatMessage'

// Presentational Ask AI content: header, scrollable suggestions/chat, and
// the dictation input. Shared by the desktop drawer (AiPanel) and the
// full-screen mobile view so both stay pixel-for-pixel identical and
// behave exactly the same way. `onClose` is optional — when omitted (the
// mobile view, which has nothing to close to) the close button is hidden.
export default function AiPanelBody({
  messages,
  scrollRef,
  inputValue,
  onInputChange,
  onSend,
  placeholder,
  onSelectSuggestion,
  onClose,
}) {
  return (
    <Box display="flex" flexDirection="column" height="100%" minHeight={0}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 2.5, borderBottom: '1px solid var(--divider)', backgroundColor: 'var(--white)', flexShrink: 0 }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Icon name="ai" sx={{ color: 'var(--color-primary)' }} />
          <Typography variant="h2">Ask AI</Typography>
        </Box>
        {onClose && (
          <IconButton onClick={onClose} size="small">
            <Icon name="close" fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Box
        ref={scrollRef}
        flexGrow={1}
        minHeight={0}
        display="flex"
        flexDirection="column"
        gap={2}
        sx={{ p: 2.5, overflowY: 'auto', backgroundColor: 'var(--background)' }}
      >
        <AiSuggestedActions onSelect={onSelectSuggestion} />
        {messages.length > 0 && <Divider sx={{ borderColor: 'var(--divider)' }} />}
        {messages.map((message) => (
          <AiChatMessage key={message.id} message={message} />
        ))}
      </Box>

      <Box sx={{ p: 2.5, borderTop: '1px solid var(--divider)', backgroundColor: 'var(--white)', flexShrink: 0 }}>
        <AiDictationInput value={inputValue} onChange={onInputChange} onSubmit={onSend} placeholder={placeholder} />
      </Box>
    </Box>
  )
}
