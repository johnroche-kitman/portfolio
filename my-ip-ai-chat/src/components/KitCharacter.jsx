import Box from '@mui/material/Box'

// Kit's artwork, split into independently animatable pieces. The original
// kit.svg drew each side's ear + 3 whiskers as one compound evenodd path;
// since none of those subpaths overlap, splitting them into separate <path>
// elements renders identically but lets ears and whiskers move on their own.
const EAR_LEFT = 'M27.7357 9L59.8969 37.5878L55.7492 42.2539L31.7229 20.8972L23.4257 62.3837L17.3038 61.1593L27.7357 9Z'
const EAR_RIGHT = 'M125.368 9L93.207 37.5878L97.3549 42.2539L121.381 20.8972L129.678 62.3837L135.8 61.1593L125.368 9Z'
const WHISKERS_LEFT = [
  'M41.4584 96.0153L16.4861 89.7722L18.0003 83.7152L42.9725 89.9583L41.4584 96.0153Z',
  'M42.9725 102.258L5.51417 111.623L4 105.566L41.4584 96.2013L42.9725 102.258Z',
  'M43.8214 111.271L12.6061 130L9.39414 124.647L40.6094 105.918L43.8214 111.271Z',
]
const WHISKERS_RIGHT = [
  'M111.646 96.0153L136.618 89.7722L135.104 83.7152L110.131 89.9583L111.646 96.0153Z',
  'M110.131 102.258L147.59 111.623L149.104 105.566L111.646 96.2013L110.131 102.258Z',
  'M109.283 111.271L140.498 130L143.71 124.647L112.495 105.918L109.283 111.271Z',
]
const EYE_LEFT = 'M60.9451 71.1347C60.9451 76.3064 58.15 80.4993 54.702 80.4993C51.2541 80.4993 48.459 76.3064 48.459 71.1347C48.459 65.9629 51.2541 61.77 54.702 61.77C58.15 61.77 60.9451 65.9629 60.9451 71.1347Z'
const EYE_RIGHT = 'M92.1602 71.1347C92.1602 76.3064 94.9552 80.4993 98.4032 80.4993C101.851 80.4993 104.646 76.3064 104.646 71.1347C104.646 65.9629 101.851 61.77 98.4032 61.77C94.9552 61.77 92.1602 65.9629 92.1602 71.1347Z'
const NOSE = 'M79.6737 92.9854C83.1218 92.9854 85.9168 95.7804 85.9168 99.2284C85.9168 102.676 83.1218 105.471 79.6737 105.471C76.2257 105.471 73.4307 102.676 73.4307 99.2284C73.4307 95.7804 76.2257 92.9854 79.6737 92.9854Z'

// state: 'idle' (default, occasional blink + nose wiggle) | 'thinking'
// (head tilt + whisker twitch) | 'ready' (ears swing into a tick mark)
export default function KitCharacter({ size = 155, state = 'idle' }) {
  const height = size * (147 / 155)
  const thinking = state === 'thinking'
  const ready = state === 'ready'
  const idle = state === 'idle'

  return (
    <Box
      component="svg"
      width={size}
      height={height}
      viewBox="0 0 155 147"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      sx={{
        '& .kit-head': {
          transformBox: 'fill-box',
          transformOrigin: 'center',
          animation: thinking ? 'kit-head-tilt 2.6s ease-in-out infinite' : 'none',
        },
        '& .kit-whisker': {
          transformBox: 'fill-box',
          transformOrigin: 'center',
          animation: thinking ? 'kit-whisker-twitch 1.4s ease-in-out infinite' : 'none',
        },
        '& .kit-ear-left': {
          transformBox: 'fill-box',
          transformOrigin: '100% 100%',
          animation: ready ? 'kit-ear-tick-left 3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite' : 'none',
        },
        '& .kit-ear-right': {
          transformBox: 'fill-box',
          transformOrigin: '0% 100%',
          animation: ready ? 'kit-ear-tick-right 3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite' : 'none',
        },
        '& .kit-eye': {
          transformBox: 'fill-box',
          transformOrigin: 'center',
          animation: idle ? 'kit-blink 4.5s ease-in-out infinite' : 'none',
        },
        '& .kit-nose': {
          transformBox: 'fill-box',
          transformOrigin: 'center',
          animation: idle ? 'kit-nose-wiggle 4.5s ease-in-out infinite' : 'none',
        },
      }}
    >
      <g className="kit-head">
        <path className="kit-ear-left" d={EAR_LEFT} fill="#3B4960" />
        <path className="kit-ear-right" d={EAR_RIGHT} fill="#3B4960" />
        {WHISKERS_LEFT.map((d, i) => (
          <path key={`wl-${i}`} className="kit-whisker" style={{ animationDelay: `${i * 0.12}s` }} d={d} fill="#3B4960" />
        ))}
        {WHISKERS_RIGHT.map((d, i) => (
          <path key={`wr-${i}`} className="kit-whisker" style={{ animationDelay: `${i * 0.12}s` }} d={d} fill="#3B4960" />
        ))}
        <path className="kit-eye" d={EYE_LEFT} fill="#3B4960" />
        <path className="kit-nose" d={NOSE} fill="#3B4960" />
        <path className="kit-eye" d={EYE_RIGHT} fill="#3B4960" />
      </g>
    </Box>
  )
}
