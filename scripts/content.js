cconsole.log('Content script loaded.');

// Listen for messages from `popup.js` to toggle the custom font
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Received message:', message); // Debug statement

    if (message.action === 'toggleFont') {
        console.log('Toggling font...'); // Debug statement
        toggleFont();
    }
});

// Function to toggle Comic Sans on the webpage
function toggleFont() {
    const bodyElement = document.body;
    const isComicSans = bodyElement.classList.contains('comic-sans-font');
    console.log('Current font state (isComicSans):', isComicSans); // Debug statement

    if (isComicSans) {
        console.log('Reverting to original font...'); // Debug statement
        bodyElement.classList.remove('comic-sans-font');
    } else {
        console.log('Applying Comic Sans font...'); // Debug statement

        // Inject the style element for Comic Sans if not already present
        if (!document.getElementById('comic-sans-font-style')) {
            console.log('Creating style element for Comic Sans font...'); // Debug statement
            const style = document.createElement('style');
            style.id = 'comic-sans-font-style';
            style.innerHTML = `
                .comic-sans-font {
                    font-family: 'Comic Sans MS', Arial, sans-serif !important;
                    font-weight: 700;
                    text-shadow: 0.5px 0.5px 1px rgba(0, 0, 0, 0.3);
                    -webkit-font-smoothing: antialiased;
                }
            `;
            document.head.appendChild(style);
        }

        // Apply the class to the body to use the font
        bodyElement.classList.add('comic-sans-font');
        console.log('Applied comic-sans-font class to body');
    }
}

