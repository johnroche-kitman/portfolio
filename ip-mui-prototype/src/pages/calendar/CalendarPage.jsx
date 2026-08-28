import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Badge, Box, Button, Checkbox, Divider, Drawer, FormControlLabel, IconButton, Link,
  Menu, MenuItem, Paper, TextField, Tooltip, Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CloseIcon from '@mui/icons-material/Close'
import FilterListIcon from '@mui/icons-material/FilterList'
import SettingsIcon from '@mui/icons-material/SettingsOutlined'
import ContentCopyIcon from '@mui/icons-material/ContentCopyOutlined'
import RefreshIcon from '@mui/icons-material/RefreshOutlined'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import { CALENDAR_VIEWS, EVENT_TYPES, eventsForDay } from '../../data/events'
import { squads } from '../../data/athletes'
import { MonthView, WeekView, DayView, ListView } from './views'
import CalendarFilters from './CalendarFilters'
import EventPopover from './EventPopover'
import DatePickerMenu from './DatePickerMenu'
import QuickCreatePopover from './QuickCreatePopover'

const ALL_TYPES = [EVENT_TYPES.SESSION, EVENT_TYPES.GAME, EVENT_TYPES.EVENT]

export default function CalendarPage() {
  const navigate = useNavigate()
  const [view, setView] = useState('Week')
  const [viewAnchor, setViewAnchor] = useState(null)
  const [addAnchor, setAddAnchor] = useState(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Applied on Save, as in the live drawer — `draft` is what the checkboxes edit.
  const [markers, setMarkers] = useState({ gameweeks: true, gameDay: true })
  const [draft, setDraft] = useState(markers)
  const openSettings = () => { setDraft(markers); setSettingsOpen(true) }

  const [popEvent, setPopEvent] = useState(null)
  const [popAnchor, setPopAnchor] = useState(null)
  const [dateAnchor, setDateAnchor] = useState(null)
  const [slot, setSlot] = useState(null)

  const [f, setF] = useState({
    squads: [squads[0]],
    types: ['Squad Sessions', 'Games', 'Events'],
    sessionTypes: [], competitions: [], oppositions: [],
    athletes: [], staff: [], venues: [], locations: [], labels: [],
  })
  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }))

  // Map the live app's four type checkboxes onto the three event kinds.
  const activeKinds = useMemo(() => {
    const k = []
    if (f.types.includes('Squad Sessions') || f.types.includes('Individual Sessions')) k.push(EVENT_TYPES.SESSION)
    if (f.types.includes('Games')) k.push(EVENT_TYPES.GAME)
    if (f.types.includes('Events')) k.push(EVENT_TYPES.EVENT)
    return k
  }, [f.types])

  const getEvents = day => eventsForDay(day, { types: activeKinds })

  const openEvent = (ev, el) => { setPopEvent(ev); setPopAnchor(el) }

  const label =
    view === 'Month' ? 'August 2026'
      : view === 'Day' ? '27 August 2026'
      : '24 – 30 Aug 2026'

  const activeFilterCount =
    f.sessionTypes.length + f.competitions.length + f.oppositions.length + f.athletes.length +
    f.staff.length + f.venues.length + f.locations.length + f.labels.length +
    (f.types.length !== 4 ? 1 : 0) + (f.squads.length !== 1 ? 1 : 0)

  return (
    <AppShell title="Calendar" fullHeight>
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex', alignItems: 'center', gap: 1.5, px: 3, py: 1.5, flexWrap: 'wrap', flexShrink: 0,
          borderBottom: `1px solid ${colors.neutral_300}`, bgcolor: colors.white,
        }}
      >
        <Badge badgeContent={activeFilterCount} color="primary" invisible={!activeFilterCount}>
          <Button variant="outlined" startIcon={<FilterListIcon />} onClick={() => setFiltersOpen(o => !o)}>
            {filtersOpen ? 'Hide filters' : 'Show filters'}
          </Button>
        </Badge>
        <Button variant="outlined">Today</Button>
        <IconButton size="small" aria-label="Previous"><ChevronLeftIcon /></IconButton>
        <IconButton size="small" aria-label="Next"><ChevronRightIcon /></IconButton>

        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 160 }}>
          <Button variant="text" endIcon={<ArrowDropDownIcon />} onClick={e => setDateAnchor(e.currentTarget)}
            sx={{ fontSize: 20, fontWeight: 700, color: 'text.primary' }}>
            {label}
          </Button>
        </Box>

        <Tooltip title="Calendar settings">
          <IconButton size="small" onClick={openSettings} aria-label="Calendar settings">
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        <Button variant="outlined" endIcon={<ArrowDropDownIcon />} onClick={e => setViewAnchor(e.currentTarget)}>
          {view}
        </Button>
        <Button startIcon={<AddIcon />} endIcon={<ArrowDropDownIcon />} onClick={e => setAddAnchor(e.currentTarget)}>
          Add
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {filtersOpen && <CalendarFilters state={f} set={set} onClose={() => setFiltersOpen(false)} />}

        <Box sx={{ flex: 1, p: 3, minWidth: 0, overflow: 'auto' }}>
          {view === 'Month' && <MonthView showGameweeks={markers.gameweeks} showGameDay={markers.gameDay} getEvents={getEvents} onOpen={openEvent} onSlot={(info, el) => setSlot({ info, el })} />}
          {view === 'Week' && <WeekView slotOpen={!!slot} showGameweeks={markers.gameweeks} showGameDay={markers.gameDay} getEvents={getEvents} onOpen={openEvent} onSlot={(info, el) => setSlot({ info, el })} />}
          {view === 'Day' && <DayView slotOpen={!!slot} showGameweeks={markers.gameweeks} showGameDay={markers.gameDay} getEvents={getEvents} onOpen={openEvent} onSlot={(info, el) => setSlot({ info, el })} dayIndex={2} />}
          {view === 'List' && <ListView showGameweeks={markers.gameweeks} showGameDay={markers.gameDay} getEvents={getEvents} onOpen={openEvent} onSlot={(info, el) => setSlot({ info, el })} />}
        </Box>
      </Box>

      <Menu anchorEl={viewAnchor} open={!!viewAnchor} onClose={() => setViewAnchor(null)}>
        {CALENDAR_VIEWS.map(v => (
          <MenuItem key={v} selected={v === view} onClick={() => { setView(v); setViewAnchor(null) }} sx={{ minWidth: 140 }}>
            {v}
          </MenuItem>
        ))}
      </Menu>

      <Menu anchorEl={addAnchor} open={!!addAnchor} onClose={() => setAddAnchor(null)}>
        {['Game', 'Session', 'Event'].map(t => (
          <MenuItem key={t} sx={{ minWidth: 180 }}
            onClick={() => { setAddAnchor(null); navigate(`/events/new?type=${t}`) }}>
            {t}
          </MenuItem>
        ))}
      </Menu>

      {/* Settings stays a drawer — it is settings, not authoring */}
      <Drawer anchor="right" open={settingsOpen} onClose={() => setSettingsOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 380 } } }}>
        <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Calendar settings</Typography>
          <IconButton size="small" onClick={() => setSettingsOpen(false)} aria-label="Close settings">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ p: 3 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>SHOW / HIDE</Typography>
          <FormControlLabel sx={{ display: 'flex', mt: 1, ml: 0 }} label="Gameweek markers"
            control={<Checkbox checked={draft.gameweeks}
              onChange={e => setDraft(d => ({ ...d, gameweeks: e.target.checked }))} />} />
          <FormControlLabel sx={{ display: 'flex', ml: 0 }} label="Gameday +/- markers"
            control={<Checkbox checked={draft.gameDay}
              onChange={e => setDraft(d => ({ ...d, gameDay: e.target.checked }))} />} />
          <Divider sx={{ my: 2.5 }} />
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>CALENDAR INTEGRATION</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, mb: 1 }}>
            Copy this link to connect your calendar
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <TextField fullWidth value="https://testkitmanfc.kitmanlabs.com/calendar_…" InputProps={{ readOnly: true }} />
            <IconButton size="small" aria-label="Refresh link"><RefreshIcon fontSize="small" /></IconButton>
            <IconButton size="small" aria-label="Copy link"><ContentCopyIcon fontSize="small" /></IconButton>
          </Box>
        </Box>
        <Box sx={{ mt: 'auto', px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTop: `1px solid ${colors.neutral_300}` }}>
          <Link component="button" underline="hover" sx={{ fontSize: 14 }}
            onClick={() => { setSettingsOpen(false); navigate('/administration/organisation/edit') }}>
            Advanced settings →
          </Link>
          <Button onClick={() => { setMarkers(draft); setSettingsOpen(false) }}>Save</Button>
        </Box>
      </Drawer>

      <EventPopover event={popEvent} anchorEl={popAnchor}
        onClose={() => { setPopAnchor(null); setPopEvent(null) }} />

      <DatePickerMenu anchorEl={dateAnchor} onClose={() => setDateAnchor(null)} />

      <QuickCreatePopover slot={slot} onClose={() => setSlot(null)} />
    </AppShell>
  )
}
