import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Platform from './pages/Platform'
import Locations from './pages/Locations'
import Institutions from './pages/Institutions'
import Community from './pages/Community'
import Contact from './pages/Contact'

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/platform" element={<Platform />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/institutions" element={<Institutions />} />
        <Route path="/community" element={<Community />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
