import { CANDIDATE } from './config.js'

// Draws a 1080x1920 (9:16) status image: tartan header, portrait, the number of days
// left to vote, and a ticked ballot. Content sits between y≈140 and y≈1790,
// clear of WhatsApp's status overlays.
const W = 1080
const H = 1920
const RED = '#c41230'
const INK = '#111111'
const SOFT = '#6b6b6b'
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

function archPath(ctx, x, y, w, h) {
  const r = w / 2
  ctx.beginPath()
  ctx.moveTo(x, y + h)
  ctx.lineTo(x, y + r)
  ctx.arc(x + r, y + r, r, Math.PI, 0)
  ctx.lineTo(x + w, y + h)
  ctx.closePath()
}

function drawPortrait(ctx, img, x, y, w, h) {
  const border = 14
  ctx.fillStyle = '#fff'
  archPath(ctx, x - border, y - border, w + border * 2, h + border)
  ctx.fill()
  ctx.save()
  archPath(ctx, x, y, w, h)
  ctx.clip()
  const scale = Math.max(w / img.width, h / img.height)
  const sw = w / scale
  const sh = h / scale
  ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) * 0.2, sw, sh, x, y, w, h)
  ctx.restore()
}

function drawTick(ctx, x, y, size) {
  ctx.strokeStyle = RED
  ctx.lineWidth = 5
  ctx.strokeRect(x, y, size, size)
  ctx.lineWidth = 10
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(x + size * 0.22, y + size * 0.52)
  ctx.lineTo(x + size * 0.42, y + size * 0.72)
  ctx.lineTo(x + size * 0.8, y + size * 0.28)
  ctx.stroke()
}

export async function createStatusImage(days) {
  await document.fonts.ready
  const [photo, tartan] = await Promise.all([loadImage('/candidate.jpg'), loadImage('/tartan.svg')])

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, W, H)

  // Tartan header
  const tile = document.createElement('canvas')
  tile.width = 200
  tile.height = 200
  tile.getContext('2d').drawImage(tartan, 0, 0, 200, 200)
  ctx.fillStyle = ctx.createPattern(tile, 'repeat')
  ctx.fillRect(0, 0, W, 760)
  ctx.fillRect(0, H - 34, W, 34)

  ctx.textAlign = 'center'
  text(ctx, 'Carnegie Mellon University Africa', W / 2, 160, '600 46px "Source Serif 4", serif', '#fff')
  text(ctx, 'STUDENT GUILD ELECTIONS 2026', W / 2, 214, '700 22px "Open Sans", sans-serif', 'rgba(255,255,255,0.8)', 6)

  // Portrait sitting on the edge of the tartan
  drawPortrait(ctx, photo, (W - 420) / 2, 290, 420, 520)

  // Days to vote
  if (days > 0) {
    text(ctx, String(days), W / 2, 1180, '800 330px "Open Sans", sans-serif', RED, -14)
    text(ctx, days === 1 ? 'DAY TO VOTE' : 'DAYS TO VOTE', W / 2 + 8, 1262, '800 44px "Open Sans", sans-serif', INK, 12)
  } else {
    text(ctx, 'Today', W / 2, 1140, '800 230px "Open Sans", sans-serif', RED, -8)
    text(ctx, 'VOTING IS OPEN', W / 2 + 8, 1232, '800 44px "Open Sans", sans-serif', INK, 12)
  }
  text(ctx, 'Saturday 14 November', W / 2, 1318, '600 34px "Open Sans", sans-serif', SOFT)
  ctx.textAlign = 'left'

  // Ballot
  const bx = PAD
  const by = 1400
  const bw = W - PAD * 2
  const bh = 300
  ctx.strokeStyle = INK
  ctx.lineWidth = 3
  ctx.strokeRect(bx, by, bw, bh)
  ctx.fillStyle = INK
  ctx.fillRect(bx, by, bw, 68)
  text(ctx, 'BALLOT', bx + 32, by + 44, '800 24px "Open Sans", sans-serif', '#fff', 8)
  ctx.textAlign = 'right'
  text(ctx, 'COMMUNICATIONS MINISTER', bx + bw - 32, by + 44, '700 22px "Open Sans", sans-serif', '#fff', 4)
  ctx.textAlign = 'left'
  drawTick(ctx, bx + 36, by + 116, 100)
  text(ctx, 'Abdoulaye Zakaria', bx + 168, by + 152, '800 52px "Open Sans", sans-serif', INK, -1)
  text(ctx, 'Djerou', bx + 168, by + 210, '800 52px "Open Sans", sans-serif', INK, -1)
  text(ctx, CANDIDATE.tagline, bx + 168, by + 262, 'italic 400 34px "Source Serif 4", serif', RED)

  ctx.textAlign = 'center'
  text(ctx, CANDIDATE.hashtag, W / 2, 1790, '800 46px "Open Sans", sans-serif', RED)
  ctx.textAlign = 'left'

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
}

// Opens the share sheet with the image on phones; downloads it elsewhere.
export async function shareStatusImage(days) {
  const blob = await createStatusImage(days)
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
