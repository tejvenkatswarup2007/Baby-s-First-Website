/* Lantern Cave — a CSS radial-gradient "mask" follows the pointer (mouse or finger)
   and lights up hidden treasures. */
(function () {
  'use strict';
  var cave = document.getElementById('cave');
  var foundEl = document.getElementById('found');
  var TREASURES = ['💎', '🦴', '⭐', '🍪', '🥚'];
  var DECO = ['🪨', '🍄', '🦇', '🕸️', '🪨', '🍄', '🐛', '🪨'];
  var found = 0, items = [];

  function setLight(x, y) {
    cave.style.setProperty('--x', x + 'px');
    cave.style.setProperty('--y', y + 'px');
  }
  function onMove(e) {
    var r = cave.getBoundingClientRect();
    setLight(Math.max(0, Math.min(r.width, e.clientX - r.left)), Math.max(0, Math.min(r.height, e.clientY - r.top)));
  }
  cave.addEventListener('pointermove', onMove);
  cave.addEventListener('pointerdown', onMove);

  function build() {
    items.forEach(function (n) { n.remove(); });
    items = []; found = 0; foundEl.textContent = '0';
    DECO.forEach(function (d) {
      var s = document.createElement('span');
      s.className = 'deco'; s.textContent = d; s.setAttribute('aria-hidden', 'true');
      s.style.left = (6 + Math.random() * 88) + '%'; s.style.top = (8 + Math.random() * 84) + '%';
      cave.insertBefore(s, cave.firstChild);
      items.push(s);
    });
    TREASURES.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'treasure'; b.textContent = t;
      b.setAttribute('data-nosound', '');
      b.setAttribute('aria-label', 'Hidden treasure');
      b.style.left = (8 + Math.random() * 84) + '%'; b.style.top = (10 + Math.random() * 80) + '%';
      b.addEventListener('click', function () {
        if (b.classList.contains('found')) return;
        b.classList.add('found'); found++;
        foundEl.textContent = found;
        Sfx.note(found + 1);
        if (found === TREASURES.length) {
          Sfx.hatch(); Mochi.celebrate();
          Mochi.toast('🎉 You found everything! Mochi is so proud.');
        }
      });
      cave.insertBefore(b, cave.querySelector('.dark'));
      items.push(b);
    });
    var r = cave.getBoundingClientRect();
    setLight(r.width / 2, r.height / 2);
  }

  document.getElementById('resetBtn').addEventListener('click', build);
  build();
})();
