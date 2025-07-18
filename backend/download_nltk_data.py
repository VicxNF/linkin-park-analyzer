# backend/download_nltk_data.py
import nltk

print("Descargando recursos de NLTK ('vader_lexicon')...")
nltk.download('vader_lexicon')
print("Descarga completada.")