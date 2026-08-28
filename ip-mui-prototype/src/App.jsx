import { Navigate, Route, Routes } from 'react-router-dom'
import MedicalRosters from './pages/medical/MedicalRosters'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/medical/rosters" replace />} />
      <Route path="/medical/rosters" element={<MedicalRosters />} />
      <Route path="*" element={<MedicalRosters />} />
    </Routes>
  )
}
