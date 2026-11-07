/* ══════════════════════════════════════════════════════════════
   OREXITY — INLINE FORM CONTROLLER (Cloudflare Worker version)
   ══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {

  /* ─────────────────────────────────────────────────────────
     ⚠️  PASTE YOUR CLOUDFLARE WORKER URL HERE
     ───────────────────────────────────────────────────────── */
  var WORKER_URL = 'https://orexity-worker.tariqaavan.workers.dev';

  /* ─────────────────────────────────────────────────────────
     1. SUCCESS MESSAGE TEMPLATE
     ───────────────────────────────────────────────────────── */
  var medalSVG =
    '<svg class="success-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M35 60 L20 95 L35 88 L45 100 L50 65 Z" fill="currentColor"/>' +
      '<path d="M65 60 L80 95 L65 88 L55 100 L50 65 Z" fill="currentColor"/>' +
      '<path d="M50 5 L58 15 L70 10 L75 22 L88 25 L85 38 L95 50 L85 62 L88 75 L75 78 L70 90 L58 85 L50 95 L42 85 L30 90 L25 78 L12 75 L15 62 L5 50 L15 38 L12 25 L25 22 L30 10 L42 15 Z" fill="currentColor"/>' +
      '<circle cx="50" cy="50" r="25" fill="#ffffff" />' +
      '<path d="M38 50 L46 58 L62 40" fill="none" stroke="#ffd000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';

  var SUCCESS_HTML =
    medalSVG +
    '<h2 class="success-title">Thank you for your submission to OREXITY.</h2>' +
    '<p class="success-text">Your information has been received and our team will respond with informed insights, professional guidance, and relevant expertise tailored to your requirements.</p>' +
    '<div class="success-border"></div>';

  /* ─────────────────────────────────────────────────────────
     2. ELEMENT REFERENCES
     ───────────────────────────────────────────────────────── */
  var mainContent     = document.getElementById('main-content');
  var investorSection = document.getElementById('investor-form-section');
  var contactModal    = document.getElementById('contact-modal');

  /* ─────────────────────────────────────────────────────────
     3. INVESTOR FORM OPEN / CLOSE
     ───────────────────────────────────────────────────────── */
  function resetInvestorState() {
    var formWrapper = investorSection && investorSection.querySelector('.form-wrapper');
    var lessInfoBox = investorSection && investorSection.querySelector('.less-info-box');
    var successEl   = document.getElementById('investorSuccessMessage');
    if (formWrapper) formWrapper.classList.remove('hidden');
    if (lessInfoBox) lessInfoBox.classList.remove('hidden');
    if (successEl)   { successEl.classList.add('hidden'); successEl.innerHTML = ''; }
  }

  function openInvestorForm() {
    resetInvestorState();
    if (mainContent)     mainContent.classList.add('hidden');
    if (investorSection) investorSection.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function closeInvestorForm() {
    if (investorSection) investorSection.classList.add('hidden');
    if (mainContent)     mainContent.classList.remove('hidden');
    // Restore URL to home
    window.history.pushState({ path: '/home' }, '', '/home');
  }

  function showInvestorSuccess() {
    var formWrapper = investorSection && investorSection.querySelector('.form-wrapper');
    var lessInfoBox = investorSection && investorSection.querySelector('.less-info-box');
    var successEl   = document.getElementById('investorSuccessMessage');
    if (formWrapper) formWrapper.classList.add('hidden');
    if (lessInfoBox) lessInfoBox.classList.add('hidden');
    if (successEl) {
      successEl.innerHTML = SUCCESS_HTML;
      successEl.classList.remove('hidden');
      successEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* ─────────────────────────────────────────────────────────
     4. CONTACT MODAL OPEN / CLOSE
     ───────────────────────────────────────────────────────── */
  function resetContactState() {
    var modalEl   = contactModal && contactModal.querySelector('.modal');
    var successEl = document.getElementById('contactSuccessMessage');
    if (modalEl) modalEl.classList.remove('hidden');
    if (successEl) { successEl.classList.add('hidden'); successEl.innerHTML = ''; }
    document.body.classList.remove('contact-success-mode');
  }

  function openContactModal() {
    resetContactState();
    if (contactModal) {
      contactModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeContactModal() {
    if (contactModal) {
      contactModal.classList.add('hidden');
      document.body.style.overflow = '';
      document.body.classList.remove('contact-success-mode');
      // Restore URL to home
      window.history.pushState({ path: '/home' }, '', '/home');
    }
  }

  function showContactSuccess() {
    var modalEl   = contactModal && contactModal.querySelector('.modal');
    var successEl = document.getElementById('contactSuccessMessage');
    if (modalEl) modalEl.classList.add('hidden');
    if (successEl) {
      successEl.innerHTML = SUCCESS_HTML;
      successEl.classList.remove('hidden');
      document.body.classList.add('contact-success-mode');
    }
  }

  /* ─────────────────────────────────────────────────────────
     5. GLOBAL EVENT LISTENERS
     ───────────────────────────────────────────────────────── */
    document.querySelectorAll('[data-open-form="investor"]').forEach(function (el) {
    el.addEventListener('click', function (e) { 
      e.preventDefault(); 
      
      // Update URL if data-path exists
      var cleanPath = el.getAttribute('data-path');
      if (cleanPath) {
        window.history.pushState({ path: cleanPath }, '', cleanPath);
      }
      
      openInvestorForm(); 
    });
  });

  document.querySelectorAll('[data-open-form="contact"]').forEach(function (el) {
    el.addEventListener('click', function (e) { 
      e.preventDefault(); 
      
      // Update URL if data-path exists
      var cleanPath = el.getAttribute('data-path');
      if (cleanPath) {
        window.history.pushState({ path: cleanPath }, '', cleanPath);
      }
      
      openContactModal(); 
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(function (el) {
    el.addEventListener('click', closeContactModal);
  });

  if (contactModal) {
    contactModal.addEventListener('click', function (e) {
      if (e.target === contactModal) closeContactModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && contactModal && !contactModal.classList.contains('hidden')) {
      closeContactModal();
    }
  });

  document.querySelectorAll('.site-header .nav a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (contactModal && !contactModal.classList.contains('hidden')) closeContactModal();
      if (investorSection && !investorSection.classList.contains('hidden')) {
        e.preventDefault();
        closeInvestorForm();
        var href = this.getAttribute('href');
        var target = href && href !== '#' ? document.querySelector(href) : null;
        if (target) requestAnimationFrame(function () {
          target.scrollIntoView({ behavior: 'smooth' });
        });
      }
    });
  });

  var brandLink = document.querySelector('.site-header .brand');
  if (brandLink) {
    brandLink.addEventListener('click', function (e) {
      if (contactModal && !contactModal.classList.contains('hidden')) {
        e.preventDefault();
        closeContactModal();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (investorSection && !investorSection.classList.contains('hidden')) {
        e.preventDefault();
        closeInvestorForm();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  /* ─────────────────────────────────────────────────────────
     6. INVESTOR FORM SUBMISSION
     ───────────────────────────────────────────────────────── */
  var investorForm      = document.getElementById('investor');
  var investorStatus    = document.getElementById('investorMessage');
  var investorSubmitBtn = investorForm ? investorForm.querySelector('button[type="submit"]') : null;

  var fileInput       = document.getElementById('investorDocumentUpload');
  var fileNameDisplay = document.getElementById('investorFileNameDisplay');
  var uploadError     = document.getElementById('investorUploadError');
  var maxSize         = 15 * 1024 * 1024;

  if (fileInput) {
    fileInput.addEventListener('change', function () {
      uploadError.textContent = '';
      var files = this.files;

      if (files.length > 0) {
        var hasError = false;
        for (var i = 0; i < files.length; i++) {
          if (files[i].size > maxSize) { hasError = true; break; }
        }
        if (hasError) {
          uploadError.textContent = 'Error: One or more files exceed the 15 MB limit. Please compress or select smaller files.';
          this.value = '';
          fileNameDisplay.textContent = 'No files chosen';
          return;
        }
        fileNameDisplay.textContent = files.length === 1 ? files[0].name : files.length + ' files uploaded';
      } else {
        fileNameDisplay.textContent = 'No files chosen';
      }
    });
  }

  if (investorForm) {
    var groupsToHighlight = [
      'fundingSource', 'commodityFocus', 'experienceStage',
      'role', 'targetStage', 'proposedStructure', 'supportingDocuments'
    ];
    groupsToHighlight.forEach(function (groupName) {
      var firstInput = investorForm.querySelector('input[name="' + groupName + '"]');
      if (firstInput) {
        var groupContainer = firstInput.closest('.options-group');
        if (groupContainer) groupContainer.classList.add('required-group');
      }
    });

    investorForm.addEventListener('input', function (e) {
      var target = e.target;
      if (target.validity.valid) {
        if (target.type === 'checkbox') {
          var label = target.closest('.checkbox-label') || target.closest('.declaration-confirm');
          if (label) label.classList.remove('gold-highlight');
        } else if (target.type === 'file') {
          var uploadBox = target.closest('.upload-box');
          if (uploadBox) uploadBox.classList.remove('gold-highlight');
        } else {
          target.classList.remove('gold-highlight');
        }
      }
    });

    investorForm.addEventListener('change', function (e) {
      if (e.target.validity.valid && (e.target.type === 'checkbox' || e.target.type === 'file')) {
        var label = e.target.closest('.checkbox-label') || e.target.closest('.declaration-confirm');
        var uploadBox = e.target.closest('.upload-box');
        if (label) label.classList.remove('gold-highlight');
        if (uploadBox) uploadBox.classList.remove('gold-highlight');
      }
    });

    investorForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot
      var honeypot = document.getElementById('investorWebsiteUrl');
      if (honeypot && honeypot.value !== '') {
        investorForm.reset();
        if (fileNameDisplay) fileNameDisplay.textContent = 'No files chosen';
        showInvestorSuccess();
        return;
      }

      // Clear previous highlights
      investorForm.querySelectorAll('.gold-highlight').forEach(function (el) {
        el.classList.remove('gold-highlight');
      });

      // Required-group checkboxes
      var requiredGroups = ['role', 'targetStage', 'proposedStructure'];
      requiredGroups.forEach(function (groupName) {
        var checkboxes = investorForm.querySelectorAll('input[name="' + groupName + '"]');
        if (checkboxes.length > 0) {
          var isAnyChecked = Array.from(checkboxes).some(function (cb) { return cb.checked; });
          if (!isAnyChecked) checkboxes[0].setAttribute('required', 'required');
          else checkboxes.forEach(function (cb) { cb.removeAttribute('required'); });
        }
      });

      if (!investorForm.checkValidity()) {
        investorForm.reportValidity();
        investorForm.querySelectorAll('input[required], select[required], textarea[required]').forEach(function (input) {
          if (!input.validity.valid) {
            if (input.type === 'checkbox') {
              var label = input.closest('.checkbox-label') || input.closest('.declaration-confirm');
              if (label) label.classList.add('gold-highlight');
            } else if (input.type === 'file') {
              var uploadBox = input.closest('.upload-box');
              if (uploadBox) uploadBox.classList.add('gold-highlight');
            } else {
              input.classList.add('gold-highlight');
            }
          }
        });
        return;
      }

      // Send to Worker
      if (investorStatus) {
        investorStatus.textContent = 'Sending enquiry...';
        investorStatus.style.color = '#b4bdbd';
      }
      if (investorSubmitBtn) {
        investorSubmitBtn.disabled = true;
        investorSubmitBtn.textContent = 'Sending...';
      }

      var formData = new FormData(investorForm);
      formData.delete('website_url'); // don't leak honeypot to server

      fetch(WORKER_URL, {
        method: 'POST',
        body: formData
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok && result.data && result.data.success) {
            investorForm.reset();
            if (fileNameDisplay) fileNameDisplay.textContent = 'No files chosen';
            showInvestorSuccess();
          } else {
            if (investorStatus) {
              investorStatus.textContent = (result.data && result.data.message) || 'Submission failed. Please try again.';
              investorStatus.style.color = 'red';
            }
          }
        })
        .catch(function (error) {
          console.error('Submission error:', error);
          if (investorStatus) {
            investorStatus.textContent = 'Network error. Please check your connection and try again.';
            investorStatus.style.color = 'red';
          }
        })
        .finally(function () {
          if (investorSubmitBtn) {
            investorSubmitBtn.disabled = false;
            investorSubmitBtn.textContent = 'Submit Investment Enquiry ↗';
          }
        });
    });
  }

  /* ─────────────────────────────────────────────────────────
     7. CONTACT FORM SUBMISSION
     ───────────────────────────────────────────────────────── */
  var contact          = document.getElementById('contact-form');
  var contactStatus    = document.getElementById('contactMessage');
  var contactSubmitBtn = contact ? contact.querySelector('button[type="submit"]') : null;

  if (contact) {
    contact.addEventListener('submit', function (e) {
      e.preventDefault();

      var honeypot = document.getElementById('contactWebsiteUrl');
      if (honeypot && honeypot.value !== '') {
        contact.reset();
        showContactSuccess();
        return;
      }

      if (!contact.checkValidity()) {
        if (contactStatus) {
          contactStatus.textContent = 'Please fill out all required fields correctly.';
          contactStatus.style.color = 'red';
        }
        contact.reportValidity();
        return;
      }

      if (contactStatus) {
        contactStatus.textContent = 'Sending enquiry...';
        contactStatus.style.color = '#b4bdbd';
      }
      if (contactSubmitBtn) {
        contactSubmitBtn.disabled = true;
        contactSubmitBtn.textContent = 'Sending...';
      }

      var formData = new FormData(contact);
      formData.delete('website_url');

      fetch(WORKER_URL, {
        method: 'POST',
        body: formData
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok && result.data && result.data.success) {
            contact.reset();
            showContactSuccess();
          } else {
            if (contactStatus) {
              contactStatus.textContent = (result.data && result.data.message) || 'Submission failed. Please try again.';
              contactStatus.style.color = 'red';
            }
          }
        })
        .catch(function (error) {
          console.error('Contact submission error:', error);
          if (contactStatus) {
            contactStatus.textContent = 'Network error. Please check your connection and try again.';
            contactStatus.style.color = 'red';
          }
        })
        .finally(function () {
          if (contactSubmitBtn) {
            contactSubmitBtn.disabled = false;
            contactSubmitBtn.textContent = 'Send Enquiry ↗';
          }
        });
    });
  }
});