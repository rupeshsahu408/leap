import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/" className="nav-logo">
            <div className="nav-logo-box">
              LEAP<span>STARTUP</span>
            </div>
          </Link>
          <p>
            Bridge the gap between theory and execution with LEAP's industry-led
            curriculum and real-world startup challenges.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-link" aria-label="Twitter">𝕏</a>
            <a href="#" className="social-link" aria-label="LinkedIn">in</a>
            <a href="#" className="social-link" aria-label="Instagram">ig</a>
            <a href="#" className="social-link" aria-label="YouTube">▶</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Platform</h4>
          <ul>
            <li><Link to="/platform">Courses</Link></li>
            <li><Link to="/platform">Cohorts</Link></li>
            <li><Link to="/platform">Mentors</Link></li>
            <li><Link to="/platform">Projects</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/community">About</Link></li>
            <li><Link to="/locations">Locations</Link></li>
            <li><Link to="/institutions">Institutions</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Community</h4>
          <ul>
            <li><Link to="/community">Alumni Network</Link></li>
            <li><Link to="/community">Events</Link></li>
            <li><Link to="/community">Blog</Link></li>
            <li><Link to="/community">Discord</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 LEAP Startup. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}
