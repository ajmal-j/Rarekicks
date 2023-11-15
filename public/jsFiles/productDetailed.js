const descriptionCont = document.getElementById('descriptionCont');
const showMore = document.getElementById('showMore');

showMore.addEventListener('click', () => {
    if (descriptionCont.style.whiteSpace === 'normal') {
        showMore.innerText="show more."
        descriptionCont.style.whiteSpace = 'nowrap';
    } else {
        showMore.innerText="show less."
        descriptionCont.style.whiteSpace = 'normal';
    }
});

const addToWishlist = document.querySelector('.addToWishlistButton');
const wishCount = document.getElementById('wishCount');

addToWishlist.addEventListener('click', (e) => {
    e.preventDefault();
    productId=addToWishlist.id;
    const encodedProductId = encodeURIComponent(productId);
    fetch('/user/addToWishlist?id='+encodedProductId)
        .then(response => response.json())
        .then(data => {
            if (data.added) {
                showSuccess("Added To Wishlist");
                addToWishlist.innerHTML='<i class="bi bi-heart-fill ms-2" style="font-size:40px;"></i>';
                let count=parseInt(wishCount.innerText)
                count++;
                wishCount.innerText=count
            } else {
                addToWishlist.innerHTML='<i class="bi bi-heart ms-2" style="font-size:40px;"></i>';
                showAlert("Removed from Wishlist");
                let count=parseInt(wishCount.innerText)
                count--;
                wishCount.innerText=count
            }
        })
        .catch(error => {
            console.error("Error checking category:", error);
        });
});

document.getElementById('reviewForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const rating= document.querySelector('input[name="userReviewRating"]:checked');
    if(!rating){
        showAlert("Select A Rating")
        return 
    }
    const formData = {
        rating: document.querySelector('input[name="userReviewRating"]:checked').value,
        review: document.getElementById('userReview').value,
        productId:addToWishlist.id
    };
    
    fetch('/user/addReview', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        if(data.added==="notABuyer"){
            showAlert("You Are Not A Buyer To Add Review!")
        }
        else if(data.added===true){
            document.getElementById('reviewForm').reset();
            showSuccess("Review Posted")
            window.location.reload()
        }else if(data.added==="maximum"){
            showAlert("Maximum Limit Over")
        }else{
            showAlert("Not Added")
        }


    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
    });
});


document.addEventListener('DOMContentLoaded',()=>{
    const deleteReviewButton=document.querySelectorAll('.deleteReviewButton');
        deleteReviewButton.forEach(button=>{
            button.addEventListener('click',()=>{
                Swal.fire({
                    title: 'Delete Review?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: 'red',
                    cancelButtonColor: 'green',
                    confirmButtonText: 'Delete',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.isConfirmed) {
                        
                            const id=button.getAttribute('review_id');
                            const productId=button.getAttribute('product_id');
                            fetch(`/user/deleteReview?id=${id}&productId=${productId}`).then(response=>response.json())
                            .then(data=>{
                                if(data.deleted==="true"){
                                    showSuccess("Deleting Review");
                                    window.location.reload();
                                }else{
                                    showAlert('Not Deleted')
                                }
                            }).catch(error=>{
                                showAlert("Error Occurred");
                                console.log(error)
                            })
                    }
                });
        })
    })
})