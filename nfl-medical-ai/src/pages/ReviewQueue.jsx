import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useNavigate } from 'react-router-dom'
import DataTable from '../components/DataTable'
import PlayerAvatar from '../components/PlayerAvatar'
import Lozenge from '../components/Lozenge'
import Button from '../components/Button'
import Icon from '../components/Icon'
import { useAppData } from '../state/AppDataContext'

export default function ReviewQueue() {
  const { pendingInjuries, pendingNotes, getAthleteById, getInjuryById, acceptInjury, rejectInjury, acceptNote, rejectNote } =
    useAppData()
  const navigate = useNavigate()

  const rows = [
    ...pendingInjuries.map((injury) => ({ ...injury, type: 'injury' })),
    ...pendingNotes.map((note) => ({ ...note, type: 'note' })),
  ]

  const columns = [
    {
      key: 'player',
      label: 'Player',
      width: '13%',
      render: (row) => {
        const athlete = getAthleteById(row.athleteId)
        return (
          <Box display="flex" alignItems="center" gap={1.5}>
            <PlayerAvatar athlete={athlete} size={36} />
            <Box>
              <Typography variant="body1" fontWeight={600}>
                {athlete?.name || 'Unknown athlete'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
                {athlete?.position}
              </Typography>
            </Box>
          </Box>
        )
      },
    },
    {
      key: 'action',
      label: 'Action',
      width: '9%',
      render: (row) => (
        <Box display="flex" alignItems="center" gap={0.75}>
          <Icon name={row.type === 'note' ? 'factCheck' : 'noteAdd'} fontSize="small" sx={{ color: 'var(--color-primary)' }} />
          <Typography variant="body2">{row.type === 'note' ? 'Note' : 'Injury'}</Typography>
        </Box>
      ),
    },
    {
      key: 'injury',
      label: 'Injury',
      width: '14%',
      render: (row) => {
        if (row.type === 'note') {
          const injury = getInjuryById(row.injuryId)
          return (
            <Typography variant="body1" fontWeight={600}>
              {injury ? injury.pathology || injury.label : 'Unknown injury'}
            </Typography>
          )
        }
        return (
          <Box>
            <Typography variant="body1" fontWeight={600}>
              {row.pathology || row.label}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
              {row.date}
            </Typography>
          </Box>
        )
      },
    },
    {
      key: 'source',
      label: 'Created by',
      width: '10%',
      render: (row) => (
        <Box display="flex" alignItems="center" gap={0.75}>
          <Icon name="ai" fontSize="small" sx={{ color: 'var(--color-primary)' }} />
          <Typography variant="body2">{row.addedBy}</Typography>
        </Box>
      ),
    },
    {
      key: 'summary',
      label: 'Summary',
      width: '19%',
      render: (row) =>
        row.type === 'note' ? (
          <Box>
            <Typography variant="body1" fontWeight={600}>
              {row.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
              {row.text}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
            {row.rawDictation}
          </Typography>
        ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '13%',
      render: () => <Lozenge label="Pending review" tone="warning" />,
    },
    {
      key: 'actions',
      label: '',
      width: '22%',
      render: (row) => (
        <Box display="flex" gap={1}>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              if (row.type === 'note') acceptNote(row.id)
              else acceptInjury(row.id)
            }}
          >
            Accept
          </Button>
          <Button
            tone="danger"
            onClick={(e) => {
              e.stopPropagation()
              if (row.type === 'note') rejectNote(row.id)
              else rejectInjury(row.id)
            }}
          >
            Reject
          </Button>
        </Box>
      ),
    },
  ]

  return (
    <Box>
      <Box
        onClick={() => navigate('/medical/roster')}
        display="flex"
        alignItems="center"
        gap={0.5}
        sx={{ cursor: 'pointer', color: 'var(--grey-100)', mb: 1, width: 'fit-content' }}
      >
        <Icon name="back" fontSize="small" />
        <Typography variant="body1">Back to roster</Typography>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h1">Review queue</Typography>
        <Tooltip title="Refresh queue">
          <IconButton
            sx={{
              backgroundColor: 'var(--neutral-200)',
              color: 'var(--color-primary)',
              '&:hover': { backgroundColor: 'var(--neutral-300)' },
            }}
          >
            <Icon name="refresh" fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography variant="body1" sx={{ color: 'var(--grey-100)', mb: 3 }}>
        Injuries and notes staged by the AI assistant. Review each one and accept to add it to the medical record.
      </Typography>

      <Box sx={{ backgroundColor: 'var(--white)', borderRadius: '8px', border: '1px solid var(--divider)' }}>
        <DataTable
          columns={columns}
          rows={rows}
          getRowKey={(row) => `${row.type}-${row.id}`}
          onRowClick={(row) => navigate(`/medical/injury/${row.type === 'note' ? row.injuryId : row.id}`)}
          emptyMessage="Nothing waiting for review. Use the AI assistant to log a new injury or note."
        />
      </Box>
    </Box>
  )
}
