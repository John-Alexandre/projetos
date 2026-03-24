/**
 * DentaCare – Clínica Odontológica
 * script.js
 */

/* =============================================
   1. NAV: scroll shadow + active links
   ============================================= */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* =============================================
   2. HAMBURGER MENU
   ============================================= */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  if (isOpen) {
    mobileMenu.classList.add('visible');
    document.body.style.overflow = 'hidden';
  } else {
    closeMobileMenu();
  }
});

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('visible');
  document.body.style.overflow = '';
}

mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

/* =============================================
   3. SMOOTH SCROLL (nav CTA + hero buttons → #contact)
   ============================================= */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = navbar.offsetHeight + 8;
  const top    = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

document.getElementById('navCtaBtn')
  .addEventListener('click', () => scrollToSection('contact'));
document.getElementById('heroBtn')
  .addEventListener('click', () => scrollToSection('contact'));
document.getElementById('availBtn')
  .addEventListener('click', () => scrollToSection('contact'));

/* =============================================
   4. STAT COUNTER ANIMATION
   ============================================= */
function animateCounter(el, target, isDecimal) {
  const duration   = 1800;
  const start      = performance.now();
  const startValue = 0;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const value    = startValue + (target - startValue) * eased;

    if (isDecimal) {
      el.textContent = value.toFixed(1);
    } else if (target >= 1000) {
      el.textContent = Math.round(value).toLocaleString('pt-BR') + '+';
    } else {
      el.textContent = Math.round(value) + (progress < 1 ? '' : '+');
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      // Final value
      if (isDecimal)       el.textContent = target.toFixed(1);
      else if (target >= 1000) el.textContent = target.toLocaleString('pt-BR') + '+';
      else                 el.textContent = target + '+';
    }
  }

  requestAnimationFrame(update);
}

let statsAnimated = false;

function maybeAnimateStats() {
  if (statsAnimated) return;
  const statsSection = document.querySelector('.hero-stats');
  if (!statsSection) return;
  const rect = statsSection.getBoundingClientRect();
  if (rect.top < window.innerHeight - 80) {
    statsAnimated = true;
    document.querySelectorAll('.stat-num[data-count]').forEach(el => {
      const target    = parseFloat(el.dataset.count);
      const isDecimal = el.dataset.decimal === 'true';
      animateCounter(el, target, isDecimal);
    });
  }
}

window.addEventListener('scroll', maybeAnimateStats, { passive: true });
// Trigger on load too (hero visible without scroll)
window.addEventListener('load', maybeAnimateStats);

/* =============================================
   5. SCROLL REVEAL ANIMATIONS
   ============================================= */
const animatedEls = document.querySelectorAll('[data-animate]');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const delay = parseInt(el.dataset.delay || '0', 10);
    setTimeout(() => el.classList.add('animated'), delay);
    revealObserver.unobserve(el);
  });
}, { threshold: 0.12 });

animatedEls.forEach(el => revealObserver.observe(el));

/* =============================================
   6. DYNAMIC "NEXT AVAILABLE" TIME
   ============================================= */
function getNextSlot() {
  const now    = new Date();
  const hour   = now.getHours();
  const slots  = [8, 9, 10, 11, 13, 14, 15, 16, 17, 18];
  const days   = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const dayIdx = now.getDay();

  // Find next slot today
  for (const slot of slots) {
    if (slot > hour + 1) {
      return `Hoje, ${slot}h00`;
    }
  }

  // Next available weekday (Mon–Fri)
  for (let d = 1; d <= 7; d++) {
    const nextDay = (dayIdx + d) % 7;
    if (nextDay >= 1 && nextDay <= 5) {
      return `${days[nextDay]}, 8h00`;
    }
  }
  return 'Segunda, 8h00';
}

const nextTimeEl = document.getElementById('nextTime');
if (nextTimeEl) nextTimeEl.textContent = getNextSlot();

/* =============================================
   7. DATE INPUT: set min to today
   ============================================= */
const dateInput = document.getElementById('data');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

/* =============================================
   8. PHONE MASK
   ============================================= */
const phoneInput = document.getElementById('telefone');
if (phoneInput) {
  phoneInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (val.length > 10) {
      val = val.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (val.length > 6) {
      val = val.replace(/^(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
    } else if (val.length > 2) {
      val = val.replace(/^(\d{2})(\d+)/, '($1) $2');
    }
    e.target.value = val;
  });
}

/* =============================================
   9. FORM VALIDATION & SUBMISSION
   ============================================= */
const form      = document.getElementById('appointmentForm');
const submitBtn = document.getElementById('submitBtn');
const successEl = document.getElementById('formSuccess');

function validateField(id, errorId, message, extraCheck) {
  const el    = document.getElementById(id);
  const errEl = document.getElementById(errorId);
  if (!el || !errEl) return true;

  const value = el.value.trim();
  let valid   = value.length > 0;

  if (valid && extraCheck) valid = extraCheck(value);

  if (!valid) {
    el.classList.add('error');
    errEl.textContent = message;
  } else {
    el.classList.remove('error');
    errEl.textContent = '';
  }
  return valid;
}

function isValidPhone(val) {
  return val.replace(/\D/g, '').length >= 10;
}

if (form) {
  // Live validation on blur
  document.getElementById('nome').addEventListener('blur', () => {
    validateField('nome', 'nomeError', 'Por favor, informe seu nome.');
  });
  document.getElementById('telefone').addEventListener('blur', () => {
    validateField('telefone', 'telefoneError', 'Informe um telefone válido.', isValidPhone);
  });
  document.getElementById('data').addEventListener('blur', () => {
    validateField('data', 'dataError', 'Selecione uma data para a consulta.');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const v1 = validateField('nome',     'nomeError',     'Por favor, informe seu nome.');
    const v2 = validateField('telefone', 'telefoneError', 'Informe um telefone válido.', isValidPhone);
    const v3 = validateField('data',     'dataError',     'Selecione uma data para a consulta.');

    if (!v1 || !v2 || !v3) return;

    // Simulate async submission
    submitBtn.textContent = 'Enviando…';
    submitBtn.disabled    = true;

    setTimeout(() => {
      submitBtn.textContent = 'Enviar Solicitação';
      submitBtn.disabled    = false;
      form.reset();
      successEl.classList.add('show');
      scrollToSection('contact');

      setTimeout(() => successEl.classList.remove('show'), 6000);
    }, 1400);
  });
}

/* =============================================
   10. SERVICE CARDS: ripple click effect
   ============================================= */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', function (e) {
    const ripple  = document.createElement('span');
    const rect    = this.getBoundingClientRect();
    const size    = Math.max(rect.width, rect.height);
    const x       = e.clientX - rect.left - size / 2;
    const y       = e.clientY - rect.top  - size / 2;

    Object.assign(ripple.style, {
      position:   'absolute',
      width:      size + 'px',
      height:     size + 'px',
      left:       x + 'px',
      top:        y + 'px',
      borderRadius: '50%',
      background: 'rgba(26,140,110,0.08)',
      transform:  'scale(0)',
      animation:  'ripple 0.5s ease-out forwards',
      pointerEvents: 'none',
    });

    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Inject ripple keyframes once
const style = document.createElement('style');
style.textContent = '@keyframes ripple { to { transform: scale(2.5); opacity: 0; } }';
document.head.appendChild(style);

/* =============================================
   11. ACTIVE NAV LINK (scroll spy)
   ============================================= */
const sections  = document.querySelectorAll('section[id], .about[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--mint)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => spyObserver.observe(s));
