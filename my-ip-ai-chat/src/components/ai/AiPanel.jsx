import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import AiPanelHeader from './AiPanelHeader'
import AiPanelBody from './AiPanelBody'
import AiPanelSidebar from './AiPanelSidebar'
import AiInputBar from './AiInputBar'

const COLLAPSED_WIDTH = 460

export default function AiPanel({ open, onClose, chatState }) {
  const chatApi = chatState
  const { view, activeChat, chats, expanded, isThinking, thinkingElapsedMs, showThinkingDetail } = chatApi

  const title = view === 'history' ? 'History' : activeChat ? activeChat.title : 'New chat'
  const showNewChat = view !== 'agent-picker' && !expanded
  const showHistory = !expanded
  const showInput = view !== 'history'

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{ hideBackdrop: true, disableScrollLock: true }}
      PaperProps={{
        sx: {
          width: expanded ? `calc(100vw - var(--nav-width))` : COLLAPSED_WIDTH,
          display: 'flex',
          flexDirection: 'row',
          // MUI's Slide transition sets an inline `transition: transform ...`
          // for the open/close animation, which otherwise clobbers this
          // property outright (inline style beats a class rule unless
          // !important). Restate that same transform transition alongside
          // width so expanding animates too, without losing the slide.
          transition: 'width 0.22s ease, transform 225ms cubic-bezier(0, 0, 0.2, 1) !important',
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
          onClose={onClose}
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
