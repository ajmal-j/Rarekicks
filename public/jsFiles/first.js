document.getElementById('startCountdownButton').addEventListener('click', function () {
    localStorage.removeItem('countdownTime');
    localStorage.setItem('countdownTime', 600);
  });

 