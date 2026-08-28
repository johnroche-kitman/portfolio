import { useState } from 'react'
import {
  Alert, Autocomplete, Avatar, AvatarGroup, Badge, Box, Button, ButtonGroup, Checkbox, Chip,
  CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel,
  IconButton, LinearProgress, Link, Menu, MenuItem, Paper, Radio, RadioGroup, Skeleton, Slider,
  Snackbar, Step, StepLabel, Stepper, Switch, Tab, Table, TableBody, TableCell, TableHead,
  TableRow, Tabs, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import AthleteCell from '../../components/AthleteCell'
import AvailabilityLabel from '../../components/AvailabilityLabel'
import FilterBar from '../../components/FilterBar'
import { athletes, AVAILABILITY, positions } from '../../data/athletes'
import { TYPE_COLOR, EVENT_TYPES } from '../../data/events'

const TABS = ['Foundations', 'Inputs', 'Data display', 'Navigation', 'Feedback', 'iP components']

/** One documented entry. `replaces` names the legacy component it retires. */
function Item({ name, replaces, sites, note, children }) {
  return (
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, mb: 2.5 }}>
      <Box sx={{ px: 2.5, py: 1.75, borderBottom: `1px solid ${colors.neutral_200}`, display: 'flex',
        alignItems: 'baseline', gap: 1.5, flexWrap: 'wrap' }}>
        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{name}</Typography>
        {replaces && (
          <Chip size="small" variant="outlined" label={`replaces ${replaces}`}
            sx={{ height: 20, fontSize: 11, borderColor: colors.orange_100, color: colors.orange_300 }} />
        )}
        {sites && (
          <Chip size="small" label={`${sites} import sites`} sx={{ height: 20, fontSize: 11 }} />
        )}
      </Box>
      {note && (
        <Typography variant="caption" sx={{ display: 'block', px: 2.5, pt: 1.5, color: 'text.secondary' }}>
          {note}
        </Typography>
      )}
      <Box sx={{ p: 2.5, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-start' }}>
        {children}
      </Box>
    </Paper>
  )
}

const Swatch = ({ name, value }) => (
  <Box sx={{ width: 132 }}>
    <Box sx={{ height: 48, borderRadius: 1, bgcolor: value, border: `1px solid ${colors.neutral_300}` }} />
    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontWeight: 600 }}>{name}</Typography>
    <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>{value}</Typography>
  </Box>
)

export default function ComponentLibrary() {
  const [tab, setTab] = useState(0)
  const [toggle, setToggle] = useState('Squad loading')
  const [menuEl, setMenuEl] = useState(null)
  const [dialog, setDialog] = useState(false)
  const [snack, setSnack] = useState(false)
  const [innerTab, setInnerTab] = useState(0)
  const [search, setSearch] = useState('')

  return (
    <AppShell title="Component library">
      <Box sx={{ px: 3, pt: 2.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Component library</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, maxWidth: '72ch' }}>
          Every Material UI component used in this prototype, plus the iP-specific ones built on top of them.
          Anything marked <em>replaces</em> retires a component from <code>packages/components</code>, the design system
          that predates MUI. This page grows as surfaces are converted.
        </Typography>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto"
          sx={{ mt: 1.5, borderBottom: `1px solid ${colors.neutral_300}` }}>
          {TABS.map(t => <Tab key={t} label={t} />)}
        </Tabs>
      </Box>

      <Box sx={{ px: 3, py: 3, maxWidth: 1100 }}>
        {/* ------------------------------------------------ Foundations */}
        {tab === 0 && (
          <>
            <Item name="Palette" note="Tokens from packages/common/src/variables/colors.js. primary.main is grey_200, the brand navy.">
              <Swatch name="primary.main" value={colors.grey_200} />
              <Swatch name="primary.dark" value={colors.grey_400} />
              <Swatch name="primary.light" value={colors.grey_100} />
              <Swatch name="error.main" value={colors.red_200} />
              <Swatch name="warning.main" value={colors.orange_200} />
              <Swatch name="success.main" value={colors.green_200} />
              <Swatch name="secondary.main" value={colors.neutral_200} />
              <Swatch name="divider" value={colors.neutral_300} />
            </Item>
            <Item name="Typography" note="Open Sans throughout. button has textTransform: none — sentence case, never uppercased.">
              <Box>
                <Typography variant="h5">Heading 5 — 24px</Typography>
                <Typography variant="h6">Heading 6 — 20px</Typography>
                <Typography variant="subtitle1">Subtitle 1 — 16px</Typography>
                <Typography variant="body1">Body 1 — 16px</Typography>
                <Typography variant="body2">Body 2 — 14px, the workhorse</Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>Caption — 12px</Typography>
              </Box>
            </Item>
            <Item name="Event type colours" note="Applied to calendar pills and list markers.">
              {Object.entries(TYPE_COLOR).map(([k, v]) => <Swatch key={k} name={k} value={v} />)}
            </Item>
          </>
        )}

        {/* ----------------------------------------------------- Inputs */}
        {tab === 1 && (
          <>
            <Item name="Button" replaces="textButton--kitmanDesignSystem"
              note="Theme default is variant='contained' with disableElevation. 61 surfaces in the live app contain buttons and no MuiButton at all.">
              <Button>Contained</Button>
              <Button variant="outlined">Outlined</Button>
              <Button variant="text">Text</Button>
              <Button startIcon={<AddIcon />}>With icon</Button>
              <Button disabled>Disabled</Button>
              <Button color="error">Destructive</Button>
            </Item>
            <Item name="Button hierarchy"
              note="One primary (contained) per view. Everything else is outlined, text or an icon button. On a form the primary is Save or Create in the sticky header, so in-form actions like Add link are outlined. Dialogs, drawers and popovers are their own view and get one primary each.">
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Button variant="text" color="error" startIcon={<DeleteIcon />}>Delete</Button>
                <Button variant="outlined">Cancel</Button>
                <Button variant="outlined" startIcon={<AddIcon />}>Add link</Button>
                <Button>Save</Button>
              </Box>
            </Item>
            <Item name="ButtonGroup"><ButtonGroup><Button>Day</Button><Button>Week</Button><Button>Month</Button></ButtonGroup></Item>
            <Item name="TextField" replaces="inputText" note="Filled variant, size small, no underline — matches rootTheme.">
              <TextField label="Label" defaultValue="Value" />
              <TextField label="With helper" helperText="Helper text" />
              <TextField label="Error" error helperText="Something is wrong" />
              <TextField label="Multiline" multiline minRows={2} sx={{ minWidth: 260 }} />
              <TextField label="Date" type="date" defaultValue="2026-08-27" InputLabelProps={{ shrink: true }} />
              <TextField label="Time" type="time" defaultValue="10:00" InputLabelProps={{ shrink: true }} />
            </Item>
            <Item name="Select" replaces="kitmanReactSelect" sites={117}
              note="The highest-leverage conversion in the product. Medical Team alone renders 707 of the legacy version.">
              <TextField select label="Squad" defaultValue="U16" sx={{ minWidth: 200 }}>
                <MenuItem value="U16">U16 (Test Kitman FC)</MenuItem>
                <MenuItem value="U15">U15</MenuItem>
              </TextField>
              <TextField select label="Multiple" defaultValue={['A']} SelectProps={{ multiple: true }} sx={{ minWidth: 200 }}>
                <MenuItem value="A">Option A</MenuItem>
                <MenuItem value="B">Option B</MenuItem>
              </TextField>
            </Item>
            <Item name="Autocomplete" replaces="AsyncSelect / LazyAutocomplete"
              note="Used for athlete and location pickers, single and multiple.">
              <Autocomplete options={athletes} getOptionLabel={o => o.name} sx={{ minWidth: 260 }}
                renderInput={p => <TextField {...p} label="Athlete" />} />
              <Autocomplete multiple options={positions} sx={{ minWidth: 260 }}
                renderInput={p => <TextField {...p} label="Positions" />} />
            </Item>
            <Item name="Checkbox / Radio / Switch" replaces="CheckboxList / ActionCheckbox"
              note="The calendar Filters rail carries nine checkboxes and no MuiCheckbox in the live app.">
              <Box>
                <FormControlLabel control={<Checkbox defaultChecked />} label="Checked" />
                <FormControlLabel control={<Checkbox />} label="Unchecked" />
                <FormControlLabel control={<Checkbox indeterminate />} label="Indeterminate" />
              </Box>
              <RadioGroup defaultValue="a">
                <FormControlLabel value="a" control={<Radio />} label="Any" />
                <FormControlLabel value="b" control={<Radio />} label="Is not archived" />
              </RadioGroup>
              <Box>
                <FormControlLabel control={<Switch defaultChecked />} label="Gameweek markers" />
                <FormControlLabel control={<Switch />} label="Complete" />
              </Box>
            </Item>
            <Item name="ToggleButtonGroup" replaces="bespoke segmented control"
              note="Used for the Squad / Individual loading switch on a session.">
              <ToggleButtonGroup exclusive value={toggle} onChange={(_, v) => v && setToggle(v)} color="primary">
                <ToggleButton value="Squad loading">Squad loading</ToggleButton>
                <ToggleButton value="Individual loading">Individual loading</ToggleButton>
              </ToggleButtonGroup>
            </Item>
            <Item name="Slider"><Slider defaultValue={40} sx={{ width: 240 }} /></Item>
          </>
        )}

        {/* ----------------------------------------------- Data display */}
        {tab === 2 && (
          <>
            <Item name="DataGrid" replaces="dataGrid / ReactDataGrid" sites={17}
              note="Two legacy grid implementations retire onto this one. Auto row height supports the stacked injury cells on Medical Team.">
              <Box sx={{ width: '100%' }}>
                <DataGrid autoHeight density="compact" disableRowSelectionOnClick
                  rows={athletes.slice(0, 4)} getRowId={r => r.id}
                  columns={[
                    { field: 'name', headerName: 'Athlete', flex: 1, renderCell: ({ row }) => <AthleteCell athlete={row} /> },
                    { field: 'position', headerName: 'Position', width: 150 },
                    { field: 'availability', headerName: 'Availability', width: 160,
                      renderCell: ({ row }) => <AvailabilityLabel status={row.availability} /> },
                  ]}
                  sx={{ '& .MuiDataGrid-cell:focus': { outline: 'none' } }} />
              </Box>
            </Item>
            <Item name="Table" note="For short static lists where a grid is overkill.">
              <Table size="small">
                <TableHead><TableRow><TableCell>Turnaround</TableCell><TableCell>Date</TableCell><TableCell>Competition</TableCell></TableRow></TableHead>
                <TableBody>
                  <TableRow><TableCell>IS123</TableCell><TableCell>25 Jul 2026</TableCell><TableCell>EFL Youth Alliance</TableCell></TableRow>
                  <TableRow><TableCell>IS122</TableCell><TableCell>23 Jul 2026</TableCell><TableCell>Premier League 2</TableCell></TableRow>
                </TableBody>
              </Table>
            </Item>
            <Item name="Chip"><Chip label="Preliminary" size="small" /><Chip label="Session" size="small" variant="outlined" /><Chip label="Removable" size="small" onDelete={() => {}} /></Item>
            <Item name="Avatar / AvatarGroup" replaces="athleteSelector avatar">
              <Avatar>AO</Avatar>
              <AvatarGroup max={4}>{athletes.slice(0, 5).map(a => <Avatar key={a.id}>{a.name[0]}</Avatar>)}</AvatarGroup>
            </Item>
            <Item name="Badge" note="Messaging count in the nav rail."><Badge badgeContent={14} color="error"><MoreVertIcon /></Badge></Item>
          </>
        )}

        {/* ------------------------------------------------ Navigation */}
        {tab === 3 && (
          <>
            <Item name="Tabs" replaces="TabLayout" sites={14}
              note="Collapses the three separate tab implementations found in the audit into one.">
              <Box sx={{ width: '100%' }}>
                <Tabs value={innerTab} onChange={(_, v) => setInnerTab(v)}>
                  <Tab label="Team" /><Tab label="Daily Status Report" /><Tab label="Notes" />
                </Tabs>
              </Box>
            </Item>
            <Item name="Menu" replaces="TooltipMenu" sites={26} note="Row overflow menus and the Add split-button.">
              <Button onClick={e => setMenuEl(e.currentTarget)}>Open menu</Button>
              <Menu anchorEl={menuEl} open={!!menuEl} onClose={() => setMenuEl(null)}>
                <MenuItem onClick={() => setMenuEl(null)}>Injury / Illness</MenuItem>
                <MenuItem onClick={() => setMenuEl(null)}>Note</MenuItem>
                <Divider />
                <MenuItem onClick={() => setMenuEl(null)}>Treatment</MenuItem>
              </Menu>
            </Item>
            <Item name="Stepper" note="The injury wizard and the import flow.">
              <Box sx={{ width: '100%' }}>
                <Stepper activeStep={1} alternativeLabel>
                  {['Initial Information', 'Diagnosis Information', 'Event Information', 'Additional Information']
                    .map(s => <Step key={s}><StepLabel>{s}</StepLabel></Step>)}
                </Stepper>
              </Box>
            </Item>
            <Item name="Link"><Link href="#" underline="hover">Advanced settings →</Link></Item>
          </>
        )}

        {/* -------------------------------------------------- Feedback */}
        {tab === 4 && (
          <>
            <Item name="Alert" replaces="bespoke error banner" note="Manage Games shows a red banner built by hand in the live app.">
              <Box sx={{ width: '100%', display: 'grid', gap: 1.5 }}>
                <Alert severity="error">The current season is not set up correctly for this squad. Please contact support.</Alert>
                <Alert severity="warning">Two athletes have unresolved medical flags.</Alert>
                <Alert severity="info">Data last calculated 2 hours ago.</Alert>
                <Alert severity="success">Session saved.</Alert>
              </Box>
            </Item>
            <Item name="Dialog" replaces="ConfirmationModal">
              <Button onClick={() => setDialog(true)}>Open dialog</Button>
              <Dialog open={dialog} onClose={() => setDialog(false)}>
                <DialogTitle>Delete this session?</DialogTitle>
                <DialogContent><Typography variant="body2">This cannot be undone.</Typography></DialogContent>
                <DialogActions>
                  <Button variant="text" onClick={() => setDialog(false)}>Cancel</Button>
                  <Button color="error" onClick={() => setDialog(false)}>Delete</Button>
                </DialogActions>
              </Dialog>
            </Item>
            <Item name="Snackbar" replaces="Toast / vanillaToasts" sites={186}
              note="The widest single import in the codebase and a near-mechanical swap.">
              <Button onClick={() => setSnack(true)}>Show toast</Button>
              <Snackbar open={snack} autoHideDuration={2500} onClose={() => setSnack(false)} message="Session created" />
            </Item>
            <Item name="Skeleton / Progress" replaces="DelayedLoadingFeedback" sites={43}>
              <Box sx={{ width: 280 }}>
                <Skeleton /><Skeleton width="60%" /><Skeleton variant="rectangular" height={48} sx={{ mt: 1 }} />
              </Box>
              <CircularProgress size={28} />
              <Box sx={{ width: 200 }}><LinearProgress /></Box>
            </Item>
          </>
        )}

        {/* --------------------------------------------- iP components */}
        {tab === 5 && (
          <>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5, maxWidth: '72ch' }}>
              Built for this prototype on MUI primitives. These are the candidates to add to
              <code> packages/playbook</code> as surfaces are converted.
            </Typography>
            <Item name="<AthleteCell />" replaces="AthleteSelector / Athletes" sites={57}
              note="Avatar with availability dot, name and position. Repeats across nearly every list view.">
              {athletes.slice(0, 3).map(a => <AthleteCell key={a.id} athlete={a} />)}
            </Item>
            <Item name="<AvailabilityLabel />" replaces="AvailabilityLabel (legacy)"
              note="Dot, status and optional day count. Playbook already ships a version of this.">
              <AvailabilityLabel status={AVAILABILITY.AVAILABLE} />
              <AvailabilityLabel status={AVAILABILITY.UNAVAILABLE} days={1122} />
              <AvailabilityLabel status={AVAILABILITY.MODIFIED} days={947} />
            </Item>
            <Item name="<FilterBar />" replaces="GenericActionBar / AthleteFilters"
              note="Search plus N selects. The row above almost every list in the product.">
              <Box sx={{ width: '100%' }}>
                <FilterBar search={search} onSearch={setSearch}
                  filters={[{ label: 'Position', value: positions[0], onChange: () => {}, options: positions }]} />
              </Box>
            </Item>
            <Item name="<MainNav />" note="Left rail with expand/collapse and secondary flyouts. Out of redesign scope, reproduced for context.">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Visible on the left of every page. Toggle it with “Close Menu” at the foot of the rail.
              </Typography>
            </Item>
            <Item name="<AddPanel />" note="One drawer shell behind all eleven Medical creation panels, with the four-step injury wizard.">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                See Medical → Add. Event authoring deliberately does not use this — those moved to a full page.
              </Typography>
            </Item>
            <Item name="<EventEditor />" note="Full-page create and edit for games, sessions and events, replacing the side panels, which were too cramped.">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                See Calendar → Add → Session. Sections are cards; the action bar sticks to the top on scroll.
              </Typography>
            </Item>
          </>
        )}
      </Box>
    </AppShell>
  )
}
