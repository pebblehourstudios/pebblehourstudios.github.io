/* Tiny vanilla 3-phone carousel (no library). The current screenshot is centred; previous/next sit
   behind it, smaller, darker and angled; the rest are parked behind the centre. Moving = swapping
   position classes; CSS transitions transform, filter and opacity (650ms).
   Auto-advance 4s; pauses on hover / focus-within / hidden tab; prefers-reduced-motion = no
   auto-rotate (CSS also removes the transition, so positions swap instantly).
   Keys: Left/Right. Swipe: pointer events, 40px. Click a side phone to go to it. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var INTERVAL = 4000, SWIPE = 40;

  function init(root) {
    var phones = Array.prototype.slice.call(root.querySelectorAll('.phone'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('.dot'));
    var prev = root.querySelector('.car-prev'), next = root.querySelector('.car-next');
    var stage = root.querySelector('.stage');
    var n = phones.length, i = 0, timer = null, hovering = false, focused = false, swiped = false;
    var POS = ['pos-c', 'pos-r', 'pos-hr', 'pos-hl', 'pos-l'];

    function posClass(d) {
      if (d === 0) return 'pos-c';
      if (d === 1) return 'pos-r';
      if (d === n - 1) return 'pos-l';
      return d <= n / 2 ? 'pos-hr' : 'pos-hl';
    }
    function show(k) {
      i = (k + n) % n;
      phones.forEach(function (p, j) {
        var c = posClass((j - i + n) % n);
        POS.forEach(function (x) { p.classList.remove(x); });
        p.classList.add(c);
        // only the centred slide is exposed to assistive tech, so "n of N" stays unambiguous
        if (c === 'pos-c') p.removeAttribute('aria-hidden'); else p.setAttribute('aria-hidden', 'true');
      });
      dots.forEach(function (d, j) {
        if (j === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
    }
    function paused() { return hovering || focused || document.hidden || reduce.matches; }
    function schedule() {
      clearTimeout(timer);
      stage.setAttribute('aria-live', paused() ? 'polite' : 'off');
      if (!paused()) timer = setTimeout(function () { show(i + 1); schedule(); }, INTERVAL);
    }
    function go(k) { show(k); schedule(); }

    dots.forEach(function (d, j) { d.addEventListener('click', function () { go(j); }); });
    prev.addEventListener('click', function () { go(i - 1); });
    next.addEventListener('click', function () { go(i + 1); });
    phones.forEach(function (p, j) {
      p.addEventListener('click', function () {
        if (swiped) { swiped = false; return; }
        if (j !== i && (p.classList.contains('pos-l') || p.classList.contains('pos-r'))) go(j);
      });
    });
    root.addEventListener('mouseenter', function () { hovering = true; schedule(); });
    root.addEventListener('mouseleave', function () { hovering = false; schedule(); });
    root.addEventListener('focusin', function () { focused = true; schedule(); });
    root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) { focused = false; schedule(); } });
    document.addEventListener('visibilitychange', schedule);
    if (reduce.addEventListener) reduce.addEventListener('change', schedule);
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
    });
    var x0 = null;
    stage.addEventListener('pointerdown', function (e) { x0 = e.clientX; swiped = false; });
    stage.addEventListener('pointerup', function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) >= SWIPE) { swiped = true; go(dx < 0 ? i + 1 : i - 1); }
    });
    stage.addEventListener('pointercancel', function () { x0 = null; });
    show(0); schedule();
  }
  Array.prototype.forEach.call(document.querySelectorAll('.carousel'), init);
})();
