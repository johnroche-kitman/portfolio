import { createContext, useContext, useState } from 'react'
import {
  Avatar, Box, Button, Chip, IconButton, Menu, MenuItem, Paper, TextField, Toolbar, Typography,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import colors from '../../theme/tokens'
import { AdminGrid, FilterRow } from '../admin/parts'
import { DateRangeInput, SearchInput } from '../../components/form'
import AthleteCell from '../../components/AthleteCell'
import AvailabilityLabel from '../../components/AvailabilityLabel'

/**
 * Medical tabs are nested three deep, so the Add buttons reach their panel
 * through context rather than being threaded through every tab component.
 */
const PanelContext = createContext(() => {})
export const PanelProvider = PanelContext.Provider
export const useOpenPanel = () => useContext(PanelContext)

/**
 * Every list tab in Medical is the same shape at all three levels — team,
 * athlete and injury record: a heading, one primary Add, secondary actions, a
 * filter row, then a table. Building it once is the difference between eleven
 * near-identical pages and one component with eleven configurations.
 */
/**
 * The one list layout: title, actions, filters, grid. Tabs that support bulk
 * actions pass `selectable` and `selectionActions` — the grid gets MUI's own
 * checkbox column and the filter row is replaced by the selection bar while
 * anything is selected, which is how the live app behaves.
 */
export function ListPanel({
  title, addLabel, addPanel, addMenu, onAdd, onRowClick, actions, filters, columns, rows,
  rowHeight = 56, empty, selectable, selection = [], onSelectionChange, selectionActions,
  autoRowHeight, alignTop, footer,
}) {
  const [addEl, setAddEl] = useState(null)
  const openPanel = useOpenPanel()
  const open = onAdd || openPanel

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {addLabel && (addMenu
            ? <>
              <Button endIcon={<ArrowDropDownIcon />} onClick={e => setAddEl(e.currentTarget)}>{addLabel}</Button>
              <Menu anchorEl={addEl} open={!!addEl} onClose={() => setAddEl(null)}>
                {addMenu.map(m => (
                  <MenuItem key={m} sx={{ minWidth: 200 }}
                    onClick={() => { setAddEl(null); open(m) }}>{m}</MenuItem>
                ))}
              </Menu>
            </>
            : <Button onClick={() => open(addPanel || addLabel)}>{addLabel}</Button>)}
          {actions}
        </Box>
      </Box>

      {selectable && selection.length > 0
        ? (
          <Toolbar sx={{ bgcolor: colors.neutral_200, borderRadius: 1, mb: 2,
            justifyContent: 'space-between', minHeight: 64 }}>
            <Typography variant="subtitle2">{selection.length} selected</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>{selectionActions}</Box>
          </Toolbar>
        )
        : filters && <FilterRow>{filters}</FilterRow>}

      {rows.length
        ? <AdminGrid rows={rows} columns={columns}
            {...(autoRowHeight ? { getRowHeight: () => 'auto' } : { rowHeight })}
            checkboxSelection={!!selectable}
            rowSelectionModel={selectable ? selection : undefined}
            onRowSelectionModelChange={selectable ? onSelectionChange : undefined}
            onRowClick={onRowClick ? p => onRowClick(p.row) : undefined}
            sx={{
              ...(onRowClick ? { '& .MuiDataGrid-row': { cursor: 'pointer' } } : null),
              // Auto-height rows carry an editor or an expanding list, so their
              // content has to start at the top rather than ride the centre line.
              ...(alignTop ? { '& .MuiDataGrid-cell': { alignItems: 'flex-start', py: 1.5 } } : null),
            }}
            pageSizeOptions={[10, 25]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} />
        : (
          <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, py: 6, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{empty || 'Nothing recorded yet'}</Typography>
          </Paper>
        )}

      {footer}
    </Box>
  )
}

/* Filter controls come from the shared form kit. A Medical filter select always
   carries an "All" option, which is the only thing the kit does not assume. */
export const SearchField = ({ value, onChange, label = 'Search', width = 220 }) => (
  <SearchInput label={label} value={value} onChange={e => onChange(e.target.value)} sx={{ width }} />
)

export const SelectField = ({ label, options, value, onChange, width = 180 }) => (
  <TextField select label={label} value={value} onChange={e => onChange(e.target.value)} sx={{ width }}>
    <MenuItem value="">All</MenuItem>
    {options.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
  </TextField>
)

export const DateRangeField = DateRangeInput

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
// One chip for every state in Medical, tone chosen from the value. Was three
// components with three colour maps for the same idea.
export { StateChip as SeverityChip, StateChip as IssueStatusChip } from '../admin/parts'

const STATUS_DOT = { Available: colors.green_200, Unavailable: colors.red_200, 'Injured/Ill': colors.orange_200 }

/* AthleteCell and AvailabilityLabel are the shared components — Medical adds no
   behaviour of its own, only its status vocabulary. */
export const AthleteNameCell = ({ name, position, status }) => (
  <AthleteCell athlete={{ name, position }} status={status} size={32} />
)

export const AvailabilityCell = ({ status, days }) => (
  <AvailabilityLabel
    status={status === 'Injured/Ill' ? 'Available' : status}
    sublabel={status === 'Injured/Ill' ? 'Injured/Ill' : undefined}
    days={days}
  />
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
// The card and the field grid are the shared ones — see admin/parts.jsx. They are
// re-exported here only so medical pages have a single import.
export { SettingsCard as DetailCard, FieldGrid } from '../admin/parts'
