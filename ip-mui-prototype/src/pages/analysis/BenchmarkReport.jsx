import { useMemo, useRef, useState } from 'react'
import {
  Alert, Box, Button, Checkbox, Chip, Divider, FormControlLabel, InputAdornment, Link, Paper,
  Popover, Radio, RadioGroup, Slider, TextField, Tooltip, Typography,
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import BarChartIcon from '@mui/icons-material/BarChartOutlined'
import ErrorIcon from '@mui/icons-material/ErrorOutline'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import MultiSelectField, { SearchSelectField } from '../../components/MultiSelectField'
import {
  AGE_GROUPS, BENCHMARK_ATHLETES, BENCHMARK_POSITIONS, BENCHMARK_TESTS, MATURATION_STATUSES,
  SEASONS, TESTING_WINDOWS, TEST_META, athletesFor, distributionFor,
} from '../../data/benchmark'

const SectionTitle = ({ children }) => (
  <Typography variant="body1" sx={{ fontWeight: 600, color: colors.grey_200, mb: 2 }}>{children}</Typography>
)

const FIELD_GRID = { display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2.5 }

/* ------------------------------------------------------------- Bio-band */
/** Its own popover in the live app: Any or a range slider, committed with Apply. */
function BioBandField({ value, onChange }) {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState(value.mode)
  const [range, setRange] = useState(value.range)

  const apply = () => { onChange({ mode, range }); setOpen(false) }

  return (
    <Box>
      <TextField
        fullWidth label="Bio-band" inputRef={ref} onClick={() => setOpen(true)}
        value={value.mode === 'any' ? 'Any' : `${value.range[0]}%–${value.range[1]}% of AH`}
        InputProps={{
          readOnly: true,
          endAdornment: <InputAdornment position="end"><ArrowDropDownIcon /></InputAdornment>,
          sx: { cursor: 'pointer', '& input': { cursor: 'pointer' } },
        }}
      />
      <Popover
        open={open} anchorEl={ref.current} onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{ paper: { sx: { width: ref.current?.offsetWidth, minWidth: 260, p: 2, mt: 0.5 } } }}
      >
        <RadioGroup row value={mode} onChange={e => setMode(e.target.value)}>
          <FormControlLabel value="any" control={<Radio size="small" />} label="Any" />
          <FormControlLabel value="range" control={<Radio size="small" />} label="Select range" />
        </RadioGroup>
        <Divider sx={{ my: 1.5 }} />
        {mode === 'range' && (
          <Slider value={range} onChange={(_, v) => setRange(v)} min={50} max={110}
            valueLabelDisplay="auto" sx={{ mx: 1, width: 'calc(100% - 16px)' }} />
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {mode === 'any' ? '' : `${range[0]}%–${range[1]}% of AH`}
          </Typography>
          <Button variant="outlined" size="small" onClick={apply}>Apply</Button>
        </Box>
      </Popover>
    </Box>
  )
}

/* --------------------------------------------------------------- results */
const BAND_COLORS = [colors.neutral_300, colors.neutral_200, colors.neutral_200, colors.neutral_300]

/**
 * One test's national distribution: the P10–P90 span drawn as four bands, with
 * the club average and any selected athletes marked against it.
 */
function DistributionRow({ test, showClub, athletes }) {
  const d = distributionFor(test)
  if (!d) return null
  const meta = TEST_META[test] || { unit: '', lowerIsBetter: false }
  const stops = [d.p10, d.p25, d.p50, d.p75, d.p90]
  const lo = Math.min(stops[0], stops[4])
  const hi = Math.max(stops[0], stops[4])
  const pos = v => ((v - lo) / (hi - lo)) * 100

  return (
    <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 2.5, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2, mb: 2.5 }}>
        <Typography variant="body1" sx={{ fontWeight: 700 }}>{test}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          National, n = {d.n} · {meta.lowerIsBetter ? 'lower is better' : 'higher is better'}
        </Typography>
      </Box>

      <Box sx={{ position: 'relative', mx: 1 }}>
        <Box sx={{ display: 'flex', height: 18, borderRadius: 0.5, overflow: 'hidden' }}>
          {BAND_COLORS.map((c, i) => (
            <Box key={i} sx={{ flex: 1, bgcolor: c }} />
          ))}
        </Box>

        {showClub && (
          <Tooltip title={`My club average ${d.club}${meta.unit}`}>
            <Box sx={{
              position: 'absolute', top: -5, left: `${pos(d.club)}%`, transform: 'translateX(-50%)',
              width: 3, height: 28, bgcolor: colors.grey_200, borderRadius: 1,
            }} />
          </Tooltip>
        )}

        {athletes.map(a => (
          <Tooltip key={a.name} title={`${a.name} — ${a.value}${meta.unit}`}>
            <Box sx={{
              position: 'absolute', top: 3, left: `${pos(a.value)}%`, transform: 'translateX(-50%)',
              width: 12, height: 12, borderRadius: '50%', bgcolor: colors.blue_100,
              border: `2px solid ${colors.white}`, cursor: 'pointer',
            }} />
          </Tooltip>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          {['P10', 'P25', 'P50', 'P75', 'P90'].map((p, i) => (
            <Box key={p} sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>{p}</Typography>
              <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                {stops[i]}{meta.unit}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  )
}

const EmptyResults = () => (
  <Box sx={{ py: 10, textAlign: 'center' }}>
    <BarChartIcon sx={{ fontSize: 34, color: colors.grey_200 }} />
    <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>No data available</Typography>
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      No data available for current selection - Try updating your filters
    </Typography>
  </Box>
)

/* ------------------------------------------------------------------ page */
export default function BenchmarkReport() {
  const [tests, setTests] = useState([])
  const [seasons, setSeasons] = useState([SEASONS[0]])
  const [windows, setWindows] = useState([...TESTING_WINDOWS])
  const [national, setNational] = useState(true)
  const [myClub, setMyClub] = useState(false)

  const [ageGroup, setAgeGroup] = useState('')
  const [bioBand, setBioBand] = useState({ mode: 'any', range: [65, 100] })
  const [maturation, setMaturation] = useState([])
  const [positions, setPositions] = useState([])

  const [athletes, setAthletes] = useState([])
  const [athleteSeasons, setAthleteSeasons] = useState([SEASONS[0]])
  const [athleteWindows, setAthleteWindows] = useState([...TESTING_WINDOWS])

  const [results, setResults] = useState(null)
  // The live page lets you press Generate results first; the age rule only
  // surfaces once you have, and the button then stays disabled until it is met.
  const [attempted, setAttempted] = useState(false)

  // The live rule: with bio-band on "Any" and no individual athletes chosen, an
  // age group is required, and Generate results stays disabled until it is set.
  const ageError = bioBand.mode === 'any' && !athletes.length && !ageGroup
  const showAgeError = attempted && ageError
  const canGenerate = tests.length > 0 && !showAgeError

  const clearAll = () => {
    setTests([]); setSeasons([SEASONS[0]]); setWindows([...TESTING_WINDOWS])
    setNational(true); setMyClub(false)
    setAgeGroup(''); setBioBand({ mode: 'any', range: [65, 100] }); setMaturation([]); setPositions([])
    setAthletes([]); setAthleteSeasons([SEASONS[0]]); setAthleteWindows([...TESTING_WINDOWS])
    setResults(null); setAttempted(false)
  }

  const shownAthletes = useMemo(
    () => (results ? athletesFor(results.tests[0], results.athletes) : []),
    [results],
  )

  return (
    <AppShell title="League Benchmark Reporting">
      <Box sx={{ px: 3, py: 2.5, maxWidth: 1320 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Benchmarking</Typography>

        <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 3 }}>
          {/* ---- tests and time range, with the audience panel beside it ---- */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 300px' }, gap: 3 }}>
            <Box>
              <SectionTitle>Select tests and time range</SectionTitle>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2.5 }}>
                <MultiSelectField label="Benchmark test(s)" options={BENCHMARK_TESTS}
                  value={tests} onChange={setTests} search selectAll />
                <MultiSelectField label="Seasons (Max: 4)" options={SEASONS}
                  value={seasons} onChange={setSeasons} search max={4} />
                <MultiSelectField label="Testing window(s)" options={TESTING_WINDOWS}
                  value={windows} onChange={setWindows} selectAll />
              </Box>
            </Box>

            <Box sx={{ borderLeft: { lg: `1px solid ${colors.neutral_300}` }, pl: { lg: 3 } }}>
              <SectionTitle>Show results for...</SectionTitle>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControlLabel label="National" sx={{ ml: 0 }}
                  control={<Checkbox checked={national} onChange={e => setNational(e.target.checked)} />} />
                <FormControlLabel label="My club" sx={{ ml: 0, whiteSpace: 'nowrap' }}
                  control={<Checkbox checked={myClub} onChange={e => setMyClub(e.target.checked)} />} />
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ---------------------------- group demographics ---------------------------- */}
          <SectionTitle>Select group demographics</SectionTitle>
          <Box sx={FIELD_GRID}>
            <Box>
              <SearchSelectField label="Age group" options={AGE_GROUPS} value={ageGroup} onChange={setAgeGroup}
                error={showAgeError} />
              {showAgeError && (
                <Box sx={{ display: 'flex', gap: 0.75, mt: 0.75 }}>
                  <ErrorIcon sx={{ fontSize: 16, color: colors.red_200, mt: '2px' }} />
                  <Typography variant="caption" sx={{ color: colors.red_200, fontWeight: 600 }}>
                    An age is required if the &ldquo;Any&rdquo; bio-band option is selected and no individual
                    athletes are selected
                  </Typography>
                </Box>
              )}
            </Box>
            <BioBandField value={bioBand} onChange={setBioBand} />
            <MultiSelectField label="Maturation status" options={MATURATION_STATUSES}
              value={maturation} onChange={setMaturation} selectAll />
            <MultiSelectField label="Position(s)" options={BENCHMARK_POSITIONS}
              value={positions} onChange={setPositions} clear={false} />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ------------------------ individual athlete comparison ------------------------ */}
          <SectionTitle>Compare against my individual athletes</SectionTitle>
          <Box sx={FIELD_GRID}>
            <MultiSelectField label="Athlete(s)" options={BENCHMARK_ATHLETES}
              value={athletes} onChange={setAthletes} search selectAll />
            <MultiSelectField label="Seasons (Max: 4)" options={SEASONS}
              value={athleteSeasons} onChange={setAthleteSeasons} search max={4} />
            <MultiSelectField label="Testing window(s)" options={TESTING_WINDOWS}
              value={athleteWindows} onChange={setAthleteWindows} selectAll />
            <Link component="button" underline="hover" sx={{ fontSize: 14, justifySelf: 'start', alignSelf: 'center' }}
              onClick={() => { setAthletes([]); setAthleteSeasons([SEASONS[0]]); setAthleteWindows([...TESTING_WINDOWS]) }}>
              Clear
            </Link>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3 }}>
            <Button variant="outlined" onClick={clearAll}>Clear All</Button>
            <Button disabled={!canGenerate}
              onClick={() => {
                setAttempted(true)
                if (!ageError) setResults({ tests, athletes, myClub, national })
              }}>
              Generate results
            </Button>
          </Box>
        </Paper>

        {/* --------------------------------- results --------------------------------- */}
        <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, mt: 3 }}>
          <Box sx={{ px: 3, py: 1.5, bgcolor: colors.neutral_100, borderBottom: `1px solid ${colors.neutral_300}` }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>Results</Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            {!results ? <EmptyResults /> : (
              <>
                <Alert severity="info" sx={{ mb: 2.5 }}>
                  The demo account holds no benchmark results, so the live report only ever renders its empty
                  state. The distributions below are synthetic, so the report itself can be designed.
                </Alert>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                  <Chip size="small" label={`${results.tests.length} test${results.tests.length > 1 ? 's' : ''}`} />
                  <Chip size="small" label={ageGroup || 'All ages'} />
                  <Chip size="small" label={bioBand.mode === 'any' ? 'Bio-band: Any' : `Bio-band ${bioBand.range[0]}–${bioBand.range[1]}%`} />
                  <Box sx={{ flex: 1 }} />
                  {results.myClub && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Box sx={{ width: 3, height: 14, bgcolor: colors.grey_200, borderRadius: 1 }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>My club average</Typography>
                    </Box>
                  )}
                  {!!shownAthletes.length && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: colors.blue_100 }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Selected athletes</Typography>
                    </Box>
                  )}
                </Box>

                {results.tests.map(t => (
                  <DistributionRow key={t} test={t} showClub={results.myClub}
                    athletes={athletesFor(t, results.athletes)} />
                ))}
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </AppShell>
  )
}
