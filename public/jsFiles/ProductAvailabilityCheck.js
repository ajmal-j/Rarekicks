const proceedToPaymentButton = document.getElementById("proceedToPaymentButton");
const notAvailableShow = document.getElementById("notAvailableShow");
if(checkProductAvailability){
    proceedToPaymentButton.style.display = 'block';
}else{
    showAlert('Remove Unavailable Products')
    notAvailableShow.style.display='block';
}