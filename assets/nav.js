/* Hairline under the sticky nav once the page leaves the top. At rest the bar matches the page. */
(function () {
  'use strict';
  var nav = document.querySelector('.nav');
  if (!nav) return;
  function update() {
    nav.classList.toggle('is-scrolled', window.scrollY > 0);
  }
  update();
  window.addEventListener('scroll', update, { passive: true });
})();
