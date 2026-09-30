# robot-uprising-hq.github.io

The website for [Robot Uprising](https://robotuprising.fi). A plain
static site (no framework, no build step) served via GitHub Pages on the
`robotuprising.fi` custom domain.

## Running locally

Easiest: open index.html in browser.


With Node, automatically refreshes for changes:

```
npx live-server --port=8000 --host=0.0.0.0 
```

With Python, seems to work better for mobile testing in same wifi but no live updates:
```
python -m http.server -b 0.0.0.0 8000
```

## Structure

- `index.html` — the whole site. It's a single-page app: one HTML file with 
  a `<main>` block per tab (Hackathon, Intel, About, Get Involved, Citizenship),
  shown/hidden via JS-driven tab switching rather than separate pages.
- `discord.html` / `telegram.html` — standalone redirect pages that forward
  visitors to the Discord/Telegram invites. Buttons and footer links across
  the site point at these local pages (`/discord.html`, `/telegram.html`)
  rather than the invite URLs directly, so the actual invite link only ever
  needs updating in one place.
- `static/script.js` — all page behavior: tab switching, mobile hamburger
  menu, FAQ accordion, and the Intel log renderer.
- `static/styles.css` — all styling, built around a reusable
  `.futuristic-container` / `.futuristic-title` / `.futuristic-content`
  card pattern.
- `static/images/` — site imagery, icons, and the header background video.
- `intel/` — Intel log entries (see below).
- `CNAME` — GitHub Pages custom domain config. Don't touch without intent.

## Adding an Intel log entry

The Intel tab renders a feed of dated log entries from files in `intel/`.
To add one:

1. Create a new `.md` file in `intel/`, e.g.
   `intel/2026-08-21-something-happened.md`, with this format:

   ```
   Date: 2026-08-21
   Tag: event
   Title: Something Happened
   Author: Your Name
   Hashtags: event, robotics, helsinki

   Description text goes here. Blank lines start a new paragraph.
   ```

   - `Date` must be `YYYY-MM-DD` — entries are sorted newest first.
   - `Tag` is a short category (`event`, `hardware`, `mission`, `community`, ...).
   - `Hashtags` is comma-separated; `#` prefixes are optional.
   - Everything after the blank line is the description (plain text, no
     Markdown rendering yet).

2. Regenerate the manifest the page actually reads:

   ```
   node build-intel.js
   ```

3. Commit both the new entry file and the updated `intel/manifest.json`,
   then push.

