import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import ButtonBase from '@mui/material/ButtonBase'
import IconButton from '@mui/material/IconButton'
import Icon from './Icon'

const NAV_ITEMS = [
  { key: 'next-gen', name: 'nextGen', label: 'Next Gen' },
  { key: 'athletes', name: 'athletes', label: 'Athletes' },
  { key: 'medical', name: 'medical', label: 'Medical' },
  { key: 'planning', name: 'planning', label: 'Planning' },
  { key: 'forms', name: 'forms', label: 'Forms' },
  { key: 'calendar', name: 'calendar', label: 'Calendar' },
  { key: 'documents', name: 'documents', label: 'Documents' },
  { key: 'messaging', name: 'messaging', label: 'Messaging' },
  { key: 'media', name: 'media', label: 'Media' },
  { key: 'recruitment', name: 'recruitment', label: 'Recruitment' },
  { key: 'administration', name: 'settings', label: 'Administration' },
]

export default function MainNavigation({ onOpenChat, chatOpen }) {
  return (
    <Box
      sx={{
        width: 'var(--nav-width)',
        flexShrink: 0,
        height: '100vh',
        backgroundColor: '#0b1220',
        backgroundImage: 'linear-gradient(180deg, #16233d 0%, #0b1220 60%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <Tooltip title="My iP" placement="right">
        <ButtonBase sx={{ borderRadius: '50%', p: 0.5, my: 1.5 }}>
          <Box component="img" src={`${import.meta.env.BASE_URL}kitman-logo.png`} alt="Kitman Labs" sx={{ width: 36, height: 36, display: 'block' }} />
        </ButtonBase>
      </Tooltip>

      <Tooltip title="Ask My iP" placement="right">
        <ButtonBase
          onClick={onOpenChat}
          aria-label="Open Ask My iP assistant"
          sx={{
            width: 44,
            height: 32,
            borderRadius: '6px',
            mb: 1.5,
            color: '#ffffff',
            backgroundColor: chatOpen ? 'var(--color-accent)' : 'transparent',
            '&:hover': { backgroundColor: chatOpen ? 'var(--color-accent)' : '#ffffff1a' },
          }}
        >
          <Icon name="askIp" fontSize="small" />
        </ButtonBase>
      </Tooltip>

      <Box display="flex" flexDirection="column" gap={0.5} flexGrow={1} width="100%" alignItems="center">
        {NAV_ITEMS.map((item) => (
          <Tooltip key={item.key} title={item.label} placement="right">
            <span>
              <ButtonBase
                disabled
                sx={{
                  width: 44,
                  height: 32,
                  justifyContent: 'center',
                  borderRadius: '6px',
                  color: '#ffffffb3',
                  '&.Mui-disabled': { color: '#ffffffb3' },
                }}
              >
                <Icon name={item.name} fontSize="small" />
              </ButtonBase>
            </span>
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
