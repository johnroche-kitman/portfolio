import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { useNavigate, useParams } from 'react-router-dom'
import PageTabs from '../components/PageTabs'
import Card from '../components/Card'
import PlayerAvatar from '../components/PlayerAvatar'
import Lozenge from '../components/Lozenge'
import Button from '../components/Button'
import Icon from '../components/Icon'
import { useAppData } from '../state/AppDataContext'
import { backgroundScreenQuestions } from '../data/backgroundScreenQuestions'

const DETAIL_TABS = [
  { value: 'overview', label: 'Injury overview' },
  { value: 'notes', label: 'Notes', disabled: true },
  { value: 'diagnostics', label: 'Diagnostics', disabled: true },
]

function Field({ label, value, emphasizeMissing }) {
  const missing = !value
  return (
    <Box>
      <Typography variant="body2" sx={{ color: 'var(--grey-100)', mb: 0.25 }}>
        {label}
      </Typography>
      <Typography
        variant="body1"
        fontWeight={600}
        sx={{ color: missing && emphasizeMissing ? 'var(--color-error)' : 'inherit' }}
      >
        {value || 'Outstanding'}
      </Typography>
    </Box>
  )
}

export default function InjuryOverview() {
  const { injuryId } = useParams()
  const navigate = useNavigate()
  const { getInjuryById, getAthleteById, notesByInjury, acceptInjury, outstandingBackgroundFields } = useAppData()

  const injury = getInjuryById(injuryId)

  if (!injury) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h2">Injury not found</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/medical/roster')}>
          Back to roster
        </Button>
      </Box>
    )
  }

  const athlete = getAthleteById(injury.athleteId)
  const notes = notesByInjury[injury.id] || []
  const outstanding = outstandingBackgroundFields(injury)
  const isPending = injury.status === 'pending_review'

  return (
    <Box>
      <Box
        onClick={() => navigate(-1)}
        display="flex"
        alignItems="center"
        gap={0.5}
        sx={{ cursor: 'pointer', color: 'var(--grey-100)', mb: 1, width: 'fit-content' }}
      >
        <Icon name="back" fontSize="small" />
        <Typography variant="body1">Player overview</Typography>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <PlayerAvatar athlete={athlete} size={64} />
          <Typography variant="h1">
            {athlete?.name || 'Unknown athlete'}
            {injury.code ? ` - ${injury.code}` : ''} {injury.ciCode || injury.pathology}
          </Typography>
        </Box>
        <Button endIcon={<Icon name="expandMore" fontSize="small" />}>Add</Button>
      </Box>

      <PageTabs tabs={DETAIL_TABS} value="overview" onChange={() => {}} />

      {isPending && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mt: 3,
            p: 2,
            borderRadius: '8px',
            backgroundColor: '#fff4dc',
            border: '1px solid var(--color-warning)',
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Icon name="ai" fontSize="small" sx={{ color: '#7a5300' }} />
            <Typography variant="body1" sx={{ color: '#7a5300' }}>
              Created by the AI assistant from a dictated note. Review the details below before accepting.
            </Typography>
          </Box>
          <Button onClick={() => acceptInjury(injury.id)}>Accept injury</Button>
        </Box>
      )}

      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        <Grid item xs={12} md={8}>
          <Box display="flex" flexDirection="column" gap={3}>
            <Card title="Injury details" action={<Button tone="secondary">Edit</Button>}>
              <Box display="flex" gap={6}>
                <Field label="Added on" value={injury.addedOn} />
                <Field label="Added by" value={injury.addedBy} />
                {injury.examinationDate && <Field label="Examination date" value={injury.examinationDate} />}
              </Box>
              {notes.length > 0 && (
                <>
                  <Divider sx={{ my: 2, borderColor: 'var(--divider)' }} />
                  <Typography variant="body2" sx={{ color: 'var(--grey-100)', mb: 0.5 }}>
                    Initial note
                  </Typography>
                  <Typography variant="body1">{notes[0].text}</Typography>
                </>
              )}
            </Card>

            <Card title="Primary CI code" action={<Button tone="secondary">Edit</Button>}>
              <Box sx={{ backgroundColor: 'var(--neutral-200)', borderRadius: '8px', p: 2 }}>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={4}>
                    <Field label="CI code" value={injury.ciCode} />
                  </Grid>
                  <Grid item xs={4}>
                    <Field label="Classification" value={injury.classification} />
                  </Grid>
                  <Grid item xs={4}>
                    <Field label="Body area" value={injury.bodyArea} />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Field label="Side" value={injury.side} emphasizeMissing />
                  </Grid>
                  <Grid item xs={4}>
                    <Field label="Code" value={injury.code} />
                  </Grid>
                  <Grid item xs={4}>
                    <Field label="Mode of onset" value={injury.modeOfOnset} emphasizeMissing />
                  </Grid>
                </Grid>
              </Box>
            </Card>

            <Card title="Event details" action={<Button tone="secondary">Edit</Button>}>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={4}>
                  <Field label="Date of injury" value={injury.date} />
                </Grid>
                <Grid item xs={4}>
                  <Field label="Event" value={injury.event} />
                </Grid>
                <Grid item xs={4}>
                  <Field label="Activity" value={injury.activity} />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Field label="Session completed" value={injury.sessionCompleted} />
                </Grid>
                <Grid item xs={4}>
                  <Field label="Position when injured" value={injury.positionWhenInjured} />
                </Grid>
              </Grid>
            </Card>

            <Card title="Background screen" action={<Button tone="secondary">Edit</Button>}>
              <Box display="flex" flexDirection="column" gap={1.5}>
                {backgroundScreenQuestions.map((q, idx) => (
                  <Box key={q.id}>
                    <Box display="flex" justifyContent="space-between" gap={3}>
                      <Typography variant="body1" fontWeight={600}>
                        {q.question}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          textAlign: 'right',
                          color: injury.backgroundScreen?.[q.id] ? 'inherit' : 'var(--color-error)',
                        }}
                      >
                        {injury.backgroundScreen?.[q.id] || 'Outstanding'}
                      </Typography>
                    </Box>
                    {idx < backgroundScreenQuestions.length - 1 && (
                      <Divider sx={{ mt: 1.5, borderColor: 'var(--divider)' }} />
                    )}
                  </Box>
                ))}
              </Box>
            </Card>

            <Card title="Nature of injury" action={<Button tone="secondary">Edit</Button>}>
              <Box display="flex" flexDirection="column" gap={1}>
                {(injury.natureOfInjury || []).length ? (
                  injury.natureOfInjury.map((entry, idx) => (
                    <Field key={idx} label="Pathology" value={entry.pathology} />
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
                    No pathology recorded yet
                  </Typography>
                )}
              </Box>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box display="flex" flexDirection="column" gap={3}>
            <Card>
              <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                <Typography variant="body1">
                  Ensure all statuses are added and mark "Player left club" if injury not resolved when
                  player moved.
                </Typography>
                <Button tone="secondary" sx={{ flexShrink: 0 }}>
                  Update
                </Button>
              </Box>
            </Card>

            <Card>
              <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1.5 }}>
                <Typography variant="h2">Preliminary status:</Typography>
                <Lozenge label={`${outstanding.length} outstanding`} tone={outstanding.length ? 'warning' : 'success'} />
              </Box>
              {outstanding.length ? (
                <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                  {outstanding.map((q) => (
                    <li key={q.id}>
                      <Typography variant="body1">{q.question}</Typography>
                    </li>
                  ))}
                </Box>
              ) : (
                <Typography variant="body1" sx={{ color: 'var(--color-success)' }}>
                  All fields complete
                </Typography>
              )}
            </Card>

            <Card title="Availability history" action={<Button tone="secondary">Add</Button>}>
              {injury.availabilityHistory?.length ? (
                <>
                  <Typography variant="body2" sx={{ color: 'var(--color-error)', fontWeight: 600, mb: 1 }}>
                    Current status
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    {injury.availabilityHistory.map((entry) => (
                      <Box key={entry.order} display="flex" gap={1.5}>
                        <Typography variant="h2" sx={{ color: 'var(--grey-100)', fontSize: 18 }}>
                          {entry.order}
                        </Typography>
                        <Box flexGrow={1}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body1" fontWeight={600}>
                              {entry.label}
                            </Typography>
                            <Lozenge label={entry.status} />
                          </Box>
                          <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
                            Updated by: {entry.updatedBy} &nbsp; Duration: {entry.duration}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Divider sx={{ my: 2, borderColor: 'var(--divider)' }} />
                  <Typography variant="h2" sx={{ fontSize: 16, mb: 1 }}>
                    Availability summary
                  </Typography>
                  <Box display="flex" gap={3}>
                    <Typography variant="body1">Total duration: {injury.totalDuration || '—'}</Typography>
                    <Typography variant="body1">
                      Total unavailability: {injury.totalUnavailability || '—'}
                    </Typography>
                  </Box>
                </>
              ) : (
                <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
                  No availability history recorded yet.
                </Typography>
              )}
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
