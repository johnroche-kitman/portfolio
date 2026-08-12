import Box from '@mui/material/Box'
import MainNavigation from '../components/MainNavigation'
import TopBar from '../components/TopBar'
import MyIpLanding from './MyIpLanding'
import AiPanel from '../components/ai/AiPanel'
import AiResponseToast from '../components/ai/AiResponseToast'
import SupportFab from '../components/SupportFab'
import { useAiChat } from '../ai/useAiChat'

// The three prototype versions are identical except for where the Ask My iP
// launcher lives: the left nav rail, the My iP toolbar, or the top app bar.
export default function PrototypeShell({ triggerLocation }) {
  const chatState = useAiChat()

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <MainNavigation
        onOpenChat={chatState.openPanel}
        chatOpen={chatState.open}
        hasUnseen={chatState.hasUnseen}
        showTrigger={triggerLocation === 'nav'}
      />
      <Box sx={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBar showTrigger={triggerLocation === 'appbar'} onOpenChat={chatState.openPanel} hasUnseen={chatState.hasUnseen} />
        <MyIpLanding showTrigger={triggerLocation === 'toolbar'} onOpenChat={chatState.openPanel} hasUnseen={chatState.hasUnseen} />
      </Box>
      <SupportFab />
      <AiPanel open={chatState.open} onClose={chatState.closePanel} chatState={chatState} />
      <AiResponseToast toast={chatState.toast} onOpen={chatState.openFromToast} onDismiss={chatState.dismissToast} />
    </Box>
  )
}
