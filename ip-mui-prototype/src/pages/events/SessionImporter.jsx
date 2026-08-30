import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert, Box, Button, Collapse, Divider, IconButton, Paper, Step, StepLabel, Stepper, Typography,
} from '@mui/material'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined'
import UploadFileIcon from '@mui/icons-material/UploadFileOutlined'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import { AdminGrid } from '../admin/parts'
import { SelectField } from '../../components/form'
import { IMPORT_SOURCES, IMPORT_STEPS, IMPORT_VENDORS, sessionAthletes } from '../../data/session'

/**
 * The Session importer. It is its own page, not a panel — Import data on the
 * session navigates here. MUI's Stepper carries the three steps; the source
 * choice is a pair of large ToggleButton-style cards, which is the one thing
 * MUI has no ready component for.
 */
export default function SessionImporter() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [source, setSource] = useState(null)
  const [vendor, setVendor] = useState('')
  const [instructions, setInstructions] = useState(true)

  const canAdvance = (step === 0 && source) || (step === 1 && vendor) || step === 2

  return (
    <AppShell title="Session importer" fullHeight>
      <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 3, px: 3, py: 1.5,
        borderBottom: `1px solid ${colors.neutral_300}` }}>
        <Stepper activeStep={step} sx={{ flex: 1 }}>
          {IMPORT_STEPS.map(s => (
            <Step key={s.label}>
              <StepLabel optional={<Typography variant="caption" sx={{ color: 'text.secondary' }}>{s.hint}</Typography>}>
                {s.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0 }}>
          <Button variant="outlined" disabled={step === 0}
            onClick={() => setStep(s => s - 1)}>Previous</Button>
          <Button disabled={!canAdvance}
            onClick={() => (step === 2 ? navigate(-1) : setStep(s => s + 1))}>
            {step === 2 ? 'Import' : 'Next'}
          </Button>
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <Collapse in={instructions} orientation="horizontal">
          <Box sx={{ width: 300, height: '100%', borderRight: `1px solid ${colors.neutral_300}`, p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Instructions</Typography>
              <IconButton size="small" aria-label="Hide instructions" onClick={() => setInstructions(false)}>
                <KeyboardDoubleArrowLeftIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Session importer</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              To avoid errors make sure you are importing the correct template file type for this submission.
            </Typography>
          </Box>
        </Collapse>

        {!instructions && (
          <Box sx={{ p: 1.5, borderRight: `1px solid ${colors.neutral_300}` }}>
            <IconButton size="small" aria-label="Show instructions" onClick={() => setInstructions(true)}>
              <KeyboardDoubleArrowRightIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        <Box sx={{ flex: 1, overflow: 'auto', p: 4, display: 'grid', placeItems: 'start center' }}>
          {step === 0 && (
            <Box sx={{ display: 'flex', gap: 1.5, mt: 4 }}>
              {IMPORT_SOURCES.map(s => (
                <Paper key={s.id} variant="outlined" onClick={() => setSource(s.id)}
                  role="button" tabIndex={0} aria-pressed={source === s.id}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setSource(s.id)}
                  sx={{
                    width: 190, height: 96, display: 'grid', placeItems: 'center', cursor: 'pointer',
                    borderColor: source === s.id ? colors.grey_200 : colors.neutral_400,
                    bgcolor: source === s.id ? colors.grey_200 : colors.white,
                    color: source === s.id ? colors.white : 'text.primary',
                  }}>
                  {s.id === 'csv'
                    ? <Box sx={{ textAlign: 'center' }}>
                        <DescriptionIcon />
                        <Typography variant="body2" sx={{ color: 'inherit' }}>{s.label}</Typography>
                      </Box>
                    : <Typography variant="h6" sx={{ color: 'inherit', letterSpacing: '0.05em' }}>{s.label}</Typography>}
                </Paper>
              ))}
            </Box>
          )}

          {step === 1 && (
            <Box sx={{ width: 490, mt: 6 }}>
              <Box component="label" sx={{
                display: 'grid', placeItems: 'center', gap: 1, py: 6, cursor: 'pointer',
                border: `1px dashed ${colors.neutral_400}`, borderRadius: 1,
              }}>
                <UploadFileIcon sx={{ color: 'text.secondary' }} />
                <Typography variant="body2">
                  <Box component="span" sx={{ textDecoration: 'underline' }}>Click to upload</Box> or drag and drop
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>.CSV file only</Typography>
                <Box component="input" type="file" accept=".csv" hidden />
              </Box>
              <Box sx={{ mt: 3 }}>
                <SelectField label="Select vendor" options={IMPORT_VENDORS} value={vendor}
                  onChange={e => setVendor(e.target.value)} />
              </Box>
            </Box>
          )}

          {step === 2 && (
            <Box sx={{ width: '100%', maxWidth: 900 }}>
              <Alert severity="success" sx={{ mb: 2 }}>
                {sessionAthletes.length} rows matched, no errors found.
              </Alert>
              <AdminGrid
                rows={sessionAthletes} rowHeight={52} hideFooter
                columns={[
                  { field: 'name', headerName: 'Athlete', flex: 1, minWidth: 200 },
                  { field: 'minutes', headerName: 'Minutes', width: 130 },
                  { field: 'rpe', headerName: 'RPE', width: 110 },
                  { field: 'participation', headerName: 'Participation', width: 170 },
                ]}
              />
            </Box>
          )}
        </Box>
      </Box>
    </AppShell>
  )
}
