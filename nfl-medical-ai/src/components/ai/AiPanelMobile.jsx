import { useAiConversation } from '../../ai/useAiConversation'
import AiPanelBody from './AiPanelBody'
import InjurySummaryModal from '../injury/InjurySummaryModal'

// The Ask AI experience filling the entire mobile phone frame — same
// conversation hook as the desktop drawer (AiPanel), so an injury/note/
// rehab/summary created here lands in the same review queue. No close
// button: this IS the mobile screen's content, not an overlay.
export default function AiPanelMobile() {
  const conversation = useAiConversation()

  return (
    <>
      <AiPanelBody
        messages={conversation.messages}
        scrollRef={conversation.scrollRef}
        inputValue={conversation.inputValue}
        onInputChange={conversation.setInputValue}
        onSend={conversation.handleSend}
        placeholder={conversation.placeholder}
        onSelectSuggestion={conversation.handleSelectSuggestion}
      />

      <InjurySummaryModal
        open={!!conversation.summaryAthleteId}
        athleteId={conversation.summaryAthleteId}
        onClose={() => conversation.setSummaryAthleteId(null)}
      />
    </>
  )
}
