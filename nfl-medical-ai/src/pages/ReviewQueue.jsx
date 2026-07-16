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

  const injuryColumns = [
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
      render: () => <Lozenge label="Pending review" tone="warning" />,
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

  const noteColumns = [
    {
      key: 'player',
      label: 'Player',
      width: '14%',
      render: (note) => {
        const athlete = getAthleteById(note.athleteId)
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
      render: (note) => {
        const injury = getInjuryById(note.injuryId)
        return (
          <Typography variant="body1" fontWeight={600}>
            {injury ? injury.pathology || injury.label : 'Unknown injury'}
          </Typography>
        )
      },
    },
    {
      key: 'source',
      label: 'Created by',
      width: '12%',
      render: (note) => (
        <Box display="flex" alignItems="center" gap={0.75}>
          <Icon name="ai" fontSize="small" sx={{ color: 'var(--color-primary)' }} />
          <Typography variant="body2">{note.addedBy}</Typography>
        </Box>
      ),
    },
    {
      key: 'summary',
      label: 'Note',
      width: '20%',
      render: (note) => (
        <Box>
          <Typography variant="body1" fontWeight={600}>
            {note.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
            {note.text}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '12%',
      render: () => <Lozenge label="Pending review" tone="warning" />,
    },
    {
      key: 'actions',
      label: '',
      width: '26%',
      render: (note) => (
        <Box display="flex" gap={1}>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              acceptNote(note.id)
            }}
          >
            Accept
          </Button>
          <Button
            tone="danger"
            onClick={(e) => {
              e.stopPropagation()
              rejectNote(note.id)
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
        Injuries and notes staged by the AI assistant. Review each one and accept to add it to the medical record.
      </Typography>

      <Typography variant="h2" sx={{ mb: 1.5 }}>
        Injuries pending review
      </Typography>
      <Box sx={{ backgroundColor: 'var(--white)', borderRadius: '8px', border: '1px solid var(--divider)', mb: 4 }}>
        <DataTable
          columns={injuryColumns}
          rows={pendingInjuries}
          getRowKey={(row) => row.id}
          onRowClick={(row) => navigate(`/medical/injury/${row.id}`)}
          emptyMessage="No injuries waiting for review. Use the AI assistant to log a new injury."
        />
      </Box>

      <Typography variant="h2" sx={{ mb: 1.5 }}>
        Notes pending review
      </Typography>
      <Box sx={{ backgroundColor: 'var(--white)', borderRadius: '8px', border: '1px solid var(--divider)' }}>
        <DataTable
          columns={noteColumns}
          rows={pendingNotes}
          getRowKey={(row) => row.id}
          onRowClick={(row) => navigate(`/medical/injury/${row.injuryId}`)}
          emptyMessage="No notes waiting for review. Use the AI assistant to dictate a note update."
        />
      </Box>
    </Box>
  )
}
