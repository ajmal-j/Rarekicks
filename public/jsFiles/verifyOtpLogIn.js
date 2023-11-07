    const OtpButton=document.querySelector('#startCountdownButton2');
    OtpButton.addEventListener('click',async function () {
        const emailInput=document.getElementById('emailInput');
        await fetch(`/user/resendOtp?email=${emailInput.value}`).then(response=>response.json()).then(data=>{
            if(data.sended==="true"){
                showSuccess("Otp Sended")
                localStorage.removeItem('countdownTime2');
                localStorage.setItem('countdownTime2', 600);
            }else{
                showAlert("Error Occurred")
            }
        })
    });




    document.getElementById('submit').addEventListener('click', function() {
       document.getElementById('counterInput').value = localStorage.getItem('countdownTime2');
     });
    

   (() => {
            'use strict'
            const forms = document.querySelectorAll('.needs-validation')
            Array.from(forms).forEach(form => {
                form.addEventListener('submit', event => {


                const passwordInput = form.querySelector('[name="otp"]');
                const passwordValue = passwordInput.value;


                if (passwordValue.length < 6) {
                    event.preventDefault();
                    event.stopPropagation();
                    const alertMessage='Enter a Valid Otp';
                    showAlert(alertMessage);
                    return;
                }
                if (/^\s*$/.test(passwordValue)) {
                        event.preventDefault();
                        event.stopPropagation();
                        const alertMessage='Otp cannot be just spaces.';
                        showAlert(alertMessage);
                        return;
                    }
               
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
                }, false)
            form.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                form.dispatchEvent(new Event('submit'));
            }
        });

})
})()

