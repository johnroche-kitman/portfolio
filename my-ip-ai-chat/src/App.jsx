import { Routes, Route } from 'react-router-dom'
import VersionsLanding from './pages/VersionsLanding'
import PrototypeShell from './pages/PrototypeShell'
import AnimationTests from './pages/AnimationTests'
import IconOptions from './pages/IconOptions'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<VersionsLanding />} />
      <Route path="/v1" element={<PrototypeShell triggerLocation="nav" />} />
      <Route path="/v2" element={<PrototypeShell triggerLocation="toolbar" />} />
      <Route path="/v3" element={<PrototypeShell triggerLocation="appbar" />} />
      <Route path="/icon-options" element={<IconOptions />} />
      <Route path="/animation-tests" element={<AnimationTests />} />
    </Routes>
  )
}
