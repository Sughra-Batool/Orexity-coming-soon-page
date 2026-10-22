/* ══════════════════════════════════════════════════
   INVESTOR FORM SUBMISSION & SECURITY
   ══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('investor-form');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');
  
  // Your actual Google Web App URL
  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyeySGqiWke-9CBeI9MitbWdpzRN4HlabjpAWS_zEw45uRiJATQ42qv0E8NHK4ttXk_/exec'; 

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault(); 
      
      // 1. HONEYPOT CHECK (Anti-Bot)
      const honeypot = document.getElementById('website_url').value;
      if (honeypot !== "") {
          // If a bot fills this out, silently pretend it worked and stop.
          status.textContent = "Thank you! Your enquiry has been received.";
          status.style.color = "green";
          form.reset();
          return; 
      }

      // 2. BROWSER VALIDATION CHECK
      if (!form.checkValidity()) {
          status.textContent = "Please fill out all required fields correctly.";
          status.style.color = "red";
          form.reportValidity(); // Shows the native browser tooltips
          return;
      }

      // 3. SUBMIT
      status.textContent = "Sending enquiry...";
      status.style.color = "#1f2833";
      submitBtn.disabled = true; // Prevent double-clicking
      submitBtn.textContent = "Sending..."; 
      
      const formData = new FormData(form);
      
      // Remove the honeypot from the data sent to Google Sheets
      formData.delete('website_url'); 
      
      const data = new URLSearchParams(formData);
      
      fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
      })
      .then(() => {
        status.textContent = "Thank you! Your enquiry has been received. We will contact you shortly.";
        status.style.color = "green";
        form.reset(); 
      })
      .catch(error => {
        console.error('Error:', error);
        status.textContent = "An error occurred. Please try again.";
        status.style.color = "red";
      })
      .finally(() => {
        submitBtn.disabled = false; // Re-enable button
        submitBtn.textContent = "Submit Enquiry"; // Reset button text
      });
    });
  }
});