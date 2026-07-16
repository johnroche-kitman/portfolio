import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// Generic table shell shared by Roster and Review Queue: columns describe headers
// + a render function, rows are plain data objects.
export default function DataTable({ columns, rows, getRowKey, onRowClick, emptyMessage }) {
  if (!rows.length) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ color: 'var(--grey-100)' }}>
          {emptyMessage || 'No results'}
        </Typography>
      </Box>
    )
  }

  return (
    <Table sx={{ tableLayout: 'fixed' }}>
      <TableHead>
        <TableRow>
          {columns.map((col) => (
            <TableCell
              key={col.key}
              sx={{
                borderBottom: '1px solid var(--divider)',
                color: 'var(--color-primary)',
                fontWeight: 600,
                fontSize: 14,
                width: col.width,
              }}
            >
              {col.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={getRowKey(row)}
            hover={!!onRowClick}
            onClick={() => onRowClick?.(row)}
            sx={{
              cursor: onRowClick ? 'pointer' : 'default',
              '&:last-child td': { borderBottom: 0 },
            }}
          >
            {columns.map((col) => (
              <TableCell
                key={col.key}
                sx={{
                  borderBottom: '1px solid var(--divider)',
                  verticalAlign: 'top',
                  py: 2,
                }}
              >
                {col.render(row)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
