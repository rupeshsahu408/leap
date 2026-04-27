import { NavLink, Outlet, useLocation, Link, useNavigate } from 'react-router-dom'
import {
  Home, Search, PlusSquare, Heart, Send, Compass, MessageCircle,
  Sparkles, Rocket, Bot, LogOut, Hash, MessageSquareHeart,
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

// Instagram-style sidebar — feels like one tall list
const sidebarMain: NavItem[] = [
  { to: '/',          icon: Home,              label: 'Home', end: true },
  { to: '/rooms',     icon: Compass,           label: 'Rooms' },
  { to: '/network',   icon: Search,            label: 'Discover' },
  { to: '/messages',  icon: Send,              label: 'Messages' },
  { to: '/feedback',  icon: MessageSquareHeart, label: 'Feedback' },
  { to: '/post',      icon: PlusSquare,        label: 'Create' },
]

const sidebarExtras: NavItem[] = [
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
      <aside className="hidden md:flex md:w-64 lg:w-72 md:flex-col md:border-r md:border-[var(--color-line)] md:bg-white md:fixed md:inset-y-0 md:left-0 z-20">
        <div className="px-7 pt-7 pb-5">
          <Link to="/" aria-label="Foundry — Home" className="inline-block">
            <Logo variant="wordmark" />
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {sidebarMain.map((item) => (
            <SidebarLink key={item.to} {...item} />
          ))}
          <div className="my-3 border-t border-[var(--color-line)]" />
          {sidebarExtras.map((item) => (
            <SidebarLink key={item.to} {...item} />
          ))}
        </nav>

        <div className="p-3 border-t border-[var(--color-line)]">
          <div className="flex items-center gap-3 px-2 py-2 rounded-2xl hover:bg-zinc-50 transition">
            <Link to="/profile" className="flex items-center gap-3 min-w-0 flex-1">
              <Avatar src={profile?.photoURL} name={profile?.displayName} size={36} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate">
                  {profile?.username ? `@${profile.username}` : profile?.displayName}
                </div>
                <div className="text-xs text-zinc-500 truncate">
                  {profile?.displayName}
                </div>
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
          <Link to="/" aria-label="Foundry — Home">
            <Logo variant="wordmark" small />
          </Link>
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate('/feedback')}
              className="size-10 grid place-items-center rounded-full text-zinc-800 hover:bg-zinc-100 lift"
              title="Feedback exchange"
              aria-label="Feedback exchange"
            >
              <Heart className="size-[22px]" strokeWidth={2} />
            </button>
            <button
              onClick={() => navigate('/messages')}
              className="size-10 grid place-items-center rounded-full text-zinc-800 hover:bg-zinc-100 lift"
              title="Messages"
              aria-label="Messages"
            >
              <Send className="size-[22px]" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* ============== Main content ============== */}
      <main className="flex-1 md:ml-64 lg:ml-72 pb-20 md:pb-10 min-w-0">
        <div
          key={location.pathname}
          className="animate-fade-in-up ig-shell px-0 md:px-6 py-0 md:py-8"
        >
          <Outlet />
        </div>
      </main>

      {/* ============== Mobile bottom nav ============== */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-lg border-t border-[var(--color-line)] safe-bottom">
        <div className="grid grid-cols-5 max-w-md mx-auto">
          <BottomTab to="/"          icon={Home}       label="Home" end />
          <BottomTab to="/rooms"     icon={Hash}       label="Rooms" />
          <BottomTab to="/post"      icon={PlusSquare} label="Create" center />
          <BottomTab to="/feedback"  icon={Heart}      label="Activity" />
          <BottomTab
            to="/profile"
            icon={MessageCircle /* placeholder, overridden by avatar */}
            label="Me"
            avatarSrc={profile?.photoURL}
            avatarName={profile?.displayName}
          />
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
        `group flex items-center gap-4 px-3 py-3 rounded-2xl text-[15px] transition lift ${
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

function BottomTab({
  to, icon: Icon, label, end, center, avatarSrc, avatarName,
}: NavItem & {
  center?: boolean
  avatarSrc?: string | null
  avatarName?: string | null
}) {
  return (
    <NavLink
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
          {center ? (
            <span className={`grid place-items-center size-9 rounded-2xl transition ${
              isActive ? 'bg-foundry text-white shadow-md' : 'bg-zinc-100 text-zinc-700'
            }`}>
              <Icon className="size-5" strokeWidth={2.2} />
            </span>
          ) : avatarSrc !== undefined ? (
            <span
              className={`rounded-full transition ${
                isActive ? 'p-[2px] bg-foundry' : ''
              }`}
            >
              <Avatar
                src={avatarSrc}
                name={avatarName}
                size={26}
                className={isActive ? 'ring-2 ring-white rounded-full' : ''}
              />
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
}
