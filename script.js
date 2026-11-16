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
