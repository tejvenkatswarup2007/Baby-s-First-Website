/* Egg Hatchery — tap 5 times to hatch a unique baby dino; collection saved in localStorage */
(function () {
  'use strict';
  var KEY = 'mochi-hatchlings';
  var NAMES = ['Biscuit', 'Waffle', 'Pudding', 'Noodle', 'Sprinkles', 'Pickle', 'Bean', 'Marsh', 'Choco', 'Dumpling', 'Nugget', 'Mango', 'Pebble', 'Tofu', 'Jelly', 'Cocoa'];
  var TRAITS = ['loves jumping in puddles', 'hums when happy', 'collects shiny pebbles', 'is scared of balloons (adorable)', 'sleeps upside down', 'hugs every tree', 'sneezes glitter', 'can balance on one foot', 'tells very bad jokes', 'dreams in rainbow colours'];
  var HUES = [0, 40, 90, 150, 200, 260, 320, -40];

  var egg = document.getElementById('egg');
  var eggZone = document.getElementById('eggZone');
  var reveal = document.getElementById('reveal');
  var hint = document.getElementById('eggHint');
  var dots = [].slice.call(document.querySelectorAll('#dotsRow i'));
  var cracks = [].slice.call(egg.querySelectorAll('.cracks path'));
  var shelf = document.getElementById('shelf');
  var empty = document.getElementById('emptyShelf');
  var countEl = document.getElementById('count');
  var newRex = document.getElementById('newRex');
  var stage = 0;

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
  function save(l) { try { localStorage.setItem(KEY, JSON.stringify(l.slice(-24))); } catch (e) {} }

  function renderShelf() {
    var list = load();
    shelf.innerHTML = '';
    list.slice().reverse().forEach(function (h) {
      var d = document.createElement('div');
      d.className = 'hatchling';
      d.innerHTML = Rex.svg({ hue: h.hue });
      var b = document.createElement('b'); b.textContent = h.name;
      var t = document.createElement('span'); t.textContent = h.trait;
      d.appendChild(b); d.appendChild(t);
      shelf.appendChild(d);
    });
    countEl.textContent = list.length;
    empty.hidden = list.length > 0;
  }

  function paint() {
    cracks.forEach(function (c, k) { c.classList.toggle('on', k < stage); });
    dots.forEach(function (d, k) { d.classList.toggle('on', k < stage); });
  }

  function hatch() {
    var baby = { name: pick(NAMES), trait: pick(TRAITS), hue: pick(HUES) };
    var list = load(); list.push(baby); save(list);
    eggZone.hidden = true;
    newRex.innerHTML = Rex.svg({ hue: baby.hue });
    newRex.classList.add('rex-wrap');
    document.getElementById('newName').textContent = 'Say hi to ' + baby.name + '!';
    document.getElementById('newTrait').textContent = baby.name + ' ' + baby.trait + '.';
    reveal.hidden = false;
    Sfx.hatch(); Mochi.celebrate();
    renderShelf();
  }

  function tap() {
    if (stage >= 5) return;
    stage++;
    paint();
    Sfx.crack();
    egg.classList.remove('shake'); void egg.offsetWidth; egg.classList.add('shake');
    var left = 5 - stage;
    hint.textContent = left ? (left === 1 ? 'One more tap!!' : left + ' more taps…') : 'It’s hatching!';
    if (stage === 5) setTimeout(hatch, 450);
  }

  egg.addEventListener('click', tap);

  document.getElementById('againBtn').addEventListener('click', function () {
    stage = 0; paint();
    reveal.hidden = true; eggZone.hidden = false;
    hint.textContent = 'Tap the egg!';
  });

  renderShelf();
})();
