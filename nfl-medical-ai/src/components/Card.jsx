import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function Card({ title, action, children, sx }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: 'var(--divider)',
        borderRadius: '8px',
        p: 3,
        backgroundColor: 'var(--white)',
        ...sx,
      }}
    >
      {(title || action) && (
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          {title && <Typography variant="h2">{title}</Typography>}
          {action}
        </Box>
      )}
      {children}
    </Paper>
  )
}
