import { useState } from 'react'
import {
  Autocomplete, Box, Button, Divider, Drawer, IconButton, MenuItem, Step, StepLabel,
  Stepper, TextField, Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import colors from '../theme/tokens'

const TITLES = {
  'Injury/ Illness': 'Add injury/ illness',
  Note: 'Add medical note',
  Modification: 'Add modification',
  Diagnostic: 'Add diagnostic',
  File: 'Add file',
  Treatment: 'Add treatment',
  Allergy: 'Add allergy',
  'Chronic condition': 'Add chronic condition',
  'Medical Alert': 'Add medical alert',
  Vaccination: 'Add vaccination',
  TUE: 'Add TUE',
}

const INJURY_STEPS = ['Initial Information', 'Diagnosis Information', 'Event Information', 'Additional Information']

const Field = ({ label, ...rest }) => <TextField label={label} fullWidth {...rest} />

/**
 * One drawer shell behind all eleven Medical creation panels.
 * In the live app each is a bespoke sliding panel with no MuiButton anywhere,
 * and injury/illness is a four-step wizard.
 */
export default function AddPanel({ type, open, onClose, athletes = [] }) {
  const [step, setStep] = useState(0)
  const isWizard = type === 'Injury/ Illness'
  const title = TITLES[type] || 'Add'

  const close = () => { setStep(0); onClose() }

  return (
    <Drawer anchor="right" open={open} onClose={close} PaperProps={{ sx: { width: { xs: '100%', sm: 560 } } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>{title}</Typography>
          <IconButton onClick={close} size="small" aria-label="Close panel"><CloseIcon fontSize="small" /></IconButton>
        </Box>
        <Divider />

        <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2.5 }}>
          {isWizard && (
            <Stepper activeStep={step} alternativeLabel sx={{ mb: 3 }}>
              {INJURY_STEPS.map(s => <Step key={s}><StepLabel>{s}</StepLabel></Step>)}
            </Stepper>
          )}

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <Field select label="Type" defaultValue={type === 'Note' ? 'Medical note' : 'New injury'}>
              <MenuItem value="New injury">New injury</MenuItem>
              <MenuItem value="Medical note">Medical note</MenuItem>
              <MenuItem value="Recurrence">Recurrence</MenuItem>
            </Field>
            <Autocomplete
              options={athletes} getOptionLabel={o => o.name}
              renderInput={p => <TextField {...p} label="Athlete" />}
            />
            <Field label="Date" type="date" defaultValue="2026-08-27" InputLabelProps={{ shrink: true }} />
            <Field select label="Occurred in squad" defaultValue="U16 (Test Kitman FC)">
              <MenuItem value="U16 (Test Kitman FC)">U16 (Test Kitman FC)</MenuItem>
              <MenuItem value="U15">U15</MenuItem>
            </Field>

            {type === 'Treatment' && (
              <>
                <Field label="Practitioner" defaultValue="John Roche Test" />
                <Field label="Duration" defaultValue="30 mins" />
              </>
            )}

            <Box sx={{ gridColumn: '1 / -1' }}>
              <Field label={type === 'Note' ? 'S.O.A.P notes' : 'Initial notes'} multiline minRows={5} />
            </Box>

            {type === 'Note' && (
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Field select label="Visibility" defaultValue="All">
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Medical only">Medical only</MenuItem>
                </Field>
              </Box>
            )}
          </Box>
        </Box>

        <Divider />
        <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', gap: 1, bgcolor: colors.neutral_100 }}>
          <Button variant="text" onClick={close}>Cancel</Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isWizard && step > 0 && <Button variant="outlined" onClick={() => setStep(s => s - 1)}>Back</Button>}
            {isWizard && step < INJURY_STEPS.length - 1
              ? <Button onClick={() => setStep(s => s + 1)}>Next</Button>
              : <Button onClick={close}>Save</Button>}
          </Box>
        </Box>
      </Box>
    </Drawer>
  )
}
