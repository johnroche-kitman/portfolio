import { Component } from 'react'
import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material'
import RefreshIcon from '@mui/icons-material/RefreshOutlined'

/**
 * Error boundaries have to be class components: there is no hook equivalent.
 *
 * Without one, a single bad render takes the whole app down to a white screen,
 * which is what a chip trying to render an object did to the Coaching library.
 * Wrapped, the failure is contained to the region it happened in and the rest of
 * the page stays usable.
 *
 * `resetKey` clears the error when it changes, so navigating to another route
 * recovers without a reload.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // A real build would report this. Logging keeps it findable in the console
    // rather than swallowing it, which is the failure mode of a silent boundary.
    console.error('Caught by ErrorBoundary:', error, info.componentStack)
  }

  componentDidUpdate(prev) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) {
      this.setState({ error: null })
    }
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    const { label = 'this page', compact } = this.props

    return (
      <Box sx={{ p: compact ? 2 : 3 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" startIcon={<RefreshIcon />}
              onClick={() => this.setState({ error: null })}>
              Try again
            </Button>
          }
        >
          <AlertTitle>Something went wrong in {label}</AlertTitle>
          <Typography variant="body2" sx={{ mb: compact ? 0 : 1 }}>
            The rest of the prototype is still working. Use the navigation to move elsewhere,
            or try again.
          </Typography>
          <Typography variant="caption"
            sx={{ display: 'block', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
            {String(error.message || error)}
          </Typography>
        </Alert>
      </Box>
    )
  }
}
