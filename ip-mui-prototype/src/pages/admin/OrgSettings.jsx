import { Fragment, useState } from 'react'
import {
  Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, Chip, Dialog, DialogActions,
  DialogContent, DialogTitle, Divider, FormControlLabel, IconButton, InputAdornment, Menu, MenuItem,
  Switch, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, TextField, Tooltip, Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import HelpIcon from '@mui/icons-material/HelpOutline'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SearchIcon from '@mui/icons-material/Search'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import { CardAction, FilterRow, SectionLabel, SettingsCard, SwatchPicker } from './parts'
import {
  BRANDING_SWATCHES, DISPLAY_NAME_FORMATS, GAME_PARTICIPATION, GRAPH_COLOURS, LOCATION_TYPES,
  NOTIFICATION_GROUPS, PHASES_OF_PLAY, PRINCIPLE_CATEGORIES, PRINCIPLE_TYPES, SESSION_PARTICIPATION,
  SHORT_NAME_FORMATS, TIMING_OPTIONS, WHO_OPTIONS, WORKLOAD_VARIABLES, activityTypes,
  devGoalCompletionTypes, devGoalTypes, drillLabels, eventTypeGroups, licenceCreators, locations,
  principles, uploadCategories,
} from '../../data/admin'
import { squads } from '../../data/athletes'

const TABS = ['Appearance', 'Workload', 'Planning', 'Security and privacy', 'My iP', 'Calendar', 'Locations', 'Notifications']

/** A field's explanatory tooltip belongs on the input, not inside its label. */
const helpAdornment = title => ({
  endAdornment: (
    <InputAdornment position="end">
      <Tooltip title={title}>
        <HelpIcon fontSize="small" sx={{ color: 'text.secondary' }} />
      </Tooltip>
    </InputAdornment>
  ),
})

const RowMenu = ({ label }) => {
  const [el, setEl] = useState(null)
  return (
    <TableCell align="right" sx={{ width: 56 }}>
      <IconButton size="small" aria-label={`Actions for ${label}`} onClick={e => setEl(e.currentTarget)}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={el} open={!!el} onClose={() => setEl(null)}>
        <MenuItem sx={{ minWidth: 140 }} onClick={() => setEl(null)}>Edit</MenuItem>
        <MenuItem onClick={() => setEl(null)}>Archive</MenuItem>
      </Menu>
    </TableCell>
  )
}

/* ------------------------------------------------------------- Appearance */
function Appearance() {
  const [graph, setGraph] = useState(GRAPH_COLOURS[0])
  return (
    <>
      <SectionLabel>Naming</SectionLabel>
      <SettingsCard title="Athlete Name">
        <Box sx={{ display: 'grid', gap: 2.5, maxWidth: 420 }}>
          <TextField select fullWidth label="Display name" defaultValue={DISPLAY_NAME_FORMATS[0]}
            helperText="How an athlete's full name is written across iP.">
            {DISPLAY_NAME_FORMATS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
          </TextField>
          <TextField select fullWidth label="Shortened name" defaultValue={SHORT_NAME_FORMATS[0]}
            helperText="Used where space is tight, such as calendar pills.">
            {SHORT_NAME_FORMATS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
          </TextField>
        </Box>
      </SettingsCard>

      <SectionLabel>Branding</SectionLabel>
      <SettingsCard title="Graph Colours" action={<CardAction low>Restore defaults</CardAction>}
        description="Select graph colour palette">
        <SwatchPicker value={graph} onChange={setGraph} options={GRAPH_COLOURS} label="Graph colour" showAdd />
      </SettingsCard>

      <SettingsCard title="Scale colours" description="Set colour preferences for metric scales."
        action={<CardAction startIcon={<AddIcon />}>Add palette</CardAction>} />
    </>
  )
}

/* --------------------------------------------------------------- Workload */
const ParticipationTable = ({ rows }) => (
  <Table size="small">
    <TableHead>
      <TableRow>
        <TableCell>Participation level</TableCell>
        <TableCell>Participation</TableCell>
        <TableCell align="right">Include in group calculations</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {rows.map(r => (
        <TableRow key={r.level} sx={{ '&:nth-of-type(even)': { bgcolor: colors.neutral_100 } }}>
          <TableCell>{r.level}</TableCell>
          <TableCell>{r.participation}</TableCell>
          <TableCell align="right">
            <Switch defaultChecked={r.include} inputProps={{ 'aria-label': `Include ${r.level}` }} />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

const RpeChannels = () => (
  <SettingsCard title="RPE collection channels" description="How do you want to collect RPEs?">
    <Box>
      <FormControlLabel sx={{ display: 'flex', ml: 0 }} label="Kiosk app" control={<Checkbox defaultChecked />} />
      <FormControlLabel sx={{ display: 'flex', ml: 0 }} label="Athlete app" control={<Checkbox defaultChecked />} />
    </Box>
  </SettingsCard>
)

const Workload = () => (
  <>
    <SectionLabel>Game — participation &amp; RPE collection</SectionLabel>
    <SettingsCard title="Game defaults"><ParticipationTable rows={GAME_PARTICIPATION} /></SettingsCard>
    <RpeChannels />

    <SectionLabel>Session — participation &amp; RPE collection</SectionLabel>
    <SettingsCard title="Session defaults"><ParticipationTable rows={SESSION_PARTICIPATION} /></SettingsCard>
    <RpeChannels />

    <SectionLabel>Workload</SectionLabel>
    <SettingsCard title="Workload variables" action={<CardAction low>Restore defaults</CardAction>}
      description="Choose what metrics define workload in the system. The changes you make here will be reflected for all the users across your organisation. No impact on your data, simply how you look at it.">
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
        <TextField select fullWidth label="Primary workload variable" defaultValue={WORKLOAD_VARIABLES[0]}>
          {WORKLOAD_VARIABLES.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
        </TextField>
        <TextField select fullWidth label="Secondary workload variable" defaultValue="">
          {WORKLOAD_VARIABLES.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
        </TextField>
      </Box>
    </SettingsCard>
  </>
)

/* --------------------------------------------------------------- Planning */
const MiniTable = ({ title, addLabel, columns, rows, render }) => (
  <SettingsCard title={title} sx={{ mb: 0, height: '100%' }}
    action={<><CardAction startIcon={<AddIcon />}>{addLabel}</CardAction><CardAction>Edit values</CardAction></>}>
    <Table size="small">
      <TableHead><TableRow>{columns.map(c => <TableCell key={c}>{c}</TableCell>)}<TableCell /></TableRow></TableHead>
      <TableBody>
        {rows.map(r => (
          <TableRow key={r.id}>
            {render(r).map((v, i) => <TableCell key={i}>{v}</TableCell>)}
            <RowMenu label={r.name} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </SettingsCard>
)

function Planning() {
  const pair = { display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2.5, mb: 2.5 }
  return (
    <>
      <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>Planning</Typography>

      <SettingsCard title="Principles"
        action={<>
          <CardAction startIcon={<AddIcon />}>Add principle</CardAction>
          <CardAction>Edit values</CardAction>
          <CardAction>Manage categories</CardAction>
        </>}
      >
        <FilterRow>
          <TextField label="Search principles" sx={{ width: 240 }}
            InputProps={{ endAdornment: <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} /> }} />
          <TextField select label="Category" defaultValue="" sx={{ width: 200 }}>
            <MenuItem value="">All</MenuItem>
            {PRINCIPLE_CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField select label="Phases of play" defaultValue="" sx={{ width: 190 }}>
            <MenuItem value="">All</MenuItem>
            {PHASES_OF_PLAY.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField select label="Type" defaultValue="" sx={{ width: 190 }}>
            <MenuItem value="">All</MenuItem>
            {PRINCIPLE_TYPES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField select label="Squad" defaultValue="" sx={{ width: 200 }}>
            <MenuItem value="">All</MenuItem>
            {squads.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
        </FilterRow>

        <Table size="small">
          <TableHead>
            <TableRow>
              {['Principle name', 'Category', 'Phases of play', 'Type', 'Squad'].map(c => <TableCell key={c}>{c}</TableCell>)}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {principles.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell><TableCell>{p.category}</TableCell><TableCell>{p.phase}</TableCell>
                <TableCell>{p.type}</TableCell><TableCell>{p.squads}</TableCell>
                <RowMenu label={p.name} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SettingsCard>

      <Box sx={pair}>
        <MiniTable title="Development goal type" addLabel="Add type" columns={['Name', 'Squad']}
          rows={devGoalTypes} render={r => [r.name, r.squads]} />
        <MiniTable title="Development goal completion type" addLabel="Add type" columns={['Name']}
          rows={devGoalCompletionTypes} render={r => [r.name]} />
      </Box>
      <Box sx={pair}>
        <MiniTable title="Activity type" addLabel="Add type" columns={['Name', 'Category']}
          rows={activityTypes} render={r => [r.name, r.category]} />
        <MiniTable title="Drill Labels" addLabel="Add label" columns={['Name', 'Squad']}
          rows={drillLabels} render={r => [r.name, r.squads]} />
      </Box>
    </>
  )
}

/* ---------------------------------------------------- Security and privacy */
function Security() {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState('')
  return (
    <SettingsCard title="Privacy policy">
      <Box>
        <FormControlLabel sx={{ display: 'flex', justifyContent: 'space-between', ml: 0, mr: 0, py: 1 }}
          labelPlacement="start" label="Display in Athlete app" control={<Switch defaultChecked />} />
        <Divider />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="subtitle2">Policy text</Typography>
          <CardAction low onClick={() => setEditing(e => !e)}>{editing ? 'Done' : 'Edit'}</CardAction>
        </Box>
        {editing ? (
          <TextField fullWidth multiline minRows={5} sx={{ mt: 1.5 }} value={text}
            onChange={e => setText(e.target.value)} placeholder="Write the policy shown to athletes" />
        ) : (
          <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
            {text || 'No policy set'}
          </Typography>
        )}
      </Box>
    </SettingsCard>
  )
}

/* ------------------------------------------------------------------ My iP */
const MyIp = () => (
  <SettingsCard title="Licence management allocation" action={<CardAction>Edit</CardAction>}
    description="0 Creator licences">
    <Typography variant="overline" sx={{ display: 'block', color: 'text.secondary', mb: 1 }}>Creators</Typography>
    {licenceCreators.map(c => <Typography key={c} variant="body2" sx={{ py: 0.25 }}>{c}</Typography>)}
  </SettingsCard>
)

/* --------------------------------------------------------------- Calendar */
function ColourDialog({ open, onClose }) {
  const [tab, setTab] = useState(0)
  const [hex, setHex] = useState('#B134C1')
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Select color</DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Branding" /><Tab label="Custom" />
        </Tabs>
        {tab === 0
          ? <SwatchPicker value={hex} onChange={setHex} options={BRANDING_SWATCHES} label="Colour" size={38} />
          : (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
              <TextField label="Hex" value={hex} onChange={e => setHex(e.target.value)} sx={{ width: 150 }} />
              <TextField type="color" label="Pick" value={hex} onChange={e => setHex(e.target.value)}
                sx={{ width: 90, '& input': { height: 26, p: 0.5, cursor: 'pointer' } }} />
            </Box>
          )}
        <FormControlLabel sx={{ mt: 2 }} label="Apply to all in group" control={<Checkbox />} />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
        <Button onClick={onClose}>Select</Button>
      </DialogActions>
    </Dialog>
  )
}

function Calendar() {
  const [editing, setEditing] = useState(false)
  const [colourFor, setColourFor] = useState(null)

  return (
    <>
      <SettingsCard title="Calendar permissions">
        <FormControlLabel sx={{ ml: 0 }} label="Allow External Calendar Integrations"
          control={<Switch defaultChecked />} />
      </SettingsCard>

      <SettingsCard
        title="Event Types"
        action={editing
          ? <><CardAction low onClick={() => setEditing(false)}>Cancel</CardAction>
              <CardAction onClick={() => setEditing(false)}>Done</CardAction></>
          : <><CardAction onClick={() => setEditing(true)}>Edit</CardAction>
              <CardAction>Archive</CardAction></>}
      >
        {editing ? (
          <Box>
            {eventTypeGroups.map(g => (
              <Box key={g.group} sx={{ mb: 3 }}>
                {g.group !== 'Ungrouped' && (
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 44px', gap: 1.5, mb: 1.5 }}>
                    <TextField label="Group Name" defaultValue={g.group} />
                    <TextField select label="Squad" defaultValue={g.squads}>
                      <MenuItem value={g.squads}>{g.squads}</MenuItem>
                    </TextField>
                  </Box>
                )}
                {g.items.map(it => (
                  <Box key={it.name} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 44px', gap: 1.5, mb: 1 }}>
                    <TextField label="Events Type" defaultValue={it.name} />
                    <TextField select label="Squad" defaultValue={it.squads}>
                      <MenuItem value={it.squads}>{it.squads}</MenuItem>
                    </TextField>
                    <IconButton onClick={() => setColourFor(it.name)} aria-label={`Colour for ${it.name}`}
                      sx={{ height: 40, borderRadius: 0.5, bgcolor: it.color, color: colors.white,
                        '&:hover': { bgcolor: it.color, filter: 'brightness(0.92)' } }}>
                      <Typography variant="caption" sx={{ color: 'inherit', fontWeight: 700 }}>Aa</Typography>
                    </IconButton>
                  </Box>
                ))}
                {g.group !== 'Ungrouped' && (
                  <CardAction low startIcon={<AddIcon />}>Add event to group</CardAction>
                )}
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
              <CardAction startIcon={<AddIcon />}>Add New Event</CardAction>
              <CardAction startIcon={<AddIcon />}>Add Group</CardAction>
            </Box>
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow><TableCell sx={{ width: 40 }} /><TableCell>Event Groups</TableCell><TableCell>Squad</TableCell><TableCell /></TableRow>
            </TableHead>
            <TableBody>
              {eventTypeGroups.map(g => (
                <Fragment key={g.group}>
                  <TableRow sx={{ bgcolor: colors.neutral_100 }}>
                    <TableCell sx={{ width: 40 }}><Checkbox size="small" inputProps={{ 'aria-label': g.group }} /></TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{g.group}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{g.squads}</TableCell>
                    <RowMenu label={g.group} />
                  </TableRow>
                  {g.items.map(it => (
                    <TableRow key={it.name}>
                      <TableCell sx={{ width: 40, pl: 3 }}><Checkbox size="small" inputProps={{ 'aria-label': it.name }} /></TableCell>
                      <TableCell>
                        <Chip size="small" label={it.name}
                          sx={{ height: 22, fontSize: 11, fontWeight: 600, bgcolor: it.color, color: colors.white }} />
                      </TableCell>
                      <TableCell>{it.squads}</TableCell>
                      <RowMenu label={it.name} />
                    </TableRow>
                  ))}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </SettingsCard>

      <SettingsCard title="Upload Categories"
        action={<><CardAction>Edit</CardAction><CardAction>View Archive</CardAction></>}>
        <Table size="small">
          <TableHead><TableRow><TableCell>Category Name</TableCell><TableCell /></TableRow></TableHead>
          <TableBody>
            {uploadCategories.map(c => (
              <TableRow key={c.id}><TableCell>{c.name}</TableCell><RowMenu label={c.name} /></TableRow>
            ))}
          </TableBody>
        </Table>
      </SettingsCard>

      <ColourDialog open={!!colourFor} onClose={() => setColourFor(null)} />
    </>
  )
}

/* -------------------------------------------------------------- Locations */
function Locations() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('')
  const rows = locations
    .filter(l => l.name.toLowerCase().includes(query.toLowerCase()))
    .filter(l => !type || l.type === type)

  return (
    <SettingsCard title="Locations"
      action={<><CardAction>Edit</CardAction><CardAction>View Archive</CardAction></>}>
      <FilterRow>
        <TextField label="Search" value={query} onChange={e => setQuery(e.target.value)} sx={{ width: 220 }}
          InputProps={{ endAdornment: <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} /> }} />
        <TextField select label="Location type" value={type} onChange={e => setType(e.target.value)} sx={{ width: 220 }}>
          <MenuItem value="">All</MenuItem>
          {LOCATION_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
        <TextField select label="Event type" defaultValue="" sx={{ width: 220 }}>
          <MenuItem value="">All</MenuItem>
          {['Game', 'Session', 'Event'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
      </FilterRow>

      <Table size="small">
        <TableHead>
          <TableRow>
            {['Name', 'Location Type', 'Related Event', 'Map URL'].map(c => <TableCell key={c}>{c}</TableCell>)}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(l => (
            <TableRow key={l.id}>
              <TableCell>{l.name}</TableCell><TableCell>{l.type}</TableCell><TableCell>{l.related}</TableCell>
              <TableCell sx={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {l.map
                  ? <Button variant="text" size="small" href={l.map} target="_blank" rel="noreferrer"
                      sx={{ p: 0, minWidth: 0, textDecoration: 'underline' }}>{l.map}</Button>
                  : '-'}
              </TableCell>
              <RowMenu label={l.name} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SettingsCard>
  )
}

/* ---------------------------------------------------------- Notifications */
/** A real Accordion: MUI already owns the chevron, the rotation and the a11y wiring. */
const Notifications = () => (
  <Box sx={{ mt: 2 }}>
    {NOTIFICATION_GROUPS.map(g => (
      <Accordion key={g.group} defaultExpanded disableGutters variant="outlined"
        sx={{ borderColor: colors.neutral_300, '&::before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box>
            <Typography variant="subtitle1">{g.group}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{g.blurb}</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '28%' }}>Type</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Push</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {g.rows.map(r => (
                <TableRow key={r.label}>
                  <TableCell>{r.label}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Switch defaultChecked={r.email} inputProps={{ 'aria-label': `${r.label} email` }} />
                      {r.timing && (
                        <TextField select label="Timing" defaultValue={r.emailTiming} sx={{ width: 170 }}>
                          {TIMING_OPTIONS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                        </TextField>
                      )}
                      <TextField select label="Who" defaultValue={r.emailWho} sx={{ width: 130 }}>
                        {WHO_OPTIONS.map(w => <MenuItem key={w} value={w}>{w}</MenuItem>)}
                      </TextField>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Switch defaultChecked={r.push} inputProps={{ 'aria-label': `${r.label} push` }} />
                      {r.timing && (
                        <TextField select label="Timing" defaultValue="" disabled={!r.push} sx={{ width: 170 }}>
                          {TIMING_OPTIONS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                        </TextField>
                      )}
                      <TextField select label="Who" defaultValue={r.pushWho} disabled={!r.push} sx={{ width: 130 }}>
                        {WHO_OPTIONS.map(w => <MenuItem key={w} value={w}>{w}</MenuItem>)}
                      </TextField>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>
    ))}
  </Box>
)

/* ------------------------------------------------------------------ shell */
export default function OrgSettings() {
  const [tab, setTab] = useState(0)

  return (
    <AppShell title="Organisation Settings" fullHeight>
      <Box sx={{ flexShrink: 0, borderBottom: `1px solid ${colors.neutral_300}` }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ px: 2 }}>
          {TABS.map(t => <Tab key={t} label={t} />)}
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Box sx={{ maxWidth: 1000, mx: 'auto', px: 3, pb: 6 }}>
          {tab === 0 && <Appearance />}
          {tab === 1 && <Workload />}
          {tab === 2 && <Planning />}
          {tab === 3 && <Security />}
          {tab === 4 && <MyIp />}
          {tab === 5 && <Calendar />}
          {tab === 6 && <Locations />}
          {tab === 7 && <Notifications />}
        </Box>
      </Box>

      {/* Every panel saves the same way, so every panel gets the same Save bar —
          and it holds the page's only primary. */}
      <Box sx={{ flexShrink: 0, px: 3, py: 1.5, display: 'flex', justifyContent: 'flex-end',
        borderTop: `1px solid ${colors.neutral_300}` }}>
        <Button>Save</Button>
      </Box>
    </AppShell>
  )
}
