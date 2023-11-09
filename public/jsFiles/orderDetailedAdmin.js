const statusButton=document.querySelector('.statusButton');
function changeStatus(newStatus) {
    fetch('/admin/change?id='+id+'&status='+newStatus)
    .then(response => response.json())
    .then(data => {
        if(data.changed){
          showSuccess("Status Changed To "+newStatus)
          statusButton.textContent=newStatus;
          location.reload();
        }else{
          showAlert("no")
        }
    })
    .catch(error => {
      console.error('Error updating status:', error);
    });
  }

document.addEventListener('DOMContentLoaded',()=>{
  // const cancelButton=document.querySelector('.cancelButton');
  const deleteButton=document.querySelector('.deleteButton');
  // const orderId=cancelButton.id;
  const id=deleteButton.id;
  // cancelButton.addEventListener('click',()=>{
  //   fetch('/user/cancelOrder?id='+orderId).then(response=>response.json()).then(
  //     data=>{
  //       if(data.cancelled==='shipped'){
  //         showAlert("Product Is Already Shipped")
  //       }else if(data.cancelled==='already'){
  //         showAlert("Already Cancelled!")
  //       }else if(data.cancelled==='Out of Delivery'){
  //         showAlert("Product Is Out Of Delivery")
  //       }
  //       else if (data.cancelled===true){
  //         cancelButton.textContent="Order Cancelled"
  //         showSuccess("Order Cancelled")
  //         window.location.href="/admin/allOrders"
  //       }else{
  //         showAlert("Not Cancelled Error Ocurred")
  //       }
  //     }
  //   ).catch(err=>{
  //     console.log("Order cancellation error"+err);
  //   })
  // })
  deleteButton.addEventListener('click',()=>{
    fetch('/admin/deleteOrder?id='+id).then(response=>response.json()).then(
      data=>{
        if(data.deleted===true){
          showAlert("Deleting Order")
          window.location.href = '/admin/allOrders';
        }else{
          showAlert("Not deleted Error Ocurred")
        }
      }
    ).catch(err=>{
      console.log("Order cancellation error"+err);
    })
  })


})
