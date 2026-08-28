import { Box, MenuItem, TextField, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

/**
 * The filter row that sits above nearly every list in iP.
 * In the live app these are kitmanReactSelect — the control counted 707 times
 * on Medical Team alone. Here they are MUI Select via TextField.
 */
export default function FilterBar({ search, onSearch, searchPlaceholder = 'Search athletes', filters = [] }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.5,
        alignItems: 'center',
        py: 2,
      }}
    >
      {onSearch && (
        <TextField
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder={searchPlaceholder}
          sx={{ width: 240 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
      )}
      {filters.map(f => (
        <TextField
          key={f.label}
          select
          value={f.value}
          onChange={e => f.onChange(e.target.value)}
          label={f.label}
          sx={{ minWidth: f.width || 190 }}
        >
          {f.options.map(o => (
            <MenuItem key={o} value={o}>
              {o}
            </MenuItem>
          ))}
        </TextField>
      ))}
    </Box>
  )
}
