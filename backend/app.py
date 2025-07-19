# 1. Importar las librerías necesarias
import json
import nltk # Asegúrate de que nltk esté importado
import os   # Asegúrate de que os esté importado
from flask import Flask, jsonify, request
from flask_cors import CORS
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from googleapiclient.discovery import build
import google.generativeai as genai

YOUTUBE_API_KEY = 'AIzaSyCMkXDBzPaXqYi2SOXWUJeM7tKMltjGKxU' # Mejor si usas variables de entorno
youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

# nltk_data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'nltk_data')
# nltk.data.path.append(nltk_data_dir)

# 2. Configurar la aplicación Flask
app = Flask(__name__)
CORS(app)  # Habilita CORS para permitir peticiones desde el frontend

GEMINI_API_KEY = "AIzaSyAi-K3g4Pr4z56G3D1m0AuCOx1C2ifay9U"
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# Función para cargar las letras desde el archivo JSON
def load_lyrics_data():
    with open('lyrics.json', 'r', encoding='utf-8') as f:
        return json.load(f)

# Cargar los datos una vez al iniciar la aplicación
lyrics_data = load_lyrics_data()

# 3. Implementar la lógica de análisis de sentimientos
def analyze_sentiment(text):
    # Inicializar el analizador de sentimientos de NLTK
    sia = SentimentIntensityAnalyzer()
    # Obtener las puntuaciones de polaridad
    sentiment = sia.polarity_scores(text)
    return sentiment

# 4. Crear los Endpoints (Rutas de la API)

# Endpoint para obtener la lista de todos los álbumes
@app.route('/api/albums', methods=['GET'])
def get_albums():
    # Ahora devolvemos la lista completa de álbumes con todas sus canciones.
    # El frontend se encargará de mostrar lo que necesite.
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

        # Extrae el ID del primer video encontrado
        video_id = search_response['items'][0]['id']['videoId']
        return video_id
    except Exception as e:
        print(f"Error al buscar en YouTube: {e}")
        return None

@app.route('/api/analyze-snippet', methods=['POST'])
def analyze_snippet():
    # Obtenemos el fragmento de texto del cuerpo de la petición
    data = request.get_json()
    snippet = data.get('snippet')

    if not snippet:
        return jsonify({"error": "No se proporcionó ningún fragmento de texto."}), 400

    # El "Prompt": Aquí es donde le decimos a la IA cómo comportarse.
    prompt = f"""
    Actúa como un experto analista de música y psicología, especializado en la discografía de Linkin Park.
    Analiza el siguiente fragmento de una de sus letras:

    "{snippet}"

    En un párrafo conciso y directo, explica las emociones predominantes (como ira, angustia, vulnerabilidad, confusión, etc.), el posible significado y el tono general que transmite este fragmento específico. Evita introducciones como "En este fragmento...". Ve directo al análisis.
    """

    try:
        # Enviamos el prompt al modelo de Gemini
        response = model.generate_content(prompt)
        # Devolvemos la respuesta de la IA al frontend
        return jsonify({"analysis": response.text})
    except Exception as e:
        print(f"Error al contactar la API de Gemini: {e}")
        return jsonify({"error": "No se pudo generar el análisis."}), 500

# Endpoint principal para analizar una canción específica
# @app.route('/api/analyze/<album_title>/<song_title>', methods=['GET'])
# def analyze_song(album_title, song_title):
#     # Buscar el álbum
#     album_found = next((album for album in lyrics_data if album["albumTitle"] == album_title), None)
#     if not album_found:
#         return jsonify({"error": "Álbum no encontrado"}), 404

#     # Buscar la canción dentro del álbum
#     song_found = next((song for song in album_found["songs"] if song["title"] == song_title), None)
#     if not song_found:
#         return jsonify({"error": "Canción no encontrada"}), 404

#     # Analizar la letra de la canción encontrada
#     lyrics = song_found.get("lyrics", "")
#     sentiment_scores = analyze_sentiment(lyrics)
#     video_id = search_youtube_video(song_title)

#     # Devolver los resultados en formato JSON
#     return jsonify({
#         "album": album_title,
#         "song": song_title,
#         "lyrics": lyrics,
#         "sentiment": sentiment_scores,
#         "videoId": video_id
#     })

# 5. Iniciar el servidor
if __name__ == '__main__':
    app.run(debug=True) # debug=True permite que el servidor se reinicie automáticamente con cada cambio