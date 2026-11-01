// Everything you may need to change lives here.

// Voting day, Kigali time. The hour isn't shown anywhere until it is confirmed.
export const VOTE_DAY = new Date('2026-11-14T08:00:00+02:00')

// Paste the Google Form link here after running scripts/create-spotlight-form.gs.
// While empty, the "Get featured" buttons point to the email below instead.
export const SPOTLIGHT_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeZOwe0aApBj-8XmfP3yMVDb2Q8sJm2NruQaprpys6N5x096Q/viewform'

// Booking link for project-showcase recordings (e.g. a Google Calendar appointment schedule).
export const BOOKING_URL = ''

export const CANDIDATE = {
  name: 'Abdoulaye Zakaria Djerou',
  short: 'Abdoulaz',
  role: 'Communications Minister',
  program: 'MSIT',
  from: 'N’Djamena, Chad',
  tagline: 'Clear. Consistent. Connected.',
  hashtag: '#VoteAbdoulaz',
  email: 'azdjerou@gmail.com',
  links: {
    portfolio: 'https://kardara.vercel.app',
    linkedin: 'https://www.linkedin.com/in/abdoulaye-zakaria-djerou-022613327',
    github: 'https://github.com/kardara',
  },
}

export const mailtoFeature = `mailto:${CANDIDATE.email}?subject=${encodeURIComponent('Student Spotlight: I want to be featured')}`
