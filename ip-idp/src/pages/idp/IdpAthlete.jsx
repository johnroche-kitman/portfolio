import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Chip, Divider, Paper,
  Snackbar, TextField, Tooltip, Typography,
} from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LockIcon from '@mui/icons-material/LockOutlined'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import { ClipDialog, ClipThumb, shareMessage } from '../../components/clips'
import { athleteById } from '../../data/athletes'
import { GOAL_PLAN, goalsForAthlete } from '../../data/goals'
import { clipSource, drillById, principleLabel } from '../../data/video'

const STATUS_TONE = {
  'Needs work': { bg: colors.orange_200, fg: colors.white },
  'On track': { bg: colors.neutral_300, fg: colors.grey_200 },
  Achieved: { bg: colors.green_200, fg: colors.white },
}

/**
 * Today, in the format every note in the plan already uses. The month is
 * written out rather than taken from toLocaleDateString, which gives "Sept" in
 * en-GB and would leave one note reading differently from all the others.
 */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const today = () => {
  const d = new Date()
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

/* ---------------------------------------------------------------- evidence */

/**
 * The clips Hudl tagged against this goal, with where each one came from. The
 * source line is the point of the section: a coach arguing that a goal is
 * progressing wants the game and the date, not just the footage.
 */
const Evidence = ({ clips, onOpen }) => {
  if (!clips.length) {
    return (
      <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, bgcolor: colors.neutral_100,
        p: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          No clips tagged to this goal yet. Clips appear here as soon as the analyst tags them
          against the goal in Hudl.
        </Typography>
      </Paper>
    )
  }
  return (
    <Box sx={{ display: 'grid', gap: 2,
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' } }}>
      {clips.map(c => {
        const s = clipSource(c)
        return (
          <Paper key={c.id} variant="outlined" sx={{ borderColor: colors.neutral_300, overflow: 'hidden' }}>
            <ClipThumb file={c.file} duration={c.duration} height={112} onClick={() => onOpen(c)}
              badge={<Chip size="small" label={s.type}
                sx={{ height: 18, fontSize: 10, fontWeight: 700, color: colors.white,
                  bgcolor: s.type === 'Game' ? colors.blue_100 : colors.green_200 }} />} />
            <Box sx={{ p: 1.5 }}>
              <Typography variant="subtitle2" sx={{ lineHeight: 1.35 }}>{c.title}</Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 0.25 }}>
                {s.type === 'Game'
                  ? `${s.opposition} · ${s.competition}`
                  : `${s.sessionName} · ${s.competition}`}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                {s.date} · {c.at}
              </Typography>
            </Box>
          </Paper>
        )
      })}
    </Box>
  )
}

/* -------------------------------------------------------------- commentary */

/**
 * The coach's running commentary on one goal. Notes are appended, never replaced,
 * so the plan reads as a season rather than a snapshot — which is why the
 * composer says "Add note" and there is no way to edit what is already there.
 */
function Commentary({ notes, composing, onCompose, onCancel, onSave }) {
  const [draft, setDraft] = useState('')

  const save = () => {
    const body = draft.trim()
    if (!body) return
    onSave(body)
    setDraft('')
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle2">
          Progress notes {notes.length ? `(${notes.length})` : ''}
        </Typography>
        {!composing && <Button variant="text" size="small" onClick={onCompose}>Add note</Button>}
      </Box>

      {composing && (
        <Box sx={{ mb: 2 }}>
          <TextField fullWidth multiline minRows={3} autoFocus label="Note"
            placeholder="How is this goal going?" value={draft}
            onChange={e => setDraft(e.target.value)} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Button onClick={save} disabled={!draft.trim()}>Add note</Button>
            <Button variant="text" onClick={() => { setDraft(''); onCancel() }}>Cancel</Button>
            <Typography variant="caption" sx={{ color: 'text.secondary', ml: 'auto' }}>
              Stamped {today()} · Tom Hargreaves
            </Typography>
          </Box>
        </Box>
      )}

      {notes.length ? (
        <Box>
          {notes.map((n, i) => (
            <Box key={`${n.date}-${i}`}
              sx={{ display: 'flex', gap: 1.5, py: 1.25,
                borderTop: i ? `1px solid ${colors.neutral_200}` : 0 }}>
              <Avatar sx={{ width: 28, height: 28, fontSize: 11, flexShrink: 0,
                bgcolor: colors.neutral_300, color: colors.grey_100 }}>
                {n.author.split(' ').map(w => w[0]).join('')}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>{n.author}</Box>
                  {' · '}{n.date}
                </Typography>
                <Typography variant="body2">{n.body}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        !composing && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Nothing written on this goal yet.
          </Typography>
        )
      )}
    </Box>
  )
}

/* ------------------------------------------------------------------- goal */

const GoalCard = ({ goal, index, composing, onCompose, onCancel, onSave, onOpenClip }) => {
  const tone = STATUS_TONE[goal.status] || STATUS_TONE['On track']
  return (
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 3, mb: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1 }}>
        <Typography variant="h6" sx={{ color: colors.grey_150, lineHeight: 1.4 }}>{index + 1}</Typography>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontSize: 18 }}>{goal.title}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
            {goal.description}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
            <Tooltip title="Related principle">
              <Chip size="small" label={principleLabel(goal.principle)}
                sx={{ height: 22, fontSize: 11, bgcolor: colors.blue_50, color: colors.blue_100 }} />
            </Tooltip>
            <Chip size="small" label={GOAL_PLAN}
              sx={{ height: 22, fontSize: 11, bgcolor: colors.neutral_200 }} />
          </Box>
        </Box>
        <Chip size="small" label={goal.status}
          sx={{ height: 22, fontSize: 11, fontWeight: 600, flexShrink: 0,
            bgcolor: tone.bg, color: tone.fg }} />
      </Box>

      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Tagged clips {goal.clips.length ? `(${goal.clips.length})` : ''}
      </Typography>
      <Evidence clips={goal.clips} onOpen={onOpenClip} />

      <Divider sx={{ my: 2 }} />
      <Commentary notes={goal.notes} composing={composing} onCompose={onCompose}
        onCancel={onCancel} onSave={onSave} />
    </Paper>
  )
}

/* ------------------------------------------------------------------- page */

/** The two sections that are named in the plan but not built in this prototype. */
const STUB_SECTIONS = [
  { key: 'coach', title: 'Coaches review', hint: 'The coach’s end-of-phase write-up against the club’s review framework.' },
  { key: 'player', title: 'Player’s review', hint: 'The athlete’s own reflection, completed before the review meeting.' },
]

export default function IdpAthlete() {
  const { id } = useParams()
  const navigate = useNavigate()
  const athlete = athleteById(id)

  // Notes live in page state so a note added in the prototype stays on screen.
  const [goals, setGoals] = useState(() => goalsForAthlete(Number(id)))
  const [composing, setComposing] = useState(null)   // goalId
  const [clip, setClip] = useState(null)
  const [toast, setToast] = useState('')

  const totals = useMemo(() => ({
    clips: new Set(goals.flatMap(g => g.clips.map(c => c.id))).size,
    notes: goals.reduce((n, g) => n + g.notes.length, 0),
  }), [goals])

  if (!athlete) {
    return (
      <AppShell title="Athletes">
        <Box sx={{ p: 4 }}>
          <Typography variant="h6">Athlete not found</Typography>
          <Button variant="outlined" sx={{ mt: 2 }}
            onClick={() => navigate('/individual_development_plans')}>
            Back to the list
          </Button>
        </Box>
      </AppShell>
    )
  }

  const addNote = (goalId, body) => {
    setGoals(gs => gs.map(g => (g.goalId === goalId
      ? { ...g, notes: [{ date: today(), author: 'Tom Hargreaves', body }, ...g.notes] }
      : g)))
    setComposing(null)
    setToast('Note added to the goal')
  }

  return (
    <AppShell title="Athletes">
      <Box sx={{ px: 3, pt: 2 }}>
        <Button variant="text" startIcon={<ChevronLeftIcon />} sx={{ ml: -1 }}
          onClick={() => navigate('/individual_development_plans')}>
          Back
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
          <Avatar sx={{ width: 52, height: 52, bgcolor: colors.neutral_300, color: colors.grey_100,
            fontSize: 18 }}>
            {athlete.name.split(/[\s,]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('')}
          </Avatar>
          <Box>
            <Typography variant="h5">{athlete.name}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
              {[
                ['Squad', athlete.squad],
                ['Position', athlete.position],
                ['Plan', GOAL_PLAN],
                ['Evidence', `${totals.clips} clips · ${totals.notes} notes`],
              ].map(([label, value], i, arr) => (
                <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>{label}: </Box>
                    {value}
                  </Typography>
                  {i < arr.length - 1 && <Divider orientation="vertical" flexItem />}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* ------------------------------------------------ development goals */}
        <Accordion defaultExpanded disableGutters elevation={0}
          sx={{ border: `1px solid ${colors.neutral_300}`, borderRadius: 1, mb: 2,
            '&::before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 3, py: 1 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontSize: 18 }}>Development goals</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {goals.length} goals to complete by the end of the season
              </Typography>
            </Box>
          </AccordionSummary>
          <Divider />
          <AccordionDetails sx={{ p: 3, bgcolor: colors.neutral_100 }}>
            {goals.length ? goals.map((g, i) => (
              <GoalCard key={g.goalId} goal={g} index={i} onOpenClip={setClip}
                composing={composing === g.goalId}
                onCompose={() => setComposing(g.goalId)}
                onCancel={() => setComposing(null)}
                onSave={body => addNote(g.goalId, body)} />
            )) : (
              <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, py: 6, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No development plan has been set for {athlete.first} this season.
                </Typography>
              </Paper>
            )}
          </AccordionDetails>
        </Accordion>

        {/* --------------------------------------------- the two stub sections */}
        {STUB_SECTIONS.map(s => (
          <Accordion key={s.key} disabled disableGutters elevation={0}
            sx={{ border: `1px solid ${colors.neutral_300}`, borderRadius: 1, mb: 2,
              '&::before': { display: 'none' },
              '&.Mui-disabled': { bgcolor: colors.white, opacity: 1 } }}>
            <AccordionSummary expandIcon={<LockIcon fontSize="small" />} sx={{ px: 3, py: 1 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontSize: 18, color: colors.grey_100 }}>
                  {s.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {s.hint} Not built in this prototype.
                </Typography>
              </Box>
            </AccordionSummary>
          </Accordion>
        ))}
      </Box>

      {clip && (
        <ClipDialog clip={clip} drill={clip.drillId ? drillById(clip.drillId) : null}
          onClose={() => setClip(null)} onShare={(t, c) => setToast(shareMessage(t, c))} />
      )}
      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast('')} message={toast} />
    </AppShell>
  )
}
