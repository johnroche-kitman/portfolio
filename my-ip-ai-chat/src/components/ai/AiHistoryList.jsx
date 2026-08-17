import { useState } from 'react'
import Box from '@mui/material/Box'
import InputBase from '@mui/material/InputBase'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Icon from '../Icon'
import { getAgent } from '../../data/agents'

const SNIPPET_CONTEXT_CHARS = 40

// Finds the first case-insensitive occurrence of `query` in `text` and
// returns the surrounding window, split into before/match/after so the
// match can be rendered in bold. Returns null if there's no occurrence.
function findSnippet(text, query) {
  const index = text.toLowerCase().indexOf(query.toLowerCase())
  if (index === -1) return null
  let start = Math.max(0, index - SNIPPET_CONTEXT_CHARS)
  let end = Math.min(text.length, index + query.length + SNIPPET_CONTEXT_CHARS)
  // Snap both edges out to the nearest word boundary so the snippet never
  // cuts a word in half (e.g. "...hletes are..." instead of "...athletes are...").
  if (start > 0) {
    const nextSpace = text.indexOf(' ', start)
    if (nextSpace !== -1 && nextSpace < index) start = nextSpace + 1
  }
  if (end < text.length) {
    const prevSpace = text.lastIndexOf(' ', end)
    if (prevSpace !== -1 && prevSpace > index + query.length) end = prevSpace
  }
  return {
    before: text.slice(start, index),
    match: text.slice(index, index + query.length),
    after: text.slice(index + query.length, end),
  }
}

// Searches a chat's messages (in order) for the first line containing the
// query, falling back to the title so a title-only match still surfaces.
function findChatSnippet(chat, query) {
  for (const message of chat.messages) {
    const snippet = findSnippet(message.text, query)
    if (snippet) return snippet
  }
  return findSnippet(chat.title, query)
}

function SnippetText({ snippet }) {
  return (
    <Typography
      variant="body2"
      component="span"
      sx={{ color: 'var(--grey-100)', display: 'block', mt: 0.25 }}
    >
      ...{snippet.before}
      <Box component="span" sx={{ fontWeight: 700, color: 'var(--color-primary)' }}>
        {snippet.match}
      </Box>
      {snippet.after}...
    </Typography>
  )
}

function HistoryListItem({ chat, onSelect, dense, snippet }) {
  const [menuAnchor, setMenuAnchor] = useState(null)
  const agent = getAgent(chat.agentKey)

  function handleMenuOpen(event) {
    event.stopPropagation()
    setMenuAnchor(event.currentTarget)
  }

  function handleMenuClose(event) {
    event?.stopPropagation()
    setMenuAnchor(null)
  }

  return (
    <ListItemButton
      onClick={() => onSelect(chat.id)}
      sx={{
        px: dense ? 2 : 3,
        py: dense ? 0.75 : 1.25,
        alignItems: snippet ? 'flex-start' : 'center',
        '&:hover .history-item-more': { opacity: 1 },
      }}
    >
      <ListItemIcon sx={{ minWidth: 36, color: 'var(--color-primary)', mt: snippet ? 0.25 : 0 }}>
        <Icon name={agent.icon} fontSize="small" />
      </ListItemIcon>
      <ListItemText
        primary={chat.title}
        secondary={snippet ? <SnippetText snippet={snippet} /> : null}
        primaryTypographyProps={{
          variant: 'body1',
          sx: { color: 'var(--color-primary)', fontWeight: dense ? 400 : 600 },
        }}
      />
      <IconButton
        size="small"
        onClick={handleMenuOpen}
        className="history-item-more"
        sx={{ opacity: menuAnchor ? 1 : 0, color: 'var(--color-primary)', ml: 1 }}
      >
        <Icon name="moreVert" fontSize="small" />
      </IconButton>
      <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={handleMenuClose} onClick={(event) => event.stopPropagation()}>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Icon name="edit" fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename chat</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Icon name="delete" fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete chat</ListItemText>
        </MenuItem>
      </Menu>
    </ListItemButton>
  )
}

export default function AiHistoryList({ chats, onSelect, dense }) {
  const [search, setSearch] = useState('')

  if (!chats.length) {
    return (
      <Typography variant="body1" sx={{ color: 'var(--grey-100)', px: 3, pt: 2 }}>
        No conversations yet.
      </Typography>
    )
  }

  const query = search.trim()
  const results = query
    ? chats
        .map((chat) => ({ chat, snippet: findChatSnippet(chat, query) }))
        .filter((result) => result.snippet)
    : null

  return (
    <>
      <Box sx={{ px: dense ? 2 : 3, pt: dense ? 0 : 0.75, pb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: 'var(--color-secondary)',
            borderRadius: '4px 4px 0 0',
            borderBottom: '1px solid var(--input-underline)',
            px: 1.5,
            py: 1,
          }}
        >
          <InputBase
            placeholder="Search chats"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ fontSize: 14, color: 'var(--color-primary)', flexGrow: 1 }}
          />
          <Icon name="search" fontSize="small" sx={{ color: 'var(--grey-100)' }} />
        </Box>
      </Box>

      {results && results.length === 0 ? (
        <Typography variant="body1" sx={{ color: 'var(--grey-100)', px: dense ? 2 : 3, pt: 1 }}>
          No results for &ldquo;{query}&rdquo;.
        </Typography>
      ) : (
        <List sx={{ py: dense ? 0.5 : 1 }}>
          {(results ?? chats.map((chat) => ({ chat, snippet: null }))).map(({ chat, snippet }) => (
            <HistoryListItem key={chat.id} chat={chat} onSelect={onSelect} dense={dense} snippet={snippet} />
          ))}
        </List>
      )}
    </>
  )
}
