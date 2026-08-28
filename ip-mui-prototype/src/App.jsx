import { Navigate, Route, Routes } from 'react-router-dom'
import MedicalRosters from './pages/medical/MedicalRosters'
import CalendarPage from './pages/calendar/CalendarPage'
import EventEditor from './pages/events/EventEditor'
import SessionDetail from './pages/events/SessionDetail'
import ComponentLibrary from './pages/library/ComponentLibrary'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/calendar" replace />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/events/new" element={<EventEditor />} />
      <Route path="/events/:id" element={<EventEditor />} />
      <Route path="/sessions/:id" element={<SessionDetail />} />
      <Route path="/medical/rosters" element={<MedicalRosters />} />
      <Route path="/library" element={<ComponentLibrary />} />
      <Route path="*" element={<CalendarPage />} />
    </Routes>
  )
}
