import { Box, Checkbox, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material'
import {
  AthleteSelect, DateInput, FieldRow, FileDrop, MoneyInput, NumberInput, SelectField, TextInput,
} from '../../components/form'
import {
  AVAILABILITY_STATUSES, DIAGNOSTIC_TYPES, DOC_CATEGORIES, MEDICATION_ROUTES, MODIFICATION_TYPES,
  NOTE_TYPES, SEVERITIES, TREATMENT_TYPES,
} from '../../data/medical'

/* ------------------------------------------------------- panel definitions */
// The athlete is only asked for where the page does not already name one.
const athleteField = scope => (scope === 'team' ? <AthleteSelect /> : null)

export const PANELS = {
  'Injury/ Illness': {
    title: 'Add injury / illness',
    steps: ['Details', 'Pathology', 'Availability', 'Review'],
    body: ({ step, scope }) => (
      <>
        {step === 0 && <>
          {athleteField(scope)}
          <FieldRow>
            <SelectField label="Type" options={['New', 'Recurrence', 'Chronic', 'Exacerbation']} />
            <DateInput label="Date of injury / illness" />
          </FieldRow>
          <FieldRow>
            <DateInput label="Date of examination" />
            <SelectField label="Occurred during" options={['Training', 'Game', 'Other', 'Unknown']} />
          </FieldRow>
          <TextInput label="Title" />
          <TextInput label="Description" multiline minRows={3} />
          <FormControlLabel label="Preliminary — details still being confirmed" control={<Checkbox />} />
        </>}

        {step === 1 && <>
          <FieldRow>
            <SelectField label="Medical System" options={['Musculoskeletal', 'Neurological', 'Cardiovascular', 'Respiratory', 'Dermatological', 'Other']} />
            <SelectField label="Body Area" options={['Head/Neck', 'Upper limb', 'Trunk', 'Lower limb', 'Medical']} />
          </FieldRow>
          <FieldRow>
            <SelectField label="Pathology" options={['Gout in knee', 'A/C joint arthritis', 'Instability 1st MCP joint', 'Thyroid disorder', 'Other']} />
            <SelectField label="Side" options={['Left', 'Right', 'Center', 'Bilateral', 'N/A']} />
          </FieldRow>
          <FieldRow>
            <SelectField label="Etiology" options={['Traumatic', 'Overuse', 'Immunological/inflammatory', 'Infective', 'Degenerative']} />
            <SelectField label="Onset" options={['Acute', 'Gradual', 'Overuse', 'Unknown']} />
          </FieldRow>
          <TextInput label="Code" helperText="Auto-generated from the pathology if left blank" />
        </>}

        {step === 2 && <>
          <SelectField label="Availability status" options={AVAILABILITY_STATUSES} />
          <FieldRow>
            <DateInput label="From" />
            <DateInput label="Expected return" />
          </FieldRow>
          <TextInput label="Reason" multiline minRows={2} />
          <FormControlLabel label="Notify the coaching staff" control={<Checkbox defaultChecked />} />
        </>}

        {step === 3 && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Review the details, then save. The record opens on its own page where rehab, notes, treatments and
            diagnostics are added.
          </Typography>
        )}
      </>
    ),
  },

  Note: {
    title: 'Add note',
    body: ({ scope }) => (
      <>
        {athleteField(scope)}
        <FieldRow>
          <SelectField label="Note type" options={NOTE_TYPES} />
          <DateInput label="Date" />
        </FieldRow>
        <TextInput label="Title" />
        <TextInput label="Note" multiline minRows={6} />
        <Box>
          <FormLabel sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary' }}>Visibility</FormLabel>
          <RadioGroup defaultValue="Medical staff only" sx={{ mt: 0.5 }}>
            {['Medical staff only', 'All staff', 'Medical and coaching staff'].map(v => (
              <FormControlLabel key={v} value={v} control={<Radio size="small" />} label={v} />
            ))}
          </RadioGroup>
        </Box>
      </>
    ),
  },

  Modification: {
    title: 'Add modification',
    body: ({ scope }) => (
      <>
        {athleteField(scope)}
        <SelectField label="Modification / absence" options={MODIFICATION_TYPES} />
        <FieldRow>
          <DateInput label="Start" />
          <DateInput label="End" />
        </FieldRow>
        <TextInput label="Details" multiline minRows={3} />
        <SelectField label="Availability status" options={AVAILABILITY_STATUSES} />
        <FormControlLabel label="Applies to games as well as training" control={<Checkbox defaultChecked />} />
      </>
    ),
  },

  Diagnostic: {
    title: 'Add diagnostic',
    body: ({ scope }) => (
      <>
        {athleteField(scope)}
        <FieldRow>
          <SelectField label="Type" options={DIAGNOSTIC_TYPES} />
          <DateInput label="Date" />
        </FieldRow>
        <FieldRow>
          <SelectField label="Body region" options={['Head/Neck', 'Shoulder', 'Hand', 'Trunk', 'Hip', 'Knee', 'Ankle', 'Foot']} />
          <TextInput label="Provider" />
        </FieldRow>
        <TextInput label="Result" multiline minRows={3} />
        <FieldRow>
          <MoneyInput label="Cost" />
          <SelectField label="Billable to" options={['Club', 'Insurance', 'Athlete']} />
        </FieldRow>
      </>
    ),
  },

  File: {
    title: 'Add document',
    body: ({ scope }) => (
      <>
        {athleteField(scope)}
        <FileDrop />
        <TextInput label="Name" />
        <FieldRow>
          <SelectField label="Category" options={DOC_CATEGORIES} />
          <DateInput label="Date" />
        </FieldRow>
        <TextInput label="Description" multiline minRows={2} />
        <FormControlLabel label="Visible to the athlete" control={<Checkbox />} />
      </>
    ),
  },

  Treatment: {
    title: 'Add treatment',
    body: ({ scope }) => (
      <>
        {athleteField(scope)}
        <FieldRow>
          <SelectField label="Treatment" options={TREATMENT_TYPES} />
          <DateInput label="Date" />
        </FieldRow>
        <FieldRow>
          <NumberInput label="Duration" unit="min" />
          <TextInput label="Practitioner" />
        </FieldRow>
        <TextInput label="Details" multiline minRows={3} />
        <FieldRow>
          <MoneyInput label="Cost" />
          <SelectField label="Billable to" options={['Club', 'Insurance', 'Athlete']} />
        </FieldRow>
      </>
    ),
  },

  Allergy: {
    title: 'Add allergy',
    body: ({ scope }) => (
      <>
        {athleteField(scope)}
        <TextInput label="Title" />
        <FieldRow>
          <SelectField label="Allergen type" options={['Food', 'Medication', 'Environmental', 'Insect', 'Other']} />
          <SelectField label="Severity" options={SEVERITIES} />
        </FieldRow>
        <TextInput label="Symptoms" multiline minRows={2} />
        <TextInput label="Treatment / response" multiline minRows={2} />
        <FormControlLabel label="Show as a flag on the athlete's record" control={<Checkbox defaultChecked />} />
      </>
    ),
  },

  'Chronic condition': {
    title: 'Add chronic condition',
    body: ({ scope }) => (
      <>
        {athleteField(scope)}
        <TextInput label="Title" />
        <FieldRow>
          <DateInput label="Onset date" />
          <SelectField label="Medical System" options={['Musculoskeletal', 'Neurological', 'Cardiovascular', 'Respiratory', 'Endocrine', 'Other']} />
        </FieldRow>
        <TextInput label="Management plan" multiline minRows={4} />
        <FormControlLabel label="Link to an existing injury / illness" control={<Checkbox />} />
      </>
    ),
  },

  'Medical Alert': {
    title: 'Add medical alert',
    body: ({ scope }) => (
      <>
        {athleteField(scope)}
        <TextInput label="Title" />
        <FieldRow>
          <SelectField label="Category" options={['Cardiac', 'Respiratory', 'Haematological', 'Neurological', 'Other']} />
          <SelectField label="Severity" options={SEVERITIES} />
        </FieldRow>
        <TextInput label="Details" multiline minRows={3} />
        <TextInput label="Emergency action" multiline minRows={3}
          helperText="Shown to any staff member who opens the athlete's record" />
      </>
    ),
  },

  Vaccination: {
    title: 'Add vaccination',
    body: ({ scope }) => (
      <>
        {athleteField(scope)}
        <FieldRow>
          <SelectField label="Vaccine" options={['Tetanus', 'Hepatitis B', 'Influenza', 'COVID-19', 'MMR', 'Other']} />
          <DateInput label="Date administered" />
        </FieldRow>
        <FieldRow>
          <TextInput label="Batch number" />
          <DateInput label="Next due" />
        </FieldRow>
        <TextInput label="Administered by" />
        <TextInput label="Notes" multiline minRows={2} />
      </>
    ),
  },

  Medication: {
    title: 'Add medication',
    body: ({ scope }) => (
      <>
        {athleteField(scope)}
        <TextInput label="Medication" />
        <FieldRow>
          <TextInput label="Dose" />
          <SelectField label="Route" options={MEDICATION_ROUTES} />
        </FieldRow>
        <FieldRow>
          <DateInput label="Start" />
          <DateInput label="End" />
        </FieldRow>
        <TextInput label="Prescribed by" />
        <TextInput label="Notes" multiline minRows={2} />
      </>
    ),
  },

  'Rehab session': {
    title: 'Add rehab session',
    body: () => (
      <>
        <FieldRow>
          <DateInput label="Date" />
          <SelectField label="Phase" options={['Phase 1 — Protect', 'Phase 2 — Restore', 'Phase 3 — Return']} />
        </FieldRow>
        <TextInput label="Session" />
        <FieldRow>
          <TextInput label="Led by" />
          <SelectField label="Status" options={['Planned', 'Complete', 'Missed']} />
        </FieldRow>
        <TextInput label="Exercises" multiline minRows={4} />
      </>
    ),
  },

  Maintenance: {
    title: 'Add maintenance',
    body: ({ scope }) => (
      <>
        {athleteField(scope)}
        <SelectField label="Item"
          options={['Cardiac screening', 'Concussion baseline', 'Vaccination', 'Medical review', 'Other']} />
        <FieldRow>
          <DateInput label="Last completed" />
          <DateInput label="Next due" />
        </FieldRow>
        <SelectField label="Status" options={['Complete', 'Due', 'Overdue']} />
        <TextInput label="Notes" multiline minRows={2} />
      </>
    ),
  },

  'Development goal': {
    title: 'Add development goal',
    body: ({ scope }) => (
      <>
        {athleteField(scope)}
        <TextInput label="Goal" />
        <FieldRow>
          <SelectField label="Type" options={['Individual Session', 'Tactical', 'Technical', 'Physical']} />
          <DateInput label="Target date" />
        </FieldRow>
        <TextInput label="Description" multiline minRows={3} />
      </>
    ),
  },

  TUE: {
    title: 'Add TUE',
    body: ({ scope }) => (
      <>
        {athleteField(scope)}
        <TextInput label="Medication" />
        <FieldRow>
          <SelectField label="Route" options={MEDICATION_ROUTES} />
          <TextInput label="Dose" />
        </FieldRow>
        <FieldRow>
          <DateInput label="Valid from" />
          <DateInput label="Valid to" />
        </FieldRow>
        <TextInput label="Granting body" helperText="The anti-doping organisation that issued the exemption" />
        <TextInput label="Reason" multiline minRows={3} />
        <FileDrop />
      </>
    ),
  },
}
