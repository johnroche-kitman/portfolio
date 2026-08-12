import { Routes, Route } from 'react-router-dom'
import VersionsLanding from './pages/VersionsLanding'
import PrototypeShell from './pages/PrototypeShell'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<VersionsLanding />} />
      <Route path="/v1" element={<PrototypeShell triggerLocation="nav" />} />
      <Route path="/v2" element={<PrototypeShell triggerLocation="toolbar" />} />
      <Route path="/v3" element={<PrototypeShell triggerLocation="appbar" />} />
    </Routes>
  )
}
