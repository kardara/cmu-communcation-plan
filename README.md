# Vote Abdoulaz · Communications Minister · CMU-Africa

Campaign site for **Abdoulaye Zakaria Djerou**, candidate for Communications Minister,
CMU-Africa Student Guild Elections 2026. Vote: **14 November 2026**.

- Countdown to voting day, the three commitments, weekly rhythm, Student Spotlight, "where to go" guide
- **Post to status**: 1080×1920 image with a live countdown for WhatsApp / Instagram status
- Link preview card for WhatsApp / LinkedIn

The full campaign plan is in [PLAN.md](PLAN.md).

## Run locally

```bash
npm install
npm run dev
```

## Student Spotlight form

`scripts/create-spotlight-form.gs` creates the Google Form and its response sheet:
open https://script.google.com, paste the file, run `createSpotlightForm`, and copy the form link
from the log into `SPOTLIGHT_FORM_URL` in `src/config.js`. Until then, "Get featured" opens an email.

For project recordings, create a Google Calendar appointment schedule and paste its link into `BOOKING_URL`.

## Deploy

Import the repo on [vercel.com/new](https://vercel.com/new) and keep the defaults.
