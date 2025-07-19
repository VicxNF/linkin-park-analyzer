import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const API_URL = 'https://linkin-park-api.onrender.com';

function AnalyzerView() {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState('');
  
  const [selectedSongTitle, setSelectedSongTitle] = useState('');
  const [selectedLyrics, setSelectedLyrics] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [analysisResponse, setAnalysisResponse] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/api/albums`)
      .then(response => {
        setAlbums(response.data);
      })
      .catch(error => {
        console.error("Error fatal al obtener los álbumes:", error);
        setError('No se pudo cargar la información de los álbumes. ¿Está el servidor del backend corriendo?');
      });
  }, []);

  const handleSongClick = (song) => {
    setSelectedSongTitle(song.title);
    setSelectedLyrics(song.lyrics);
    setSelectedText('');
    setAnalysisResponse('');
  };
  
  const handleTextSelection = () => {
    const text = window.getSelection().toString().trim();
    if (text) {
      setSelectedText(text);
    }
  };

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
                  onClick={() => handleSongClick(song)}
                >
                  {song.title}
                </li>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedLyrics && (
        <div className="interactive-analysis-section">
          
          <div className="lyrics-display">
            <h2>Letra de: "{selectedSongTitle}"</h2>
            <pre onMouseUp={handleTextSelection}>{selectedLyrics}</pre>
          </div>
          
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

export default AnalyzerView;