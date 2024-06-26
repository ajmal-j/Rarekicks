  const  chatDiv=document.querySelector('.chatDiv')
  const logOutButton=document.querySelectorAll('.logOutButton')
  const currentUrl = window.location.href;
  const url=currentUrl.split('/')
  if((url[url.length-1])==='chat'){
    chatDiv.style.display='none'
  }else if((url[url.length-1])==='checkOut'){
    chatDiv.style.display='none'
  }

    document.addEventListener("DOMContentLoaded", function() {
        document.querySelector(".loading-screen").style.display = "none";
    });
    document.addEventListener("DOMContentLoaded", function() {
        const wishCount = document.querySelector(".wishlistCount");
        const cartCount = document.querySelector(".cartCount");
        const userName = document.querySelector(".userName");
            const fetchData = async () => {
                try {
                    const response = await fetch('/user/getCount');

                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.status}`);
                    }
                    const data = await response.json();
                    wishCount.textContent = data.wishCount;
                    cartCount.textContent = data.cartCount;
                    userName.textContent = data.userName;
                } catch (error) {
                    console.error('Error during fetch operation:', error);
                }
            };

            fetchData();
    });

    document.addEventListener("DOMContentLoaded", function () {
      const clearSearch = document.getElementById("searchInput");
      const clearSearchButtonHeader = document.querySelector(".clearSearchButtonHeader"); 
      clearSearch.value = currentSearchValue;
      if (clearSearch.value.trim() !== '') {
          clearSearchButtonHeader.style.color = 'white';
      } else {
          clearSearchButtonHeader.style.color = '#212529';
      }
      clearSearch.addEventListener('keyup', () => {
          if (clearSearch.value.trim() !== '') {
              clearSearchButtonHeader.style.color = 'white';
          } else {
              clearSearchButtonHeader.style.color = '#212529';
          }
      });
  });
  
  

    function clearSearchInput() {
        const form = document.querySelector(".searchForm");
        const clearSearchButtonHeader = document.querySelector(".clearSearchButtonHeader"); 
        form.reset();
        clearSearch.value = '';
        clearSearchButtonHeader.style.color='#212529';

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

