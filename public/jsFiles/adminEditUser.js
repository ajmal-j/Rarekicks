(() => {
    'use strict';
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            const contactInput = form.querySelector('[name="contact"]');
            const contactValue = contactInput.value;

            if (contactValue.length < 10) {
                event.preventDefault();
                event.stopPropagation();
                const alertMessage='Contact number must be at least 10 digits.';
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
