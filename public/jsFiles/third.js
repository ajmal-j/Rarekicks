window.addEventListener('DOMContentLoaded', function () {
    const countdownTime = localStorage.getItem('countdownTime2');
    
    if (countdownTime) {
      startCountdown(parseInt(countdownTime, 10));
      function startCountdown(seconds) {
        let timerDisplay = document.getElementById('timer');
        let count = seconds;
        
        function updateTimer() {
          localStorage.setItem('countdownTime2', count);
  
          const minutes = Math.floor(count / 60);
          const remainingSeconds = count % 60;
  
          timerDisplay.textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  
          if (count === 0) {
            localStorage.removeItem('countdownTime2');
            clearInterval(timerInterval);
            timerDisplay.textContent = "0:00";
          } else {
            count--;
          }
        }
        updateTimer(); 
    
        let timerInterval = setInterval(updateTimer, 1000);
      }
    }
  });
  