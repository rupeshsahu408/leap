import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth'
import { ReactNode } from 'react'

import SignIn from './pages/SignIn'
import Onboarding from './pages/Onboarding'
import Feed from './pages/Feed'
import Compose from './pages/Compose'
import Tag from './pages/Tag'
import Profile from './pages/Profile'
import Network from './pages/Network'
import UserProfile from './pages/UserProfile'
import Messages from './pages/Messages'
import Conversation from './pages/Conversation'
import Startups from './pages/Startups'
import StartupNew from './pages/StartupNew'
import StartupView from './pages/StartupView'
import StartupEdit from './pages/StartupEdit'
import Match from './pages/Match'
import AppShell from './components/AppShell'

function Loading() {
  return (
    <div className="h-full grid place-items-center text-zinc-500 text-sm">
      Loading…
    </div>
  )
}

function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <Loading />
  if (!user) return <Navigate to="/signin" replace />
  return <>{children}</>
}

function RequireOnboarded({ children }: { children: ReactNode }) {
  const { profile, loading } = useAuth()
  if (loading) return <Loading />
  if (!profile?.onboarded) return <Navigate to="/onboarding" replace />
  return <>{children}</>
}

function PublicOnly({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <Loading />
  if (user) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/signin" element={<PublicOnly><SignIn /></PublicOnly>} />
          <Route
            path="/onboarding"
            element={
              <Protected>
                <Onboarding />
              </Protected>
            }
          />
          <Route
            path="/"
            element={
              <Protected>
                <RequireOnboarded>
                  <AppShell />
                </RequireOnboarded>
              </Protected>
            }
          >
            <Route index element={<Feed />} />
            <Route path="post" element={<Compose />} />
            <Route path="tag/:tag" element={<Tag />} />
            <Route path="network" element={<Network />} />
            <Route path="u/:uid" element={<UserProfile />} />
            <Route path="messages" element={<Messages />} />
            <Route path="messages/:id" element={<Conversation />} />
            <Route path="startups" element={<Startups />} />
            <Route path="startups/new" element={<StartupNew />} />
            <Route path="startups/:id" element={<StartupView />} />
            <Route path="startups/:id/edit" element={<StartupEdit />} />
            <Route path="match" element={<Match />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
