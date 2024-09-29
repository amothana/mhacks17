document.getElementById('word-spacing-slider').addEventListener('input', (event) => {
    const wordSpacing = event.target.value + 'em';
    
    // Inject the word spacing adjustment script into the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: adjustWordSpacing,
            args: [wordSpacing]
        });
    });
});

// The function to adjust word spacing on the webpage
function adjustWordSpacing(spacing) {
    document.body.style.wordSpacing = spacing;
}
