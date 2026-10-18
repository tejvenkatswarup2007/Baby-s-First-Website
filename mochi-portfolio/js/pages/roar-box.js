/* Roar Box — 8 music-box pads (C major scale), lullaby player, roar & giggle */
(function () {
  'use strict';
  var padsEl = document.getElementById('pads');
  var trail = document.getElementById('trail');
  var rex = document.querySelector('#boxRex .rex');
  var NAMES = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Ti', 'Do'];
  var COLORS = ['#ffb3c7', '#ffd6a5', '#fff3b0', '#c4f1be', '#a0e7e5', '#b8e0ff', '#d4b5ff', '#ffc6e7'];
  var KEYS = ['1', '2', '3', '4', '5', '6', '7', '8'];
  var EMOJI = ['🌸', '🍊', '🌼', '🍀', '🫧', '💎', '🔮', '🎀'];
  var pads = [];

  NAMES.forEach(function (n, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'pad';
    b.setAttribute('data-nosound', '');
    b.style.setProperty('--c', COLORS[i]);
    b.setAttribute('aria-label', 'Play note ' + n + ' (key ' + KEYS[i] + ')');
    b.innerHTML = EMOJI[i] + '<br>' + n + '<small>' + KEYS[i] + '</small>';
    b.addEventListener('pointerdown', function (e) { e.preventDefault(); play(i); });
    b.addEventListener('click', function (e) { if (e.detail === 0) play(i); }); // keyboard Enter / Space
    padsEl.appendChild(b);
    pads.push(b);
  });

  function play(i) {
    Sfx.note(i);
    pads[i].classList.add('hit');
    setTimeout(function () { pads[i].classList.remove('hit'); }, 140);
    trail.textContent = (trail.textContent + EMOJI[i]).slice(-24);
    if (rex) {
      rex.classList.add('roar');
      setTimeout(function () { rex.classList.remove('roar'); }, 220);
    }
  }

  window.addEventListener('keydown', function (e) {
    var k = KEYS.indexOf(e.key);
    if (k > -1 && !e.repeat) play(k);
  });

  var lullabyBtn = document.getElementById('lullabyBtn');
  var playing = false;
  function stopLullaby() { Sfx.stopLullaby(); playing = false; lullabyBtn.textContent = '🌙 Play lullaby'; }
  lullabyBtn.addEventListener('click', function () {
    if (playing) { stopLullaby(); return; }
    if (Sfx.isMuted()) { Mochi.toast('🔇 Sound is muted. Tap 🔊 at the top to listen!'); }
    playing = true; lullabyBtn.textContent = '⏹ Stop lullaby'; trail.textContent = '';
    Sfx.lullaby(function (n) {
      pads[n].classList.add('hit');
      setTimeout(function () { pads[n].classList.remove('hit'); }, 220);
      trail.textContent = (trail.textContent + EMOJI[n]).slice(-24);
    }, function () { stopLullaby(); });
  });

  document.getElementById('roarBtn').addEventListener('click', function () { Mochi.roar([rex]); });
  document.getElementById('giggleBtn').addEventListener('click', function () { Sfx.giggle(); });

  // stop music if the sound gets muted
  Sfx.onChange(function (m) { if (m) stopLullaby(); });
})();
