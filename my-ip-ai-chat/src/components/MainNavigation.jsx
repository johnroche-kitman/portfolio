import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import ButtonBase from '@mui/material/ButtonBase'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import { useNavigate } from 'react-router-dom'
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

export default function MainNavigation({
  onOpenChat,
  chatOpen,
  hasUnseen,
  showTrigger = true,
  activeKey = 'next-gen',
}) {
  const navigate = useNavigate()

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
      <Tooltip title="Back to prototype versions" placement="right">
        <ButtonBase onClick={() => navigate('/')} sx={{ borderRadius: '50%', p: 0.5, my: 1.5 }}>
          <Box component="img" src={`${import.meta.env.BASE_URL}kitman-logo.png`} alt="Kitman Labs" sx={{ width: 36, height: 36, display: 'block' }} />
        </ButtonBase>
      </Tooltip>

      {showTrigger && (
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
            <Badge
              variant="dot"
              invisible={!hasUnseen}
              sx={{ '& .MuiBadge-dot': { backgroundColor: 'var(--toast-green)', border: '2px solid #0b1220' } }}
            >
              <Icon name="askIp" fontSize="small" />
            </Badge>
          </ButtonBase>
        </Tooltip>
      )}

      <Box display="flex" flexDirection="column" gap={0.5} flexGrow={1} width="100%" alignItems="center">
        {NAV_ITEMS.map((item) => {
          const selected = item.key === activeKey
          return (
            <Tooltip key={item.key} title={item.label} placement="right">
              {/* Full-rail-width segment so the selected state fills the whole
                  strip, as in the design. The 4px white leading line is an
                  inset shadow rather than a border so it doesn't nudge the
                  icon off the rail's centre line. */}
              <span style={{ width: '100%' }}>
                <ButtonBase
                  disabled
                  sx={{
                    width: '100%',
                    height: 32,
                    justifyContent: 'center',
                    color: selected ? '#ffffff' : '#ffffffb3',
                    backgroundColor: selected ? 'var(--color-accent)' : 'transparent',
                    boxShadow: selected ? 'inset 4px 0 0 0 #ffffff' : 'none',
                    '&.Mui-disabled': { color: selected ? '#ffffff' : '#ffffffb3' },
                  }}
                >
                  <Icon name={item.name} fontSize="small" />
                </ButtonBase>
              </span>
            </Tooltip>
          )
        })}
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
