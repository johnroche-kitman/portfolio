import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Button, Chip, Divider, IconButton, Menu, MenuItem, Paper, Tab, Tabs,
  Tooltip, Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import DownloadIcon from '@mui/icons-material/FileDownloadOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import AthleteCell from '../../components/AthleteCell'
import AvailabilityLabel from '../../components/AvailabilityLabel'
import FilterBar from '../../components/FilterBar'
import AddPanel from '../../components/AddPanel'
import { athletes, MEDICAL_TABS, MEDICAL_ADD_ITEMS, positions, squads } from '../../data/athletes'

const ANY = 'Any'

export default function MedicalRosters() {
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')
  const [squadFilter, setSquadFilter] = useState(squads[0])
  const [positionFilter, setPositionFilter] = useState(ANY)
  const [availability, setAvailability] = useState(ANY)
  const [addAnchor, setAddAnchor] = useState(null)
  const [panel, setPanel] = useState(null)
  const [rowMenu, setRowMenu] = useState(null)

  const rows = useMemo(
    () =>
      athletes.filter(a => {
        if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false
        if (positionFilter !== ANY && a.position !== positionFilter) return false
        if (availability !== ANY && a.availability !== availability) return false
        return true
      }),
    [search, positionFilter, availability]
  )

  const columns = [
    {
      field: 'name', headerName: 'Athlete', flex: 1.1, minWidth: 210, sortable: true,
      renderCell: ({ row }) => (
        <AthleteCell athlete={row} onClick={() => navigate(`/medical/athletes/${row.id}`)} />
      ),
    },
    {
      field: 'availability', headerName: 'Availability status', flex: 0.8, minWidth: 170, sortable: true,
      renderCell: ({ row }) => <AvailabilityLabel status={row.availability} days={row.days} />,
    },
    {
      field: 'issues', headerName: 'Open injury / illness', flex: 1.5, minWidth: 280, sortable: false,
      renderCell: ({ row }) =>
        row.issues.length ? (
          <Box sx={{ py: 1, display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
            {row.issues.map((i, n) => (
              <Box key={n} sx={{ borderLeft: `3px solid ${colors.red_100}`, pl: 1.25 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.35 }}>
                  {i.date}{i.label ? ` - ${i.label}` : ' -'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{i.status}</Typography>
                  {i.flag && <Chip label={i.flag} size="small" sx={{ height: 18, fontSize: 11 }} />}
                </Box>
              </Box>
            ))}
          </Box>
        ) : null,
    },
    {
      field: 'latestNote', headerName: 'Latest note', flex: 1.3, minWidth: 240, sortable: false,
      renderCell: ({ row }) =>
        row.latestNote ? (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.35 }}>
              {row.latestNote.date} - {row.latestNote.title}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{row.latestNote.body}</Typography>
          </Box>
        ) : null,
    },
    {
      field: 'actions', headerName: '', width: 56, sortable: false, filterable: false, align: 'right',
      renderCell: ({ row }) => (
        <IconButton size="small" aria-label={`Actions for ${row.name}`}
          onClick={e => setRowMenu({ el: e.currentTarget, row })}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ]

  return (
    <AppShell title="Medical">
      <Box sx={{ px: 3, pt: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Medical</Typography>
          <Tooltip title="Squad medical overview">
            <InfoIcon sx={{ fontSize: 18, color: colors.blue_100 }} />
          </Tooltip>
        </Box>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto"
          sx={{ mt: 1, borderBottom: `1px solid ${colors.neutral_300}` }}>
          {MEDICAL_TABS.map(t => <Tab key={t} label={t} />)}
        </Tabs>
      </Box>

      <Box sx={{ px: 3, pb: 4 }}>
        {tab === 0 ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Team</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, pt: 2 }}>
                <Button endIcon={<ArrowDropDownIcon />} startIcon={<AddIcon />}
                  onClick={e => setAddAnchor(e.currentTarget)}>Add</Button>
                <Button variant="outlined" startIcon={<DownloadIcon />}>Download</Button>
              </Box>
            </Box>

            <FilterBar
              search={search} onSearch={setSearch}
              filters={[
                { label: 'Squad', value: squadFilter, onChange: setSquadFilter, options: squads, width: 220 },
                { label: 'Position', value: positionFilter, onChange: setPositionFilter, options: [ANY, ...positions] },
                { label: 'Availability', value: availability, onChange: setAvailability,
                  options: [ANY, 'Available', 'Unavailable', 'Injured/Ill'] },
              ]}
            />

            <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, width: '100%' }}>
              <DataGrid
                autoHeight
                rows={rows} columns={columns} getRowId={r => r.id}
                getRowHeight={() => 'auto'} disableRowSelectionOnClick
                initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
                pageSizeOptions={[25, 50, 100]}
                sx={{
                  border: 0,
                  '& .MuiDataGrid-cell': { alignItems: 'flex-start', py: 1 },
                  '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
                }}
              />
            </Paper>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
              {rows.length} of {athletes.length} athletes
            </Typography>
          </>
        ) : (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {MEDICAL_TABS[tab]} — not yet built in this prototype.
            </Typography>
          </Box>
        )}
      </Box>

      <Menu anchorEl={addAnchor} open={!!addAnchor} onClose={() => setAddAnchor(null)}>
        {MEDICAL_ADD_ITEMS.map(item => (
          <MenuItem key={item} onClick={() => { setAddAnchor(null); setPanel(item) }} sx={{ minWidth: 230 }}>
            {item}
          </MenuItem>
        ))}
      </Menu>

      <Menu anchorEl={rowMenu?.el} open={!!rowMenu} onClose={() => setRowMenu(null)}>
        <MenuItem onClick={() => { navigate(`/medical/athletes/${rowMenu.row.id}`); setRowMenu(null) }}>
          Open medical profile
        </MenuItem>
        <MenuItem onClick={() => { setPanel('Note'); setRowMenu(null) }}>Add note</MenuItem>
        <MenuItem onClick={() => { setPanel('Treatment'); setRowMenu(null) }}>Add treatment</MenuItem>
        <Divider />
        <MenuItem onClick={() => setRowMenu(null)}>Download record</MenuItem>
      </Menu>

      <AddPanel type={panel} open={!!panel} onClose={() => setPanel(null)} athletes={athletes} />
    </AppShell>
  )
}
