import { useState } from 'react'
import { Box, IconButton, Popover, Typography } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import colors from '../../theme/tokens'

const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const TODAY = 28

/**
 * Opened from the date title in the calendar toolbar.
 * Two levels, as in the live app: a date grid, and a month grid behind the
 * month/year label's own dropdown.
 */
export default function DatePickerMenu({ anchorEl, onClose, onPick }) {
  const [mode, setMode] = useState('days')
  const [month, setMonth] = useState(7) // August

  const close = () => { setMode('days'); onClose() }

  // 6 x 7 grid; 28 Aug 2026 falls on a Friday, so the month starts on Saturday.
  const cells = Array.from({ length: 42 }, (_, i) => i - 3)

  return (
    <Popover
      open={!!anchorEl} anchorEl={anchorEl} onClose={close}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      slotProps={{ paper: { sx: { width: 306, p: 2 } } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Box role="button" tabIndex={0} onClick={() => setMode(m => (m === 'days' ? 'months' : 'days'))}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', borderRadius: 1, px: 0.5,
            '&:hover': { bgcolor: colors.neutral_100 } }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>{MONTHS[month]}ust 2026</Typography>
          <ArrowDropDownIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
        </Box>
        {mode === 'days' && (
          <Box>
            <IconButton size="small" onClick={() => setMonth(m => Math.max(0, m - 1))} aria-label="Previous month">
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => setMonth(m => Math.min(11, m + 1))} aria-label="Next month">
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>

      {mode === 'days' ? (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 0.5 }}>
            {DOW.map((d, i) => (
              <Typography key={i} variant="caption" align="center" sx={{ color: 'text.secondary' }}>{d}</Typography>
            ))}
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: 0.25 }}>
            {cells.map(n => {
              const inMonth = n >= 1 && n <= 31
              const isToday = inMonth && n === TODAY
              const label = inMonth ? n : n < 1 ? 31 + n - 3 : n - 31
              return (
                <Box key={n} onClick={() => { if (inMonth) { onPick?.(n); close() } }}
                  sx={{
                    height: 34, display: 'grid', placeItems: 'center', borderRadius: '50%',
                    cursor: inMonth ? 'pointer' : 'default',
                    bgcolor: isToday ? colors.grey_400 : 'transparent',
                    color: isToday ? colors.white : inMonth ? 'text.primary' : colors.grey_150,
                    '&:hover': { bgcolor: isToday ? colors.grey_400 : inMonth ? colors.neutral_200 : 'transparent' },
                  }}>
                  <Typography variant="body2" sx={{ fontWeight: isToday ? 700 : 400, color: 'inherit' }}>
                    {label}
                  </Typography>
                </Box>
              )
            })}
          </Box>
        </>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, py: 1 }}>
          {MONTHS.map((m, i) => (
            <Box key={m} onClick={() => { setMonth(i); setMode('days') }}
              sx={{
                py: 1.25, borderRadius: 5, textAlign: 'center', cursor: 'pointer',
                bgcolor: i === month ? colors.grey_400 : 'transparent',
                color: i === month ? colors.white : 'text.primary',
                '&:hover': { bgcolor: i === month ? colors.grey_400 : colors.neutral_200 },
              }}>
              <Typography variant="body2" sx={{ color: 'inherit', fontWeight: i === month ? 700 : 400 }}>{m}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Popover>
  )
}
