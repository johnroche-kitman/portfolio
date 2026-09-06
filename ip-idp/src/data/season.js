/**
 * One athlete's season, for the analysis dashboard.
 *
 * Nine games so far, oldest first — a line reads left to right, so the fixture
 * list is reversed out of `GAMES`, which is newest first for the clip sources.
 *
 * Everything is derived from the athlete and the fixture, so a reload shows the
 * same season. Squad averages come from the same generator over the rest of the
 * squad, which keeps the comparison honest: it is the mean of numbers the
 * prototype could actually show you elsewhere, not a flattering constant.
 */
import { GAMES } from './video'
import { athleteById, athletesInSquad, squad } from './athletes'

/** Deterministic [0,1) from a string. */
const rand = str => {
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 100000) / 100000
}

/** Oldest first, which is the order a season is read in. */
export const FIXTURES = [...GAMES].reverse()

/**
 * One athlete's line for one game.
 *
 * Minutes are the thing everything else hangs off: a substitute appearance
 * should not look like a poor full match, so the per-90 figures are rates and
 * the raw counts scale with time on the pitch.
 */
const gameLine = (athleteId, fixture, index) => {
  const seed = `${athleteId}-${fixture.date}`
  const r = k => rand(`${seed}-${k}`)

  // One game off the bench and one missed, placed by the athlete rather than
  // fixed, so two players' seasons do not have the same shape.
  const benched = index === Math.floor(rand(`${athleteId}-bench`) * FIXTURES.length)
  const minutes = benched ? 20 + Math.round(r('m') * 25) : 78 + Math.round(r('m') * 12)
  const share = minutes / 90

  const per90 = {
    distance: 9200 + Math.round(r('d') * 2100),
    highSpeed: 620 + Math.round(r('h') * 380),
    crosses: 2 + Math.round(r('c') * 5),
    overlaps: 3 + Math.round(r('o') * 6),
    recoveries: 5 + Math.round(r('r') * 7),
    duels: 6 + Math.round(r('u') * 6),
  }

  const duelsWon = Math.round(per90.duels * share * (0.44 + r('w') * 0.3))

  return {
    date: fixture.date,
    opposition: fixture.opposition,
    competition: fixture.competition,
    // "Halton Vale (Away)" reads as "Halton Vale" on an axis.
    short: fixture.opposition.replace(/\s*\(.*\)$/, ''),
    home: /\(Home\)/.test(fixture.opposition),
    minutes,
    started: !benched,
    distance: Math.round(per90.distance * share),
    distancePer90: per90.distance,
    highSpeed: Math.round(per90.highSpeed * share),
    topSpeed: Math.round((30.4 + r('t') * 4.2) * 10) / 10,
    crosses: Math.round(per90.crosses * share),
    overlaps: Math.round(per90.overlaps * share),
    recoveries: Math.round(per90.recoveries * share),
    duels: Math.round(per90.duels * share),
    duelsWon,
    assists: r('a') > 0.82 ? 1 : 0,
  }
}

export const seasonFor = athleteId => FIXTURES.map((f, i) => gameLine(athleteId, f, i))

/** The squad's mean for a metric, game by game — the line Ellery is read against. */
export const squadAverage = metric => {
  const others = athletesInSquad(squad).map(a => a.id)
  return FIXTURES.map((f, i) => {
    const values = others.map(id => gameLine(id, f, i)[metric])
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
  })
}

/** Season totals, and the per-90 rates that make a part-season comparable. */
export const seasonTotals = athleteId => {
  const games = seasonFor(athleteId)
  const played = games.filter(g => g.minutes > 0)
  const minutes = played.reduce((n, g) => n + g.minutes, 0)
  const per90 = v => (minutes ? Math.round((v / minutes) * 90) : 0)
  const sum = k => played.reduce((n, g) => n + g[k], 0)

  return {
    appearances: played.length,
    starts: played.filter(g => g.started).length,
    minutes,
    distance: sum('distance'),
    distancePer90: per90(sum('distance')),
    highSpeedPer90: per90(sum('highSpeed')),
    topSpeed: Math.max(...played.map(g => g.topSpeed)),
    crosses: sum('crosses'),
    overlaps: sum('overlaps'),
    recoveries: sum('recoveries'),
    assists: sum('assists'),
    duelSuccess: Math.round((sum('duelsWon') / Math.max(1, sum('duels'))) * 100),
  }
}

/**
 * The dashboard's headline numbers. Kept as data so the tiles and any future
 * export read the same set, and so the wording of a label lives in one place.
 */
export const summaryTiles = athleteId => {
  const t = seasonTotals(athleteId)
  return [
    { key: 'apps', label: 'Appearances', value: t.appearances, note: `${t.starts} starts` },
    { key: 'mins', label: 'Minutes', value: t.minutes.toLocaleString('en-GB'), note: 'this season' },
    { key: 'dist', label: 'Distance per 90', value: `${(t.distancePer90 / 1000).toFixed(1)} km`, note: `${(t.distance / 1000).toFixed(1)} km total` },
    { key: 'hsd', label: 'High-speed per 90', value: `${t.highSpeedPer90} m`, note: 'above 19.8 km/h' },
    { key: 'top', label: 'Top speed', value: `${t.topSpeed.toFixed(1)} km/h`, note: 'season best' },
    { key: 'duels', label: 'Duels won', value: `${t.duelSuccess}%`, note: 'of duels contested' },
  ]
}

/** The athlete this dashboard is built for. */
export const FEATURED_ATHLETE = 440559

export const featuredAthlete = () => athleteById(FEATURED_ATHLETE)
