import { useState } from 'react'
import {
  Box, Button, Divider, Drawer, IconButton, Step, StepLabel, Stepper, Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

/**
 * The one drawer shell behind every creation panel in the product — the eleven
 * in Medical and anything added later. Callers supply a definition
 * ({ title, steps, body }); the header, the stepper and the Save bar are the
 * same everywhere, so they live here rather than in each panel.
 */
export default function AddPanel({ open, definition, onClose, width = 640, ...bodyProps }) {
  const [step, setStep] = useState(0)
  const steps = definition?.steps
  const last = !steps || step === steps.length - 1

  const close = () => { setStep(0); onClose() }

  return (
    <Drawer anchor="right" open={!!open} onClose={close}
      PaperProps={{ sx: { width: { xs: '100%', sm: width }, display: 'flex' } }}>
      <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">{definition?.title || ''}</Typography>
        <IconButton size="small" onClick={close} aria-label="Close"><CloseIcon fontSize="small" /></IconButton>
      </Box>
      <Divider />

      {steps && (
        <Box sx={{ px: 3, pt: 2.5 }}>
          <Stepper activeStep={step} alternativeLabel>
            {steps.map(s => <Step key={s}><StepLabel>{s}</StepLabel></Step>)}
          </Stepper>
        </Box>
      )}

      <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'grid', gap: 2.5, alignContent: 'start' }}>
        {definition?.body({ step, ...bodyProps })}
      </Box>

      <Divider />
      {/* Save is the drawer's only primary; Back and Cancel are secondary. */}
      <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
        {steps && step > 0 && <Button variant="outlined" onClick={() => setStep(s => s - 1)}>Back</Button>}
        <Button variant="outlined" onClick={close}>Cancel</Button>
        {last
          ? <Button onClick={close}>Save</Button>
          : <Button onClick={() => setStep(s => s + 1)}>Next</Button>}
      </Box>
    </Drawer>
  )
}
