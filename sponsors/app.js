/* ==========================================================================
   Limit Break — sponsor rotator
   Builds the scene once, then cross-fades one sponsor logo at a time inside
   the card. The Limit Break panel is never rebuilt, so it stays on screen
   for the whole show.
   Content lives in sponsors.js — you should not need to touch this file.
   ========================================================================== */

(function () {
  'use strict';

  var DESIGN_W = 1920;
  var DESIGN_H = 1080;
  var SWAP_MS = 600;    // must cover the longest --out transition
  var FIRST_MS = 520;   // let the card land before the first logo pops in

  var settings = window.CCC_SPONSOR_SETTINGS || {};
  var sponsors = (window.CCC_SPONSORS || []).slice();

  var stage = document.getElementById('stage');
  var scene = document.getElementById('scene');
  var brandmark = document.getElementById('brandmark');
  var where = document.getElementById('where');
  var whereName = document.getElementById('whereName');
  var featureLogo = document.getElementById('featureLogo');
  var eyebrow = document.getElementById('eyebrow');
  var stack = document.getElementById('stack');
  var nameBox = document.getElementById('name');
  var progress = document.getElementById('progress');
  var progressFill = document.getElementById('progressFill');

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

  /* --- Sponsor identity ----------------------------------------------------
     ?sponsor= needs something to match on. Rather than make every entry carry
     an id by hand, fall back to the logo's filename: assets/funko.png -> funko.
     -------------------------------------------------------------------------- */

  function idOf(data) {
    if (data.id) return data.id;
    var file = String(data.logo || '').split('/').pop();
    return file.replace(/\.[^.]+$/, '').toLowerCase();
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
    logo.className = 'sponsor-logo';
    logo.src = data.logo;
    logo.alt = data.name || '';
    if (data.scale) logo.style.setProperty('--s', data.scale);
    swapIn(stack, logo, 'sponsor-logo--in', 'sponsor-logo--out');

    if (settings.showNames === false) return;
    var text = document.createElement('span');
    text.className = 'sponsor-name__text';
    text.textContent = data.name || '';
    swapIn(nameBox, text, 'sponsor-name__text--in', 'sponsor-name__text--out');
  }

  /* --- Progress line ------------------------------------------------------ */

  function runProgress(ms) {
    if (!progress || progress.hidden) return;
    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';
    /* force a reflow so the reset is committed before the run starts */
    void progressFill.offsetWidth;
    progressFill.style.transition = 'width ' + ms + 'ms linear';
    progressFill.style.width = '100%';
  }

  /* --- Cycle --------------------------------------------------------------- */

  function play() {
    var data = sponsors[index];
    showSponsor(data);

    var hold = data.duration || settings.duration || 5000;
    runProgress(hold);

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
      if (s.logo) { var img = new Image(); img.src = s.logo; }
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

    scene.style.setProperty('--accent', settings.accent || '#ef7521');

    if (settings.brandLogo) {
      brandmark.src = settings.brandLogo;
    } else {
      brandmark.hidden = true;
    }

    /* The always-on logo. Same sizing rules as the section rotator: use
       featureWidth for wide wordmarks, featureHeight for square-ish marks. */
    if (settings.featureLogo) {
      featureLogo.src = settings.featureLogo;
      featureLogo.alt = settings.featureAlt || '';
      if (settings.featureWidth) {
        featureLogo.style.width = settings.featureWidth + 'px';
      }
      if (settings.featureHeight) {
        featureLogo.style.height = settings.featureHeight + 'px';
        featureLogo.style.width = 'auto';
        /* the CSS cap only guards logos sized by width — an explicit
           height should not be silently clamped */
        featureLogo.style.maxHeight = 'none';
      }
      if (settings.featureNudge) {
        featureLogo.style.setProperty('--logo-nudge', settings.featureNudge + 'px');
      }
    } else {
      featureLogo.hidden = true;
    }

    if (settings.location) {
      whereName.textContent = settings.location;
    } else {
      where.hidden = true;
    }

    if (settings.eyebrow) {
      eyebrow.innerHTML = settings.eyebrow;
    } else {
      eyebrow.hidden = true;
    }

    if (!sponsors.length) {
      nameBox.innerHTML =
        '<span class="sponsor-name__text sponsor-name__text--in" ' +
        'style="white-space:normal;font-size:34px">No sponsors yet — ' +
        'add one to sponsors.js.</span>';
      scene.classList.add('slide--in');
      return;
    }

    if (settings.shuffle) shuffle(sponsors);

    /* ?sponsor=funko holds one logo on screen and stops the rotation */
    var wanted = new URLSearchParams(window.location.search).get('sponsor');
    if (wanted) {
      var found = -1;
      sponsors.forEach(function (s, i) {
        if (found < 0 && idOf(s) === wanted.toLowerCase()) found = i;
      });
      if (found > -1) { index = found; pinned = true; }
    }

    progress.hidden = !(settings.showProgress !== false &&
                        sponsors.length > 1 && !pinned);

    preloadAll();

    requestAnimationFrame(function () {
      scene.classList.add('slide--in');
    });

    setTimeout(play, reduceMotion ? 240 : FIRST_MS);
  }

  /* Preview helpers while you are building the list — harmless on the LED
     wall. Space / right arrow = next sponsor, left arrow = previous. */
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

  /* Wait for the brand faces before measuring or painting anything — see the
     same note in ../app.js. */
  function whenFontsReady(done) {
    if (!document.fonts || !document.fonts.load) return done();

    Promise.all([
      document.fonts.load('700 25px "CCC Body"'),
      document.fonts.load('800 52px "CCC Display"')
    ])
      .then(function () { return document.fonts.ready; })
      .then(done, done);
  }

  whenFontsReady(boot);
})();
