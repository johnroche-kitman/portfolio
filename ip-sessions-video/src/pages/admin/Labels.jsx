import { useMemo, useState } from 'react'
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Menu, MenuItem,
  Paper, TextField, Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import { FilterRow, AdminGrid, PageHeader } from './parts'
import { LABELS, LABEL_COLORS } from '../../data/admin'

const CREATORS = [...new Set(LABELS.map(l => l.by))]

export default function Labels() {
  const [query, setQuery] = useState('')
  const [by, setBy] = useState('')
  const [rowEl, setRowEl] = useState(null)
  const [dialog, setDialog] = useState(false)
  const [colour, setColour] = useState('#3ddc84')

  const rows = useMemo(() => LABELS
    .filter(l => l.name.toLowerCase().includes(query.toLowerCase()))
    .filter(l => !by || l.by === by), [query, by])

  const columns = [
    {
      field: 'name', headerName: 'Label Name', flex: 1, minWidth: 200,
      renderCell: p => (
        <Chip size="small" label={p.row.name}
          sx={{ height: 22, fontSize: 11, fontWeight: 600, color: colors.white,
            bgcolor: LABEL_COLORS[p.row.name] || colors.grey_150 }} />
      ),
    },
    { field: 'description', headerName: 'Description', flex: 1.2, minWidth: 200 },
    { field: 'by', headerName: 'Created by', flex: 0.8, minWidth: 150 },
    { field: 'on', headerName: 'Created on', flex: 0.7, minWidth: 130 },
    {
      field: 'actions', headerName: '', width: 56, sortable: false, align: 'right',
      renderCell: p => (
        <IconButton size="small" aria-label={`Actions for ${p.row.name}`}
          onClick={e => { e.stopPropagation(); setRowEl(e.currentTarget) }}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ]

  return (
    <AppShell title="Labels">
      <PageHeader title="Labels" actions={<Button onClick={() => setDialog(true)}>Create label</Button>} />

      <Box sx={{ p: 3 }}>
        <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 2.5, width: '100%' }}>
          <FilterRow>
            <TextField label="Search" value={query} onChange={e => setQuery(e.target.value)} sx={{ width: 220 }}
              InputProps={{ endAdornment: <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} /> }} />
            <TextField select label="Created by" value={by} onChange={e => setBy(e.target.value)} sx={{ width: 260 }}>
              <MenuItem value="">All</MenuItem>
              {CREATORS.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
            <TextField label="Start" type="date" InputLabelProps={{ shrink: true }} sx={{ width: 180 }} />
            <Typography sx={{ alignSelf: 'center', color: 'text.secondary' }}>–</Typography>
            <TextField label="End" type="date" InputLabelProps={{ shrink: true }} sx={{ width: 180 }} />
          </FilterRow>

          <AdminGrid rows={rows} columns={columns} rowHeight={52}
            pageSizeOptions={[10, 25]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            />
        </Paper>
      </Box>

      <Menu anchorEl={rowEl} open={!!rowEl} onClose={() => setRowEl(null)}>
        <MenuItem sx={{ minWidth: 140 }} onClick={() => setRowEl(null)}>Edit</MenuItem>
        <MenuItem sx={{ color: colors.red_100 }} onClick={() => setRowEl(null)}>Delete</MenuItem>
      </Menu>

      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create label</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mt: 0.5 }}>
            <TextField label="Label" sx={{ flex: 1 }} />
            <Box>
              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mb: 0.5 }}>Color</Typography>
              {/* Native colour input — the live picker offers the same branding palette plus a custom value. */}
              <Box component="input" type="color" value={colour} onChange={e => setColour(e.target.value)}
                aria-label="Label colour"
                sx={{ width: 44, height: 40, p: 0.5, border: `1px solid ${colors.neutral_400}`, borderRadius: 1,
                  bgcolor: colors.white, cursor: 'pointer' }} />
            </Box>
          </Box>
          <TextField label="Description" fullWidth sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="text" onClick={() => setDialog(false)}>Cancel</Button>
          <Button onClick={() => setDialog(false)}>Create</Button>
        </DialogActions>
      </Dialog>
    </AppShell>
  )
}
