# backend/download_nltk_data.py
import nltk
import os

# Define el directorio de destino DENTRO de la carpeta del backend
download_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'nltk_data')

# Crea el directorio si no existe
os.makedirs(download_dir, exist_ok=True)

print(f"Descargando recursos de NLTK ('vader_lexicon') en: {download_dir}")

# Descarga los datos en el directorio especificado
nltk.download('vader_lexicon', download_dir=download_dir)

print("Descarga completada.")