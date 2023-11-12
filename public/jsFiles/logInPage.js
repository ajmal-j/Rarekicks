(() => {
     'use strict';
     const forms = document.querySelectorAll('.needs-validation');
     Array.from(forms).forEach(form => {
         form.addEventListener('submit', event => {
             const passwordInput = form.querySelector('[name="password"]');
             const passwordValue = passwordInput.value;
             const emailInput = form.querySelector('[name="email"]');
             const emailValue = emailInput.value;

             function addValidation(input){
                input.classList.add('is-invalid');
                input.classList.remove('is-valid');
            }
            function removeValidation(input){
                input.classList.add('is-valid');
                input.classList.remove('is-invalid');
            }
             const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const minLength=8;
             if (!emailRegex.test(emailValue)) {
                 event.preventDefault();
                 event.stopPropagation();
                 const alertMessage = 'Please enter a valid email address.';
                 showAlert(alertMessage);
                 addValidation(emailInput)
                 return;
             }
             removeValidation(emailInput)


             if (/^\s*$/.test(passwordValue) || passwordValue.length < minLength) {
                event.preventDefault();
                event.stopPropagation();
                const alertMessage = /^\s*$/.test(passwordValue)
                    ? 'Password cannot be just spaces.'
                    : `Password must be at least ${minLength} characters.`;

                if(alertMessage==='Password cannot be just spaces.'){
                    passwordInput.value='';
                }
                passwordInput.setCustomValidity(alertMessage);
                passwordInput.classList.add('is-invalid');
                showAlert(alertMessage);
            } else {
                passwordInput.setCustomValidity('');
                passwordInput.classList.remove('is-invalid');
            }
            
             if (!form.checkValidity()) {
                 event.preventDefault();
                 event.stopPropagation();
             }
         }, false);
         form.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                form.dispatchEvent(new Event('submit'));
            }
        });
     });
 })();