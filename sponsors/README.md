# Limit Break — sponsor rotator (OBS browser source)

A companion to the section rotator one folder up. The Limit Break logo holds the
left of the screen for the whole show while the gaming sponsors cycle through
the card on the right — logo, name, next.

Same 1920×1080 stage, same brand furniture. It borrows `../style.css`, so the
backdrop, the panel, the badge and the fonts stay in step with the main rotator
automatically: change a brand colour there and this page follows.

---

## Add it to OBS

1. **Sources → + → Browser**
2. Tick **Local File**, then browse to:
   `...\layout\ccc-other-sections\sponsors\index.html`
3. Set **Width `1920`**, **Height `1080`**
4. Tick **Use custom frame rate** and set **60** FPS.
5. Leave **Shutdown source when not visible** unticked, and tick
   **Refresh browser when scene becomes active**.

---

## Add a sponsor

Open **`sponsors.js`**.

1. Drop the logo into `assets/`. PNG, WebP and SVG all work — transparent
   background, and **dark or coloured artwork**, because it sits on a cream card.
   A white-only logo would disappear; ask the sponsor for their dark version.
2. Add one line to `CCC_SPONSORS`.
3. Save, then in OBS right-click the source → **Refresh cache of current page**.

```js
{ logo: 'assets/funko.png', name: 'Funko' }
```

| | |
| --- | --- |
| `logo` | Path inside `assets/`. |
| `name` | Printed under the card. Leave it out and nothing is printed. |
| `scale` | Optional size nudge, `1` is the default. |
| `id` | Optional, for the `?sponsor=` preview link. Defaults to the filename. |

Sponsors play in the order they appear in the array, five seconds each. Add
`duration: 8000` to one entry to hold it longer.

### Why some entries carry a `scale`

The card sizes every logo the same way, so a 300px file and a 3840px file end up
with the same optical weight. What it cannot see is empty space *inside* the
file: `spartan-gear.png` only fills 64% of its own height, so fitting the file to
the box leaves the helmet looking small. `scale: 1.30` corrects for that padding.
Spartan Gear, Petrolina and SLIQ are nudged for this reason, and Scorewarrior —
a 7:1 wordmark — is nudged to carry the width.

If a new logo lands looking small or crowded, open the page in Chrome, try 1.2 or
0.9, and go from there. Nothing else needs touching.

---

## While you are building the list

Open `index.html` in Chrome to preview. In that window:

- **Space** or **→** — next sponsor
- **←** — previous sponsor

Pin one sponsor and stop the rotation with `?sponsor=` and its id:

```
file:///C:/.../ccc-other-sections/sponsors/index.html?sponsor=funko
```

Handy if a sponsor asks for a still of their slot, or you want one logo on the
wall during their moment.

---

## Settings

In `CCC_SPONSOR_SETTINGS` at the top of `sponsors.js`:

| Setting | What it does |
| --- | --- |
| `duration` | Milliseconds each sponsor holds. `5000` = 5s. |
| `featureLogo` | The logo that never leaves. Points at `../assets/limit-break.png`. |
| `featureHeight` / `featureWidth` / `featureNudge` | Size and place it, exactly as `logoHeight` / `logoWidth` / `logoNudge` do in `../sections.js`. The current values match the Gaming section there, so the two scenes cut together cleanly. |
| `location` | The badge, top right. `null` hides it. |
| `eyebrow` | Small label above the card. |
| `showNames` | `false` shows logos only. |
| `showProgress` | The orange timer line along the bottom. |
| `shuffle` | `true` re-orders the sponsors on every page load, so the same name is not always first on the wall. |
| `accent` | Highlight colour. Brand orange by default. |

---

## Point it at a different section

Nothing here is Limit Break specific except the settings. For a cosplay or film
festival sponsor reel, copy this folder, swap `featureLogo` for that section's
mark, change `eyebrow` and `location`, and fill `assets/` with their sponsors.

---

## Files

| File | |
| --- | --- |
| `sponsors.js` | **The one you edit.** Sponsor list and settings. |
| `index.html` | Page shell. |
| `sponsors.css` | The card and the swap. Everything else comes from `../style.css`. |
| `app.js` | Builds the scene and cycles the logos. |
| `assets/` | Sponsor logos. |

`assets/KFC.webp` is an unused duplicate of `KFC.png` — the list uses the PNG.
