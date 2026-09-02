import { useMemo, useState } from 'react'
import { Avatar, Box, Button, IconButton, Paper, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import colors from '../../theme/tokens'
import { AdminGrid, StateChip } from '../admin/parts'
import { SearchInput, SelectField } from '../../components/form'
import AthleteCell from '../../components/AthleteCell'
import { FIXTURE_RATINGS, gameSquad, gameStaff } from '../../data/game'

/**
 * The game's athlete and staff selection are NOT the session's.
 *
 * The session tracks participation per drill: it carries four filters, an
 * editable participation column, a group-calcs switch and a column per drill.
 * The game carries none of that. It is a search, one button, and a short table,
 * because a game's per-period detail lives on the Game events tab instead.
 * Sharing the session's version here would drag in columns the surface does not
 * have.
 */

/** Both tabs are the same shape: search left, one action right, table or empty state. */
function SelectionTab({ search, setSearch, action, onAction, rows, columns, empty, rowHeight = 64 }) {
  return (
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: rows.length ? 2 : 0 }}>
        <SearchInput label="Search" value={search} onChange={e => setSearch(e.target.value)} sx={{ width: 240 }} />
        <Box sx={{ flex: 1 }} />
        <Button onClick={onAction}>{action}</Button>
      </Box>

      {rows.length
        ? <AdminGrid rows={rows} columns={columns} rowHeight={rowHeight} hideFooter />
        : (
          <Typography variant="body2"
            sx={{ py: 10, textAlign: 'center', color: 'text.secondary', fontWeight: 700 }}>
            {empty}
          </Typography>
        )}
    </Paper>
  )
}

export function GameAthleteSelection({ onAddPlayers }) {
  const [search, setSearch] = useState('')
  const [rows, setRows] = useState(gameSquad.slice(0, 3).map(p => ({ ...p, rating: '' })))

  const shown = useMemo(
    () => rows.filter(r => r.name.toLowerCase().includes(search.toLowerCase())),
    [rows, search],
  )

  const columns = [
    { field: 'name', headerName: 'Player', flex: 1.2, minWidth: 220, sortable: false,
      renderCell: p => <AthleteCell athlete={p.row} size={32} /> },
    { field: 'availability', headerName: 'Status', width: 160, sortable: false,
      renderCell: p => <StateChip value={p.row.availability} soft /> },
    { field: 'team', headerName: 'Team', flex: 1, minWidth: 200, sortable: false,
      valueGetter: () => 'U16 (Test Kitman FC)' },
    { field: 'rating', headerName: 'Individual Fixture Rating', width: 230, sortable: false,
      renderCell: p => (
        <SelectField
          options={FIXTURE_RATINGS} value={p.row.rating} sx={{ width: '100%' }}
          onChange={e => setRows(rs => rs.map(r => (r.id === p.row.id ? { ...r, rating: e.target.value } : r)))}
        />
      ) },
    { field: 'actions', headerName: '', width: 60, sortable: false, align: 'center',
      renderCell: p => (
        <IconButton size="small" aria-label={`Remove ${p.row.name}`}
          onClick={() => setRows(rs => rs.filter(r => r.id !== p.row.id))}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      ) },
  ]

  return (
    <SelectionTab
      search={search} setSearch={setSearch}
      action="Add Players" onAction={onAddPlayers}
      rows={shown} columns={columns} empty="No players selected"
    />
  )
}

export function GameStaffSelection({ onAddRemove }) {
  const [search, setSearch] = useState('')
  const [rows, setRows] = useState(gameStaff)

  const shown = useMemo(
    () => rows.filter(r => r.name.toLowerCase().includes(search.toLowerCase())),
    [rows, search],
  )

  const columns = [
    { field: 'name', headerName: 'Staff', flex: 1, minWidth: 240, sortable: false,
      renderCell: p => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 28, height: 28, bgcolor: colors.neutral_300, color: colors.grey_150, fontSize: 11 }}>
            {p.row.name.split(' ').map(w => w[0]).join('')}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.row.name}</Typography>
        </Box>
      ) },
    { field: 'role', headerName: 'Role', flex: 1, minWidth: 200, sortable: false },
    { field: 'actions', headerName: '', width: 60, sortable: false, align: 'center',
      renderCell: p => (
        <IconButton size="small" aria-label={`Remove ${p.row.name}`}
          onClick={() => setRows(rs => rs.filter(r => r.id !== p.row.id))}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      ) },
  ]

  return (
    <SelectionTab
      search={search} setSearch={setSearch}
      action="Add/remove staff" onAction={onAddRemove}
      rows={shown} columns={columns} empty="No staff added" rowHeight={56}
    />
  )
}
