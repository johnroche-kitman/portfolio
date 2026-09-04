import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import colors from '../theme/tokens'

/**
 * Distance covered by each athlete over the drill, with a playhead that tracks
 * the video beside it.
 *
 * Drawn as SVG rather than pulled from a chart library: the playhead has to
 * follow `video.currentTime` frame by frame, and owning the geometry is what
 * makes that a one-line calculation instead of a fight with an abstraction.
 *
 * The palette is the validated five-slot categorical set — worst adjacent CVD
 * ΔE 9.1, worst normal-vision ΔE 19.6. Three of the five sit below 3:1 against
 * white, which is why every line is directly labelled at its end and a table
 * view exists: identity and value are never carried by colour alone.
 */
const SERIES = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4']

const M = { top: 16, right: 62, bottom: 26, left: 46 }
const PLOT_H = 210

const mmss = t => {
  const s = Math.max(0, Math.round(t))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/**
 * Axis ticks on round numbers, not on quarters of the maximum: a scale reading
 * 0 / 13 / 25 / 38 / 50 is arithmetic nobody wants to do. The step is the
 * smallest 1 / 2 / 2.5 / 5 x 10^n that fits the data in four or five ticks, and
 * the ceiling is the first multiple of it at or above the largest value.
 */
const niceScale = (v, minStep = 0) => {
  const target = Math.max(v, 1) / 4
  const pow = 10 ** Math.floor(Math.log10(target))
  const step = Math.max(([1, 2, 2.5, 5, 10].find(m => m * pow >= target) ?? 10) * pow, minStep)
  const max = Math.ceil(Math.max(v, 1) / step) * step
  const ticks = []
  for (let t = 0; t <= max + step / 2; t += step) ticks.push(Math.round(t * 100) / 100)
  return { max, ticks }
}

const comma = n => n.toLocaleString('en-GB')

export default function DistanceChart({
  series, duration, playhead = null, drillName, metrics = [], metric, onMetricChange,
}) {
  const [metricEl, setMetricEl] = useState(null)
  const wrapRef = useRef(null)
  const [width, setWidth] = useState(0)
  const [hidden, setHidden] = useState(() => new Set())
  const [hoverT, setHoverT] = useState(null)
  const [showTable, setShowTable] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return undefined
    const measure = () => setWidth(w => (el.offsetWidth > 0 ? el.offsetWidth : w))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Colour is bound to the athlete's slot in the series list, never to how many
  // are currently shown — hiding a line must not repaint the ones that remain.
  const colourOf = useMemo(
    () => Object.fromEntries(series.map((s, i) => [s.athleteId, SERIES[i % SERIES.length]])),
    [series],
  )

  const active = metrics.find(m => m.key === metric) || metrics[0]
    || { key: 'distance', label: 'Distance covered', caption: 'Cumulative metres', unit: 'm' }
  const suffix = active.unit ? ` ${active.unit}` : ''

  const shown = series.filter(s => !hidden.has(s.athleteId))
  // A count metric steps in whole numbers; a distance can step in halves.
  const { max: yMax, ticks: yTicks } = niceScale(
    Math.max(1, ...series.map(s => s.total)), active.unit ? 0 : 1,
  )
  const innerW = Math.max(120, width - M.left - M.right)
  const x = t => M.left + (t / Math.max(duration, 0.001)) * innerW
  const y = m => M.top + PLOT_H - (m / yMax) * PLOT_H

  const path = s => s.points.map((p, i) => `${i ? 'L' : 'M'}${x(p[0]).toFixed(1)} ${y(p[1]).toFixed(1)}`).join(' ')

  /** Metres for a series at time t, linearly between its samples. */
  const valueAt = (s, t) => {
    const step = duration / (s.points.length - 1)
    const i = Math.min(s.points.length - 2, Math.max(0, Math.floor(t / step)))
    const [t0, m0] = s.points[i]
    const [t1, m1] = s.points[i + 1]
    return t1 === t0 ? m0 : m0 + ((t - t0) / (t1 - t0)) * (m1 - m0)
  }

  const toggle = id => setHidden(h => {
    const next = new Set(h)
    if (next.has(id)) next.delete(id); else next.add(id)
    // Never leave the chart with nothing in it.
    return next.size === series.length ? h : next
  })

  // Pinned at 0:00 the readout is just a box of zeroes sitting over the plot,
  // so the playhead only claims the tooltip once it has actually moved.
  const readout = hoverT != null ? hoverT : (playhead > 0.05 ? playhead : null)
  const onMove = e => {
    const box = e.currentTarget.getBoundingClientRect()
    const t = ((e.clientX - box.left - M.left) / innerW) * duration
    setHoverT(Math.min(duration, Math.max(0, t)))
  }

  // End labels, nudged apart so two athletes on a similar total stay readable.
  const endLabels = (() => {
    const rows = shown
      .map(s => ({ id: s.athleteId, text: s.short, y: y(s.total) }))
      .sort((a, b) => a.y - b.y)
    for (let i = 1; i < rows.length; i += 1) {
      if (rows[i].y - rows[i - 1].y < 13) rows[i].y = rows[i - 1].y + 13
    }
    return rows
  })()

  return (
    <Box ref={wrapRef} sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 0.5 }}>
        <Box sx={{ minWidth: 0 }}>
          {/* The title is the metric picker. A caret that did not open anything
              would promise a choice the chart could not honour. */}
          <Button variant="text" onClick={e => setMetricEl(e.currentTarget)}
            endIcon={<ArrowDropDownIcon />} disabled={!metrics.length}
            sx={{ p: 0, minWidth: 0, fontSize: 16, fontWeight: 700, color: 'text.primary',
              '& .MuiButton-endIcon': { ml: 0.25 }, '&.Mui-disabled': { color: 'text.primary' } }}>
            {active.label}
          </Button>
          <Menu anchorEl={metricEl} open={!!metricEl} onClose={() => setMetricEl(null)}>
            {metrics.map(m => (
              <MenuItem key={m.key} selected={m.key === active.key} sx={{ minWidth: 240 }}
                onClick={() => { setMetricEl(null); onMetricChange?.(m.key) }}>
                {m.label}
              </MenuItem>
            ))}
          </Menu>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            {active.caption}{drillName ? ` · ${drillName}` : ''}
          </Typography>
        </Box>
        <Button variant="text" size="small" onClick={() => setShowTable(v => !v)}
          sx={{ flexShrink: 0 }}>
          {showTable ? 'Chart' : 'Table'}
        </Button>
      </Box>

      {showTable ? (
        <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 13,
          '& th, & td': { borderBottom: `1px solid ${colors.neutral_200}`, padding: '6px 8px', textAlign: 'right' },
          '& th:first-of-type, & td:first-of-type': { textAlign: 'left' },
          '& td': { fontVariantNumeric: 'tabular-nums' } }}>
          <thead>
            <tr>
              <Box component="th" sx={{ color: 'text.secondary', fontWeight: 700 }}>Athlete</Box>
              {[0.25, 0.5, 0.75, 1].map(f => (
                <Box component="th" key={f} sx={{ color: 'text.secondary', fontWeight: 700 }}>
                  {mmss(duration * f)}
                </Box>
              ))}
            </tr>
          </thead>
          <tbody>
            {series.map(s => (
              <tr key={s.athleteId}>
                <td>
                  <Box component="span" sx={{ display: 'inline-block', width: 12, height: 2, mr: 1,
                    verticalAlign: 'middle', bgcolor: colourOf[s.athleteId] }} />
                  {s.name}
                </td>
                {[0.25, 0.5, 0.75, 1].map(f => (
                  <td key={f}>{Math.round(valueAt(s, duration * f))}{suffix}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Box>
      ) : (
        <Box sx={{ position: 'relative' }}>
          <Box component="svg" width={Math.max(width, 1)} height={M.top + PLOT_H + M.bottom}
            onPointerMove={onMove} onPointerLeave={() => setHoverT(null)}
            role="img"
            aria-label={`${active.label} for ${shown.length} athletes over ${mmss(duration)}`}
            sx={{ display: 'block', touchAction: 'none' }}>
            {/* Grid and axes: hairline, solid, one step off the surface. */}
            {yTicks.map(t => (
              <g key={t}>
                <line x1={M.left} x2={M.left + innerW} y1={y(t)} y2={y(t)}
                  stroke={colors.neutral_300} strokeWidth="1" />
                <text x={M.left - 8} y={y(t) + 4} textAnchor="end"
                  fill={colors.grey_100} fontSize="11" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {comma(t)}
                </text>
              </g>
            ))}
            {[0, 0.25, 0.5, 0.75, 1].map(f => (
              <text key={f} x={x(duration * f)} y={M.top + PLOT_H + 16}
                textAnchor={f === 0 ? 'start' : f === 1 ? 'end' : 'middle'}
                fill={colors.grey_100} fontSize="11" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {mmss(duration * f)}
              </text>
            ))}

            {shown.map(s => (
              <path key={s.athleteId} d={path(s)} fill="none" stroke={colourOf[s.athleteId]}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            ))}

            {/* End marker with a surface ring, so crossing lines stay legible. */}
            {shown.map(s => (
              <circle key={s.athleteId} cx={x(duration)} cy={y(s.total)} r="4"
                fill={colourOf[s.athleteId]} stroke={colors.white} strokeWidth="2" />
            ))}

            {endLabels.map(l => (
              <text key={l.id} x={M.left + innerW + 10} y={l.y + 4}
                fill={colors.grey_100} fontSize="11">{l.text}</text>
            ))}

            {/* The playhead. Distinct from the hover crosshair: it is where the
                video is, not where the pointer is. */}
            {playhead != null && playhead >= 0 && (
              <g>
                <line x1={x(playhead)} x2={x(playhead)} y1={M.top} y2={M.top + PLOT_H}
                  stroke={colors.grey_200} strokeWidth="2" />
                {shown.map(s => (
                  <circle key={s.athleteId} cx={x(playhead)} cy={y(valueAt(s, playhead))} r="4"
                    fill={colourOf[s.athleteId]} stroke={colors.white} strokeWidth="2" />
                ))}
              </g>
            )}

            {hoverT != null && (
              <line x1={x(hoverT)} x2={x(hoverT)} y1={M.top} y2={M.top + PLOT_H}
                stroke={colors.grey_150} strokeWidth="1" />
            )}
          </Box>

          {/* Readout: one tooltip, every visible series. Values lead. */}
          {readout != null && width > 0 && (
            <Box sx={{ position: 'absolute', top: M.top,
              left: Math.min(Math.max(x(readout) + 12, M.left), Math.max(M.left, width - 148)),
              width: 136, pointerEvents: 'none', bgcolor: colors.white,
              border: `1px solid ${colors.neutral_300}`, borderRadius: 1, px: 1, py: 0.75,
              boxShadow: '0 2px 10px rgba(13,27,48,.12)' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700,
                display: 'block', mb: 0.25 }}>
                {mmss(readout)}
              </Typography>
              {shown.map(s => (
                <Box key={s.athleteId} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box sx={{ width: 10, height: 2, flexShrink: 0, bgcolor: colourOf[s.athleteId] }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                    {Math.round(valueAt(s, readout))}{suffix}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', ml: 'auto' }}>
                    {s.short}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Legend. Always present, and the way a line is switched off. */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
        {series.map(s => {
          const off = hidden.has(s.athleteId)
          return (
            <Box component="button" key={s.athleteId} type="button" onClick={() => toggle(s.athleteId)}
              aria-pressed={!off} title={off ? `Show ${s.name}` : `Hide ${s.name}`}
              sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 0.75, py: 0.25,
                font: 'inherit', fontSize: 12, cursor: 'pointer', borderRadius: 1,
                border: `1px solid ${off ? colors.neutral_300 : 'transparent'}`,
                bgcolor: off ? colors.white : colors.neutral_100,
                color: off ? colors.grey_100_50 : colors.grey_200,
                '&:hover': { bgcolor: colors.neutral_200 } }}>
              <Box sx={{ width: 12, height: 2, flexShrink: 0,
                bgcolor: off ? colors.grey_inactive : colourOf[s.athleteId] }} />
              {s.name}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
