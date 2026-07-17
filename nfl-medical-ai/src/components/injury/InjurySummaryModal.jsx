import { useMemo } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import PlayerAvatar from '../PlayerAvatar'
import Lozenge from '../Lozenge'
import Button from '../Button'
import Icon from '../Icon'
import PieChart from '../PieChart'
import { useAppData } from '../../state/AppDataContext'
import { buildInjurySummary, buildSummaryHtmlDocument, daysBetween } from '../../utils/injurySummary'

function severityTone(severity) {
  if (severity === 'Severe') return 'error'
  if (severity === 'Moderate') return 'warning'
  if (severity === 'Mild') return 'success'
  return 'neutral'
}

function downloadTextFile(filename, contents, type) {
  const blob = new Blob([contents], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default function InjurySummaryModal({ open, athleteId, onClose }) {
  const { injuries, rehabByInjury, getAthleteById } = useAppData()

  const athlete = athleteId ? getAthleteById(athleteId) : null
  const summary = useMemo(() => {
    if (!athlete) return null
    return buildInjurySummary(athlete, injuries, rehabByInjury)
  }, [athlete, injuries, rehabByInjury])

  const generatedOn = useMemo(() => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), [])

  if (!athlete || !summary) return null

  function handleExport() {
    const html = buildSummaryHtmlDocument(athlete, summary, generatedOn)
    downloadTextFile(`${athlete.name.toLowerCase().replace(/\s+/g, '-')}-injury-summary.html`, html, 'text/html')
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <Box
        className="no-print"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 2, borderBottom: '1px solid var(--divider)' }}
      >
        <Typography variant="h2">Injury summary</Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Button tone="secondary" startIcon={<Icon name="print" fontSize="small" />} onClick={() => window.print()}>
            Print
          </Button>
          <Button tone="secondary" startIcon={<Icon name="download" fontSize="small" />} onClick={handleExport}>
            Export
          </Button>
          <IconButton size="small" onClick={onClose}>
            <Icon name="close" fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <DialogContent dividers sx={{ p: 0 }}>
        <Box className="print-summary-root" sx={{ p: 4, backgroundColor: 'var(--white)' }}>
          <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
            <PlayerAvatar athlete={athlete} size={56} />
            <Box>
              <Typography variant="h1" sx={{ fontSize: 24 }}>
                {athlete.name} &ndash; Injury summary
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
                {athlete.position} &middot; Generated {generatedOn}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" gap={5} sx={{ mb: 4, p: 2.5, backgroundColor: 'var(--neutral-200)', borderRadius: '8px' }}>
            <Box>
              <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
                Total injuries
              </Typography>
              <Typography variant="h2">{summary.totalCount}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
                Currently open
              </Typography>
              <Typography variant="h2">{summary.openCount}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
                Resolved
              </Typography>
              <Typography variant="h2">{summary.resolvedCount}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
                Most recent
              </Typography>
              <Typography variant="h2" sx={{ fontSize: 18 }}>
                {summary.mostRecentDate || '—'}
              </Typography>
            </Box>
          </Box>

          <Typography variant="h2" sx={{ mb: 2 }}>
            Injury history
          </Typography>

          {!summary.injuries.length && (
            <Typography variant="body2" sx={{ color: 'var(--grey-100)', mb: 4 }}>
              No injuries recorded for {athlete.name} yet.
            </Typography>
          )}

          <Box display="flex" flexDirection="column" gap={2.5} sx={{ mb: 4 }}>
            {summary.injuries.map(({ injury, rehabSessions, rehabSessionCount }) => (
              <Box
                key={injury.id}
                sx={{ border: '1px solid var(--divider)', borderRadius: '8px', p: 2.5, breakInside: 'avoid' }}
              >
                <Box display="flex" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 1.5 }} gap={2}>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      {injury.pathology || injury.label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
                      {injury.date}
                      {injury.side ? ` · ${injury.side}` : ''}
                      {injury.bodyArea ? ` · ${injury.bodyArea}` : ''}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1} flexShrink={0}>
                    <Lozenge label={injury.severity || 'Not recorded'} tone={severityTone(injury.severity)} />
                    <Lozenge label={injury.resolved ? 'Resolved' : 'Open'} tone={injury.resolved ? 'success' : 'error'} />
                  </Box>
                </Box>

                <Divider sx={{ my: 1.5, borderColor: 'var(--divider)' }} />

                <Box display="flex" flexDirection="column" gap={1.5}>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      Diagnostics
                    </Typography>
                    {injury.diagnostics?.length ? (
                      injury.diagnostics.map((d) => (
                        <Typography key={d.id} variant="body2" sx={{ color: 'var(--grey-100)' }}>
                          {d.date} &mdash; {d.name}: {d.result}
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
                        No diagnostics recorded
                      </Typography>
                    )}
                  </Box>

                  {injury.surgery && (
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        Surgery
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
                        {injury.surgery.procedure} &mdash; {injury.surgery.date}
                      </Typography>
                      {!injury.resolved && (
                        <Typography variant="body2" sx={{ color: '#7a5300', fontWeight: 600 }}>
                          Day {daysBetween(injury.surgery.date, new Date())} post-surgery
                        </Typography>
                      )}
                      {injury.resolved && injury.resolvedDate && (
                        <Typography variant="body2" sx={{ color: 'var(--color-success)', fontWeight: 600 }}>
                          Recovery period: {daysBetween(injury.surgery.date, injury.resolvedDate)} days
                        </Typography>
                      )}
                    </Box>
                  )}

                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      Rehab sessions ({rehabSessionCount})
                    </Typography>
                    {rehabSessionCount ? (
                      rehabSessions.map((session) => (
                        <Typography key={session.id} variant="body2" sx={{ color: 'var(--grey-100)' }}>
                          {session.date} &mdash; {session.exercises.length} exercise{session.exercises.length === 1 ? '' : 's'}
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
                        No rehab sessions recorded
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      Medications
                    </Typography>
                    {injury.medications?.length ? (
                      injury.medications.map((m) => (
                        <Typography key={m.id} variant="body2" sx={{ color: 'var(--grey-100)' }}>
                          {m.name} {m.dosage}, {m.frequency} ({m.startDate}
                          {m.endDate ? ` – ${m.endDate}` : ' – ongoing'})
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
                        No medications recorded
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          <Divider sx={{ mb: 3, borderColor: 'var(--divider)' }} />

          <Typography variant="h2" sx={{ mb: 2 }}>
            Statistics
          </Typography>
          <Box display="flex" gap={6} flexWrap="wrap">
            <PieChart title="Types of injuries" data={summary.typeBreakdown} />
            <PieChart title="Severity" data={summary.severityBreakdown} />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
