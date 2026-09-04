/**
 * Comments on a clip.
 *
 * A comment is pinned to a moment in the clip, not to the clip as a whole —
 * "here, at eleven seconds" is the whole point of talking about video. The
 * stamp is clip-relative, the same clock the player's readout shows, so it
 * survives whichever recording the clip happens to draw from.
 *
 * Seeded deterministically off the clip id so a clip always opens with the same
 * conversation on it. Anything added in the prototype lives in page state.
 */

const STAFF = [
  { name: 'Tom Hargreaves', role: 'Head Coach' },
  { name: 'Ciara Whelan', role: 'Performance Analyst' },
  { name: 'Marie Nolan', role: 'Goalkeeping Coach' },
]

const BODIES = [
  'Body shape here is the thing to keep. Open before it arrives, not as it arrives.',
  'Look at the distance to the second defender at this point — that is the yard he needs.',
  'This is the picture we drew on Monday. Worth showing him next to the one from the game.',
  'Good decision, wrong weight. Half a yard more and the runner is through.',
  'Hold it here and you can see the whole far side is free.',
  'Third time this session he has taken it on the back foot. Talk it through Thursday.',
  'That is the trigger. Everything after it follows.',
  'Compare this to the Riverside clip — same shape, much quicker off the mark here.',
]

const DATES = ['2 Sep 2026', '1 Sep 2026', '30 Aug 2026', '28 Aug 2026', '22 Sep 2026', '21 Sep 2026']

/** Deterministic bucket from a string, so a clip's thread never reshuffles. */
const bucket = (str, n) => {
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) >>> 8) % n
}

/**
 * The thread on a clip: one to three comments, stamped inside its length.
 *
 * Every clip carries at least one. A real library would have most of them empty
 * — a coach writes on the handful worth arguing about — but a demo where you
 * have to hunt for a clip that has a conversation on it shows the feature
 * badly, so they all do.
 */
export const commentsFor = (clip, span) => {
  if (!clip) return []
  const id = String(clip.id)
  const count = [1, 1, 2, 2, 3][bucket(`${id}-n`, 5)]
  const length = Math.max(span || 0, 1)

  return Array.from({ length: count }, (_, i) => {
    const seed = `${id}-c${i}`
    return {
      id: `cm-${seed}`,
      author: STAFF[bucket(`${seed}-a`, STAFF.length)].name,
      role: STAFF[bucket(`${seed}-a`, STAFF.length)].role,
      date: DATES[bucket(`${seed}-d`, DATES.length)],
      // Kept a little inside the ends: a comment pinned to 0:00 or to the last
      // frame reads as a mistake rather than as a note about a moment.
      at: Math.round((0.12 + 0.66 * (bucket(`${seed}-t`, 100) / 100)) * length),
      body: BODIES[bucket(`${seed}-b`, BODIES.length)],
    }
  }).sort((a, b) => a.at - b.at)
}
