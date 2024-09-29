chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'toggleFont') {
        toggleFont();
    }
});

function toggleFont() {
    const bodyElement = document.body;
    const isComicSans = bodyElement.classList.contains('comic-sans-font');

    if (isComicSans) {
        bodyElement.classList.remove('comic-sans-font');
    } else {
        if (!document.getElementById('comic-sans-font-style')) {
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

        bodyElement.classList.add('comic-sans-font');
    }
}

