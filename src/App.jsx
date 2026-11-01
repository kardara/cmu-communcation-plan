import { useEffect, useState } from 'react'
import { BOOKING_URL, CANDIDATE, SPOTLIGHT_FORM_URL, VOTE_START, daysToVote } from './config.js'
import { downloadIcs, googleCalendarUrl } from './calendar.js'
import { shareStatusImage } from './statusImage.js'

const COMMITMENTS = [
  {
    title: 'Weekly Guild updates',
    text: 'Every Monday, one clear post with the week’s events, deadlines and Guild decisions. Same day, same format, on every channel.',
  },
  {
    title: 'Student spotlights',
    text: 'Every weekend, a student from our community in the spotlight: a Student of the Week on Saturday, a project showcase on Sunday.',
  },
  {
    title: 'Every voice heard',
    text: 'One link with every contact and form, a clear guide to who handles what, and suggestions answered every month.',
  },
]

const WEEK = [
  ['Monday', 'Weekly update'],
  ['Thursday', 'Reminders'],
  ['Saturday', 'Student of the Week'],
  ['Sunday', 'Project Showcase'],
]

const STEPS = [
  ['Fill the form', 'Three minutes: your program, class, interests and a few words about you.'],
  ['We prepare your feature', 'A post for each platform, drafted with the help of Claude. You approve it first.'],
  ['Record your project', 'Optional. Built something? We book a slot and record a short demo together.'],
  ['Published on the weekend', 'Instagram, LinkedIn, WhatsApp and X, on the same day.'],
]

const DIRECTORY = [
  ['Courses, research and academic concerns', 'Academic Affairs & Research'],
  ['Events, clubs and campus life', 'Social Affairs'],
  ['Funding for student initiatives', 'Finance'],
  ['Wellbeing, sports and safety', 'Sports & Wellness'],
  ['Exchanges and international opportunities', 'International Affairs'],
  ['Announcements and getting featured', 'Communications'],
]

function Tick() {
  return (
    <svg className="tick" viewBox="0 0 40 40" aria-hidden="true">
      <rect x="2" y="2" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M10 21l7 7 14-16" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Ballot({ big = false }) {
  return (
    <div className={`ballot ${big ? 'ballot-big' : ''}`}>
      <p className="ballot-head">
        <span>Ballot</span>
        <span>{CANDIDATE.role}</span>
      </p>
      <div className="ballot-row">
        <Tick />
        <div>
          <strong>{CANDIDATE.name}</strong>
          <em>{CANDIDATE.tagline}</em>
        </div>
      </div>
    </div>
  )
}

// "Remind me to vote": Google Calendar link or a calendar file with two reminders
function RemindMe({ light = false }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const close = (e) => !e.target.closest('.remind') && setOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [open])

  return (
    <div className={`remind ${light ? 'remind-light' : ''}`}>
      <button type="button" className="btn btn-line" aria-expanded={open} onClick={() => setOpen(!open)}>
        Remind me to vote
      </button>
      {open && (
        <div className="remind-menu" role="menu">
          <p>We’ll remind you the evening before and on voting morning.</p>
          <a role="menuitem" href={googleCalendarUrl()} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
            Google Calendar
          </a>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              downloadIcs()
              setOpen(false)
            }}
          >
            Apple / Outlook calendar
          </button>
        </div>
      )}
    </div>
  )
}

function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function timeLeft(now) {
  const diff = Math.max(0, VOTE_START - now)
  return [
    [Math.floor(diff / 86400000), 'Days'],
    [Math.floor((diff / 3600000) % 24), 'Hours'],
    [Math.floor((diff / 60000) % 60), 'Minutes'],
    [Math.floor((diff / 1000) % 60), 'Seconds'],
  ]
}

export default function App() {
  const now = useNow()
  const voting = now >= VOTE_START
  const [making, setMaking] = useState(false)

  const postToStatus = async () => {
    setMaking(true)
    try {
      await shareStatusImage(daysToVote())
    } finally {
      setMaking(false)
    }
  }

  return (
    <>
      <header className="nav">
        <div>
          <span className="wm">Carnegie Mellon University Africa</span>
          <span className="nav-sub">Student Guild Elections 2026</span>
        </div>
        <span className="nav-days">{voting ? 'Vote today' : 'Vote · Sat 14 Nov'}</span>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="label">Candidate for {CANDIDATE.role}</p>
          <h1>
            <span>Clear.</span>
            <span>Consistent.</span>
            <span className="red">Connected.</span>
          </h1>
          <p className="hero-lead">
            Vote <strong>{CANDIDATE.name}</strong> for {CANDIDATE.role}: a Guild that speaks to every student, every week.
          </p>

          <div className="counter" aria-live="polite">
            {voting ? (
              <p className="counter-open">Voting is open today</p>
            ) : (
              <div className="counter-units">
                {timeLeft(now).map(([value, label]) => (
                  <div key={label}>
                    <span>{String(value).padStart(2, '0')}</span>
                    <small>{label}</small>
                  </div>
                ))}
              </div>
            )}
            <p className="counter-note">Voting day · Saturday 14 November</p>
          </div>

          <div className="actions">
            <RemindMe />
            <button type="button" className="btn btn-line" onClick={postToStatus} disabled={making}>
              {making ? 'Preparing…' : 'Post to status'}
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="arch">
            <img src="/candidate.jpg" alt={CANDIDATE.name} />
          </div>
          <Ballot />
        </div>
      </section>

      <section className="vision wrap">
        <p className="label">The vision</p>
        <blockquote>
          Information at CMU-Africa shouldn’t be scattered, late or hard to find. I want a Guild that communicates like a
          promise: <span className="red">on time, in one place, for every student.</span>
        </blockquote>
      </section>

      <section className="wrap section">
        <p className="label">Three commitments</p>
        <div className="commitments">
          {COMMITMENTS.map((c, i) => (
            <article key={c.title}>
              <span className="big-num">{i + 1}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rhythm">
        <div className="wrap">
          <p className="label light">Every week, you’ll know when to look</p>
          <ol>
            {WEEK.map(([day, what]) => (
              <li key={day}>
                <span>{day}</span>
                <strong>{what}</strong>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap section spot">
        <div>
          <p className="label">Student spotlight</p>
          <h2>No project needed. Just you.</h2>
          <p className="body">
            Every student has a story worth sharing. Tell us who you are and you could be our Student of the Week. Built
            something? We’ll record it together.
          </p>
          <div className="actions">
            <a className="btn btn-red" href={SPOTLIGHT_FORM_URL} target="_blank" rel="noreferrer">
              Get featured
            </a>
            {BOOKING_URL && (
              <a className="btn btn-line" href={BOOKING_URL} target="_blank" rel="noreferrer">
                Book a recording
              </a>
            )}
          </div>
        </div>
        <ol className="steps">
          {STEPS.map(([title, text], i) => (
            <li key={title}>
              <span className="step-num">0{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap section where">
        <p className="label">Know where to go</p>
        <h2>One link. Every answer.</h2>
        <ul className="dir">
          {DIRECTORY.map(([need, who]) => (
            <li key={need}>
              <span>{need}</span>
              <strong>{who}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section className="final">
        <div className="final-inner">
          <p className="final-kicker">Saturday 14 November</p>
          <h2>Tick the box for clear communication.</h2>
          <Ballot big />
          <div className="final-actions">
            <RemindMe light />
          </div>
          <p className="final-tag">{CANDIDATE.hashtag}</p>
        </div>
      </section>

      <footer className="foot">
        {CANDIDATE.name} · Candidate for {CANDIDATE.role} · CMU-Africa Student Guild Elections 2026
      </footer>
    </>
  )
}
