/* ==========================================================================
   EDIT THIS FILE — settings for the sponsor logo-only overlay.

   The sponsors themselves are NOT listed here. This page loads the list from
   ../sponsors.js, so the full-screen rotator and this overlay always show the
   same sponsors in the same order. Add a sponsor there, it appears in both.
   ========================================================================== */

var CCC_LOGO_OVERLAY_SETTINGS = {
    /* How long each sponsor's logo holds, in milliseconds. */
    duration: 3000,

    /* Where the logo sits on the 1920x1080 frame. One of:
       'bottom-center', 'bottom-left', 'bottom-right', 'top-left', 'top-right'. */
    position: 'bottom-center',

    /* Logo box size in design pixels. Every sponsor's logo is fit to this
       same box, so a 300px file and a 3840px file, or a square badge and a
       7:1 wordmark, all end up reading at the same size. */
    width: 340,
    height: 132,

    /* Distance from the edges it is anchored to. */
    offsetX: 0,
    offsetY: 34,

    /* Re-order the sponsors randomly on every page load. Worth turning on
       here: matches start and stop constantly, and without it the same one or
       two sponsors take every first slot of every game. */
    shuffle: true,

    /* Where ../sponsors.js's logo paths are relative to. Leave this alone
       unless you move the folder. */
    logoBase: '../'
};
