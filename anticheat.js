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
    message.textContent = 'ANTICHEAT: Right-click Context Menu Blocked!';
    document.body.appendChild(message);
    console.warn("ANTICHEAT: Right-click Context Menu Blocked!");

    // Remove the message after 5 seconds
    setTimeout(function() {
        document.body.removeChild(message);
    }, 5000);
});

// Prevent key events
document.addEventListener('keydown', function(event) {
    event.preventDefault();

    // Display message in the corner
    let message = document.createElement('div');
    message.style.position = 'fixed';
    message.style.top = '0';
    message.style.right = '0';
    message.style.padding = '10px';
    message.style.backgroundColor = 'red';
    message.style.color = 'white';
    message.textContent = 'ANTICHEAT: Key events blocked!';
    document.body.appendChild(message);
    console.warn("ANTICHEAT: Key events blocked!");
    // Remove the message after 5 seconds
    setTimeout(function() {
        document.body.removeChild(message);
    }, 5000);
});

// Anti-autoclicker
let lastClickTime = 0;
document.addEventListener('click', function(event) {
    let currentTime = new Date().getTime();
    if (currentTime - lastClickTime < 100) { // 100 milliseconds as threshold
        console.warn("ANTICHEAT: Too fast! Your click has been blocked. If you continute, you will be banned.");
        event.stopImmediatePropagation(); // This will stop the click event

        // Display message in the corner
        let message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.top = '0';
        message.style.right = '0';
        message.style.padding = '10px';
        message.style.backgroundColor = 'red';
        message.style.color = 'white';
        message.textContent = 'ANTICHEAT: Too fast! Your click has been blocked!';
        document.body.appendChild(message);

        // Remove the message after 5 seconds
        setTimeout(function() {
            document.body.removeChild(message);
        }, 5000);
    } else {
        lastClickTime = currentTime;
    }
});