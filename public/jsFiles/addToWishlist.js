const wishlistToggle=document.querySelectorAll('.wishlistToggle')
wishlistToggle.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = button.id;
        const encodedProductId = encodeURIComponent(productId);
        fetch('/user/addToWishlist?id=' + encodedProductId)
            .then(response => response.json())
            .then(data => {
                if (data.added) {
                    showSuccess("Added To Wishlist");
                    button.innerHTML = '<i class="bi bi-heart-fill" style="font-size:40px;"></i>';
                    let count=parseInt(wishCount.innerText)
                    count++;
                    wishCount.innerText=count
                } else {
                    button.innerHTML = '<i class="bi bi-heart" style="font-size:40px;"></i>';
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
});