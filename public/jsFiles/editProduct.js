(() => {
    'use strict';
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit',async event => {
            event.preventDefault();
            const nameInput = form.querySelector('[name="name"]');
            const nameValue = nameInput.value;
            const categoryInput = form.querySelector('[name="category"]');
            const categoryValue = categoryInput.value;
            const priceInput = form.querySelector('[name="price"]');
            const priceValue = priceInput.value;
            const quantityInput = form.querySelector('[name="quantity"]');
            const quantityValue = quantityInput.value;
            const descriptionInput = form.querySelector('[name="description"]');
            const descriptionValue = descriptionInput.value;
            const discountPercentageInput = form.querySelector('[name="discountPercentage"]');
            const discountPercentageValue = discountPercentageInput.value;
            

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
            if (/^\s*$/.test(discountPercentageValue) || isNaN(discountPercentageValue)) {
                event.preventDefault();
                event.stopPropagation();
                const alertMessage='Discount cannot be just spaces, and it must be a valid number.';
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
            const numericDiscountPercentage= parseFloat(discountPercentageValue);
            if (numericDiscountPercentage < 0 || numericDiscountPercentage > 80) {
                event.preventDefault();
                event.stopPropagation();
                const alertMessage = 'Discount must be between 0 and 80.';
                showAlert(alertMessage);
                return;
            }

            const quantityParse = parseFloat(quantityValue);
            if (quantityParse < 0 || quantityParse > 100000) {
                event.preventDefault();
                event.stopPropagation();
                const alertMessage='Quantity must be between 1 and 100,000.';
                showAlert(alertMessage);
                return;
            }


            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            try {
                const response = await fetch(`/admin/checkDiscount?discount=${numericDiscountPercentage}&id=${id}&category=${categoryValue}&name=${nameValue}`);
                const data = await response.json();
                if(data.name==='exist'){
                    showAlert("Product Already Exist.!")
                }
                else if (data.discount === "true") {
                    document.querySelector(".loading-screen").style.display = "flex";
                    event.target.submit()
                } else if (data.discount==="false"){
                    showAlert("Total Discount is More than 80 Max("+data.select+")");
                }else{
                    showAlert("Error")
                }
            } catch (error) {
                console.log(error);
            }
            form.classList.add('was-validated');
        }, false);
        form.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();  // Add this line
                form.dispatchEvent(new Event('submit'));
            }
        });
    });
})();

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".loading-screen").style.display = "none";
});
