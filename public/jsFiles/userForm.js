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
                    const passwordConfirmInput = form.querySelector('[name="validationPasswordConfirm"]');
                    const passwordConfirmValue = passwordConfirmInput.value;
                    const minLength=8;
                    
                    function addValidation(input){
                        input.focus()
                        input.classList.remove('is-valid');
                        input.classList.add('is-invalid');
                    }
                    function removeValidation(input){
                        input.classList.remove('is-invalid');
                        input.classList.add('is-valid');
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

                    if (contactValue.length < 10 ||contactValue.length >12) {
                        event.preventDefault();
                        event.stopPropagation();
                        const alertMessage='Please enter a valid contact number with 10 to 12 digits.';
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
                        addValidation(passwordInput);
                        showAlert(alertMessage);
                        return
                    } else {
                        removeValidation(passwordInput)
                    }

                    if(passwordConfirmValue!==passwordValue){
                        event.preventDefault();
                        event.stopPropagation();
                        addValidation(passwordConfirmInput)
                        showAlert("Password does not match.");
                        return;
                    }
                    removeValidation(passwordConfirmInput)

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

        function togglePassword(id,span) {
            let passwordField = document.getElementById(id);
            let toggleSpan =document.getElementById(span);
          
            if (passwordField.type === "password") {
                passwordField.type = "text";
                toggleSpan.innerHTML = '<i class="bi bi-eye-fill"></i>';
            } else {
                passwordField.type = "password";
                toggleSpan.innerHTML = '<i class="bi bi-eye-slash-fill"></i>';
            }
          }