import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'

const VERSIONS = [
  {
    to: '/v1',
    title: 'Version 1 - launch from Main menu',
    description: 'Ask My iP opens from a dedicated icon in the left navigation rail.',
  },
  {
    to: '/v2',
    title: 'Version 2 - Launch from inside My iP',
    description: 'Ask My iP opens from an icon in the My iP toolbar, to the left of Settings.',
  },
  {
    to: '/v3',
    title: 'Version 3 - Launch from App Bar',
    description:
      'Ask My iP opens from an icon in the top app bar, to the right of the user avatar. (John\'s preferred option)',
  },
  {
    to: '/icon-options',
    title: 'Icon options',
    description: 'Comparing a few icon treatments for the Ask My iP panel header.',
  },
  {
    to: '/animation-tests',
    title: 'Animation tests',
    description: 'Kit, the Ask AI avatar — trying out looping eye and nose animations.',
  },
]

export default function VersionsLanding() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ backgroundColor: 'var(--background)', px: 3 }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          mb: 3,
          borderRadius: '50%',
          backgroundColor: '#0b1220',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          component="img"
          src={`${import.meta.env.BASE_URL}kitman-logo.png`}
          alt="Kitman Labs"
          sx={{ width: 44, height: 44, objectFit: 'contain' }}
        />
      </Box>
      <Typography variant="h1" sx={{ mb: 1, textAlign: 'center', color: 'var(--color-primary)' }}>
        Ask My iP prototype
      </Typography>
      <Typography variant="body1" sx={{ color: 'var(--grey-100)', mb: 4, textAlign: 'center' }}>
        Choose a version to preview. Everything is identical except where the launcher sits.
      </Typography>
      <Box display="flex" flexDirection="column" gap={2} width="100%" maxWidth={480}>
        {VERSIONS.map((version) => (
          <Box
            key={version.to}
            component={Link}
            to={version.to}
            sx={{
              display: 'block',
              textDecoration: 'none',
              border: '1px solid var(--divider)',
              borderRadius: 1.5,
              p: 2.5,
              backgroundColor: 'var(--white)',
              transition: 'border-color 0.15s, background-color 0.15s',
              '&:hover': { borderColor: 'var(--color-primary)', backgroundColor: 'var(--background)' },
            }}
          >
            <Typography variant="h2" sx={{ color: 'var(--color-primary)', mb: 0.5 }}>
              {version.title}
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--grey-100)' }}>
              {version.description}
            </Typography>
          </Box>
        ))}
      </Box>
      <Typography
        component="a"
        href="https://www.figma.com/design/TTG2OZj3D1JxQiB9oyQVq4/My-iP?node-id=11653-24387&t=6vR2ouaASDmHICRO-1"
        target="_blank"
        rel="noopener noreferrer"
        variant="body1"
        sx={{ color: 'var(--color-primary)', mt: 3, textDecoration: 'underline' }}
      >
        View the Figma design file
      </Typography>
    </Box>
  )
}
