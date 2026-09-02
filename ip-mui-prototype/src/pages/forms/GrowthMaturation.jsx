import { Box, Typography } from '@mui/material'
import AppShell from '../../components/AppShell'
import { AdminGrid, PageHeader } from '../admin/parts'
import { growthTests } from '../../data/forms'

/** The simplest page in Forms: a list of tests and nothing else. */
export default function GrowthMaturation() {
  return (
    <AppShell title="Growth and maturation">
      <PageHeader title="Growth and maturation" />
      <Box sx={{ px: 3, pt: 2, pb: 6 }}>
        <AdminGrid
          rows={growthTests} rowHeight={56} hideFooter
          columns={[
            { field: 'name', headerName: 'Test name', flex: 1.4, minWidth: 280,
              renderCell: p => <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.row.name}</Typography> },
            { field: 'edited', headerName: 'Last edited', flex: 1.6, minWidth: 300 },
            { field: 'results', headerName: 'Results submitted', width: 190 },
          ]}
        />
        <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: 'text.secondary' }}>
          Total Rows: {growthTests.length}
        </Typography>
      </Box>
    </AppShell>
  )
}
