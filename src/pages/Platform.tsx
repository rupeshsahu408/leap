import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Marquee from '../components/Marquee'
import Footer from '../components/Footer'

const programs = [
  {
    icon: '📈',
    tag: 'Marketing',
    title: 'Full Stack Marketing',
    desc: 'Master growth hacking, SEO, paid ads, content strategy, and product marketing. You will run real campaigns, analyse data and drive measurable business outcomes.',
    duration: '12 Weeks',
    level: 'Beginner Friendly',
    modules: ['Growth Hacking', 'SEO & Content', 'Paid Ads (Meta/Google)', 'Analytics & CRO', 'Brand Strategy', 'Email & Retention'],
    price: '₹29,999',
  },
  {
    icon: '💻',
    tag: 'Product',
    title: 'Product Management',
    desc: 'Build, launch, and scale digital products using agile frameworks, user research, and data-driven decision making. Lead cross-functional teams with confidence.',
    duration: '10 Weeks',
    level: 'Intermediate',
    modules: ['Product Discovery', 'User Research', 'Roadmapping', 'Agile & Scrum', 'Metrics & OKRs', 'GTM Strategy'],
    price: '₹34,999',
  },
  {
    icon: '💰',
    tag: 'Finance',
    title: 'Startup Finance & Fundraising',
    desc: 'Understand venture capital, pitch decks, cap tables, term sheets, and financial modelling. Learn to speak the language of investors.',
    duration: '8 Weeks',
    level: 'All Levels',
    modules: ['Financial Modelling', 'Cap Tables', 'VC Landscape', 'Pitch Decks', 'Term Sheets', 'Due Diligence'],
    price: '₹24,999',
  },
  {
    icon: '🎨',
    tag: 'Design',
    title: 'UX & Brand Strategy',
    desc: 'Craft compelling user experiences and build brand identities that resonate. From wireframes to fully designed products, tell stories through design.',
    duration: '8 Weeks',
    level: 'Beginner',
    modules: ['Design Thinking', 'Wireframing', 'Prototyping', 'Usability Testing', 'Brand Identity', 'Design Systems'],
    price: '₹24,999',
  },
  {
    icon: '🔗',
    tag: 'Operations',
    title: 'Operations & Scale',
    desc: 'Learn how to build lean processes, hire and retain talent, and scale startup operations without breaking the culture.',
    duration: '6 Weeks',
    level: 'Advanced',
    modules: ['Process Design', 'Team Building', 'Vendor Management', 'SOPs', 'Culture at Scale', 'OKRs & Performance'],
    price: '₹19,999',
  },
  {
    icon: '🤖',
    tag: 'AI/Tech',
    title: 'AI for Entrepreneurs',
    desc: 'Leverage cutting-edge AI tools to build faster, make smarter decisions, automate workflows, and out-execute your competition.',
    duration: '6 Weeks',
    level: 'Intermediate',
    modules: ['AI Fundamentals', 'Prompt Engineering', 'AI-Powered Marketing', 'Automation Tools', 'AI Product Strategy', 'Ethical AI'],
    price: '₹19,999',
  },
]

export default function Platform() {
  return (
    <>
      <Marquee />
      <Navbar />

      <div className="page-header">
        <span className="page-header-label">Our Platform</span>
        <h1>Programs for every <br /><span style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>kind of builder</span></h1>
        <p>Industry-designed, cohort-based programs that take you from zero to job-ready in weeks, not years.</p>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {programs.map((p, i) => (
              <div key={i} className="feature-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, padding: '40px', borderRadius: 20 }}>
                <div>
                  <span className="course-tag">{p.tag}</span>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '12px 0 12px', fontFamily: 'Playfair Display, serif' }}>
                    <span style={{ marginRight: 12 }}>{p.icon}</span>{p.title}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>{p.desc}</p>
                  <div style={{ display: 'flex', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>⏱ {p.duration}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>📊 {p.level}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 900, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{p.price}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>one-time</span>
                  </div>
                  <Link to="/contact" className="btn-primary">Apply for this Program</Link>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>Modules Covered</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {p.modules.map((mod, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.8rem' }}>✓</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{mod}</span>
                      </div>
                    ))}
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
            <h2>Not sure which program to pick?</h2>
            <p>Talk to our admissions team and we'll help you find the right fit based on your background and goals.</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn-primary">Talk to Admissions</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
