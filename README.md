# Cyprus Comic Con — section rotator (OBS browser source)

A full-screen looping advert for the LED wall. It cycles through convention
sections, each one animating in and out. Nomnomnomicon, the Mediterranean
Cosplay Championship and the Medieval Quarter are set up; more sections drop in
by editing one file.

Designed at 1920×1080 and scaled to fit whatever size you give the source, so
it works on a 1080p feed, a 720p feed or an odd LED-wall aspect ratio.

---

## Add it to OBS

1. **Sources → + → Browser**
2. Tick **Local File**, then browse to:
   `...\layout\ccc-other-sections\index.html`
3. Set **Width `1920`**, **Height `1080`**
4. Tick **Use custom frame rate** and set **60** FPS — the default 30 makes the
   slide-ins look choppy on a big panel.
5. Leave **Shutdown source when not visible** unticked, and tick
   **Refresh browser when scene becomes active** so the entrance replays every
   time you cut to this scene.

Resize the source in the canvas as you like — the layout scales, it does not
reflow.

---

## Add a section

Open **`sections.js`**. Everything on screen comes from that one file.

1. Drop the section's logo into `assets/` (transparent PNG, roughly 2000px wide).
2. Copy the commented-out block at the bottom of `CCC_SECTIONS`, uncomment it,
   and fill in your text.
3. Save, then in OBS right-click the source → **Refresh cache of current page**.

```js
{
  id: 'artist-alley',                    // used by the ?section= preview link
  logo: 'assets/artist-alley.png',
  logoAlt: 'Artist Alley',
  location: 'Hall B',                    // badge, top right
  eyebrow: 'Artist Alley',               // small label above the headline
  headline: ['<em>60+</em> Artists',     // one array entry per line;
             'Under One Roof'],          // <em> tints words the accent colour
  blurb: 'Prints, originals and commissions.',
  tags: ['Prints', 'Originals'],         // [] for none
  urlLabel: 'Meet them all at',
  url: 'cypruscomiccon.org/artist-alley/',
  accent: '#ef7521'                      // brand orange
}
```

Sections play in the order they appear in the array. Each is on screen for
`CCC_SETTINGS.duration` (12 seconds by default); add `duration: 9000` to a
section to give that one its own timing.

### Location

`location` fills the badge in the **top right**, opposite the Cyprus Comic Con
mark. It holds that same slot on every section, so people watching the wall
learn where to look for "which part of the venue is this?". Keep it to the words
that are actually on the venue signage — `Hall A`, `Outdoors`, `Foyer`. Leave
`location` out entirely and the badge does not appear.

### Notes on the copy

Keep headlines to **two short lines**, at most about nine characters each — they
are set at 122px and anything longer starts wrapping badly. The blurb holds
about 14 words before it runs to a third line. Tags should be one or two words.

Long URLs shrink automatically to fit the column rather than overflowing, so
nothing breaks — but the drop-off is steep. `/nomnomnomicon/` holds 37px;
MCC's 61-character path is down at 21px, the smallest the fitter will go.
Short paths read enormously better from across a hall.

The three tags on Nomnomnomicon (Street food / Sweets & bakes / Cold drinks) are
placeholders — swap them for the real vendor categories.

### Fitting the logo to the panel

Logo files vary a lot in shape and in how much empty space they carry, so each
section places its own artwork inside the panel:

| | |
| --- | --- |
| `logoWidth` | For wide, wordmark-style logos. Nomnomnomicon uses `1160`. |
| `logoHeight` | For square-ish marks. MCC uses `740`; setting this ignores `logoWidth`. |
| `logoNudge` | Pixels to shift right of the panel centre. This is what makes the artwork break the panel edge. |

Start with `logoWidth: 1160, logoNudge: 70`, open the page in Chrome, and adjust
until the artwork crosses the panel border by roughly 50–100px. That overlap is
the deliberate bit — it echoes the way the white C's break out of the orange
panel in the Cyprus Comic Con mark.

---

## While you are building slides

Open `index.html` in Chrome to preview. In that window:

- **Space** or **→** — jump to the next section
- **R** — replay the current entrance

You can also pin one section and stop the rotation entirely by adding
`?section=` and its `id` to the URL:

```
file:///C:/.../ccc-other-sections/index.html?section=nomnomnomicon
```

To use a pinned section in OBS, untick **Local File** and paste that whole
`file:///` URL into the **URL** box instead.

---

## Other settings

In `CCC_SETTINGS` at the top of `sections.js`:

| Setting | What it does |
| --- | --- |
| `duration` | Milliseconds each section holds. `12000` = 12s. |
| `brandLogo` | Corner Cyprus Comic Con logo. `null` hides it. |
| `showProgress` | The orange timer line along the bottom. It hides itself automatically while only one section exists. |
| `replaySingleSection` | With one section defined, `true` replays its entrance every cycle. Set `false` to let it land once and sit still. |

---

## Brand

Taken from `CCC Brandguidelines.pdf`:

| | |
| --- | --- |
| Purple | `#742f8a` (Pantone 526 c) |
| Orange | `#ef7521` (Pantone 158 c) |
| Black | `#181818` (Pantone Natural Black c) |
| Headers | LEMON MILK (caps only) |
| General text | Keep Calm |

**The two brand fonts are not installed on this machine**, so the page is
currently rendering with bundled stand-ins that share their geometric-rounded
character (Poppins for headers, Quicksand for text). They are in `fonts/` and
work with no internet, which matters on venue wi-fi.

To get the real thing: install **LEMON MILK** and **Keep Calm** as Windows fonts
and restart OBS. No code change needed — `style.css` already looks for the real
faces first and only falls back to the bundled files if they are missing.

---

## Files

| File | |
| --- | --- |
| `sections.js` | **The one you edit.** All content and timing. |
| `index.html` | Page shell. |
| `style.css` | Brand tokens, layout, animation. |
| `app.js` | Builds and cycles the slides. |
| `assets/` | Logos. |
| `fonts/` | Bundled fallback typefaces. |

`ccc.png`, `nomnomnomicon logo.png` and `CCC Brandguidelines.pdf` in this folder
are the untouched originals — the rotator uses the copies in `assets/`.
`assets/mcc.png` was pulled from the MCC page on cypruscomiccon.org, and
`assets/medieval.png` is a copy of `medieval-zone-section-logo.png`.

Note that the Medieval Zone logo has the Cyprus Comic Con logotype built into
it, so that wordmark appears twice on that slide — once in the corner mark and
once inside the panel. It reads fine, but if a wordmark-free version of the
section logo exists, dropping it into `assets/medieval.png` would be cleaner.

---

## Two things to check on the MCC section

**The facts came off the championship page** (prizes, 15 entries, competition
day, Europa Cosplay Cup qualifier). The headline `€4,000 in prizes` is the cash
total — €2000 / €1200 / €800. It does not count the sewing machine, the
CosplayShop.be goods for the honourable mentions, or the trip to Toulouse, so
there is room to make a bigger claim if you would rather.

**The URL is long.** `cypruscomiccon.org/cosplay/mcc/` exists and returns 200,
but it serves a *different* page — titled just "MCC", with none of the
championship content — so the section points at the full
`/cosplay/mediterranean-cosplay-championship/` instead. If you set up a short
redirect, swap it in and the CTA jumps back to full size.
