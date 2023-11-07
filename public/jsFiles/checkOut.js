const clearCouponButton = document.getElementById('clearCouponButton');

clearCouponButton.addEventListener("click", () => {
    const totalAmount = document.getElementById("totalAmount"); 
    const totalPrice = document.querySelector(".totalPrice"); 
    const codeInput = document.querySelector(".codeInput"); 
    const appliedCoupon = document.querySelector('.appliedCoupon');
    const validSpan= document.getElementById('validSpan');
    const value=appliedCoupon.value;
    if(appliedCoupon.value){
        const tableBody = document.querySelector('.table tbody');
        tableBody.removeChild(tableBody.children[2]);
    }
    validSpan.innerHTML='&nbsp;';
    applyCouponButton.textContent="Apply"
    totalAmount.textContent = grandTotal;
    totalPrice.textContent =grandTotal ;
    codeInput.value = '';
    appliedCoupon.value = '';
    discount=0;
    couponTotal=0;
    handleWalletCheckbox()
});

let discount;
(() => {
    'use strict';
    
    const forms = document.querySelectorAll('.needs-validation');
    const validSpan=document.querySelector(".validSpan");
    let couponTotal;
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', async event => {
            event.preventDefault();
                const totalAmount=document.getElementById("totalAmount")
                const totalPrice=document.getElementById("totalPrice")
                const applyCouponButton=document.getElementById("applyCouponButton")
                const codeInput = form.querySelector('[name="code"]');
                const codeValue = codeInput.value.toUpperCase().trim();
                const appliedCoupon=form.querySelector('[name="appliedCoupon"]');
                const discountTable = document.getElementById('discountTable');
                if (codeValue === '' || !isNaN(codeValue) || codeValue.length > 15 || codeValue.length < 4) {
                    showAlert('Please enter a valid code.');
                    form.classList.add('was-validated'); // Add 'was-validated' class
                    return;
                }

                if (!form.checkValidity()) {
                    form.classList.add('was-validated'); // Add 'was-validated' class
                    return;
                }
                if(parseInt(totalAmount.innerText)<1){
                    showAlert("Cannot Apply Coupon!")
                    return;
                }
                try {
                    const response = await fetch(`/user/addCoupon?code=${codeValue}`);
                    const data = await response.json();
                    if (data.added === "expired") {
                        couponTotal=0;
                        showAlert('Coupon is expired!');
                        validSpan.textContent="Coupon Expired!"
                    } else if (data.added === "added") {
                        applyCouponButton.textContent="Applied"
                        discount=data.discount.toFixed(2)
                        if(appliedCoupon.value){
                            const tableBody = document.querySelector('.table tbody');
                            tableBody.removeChild(tableBody.children[2]);
                        }
                        // Create a new row
                        const newRow = document.createElement('tr');

                        // Create the first cell (Discount)
                        const discountCell1 = document.createElement('td');
                        discountCell1.textContent = 'Discount'+' (' +data.discountPercentage+"%)";
                        discountCell1.style.fontWeight = 'bold';

                        // Create the second cell (Discount value)
                        const discountCell2 = document.createElement('td');
                        discountCell2.classList.add('ps-2');
                        discountCell2.textContent = '-₹ '+discount;

                        // Append cells to the new row
                        newRow.appendChild(discountCell1);
                        newRow.appendChild(discountCell2);

                        // Append the new row to the table body
                        const tableBody = document.querySelector('.table tbody');
                        tableBody.insertBefore(newRow, tableBody.children[2]); // Insert before the 3rd row
                        couponTotal=data.grandTotal.toFixed(2);
                        totalAmount.innerText=data.grandTotal.toFixed(2);
                        totalPrice.innerText=data.grandTotal.toFixed(2);
                        appliedCoupon.value=codeValue;
                        validSpan.innerHTML = '&nbsp;';
                        showSuccess('Coupon Applied!');
                    } else if (data.added === "not") {
                        applyCouponButton.textContent="Apply"
                        couponTotal=0;
                        if(appliedCoupon.value){
                            const tableBody = document.querySelector('.table tbody');
                            tableBody.removeChild(tableBody.children[2]);
                        }
                        discount=0;
                        appliedCoupon.value=""
                        totalAmount.innerText=grandTotal
                        totalPrice.innerText=grandTotal
                        validSpan.textContent="Not A Valid Coupon!"
                        showAlert('Not A Valid Coupon!');
                    } else if (data.added === false) {
                        couponTotal=0;
                        applyCouponButton.textContent="Apply"
                        showSuccess('Not Added');
                    }
                } catch (error) {
                    console.error("Error checking category:", error);
                }
            });

            // Remove the 'was-validated' class from here
        });
    })();
    function handleWalletCheckbox() {
        var checkbox = document.getElementById("walletCheckbox");
        var amountElement = document.getElementById("walletAmount");
        var usedWallet = document.getElementById("usedWallet");
        var totalAmount = document.getElementById("totalAmount");

        if (checkbox && amountElement && usedWallet && totalAmount) {
            let total = parseInt(totalAmount.innerText);

            if (checkbox.checked) {
                const deductionAmount = total > walletBalance ? walletBalance : total;
                const balance = walletBalance - deductionAmount;
                amountElement.textContent = balance > 0 ? balance : 0;
                usedWallet.textContent = deductionAmount;
                totalAmount.textContent=total-deductionAmount;
            } else {
                amountElement.textContent = walletBalance;
                usedWallet.textContent = 0;
                totalAmount.textContent=grandTotal
            }
        } else {
            console.error("One or more elements not found.");
        }
    }
