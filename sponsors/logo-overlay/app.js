/* ==========================================================================
   Limit Break — sponsor logo-only overlay
   Places one box on the 1920x1080 frame and cross-fades the sponsor logos
   through it. The list comes from ../sponsors.js; the settings come from
   logo-overlay.js. You should not need to touch this file.
   ========================================================================== */

(function () {
  'use strict';

  var DESIGN_W = 1920;
  var DESIGN_H = 1080;
  var SWAP_MS = 400;   // must cover the .logo--out transition

  var settings = window.CCC_LOGO_OVERLAY_SETTINGS || {};
  var sponsors = (window.CCC_SPONSORS || []).slice();

  var stage = document.getElementById('stage');
  var box = document.getElementById('logoBox');

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

  /* --- Place the box -------------------------------------------------------
     Five presets rather than raw coordinates, matching ../overlay so the two
     line up if you ever swap one for the other.
     -------------------------------------------------------------------------- */

  function placeBox() {
    var w = settings.width || 340;
    var h = settings.height || 132;
    var x = settings.offsetX || 0;
    var y = settings.offsetY || 0;
    var pos = settings.position || 'bottom-center';

    box.style.width = w + 'px';
    box.style.height = h + 'px';

    if (pos === 'bottom-center' || pos === 'top-center') {
      box.style.left = '50%';
      box.style.marginLeft = (-w / 2 + x) + 'px';
    } else if (pos === 'bottom-right' || pos === 'top-right') {
      box.style.right = x + 'px';
    } else {
      box.style.left = x + 'px';
    }

    if (pos.indexOf('top') === 0) {
      box.style.top = y + 'px';
    } else {
      box.style.bottom = y + 'px';
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

  /* --- Cycle --------------------------------------------------------------- */

  function showSponsor(data) {
    var logo = document.createElement('img');
    logo.className = 'logo';
    logo.src = logoPath(data);
    logo.alt = data.name || '';
    if (data.scale) logo.style.setProperty('--s', data.scale);

    var leaving = box.lastElementChild;
    box.appendChild(logo);

    /* commit the from-state before releasing the entrance */
    void logo.offsetWidth;
    logo.classList.add('logo--in');

    if (leaving) {
      leaving.classList.remove('logo--in');
      leaving.classList.add('logo--out');
      setTimeout(function () {
        if (leaving.parentNode) leaving.parentNode.removeChild(leaving);
      }, SWAP_MS);
    }
  }

  function play() {
    var data = sponsors[index];
    showSponsor(data);

    if (pinned || sponsors.length < 2) return;
    var hold = data.duration || settings.duration || 10000;
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

    placeBox();

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

    preloadAll();
    setTimeout(play, reduceMotion ? 0 : 100);
  }

  /* Preview helpers while you are placing the box. Space / right arrow =
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

  boot();
})();
