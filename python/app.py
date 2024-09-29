from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app) 

QUIZ_MAGIC_LOOPS_URL = 'https://magicloops.dev/api/loop/run/32d9c41a-6b65-4353-8584-09a0345d0c60'
SUMMARIZE_MAGIC_LOOPS_URL = 'https://magicloops.dev/api/loop/run/a1fc66fe-e80a-49be-8085-be2b42397cac'

def scrape_text_from_url(url):
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    text_elements = soup.find_all(['p', 'h1', 'h2', 'h3'])
    page_text = ' '.join([element.get_text() for element in text_elements])
    return page_text

def generate_quiz(input_text):
    payload = {'input': input_text}
    response = requests.get(QUIZ_MAGIC_LOOPS_URL, json=payload)
    response_json = response.json()
    
    if response_json.get('status') == 'Magic Loop called successfully!' and 'quiz' in response_json.get('loopOutput', {}):
        return response_json['loopOutput']['quiz'], None
    else:
        return None, 'Failed to generate quiz or invalid API response.'

def summarize_text(input_text):
    payload = {'input': input_text}
    response = requests.get(SUMMARIZE_MAGIC_LOOPS_URL, json=payload)
    response_json = response.json()
    return response_json 

@app.route('/generate_quiz', methods=['POST'])
def generate_quiz_route():
    data = request.get_json()
    url = data.get('url', '')

    scraped_text = scrape_text_from_url(url)

    quiz_data, error = generate_quiz(scraped_text)
    
    if quiz_data:
        return jsonify({'status': 'success', 'quiz': quiz_data})
    else:
        return jsonify({'status': 'error', 'message': error}), 500

@app.route('/summarize', methods=['POST'])
def summarize_route():
    data = request.get_json()
    url = data.get('url', '')

    scraped_text = scrape_text_from_url(url)

    api_response = summarize_text(scraped_text)

    return jsonify({'summary': api_response.get('loopOutput', 'No output provided')})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
