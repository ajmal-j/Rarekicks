function clickEvent(event) {
    event.preventDefault()
        const messageInput = document.getElementById('messageInput');
        const reviewId=messageInput.getAttribute('reviewId');
        const productId=messageInput.getAttribute('productId');
        const reply = messageInput.value;
        if(reply.length>5){
            fetch('/user/addComment',{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body:JSON.stringify({
                    reply,
                    reviewId,
                    productId
                })
            }).then(response=>response.json())
            .then(data=>{
                if(data.added==="true"){
                    showSuccess("posted")
                }else{
                    showAlert('Not Posted')
                }
            }).catch(error=>{
                showAlert("Oppps Internal Server Error!")
                console.log(error);
            })
        }else{
            showAlert("Enter Minimum 5 Characters")
        }
};
