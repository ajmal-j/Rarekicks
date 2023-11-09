(() => {
    'use strict';

    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', async event => {
            event.preventDefault();
            const codeInput = form.querySelector('[name="code"]');
            const codeValue = codeInput.value.trim();
            const dateInput = form.querySelector('[name="discountExpiryDate"]');
            const dateValue = dateInput.value;
            const minimumInput = document.getElementById("minimumAmount");
            const maximumInput = document.getElementById("maximumAmount");
            const minimumValue = parseFloat(minimumInput.value);
            const maximumValue = parseFloat(maximumInput.value);
            const discountInput = form.querySelector('[name="discountPercentage"]');
            const discountValue = discountInput.value.trim();
            const discount = parseInt(discountValue);

            if (codeValue === '' || !isNaN(codeValue) || codeValue.length > 15 || codeValue.length < 4) {
                showAlert('Please enter a valid code.');
                return;
            }

            if (!isValidFutureDate(dateValue)) {
                showAlert('Please enter a valid future date.');
                return;
            }
            if ((minimumValue < 0 || maximumValue < 0) || minimumValue >= maximumValue) {
                showAlert('Please enter a valid Amount.');
                return;
            }

            function isValidFutureDate(dateString) {
                // Check if the input is a non-empty string
                if (!dateString || typeof dateString !== 'string') {
                    return false;
                }

                // Attempt to create a Date object from the input
                const dateObject = new Date(dateString);

                // Check if the Date object is valid and if it is a future date
                return !isNaN(dateObject.getTime()) && dateObject > new Date();
            }

            if (discountValue === '' || discount > 80 || discount < 1) {
                showAlert('Please enter a valid discount value.');
                return;
            }

            if (!form.checkValidity()) {
                showAlert("Not Valid")
                return;
            }

            try {
                const response = await fetch(`/admin/editCoupon?code=${codeValue}&discount=${discountValue}&id=${id}&date=${dateValue}&min=${minimumValue}&max=${maximumValue}`);
                const data = await response.json();
                console.log(data);
                if (data.added === true) {
                    showSuccess('Updating!');
                    // form.classList.add('was-validated'); // Add 'was-validated' class
                    window.location.href = "/admin/couponManagement";
                } else if (data.added === "exist") {
                    showAlert('Coupon already exists!');
                } else if (data.added === "not") {
                    showAlert('Not Valid');
                } else if (data.added === false) {
                    showSuccess('Not Added');
                }
            } catch (error) {
                console.error("Error checking category:", error);
            }
        });
    });
})();