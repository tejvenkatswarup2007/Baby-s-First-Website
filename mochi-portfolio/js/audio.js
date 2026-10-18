/* Tiny Web Audio toolkit — no audio files needed, every sound is synthesized.
   Sound can be muted with the 🔊 button in the header (choice is remembered). */
window.Sfx = (function () {
  'use strict';
  var ctx = null, muted = false, listeners = [], timer = null;
  try { muted = localStorage.getItem('mochi-muted') === '1'; } catch (e) {}

  // C major scale, one octave (C5 -> C6)
  var SCALE = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5];

  function ac() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { ctx = new AC(); } catch (e) { return null; }
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(o) {
    if (muted) return;
    var c = ac(); if (!c) return;
    var t = c.currentTime + (o.delay || 0);
    var dur = o.dur || 0.25, vol = o.vol || 0.18;
    var osc = c.createOscillator(), g = c.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.freq, t);
    if (o.slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, o.freq + o.slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(c.destination);
    osc.start(t); osc.stop(t + dur + 0.05);
  }

  function noise(dur, vol, delay) {
    if (muted) return;
    var c = ac(); if (!c) return;
    var t = c.currentTime + (delay || 0);
    var n = Math.floor(c.sampleRate * dur);
    var buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    var s = c.createBufferSource(), g = c.createGain(), f = c.createBiquadFilter();
    s.buffer = buf; g.gain.value = vol; f.type = 'highpass'; f.frequency.value = 1200;
    s.connect(f); f.connect(g); g.connect(c.destination);
    s.start(t);
  }

  function note(i, dur) {
    var f = SCALE[((i % 8) + 8) % 8];
    tone({ freq: f, type: 'sine', dur: dur || 0.7, vol: 0.2 });
    tone({ freq: f * 2, type: 'triangle', dur: (dur || 0.7) * 0.6, vol: 0.05 });
  }

  function stopLullaby() { if (timer) { clearTimeout(timer); timer = null; } }

  // "Twinkle, twinkle" (a traditional public-domain tune) on a music-box voice
  function lullaby(onNote, onEnd) {
    stopLullaby();
    var seq = [0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0], i = 0;
    (function step() {
      if (i >= seq.length) { timer = null; if (onEnd) onEnd(); return; }
      var n = seq[i++];
      note(n, 0.6);
      if (onNote) onNote(n);
      timer = setTimeout(step, i === 7 ? 760 : 430);
    })();
  }

  function setMuted(v) {
    muted = !!v;
    try { localStorage.setItem('mochi-muted', muted ? '1' : '0'); } catch (e) {}
    if (muted) stopLullaby();
    listeners.forEach(function (fn) { fn(muted); });
  }

  return {
    click: function () { tone({ freq: 640, type: 'triangle', dur: 0.09, vol: 0.12, slide: 260 }); },
    pop: function () { tone({ freq: 380 + Math.random() * 240, type: 'sine', dur: 0.14, vol: 0.2, slide: 420 }); },
    note: note,
    roar: function () {
      tone({ freq: 300, type: 'sawtooth', dur: 0.5, vol: 0.12, slide: -170 });
      tone({ freq: 150, type: 'square', dur: 0.45, vol: 0.06, slide: -70 });
      tone({ freq: 820, type: 'sine', dur: 0.2, vol: 0.1, slide: -380, delay: 0.02 });
    },
    giggle: function () {
      for (var k = 0; k < 5; k++) tone({ freq: 620 + k * 70, type: 'triangle', dur: 0.1, vol: 0.14, delay: k * 0.09 });
    },
    crack: function () { noise(0.09, 0.35); tone({ freq: 200, type: 'square', dur: 0.08, vol: 0.08, slide: -60 }); },
    hatch: function () {
      noise(0.2, 0.3);
      [0, 2, 4, 7].forEach(function (n, k) { tone({ freq: SCALE[n], type: 'triangle', dur: 0.35, vol: 0.16, delay: 0.1 + k * 0.09 }); });
    },
    lullaby: lullaby,
    stopLullaby: stopLullaby,
    isMuted: function () { return muted; },
    setMuted: setMuted,
    toggle: function () { setMuted(!muted); return muted; },
    onChange: function (fn) { listeners.push(fn); }
  };
})();
