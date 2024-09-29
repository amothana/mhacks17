document.getElementById('contrast-slider').addEventListener('input', (event) => {
    const contrastValue = event.target.value;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: adjustContrast,
            args: [contrastValue]
        });
    });
});

// Function to adjust contrast
function adjustContrast(value) {
    document.body.style.filter = `contrast(${value})`;
}


document.getElementById('reading-mask').addEventListener('click', () => {f
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript(
            {
                target: { tabId: tabs[0].id },
                files: ['scripts/reading-mask.js']
            },
            () => {
                // Call the toggleReadingMask function after injecting the script
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => {
                        if (typeof window.toggleReadingMask === 'function') {
                            window.toggleReadingMask();
                        } else {
                            console.error('toggleReadingMask function not found.');
                        }
                    }
                });
            }
        );
    });
});

document.getElementById('text-to-speech').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['scripts/text-to-speech.js']
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Track the font state in the popup
    let isCustomFont = false;

    // Event listener for the font change button
    const fontChangeBtn = document.getElementById('toggle-font-button');
    if (fontChangeBtn) {
        fontChangeBtn.addEventListener('click', () => {
            const bodyElement = document.body;

            // Toggle the font for the popup
            if (isCustomFont) {
                bodyElement.classList.remove('custom-font');
            } else {
                bodyElement.classList.add('custom-font');
            }

            // Toggle the font state in the popup
            isCustomFont = !isCustomFont;

            // Send a message to the content script to toggle the font on the webpage
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleFont' });
            });
        });
    }
});




// Function to apply Comic Sans MS font to the page
function applyComicSansFont() {
    const style = document.createElement('style');
    style.innerHTML = `
        body {
            font-family: 'Comic Sans MS', Arial, sans-serif !important;
        }
    `;
    document.head.appendChild(style);
}

// document.getElementById('simplify-btn').addEventListener('click', async () => {
//     const text = document.getElementById('text-input').value;

//     // Send the text to the background script for processing
//     chrome.runtime.sendMessage({ text: text }, (response) => {
//         document.getElementById('output').textContent = response.simplifiedText;
//     });
// });

// // Retrieve selected text from the content script
// chrome.runtime.onMessage.addListener((message) => {
//     if (message.action === 'selectedText') {
//         document.getElementById('text-input').value = message.text;
//     }
// });

document.getElementById('summarize-btn').addEventListener('click', () => {
    const summaryTextarea = document.getElementById('summary');
    const loadingIndicator = document.getElementById('loading');
    const summarizeButton = document.getElementById('summarize-btn');

    // Clear previous summary and show loading indicator
    summaryTextarea.value = '';
    loadingIndicator.style.display = 'block';
    summarizeButton.disabled = true;

    // Get the current tab's URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url;
        console.log('Captured URL:', url);

        // Send URL to background script for summarization
        chrome.runtime.sendMessage({ url: url }, (result) => {
            console.log('Received summary result in popup.js:', result);

            // Hide the loading indicator and enable the button
            loadingIndicator.style.display = 'none';
            summarizeButton.disabled = false;

            // Display the summary or an error message
            if (result && result.summary) {
                summaryTextarea.value = result.summary;
            } else {
                summaryTextarea.value = 'Error: No summary returned';
            }
        });
    });
});

document.getElementById('define-btn').addEventListener('click', () => {
    const definitionTextarea = document.getElementById('definition');
    definitionTextarea.value = '';  // Clear previous definition

    // Request the captured text from the background script
    chrome.runtime.sendMessage({ action: 'getCapturedText' }, (response) => {
        const word = response.text;
        console.log(`Received captured text: ${word}`); // Debugging line

        if (word) {
            // Send the word to the background script to fetch the definition
            chrome.runtime.sendMessage({ action: 'fetchDefinition', text: word }, (result) => {
                definitionTextarea.value = result.definition;
            });
        } else {
            definitionTextarea.value = 'No text selected.';
        }
    });
});







