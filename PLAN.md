# Campaign plan · Abdoulaye Zakaria Djerou for Communications Minister

**Vote: Saturday, 14 November 2026** · CMU-Africa Student Guild Elections
**Message:** *Clear. Consistent. Connected.* · **Hashtag:** #VoteAbdoulaz

---

## 1. The role, and the gap I'm running to close

The Communications Minister is the Guild's spokesperson. They produce the Guild's publications and
make sure students hear about every event, talk and opportunity. The Guild itself exists to connect
students with the administration, so communication is at the heart of its job.

The gap students feel is not a lack of information. Information is scattered across too many groups,
arrives at unpredictable times, and it is not always clear who to ask. My platform fixes the
**rhythm**, the **reach** and the **routes**.

## 2. Platform: three commitments

### 01 · Weekly Guild updates (clear, consistent)
- **Every Monday: "This Week at CMU-Africa".** One post with this week's events, deadlines,
  opportunities and Guild decisions.
- **Every Thursday: reminders.** Last calls, changes and anything new.
- **Same template, same time, every channel at once:** WhatsApp community, Instagram, LinkedIn, X and email.
- **One shared calendar** for ministers and clubs to submit items by **Friday 5 PM** for the next Monday.

### 02 · Student spotlights (connected)
- **Saturday: Student of the Week.** Any student can be featured, with or without a project:
  name, program, class, country, interests and a short story.
- **Sunday: Project Showcase,** when a student has something to show. We record a short demo
  together (book a slot), then edit and post it.
- **Fair coverage:** we rotate across MSIT / MS ECE / MS EAI, every class and every country.
- **Consent first:** nothing is published until the student approves the final post.

### 03 · Every voice heard (know where to go)
- **One link for everything:** a single page with every Guild contact, form, channel and the weekly calendar.
- **"Who handles what" guide:** academics → Academic Affairs & Research; events → Social Affairs;
  funding → Finance; wellbeing → Sports & Wellness; exchange → International Affairs; announcements → Communications.
- **An open suggestion box,** with a monthly "You asked, we answered" post.
- **Response promise:** messages to Communications are answered within 48 hours on weekdays.

## 3. How the Student Spotlight runs (automated with Claude)

```
Google Form ──► Google Sheet ──► Claude drafts posts ──► Student approves ──► Scheduled for the weekend
 (3 minutes)    (all responses)   (one per platform)      (by email)          (Sat 10:00 / Sun 10:00)
```

1. **Collect:** the form (`scripts/create-spotlight-form.gs`) asks for name, Andrew email, program,
   class, country, interests, a short bio, an optional project, an optional photo link, social handles and consent.
2. **Pick:** every Wednesday, choose Saturday's student and Sunday's project from the sheet,
   rotating program, class and country.
3. **Draft:** Claude turns the form answers into a post for each platform, following the brief below.
4. **Approve:** send the draft to the student by Thursday, and publish only after their OK.
5. **Record (projects):** a 15-minute recording slot, booked through the booking link on the site.
6. **Publish:** schedule everything for the weekend, and reuse it in Monday's update ("Meet last week's spotlight").

**Phase 1 (now):** form + sheet, with drafts made by pasting a response into Claude using the brief below.
**Phase 2 (after election):** a Google Sheets button that sends a response to the Claude API and
writes the drafts back into the sheet, ready for review.

### Drafting brief for Claude
> You are drafting a Student of the Week post for the CMU-Africa Student Guild.
> Using the form response below, write: (1) an Instagram caption (≤ 120 words, warm, 3 to 5 hashtags
> including #CMUAfrica #StudentOfTheWeek), (2) a LinkedIn post (≤ 150 words, professional, tag-ready),
> (3) a WhatsApp message (≤ 60 words). Use only facts from the response; do not invent achievements.
> Mention program, class and country. End with "Want to be featured? [form link]".
> Response: …

## 4. Campaign timeline (1 to 14 November)

| When | What |
|---|---|
| **Sun 2 Nov** | Publish the campaign site + flyer. Post on LinkedIn and in WhatsApp groups (with permission). |
| **Mon 3 Nov** | Launch the Spotlight form as a pilot: "Be among the first featured". |
| **3 to 7 Nov** | Short class / lab visits (2 minutes: the three commitments + QR code to the site). |
| **Thu 5 Nov** | Culture Connect: show up, take part, and talk to students. No hard campaigning at a community event. |
| **8 and 9 Nov** | Weekend demo: publish one sample "Student of the Week" (with consent) to show the plan working. |
| **10 to 12 Nov** | Debates / candidate sessions: lead with the weekly rhythm and the one-link idea. |
| **Fri 13 Nov** | Final push: status image with the countdown; personal messages to people you've met. |
| **Sat 14 Nov** | **Vote.** A thank-you post afterwards, whatever the result. |

**Daily during the campaign:** share the status image (it updates the countdown automatically),
answer every message, and log good ideas from students into the plan.

## 5. First 30 days in office
- **Week 1:** launch the one-link page and the "who handles what" guide; agree the Friday-5 PM submission rule with all ministers.
- **Week 2:** first Monday update; first official Student of the Week.
- **Week 3:** open the suggestion box; set up the booking calendar for project recordings.
- **Week 4:** first "You asked, we answered" post; share simple numbers (reach, features, responses).

## 6. How we'll measure it
- 52 Monday updates a year, never skipped.
- At least 40 students featured in the first semester, across all programs, classes and countries.
- Replies within 48 hours on weekdays.
- A short survey each semester: "Do you know where to find information?" (target: 90% yes).

## 7. Before launching: check
- **Election rules:** confirm with the Guild / Student Affairs what campaign materials and channels are allowed,
  and whether collecting spotlight sign-ups during the campaign is OK (if not, launch the form after the vote).
- **Branding:** confirm you may use "Carnegie Mellon University Africa" on campaign materials.
- **Data:** keep responses private (only you and the communications team), use them only for spotlights,
  and delete them on request.
