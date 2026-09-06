import { useEffect, useRef, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import colors from '../theme/tokens'

/**
 * The two charts on the season dashboard.
 *
 * Same drawing conventions as the clip chart: SVG rather than a library, the
 * validated categorical palette, hairline solid gridlines, a legend whenever
 * there is more than one series, and a table view behind a toggle. The aqua in
 * the three-slot set sits below 3:1 on white, so the table is not optional —
 * it is the relief that keeps every value reachable without colour.
 */
const SERIES = ['#2a78d6', '#eb6834', '#1baf7a']

const M = { top: 16, right: 16, bottom: 52, left: 48 }   // room for two rows of fixture names

/** Axis ticks on round numbers rather than quarters of the maximum. */
const niceScale = (v, floor = 0) => {
  const target = Math.max(v - floor, 1) / 4
  const pow = 10 ** Math.floor(Math.log10(target))
  const step = ([1, 2, 2.5, 5, 10].find(m => m * pow >= target) ?? 10) * pow
  const min = Math.floor(floor / step) * step
  const max = Math.ceil(Math.max(v, 1) / step) * step
  const ticks = []
  for (let t = min; t <= max + step / 2; t += step) ticks.push(Math.round(t * 100) / 100)
  return { min, max, ticks }
}

/**
 * Where a rate chart's axis should start.
 *
 * Zero, unless every value sits in the top of the range — then a zero baseline
 * flattens the whole season into one line and shows nothing. In that case the
 * axis starts below the lowest value and says so under the chart, because a
 * truncated axis that does not announce itself is how a chart lies.
 */
const baselineFor = (lo, hi) => ((hi - lo) / Math.max(hi, 1) < 0.4 ? lo * 0.94 : 0)

const comma = n => Math.round(n).toLocaleString('en-GB')

/**
 * Fixture names on the x axis.
 *
 * Nine club names do not fit on one line at this width, and truncating them all
 * to "Westbrook Pa…" costs the reader more than a second row does. So they
 * alternate between two rows: neighbours never collide, and every name stays
 * whole. The two at the ends are anchored inwards so neither hangs off the plot.
 */
const AxisLabel = ({ label, x, y, index, count }) => (
  <text x={x} y={y + (index % 2 ? 12 : 0)} fill={colors.grey_100} fontSize="10"
    textAnchor={index === 0 ? 'start' : index === count - 1 ? 'end' : 'middle'}>
    {label.length > 18 ? `${label.slice(0, 17)}…` : label}
  </text>
)

/** Measures its own width, so a chart in a grid column fits that column. */
const useWidth = () => {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const measure = () => setWidth(w => (el.offsetWidth > 0 ? el.offsetWidth : w))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, width]
}

const Legend = ({ names }) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 1 }}>
    {names.map((n, i) => (
      <Box key={n} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Box sx={{ width: 12, height: 2, bgcolor: SERIES[i % SERIES.length] }} />
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{n}</Typography>
      </Box>
    ))}
  </Box>
)

const Frame = ({ title, caption, showTable, onToggle, children }) => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{caption}</Typography>
      </Box>
      <Button variant="text" size="small" onClick={onToggle} sx={{ flexShrink: 0 }}>
        {showTable ? 'Chart' : 'Table'}
      </Button>
    </Box>
    {children}
  </Box>
)

const Table = ({ rows, cols, unit }) => (
  <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, mt: 1,
    '& th, & td': { borderBottom: `1px solid ${colors.neutral_200}`, padding: '6px 8px', textAlign: 'right' },
    '& th:first-of-type, & td:first-of-type': { textAlign: 'left' },
    '& td': { fontVariantNumeric: 'tabular-nums' } }}>
    <thead>
      <tr>
        <Box component="th" sx={{ color: 'text.secondary', fontWeight: 700 }}>Game</Box>
        {cols.map((c, i) => (
          <Box component="th" key={`${c}-${i}`} sx={{ color: 'text.secondary', fontWeight: 700 }}>{c}</Box>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map(r => (
        <tr key={r.label}>
          <td>{r.label}</td>
          {r.values.map((v, i) => <td key={`${cols[i]}-${i}`}>{comma(v)}{unit}</td>)}
        </tr>
      ))}
    </tbody>
  </Box>
)

/* -------------------------------------------------------------- trend line */

/**
 * A metric game by game, the athlete against the squad's mean.
 *
 * Two series, so a legend is present and both are labelled at their end. One
 * axis only: a second scale would invent a relationship the numbers do not
 * have, which is the fastest way to make a chart lie.
 */
export function TrendChart({ title, caption, labels, tips, series, unit = '', height = 200 }) {
  const [ref, width] = useWidth()
  const [showTable, setShowTable] = useState(false)
  const [hover, setHover] = useState(null)

  const all = series.flatMap(s => s.values)
  const floor = baselineFor(Math.min(...all), Math.max(...all))
  const { min: yMin, max: yMax, ticks } = niceScale(Math.max(...all), floor)
  const innerW = Math.max(120, width - M.left - M.right)
  const x = i => M.left + (labels.length < 2 ? innerW / 2 : (i / (labels.length - 1)) * innerW)
  const y = v => M.top + height - ((v - yMin) / (yMax - yMin)) * height

  return (
    // minWidth 0 and a clipped box: the SVG carries an explicit pixel width, so
    // without this it would report its own width back as the column's minimum
    // and grow on every measure.
    <Box ref={ref} sx={{ width: '100%', minWidth: 0, overflow: 'hidden' }}>
      <Frame title={title} caption={caption} showTable={showTable}
        onToggle={() => setShowTable(v => !v)}>
        {showTable ? (
          <Table cols={labels} unit={unit}
            rows={series.map(s => ({ label: s.name, values: s.values }))} />
        ) : (
          <Box sx={{ position: 'relative' }}>
            <Box component="svg" width={Math.max(width, 1)} height={M.top + height + M.bottom}
              onPointerMove={e => {
                const box = e.currentTarget.getBoundingClientRect()
                const i = Math.round(((e.clientX - box.left - M.left) / innerW) * (labels.length - 1))
                setHover(Math.min(labels.length - 1, Math.max(0, i)))
              }}
              onPointerLeave={() => setHover(null)}
              role="img" aria-label={`${title} across ${labels.length} games`}
              sx={{ display: 'block', touchAction: 'none' }}>
              {ticks.map(t => (
                <g key={t}>
                  <line x1={M.left} x2={M.left + innerW} y1={y(t)} y2={y(t)}
                    stroke={colors.neutral_300} strokeWidth="1" />
                  <text x={M.left - 8} y={y(t) + 4} textAnchor="end" fill={colors.grey_100}
                    fontSize="11" style={{ fontVariantNumeric: 'tabular-nums' }}>{comma(t)}</text>
                </g>
              ))}

              {labels.map((l, i) => (
                <AxisLabel key={`${l}-${i}`} label={l} x={x(i)} y={M.top + height + 18}
                  index={i} count={labels.length} />
              ))}

              {hover != null && (
                <line x1={x(hover)} x2={x(hover)} y1={M.top} y2={M.top + height}
                  stroke={colors.grey_150} strokeWidth="1" />
              )}

              {series.map((s, si) => (
                <path key={s.name} fill="none" stroke={SERIES[si % SERIES.length]} strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  d={s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')} />
              ))}

              {/* End markers carry a surface ring so crossing lines stay legible. */}
              {series.map((s, si) => (
                <circle key={s.name} cx={x(s.values.length - 1)} cy={y(s.values[s.values.length - 1])}
                  r="4" fill={SERIES[si % SERIES.length]} stroke={colors.white} strokeWidth="2" />
              ))}
            </Box>

            {hover != null && width > 0 && (
              <Box sx={{ position: 'absolute', top: M.top,
                left: Math.min(Math.max(x(hover) + 12, M.left), Math.max(M.left, width - 160)),
                width: 148, pointerEvents: 'none', bgcolor: colors.white,
                border: `1px solid ${colors.neutral_300}`, borderRadius: 1, px: 1, py: 0.75,
                boxShadow: '0 2px 10px rgba(13,27,48,.12)' }}>
                {/* The axis is short by necessity; the tooltip is where the
                    fixture gets named in full, date and venue included. */}
                <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, mb: 0.25 }}>
                  {tips?.[hover] ?? labels[hover]}
                </Typography>
                {series.map((s, si) => (
                  <Box key={s.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Box sx={{ width: 10, height: 2, flexShrink: 0, bgcolor: SERIES[si % SERIES.length] }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      {comma(s.values[hover])}{unit}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', ml: 'auto' }}>
                      {s.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Legend names={series.map(s => s.name)} />
          {yMin > 0 && (
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
              Axis starts at {comma(yMin)}{unit}
            </Typography>
          )}
        </Box>
      </Frame>
    </Box>
  )
}

/* ------------------------------------------------------------ stacked bars */

/**
 * Three actions per game, stacked to give the game's total.
 *
 * Segments are separated by a 2px gap in the surface colour rather than a
 * stroke — white doing the separating, so no ink is spent on something that is
 * not data. Bars are capped so the band keeps its air.
 */
export function StackedBars({ title, caption, labels, tips, series, unit = '', height = 200 }) {
  const [ref, width] = useWidth()
  const [showTable, setShowTable] = useState(false)
  const [hover, setHover] = useState(null)

  const totals = labels.map((_, i) => series.reduce((n, s) => n + s.values[i], 0))
  const { max: yMax, ticks } = niceScale(Math.max(...totals))   // bars always start at zero
  const innerW = Math.max(120, width - M.left - M.right)
  const band = innerW / Math.max(labels.length, 1)
  const barW = Math.min(24, band * 0.55)
  const cx = i => M.left + band * i + band / 2
  const y = v => M.top + height - (v / yMax) * height

  return (
    // minWidth 0 and a clipped box: the SVG carries an explicit pixel width, so
    // without this it would report its own width back as the column's minimum
    // and grow on every measure.
    <Box ref={ref} sx={{ width: '100%', minWidth: 0, overflow: 'hidden' }}>
      <Frame title={title} caption={caption} showTable={showTable}
        onToggle={() => setShowTable(v => !v)}>
        {showTable ? (
          <Table cols={labels} unit={unit}
            rows={series.map(s => ({ label: s.name, values: s.values }))} />
        ) : (
          <Box sx={{ position: 'relative' }}>
            <Box component="svg" width={Math.max(width, 1)} height={M.top + height + M.bottom}
              onPointerLeave={() => setHover(null)}
              role="img" aria-label={`${title} across ${labels.length} games`}
              sx={{ display: 'block' }}>
              {ticks.map(t => (
                <g key={t}>
                  <line x1={M.left} x2={M.left + innerW} y1={y(t)} y2={y(t)}
                    stroke={colors.neutral_300} strokeWidth="1" />
                  <text x={M.left - 8} y={y(t) + 4} textAnchor="end" fill={colors.grey_100}
                    fontSize="11" style={{ fontVariantNumeric: 'tabular-nums' }}>{comma(t)}</text>
                </g>
              ))}

              {labels.map((l, i) => {
                let base = 0
                return (
                  <g key={`${l}-${i}`} onPointerEnter={() => setHover(i)}>
                    {/* A hit area the width of the band, so the pointer only has
                        to be near the bar rather than on it. */}
                    <rect x={M.left + band * i} y={M.top} width={band} height={height} fill="transparent" />
                    {series.map((s, si) => {
                      const v = s.values[i]
                      const top = y(base + v)
                      const bottom = y(base)
                      base += v
                      const h = Math.max(0, bottom - top - (si < series.length - 1 ? 0 : 0) - 2)
                      return (
                        <rect key={s.name} x={cx(i) - barW / 2} y={top} width={barW}
                          height={Math.max(h, 1)} fill={SERIES[si % SERIES.length]}
                          rx={si === series.length - 1 ? 4 : 0} />
                      )
                    })}
                    <AxisLabel label={l} x={cx(i)} y={M.top + height + 18}
                      index={i} count={labels.length} />
                  </g>
                )
              })}
            </Box>

            {hover != null && width > 0 && (
              <Box sx={{ position: 'absolute', top: M.top,
                left: Math.min(Math.max(cx(hover) + 12, M.left), Math.max(M.left, width - 160)),
                width: 148, pointerEvents: 'none', bgcolor: colors.white,
                border: `1px solid ${colors.neutral_300}`, borderRadius: 1, px: 1, py: 0.75,
                boxShadow: '0 2px 10px rgba(13,27,48,.12)' }}>
                {/* The axis is short by necessity; the tooltip is where the
                    fixture gets named in full, date and venue included. */}
                <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, mb: 0.25 }}>
                  {tips?.[hover] ?? labels[hover]}
                </Typography>
                {series.map((s, si) => (
                  <Box key={s.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Box sx={{ width: 10, height: 2, flexShrink: 0, bgcolor: SERIES[si % SERIES.length] }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      {comma(s.values[hover])}{unit}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', ml: 'auto' }}>
                      {s.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}
        <Legend names={series.map(s => s.name)} />
      </Frame>
    </Box>
  )
}
