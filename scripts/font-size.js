document.getElementById('toggle-font-button').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: toggleReadableFont
        });
    });
});

// Adjust line spacing dynamically with the slider
document.getElementById('line-spacing-slider').addEventListener('input', (event) => {
    const lineSpacing = event.target.value;
    
    // Execute the line spacing adjustment on the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: adjustLineSpacing,
            args: [lineSpacing]
        });
    });
});

// Function to toggle the readable font
function toggleReadableFont() {
    let readableFontStyle = document.getElementById('readable-font-style');
    
    if (!readableFontStyle) {
        readableFontStyle = document.createElement('style');
        readableFontStyle.id = 'readable-font-style';
        readableFontStyle.textContent = `
            .readable-font * {
                font-family: 'Verdana', Arial, sans-serif !important;
            }
        `;
        document.head.appendChild(readableFontStyle);
    }

    document.body.classList.toggle('readable-font');
}

// Function to adjust line spacing
function adjustLineSpacing(spacing) {
    document.body.style.lineHeight = spacing;
}
