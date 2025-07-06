// Copyright (c) 2025 mixtapejaxson
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// --- Helper Functions ---
function getGameVar(varName, defaultValue) { // For integers
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
    // FIX: Consistent color application
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
    // Get current values directly from localStorage, as index.html now keeps it updated
    let playerPoints = getGameVar('score', 0);
    let playerCash = getFloatGameVar('playerCash', 0.0);
    let originalPlayerPoints = playerPoints;
    let originalPlayerCash = playerCash;
    let conversionCount = getGameVar('conversionCount', 0);
    let mightyCashPurchaseCount = getGameVar('mightyCashPurchaseCount', 0); 

    const maxUpgradeLevel = 500;
    const baseConversionRate = 10;
    const rateIncreasePerBlock = 10;
    const conversionsPerBlock = 8;
    const currentConversionBlock = Math.floor(conversionCount / conversionsPerBlock);
    const currentDynamicConversionRate = baseConversionRate + (currentConversionBlock * rateIncreasePerBlock);

    try {
        if (powerupType === 'convertToPoints') {
            const cashInput = document.getElementById('cashToConvertInput');
            let amountToConvert = parseInt(cashInput.value);

            if (isNaN(amountToConvert) || amountToConvert <= 0) {
                displayShopMessage("Please enter a valid amount of Cash.", 'error'); return;
            }
            if (amountToConvert % currentDynamicConversionRate !== 0) {
                displayShopMessage(`Amount must be a multiple of ${currentDynamicConversionRate} for conversion.`, 'error'); return;
            }
            if (playerCash >= amountToConvert) {
                const pointsGained = amountToConvert / currentDynamicConversionRate;
                playerCash -= amountToConvert;
                playerPoints += pointsGained;
                conversionCount++;
                localStorage.setItem('conversionCount', conversionCount.toString());
                displayShopMessage(`Converted ${amountToConvert.toFixed(1)} Cash to ${pointsGained} Points! (Rate: ${currentDynamicConversionRate}:1)`, 'success');
                if (cashInput) cashInput.value = '';
            } else {
                displayShopMessage("Not enough Cash to convert!", 'error'); return;
            }
        } else if (powerupType === 'clickUpgrader') {
            let currentClickValue = getFloatGameVar('clickValue', 0.25);
            let currentUpgradeLevel = getGameVar('upgradeLevel', 1);
            let currentUpgradeCost = getGameVar('upgradeCost', 10);

            if (currentUpgradeLevel >= maxUpgradeLevel) {
                displayShopMessage('Cash Clicker is already maxed out!', 'info'); return;
            }
            if (playerPoints >= currentUpgradeCost) {
                playerPoints -= currentUpgradeCost;
                currentClickValue += 0.25;
                currentUpgradeLevel++;
                currentUpgradeCost = Math.floor(currentUpgradeCost * 1.5);

                localStorage.setItem('clickValue', currentClickValue.toFixed(2));
                localStorage.setItem('upgradeLevel', currentUpgradeLevel.toString());
                localStorage.setItem('upgradeCost', currentUpgradeCost.toString());

                if (window.parent && typeof window.parent.updateClickUpgraderStats === 'function') {
                    window.parent.updateClickUpgraderStats(currentClickValue, currentUpgradeLevel, currentUpgradeCost);
                } else {
                    console.warn('Could not call updateClickUpgraderStats on parent window.');
                }
                displayShopMessage(`Cash Clicker Upgraded to Level ${currentUpgradeLevel} (Value: ${currentClickValue.toFixed(2)})!`, 'success');
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
                // Inform main window to initialize auto clicker
                if (window.parent && typeof window.parent.initializeAutoClicker === 'function') {
                    window.parent.initializeAutoClicker();
                }
            } else {
                displayShopMessage('Not enough Points for Auto Cash!', 'error'); return;
            }
        } else if (powerupType === 'clickBoost') {
            const baseMightyCashCost = 250;
            const mightyCashCostIncrease = 150;
            const currentMightyCashCost = baseMightyCashCost + (mightyCashPurchaseCount * mightyCashCostIncrease);

            if (playerPoints >= currentMightyCashCost) {
                playerPoints -= currentMightyCashCost;
                localStorage.setItem('clickBoostActive', 'true');
                localStorage.setItem('clickBoostEndTime', Date.now() + 30000);
                mightyCashPurchaseCount++;
                localStorage.setItem('mightyCashPurchaseCount', mightyCashPurchaseCount.toString());
                displayShopMessage('Mighty Cash purchased! (30s Triple Cash)', 'success');
                // Inform main window to check mighty clicks status
                if (window.parent && typeof window.parent.checkMightyClicks === 'function') {
                    window.parent.checkMightyClicks();
                }
            } else {
                displayShopMessage(`Not enough Points for Mighty Cash! (Cost: ${currentMightyCashCost})`, 'error'); return;
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
                localStorage.setItem('gamblingCooldownLevel', currentReductionLevel.toString());
                localStorage.setItem('gamblingCooldownReduction', (currentReductionLevel * 5).toString()); // 5s reduction per level
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
                localStorage.setItem('interestRate', rates[currentInterestLevel].toFixed(1));
                currentInterestLevel++;
                localStorage.setItem('interestLevel', currentInterestLevel.toString());
                displayShopMessage(`Golden Goose Upgraded! Rate: ${rates[currentInterestLevel-1].toFixed(1)}%`, 'success');
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
        // These updates are critical and should always happen after a successful purchase
        if (playerPoints !== originalPlayerPoints) {
            localStorage.setItem('score', playerPoints.toString());
            if (window.parent && typeof window.parent.updatePlayerPointsFromShop === 'function') {
                window.parent.updatePlayerPointsFromShop(playerPoints);
            } else {
                console.warn('Could not update player points in parent window. Ensure updatePlayerPointsFromShop is global in index.html.');
            }
        }
        if (playerCash !== originalPlayerCash) {
            localStorage.setItem('playerCash', playerCash.toFixed(1));
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
        let currentCash = getFloatGameVar('playerCash', 0.0);
        const maxUpgradeLevel = 500;

        // Update shop's display of player cash and points
        const shopCashDisplay = document.getElementById('shopCurrentCashDisplay');
        const shopPointsDisplay = document.getElementById('shopCurrentPointsDisplay');
        if (shopCashDisplay) shopCashDisplay.textContent = currentCash.toFixed(1);
        if (shopPointsDisplay) shopPointsDisplay.textContent = currentPoints;
        let convCount = getGameVar('conversionCount', 0);
        const baseConvRate = 10;
        const rateIncPerBlk = 10;
        const convsPerBlk = 8;
        const currentConvBlk = Math.floor(convCount / convsPerBlk);
        const dynamicRate = baseConvRate + (currentConvBlk * rateIncPerBlk);

        // Cash to Points Conversion UI
        const currentCashForConversionDisplay = document.getElementById('currentCashForConversion');
        if (currentCashForConversionDisplay) currentCashForConversionDisplay.textContent = currentCash.toFixed(1);
        
        const conversionRateDisplay = document.getElementById('conversionRateInfo');
        if (conversionRateDisplay) {
            conversionRateDisplay.innerHTML = `Rate: <strong style="color: #FFD700;">${dynamicRate} Cash</strong> = <strong style="color: #FFFFFF;">1 Point</strong>`;
        }

        // Cash Clicker Upgrader
        const clickUpgraderBtn = document.getElementById('buyClickUpgrader');
        const clickUpgraderInfo = document.getElementById('clickUpgraderInfo');
        if (clickUpgraderBtn && clickUpgraderInfo) {
            let uLevel = getGameVar('upgradeLevel', 1);
            let uCost = getGameVar('upgradeCost', 10);
            let cValue = getFloatGameVar('clickValue', 0.25);
            if (uLevel >= maxUpgradeLevel) {
                clickUpgraderInfo.textContent = `Value: ${cValue.toFixed(2)} Cash/click (Maxed!)`;
                clickUpgraderBtn.textContent = 'Maxed Out';
                clickUpgraderBtn.disabled = true;
            } else {
                clickUpgraderInfo.textContent = `Lvl ${uLevel}. Value: ${cValue.toFixed(2)} Cash. Next Lvl Cost: ${uCost} Points`;
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
            let mcPurchaseCount = getGameVar('mightyCashPurchaseCount', 0);
            const baseMcCost = 250;
            const mcCostIncrease = 150;
            const currentMcCost = baseMcCost + (mcPurchaseCount * mcCostIncrease);
            clickBoostBtn.textContent = `Buy Mighty Cash (${currentMcCost} Points)`;
            clickBoostBtn.disabled = currentPoints < currentMcCost;
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
