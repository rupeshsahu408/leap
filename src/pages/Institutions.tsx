import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Marquee from '../components/Marquee'
import Footer from '../components/Footer'

const offerings = [
  {
    icon: '🎓',
    title: 'Campus Integration Program',
    desc: 'We bring LEAP\'s curriculum to your college. Students get hands-on startup education as part of their academic journey without leaving campus.',
    badge: 'Most Popular',
  },
  {
    icon: '🏢',
    title: 'Corporate L&D Partnerships',
    desc: 'Upskill your employees with our cohort-based programs. Custom tracks for marketing, product, and operations teams at scale.',
    badge: 'Enterprise',
  },
  {
    icon: '🤝',
    title: 'Incubator Collaboration',
    desc: 'Partner with LEAP to provide structured learning pathways for startups in your incubator or accelerator program.',
    badge: 'Ecosystem',
  },
  {
    icon: '📋',
    title: 'Curriculum Licensing',
    desc: 'License LEAP\'s proven curriculum materials, assessments, and project frameworks to enhance your institution\'s program quality.',
    badge: 'Academic',
  },
]

const partners = [
  'IIT Bombay', 'IIM Ahmedabad', 'XLRI', 'Symbiosis', 'VIT',
  'Manipal University', 'Amity University', 'Narsee Monjee',
]

const benefits = [
  { icon: '📊', title: 'Outcome-Based Learning', desc: 'Measurable skill development with clear KPIs and industry-validated assessments.' },
  { icon: '👨‍🏫', title: 'Expert Facilitators', desc: 'Sessions led by practitioners with 10+ years of real-world startup and corporate experience.' },
  { icon: '📱', title: 'Flexible Delivery', desc: 'On-campus, online, or hybrid delivery models to fit your institution\'s schedule and needs.' },
  { icon: '🔁', title: 'Continuous Updates', desc: 'Curriculum refreshed every quarter to reflect the latest industry trends and tools.' },
]

export default function Institutions() {
  return (
    <>
      <Marquee />
      <Navbar />

      <div className="page-header">
        <span className="page-header-label">For Institutions</span>
        <h1>Bring LEAP to your <br /><span style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>organization</span></h1>
        <p>Partner with LEAP to give your students, employees, or cohort members access to world-class startup education.</p>
      </div>

      <section className="section">
        <div className="container">
          <span className="section-label">Partnership Models</span>
          <h2 className="section-title">Choose how we <span className="highlight">work together</span></h2>

          <div className="institution-grid">
            {offerings.map((o, i) => (
              <div className="institution-card" key={i}>
                <div className="inst-icon">{o.icon}</div>
                <h3>{o.title}</h3>
                <p>{o.desc}</p>
                <span className="institution-badge">{o.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <span className="section-label">Why LEAP</span>
          <h2 className="section-title">Benefits that <span className="highlight">matter</span></h2>
          <div className="features-grid" style={{ marginTop: 40 }}>
            {benefits.map((b, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{b.icon}</div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="section-label">Trusted By</span>
          <h2 className="section-title">Our <span className="highlight">institutional partners</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 40 }}>
            {partners.map((p, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px', textAlign: 'center', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="cta-banner" style={{ background: 'var(--bg-dark)' }}>
            <h2>Ready to partner with <span className="highlight">LEAP?</span></h2>
            <p>Fill out our partnership enquiry form and our team will reach out within 24 hours.</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn-primary">Request Partnership</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
