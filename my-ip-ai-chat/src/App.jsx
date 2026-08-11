import { useState } from 'react'
import Box from '@mui/material/Box'
import MainNavigation from './components/MainNavigation'
import TopBar from './components/TopBar'
import MyIpLanding from './pages/MyIpLanding'
import AiPanel from './components/ai/AiPanel'
import { useAiChat } from './ai/useAiChat'

export default function App() {
  const [chatOpen, setChatOpen] = useState(false)
  const chatState = useAiChat()

  function handleOpenChat() {
    setChatOpen(true)
  }

  function handleCloseChat() {
    setChatOpen(false)
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <MainNavigation onOpenChat={handleOpenChat} chatOpen={chatOpen} />
      <Box sx={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        <MyIpLanding />
      </Box>
      <AiPanel open={chatOpen} onClose={handleCloseChat} chatState={chatState} />
    </Box>
  )
}
