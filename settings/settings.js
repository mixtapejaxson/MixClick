// Copyright (c) 2025 mixtapejaxson
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

document.addEventListener('DOMContentLoaded', function() {

    // --- UI Message Display for Settings Page ---
    let settingsMessageTimeout = null;
    function displaySettingsMessage(text, type = 'info', duration = 3000) {
        let messageEl = document.getElementById('settingsMessageDisplay'); // Assuming a message div in settings.html
        if (!messageEl) {
            // If no specific message element, create a temporary one or log
            messageEl = document.createElement('div');
            messageEl.id = 'settingsMessageDisplay';
            messageEl.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);padding:10px 20px;border-radius:5px;z-index:1000;font-size:1.1em;text-align:center;';
            document.body.appendChild(messageEl);
        }

        messageEl.textContent = text;
        messageEl.style.display = 'block';

        // Apply basic styling based on type
        if (type === 'error') {
            messageEl.style.backgroundColor = '#dc3545'; // Red
            messageEl.style.color = 'white';
        } else if (type === 'success') {
            messageEl.style.backgroundColor = '#28a745'; // Green
            messageEl.style.color = 'white';
        } else {
            messageEl.style.backgroundColor = '#007bff'; // Blue (info)
            messageEl.style.color = 'white';
        }

        if (settingsMessageTimeout) clearTimeout(settingsMessageTimeout);
        settingsMessageTimeout = setTimeout(() => {
            if (messageEl) {
                messageEl.style.display = 'none';
                messageEl.textContent = '';
            }
        }, duration);
    }


    // Function to load settings from localStorage
    function loadSettings() {
        // Correctly parse boolean values from localStorage
        // FIX: Changed default theme to 'dark'
        const theme = localStorage.getItem('theme') || 'dark';
        // Checkboxes should be true if localStorage item is 'true'
        const fullscreen = localStorage.getItem('fullscreen') === 'true';
        const autosaveInterval = localStorage.getItem('autosaveInterval') || '60';
        const disableAutoclickDetection = localStorage.getItem('disableAutoclickDetection') === 'true';
        const notificationDisplayTime = localStorage.getItem('notificationDisplayTime') || '5';
        const idleCashMultiplier = localStorage.getItem('idleCashMultiplier') || '1';
        const showDevTools = localStorage.getItem('showDevTools') === 'true';
        const currencyFormat = localStorage.getItem('currencyFormat') || 'standard';
        const customCSS = localStorage.getItem('customCSS') || '';
        const showElementIds = localStorage.getItem('showElementIds') === 'true';

        // Apply settings to the UI
        document.getElementById('theme').value = theme;
        document.getElementById('fullscreen').checked = fullscreen;
        document.getElementById('autosaveInterval').value = autosaveInterval;
        document.getElementById('disableAutoclickDetection').checked = disableAutoclickDetection;
        document.getElementById('notificationDisplayTime').value = notificationDisplayTime;
        document.getElementById('idleCashMultiplier').value = idleCashMultiplier;
        document.getElementById('showDevTools').checked = showDevTools;
        document.getElementById('currencyFormat').value = currencyFormat;
        document.getElementById('customCSS').value = customCSS;
        document.getElementById('showElementIds').checked = showElementIds;

        // Apply theme to the settings page body
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    // Function to save settings to localStorage
    function saveSettings() {
        const theme = document.getElementById('theme').value;
        const fullscreen = document.getElementById('fullscreen').checked;
        const autosaveInterval = document.getElementById('autosaveInterval').value;
        const disableAutoclickDetection = document.getElementById('disableAutoclickDetection').checked;
        const notificationDisplayTime = document.getElementById('notificationDisplayTime').value;
        const idleCashMultiplier = document.getElementById('idleCashMultiplier').value;
        const showDevTools = document.getElementById('showDevTools').checked;
        const currencyFormat =  document.getElementById('currencyFormat').value;
        const customCSS = document.getElementById('customCSS').value;
        const showElementIds = document.getElementById('showElementIds').checked;

        // Store boolean values as strings 'true' or 'false'
        localStorage.setItem('theme', theme);
        localStorage.setItem('fullscreen', fullscreen.toString());
        localStorage.setItem('autosaveInterval', autosaveInterval);
        localStorage.setItem('disableAutoclickDetection', disableAutoclickDetection.toString());
        localStorage.setItem('notificationDisplayTime', notificationDisplayTime);
        localStorage.setItem('idleCashMultiplier', idleCashMultiplier);
        localStorage.setItem('showDevTools', showDevTools.toString());
        localStorage.setItem('currencyFormat', currencyFormat);
        localStorage.setItem('customCSS', customCSS);
        localStorage.setItem('showElementIds', showElementIds.toString());

        // Apply theme to the settings page body immediately
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }

        // Send message to parent window with settings
        window.parent.postMessage({
            type: 'settingsChanged',
            settings: {
                theme: theme,
                fullscreen: fullscreen,
                notificationDisplayTime:  notificationDisplayTime,
                idleCashMultiplier:  idleCashMultiplier,
                showDevTools: showDevTools,
                currencyFormat: currencyFormat,
                customCSS: customCSS,
                showElementIds: showElementIds,
            }
        }, '*');

       // Call applySettingsToGame to immediately apply changes
       applySettingsToGame();
       displaySettingsMessage('Settings saved!', 'success');
    }

    function applySettingsToGame() {
        let settings = {};
        settings.theme = localStorage.getItem('theme') || 'dark'; // FIX: Changed default theme to 'dark'
        // Correctly parse boolean values for sending to parent
        settings.fullscreen = localStorage.getItem('fullscreen') === 'true';
        settings.notificationDisplayTime = parseFloat(localStorage.getItem('notificationDisplayTime')) || 5;
        settings.idleCashMultiplier = parseFloat(localStorage.getItem('idleCashMultiplier')) || 1;
        settings.showDevTools = localStorage.getItem('showDevTools') === 'true';

        window.parent.postMessage({
            type: 'applySettings',
            settings: settings
        }, '*');
    }

    // Function to reset settings to defaults
    function resetSettings() {
        localStorage.removeItem('theme');
        localStorage.removeItem('fullscreen');
        localStorage.removeItem('autosaveInterval');
        localStorage.removeItem('disableAutoclickDetection');
        localStorage.removeItem('notificationDisplayTime');
        localStorage.removeItem('idleCashMultiplier');
        localStorage.removeItem('showDevTools');
        localStorage.removeItem('currencyFormat');
        localStorage.removeItem('customCSS');
        localStorage.removeItem('showElementIds');

        loadSettings(); // Reload settings to apply defaults
        displaySettingsMessage('Settings reset to defaults!', 'info');
    }

    // Event listeners for save and reset buttons
    document.getElementById('save-settings').addEventListener('click', saveSettings);
    document.getElementById('reset-settings').addEventListener('click', resetSettings);

    // Load settings on page load
    loadSettings();

    // Add a message display area to settings.html if it doesn't exist
    if (!document.getElementById('settingsMessageDisplay')) {
        const messageDiv = document.createElement('div');
        messageDiv.id = 'settingsMessageDisplay';
        messageDiv.style.cssText = 'min-height: 1.5em; text-align: center; margin-top: 10px;';
        document.querySelector('.settings-container').appendChild(messageDiv);
    }
});
