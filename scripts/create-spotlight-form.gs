/**
 * Creates the "Student Spotlight" Google Form and a linked response spreadsheet.
 *
 * How to use:
 *   1. Go to https://script.google.com and create a new project.
 *   2. Paste this whole file in, replacing the default code, and save.
 *   3. Choose the function `createSpotlightForm` and click Run (approve the permissions).
 *   4. Open View → Logs (or Execution log): it prints the form link, the edit link and the sheet link.
 *   5. Put the form link in src/config.js → SPOTLIGHT_FORM_URL.
 */

const PROGRAMS = ['MSIT', 'MS ECE', 'MS EAI', 'Other']
const CLASSES = ['Class of 2026', 'Class of 2027', 'Class of 2028', 'Other']
const COUNTRIES = [
  'Angola', 'Benin', 'Burundi', 'Cameroon', 'Chad', 'DR Congo', 'Egypt', 'Eswatini', 'Ethiopia',
  'The Gambia', 'Ghana', 'Kenya', 'Liberia', 'Madagascar', 'Malawi', 'Mali', 'Niger', 'Nigeria',
  'Rwanda', 'Senegal', 'Sierra Leone', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania',
  'Uganda', 'Zambia', 'Zimbabwe', 'Other',
]
const INTERESTS = [
  'AI & machine learning', 'Software engineering', 'Cybersecurity', 'Data science',
  'Hardware & embedded systems', 'Robotics', 'Entrepreneurship', 'Research',
  'Design & product', 'Community & leadership', 'Arts & culture', 'Sports & wellness',
]

function createSpotlightForm() {
  const form = FormApp.create('Student Spotlight · CMU-Africa')
  form
    .setDescription(
      'Every student has a story worth sharing. Fill this in (about 3 minutes) and you could be our ' +
        'Student of the Week, posted on the weekend across our social media. No project needed. ' +
        'Built something? Tell us and we can record a showcase together.'
    )
    .setProgressBar(true)
    .setConfirmationMessage(
      'Thank you! We will reach out before anything is published, and you will approve your feature first.'
    )

  // ---- Page 1: About you ----
  form.addSectionHeaderItem().setTitle('About you')
  form.addTextItem().setTitle('Full name').setRequired(true)
  form
    .addTextItem()
    .setTitle('Andrew email')
    .setHelpText('e.g. yourid@andrew.cmu.edu, so we can contact you before publishing')
    .setValidation(
      FormApp.createTextValidation()
        .requireTextMatchesPattern('^[A-Za-z0-9._%+-]+@andrew\\.cmu\\.edu$')
        .setHelpText('Please use your @andrew.cmu.edu email')
        .build()
    )
    .setRequired(true)
  form.addMultipleChoiceItem().setTitle('Program').setChoiceValues(PROGRAMS).setRequired(true)
  form.addMultipleChoiceItem().setTitle('Class').setChoiceValues(CLASSES).setRequired(true)
  form.addListItem().setTitle('Country').setChoiceValues(COUNTRIES).setRequired(true)
  form
    .addCheckboxItem()
    .setTitle('Interests')
    .setHelpText('Pick up to 4')
    .setChoiceValues(INTERESTS)
    .showOtherOption(true)
    .setValidation(FormApp.createCheckboxValidation().requireSelectAtMost(4).build())
  form
    .addParagraphTextItem()
    .setTitle('Tell us about yourself')
    .setHelpText('A short description in your own words (max ~80 words). What drives you? What are you proud of?')
    .setValidation(FormApp.createParagraphTextValidation().requireTextLengthLessThanOrEqualTo(600).build())
    .setRequired(true)
  form.addTextItem().setTitle('A fun fact or something you love outside class').setHelpText('Optional')

  const hasProject = form
    .addMultipleChoiceItem()
    .setTitle('Do you have a project you would like to showcase?')
    .setRequired(true)

  // ---- Page 2: Your project (only if "Yes") ----
  const projectPage = form.addPageBreakItem().setTitle('Your project')
  form.addTextItem().setTitle('Project title').setRequired(true)
  form
    .addParagraphTextItem()
    .setTitle('What does it do, and why does it matter?')
    .setValidation(FormApp.createParagraphTextValidation().requireTextLengthLessThanOrEqualTo(800).build())
    .setRequired(true)
  form.addTextItem().setTitle('Links (GitHub, demo, paper…)').setHelpText('Optional')
  form.addTextItem().setTitle('Team members (if any)').setHelpText('Optional')
  form
    .addMultipleChoiceItem()
    .setTitle('Would you like to record a short showcase video together?')
    .setHelpText('If yes, we will send you a link to book a recording slot.')
    .setChoiceValues(['Yes', 'Maybe', 'No, a written feature is fine'])
    .setRequired(true)

  // ---- Page 3: Publishing ----
  const publishPage = form.addPageBreakItem().setTitle('Publishing')
  form
    .addTextItem()
    .setTitle('Link to a photo you would like us to use')
    .setHelpText('Optional: a Google Drive / LinkedIn photo link. Leave empty and we can take one together.')
  form
    .addParagraphTextItem()
    .setTitle('Social handles to tag')
    .setHelpText('Optional: LinkedIn URL, Instagram, X…')
  form
    .addCheckboxItem()
    .setTitle('Consent')
    .setChoiceValues([
      'I agree that my name, photo and the information above may be published on CMU-Africa student ' +
        'social media channels, after I approve the final post.',
    ])
    .setRequired(true)

  // "Yes" goes to the project page; "No" skips straight to publishing
  hasProject.setChoices([
    hasProject.createChoice('Yes', projectPage),
    hasProject.createChoice('No, just me for now', publishPage),
  ])

  // Responses go to a new spreadsheet
  const sheet = SpreadsheetApp.create('Student Spotlight · Responses')
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId())

  Logger.log('Share this link:  ' + form.getPublishedUrl())
  Logger.log('Edit the form:    ' + form.getEditUrl())
  Logger.log('Responses sheet:  ' + sheet.getUrl())
}
