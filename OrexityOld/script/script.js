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

  navBar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });
}


/* ══════════════════════════════════════════════════
   PROJECT CARDS — reveal on scroll
   ══════════════════════════════════════════════════ */
(() => {
  const cards = document.querySelectorAll('.project-card');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    cards.forEach(card => observer.observe(card));
  } else {
    cards.forEach(card => card.classList.add('is-visible'));
  }
})();



document.addEventListener("DOMContentLoaded", () => {
  const accordionButtons = document.querySelectorAll(".accordion-btn");

  accordionButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Ensure this only runs on mobile screens
      if (window.innerWidth <= 768) {
        const isExpanded = btn.getAttribute("aria-expanded") === "true";
        
        // Toggle the current button
        btn.setAttribute("aria-expanded", !isExpanded);
      }
    });
  });
});


document.addEventListener('DOMContentLoaded', () => {
    const burgerToggle = document.querySelector('.burger-toggle');
    const navMenu = document.querySelector('.nav'); // Targets your <nav class="nav">
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav a');

    if (burgerToggle && navMenu && navOverlay) {
        // 1. Toggle menu on burger click
        burgerToggle.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-open');
            navOverlay.classList.toggle('active');
            burgerToggle.classList.toggle('active');
            
            // Accessibility: update aria-expanded
            const isExpanded = burgerToggle.getAttribute('aria-expanded') === 'true';
            burgerToggle.setAttribute('aria-expanded', !isExpanded);
        });

        // 2. Close menu when clicking the dark overlay background
        navOverlay.addEventListener('click', () => {
            navMenu.classList.remove('mobile-open');
            navOverlay.classList.remove('active');
            burgerToggle.classList.remove('active');
            burgerToggle.setAttribute('aria-expanded', 'false');
        });

        // 3. Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('mobile-open');
                navOverlay.classList.remove('active');
                burgerToggle.classList.remove('active');
                burgerToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
});