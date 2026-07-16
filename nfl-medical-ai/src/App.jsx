import { Routes, Route, Navigate } from 'react-router-dom'
import MedicalLayout from './pages/MedicalLayout'
import Roster from './pages/Roster'
import ReviewQueue from './pages/ReviewQueue'
import InjuryOverview from './pages/InjuryOverview'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/medical/roster" replace />} />
      <Route path="/medical" element={<MedicalLayout />}>
        <Route path="roster" element={<Roster />} />
        <Route path="review-queue" element={<ReviewQueue />} />
        <Route path="injury/:injuryId" element={<InjuryOverview />} />
      </Route>
      <Route path="*" element={<Navigate to="/medical/roster" replace />} />
    </Routes>
  )
}
