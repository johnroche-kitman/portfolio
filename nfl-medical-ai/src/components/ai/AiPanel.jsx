import { useState } from 'react'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import { useNavigate } from 'react-router-dom'
import Icon from '../Icon'
import AiSuggestedActions from './AiSuggestedActions'
import AiDictationInput from './AiDictationInput'
import AiConfirmationSummary from './AiConfirmationSummary'
import { parseInjuryDictation } from '../../ai/parseInjuryDictation'
import { applyParsedInjury } from '../../ai/applyParsedInjury'
import { useAppData } from '../../state/AppDataContext'

const PANEL_WIDTH = 420

export default function AiPanel({ open, onClose }) {
  const [text, setText] = useState('')
  const [mode, setMode] = useState('compose') // 'compose' | 'confirm' | 'addDetail'
  const [result, setResult] = useState(null)
  const { athletes, createInjuryFromParsed, addNoteToInjury } = useAppData()
  const navigate = useNavigate()

  const resetToCompose = () => {
    setText('')
    setResult(null)
    setMode('compose')
  }

  const handleClose = () => {
    onClose()
    resetToCompose()
  }

  const handleSubmit = () => {
    if (!text.trim()) return

    if (mode === 'addDetail' && result?.ok) {
      addNoteToInjury(result.injury.id, text.trim())
      setResult({
        ...result,
        summaryLines: [...result.summaryLines, `Added an additional note: "${text.trim()}"`],
      })
      setText('')
      setMode('confirm')
      return
    }

    const parsed = parseInjuryDictation(text, { athletes })
    const outcome = applyParsedInjury(parsed, { createInjuryFromParsed })
    setResult(outcome)
    setText('')
    setMode('confirm')
  }

  const handleAddMoreDetail = () => {
    setMode('addDetail')
  }

  const handleLogAnother = () => {
    resetToCompose()
  }

  const handleGoToQueue = () => {
    handleClose()
    navigate('/medical/review-queue')
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { width: PANEL_WIDTH, backgroundColor: 'var(--background)' } }}
    >
      <Box display="flex" flexDirection="column" height="100%">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 2.5, borderBottom: '1px solid var(--divider)', backgroundColor: 'var(--white)' }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Icon name="ai" sx={{ color: 'var(--color-primary)' }} />
            <Typography variant="h2">Ask AI</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Icon name="close" fontSize="small" />
          </IconButton>
        </Box>

        <Box flexGrow={1} sx={{ p: 2.5, overflowY: 'auto' }}>
          {mode === 'compose' && (
            <Box display="flex" flexDirection="column" gap={3}>
              <AiSuggestedActions onSelect={() => {}} />
              <Divider sx={{ borderColor: 'var(--divider)' }} />
              <Box>
                <Typography variant="body1" sx={{ color: 'var(--grey-100)', mb: 1 }}>
                  Or dictate/type an instruction
                </Typography>
                <AiDictationInput
                  value={text}
                  onChange={setText}
                  onSubmit={handleSubmit}
                  placeholder="e.g. Create a new injury for..."
                />
              </Box>
            </Box>
          )}

          {mode === 'addDetail' && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography variant="body1" sx={{ color: 'var(--grey-100)' }}>
                Add more information for this injury.
              </Typography>
              <AiDictationInput
                value={text}
                onChange={setText}
                onSubmit={handleSubmit}
                autoFocus
                placeholder="e.g. Also noted mild bruising on the lateral ankle."
              />
            </Box>
          )}

          {mode === 'confirm' && result && (
            <AiConfirmationSummary
              result={result}
              onAddMoreDetail={handleAddMoreDetail}
              onLogAnother={handleLogAnother}
              onGoToQueue={handleGoToQueue}
            />
          )}
        </Box>
      </Box>
    </Drawer>
  )
}
