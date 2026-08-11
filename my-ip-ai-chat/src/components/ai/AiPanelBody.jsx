import Box from '@mui/material/Box'
import AgentPicker from './AgentPicker'
import AiChatMessage from './AiChatMessage'
import AiThinkingIndicator from './AiThinkingIndicator'
import AiHistoryList from './AiHistoryList'
import { getAgent } from '../../data/agents'

export default function AiPanelBody({
  view,
  chat,
  chats,
  isThinking,
  thinkingElapsedMs,
  showThinkingDetail,
  onToggleThinkingDetail,
  onSelectAgent,
  onSelectHistoryChat,
}) {
  if (view === 'history') {
    return (
      <Box flexGrow={1} minHeight={0} sx={{ overflowY: 'auto', backgroundColor: 'var(--white)' }}>
        <AiHistoryList chats={chats} onSelect={onSelectHistoryChat} />
      </Box>
    )
  }

  if (view === 'agent-picker' || !chat) {
    return (
      <Box flexGrow={1} minHeight={0} sx={{ overflowY: 'auto', backgroundColor: 'var(--white)' }}>
        <AgentPicker onSelect={onSelectAgent} />
      </Box>
    )
  }

  const agent = getAgent(chat.agentKey)

  return (
    <Box
      flexGrow={1}
      minHeight={0}
      display="flex"
      flexDirection="column"
      gap={2}
      sx={{ p: 3, overflowY: 'auto', backgroundColor: 'var(--white)' }}
    >
      {chat.messages.map((message) => (
        <AiChatMessage key={message.id} message={message} />
      ))}
      {isThinking && (
        <AiThinkingIndicator
          label={agent.thinkingText}
          elapsedMs={thinkingElapsedMs}
          expanded={showThinkingDetail}
          onToggle={onToggleThinkingDetail}
        />
      )}
    </Box>
  )
}
