import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Button, Checkbox, FormControlLabel, Link, MenuItem, Paper, TextField, Typography,
} from '@mui/material'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import { SectionLabel } from './parts'
import { LANGUAGES, PERMISSION_GROUPS, USER_GROUPS, staffUsers } from '../../data/admin'

/** Serves both /users/new and /users/:id/edit — the live pages are the same form. */
export default function UserForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const existing = id ? staffUsers.find(u => String(u.id) === String(id)) : null
  const [checked, setChecked] = useState(() => new Set())

  const toggle = key => setChecked(prev => {
    const next = new Set(prev)
    if (next.has(key)) next.delete(key); else next.add(key)
    return next
  })

  const setGroup = (group, on) => setChecked(prev => {
    const next = new Set(prev)
    group.items.forEach(i => (on ? next.add(`${group.name}:${i}`) : next.delete(`${group.name}:${i}`)))
    return next
  })

  return (
    <AppShell title={existing ? 'Manage Staff Users' : 'Add New User'} fullHeight>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 3, flexShrink: 0, bgcolor: colors.white,
        borderBottom: `1px solid ${colors.neutral_300}`, px: 3, py: 1.5,
        display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
          {existing ? existing.name : 'Add New User'}
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/users')}>Cancel</Button>
        <Button onClick={() => navigate('/users')}>{existing ? 'Save' : 'Create'}</Button>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, pb: 6 }}>
          <SectionLabel>User Details</SectionLabel>
          <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 3, mb: 2.5 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
              <TextField fullWidth label="First Name" defaultValue={existing?.name.split(' ')[0] || ''} />
              <TextField fullWidth label="Last Name" defaultValue={existing?.name.split(' ').slice(1).join(' ') || ''} />
              <TextField fullWidth label="Email" type="email" defaultValue={existing?.email || ''} />
              <TextField fullWidth label="Date of birth" type="date" InputLabelProps={{ shrink: true }} />
              <TextField select fullWidth label="Group" defaultValue={existing?.role || USER_GROUPS[0]}>
                {USER_GROUPS.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
              </TextField>
              <TextField select fullWidth label="Language" defaultValue={LANGUAGES[0]}>
                {LANGUAGES.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
              </TextField>
            </Box>
          </Paper>

          <SectionLabel>Permissions</SectionLabel>
          <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 3 }}>
            <Box sx={{ columnCount: { xs: 1, md: 2, lg: 3 }, columnGap: 32 }}>
              {PERMISSION_GROUPS.map(g => {
                const on = g.items.filter(i => checked.has(`${g.name}:${i}`)).length
                return (
                  <Box key={g.name} sx={{ breakInside: 'avoid', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{g.name}</Typography>
                      <Link component="button" underline="hover" sx={{ fontSize: 12 }}
                        onClick={() => setGroup(g, on !== g.items.length)}>
                        {on === g.items.length ? 'Clear' : 'Select all'}
                      </Link>
                    </Box>
                    {g.items.map(i => (
                      <FormControlLabel
                        key={i} sx={{ display: 'flex', ml: 0 }} label={i}
                        componentsProps={{ typography: { variant: 'body2' } }}
                        control={<Checkbox checked={checked.has(`${g.name}:${i}`)} onChange={() => toggle(`${g.name}:${i}`)} />}
                      />
                    ))}
                  </Box>
                )
              })}
            </Box>
          </Paper>
        </Box>
      </Box>
    </AppShell>
  )
}
