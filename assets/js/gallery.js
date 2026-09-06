(function () {
  'use strict';
  var gallery = document.querySelector('#interior .interior__gallery');
  if (!gallery || gallery.classList.contains('is-looping')) return;
  var cards = Array.from(gallery.querySelectorAll('.interior__item'));
  if (cards.length < 2) return;
  var rail = document.createElement('div');
  rail.className = 'interior__rail';
  var group = document.createElement('div');
  group.className = 'interior__group';
  cards.forEach(function (card) {
    var image = card.querySelector('img');
    if (image) image.loading = 'eager';
    group.appendChild(card);
  });
  var copy = group.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  copy.inert = true;
  copy.querySelectorAll('img').forEach(function (img) { img.alt = ''; });
  rail.appendChild(group);
  rail.appendChild(copy);
  gallery.appendChild(rail);
  gallery.classList.add('is-looping');
  gallery.tabIndex = 0;
  gallery.setAttribute('role', 'region');
  var reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function describe() {
    gallery.setAttribute('aria-label', reduced.matches ?
      '店内写真。横にスクロールしてご覧ください' :
      '店内写真が横に流れます。キーボードでここにフォーカスすると一時停止します');
  }
  function measure() {
    // The identical halves include their trailing gap: the seam is one regular gap.
    gallery.style.setProperty('--gallery-duration', (group.getBoundingClientRect().width / 40) + 's');
  }
  var visible = true;
  function playback() { rail.style.animationPlayState = visible && !document.hidden ? 'running' : 'paused'; }
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(group);
  else window.addEventListener('resize', measure);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      playback();
    }).observe(gallery);
  }
  document.addEventListener('visibilitychange', playback);
  reduced.addEventListener('change', function () {
    gallery.scrollLeft = 0;
    describe(); measure();
  });
  describe(); measure(); playback();
})();
