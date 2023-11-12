(() => {
    'use strict';
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', async event => {
            event.preventDefault();
            const nameInput = form.querySelector('[name="name"]');
            const nameValue = nameInput.value;
            const descriptionInput = form.querySelector('[name="description"]');
            const descriptionValue = descriptionInput.value;
            const discountPercentageInput = form.querySelector('[name="discountPercentage"]');
            const discountPercentageValue = discountPercentageInput.value;

            if (/^\s*$/.test(nameValue) || nameValue === '' || nameValue.length > 15) {
                showAlert('Enter a valid name.');
                return;
            }

            const discountValue = parseInt(discountPercentageValue);
            if (/^\s*$/.test(discountPercentageValue) || isNaN(discountValue) || discountValue > 80 || discountValue < 0) {
                showAlert('Enter a valid discount percentage between 0 and 80.');
                return;
            }

            try {
              const response = await fetch("/admin/createCategory", {
                  method: "POST",
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ name: nameValue, discountPercentage: discountPercentageValue ,description:descriptionValue }),
              }).then(response=>response.json()).then(data=>{
                if(data.category==="exist"){
                  showAlert(data.message)
                }else if(data.category==="true"){
                  showSuccess("Updating");
                  window.location.reload()
                }else{
                  showAlert("Error While Updating!!")
                }
              })
            } catch (error) {
                console.error('Error submitting the form:', error);
                showAlert('An error occurred while submitting the form.');
            }
        });
    });
})();


const showHideButton=document.querySelectorAll('.showHideButton');

showHideButton.forEach(button=>{
  button.addEventListener('click',()=>{
    const id=button.id;
    fetch('/admin/deleteCategory?id='+id).then(response=>response.json()).then(data=>{
      if(data.category==='hidden'){
        showAlert('Category Hidden')
        button.innerHTML='<i class="bi bi-eye-slash"></i>';
      }else if(data.category==='show'){
        showSuccess('Category Visible')
        button.innerHTML='<i class="bi bi-eye"></i>';
      }else{
        showAlert("Internal Server Error")
      }
    }).catch(error=>{
      console.log(error)
    })
  })
})