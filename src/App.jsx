import { useEffect, useState } from 'react'
import { BOOKING_URL, CANDIDATE, SPOTLIGHT_FORM_URL, VOTE_DAY, mailtoFeature } from './config.js'
import { shareStatusImage } from './statusImage.js'

const FEATURE_URL = SPOTLIGHT_FORM_URL || mailtoFeature

const COMMITMENTS = [
  {
    title: 'Weekly Guild updates',
    text: 'One clear post every Monday with the week’s events, deadlines and Guild decisions.',
    points: ['Same day, same format', 'Every channel at once', 'Nothing important missed'],
  },
  {
    title: 'Student spotlights',
    text: 'Every weekend we celebrate a student from our community, with or without a project.',
    points: ['Student of the Week on Saturdays', 'Project showcases on Sundays', 'Every program, class and country'],
  },
  {
    title: 'Every voice heard',
    text: 'Every student knows where to go, who to reach, and gets an answer.',
    points: ['One link for every contact and form', 'A clear guide to who handles what', 'Suggestions answered every month'],
  },
]

const WEEK = [
  ['Mon', 'Weekly update'],
  ['Thu', 'Reminders'],
  ['Sat', 'Student of the Week'],
  ['Sun', 'Project Showcase'],
]

const STEPS = [
  ['Fill the form', 'Three minutes: your program, class, country, interests and a few words about you.'],
  ['We prepare your feature', 'Drafted with the help of Claude for each platform. You approve it before anything goes out.'],
  ['Record your project', 'Optional. If you built something, we book a slot and record a short demo together.'],
  ['Published on the weekend', 'Instagram, LinkedIn, WhatsApp and X, all on the same day.'],
]

const DIRECTORY = [
  ['Courses, research and academic concerns', 'Academic Affairs & Research'],
  ['Events, clubs and campus life', 'Social Affairs'],
  ['Funding for student initiatives', 'Finance'],
  ['Wellbeing, sports and safety', 'Sports & Wellness'],
  ['Exchanges and international opportunities', 'International Affairs'],
  ['Announcements and getting featured', 'Communications'],
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

const pad = (n) => String(n).padStart(2, '0')

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
      <header className="nav">
        <div className="nav-brand">
          <span className="wm">Carnegie Mellon University Africa</span>
          <span className="nav-sub">Student Guild Elections 2026</span>
        </div>
        <nav className="nav-links">
          <a href="#plan">Plan</a>
          <a href="#spotlight">Spotlight</a>
          <a href="#about">About</a>
        </nav>
        <span className="nav-cta">Vote Sat 14 Nov</span>
      </header>

      <section className="hero wrap">
        <div className="hero-copy">
          <p className="label">Candidate for Communications Minister</p>
          <h1>{CANDIDATE.name}</h1>
          <p className="tagline">{CANDIDATE.tagline}</p>
          <p className="intro">
            Clear weekly updates, a spotlight on every student, and one place to find every answer. Communication our
            community can count on.
          </p>

          <div className="count" aria-live="polite">
            {voting ? (
              <p className="count-open">Voting is open today</p>
            ) : (
              <>
                <div className="count-units">
                  {[
                    [t.days, 'days'],
                    [t.hours, 'hours'],
                    [t.minutes, 'min'],
                    [t.seconds, 'sec'],
                  ].map(([v, l]) => (
                    <span key={l}>
                      <strong>{pad(v)}</strong>
                      {l}
                    </span>
                  ))}
                </div>
                <p className="count-note">until voting opens on Saturday 14 November</p>
              </>
            )}
          </div>

          <div className="actions">
            <a className="btn btn-red" href={FEATURE_URL} target="_blank" rel="noreferrer">
              Get featured
            </a>
            <a className="btn btn-line" href="#plan">
              Read the plan
            </a>
            <button type="button" className="btn btn-text" onClick={postToStatus} disabled={making}>
              {making ? 'Preparing…' : 'Post to status'}
            </button>
          </div>
        </div>

        <figure className="portrait">
          <img src="/candidate.jpg" alt={CANDIDATE.name} />
          <figcaption>
            {CANDIDATE.program} · {CANDIDATE.from}
          </figcaption>
        </figure>
      </section>

      <section className="band">
        <img src="/community.jpg" alt="CMU-Africa students celebrating Multicultural Day" />
        <p>Every student has a story worth sharing.</p>
      </section>

      <section id="plan" className="wrap section">
        <p className="label">The plan</p>
        <h2>Three commitments, kept every week.</h2>
        <div className="commitments">
          {COMMITMENTS.map((c, i) => (
            <article key={c.title}>
              <span className="num">0{i + 1}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <ul>
                {c.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="week">
          <p className="week-title">The weekly rhythm</p>
          <ol>
            {WEEK.map(([d, what]) => (
              <li key={d}>
                <span>{d}</span>
                {what}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="spotlight" className="section tint">
        <div className="wrap spot">
          <div className="spot-copy">
            <p className="label">Student spotlight</p>
            <h2>No project needed. Just you.</h2>
            <p className="body">
              Tell us who you are and you could be our Student of the Week. Built something? We will record it together
              and share it with the whole community.
            </p>
            <div className="actions">
              <a className="btn btn-red" href={FEATURE_URL} target="_blank" rel="noreferrer">
                Get featured
              </a>
              {BOOKING_URL && (
                <a className="btn btn-line" href={BOOKING_URL} target="_blank" rel="noreferrer">
                  Book a recording
                </a>
              )}
            </div>
            <img className="spot-photo" src="/community-2.jpg" alt="Students in traditional attire at CMU-Africa" />
          </div>
          <ol className="steps">
            {STEPS.map(([title, text], i) => (
              <li key={title}>
                <span className="num">0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap section">
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

      <section id="about" className="section tint">
        <div className="wrap about">
          <img src="/candidate.jpg" alt="" />
          <div>
            <p className="label">About me</p>
            <h2>Building things that work every day.</h2>
            <p className="body">
              I’m an {CANDIDATE.program} student at CMU-Africa from {CANDIDATE.from}. As a software engineer, teaching
              assistant and student community leader, I care about reliability: showing up on time, every time. That is
              the standard I will bring to how our Guild communicates.
            </p>
            <p className="links">
              <a href={CANDIDATE.links.portfolio} target="_blank" rel="noreferrer">
                Portfolio
              </a>
              <a href={CANDIDATE.links.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={CANDIDATE.links.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={`mailto:${CANDIDATE.email}`}>{CANDIDATE.email}</a>
            </p>
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap foot-inner">
          <p>
            <strong>Vote Saturday 14 November</strong>
            <span>
              {CANDIDATE.name} for {CANDIDATE.role}
            </span>
          </p>
          <p className="foot-tag">{CANDIDATE.hashtag}</p>
        </div>
      </footer>
    </>
  )
}
