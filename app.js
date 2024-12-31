document.addEventListener("DOMContentLoaded", () => {
  const hoursInput = document.getElementById("hours");
  hoursInput.setAttribute("max", "99"); // Add reasonable maximum for hours
  const minutesInput = document.getElementById("minutes");
  const secondsInput = document.getElementById("seconds");
  const startButton = document.getElementById("start-button");
  const pauseButton = document.getElementById("pause-button");
  const resetButton = document.getElementById("reset-button");
  const deleteButton = document.getElementById("delete-button");
  const messageBox = document.getElementById("message-box");

  let countdownInterval;
  let isPaused = false;
  let totalSeconds = 0;
  let originalSeconds = 0;
  let audio; // Global variable for the audio object

  // Input controls
  document.querySelectorAll(".spinner-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const input = e.target.parentElement.querySelector("input");
      const isIncrement = e.target.textContent === "▲";
      const max = parseInt(input.max);
      let value = parseInt(input.value) || 0;

      if (isIncrement) {
        value = value >= max ? 0 : value + 1;
      } else {
        value = value <= 0 ? max : value - 1;
      }

      input.value = value.toString().padStart(2, "0");
    });
  });

  // Input formatting
  [hoursInput, minutesInput, secondsInput].forEach((input) => {
    input.addEventListener("input", (e) => {
      let value = e.target.value;
      const max = parseInt(e.target.max);

      if (value.length > 2) value = value.slice(-2);
      if (parseInt(value) > max) value = max.toString();

      e.target.value = value.padStart(2, "0");
    });

    input.addEventListener("blur", (e) => {
      let value = e.target.value || "0";
      e.target.value = parseInt(value).toString().padStart(2, "0");
    });
  });

  function updateDisplay(hours, minutes, seconds) {
    hoursInput.value = hours.toString().padStart(2, "0");
    minutesInput.value = minutes.toString().padStart(2, "0");
    secondsInput.value = seconds.toString().padStart(2, "0");
  }

  function calculateTime() {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  }

  function startTimer() {
    if (!isPaused) {
      const hours = parseInt(hoursInput.value) || 0;
      const minutes = parseInt(minutesInput.value) || 0;
      const seconds = parseInt(secondsInput.value) || 0;

      totalSeconds = hours * 3600 + minutes * 60 + seconds;
      originalSeconds = totalSeconds;
    }

    if (totalSeconds <= 0) return;

    messageBox.textContent = "Time Remaining ...";
    startButton.classList.add("hidden");
    pauseButton.classList.remove("hidden");
    resetButton.classList.remove("hidden");
    deleteButton.classList.remove("hidden");
    isPaused = false;

    countdownInterval = setInterval(() => {
      totalSeconds--;
      const time = calculateTime();
      updateDisplay(time.hours, time.minutes, time.seconds);

      if (totalSeconds <= 0) {
        clearInterval(countdownInterval);
        messageBox.textContent = "Time's Up!";
        messageBox.classList.add("times-up");
        startButton.disabled = false;
        playAlarm(); // Play the alarm when the timer reaches zero
      }
    }, 1000);
  }

  function pauseTimer() {
    if (totalSeconds <= 0) return;

    if (isPaused) {
      startTimer();
      pauseButton.textContent = "Pause";
    } else {
      clearInterval(countdownInterval);
      pauseButton.textContent = "Continue";
      isPaused = true;
    }
  }

  function resetTimer() {
    clearInterval(countdownInterval);
    totalSeconds = originalSeconds;
    const time = calculateTime();
    updateDisplay(time.hours, time.minutes, time.seconds);
    startButton.classList.remove("hidden");
    pauseButton.classList.add("hidden");
    resetButton.classList.add("hidden");
    deleteButton.classList.add("hidden");
    messageBox.textContent = "Set Timer";
    messageBox.classList.remove("times-up"); // Remove the blinking animation
    isPaused = false;
    pauseButton.textContent = "Pause";
    stopAlarm(); // Stop the alarm when resetting the timer
  }

  function deleteTimer() {
    clearInterval(countdownInterval);
    updateDisplay(0, 0, 0);
    startButton.classList.remove("hidden");
    pauseButton.classList.add("hidden");
    resetButton.classList.add("hidden");
    deleteButton.classList.add("hidden");
    messageBox.textContent = "Set Timer";
    messageBox.classList.remove("times-up"); // Remove the blinking animation
    isPaused = false;
    totalSeconds = 0;
    originalSeconds = 0;
    stopAlarm(); // Stop the alarm when deleting the timer
  }

  function playAlarm() {
    try {
      audio = new Audio("sounds/alarm.mp3");
      audio.loop = true;
      audio.play().catch((error) => {
        console.error("Error playing alarm:", error);
      });
    } catch (error) {
      console.error("Error creating audio:", error);
    }
  }

  function stopAlarm() {
    if (audio) {
      audio.pause(); // Pause the alarm
      audio.currentTime = 0; // Reset the audio to the beginning
    }
  }

  startButton.addEventListener("click", startTimer);
  pauseButton.addEventListener("click", pauseTimer);
  resetButton.addEventListener("click", resetTimer);
  deleteButton.addEventListener("click", deleteTimer);
});
