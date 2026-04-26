import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const navItems = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/dashboard/ai-advisor', icon: '🤖', label: 'AI Advisor' },
  { to: '/dashboard/ideas', icon: '💡', label: 'My Ideas' },
  { to: '/dashboard/cofounders', icon: '🤝', label: 'Find Co-founders' },
  { to: '/dashboard/courses', icon: '📚', label: 'My Courses' },
  { to: '/dashboard/profile', icon: '👤', label: 'Profile' },
]

export default function DashNav() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <>
      {/* Sidebar (desktop) */}
      <aside className="dash-sidebar">
        <div className="dash-logo">
          <Link to="/">
            <div className="nav-logo-box" style={{ fontSize: '0.75rem', padding: '6px 10px' }}>
              LEAP<span>STARTUP</span>
            </div>
          </Link>
        </div>

        <nav className="dash-nav">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`dash-nav-item ${location.pathname === item.to ? 'active' : ''}`}
            >
              <span className="dash-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="dash-user">
          <div className="dash-avatar">{user?.name?.[0] ?? '?'}</div>
          <div className="dash-user-info">
            <div className="dash-user-name">{user?.name}</div>
            <div className="dash-user-role">{user?.role}</div>
          </div>
          <button onClick={handleLogout} className="dash-logout" title="Logout">⏻</button>
        </div>
      </aside>

      {/* Top bar (mobile) */}
      <div className="dash-topbar">
        <Link to="/">
          <div className="nav-logo-box" style={{ fontSize: '0.7rem', padding: '5px 8px' }}>
            LEAP<span>STARTUP</span>
          </div>
        </Link>
        <button className="hamburger" onClick={() => setMobileOpen(o => !o)} style={{ display: 'flex' }}>
          <span /><span /><span />
        </button>
      </div>

      {mobileOpen && (
        <div className="dash-mobile-nav">
          {navItems.map(item => (
            <Link key={item.to} to={item.to} className="dash-nav-item" onClick={() => setMobileOpen(false)}>
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
          <button onClick={handleLogout} style={{ background: 'none', color: 'var(--text-secondary)', textAlign: 'left', padding: '12px 16px', fontSize: '0.95rem', width: '100%' }}>
            ⏻ Logout
          </button>
        </div>
      )}
    </>
  )
}
