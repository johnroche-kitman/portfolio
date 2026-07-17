import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useNavigate } from 'react-router-dom'
import DataTable from '../components/DataTable'
import PlayerAvatar from '../components/PlayerAvatar'
import Button from '../components/Button'
import Icon from '../components/Icon'
import { useAppData } from '../state/AppDataContext'

const ACTION_META = {
  injury: { icon: 'noteAdd', label: 'Injury' },
  note: { icon: 'factCheck', label: 'Note' },
  rehab: { icon: 'rehab', label: 'Rehab' },
}

export default function ReviewQueue() {
  const {
    pendingInjuries,
    pendingNotes,
    pendingRehabs,
    getAthleteById,
    getInjuryById,
    acceptInjury,
    rejectInjury,
    acceptNote,
    rejectNote,
    acceptRehab,
    rejectRehab,
  } = useAppData()
  const navigate = useNavigate()

  const rows = [
    ...pendingInjuries.map((injury) => ({ ...injury, type: 'injury' })),
    ...pendingNotes.map((note) => ({ ...note, type: 'note' })),
    ...pendingRehabs.map((rehab) => ({ ...rehab, type: 'rehab' })),
  ]

  function acceptRow(row) {
    if (row.type === 'note') acceptNote(row.id)
    else if (row.type === 'rehab') acceptRehab(row.id)
    else acceptInjury(row.id)
  }

  function rejectRow(row) {
    if (row.type === 'note') rejectNote(row.id)
    else if (row.type === 'rehab') rejectRehab(row.id)
    else rejectInjury(row.id)
  }

  const columns = [
    {
      key: 'player',
      label: 'Player',
      width: '16%',
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
      width: '10%',
      render: (row) => (
        <Box display="flex" alignItems="center" gap={0.75}>
          <Icon name={ACTION_META[row.type].icon} fontSize="small" sx={{ color: 'var(--color-primary)' }} />
          <Typography variant="body2">{ACTION_META[row.type].label}</Typography>
        </Box>
      ),
    },
    {
      key: 'injury',
      label: 'Injury',
      width: '18%',
      render: (row) => {
        if (row.type === 'injury') {
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
        }
        const injury = getInjuryById(row.injuryId)
        return (
          <Typography variant="body1" fontWeight={600}>
            {injury ? injury.pathology || injury.label : 'Unknown injury'}
          </Typography>
        )
      },
    },
    {
      key: 'summary',
      label: 'Summary',
      width: '30%',
      render: (row) => {
        if (row.type === 'note') {
          return (
            <Box>
              <Typography variant="body1" fontWeight={600}>
                {row.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
                {row.text}
              </Typography>
            </Box>
          )
        }
        if (row.type === 'rehab') {
          return (
            <Box>
              <Typography variant="body1" fontWeight={600}>
                {row.exercises.length} exercise{row.exercises.length === 1 ? '' : 's'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
                {row.exercises.map((e) => e.name).join(', ')}
              </Typography>
            </Box>
          )
        }
        return (
          <Typography variant="body2" sx={{ color: 'var(--grey-100)' }}>
            {row.rawDictation}
          </Typography>
        )
      },
    },
    {
      key: 'actions',
      label: '',
      width: '26%',
      render: (row) => (
        <Box display="flex" gap={1}>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              acceptRow(row)
            }}
          >
            Accept
          </Button>
          <Button
            tone="danger"
            onClick={(e) => {
              e.stopPropagation()
              rejectRow(row)
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
        Injuries, notes and rehab programs staged by the AI assistant. Review each one and accept to add it to the
        medical record.
      </Typography>

      <Box sx={{ backgroundColor: 'var(--white)', borderRadius: '8px', border: '1px solid var(--divider)' }}>
        <DataTable
          columns={columns}
          rows={rows}
          getRowKey={(row) => `${row.type}-${row.id}`}
          onRowClick={(row) => navigate(`/medical/injury/${row.type === 'injury' ? row.id : row.injuryId}`)}
          emptyMessage="Nothing waiting for review. Use the AI assistant to log a new injury, note, or rehab program."
        />
      </Box>
    </Box>
  )
}
