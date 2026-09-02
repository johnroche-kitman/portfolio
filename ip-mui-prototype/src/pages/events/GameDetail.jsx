import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Button, Divider, FormControlLabel, IconButton, Menu, MenuItem, Switch, Tab, Tabs, Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import AddPanel from '../../components/AddPanel'
import { SearchInput } from '../../components/form'
import { GAME_HEADER, GAME_TABS } from '../../data/game'
import GameEvents from './GameEvents'
import { GameAthleteSelection, GameStaffSelection } from './GameSelection'
// Development goals, Collection and Imported data are the same surfaces as the
// session's, so they are one implementation used by both. Athlete and staff
// selection are NOT: the game's are a different, much smaller surface, so they
// live in GameSelection.
import { CollectionTab, DevelopmentGoalsTab, ImportedDataTab, SquadPicker } from './SessionDetail'

const PANELS = {
  addPlayers: {
    title: 'Add Players',
    body: () => <SquadPicker />,
  },
  addStaff: {
    title: 'Add/remove staff',
    body: () => (
      <>
        <SearchInput label="Search" sx={{ width: '100%' }} />
        <SquadPicker />
      </>
    ),
  },
}

export default function GameDetail() {
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)
  const [complete, setComplete] = useState(false)
  const [panel, setPanel] = useState(null)
  const [menuEl, setMenuEl] = useState(null)

  const meta = [
    ['Squad', GAME_HEADER.squad], ['Date', GAME_HEADER.date],
    ['Venue', GAME_HEADER.venue], ['Competition', GAME_HEADER.competition],
  ]

  return (
    <AppShell title="Schedule" listLabel="Event list">
      <Box sx={{ px: 3, pt: 2.5 }}>
        <Button variant="text" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}
          sx={{ ml: -1, mb: 1 }}>
          Back
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h5">{GAME_HEADER.title}</Typography>
            <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap', mt: 0.5 }}>
              {meta.map(([label, value]) => (
                <Typography key={label} variant="body2">
                  <Box component="span" sx={{ fontWeight: 700 }}>{label}: </Box>
                  <Box component="span" sx={{ color: 'text.secondary' }}>{value}</Box>
                </Typography>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Marking a game complete ticks it in every calendar view. */}
            <FormControlLabel label="Complete" sx={{ mr: 0 }}
              control={<Switch checked={complete} onChange={e => setComplete(e.target.checked)} />} />
            <Button variant="outlined" onClick={() => navigate('/events/1?type=Game')}>Game details</Button>
            <IconButton size="small" aria-label="Game actions" onClick={e => setMenuEl(e.currentTarget)}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={menuEl} open={!!menuEl} onClose={() => setMenuEl(null)}>
              <MenuItem sx={{ minWidth: 160 }} onClick={() => setMenuEl(null)}>Delete</MenuItem>
            </Menu>
          </Box>
        </Box>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mt: 2 }}>
          {GAME_TABS.map(t => <Tab key={t} label={t} />)}
        </Tabs>
      </Box>
      <Divider />

      <Box sx={{ p: 3, bgcolor: colors.white }}>
        {tab === 0 && <GameAthleteSelection onAddPlayers={() => setPanel('addPlayers')} />}
        {tab === 1 && <GameStaffSelection onAddRemove={() => setPanel('addStaff')} />}
        {tab === 2 && <GameEvents />}
        {tab === 3 && <DevelopmentGoalsTab />}
        {tab === 4 && <CollectionTab />}
        {tab === 5 && <ImportedDataTab onImport={() => navigate('/mass_upload/event_data')} />}
      </Box>

      <AddPanel open={!!panel} definition={panel ? PANELS[panel] : null} onClose={() => setPanel(null)} />
    </AppShell>
  )
}
