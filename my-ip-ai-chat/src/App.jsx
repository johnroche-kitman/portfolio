import Box from '@mui/material/Box'
import MainNavigation from './components/MainNavigation'
import TopBar from './components/TopBar'
import MyIpLanding from './pages/MyIpLanding'
import AiPanel from './components/ai/AiPanel'
import AiResponseToast from './components/ai/AiResponseToast'
import SupportFab from './components/SupportFab'
import { useAiChat } from './ai/useAiChat'

export default function App() {
  const chatState = useAiChat()

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <MainNavigation onOpenChat={chatState.openPanel} chatOpen={chatState.open} hasUnseen={chatState.hasUnseen} />
      <Box sx={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        <MyIpLanding />
      </Box>
      <SupportFab />
      <AiPanel open={chatState.open} onClose={chatState.closePanel} chatState={chatState} />
      <AiResponseToast toast={chatState.toast} onOpen={chatState.openFromToast} onDismiss={chatState.dismissToast} />
    </Box>
  )
}
