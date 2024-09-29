console.log('Text to Speech loaded.');

// Check if there's a selection; if not, use the entire body text
function readTextAloud() {
    let text = window.getSelection().toString();
    if (!text) {
        text = document.body.innerText;
    }

    // Create a new SpeechSynthesisUtterance object
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Optional: Set voice properties
    utterance.lang = 'en-US'; // Set language
    utterance.rate = 1; // Set speaking rate (0.1 to 10)
    utterance.pitch = 1; // Set pitch (0 to 2)
    utterance.volume = 1; // Set volume (0 to 1)

    // Speak the text
    window.speechSynthesis.speak(utterance);
}

// Call the function to start speaking
readTextAloud();
