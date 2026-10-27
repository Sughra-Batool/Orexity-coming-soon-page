/* ══════════════════════════════════════════════════════════════
   OREXITY — MAIN SCRIPT
   All JS (including JSON-LD injection) now lives here.
   ══════════════════════════════════════════════════════════════ */


/* ──────────────────────────────────────────────────────────────
   1. PAGE LOAD — Reset scroll position
   ────────────────────────────────────────────────────────────── */
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname);
}
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});


/* ──────────────────────────────────────────────────────────────
   2. JSON-LD STRUCTURED DATA (SEO)
      Injected dynamically so markup stays clean.
   ────────────────────────────────────────────────────────────── */
(function injectStructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": "https://www.orexity.com/#webpage",
                "url": "https://www.orexity.com/",
                "name": "OREXITY | Mineral Investment & Advisory – Pakistan Gateway",
                "description": "OREXITY delivers structured mineral investment advisory, due diligence, technical intelligence and project assessment for international investors and mining companies evaluating opportunities in Pakistan.",
                "isPartOf": { "@id": "https://www.orexity.com/#website" },
                "about": { "@id": "https://www.orexity.com/#organization" },
                "inLanguage": "en-US"
            },
            {
                "@type": "WebSite",
                "@id": "https://www.orexity.com/#website",
                "url": "https://www.orexity.com/",
                "name": "OREXITY",
                "publisher": { "@id": "https://www.orexity.com/#organization" }
            },
            {
                "@type": "Organization",
                "@id": "https://www.orexity.com/#organization",
                "name": "OREXITY",
                "url": "https://www.orexity.com/",
                "description": "Mineral investment advisory and project assessment services for investors, mineral-rights holders and strategic partners evaluating opportunities in Pakistan.",
                "areaServed": { "@type": "Country", "name": "Pakistan" },
                "knowsAbout": [
                    "Mineral Investment",
                    "Due Diligence",
                    "Geological Interpretation",
                    "Exploration",
                    "Mining",
                    "Investment Gateway",
                    "Market Entry"
                ]
            },
            {
                "@type": "FAQPage",
                "@id": "https://www.orexity.com/#faq",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What does OREXITY do?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "OREXITY delivers structured mineral investment advisory and project assessment services to investors, mineral-rights holders and strategic partners evaluating opportunities in Pakistan. This includes due diligence, investment structuring, financial analysis, investor readiness and technical intelligence."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Where are OREXITY's projects located?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "OREXITY's project portfolio focuses on mineral opportunities associated with Gilgit-Baltistan, Pakistan. Current listed projects include Markhor 1, Markhor 2, Rakaposhi 1, and Ketu 1."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Does OREXITY guarantee investment returns?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "No. OREXITY does not guarantee mineral discovery, resource classification, regulatory approvals, investment returns or transaction completion. All investment decisions remain the responsibility of the parties involved."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What technical frameworks does OREXITY follow?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "OREXITY's technical assessments are aligned with VALMIN, JORC and NI 43-101 frameworks, covering geological exploration, geochemical and geophysical surveys, drilling, modelling, data management, environmental baseline and technical reporting."
                        }
                    }
                ]
            },
            {
                "@type": "BreadcrumbList",
                "@id": "https://www.orexity.com/#breadcrumb",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://www.orexity.com/"
                    }
                ]
            }
        ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
})();


/* ──────────────────────────────────────────────────────────────
   3. SMOOTH SCROLL & ACTIVE NAV HIGHLIGHTING
   ────────────────────────────────────────────────────────────── */
(function initNavigation() {
    const navLinks = document.querySelectorAll('.nav a');

    // Highlight active nav link on click
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Smooth scroll with sticky-header offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });
})();


/* ──────────────────────────────────────────────────────────────
   4. HEADER — Add .scrolled class when the page is scrolled
   ────────────────────────────────────────────────────────────── */
(function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
})();


/* ──────────────────────────────────────────────────────────────
   5. NESTED ACCORDIONS — Auto-open inner <details>
   ────────────────────────────────────────────────────────────── */
document.querySelectorAll('.collapse-item').forEach(parent => {
    parent.addEventListener('toggle', () => {
        if (parent.open) {
            parent.querySelectorAll(':scope > .collapse-content > details')
                .forEach(d => { d.open = true; });
        }
    });
});


/* ──────────────────────────────────────────────────────────────
   6. MOBILE NAV (guarded — only runs if elements exist)
   ────────────────────────────────────────────────────────────── */
(function initMobileNav() {
    const burger  = document.querySelector('.burger-toggle');
    const navBar  = document.querySelector('.nav-bar');
    const overlay = document.querySelector('.nav-overlay');
    if (!burger || !navBar || !overlay) return;

    const setMenu = (open) => {
        navBar.classList.toggle('mobile-open', open);
        burger.classList.toggle('active', open);
        overlay.classList.toggle('active', open);
        burger.setAttribute('aria-expanded', String(open));
    };

    burger.addEventListener('click', () => {
        setMenu(!navBar.classList.contains('mobile-open'));
    });
    overlay.addEventListener('click', () => setMenu(false));
    navBar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setMenu(false));
    });
})();


/* ──────────────────────────────────────────────────────────────
   7. PROJECT CARDS — Reveal on scroll
   ────────────────────────────────────────────────────────────── */
(function initProjectReveal() {
    const cards = document.querySelectorAll('.project-card');
    if (!cards.length) return;

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


/* ──────────────────────────────────────────────────────────────
   8. FOOTER ACCORDION (mobile only — CSS responds to aria-expanded)
   ────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.accordion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                const isExpanded = btn.getAttribute('aria-expanded') === 'true';
                btn.setAttribute('aria-expanded', String(!isExpanded));
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