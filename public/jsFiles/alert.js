function showAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert';
    alertDiv.style.position = 'fixed';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '2000000000000000';
    alertDiv.style.top = '60px';
    alertDiv.style.opacity = '0';
    alertDiv.style.transition = 'opacity 0.5s ease-in-out';
    alertDiv.style.backgroundColor = '#D80032'; // Red
    alertDiv.style.color = 'white';
    alertDiv.style.padding = '15px';
    alertDiv.style.marginBottom = '15px';
    alertDiv.style.borderRadius = '4px';
    alertDiv.style.boxShadow = '0 2px 15px 0 rgba(0,0,0,0.24), 0 5px 5px 0 rgba(0,0,0,0.19)';
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `<strong>${message}</strong>`;
    document.body.appendChild(alertDiv);

    // Fade in
    setTimeout(() => {
        alertDiv.style.opacity = '1';
    }, 50);

    // Fade out and remove
    setTimeout(() => {
        alertDiv.style.opacity = '0';
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
    alertDiv.style.zIndex = '200000000000000000000000';
    alertDiv.style.top = '60px';
    alertDiv.style.opacity = '0';
    alertDiv.style.transition = 'opacity 0.5s ease-in-out';
    alertDiv.style.backgroundColor = '#00A36C'; // Green
    alertDiv.style.color = 'white';
    alertDiv.style.padding = '15px';
    alertDiv.style.marginBottom = '15px';
    alertDiv.style.borderRadius = '4px';
    alertDiv.style.boxShadow = '0 2px 15px 0 rgba(0,0,0,0.24), 0 5px 5px 0 rgba(0,0,0,0.19)';
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `<strong>${message}</strong>`;
    document.body.appendChild(alertDiv);

     // Fade in
     setTimeout(() => {
        alertDiv.style.opacity = '1';
     }, 50);

     // Fade out and remove
     setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => {
            alertDiv.remove();
        }, 500);
     }, 2000);
}
