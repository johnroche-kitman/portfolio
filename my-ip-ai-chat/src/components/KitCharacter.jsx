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

// Sparkle end-state artwork (provided reference SVG) that the whiskers
// crossfade into once gathered at the nose.
const SPARKLE_STAR_PATH =
  'M48.5938 10.0234L46.5918 27.9922L64.8047 22.9141L66.416 35.2188L49.8145 36.3906L60.7031 50.8926L49.6191 56.8008L42.002 41.5176L35.3125 56.7031L23.7891 50.8926L34.5801 36.3906L18.0762 35.1211L19.9805 22.9141L37.8027 27.9922L35.8008 10.0234H48.5938Z'

// Final flat medical-bag icon. Combined into ONE evenodd path so the cross
// is a true cut-out through the bag rather than a solid shape hidden
// underneath it - the source frames drew the cross and the bag as two
// separately-filled shapes, which occluded the cross entirely once the bag
// became solid. Scaled 0.92 from its native 149x160 viewBox to fit 155x147.
const MEDICAL_BAG_OUTLINE_D =
  'M117 54H97V44C97 38.5 92.5 34 87 34H67C61.5 34 57 38.5 57 44V54H37C31.5 54 27 58.5 27 64V124C27 129.5 31.5 134 37 134H117C122.5 134 127 129.5 127 124V64C127 58.5 122.5 54 117 54ZM67 44H87V54H67V44Z'
const MEDICAL_BAG_CROSS_D = 'M82 74H72V89H57V99H72V114H82V99H97V89H82V74Z'
const MEDICAL_BAG_ICON_PATH = `${MEDICAL_BAG_OUTLINE_D} ${MEDICAL_BAG_CROSS_D}`

// state: 'idle' (occasional blink + nose wiggle) | 'thinking' (head tilt +
// whisker twitch) | 'loading' (ears/whiskers fly off, eyes/nose become a
// pulsing dot row) | 'vanish' (ears/whiskers/eyes spin into the nose,
// leaving a dot) | 'sparkle' (whiskers gather at the nose, crossfading into
// a pulsing sparkle-star, Claude-icon style) | 'error' (Kit's ears morph
// into "<"/">", the left eye morphs into the "!" bar and the nose morphs
// into its dot) | 'ready' (Kit's right ear - on the left as viewed - morphs
// into a tick/check-mark) | 'medical' (left ear morphs into the bag handle,
// right ear into the outline, three whiskers into the cross, then a brief
// crossfade polishes the hand-drawn result into the flat bag icon)
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
  // For pieces with no transform/morph animation of their own - shrinks on
  // the way out instead of a flat opacity dissolve, so it reads as motion.
  const FADE_OUT_SHRINK = 'kit-fade-out-shrink-hold 3s ease-in-out infinite'
  const FADE_OUT_SHRINK_MED = 'kit-fade-out-shrink-hold 4s ease-in-out infinite'
  // Combined transform+opacity for the piece that visibly moves (ready's
  // ear): morphs its `d` while also fading itself, so the target artwork
  // fully replaces it right as it lands rather than sitting on top of it.
  const MED_HIDE = 'kit-medical-piece-hide-for-polish 4s ease-in-out infinite'

  const earLeftAnimation = ready
    ? 'kit-ready-ear-morph 3s ease-in-out infinite'
    : loading
      ? 'kit-ear-flyaway-left 3.2s ease-in-out infinite'
      : error
        ? 'kit-error-ear-left-morph 3s ease-in-out infinite'
        : sparkle
          ? FADE_OUT_SHRINK
          : medical
            ? `kit-medical-ear-left-handle-morph 4s ease-in-out infinite, ${MED_HIDE}`
            : 'none'
  const earRightAnimation = loading
    ? 'kit-ear-flyaway-right 3.2s ease-in-out infinite'
    : error
      ? 'kit-error-ear-right-morph 3s ease-in-out infinite'
      : ready || sparkle
        ? FADE_OUT_SHRINK
        : medical
          ? `kit-medical-ear-right-outline-morph 4s ease-in-out infinite, ${MED_HIDE}`
          : 'none'
  const eyeLeftAnimation = idle
    ? 'kit-blink 2s ease-in-out infinite'
    : loading
      ? 'kit-loading-eye-left 3.2s ease-in-out infinite'
      : error
        ? 'kit-error-eye-left-bar-morph 3s ease-in-out infinite'
        : ready || sparkle || medical
          ? (medical ? FADE_OUT_SHRINK_MED : FADE_OUT_SHRINK)
          : 'none'
  const eyeRightAnimation = idle
    ? 'kit-blink 2s ease-in-out infinite'
    : loading
      ? 'kit-loading-eye-right 3.2s ease-in-out infinite'
      : ready || error || sparkle || medical
        ? (medical ? FADE_OUT_SHRINK_MED : FADE_OUT_SHRINK)
        : 'none'
  const noseAnimation = idle
    ? 'kit-nose-wiggle 2s ease-in-out infinite'
    : loading
      ? 'kit-loading-nose 3.2s ease-in-out infinite'
      : vanish
        ? 'kit-nose-vanish-pulse 3.2s ease-in-out infinite'
        : error
          ? 'kit-error-nose-dot-morph 3s ease-in-out infinite'
          : ready || sparkle || medical
            ? (medical ? FADE_OUT_SHRINK_MED : FADE_OUT_SHRINK)
            : 'none'

  const whiskerAnimation = (side, index) => {
    if (thinking) return 'kit-whisker-twitch 1.4s ease-in-out infinite'
    if (loading) return `kit-whisker-flyaway-${side} 3.2s ease-in-out infinite`
    if (ready || error) return FADE_OUT_SHRINK
    if (sparkle) return `${ASTERISK_WHISKER_KEYFRAMES[side][index]} 3s ease-in-out infinite, ${FADE_OUT}`
    if (medical) {
      if (side === 'left' && index === 0) return `kit-medical-cross-leftarm-morph 4s ease-in-out infinite, ${MED_HIDE}`
      if (side === 'left' && index === 1) return `kit-medical-cross-vertical-morph 4s ease-in-out infinite, ${MED_HIDE}`
      if (side === 'right' && index === 0) return `kit-medical-cross-rightarm-morph 4s ease-in-out infinite, ${MED_HIDE}`
      return FADE_OUT_SHRINK_MED
    }
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
          animation: thinking ? 'kit-head-tilt 2.6s ease-in-out infinite' : 'none',
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
        '& .kit-sparkle-star': {
          transformBox: 'fill-box',
          transformOrigin: 'center',
          opacity: 0,
          animation: sparkle ? `${FADE_IN}, kit-sparkle-pop-and-pulse 3s ease-in-out infinite` : 'none',
        },
        '& .kit-medical-icon': {
          opacity: 0,
          animation: medical ? 'kit-medical-icon-fade 4s ease-in-out infinite' : 'none',
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

      {/* Sparkle end-state: exact star artwork, centred on the nose. */}
      <svg className="kit-sparkle-star" x="44.67" y="70.58" width="70" height="57.3" viewBox="0 0 88 72">
        <path d={SPARKLE_STAR_PATH} fill="#3B4960" />
      </svg>

      {/* Medical: the flat bag icon, briefly crossfaded in once the
          hand-morphed ears/whiskers have arrived, to polish the result. */}
      <svg className="kit-medical-icon" x="9.05" y="0" width="136.9" height="147" viewBox="0 0 149 160">
        <path d={MEDICAL_BAG_ICON_PATH} fill="#3B4960" fillRule="evenodd" />
      </svg>
    </Box>
  )
}
