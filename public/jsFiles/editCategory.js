document.addEventListener("DOMContentLoaded", function () {
    'use strict';

    const form = document.querySelector(".needs-validation");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const categoryNameInput = document.getElementById("product_name");
        const categoryName = categoryNameInput.value;
        const category = categoryName.trim();
        const discountPercentageInput = document.getElementById("discountPercentage");
        const discountPercentage = discountPercentageInput.value;
        const dis = discountPercentage.trim();
        const discount=parseInt(dis);
        if (/^\s*$/.test(categoryName)) {
            document.querySelector(".error-span").textContent = 'Category name cannot be just spaces.';
            categoryNameInput.focus();
            return;
        }
        if (/^\s*$/.test(discount) || isNaN(discount) || discount > 80 || discount < 0) {
            showAlert('Enter a valid discount percentage between 0 and 80.');
            return;
        }
        // Add additional form validation conditions as needed

        fetch('/admin/checkCategory?name=' + category+"&id=" +id+"&discount="+discount)
            .then(response => response.json())
            .then(data => {
                if(data.maximum==="true"){
                    document.querySelector(".errorSpan").textContent = "Total Discount of Some of the Product is More than 80. Max("+data.max+")";
                }else if (data.exists) {
                    document.querySelector(".error-span").textContent = "Category name already exists";
                    categoryNameInput.focus();
                } else {
                    document.querySelector(".error-span").innerHTML = '&nbsp;';
                    if (form.checkValidity()) {
                        showSuccess("Updating")
                        event.target.submit();
                    }
                }
            })
            .catch(error => {
                console.error("Error checking category:", error);
            });
    });
});
