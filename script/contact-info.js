document.addEventListener('DOMContentLoaded', function () {
  const form      = document.getElementById('enquiryForm');
  const status    = document.getElementById('formMessage');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  // Your Google Apps Script Web App endpoint
  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxF3IFHz1nsKoNt8acFRJ6NNSpsFJbK-lzqktsjehT-d8pVm8Ys0D2MhzisPY6qUncs/exec';

  if (!form) return;

  /* =========================================================
     1. FILE UPLOAD SIZE VALIDATION (Moved outside submit event)
     ========================================================= */
  const fileInput = document.getElementById('documentUpload');
  const fileNameDisplay = document.getElementById('fileNameDisplay');
  const uploadError = document.getElementById('uploadError');
  const maxSize = 15 * 1024 * 1024; // 15 MB

  if (fileInput) {
    fileInput.addEventListener('change', function () {
      uploadError.textContent = '';
      const files = this.files;

      if (files.length > 0) {
        let hasError = false;

        for (let i = 0; i < files.length; i++) {
          if (files[i].size > maxSize) {
            hasError = true;
            break;
          }
        }

        if (hasError) {
          uploadError.textContent = 'Error: One or more files exceed the 15 MB limit. Please compress or select smaller files.';
          this.value = ''; // Clear the invalid files
          fileNameDisplay.textContent = 'No files chosen';
          return;
        }

        // Show file names
        if (files.length === 1) {
          fileNameDisplay.textContent = files[0].name;
        } else {
          fileNameDisplay.textContent = `${files.length} files selected`;
        }
      } else {
        fileNameDisplay.textContent = 'No files chosen';
      }
    });
  }

  /* =========================================================
     2. FORM SUBMISSION
     ========================================================= */
    form.addEventListener('submit', function (e) {
    e.preventDefault();

    // A. HONEYPOT CHECK
    const honeypotEl = document.getElementById('website_url');
    if (honeypotEl && honeypotEl.value !== '') {
      status.innerHTML = '<strong>Thank you for your submission to OREXITY.</strong><br>' +
        'Your information has been received and will be reviewed by our team. ' +
        'We will contact you regarding the next steps, where appropriate.';
      status.style.color = 'green';
      form.reset();
      if(fileNameDisplay) fileNameDisplay.textContent = 'No files chosen';
      return;
    }

    // B. VALIDATION CHECK (Show error, but DO NOT stop submission)
    if (!form.checkValidity()) {
      // Show the native browser popups on the empty fields
      form.reportValidity(); 
      
      // Show the red error text
      status.textContent = 'Note: Some required fields are missing, but your data is still being submitted.';
      status.style.color = 'red';
      
    } else {
      // If the form IS valid, show normal sending message
      status.textContent = 'Sending enquiry...';
      status.style.color = '#1f2833';
    }

    // C. SUBMIT (This will now run EVERY time)
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    const formData = new FormData(form);
    formData.delete('website_url');

    fetch(WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    })
    .then(() => {
      status.innerHTML =
        '<strong>Thank you for your submission to OREXITY.</strong><br>' +
        'Your information has been received and will be reviewed by our team. ' +
        'We will contact you regarding the next steps, where appropriate.';
      status.style.color = 'green';
      form.reset();
      
      if(fileNameDisplay) fileNameDisplay.textContent = 'No files chosen'; 
    })
    .catch(error => {
      console.error('Error:', error);
      status.textContent = 'An error occurred. Please try again.';
      status.style.color = 'red';
    })
    .finally(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Investment Enquiry ↗';
      }
    });
  });
});