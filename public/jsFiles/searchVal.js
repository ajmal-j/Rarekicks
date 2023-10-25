
function clearA() {
    const form = document.querySelector(".needs-validation");
    form.reset();
    clearSearch.value = '';
}
(() => {
    'use strict';
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
          form.addEventListener('submit', event => {
              const searchInput = form.querySelector('[name="search"]');
              const searchValue = searchInput.value;
              if (/^\s*$/.test(searchValue)) {
                  event.preventDefault();
                        event.stopPropagation();
                        searchInput.value='';
                        // const alertMessage='Search cannot be empty.';
                        // showAlert(alertMessage);
                        return;
                    }
                    
                    if (!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    }

                }, false);
            });
        })();
        form.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                form.dispatchEvent(new Event('submit'));
            }
        });
        
        