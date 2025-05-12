        // Base64 Encoder
        function base64Encode(str) {
            return btoa(str);
        }

        // Base64 Decoder
        function base64Decode(encodedStr) {
            return atob(encodedStr);
        }
        // Auto Save Progress
        setInterval(saveProgress, 30000);

        // Show Message
        function showMessage(message, color = 'black') {
            const messageEl = document.createElement('div');
            messageEl.style.position = 'absolute';
            messageEl.style.top = '0';
            messageEl.style.left = '0';
            messageEl.style.color = color;
            messageEl.textContent = message;

            document.body.appendChild(messageEl);

            setTimeout(() => {
            document.body.removeChild(messageEl);
            }, 3000);
        }

        // Modify Save Progress to show auto save message
        function saveProgress() {
            const progress = {
                money: count,
                upgradeLevel: upgradeLevel,
                upgradeCost: upgradeCost
            };

            const serializedProgress = JSON.stringify(progress);
            const encodedProgress = base64Encode(serializedProgress);

            localStorage.setItem('progress', encodedProgress);

            showMessage("Progress auto saved successfully!", 'green');
        }

        // Reset Progress
        function resetProgress() {
            // Reset game variables
            count = 0;
            upgradeLevel = 0;
            upgradeCost = 10;

            // Update UI
            counterEl.textContent = count;
            upgradeBtn.textContent = `Buy Upgrader (Cost: ${upgradeCost})`;

            // Save the reset progress
            saveProgress();

            showMessage("Progress reset and saved successfully!", 'red');
        }

        // Load Progress
        function loadProgress() {
            const encodedProgress = localStorage.getItem('progress');

            if (encodedProgress) {
                try {
                    const decodedProgress = base64Decode(encodedProgress);
                    const progress = JSON.parse(decodedProgress);

                    // Ensure elements exist before trying to update them
                    const counterEl = document.getElementById('counter');
                    const upgradeBtn = document.getElementById('upgradeBtn');

                    count = progress.money || 0;
                    clickValue = progress.clickValue || 1; // Added clickValue
                    upgradeLevel = progress.upgradeLevel || 1;
                    upgradeCost = progress.upgradeCost || 10;
                    
                    // Load shop items
                    if (progress.doubleClick) localStorage.setItem('doubleClick', 'true'); else localStorage.removeItem('doubleClick');
                    if (progress.autoClicker) localStorage.setItem('autoClicker', 'true'); else localStorage.removeItem('autoClicker');
                    // Add new shop items here for loading
                    if (progress.clickBoostActive) localStorage.setItem('clickBoostActive', 'true'); else localStorage.removeItem('clickBoostActive');
                    if (progress.clickBoostEndTime) localStorage.setItem('clickBoostEndTime', progress.clickBoostEndTime); else localStorage.removeItem('clickBoostEndTime');
                    if (progress.gamblingCooldownReduction) localStorage.setItem('gamblingCooldownReduction', progress.gamblingCooldownReduction); else localStorage.removeItem('gamblingCooldownReduction');
                    if (progress.interestRate) localStorage.setItem('interestRate', progress.interestRate); else localStorage.removeItem('interestRate');


                    if (counterEl) counterEl.textContent = count;
                    if (upgradeBtn) {
                        upgradeBtn.textContent = `Buy Upgrader (Cost: ${upgradeCost})`;
                        upgradeBtn.disabled = (upgradeLevel === 500);
                         if (upgradeLevel === 500) upgradeBtn.textContent = `Upgrader Maxed!`;
                    }
                    
                    // Refresh shop related UI in index.html if needed
                    // For example, if the auto-clicker is bought, ensure it starts
                    // This is handled by the logic already in index.html that checks localStorage on load/interval

                    showMessage("Progress loaded successfully!");
                } catch (e) {
                    console.error("Error loading progress:", e);
                    showMessage("Failed to load progress. Save might be corrupted.", "red");
                    // Optionally reset to a default state
                    localStorage.removeItem('progress');
                }
            } else {
                showMessage("No saved progress found!");
            }
        }

        // Modify Save Progress to include new variables and shop items
        function saveProgress(isAutoSave = false) {
            const progress = {
                money: count,
                clickValue: clickValue, // Added clickValue
                upgradeLevel: upgradeLevel,
                upgradeCost: upgradeCost,
                // Shop items from localStorage
                doubleClick: localStorage.getItem('doubleClick') === 'true',
                autoClicker: localStorage.getItem('autoClicker') === 'true',
                clickBoostActive: localStorage.getItem('clickBoostActive') === 'true',
                clickBoostEndTime: localStorage.getItem('clickBoostEndTime'),
                gamblingCooldownReduction: localStorage.getItem('gamblingCooldownReduction'),
                interestRate: localStorage.getItem('interestRate')
                // Add other new shop items here
            };

            const serializedProgress = JSON.stringify(progress);
            const encodedProgress = base64Encode(serializedProgress);

            localStorage.setItem('progress', encodedProgress);

            if (!isAutoSave) {
                showMessage("Progress saved successfully!", 'green');
            } else {
                console.log("Progress auto-saved."); // Auto-saves shouldn't spam messages
            }
        }
        
        // Auto Save Progress - pass true to avoid message spam
        setInterval(() => saveProgress(true), 30000);


        // Reset Progress - updated to clear all game-related localStorage
        function resetProgress() {
            // Reset game variables (from index.html and this file)
            count = 0;
            clickValue = 1; // Reset base click value
            upgradeLevel = 1; // Reset level to 1, not 0
            upgradeCost = 10;

            // Clear main progress
            localStorage.removeItem('progress');

            // Clear shop-specific items from localStorage
            localStorage.removeItem('doubleClick');
            localStorage.removeItem('autoClicker');
            localStorage.removeItem('clickBoostActive');
            localStorage.removeItem('clickBoostEndTime');
            localStorage.removeItem('gamblingCooldownReduction');
            localStorage.removeItem('interestRate');
            // Add any other shop items here

            // Update UI elements (ensure they exist)
            const counterEl = document.getElementById('counter');
            const upgradeBtn = document.getElementById('upgradeBtn');

            if (counterEl) counterEl.textContent = count;
            if (upgradeBtn) {
                 upgradeBtn.textContent = `Buy Upgrader (Cost: ${upgradeCost})`;
                 upgradeBtn.disabled = false;
            }

            // Call the resetGame function from index.html if it handles UI and other specific resets not covered here
            // This requires resetGame to be globally accessible or triggered via an event.
            // For now, we assume this resetProgress is comprehensive for data.
            // The resetGame in index.html primarily resets its own script's variables.
            // We should ensure both are called or consolidate.
            // Let's try to call the one in index.html if it exists
            if (typeof window.resetGame === 'function') {
                 // window.resetGame(); // This might cause issues if resetGame also calls resetProgress.
                 // For now, index.html's resetGame clears its local vars and specific localStorages.
                 // This resetProgress clears the 'progress' item and also the shop items.
            }


            showMessage("Progress reset successfully!", 'red');
            // No need to call saveProgress() here as we are clearing everything.
            // If a new 'empty' save state is desired after reset, then call saveProgress().
        }