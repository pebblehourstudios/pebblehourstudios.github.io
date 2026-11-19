/* Pebble Hour: manual 3-phone coverflow carousel (no autoplay, no library).
   The current screenshot is centered; previous/next sit behind it (smaller, darker, angled); the rest are
   parked behind the center. Moving swaps position classes; CSS transitions transform, filter, opacity
   (650ms; none under prefers-reduced-motion). Controls: prev/next buttons, dots, Left/Right keys,
   swipe (pointer events, 40px) and clicking a side phone. Only the centered slide is exposed to AT.
   Without JS all five phones render in their initial coverflow positions. */
(function () {
  'use strict';
  var SWIPE = 40;
  function init(root) {
    var phones = Array.prototype.slice.call(root.querySelectorAll('.phone'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('.dot'));
    var prev = root.querySelector('.car-prev'), next = root.querySelector('.car-next');
    var stage = root.querySelector('.stage');
    var cap = root.querySelector('.car-cap');
    var n = phones.length, i = 0, swiped = false;
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
        if (c === 'pos-c') p.removeAttribute('aria-hidden'); else p.setAttribute('aria-hidden', 'true');
      });
      dots.forEach(function (d, j) {
        if (j === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
      if (cap) cap.textContent = phones[i].getAttribute('data-caption') || '';
    }
    dots.forEach(function (d, j) { d.addEventListener('click', function () { show(j); }); });
    prev.addEventListener('click', function () { show(i - 1); });
    next.addEventListener('click', function () { show(i + 1); });
    phones.forEach(function (p, j) {
      p.addEventListener('click', function () {
        if (swiped) { swiped = false; return; }
        if (p.classList.contains('pos-l') || p.classList.contains('pos-r')) show(j);
      });
    });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); show(i + 1); }
    });
    var x0 = null;
    stage.addEventListener('pointerdown', function (e) { x0 = e.clientX; swiped = false; });
    stage.addEventListener('pointerup', function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) >= SWIPE) { swiped = true; show(dx < 0 ? i + 1 : i - 1); }
    });
    stage.addEventListener('pointercancel', function () { x0 = null; });
    show(0);
  }
  Array.prototype.forEach.call(document.querySelectorAll('.carousel'), init);
})();
