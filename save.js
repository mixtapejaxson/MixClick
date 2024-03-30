        // Base64 Encoder
        function base64Encode(str) {
            return btoa(str);
        }

        // Base64 Decoder
        function base64Decode(encodedStr) {
            return atob(encodedStr);
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