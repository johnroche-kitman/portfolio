import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Breadcrumbs, Button, Checkbox, Chip,
  Divider, FormControlLabel, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Menu,
  Collapse, Dialog, DialogContent, MenuItem, Paper, Radio, RadioGroup, Snackbar, Switch, Tab, Tabs,
  ToggleButton, ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import GroupIcon from '@mui/icons-material/GroupOutlined'
import LinkIcon from '@mui/icons-material/LinkOutlined'
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOverOutlined'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CloseIcon from '@mui/icons-material/Close'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import AddPanel from '../../components/AddPanel'
import AthleteCell from '../../components/AthleteCell'
import RichTextField from '../../components/RichTextField'
import {
  FieldRow, FileDrop, MultiSelect, SearchInput, SelectField, TextInput,
} from '../../components/form'
import { AdminGrid, CardAction, PageHeader, SettingsCard, StateChip } from '../admin/parts'
import {
  DRILL_ACTIVITIES, DRILL_CREATORS, DRILL_PRINCIPLES, INTENSITIES, PARTICIPATION_LEVELS,
  DRILL_FIELDS, PRINCIPLE_CATEGORY, PRINCIPLE_PHASES, PRINCIPLE_TYPE, SESSION_TABS, SQUAD_PICKER,
  collections, drillLibrary, principleOptions, sessionAthletes, sessionDrills, sessionMeta, sessionStaff,
  shortActivity,
} from '../../data/session'
import { EVENT_TYPES, eventById, events, setEventComplete } from '../../data/events'

/* -------------------------------------------------------------- Planning */
/**
 * The session plan. Drills are ordered, so each row carries a drag handle —
 * MUI has no drag-and-drop, which is noted in the custom-controls register.
 */
/** The pale pitch graphic on every drill card. A drawing, not a component. */
const PitchThumb = ({ onClick, width = 145, height = 76 }) => (
  <Box component="svg" viewBox="0 0 145 76" onClick={onClick}
    sx={{ width, height, bgcolor: '#E8EDF6', cursor: onClick ? 'zoom-in' : 'default', flexShrink: 0 }}
    aria-label="Drill diagram">
    <g fill="none" stroke="#B8CBD9" strokeWidth="1.5">
      <rect x="1" y="1" width="143" height="74" />
      <line x1="72.5" y1="1" x2="72.5" y2="75" />
      <circle cx="72.5" cy="38" r="14" />
      <rect x="1" y="20" width="20" height="36" />
      <rect x="124" y="20" width="20" height="36" />
      <path d="M21 24a16 16 0 0 1 0 28" />
      <path d="M124 24a16 16 0 0 0 0 28" />
    </g>
  </Box>
)

const INTENSITY_TONE = { Light: 'positive', Moderate: 'caution', High: 'negative' }

/** One planned drill. Fields are added inline, one link at a time. */
function DrillCard({ drill, index, onChange, onRemove, onOpenDetail, onOpenPrinciples, onZoom }) {
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState('')
  const [menuEl, setMenuEl] = useState(null)

  const startEdit = f => { setEditing(f.key); setDraft(drill[f.key] || '') }
  const commit = () => { onChange({ ...drill, [editing]: draft }); setEditing(null) }

  const pending = DRILL_FIELDS.filter(f => !drill[f.key] && f.key !== editing)

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1.5 }}>
      <Box sx={{ width: 34, pt: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{index + 1}</Typography>
        <LinkIcon sx={{ fontSize: 14, color: colors.grey_150, mt: 0.25 }} />
      </Box>

      <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, flex: 1, minWidth: 0, p: 2,
        display: 'flex', gap: 2 }}>
        <IconButton size="small" aria-label={`Reorder ${drill.name}`} sx={{ cursor: 'grab', alignSelf: 'center' }}>
          <DragIndicatorIcon fontSize="small" sx={{ color: colors.grey_150 }} />
        </IconButton>
        <PitchThumb onClick={onZoom} />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Button variant="text" onClick={onOpenDetail}
              sx={{ p: 0, minWidth: 0, fontSize: 16, fontWeight: 700, color: 'text.primary' }}>
              {drill.name}
            </Button>
            <StateChip value={drill.intensity} tone={INTENSITY_TONE[drill.intensity]} />
            <Chip size="small" label={shortActivity(drill.activity)} sx={{ height: 22, fontSize: 11 }} />
          </Box>

          {/* Values already set, then the inline editor, then the remaining Add links. */}
          {DRILL_FIELDS.filter(f => drill[f.key] && f.key !== editing).map(f => (
            <Box key={f.key} sx={{ mt: 1 }}>
              <Typography variant="subtitle2">{f.label}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {Array.isArray(drill[f.key]) ? drill[f.key].join(', ') : drill[f.key]}
              </Typography>
            </Box>
          ))}

          {editing && (
            <Box sx={{ mt: 1.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                {DRILL_FIELDS.find(f => f.key === editing).editLabel}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <TextInput autoFocus value={draft} onChange={e => setDraft(e.target.value)}
                  multiline={editing === 'note'} minRows={editing === 'note' ? 2 : undefined}
                  sx={{ maxWidth: 320 }} />
                <IconButton size="small" aria-label="Confirm" onClick={commit}
                  sx={{ border: `1px solid ${colors.neutral_400}`, borderRadius: 1 }}>
                  <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" aria-label="Cancel" onClick={() => setEditing(null)}
                  sx={{ border: `1px solid ${colors.neutral_400}`, borderRadius: 1 }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          )}

          {!!pending.length && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Add:</Typography>
              {pending.map((f, i) => (
                <Box key={f.key} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button variant="text" size="small" sx={{ minWidth: 0, px: 0.5, fontWeight: 700 }}
                    onClick={() => (f.panel ? onOpenPrinciples(drill) : startEdit(f))}>
                    {f.label}
                  </Button>
                  {i < pending.length - 1 && (
                    <Typography variant="body2" sx={{ color: colors.neutral_400 }}>|</Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <IconButton size="small" aria-label={`Actions for ${drill.name}`} sx={{ alignSelf: 'flex-start' }}
          onClick={e => setMenuEl(e.currentTarget)}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={menuEl} open={!!menuEl} onClose={() => setMenuEl(null)}>
          <MenuItem sx={{ minWidth: 190 }} onClick={() => { setMenuEl(null); onRemove(drill.id) }}>
            Remove from plan
          </MenuItem>
        </Menu>
      </Paper>

      {/* Attendance sits outside the card in the live page. */}
      <Box sx={{ width: 90, pt: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GroupIcon fontSize="small" sx={{ color: colors.grey_150 }} />
          <Typography variant="body2">{drill.athletes || '2/2'}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
          <RecordVoiceOverIcon fontSize="small" sx={{ color: colors.grey_150 }} />
          <Typography variant="body2">{drill.staff || '0/2'}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

function PlanningTab({ drills, onChange, onRemove, onAddFromLibrary, onCreateDrill, onOpenDetail, onOpenPrinciples }) {
  const [zoom, setZoom] = useState(false)

  return (
    <Box>
      {drills.map((d, i) => (
        <DrillCard key={d.id} drill={d} index={i} onChange={onChange} onRemove={onRemove}
          onOpenDetail={() => onOpenDetail(d)} onOpenPrinciples={onOpenPrinciples}
          onZoom={() => setZoom(true)} />
      ))}

      {!!drills.length && <Divider sx={{ my: 3 }} />}

      {/* The live page stacks these below the plan, Add drill from library primary. */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1.5 }}>
        <Button startIcon={<AddIcon />} onClick={onAddFromLibrary}>Add drill from library</Button>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={onCreateDrill}>Create new drill</Button>
      </Box>

      {!drills.length && (
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 3 }}>
          No drills added to this session yet.
        </Typography>
      )}

      {/* Clicking a thumbnail opens it full size, as the live page does. */}
      <Dialog open={zoom} onClose={() => setZoom(false)} maxWidth="lg" fullWidth>
        <DialogContent sx={{ p: 0, display: 'grid', placeItems: 'center', bgcolor: '#E8EDF6' }}>
          <PitchThumb width="100%" height={560} />
        </DialogContent>
      </Dialog>
    </Box>
  )
}

/* ------------------------------------------------------- Athlete selection */
/**
 * DataGrid does the editing: `type: 'singleSelect'` gives the participation
 * dropdown, checkboxSelection gives the row checkboxes and a bulk edit, all
 * with keyboard support. The live page hand-builds each of those.
 */
export function AthleteSelectionTab({ onAddRemove }) {
  const [rows, setRows] = useState(sessionAthletes)
  const [selection, setSelection] = useState(sessionAthletes.filter(a => a.selected).map(a => a.id))
  const [q, setQ] = useState('')
  const [participation, setParticipation] = useState('')

  const shown = useMemo(() => rows
    .filter(r => r.name.toLowerCase().includes(q.toLowerCase()))
    .filter(r => !participation || r.participation === participation), [rows, q, participation])

  const columns = [
    { field: 'name', headerName: 'Athlete/Position', flex: 1.2, minWidth: 220,
      renderCell: p => <AthleteCell athlete={p.row} size={32} /> },
    { field: 'availability', headerName: 'Status', width: 150,
      renderCell: p => <StateChip value={p.row.availability} soft /> },
    { field: 'participation', headerName: 'Participation', width: 190,
      type: 'singleSelect', valueOptions: PARTICIPATION_LEVELS, editable: true },
    { field: 'groupCalcs', headerName: 'Group calcs', width: 160, sortable: false,
      renderCell: p => (
        <FormControlLabel sx={{ ml: 0 }} label={p.row.groupCalcs ? 'In' : 'Out'}
          control={<Switch checked={p.row.groupCalcs}
            onChange={e => setRows(rs => rs.map(r => (r.id === p.row.id ? { ...r, groupCalcs: e.target.checked } : r)))} />} />
      ) },
  ]

  return (
    <SettingsCard title="Athletes" action={<CardAction onClick={onAddRemove}>Add/remove athletes</CardAction>}>
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
        <SearchInput label="Search athletes" value={q} onChange={e => setQ(e.target.value)} sx={{ width: 220 }} />
        <SelectField label="Status" options={['Available', 'Unavailable']} sx={{ width: 170 }} />
        <SelectField label="Position" options={['Goalkeeper', 'Defender', 'Midfielder', 'Forward']} sx={{ width: 170 }} />
        <SelectField label="Participation" options={PARTICIPATION_LEVELS} value={participation}
          onChange={e => setParticipation(e.target.value)} sx={{ width: 190 }} />
      </Box>

      <AdminGrid
        rows={shown} columns={columns} rowHeight={64} checkboxSelection
        rowSelectionModel={selection} onRowSelectionModelChange={setSelection}
        processRowUpdate={row => { setRows(rs => rs.map(r => (r.id === row.id ? row : r))); return row }}
        pageSizeOptions={[10, 25]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
      />
      <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: 'text.secondary' }}>
        Drill-by-drill participation will appear here. Add drills in the Planning section.
      </Typography>
    </SettingsCard>
  )
}

/* --------------------------------------------------------- Staff selection */
export function StaffSelectionTab({ onAddRemove }) {
  const [selection, setSelection] = useState([])
  return (
    <SettingsCard title="Staff" action={<CardAction onClick={onAddRemove}>Add/remove staff</CardAction>}>
      <AdminGrid
        rows={sessionStaff} rowHeight={56} checkboxSelection
        rowSelectionModel={selection} onRowSelectionModelChange={setSelection}
        columns={[
          { field: 'name', headerName: 'Staff', flex: 1, minWidth: 220,
            renderCell: p => (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 28, height: 28, bgcolor: colors.neutral_300, color: colors.grey_150, fontSize: 11 }}>
                  {p.row.name.split(' ').map(w => w[0]).join('')}
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.row.name}</Typography>
              </Box>
            ) },
          { field: 'role', headerName: 'Role', width: 200 },
        ]}
        hideFooter
      />
      <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: 'text.secondary' }}>
        Drill-by-drill participation will appear here. Add drills in the Planning section.
      </Typography>
    </SettingsCard>
  )
}

/* --------------------------------------------------------------- Collection */
/** DataGrid's own toolbar supplies the Columns button the live page rebuilds. */
const GridToolbar = ({ onEditValues }) => (
  <GridToolbarContainer sx={{ justifyContent: 'flex-end', gap: 1, p: 1 }}>
    <CardAction onClick={onEditValues}>Edit values</CardAction>
    <GridToolbarColumnsButton />
    <CardAction>Collection channels</CardAction>
  </GridToolbarContainer>
)

export function CollectionTab() {
  // The live tab keeps a collection open and toggles the rail beside it, so the
  // rail is a Collapse in row orientation rather than a swapped-out view.
  const [openId, setOpenId] = useState('workload')
  const [railOpen, setRailOpen] = useState(true)
  const [rows, setRows] = useState(sessionAthletes)
  const open = collections.find(c => c.id === openId)

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
      <Collapse in={railOpen} orientation="horizontal" unmountOnExit>
        <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, width: 240, flexShrink: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1, pt: 1 }}>
            <IconButton size="small" aria-label="Close collections" onClick={() => setRailOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pb: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Collections</Typography>
            <IconButton size="small" aria-label="Add collection"><AddIcon fontSize="small" /></IconButton>
          </Box>
          <Divider />
          <List disablePadding>
            {collections.map(c => (
              <ListItemButton key={c.id} selected={c.id === openId} onClick={() => setOpenId(c.id)}
                sx={{ borderBottom: `1px solid ${colors.neutral_200}` }}>
                <ListItemText primary={c.name} primaryTypographyProps={{ variant: 'body2' }} />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      </Collapse>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        {!railOpen && (
          <Breadcrumbs sx={{ mb: 2 }}>
            <Button variant="outlined" size="small" endIcon={<ChevronRightIcon />}
              onClick={() => setRailOpen(true)}>Collections</Button>
          </Breadcrumbs>
        )}

        {open?.shape === 'form' && (
          <SettingsCard title={open.name} action={<Button>Save</Button>}>
            <Box sx={{ display: 'grid', gap: 3 }}>
              {open.questions.map(qn => {
                if (qn.type === 'richtext') return <RichTextField key={qn.label} label={qn.label} />
                if (qn.type === 'multiselect') {
                  return <MultiSelectQuestion key={qn.label} label={qn.label} options={qn.options} />
                }
                if (qn.type === 'radio') {
                  return (
                    <Box key={qn.label}>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>{qn.label}</Typography>
                      <RadioGroup row defaultValue={qn.options[0]}>
                        {qn.options.map(o => (
                          <FormControlLabel key={o} value={o} control={<Radio size="small" />} label={o} />
                        ))}
                      </RadioGroup>
                    </Box>
                  )
                }
                return <TextInput key={qn.label} label={qn.label} />
              })}
            </Box>
          </SettingsCard>
        )}

        {open?.shape === 'grid' && (
          <SettingsCard title={open.name}
            action={<IconButton size="small" aria-label="More"><MoreVertIcon fontSize="small" /></IconButton>}>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
              <SearchInput label="Search athletes" sx={{ width: 220 }} />
              <SelectField label="Participation level" options={PARTICIPATION_LEVELS} sx={{ width: 200 }} />
            </Box>
            <AdminGrid
              rows={rows} rowHeight={56}
              columns={[
                { field: 'name', headerName: 'Athlete', flex: 1, minWidth: 200,
                  renderCell: p => <AthleteCell athlete={p.row} size={30} /> },
                ...open.columns,
              ]}
              processRowUpdate={row => { setRows(rs => rs.map(r => (r.id === row.id ? row : r))); return row }}
              slots={{ toolbar: GridToolbar }}
              hideFooter
            />
          </SettingsCard>
        )}
      </Box>
    </Box>
  )
}

const MultiSelectQuestion = ({ label, options }) => {
  const [value, setValue] = useState([])
  return <MultiSelect label={label} options={options} value={value} onChange={setValue} selectAll />
}

/* ------------------------------------------------------------ Imported data */
export const ImportedDataTab = ({ onImport }) => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Typography variant="h6">Imported data</Typography>
      <Button onClick={onImport}>Import data</Button>
    </Box>
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, py: 8, textAlign: 'center' }}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>No imported data</Typography>
    </Paper>
  </Box>
)

/* ------------------------------------------------------------ Development */
export const DevelopmentGoalsTab = () => (
  <SettingsCard title="Development Goals">
    <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', py: 5 }}>
      No development goals added
    </Typography>
  </SettingsCard>
)

/* ------------------------------------------------------------------ panels */
const AddDrillBody = ({ onPick }) => {
  const [tab, setTab] = useState(0)
  const [q, setQ] = useState('')
  const [favourites, setFavourites] = useState(() => new Set(drillLibrary.filter(d => d.favourite).map(d => d.id)))

  const pool = drillLibrary
    .filter(d => (tab === 0 ? true : favourites.has(d.id)))
    .filter(d => d.name.toLowerCase().includes(q.toLowerCase()))
  const groups = [...new Set(pool.map(d => d.activity))]

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <SearchInput label="Search" value={q} onChange={e => setQ(e.target.value)} sx={{ flex: 1 }} />
        <Button sx={{ flexShrink: 0 }}>Create drill</Button>
      </Box>
      <FieldRow cols={3}>
        <SelectField label="Creators" options={DRILL_CREATORS} />
        <SelectField label="Activities" options={DRILL_ACTIVITIES} />
        <SelectField label="Principles" options={DRILL_PRINCIPLES} />
      </FieldRow>

      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label="Squad library" /><Tab label="My favourites" />
      </Tabs>

      <Box>
        {groups.map(g => (
          <Box key={g} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>{g}</Typography>
            <Divider />
            <List disablePadding>
              {pool.filter(d => d.activity === g).map(d => (
                <ListItemButton key={d.id} sx={{ px: 0 }} onClick={() => onPick?.(d)}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <DragIndicatorIcon fontSize="small" sx={{ color: colors.grey_150 }} />
                  </ListItemIcon>
                  <ListItemIcon sx={{ minWidth: 32 }}><AddIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary={d.name} primaryTypographyProps={{ variant: 'body2' }} />
                  <IconButton size="small" aria-label={`Favourite ${d.name}`}
                    onClick={e => {
                      e.stopPropagation()
                      setFavourites(f => { const n = new Set(f); n.has(d.id) ? n.delete(d.id) : n.add(d.id); return n })
                    }}>
                    {favourites.has(d.id)
                      ? <StarIcon fontSize="small" sx={{ color: colors.yellow_100 }} />
                      : <StarBorderIcon fontSize="small" />}
                  </IconButton>
                </ListItemButton>
              ))}
            </List>
          </Box>
        ))}
        {!pool.length && (
          <Typography variant="body2" sx={{ color: 'text.secondary', py: 3, textAlign: 'center' }}>
            No drills match.
          </Typography>
        )}
      </Box>
    </>
  )
}

const SESSION_PANELS = {
  addDrill: { title: 'Add drill', body: ({ onPick }) => <AddDrillBody onPick={onPick} /> },

  createDrill: {
    title: 'Create new drill',
    body: () => (
      <>
        <FileDrop hint="Drag and drop drill diagram or" />
        <TextInput label="Drill name" />
        <SelectField label="Activity" options={DRILL_ACTIVITIES} required helperText="Required" />
        <RichTextField label="Description" />
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Estimated intensity</Typography>
          <IntensityPicker />
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Web link(s)</Typography>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <TextInput label="Title" sx={{ flex: 1 }} />
            <TextInput label="URL" sx={{ flex: 2 }} />
            <Button variant="outlined" sx={{ mt: 0.5 }}>Add</Button>
          </Box>
        </Box>
        <FormControlLabel label="Save to drill library" control={<Checkbox />} />
      </>
    ),
  },

  addAthletes: {
    title: 'Add/remove athletes',
    body: () => <SquadPicker />,
  },

  drillDetail: {
    title: 'Drill detail',
    chip: 'In library',
    body: ({ drill }) => (
      <>
        <FileDrop hint="Drag and drop drill diagram or" />
        <TextInput label="Drill name" defaultValue={drill?.name || ''} required helperText="Required" />
        <SelectField label="Activity" defaultValue={drill?.activity || ''}
          options={DRILL_ACTIVITIES} required helperText="Required" />
        <Typography variant="caption" sx={{ color: 'text.secondary', mt: -1 }}>
          Associated squads: U16 (Test Kitman FC), U15, U21
        </Typography>

        {['Available principle(s)', 'Available drill label(s)', 'Drill visible to the following squads...'].map(t => (
          <Accordion key={t} disableGutters variant="outlined"
            sx={{ borderColor: colors.neutral_300, '&::before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ChevronRightIcon />}>
              <Typography variant="subtitle2">{t}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>None set.</Typography>
            </AccordionDetails>
          </Accordion>
        ))}

        <RichTextField label="Description" />
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Estimated intensity</Typography>
          <IntensityPicker value={drill?.intensity} />
        </Box>
      </>
    ),
  },

  principles: {
    title: 'Principles',
    body: () => (
      <>
        <SearchInput label="Search principles" sx={{ width: '100%' }} />
        <FieldRow cols={3}>
          <SelectField label="Category" options={PRINCIPLE_CATEGORY} />
          <SelectField label="Phases" options={PRINCIPLE_PHASES} />
          <SelectField label="Types" options={PRINCIPLE_TYPE} />
        </FieldRow>
        <List disablePadding>
          {principleOptions.map(o => (
            <ListItemButton key={o} sx={{ px: 0, alignItems: 'flex-start' }}>
              <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                <DragIndicatorIcon fontSize="small" sx={{ color: colors.grey_150 }} />
              </ListItemIcon>
              <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}><AddIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary={o} primaryTypographyProps={{ variant: 'body2' }} />
            </ListItemButton>
          ))}
        </List>
      </>
    ),
  },

  importData: {
    title: 'Import data',
    body: () => (
      <>
        <SelectField label="Import type"
          options={['GPS', 'Heart rate', 'Wellness', 'Benchmark testing', 'Other']} />
        <FileDrop hint="Drag & drop the file to import or" />
        <SelectField label="Match athletes by" options={['Athlete ID', 'External ID', 'Name']} />
        <FormControlLabel label="Overwrite existing values for this session" control={<Checkbox />} />
      </>
    ),
  },

  addStaff: {
    title: 'Add/remove staff',
    body: () => (
      <>
        <SearchInput label="Search" sx={{ width: '100%' }} />
        <List>
          {['Craig Bennett', 'Pablo de Miguel', 'ST Test', 'MKing Staff', 'Adam Conway'].map(s => (
            <ListItemButton key={s} sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 40 }}><Checkbox size="small" /></ListItemIcon>
              <ListItemText primary={s} primaryTypographyProps={{ variant: 'body2' }} />
            </ListItemButton>
          ))}
        </List>
      </>
    ),
  },
}

/** A segmented control is a ToggleButtonGroup, not three styled divs. */
const INTENSITY_FILL = { Light: colors.green_200, Moderate: colors.orange_200, High: colors.red_200 }

function IntensityPicker({ value: initial = 'Moderate' }) {
  const [value, setValue] = useState(initial)
  return (
    <ToggleButtonGroup exclusive fullWidth value={value} onChange={(_, v) => v && setValue(v)}
      aria-label="Estimated intensity">
      {INTENSITIES.map(i => (
        <ToggleButton key={i} value={i}
          sx={{ '&.Mui-selected': { bgcolor: INTENSITY_FILL[i], color: colors.white, fontWeight: 700,
            '&:hover': { bgcolor: INTENSITY_FILL[i] } } }}>
          {i}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

export function SquadPicker() {
  const [picked, setPicked] = useState(() => new Set(['crgtst']))
  const toggle = n => setPicked(p => { const s = new Set(p); s.has(n) ? s.delete(n) : s.add(n); return s })

  return (
    <>
      <SearchInput label="Search" sx={{ width: '100%' }} />
      {SQUAD_PICKER.map(g => (
        <Accordion key={g.squad} disableGutters variant="outlined"
          sx={{ borderColor: colors.neutral_300, '&::before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ChevronLeftIcon sx={{ transform: 'rotate(-90deg)' }} />}>
            <Typography variant="subtitle1">{g.squad}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
              <Button variant="text" size="small"
                onClick={() => setPicked(p => new Set([...p, ...g.athletes]))}>Select entire squad</Button>
              <Button variant="text" size="small"
                onClick={() => setPicked(p => new Set([...p].filter(n => !g.athletes.includes(n))))}>Clear</Button>
            </Box>
            <List disablePadding>
              {g.athletes.map(a => (
                <ListItemButton key={a} sx={{ px: 0 }} onClick={() => toggle(a)}>
                  <ListItemIcon sx={{ minWidth: 40 }}><Checkbox size="small" checked={picked.has(a)} /></ListItemIcon>
                  <ListItemText primary={a} primaryTypographyProps={{ variant: 'body2' }} />
                </ListItemButton>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  )
}

/* ------------------------------------------------------------------- page */
export default function SessionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const ev = eventById(id) || events.find(e => e.type === EVENT_TYPES.SESSION)

  const [tab, setTab] = useState(0)
  const [complete, setComplete] = useState(!!ev.complete)
  const [menuEl, setMenuEl] = useState(null)
  const [panel, setPanel] = useState(null)
  const [drills, setDrills] = useState(sessionDrills)
  const [toast, setToast] = useState('')

  const [activeDrill, setActiveDrill] = useState(null)

  const addDrill = d => {
    setDrills(ds => [...ds, { ...d, id: Date.now(), minutes: 10, intensity: 'Moderate' }])
    setPanel(null)
    setToast(`${d.name} added to the plan`)
  }

  const toggleComplete = v => { setComplete(v); setEventComplete(ev.id, v) }

  return (
    <AppShell title="Schedule" listLabel="Event list">
      <Box sx={{ px: 3, pt: 2 }}>
        <Button variant="text" startIcon={<ChevronLeftIcon />} onClick={() => navigate('/calendar')} sx={{ ml: -1 }}>
          Back
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mt: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5">{ev.title}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, mt: 0.75 }}>
              {sessionMeta(ev).map(([label, value], i, arr) => (
                <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>{label}: </Box>{value}
                  </Typography>
                  {i < arr.length - 1 && <Divider orientation="vertical" flexItem />}
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            {/* Turning this on is what puts the check mark on the event in every calendar view. */}
            <FormControlLabel sx={{ mr: 0 }} label="Complete"
              control={<Switch checked={complete} onChange={e => toggleComplete(e.target.checked)} />} />
            <Button variant="outlined" onClick={() => navigate(`/events/${ev.id}`)}>Edit details</Button>
            <IconButton size="small" onClick={e => setMenuEl(e.currentTarget)} aria-label="More actions">
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mt: 2 }}>
          {SESSION_TABS.map(t => <Tab key={t} label={t} />)}
        </Tabs>
      </Box>
      <Divider />

      <Box sx={{ p: 3 }}>
        {tab === 0 && <PlanningTab drills={drills}
          onChange={d => setDrills(ds => ds.map(x => (x.id === d.id ? d : x)))}
          onRemove={id => setDrills(ds => ds.filter(d => d.id !== id))}
          onAddFromLibrary={() => setPanel('addDrill')}
          onCreateDrill={() => setPanel('createDrill')}
          onOpenDetail={d => { setActiveDrill(d); setPanel('drillDetail') }}
          onOpenPrinciples={d => { setActiveDrill(d); setPanel('principles') }} />}
        {tab === 1 && <AthleteSelectionTab onAddRemove={() => setPanel('addAthletes')} />}
        {tab === 2 && <StaffSelectionTab onAddRemove={() => setPanel('addStaff')} />}
        {tab === 3 && <DevelopmentGoalsTab />}
        {tab === 4 && <CollectionTab />}
        {tab === 5 && <ImportedDataTab onImport={() => navigate('/mass_upload/event_data')} />}
      </Box>

      <Menu anchorEl={menuEl} open={!!menuEl} onClose={() => setMenuEl(null)}>
        <MenuItem onClick={() => setMenuEl(null)} sx={{ minWidth: 190 }}>Duplicate event</MenuItem>
        <Divider />
        <MenuItem onClick={() => setMenuEl(null)} sx={{ color: colors.red_100 }}>Delete</MenuItem>
      </Menu>

      <AddPanel open={!!panel} definition={panel ? SESSION_PANELS[panel] : null}
        onClose={() => setPanel(null)} width={panel === 'addDrill' ? 560 : 640}
        onPick={addDrill} drill={activeDrill} />

      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast('')} message={toast} />
    </AppShell>
  )
}
