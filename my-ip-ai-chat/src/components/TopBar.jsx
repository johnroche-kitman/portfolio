import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ButtonBase from '@mui/material/ButtonBase'
import Icon from './Icon'

export default function TopBar() {
  return (
    <Box
      sx={{
        height: 54,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        borderBottom: '1px solid var(--divider)',
        backgroundColor: 'var(--white)',
      }}
    >
      <Typography variant="body1" sx={{ color: 'var(--grey-100)' }}>
        My iP
      </Typography>

      <Box display="flex" alignItems="center" gap={2}>
        <ButtonBase sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, borderRadius: 1 }}>
          <Typography variant="body1" sx={{ color: 'var(--color-primary)' }}>
            Primary Squad
          </Typography>
          <Icon name="arrowDropDown" fontSize="small" sx={{ color: 'var(--color-primary)' }} />
        </ButtonBase>
        <Box
          component="img"
          src={`${import.meta.env.BASE_URL}user-avatar.png`}
          alt="User avatar"
          sx={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
        />
      </Box>
    </Box>
  )
}
