import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

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

        <Link to="/contact" className="btn-join" style={{ display: 'flex' }}>
          Join Now
        </Link>

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
        <Link to="/contact" className="btn-join" style={{ marginTop: 8 }}>
          Join Now
        </Link>
      </div>
    </>
  )
}
