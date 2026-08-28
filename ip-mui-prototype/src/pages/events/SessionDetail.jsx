import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Alert, Box, Button, Checkbox, Chip, Divider, FormControlLabel, IconButton, Menu, MenuItem,
  Paper, Switch, Tab, Tabs, Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddIcon from '@mui/icons-material/Add'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import AthleteCell from '../../components/AthleteCell'
import { athletes } from '../../data/athletes'
import { EVENT_TYPES, STAFF, eventById, events, gameDayMarker, setEventComplete } from '../../data/events'

const TABS = ['Planning', 'Athlete selection', 'Staff selection', 'Development goals', 'Collection', 'Imported data']

const Meta = ({ label, value }) => (
  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
    <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>{label}: </Box>{value}
  </Typography>
)

const Empty = ({ children }) => (
  <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, py: 6, textAlign: 'center' }}>
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{children}</Typography>
  </Paper>
)

export default function SessionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const ev = eventById(id) || events.find(e => e.type === EVENT_TYPES.SESSION)

  const [tab, setTab] = useState(0)
  const [complete, setComplete] = useState(!!ev.complete)
  const [menuEl, setMenuEl] = useState(null)
  const [selected, setSelected] = useState(athletes.slice(0, 6).map(a => a.id))

  const toggleComplete = value => { setComplete(value); setEventComplete(ev.id, value) }

  return (
    <AppShell title="Schedule" listLabel="Event list">
      <Box sx={{ px: 3, pt: 2, pb: 0 }}>
        <Button variant="text" startIcon={<ChevronLeftIcon />} onClick={() => navigate('/calendar')} sx={{ ml: -1 }}>
          Back
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mt: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{ev.title}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, mt: 0.75 }}>
              <Meta label="Squad" value={ev.squad} />
              <Divider orientation="vertical" flexItem />
              <Meta label="Date" value={`August 28, 2026 ${ev.start} (Europe/Dublin)`} />
              <Divider orientation="vertical" flexItem />
              <Meta label="Type" value={ev.sessionType || ev.eventType || ev.type} />
              <Divider orientation="vertical" flexItem />
              <Meta label="Game day" value={gameDayMarker(28).replace('GD ', '').replace('/', ', ')} />
            </Box>
            <Box sx={{ mt: 0.5 }}><Meta label="Surface type" value="Grass" /></Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            {/* Turning this on is what puts the check mark on the event in every calendar view. */}
            <FormControlLabel
              label="Complete"
              control={<Switch checked={complete} onChange={e => toggleComplete(e.target.checked)} />}
              sx={{ mr: 0 }}
            />
            <Button variant="outlined" onClick={() => navigate(`/events/${ev.id}`)}>Edit details</Button>
            <IconButton size="small" onClick={e => setMenuEl(e.currentTarget)} aria-label="More actions">
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mt: 2 }}>
          {TABS.map(t => <Tab key={t} label={t} />)}
        </Tabs>
      </Box>
      <Divider />

      <Box sx={{ p: 3 }}>
        {tab === 0 && (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1.5, mb: 3 }}>
              <Button startIcon={<AddIcon />}>Add drill from library</Button>
              <Button variant="outlined" startIcon={<AddIcon />}>Create new drill</Button>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Empty>No drills have been added to this session yet.</Empty>
          </>
        )}

        {tab === 1 && (
          <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, width: '100%' }}>
            <DataGrid
              autoHeight checkboxSelection disableRowSelectionOnClick
              rowSelectionModel={selected} onRowSelectionModelChange={setSelected}
              rows={athletes}
              columns={[
                { field: 'name', headerName: 'Athlete', flex: 1, minWidth: 220,
                  renderCell: p => <AthleteCell athlete={p.row} /> },
                { field: 'position', headerName: 'Position', width: 160 },
                { field: 'availability', headerName: 'Availability', width: 180 },
              ]}
              pageSizeOptions={[10, 25]}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              sx={{ border: 0 }}
            />
          </Paper>
        )}

        {tab === 2 && (
          <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>STAFF</Typography>
            {STAFF.map(s => (
              <FormControlLabel key={s} control={<Checkbox defaultChecked={s === STAFF[0]} />} label={s}
                sx={{ display: 'flex', ml: 0 }} />
            ))}
          </Paper>
        )}

        {tab === 3 && <Empty>No development goals are attached to this session.</Empty>}

        {tab === 4 && (
          <>
            <Alert severity="info" sx={{ mb: 2 }}>
              Collection forms assigned to this session appear here once the session has started.
            </Alert>
            <Empty>No collection forms assigned.</Empty>
          </>
        )}

        {tab === 5 && (
          <>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip size="small" label="GPS" variant="outlined" />
              <Chip size="small" label="Heart rate" variant="outlined" />
              <Chip size="small" label="Wellness" variant="outlined" />
            </Box>
            <Empty>No data has been imported against this session.</Empty>
          </>
        )}
      </Box>

      <Menu anchorEl={menuEl} open={!!menuEl} onClose={() => setMenuEl(null)}>
        <MenuItem onClick={() => setMenuEl(null)} sx={{ minWidth: 180 }}>Duplicate</MenuItem>
        <MenuItem onClick={() => setMenuEl(null)}>Print session plan</MenuItem>
        <MenuItem onClick={() => setMenuEl(null)}>Export</MenuItem>
        <Divider />
        <MenuItem onClick={() => setMenuEl(null)} sx={{ color: colors.red_100 }}>Delete</MenuItem>
      </Menu>
    </AppShell>
  )
}
