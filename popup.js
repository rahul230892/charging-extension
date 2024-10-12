window.onload = function () {
    // Assume a battery capacity in mAh (e.g., 3000 mAh for many modern phones)
    const batteryCapacity = 3000;  // Replace with actual capacity of the device in mAh

    navigator.getBattery().then(function(battery) {
        updateBatteryStatus(battery);

        // Add event listeners to update the status dynamically
        battery.addEventListener('chargingchange', function() {
            updateBatteryStatus(battery);
        });
        battery.addEventListener('levelchange', function() {
            updateBatteryStatus(battery);
        });
        battery.addEventListener('chargingtimechange', function() {
            updateBatteryStatus(battery);
        });

        // Start monitoring charging rate in real time
        monitorChargingRate(battery, batteryCapacity);
    });

    function updateBatteryStatus(battery) {
        const batteryLevel = document.getElementById('batteryLevel');
        const chargingStatus = document.getElementById('chargingStatus');
        const timeToFull = document.getElementById('timeToFull');

        batteryLevel.textContent = `${(battery.level * 100).toFixed(0)}%`;
        chargingStatus.textContent = battery.charging ? 'Yes' : 'No';

        if (battery.charging) {
            timeToFull.textContent = battery.chargingTime !== Infinity 
                ? formatTime(battery.chargingTime)
                : 'Calculating...';
        } else {
            timeToFull.textContent = 'N/A';
        }
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }

    function monitorChargingRate(battery, capacity) {
        const chargingRateDisplay = document.getElementById('chargingRate');
        let previousLevel = battery.level;
        let previousTime = Date.now();

        setInterval(function() {
            const currentLevel = battery.level;
            const currentTime = Date.now();

            // Calculate the percentage change
            const levelChange = currentLevel - previousLevel;
            const timeChange = (currentTime - previousTime) / (1000 * 60 * 60);  // Time change in hours

            if (timeChange > 0) {
                // Calculate the charging rate in mA
                const rateInMilliAmps = (capacity * levelChange) / timeChange;

                if (rateInMilliAmps !== 0) {
                    chargingRateDisplay.textContent = `${rateInMilliAmps.toFixed(2)} mA`;
                } else {
                    chargingRateDisplay.textContent = 'Stable';
                }
            }

            // Update previous values for the next interval
            previousLevel = currentLevel;
            previousTime = currentTime;
        }, 5000);  // Update every 5 seconds
    }
};
