import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  Autocomplete, Box, Button, Checkbox, Chip, Divider, FormControlLabel, IconButton,
  MenuItem, Paper, TextField, ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import AthleteCell from '../../components/AthleteCell'
import { athletes, squads } from '../../data/athletes'
import {
  COMPETITIONS, EVENT_TYPES_LIST, LOCATIONS, REPEATS, SESSION_TYPES, TIMEZONES, VENUES, events,
} from '../../data/events'

/** Section wrapper — gives each group its own card and breathing room. */
const Section = ({ title, description, children }) => (
  <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 3, mb: 2.5 }}>
    <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 700, mb: description ? 0.5 : 2 }}>
      {title}
    </Typography>
    {description && (
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{description}</Typography>
    )}
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
      {children}
    </Box>
  </Paper>
)

const Full = ({ children }) => <Box sx={{ gridColumn: '1 / -1' }}>{children}</Box>

/**
 * Full-page create/edit for games, sessions and events.
 * Replaces the side panels in the live app, which were too cramped for the
 * number of fields these flows carry.
 */
export default function EventEditor() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [params] = useSearchParams()

  const existing = id && id !== 'new' ? events.find(e => String(e.id) === String(id)) : null
  const type = existing?.type || params.get('type') || 'Session'
  const isNew = !existing

  const [title, setTitle] = useState(existing?.title || '')
  const [loading, setLoading] = useState('Squad loading')
  const [selected, setSelected] = useState(isNew ? [] : athletes.slice(0, 3))

  const heading = isNew ? `New ${type.toLowerCase()}` : title || `Edit ${type.toLowerCase()}`

  return (
    <AppShell title={type === 'Game' ? 'Schedule' : 'Calendar'}>
      {/* Sticky action bar so Save is always reachable on a long form */}
      <Box
        sx={{
          position: 'sticky', top: 56, zIndex: 2, bgcolor: colors.white,
          borderBottom: `1px solid ${colors.neutral_300}`, px: 3, py: 1.5,
          display: 'flex', alignItems: 'center', gap: 2,
        }}
      >
        <IconButton size="small" onClick={() => navigate(-1)} aria-label="Back"><ArrowBackIcon /></IconButton>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }} noWrap>{heading}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {type} · U16 (Test Kitman FC)
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        {!isNew && (
          <Button variant="text" color="error" startIcon={<DeleteIcon />}>Delete</Button>
        )}
        <Button variant="outlined" onClick={() => navigate(-1)}>Cancel</Button>
        <Button onClick={() => navigate('/calendar')}>{isNew ? 'Create' : 'Save changes'}</Button>
      </Box>

      <Box sx={{ maxWidth: 1080, mx: 'auto', px: 3, py: 3 }}>
        {type === 'Session' && (
          <Section title="Workload" description="How loading is recorded for this session.">
            <Full>
              <ToggleButtonGroup
                exclusive value={loading} onChange={(_, v) => v && setLoading(v)} color="primary"
              >
                <ToggleButton value="Squad loading">Squad loading</ToggleButton>
                <ToggleButton value="Individual loading">Individual loading</ToggleButton>
              </ToggleButtonGroup>
            </Full>
          </Section>
        )}

        <Section title="Details">
          {type === 'Session' && (
            <TextField select label="Session type" defaultValue={existing?.sessionType || SESSION_TYPES[0]}>
              {SESSION_TYPES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          )}
          {type === 'Event' && (
            <TextField select label="Event type" defaultValue={existing?.eventType || EVENT_TYPES_LIST[0]}>
              {EVENT_TYPES_LIST.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          )}
          {type === 'Game' && (
            <TextField select label="Competition" defaultValue={existing?.competition || COMPETITIONS[0]}>
              {COMPETITIONS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          )}
          <TextField label="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <TextField select label="Squad" defaultValue={squads[0]}>
            {squads.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          {type === 'Game' && (
            <TextField select label="Venue" defaultValue={existing?.venue || VENUES[0]}>
              {VENUES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          )}
          {type === 'Event' && (
            <Full>
              <TextField label="Description" multiline minRows={3} fullWidth helperText="250 characters remaining" />
            </Full>
          )}
        </Section>

        <Section title="Schedule">
          <TextField label="Date" type="date" defaultValue="2026-08-27" InputLabelProps={{ shrink: true }} />
          <TextField label="Start time" type="time" defaultValue={existing?.start || '10:00'} InputLabelProps={{ shrink: true }} />
          {type === 'Game'
            ? <TextField label="End time" type="time" defaultValue={existing?.end || '16:30'} InputLabelProps={{ shrink: true }} />
            : <TextField label="Duration" defaultValue="60" helperText="minutes" />}
          <TextField select label="Timezone" defaultValue={TIMEZONES[0]}>
            {TIMEZONES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          {type !== 'Game' && (
            <TextField select label="Repeats" defaultValue={existing?.repeats || REPEATS[0]}>
              {REPEATS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          )}
        </Section>

        <Section title="Location">
          <Full>
            <Autocomplete
              freeSolo options={LOCATIONS} defaultValue={existing?.location || ''}
              renderInput={p => <TextField {...p} label="Search locations" fullWidth />}
            />
          </Full>
        </Section>

        <Section title="Attendance" description="Athletes and staff attached to this event.">
          <Full>
            <Autocomplete
              multiple options={athletes} value={selected} onChange={(_, v) => setSelected(v)}
              getOptionLabel={o => o.name} disableCloseOnSelect
              isOptionEqualToValue={(o, v) => o.id === v.id}
              renderOption={(props, option, { selected: sel }) => (
                <Box component="li" {...props} key={option.id} sx={{ gap: 1 }}>
                  <Checkbox size="small" checked={sel} sx={{ mr: 1 }} />
                  <AthleteCell athlete={option} />
                </Box>
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip size="small" label={option.name} {...getTagProps({ index })} key={option.id} />
                ))
              }
              renderInput={p => <TextField {...p} label="Athletes" fullWidth />}
            />
          </Full>
          <Full>
            <Autocomplete
              multiple options={['John Roche Test', 'ST Test', 'Pablo de Miguel', 'MKing Staff']}
              renderInput={p => <TextField {...p} label="Staff" fullWidth />}
            />
          </Full>
          {selected.length > 0 && (
            <Full>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {selected.length} athlete{selected.length === 1 ? '' : 's'} selected
              </Typography>
            </Full>
          )}
        </Section>

        {type === 'Session' && (
          <Section title="Options" description="Applied when the session is saved.">
            <Full>
              <FormControlLabel control={<Checkbox defaultChecked />} label="Notify attendees" sx={{ display: 'block' }} />
              <FormControlLabel control={<Checkbox />} label="Add to athlete calendars" sx={{ display: 'block' }} />
              <FormControlLabel control={<Checkbox />} label="Require attendance confirmation" sx={{ display: 'block' }} />
            </Full>
          </Section>
        )}

        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, pb: 2 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>Cancel</Button>
          <Button onClick={() => navigate('/calendar')}>{isNew ? 'Create' : 'Save changes'}</Button>
        </Box>
      </Box>
    </AppShell>
  )
}
