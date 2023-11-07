(() => {
     'use strict';
     const forms = document.querySelectorAll('.needs-validation');
     Array.from(forms).forEach(form => {
         form.addEventListener('submit', event => {
             const passwordInput = form.querySelector('[name="password"]');
             const passwordValue = passwordInput.value;
             if (/^\s*$/.test(passwordValue)) {
                 event.preventDefault();
                 event.stopPropagation();
                 passwordInput.value='';
                 const alertMessage='Password cannot be just spaces.';
                 showAlert(alertMessage);
             }
             if (passwordValue.length < 8) {
                 event.preventDefault();
                 event.stopPropagation();
                 const alertMessage='Password must be at least 8 characters.';
                 showAlert(alertMessage);
             }
             if (!form.checkValidity()) {
                 event.preventDefault();
                 event.stopPropagation();
             }
             form.classList.add('was-validated');
         }, false);
         form.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                form.dispatchEvent(new Event('submit'));
            }
        });
     });
 })();
       
        function showAlert(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert';
        alertDiv.style.position = 'fixed';
        alertDiv.style.right = '20px';
        alertDiv.style.zIndex = '2000000000000000';
        alertDiv.style.top = '60px';
        alertDiv.style.opacity = '0';
        alertDiv.style.transition = 'opacity 0.5s ease-in-out';
        alertDiv.style.backgroundColor = '#D80032'; // Red
        alertDiv.style.color = 'white';
        alertDiv.style.padding = '15px';
        alertDiv.style.marginBottom = '15px';
        alertDiv.style.borderRadius = '4px';
        alertDiv.style.boxShadow = '0 2px 15px 0 rgba(0,0,0,0.24), 0 5px 5px 0 rgba(0,0,0,0.19)';
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `<strong>${message}</strong>`;
        document.body.appendChild(alertDiv);

        // Fade in
        setTimeout(() => {
        alertDiv.style.opacity = '1';
        }, 50);

        // Fade out and remove
        setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => {
            alertDiv.remove();
        }, 500);
        }, 2000);
}