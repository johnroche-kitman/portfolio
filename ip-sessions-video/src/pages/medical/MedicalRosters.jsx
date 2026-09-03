import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Divider, Menu, MenuItem, Tab, Tabs, Typography } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import { AdminGrid, FilterRow } from '../admin/parts'
import {
  ACTIONS_COL, AthleteNameCell, AvailabilityCell, IssuesCell, ListPanel, NoteCell, PanelProvider,
  SearchField, SelectField,
} from './panels'
import {
  DiagnosticsTab, DocumentsTab, FormsTab, MedicalFlagsTab, ModificationsTab, NotesTab, TreatmentsTab,
} from './tabs'
import DailyStatusReport from './DailyStatusReport'
import AddPanel from '../../components/AddPanel'
import { PANELS } from './AddPanels'
import { MEDICAL_ADD_ITEMS, MEDICAL_TABS, positions, squads } from '../../data/athletes'
import { medicalTeam } from '../../data/medical'

function TeamTab({ inactive = false, past = false, title = 'Team', onAdd }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [position, setPosition] = useState('')
  const [availability, setAvailability] = useState('')

  const rows = medicalTeam
    .filter(a => a.name.toLowerCase().includes(q.toLowerCase()))
    .filter(a => !position || a.position === position)
    .filter(a => !availability || a.status === availability)
    .slice(0, past ? 4 : inactive ? 3 : undefined)

  return (
    <ListPanel
      title={title} addLabel="Add" addMenu={MEDICAL_ADD_ITEMS} onAdd={onAdd}
      onRowClick={row => navigate(`/medical/athletes/${row.id}`)}
      actions={<Button variant="outlined" endIcon={<ArrowDropDownIcon />}>Download</Button>}
      filters={<>
        <SearchField value={q} onChange={setQ} label="Search athletes" />
        <SelectField label="Squad" options={squads} value="" onChange={() => {}} width={210} />
        <SelectField label="Position" options={positions} value={position} onChange={setPosition} width={210} />
        <SelectField label="Availability" options={['Available', 'Unavailable', 'Injured/Ill']}
          value={availability} onChange={setAvailability} />
        <SelectField label="Injured" options={['Injured', 'Not injured']} value="" onChange={() => {}} width={150} />
      </>}
      rowHeight={92}
      columns={[
        { field: 'name', headerName: 'Athlete', flex: 1, minWidth: 210,
          renderCell: p => <AthleteNameCell name={p.row.name} position={p.row.position} status={p.row.status} /> },
        { field: 'status', headerName: 'Availability Status', width: 180,
          renderCell: p => <AvailabilityCell status={p.row.status} days={p.row.days} /> },
        { field: 'issues', headerName: 'Open Injury/ Illness', flex: 1.4, minWidth: 260, sortable: false,
          renderCell: p => <IssuesCell issues={p.row.issues} /> },
        { field: 'note', headerName: 'Latest Note', flex: 1.4, minWidth: 240, sortable: false,
          renderCell: p => <NoteCell note={p.row.note} /> },
        ACTIONS_COL,
      ]}
      rows={rows}
    />
  )
}

export default function MedicalRosters() {
  const [tab, setTab] = useState(0)
  const [panel, setPanel] = useState(null)

  return (
    <AppShell title="Medical">
      <Box sx={{ px: 3, pt: 2.5 }}>
        <Typography variant="h5">Medical</Typography>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mt: 1 }}>
          {MEDICAL_TABS.map(t => <Tab key={t} label={t} />)}
        </Tabs>
      </Box>
      <Divider />

      <PanelProvider value={setPanel}>
      <Box sx={{ p: 3 }}>
        {tab === 0 && <TeamTab onAdd={setPanel} />}
        {tab === 1 && <DailyStatusReport />}
        {tab === 2 && <NotesTab />}
        {tab === 3 && <ModificationsTab />}
        {tab === 4 && <FormsTab />}
        {tab === 5 && <TreatmentsTab />}
        {tab === 6 && <DiagnosticsTab />}
        {tab === 7 && <MedicalFlagsTab />}
        {tab === 8 && <TeamTab past title="Past Athletes" onAdd={setPanel} />}
        {tab === 9 && <TeamTab inactive title="Inactive Athletes" onAdd={setPanel} />}
        {tab === 10 && <DocumentsTab />}
      </Box>
      </PanelProvider>

      <AddPanel open={!!panel} definition={panel ? PANELS[panel] : null}
        onClose={() => setPanel(null)} scope="team" />
    </AppShell>
  )
}
