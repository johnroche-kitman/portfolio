import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Button from '../Button'

const NOTE_TYPES = ['General note', 'Issue note', 'Medication note']

export default function AddNoteDialog({ open, onClose, onSubmit }) {
  const [title, setTitle] = useState('')
  const [noteType, setNoteType] = useState(NOTE_TYPES[0])
  const [text, setText] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)

  const reset = () => {
    setTitle('')
    setNoteType(NOTE_TYPES[0])
    setText('')
    setIsPrivate(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = () => {
    if (!text.trim()) return
    onSubmit({ title: title.trim() || 'Note', noteType, text: text.trim(), isPrivate })
    reset()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add note</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 1 }}>
          <TextField label="Title" size="small" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
          <Select size="small" value={noteType} onChange={(e) => setNoteType(e.target.value)} fullWidth>
            {NOTE_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Note"
            size="small"
            value={text}
            onChange={(e) => setText(e.target.value)}
            multiline
            minRows={4}
            fullWidth
          />
          <FormControlLabel
            control={<Checkbox checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />}
            label="Mark as private"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, pt: 0 }}>
        <Button tone="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!text.trim()}>
          Add note
        </Button>
      </DialogActions>
    </Dialog>
  )
}
