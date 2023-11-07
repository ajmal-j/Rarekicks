    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 6); 
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = deliveryDate.toLocaleDateString('en-US', options);
    document.getElementById('deliveryDate').textContent = formattedDate;
    let timerInterval
        Swal.fire({
        title: 'Order Confirmed!',
        icon:"success",
        html: 'Thank you for shopping with us! Your order will be shipped soon.<br>',
        timer: 3000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
                 Swal.getTimerLeft()
            }, 2000)
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
        }).then((result) => {
        })