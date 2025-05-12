function initClickerGame() {
  // Obtain references to counter, button, and message elements.
  const counterEl = document.getElementById('counter');
  const luckyBtn = document.getElementById('luckyBtn');
  const messageEl = document.getElementById('message');
  let isCooldown = false;

  luckyBtn.addEventListener('click', () => {
    let cooldownTime = 30000; // Default 30 seconds
    const reduction = parseInt(localStorage.getItem('gamblingCooldownReduction')) || 0;
    cooldownTime -= (reduction * 1000); // reduction is in seconds
    if (cooldownTime < 5000) cooldownTime = 5000; // Minimum 5 seconds cooldown

    if (isCooldown) {
      messageEl.textContent = `Cooldown in effect. Please wait ${cooldownTime / 1000} seconds.`;
      messageEl.style.display = 'block';
      return;
    }

    const gamble = Math.random();
    let points = parseInt(counterEl.textContent) || 0; // Retrieve current points and convert to integer

    if (points < 100) {
      messageEl.textContent = 'You need at least 100 points to gamble.';
    } else {
      if (gamble < 0.4) {
        const pointsWon = Math.floor(points / 2);
        points += pointsWon;
        counterEl.textContent = points;
        messageEl.textContent = `You won ${pointsWon} points!`;
      } else if (gamble >= 0.4 && gamble < 0.7) {
        const pointsLost = Math.floor(points / 3);
        if (pointsLost >= points) {
          points = 0;
          counterEl.textContent = points;
          messageEl.textContent = 'You lost all your points!';
        } else {
          points -= pointsLost;
          counterEl.textContent = points;
          messageEl.textContent = `You lost ${pointsLost} points!`;
        }
      } else if (gamble >= 0.7 && gamble < 0.9) {
        points *= 2;
        counterEl.textContent = points;
        messageEl.textContent = `Congratulations! Your points have been doubled!`;
      } else {
        points = 0;
        counterEl.textContent = points;
        messageEl.textContent = 'Bad luck! You lost all points!';
      }
    }
    count = points;
  
    messageEl.style.display = 'block';
    isCooldown = true;

    setTimeout(() => {
      isCooldown = false;
      messageEl.style.display = 'none';
    }, cooldownTime);
  });
}

window.onload = initClickerGame;