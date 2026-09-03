import { useEffect, useRef, useState } from 'react'
import {
  Box, Button, Chip, Dialog, DialogContent, Divider, IconButton, List, ListItemButton,
  ListItemIcon, ListItemText, Menu, MenuItem, Paper, Tooltip, Typography,
} from '@mui/material'
import PlayCircleIcon from '@mui/icons-material/PlayCircleOutline'
import CloseIcon from '@mui/icons-material/Close'
import ShareIcon from '@mui/icons-material/ShareOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SpeedIcon from '@mui/icons-material/SpeedOutlined'
import TrendingUpIcon from '@mui/icons-material/TrendingUpOutlined'
import FavoriteIcon from '@mui/icons-material/FavoriteBorderOutlined'
import PersonIcon from '@mui/icons-material/PersonOutline'
import GroupsIcon from '@mui/icons-material/GroupsOutlined'
import BadgeIcon from '@mui/icons-material/BadgeOutlined'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAddOutlined'
import FlagIcon from '@mui/icons-material/FlagOutlined'
import LinkIcon from '@mui/icons-material/LinkOutlined'
import OpenInNewIcon from '@mui/icons-material/OpenInNewOutlined'
import colors from '../theme/tokens'
import { athleteById } from '../data/athletes'
import {
  CLIPS, PEAK_METRICS, SHARE_TARGETS, clipSourceLine, clipSrc, posterSrc, principleLabel,
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
export const ClipPlayer = ({ file, autoPlay, height = 420 }) => {
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

  return (
    <Box sx={{ position: 'relative', width: '100%', height, bgcolor: colors.grey_400,
      borderRadius: 1, overflow: 'hidden' }}>
      {!failed && (
        <Box component="video" ref={ref} src={clipSrc(file)} poster={posterSrc(file)}
          controls autoPlay={autoPlay} playsInline preload="metadata" onError={() => setFailed(true)}
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

/* ------------------------------------------------------------------ share */

const SHARE_ICON = {
  athlete: PersonIcon, squad: GroupsIcon, staff: BadgeIcon, playlist: PlaylistAddIcon,
  goal: FlagIcon, link: LinkIcon, hudl: OpenInNewIcon,
}

/** The share sheet, inline. Used inside the clip dialog. */
export const ShareOptions = ({ onShare, dense }) => (
  <List dense={dense} disablePadding>
    {SHARE_TARGETS.map(t => {
      const Icon = SHARE_ICON[t.key]
      return (
        <ListItemButton key={t.key} onClick={() => onShare(t)} sx={{ borderRadius: 1 }}>
          <ListItemIcon sx={{ minWidth: 36 }}><Icon fontSize="small" /></ListItemIcon>
          <ListItemText primary={t.label} secondary={t.hint}
            primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            secondaryTypographyProps={{ variant: 'caption' }} />
        </ListItemButton>
      )
    })}
  </List>
)

/** The same targets as a menu, for the overflow on a tile. */
export const ShareMenu = ({ anchorEl, onClose, onShare }) => (
  <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={onClose}>
    {SHARE_TARGETS.map(t => {
      const Icon = SHARE_ICON[t.key]
      return (
        <MenuItem key={t.key} sx={{ minWidth: 240 }} onClick={() => { onClose(); onShare(t) }}>
          <ListItemIcon><Icon fontSize="small" /></ListItemIcon>
          {t.label}
        </MenuItem>
      )
    })}
  </Menu>
)

/* ------------------------------------------------------------------- tile */

/**
 * One clip. The whole tile is the play target, and the share options sit beside
 * the player once it opens — a coach who has just watched something is the one
 * who wants to send it on.
 */
export const ClipTile = ({ clip, onOpen, onShare, showSource, highlightMetric }) => {
  const [menuEl, setMenuEl] = useState(null)
  const athlete = athleteById(clip.athleteId)
  return (
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, overflow: 'hidden',
      display: 'flex', flexDirection: 'column' }}>
      <ClipThumb file={clip.file} duration={clip.duration} onClick={() => onOpen(clip)} />
      <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.75, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ lineHeight: 1.35 }}>{clip.title}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              {athlete?.name} · {athlete?.position} · {clip.at}
            </Typography>
          </Box>
          <IconButton size="small" aria-label={`Actions for ${clip.title}`}
            onClick={e => setMenuEl(e.currentTarget)}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        <PrincipleChips principles={clip.principles} max={2} />
        <PeakChips peaks={clip.peaks} only={highlightMetric} />

        {showSource && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{clipSourceLine(clip)}</Typography>
        )}
      </Box>
      <ShareMenu anchorEl={menuEl} onClose={() => setMenuEl(null)}
        onShare={t => onShare(t, clip)} />
    </Paper>
  )
}

/* ----------------------------------------------------------------- dialog */

const MetaRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', gap: 1, py: 0.5 }}>
    <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 104, flexShrink: 0 }}>{label}</Typography>
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{value}</Typography>
  </Box>
)

/**
 * Clip detail. Player on the left, everything the clip carries on the right,
 * with the share sheet under it — which is what a coach reaches for straight
 * after watching.
 */
export const ClipDialog = ({ clip, drill, onClose, onShare }) => {
  const athlete = clip && athleteById(clip.athleteId)
  if (!clip) return null
  const source = clipSourceLine(clip)
  return (
    <Dialog open onClose={onClose} maxWidth="lg" fullWidth>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 2, px: 3, py: 2 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ lineHeight: 1.3 }}>{clip.title}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{source}</Typography>
          </Box>
          <IconButton size="small" onClick={onClose} aria-label="Close clip"><CloseIcon /></IconButton>
        </Box>
        <Divider />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0,1fr) 340px' } }}>
          <Box sx={{ p: 3 }}>
            <ClipPlayer file={clip.file} autoPlay height={400} />
          </Box>
          <Box sx={{ p: 3, borderLeft: { md: `1px solid ${colors.neutral_300}` } }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Clip details</Typography>
            {athlete && <MetaRow label="Athlete" value={`${athlete.name} (${athlete.position})`} />}
            {drill && <MetaRow label="Drill" value={drill.name} />}
            <MetaRow label="Timestamp" value={`${clip.at} · ${clip.duration}`} />
            <MetaRow label="Source" value={source} />
            <Box sx={{ mt: 1.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.75 }}>Principles</Typography>
              <PrincipleChips principles={clip.principles} />
            </Box>
            <Box sx={{ mt: 1.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.75 }}>Peak metrics</Typography>
              <PeakChips peaks={clip.peaks} />
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <ShareIcon fontSize="small" sx={{ color: colors.grey_100 }} />
              <Typography variant="subtitle1">Share</Typography>
            </Box>
            <ShareOptions dense onShare={t => onShare(t, clip)} />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

/** Confirmation copy for a share, so the tile menu and the dialog agree. */
export const shareMessage = (target, clip) => {
  const athlete = athleteById(clip.athleteId)
  switch (target.key) {
    case 'athlete': return athlete ? `Clip shared with ${athlete.name}` : 'Clip shared with the athletes in it'
    case 'squad': return 'Clip shared with the squad'
    case 'staff': return 'Clip shared with staff on this event'
    case 'playlist': return 'Clip added to a playlist'
    case 'goal': return 'Clip tagged to a development goal'
    case 'link': return 'Link copied'
    case 'hudl': return 'Opening the source clip in Hudl'
    default: return 'Done'
  }
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
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
        Whole team, uncut · {drill.fullClip.duration} · {drill.fullClip.angle} · {drill.areaSize}
      </Typography>
      <PrincipleChips principles={drill.principles} />
    </Box>
    <Button variant="outlined" startIcon={<PlayCircleIcon />} onClick={onOpen} sx={{ flexShrink: 0 }}>
      Watch full drill
    </Button>
  </Paper>
)
