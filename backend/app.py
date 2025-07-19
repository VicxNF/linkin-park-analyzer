import json
import nltk
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from googleapiclient.discovery import build
import google.generativeai as genai

YOUTUBE_API_KEY = 'AIzaSyCMkXDBzPaXqYi2SOXWUJeM7tKMltjGKxU'
youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = "AIzaSyAi-K3g4Pr4z56G3D1m0AuCOx1C2ifay9U"
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

def load_lyrics_data():
    with open('lyrics.json', 'r', encoding='utf-8') as f:
        return json.load(f)

lyrics_data = load_lyrics_data()

def analyze_sentiment(text):
    sia = SentimentIntensityAnalyzer()
    sentiment = sia.polarity_scores(text)
    return sentiment

@app.route('/api/albums', methods=['GET'])
def get_albums():
    return jsonify(lyrics_data)

def search_youtube_video(song_title):
    query = f"Linkin Park {song_title} Official Audio"
    try:
        search_response = youtube.search().list(
            q=query,
            part='id',
            maxResults=1,
            type='video'
        ).execute()

        video_id = search_response['items'][0]['id']['videoId']
        return video_id
    except Exception as e:
        print(f"Error al buscar en YouTube: {e}")
        return None

@app.route('/api/analyze-snippet', methods=['POST'])
def analyze_snippet():
    data = request.get_json()
    snippet = data.get('snippet')

    if not snippet:
        return jsonify({"error": "No se proporcionó ningún fragmento de texto."}), 400

    prompt = f"""
    Actúa como un experto analista de música y psicología, especializado en la discografía de Linkin Park.
    Analiza el siguiente fragmento de una de sus letras:

    "{snippet}"

    En un párrafo conciso y directo, explica las emociones predominantes (como ira, angustia, vulnerabilidad, confusión, etc.), el posible significado y el tono general que transmite este fragmento específico. Evita introducciones como "En este fragmento...". Ve directo al análisis.
    """

    try:
        response = model.generate_content(prompt)
        return jsonify({"analysis": response.text})
    except Exception as e:
        print(f"Error al contactar la API de Gemini: {e}")
        return jsonify({"error": "No se pudo generar el análisis."}), 500

if __name__ == '__main__':
    app.run(debug=True)