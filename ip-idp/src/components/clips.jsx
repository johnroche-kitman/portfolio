import { useRef, useState } from 'react'
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
  PEAK_METRICS, SHARE_TARGETS, clipSourceLine, clipSrc, peakMetric, posterSrc, principleLabel,
} from '../data/video'

/* ------------------------------------------------------------------ pieces */

/**
 * The stand-in behind every thumbnail and every player. A drawn pitch, not an
 * image, so a clip that has not landed yet still reads as a clip rather than a
 * broken frame — and so the poster JPGs are optional.
 */
const PitchBackdrop = () => (
  <Box sx={{ position: 'absolute', inset: 0, bgcolor: '#E8EDF6' }}>
    <Box component="svg" viewBox="0 0 145 76" preserveAspectRatio="none"
      sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.9 }} aria-hidden>
      <g fill="none" stroke="#B8CBD9" strokeWidth="1.5">
        <rect x="1" y="1" width="143" height="74" />
        <line x1="72.5" y1="1" x2="72.5" y2="75" />
        <circle cx="72.5" cy="38" r="14" />
        <rect x="1" y="20" width="20" height="36" />
        <rect x="124" y="20" width="20" height="36" />
      </g>
    </Box>
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
        ? <PitchBackdrop />
        : <Box component="img" src={posterSrc(file)} alt="" onError={() => setBroken(true)}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
      <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <PlayCircleIcon sx={{ fontSize: height > 140 ? 56 : 34, color: colors.white,
          filter: 'drop-shadow(0 1px 3px rgba(13,27,48,0.55))' }} />
      </Box>
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
          <PitchBackdrop />
          <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', px: 4 }}>
            <Paper variant="outlined" sx={{ borderColor: colors.neutral_400, p: 2.5, maxWidth: 420, textAlign: 'center' }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Clip not imported yet</Typography>
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
