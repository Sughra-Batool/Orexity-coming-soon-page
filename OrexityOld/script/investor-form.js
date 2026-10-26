/* ══════════════════════════════════════════════════
   INVESTOR ENQUIRY FORM SUBMISSION & SECURITY
   Standalone page: investor-enquiry.html
   ══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {
  const form      = document.getElementById('enquiryForm');
  const status    = document.getElementById('formMessage');
  const projectEl = document.getElementById('projectSelect');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  // Your Google Apps Script Web App endpoint
  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyeySGqiWke-9CBeI9MitbWdpzRN4HlabjpAWS_zEw45uRiJATQ42qv0E8NHK4ttXk_/exec';

  if (!form) return;

  // Preselect project from ?project=NAME in the URL
  const params = new URLSearchParams(window.location.search);
  const requestedProject = params.get('project');
  if (requestedProject && projectEl) {
    const match = Array.from(projectEl.options).find(
      opt => opt.value.toLowerCase() === requestedProject.toLowerCase()
    );
    if (match) projectEl.value = match.value;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // 1. HONEYPOT CHECK (anti-bot)
    const honeypotEl = document.getElementById('website_url');
    if (honeypotEl && honeypotEl.value !== '') {
      status.textContent = 'Thank you! Your enquiry has been received.';
      status.style.color = 'green';
      form.reset();
      return;
    }

    // 2. BROWSER VALIDATION CHECK
    if (!form.checkValidity()) {
      status.textContent = 'Please fill out all required fields correctly.';
      status.style.color = 'red';
      form.reportValidity();
      return;
    }

    // 3. SUBMIT
    status.textContent = 'Sending enquiry...';
    status.style.color = '#1f2833';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    const formData = new FormData(form);
    formData.delete('website_url'); // strip honeypot before sending
    const data = new URLSearchParams(formData);

    fetch(WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data
    })
    .then(() => {
      status.textContent = 'Thank you! Your enquiry has been received. We will contact you shortly.';
      status.style.color = 'green';
      form.reset();
    })
    .catch(error => {
      console.error('Error:', error);
      status.textContent = 'An error occurred. Please try again.';
      status.style.color = 'red';
    })
    .finally(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Enquiry ↗';
      }
    });
  });
});