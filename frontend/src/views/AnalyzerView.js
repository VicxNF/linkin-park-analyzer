import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AlbumModal from '../components/AlbumModal';
import HistoryPanel from '../components/HistoryPanel';
import YouTube from 'react-youtube';
import '../App.css';

const API_URL = 'https://linkin-park-api.onrender.com';

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
  const [albumAnalysis, setAlbumAnalysis] = useState('');
  const [isAnalyzingAlbum, setIsAnalyzingAlbum] = useState(false);
  const analysisSectionRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);

  useEffect(() => {
    // Cargar historial desde localStorage
    try {
      const savedHistory = localStorage.getItem('analysisHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("No se pudo cargar el historial:", error);
      localStorage.removeItem('analysisHistory');
    }
    
    axios.get(`${API_URL}/api/albums`)
      .then(response => { setAlbums(response.data); })
      .catch(error => { console.error("Error al obtener los álbumes:", error); });
  }, []);

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
    setAlbumAnalysis(''); // Limpiamos el análisis al cerrar
    setIsAnalyzingAlbum(false);
  };

  const handleSongClick = (song) => {
    setSelectedSongTitle(song.title);
    setSelectedLyrics(song.lyrics);
    setCurrentVideoId(song.videoId || null); 
    setSelectedLineIndices([]); 
    setAnalysisResponse('');
    setTimeout(() => {
      analysisSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, 100);
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

        const newHistoryEntry = {
          id: Date.now(),
          snippet: snippet,
          analysis: response.data.analysis
        };
        
        const updatedHistory = [newHistoryEntry, ...history].slice(0, 5);
        
        setHistory(updatedHistory);
        localStorage.setItem('analysisHistory', JSON.stringify(updatedHistory));
      })
      .catch(error => { setAnalysisResponse("Hubo un error al generar el análisis. Inténtalo de nuevo."); })
      .finally(() => { setIsAnalyzing(false); });
  };

  const playerOptions = {
    height: '250',
    width: '100%',
    playerVars: {
      autoplay: 1, // La canción empieza a sonar automáticamente
    },
  };

  const toggleHistoryPanel = () => {
    setIsHistoryVisible(!isHistoryVisible);
  };

  const handleAnalyzeAlbum = (albumTitle) => {
    setIsAnalyzingAlbum(true);
    setAlbumAnalysis('');

    axios.post(`${API_URL}/api/analyze-album`, { albumTitle })
      .then(response => {
        setAlbumAnalysis(response.data.albumAnalysis);
      })
      .catch(error => {
        console.error("Hubo un error al analizar el álbum:", error);
        setAlbumAnalysis("No se pudo generar el análisis para este álbum.");
      })
      .finally(() => {
        setIsAnalyzingAlbum(false);
      });
  };

  return (
    <div className="analyzer-view-container">
      <h1>Analizador de Sentimientos de Linkin Park</h1>
      <p className="subtitle">Selecciona un álbum y luego toca una o varias líneas...</p>
      <div className="analyzer-actions">
        <button className="history-toggle-btn" onClick={toggleHistoryPanel}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.354l-1.854 1.854a.5.5 0 0 0 .708.708l2-2a.5.5 0 0 0 .146-.354V5.5z"/>
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
          </svg>
          Historial
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <HistoryPanel 
        isVisible={isHistoryVisible}
        history={history}
        onClose={toggleHistoryPanel}
      />

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
        onAnalyzeAlbum={handleAnalyzeAlbum}
        albumAnalysis={albumAnalysis}
        isAnalyzingAlbum={isAnalyzingAlbum}
      />

{selectedLyrics && selectedLyrics !== "Instrumental" && (
        <div className="interactive-analysis-section" ref={analysisSectionRef}>
          <div className="lyrics-display">
            {currentVideoId && (
              <div className="song-player-container">
                <YouTube videoId={currentVideoId} opts={playerOptions} />
              </div>
            )}
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
            {selectedLineIndices.length > 0 && !isAnalyzing && (
              <div className="selected-snippet-card">
                <p><strong>Analizando {selectedLineIndices.length} línea(s):</strong></p>
                <blockquote>
                  {selectedLineIndices.sort((a, b) => a - b).map(index => selectedLyrics.split('\n')[index]).map((line, i) => <span key={i}>{line}<br/></span>)}
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
                <blockquote className="analyzed-quote">{analyzedSnippet}</blockquote>
                <h4>Análisis de la IA:</h4>
                <p>{analysisResponse}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Condición 2: Si la canción es instrumental, muestra el mensaje especial */}
      {selectedLyrics && selectedLyrics === "Instrumental" && (
        <div className="instrumental-track-info" ref={analysisSectionRef}>
          <h3>"{selectedSongTitle}" es una pista instrumental.</h3>
          <p>No hay letras disponibles para analizar.</p>
          {currentVideoId && (
            <div className="song-player-container">
              <YouTube videoId={currentVideoId} opts={playerOptions} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AnalyzerView;