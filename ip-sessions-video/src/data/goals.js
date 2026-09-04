/**
 * Development goals.
 *
 * A goal is set once for the season and then referenced from two places: the
 * Development goals tab on every event the athlete is selected for, and their
 * individual development plan. Both read this file, so a goal's wording, its
 * principle and its evidence cannot disagree between the two.
 *
 * The catalogue holds the wording; `athleteGoals` holds one athlete's instance
 * of it, with their own progress and their own coach commentary.
 */
import {
  GAMES, clips, drillById, principleLabel, seeded, videoDrills, videoSession, windowFor,
} from './video'

/** The review the goals were set under — the chip on every goal row. */
export const GOAL_PLAN = '2026/27 Development Plan'

export const GOAL_TYPES = [GOAL_PLAN, 'Individual Learning Plan']

export const goalCatalogue = [
  {
    id: 'g-left-foot', title: 'Improve shooting with the left foot', principle: 'Finishing',
    description: 'Strike cleanly with the left foot from inside the box, first time and after a set touch, without shifting the ball back onto the right.',
  },
  {
    id: 'g-break-line', title: 'Break the first line with a forward pass', principle: 'Breaking Lines',
    description: 'Find the pass through or past the opposition’s first pressing line rather than playing square, and take it when it is on.',
  },
  {
    id: 'g-half-turn', title: 'Receive on the half turn under pressure', principle: 'Ball Retention',
    description: 'Open the body before the ball arrives so the first touch already faces forward, with a defender close enough to matter.',
  },
  {
    id: 'g-five-second', title: 'Win the ball back within five seconds', principle: 'Pressing',
    description: 'React to the turnover immediately and either regain the ball or force it backwards inside five seconds of losing it.',
  },
  {
    id: 'g-overlap-cross', title: 'Cross first time from the overlap', principle: 'Wide Play and Crossing',
    description: 'Arrive on the overlap at pace and deliver first time, rather than taking a touch and letting the box get organised.',
  },
  {
    id: 'g-screen', title: 'Screen the space in front of the back four', principle: 'Screening',
    description: 'Hold the position between the ball and the centre backs, cut the pass into the striker, and delay rather than dive in.',
  },
  {
    id: 'g-switch-early', title: 'Switch play early to the free side', principle: 'Switching Play',
    description: 'Recognise the overload against you and move the ball to the free side in one or two passes, before the press arrives.',
  },
  {
    id: 'g-beat-defender', title: 'Drive past the first defender', principle: 'Creating Space',
    description: 'Attack the full back one on one and commit them, going outside as readily as inside.',
  },
  {
    id: 'g-onside', title: 'Time the run to stay onside', principle: 'Creating Space',
    description: 'Hold the run until the pass is played, so the movement in behind starts level rather than early.',
  },
  {
    id: 'g-back-post', title: 'Defend the back post on crosses', principle: 'Wide Play and Crossing',
    description: 'Take the back-post responsibility on every delivery, seeing the ball and the runner rather than one or the other.',
  },
  {
    id: 'g-rotate-out', title: 'Rotate out of the full back position to build the overload', principle: 'Rotations',
    description: 'Read when to go outside the winger and when to come inside, so the wide area always has two against one.',
  },
  {
    id: 'g-third-man', title: 'Combine through the third man', principle: 'Forward Passing',
    description: 'Use the bounce pass to release a runner rather than trying to play the final ball yourself.',
  },
  {
    id: 'g-first-touch-forward', title: 'Take the first touch forward', principle: 'Forward Passing',
    description: 'Set the first touch into space ahead rather than under the feet, so the second touch is already a pass or a shot.',
  },
  {
    id: 'g-press-trigger', title: 'Recognise the press trigger and lead it', principle: 'Pressing',
    description: 'Start the press on the agreed cue — a backward pass, a poor touch, a pass into a covered player — and take the line with you.',
  },
  {
    id: 'g-body-shape', title: 'Scan before receiving', principle: 'Ball Retention',
    description: 'Check both shoulders before the ball arrives, so the decision is already made when it does.',
  },
  {
    id: 'g-command-box', title: 'Command the box on set pieces', principle: 'Screening',
    description: 'Claim or clear everything inside the six-yard box, and make the call early enough that the defenders hear it.',
  },
  {
    id: 'g-distribution', title: 'Play out under pressure from goal kicks', principle: 'Forward Passing',
    description: 'Keep the ball on the ground against a high press, using the free centre back or the drop into midfield.',
  },
  {
    id: 'g-sweeper', title: 'Defend the space behind the back four', principle: 'Screening',
    description: 'Read the through ball early and start the sweep before the striker turns, not after.',
  },
]

export const goalById = id => goalCatalogue.find(g => g.id === id)

/**
 * Three goals per athlete for the season. `notes` is the coach's running
 * commentary, newest first — the same list the IDP appends to.
 */
export const athleteGoals = [
  { athleteId: 113734, goalId: 'g-command-box', status: 'On track', notes: [
    { date: '30 Aug 2026', author: 'Marie Nolan', body: 'Much louder on the two corners against Riverside. Claimed both under contact.' },
    { date: '11 Aug 2026', author: 'Marie Nolan', body: 'Starting position still a yard too deep on the near-post delivery. Working on it in the GK block on Wednesdays.' },
  ] },
  { athleteId: 113734, goalId: 'g-distribution', status: 'Needs work', notes: [
    { date: '23 Aug 2026', author: 'Marie Nolan', body: 'Went long three times in the first half at Carrick when the free centre back was available. Reviewed the clips with him Monday.' },
  ] },
  { athleteId: 113734, goalId: 'g-sweeper', status: 'On track', notes: [] },

  { athleteId: 440559, goalId: 'g-overlap-cross', status: 'On track', notes: [
    { date: '1 Sep 2026', author: 'Tom Hargreaves', body: 'Timing of the run has improved. Still arriving a beat late when the winger takes an extra touch.' },
  ] },
  { athleteId: 440559, goalId: 'g-rotate-out', status: 'Needs work', notes: [] },
  { athleteId: 440559, goalId: 'g-back-post', status: 'On track', notes: [] },

  { athleteId: 114416, goalId: 'g-break-line', status: 'Needs work', notes: [
    { date: '25 Aug 2026', author: 'Tom Hargreaves', body: 'Adductor has limited him to passing patterns only for a fortnight, so hold judgement on this one until he is back in 11v11.' },
  ] },
  { athleteId: 114416, goalId: 'g-back-post', status: 'On track', notes: [] },
  { athleteId: 114416, goalId: 'g-body-shape', status: 'On track', notes: [] },

  { athleteId: 114397, goalId: 'g-break-line', status: 'On track', notes: [
    { date: '2 Sep 2026', author: 'Tom Hargreaves', body: 'Three line-breaking passes in the 6v4 on Monday, all into the ten. Best he has looked on this.' },
    { date: '18 Aug 2026', author: 'Tom Hargreaves', body: 'Sees the pass but takes a touch too many before playing it. Asked him to play on the second touch in the middle-third drill.' },
  ] },
  { athleteId: 114397, goalId: 'g-back-post', status: 'Achieved', notes: [
    { date: '30 Aug 2026', author: 'Tom Hargreaves', body: 'Consistent across four games now. Marking this one as achieved and rolling the focus into the aerial duel target.' },
  ] },
  { athleteId: 114397, goalId: 'g-body-shape', status: 'On track', notes: [] },

  { athleteId: 162023, goalId: 'g-switch-early', status: 'On track', notes: [
    { date: '21 Sep 2026', author: 'Tom Hargreaves', body: 'The switch in the phase of play was exactly the picture we asked for — one touch, weight on the front foot of the winger.' },
  ] },
  { athleteId: 162023, goalId: 'g-overlap-cross', status: 'Needs work', notes: [] },
  { athleteId: 162023, goalId: 'g-rotate-out', status: 'On track', notes: [] },

  { athleteId: 427191, goalId: 'g-overlap-cross', status: 'On track', notes: [
    { date: '30 Aug 2026', author: 'Tom Hargreaves', body: 'First-time delivery from the overlap against Riverside was the clearest example yet. Sent him the clip.' },
    { date: '12 Aug 2026', author: 'Tom Hargreaves', body: 'Still taking the touch inside before crossing. Two reps a session in the wide overload drill.' },
  ] },
  { athleteId: 427191, goalId: 'g-beat-defender', status: 'Needs work', notes: [] },
  { athleteId: 427191, goalId: 'g-rotate-out', status: 'On track', notes: [] },

  { athleteId: 431887, goalId: 'g-break-line', status: 'Achieved', notes: [
    { date: '2 Sep 2026', author: 'Tom Hargreaves', body: 'Splitting the pivots is now the first thing he looks for rather than the last. Two clear examples in the session, one in the game.' },
    { date: '30 Aug 2026', author: 'Ciara Whelan', body: 'GPS shows he is getting on the ball 18% more often in the middle third than in July, which is the movement we wanted alongside this.' },
  ] },
  { athleteId: 431887, goalId: 'g-half-turn', status: 'On track', notes: [
    { date: '21 Sep 2026', author: 'Tom Hargreaves', body: 'Body shape in the rondo is good when the pressure comes from behind. Still square when it comes across him.' },
  ] },
  { athleteId: 431887, goalId: 'g-switch-early', status: 'Needs work', notes: [] },

  { athleteId: 440316, goalId: 'g-half-turn', status: 'On track', notes: [
    { date: '21 Sep 2026', author: 'Tom Hargreaves', body: 'Received and played through on the half turn twice in the rondo. Clip tagged.' },
  ] },
  { athleteId: 440316, goalId: 'g-third-man', status: 'Needs work', notes: [] },
  { athleteId: 440316, goalId: 'g-first-touch-forward', status: 'On track', notes: [] },

  { athleteId: 453803, goalId: 'g-screen', status: 'On track', notes: [
    { date: '21 Sep 2026', author: 'Tom Hargreaves', body: 'Position between the ball and the centre backs was right all the way through the 6v4, and the interception came from holding rather than diving in.' },
    { date: '16 Aug 2026', author: 'Tom Hargreaves', body: 'At Northgate he screened well for 60 minutes and then got dragged wide twice late on. Fitness, not reading.' },
  ] },
  { athleteId: 453803, goalId: 'g-press-trigger', status: 'Needs work', notes: [] },
  { athleteId: 453803, goalId: 'g-body-shape', status: 'On track', notes: [] },

  { athleteId: 454521, goalId: 'g-five-second', status: 'On track', notes: [
    { date: '21 Sep 2026', author: 'Tom Hargreaves', body: 'Regained inside three seconds in the counter-press drill. Peak acceleration on that clip was the highest of the session.' },
  ] },
  { athleteId: 454521, goalId: 'g-third-man', status: 'On track', notes: [] },
  { athleteId: 454521, goalId: 'g-half-turn', status: 'Needs work', notes: [] },

  { athleteId: 441234, goalId: 'g-beat-defender', status: 'On track', notes: [
    { date: '1 Sep 2026', author: 'Tom Hargreaves', body: 'Going outside as often as inside now, which was the whole point of setting this. 33.6 km/h on the Carrick clip.' },
    { date: '5 Aug 2026', author: 'Tom Hargreaves', body: 'Every one-on-one this month has gone inside onto his right. Needs to threaten the outside to make the inside work.' },
  ] },
  { athleteId: 441234, goalId: 'g-onside', status: 'Needs work', notes: [] },
  { athleteId: 441234, goalId: 'g-five-second', status: 'On track', notes: [] },

  { athleteId: 434584, goalId: 'g-five-second', status: 'On track', notes: [
    { date: '21 Sep 2026', author: 'Tom Hargreaves', body: 'Pressed the near shoulder and forced the turnover — the exact cue from the video session.' },
  ] },
  { athleteId: 434584, goalId: 'g-beat-defender', status: 'Needs work', notes: [] },
  { athleteId: 434584, goalId: 'g-onside', status: 'On track', notes: [] },

  { athleteId: 448120, goalId: 'g-left-foot', status: 'On track', notes: [
    { date: '30 Aug 2026', author: 'Tom Hargreaves', body: 'The strike from the edge against Riverside is the first time he has gone left foot in a game without shifting it. Big step.' },
    { date: '21 Aug 2026', author: 'Tom Hargreaves', body: 'Ten reps of left-foot finishing after every session for the last three weeks. Contact is cleaner, decision is still slow.' },
    { date: '2 Aug 2026', author: 'Tom Hargreaves', body: 'Set at the start of the season. He shifts the ball back onto the right almost every time inside the box.' },
  ] },
  { athleteId: 448120, goalId: 'g-onside', status: 'Needs work', notes: [
    { date: '23 Aug 2026', author: 'Tom Hargreaves', body: 'Two offsides at Carrick, both a stride early. Reviewing the timing against the last defender rather than the ball.' },
  ] },
  { athleteId: 448120, goalId: 'g-half-turn', status: 'Needs work', notes: [] },

  { athleteId: 449902, goalId: 'g-onside', status: 'On track', notes: [] },
  { athleteId: 449902, goalId: 'g-first-touch-forward', status: 'On track', notes: [
    { date: '18 Aug 2026', author: 'Tom Hargreaves', body: 'First touch is going forward in the finishing block but still under the feet when he is tired.' },
  ] },
  { athleteId: 449902, goalId: 'g-press-trigger', status: 'Needs work', notes: [] },

  /* U18 — plans are set, but the analyst has not started tagging clips against
     them yet, which is the state most squads are in at this point of a season. */
  { athleteId: 460102, goalId: 'g-break-line', status: 'Needs work', notes: [
    { date: '28 Aug 2026', author: 'Dev Sharma', body: 'Comfortable on the ball, but the first look is always sideways. Set this as the headline goal for the year.' },
  ] },
  { athleteId: 460102, goalId: 'g-back-post', status: 'On track', notes: [] },
  { athleteId: 460102, goalId: 'g-body-shape', status: 'On track', notes: [] },

  { athleteId: 460105, goalId: 'g-half-turn', status: 'On track', notes: [] },
  { athleteId: 460105, goalId: 'g-third-man', status: 'Needs work', notes: [] },
  { athleteId: 460105, goalId: 'g-first-touch-forward', status: 'On track', notes: [] },

  { athleteId: 460107, goalId: 'g-onside', status: 'Needs work', notes: [
    { date: '20 Aug 2026', author: 'Dev Sharma', body: 'Five offsides in three games. The movement is right, the timing is not.' },
  ] },
  { athleteId: 460107, goalId: 'g-left-foot', status: 'Needs work', notes: [] },
  { athleteId: 460107, goalId: 'g-first-touch-forward', status: 'On track', notes: [] },

  /* U16 */
  { athleteId: 470203, goalId: 'g-body-shape', status: 'On track', notes: [] },
  { athleteId: 470203, goalId: 'g-first-touch-forward', status: 'Needs work', notes: [] },
  { athleteId: 470203, goalId: 'g-half-turn', status: 'Needs work', notes: [] },

  { athleteId: 470205, goalId: 'g-left-foot', status: 'Needs work', notes: [] },
  { athleteId: 470205, goalId: 'g-onside', status: 'On track', notes: [] },
  { athleteId: 470205, goalId: 'g-beat-defender', status: 'On track', notes: [] },
]

export const GOAL_STATUSES = ['On track', 'Needs work', 'Achieved']

/* ---------------------------------------------------------------- evidence
   The clips filed against one athlete's goal.

   The hand-written tags in `video.js` are the ones with a story worth telling,
   but a goal set in August and reviewed in September should have gathered more
   than one. The rest are generated: the athlete's own session clips where the
   drill worked the goal's principle, plus game clips drawn across the season's
   fixtures. Everything derives from the athlete and the goal, so a reload never
   reshuffles a plan.

   Each generated clip carries its own window into the recording, so it plays
   its own stretch rather than the whole file. */

const SESSION_PHRASES = [
  'works the picture in the drill', 'gets it right under pressure', 'repeats it on the far side',
  'holds the detail late in the drill', 'first look is the right one',
]

const GAME_PHRASES = [
  'the same picture in the game', 'takes it into the game', 'holds up against a real press',
  'under pressure in the second half', 'from the first phase',
]

const secs = t => `00:${String(t).padStart(2, '0')}`

const hhmmss = total => [Math.floor(total / 3600), Math.floor((total % 3600) / 60), Math.floor(total % 60)]
  .map(n => String(n).padStart(2, '0')).join(':')

const surname = name => String(name).split(',')[0]

/** A generated clip filed against one athlete's goal. */
const evidenceClip = ({ athleteId, athleteName, goal, index, fromGame }) => {
  const seed = `${athleteId}-${goal.id}-${index}`
  const r = seeded(seed)
  const length = 20 + Math.floor(seeded(`${seed}-len`) * 30)
  const drill = videoDrills[Math.floor(seeded(`${seed}-drill`) * videoDrills.length)]
  const game = GAMES[Math.floor(seeded(`${seed}-game`) * GAMES.length)]
  const phrases = fromGame ? GAME_PHRASES : SESSION_PHRASES

  return {
    id: `ev-${seed}`,
    file: `ev-${seed}.mp4`,
    drillId: fromGame ? null : drill.id,
    athleteId,
    at: hhmmss(Math.floor(r * (fromGame ? 5400 : 5000)) + 120),
    duration: secs(length),
    title: `${surname(athleteName)} — ${phrases[index % phrases.length]}`,
    principles: [goal.principle],
    peaks: {
      speed: Math.round((21 + r * 13) * 10) / 10,
      acceleration: Math.round((2.3 + seeded(`${seed}-a`) * 2.4) * 10) / 10,
      heartRate: Math.round(155 + seeded(`${seed}-h`) * 45),
    },
    goals: [goal.id],
    window: windowFor(seed, length),
    ...(fromGame ? { source: { type: 'Game', ...game } } : {}),
  }
}

/**
 * Five to eight clips per goal, mixed session and game, with the hand-written
 * ones first so the moments that were actually chosen lead the evidence.
 */
const evidenceFor = (athleteId, athleteName, goal) => {
  const tagged = clips.filter(c => c.athleteId === athleteId && c.goals.includes(goal.id))
  const want = 5 + Math.floor(seeded(`${athleteId}-${goal.id}-n`) * 4)
  const extra = []
  for (let i = 0; extra.length + tagged.length < want; i += 1) {
    // Alternate, starting with a game clip: a plan that was all training
    // footage would not be evidence a coach could argue from.
    extra.push(evidenceClip({
      athleteId, athleteName, goal, index: i, fromGame: i % 2 === 0,
    }))
  }
  return [...tagged, ...extra]
}

/** An athlete's goals, resolved against the catalogue and their evidence. */
export const goalsForAthlete = (athleteId, athleteName = '') =>
  athleteGoals
    .filter(g => g.athleteId === athleteId)
    .map(g => {
      const goal = goalById(g.goalId)
      return {
        ...g,
        ...goal,
        clips: evidenceFor(athleteId, athleteName, goal),
      }
    })

/** Athletes who have goals, in the order the squad list shows them. */
export const goalAthleteIds = [...new Set(athleteGoals.map(g => g.athleteId))]

/** Clips tagged to one athlete's instance of a goal. */
export const clipsForAthleteGoal = (athleteId, goalId) =>
  clips.filter(c => c.athleteId === athleteId && c.goals.includes(goalId))

/** Only this session's clips for a goal — what a session page should show. */
export const sessionClipsForGoal = (athleteId, goalId) =>
  clips.filter(c => c.athleteId === athleteId && c.goals.includes(goalId) && c.drillId)
