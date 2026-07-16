import { findAthleteByName } from '../data/athletes'
import { extractAthleteNameMention, todayLabel } from './textHelpers'

const BODY_PARTS = {
  ankle: { area: 'Ankle/foot', landmarks: ['atfl', 'cfl', 'deltoid ligament', 'syndesmosis'] },
  foot: { area: 'Ankle/foot', landmarks: ['lisfranc'] },
  knee: { area: 'Knee', landmarks: ['acl', 'mcl', 'pcl', 'meniscus', 'lcl'] },
  shoulder: { area: 'Upper limb', landmarks: ['ac joint', 'labrum', 'rotator cuff'] },
  elbow: { area: 'Upper limb', landmarks: ['ucl'] },
  wrist: { area: 'Upper limb', landmarks: [] },
  hand: { area: 'Upper limb', landmarks: [] },
  finger: { area: 'Upper limb', landmarks: [] },
  hamstring: { area: 'Lower leg', landmarks: [] },
  quad: { area: 'Lower leg', landmarks: [] },
  quadricep: { area: 'Lower leg', landmarks: [] },
  calf: { area: 'Lower leg', landmarks: [] },
  groin: { area: 'Hip/groin', landmarks: [] },
  hip: { area: 'Hip/groin', landmarks: ['labrum'] },
  back: { area: 'Spine', landmarks: ['lumbar', 'disc'] },
  neck: { area: 'Spine', landmarks: ['cervical'] },
  head: { area: 'Neuro', landmarks: ['concussion'] },
}

const MECHANISM_VERBS = [
  { pattern: /sprain(ed)?/i, noun: 'sprain', classification: 'Ligament sprain' },
  { pattern: /strain(ed)?/i, noun: 'strain', classification: 'Muscle strain' },
  { pattern: /tore|torn|tear(ed)?/i, noun: 'tear', classification: 'Soft tissue tear' },
  { pattern: /fractur(ed|e)|broke|broken/i, noun: 'fracture', classification: 'Bone fracture' },
  { pattern: /dislocat(ed|ion)/i, noun: 'dislocation', classification: 'Joint dislocation' },
  { pattern: /bruis(ed|e)|contusion/i, noun: 'contusion', classification: 'Contusion' },
  { pattern: /hyperextend(ed)?/i, noun: 'hyperextension', classification: 'Hyperextension injury' },
]

const CONTACT_CUES = /\b(block(ing|ed)?|tackl(ing|ed)?|collid(ing|ed)|hit|struck|contact|collision)\b/i
const NON_CONTACT_CUES = /\b(cutting|planting|twist(ing|ed)|landing|jumping|sprinting|running|pivot(ing|ed))\b/i

const SYMPTOMS = [
  { pattern: /swelling|swollen/i, label: 'Swelling' },
  { pattern: /decreased range of motion|limited range of motion|reduced range of motion/i, label: 'Decreased range of motion' },
  { pattern: /\bpain\b/i, label: 'Pain' },
  { pattern: /tender(ness)?/i, label: 'Tenderness' },
  { pattern: /instability|unstable/i, label: 'Instability' },
  { pattern: /numb(ness)?/i, label: 'Numbness' },
  { pattern: /tingl(ing|e)/i, label: 'Tingling' },
  { pattern: /weak(ness)?/i, label: 'Weakness' },
  { pattern: /\block(ing)?\b/i, label: 'Locking' },
]

function findBodyPart(text) {
  for (const key of Object.keys(BODY_PARTS)) {
    if (new RegExp(`\\b${key}\\b`, 'i').test(text)) return key
  }
  return null
}

function findLandmark(text, bodyPart) {
  const candidates = bodyPart ? BODY_PARTS[bodyPart].landmarks : Object.values(BODY_PARTS).flatMap((b) => b.landmarks)
  for (const landmark of candidates) {
    if (new RegExp(`\\b${landmark}\\b`, 'i').test(text)) return landmark.toUpperCase()
  }
  return null
}

function findMechanism(text) {
  return MECHANISM_VERBS.find((m) => m.pattern.test(text)) || null
}

function findSide(text) {
  const match = text.match(/\b(left|right)\b/i)
  return match ? match[1][0].toUpperCase() + match[1].slice(1).toLowerCase() : null
}

function findSessionType(text) {
  const match = text.match(/\b(practice|game|walkthrough|training|scrimmage)\b/i)
  return match ? match[1].toLowerCase() : null
}

function findActivity(text) {
  const match = text.match(/while ([a-z]+ing[^,.]*)/i)
  if (!match) return null
  const clause = match[1].trim()
  return clause.charAt(0).toUpperCase() + clause.slice(1)
}

function findMechanismType(text) {
  if (CONTACT_CUES.test(text)) return 'contact'
  if (NON_CONTACT_CUES.test(text)) return 'non-contact'
  return null
}

function findSymptoms(text) {
  return SYMPTOMS.filter((s) => s.pattern.test(text)).map((s) => s.label)
}

function findRemovedFromParticipation(text) {
  return /removed from (the )?(practice|game|session|field)/i.test(text)
}

export function parseInjuryDictation(text, { athletes } = { athletes: [] }) {
  const trimmed = (text || '').trim()
  const athleteName = extractAthleteNameMention(trimmed)
  const athlete = findAthleteByName(athleteName, athletes)

  const bodyPart = findBodyPart(trimmed)
  const landmark = bodyPart ? findLandmark(trimmed, bodyPart) : findLandmark(trimmed, null)
  const mechanism = findMechanism(trimmed)
  const side = findSide(trimmed)
  const sessionType = findSessionType(trimmed)
  const activity = findActivity(trimmed)
  const mechanismType = findMechanismType(trimmed)
  const symptoms = findSymptoms(trimmed)
  const removedFromParticipation = findRemovedFromParticipation(trimmed)
  const reportedImmediately = /\btoday\b/i.test(trimmed)

  const mechanismNoun = mechanism?.noun || 'injury'
  let pathology = null
  if (landmark) {
    pathology = `${landmark} ${mechanismNoun}`
  } else if (bodyPart) {
    pathology = `${side ? side + ' ' : ''}${bodyPart} ${mechanismNoun}`
  }

  const missingFields = []
  if (!athlete) missingFields.push('Athlete')
  if (!bodyPart) missingFields.push('Body part')
  if (!side) missingFields.push('Side')
  if (!mechanismType) missingFields.push('Mode of onset')

  const today = todayLabel()
  const eventLabel = sessionType
    ? `${sessionType.charAt(0).toUpperCase() + sessionType.slice(1)}, ${reportedImmediately ? 'today' : today}`
    : null

  return {
    rawText: trimmed,
    noteText: trimmed,
    athleteId: athlete?.id || null,
    athleteName: athlete?.name || athleteName,
    athleteMatched: !!athlete,
    bodyPart,
    bodyArea: bodyPart ? BODY_PARTS[bodyPart].area : null,
    side,
    landmark,
    mechanismNoun,
    classification: mechanism?.classification || null,
    pathology,
    activity,
    mechanismType,
    sessionType,
    eventLabel,
    removedFromParticipation,
    reportedImmediately,
    symptoms,
    missingFields,
    injuryDate: today,
    examinationDate: today,
  }
}
