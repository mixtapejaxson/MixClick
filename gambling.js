function initClickerGame() {
  // Obtain references to counter, button, and message elements.
  const counterEl = document.getElementById('counter');
  const luckyBtn = document.getElementById('luckyBtn');
  const messageEl = document.getElementById('message');
  let isCooldown = false;

  luckyBtn.addEventListener('click', () => {
    if (isCooldown) {
      messageEl.textContent = 'Cooldown in effect. Please wait 30 seconds.';
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
    }, 30000); // 30 seconds cooldown
  });
}

window.onload = initClickerGame;