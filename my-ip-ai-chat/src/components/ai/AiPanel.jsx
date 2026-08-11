import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import { useAiChat } from '../../ai/useAiChat'
import AiPanelHeader from './AiPanelHeader'
import AiPanelBody from './AiPanelBody'
import AiPanelSidebar from './AiPanelSidebar'
import AiInputBar from './AiInputBar'

const COLLAPSED_WIDTH = 460

export default function AiPanel({ open, onClose, chatState }) {
  const chatApi = chatState
  const { view, activeChat, chats, expanded, isThinking, thinkingElapsedMs, showThinkingDetail } = chatApi

  function handleClose() {
    onClose()
    chatApi.resetConversation()
  }

  const title = view === 'history' ? 'History' : activeChat ? activeChat.title : 'New chat'
  const showNewChat = view !== 'agent-picker' && !expanded
  const showHistory = !expanded
  const showInput = view !== 'history'

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      ModalProps={{ hideBackdrop: true, disableScrollLock: true }}
      PaperProps={{
        sx: {
          width: expanded ? `calc(100vw - var(--nav-width))` : COLLAPSED_WIDTH,
          display: 'flex',
          flexDirection: 'row',
          transition: 'width 0.22s ease',
        },
      }}
    >
      {expanded && (
        <AiPanelSidebar chats={chats} onNewChat={chatApi.startNewChat} onSelectChat={chatApi.openChatFromHistory} />
      )}

      <Box display="flex" flexDirection="column" height="100%" minHeight={0} flexGrow={1} minWidth={0}>
        <AiPanelHeader
          title={title}
          showNewChat={showNewChat}
          showHistory={showHistory}
          expanded={expanded}
          onNewChat={chatApi.startNewChat}
          onHistory={chatApi.showHistory}
          onToggleExpand={() => chatApi.setExpanded((prev) => !prev)}
          onClose={handleClose}
        />

        <Box display="flex" flexDirection="column" flexGrow={1} minHeight={0} sx={{ maxWidth: expanded ? 900 : 'none', width: '100%', mx: expanded ? 'auto' : 0 }}>
          <AiPanelBody
            view={view}
            chat={activeChat}
            chats={chats}
            isThinking={isThinking}
            thinkingElapsedMs={thinkingElapsedMs}
            showThinkingDetail={showThinkingDetail}
            onToggleThinkingDetail={chatApi.toggleShowThinkingDetail}
            onSelectAgent={chatApi.selectAgentCard}
            onSelectHistoryChat={chatApi.openChatFromHistory}
          />

          {showInput && (
            <AiInputBar
              agentKey={chatApi.agentKeyForInput}
              onChangeAgent={chatApi.setSelectedAgentKey}
              canChangeAgent={chatApi.canPickAgent}
              value={chatApi.inputValue}
              onChange={chatApi.setInputValue}
              onSubmit={() => chatApi.sendMessage()}
              onStop={chatApi.cancelThinking}
              isThinking={isThinking}
            />
          )}
        </Box>
      </Box>
    </Drawer>
  )
}
