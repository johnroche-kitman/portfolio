import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import MedicalRosters from './pages/medical/MedicalRosters'
import MedicalAthlete from './pages/medical/MedicalAthlete'
import InjuryRecord from './pages/medical/InjuryRecord'
import CalendarPage from './pages/calendar/CalendarPage'
import EventEditor from './pages/events/EventEditor'
import SessionDetail from './pages/events/SessionDetail'
import GameDetail from './pages/events/GameDetail'
import EventDetail from './pages/events/EventDetail'
import SessionImporter from './pages/events/SessionImporter'
import ComponentLibrary from './pages/library/ComponentLibrary'
import BuildGuide from './pages/help/BuildGuide'
import BenchmarkReport from './pages/analysis/BenchmarkReport'
import Submissions from './pages/forms/Submissions'
import BenchmarkValidation from './pages/forms/BenchmarkValidation'
import GrowthMaturation from './pages/forms/GrowthMaturation'
import CoachingLibrary from './pages/planning/CoachingLibrary'
import PlanningLibrary from './pages/planning/PlanningLibrary'
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
import { benchmarkSubmissions, importerSubmissions } from './data/forms'
import ErrorBoundary from './components/ErrorBoundary'

export default function App() {
  // Keyed on the path so moving to another route clears a caught error.
  const { pathname } = useLocation()
  return (
    <ErrorBoundary resetKey={pathname}>
    <Routes>
      <Route path="/" element={<Navigate to="/calendar" replace />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/events/new" element={<EventEditor />} />
      <Route path="/events/:id/edit" element={<EventEditor />} />
      <Route path="/events/:id" element={<EventDetail />} />
      <Route path="/sessions/:id" element={<SessionDetail />} />
      <Route path="/games/:id" element={<GameDetail />} />
      <Route path="/mass_upload/event_data" element={<SessionImporter />} />
      <Route path="/medical/rosters" element={<MedicalRosters />} />
      <Route path="/medical/athletes/:id" element={<MedicalAthlete />} />
      <Route path="/medical/athletes/:athleteId/illnesses/:id" element={<InjuryRecord />} />

      <Route path="/analysis/benchmark_report" element={<BenchmarkReport />} />

      {/* Forms */}
      <Route path="/benchmark/test_validation" element={<BenchmarkValidation />} />
      <Route path="/benchmark/league_benchmarking"
        element={<Submissions title="League benchmarking" rows={benchmarkSubmissions} showSource />} />
      <Route path="/data_importer"
        element={<Submissions title="Data importer" rows={importerSubmissions} />} />
      <Route path="/growth_and_maturation" element={<GrowthMaturation />} />

      {/* Planning */}
      <Route path="/planning_hub/coaching_library" element={<CoachingLibrary />} />
      <Route path="/planning_hub/settings" element={<PlanningLibrary />} />

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
      <Route path="/help" element={<BuildGuide />} />
      <Route path="*" element={<CalendarPage />} />
    </Routes>
    </ErrorBoundary>
  )
}
