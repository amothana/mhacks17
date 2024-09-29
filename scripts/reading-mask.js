if (!window.readingMaskInitialized) {
    window.readingMaskInitialized = true; 
    let maskElement;

    window.toggleReadingMask = function() {
        if (!maskElement) {
            maskElement = document.createElement('div');
            maskElement.id = 'reading-mask-overlay';
            Object.assign(maskElement.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                pointerEvents: 'none',
                zIndex: '9999',
                transition: 'clip-path 0.1s ease-out',
            });
            document.body.appendChild(maskElement);
            document.addEventListener('mousemove', updateMaskPosition);
        } else {
            document.body.removeChild(maskElement);
            maskElement = null;
            document.removeEventListener('mousemove', updateMaskPosition);
        }
    };

    function updateMaskPosition(event) {
        const maskHeight = 150;
        const maskTop = event.clientY - maskHeight / 2;

        if (maskElement) {
            maskElement.style.clipPath = `polygon(
                0 0, 100% 0, 100% ${maskTop}px,
                0 ${maskTop}px,
                0 ${maskTop + maskHeight}px,
                100% ${maskTop + maskHeight}px,
                100% 100%, 0 100%
            )`;
        }
    }
}
