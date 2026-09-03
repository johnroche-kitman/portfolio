import { useMemo, useState } from 'react'
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Link, Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CalendarTodayIcon from '@mui/icons-material/CalendarTodayOutlined'
import ContentCopyIcon from '@mui/icons-material/ContentCopyOutlined'
import NoteAddIcon from '@mui/icons-material/PostAddOutlined'
import colors from '../../theme/tokens'
import { MultiSelect } from '../../components/form'
import RichTextField from '../../components/RichTextField'
import DatePickerMenu from '../calendar/DatePickerMenu'
import { AvailabilityCell, ListPanel, SearchField, SelectField } from './panels'
import { dailyStatus } from '../../data/medical'
import { positions, squads } from '../../data/athletes'

/**
 * The note editor. The page uses it twice with the same toolbar — inline in the
 * Note cell and in the bulk dialog — so it is one component with the surrounding
 * chrome passed in, rather than two.
 */
function NoteEditor({ value, onChange, onCopyLast }) {
  const [marks, setMarks] = useState([])
  return (
    <>
      <RichTextField minRows={3} value={value} onChange={onChange} marks={marks} onMarks={setMarks} />
      {onCopyLast && (
        <Button size="small" variant="outlined" startIcon={<ContentCopyIcon />}
          onClick={onCopyLast} sx={{ mt: 1.5 }}>
          Copy last note
        </Button>
      )}
    </>
  )
}

/** Open issues, collapsed to the first until Show all is pressed. */
function IssuesCell({ issues }) {
  const [all, setAll] = useState(false)
  if (!issues.length) return null
  const shown = all ? issues : issues.slice(0, 1)
  return (
    <Box sx={{ py: 0.5 }}>
      {shown.map((iss, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 1, mb: 0.75 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', mt: 0.7, flexShrink: 0,
            bgcolor: iss.status.startsWith('Available') ? colors.green_200 : colors.red_200 }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {i === 0 && !all
                ? `${iss.date} - ${iss.title}`
                : <Link href="#" underline="always" color="inherit">{iss.date} - {iss.title}</Link>}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{iss.status}</Typography>
          </Box>
        </Box>
      ))}
      {issues.length > 1 && (
        <Button variant="text" size="small" onClick={() => setAll(a => !a)} sx={{ px: 0, minWidth: 0 }}>
          {all ? 'Show less' : 'Show all'}
        </Button>
      )}
    </Box>
  )
}

export default function DailyStatusReport() {
  const [q, setQ] = useState('')
  const [squad, setSquad] = useState('')
  const [injured, setInjured] = useState('')
  const [pos, setPos] = useState([])
  const [dateAnchor, setDateAnchor] = useState(null)
  const [selection, setSelection] = useState([])
  const [editing, setEditing] = useState(null)   // row id whose editor is open
  const [draft, setDraft] = useState('')
  const [notes, setNotes] = useState({})
  const [bulk, setBulk] = useState(false)
  const [bulkDraft, setBulkDraft] = useState('')

  const rows = useMemo(() => dailyStatus
    .filter(a => a.name.toLowerCase().includes(q.toLowerCase()))
    .filter(a => !pos.length || pos.includes(a.position)), [q, pos])

  const openEditor = row => { setEditing(row.id); setDraft(notes[row.id] || '') }
  const saveNote = () => { setNotes(n => ({ ...n, [editing]: draft })); setEditing(null) }
  const addBulk = () => {
    setNotes(n => selection.reduce((acc, id) => ({ ...acc, [id]: bulkDraft }), n))
    setBulk(false); setBulkDraft(''); setSelection([])
  }

  return (
    <>
      <ListPanel
        title="Daily Status Report - 31 Aug 2026"
        selectable autoRowHeight alignTop
        selection={selection}
        onSelectionChange={setSelection}
        selectionActions={<>
          <Button variant="text" endIcon={<NoteAddIcon />} onClick={() => setBulk(true)}>Add notes</Button>
          <Button variant="text" endIcon={<ContentCopyIcon />}>Copy last note</Button>
        </>}
        actions={<>
          <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>31 Aug 2026</Typography>
          <IconButton size="small" aria-label="Previous day"><ChevronLeftIcon fontSize="small" /></IconButton>
          <IconButton size="small" aria-label="Next day"><ChevronRightIcon fontSize="small" /></IconButton>
          <IconButton size="small" aria-label="Pick a date" onClick={e => setDateAnchor(e.currentTarget)}>
            <CalendarTodayIcon fontSize="small" />
          </IconButton>
        </>}
        filters={<>
          <SearchField label="Search athletes" value={q} onChange={setQ} />
          <SelectField label="Squads" options={squads} value={squad} onChange={setSquad} width={230} />
          <SelectField label="Injured" options={['Injured', 'Not injured']} value={injured}
            onChange={setInjured} width={170} />
          <MultiSelect label="Position" options={positions} value={pos} onChange={setPos} sx={{ width: 230 }} />
          <Box sx={{ flex: 1 }} />
          <Button variant="contained">Export</Button>
          <Button variant="outlined">Copy last report</Button>
        </>}
        columns={[
          { field: 'name', headerName: 'Athlete', flex: 1, minWidth: 180, sortable: false,
            renderCell: p => (
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.row.name}</Typography>
                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                  {p.row.position}
                </Typography>
              </Box>
            ) },
          { field: 'status', headerName: 'Availability status', width: 175, sortable: false,
            renderCell: p => <AvailabilityCell status={p.row.status} days={p.row.days} /> },
          { field: 'issues', headerName: 'Open Injury/ Illness', flex: 1.3, minWidth: 240, sortable: false,
            renderCell: p => <IssuesCell issues={p.row.issues} /> },
          { field: 'note', headerName: 'Note', flex: 1.3, minWidth: 230, sortable: false,
            renderCell: p => (editing === p.row.id
              ? (
                <Box sx={{ width: '100%', py: 1 }}>
                  <NoteEditor value={draft} onChange={e => setDraft(e.target.value)}
                    onCopyLast={() => setDraft(p.row.note?.body || '')} />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1.5 }}>
                    <Button variant="text" size="small" onClick={() => setEditing(null)}>Cancel</Button>
                    <Button size="small" variant="contained" disabled={!draft} onClick={saveNote}>Save</Button>
                  </Box>
                </Box>
              )
              : notes[p.row.id]
                ? (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, width: '100%' }}>
                    <Typography variant="body2" sx={{ flex: 1 }}>{notes[p.row.id]}</Typography>
                    <IconButton size="small" onClick={() => openEditor(p.row)}
                      aria-label={`Edit note for ${p.row.name}`}><AddIcon fontSize="small" /></IconButton>
                  </Box>
                )
                : (
                  <IconButton size="small" onClick={() => openEditor(p.row)}
                    aria-label={`Add a note for ${p.row.name}`}><AddIcon fontSize="small" /></IconButton>
                )) },
          { field: 'modification', headerName: 'Modification/Absence', width: 185, sortable: false,
            renderCell: p => (p.row.modification ? <Chip size="small" label={p.row.modification} /> : null) },
          { field: 'modificationDetail', headerName: 'Modification/Absence Details', width: 225, sortable: false },
          { field: 'updatedBy', headerName: 'Updated by', width: 150, sortable: false },
        ]}
        rows={rows}
        footer={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Total Rows: {rows.length}</Typography>
            <Button variant="outlined">Load more</Button>
          </Box>
        }
      />

      <DatePickerMenu anchorEl={dateAnchor} onClose={() => setDateAnchor(null)} />

      <Dialog open={bulk} onClose={() => setBulk(false)} fullWidth maxWidth="sm">
        <DialogTitle>Note</DialogTitle>
        <DialogContent>
          <NoteEditor value={bulkDraft} onChange={e => setBulkDraft(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={() => setBulk(false)}>Cancel</Button>
          <Button variant="contained" disabled={!bulkDraft} onClick={addBulk}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
