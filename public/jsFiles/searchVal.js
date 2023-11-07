
function clearSearchInput() {
    const form = document.querySelector(".searchForm");
    form.reset();
    clearSearch.value = '';
}

(() => {
    'use strict';
    const forms = document.querySelectorAll('.searchForm');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            const searchInput = form.querySelector('[name="search"]');
            const searchValue = searchInput.value;

            if (/^\s*$/.test(searchValue)) {
                event.preventDefault();
                event.stopPropagation();
                searchInput.value = '';
                return;
            }

            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
        }, false);

        form.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                form.dispatchEvent(new Event('submit'));
            }
        });
    });
})();
