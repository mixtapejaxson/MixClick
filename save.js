// Copyright (c) 2025 mixtapejaxson
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// Base64 Encoder
function base64Encode(str) {
    try {
        return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
        console.error("Base64 encoding failed", e);
        return str; // Fallback
    }
}

// Base64 Decoder
function base64Decode(encodedStr) {
    try {
        return decodeURIComponent(escape(atob(encodedStr)));
    } catch (e) {
        console.error("Base64 decoding failed", e);
        return encodedStr; // Fallback
    }
}

// Show Message Utility (now relies on window.showMessage if available in parent)
function showUIMessage(text, color = 'black', duration = 3000) {
    if (window.parent && typeof window.parent.showMessage === 'function') {
        window.parent.showMessage(text, color, duration);
    } else {
        // Fallback for if this script is run in isolation or parent doesn't have showMessage
        const messageEl = document.createElement('div');
        messageEl.style.position = 'fixed';
        messageEl.style.bottom = '20px';
        messageEl.style.left = '50%';
        messageEl.style.transform = 'translateX(-50%)';
        messageEl.style.padding = '10px 20px';
        messageEl.style.backgroundColor = color;
        messageEl.style.color = 'white';
        if (color === 'black' || color === 'gray') messageEl.style.color = '#ddd';
        if (color === 'green') messageEl.style.backgroundColor = '#28a745';
        if (color === 'red') messageEl.style.backgroundColor = '#dc3545';
        if (color === 'orange') messageEl.style.backgroundColor = '#fd7e14';
        messageEl.style.borderRadius = '5px';
        messageEl.style.zIndex = '1001'; // Above most content
        messageEl.style.textAlign = 'center';
        messageEl.textContent = text;
        document.body.appendChild(messageEl);
        setTimeout(() => {
            if (document.body.contains(messageEl)) {
                document.body.removeChild(messageEl);
            }
        }, duration);
    }
}


function saveProgress(isAutoSave = false) {
    // Access global game variables from the main window (index.html)
    const playerCashToSave = window.playerCash || parseFloat(localStorage.getItem('playerCash')) || 0.0;
    const playerPointsToSave = window.playerPoints || parseInt(localStorage.getItem('score')) || 0;
    const clickValueToSave = window.clickValue || parseFloat(localStorage.getItem('clickValue')) || 0.25;
    const upgradeLevelToSave = window.upgradeLevel || parseInt(localStorage.getItem('upgradeLevel')) || 1;
    const upgradeCostToSave = window.upgradeCost || parseInt(localStorage.getItem('upgradeCost')) || 10;

    const progress = {
        playerCash: playerCashToSave.toFixed(1), // Store cash with 1 decimal place
        playerPoints: playerPointsToSave,
        clickValue: clickValueToSave.toFixed(2), // Store clickValue with 2 decimal places
        upgradeLevel: upgradeLevelToSave,
        upgradeCost: upgradeCostToSave,
        
        // Shop items from localStorage directly (ensure consistent string storage)
        doubleClick: localStorage.getItem('doubleClick') === 'true',
        autoClicker: localStorage.getItem('autoClicker') === 'true',
        clickBoostActive: localStorage.getItem('clickBoostActive') === 'true',
        clickBoostEndTime: localStorage.getItem('clickBoostEndTime') || null,
        gamblingCooldownReduction: localStorage.getItem('gamblingCooldownReduction') || '0',
        gamblingCooldownLevel: localStorage.getItem('gamblingCooldownLevel') || '0',
        interestRate: localStorage.getItem('interestRate') || '0',
        interestLevel: localStorage.getItem('interestLevel') || '0',

        // Dynamic shop pricing trackers
        conversionCount: localStorage.getItem('conversionCount') || '0',
        mightyCashPurchaseCount: localStorage.getItem('mightyCashPurchaseCount') || '0'
    };

    try {
        const serializedProgress = JSON.stringify(progress);
        const encodedProgress = base64Encode(serializedProgress);
        localStorage.setItem('progress', encodedProgress);

        if (!isAutoSave) {
            showUIMessage("Progress Saved!", 'green');
        } else {
            console.log("Progress auto-saved.");
        }
    } catch (e) {
        console.error("Error saving progress:", e);
        if (!isAutoSave) showUIMessage("Error saving progress!", 'red');
    }
}

function loadProgress() {
    const encodedProgress = localStorage.getItem('progress');

    if (encodedProgress) {
        try {
            const decodedProgress = base64Decode(encodedProgress);
            const progress = JSON.parse(decodedProgress);

            // Update global variables in index.html scope
            window.playerCash = parseFloat(progress.playerCash) || 0.0;
            window.playerPoints = parseInt(progress.playerPoints) || 0;
            window.clickValue = parseFloat(progress.clickValue) || 0.25;
            window.upgradeLevel = parseInt(progress.upgradeLevel) || 1;
            window.upgradeCost = parseInt(progress.upgradeCost) || 10;
            
            // Load shop items status directly into localStorage
            localStorage.setItem('doubleClick', progress.doubleClick ? 'true' : 'false');
            localStorage.setItem('autoClicker', progress.autoClicker ? 'true' : 'false');
            if (progress.clickBoostActive && progress.clickBoostEndTime) {
                localStorage.setItem('clickBoostActive', 'true');
                localStorage.setItem('clickBoostEndTime', progress.clickBoostEndTime);
            } else {
                localStorage.removeItem('clickBoostActive');
                localStorage.removeItem('clickBoostEndTime');
            }
            localStorage.setItem('gamblingCooldownReduction', progress.gamblingCooldownReduction || '0');
            localStorage.setItem('gamblingCooldownLevel', progress.gamblingCooldownLevel || '0');
            localStorage.setItem('interestRate', progress.interestRate || '0');
            localStorage.setItem('interestLevel', progress.interestLevel || '0');

            // Load dynamic shop pricing trackers into localStorage
            localStorage.setItem('conversionCount', progress.conversionCount || '0');
            localStorage.setItem('mightyCashPurchaseCount', progress.mightyCashPurchaseCount || '0');

            // Update UI from loaded values - ensure elements exist
            const playerCashDisplayEl = document.getElementById('playerCashDisplay');
            const playerPointsDisplayEl = document.getElementById('playerPointsDisplay');
            if (playerCashDisplayEl) playerCashDisplayEl.textContent = `Cash: ${window.playerCash.toFixed(1)}`;
            if (playerPointsDisplayEl) playerPointsDisplayEl.textContent = `Points: ${window.playerPoints}`;
            
            // Update localStorage for shop to read correct initial values upon opening after load
            localStorage.setItem('playerCash', window.playerCash.toFixed(1)); // Save full precision
            localStorage.setItem('score', window.playerPoints.toString()); // Shop uses 'score' for playerPoints
            
            showUIMessage("Progress Loaded!", 'green');

            // Re-initialize intervals based on loaded state (functions must be global in index.html)
            if (typeof window.checkMightyClicks === 'function') window.checkMightyClicks();
            if (typeof window.initializeInterestInterval === 'function') window.initializeInterestInterval();
            if (typeof window.initializeAutoClicker === 'function') window.initializeAutoClicker();


            // Initialize anticheat value checks with loaded values
            if (typeof window.antiCheatInitializeValueChecks === 'function') {
                window.antiCheatInitializeValueChecks(window.playerCash, window.playerPoints);
            }

        } catch (e) {
            console.error("Error loading progress:", e);
            showUIMessage("Failed to load progress. Save might be corrupted.", "red");
            localStorage.removeItem('progress'); // Corrupted save removed
            // Even if load fails, try to init anticheat with default values
            if (typeof window.antiCheatInitializeValueChecks === 'function') {
                window.antiCheatInitializeValueChecks(0.0, 0);
            }
        }
    } else {
        showUIMessage("No saved progress found.", "orange");
        // No save found, ensure playerCash/Points are at default before calling anticheat
        window.playerCash = 0.0;
        window.playerPoints = 0;
        window.clickValue = 0.25;
        window.upgradeLevel = 1;
        window.upgradeCost = 10;

        if (typeof window.antiCheatInitializeValueChecks === 'function') {
            window.antiCheatInitializeValueChecks(window.playerCash, window.playerPoints);
        }
    }
}

// Auto Save Progress
// Ensure this interval is only set once, perhaps in index.html or with a check
setInterval(() => saveProgress(true), 30000);
