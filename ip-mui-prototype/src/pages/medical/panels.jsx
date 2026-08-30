import { useState } from 'react'
import {
  Avatar, Box, Button, Chip, IconButton, Menu, MenuItem, Paper, TextField, Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import colors from '../../theme/tokens'
import { AdminGrid, FilterRow } from '../admin/parts'

/**
 * Every list tab in Medical is the same shape at all three levels — team,
 * athlete and injury record: a heading, one primary Add, secondary actions, a
 * filter row, then a table. Building it once is the difference between eleven
 * near-identical pages and one component with eleven configurations.
 */
export function ListPanel({ title, addLabel, addMenu, actions, filters, columns, rows, rowHeight = 56, empty }) {
  const [addEl, setAddEl] = useState(null)

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <Typography variant="h6" sx={{ fontSize: 20, fontWeight: 700 }}>{title}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {addLabel && (addMenu
            ? <>
              <Button endIcon={<ArrowDropDownIcon />} onClick={e => setAddEl(e.currentTarget)}>{addLabel}</Button>
              <Menu anchorEl={addEl} open={!!addEl} onClose={() => setAddEl(null)}>
                {addMenu.map(m => (
                  <MenuItem key={m} sx={{ minWidth: 200 }} onClick={() => setAddEl(null)}>{m}</MenuItem>
                ))}
              </Menu>
            </>
            : <Button>{addLabel}</Button>)}
          {actions}
        </Box>
      </Box>

      {filters && <FilterRow>{filters}</FilterRow>}

      {rows.length
        ? <AdminGrid rows={rows} columns={columns} rowHeight={rowHeight}
            pageSizeOptions={[10, 25]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} />
        : (
          <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, py: 6, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{empty || 'Nothing recorded yet'}</Typography>
          </Paper>
        )}
    </Box>
  )
}

/** Search field, used by every Medical filter row. */
export const SearchField = ({ value, onChange, label = 'Search', width = 220 }) => (
  <TextField label={label} value={value} onChange={e => onChange(e.target.value)} sx={{ width }}
    InputProps={{ endAdornment: <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} /> }} />
)

export const SelectField = ({ label, options, value, onChange, width = 180 }) => (
  <TextField select label={label} value={value} onChange={e => onChange(e.target.value)} sx={{ width }}>
    <MenuItem value="">All</MenuItem>
    {options.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
  </TextField>
)

/** The DD/MM/YYYY - DD/MM/YYYY control that sits in most Medical filter rows. */
export const DateRangeField = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <TextField label="From" type="date" InputLabelProps={{ shrink: true }} sx={{ width: 165 }} />
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>–</Typography>
    <TextField label="To" type="date" InputLabelProps={{ shrink: true }} sx={{ width: 165 }} />
  </Box>
)

export const RowMenu = () => {
  const [el, setEl] = useState(null)
  return (
    <>
      <IconButton size="small" aria-label="Row actions" onClick={e => { e.stopPropagation(); setEl(e.currentTarget) }}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={el} open={!!el} onClose={() => setEl(null)}>
        <MenuItem sx={{ minWidth: 150 }} onClick={() => setEl(null)}>Edit</MenuItem>
        <MenuItem onClick={() => setEl(null)}>Archive</MenuItem>
        <MenuItem sx={{ color: colors.red_100 }} onClick={() => setEl(null)}>Delete</MenuItem>
      </Menu>
    </>
  )
}

export const ACTIONS_COL = {
  field: 'actions', headerName: '', width: 56, sortable: false, filterable: false, align: 'right',
  renderCell: () => <RowMenu />,
}

/* --------------------------------------------------------------- atoms */
const SEVERITY_COLOR = {
  Severe: colors.red_200, Moderate: colors.orange_200, Mild: colors.yellow_100, 'Not Specified': colors.neutral_300,
}

export const SeverityChip = ({ value }) => (
  <Chip size="small" label={value}
    sx={{
      height: 22, fontSize: 11, fontWeight: 600,
      bgcolor: SEVERITY_COLOR[value] || colors.neutral_300,
      color: value === 'Not Specified' ? colors.grey_200 : colors.white,
    }} />
)

const STATUS_DOT = { Available: colors.green_200, Unavailable: colors.red_200, 'Injured/Ill': colors.orange_200 }

/** Availability chip used on issue rows: red for time-loss, green for available. */
export const IssueStatusChip = ({ value }) => (
  <Chip size="small" label={value}
    sx={{
      height: 20, fontSize: 11,
      bgcolor: value.startsWith('Unavailable') ? `${colors.red_200}22` : `${colors.green_200}22`,
      color: value.startsWith('Unavailable') ? colors.red_200 : colors.green_300,
    }} />
)

export const AthleteNameCell = ({ name, position, status }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
    <Box sx={{ position: 'relative' }}>
      <Avatar sx={{ width: 32, height: 32, bgcolor: colors.neutral_300, color: colors.grey_150, fontSize: 12 }}>
        {name.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('')}
      </Avatar>
      {status && (
        <Box sx={{
          position: 'absolute', bottom: -1, left: -1, width: 10, height: 10, borderRadius: '50%',
          bgcolor: STATUS_DOT[status] || colors.neutral_400, border: `2px solid ${colors.white}`,
        }} />
      )}
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>{name}</Typography>
      {position && <Typography variant="caption" noWrap sx={{ display: 'block', color: 'text.secondary' }}>{position}</Typography>}
    </Box>
  </Box>
)

/** Availability status: coloured dot, label, and the running day count beneath. */
export const AvailabilityCell = ({ status, days }) => (
  <Box sx={{ py: 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: STATUS_DOT[status] || colors.neutral_400 }} />
      <Typography variant="body2">{status === 'Injured/Ill' ? 'Available' : status}</Typography>
    </Box>
    {status === 'Injured/Ill' && (
      <Typography variant="caption" sx={{ display: 'block', color: colors.orange_300, pl: 2 }}>Injured/Ill</Typography>
    )}
    {days != null && (
      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', pl: 2 }}>{days} days</Typography>
    )}
  </Box>
)

/** Open issues stacked in one cell, each with a coloured spine and its status. */
export const IssuesCell = ({ issues }) => (
  <Box sx={{ py: 1 }}>
    {issues.map((iss, i) => (
      <Box key={i} sx={{ display: 'flex', gap: 1, mb: i < issues.length - 1 ? 1 : 0 }}>
        <Box sx={{ width: 3, borderRadius: 1, bgcolor: colors.red_200, flexShrink: 0 }} />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {iss.date}{iss.title ? ` - ${iss.title}` : ' -'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{iss.status}</Typography>
            {iss.preliminary && <Chip size="small" label="Preliminary" sx={{ height: 18, fontSize: 10 }} />}
          </Box>
        </Box>
      </Box>
    ))}
  </Box>
)

export const NoteCell = ({ note }) => {
  if (!note) return null
  return (
    <Box sx={{ py: 1, minWidth: 0 }}>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>{note.date} - {note.title}</Typography>
      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>{note.body}</Typography>
    </Box>
  )
}

/* ------------------------------------------------- injury record layout */
/** Card with a title and a single right-hand action — the injury record's unit. */
export const DetailCard = ({ title, action, children, sx }) => (
  <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 3, mb: 2.5, ...sx }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 700 }}>{title}</Typography>
      {action}
    </Box>
    {children}
  </Paper>
)

/** Label: value pairs on a grid — the injury record's Primary Pathology block. */
export const FieldGrid = ({ fields, columns = 3 }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: `repeat(${columns}, 1fr)` }, gap: 2 }}>
    {fields.map(([label, value]) => (
      <Typography key={label} variant="body2">
        <Box component="span" sx={{ fontWeight: 700 }}>{label}: </Box>
        <Box component="span" sx={{ color: 'text.secondary' }}>{value}</Box>
      </Typography>
    ))}
  </Box>
)
