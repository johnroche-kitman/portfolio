import { createTheme } from '@mui/material/styles'
import colors from './tokens'

// Reproduces kitman-frontend packages/playbook/themes/index.js (rootTheme).
// Defaults are deliberately identical so anything built here lifts into the
// real app without restyling. Deviations are commented.
export const theme = createTheme({
  palette: {
    primary: {
      main: colors.grey_200,
      dark: colors.grey_400,
      light: colors.grey_100,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.neutral_200,
      dark: colors.neutral_400,
      light: colors.neutral_100,
      contrastText: colors.grey_200,
    },
    error: {
      main: colors.red_200,
      dark: colors.red_300,
      light: colors.red_100,
      contrastText: colors.white,
    },
    warning: {
      main: colors.orange_200,
      dark: colors.orange_300,
      light: colors.orange_100,
      contrastText: colors.white,
    },
    info: {
      main: colors.grey_200,
      dark: colors.grey_400,
      light: colors.grey_100,
      contrastText: colors.white,
    },
    success: {
      main: colors.green_200,
      dark: colors.green_300,
      light: colors.green_100,
      contrastText: colors.white,
    },
    text: {
      primary: colors.grey_200,
      secondary: colors.grey_100,
      disabled: colors.grey_disabled,
    },
    background: {
      default: colors.white,
      paper: colors.white,
    },
    divider: colors.neutral_300,
    common: { white: colors.white, black: colors.grey_200 },
  },

  typography: {
    fontFamily: `"Open Sans", system-ui, -apple-system, sans-serif`,
    h1: { fontSize: 96 },
    h2: { fontSize: 60 },
    h3: { fontSize: 48 },
    h4: { fontSize: 34 },
    h5: { fontSize: 24, fontWeight: 700 },
    h6: { fontSize: 20, fontWeight: 700 },
    // subtitle1 is the card title across settings and detail pages; subtitle2 the
    // sub-heading inside one. Weights live here so pages never restate them.
    subtitle1: { fontSize: 16, fontWeight: 700 },
    subtitle2: { fontSize: 14, fontWeight: 700 },
    body1: { fontSize: 16 },
    body2: { fontSize: 14 },
    caption: { fontSize: 12 },
    overline: { fontSize: 12, fontWeight: 700, letterSpacing: '0.08em' },
    button: { textTransform: 'none' },
  },

  components: {
    // rootTheme defaults, reproduced exactly
    MuiButton: {
      defaultProps: {
        color: 'primary',
        size: 'medium',
        variant: 'contained',
        disableElevation: true,
      },
    },
    MuiButtonGroup: {
      defaultProps: { color: 'primary', orientation: 'horizontal', variant: 'contained' },
    },
    MuiCheckbox: { defaultProps: { color: 'primary', size: 'medium' } },
    MuiRadio: { defaultProps: { color: 'primary', size: 'medium' } },
    MuiSwitch: { defaultProps: { color: 'primary', size: 'medium' } },
    MuiFormControl: { defaultProps: { fullWidth: true, size: 'medium', variant: 'filled' } },
    MuiSelect: { defaultProps: { size: 'small', variant: 'filled' } },
    MuiTextField: { defaultProps: { size: 'small', variant: 'filled' } },
    MuiToggleButton: { defaultProps: { size: 'medium' } },
    MuiToggleButtonGroup: { defaultProps: { size: 'medium' } },
    MuiAvatar: { defaultProps: { variant: 'circular' } },
    MuiBadge: { defaultProps: { color: 'default', variant: 'standard' } },

    // Measured off the live app: filled inputs keep the underline, so the top two
    // corners are rounded and the bottom edge is a rule — 1px at rest, 2px in
    // primary on focus. Every select and text field in iP reads this way.
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: colors.neutral_200,
          borderRadius: '4px 4px 0 0',
          '&:hover': { backgroundColor: colors.neutral_300 },
          '&.Mui-focused': { backgroundColor: colors.neutral_200 },
          '&::before': { borderBottom: `1px solid ${colors.grey_150}` },
          '&:hover:not(.Mui-disabled, .Mui-error)::before': { borderBottom: `1px solid ${colors.grey_200}` },
          '&::after': { borderBottom: `2px solid ${colors.grey_200}` },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: { fontSize: 14, borderColor: colors.neutral_200 },
        head: { fontSize: 12, fontWeight: 700, color: colors.grey_150, borderColor: colors.neutral_300 },
      },
    },

    // Tabs measured live in iP: 40px min height, 2px indicator in brand navy.
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 40 },
        indicator: { height: 2, backgroundColor: colors.grey_200 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 40,
          fontSize: 14,
          fontWeight: 500,
          textTransform: 'none',
          color: colors.grey_100,
          '&.Mui-selected': { color: colors.grey_200 },
        },
      },
    },

    MuiDataGrid: {
      styleOverrides: {
        root: { border: `1px solid ${colors.neutral_300}`, fontSize: 14 },
        columnHeaders: { borderBottom: `1px solid ${colors.neutral_300}` },
        columnHeaderTitle: { fontWeight: 600, fontSize: 13 },
        cell: { borderBottom: `1px solid ${colors.neutral_300}` },
      },
    },
  },
})

export default theme
