import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Button, Divider, IconButton, Link, Menu, MenuItem, Switch, Tab, Tabs, Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import AthleteCell from '../../components/AthleteCell'
import { AdminGrid, SettingsCard } from '../admin/parts'
import { EVENT_HEADER, EVENT_TABS, eventAthletes, eventAttachments, eventStaff } from '../../data/event'

/**
 * An event's three tabs share nothing with the session or the game, despite two
 * of them carrying the same names. The session tracks participation per drill,
 * the game tracks fixture ratings, and an event tracks only whether someone
 * turned up. Its staff are listed by email rather than role, and Attachments has
 * no counterpart on either of the other two.
 */

function AthletesTab() {
  const [rows, setRows] = useState(eventAthletes)
  const allAttended = rows.length > 0 && rows.every(r => r.attended)
  const someAttended = rows.some(r => r.attended) && !allAttended

  const setAttended = (id, attended) =>
    setRows(rs => rs.map(r => (r.id === id ? { ...r, attended } : r)))

  return (
    <SettingsCard title="Athletes">
      <AdminGrid
        rows={rows} rowHeight={64} hideFooter autoRowHeight
        columns={[
          { field: 'name', headerName: 'Participants', flex: 1.4, minWidth: 240, sortable: false,
            renderCell: p => <AthleteCell athlete={p.row} size={32} /> },
          // The header carries a master switch, so it needs its own renderer.
          { field: 'attended', headerName: 'Attended', width: 190, sortable: false,
            renderHeader: () => (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>Attended</Typography>
                <Switch
                  size="small" checked={allAttended}
                  // indeterminate is not a Switch state, so a partial selection
                  // reads as off with the tooltip carrying the detail.
                  onChange={e => setRows(rs => rs.map(r => ({ ...r, attended: e.target.checked })))}
                  inputProps={{ 'aria-label': someAttended ? 'Mark all attended, some are marked' : 'Mark all attended' }}
                />
              </Box>
            ),
            renderCell: p => (
              <Switch checked={p.row.attended}
                onChange={e => setAttended(p.row.id, e.target.checked)}
                inputProps={{ 'aria-label': `${p.row.name} attended` }} />
            ) },
          { field: 'squads', headerName: 'Squads', flex: 1.2, minWidth: 220, sortable: false,
            renderCell: p => (
              <Box sx={{ py: 1 }}>
                {p.row.squads.map(s => (
                  <Typography key={s} variant="body2" sx={{ display: 'block' }}>{s}</Typography>
                ))}
              </Box>
            ) },
        ]}
      />
    </SettingsCard>
  )
}

const StaffTab = () => (
  <SettingsCard title="Staff">
    <AdminGrid
      rows={eventStaff} rowHeight={56} hideFooter
      columns={[
        { field: 'name', headerName: 'Participants', flex: 1, minWidth: 260, sortable: false },
        { field: 'email', headerName: 'Email', flex: 1.4, minWidth: 280, sortable: false },
      ]}
    />
  </SettingsCard>
)

const AttachmentsTab = () => (
  <SettingsCard>
    <AdminGrid
      rows={eventAttachments} rowHeight={56} hideFooter
      columns={[
        { field: 'title', headerName: 'Title', flex: 1, minWidth: 200 },
        { field: 'fileName', headerName: 'File Name', flex: 1, minWidth: 200 },
        { field: 'category', headerName: 'Category', width: 180 },
        { field: 'date', headerName: 'Date of Document', width: 190 },
      ]}
    />
  </SettingsCard>
)

export default function EventDetail() {
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)
  const [menuEl, setMenuEl] = useState(null)

  return (
    <AppShell title="Schedule" listLabel="Event list">
      <Box sx={{ px: 3, pt: 2.5 }}>
        <Button variant="text" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}
          sx={{ ml: -1, mb: 1 }}>
          Back
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h5">{EVENT_HEADER.title}</Typography>
            <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap', mt: 0.5, alignItems: 'center' }}>
              {[['Squad', EVENT_HEADER.squad], ['Date', EVENT_HEADER.date], ['Type', EVENT_HEADER.type]]
                .map(([label, value]) => (
                  <Typography key={label} variant="body2">
                    <Box component="span" sx={{ fontWeight: 700 }}>{label}: </Box>
                    <Box component="span" sx={{ color: 'text.secondary' }}>{value}</Box>
                  </Typography>
                ))}
              {/* Location is a link through to the venue, unlike the other meta. */}
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <Box component="span" sx={{ fontWeight: 700 }}>Location: </Box>
                <Link href="#" underline="always" sx={{ ml: 0.5, display: 'flex', alignItems: 'center' }}>
                  {EVENT_HEADER.location}
                  <ChevronRightIcon sx={{ fontSize: 16 }} />
                </Link>
              </Typography>
            </Box>
          </Box>

          {/* No Complete toggle here: an event is not something you mark done. */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button variant="outlined" onClick={() => navigate('/events/1/edit?type=Event')}>Edit details</Button>
            <IconButton size="small" aria-label="Event actions" onClick={e => setMenuEl(e.currentTarget)}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={menuEl} open={!!menuEl} onClose={() => setMenuEl(null)}>
              <MenuItem sx={{ minWidth: 160 }} onClick={() => setMenuEl(null)}>Delete</MenuItem>
            </Menu>
          </Box>
        </Box>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mt: 2 }}>
          {EVENT_TABS.map(t => <Tab key={t} label={t} />)}
        </Tabs>
      </Box>
      <Divider />

      <Box sx={{ p: 3, bgcolor: colors.white }}>
        {tab === 0 && <AthletesTab />}
        {tab === 1 && <StaffTab />}
        {tab === 2 && <AttachmentsTab />}
      </Box>
    </AppShell>
  )
}
