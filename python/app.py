from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes to allow cross-origin requests

# URL for Magic Loops API
MAGIC_LOOPS_URL = 'https://magicloops.dev/api/loop/run/a1fc66fe-e80a-49be-8085-be2b42397cac'

def scrape_text_from_url(url):
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    text_elements = soup.find_all(['p', 'h1', 'h2', 'h3'])
    page_text = ' '.join([element.get_text() for element in text_elements])
    print(f"Scraped text (first 500 chars): {page_text[:500]}")  # Log the extracted text
    return page_text

def summarize_text(input_text):
    payload = {'input': input_text}
    response = requests.get(MAGIC_LOOPS_URL, json=payload)
    response_json = response.json()
    print(f"Magic Loops API response JSON: {response_json}")
    return response_json  # Return the entire API response

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    url = data.get('url', '')

    # Scrape the text content from the URL
    scraped_text = scrape_text_from_url(url)
    print(f"Scraped text: {scraped_text[:500]}")  # Log the first 500 characters of scraped text

    # Summarize the scraped text using the Magic Loops API
    api_response = summarize_text(scraped_text)
    print(f"API Response: {api_response}")  # Log the full API response

    # Directly return the API's JSON response
    return jsonify({'summary': api_response.get('loopOutput', 'No output provided')})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
