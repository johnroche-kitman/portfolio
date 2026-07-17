import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '../Button'

export default function AddExerciseDialog({ open, onClose, onSubmit, days, defaultDayKey }) {
  const [dayKey, setDayKey] = useState(defaultDayKey)
  const [name, setName] = useState('')
  const [sets, setSets] = useState('')
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')

  useEffect(() => {
    if (open) setDayKey(defaultDayKey)
  }, [open, defaultDayKey])

  const reset = () => {
    setName('')
    setSets('')
    setReps('')
    setWeight('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = () => {
    if (!name.trim()) return
    onSubmit(dayKey, { name: name.trim(), sets: sets.trim(), reps: reps.trim(), weight: weight.trim() })
    reset()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add exercise</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 1 }}>
          <Select size="small" value={dayKey} onChange={(e) => setDayKey(e.target.value)} fullWidth>
            {days.map((day) => (
              <MenuItem key={day.key} value={day.key}>
                {day.label}
              </MenuItem>
            ))}
          </Select>
          <TextField label="Exercise" size="small" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <Box display="flex" gap={2}>
            <TextField label="Sets" size="small" value={sets} onChange={(e) => setSets(e.target.value)} fullWidth />
            <TextField label="Reps" size="small" value={reps} onChange={(e) => setReps(e.target.value)} fullWidth />
            <TextField label="kg" size="small" value={weight} onChange={(e) => setWeight(e.target.value)} fullWidth />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, pt: 0 }}>
        <Button tone="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!name.trim()}>
          Add exercise
        </Button>
      </DialogActions>
    </Dialog>
  )
}
