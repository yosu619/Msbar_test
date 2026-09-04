/* ============================================
   M's BAR Karaoke - main.js
============================================ */
(function () {
  'use strict';

  // ヘッダー：スクロールで背景を濃くする
  var header = document.getElementById('js-header');
  var onScroll = function () {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ハンバーガーメニュー
  var burger = document.getElementById('js-burger');
  var nav = document.getElementById('js-nav');

  var closeNav = function () {
    burger.classList.remove('is-open');
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'メニューを開く');
  };

  burger.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('is-open');
    burger.classList.toggle('is-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  });

  // ナビリンクをタップしたらメニューを閉じる
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  // スクロール連動フェードイン
  var fadeTargets = document.querySelectorAll('.js-fade');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );
    fadeTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    fadeTargets.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
})();
