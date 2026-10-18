/* Bubble Pop Lab — 30-second pop-the-bubbles game (requestAnimationFrame loop) */
(function () {
  'use strict';
  var arena = document.getElementById('arena');
  var overlay = document.getElementById('overlay');
  var scoreEl = document.getElementById('score');
  var timeEl = document.getElementById('time');
  var bestEl = document.getElementById('best');
  var startBtn = document.getElementById('startBtn');
  var ovTitle = document.getElementById('ovTitle');
  var ovText = document.getElementById('ovText');
  var EMOJI = ['', '', '', '💖', '🌸', '🍓', '🦖', '🥚', '✨'];
  var DURATION = 30;

  var bubbles = [], running = false, score = 0, timeLeft = DURATION, last = 0, spawnAcc = 0, combo = 0, raf = 0;
  var best = parseInt(Mochi.get('mochi-bubble-best') || '0', 10);
  bestEl.textContent = best;

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  function spawn() {
    var w = arena.clientWidth, h = arena.clientHeight;
    var size = 52 + Math.random() * 46;
    var gold = Math.random() < 0.07;
    var el = document.createElement('div');
    el.className = 'gbubble' + (gold ? ' gold' : '');
    el.style.width = el.style.height = size + 'px';
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', gold ? 'Golden bubble' : 'Bubble');
    el.textContent = gold ? '⭐' : pick(EMOJI);
    var b = {
      el: el, size: size, gold: gold,
      x: Math.random() * Math.max(10, w - size), y: h + 4,
      speed: 55 + Math.random() * 60 + (DURATION - timeLeft) * 2.2, phase: Math.random() * 6
    };
    el.addEventListener('pointerdown', function (e) { e.preventDefault(); pop(b); });
    el.style.transform = 'translate(' + b.x + 'px,' + b.y + 'px)';
    arena.appendChild(el);
    bubbles.push(b);
  }

  function burst(b) {
    var cx = b.x + b.size / 2, cy = b.y + b.size / 2;
    for (var k = 0; k < 7; k++) {
      var s = document.createElement('span');
      s.className = 'fx'; s.textContent = b.gold ? '⭐' : '✨';
      var ang = (k / 7) * Math.PI * 2;
      s.style.left = cx + 'px'; s.style.top = cy + 'px';
      s.style.setProperty('--dx', Math.cos(ang) * 46 + 'px');
      s.style.setProperty('--dy', Math.sin(ang) * 46 + 'px');
      arena.appendChild(s);
      (function (el) { setTimeout(function () { el.remove(); }, 700); })(s);
    }
  }

  function floatText(b, txt) {
    var t = document.createElement('span');
    t.className = 'plus'; t.textContent = txt;
    t.style.left = b.x + 'px'; t.style.top = b.y + 'px';
    arena.appendChild(t);
    setTimeout(function () { t.remove(); }, 850);
  }

  function removeBubble(b) {
    var k = bubbles.indexOf(b);
    if (k > -1) bubbles.splice(k, 1);
    if (b.el.parentNode) b.el.parentNode.removeChild(b.el);
  }

  function pop(b) {
    if (!running || bubbles.indexOf(b) === -1) return;
    combo++;
    var pts = b.gold ? 50 : 10 + Math.min(combo, 10);
    score += pts;
    if (b.gold) { timeLeft += 3; Sfx.giggle(); } else { Sfx.pop(); }
    burst(b); floatText(b, '+' + pts);
    removeBubble(b);
    scoreEl.textContent = score;
  }

  function tick(ts) {
    if (!running) return;
    var dt = Math.min(0.05, (ts - last) / 1000);
    last = ts;
    timeLeft -= dt; spawnAcc += dt;
    var interval = Math.max(0.33, 0.72 - (DURATION - timeLeft) * 0.011);
    while (spawnAcc > interval) { spawnAcc -= interval; spawn(); }

    for (var k = bubbles.length - 1; k >= 0; k--) {
      var b = bubbles[k];
      b.y -= b.speed * dt;
      var sway = Math.sin(b.phase + ts / 600) * 12;
      b.el.style.transform = 'translate(' + (b.x + sway) + 'px,' + b.y + 'px)';
      if (b.y < -b.size - 6) { removeBubble(b); combo = 0; }
    }
    timeEl.textContent = Math.max(0, Math.ceil(timeLeft));
    if (timeLeft <= 0) { end(); return; }
    raf = requestAnimationFrame(tick);
  }

  function start() {
    bubbles.forEach(function (b) { if (b.el.parentNode) b.el.parentNode.removeChild(b.el); });
    bubbles = []; score = 0; combo = 0; timeLeft = DURATION; spawnAcc = 0;
    scoreEl.textContent = '0'; timeEl.textContent = DURATION;
    overlay.hidden = true; running = true;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }

  function end() {
    running = false; cancelAnimationFrame(raf);
    bubbles.forEach(function (b) { if (b.el.parentNode) b.el.parentNode.removeChild(b.el); });
    bubbles = [];
    var isBest = score > best;
    if (isBest) { best = score; Mochi.set('mochi-bubble-best', String(best)); bestEl.textContent = best; Mochi.celebrate(); Sfx.hatch(); }
    ovTitle.textContent = isBest ? '🎉 New best: ' + score + '!' : 'Time! You scored ' + score;
    ovText.textContent = isBest ? 'Mochi is SO proud of you!' : 'Best so far: ' + best + '. Try again?';
    startBtn.textContent = 'Play again 🫧';
    overlay.hidden = false;
  }

  startBtn.addEventListener('click', start);
})();
