/* M's BAR: a short brand entrance, followed by viewport-aware FV reveals. */
(function () {
  'use strict';
  var root = document.documentElement;
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var overlay, observer, watchdog, finishTimer;
  var closed = false, started = false, locked = [];
  var keyboardInteraction = false;
  var startedAt = performance.now();
  var showIntro = !motion.matches && !window.location.hash;
  var ready = function (fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  };
  function unlock() {
    locked.forEach(function (entry) { entry.el.inert = entry.wasInert; });
    locked = [];
    root.classList.remove('intro-pending');
  }
  function finish() {
    closed = true;
    clearTimeout(watchdog);
    clearTimeout(finishTimer);
    var hadFocus = overlay && overlay.contains(document.activeElement);
    unlock();
    if (overlay) { overlay.remove(); overlay = null; }
    if (hadFocus && keyboardInteraction) {
      var logoLink = document.querySelector('.header__logo');
      if (logoLink) logoLink.focus({ preventScroll: true });
    }
  }
  function revealHero(immediate) {
    if (started && !immediate) return;
    started = true;
    var hero = document.querySelector('.hero--refined');
    if (!hero) return;
    var targets = hero.querySelectorAll('.hero__lead, .hero__title, .hero__brand-note, .hero__eyebrow, .hero__catch, .hero__description, .hero__badges, .hero__welcome, .hero__cta, .hero__scroll');
    if (immediate || motion.matches || !('IntersectionObserver' in window)) {
      if (observer) observer.disconnect();
      root.classList.remove('fv-motion');
      targets.forEach(function (el) { el.classList.add('fv-enter'); });
      return;
    }
    root.classList.add('fv-motion');
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('fv-enter'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    targets.forEach(function (el) { observer.observe(el); });
    // Mouse-only depth. Touch and reduced-motion visitors retain a static logo.
    var title = hero.querySelector('.hero__title');
    if (title && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      var frame = 0;
      title.addEventListener('pointermove', function (event) {
        if (motion.matches) return;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(function () {
          var box = title.getBoundingClientRect();
          title.style.setProperty('--logo-x', ((event.clientX - box.left) / box.width - .5) * 4 + 'deg');
          title.style.setProperty('--logo-y', -((event.clientY - box.top) / box.height - .5) * 4 + 'deg');
        });
      });
      title.addEventListener('pointerleave', function () {
        cancelAnimationFrame(frame);
        title.style.setProperty('--logo-x', '0deg');
        title.style.setProperty('--logo-y', '0deg');
      });
    }
  }
  function open(skip) {
    if (closed) return;
    closed = true;
    clearTimeout(watchdog);
    if (skip || motion.matches) { revealHero(true); finish(); return; }
    if (overlay) {
      overlay.classList.add('is-opening');
      var status = overlay.querySelector('[role="status"]');
      if (status) status.textContent = 'ようこそ、M’s BARへ。';
    }
    revealHero(false);
    finishTimer = setTimeout(finish, 1150);
  }
  if (showIntro) {
    overlay = document.createElement('div');
    overlay.className = 'site-opening';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'M’s BAR オープニング');
    overlay.innerHTML = '<div class="site-opening__curtain site-opening__curtain--left"></div><div class="site-opening__curtain site-opening__curtain--right"></div><div class="site-opening__center"><p class="site-opening__eyebrow">YOUR NIGHT STARTS HERE</p><div class="site-opening__logo"><img src="assets/img/logo-gold.png" width="800" height="566" alt="M’s BAR Karaoke" fetchpriority="high"></div><p class="site-opening__message">今夜も、心ほどけるひとときを。</p><div class="site-opening__line" aria-hidden="true"><span></span></div><p class="site-opening__status" role="status">WELCOME TO M’S BAR</p></div><button class="site-opening__skip" type="button">スキップ <span aria-hidden="true">↗</span></button>';
    document.body.appendChild(overlay);
    root.classList.add('intro-pending');
    overlay.querySelector('button').addEventListener('click', function () { open(true); });
    overlay.addEventListener('pointerdown', function () { keyboardInteraction = false; });
    overlay.addEventListener('keydown', function (event) {
      keyboardInteraction = true;
      if (event.key === 'Escape') { event.preventDefault(); open(true); }
      if (event.key === 'Tab') { event.preventDefault(); overlay.querySelector('button').focus(); }
    });
    // Never leave the page behind an entrance if an asset or script stalls.
    watchdog = setTimeout(function () { open(true); }, 4500);
  }
  ready(function () {
    if (!showIntro || closed) { revealHero(true); return; }
    Array.prototype.forEach.call(document.body.children, function (el) {
      if (el !== overlay && el.tagName !== 'SCRIPT') {
        locked.push({ el: el, wasInert: el.inert });
        el.inert = true;
      }
    });
    overlay.querySelector('button').focus({ preventScroll: true });
    var heroLogo = document.querySelector('.hero__logo');
    var waitForLogo = heroLogo && heroLogo.decode ? heroLogo.decode().catch(function () {}) : Promise.resolve();
    var fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    var minimum = new Promise(function (resolve) { setTimeout(resolve, Math.max(0, 1400 - (performance.now() - startedAt))); });
    var assets = Promise.race([Promise.all([waitForLogo, fonts]), new Promise(function (resolve) { setTimeout(resolve, 2200); })]);
    Promise.all([minimum, assets]).then(function () { open(false); }).catch(function () { open(true); });
  });
  motion.addEventListener('change', function () {
    if (motion.matches) { open(true); ready(function () { revealHero(true); }); }
  });
  window.addEventListener('pagehide', finish);
  window.addEventListener('pageshow', function (event) { if (event.persisted) { finish(); revealHero(true); } });
})();

