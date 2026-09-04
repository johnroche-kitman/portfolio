import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import { useNavigate } from 'react-router-dom'
import PageTabs from '../components/PageTabs'
import DataTable from '../components/DataTable'
import PlayerAvatar from '../components/PlayerAvatar'
import Lozenge from '../components/Lozenge'
import Button from '../components/Button'
import Icon from '../components/Icon'
import { useAppData } from '../state/AppDataContext'

const FILTER_CONTROL_SX = {
  backgroundColor: 'var(--neutral-200)',
  borderRadius: '6px',
  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '& .MuiOutlinedInput-root': { backgroundColor: 'var(--neutral-200)', borderRadius: '6px' },
}

const TOP_STRIP_HEIGHT = 54

const MEDICAL_TABS = [
  { value: 'squad', label: 'Squad' },
  { value: 'notes', label: 'Notes', disabled: true },
  { value: 'diagnostics', label: 'Diagnostics', disabled: true },
  { value: 'procedures', label: 'Procedures', disabled: true },
  { value: 'medical-flags', label: 'Medical flags', disabled: true },
  { value: 'documents', label: 'Documents', disabled: true },
  { value: 'coaches-report', label: 'Coaches report', disabled: true },
  { value: 'daily-status-report', label: 'Daily status report', disabled: true },
]

export default function Squad() {
  const { athletes, getInjuriesByAthlete, athleteNotes, pendingInjuries, pendingNotes } = useAppData()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [positionFilter, setPositionFilter] = useState('all')
  const [injuredFilter, setInjuredFilter] = useState('all')
  const [downloadAnchor, setDownloadAnchor] = useState(null)
  const headerRef = useRef(null)
  const [headerHeight, setHeaderHeight] = useState(0)
  const pendingReviewCount = pendingInjuries.length + pendingNotes.length

  useLayoutEffect(() => {
    const el = headerRef.current
    if (!el) return undefined
    const observer = new ResizeObserver((entries) => {
      setHeaderHeight(entries[0].target.getBoundingClientRect().height)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const positions = useMemo(() => ['all', ...new Set(athletes.map((a) => a.position))], [athletes])

  const rows = useMemo(() => {
    return athletes
      .filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
      .filter((a) => positionFilter === 'all' || a.position === positionFilter)
      .filter((a) => injuredFilter === 'all' || a.status === injuredFilter)
  }, [athletes, search, positionFilter, injuredFilter])

  const columns = [
    {
      key: 'player',
      label: 'Player',
      width: '18%',
      render: (athlete) => (
        <Box display="flex" alignItems="center" gap={1.5}>
          <PlayerAvatar athlete={athlete} size={36} />
          <Box>
            <Typography variant="body1" fontWeight={600}>
              {athlete.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
              {athlete.position}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '12%',
      render: (athlete) => (
        <Box display="flex" alignItems="flex-start" gap={1}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'var(--color-error)',
              mt: '6px',
              flexShrink: 0,
              visibility: athlete.status === 'Available' ? 'hidden' : 'visible',
            }}
          />
          <Box>
            <Typography
              variant="body1"
              sx={{
                textDecoration: athlete.status !== 'Available' ? 'underline' : 'none',
                fontWeight: athlete.status !== 'Available' ? 600 : 400,
              }}
            >
              {athlete.status}
            </Typography>
            {athlete.statusDuration && (
              <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
                {athlete.statusDuration}
              </Typography>
            )}
          </Box>
        </Box>
      ),
    },
    {
      key: 'injury',
      label: 'Injury',
      width: '24%',
      render: (athlete) => {
        const athleteInjuries = getInjuriesByAthlete(athlete.id).filter((inj) => inj.status !== 'pending_review')
        if (!athleteInjuries.length) {
          return (
            <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
              No active injuries
            </Typography>
          )
        }
        return (
          <Box display="flex" flexDirection="column" gap={1.5}>
            {athleteInjuries.map((inj) => (
              <Box key={inj.id} display="flex" alignItems="flex-start" gap={1}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-error)',
                    mt: '6px',
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography
                    variant="body1"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/medical/injury/${inj.id}`, { state: { from: 'squad' } })
                    }}
                    sx={{
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      '&:hover': { color: 'var(--color-primary)' },
                    }}
                  >
                    {inj.date}, {inj.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
                    {inj.subtitle}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )
      },
    },
    {
      key: 'latestNote',
      label: 'Latest note',
      width: '32%',
      render: (athlete) => (
        <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
          {athleteNotes[athlete.id] || '—'}
        </Typography>
      ),
    },
    {
      key: 'allergies',
      label: 'Allergies',
      width: '14%',
      render: (athlete) => (
        <Box display="flex" flexWrap="wrap" gap={0.5}>
          {athlete.allergies.map((allergy) => (
            <Lozenge key={allergy} label={allergy} tone={allergy === 'Banana' ? 'warning' : 'error'} />
          ))}
        </Box>
      ),
    },
  ]

  return (
    <Box>
      <Box
        ref={headerRef}
        sx={{
          position: 'sticky',
          top: TOP_STRIP_HEIGHT,
          zIndex: 15,
          backgroundColor: 'var(--white)',
          pb: 1,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="h1">Medical</Typography>
          <Tooltip title="Go to review queue">
            <Badge
              badgeContent={pendingReviewCount}
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: 'var(--color-error)',
                  color: '#ffffff',
                  fontWeight: 600,
                },
              }}
            >
              <IconButton
                onClick={() => navigate('/medical/review-queue')}
                sx={{
                  backgroundColor: 'var(--neutral-200)',
                  color: 'var(--color-primary)',
                  '&:hover': { backgroundColor: 'var(--neutral-300)' },
                }}
              >
                <Icon name="checklist" fontSize="small" />
              </IconButton>
            </Badge>
          </Tooltip>
        </Box>

        <PageTabs tabs={MEDICAL_TABS} value="squad" onChange={() => {}} />

        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 3, mb: 2 }}>
          <Typography variant="h2">Squad</Typography>
          <Box display="flex" gap={1.5}>
            <Button endIcon={<Icon name="expandMore" fontSize="small" />}>Add</Button>
            <Button
              tone="secondary"
              endIcon={<Icon name="expandMore" fontSize="small" />}
              onClick={(e) => setDownloadAnchor(e.currentTarget)}
            >
              Download
            </Button>
            <Menu anchorEl={downloadAnchor} open={!!downloadAnchor} onClose={() => setDownloadAnchor(null)}>
              <MenuItem onClick={() => setDownloadAnchor(null)}>Export as CSV</MenuItem>
              <MenuItem onClick={() => setDownloadAnchor(null)}>Export as PDF</MenuItem>
            </Menu>
          </Box>
        </Box>

        <Box display="flex" gap={1.5}>
          <TextField
            size="small"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 240, ...FILTER_CONTROL_SX }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Icon name="search" fontSize="small" sx={{ color: 'var(--grey-100)' }} />
                </InputAdornment>
              ),
            }}
          />
          <Select size="small" value="active" sx={{ width: 160, ...FILTER_CONTROL_SX }}>
            <MenuItem value="active">Active squad</MenuItem>
            <MenuItem value="development-squad">Development squad</MenuItem>
          </Select>
          <Select
            size="small"
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            sx={{ width: 180, ...FILTER_CONTROL_SX }}
          >
            {positions.map((pos) => (
              <MenuItem key={pos} value={pos}>
                {pos === 'all' ? 'Squad position' : pos}
              </MenuItem>
            ))}
          </Select>
          <Select
            size="small"
            value={injuredFilter}
            onChange={(e) => setInjuredFilter(e.target.value)}
            sx={{ width: 160, ...FILTER_CONTROL_SX }}
          >
            <MenuItem value="all">Injured</MenuItem>
            <MenuItem value="Out">Out</MenuItem>
            <MenuItem value="Limited">Limited</MenuItem>
            <MenuItem value="Available">Available</MenuItem>
          </Select>
        </Box>
      </Box>

      <Box sx={{ backgroundColor: 'var(--white)', borderRadius: '8px', border: '1px solid var(--divider)' }}>
        <DataTable
          columns={columns}
          rows={rows}
          getRowKey={(row) => row.id}
          emptyMessage="No athletes match these filters"
          stickyTop={TOP_STRIP_HEIGHT + headerHeight}
        />
      </Box>
    </Box>
  )
}
