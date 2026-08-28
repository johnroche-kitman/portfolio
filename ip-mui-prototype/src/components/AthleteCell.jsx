import { Avatar, Box, Typography } from '@mui/material'
import colors from '../theme/tokens'
import { AVAILABILITY } from '../data/athletes'

const DOT = {
  [AVAILABILITY.AVAILABLE]: colors.green_100,
  [AVAILABILITY.UNAVAILABLE]: colors.red_100,
  [AVAILABILITY.MODIFIED]: colors.orange_100,
}

const initials = name =>
  name
    .replace(/\(.*?\)/g, '')
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

/** Avatar with availability dot, name and position. Repeats across most list views. */
export default function AthleteCell({ athlete, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        minWidth: 0,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <Box sx={{ position: 'relative', flexShrink: 0 }}>
        <Avatar sx={{ width: 34, height: 34, bgcolor: colors.neutral_300, color: colors.grey_100, fontSize: 13 }}>
          {initials(athlete.name)}
        </Avatar>
        <Box
          sx={{
            position: 'absolute',
            right: -1,
            bottom: -1,
            width: 10,
            height: 10,
            borderRadius: '50%',
            border: `2px solid ${colors.white}`,
            bgcolor: DOT[athlete.availability] || colors.grey_150,
          }}
        />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {athlete.name}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {athlete.position}
        </Typography>
      </Box>
    </Box>
  )
}
