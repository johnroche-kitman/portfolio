import { useState } from 'react'
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

function HistoryListItem({ chat, onSelect, dense }) {
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
        '&:hover .history-item-more': { opacity: 1 },
      }}
    >
      <ListItemIcon sx={{ minWidth: 36, color: 'var(--color-primary)' }}>
        <Icon name={agent.icon} fontSize="small" />
      </ListItemIcon>
      <ListItemText
        primary={chat.title}
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
  if (!chats.length) {
    return (
      <Typography variant="body1" sx={{ color: 'var(--grey-100)', px: 3, pt: 2 }}>
        No conversations yet.
      </Typography>
    )
  }

  return (
    <List sx={{ py: dense ? 0.5 : 1 }}>
      {chats.map((chat) => (
        <HistoryListItem key={chat.id} chat={chat} onSelect={onSelect} dense={dense} />
      ))}
    </List>
  )
}
