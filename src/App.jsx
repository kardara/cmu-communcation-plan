import { useEffect, useState } from 'react'
import { BOOKING_URL, CANDIDATE, SPOTLIGHT_FORM_URL, VOTE_DAY, mailtoFeature } from './config.js'
import { shareStatusImage } from './statusImage.js'

const FEATURE_URL = SPOTLIGHT_FORM_URL || mailtoFeature

// 24×24 line icons
const ICONS = {
  megaphone: 'M3 10v4a1 1 0 0 0 1 1h2l5 4V5L6 9H4a1 1 0 0 0-1 1zM15 8a5 5 0 0 1 0 8M18 5a9 9 0 0 1 0 14',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',
  compass: 'M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18zM15.5 8.5l-2 5-5 2 2-5z',
  form: 'M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h5',
  spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6',
  video: 'M3 7h12v10H3zM15 10l6-3v10l-6-3',
  send: 'M21 3L10 14M21 3l-7 18-4-7-7-4z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
}

function Icon({ name, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d={ICONS[name]} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const PILLARS = [
  {
    icon: 'megaphone',
    title: 'Weekly Guild updates',
    promise: 'One clear post every Monday: what’s happening, what’s due, what the Guild decided.',
    points: ['Same day, same format, every week', 'Posted on every channel at once', 'Deadlines and events never missed'],
  },
  {
    icon: 'star',
    title: 'Student spotlights',
    promise: 'Every weekend, we celebrate a student — with or without a project.',
    points: ['Student of the Week, every Saturday', 'Project showcases, recorded together', 'Every program, class and country'],
  },
  {
    icon: 'compass',
    title: 'Every voice heard',
    promise: 'Every student knows where to go, who to reach, and gets an answer.',
    points: ['One link with every contact and form', 'A clear “who handles what” guide', 'Open suggestion box, answered monthly'],
  },
]

const WEEK = [
  { day: 'Mon', title: 'This Week at CMU-Africa', text: 'Events, deadlines, Guild news', on: true },
  { day: 'Tue' },
  { day: 'Wed' },
  { day: 'Thu', title: 'Reminders', text: 'Last calls and changes', on: true },
  { day: 'Fri' },
  { day: 'Sat', title: 'Student of the Week', text: 'A profile from our community', on: true, star: true },
  { day: 'Sun', title: 'Project Showcase', text: 'Recorded demos and stories', on: true, star: true },
]

const STEPS = [
  { icon: 'form', title: 'Fill the 3-minute form', text: 'Name, program, class, country, interests, and your project if you have one.' },
  { icon: 'spark', title: 'We draft your feature', text: 'Automated with Claude into a post for each platform — you approve it first.' },
  { icon: 'video', title: 'Optional: record your demo', text: 'Book a slot and we record your project showcase together.' },
  { icon: 'send', title: 'Published on the weekend', text: 'Instagram, LinkedIn, WhatsApp and X — all on the same day.' },
]

const DIRECTORY = [
  ['Courses, research, academic concerns', 'Academic Affairs & Research'],
  ['Events, clubs, campus life', 'Social Affairs'],
  ['Budgets and funding for student initiatives', 'Finance'],
  ['Wellbeing, sports, safety', 'Sports & Wellness'],
  ['Exchange, international opportunities', 'International Affairs'],
  ['Announcements, posts, getting featured', 'Communications'],
]

function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function timeLeft(now) {
  const diff = Math.max(0, VOTE_DAY - now)
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function App() {
  const now = useNow()
  const t = timeLeft(now)
  const voting = now >= VOTE_DAY
  const [making, setMaking] = useState(false)

  const postToStatus = async () => {
    setMaking(true)
    try {
      await shareStatusImage(timeLeft(new Date()), voting)
    } finally {
      setMaking(false)
    }
  }

  return (
    <>
      <header className="bar">
        <div className="bar-brand">
          <span className="wm">Carnegie Mellon University Africa</span>
          <span className="bar-sub">Student Guild Elections 2026</span>
        </div>
        <nav className="bar-nav">
          <a href="#plan">The plan</a>
          <a href="#spotlight">Spotlight</a>
          <a href="#where">Where to go</a>
          <a href="#about">About</a>
        </nav>
        <span className="bar-vote">Vote · 14 Nov</span>
      </header>

      <section className="hero">
        <div className="hero-text">
          <p className="kicker">Running for</p>
          <h1 className="role">{CANDIDATE.role}</h1>
          <p className="name">{CANDIDATE.name}</p>
          <p className="tagline">{CANDIDATE.tagline}</p>

          <div className="count" aria-live="polite">
            <p className="count-label">{voting ? 'Voting is open' : 'Voting day in'}</p>
            {!voting && (
              <div className="count-units">
                {[
                  ['days', 'Days'],
                  ['hours', 'Hours'],
                  ['minutes', 'Min'],
                  ['seconds', 'Sec'],
                ].map(([k, label]) => (
                  <div key={k} className="count-unit">
                    <span>{String(t[k]).padStart(2, '0')}</span>
                    <small>{label}</small>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="hero-actions">
            <a className="btn btn-white" href="#plan">
              Read the plan <Icon name="arrow" size={16} />
            </a>
            <a className="btn btn-line" href={FEATURE_URL} target="_blank" rel="noreferrer">
              Get featured
            </a>
            <button type="button" className="btn btn-line" onClick={postToStatus} disabled={making}>
              {making ? 'Preparing…' : 'Post to status'}
            </button>
          </div>
        </div>
        <div className="hero-photo">
          <img src="/candidate.jpg" alt={CANDIDATE.name} />
        </div>
      </section>

      <main>
        <section id="plan" className="section">
          <p className="eyebrow">The plan</p>
          <h2 className="h2">Communication you can count on.</h2>
          <p className="lead">
            Three commitments, kept every single week — so no one misses what matters, and everyone gets their moment.
          </p>
          <div className="pillars">
            {PILLARS.map((p, i) => (
              <article key={p.title} className="pillar">
                <div className="pillar-head">
                  <span className="pillar-icon">
                    <Icon name={p.icon} />
                  </span>
                  <span className="pillar-num">0{i + 1}</span>
                </div>
                <h3>{p.title}</h3>
                <p className="pillar-promise">{p.promise}</p>
                <ul>
                  {p.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-tint">
          <p className="eyebrow">The weekly rhythm</p>
          <h2 className="h2">You’ll always know when to look.</h2>
          <ol className="week">
            {WEEK.map((d) => (
              <li key={d.day} className={`${d.on ? 'on' : ''} ${d.star ? 'star' : ''}`}>
                <span className="week-day">{d.day}</span>
                {d.on && (
                  <>
                    <strong>{d.title}</strong>
                    <span className="week-text">{d.text}</span>
                  </>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section id="spotlight" className="section">
          <div className="spot">
            <div>
              <p className="eyebrow">Student spotlight</p>
              <h2 className="h2">Every student has a story worth sharing.</h2>
              <p className="lead">
                No project needed. Tell us who you are — your program, your class, where you’re from, what you love — and
                you could be our Student of the Week. Built something? Let’s record it together.
              </p>
              <div className="spot-actions">
                <a className="btn btn-red" href={FEATURE_URL} target="_blank" rel="noreferrer">
                  <Icon name="form" size={16} /> Get featured
                </a>
                {BOOKING_URL && (
                  <a className="btn btn-dark-line" href={BOOKING_URL} target="_blank" rel="noreferrer">
                    <Icon name="video" size={16} /> Book a showcase recording
                  </a>
                )}
              </div>
              <p className="tags">
                <span>MSIT</span>
                <span>MS ECE</span>
                <span>MS EAI</span>
                <span>All classes</span>
                <span>All countries</span>
              </p>
            </div>
            <ol className="steps">
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <span className="step-icon">
                    <Icon name={s.icon} />
                  </span>
                  <div>
                    <p className="step-num">Step {i + 1}</p>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="where" className="section section-dark">
          <p className="eyebrow">Know where to go</p>
          <h2 className="h2">One link. Every answer.</h2>
          <p className="lead">
            A single page with every Guild contact, form and channel — and a simple guide to who handles what.
          </p>
          <ul className="dir">
            {DIRECTORY.map(([need, who]) => (
              <li key={need}>
                <span>{need}</span>
                <strong>
                  {who} <Icon name="arrow" size={16} />
                </strong>
              </li>
            ))}
          </ul>
        </section>

        <section id="about" className="section">
          <div className="about">
            <img src="/candidate.jpg" alt="" className="about-photo" />
            <div>
              <p className="eyebrow">About me</p>
              <h2 className="h2">{CANDIDATE.name}</h2>
              <p className="lead">
                {CANDIDATE.program} student at CMU-Africa, from {CANDIDATE.from}. Software engineer, teaching assistant and
                student community leader. I build systems that work every day — and I’ll bring that same reliability to
                how our Guild communicates.
              </p>
              <div className="about-links">
                <a href={CANDIDATE.links.portfolio} target="_blank" rel="noreferrer">
                  Portfolio
                </a>
                <a href={CANDIDATE.links.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
                <a href={CANDIDATE.links.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
                <a href={`mailto:${CANDIDATE.email}`}>
                  <Icon name="mail" size={16} /> {CANDIDATE.email}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="foot-inner">
          <div>
            <p className="foot-vote">Vote 14 November</p>
            <p className="foot-name">
              {CANDIDATE.name} · {CANDIDATE.role}
            </p>
          </div>
          <p className="foot-tag">{CANDIDATE.hashtag}</p>
        </div>
        <div className="plaid" aria-hidden="true" />
      </footer>
    </>
  )
}
