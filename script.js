document.addEventListener('DOMContentLoaded', () => {
  const intro = document.querySelector('.intro-loader');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  const year = document.getElementById('year');

  if (intro) {
    intro.addEventListener('animationend', event => {
      if (event.animationName === 'intro-curtain') intro.hidden = true;
    });
  }

  const revealElements = document.querySelectorAll(
    '.hero-copy > *, .hero-art, .trust-inner span, .section-heading, .service-item, ' +
    '.work-copy > *, .project-card, .approach-header > *, .process-list li, ' +
    '.about-inner > *, .contact-copy > *, .contact-form > *'
  );
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReducedMotion && revealElements.length) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });

    revealElements.forEach((element, index) => {
      element.classList.add('reveal-on-scroll');
      element.style.setProperty('--reveal-delay', `${index % 4 * 55}ms`);
      revealObserver.observe(element);
    });
    document.body.classList.add('motion-ready');
  }

  if (year) year.textContent = new Date().getFullYear();

  if (!toggle || !menu) return;

  const closeMenu = () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  };

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
});
