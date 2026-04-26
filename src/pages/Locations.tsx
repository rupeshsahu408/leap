import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Marquee from '../components/Marquee'
import Footer from '../components/Footer'

const locations = [
  {
    city: 'Mumbai',
    country: 'India',
    img: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400&q=80',
    desc: 'Our flagship campus in the heart of India\'s financial capital. Located in Bandra-Kurla Complex with access to top VCs and corporates.',
    programs: 6,
    cohortSize: 40,
  },
  {
    city: 'Bangalore',
    country: 'India',
    img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&q=80',
    desc: 'In the startup capital of India. Minutes away from major tech parks and incubators like NASSCOM 10000 Startups.',
    programs: 5,
    cohortSize: 35,
  },
  {
    city: 'Delhi NCR',
    country: 'India',
    img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80',
    desc: 'Serving the National Capital Region with a modern campus in Gurugram, close to India\'s top consulting and investment firms.',
    programs: 4,
    cohortSize: 30,
  },
  {
    city: 'Hyderabad',
    country: 'India',
    img: 'https://images.unsplash.com/photo-1573408406978-4fc6d25cbac1?w=400&q=80',
    desc: 'Located in HITEC City, surrounded by global tech giants and fast-growing SaaS companies. A hub for product talent.',
    programs: 4,
    cohortSize: 30,
  },
  {
    city: 'Pune',
    country: 'India',
    img: 'https://images.unsplash.com/photo-1547136753-dd701c4e57a8?w=400&q=80',
    desc: 'Home to India\'s largest student population. Our Pune campus serves freshers and working professionals alike.',
    programs: 3,
    cohortSize: 25,
  },
  {
    city: 'Chennai',
    country: 'India',
    img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&q=80',
    desc: 'Gateway to South India\'s deep tech and manufacturing ecosystem. Strong alumni network in automotive and IT sectors.',
    programs: 3,
    cohortSize: 25,
  },
]

export default function Locations() {
  return (
    <>
      <Marquee />
      <Navbar />

      <div className="page-header">
        <span className="page-header-label">Our Locations</span>
        <h1>Present across <br /><span style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>India's top cities</span></h1>
        <p>Learn in the ecosystem you want to build in. Our campuses are strategically placed near startup hubs, VCs, and major employers.</p>
      </div>

      <section className="section">
        <div className="container">
          <div className="locations-grid">
            {locations.map((loc, i) => (
              <div className="location-card" key={i}>
                <div className="location-img">
                  <img src={loc.img} alt={loc.city} loading="lazy" />
                </div>
                <div className="location-body">
                  <div className="city">📍 {loc.city}, {loc.country}</div>
                  <h3>{loc.city} Campus</h3>
                  <p>{loc.desc}</p>
                  <div style={{ display: 'flex', gap: 20, marginTop: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>📚 {loc.programs} Programs</span>
                    <span>👥 Cohort: {loc.cohortSize}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="cta-banner" style={{ background: 'var(--bg-dark)' }}>
            <h2>Online cohorts <span className="highlight">available too</span></h2>
            <p>Can't make it to a campus? Join our fully online cohorts and get the same quality education from anywhere in the world.</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn-primary">Explore Online Programs</Link>
              <Link to="/platform" className="btn-outline">View All Programs</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
