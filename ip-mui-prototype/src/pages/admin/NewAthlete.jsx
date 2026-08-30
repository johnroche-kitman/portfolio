import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert, Autocomplete, Avatar, Box, Button, Chip, Divider, MenuItem, Paper, TextField, Typography,
} from '@mui/material'
import UploadIcon from '@mui/icons-material/FileUploadOutlined'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import { SectionLabel } from './parts'
import {
  ATHLETE_PROFILE_FIELDS, COUNTRIES, DIAL_CODES, LABEL_COLORS, LANGUAGES, ROSTER_POSITIONS,
} from '../../data/admin'
import { squads } from '../../data/athletes'

const ALL_LABELS = Object.keys(LABEL_COLORS)

const Sel = ({ label, options, ...rest }) => (
  <TextField select fullWidth label={label} defaultValue="" {...rest}>
    {options.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
  </TextField>
)

export default function NewAthlete() {
  const navigate = useNavigate()
  const [banner, setBanner] = useState(true)
  const [squadValues, setSquadValues] = useState([squads[0]])
  const [labels, setLabels] = useState([])

  return (
    <AppShell title="Manage Athletes" fullHeight>
      {/* Sticky action bar: the page's only primary lives here. */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 3, flexShrink: 0, bgcolor: colors.white,
        borderBottom: `1px solid ${colors.neutral_300}`, px: 3, py: 1.5,
        display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>New Athlete</Typography>
        <Button variant="outlined" onClick={() => navigate('/administration/athletes')}>Cancel</Button>
        <Button onClick={() => navigate('/administration/athletes')}>Create</Button>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {banner && (
          <Alert severity="error" onClose={() => setBanner(false)} sx={{ borderRadius: 0 }}>
            <Box component="strong">Error!</Box> The current season is not set up correctly for this squad.
            Please contact support
          </Alert>
        )}

        <Box sx={{ maxWidth: 1100, mx: 'auto', px: 3, pb: 6 }}>
          <SectionLabel>Athlete details</SectionLabel>
          <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 3, mb: 2.5 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 220px' }, gap: 2.5 }}>
              <Box sx={{ display: 'grid', gap: 2.5, alignContent: 'start' }}>
                <TextField fullWidth label="First name" />
                <TextField fullWidth label="Last name" />
                <TextField fullWidth label="Display Name" />
                <TextField fullWidth label="Shortened Name" />
                <TextField fullWidth label="Date of birth" type="date" InputLabelProps={{ shrink: true }} />
                <Sel label="Country" options={COUNTRIES} />
                <TextField fullWidth label="Height (cm)" type="number" />
              </Box>

              <Box sx={{ display: 'grid', gap: 2.5, alignContent: 'start' }}>
                <Sel label="Position" options={ROSTER_POSITIONS} />
                <Autocomplete
                  multiple options={squads} value={squadValues} onChange={(_, v) => setSquadValues(v)}
                  renderTags={(v, getTagProps) =>
                    v.map((o, i) => <Chip size="small" label={o} {...getTagProps({ index: i })} key={o} />)}
                  renderInput={p => <TextField {...p} fullWidth label="Squad" />}
                />
                <Autocomplete
                  multiple options={ALL_LABELS} value={labels} onChange={(_, v) => setLabels(v)}
                  renderTags={(v, getTagProps) =>
                    v.map((o, i) => (
                      <Chip key={o} size="small" label={o} {...getTagProps({ index: i })}
                        sx={{ bgcolor: LABEL_COLORS[o], color: colors.white }} />
                    ))}
                  renderInput={p => <TextField {...p} fullWidth label="Labels" placeholder="Select labels..." />}
                />
                <Sel label="Primary Squad" options={['None', ...squads]} defaultValue="None" />
                <TextField fullWidth label="Squad Number" />
                <TextField fullWidth label="Association Player ID" />
                <TextField fullWidth label="External ID" />
                <TextField fullWidth label="CRM ID" />
                <TextField fullWidth label="Insurance ID" />
                <Sel label="Status" options={['Active', 'Inactive']} defaultValue="Active" />
              </Box>

              <Box>
                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mb: 1 }}>Avatar</Typography>
                <Avatar variant="rounded" sx={{ width: 150, height: 150, bgcolor: colors.neutral_200 }} />
                <Button variant="outlined" startIcon={<UploadIcon />} sx={{ mt: 2 }}>Select file</Button>
              </Box>
            </Box>
          </Paper>

          <SectionLabel>Profile fields</SectionLabel>
          <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 3, mb: 2.5 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 2.5 }}>
              {ATHLETE_PROFILE_FIELDS.map(f => (
                f.options
                  ? <Sel key={f.label} label={f.label} options={f.options} />
                  : <TextField key={f.label} fullWidth label={f.label}
                      multiline={f.label === 'General Notes'} minRows={f.label === 'General Notes' ? 3 : undefined} />
              ))}
            </Box>
          </Paper>

          <SectionLabel>User Details</SectionLabel>
          <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
              <TextField fullWidth label="New Athlete Username" />
              <TextField fullWidth label="New Athlete Email" type="email" />
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <TextField select label="Code" defaultValue={DIAL_CODES[0]} sx={{ width: 190 }}>
                  {DIAL_CODES.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </TextField>
                <TextField fullWidth label="Mobile number" />
              </Box>
              <Sel label="Language" options={LANGUAGES} defaultValue={LANGUAGES[0]} />
            </Box>
          </Paper>

          <Divider sx={{ my: 3 }} />
          <Button variant="text" onClick={() => navigate('/administration/athletes')}>
            ← Cancel and return to Athletes
          </Button>
        </Box>
      </Box>
    </AppShell>
  )
}
