/**
 * 八德教養院 官方形象網站
 * script.js — 交互行為與動畫控制
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. 啟用 CSS 內的淡入基礎設定（防白屏降級機制）
  document.body.classList.add('js-enabled');

  // 2. 手機版漢堡選單控制
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.toggle('is-open');
      mobileMenu.classList.toggle('is-open');
      
      // 同步網頁無障礙（Accessibility）狀態
      menuToggle.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
    });

    // 點擊選單內任意連結後，自動收合選單（優化手機版體驗）
    const mobileLinks = mobileMenu.querySelectorAll('nav a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // 3. 滾動淡入動畫 (Intersection Observer)
  const fadeInElements = document.querySelectorAll('.fade-in');
  
  const observerOptions = {
    root: null, // 以瀏覽器視窗作為比例參照
    threshold: 0.1, // 元素露出 10% 面積時即觸發動畫
    rootMargin: '0px 0px -40px 0px' // 微調滾動觸發邊界
  };

  const fadeInObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // 動畫只執行一次，之後解除監聽
      }
    });
  }, observerOptions);

  fadeInElements.forEach(el => fadeInObserver.observe(el));

  // 4. 頂部導覽列滾動陰影特效
  const header = document.getElementById('site-header');
  
  if (header) {
    const toggleHeaderShadow = () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    
    // 初始化執行一次，並監聽滾動事件
    toggleHeaderShadow();
    window.addEventListener('scroll', toggleHeaderShadow, { passive: true });
  }
});
