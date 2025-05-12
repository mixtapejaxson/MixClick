// Configuration
const anticheatConfig = {
    rightClickMessage: 'ANTICHEAT: Right-click Context Menu Blocked!',
    keyEventMessage: 'ANTICHEAT: Key events blocked!',
    allowedKeys: ['F5', 'F12', 'Ctrl', 'Shift'],
    autoclickThreshold: 100,
    autoclickMessage: 'ANTICHEAT: Too fast! Your click has been blocked!',
    banThreshold: 6,
    saveFileIntegrityCheck: true,
    saveFileSalt: 'somesupersecretstring',
};

// Disable right-click context menu
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();

    // Display message in the corner
    let message = document.createElement('div');
    message.style.position = 'fixed';
    message.style.top = '0';
    message.style.right = '0';
    message.style.padding = '10px';
    message.style.backgroundColor = 'red';
    message.style.color = 'white';
    message.textContent = anticheatConfig.rightClickMessage;
    document.body.appendChild(message);
    console.warn(anticheatConfig.rightClickMessage);

    // Remove the message after 5 seconds
    setTimeout(function() {
        document.body.removeChild(message);
    }, 5000);
});

// Prevent key events
document.addEventListener('keydown', function(event) {
    const key = event.key;

    if (!anticheatConfig.allowedKeys.includes(key)) {
        event.preventDefault();

        // Display message in the corner
        let message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.top = '0';
        message.style.right = '0';
        message.style.padding = '10px';
        message.style.backgroundColor = 'red';
        message.style.color = 'white';
        message.textContent = anticheatConfig.keyEventMessage;
        document.body.appendChild(message);
        console.warn(anticheatConfig.keyEventMessage);
        // Remove the message after 5 seconds
        setTimeout(function() {
            document.body.removeChild(message);
        }, 5000);
    }
});

// Anti-autoclicker
let lastClickTime = 0;
let banCounter = 0;

document.addEventListener('click', function(event) {
    let currentTime = new Date().getTime();
    if (currentTime - lastClickTime < anticheatConfig.autoclickThreshold) {
        console.warn(anticheatConfig.autoclickMessage + "If you continute, you will be banned.");
        event.stopImmediatePropagation(); // This will stop the click event
        banCounter++;

        // Display message in the corner
        let message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.top = '0';
        message.style.right = '0';
        message.style.padding = '10px';
        message.style.backgroundColor = 'red';
        message.style.color = 'white';
        message.textContent = anticheatConfig.autoclickMessage;
        document.body.appendChild(message);

        // Remove the message after 5 seconds
        setTimeout(function() {
            document.body.removeChild(message);
        }, 5000);

        if (banCounter > anticheatConfig.banThreshold) {
            // Implement ban logic here (e.g., clear save, redirect, etc.)
            alert('You have been banned for autoclicking!');
            banCounter = 0; // Reset counter after ban
        }
    } else {
        lastClickTime = currentTime;
    }
});

// Save file integrity check (example - adapt to your save system)
// if (anticheatConfig.saveFileIntegrityCheck) {
//     function calculateSaveHash(saveData, salt) {
//         const dataString = JSON.stringify(saveData) + salt;
//         let hash = 0;
//         for (let i = 0; i < dataString.length; i++) {
//             hash = ((hash << 5) - hash) + dataString.charCodeAt(i);
//             hash |= 0; // Convert to 32bit integer
//         }
//         return hash;
//     }

//     function checkSaveIntegrity() {
//         const savedGame = localStorage.getItem('gameSave'); // Example: Get save data
//         if (savedGame) {
//             const saveData = JSON.parse(savedGame);
//             const expectedHash = saveData.hash; // Assuming your save has a hash

//             const calculatedHash = calculateSaveHash(saveData.data, anticheatConfig.saveFileSalt); // Hash without the hash

//             if (expectedHash !== calculatedHash) {
//                 console.warn('ANTICHEAT: Save file has been tampered with!');
//                 alert('ANTICHEAT: Save file has been tampered with! Game reset.');
//                 localStorage.removeItem('gameSave');
//                 // location.reload();
//             }
//         }
//     }

//     // Run check on page load and periodically
//     checkSaveIntegrity();
//     setInterval(checkSaveIntegrity, 60000); // Check every minute
// }