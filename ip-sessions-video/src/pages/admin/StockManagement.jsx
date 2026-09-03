import { useState } from 'react'
import {
  Box, Button, Checkbox, Divider, Drawer, FormControlLabel, IconButton, Menu, MenuItem, Paper,
  TextField, Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CloseIcon from '@mui/icons-material/Close'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import { FilterRow, AdminGrid, PageHeader } from './parts'
import { stock } from '../../data/admin'

export default function StockManagement() {
  const [query, setQuery] = useState('')
  const [inStock, setInStock] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [rowEl, setRowEl] = useState(null)

  const rows = stock
    .filter(s => s.name.toLowerCase().includes(query.toLowerCase()))
    .filter(s => !inStock || s.onHand > 0)

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1.4, minWidth: 220 },
    { field: 'strength', headerName: 'Strength', flex: 0.7, minWidth: 120 },
    { field: 'type', headerName: 'Type', flex: 0.7, minWidth: 120 },
    { field: 'lot', headerName: 'Lot no.', flex: 0.7, minWidth: 120 },
    { field: 'exp', headerName: 'Exp. date', flex: 0.9, minWidth: 140 },
    { field: 'dispensed', headerName: 'Dispensed', flex: 0.7, minWidth: 120 },
    { field: 'onHand', headerName: 'On hand', flex: 0.7, minWidth: 110 },
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
    <AppShell title="Stock Management">
      <PageHeader
        title="Stock Management"
        actions={<><Button onClick={() => setDrawer(true)}>Add Stock</Button><Button variant="outlined">Print</Button></>}
      />

      <Box sx={{ p: 3 }}>
        <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 2.5, width: '100%' }}>
          <FilterRow>
            <TextField label="Search" value={query} onChange={e => setQuery(e.target.value)} sx={{ width: 220 }}
              InputProps={{ endAdornment: <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} /> }} />
            <TextField label="Expiration Date" type="date" InputLabelProps={{ shrink: true }} sx={{ width: 190 }} />
            <FormControlLabel sx={{ alignSelf: 'center', ml: 0.5 }} label="In stock only"
              control={<Checkbox checked={inStock} onChange={e => setInStock(e.target.checked)} />} />
          </FilterRow>

          <AdminGrid rows={rows} columns={columns} rowHeight={52}
            pageSizeOptions={[10, 25]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            />
        </Paper>
      </Box>

      <Menu anchorEl={rowEl} open={!!rowEl} onClose={() => setRowEl(null)}>
        <MenuItem sx={{ minWidth: 160 }} onClick={() => setRowEl(null)}>Edit</MenuItem>
        <MenuItem onClick={() => setRowEl(null)}>Dispense</MenuItem>
        <MenuItem sx={{ color: colors.red_100 }} onClick={() => setRowEl(null)}>Delete</MenuItem>
      </Menu>

      <Drawer anchor="right" open={drawer} onClose={() => setDrawer(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 630 }, display: 'flex' } }}>
        <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Add Stock</Typography>
          <IconButton size="small" onClick={() => setDrawer(false)} aria-label="Close"><CloseIcon fontSize="small" /></IconButton>
        </Box>
        <Divider />
        <Box sx={{ p: 3, flex: 1 }}>
          <TextField fullWidth label="Brand name / drug"
            InputProps={{ endAdornment: <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} /> }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mt: 2.5 }}>
            <TextField label="Lot number" />
            <TextField label="Exp. date" type="date" InputLabelProps={{ shrink: true }} />
            <TextField label="Quantity" type="number" />
          </Box>
        </Box>
        <Divider />
        <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => setDrawer(false)}>Save</Button>
        </Box>
      </Drawer>
    </AppShell>
  )
}
