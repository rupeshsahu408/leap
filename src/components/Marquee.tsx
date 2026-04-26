export default function Marquee() {
  const items = [
    { text: '1 April – 30 June 2026 • Open For Joining' },
    { text: 'Become a Full Stack Marketer' },
    { text: '1 April – 30 June 2026 • Open For Joining' },
    { text: 'Build Real Startups. Learn by Doing.' },
    { text: 'Industry-Led Curriculum • Apply Now' },
    { text: 'Join the Next Cohort' },
  ]

  return (
    <div className="marquee-wrapper">
      <div className="marquee-track">
        {[...items, ...items].map((item, i) => (
          <span className="marquee-item" key={i}>
            <span className="marquee-play" />
            {item.text}
            <span className="marquee-dot" />
          </span>
        ))}
      </div>
    </div>
  )
}
