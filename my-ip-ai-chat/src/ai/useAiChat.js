import { useCallback, useEffect, useRef, useState } from 'react'
import { AGENTS, getAgent } from '../data/agents'
import { SEED_HISTORY } from '../data/history'
import { getMockResponse, getMockTitle } from './mockResponses'

let idCounter = 0
function nextId(prefix) {
  idCounter += 1
  return `${prefix}-${idCounter}`
}

const THINKING_DELAY_MS = 15000

export function useAiChat() {
  const [open, setOpen] = useState(false)
  const [chats, setChats] = useState(SEED_HISTORY)
  const [activeChatId, setActiveChatId] = useState(null)
  const [view, setView] = useState('agent-picker') // 'agent-picker' | 'chat' | 'history'
  const [selectedAgentKey, setSelectedAgentKey] = useState(AGENTS[0].key)
  const [inputValue, setInputValue] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [showThinkingDetail, setShowThinkingDetail] = useState(false)

  // Per-chat pending state, since a request keeps running in the background
  // after the panel is closed (that's how the "answer ready" toast works).
  const [thinkingChatIds, setThinkingChatIds] = useState(() => new Set())
  const [elapsedByChatId, setElapsedByChatId] = useState({})
  const [unseenChatIds, setUnseenChatIds] = useState(() => new Set())
  const [toast, setToast] = useState(null) // { chatId, agentLabel } | null

  const timersRef = useRef({}) // chatId -> { timeoutId, intervalId, startedAt }
  const openRef = useRef(open)
  const activeChatIdRef = useRef(activeChatId)

  useEffect(() => {
    openRef.current = open
  }, [open])
  useEffect(() => {
    activeChatIdRef.current = activeChatId
  }, [activeChatId])

  // Viewing a chat (panel open and it's the one on screen) counts as "seen".
  useEffect(() => {
    if (open && activeChatId && unseenChatIds.has(activeChatId)) {
      setUnseenChatIds((prev) => {
        const next = new Set(prev)
        next.delete(activeChatId)
        return next
      })
      setToast((prev) => (prev && prev.chatId === activeChatId ? null : prev))
    }
  }, [open, activeChatId, unseenChatIds])

  const activeChat = chats.find((chat) => chat.id === activeChatId) || null
  const agentKeyForInput = activeChat ? activeChat.agentKey : selectedAgentKey
  const isThinking = !!(activeChatId && thinkingChatIds.has(activeChatId))
  const thinkingElapsedMs = (activeChatId && elapsedByChatId[activeChatId]) || 0
  const hasUnseen = unseenChatIds.size > 0

  const clearChatTimer = useCallback((chatId) => {
    const timer = timersRef.current[chatId]
    if (timer) {
      clearTimeout(timer.timeoutId)
      clearInterval(timer.intervalId)
      delete timersRef.current[chatId]
    }
    setElapsedByChatId((prev) => {
      if (!(chatId in prev)) return prev
      const next = { ...prev }
      delete next[chatId]
      return next
    })
  }, [])

  const openPanel = useCallback(() => setOpen(true), [])
  const closePanel = useCallback(() => setOpen(false), [])

  const startNewChat = useCallback(() => {
    setActiveChatId(null)
    setView('agent-picker')
    setInputValue('')
    setShowThinkingDetail(false)
    setSelectedAgentKey(AGENTS[0].key)
  }, [])

  const showHistory = useCallback(() => {
    setView('history')
  }, [])

  const openChatFromHistory = useCallback(
    (chatId) => {
      const chat = chats.find((item) => item.id === chatId)
      if (!chat) return
      setActiveChatId(chatId)
      setSelectedAgentKey(chat.agentKey)
      setView('chat')
      setInputValue('')
      setShowThinkingDetail(false)
    },
    [chats]
  )

  const dismissToast = useCallback(() => setToast(null), [])

  const openFromToast = useCallback(() => {
    if (!toast) return
    const chatId = toast.chatId
    setOpen(true)
    openChatFromHistory(chatId)
  }, [toast, openChatFromHistory])

  const runAssistantReply = useCallback(
    (chatId, agentKey, question) => {
      clearChatTimer(chatId)
      setThinkingChatIds((prev) => new Set(prev).add(chatId))
      const startedAt = Date.now()
      const intervalId = setInterval(() => {
        setElapsedByChatId((prev) => ({ ...prev, [chatId]: Date.now() - startedAt }))
      }, 1000)

      const timeoutId = setTimeout(() => {
        const response = getMockResponse(agentKey, question)
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    { id: nextId('msg'), role: 'assistant', text: response.text, table: response.table },
                  ],
                }
              : chat
          )
        )
        clearChatTimer(chatId)
        setThinkingChatIds((prev) => {
          const next = new Set(prev)
          next.delete(chatId)
          return next
        })

        const isBeingViewed = openRef.current && activeChatIdRef.current === chatId
        if (!isBeingViewed) {
          setUnseenChatIds((prev) => new Set(prev).add(chatId))
          setToast({ chatId, agentLabel: getAgent(agentKey).label })
        }
      }, THINKING_DELAY_MS)

      timersRef.current[chatId] = { timeoutId, intervalId, startedAt }
    },
    [clearChatTimer]
  )

  const sendMessage = useCallback(
    (rawText, agentKeyOverride) => {
      const text = (rawText ?? inputValue).trim()
      if (!text) return
      if (activeChat && thinkingChatIds.has(activeChat.id)) return

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
    [activeChat, inputValue, thinkingChatIds, runAssistantReply, selectedAgentKey]
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

  const cancelThinking = useCallback(() => {
    if (!activeChatId) return
    clearChatTimer(activeChatId)
    setThinkingChatIds((prev) => {
      const next = new Set(prev)
      next.delete(activeChatId)
      return next
    })
  }, [activeChatId, clearChatTimer])

  return {
    open,
    openPanel,
    closePanel,
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
    showThinkingDetail,
    toggleShowThinkingDetail: () => setShowThinkingDetail((prev) => !prev),
    expanded,
    setExpanded,
    startNewChat,
    showHistory,
    openChatFromHistory,
    sendMessage,
    selectAgentCard,
    cancelThinking,
    canPickAgent: !activeChat,
    hasUnseen,
    toast,
    dismissToast,
    openFromToast,
  }
}
