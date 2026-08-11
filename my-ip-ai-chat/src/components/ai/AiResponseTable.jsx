import { useState } from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Icon from '../Icon'

export default function AiResponseTable({ table }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    const header = table.columns.join('\t')
    const body = table.rows.map((row) => row.join('\t')).join('\n')
    navigator.clipboard?.writeText(`${header}\n${body}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Box sx={{ mt: 1.5 }}>
      <Box sx={{ border: '1px solid var(--divider)', borderRadius: 1, overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'var(--background)' }}>
              {table.columns.map((col) => (
                <TableCell key={col} sx={{ fontWeight: 600, color: 'var(--color-primary)', whiteSpace: 'nowrap' }}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {table.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex} sx={{ backgroundColor: rowIndex % 2 === 1 ? 'var(--background)' : 'transparent' }}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex} sx={{ color: 'var(--color-primary)' }}>
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Tooltip title={copied ? 'Copied' : 'Copy table'}>
        <IconButton size="small" onClick={handleCopy} sx={{ mt: 0.5 }}>
          <Icon name="copy" fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  )
}
