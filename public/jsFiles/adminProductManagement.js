const showHideButton=document.querySelectorAll('.showHideButton');

showHideButton.forEach(button=>{
  button.addEventListener('click',()=>{
    const id=button.id;
    fetch('/admin/deleteProduct?id='+id).then(response=>response.json()).then(data=>{
      if(data.product==='hidden'){
        showAlert('Product Hidden')
        button.innerHTML='<i class="bi bi-eye-slash"></i>';
      }else if(data.product==='show'){
        showSuccess('Product Visible')
        button.innerHTML='<i class="bi bi-eye"></i>';
      }else{
        showAlert("Internal Server Error")
      }
    }).catch(error=>{
      console.log(error)
    })
  })
})