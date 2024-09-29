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
                        console.error('toggle-reading-mask function not found.');
                    }
                }
            });
        });
    });
});

document.getElementById('summarize-btn').addEventListener('click', () => {
    const loadingIndicator = document.getElementById('loading');
    const summaryTextarea = document.getElementById('summary');
    loadingIndicator.style.display = 'block';
    summaryTextarea.value = '';

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url;

        chrome.runtime.sendMessage({ action: 'summarizePage', url: url }, (response) => {
            loadingIndicator.style.display = 'none';

            if (response && response.summary) {
                summaryTextarea.value = response.summary;
            } else {
                summaryTextarea.value = 'Error: No summary returned.';
            }
        });
    });
});

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

document.getElementById('generate-quiz').addEventListener('click', generateQuiz);

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
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: adjustLineSpacing,
            args: [lineSpacing]
        });
    });
});

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

function generateQuiz() {
    const quizOutput = document.getElementById('quiz-output');

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

function displayQuiz(quiz) {
    const quizOutput = document.getElementById('quiz-output');
    quizOutput.innerHTML = ''; 

    quiz.forEach((questionData, idx) => {
        const questionContainer = document.createElement('div');
        questionContainer.classList.add('question-container');

        const questionText = document.createElement('h3'); 
        questionText.textContent = `Q${idx + 1}: ${questionData.question}`;
        questionContainer.appendChild(questionText);

        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('options-container');

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
            optionsContainer.appendChild(document.createElement('br'));
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

function adjustLineSpacing(spacing) {
    document.body.style.lineHeight = spacing;
}

function adjustContrast(value) {
    document.body.style.filter = `contrast(${value})`;
}

function changeFontSize(fontSize) {
    const elements = document.querySelectorAll('p, div, span, a, li, h1, h2, h3, h4, h5, h6');
    elements.forEach(el => {
        el.style.fontSize = `${fontSize}px`;
    });
}

function changeWordSpacing(wordSpacing) {
    document.body.style.wordSpacing = `${wordSpacing}em`;
}
