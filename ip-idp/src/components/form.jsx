import {
  Autocomplete, Box, Button, Checkbox, Chip, InputAdornment, MenuItem,
  Paper as MuiPaper, TextField, Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import UploadIcon from '@mui/icons-material/CloudUploadOutlined'
import colors from '../theme/tokens'
import AthleteCell from './AthleteCell'
import { athletes as ALL_ATHLETES } from '../data/athletes'

/**
 * The form kit. Every field in the prototype comes from here so that a change to
 * how a select behaves is one edit, not one per page.
 *
 * These are thin: each is a MUI TextField with the arguments the theme cannot
 * supply on its own. Nothing here reimplements a control MUI already has.
 */

/**
 * `fullWidth` is explicit because TextField passes fullWidth={false} down to its
 * FormControl, overriding the theme default — without it a select collapses to
 * the width of its value.
 */
export const SelectField = ({ label, options = [], ...rest }) => (
  <TextField select fullWidth label={label} defaultValue="" {...rest}>
    {options.map(o => (typeof o === 'string'
      ? <MenuItem key={o} value={o}>{o}</MenuItem>
      : <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}
  </TextField>
)

export const TextInput = props => <TextField fullWidth {...props} />

export const DateInput = props => (
  <TextField fullWidth type="date" InputLabelProps={{ shrink: true }} {...props} />
)

export const NumberInput = ({ unit, ...props }) => (
  <TextField fullWidth type="number" {...props}
    InputProps={{ endAdornment: unit ? <InputAdornment position="end">{unit}</InputAdornment> : undefined,
      ...props.InputProps }} />
)

export const MoneyInput = ({ symbol = '£', ...props }) => (
  <TextField fullWidth {...props}
    InputProps={{ startAdornment: <InputAdornment position="start">{symbol}</InputAdornment>, ...props.InputProps }} />
)

/** Search input — the same control in every filter row and every panel. */
export const SearchInput = ({ label = 'Search', ...props }) => (
  <TextField label={label} {...props}
    InputProps={{ endAdornment: <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />, ...props.InputProps }} />
)

/** The DD/MM/YYYY – DD/MM/YYYY pair used across Medical and Administration. */
export const DateRangeInput = ({ width = 165 }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <DateInput label="From" sx={{ width }} />
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>–</Typography>
    <DateInput label="To" sx={{ width }} />
  </Box>
)

/** Field row on a grid — the layout every panel and form section uses. */
export const FieldRow = ({ cols = 2, children }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: `repeat(${cols}, 1fr)` }, gap: 2.5 }}>
    {children}
  </Box>
)

/** Athlete picker, single or multiple, with the availability-aware row. */
export const AthleteSelect = ({ multiple, label, options = ALL_ATHLETES, value, onChange }) => (
  <Autocomplete
    multiple={multiple} options={options} value={value} onChange={onChange && ((_, v) => onChange(v))}
    getOptionLabel={o => o.name} disableCloseOnSelect={multiple}
    isOptionEqualToValue={(o, v) => o.id === v.id}
    renderOption={(props, option, { selected }) => (
      <Box component="li" {...props} key={option.id}>
        {multiple && <Checkbox size="small" checked={selected} sx={{ mr: 1 }} />}
        <AthleteCell athlete={option} />
      </Box>
    )}
    renderTags={(v, getTagProps) =>
      v.map((o, i) => <Chip size="small" label={o.name} {...getTagProps({ index: i })} key={o.id} />)}
    renderInput={p => <TextField {...p} fullWidth label={label || (multiple ? 'Athletes' : 'Athlete')} />}
  />
)

/** File dropzone — one definition, used by the event editor and every panel. */
export const FileDrop = ({ hint = 'Drag & drop your files or' }) => (
  <Box sx={{ border: `1px dashed ${colors.neutral_400}`, borderRadius: 1, py: 4, textAlign: 'center',
    bgcolor: colors.neutral_100, cursor: 'pointer' }}>
    <UploadIcon sx={{ color: 'text.secondary' }} />
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {hint} <Box component="span" sx={{ textDecoration: 'underline' }}>browse</Box>
    </Typography>
  </Box>
)

/**
 * Multi-select. This is MUI's Autocomplete, not a bespoke dropdown: typing
 * filters in the input itself, `limitTags` gives the "+N" overflow and
 * `getOptionDisabled` enforces a cap. The only addition is a Select all / Clear
 * footer, via Autocomplete's own PaperComponent slot.
 */
export const MultiSelect = ({
  label, options, value, onChange, max, selectAll = false, limitTags = 2, sx, ...rest
}) => {
  const atCap = max != null && value.length >= max

  const Paper = paperProps => (
    <MuiPaper {...paperProps}>
      {(selectAll || value.length > 0) && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, px: 2, py: 1 }}
          onMouseDown={e => e.preventDefault()}>
          {selectAll && (
            <Button size="small" variant="text" onClick={() => onChange(max ? options.slice(0, max) : options)}>
              Select all
            </Button>
          )}
          <Button size="small" variant="text" onClick={() => onChange([])}>Clear</Button>
        </Box>
      )}
      {paperProps.children}
    </MuiPaper>
  )

  return (
    <Autocomplete
      multiple disableCloseOnSelect limitTags={limitTags} options={options} value={value}
      onChange={(_, v) => onChange(v)} getOptionDisabled={o => atCap && !value.includes(o)}
      PaperComponent={Paper} sx={sx}
      renderOption={(props, option, { selected }) => (
        <Box component="li" {...props} key={option}>
          <Checkbox size="small" checked={selected} sx={{ mr: 1 }} />
          {option}
        </Box>
      )}
      renderTags={(v, getTagProps) =>
        v.map((o, i) => <Chip size="small" label={o} {...getTagProps({ index: i })} key={o} />)}
      renderInput={p => (
        <TextField {...p} fullWidth label={label}
          helperText={atCap ? `Maximum of ${max} selected` : rest.helperText}
          error={rest.error} />
      )}
    />
  )
}

/** Single-select with type-ahead — again Autocomplete, not a Select plus a search box. */
export const SearchSelect = ({ label, options, value, onChange, error, helperText, sx }) => (
  <Autocomplete
    options={options} value={value || null} onChange={(_, v) => onChange(v || '')} sx={sx}
    renderInput={p => <TextField {...p} fullWidth label={label} error={error} helperText={helperText} />}
  />
)
