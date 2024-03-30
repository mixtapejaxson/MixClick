 // Disable right-click context menu
 document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

// Prevent key events
document.addEventListener('keydown', function(event) {
    event.preventDefault();
});
// Anti-autoclicker
let lastClickTime = 0;
document.addEventListener('click', function(event) {
    let currentTime = new Date().getTime();
    if (currentTime - lastClickTime < 100) { // 100 milliseconds as threshold
        console.warn("ANTICHEAT: Too fast! Your click has been blocked.");
        event.stopImmediatePropagation(); // This will stop the click event

        // Display message in the corner
        let message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.bottom = '0';
        message.style.right = '0';
        message.style.padding = '10px';
        message.style.backgroundColor = 'red';
        message.style.color = 'white';
        message.textContent = 'ANTICHEAT: Too fast! Your click has been blocked!';
        document.body.appendChild(message);

        // Remove the message after 3 seconds
        setTimeout(function() {
            document.body.removeChild(message);
        }, 3000);
    } else {
        lastClickTime = currentTime;
    }
});