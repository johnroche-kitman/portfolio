import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#3b4960',
      dark: '#172b4d',
    },
    secondary: {
      main: '#f1f2f3',
    },
    error: {
      main: '#c31d2b',
    },
    warning: {
      main: '#ffab00',
    },
    text: {
      primary: '#3b4960',
      secondary: '#5f7089',
    },
    divider: '#3b49601f',
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: "'Open Sans', 'Helvetica Neue', Arial, sans-serif",
    h1: { fontWeight: 600, fontSize: 28 },
    h2: { fontWeight: 600, fontSize: 20, lineHeight: '24px' },
    body1: { fontWeight: 400, fontSize: 14, lineHeight: '20px' },
    body2: { fontWeight: 400, fontSize: 13, lineHeight: '18px' },
    button: {
      fontWeight: 600,
      fontSize: 14,
      lineHeight: '24px',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 6,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
})
