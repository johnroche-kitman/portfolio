import { useMemo, useState } from 'react'
import {
  Avatar, Box, Button, Divider, IconButton, List, ListItemButton, ListItemText, Menu, MenuItem,
  Paper, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import colors from '../../theme/tokens'
import { AdminGrid, CardAction, SettingsCard } from '../admin/parts'
import { SelectField } from '../../components/form'
import {
  EVENT_COLUMNS, FORMATIONS, FORMATS, LINEUP_ACTIONS, PARTICIPATION, buildPeriods, gameSquad,
} from '../../data/game'

/* ------------------------------------------------------------------ pitch */

/**
 * The pitch is drawn in perspective: the far touchline is narrower than the near
 * one. Positions are placed as a percentage across their band and then inset by
 * how far up the pitch that band sits, which is what gives the trapezoid its
 * converging rows without needing a 3D transform.
 */
const PITCH = { top: 0.62, height: 460 }

const slotStyle = (rowIndex, rowCount, colIndex, colCount) => {
  const y = rowCount === 1 ? 0.5 : rowIndex / (rowCount - 1)
  const width = PITCH.top + (1 - PITCH.top) * y          // narrower at the far end
  const x = 0.5 + ((colIndex + 0.5) / colCount - 0.5) * width
  return { left: `${x * 100}%`, top: `${8 + y * 78}%` }
}

function PitchMarkings() {
  // Drawn as one SVG so the lines scale with the board and stay crisp.
  return (
    <Box component="svg" viewBox="0 0 100 100" preserveAspectRatio="none"
      sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <polygon points="19,2 81,2 98,98 2,98" fill="#a8bfa0" stroke="#fff" strokeWidth="0.4" />
      <polygon points="33,2 67,2 71,20 29,20" fill="none" stroke="#fff" strokeWidth="0.4" />
      <polygon points="43,2 57,2 58,9 42,9" fill="none" stroke="#fff" strokeWidth="0.4" />
      <line x1="10" y1="60" x2="90" y2="60" stroke="#fff" strokeWidth="0.4" />
      <ellipse cx="50" cy="60" rx="14" ry="9" fill="none" stroke="#fff" strokeWidth="0.4" />
      <circle cx="50" cy="60" r="0.7" fill="#fff" />
      <circle cx="50" cy="14" r="0.7" fill="#fff" />
    </Box>
  )
}

function PositionSlot({ label, player, selected, onSelect, onClear, style }) {
  return (
    <Box sx={{ position: 'absolute', transform: 'translate(-50%, -50%)', ...style }}>
      <Box sx={{ position: 'relative' }}>
        <Tooltip title={player ? player.name : label}>
          <Box
            component="button" type="button" onClick={onSelect}
            aria-label={player ? `${label}: ${player.name}` : `${label}, empty`}
            aria-pressed={selected}
            sx={{
              width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', p: 0,
              display: 'grid', placeItems: 'center',
              bgcolor: player ? colors.white : 'rgba(255,255,255,.55)',
              border: `2px solid ${selected ? colors.green_200 : colors.grey_150}`,
              '&:hover': { borderColor: colors.grey_200 },
            }}>
            {player
              ? <Avatar sx={{ width: 36, height: 36, fontSize: 12 }}>
                  {player.name.split(',')[0][0]}
                </Avatar>
              : <Typography variant="caption" sx={{ fontWeight: 700 }}>{label}</Typography>}
          </Box>
        </Tooltip>

        {player && selected && (
          <IconButton size="small" onClick={onClear} aria-label={`Remove ${player.name}`}
            sx={{ position: 'absolute', top: -8, right: -8, p: 0.2, bgcolor: colors.white,
              border: `1px solid ${colors.neutral_400}`, '&:hover': { bgcolor: colors.neutral_200 } }}>
            <CloseIcon sx={{ fontSize: 12 }} />
          </IconButton>
        )}
      </Box>

      {player && (
        <Typography variant="caption" noWrap
          sx={{ display: 'block', mt: 0.5, px: 0.5, textAlign: 'center', bgcolor: colors.white,
            border: `1px solid ${colors.neutral_300}`, borderRadius: 0.5, maxWidth: 96 }}>
          {player.name.split(',')[0]}
        </Typography>
      )}
    </Box>
  )
}

/* -------------------------------------------------------------- timeline */

function PeriodTimeline({ periods, total }) {
  return (
    <Box sx={{ px: 2, pb: 1 }}>
      <Box sx={{ display: 'flex', mb: 0.5 }}>
        {periods.map(p => (
          <Typography key={p.id} variant="caption" align="center"
            sx={{ flex: p.to - p.from, color: 'text.secondary' }}>
            {p.label}
          </Typography>
        ))}
      </Box>
      <Box sx={{ position: 'relative', height: 28 }}>
        <Box sx={{ position: 'absolute', top: 8, left: 0, right: 24, height: 2, bgcolor: colors.grey_200 }} />
        {[...periods.map(p => p.from), total].map((min, i) => (
          <Box key={i} sx={{ position: 'absolute', top: 2, left: `${(min / total) * 100}%`,
            transform: 'translateX(-50%)', textAlign: 'center' }}>
            <Box sx={{ width: 2, height: 14, mx: 'auto', bgcolor: colors.grey_200 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{min}&#39;</Typography>
          </Box>
        ))}
        <Typography variant="caption" sx={{ position: 'absolute', right: 0, top: 2, color: colors.red_200 }}>
          FT
        </Typography>
      </Box>
    </Box>
  )
}

/* ------------------------------------------------------------- list view */

function ListView({ periods }) {
  const rows = useMemo(() => gameSquad.slice(0, 4).map(p => ({
    ...p, total: 90, participation: 'Full', groupCalcs: true,
  })), [])

  const columns = [
    { field: 'name', headerName: 'Athlete', flex: 1.2, minWidth: 200, sortable: false },
    ...periods.map(p => ({
      field: `p${p.id}`, headerName: p.label, width: 110, sortable: false,
      valueGetter: () => `${p.to - p.from}'`,
    })),
    { field: 'total', headerName: 'Total minutes', width: 130 },
    { field: 'participation', headerName: 'Participation', width: 160,
      type: 'singleSelect', valueOptions: PARTICIPATION, editable: true },
    { field: 'groupCalcs', headerName: 'Group calculations', width: 170,
      type: 'boolean', editable: true },
    ...EVENT_COLUMNS.map(c => ({
      field: c.field, headerName: c.label, width: 110, type: 'number', editable: true,
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          {c.colour && <Box sx={{ width: 9, height: 12, borderRadius: 0.3, bgcolor: c.colour }} />}
          <Typography variant="caption" sx={{ fontWeight: 700 }}>{c.label}</Typography>
        </Box>
      ),
    })),
  ]

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
      {/* The rail carries the formation per period, which is what the summary is for. */}
      <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, width: 200, flexShrink: 0 }}>
        <List disablePadding>
          <ListItemButton selected>
            <ListItemText primary="Game summary" secondary={`${periods.length} periods`}
              primaryTypographyProps={{ variant: 'subtitle2' }} />
          </ListItemButton>
          <Divider />
          {periods.map(p => (
            <ListItemButton key={p.id}>
              <ListItemText primary={p.label} secondary={`${p.to - p.from} mins | 4-3-3`}
                primaryTypographyProps={{ variant: 'body2' }} />
            </ListItemButton>
          ))}
        </List>
      </Paper>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <AdminGrid rows={rows} columns={columns} rowHeight={56} hideFooter />
      </Box>
    </Box>
  )
}

/* ------------------------------------------------------------------ tab */

export default function GameEvents() {
  const [view, setView] = useState('pitch')
  const [periodCount, setPeriodCount] = useState(2)
  const [format, setFormat] = useState('11v11')
  const [formation, setFormation] = useState('4-3-3')
  const [lineupAnchor, setLineupAnchor] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [assigned, setAssigned] = useState({})       // slot key -> athlete id
  const [dirty, setDirty] = useState(false)
  const [score, setScore] = useState({ home: 0, away: 0 })

  const periods = useMemo(() => buildPeriods(periodCount), [periodCount])
  const rows = FORMATIONS[formation]
  const placedIds = Object.values(assigned)
  const available = gameSquad.filter(p => !placedIds.includes(p.id))

  const assign = athlete => {
    if (!selectedSlot) return
    setAssigned(a => ({ ...a, [selectedSlot]: athlete.id }))
    setSelectedSlot(null); setDirty(true)
  }
  const clearSlot = key => {
    setAssigned(a => { const next = { ...a }; delete next[key]; return next })
    setSelectedSlot(null); setDirty(true)
  }
  const clearAll = () => { setAssigned({}); setSelectedSlot(null); setDirty(true) }

  const byGroup = available.reduce((acc, p) => {
    (acc[p.group] = acc[p.group] || []).push(p); return acc
  }, {})

  return (
    <Box>
      <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, flexWrap: 'wrap' }}>
          {/* The live toggle is a pair of bespoke buttons. This is what it should be. */}
          <ToggleButtonGroup exclusive size="small" value={view}
            onChange={(_, v) => v && setView(v)} aria-label="Game events view">
            <ToggleButton value="pitch">Pitch view</ToggleButton>
            <ToggleButton value="list">List view</ToggleButton>
          </ToggleButtonGroup>

          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 28, height: 28, bgcolor: colors.grey_400, fontSize: 12 }}>K</Avatar>
            <TextField value={score.home} onChange={e => { setScore(s => ({ ...s, home: e.target.value })); setDirty(true) }}
              inputProps={{ 'aria-label': 'Team score', style: { textAlign: 'center' } }} sx={{ width: 64 }} />
            <Typography variant="body2">-</Typography>
            <TextField value={score.away} onChange={e => { setScore(s => ({ ...s, away: e.target.value })); setDirty(true) }}
              inputProps={{ 'aria-label': 'Opposition score', style: { textAlign: 'center' } }} sx={{ width: 64 }} />
            <Avatar sx={{ width: 28, height: 28, bgcolor: colors.neutral_300, color: colors.grey_200, fontSize: 12 }}>T</Avatar>
          </Box>

          <Button variant="outlined" onClick={() => { setPeriodCount(c => c + 1); setDirty(true) }}>
            Add period
          </Button>
        </Box>
        <PeriodTimeline periods={periods} total={90} />
      </Paper>

      {view === 'list' ? <ListView periods={periods} /> : (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
          <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 2, flex: 1, minWidth: 380 }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', justifyContent: 'center', mb: 2 }}>
              <SelectField label="Format" options={FORMATS} value={format}
                onChange={e => setFormat(e.target.value)} sx={{ width: 130 }} />
              <SelectField label="Formation" options={Object.keys(FORMATIONS)} value={formation}
                onChange={e => { setFormation(e.target.value); setDirty(true) }} sx={{ width: 130 }} />
              <Button variant="outlined" onClick={clearAll} sx={{ mt: 0.5 }}>Clear</Button>
            </Box>

            <Box sx={{ position: 'relative', height: PITCH.height, mx: 'auto', maxWidth: 560 }}>
              <PitchMarkings />
              {rows.map((row, ri) => row.map((label, ci) => {
                const key = `${ri}-${ci}`
                const player = gameSquad.find(p => p.id === assigned[key])
                return (
                  <PositionSlot
                    key={key} label={label} player={player}
                    selected={selectedSlot === key}
                    onSelect={() => setSelectedSlot(k => (k === key ? null : key))}
                    onClear={e => { e.stopPropagation(); clearSlot(key) }}
                    style={slotStyle(ri, rows.length, ci, row.length)}
                  />
                )
              }))}
            </Box>
          </Paper>

          <SettingsCard
            title="Available Players"
            sx={{ width: { xs: '100%', md: 380 }, flexShrink: 0, mb: 0 }}
            action={<>
              <CardAction onClick={e => setLineupAnchor(e.currentTarget)}>Line-ups</CardAction>
              <Menu anchorEl={lineupAnchor} open={!!lineupAnchor} onClose={() => setLineupAnchor(null)}>
                {LINEUP_ACTIONS.map(a => (
                  <MenuItem key={a} sx={{ minWidth: 220 }} onClick={() => setLineupAnchor(null)}>{a}</MenuItem>
                ))}
              </Menu>
            </>}
          >
            {selectedSlot && (
              <Typography variant="caption" sx={{ display: 'block', mb: 1, color: colors.green_300 }}>
                Pick a player to fill the selected position.
              </Typography>
            )}
            {available.length === 0
              ? <Typography variant="body2" sx={{ color: 'text.secondary', py: 4, textAlign: 'center' }}>
                  No players selected
                </Typography>
              : (
                <List disablePadding>
                  {Object.entries(byGroup).map(([group, players]) => (
                    <Box key={group}>
                      <Typography variant="caption"
                        sx={{ display: 'block', px: 1, py: 0.75, bgcolor: colors.neutral_100, color: 'text.secondary' }}>
                        {group}
                      </Typography>
                      {players.map(p => (
                        <ListItemButton key={p.id} onClick={() => assign(p)} disabled={!selectedSlot}
                          sx={{ px: 1, gap: 1.5 }}>
                          <Avatar sx={{ width: 32, height: 32, fontSize: 12 }}>{p.name[0]}</Avatar>
                          <ListItemText primary={p.name} secondary={`${p.position} | #`}
                            primaryTypographyProps={{ variant: 'body2', fontWeight: 700 }} />
                        </ListItemButton>
                      ))}
                    </Box>
                  ))}
                </List>
              )}
          </SettingsCard>
        </Box>
      )}

      {/* The action bar only appears once something has changed, as on the live page. */}
      {dirty && (
        <Box sx={{ position: 'sticky', bottom: 0, mt: 2, py: 1.5, display: 'flex', justifyContent: 'flex-end',
          gap: 1.5, bgcolor: colors.white, borderTop: `1px solid ${colors.neutral_300}` }}>
          <Button variant="outlined" onClick={() => setDirty(false)}>Finish period</Button>
          <Button onClick={() => setDirty(false)}>Save progress</Button>
        </Box>
      )}
    </Box>
  )
}
