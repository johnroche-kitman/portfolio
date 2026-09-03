import {
  Box, TextField, ToggleButton, ToggleButtonGroup, Tooltip,
} from '@mui/material'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import colors from '../theme/tokens'

const MARKS = [
  ['bold', 'Bold', FormatBoldIcon],
  ['italic', 'Italic', FormatItalicIcon],
  ['underline', 'Underline', FormatUnderlinedIcon],
  ['strike', 'Strikethrough', StrikethroughSIcon],
  ['bullet', 'Bulleted list', FormatListBulletedIcon],
  ['number', 'Numbered list', FormatListNumberedIcon],
]

/**
 * MUI has no rich text editor, and this is the one place in the prototype where
 * that is a real gap rather than a preference. The toolbar is a genuine MUI
 * ToggleButtonGroup over a multiline TextField; a production build would put
 * TipTap or Lexical behind it and keep this chrome.
 */
export default function RichTextField({ label, minRows = 4, value, onChange, marks = [], onMarks }) {
  return (
    <Box>
      <TextField
        fullWidth multiline minRows={minRows} label={label} value={value} onChange={onChange}
        InputProps={{ sx: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}
      />
      <ToggleButtonGroup
        size="small" value={marks} onChange={(_, v) => onMarks?.(v)} aria-label={`${label || 'Text'} formatting`}
        sx={{ bgcolor: colors.neutral_200, borderRadius: '0 0 4px 4px', width: '100%',
          '& .MuiToggleButton-root': { border: 0, borderRadius: 0, py: 0.5 } }}
      >
        {MARKS.map(([v, title, Icon]) => (
          <ToggleButton key={v} value={v} aria-label={title}>
            <Tooltip title={title}><Icon fontSize="small" /></Tooltip>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  )
}
