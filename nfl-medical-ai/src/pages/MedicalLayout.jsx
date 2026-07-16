import { useState } from 'react'
import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'
import MainNavigation from '../components/MainNavigation'
import TopStrip from '../components/TopStrip'
import AiFab from '../components/ai/AiFab'
import AiPanel from '../components/ai/AiPanel'

export default function MedicalLayout() {
  const [aiOpen, setAiOpen] = useState(false)

  return (
    <Box display="flex" sx={{ backgroundColor: 'var(--white)', minHeight: '100vh' }}>
      <MainNavigation active="medical" />
      <Box flexGrow={1} display="flex" flexDirection="column" minWidth={0}>
        <TopStrip breadcrumb="Medical" />
        <Box flexGrow={1} sx={{ px: 4, py: 3 }}>
          <Outlet />
        </Box>
      </Box>

      {!aiOpen && <AiFab onClick={() => setAiOpen(true)} />}
      <AiPanel open={aiOpen} onClose={() => setAiOpen(false)} />
    </Box>
  )
}
