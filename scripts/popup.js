console.log('Pop Up Script is Loaded');
// Adjust contrast on the webpage
document.getElementById('contrast-slider').addEventListener('input', (event) => {
    const contrastValue = event.target.value;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: adjustContrast,
            args: [contrastValue]
        });
    });
});

// Toggle the reading mask on the webpage
document.getElementById('toggle-reading-mask').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['scripts/reading-mask.js']
        }, () => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: () => {
                    if (window.toggleReadingMask) {
                        window.toggleReadingMask();
                    } else {
                        console.error('toggleReadingMask function not found.');
                    }
                }
            });
        });
    });
});

document.getElementById('summarize-btn').addEventListener('click', () => {
    console.log('Summarize button clicked'); // Debugging statement

    const loadingIndicator = document.getElementById('loading');
    const summaryTextarea = document.getElementById('summary');
    loadingIndicator.style.display = 'block';
    summaryTextarea.value = ''; // Clear previous summary

    // Get the current tab's URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url;
        console.log('Captured URL:', url); // Debugging statement

        // Send URL to the background script for summarization
        chrome.runtime.sendMessage({ action: 'summarizePage', url: url }, (response) => {
            console.log('Received response:', response); // Debugging statement
            loadingIndicator.style.display = 'none';

            if (response && response.summary) {
                summaryTextarea.value = response.summary;
            } else {
                summaryTextarea.value = 'Error: No summary returned.';
            }
        });
    });
});

// Trigger text-to-speech on the webpage
document.getElementById('text-to-speech').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['scripts/text-to-speech.js']
        });
    });
});

document.getElementById('toggle-font-button').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: toggleFont
        });
    });
});
// Function to get the current tab's URL
function getCurrentTabUrl(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        if (currentTab && currentTab.url) {
            callback(currentTab.url);
        } else {
            callback(null);
        }
    });
}
// Function to get the current tab's URL
function getCurrentTabUrl(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        if (currentTab && currentTab.url) {
            callback(currentTab.url);
        } else {
            callback(null);
        }
    });
}

// Function to generate the quiz using the current tab's URL
function generateQuiz() {
    const quizOutput = document.getElementById('quiz-output');

    // Get the current tab URL
    getCurrentTabUrl((url) => {
        if (!url) {
            quizOutput.textContent = 'Unable to get the current tab URL.';
            return;
        }

        fetch('http://localhost:5000/generate_quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: url })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success' && data.quiz) {
                displayQuiz(data.quiz);
            } else {
                quizOutput.textContent = `Error: ${data.message || 'Failed to generate quiz.'}`;
            }
        })
        .catch(error => {
            quizOutput.textContent = `Exception: ${error.message}`;
        });
    });
}

// Function to display the quiz
function displayQuiz(quiz) {
    const quizOutput = document.getElementById('quiz-output');
    quizOutput.innerHTML = ''; // Clear previous content

    quiz.forEach((questionData, idx) => {
        // Create a container for each question
        const questionContainer = document.createElement('div');
        questionContainer.classList.add('question-container');

        // Create and display the question
        const questionText = document.createElement('h3'); // Using h3 for the question text
        questionText.textContent = `Q${idx + 1}: ${questionData.question}`;
        questionContainer.appendChild(questionText);

        // Create a container for options
        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('options-container');

        // Create and display the options
        questionData.options.forEach((option, i) => {
            const optionLabel = document.createElement('label');
            optionLabel.classList.add('option-label');

            const optionInput = document.createElement('input');
            optionInput.type = 'radio';
            optionInput.name = `question-${idx}`;
            optionInput.value = option;
            optionInput.classList.add('option-input');

            optionLabel.appendChild(optionInput);
            optionLabel.appendChild(document.createTextNode(option));

            optionsContainer.appendChild(optionLabel);
            optionsContainer.appendChild(document.createElement('br')); // Add line break for better layout
        });

        questionContainer.appendChild(optionsContainer);
        quizOutput.appendChild(questionContainer);
    });

    // Add a submit button to check the answers
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit Quiz';
    submitButton.classList.add('submit-button');
    submitButton.onclick = () => checkQuizAnswers(quiz);
    quizOutput.appendChild(submitButton);
}


// Function to check quiz answers
function checkQuizAnswers(quiz) {
    let score = 0;
    quiz.forEach((questionData, idx) => {
        const selectedOption = document.querySelector(`input[name="question-${idx}"]:checked`);
        if (selectedOption && selectedOption.value === questionData.answer) {
            score += 1;
        }
    });
    
    alert(`You scored ${score} out of ${quiz.length}`);
}

// Set up event listener for the 'Generate Quiz' button
document.getElementById('generate-quiz').addEventListener('click', generateQuiz);

// Function to be injected
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

// Adjust font size on the webpage
document.getElementById('font-size-slider').addEventListener('input', (event) => {
    const fontSize = event.target.value;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: changeFontSize,
            args: [fontSize]
        });
    });
});

// Adjust word spacing on the webpage
document.getElementById('word-spacing-slider').addEventListener('input', (event) => {
    const wordSpacing = event.target.value;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: changeWordSpacing,
            args: [wordSpacing]
        });
    });
});

document.getElementById('line-spacing-slider').addEventListener('input', (event) => {
    const lineSpacing = event.target.value;
    
    // Inject the line spacing adjustment script into the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: adjustLineSpacing,
            args: [lineSpacing]
        });
    });
});

// The function to adjust line spacing on the webpage
function adjustLineSpacing(spacing) {
    document.body.style.lineHeight = spacing;
}


// Function to adjust contrast
function adjustContrast(value) {
    document.body.style.filter = `contrast(${value})`;
}

// Function to change font size
function changeFontSize(fontSize) {
    const elements = document.querySelectorAll('p, div, span, a, li, h1, h2, h3, h4, h5, h6');
    elements.forEach(el => {
        el.style.fontSize = `${fontSize}px`;
    });
}

// Function to change word spacing
function changeWordSpacing(wordSpacing) {
    document.body.style.wordSpacing = `${wordSpacing}em`;
}
