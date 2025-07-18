import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnalysisChart from './components/AnalysisChart';
import './App.css';

// La URL base de nuestra API de Flask
const API_URL = 'https://linkin-park-api.onrender.com';

function App() {
  const [albums, setAlbums] = useState([]); // Estado para guardar los datos de la API
  const [selectedSongAnalysis, setSelectedSongAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // useEffect se ejecuta una vez para cargar todos los datos de los álbumes
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

  const handleSongClick = (albumTitle, songTitle) => {
    setIsLoading(true);
    setSelectedSongAnalysis(null);
    setError('');

    axios.get(`${API_URL}/api/analyze/${albumTitle}/${songTitle}`)
      .then(response => {
        setSelectedSongAnalysis(response.data);
      })
      .catch(error => {
        console.error("Hubo un error al analizar la canción:", error);
        setError('No se pudo analizar la canción.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="App">
      <h1>Analizador de Sentimientos de Letras de Linkin Park</h1>
      
      {isLoading && <p>Analizando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {selectedSongAnalysis && (
        <div className="analysis-result">
          <h2>Análisis de: "{selectedSongAnalysis.song}"</h2>
          <div className="chart-container">
            <AnalysisChart sentiment={selectedSongAnalysis.sentiment} />
          </div>
        </div>
      )}

      <div className="albums-container">
        {albums.map(album => (
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