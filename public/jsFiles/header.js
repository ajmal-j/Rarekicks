  const  chatDiv=document.querySelector('.chatDiv')
  const logOutButton=document.querySelectorAll('.logOutButton')
  const currentUrl = window.location.href;
  const url=currentUrl.split('/')
  if(url[url.length-1]==='chat'){
    chatDiv.style.display='none'
  }

    document.addEventListener("DOMContentLoaded", function() {
        document.querySelector(".loading-screen").style.display = "none";
    });
    document.addEventListener("DOMContentLoaded", function() {
        const wishCount = document.querySelector(".wishlistCount");
        const cartCount = document.querySelector(".cartCount");
        const userName = document.querySelector(".userName");

    // Wrap the fetch operation in a function
            const fetchData = async () => {
                try {
                    const response = await fetch('/user/getCount');

                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.status}`);
                    }

                    const data = await response.json();

                    // Update the UI with the fetched data
                    wishCount.textContent = data.wishCount;
                    cartCount.textContent = data.cartCount;
                    userName.textContent = data.userName;
                } catch (error) {
                    console.error('Error during fetch operation:', error);
                }
            };

            // Call the function
            fetchData();
    
    });

       document.addEventListener("DOMContentLoaded", function () {
           const clearSearch = document.getElementById("searchInput");
            clearSearch.value = currentSearchValue;
    });

    function clearSearchInput() {
        const form = document.querySelector(".searchForm");
        form.reset();
        clearSearch.value = '';
    }
    logOutButton.forEach(Button => {
      Button.addEventListener('click', (e) => {
        e.preventDefault();
        Swal.fire({
          title: 'Are you sure?',
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#D2122E',
          cancelButtonColor: '#720e9e',
          confirmButtonText: 'Log Out!'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/user/logout/';
          }
        });
      });
    });

    const chatButton = document.querySelector(".chatButton");
    chatButton.addEventListener("click", (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Proceed to Help Chat?',
            text: "You are about to enter the help chat. Please use this service responsibly.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Proceed',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "/chatBot/chat";
            }
        });
    });

