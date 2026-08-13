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

// Nose centre, in the SVG's own viewBox units - used as the exact pivot
// point for the "vanish" spin so it collapses into the nose rather than
// around the ears/whiskers/eyes group's own (higher-up) bounding box.
const NOSE_CENTER = '79.6737px 99.2284px'

const ASTERISK_WHISKER_KEYFRAMES = {
  left: ['kit-asterisk-whisker-l0', 'kit-asterisk-whisker-l1', 'kit-asterisk-whisker-l2'],
  right: ['kit-asterisk-whisker-r0', 'kit-asterisk-whisker-r1', 'kit-asterisk-whisker-r2'],
}

// Polished end-state artwork (provided as reference SVGs) that Kit's own
// features crossfade into at the hold of each animation, rather than
// resting on a rough approximation built from ear/eye/whisker geometry.
const READY_TICK_PATH =
  'M39.3218 76.6398L13.7186 49.5861L5 58.7338L39.3218 95L113 17.1476L104.343 8L39.3218 76.6398Z'
const ERROR_PATHS = [
  'M97.4766 70.418L130.875 56.6973L97.4766 41.2188V29.5L145.963 53.7188V60.7012L97.4766 82.0879V70.418Z',
  'M84.709 68.3184H72.7949L70.3047 20.6133H87.1992L84.709 68.3184ZM70.1094 85.0176C70.1094 81.9577 70.9395 79.8092 72.5996 78.5723C74.2923 77.3353 76.3268 76.7168 78.7031 76.7168C81.0143 76.7168 83 77.3353 84.6602 78.5723C86.3529 79.8092 87.1992 81.9577 87.1992 85.0176C87.1992 87.9473 86.3529 90.0632 84.6602 91.3652C83 92.6673 81.0143 93.3184 78.7031 93.3184C76.3268 93.3184 74.2923 92.6673 72.5996 91.3652C70.9395 90.0632 70.1094 87.9473 70.1094 85.0176Z',
  'M59.7832 82.0879L11.2969 60.7012V53.7188L59.7832 29.5V41.2188L26.3848 56.6973L59.7832 70.418V82.0879Z',
]
const SPARKLE_STAR_PATH =
  'M48.5938 10.0234L46.5918 27.9922L64.8047 22.9141L66.416 35.2188L49.8145 36.3906L60.7031 50.8926L49.6191 56.8008L42.002 41.5176L35.3125 56.7031L23.7891 50.8926L34.5801 36.3906L18.0762 35.1211L19.9805 22.9141L37.8027 27.9922L35.8008 10.0234H48.5938Z'

// "Medical" hand-drawn flip-book frames 2-5 (frame 1 is Kit's own idle
// rendering, reused as-is; frame 6 is the final flat bag icon below).
// Each frame is a snapshot mid-transformation: left ear -> bag handle,
// right ear -> bag outline, whiskers -> the medical cross.
const MEDICAL_FRAME_2 = [
  'M41.4584 96.0154L16.4861 89.7723L18.0003 83.7153L42.9725 89.9584L41.4584 96.0154ZM42.9725 102.258L5.51417 111.623L4 105.566L41.4584 96.2014L42.9725 102.258ZM43.8214 111.271L12.6061 130L9.39414 124.647L40.6094 105.918L43.8214 111.271Z',
  'M93.2297 40.0195L77.8939 -0.185161L44.5654 41.2712L49.431 45.1829L75.9398 12.2093L87.3966 42.2445L93.2297 40.0195Z',
  'M82.363 94.3001L107.335 88.057L105.821 82L80.8484 88.2431L82.363 94.3001ZM80.8484 100.543L118.307 109.908L119.821 103.851L82.363 94.4861L80.8484 100.543ZM80 109.556L111.215 128.285L114.427 122.932L83.2121 104.203L80 109.556Z',
  'M81.5 56.5L120.161 29L132 98H126L116.174 40.8972L60.5 81.1593L53 73L81.5 56.5Z',
  NOSE,
]
const MEDICAL_FRAME_3 = [
  'M54.4584 93.3001L29.4861 87.057L31.0003 81L55.9725 87.2431L54.4584 93.3001ZM55.9725 99.5431L18.5142 108.908L17 102.851L54.4584 93.4861L55.9725 99.5431ZM56.8214 108.556L25.6061 127.285L22.3941 121.932L53.6094 103.203L56.8214 108.556Z',
  'M106.999 19.4999L77.893 -0.185226L46.9993 22.5002L58 25.5L71.5 12.2092L83 12.2092L96.4992 22.4999L106.999 19.4999Z',
  'M84.3759 86.5709L97.0789 108.959L102.509 105.877L89.806 83.4894L84.3759 86.5709ZM77.9552 86.7836L78.9648 125.382L85.2061 125.219L84.1966 86.6207L77.9552 86.7836ZM69.0448 88.3799L59.3598 123.471L65.3773 125.132L75.0623 90.041L69.0448 88.3799Z',
  'M63.5 34.5L125 31L131.5 127H123L116.174 40.8972L37 46.5V37L63.5 34.5Z',
]
const MEDICAL_FRAME_4 = [
  'M83.5751 89.148L98.351 68.0705L103.463 71.6543L88.6875 92.7318L83.5751 89.148ZM77.204 88.3248L81.882 49.9981L88.0794 50.7546L83.4014 89.0814L77.204 88.3248ZM68.4857 85.8883L62.184 50.035L68.3323 48.9541L74.634 84.8074L68.4857 85.8883Z',
  'M106.999 19.4999L77.893 -0.185226L46.9993 22.5002L58 25.5L71.5 12.2092L83 12.2092L96.4992 22.4999L106.999 19.4999Z',
  'M84.3759 86.5709L97.0789 108.959L102.509 105.877L89.806 83.4894L84.3759 86.5709ZM77.9552 86.7836L78.9648 125.382L85.2061 125.219L84.1966 86.6207L77.9552 86.7836ZM69.0448 88.3799L59.3598 123.471L65.3773 125.132L75.0623 90.041L69.0448 88.3799Z',
  'M63.5 34.5L125 31L131.5 127H123L116.174 40.8972L37 46.5V37L63.5 34.5Z',
]
const MEDICAL_FRAME_5 = [
  'M83.5751 89.1476L107.5 89.1476L109 94L84.5001 95.5L83.5751 89.1476ZM74.634 125.5L81.8821 49.9977L88.0795 50.7542L81 127L74.634 125.5ZM77.0001 96L49 95.5L49 87L78.0001 85.8879L77.0001 96Z',
  'M106.999 19.4999L77.893 -0.185226L46.9993 22.5002L58 25.5L71.5 12.2092L83 12.2092L96.4992 22.4999L106.999 19.4999Z',
  'M63.5 34.5L125 31L131.5 127H123L116.174 40.8972L37 46.5V37L63.5 34.5Z',
]
// Final flat medical-bag icon (frame 6) - its own viewBox (149x160), scaled
// down slightly (0.92) to fit the shared 155x147 canvas without clipping.
const MEDICAL_BAG_CROSS_PATH = 'M82 74H72V89H57V99H72V114H82V99H97V89H82V74Z'
const MEDICAL_BAG_OUTLINE_PATH =
  'M117 54H97V44C97 38.5 92.5 34 87 34H67C61.5 34 57 38.5 57 44V54H37C31.5 54 27 58.5 27 64V124C27 129.5 31.5 134 37 134H117C122.5 134 127 129.5 127 124V64C127 58.5 122.5 54 117 54ZM67 44H87V54H67V44Z'

// state: 'idle' (occasional blink + nose wiggle) | 'thinking' (head tilt +
// whisker twitch) | 'ready' (right ear swings into a tick, crossfades into
// the tick artwork) | 'loading' (ears/whiskers fly off, eyes/nose become a
// pulsing dot row) | 'vanish' (ears/whiskers/eyes spin into the nose,
// leaving a dot) | 'error' (ears fold, crossfades into the "< ! >" artwork)
// | 'sparkle' (whiskers gather at the nose, crossfading into a pulsing
// sparkle-star, Claude-icon style) | 'medical' (6-frame flip-book into a
// medical bag icon, for the Performance Medicine agent)
export default function KitCharacter({ size = 155, state = 'idle' }) {
  const height = size * (147 / 155)
  const idle = state === 'idle'
  const thinking = state === 'thinking'
  const ready = state === 'ready'
  const loading = state === 'loading'
  const vanish = state === 'vanish'
  const error = state === 'error'
  const sparkle = state === 'sparkle'
  const medical = state === 'medical'

  const FADE_OUT = 'kit-fade-out-hold 3s ease-in-out infinite'
  const FADE_IN = 'kit-fade-in-hold 3s ease-in-out infinite'
  // For pieces with no transform animation of their own - shrinks on the
  // way out instead of a flat opacity dissolve, so it reads as motion.
  const FADE_OUT_SHRINK = 'kit-fade-out-shrink-hold 3s ease-in-out infinite'
  const POP_IN = 'kit-fade-in-hold 3s ease-in-out infinite, kit-overlay-pop-in 3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite'

  const earLeftAnimation = ready
    ? `kit-ready-ear-tick-solo 3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite, ${FADE_OUT}`
    : loading
      ? 'kit-ear-flyaway-left 3.2s ease-in-out infinite'
      : error
        ? `kit-error-ear-left 3s ease-in-out infinite, ${FADE_OUT}`
        : sparkle
          ? FADE_OUT_SHRINK
          : 'none'
  const earRightAnimation = loading
    ? 'kit-ear-flyaway-right 3.2s ease-in-out infinite'
    : error
      ? `kit-error-ear-right 3s ease-in-out infinite, ${FADE_OUT}`
      : ready || sparkle
        ? FADE_OUT_SHRINK
        : 'none'
  const eyeLeftAnimation = idle
    ? 'kit-blink 2s ease-in-out infinite'
    : loading
      ? 'kit-loading-eye-left 3.2s ease-in-out infinite'
      : ready || error || sparkle
        ? FADE_OUT_SHRINK
        : 'none'
  const eyeRightAnimation = idle
    ? 'kit-blink 2s ease-in-out infinite'
    : loading
      ? 'kit-loading-eye-right 3.2s ease-in-out infinite'
      : ready || error || sparkle
        ? FADE_OUT_SHRINK
        : 'none'
  const noseAnimation = idle
    ? 'kit-nose-wiggle 2s ease-in-out infinite'
    : loading
      ? 'kit-loading-nose 3.2s ease-in-out infinite'
      : vanish
        ? 'kit-nose-vanish-pulse 3.2s ease-in-out infinite'
        : ready || sparkle
          ? FADE_OUT_SHRINK
          : 'none'

  const whiskerAnimation = (side, index) => {
    if (thinking) return 'kit-whisker-twitch 1.4s ease-in-out infinite'
    if (loading) return `kit-whisker-flyaway-${side} 3.2s ease-in-out infinite`
    if (ready || error) return FADE_OUT_SHRINK
    if (sparkle) return `${ASTERISK_WHISKER_KEYFRAMES[side][index]} 3s ease-in-out infinite, ${FADE_OUT}`
    return 'none'
  }
  const whiskerDelay = (index) => (thinking ? `${index * 0.12}s` : '0s')

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
          animation: thinking
            ? 'kit-head-tilt 2.6s ease-in-out infinite'
            : medical
              ? 'kit-medical-1 6.5s ease-in-out infinite'
              : 'none',
        },
        '& .kit-spin-group': {
          transformBox: 'view-box',
          transformOrigin: NOSE_CENTER,
          animation: vanish ? 'kit-spin-vanish-head 3.2s ease-in-out infinite' : 'none',
        },
        '& .kit-ear-left': {
          transformBox: 'fill-box',
          transformOrigin: '100% 100%',
          animation: earLeftAnimation,
        },
        '& .kit-ear-right': {
          transformBox: 'fill-box',
          transformOrigin: '0% 100%',
          animation: earRightAnimation,
        },
        '& .kit-eye-left': {
          transformBox: 'fill-box',
          transformOrigin: 'center',
          animation: eyeLeftAnimation,
        },
        '& .kit-eye-right': {
          transformBox: 'fill-box',
          transformOrigin: 'center',
          animation: eyeRightAnimation,
        },
        '& .kit-nose': {
          transformBox: 'fill-box',
          transformOrigin: 'center',
          animation: noseAnimation,
        },
        '& .kit-ready-tick': {
          transformBox: 'fill-box',
          transformOrigin: 'center',
          opacity: 0,
          animation: ready ? POP_IN : 'none',
        },
        '& .kit-error-glyph': {
          transformBox: 'fill-box',
          transformOrigin: 'center',
          opacity: 0,
          animation: error ? POP_IN : 'none',
        },
        '& .kit-sparkle-star': {
          transformBox: 'fill-box',
          transformOrigin: 'center',
          opacity: 0,
          animation: sparkle ? `${FADE_IN}, kit-sparkle-pop-and-pulse 3s ease-in-out infinite` : 'none',
        },
      }}
    >
      <g className="kit-head">
        <g className="kit-spin-group">
          <path className="kit-ear-left" d={EAR_LEFT} fill="#3B4960" />
          <path className="kit-ear-right" d={EAR_RIGHT} fill="#3B4960" />
          {WHISKERS_LEFT.map((d, i) => (
            <path
              key={`wl-${i}`}
              style={{
                transformBox: 'fill-box',
                transformOrigin: 'center',
                animation: whiskerAnimation('left', i),
                animationDelay: whiskerDelay(i),
              }}
              d={d}
              fill="#3B4960"
            />
          ))}
          {WHISKERS_RIGHT.map((d, i) => (
            <path
              key={`wr-${i}`}
              style={{
                transformBox: 'fill-box',
                transformOrigin: 'center',
                animation: whiskerAnimation('right', i),
                animationDelay: whiskerDelay(i),
              }}
              d={d}
              fill="#3B4960"
            />
          ))}
          <path className="kit-eye-left" d={EYE_LEFT} fill="#3B4960" />
          <path className="kit-eye-right" d={EYE_RIGHT} fill="#3B4960" />
        </g>
        <path className="kit-nose" d={NOSE} fill="#3B4960" />
      </g>

      {/* Ready end-state: exact tick artwork, centred in the 155x147 canvas. */}
      <svg className="kit-ready-tick" x="16" y="21" width="123" height="105" viewBox="0 0 123 105">
        <path d={READY_TICK_PATH} fill="#3B4960" />
      </svg>

      {/* Error end-state: exact "< ! >" artwork, scaled to fit the canvas width. */}
      <svg className="kit-error-glyph" x="2.5" y="17.5" width="150" height="112" viewBox="0 0 162 121">
        {ERROR_PATHS.map((d, i) => (
          <path key={`err-${i}`} d={d} fill="#3B4960" />
        ))}
      </svg>

      {/* Sparkle end-state: exact star artwork, centred on the nose. */}
      <svg className="kit-sparkle-star" x="44.67" y="70.58" width="70" height="57.3" viewBox="0 0 88 72">
        <path d={SPARKLE_STAR_PATH} fill="#3B4960" />
      </svg>

      {/* Medical: frames 2-5 of the hand-drawn flip-book, each crossfading
          into the next (frame 1 is kit-head above; frame 6 is the flat bag
          icon below). */}
      {[MEDICAL_FRAME_2, MEDICAL_FRAME_3, MEDICAL_FRAME_4, MEDICAL_FRAME_5].map((paths, i) => (
        <g
          key={`medical-frame-${i + 2}`}
          style={{ opacity: 0, animation: medical ? `kit-medical-${i + 2} 6.5s ease-in-out infinite` : 'none' }}
        >
          {paths.map((d, j) => (
            <path key={j} d={d} fill="#3B4960" fillRule="evenodd" clipRule="evenodd" />
          ))}
        </g>
      ))}

      {/* Medical frame 6: the final flat bag icon, own viewBox scaled to fit. */}
      <svg
        x="9.05"
        y="0"
        width="136.9"
        height="147"
        viewBox="0 0 149 160"
        style={{ opacity: 0, animation: medical ? 'kit-medical-6 6.5s ease-in-out infinite' : 'none' }}
      >
        <path d={MEDICAL_BAG_CROSS_PATH} fill="#3B4960" />
        <path d={MEDICAL_BAG_OUTLINE_PATH} fill="#3B4960" />
      </svg>
    </Box>
  )
}
