// Copyright (c) 2025 mixtapejaxson
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// Configuration
const anticheatConfig = {
    rightClickMessage: 'ANTICHEAT: Right-click Context Menu Blocked!',
    keyEventMessage: 'ANTICHEAT: Key events blocked!',
    allowedKeys: ['F5', 'Ctrl', 'Shift', 'Tab'], // Added Tab for accessibility, kept dev keys
    warningsBeforeReset: 5, // Number of warnings before progress is reset

    // Dynamic Autoclick Detection (Tune these carefully!)
    autoclickMinIntervalMs: 50,           // Minimum legitimate time (ms) expected between clicks. Anything faster is suspicious.
    autoclickConsistencyThresholdMs: 10,  // How close (ms) consecutive click intervals need to be to be considered "consistent".
    autoclickCheckCount: 4,               // Number of *consecutive intervals* to check for consistency. (Requires autoclickCheckCount + 1 clicks)

    // Value Integrity Checks (Tune these carefully!)
    valueCheckIntervalMs: 3000,           // How often (ms) to check player cash/points values
    maxCashIncreasePerSec: 100000,        // Max legitimate cash increase per second (NEEDS TUNING)
    maxPointsIncreasePerSec: 10000,       // Max legitimate points increase per second (NEEDS TUNING)
    valueSpikeBufferMultiplier: 1.5,      // Allows 50% extra buffer for legitimate spikes
    minTimeDiffForValueCheckSec: 1,     // Min time diff for a meaningful check

    saveFileIntegrityCheck: false, // Keep this false unless fully implemented and tested with save.js
    saveFileSalt: 'somesupersecretstring',
};

// Modal state - now managed more carefully to avoid conflicts
let isAnticheatModalOpen = false; // Renamed to avoid conflict with general 'isModalOpen'

// Disable right-click context menu
document.addEventListener('contextmenu', function(event) {
    if (isAnticheatModalOpen) { // Only prevent if an anticheat modal is specifically open
        event.preventDefault();
        return;
    }
    event.preventDefault();
    // Use the main window's showMessage function if available
    if (typeof window.showMessage === 'function') {
        window.showMessage(anticheatConfig.rightClickMessage, 'red');
    } else {
        console.warn(anticheatConfig.rightClickMessage);
    }
});

// Prevent key events (allow some for dev/accessibility)
document.addEventListener('keydown', function(event) {
    // Get a reference to the reset confirmation modal
    const resetConfirmModal = document.getElementById('resetConfirmModal');

    // If the reset confirmation modal is open, allow all key presses
    if (resetConfirmModal && resetConfirmModal.style.display === 'flex') {
        return; // Do not prevent default for any key when the reset modal is open
    }

    // Existing anti-cheat key blocking logic
    if (isAnticheatModalOpen && event.key !== 'Escape') { // Allow Esc to potentially close modal if we add that later
        event.preventDefault();
        return;
    }
    // Check if Ctrl or Meta (Command on Mac) is pressed along with an allowed key
    const isModifierKey = event.metaKey || event.ctrlKey;
    if (!anticheatConfig.allowedKeys.includes(event.key) && !isModifierKey) {
        event.preventDefault();
        if (typeof window.showMessage === 'function') {
            window.showMessage(anticheatConfig.keyEventMessage + ' Blocked key: ' + event.key, 'red');
        } else {
            console.warn(anticheatConfig.keyEventMessage + ' Blocked key: ' + event.key);
        }
    }
});

// Anti-autoclicker
let warningCounter = 0;
let clickTimestamps = []; // Array to store recent click timestamps

document.addEventListener('click', function(event) {
    // If an anticheat modal is open, prevent clicks behind it
    if (isAnticheatModalOpen && !(event.target && event.target.closest && event.target.closest('#anticheatWarningModal'))) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
    }

    const currentTime = new Date().getTime();

    // If click is on the anticheat warning modal, clear timestamps and return
    if (event.target && event.target.closest && event.target.closest('#anticheatWarningModal')) {
        clickTimestamps = [];
        return;
    }

    clickTimestamps.push(currentTime);

    // Keep only the last N+1 timestamps needed for N intervals
    const requiredTimestamps = anticheatConfig.autoclickCheckCount + 1;
    if (clickTimestamps.length > requiredTimestamps) {
        clickTimestamps.shift(); // Remove the oldest timestamp
    }

    // Only proceed if we have enough click timestamps to form the required number of intervals
    if (clickTimestamps.length === requiredTimestamps) {
        let allConsistent = true;
        
        // Start checking from the second click to form the first interval
        for (let i = 1; i < clickTimestamps.length; i++) {
            const currentInterval = clickTimestamps[i] - clickTimestamps[i-1];

            // Check if the current interval is too fast
            if (currentInterval > anticheatConfig.autoclickMinIntervalMs) {
                allConsistent = false;
                break; // Not consistently fast enough
            }

            // If not the very first interval, check consistency with the previous one
            if (i > 1) {
                const previousInterval = clickTimestamps[i-1] - clickTimestamps[i-2];
                if (Math.abs(currentInterval - previousInterval) > anticheatConfig.autoclickConsistencyThresholdMs) {
                    allConsistent = false;
                    break; // Not consistent enough
                }
            }
        }

        if (allConsistent) {
            event.preventDefault();
            event.stopImmediatePropagation();

            warningCounter++;
            console.warn(`ANTICHEAT: Dynamic autoclick detected! Warning ${warningCounter}/${anticheatConfig.warningsBeforeReset}`);

            clickTimestamps = []; // Reset timestamps after detection

            if (warningCounter >= anticheatConfig.warningsBeforeReset) {
                triggerProgressReset();
            } else {
                const remainingWarnings = anticheatConfig.warningsBeforeReset - warningCounter;
                showAutoclickWarningModal(remainingWarnings);
            }
        }
    }
}, true); // Use capture phase to ensure it runs before other click handlers

function showAutoclickWarningModal(remainingWarnings) {
    if (isAnticheatModalOpen) return; // Prevent multiple modals
    isAnticheatModalOpen = true;

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
        isAnticheatModalOpen = false;
        clickTimestamps = []; // Clear timestamps when modal is dismissed
    });

    modal.appendChild(title);
    modal.appendChild(message);
    modal.appendChild(okButton);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

function triggerProgressReset() {
    isAnticheatModalOpen = true; // Set modal state
    console.warn('ANTICHEAT: Progress reset due to persistent autoclicker detection.');

    const overlay = document.createElement('div');
    overlay.id = 'anticheatResetOverlay';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.85); z-index: 9998; display: flex; justify-content: center; align-items: center; text-align: center;';
    const modal = document.createElement('div');
    modal.style.cssText = 'background-color: #aa0000; color: #fff; padding: 30px; border-radius: 10px; font-family: Ubuntu, sans-serif;';
    modal.innerHTML = '<h2>Progress Reset</h2><p>Your game progress has been reset due to persistent autoclicker detection.</p>';
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Call the global resetGame function from index.html
    if (typeof window.resetGame === 'function') {
        window.resetGame();
    } else {
        console.error('resetGame function not found on window object! Performing partial reset.');
        // Fallback: clear critical localStorage items if resetGame is not available
        localStorage.removeItem('progress');
        localStorage.removeItem('score');
        localStorage.removeItem('playerCash');
        // Add other critical items to clear if resetGame is truly missing
    }
    warningCounter = 0; // Reset warning counter after a full reset

    setTimeout(() => {
        if(document.body.contains(overlay)) document.body.removeChild(overlay);
        isAnticheatModalOpen = false; // Reset modal state after timeout
    }, 4000);
}

// --- Value Integrity Checks ---
let ac_lastKnownCash = 0.0;
let ac_lastKnownPoints = 0;
let ac_lastValueCheckTimestamp = Date.now();
let ac_valueIntegrityIntervalId = null;

// Use the main window's showMessage for consistency
function ac_showUIMessage(text, color = 'orange', duration = 4000) {
    if (typeof window.showMessage === 'function') {
        window.showMessage(text, color, duration);
    } else {
        console.warn("ANTICHEAT: global showMessage not found. Fallback for:", text);
        // Fallback to a simple console log if showMessage is not available
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
    // Ensure window.playerCash and window.playerPoints are defined and accessible
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
    if (timeElapsedSec < 0) { // Handle system clock moving backwards
        console.warn("ANTICHEAT: System clock moved backwards. Resetting value check baseline.");
        ac_lastValueCheckTimestamp = currentTime;
        ac_lastKnownCash = currentCashInWindow;
        ac_lastKnownPoints = currentPointsInWindow;
        return;
    }

    const maxExpectedCash = (ac_lastKnownCash + 0.001) + (anticheatConfig.maxCashIncreasePerSec * timeElapsedSec * anticheatConfig.valueSpikeBufferMultiplier);
    if (currentCashInWindow > maxExpectedCash && currentCashInWindow > ac_lastKnownCash) {
        console.warn(`ANTICHEAT: Player CASH spike! Window: ${currentCashInWindow.toFixed(1)}, Max Expected: ${maxExpectedCash.toFixed(1)}, Last Known: ${ac_lastKnownCash.toFixed(1)}. dT: ${timeElapsedSec.toFixed(2)}s`);
        // Correct the value in window.playerCash and localStorage
        window.playerCash = parseFloat(maxExpectedCash.toFixed(1)); // Round to 1 decimal place for cash
        localStorage.setItem('playerCash', window.playerCash.toFixed(1));
        const cashDisplayEl = document.getElementById('playerCashDisplay');
        if (cashDisplayEl) cashDisplayEl.textContent = `Cash: ${window.playerCash.toFixed(1)}`;
        cashCorrected = true;
    }

    const maxExpectedPoints = (ac_lastKnownPoints + 1) + (anticheatConfig.maxPointsIncreasePerSec * timeElapsedSec * anticheatConfig.valueSpikeBufferMultiplier);
    if (currentPointsInWindow > maxExpectedPoints && currentPointsInWindow > ac_lastKnownPoints) {
        console.warn(`ANTICHEAT: Player POINTS spike! Window: ${currentPointsInWindow}, Max Expected: ${maxExpectedPoints.toFixed(0)}, Last Known: ${ac_lastKnownPoints}. dT: ${timeElapsedSec.toFixed(2)}s`);
        // Correct the value in window.playerPoints and localStorage
        window.playerPoints = parseInt(maxExpectedPoints.toFixed(0)); // Round to integer for points
        localStorage.setItem('score', window.playerPoints.toString());
        const pointsDisplayEl = document.getElementById('playerPointsDisplay');
        if (pointsDisplayEl) pointsDisplayEl.textContent = `Points: ${window.playerPoints}`;
        pointsCorrected = true;
    }

    if (cashCorrected || pointsCorrected) {
        ac_showUIMessage("Suspicious game values corrected.", "orange");
    }

    // Update last known values for the next check
    ac_lastKnownCash = window.playerCash;
    ac_lastKnownPoints = window.playerPoints;
    ac_lastValueCheckTimestamp = currentTime;
}

// Global function to initialize anti-cheat value checks
window.antiCheatInitializeValueChecks = function(initialCash, initialPoints) {
    console.log("ANTICHEAT: Initializing value integrity checks with game state:", { initialCash, initialPoints });
    ac_lastKnownCash = parseFloat(initialCash) || 0.0;
    ac_lastKnownPoints = parseInt(initialPoints) || 0;
    ac_lastValueCheckTimestamp = Date.now();

    if (ac_valueIntegrityIntervalId) clearInterval(ac_valueIntegrityIntervalId); // Clear any existing interval
    ac_valueIntegrityIntervalId = setInterval(performValueIntegrityCheck, anticheatConfig.valueCheckIntervalMs);
    console.log(`ANTICHEAT: Value integrity check interval started (every ${anticheatConfig.valueCheckIntervalMs}ms).`);
};

// Delayed self-initialization if the game state is already present on load
setTimeout(() => {
    // Check if the main game variables are defined and if anti-cheat isn't already initialized
    if (!ac_valueIntegrityIntervalId && typeof window !== 'undefined' &&
        typeof window.playerCash !== 'undefined' && typeof window.playerPoints !== 'undefined') {
        // Only attempt self-init if there's existing progress or non-zero starting values
        if (localStorage.getItem('progress') || window.playerCash !== 0 || window.playerPoints !== 0 ) {
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
