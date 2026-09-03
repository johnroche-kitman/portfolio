import {
  Accordion, AccordionDetails, AccordionSummary, Autocomplete, Box, Checkbox, Chip,
  FormControlLabel, IconButton, Link, TextField, Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import colors from '../../theme/tokens'
import { athletes, squads } from '../../data/athletes'
import { COMPETITIONS, LABELS, SESSION_TYPES, STAFF, VENUES } from '../../data/events'

/**
 * The calendar filter rail, matching the live app: seven groups, each with a
 * count badge, and Select all / Clear on the checkbox groups.
 */
export default function CalendarFilters({ state, set, onClose }) {
  const toggle = (key, value) => {
    const list = state[key]
    set(key, list.includes(value) ? list.filter(v => v !== value) : [...list, value])
  }

  const Group = ({ name, count, children, defaultExpanded = true }) => (
    <Accordion defaultExpanded={defaultExpanded} disableGutters elevation={0}
      sx={{ '&:before': { display: 'none' }, borderBottom: `1px solid ${colors.neutral_200}` }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0, minHeight: 44 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>{name}</Typography>
          <Chip size="small" label={count} sx={{ height: 18, fontSize: 11, minWidth: 24 }} />
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0, pt: 0, pb: 2 }}>{children}</AccordionDetails>
    </Accordion>
  )

  const SelectAll = ({ onAll, onClear }) => (
    <Box sx={{ display: 'flex', gap: 1.5, mb: 0.5 }}>
      <Link component="button" underline="hover" sx={{ fontSize: 13 }} onClick={onAll}>Select all</Link>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>|</Typography>
      <Link component="button" underline="hover" sx={{ fontSize: 13 }} onClick={onClear}>Clear</Link>
    </Box>
  )

  const Check = ({ list, value }) => (
    <FormControlLabel
      control={<Checkbox size="small" checked={state[list].includes(value)} onChange={() => toggle(list, value)} />}
      label={<Typography variant="body2">{value}</Typography>}
      sx={{ display: 'flex', ml: 0 }}
    />
  )

  return (
    <Box sx={{ width: 300, flexShrink: 0, px: 2, pb: 3, borderRight: `1px solid ${colors.neutral_300}`,
      bgcolor: colors.white, alignSelf: 'stretch', overflowY: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
        <Typography variant="h6" sx={{ fontSize: 17, fontWeight: 700 }}>Filters</Typography>
        <IconButton size="small" onClick={onClose} aria-label="Close filters"><CloseIcon fontSize="small" /></IconButton>
      </Box>

      <Group name="Squads" count={state.squads.length}>
        <TextField fullWidth placeholder="Search" sx={{ mb: 1 }}
          InputProps={{ endAdornment: <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} /> }} />
        <SelectAll onAll={() => set('squads', [...squads])} onClear={() => set('squads', [])} />
        {squads.map(s => <Check key={s} list="squads" value={s} />)}
      </Group>

      <Group name="Types" count={state.types.length}>
        <SelectAll
          onAll={() => set('types', ['Squad Sessions', 'Individual Sessions', 'Games', 'Events'])}
          onClear={() => set('types', [])} />
        {['Squad Sessions', 'Individual Sessions', 'Games', 'Events'].map(t => (
          <Check key={t} list="types" value={t} />
        ))}
      </Group>

      <Group name="Sessions" count={state.sessionTypes.length} defaultExpanded={false}>
        <Autocomplete multiple options={SESSION_TYPES} value={state.sessionTypes}
          onChange={(_, v) => set('sessionTypes', v)} size="small"
          renderInput={p => <TextField {...p} placeholder="Search session types" />} />
      </Group>

      <Group name="Games" count={state.competitions.length + state.oppositions.length} defaultExpanded={false}>
        <Autocomplete multiple options={COMPETITIONS} value={state.competitions}
          onChange={(_, v) => set('competitions', v)} size="small" sx={{ mb: 1.5 }}
          renderInput={p => <TextField {...p} label="Competition" />} />
        <Autocomplete multiple options={['U14 Test Kitman Wanderers', 'Test Team', 'Test game']}
          value={state.oppositions} onChange={(_, v) => set('oppositions', v)} size="small"
          renderInput={p => <TextField {...p} label="Opposition" />} />
      </Group>

      <Group name="Attendees" count={state.athletes.length + state.staff.length} defaultExpanded={false}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Athletes</Typography>
        <Autocomplete multiple options={athletes} getOptionLabel={o => o.name} value={state.athletes}
          onChange={(_, v) => set('athletes', v)} size="small" sx={{ mt: 0.5, mb: 1.5 }}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          renderInput={p => <TextField {...p} placeholder="Search for athletes" />} />
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Staff</Typography>
        <Autocomplete multiple options={STAFF} value={state.staff} onChange={(_, v) => set('staff', v)}
          size="small" sx={{ mt: 0.5 }}
          renderInput={p => <TextField {...p} placeholder="Search for staff" />} />
      </Group>

      <Group name="Location" count={state.venues.length + state.locations.length} defaultExpanded={false}>
        {VENUES.map(v => <Check key={v} list="venues" value={v} />)}
        <Autocomplete multiple options={['Arrowhead Stadium', 'Emirates Stadium', 'Training Ground']}
          value={state.locations} onChange={(_, v) => set('locations', v)} size="small" sx={{ mt: 1 }}
          renderInput={p => <TextField {...p} placeholder="Search locations" />} />
      </Group>

      <Group name="Labels" count={state.labels.length} defaultExpanded={false}>
        <Autocomplete multiple options={LABELS} value={state.labels} onChange={(_, v) => set('labels', v)}
          size="small" renderInput={p => <TextField {...p} placeholder="Search labels" />} />
      </Group>
    </Box>
  )
}
