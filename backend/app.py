import json
import nltk
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from googleapiclient.discovery import build
import google.generativeai as genai

analysis_cache = {}

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

    if snippet in analysis_cache:
        print("Respuesta encontrada en el caché. Sirviendo desde el caché.")
        return jsonify({"analysis": analysis_cache[snippet]})

        print("Respuesta no encontrada en el caché. Llamando a la API de Gemini...")

    prompt = f"""
    Actúa como un experto analista de música y psicología, especializado en la discografía de Linkin Park.
    Analiza el siguiente fragmento de una de sus letras:

    "{snippet}"

    En un párrafo conciso y directo, explica las emociones predominantes (como ira, angustia, vulnerabilidad, confusión, etc.), el posible significado y el tono general que transmite este fragmento específico. Evita introducciones como "En este fragmento...". Ve directo al análisis.
    """

    try:
        response = model.generate_content(prompt)
        analysis_text = response.text
        print("Guardando nueva respuesta en el caché.")
        analysis_cache[snippet] = analysis_text
        return jsonify({"analysis": analysis_text})
    except Exception as e:
        print(f"Error al contactar la API de Gemini: {e}")
        return jsonify({"error": "No se pudo generar el análisis."}), 500

@app.route('/api/analyze-album', methods=['POST'])
def analyze_album():
    data = request.get_json()
    album_title = data.get('albumTitle')

    if not album_title:
        return jsonify({"error": "No se proporcionó el título del álbum."}), 400
    
    if album_title in analysis_cache:
        print(f"Respuesta para el álbum '{album_title}' encontrada en el caché.")
        return jsonify({"albumAnalysis": analysis_cache[album_title]})

    # Buscar el álbum en nuestros datos
    album_found = next((album for album in lyrics_data if album["albumTitle"] == album_title), None)
    if not album_found:
        return jsonify({"error": "Álbum no encontrado."}), 404

    # Unir las letras de TODAS las canciones del álbum en un solo texto
    full_album_lyrics = "\n\n---\n\n".join([song['lyrics'] for song in album_found['songs']])

    # Un prompt especializado para analizar un cuerpo de trabajo completo
    prompt = f"""
    Actúa como un crítico musical y psicólogo de renombre, autor de varios libros sobre el impacto emocional de la música rock.
    Estás analizando el álbum completo "{album_title}" de Linkin Park. A continuación tienes las letras de todo el álbum:

    --- LYRICS START ---
    {full_album_lyrics}
    --- LYRICS END ---

    En un párrafo bien estructurado y profundo, realiza un análisis temático general del álbum. Identifica los 2-3 temas emocionales principales que se repiten (ej: alienación, traición, lucha interna, catarsis). Explica cómo evoluciona o se mantiene el tono a lo largo del disco. Tu análisis debe ser perspicaz y sonar experto.
    """

    try:
        response = model.generate_content(prompt)
        return jsonify({"albumAnalysis": response.text})
    except Exception as e:
        print(f"Error al contactar la API de Gemini para el análisis del álbum: {e}")
        return jsonify({"error": "No se pudo generar el análisis del álbum."}), 500

if __name__ == '__main__':
    app.run(debug=True)