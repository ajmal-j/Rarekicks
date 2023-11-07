  document.addEventListener('DOMContentLoaded',()=>{
    const cancelButton=document.querySelector('.cancelButton');
    const select=document.getElementById('exampleFormControlSelect1')
    const orderId=cancelButton.id;
    cancelButton.addEventListener('click',(e)=>{
      e.preventDefault()
        Swal.fire({
          title: 'Confirm  Cancel!',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#03C03C',
          cancelButtonColor: '#D2122E',
          confirmButtonText: 'Confirm'
        }).then(async (result) => {
          if (result.isConfirmed) {
            fetch('/user/cancelOrder?id='+orderId+"&option="+select.value).then(response=>response.json()).then(
              data=>{
                if(data.cancelled==='shipped'){
                  showAlert("Product Is Already Shipped")
                }else if(data.cancelled==='Out of Delivery'){
                  showAlert("Product Is Out Of Delivery")
                }
                else if(data.cancelled==='already'){
                  showAlert("Already Cancelled!")
                }else if (data.cancelled===true){
                  cancelButton.textContent="Order Cancelled"
                  window.location.href="/user/orders"
                  showSuccess("Order Cancelled")
                }else{
                  showAlert("Not Cancelled Error Ocurred")
                }
              }
            ).catch(err=>{
              console.log("Order cancellation error"+err);
            })
          }
        })
     
    })
  })
  document.addEventListener('DOMContentLoaded',()=>{
    const returnButton=document.querySelector('.returnButton');
    const option=document.getElementById('returnReasonSelect')
    const orderId=returnButton.id;
    returnButton.addEventListener('click',(e)=>{
      e.preventDefault()
        Swal.fire({
          title: 'Confirm  Return!',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#D2122E',
          cancelButtonColor: '#03C03C',
          confirmButtonText: 'Confirm'
        }).then(async (result) => {
          if (result.isConfirmed) {
            fetch('/user/returnOrder?id='+orderId+"&reason="+option.value).then(response=>response.json()).then(
              data=>{
                if(data.returned==='not'){
                  showAlert("Product Not Returned")
                }else if(data.returned==='Out of Delivery'){
                  showAlert("Product Is Out Of Delivery")
                }
                else if(data.returned==='already'){
                  showAlert("Already returned!")
                }else if (data.returned==="yes"){
                  returnButton.textContent="Order Returned"
                  window.location.href="/user/orders"
                  showSuccess("Order Returned")
                }else{
                  showAlert("Not Returned Error Ocurred")
                }
              }
            ).catch(err=>{
              console.log("Order cancellation error"+err);
            })
          }
        })
    })
  })