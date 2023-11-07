            function updateStates() {
            var countrySelect = document.getElementById('countrySelect');
            var stateSelect = document.getElementById('stateSelect');
            var stateFormGroup = document.getElementById('stateFormGroup');

            // Clear existing options
            stateSelect.innerHTML = '<option value="" selected disabled>Select a state</option>';

            // Define a simple mapping of countries to states (replace this with your data)
            var countryToStates = {
                'india': ['Kerala', 'Andhra Pradesh', 'Telangana', 'Maharashtra', 'Tamil Nadu'],
                'usa': ['New York', 'California', 'Texas', 'Florida', 'Illinois'],
                'canada': ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba'],
                'uk': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
                'australia': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia']
            };

            var selectedCountry = countrySelect.value.toLowerCase();

            if (selectedCountry in countryToStates) {
                // Populate states for the selected country
                countryToStates[selectedCountry].forEach(function (state) {
                    var option = document.createElement('option');
                    option.value = state.toLowerCase();
                    option.textContent = state;
                    stateSelect.appendChild(option);
                });

                // Show the state dropdown
                stateFormGroup.style.display = 'block';
            } else {
                // Hide the state dropdown if the country has no associated states
                stateFormGroup.style.display = 'none';
            }
        }



            (() => {
                'use strict';
            
                const forms = document.querySelectorAll('.needs-validation');
            
                Array.from(forms).forEach(form => {
                    form.addEventListener('submit', async event => {
                        event.preventDefault();
            
                        const contactInput = form.querySelector('[name="contact"]');
                        const contactValue = contactInput.value.trim();
            
                        const nameInput = form.querySelector('[name="name"]');
                        const nameValue = nameInput.value.trim();
            
                        const pinCodeInput = form.querySelector('[name="pinCode"]');
                        const pinCodeValue = pinCodeInput.value.trim();
            
                        const addressInput = form.querySelector('[name="address"]');
                        const addressValue = addressInput.value.trim();
            
                        const landmarkInput = form.querySelector('[name="landmark"]');
                        const landmarkValue = landmarkInput.value.trim();
            
                        const cityInput = form.querySelector('[name="city"]');
                        const cityValue = cityInput.value.trim();

                        var countrySelect = document.getElementById('countrySelect');
                        const countryValue=countrySelect.value
                        if (countrySelect.value === '') {
                            showAlert('Please select a country.');
                            form.classList.add('was-validated');
                            return false;
                        }

                        // Validate state selection
                        var stateSelect = document.getElementById('stateSelect');
                        const stateValue=stateSelect.value;
                        if (stateSelect.value === '') {
                            showAlert('Please select a state.');
                            form.classList.add('was-validated');
                            return false;
                        }

                        if (nameValue === '') {
                            showAlert('Please enter a name.');
                            form.classList.add('was-validated');
                            return;
                        }
                        if (/\d/.test(nameValue)) {
                        showAlert('Name cannot contain numbers.');
                            form.classList.add('was-validated');
                        return;
                        }

                        if (contactValue === '' || isNaN(contactValue)) {
                            showAlert('Please enter a valid contact number.');
                            form.classList.add('was-validated');
                            return;
                        }


                        if (pinCodeValue === '' || pinCodeValue.length < 5 || pinCodeValue.length > 10) {
                            showAlert('Please enter a valid pin code.');
                            form.classList.add('was-validated');
                            return;
                        }

                        if (addressValue === '') {
                            showAlert('Please enter an address.');
                            form.classList.add('was-validated');
                            return;
                        }

                        if (/^\d+$/.test(addressValue)) {
                            showAlert('Address cannot contain only numbers.');
                            form.classList.add('was-validated');
                            return;
                        }

                        if (landmarkValue === '') {
                            showAlert('Please enter a landmark.');
                            form.classList.add('was-validated');
                            return;
                        }
                        if (/^\d+$/.test(landmarkValue)) {
                        showAlert('Landmark cannot contain only numbers.');
                            form.classList.add('was-validated');
                        return;
                        }
                        if (cityValue === '') {
                            showAlert('Please enter a city.');
                            form.classList.add('was-validated');
                            return;
                        }
                        if (/^\d+$/.test(cityValue)) {
                        showAlert('City cannot contain only numbers.');
                            form.classList.add('was-validated');
                        return;
                        }
                        if (!form.checkValidity()) {
                            showAlert("Fill The Form Correctly")
                            form.classList.add('was-validated');
                            return;
                        }
            
                        try {
                            const response = await fetch(`/user/insertAddress?country=${countryValue}&state=${stateValue}&name=${nameValue}&contact=${contactValue}&pinCode=${pinCodeValue}&address=${addressValue}&landmark=${landmarkValue}&city=${cityValue}`);
                            const data = await response.json();
                            if (data.added === "added") {
                                showSuccess('Updating!');
                                form.submit();
                            }else if (data.added==="contact"){
                                showAlert('Contact In Use!');
                            }
                            else if(data.added==="not") {
                                showAlert('Not Valid');
                            }
                            else if(data.added==="checkOut") {
                                showSuccess('Updating');
                                window.location.href = '/user/checkOut';
                            }
                        } catch (error) {
                            console.error("Error checking category:", error);
                        }
                    });
        
                }, false);
            })();
            