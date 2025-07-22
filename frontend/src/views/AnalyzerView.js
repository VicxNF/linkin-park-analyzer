import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AlbumModal from '../components/AlbumModal';
import '../App.css';

const API_URL = 'http://127.0.0.1:5000';

function AnalyzerView() {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState('');
  const [modalAlbum, setModalAlbum] = useState(null);
  const [selectedSongTitle, setSelectedSongTitle] = useState('');
  const [selectedLyrics, setSelectedLyrics] = useState('');
  const [analysisResponse, setAnalysisResponse] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedLineIndices, setSelectedLineIndices] = useState([]);
  const [analyzedSnippet, setAnalyzedSnippet] = useState('');

  // --- EFECTOS Y MANEJADORES DE ESTADO ---
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

  const openModal = (album) => {
    setModalAlbum(album);
  };

  const closeModal = () => {
    setModalAlbum(null);
  };

  const handleSongClick = (song) => {
    setSelectedSongTitle(song.title);
    setSelectedLyrics(song.lyrics);
    setSelectedLineIndices([]); 
    setAnalysisResponse('');
    setAnalyzedSnippet(''); 
  };

  const handleLineClick = (index) => {
    const newSelectedIndices = [...selectedLineIndices];
    const currentIndexPosition = newSelectedIndices.indexOf(index);

    if (currentIndexPosition > -1) {
      newSelectedIndices.splice(currentIndexPosition, 1); // Deseleccionar
    } else {
      newSelectedIndices.push(index); // Seleccionar
    }
    setSelectedLineIndices(newSelectedIndices);
  };

  const handleAnalyzeSnippet = () => {
    if (selectedLineIndices.length === 0) return;

    const lyricsLines = selectedLyrics.split('\n');
    const snippet = selectedLineIndices
      .sort((a, b) => a - b)
      .map(index => lyricsLines[index])
      .join('\n');

    if (!snippet) return;

    setIsAnalyzing(true);
    setAnalysisResponse('');

    axios.post(`${API_URL}/api/analyze-snippet`, { snippet })
      .then(response => { 
        setAnalysisResponse(response.data.analysis); 
        setAnalyzedSnippet(snippet);
        setSelectedLineIndices([]);
      })
      .catch(error => { setAnalysisResponse("Hubo un error al generar el análisis. Inténtalo de nuevo."); })
      .finally(() => { setIsAnalyzing(false); });
  };

  return (
    <div className="analyzer-view-container">
      <h1>Analizador de Sentimientos de Linkin Park</h1>
      <p className="subtitle">Selecciona un álbum y luego toca una o varias líneas de la letra para analizarlas.</p>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="albums-container">
        {albums.map(album => (
          <div key={album.albumTitle} className="album-card" onClick={() => openModal(album)}>
            <img src={album.cover} alt={album.albumTitle} className="album-cover" />
            <div className="album-card-title-overlay">
              <h3>{album.albumTitle}</h3>
              <p>{album.year}</p>
            </div>
          </div>
        ))}
      </div>
      
      <AlbumModal
        album={modalAlbum}
        onClose={closeModal}
        onSongClick={handleSongClick}
      />

      {selectedLyrics && (
        <div className="interactive-analysis-section">
          
          <div className="lyrics-display">
            <h2>Letra de: "{selectedSongTitle}"</h2>
            <div className="lyrics-lines-container">
              {selectedLyrics.split('\n').map((line, index) => (
                <p
                  key={index}
                  className={`lyric-line ${selectedLineIndices.includes(index) ? 'selected-line' : ''}`}
                  onClick={() => handleLineClick(index)}
                >
                  {line || '\u00A0'}
                </p>
              ))}
            </div>
          </div>
          
          <div className="analysis-controls">
            <h3>Analizador Interactivo</h3>
            
            {/* JSX ACTUALIZADO: Lógica para mostrar las instrucciones o el texto seleccionado */}
            {selectedLineIndices.length > 0 && !isAnalyzing && (
              <div className="selected-snippet-card">
                <p><strong>Analizando {selectedLineIndices.length} línea(s):</strong></p>
                <blockquote>
                  {selectedLineIndices
                    .sort((a, b) => a - b)
                    .map(index => selectedLyrics.split('\n')[index])
                    .map((line, i) => <span key={i}>{line}<br/></span>)
                  }
                </blockquote>
              </div>
            )}
            
            {!selectedLineIndices.length > 0 && !analysisResponse && !isAnalyzing && (
                <div className="placeholder-text">
                    <p>Toca las líneas de la letra que quieras analizar.</p>
                </div>
            )}
            
            <button 
              onClick={handleAnalyzeSnippet} 
              disabled={selectedLineIndices.length === 0 || isAnalyzing}
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
                <blockquote className="analyzed-quote">
                    {analyzedSnippet}
                </blockquote>
                <h4>Análisis de la IA:</h4>
                <p>{analysisResponse}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyzerView;