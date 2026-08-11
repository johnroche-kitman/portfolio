import { useCallback, useRef, useState } from 'react'
import { AGENTS } from '../data/agents'
import { SEED_HISTORY } from '../data/history'
import { getMockResponse, getMockTitle } from './mockResponses'

let idCounter = 0
function nextId(prefix) {
  idCounter += 1
  return `${prefix}-${idCounter}`
}

export function useAiChat() {
  const [chats, setChats] = useState(SEED_HISTORY)
  const [activeChatId, setActiveChatId] = useState(null)
  const [view, setView] = useState('agent-picker') // 'agent-picker' | 'chat' | 'history'
  const [selectedAgentKey, setSelectedAgentKey] = useState(AGENTS[0].key)
  const [inputValue, setInputValue] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [showThinkingDetail, setShowThinkingDetail] = useState(false)
  const [thinkingElapsedMs, setThinkingElapsedMs] = useState(0)
  const thinkingTimeout = useRef(null)
  const thinkingInterval = useRef(null)
  const thinkingStartedAt = useRef(0)

  const stopThinkingTimer = useCallback(() => {
    clearTimeout(thinkingTimeout.current)
    clearInterval(thinkingInterval.current)
    setThinkingElapsedMs(0)
  }, [])

  const activeChat = chats.find((chat) => chat.id === activeChatId) || null
  const agentKeyForInput = activeChat ? activeChat.agentKey : selectedAgentKey

  const resetConversation = useCallback(() => {
    stopThinkingTimer()
    setActiveChatId(null)
    setView('agent-picker')
    setInputValue('')
    setIsThinking(false)
    setShowThinkingDetail(false)
    setSelectedAgentKey(AGENTS[0].key)
  }, [stopThinkingTimer])

  const startNewChat = useCallback(() => {
    resetConversation()
  }, [resetConversation])

  const showHistory = useCallback(() => {
    setView('history')
  }, [])

  const openChatFromHistory = useCallback(
    (chatId) => {
      const chat = chats.find((item) => item.id === chatId)
      if (!chat) return
      stopThinkingTimer()
      setActiveChatId(chatId)
      setSelectedAgentKey(chat.agentKey)
      setView('chat')
      setInputValue('')
      setIsThinking(false)
      setShowThinkingDetail(false)
    },
    [chats, stopThinkingTimer]
  )

  const runAssistantReply = useCallback(
    (chatId, agentKey, question) => {
      setIsThinking(true)
      setShowThinkingDetail(false)
      stopThinkingTimer()
      thinkingStartedAt.current = Date.now()
      setThinkingElapsedMs(0)
      thinkingInterval.current = setInterval(() => {
        setThinkingElapsedMs(Date.now() - thinkingStartedAt.current)
      }, 1000)
      thinkingTimeout.current = setTimeout(() => {
        const response = getMockResponse(agentKey, question)
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    {
                      id: nextId('msg'),
                      role: 'assistant',
                      text: response.text,
                      table: response.table,
                    },
                  ],
                }
              : chat
          )
        )
        stopThinkingTimer()
        setIsThinking(false)
      }, 15000)
    },
    [stopThinkingTimer]
  )

  const cancelThinking = useCallback(() => {
    stopThinkingTimer()
    setIsThinking(false)
  }, [stopThinkingTimer])

  const sendMessage = useCallback(
    (rawText, agentKeyOverride) => {
      const text = (rawText ?? inputValue).trim()
      if (!text || isThinking) return

      const userMessage = { id: nextId('msg'), role: 'user', text }

      if (activeChat) {
        const chatId = activeChat.id
        setChats((prev) =>
          prev.map((chat) => (chat.id === chatId ? { ...chat, messages: [...chat.messages, userMessage] } : chat))
        )
        setInputValue('')
        runAssistantReply(chatId, activeChat.agentKey, text)
        return
      }

      const agentKey = agentKeyOverride || selectedAgentKey
      const chatId = nextId('chat')
      const newChat = {
        id: chatId,
        title: getMockTitle(text),
        agentKey,
        messages: [userMessage],
      }
      setChats((prev) => [newChat, ...prev])
      setActiveChatId(chatId)
      setView('chat')
      setInputValue('')
      runAssistantReply(chatId, agentKey, text)
    },
    [activeChat, inputValue, isThinking, runAssistantReply, selectedAgentKey]
  )

  const selectAgentCard = useCallback(
    (agentKey) => {
      const agent = AGENTS.find((item) => item.key === agentKey)
      if (!agent) return
      setSelectedAgentKey(agentKey)
      sendMessage(agent.example, agentKey)
    },
    [sendMessage]
  )

  return {
    chats,
    activeChat,
    view,
    setView,
    selectedAgentKey,
    setSelectedAgentKey,
    agentKeyForInput,
    inputValue,
    setInputValue,
    isThinking,
    thinkingElapsedMs,
    cancelThinking,
    showThinkingDetail,
    toggleShowThinkingDetail: () => setShowThinkingDetail((prev) => !prev),
    expanded,
    setExpanded,
    startNewChat,
    showHistory,
    openChatFromHistory,
    sendMessage,
    selectAgentCard,
    resetConversation,
    canPickAgent: !activeChat,
  }
}
