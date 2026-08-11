import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'
import Icon from '../Icon'
import AskIpIcon from './AskIpIcon'
import { AGENTS } from '../../data/agents'

export default function AgentPicker({ onSelect }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={{ pt: 4, px: 3 }}>
      <Typography variant="h2" sx={{ color: 'var(--color-primary)', mb: 2 }}>
        Ask My iP
      </Typography>
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: 2,
          border: '2px solid var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 4,
          color: 'var(--color-primary)',
        }}
      >
        <AskIpIcon size={40} />
      </Box>

      <Typography variant="body1" sx={{ color: 'var(--color-primary)', fontWeight: 600, alignSelf: 'flex-start', mb: 1.5 }}>
        Choose an agent
      </Typography>

      <Box display="flex" flexDirection="column" gap={1.5} width="100%">
        {AGENTS.map((agent) => (
          <ButtonBase
            key={agent.key}
            onClick={() => onSelect(agent.key)}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
              textAlign: 'left',
              px: 2,
              py: 1.5,
              border: '1px solid var(--divider)',
              borderRadius: 1.5,
              '&:hover': { backgroundColor: 'var(--background)', borderColor: 'var(--color-primary)' },
            }}
          >
            <Icon name={agent.icon} sx={{ color: 'var(--color-primary)', mt: 0.25 }} />
            <Box>
              <Typography variant="body1" sx={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                {agent.label}
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
                Eg. {agent.example}
              </Typography>
            </Box>
          </ButtonBase>
        ))}
      </Box>
    </Box>
  )
}
