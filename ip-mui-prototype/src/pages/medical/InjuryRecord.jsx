import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Avatar, Box, Button, Divider, Menu, MenuItem, Tab, Tabs, Typography,
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import AddPanel from '../../components/AddPanel'
import { PANELS } from './AddPanels'
import { ACTIONS_COL, DetailCard, FieldGrid, ListPanel, PanelProvider, SearchField, SelectField } from './panels'
import { CardAction } from '../admin/parts'
import {
  DiagnosticsTab, DocumentsTab, MedicationsTab, ModificationsTab, NotesTab, TreatmentsTab,
} from './tabs'
import { INJURY_TABS, REHAB_ROWS, injuryById } from '../../data/medical'
import { MEDICAL_ADD_ITEMS } from '../../data/athletes'

function Overview({ injury }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.6fr 1fr' }, gap: 3 }}>
      <Box>
        <DetailCard title="Illness details" action={<CardAction>Edit</CardAction>}>
          <FieldGrid columns={1} fields={[['Type', injury.details.Type]]} />
          <Box sx={{ mt: 1.5 }}>
            <FieldGrid columns={2}
              fields={[['Added on', injury.details['Added on']], ['Added by', injury.details['Added by']]]} />
          </Box>
        </DetailCard>

        <DetailCard title="Primary Pathology" action={<CardAction>Edit</CardAction>}>
          <FieldGrid fields={injury.pathology} />
        </DetailCard>
      </Box>

      <Box>
        <DetailCard title="Availability history" action={<CardAction>Add</CardAction>}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="subtitle1">Current status</Typography>
            <CardAction>Edit</CardAction>
          </Box>
          {injury.availability.map(a => (
            <Box key={a.n} sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{a.n}</Typography>
              <Box>
                <Typography variant="body2">
                  <Box component="span" sx={{ fontWeight: 700 }}>{a.range}: </Box>{a.status}
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, mt: 0.5 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>Updated by: </Box>{a.by}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>Duration: </Box>{a.duration}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Availability summary</Typography>
          <FieldGrid columns={2} fields={injury.summary} />
        </DetailCard>

        <DetailCard title="Associated issues" action={<CardAction>Add</CardAction>}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>No associated issues.</Typography>
        </DetailCard>

        <DetailCard title="Linked Chronic condition" action={<CardAction>Add</CardAction>}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>No chronic injury/illness linked.</Typography>
        </DetailCard>
      </Box>
    </Box>
  )
}

function RehabTab() {
  const [q, setQ] = useState('')
  const rows = REHAB_ROWS.filter(r => r.session.toLowerCase().includes(q.toLowerCase()))
  return (
    <ListPanel
      title="Rehab" addLabel="Add rehab session" addPanel="Rehab session"
      filters={<>
        <SearchField value={q} onChange={setQ} />
        <SelectField label="Phase" options={['Phase 1 — Protect', 'Phase 2 — Restore', 'Phase 3 — Return']}
          value="" onChange={() => {}} width={220} />
      </>}
      columns={[
        { field: 'date', headerName: 'Date', width: 130 },
        { field: 'phase', headerName: 'Phase', width: 200 },
        { field: 'session', headerName: 'Session', flex: 1.4, minWidth: 220 },
        { field: 'by', headerName: 'Led by', width: 180 },
        { field: 'status', headerName: 'Status', width: 140 },
        ACTIONS_COL,
      ]}
      rows={rows} empty="No rehab sessions recorded yet"
    />
  )
}

export default function InjuryRecord() {
  const { id } = useParams()
  const navigate = useNavigate()
  const injury = injuryById(id)
  const [tab, setTab] = useState(0)
  const [panel, setPanel] = useState(null)
  const [addEl, setAddEl] = useState(null)

  return (
    <AppShell title="Medical">
      <Box sx={{ px: 3, pt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button variant="text" startIcon={<ChevronLeftIcon />} sx={{ ml: -1 }}
            onClick={() => navigate(`/medical/athletes/${injury.athleteId}`)}>Player overview</Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button endIcon={<ArrowDropDownIcon />} onClick={e => setAddEl(e.currentTarget)}>Add</Button>
            <Button variant="outlined">Export</Button>
          </Box>
          <Menu anchorEl={addEl} open={!!addEl} onClose={() => setAddEl(null)}>
            {MEDICAL_ADD_ITEMS.map(m => (
              <MenuItem key={m} sx={{ minWidth: 200 }} onClick={() => { setAddEl(null); setPanel(m) }}>{m}</MenuItem>
            ))}
          </Menu>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: colors.neutral_200, color: colors.neutral_400, fontSize: 14 }}>
            AO
          </Avatar>
          <Box>
            <Typography variant="h5">{injury.athlete} - {injury.title}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{injury.dateLabel}</Typography>
          </Box>
        </Box>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mt: 2 }}>
          {INJURY_TABS.map(t => <Tab key={t} label={t} />)}
        </Tabs>
      </Box>
      <Divider />

      <PanelProvider value={setPanel}>
      <Box sx={{ p: 3 }}>
        {tab === 0 && <Overview injury={injury} />}
        {tab === 1 && <RehabTab />}
        {tab === 2 && <NotesTab scope="injury" />}
        {tab === 3 && <ModificationsTab scope="injury" />}
        {tab === 4 && <TreatmentsTab scope="injury" />}
        {tab === 5 && <DiagnosticsTab scope="injury" />}
        {tab === 6 && <MedicationsTab scope="injury" />}
        {tab === 7 && <DocumentsTab scope="injury" />}
      </Box>
      </PanelProvider>

      <AddPanel open={!!panel} definition={panel ? PANELS[panel] : null}
        onClose={() => setPanel(null)} scope="injury" />
    </AppShell>
  )
}
