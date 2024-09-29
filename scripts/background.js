let capturedText = ''; // Variable to store the captured text

console.log('Background script loaded.'); // Add this line
    
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.url) {
        console.log('Received URL in background.js:', message.url);

        // Perform the asynchronous fetch
        fetch('http://127.0.0.1:5000/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: message.url }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Received response from Flask:', data);
            if (data && data.summary) {
                sendResponse({ summary: data.summary });
            } else {
                sendResponse({ summary: 'Error: Summary not found in response' });
            }
        })
        .catch(error => {
            console.error('Error during fetch:', error);
            sendResponse({ summary: 'Error summarizing text' });
        });

        return true; // Keeps the message channel open for asynchronous sendResponse
    } else {
        console.error('No URL provided in the message.');
        sendResponse({ summary: 'Error: No URL provided' });
        return false;
    }
});



// Listen for messages from content and popup scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'captureText') {
        capturedText = message.text; // Store the captured text
        console.log(`Captured text stored: ${capturedText}`); // Debugging line
    }

    if (message.action === 'getCapturedText') {
        console.log(`Sending captured text: ${capturedText}`); // Debugging line
        sendResponse({ text: capturedText }); // Send the captured text to the popup
    }

    if (message.action === 'fetchDefinition') {
        const word = message.text;
        console.log(`Fetching definition for: ${word}`); // Debugging line

        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            .then(response => response.json())
            .then(data => {
                if (data[0] && data[0].meanings && data[0].meanings[0]) {
                    const definition = data[0].meanings[0].definitions[0].definition;
                    sendResponse({ definition: `Definition of "${word}": ${definition}` });
                } else {
                    sendResponse({ definition: `No definition found for "${word}".` });
                }
            })
            .catch(error => {
                console.error('Error fetching definition:', error);
                sendResponse({ definition: 'Error fetching definition.' });
            });

        return true; // Keeps the message channel open for asynchronous sendResponse
    }

    return true; // Allows for async sendResponse in any case
});



