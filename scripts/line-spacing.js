document.getElementById('line-spacing-slider').addEventListener('input', (event) => {
    const lineSpacing = event.target.value;
    
    // Inject the line spacing adjustment script into the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: adjustLineSpacing,
            args: [lineSpacing]
        });
    });
});

// The function to adjust line spacing on the webpage
function adjustLineSpacing(spacing) {
    document.body.style.lineHeight = spacing;
}
