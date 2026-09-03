import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Chip, Divider, Typography } from '@mui/material'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import AthleteCell from '../../components/AthleteCell'
import { SearchInput, SelectField } from '../../components/form'
import { AdminGrid, FilterRow, PageHeader } from './parts'
import { athletes, squads } from '../../data/athletes'
import { goalsForAthlete } from '../../data/goals'

const ALL = 'All squads'

/** Status counts, in the order a coach reads them: what is wrong first. */
const STATUS_TONE = {
  'Needs work': colors.orange_200,
  'On track': colors.neutral_300,
  Achieved: colors.green_200,
}

const StatusCounts = ({ goals }) => {
  const counts = ['Needs work', 'On track', 'Achieved']
    .map(s => [s, goals.filter(g => g.status === s).length])
    .filter(([, n]) => n)
  if (!counts.length) return <Typography variant="body2" sx={{ color: 'text.secondary' }}>—</Typography>
  return (
    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
      {counts.map(([s, n]) => (
        <Chip key={s} size="small" label={`${n} ${s.toLowerCase()}`}
          sx={{ height: 22, fontSize: 11, fontWeight: 600, bgcolor: STATUS_TONE[s],
            color: s === 'On track' ? colors.grey_200 : colors.white }} />
      ))}
    </Box>
  )
}

export default function IdpList() {
  const navigate = useNavigate()
  const [squad, setSquad] = useState(squads[0])
  const [q, setQ] = useState('')

  // Every athlete carries their plan with them, so the table never has to go
  // back for a second lookup while sorting or filtering.
  const rows = useMemo(() => athletes.map(a => {
    const goals = goalsForAthlete(a.id)
    // Notes are newest-first within a goal but not across them, so the most
    // recent review has to be found rather than read off the first goal.
    const dates = goals.flatMap(g => g.notes).map(n => n.date)
    const latest = dates.sort((a, b) => new Date(b) - new Date(a))[0]
    return {
      ...a,
      goals,
      goalCount: goals.length,
      clipCount: goals.reduce((n, g) => n + g.clips.length, 0),
      lastNote: latest || null,
    }
  }), [])

  const shown = rows
    .filter(r => squad === ALL || r.squad === squad)
    .filter(r => !q || r.name.toLowerCase().includes(q.toLowerCase()))

  const columns = [
    {
      field: 'name', headerName: 'Athlete', flex: 1.4, minWidth: 220,
      renderCell: p => <AthleteCell athlete={p.row} />,
    },
    { field: 'squad', headerName: 'Squad', flex: 1.1, minWidth: 170 },
    {
      field: 'goalCount', headerName: 'Development goals', width: 155,
      renderCell: p => (
        <Typography variant="body2">
          {p.value ? `${p.value} set` : 'No plan set'}
        </Typography>
      ),
    },
    {
      field: 'progress', headerName: 'Progress', flex: 1.4, minWidth: 250, sortable: false,
      renderCell: p => <StatusCounts goals={p.row.goals} />,
    },
    {
      field: 'clipCount', headerName: 'Clips tagged', width: 120,
      renderCell: p => (
        <Typography variant="body2" sx={{ color: p.value ? 'text.primary' : 'text.secondary' }}>
          {p.value || '—'}
        </Typography>
      ),
    },
    {
      field: 'lastNote', headerName: 'Last reviewed', width: 140,
      renderCell: p => (
        <Typography variant="body2" sx={{ color: p.value ? 'text.primary' : 'text.secondary' }}>
          {p.value || 'Not yet'}
        </Typography>
      ),
    },
  ]

  return (
    <AppShell title="Athletes">
      <PageHeader title="Individual Development Plans" />
      <Box sx={{ px: 3, pt: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Every athlete’s season plan in one place. Open an athlete to see their development goals,
          the clips tagged against each one, and the coach’s running review.
        </Typography>

        <FilterRow>
          <SelectField label="Squad" value={squad} onChange={e => setSquad(e.target.value)}
            options={[ALL, ...squads.slice(0, 3)]} sx={{ width: 230 }} />
          <SearchInput label="Search athletes" value={q} onChange={e => setQ(e.target.value)}
            sx={{ width: 230 }} />
        </FilterRow>

        <Divider sx={{ mb: 1 }} />

        <AdminGrid
          rows={shown} columns={columns} rowHeight={56} hideFooter
          onRowClick={p => navigate(`/individual_development_plans/${p.id}`)}
          sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
          localeText={{ noRowsLabel: 'No athletes in this squad' }}
        />

        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1.5, pb: 4 }}>
          {shown.length} athlete{shown.length === 1 ? '' : 's'}
          {squad === ALL ? ' across every squad' : ` in ${squad}`}
        </Typography>
      </Box>
    </AppShell>
  )
}
