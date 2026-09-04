import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Avatar, Box, Button, Chip, Dialog, Divider, IconButton, ListItemIcon, Menu, MenuItem, Paper,
  TextField, Tooltip, Typography,
} from '@mui/material'
import PlayCircleIcon from '@mui/icons-material/PlayCircleOutline'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import CloseIcon from '@mui/icons-material/Close'
import ShareIcon from '@mui/icons-material/ShareOutlined'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import SpeedIcon from '@mui/icons-material/SpeedOutlined'
import TrendingUpIcon from '@mui/icons-material/TrendingUpOutlined'
import FavoriteIcon from '@mui/icons-material/FavoriteBorderOutlined'
import PersonIcon from '@mui/icons-material/PersonOutline'
import BadgeIcon from '@mui/icons-material/BadgeOutlined'
import LinkIcon from '@mui/icons-material/LinkOutlined'
import colors from '../theme/tokens'
import DistanceChart from './DistanceChart'
import { athleteById, initialsOf, photoUrl } from '../data/athletes'
import { commentsFor } from '../data/comments'
import {
  CHART_METRICS, CLIPS, PEAK_METRICS, SHARE_TARGETS, clipSource, clipSourceLine,
  clipSrc, clipWindow, distanceSeries, posterSrc, principleLabel, recordingFor, toSeconds,
} from '../data/video'

/* ------------------------------------------------------------------ pieces */

/**
 * The Hudl logo, drawn rather than loaded, so the watermark needs no asset in
 * either app's public folder and its colours can be set for the backdrop it
 * sits on. Paths are the ones in the supplied Hudl Logo.svg; the wordmark is
 * white here because it always sits over a darkened still.
 */
const HudlMark = ({ width = 96, opacity = 0.9, word = '#ffffff', shadow = true }) => (
  <Box component="svg" viewBox="-280 578.1 434 141.8" aria-hidden
    sx={{ width, maxWidth: 168, minWidth: 44, height: 'auto', opacity, display: 'block',
      filter: shadow ? 'drop-shadow(0 2px 6px rgba(13,27,48,.6))' : 'none' }}>
    <path fill={word} d="M-77.2,624.1c-4.6,0-9.2,0.9-13.5,2.5v-35.8H-118v110.3h27.3v-54.8c1.8-0.8,3.8-1.1,5.8-1.1
      c5.8,0,8.3,2.8,8.3,8v47.9h27.2v-50.8C-49.4,633.4-59,624.1-77.2,624.1L-77.2,624.1z M2.7,680.1c-1.1,0.4-3.2,0.7-5.8,0.7
      c-5.1,0-7.7-2.1-7.7-6.9v-48.6H-38v47.9c0,21.2,11.7,29.6,35,29.6c12.6,0,25.7-2.2,33-5.6v-71.9H2.7V680.1L2.7,680.1z M85,625.8
      c-2.6-0.7-5.3-1.1-8-1.1c-23.7,0-35.8,15-35.8,38.5c0,26,13.9,39.7,39.7,39.7c13.3,0,24.9-2.4,31.3-5.6V590.8H85L85,625.8
      L85,625.8z M85,681.3c-1,0.4-2.8,0.6-4.6,0.6c-7.7,0-11.9-6-11.9-19c0-11,4.1-18.1,11.7-18.1c2,0,4.1,0.4,4.9,0.8L85,681.3
      L85,681.3L85,681.3z M126.7,590.8v110.3H154V590.8H126.7L126.7,590.8z" />
    <path fill="#FF6300" d="M-208.8,719.9c-11.3,0-21.1-7.7-23.7-18.6c0-0.1-0.1-0.3-0.3-0.3c-3.2-1.3-6.3-2.8-9.3-4.6
      c-0.1-0.1-0.2-0.1-0.2-0.2c-4.3-11.2-5.4-23.4-3.2-35.2c0-0.2,0.2-0.3,0.3-0.4h0.1c0.1,0,0.3,0,0.4,0.1c6,6.4,13.2,11.6,21.2,15.1
      c0.1,0,0.1,0,0.2,0c0.1,0,0.2,0,0.3-0.1c10.6-7.6,25.3-5.5,33.3,4.8c0.1,0.1,0.2,0.2,0.4,0.2h0.1c2.2-0.3,4.5-0.7,6.7-1.3
      c13.3-3.2,25.2-10.5,34-20.9c0.1-0.1,0.2-0.2,0.3-0.2c0.1,0,0.1,0,0.2,0.1c0.2,0.1,0.3,0.3,0.2,0.5c-5.3,18.9-19,34.3-37.2,41.8
      c-0.1,0.1-0.2,0.2-0.3,0.3C-187.7,712.1-197.5,719.9-208.8,719.9z M-254.2,686.5c-0.1,0-0.2,0-0.3-0.1c-13.8-14-20.3-33.6-17.6-53
      c0-0.1,0-0.3-0.1-0.4c-8.2-7.7-10.1-20.1-4.5-29.8c5.6-9.8,17.2-14.4,28-11.3c0.1,0,0.3,0,0.4-0.1c2.7-2.2,5.6-4.1,8.7-5.8
      c0.1,0,0.1-0.1,0.2-0.1c11.9,1.8,23.1,7,32.2,14.9c0.1,0.1,0.2,0.3,0.1,0.4c0,0.2-0.2,0.3-0.3,0.3c-8.6,1.9-16.7,5.6-23.7,10.8
      c-0.1,0.1-0.2,0.3-0.2,0.4c0.1,0.8,0.1,1.6,0.1,2.5c-0.1,12.1-9,22.3-21,24c-0.2,0-0.3,0.1-0.4,0.3c-0.9,2.1-1.6,4.3-2.2,6.4
      c-3.8,13.1-3.5,27,1.1,39.9c0.1,0.1,0,0.3-0.1,0.4C-253.9,686.4-254.1,686.5-254.2,686.5L-254.2,686.5z M-174.5,663.8
      c-0.1,0-0.3-0.1-0.4-0.2c-0.1-0.1-0.1-0.3-0.1-0.4c2.6-8.3,3.4-17,2.5-25.6c0-0.2-0.1-0.3-0.3-0.4c-8.6-4-14.1-12.6-14.1-22
      c0-3.2,0.6-6.3,1.8-9.3c0.1-0.1,0-0.3-0.1-0.5c-1.5-1.9-3-3.7-4.6-5.5c-9.4-9.9-21.7-16.5-35-19c-0.2,0-0.4-0.2-0.4-0.4
      c0-0.2,0.1-0.4,0.3-0.5c19.2-4.9,39.6-0.6,55.1,11.7c0.1,0.1,0.2,0.1,0.3,0.1c0,0,0.1,0,0.1,0c2.2-0.7,4.5-1,6.8-1
      c10,0,19,6.1,22.7,15.3c3.7,9.3,1.3,19.9-6,26.7c-0.1,0.1-0.2,0.2-0.1,0.4c0.4,2.8,0.6,5.7,0.6,8.5c0,0.3,0,0.5,0,0.8l0,0.5
      c0,0.1,0,0.2-0.1,0.3c-7.5,9.4-17.5,16.4-28.9,20.4L-174.5,663.8z" />
  </Box>
)

/**
 * The stand-in behind every thumbnail and every player until the real clips
 * land: a training still under a scrim, watermarked with the Hudl logo so it is
 * unmistakably a placeholder rather than the footage itself.
 *
 * The still is chosen from the clip's file name, so a given clip always shows
 * the same frame — a grid that reshuffled its images on every render would look
 * broken rather than pending.
 */
const PLACEHOLDERS = 6

export const placeholderSrc = file => {
  const n = [...String(file)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % PLACEHOLDERS
  return `${CLIPS}placeholders/hudl-0${n + 1}.jpg`
}

const HudlBackdrop = ({ file, mark = '42%', corner = false }) => (
  <Box sx={{ position: 'absolute', inset: 0, bgcolor: colors.grey_400, overflow: 'hidden' }}>
    <Box component="img" src={placeholderSrc(file)} alt="" aria-hidden
      sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    {/* Scrim: the watermark has to read over a bright pitch as well as a dark one. */}
    <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(13,27,48,0.42)' }} />
    {!!mark && (
      // Centred on a thumbnail, where it is the only thing on the still. Down in
      // the corner behind a player's preview, where the play button owns the
      // middle and two glyphs stacked on each other read as a mistake.
      <Box sx={corner
        ? { position: 'absolute', left: 14, bottom: 12 }
        : { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <HudlMark width={corner ? 76 : mark} />
      </Box>
    )}
  </Box>
)

/** Thumbnail: the poster if it exists, the drawn pitch if it does not. */
export const ClipThumb = ({ file, duration, height = 108, badge, onClick }) => {
  const [broken, setBroken] = useState(false)
  return (
    <Box onClick={onClick}
      sx={{ position: 'relative', height, borderRadius: 1, overflow: 'hidden', flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default', bgcolor: colors.neutral_200 }}>
      {broken
        ? <HudlBackdrop file={file} />
        : <Box component="img" src={posterSrc(file)} alt="" onError={() => setBroken(true)}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
      {/* Bottom left, not centred: the centre of a placeholder is the Hudl
          watermark, and the whole tile is the click target anyway. */}
      <PlayCircleIcon sx={{ position: 'absolute', left: 6, bottom: 6,
        fontSize: height > 140 ? 40 : 28, color: colors.white,
        filter: 'drop-shadow(0 1px 3px rgba(13,27,48,0.55))' }} />
      {duration && (
        <Typography variant="caption" sx={{ position: 'absolute', right: 6, bottom: 6, px: 0.75,
          borderRadius: 0.5, bgcolor: 'rgba(13,27,48,0.78)', color: colors.white, fontWeight: 600 }}>
          {duration}
        </Typography>
      )}
      {badge && (
        <Box sx={{ position: 'absolute', left: 6, top: 6 }}>{badge}</Box>
      )}
    </Box>
  )
}

/**
 * The player.
 *
 * A clip is a window into the session recording, not a file of its own, so the
 * native controls are off: their scrubber would show the whole recording and
 * make a twelve-second clip look like a two-and-a-half-minute one. The bar
 * below is scoped to the window — 0:00 is the in point, the end is the out
 * point — and playback stops itself there.
 *
 * `window` is expressed against `nominalTotal`. The real duration is read from
 * the media and every bound scaled by the ratio, so a longer recording dropped
 * in its place spreads the same windows further apart with no data edit.
 */
export const ClipPlayer = ({
  file, autoPlay, height = 420, window: win, nominalTotal, at = 0, onTime, onSpan,
  fallbackDuration, seekRef,
}) => {
  const [failed, setFailed] = useState(false)
  const [stalled, setStalled] = useState(false)
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [span, setSpan] = useState(() => (win ? win.out - win.in : fallbackDuration || 0))
  const ref = useRef(null)
  const bounds = useRef({ in: win?.in ?? 0, out: win?.out ?? 0 })

  // A <video> pointed at a missing file does not reliably raise an error event
  // until playback is attempted — Chrome just sits at readyState 0 behind a
  // spinner. One HEAD request settles it, and it behaves the same in dev and on
  // Pages. The element's own onError stays as a second line of defence.
  useEffect(() => {
    let live = true
    setFailed(false)
    fetch(clipSrc(file), { method: 'HEAD' })
      .then(r => { if (live && !r.ok) setFailed(true) })
      .catch(() => { if (live) setFailed(true) })
    return () => { live = false }
  }, [file])

  /**
   * The position is the owner's, not the player's.
   *
   * It used to be both: this component kept its own `at` state for the scrubber
   * while the chart read the parent's copy. Two states fed from one loop is two
   * states that can disagree, and they did — the scrubber sat at zero while the
   * video, the readout and the chart's playhead all ran on. One number now, held
   * by whoever owns the chart as well, so the three cannot drift apart.
   */
  const report = t => onTime?.(t)

  /** The clip's clock from the recording's: 0 is the window's in point. */
  const rel = t => Math.max(0, (t ?? 0) - bounds.current.in)

  /**
   * The frame loop exists only for smoothness. `timeupdate` fires about four
   * times a second, which reads as a stepping playhead, so a loop reads
   * `currentTime` every frame while the video plays.
   *
   * It is never the only driver. `requestAnimationFrame` does not fire in a tab
   * the browser treats as hidden or throttled, and this component once had no
   * `timeupdate` handler at all — so wherever the loop did not run, nothing
   * moved the playhead while the video played on. Both report into the same
   * idempotent function now.
   */
  const raf = useRef(0)
  const stop = () => { cancelAnimationFrame(raf.current); raf.current = 0 }

  const follow = () => {
    const v = ref.current
    if (v) {
      if (v.currentTime >= bounds.current.out) {
        v.pause()
        v.currentTime = bounds.current.out
        report(rel(bounds.current.out))
        setPlaying(false)
        stop()
        return
      }
      report(rel(v.currentTime))
    }
    raf.current = requestAnimationFrame(follow)
  }
  useEffect(() => stop, [])

  /**
   * Some contexts never get as far as metadata — a browser window that is not
   * visible defers media loading outright, and a slow connection can look the
   * same. Rather than leave a black rectangle, the timeline is offered on its
   * own after a few seconds so the chart is still reviewable.
   */
  useEffect(() => {
    setStalled(false)
    const id = setTimeout(() => {
      if ((ref.current?.readyState ?? 0) === 0) setStalled(true)
    }, 6000)
    return () => clearTimeout(id)
  }, [file, win?.in])

  const onMeta = e => {
    setStalled(false)
    const v = e.currentTarget
    // Scale the window to whatever the media's real length turns out to be.
    const scale = nominalTotal && v.duration ? v.duration / nominalTotal : 1
    const lo = (win?.in ?? 0) * scale
    const hi = Math.min(v.duration, (win?.out ?? v.duration) * scale)
    bounds.current = { in: lo, out: hi }
    setSpan(hi - lo)
    onSpan?.(hi - lo)
    v.currentTime = lo
    report(0)
    if (autoPlay) v.play().catch(() => {})
  }

  useEffect(() => { setStarted(false) }, [file, win?.in])

  const toggle = () => {
    const v = ref.current
    if (!v) return
    if (v.paused) {
      if (v.currentTime >= bounds.current.out - 0.05) v.currentTime = bounds.current.in
      v.play().catch(() => {})
    } else v.pause()
  }

  const seekTo = t => {
    const v = ref.current
    if (!v) return
    v.currentTime = bounds.current.in + Math.min(Math.max(t, 0), span)
    report(Math.min(Math.max(t, 0), span))
  }

  // The owner needs to be able to jump the video — a comment pinned to a moment
  // is only useful if clicking it goes there. Handed over as a ref rather than
  // lifted out: seeking needs the element and the scaled window bounds, both of
  // which live here.
  useEffect(() => {
    if (!seekRef) return undefined
    seekRef.current = seekTo
    return () => { seekRef.current = null }
  })

  /**
   * Until the recording is in place there is nothing to play, so the
   * missing-clip panel offers a synthetic clock over the clip's length. It
   * drives the same playhead the video would, which keeps the chart's sync
   * reviewable when the media is not there.
   */
  const [preview, setPreview] = useState(false)
  useEffect(() => {
    if (!preview) return undefined
    const total = span || fallbackDuration || 0
    if (!total) return undefined
    const started = performance.now()
    let id = 0
    const step = () => {
      const t = (performance.now() - started) / 1000
      if (t >= total) { report(total); setPreview(false); return }
      report(t)
      id = requestAnimationFrame(step)
    }
    id = requestAnimationFrame(step)
    return () => cancelAnimationFrame(id)
  }, [preview, span, fallbackDuration])

  return (
    <Box>
      <Box sx={{ position: 'relative', width: '100%', height, bgcolor: colors.grey_400,
        borderRadius: 1, overflow: 'hidden' }}>
        {!failed && (
          <Box component="video" ref={ref} src={clipSrc(file)}
            playsInline preload="metadata" onClick={toggle}
            onError={() => setFailed(true)}
            onLoadedMetadata={onMeta}
            onPlay={() => { setStarted(true); setPlaying(true); stop(); follow() }}
            onPause={() => { setPlaying(false); stop(); report(rel(ref.current?.currentTime)) }}
            onSeeked={e => report(rel(e.currentTarget.currentTime))}
            onTimeUpdate={e => report(rel(e.currentTarget.currentTime))}
            sx={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain',
              bgcolor: colors.grey_400, cursor: 'pointer' }} />
        )}
        {/* The still, watermarked, until the coach asks for the video. Nothing
            plays on open: a modal that starts talking the moment it appears is
            a modal you fight, and the chart is worth reading first. */}
        {!failed && !started && (
          <Box onClick={toggle}
            sx={{ position: 'absolute', inset: 0, cursor: 'pointer' }}>
            <HudlBackdrop file={file} corner />
            <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
              <PlayCircleIcon sx={{ fontSize: 64, color: colors.white,
                filter: 'drop-shadow(0 2px 8px rgba(13,27,48,.6))' }} />
            </Box>
          </Box>
        )}
        {!failed && stalled && !started && (
          <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', px: 4,
            bgcolor: 'rgba(13,27,48,.72)' }}>
            <Paper variant="outlined" sx={{ borderColor: colors.neutral_400, p: 2.5, maxWidth: 420,
              textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2">Still loading the recording</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                The chart does not need the video to be reviewed.
              </Typography>
              <Button variant="outlined" size="small" startIcon={<PlayCircleIcon />}
                onClick={() => { report(0); setPreview(true) }} disabled={preview}>
                {preview ? 'Running timeline…' : 'Run the timeline without video'}
              </Button>
            </Paper>
          </Box>
        )}
        {failed && (
          <Box sx={{ position: 'absolute', inset: 0 }}>
            {/* No centred watermark here: it would sit behind the panel. The mark
                goes inside the panel instead, where it still says whose clip this is. */}
            <HudlBackdrop file={file} mark={0} />
            <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', px: 4 }}>
              <Paper variant="outlined" sx={{ borderColor: colors.neutral_400, p: 2.5, maxWidth: 420,
                textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <HudlMark width={72} opacity={1} word={colors.grey_200} shadow={false} />
                <Typography variant="subtitle2">Clip not imported yet</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Hudl has the tag but the media has not synced. Expected file:{' '}
                  <Box component="code" sx={{ fontFamily: 'monospace', fontSize: 12 }}>{file}</Box>
                </Typography>
                {!!(span || fallbackDuration) && onTime && (
                  <Button variant="outlined" size="small" startIcon={<PlayCircleIcon />}
                    onClick={() => { report(0); setPreview(true) }} disabled={preview}>
                    {preview ? 'Running timeline…' : 'Run the timeline without video'}
                  </Button>
                )}
              </Paper>
            </Box>
          </Box>
        )}
      </Box>

      {/* Controls scoped to the clip, not to the recording behind it. */}
      {!failed && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
          <IconButton size="small" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}
            sx={{ bgcolor: colors.grey_200, color: colors.white,
              '&:hover': { bgcolor: colors.grey_300 } }}>
            {playing ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
          </IconButton>
          <Scrubber at={at} span={span} onSeek={seekTo} />
          <Typography variant="caption" sx={{ color: 'text.secondary', flexShrink: 0,
            fontVariantNumeric: 'tabular-nums' }}>
            {clock(at)} / {clock(span)}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

const PER_PAGE = 3

/**
 * The clip's position, and the way to scrub it.
 *
 * This was a MUI Slider and it would not track playback: the readout and the
 * chart's playhead both advanced off the same number while the thumb sat at
 * zero. I could not reproduce it in any harness — driving the same value
 * through `timeupdate`, through the frame loop, or through the Slider's own
 * onChange all moved the thumb correctly — so rather than guess at MUI's
 * internals a fourth time, the position is drawn here.
 *
 * The bar and the thumb are pure functions of `at`, with no state of their own
 * and nothing to get stale. Keyboard support is the part a Slider was giving us,
 * so it is kept explicitly: the track is focusable, arrows step, Home and End
 * jump, and the aria attributes say what a slider's would.
 */
const Scrubber = ({ at, span, onSeek }) => {
  const total = Math.max(span, 0.001)
  const pct = Math.min(100, Math.max(0, (at / total) * 100))

  const seekFromPointer = e => {
    const box = e.currentTarget.getBoundingClientRect()
    onSeek(((e.clientX - box.left) / box.width) * total)
  }

  const onKey = e => {
    const step = e.shiftKey ? total / 10 : 1
    const to = {
      ArrowRight: at + step, ArrowLeft: at - step,
      ArrowUp: at + step, ArrowDown: at - step,
      Home: 0, End: total,
    }[e.key]
    if (to === undefined) return
    e.preventDefault()
    onSeek(Math.min(total, Math.max(0, to)))
  }

  return (
    <Box
      role="slider" tabIndex={0} aria-label="Clip position"
      aria-valuemin={0} aria-valuemax={Math.round(total)} aria-valuenow={Math.round(at)}
      aria-valuetext={`${clock(at)} of ${clock(span)}`}
      onPointerDown={seekFromPointer} onKeyDown={onKey}
      sx={{ flex: 1, position: 'relative', height: 20, display: 'flex', alignItems: 'center',
        cursor: 'pointer', touchAction: 'none',
        '&:focus-visible': { outline: `2px solid ${colors.grey_200}`, outlineOffset: 2, borderRadius: 1 } }}
    >
      <Box sx={{ position: 'absolute', left: 0, right: 0, height: 4, borderRadius: 2,
        bgcolor: colors.neutral_300 }} />
      {/* The two moving parts take inline styles, not `sx`. A value that changes
          on every frame would otherwise have emotion mint a new class per
          percentage and inject it into the stylesheet sixty times a second. */}
      <Box style={{ width: `${pct}%` }}
        sx={{ position: 'absolute', left: 0, height: 4, borderRadius: 2, bgcolor: colors.grey_200 }} />
      <Box style={{ left: `${pct}%` }}
        sx={{ position: 'absolute', width: 12, height: 12, ml: '-6px', borderRadius: '50%',
          bgcolor: colors.grey_200, boxShadow: `0 0 0 2px ${colors.white}` }} />
    </Box>
  )
}

/**
 * Today, written out rather than via toLocaleDateString, which gives "Sept" in
 * en-GB and would leave a new comment reading differently from the rest.
 */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const today = () => {
  const d = new Date()
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

/** m:ss for the player's own readout. */
const clock = t => {
  const s = Math.max(0, Math.floor(t || 0))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/** The three peaks that come across with a clip, as small labelled chips. */
const PEAK_ICON = { speed: SpeedIcon, acceleration: TrendingUpIcon, heartRate: FavoriteIcon }

export const PeakChips = ({ peaks, only, size = 'small' }) => (
  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
    {PEAK_METRICS.filter(m => !only || only === m.key).map(m => {
      const Icon = PEAK_ICON[m.key]
      return (
        <Tooltip key={m.key} title={m.label}>
          <Chip size={size} icon={<Icon sx={{ fontSize: 15 }} />} label={m.format(peaks[m.key])}
            sx={{ height: 22, fontSize: 11, bgcolor: colors.neutral_200,
              '& .MuiChip-icon': { color: colors.grey_100, ml: 0.5 } }} />
        </Tooltip>
      )
    })}
  </Box>
)

/**
 * Principles a clip or drill carries. Only the accordion header and the clip
 * dialog show these: repeating them on every tile inside a drill restates what
 * the header already said, three or four times a row.
 */
export const PrincipleChips = ({ principles, max }) => {
  const shown = max ? principles.slice(0, max) : principles
  const rest = principles.length - shown.length
  return (
    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
      {shown.map(p => (
        <Chip key={p} size="small" label={principleLabel(p)}
          sx={{ height: 22, fontSize: 11, bgcolor: colors.blue_50, color: colors.blue_100 }} />
      ))}
      {rest > 0 && <Chip size="small" label={`+${rest}`} sx={{ height: 22, fontSize: 11 }} />}
    </Box>
  )
}

/* ----------------------------------------------------------------- starring */

/** Favourite toggle. Filled and amber when on, outline in the surface when off. */
export const StarButton = ({ on, onToggle, size = 'small', label = 'clip' }) => (
  <Tooltip title={on ? `Remove ${label} from favourites` : `Add ${label} to favourites`}>
    <IconButton size={size} aria-label={on ? 'Starred' : 'Not starred'} aria-pressed={on}
      onClick={e => { e.stopPropagation(); onToggle() }}
      sx={{ color: on ? colors.yellow_100 : undefined }}>
      {on ? <StarIcon fontSize={size} /> : <StarBorderIcon fontSize={size} />}
    </IconButton>
  </Tooltip>
)

/* -------------------------------------------------------------------- share */

const SHARE_ICON = { link: LinkIcon, athlete: PersonIcon, staff: BadgeIcon }

/** One Share button, three targets behind it. */
export const ShareButton = ({ onShare, variant = 'outlined', size = 'medium' }) => {
  const [el, setEl] = useState(null)
  return (
    <>
      <Button variant={variant} size={size} startIcon={<ShareIcon />} endIcon={<KeyboardArrowDownIcon />}
        onClick={e => setEl(e.currentTarget)}>
        Share
      </Button>
      <Menu anchorEl={el} open={!!el} onClose={() => setEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        {SHARE_TARGETS.map(t => {
          const Icon = SHARE_ICON[t.key]
          return (
            <MenuItem key={t.key} sx={{ minWidth: 210 }} onClick={() => { setEl(null); onShare(t) }}>
              <ListItemIcon><Icon fontSize="small" /></ListItemIcon>
              {t.label}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}

/** Confirmation copy for a share, so the tile and the dialog agree. */
export const shareMessage = (target, clip) => {
  const athlete = clip && athleteById(clip.athleteId)
  switch (target.key) {
    case 'link': return 'Link copied'
    case 'athlete': return athlete ? `Clip shared with ${athlete.name}` : 'Clip shared with the athletes in it'
    case 'staff': return 'Clip shared with staff on this event'
    default: return 'Done'
  }
}

/* --------------------------------------------------------------------- tile */

/**
 * One clip. The thumbnail is the play target; the star is the only control on
 * it, because sharing belongs with the clip you have just watched rather than
 * with a thumbnail you have only looked at.
 */
export const ClipTile = ({ clip, onOpen, starred = false, onStar, showSource }) => {
  const athlete = athleteById(clip.athleteId)
  const source = clipSource(clip)
  return (
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, overflow: 'hidden',
      display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ClipThumb file={clip.file} duration={clip.duration} onClick={() => onOpen(clip)}
        badge={showSource ? (
          <Chip size="small" label={source.type}
            sx={{ height: 18, fontSize: 10, fontWeight: 700, color: colors.white,
              bgcolor: source.type === 'Game' ? colors.blue_100 : colors.green_200 }} />
        ) : undefined} />
      <Box sx={{ p: 1.5, display: 'flex', alignItems: 'flex-start', gap: 1.25, flex: 1 }}>
        {/* Whose clip this is, before you read a word of it. The full-drill
            playback has no single athlete, so it gets no avatar. */}
        {athlete && (
          <Avatar src={photoUrl(athlete)} alt=""
            sx={{ width: 32, height: 32, mt: 0.25, flexShrink: 0,
              bgcolor: colors.neutral_300, color: colors.grey_100, fontSize: 12 }}>
            {initialsOf(athlete.name)}
          </Avatar>
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ lineHeight: 1.35 }}>{clip.title}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            {athlete?.name} · {athlete?.position} · {clip.at}
          </Typography>
          <Box sx={{ mt: 0.75 }}><PeakChips peaks={clip.peaks} /></Box>
          {showSource && (
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
              {clipSourceLine(clip)}
            </Typography>
          )}
        </Box>
        {onStar && <StarButton on={starred} onToggle={() => onStar(clip.id)} />}
      </Box>
    </Paper>
  )
}

/* ---------------------------------------------------------------- carousel */

/**
 * A drill has a clip for every athlete who took part, which is ten to thirteen
 * of them. A grid of thirteen tiles buries the next drill; three at a time with
 * arrows keeps every drill on screen and still reachable.
 *
 * Paging is clamped to the last page that still has clips, so narrowing a
 * filter never leaves the reader looking at an empty page three. The pages sit
 * on a sliding track — see below for why they are all mounted.
 */
export function ClipCarousel({ clips, onOpen, starred, onStar, label = 'Individual clips', showSource }) {
  const [page, setPage] = useState(0)
  const pages = Math.max(1, Math.ceil(clips.length / PER_PAGE))
  const current = Math.min(page, pages - 1)
  const first = current * PER_PAGE + 1
  const last = Math.min(clips.length, first + PER_PAGE - 1)

  // Every page is mounted and the whole track slides, so the page leaving and
  // the page arriving both move. Rendering one page at a time would only ever
  // animate the arrival, and would re-fetch each thumbnail on the way back.
  const groups = Array.from({ length: pages }, (_, i) => clips.slice(i * PER_PAGE, (i + 1) * PER_PAGE))

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle2">
          {label}
          <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400, ml: 1 }}>
            {first}–{last} of {clips.length}
          </Box>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" aria-label="Previous clips" disabled={current === 0}
            onClick={() => setPage(current - 1)}
            sx={{ border: `1px solid ${colors.neutral_400}`, borderRadius: 1 }}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" aria-label="More clips" disabled={current >= pages - 1}
            onClick={() => setPage(current + 1)}
            sx={{ border: `1px solid ${colors.neutral_400}`, borderRadius: 1 }}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ overflow: 'hidden' }}>
        <Box sx={{
          display: 'flex',
          width: `${pages * 100}%`,
          transform: `translateX(-${(current * 100) / pages}%)`,
          transition: 'transform .34s cubic-bezier(.4, 0, .2, 1)',
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        }}>
          {groups.map((group, i) => (
            <Box key={i} aria-hidden={i !== current}
              sx={{ width: `${100 / pages}%`, flexShrink: 0, display: 'grid', gap: 2,
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: `repeat(${PER_PAGE}, 1fr)` },
                alignContent: 'start',
                // A page off to the side must not be reachable by tab or click.
                pointerEvents: i === current ? 'auto' : 'none' }}>
              {group.map(c => (
                <ClipTile key={c.id} clip={c} onOpen={onOpen} showSource={showSource}
                  starred={starred.has(c.id)} onStar={onStar} />
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

/* ----------------------------------------------------------------- comments */

/**
 * The conversation on a clip.
 *
 * Every comment is pinned to a moment, and the moment is a button: clicking it
 * puts the video there. That is the whole reason to comment on video rather
 * than beside it.
 *
 * The stamp for a new comment is captured when the field is focused, not when
 * it is submitted. Reading the playhead at submit time would stamp whatever
 * frame the video had drifted to while the coach was typing, which is never the
 * frame they meant.
 */
function Comments({ clip, span, at, onSeek }) {
  const [added, setAdded] = useState([])
  const [draft, setDraft] = useState('')
  const [stamp, setStamp] = useState(null)

  useEffect(() => { setAdded([]); setDraft(''); setStamp(null) }, [clip?.id])

  const seeded = useMemo(() => commentsFor(clip, span), [clip?.id, span])
  const all = useMemo(
    () => [...seeded, ...added].sort((a, b) => a.at - b.at),
    [seeded, added],
  )

  const pinned = stamp == null ? at : stamp

  const submit = () => {
    const body = draft.trim()
    if (!body) return
    setAdded(list => [...list, {
      id: `cm-new-${Date.now()}`,
      author: 'Tom Hargreaves',
      role: 'Head Coach',
      date: today(),
      at: Math.round(pinned),
      body,
    }])
    setDraft('')
    setStamp(null)
  }

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
        Comments{all.length ? ` (${all.length})` : ''}
      </Typography>

      {all.map((c, i) => (
        <Box key={c.id} sx={{ display: 'flex', gap: 1.5, py: 1.5,
          borderTop: i ? `1px solid ${colors.neutral_200}` : 0 }}>
          <Avatar sx={{ width: 30, height: 30, fontSize: 11, flexShrink: 0,
            bgcolor: colors.neutral_300, color: colors.grey_100 }}>
            {c.author.split(' ').map(w => w[0]).join('')}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>{c.author}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>{c.date}</Typography>
              <Tooltip title={`Jump to ${clock(c.at)}`}>
                <Chip size="small" clickable icon={<PlayArrowIcon sx={{ fontSize: 14 }} />}
                  label={clock(c.at)} onClick={() => onSeek(c.at)}
                  sx={{ height: 20, fontSize: 11, fontWeight: 700, bgcolor: colors.blue_50,
                    color: colors.blue_100, '& .MuiChip-icon': { color: colors.blue_100, ml: 0.5 } }} />
              </Tooltip>
            </Box>
            <Typography variant="body2" sx={{ mt: 0.25 }}>{c.body}</Typography>
          </Box>
        </Box>
      ))}

      {!all.length && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Nothing on this clip yet.
        </Typography>
      )}

      {/* No button: Enter posts. The moment it will pin to is in the
          placeholder rather than on a chip, so the position is still visible
          without a control sitting under the field to say it. */}
      <Box sx={{ mt: 2 }}>
        <TextField fullWidth multiline minRows={2} label="Add a comment"
          placeholder={`What should they see at ${clock(pinned)}?`}
          helperText="Enter to post · Shift + Enter for a new line"
          value={draft} onChange={e => setDraft(e.target.value)}
          onFocus={() => setStamp(s => (s == null ? at : s))}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
          }} />
      </Box>
    </Box>
  )
}

/* ------------------------------------------------------------------- dialog */

const MetaCell = ({ label, value }) => (
  <Box>
    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{label}</Typography>
    <Typography variant="body2" sx={{ fontWeight: 600 }}>{value}</Typography>
  </Box>
)

/**
 * Clip detail.
 *
 * The header is fixed and only the body scrolls: a coach scrubbing the video or
 * reading the chart should never lose the clip's name, its star or its share
 * button off the top of the dialog.
 *
 * The chart sits beside the video because the two are read together — the
 * playhead in one is the frame in the other. Everything descriptive drops below
 * them, full width, where it does not compete for the space they need.
 */
export const ClipDialog = ({
  clip, drill, onClose, onShare, starred = false, onStar, soloAthlete = false,
}) => {
  const [time, setTime] = useState(0)
  const [measured, setMeasured] = useState(null)
  const [metric, setMetric] = useState(CHART_METRICS[0].key)

  const seekRef = useRef(null)
  const win = useMemo(() => clipWindow(clip), [clip?.id])
  // Which of the three recordings this clip plays. Stable per clip, so it is
  // the same footage every time this one is opened.
  const recording = useMemo(() => recordingFor(clip), [clip?.id])
  // The window's own length until the media reports its real duration, at which
  // point the player hands back the scaled span. The chart's x-axis is whichever
  // is current, so it always covers exactly what the player will play.
  const span = measured || (win.out - win.in) || toSeconds(clip?.duration || '0:10') || 1

  useEffect(() => { setTime(0); setMeasured(null) }, [clip?.id])

  const series = useMemo(
    () => (clip
      ? distanceSeries({
        drillId: clip.drillId,
        athleteId: clip.athleteId,
        duration: span,
        metric,
        // Game clips have no drill to seed on, so the source stands in and the
        // same clip keeps the same lines every time it is opened.
        scope: clip.drillId || clipSourceLine(clip),
      })
      : []),
    [clip?.id, clip?.drillId, clip?.athleteId, span, metric],
  )

  if (!clip) return null
  const athlete = athleteById(clip.athleteId)
  const source = clipSourceLine(clip)

  return (
    <Dialog open onClose={onClose} maxWidth="lg" fullWidth
      PaperProps={{ sx: { maxHeight: '92vh', display: 'flex', flexDirection: 'column' } }}>
      {/* Fixed header */}
      <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 2, px: 3, py: 2, borderBottom: `1px solid ${colors.neutral_300}` }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" sx={{ lineHeight: 1.3 }}>{clip.title}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{source}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          {onStar && <StarButton on={starred} onToggle={() => onStar(clip.id)} size="medium" />}
          <ShareButton size="small" onShare={t => onShare(t, clip)} />
          <IconButton size="small" onClick={onClose} aria-label="Close clip"><CloseIcon /></IconButton>
        </Box>
      </Box>

      {/* Scrolling body */}
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 3 }}>
        <Box sx={{ display: 'grid', gap: 3, alignItems: 'start',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.15fr) minmax(320px, 1fr)' } }}>
          <ClipPlayer file={recording.file} height={340} seekRef={seekRef}
            window={win} nominalTotal={recording.seconds}
            fallbackDuration={win.out - win.in}
            at={time} onTime={setTime}
            onSpan={d => Number.isFinite(d) && d > 0 && setMeasured(d)} />
          <DistanceChart series={series} duration={span} playhead={time}
            drillName={drill?.name || clipSource(clip).opposition} metrics={CHART_METRICS}
            metric={metric} onMetricChange={setMetric}
            focusAthleteId={soloAthlete ? clip.athleteId : null} />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" sx={{ mb: 1.5 }}>Clip details</Typography>
        <Box sx={{ display: 'grid', gap: 2, mb: 2.5,
          gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' } }}>
          {athlete && <MetaCell label="Athlete" value={`${athlete.name} (${athlete.position})`} />}
          {drill && <MetaCell label="Drill" value={drill.name} />}
          <MetaCell label="Timestamp" value={`${clip.at} · ${clip.duration}`} />
          <MetaCell label="Source" value={source} />
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
              Principles
            </Typography>
            <PrincipleChips principles={clip.principles} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
              Peak metrics
            </Typography>
            <PeakChips peaks={clip.peaks} />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Comments clip={clip} span={span} at={time}
          onSeek={t => seekRef.current?.(t)} />
      </Box>
    </Dialog>
  )
}

/**
 * Full-drill playback — this drill's whole stretch of the recording, above the
 * individual clips cut from inside it. Its length is the window's, not a figure
 * of its own, so the card cannot claim more footage than it will play.
 */
export const FullDrillCard = ({ drill, onOpen }) => {
  // The drill's own length, not the window's. What the recording can spare for
  // it is the player's business; the card describes the footage that exists.
  const label = drill.fullClip.duration
  return (
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 2, display: 'flex',
      gap: 2, alignItems: 'center', bgcolor: colors.blue_25 }}>
      <Box sx={{ width: 210, flexShrink: 0 }}>
        <ClipThumb file={`${drill.id}-full.mp4`} duration={label} height={118} onClick={onOpen} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle1">Full drill playback</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Whole team, uncut · {label} · {drill.fullClip.angle} · {drill.areaSize}
        </Typography>
      </Box>
      <Button variant="outlined" startIcon={<PlayCircleIcon />} onClick={onOpen} sx={{ flexShrink: 0 }}>
        Watch full drill
      </Button>
    </Paper>
  )
}
