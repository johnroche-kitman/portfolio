import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from './theme/muiTheme'
import { AppDataProvider } from './state/AppDataContext'
import App from './App'
import './styles/design-tokens.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppDataProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </AppDataProvider>
    </ThemeProvider>
  </React.StrictMode>
)
