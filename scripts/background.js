console.log('Background script loaded.');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.url) {
        console.log('Received URL in background.js:', message.url);

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

        return true; 
    } else {
        console.error('No URL provided in the message.');
        sendResponse({ summary: 'Error: No URL provided' });
        return false;
    }
});
