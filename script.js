/* ============================================================
   八德教養院 官方形象網站
   script.js — 互動行為
   ============================================================ */

(function () {
  'use strict';

  // ---- 導覽列：滾動時加深陰影 ----
  const header = document.getElementById('site-header');

  function handleHeaderScroll() {
    if (window.scrollY > 12) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();


  // ---- 手機版選單切換 ----
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('is-open');
      menuToggle.classList.toggle('is-open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
    });

    // 點選手機版選單連結後收起選單
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('is-open');
        menuToggle.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });

    // 點選選單外側關閉
    document.addEventListener('click', function (e) {
      if (!header.contains(e.target) && mobileMenu.classList.contains('is-open')) {
        mobileMenu.classList.remove('is-open');
        menuToggle.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      }
    });
  }


  // ---- Fade-in 動畫：Intersection Observer ----
  if ('IntersectionObserver' in window) {
    const fadeEls = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // 不支援 IntersectionObserver 的瀏覽器直接顯示
    document.querySelectorAll('.fade-in').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }


  // ---- Hero 初始 fade-in（頁面載入時） ----
  window.addEventListener('load', function () {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      setTimeout(function () {
        heroContent.classList.add('is-visible');
      }, 100);
    }
  });


  // ---- 平滑滾動：錨點連結 ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    });
  });


  // ---- 服務卡片：進場動畫延遲 ----
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(function (card, index) {
    card.style.transitionDelay = (index * 0.07) + 's';
  });

  // 重置延遲，避免二次滾動看起來有延遲感
  if ('IntersectionObserver' in window) {
    const resetDelay = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(function () {
              entry.target.style.transitionDelay = '0s';
            }, 600);
          }
        });
      },
      { threshold: 0.8 }
    );

    serviceCards.forEach(function (card) {
      resetDelay.observe(card);
    });
  }


  // ---- 最新消息：點擊效果（預留展開功能） ----
  document.querySelectorAll('.news-item').forEach(function (item) {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');

    function handleActivation() {
      // 未來可連結至新聞詳細頁面
      // 目前僅做視覺回饋
    }

    item.addEventListener('click', handleActivation);
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleActivation();
      }
    });
  });


  // ---- 使用者偏好：減少動畫 ----
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');

    const scrollHint = document.querySelector('.hero-scroll-hint');
    if (scrollHint) {
      scrollHint.style.display = 'none';
    }
  }

})();
