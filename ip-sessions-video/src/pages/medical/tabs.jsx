import { useState } from 'react'
import { Button, MenuItem, TextField, Typography } from '@mui/material'
import {
  ACTIONS_COL, DateRangeField, ListPanel, SearchField, SelectField, SeverityChip,
} from './panels'
import {
  DIAGNOSTIC_TYPES, DOC_CATEGORIES, DOC_SOURCES, FILE_TYPES, FORM_TYPES, MEDICATION_ROUTES,
  MODIFICATION_TYPES, NOTE_TYPES, SEVERITIES, TREATMENT_TYPES, medicalDiagnostics, medicalDocuments,
  medicalFlags, medicalForms, medicalMedications, medicalModifications, medicalNotes, medicalTreatments,
} from '../../data/medical'
import { squads } from '../../data/athletes'
import { useOpenPanel } from './panels'

const AllergyAction = () => {
  const open = useOpenPanel()
  return <Button variant="outlined" onClick={() => open('Allergy')}>Add allergy</Button>
}

/**
 * One definition per record type, reused wherever that record appears: on the
 * team roster, on an athlete, and inside an injury. `scope` drops the Athlete
 * column when the page already names the athlete.
 */
const AUTHORS = ['ST Test', 'John Roche Test', 'Pablo de Miguel']

const withAthlete = (scope, col) => (scope === 'team' ? [col] : [])

export function NotesTab({ scope = 'team' }) {
  const [q, setQ] = useState(''); const [type, setType] = useState(''); const [author, setAuthor] = useState('')
  const rows = medicalNotes
    .filter(n => (n.title + n.body).toLowerCase().includes(q.toLowerCase()))
    .filter(n => !type || n.type === type)
    .filter(n => !author || n.author === author)

  return (
    <ListPanel
      title="Notes" addLabel="Add note" addPanel="Note"
      actions={<Button variant="outlined">View archive</Button>}
      filters={<>
        <SearchField value={q} onChange={setQ} />
        {scope === 'team' && <SelectField label="Squad" options={squads} value="" onChange={() => {}} width={200} />}
        <SelectField label="Author" options={AUTHORS} value={author} onChange={setAuthor} />
        <SelectField label="Note type" options={NOTE_TYPES} value={type} onChange={setType} />
        <DateRangeField />
      </>}
      columns={[
        ...withAthlete(scope, { field: 'athlete', headerName: 'Athlete', flex: 1, minWidth: 180 }),
        { field: 'date', headerName: 'Date', width: 130 },
        { field: 'type', headerName: 'Note type', width: 150 },
        { field: 'title', headerName: 'Title', flex: 1, minWidth: 180 },
        { field: 'body', headerName: 'Note', flex: 1.4, minWidth: 220 },
        { field: 'author', headerName: 'Author', width: 160 },
        ACTIONS_COL,
      ]}
      rows={rows} empty="No notes recorded yet"
    />
  )
}

export function ModificationsTab({ scope = 'team' }) {
  const [q, setQ] = useState(''); const [type, setType] = useState('')
  const rows = medicalModifications
    .filter(m => m.detail.toLowerCase().includes(q.toLowerCase()))
    .filter(m => !type || m.type === type)

  return (
    <ListPanel
      title="Modifications" addLabel="Add modification" addPanel="Modification"
      actions={<Button variant="outlined">View archive</Button>}
      filters={<>
        <SearchField value={q} onChange={setQ} />
        <SelectField label="Type" options={MODIFICATION_TYPES} value={type} onChange={setType} />
        <DateRangeField />
      </>}
      columns={[
        ...withAthlete(scope, { field: 'athlete', headerName: 'Athlete', flex: 1, minWidth: 180 }),
        { field: 'type', headerName: 'Modification/Absence', width: 190 },
        { field: 'detail', headerName: 'Details', flex: 1.4, minWidth: 220 },
        { field: 'start', headerName: 'Start', width: 130 },
        { field: 'end', headerName: 'End', width: 130 },
        { field: 'by', headerName: 'Updated by', width: 160 },
        ACTIONS_COL,
      ]}
      rows={rows} empty="No modifications recorded yet"
    />
  )
}

export function TreatmentsTab({ scope = 'team' }) {
  const [q, setQ] = useState(''); const [type, setType] = useState('')
  const rows = medicalTreatments
    .filter(t => t.detail.toLowerCase().includes(q.toLowerCase()))
    .filter(t => !type || t.type === type)

  return (
    <ListPanel
      title="Treatments" addLabel="Add treatment" addPanel="Treatment"
      actions={<><Button variant="outlined">View archive</Button><Button variant="outlined">Export billing</Button></>}
      filters={<>
        <SearchField value={q} onChange={setQ} />
        {scope === 'team' && <SelectField label="Roster" options={squads} value="" onChange={() => {}} width={200} />}
        <SelectField label="Type" options={TREATMENT_TYPES} value={type} onChange={setType} />
        <DateRangeField />
      </>}
      columns={[
        ...withAthlete(scope, { field: 'athlete', headerName: 'Player', flex: 1, minWidth: 180 }),
        { field: 'date', headerName: 'Date', width: 130 },
        { field: 'type', headerName: 'Treatment', width: 170 },
        { field: 'detail', headerName: 'Details', flex: 1.4, minWidth: 200 },
        { field: 'duration', headerName: 'Duration', width: 120 },
        { field: 'by', headerName: 'Practitioner', width: 170 },
        ACTIONS_COL,
      ]}
      rows={rows} empty="No treatments recorded yet"
    />
  )
}

export function DiagnosticsTab({ scope = 'team' }) {
  const [q, setQ] = useState(''); const [type, setType] = useState('')
  const rows = medicalDiagnostics
    .filter(d => d.result.toLowerCase().includes(q.toLowerCase()))
    .filter(d => !type || d.type === type)

  return (
    <ListPanel
      title="Diagnostics" addLabel="Add diagnostic" addPanel="Diagnostic"
      actions={<Button variant="outlined">Export billing</Button>}
      filters={<>
        <SearchField value={q} onChange={setQ} />
        <DateRangeField />
        {scope === 'team' && <SelectField label="Squad" options={squads} value="" onChange={() => {}} width={200} />}
        <SelectField label="Type" options={DIAGNOSTIC_TYPES} value={type} onChange={setType} />
      </>}
      columns={[
        ...withAthlete(scope, { field: 'athlete', headerName: 'Athlete', flex: 1, minWidth: 180 }),
        { field: 'date', headerName: 'Date', width: 130 },
        { field: 'type', headerName: 'Type', width: 130 },
        { field: 'region', headerName: 'Body region', width: 150 },
        { field: 'result', headerName: 'Result', flex: 1.4, minWidth: 220 },
        { field: 'by', headerName: 'Requested by', width: 170 },
        ACTIONS_COL,
      ]}
      rows={rows} empty="No diagnostics recorded yet"
    />
  )
}

export function MedicationsTab({ scope = 'team' }) {
  const [q, setQ] = useState(''); const [route, setRoute] = useState('')
  const rows = medicalMedications
    .filter(m => m.name.toLowerCase().includes(q.toLowerCase()))
    .filter(m => !route || m.route === route)

  return (
    <ListPanel
      title="Medications" addLabel="Add medication" addPanel="Medication"
      filters={<>
        <SearchField value={q} onChange={setQ} />
        <SelectField label="Route" options={MEDICATION_ROUTES} value={route} onChange={setRoute} />
        <DateRangeField />
      </>}
      columns={[
        ...withAthlete(scope, { field: 'athlete', headerName: 'Athlete', flex: 1, minWidth: 180 }),
        { field: 'name', headerName: 'Medication', flex: 1, minWidth: 170 },
        { field: 'dose', headerName: 'Dose', width: 120 },
        { field: 'route', headerName: 'Route', width: 130 },
        { field: 'start', headerName: 'Start', width: 130 },
        { field: 'end', headerName: 'End', width: 130 },
        { field: 'by', headerName: 'Prescribed by', width: 170 },
        ACTIONS_COL,
      ]}
      rows={rows} empty="No medications recorded yet"
    />
  )
}

export function DocumentsTab({ scope = 'team' }) {
  const [q, setQ] = useState(''); const [type, setType] = useState('')
  const [category, setCategory] = useState(''); const [source, setSource] = useState('')
  const rows = medicalDocuments
    .filter(d => d.name.toLowerCase().includes(q.toLowerCase()))
    .filter(d => !type || d.type === type)
    .filter(d => !category || d.category === category)
    .filter(d => !source || d.source === source)

  return (
    <ListPanel
      title="Documents" addLabel="Add document" addPanel="File"
      actions={<>
        <Button variant="outlined">Scan</Button>
        <Button variant="outlined" disabled>Export</Button>
        <Button variant="outlined">View Archive</Button>
      </>}
      filters={<>
        <SearchField value={q} onChange={setQ} />
        <DateRangeField />
        {scope === 'team' && <SelectField label="Player" options={[]} value="" onChange={() => {}} />}
        <SelectField label="File type" options={FILE_TYPES} value={type} onChange={setType} />
        <SelectField label="Categories" options={DOC_CATEGORIES} value={category} onChange={setCategory} />
        <SelectField label="Source" options={DOC_SOURCES} value={source} onChange={setSource} />
      </>}
      columns={[
        ...withAthlete(scope, { field: 'athlete', headerName: 'Athlete', flex: 1, minWidth: 180 }),
        { field: 'name', headerName: 'Name', flex: 1.4, minWidth: 220 },
        { field: 'type', headerName: 'File type', width: 130 },
        { field: 'category', headerName: 'Category', width: 150 },
        { field: 'source', headerName: 'Source', width: 130 },
        { field: 'date', headerName: 'Date', width: 130 },
        { field: 'by', headerName: 'Added by', width: 170 },
        ACTIONS_COL,
      ]}
      rows={rows} empty="No documents added yet"
    />
  )
}

export function FormsTab({ scope = 'team' }) {
  const [type, setType] = useState('')
  const rows = medicalForms.filter(f => !type || f.form === type)

  return (
    <ListPanel
      title="All forms"
      filters={<SelectField label="Form Type" options={FORM_TYPES} value={type} onChange={setType} width={220} />}
      columns={[
        ...withAthlete(scope, { field: 'athlete', headerName: 'Athlete', flex: 1, minWidth: 180 }),
        { field: 'form', headerName: 'Form', flex: 1, minWidth: 200 },
        { field: 'status', headerName: 'Status', width: 150 },
        { field: 'date', headerName: 'Date', width: 130 },
        { field: 'by', headerName: 'Completed by', width: 180 },
        ACTIONS_COL,
      ]}
      rows={rows} empty="No forms completed yet"
    />
  )
}

export function MedicalFlagsTab() {
  const [q, setQ] = useState(''); const [severity, setSeverity] = useState(''); const [category, setCategory] = useState('')
  const rows = medicalFlags
    .filter(f => (f.title + f.detail).toLowerCase().includes(q.toLowerCase()))
    .filter(f => !severity || f.severity === severity)
    .filter(f => !category || f.type === category)

  return (
    <ListPanel
      title="Medical Flags" addLabel="Add medical alert" addPanel="Medical Alert"
      actions={<AllergyAction />}
      filters={<>
        <SearchField value={q} onChange={setQ} />
        <SelectField label="Roster" options={squads} value="" onChange={() => {}} width={200} />
        <SelectField label="Severity" options={SEVERITIES} value={severity} onChange={setSeverity} />
        <SelectField label="Category" options={['Allergy', 'Medical Alert']} value={category} onChange={setCategory} />
      </>}
      rowHeight={64}
      columns={[
        { field: 'athlete', headerName: 'Player', flex: 1.1, minWidth: 200,
          renderCell: p => (
            <div>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.row.athlete}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>{p.row.position}</Typography>
            </div>
          ) },
        { field: 'type', headerName: 'Type', width: 150,
          renderCell: p => <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.row.type}</Typography> },
        { field: 'title', headerName: 'Title', flex: 1, minWidth: 180 },
        { field: 'detail', headerName: 'Details', flex: 1, minWidth: 160 },
        { field: 'symptoms', headerName: 'Symptoms', flex: 1, minWidth: 150 },
        { field: 'severity', headerName: 'Severity', width: 150,
          renderCell: p => <SeverityChip value={p.row.severity} /> },
        ACTIONS_COL,
      ]}
      rows={rows} empty="No medical flags recorded yet"
    />
  )
}
