/* Home: smooth slideshow with buttons, dots, swipe, keyboard and autoplay */
(function () {
  'use strict';
  var root = document.getElementById('carousel');
  if (!root) return;
  var track = root.querySelector('.track');
  var slides = [].slice.call(track.children);
  var dots = root.querySelector('.dots');
  var i = 0, timer = null, startX = null;

  slides.forEach(function (_, n) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'dot';
    b.setAttribute('aria-label', 'Go to slide ' + (n + 1));
    b.addEventListener('click', function () { go(n, true); restart(); });
    dots.appendChild(b);
  });

  function go(n, userMade) {
    i = (n + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + (i * 100) + '%)';
    slides.forEach(function (s, k) { s.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
    [].forEach.call(dots.children, function (d, k) { d.classList.toggle('on', k === i); });
    if (userMade) Sfx.note(i * 2);
  }

  function restart() {
    clearInterval(timer);
    if (Mochi.reduce) return;
    timer = setInterval(function () { go(i + 1, false); }, 5500);
  }

  root.querySelector('.prev').addEventListener('click', function () { go(i - 1, true); restart(); });
  root.querySelector('.next').addEventListener('click', function () { go(i + 1, true); restart(); });

  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { go(i - 1, true); restart(); }
    if (e.key === 'ArrowRight') { go(i + 1, true); restart(); }
  });

  // swipe (touch + mouse drag)
  root.addEventListener('pointerdown', function (e) { startX = e.clientX; });
  root.addEventListener('pointerup', function (e) {
    if (startX === null) return;
    var dx = e.clientX - startX; startX = null;
    if (Math.abs(dx) > 50) { go(dx < 0 ? i + 1 : i - 1, true); restart(); }
  });
  root.addEventListener('pointercancel', function () { startX = null; });
  root.addEventListener('mouseenter', function () { clearInterval(timer); });
  root.addEventListener('mouseleave', restart);

  go(0, false);
  restart();
})();
