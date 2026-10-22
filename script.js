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

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('project-search');
    const viewSelect = document.getElementById('project-view');
    const projectCards = document.querySelectorAll('.project-card');
    const projectCount = document.getElementById('project-count');
    const grid = document.getElementById('portfolio-grid');

    // Empty message logic
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'project-empty';
    emptyMsg.textContent = 'No projects match your search.';
    emptyMsg.style.display = 'none';
    grid.appendChild(emptyMsg);

    function filterProjects() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const viewFilter = viewSelect.value;
        let visibleCount = 0;

        projectCards.forEach(card => {
            // 1. Check Search by Name
            const projectName = card.querySelector('.first-heading').textContent.toLowerCase();
            const matchesSearch = projectName.includes(searchTerm);
            
            // 2. Check Status using the data attribute instead of text
            const statusEl = card.querySelector('.second-heading');
            const cardStatus = statusEl ? statusEl.getAttribute('data-status') : 'development';
            
            // If the dropdown is "all", it matches. If it's "development", it checks the data attribute.
            const matchesView = viewFilter === 'all' || cardStatus === viewFilter;

            if (matchesSearch && matchesView) {
                card.hidden = false;
                visibleCount++;
            } else {
                card.hidden = true;
            }
        });

        projectCount.textContent = visibleCount + (visibleCount === 1 ? ' project profile' : ' project profiles');
        emptyMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    if (searchInput && viewSelect) {
        searchInput.addEventListener('input', filterProjects);
        viewSelect.addEventListener('change', filterProjects);
    }
});