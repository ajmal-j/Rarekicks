window.addEventListener('DOMContentLoaded', function () {
  startCountdown();
});

function startCountdown() {
  function updateTimer() {
    const countdownTime = localStorage.getItem('countdownTime');

    if (countdownTime) {
      let timerDisplay = document.getElementById('timer');
      let count = parseInt(countdownTime);

      const minutes = Math.floor(count / 60);
      const remainingSeconds = count % 60;

      timerDisplay.textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;

      if (count === 0) {
        localStorage.removeItem('countdownTime');
        clearInterval(timerInterval);
        timerDisplay.textContent = "0:00";
      } else {
        count--;
        localStorage.setItem('countdownTime', count);
      }
    } else {
      clearInterval(timerInterval); // Stop the countdown if the value is not available
    }
  }

  updateTimer(); // Call once to initialize

  let timerInterval = setInterval(updateTimer, 1000);
}
