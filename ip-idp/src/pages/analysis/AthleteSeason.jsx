import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Box, Button, Chip, Divider, Paper, Snackbar, Typography } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import { ClipDialog, ClipScroller, shareMessage } from '../../components/clips'
import { TrendChart, StackedBars } from '../../components/SeasonCharts'
import { initialsOf, photoUrl } from '../../data/athletes'
import { GOAL_PLAN, goalsForAthlete } from '../../data/goals'
import { drillById, principleLabel } from '../../data/video'
import { FEATURED_ATHLETE, featuredAthlete, seasonFor, squadAverage, summaryTiles } from '../../data/season'

const STATUS_TONE = {
  'Needs work': { bg: colors.orange_200, fg: colors.white },
  'On track': { bg: colors.neutral_300, fg: colors.grey_200 },
  Achieved: { bg: colors.green_200, fg: colors.white },
}

/* ------------------------------------------------------------------ tiles */

/**
 * The season in six numbers.
 *
 * Each carries a second line, because a total on its own is not a fact a coach
 * can use: 780 minutes means one thing across nine games and another across
 * four. The note is what makes the headline readable.
 */
const StatTiles = ({ tiles }) => (
  <Box sx={{ display: 'grid', gap: 2,
    gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' } }}>
    {tiles.map(t => (
      <Paper key={t.key} variant="outlined"
        sx={{ borderColor: colors.neutral_300, p: 2, height: '100%' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          {t.label}
        </Typography>
        <Typography variant="h5" sx={{ mt: 0.25, fontVariantNumeric: 'tabular-nums' }}>
          {t.value}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{t.note}</Typography>
      </Paper>
    ))}
  </Box>
)

/* ---------------------------------------------------------------- profile */

const ProfileCard = ({ athlete, games, goals, clipCount }) => {
  const last = games[games.length - 1]
  return (
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar src={photoUrl(athlete)} alt=""
          sx={{ width: 64, height: 64, bgcolor: colors.neutral_300, color: colors.grey_100, fontSize: 22 }}>
          {initialsOf(athlete.name)}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5">{athlete.name}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {athlete.position} · {athlete.squad}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 1, columnGap: 2 }}>
        {[
          ['Squad number', `#${athlete.id % 40 || 9}`],
          ['Plan', GOAL_PLAN],
          ['Goals', `${goals.length} on the plan`],
          ['Video evidence', `${clipCount} clips tagged`],
          ['Last game', `${last.short} · ${last.date}`],
        ].map(([label, value]) => (
          <Box key={label} sx={{ display: 'contents' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{value}</Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* The plan, in one line each. The detail lives on the athlete's own page,
          and the row links there rather than repeating it here. */}
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Development goals</Typography>
      {goals.map(g => {
        const tone = STATUS_TONE[g.status] || STATUS_TONE['On track']
        return (
          <Box key={g.goalId} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.75,
            borderTop: `1px solid ${colors.neutral_200}` }}>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{g.title}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {principleLabel(g.principle)} · {g.clips.length} clips
              </Typography>
            </Box>
            <Chip size="small" label={g.status}
              sx={{ height: 20, fontSize: 10, fontWeight: 600, flexShrink: 0,
                bgcolor: tone.bg, color: tone.fg }} />
          </Box>
        )
      })}
    </Paper>
  )
}

/* ------------------------------------------------------------------- page */

export default function AthleteSeason() {
  const navigate = useNavigate()
  const athlete = featuredAthlete()

  const games = useMemo(() => seasonFor(FEATURED_ATHLETE), [])
  const tiles = useMemo(() => summaryTiles(FEATURED_ATHLETE), [])
  const goals = useMemo(() => goalsForAthlete(FEATURED_ATHLETE, athlete?.name), [athlete?.name])

  // One rail of every clip on the plan. A clip can be filed against two goals,
  // so it is de-duplicated before it gets here — the same clip twice on a rail
  // reads as a bug, not as evidence for two arguments.
  const clips = useMemo(() => {
    const seen = new Map()
    goals.forEach(g => g.clips.forEach(c => { if (!seen.has(c.id)) seen.set(c.id, c) }))
    return [...seen.values()]
  }, [goals])

  const [starred, setStarred] = useState(() => new Set())
  const [clip, setClip] = useState(null)
  const [toast, setToast] = useState('')

  const toggleStar = id => setStarred(s => {
    const next = new Set(s)
    if (next.has(id)) next.delete(id); else next.add(id)
    return next
  })

  // Starred first, then newest: a coach who has picked the two clips that make
  // the case should not have to scroll the season to find them again.
  const ordered = useMemo(() => {
    const rank = c => (starred.has(c.id) ? 0 : 1)
    return [...clips].sort((a, b) => rank(a) - rank(b))
  }, [clips, starred])

  // The axis carries the opposition and nothing else — nine names is all that
  // fits. The squad plays some sides twice, so the tooltip names the fixture in
  // full, with the date and whether it was home or away.
  const labels = games.map(g => g.short)
  const tips = games.map(g => `${g.opposition} · ${g.date}`)
  const squadDistance = useMemo(() => squadAverage('distancePer90'), [])

  return (
    <AppShell title="Analysis">
      <Box sx={{ px: 3, pt: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5">Athlete season report</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {games.length} games played · 2026/27 season to date
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <Button variant="outlined" endIcon={<ChevronRightIcon />}
          onClick={() => navigate(`/individual_development_plans/${FEATURED_ATHLETE}`)}>
          Open development plan
        </Button>
      </Box>

      <Box sx={{ p: 3, display: 'grid', gap: 3, minWidth: 0 }}>
        <StatTiles tiles={tiles} />

        <Box sx={{ display: 'grid', gap: 3, alignItems: 'start',
          gridTemplateColumns: { xs: '1fr', lg: '340px 1fr' } }}>
          <ProfileCard athlete={athlete} games={games} goals={goals} clipCount={clips.length} />

          <Box sx={{ display: 'grid', gap: 3, minWidth: 0, gridTemplateColumns: 'minmax(0, 1fr)' }}>
            <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 3, minWidth: 0 }}>
              <TrendChart
                title="Distance per 90, game by game"
                caption="Rate rather than total, so a substitute appearance is comparable with a full game."
                labels={labels} tips={tips} unit=" m"
                series={[
                  { name: athlete.first, values: games.map(g => g.distancePer90) },
                  { name: 'Squad average', values: squadDistance },
                ]} />
            </Paper>

            <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 3, minWidth: 0 }}>
              <StackedBars
                title="Coaching actions per game"
                caption="The three actions his plan is written around. Stacked, so the bar is his total involvement."
                labels={labels} tips={tips}
                series={[
                  { name: 'Crosses', values: games.map(g => g.crosses) },
                  { name: 'Overlapping runs', values: games.map(g => g.overlaps) },
                  { name: 'Recoveries', values: games.map(g => g.recoveries) },
                ]} />
            </Paper>
          </Box>
        </Box>

        {/* The rail the page is really for: every piece of video filed against
            his plan, in one place, playable without leaving the report. */}
        <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 3, minWidth: 0 }}>
          <Box sx={{ mb: 1.5 }}>
            <Typography variant="subtitle1" sx={{ fontSize: 18 }}>Tagged video</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Every clip filed against {athlete.first}’s development goals this season. Scroll for more.
            </Typography>
          </Box>
          <ClipScroller clips={ordered} onOpen={setClip} starred={starred} onStar={toggleStar}
            label="Clips on the plan" />
        </Paper>
      </Box>

      {clip && (
        <ClipDialog clip={clip} drill={clip.drillId ? drillById(clip.drillId) : null}
          onClose={() => setClip(null)} soloAthlete
          starred={starred.has(clip.id)} onStar={toggleStar}
          onShare={target => setToast(shareMessage(target, clip))} />
      )}

      <Snackbar open={!!toast} autoHideDuration={3200} onClose={() => setToast('')}
        message={toast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
    </AppShell>
  )
}
