function showAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert';
    alertDiv.style.position = 'fixed';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '2000';
    alertDiv.style.top = '60px';
    alertDiv.style.opacity = '0';
    alertDiv.style.transition = 'opacity 0.5s ease-in-out';
    alertDiv.style.backgroundColor = '#D80032'; // Red
    alertDiv.style.color = 'white';
    alertDiv.style.padding = '15px';
    alertDiv.style.marginBottom = '15px';
    alertDiv.style.borderRadius = '4px';
    alertDiv.style.boxShadow = '0 2px 15px 0 rgba(0,0,0,0.24), 0 5px 5px 0 rgba(0,0,0,0.19)';
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `<strong>${message}</strong>`;
    document.body.appendChild(alertDiv);

    // Fade in
    setTimeout(() => {
        alertDiv.style.opacity = '1';
    }, 50);

    // Fade out and remove
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => {
            alertDiv.remove();
        }, 500);
    }, 2000);
}

function showSuccess(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert';
    alertDiv.style.position = 'fixed';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '2000';
    alertDiv.style.top = '60px';
    alertDiv.style.opacity = '0';
    alertDiv.style.transition = 'opacity 0.5s ease-in-out';
    alertDiv.style.backgroundColor = '#4CAF50'; // Green
    alertDiv.style.color = 'white';
    alertDiv.style.padding = '15px';
    alertDiv.style.marginBottom = '15px';
    alertDiv.style.borderRadius = '4px';
    alertDiv.style.boxShadow = '0 2px 15px 0 rgba(0,0,0,0.24), 0 5px 5px 0 rgba(0,0,0,0.19)';
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `<strong>${message}</strong>`;
    document.body.appendChild(alertDiv);

     // Fade in
     setTimeout(() => {
        alertDiv.style.opacity = '1';
     }, 50);

     // Fade out and remove
     setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => {
            alertDiv.remove();
        }, 500);
     }, 2000);
}



















        (() => {
            'use strict';
            const forms = document.querySelectorAll('.needs-validation');
            Array.from(forms).forEach(form => {
                form.addEventListener('submit', event => {
                    const nameInput = form.querySelector('[name="name"]');
                    const nameValue = nameInput.value;
                    const priceInput = form.querySelector('[name="price"]');
                    const priceValue = priceInput.value;
                    const quantityInput = form.querySelector('[name="quantity"]');
                    const quantityValue = quantityInput.value;
                    const descriptionInput = form.querySelector('[name="description"]');
                    const descriptionValue = descriptionInput.value;
                    

                    if (/^\s*$/.test(nameValue)) {
                        event.preventDefault();
                        event.stopPropagation();
                        nameInput.value='';
                        const alertMessage='Name cannot be just spaces.';
                        showAlert(alertMessage);
                        return;
                    }
                    if (/^\s*$/.test(quantityValue)) {
                        event.preventDefault();
                        event.stopPropagation();
                        quantityInput.value='';
                        const alertMessage='Quantity cannot be just spaces.';
                        showAlert(alertMessage);
                        return;
                    }

                    if (/^\s*$/.test(descriptionValue)) {
                        event.preventDefault();
                        event.stopPropagation();
                        quantityInput.value='';
                        const alertMessage='Description cannot be just spaces.';
                        showAlert(alertMessage);
                        return;
                    }

                    if (/^\s*$/.test(priceValue) || isNaN(priceValue)) {
                        event.preventDefault();
                        event.stopPropagation();
                        priceInput.value='';
                        const alertMessage='Price cannot be just spaces, and it must be a valid number.';
                        showAlert(alertMessage);
                        return;
                    }

                    const numericPrice = parseFloat(priceValue);
                    if (numericPrice < 500 || numericPrice > 100000) {
                        event.preventDefault();
                        event.stopPropagation();
                        const alertMessage = 'Price must be between 500 and 100,000.';
                        showAlert(alertMessage);
                        return;
                    }

                    const quantityParse = parseFloat(quantityValue);
                    if (quantityParse < 1 || quantityParse > 100000) {
                        event.preventDefault();
                        event.stopPropagation();
                        const alertMessage='Quantity must be between 1 and 100,000.';
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
