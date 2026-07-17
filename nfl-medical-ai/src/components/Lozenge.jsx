import Chip from '@mui/material/Chip'

const TONE_COLORS = {
  error: { backgroundColor: '#fbe6e7', color: 'var(--color-error)' },
  warning: { backgroundColor: '#fff4dc', color: '#7a5300' },
  success: { backgroundColor: '#e5f4ea', color: 'var(--color-success)' },
  neutral: { backgroundColor: 'var(--neutral-200)', color: 'var(--color-primary)' },
  info: { backgroundColor: '#e3edfb', color: '#1c5cab' },
  dark: { backgroundColor: 'var(--color-primary-dark)', color: '#ffffff' },
}

const STATUS_TONE = {
  Out: 'error',
  Limited: 'warning',
  Available: 'success',
  'Pending review': 'warning',
  Accepted: 'success',
}

export default function Lozenge({ label, tone }) {
  const resolvedTone = tone || STATUS_TONE[label] || 'neutral'
  const colors = TONE_COLORS[resolvedTone]
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        ...colors,
        fontWeight: 600,
        fontSize: 12,
        height: 22,
        borderRadius: '4px',
      }}
    />
  )
}
