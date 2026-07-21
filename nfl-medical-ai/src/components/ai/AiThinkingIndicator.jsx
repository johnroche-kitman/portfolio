import Box from '@mui/material/Box'

const DOTS = [0, 1, 2]

// A fake "typing" beat shown while useAiConversation's respondWithDelay is
// pending, so the assistant's reply doesn't just pop in instantly.
export default function AiThinkingIndicator() {
  return (
    <Box display="flex" justifyContent="flex-start">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          borderRadius: '12px',
          borderTopLeftRadius: '2px',
          px: 2,
          py: 1.75,
          backgroundColor: 'var(--neutral-200)',
        }}
      >
        {DOTS.map((i) => (
          <Box
            key={i}
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: 'var(--grey-100)',
              animation: 'ai-thinking-bounce 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  )
}
