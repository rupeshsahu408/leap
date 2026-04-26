import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Home, Users, PlusCircle, MessageCircle, User } from 'lucide-react'
import { useAuth } from '../lib/auth'
import Logo from './Logo'

const navItems = [
  { to: '/', icon: Home, label: 'Feed', end: true },
  { to: '/network', icon: Users, label: 'Network' },
  { to: '/post', icon: PlusCircle, label: 'Post' },
  { to: '/messages', icon: MessageCircle, label: 'Chats' },
  { to: '/profile', icon: User, label: 'Me' },
]

export default function AppShell() {
  const { profile, signOut } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--color-bg)]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-[var(--color-line)] md:bg-white">
        <div className="px-6 py-6">
          <Logo />
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`
              }
            >
              <Icon className="size-5" strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-[var(--color-line)]">
          <div className="flex items-center gap-3 px-2 py-2">
            {profile?.photoURL ? (
              <img
                src={profile.photoURL}
                alt=""
                className="size-9 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="size-9 rounded-full bg-brand-100 text-brand-700 grid place-items-center font-semibold">
                {profile?.displayName?.[0]?.toUpperCase() ?? 'F'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{profile?.displayName}</div>
              <div className="text-xs text-zinc-500 truncate">{profile?.email}</div>
            </div>
            <button
              onClick={() => signOut()}
              className="text-xs text-zinc-500 hover:text-zinc-900"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-[var(--color-line)]">
        <div className="flex items-center justify-between px-4 h-14">
          <Logo small />
          <button
            onClick={() => signOut()}
            className="text-xs text-zinc-500"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-20 md:pb-0">
        <div key={location.pathname} className="animate-fade-in-up max-w-2xl mx-auto px-4 py-6 md:py-10">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-white/95 backdrop-blur border-t border-[var(--color-line)]">
        <div className="grid grid-cols-5">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium ${
                  isActive ? 'text-brand-600' : 'text-zinc-500'
                }`
              }
            >
              <Icon className="size-5" strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
