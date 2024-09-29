# mhacks17
Submission for MHacks17: Extension that improves accessibility
# Accessibility Browser Extension

This project is a browser extension designed to enhance the accessibility of web content for users with different learning disabilities. It offers features like quiz generation for content comprehension and text summarization.

## Built With
- **Languages**: Python, JavaScript, HTML, CSS
- **Frameworks**: Flask, BeautifulSoup
- **APIs**: Magic Loops API 
- **Tools**: Flask-CORS, Requests, Browser Developer Tools

## Features
- **Font**: Changes font to Comic Sans for improved readability
- **Text**: Adds multiple text features such as: font size, line spacing, word spacing, and contrast.
- **Reading Guides**: Adds a reading mask and text to speech feature. 
- **Quiz Generator**: Generates quizzes based on the content of the current webpage to help users assess their understanding.
- **Text Summarizer**: Summarizes webpage content to make it easier to grasp for users with specific learning challenges.

## Getting Started
### Prerequisites
- **Python 3.x**: Ensure Python is installed on your system.
- **Flask**: Install Flask using `pip install flask`.
- **BeautifulSoup**: Install BeautifulSoup using `pip install beautifulsoup4`.
- **Requests**: Install Requests using `pip install requests`.
- **Flask-CORS**: Install Flask-CORS using `pip install flask-cors`.

### Installation
1. **Clone the Repository**
   ```bash
   git clone https://github.com/amothana/accessibility-extension.git
   cd accessibility-extension
2. Set Up the Flask Server

In the project directory, locate the `app.py` file which contains the Flask server code for quiz generation and text summarization.

Run the Flask server:
  ``` bash
  python app.py
  ```

3. Open your browser and go to the extensions page:
  Chrome: chrome://extensions/
  Edge: edge://extensions/
  Enable "Developer mode."
  Click on "Load unpacked" and select the extension folder from this project."
