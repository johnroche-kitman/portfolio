import { Avatar, Box, Typography } from '@mui/material'
import colors from '../theme/tokens'
import { AVAILABILITY, initialsOf, photoUrl } from '../data/athletes'

const DOT = {
  [AVAILABILITY.AVAILABLE]: colors.green_100,
  [AVAILABILITY.UNAVAILABLE]: colors.red_100,
  [AVAILABILITY.MODIFIED]: colors.orange_100,
}

/**
 * Avatar with availability dot, name and position. The one athlete cell —
 * Medical passes its own status vocabulary through `status`, which is the only
 * thing that used to justify a second component.
 */
export default function AthleteCell({ athlete, onClick, status, size = 34 }) {
  const dot = DOT[status || athlete.availability] || colors.grey_150
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        minWidth: 0,
        // Inherit rather than force 'default': inside a clickable table row the
        // cell would otherwise kill the row's hand cursor exactly where the
        // reader is aiming — at the athlete's name.
        cursor: onClick ? 'pointer' : 'inherit',
      }}
    >
      <Box sx={{ position: 'relative', flexShrink: 0 }}>
        {/* MUI falls back to the children when src is absent or fails to load,
            so an athlete with no headshot still gets their initials. */}
        <Avatar src={photoUrl(athlete)} alt=""
          sx={{ width: size, height: size, bgcolor: colors.neutral_300, color: colors.grey_100, fontSize: 13 }}>
          {initialsOf(athlete.name)}
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
            bgcolor: dot,
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
        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
          {athlete.position}
        </Typography>
      </Box>
    </Box>
  )
}
