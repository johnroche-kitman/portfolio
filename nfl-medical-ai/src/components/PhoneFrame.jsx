import Box from '@mui/material/Box'

// Phone bezel mockup for the mobile demo view. Sized by height with a fixed
// aspect ratio (so the width follows automatically) and capped so it always
// fits a shorter browser window, rather than a fixed pixel size.
export default function PhoneFrame({ children }) {
  return (
    <Box
      sx={{
        height: 'min(85vh, 800px)',
        aspectRatio: '375 / 812',
        borderRadius: '48px',
        backgroundColor: '#111319',
        p: '14px',
        boxShadow: '0 30px 60px -20px rgba(0,0,0,0.4)',
        display: 'flex',
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          flexGrow: 1,
          borderRadius: '36px',
          overflow: 'hidden',
          backgroundColor: 'var(--white)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '38%',
            height: 22,
            backgroundColor: '#111319',
            borderBottomLeftRadius: 14,
            borderBottomRightRadius: 14,
            zIndex: 2,
          }}
        />
        <Box flexGrow={1} minHeight={0} display="flex" flexDirection="column" sx={{ pt: '22px' }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
