/* ══════════════════════════════════════════════════════════════
   OREXITY — FORM CONTROLLER (investor + contact)
   Fail‑closed pipeline:
     POST → Email Validation Worker (Turnstile + DNS + disposable)
         → only on {status:"allow"|"flag"} → POST → D1 Worker
   Any {status:"block"} or transport error → abort D1.
   ══════════════════════════════════════════════════════════════ */

/* ── 0. CONFIG (outside DOMContentLoaded so nothing shadows) ─── */
var EMAIL_VALIDATION_URL = 'https://orexity-email-validator.sughraehsan.workers.dev';
var D1_WORKER_URL        = 'https://orexity-worker.tariqaavan.workers.dev';

/* ── 1. TURNSTILE STATE & CALLBACKS — REGISTERED IMMEDIATELY ─── */
/*     Turnstile api.js runs async; if it fires a callback before
       DOMContentLoaded, these globals must already exist.        */
window.investorTurnstileToken = null;
window.contactTurnstileToken  = null;

window.onInvestorTurnstileSuccess = function (token) {
  window.investorTurnstileToken = token;
};
window.onContactTurnstileSuccess = function (token) {
  window.contactTurnstileToken = token;
};
window.onInvestorTurnstileError = function (code) {
  console.error('[Turnstile investor] error:', code);
  window.investorTurnstileToken = null;
};
window.onContactTurnstileError = function (code) {
  console.error('[Turnstile contact] error:', code);
  window.contactTurnstileToken = null;
};
window.onInvestorTurnstileExpired = function () {
  window.investorTurnstileToken = null;
};
window.onContactTurnstileExpired = function () {
  window.contactTurnstileToken = null;
};

/* ── 2. SMALL HELPERS ───────────────────────────────────────── */
function setStatus(el, msg, isError) {
  if (!el) return;
  el.textContent = msg || '';
  el.style.color = isError ? 'red' : '#b4bdbd';
}

/* Normalise the block reason to a human message. */
function blockMessage(valData) {
  if (!valData) return 'Email validation failed. Please try again.';
  switch (valData.reason) {
    case 'disposable_email':  return 'Disposable email addresses are not allowed.';
    case 'no_mx_records':     return 'This email domain cannot receive messages. Please check for typos.';
    case 'invalid_format':    return 'Please enter a valid email address.';
    case 'typo_detected':     return valData.error; 
    case 'missing_turnstile':
    case 'turnstile_failed':
    case 'turnstile_unreachable':
                              return valData.error || 'Bot verification failed. Please refresh and try again.';
    case 'rate_limited':      return valData.error || 'Too many attempts. Please try again later.';
    case 'validation_error':  return valData.error || 'Unable to verify email right now. Please try again.';
    default:                  return valData.error || 'Email validation failed.';
  }
}

/* ── 3. MAIN CONTROLLER ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

  /* ── 3.1 Success HTML ─────────────────────────────────────── */
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

  /* ── 3.2 Element refs ─────────────────────────────────────── */
  var mainContent     = document.getElementById('main-content');
  var investorSection = document.getElementById('investor-form-section');
  var contactModal    = document.getElementById('contact-modal');

  /* ── 3.3 Open / close ─────────────────────────────────────── */
  function resetInvestorState() {
    var formWrapper = investorSection && investorSection.querySelector('.form-wrapper');
    var lessInfoBox = investorSection && investorSection.querySelector('.less-info-box');
    var successEl   = document.getElementById('investorSuccessMessage');
    if (formWrapper) formWrapper.classList.remove('hidden');
    if (lessInfoBox) lessInfoBox.classList.remove('hidden');
    if (successEl) { successEl.classList.add('hidden'); successEl.innerHTML = ''; }
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

  /* ── 3.4 Global listeners ─────────────────────────────────── */
  document.querySelectorAll('[data-open-form="investor"]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var cleanPath = el.getAttribute('data-path');
      if (cleanPath) window.history.pushState({ path: cleanPath }, '', cleanPath);
      openInvestorForm();
    });
  });

  document.querySelectorAll('[data-open-form="contact"]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var cleanPath = el.getAttribute('data-path');
      if (cleanPath) window.history.pushState({ path: cleanPath }, '', cleanPath);
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

  /* ── 3.5 File upload UI ───────────────────────────────────── */
  var fileInput       = document.getElementById('investorDocumentUpload');
  var fileNameDisplay = document.getElementById('investorFileNameDisplay');
  var uploadError     = document.getElementById('investorUploadError');
  var MAX_FILE_SIZE   = 15 * 1024 * 1024; // 15 MB per file

  if (fileInput) {
    fileInput.addEventListener('change', function () {
      if (uploadError) uploadError.textContent = '';
      var files = this.files;

      if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          if (files[i].size > MAX_FILE_SIZE) {
            if (uploadError) uploadError.textContent = 'Error: "' + files[i].name + '" exceeds the 15 MB limit.';
            this.value = '';
            if (fileNameDisplay) fileNameDisplay.textContent = 'No files chosen';
            return;
          }
        }
        if (fileNameDisplay) {
          fileNameDisplay.textContent = files.length === 1 ? files[0].name : files.length + ' files selected';
        }
      } else if (fileNameDisplay) {
        fileNameDisplay.textContent = 'No files chosen';
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     3.6 EMAIL VALIDATION FETCH — shared between both forms.
     Returns { ok: true, data } on allow/flag, { ok: false, data }
     when status === "block" or on transport failure.
     ─────────────────────────────────────────────────────────── */
    async function validateEmail(email, turnstileToken) {
    /* ── 1. LOCAL TYPO CHECK (Native JS) ────────────────── */
    // Catches gmil.com, gmal.com, hotnail.com, etc.
    var parts = email.split('@');
    if (parts.length === 2) {
      var domain = parts[1].toLowerCase();
      var prefix = parts[0];
      
      var typos = {
        'gmil.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gmaill.com': 'gmail.com',
        'gamil.com': 'gmail.com', 'gail.com': 'gmail.com', 'gmail.con': 'gmail.com',
        'gmail.co': 'gmail.com', 'gmail.cm': 'gmail.com', 'gmailcom': 'gmail.com',
        
        'hotmai.com': 'hotmail.com', 'hotmial.com': 'hotmail.com', 'hotmail.con': 'hotmail.com',
        'hotmail.co': 'hotmail.com', 'hotmal.com': 'hotmail.com',
        
        'yaho.com': 'yahoo.com', 'yahooo.com': 'yahoo.com', 'yahoo.con': 'yahoo.com',
        'yahoo.co': 'yahoo.com', 'yhoo.com': 'yahoo.com',
        
        'outlok.com': 'outlook.com', 'outlook.con': 'outlook.com', 'outlook.co': 'outlook.com',
        'outllok.com': 'outlook.com',
        
        'iclod.com': 'icloud.com', 'icloud.con': 'icloud.com', 'icloud.co': 'icloud.com',
        
        'protonmai.com': 'protonmail.com', 'protonmail.con': 'protonmail.com',
        
        'aol.con': 'aol.com'
      };

      if (typos[domain]) {
        var suggestion = prefix + '@' + typos[domain];
        console.log('[Typo Check] Found suggestion:', suggestion);
        return {
          ok: false,
          data: {
            status: 'block',
            reason: 'typo_detected',
            error: 'Did you mean ' + suggestion + '? Please correct your email.'
          }
        };
      }
    }

    /* ── 2. REMOTE VALIDATION WORKER ────────────────────── */
    var res;
    try {
      // Append nocache=1 to bypass KV cache during testing
      var url = EMAIL_VALIDATION_URL;
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, turnstileToken: turnstileToken })
      });
    } catch (netErr) {
      console.error('[Email Validation] network:', netErr);
      return { ok: false, data: { error: 'Cannot reach validation service. Please check your connection.' } };
    }

    var data = null;
    try { data = await res.json(); }
    catch (parseErr) {
      console.error('[Email Validation] non-JSON response:', res.status, parseErr);
      return { ok: false, data: { error: 'Validation service returned an invalid response.' } };
    }

    console.log('[Email Validation Debug]', res.status, data);

    // Treat any explicit block as a stop, regardless of HTTP status.
    if (data && data.status === 'block') {
      return { ok: false, data: data };
    }

    // Any other non-2xx response without an explicit block → stop.
    if (!res.ok) {
      return { ok: false, data: data || { error: 'Email validation failed. Please try again.' } };
    }

    // Anything else (allow / flag / cached) → proceed to D1.
    return { ok: true, data: data };
  }

  /* ═══════════════════════════════════════════════════════════
     3.7 INVESTOR FORM SUBMISSION
     ─────────────────────────────────────────────────────────── */
  var investorForm      = document.getElementById('investor');
  var investorStatus    = document.getElementById('investorMessage');
  var investorSubmitBtn = investorForm ? investorForm.querySelector('button[type="submit"]') : null;

  if (investorForm) {
    var groupsToHighlight = ['fundingSource', 'commodityFocus', 'experienceStage', 'role', 'targetStage', 'proposedStructure', 'supportingDocuments'];
    groupsToHighlight.forEach(function (groupName) {
      var firstInput = investorForm.querySelector('input[name="' + groupName + '"]');
      if (firstInput) {
        var groupContainer = firstInput.closest('.options-group');
        if (groupContainer) groupContainer.classList.add('required-group');
      }
    });

    investorForm.addEventListener('input', function (e) {
      var target = e.target;
      if (target.validity && target.validity.valid) {
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

    investorForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      /* ── Honeypot ─────────────────────────────────────── */
      var honeypot = document.getElementById('investorWebsiteUrl');
      if (honeypot && honeypot.value !== '') {
        investorForm.reset();
        if (fileNameDisplay) fileNameDisplay.textContent = 'No files chosen';
        showInvestorSuccess();
        return;
      }

      /* ── HTML5 validity ───────────────────────────────── */
      investorForm.querySelectorAll('.gold-highlight').forEach(function (el) { el.classList.remove('gold-highlight'); });

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

      /* ── Turnstile token ──────────────────────────────── */
      if (!window.investorTurnstileToken) {
        setStatus(investorStatus, 'Please wait for bot verification to complete (or refresh the page).', true);
        return;
      }

      var emailInput = document.getElementById('signatoryEmail');
      var email      = emailInput.value.trim();

      investorSubmitBtn.disabled = true;
      investorSubmitBtn.textContent = 'Verifying Email...';
      setStatus(investorStatus, '', false);

      try {
        /* ── STAGE 1: EMAIL VALIDATION ─────────────────── */
        var val = await validateEmail(email, window.investorTurnstileToken);

        if (!val.ok) {
          setStatus(investorStatus, blockMessage(val.data), true);
          return; // finally resets Turnstile & button
        }

        /* ── STAGE 2: D1 SUBMISSION ────────────────────── */
        investorSubmitBtn.textContent = 'Sending...';
        setStatus(investorStatus, 'Sending enquiry...', false);

        var formData = new FormData(investorForm);
        formData.delete('website_url');

        var dbRes  = await fetch(D1_WORKER_URL, { method: 'POST', body: formData });
        var dbData = null;
        try { dbData = await dbRes.json(); }
        catch (parseErr) {
          throw new Error('Database service returned an invalid response.');
        }

        if (dbRes.ok && dbData && dbData.success) {
          investorForm.reset();
          if (fileNameDisplay) fileNameDisplay.textContent = 'No files chosen';
          showInvestorSuccess();
        } else {
          throw new Error((dbData && (dbData.message || dbData.error)) || 'Submission failed.');
        }
      } catch (err) {
        console.error('[Investor] submission error:', err);
        setStatus(investorStatus, err.message || 'Network error. Please try again.', true);
      } finally {
        investorSubmitBtn.disabled = false;
        investorSubmitBtn.textContent = 'Submit Investment Enquiry ↗';
        if (window.turnstile) window.turnstile.reset();
        window.investorTurnstileToken = null;
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     3.8 CONTACT FORM SUBMISSION
     ─────────────────────────────────────────────────────────── */
  var contact          = document.getElementById('contact-form');
  var contactStatus    = document.getElementById('contactMessage');
  var contactSubmitBtn = contact ? contact.querySelector('button[type="submit"]') : null;

  if (contact) {
    contact.addEventListener('submit', async function (e) {
      e.preventDefault();

      /* ── Honeypot ─────────────────────────────────────── */
      var honeypot = document.getElementById('contactWebsiteUrl');
      if (honeypot && honeypot.value !== '') {
        contact.reset();
        showContactSuccess();
        return;
      }

      /* ── HTML5 validity ───────────────────────────────── */
      if (!contact.checkValidity()) {
        setStatus(contactStatus, 'Please fill out all required fields correctly.', true);
        contact.reportValidity();
        return;
      }

      /* ── Turnstile token ──────────────────────────────── */
      if (!window.contactTurnstileToken) {
        setStatus(contactStatus, 'Please wait for bot verification to complete (or refresh the page).', true);
        return;
      }

      var emailInput = contact.querySelector('input[name="email"]');
      var email      = emailInput.value.trim();

      contactSubmitBtn.disabled = true;
      contactSubmitBtn.textContent = 'Verifying Email...';
      setStatus(contactStatus, '', false);

      try {
        /* ── STAGE 1: EMAIL VALIDATION ─────────────────── */
        var val = await validateEmail(email, window.contactTurnstileToken);

        if (!val.ok) {
          setStatus(contactStatus, blockMessage(val.data), true);
          return;
        }

        /* ── STAGE 2: D1 SUBMISSION ────────────────────── */
        contactSubmitBtn.textContent = 'Sending...';
        setStatus(contactStatus, 'Sending enquiry...', false);

        var formData = new FormData(contact);
        formData.delete('website_url');

        var dbRes  = await fetch(D1_WORKER_URL, { method: 'POST', body: formData });
        var dbData = null;
        try { dbData = await dbRes.json(); }
        catch (parseErr) {
          throw new Error('Database service returned an invalid response.');
        }

        if (dbRes.ok && dbData && dbData.success) {
          contact.reset();
          showContactSuccess();
        } else {
          throw new Error((dbData && (dbData.message || dbData.error)) || 'Submission failed.');
        }
      } catch (err) {
        console.error('[Contact] submission error:', err);
        setStatus(contactStatus, err.message || 'Network error. Please try again.', true);
      } finally {
        contactSubmitBtn.disabled = false;
        contactSubmitBtn.textContent = 'Send Enquiry ↗';
        if (window.turnstile) window.turnstile.reset();
        window.contactTurnstileToken = null;
      }
    });
  }
});