import { useState } from 'react'
import {
  Box, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography,
} from '@mui/material'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import { SelectField } from '../../components/form'
import { ASSESSMENT_TEMPLATES, libraryGames, librarySessionTypes } from '../../data/forms'

/**
 * Two cards, each independently editable. Edit values swaps that card's button
 * for Save and Cancel and turns its Assessment type column into selects; the
 * other card stays read-only. Same inline pattern as the Organisation Settings
 * tabs, so it is the card that owns the edit state, not the page.
 */
function ValueCard({ title, typeLabel, rows: initial }) {
  const [rows, setRows] = useState(initial)
  const [draft, setDraft] = useState(initial)
  const [editing, setEditing] = useState(false)

  const start = () => { setDraft(rows); setEditing(true) }
  const save = () => { setRows(draft); setEditing(false) }

  return (
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 3, mb: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
        <Typography variant="subtitle1">{title}</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {editing
            ? <>
                <Button size="small" onClick={save}>Save</Button>
                <Button size="small" variant="outlined" onClick={() => setEditing(false)}>Cancel</Button>
              </>
            : <Button size="small" variant="outlined" onClick={start}>Edit values</Button>}
        </Box>
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '32%' }}>{typeLabel}</TableCell>
            <TableCell>Assessment type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(editing ? draft : rows).map(r => (
            <TableRow key={r.id}>
              <TableCell>{r.type}</TableCell>
              <TableCell>
                {editing
                  ? <SelectField
                      options={ASSESSMENT_TEMPLATES} value={r.template} sx={{ width: 280 }}
                      onChange={e => setDraft(d => d.map(x => (x.id === r.id ? { ...x, template: e.target.value } : x)))}
                    />
                  : (r.template || <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {title === 'Games' ? 'No templates set' : ''}
                    </Typography>)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default function PlanningLibrary() {
  return (
    <AppShell title="Library">
      <Box sx={{ px: 3, py: 3 }}>
        <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 3, mb: 2.5 }}>
          <Typography variant="h5">Library</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Settings only apply to this squad
          </Typography>
        </Paper>

        <ValueCard title="Games" typeLabel="Game type" rows={libraryGames} />
        <ValueCard title="Session Types" typeLabel="Session type" rows={librarySessionTypes} />
      </Box>
    </AppShell>
  )
}
