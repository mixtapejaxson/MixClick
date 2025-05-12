// Helper to get game variables from localStorage with defaults
function getGameVar(varName, defaultValue) {
    const value = localStorage.getItem(varName);
    if (value === null || typeof value === 'undefined') return defaultValue;
    const parsed = parseInt(value);
    return isNaN(parsed) ? defaultValue : parsed;
}

function getFloatGameVar(varName, defaultValue) {
    const value = localStorage.getItem(varName);
    if (value === null || typeof value === 'undefined') return defaultValue;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
}

function getStringVar(varName, defaultValue) {
    const value = localStorage.getItem(varName);
    return (value === null || typeof value === 'undefined') ? defaultValue : value;
}

function buyPowerup(powerupType) {
    let playerPoints = getGameVar('score', 0); // 'score' in localStorage is used for playerPoints
    let playerCash = getGameVar('playerCash', 0); // Earned currency from index.html
    let originalPlayerPoints = playerPoints;
    let originalPlayerCash = playerCash;

    const upgradeMultiplier = 2;
    const maxUpgradeLevel = 500;
    const conversionRate = 10; // 10 Player Cash = 1 Player Point

    if (powerupType === 'convertToPoints') {
        const cashInput = document.getElementById('cashToConvertInput');
        const conversionResultInfo = document.getElementById('conversionResultInfo');
        let amountToConvert = parseInt(cashInput.value);

        if (isNaN(amountToConvert) || amountToConvert <= 0) {
            if(conversionResultInfo) conversionResultInfo.textContent = "Please enter a valid amount of Cash to convert.";
            alert("Please enter a valid amount of Cash to convert."); return;
        }
        if (playerCash >= amountToConvert) {
            if (amountToConvert % conversionRate !== 0) {
                 if(conversionResultInfo) conversionResultInfo.textContent = `Amount must be a multiple of ${conversionRate}.`;
                 alert(`Amount must be a multiple of ${conversionRate}.`); return;
            }
            const pointsGained = amountToConvert / conversionRate;
            playerCash -= amountToConvert;
            playerPoints += pointsGained;
            if(conversionResultInfo) conversionResultInfo.textContent = `Converted ${amountToConvert} Cash to ${pointsGained} Points!`;
            if(cashInput) cashInput.value = ''; // Clear input
        } else {
            if(conversionResultInfo) conversionResultInfo.textContent = "Not enough Cash to convert!";
            alert('Not enough Cash to convert!'); return;
        }
    } else if (powerupType === 'clickUpgrader') {
        let currentClickValue = getGameVar('clickValue', 1);
        let currentUpgradeLevel = getGameVar('upgradeLevel', 1);
        let currentUpgradeCost = getGameVar('upgradeCost', 10); // Cost in playerPoints

        if (currentUpgradeLevel >= maxUpgradeLevel) {
            alert('Cash Clicker is already maxed out!'); return;
        }
        if (playerPoints >= currentUpgradeCost) {
            playerPoints -= currentUpgradeCost;
            currentClickValue *= upgradeMultiplier;
            currentUpgradeLevel++;
            currentUpgradeCost = Math.floor(currentUpgradeCost * upgradeMultiplier);
            localStorage.setItem('clickValue', currentClickValue);
            localStorage.setItem('upgradeLevel', currentUpgradeLevel);
            localStorage.setItem('upgradeCost', currentUpgradeCost);
            if (window.opener && typeof window.opener.updateClickUpgraderStats === 'function') {
                window.opener.updateClickUpgraderStats(currentClickValue, currentUpgradeLevel, currentUpgradeCost);
            }
            alert(`Cash Clicker Upgraded to ${currentClickValue}! Cost ${currentUpgradeCost} Points for next.`);
        } else {
            alert('Not enough Points!'); return;
        }
    } else if (powerupType === 'doubleClick') {
        if (getStringVar('doubleClick', 'false') === 'true') {
             alert('Double Cash already purchased!'); return;
        }
        if (playerPoints >= 100) {
            playerPoints -= 100;
            localStorage.setItem('doubleClick', 'true');
            alert('Double Cash Power purchased!');
        } else {
            alert('Not enough Points!'); return;
        }
    } else if (powerupType === 'autoClicker') {
         if (getStringVar('autoClicker', 'false') === 'true') {
             alert('Auto Cash Generator already purchased!'); return;
        }
        if (playerPoints >= 500) {
            playerPoints -= 500;
            localStorage.setItem('autoClicker', 'true');
            alert('Auto Cash Generator purchased!');
        } else {
            alert('Not enough Points!'); return;
        }
    } else if (powerupType === 'clickBoost') {
        if (playerPoints >= 250) {
            playerPoints -= 250;
            localStorage.setItem('clickBoostActive', 'true');
            localStorage.setItem('clickBoostEndTime', Date.now() + 30000);
            alert('Mighty Cash purchased! 30 seconds of triple Cash generation!');
        } else {
            alert('Not enough Points!'); return;
        }
    } else if (powerupType === 'gamblingCooldownReduction') {
        let currentReductionLevel = getGameVar('gamblingCooldownLevel', 0);
        const gamblingCosts = [1000, 2500]; 
        if (currentReductionLevel >= gamblingCosts.length) {
            alert('Lucky Charm fully upgraded!'); return;
        }
        let cost = gamblingCosts[currentReductionLevel];
        if (playerPoints >= cost) {
            playerPoints -= cost;
            currentReductionLevel++;
            localStorage.setItem('gamblingCooldownLevel', currentReductionLevel);
            localStorage.setItem('gamblingCooldownReduction', currentReductionLevel * 5);
            alert('Lucky Charm purchased! Gambling cooldown reduced.');
        } else {
            alert('Not enough Points!'); return;
        }
    } else if (powerupType === 'interest') {
        let currentInterestLevel = getGameVar('interestLevel', 0);
        const interestCosts = [5000, 10000, 20000, 40000, 80000, 160000, 320000, 640000, 1280000, 2560000];
        const rates = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
        if (currentInterestLevel >= rates.length) {
            alert('Golden Goose fully upgraded!'); return;
        }
        let cost = interestCosts[currentInterestLevel];
        if (playerPoints >= cost) {
            playerPoints -= cost;
            localStorage.setItem('interestRate', rates[currentInterestLevel]);
            currentInterestLevel++;
            localStorage.setItem('interestLevel', currentInterestLevel);
            alert('Golden Goose upgraded! Interest rate increased.');
        } else {
            alert('Not enough Points!'); return;
        }
    } else {
        console.error("Unknown powerup type purchased:", powerupType);
        return;
    }
    
    if (playerPoints !== originalPlayerPoints) {
        localStorage.setItem('score', playerPoints);
        if (window.opener && typeof window.opener.updatePlayerPointsFromShop === 'function') {
            window.opener.updatePlayerPointsFromShop(playerPoints);
        }
    }
    if (playerCash !== originalPlayerCash) {
        localStorage.setItem('playerCash', playerCash);
        if (window.opener && typeof window.opener.updatePlayerCashFromShop === 'function') {
            window.opener.updatePlayerCashFromShop(playerCash);
        }
    }
    updateShopUI();
}

function updateShopUI() {
    let currentPoints = getGameVar('score', 0);
    let currentCash = getGameVar('playerCash', 0);
    const maxUpgradeLevel = 500;

    // Cash to Points Conversion UI
    const currentCashForConversionDisplay = document.getElementById('currentCashForConversion');
    if (currentCashForConversionDisplay) currentCashForConversionDisplay.textContent = currentCash;
    const convertBtn = document.getElementById('convertCashToPointsBtn');
    const cashToConvertInput = document.getElementById('cashToConvertInput');
    if (convertBtn && cashToConvertInput) {
        // Enable/disable based on if there's ANY cash, actual amount check is in buyPowerup
        convertBtn.disabled = currentCash <= 0;
    }

    // Cash Clicker Upgrader
    const clickUpgraderBtn = document.getElementById('buyClickUpgrader');
    const clickUpgraderInfo = document.getElementById('clickUpgraderInfo');
    if (clickUpgraderBtn && clickUpgraderInfo) {
        let uLevel = getGameVar('upgradeLevel', 1);
        let uCost = getGameVar('upgradeCost', 10); // Cost in Points
        let cValue = getGameVar('clickValue', 1); // Cash generated
        if (uLevel >= maxUpgradeLevel) {
            clickUpgraderInfo.textContent = `Value: ${cValue} Cash (Maxed!)`;
            clickUpgraderBtn.textContent = 'Maxed Out';
            clickUpgraderBtn.disabled = true;
        } else {
            clickUpgraderInfo.textContent = `Current Value: ${cValue} Cash, Next Lvl Cost: ${uCost} Points`;
            clickUpgraderBtn.textContent = 'Upgrade Cash Clicker';
            clickUpgraderBtn.disabled = currentPoints < uCost;
        }
    }

    // Auto Cash Generator button
    const autoClickerBtn = document.getElementById('buyAutoClicker');
    if (autoClickerBtn) {
        if (getStringVar('autoClicker', 'false') === 'true') {
            autoClickerBtn.textContent = 'Auto Cash (Purchased)';
            autoClickerBtn.disabled = true;
        } else {
            autoClickerBtn.textContent = 'Buy Auto Cash (500 Points)';
            autoClickerBtn.disabled = currentPoints < 500;
        }
    }

    // Double Cash button
    const doubleClickBtn = document.getElementById('buyDoubleClick');
    if (doubleClickBtn) { 
        if (getStringVar('doubleClick', 'false') === 'true') {
            doubleClickBtn.textContent = 'Double Cash (Purchased)';
            doubleClickBtn.disabled = true;
        } else {
            doubleClickBtn.textContent = 'Buy Double Cash (100 Points)';
            doubleClickBtn.disabled = currentPoints < 100;
        }
    }

    // Mighty Cash button
    const clickBoostBtn = document.getElementById('buyClickBoost');
    if (clickBoostBtn) {
        clickBoostBtn.textContent = 'Buy Mighty Cash (250 Points)';
        clickBoostBtn.disabled = currentPoints < 250;
    }

    // Gambling Cooldown Reduction button
    const gamblingCooldownBtn = document.getElementById('buyGamblingCooldown');
    const gamblingInfoSpan = document.getElementById('gamblingCooldownInfo');
    if (gamblingCooldownBtn && gamblingInfoSpan) {
        let currentReductionLevel = getGameVar('gamblingCooldownLevel', 0);
        const gamblingCosts = [1000, 2500]; // Costs in Points
        if (currentReductionLevel >= gamblingCosts.length) {
            gamblingInfoSpan.textContent = 'Maxed';
            gamblingCooldownBtn.textContent = 'Lucky Charm (Maxed)';
            gamblingCooldownBtn.disabled = true;
        } else {
            let cost = gamblingCosts[currentReductionLevel];
            gamblingInfoSpan.textContent = `Cost: ${cost} Points`;
            gamblingCooldownBtn.textContent = 'Buy Lucky Charm';
            gamblingCooldownBtn.disabled = currentPoints < cost;
        }
    }

    // Interest button (Points interest)
    const interestBtn = document.getElementById('buyInterest');
    const interestInfoSpan = document.getElementById('interestInfo');
    if (interestBtn && interestInfoSpan) {
        let currentInterestLevel = getGameVar('interestLevel', 0);
        const interestCosts = [5000, 10000, 20000, 40000, 80000, 160000, 320000, 640000, 1280000, 2560000]; // Costs in Points
        const rates = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
        let currentRate = getFloatGameVar('interestRate', 0);
        if (currentInterestLevel >= interestCosts.length) {
            interestInfoSpan.textContent = `Current: ${currentRate.toFixed(1)}% (Maxed)`;
            interestBtn.textContent = 'Golden Goose (Maxed)';
            interestBtn.disabled = true;
        } else {
            let cost = interestCosts[currentInterestLevel];
            interestInfoSpan.textContent = `Current: ${currentRate.toFixed(1)}%, Next Lvl Cost: ${cost} Points`;
            interestBtn.textContent = 'Upgrade Golden Goose';
            interestBtn.disabled = currentPoints < cost;
        }
    }
}

window.onload = function() {
    updateShopUI();
    setInterval(updateShopUI, 1000);
};
