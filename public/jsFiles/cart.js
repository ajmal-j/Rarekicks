document.addEventListener('DOMContentLoaded', () => {
    const addToWishlistButtons = document.querySelectorAll('.addToWishlist');
    const addToCartButtons = document.querySelectorAll('.addToCart');
    const sizeButtons = document.querySelectorAll('.size-button');
    const clearSizesButtons = document.querySelectorAll('.clearSizesButton');
    const removeCartButton = document.querySelectorAll('.removeFromCart');
    const increaseButton = document.querySelectorAll('.increaseQuantity');
    const decreaseButton = document.querySelectorAll('.decreaseQuantity');
    const totalButton = document.querySelector('.totalPrice');
    const wishCount = document.getElementById("wishCount");
    const cartCount = document.getElementById("cartCount");
    const selectedSizes = {};

    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sizeValue = button.getAttribute('data-size');
            const productId = button.getAttribute('data-product-id');
            selectedSizes[productId] = selectedSizes[productId] || {};
            const productSizeButtons = document.querySelectorAll(`[data-product-id="${productId}"]`);
            productSizeButtons.forEach(otherButton => {
                if (otherButton.classList.contains('selected-size')) {
                    otherButton.classList.remove('selected-size');
                }
            });
            if (!button.classList.contains('selected-size')) {
                button.classList.add('selected-size');
            } else {
                button.classList.remove('selected-size');
            }
            selectedSizes[productId].size = sizeValue;
        });
    });

    clearSizesButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-product-id');
            if(selectedSizes[productId]){
                selectedSizes[productId].size = null;
            }
            const productSizeButtons = document.querySelectorAll(`.size-button[data-product-id="${productId}"]`);
            productSizeButtons.forEach(sizeButton => {
                if (sizeButton.classList.contains('selected-size')) {
                    sizeButton.classList.remove('selected-size');
                }
            });

        });
    });

    addToWishlistButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = button.id;
            const encodedProductId = encodeURIComponent(productId);
            fetch('/user/addToWishlist?id=' + encodedProductId)
                .then(response => response.json())
                .then(data => {
                    if (data.added) {
                        showSuccess("Added To Wishlist");
                        button.innerHTML = '<i class="bi bi-heart-fill ms-2" style="font-size:40px;"></i>';
                        let count=parseInt(wishCount.innerText)
                        count++;
                        wishCount.innerText=count
                    } else {
                        button.innerHTML = '<i class="bi bi-heart ms-2" style="font-size:40px;"></i>';
                        showAlert("Removed from Wishlist");
                        let count=parseInt(wishCount.innerText)
                                        count--;
                                        wishCount.innerText=count
                                        const currentUrl = window.location.href;
                                        const url=currentUrl.split('/')
                                        if(url[url.length-1]==='wishlist'){
                                            const wishlistCont=document.getElementById(`wishlistCont${encodedProductId}`);
                                            wishlistCont.classList.add('removed');
                                            const wishlistContainerAll = document.querySelectorAll(".wishlistContainerAll");
                                            if(wishlistContainerAll.length===1){
                                                window.location.reload()
                                            }else{
                                                setTimeout(function() {
                                                    wishlistCont.remove();
                                                }, 500);
                                            }
                                        }
                    }
                })
                .catch(error => {
                    console.error("Error checking category:", error);
                });
                
        });
    });

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = button.id;
            const encodedProductId = encodeURIComponent(productId);
            fetch('/user/addToCart?id=' + encodedProductId + '&size=' + selectedSizes[productId]?.size)
                .then(response => response.json())
                .then(data => {
                    if(data.added==="size"){
                        showAlert("Please Select A Size!");
                    }
                    else if(data.added==="already"){
                        showAlert("Item Is Already In the Cart!");
                    }
                    else if (data.added) {
                        showSuccess("Added To Cart");
                        button.firstElementChild.textContent = 'Added To Cart';
                        let cartCountValue=parseInt(cartCount.textContent);
                        cartCountValue++;
                        cartCount.textContent=cartCountValue;
                    } else {
                        button.firstElementChild.textContent = 'Removed from Cart';
                        let cartCountValue=parseInt(cartCount.textContent);
                        cartCountValue--;
                        cartCount.textContent=cartCountValue;
                        showAlert("Removed from Cart");
                    }
                })
                .catch(error => {
                    console.error("Error checking category:", error);
                });
        });
    });


    removeCartButton.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            Swal.fire({
                title: 'Are you sure?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#D2122E',
                cancelButtonColor: '#720e9e',
                confirmButtonText: 'Remove!'
              }).then((result) => {
                if (result.isConfirmed) {
                    const productId = button.id;
                    const encodedProductId = encodeURIComponent(productId);
                    fetch('/user/removeFromCart?id=' + encodedProductId)
                        .then(response => response.json())
                        .then(data => {
                            if (data.removed) {
                                showSuccess("Added To Cart");
                                button.firstElementChild.textContent = 'added';
                            } else {
                                button.firstElementChild.textContent = 'removed';
                                showAlert("Removed from Cart");
                                totalButton.innerText=data.total;
                                let cartCountValue=parseInt(cartCount.textContent);
                                cartCountValue--;
                                cartCount.textContent=cartCountValue;
                                const productContainer = document.querySelectorAll(".productContainer");
                                if(productContainer.length===1){
                                    window.location.reload()
                                }else{
                                    const product=document.getElementById(`product${productId}`)
                                    product.remove();
                                    window.location.reload();
                                }
                                
                            }
                        })
                        .catch(error => {
                            console.error("Error checking category:", error);
                        });
                }
              });
            });
            
        });

    increaseButton.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = button.id;
            const encodedProductId = encodeURIComponent(productId);
            const subTotal=document.getElementById(productId+'subTotal')
            const quantityDisplay = button.previousElementSibling;
            let currentQuantity = parseInt(quantityDisplay.textContent);
            if(currentQuantity===5){
                showAlert("Maximum 5 Product!")
                return
            }
            fetch('/user/increaseQuantity?id=' + encodedProductId)
                .then(response => response.json())
                .then(data => {
                    if (data.updated==="maximum") {
                        showAlert("Maximum 5 Products");
                    }else if(data.updated==="stock"){
                        let currentQuantity = parseInt(quantityDisplay.textContent);
                        showAlert("Only " +currentQuantity + " left")
                    } 
                    else {
                        if (quantityDisplay) {
                            let currentQuantity = parseInt(quantityDisplay.textContent);
                            currentQuantity++;
                            quantityDisplay.textContent = currentQuantity;
                            const price = parseInt(data.price);
                            subTotal.innerText = (price*currentQuantity);
                            totalButton.innerText=data.total;
                        }
                    }
                })
                .catch(error => {
                    console.error("Error checking category:", error);
                });
        });
    });
    decreaseButton.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = button.id;
            const encodedProductId = encodeURIComponent(productId);
            const subTotal=document.getElementById(productId+'subTotal')
            const quantityDisplay = button.nextElementSibling.nextElementSibling;
            let currentQuantity = parseInt(quantityDisplay.textContent);
            if(currentQuantity===1){
                // showAlert("Minimum 1 Product!")
                return
            }
            fetch('/user/decreaseQuantity?id=' + encodedProductId)
                .then(response => response.json())
                .then(data => {
                    if (data.updated==="minimum") {
                        showAlert("Minimum 1 Product")
                    } else {
                        if (quantityDisplay) {
                            let currentQuantity = parseInt(quantityDisplay.textContent);
                            currentQuantity--;
                            quantityDisplay.textContent = currentQuantity;
                            const price = parseInt(data.price);
                            subTotal.innerText = (price*currentQuantity);
                            totalButton.innerText=data.total;
                        }
                    }
                })
                .catch(error => {
                    console.error("Error checking category:", error);
                });
        });
    });
});
