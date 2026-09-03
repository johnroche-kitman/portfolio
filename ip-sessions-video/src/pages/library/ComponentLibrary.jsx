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
import { athletes, AVAILABILITY, positions } from '../../data/athletes'
import { TYPE_COLOR, EVENT_TYPES, events, gameDayMarker } from '../../data/events'
import { CompletionMark, EventBlock, GameweekBands, GW_BG } from '../calendar/views'
import { ChipList, SectionLabel, SettingsCard } from '../admin/parts'
import { LABEL_COLORS } from '../../data/admin'
import { CUSTOM_CONTROLS, VERDICTS, customSummary } from '../../data/custom'

const TABS = ['Foundations', 'Inputs', 'Data display', 'Navigation', 'Feedback', 'iP components', 'Custom controls']

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
            <Item name="TextField" replaces="inputText" note="Filled variant, size small, with the underline kept — measured off the live app: 4px 4px 0 0 radius, so only the top corners round, a 1px rule at rest and a 2px primary rule on focus. Every select and text field in iP reads this way.">
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
            <Item name="<FilterRow /> + form kit" note="Search plus N selects — the row above almost every list. Was a bespoke <FilterBar />; that is now deleted in favour of FilterRow holding fields from components/form.jsx.">
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', width: '100%' }}>
                <TextField label="Search" value={search} onChange={e => setSearch(e.target.value)} sx={{ width: 220 }} />
                <TextField select label="Position" defaultValue={positions[0]} sx={{ width: 200 }}>
                  {positions.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                </TextField>
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
            <Item name="<AdminGrid />" note="DataGrid resolves flex column widths against its container on first paint. Every administration table sits in a flex chain with minWidth: 0, so that measurement can be 0 — the body recovers, the header widths stay stuck. This measures first and mounts the grid once there is a width.">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Used by Manage Athletes, Manage Staff Users, Labels, Athlete Groups, Imports, Exports,
                Manage Games and Stock Management.
              </Typography>
            </Item>
            <Item name="<PageHeader /> · <SectionLabel /> · <SettingsCard />" note="The three shapes every administration page is built from: a title with its action cluster, a grey caption over a dashed rule, and a white card with a bold title and right-hand actions.">
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Manage Athletes</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small">New Athlete</Button>
                    <Button size="small" variant="outlined">Upload Athletes</Button>
                  </Box>
                </Box>
                <SectionLabel>Naming</SectionLabel>
                <SettingsCard title="Athlete Name" sx={{ mb: 0 }}>
                  <TextField select fullWidth label="Display name" defaultValue="Last name, First name" sx={{ maxWidth: 320 }}>
                    <MenuItem value="Last name, First name">Last name, First name</MenuItem>
                  </TextField>
                </SettingsCard>
              </Box>
            </Item>
            <Item name="<ChipList />" note="Squad and label chips with the live list's overflow count.">
              <ChipList values={['U16 (Test Kitman FC) (Primary)', 'U15', 'U21']} />
              <ChipList values={['Central Players', '2002', '2003']} color={v => LABEL_COLORS[v] || colors.grey_150} />
            </Item>
            <Item name="Inline card edit" note="Settings cards swap Edit/Archive for Save/Cancel and turn their rows into fields in place, rather than opening a separate page. Event Types and Locations both work this way.">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                See Administration → Organisation settings → Calendar → Edit.
              </Typography>
            </Item>
            <Item name="<EventBlock />" note="Calendar event pill: type-coloured left edge over a tint of the same colour, with the completion mark for sessions and games. MUI ships no scheduling grid, so the time grid these sit in is a composition of Box on CSS grid.">
              <Box sx={{ width: 300, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {events.slice(1, 4).map(ev => <EventBlock key={ev.id} ev={ev} onOpen={() => {}} />)}
              </Box>
            </Item>
            <Item name="<CompletionMark />" note={`A session or game is complete once its details and reviews are all filled in. The Complete switch on the session page sets it, and the mark then shows on that event in every calendar view. Plain events have no completion state, so they carry no mark.`}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CompletionMark ev={{ type: EVENT_TYPES.SESSION, complete: false }} />
                <Typography variant="body2">Not complete</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CompletionMark ev={{ type: EVENT_TYPES.SESSION, complete: true }} />
                <Typography variant="body2">Complete</Typography>
              </Box>
            </Item>
            <Item name="<GameweekBands />" note={`The amber bands running across the days a gameweek covers: ${GW_BG} fill, laid on a 7-column grid so each band starts and ends on the right day. Hidden from Calendar settings → Gameweek markers.`}>
              <Box sx={{ width: '100%' }}><GameweekBands from={24} cols={7} /></Box>
            </Item>
            <Item name="Gameday +/- marker" note={`Days since the last game and days until the next, shown top-right of every day in every view. On a game day it collapses to GD 0. Hidden from Calendar settings → Gameday +/- markers.`}>
              {[26, 28, 29, 30].map(d => (
                <Chip key={d} size="small" variant="outlined" label={`${d} Aug — ${gameDayMarker(d)}`}
                  sx={{ height: 22, fontSize: 11 }} />
              ))}
            </Item>
            <Item name="Drag to create" note="Dragging down a day column paints the slot in primary at 16% with a solid border and its time range, snapped to quarter hours. The wash holds while the create popover is open, and the popover anchors beside it rather than over it.">
              <Box sx={{ width: 150, height: 96, position: 'relative', border: `1px solid ${colors.neutral_300}`,
                borderRadius: '2px' }}>
                <Box sx={{ position: 'absolute', top: 20, left: 3, right: 3, height: 52, px: 0.75,
                  bgcolor: `${colors.blue_100}29`, border: `1px solid ${colors.blue_100}`, borderRadius: '2px' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: colors.blue_300 }}>12:45 - 15:00</Typography>
                </Box>
              </Box>
            </Item>
            <Item name="<SessionDetail />" note="The page behind More details on an event: header with the Complete switch and Edit details, then six tabs. Owned by Coaching &amp; Performance.">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                See Calendar → click an event → More details.
              </Typography>
            </Item>
            <Item name="<EventEditor />" note="Full-page create and edit for games, sessions and events, replacing the side panels, which were too cramped.">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                See Calendar → Add → Session. Sections are cards; the action bar sticks to the top on scroll.
              </Typography>
            </Item>
          </>
        )}

        {/* ------------------------------------------- Custom controls */}
        {tab === 6 && (() => {
          const counts = customSummary()
          const groups = [...new Set(CUSTOM_CONTROLS.map(c => c.group))]
          return (
            <>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, maxWidth: '78ch' }}>
                Every control here that is <strong>not</strong> a plain MUI component, with an honest verdict on
                whether it should exist. The <em>iP components</em> tab is the showcase; this is the audit. Anything
                marked Merge, Replace or Drop is work to remove, not work to keep.
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {Object.entries(VERDICTS).map(([k, v]) => (
                  <Chip key={k} label={`${v.label}: ${counts[k] || 0}`} color={v.tone}
                    variant={k === 'keep' ? 'filled' : 'outlined'} size="small" />
                ))}
                <Chip size="small" variant="outlined" label={`${CUSTOM_CONTROLS.length} total`} />
              </Box>

              {groups.map(g => (
                <Paper key={g} variant="outlined" sx={{ borderColor: colors.neutral_300, mb: 2.5 }}>
                  <Box sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${colors.neutral_200}` }}>
                    <Typography variant="subtitle2">{g}</Typography>
                  </Box>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: '26%' }}>Control</TableCell>
                        <TableCell sx={{ width: '20%' }}>Built from</TableCell>
                        <TableCell>Why it exists</TableCell>
                        <TableCell sx={{ width: 150 }}>Verdict</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {CUSTOM_CONTROLS.filter(c => c.group === g).map(c => (
                        <TableRow key={c.name}>
                          <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700 }}>{c.name}</TableCell>
                          <TableCell sx={{ color: 'text.secondary' }}>{c.builtFrom}</TableCell>
                          <TableCell>
                            {c.why}
                            {c.mergeWith && (
                              <Typography variant="caption" sx={{ display: 'block', color: colors.orange_300, mt: 0.5 }}>
                                Merge into {c.mergeWith}
                              </Typography>
                            )}
                            {c.replaceWith && (
                              <Typography variant="caption" sx={{ display: 'block', color: colors.red_200, mt: 0.5 }}>
                                {c.replaceWith}
                              </Typography>
                            )}
                            {c.note && (
                              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 0.5 }}>
                                {c.note}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip size="small" label={VERDICTS[c.verdict].label} color={VERDICTS[c.verdict].tone}
                              variant={c.verdict === 'keep' ? 'filled' : 'outlined'} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              ))}
            </>
          )
        })()}
      </Box>
    </AppShell>
  )
}
