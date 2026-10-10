/* ══════════════════════════════════════════════════
   OREXITY — MAIN SCRIPT
   ══════════════════════════════════════════════════ */

// Force reload to start at the top of the page
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

if (window.location.hash) {
  history.replaceState(null, '', window.location.pathname);
}

window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});

/* ── 1. Accordion: when a top-level .collapse-item opens,
        open all nested <details> inside its .collapse-content ── */
document.querySelectorAll('.collapse-item').forEach(parent => {
  parent.addEventListener('toggle', () => {
    if (parent.open) {
      parent
        .querySelectorAll(':scope > .collapse-content > details')
        .forEach(d => { d.open = true; });
    }
  });
});


/* ── 2. Header: add .scrolled class when the page is scrolled ── */
const header = document.querySelector('header');

if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}


/* ── 3. Mobile nav: burger toggle, overlay close, link close ── */
const burger  = document.querySelector('.burger-toggle');
const navBar  = document.querySelector('.nav-bar');
const overlay = document.querySelector('.nav-overlay');

if (burger && navBar && overlay) {
  const setMenu = (open) => {
    navBar.classList.toggle('mobile-open', open);
    burger.classList.toggle('active', open);
    overlay.classList.toggle('active', open);
    burger.setAttribute('aria-expanded', String(open));
  };

  burger.addEventListener('click', () => {
    const isOpen = !navBar.classList.contains('mobile-open');
    setMenu(isOpen);
  });

  overlay.addEventListener('click', () => setMenu(false));

  // Close the menu when any nav link is clicked
  navBar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });
}