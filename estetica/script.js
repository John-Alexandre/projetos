/**
 * ═══════════════════════════════════════════
 * CLÍNICA FLEUR ESTÉTICA — VIVID EDITION
 * Smooth scroll, parallax hints, counters,
 * fade-in observer, mobile menu, active nav
 * ═══════════════════════════════════════════
 */
(function () {
    'use strict';

    var header = document.getElementById('header');
    var menuToggle = document.getElementById('menuToggle');
    var mainNav = document.getElementById('mainNav');
    var whatsappFloat = document.getElementById('whatsappFloat');
    var navLinks = document.querySelectorAll('.nav-link');
    var sections = document.querySelectorAll('section[id]');
    var ticking = false;

    /* ── Scroll handler ── */
    function onScroll() {
        var y = window.scrollY;
        header.classList.toggle('scrolled', y > 30);

        if (whatsappFloat) {
            whatsappFloat.classList.toggle('visible', y > 500);
        }

        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });

    /* ── Active nav ── */
    function highlightNav() {
        var scrollPos = window.scrollY + 140;
        sections.forEach(function (sec) {
            var top = sec.offsetTop;
            var height = sec.offsetHeight;
            var id = sec.getAttribute('id');
            navLinks.forEach(function (link) {
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.toggle('active', scrollPos >= top && scrollPos < top + height);
                }
            });
        });
    }

    window.addEventListener('scroll', function () {
        window.requestAnimationFrame(highlightNav);
    }, { passive: true });

    /* ── Mobile menu ── */
    function openMenu() {
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Fechar menu');
        mainNav.classList.add('is-open');
        header.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
        mainNav.classList.remove('is-open');
        header.classList.remove('menu-open');
        document.body.style.overflow = '';
    }

    function toggleMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        var isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
        if (isOpen) { closeMenu(); } else { openMenu(); }
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    navLinks.forEach(function (l) { l.addEventListener('click', closeMenu); });

    var navCtaMobile = document.querySelector('.nav-cta-mobile');
    if (navCtaMobile) {
        navCtaMobile.addEventListener('click', function () { closeMenu(); });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
            closeMenu();
            menuToggle.focus();
        }
    });

    /* ── Intersection Observer: fade-in ── */
    function initFadeIn() {
        var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReduced) {
            document.querySelectorAll('.fade-in').forEach(function (el) { el.classList.add('is-visible'); });
            return;
        }

        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('.fade-in').forEach(function (el) { el.classList.add('is-visible'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.fade-in').forEach(function (el) { observer.observe(el); });
    }

    /* ── Counter animation ── */
    function initCounters() {
        var counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

        function animateCounter(el) {
            var target = parseInt(el.getAttribute('data-count'), 10);
            var duration = 2000;
            var startTime = null;

            function step(ts) {
                if (!startTime) startTime = ts;
                var progress = Math.min((ts - startTime) / duration, 1);
                var current = Math.floor(easeOutQuart(progress) * target);

                if (target >= 1000) {
                    el.textContent = current.toLocaleString('pt-BR') + '+';
                } else {
                    el.textContent = current;
                }

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    el.textContent = target >= 1000 ? target.toLocaleString('pt-BR') + '+' : target;
                }
            }

            window.requestAnimationFrame(step);
        }

        if ('IntersectionObserver' in window) {
            var obs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(function (el) { obs.observe(el); });
        } else {
            counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
        }
    }

    /* ── Smooth scroll ── */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (history.pushState) history.pushState(null, null, href);
            }
        });
    });

    /* ── Gallery: duplicate items for seamless loop ── */
    function initGallery() {
        var track = document.querySelector('.gallery-track');
        if (!track) return;
        var items = track.innerHTML;
        track.innerHTML = items + items;
    }

    /* ── Init ── */
    function init() {
        initFadeIn();
        initCounters();
        initGallery();
        onScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
