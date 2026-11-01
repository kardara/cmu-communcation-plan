import { CANDIDATE, VOTE_DATE } from './config.js'

const TITLE = 'Vote for Abdoulaye · Communications Minister'
const DETAILS =
  'Today is the CMU-Africa Student Guild election. ' +
  `Tick the box for ${CANDIDATE.name}, Communications Minister. ` +
  `${CANDIDATE.tagline} ${CANDIDATE.hashtag}`

const ymd = (date) => date.replace(/-/g, '')

function nextDay(date) {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + 1)
  return d.toISOString().slice(0, 10)
}

// Google Calendar: opens a pre-filled event (reminders follow the user's Google defaults)
export function googleCalendarUrl() {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: TITLE,
    dates: `${ymd(VOTE_DATE)}/${ymd(nextDay(VOTE_DATE))}`,
    details: `${DETAILS}\n\n${window.location.origin}`,
    location: 'Carnegie Mellon University Africa, Kigali',
  })
  return `https://calendar.google.com/calendar/render?${params}`
}

// Apple Calendar / Outlook: an all-day event with two reminders
export function downloadIcs() {
  const escape = (s) => s.replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n')
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//VoteAbdoulaz//Campaign//EN',
    'BEGIN:VEVENT',
    'UID:vote-abdoulaz-2026@cmu-africa',
    'DTSTAMP:20261102T000000Z',
    `DTSTART;VALUE=DATE:${ymd(VOTE_DATE)}`,
    `DTEND;VALUE=DATE:${ymd(nextDay(VOTE_DATE))}`,
    `SUMMARY:${escape(TITLE)}`,
    `DESCRIPTION:${escape(`${DETAILS}\n\n${window.location.origin}`)}`,
    'LOCATION:Carnegie Mellon University Africa\\, Kigali',
    // The evening before, at 6 PM
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'TRIGGER:-PT6H',
    'DESCRIPTION:Tomorrow: remember to vote for Abdoulaye for Communications Minister.',
    'END:VALARM',
    // Voting morning, at 8 AM
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'TRIGGER:PT8H',
    'DESCRIPTION:It’s time to vote for Abdoulaye! Tick the box for clear communication.',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'vote-for-abdoulaye.ics'
  a.click()
  URL.revokeObjectURL(url)
}
