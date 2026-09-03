import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import IdpList from './pages/idp/IdpList'
import IdpAthlete from './pages/idp/IdpAthlete'

export default function App() {
  // Keyed on the path so moving to another route clears a caught error.
  const { pathname } = useLocation()
  return (
    <ErrorBoundary resetKey={pathname}>
      <Routes>
        <Route path="/" element={<Navigate to="/individual_development_plans" replace />} />
        <Route path="/individual_development_plans" element={<IdpList />} />
        <Route path="/individual_development_plans/:id" element={<IdpAthlete />} />
        <Route path="*" element={<Navigate to="/individual_development_plans" replace />} />
      </Routes>
    </ErrorBoundary>
  )
}
