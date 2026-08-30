import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Badge, Box, Collapse, List, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material'
import BarChartIcon from '@mui/icons-material/BarChartOutlined'
import GroupsIcon from '@mui/icons-material/GroupsOutlined'
import LocalHospitalIcon from '@mui/icons-material/LocalHospitalOutlined'
import SportsIcon from '@mui/icons-material/SportsSoccerOutlined'
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined'
import CalendarIcon from '@mui/icons-material/CalendarTodayOutlined'
import ForumIcon from '@mui/icons-material/ForumOutlined'
import FolderIcon from '@mui/icons-material/FolderOutlined'
import PersonIcon from '@mui/icons-material/PersonOutline'
import SettingsIcon from '@mui/icons-material/SettingsOutlined'
import HelpIcon from '@mui/icons-material/HelpOutline'
import WidgetsIcon from '@mui/icons-material/WidgetsOutlined'
import DoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import DoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import colors from '../theme/tokens'

export const RAIL_COLLAPSED = 60
export const RAIL_EXPANDED = 240
const FLYOUT = 246

// Mirrors mainNavBarDesktop in the live app: same items, same order, same routes.
export const NAV_ITEMS = [
  {
    key: 'analysis', label: 'Analysis', icon: <BarChartIcon />,
    // Analysis is being sunset; League Benchmark Reporting is the one surface carried over.
    children: [
      ['/analysis/benchmark_report', 'League Benchmark Reporting'],
    ],
  },
  {
    key: 'athletes', label: 'Athletes', icon: <GroupsIcon />,
    children: [
      ['/athletes', 'Athletes'],
      ['/athletes/availability', 'Availability'],
      ['/athletes/availability_report', 'Availability Report'],
      ['/athletes/screenings', 'Screenings'],
    ],
  },
  { key: 'medical', label: 'Medical', icon: <LocalHospitalIcon />, path: '/medical/rosters' },
  {
    key: 'workloads', label: 'Planning', icon: <SportsIcon />,
    children: [
      ['/planning_hub/events', 'Schedule'],
      ['/planning_hub/settings', 'Library'],
      ['/planning_hub/coaching_library', 'Coaching library'],
      ['/fixture_negotiation', 'Fixture Negotiation'],
      ['/fixture_finder', 'Fixture Finder'],
      ['/events_management', 'Events Management'],
      ['/planning_hub/league-schedule', 'League Schedule'],
    ],
  },
  {
    key: 'forms', label: 'Forms', icon: <AssignmentIcon />,
    children: [
      ['/administration/questionnaire_templates', 'Screening'],
      ['/assessments', 'Assessments'],
      ['/reviews', 'Reviews'],
      ['/growth_and_maturation', 'Growth and maturation'],
      ['/benchmark/test_validation', 'Benchmark validation'],
      ['/benchmark/league_benchmarking', 'League benchmarking'],
      ['/private_forms', 'Private forms'],
      ['/data_importer', 'Data importer'],
    ],
  },
  { key: 'calendar', label: 'Calendar', icon: <CalendarIcon />, path: '/calendar' },
  { key: 'messaging', label: 'Messaging', icon: <ForumIcon />, path: '/messaging', badge: 14 },
  {
    key: 'media', label: 'Media', icon: <FolderIcon />,
    children: [['/media/videos', 'Videos'], ['/media/documents', 'Documents']],
  },
  { key: 'recruitment', label: 'Recruitment', icon: <PersonIcon />, path: '/recruitment' },
  {
    key: 'settings', label: 'Administration', icon: <SettingsIcon />,
    children: [
      ['/administration/athletes', 'Manage Athletes'],
      ['/users', 'Manage Staff Users'],
      ['/fixtures', 'Manage Games'],
      ['/administration/organisation/edit', 'Organisation Settings'],
      ['/administration/exports', 'Exports'],
      ['/administration/imports', 'Imports'],
      ['/stock_management', 'Stock Management'],
      ['/administration/labels/manage', 'Labels'],
      ['/administration/groups', 'Athlete Groups'],
    ],
  },
]

export default function MainNav({ expanded, onToggle }) {
  const [openKey, setOpenKey] = useState(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const width = expanded ? RAIL_EXPANDED : RAIL_COLLAPSED

  const isActive = item =>
    item.path ? pathname.startsWith(item.path)
      : (item.children || []).some(([p]) => pathname === p || pathname.startsWith(p + '/'))

  const handle = item => {
    if (item.children) setOpenKey(k => (k === item.key ? null : item.key))
    else { setOpenKey(null); navigate(item.path) }
  }

  const row = (item) => {
    const active = isActive(item)
    const btn = (
      <ListItemButton
        onClick={() => handle(item)}
        sx={{
          minHeight: 40, px: expanded ? 2 : 0,
          justifyContent: expanded ? 'flex-start' : 'center',
          bgcolor: active || openKey === item.key ? colors.blue_500 || '#0828ff' : 'transparent',
          '&:hover': { bgcolor: active ? colors.blue_500 : 'rgba(255,255,255,.10)' },
        }}
      >
        <ListItemIcon sx={{ minWidth: expanded ? 34 : 0, color: colors.white, '& svg': { fontSize: 20 } }}>
          {item.badge ? <Badge badgeContent={item.badge} color="error">{item.icon}</Badge> : item.icon}
        </ListItemIcon>
        {expanded && (
          <ListItemText primary={item.label}
            primaryTypographyProps={{ fontSize: 14, sx: { color: colors.white } }} />
        )}
      </ListItemButton>
    )
    return expanded ? btn : <Tooltip title={item.label} placement="right">{btn}</Tooltip>
  }

  const open = NAV_ITEMS.find(i => i.key === openKey)

  return (
    <>
      <Box
        component="nav"
        sx={{
          width, flexShrink: 0, bgcolor: colors.grey_400, color: colors.white,
          position: 'sticky', top: 0, height: '100vh', zIndex: theme => theme.zIndex.drawer + 2,
          display: 'flex', flexDirection: 'column', transition: 'width .18s ease',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: expanded ? 2 : 0,
          justifyContent: expanded ? 'flex-start' : 'center', height: 56, flexShrink: 0 }}>
          <Box component="img" src={`${import.meta.env.BASE_URL}kitman-logo.png`} alt="Kitman Labs"
            sx={{ width: 26, height: 26, display: 'block' }} />
        </Box>

        <List sx={{ p: 0, flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {NAV_ITEMS.map(item => <Box key={item.key}>{row(item)}</Box>)}
        </List>

        <List sx={{ p: 0, flexShrink: 0, borderTop: '1px solid rgba(255,255,255,.12)' }}>
          {/* Prototype-only: the component library. Not part of iP. */}
          {row({ key: 'library', label: 'Components', icon: <WidgetsIcon />, path: '/library' })}
          {row({ key: 'help', label: 'Help', icon: <HelpIcon />, path: '/help' })}
          <ListItemButton
            onClick={onToggle}
            sx={{ minHeight: 40, px: expanded ? 2 : 0, justifyContent: expanded ? 'flex-start' : 'center' }}
          >
            <ListItemIcon sx={{ minWidth: expanded ? 34 : 0, color: colors.white, '& svg': { fontSize: 20 } }}>
              {expanded ? <DoubleArrowLeftIcon /> : <DoubleArrowRightIcon />}
            </ListItemIcon>
            {expanded && (
              <ListItemText primary="Close Menu"
                primaryTypographyProps={{ fontSize: 14, sx: { color: colors.white } }} />
            )}
          </ListItemButton>
        </List>
      </Box>

      {/* Secondary flyout, as in the live app */}
      <Collapse in={!!open} orientation="horizontal" timeout={160}
        sx={{ position: 'sticky', top: 0, height: '100vh', zIndex: theme => theme.zIndex.drawer + 1, flexShrink: 0 }}>
        <Box sx={{ width: FLYOUT, height: '100%', bgcolor: colors.grey_300, color: colors.white,
          overflowY: 'auto', borderRight: '1px solid rgba(255,255,255,.08)' }}>
          <Typography variant="h6" sx={{ px: 2.5, pt: 2.5, pb: 1.5, fontSize: 17, fontWeight: 600 }}>
            {open?.label}
          </Typography>
          <List sx={{ p: 0 }}>
            {(open?.children || []).map(([path, label]) => (
              <ListItemButton
                key={path}
                selected={pathname === path}
                onClick={() => { setOpenKey(null); navigate(path) }}
                sx={{
                  px: 2.5, minHeight: 40,
                  '&.Mui-selected': { bgcolor: 'rgba(255,255,255,.12)' },
                  '&:hover': { bgcolor: 'rgba(255,255,255,.08)' },
                }}
              >
                <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14, sx: { color: colors.white } }} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Collapse>

      {open && (
        <Box onClick={() => setOpenKey(null)}
          sx={{ position: 'fixed', inset: 0, zIndex: theme => theme.zIndex.drawer, bgcolor: 'transparent' }} />
      )}
    </>
  )
}
