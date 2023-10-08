        (() => {
            'use strict';
            const forms = document.querySelectorAll('.needs-validation');
            Array.from(forms).forEach(form => {
                form.addEventListener('submit', event => {
                    const contactInput = form.querySelector('[name="contact"]');
                    const contactValue = contactInput.value;
                    const nameInput = form.querySelector('[name="name"]');
                    const nameValue = nameInput.value;
                    const passwordInput = form.querySelector('[name="password"]');
                    const passwordValue = passwordInput.value;
                 
    
                    if (/^\s*$/.test(nameValue)) {
                        event.preventDefault();
                        event.stopPropagation();
                        nameInput.value="";
                        const alertMessage='Name cannot be just spaces.';
                        showAlert(alertMessage);
                        return;
                    }

                    if (contactValue.length < 10) {
                        event.preventDefault();
                        event.stopPropagation();
                        const alertMessage='Contact number must be at least 10 digits.';
                        showAlert(alertMessage);
                        return
                      }

                    if (/^\s*$/.test(passwordValue)) {
                        event.preventDefault();
                        event.stopPropagation();
                        passwordInput.value='';
                        const alertMessage='Password cannot be just spaces.';
                        showAlert(alertMessage);
                        return;
                    }

        
                    if (passwordValue.length < 8) {
                        event.preventDefault();
                        event.stopPropagation();
                        const alertMessage='Password must be at least 8 characters.';
                        showAlert(alertMessage);
                        return;
                    }
                    
                    if (!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
    
                    form.classList.add('was-validated');
                }, false);
            });
        })();
        form.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                form.dispatchEvent(new Event('submit'));
            }
        });