/* ==========================================================================
   EDIT THIS FILE — settings for the in-game sponsor card.

   The sponsors themselves are NOT listed here. This page loads the list from
   ../sponsors.js, so the full-screen rotator and this overlay always show the
   same sponsors in the same order. Add a sponsor there, it appears in both.
   ========================================================================== */

var CCC_OVERLAY_SETTINGS = {
    /* How long each sponsor holds, in milliseconds. Slower than the
       full-screen rotator on purpose — this sits next to live gameplay and a
       fast flicker in the corner of the eye is distracting. */
    duration: 3000,

    /* Where the card sits on the 1920x1080 frame. One of:
       'bottom-center', 'bottom-left', 'bottom-right', 'top-left', 'top-right'.

       'bottom-center' drops it into the gap between the two players' damage
       meters — the same slot the scoreboard reserves for tournament_logo.png,
       which is currently empty. If you ever add that logo, move this card. */
    position: 'bottom-center',

    /* Card size in design pixels. Width is the tight one: the character icons
       and damage meters close in from both sides, and a player sitting on
       three-digit damage pushes their meter further towards the middle still.
       340 keeps clear of both. Anything past about 400 starts touching. */
    width: 340,
    height: 132,

    /* Distance from the edges it is anchored to. */
    offsetX: 0,
    offsetY: 34,

    /* Small caps line above the logo. null for no label at all. */
    label: 'Sponsored by',

    /* Print the sponsor's name (or URL) under the logo. Off by default —
       the logos alone are easier to read at this size over a busy stage. */
    showNames: false,

    /* Thin orange timer along the bottom edge of the card. */
    showProgress: true,

    /* Re-order the sponsors randomly on every page load. Worth turning on
       here: matches start and stop constantly, and without it the same one or
       two sponsors take every first slot of every game. */
    shuffle: true,

    /* Where ../sponsors.js's logo paths are relative to. Leave this alone
       unless you move the folder. */
    logoBase: '../',

    /* Highlight colour — the timer bar and the label. */
    accent: '#ef7521'
};
