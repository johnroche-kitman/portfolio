import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import AiPanelHeader from './AiPanelHeader'
import AiPanelBody from './AiPanelBody'
import AiPanelSidebar from './AiPanelSidebar'
import AiInputBar from './AiInputBar'

const COLLAPSED_WIDTH = 460

// Which edge the panel slides in from. In v1 the launcher lives in the main
// nav rail, so the panel opens alongside it on the left; the other variants
// launch from the toolbar/app bar and keep it on the right.
export default function AiPanel({ open, onClose, chatState, anchor = 'right' }) {
  const chatApi = chatState
  const anchorLeft = anchor === 'left'
  const { view, activeChat, chats, expanded, isThinking, thinkingElapsedMs, showThinkingDetail } = chatApi

  const title = view === 'history' ? 'History' : activeChat ? activeChat.title : 'New chat'
  const showNewChat = view !== 'agent-picker' && !expanded
  const showHistory = !expanded
  const showInput = view !== 'history'

  function handleToggleExpand() {
    // Expanding while on the History screen would otherwise show history
    // twice — once in the sidebar, once as the main content — so land on
    // a fresh chat instead.
    if (!expanded && view === 'history') {
      chatApi.startNewChat()
    }
    chatApi.setExpanded((prev) => !prev)
  }

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      ModalProps={{ hideBackdrop: true, disableScrollLock: true }}
      PaperProps={{
        sx: {
          width: expanded ? `calc(100vw - var(--nav-width))` : COLLAPSED_WIDTH,
          // Left-anchored, MUI pins the paper to left: 0, which would put it
          // underneath the nav rail. Offset it so the panel starts where the
          // rail ends - which also makes the expanded width above line up,
          // since it's measured from the rail's inner edge either way.
          ...(anchorLeft && { left: 'var(--nav-width)' }),
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
          onToggleExpand={handleToggleExpand}
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
