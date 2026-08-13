import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'

const ICONS = ['icons1.png', 'icons2.png', 'icons3.png', 'icons4.png']

export default function IconOptions() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ backgroundColor: 'var(--background)', px: 3, py: 6 }}
    >
      <Typography variant="h1" sx={{ mb: 1, textAlign: 'center', color: 'var(--color-primary)' }}>
        Icon options
      </Typography>
      <Typography variant="body1" sx={{ color: 'var(--grey-100)', mb: 5, textAlign: 'center' }}>
        Comparing a few icon treatments for the Ask My iP panel header.
      </Typography>

      <Box
        display="grid"
        sx={{ gridTemplateColumns: 'repeat(2, minmax(280px, 480px))', gap: 3, width: '100%', maxWidth: 1000 }}
        mb={4}
      >
        {ICONS.map((file) => (
          <Box
            key={file}
            sx={{
              borderRadius: 2,
              border: '1px solid var(--divider)',
              backgroundColor: 'var(--white)',
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src={`${import.meta.env.BASE_URL}${file}`}
              alt={`Icon option - ${file}`}
              sx={{ width: '100%', display: 'block' }}
            />
          </Box>
        ))}
      </Box>

      <Typography
        component={Link}
        to="/"
        variant="body1"
        sx={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
      >
        Back to prototype versions
      </Typography>
    </Box>
  )
}
