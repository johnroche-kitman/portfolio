import { useEffect, useRef, useState } from 'react'
import {
  Box, Button, Chip, Divider, IconButton, Paper, Skeleton, ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { DataGrid } from '@mui/x-data-grid'
import colors from '../../theme/tokens'

/** Page title with its action cluster. One contained button, the rest outlined. */
export const PageHeader = ({ title, info, actions, children }) => (
  <Box sx={{ px: 3, pt: 2.5 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>{title}</Typography>
        {info}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{actions}</Box>
    </Box>
    {children}
  </Box>
)

/**
 * Section divider. MUI's own Divider carries the label, rather than a caption
 * stacked over a hand-drawn dashed rule.
 */
export const SectionLabel = ({ children }) => (
  <Divider textAlign="left" sx={{ mt: 4, mb: 2 }}>
    <Typography variant="overline" sx={{ color: 'text.secondary' }}>{children}</Typography>
  </Divider>
)

/**
 * The one card used by settings, the injury record and every detail page.
 * Card-level actions are always secondary — the page's single primary lives in
 * its header or its Save bar, never inside a card.
 */
export const SettingsCard = ({ title, action, description, children, sx }) => (
  <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 3, mb: 2.5, ...sx }}>
    {(title || action) && (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: description ? 0.5 : 2 }}>
        <Typography variant="subtitle1">{title}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{action}</Box>
      </Box>
    )}
    {description && (
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{description}</Typography>
    )}
    {children}
  </Paper>
)

/** Card-level action. Secondary by default, `low` for resets and undo-like actions. */
export const CardAction = ({ low, ...props }) => (
  <Button size="small" variant={low ? 'text' : 'outlined'} {...props} />
)

/** Label: value pairs on a grid — used by settings and the injury record alike. */
export const FieldGrid = ({ fields, columns = 3 }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: `repeat(${columns}, 1fr)` }, gap: 2 }}>
    {fields.map(([label, value]) => (
      <Typography key={label} variant="body2">
        <Box component="span" sx={{ fontWeight: 700 }}>{label}: </Box>
        <Box component="span" sx={{ color: 'text.secondary' }}>{value}</Box>
      </Typography>
    ))}
  </Box>
)

/**
 * Colour swatch picker. ToggleButtonGroup gives keyboard access, focus rings and
 * a selected state — all of which a div with role="button" has to fake badly.
 */
export const SwatchPicker = ({ value, onChange, options, label = 'Colour', size = 44, showAdd, onAdd }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
    <ToggleButtonGroup exclusive value={value} onChange={(_, v) => v && onChange(v)} aria-label={label}
      sx={{ flexWrap: 'wrap', '& .MuiToggleButton-root': { p: 0, border: 0, borderRadius: 0 } }}>
      {options.map(c => (
        <ToggleButton key={c} value={c} aria-label={`${label} ${c}`}
          sx={{ width: size, height: size, bgcolor: c,
            '&:hover': { bgcolor: c, filter: 'brightness(0.92)' },
            '&.Mui-selected': { bgcolor: c, outline: `2px solid ${colors.grey_200}`, outlineOffset: -3 },
            '&.Mui-selected:hover': { bgcolor: c } }}>
          <Typography variant="caption" sx={{ color: colors.white, fontWeight: 700 }}>Aa</Typography>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
    {showAdd && (
      <IconButton onClick={onAdd} aria-label={`Add ${label.toLowerCase()}`}
        sx={{ width: size, height: size, borderRadius: 0, border: `1px solid ${colors.neutral_400}` }}>
        <AddIcon fontSize="small" />
      </IconButton>
    )}
  </Box>
)

/** Squad / label chips with the live list's "+N" overflow. */
export const ChipList = ({ values = [], max = 1, color }) => {
  const shown = values.slice(0, max)
  const rest = values.length - shown.length
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap', py: 0.5 }}>
      {shown.map(v => (
        <Chip key={v} size="small" label={v}
          sx={{ height: 22, fontSize: 11, maxWidth: 200,
            ...(color ? { bgcolor: color(v), color: colors.white } : {}) }} />
      ))}
      {rest > 0 && <Chip size="small" label={`+ ${rest}`} sx={{ height: 22, fontSize: 11 }} />}
    </Box>
  )
}

/**
 * The one state chip. `tone` is derived from the value unless given, so a
 * severity, an import status and an availability all read the same way.
 */
const TONES = {
  positive: { bg: colors.green_200, fg: colors.white, soft: `${colors.green_200}22`, softFg: colors.green_300 },
  negative: { bg: colors.red_200, fg: colors.white, soft: `${colors.red_200}22`, softFg: colors.red_200 },
  caution: { bg: colors.orange_200, fg: colors.white, soft: `${colors.orange_200}22`, softFg: colors.orange_300 },
  neutral: { bg: colors.neutral_300, fg: colors.grey_200, soft: colors.neutral_200, softFg: colors.grey_200 },
}

const toneFor = value => {
  const v = String(value)
  if (/^(Completed|Complete|Available|Resolved)/.test(v)) return 'positive'
  if (/^(Failed|Unavailable|Severe|Overdue)/.test(v)) return 'negative'
  if (/^(Moderate|Due|In progress|Pending|Mild)/.test(v)) return 'caution'
  return 'neutral'
}

export const StateChip = ({ value, tone, soft = false }) => {
  const t = TONES[tone || toneFor(value)]
  return (
    <Chip size="small" label={value}
      sx={{ height: 22, fontSize: 11, fontWeight: 600,
        bgcolor: soft ? t.soft : t.bg, color: soft ? t.softFg : t.fg }} />
  )
}

/** Import and export status. Kept as a name because the tables read better for it. */
export const StatusChip = StateChip

/** The filter row that sits above every administration table. */
export const FilterRow = ({ children }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
    {children}
  </Box>
)

export const GRID_SX = {
  width: '100%',
  border: 0,
  '& .MuiDataGrid-columnHeaders': { borderBottom: `1px solid ${colors.neutral_300}` },
  '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700 },
  // Cells are display: block, so plain text rides on the row's line-height while
  // anything from renderCell sits at the top. Flex centres both the same way.
  '& .MuiDataGrid-cell': { borderColor: colors.neutral_200, display: 'flex', alignItems: 'center' },
}

/**
 * DataGrid resolves flex column widths against its container the first time it
 * paints. Every admin table sits in a flex chain with minWidth: 0, so that first
 * measurement can be 0 — the body recovers, the header widths stay stuck at 0.
 * Measuring first and mounting the grid only once we have a width avoids it.
 */
export function AdminGrid({ sx, ...props }) {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!ref.current) return undefined
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  return (
    <Box ref={ref} sx={{ width: '100%' }}>
      {width > 0
        ? <DataGrid autoHeight disableRowSelectionOnClick sx={{ ...GRID_SX, ...sx }} {...props} />
        : <Skeleton variant="rectangular" height={320} />}
    </Box>
  )
}
