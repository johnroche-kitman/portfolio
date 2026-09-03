import { Box, Typography } from '@mui/material'
import colors from '../theme/tokens'
import { AVAILABILITY } from '../data/athletes'

const DOT = {
  [AVAILABILITY.AVAILABLE]: colors.green_100,
  [AVAILABILITY.UNAVAILABLE]: colors.red_100,
  [AVAILABILITY.MODIFIED]: colors.orange_100,
}

/**
 * Mirrors playbook AvailabilityLabel. In the live app this is a bespoke
 * component; here it is MUI primitives on theme tokens.
 */
export default function AvailabilityLabel({ status, days, sublabel, size = 'medium' }) {
  if (!status) return null
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          component="span"
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            flexShrink: 0,
            bgcolor: DOT[status] || colors.grey_150,
          }}
        />
        <Typography variant="body2" sx={{ fontSize: size === 'small' ? 13 : 14 }}>
          {status}
        </Typography>
      </Box>
      {sublabel && (
        <Typography variant="caption" sx={{ color: 'text.secondary', pl: 2 }}>
          {sublabel}
        </Typography>
      )}
      {typeof days === 'number' && (
        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', pl: 2 }}>
          {days} days
        </Typography>
      )}
    </Box>
  )
}
