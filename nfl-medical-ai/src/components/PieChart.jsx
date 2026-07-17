import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// No charting library in this project — a donut chart is drawn by hand using
// the classic SVG circle stroke-dasharray/dashoffset stacking technique.
const PALETTE = ['#3b4960', '#ea7b5d', '#ffab00', '#28a745', '#5f7089', '#c31d2b', '#1c5cab', '#8e6fc7']

export default function PieChart({ title, data, size = 160 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const radius = size / 2
  const strokeWidth = radius * 0.55
  const innerRadius = radius - strokeWidth / 2
  const circumference = 2 * Math.PI * innerRadius

  let cumulative = 0
  const segments = data.map((d, i) => {
    const fraction = total > 0 ? d.value / total : 0
    const dash = fraction * circumference
    const segment = {
      ...d,
      color: PALETTE[i % PALETTE.length],
      dasharray: `${dash} ${circumference - dash}`,
      dashoffset: -cumulative,
      percent: total > 0 ? Math.round(fraction * 100) : 0,
    }
    cumulative += dash
    return segment
  })

  return (
    <Box>
      {title && (
        <Typography variant="body1" fontWeight={600} sx={{ mb: 1.5 }}>
          {title}
        </Typography>
      )}
      <Box display="flex" alignItems="center" gap={3}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
          {total === 0 ? (
            <circle cx={radius} cy={radius} r={innerRadius} fill="none" stroke="var(--neutral-300)" strokeWidth={strokeWidth} />
          ) : (
            segments.map((seg) => (
              <circle
                key={seg.label}
                cx={radius}
                cy={radius}
                r={innerRadius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={seg.dasharray}
                strokeDashoffset={seg.dashoffset}
                transform={`rotate(-90 ${radius} ${radius})`}
              />
            ))
          )}
        </svg>
        <Box display="flex" flexDirection="column" gap={0.75}>
          {total === 0 && (
            <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
              No data recorded
            </Typography>
          )}
          {segments.map((seg) => (
            <Box key={seg.label} display="flex" alignItems="center" gap={1}>
              <Box sx={{ width: 10, height: 10, borderRadius: '2px', backgroundColor: seg.color, flexShrink: 0 }} />
              <Typography variant="body2">
                {seg.label}{' '}
                <Box component="span" sx={{ color: 'var(--grey-100)' }}>
                  ({seg.value} &middot; {seg.percent}%)
                </Box>
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
