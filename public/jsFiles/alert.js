function showAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert';
    alertDiv.style.position = 'fixed';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '2000000000000000';
    alertDiv.style.top = '-100px'; 
    alertDiv.style.opacity = '0';
    alertDiv.style.transition = 'opacity 0.5s ease-in-out, top 0.5s ease-in-out';
    alertDiv.style.backgroundColor = '#ffff';
    alertDiv.style.color = 'black';
    alertDiv.style.padding = '15px';
    alertDiv.style.marginBottom = '15px';
    alertDiv.style.borderRadius = '15px';
    alertDiv.style.boxShadow = '0 2px 15px 0 rgba(0,0,0,0.24), 0 5px 5px 0 rgba(0,0,0,0.19)';
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `<div style="display: flex; align-items: center;">
      <i class="fa-solid fa-circle-xmark fs-4 border-circle my-auto fa-shake" style="color:#da2c38;"></i>
      <span class="my-auto">&nbsp;<strong>${message}</strong></span>
    </div>`;
    document.body.appendChild(alertDiv);
    alertDiv.offsetHeight;
    alertDiv.style.top = '60px';
    setTimeout(() => {
      alertDiv.style.opacity = '1';
    }, 50);
    setTimeout(() => {
      alertDiv.style.opacity = '0';
      alertDiv.style.top = '-100px'; 
      setTimeout(() => {
        alertDiv.remove();
      }, 500);
    }, 2000);
  }
  

function showSuccess(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert';
    alertDiv.style.position = 'fixed';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '2000000000000000';
    alertDiv.style.top = '-100px'; 
    alertDiv.style.opacity = '0';
    alertDiv.style.transition = 'opacity 0.5s ease-in-out, top 0.5s ease-in-out';
    alertDiv.style.backgroundColor = '#ffff';
    alertDiv.style.color = 'black';
    alertDiv.style.padding = '15px';
    alertDiv.style.marginBottom = '15px';
    alertDiv.style.borderRadius = '15px';
    alertDiv.style.boxShadow = '0 2px 15px 0 rgba(0,0,0,0.24), 0 5px 5px 0 rgba(0,0,0,0.19)';
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `<div style="display: flex; align-items: center;">
      <i class="fa-solid fa-circle-check fs-4 border-circle my-auto fa-shake" style="color:#16db65;"></i>
      <span class="my-auto">&nbsp;<strong>${message}</strong></span>
    </div>`;
    document.body.appendChild(alertDiv);
    alertDiv.offsetHeight;
    alertDiv.style.top = '60px';
    setTimeout(() => {
      alertDiv.style.opacity = '1';
    }, 50);
    setTimeout(() => {
      alertDiv.style.opacity = '0';
      alertDiv.style.top = '-100px'; 
      setTimeout(() => {
        alertDiv.remove();
      }, 500);
    }, 2000);
  }
  