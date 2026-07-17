import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import Tooltip from '@mui/material/Tooltip'
import Card from '../Card'
import PlayerAvatar from '../PlayerAvatar'
import Lozenge from '../Lozenge'
import Button from '../Button'
import Icon from '../Icon'
import AddNoteDialog from './AddNoteDialog'
import { useAppData } from '../../state/AppDataContext'

const FILTER_CONTROL_SX = {
  backgroundColor: 'var(--neutral-200)',
  borderRadius: '6px',
  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '& .MuiOutlinedInput-root': { backgroundColor: 'var(--neutral-200)', borderRadius: '6px' },
}

function noteTypeTone(noteType) {
  switch (noteType) {
    case 'Medication note':
      return 'dark'
    case 'Issue note':
      return 'info'
    case 'Progress note':
      return 'success'
    default:
      return 'neutral'
  }
}

function NoteCard({ note, athlete, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null)

  return (
    <Card>
      <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={3}>
        <Box flexGrow={1} minWidth={0}>
          <Box display="flex" alignItems="center" gap={1.5} sx={{ mb: 1.5 }}>
            <PlayerAvatar athlete={athlete} size={32} />
            <Typography variant="body1" fontWeight={600}>
              {athlete?.name || 'Unknown athlete'}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" sx={{ mb: 0.5 }}>
            {note.isPrivate && <Icon name="lock" fontSize="small" sx={{ color: 'var(--grey-100)' }} />}
            <Typography variant="body1" fontWeight={600}>
              {note.title || 'Note'}
            </Typography>
            {note.noteType && (
              <Lozenge label={note.noteType.toUpperCase()} tone={noteTypeTone(note.noteType)} />
            )}
          </Box>
          <Typography variant="body2" sx={{ color: 'var(--grey-100)', mb: 1.5 }}>
            {note.date}
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {note.text}
          </Typography>
        </Box>

        <Box
          sx={{
            minWidth: 190,
            flexShrink: 0,
            borderLeft: '1px solid var(--divider)',
            pl: 3,
          }}
        >
          <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
            Visibility
          </Typography>
          <Typography variant="body1" fontWeight={600} sx={{ mb: 2 }}>
            {note.isPrivate ? 'Private' : 'Default'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
            Created {note.date} by {note.author}
          </Typography>
        </Box>

        <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Icon name="moreVert" fontSize="small" />
        </IconButton>
        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
          <MenuItem
            onClick={() => {
              setAnchorEl(null)
              onDelete()
            }}
          >
            Delete note
          </MenuItem>
        </Menu>
      </Box>
    </Card>
  )
}

export default function NotesTab({ injury, athlete }) {
  const { notesByInjury, addManualNote, deleteNoteFromInjury } = useAppData()
  const notes = notesByInjury[injury.id] || []
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)

  const noteTypes = useMemo(() => [...new Set(notes.map((n) => n.noteType).filter(Boolean))], [notes])

  const filteredNotes = useMemo(() => {
    return notes
      .filter((n) => typeFilter === 'all' || n.noteType === typeFilter)
      .filter((n) => {
        if (!search.trim()) return true
        const q = search.trim().toLowerCase()
        return (n.title || '').toLowerCase().includes(q) || (n.text || '').toLowerCase().includes(q)
      })
      .slice()
      .reverse()
  }, [notes, typeFilter, search])

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 3, mb: 2 }}>
        <Typography variant="h2">Notes</Typography>
        <Box display="flex" gap={1.5}>
          <Button onClick={() => setDialogOpen(true)}>Add note</Button>
          <Tooltip title="Archived notes aren't available in this prototype">
            <span>
              <Button tone="secondary" disabled endIcon={<Icon name="archive" fontSize="small" />}>
                View archive
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>

      <Box display="flex" gap={1.5} sx={{ mb: 3 }} flexWrap="wrap">
        <TextField
          size="small"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 220, ...FILTER_CONTROL_SX }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Icon name="search" fontSize="small" sx={{ color: 'var(--grey-100)' }} />
              </InputAdornment>
            ),
          }}
        />
        <Select size="small" value="all" sx={{ width: 130, ...FILTER_CONTROL_SX }}>
          <MenuItem value="all">Squad</MenuItem>
        </Select>
        <Select size="small" value="all" sx={{ width: 130, ...FILTER_CONTROL_SX }}>
          <MenuItem value="all">Author</MenuItem>
        </Select>
        <Select
          size="small"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          sx={{ width: 160, ...FILTER_CONTROL_SX }}
        >
          <MenuItem value="all">Note type</MenuItem>
          {noteTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
        <Tooltip title="Date range filtering isn't available in this prototype">
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{
              px: 1.5,
              height: 32,
              borderRadius: '6px',
              backgroundColor: 'var(--neutral-200)',
              color: 'var(--grey-100)',
              cursor: 'default',
            }}
          >
            <Icon name="calendar" fontSize="small" />
            <Typography variant="body2">Date range</Typography>
          </Box>
        </Tooltip>
      </Box>

      {filteredNotes.length ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} athlete={athlete} onDelete={() => deleteNoteFromInjury(injury.id, note.id)} />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            p: 6,
            textAlign: 'center',
            backgroundColor: 'var(--white)',
            borderRadius: '8px',
            border: '1px solid var(--divider)',
          }}
        >
          <Typography variant="body1" sx={{ color: 'var(--grey-100)' }}>
            {notes.length
              ? 'No notes match these filters.'
              : 'No notes recorded yet. Use Add note or the AI assistant to create one.'}
          </Typography>
        </Box>
      )}

      <AddNoteDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={(data) => {
          addManualNote(injury.id, data)
          setDialogOpen(false)
        }}
      />
    </Box>
  )
}
