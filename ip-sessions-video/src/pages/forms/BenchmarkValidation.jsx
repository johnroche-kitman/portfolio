import { useState } from 'react'
import { Box, Button, Paper, Typography } from '@mui/material'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import { PageHeader } from '../admin/parts'
import { SearchSelect } from '../../components/form'
import { VALIDATION_CLUBS, VALIDATION_SEASONS, VALIDATION_WINDOWS } from '../../data/forms'

/**
 * A gate rather than a page: three dependent choices, then Next. Nothing else
 * renders until all three are set.
 *
 * The live Season control puts a search field inside its dropdown, which is the
 * pattern this codebase replaced with Autocomplete on the benchmark report.
 * Same treatment here: the search belongs in the input.
 */
export default function BenchmarkValidation() {
  const [club, setClub] = useState(null)
  const [season, setSeason] = useState(null)
  const [window, setWindow] = useState(null)

  const complete = club && season && window
  const reset = () => { setClub(null); setSeason(null); setWindow(null) }

  return (
    <AppShell title="Benchmark validation">
      <PageHeader title="Benchmark test validation" />

      <Box sx={{ px: 3, pt: 2, pb: 6 }}>
        <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 2.5, width: 340 }}>
          <Box sx={{ display: 'grid', gap: 2.5 }}>
            <SearchSelect label="Club" options={VALIDATION_CLUBS} value={club} onChange={setClub} />
            <SearchSelect label="Season" options={VALIDATION_SEASONS} value={season} onChange={setSeason} />
            <SearchSelect label="Window" options={VALIDATION_WINDOWS} value={window} onChange={setWindow} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mt: 2.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>All fields required</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" onClick={reset}>Reset</Button>
              <Button disabled={!complete}>Next</Button>
            </Box>
          </Box>
        </Paper>

        {/* The live system had no window data for this club and season, so the
            step beyond the gate could not be reached to copy. */}
        {complete && (
          <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
            Validation results for {club}, {season}, {window} would load here.
          </Typography>
        )}
      </Box>
    </AppShell>
  )
}
