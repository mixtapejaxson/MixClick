// --- Helper Functions ---
function getGameVar(varName, defaultValue) {
    try {
        const value = localStorage.getItem(varName);
        if (value === null || typeof value === 'undefined') return defaultValue;
        const parsed = parseInt(value);
        return isNaN(parsed) ? defaultValue : parsed;
    } catch (e) {
        console.error(`Error getting game var ${varName}:`, e);
        return defaultValue;
    }
}

function getFloatGameVar(varName, defaultValue) {
    try {
        const value = localStorage.getItem(varName);
        if (value === null || typeof value === 'undefined') return defaultValue;
        const parsed = parseFloat(value);
        return isNaN(parsed) ? defaultValue : parsed;
    } catch (e) {
        console.error(`Error getting float game var ${varName}:`, e);
        return defaultValue;
    }
}

function getStringVar(varName, defaultValue) {
    try {
        const value = localStorage.getItem(varName);
        return (value === null || typeof value === 'undefined') ? defaultValue : value;
    } catch (e) {
        console.error(`Error getting string game var ${varName}:`, e);
        return defaultValue;
    }
}

// --- UI Message Display ---
let messageTimeout = null;
function displayShopMessage(text, type = 'info', duration = 3000) {
    const messageEl = document.getElementById('shopMessageDisplay');
    if (!messageEl) {
        console.error('shopMessageDisplay element not found!');
        return;
    }
    messageEl.textContent = text;
    messageEl.style.display = 'block';
    // Basic styling based on type
    if (type === 'error') messageEl.style.color = '#FF6B6B'; // Light red
    else if (type === 'success') messageEl.style.color = '#6BFF6B'; // Light green
    else messageEl.style.color = '#AADDFF'; // Default info color (light blue)

    if (messageTimeout) clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => {
        if (messageEl) {
            messageEl.style.display = 'none';
            messageEl.textContent = '';
        }
    }, duration);
}

// --- Core Shop Logic ---
function buyPowerup(powerupType) {
    console.log(`buyPowerup called for: ${powerupType}`);
    let playerPoints = getGameVar('score', 0);
    let playerCash = getGameVar('playerCash', 0);
    let originalPlayerPoints = playerPoints;
    let originalPlayerCash = playerCash;

    const upgradeMultiplier = 2;
    const maxUpgradeLevel = 500;
    const conversionRate = 10; // 10 Player Cash = 1 Player Point

    try {
        if (powerupType === 'convertToPoints') {
            const cashInput = document.getElementById('cashToConvertInput');
            let amountToConvert = parseInt(cashInput.value);

            if (isNaN(amountToConvert) || amountToConvert <= 0) {
                displayShopMessage("Please enter a valid amount of Cash.", 'error'); return;
            }
            if (amountToConvert % conversionRate !== 0) {
                displayShopMessage(`Amount must be a multiple of ${conversionRate}.`, 'error'); return;
            }
            if (playerCash >= amountToConvert) {
                const pointsGained = amountToConvert / conversionRate;
                playerCash -= amountToConvert;
                playerPoints += pointsGained;
                displayShopMessage(`Converted ${amountToConvert} Cash to ${pointsGained} Points!`, 'success');
                if (cashInput) cashInput.value = '';
            } else {
                displayShopMessage("Not enough Cash to convert!", 'error'); return;
            }
        } else if (powerupType === 'clickUpgrader') {
            let currentClickValue = getGameVar('clickValue', 1);
            let currentUpgradeLevel = getGameVar('upgradeLevel', 1);
            let currentUpgradeCost = getGameVar('upgradeCost', 10);

            if (currentUpgradeLevel >= maxUpgradeLevel) {
                displayShopMessage('Cash Clicker is already maxed out!', 'info'); return;
            }
            if (playerPoints >= currentUpgradeCost) {
                playerPoints -= currentUpgradeCost;
                currentClickValue *= upgradeMultiplier; // Consider if this should be additive or other formula
                currentUpgradeLevel++;
                currentUpgradeCost = Math.floor(currentUpgradeCost * (upgradeMultiplier * 0.9)); // Example cost increase

                localStorage.setItem('clickValue', currentClickValue);
                localStorage.setItem('upgradeLevel', currentUpgradeLevel);
                localStorage.setItem('upgradeCost', currentUpgradeCost);

                if (window.parent && typeof window.parent.updateClickUpgraderStats === 'function') {
                    window.parent.updateClickUpgraderStats(currentClickValue, currentUpgradeLevel, currentUpgradeCost);
                } else {
                    console.warn('Could not call updateClickUpgraderStats on parent window.');
                }
                displayShopMessage(`Cash Clicker Upgraded to Level ${currentUpgradeLevel} (Value: ${currentClickValue})!`, 'success');
            } else {
                displayShopMessage('Not enough Points for Cash Clicker!', 'error'); return;
            }
        } else if (powerupType === 'doubleClick') {
            const cost = 100;
            if (getStringVar('doubleClick', 'false') === 'true') {
                displayShopMessage('Double Cash already purchased!', 'info'); return;
            }
            if (playerPoints >= cost) {
                playerPoints -= cost;
                localStorage.setItem('doubleClick', 'true');
                displayShopMessage('Double Cash Power purchased!', 'success');
            } else {
                displayShopMessage('Not enough Points for Double Cash!', 'error'); return;
            }
        } else if (powerupType === 'autoClicker') {
            const cost = 500;
            if (getStringVar('autoClicker', 'false') === 'true') {
                displayShopMessage('Auto Cash Generator already purchased!', 'info'); return;
            }
            if (playerPoints >= cost) {
                playerPoints -= cost;
                localStorage.setItem('autoClicker', 'true');
                displayShopMessage('Auto Cash Generator purchased!', 'success');
            } else {
                displayShopMessage('Not enough Points for Auto Cash!', 'error'); return;
            }
        } else if (powerupType === 'clickBoost') {
            const cost = 250;
            // No check if already active, re-buying resets timer as per description
            if (playerPoints >= cost) {
                playerPoints -= cost;
                localStorage.setItem('clickBoostActive', 'true');
                localStorage.setItem('clickBoostEndTime', Date.now() + 30000);
                displayShopMessage('Mighty Cash purchased! (30s Triple Cash)', 'success');
            } else {
                displayShopMessage('Not enough Points for Mighty Cash!', 'error'); return;
            }
        } else if (powerupType === 'gamblingCooldownReduction') {
            let currentReductionLevel = getGameVar('gamblingCooldownLevel', 0);
            const gamblingCosts = [1000, 2500]; // Points

            if (currentReductionLevel >= gamblingCosts.length) {
                displayShopMessage('Lucky Charm fully upgraded!', 'info'); return;
            }
            let cost = gamblingCosts[currentReductionLevel];
            if (playerPoints >= cost) {
                playerPoints -= cost;
                currentReductionLevel++;
                localStorage.setItem('gamblingCooldownLevel', currentReductionLevel);
                localStorage.setItem('gamblingCooldownReduction', currentReductionLevel * 5); // 5s reduction per level
                displayShopMessage('Lucky Charm purchased! Cooldown reduced.', 'success');
            } else {
                displayShopMessage('Not enough Points for Lucky Charm!', 'error'); return;
            }
        } else if (powerupType === 'interest') {
            let currentInterestLevel = getGameVar('interestLevel', 0);
            const interestCosts = [5000, 10000, 20000, 40000, 80000, 160000, 320000, 640000, 1280000, 2560000]; // Points
            const rates = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]; // Percent

            if (currentInterestLevel >= rates.length) {
                displayShopMessage('Golden Goose fully upgraded!', 'info'); return;
            }
            let cost = interestCosts[currentInterestLevel];
            if (playerPoints >= cost) {
                playerPoints -= cost;
                localStorage.setItem('interestRate', rates[currentInterestLevel]);
                currentInterestLevel++;
                localStorage.setItem('interestLevel', currentInterestLevel);
                displayShopMessage(`Golden Goose Upgraded! Rate: ${rates[currentInterestLevel-1]}%`, 'success');
                 if (window.parent && typeof window.parent.initializeInterestInterval === 'function') {
                    window.parent.initializeInterestInterval(); // Tell main page to re-init interest
                } else {
                    console.warn('Could not call initializeInterestInterval on parent window.');
                }
            } else {
                displayShopMessage('Not enough Points for Golden Goose!', 'error'); return;
            }
        } else {
            console.error("Unknown powerup type purchased:", powerupType);
            displayShopMessage('Unknown item selected.', 'error');
            return;
        }

        // --- Update localStorage and Main Game UI ---
        if (playerPoints !== originalPlayerPoints) {
            localStorage.setItem('score', playerPoints);
            if (window.parent && typeof window.parent.updatePlayerPointsFromShop === 'function') {
                window.parent.updatePlayerPointsFromShop(playerPoints);
            } else {
                console.warn('Could not update player points in parent window. Ensure updatePlayerPointsFromShop is global in index.html.');
            }
        }
        if (playerCash !== originalPlayerCash) {
            localStorage.setItem('playerCash', playerCash);
            if (window.parent && typeof window.parent.updatePlayerCashFromShop === 'function') {
                window.parent.updatePlayerCashFromShop(playerCash);
            } else {
                console.warn('Could not update player cash in parent window. Ensure updatePlayerCashFromShop is global in index.html.');
            }
        }

    } catch (e) {
        console.error("Error in buyPowerup:", e);
        displayShopMessage('An error occurred during purchase.', 'error');
    } finally {
        updateShopUI(); // Always update shop UI after an attempt
    }
}

// --- Update Shop UI Elements ---
function updateShopUI() {
    try {
        let currentPoints = getGameVar('score', 0);
        let currentCash = getGameVar('playerCash', 0);
        const maxUpgradeLevel = 500;

        // Cash to Points Conversion UI
        const currentCashForConversionDisplay = document.getElementById('currentCashForConversion');
        if (currentCashForConversionDisplay) currentCashForConversionDisplay.textContent = currentCash;
        const convertBtn = document.getElementById('convertCashToPointsBtn');
        // No need to disable convertBtn here, handled by amount check in buyPowerup

        // Cash Clicker Upgrader
        const clickUpgraderBtn = document.getElementById('buyClickUpgrader');
        const clickUpgraderInfo = document.getElementById('clickUpgraderInfo');
        if (clickUpgraderBtn && clickUpgraderInfo) {
            let uLevel = getGameVar('upgradeLevel', 1);
            let uCost = getGameVar('upgradeCost', 10);
            let cValue = getGameVar('clickValue', 1);
            if (uLevel >= maxUpgradeLevel) {
                clickUpgraderInfo.textContent = `Value: ${cValue} Cash/click (Maxed!)`;
                clickUpgraderBtn.textContent = 'Maxed Out';
                clickUpgraderBtn.disabled = true;
            } else {
                clickUpgraderInfo.textContent = `Lvl ${uLevel} -> ${uLevel+1}. Value: ${cValue} Cash. Cost: ${uCost} Points`;
                clickUpgraderBtn.textContent = 'Upgrade Cash Clicker';
                clickUpgraderBtn.disabled = currentPoints < uCost;
            }
        }

        // Double Cash
        const doubleClickBtn = document.getElementById('buyDoubleClick');
        if (doubleClickBtn) {
            const cost = 100;
            if (getStringVar('doubleClick', 'false') === 'true') {
                doubleClickBtn.textContent = 'Double Cash (Purchased)';
                doubleClickBtn.disabled = true;
            } else {
                doubleClickBtn.textContent = `Buy Double Cash (${cost} Points)`;
                doubleClickBtn.disabled = currentPoints < cost;
            }
        }

        // Auto Cash Generator
        const autoClickerBtn = document.getElementById('buyAutoClicker');
        if (autoClickerBtn) {
            const cost = 500;
            if (getStringVar('autoClicker', 'false') === 'true') {
                autoClickerBtn.textContent = 'Auto Cash (Purchased)';
                autoClickerBtn.disabled = true;
            } else {
                autoClickerBtn.textContent = `Buy Auto Cash (${cost} Points)`;
                autoClickerBtn.disabled = currentPoints < cost;
            }
        }

        // Mighty Cash
        const clickBoostBtn = document.getElementById('buyClickBoost');
        if (clickBoostBtn) {
            const cost = 250;
            clickBoostBtn.textContent = `Buy Mighty Cash (${cost} Points)`;
            clickBoostBtn.disabled = currentPoints < cost;
            // Visual timer for Mighty Clicks if active? (More complex, skip for now)
        }

        // Lucky Charm (Gambling Cooldown)
        const gamblingCooldownBtn = document.getElementById('buyGamblingCooldown');
        const gamblingInfoSpan = document.getElementById('gamblingCooldownInfo');
        if (gamblingCooldownBtn && gamblingInfoSpan) {
            let currentReductionLevel = getGameVar('gamblingCooldownLevel', 0);
            const gamblingCosts = [1000, 2500];
            const reductionPerLevel = 5; // seconds
            let currentTotalReduction = currentReductionLevel * reductionPerLevel;

            if (currentReductionLevel >= gamblingCosts.length) {
                gamblingInfoSpan.textContent = `Maxed! (-${currentTotalReduction}s Cooldown)`;
                gamblingCooldownBtn.textContent = 'Lucky Charm (Maxed)';
                gamblingCooldownBtn.disabled = true;
            } else {
                let cost = gamblingCosts[currentReductionLevel];
                gamblingInfoSpan.textContent = `Lvl ${currentReductionLevel}. Current: -${currentTotalReduction}s. Next: -${currentTotalReduction + reductionPerLevel}s. Cost: ${cost} Points`;
                gamblingCooldownBtn.textContent = 'Upgrade Lucky Charm';
                gamblingCooldownBtn.disabled = currentPoints < cost;
            }
        }

        // Golden Goose (Interest)
        const interestBtn = document.getElementById('buyInterest');
        const interestInfoSpan = document.getElementById('interestInfo');
        if (interestBtn && interestInfoSpan) {
            let currentInterestLevel = getGameVar('interestLevel', 0);
            const interestCosts = [5000, 10000, 20000, 40000, 80000, 160000, 320000, 640000, 1280000, 2560000];
            const rates = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
            let currentRate = getFloatGameVar('interestRate', 0);

            if (currentInterestLevel >= rates.length) {
                interestInfoSpan.textContent = `Maxed! Current: ${currentRate.toFixed(1)}% / 10s`;
                interestBtn.textContent = 'Golden Goose (Maxed)';
                interestBtn.disabled = true;
            } else {
                let cost = interestCosts[currentInterestLevel];
                interestInfoSpan.textContent = `Lvl ${currentInterestLevel}. Current: ${currentRate.toFixed(1)}%. Next: ${rates[currentInterestLevel].toFixed(1)}%. Cost: ${cost} Points`;
                interestBtn.textContent = 'Upgrade Golden Goose';
                interestBtn.disabled = currentPoints < cost;
            }
        }

    } catch (e) {
        console.error("Error in updateShopUI:", e);
        displayShopMessage('Error updating shop display.', 'error');
    }
}

// --- Initialization ---
window.onload = function() {
    console.log("Shop window loaded. Initializing UI.");
    try {
        updateShopUI(); // Initial UI setup
        // Optional: Set up a less frequent interval if needed, but most updates are event-driven.
        // setInterval(updateShopUI, 2000); // Refresh shop UI periodically (e.g., every 2 seconds)
    } catch (e) {
        console.error("Error on shop window.onload:", e);
        displayShopMessage('Shop could not be initialized.', 'error');
    }
};
