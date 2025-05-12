function initClickerGame() {
  // Obtain references to playerPoints display, button, and message elements.
  const playerPointsDisplayEl = document.getElementById('playerPointsDisplay'); // Changed from cashDisplayEl
  const luckyBtn = document.getElementById('luckyBtn');
  const messageEl = document.getElementById('message');
  let isCooldown = false;

  luckyBtn.addEventListener('click', () => {
    let cooldownTime = 30000; 
    const reduction = parseInt(localStorage.getItem('gamblingCooldownReduction')) || 0;
    cooldownTime -= (reduction * 1000); 
    if (cooldownTime < 5000) cooldownTime = 5000; 

    if (isCooldown) {
      if (messageEl) {
        messageEl.textContent = `Cooldown in effect. Please wait ${cooldownTime / 1000} seconds.`;
        messageEl.style.display = 'block';
      }
      return;
    }

    // Get current playerPoints. 
    // Reads directly from localStorage ('score') as the most reliable source updated by shop/index.
    let currentPlayerPoints = parseInt(localStorage.getItem('score')) || 0;
    const costToGamble = 100; // Cost in Player Points

    if (currentPlayerPoints < costToGamble) {
      if (messageEl) {
        messageEl.textContent = `You need at least ${costToGamble} Points to gamble.`;
        messageEl.style.display = 'block';
      }
      return;
    }

    const gamble = Math.random();
    let pointsAfterGamble = currentPlayerPoints;

    if (gamble < 0.4) { // Win 50% of current points
        const pointsWon = Math.floor(currentPlayerPoints * 0.5);
        pointsAfterGamble += pointsWon;
        if (messageEl) messageEl.textContent = `You won ${pointsWon} Points!`;
    } else if (gamble < 0.7) { // Lose 33% of current points
        const pointsLost = Math.floor(currentPlayerPoints * 0.33);
        pointsAfterGamble -= pointsLost;
        if (messageEl) messageEl.textContent = `You lost ${pointsLost} Points!`;
    } else if (gamble < 0.9) { // Double current points
        pointsAfterGamble = currentPlayerPoints * 2;
        if (messageEl) messageEl.textContent = `Congratulations! Your Points have been doubled!`;
    } else { // Lose all points
        pointsAfterGamble = 0;
        if (messageEl) messageEl.textContent = 'Bad luck! You lost all your Points!';
    }
    
    // Update localStorage and call the main page's update function.
    localStorage.setItem('score', pointsAfterGamble); 

    if (typeof window.updatePlayerPointsFromShop === 'function') { 
        window.updatePlayerPointsFromShop(pointsAfterGamble);
    } else if (window.opener && typeof window.opener.updatePlayerPointsFromShop === 'function') {
        window.opener.updatePlayerPointsFromShop(pointsAfterGamble);
    } else {
        // Fallback: directly update UI if possible, though direct call is preferred.
        if (playerPointsDisplayEl) playerPointsDisplayEl.textContent = `Points: ${pointsAfterGamble}`;
    }

    messageEl.style.display = 'block';
    isCooldown = true;

    setTimeout(() => {
      isCooldown = false;
      if (messageEl) messageEl.style.display = 'none';
    }, cooldownTime);
  });
}

// Ensure this runs after the DOM is loaded so elements are available.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClickerGame);
} else {
    initClickerGame(); // DOMContentLoaded has already fired
}