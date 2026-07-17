import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import ButtonBase from '@mui/material/ButtonBase'
import IconButton from '@mui/material/IconButton'
import { useNavigate } from 'react-router-dom'
import Icon from './Icon'

const NAV_ITEMS = [
  { key: 'medical', name: 'medical', label: 'Medical', to: '/medical/roster' },
  { key: 'chart', name: 'chart', label: 'Performance' },
  { key: 'clipboard', name: 'clipboard', label: 'Reports' },
  { key: 'groups', name: 'groups', label: 'Roster' },
  { key: 'calendar', name: 'calendar', label: 'Schedule' },
  { key: 'settings', name: 'settings', label: 'Settings' },
]

export default function MainNavigation({ active = 'medical' }) {
  const navigate = useNavigate()

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
      <Tooltip title="Back to demo home" placement="right">
        <ButtonBase onClick={() => navigate('/')} sx={{ borderRadius: '8px', p: 1, my: 1 }}>
          <Box
            component="img"
            src={`${import.meta.env.BASE_URL}nfl-logo.png`}
            alt="NFL"
            sx={{
              width: 34,
              height: 34,
              display: 'block',
              objectFit: 'contain',
              filter:
                'drop-shadow(1px 0 0 #fff) drop-shadow(-1px 0 0 #fff) drop-shadow(0 1px 0 #fff) drop-shadow(0 -1px 0 #fff)',
            }}
          />
        </ButtonBase>
      </Tooltip>

      <Box display="flex" flexDirection="column" gap={1} mt={2} flexGrow={1} width="100%">
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === active
          return (
            <Tooltip key={item.key} title={item.label} placement="right">
              <span>
                <ButtonBase
                  onClick={() => item.to && navigate(item.to)}
                  disabled={!item.to}
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: 32,
                    justifyContent: 'center',
                    color: isActive ? '#ffffff' : '#ffffffcc',
                    backgroundColor: isActive ? 'var(--color-error)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isActive ? 'var(--color-error)' : '#ffffff1a',
                    },
                    '&.Mui-disabled': {
                      color: isActive ? '#ffffff' : '#ffffffcc',
                    },
                  }}
                >
                  {isActive && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 6,
                        backgroundColor: '#ffffff',
                      }}
                    />
                  )}
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
