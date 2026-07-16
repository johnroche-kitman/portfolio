import MuiButton from '@mui/material/Button'

// Design system rule: buttons are always variant="contained" (no outlined/text variants).
// `tone="secondary"` gives the light-grey styling used for Edit/Update/secondary actions
// in the Figma reference while staying within the contained-only rule.
const TONE_STYLES = {
  secondary: {
    backgroundColor: 'var(--neutral-200)',
    color: 'var(--color-primary)',
    '&:hover': { backgroundColor: 'var(--neutral-300)' },
  },
  danger: {
    backgroundColor: 'var(--color-error)',
    color: '#ffffff',
    '&:hover': { backgroundColor: '#a5171f' },
  },
}

export default function Button({ tone = 'primary', sx, ...props }) {
  const toneSx = TONE_STYLES[tone] || {}

  return <MuiButton variant="contained" disableElevation sx={{ ...toneSx, ...sx }} {...props} />
}
