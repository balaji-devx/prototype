/* ═══════════════════════════════════════════════
   MAIN.JS — Futuristic Portfolio Interactions
   ═══════════════════════════════════════════════ */

/* ─── CURSOR ─────────────────────────────────────── */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Smooth trail via requestAnimationFrame
function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

// Expand cursor on interactive elements
document.querySelectorAll('a, button, .skill-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('expanded'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('expanded'));
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  cursorTrail.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  cursorTrail.style.opacity = '1';
});

/* ─── NAVBAR SCROLL ──────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── HAMBURGER / MOBILE MENU ────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu on nav link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ─── PARTICLES ──────────────────────────────────── */
const particleContainer = document.getElementById('particles');
const PARTICLE_COUNT = 28;
const colors = ['#00e5ff', '#7c3aed', '#00ff88', '#ffffff'];

function spawnParticle() {
  const p = document.createElement('div');
  p.className = 'particle';

  const size     = Math.random() * 3 + 1;           // 1–4px
  const duration = Math.random() * 12 + 8;           // 8–20s
  const delay    = Math.random() * 10;               // 0–10s
  const startX   = Math.random() * 100;              // 0–100vw %
  const drift    = (Math.random() - 0.5) * 120;      // ±60px
  const color    = colors[Math.floor(Math.random() * colors.length)];

  p.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${startX}%;
    bottom: -10px;
    background: ${color};
    box-shadow: 0 0 ${size * 3}px ${color};
    --drift: ${drift}px;
    animation-duration: ${duration}s;
    animation-delay: -${delay}s;
  `;
  particleContainer.appendChild(p);
}

for (let i = 0; i < PARTICLE_COUNT; i++) spawnParticle();

/* ─── INTERSECTION OBSERVER — REVEAL ────────────────── */
// Skill cards: add .in-view to trigger cardReveal + progress bars
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      // Animate progress bar
      const bar = entry.target.querySelector('.progress-bar');
      if (bar) {
        const target = bar.getAttribute('data-width');
        // Small delay so the card reveal starts first
        setTimeout(() => { bar.style.width = target + '%'; }, 200);
      }
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));

// About section: reveal left/right
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

/* ─── COUNTER ANIMATION ──────────────────────────── */
function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-count'), 10);
  const duration = 1800;
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    el.textContent = Math.round(easeOut(progress) * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num[data-count]').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const aboutSection = document.getElementById('about');
if (aboutSection) counterObserver.observe(aboutSection);

/* ─── CARD TILT ──────────────────────────────────── */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect    = card.getBoundingClientRect();
    const cx      = rect.left + rect.width  / 2;
    const cy      = rect.top  + rect.height / 2;
    const dx      = (e.clientX - cx) / (rect.width  / 2);
    const dy      = (e.clientY - cy) / (rect.height / 2);
    const rotateX = -dy * 6;
    const rotateY =  dx * 6;

    // Glow follows mouse
    const mx = ((e.clientX - rect.left) / rect.width)  * 100;
    const my = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.setProperty('--mx', mx + '%');
    card.style.setProperty('--my', my + '%');
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
  });
});

/* ─── SMOOTH ANCHOR SCROLL ───────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});