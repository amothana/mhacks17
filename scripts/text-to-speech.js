function readTextAloud() {
    let text = window.getSelection().toString();
    if (!text) {
        text = document.body.innerText;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.lang = 'en-US'; 
    utterance.rate = 1; 
    utterance.pitch = 1; 
    utterance.volume = 1; 

    window.speechSynthesis.speak(utterance);
}

readTextAloud();
