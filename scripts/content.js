console.log('Content script loaded.'); // Add this line

document.getElementById('font-size-slider').addEventListener('input', (event) => {
    const fontSize = event.target.value;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: changeFontSize,
            args: [fontSize],
        });
    });
});

function changeFontSize(fontSize) {
    const elements = document.querySelectorAll('p, div, span, a, li, h1, h2, h3, h4, h5, h6');
    elements.forEach(el => {
        el.style.fontSize = `${fontSize}px`;
    });
}

document.getElementById('reading-mask').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['scripts/reading-mask.js']
        });
    });
});

// Inject the reading-mask.js script into the webpage
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'injectReadingMask') {
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('scripts/reading-mask.js');
        script.onload = function() {
            this.remove(); // Remove the script element after it has been executed
        };
        (document.head || document.documentElement).appendChild(script);
    }
});

let isCustomFont = false; // Track the font state on the webpage

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'toggleFont') {
        toggleFont();
    }
});

// Function to toggle font on the webpage
function toggleFont() {
    const bodyElement = document.body;

    if (isCustomFont) {
        // Revert to the original font
        bodyElement.style.fontFamily = ''; // Removes the inline style
    } else {
        // Apply the custom font
        bodyElement.style.fontFamily = '"Comic Sans MS", cursive, sans-serif';
    }

    // Toggle the font state
    isCustomFont = !isCustomFont;
}


// (function() {
//     // Change the font to Arial for all elements
//     document.body.style.fontFamily = 'Arial, sans-serif';
  
//     // You can also target specific elements if needed
//     const paragraphs = document.getElementsByTagName('p');
//     for (let p of paragraphs) {
//       p.style.fontFamily = 'Georgia, serif';
//     }
  
//     console.log('Font changed successfully!');
//   })();

//   chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === 'summarizePage') {
//         console.log('Received summarizePage action in content.js');
        
//         // Extract text content from the main body of the page
//         let pageText = document.body.innerText || '';
//         console.log('Extracted text:', pageText);

//         // Check if any text was extracted
//         if (pageText.trim() !== '') {
//             sendResponse({ text: pageText });
//         } else {
//             sendResponse({ text: null });
//         }
//     }
// });

document.addEventListener('mouseup', () => {
    let selectedText = window.getSelection().toString().trim();
    
    if (selectedText) {
        // Send the selected text to the background script
        chrome.runtime.sendMessage({ action: 'captureText', text: selectedText });
        console.log(`Selected text sent: ${selectedText}`); // Debugging line
    }
});




