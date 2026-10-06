document.querySelectorAll('.collapse-item').forEach(parent => {
  parent.addEventListener('toggle', () => {
    if (parent.open) {
      parent.querySelectorAll(':scope > .collapse-content > details')
        .forEach(d => d.open = true);
    }
  });
});

const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});

const burger = document.querySelector('.burger-toggle');
const navBar = document.querySelector('.nav-bar');
const overlay = document.querySelector('.nav-overlay');

burger.addEventListener('click', () => {
  const isOpen = navBar.classList.toggle('mobile-open');
  burger.classList.toggle('active', isOpen);
  overlay.classList.toggle('active', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
});

overlay.addEventListener('click', () => {
  navBar.classList.remove('mobile-open');
  burger.classList.remove('active');
  overlay.classList.remove('active');
  burger.setAttribute('aria-expanded', 'false');
});

  // Close menu when a link is clicked
  navBar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navBar.classList.remove('mobile-open');
      burger.classList.remove('active');
      overlay.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

/*document.querySelectorAll('.collapse-item').forEach(function (parent) {
  parent.addEventListener('toggle', function () {
    // When the parent OPENS, close all nested tabs so only their summaries show
    if (parent.open) {
      parent.querySelectorAll('.collapse-content details').forEach(function (d) {
        d.open = false;
      });
    }
  });
});

// Inside each collapse-content: clicking any nested summary opens ALL of them
document.querySelectorAll('.collapse-content').forEach(function (content) {
  var nested = content.querySelectorAll(':scope > details');

  nested.forEach(function (d) {
    d.addEventListener('toggle', function () {
      // Only act when a nested tab is being OPENED by the user
      if (!d.open) return;

      // Open every sibling nested tab in the same content
      nested.forEach(function (other) {
        if (other !== d) other.open = true;
      });
    });
  });
})
*/
