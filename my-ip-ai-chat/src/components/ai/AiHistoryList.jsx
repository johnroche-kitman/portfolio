import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Icon from '../Icon'
import { getAgent } from '../../data/agents'

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
      {chats.map((chat) => {
        const agent = getAgent(chat.agentKey)
        return (
          <ListItemButton
            key={chat.id}
            onClick={() => onSelect(chat.id)}
            sx={{ px: dense ? 2 : 3, py: dense ? 0.75 : 1.25 }}
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
          </ListItemButton>
        )
      })}
    </List>
  )
}
