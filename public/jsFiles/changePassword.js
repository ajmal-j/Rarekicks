(() => {
    'use strict';

    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', async event => {
            event.preventDefault();

            const currentPasswordInput = form.querySelector('[name="currentPassword"]');
            const currentPasswordValue = currentPasswordInput.value.trim();

            const newPasswordInput = form.querySelector('[name="newPassword"]');
            const newPasswordValue = newPasswordInput.value.trim();

            const confirmPasswordInput = form.querySelector('[name="confirmPassword"]');
            const confirmPasswordValue = confirmPasswordInput.value.trim();

            if (/^\s*$/.test(currentPasswordValue)) {
                showAlert('Password cannot be just spaces.');
                form.classList.add('was-validated');
                return;
            }

            if (currentPasswordValue.length < 8) {
                showAlert('Password number must be at least 10 digits.');
                form.classList.add('was-validated');
                return;
            }

            if (/^\s*$/.test(confirmPasswordValue)) {
                showAlert('Password cannot be just spaces.');
                form.classList.add('was-validated');
                return;
            }

            if (confirmPasswordValue.length < 8) {
                showAlert('Password must be at least 8 characters.');
                form.classList.add('was-validated');
                return;
            }
            if (/^\s*$/.test(currentPasswordValue)) {
                showAlert('Password cannot be just spaces.');
                form.classList.add('was-validated');
                return;
            }

            if (currentPasswordValue.length < 8) {
                showAlert('Password must be at least 8 characters.');
                form.classList.add('was-validated');
                return;
            }

            if (!form.checkValidity()) {
                return;
            }

            try {
                const response = await fetch('/user/checkPasswordNewPassword?currentPassword=' + currentPasswordValue + "&newPassword=" + newPasswordValue + "&confirmPassword=" + confirmPasswordValue);
                const data = await response.json();

                if (data.valid === "not") {
                    showAlert('Incorrect Password!');
                    passwordInput.focus();
                } else if (data.valid === "new") {
                    showAlert('New Password Not Matches!');
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

function togglePassword1() {
    let passwordField1 = document.getElementById("validationPassword1");
    let toggleSpan1 =document.getElementById("passKey1");

    if (passwordField1.type === "password") {
        passwordField1.type = "text";
        toggleSpan1.innerHTML = '<i class="bi bi-eye-fill"></i>';
    } else {
        passwordField1.type = "password";
        toggleSpan1.innerHTML = '<i class="bi bi-eye-slash-fill"></i>';
    }
    
}
function togglePassword2() {
    let passwordField2 = document.getElementById("validationPassword2");
    let toggleSpan2 =document.getElementById("passKey2");

 
    if (passwordField2.type === "password") {
        passwordField2.type = "text";
        toggleSpan2.innerHTML = '<i class="bi bi-eye-fill"></i>';
    } else {
        passwordField2.type = "password";
        toggleSpan2.innerHTML = '<i class="bi bi-eye-slash-fill"></i>';
    }
   
}
function togglePassword3() {
    let passwordField3 = document.getElementById("validationPassword3");
    let toggleSpan3 =document.getElementById("passKey3");

    if (passwordField3.type === "password") {
        passwordField3.type = "text";
        toggleSpan3.innerHTML = '<i class="bi bi-eye-fill"></i>';
    } else {
        passwordField3.type = "password";
        toggleSpan3.innerHTML = '<i class="bi bi-eye-slash-fill"></i>';
    }
}