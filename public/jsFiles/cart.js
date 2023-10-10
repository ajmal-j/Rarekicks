document.addEventListener('DOMContentLoaded', () => {
    const addToWishlistButtons = document.querySelectorAll('.addToWishlist');
    const addToCartButtons = document.querySelectorAll('.addToCart');
    const sizeButtons = document.querySelectorAll('.size-button');
    const clearSizesButtons = document.querySelectorAll('.clearSizesButton');
    const removeCartButton = document.querySelectorAll('.removeFromCart');
    const increaseButton = document.querySelectorAll('.increaseQuantity');
    const decreaseButton = document.querySelectorAll('.decreaseQuantity');
    const totalButton = document.querySelector('.totalPrice');
   
    const selectedSizes = {};

    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('Button clicked');

            const sizeValue = button.getAttribute('data-size');
            const productId = button.getAttribute('data-product-id');

            // Initialize the selectedSizes object for the product if not already initialized
            selectedSizes[productId] = selectedSizes[productId] || {};

            // Deselect all size buttons for the specific product
            const productSizeButtons = document.querySelectorAll(`[data-product-id="${productId}"]`);
            productSizeButtons.forEach(otherButton => {
                if (otherButton.classList.contains('selected-size')) {
                    otherButton.classList.remove('selected-size');
                }
            });

            // Toggle the 'selected-size' class for the clicked button
            if (!button.classList.contains('selected-size')) {
                button.classList.add('selected-size');
            } else {
                button.classList.remove('selected-size');
            }

            // Update the selected size for the specific product
            selectedSizes[productId].size = sizeValue;

            // Update the selected size display for the specific product
            updateSelectedSizes(productId);
        });
    });

    clearSizesButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('Clear Sizes Button clicked');

            const productId = button.getAttribute('data-product-id');

            // Clear selected size for the specific product
            selectedSizes[productId].size = null;

            // Clear the 'selected-size' class for all size buttons of the specific product
            const productSizeButtons = document.querySelectorAll(`.size-button[data-product-id="${productId}"]`);
            productSizeButtons.forEach(sizeButton => {
                if (sizeButton.classList.contains('selected-size')) {
                    sizeButton.classList.remove('selected-size');
                }
            });

            // Update the selected size display for the specific product
            updateSelectedSizes(productId);
        });
    });

    function updateSelectedSizes(productId) {
        console.log(`Updating selected size for product ${productId}`);

        // Update the text content within the respective product container
        const selectedSizesDiv = document.getElementById(`selectedSizes_${productId}`);
        selectedSizesDiv.textContent = `Selected Size: ${selectedSizes[productId]?.size || 'None'}`;
    }



    addToWishlistButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = button.id;
            const encodedProductId = encodeURIComponent(productId);
            // Send the selected size along with the product ID to the backend
            fetch('/user/addToWishlist?id=' + encodedProductId)
                .then(response => response.json())
                .then(data => {
                    if (data.added) {
                        showSuccess("Added To Wishlist");
                        button.innerHTML = '<i class="bi bi-heart-fill ms-2" style="font-size:40px;"></i>';
                    } else {
                        button.innerHTML = '<i class="bi bi-heart ms-2" style="font-size:40px;"></i>';
                        showAlert("Removed from Wishlist");
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

            // Send the selected size along with the product ID to the backend
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
                    } else {
                        button.firstElementChild.textContent = 'Removed from Cart';
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
                        location.reload()
                    }
                })
                .catch(error => {
                    console.error("Error checking category:", error);
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
            fetch('/user/increaseQuantity?id=' + encodedProductId)
                .then(response => response.json())
                .then(data => {
                    if (data.updated==="maximum") {
                        showAlert("Maximum");
                    } else {
                        if (quantityDisplay) {
                            let currentQuantity = parseInt(quantityDisplay.textContent);
                            currentQuantity++;
                            quantityDisplay.textContent = currentQuantity;
                            subTotal.innerText=(data.price*currentQuantity)
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
            fetch('/user/decreaseQuantity?id=' + encodedProductId)
                .then(response => response.json())
                .then(data => {
                    if (data.updated==="minimum") {
                        showAlert("Minimum 1")
                    } else {
                        if (quantityDisplay) {
                            let currentQuantity = parseInt(quantityDisplay.textContent);
                            currentQuantity--;
                            quantityDisplay.textContent = currentQuantity;
                            subTotal.innerText=(data.price*currentQuantity)
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
