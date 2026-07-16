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
