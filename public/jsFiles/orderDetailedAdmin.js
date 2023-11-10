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