// Copyright (c) 2025 mixtapejaxson
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

function initClickerGame() {
  // Obtain references to playerPoints display, button, and message elements.
  // These elements are expected to be in the parent window (index.html)
  const playerPointsDisplayEl = window.opener ? window.opener.document.getElementById('playerPointsDisplay') : document.getElementById('playerPointsDisplay');
  const luckyBtn = document.getElementById('luckyBtn');
  const messageEl = window.opener ? window.opener.document.getElementById('message') : document.getElementById('message');
  let isCooldown = false;

  if (!luckyBtn) {
    console.error("Lucky button not found in gambling.js. Gambling functionality will not work.");
    return; // Exit if essential elements are missing
  }

  luckyBtn.addEventListener('click', () => {
    // Default cooldown time
    let cooldownTime = 30000; // 30 seconds

    // Get gambling cooldown reduction from localStorage
    // Access localStorage from the main window if this script is in an iframe
    const ls = window.opener ? window.opener.localStorage : localStorage;

    const cooldownReduction = parseInt(ls.getItem('gamblingCooldownReduction')) || 0;
    // The gamblingCooldown item in localStorage should represent the base cooldown in seconds
    let gamblingCooldown = parseInt(ls.getItem('gamblingCooldown')) || 30; // Default to 30 seconds if not set

    // Apply reduction
    cooldownTime = gamblingCooldown * 1000 - (cooldownReduction * 1000);

    // Minimum cooldown time
    if (cooldownTime < 5000) cooldownTime = 5000; // Ensure a minimum of 5 seconds cooldown

    if (isCooldown) {
      if (typeof window.showMessage === 'function') { // Use main window's showMessage
        window.showMessage(`Cooldown in effect. Please wait ${cooldownTime / 1000} seconds.`, 'orange');
      } else if (messageEl) {
        messageEl.textContent = `Cooldown in effect. Please wait ${cooldownTime / 1000} seconds.`;
        messageEl.style.display = 'block';
      }
      return;
    }

    // Get current playerPoints.
    // Reads directly from localStorage ('score') as the most reliable source updated by shop/index.
    let currentPlayerPoints = parseInt(ls.getItem('score')) || 0;
    const costToGamble = 100; // Cost in Player Points

    if (currentPlayerPoints < costToGamble) {
      if (typeof window.showMessage === 'function') { // Use main window's showMessage
        window.showMessage(`You need at least ${costToGamble} Points to gamble.`, 'red');
      } else if (messageEl) {
        messageEl.textContent = `You need at least ${costToGamble} Points to gamble.`;
        messageEl.style.display = 'block';
      }
      return;
    }

    // Deduct cost before gambling
    currentPlayerPoints -= costToGamble;
    ls.setItem('score', currentPlayerPoints.toString()); // Update localStorage immediately
    // Update main window's points display
    if (window.opener && typeof window.opener.updatePlayerPointsFromShop === 'function') {
        window.opener.updatePlayerPointsFromShop(currentPlayerPoints);
    } else if (playerPointsDisplayEl) {
        playerPointsDisplayEl.textContent = `Points: ${currentPlayerPoints}`;
    }


    const gamble = Math.random();
    let pointsAfterGamble = currentPlayerPoints;
    let gambleMessage = '';
    let messageColor = 'white'; // Default color

    if (gamble < 0.4) { // Win 50% of current points
        const pointsWon = Math.floor(currentPlayerPoints * 0.5);
        pointsAfterGamble += pointsWon;
        gambleMessage = `You won ${pointsWon} Points!`;
        messageColor = 'green';
    } else if (gamble < 0.7) { // Lose 33% of current points
        const pointsLost = Math.floor(currentPlayerPoints * 0.33);
        pointsAfterGamble -= pointsLost;
        gambleMessage = `You lost ${pointsLost} Points!`;
        messageColor = 'red';
    } else if (gamble < 0.9) { // Double current points
        pointsAfterGamble = currentPlayerPoints * 2;
        gambleMessage = `Congratulations! Your Points have been doubled!`;
        messageColor = 'green';
    } else { // Lose all points
        pointsAfterGamble = 0;
        gambleMessage = 'Bad luck! You lost all your Points!';
        messageColor = 'red';
    }

    // Update localStorage and call the main page's update function.
    ls.setItem('score', pointsAfterGamble.toString());

    if (window.opener && typeof window.opener.updatePlayerPointsFromShop === 'function') {
        window.opener.updatePlayerPointsFromShop(pointsAfterGamble);
    } else if (playerPointsDisplayEl) {
        playerPointsDisplayEl.textContent = `Points: ${pointsAfterGamble}`;
    }

    // Use the main window's showMessage for consistent UI
    if (typeof window.showMessage === 'function') {
        window.showMessage(gambleMessage, messageColor);
    } else if (messageEl) {
        messageEl.textContent = gambleMessage;
        messageEl.style.display = 'block';
    }

    isCooldown = true;

    setTimeout(() => {
      isCooldown = false;
      if (typeof window.showMessage !== 'function' && messageEl) { // Only hide if not using main window's message system
        messageEl.style.display = 'none';
      }
    }, cooldownTime);
  });
}

// Ensure this runs after the DOM is loaded so elements are available.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClickerGame);
} else {
    initClickerGame(); // DOMContentLoaded has already fired
}
