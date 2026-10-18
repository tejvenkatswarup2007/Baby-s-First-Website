/* Shared behaviour for every page:
   header + footer, day/night theme, mute button, chaos mode, bubbles background,
   sparkle trail, eye tracking, mascot, page-transition wipe, odometer, Easter eggs. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement, body = doc.body;
  var PAGE = body.dataset.page || '';

  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- theme (day / night) ---------- */
  var theme = get('mochi-theme') || 'day';
  root.setAttribute('data-theme', theme);

  /* ---------- header ---------- */
  var NAV = [
    ['index.html', 'Home', '🏠'], ['about.html', 'About', '🦖'], ['projects.html', 'Projects', '🧸'],
    ['story.html', 'Story', '📖'], ['guestbook.html', 'Guestbook', '💌']
  ];
  var current = body.dataset.nav || (location.pathname.split('/').pop() || 'index.html');
  var links = NAV.map(function (n) {
    return '<a href="' + n[0] + '"' + (n[0] === current ? ' class="active" aria-current="page"' : '') + '>' + n[2] + ' ' + n[1] + '</a>';
  }).join('');

  body.insertAdjacentHTML('afterbegin',
    '<a class="skip" href="#main">Skip to content</a>' +
    '<div class="bubbles" aria-hidden="true"></div>' +
    '<header class="site-header">' +
      '<a class="brand" href="index.html"><span class="brand-egg">🥚</span><span>Mochi<small>the baby T-Rex</small></span></a>' +
      '<nav id="nav" class="nav" aria-label="Main">' + links + '</nav>' +
      '<div class="tools">' +
        '<button id="themeBtn" class="tool" type="button" aria-label="Switch day and night"></button>' +
        '<button id="soundBtn" class="tool" type="button" aria-label="Mute or unmute sound"></button>' +
        '<button id="chaosBtn" class="tool" type="button" aria-label="Toggle chaos mode" title="Chaos mode">🌈</button>' +
        '<button id="menuBtn" class="tool menu" type="button" aria-label="Open menu" aria-expanded="false">☰</button>' +
      '</div>' +
    '</header>');

  body.insertAdjacentHTML('beforeend',
    '<footer class="site-footer">' +
      '<div class="odo-wrap">💌 Dreams delivered: <span class="odometer" id="odo" aria-label="visitor counter"></span></div>' +
      '<p>Made with 💖 by <b>CodeTrinity</b> for the <i>Baby\'s First Website</i> hackathon · Oct 2026</p>' +
      '<p class="credits">Art credit: Mochi, his eggshell hat and all scenery are original hand-coded SVG + CSS. Emoji are drawn by your device\'s emoji font. Fonts: Fredoka, Nunito &amp; Fraunces (Google Fonts). Confetti: canvas-confetti. Code written with help from Claude (Anthropic).</p>' +
      '<p class="credits">~ best viewed in any browser that loves you ~ ✨</p>' +
    '</footer>' +
    '<div class="wipe" aria-hidden="true"></div>' +
    '<div id="toasts" aria-live="polite"></div>');

  var wipe = $('.wipe');

  /* ---------- floating bubbles ---------- */
  (function () {
    var host = $('.bubbles'), n = window.innerWidth < 600 ? 9 : 16;
    for (var i = 0; i < n; i++) {
      var b = doc.createElement('span'), s = 20 + Math.random() * 60;
      b.className = 'bg-bubble';
      b.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + Math.random() * 100 + '%;' +
        'animation-duration:' + (12 + Math.random() * 16) + 's;animation-delay:-' + Math.random() * 20 + 's';
      host.appendChild(b);
    }
  })();

  /* ---------- toast + celebration ---------- */
  function toast(msg) {
    var t = doc.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    $('#toasts').appendChild(t);
    setTimeout(function () { t.classList.add('out'); }, 3200);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 3700);
  }

  function celebrate(opts) {
    if (window.confetti) {
      window.confetti(Object.assign({
        particleCount: 130, spread: 80, origin: { y: 0.65 },
        colors: ['#a34063', '#ffd166', '#7fdba8', '#ffb3cf', '#9ad1ff']
      }, opts || {}));
    } else {
      var bits = ['🎉', '✨', '🥚', '🍪', '💖'];
      for (var i = 0; i < 22; i++) {
        var s = doc.createElement('span');
        s.className = 'emoji-rain'; s.textContent = bits[i % bits.length];
        s.style.left = Math.random() * 100 + 'vw'; s.style.animationDelay = Math.random() * 0.6 + 's';
        body.appendChild(s);
        (function (el) { setTimeout(function () { el.remove(); }, 3200); })(s);
      }
    }
  }

  /* ---------- inject Mochi everywhere ---------- */
  var showMascot = PAGE !== 'home' && !body.hasAttribute('data-no-mascot');
  if (showMascot) {
    var says = (body.dataset.says || 'Rawr! Hi there!|Psst… my eggshell hat is clickable 🥚|Tiny arms, giant ideas!|Try typing r-a-w-r!').split('|');
    body.insertAdjacentHTML('beforeend',
      '<div class="mascot"><div class="mascot-bubble" role="status"></div>' +
      '<div class="mascot-rex" data-rex data-hue="0" title="Click me!"></div></div>');
    var mBubble = $('.mascot-bubble'), si = 0, mTimer;
    var sayIt = function () {
      mBubble.textContent = says[si++ % says.length];
      mBubble.classList.add('show');
      clearTimeout(mTimer); mTimer = setTimeout(function () { mBubble.classList.remove('show'); }, 3200);
    };
    setTimeout(sayIt, 1200);
    $('.mascot-rex').addEventListener('click', function (e) {
      if (e.target.closest('.shell')) return;
      roar([$('.mascot .rex')]); sayIt();
    });
  }

  $$('[data-rex]').forEach(function (el) {
    el.innerHTML = Rex.svg({ hue: parseInt(el.dataset.hue || '0', 10) });
    el.classList.add('rex-wrap');
  });

  /* ---------- roar! ---------- */
  function roar(svgs) {
    svgs = svgs || $$('.rex');
    Sfx.roar();
    svgs.forEach(function (s) {
      if (!s) return;
      s.classList.add('roar');
      setTimeout(function () { s.classList.remove('roar'); }, 700);
    });
  }

  /* ---------- eye tracking (mouse + touch) ---------- */
  var px = null, py = null, ticking = false;
  function look() {
    ticking = false;
    if (px === null) return;
    $$('.rex').forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (!r.width) return;
      var cx = r.left + r.width / 2, cy = r.top + r.height * 0.38;
      var dx = px - cx, dy = py - cy, d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 180);
      var mx = (dx / d) * 9 * k, my = (dy / d) * 7 * k;
      $$('.pupil', s).forEach(function (p) { p.style.transform = 'translate(' + mx + 'px,' + my + 'px)'; });
    });
  }
  window.addEventListener('pointermove', function (e) {
    px = e.clientX; py = e.clientY;
    if (!ticking) { ticking = true; requestAnimationFrame(look); }
  }, { passive: true });
  window.addEventListener('pointerdown', function (e) {
    px = e.clientX; py = e.clientY;
    if (!ticking) { ticking = true; requestAnimationFrame(look); }
  }, { passive: true });

  /* ---------- sparkle trail ---------- */
  var lastSpark = 0, glyphs = ['✦', '✧', '★', '♥', '✿', '✨'], colors = ['#a34063', '#ffb703', '#7fdba8', '#ff8fb1', '#8ecae6'];
  window.addEventListener('pointermove', function (e) {
    if (reduce) return;
    var now = performance.now();
    if (now - lastSpark < 40) return;
    lastSpark = now;
    var s = doc.createElement('span');
    s.className = 'sparkle';
    s.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px';
    s.style.color = colors[Math.floor(Math.random() * colors.length)];
    s.style.setProperty('--dx', (Math.random() * 40 - 20) + 'px');
    s.style.setProperty('--dy', (Math.random() * 30 + 10) + 'px');
    s.style.fontSize = (10 + Math.random() * 14) + 'px';
    body.appendChild(s);
    setTimeout(function () { s.remove(); }, 850);
  }, { passive: true });

  /* ---------- buttons: theme / sound / chaos / menu ---------- */
  var themeBtn = $('#themeBtn'), soundBtn = $('#soundBtn'), chaosBtn = $('#chaosBtn'), menuBtn = $('#menuBtn'), nav = $('#nav');

  function paintTheme() {
    var night = root.getAttribute('data-theme') === 'night';
    themeBtn.textContent = night ? '☀️' : '🌙';
    themeBtn.setAttribute('aria-pressed', night ? 'true' : 'false');
    themeBtn.title = night ? 'Wake Mochi up' : 'Put Mochi to bed';
  }
  themeBtn.addEventListener('click', function () {
    theme = root.getAttribute('data-theme') === 'night' ? 'day' : 'night';
    root.setAttribute('data-theme', theme); set('mochi-theme', theme); paintTheme();
    toast(theme === 'night' ? '🌙 Shhh… Mochi is getting sleepy' : '☀️ Good morning, Mochi!');
  });
  paintTheme();

  function paintSound() {
    var m = Sfx.isMuted();
    soundBtn.textContent = m ? '🔇' : '🔊';
    soundBtn.setAttribute('aria-pressed', m ? 'true' : 'false');
    soundBtn.title = m ? 'Sound is off (click to turn on)' : 'Sound is on (click to mute)';
  }
  soundBtn.addEventListener('click', function () { Sfx.toggle(); if (!Sfx.isMuted()) Sfx.giggle(); });
  Sfx.onChange(paintSound);
  paintSound();

  if (get('mochi-chaos') === '1') body.classList.add('chaos');
  chaosBtn.setAttribute('aria-pressed', body.classList.contains('chaos') ? 'true' : 'false');
  chaosBtn.addEventListener('click', function () {
    var on = body.classList.toggle('chaos');
    set('mochi-chaos', on ? '1' : '0');
    chaosBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    toast(on ? '🌈 CHAOS MODE: ON — welcome to 1999!' : 'Chaos mode off. Phew.');
    if (on) Sfx.giggle();
  });

  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.textContent = open ? '✕' : '☰';
  });

  /* ---------- click sound on links & buttons ---------- */
  doc.addEventListener('click', function (e) {
    var t = e.target.closest('a,button');
    if (t && !t.closest('[data-nosound]')) Sfx.click();
  });

  /* ---------- page transition (bubble wipe) ---------- */
  doc.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    var h = a.getAttribute('href');
    if (!h || h.charAt(0) === '#' || a.target === '_blank' || /^(https?:|mailto:|tel:)/i.test(h)) return;
    e.preventDefault();
    wipe.style.setProperty('--wx', (e.clientX || window.innerWidth / 2) + 'px');
    wipe.style.setProperty('--wy', (e.clientY || 60) + 'px');
    wipe.classList.add('on');
    setTimeout(function () { location.href = a.href; }, reduce ? 0 : 420);
  });
  window.addEventListener('pageshow', function () { wipe.classList.remove('on'); });

  /* ---------- hit-counter odometer ---------- */
  (function () {
    var el = $('#odo'); if (!el) return;
    var n = parseInt(get('mochi-visits') || '0', 10);
    try {
      if (!sessionStorage.getItem('mochi-counted')) { n++; set('mochi-visits', String(n)); sessionStorage.setItem('mochi-counted', '1'); }
    } catch (e) {}
    var digits = String(1204 + n).padStart(5, '0').split('');
    digits.forEach(function (d) {
      var cell = doc.createElement('span'), col = doc.createElement('span');
      cell.className = 'digit'; col.className = 'col';
      for (var i = 0; i < 10; i++) { var x = doc.createElement('i'); x.textContent = i; col.appendChild(x); }
      cell.appendChild(col); el.appendChild(cell);
      setTimeout(function () { col.style.transform = 'translateY(-' + (parseInt(d, 10) * 10) + '%)'; }, 250);
    });
  })();

  /* ---------- Easter eggs ---------- */
  // 1) tap Mochi's eggshell hat 5 times
  var shellTaps = 0, shellTimer;
  doc.addEventListener('click', function (e) {
    if (!e.target.closest('.shell')) return;
    shellTaps++;
    clearTimeout(shellTimer); shellTimer = setTimeout(function () { shellTaps = 0; }, 2500);
    Sfx.pop();
    if (shellTaps >= 5) {
      shellTaps = 0;
      Sfx.hatch(); celebrate(); roar();
      toast('🥚 SECRET FOUND! Mochi gives you a fossil cookie 🍪');
      body.classList.add('party'); setTimeout(function () { body.classList.remove('party'); }, 5000);
    }
  });
  // 2) type "rawr" anywhere
  var typed = '';
  window.addEventListener('keydown', function (ev) {
    if (/input|textarea/i.test((ev.target.tagName || ''))) return;
    typed = (typed + ev.key.toLowerCase()).slice(-4);
    if (typed === 'rawr') { roar(); toast('🦖 RAWR! (that means hello)'); }
  });

  /* ---------- public helpers for page scripts ---------- */
  window.Mochi = { toast: toast, celebrate: celebrate, roar: roar, get: get, set: set, reduce: reduce };
})();
