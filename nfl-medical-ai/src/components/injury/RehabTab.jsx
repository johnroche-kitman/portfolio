import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '../Button'
import Icon from '../Icon'
import Lozenge from '../Lozenge'
import AddExerciseDialog from './AddExerciseDialog'
import { useAppData } from '../../state/AppDataContext'
import { dateKey, todayKey } from '../../ai/textHelpers'

const FILTER_CONTROL_SX = {
  backgroundColor: 'var(--neutral-200)',
  borderRadius: '6px',
  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '& .MuiOutlinedInput-root': { backgroundColor: 'var(--neutral-200)', borderRadius: '6px' },
}

const WINDOW_LENGTH = 5

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date, amount) {
  const d = new Date(date)
  d.setDate(d.getDate() + amount)
  return d
}

function formatDayLabel(date) {
  return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
}

function computeDayNumber(injuryDateStr, columnDate) {
  const injuryDate = new Date(injuryDateStr)
  if (Number.isNaN(injuryDate.getTime())) return null
  const start = startOfDay(injuryDate)
  const col = startOfDay(columnDate)
  const diffDays = Math.round((col - start) / 86400000)
  return diffDays + 1
}

// Rehab day keys are ISO yyyy-mm-dd strings — parse via explicit
// year/month/day components (not `new Date(iso)`, which parses as UTC
// midnight) so the resulting Date lands on local midnight, matching how
// dateKey()/todayKey() compute their keys from local Date fields.
function parseDateKey(iso) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function PendingRehabBanner({ rehab, onAccept, onReject }) {
  return (
    <Box
      sx={{
        mb: 3,
        p: 2.5,
        borderRadius: '8px',
        backgroundColor: '#fff4dc',
        border: '1px solid var(--color-warning)',
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap" sx={{ mb: 1.5 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Icon name="ai" fontSize="small" sx={{ color: '#7a5300' }} />
          <Typography variant="body1" sx={{ color: '#7a5300' }}>
            Created by the AI assistant for {formatDayLabel(parseDateKey(rehab.date))}. Review the exercises below
            before accepting.
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button onClick={onAccept}>Accept rehab program</Button>
          <Button tone="danger" onClick={onReject}>
            Reject
          </Button>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" gap={0.5}>
        {rehab.exercises.map((exercise, idx) => (
          <Typography key={idx} variant="body2">
            <Box component="span" fontWeight={600}>
              {exercise.name}
            </Box>{' '}
            — {exercise.sets ? `${exercise.sets} sets` : 'Sets'}, {exercise.reps ? `${exercise.reps} reps` : 'Reps'}
            {exercise.weight ? `, ${exercise.weight}kg` : ''}
          </Typography>
        ))}
      </Box>
    </Box>
  )
}

export default function RehabTab({ injury, athlete }) {
  const { getRehabsByInjury, addManualRehabExercise, clearRehabDay, pendingRehabs, acceptRehab, rejectRehab } =
    useAppData()
  const pendingForInjury = pendingRehabs.filter((r) => r.injuryId === injury.id)
  const [windowStart, setWindowStart] = useState(() =>
    pendingForInjury.length ? startOfDay(parseDateKey(pendingForInjury[0].date)) : startOfDay(new Date())
  )
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogDayKey, setDialogDayKey] = useState(todayKey())

  const dayEntries = getRehabsByInjury(injury.id)
  const days = Array.from({ length: WINDOW_LENGTH }, (_, i) => addDays(windowStart, i))
  const dayOptions = days.map((date) => ({ key: dateKey(date), label: `${formatDayLabel(date)}` }))

  const openAddDialog = (dayKey) => {
    setDialogDayKey(dayKey)
    setDialogOpen(true)
  }

  return (
    <Box>
      {pendingForInjury.map((rehab) => (
        <PendingRehabBanner
          key={rehab.id}
          rehab={rehab}
          onAccept={() => acceptRehab(rehab.id)}
          onReject={() => rejectRehab(rehab.id)}
        />
      ))}

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mt: pendingForInjury.length ? 0 : 3, mb: 2 }}
        flexWrap="wrap"
        gap={1.5}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Select size="small" value="5" sx={{ width: 100, ...FILTER_CONTROL_SX }}>
            <MenuItem value="5">5 day</MenuItem>
          </Select>
          <TextField
            size="small"
            value={formatDayLabel(windowStart)}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <Icon name="calendar" fontSize="small" sx={{ color: 'var(--grey-100)' }} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 160, ...FILTER_CONTROL_SX }}
          />
          <Button tone="secondary" onClick={() => setWindowStart(startOfDay(new Date()))}>
            Today
          </Button>
          <IconButton size="small" onClick={() => setWindowStart((d) => addDays(d, -1))}>
            <Icon name="chevronLeft" fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => setWindowStart((d) => addDays(d, 1))}>
            <Icon name="chevronRight" fontSize="small" />
          </IconButton>
        </Box>

        <Box display="flex" gap={1.5}>
          <Button onClick={() => openAddDialog(dayOptions[0].key)}>Add</Button>
          <Tooltip title="Not available in this prototype">
            <span>
              <Button tone="secondary" disabled>
                Edit
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Not available in this prototype">
            <span>
              <Button tone="secondary" disabled>
                Copy
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Not available in this prototype">
            <span>
              <IconButton disabled>
                <Icon name="moreVert" fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      <Box
        display="flex"
        sx={{ backgroundColor: 'var(--white)', borderRadius: '8px', border: '1px solid var(--divider)', overflowX: 'auto' }}
      >
        {days.map((date) => {
          const key = dateKey(date)
          const isToday = key === todayKey()
          const entry = dayEntries.find((e) => e.date === key)
          const dayNumber = computeDayNumber(injury.date, date)
          const hasPending = pendingForInjury.some((r) => r.date === key)

          return (
            <Box
              key={key}
              sx={{
                minWidth: 220,
                flex: '1 0 220px',
                borderRight: '1px solid var(--divider)',
                p: 2,
                '&:last-child': { borderRight: 0 },
              }}
            >
              <Box display="flex" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 1.5 }}>
                <Box>
                  {dayNumber !== null && (
                    <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
                      Day {dayNumber}
                    </Typography>
                  )}
                  <Box display="flex" alignItems="center" gap={0.75} sx={{ mt: 0.5 }}>
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 1,
                        py: 0.25,
                        borderRadius: '4px',
                        fontSize: 13,
                        fontWeight: 600,
                        backgroundColor: isToday ? 'var(--color-primary)' : 'transparent',
                        color: isToday ? '#ffffff' : 'var(--color-primary)',
                      }}
                    >
                      {formatDayLabel(date)}
                    </Box>
                    {hasPending && <Lozenge label="Pending" tone="warning" />}
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={0.25}>
                  <IconButton size="small" onClick={() => openAddDialog(key)}>
                    <Icon name="add" fontSize="small" />
                  </IconButton>
                  <Tooltip title="Not available in this prototype">
                    <span>
                      <IconButton size="small" disabled>
                        <Icon name="swapVert" fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <IconButton size="small" disabled={!entry} onClick={() => entry && clearRehabDay(injury.id, entry.id)}>
                    <Icon name="delete" fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Box display="flex" flexDirection="column" gap={1.5}>
                {(entry?.exercises || []).map((exercise, idx) => (
                  <Box key={idx}>
                    <Typography variant="body1" fontWeight={600}>
                      {exercise.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
                      {exercise.sets ? `${exercise.sets} Sets` : 'Sets'} |{' '}
                      {exercise.reps ? `${exercise.reps} Reps` : 'Reps'} | {exercise.weight ? `${exercise.weight} kg` : 'kg'}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )
        })}
      </Box>

      <AddExerciseDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        days={dayOptions}
        defaultDayKey={dialogDayKey}
        onSubmit={(dayKey, exercise) => {
          addManualRehabExercise(injury.id, dayKey, exercise)
          setDialogOpen(false)
        }}
      />
    </Box>
  )
}
