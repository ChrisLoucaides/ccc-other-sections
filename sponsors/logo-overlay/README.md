# Limit Break — sponsor logo overlay (OBS browser source)

The bare version of `../overlay`: just the sponsor logos, cross-fading in
place, all fit to the same box so they read at the same size. No card
background, no border, no label, no sponsor name, no progress timer.

It shares the same sponsor list as the full-screen rotator and the in-game
card — this page loads `../sponsors.js` rather than keeping its own list, so
adding a sponsor there puts it here too.

---

## Add it to OBS

1. **Sources → + → Browser**
2. Tick **Local File**, then browse to:
   `...\layout\ccc-other-sections\sponsors\logo-overlay\index.html`
3. Set **Width `1920`**, **Height `1080`**
4. Tick **Use custom frame rate** and set **60** FPS.
5. Leave the default custom CSS alone — the page is transparent on its own.

---

## Add a sponsor

Edit **`../sponsors.js`** — not anything in this folder. See `../README.md`.

---

## Settings

In `logo-overlay.js`:

| Setting | What it does |
| --- | --- |
| `duration` | Milliseconds each sponsor's logo holds. |
| `position` | `bottom-center` (default), `bottom-left`, `bottom-right`, `top-left`, `top-right`. |
| `width` / `height` | The logo box, in design pixels. Every logo is fit to this same box. |
| `offsetX` / `offsetY` | Distance from the edges it is anchored to. |
| `shuffle` | Re-order the sponsors on every page load. |
| `logoBase` | Where `../sponsors.js`'s logo paths are relative to. Leave it alone unless you move the folder. |

---

## While you are placing it

Open `index.html` in Chrome — it's a transparent page, so use the OBS
preview to judge it against real gameplay.

- **Space** or **→** — next sponsor
- **←** — previous sponsor

`?sponsor=funko` holds one logo up and stops the rotation.

---

## Files

| File | |
| --- | --- |
| `logo-overlay.js` | **The one you edit.** Placement and timing. The sponsor list lives in `../sponsors.js`. |
| `index.html` | Page shell. |
| `logo-overlay.css` | The logo box and the cross-fade. No fonts, no card. |
| `app.js` | Places the box and cycles the logos. |
