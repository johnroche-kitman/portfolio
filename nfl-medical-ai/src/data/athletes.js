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

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Allows an optional possessive suffix ("tyler held's" / "tyler helds", the
// latter being a common dictation artifact that drops the apostrophe).
function wordMatches(token, lower) {
  return new RegExp(`\\b${escapeRegExp(token)}'?s?\\b`).test(lower)
}

// Scans free-form text (dictation or a typed chat reply) for a known
// athlete, rather than trying to extract a name span first — far more
// robust for real voice input, which is often all-lowercase and doesn't
// reliably use a fixed connector word like "for".
//
// Falls back from a full-name match, to a "both name parts present"
// match, down to a single name part alone ("Tyler" / "Held") so a bare
// first or last name resolves without requiring the full name — but only
// when it's unambiguous. Returns:
//   { athlete }              exactly one match
//   { candidates: [...] }    2+ roster athletes share that mention
//   null                     no match at all
export function resolveAthleteMatch(text, list = athletes) {
  const lower = (text || '').trim().toLowerCase()
  if (!lower) return null

  const byFullName = list.filter((athlete) => wordMatches(athlete.name.toLowerCase(), lower))
  if (byFullName.length === 1) return { athlete: byFullName[0] }
  if (byFullName.length > 1) return { candidates: byFullName }

  const byAllParts = list.filter((athlete) => {
    const parts = athlete.name.toLowerCase().split(' ').filter(Boolean)
    return parts.length > 1 && parts.every((part) => wordMatches(part, lower))
  })
  if (byAllParts.length === 1) return { athlete: byAllParts[0] }
  if (byAllParts.length > 1) return { candidates: byAllParts }

  const byAnyPart = list.filter((athlete) => {
    const parts = athlete.name.toLowerCase().split(' ').filter(Boolean)
    return parts.some((part) => wordMatches(part, lower))
  })
  if (byAnyPart.length === 1) return { athlete: byAnyPart[0] }
  if (byAnyPart.length > 1) return { candidates: byAnyPart }

  return null
}
