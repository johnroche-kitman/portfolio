import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ButtonBase from '@mui/material/ButtonBase'
import Icon from '../Icon'

const SUGGESTIONS = [
  {
    key: 'log-injury',
    label: 'Log a new injury',
    description: 'Dictate the details and I will fill out the injury record for you.',
    icon: 'noteAdd',
    enabled: true,
    template: 'Create a new injury for ',
  },
  {
    key: 'add-note',
    label: 'Add a note',
    description: 'Update an existing injury with a dictated progress note.',
    icon: 'factCheck',
    enabled: true,
    template: 'Update note for ',
  },
  {
    key: 'create-rehab',
    label: 'Create a rehab program',
    description: 'Dictate the exercises and I will schedule them for today.',
    icon: 'rehab',
    enabled: true,
    template: 'Create a new rehab program for today for ',
  },
  {
    key: 'update-status',
    label: 'Update availability status',
    description: 'Coming soon: change a player\'s status from a sentence.',
    icon: 'update',
    enabled: false,
  },
]

export default function AiSuggestedActions({ onSelect }) {
  return (
    <Box display="flex" flexDirection="column" gap={1.5}>
      <Typography variant="body1" sx={{ color: 'var(--grey-100)' }}>
        Popular actions
      </Typography>
      {SUGGESTIONS.map((suggestion) => (
        <ButtonBase
          key={suggestion.key}
          onClick={() => suggestion.enabled && onSelect(suggestion)}
          disabled={!suggestion.enabled}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
            p: 1.5,
            borderRadius: '8px',
            border: '1px solid var(--divider)',
            textAlign: 'left',
            opacity: suggestion.enabled ? 1 : 0.55,
            '&:hover': suggestion.enabled ? { backgroundColor: 'var(--neutral-200)' } : {},
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              backgroundColor: 'var(--neutral-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)',
              flexShrink: 0,
            }}
          >
            <Icon name={suggestion.icon} fontSize="small" />
          </Box>
          <Box>
            <Typography variant="body1" fontWeight={600}>
              {suggestion.label}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
              {suggestion.description}
            </Typography>
          </Box>
        </ButtonBase>
      ))}
    </Box>
  )
}
