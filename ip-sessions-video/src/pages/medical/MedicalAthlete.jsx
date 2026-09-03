import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Avatar, Box, Button, Divider, Menu, MenuItem, Paper, Tab, Table, TableBody, TableCell, TableHead,
  TableRow, Tabs, Typography,
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import AddPanel from '../../components/AddPanel'
import { PANELS } from './AddPanels'
import { DateRangeField, FieldGrid, IssueStatusChip, PanelProvider, SearchField, SelectField, useOpenPanel } from './panels'
import {
  DiagnosticsTab, DocumentsTab, FormsTab, MedicationsTab, ModificationsTab, NotesTab, TreatmentsTab,
} from './tabs'
import {
  ATHLETE_DETAIL_FIELDS, MAINTENANCE_ROWS, MEDICAL_ATHLETE_TABS, athleteHeader, medicalAthleteById,
} from '../../data/medical'
import { MEDICAL_ADD_ITEMS } from '../../data/athletes'

/** One of the three stacked tables on the Injury/ Illness tab. */
const IssueSection = ({ title, columns, rows, empty, onOpen }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="subtitle1" sx={{ mb: 1.5 }}>{title}</Typography>
    <Table size="small">
      <TableHead><TableRow>{columns.map(c => <TableCell key={c}>{c}</TableCell>)}</TableRow></TableHead>
      <TableBody>
        {rows.length ? rows.map((r, i) => (
          <TableRow key={i} hover sx={{ cursor: onOpen ? 'pointer' : 'default' }} onClick={() => onOpen?.(r)}>
            <TableCell>{r.date}</TableCell>
            <TableCell>{r.type || 'New'}</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>{r.title}</TableCell>
            <TableCell>{r.status ? <IssueStatusChip value={r.status} /> : r.resolved || ''}</TableCell>
          </TableRow>
        )) : (
          <TableRow>
            <TableCell colSpan={columns.length} sx={{ textAlign: 'center', py: 5, color: 'text.secondary', fontWeight: 700 }}>
              {empty}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </Box>
)

function InjuryIllnessTab({ athlete, onOpen, onAdd }) {
  const [q, setQ] = useState('')
  const [addEl, setAddEl] = useState(null)
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
        <Typography variant="h6">Injury/ Illness</Typography>
        <Button endIcon={<ArrowDropDownIcon />} onClick={e => setAddEl(e.currentTarget)}>Add</Button>
        <Menu anchorEl={addEl} open={!!addEl} onClose={() => setAddEl(null)}>
          {MEDICAL_ADD_ITEMS.map(m => <MenuItem key={m} sx={{ minWidth: 200 }} onClick={() => { setAddEl(null); onAdd?.(m) }}>{m}</MenuItem>)}
        </Menu>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
        <SearchField value={q} onChange={setQ} />
        <DateRangeField />
        <SelectField label="Type" options={['New', 'Recurrence', 'Chronic']} value="" onChange={() => {}} />
        <SelectField label="Status" options={['Open', 'Resolved']} value="" onChange={() => {}} />
      </Box>
      <Divider sx={{ mb: 3 }} />

      <IssueSection
        title="Open injury/ illness"
        columns={['Date of Injury/ Illness', 'Type', 'Title', 'Status']}
        rows={athlete.issues.filter(i => i.title.toLowerCase().includes(q.toLowerCase()))}
        empty="No open injury/ illness" onOpen={onOpen}
      />
      <Divider sx={{ mb: 3 }} />
      <IssueSection
        title="Chronic conditions"
        columns={['Onset Date', 'Type', 'Title', '']}
        rows={[]} empty="No chronic condition added"
      />
      <Divider sx={{ mb: 3 }} />
      <IssueSection
        title="Prior injury/illness"
        columns={['Date of Injury/ Illness', 'Type', 'Title', 'Date of resolution']}
        rows={[]} empty="No prior injury/ illness added"
      />
    </Box>
  )
}

const DetailsTab = () => (
  <Box>
    <Typography variant="h6" sx={{ mb: 2 }}>Athlete details</Typography>
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 3 }}>
      <FieldGrid fields={ATHLETE_DETAIL_FIELDS} />
    </Paper>
  </Box>
)

const MaintenanceTab = () => {
  const open = useOpenPanel()
  return (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Typography variant="h6">Maintenance</Typography>
      <Button onClick={() => open('Maintenance')}>Add maintenance</Button>
    </Box>
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300 }}>
      <Table size="small">
        <TableHead>
          <TableRow>{['Item', 'Last completed', 'Next due', 'Status'].map(c => <TableCell key={c}>{c}</TableCell>)}</TableRow>
        </TableHead>
        <TableBody>
          {MAINTENANCE_ROWS.map(r => (
            <TableRow key={r.id}>
              <TableCell>{r.item}</TableCell><TableCell>{r.last}</TableCell><TableCell>{r.next}</TableCell>
              <TableCell><IssueStatusChip value={r.status === 'Complete' ? 'Available - complete' : 'Unavailable - due'} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  </Box>
  )
}

export default function MedicalAthlete() {
  const { id } = useParams()
  const navigate = useNavigate()
  const athlete = medicalAthleteById(id)
  const [tab, setTab] = useState(0)
  const [panel, setPanel] = useState(null)

  return (
    <AppShell title="Medical">
      <Box sx={{ px: 3, pt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button variant="text" startIcon={<ChevronLeftIcon />} sx={{ ml: -1 }}
            onClick={() => navigate('/medical/rosters')}>Team</Button>
          <Button variant="outlined">Export</Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mt: 1 }}>
          <Avatar sx={{ width: 76, height: 76, bgcolor: colors.neutral_200, color: colors.neutral_400, fontSize: 24 }}>
            {athlete.name.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('')}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5">{athlete.name}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mt: 1 }}>
              {athleteHeader(athlete).map(([label, value]) => (
                <Box key={label}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{label}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{value}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mt: 2 }}>
          {MEDICAL_ATHLETE_TABS.map(t => <Tab key={t} label={t} />)}
        </Tabs>
      </Box>
      <Divider />

      <PanelProvider value={setPanel}>
      <Box sx={{ p: 3 }}>
        {tab === 0 && <InjuryIllnessTab athlete={athlete} onAdd={setPanel}
          onOpen={() => navigate(`/medical/athletes/${athlete.id}/illnesses/18808`)} />}
        {tab === 1 && <NotesTab scope="athlete" />}
        {tab === 2 && <ModificationsTab scope="athlete" />}
        {tab === 3 && <TreatmentsTab scope="athlete" />}
        {tab === 4 && <DiagnosticsTab scope="athlete" />}
        {tab === 5 && <DetailsTab />}
        {tab === 6 && <MaintenanceTab />}
        {tab === 7 && <FormsTab scope="athlete" />}
        {tab === 8 && <MedicationsTab scope="athlete" />}
        {tab === 9 && <DocumentsTab scope="athlete" />}
      </Box>
      </PanelProvider>

      <AddPanel open={!!panel} definition={panel ? PANELS[panel] : null}
        onClose={() => setPanel(null)} scope="athlete" />
    </AppShell>
  )
}
