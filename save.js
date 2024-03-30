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
                const decodedProgress = base64Decode(encodedProgress);
                const progress = JSON.parse(decodedProgress);

                count = progress.money;
                upgradeLevel = progress.upgradeLevel;
                upgradeCost = progress.upgradeCost;

                counterEl.textContent = count;
                upgradeBtn.textContent = `Buy Upgrader (Cost: ${upgradeCost})`;

                showMessage("Progress loaded successfully!");
            } else {
                showMessage("No saved progress found!");
            }
        }
        // Save Progress
        function saveProgress() {
            const progress = {
                money: count,
                upgradeLevel: upgradeLevel,
                upgradeCost: upgradeCost
            };

            const serializedProgress = JSON.stringify(progress);
            const encodedProgress = base64Encode(serializedProgress);

            localStorage.setItem('progress', encodedProgress);

            showMessage("Progress saved successfully!");
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
                const decodedProgress = base64Decode(encodedProgress);
                const progress = JSON.parse(decodedProgress);

                count = progress.money;
                upgradeLevel = progress.upgradeLevel;
                upgradeCost = progress.upgradeCost;

                counterEl.textContent = count;
                upgradeBtn.textContent = `Buy Upgrader (Cost: ${upgradeCost})`;

                showMessage("Progress loaded successfully!");
            } else {
                showMessage("No saved progress found!");
            }
            } 
        }