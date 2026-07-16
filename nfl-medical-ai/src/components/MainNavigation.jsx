import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Icon from './Icon'

const NAV_ITEMS = [
  { key: 'medical', name: 'medical', label: 'Medical' },
  { key: 'chart', name: 'chart', label: 'Performance' },
  { key: 'clipboard', name: 'clipboard', label: 'Reports' },
  { key: 'groups', name: 'groups', label: 'Roster' },
  { key: 'calendar', name: 'calendar', label: 'Schedule' },
]

export default function MainNavigation({ active = 'medical' }) {
  return (
    <Box
      sx={{
        width: 'var(--nav-width)',
        flexShrink: 0,
        height: '100vh',
        backgroundColor: 'var(--color-primary-dark)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
      }}
    >
      <Box sx={{ py: 2 }}>
        <Box
          component="img"
          src={`${import.meta.env.BASE_URL}nfl-shield.svg`}
          alt="NFL"
          sx={{ width: 30, height: 30, display: 'block' }}
        />
      </Box>

      <Box display="flex" flexDirection="column" gap={1} mt={2} flexGrow={1}>
        {NAV_ITEMS.map((item) => (
          <Tooltip key={item.key} title={item.label} placement="right">
            <IconButton
              sx={{
                width: 40,
                height: 40,
                mx: '10px',
                borderRadius: '8px',
                color: item.key === active ? 'var(--color-primary-dark)' : '#ffffffb3',
                backgroundColor: item.key === active ? '#ffffff' : 'transparent',
                '&:hover': {
                  backgroundColor: item.key === active ? '#ffffff' : '#ffffff1a',
                },
              }}
            >
              <Icon name={item.name} fontSize="small" />
            </IconButton>
          </Tooltip>
        ))}
      </Box>

      <Box display="flex" flexDirection="column" gap={1} mb={2}>
        <IconButton sx={{ color: '#ffffffb3' }}>
          <Icon name="help" fontSize="small" />
        </IconButton>
        <IconButton sx={{ color: '#ffffffb3' }}>
          <Icon name="collapse" fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  )
}
