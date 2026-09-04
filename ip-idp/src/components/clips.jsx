import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Box, Button, Chip, Dialog, Divider, IconButton, ListItemIcon, Menu, MenuItem, Paper,
  Tooltip, Typography,
} from '@mui/material'
import PlayCircleIcon from '@mui/icons-material/PlayCircleOutline'
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
import { athleteById } from '../data/athletes'
import {
  CLIPS, PEAK_METRICS, SHARE_TARGETS, clipSourceLine, clipSrc, distanceSeries, posterSrc,
  principleLabel, toSeconds,
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

const HudlBackdrop = ({ file, mark = '42%' }) => (
  <Box sx={{ position: 'absolute', inset: 0, bgcolor: colors.grey_400, overflow: 'hidden' }}>
    <Box component="img" src={placeholderSrc(file)} alt="" aria-hidden
      sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    {/* Scrim: the watermark has to read over a bright pitch as well as a dark one. */}
    <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(13,27,48,0.42)' }} />
    {!!mark && (
      <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <HudlMark width={mark} />
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
 * The player. If the file is not on disk yet the video element fires an error,
 * and rather than leaving a black box we say so and name the file that is
 * missing — which is also what makes the clip manifest verifiable at a glance.
 */
export const ClipPlayer = ({ file, autoPlay, height = 420, onTime, onDuration, fallbackDuration }) => {
  const [failed, setFailed] = useState(false)
  const ref = useRef(null)

  // A <video> pointed at a missing file does not reliably raise an error event
  // until playback is attempted — Chrome just sits at readyState 0 showing a
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

  // The playhead has to move smoothly, and `timeupdate` only fires about four
  // times a second. A frame loop while the video is playing reads currentTime
  // directly; the event handlers cover seeking and the paused states.
  const raf = useRef(0)
  const stop = () => { cancelAnimationFrame(raf.current); raf.current = 0 }
  const follow = () => {
    const v = ref.current
    if (v) onTime?.(v.currentTime)
    raf.current = requestAnimationFrame(follow)
  }
  useEffect(() => stop, [])

  /**
   * Until the real media lands there is nothing to play, so the missing-clip
   * panel offers a synthetic clock over the fixture's duration. It drives the
   * same playhead the video would, which is what makes the chart's sync
   * reviewable before a single file has been cut.
   */
  const [preview, setPreview] = useState(false)
  useEffect(() => {
    if (!preview || !fallbackDuration) return undefined
    const started = performance.now()
    let id = 0
    const step = () => {
      const t = (performance.now() - started) / 1000
      if (t >= fallbackDuration) { onTime?.(fallbackDuration); setPreview(false); return }
      onTime?.(t)
      id = requestAnimationFrame(step)
    }
    id = requestAnimationFrame(step)
    return () => cancelAnimationFrame(id)
  }, [preview, fallbackDuration, onTime])

  return (
    <Box sx={{ position: 'relative', width: '100%', height, bgcolor: colors.grey_400,
      borderRadius: 1, overflow: 'hidden' }}>
      {!failed && (
        <Box component="video" ref={ref} src={clipSrc(file)} poster={posterSrc(file)}
          controls autoPlay={autoPlay} playsInline preload="metadata"
          onError={() => setFailed(true)}
          onLoadedMetadata={e => onDuration?.(e.currentTarget.duration)}
          onPlay={() => { stop(); follow() }}
          onPause={() => { stop(); onTime?.(ref.current?.currentTime ?? 0) }}
          onEnded={stop}
          onSeeked={e => onTime?.(e.currentTarget.currentTime)}
          onTimeUpdate={e => { if (!raf.current) onTime?.(e.currentTarget.currentTime) }}
          sx={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain', bgcolor: colors.grey_400 }} />
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
              {!!fallbackDuration && onTime && (
                <Button variant="outlined" size="small" startIcon={<PlayCircleIcon />}
                  onClick={() => { onTime(0); setPreview(true) }} disabled={preview}>
                  {preview ? 'Running timeline…' : 'Run the timeline without video'}
                </Button>
              )}
            </Paper>
          </Box>
        </Box>
      )}
    </Box>
  )
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
  return (
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, overflow: 'hidden',
      display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ClipThumb file={clip.file} duration={clip.duration} onClick={() => onOpen(clip)} />
      <Box sx={{ p: 1.5, display: 'flex', alignItems: 'flex-start', gap: 0.5, flex: 1 }}>
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
export const ClipDialog = ({ clip, drill, onClose, onShare, starred = false, onStar }) => {
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(null)

  const fixture = clip ? toSeconds(clip.duration) : 0
  // The video's own duration wins as soon as metadata loads, so the chart's
  // x-axis always matches the media rather than the fixture that stood in for it.
  const span = duration || fixture || 1

  useEffect(() => { setTime(0); setDuration(null) }, [clip?.id])

  const series = useMemo(
    () => (clip?.drillId
      ? distanceSeries({ drillId: clip.drillId, athleteId: clip.athleteId, duration: span })
      : []),
    [clip?.drillId, clip?.athleteId, span],
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
          <ClipPlayer file={clip.file} autoPlay height={360} fallbackDuration={fixture}
            onTime={setTime} onDuration={d => Number.isFinite(d) && d > 0 && setDuration(d)} />
          {series.length ? (
            <DistanceChart series={series} duration={span} playhead={time}
              drillName={drill?.name} />
          ) : (
            <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 2 }}>
              <Typography variant="subtitle1">Distance covered</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                Distance is tracked per drill. This clip came from a game, so it has no drill
                to plot against.
              </Typography>
            </Paper>
          )}
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
      </Box>
    </Dialog>
  )
}

/** Full-drill playback — the whole team, uncut, above that drill's clips. */
export const FullDrillCard = ({ drill, onOpen }) => (
  <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 2, display: 'flex',
    gap: 2, alignItems: 'center', bgcolor: colors.blue_25 }}>
    <Box sx={{ width: 210, flexShrink: 0 }}>
      <ClipThumb file={drill.fullClip.file} duration={drill.fullClip.duration} height={118}
        onClick={onOpen} />
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant="subtitle1">Full drill playback</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Whole team, uncut · {drill.fullClip.duration} · {drill.fullClip.angle} · {drill.areaSize}
      </Typography>
    </Box>
    <Button variant="outlined" startIcon={<PlayCircleIcon />} onClick={onOpen} sx={{ flexShrink: 0 }}>
      Watch full drill
    </Button>
  </Paper>
)
