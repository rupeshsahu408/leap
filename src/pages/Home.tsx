import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Marquee from '../components/Marquee'
import Footer from '../components/Footer'
import { useScrollReveal } from '../hooks/useScrollReveal'

const features = [
  { icon: '🚀', title: 'Real Startup Experience', desc: 'Work on live startup projects with real founders, not hypothetical case studies.' },
  { icon: '🧠', title: 'Industry-Led Curriculum', desc: 'Learn from practitioners who have built and scaled successful ventures.' },
  { icon: '🌐', title: 'Global Network', desc: 'Connect with a community of entrepreneurs, mentors and investors worldwide.' },
  { icon: '⚡', title: 'Fast-Track Learning', desc: 'Compressed cohort model lets you learn more in 3 months than in 3 years.' },
  { icon: '💼', title: 'Placement Support', desc: 'Our alumni network ensures you land roles at top startups and corporates.' },
  { icon: '🏆', title: 'Certificate of Excellence', desc: 'Earn a verifiable credential recognized by 200+ partner organizations.' },
]

const courses = [
  { icon: '📈', tag: 'Marketing', title: 'Full Stack Marketing', desc: 'Master growth hacking, SEO, paid ads, and product marketing from scratch to expert.', duration: '12 Weeks', level: 'Beginner' },
  { icon: '💻', tag: 'Technology', title: 'Product Management', desc: 'Build, launch, and scale digital products using agile frameworks and user research.', duration: '10 Weeks', level: 'Intermediate' },
  { icon: '💰', tag: 'Finance', title: 'Startup Finance & Fundraising', desc: 'Understand venture capital, pitch decks, cap tables, and financial modeling.', duration: '8 Weeks', level: 'All Levels' },
  { icon: '🎨', tag: 'Design', title: 'UX & Brand Strategy', desc: 'Craft compelling user experiences and build brand identities that resonate.', duration: '8 Weeks', level: 'Beginner' },
  { icon: '🔗', tag: 'Operations', title: 'Operations & Scale', desc: 'Learn how to run lean operations, hire teams, and scale startup processes.', duration: '6 Weeks', level: 'Advanced' },
  { icon: '🤖', tag: 'AI/Tech', title: 'AI for Entrepreneurs', desc: 'Leverage AI tools to build faster, make smarter decisions, and out-execute competitors.', duration: '6 Weeks', level: 'Intermediate' },
]

const testimonials = [
  { text: 'LEAP transformed the way I think about building a business. The real-world projects gave me confidence that no classroom could match.', name: 'Aanya Sharma', role: 'Founder, GreenLoop' },
  { text: 'I went from zero marketing knowledge to running paid campaigns generating 5x ROI within 3 months of joining LEAP.', name: 'Rohan Mehta', role: 'Growth Manager, Razorpay' },
  { text: 'The mentor network alone is worth 10x the course fee. I connected with investors who funded my startup through LEAP.', name: 'Priya Nair', role: 'CEO, TechVeda' },
]

export default function Home() {
  useScrollReveal()

  return (
    <>
      <Marquee />
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="hero-badge">
            <div className="hero-badge-line" />
            <span className="hero-badge-text">Transform Education with LEAP</span>
          </div>

          <h1>
            Make yourself Capable
            <em className="hero-italic">not just by learning but by building.</em>
          </h1>

          <p>
            Bridge the gap between theory and execution with LEAP's industry-led
            curriculum and real-world startup challenges.
          </p>

          <div className="hero-cta">
            <Link to="/register" className="btn-primary">Join the Cohort</Link>
            <Link to="/platform" className="btn-outline">Explore Courses</Link>
          </div>
        </div>

        <div className="hero-aside">
          <div className="hero-status">
            <span className="status-dot" />
            Open
          </div>
          <div className="hero-date">1 April – 30 June 2026</div>
          <div className="hero-date-sub">Open for Joining</div>
          <Link to="/register" className="hero-cta-link">
            Join the Cohort <span className="arrow">→</span>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-bar">
        {[
          { num: '5,000+', label: 'Alumni Worldwide' },
          { num: '200+', label: 'Partner Companies' },
          { num: '95%', label: 'Placement Rate' },
          { num: '50+', label: 'Expert Mentors' },
        ].map((s, i) => (
          <div className="stat-item reveal" key={i} style={{ transitionDelay: `${i * 0.08}s` }}>
            <div className="stat-number">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <section className="section">
        <div className="container">
          <span className="section-label reveal">Why Choose LEAP</span>
          <h2 className="section-title reveal">
            Education built for the{' '}
            <span className="highlight">real world</span>
          </h2>
          <p className="section-subtitle reveal">
            We don't just teach you — we put you in the arena where ideas get
            tested, businesses get built, and careers get transformed.
          </p>

          <div className="features-grid">
            {features.map((f, i) => (
              <div className={`feature-card reveal stagger-${(i % 6) + 1}`} key={i}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <span className="section-label reveal">The Process</span>
          <h2 className="section-title reveal">
            How <span className="highlight">LEAP works</span>
          </h2>
          <p className="section-subtitle reveal">
            A structured, cohort-based program designed to simulate the real startup environment.
          </p>

          <div className="how-grid">
            <div className="how-steps">
              {[
                { n: '01', title: 'Apply & Get Selected', desc: 'Fill out a short application. Our team reviews your profile and selects candidates ready to hustle and build.' },
                { n: '02', title: 'Join a Cohort', desc: 'Start your journey with a curated batch of fellow founders, marketers, and builders over 8–12 weeks.' },
                { n: '03', title: 'Learn by Building', desc: 'Work on live projects, complete industry challenges, and receive mentorship from real practitioners.' },
                { n: '04', title: 'Launch & Connect', desc: 'Graduate with a portfolio of real work, a powerful network, and the skills to move fast.' },
              ].map((step, i) => (
                <div className={`how-step reveal stagger-${i + 1}`} key={step.n}>
                  <div className="step-number">{step.n}</div>
                  <div className="step-content">
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="how-visual reveal">
              {[
                { icon: '📋', title: 'Application Review', sub: 'Profile & motivation check', tag: 'Step 1' },
                { icon: '👥', title: 'Cohort Kickoff', sub: 'Meet your batch & mentors', tag: 'Step 2' },
                { icon: '🛠️', title: 'Project Sprint', sub: 'Real work, real feedback', tag: 'Step 3' },
                { icon: '🎓', title: 'Graduation Day', sub: 'Showcase & network', tag: 'Step 4' },
              ].map((c, i) => (
                <div className="visual-card" key={i}>
                  <div className="visual-badge">{c.icon}</div>
                  <div className="visual-text">
                    <h4>{c.title}</h4>
                    <p>{c.sub}</p>
                  </div>
                  <span className="visual-tag">{c.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="section">
        <div className="container">
          <span className="section-label reveal">What You'll Learn</span>
          <h2 className="section-title reveal">
            Programs built for{' '}
            <span className="highlight">builders</span>
          </h2>
          <p className="section-subtitle reveal">
            Choose from our range of industry-designed programs and start building from day one.
          </p>

          <div className="courses-grid">
            {courses.map((c, i) => (
              <div className={`course-card reveal stagger-${(i % 6) + 1}`} key={i}>
                <div className="course-img">
                  <span>{c.icon}</span>
                  <div className="course-img-overlay" />
                </div>
                <div className="course-body">
                  <span className="course-tag">{c.tag}</span>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                  <div className="course-meta">
                    <span>⏱ {c.duration}</span>
                    <span>📊 {c.level}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <span className="section-label reveal">Success Stories</span>
          <h2 className="section-title reveal">
            Hear from our{' '}
            <span className="highlight">alumni</span>
          </h2>

          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div className={`testimonial-card reveal stagger-${i + 1}`} key={i}>
                <div className="stars">★★★★★</div>
                <div className="testimonial-quote">"</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.name[0]}</div>
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-banner reveal">
            <h2>
              Ready to make the <span className="highlight">LEAP?</span>
            </h2>
            <p>
              Applications for the April–June 2026 cohort are now open. Seats are
              limited — don't miss your chance to join India's top startup school.
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="btn-primary">Apply Now →</Link>
              <Link to="/platform" className="btn-outline">View Programs</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
