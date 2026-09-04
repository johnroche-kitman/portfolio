import { useMemo, useState } from 'react'
import {
  Box, Button, Checkbox, Chip, Collapse, Divider, FormControlLabel, Menu, MenuItem, Paper,
  Snackbar, Typography,
} from '@mui/material'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import VideocamIcon from '@mui/icons-material/VideocamOutlined'
import colors from '../../theme/tokens'
import AthleteCell from '../../components/AthleteCell'
import { MultiSelect, SearchInput } from '../../components/form'
import { ClipDialog, ClipThumb, shareMessage } from '../../components/clips'
import { athleteById, positions } from '../../data/athletes'
import { GOAL_TYPES, GOAL_PLAN, goalsForAthlete, sessionClipsForGoal } from '../../data/goals'
import { PRINCIPLE_NAMES, clipSource, drillById, principleLabel } from '../../data/video'

/**
 * The athletes with goals on this event, in squad-list order. The live page
 * lists only the athletes who both took part and have a goal set, which is why
 * this is a fixed roster rather than everyone selected.
 */
const GOAL_ROSTER = [431887, 440316, 454521, 114397, 453803, 441234, 427191, 448120, 434584, 162023]

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

/* ---------------------------------------------------------------- markers */

const MarkAllMenu = ({ label = 'Mark all', onMark }) => {
  const [el, setEl] = useState(null)
  return (
    <>
      <Button variant="text" size="small" endIcon={<KeyboardArrowDownIcon />}
        onClick={e => setEl(e.currentTarget)}>{label}</Button>
      <Menu anchorEl={el} open={!!el} onClose={() => setEl(null)}>
        {MARKS.map(m => (
          <MenuItem key={m.key} sx={{ minWidth: 200 }}
            onClick={() => { setEl(null); onMark(m.key, true) }}>
            Mark {m.label}
          </MenuItem>
        ))}
        <Divider />
        {MARKS.map(m => (
          <MenuItem key={`${m.key}-off`} sx={{ minWidth: 200 }}
            onClick={() => { setEl(null); onMark(m.key, false) }}>
            Clear {m.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

/* ------------------------------------------------------------------- page */

export default function DevelopmentGoalsTab() {
  const [q, setQ] = useState('')
  const [athleteNames, setAthleteNames] = useState([])
  const [pos, setPos] = useState([])
  const [types, setTypes] = useState([])
  const [principles, setPrinciples] = useState([])
  const [marked, setMarked] = useState({})   // `${athleteId}:${goalId}:${markKey}` -> true
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

  const active = !!q || !!athleteNames.length || !!pos.length || !!types.length || !!principles.length

  const shown = rows
    .filter(r => !athleteNames.length || athleteNames.includes(r.athlete.name))
    .filter(r => !pos.length || pos.includes(r.athlete.position))
    .map(r => ({
      ...r,
      goals: r.goals
        .filter(g => !principles.length || principles.includes(g.principle))
        .filter(g => !types.length || types.includes(GOAL_PLAN))
        .filter(g => !q || `${g.title} ${g.description} ${r.athlete.name}`.toLowerCase().includes(q.toLowerCase())),
    }))
    .filter(r => r.goals.length)

  const isMarked = (a, g, k) => !!marked[`${a}:${g}:${k}`]
  const setMark = (a, g, k, v) => setMarked(m => ({ ...m, [`${a}:${g}:${k}`]: v }))

  const markAll = (k, v, scope) => {
    setMarked(m => {
      const next = { ...m }
      shown
        .filter(r => !scope || r.athlete.id === scope)
        .forEach(r => r.goals.forEach(g => { next[`${r.athlete.id}:${g.goalId}:${k}`] = v }))
      return next
    })
    setToast(v ? `Marked ${MARKS.find(x => x.key === k).label}` : `Cleared ${MARKS.find(x => x.key === k).label}`)
  }

  const clear = () => { setQ(''); setAthleteNames([]); setPos([]); setTypes([]); setPrinciples([]) }

  return (
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, overflow: 'hidden' }}>
      {/* No section title: the tab is already called Development goals. */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <SearchInput label="Search" value={q} onChange={e => setQ(e.target.value)} sx={{ width: 190 }} />
          <MultiSelect label="Athlete" options={athleteOptions} value={athleteNames}
            onChange={setAthleteNames} selectAll sx={{ width: 195 }} />
          <MultiSelect label="Positions" options={positionOptions} value={pos}
            onChange={setPos} selectAll sx={{ width: 195 }} />
          <MultiSelect label="Type" options={GOAL_TYPES} value={types} onChange={setTypes}
            sx={{ width: 195 }} />
          <MultiSelect label="Principle" options={principleOptions} value={principles}
            onChange={setPrinciples} selectAll sx={{ width: 195 }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          {active && <Button variant="text" size="small" onClick={clear}>Clear filters</Button>}
          <MarkAllMenu onMark={(k, v) => markAll(k, v)} />
        </Box>
      </Box>

      {shown.map(({ athlete, goals }) => (
        <Box key={athlete.id}>
          {/* Athlete group header, as the live page renders it. */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2,
            px: 3, py: 1.25, bgcolor: colors.neutral_100, borderTop: `1px solid ${colors.neutral_300}`,
            borderBottom: `1px solid ${colors.neutral_300}` }}>
            <AthleteCell athlete={athlete} size={34} />
            <MarkAllMenu onMark={(k, v) => markAll(k, v, athlete.id)} />
          </Box>

          {goals.map((g, i) => (
            <Box key={g.goalId} sx={{ px: 3, py: 2,
              borderBottom: i < goals.length - 1 ? `1px solid ${colors.neutral_200}` : 0 }}>
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

                <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  {MARKS.map(mk => (
                    <MarkCheckbox key={mk.key} label={mk.label}
                      checked={isMarked(athlete.id, g.goalId, mk.key)}
                      onChange={v => setMark(athlete.id, g.goalId, mk.key, v)} />
                  ))}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      ))}

      {!shown.length && (
        <Box sx={{ py: 6, textAlign: 'center', borderTop: `1px solid ${colors.neutral_300}` }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            No development goals match the filters
          </Typography>
          <Button variant="outlined" onClick={clear}>Clear filters</Button>
        </Box>
      )}

      {clip && (
        <ClipDialog clip={clip} drill={clip.drillId ? drillById(clip.drillId) : null}
          onClose={() => setClip(null)}
          onShare={(t, c) => setToast(shareMessage(t, c))} />
      )}
      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast('')} message={toast} />
    </Paper>
  )
}
