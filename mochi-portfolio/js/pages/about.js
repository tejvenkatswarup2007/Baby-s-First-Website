/* About: growth-chart bars fill on scroll, fun-fact cards flip, roar button */
(function () {
  'use strict';

  var bars = [].slice.call(document.querySelectorAll('.bar'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    bars.forEach(function (b) { io.observe(b); });
  } else {
    bars.forEach(function (b) { b.classList.add('in'); });
  }

  [].forEach.call(document.querySelectorAll('.flip'), function (f) {
    f.addEventListener('click', function () {
      f.classList.toggle('flipped');
      Sfx.note(Math.floor(Math.random() * 8));
    });
  });

  var roarBtn = document.getElementById('hearRoar');
  if (roarBtn) {
    roarBtn.addEventListener('click', function () {
      Mochi.roar([document.querySelector('.about-hero .rex')]);
    });
  }
})();
