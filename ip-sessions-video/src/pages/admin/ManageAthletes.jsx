import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Avatar, Box, Button, Divider, IconButton, Link, Menu, MenuItem, Paper, Tab, Tabs, TextField, Typography,
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import SearchIcon from '@mui/icons-material/Search'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import FileDownloadIcon from '@mui/icons-material/FileDownloadOutlined'
import colors from '../../theme/tokens'
import { initialsOf, photoUrl } from '../../data/athletes'
import AppShell from '../../components/AppShell'
import { ChipList, FilterRow, AdminGrid, PageHeader } from './parts'
import { LABEL_COLORS, ROSTER_POSITIONS, adminAthletes } from '../../data/admin'

const ALL_LABELS = Object.keys(LABEL_COLORS)

export default function ManageAthletes() {
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)
  const [query, setQuery] = useState('')
  const [position, setPosition] = useState('')
  const [label, setLabel] = useState('')
  const [downloadEl, setDownloadEl] = useState(null)
  const [moreEl, setMoreEl] = useState(null)

  const rows = useMemo(() => adminAthletes
    .filter(a => a.active === (tab === 0))
    .filter(a => a.name.toLowerCase().includes(query.toLowerCase()))
    .filter(a => !position || a.position === position)
    .filter(a => !label || a.labels.includes(label)), [tab, query, position, label])

  const columns = [
    {
      field: 'name', headerName: 'Player', flex: 1.2, minWidth: 220,
      renderCell: p => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar src={photoUrl(p.row)} alt=""
            sx={{ width: 30, height: 30, bgcolor: colors.neutral_300, color: colors.grey_150, fontSize: 12 }}>
            {initialsOf(p.row.name)}
          </Avatar>
          <Typography variant="body2">{p.row.name}</Typography>
        </Box>
      ),
    },
    { field: 'username', headerName: 'Username', flex: 0.8, minWidth: 140 },
    { field: 'position', headerName: 'Roster Position', flex: 1, minWidth: 170 },
    { field: 'squads', headerName: 'Squads', flex: 1.2, minWidth: 200, sortable: false,
      renderCell: p => <ChipList values={p.row.squads} /> },
    { field: 'created', headerName: 'Creation Date', flex: 0.8, minWidth: 130 },
    { field: 'labels', headerName: 'Labels', flex: 1, minWidth: 170, sortable: false,
      renderCell: p => <ChipList values={p.row.labels} color={v => LABEL_COLORS[v] || colors.grey_150} /> },
  ]

  return (
    <AppShell title="Manage Athletes">
      <PageHeader
        title="Manage Athletes"
        actions={
          <>
            <Button onClick={() => navigate('/administration/athletes/new')}>New Athlete</Button>
            <Button variant="outlined">Upload Athletes</Button>
            <Button variant="outlined">Download csv</Button>
            <Button variant="outlined" endIcon={<ArrowDropDownIcon />} onClick={e => setDownloadEl(e.currentTarget)}>
              Download
            </Button>
            <IconButton size="small" aria-label="More actions" onClick={e => setMoreEl(e.currentTarget)}>
              <MoreVertIcon />
            </IconButton>
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
            <TextField select label="Position" value={position} onChange={e => setPosition(e.target.value)} sx={{ width: 200 }}>
              <MenuItem value="">All</MenuItem>
              {ROSTER_POSITIONS.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </TextField>
            <TextField select label="Labels" value={label} onChange={e => setLabel(e.target.value)} sx={{ width: 200 }}>
              <MenuItem value="">All</MenuItem>
              {ALL_LABELS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
            </TextField>
            <Link component="button" underline="hover" sx={{ fontSize: 14, alignSelf: 'center' }}
              onClick={() => { setQuery(''); setPosition(''); setLabel('') }}>
              Clear
            </Link>
          </FilterRow>

          <AdminGrid
            checkboxSelection rows={rows} columns={columns}
            rowHeight={56} pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            
          />
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', color: 'text.secondary', mt: 1 }}>
            Total Rows: {rows.length} of {adminAthletes.length}
          </Typography>
        </Paper>
      </Box>

      <Menu anchorEl={downloadEl} open={!!downloadEl} onClose={() => setDownloadEl(null)}>
        <MenuItem onClick={() => setDownloadEl(null)} sx={{ minWidth: 200, gap: 1.5 }}>
          <FileDownloadIcon fontSize="small" /> Athlete Profile
        </MenuItem>
      </Menu>
      <Menu anchorEl={moreEl} open={!!moreEl} onClose={() => setMoreEl(null)}>
        <MenuItem onClick={() => setMoreEl(null)} sx={{ minWidth: 240 }}>Training Session Reminder</MenuItem>
        <MenuItem onClick={() => setMoreEl(null)}>Well-being Reminder</MenuItem>
      </Menu>
    </AppShell>
  )
}
