import { Box, Chip, Paper, Typography } from '@mui/material'
import colors from '../../theme/tokens'
import { DAY_NAMES, TYPE_COLOR, gameDayMarker, toMinutes } from '../../data/events'

const Pill = ({ ev, onClick, dense }) => (
  <Box
    onClick={e => onClick(ev, e.currentTarget)}
    sx={{
      display: 'flex', alignItems: 'center', gap: 0.75, cursor: 'pointer',
      px: 0.75, py: dense ? 0.25 : 0.5, borderRadius: 0.5, mb: 0.5,
      bgcolor: `${TYPE_COLOR[ev.type]}1a`,
      borderLeft: `3px solid ${TYPE_COLOR[ev.type]}`,
      '&:hover': { bgcolor: `${TYPE_COLOR[ev.type]}2e` },
    }}
  >
    <Typography variant="caption" noWrap sx={{ fontWeight: 600, flex: 1, minWidth: 0 }}>
      {ev.title}
    </Typography>
    {!dense && (
      <Typography variant="caption" sx={{ color: 'text.secondary', flexShrink: 0 }}>
        {ev.start}
      </Typography>
    )}
  </Box>
)

/* ---------------------------------------------------------------- Month */
export function MonthView({ getEvents, onOpen, monthLabel }) {
  // Six weeks of cells; day index maps into the fixture week so every row has content.
  const cells = Array.from({ length: 42 }, (_, i) => i)
  return (
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, overflow: 'hidden' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {DAY_NAMES.map(d => (
          <Box key={d} sx={{ px: 1.5, py: 1, borderBottom: `1px solid ${colors.neutral_300}` }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{d}</Typography>
          </Box>
        ))}
        {cells.map(i => {
          const dayOfWeek = i % 7
          const dateNum = i - 3
          const inMonth = dateNum >= 1 && dateNum <= 31
          const evs = inMonth ? getEvents(dayOfWeek) : []
          const shown = evs.slice(0, 2)
          return (
            <Box
              key={i}
              sx={{
                minHeight: 104, p: 1, borderRight: `1px solid ${colors.neutral_300}`,
                borderBottom: `1px solid ${colors.neutral_300}`,
                bgcolor: inMonth ? 'transparent' : colors.neutral_100,
                opacity: inMonth ? 1 : 0.55,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: inMonth ? 'text.primary' : 'text.secondary' }}>
                  {inMonth ? dateNum : ''}
                </Typography>
                {inMonth && (
                  <Typography variant="caption" sx={{ color: colors.grey_150, fontSize: 11 }}>
                    {gameDayMarker(dayOfWeek)}
                  </Typography>
                )}
              </Box>
              <Box sx={{ mt: 0.5 }}>
                {shown.map(ev => <Pill key={ev.id} ev={ev} onClick={onOpen} dense />)}
                {evs.length > shown.length && (
                  <Typography variant="caption" sx={{ color: colors.blue_100, cursor: 'pointer' }}>
                    +{evs.length - shown.length} more
                  </Typography>
                )}
              </Box>
            </Box>
          )
        })}
      </Box>
    </Paper>
  )
}

/* ----------------------------------------------------------------- Week */
const HOURS = Array.from({ length: 17 }, (_, i) => i + 6) // 06:00 – 22:00
const ROW_H = 44

export function WeekView({ getEvents, onOpen }) {
  return (
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, overflow: 'auto' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: `64px repeat(7, minmax(120px, 1fr))`, minWidth: 900 }}>
        <Box sx={{ borderBottom: `1px solid ${colors.neutral_300}` }} />
        {DAY_NAMES.map((d, i) => (
          <Box key={d} sx={{ px: 1.5, py: 1, borderBottom: `1px solid ${colors.neutral_300}`, borderLeft: `1px solid ${colors.neutral_300}` }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>{d}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{24 + i} Aug</Typography>
          </Box>
        ))}

        <Box>
          {HOURS.map(h => (
            <Box key={h} sx={{ height: ROW_H, pr: 1, textAlign: 'right', borderBottom: `1px solid ${colors.neutral_200}` }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>{String(h).padStart(2, '0')}:00</Typography>
            </Box>
          ))}
        </Box>

        {DAY_NAMES.map((_, dayIdx) => {
          const evs = getEvents(dayIdx)
          return (
            <Box key={dayIdx} sx={{ position: 'relative', borderLeft: `1px solid ${colors.neutral_300}` }}>
              {HOURS.map(h => <Box key={h} sx={{ height: ROW_H, borderBottom: `1px solid ${colors.neutral_200}` }} />)}
              {evs.map(ev => {
                const top = ((toMinutes(ev.start) - 6 * 60) / 60) * ROW_H
                const height = Math.max(((toMinutes(ev.end) - toMinutes(ev.start)) / 60) * ROW_H, 22)
                if (top < 0) return null
                return (
                  <Box
                    key={ev.id} onClick={e => onOpen(ev, e.currentTarget)}
                    sx={{
                      position: 'absolute', top, left: 3, right: 3, height, overflow: 'hidden',
                      px: 0.75, py: 0.25, borderRadius: 0.5, cursor: 'pointer',
                      bgcolor: `${TYPE_COLOR[ev.type]}1f`, borderLeft: `3px solid ${TYPE_COLOR[ev.type]}`,
                      '&:hover': { bgcolor: `${TYPE_COLOR[ev.type]}33` },
                    }}
                  >
                    <Typography variant="caption" noWrap sx={{ fontWeight: 600, display: 'block' }}>{ev.title}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{ev.start}–{ev.end}</Typography>
                  </Box>
                )
              })}
            </Box>
          )
        })}
      </Box>
    </Paper>
  )
}

/* ------------------------------------------------------------------ Day */
export function DayView({ getEvents, onOpen, dayIndex = 0 }) {
  const evs = getEvents(dayIndex)
  return (
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, overflow: 'auto' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '72px 1fr' }}>
        <Box>
          {HOURS.map(h => (
            <Box key={h} sx={{ height: ROW_H, pr: 1.5, textAlign: 'right', borderBottom: `1px solid ${colors.neutral_200}` }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>{String(h).padStart(2, '0')}:00</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ position: 'relative', borderLeft: `1px solid ${colors.neutral_300}` }}>
          {HOURS.map(h => <Box key={h} sx={{ height: ROW_H, borderBottom: `1px solid ${colors.neutral_200}` }} />)}
          {evs.map(ev => {
            const top = ((toMinutes(ev.start) - 6 * 60) / 60) * ROW_H
            const height = Math.max(((toMinutes(ev.end) - toMinutes(ev.start)) / 60) * ROW_H, 26)
            if (top < 0) return null
            return (
              <Box
                key={ev.id} onClick={e => onOpen(ev, e.currentTarget)}
                sx={{
                  position: 'absolute', top, left: 8, right: 8, height, overflow: 'hidden',
                  px: 1.25, py: 0.5, borderRadius: 0.5, cursor: 'pointer',
                  bgcolor: `${TYPE_COLOR[ev.type]}1f`, borderLeft: `3px solid ${TYPE_COLOR[ev.type]}`,
                  '&:hover': { bgcolor: `${TYPE_COLOR[ev.type]}33` },
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{ev.title}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {ev.start}–{ev.end} · {ev.sessionType || ev.eventType || ev.competition}
                </Typography>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Paper>
  )
}

/* ----------------------------------------------------------------- List */
export function ListView({ getEvents, onOpen }) {
  return (
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300 }}>
      {DAY_NAMES.map((d, i) => {
        const evs = getEvents(i)
        if (!evs.length) return null
        return (
          <Box key={d}>
            <Box sx={{ px: 2, py: 1, bgcolor: colors.neutral_100, borderBottom: `1px solid ${colors.neutral_300}` }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{d}, {24 + i} Aug</Typography>
            </Box>
            {evs.map(ev => (
              <Box
                key={ev.id} onClick={e => onOpen(ev, e.currentTarget)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 1.25, cursor: 'pointer',
                  borderBottom: `1px solid ${colors.neutral_200}`, '&:hover': { bgcolor: colors.neutral_100 },
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary', width: 104, flexShrink: 0 }}>
                  {ev.start} - {ev.end}
                </Typography>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: TYPE_COLOR[ev.type], flexShrink: 0 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, flex: 1, minWidth: 0 }} noWrap>{ev.title}</Typography>
                <Chip size="small" label={ev.type} variant="outlined" sx={{ height: 20, fontSize: 11 }} />
              </Box>
            ))}
          </Box>
        )
      })}
    </Paper>
  )
}
