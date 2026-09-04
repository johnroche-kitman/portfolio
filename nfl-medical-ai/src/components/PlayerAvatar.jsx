import Avatar from '@mui/material/Avatar'

function initialsFor(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// Photo-or-initials avatar for an athlete, reused across the squad table and injury overview header.
export default function PlayerAvatar({ athlete, size = 40 }) {
  if (!athlete) return <Avatar sx={{ width: size, height: size }} />
  return (
    <Avatar
      src={athlete.photoUrl}
      alt={athlete.name}
      sx={{
        width: size,
        height: size,
        backgroundColor: 'var(--color-primary)',
        fontSize: size / 2.4,
        fontWeight: 600,
      }}
    >
      {initialsFor(athlete.name)}
    </Avatar>
  )
}
