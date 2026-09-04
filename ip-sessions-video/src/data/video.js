/**
 * Hudl clip fixtures.
 *
 * In the real product these rows arrive from the Hudl API: the analyst tags and
 * trims in Hudl, iP pulls the clips down against the event, and the mapping from
 * a Hudl tag to a drill, an athlete, a principle or a development goal is what
 * makes them findable here. Nothing on this page is uploaded by hand, which is
 * why there is a sync state rather than an upload button.
 *
 * The media files themselves live once, at the site root, so both prototypes
 * point at the same folder instead of shipping two copies of every clip.
 */

import { athletes as ATHLETES } from './athletes'

export const CLIPS = import.meta.env.PROD ? '/portfolio/clips/' : '/clips/'

export const clipSrc = file => `${CLIPS}${file}`
export const posterSrc = file => `${CLIPS}posters/${file.replace(/\.mp4$/, '.jpg')}`

/* ------------------------------------------------------------ principles
   Principles are configured per club, so the list is club data rather than
   product data. Each is "Name (Category, Phase, Type)" — the shape the drill
   Principles panel writes and the filters read back. */
export const PRINCIPLES = [
  { name: 'Ball Retention', category: 'Progressing and Penetrating', phase: 'Attacking', type: 'Technical' },
  { name: 'Breaking Lines', category: 'Progressing and Penetrating', phase: 'Defending', type: 'Tactical' },
  { name: 'Creating Space', category: 'Progressing and Penetrating', phase: 'Attacking', type: 'Tactical' },
  { name: 'Finishing', category: 'Progressing and Penetrating', phase: 'Attacking', type: 'Technical' },
  { name: 'Forward Passing', category: 'Progressing and Penetrating', phase: 'Attacking', type: 'Technical' },
  { name: 'Pressing', category: 'Direct Play', phase: 'Attacking', type: 'Tactical' },
  { name: 'Rotations', category: 'Progressing and Penetrating', phase: 'Attacking', type: 'Tactical' },
  { name: 'Screening', category: 'Delay, Deny, and Dictate', phase: 'Transition', type: 'Tactical' },
  { name: 'Switching Play', category: 'Progressing and Penetrating', phase: 'Attacking', type: 'Tactical' },
  { name: 'Wide Play and Crossing', category: 'Attacking', phase: 'Defending', type: 'Tactical' },
]

const byName = Object.fromEntries(PRINCIPLES.map(p => [p.name, p]))

/** "Breaking Lines (Defending, Tactical)" — the short form used on chips. */
export const principleLabel = name => {
  const p = byName[name]
  return p ? `${p.name} (${p.phase}, ${p.type})` : name
}

/** The full form, as the drill Principles panel writes it. */
export const principleFull = name => {
  const p = byName[name]
  return p ? `${p.name} (${p.category}, ${p.phase}, ${p.type})` : name
}

export const PRINCIPLE_NAMES = PRINCIPLES.map(p => p.name)

/* --------------------------------------------------------- peak metrics
   Three peaks come across with every clip. `step` and the bounds drive the
   threshold slider; `format` is the only place a unit is written. */
export const PEAK_METRICS = [
  { key: 'speed', label: 'Max speed', unit: 'km/h', min: 18, max: 36, step: 0.1, format: v => `${v.toFixed(1)} km/h` },
  { key: 'acceleration', label: 'Max acceleration', unit: 'm/s²', min: 1.5, max: 5, step: 0.1, format: v => `${v.toFixed(1)} m/s²` },
  { key: 'heartRate', label: 'Max heart rate', unit: 'bpm', min: 130, max: 205, step: 1, format: v => `${v} bpm` },
]

export const peakMetric = key => PEAK_METRICS.find(m => m.key === key)

/* ---------------------------------------------------------------- session
   The event the Video tab belongs to. */
export const videoSession = {
  id: 'sv-1',
  title: 'Gameday -3 training',
  squad: 'U16',
  sessionType: '1st Team Training',
  date: 'September 21, 2026 2:00 PM, (3:00 PM Europe/Dublin) (90 min)',
  gameDay: '-3, +4',
  surface: 'Grass',
}

/* ----------------------------------------------------------------- drills
   Five drills, in the order they were run. `fullClip` is the uncut whole-team
   playback; the individual clips hang off `clips` below by drillId. */
export const videoDrills = [
  {
    id: 'd1', order: 1, name: 'Rondo 4v2', activity: 'Warmup (Conditioning)',
    principles: ['Ball Retention', 'Forward Passing'],
    minutes: 12, areaSize: '12 x 12m',
    fullClip: { file: 'drill-01-full.mp4', duration: '11:48', angle: 'Tactical wide' },
  },
  {
    id: 'd2', order: 2, name: 'Breaking lines — 6v4 middle third', activity: 'Transition (Football Based)',
    principles: ['Breaking Lines', 'Forward Passing'],
    minutes: 18, areaSize: '40 x 44m',
    fullClip: { file: 'drill-02-full.mp4', duration: '17:32', angle: 'Tactical wide' },
  },
  {
    id: 'd3', order: 3, name: 'Wide overloads and crossing', activity: 'Attack (Football Based)',
    principles: ['Wide Play and Crossing', 'Creating Space', 'Finishing'],
    minutes: 20, areaSize: 'Half pitch',
    fullClip: { file: 'drill-03-full.mp4', duration: '19:05', angle: 'High behind goal' },
  },
  {
    id: 'd4', order: 4, name: 'Counter-press transition', activity: 'Defence (Football Based)',
    principles: ['Pressing', 'Screening'],
    minutes: 16, areaSize: '60 x 44m',
    fullClip: { file: 'drill-04-full.mp4', duration: '15:21', angle: 'Tactical wide' },
  },
  {
    id: 'd5', order: 5, name: '11v11 phase of play', activity: 'Games (Football Based)',
    principles: ['Breaking Lines', 'Switching Play', 'Rotations'],
    minutes: 24, areaSize: 'Full pitch',
    fullClip: { file: 'drill-05-full.mp4', duration: '23:40', angle: 'Tactical wide' },
  },
]

export const drillById = id => videoDrills.find(d => d.id === id)

/* ------------------------------------------------------------------ clips
   Individual clips. Twelve come off this session's drills and appear on the
   Video tab; six come off games and appear only where a development goal
   gathers them together, which is how a season's evidence actually builds up.

   `goals` holds the development goal ids the analyst tagged the clip with in
   Hudl. A clip can carry more than one. */
const CURATED = [
  /* ---- d1 Rondo 4v2 */
  { id: 'c01', file: 'session-01.mp4', drillId: 'd1', athleteId: 431887, at: '00:04:12', duration: '00:09',
    title: 'Diallo — first-time switch out of the rondo',
    principles: ['Ball Retention', 'Forward Passing'],
    peaks: { speed: 21.4, acceleration: 2.9, heartRate: 158 }, goals: ['g-half-turn'] },
  { id: 'c02', file: 'session-02.mp4', drillId: 'd1', athleteId: 440316, at: '00:07:38', duration: '00:07',
    title: 'Bramwell — receives on the half turn, plays through',
    principles: ['Ball Retention'],
    peaks: { speed: 19.8, acceleration: 3.1, heartRate: 164 }, goals: ['g-half-turn'] },
  { id: 'c03', file: 'session-03.mp4', drillId: 'd1', athleteId: 454521, at: '00:09:55', duration: '00:11',
    title: 'Ferrante — third-man run and return',
    principles: ['Forward Passing', 'Creating Space'],
    peaks: { speed: 24.6, acceleration: 3.4, heartRate: 171 }, goals: ['g-third-man'] },

  /* ---- d2 Breaking lines */
  { id: 'c04', file: 'session-04.mp4', drillId: 'd2', athleteId: 114397, at: '00:21:07', duration: '00:12',
    title: 'Ihenacho — line-breaking pass into the ten',
    principles: ['Breaking Lines', 'Forward Passing'],
    peaks: { speed: 22.1, acceleration: 2.7, heartRate: 168 }, goals: ['g-break-line'] },
  { id: 'c05', file: 'session-05.mp4', drillId: 'd2', athleteId: 431887, at: '00:24:44', duration: '00:10',
    title: 'Diallo — splits the two pivots',
    principles: ['Breaking Lines', 'Forward Passing'],
    peaks: { speed: 25.9, acceleration: 3.6, heartRate: 176 }, goals: ['g-break-line'] },
  { id: 'c06', file: 'session-06.mp4', drillId: 'd2', athleteId: 453803, at: '00:28:19', duration: '00:08',
    title: 'Docherty — screens, intercepts, restarts',
    principles: ['Screening', 'Breaking Lines'],
    peaks: { speed: 20.3, acceleration: 3.9, heartRate: 181 }, goals: ['g-screen'] },

  /* ---- d3 Wide overloads and crossing */
  { id: 'c07', file: 'session-07.mp4', drillId: 'd3', athleteId: 441234, at: '00:41:02', duration: '00:13',
    title: 'Adeyemi — beats the full back, cuts back',
    principles: ['Wide Play and Crossing', 'Creating Space'],
    peaks: { speed: 32.8, acceleration: 4.3, heartRate: 189 }, goals: ['g-beat-defender'] },
  { id: 'c08', file: 'session-08.mp4', drillId: 'd3', athleteId: 427191, at: '00:44:30', duration: '00:09',
    title: 'Castellanos — first-time cross from the overlap',
    principles: ['Wide Play and Crossing'],
    peaks: { speed: 30.1, acceleration: 4.0, heartRate: 184 }, goals: ['g-overlap-cross'] },
  { id: 'c09', file: 'session-09.mp4', drillId: 'd3', athleteId: 448120, at: '00:47:51', duration: '00:07',
    title: 'McAllister — left-foot finish at the near post',
    principles: ['Finishing'],
    peaks: { speed: 28.4, acceleration: 3.8, heartRate: 186 }, goals: ['g-left-foot', 'g-onside'] },

  /* ---- d4 Counter-press transition */
  { id: 'c10', file: 'session-10.mp4', drillId: 'd4', athleteId: 454521, at: '01:02:16', duration: '00:10',
    title: 'Ferrante — wins it back inside five seconds',
    principles: ['Pressing'],
    peaks: { speed: 29.7, acceleration: 4.6, heartRate: 194 }, goals: ['g-five-second'] },
  { id: 'c11', file: 'session-11.mp4', drillId: 'd4', athleteId: 434584, at: '01:05:48', duration: '00:08',
    title: 'Okonkwo — presses the near shoulder, forces the turnover',
    principles: ['Pressing'],
    peaks: { speed: 31.2, acceleration: 4.4, heartRate: 197 }, goals: ['g-five-second'] },

  /* ---- d5 11v11 phase of play */
  { id: 'c12', file: 'session-12.mp4', drillId: 'd5', athleteId: 162023, at: '01:18:33', duration: '00:14',
    title: 'Fitzgerald — early switch to the free side',
    principles: ['Switching Play', 'Breaking Lines'],
    peaks: { speed: 26.5, acceleration: 3.3, heartRate: 179 }, goals: ['g-switch-early'] },

  /* ---- game clips: not part of this session, gathered by the goals they carry */
  { id: 'c13', file: 'game-01.mp4', drillId: null, athleteId: 448120, at: '00:23:41', duration: '00:11',
    title: 'McAllister — left-foot strike from the edge',
    principles: ['Finishing'],
    peaks: { speed: 27.9, acceleration: 3.7, heartRate: 183 }, goals: ['g-left-foot'],
    source: { type: 'Game', date: '30 Aug 2026', opposition: 'Riverside Athletic (Home)', competition: 'Premier League 2' } },
  { id: 'c14', file: 'game-02.mp4', drillId: null, athleteId: 448120, at: '01:04:09', duration: '00:09',
    title: 'McAllister — left-foot volley, cut back from the right',
    principles: ['Finishing'],
    peaks: { speed: 25.1, acceleration: 3.2, heartRate: 178 }, goals: ['g-left-foot'],
    source: { type: 'Game', date: '16 Aug 2026', opposition: 'Northgate United (Away)', competition: 'Premier League 2' } },
  { id: 'c15', file: 'game-03.mp4', drillId: null, athleteId: 431887, at: '00:12:55', duration: '00:12',
    title: 'Diallo — breaks the press with one pass',
    principles: ['Breaking Lines', 'Forward Passing'],
    peaks: { speed: 23.8, acceleration: 3.0, heartRate: 172 }, goals: ['g-break-line'],
    source: { type: 'Game', date: '30 Aug 2026', opposition: 'Riverside Athletic (Home)', competition: 'Premier League 2' } },
  { id: 'c16', file: 'game-04.mp4', drillId: null, athleteId: 441234, at: '00:58:02', duration: '00:10',
    title: 'Adeyemi — takes the full back on the outside',
    principles: ['Wide Play and Crossing', 'Creating Space'],
    peaks: { speed: 33.6, acceleration: 4.7, heartRate: 192 }, goals: ['g-beat-defender'],
    source: { type: 'Game', date: '23 Aug 2026', opposition: 'Carrick Town (Away)', competition: 'Premier League 2' } },
  { id: 'c17', file: 'game-05.mp4', drillId: null, athleteId: 427191, at: '00:36:27', duration: '00:08',
    title: 'Castellanos — overlap and first-time delivery',
    principles: ['Wide Play and Crossing'],
    peaks: { speed: 31.9, acceleration: 4.2, heartRate: 188 }, goals: ['g-overlap-cross'],
    source: { type: 'Game', date: '30 Aug 2026', opposition: 'Riverside Athletic (Home)', competition: 'Premier League 2' } },
  { id: 'c18', file: 'game-06.mp4', drillId: null, athleteId: 453803, at: '00:71:14', duration: '00:09',
    title: 'Docherty — screens in front of the back four',
    principles: ['Screening'],
    peaks: { speed: 21.7, acceleration: 3.5, heartRate: 175 }, goals: ['g-screen'],
    source: { type: 'Game', date: '16 Aug 2026', opposition: 'Northgate United (Away)', competition: 'Premier League 2' } },
]

/**
 * Where a clip came from. Session clips inherit the session; game clips carry
 * their own source. Development goals and the IDP both print this line, so it
 * is derived once here rather than formatted at each call site.
 */
export const clipSource = clip => clip.source || {
  type: 'Session', date: '21 Sep 2026',
  sessionName: videoSession.title,
  competition: videoSession.sessionType,
}

export const clipSourceLine = clip => {
  const s = clipSource(clip)
  return s.type === 'Game'
    ? `Game · ${s.opposition} · ${s.date}`
    : `Session · ${s.sessionName} · ${s.date}`
}


/* --------------------------------------------------------- participation
   Everyone who took part in each drill. A clip exists for every one of them,
   because that is how the Hudl tag actually works: the analyst cuts the drill
   once and every athlete on the pitch comes back with their own angle of it.
   Yamamoto is out injured, so he is in no drill and has no clips. */
const OUT = 449902

const took_part = ids => ids.filter(id => id !== OUT)

export const DRILL_PARTICIPANTS = {
  d1: took_part([431887, 440316, 454521, 114397, 162023, 427191, 441234, 434584, 448120, 453803, 113734, 440559]),
  d2: took_part([114397, 431887, 453803, 440316, 454521, 162023, 427191, 441234, 114416, 440559]),
  d3: took_part([441234, 427191, 448120, 434584, 454521, 162023, 440559, 431887, 440316, 113734, 114397]),
  d4: took_part([454521, 434584, 431887, 453803, 441234, 448120, 162023, 427191, 114397, 440316, 440559, 114416]),
  d5: took_part([162023, 431887, 114397, 453803, 441234, 434584, 448120, 427191, 440316, 454521, 113734, 440559, 114416]),
}

/* ------------------------------------------------------ generated clips
   The curated clips above are the ones with a story worth writing down. Every
   other participant still gets one, generated so the drill is complete rather
   than a sample of it. Everything is derived from the drill and the athlete, so
   a reload never reshuffles the grid. */

const PHRASES = {
  d1: ['keeps it under pressure', 'plays out of the middle', 'one-touch round the outside',
    'presses in the middle', 'switches the angle'],
  d2: ['finds the pass through', 'holds the line and steps', 'receives between the lines',
    'plays round the block', 'presses the receiver'],
  d3: ['attacks the back post', 'overlaps and delivers', 'holds the width',
    'takes the defender on', 'arrives at the near post'],
  d4: ['first to react on the turnover', 'closes the outlet', 'presses from behind',
    'wins the second ball', 'cuts the switch'],
  d5: ['finds the free side', 'rotates and receives', 'covers behind the press',
    'breaks the line', 'holds shape through the phase'],
}

/** Deterministic pseudo-random in [0,1) from a string — stable across reloads. */
const hash = str => {
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 100000) / 100000
}

const surname = name => String(name).split(',')[0]

/** Seconds into the session at which a drill starts, from the running order. */
const drillStart = drill => videoDrills
  .filter(d => d.order < drill.order)
  .reduce((n, d) => n + d.minutes * 60, 0)

const hhmmss = total => [Math.floor(total / 3600), Math.floor((total % 3600) / 60), Math.floor(total % 60)]
  .map(n => String(n).padStart(2, '0')).join(':')

const generated = videoDrills.flatMap(drill => {
  const ids = DRILL_PARTICIPANTS[drill.id] || []
  return ids
    .filter(id => !CURATED.some(c => c.drillId === drill.id && c.athleteId === id))
    .map((id, i) => {
      const seed = `${drill.id}-${id}`
      const r = hash(seed)
      const athlete = ATHLETES.find(a => a.id === id)
      const phrases = PHRASES[drill.id]
      // Spread the clips across the drill rather than bunching them at the top.
      const at = drillStart(drill) + Math.round((0.1 + 0.8 * ((i + 1) / (ids.length + 1))) * drill.minutes * 60)
      return {
        id: `${drill.id}-${id}`,
        file: `${drill.id}-${String(id).slice(-3)}.mp4`,
        drillId: drill.id,
        athleteId: id,
        at: hhmmss(at),
        duration: `00:${String(7 + Math.floor(r * 9)).padStart(2, '0')}`,
        title: `${surname(athlete?.name || '')} — ${phrases[i % phrases.length]}`,
        principles: drill.principles.slice(0, 2),
        peaks: {
          speed: Math.round((22 + r * 12) * 10) / 10,
          acceleration: Math.round((2.4 + hash(`${seed}a`) * 2.3) * 10) / 10,
          heartRate: Math.round(158 + hash(`${seed}h`) * 42),
        },
        goals: [],
      }
    })
})

export const clips = [...CURATED, ...generated]

/** The clips cut from one drill, in the order they happened. */
export const clipsForDrill = id => clips
  .filter(c => c.drillId === id)
  .sort((a, b) => a.at.localeCompare(b.at))

export const clipById = id => clips.find(c => c.id === id)
export const clipsForGoal = goalId => clips.filter(c => c.goals.includes(goalId))

/** Clips recorded against this session — what the Video tab shows. */
export const sessionClips = clips.filter(c => c.drillId)

/** Athletes with at least one clip in this session, for the Athlete filter. */
export const clippedAthleteIds = [...new Set(sessionClips.map(c => c.athleteId))]

/* ---------------------------------------------------------------- sharing
   Three targets, behind one Share button. Anything else a coach might do with a
   clip — add it to a playlist, tag it to a goal — belongs to the surface that
   owns that thing, not to a share menu. */
export const SHARE_TARGETS = [
  { key: 'link', label: 'Copy link' },
  { key: 'athlete', label: 'Share with athlete' },
  { key: 'staff', label: 'Share with staff' },
]

/* ------------------------------------------------------- distance covered
   The line chart beside the player. Distance is cumulative, so every line
   climbs; what differs between athletes is the rate and where in the clip they
   worked hardest.

   Everything is derived from the drill and the athlete, and expressed as a rate
   in metres per second rather than a fixed set of points. That is what lets the
   chart take its duration from the video: whatever length the media turns out
   to be, the series is sampled across it and the numbers stay sensible. */

/** Metres per second, averaged over the clip. Small-sided work sits near 2 m/s. */
const baseRate = (drillId, athleteId) => 1.55 + hash(`${drillId}-${athleteId}-rate`) * 1.05

/**
 * Six multipliers across the clip, so a line bends instead of running straight.
 * They average out to roughly 1, which keeps the end value near rate x duration.
 */
const shape = (drillId, athleteId) => {
  const k = [0, 1, 2, 3, 4, 5].map(i => 0.55 + hash(`${drillId}-${athleteId}-s${i}`) * 0.95)
  const mean = k.reduce((a, b) => a + b, 0) / k.length
  return k.map(v => v / mean)
}

/** Rate at time t, interpolated between the shape's control points. */
const rateAt = (base, k, t, duration) => {
  const x = (t / Math.max(duration, 0.001)) * (k.length - 1)
  const i = Math.min(Math.floor(x), k.length - 2)
  const f = x - i
  return base * (k[i] * (1 - f) + k[i + 1] * f)
}

export const DISTANCE_LINES = 5

/**
 * One series per athlete for the drill being watched, sampled across the video's
 * duration. The clip's own athlete leads, so the line a coach came for is the
 * first in the legend and never hidden behind the others.
 */
export const distanceSeries = ({ drillId, athleteId, duration, samples = 48, lines = DISTANCE_LINES }) => {
  const pool = DRILL_PARTICIPANTS[drillId] || []
  const ordered = [
    ...(athleteId && pool.includes(athleteId) ? [athleteId] : []),
    ...pool.filter(id => id !== athleteId),
  ].slice(0, lines)

  const step = duration / samples

  return ordered.map(id => {
    const athlete = ATHLETES.find(a => a.id === id)
    const base = baseRate(drillId, id)
    const k = shape(drillId, id)
    const points = []
    let metres = 0
    for (let i = 0; i <= samples; i += 1) {
      const t = i * step
      if (i > 0) metres += rateAt(base, k, t - step / 2, duration) * step
      points.push([t, metres])
    }
    return {
      athleteId: id,
      name: athlete?.name || String(id),
      short: surname(athlete?.name || ''),
      points,
      total: metres,
    }
  })
}

/** Duration in seconds from a "mm:ss" or "hh:mm:ss" fixture string. */
export const toSeconds = str => String(str).split(':').map(Number)
  .reduce((acc, n) => acc * 60 + n, 0)
