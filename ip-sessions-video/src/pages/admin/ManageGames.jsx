import { useMemo, useState } from 'react'
import { Alert, Box, Button, Link, MenuItem, Paper, TextField, Typography } from '@mui/material'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import { FilterRow, AdminGrid, PageHeader } from './parts'
import { fixtures } from '../../data/admin'
import { COMPETITIONS } from '../../data/events'

export default function ManageGames() {
  const [banner, setBanner] = useState(true)
  const [opponent, setOpponent] = useState('')
  const [competition, setCompetition] = useState('')
  const [applied, setApplied] = useState({ opponent: '', competition: '' })

  const opponents = useMemo(() => [...new Set(fixtures.map(f => f.opponent).filter(Boolean))], [])

  const rows = fixtures
    .filter(f => !applied.opponent || f.opponent === applied.opponent)
    .filter(f => !applied.competition || f.competition === applied.competition)

  const columns = [
    {
      field: 'id', headerName: 'Turnaround', flex: 1, minWidth: 200,
      renderCell: p => (
        <Typography variant="body2">
          {p.row.name && <Box component="span" sx={{ fontWeight: 700, mr: 0.75 }}>{p.row.name}</Box>}
          {p.row.id}
        </Typography>
      ),
    },
    { field: 'date', headerName: 'Date', flex: 0.7, minWidth: 130 },
    { field: 'opponent', headerName: 'Opponent', flex: 0.9, minWidth: 160 },
    { field: 'competition', headerName: 'Competition', flex: 1.2, minWidth: 230 },
    { field: 'venue', headerName: 'Venue', flex: 0.6, minWidth: 110 },
    {
      field: 'actions', headerName: '', width: 140, sortable: false, align: 'right', headerAlign: 'right',
      renderCell: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Link component="button" underline="hover" sx={{ fontSize: 14 }}>Edit</Link>
          <Typography variant="body2" sx={{ color: colors.neutral_400 }}>|</Typography>
          <Link component="button" underline="hover" sx={{ fontSize: 14, color: colors.red_200 }}>Delete</Link>
        </Box>
      ),
    },
  ]

  return (
    <AppShell title="Manage Games">
      {banner && (
        <Alert severity="error" onClose={() => setBanner(false)} sx={{ borderRadius: 0 }}>
          <Box component="strong">Error!</Box> The current season is not set up correctly for this squad.
          Please contact support
        </Alert>
      )}

      <PageHeader title="Manage Games" />

      <Box sx={{ p: 3 }}>
        <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 2.5, width: '100%' }}>
          <FilterRow>
            <TextField select label="Filter by opponents" value={opponent} onChange={e => setOpponent(e.target.value)}
              sx={{ width: 280 }}>
              <MenuItem value="">All Opponents</MenuItem>
              {opponents.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </TextField>
            <TextField select label="Filter by competitions" value={competition}
              onChange={e => setCompetition(e.target.value)} sx={{ width: 280 }}>
              <MenuItem value="">All Competitions</MenuItem>
              {COMPETITIONS.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
            {/* The live Apply is a one-off bright blue; it becomes the page's single primary. */}
            <Button sx={{ alignSelf: 'center' }} onClick={() => setApplied({ opponent, competition })}>Apply</Button>
          </FilterRow>

          <AdminGrid rows={rows} columns={columns} rowHeight={52}
            getRowId={r => r.id} pageSizeOptions={[10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} />
        </Paper>
      </Box>
    </AppShell>
  )
}
