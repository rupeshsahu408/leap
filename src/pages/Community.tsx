import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Marquee from '../components/Marquee'
import Footer from '../components/Footer'

const events = [
  {
    date: 'May 10, 2026',
    title: 'Startup Pitch Night — Mumbai',
    type: 'In-Person',
    desc: 'Watch LEAP alumni pitch their startups to a panel of seasoned investors and VCs.',
  },
  {
    date: 'May 17, 2026',
    title: 'Growth Marketing Masterclass',
    type: 'Online',
    desc: 'A 3-hour deep dive into growth loops, retention mechanics, and PLG strategies.',
  },
  {
    date: 'June 5, 2026',
    title: 'Annual LEAP Summit 2026',
    type: 'Hybrid',
    desc: 'Our flagship annual event bringing together 1,000+ alumni, mentors and industry leaders.',
  },
  {
    date: 'June 20, 2026',
    title: 'AI Tools for Entrepreneurs Workshop',
    type: 'Online',
    desc: 'Hands-on workshop exploring the best AI tools for product, marketing and operations teams.',
  },
]

const alumni = [
  { name: 'Aanya Sharma', role: 'Founder, GreenLoop', batch: 'Batch 2024' },
  { name: 'Rohan Mehta', role: 'Growth Manager, Razorpay', batch: 'Batch 2023' },
  { name: 'Priya Nair', role: 'CEO, TechVeda', batch: 'Batch 2022' },
  { name: 'Karan Joshi', role: 'Product Lead, Meesho', batch: 'Batch 2024' },
  { name: 'Divya Pillai', role: 'Co-Founder, Finstack', batch: 'Batch 2023' },
  { name: 'Arjun Kumar', role: 'Marketing Head, PhysicsWallah', batch: 'Batch 2022' },
]

export default function Community() {
  return (
    <>
      <Marquee />
      <Navbar />

      <div className="page-header">
        <span className="page-header-label">Community</span>
        <h1>Join a network of <br /><span style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>5,000+ builders</span></h1>
        <p>The LEAP community is your lifelong network of founders, marketers, operators, and investors — always there to help you grow.</p>
      </div>

      <section className="section">
        <div className="container">
          <div className="community-stats">
            <div className="community-stat">
              <div className="num">5,000+</div>
              <p>Active Community Members</p>
            </div>
            <div className="community-stat">
              <div className="num">200+</div>
              <p>Startups Founded by Alumni</p>
            </div>
            <div className="community-stat">
              <div className="num">₹500Cr+</div>
              <p>Raised by Alumni Startups</p>
            </div>
            <div className="community-stat">
              <div className="num">50+</div>
              <p>Mentor-led Events per Year</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <span className="section-label">Upcoming Events</span>
          <h2 className="section-title">What's <span className="highlight">happening next</span></h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 40 }}>
            {events.map((e, i) => (
              <div key={i} style={{ background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 32px', display: 'grid', gridTemplateColumns: '160px 1fr auto', gap: 24, alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Date</div>
                  <div style={{ fontWeight: 700 }}>{e.date}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 6 }}>{e.title}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{e.desc}</div>
                </div>
                <div>
                  <span style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent-border)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', padding: '4px 12px', borderRadius: 4, whiteSpace: 'nowrap' }}>{e.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="section-label">Alumni Spotlight</span>
          <h2 className="section-title">Meet our <span className="highlight">alumni</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 40 }}>
            {alumni.map((a, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 52, height: 52, background: 'var(--gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0 }}>
                    {a.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{a.name}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{a.role}</div>
                  </div>
                </div>
                <span style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent-border)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', padding: '4px 12px', borderRadius: 4 }}>{a.batch}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="community-banner">
            <div>
              <span className="section-label">Join the Community</span>
              <h2 className="section-title">Connect on <span className="highlight">Discord</span></h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
                Our community Discord has 5,000+ members sharing opportunities, feedback, and wins every single day. Join free.
              </p>
              <a href="#" className="btn-primary">Join Discord Server</a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {['#marketing-growth', '#product-pm', '#fundraising', '#jobs-internships', '#startup-ideas', '#mentor-ama'].map((ch, i) => (
                <div key={i} style={{ background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--accent)' }}>
                  {ch}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
