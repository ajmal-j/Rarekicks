const descriptionCont = document.getElementById('descriptionCont');

descriptionCont.addEventListener('click', () => {
    descriptionCont.style.whiteSpace = descriptionCont.style.whiteSpace === 'normal' ? 'nowrap' : 'normal';
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
            console.log(formData)
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