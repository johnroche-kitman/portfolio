import { useMemo, useRef, useState } from 'react'
import {
  Box, Checkbox, InputAdornment, Link, List, ListItemButton, ListItemText, Popover, TextField, Typography,
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import SearchIcon from '@mui/icons-material/Search'
import colors from '../theme/tokens'

/**
 * The filter control League Benchmark Reporting is built from: a filled field
 * that reads "N - first, second, …" and opens a checkbox list. Search, Select
 * all and Clear each appear only where the live control offers them, and `max`
 * mirrors the "Seasons (Max: 4)" cap.
 */
export default function MultiSelectField({
  label, options, value, onChange, search = false, selectAll = false, clear = true,
  max, width = '100%', helperText, error,
}) {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const shown = useMemo(
    () => options.filter(o => o.toLowerCase().includes(query.toLowerCase())),
    [options, query],
  )

  const atCap = max != null && value.length >= max
  const toggle = o => onChange(
    value.includes(o) ? value.filter(v => v !== o) : atCap ? value : [...value, o],
  )

  // The live control only prefixes a count once more than one value is chosen.
  const display = !value.length ? ''
    : value.length === 1 ? value[0]
    : `${value.length} - ${value.join(', ')}`

  return (
    <Box sx={{ width }}>
      <TextField
        fullWidth label={label} value={display} error={error} helperText={helperText}
        inputRef={ref} onClick={() => setOpen(true)} onKeyDown={e => e.key === 'Enter' && setOpen(true)}
        InputProps={{
          readOnly: true,
          endAdornment: <InputAdornment position="end"><ArrowDropDownIcon /></InputAdornment>,
          sx: { cursor: 'pointer', '& input': { cursor: 'pointer', textOverflow: 'ellipsis' } },
        }}
      />

      <Popover
        open={open} anchorEl={ref.current} onClose={() => { setOpen(false); setQuery('') }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{ paper: { sx: { width: ref.current?.offsetWidth, maxWidth: 420, mt: 0.5 } } }}
      >
        {search && (
          <Box sx={{ p: 1.5, pb: 0.5 }}>
            <TextField
              fullWidth autoFocus placeholder="Search" value={query} onChange={e => setQuery(e.target.value)}
              InputProps={{ endAdornment: <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} /> }}
            />
          </Box>
        )}

        {(selectAll || clear) && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, px: 2, py: 1 }}>
            {selectAll && (
              <Link component="button" underline="hover" sx={{ fontSize: 13 }}
                onClick={() => onChange(max ? options.slice(0, max) : [...options])}>
                Select All
              </Link>
            )}
            {clear && (
              <Link component="button" underline="hover" sx={{ fontSize: 13 }} onClick={() => onChange([])}>
                Clear
              </Link>
            )}
          </Box>
        )}

        <List dense sx={{ maxHeight: 240, overflowY: 'auto', pt: 0 }}>
          {shown.map(o => {
            const on = value.includes(o)
            return (
              <ListItemButton key={o} onClick={() => toggle(o)} disabled={!on && atCap} sx={{ py: 0.25 }}>
                <Checkbox size="small" checked={on} tabIndex={-1} disableRipple sx={{ mr: 0.5 }} />
                <ListItemText primary={o} primaryTypographyProps={{ variant: 'body2' }} />
              </ListItemButton>
            )
          })}
          {!shown.length && (
            <Typography variant="body2" sx={{ px: 2, py: 2, color: 'text.secondary' }}>No matches</Typography>
          )}
        </List>

        {atCap && (
          <Typography variant="caption" sx={{ display: 'block', px: 2, py: 1, color: colors.orange_300 }}>
            Maximum of {max} reached
          </Typography>
        )}
      </Popover>
    </Box>
  )
}

/** Single-value variant — Age group is a searchable list with no checkboxes. */
export function SearchSelectField({ label, options, value, onChange, error, helperText, width = '100%' }) {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const shown = options.filter(o => o.toLowerCase().includes(query.toLowerCase()))

  return (
    <Box sx={{ width }}>
      <TextField
        fullWidth label={label} value={value || ''} error={error} helperText={helperText}
        inputRef={ref} onClick={() => setOpen(true)}
        InputProps={{
          readOnly: true,
          endAdornment: <InputAdornment position="end"><ArrowDropDownIcon /></InputAdornment>,
          sx: { cursor: 'pointer', '& input': { cursor: 'pointer' } },
        }}
      />
      <Popover
        open={open} anchorEl={ref.current} onClose={() => { setOpen(false); setQuery('') }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{ paper: { sx: { width: 180, mt: 0.5 } } }}
      >
        <Box sx={{ p: 1.5, pb: 0.5 }}>
          <TextField fullWidth autoFocus placeholder="Search" value={query} onChange={e => setQuery(e.target.value)}
            InputProps={{ endAdornment: <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} /> }} />
        </Box>
        <List dense sx={{ maxHeight: 220, overflowY: 'auto' }}>
          {shown.map(o => (
            <ListItemButton key={o} selected={o === value}
              onClick={() => { onChange(o); setOpen(false); setQuery('') }}>
              <ListItemText primary={o} primaryTypographyProps={{ variant: 'body2' }} />
            </ListItemButton>
          ))}
        </List>
      </Popover>
    </Box>
  )
}
