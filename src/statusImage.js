import { CANDIDATE } from './config.js'

// Draws a 1080x1920 (9:16) image sized for WhatsApp / Instagram status.
// Key content sits between y≈150 and y≈1780, clear of WhatsApp's status overlays.
const W = 1080
const H = 1920
const RED = '#c41230'
const DEEP = '#7e0318'
const INK = '#111111'
const PAD = 80

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

function drawPlaid(ctx, y, h) {
  ctx.fillStyle = '#14213d'
  ctx.fillRect(0, y, W, h)
  const stripes = [
    [22, 3, 'rgba(196,18,48,0.9)'],
    [48, 2, 'rgba(30,122,76,0.85)'],
    [70, 1, 'rgba(224,165,38,0.8)'],
  ]
  for (let x0 = 0; x0 < W; x0 += 90) {
    stripes.forEach(([dx, w, c]) => {
      ctx.fillStyle = c
      ctx.fillRect(x0 + dx, y, w * 1.5, h)
    })
  }
  for (let y0 = y; y0 < y + h; y0 += 26) {
    ctx.fillStyle = 'rgba(59,142,224,0.55)'
    ctx.fillRect(0, y0 + 8, W, 3)
  }
}

export async function createStatusImage(timeLeft, voting = false) {
  await document.fonts.ready
  const photo = await loadImage('/candidate.jpg')

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // Red stage with the photo's own backdrop blended in
  const bg = ctx.createLinearGradient(0, 0, 0, 1180)
  bg.addColorStop(0, '#3a0509')
  bg.addColorStop(0.6, DEEP)
  bg.addColorStop(1, '#7a0216')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, 1180)
  const glow = ctx.createRadialGradient(700, 520, 40, 700, 520, 560)
  glow.addColorStop(0, 'rgba(176,4,47,0.9)')
  glow.addColorStop(1, 'rgba(176,4,47,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, 1180)

  // Photo, faded at its edges so its red background melts into the stage
  const ph = 1000
  const pw = (photo.width / photo.height) * ph
  const px = W - pw + 60
  const py = 1180 - ph
  const off = document.createElement('canvas')
  off.width = pw
  off.height = ph
  const octx = off.getContext('2d')
  octx.drawImage(photo, 0, 0, pw, ph)
  octx.globalCompositeOperation = 'destination-in'
  const sides = octx.createLinearGradient(0, 0, pw, 0)
  sides.addColorStop(0, 'rgba(0,0,0,0)')
  sides.addColorStop(0.3, 'rgba(0,0,0,1)')
  sides.addColorStop(0.78, 'rgba(0,0,0,1)')
  sides.addColorStop(1, 'rgba(0,0,0,0)')
  octx.fillStyle = sides
  octx.fillRect(0, 0, pw, ph)
  const top = octx.createLinearGradient(0, 0, 0, ph)
  top.addColorStop(0, 'rgba(0,0,0,0)')
  top.addColorStop(0.28, 'rgba(0,0,0,1)')
  octx.fillStyle = top
  octx.fillRect(0, 0, pw, ph)
  ctx.drawImage(off, px, py)

  text(ctx, 'Carnegie Mellon', PAD, 170, '600 48px "Source Serif 4", serif', '#fff')
  text(ctx, 'University Africa', PAD, 226, '600 48px "Source Serif 4", serif', '#fff')
  text(ctx, 'STUDENT GUILD ELECTIONS 2026', PAD, 290, '700 22px "Open Sans", sans-serif', 'rgba(255,255,255,0.8)', 6)

  text(ctx, 'RUNNING FOR', PAD, 830, '700 24px "Open Sans", sans-serif', 'rgba(255,255,255,0.8)', 7)
  text(ctx, 'Communications', PAD, 920, '800 84px "Open Sans", sans-serif', '#fff', -2)
  text(ctx, 'Minister', PAD, 1005, '800 84px "Open Sans", sans-serif', '#fff', -2)

  // White lower panel
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 1180, W, H - 1180)
  ctx.fillStyle = INK
  ctx.fillRect(PAD, 1146, 150, 68)
  text(ctx, 'VOTE', PAD + 28, 1192, '800 32px "Open Sans", sans-serif', '#fff', 6)

  text(ctx, CANDIDATE.name, PAD, 1300, '800 62px "Open Sans", sans-serif', INK, -1.5)
  text(ctx, CANDIDATE.tagline, PAD, 1356, 'italic 400 40px "Source Serif 4", serif', RED)

  // Countdown to voting day: days / hours / minutes
  if (voting) {
    text(ctx, 'Voting is open today', PAD, 1520, '800 72px "Open Sans", sans-serif', RED, -1.5)
  } else {
    const units = [
      [timeLeft.days, timeLeft.days === 1 ? 'DAY' : 'DAYS'],
      [timeLeft.hours, timeLeft.hours === 1 ? 'HOUR' : 'HOURS'],
      [timeLeft.minutes, 'MINUTES'],
    ]
    text(ctx, 'VOTING DAY · 14 NOVEMBER', PAD, 1440, '700 24px "Open Sans", sans-serif', '#555', 6)
    const colW = (W - PAD * 2) / 3
    units.forEach(([value, label], i) => {
      const x = PAD + i * colW
      ctx.fillStyle = i === 0 ? RED : INK
      ctx.fillRect(x, 1466, colW - 28, 6)
      text(ctx, String(value).padStart(2, '0'), x - 4, 1580, '800 110px "Open Sans", sans-serif', INK, -4)
      text(ctx, label, x, 1620, '700 22px "Open Sans", sans-serif', RED, 6)
    })
  }

  // Commitments
  const items = ['Weekly Guild updates', 'Student spotlights', 'Every voice heard']
  ctx.strokeStyle = '#e6e2dc'
  ctx.lineWidth = 2
  items.forEach((item, i) => {
    const y = 1668 + i * 40
    text(ctx, `0${i + 1}`, PAD, y + 26, '800 20px "Open Sans", sans-serif', RED)
    text(ctx, item, PAD + 46, y + 27, '700 28px "Open Sans", sans-serif', INK)
  })
  ctx.textAlign = 'right'
  text(ctx, CANDIDATE.hashtag, W - PAD, 1748, '800 40px "Open Sans", sans-serif', RED)
  ctx.textAlign = 'left'

  drawPlaid(ctx, H - 36, 36)

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
