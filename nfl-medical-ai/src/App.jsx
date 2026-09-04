import { Routes, Route, Navigate } from 'react-router-dom'
import DemoLanding from './pages/DemoLanding'
import MobileDemo from './pages/MobileDemo'
import MedicalLayout from './pages/MedicalLayout'
import Squad from './pages/Squad'
import ReviewQueue from './pages/ReviewQueue'
import InjuryOverview from './pages/InjuryOverview'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DemoLanding />} />
      <Route path="/mobile" element={<MobileDemo />} />
      <Route path="/medical" element={<MedicalLayout />}>
        <Route path="squad" element={<Squad />} />
        <Route path="review-queue" element={<ReviewQueue />} />
        <Route path="injury/:injuryId" element={<InjuryOverview />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
