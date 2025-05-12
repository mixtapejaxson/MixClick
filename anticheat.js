// Configuration
const anticheatConfig = {
    rightClickMessage: 'ANTICHEAT: Right-click Context Menu Blocked!',
    keyEventMessage: 'ANTICHEAT: Key events blocked!',
    allowedKeys: ['F5', 'Ctrl', 'Shift', 'Tab'], // Added Tab for accessibility, kept dev keys
    autoclickDetectionIntervalMs: 85, // Time window in ms to detect clicks
    autoclickMaxClicksInInterval: 2,   // Number of clicks within the interval to trigger a warning
    warningsBeforeReset: 5, // Number of warnings before progress is reset

    // Value Integrity Checks (Tune these carefully!)
    valueCheckIntervalMs: 3000,           // How often (ms) to check player cash/points values
    maxCashIncreasePerSec: 100000,        // Max legitimate cash increase per second (NEEDS TUNING)
    maxPointsIncreasePerSec: 10000,       // Max legitimate points increase per second (NEEDS TUNING)
    valueSpikeBufferMultiplier: 1.5,      // Allows 50% extra buffer for legitimate spikes
    minTimeDiffForValueCheckSec: 1,     // Min time diff for a meaningful check

    saveFileIntegrityCheck: false, // Keep this false unless fully implemented and tested with save.js
    saveFileSalt: 'somesupersecretstring',
};

// Modal state
let isModalOpen = false;

// Disable right-click context menu
document.addEventListener('contextmenu', function(event) {
    if (isModalOpen) {
        event.preventDefault(); // Also prevent context menu when modal is open
        return;
    }
    event.preventDefault();
    let message = document.createElement('div');
    message.style.cssText = 'position:fixed;top:10px;right:10px;padding:10px;background-color:red;color:white;z-index:2000;border-radius:5px;';
    message.textContent = anticheatConfig.rightClickMessage;
    document.body.appendChild(message);
    console.warn(anticheatConfig.rightClickMessage);
    setTimeout(() => { if(document.body.contains(message)) document.body.removeChild(message); }, 3000);
});

// Prevent key events (allow some for dev/accessibility)
document.addEventListener('keydown', function(event) {
    if (isModalOpen && event.key !== 'Escape') { // Allow Esc to potentially close modal if we add that later
        event.preventDefault();
        return;
    }
    if (!anticheatConfig.allowedKeys.includes(event.key) && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        let message = document.createElement('div');
        message.style.cssText = 'position:fixed;top:10px;right:10px;padding:10px;background-color:red;color:white;z-index:2000;border-radius:5px;';
        message.textContent = anticheatConfig.keyEventMessage;
        document.body.appendChild(message);
        console.warn(anticheatConfig.keyEventMessage + ' Blocked key: ' + event.key);
        setTimeout(() => { if(document.body.contains(message)) document.body.removeChild(message); }, 3000);
    }
});

// Anti-autoclicker
let warningCounter = 0; 
let clickTimestamps = []; // Array to store recent click timestamps

document.addEventListener('click', function(event) {
    if (isModalOpen && !(event.target && event.target.closest && event.target.closest('#anticheatWarningModal'))) { // Prevent clicks behind the modal, but allow clicks ON the modal
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
    }

    const currentTime = new Date().getTime();

    if (event.target && event.target.closest && event.target.closest('#anticheatWarningModal')) {
        clickTimestamps = []; 
        return;
    }

    clickTimestamps.push(currentTime);
    clickTimestamps = clickTimestamps.filter(timestamp => currentTime - timestamp < anticheatConfig.autoclickDetectionIntervalMs);

    if (clickTimestamps.length === anticheatConfig.autoclickMaxClicksInInterval) {
        event.preventDefault(); 
        event.stopImmediatePropagation(); 
        
        warningCounter++;
        console.warn(`ANTICHEAT: Rapid clicking detected (${clickTimestamps.length} clicks in interval). Warning ${warningCounter}/${anticheatConfig.warningsBeforeReset}`);
        
        clickTimestamps = []; 

        if (warningCounter >= anticheatConfig.warningsBeforeReset) {
            triggerProgressReset();
        } else {
            const remainingWarnings = anticheatConfig.warningsBeforeReset - warningCounter;
            showAutoclickWarningModal(remainingWarnings);
        }
    }
}, true); 

function showAutoclickWarningModal(remainingWarnings) {
    if (isModalOpen) return; 
    isModalOpen = true;

    const overlay = document.createElement('div');
    overlay.id = 'anticheatWarningOverlay';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.7); z-index: 10000; display: flex; justify-content: center; align-items: center;';

    const modal = document.createElement('div');
    modal.id = 'anticheatWarningModal';
    modal.style.cssText = 'background-color: #333; color: #fff; padding: 30px; border-radius: 10px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.5); min-width: 300px; max-width: 80%; font-family: Ubuntu, sans-serif; z-index: 10001;';

    const title = document.createElement('h2');
    title.textContent = 'Warning!';
    title.style.color = '#ffcc00';
    title.style.marginTop = '0';

    const message = document.createElement('p');
    message.innerHTML = `We have detected suspicious clicking activity.<br>After <strong>${remainingWarnings}</strong> more detection(s), your game progress will be reset.`;
    message.style.marginBottom = '20px';
    message.style.lineHeight = '1.6';

    const okButton = document.createElement('button');
    let countdown = 5;
    okButton.textContent = `OK (${countdown})`;
    okButton.disabled = true;
    okButton.style.cssText = 'padding: 10px 20px; border: none; border-radius: 5px; background-color: #555; color: #ccc; cursor: not-allowed; font-size: 1em;';

    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            okButton.textContent = `OK (${countdown})`;
        } else {
            clearInterval(countdownInterval);
            okButton.textContent = 'OK';
            okButton.disabled = false;
            okButton.style.backgroundColor = '#ff6600';
            okButton.style.color = '#fff';
            okButton.style.cursor = 'pointer';
            console.log("OK button enabled via countdown.");
        }
    }, 1000);

    okButton.addEventListener('click', () => {
        if(document.body.contains(overlay)) document.body.removeChild(overlay);
        isModalOpen = false;
        clickTimestamps = []; 
    });

    modal.appendChild(title);
    modal.appendChild(message);
    modal.appendChild(okButton);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

function triggerProgressReset() {
    isModalOpen = true; 
    console.warn('ANTICHEAT: Progress reset due to persistent autoclicking.');

    const overlay = document.createElement('div');
    overlay.id = 'anticheatResetOverlay';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.85); z-index: 9998; display: flex; justify-content: center; align-items: center; text-align: center;';
    const modal = document.createElement('div');
    modal.style.cssText = 'background-color: #aa0000; color: #fff; padding: 30px; border-radius: 10px; font-family: Ubuntu, sans-serif;';
    modal.innerHTML = '<h2>Progress Reset</h2><p>Your game progress has been reset due to persistent autoclicker detection.</p>';
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    if (typeof window.resetGame === 'function') {
        window.resetGame();
    } else {
        console.error('resetGame function not found on window object!');
        localStorage.removeItem('progress');
        localStorage.removeItem('score');
        // ... and other critical items
    }
    warningCounter = 0; 

    setTimeout(() => {
        if(document.body.contains(overlay)) document.body.removeChild(overlay);
        isModalOpen = false;
    }, 4000);
}

// --- Value Integrity Checks ---
let ac_lastKnownCash = 0.0;
let ac_lastKnownPoints = 0;
let ac_lastValueCheckTimestamp = Date.now();
let ac_valueIntegrityIntervalId = null;

function ac_showUIMessage(text, color = 'orange', duration = 4000) {
    if (typeof showUIMessage === 'function') { 
        showUIMessage(text, color, duration);
    } else {
        console.warn("ANTICHEAT: global showUIMessage not found. Fallback for:", text);
        let messageElId = 'anticheat_value_warning_message';
        let messageEl = document.getElementById(messageElId);
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = messageElId;
            messageEl.style.cssText = 'position:fixed;bottom:60px;left:50%;transform:translateX(-50%);padding:10px 20px;background-color:orange;color:white;z-index:2005;border-radius:5px;text-align:center;box-shadow: 0 0 10px rgba(0,0,0,0.5);';
            document.body.appendChild(messageEl);
        }
        messageEl.textContent = text;
        messageEl.style.display = 'block';
        setTimeout(() => { if (messageEl) messageEl.style.display = 'none'; }, duration);
    }
}

function performValueIntegrityCheck() {
    if (typeof window === 'undefined' || typeof window.playerCash === 'undefined' || typeof window.playerPoints === 'undefined') {
        return; 
    }

    let currentCashInWindow = window.playerCash;
    let currentPointsInWindow = window.playerPoints;
    let cashCorrected = false;
    let pointsCorrected = false;

    const currentTime = Date.now();
    let timeElapsedSec = (currentTime - ac_lastValueCheckTimestamp) / 1000;

    if (timeElapsedSec < anticheatConfig.minTimeDiffForValueCheckSec && timeElapsedSec >= 0) {
        return; 
    }
    if (timeElapsedSec < 0) { 
        console.warn("ANTICHEAT: System clock moved backwards. Resetting value check baseline.");
        ac_lastValueCheckTimestamp = currentTime;
        ac_lastKnownCash = currentCashInWindow;
        ac_lastKnownPoints = currentPointsInWindow;
        return;
    }

    const maxExpectedCash = (ac_lastKnownCash + 0.001) + (anticheatConfig.maxCashIncreasePerSec * timeElapsedSec * anticheatConfig.valueSpikeBufferMultiplier);
    if (currentCashInWindow > maxExpectedCash && currentCashInWindow > ac_lastKnownCash) { 
        console.warn(`ANTICHEAT: Player CASH spike! Window: ${currentCashInWindow.toFixed(1)}, Max Expected: ${maxExpectedCash.toFixed(1)}, Last Known: ${ac_lastKnownCash.toFixed(1)}. dT: ${timeElapsedSec.toFixed(2)}s`);
        currentCashInWindow = parseFloat(maxExpectedCash.toFixed(0)); 
        window.playerCash = currentCashInWindow; 
        localStorage.setItem('playerCash', currentCashInWindow.toString()); 
        const cashDisplayEl = document.getElementById('playerCashDisplay');
        if (cashDisplayEl) cashDisplayEl.textContent = `Cash: ${currentCashInWindow.toFixed(1)}`;
        cashCorrected = true;
    }

    const maxExpectedPoints = (ac_lastKnownPoints + 1) + (anticheatConfig.maxPointsIncreasePerSec * timeElapsedSec * anticheatConfig.valueSpikeBufferMultiplier);
    if (currentPointsInWindow > maxExpectedPoints && currentPointsInWindow > ac_lastKnownPoints) {
        console.warn(`ANTICHEAT: Player POINTS spike! Window: ${currentPointsInWindow}, Max Expected: ${maxExpectedPoints.toFixed(0)}, Last Known: ${ac_lastKnownPoints}. dT: ${timeElapsedSec.toFixed(2)}s`);
        currentPointsInWindow = parseInt(maxExpectedPoints.toFixed(0));
        window.playerPoints = currentPointsInWindow; 
        localStorage.setItem('score', currentPointsInWindow.toString()); 
        const pointsDisplayEl = document.getElementById('playerPointsDisplay');
        if (pointsDisplayEl) pointsDisplayEl.textContent = `Points: ${currentPointsInWindow}`;
        pointsCorrected = true;
    }

    if (cashCorrected || pointsCorrected) {
        ac_showUIMessage("Suspicious game values corrected.", "orange");
    }

    ac_lastKnownCash = currentCashInWindow; 
    ac_lastKnownPoints = currentPointsInWindow; 
    ac_lastValueCheckTimestamp = currentTime;
}

window.antiCheatInitializeValueChecks = function(initialCash, initialPoints) {
    console.log("ANTICHEAT: Initializing value integrity checks with game state:", { initialCash, initialPoints });
    ac_lastKnownCash = parseFloat(initialCash) || 0.0;
    ac_lastKnownPoints = parseInt(initialPoints) || 0;
    ac_lastValueCheckTimestamp = Date.now();

    if (ac_valueIntegrityIntervalId) clearInterval(ac_valueIntegrityIntervalId);
    ac_valueIntegrityIntervalId = setInterval(performValueIntegrityCheck, anticheatConfig.valueCheckIntervalMs);
    console.log(`ANTICHEAT: Value integrity check interval started (every ${anticheatConfig.valueCheckIntervalMs}ms).`);
};

setTimeout(() => {
    if (!ac_valueIntegrityIntervalId && typeof window !== 'undefined' && 
        typeof window.playerCash !== 'undefined' && typeof window.playerPoints !== 'undefined') {
        if (localStorage.getItem('progress') || window.playerCash !== 0 || window.playerPoints !== 0 ) { // Try to see if game has some state
             console.warn("ANTICHEAT: Attempting delayed self-initialization of value integrity checks. Explicit call to antiCheatInitializeValueChecks from game is preferred.");
            window.antiCheatInitializeValueChecks(window.playerCash, window.playerPoints);
        } else {
            console.log("ANTICHEAT: Delayed self-init for value checks skipped (no progress/initial values look zero). Waiting for explicit call.");
        }
    }
}, 3000); 

// Save file integrity check (example - adapt to your save system)
// Currently disabled in config. If enabled, ensure it's adapted for save.js structure.
// if (anticheatConfig.saveFileIntegrityCheck) { ... }
