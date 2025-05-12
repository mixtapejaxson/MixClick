function buyPowerup(powerupType) {
    let score = parseInt(localStorage.getItem('score')) || 0;

    if (powerupType === 'doubleClick') {
        if (score >= 100) {
            score -= 100;
            localStorage.setItem('doubleClick', 'true');
            localStorage.setItem('score', score);
            alert('Double Click Power purchased!');
        } else {
            alert('Not enough points!');
        }
    } else if (powerupType === 'autoClicker') {
        if (score >= 500) {
            score -= 500;
            localStorage.setItem('autoClicker', 'true');
            localStorage.setItem('score', score);
            updateShopUI(); // Refresh button states
            alert('Auto Clicker purchased!');
        } else {
            alert('Not enough points!');
        }
    } else if (powerupType === 'clickBoost') {
        if (score >= 250) {
            score -= 250;
            localStorage.setItem('clickBoostActive', 'true');
            localStorage.setItem('clickBoostEndTime', Date.now() + 30000); // 30 seconds from now
            localStorage.setItem('score', score);
            alert('Mighty Clicks purchased! 30 seconds of triple power!');
        } else {
            alert('Not enough points!');
        }
    } else if (powerupType === 'gamblingCooldownReduction') {
        let currentReductionLevel = parseInt(localStorage.getItem('gamblingCooldownLevel')) || 0;
        let cost = currentReductionLevel === 0 ? 1000 : 2500;
        if (currentReductionLevel < 2) {
            if (score >= cost) {
                score -= cost;
                currentReductionLevel++;
                localStorage.setItem('gamblingCooldownLevel', currentReductionLevel);
                localStorage.setItem('gamblingCooldownReduction', currentReductionLevel * 5); // Store total seconds reduction
                localStorage.setItem('score', score);
                alert('Lucky Charm purchased! Gambling cooldown reduced.');
            } else {
                alert('Not enough points!');
            }
        } else {
            alert('Lucky Charm fully upgraded!');
        }
    } else if (powerupType === 'interest') {
        let currentInterestLevel = parseInt(localStorage.getItem('interestLevel')) || 0;
        const costs = [5000, 10000, 20000, 40000, 80000, 160000, 320000, 640000, 1280000, 2560000]; // Up to 1%
        const rates = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]; // Percentage points

        if (currentInterestLevel < rates.length) {
            let cost = costs[currentInterestLevel];
            if (score >= cost) {
                score -= cost;
                localStorage.setItem('interestRate', rates[currentInterestLevel]);
                currentInterestLevel++;
                localStorage.setItem('interestLevel', currentInterestLevel);
                localStorage.setItem('score', score);
                alert('Golden Goose upgraded! Interest rate increased.');
            } else {
                alert('Not enough points!');
            }
        } else {
            alert('Golden Goose fully upgraded!');
        }
    }
    // Update score in the parent window if possible (or rely on localStorage sync)
    if (window.opener && window.opener.updateScoreFromShop) {
        window.opener.updateScoreFromShop(score);
    }
    updateShopUI(); // Refresh button states/costs
}

function updateShopUI() {
    // Update Auto Clicker button
    const autoClickerBtn = document.getElementById('buyAutoClicker');
    if (localStorage.getItem('autoClicker') === 'true') {
        autoClickerBtn.textContent = 'Auto Clicker (Purchased)';
        autoClickerBtn.disabled = true;
    }

    // Update Double Click button
    const doubleClickBtn = document.querySelector('.powerup-button[onclick*="doubleClick"]'); // More robust selector
    if (doubleClickBtn) { // Ensure button exists before trying to update
        if (localStorage.getItem('doubleClick') === 'true') {
            doubleClickBtn.textContent = 'Double Click (Purchased)';
            doubleClickBtn.disabled = true;
        }
    }

    // Update Gambling Cooldown Reduction button
    const gamblingCooldownBtn = document.getElementById('buyGamblingCooldown');
    const gamblingCooldownCostDisplay = document.getElementById('gamblingCooldownCost');
    let currentReductionLevel = parseInt(localStorage.getItem('gamblingCooldownLevel')) || 0;
    if (currentReductionLevel === 0) {
        gamblingCooldownCostDisplay.textContent = '1000';
    } else if (currentReductionLevel === 1) {
        gamblingCooldownCostDisplay.textContent = '2500';
    } else {
        gamblingCooldownBtn.textContent = 'Lucky Charm (Maxed)';
        gamblingCooldownBtn.disabled = true;
    }

    // Update Interest button
    const interestBtn = document.getElementById('buyInterest');
    const interestCostDisplay = document.getElementById('interestCost');
    const interestRateDisplay = document.getElementById('interestRateDisplay');
    let currentInterestLevel = parseInt(localStorage.getItem('interestLevel')) || 0;
    const costs = [5000, 10000, 20000, 40000, 80000, 160000, 320000, 640000, 1280000, 2560000];
    const rates = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

    interestRateDisplay.textContent = parseFloat(localStorage.getItem('interestRate')) || 0;
    if (currentInterestLevel < costs.length) {
        interestCostDisplay.textContent = costs[currentInterestLevel];
    } else {
        interestBtn.textContent = `Golden Goose (Max ${rates[rates.length-1]}%)`;
        interestBtn.disabled = true;
        interestCostDisplay.textContent = 'MAX';
    }
    
    // Update score display if there is one in shop.html (optional)
    // For now, score is read from localStorage at the start of buyPowerup
}

// Initial UI update when the shop loads
window.onload = function() {
    updateShopUI();
    // Periodically update UI in case changes happen in another tab (e.g. score increases)
    // Or if we want to show score in shop dynamically.
    // setInterval(updateShopUI, 1000); // Can be performance intensive, use with caution
};