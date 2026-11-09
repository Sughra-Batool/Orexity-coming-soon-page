/* ══════════════════════════════════════════════════════════════
   OREXITY — MAIN SCRIPT
   Navigation, header scroll state, mobile drawer, project reveal,
   page-load scroll restoration.
   ══════════════════════════════════════════════════════════════ */
   // Restore path from GitHub Pages 404 redirect
var redirectPath = sessionStorage.getItem('redirectPath');
if (redirectPath) {
  window.history.replaceState(null, '', redirectPath);
  sessionStorage.removeItem('redirectPath');
}

/* ──────────────────────────────────────────────────────────────
   1. PAGE LOAD — Reset scroll position
   ────────────────────────────────────────────────────────────── */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
if (window.location.hash) {
  history.replaceState(null, '', window.location.pathname);
}
window.addEventListener('load', function () {
  window.scrollTo(0, 0);
});

/* ──────────────────────────────────────────────────────────────
   2. SMOOTH SCROLL + ACTIVE NAV HIGHLIGHT
   ────────────────────────────────────────────────────────────── */
/* ──────────────────────────────────────────────────────────────
   2. SMOOTH SCROLL + ACTIVE NAV HIGHLIGHT + URL UPDATING
   ────────────────────────────────────────────────────────────── */
(function initNavigation() {
  var navLinks = document.querySelectorAll('.nav a');

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.forEach(function (l) { l.classList.remove('active'); });
      this.classList.add('active');
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      var cleanPath = this.getAttribute('data-path');

      var investorSection = document.getElementById('investor-form-section');
      var mainContent = document.getElementById('main-content');
      if (investorSection && !investorSection.classList.contains('hidden')) {
        investorSection.classList.add('hidden');
        if (mainContent) mainContent.classList.remove('hidden');
        document.body.style.overflow = '';
      }
      
      // 1. Handle the Logo click (Go to top)
      if (cleanPath === '/home' || targetId === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (cleanPath) {
          window.history.pushState({ path: cleanPath }, '', cleanPath);
        }
        return;
      }

      // 2. Handle standard section anchors
      if (targetId !== '#') {
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var headerOffset = 70;
          var elementPosition = target.getBoundingClientRect().top;
          var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          
          // Update the URL
          if (cleanPath) {
            window.history.pushState({ path: cleanPath }, '', cleanPath);
          }
        }
      }
    });
  });
})();
/* ──────────────────────────────────────────────────────────────
   3. HEADER SCROLL STATE
   ────────────────────────────────────────────────────────────── */
(function initHeaderScroll() {
  var header = document.querySelector('header');
  if (!header) return;
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
})();

/* ──────────────────────────────────────────────────────────────
   4. MOBILE NAV DRAWER
   ────────────────────────────────────────────────────────────── */
(function initMobileNav() {
  var burger  = document.querySelector('.burger-toggle');
  var navBar  = document.querySelector('.nav');
  var overlay = document.querySelector('.nav-overlay');
  if (!burger || !navBar || !overlay) return;

  function setMenu(open) {
    navBar.classList.toggle('mobile-open', open);
    burger.classList.toggle('active', open);
    overlay.classList.toggle('active', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
  }

  burger.addEventListener('click', function (e) {
    e.stopPropagation();
    setMenu(!navBar.classList.contains('mobile-open'));
  });

  overlay.addEventListener('click', function () { setMenu(false); });

  navBar.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });
})();

/* ──────────────────────────────────────────────────────────────
   5. PROJECT CARD REVEAL ON SCROLL
   ────────────────────────────────────────────────────────────── */
(function initProjectReveal() {
  var cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    cards.forEach(function (card) { observer.observe(card); });
  } else {
    cards.forEach(function (card) { card.classList.add('is-visible'); });
  }
})();

/* ──────────────────────────────────────────────────────────────
   6. NESTED ACCORDIONS (if any collapse-item present)
   ────────────────────────────────────────────────────────────── */
document.querySelectorAll('.collapse-item').forEach(function (parent) {
  parent.addEventListener('toggle', function () {
    if (parent.open) {
      parent.querySelectorAll(':scope > .collapse-content > details')
        .forEach(function (d) { d.open = true; });
    }
  });
});