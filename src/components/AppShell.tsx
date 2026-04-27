import { NavLink, Outlet, useLocation, Link, useNavigate } from 'react-router-dom'
import {
  Home, Hash, PlusSquare, MessageSquareHeart, User as UserIcon,
  Sparkles, Rocket, Bot, LogOut, Send, Search,
} from 'lucide-react'
import { useAuth } from '../lib/auth'
import Logo from './Logo'
import Avatar from './Avatar'

type NavItem = {
  to: string
  icon: typeof Home
  label: string
  end?: boolean
}

// Bottom-tab order on mobile (Create is centered/elevated)
const primaryNav: NavItem[] = [
  { to: '/',          icon: Home,              label: 'Feed', end: true },
  { to: '/rooms',     icon: Hash,              label: 'Rooms' },
  { to: '/post',      icon: PlusSquare,        label: 'Create' },
  { to: '/feedback',  icon: MessageSquareHeart, label: 'Feedback' },
  { to: '/profile',   icon: UserIcon,          label: 'Me' },
]

const sidebarExtras: NavItem[] = [
  { to: '/network',  icon: Search,     label: 'Discover builders' },
  { to: '/messages', icon: Send,       label: 'Chats' },
  { to: '/match',    icon: Sparkles,   label: 'Co-founder match' },
  { to: '/startups', icon: Rocket,     label: 'Projects' },
  { to: '/advisor',  icon: Bot,        label: 'AI advisor' },
]

export default function AppShell() {
  const { profile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--color-bg)]">
      {/* ============== Desktop sidebar ============== */}
      <aside className="hidden md:flex md:w-64 lg:w-72 md:flex-col md:border-r md:border-[var(--color-line)] md:bg-white md:fixed md:inset-y-0 md:left-0">
        <div className="px-6 py-6">
          <Logo />
        </div>

        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {primaryNav.map((item) => (
            <SidebarLink key={item.to} {...item} />
          ))}
          <div className="my-3 border-t border-[var(--color-line)]" />
          {sidebarExtras.map((item) => (
            <SidebarLink key={item.to} {...item} />
          ))}
        </nav>

        <div className="p-3 border-t border-[var(--color-line)]">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-zinc-50 transition">
            <Link to="/profile" className="flex items-center gap-3 min-w-0 flex-1">
              <Avatar src={profile?.photoURL} name={profile?.displayName} size={36} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate">{profile?.displayName}</div>
                <div className="text-xs text-zinc-500 truncate">{profile?.email}</div>
              </div>
            </Link>
            <button
              onClick={() => signOut()}
              title="Sign out"
              className="size-8 grid place-items-center rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ============== Mobile top bar ============== */}
      <header className="md:hidden sticky top-0 z-30 bg-white/85 backdrop-blur-lg border-b border-[var(--color-line)] safe-top">
        <div className="flex items-center justify-between px-4 h-14">
          <Logo small />
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate('/network')}
              className="size-10 grid place-items-center rounded-full text-zinc-700 hover:bg-zinc-100"
              title="Discover builders"
            >
              <Search className="size-5" />
            </button>
            <button
              onClick={() => navigate('/messages')}
              className="size-10 grid place-items-center rounded-full text-zinc-700 hover:bg-zinc-100"
              title="Chats"
            >
              <Send className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ============== Main content ============== */}
      <main className="flex-1 md:ml-64 lg:ml-72 pb-20 md:pb-10">
        <div
          key={location.pathname}
          className="animate-fade-in-up max-w-2xl mx-auto px-0 md:px-6 py-0 md:py-8"
        >
          <Outlet />
        </div>
      </main>

      {/* ============== Mobile bottom nav ============== */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-lg border-t border-[var(--color-line)] safe-bottom">
        <div className="grid grid-cols-5 max-w-md mx-auto">
          {primaryNav.map((item, idx) => {
            const isCenter = idx === 2
            const { to, icon: Icon, label, end } = item
            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 py-2.5 tap text-[10px] font-medium transition ${
                    isActive ? 'text-[var(--color-ink)]' : 'text-zinc-400'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isCenter ? (
                      <span className={`grid place-items-center size-9 rounded-xl transition ${
                        isActive ? 'bg-foundry text-white shadow-md' : 'bg-zinc-100 text-zinc-700'
                      }`}>
                        <Icon className="size-5" strokeWidth={2.2} />
                      </span>
                    ) : (
                      <Icon
                        className="size-6"
                        strokeWidth={isActive ? 2.5 : 1.8}
                        fill={isActive ? 'currentColor' : 'none'}
                      />
                    )}
                    <span className={isActive ? 'text-[var(--color-ink)]' : ''}>{label}</span>
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

function SidebarLink({ to, icon: Icon, label, end }: NavItem) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `group flex items-center gap-4 px-3 py-3 rounded-xl text-[15px] transition ${
          isActive
            ? 'bg-zinc-100 text-zinc-900 font-semibold'
            : 'text-zinc-700 hover:bg-zinc-50 font-medium'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className="size-6 shrink-0"
            strokeWidth={isActive ? 2.4 : 1.8}
            fill={isActive ? 'currentColor' : 'none'}
          />
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  )
}
