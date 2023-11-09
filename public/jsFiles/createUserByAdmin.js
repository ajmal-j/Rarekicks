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
               showAlert('Enter a valid name.');
                return;
            }
            if (/^\s*$/.test(passwordValue)) {
                event.preventDefault();
                event.stopPropagation();
               showAlert('Password cannot be just spaces.');
                return;
            }

            if (contactValue.length < 10) {
              event.preventDefault();
              event.stopPropagation();
             showAlert('Contact number must be at least 10 digits.');
              return
            }
            if (passwordValue.length < 8) {
              event.preventDefault();
              event.stopPropagation();
             showAlert('Password must be at least 8 characters.');
              return
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
