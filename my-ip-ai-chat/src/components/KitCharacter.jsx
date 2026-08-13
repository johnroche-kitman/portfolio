import Box from '@mui/material/Box'

// Kit: the cat-whiskers avatar for the Ask AI feature. Ears/whiskers are
// static; the eyes get a periodic blink/squint and the nose a little wiggle,
// both looping continuously but timed to different points in the cycle so
// they don't feel mechanical.
export default function KitCharacter({ size = 155 }) {
  const height = size * (147 / 155)

  return (
    <Box
      component="svg"
      width={size}
      height={height}
      viewBox="0 0 155 147"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      sx={{
        '& .kit-eye': {
          transformBox: 'fill-box',
          transformOrigin: 'center',
          animation: 'kit-blink 4.5s ease-in-out infinite',
        },
        '& .kit-nose': {
          transformBox: 'fill-box',
          transformOrigin: 'center',
          animation: 'kit-nose-wiggle 4.5s ease-in-out infinite',
        },
      }}
    >
      {/* Left ear + whiskers */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.7357 9L59.8969 37.5878L55.7492 42.2539L31.7229 20.8972L23.4257 62.3837L17.3038 61.1593L27.7357 9ZM41.4584 96.0153L16.4861 89.7722L18.0003 83.7152L42.9725 89.9583L41.4584 96.0153ZM42.9725 102.258L5.51417 111.623L4 105.566L41.4584 96.2013L42.9725 102.258ZM43.8214 111.271L12.6061 130L9.39414 124.647L40.6094 105.918L43.8214 111.271Z"
        fill="#3B4960"
      />
      {/* Right ear + whiskers */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M125.368 9L93.207 37.5878L97.3549 42.2539L121.381 20.8972L129.678 62.3837L135.8 61.1593L125.368 9ZM111.646 96.0153L136.618 89.7722L135.104 83.7152L110.131 89.9583L111.646 96.0153ZM110.131 102.258L147.59 111.623L149.104 105.566L111.646 96.2013L110.131 102.258ZM109.283 111.271L140.498 130L143.71 124.647L112.495 105.918L109.283 111.271Z"
        fill="#3B4960"
      />
      {/* Left eye */}
      <path
        className="kit-eye"
        d="M60.9451 71.1347C60.9451 76.3064 58.15 80.4993 54.702 80.4993C51.2541 80.4993 48.459 76.3064 48.459 71.1347C48.459 65.9629 51.2541 61.77 54.702 61.77C58.15 61.77 60.9451 65.9629 60.9451 71.1347Z"
        fill="#3B4960"
      />
      {/* Nose */}
      <path
        className="kit-nose"
        d="M79.6737 92.9854C83.1218 92.9854 85.9168 95.7804 85.9168 99.2284C85.9168 102.676 83.1218 105.471 79.6737 105.471C76.2257 105.471 73.4307 102.676 73.4307 99.2284C73.4307 95.7804 76.2257 92.9854 79.6737 92.9854Z"
        fill="#3B4960"
      />
      {/* Right eye */}
      <path
        className="kit-eye"
        d="M92.1602 71.1347C92.1602 76.3064 94.9552 80.4993 98.4032 80.4993C101.851 80.4993 104.646 76.3064 104.646 71.1347C104.646 65.9629 101.851 61.77 98.4032 61.77C94.9552 61.77 92.1602 65.9629 92.1602 71.1347Z"
        fill="#3B4960"
      />
    </Box>
  )
}
