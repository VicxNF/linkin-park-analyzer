import nltk
import os

download_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'nltk_data')

os.makedirs(download_dir, exist_ok=True)

print(f"Descargando recursos de NLTK ('vader_lexicon') en: {download_dir}")

nltk.download('vader_lexicon', download_dir=download_dir)

print("Descarga completada.")