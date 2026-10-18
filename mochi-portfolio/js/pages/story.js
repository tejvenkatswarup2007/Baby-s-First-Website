/* Story: scenes reveal on scroll, the background colour changes per scene,
   and tiny Mochi walks along the bottom progress bar. */
(function () {
  'use strict';
  var scenes = [].slice.call(document.querySelectorAll('.scene-s'));
  var bg = document.getElementById('storyBg');
  var fill = document.getElementById('storyFill');
  var marker = document.getElementById('storyMarker');
  var lastScene = -1;

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        bg.style.background = en.target.dataset.bg;
        var idx = scenes.indexOf(en.target);
        if (idx !== lastScene) { lastScene = idx; Sfx.note(idx * 2); }
      });
    }, { threshold: 0.4 });
    scenes.forEach(function (s) { io.observe(s); });
  } else {
    scenes.forEach(function (s) { s.classList.add('in'); });
  }

  function onScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    var w = document.documentElement.clientWidth;
    fill.style.width = (p * 100) + '%';
    marker.style.left = Math.min(w - 28, Math.max(28, p * w)) + 'px';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
