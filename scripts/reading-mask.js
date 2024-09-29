if (!window.readingMaskInitialized) {
    window.readingMaskInitialized = true; // Prevent multiple initializations
    let maskEnabled = false;
    let maskElement;

    // Function to toggle the reading mask
    window.toggleReadingMask = function() {
        if (maskEnabled) {
            disableReadingMask();
        } else {
            enableReadingMask();
        }
        maskEnabled = !maskEnabled;
    };

    function enableReadingMask() {
        if (!maskElement) {
            // Reset body and html margins to ensure full coverage
            document.body.style.margin = '0';
            document.documentElement.style.margin = '0';

            // Create the mask element
            maskElement = document.createElement('div');
            maskElement.id = 'reading-mask-overlay';

            // Apply styles to the mask
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

            // Append the mask to the body
            document.body.appendChild(maskElement);
            document.addEventListener('mousemove', updateMaskPosition);
        }
    }

    function disableReadingMask() {
        if (maskElement) {
            document.body.removeChild(maskElement);
            maskElement = null;
            document.removeEventListener('mousemove', updateMaskPosition);
        }
    }

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
