import MuiButton from '@mui/material/Button'

// Design system rule: buttons are always variant="contained" (no outlined/text variants).
// `tone="secondary"` gives the light-grey styling used for Edit/Update/secondary actions
// in the Figma reference while staying within the contained-only rule.
export default function Button({ tone = 'primary', sx, ...props }) {
  const toneSx =
    tone === 'secondary'
      ? {
          backgroundColor: 'var(--neutral-200)',
          color: 'var(--color-primary)',
          '&:hover': { backgroundColor: 'var(--neutral-300)' },
        }
      : {}

  return <MuiButton variant="contained" disableElevation sx={{ ...toneSx, ...sx }} {...props} />
}
