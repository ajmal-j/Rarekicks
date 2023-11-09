(() => {
    'use strict';
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            const passwordInput = form.querySelector('[name="password"]');
            const passwordValue = passwordInput.value;
            const emailInput = form.querySelector('[name="email"]');
            const emailValue = emailInput.value;
            if (/^\s*$/.test(passwordValue)) {
                event.preventDefault();
                event.stopPropagation();
                const alertMessage='Password cannot be just spaces.';
                showAlert(alertMessage);
                return;
            }
            if (/^\s*$/.test(emailValue)) {
                event.preventDefault();
                event.stopPropagation();
                const alertMessage='Email cannot be just spaces.';
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
        form.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        form.dispatchEvent(new Event('submit'));
    }
});

    });
})();
