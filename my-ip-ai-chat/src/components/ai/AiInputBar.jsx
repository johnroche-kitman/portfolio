import { useState } from 'react'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Icon from '../Icon'
import { AGENTS, getAgent } from '../../data/agents'

export default function AiInputBar({
  agentKey,
  onChangeAgent,
  canChangeAgent,
  value,
  onChange,
  onSubmit,
  onStop,
  isThinking,
}) {
  const [menuAnchor, setMenuAnchor] = useState(null)
  const agent = getAgent(agentKey)

  function handleKeyDown(event) {
    const isEnter = event.key === 'Enter' || event.keyCode === 13 || event.which === 13
    if (isEnter && !event.shiftKey) {
      event.preventDefault()
      onSubmit()
    }
  }

  return (
    <Box sx={{ borderTop: '1px solid var(--divider)', backgroundColor: 'var(--white)', flexShrink: 0 }}>
      <ButtonBase
        onClick={(event) => canChangeAgent && setMenuAnchor(event.currentTarget)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          width: '100%',
          justifyContent: 'flex-start',
          px: 2,
          py: 1,
          backgroundColor: 'var(--background)',
          cursor: canChangeAgent ? 'pointer' : 'default',
        }}
      >
        <Typography variant="body1" sx={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          {agent.label}
        </Typography>
        {canChangeAgent && <Icon name="arrowDropDown" fontSize="small" sx={{ color: 'var(--color-primary)' }} />}
      </ButtonBase>
      <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
        {AGENTS.map((item) => (
          <MenuItem
            key={item.key}
            selected={item.key === agentKey}
            onClick={() => {
              onChangeAgent(item.key)
              setMenuAnchor(null)
            }}
          >
            <ListItemIcon>
              <Icon name={item.icon} fontSize="small" />
            </ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>

      <Box sx={{ px: 2, py: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <InputBase
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={agent.placeholder}
          multiline
          maxRows={4}
          disabled={isThinking}
          sx={{ fontSize: 14, color: 'var(--color-primary)' }}
        />
        <Box display="flex" justifyContent="flex-end" alignItems="center" gap={1}>
          <IconButton size="small">
            <Icon name="mic" fontSize="small" sx={{ color: 'var(--color-primary)' }} />
          </IconButton>
          <IconButton
            onClick={isThinking ? onStop : onSubmit}
            disabled={!isThinking && !value.trim()}
            size="small"
            sx={{
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              '&:hover': { backgroundColor: 'var(--color-primary-dark)' },
              '&.Mui-disabled': { backgroundColor: 'var(--divider)', color: '#ffffff' },
            }}
          >
            <Icon name={isThinking ? 'stop' : 'send'} fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}
