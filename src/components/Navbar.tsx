import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const links = [
    { to: '/', label: 'Home' },
    { to: '/platform', label: 'Platform' },
    { to: '/locations', label: 'Locations' },
    { to: '/institutions', label: 'Institutions' },
    { to: '/community', label: 'Community' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-logo">
          <div className="nav-logo-box">
            LEAP<span>STARTUP</span>
          </div>
        </Link>

        <ul className="nav-links">
          {links.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={location.pathname === link.to ? 'active' : ''}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/dashboard" className="btn-join" style={{ display: 'flex' }}>
              Dashboard
            </Link>
            <button
              onClick={() => { logout(); navigate('/') }}
              style={{ background: 'none', color: 'var(--text-secondary)', padding: '8px 12px', borderRadius: 8, fontSize: '0.85rem', cursor: 'pointer', border: '1px solid var(--border)' }}>
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link to="/login" style={{ color: 'var(--text-secondary)', padding: '10px 16px', fontSize: '0.9rem', fontWeight: 500 }}>
              Sign In
            </Link>
            <Link to="/register" className="btn-join" style={{ display: 'flex' }}>
              Join Now
            </Link>
          </div>
        )}

        <button
          className="hamburger"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? 'active' : ''}
          >
            {link.label}
          </Link>
        ))}
        {user ? (
          <>
            <Link to="/dashboard" className="btn-join" style={{ marginTop: 8, display: 'block', textAlign: 'center' }}>
              Dashboard
            </Link>
            <button onClick={() => { logout(); navigate('/') }} style={{ background: 'none', color: 'var(--text-secondary)', padding: '12px 16px', fontSize: '0.95rem', width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'var(--text-secondary)', padding: '12px 16px', display: 'block' }}>Sign In</Link>
            <Link to="/register" className="btn-join" style={{ marginTop: 4, display: 'block', textAlign: 'center' }}>Join Now</Link>
          </>
        )}
      </div>
    </>
  )
}
