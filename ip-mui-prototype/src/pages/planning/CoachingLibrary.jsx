import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Menu, MenuItem,
  Typography,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import AddPanel from '../../components/AddPanel'
import { AdminGrid, PageHeader, SettingsCard } from '../admin/parts'
import { SearchInput, SelectField } from '../../components/form'
import { DRILL_DETAIL_PANEL } from '../events/SessionDetail'
import { ACTIVITY_TYPES, CREATORS, PRINCIPLES, libraryDrills } from '../../data/forms'

/** Bulk update applies one field across the selection, so the count is in the title. */
function BulkUpdateDialog({ open, count, onClose }) {
  const [activity, setActivity] = useState('')
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Bulk update {count} drill{count === 1 ? '' : 's'}</DialogTitle>
      <DialogContent>
        <SelectField label="Activity type" options={ACTIVITY_TYPES} value={activity}
          onChange={e => setActivity(e.target.value)} sx={{ width: '100%', mt: 0.5 }} />
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
          Associated squads: None
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onClose}>Cancel</Button>
        <Button onClick={onClose}>Update</Button>
      </DialogActions>
    </Dialog>
  )
}

export default function CoachingLibrary() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const archived = params.get('view') === 'archive'

  const [rows, setRows] = useState(libraryDrills)
  const [archive, setArchive] = useState([])
  const [selection, setSelection] = useState([])
  const [menuEl, setMenuEl] = useState(null)
  const [rowMenu, setRowMenu] = useState(null)
  const [bulk, setBulk] = useState(false)
  const [detail, setDetail] = useState(null)

  const [q, setQ] = useState('')
  const [activity, setActivity] = useState('')
  const [creator, setCreator] = useState('')
  const [principle, setPrinciple] = useState('')

  const source = archived ? archive : rows
  const shown = useMemo(() => source
    .filter(d => d.name.toLowerCase().includes(q.toLowerCase()))
    .filter(d => !activity || d.activity === activity)
    .filter(d => !creator || d.creator === creator)
    .filter(d => !principle || d.principles.includes(principle)), [source, q, activity, creator, principle])

  // Archiving is immediate on the live page, with no confirmation step.
  const archiveSelected = () => {
    setArchive(a => [...a, ...rows.filter(r => selection.includes(r.id))])
    setRows(r => r.filter(x => !selection.includes(x.id)))
    setSelection([])
  }
  const restore = drill => {
    setArchive(a => a.filter(d => d.id !== drill.id))
    setRows(r => [...r, drill])
    setRowMenu(null)
  }

  const columns = [
    { field: 'name', headerName: 'Drill name', flex: 1.1, minWidth: 200, sortable: false,
      renderCell: p => (
        <Button variant="text" onClick={() => setDetail(p.row)}
          sx={{ px: 0, minWidth: 0, fontWeight: 700, color: 'text.primary', textAlign: 'left' }}>
          {p.row.name}
        </Button>
      ) },
    { field: 'description', headerName: 'Description', flex: 1.2, minWidth: 200, sortable: false },
    { field: 'intensity', headerName: 'Intensity', width: 120 },
    { field: 'activity', headerName: 'Activity type', width: 140 },
    { field: 'principles', headerName: 'Principle(s)', flex: 1, minWidth: 170, sortable: false,
      valueGetter: (_, row) => (row.principles.length ? row.principles.join(', ') : 'N/A') },
    { field: 'creator', headerName: 'Creator', width: 160 },
    { field: 'squads', headerName: 'Squads', flex: 1, minWidth: 200, sortable: false },
    { field: 'actions', headerName: '', width: 56, sortable: false, align: 'center',
      renderCell: p => (
        <IconButton size="small" aria-label={`Actions for ${p.row.name}`}
          onClick={e => setRowMenu({ el: e.currentTarget, drill: p.row })}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ) },
  ]

  return (
    <AppShell title="Coaching library">
      {archived ? (
        <Box sx={{ px: 3, pt: 2.5 }}>
          <Button variant="text" startIcon={<ArrowBackIcon />} sx={{ ml: -1, mb: 0.5 }}
            onClick={() => setParams({})}>
            Back
          </Button>
          <Typography variant="h5">Drill archive</Typography>
        </Box>
      ) : (
        <PageHeader
          title="Coaching library"
          actions={
            <>
              <IconButton size="small" aria-label="Library actions" onClick={e => setMenuEl(e.currentTarget)}>
                <MoreVertIcon />
              </IconButton>
              <Menu anchorEl={menuEl} open={!!menuEl} onClose={() => setMenuEl(null)}>
                <MenuItem sx={{ minWidth: 200 }}
                  onClick={() => { setMenuEl(null); setParams({ view: 'archive' }) }}>
                  View drill archive
                </MenuItem>
              </Menu>
            </>
          }
        />
      )}

      <Box sx={{ px: 3, pt: 2, pb: 6 }}>
        <SettingsCard
          title="Drills"
          action={!archived && (
            <>
              <Button variant="outlined" disabled={!selection.length} onClick={() => setBulk(true)}>Edit</Button>
              <Button variant="outlined" disabled={!selection.length} onClick={archiveSelected}>Archive</Button>
            </>
          )}
        >
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
            <SearchInput label="Search drill name" value={q} onChange={e => setQ(e.target.value)} sx={{ width: 230 }} />
            <SelectField label="Activity type" options={ACTIVITY_TYPES} value={activity}
              onChange={e => setActivity(e.target.value)} sx={{ width: 170 }} />
            <SelectField label="Creator" options={CREATORS} value={creator}
              onChange={e => setCreator(e.target.value)} sx={{ width: 170 }} />
            <SelectField label="Principle" options={PRINCIPLES} value={principle}
              onChange={e => setPrinciple(e.target.value)} sx={{ width: 170 }} />
          </Box>

          <AdminGrid
            rows={shown} columns={columns} rowHeight={56} hideFooter
            checkboxSelection={!archived}
            rowSelectionModel={archived ? undefined : selection}
            onRowSelectionModelChange={archived ? undefined : setSelection}
          />
        </SettingsCard>
      </Box>

      <Menu anchorEl={rowMenu?.el} open={!!rowMenu} onClose={() => setRowMenu(null)}>
        {archived
          ? <MenuItem sx={{ minWidth: 180 }} onClick={() => restore(rowMenu.drill)}>Restore drill</MenuItem>
          : <MenuItem sx={{ minWidth: 180 }} onClick={() => {
              setArchive(a => [...a, rowMenu.drill])
              setRows(r => r.filter(d => d.id !== rowMenu.drill.id))
              setRowMenu(null)
            }}>Archive drill</MenuItem>}
      </Menu>

      <BulkUpdateDialog open={bulk} count={selection.length} onClose={() => setBulk(false)} />

      {/* The same Drill detail panel the session uses, reached from the drill name. */}
      <AddPanel open={!!detail} definition={DRILL_DETAIL_PANEL} drill={detail}
        onClose={() => setDetail(null)} />
    </AppShell>
  )
}
