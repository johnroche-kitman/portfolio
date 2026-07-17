// Pure data helpers for the AI-generated "injury summary" feature. Kept
// separate from React components so the same computation backs both the
// on-screen modal (JSX) and the standalone Export document (HTML string).

export function parseDate(value) {
  if (!value) return null
  const d = value instanceof Date ? value : new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

export function daysBetween(from, to) {
  const start = parseDate(from)
  const end = parseDate(to)
  if (!start || !end) return null
  return Math.round((end.getTime() - start.getTime()) / 86400000)
}

export function sortInjuriesDesc(injuries) {
  return [...injuries].sort((a, b) => {
    const da = parseDate(a.date)?.getTime() ?? 0
    const db = parseDate(b.date)?.getTime() ?? 0
    return db - da
  })
}

// Groups items by keyFn's result into pie-chart-ready { label, value } counts,
// falling back to a shared bucket for missing/unrecorded values.
export function groupCounts(items, keyFn, fallbackLabel = 'Not recorded') {
  const counts = new Map()
  items.forEach((item) => {
    const key = keyFn(item) || fallbackLabel
    counts.set(key, (counts.get(key) || 0) + 1)
  })
  return Array.from(counts.entries()).map(([label, value]) => ({ label, value }))
}

export function buildInjurySummary(athlete, injuries, rehabByInjury) {
  const athleteInjuries = injuries.filter((inj) => inj.athleteId === athlete.id && inj.status !== 'pending_review')
  const sorted = sortInjuriesDesc(athleteInjuries)
  const openCount = sorted.filter((inj) => !inj.resolved).length

  const rows = sorted.map((injury) => {
    const rehabSessions = (rehabByInjury[injury.id] || []).slice().sort((a, b) => (a.date < b.date ? 1 : -1))
    return { injury, rehabSessions, rehabSessionCount: rehabSessions.length }
  })

  return {
    athlete,
    injuries: rows,
    totalCount: sorted.length,
    openCount,
    resolvedCount: sorted.length - openCount,
    mostRecentDate: sorted[0]?.date || null,
    typeBreakdown: groupCounts(sorted, (inj) => inj.classification || inj.pathology || inj.label),
    severityBreakdown: groupCounts(sorted, (inj) => inj.severity),
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

function renderInjuryHtml(row) {
  const { injury, rehabSessions, rehabSessionCount } = row

  const diagnosticsHtml = injury.diagnostics?.length
    ? injury.diagnostics.map((d) => `<p>${escapeHtml(d.date)} &mdash; ${escapeHtml(d.name)}: ${escapeHtml(d.result)}</p>`).join('')
    : '<p class="muted">No diagnostics recorded</p>'

  let surgeryHtml = ''
  if (injury.surgery) {
    surgeryHtml = `<p><strong>${escapeHtml(injury.surgery.procedure)}</strong> &mdash; ${escapeHtml(injury.surgery.date)}</p>`
    if (!injury.resolved) {
      surgeryHtml += `<p class="flag">Day ${daysBetween(injury.surgery.date, new Date())} post-surgery</p>`
    } else if (injury.resolvedDate) {
      surgeryHtml += `<p class="flag-ok">Recovery period: ${daysBetween(injury.surgery.date, injury.resolvedDate)} days</p>`
    }
  }

  const rehabHtml = rehabSessionCount
    ? rehabSessions
        .map((s) => `<p>${escapeHtml(s.date)} &mdash; ${s.exercises.length} exercise${s.exercises.length === 1 ? '' : 's'}</p>`)
        .join('')
    : '<p class="muted">No rehab sessions recorded</p>'

  const medsHtml = injury.medications?.length
    ? injury.medications
        .map(
          (m) =>
            `<p>${escapeHtml(m.name)} ${escapeHtml(m.dosage)}, ${escapeHtml(m.frequency)} (${escapeHtml(m.startDate)}${
              m.endDate ? ` &ndash; ${escapeHtml(m.endDate)}` : ' &ndash; ongoing'
            })</p>`
        )
        .join('')
    : '<p class="muted">No medications recorded</p>'

  return `
    <section class="injury-card">
      <div class="injury-header">
        <div>
          <h3>${escapeHtml(injury.pathology || injury.label)}</h3>
          <p class="muted">${escapeHtml(injury.date)}${injury.side ? ` &middot; ${escapeHtml(injury.side)}` : ''}${
    injury.bodyArea ? ` &middot; ${escapeHtml(injury.bodyArea)}` : ''
  }</p>
        </div>
        <div class="tags">
          <span class="tag">${escapeHtml(injury.severity || 'Not recorded')}</span>
          <span class="tag ${injury.resolved ? 'tag-success' : 'tag-error'}">${injury.resolved ? 'Resolved' : 'Open'}</span>
        </div>
      </div>
      <div class="injury-body">
        <div><h4>Diagnostics</h4>${diagnosticsHtml}</div>
        ${surgeryHtml ? `<div><h4>Surgery</h4>${surgeryHtml}</div>` : ''}
        <div><h4>Rehab sessions (${rehabSessionCount})</h4>${rehabHtml}</div>
        <div><h4>Medications</h4>${medsHtml}</div>
      </div>
    </section>
  `
}

function renderPieLegendHtml(title, data) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const rows = data.length
    ? data.map((d) => `<li>${escapeHtml(d.label)} &mdash; ${d.value} (${total ? Math.round((d.value / total) * 100) : 0}%)</li>`).join('')
    : '<li class="muted">No data recorded</li>'
  return `<div><h4>${escapeHtml(title)}</h4><ul>${rows}</ul></div>`
}

export function buildSummaryHtmlDocument(athlete, summary, generatedOn) {
  const injuriesHtml = summary.injuries.map(renderInjuryHtml).join('')

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${escapeHtml(athlete.name)} - Injury summary</title>
<style>
  body { font-family: 'Open Sans', Arial, sans-serif; color: #1f2d44; max-width: 800px; margin: 32px auto; padding: 0 16px; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  h2 { font-size: 18px; margin-top: 32px; }
  h3 { font-size: 15px; margin: 0; }
  h4 { font-size: 13px; margin: 12px 0 4px; color: #3b4960; }
  p { margin: 2px 0; font-size: 13px; }
  .muted { color: #5f7089; }
  .flag { color: #7a5300; font-weight: 600; }
  .flag-ok { color: #28a745; font-weight: 600; }
  .subtitle { color: #5f7089; font-size: 13px; margin-bottom: 24px; }
  .stats { display: flex; gap: 24px; background: #f1f2f3; border-radius: 8px; padding: 16px; margin-bottom: 24px; }
  .stat-value { font-size: 20px; font-weight: 600; }
  .stat-label { font-size: 12px; color: #5f7089; }
  .injury-card { border: 1px solid #3b49601f; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
  .injury-header { display: flex; justify-content: space-between; align-items: flex-start; }
  .injury-body { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; border-top: 1px solid #3b49601f; padding-top: 12px; }
  .tags { display: flex; gap: 6px; }
  .tag { background: #f1f2f3; color: #3b4960; border-radius: 4px; padding: 2px 8px; font-size: 11px; font-weight: 600; white-space: nowrap; }
  .tag-success { background: #e5f4ea; color: #28a745; }
  .tag-error { background: #fbe6e7; color: #c31d2b; }
  ul { margin: 4px 0; padding-left: 18px; font-size: 13px; }
  .pies { display: flex; gap: 48px; margin-top: 16px; flex-wrap: wrap; }
</style>
</head>
<body>
  <h1>${escapeHtml(athlete.name)} &mdash; Injury summary</h1>
  <p class="subtitle">${escapeHtml(athlete.position)} &middot; Generated ${escapeHtml(generatedOn)}</p>

  <div class="stats">
    <div><div class="stat-value">${summary.totalCount}</div><div class="stat-label">Total injuries</div></div>
    <div><div class="stat-value">${summary.openCount}</div><div class="stat-label">Currently open</div></div>
    <div><div class="stat-value">${summary.resolvedCount}</div><div class="stat-label">Resolved</div></div>
    <div><div class="stat-value" style="font-size:16px">${escapeHtml(summary.mostRecentDate || '—')}</div><div class="stat-label">Most recent</div></div>
  </div>

  <h2>Injury history</h2>
  ${injuriesHtml}

  <h2>Statistics</h2>
  <div class="pies">
    ${renderPieLegendHtml('Types of injuries', summary.typeBreakdown)}
    ${renderPieLegendHtml('Severity', summary.severityBreakdown)}
  </div>
</body>
</html>`
}
