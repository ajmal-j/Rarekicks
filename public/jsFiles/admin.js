
const showHideButton=document.querySelectorAll('.showHideButton');

showHideButton.forEach(button=>{
  button.addEventListener('click',()=>{
    const id=button.id;
    fetch('/admin/blockUser?id='+id).then(response=>response.json()).then(data=>{
      if(data.user==='blocked'){
        showAlert('User Blocked')
        button.innerHTML='<i class="bi bi-eye-slash"></i>';
      }else if(data.user==='show'){
        showSuccess('User Unblocked')
        button.innerHTML='<i class="bi bi-eye"></i>';
      }else{
        showAlert("Internal Server Error")
      }
    }).catch(error=>{
      console.log(error)
    })
  })
})