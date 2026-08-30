import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Divider, Menu, MenuItem, Tab, Tabs, Typography } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import { AdminGrid, FilterRow } from '../admin/parts'
import {
  ACTIONS_COL, AthleteNameCell, AvailabilityCell, IssuesCell, ListPanel, NoteCell, SearchField, SelectField,
} from './panels'
import {
  DiagnosticsTab, DocumentsTab, FormsTab, MedicalFlagsTab, ModificationsTab, NotesTab, TreatmentsTab,
} from './tabs'
import { MEDICAL_ADD_ITEMS, MEDICAL_TABS, positions, squads } from '../../data/athletes'
import { AVAILABILITY_STATUSES, dailyStatus, medicalTeam } from '../../data/medical'

function TeamTab({ inactive = false, past = false, title = 'Team' }) {
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
      title={title} addLabel="Add" addMenu={MEDICAL_ADD_ITEMS}
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

function DailyStatusTab() {
  const [q, setQ] = useState('')
  const rows = dailyStatus.filter(r => r.athlete.toLowerCase().includes(q.toLowerCase()))
  return (
    <ListPanel
      title="Daily Status Report"
      actions={<Button variant="outlined" endIcon={<ArrowDropDownIcon />}>Download</Button>}
      filters={<>
        <SearchField value={q} onChange={setQ} label="Search athletes" />
        <SelectField label="Squad" options={squads} value="" onChange={() => {}} width={210} />
        <SelectField label="Availability status" options={AVAILABILITY_STATUSES} value="" onChange={() => {}} width={230} />
      </>}
      columns={[
        { field: 'athlete', headerName: 'Athlete', flex: 1, minWidth: 190 },
        { field: 'status', headerName: 'Availability status', width: 170 },
        { field: 'issue', headerName: 'Open Injury/ Illness', flex: 1.2, minWidth: 220 },
        { field: 'note', headerName: 'Note', flex: 1, minWidth: 170 },
        { field: 'modification', headerName: 'Modification/Absence', width: 190 },
        { field: 'modificationDetail', headerName: 'Modification/Absence Details', width: 230 },
        { field: 'updatedBy', headerName: 'Updated by', width: 160 },
      ]}
      rows={rows}
    />
  )
}

export default function MedicalRosters() {
  const [tab, setTab] = useState(0)

  return (
    <AppShell title="Medical">
      <Box sx={{ px: 3, pt: 2.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Medical</Typography>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mt: 1 }}>
          {MEDICAL_TABS.map(t => <Tab key={t} label={t} />)}
        </Tabs>
      </Box>
      <Divider />

      <Box sx={{ p: 3 }}>
        {tab === 0 && <TeamTab />}
        {tab === 1 && <DailyStatusTab />}
        {tab === 2 && <NotesTab />}
        {tab === 3 && <ModificationsTab />}
        {tab === 4 && <FormsTab />}
        {tab === 5 && <TreatmentsTab />}
        {tab === 6 && <DiagnosticsTab />}
        {tab === 7 && <MedicalFlagsTab />}
        {tab === 8 && <TeamTab past title="Past Athletes" />}
        {tab === 9 && <TeamTab inactive title="Inactive Athletes" />}
        {tab === 10 && <DocumentsTab />}
      </Box>
    </AppShell>
  )
}
