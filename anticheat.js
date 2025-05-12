// Configuration
const anticheatConfig = {
    rightClickMessage: 'ANTICHEAT: Right-click Context Menu Blocked!',
    keyEventMessage: 'ANTICHEAT: Key events blocked!',
    allowedKeys: ['F5', 'F12', 'Ctrl', 'Shift', 'Tab'], // Added Tab for accessibility, kept dev keys
    autoclickThreshold: 85, // Clicks faster than 100ms apart trigger detection
    warningsBeforeReset: 5, // Number of warnings before progress is reset
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
let lastClickTime = 0;
let warningCounter = 0; // Renamed from banCounter

document.addEventListener('click', function(event) {
    if (isModalOpen) { // Prevent clicks behind the modal
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
    }

    let currentTime = new Date().getTime();
    // Ignore clicks if the target is a button inside an anticheat modal
    if (event.target && event.target.closest && event.target.closest('#anticheatWarningModal')) {
        lastClickTime = currentTime; // Reset lastClickTime to prevent modal click from triggering detection
        return;
    }

    if (currentTime - lastClickTime < anticheatConfig.autoclickThreshold) {
        event.preventDefault();
        event.stopImmediatePropagation(); 
        warningCounter++;
        console.warn(`ANTICHEAT: Fast click detected. Warning ${warningCounter}/${anticheatConfig.warningsBeforeReset}`);

        if (warningCounter >= anticheatConfig.warningsBeforeReset) {
            triggerProgressReset();
        } else {
            const remainingWarnings = anticheatConfig.warningsBeforeReset - warningCounter;
            showAutoclickWarningModal(remainingWarnings);
        }
    } else {
        lastClickTime = currentTime;
    }
}, false); // Temporarily disable capture phase to test modal button

function showAutoclickWarningModal(remainingWarnings) {
    if (isModalOpen) return; // Prevent multiple modals
    isModalOpen = true;

    // Modal Overlay
    const overlay = document.createElement('div');
    overlay.id = 'anticheatWarningOverlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0,0,0,0.7); z-index: 10000; display: flex; /* Increased z-index */
        justify-content: center; align-items: center;
    `;

    // Modal Content Box
    const modal = document.createElement('div');
    modal.id = 'anticheatWarningModal';
    modal.style.cssText = `
        background-color: #333; color: #fff; padding: 30px; border-radius: 10px;
        text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.5); min-width: 300px; max-width: 80%;
        font-family: Ubuntu, sans-serif; z-index: 10001; /* Increased z-index */
    `;

    // Title
    const title = document.createElement('h2');
    title.textContent = 'Warning!';
    title.style.color = '#ffcc00';
    title.style.marginTop = '0';

    // Message
    const message = document.createElement('p');
    message.innerHTML = `We have detected suspicious clicking activity.<br>
                         After <strong>${remainingWarnings}</strong> more detection(s), your game progress will be reset.`;
    message.style.marginBottom = '20px';
    message.style.lineHeight = '1.6';

    // OK Button
    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.disabled = true;
    okButton.style.cssText = `
        padding: 10px 20px; border: none; border-radius: 5px;
        background-color: #555; color: #ccc; cursor: not-allowed;
        font-size: 1em;
    `;

    // Enable button after 5 seconds
    setTimeout(() => {
        okButton.disabled = false;
        okButton.style.backgroundColor = '#ff6600'; // Theme color from styles.css
        okButton.style.color = '#fff';
        okButton.style.cursor = 'pointer';
    }, 5000);

    okButton.addEventListener('click', () => {
        console.log("OK button clicked! isModalOpen before:", isModalOpen);
        document.body.removeChild(overlay);
        isModalOpen = false;
        console.log("isModalOpen after:", isModalOpen);
        lastClickTime = new Date().getTime(); // Reset lastClickTime after modal interaction
    });
    console.log("Enabling OK button after 5 seconds...");

    setTimeout(() => {
        okButton.disabled = false;
        okButton.style.backgroundColor = '#ff6600'; // Theme color from styles.css
        okButton.style.color = '#fff';
        okButton.style.cursor = 'pointer';
        console.log("OK button enabled!");
    }, 5000);

    modal.appendChild(title);
    modal.appendChild(message);
    modal.appendChild(okButton);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

function triggerProgressReset() {
    isModalOpen = true; // Keep other interactions blocked
    console.warn('ANTICHEAT: Progress reset due to persistent autoclicking.');

    // Display a final notification modal
    const overlay = document.createElement('div');
    overlay.id = 'anticheatResetOverlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0,0,0,0.85); z-index: 9998; display: flex;
        justify-content: center; align-items: center; text-align: center;
    `;
    const modal = document.createElement('div');
    modal.style.cssText = `
        background-color: #aa0000; color: #fff; padding: 30px; border-radius: 10px;
        font-family: Ubuntu, sans-serif;
    `;
    modal.innerHTML = '<h2>Progress Reset</h2><p>Your game progress has been reset due to persistent autoclicker detection.</p>';
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Call the global reset function from index.html
    if (typeof window.resetGame === 'function') {
        window.resetGame();
    } else {
        console.error('resetGame function not found on window object!');
        // As a fallback, try to clear essential localStorage items directly
        localStorage.removeItem('progress');
        localStorage.removeItem('score');
        localStorage.removeItem('clicks');
        // ... and other critical items
    }
    warningCounter = 0; // Reset warning counter

    // After a short delay, remove the reset notification modal to allow starting over.
    // Or, you might choose to reload the page.
    setTimeout(() => {
        if(document.body.contains(overlay)) document.body.removeChild(overlay);
        isModalOpen = false;
        // location.reload(); // Optional: force a page reload
    }, 4000);
}

// Save file integrity check (example - adapt to your save system)
// Currently disabled in config. If enabled, ensure it's adapted for save.js structure.
// if (anticheatConfig.saveFileIntegrityCheck) { ... }
