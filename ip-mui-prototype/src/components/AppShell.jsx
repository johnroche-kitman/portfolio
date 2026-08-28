import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppBar, Avatar, Box, Button, Divider, Drawer, IconButton, List, ListItemButton,
  ListItemText, MenuItem, TextField, Toolbar, Typography,
} from '@mui/material'
import PersonSearchIcon from '@mui/icons-material/PersonSearchOutlined'
import CloseIcon from '@mui/icons-material/Close'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import colors from '../theme/tokens'
import MainNav, { RAIL_COLLAPSED } from './MainNav'
import { athletes, squad, squads } from '../data/athletes'
import AthleteCell from './AthleteCell'

export default function AppShell({ title, children, fullHeight = false }) {
  const [playerListOpen, setPlayerListOpen] = useState(false)
  const [navExpanded, setNavExpanded] = useState(false)
  const [currentSquad, setCurrentSquad] = useState(squad)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const shown = athletes.filter(a => a.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <Box sx={{ display: 'flex', height: fullHeight ? '100vh' : undefined,
      minHeight: fullHeight ? undefined : '100vh', overflow: fullHeight ? 'hidden' : undefined,
      bgcolor: colors.background }}>
      <MainNav expanded={navExpanded} onToggle={() => setNavExpanded(v => !v)} />

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

        {/* fullHeight: panes scroll, the page does not. Otherwise the page scrolls and
            no overflow is set here — that would clip descendants out of position: sticky. */}
        <Box component="main" sx={{
          flex: 1, width: '100%', minWidth: 0,
          ...(fullHeight ? { minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' } : {}),
        }}>{children}</Box>
      </Box>

      {/* Player list — global drawer, 0.0% MUI in the live app */}
      <Drawer anchor="left" open={playerListOpen} onClose={() => setPlayerListOpen(false)}
        PaperProps={{ sx: { width: 320, ml: `${RAIL_COLLAPSED}px` } }}>
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
