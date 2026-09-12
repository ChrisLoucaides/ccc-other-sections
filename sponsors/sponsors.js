/* ==========================================================================
   EDIT THIS FILE — the Limit Break sponsor rotator lives here.
   Add a sponsor by dropping the logo in sponsors/assets/ and adding one line
   to CCC_SPONSORS. Save, then hit "Refresh cache of current page" on the OBS
   browser source.
   ========================================================================== */

var CCC_SPONSOR_SETTINGS = {
    /* How long each sponsor logo stays on screen, in milliseconds.
       Shorter than the section rotator — there is far less to read. */
    duration: 5000,

    /* Small Cyprus Comic Con logo in the top-left corner. null to hide. */
    brandLogo: '../assets/ccc.png',

    /* The logo that never leaves the screen. Sized the same way the Gaming
       section sizes it in ../sections.js. */
    featureLogo: '../assets/limit-break.png',
    featureAlt: 'Limit Break',
    featureHeight: 840,
    featureNudge: 10,

    /* Badge top right. Set to null to hide it. */
    location: 'Hall 5',

    /* Small label above the sponsor card. Keep it short. */
    eyebrow: 'Proudly powered by',

    /* Print the sponsor's name under the card. Turn off if you want logos
       and nothing else. */
    showNames: true,

    /* Thin orange timer line along the bottom edge. */
    showProgress: true,

    /* Re-order the sponsors randomly on every page load, so the same name is
       not always first on the wall. */
    shuffle: false,

    /* Highlight colour — brand orange, matching the Gaming section. */
    accent: '#ef7521'
};

/* --------------------------------------------------------------------------
   One entry per sponsor.
     logo   path inside sponsors/assets/  (png, webp and svg all work)
     name   printed under the card; omit it and nothing is printed
     scale  optional fine-tune, 1 = default size. Nudge a wordmark up to 1.15
            if it reads small, or down to .85 if it crowds the card.
     id     optional, for the ?sponsor= URL parameter. Defaults to the
            filename, so ?sponsor=funko already works.
   -------------------------------------------------------------------------- */

var CCC_SPONSORS = [

    { logo: 'assets/funko.png',        name: 'funko.com' },

    /* long, thin wordmark — nudged up so it carries the card */
    { logo: 'assets/scorewarrior.png', name: 'Scorewarrior.com', scale: 1.12 },

    /* these three files carry a lot of empty space around the artwork, so
       fitting the file to the box leaves the mark itself looking small */
    { logo: 'assets/spartan-gear.png', name: 'spartangear.eu', scale: 1.30 },

    { logo: 'assets/petrolina.png',    name: 'Petrolina.com.cy',    scale: 1.25 },

    { logo: 'assets/sliq.png',         name: 'SLIQ.eu',         scale: 1.20 },

    { logo: 'assets/KFC.png',          name: 'KFC.com.cy' },

    { logo: 'assets/pizza-hut.png',    name: 'PizzaHut.com.cy' },

    { logo: 'assets/taco-bell.webp',   name: 'TacoBell.com.cy' },

    { logo: 'assets/joey.png',         name: 'bankofcyprus.com/joey' },

    { logo: 'assets/3define.png',      name: '3Define.info' },

    { logo: 'assets/kemanes.png',      name: 'KemanesPrintShop.com' },

    /* letterspaced wordmark with padding baked into the file, like petrolina/sliq */
    { logo: 'assets/tengo.png',        name: 'Tengo', scale: 1.20 },

    { logo: 'assets/CCC Only Logo Icon.png', name: 'Cyprus Comic Con', id: 'ccc' },

    { logo: 'assets/SmashCY_Logo.png', name: 'SmashCY', id: 'smashcy' }

];
