/* Opt-in audio sleeve: no autoplay, preload none, real button + range input for position. */
(function () {
  'use strict';
  var root = document.querySelector('.sleeve'); if (!root) return;
  var a = root.querySelector('audio'), btn = root.querySelector('.playbtn'), seek = root.querySelector('.seek'), time = root.querySelector('.time');
  function fmt(s) { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function paint() {
    var d = a.duration || 0, p = d ? (a.currentTime / d) * 100 : 0;
    seek.value = p; seek.style.setProperty('--p', p + '%');
    seek.setAttribute('aria-valuetext', fmt(a.currentTime) + ' of ' + fmt(d || 30));
    time.textContent = fmt(a.currentTime) + ' / ' + fmt(d || 30);
  }
  function state(playing) {
    btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    btn.setAttribute('aria-label', (playing ? 'Pause' : 'Play') + ' Willowbrook excerpt');
  }
  btn.addEventListener('click', function () { if (a.paused) a.play(); else a.pause(); });
  a.addEventListener('play', function () { state(true); });
  a.addEventListener('pause', function () { state(false); });
  a.addEventListener('ended', function () { a.currentTime = 0; state(false); paint(); });
  a.addEventListener('timeupdate', paint);
  a.addEventListener('loadedmetadata', paint);
  seek.addEventListener('input', function () { if (a.duration) a.currentTime = (seek.value / 100) * a.duration; });
  state(false); paint();
})();
