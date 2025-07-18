# 1. Importar las librerías necesarias
import json
import nltk # Asegúrate de que nltk esté importado
import os   # Asegúrate de que os esté importado
from flask import Flask, jsonify
from flask_cors import CORS
from nltk.sentiment.vader import SentimentIntensityAnalyzer

nltk_data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'nltk_data')
nltk.data.path.append(nltk_data_dir)

# 2. Configurar la aplicación Flask
app = Flask(__name__)
CORS(app)  # Habilita CORS para permitir peticiones desde el frontend

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

# Endpoint principal para analizar una canción específica
@app.route('/api/analyze/<album_title>/<song_title>', methods=['GET'])
def analyze_song(album_title, song_title):
    # Buscar el álbum
    album_found = next((album for album in lyrics_data if album["albumTitle"] == album_title), None)
    if not album_found:
        return jsonify({"error": "Álbum no encontrado"}), 404

    # Buscar la canción dentro del álbum
    song_found = next((song for song in album_found["songs"] if song["title"] == song_title), None)
    if not song_found:
        return jsonify({"error": "Canción no encontrada"}), 404

    # Analizar la letra de la canción encontrada
    lyrics = song_found.get("lyrics", "")
    sentiment_scores = analyze_sentiment(lyrics)

    # Devolver los resultados en formato JSON
    return jsonify({
        "album": album_title,
        "song": song_title,
        "lyrics": lyrics,
        "sentiment": sentiment_scores
    })

# 5. Iniciar el servidor
if __name__ == '__main__':
    app.run(debug=True) # debug=True permite que el servidor se reinicie automáticamente con cada cambio