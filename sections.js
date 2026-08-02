/* ==========================================================================
   EDIT THIS FILE — everything the rotator shows lives here.
   Add a section by copying a block inside CCC_SECTIONS and changing the text.
   Save, then hit "Refresh cache of current page" on the OBS browser source.
   ========================================================================== */

var CCC_SETTINGS = {
    /* How long each section stays on screen, in milliseconds (12000 = 12s).
       A section can override this with its own `duration`. */
    duration: 7000,

    /* Small Cyprus Comic Con logo in the top-left corner. Set to null to hide. */
    brandLogo: 'assets/ccc.png',

    /* Thin orange timer line along the bottom edge. */
    showProgress: true,

    /* With only one section defined, replay its entrance on every cycle
       (true) or let it sit still once it has landed (false). */
    replaySingleSection: true
};

var CCC_SECTIONS = [

    {
        /* Used by the ?section= URL parameter — see README.md */
        id: 'nomnomnomicon',

        logo: 'assets/nomnomnomicon.png',
        logoAlt: 'Nomnomnomicon',
        /* Wide wordmark: size by width. logoNudge shifts it right of the panel
           centre so the beer mug breaks the frame. */
        logoWidth: 1160,
        logoNudge: 30,

        /* Where in the venue this is. Shows in the badge top right. */
        location: 'Outdoors',

        /* Small label above the headline. */
        eyebrow: 'Food Court',

        /* One array entry per line. Wrap words in <em> to tint them accent colour. */
        headline: ['<em>30+</em> Food', 'Vendors'],

        blurb: 'Refuel between attractions — hot food, sweet stuff and cold drinks.',

        /* Short pills under the blurb. Use [] for none. */
        tags: ['Street food', 'Sweets &amp; bakes', 'Cold drinks'],

        urlLabel: 'See the full vendor list at',
        url: 'cypruscomiccon.org/nomnomnomicon/',

        /* Highlight colour for this section. Brand orange #ef7521 is the default;
           #ffd21e picks up the yellow in the Nomnomnomicon logo. */
        accent: '#ef7521'
    },

    {
        id: 'mcc',

        logo: 'assets/mcc.png',
        logoAlt: 'Mediterranean Cosplay Championship',
        /* Near-square badge: size by height instead, so the sword breaks the top
           of the panel the way the beer mug breaks the side on the food court. */
        logoHeight: 740,
        logoNudge: 60,

        location: 'Hall A',

        eyebrow: 'Mediterranean Cosplay Championship',

        headline: ['<em>&euro;4,000</em>', 'In Prizes'],

        blurb: 'Fifteen of the region&rsquo;s finest crafters compete solo on the main stage.',

        tags: ['Sat 3 October', '15 finalists', 'Europa Cup qualifier'],

        urlLabel: 'Rules, prizes and info at',
        url: 'cypruscomiccon.org/cosplay/mediterranean-cosplay-championship/',

        accent: '#ef7521'
    },

    {
        id: 'medieval',

        logo: 'assets/medieval.png',
        logoAlt: 'Medieval Zone',
        /* Square file with deep top and bottom padding, so it needs a tall box
           to carry the same weight as the other two marks. */
        logoHeight: 890,
        logoNudge: 60,

        location: 'Hall 4, Outside Halls A & 6',

        eyebrow: 'Medieval Quarter',

        headline: ['<em>Sword Fighting</em>', '& More!'],

        blurb: 'Sparring all weekend, woodland archery, artisan workshops and a tavern with a live bard.',

        tags: ['Sword arena', 'Woodland archery', 'Tavern &amp; bard'],

        urlLabel: 'Information at',
        url: 'cypruscomiccon.org/medieval-quarter/',

        accent: '#ef7521'
    },

    {
        id: 'artist-alley',
        logo: 'assets/artist-alley.png',
        logoAlt: "Artists' Alley",
        logoHeight: 890,
        logoNudge: 60,
        location: 'Hall 6',
        eyebrow: "Artists' Alley",
        headline: ['<em>60+</em> Artists', 'Under One Roof'],
        blurb: 'Prints, originals and commissions straight from local artists.',
        tags: ['Prints', 'Originals', 'Commissions'],
        urlLabel: 'Take a look',
        url: 'cypruscomiccon.org/artist-alley/',
        accent: '#ef7521'
    },


    {
        id: 'special-guests',
        logo: 'assets/special-guests.png',
        logoAlt: 'Special Guests',
        logoNudge: 60,
        location: 'Hall A & 6',
        eyebrow: 'Special Guests',
        headline: ['<em>Actors, Musicians</em>', '& More!'],
        blurb: 'Actors, voice actors, artists, cosplayers, musicians and creators from across the pop-culture universe — all coming together in Cyprus.',
        tags: ['Clive Russel', 'Dave Rodgers', 'Expedition 33 VAs'],
        urlLabel: 'Full lineup',
        url: 'cypruscomiccon.org/special-guests/',
        accent: '#ef7521'
    },

    {
        id: 'limit-break',
        logo: 'assets/limit-break.png',
        logoAlt: 'Limit Break',
        logoHeight: 840,
        logoNudge: 80,
        location: 'Hall 5',
        eyebrow: 'Gaming',
        headline: ['<em>Tournaments</em>', '& Game Dev Showcases'],
        blurb: 'The highest quality Smash Bros & Tekken tournaments in Cyprus, plus showcases from local game dev studios!',
        tags: ['Super Smash Bros. Ultimate', 'Tekken 8', 'Dev Showcases'],
        urlLabel: 'Full lineup',
        url: 'cypruscomiccon.org/gaming/',
        accent: '#ef7521'
    },

    {
        id: 'film-festival',
        logo: 'assets/film-festival.png',
        logoNudge: 55,
        logoAlt: 'Film Festival',
        location: 'Hall A',
        eyebrow: 'Film Festival',
        headline: ['<em>Films</em>', 'Animations & More'],
        blurb: 'Local and international short films on the big screen, plus a 48 Hour Film Challenge with &euro;2,000 in cash prizes.',
        tags: ['48 Hour Film Challenge', 'Horror, sci-fi & fantasy'],
        urlLabel: 'More info at',
        url: 'cypruscomiccon.org/film-festival/',
        accent: '#ef7521'
    },

    {
        id: 'wrestling',
        logo: 'assets/wrestling.png',
        logoHeight: 580,
        logoNudge: 95,
        logoAlt: 'Wrestling',
        location: 'Outside Hall 6',
        eyebrow: 'Wrestling',
        headline: ['<em>Pro Wrestling</em>'],
        blurb: 'Pro Wrestling Cyprus bursts back into action as Cyprus Comic Con proudly presents Gods of Wrestling 2026!',
        tags: ['Tom La Ruffa', 'Session Moth Martina'],
        urlLabel: 'Full lineup',
        url: 'cypruscomiccon.org/pro-wrestling-cyprus/',
        accent: '#ef7521'
    },

    {
        id: 'msqrd',
        logo: 'assets/msqrd.png',
        logoHeight: 650,
        logoNudge: 95,
        logoAlt: 'msqrd',
        location: 'Hall A',
        eyebrow: 'Masquerade',
        headline: ['<em>Cosplay</em>', 'Competition'],
        blurb: 'This contest embraces a more laid-back approach, welcoming all handmade and partly handmade costumes, newcomers and seasoned enthusiasts alike',
        tags: ['Cosplay', 'Prizes'],
        urlLabel: 'Learn More:',
        url: 'cypruscomiccon.org/ccc-masquerade/',
        accent: '#ef7521'
    },

    {
        id: 'shops',
        logo: 'assets/shops.png',
        logoHeight: 880,
        logoNudge: 95,
        logoAlt: 'shops',
        location: 'Hall 6 & 5',
        eyebrow: 'Shops',
        headline: ['<em>Cosplay</em>', 'Competition'],
        blurb: 'This contest embraces a more laid-back approach, welcoming all handmade and partly handmade costumes, newcomers and seasoned enthusiasts alike',
        tags: ['Cosplay', 'Prizes'],
        urlLabel: 'Learn More:',
        url: 'cypruscomiccon.org/ccc-masquerade/',
        accent: '#ef7521'
    },

    {
        id: 'tabletop',
        logo: 'assets/tabletop.png',
        logoHeight: 800,
        logoNudge: 105,
        logoAlt: 'tabletop',
        location: 'Hall 4 & 6',
        eyebrow: 'Tabletop',
        headline: ['<em>TCG, DnD</em>', 'and More!'],
        blurb: 'Your go-to zone for analog adventure! Dive into a realm of dice rolls, epic quests, and quick strategy games',
        tags: ['TCG', 'Board Games', 'DND'],
        urlLabel: 'Learn More:',
        url: 'cypruscomiccon.org/tableflip/',
        accent: '#ef7521'
    },

    {
        id: 'stem',
        logo: 'assets/stem.png',
        logoHeight: 900,
        logoNudge: 100,
        logoAlt: 'tabletop',
        location: 'Hall 5',
        eyebrow: 'STEM',
        headline: ['<em>GameDev</em>', '& More'],
        blurb: 'A vibrant space where innovative game developers, tech-savvy creators, and educational trailblazers come together to share their passion for science, technology, engineering, and math',
        tags: ['Game Dev', 'Technology', 'Education'],
        urlLabel: 'Learn More:',
        url: 'cypruscomiccon.org/stem/',
        accent: '#ef7521'
    },


    /* ---- Next section: uncomment, drop your logo in assets/, edit the text ----
    {
      id: 'artist-alley',
      logo: 'assets/artist-alley.png',
      logoAlt: 'Artist Alley',
      location: 'Hall B',
      eyebrow: 'Artist Alley',
      headline: ['<em>60+</em> Artists', 'Under One Roof'],
      blurb: 'Prints, originals and commissions straight from the people who drew them.',
      tags: ['Prints', 'Originals', 'Commissions'],
      urlLabel: 'Meet them all at',
      url: 'cypruscomiccon.org/artist-alley/',
      accent: '#ef7521'
    }
    --------------------------------------------------------------------------- */

];
