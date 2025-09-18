/* ENTIM LABS — Interactions & Animations (vanilla JS only) */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===== Sticky Nav (mobile) =====
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    // close on link click (mobile UX)
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ===== Current year =====
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ===== Smooth anchor scroll =====
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', `#${id}`);
      }
    });
  });

  // ===== Scroll progress =====
  const progress = document.getElementById('progress');
  const setProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const p = height > 0 ? scrollTop / height : 0;
    progress.style.transform = `scaleX(${p})`;
  };
  setProgress();
  window.addEventListener('scroll', setProgress, { passive: true });
  window.addEventListener('resize', setProgress);

  // ===== Scroll reveal =====
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ===== 3D Tilt on cards =====
  const tiltEls = document.querySelectorAll('.tilt');
  tiltEls.forEach(card => {
    let rafId = null;
    const damp = 0.12;

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotateY = dx * 10;
      const rotateX = -dy * 10;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(0)`;
      });
    };

    const onLeave = () => {
      card.style.transition = 'transform 0.25s ease';
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
      setTimeout(() => (card.style.transition = 'transform .15s ease'), 250);
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    card.addEventListener('touchmove', (e) => {
      const t = e.touches[0];
      onMove(t);
    }, { passive: true });
    card.addEventListener('touchend', onLeave);
  });

  // ===== Magnetic buttons (subtle) =====
  document.querySelectorAll('.magnetic').forEach(btn => {
    const strength = 18;
    let raf;
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        btn.style.transform = `translate(${(x / r.width) * strength}px, ${(y / r.height) * strength}px)`;
      });
    });
    ['mouseleave', 'blur'].forEach(ev =>
      btn.addEventListener(ev, () => { btn.style.transform = 'translate(0,0)'; })
    );
  });

  // ===== Contact form (demo validation) =====
  const form = document.querySelector('.contact-form');
  const statusEl = document.querySelector('.form-status');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get('name')?.toString().trim();
      const email = data.get('email')?.toString().trim();

      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        statusEl.textContent = 'Please provide a valid name and email.';
        statusEl.style.color = '#ffb4b4';
        return;
      }
      statusEl.textContent = 'Thanks! We’ll get back to you within one business day.';
      statusEl.style.color = '#9fb3c8';
      form.reset();
    });
  }

  // ===== Particle background (Canvas) =====
  if (!prefersReducedMotion) initParticles();
});

/* ------------ Particles ------------ */
function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let w, h, particles, raf;
  const MAX = 90; // particle count cap
  const LINK_DIST = 140; // px

  function resize() {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(MAX, Math.floor((w * h) / 15000));
    particles = Array.from({ length: count }, () => new Particle());
  }

  class Particle {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      const speed = 0.15 + Math.random() * 0.35;
      const angle = Math.random() * Math.PI * 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.r = 1 + Math.random() * 1.4;
      this.hue = 185 + Math.random() * 100; // cyan → violet
      this.alpha = 0.6 + Math.random() * 0.4;
    }
    step() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < -50) this.x = w + 50;
      if (this.x > w + 50) this.x = -50;
      if (this.y < -50) this.y = h + 50;
      if (this.y > h + 50) this.y = -50;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 90%, 60%, ${this.alpha})`;
      ctx.fill();
    }
  }

  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINK_DIST) {
          const t = 1 - dist / LINK_DIST;
          ctx.strokeStyle = `rgba(120, 200, 255, ${t * 0.18})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  }

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.step(); p.draw(); });
    connect();
    raf = requestAnimationFrame(frame);
  }

  // Handle resize & DPR changes
  resize();
  cancelAnimationFrame(raf);
  frame();
  let resizeId;
  window.addEventListener('resize', () => {
    clearTimeout(resizeId);
    resizeId = setTimeout(resize, 120);
  });

  // Optional: mouse repulsion for subtle interactivity
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    particles.forEach(p => {
      const dx = p.x - mx, dy = p.y - my;
      const dist = Math.hypot(dx, dy);
      if (dist < 100) {
        const force = (100 - dist) / 2000;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
    });
  }, { passive: true });
}
