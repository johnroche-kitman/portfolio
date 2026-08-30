import { Navigate, Route, Routes } from 'react-router-dom'
import MedicalRosters from './pages/medical/MedicalRosters'
import CalendarPage from './pages/calendar/CalendarPage'
import EventEditor from './pages/events/EventEditor'
import SessionDetail from './pages/events/SessionDetail'
import ComponentLibrary from './pages/library/ComponentLibrary'
import ManageAthletes from './pages/admin/ManageAthletes'
import NewAthlete from './pages/admin/NewAthlete'
import ManageStaffUsers from './pages/admin/ManageStaffUsers'
import UserForm from './pages/admin/UserForm'
import UserProfile from './pages/admin/UserProfile'
import ManageGames from './pages/admin/ManageGames'
import OrgSettings from './pages/admin/OrgSettings'
import Labels from './pages/admin/Labels'
import AthleteGroups from './pages/admin/AthleteGroups'
import NewAthleteGroup from './pages/admin/NewAthleteGroup'
import StockManagement from './pages/admin/StockManagement'
import { Exports, Imports } from './pages/admin/Transfers'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/calendar" replace />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/events/new" element={<EventEditor />} />
      <Route path="/events/:id" element={<EventEditor />} />
      <Route path="/sessions/:id" element={<SessionDetail />} />
      <Route path="/medical/rosters" element={<MedicalRosters />} />

      {/* Administration */}
      <Route path="/administration/athletes" element={<ManageAthletes />} />
      <Route path="/administration/athletes/new" element={<NewAthlete />} />
      <Route path="/users" element={<ManageStaffUsers />} />
      <Route path="/users/new" element={<UserForm />} />
      <Route path="/users/:id/edit" element={<UserForm />} />
      <Route path="/user_profile/edit" element={<UserProfile />} />
      <Route path="/fixtures" element={<ManageGames />} />
      <Route path="/administration/organisation/edit" element={<OrgSettings />} />
      <Route path="/administration/labels/manage" element={<Labels />} />
      <Route path="/administration/groups" element={<AthleteGroups />} />
      <Route path="/administration/groups/new" element={<NewAthleteGroup />} />
      <Route path="/administration/imports" element={<Imports />} />
      <Route path="/administration/exports" element={<Exports />} />
      <Route path="/stock_management" element={<StockManagement />} />

      <Route path="/library" element={<ComponentLibrary />} />
      <Route path="*" element={<CalendarPage />} />
    </Routes>
  )
}
