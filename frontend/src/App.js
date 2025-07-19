import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
// Nota: Ya no necesitamos AnalysisChart ni YouTube, así que se pueden quitar si quieres.

// La URL de tu API. Asegúrate de que sea la correcta (local o de Render).
const API_URL = 'https://linkin-park-api.onrender.com'; // O tu URL de Render desplegada

function App() {
  // --- ESTADOS PRINCIPALES ---
  const [albums, setAlbums] = useState([]); // Almacena todos los álbumes y canciones
  const [error, setError] = useState(''); // Para errores generales
  
  // --- NUEVOS ESTADOS PARA LA LÓGICA INTERACTIVA ---
  const [selectedSongTitle, setSelectedSongTitle] = useState(''); // Guarda el título de la canción elegida
  const [selectedLyrics, setSelectedLyrics] = useState(''); // Guarda las letras de la canción elegida
  const [selectedText, setSelectedText] = useState(''); // Guarda el texto que el usuario subraya
  const [analysisResponse, setAnalysisResponse] = useState(''); // Guarda la respuesta de la IA
  const [isAnalyzing, setIsAnalyzing] = useState(false); // Estado de carga para el análisis de la IA

  // Carga los datos de los álbumes desde la API al iniciar la app
  useEffect(() => {
    axios.get(`${API_URL}/api/albums`)
      .then(response => {
        setAlbums(response.data);
      })
      .catch(error => {
        console.error("Error fatal al obtener los álbumes:", error);
        setError('No se pudo cargar la información de los álbumes. ¿Está el servidor del backend corriendo?');
      });
  }, []); // El array vacío asegura que solo se ejecute una vez

  // Se activa al hacer clic en una canción. Prepara la sección de análisis.
  const handleSongClick = (song) => {
    setSelectedSongTitle(song.title);
    setSelectedLyrics(song.lyrics);
    setSelectedText(''); // Limpiamos la selección de texto anterior
    setAnalysisResponse(''); // Limpiamos el análisis anterior
  };
  
  // Se activa cada vez que el usuario termina de seleccionar texto con el ratón.
  const handleTextSelection = () => {
    const text = window.getSelection().toString().trim();
    if (text) {
      setSelectedText(text);
    }
  };

  // Llama a nuestra nueva API para analizar el fragmento seleccionado.
  const handleAnalyzeSnippet = () => {
    if (!selectedText) return;
    setIsAnalyzing(true);
    setAnalysisResponse('');

    axios.post(`${API_URL}/api/analyze-snippet`, { snippet: selectedText })
      .then(response => {
        setAnalysisResponse(response.data.analysis);
      })
      .catch(error => {
        console.error("Hubo un error al analizar el fragmento:", error);
        setAnalysisResponse("Hubo un error al generar el análisis. Inténtalo de nuevo.");
      })
      .finally(() => {
        setIsAnalyzing(false);
      });
  };

  return (
    <div className="App">
      <h1>Analizador de Sentimientos de Linkin Park</h1>
      <p className="subtitle">Selecciona una canción y luego subraya cualquier parte de la letra que quieras analizar.</p>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* SECCIÓN DE SELECCIÓN DE ÁLBUMES */}
      <div className="albums-container">
        {albums.map(album => (
          <div key={album.albumTitle} className="album-card">
            <img src={album.cover} alt={album.albumTitle} className="album-cover" />
            <div className="song-list">
              <h3 className="album-title-hover">{album.albumTitle}</h3>
              <p className="album-year-hover">{album.year}</p>
              {album.songs.map(song => (
                <li 
                  key={song.title} 
                  className="song-item" 
                  // ¡CAMBIO IMPORTANTE! Pasamos el objeto 'song' completo.
                  onClick={() => handleSongClick(song)}
                >
                  {song.title}
                </li>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* --- NUEVA SECCIÓN DE ANÁLISIS INTERACTIVO --- */}
      {/* Esta sección solo aparece si se ha seleccionado una canción */}
      {selectedLyrics && (
        <div className="interactive-analysis-section">
          
          {/* Columna Izquierda: Las Letras */}
          <div className="lyrics-display">
            <h2>Letra de: "{selectedSongTitle}"</h2>
            <pre onMouseUp={handleTextSelection}>{selectedLyrics}</pre>
          </div>
          
          {/* Columna Derecha: Controles y Respuesta de la IA */}
          <div className="analysis-controls">
            <h3>Analizador Interactivo</h3>
            <p>1. Selecciona un fragmento de la letra con tu ratón.</p>
            <p>2. Presiona el botón para obtener el análisis.</p>

            {selectedText && !isAnalyzing && (
              <div className="selected-snippet-card">
                <p><strong>Analizando fragmento:</strong></p>
                <blockquote>"{selectedText}"</blockquote>
              </div>
            )}

            
            <button 
              onClick={handleAnalyzeSnippet} 
              disabled={!selectedText || isAnalyzing}
            >
              {isAnalyzing ? 'PENSANDO...' : 'Analizar Selección'}
            </button>

            {isAnalyzing && (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Conectando con la IA...</p>
              </div>
            )}
            
            {/* Muestra la respuesta del "chatbot" aquí */}
            {analysisResponse && !isAnalyzing && (
              <div className="chatbot-response">
                <h4>Análisis de la IA:</h4>
                <p>{analysisResponse}</p>
              </div>
            )}
            {!selectedText && !analysisResponse && (
              <div className="placeholder-text">
                  <p>1. Selecciona un fragmento de la letra con tu ratón.</p>
                  <p>2. Presiona el botón para obtener el análisis.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;