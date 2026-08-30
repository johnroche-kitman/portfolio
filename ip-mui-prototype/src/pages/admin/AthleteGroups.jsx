import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, IconButton, Menu, MenuItem, Paper, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import { FilterRow, AdminGrid, PageHeader } from './parts'
import { LABEL_COLORS, athleteGroups } from '../../data/admin'

const CREATORS = [...new Set(athleteGroups.map(g => g.by))]
const ALL_LABELS = Object.keys(LABEL_COLORS)

export default function AthleteGroups() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [by, setBy] = useState('')
  const [label, setLabel] = useState('')
  const [rowEl, setRowEl] = useState(null)

  const rows = useMemo(() => athleteGroups
    .filter(g => g.name.toLowerCase().includes(query.toLowerCase()))
    .filter(g => !by || g.by === by), [query, by])

  const columns = [
    { field: 'name', headerName: 'Athlete groups', flex: 1.2, minWidth: 240 },
    { field: 'by', headerName: 'Created by', flex: 1, minWidth: 180 },
    { field: 'on', headerName: 'Created on', flex: 1, minWidth: 150 },
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
    <AppShell title="Athlete Groups">
      <PageHeader title="Athlete Groups"
        actions={<Button onClick={() => navigate('/administration/groups/new')}>Create athlete group</Button>} />

      <Box sx={{ p: 3 }}>
        <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 2.5, width: '100%' }}>
          <FilterRow>
            <TextField label="Search" value={query} onChange={e => setQuery(e.target.value)} sx={{ width: 220 }}
              InputProps={{ endAdornment: <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} /> }} />
            <TextField select label="Created by" value={by} onChange={e => setBy(e.target.value)} sx={{ width: 260 }}>
              <MenuItem value="">All</MenuItem>
              {CREATORS.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
            <TextField label="Start" type="date" InputLabelProps={{ shrink: true }} sx={{ width: 170 }} />
            <Typography sx={{ alignSelf: 'center', color: 'text.secondary' }}>–</Typography>
            <TextField label="End" type="date" InputLabelProps={{ shrink: true }} sx={{ width: 170 }} />
            <TextField select label="Labels" value={label} onChange={e => setLabel(e.target.value)} sx={{ width: 220 }}>
              <MenuItem value="">All</MenuItem>
              {ALL_LABELS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
            </TextField>
          </FilterRow>

          <AdminGrid rows={rows} columns={columns} rowHeight={52}
            pageSizeOptions={[10, 25]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            />
        </Paper>
      </Box>

      <Menu anchorEl={rowEl} open={!!rowEl} onClose={() => setRowEl(null)}>
        <MenuItem sx={{ minWidth: 140 }} onClick={() => setRowEl(null)}>Edit</MenuItem>
        <MenuItem onClick={() => setRowEl(null)}>Duplicate</MenuItem>
        <MenuItem sx={{ color: colors.red_100 }} onClick={() => setRowEl(null)}>Delete</MenuItem>
      </Menu>
    </AppShell>
  )
}
