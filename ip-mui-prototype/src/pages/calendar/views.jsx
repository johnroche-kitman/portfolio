import { Box, Chip, Paper, Typography } from '@mui/material'
import colors from '../../theme/tokens'
import { DAY_NAMES, TYPE_COLOR, gameDayMarker, toMinutes } from '../../data/events'

const TODAY_DATE = 28          // 28 Aug 2026
const TODAY_DOW = 4            // Friday
const LONG_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TODAY_BG = `${colors.blue_100}0f`

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6) // 06:00 – 22:00
const ROW_H = 44

/** Solid filled block: title, time range, squad — as the live calendar renders it. */
const EventBlock = ({ ev, onOpen, style, dense }) => (
  <Box
    onClick={e => { e.stopPropagation(); onOpen(ev, e.currentTarget) }}
    sx={{
      bgcolor: TYPE_COLOR[ev.type], color: colors.white, borderRadius: 0.5,
      px: 0.75, py: dense ? 0.25 : 0.5, cursor: 'pointer', overflow: 'hidden',
      '&:hover': { filter: 'brightness(0.94)' }, ...style,
    }}
  >
    <Typography variant="caption" noWrap sx={{ fontWeight: 700, display: 'block', color: 'inherit' }}>
      {ev.title}
    </Typography>
    {!dense && (
      <>
        <Typography variant="caption" noWrap sx={{ display: 'block', color: 'inherit', opacity: 0.9 }}>
          {ev.start} - {ev.end}
        </Typography>
        <Typography variant="caption" noWrap sx={{ display: 'block', color: 'inherit', opacity: 0.9 }}>
          {ev.squad}
        </Typography>
      </>
    )}
  </Box>
)

/* ---------------------------------------------------------------- Month */
export function MonthView({ getEvents, onOpen, onSlot }) {
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
          const dow = i % 7
          const dateNum = i - 3
          const inMonth = dateNum >= 1 && dateNum <= 31
          const isToday = inMonth && dateNum === TODAY_DATE
          const evs = inMonth ? getEvents(dow) : []
          const shown = evs.slice(0, 4)
          return (
            <Box
              key={i}
              onClick={e => inMonth && onSlot?.(`${LONG_DAYS[dow]} ${dateNum} August 2026`, e.currentTarget)}
              sx={{
                minHeight: 128, p: 1, cursor: inMonth ? 'pointer' : 'default',
                borderRight: `1px solid ${colors.neutral_300}`, borderBottom: `1px solid ${colors.neutral_300}`,
                bgcolor: isToday ? TODAY_BG : inMonth ? 'transparent' : colors.neutral_100,
                opacity: inMonth ? 1 : 0.55,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Box sx={{
                  width: 22, height: 22, display: 'grid', placeItems: 'center', borderRadius: '50%',
                  bgcolor: isToday ? colors.grey_400 : 'transparent',
                }}>
                  <Typography variant="caption" sx={{
                    fontWeight: isToday ? 700 : 600,
                    color: isToday ? colors.white : inMonth ? 'text.primary' : 'text.secondary',
                  }}>
                    {inMonth ? dateNum : ''}
                  </Typography>
                </Box>
                {inMonth && (
                  <Typography variant="caption" sx={{ color: colors.grey_150, fontSize: 11 }}>
                    {gameDayMarker(dow)}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.375 }}>
                {shown.map(ev => <EventBlock key={ev.id} ev={ev} onOpen={onOpen} dense />)}
                {evs.length > shown.length && (
                  <Typography variant="caption" sx={{ color: colors.blue_100, cursor: 'pointer', pl: 0.5 }}>
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

/* ------------------------------------------------- shared time-grid parts */
const DayHeader = ({ dow, date, isToday }) => (
  <Box sx={{
    px: 1.5, py: 1, borderBottom: `1px solid ${colors.neutral_300}`,
    borderLeft: `1px solid ${colors.neutral_300}`, bgcolor: isToday ? TODAY_BG : colors.white,
    position: 'sticky', top: 0, zIndex: 2,
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
      <Typography variant="body2" sx={{ fontWeight: isToday ? 700 : 600 }}>
        {DAY_NAMES[dow]} {date}
      </Typography>
      <Typography variant="caption" sx={{ color: colors.grey_150, fontSize: 11 }}>{gameDayMarker(dow)}</Typography>
    </Box>
  </Box>
)

const TimeGutter = () => (
  <Box sx={{ position: 'sticky', left: 0, zIndex: 1, bgcolor: colors.white }}>
    {HOURS.map(h => (
      <Box key={h} sx={{ height: ROW_H, pr: 1, textAlign: 'right', borderBottom: `1px solid ${colors.neutral_200}` }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{String(h).padStart(2, '0')}:00</Typography>
      </Box>
    ))}
  </Box>
)

const DayColumn = ({ dow, date, getEvents, onOpen, onSlot, isToday }) => (
  <Box
    onClick={e => onSlot?.(`${LONG_DAYS[dow]} ${date} August 2026 13:00 - 13:15`, e.currentTarget)}
    sx={{ position: 'relative', borderLeft: `1px solid ${colors.neutral_300}`,
      bgcolor: isToday ? TODAY_BG : 'transparent', cursor: 'pointer' }}
  >
    {HOURS.map(h => <Box key={h} sx={{ height: ROW_H, borderBottom: `1px solid ${colors.neutral_200}` }} />)}
    {getEvents(dow).map(ev => {
      const top = ((toMinutes(ev.start) - 6 * 60) / 60) * ROW_H
      const height = Math.max(((toMinutes(ev.end) - toMinutes(ev.start)) / 60) * ROW_H, 30)
      if (top < 0) return null
      return (
        <EventBlock key={ev.id} ev={ev} onOpen={onOpen}
          style={{ position: 'absolute', top, left: 3, right: 3, height }} />
      )
    })}
  </Box>
)

/* ----------------------------------------------------------------- Week */
export function WeekView({ getEvents, onOpen, onSlot }) {
  return (
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, overflow: 'auto', height: '100%' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '64px repeat(7, minmax(130px, 1fr))', minWidth: 980 }}>
        <Box sx={{ borderBottom: `1px solid ${colors.neutral_300}`, position: 'sticky', top: 0, left: 0,
          zIndex: 3, bgcolor: colors.white }} />
        {DAY_NAMES.map((_, i) => (
          <DayHeader key={i} dow={i} date={24 + i} isToday={i === TODAY_DOW} />
        ))}

        {/* all-day row */}
        <Box sx={{ borderBottom: `1px solid ${colors.neutral_300}`, px: 1, py: 1.5, position: 'sticky', left: 0,
          zIndex: 1, bgcolor: colors.white }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>all-day</Typography>
        </Box>
        {DAY_NAMES.map((_, i) => (
          <Box key={i} sx={{ borderBottom: `1px solid ${colors.neutral_300}`, borderLeft: `1px solid ${colors.neutral_300}`,
            minHeight: 40, bgcolor: i === TODAY_DOW ? TODAY_BG : 'transparent' }} />
        ))}

        <TimeGutter />
        {DAY_NAMES.map((_, i) => (
          <DayColumn key={i} dow={i} date={24 + i} getEvents={getEvents} onOpen={onOpen} onSlot={onSlot}
            isToday={i === TODAY_DOW} />
        ))}
      </Box>
    </Paper>
  )
}

/* ------------------------------------------------------------------ Day */
export function DayView({ getEvents, onOpen, onSlot, dayIndex = TODAY_DOW }) {
  const isToday = dayIndex === TODAY_DOW
  return (
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, overflow: 'auto', height: '100%' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '72px 1fr' }}>
        <Box sx={{ borderBottom: `1px solid ${colors.neutral_300}`, position: 'sticky', top: 0, zIndex: 3,
          bgcolor: colors.white }} />
        <DayHeader dow={dayIndex} date={24 + dayIndex} isToday={isToday} />

        <Box sx={{ borderBottom: `1px solid ${colors.neutral_300}`, px: 1.5, py: 1.5 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>all-day</Typography>
        </Box>
        <Box sx={{ borderBottom: `1px solid ${colors.neutral_300}`, borderLeft: `1px solid ${colors.neutral_300}`,
          minHeight: 40, bgcolor: isToday ? TODAY_BG : 'transparent' }} />

        <TimeGutter />
        <DayColumn dow={dayIndex} date={24 + dayIndex} getEvents={getEvents} onOpen={onOpen} onSlot={onSlot}
          isToday={isToday} />
      </Box>
    </Paper>
  )
}

/* ----------------------------------------------------------------- List */
export function ListView({ getEvents, onOpen }) {
  return (
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, overflow: 'auto', height: '100%' }}>
      {DAY_NAMES.map((d, i) => {
        const evs = getEvents(i)
        if (!evs.length) return null
        const isToday = i === TODAY_DOW
        return (
          <Box key={d}>
            <Box sx={{
              px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              bgcolor: isToday ? TODAY_BG : colors.neutral_100,
              borderBottom: `1px solid ${colors.neutral_300}`,
              position: 'sticky', top: 0, zIndex: 1,
            }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {d}, {24 + i} Aug{isToday ? ' · Today' : ''}
              </Typography>
              <Typography variant="caption" sx={{ color: colors.grey_150 }}>{gameDayMarker(i)}</Typography>
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
                <Box sx={{ width: 10, height: 10, borderRadius: 0.25, bgcolor: TYPE_COLOR[ev.type], flexShrink: 0 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, flex: 1, minWidth: 0 }} noWrap>{ev.title}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>{ev.squad}</Typography>
                <Chip size="small" label={ev.type} variant="outlined" sx={{ height: 20, fontSize: 11 }} />
              </Box>
            ))}
          </Box>
        )
      })}
    </Paper>
  )
}
