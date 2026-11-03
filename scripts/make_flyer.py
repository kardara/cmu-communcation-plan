"""Builds the printable A4 campaign flyer: flyer/flyer.html, flyer/flyer.pdf and flyer/flyer.png.

Usage: python3 scripts/make_flyer.py [site-url]
Needs the `qrcode` Python package and Google Chrome.
"""
import pathlib
import subprocess
import sys

import qrcode

URL = sys.argv[1] if len(sys.argv) > 1 else 'https://abdoulaz.vercel.app'
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'flyer'
CHROME = 'google-chrome'

COMMITMENTS = [
    ('Weekly Guild updates', 'One clear post every Monday with the week’s events, deadlines and Guild decisions.'),
    ('Student stories', 'Student of the Week, a Sunday project showcase and a monthly student magazine.'),
    ('Every voice heard', 'One Student Guide with every process and contact, and suggestions answered monthly.'),
]


def qr_svg(url):
    # Square modules drawn as one path, with the standard 4-module quiet zone
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_Q, border=4)
    qr.add_data(url)
    qr.make(fit=True)
    rows = qr.get_matrix()
    size = len(rows)
    cells = ''.join(f'M{x} {y}h1v1h-1z' for y, row in enumerate(rows) for x, on in enumerate(row) if on)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" shape-rendering="crispEdges">'
        f'<rect width="{size}" height="{size}" fill="#fff"/><path d="{cells}" fill="#111"/></svg>'
    )


def page():
    display_url = URL.removeprefix('https://').removeprefix('http://').rstrip('/')
    commitments = ''.join(
        f'<li><span class="num">{i}</span><h3>{title}</h3><p>{text}</p></li>'
        for i, (title, text) in enumerate(COMMITMENTS, 1)
    )
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Vote Abdoulaz flyer</title>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&family=Source+Serif+4:ital,wght@0,600;1,400&display=swap" rel="stylesheet">
<style>
  @page {{ size: A4; margin: 0; }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  html, body {{ width: 210mm; height: 297mm; }}
  body {{
    font-family: 'Open Sans', Helvetica, Arial, sans-serif;
    color: #111;
    background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }}
  .sheet {{ position: relative; width: 210mm; height: 297mm; overflow: hidden; }}
  .tartan {{ background: url('../public/tartan.svg') repeat 0 0 / 24mm 24mm; }}

  /* Top half: text on the left, the photo full-bleed on the right */
  .top {{ position: relative; height: 150mm; }}
  .top-strip {{ position: absolute; left: 0; right: 0; top: 0; height: 7mm; }}
  .photo {{ position: absolute; top: 7mm; right: 0; bottom: 0; width: 98mm; overflow: hidden; background: #a6192e; }}
  .photo img {{ width: 100%; height: 100%; object-fit: cover; object-position: 50% 12%; display: block; }}
  .photo-caption {{
    position: absolute; left: 0; right: 0; bottom: 0; padding: 18mm 7mm 6mm; color: #fff;
    background: linear-gradient(to top, rgba(10, 12, 24, 0.88), rgba(10, 12, 24, 0));
  }}
  .photo-caption strong {{ display: block; font-size: 15pt; font-weight: 800; line-height: 1.2; }}
  .photo-caption span {{ display: block; margin-top: 1mm; font-size: 8pt; font-weight: 700; letter-spacing: 0.2em; opacity: 0.9; }}

  .intro {{ position: absolute; top: 7mm; left: 16mm; width: 82mm; bottom: 0; display: flex; flex-direction: column; }}
  .school {{ margin-top: 11mm; font-family: 'Source Serif 4', Georgia, serif; font-weight: 600; font-size: 13pt; }}
  .event {{ margin-top: 1.5mm; font-size: 7.5pt; font-weight: 700; letter-spacing: 0.24em; color: #666; }}

  .position {{ margin-top: 10mm; border-left: 1.6mm solid #c41230; padding-left: 4mm; }}
  .position small {{ display: block; font-size: 8pt; font-weight: 700; letter-spacing: 0.24em; color: #666; }}
  .position strong {{ display: block; margin-top: 1mm; font-size: 23pt; font-weight: 800; line-height: 1.05; color: #c41230; letter-spacing: -0.01em; }}

  h1 {{ margin-top: auto; font-size: 37pt; font-weight: 800; line-height: 1; letter-spacing: -0.025em; }}
  h1 .red {{ color: #c41230; }}
  .pitch {{ margin-top: 4.5mm; font-size: 11pt; line-height: 1.45; color: #333; }}
  .pitch strong {{ color: #111; }}

  .main {{ padding: 0 16mm; }}
  .commitments {{ list-style: none; display: grid; grid-template-columns: repeat(3, 1fr); gap: 7mm; margin-top: 9mm; }}
  .commitments li {{ border-top: 0.6mm solid #111; padding-top: 3.5mm; }}
  .num {{ font-size: 20pt; font-weight: 800; color: #c41230; line-height: 1; }}
  .commitments h3 {{ margin-top: 2mm; font-size: 11pt; font-weight: 800; }}
  .commitments p {{ margin-top: 1.5mm; font-size: 9pt; line-height: 1.45; color: #555; }}

  .bottom {{ display: grid; grid-template-columns: 1fr 58mm; gap: 8mm; align-items: stretch; margin: 8mm 16mm 0; }}
  .ballot {{ border: 0.6mm solid #111; display: flex; flex-direction: column; }}
  .ballot-head {{
    display: flex; justify-content: space-between; background: #111; color: #fff;
    padding: 2.4mm 4mm; font-size: 7.5pt; font-weight: 800; letter-spacing: 0.2em;
  }}
  .ballot-body {{ flex: 1; display: flex; align-items: center; gap: 5mm; padding: 4mm 5mm; }}
  .tick {{ flex: none; width: 17mm; height: 17mm; }}
  .name {{ font-size: 16pt; font-weight: 800; line-height: 1.15; }}
  .tagline {{ margin-top: 1.2mm; font-family: 'Source Serif 4', Georgia, serif; font-style: italic; font-size: 12pt; color: #c41230; }}
  .date {{
    background: #c41230; color: #fff; padding: 3.2mm 5mm;
    font-size: 12pt; font-weight: 800; letter-spacing: 0.02em;
  }}

  .scan {{ border: 0.6mm solid #111; text-align: center; padding: 3.5mm 4mm 3mm; }}
  .scan svg {{ display: block; width: 44mm; height: 44mm; margin: 0 auto; }}
  .scan strong {{ display: block; margin-top: 1mm; font-size: 10.5pt; font-weight: 800; }}
  .scan span {{ display: block; margin-top: 0.6mm; font-size: 8.5pt; color: #555; }}

  .foot {{
    margin: 5mm 16mm 0;
    display: flex; justify-content: space-between; align-items: baseline;
    border-top: 0.3mm solid #e2dfda; padding-top: 4mm; font-size: 9pt; color: #555;
  }}
  .foot strong {{ font-size: 15pt; font-weight: 800; color: #c41230; }}
  .strip {{ position: absolute; left: 0; right: 0; bottom: 0; height: 9mm; }}
</style>
</head>
<body>
<div class="sheet">
  <section class="top">
    <div class="top-strip tartan"></div>
    <div class="intro">
      <p class="school">Carnegie Mellon University Africa</p>
      <p class="event">STUDENT GUILD ELECTIONS 2026</p>
      <div class="position">
        <small>CANDIDATE FOR</small>
        <strong>Communications<br>Minister</strong>
      </div>
      <h1>Clear.<br>Consistent.<br><span class="red">Connected.</span></h1>
      <p class="pitch">A Guild that speaks to every student, every week: on time, in one place, for everyone.</p>
    </div>
    <div class="photo">
      <img src="../public/candidate.jpg" alt="">
      <div class="photo-caption">
        <strong>Abdoulaye Zakaria Djerou</strong>
        <span>COMMUNICATIONS MINISTER</span>
      </div>
    </div>
  </section>

  <main class="main">
    <ul class="commitments">{commitments}</ul>
  </main>

  <section class="bottom">
    <div class="ballot">
      <div class="ballot-head"><span>BALLOT</span><span>COMMUNICATIONS MINISTER</span></div>
      <div class="ballot-body">
        <svg class="tick" viewBox="0 0 100 100" aria-hidden="true">
          <rect x="3" y="3" width="94" height="94" fill="none" stroke="#c41230" stroke-width="6"/>
          <path d="M22 52 L42 72 L80 28" fill="none" stroke="#c41230" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div>
          <p class="name">Abdoulaye Zakaria Djerou</p>
          <p class="tagline">Tick the box for clear communication.</p>
        </div>
      </div>
      <p class="date">Vote Saturday 14 November</p>
    </div>
    <div class="scan">
      {qr_svg(URL)}
      <strong>Scan for the full plan</strong>
      <span>{display_url}</span>
    </div>
  </section>

  <footer class="foot">
    <span>Weekly updates · Student stories · One Student Guide</span>
    <strong>#VoteAbdoulaz</strong>
  </footer>
  <div class="strip tartan"></div>
</div>
</body>
</html>
'''


def main():
    OUT.mkdir(exist_ok=True)
    html = OUT / 'flyer.html'
    html.write_text(page(), encoding='utf-8')
    common = [CHROME, '--headless=new', '--disable-gpu', '--allow-file-access-from-files',
              '--virtual-time-budget=8000', '--hide-scrollbars']
    subprocess.run(common + ['--no-pdf-header-footer', f'--print-to-pdf={OUT / "flyer.pdf"}', html.as_uri()],
                   check=True, capture_output=True)
    # Preview image at A4 proportions (794x1123 CSS px = 210x297mm)
    subprocess.run(common + ['--window-size=794,1123', '--force-device-scale-factor=2',
                             f'--screenshot={OUT / "flyer.png"}', html.as_uri()],
                   check=True, capture_output=True)
    print(f'Flyer for {URL} written to {OUT}')


if __name__ == '__main__':
    main()
