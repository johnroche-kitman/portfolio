import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import InputBase from '@mui/material/InputBase'
import Typography from '@mui/material/Typography'
import Pagination from '@mui/material/Pagination'
import Icon from '../components/Icon'
import AskIpTriggerButton from '../components/ai/AskIpTriggerButton'
import { TEMPLATE_ROWS } from '../data/templates'

const TABS = [
  { label: 'Favourites', icon: 'favourites' },
  { label: 'My folder', icon: 'folder' },
  { label: 'Shared folder', icon: 'sharedFolder' },
  { label: 'iP dashboards', icon: 'dashboard' },
  { label: 'Templates', icon: 'templatesTab' },
]

export default function MyIpLanding({ showTrigger = false, onOpenChat, hasUnseen }) {
  return (
    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: 'var(--color-secondary)',
            borderRadius: '4px 4px 0 0',
            borderBottom: '1px solid var(--input-underline)',
            px: 1.5,
            py: 1,
            maxWidth: 280,
            flexGrow: 1,
          }}
        >
          <InputBase placeholder="Search" sx={{ fontSize: 14, color: 'var(--color-primary)', flexGrow: 1 }} />
          <Icon name="search" fontSize="small" sx={{ color: 'var(--grey-100)' }} />
        </Box>

        <Box display="flex" alignItems="center" gap={1.5}>
          <ToggleButtonGroup size="small" value="list" exclusive>
            <ToggleButton value="list">
              <Icon name="list" fontSize="small" />
            </ToggleButton>
            <ToggleButton value="grid">
              <Icon name="grid" fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
          <Button variant="contained" color="secondary" sx={{ color: 'var(--color-primary)' }}>
            New folder
          </Button>
          <Button variant="contained" color="secondary" sx={{ color: 'var(--color-primary)' }}>
            Explore data
          </Button>
          <Button variant="contained" color="primary">
            New dashboard
          </Button>
          {showTrigger && <AskIpTriggerButton onOpenChat={onOpenChat} hasUnseen={hasUnseen} />}
          <IconButton>
            <Icon name="settings" fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ px: 3, mt: 1.5 }}>
        <Tabs value={4} sx={{ minHeight: 42 }}>
          {TABS.map((tab, index) => (
            <Tab
              key={tab.label}
              label={tab.label}
              icon={<Icon name={tab.icon} fontSize="small" />}
              iconPosition="start"
              sx={{
                minHeight: 42,
                color: index === 4 ? 'var(--color-primary)' : 'var(--grey-100)',
                fontWeight: index === 4 ? 600 : 400,
              }}
            />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ mx: 3, mt: 3, border: '1px solid var(--divider)', borderRadius: 1, overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ borderBottom: '1px solid var(--divider)' }}>
              <TableCell sx={{ width: 44 }} />
              <TableCell sx={{ fontWeight: 600, color: 'var(--color-primary)' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'var(--color-primary)' }}>Type</TableCell>
              <TableCell sx={{ width: 60 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {TEMPLATE_ROWS.map((row) => (
              <TableRow key={row.id} sx={{ backgroundColor: row.highlighted ? '#f4f8fc' : 'transparent' }}>
                <TableCell>
                  <Icon name={row.icon} fontSize="small" sx={{ color: 'var(--color-primary)' }} />
                </TableCell>
                <TableCell sx={{ color: 'var(--color-primary)', fontWeight: 600 }}>{row.name}</TableCell>
                <TableCell sx={{ color: 'var(--color-primary)' }}>{row.type}</TableCell>
                <TableCell>
                  <IconButton size="small">
                    <Icon name="moreVert" fontSize="small" sx={{ color: 'var(--grey-100)' }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2 }}>
        <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
          {TEMPLATE_ROWS.length} items
        </Typography>
        <Pagination count={3} page={1} size="small" />
      </Box>
    </Box>
  )
}
