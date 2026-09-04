import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  Autocomplete, Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, MenuItem, Paper,
  Radio, RadioGroup, TextField, ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import UploadIcon from '@mui/icons-material/CloudUploadOutlined'
import AddIcon from '@mui/icons-material/Add'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import AthleteCell from '../../components/AthleteCell'
import { athletes, squads } from '../../data/athletes'
import {
  COMPETITIONS, COMPETITION_TYPES, EVENT_TYPE_OPTIONS, FIXTURE_RATINGS, FORMATS,
  GAME_DAY_OPTIONS, LABELS, LOCATIONS, PERIOD_MODES, REPEAT_COPY_FIELDS, REPEAT_OPTIONS,
  SESSION_TYPES, STAFF, STAFF_VISIBILITY, SURFACE_QUALITIES, SURFACE_TYPES, TIMEZONES,
  VENUES, WEATHER, events,
} from '../../data/events'

const Section = ({ title, action, children }) => (
  <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 3, mb: 2.5 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 700 }}>{title}</Typography>
      {action}
    </Box>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
      {children}
    </Box>
  </Paper>
)
const Full = ({ children }) => <Box sx={{ gridColumn: '1 / -1' }}>{children}</Box>
// fullWidth is explicit: TextField passes fullWidth={false} to its FormControl,
// which overrides the theme default. Without it a select inside a plain Box
// wrapper collapses to the width of its value — nothing, when it is empty.
const Sel = ({ label, options, ...rest }) => (
  <TextField select fullWidth label={label} {...rest}>
    {options.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
  </TextField>
)

/* --------------------------------------------------- Custom repeat modal */
function CustomRepeatDialog({ open, onClose }) {
  const [ends, setEnds] = useState('never')
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Custom</DialogTitle>
      <DialogContent>
        <FormLabel sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}>Repeat every</FormLabel>
        <Box sx={{ display: 'flex', gap: 1.5, mt: 1, mb: 3 }}>
          <TextField defaultValue="1" sx={{ width: 80 }} fullWidth={false} />
          <Sel label="" options={['day', 'week', 'month', 'year']} defaultValue="week" sx={{ width: 150 }} />
        </Box>

        <FormLabel sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}>Repeat on</FormLabel>
        <Box sx={{ display: 'flex', gap: 0.5, mt: 1, mb: 3 }}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <Box key={i} sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>{d}</Typography>
              <Checkbox size="small" defaultChecked={i === 4} sx={{ p: 0.5 }} />
            </Box>
          ))}
        </Box>

        <FormLabel sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}>Ends</FormLabel>
        <RadioGroup value={ends} onChange={e => setEnds(e.target.value)} sx={{ mt: 0.5 }}>
          <FormControlLabel value="never" control={<Radio size="small" />} label="Never" />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <FormControlLabel value="on" control={<Radio size="small" />} label="On" sx={{ minWidth: 74 }} />
            <TextField type="date" defaultValue="2026-08-28" disabled={ends !== 'on'} sx={{ flex: 1 }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
            <FormControlLabel value="after" control={<Radio size="small" />} label="After" sx={{ minWidth: 74 }} />
            <TextField disabled={ends !== 'after'} sx={{ flex: 1 }}
              InputProps={{ endAdornment: <InputAdornment position="end">Times</InputAdornment> }} />
          </Box>
        </RadioGroup>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant="text" onClick={onClose}>Cancel</Button>
        <Button onClick={onClose}>Done</Button>
      </DialogActions>
    </Dialog>
  )
}

/* ------------------------------------------------------- shared sections */
const AttendanceSection = ({ selected, setSelected, showVisibility }) => (
  <Section title="Attendance">
    <Full>
      <Autocomplete
        multiple options={athletes} value={selected} onChange={(_, v) => setSelected(v)}
        getOptionLabel={o => o.name} disableCloseOnSelect isOptionEqualToValue={(o, v) => o.id === v.id}
        renderOption={(props, option, { selected: sel }) => (
          <Box component="li" {...props} key={option.id}>
            <Checkbox size="small" checked={sel} sx={{ mr: 1 }} />
            <AthleteCell athlete={option} />
          </Box>
        )}
        renderTags={(value, getTagProps) =>
          value.map((o, i) => <Chip size="small" label={o.name} {...getTagProps({ index: i })} key={o.id} />)}
        renderInput={p => <TextField {...p} label="Athletes" placeholder="Search" fullWidth />}
      />
    </Full>
    <Full>
      <Autocomplete multiple options={STAFF}
        renderInput={p => <TextField {...p} label="Staff" placeholder="Search" fullWidth />} />
    </Full>
    {showVisibility && (
      <Full>
        <FormControl>
          <FormLabel sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary', mb: 0.5 }}>Staff visibility</FormLabel>
          <RadioGroup defaultValue={STAFF_VISIBILITY[0]}>
            {STAFF_VISIBILITY.map(v => (
              <FormControlLabel key={v} value={v} control={<Radio size="small" />} label={v} />
            ))}
          </RadioGroup>
        </FormControl>
      </Full>
    )}
  </Section>
)

const ConditionsFields = () => (
  <>
    {/* The asterisk carries the requirement — no need to repeat it in helper text. */}
    <Sel label="Surface Type" options={SURFACE_TYPES} defaultValue="" required />
    <Sel label="Surface Quality" options={SURFACE_QUALITIES} defaultValue="" />
    <Sel label="Weather" options={WEATHER} defaultValue="" />
    <TextField label="Temperature"
      InputProps={{ endAdornment: <InputAdornment position="end">°C</InputAdornment> }} />
  </>
)

function AttachmentsSection() {
  const [links, setLinks] = useState([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  return (
    <Section title="Attachments">
      <Full>
        <Box sx={{ border: `1px dashed ${colors.neutral_400}`, borderRadius: 1, py: 4, textAlign: 'center',
          bgcolor: colors.neutral_100, cursor: 'pointer' }}>
          <UploadIcon sx={{ color: 'text.secondary' }} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Drag &amp; drop your files or <Box component="span" sx={{ textDecoration: 'underline' }}>browse</Box>
          </Typography>
        </Box>
      </Full>
      <Full>
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Links</Typography>
        <Box sx={{ display: 'flex', gap: 1.5, mt: 0.5, alignItems: 'flex-start' }}>
          <TextField label="Title" value={title} onChange={e => setTitle(e.target.value)} sx={{ flex: 1 }} />
          <TextField label="Link" value={url} onChange={e => setUrl(e.target.value)} sx={{ flex: 2 }} />
          {/* Secondary: one primary per view, and on this page that is Save in the header. */}
          <Button variant="outlined" startIcon={<AddIcon />} sx={{ mt: 0.5 }}
            onClick={() => { if (title || url) { setLinks(l => [...l, { title, url }]); setTitle(''); setUrl('') } }}>
            Add
          </Button>
        </Box>
        {links.map((l, i) => (
          <Chip key={i} size="small" label={l.title || l.url} sx={{ mt: 1, mr: 1 }}
            onDelete={() => setLinks(ls => ls.filter((_, n) => n !== i))} />
        ))}
      </Full>
    </Section>
  )
}

const NotifyRow = ({ label }) => (
  <Full>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
      <Typography variant="body2" sx={{ minWidth: 150, fontWeight: 600 }}>{label}</Typography>
      <FormControlLabel control={<Checkbox size="small" />} label="Email" />
      <FormControlLabel control={<Checkbox size="small" />} label="Push" />
    </Box>
  </Full>
)

const NotificationsSection = () => (
  <Section title="Notifications">
    <NotifyRow label="Notify staff by" />
    <NotifyRow label="Notify athletes by" />
    <NotifyRow label="Reminders" />
    <Full>
      <Sel label="Reminder" options={['15 minutes before', '30 minutes before', '1 hour before', '1 day before']}
        defaultValue="" sx={{ maxWidth: 320 }} />
    </Full>
  </Section>
)

/* -------------------------------------------------------------- editor */
export default function EventEditor() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [params] = useSearchParams()

  const existing = id && id !== 'new' ? events.find(e => String(e.id) === String(id)) : null
  const type = existing?.type || params.get('type') || 'Session'
  const isNew = !existing

  const [title, setTitle] = useState(existing?.title || '')
  const [loading, setLoading] = useState('Squad loading')
  const [repeats, setRepeats] = useState(existing?.repeats || REPEAT_OPTIONS[0])
  const [customOpen, setCustomOpen] = useState(false)
  const [periodMode, setPeriodMode] = useState('Split Evenly')
  const [selected, setSelected] = useState(isNew ? [] : athletes.slice(0, 3))

  const repeating = repeats !== REPEAT_OPTIONS[0]
  const heading = isNew ? `New ${type.toLowerCase()}` : title || `Edit ${type.toLowerCase()}`

  const onRepeatChange = v => { setRepeats(v); if (v === 'Custom') setCustomOpen(true) }

  return (
    <AppShell title={type === 'Game' ? 'Schedule' : 'Calendar'}>
      <Box sx={{ position: 'sticky', top: 56, zIndex: 2, bgcolor: colors.white,
        borderBottom: `1px solid ${colors.neutral_300}`, px: 3, py: 1.5,
        display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton size="small" onClick={() => navigate(-1)} aria-label="Back"><ArrowBackIcon /></IconButton>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }} noWrap>{heading}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{type} · U16</Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        {!isNew && <Button variant="text" color="error" startIcon={<DeleteIcon />}>Delete</Button>}
        <Button variant="outlined" onClick={() => navigate(-1)}>Cancel</Button>
        <Button onClick={() => navigate('/calendar')}>{isNew ? 'Create' : 'Save'}</Button>
      </Box>

      <Box sx={{ maxWidth: 1080, mx: 'auto', px: 3, py: 3 }}>
        {type === 'Session' && (
          <Section title="Workload">
            <Full>
              <ToggleButtonGroup exclusive value={loading} onChange={(_, v) => v && setLoading(v)} color="primary">
                <ToggleButton value="Squad loading">Squad loading</ToggleButton>
                <ToggleButton value="Individual loading">Individual loading</ToggleButton>
              </ToggleButtonGroup>
            </Full>
          </Section>
        )}

        <Section title="Details">
          {type === 'Session' && <Sel label="Session type" options={SESSION_TYPES} defaultValue={existing?.sessionType || ''} />}
          {type === 'Event' && <Sel label="Event Type" options={EVENT_TYPE_OPTIONS} defaultValue={existing?.eventType || ''} />}
          {type !== 'Game' && <TextField label="Title" value={title} onChange={e => setTitle(e.target.value)} />}
          <Sel label="Squad" options={squads} defaultValue={squads[0]} />
          <TextField label="Date" type="date" defaultValue="2026-08-28" InputLabelProps={{ shrink: true }} />
          <TextField label="Start Time" type="time" defaultValue={existing?.start || '17:35'} InputLabelProps={{ shrink: true }} />
          {type !== 'Game' && (
            <TextField label="Duration" defaultValue="60"
              InputProps={{ endAdornment: <InputAdornment position="end">mins</InputAdornment> }} />
          )}
          <Sel label="Timezone" options={TIMEZONES} defaultValue={TIMEZONES[0]} />
          {type !== 'Game' && (
            <>
              <Sel label="Repeats" options={REPEAT_OPTIONS} value={repeats}
                onChange={e => onRepeatChange(e.target.value)} />
              {repeating && (
                <Full>
                  <Box sx={{ bgcolor: colors.neutral_100, borderRadius: 1, p: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      Choose the fields to copy for all repeated {type.toLowerCase()}s
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                      {REPEAT_COPY_FIELDS.map(fld => (
                        <FormControlLabel key={fld.label}
                          control={<Checkbox size="small" defaultChecked disabled={fld.locked} />}
                          label={<Typography variant="body2">{fld.label}</Typography>} />
                      ))}
                    </Box>
                  </Box>
                </Full>
              )}
            </>
          )}
          {type === 'Event' && (
            <Full>
              <TextField label="Description" multiline minRows={3} fullWidth
                helperText="Optional · 250 characters remaining" />
            </Full>
          )}
        </Section>

        <Section title="Location">
          <Full>
            <Autocomplete freeSolo options={LOCATIONS} defaultValue={existing?.location || ''}
              renderInput={p => <TextField {...p} label="Enter an address location" placeholder="Search locations…" fullWidth />} />
          </Full>
        </Section>

        <AttendanceSection selected={selected} setSelected={setSelected} showVisibility={type === 'Event'} />

        {type === 'Game' && (
          <Section title="Game details">
            <Sel label="Competition" options={COMPETITIONS} defaultValue={existing?.competition || COMPETITIONS[0]} />
            <Sel label="Competition type" options={COMPETITION_TYPES} defaultValue={COMPETITION_TYPES[0]} />
            <TextField label="Team" defaultValue="U16" />
            <TextField label="Team score" type="number" />
            <TextField label="Opposition" defaultValue={existing?.opposition || ''} />
            <TextField label="Opposition score" type="number" />
            <TextField label="Round" defaultValue={existing?.round || ''} />
            <Sel label="Venue" options={VENUES} defaultValue={existing?.venue || VENUES[0]} />
            <TextField label="Duration" defaultValue="90"
              InputProps={{ endAdornment: <InputAdornment position="end">min</InputAdornment> }} />
            <Box>
              <FormLabel sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}>Periods</FormLabel>
              <Box sx={{ display: 'flex', gap: 1.5, mt: 0.75, alignItems: 'center' }}>
                <ToggleButtonGroup exclusive size="small" value={periodMode}
                  onChange={(_, v) => v && setPeriodMode(v)} color="primary">
                  {PERIOD_MODES.map(m => <ToggleButton key={m} value={m}>{m}</ToggleButton>)}
                </ToggleButtonGroup>
                <TextField defaultValue="45" sx={{ width: 110 }}
                  InputProps={{ endAdornment: <InputAdornment position="end">min</InputAdornment> }} />
              </Box>
            </Box>
            <Sel label="Format" options={FORMATS} defaultValue={existing?.format || FORMATS[0]} />
            <Sel label="Fixture rating" options={FIXTURE_RATINGS} defaultValue="" />
            <ConditionsFields />
          </Section>
        )}

        {type !== 'Event' && (
          <Section title="Description">
            <Full>
              <TextField label="Description" multiline minRows={3} fullWidth
                helperText="Optional · 250 characters remaining" />
            </Full>
          </Section>
        )}

        <Section title="Additional details">
          {type === 'Session' && (
            <>
              <Sel label="Game Day +/-" options={GAME_DAY_OPTIONS} defaultValue="" />
              <ConditionsFields />
            </>
          )}
          {type === 'Game' && (
            <Full>
              <FormControlLabel control={<Checkbox />} label="Create turnaround marker" />
            </Full>
          )}
          <Full>
            <Autocomplete multiple freeSolo options={LABELS}
              renderInput={p => <TextField {...p} label="Labels" fullWidth />} />
          </Full>
        </Section>

        <AttachmentsSection />
        <NotificationsSection />
        <Box sx={{ height: 8 }} />
      </Box>

      <CustomRepeatDialog open={customOpen} onClose={() => setCustomOpen(false)} />
    </AppShell>
  )
}
