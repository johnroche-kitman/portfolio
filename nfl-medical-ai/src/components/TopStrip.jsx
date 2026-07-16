import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Icon from './Icon'

export default function TopStrip({ breadcrumb = 'Medical' }) {
  return (
    <Box
      sx={{
        height: 54,
        px: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--divider)',
        backgroundColor: 'var(--white)',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        flexShrink: 0,
      }}
    >
      <Typography variant="body1" sx={{ color: 'var(--grey-100)' }}>
        {breadcrumb}
      </Typography>
      <Box display="flex" alignItems="center" gap={1.5}>
        <Box display="flex" alignItems="center" gap={0.5} sx={{ cursor: 'pointer' }}>
          <Typography variant="body1" fontWeight={600}>
            Active roster
          </Typography>
          <Icon name="expandMore" fontSize="small" sx={{ color: 'var(--grey-100)' }} />
        </Box>
        <Avatar sx={{ width: 32, height: 32 }} src={`${import.meta.env.BASE_URL}staff-avatar.svg`} />
      </Box>
    </Box>
  )
}
