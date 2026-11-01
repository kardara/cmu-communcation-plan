// Everything you may need to change lives here.

// Voting day (Kigali date). The countdown is in whole days: "13 days to vote", then "Today".
export const VOTE_DATE = '2026-11-14'

// Student Spotlight form (created with scripts/create-spotlight-form.gs).
export const SPOTLIGHT_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeZOwe0aApBj-8XmfP3yMVDb2Q8sJm2NruQaprpys6N5x096Q/viewform'

// Booking link for project-showcase recordings (e.g. a Google Calendar appointment schedule).
export const BOOKING_URL = ''

export const CANDIDATE = {
  name: 'Abdoulaye Zakaria Djerou',
  role: 'Communications Minister',
  tagline: 'Clear. Consistent. Connected.',
  hashtag: '#VoteAbdoulaz',
}

// Start of voting day in Kigali; the web counter runs down to this moment
export const VOTE_START = new Date(`${VOTE_DATE}T00:00:00+02:00`)

// Whole days from today (in Kigali) until voting day; 0 on the day itself
export function daysToVote(now = new Date()) {
  const today = now.toLocaleDateString('en-CA', { timeZone: 'Africa/Kigali' })
  return Math.max(0, Math.round((Date.parse(VOTE_DATE) - Date.parse(today)) / 86400000))
}
