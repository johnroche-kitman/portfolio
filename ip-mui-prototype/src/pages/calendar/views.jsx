import { useEffect, useRef, useState } from 'react'
import { Box, Chip, Paper, Typography } from '@mui/material'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import colors from '../../theme/tokens'
import {
  DAY_NAMES, EVENT_TYPES, TYPE_COLOR, gameDayMarker, gameweekLabel, gameweeksIn, toMinutes,
} from '../../data/events'

const TODAY_DATE = 28          // 28 Aug 2026
const TODAY_DOW = 4            // Friday
const WEEK_START = 24          // the week on screen runs Mon 24 – Sun 30 Aug
const LONG_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TODAY_BG = `${colors.blue_100}0f`

// Gameweek band, lifted from the live calendar: a pale amber strip carrying the
// fixture it belongs to, drawn across every day the gameweek covers.
const GW_BG = '#FFF7E5'

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6) // 06:00 – 22:00
const ROW_H = 44
const GRID_START = 6 * 60
const SNAP = 15                // a drag snaps to quarter hours

const minToY = m => ((m - GRID_START) / 60) * ROW_H
const yToMin = y => GRID_START + Math.round((y / ROW_H) * 60 / SNAP) * SNAP
const fmt = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

/** Sessions and games carry a completion state; plain events do not. */
const CompletionMark = ({ ev }) => {
  if (ev.type === EVENT_TYPES.EVENT) return null
  const Icon = ev.complete ? CheckBoxIcon : CheckBoxOutlineBlankIcon
  return <Icon sx={{ fontSize: 13, color: TYPE_COLOR[ev.type], flexShrink: 0 }} />
}

/** Tinted block with a heavier left edge in the event type's colour. */
const EventBlock = ({ ev, onOpen, style, dense }) => (
  <Box
    onClick={e => { e.stopPropagation(); onOpen(ev, e.currentTarget) }}
    // An existing event swallows the interaction: pressing on one must not also
    // start a drag-to-create on the column underneath, as it does in the live app.
    onMouseDown={e => e.stopPropagation()}
    sx={{
      bgcolor: `${TYPE_COLOR[ev.type]}1f`, borderLeft: `3px solid ${TYPE_COLOR[ev.type]}`,
      borderRadius: '2px', px: 0.75, py: dense ? 0.125 : 0.5, cursor: 'pointer', overflow: 'hidden',
      '&:hover': { bgcolor: `${TYPE_COLOR[ev.type]}33` }, ...style,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
      <CompletionMark ev={ev} />
      <Typography variant="caption" noWrap sx={{ fontWeight: 700 }}>{ev.title}</Typography>
    </Box>
    {!dense && (
      <>
        <Typography variant="caption" noWrap sx={{ display: 'block', color: 'text.secondary' }}>
          {ev.start} - {ev.end}
        </Typography>
        <Typography variant="caption" noWrap sx={{ display: 'block', color: 'text.secondary' }}>
          {ev.squad}
        </Typography>
      </>
    )}
  </Box>
)

/**
 * Bands for one span of days, laid on a grid so each starts and ends on the
 * right day. `from` is the date sitting in column 1.
 */
const GameweekBands = ({ from, cols = 7 }) => {
  const bands = gameweeksIn(from, from + cols - 1)
  if (!bands.length) return null
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, rowGap: 0.25, px: 0.25, mb: 0.5 }}>
      {bands.map(gw => (
        <Box
          key={gw.id}
          title={gameweekLabel(gw)}
          sx={{
            gridColumn: `${gw.clipFrom - from + 1} / ${gw.clipTo - from + 2}`,
            bgcolor: GW_BG, borderRadius: '3px', px: 0.75, py: 0.125, overflow: 'hidden',
          }}
        >
          <Typography variant="caption" noWrap sx={{ display: 'block', fontWeight: 600, fontSize: 12 }}>
            {gameweekLabel(gw)}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

const GameDay = ({ date }) => (
  <Typography variant="caption" noWrap sx={{ color: colors.grey_150, fontSize: 11 }}>
    {gameDayMarker(date)}
  </Typography>
)

/* ---------------------------------------------------------------- Month */
export function MonthView({ getEvents, onOpen, onSlot, showGameweeks = true, showGameDay = true }) {
  const weeks = Array.from({ length: 6 }, (_, w) => w)
  return (
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, overflow: 'hidden' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {DAY_NAMES.map(d => (
          <Box key={d} sx={{ px: 1.5, py: 1, borderBottom: `1px solid ${colors.neutral_300}` }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{d}</Typography>
          </Box>
        ))}
      </Box>

      {weeks.map(w => {
        const first = w * 7 - 3 // date sitting in the Monday column
        return (
          <Box key={w} sx={{ position: 'relative', borderBottom: `1px solid ${colors.neutral_300}` }}>
            {/* Column washes and rules run the full height of the row, behind everything. */}
            <Box sx={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {DAY_NAMES.map((_, i) => {
                const date = first + i
                const inMonth = date >= 1 && date <= 31
                return (
                  <Box key={i} sx={{
                    borderRight: `1px solid ${colors.neutral_300}`,
                    bgcolor: date === TODAY_DATE ? TODAY_BG : inMonth ? 'transparent' : colors.neutral_100,
                  }} />
                )
              })}
            </Box>

            <Box sx={{ position: 'relative', minHeight: 128, pb: 1 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', px: 1, pt: 1, pb: 0.5 }}>
                {DAY_NAMES.map((_, i) => {
                  const date = first + i
                  const inMonth = date >= 1 && date <= 31
                  const isToday = date === TODAY_DATE
                  return (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      gap: 0.5, pr: 1, minWidth: 0 }}>
                      <Box sx={{
                        width: 22, height: 22, display: 'grid', placeItems: 'center', borderRadius: '50%',
                        bgcolor: isToday ? colors.grey_400 : 'transparent', flexShrink: 0,
                      }}>
                        <Typography variant="caption" sx={{
                          fontWeight: isToday ? 700 : 600,
                          color: isToday ? colors.white : inMonth ? 'text.primary' : 'text.secondary',
                        }}>
                          {inMonth ? date : ''}
                        </Typography>
                      </Box>
                      {inMonth && showGameDay && <GameDay date={date} />}
                    </Box>
                  )
                })}
              </Box>

              {showGameweeks && <GameweekBands from={first} />}

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', px: 0.75 }}>
                {DAY_NAMES.map((_, i) => {
                  const date = first + i
                  const inMonth = date >= 1 && date <= 31
                  const evs = inMonth ? getEvents(i) : []
                  const shown = evs.slice(0, 4)
                  return (
                    <Box
                      key={i}
                      onClick={e => inMonth && onSlot?.(`${LONG_DAYS[i]} ${date} August 2026`, e.currentTarget)}
                      sx={{
                        display: 'flex', flexDirection: 'column', gap: 0.375, px: 0.25, minWidth: 0, minHeight: 60,
                        cursor: inMonth ? 'pointer' : 'default', opacity: inMonth ? 1 : 0.55,
                      }}
                    >
                      {shown.map(ev => <EventBlock key={ev.id} ev={ev} onOpen={onOpen} dense />)}
                      {evs.length > shown.length && (
                        <Typography variant="caption" sx={{ color: colors.blue_100, cursor: 'pointer', pl: 0.5 }}>
                          +{evs.length - shown.length} more
                        </Typography>
                      )}
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Box>
        )
      })}
    </Paper>
  )
}

/* ------------------------------------------------- shared time-grid parts */
const DayHeader = ({ dow, date, isToday, showGameDay }) => (
  <Box sx={{
    px: 1.5, py: 1, borderBottom: `1px solid ${colors.neutral_300}`,
    borderLeft: `1px solid ${colors.neutral_300}`, bgcolor: isToday ? TODAY_BG : colors.white,
    position: 'sticky', top: 0, zIndex: 2,
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
      <Typography variant="body2" sx={{ fontWeight: isToday ? 700 : 600 }}>
        {DAY_NAMES[dow]} {date}
      </Typography>
      {showGameDay && <GameDay date={date} />}
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

const AllDayLabel = () => (
  <Box sx={{ borderBottom: `1px solid ${colors.neutral_300}`, px: 1, py: 1.5, position: 'sticky', left: 0,
    zIndex: 1, bgcolor: colors.white }}>
    <Typography variant="caption" sx={{ color: 'text.secondary' }}>all-day</Typography>
  </Box>
)

/** All-day lane: column washes and rules behind, gameweek bands on top. */
const AllDayLane = ({ from, cols, todayCol, showGameweeks }) => (
  <Box sx={{ gridColumn: '2 / -1', position: 'relative', borderBottom: `1px solid ${colors.neutral_300}`,
    minHeight: 40 }}>
    <Box sx={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: cols }, (_, i) => (
        <Box key={i} sx={{ borderLeft: `1px solid ${colors.neutral_300}`,
          bgcolor: i === todayCol ? TODAY_BG : 'transparent' }} />
      ))}
    </Box>
    <Box sx={{ position: 'relative', pt: 0.75 }}>
      {showGameweeks && <GameweekBands from={from} cols={cols} />}
    </Box>
  </Box>
)

/**
 * Dragging down the column paints the slot before anything opens, so you can see
 * what you picked; the wash stays put while the create popover is up.
 */
const DayColumn = ({ dow, date, getEvents, onOpen, onSelect, isToday, selection }) => {
  const ref = useRef(null)
  const [drag, setDrag] = useState(null)

  const minsAt = clientY => {
    const r = ref.current.getBoundingClientRect()
    return Math.min(Math.max(yToMin(clientY - r.top), GRID_START), 22 * 60)
  }

  // Finishing outside the column still ends the drag, so track it on the window.
  useEffect(() => {
    if (!drag) return undefined
    const move = e => setDrag(d => (d ? { ...d, to: minsAt(e.clientY) } : d))
    const up = () => {
      setDrag(null)
      const from = Math.min(drag.from, drag.to)
      const to = Math.max(from + SNAP, Math.max(drag.from, drag.to))
      const r = ref.current.getBoundingClientRect()
      const top = r.top + minToY(from)
      const height = minToY(to) - minToY(from)
      // A virtual anchor, so the popover opens against the painted slot itself.
      const anchor = {
        nodeType: 1,
        getBoundingClientRect: () => new DOMRect(r.left, top, r.width, height),
      }
      onSelect?.(dow, { from, to }, `${LONG_DAYS[dow]} ${date} August 2026 ${fmt(from)} - ${fmt(to)}`, anchor)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
  }, [drag])

  const shown = drag
    ? { from: Math.min(drag.from, drag.to), to: Math.max(drag.from, drag.to) }
    : selection

  return (
    <Box
      ref={ref}
      onMouseDown={e => { if (e.button === 0) { const m = minsAt(e.clientY); setDrag({ from: m, to: m + SNAP }) } }}
      sx={{ position: 'relative', borderLeft: `1px solid ${colors.neutral_300}`,
        bgcolor: isToday ? TODAY_BG : 'transparent', cursor: 'pointer',
        userSelect: drag ? 'none' : 'auto' }}
    >
      {HOURS.map(h => <Box key={h} sx={{ height: ROW_H, borderBottom: `1px solid ${colors.neutral_200}` }} />)}

      {shown && (
        <Box sx={{
          position: 'absolute', left: 3, right: 3, pointerEvents: 'none',
          top: minToY(shown.from), height: Math.max(minToY(shown.to) - minToY(shown.from), 14),
          bgcolor: `${colors.blue_100}29`, border: `1px solid ${colors.blue_100}`, borderRadius: '2px',
          px: 0.75, py: 0.125, overflow: 'hidden', zIndex: 3,
        }}>
          <Typography variant="caption" noWrap sx={{ display: 'block', fontWeight: 700, color: colors.blue_300 }}>
            {fmt(shown.from)} - {fmt(Math.max(shown.to, shown.from + SNAP))}
          </Typography>
        </Box>
      )}

      {getEvents(dow).map(ev => {
        const top = minToY(toMinutes(ev.start))
        const height = Math.max(minToY(toMinutes(ev.end)) - minToY(toMinutes(ev.start)), 30)
        if (top < 0) return null
        return (
          <EventBlock key={ev.id} ev={ev} onOpen={onOpen}
            style={{ position: 'absolute', top, left: 3, right: 3, height, zIndex: 2 }} />
        )
      })}
    </Box>
  )
}

/** One painted slot at a time per grid, cleared when the create popover closes. */
function useSlotSelection(onSlot, slotOpen) {
  const [sel, setSel] = useState(null)
  useEffect(() => { if (!slotOpen) setSel(null) }, [slotOpen])
  const select = (dow, range, info, anchor) => { setSel({ dow, ...range }); onSlot?.(info, anchor) }
  return [sel, select]
}

/* ----------------------------------------------------------------- Week */
export function WeekView({ getEvents, onOpen, onSlot, slotOpen, showGameweeks = true, showGameDay = true }) {
  const [sel, select] = useSlotSelection(onSlot, slotOpen)
  return (
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, overflow: 'auto', height: '100%' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '64px repeat(7, minmax(130px, 1fr))', minWidth: 980 }}>
        <Box sx={{ borderBottom: `1px solid ${colors.neutral_300}`, position: 'sticky', top: 0, left: 0,
          zIndex: 3, bgcolor: colors.white }} />
        {DAY_NAMES.map((_, i) => (
          <DayHeader key={i} dow={i} date={WEEK_START + i} isToday={i === TODAY_DOW} showGameDay={showGameDay} />
        ))}

        <AllDayLabel />
        <AllDayLane from={WEEK_START} cols={7} todayCol={TODAY_DOW} showGameweeks={showGameweeks} />

        <TimeGutter />
        {DAY_NAMES.map((_, i) => (
          <DayColumn key={i} dow={i} date={WEEK_START + i} getEvents={getEvents} onOpen={onOpen}
            onSelect={select} selection={sel?.dow === i ? sel : null} isToday={i === TODAY_DOW} />
        ))}
      </Box>
    </Paper>
  )
}

/* ------------------------------------------------------------------ Day */
export function DayView({ getEvents, onOpen, onSlot, slotOpen, dayIndex = TODAY_DOW, showGameweeks = true, showGameDay = true }) {
  const [sel, select] = useSlotSelection(onSlot, slotOpen)
  const isToday = dayIndex === TODAY_DOW
  const date = WEEK_START + dayIndex
  return (
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, overflow: 'auto', height: '100%' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '72px 1fr' }}>
        <Box sx={{ borderBottom: `1px solid ${colors.neutral_300}`, position: 'sticky', top: 0, zIndex: 3,
          bgcolor: colors.white }} />
        <DayHeader dow={dayIndex} date={date} isToday={isToday} showGameDay={showGameDay} />

        <AllDayLabel />
        <AllDayLane from={date} cols={1} todayCol={isToday ? 0 : -1} showGameweeks={showGameweeks} />

        <TimeGutter />
        <DayColumn dow={dayIndex} date={date} getEvents={getEvents} onOpen={onOpen}
          onSelect={select} selection={sel?.dow === dayIndex ? sel : null} isToday={isToday} />
      </Box>
    </Paper>
  )
}

/* ----------------------------------------------------------------- List */
export function ListView({ getEvents, onOpen, showGameweeks = true, showGameDay = true }) {
  return (
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, overflow: 'auto', height: '100%' }}>
      {DAY_NAMES.map((d, i) => {
        const evs = getEvents(i)
        if (!evs.length) return null
        const date = WEEK_START + i
        const isToday = i === TODAY_DOW
        const bands = showGameweeks ? gameweeksIn(date, date) : []
        return (
          <Box key={d}>
            <Box sx={{
              px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2,
              bgcolor: isToday ? TODAY_BG : colors.neutral_100,
              borderBottom: `1px solid ${colors.neutral_300}`,
              position: 'sticky', top: 0, zIndex: 1,
            }}>
              <Typography variant="body2" sx={{ fontWeight: 700, flexShrink: 0 }}>
                {d}, {date} Aug{isToday ? ' · Today' : ''}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                {bands.map(gw => (
                  <Chip key={gw.id} size="small" label={gameweekLabel(gw)}
                    sx={{ bgcolor: GW_BG, height: 20, fontSize: 11, fontWeight: 600 }} />
                ))}
                {showGameDay && <GameDay date={date} />}
              </Box>
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
                <CompletionMark ev={ev} />
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

export { CompletionMark, EventBlock, GameweekBands, GW_BG }
