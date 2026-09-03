import { useMemo, useState } from 'react'
import {
  Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, Divider, Paper, Slider,
  Snackbar, Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SyncIcon from '@mui/icons-material/SyncOutlined'
import VideoLibraryIcon from '@mui/icons-material/VideoLibraryOutlined'
import colors from '../../theme/tokens'
import { MultiSelect, SearchInput, SelectField } from '../../components/form'
import {
  ClipDialog, ClipTile, FullDrillCard, PrincipleChips, shareMessage,
} from '../../components/clips'
import { athleteById } from '../../data/athletes'
import {
  HUDL, PEAK_METRICS, PRINCIPLE_NAMES, clippedAthleteIds, peakMetric, sessionClips, videoDrills,
} from '../../data/video'

/** Chip label for a drill's activity — "Attack (Football Based)" reads as "Attack". */
const shortActivity = a => a.replace(/\s*\(.*\)$/, '')

const NO_METRIC = ''

export default function VideoTab() {
  const [q, setQ] = useState('')
  const [athleteNames, setAthleteNames] = useState([])
  const [principles, setPrinciples] = useState([])
  const [metric, setMetric] = useState(NO_METRIC)
  const [threshold, setThreshold] = useState(null)
  const [open, setOpen] = useState(null)      // { clip, drill } | { full: drill }
  const [toast, setToast] = useState('')

  const athleteOptions = useMemo(
    () => clippedAthleteIds.map(id => athleteById(id)?.name).filter(Boolean).sort(),
    [],
  )

  // Only the principles this session's clips actually carry — an empty filter
  // result is a dead end, so the options never offer one.
  const principleOptions = useMemo(
    () => PRINCIPLE_NAMES.filter(p => sessionClips.some(c => c.principles.includes(p))),
    [],
  )

  const m = metric ? peakMetric(metric) : null

  const chooseMetric = key => {
    setMetric(key)
    // Start the threshold at the midpoint so the filter shows its effect
    // immediately rather than matching everything.
    const next = key ? peakMetric(key) : null
    setThreshold(next ? Math.round(((next.min + next.max) / 2) * 10) / 10 : null)
  }

  const clear = () => {
    setQ(''); setAthleteNames([]); setPrinciples([]); setMetric(NO_METRIC); setThreshold(null)
  }

  const active = !!q || !!athleteNames.length || !!principles.length || !!metric

  const matches = useMemo(() => sessionClips.filter(c => {
    const athlete = athleteById(c.athleteId)
    if (q) {
      const hay = `${c.title} ${athlete?.name || ''} ${c.principles.join(' ')}`.toLowerCase()
      if (!hay.includes(q.toLowerCase())) return false
    }
    if (athleteNames.length && !athleteNames.includes(athlete?.name)) return false
    if (principles.length && !principles.some(p => c.principles.includes(p))) return false
    if (m && threshold != null && c.peaks[m.key] < threshold) return false
    return true
  }), [q, athleteNames, principles, metric, threshold])

  // A drill is shown when it still has a matching clip. With no filters on,
  // every drill is shown and its full playback with it.
  const groups = videoDrills
    .map(d => ({ drill: d, clips: matches.filter(c => c.drillId === d.id) }))
    .filter(g => !active || g.clips.length)

  const share = (target, clip) => setToast(shareMessage(target, clip))

  return (
    <Box>
      {/* -------------------------------------------------------- header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h6">Video</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Clips are imported automatically from Hudl and grouped by the drill they were tagged against.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          <Box sx={{ textAlign: 'right' }}>
            <Chip size="small" label={HUDL.connected ? 'Hudl connected' : 'Hudl not connected'}
              sx={{ height: 22, fontSize: 11, bgcolor: colors.green_100, color: colors.white }} />
            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 0.25 }}>
              Last synced {HUDL.lastSync}
            </Typography>
          </Box>
          <Button variant="outlined" startIcon={<SyncIcon />}
            onClick={() => setToast('Checking Hudl for new clips')}>
            Sync from Hudl
          </Button>
        </Box>
      </Box>

      {/* ------------------------------------------------------- filters */}
      <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 2, mb: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <SearchInput label="Search clips" value={q} onChange={e => setQ(e.target.value)}
            sx={{ width: 230 }} />
          <MultiSelect label="Athlete" options={athleteOptions} value={athleteNames}
            onChange={setAthleteNames} selectAll sx={{ width: 260 }} />
          <MultiSelect label="Principle" options={principleOptions} value={principles}
            onChange={setPrinciples} selectAll sx={{ width: 300 }} />
          <SelectField label="Peak metric" value={metric} onChange={e => chooseMetric(e.target.value)}
            options={[{ value: NO_METRIC, label: 'Any' },
              ...PEAK_METRICS.map(x => ({ value: x.key, label: x.label }))]}
            sx={{ width: 210 }} />
          {m && (
            <Box sx={{ width: 250, pt: 0.5 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {m.label} at least {m.format(threshold)}
              </Typography>
              <Slider size="small" value={threshold} min={m.min} max={m.max} step={m.step}
                onChange={(_, v) => setThreshold(v)} valueLabelDisplay="auto"
                valueLabelFormat={v => m.format(v)} aria-label={`Minimum ${m.label}`} />
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 2, mt: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {matches.length} of {sessionClips.length} clips
            {active ? ' match the filters' : ' in this session'}
          </Typography>
          {active && <Button variant="text" size="small" onClick={clear}>Clear filters</Button>}
        </Box>
      </Paper>

      {/* -------------------------------------------------- drill groups */}
      {groups.map(({ drill, clips }) => (
        <Accordion key={drill.id} defaultExpanded disableGutters elevation={0}
          sx={{ border: `1px solid ${colors.neutral_300}`, borderRadius: 1, mb: 2,
            '&::before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', pr: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>{drill.order}</Typography>
              <Typography variant="subtitle1">{drill.name}</Typography>
              <Chip size="small" label={shortActivity(drill.activity)} sx={{ height: 22, fontSize: 11 }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {drill.minutes} min · {clips.length} clip{clips.length === 1 ? '' : 's'}
              </Typography>
              <PrincipleChips principles={drill.principles} max={2} />
            </Box>
          </AccordionSummary>
          <Divider />
          <AccordionDetails sx={{ p: 2 }}>
            <FullDrillCard drill={drill} onOpen={() => setOpen({ full: drill })} />

            <Typography variant="subtitle2" sx={{ mt: 2.5, mb: 1 }}>
              Individual clips
            </Typography>
            {clips.length ? (
              <Box sx={{ display: 'grid', gap: 2,
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' } }}>
                {clips.map(c => (
                  <ClipTile key={c.id} clip={c} onOpen={cl => setOpen({ clip: cl, drill })}
                    onShare={share} highlightMetric={metric || undefined} />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary', py: 2 }}>
                No individual clips from this drill match the filters. The full drill playback above is
                still the whole team, uncut.
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      {!groups.length && (
        <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, py: 8, textAlign: 'center' }}>
          <VideoLibraryIcon sx={{ color: colors.grey_150, fontSize: 32 }} />
          <Typography variant="subtitle1" sx={{ mt: 1 }}>No clips match the filters</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Widen the athlete, principle or peak metric filter to see the rest of the session.
          </Typography>
          <Button variant="outlined" onClick={clear}>Clear filters</Button>
        </Paper>
      )}

      {/* --------------------------------------------------------- player */}
      {open?.clip && (
        <ClipDialog clip={open.clip} drill={open.drill} onClose={() => setOpen(null)} onShare={share} />
      )}
      {open?.full && (
        <ClipDialog onClose={() => setOpen(null)} onShare={share} drill={open.full}
          clip={{
            id: `${open.full.id}-full`,
            file: open.full.fullClip.file,
            title: `${open.full.name} — full drill`,
            at: '00:00:00',
            duration: open.full.fullClip.duration,
            principles: open.full.principles,
            peaks: squadPeaks(open.full.id),
            athleteId: null,
            goals: [],
          }} />
      )}

      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast('')} message={toast} />
    </Box>
  )
}

/**
 * The whole-team playback has no single athlete, so its peaks are the best any
 * athlete hit inside that drill — which is what a coach reads them as anyway.
 */
function squadPeaks(drillId) {
  const inDrill = sessionClips.filter(c => c.drillId === drillId)
  const best = key => inDrill.reduce((a, c) => Math.max(a, c.peaks[key]), 0)
  return { speed: best('speed'), acceleration: best('acceleration'), heartRate: best('heartRate') }
}
