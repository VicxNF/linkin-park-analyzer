import React, { useState } from 'react';
import axios from 'axios';
import AnalysisChart from './components/AnalysisChart';
import './App.css';
import { albums as mockAlbums } from './mock-data'; 

// La URL base de nuestra API de Flask
const API_URL = 'http://127.0.0.1:5000';

// Esta es una SIMULACIÓN de los datos que nuestra API debería devolver
// en un endpoint `/api/full-data`. Como no lo tenemos, lo ponemos aquí
// para poder construir la interfaz. En la Fase 4 lo podemos mejorar.


function App() {
  const [selectedSongAnalysis, setSelectedSongAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSongClick = (albumTitle, songTitle) => {
    setIsLoading(true);
    setSelectedSongAnalysis(null);
    
    axios.get(`${API_URL}/api/analyze/${albumTitle}/${songTitle}`)
      .then(response => {
        setSelectedSongAnalysis(response.data);
      })
      .catch(error => {
        console.error("Hubo un error al analizar la canción:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="App">
      <h1>Analizador de Sentimientos de Letras de Linkin Park</h1>
      
      {isLoading && <p>Analizando...</p>}
      {selectedSongAnalysis && (
        <div className="analysis-result">
          <h2>Análisis de: "{selectedSongAnalysis.song}"</h2>
          <div className="chart-container">
            <AnalysisChart sentiment={selectedSongAnalysis.sentiment} />
          </div>
        </div>
      )}

      <div className="albums-container">
        {mockAlbums.map(album => (
          <div key={album.albumTitle} className="album-card">
            <img src={album.cover} alt={album.albumTitle} className="album-cover" />
            <h3 className="album-title">{album.albumTitle}</h3>
            <p className="album-year">{album.year}</p>
            <ul className="song-list">
              {album.songs.map(song => (
                <li key={song.title} className="song-item" onClick={() => handleSongClick(album.albumTitle, song.title)}>
                  {song.title}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;