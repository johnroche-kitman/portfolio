/**
 * Register of every control in this prototype that is NOT a plain MUI component.
 *
 * The point is to keep the list short and to be able to see, at a glance, which
 * entries have earned their place. `verdict` is the honest call:
 *
 *  keep    — no MUI equivalent, or a genuine product concept worth owning
 *  done    — was on this list and has since been merged away or deleted
 *  merge   — duplicates something else here; the two should become one
 *  replace — MUI already does this and we should be using it
 *  drop    — thin enough that it adds a name without adding anything else
 */

export const VERDICTS = {
  keep: { label: 'Keep', tone: 'success' },
  done: { label: 'Removed', tone: 'info' },
  merge: { label: 'Merge', tone: 'warning' },
  replace: { label: 'Replace with MUI', tone: 'error' },
  drop: { label: 'Drop', tone: 'default' },
}

export const CUSTOM_CONTROLS = [
  /* ------------------------------------------------------------- shell */
  { group: 'Shell', name: '<AppShell />', builtFrom: 'Box, AppBar, Toolbar, Drawer, Avatar',
    why: 'App chrome: rail, app bar, player list drawer, and the scroll contract for full-height pages.',
    verdict: 'keep' },
  { group: 'Shell', name: '<MainNav />', builtFrom: 'Drawer, List, ListItemButton, Popper',
    why: 'Collapsing rail with secondary flyouts. MUI has no rail pattern; out of redesign scope anyway.',
    verdict: 'keep' },

  /* -------------------------------------------------------- form kit */
  { group: 'Form kit', name: '<SelectField />', builtFrom: 'TextField select',
    why: 'Carries the explicit fullWidth that TextField otherwise overrides, and maps a plain string list.',
    verdict: 'keep' },
  { group: 'Form kit', name: '<TextInput />', builtFrom: 'TextField',
    why: 'Carries the same explicit fullWidth as SelectField, for the same reason. Listed as a drop on the first pass; that was wrong, it earns its place.',
    verdict: 'keep' },
  { group: 'Form kit', name: '<DateInput />', builtFrom: 'TextField type=date',
    why: 'Adds the shrink label every date field needs.',
    verdict: 'replace', replaceWith: '@mui/x-date-pickers DatePicker, once that dependency is in.' },
  { group: 'Form kit', name: '<NumberInput /> · <MoneyInput />', builtFrom: 'TextField + InputAdornment',
    why: 'Unit and currency adornments, so pages stop hand-rolling them.',
    verdict: 'keep' },
  { group: 'Form kit', name: '<SearchInput />', builtFrom: 'TextField + InputAdornment',
    why: 'The search field in every filter row.',
    verdict: 'keep' },
  { group: 'Form kit', name: '<DateRangeInput />', builtFrom: 'two DateInputs',
    why: 'The DD/MM/YYYY – DD/MM/YYYY pair used across Medical and Administration.',
    verdict: 'replace', replaceWith: 'MUI X DateRangePicker (Pro). Until then this stands in.' },
  { group: 'Form kit', name: '<FieldRow />', builtFrom: 'Box on CSS grid',
    why: 'Two- and three-column field layout.',
    verdict: 'replace', replaceWith: 'MUI Grid v2, which does this with the same API MUI users already know.' },
  { group: 'Form kit', name: '<MultiSelect />', builtFrom: 'Autocomplete multiple',
    why: 'Adds a Select all / Clear footer through Autocomplete’s own PaperComponent slot, plus a max cap.',
    verdict: 'keep' },
  { group: 'Form kit', name: '<SearchSelect />', builtFrom: 'Autocomplete',
    why: 'Single-value type-ahead. Barely more than Autocomplete itself.',
    verdict: 'drop' },
  { group: 'Form kit', name: '<AthleteSelect />', builtFrom: 'Autocomplete + AthleteCell',
    why: 'Athlete picker with the availability-aware row. Used by the event editor and every medical panel.',
    verdict: 'keep' },
  { group: 'Form kit', name: '<FileDrop />', builtFrom: 'Box',
    why: 'Drag-and-drop target. MUI has no file input at all.',
    verdict: 'keep' },
  { group: 'Form kit', name: '<AddPanel />', builtFrom: 'Drawer, Stepper, Button',
    why: 'One drawer shell behind all eleven Medical creation panels, config-driven.',
    verdict: 'keep' },

  /* -------------------------------------------------------- page parts */
  { group: 'Page parts', name: '<PageHeader />', builtFrom: 'Box, Typography, Button',
    why: 'Title plus action cluster, with the one-primary rule baked in.',
    verdict: 'keep' },
  { group: 'Page parts', name: '<SectionLabel />', builtFrom: 'Divider textAlign + Typography overline',
    why: 'Section divider. Was a hand-drawn dashed rule; now MUI’s own labelled Divider.',
    verdict: 'keep' },
  { group: 'Page parts', name: '<SettingsCard />', builtFrom: 'Paper outlined',
    why: 'The one card used by settings, detail pages and the injury record.',
    verdict: 'keep' },
  { group: 'Page parts', name: '<CardAction />', builtFrom: 'Button',
    why: 'Card-level action. Exists so card actions cannot accidentally become primaries.',
    verdict: 'keep' },
  { group: 'Page parts', name: '<FieldGrid />', builtFrom: 'Box on CSS grid + Typography',
    why: 'Label: value pairs. Overlaps FieldRow — one grid helper should serve both.',
    verdict: 'merge', mergeWith: '<FieldRow />' },
  { group: 'Page parts', name: '<SwatchPicker />', builtFrom: 'ToggleButtonGroup, ToggleButton, IconButton',
    why: 'Colour palette. Was four divs with role="button" and no keyboard handler.',
    verdict: 'keep' },
  { group: 'Page parts', name: '<FilterRow />', builtFrom: 'Box flex wrap',
    why: 'The row above every table.',
    verdict: 'keep' },
  { group: 'Page parts', name: '<FilterBar />', builtFrom: 'Box, TextField',
    why: 'Search plus N selects. Duplicated FilterRow and the form kit.',
    verdict: 'done', note: 'Deleted. Pages use FilterRow with fields from the form kit.' },
  { group: 'Page parts', name: '<AdminGrid />', builtFrom: 'DataGrid + ResizeObserver',
    why: 'Mounts DataGrid only once its container has a width, or flex column headers stick at 0px.',
    verdict: 'keep' },
  { group: 'Page parts', name: '<ListPanel />', builtFrom: 'PageHeader + FilterRow + AdminGrid',
    why: 'The shape of every Medical list tab at all three levels. One component, 20+ configurations.',
    verdict: 'keep' },
  { group: 'Page parts', name: '<RowMenu />', builtFrom: 'IconButton + Menu',
    why: 'The kebab on every table row.',
    verdict: 'keep' },

  /* ------------------------------------------------------------- cells */
  { group: 'Cells', name: '<AthleteCell />', builtFrom: 'Avatar, Typography',
    why: 'Avatar, name, position. Repeats across nearly every list in the product.',
    verdict: 'keep' },
  { group: 'Cells', name: '<AthleteNameCell />', builtFrom: 'AthleteCell',
    why: 'Did the same job as AthleteCell with a different status vocabulary.',
    verdict: 'done', note: 'Now a two-line alias of AthleteCell, which took a status prop.' },
  { group: 'Cells', name: '<AvailabilityLabel />', builtFrom: 'Box, Typography',
    why: 'Dot, status, day count. The playbook already ships a version of this.',
    verdict: 'keep' },
  { group: 'Cells', name: '<AvailabilityCell />', builtFrom: 'AvailabilityLabel',
    why: 'Same thing again, for the medical roster.',
    verdict: 'done', note: 'Now an alias of AvailabilityLabel, which already handled days and sublabel.' },
  { group: 'Cells', name: '<StateChip />', builtFrom: 'Chip',
    why: 'Was three chips with three colour maps for one idea: a state, rendered in a tone.',
    verdict: 'done', note: 'StatusChip, SeverityChip and IssueStatusChip are now aliases of it.' },
  { group: 'Cells', name: '<ChipList />', builtFrom: 'Chip',
    why: 'Chips with the "+N" overflow used by squad and label columns.',
    verdict: 'keep' },
  { group: 'Cells', name: '<IssuesCell /> · <NoteCell />', builtFrom: 'Box, Typography, Chip',
    why: 'Stacked multi-line cells specific to the medical roster.',
    verdict: 'keep' },

  /* ---------------------------------------------------------- calendar */
  { group: 'Calendar', name: 'Month / Week / Day / List views', builtFrom: 'Box on CSS grid',
    why: 'MUI ships no scheduling grid. This is the largest genuinely custom thing in the prototype.',
    verdict: 'keep', note: 'MUI X Scheduler is in early preview. Worth re-checking before anyone builds this for real.' },
  { group: 'Calendar', name: '<EventBlock /> · <CompletionMark /> · <GameweekBands />', builtFrom: 'Box, Typography, Chip, icons',
    why: 'The pills, the completion mark and the gameweek bands drawn on that grid.',
    verdict: 'keep' },
  { group: 'Calendar', name: '<DatePickerMenu />', builtFrom: 'Popover + Box grid',
    why: 'The two-level day/month picker behind the calendar title.',
    verdict: 'replace', replaceWith: '@mui/x-date-pickers DateCalendar, which is this component.' },
  { group: 'Calendar', name: '<QuickCreatePopover /> · <EventPopover />', builtFrom: 'Popover, ToggleButtonGroup, Button',
    why: 'The two popovers the calendar opens on click.',
    verdict: 'keep' },

  /* ---------------------------------------------------------- analysis */
  { group: 'Analysis', name: '<BioBandField />', builtFrom: 'Popover, RadioGroup, Slider',
    why: 'Any-or-range filter with an Apply. A composition, but of nothing MUI does in one part.',
    verdict: 'keep' },
  { group: 'Analysis', name: '<DistributionRow />', builtFrom: 'Box, Tooltip',
    why: 'Percentile bands with club and athlete markers. MUI has no chart primitives in the core package.',
    verdict: 'replace', replaceWith: '@mui/x-charts, which would give axes, tooltips and legends for free.' },
]

export const customSummary = () => {
  const by = {}
  CUSTOM_CONTROLS.forEach(c => { by[c.verdict] = (by[c.verdict] || 0) + 1 })
  return by
}
