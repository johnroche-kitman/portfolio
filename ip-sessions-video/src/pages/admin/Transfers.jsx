import { useMemo, useState } from 'react'
import { Box, Link, MenuItem, Paper, TextField, Typography } from '@mui/material'
import LinkIcon from '@mui/icons-material/LinkOutlined'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import { FilterRow, GRID_SX, AdminGrid, PageHeader, StatusChip } from './parts'
import { IMPORT_STATUSES, IMPORT_TYPES, exports_, imports } from '../../data/admin'

const DownloadLink = () => (
  <Link href="#" underline="hover" onClick={e => e.preventDefault()}
    sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontSize: 14 }}>
    <LinkIcon fontSize="small" /> Link
  </Link>
)

export function Imports() {
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [creator, setCreator] = useState('')
  const creators = useMemo(() => [...new Set(imports.map(i => i.by))], [])

  const rows = imports
    .filter(i => !type || i.type === type)
    .filter(i => !status || i.status === status)
    .filter(i => !creator || i.by === creator)

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1.3, minWidth: 220 },
    { field: 'type', headerName: 'Import Type', flex: 0.9, minWidth: 160 },
    { field: 'at', headerName: 'Created Date & Time', flex: 0.9, minWidth: 180 },
    { field: 'download', headerName: 'Download link', width: 140, sortable: false, renderCell: () => <DownloadLink /> },
    { field: 'status', headerName: 'Status', width: 130, renderCell: p => <StatusChip value={p.row.status} /> },
    { field: 'by', headerName: 'Creator', flex: 0.9, minWidth: 170 },
    {
      field: 'errors', headerName: 'Errors', flex: 1.4, minWidth: 240, sortable: false,
      renderCell: p => (
        <Box sx={{ py: 0.75 }}>
          {p.row.errors.length
            ? p.row.errors.map((e, i) => (
              <Typography key={i} variant="caption" sx={{ display: 'block', color: colors.red_200, lineHeight: 1.5 }}>
                {e}
              </Typography>
            ))
            : <Typography variant="body2" sx={{ color: 'text.secondary' }}>--</Typography>}
        </Box>
      ),
    },
  ]

  return (
    <AppShell title="Imports">
      <PageHeader title="Your Imports" />
      <Box sx={{ p: 3 }}>
        <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 2.5, width: '100%' }}>
          <FilterRow>
            <TextField select label="Import Type" value={type} onChange={e => setType(e.target.value)} sx={{ width: 200 }}>
              <MenuItem value="">All</MenuItem>
              {IMPORT_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
            <TextField select label="Status" value={status} onChange={e => setStatus(e.target.value)} sx={{ width: 190 }}>
              <MenuItem value="">All</MenuItem>
              {IMPORT_STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
            <TextField select label="Creator" value={creator} onChange={e => setCreator(e.target.value)} sx={{ width: 190 }}>
              <MenuItem value="">All</MenuItem>
              {creators.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
            <Link component="button" underline="hover" sx={{ fontSize: 14, alignSelf: 'center' }}
              onClick={() => { setType(''); setStatus(''); setCreator('') }}>
              Clear filters
            </Link>
          </FilterRow>

          <AdminGrid rows={rows} columns={columns} getRowHeight={() => 'auto'}
            pageSizeOptions={[10, 25]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            sx={{ ...GRID_SX, '& .MuiDataGrid-cell': { ...GRID_SX['& .MuiDataGrid-cell'], py: 1 } }} />
        </Paper>
      </Box>
    </AppShell>
  )
}

export function Exports() {
  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 200 },
    { field: 'type', headerName: 'Export Type', flex: 1, minWidth: 180 },
    { field: 'at', headerName: 'Created Date & Time', flex: 1, minWidth: 200 },
    { field: 'download', headerName: 'Download link', width: 160, sortable: false, renderCell: () => <DownloadLink /> },
    { field: 'status', headerName: 'Status', width: 140, renderCell: p => <StatusChip value={p.row.status} /> },
  ]
  return (
    <AppShell title="Exports">
      <PageHeader title="Your Exports" />
      <Box sx={{ p: 3 }}>
        <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, width: '100%' }}>
          <AdminGrid rows={exports_} columns={columns} rowHeight={52}
            pageSizeOptions={[25, 50]} initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
            />
        </Paper>
      </Box>
    </AppShell>
  )
}
