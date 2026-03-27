'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ========================================================================
     1. NAVIGATION — hide on scroll, active link
     ======================================================================== */
  (() => {
    const nav      = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav__link');
    if (!nav) return;

    let lastScrollY = 0;
    let ticking     = false;
    let menuOpen    = false;

    function handleScroll() {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        if (!menuOpen) {
          nav.classList.toggle('nav--hidden', y > lastScrollY && y > 80);
        }
        nav.classList.toggle('nav--scrolled', y > 20);
        lastScrollY = y;
        ticking = false;
      });
      ticking = true;
    }

    function updateActiveLink() {
      const sections  = document.querySelectorAll('section[id]');
      const threshold = window.scrollY + 140;
      sections.forEach(sec => {
        const top = sec.offsetTop;
        const bot = top + sec.offsetHeight;
        const id  = sec.getAttribute('id');
        if (threshold >= top && threshold < bot) {
          navLinks.forEach(link =>
            link.classList.toggle('nav__link--active',
              link.getAttribute('href') === '#' + id)
          );
        }
      });
    }

    window.addEventListener('scroll', handleScroll,    { passive: true });
    window.addEventListener('scroll', updateActiveLink, { passive: true });

    /* ------------------------------------------------------------------
       MOBILE MENU — separate overlay element
       ------------------------------------------------------------------ */
    const overlay    = document.getElementById('mobile-menu');
    const toggleBtn  = document.getElementById('menu-toggle');
    const closeBtn   = document.getElementById('menu-close');

    if (overlay && toggleBtn && closeBtn) {
      const overlayLinks = overlay.querySelectorAll('a');

      function openMenu() {
        menuOpen = true;
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        toggleBtn.setAttribute('aria-expanded', 'true');
        nav.classList.remove('nav--hidden');
        closeBtn.focus();
      }

      function closeMenu() {
        menuOpen = false;
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.focus();
      }

      toggleBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        openMenu();
      });

      closeBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
      });

      // Close on any link/button click inside overlay
      overlayLinks.forEach(link => {
        link.addEventListener('click', () => closeMenu());
      });

      // Close on backdrop click
      const backdrop = overlay.querySelector('.mobile-overlay__backdrop');
      if (backdrop) {
        backdrop.addEventListener('click', closeMenu);
      }

      // Close on Escape
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && menuOpen) closeMenu();
      });
    }
  })();


  /* ========================================================================
     2. SCROLL REVEAL
     ======================================================================== */
  (() => {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if (!('IntersectionObserver' in window)) {
      reveals.forEach(el => el.classList.add('reveal--visible'));
      return;
    }

    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => observer.observe(el));

    // Safety fallback
    setTimeout(() => reveals.forEach(el => el.classList.add('reveal--visible')), 3000);
  })();


  /* ========================================================================
     3. WHATSAPP LINKS
     ======================================================================== */
  (() => {
    const NUMBER  = '5511999999999';
    const MESSAGE = encodeURIComponent('Olá, Dra. Aris! Gostaria de agendar uma consulta.');
    const URL     = `https://wa.me/${NUMBER}?text=${MESSAGE}`;
    document.querySelectorAll('[data-whatsapp]').forEach(el => {
      el.setAttribute('href', URL);
    });
  })();


  /* ========================================================================
     4. NEWSLETTER
     ======================================================================== */
  (() => {
    const form = document.querySelector('#newsletter-form');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input?.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        input?.setAttribute('aria-invalid', 'true');
        input?.focus();
        return;
      }
      input.setAttribute('aria-invalid', 'false');
      console.info('[Newsletter]', email);
      input.value = '';
      const btn = form.querySelector('button');
      const orig = btn.innerHTML;
      btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;font-variation-settings:\'FILL\' 1">check</span>';
      setTimeout(() => { btn.innerHTML = orig; }, 2500);
    });
  })();


  /* ========================================================================
     5. CURRENT YEAR
     ======================================================================== */
  const yearEl = document.querySelector('[data-current-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
