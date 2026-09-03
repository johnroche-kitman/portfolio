import {
  Accordion, AccordionDetails, AccordionSummary, Box, Chip, Divider, Paper,
  Link, Table, TableBody, TableCell, TableHead, TableRow, Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import colors from '../../theme/tokens'
import AppShell from '../../components/AppShell'
import { PageHeader, SectionLabel, SettingsCard } from '../admin/parts'
import { AREAS, CONVENTIONS, ENVIRONMENT } from '../../data/buildguide'

/** Component names read as code, so they get a monospace chip rather than a label chip. */
const CodeChip = ({ label, tone }) => (
  <Chip
    size="small" label={label}
    sx={{
      height: 22, fontSize: 12, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      bgcolor: tone === 'icon' ? colors.neutral_200 : `${colors.blue_100}1f`,
      color: tone === 'icon' ? colors.grey_200 : colors.blue_100,
    }}
  />
)

const ChipRow = ({ label, items, tone }) => (
  <Box sx={{ display: 'flex', gap: 1, mb: 1.5, alignItems: 'baseline', flexWrap: 'wrap' }}>
    <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: 96, flexShrink: 0 }}>
      {label}
    </Typography>
    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
      {items.map(i => <CodeChip key={i} label={i} tone={tone} />)}
    </Box>
  </Box>
)

function Surface({ s }) {
  return (
    <Accordion
      disableGutters variant="outlined"
      sx={{ borderColor: colors.neutral_300, '&::before': { display: 'none' } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, flexWrap: 'wrap', pr: 2 }}>
          <Typography variant="subtitle2">{s.title}</Typography>
          <Typography variant="caption"
            sx={{ color: 'text.secondary', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
            {s.route}
          </Typography>
          {s.custom && <Chip size="small" label="not MUI" sx={{ height: 20, fontSize: 11, bgcolor: colors.orange_200, color: colors.white }} />}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <Typography variant="body2" sx={{ mb: 2 }}>{s.what}</Typography>

        <ChipRow label="MUI" items={s.mui} />
        {s.icons && <ChipRow label="Icons" items={s.icons.map(i => `${i}Icon`)} tone="icon" />}
        {s.custom && (
          <Box sx={{ display: 'flex', gap: 1, mb: 1.5, alignItems: 'baseline' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: 96, flexShrink: 0 }}>
              Hand-built
            </Typography>
            <Typography variant="body2">{s.custom}</Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />
        <Box component="ul" sx={{ m: 0, pl: 2.5, '& li': { mb: 1 } }}>
          {s.notes.map((n, i) => (
            <Typography key={i} component="li" variant="body2">{n}</Typography>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

/**
 * An alternative worth weighing before building the area by hand. Sits above the
 * surfaces because the decision comes first.
 */
function Option({ o }) {
  return (
    <Paper
      variant="outlined"
      sx={{ borderColor: colors.neutral_300, borderLeft: `3px solid ${colors.orange_200}`, p: 3, mb: 2.5 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, flexWrap: 'wrap', mb: 1 }}>
        <Typography variant="subtitle1">{o.title}</Typography>
        <Chip size="small" label={o.status}
          sx={{ height: 20, fontSize: 11, bgcolor: colors.orange_200, color: colors.white }} />
      </Box>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{o.intro}</Typography>

      <Box component="dl" sx={{ m: 0 }}>
        {o.points.map(([term, def]) => (
          <Box key={term} sx={{ mb: 1.5 }}>
            <Typography component="dt" variant="subtitle2">{term}</Typography>
            <Typography component="dd" variant="body2" sx={{ m: 0, color: 'text.secondary' }}>{def}</Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" sx={{ mb: 1.5 }}>
        <Box component="span" sx={{ fontWeight: 700 }}>Verdict. </Box>{o.verdict}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {o.links.map(([label, href]) => (
          <Link key={href} href={href} target="_blank" rel="noopener" variant="body2">{label}</Link>
        ))}
      </Box>
    </Paper>
  )
}


export default function BuildGuide() {
  return (
    <AppShell title="Surface build info">
      <PageHeader title="Surface build info" />

      <Box sx={{ px: 3, pb: 6, maxWidth: 1040 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, mb: 3 }}>
          Every surface in this prototype, the MUI components it is made of, and the things that cost
          time when you build it for real. Where something is hand-built rather than MUI, it says so —
          that is where the estimate hides.
        </Typography>

        <SettingsCard title="Environment">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Package</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ENVIRONMENT.map(([pkg, version, note]) => (
                <TableRow key={pkg}>
                  <TableCell sx={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{pkg}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{version}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SettingsCard>

        <SettingsCard title="Conventions that apply everywhere"
          description="Six rules this codebase holds to. Breaking them is what makes a converted page look unconverted.">
          <Box component="dl" sx={{ m: 0 }}>
            {CONVENTIONS.map(([term, def]) => (
              <Box key={term} sx={{ mb: 1.5 }}>
                <Typography component="dt" variant="subtitle2">{term}</Typography>
                <Typography component="dd" variant="body2" sx={{ m: 0, color: 'text.secondary' }}>{def}</Typography>
              </Box>
            ))}
          </Box>
        </SettingsCard>

        {AREAS.map(area => (
          <Box key={area.id}>
            <SectionLabel>{area.name}</SectionLabel>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{area.blurb}</Typography>

            {area.option && <Option o={area.option} />}

            <Paper variant="outlined" sx={{ borderColor: colors.neutral_300, p: 2, mb: 2.5 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Where it lives</Typography>
              <Box component="ul" sx={{ m: 0, mt: 1, pl: 2.5, '& li': { mb: 0.5 } }}>
                {area.files.map(([path, note]) => (
                  <Typography key={path} component="li" variant="body2">
                    <Box component="span" sx={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                      {path}
                    </Box>
                    <Box component="span" sx={{ color: 'text.secondary' }}> — {note}</Box>
                  </Typography>
                ))}
              </Box>
            </Paper>

            {area.surfaces.map(s => <Surface key={s.title} s={s} />)}
          </Box>
        ))}
      </Box>
    </AppShell>
  )
}
