import { useState, FormEvent } from 'react'
import Navbar from '../components/Navbar'
import Marquee from '../components/Marquee'
import Footer from '../components/Footer'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', program: '', message: ''
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <>
      <Marquee />
      <Navbar />

      <div className="page-header">
        <span className="page-header-label">Get in Touch</span>
        <h1>Apply to <span style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>LEAP</span></h1>
        <p>Ready to make the leap? Fill out the form below and our admissions team will get back to you within 24 hours.</p>
      </div>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <div>
                <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: 8 }}>
                  We'd love to hear from you
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  Whether you want to apply, partner with us, or just learn more — reach out and our team will respond quickly.
                </p>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <h4>Headquarters</h4>
                  <p>LEAP Startup HQ, Bandra-Kurla Complex, Mumbai — 400 051</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div>
                  <h4>Email</h4>
                  <p>admissions@leapstartup.com</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <h4>Phone</h4>
                  <p>+91 98765 43210</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">⏰</div>
                <div>
                  <h4>Office Hours</h4>
                  <p>Mon–Sat, 9:00 AM – 7:00 PM IST</p>
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span className="status-dot" />
                  <span style={{ fontWeight: 700, color: '#00ff88', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Currently Accepting Applications</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  April – June 2026 cohort is now open. Limited seats available across all programs.
                </p>
              </div>
            </div>

            <div className="contact-form">
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 20 }}>🎉</div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 12 }}>Application Received!</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    Thank you for applying to LEAP. Our admissions team will review your application and reach out within 24 hours.
                  </p>
                  <button
                    className="btn-primary"
                    style={{ marginTop: 28 }}
                    onClick={() => setSubmitted(false)}
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 28 }}>Application Form</h3>

                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="Aanya"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Sharma"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="aanya@example.com"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Program of Interest</label>
                    <select name="program" value={form.program} onChange={handleChange} required>
                      <option value="">Select a program…</option>
                      <option>Full Stack Marketing (12 Weeks)</option>
                      <option>Product Management (10 Weeks)</option>
                      <option>Startup Finance & Fundraising (8 Weeks)</option>
                      <option>UX & Brand Strategy (8 Weeks)</option>
                      <option>Operations & Scale (6 Weeks)</option>
                      <option>AI for Entrepreneurs (6 Weeks)</option>
                      <option>Not sure — help me decide</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Tell us about yourself & your goals</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your background, what you want to achieve, and why you want to join LEAP…"
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
                    Submit Application →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
