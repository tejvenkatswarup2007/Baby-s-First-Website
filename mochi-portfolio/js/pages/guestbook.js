/* Guestbook: notes are stored in this browser (localStorage).
   To make it a shared, live wall, replace load()/save() with calls to a backend
   such as Firebase, Supabase or a small serverless function. */
(function () {
  'use strict';
  var KEY = 'mochi-guestbook';
  var STICKERS = ['🦖', '🥚', '🍪', '🫧', '🌈', '⭐', '💖', '🎈'];
  var COLORS = ['#ffd1dc', '#fff3b0', '#c4f1be', '#b8e0ff', '#e2c9ff', '#ffd9c2'];
  var SEED = [
    { n: 'Sleepy Cloud', m: 'I left you a tiny rainbow. Please keep it dry. 🌈', s: '☁️' },
    { n: 'Captain Snail', m: 'Your bubbles are the fastest thing in the valley (which is not saying much).', s: '🐌' },
    { n: 'Loud Frog', m: 'RIBBIT! (that means 10 out of 10)', s: '🐸' }
  ];

  var form = document.getElementById('gbForm');
  var nameEl = document.getElementById('gbName');
  var msgEl = document.getElementById('gbMsg');
  var wall = document.getElementById('gbNotes');
  var picker = document.getElementById('gbStickers');
  var count = document.getElementById('gbCount');

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  }
  function save(list) { try { localStorage.setItem(KEY, JSON.stringify(list.slice(-60))); } catch (e) {} }

  STICKERS.forEach(function (s, k) {
    var l = document.createElement('label');
    var inp = document.createElement('input');
    inp.type = 'radio'; inp.name = 'sticker'; inp.value = s; if (k === 0) inp.checked = true;
    var sp = document.createElement('span'); sp.textContent = s;
    l.appendChild(inp); l.appendChild(sp); picker.appendChild(l);
  });

  function noteEl(d, i) {
    var el = document.createElement('article');
    el.className = 'note';
    el.style.setProperty('--c', COLORS[i % COLORS.length]);
    el.style.setProperty('--r', ((i % 5) - 2) * 1.6 + 'deg');
    var em = document.createElement('span'); em.className = 'em'; em.textContent = d.s;
    var p = document.createElement('p'); p.textContent = d.m; p.style.margin = '6px 0 0';
    var b = document.createElement('b'); b.textContent = '— ' + d.n;
    el.appendChild(em); el.appendChild(p); el.appendChild(b);
    return el;
  }

  function render() {
    var mine = load();
    var all = mine.slice().reverse().concat(SEED);
    wall.innerHTML = '';
    all.forEach(function (d, i) { wall.appendChild(noteEl(d, i)); });
    count.textContent = mine.length ? ('You have pinned ' + mine.length + ' note' + (mine.length > 1 ? 's' : '') + '. Thank you! 💖') : 'Be the first to sign!';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = nameEl.value.trim(), m = msgEl.value.trim();
    if (!n || !m) return;
    var s = (form.querySelector('input[name="sticker"]:checked') || {}).value || '🦖';
    var list = load(); list.push({ n: n.slice(0, 20), m: m.slice(0, 140), s: s });
    save(list);
    render();
    form.reset();
    picker.querySelector('input').checked = true;
    Sfx.giggle(); Mochi.celebrate({ particleCount: 70, spread: 60 });
    Mochi.toast('📌 Pinned! Mochi says thank you!');
  });

  render();
})();
