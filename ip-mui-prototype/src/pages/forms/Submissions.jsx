import { useState } from 'react'
import {
  Box, Button, Checkbox, Chip, Drawer, IconButton, InputAdornment, Divider, Step, StepLabel, Stepper,
  TextField, Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import DownloadIcon from '@mui/icons-material/FileDownloadOutlined'
import SearchIcon from '@mui/icons-material/Search'
import TuneIcon from '@mui/icons-material/TuneOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import { AdminGrid, PageHeader } from '../admin/parts'
import { templateVariables } from '../../data/forms'

/**
 * League benchmarking and the Data importer are the same page. The only
 * difference is that League benchmarking carries a Source column, so this takes
 * the rows, the title and a flag rather than existing twice.
 */

function TemplateDrawer({ open, onClose }) {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState([])
  const [q, setQ] = useState('')

  const toggle = code =>
    setSelected(s => (s.includes(code) ? s.filter(c => c !== code) : [...s, code]))

  return (
    <Drawer anchor="right" open={open} onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 460 }, display: 'flex' } }}>
      <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Create CSV template</Typography>
        <IconButton size="small" onClick={onClose} aria-label="Close"><CloseIcon fontSize="small" /></IconButton>
      </Box>

      <Box sx={{ px: 3, pb: 2 }}>
        <Stepper activeStep={step}>
          <Step><StepLabel>Select variables</StepLabel></Step>
          <Step><StepLabel>Select athletes</StepLabel></Step>
        </Stepper>
      </Box>
      <Divider />

      <Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1.5 }}>
          <TextField
            fullWidth placeholder="Search" value={q} onChange={e => setQ(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          />
          <IconButton aria-label="Filter variables"><TuneIcon /></IconButton>
        </Box>
        <Chip size="small" label={`Selected (${selected.length})`} sx={{ mb: 1.5 }} />

        {Object.entries(templateVariables).map(([group, rows]) => {
          const shown = rows.filter(([label]) => label.toLowerCase().includes(q.toLowerCase()))
          if (!shown.length) return null
          const allOn = shown.every(([, , code]) => selected.includes(code))
          return (
            <Box key={group} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="subtitle2">{group}</Typography>
                <Button variant="text" size="small"
                  onClick={() => setSelected(s => (allOn
                    ? s.filter(c => !shown.some(([, , code]) => code === c))
                    : [...new Set([...s, ...shown.map(([, , code]) => code)])]))}>
                  {allOn ? 'Clear all' : 'Select all'}
                </Button>
              </Box>
              {shown.map(([label, scale, code]) => (
                <Box key={code} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', py: 0.75 }}>
                  <Checkbox size="small" sx={{ p: 0, mt: 0.25 }}
                    checked={selected.includes(code)} onChange={() => toggle(code)}
                    inputProps={{ 'aria-label': label }} />
                  <Box>
                    <Typography variant="body2">{label}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>{scale}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{code}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )
        })}
      </Box>

      <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${colors.neutral_300}`,
        display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
        {step === 1 && <Button variant="outlined" onClick={() => setStep(0)}>Back</Button>}
        <Button disabled={!selected.length} onClick={() => (step === 0 ? setStep(1) : onClose())}>
          {step === 0 ? 'Next' : 'Create'}
        </Button>
      </Box>
    </Drawer>
  )
}

const StatusChip = ({ value }) => {
  const ok = value === 'Completed'
  return (
    <Chip
      size="small" label={value}
      icon={ok ? <CheckCircleIcon /> : <ErrorIcon />}
      sx={{ bgcolor: ok ? colors.green_200 : colors.red_200, color: colors.white, fontWeight: 600,
        '& .MuiChip-icon': { color: colors.white } }}
    />
  )
}

export default function Submissions({ title, rows, showSource = false }) {
  const [drawer, setDrawer] = useState(false)
  const [data, setData] = useState(rows)

  const columns = [
    { field: 'date', headerName: 'Submission date', flex: 1, minWidth: 190 },
    ...(showSource ? [{ field: 'source', headerName: 'Source', width: 120 }] : []),
    { field: 'by', headerName: 'Submitted by', flex: 1, minWidth: 180 },
    { field: 'status', headerName: 'Submission status', width: 190, sortable: false,
      renderCell: p => <StatusChip value={p.row.status} /> },
    { field: 'file', headerName: 'Submitted file', width: 150, sortable: false, align: 'center',
      renderCell: p => (
        <IconButton size="small" aria-label={`Download submitted file from ${p.row.date}`}>
          <DownloadIcon fontSize="small" />
        </IconButton>
      ) },
    { field: 'errors', headerName: 'Errors file', width: 130, sortable: false, align: 'center',
      renderCell: p => (p.row.hasErrors
        ? <IconButton size="small" aria-label={`Download errors file from ${p.row.date}`}>
            <DownloadIcon fontSize="small" />
          </IconButton>
        : <Typography variant="body2" sx={{ color: 'text.secondary' }}>-</Typography>) },
    { field: 'actions', headerName: '', width: 60, sortable: false, align: 'center',
      renderCell: p => (p.row.status === 'Completed'
        ? <IconButton size="small" aria-label={`Delete submission from ${p.row.date}`}
            onClick={() => setData(d => d.filter(r => r.id !== p.row.id))}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        : null) },
  ]

  return (
    <AppShell title={title}>
      <PageHeader
        title={title}
        actions={<>
          <Button variant="outlined" onClick={() => setDrawer(true)}>Create CSV template</Button>
          <Button>Import a CSV file</Button>
        </>}
      />
      <Box sx={{ px: 3, pt: 2, pb: 6 }}>
        <AdminGrid rows={data} columns={columns} rowHeight={56}
          pageSizeOptions={[25, 50]} initialState={{ pagination: { paginationModel: { pageSize: 25 } } }} />
      </Box>
      <TemplateDrawer open={drawer} onClose={() => setDrawer(false)} />
    </AppShell>
  )
}
