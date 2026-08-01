/* ==========================================================================
   Cyprus Comic Con — section rotator
   Builds one slide at a time, plays it in, holds, plays it out, moves on.
   Content lives in sections.js — you should not need to touch this file.
   ========================================================================== */

(function () {
  'use strict';

  var DESIGN_W = 1920;
  var DESIGN_H = 1080;
  var OUT_MS = 900;   // must cover the longest .slide--out transition + delay

  var settings = window.CCC_SETTINGS || {};
  var sections = (window.CCC_SECTIONS || []).slice();

  var stage = document.getElementById('stage');
  var deck = document.getElementById('deck');
  var brandmark = document.getElementById('brandmark');
  var progress = document.getElementById('progress');
  var progressFill = document.getElementById('progressFill');

  var index = 0;
  var current = null;
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

  /* --- Wayfinding badge ---------------------------------------------------- */

  var PIN_PATH = 'M12 2C7.9 2 4.5 5.4 4.5 9.5c0 5.6 7.5 12.5 7.5 12.5s7.5-6.9 ' +
                 '7.5-12.5C19.5 5.4 16.1 2 12 2zm0 10.2a2.7 2.7 0 110-5.4 ' +
                 '2.7 2.7 0 010 5.4z';

  function buildWhere(text) {
    var where = document.createElement('div');
    where.className = 'where';

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'where__pin');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', PIN_PATH);
    svg.appendChild(path);

    var name = document.createElement('span');
    name.className = 'where__name';
    name.textContent = text;

    where.appendChild(svg);
    where.appendChild(name);
    return where;
  }

  /* --- Build one slide ---------------------------------------------------- */

  function buildSlide(data) {
    var slide = document.createElement('div');
    slide.className = 'slide';
    slide.style.setProperty('--accent', data.accent || '#ef7521');

    var slot = document.createElement('div');
    slot.className = 'panel-slot';

    var shadow = document.createElement('div');
    shadow.className = 'panel-shadow';
    var panel = document.createElement('div');
    panel.className = 'panel';
    shadow.appendChild(panel);
    slot.appendChild(shadow);

    if (data.logo) {
      var logo = document.createElement('img');
      logo.className = 'panel__logo';
      logo.src = data.logo;
      logo.alt = data.logoAlt || '';
      /* Logo files differ in aspect ratio and in how much transparent padding
         they carry, so each section can size and place its own artwork.
         Use logoWidth for wide wordmarks, logoHeight for square-ish marks. */
      if (data.logoWidth) logo.style.width = data.logoWidth + 'px';
      if (data.logoHeight) {
        logo.style.height = data.logoHeight + 'px';
        logo.style.width = 'auto';
        /* the CSS cap only guards logos sized by width — an explicit
           height should not be silently clamped */
        logo.style.maxHeight = 'none';
      }
      if (data.logoNudge) {
        logo.style.setProperty('--logo-nudge', data.logoNudge + 'px');
      }
      slot.appendChild(logo);
    }

    if (data.location) {
      slide.appendChild(buildWhere(data.location));
    }

    var copy = document.createElement('div');
    copy.className = 'copy';

    if (data.eyebrow) {
      var eyebrow = document.createElement('p');
      eyebrow.className = 'eyebrow';
      eyebrow.innerHTML = data.eyebrow;
      copy.appendChild(eyebrow);
    }

    var lines = data.headline || [];
    if (lines.length) {
      var headline = document.createElement('h1');
      headline.className = 'headline';
      lines.forEach(function (text, i) {
        var line = document.createElement('span');
        line.className = 'headline__line';
        line.style.setProperty('--i', i);
        line.innerHTML = text;
        headline.appendChild(line);
      });
      copy.appendChild(headline);
    }

    if (data.blurb) {
      var blurb = document.createElement('p');
      blurb.className = 'blurb';
      blurb.innerHTML = data.blurb;
      copy.appendChild(blurb);
    }

    var tags = data.tags || [];
    if (tags.length) {
      var list = document.createElement('ul');
      list.className = 'tags';
      tags.forEach(function (text, i) {
        var item = document.createElement('li');
        item.className = 'tag';
        item.style.setProperty('--i', i);
        item.innerHTML = text;
        list.appendChild(item);
      });
      copy.appendChild(list);
    }

    if (data.url) {
      var link = document.createElement('div');
      link.className = 'link';
      if (data.urlLabel) {
        var label = document.createElement('p');
        label.className = 'link__label';
        label.innerHTML = data.urlLabel;
        link.appendChild(label);
      }
      var url = document.createElement('p');
      url.className = 'link__url';
      url.textContent = data.url;
      link.appendChild(url);
      copy.appendChild(link);
    }

    slide.appendChild(slot);
    slide.appendChild(copy);
    return slide;
  }

  /* --- Keep long URLs on one line ------------------------------------------
     Section URLs vary from 20 to 60+ characters. Rather than let a long one
     overflow the column, step its size down until it fits. Run before the
     entrance starts so nothing visibly resizes on screen.
     -------------------------------------------------------------------------- */

  function fitUrl(slide) {
    var url = slide.querySelector('.link__url');
    var copy = slide.querySelector('.copy');
    if (!url || !copy) return;

    var available = copy.clientWidth;
    var size = 40;
    url.style.fontSize = size + 'px';
    while (url.offsetWidth > available && size > 21) {
      size -= 1;
      url.style.fontSize = size + 'px';
    }
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

  /* --- Preload the next logo so a swap never pops -------------------------- */

  function preload(data) {
    if (data && data.logo) {
      var img = new Image();
      img.src = data.logo;
    }
  }

  /* --- Show / advance ------------------------------------------------------ */

  function show(data) {
    var slide = buildSlide(data);
    deck.appendChild(slide);
    fitUrl(slide);
    /* commit the "out" start state before releasing the entrance */
    void slide.offsetWidth;
    slide.classList.add('slide--in');
    current = slide;

    var hold = data.duration || settings.duration || 12000;
    runProgress(hold);
    preload(sections[(index + 1) % sections.length]);

    if (pinned) return;
    if (sections.length < 2 && settings.replaySingleSection === false) return;

    holdTimer = setTimeout(advance, hold);
  }

  function advance() {
    clearTimeout(holdTimer);

    var leaving = current;
    if (leaving) {
      leaving.classList.remove('slide--in');
      leaving.classList.add('slide--out');
      setTimeout(function () {
        if (leaving.parentNode) leaving.parentNode.removeChild(leaving);
      }, reduceMotion ? 500 : OUT_MS);
    }

    index = (index + 1) % sections.length;

    /* let the outgoing slide clear the frame before the new one slams in */
    setTimeout(function () {
      show(sections[index]);
    }, reduceMotion ? 260 : 420);
  }

  /* --- Boot ---------------------------------------------------------------- */

  function boot() {
    fitStage();
    window.addEventListener('resize', fitStage);

    if (settings.brandLogo) {
      brandmark.src = settings.brandLogo;
    } else {
      brandmark.hidden = true;
    }

    if (!sections.length) {
      deck.innerHTML =
        '<div class="slide slide--in" style="place-items:center;' +
        'grid-template-columns:1fr;text-align:center">' +
        '<p class="blurb" style="opacity:1">No sections defined yet — ' +
        'add one to <strong>sections.js</strong>.</p></div>';
      return;
    }

    /* ?section=nomnomnomicon pins a single section and stops the rotation */
    var wanted = new URLSearchParams(window.location.search).get('section');
    if (wanted) {
      var found = sections.findIndex(function (s) { return s.id === wanted; });
      if (found > -1) {
        index = found;
        pinned = true;
      }
    }

    progress.hidden = !(settings.showProgress !== false && sections.length > 1 && !pinned);

    show(sections[index]);
  }

  /* Preview helpers while you are building slides — harmless on the LED wall.
     Space / right arrow = next section, R = replay the current entrance. */
  document.addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'ArrowRight') { e.preventDefault(); advance(); }
    if (e.key === 'r' || e.key === 'R') {
      clearTimeout(holdTimer);
      index = (index - 1 + sections.length) % sections.length;
      advance();
    }
  });

  /* Wait for the brand faces before building anything. document.fonts.ready
     is not enough on its own: at this point no text is using these families
     yet, so nothing is pending and it resolves immediately. Ask for each face
     explicitly, or the first slide gets laid out — and its URL measured — with
     fallback metrics. */
  function whenFontsReady(done) {
    if (!document.fonts || !document.fonts.load) return done();

    Promise.all([
      document.fonts.load('500 31px "CCC Body"'),
      document.fonts.load('700 40px "CCC Body"'),
      document.fonts.load('800 122px "CCC Display"')
    ])
      .then(function () { return document.fonts.ready; })
      .then(done, done);
  }

  whenFontsReady(boot);
})();
