import Drawer from '@mui/material/Drawer'
import { useAiConversation } from '../../ai/useAiConversation'
import AiPanelBody from './AiPanelBody'
import InjurySummaryModal from '../injury/InjurySummaryModal'

const PANEL_WIDTH = 420

export default function AiPanel({ open, onClose }) {
  const conversation = useAiConversation({ onNavigateAway: () => handleClose() })

  function handleClose() {
    onClose()
    conversation.resetConversation()
  }

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { width: PANEL_WIDTH, display: 'flex', flexDirection: 'column' } }}
      >
        <AiPanelBody
          messages={conversation.messages}
          scrollRef={conversation.scrollRef}
          inputValue={conversation.inputValue}
          onInputChange={conversation.setInputValue}
          onSend={conversation.handleSend}
          placeholder={conversation.placeholder}
          onSelectSuggestion={conversation.handleSelectSuggestion}
          onClose={handleClose}
          isThinking={conversation.isThinking}
        />
      </Drawer>

      <InjurySummaryModal
        open={!!conversation.summaryAthleteId}
        athleteId={conversation.summaryAthleteId}
        onClose={() => conversation.setSummaryAthleteId(null)}
      />
    </>
  )
}
