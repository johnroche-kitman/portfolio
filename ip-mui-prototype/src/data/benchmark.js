// League Benchmark Reporting fixtures, read off /analysis/benchmark_report.

export const BENCHMARK_TESTS = [
  '05m Sprint', '10m Sprint', '20m Sprint', '30m Sprint',
  '505 Agility - Left Foot', '505 Agility - Right Foot',
  'Agility - Arrowhead Left', 'Agility - Arrowhead Right',
  'CMJ - Flight Time', 'CMJ - Optojump', 'CMJ - Vald',
  'Yo Yo Intermittent Recovery Test Level 1', 'Yo Yo Intermittent Recovery Test Level 2',
]

export const SEASONS = ['2026/2027', '2025/2026', '2024/2025', '2023/2024', '2022/2023', '2021/2022']
export const TESTING_WINDOWS = ['Test Window 1', 'Test Window 2', 'Test Window 3']

export const AGE_GROUPS = ['U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17', 'U18', 'U19', 'U20', 'U21', 'U22', 'U23']
export const MATURATION_STATUSES = ['Very Early', 'Early', 'On Time', 'Late', 'Very Late']
export const BENCHMARK_POSITIONS = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward/Striker', 'Other']

// Units and direction per test — a lower sprint time is better, a higher jump is.
export const TEST_META = {
  '05m Sprint': { unit: 's', lowerIsBetter: true },
  '10m Sprint': { unit: 's', lowerIsBetter: true },
  '20m Sprint': { unit: 's', lowerIsBetter: true },
  '30m Sprint': { unit: 's', lowerIsBetter: true },
  '505 Agility - Left Foot': { unit: 's', lowerIsBetter: true },
  '505 Agility - Right Foot': { unit: 's', lowerIsBetter: true },
  'Agility - Arrowhead Left': { unit: 's', lowerIsBetter: true },
  'Agility - Arrowhead Right': { unit: 's', lowerIsBetter: true },
  'CMJ - Flight Time': { unit: 'ms', lowerIsBetter: false },
  'CMJ - Optojump': { unit: 'cm', lowerIsBetter: false },
  'CMJ - Vald': { unit: 'cm', lowerIsBetter: false },
  'Yo Yo Intermittent Recovery Test Level 1': { unit: 'm', lowerIsBetter: false },
  'Yo Yo Intermittent Recovery Test Level 2': { unit: 'm', lowerIsBetter: false },
}

/**
 * The demo account holds no benchmark results, so the live page only ever shows
 * its empty state. These percentiles are synthetic, added so the report itself
 * can be designed rather than just its filter panel.
 */
const DISTRIBUTIONS = {
  '05m Sprint': { p10: 1.18, p25: 1.12, p50: 1.06, p75: 1.01, p90: 0.97, club: 1.04, n: 412 },
  '10m Sprint': { p10: 1.98, p25: 1.90, p50: 1.82, p75: 1.75, p90: 1.69, club: 1.79, n: 408 },
  '20m Sprint': { p10: 3.35, p25: 3.22, p50: 3.10, p75: 2.99, p90: 2.90, club: 3.04, n: 396 },
  '30m Sprint': { p10: 4.72, p25: 4.55, p50: 4.39, p75: 4.24, p90: 4.12, club: 4.31, n: 351 },
  '505 Agility - Left Foot': { p10: 2.68, p25: 2.58, p50: 2.48, p75: 2.39, p90: 2.31, club: 2.43, n: 288 },
  '505 Agility - Right Foot': { p10: 2.66, p25: 2.56, p50: 2.46, p75: 2.37, p90: 2.29, club: 2.50, n: 286 },
  'Agility - Arrowhead Left': { p10: 9.10, p25: 8.82, p50: 8.55, p75: 8.29, p90: 8.06, club: 8.61, n: 204 },
  'Agility - Arrowhead Right': { p10: 9.06, p25: 8.79, p50: 8.52, p75: 8.26, p90: 8.03, club: 8.44, n: 201 },
  'CMJ - Flight Time': { p10: 452, p25: 478, p50: 505, p75: 532, p90: 558, club: 519, n: 377 },
  'CMJ - Optojump': { p10: 25.1, p25: 28.0, p50: 31.2, p75: 34.5, p90: 37.6, club: 30.4, n: 341 },
  'CMJ - Vald': { p10: 24.8, p25: 27.6, p50: 30.8, p75: 34.0, p90: 37.1, club: 33.2, n: 265 },
  'Yo Yo Intermittent Recovery Test Level 1': { p10: 880, p25: 1080, p50: 1320, p75: 1560, p90: 1800, club: 1240, n: 233 },
  'Yo Yo Intermittent Recovery Test Level 2': { p10: 520, p25: 660, p50: 820, p75: 980, p90: 1140, club: 900, n: 128 },
}

// A handful of the club's own athletes, plotted against the distribution.
const ATHLETE_OFFSETS = [
  { name: 'Athlete, Diagnostic', pct: 0.72 },
  { name: 'Athlete, Friday', pct: 0.41 },
  { name: 'Bennett, Craig', pct: 0.88 },
  { name: 'Ali, Mohamed', pct: 0.24 },
  { name: 'Athlete, Craig', pct: 0.58 },
]

export const distributionFor = test => DISTRIBUTIONS[test]

export const athletesFor = (test, selected) => {
  const d = DISTRIBUTIONS[test]
  if (!d) return []
  const lo = Math.min(d.p10, d.p90)
  const hi = Math.max(d.p10, d.p90)
  const pool = selected?.length
    ? ATHLETE_OFFSETS.filter(a => selected.includes(a.name))
    : ATHLETE_OFFSETS
  return pool.map(a => ({ ...a, value: +(lo + (hi - lo) * a.pct).toFixed(2) }))
}

export const BENCHMARK_ATHLETES = ATHLETE_OFFSETS.map(a => a.name)
