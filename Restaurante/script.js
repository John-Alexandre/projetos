/* ========================================
   SAVEUR — script.js
   ======================================== */

// ── Nav com scroll ──
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
});

// ── Menu mobile ──
function toggleMobileNav() {
  const nav = document.getElementById('mobileNav');
  const ham = document.getElementById('hamburger');
  nav.classList.toggle('open');
  ham.classList.toggle('open');
  document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
}

function closeMobileNav() {
  document.getElementById('mobileNav').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
  document.body.style.overflow = '';
}

// ── Animação fade-in ao scroll ──
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));
