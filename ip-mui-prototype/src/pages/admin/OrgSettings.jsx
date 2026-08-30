import { useState } from 'react'
import {
  Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider,
  FormControlLabel, IconButton, Link, Menu, MenuItem, Paper, Switch, Tab, Table, TableBody,
  TableCell, TableHead, TableRow, Tabs, TextField, Tooltip, Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SearchIcon from '@mui/icons-material/Search'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import { FilterRow, SectionLabel, SettingsCard } from './parts'
import {
  BRANDING_SWATCHES, DISPLAY_NAME_FORMATS, GAME_PARTICIPATION, GRAPH_COLOURS, LOCATION_TYPES,
  NOTIFICATION_GROUPS, PHASES_OF_PLAY, PRINCIPLE_CATEGORIES, PRINCIPLE_TYPES, SESSION_PARTICIPATION,
  SHORT_NAME_FORMATS, TIMING_OPTIONS, WHO_OPTIONS, WORKLOAD_VARIABLES, activityTypes,
  devGoalCompletionTypes, devGoalTypes, drillLabels, eventTypeGroups, licenceCreators, locations,
  principles, uploadCategories,
} from '../../data/admin'
import { squads } from '../../data/athletes'

const TABS = ['Appearance', 'Workload', 'Planning', 'Security and privacy', 'My iP', 'Calendar', 'Locations', 'Notifications']

const Head = ({ children, ...rest }) => (
  <TableCell {...rest} sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', borderColor: colors.neutral_300, ...rest.sx }}>
    {children}
  </TableCell>
)
const Cell = ({ children, ...rest }) => (
  <TableCell {...rest} sx={{ fontSize: 14, borderColor: colors.neutral_200, ...rest.sx }}>{children}</TableCell>
)

const RowMenuCell = ({ onOpen, label }) => (
  <Cell align="right" sx={{ width: 56 }}>
    <IconButton size="small" aria-label={`Actions for ${label}`} onClick={onOpen}><MoreVertIcon fontSize="small" /></IconButton>
  </Cell>
)

/* ------------------------------------------------------------- Appearance */
function Appearance() {
  return (
    <>
      <SectionLabel>Naming</SectionLabel>
      <SettingsCard title="Athlete Name">
        <Box sx={{ display: 'grid', gap: 2.5, maxWidth: 420 }}>
          <TextField select fullWidth defaultValue={DISPLAY_NAME_FORMATS[0]}
            label={<Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
              Display name
              <Tooltip title="How an athlete's full name is written across iP."><InfoIcon sx={{ fontSize: 14 }} /></Tooltip>
            </Box>}>
            {DISPLAY_NAME_FORMATS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
          </TextField>
          <TextField select fullWidth defaultValue={SHORT_NAME_FORMATS[0]}
            label={<Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
              Shortened name
              <Tooltip title="Used where space is tight, such as calendar pills."><InfoIcon sx={{ fontSize: 14 }} /></Tooltip>
            </Box>}>
            {SHORT_NAME_FORMATS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
          </TextField>
        </Box>
      </SettingsCard>

      <SectionLabel>Branding</SectionLabel>
      <SettingsCard title="Graph Colours"
        action={<Link component="button" underline="hover" sx={{ fontSize: 14, fontWeight: 600 }}>Restore Defaults</Link>}>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>Select graph colour palette</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          {GRAPH_COLOURS.map((c, i) => (
            <Box key={i} role="button" tabIndex={0} aria-label={`Graph colour ${c}`}
              sx={{ width: 44, height: 44, bgcolor: c, cursor: 'pointer' }} />
          ))}
          <Box role="button" tabIndex={0} aria-label="Add colour"
            sx={{ width: 44, height: 44, display: 'grid', placeItems: 'center', cursor: 'pointer',
              border: `1px solid ${colors.neutral_400}` }}>
            <AddIcon fontSize="small" />
          </Box>
        </Box>
      </SettingsCard>

      <SettingsCard title="Scale colours" description="Set colour preferences for metric scales.">
        <Button variant="outlined">Add palette</Button>
      </SettingsCard>
    </>
  )
}

/* --------------------------------------------------------------- Workload */
const ParticipationTable = ({ rows }) => (
  <Table size="small">
    <TableHead>
      <TableRow>
        <Head>Participation level</Head>
        <Head>Participation</Head>
        <Head align="right">Include in group calculations</Head>
      </TableRow>
    </TableHead>
    <TableBody>
      {rows.map(r => (
        <TableRow key={r.level} sx={{ '&:nth-of-type(even)': { bgcolor: colors.neutral_100 } }}>
          <Cell>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {r.level}
              <Tooltip title="Rename this participation level"><InfoIcon sx={{ fontSize: 14, color: colors.grey_150 }} /></Tooltip>
            </Box>
          </Cell>
          <Cell>{r.participation}</Cell>
          <Cell align="right"><Switch defaultChecked={r.include} /></Cell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

const RpeChannels = () => (
  <SettingsCard title="RPE collection channels">
    <Box>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>How do you want to collect RPEs?</Typography>
      <FormControlLabel sx={{ display: 'flex', ml: 0 }} label="Kiosk app" control={<Checkbox defaultChecked />} />
      <FormControlLabel sx={{ display: 'flex', ml: 0 }} label="Athlete app" control={<Checkbox defaultChecked />} />
    </Box>
  </SettingsCard>
)

function Workload() {
  return (
    <>
      <SectionLabel>Game - Participation &amp; RPE collection</SectionLabel>
      <SettingsCard title="Game defaults"><ParticipationTable rows={GAME_PARTICIPATION} /></SettingsCard>
      <RpeChannels />

      <SectionLabel>Session - Participation &amp; RPE collection</SectionLabel>
      <SettingsCard title="Session defaults"><ParticipationTable rows={SESSION_PARTICIPATION} /></SettingsCard>
      <RpeChannels />

      <SectionLabel>Workload</SectionLabel>
      <SettingsCard title="Workload variables"
        action={<Link component="button" underline="hover" sx={{ fontSize: 14, fontWeight: 600 }}>Restore Defaults</Link>}
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
}

/* --------------------------------------------------------------- Planning */
const MiniTable = ({ title, actions, columns, rows, render }) => {
  const [menuEl, setMenuEl] = useState(null)
  return (
    <SettingsCard title={title} action={actions} sx={{ mb: 0, height: '100%' }}>
      <Table size="small">
        <TableHead>
          <TableRow>{columns.map(c => <Head key={c}>{c}</Head>)}<Head /></TableRow>
        </TableHead>
        <TableBody>
          {rows.map(r => (
            <TableRow key={r.id}>
              {render(r).map((v, i) => <Cell key={i}>{v}</Cell>)}
              <RowMenuCell label={r.name} onOpen={e => setMenuEl(e.currentTarget)} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Menu anchorEl={menuEl} open={!!menuEl} onClose={() => setMenuEl(null)}>
        <MenuItem sx={{ minWidth: 140 }} onClick={() => setMenuEl(null)}>Edit</MenuItem>
        <MenuItem onClick={() => setMenuEl(null)}>Archive</MenuItem>
      </Menu>
    </SettingsCard>
  )
}

function Planning() {
  const [menuEl, setMenuEl] = useState(null)
  const pair = { display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2.5, mb: 2.5 }
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Planning</Typography>
        <Tooltip title="Shared vocabulary for sessions: principles, goal types, activities and drill labels.">
          <InfoIcon fontSize="small" sx={{ color: colors.blue_100 }} />
        </Tooltip>
      </Box>

      <SettingsCard
        title="Principles"
        action={<>
          <Button>Add principle</Button>
          <Button variant="outlined">Edit values</Button>
          <Button variant="outlined">Manage categories</Button>
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
              {['Principle name', 'Category', 'Phases of play', 'Type', 'Squad'].map(c => <Head key={c}>{c}</Head>)}
              <Head />
            </TableRow>
          </TableHead>
          <TableBody>
            {principles.map(p => (
              <TableRow key={p.id}>
                <Cell>{p.name}</Cell><Cell>{p.category}</Cell><Cell>{p.phase}</Cell>
                <Cell>{p.type}</Cell><Cell>{p.squads}</Cell>
                <RowMenuCell label={p.name} onOpen={e => setMenuEl(e.currentTarget)} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SettingsCard>

      <Box sx={pair}>
        <MiniTable title="Development goal type"
          actions={<><Button>Add type</Button><Button variant="outlined">Edit values</Button></>}
          columns={['Name', 'Squad']} rows={devGoalTypes} render={r => [r.name, r.squads]} />
        <MiniTable title="Development goal completion type"
          actions={<><Button>Add type</Button><Button variant="outlined">Edit values</Button></>}
          columns={['Name']} rows={devGoalCompletionTypes} render={r => [r.name]} />
      </Box>

      <Box sx={pair}>
        <MiniTable title="Activity type"
          actions={<><Button>Add type</Button><Button variant="outlined">Edit values</Button></>}
          columns={['Name', 'Category']} rows={activityTypes} render={r => [r.name, r.category]} />
        <MiniTable title="Drill Labels"
          actions={<><Button>Add label</Button><Button variant="outlined">Edit values</Button></>}
          columns={['Name', 'Squad']} rows={drillLabels} render={r => [r.name, r.squads]} />
      </Box>

      <Menu anchorEl={menuEl} open={!!menuEl} onClose={() => setMenuEl(null)}>
        <MenuItem sx={{ minWidth: 140 }} onClick={() => setMenuEl(null)}>Edit</MenuItem>
        <MenuItem onClick={() => setMenuEl(null)}>Duplicate</MenuItem>
        <MenuItem onClick={() => setMenuEl(null)}>Archive</MenuItem>
      </Menu>
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          bgcolor: colors.neutral_100, px: 2, py: 1, borderRadius: 1 }}>
          <Typography variant="body2">Display in Athlete app</Typography>
          <Switch defaultChecked />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>Policy text</Typography>
          <Link component="button" underline="hover" sx={{ fontSize: 14 }} onClick={() => setEditing(e => !e)}>
            {editing ? 'Done' : 'Edit'}
          </Link>
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
function MyIp() {
  return (
    <SettingsCard title="Licence management allocation" action={<Button>Edit</Button>}>
      <Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: -1.5, mb: 2 }}>0 Creator licences</Typography>
        <Typography variant="body2" sx={{ color: colors.grey_150, mb: 1 }}>Creators</Typography>
        {licenceCreators.map(c => (
          <Typography key={c} variant="body2" sx={{ py: 0.25 }}>{c}</Typography>
        ))}
      </Box>
    </SettingsCard>
  )
}

/* --------------------------------------------------------------- Calendar */
function ColourDialog({ open, onClose }) {
  const [tab, setTab] = useState(0)
  const [hex, setHex] = useState('#B134C1')
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Select color</DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Branding" /><Tab label="Custom" />
        </Tabs>
        {tab === 0 ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 1 }}>
            {BRANDING_SWATCHES.map(c => (
              <Box key={c} role="button" tabIndex={0} onClick={() => setHex(c)} aria-label={`Colour ${c}`}
                sx={{ height: 34, borderRadius: 0.5, bgcolor: c, display: 'grid', placeItems: 'center',
                  cursor: 'pointer', outline: hex === c ? `2px solid ${colors.grey_200}` : 'none',
                  outlineOffset: 2 }}>
                <Typography variant="caption" sx={{ color: colors.white, fontWeight: 700 }}>Aa</Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ display: 'grid', placeItems: 'center', gap: 1.5 }}>
            <Box component="input" type="color" value={hex} onChange={e => setHex(e.target.value)}
              aria-label="Custom colour"
              sx={{ width: 180, height: 130, p: 0, border: 'none', bgcolor: 'transparent', cursor: 'pointer' }} />
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <TextField value={hex} onChange={e => setHex(e.target.value)} sx={{ width: 130 }}
                InputProps={{ startAdornment: <Typography variant="body2" sx={{ mr: 0.5 }}>#</Typography> }} />
              <Box sx={{ width: 64, height: 34, borderRadius: 0.5, bgcolor: hex }} />
            </Box>
          </Box>
        )}
        <FormControlLabel sx={{ mt: 2 }} label="Apply to all in group" control={<Checkbox />} />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant="text" onClick={onClose}>Cancel</Button>
        <Button onClick={onClose}>Select</Button>
      </DialogActions>
    </Dialog>
  )
}

function Calendar() {
  const [editing, setEditing] = useState(false)
  const [colourFor, setColourFor] = useState(null)
  const [menuEl, setMenuEl] = useState(null)

  return (
    <>
      <SettingsCard title="Calendar permissions">
        <FormControlLabel sx={{ ml: 0 }} label="Allow External Calendar Integrations"
          control={<Switch defaultChecked />} />
      </SettingsCard>

      <SettingsCard
        title="Event Types"
        action={editing
          ? <><Button onClick={() => setEditing(false)}>Save</Button>
              <Button variant="outlined" onClick={() => setEditing(false)}>Cancel</Button></>
          : <><Button onClick={() => setEditing(true)}>Edit</Button>
              <Button variant="outlined">Archive</Button>
              <IconButton size="small" aria-label="More" onClick={e => setMenuEl(e.currentTarget)}>
                <MoreVertIcon fontSize="small" />
              </IconButton></>}
      >
        {editing ? (
          /* Edit mode turns each row into its own fields, with the colour swatch on the right. */
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
                    <Box role="button" tabIndex={0} onClick={() => setColourFor(it.name)}
                      aria-label={`Colour for ${it.name}`}
                      sx={{ height: 40, borderRadius: 0.5, bgcolor: it.color, display: 'grid',
                        placeItems: 'center', cursor: 'pointer' }}>
                      <Typography variant="caption" sx={{ color: colors.white, fontWeight: 700 }}>Aa</Typography>
                    </Box>
                  </Box>
                ))}
                {g.group !== 'Ungrouped' && (
                  <Link component="button" underline="hover" sx={{ fontSize: 14 }}>Add event to group</Link>
                )}
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
              <Button variant="outlined" startIcon={<AddIcon />}>Add New Event</Button>
              <Button variant="outlined" startIcon={<AddIcon />}>Add Group</Button>
            </Box>
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow><Head sx={{ width: 40 }} /><Head>Event Groups</Head><Head>Squad</Head><Head /></TableRow>
            </TableHead>
            <TableBody>
              {eventTypeGroups.map(g => (
                <Box key={g.group} component="tbody" sx={{ display: 'contents' }}>
                  <TableRow sx={{ bgcolor: colors.neutral_100 }}>
                    <Cell sx={{ width: 40 }}><Checkbox size="small" /></Cell>
                    <Cell sx={{ fontWeight: 700 }}>{g.group}</Cell>
                    <Cell sx={{ fontWeight: 700 }}>{g.squads}</Cell>
                    <RowMenuCell label={g.group} onOpen={e => setMenuEl(e.currentTarget)} />
                  </TableRow>
                  {g.items.map(it => (
                    <TableRow key={it.name}>
                      <Cell sx={{ width: 40, pl: 3 }}><Checkbox size="small" /></Cell>
                      <Cell>
                        <Chip size="small" label={it.name}
                          sx={{ height: 22, fontSize: 11, fontWeight: 600, bgcolor: it.color, color: colors.white }} />
                      </Cell>
                      <Cell>{it.squads}</Cell>
                      <RowMenuCell label={it.name} onOpen={e => setMenuEl(e.currentTarget)} />
                    </TableRow>
                  ))}
                </Box>
              ))}
            </TableBody>
          </Table>
        )}
      </SettingsCard>

      <SettingsCard title="Upload Categories"
        action={<><Button>Edit</Button><Button variant="outlined">View Archive</Button></>}>
        <Table size="small">
          <TableHead><TableRow><Head>Category Name</Head><Head /></TableRow></TableHead>
          <TableBody>
            {uploadCategories.map(c => (
              <TableRow key={c.id}>
                <Cell>{c.name}</Cell>
                <RowMenuCell label={c.name} onOpen={e => setMenuEl(e.currentTarget)} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SettingsCard>

      <Menu anchorEl={menuEl} open={!!menuEl} onClose={() => setMenuEl(null)}>
        <MenuItem sx={{ minWidth: 140 }} onClick={() => setMenuEl(null)}>Edit</MenuItem>
        <MenuItem onClick={() => setMenuEl(null)}>Archive</MenuItem>
      </Menu>
      <ColourDialog open={!!colourFor} onClose={() => setColourFor(null)} />
    </>
  )
}

/* -------------------------------------------------------------- Locations */
function Locations() {
  const [menuEl, setMenuEl] = useState(null)
  const [query, setQuery] = useState('')
  const [type, setType] = useState('')
  const rows = locations
    .filter(l => l.name.toLowerCase().includes(query.toLowerCase()))
    .filter(l => !type || l.type === type)

  return (
    <SettingsCard title="Locations"
      action={<><Button>Edit</Button><Button variant="outlined">View Archive</Button></>}>
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
            {['Name', 'Location Type', 'Related Event', 'Map URL'].map(c => <Head key={c}>{c}</Head>)}<Head />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(l => (
            <TableRow key={l.id}>
              <Cell>{l.name}</Cell><Cell>{l.type}</Cell><Cell>{l.related}</Cell>
              <Cell sx={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {l.map
                  ? <Link href={l.map} target="_blank" rel="noreferrer" underline="hover" sx={{ fontSize: 14 }}>{l.map}</Link>
                  : '-'}
              </Cell>
              <RowMenuCell label={l.name} onOpen={e => setMenuEl(e.currentTarget)} />
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Menu anchorEl={menuEl} open={!!menuEl} onClose={() => setMenuEl(null)}>
        <MenuItem sx={{ minWidth: 140 }} onClick={() => setMenuEl(null)}>Edit</MenuItem>
        <MenuItem onClick={() => setMenuEl(null)}>Archive</MenuItem>
      </Menu>
    </SettingsCard>
  )
}

/* ---------------------------------------------------------- Notifications */
function Notifications() {
  const [open, setOpen] = useState(() => NOTIFICATION_GROUPS.map(() => true))
  return (
    <Box sx={{ mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow><Head>Type</Head><Head>Email</Head><Head>Push</Head></TableRow>
        </TableHead>
        <TableBody>
          {NOTIFICATION_GROUPS.map((g, gi) => (
            <Box key={g.group} component="tbody" sx={{ display: 'contents' }}>
              <TableRow>
                <Cell colSpan={3} sx={{ bgcolor: colors.white }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body1">{g.group}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{g.blurb}</Typography>
                    </Box>
                    <IconButton size="small" aria-label={`Toggle ${g.group}`}
                      onClick={() => setOpen(o => o.map((v, i) => (i === gi ? !v : v)))}>
                      <ExpandMoreIcon sx={{ transform: open[gi] ? 'rotate(180deg)' : 'none', transition: '.2s' }} />
                    </IconButton>
                  </Box>
                </Cell>
              </TableRow>
              {open[gi] && g.rows.map(r => (
                <TableRow key={r.label}>
                  <Cell sx={{ width: '30%' }}>{r.label}</Cell>
                  <Cell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Switch defaultChecked={r.email} />
                      {r.timing && (
                        <TextField select label="Timing" defaultValue={r.emailTiming} sx={{ width: 170 }}>
                          {TIMING_OPTIONS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                        </TextField>
                      )}
                      <TextField select label="Who" defaultValue={r.emailWho} sx={{ width: 130 }}>
                        {WHO_OPTIONS.map(w => <MenuItem key={w} value={w}>{w}</MenuItem>)}
                      </TextField>
                    </Box>
                  </Cell>
                  <Cell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Switch defaultChecked={r.push} />
                      {r.timing && (
                        <TextField select label="Timing" defaultValue="" disabled={!r.push} sx={{ width: 170 }}>
                          {TIMING_OPTIONS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                        </TextField>
                      )}
                      <TextField select label="Who" defaultValue={r.pushWho} disabled={!r.push} sx={{ width: 130 }}>
                        {WHO_OPTIONS.map(w => <MenuItem key={w} value={w}>{w}</MenuItem>)}
                      </TextField>
                    </Box>
                  </Cell>
                </TableRow>
              ))}
            </Box>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

/* ------------------------------------------------------------------ shell */
export default function OrgSettings() {
  const [tab, setTab] = useState(0)
  // Only the panels the live app gives a Save button get one.
  const showSave = [1, 3, 5, 7].includes(tab)

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

      {showSave && (
        <Box sx={{ flexShrink: 0, px: 3, py: 1.5, display: 'flex', justifyContent: 'flex-end',
          borderTop: `1px solid ${colors.neutral_300}` }}>
          <Button>Save</Button>
        </Box>
      )}
    </AppShell>
  )
}
