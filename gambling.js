function initClickerGame() {
    // Obtain references to counter, button, and message elements
    const counterEl = document.getElementById('counter');
    const luckyBtn = document.getElementById('luckyBtn');
    const messageEl = document.getElementById('message');
  
    let count = 0;
    let isCooldown = false;
  
    luckyBtn.addEventListener('click', () => {
      if (isCooldown) {
        messageEl.textContent = 'Cooldown in effect. Please wait 30 seconds.';
        messageEl.style.display = 'block';
        return;
      }
  
      const gamble = Math.random();
  
      // Update count first
      if (gamble < 0.25) {
        count += 100;
        messageEl.textContent = 'You won 100 points!';
      } else if (gamble < 0.5) {
        count -= 5000;
        if (count < 0) count = 0;
        messageEl.textContent = 'You lost 5000 points!';
      } else if (gamble < 0.75) {
        count += 500;
        messageEl.textContent = 'Jackpot! You won 500 points!';
      } else if (gamble >= 0.75 && gamble < 0.999999) {
        count += 1000000;
        counterEl.textContent = count; // Update counter before displaying jackpot message
        messageEl.textContent = 'JACKPOT: You won 1,000,000 points!';
      } else {
        count = 0;
        messageEl.textContent = 'Bad luck! You lost all points!';
      }
      
      // Update counter element after updating count
      counterEl.textContent = count;
      messageEl.style.display = 'block';
  
      isCooldown = true;
  
      setTimeout(() => {
        isCooldown = false;
        messageEl.style.display = 'none'; // Hide the message after cooldown ends
      }, 30000); // 30 seconds cooldown
    });
}

window.onload = initClickerGame;
