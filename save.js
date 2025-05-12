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

// Show Message Utility (from save.js, can be kept here or moved to a general utils.js if one exists)
function showUIMessage(text, color = 'black', duration = 3000) { // Renamed to avoid conflict if index.html also has showMessage
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


function saveProgress(isAutoSave = false) {
    // Assumes playerCash, playerPoints, clickValue, etc. are global on window object from index.html
    const progress = {
        playerCash: window.playerCash || 0,
        playerPoints: window.playerPoints || 0,
        clickValue: window.clickValue || 1,
        upgradeLevel: window.upgradeLevel || 1,
        upgradeCost: window.upgradeCost || 10,
        
        // Shop items from localStorage directly
        doubleClick: localStorage.getItem('doubleClick') === 'true',
        autoClicker: localStorage.getItem('autoClicker') === 'true',
        clickBoostActive: localStorage.getItem('clickBoostActive') === 'true',
        clickBoostEndTime: localStorage.getItem('clickBoostEndTime') || null,
        gamblingCooldownReduction: localStorage.getItem('gamblingCooldownReduction') || '0',
        gamblingCooldownLevel: localStorage.getItem('gamblingCooldownLevel') || '0',
        interestRate: localStorage.getItem('interestRate') || '0',
        interestLevel: localStorage.getItem('interestLevel') || '0'
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
            window.playerCash = parseInt(progress.playerCash) || 0;
            window.playerPoints = parseInt(progress.playerPoints) || 0;
            window.clickValue = parseInt(progress.clickValue) || 1;
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

            // Update UI from loaded values - ensure elements exist
            const playerCashDisplayEl = document.getElementById('playerCashDisplay');
            const playerPointsDisplayEl = document.getElementById('playerPointsDisplay');
            if (playerCashDisplayEl) playerCashDisplayEl.textContent = `Cash: ${window.playerCash}`;
            if (playerPointsDisplayEl) playerPointsDisplayEl.textContent = `Points: ${window.playerPoints}`;
            
            // Update localStorage for shop to read correct initial values upon opening after load
            localStorage.setItem('playerCash', window.playerCash.toString());
            localStorage.setItem('score', window.playerPoints.toString()); // Shop uses 'score' for playerPoints

            showUIMessage("Progress Loaded!", 'green');

            // Re-initialize intervals based on loaded state (functions must be global in index.html)
            if (typeof window.checkMightyClicks === 'function') window.checkMightyClicks();
            if (typeof window.initializeInterestInterval === 'function') window.initializeInterestInterval();

        } catch (e) {
            console.error("Error loading progress:", e);
            showUIMessage("Failed to load progress. Save might be corrupted.", "red");
            localStorage.removeItem('progress'); // Corrupted save removed
        }
    } else {
        showUIMessage("No saved progress found.", "orange");
    }
}

// This function might be redundant if index.html's resetGame is comprehensive and calls it or covers all aspects.
// However, keeping it ensures that if called directly, it clears everything it knows about.
function resetProgress() {
    console.warn("resetProgress() in save.js called. Ensure this is intended alongside index.html resetGame.");
    // Reset global game variables in index.html scope (if they are global)
    if(window) {
        window.playerCash = 0;
        window.playerPoints = 0;
        window.clickValue = 1; 
        window.upgradeLevel = 1; 
        window.upgradeCost = 10;
    }

    // Clear main progress file from localStorage
    localStorage.removeItem('progress');

    // Clear all individual game state and shop-specific items from localStorage
    const itemsToClear = [
        'doubleClick', 'autoClicker', 'clickBoostActive', 'clickBoostEndTime',
        'gamblingCooldownLevel', 'gamblingCooldownReduction', 
        'interestLevel', 'interestRate', 
        'score',          // PlayerPoints for the shop
        'playerCash',     // Earned cash
        'clickValue', 'upgradeLevel', 'upgradeCost'
    ];
    itemsToClear.forEach(item => localStorage.removeItem(item));

    // Update UI elements if available (mostly handled by index.html's resetGame now)
    const playerCashDisplayEl = document.getElementById('playerCashDisplay');
    const playerPointsDisplayEl = document.getElementById('playerPointsDisplay');
    if (playerCashDisplayEl) playerCashDisplayEl.textContent = `Cash: 0`;
    if (playerPointsDisplayEl) playerPointsDisplayEl.textContent = `Points: 0`;
            
    // Explicitly set initial values for shop after clearing
    localStorage.setItem('playerCash', '0');
    localStorage.setItem('score', '0');

    showUIMessage("Progress Reset!", 'red');
    
    // Re-initialize intervals to ensure they stop or reset to initial state
    if (typeof window.checkMightyClicks === 'function') window.checkMightyClicks(); // will find boostActive is false
    if (typeof window.initializeInterestInterval === 'function') window.initializeInterestInterval(); // will find rate is 0
}

// Auto Save Progress
setInterval(() => saveProgress(true), 30000);
