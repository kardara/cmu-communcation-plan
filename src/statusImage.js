import { CANDIDATE } from './config.js'

// Draws a 1080x1920 (9:16) status image styled as a ballot paper.
// Key content sits between y≈150 and y≈1780, clear of WhatsApp's status overlays.
const W = 1080
const H = 1920
const RED = '#c41230'
const INK = '#111111'
const SOFT = '#6b6b6b'
const LINE = '#e2ded8'
const PAD = 90

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function text(ctx, value, x, y, font, color, spacing = 0) {
  ctx.font = font
  ctx.fillStyle = color
  ctx.letterSpacing = `${spacing}px`
  ctx.fillText(value, x, y)
  ctx.letterSpacing = '0px'
}

// Portrait in an arch: a semicircle on top of a rectangle
function drawArchPhoto(ctx, img, x, y, w, h) {
  const r = w / 2
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(x, y + h)
  ctx.lineTo(x, y + r)
  ctx.arc(x + r, y + r, r, Math.PI, 0)
  ctx.lineTo(x + w, y + h)
  ctx.closePath()
  ctx.clip()
  const scale = Math.max(w / img.width, h / img.height)
  const sw = w / scale
  const sh = h / scale
  ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) * 0.2, sw, sh, x, y, w, h)
  ctx.restore()
}

function drawTick(ctx, x, y, size) {
  ctx.strokeStyle = RED
  ctx.lineWidth = 4
  ctx.strokeRect(x, y, size, size)
  ctx.lineWidth = 9
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(x + size * 0.2, y + size * 0.52)
  ctx.lineTo(x + size * 0.42, y + size * 0.74)
  ctx.lineTo(x + size * 0.84, y + size * 0.24)
  ctx.stroke()
}

export async function createStatusImage(timeLeft, voting = false) {
  await document.fonts.ready
  const photo = await loadImage('/candidate.jpg')

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = RED
  ctx.fillRect(0, 0, W, 14)

  // Header
  text(ctx, 'Carnegie Mellon University Africa', PAD, 170, '600 42px "Source Serif 4", serif', RED)
  text(ctx, 'STUDENT GUILD ELECTIONS 2026', PAD, 222, '700 22px "Open Sans", sans-serif', SOFT, 6)

  // Portrait
  const pw = 560
  const ph = 700
  drawArchPhoto(ctx, photo, (W - pw) / 2, 290, pw, ph)

  // Ballot card
  const cardX = PAD
  const cardY = 1060
  const cardW = W - PAD * 2
  const cardH = 330
  ctx.fillStyle = '#fff'
  ctx.fillRect(cardX, cardY - 40, cardW, cardH + 40)
  ctx.strokeStyle = INK
  ctx.lineWidth = 3
  ctx.strokeRect(cardX, cardY, cardW, cardH)
  ctx.fillStyle = INK
  ctx.fillRect(cardX, cardY, cardW, 70)
  text(ctx, 'BALLOT', cardX + 34, cardY + 46, '800 24px "Open Sans", sans-serif', '#fff', 8)
  ctx.textAlign = 'right'
  text(ctx, 'COMMUNICATIONS MINISTER', cardX + cardW - 34, cardY + 46, '700 22px "Open Sans", sans-serif', '#fff', 4)
  ctx.textAlign = 'left'

  drawTick(ctx, cardX + 40, cardY + 120, 96)
  text(ctx, 'Abdoulaye Zakaria', cardX + 170, cardY + 158, '800 54px "Open Sans", sans-serif', INK, -1)
  text(ctx, 'Djerou', cardX + 170, cardY + 218, '800 54px "Open Sans", sans-serif', INK, -1)
  text(ctx, CANDIDATE.tagline, cardX + 170, cardY + 280, 'italic 400 34px "Source Serif 4", serif', RED)

  // Countdown
  if (voting) {
    ctx.textAlign = 'center'
    text(ctx, 'Voting is open today', W / 2, 1530, '800 64px "Open Sans", sans-serif', RED, -1)
    ctx.textAlign = 'left'
  } else {
    const units = [
      [timeLeft.days, timeLeft.days === 1 ? 'day' : 'days'],
      [timeLeft.hours, timeLeft.hours === 1 ? 'hour' : 'hours'],
      [timeLeft.minutes, 'min'],
    ]
    const colW = (W - PAD * 2) / 3
    units.forEach(([value, label], i) => {
      const x = PAD + i * colW
      text(ctx, String(value).padStart(2, '0'), x, 1560, '800 104px "Open Sans", sans-serif', INK, -4)
      ctx.font = '800 104px "Open Sans", sans-serif'
      ctx.letterSpacing = '-4px'
      const w = ctx.measureText(String(value).padStart(2, '0')).width
      ctx.letterSpacing = '0px'
      text(ctx, label, x + w + 10, 1560, '600 30px "Open Sans", sans-serif', SOFT)
    })
    text(ctx, 'until voting opens on Saturday 14 November', PAD, 1620, '400 30px "Open Sans", sans-serif', SOFT)
  }

  // Footer
  ctx.fillStyle = LINE
  ctx.fillRect(PAD, 1680, W - PAD * 2, 2)
  text(ctx, 'VOTE SAT 14 NOV', PAD, 1752, '800 30px "Open Sans", sans-serif', INK, 4)
  ctx.textAlign = 'right'
  text(ctx, CANDIDATE.hashtag, W - PAD, 1752, '800 38px "Open Sans", sans-serif', RED)
  ctx.textAlign = 'left'

  ctx.fillStyle = RED
  ctx.fillRect(0, H - 14, W, 14)

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
}

// Opens the share sheet with the image on phones; downloads it elsewhere.
export async function shareStatusImage(timeLeft, voting) {
  const blob = await createStatusImage(timeLeft, voting)
  const file = new File([blob], 'vote-abdoulaz-status.png', { type: 'image/png' })
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Vote Abdoulaz' })
      return
    } catch (err) {
      if (err.name === 'AbortError') return
    }
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  a.click()
  URL.revokeObjectURL(url)
}
