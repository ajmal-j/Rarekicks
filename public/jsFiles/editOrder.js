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

            const pinCodeInput = form.querySelector('[name="pinCode"]');
            const pinCodeValue = pinCodeInput.value.trim();

            const addressInput = form.querySelector('[name="address"]');
            const addressValue = addressInput.value.trim();

            const landmarkInput = form.querySelector('[name="landmark"]');
            const landmarkValue = landmarkInput.value.trim();

            const cityInput = form.querySelector('[name="city"]');
            const cityValue = cityInput.value.trim();
            
            const emailInput = form.querySelector('[name="email"]');
            const emailValue = emailInput.value.trim();
            
            const stateInput = form.querySelector('[name="state"]');
            const stateValue = stateInput.value.trim();
            
            const countryInput = form.querySelector('[name="country"]');
            const countryValue = countryInput.value.trim();
            
            const paymentMethodInput = form.querySelector('[name="paymentMethod"]');
            const paymentMethodValue = paymentMethodInput.value.trim();
            
            const offerInput = form.querySelector('[name="offer"]');
            const offerValue = offerInput.value.trim();
            
            const totalAmountInput = form.querySelector('[name="totalAmount"]');
            const totalAmountValue = totalAmountInput.value.trim();

            const paidAmountInput = form.querySelector('[name="paidAmount"]');
            const paidAmountValue = paidAmountInput.value.trim();
            if (nameValue === '') {
                showAlert('Please enter a name.');
                return;
            }

            if (/\d/.test(nameValue)) {
            showAlert('Name cannot contain numbers.');
            return;
            }

            if (contactValue === '' || isNaN(contactValue) || contactValue.length >12 || contactValue.length < 10) {
                showAlert('Please enter a valid contact number.');
                return;
            }


            if (pinCodeValue === '' || pinCodeValue.length < 5 || pinCodeValue.length > 10 || isNaN(pinCodeValue)) {
                showAlert('Please enter a valid pin code.');
                return;
            }
            if (stateValue === '' || stateValue.length < 2 || stateValue.length > 20 || !isNaN(stateValue)) {
                showAlert('Please enter a valid State.');
                return;
            }
            
            if (countryValue === '' || countryValue.length < 2 || countryValue.length > 20 || !isNaN(countryValue)) {
                showAlert('Please enter a valid Country.');
                return;
            }

            if (paymentMethodValue === '' || paymentMethodValue.length < 5 || paymentMethodValue.length > 20 || !isNaN(paymentMethodValue)) {
                showAlert('Please enter a valid payment method.');
                return;
            }
            
            if (paidAmountValue === '' || paidAmountValue.length < 1 || paidAmountValue.length > 20 || isNaN(paidAmountValue)) {
                showAlert('Please enter a valid amount.');
                return;
            }
            
            if (totalAmountValue === '' || totalAmountValue.length < 1 || totalAmountValue.length > 20 || isNaN(totalAmountValue)) {
                showAlert('Please enter a valid amount.');
                return;
            }
            if (offerValue === ''  || offerValue.length > 20 ) {
                showAlert('Please enter a valid offer input.');
                return;
            }


            if (addressValue === '') {
                showAlert('Please enter an address.');
                return;
            }

            if (/^\d+$/.test(addressValue)) {
                showAlert('Address cannot contain only numbers.');
                return;
            }
            if (addressValue.length>200) {
                showAlert('Address is too long.');
                return;
            }


            if (emailValue === '') {
                showAlert('Please enter a valid email.');
                return;
            }

            if (/^\d+$/.test(emailValue)) {
                showAlert('Email cannot contain only numbers.');
                return;
            }
            if (emailValue.length>200) {
                showAlert('Email is too long.');
                return;
            }

            if (landmarkValue === '') {
                showAlert('Please enter a landmark.');
                return;
            }
            if (/^\d+$/.test(landmarkValue)) {
            showAlert('Landmark cannot contain only numbers.');
            return;
            }
            if (landmarkValue.length>200) {
            showAlert('Landmark is too long.');
            return;
            }
            if (cityValue === '') {
                showAlert('Please enter a city.');
                return;
            }
            if (/^\d+$/.test(cityValue)) {
            showAlert('City cannot contain only numbers.');
            return;
            }
            if (cityValue.length>2000) {
            showAlert('City cannot contain only numbers.');
            return;
            }
            if (!form.checkValidity()) {
                return;
            }

            try {
                const response = await fetch(`/admin/editOrder?country=${countryValue}&state=${stateValue}&name=${nameValue}&contact=${contactValue}&pinCode=${pinCodeValue}&address=${addressValue}&landmark=${landmarkValue}&city=${cityValue}&offer=${offerValue}&totalAmount=${totalAmountValue}&paidAmount=${paidAmountValue}&orderId=${orderId}&paymentMethod=${paymentMethodValue}&email=${emailValue}`);
                const data = await response.json();
                console.log(data)
                if(data.updated===true){
                    showAlert("Updating")
                    clearForm(form);
                    window.location.href = '/admin/orderDetailed?id='+orderId;
                }else if(data.updated===false){
                    showAlert("Not Updated")
                }else{
                    showAlert("Error")
                }
            } catch (error) {
                showAlert("blalalalalalalala")
                console.error("Error checking category:", error);
            }
        });

        form.classList.add('was-validated');
    }, false);
})();
function clearForm(form) {
    // Iterate through all form elements
    Array.from(form.elements).forEach(element => {
        // Check if the element is an input field and not a submit button
        if (element.tagName === 'INPUT' && element.type !== 'submit') {
            element.value = ''; // Reset the value
        }
    });

    // Reset any additional form properties if needed
    form.reset();
}
