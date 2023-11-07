    function copyReferralLink() {
        var referralLink = document.getElementById("referralLink");
        referralLink.select();
        referralLink.setSelectionRange(0, 99999); 
        navigator.clipboard.writeText(referralLink.value)
            .then(() => {
                showSuccess("Link copied successfully");
            })
            .catch((err) => {
                showAlert("Unable to copy");
                console.error('Unable to copy:', err);
            });
    }


    document.addEventListener('DOMContentLoaded', () => {
        const addressButtons = document.querySelectorAll('.currentSwitch');
        const removeAddress = document.querySelectorAll('.removeAddress');
        

        removeAddress.forEach((address)=>{
            address.addEventListener("click",(e)=>{
            e.preventDefault()
            const id=address.id;
            Swal.fire({
                title: 'Are you sure?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#D2122E',
                cancelButtonColor: '#720e9e',
                confirmButtonText: 'Remove!'
                }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = `/user/deleteAddress?id=${id}`;
                }
                });
        })
        })

        addressButtons.forEach(button => {
            button.addEventListener('change', async () => {
                const addressId = button.id;
                const success = await updateDefaultAddress(addressId);
                if (success) {
                    button.disabled = true;
                    addressButtons.forEach(otherButton => {
                        if (otherButton !== button) {
                            otherButton.checked = false;
                            otherButton.disabled = false; 
                        }
                    });
                }
            });
        });

        async function updateDefaultAddress(addressId) {
            try {
                const response = await fetch(`/user/updateDefaultAddress?id=${addressId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    showSuccess("Address Changed!")
                    return true;
                } else {
                    showAlert("Not Changed!")
                    return false;
                }
            } catch (error) {
                showAlert("Error While Changing")
                console.error('Error:', error);
                return false;
            }
        }

    });