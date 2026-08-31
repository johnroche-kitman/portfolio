import { useMemo, useState } from 'react'
import {
  Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton,
  Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CalendarTodayIcon from '@mui/icons-material/CalendarTodayOutlined'
import ContentCopyIcon from '@mui/icons-material/ContentCopyOutlined'
import NoteAddIcon from '@mui/icons-material/PostAddOutlined'
import colors from '../../theme/tokens'
import { FilterRow } from '../admin/parts'
import { MultiSelect, SearchInput, SelectField } from '../../components/form'
import RichTextField from '../../components/RichTextField'
import DatePickerMenu from '../calendar/DatePickerMenu'
import { AvailabilityCell } from './panels'
import { dailyStatus } from '../../data/medical'
import { positions, squads } from '../../data/athletes'

const COLUMNS = ['Athlete', 'Availability status', 'Open Injury/ Illness', 'Note',
  'Modification/Absence', 'Modification/Absence Details', 'Updated by']

/**
 * The note editor. The real page uses it in two places with the same toolbar —
 * inline in the Note cell, and in a dialog for the bulk action — so it is one
 * component with the surrounding chrome passed in.
 */
function NoteEditor({ value, onChange, onCopyLast }) {
  const [marks, setMarks] = useState([])
  return (
    <>
      <RichTextField minRows={3} value={value} onChange={onChange} marks={marks} onMarks={setMarks} />
      {onCopyLast && (
        <Button size="small" variant="outlined" startIcon={<ContentCopyIcon />} onClick={onCopyLast}
          sx={{ mt: 1.5 }}>
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
    <Box sx={{ py: 1 }}>
      {shown.map((iss, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', mt: 0.7, flexShrink: 0,
            bgcolor: iss.status.startsWith('Available') ? colors.green_200 : colors.red_200 }} />
          <Box sx={{ minWidth: 0 }}>
            {/* Every issue past the first reads as a link to its own record on the real page. */}
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
  const [squad, setSquad] = useState('U16 (Test Kitman FC)')
  const [injured, setInjured] = useState('Injured')
  const [pos, setPos] = useState([])
  const [dateAnchor, setDateAnchor] = useState(null)
  const [selected, setSelected] = useState([])
  const [editing, setEditing] = useState(null)   // row id with the inline editor open
  const [draft, setDraft] = useState('')
  const [notes, setNotes] = useState({})         // id -> saved note
  const [bulk, setBulk] = useState(false)
  const [bulkDraft, setBulkDraft] = useState('')

  const rows = useMemo(
    () => dailyStatus.filter(a => a.name.toLowerCase().includes(q.toLowerCase())),
    [q],
  )

  const allChecked = selected.length > 0 && selected.length === rows.length
  const someChecked = selected.length > 0 && !allChecked

  const toggle = id => setSelected(s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]))
  const toggleAll = () => setSelected(s => (s.length ? [] : rows.map(r => r.id)))

  const openEditor = row => { setEditing(row.id); setDraft(notes[row.id] || '') }
  const saveNote = () => { setNotes(n => ({ ...n, [editing]: draft })); setEditing(null) }

  const addBulk = () => {
    setNotes(n => selected.reduce((acc, id) => ({ ...acc, [id]: bulkDraft }), n))
    setBulk(false); setBulkDraft(''); setSelected([])
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
        <Typography variant="h6">Daily Status Report - 31 Aug 2026</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>31 Aug 2026</Typography>
          <IconButton size="small" aria-label="Previous day"><ChevronLeftIcon fontSize="small" /></IconButton>
          <IconButton size="small" aria-label="Next day"><ChevronRightIcon fontSize="small" /></IconButton>
          <IconButton size="small" aria-label="Pick a date" onClick={e => setDateAnchor(e.currentTarget)}>
            <CalendarTodayIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Selecting rows swaps the filters for the bulk bar, as it does on the real page. */}
      {selected.length > 0 ? (
        <Toolbar sx={{ bgcolor: colors.neutral_200, borderRadius: 1, mb: 2,
          justifyContent: 'space-between', minHeight: 64 }}>
          <Typography variant="subtitle2">{selected.length} selected</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="text" endIcon={<NoteAddIcon />} onClick={() => setBulk(true)}>Add notes</Button>
            <Button variant="text" endIcon={<ContentCopyIcon />}>Copy last note</Button>
          </Box>
        </Toolbar>
      ) : (
        <FilterRow>
          <SearchInput label="Search athletes" value={q} onChange={e => setQ(e.target.value)} />
          <SelectField label="Squads" options={squads} value={squad} onChange={e => setSquad(e.target.value)} sx={{ width: 230 }} />
          <SelectField label="Injured" options={['Injured', 'Not injured']} value={injured}
            onChange={e => setInjured(e.target.value)} sx={{ width: 190 }} />
          <MultiSelect label="Position" options={positions} value={pos} onChange={setPos} sx={{ width: 230 }} />
          <Box sx={{ flex: 1 }} />
          <Button variant="contained">Export</Button>
          <Button variant="outlined">Copy last report</Button>
        </FilterRow>
      )}

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox checked={allChecked} indeterminate={someChecked} onChange={toggleAll}
                  inputProps={{ 'aria-label': 'Select all athletes' }} />
              </TableCell>
              {COLUMNS.map(c => <TableCell key={c}>{c}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(r => {
              const isSel = selected.includes(r.id)
              return (
                <TableRow key={r.id} hover selected={isSel}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={isSel} onChange={() => toggle(r.id)}
                      inputProps={{ 'aria-label': `Select ${r.name}` }} />
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top', pt: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{r.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{r.position}</Typography>
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top', pt: 2 }}>
                    <AvailabilityCell status={r.status} days={r.days} />
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top', minWidth: 240 }}>
                    <IssuesCell issues={r.issues} />
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top', pt: 1.5, minWidth: 240 }}>
                    {editing === r.id ? (
                      <Box sx={{ py: 1 }}>
                        <NoteEditor value={draft} onChange={e => setDraft(e.target.value)}
                          onCopyLast={() => setDraft(r.note?.body || '')} />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1.5 }}>
                          <Button variant="text" size="small" onClick={() => setEditing(null)}>Cancel</Button>
                          <Button size="small" variant="contained" disabled={!draft} onClick={saveNote}>Save</Button>
                        </Box>
                      </Box>
                    ) : notes[r.id] ? (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <Typography variant="body2" sx={{ flex: 1 }}>{notes[r.id]}</Typography>
                        <IconButton size="small" onClick={() => openEditor(r)} aria-label={`Edit note for ${r.name}`}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <IconButton size="small" onClick={() => openEditor(r)} aria-label={`Add a note for ${r.name}`}>
                        <AddIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top', pt: 2 }}>
                    {r.modification ? <Chip size="small" label={r.modification} /> : null}
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top', pt: 2 }}>{r.modificationDetail || ''}</TableCell>
                  <TableCell sx={{ verticalAlign: 'top', pt: 2 }}>{r.updatedBy || ''}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Total Rows: {rows.length}</Typography>
        {selected.length > 0 && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {selected.length} row{selected.length > 1 ? 's' : ''} selected
          </Typography>
        )}
        <Button variant="outlined">Load more</Button>
      </Box>

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
    </Box>
  )
}
