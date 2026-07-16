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
  const { pendingInjuries, getAthleteById, acceptInjury, rejectInjury } = useAppData()
  const navigate = useNavigate()

  const columns = [
    {
      key: 'player',
      label: 'Player',
      width: '14%',
      render: (injury) => {
        const athlete = getAthleteById(injury.athleteId)
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
      key: 'injury',
      label: 'Injury',
      width: '16%',
      render: (injury) => (
        <Box>
          <Typography variant="body1" fontWeight={600}>
            {injury.pathology || injury.label}
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
            {injury.date}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'source',
      label: 'Created by',
      width: '12%',
      render: (injury) => (
        <Box display="flex" alignItems="center" gap={0.75}>
          <Icon name="ai" fontSize="small" sx={{ color: 'var(--color-primary)' }} />
          <Typography variant="body2">{injury.addedBy}</Typography>
        </Box>
      ),
    },
    {
      key: 'summary',
      label: 'AI summary',
      width: '20%',
      render: (injury) => (
        <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
          {injury.rawDictation}
        </Typography>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '12%',
      render: (injury) => <Lozenge label="Pending review" tone="warning" />,
    },
    {
      key: 'actions',
      label: '',
      width: '26%',
      render: (injury) => (
        <Box display="flex" gap={1}>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              acceptInjury(injury.id)
            }}
          >
            Accept
          </Button>
          <Button
            tone="danger"
            onClick={(e) => {
              e.stopPropagation()
              rejectInjury(injury.id)
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
        Injuries staged by the AI assistant. Review each one and accept to add it to the medical record.
      </Typography>

      <Box sx={{ backgroundColor: 'var(--white)', borderRadius: '8px', border: '1px solid var(--divider)' }}>
        <DataTable
          columns={columns}
          rows={pendingInjuries}
          getRowKey={(row) => row.id}
          onRowClick={(row) => navigate(`/medical/injury/${row.id}`)}
          emptyMessage="Nothing waiting for review. Use the AI assistant to log a new injury."
        />
      </Box>
    </Box>
  )
}
