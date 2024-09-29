// (function() {
//     // Font settings
//     const dyslexiaFriendlyFont = 'OpenDyslexic, Arial, sans-serif';
//     const originalFont = 'inherit';
    
//     // Flag to track if dyslexia font is active
//     let isDyslexiaFontActive = false;
  
//     // Function to change the font
//     function toggleDyslexiaFont() {
//       const elements = document.getElementsByTagName('*');
      
//       if (!isDyslexiaFontActive) {
//         for (let elem of elements) {
//           elem.style.fontFamily = dyslexiaFriendlyFont;
//         }
//         isDyslexiaFontActive = true;
//         console.log('Dyslexia-friendly font activated');
//       } else {
//         for (let elem of elements) {
//           elem.style.fontFamily = originalFont;
//         }
//         isDyslexiaFontActive = false;
//         console.log('Original font restored');
//       }
//     }
  
//     // Function to initialize the button listener
//     function initializeDyslexiaButton() {
//       const dyslexiaButton = document.getElementById('dyslexia-button');
//       if (dyslexiaButton) {
//         dyslexiaButton.addEventListener('click', toggleDyslexiaFont);
//         console.log('Dyslexia button listener initialized');
//       } else {
//         console.error('Dyslexia button not found');
//       }
//     }
  
//     // Initialize the button listener when the DOM is fully loaded
//     if (document.readyState === 'loading') {
//       document.addEventListener('DOMContentLoaded', initializeDyslexiaButton);
//     } else {
//       initializeDyslexiaButton();
//     }
//   })();