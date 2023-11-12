        (() => {
            'use strict';
            const forms = document.querySelectorAll('.needs-validation');
            Array.from(forms).forEach(form => {
                form.addEventListener('submit', event => {
                    const contactInput = form.querySelector('[name="contact"]');
                    const contactValue = contactInput.value;
                    const nameInput = form.querySelector('[name="name"]');
                    const nameValue = nameInput.value;
                    const emailInput = form.querySelector('[name="email"]');
                    const emailValue = emailInput.value;
                    const passwordInput = form.querySelector('[name="password"]');
                    const passwordValue = passwordInput.value;
                    const minLength=8;
                    
                    function addValidation(input){
                        input.classList.add('is-invalid');
                        input.classList.remove('is-valid');
                    }
                    function removeValidation(input){
                        input.classList.add('is-valid');
                        input.classList.remove('is-invalid');
                    }
                    if (/^\s*$/.test(nameValue)) {
                        event.preventDefault();
                        event.stopPropagation();
                        nameInput.value="";
                        const alertMessage='Name cannot be just spaces.';
                        showAlert(alertMessage);
                        addValidation(nameInput)
                        return;
                    }
                    removeValidation(nameInput)

                    if (contactValue.length < 10) {
                        event.preventDefault();
                        event.stopPropagation();
                        const alertMessage='Contact number must be at least 10 digits.';
                        showAlert(alertMessage);
                        addValidation(contactInput)
                        return
                      }
                      removeValidation(contactInput)


                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

        function togglePassword() {
            let passwordField = document.getElementById("validationPassword");
            let toggleSpan =document.getElementById("passKey");
          
            if (passwordField.type === "password") {
                passwordField.type = "text";
                toggleSpan.innerHTML = '<i class="bi bi-eye-fill"></i>';
            } else {
                passwordField.type = "password";
                toggleSpan.innerHTML = '<i class="bi bi-eye-slash-fill"></i>';
            }
          }