   
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
    
                const discountInput = form.querySelector('[name="discountPercentage"]');
                const discountValue = discountInput.value.trim();
                const discount = parseInt(discountValue);
    
                const minimumInput = form.querySelector('[name="minimumAmount"]');
                const minimumValue = parseFloat(minimumInput.value);
                
                const maximumInput = form.querySelector('[name="maximumAmount"]');
                const maximumValue = parseFloat(maximumInput.value);
    
                if (codeValue === '' || !isNaN(codeValue) || codeValue.length > 15 || codeValue.length < 4) {
                    showAlert('Please enter a valid code.');
                    return;
                }
    
                if (!isValidFutureDate(dateValue)) {
                    showAlert('Please enter a valid future date.');
                    return;
                }
                if (minimumValue < 0 || maximumValue < 0 || minimumValue >= maximumValue) {
                    showAlert('Please enter a valid Amount.');
                    return;
                }
    
    
                function isValidFutureDate(dateString) {
                    if (!dateString || typeof dateString !== 'string') {
                        return false;
                    }
                    const dateObject = new Date(dateString);
                    return !isNaN(dateObject.getTime()) && dateObject > new Date();
                }
    
                if (discountValue === '' || discount >= 80 || discount < 1) {
                    showAlert('Please enter a valid discount value.');
                    return;
                }
    
                if (!form.checkValidity()) {
                    showAlert("Validation Failed")
                    return;
                }
    
                try {
                    const response = await fetch(`/admin/addCoupon?code=${codeValue}&discount=${discountValue}&date=${dateValue}&min=${minimumValue}&max=${maximumValue}`);
                    const data = await response.json();
                    console.log(data);
                    if (data.added === true) {
                        showSuccess('Updating!');
                        form.classList.add('was-validated');
                        location.reload();
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