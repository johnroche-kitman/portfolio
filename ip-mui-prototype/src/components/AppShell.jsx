import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar, Avatar, Badge, Box, Button, Divider, Drawer, IconButton, List, ListItemButton,
  ListItemIcon, ListItemText, MenuItem, TextField, Toolbar, Tooltip, Typography,
} from '@mui/material'
import BarChartIcon from '@mui/icons-material/BarChartOutlined'
import GroupsIcon from '@mui/icons-material/GroupsOutlined'
import LocalHospitalIcon from '@mui/icons-material/LocalHospitalOutlined'
import SportsIcon from '@mui/icons-material/SportsOutlined'
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined'
import CalendarIcon from '@mui/icons-material/CalendarTodayOutlined'
import ForumIcon from '@mui/icons-material/ForumOutlined'
import FolderIcon from '@mui/icons-material/FolderOutlined'
import PersonIcon from '@mui/icons-material/PersonOutline'
import SettingsIcon from '@mui/icons-material/SettingsOutlined'
import PersonSearchIcon from '@mui/icons-material/PersonSearchOutlined'
import CloseIcon from '@mui/icons-material/Close'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import colors from '../theme/tokens'
import { athletes, squad, squads } from '../data/athletes'
import AthleteCell from './AthleteCell'

const RAIL = 56

const NAV = [
  { label: 'Analysis', icon: <BarChartIcon />, path: '/analysis', disabled: true, note: 'Being sunset' },
  { label: 'Athletes', icon: <GroupsIcon />, path: '/athletes' },
  { label: 'Medical', icon: <LocalHospitalIcon />, path: '/medical/rosters' },
  { label: 'Planning', icon: <SportsIcon />, path: '/planning_hub/events' },
  { label: 'Forms', icon: <AssignmentIcon />, path: '/assessments' },
  { label: 'Calendar', icon: <CalendarIcon />, path: '/calendar' },
  { label: 'Messaging', icon: <ForumIcon />, path: '/messaging', badge: 14 },
  { label: 'Media', icon: <FolderIcon />, path: '/media/videos', disabled: true, note: 'Legacy ASP.NET' },
  { label: 'Recruitment', icon: <PersonIcon />, path: '/recruitment', disabled: true, note: 'Legacy ASP.NET' },
  { label: 'Administration', icon: <SettingsIcon />, path: '/administration/athletes' },
]

export default function AppShell({ title, children }) {
  const [playerListOpen, setPlayerListOpen] = useState(false)
  const [currentSquad, setCurrentSquad] = useState(squad)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const shown = athletes.filter(a => a.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: colors.background }}>
      {/* Left rail — out of redesign scope, reproduced so pages sit in context */}
      <Box
        component="nav"
        sx={{
          width: RAIL, flexShrink: 0, bgcolor: colors.grey_400, color: colors.white,
          display: 'flex', flexDirection: 'column', alignItems: 'center', py: 1,
          position: 'sticky', top: 0, height: '100vh',
        }}
      >
        <Box sx={{ mb: 1.5, width: 32, height: 32, borderRadius: '50%', bgcolor: colors.blue_500 || '#0828ff',
          display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 15 }}>K</Box>
        <List sx={{ width: '100%', p: 0 }}>
          {NAV.map(item => {
            const active = pathname.startsWith(item.path.split('?')[0]) && !item.disabled
            return (
              <Tooltip key={item.label} title={item.note ? `${item.label} — ${item.note}` : item.label} placement="right">
                <span>
                  <ListItemButton
                    disabled={item.disabled}
                    onClick={() => navigate(item.path)}
                    sx={{
                      justifyContent: 'center', py: 1.2, minHeight: 0,
                      bgcolor: active ? colors.blue_500 || '#0828ff' : 'transparent',
                      '&:hover': { bgcolor: active ? colors.blue_500 : 'rgba(255,255,255,.08)' },
                      '&.Mui-disabled': { opacity: 0.32 },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 0, color: colors.white, '& svg': { fontSize: 21 } }}>
                      {item.badge ? (
                        <Badge badgeContent={item.badge} color="error">{item.icon}</Badge>
                      ) : item.icon}
                    </ListItemIcon>
                  </ListItemButton>
                </span>
              </Tooltip>
            )
          })}
        </List>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="sticky" elevation={0}
          sx={{ bgcolor: colors.white, color: 'text.primary', borderBottom: `1px solid ${colors.neutral_300}` }}>
          <Toolbar sx={{ gap: 2, minHeight: 56 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{title}</Typography>
            <Button
              size="small"
              variant="text"
              startIcon={<PersonSearchIcon />}
              endIcon={<KeyboardDoubleArrowRightIcon sx={{ fontSize: 16 }} />}
              onClick={() => setPlayerListOpen(true)}
            >
              Player list
            </Button>
            <Box sx={{ flex: 1 }} />
            <Avatar sx={{ width: 28, height: 28, bgcolor: colors.grey_300, fontSize: 12 }}>K</Avatar>
            <TextField
              select value={currentSquad} onChange={e => setCurrentSquad(e.target.value)}
              variant="standard" InputProps={{ disableUnderline: true }}
              sx={{ width: 210, '& .MuiInputBase-input': { fontSize: 14, py: 0 } }}
            >
              {squads.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
            <Avatar sx={{ width: 30, height: 30, bgcolor: colors.neutral_300, color: colors.grey_200, fontSize: 12 }}>JR</Avatar>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flex: 1, width: '100%', overflowX: 'hidden' }}>{children}</Box>
      </Box>

      {/* Player list — global drawer, 0.0% MUI in the live app */}
      <Drawer anchor="left" open={playerListOpen} onClose={() => setPlayerListOpen(false)}
        PaperProps={{ sx: { width: 320, ml: `${RAIL}px` } }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 600 }}>Select player</Typography>
          <IconButton size="small" onClick={() => setPlayerListOpen(false)} aria-label="Close player list">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ px: 2, pb: 1.5 }}>
          <TextField fullWidth placeholder="Filter" value={query} onChange={e => setQuery(e.target.value)} />
        </Box>
        <Divider />
        <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary' }}>{currentSquad}</Typography>
        <List sx={{ pt: 0, overflowY: 'auto' }}>
          {shown.map(a => (
            <ListItemButton key={a.id} onClick={() => { setPlayerListOpen(false); navigate(`/medical/athletes/${a.id}`) }}>
              <ListItemText primary={<AthleteCell athlete={a} />} secondary={String(a.id)}
                secondaryTypographyProps={{ variant: 'caption', sx: { pl: 6.5 } }} />
            </ListItemButton>
          ))}
          {!shown.length && (
            <Typography variant="body2" sx={{ px: 2, py: 3, color: 'text.secondary' }}>No players match “{query}”.</Typography>
          )}
        </List>
      </Drawer>
    </Box>
  )
}
