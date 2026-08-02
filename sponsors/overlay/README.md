# Limit Break — in-game sponsor card (OBS browser source)

The small sponsor card that stays on screen during matches. One logo at a time,
ten seconds each, in the gap between the two players' damage meters.

It is the same sponsors as the full-screen rotator one folder up — this page
loads `../sponsors.js` rather than keeping its own list, so adding a sponsor
there puts them in both places. Only the presentation is different: no
backdrop, no headline, no tilt, nothing that competes with the match.

---

## Where it sits

The frame is already spoken for: the scoreboard owns the top strip, and the
player cams and their handles own the bottom corners (`.twitter` sits at
`top: 821px`, 348px wide, 25px in from each edge). What is left is the middle
of the bottom edge — which is also where `scoreboard_vgbootcampy` would put
`tournament_logo.png`, a file that does not currently exist. The card drops
into that empty slot, 340×132 at 34px off the bottom.

**If you ever add a `tournament_logo.png` to the scoreboard, the two will
collide.** Move this card with `position` and `offsetY` in `overlay.js`, or
drop the tournament logo.

The width matters more than it looks. The character icons and damage meters
close in from both sides, and a player sitting on three-digit damage pushes
their meter further towards the middle still. 340px clears both; much past 400
and it starts encroaching on the icons.

---

## Add it to OBS

1. **Sources → + → Browser**
2. Tick **Local File**, then browse to:
   `...\layout\ccc-other-sections\sponsors\overlay\index.html`
3. Set **Width `1920`**, **Height `1080`**
4. Tick **Use custom frame rate** and set **60** FPS.
5. Leave the default custom CSS alone — the page is transparent on its own, so
   it composites straight over the gameplay capture.

Put it **above** the game capture and **below** the scoreboard source in the
scene list. Resize it in the canvas as you like; the card scales with the
frame, so it stays in the same spot relative to the scoreboard and the cams.

---

## Add a sponsor

Edit **`../sponsors.js`** — not anything in this folder. Both this card and
the full-screen rotator read that one list. See `../README.md`.

---

## Settings

In `overlay.js`:

| Setting | What it does |
| --- | --- |
| `duration` | Milliseconds each sponsor holds. `10000` = 10s, slower than the full-screen rotator on purpose — this sits beside live gameplay, and a fast flicker at the edge of vision pulls focus off the match. |
| `position` | `bottom-center` (default), `bottom-left`, `bottom-right`, `top-left`, `top-right`. |
| `width` / `height` | Card size in design pixels. |
| `offsetX` / `offsetY` | Distance from the edges it is anchored to. |
| `label` | The small caps line above the logo. `null` for no label. |
| `showNames` | Print the sponsor's name or URL under the logo. Off by default — at this size, over a busy stage, the logo alone reads better. Turning it on shrinks the logo to make room. |
| `showProgress` | The orange timer along the bottom edge of the card. |
| `shuffle` | Re-order the sponsors on every page load. **On by default here.** Matches start and stop constantly, and a browser source that refreshes on scene change would otherwise give the same one or two sponsors every first slot of every game. |
| `logoBase` | Where `../sponsors.js`'s logo paths are relative to. Leave it alone unless you move the folder. |

---

## While you are placing it

Open `index.html` in Chrome — the card appears on a transparent page, so use
the OBS preview to judge it against real gameplay.

- **Space** or **→** — next sponsor
- **←** — previous sponsor

`?sponsor=funko` holds one logo up and stops the rotation, which is what you
want if a sponsor's segment is on and you would rather they stayed put.

---

## Files

| File | |
| --- | --- |
| `overlay.js` | **The one you edit.** Placement and timing. The sponsor list lives in `../sponsors.js`. |
| `index.html` | Page shell. |
| `overlay.css` | The card. Declares the brand fonts itself rather than borrowing `../../style.css`, because that sheet also paints a solid purple background — fine full-screen, fatal for an overlay. |
| `app.js` | Places the card and cycles the logos. |
| `example.PNG` | The reference frame this was built against. |
