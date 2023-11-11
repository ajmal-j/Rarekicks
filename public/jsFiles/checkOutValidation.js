const clearCouponButton = document.getElementById('clearCouponButton');
clearCouponButton.addEventListener("click", () => {
    const totalAmount = document.getElementById("totalAmount"); 
    const totalPrice = document.querySelector(".totalPrice"); 
    const codeInput = document.querySelector(".codeInput"); 
    const appliedCoupon = document.querySelector('.appliedCoupon');
    const validSpan= document.getElementById('validSpan')
    if(appliedCoupon.value){
        const tableBody = document.querySelector('.table tbody');
        tableBody.removeChild(tableBody.children[2]);
    }
    validSpan.innerHTML='&nbsp;';
    applyCouponButton.textContent="Apply"
    totalAmount.textContent = grandTotal;
    totalPrice.textContent = grandTotal;
    codeInput.value = '';
    appliedCoupon.value = '';
    discount=0;
    couponTotal=0;
    handleWalletCheckbox()
});

    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 6); 
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = deliveryDate.toLocaleDateString('en-US', options);
    document.getElementById('deliveryDate').textContent = formattedDate;

    const placeOrderCOD=document.getElementById('placeOrderCOD');



    placeOrderCOD.addEventListener('click',async (e)=>{
        e.preventDefault()
        if(!addressLength){
            showAlert("Please Add A Address")
            return
        }
        Swal.fire({
        html: '<i class="fa-solid fa-truck-fast" style="font-size: 60px;"></i>',
          title: 'Confirm  Order 😊',
          showCancelButton: true,
          confirmButtonColor: '#03C03C',
          cancelButtonColor: '#D2122E',
          confirmButtonText: 'Confirm'
        }).then(async (result) => {
          if (result.isConfirmed) {
                const appliedCoupon=document.getElementById('appliedCoupon');
                const walletCheckbox=document.querySelector('.walletCheckbox')
                let checked=false;
                if(walletCheckbox.checked){
                    checked=true;
                }else{
                    checked=false;
                }
                try {
                    const response = await fetch(`/user/placeOrderCOD?code=${appliedCoupon.value}&wallet=${checked}`);
                    const data = await response.json();
                    if(data.data===true){
                        showSuccess("Creating Order")
                        window.location.href = '/user/showConfirmOrder?id='+data.orderId;
                    }else{
                        showAlert("Order Not Created!")
                    }
                } catch (error) {
                    console.log(error);
                    showAlert("Error While Check Out!")
                    window.location.reload()
                }
          }
        });

    });

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
                    return;
                }
                if (!form.checkValidity()) {
                    return;
                }
                try {
                    const response = await fetch(`/user/addCoupon?code=${codeValue}`);
                    const data = await response.json();
                    if (data.added === "expired") {
                        couponTotal=0;
                        applyCouponButton.textContent="Apply"
                        couponTotal=0;
                        if(appliedCoupon.value){
                            const tableBody = document.querySelector('.table tbody');
                            tableBody.removeChild(tableBody.children[2]);
                        }
                        discount=0;
                        appliedCoupon.value=""
                        totalAmount.innerText=grandTotal;
                        totalPrice.innerText=grandTotal;
                        handleWalletCheckbox()
                        validSpan.innerHTML='<span class="text-danger">Coupon Expired!</span>';
                    } else if (data.added === "added") {
                        applyCouponButton.textContent="Applied"
                        discount=data.discount.toFixed(2)
                        if(appliedCoupon.value){
                            const tableBody = document.querySelector('.table tbody');
                            tableBody.removeChild(tableBody.children[2]);
                        }
                        const newRow = document.createElement('tr');
                        const discountCell1 = document.createElement('td');
                        discountCell1.textContent = 'Discount'+' (' +data.discountPercentage+"%)";
                        discountCell1.style.fontWeight = 'bold';
                        const discountCell2 = document.createElement('td');
                        discountCell2.classList.add('ps-2');
                        discountCell2.textContent = '-₹ '+discount;
                        newRow.appendChild(discountCell1);
                        newRow.appendChild(discountCell2);
                        const tableBody = document.querySelector('.table tbody');
                        tableBody.insertBefore(newRow, tableBody.children[2]);
                        couponTotal=data.grandTotal.toFixed(2);
                        totalAmount.innerText=data.grandTotal.toFixed(2);
                        totalPrice.innerText=data.grandTotal.toFixed(2);
                        appliedCoupon.value=codeValue;
                        validSpan.innerHTML = '<span class="text-success">Coupon Applied!</span>';
                        handleWalletCheckbox()
                    } else if (data.added === "not") {
                        applyCouponButton.textContent="Apply"
                        couponTotal=0;
                        if(appliedCoupon.value){
                            const tableBody = document.querySelector('.table tbody');
                            tableBody.removeChild(tableBody.children[2]);
                        }
                        discount=0;
                        appliedCoupon.value=""
                        totalAmount.innerText=grandTotal;
                        totalPrice.innerText=grandTotal;
                        validSpan.innerHTML='<span class="text-danger">Not A Valid Coupon!</span>';
                        handleWalletCheckbox()
                    }else if (data.added === "minimum"){
                        applyCouponButton.textContent="Apply"
                        couponTotal=0;
                        if(appliedCoupon.value){
                            const tableBody = document.querySelector('.table tbody');
                            tableBody.removeChild(tableBody.children[2]);
                        }
                        discount=0;
                        appliedCoupon.value=""
                        totalAmount.innerText=grandTotal;
                        totalPrice.innerText=grandTotal;
                        validSpan.innerHTML=`<span class="text-danger">Coupon is valid for orders over ${data.min} !</span>`;
                        handleWalletCheckbox()
                    }else if(data.added === "maximum"){
                        applyCouponButton.textContent="Apply"
                        couponTotal=0;
                        if(appliedCoupon.value){
                            const tableBody = document.querySelector('.table tbody');
                            tableBody.removeChild(tableBody.children[2]);
                        }
                        discount=0;
                        appliedCoupon.value=""
                        totalAmount.innerText=grandTotal;
                        totalPrice.innerText=grandTotal;
                        validSpan.innerHTML=`<span class="text-danger">Coupon is valid for orders between ${data.min} and ${data.max}!</span>`;
                        handleWalletCheckbox()
                    }
                        else if (data.added === false) {
                        couponTotal=0;
                        validSpan.innerHTML='&nbsp;'
                        applyCouponButton.textContent="Apply"
                        showSuccess('Not Added');
                        handleWalletCheckbox()
                    }
                } catch (error) {
                    console.error("Error checking category:", error);
                }
            });
        });
    })();


    function handleWalletCheckbox() {
        var checkbox = document.getElementById("walletCheckbox");
        var amountElement = document.getElementById("walletAmount");
        var totalPrice=document.querySelector('.totalPrice')
        var usedWallet = document.getElementById("usedWallet");
        var totalAmount = document.getElementById("totalAmount");
        const payNowButton=document.querySelector('.payNowButton');
        const placeOrderCOD=document.querySelector('.placeOrderCOD');
        const placeOrderText=document.querySelector('.placeOrderText');
        if (checkbox && amountElement && usedWallet && totalAmount) {
            let total = grandTotal-discount;

            if (checkbox.checked) {
                const deductionAmount = total > walletBalance ? walletBalance : total;
                const balance = walletBalance - deductionAmount;
                amountElement.textContent = balance > 0 ? (balance).toFixed(2) : 0;
                usedWallet.textContent = deductionAmount.toFixed(2);
                totalAmount.textContent=(total-deductionAmount).toFixed(2);
                totalPrice.textContent=(total-deductionAmount).toFixed(0);
                if((total-deductionAmount)===0){
                    payNowButton.setAttribute('style', 'display: none !important;');
                    placeOrderCOD.setAttribute('style', 'display: none !important;');
                    placeOrderText.classList.remove('dashedBorder');
                }else{
                    payNowButton.style.display='block';
                    placeOrderCOD.style.display='block';
                    placeOrderText.classList.add('dashedBorder');
                }
            } else {
                amountElement.textContent = walletBalance.toFixed(2);
                usedWallet.textContent = 0;
                totalAmount.textContent=total.toFixed(2);
                totalPrice.textContent=total.toFixed(2);
                payNowButton.style.display='block';
                placeOrderCOD.style.display='block';
                placeOrderText.classList.add('dashedBorder');
            }
        } else {
            console.error("One or more elements not found.");
        }
    }


document.addEventListener('DOMContentLoaded',()=>{
    if(!productAvailability){
        showAlert('Some Product Is Not Available!');
        window.location.href='/user/cart'
    }
})