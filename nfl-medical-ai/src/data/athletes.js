export const athletes = [
  {
    id: 'ath-george-frederick',
    name: 'George Frederick',
    position: 'Wide receiver',
    photoUrl: null,
    status: 'Out',
    statusDuration: '34 days',
    allergies: ['Aspirin', 'Cedar'],
  },
  {
    id: 'ath-felix-andrew',
    name: 'Felix Andrew',
    position: 'Cornerback',
    photoUrl: null,
    status: 'Limited',
    statusDuration: '34 days',
    allergies: ['Banana'],
  },
  {
    id: 'ath-brian-charles',
    name: 'Brian Charles',
    position: 'Tight end',
    photoUrl: null,
    status: 'Out',
    statusDuration: '34 days',
    allergies: ['Aspirin', 'Cedar'],
  },
  {
    id: 'ath-adam-benjamin',
    name: 'Adam Benjamin',
    position: 'Safety',
    photoUrl: null,
    status: 'Out',
    statusDuration: '34 days',
    allergies: ['Banana'],
  },
  {
    id: 'ath-tyler-held',
    name: 'Tyler Held',
    position: 'Linebacker',
    photoUrl: null,
    status: 'Available',
    statusDuration: null,
    allergies: [],
  },
  {
    id: 'ath-marcus-lee',
    name: 'Marcus Lee',
    position: 'Running back',
    photoUrl: null,
    status: 'Available',
    statusDuration: null,
    allergies: [],
  },
]

export function findAthleteByName(name, list = athletes) {
  if (!name) return null
  const normalized = name.trim().toLowerCase()
  return (
    list.find((athlete) => athlete.name.toLowerCase() === normalized) ||
    list.find((athlete) => athlete.name.toLowerCase().includes(normalized)) ||
    list.find((athlete) =>
      normalized
        .split(' ')
        .filter(Boolean)
        .every((part) => athlete.name.toLowerCase().includes(part))
    ) ||
    null
  )
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Scans free-form dictation for a known athlete's name, rather than trying to
// extract a name span first. This is far more robust for real voice input,
// which is often all-lowercase and doesn't reliably use a fixed connector
// word like "for" (e.g. "add note to tyler held ankle sprain...").
export function findAthleteMention(text, list = athletes) {
  const lower = (text || '').toLowerCase()
  if (!lower) return null

  // Allows an optional possessive suffix ("tyler held's" / "tyler helds",
  // the latter being a common dictation artifact that drops the apostrophe).
  const byFullName = list.find((athlete) =>
    new RegExp(`\\b${escapeRegExp(athlete.name.toLowerCase())}'?s?\\b`).test(lower)
  )
  if (byFullName) return byFullName

  return (
    list.find((athlete) => {
      const parts = athlete.name.toLowerCase().split(' ').filter(Boolean)
      return parts.length > 1 && parts.every((part) => new RegExp(`\\b${escapeRegExp(part)}'?s?\\b`).test(lower))
    }) || null
  )
}
