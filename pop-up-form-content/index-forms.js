/* ══════════════════════════════════════════════════════════════
   OREXITY — index.html inline form controller
   ══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* =========================================================
     1. SUCCESS MESSAGES & DESIGNS
     ========================================================= */
  const medalSVG = `
    <svg class="success-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M35 60 L20 95 L35 88 L45 100 L50 65 Z" fill="currentColor"/>
      <path d="M65 60 L80 95 L65 88 L55 100 L50 65 Z" fill="currentColor"/>
      <path d="M50 5 L58 15 L70 10 L75 22 L88 25 L85 38 L95 50 L85 62 L88 75 L75 78 L70 90 L58 85 L50 95 L42 85 L30 90 L25 78 L12 75 L15 62 L5 50 L15 38 L12 25 L25 22 L30 10 L42 15 Z" fill="currentColor"/>
      <circle cx="50" cy="50" r="25" fill="#ffffff" />
      <path d="M38 50 L46 58 L62 40" fill="none" stroke="#ffd000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  const SUCCESS_HTML = `
    ${medalSVG}
    <h2 class="success-title">Thank you for your submission to OREXITY.</h2>
    <p class="success-text">Your information has been received and our team will respond with informed insights, professional guidance, and relevant expertise tailored to your requirements.</p>
    <div class="success-border"></div>
  `;

  /* =========================================================
     2. FORM CONTROLLER (Open/Close & Header Visibility)
     ========================================================= */
  const mainContent     = document.getElementById('main-content');
  const investorSection = document.getElementById('investor-form-section');
  const contactModal    = document.getElementById('contact-modal');

  // --- Investor Form Controls ---
  function resetInvestorState() {
    const formWrapper = investorSection && investorSection.querySelector('.form-wrapper');
    const lessInfoBox = investorSection && investorSection.querySelector('.less-info-box');
    const successEl   = document.getElementById('investorSuccessMessage');
    if (formWrapper) formWrapper.classList.remove('hidden');
    if (lessInfoBox) lessInfoBox.classList.remove('hidden');
    if (successEl)   { successEl.classList.add('hidden'); successEl.innerHTML = ''; }
  }

  function openInvestorForm() {
    resetInvestorState();
    if (mainContent) mainContent.classList.add('hidden');
    if (investorSection) investorSection.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function closeInvestorForm() {
    if (investorSection) investorSection.classList.add('hidden');
    if (mainContent) mainContent.classList.remove('hidden');
  }

  function showInvestorSuccess() {
    const formWrapper = investorSection && investorSection.querySelector('.form-wrapper');
    const lessInfoBox = investorSection && investorSection.querySelector('.less-info-box');
    const successEl   = document.getElementById('investorSuccessMessage');
    if (formWrapper) formWrapper.classList.add('hidden');
    if (lessInfoBox) lessInfoBox.classList.add('hidden');
    if (successEl) {
      successEl.innerHTML = SUCCESS_HTML;
      successEl.classList.remove('hidden');
      successEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // --- Contact Modal Controls ---
  function resetContactState() {
    const modalEl   = contactModal && contactModal.querySelector('.modal');
    const successEl = document.getElementById('contactSuccessMessage');
    if (modalEl)   modalEl.classList.remove('hidden');
    if (successEl) { successEl.classList.add('hidden'); successEl.innerHTML = ''; }
    document.body.classList.remove('contact-success-mode'); // Hide header again
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
      document.body.classList.remove('contact-success-mode'); // Hide header again
    }
  }

  function showContactSuccess() {
    const modalEl   = contactModal && contactModal.querySelector('.modal');
    const successEl = document.getElementById('contactSuccessMessage');
    if (modalEl)   modalEl.classList.add('hidden');
    if (successEl) {
      successEl.innerHTML = SUCCESS_HTML;
      successEl.classList.remove('hidden');
      document.body.classList.add('contact-success-mode'); // SHOW HEADER ABOVE BACKDROP
    }
  }

  /* =========================================================
     3. GLOBAL EVENT LISTENERS (Buttons, Nav, Escape)
     ========================================================= */
  document.querySelectorAll('[data-open-form="investor"]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); openInvestorForm(); });
  });

  document.querySelectorAll('[data-open-form="contact"]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); openContactModal(); });
  });

  document.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', closeContactModal);
  });

  if (contactModal) {
    contactModal.addEventListener('click', e => {
      if (e.target === contactModal) closeContactModal();
    });
  }
  
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && contactModal && !contactModal.classList.contains('hidden')) {
      closeContactModal();
    }
  });

  document.querySelectorAll('.site-header .nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      if (contactModal && !contactModal.classList.contains('hidden')) closeContactModal();
      if (investorSection && !investorSection.classList.contains('hidden')) {
        e.preventDefault();
        closeInvestorForm();
        const href = this.getAttribute('href');
        const target = href && href !== '#' ? document.querySelector(href) : null;
        if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth' }));
      }
    });
  });

  const brandLink = document.querySelector('.site-header .brand');
  if (brandLink) {
    brandLink.addEventListener('click', e => {
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

  /* =========================================================
     4. INVESTOR FORM SUBMISSION LOGIC
     ========================================================= */
  const investorForm      = document.getElementById('investorForm');
  const investorStatus    = document.getElementById('investorFormMessage');
  const investorSubmitBtn = investorForm ? investorForm.querySelector('button[type="submit"]') : null;
  const INVESTOR_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxF3IFHz1nsKoNt8acFRJ6NNSpsFJbK-lzqktsjehT-d8pVm8Ys0D2MhzisPY6qUncs/exec';

  // File-upload size validation
  const fileInput       = document.getElementById('investorDocumentUpload');
  const fileNameDisplay = document.getElementById('investorFileNameDisplay');
  const uploadError     = document.getElementById('investorUploadError');
  const maxSize         = 15 * 1024 * 1024;

  if (fileInput) {
    fileInput.addEventListener('change', function () {
      uploadError.textContent = '';
      const files = this.files;

      if (files.length > 0) {
        let hasError = false;
        for (let i = 0; i < files.length; i++) {
          if (files[i].size > maxSize) { hasError = true; break; }
        }
        if (hasError) {
          uploadError.textContent = 'Error: One or more files exceed the 15 MB limit. Please compress or select smaller files.';
          this.value = '';
          fileNameDisplay.textContent = 'No files chosen';
          return;
        }
        fileNameDisplay.textContent = files.length === 1 ? files[0].name : `${files.length} files uploaded`;
      } else {
        fileNameDisplay.textContent = 'No files chosen';
      }
    });
  }

  if (investorForm) {
    // Add golden border to specific required checkbox groups
    const groupsToHighlight = [
      'fundingSource', 
      'commodityFocus', 
      'experienceStage', 
      'role', 
      'targetStage', 
      'proposedStructure', 
      'supportingDocuments'
    ];
    groupsToHighlight.forEach(groupName => {
      const firstInput = investorForm.querySelector(`input[name="${groupName}"]`);
      if (firstInput) {
        const groupContainer = firstInput.closest('.options-group');
        if (groupContainer) groupContainer.classList.add('required-group');
      }
    });

    // Remove gold highlights when user fixes fields
    investorForm.addEventListener('input', function (e) {
      const target = e.target;
      if (target.validity.valid) {
        if (target.type === 'checkbox') {
          const label = target.closest('.checkbox-label') || target.closest('.declaration-confirm');
          if (label) label.classList.remove('gold-highlight');
        } else if (target.type === 'file') {
          const uploadBox = target.closest('.upload-box');
          if (uploadBox) uploadBox.classList.remove('gold-highlight');
        } else {
          target.classList.remove('gold-highlight');
        }
      }
    });

    investorForm.addEventListener('change', function (e) {
      if (e.target.validity.valid && (e.target.type === 'checkbox' || e.target.type === 'file')) {
        const label = e.target.closest('.checkbox-label') || e.target.closest('.declaration-confirm');
        const uploadBox = e.target.closest('.upload-box');
        if (label) label.classList.remove('gold-highlight');
        if (uploadBox) uploadBox.classList.remove('gold-highlight');
      }
    });

    // Fetch Submission Function
    function executeInvestorSubmission(isSilent = false) {
      if (!isSilent) {
        if (investorStatus) {
          investorStatus.textContent = 'Sending enquiry...';
          investorStatus.style.color = '#b4bdbd';
        }
        if (investorSubmitBtn) {
          investorSubmitBtn.disabled = true;
          investorSubmitBtn.textContent = 'Sending...';
        }
      }

      const formData = new FormData(investorForm);
      formData.delete('website_url'); // Remove honeypot

      // ✅ FILE UPLOAD LOGIC (Base64 Conversion)
      function sendData() {
        fetch(INVESTOR_WEB_APP_URL, { method: 'POST', mode: 'no-cors', body: formData })
        .then(() => {
          if (!isSilent) {
            setTimeout(() => {
              investorForm.reset();
              if (fileNameDisplay) fileNameDisplay.textContent = 'No files chosen';
              showInvestorSuccess();
            }, 1000); 
          }
        })
        .catch(error => {
          console.error('Error:', error);
          if (!isSilent && investorStatus) {
            investorStatus.textContent = 'An error occurred. Please try again.';
            investorStatus.style.color = 'red';
          }
        })
        .finally(() => {
          if (!isSilent && investorSubmitBtn) {
            investorSubmitBtn.disabled = false;
            investorSubmitBtn.textContent = 'Submit Investment Enquiry ↗';
          }
        });
      }

      // Check if a file is selected
      if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0]; // Process first file
        const reader = new FileReader();
        
        reader.onload = function(event) {
          // Extract the Base64 string from the Data URL
          const base64String = event.target.result.split(',')[1];
          
          // Add file data to the FormData as text
          formData.append('fileData', base64String);
          formData.append('fileName', file.name);
          formData.append('fileMimeType', file.type || 'application/octet-stream');
          
          sendData(); // Send data after file is converted
        };
        reader.readAsDataURL(file);
      } else {
        sendData(); // Send data normally (no file)
      }
    }

    // Submit Event
    investorForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot
      const honeypot = document.getElementById('investorWebsiteUrl');
      if (honeypot && honeypot.value !== '') {
        investorForm.reset();
        if (fileNameDisplay) fileNameDisplay.textContent = 'No files chosen';
        showInvestorSuccess();
        return;
      }

      // Clear previous highlights
      investorForm.querySelectorAll('.gold-highlight').forEach(el => el.classList.remove('gold-highlight'));

      // Checkbox Group Validation Trick
      const requiredGroups = ['role', 'targetStage', 'proposedStructure'];
      requiredGroups.forEach(groupName => {
        const checkboxes = investorForm.querySelectorAll(`input[name="${groupName}"]`);
        if (checkboxes.length > 0) {
          const isAnyChecked = Array.from(checkboxes).some(cb => cb.checked);
          if (!isAnyChecked) {
            checkboxes[0].setAttribute('required', 'required');
          } else {
            checkboxes.forEach(cb => cb.removeAttribute('required'));
          }
        }
      });

      // Validity Check
      if (!investorForm.checkValidity()) {
        investorForm.reportValidity(); 

        // Apply Gold Highlights
        investorForm.querySelectorAll('input[required], select[required], textarea[required]').forEach(input => {
          if (!input.validity.valid) {
            if (input.type === 'checkbox') {
              const label = input.closest('.checkbox-label');
              if (label) label.classList.add('gold-highlight');
              else input.closest('.declaration-confirm')?.classList.add('gold-highlight');
            } else if (input.type === 'file') {
              const uploadBox = input.closest('.upload-box');
              if (uploadBox) uploadBox.classList.add('gold-highlight');
            } else {
              input.classList.add('gold-highlight');
            }
          }
        });

        executeInvestorSubmission(true); // Silent fallback
        return;
      }

      executeInvestorSubmission(false); // Normal submission
    });
  }

  /* =========================================================
     5. CONTACT FORM SUBMISSION LOGIC
     ========================================================= */
  const contactForm      = document.getElementById('contactForm');
  const contactStatus    = document.getElementById('contactFormMessage');
  const contactSubmitBtn = contactForm ? contactForm.querySelector('button[type="submit"]') : null;
  const CONTACT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyeySGqiWke-9CBeI9MitbWdpzRN4HlabjpAWS_zEw45uRiJATQ42qv0E8NHK4ttXk_/exec';

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot
      const honeypot = document.getElementById('contactWebsiteUrl');
      if (honeypot && honeypot.value !== '') {
        contactForm.reset();
        showContactSuccess();
        return;
      }

      // Validity
      if (!contactForm.checkValidity()) {
        if (contactStatus) {
          contactStatus.textContent = 'Please fill out all required fields correctly.';
          contactStatus.style.color = 'red';
        }
        contactForm.reportValidity();
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

      const formData = new FormData(contactForm);
      formData.delete('website_url');
      const data = new URLSearchParams(formData);

      fetch(CONTACT_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data
      })
      .then(() => {
        setTimeout(() => {
          contactForm.reset();
          showContactSuccess(); // This triggers the header to pop up
        }, 1000);
      })
      .catch(error => {
        console.error('Error:', error);
        if (contactStatus) {
          contactStatus.textContent = 'An error occurred. Please try again.';
          contactStatus.style.color = 'red';
        }
      })
      .finally(() => {
        if (contactSubmitBtn) {
          contactSubmitBtn.disabled = false;
          contactSubmitBtn.textContent = 'Send Enquiry ↗';
        }
      });
    });
  }
});