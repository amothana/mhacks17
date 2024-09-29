// document.getElementById('contrast-slider').addEventListener('input', (event) => {
//     const contrastValue = event.target.value;
    
//     // Inject the contrast adjustment script into the active tab
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.scripting.executeScript({
//             target: { tabId: tabs[0].id },
//             function: adjustContrast,
//             args: [contrastValue]
//         });
//     });
// });

// // The function to adjust contrast on the webpage
// function adjustContrast(value) {
//     // Apply contrast filter to all elements by adding a class to the body
//     if (!document.body.classList.contains('contrast-adjustment')) {
//         // Create a style tag if it doesn't already exist
//         const style = document.createElement('style');
//         style.id = 'contrast-style';
//         document.head.appendChild(style);
        
//         // Add a class to apply the contrast filter
//         document.body.classList.add('contrast-adjustment');
//     }

//     // Update the contrast value in the style tag
//     document.getElementById('contrast-style').textContent = `
//         .contrast-adjustment * {
//             filter: contrast(${value});
//         }
//     `;
// }
