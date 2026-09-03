import { Avatar, Box, Button, Divider, MenuItem, Paper, TextField, Typography } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import { LANGUAGES } from '../../data/admin'

export default function UserProfile() {
  return (
    <AppShell title="Your profile">
      <Box sx={{ maxWidth: 900, px: 3, py: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>John Roche Test</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>jrochetest</Typography>

        <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 3, mb: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ width: 148, height: 148, bgcolor: colors.neutral_200, color: colors.neutral_400 }}>
                <PersonIcon sx={{ fontSize: 90 }} />
              </Avatar>
              <Button variant="outlined" sx={{ mt: 2 }}>Upload photo</Button>
            </Box>

            <Box sx={{ flex: 1, minWidth: 280, display: 'grid', gap: 2.5 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                <TextField fullWidth label="First Name" defaultValue="John" />
                <TextField fullWidth label="Last Name" defaultValue="Roche Test" />
              </Box>
              <TextField fullWidth label="Email" type="email" defaultValue="jroche+testkfc@kitmanlabs.com" />
              <TextField select fullWidth label="Language" defaultValue={LANGUAGES[0]}>
                {LANGUAGES.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
              </TextField>
            </Box>
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 3 }}>
          <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 700, mb: 2 }}>Update your password</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
            <TextField fullWidth label="Current Password" type="password" autoComplete="current-password" />
            <TextField fullWidth label="New Password" type="password" autoComplete="new-password" />
            <TextField fullWidth label="Confirm New Password" type="password" autoComplete="new-password" />
          </Box>
        </Paper>

        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button>Update Profile</Button>
        </Box>
      </Box>
    </AppShell>
  )
}
