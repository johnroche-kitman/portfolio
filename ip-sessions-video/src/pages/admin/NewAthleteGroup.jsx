import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Divider, MenuItem, Paper, TextField, Typography } from '@mui/material'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import { LABEL_COLORS } from '../../data/admin'

const ALL_LABELS = Object.keys(LABEL_COLORS)

export default function NewAthleteGroup() {
  const navigate = useNavigate()
  const [labels, setLabels] = useState([])
  const [applied, setApplied] = useState(false)

  return (
    <AppShell title="Athlete Groups" fullHeight>
      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        <TextField label="Athlete group name" sx={{ width: 460, mb: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 2 }}>
          <TextField
            select SelectProps={{ multiple: true }} label="Labels" value={labels} sx={{ width: 300 }}
            onChange={e => { setLabels(e.target.value); setApplied(false) }}
          >
            {ALL_LABELS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
          </TextField>
          {/* Apply is what turns the label conditions into a membership list. */}
          <Button variant="outlined" onClick={() => setApplied(true)}>Apply</Button>
        </Box>

        <Paper variant="outlined" sx={{ borderColor: colors.neutral_300 }}>
          <Box sx={{ px: 2, py: 1.25, borderBottom: `1px solid ${colors.neutral_300}` }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>Athletes</Typography>
          </Box>
          <Box sx={{ py: 5, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
              {applied && labels.length
                ? `${labels.length} condition${labels.length > 1 ? 's' : ''} applied. No athletes match yet.`
                : 'No conditions set.'}
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Divider />
      <Box sx={{ px: 3, py: 1.5, display: 'flex', gap: 1.5, flexShrink: 0 }}>
        <Button variant="outlined" onClick={() => navigate('/administration/groups')}>Cancel</Button>
        <Button onClick={() => navigate('/administration/groups')}>Save</Button>
      </Box>
    </AppShell>
  )
}
