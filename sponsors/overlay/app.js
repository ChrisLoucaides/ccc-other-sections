/* ==========================================================================
   Limit Break — in-game sponsor card
   Places one small card on the 1920x1080 frame and cross-fades the sponsor
   logos through it. The list comes from ../sponsors.js; the settings come
   from overlay.js. You should not need to touch this file.
   ========================================================================== */

(function () {
  'use strict';

  var DESIGN_W = 1920;
  var DESIGN_H = 1080;
  var SWAP_MS = 460;    // must cover the longest --out transition
  var FIRST_MS = 420;   // let the card land before the first logo fades up

  var settings = window.CCC_OVERLAY_SETTINGS || {};
  var sponsors = (window.CCC_SPONSORS || []).slice();

  var stage = document.getElementById('stage');
  var card = document.getElementById('card');
  var label = document.getElementById('label');
  var stack = document.getElementById('stack');
  var nameBox = document.getElementById('name');
  var timer = document.getElementById('timer');

  var index = 0;
  var holdTimer = null;
  var pinned = false;

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Fit the 1920x1080 stage into whatever size OBS gives the source --- */

  function fitStage() {
    var scale = Math.min(
      window.innerWidth / DESIGN_W,
      window.innerHeight / DESIGN_H
    );
    stage.style.transform = 'scale(' + scale + ')';
  }

  /* --- Place the card ------------------------------------------------------
     Five presets rather than raw coordinates, because the useful spots are
     decided by the rest of the broadcast: the scoreboard owns the top strip
     and the player cams own the bottom corners.
     -------------------------------------------------------------------------- */

  function placeCard() {
    var w = settings.width || 440;
    var h = settings.height || 132;
    var x = settings.offsetX || 0;
    var y = settings.offsetY || 0;
    var pos = settings.position || 'bottom-center';

    card.style.width = w + 'px';
    card.style.height = h + 'px';

    if (pos === 'bottom-center' || pos === 'top-center') {
      /* margin, not translateX, so the entrance transform stays free */
      card.style.left = '50%';
      card.style.marginLeft = (-w / 2 + x) + 'px';
    } else if (pos === 'bottom-right' || pos === 'top-right') {
      card.style.right = x + 'px';
    } else {
      card.style.left = x + 'px';
    }

    if (pos.indexOf('top') === 0) {
      card.style.top = y + 'px';
    } else {
      card.style.bottom = y + 'px';
    }
  }

  /* --- Sponsor identity ---------------------------------------------------- */

  function idOf(data) {
    if (data.id) return data.id;
    var file = String(data.logo || '').split('/').pop();
    return file.replace(/\.[^.]+$/, '').toLowerCase();
  }

  /* ../sponsors.js writes its paths relative to the folder above this one */
  function logoPath(data) {
    return (settings.logoBase || '') + data.logo;
  }

  /* --- Swap one element for another in the same slot ----------------------- */

  function swapIn(host, el, inClass, outClass) {
    var leaving = host.lastElementChild;
    host.appendChild(el);

    /* commit the from-state before releasing the entrance */
    void el.offsetWidth;
    el.classList.add(inClass);

    if (leaving) {
      leaving.classList.remove(inClass);
      leaving.classList.add(outClass);
      setTimeout(function () {
        if (leaving.parentNode) leaving.parentNode.removeChild(leaving);
      }, SWAP_MS);
    }
  }

  function showSponsor(data) {
    var logo = document.createElement('img');
    logo.className = 'card__logo';
    logo.src = logoPath(data);
    logo.alt = data.name || '';
    if (data.scale) logo.style.setProperty('--s', data.scale);
    swapIn(stack, logo, 'card__logo--in', 'card__logo--out');

    if (!settings.showNames) return;
    var text = document.createElement('span');
    text.className = 'card__name__text';
    text.textContent = data.name || '';
    swapIn(nameBox, text, 'card__name__text--in', 'card__name__text--out');
  }

  /* --- Timer --------------------------------------------------------------- */

  function runTimer(ms) {
    if (timer.hidden) return;
    timer.style.transition = 'none';
    timer.style.width = '0%';
    /* force a reflow so the reset is committed before the run starts */
    void timer.offsetWidth;
    timer.style.transition = 'width ' + ms + 'ms linear';
    timer.style.width = '100%';
  }

  /* --- Cycle --------------------------------------------------------------- */

  function play() {
    var data = sponsors[index];
    showSponsor(data);

    var hold = data.duration || settings.duration || 10000;
    runTimer(hold);

    if (pinned || sponsors.length < 2) return;
    holdTimer = setTimeout(advance, hold);
  }

  function advance() {
    clearTimeout(holdTimer);
    index = (index + 1) % sponsors.length;
    play();
  }

  /* --- Boot ---------------------------------------------------------------- */

  function preloadAll() {
    sponsors.forEach(function (s) {
      if (s.logo) { var img = new Image(); img.src = logoPath(s); }
    });
  }

  function shuffle(list) {
    for (var i = list.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = list[i]; list[i] = list[j]; list[j] = tmp;
    }
  }

  function boot() {
    fitStage();
    window.addEventListener('resize', fitStage);

    document.documentElement.style.setProperty('--accent',
      settings.accent || '#ef7521');

    placeCard();

    if (settings.label) label.textContent = settings.label;

    if (!sponsors.length) {
      /* Nothing to show, and this sits over live gameplay — say nothing at
         all rather than putting a placeholder on the broadcast. */
      return;
    }

    if (settings.shuffle) shuffle(sponsors);

    /* ?sponsor=funko holds one logo up and stops the rotation. Handy when a
       sponsor's segment is on. */
    var wanted = new URLSearchParams(window.location.search).get('sponsor');
    if (wanted) {
      var found = -1;
      sponsors.forEach(function (s, i) {
        if (found < 0 && idOf(s) === wanted.toLowerCase()) found = i;
      });
      if (found > -1) { index = found; pinned = true; }
    }

    timer.hidden = !(settings.showProgress !== false &&
                     sponsors.length > 1 && !pinned);

    preloadAll();

    requestAnimationFrame(function () {
      card.classList.add('card--in');
    });

    setTimeout(play, reduceMotion ? 200 : FIRST_MS);
  }

  /* Preview helpers while you are placing the card. Space / right arrow =
     next sponsor, left arrow = previous. */
  document.addEventListener('keydown', function (e) {
    if (!sponsors.length) return;
    if (e.key === ' ' || e.key === 'ArrowRight') {
      e.preventDefault();
      advance();
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      clearTimeout(holdTimer);
      index = (index - 2 + sponsors.length * 2) % sponsors.length;
      advance();
    }
  });

  /* Wait for the brand faces before painting — see the same note in
     ../../app.js. Only matters when a label or names are switched on. */
  function whenFontsReady(done) {
    if (!document.fonts || !document.fonts.load) return done();

    Promise.all([
      document.fonts.load('700 15px "CCC Body"'),
      document.fonts.load('800 18px "CCC Display"')
    ])
      .then(function () { return document.fonts.ready; })
      .then(done, done);
  }

  whenFontsReady(boot);
})();
