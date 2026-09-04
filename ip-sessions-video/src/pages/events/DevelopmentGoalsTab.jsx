import { useMemo, useState } from 'react'
import {
  Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, Chip, Collapse, Divider,
  FormControlLabel, Paper, Snackbar, Typography,
} from '@mui/material'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import VideocamIcon from '@mui/icons-material/VideocamOutlined'
import OpenInNewIcon from '@mui/icons-material/OpenInNewOutlined'
import colors from '../../theme/tokens'
import { idpUrl } from '../../links'
import AthleteCell from '../../components/AthleteCell'
import { MultiSelect, SearchInput } from '../../components/form'
import { ClipDialog, ClipThumb, shareMessage } from '../../components/clips'
import { athleteById, positions } from '../../data/athletes'
import { GOAL_PLAN, goalsForAthlete, sessionClipsForGoal } from '../../data/goals'
import { PRINCIPLE_NAMES, clipSource, drillById, principleLabel } from '../../data/video'

/**
 * The athletes with goals on this event, in squad-list order. The live page
 * lists only the athletes who both took part and have a goal set, which is why
 * this is a fixed roster rather than everyone selected.
 */
const GOAL_ROSTER = [431887, 440559, 440316, 454521, 114397, 453803, 441234, 427191, 448120, 434584, 162023]

/** The two ways a goal gets worked on, and what the checkboxes mark off. */
const MARKS = [
  { key: 'individual', label: 'Individual Session' },
  { key: 'video', label: 'Video Session' },
]

const MarkCheckbox = ({ label, checked, onChange }) => (
  <FormControlLabel
    label={label} labelPlacement="start" sx={{ ml: 0, mr: 0, gap: 1 }}
    componentsProps={{ typography: { variant: 'body2' } }}
    control={<Checkbox size="small" checked={checked} onChange={e => onChange(e.target.checked)}
      icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckCircleIcon />} />}
  />
)

/* ------------------------------------------------------------ clip strip */

/**
 * The clips Hudl tagged against this goal. The count stays on the toggle so a
 * coach can see at a glance whether a goal has evidence, and collapse the ones
 * they are not working on.
 */
function GoalClips({ clips, onOpen }) {
  // Open by default: the clips are the evidence, and a coach reading a goal
  // should not have to ask for them one row at a time.
  const [open, setOpen] = useState(true)
  if (!clips.length) {
    return (
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.75 }}>
        No clips tagged to this goal yet
      </Typography>
    )
  }
  return (
    <Box sx={{ mt: 0.75 }}>
      <Button variant="text" size="small" startIcon={<VideocamIcon />}
        endIcon={<ExpandMoreIcon sx={{ transform: open ? 'rotate(180deg)' : 'none', transition: '.15s' }} />}
        onClick={() => setOpen(v => !v)} sx={{ ml: -0.5 }}>
        {clips.length} tagged clip{clips.length === 1 ? '' : 's'}
      </Button>
      <Collapse in={open} unmountOnExit>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', pt: 1 }}>
          {clips.map(c => {
            const s = clipSource(c)
            return (
              <Box key={c.id} sx={{ width: 176 }}>
                <ClipThumb file={c.file} duration={c.duration} height={99}
                  onClick={() => onOpen(c)} />
                <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, mt: 0.5, lineHeight: 1.3 }}>
                  {c.title}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                  {s.sessionName} · {s.date}
                </Typography>
              </Box>
            )
          })}
        </Box>
      </Collapse>
    </Box>
  )
}

/* ------------------------------------------------------------------- page */

export default function DevelopmentGoalsTab() {
  const [q, setQ] = useState('')
  const [athleteNames, setAthleteNames] = useState([])
  const [pos, setPos] = useState([])
  const [principles, setPrinciples] = useState([])
  const [marked, setMarked] = useState({})   // `${athleteId}:${goalId}:${markKey}` -> true
  const [starred, setStarred] = useState(() => new Set())
  const [clip, setClip] = useState(null)
  const [toast, setToast] = useState('')

  // Session-scoped: a goal shows only the clips tagged to it from *this*
  // session, not the season's evidence. That whole body of clips — other
  // sessions, every game — belongs to the athlete's development plan, where a
  // season is the point.
  const rows = useMemo(() => GOAL_ROSTER.map(id => ({
    athlete: athleteById(id),
    goals: goalsForAthlete(id).map(g => ({
      ...g,
      clips: sessionClipsForGoal(id, g.goalId),
    })),
  })).filter(r => r.athlete), [])

  const athleteOptions = useMemo(() => rows.map(r => r.athlete.name).sort(), [rows])
  const positionOptions = useMemo(
    () => positions.filter(p => rows.some(r => r.athlete.position === p)), [rows],
  )
  const principleOptions = useMemo(
    () => PRINCIPLE_NAMES.filter(p => rows.some(r => r.goals.some(g => g.principle === p))), [rows],
  )

  const active = !!q || !!athleteNames.length || !!pos.length || !!principles.length

  const shown = rows
    .filter(r => !athleteNames.length || athleteNames.includes(r.athlete.name))
    .filter(r => !pos.length || pos.includes(r.athlete.position))
    .map(r => ({
      ...r,
      goals: r.goals
        .filter(g => !principles.length || principles.includes(g.principle))
        .filter(g => !q || `${g.title} ${g.description} ${r.athlete.name}`.toLowerCase().includes(q.toLowerCase())),
    }))
    .filter(r => r.goals.length)

  const isMarked = (a, g, k) => !!marked[`${a}:${g}:${k}`]
  const setMark = (a, g, k, v) => setMarked(m => ({ ...m, [`${a}:${g}:${k}`]: v }))

  const clear = () => { setQ(''); setAthleteNames([]); setPos([]); setPrinciples([]) }

  const toggleStar = id => setStarred(s2 => {
    const next = new Set(s2)
    if (next.has(id)) next.delete(id); else next.add(id)
    return next
  })

  return (
    <Box>
      {/* No section title: the tab is already called Development goals. The card,
          the field widths and the Clear filters button match the Video tab, so
          moving between the two tabs does not move the controls. */}
      <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 2, mb: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <SearchInput label="Search goals" value={q} onChange={e => setQ(e.target.value)}
            sx={{ width: 230 }} />
          <MultiSelect label="Athlete" options={athleteOptions} value={athleteNames}
            onChange={setAthleteNames} selectAll sx={{ width: 260 }} />
          <MultiSelect label="Positions" options={positionOptions} value={pos}
            onChange={setPos} selectAll sx={{ width: 220 }} />
          <MultiSelect label="Principle" options={principleOptions} value={principles}
            onChange={setPrinciples} selectAll sx={{ width: 300 }} />
          {active && <Button variant="text" onClick={clear} sx={{ flexShrink: 0 }}>Clear filters</Button>}
        </Box>
      </Paper>

      {/* One accordion per athlete, all closed. Thirty goals laid flat is a
          page nobody reads; the header carries enough — who, their position,
          how many goals, how much evidence — to pick the athlete you want. */}
      {shown.map(({ athlete, goals }) => {
        const clipCount = goals.reduce((n, g) => n + g.clips.length, 0)
        return (
          <Accordion key={athlete.id} disableGutters elevation={0}
            TransitionProps={{ unmountOnExit: true }}
            sx={{ border: `1px solid ${colors.neutral_300}`, borderRadius: 1, mb: 2,
              '&::before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 2, width: '100%', pr: 2 }}>
                <AthleteCell athlete={athlete} size={34} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {goals.length} goal{goals.length === 1 ? '' : 's'}
                  {clipCount ? ` · ${clipCount} clip${clipCount === 1 ? '' : 's'}` : ' · no clips yet'}
                </Typography>
              </Box>
            </AccordionSummary>
            <Divider />
            {/* The same light grey field the development plan uses, with each
                goal on a white card on top of it. */}
            <AccordionDetails sx={{ p: 2, bgcolor: colors.neutral_100 }}>
              {goals.map((g, i) => (
                <Paper key={g.goalId} variant="outlined"
                  sx={{ borderColor: colors.neutral_300, px: 2, py: 2,
                    mb: i < goals.length - 1 ? 2 : 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{g.title}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        {g.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 0.75, flexWrap: 'wrap' }}>
                        <Chip size="small" label={principleLabel(g.principle)}
                          sx={{ height: 22, fontSize: 11, bgcolor: colors.blue_50, color: colors.blue_100 }} />
                        <Chip size="small" label={g.status}
                          sx={{ height: 22, fontSize: 11,
                            bgcolor: g.status === 'Achieved' ? colors.green_100
                              : g.status === 'Needs work' ? colors.orange_100 : colors.neutral_300,
                            color: g.status === 'On track' ? colors.grey_200 : colors.white }} />
                      </Box>
                      <GoalClips clips={g.clips} onOpen={setClip} />
                    </Box>

                    <Box sx={{ width: 210, flexShrink: 0, pt: 0.25 }}>
                      <Chip size="small" label={GOAL_PLAN}
                        sx={{ height: 22, fontSize: 11, bgcolor: colors.blue_50, color: colors.blue_100 }} />
                    </Box>

                    <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column',
                      alignItems: 'flex-end' }}>
                      {MARKS.map(mk => (
                        <MarkCheckbox key={mk.key} label={mk.label}
                          checked={isMarked(athlete.id, g.goalId, mk.key)}
                          onChange={v => setMark(athlete.id, g.goalId, mk.key, v)} />
                      ))}
                    </Box>
                  </Box>
                </Paper>
              ))}

              {/* The way through to the whole season. This tab is one session's
                  worth of a goal; the plan is where the rest of the evidence,
                  the coach's notes and the two reviews live. */}
              <Button variant="text" endIcon={<OpenInNewIcon />} component="a"
                href={idpUrl(athlete.id)} target="_blank" rel="noopener"
                sx={{ mt: 2, ml: -0.5 }}>
                Open {athlete.first || athlete.name.split(',')[1]?.trim()}’s development plan
              </Button>
            </AccordionDetails>
          </Accordion>
        )
      })}

      {!shown.length && (
        <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, py: 8, textAlign: 'center' }}>
          <Typography variant="subtitle1">No development goals match the filters</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Widen the athlete, position or principle filter to see the rest of the squad.
          </Typography>
          <Button variant="outlined" onClick={clear}>Clear filters</Button>
        </Paper>
      )}

      {clip && (
        <ClipDialog clip={clip} drill={clip.drillId ? drillById(clip.drillId) : null}
          onClose={() => setClip(null)} soloAthlete
          starred={starred.has(clip.id)} onStar={toggleStar}
          onShare={(t, c) => setToast(shareMessage(t, c))} />
      )}
      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast('')} message={toast} />
    </Box>
  )
}
