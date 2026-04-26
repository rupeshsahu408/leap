import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ReactNode } from 'react'

import Home from './pages/Home'
import Platform from './pages/Platform'
import Locations from './pages/Locations'
import Institutions from './pages/Institutions'
import Community from './pages/Community'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AIAdvisor from './pages/AIAdvisor'
import CoFounders from './pages/CoFounders'
import Ideas from './pages/Ideas'
import MyCourses from './pages/MyCourses'
import Profile from './pages/Profile'

function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)', color: 'var(--text-secondary)' }}>
      Loading…
    </div>
  )
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/platform" element={<Platform />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/institutions" element={<Institutions />} />
        <Route path="/community" element={<Community />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard */}
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/dashboard/ai-advisor" element={<Protected><AIAdvisor /></Protected>} />
        <Route path="/dashboard/ideas" element={<Protected><Ideas /></Protected>} />
        <Route path="/dashboard/cofounders" element={<Protected><CoFounders /></Protected>} />
        <Route path="/dashboard/courses" element={<Protected><MyCourses /></Protected>} />
        <Route path="/dashboard/profile" element={<Protected><Profile /></Protected>} />
      </Routes>
    </BrowserRouter>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
