(() => {
    'use strict';

    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', async event => {
            event.preventDefault();

            const contactInput = form.querySelector('[name="contact"]');
            const contactValue = contactInput.value.trim();

            const nameInput = form.querySelector('[name="name"]');
            const nameValue = nameInput.value.trim();

            const passwordInput = form.querySelector('[name="password"]');
            const passwordValue = passwordInput.value.trim();

            const emailInput = form.querySelector('[name="email"]');
            const emailValue = emailInput.value.trim();

            if (/^\s*$/.test(nameValue)) {
                showAlert('Name cannot be just spaces.');
                form.classList.add('was-validated');
                return;
            }

            if (contactValue.length < 10||contactValue.length>12) {
                showAlert('Contact number must be at least 10 digits And not more than 12 digits.');
                form.classList.add('was-validated');
                return;
            }

            if (/^\s*$/.test(passwordValue)) {
                showAlert('Password cannot be just spaces.');
                form.classList.add('was-validated');
                return;
            }

            if (passwordValue.length < 8) {
                showAlert('Password must be at least 8 characters.');
                form.classList.add('was-validated');
                return;
            }

            if (!form.checkValidity()) {
                return;
            }

            try {
                const response = await fetch('/user/checkPassword?password=' + passwordValue + "&email=" + emailValue + "&contact=" + contactValue);
                const data = await response.json();

                if (data.valid === "not") {
                    showAlert('Incorrect Password!');
                    passwordInput.focus();
                } else if (data.valid === "email") {
                    showAlert('Email Already Exist!');
                    emailInput.focus();
                } else if (data.valid === "contact") {
                    showAlert('Contact Already Exist!');
                    emailInput.focus();
                } else if (data.valid === "error") {
                    showAlert('Error');
                    emailInput.focus();
                } else {
                    showAlert('Updating');
                    form.submit(); // Manually submit the form
                }
            } catch (error) {
                console.error("Error checking category:", error);
            }
        });

    }, false);
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