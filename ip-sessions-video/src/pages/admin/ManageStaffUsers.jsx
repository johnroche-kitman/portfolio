import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Avatar, Box, Button, Divider, IconButton, Menu, MenuItem, Paper, Tab, Tabs, TextField, Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import { ChipList, FilterRow, AdminGrid, PageHeader } from './parts'
import { STAFF_ROLES, staffUsers } from '../../data/admin'
import { squads } from '../../data/athletes'

export default function ManageStaffUsers() {
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('')
  const [squad, setSquad] = useState('')
  const [rowEl, setRowEl] = useState(null)
  const [rowId, setRowId] = useState(null)

  const rows = useMemo(() => staffUsers
    .filter(u => u.active === (tab === 0))
    .filter(u => u.name.toLowerCase().includes(query.toLowerCase()))
    .filter(u => !role || u.role === role)
    .filter(u => !squad || u.squads.some(s => s.startsWith(squad))), [tab, query, role, squad])

  const columns = [
    {
      field: 'name', headerName: 'Staff name', flex: 1, minWidth: 200,
      renderCell: p => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 26, height: 26, bgcolor: colors.neutral_300, color: colors.grey_150, fontSize: 10 }}>
            {p.row.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.row.name}</Typography>
        </Box>
      ),
    },
    { field: 'username', headerName: 'Username', flex: 0.7, minWidth: 130 },
    { field: 'role', headerName: 'Role', flex: 0.7, minWidth: 130 },
    { field: 'email', headerName: 'Email', flex: 1.1, minWidth: 200 },
    { field: 'squads', headerName: 'Squads', flex: 0.9, minWidth: 170, sortable: false,
      renderCell: p => <ChipList values={p.row.squads} /> },
    { field: 'created', headerName: 'Creation Date', flex: 0.8, minWidth: 140 },
    {
      field: 'actions', headerName: '', width: 56, sortable: false, filterable: false, align: 'right',
      renderCell: p => (
        <IconButton size="small" aria-label={`Actions for ${p.row.name}`}
          onClick={e => { e.stopPropagation(); setRowId(p.row.id); setRowEl(e.currentTarget) }}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ]

  return (
    <AppShell title="Manage Staff Users">
      <PageHeader
        title="Manage Staff Users"
        actions={
          <>
            <Button onClick={() => navigate('/users/new')}>Create New User</Button>
            <Button variant="outlined">Upload Users</Button>
            <Button variant="outlined">Download csv</Button>
          </>
        }
      >
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mt: 1 }}>
          <Tab label="Active" /><Tab label="Inactive" />
        </Tabs>
      </PageHeader>
      <Divider />

      <Box sx={{ p: 3 }}>
        <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 2.5, width: '100%' }}>
          <FilterRow>
            <TextField label="Search" value={query} onChange={e => setQuery(e.target.value)} sx={{ width: 220 }}
              InputProps={{ endAdornment: <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} /> }} />
            <TextField select label="Role" value={role} onChange={e => setRole(e.target.value)} sx={{ width: 260 }}>
              <MenuItem value="">All</MenuItem>
              {STAFF_ROLES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </TextField>
            <TextField select label="Squad" value={squad} onChange={e => setSquad(e.target.value)} sx={{ width: 260 }}>
              <MenuItem value="">All</MenuItem>
              {squads.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          </FilterRow>

          <AdminGrid rows={rows} columns={columns} rowHeight={52}
            pageSizeOptions={[10, 25]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            />
        </Paper>
      </Box>

      <Menu anchorEl={rowEl} open={!!rowEl} onClose={() => setRowEl(null)}>
        <MenuItem sx={{ minWidth: 140 }} onClick={() => { setRowEl(null); navigate(`/users/${rowId}/edit`) }}>Edit</MenuItem>
      </Menu>
    </AppShell>
  )
}
